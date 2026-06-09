import { existsSync, readFileSync } from "node:fs";
import http from "node:http";
import Stripe from "stripe";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

loadDotEnv();

const port = Number(process.env.PORT || 4000);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId = process.env.STRIPE_PRICE_ID;
const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID || stripePriceId;
const stripeOrgPriceId = process.env.STRIPE_ORG_PRICE_ID || stripePriceId;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const firebaseServiceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const firebaseServiceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const allowLocalAuthWrites =
  process.env.NODE_ENV !== "production" &&
  process.env.ALLOW_LOCAL_AUTH_WRITES !== "false";
let db;

function isAllowedOrigin(origin) {
  if (!origin) return clientUrl;

  try {
    const parsed = new URL(origin);
    if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
      return origin;
    }
  } catch {
    return clientUrl;
  }

  return origin === clientUrl ? origin : clientUrl;
}

function getDb() {
  if (db) return db;

  let serviceAccount;

  if (firebaseServiceAccountJson) {
    serviceAccount = JSON.parse(firebaseServiceAccountJson);
  } else if (firebaseServiceAccountPath) {
    serviceAccount = JSON.parse(readFileSync(firebaseServiceAccountPath, "utf8"));
  } else {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env"
    );
  }

  initializeApp({
    credential: cert(serviceAccount),
  });

  db = getFirestore();
  return db;
}

function loadDotEnv() {
  if (!existsSync(".env")) return;

  const lines = readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed
      .slice(equalsIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": isAllowedOrigin(res.req?.headers.origin),
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(data));
}

function serializeFirestoreValue(value) {
  if (!value) return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serializeFirestoreValue);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeFirestoreValue(item)])
    );
  }
  return value;
}

async function requireUser(req) {
  getDb();

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    throw new Error("Missing Firebase ID token");
  }

  return getAuth().verifyIdToken(token);
}

async function requireGameCoach(uid, gameId) {
  const gameRef = getDb().collection("games").doc(gameId);
  const gameSnap = await gameRef.get();

  if (!gameSnap.exists) {
    throw new Error("Game not found");
  }

  const game = gameSnap.data();
  const teamSnap = await getDb().collection("teams").doc(game.teamId).get();
  const team = teamSnap.exists ? teamSnap.data() : {};
  const memberIds = Array.isArray(team.memberIds) ? team.memberIds : [];
  const members = Array.isArray(team.members) ? team.members : [];
  const isOwner = team.owner === uid || team.ownerId === uid || game.ownerId === uid;
  const isMemberId = memberIds.includes(uid);
  const isCoachMember = members.some(
    (member) => member.uid === uid && ["coach", "admin", "owner"].includes(String(member.role || "").toLowerCase())
  );
  let isTeamMemberDoc = false;

  if (teamSnap.exists && game.teamId) {
    const membershipDoc = await getDb()
      .collection("teamMembers")
      .doc(`${game.teamId}_${uid}`)
      .get();

    if (membershipDoc.exists) {
      const membership = membershipDoc.data();
      isTeamMemberDoc = ["coach", "admin", "owner"].includes(String(membership.role || "").toLowerCase());
    }
  }

  if (!teamSnap.exists || !(isOwner || isMemberId || isCoachMember || isTeamMemberDoc)) {
    if (allowLocalAuthWrites) {
      console.warn(
        `Local development write allowed for uid ${uid} on game ${gameId}. Tighten this before production.`
      );
      return { gameRef, game };
    }

    throw new Error("Coach access required");
  }

  return { gameRef, game };
}

async function saveGameState(req, res, gameId) {
  try {
    const user = await requireUser(req);
    let gameRef;

    if (allowLocalAuthWrites) {
      gameRef = getDb().collection("games").doc(gameId);
    } else {
      ({ gameRef } = await requireGameCoach(user.uid, gameId));
    }

    const state = await readBody(req);

    await gameRef.set(
      {
        ...state,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: user.uid,
      },
      { merge: true }
    );

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    const denied = /token|required|access/i.test(error.message);
    return sendJson(res, denied ? 403 : 400, { error: error.message });
  }
}

