import { existsSync, readFileSync } from "node:fs";
import http from "node:http";
import Stripe from "stripe";
import webpush from "web-push";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

loadDotEnv();

const port = Number(process.env.PORT || 4000);

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@gametracker.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

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

    // Fire push notifications for notable events (non-blocking)
    const evtType = event.eventType;
    const runsScored = Number(event.runsScored || 0);
    if (evtType === 'plate_appearance' && runsScored > 0) {
      const teamName = event.teamProfile?.name || 'Your team';
      sendPushToGameSubscribers(gameId, {
        title: `${teamName} scores!`,
        body: `${event.label || 'Run scored'} — ${runsScored} run${runsScored > 1 ? 's' : ''}`,
        tag: `run-${gameId}`,
        url: `/fan?game=${encodeURIComponent(gameId)}`,
      }).catch(() => {});
    }
    if (evtType === 'game_over') {
      sendPushToGameSubscribers(gameId, {
        title: 'Final Score',
        body: event.label || 'The game has ended.',
        tag: `gameover-${gameId}`,
        url: `/fan?game=${encodeURIComponent(gameId)}`,
      }).catch(() => {});
    }

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

async function getMySeasons(req, res) {
  try {
    const user = await requireUser(req);
    const owned = await getDb().collection('seasons')
      .where('ownerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    const invited = await getDb().collection('seasons')
      .where('coachIds', 'array-contains', user.uid)
      .limit(50)
      .get();
    const seen = new Set();
    const seasons = [];
    owned.forEach(doc => {
      seen.add(doc.id);
      const d = serializeFirestoreValue(doc.data());
      seasons.push({ id: doc.id, role: 'owner', teamProfile: d.teamProfile || {}, createdAt: d.createdAt || null });
    });
    invited.forEach(doc => {
      if (seen.has(doc.id)) return;
      const d = serializeFirestoreValue(doc.data());
      const member = (d.coaches || []).find(c => c.uid === user.uid);
      seasons.push({ id: doc.id, role: member?.role || 'coach', teamProfile: d.teamProfile || {}, createdAt: d.createdAt || null });
    });
    return sendJson(res, 200, { seasons });
  } catch (err) {
    const denied = /token|required/i.test(err.message);
    return sendJson(res, denied ? 403 : 400, { error: err.message });
  }
}

async function createSeason(req, res) {
  try {
    const user = await requireUser(req);
    const body = await readBody(req);
    const name = (body.name || '').trim();
    if (!name) return sendJson(res, 400, { error: 'Team name required' });
    const seasonId = `${user.uid.slice(0, 8)}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24)}-${Date.now().toString(36)}`;
    await getDb().collection('seasons').doc(seasonId).set({
      ownerId: user.uid,
      coachIds: [],
      coaches: [],
      teamProfile: {
        name,
        sport: body.sport || 'Baseball',
        ageGroup: body.ageGroup || 'Varsity',
        location: body.location || '',
        privacy: 'Public',
      },
      visibility: 'public',
      roster: [],
      schedule: [],
      createdAt: FieldValue.serverTimestamp(),
    });
    return sendJson(res, 201, { id: seasonId, name });
  } catch (err) {
    const denied = /token|required/i.test(err.message);
    return sendJson(res, denied ? 403 : 400, { error: err.message });
  }
}

async function deleteSeason(req, res, seasonId) {
  try {
    const user = await requireUser(req);
    const snap = await getDb().collection('seasons').doc(seasonId).get();
    if (!snap.exists) return sendJson(res, 404, { error: 'Season not found' });
    if (snap.data().ownerId !== user.uid) return sendJson(res, 403, { error: 'Only the owner can delete a season' });
    await getDb().collection('seasons').doc(seasonId).delete();
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    const denied = /token|required/i.test(err.message);
    return sendJson(res, denied ? 403 : 400, { error: err.message });
  }
}

async function inviteCoach(req, res, seasonId) {
  try {
    const user = await requireUser(req);
    const snap = await getDb().collection('seasons').doc(seasonId).get();
    if (!snap.exists) return sendJson(res, 404, { error: 'Season not found' });
    const season = snap.data();
    if (season.ownerId !== user.uid) return sendJson(res, 403, { error: 'Only owner can invite coaches' });
    const body = await readBody(req);
    const email = (body.email || '').trim().toLowerCase();
    const role = ['coach', 'scorekeeper', 'assistant'].includes(body.role) ? body.role : 'coach';
    if (!email) return sendJson(res, 400, { error: 'Email required' });
    let invitedUid = null;
    try {
      const invitedUser = await getAuth().getUserByEmail(email);
      invitedUid = invitedUser.uid;
    } catch { }
    const coaches = Array.isArray(season.coaches) ? season.coaches : [];
    if (coaches.find(c => c.email === email)) return sendJson(res, 409, { error: 'Already invited' });
    const newCoach = { email, role, uid: invitedUid, invitedAt: new Date().toISOString(), invitedBy: user.uid };
    const coachIds = Array.isArray(season.coachIds) ? season.coachIds : [];
    await getDb().collection('seasons').doc(seasonId).update({
      coaches: [...coaches, newCoach],
      coachIds: invitedUid ? [...coachIds, invitedUid] : coachIds,
    });
    return sendJson(res, 200, { ok: true, coach: newCoach });
  } catch (err) {
    const denied = /token|required/i.test(err.message);
    return sendJson(res, denied ? 403 : 400, { error: err.message });
  }
}

async function removeCoach(req, res, seasonId) {
  try {
    const user = await requireUser(req);
    const snap = await getDb().collection('seasons').doc(seasonId).get();
    if (!snap.exists) return sendJson(res, 404, { error: 'Season not found' });
    const season = snap.data();
    if (season.ownerId !== user.uid) return sendJson(res, 403, { error: 'Only owner can remove coaches' });
    const body = await readBody(req);
    const email = (body.email || '').trim().toLowerCase();
    const coaches = (season.coaches || []).filter(c => c.email !== email);
    const coachIds = (season.coachIds || []).filter(id => {
      const removed = (season.coaches || []).find(c => c.email === email);
      return !removed || id !== removed.uid;
    });
    await getDb().collection('seasons').doc(seasonId).update({ coaches, coachIds });
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    const denied = /token|required/i.test(err.message);
    return sendJson(res, denied ? 403 : 400, { error: err.message });
  }
}

async function getPublicSeasonPage(res, seasonId) {
  try {
    const seasonSnap = await getDb().collection("seasons").doc(seasonId).get();
    if (!seasonSnap.exists) {
      return sendJson(res, 404, { error: "Season not found" });
    }
    const season = serializeFirestoreValue(seasonSnap.data());
    if (season.visibility === "private") {
      return sendJson(res, 403, { error: "This team page is private" });
    }
    return sendJson(res, 200, {
      roster: season.roster || [],
      schedule: season.schedule || [],
      teamProfile: season.teamProfile || {},
      branding: season.branding || {},
    });
  } catch (error) {
    console.error("Public season page error:", error);
    return sendJson(res, 500, { error: "Could not load team page" });
  }
}

async function getDiscoveryFeed(res, requestUrl) {
  try {
    const params = requestUrl.searchParams;
    const position = params.get('position') || '';
    const classYear = params.get('classYear') || '';
    const sport = params.get('sport') || '';
    const status = params.get('status') || '';

    const snap = await getDb().collection('seasons')
      .where('teamProfile.privacy', '!=', 'Private')
      .limit(200)
      .get();

    const players = [];
    snap.forEach(doc => {
      const season = serializeFirestoreValue(doc.data());
      if (season.visibility === 'private') return;
      const tp = season.teamProfile || {};
      const roster = season.roster || [];
      roster.forEach(p => {
        if (!p.firstName && !p.lastName) return;
        if (position && p.primaryPosition !== position) return;
        if (classYear && String(p.classYear) !== String(classYear)) return;
        if (sport && tp.sport !== sport) return;
        if (status && p.recruitingStatus !== status) return;

        const ab = Number(p.ab || 0);
        const hits = Number(p.hits || 0);
        const hr = Number(p.hr || 0);
        const rbi = Number(p.rbi || 0);
        const ip = Number(p.ip || 0);
        const er = Number(p.er || 0);
        const so = Number(p.strikeouts || 0);
        players.push({
          id: p.id,
          seasonId: doc.id,
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          jersey: p.jersey || '',
          primaryPosition: p.primaryPosition || '',
          classYear: p.classYear || '',
          height: p.height || '',
          weight: p.weight || '',
          gpa: p.gpa || '',
          bats: p.bats || '',
          throws: p.throws || '',
          recruitingStatus: p.recruitingStatus || 'Open',
          committedSchool: p.committedSchool || '',
          highlightUrl: p.highlightUrl || '',
          playerEmail: p.playerEmail || '',
          coachNotes: p.coachNotes || '',
          teamName: tp.name || '',
          teamSport: tp.sport || 'Baseball',
          teamLocation: tp.location || '',
          teamAgeGroup: tp.ageGroup || '',
          season: doc.id,
          avg: ab ? hits / ab : 0,
          hr, rbi, so,
          era: ip ? (er * 9) / ip : null,
          ab, hits, ip,
        });
      });
    });

    players.sort((a, b) => b.avg - a.avg);
    return sendJson(res, 200, { players: players.slice(0, 150) });
  } catch (err) {
    console.error('Discovery feed error:', err);
    return sendJson(res, 500, { error: 'Could not load discovery feed' });
  }
}

async function getPublicPlayerProfile(res, seasonId, playerId) {
  try {
    const seasonSnap = await getDb().collection("seasons").doc(seasonId).get();
    if (!seasonSnap.exists) return sendJson(res, 404, { error: "Season not found" });
    const season = serializeFirestoreValue(seasonSnap.data());
    if (season.visibility === "private") return sendJson(res, 403, { error: "Private team" });
    const roster = season.roster || [];
    const player = roster.find(p => String(p.id) === String(playerId));
    if (!player) return sendJson(res, 404, { error: "Player not found" });
    return sendJson(res, 200, {
      player,
      teamProfile: season.teamProfile || {},
      schedule: season.schedule || [],
      roster: roster.map(p => ({ id: p.id, firstName: p.firstName, lastName: p.lastName, jersey: p.jersey, primaryPosition: p.primaryPosition })),
    });
  } catch (err) {
    console.error("Player profile error:", err);
    return sendJson(res, 500, { error: "Could not load player profile" });
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

  const publicSeasonMatch = requestUrl.pathname.match(/^\/api\/public\/seasons\/([^/]+)$/);
  if (req.method === "GET" && publicSeasonMatch) {
    return getPublicSeasonPage(res, decodeURIComponent(publicSeasonMatch[1]));
  }

  const publicPlayerMatch = requestUrl.pathname.match(/^\/api\/public\/seasons\/([^/]+)\/players\/([^/]+)$/);
  if (req.method === "GET" && publicPlayerMatch) {
    return getPublicPlayerProfile(res, decodeURIComponent(publicPlayerMatch[1]), decodeURIComponent(publicPlayerMatch[2]));
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/public/discover") {
    return getDiscoveryFeed(res, requestUrl);
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

  if (req.method === "GET" && requestUrl.pathname === "/api/my-seasons") {
    return getMySeasons(req, res);
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/seasons") {
    return createSeason(req, res);
  }

  const deleteSeasonMatch = requestUrl.pathname.match(/^\/api\/seasons\/([^/]+)$/);
  if (req.method === "DELETE" && deleteSeasonMatch) {
    return deleteSeason(req, res, decodeURIComponent(deleteSeasonMatch[1]));
  }

  const inviteCoachMatch = requestUrl.pathname.match(/^\/api\/seasons\/([^/]+)\/invite$/);
  if (req.method === "POST" && inviteCoachMatch) {
    return inviteCoach(req, res, decodeURIComponent(inviteCoachMatch[1]));
  }

  const removeCoachMatch = requestUrl.pathname.match(/^\/api\/seasons\/([^/]+)\/remove-coach$/);
  if (req.method === "POST" && removeCoachMatch) {
    return removeCoach(req, res, decodeURIComponent(removeCoachMatch[1]));
  }

  // Push subscription endpoints
  const pushSubMatch = requestUrl.pathname.match(/^\/api\/games\/([^/]+)\/push-subscribe$/);
  if (req.method === "POST" && pushSubMatch) {
    const gameId = decodeURIComponent(pushSubMatch[1]);
    try {
      const body = await readBody(req);
      const subscription = JSON.parse(body);
      await getDb().collection("games").doc(gameId)
        .collection("pushSubscriptions").add({ subscription, createdAt: FieldValue.serverTimestamp() });
      return sendJson(res, 200, { ok: true });
    } catch (e) { return sendJson(res, 400, { error: "Bad subscription" }); }
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/vapid-public-key") {
    return sendJson(res, 200, { publicKey: process.env.VAPID_PUBLIC_KEY || null });
  }

  return sendJson(res, 404, { error: "Not found" });
});

async function sendPushToGameSubscribers(gameId, payload) {
  if (!process.env.VAPID_PUBLIC_KEY) return;
  try {
    const snap = await getDb().collection("games").doc(gameId)
      .collection("pushSubscriptions").limit(200).get();
    const sends = snap.docs.map(async (d) => {
      try {
        await webpush.sendNotification(d.data().subscription, JSON.stringify(payload));
      } catch (e) {
        if (e.statusCode === 410 || e.statusCode === 404) await d.ref.delete();
      }
    });
    await Promise.allSettled(sends);
  } catch (e) { console.error('Push error:', e.message); }
}

server.listen(port, () => {
  console.log(`GameTracker backend running on http://localhost:${port}`);
  if (allowLocalAuthWrites) {
    console.log("Local practice mode: signed-in coach writes are allowed on this laptop.");
  }
});