async function appendGameEvent(req, res, gameId) {
  try {
    const user = await requireUser(req);
    let gameRef;
    let game;

    if (allowLocalAuthWrites) {
      gameRef = getDb().collection("games").doc(gameId);
      const gameSnap = await gameRef.get();
      game = gameSnap.exists ? gameSnap.data() : {};
    } else {
      ({ gameRef, game } = await requireGameCoach(user.uid, gameId));
    }

    const event = await readBody(req);
    let eventId;

    await getDb().runTransaction(async (transaction) => {
      const freshGame = await transaction.get(gameRef);
      const sequence = Number(freshGame.data()?.eventSequence || 0) + 1;
      const eventRef = gameRef.collection("events").doc();
      eventId = eventRef.id;

      transaction.set(eventRef, {
        ...event,
        gameId,
        teamId: game.teamId,
        sequence,
        createdBy: user.uid,
        createdAt: FieldValue.serverTimestamp(),
      });
      transaction.update(gameRef, {
        eventSequence: sequence,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: user.uid,
      });
    });

    return sendJson(res, 201, { id: eventId });
  } catch (error) {
    const denied = /token|required|access/i.test(error.message);
    return sendJson(res, denied ? 403 : 400, { error: error.message });
  }
}

async function saveSeasonRoster(req, res, seasonId) {
  try {
    const user = await requireUser(req);
    const body = await readBody(req);

    if (!Array.isArray(body.roster)) {
      return sendJson(res, 400, { error: "Roster must be an array" });
    }

    await getDb()
      .collection("seasons")
      .doc(seasonId)
      .set(
        {
          roster: body.roster,
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: user.uid,
        },
        { merge: true }
      );

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    const denied = /token|required|access/i.test(error.message);
    return sendJson(res, denied ? 403 : 400, { error: error.message });
  }
}

async function getPublicGameStream(res, gameId) {
  try {
    const gameRef = getDb().collection("games").doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return sendJson(res, 404, { error: "Game not found" });
    }

    const game = { id: gameSnap.id, ...serializeFirestoreValue(gameSnap.data()) };

    const eventsSnap = await gameRef
      .collection("events")
      .orderBy("sequence", "desc")
      .limit(50)
      .get();

    const events = eventsSnap.docs.map((eventDoc) => ({
      id: eventDoc.id,
      ...serializeFirestoreValue(eventDoc.data()),
    }));

    const seasonId = game.teamProfile?.season || "2025–2026";
    const seasonSnap = await getDb().collection("seasons").doc(seasonId).get();
    const season = seasonSnap.exists ? serializeFirestoreValue(seasonSnap.data()) : {};

    return sendJson(res, 200, {
      game,
      events,
      roster: season.roster || [],
      schedule: season.schedule || [],
      teamProfile: season.teamProfile || game.teamProfile || null,
      brandingLogo: season.branding_logo || season.branding?.logo || null,
    });
  } catch (error) {
    console.error("Public game stream error:", error);
    return sendJson(res, 500, { error: "Could not load game stream" });
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
}

async function createCheckoutSession({ uid, email, tier = "pro" }) {
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY in .env");
  }

  const priceId = tier === "org" ? stripeOrgPriceId : stripeProPriceId;

  if (!priceId) {
    throw new Error("Missing Stripe price ID in .env");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    client_reference_id: uid,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { uid, tier },
    subscription_data: { metadata: { uid, tier } },
    success_url: `${clientUrl}?checkout=success&tier=${tier}`,
    cancel_url: `${clientUrl}?checkout=canceled`,
  });

  return session;
}

async function getUserPlan(req, res) {
  try {
    const user = await requireUser(req);
    const userDoc = await getDb().collection("users").doc(user.uid).get();
    const plan = userDoc.exists ? (userDoc.data().plan || "free") : "free";
    const tier = userDoc.exists ? (userDoc.data().tier || plan) : "free";
    return sendJson(res, 200, { plan, tier });
  } catch (error) {
    const denied = /token|required/i.test(error.message);
    return sendJson(res, denied ? 403 : 400, { error: error.message });
  }
}

async function markUserProFromCheckoutSession(session) {
  const uid = session.metadata?.uid || session.client_reference_id;
  const tier = session.metadata?.tier || "pro";

  if (!uid) {
    throw new Error("Stripe session missing uid metadata");
  }

  await getDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        plan: tier,
        tier,
        stripeCustomerId: session.customer || null,
        stripeSubscriptionId: session.subscription || null,
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
}

async function markUserFreeFromSubscription(subscription) {
  const uid = subscription.metadata?.uid;

  if (!uid) {
    console.warn("Stripe subscription event missing uid metadata");
    return;
  }

  await getDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        plan: "free",
        stripeSubscriptionStatus: subscription.status,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
}

async function handleStripeWebhook(req, res) {
  if (!stripe) {
    return sendJson(res, 500, { error: "Missing STRIPE_SECRET_KEY in .env" });
  }

  if (!stripeWebhookSecret) {
    return sendJson(res, 500, { error: "Missing STRIPE_WEBHOOK_SECRET in .env" });
  }

  const signature = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      stripeWebhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);
    return sendJson(res, 400, { error: "Webhook signature verification failed" });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await markUserProFromCheckoutSession(event.data.object);
    }

    if (event.type === "customer.subscription.deleted") {
      await markUserFreeFromSubscription(event.data.object);
    }

    return sendJson(res, 200, { received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return sendJson(res, 500, { error: "Webhook handler failed" });
  }
}

const server = http.createServer(async (req, res) => {
  res.req = req;

  if (req.method === "OPTIONS") {
    return sendJson(res, 200, {});
  }

  const requestUrl = new URL(req.url || "/", `http://localhost:${port}`);

  if (req.method === "GET" && requestUrl.pathname === "/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/user/plan") {
    return getUserPlan(req, res);
  }

  if (req.method === "POST" && requestUrl.pathname === "/create-checkout") {
    try {
      const user = await requireUser(req);
      const body = await readBody(req);
      const uid = user.uid;
      const email = user.email;
      const tier = body.tier || "pro";

      const session = await createCheckoutSession({ uid, email, tier });

      return sendJson(res, 200, { id: session.id });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return sendJson(res, 500, {
        error: error.message || "Could not create checkout session",
      });
    }
  }

  if (req.method === "POST" && requestUrl.pathname === "/stripe-webhook") {
    return handleStripeWebhook(req, res);
  }

  const publicGameStreamMatch = requestUrl.pathname.match(/^\/api\/public\/games\/([^/]+)\/stream$/);
  if (req.method === "GET" && publicGameStreamMatch) {
    return getPublicGameStream(res, decodeURIComponent(publicGameStreamMatch[1]));
  }

  const gameStateMatch = requestUrl.pathname.match(/^\/api\/games\/([^/]+)\/state$/);
  if (req.method === "POST" && gameStateMatch) {
    return saveGameState(req, res, decodeURIComponent(gameStateMatch[1]));
  }

  const gameEventMatch = requestUrl.pathname.match(/^\/api\/games\/([^/]+)\/events$/);
  if (req.method === "POST" && gameEventMatch) {
    return appendGameEvent(req, res, decodeURIComponent(gameEventMatch[1]));
  }

  const seasonRosterMatch = requestUrl.pathname.match(/^\/api\/seasons\/([^/]+)\/roster$/);
  if (req.method === "POST" && seasonRosterMatch) {
    return saveSeasonRoster(req, res, decodeURIComponent(seasonRosterMatch[1]));
  }

  return sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`GameTracker backend running on http://localhost:${port}`);
  if (allowLocalAuthWrites) {
    console.log("Local practice mode: signed-in coach writes are allowed on this laptop.");
  }
});
