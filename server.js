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
const stripeProAnnualPriceId = process.env.STRIPE_PRO_ANNUAL_PRICE_ID || '';
const stripeOrgAnnualPriceId = process.env.STRIPE_ORG_ANNUAL_PRICE_ID || '';
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

async function createCheckoutSession({ uid, email, tier = "pro", billingCycle = "monthly", couponCode = null }) {
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY in .env");
  }

  let priceId;
  if (billingCycle === "annual") {
    priceId = tier === "org" ? (stripeOrgAnnualPriceId || stripeOrgPriceId) : (stripeProAnnualPriceId || stripeProPriceId);
  } else {
    priceId = tier === "org" ? stripeOrgPriceId : stripeProPriceId;
  }

  if (!priceId) {
    throw new Error("Missing Stripe price ID in .env");
  }

  let discounts = [];
  if (couponCode && stripe) {
    try {
      // Try to retrieve the coupon by code
      const coupons = await stripe.coupons.list({ limit: 100 });
      const coupon = coupons.data.find(c => c.metadata?.code === couponCode.toUpperCase());
      if (coupon) {
        discounts = [{ coupon: coupon.id }];
      }
    } catch (e) {
      console.error('Coupon lookup failed:', e);
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    client_reference_id: uid,
    line_items: [{ price: priceId, quantity: 1 }],
    discounts,
    metadata: { uid, tier, ...(couponCode && { couponCode }) },
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

async function handleReferralReward(session) {
  const uid = session.metadata?.uid || session.client_reference_id;
  if (!uid) return;
  // Check if this user was referred
  const referredUserDoc = await getDb().collection("users").doc(uid).get();
  const referredBy = referredUserDoc.exists ? referredUserDoc.data().referredBy : null;
  if (!referredBy) return;
  // Find the referrer by code
  const referrerQuery = await getDb().collection("users").where("referralCode", "==", referredBy).limit(1).get();
  if (referrerQuery.empty) return;
  const referrerDoc = referrerQuery.docs[0];
  const referrerId = referrerDoc.id;
  // Find and update the referral record
  const referralQuery = await getDb().collection("referrals")
    .where("referrerId", "==", referrerId)
    .where("referredId", "==", uid)
    .where("status", "==", "pending")
    .limit(1)
    .get();
  if (referralQuery.empty) return;
  const referralDoc = referralQuery.docs[0];
  // Apply 1-month credit via Stripe
  const referrerCustomerId = referrerDoc.data().stripeCustomerId || (await getDb().collection("users").doc(referrerId).get()).data()?.stripeCustomerId;
  if (referrerCustomerId && stripe) {
    try {
      // Create a 100% off coupon for 1 month
      const coupon = await stripe.coupons.create({
        amount_off: 699, // $6.99 in cents
        currency: 'usd',
        duration: 'once',
        name: 'Referral Reward - 1 Month Free',
        metadata: { referralId: referralDoc.id }
      });
      // Apply coupon to referrer's subscription
      const subs = await stripe.subscriptions.list({ customer: referrerCustomerId, status: 'active', limit: 1 });
      if (subs.data.length > 0) {
        await stripe.subscriptions.update(subs.data[0].id, {
          coupon: coupon.id
        });
        // Mark referral as completed
        await getDb().collection("referrals").doc(referralDoc.id).update({
          status: "completed",
          rewardedAt: new Date().toISOString(),
          rewardCouponId: coupon.id
        });
        console.log(`Referral reward applied: 1 month free to ${referrerId}`);
      }
    } catch (e) {
      console.error('Failed to apply referral reward:', e);
    }
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
      // Handle referral reward
      await handleReferralReward(event.data.object);
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

  if (req.method === "GET" && requestUrl.pathname === "/api/user/limits") {
    try {
      const user = await requireUser(req);
      const userDoc = await getDb().collection("users").doc(user.uid).get();
      const plan = userDoc.exists ? (userDoc.data().plan || "free") : "free";
      const limits = {
        free:  { maxGames: 3,  maxTeams: 1,  recruiting: false, pushNotifications: false, pdfReports: false, advancedStats: false },
        pro:   { maxGames: -1, maxTeams: -1, recruiting: true,  pushNotifications: true,  pdfReports: true,  advancedStats: true  },
        org:   { maxGames: -1, maxTeams: -1, recruiting: true,  pushNotifications: true,  pdfReports: true,  advancedStats: true  },
      };
      const seasonsSnap = await getDb().collection("seasons").where("teamId", "==", user.uid).limit(10).get();
      let gamesPlayed = 0;
      seasonsSnap.forEach(doc => { gamesPlayed += (doc.data().schedule || []).length; });
      return sendJson(res, 200, { plan, limits: limits[plan] || limits.free, gamesPlayed });
    } catch (error) {
      return sendJson(res, 403, { error: error.message });
    }
  }

  if (req.method === "POST" && requestUrl.pathname === "/create-checkout") {
    try {
      const user = await requireUser(req);
      const body = await readBody(req);
      const uid = user.uid;
      const email = user.email;
      const tier = body.tier || "pro";
      const billingCycle = body.billingCycle || "monthly";
      const couponCode = body.couponCode || null;

      const session = await createCheckoutSession({ uid, email, tier, billingCycle, couponCode });

      return sendJson(res, 200, { id: session.id });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return sendJson(res, 500, {
        error: error.message || "Could not create checkout session",
      });
    }
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/user/referral") {
    try {
      const user = await requireUser(req);
      const uid = user.uid;
      const userDoc = await getDb().collection("users").doc(uid);
      const snapshot = await userDoc.get();
      let referralCode = snapshot.exists ? snapshot.data().referralCode : null;
      if (!referralCode) {
        // Generate a unique 6-char code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        let exists = true;
        let attempts = 0;
        while (exists && attempts < 10) {
          code = '';
          for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          const existing = await getDb().collection("users").where("referralCode", "==", code).limit(1).get();
          exists = !existing.empty;
          attempts++;
        }
        if (exists) throw new Error("Failed to generate unique referral code");
        referralCode = code;
        await userDoc.set({ referralCode }, { merge: true });
      }
      return sendJson(res, 200, { referralCode });
    } catch (error) {
      console.error("Referral error:", error);
      return sendJson(res, 500, { error: error.message });
    }
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/user/referral-claim") {
    try {
      const user = await requireUser(req);
      const body = await readBody(req);
      const { referralCode } = body;
      if (!referralCode || typeof referralCode !== 'string' || referralCode.length !== 6) {
        return sendJson(res, 400, { error: "Invalid referral code" });
      }
      // Find referrer by code
      const refQuery = await getDb().collection("users").where("referralCode", "==", referralCode).limit(1).get();
      if (refQuery.empty) {
        return sendJson(res, 404, { error: "Referral code not found" });
      }
      const referrerDoc = refQuery.docs[0];
      const referrerId = referrerDoc.id;
      const referredId = user.uid;
      // Prevent self-referral
      if (referrerId === referredId) {
        return sendJson(res, 400, { error: "Cannot refer yourself" });
      }
      // Store referral relationship
      await getDb().collection("referrals").add({
        referrerId,
        referredId,
        referralCode,
        claimedAt: new Date().toISOString(),
        status: "pending" // pending until referred user upgrades
      });
      // Mark referral on referred user
      await getDb().collection("users").doc(referredId).set({ referredBy: referralCode }, { merge: true });
      return sendJson(res, 200, { success: true });
    } catch (error) {
      console.error("Referral claim error:", error);
      return sendJson(res, 500, { error: error.message });
    }
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/user/subscribe-push") {
    try {
      const user = await requireUser(req);
      const body = await readBody(req);
      const { subscription } = body;
      if (!subscription) {
        return sendJson(res, 400, { error: "Missing subscription data" });
      }
      // Store subscription in Firebase
      await getDb().collection("pushSubscriptions").doc(user.uid).set({
        subscription,
        createdAt: new Date().toISOString(),
        userAgent: req.headers["user-agent"]
      });
      return sendJson(res, 200, { success: true });
    } catch (error) {
      console.error("Push subscription error:", error);
      return sendJson(res, 500, { error: error.message });
    }
  }

  if (req.method === "POST" && requestUrl.pathname === "/create-portal") {
    try {
      const user = await requireUser(req);
      const userDoc = await getDb().collection("users").doc(user.uid).get();
      const customerId = userDoc.exists ? userDoc.data().stripeCustomerId : null;
      if (!customerId) {
        return sendJson(res, 400, { error: "No Stripe customer found. Please upgrade first." });
      }
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${clientUrl}/?tab=upgrade`,
      });
      return sendJson(res, 200, { url: session.url });
    } catch (error) {
      console.error("Portal error:", error);
      return sendJson(res, 500, { error: error.message });
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

// ─────────────────────────────────────────────────────────────────────────────
// 📧 MARKETING AUTOMATION
// ─────────────────────────────────────────────────────────────────────────────

// Email templates
const emailTemplates = {
  welcome: {
    subject: 'Welcome to GameTracker! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
          <h1>⚾ Welcome to GameTracker!</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2>Get Started with Your Team</h2>
          <p>Thanks for joining GameTracker! Here's how to get the most out of your new account:</p>
          <ul>
            <li>✅ Set up your team profile</li>
            <li>✅ Add your roster</li>
            <li>✅ Score your first game</li>
            <li>✅ Share stats with families</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Get Started Now
            </a>
          </div>
        </div>
      </div>
    `
  },
  engagement: {
    subject: 'Time to update your GameTracker stats! 📊',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>📈 Keep Your Stats Fresh!</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>It's been a while since you've updated your team stats on GameTracker.</p>
          <p>Keeping your stats current helps:</p>
          <ul>
            <li>🎯 Track player development</li>
            <li>📊 Share progress with families</li>
            <li>🏆 Build recruiting profiles</li>
            <li>📱 Keep fans engaged</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Update Your Stats
            </a>
          </div>
        </div>
      </div>
    `
  },
  upgrade: {
    subject: 'Unlock Pro Features with GameTracker+ 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7c3aed; color: white; padding: 20px; text-align: center;">
          <h1>⭐ Upgrade to Pro</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Ready to take your team to the next level? GameTracker Pro includes:</p>
          <ul>
            <li>🎯 Advanced analytics & spray charts</li>
            <li>📹 Live video streaming</li>
            <li>🏟️ Tournament management</li>
            <li>💬 Team communication</li>
            <li>📊 Data export & reports</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/upgrade" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Upgrade Now
            </a>
          </div>
        </div>
      </div>
    `
  }
};

// Send email function
async function sendEmail(to, template, data = {}) {
  try {
    // In production, integrate with SendGrid, Mailgun, or similar
    console.log(`Sending email to ${to}: ${template.subject}`);
    
    // For demo purposes, just log the email
    const personalizedHtml = template.html.replace(/\$\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
    
    console.log('Email content:', personalizedHtml);
    
    // Simulate email send delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

// Marketing automation endpoints
app.post('/api/marketing/send-welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await sendEmail(email, emailTemplates.welcome, { name });
    
    if (result.success) {
      res.json({ message: 'Welcome email sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

app.post('/api/marketing/send-engagement', async (req, res) => {
  try {
    const { email, name, lastActive } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await sendEmail(email, emailTemplates.engagement, { name, lastActive });
    
    if (result.success) {
      res.json({ message: 'Engagement email sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Engagement email error:', error);
    res.status(500).json({ error: 'Failed to send engagement email' });
  }
});

app.post('/api/marketing/send-upgrade', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await sendEmail(email, emailTemplates.upgrade, { name });
    
    if (result.success) {
      res.json({ message: 'Upgrade email sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Upgrade email error:', error);
    res.status(500).json({ error: 'Failed to send upgrade email' });
  }
});

// Campaign management
app.get('/api/marketing/campaigns', async (req, res) => {
  try {
    // Mock campaign data
    const campaigns = [
      {
        id: 'welcome-series',
        name: 'Welcome Series',
        description: 'Onboarding emails for new users',
        status: 'active',
        sent: 245,
        opened: 189,
        clicked: 67
      },
      {
        id: 'engagement-boost',
        name: 'Engagement Boost',
        description: 'Re-engage inactive users',
        status: 'active',
        sent: 128,
        opened: 45,
        clicked: 12
      },
      {
        id: 'pro-upgrade',
        name: 'Pro Upgrade Campaign',
        description: 'Convert free users to Pro',
        status: 'active',
        sent: 89,
        opened: 34,
        clicked: 8
      }
    ];
    
    res.json(campaigns);
  } catch (error) {
    console.error('Campaigns fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Analytics for marketing
app.get('/api/marketing/analytics', async (req, res) => {
  try {
    // Mock analytics data
    const analytics = {
      totalUsers: 1847,
      activeUsers: 892,
      conversionRate: 23.4,
      emailStats: {
        sent: 462,
        delivered: 445,
        opened: 268,
        clicked: 87,
        unsubscribed: 3
      },
      campaignPerformance: [
        { name: 'Welcome Series', sent: 245, opened: 189, clicked: 67, conversion: 27.3 },
        { name: 'Engagement Boost', sent: 128, opened: 45, clicked: 12, conversion: 9.4 },
        { name: 'Pro Upgrade', sent: 89, opened: 34, clicked: 8, conversion: 9.0 }
      ],
      userGrowth: [
        { date: '2024-05-01', users: 1650 },
        { date: '2024-05-08', users: 1723 },
        { date: '2024-05-15', users: 1789 },
        { date: '2024-05-22', users: 1847 }
      ]
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 🔗 PARTNER INTEGRATIONS API
// ─────────────────────────────────────────────────────────────────────────────

// Partner API authentication middleware
const authenticatePartner = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // In production, validate against database of partner API keys
  const validApiKeys = [
    'pk_test_1234567890abcdef', // Test partner
    'pk_live_abcdef1234567890', // Production partner
  ];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  
  next();
};

// Partner integration endpoints
app.get('/api/partner/teams', authenticatePartner, async (req, res) => {
  try {
    const { limit = 50, offset = 0, sport } = req.query;
    
    let query = db.collection('teams').limit(parseInt(limit)).offset(parseInt(offset));
    
    if (sport) {
      query = query.where('sport', '==', sport);
    }
    
    const snapshot = await query.get();
    const teams = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().displayName,
      sport: doc.data().sport,
      location: doc.data().location,
      ageGroup: doc.data().ageGroup,
      type: doc.data().teamType,
      createdAt: doc.data().createdAt,
      playerCount: doc.data().rosterCount || 0
    }));
    
    res.json({
      teams,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: teams.length
      }
    });
  } catch (error) {
    console.error('Partner teams fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/partner/teams/:teamId/stats', authenticatePartner, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season } = req.query;
    
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const seasonData = teamDoc.data().seasons?.[season || '2024'] || {};
    
    const stats = {
      team: {
        name: teamDoc.data().displayName,
        sport: teamDoc.data().sport,
        season: season || '2024'
      },
      record: {
        wins: seasonData.wins || 0,
        losses: seasonData.losses || 0,
        gamesPlayed: seasonData.schedule?.length || 0
      },
      players: seasonData.roster?.map(player => ({
        id: player.id,
        name: player.name,
        number: player.number,
        position: player.primaryPosition,
        battingAvg: player.avg || 0,
        homeRuns: player.hr || 0,
        rbis: player.rbi || 0,
        era: player.era || 0,
        strikeouts: player.strikeouts || 0
      })) || []
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Partner team stats error:', error);
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
});

app.get('/api/partner/games', authenticatePartner, async (req, res) => {
  try {
    const { teamId, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    let query = db.collection('teams').limit(parseInt(limit));
    
    if (teamId) {
      query = query.where('teamId', '==', teamId);
    }
    
    const snapshot = await query.get();
    const games = [];
    
    snapshot.forEach(teamDoc => {
      const teamData = teamDoc.data();
      const seasons = teamData.seasons || {};
      
      Object.values(seasons).forEach(seasonData => {
        const schedule = seasonData.schedule || [];
        
        schedule.forEach(game => {
          const gameDate = new Date(game.date);
          
          if (startDate && gameDate < new Date(startDate)) return;
          if (endDate && gameDate > new Date(endDate)) return;
          
          games.push({
            id: `${teamDoc.id}_${game.date}`,
            teamId: teamDoc.id,
            teamName: teamData.displayName,
            opponent: game.opponent,
            date: game.date,
            location: game.location,
            result: game.result,
            score: game.score,
            status: game.status
          });
        });
      });
    });
    
    // Sort by date and paginate
    games.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginatedGames = games.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      games: paginatedGames,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: games.length
      }
    });
  } catch (error) {
    console.error('Partner games fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Webhook for external systems to push data to GameTracker
app.post('/api/partner/webhook/game-result', authenticatePartner, async (req, res) => {
  try {
    const { teamId, gameData } = req.body;
    
    if (!teamId || !gameData) {
      return res.status(400).json({ error: 'teamId and gameData are required' });
    }
    
    const teamRef = db.collection('teams').doc(teamId);
    const teamDoc = await teamRef.get();
    
    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Update game result in team's schedule
    const currentSeason = '2024'; // Could be dynamic
    const seasons = teamDoc.data().seasons || {};
    const schedule = seasons[currentSeason]?.schedule || [];
    
    const gameIndex = schedule.findIndex(g => g.date === gameData.date);
    if (gameIndex !== -1) {
      schedule[gameIndex] = { ...schedule[gameIndex], ...gameData };
    } else {
      schedule.push(gameData);
    }
    
    await teamRef.update({
      [`seasons.${currentSeason}.schedule`]: schedule
    });
    
    res.json({ message: 'Game result updated successfully' });
  } catch (error) {
    console.error('Webhook game result error:', error);
    res.status(500).json({ error: 'Failed to update game result' });
  }
});

// Partner API documentation endpoint
app.get('/api/partner/docs', (req, res) => {
  const docs = {
    title: 'GameTracker Partner API',
    version: 'v1',
    baseUrl: `${req.protocol}://${req.get('host')}/api/partner`,
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Include your partner API key in the X-API-Key header'
    },
    endpoints: [
      {
        method: 'GET',
        path: '/teams',
        description: 'Get list of teams',
        parameters: {
          limit: 'Number of teams to return (default: 50)',
          offset: 'Number of teams to skip (default: 0)',
          sport: 'Filter by sport (Baseball, Softball, etc.)'
        },
        response: 'Array of team objects with basic information'
      },
      {
        method: 'GET',
        path: '/teams/{teamId}/stats',
        description: 'Get team statistics and player data',
        parameters: {
          teamId: 'Team identifier',
          season: 'Season year (default: 2024)'
        },
        response: 'Team stats with player roster and performance data'
      },
      {
        method: 'GET',
        path: '/games',
        description: 'Get games across all teams',
        parameters: {
          teamId: 'Filter by specific team',
          startDate: 'Filter games from this date',
          endDate: 'Filter games until this date',
          limit: 'Number of games to return (default: 50)',
          offset: 'Number of games to skip (default: 0)'
        },
        response: 'Array of game objects with results and scores'
      },
      {
        method: 'POST',
        path: '/webhook/game-result',
        description: 'Update game results via webhook',
        body: {
          teamId: 'Team identifier',
          gameData: 'Game object with result, score, etc.'
        },
        response: 'Success confirmation'
      }
    ],
    rateLimit: {
      requests: '1000',
      period: 'hour',
      description: 'Maximum requests per hour per API key'
    },
    support: {
      email: 'partners@gametracker.com',
      documentation: 'https://docs.gametracker.com/api'
    }
  };
  
  res.json(docs);
});

// Rate limiting for partner API
const partnerRateLimit = new Map();
const checkRateLimit = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const now = Date.now();
  const hour = 60 * 60 * 1000; // 1 hour in milliseconds
  
  if (!partnerRateLimit.has(apiKey)) {
    partnerRateLimit.set(apiKey, { count: 1, resetTime: now + hour });
    return next();
  }
  
  const rateLimitData = partnerRateLimit.get(apiKey);
  
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 1;
    rateLimitData.resetTime = now + hour;
    return next();
  }
  
  if (rateLimitData.count >= 1000) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      resetTime: rateLimitData.resetTime 
    });
  }
  
  rateLimitData.count++;
  next();
};

// Apply rate limiting to all partner routes
app.use('/api/partner', checkRateLimit);

// ─────────────────────────────────────────────────────────────────────────────
// 🏢 MULTI-TENANT ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────

// Organization management endpoints
app.post('/api/organizations', async (req, res) => {
  try {
    const { name, description, adminEmail, plan = 'free' } = req.body;
    
    if (!name || !adminEmail) {
      return res.status(400).json({ error: 'Name and admin email are required' });
    }
    
    const orgData = {
      name,
      description,
      adminEmail,
      plan,
      createdAt: new Date().toISOString(),
      teamCount: 0,
      userCount: 1,
      settings: {
        allowPublicTeams: false,
        requireApprovalForNewTeams: true,
        defaultSeason: '2024'
      }
    };
    
    const orgRef = await db.collection('organizations').add(orgData);
    
    res.json({
      id: orgRef.id,
      ...orgData,
      message: 'Organization created successfully'
    });
  } catch (error) {
    console.error('Organization creation error:', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

app.get('/api/organizations/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    
    const orgDoc = await db.collection('organizations').doc(orgId).get();
    if (!orgDoc.exists) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    const orgData = orgDoc.data();
    
    // Get teams for this organization
    const teamsSnapshot = await db.collection('teams')
      .where('organizationId', '==', orgId)
      .get();
    
    const teams = teamsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().displayName,
      sport: doc.data().sport,
      ageGroup: doc.data().ageGroup,
      location: doc.data().location,
      createdAt: doc.data().createdAt,
      playerCount: doc.data().rosterCount || 0
    }));
    
    // Get users for this organization
    const usersSnapshot = await db.collection('users')
      .where('organizationId', '==', orgId)
      .get();
    
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      name: doc.data().name,
      role: doc.data().role || 'member',
      joinedAt: doc.data().joinedAt
    }));
    
    res.json({
      ...orgData,
      id: orgDoc.id,
      teams,
      users,
      teamCount: teams.length,
      userCount: users.length
    });
  } catch (error) {
    console.error('Organization fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Add team to organization
app.post('/api/organizations/:orgId/teams', async (req, res) => {
  try {
    const { orgId } = req.params;
    const { teamName, sport, ageGroup, location } = req.body;
    
    if (!teamName || !sport) {
      return res.status(400).json({ error: 'Team name and sport are required' });
    }
    
    // Verify organization exists
    const orgDoc = await db.collection('organizations').doc(orgId).get();
    if (!orgDoc.exists) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    // Create team with organization reference
    const teamData = {
      displayName: teamName,
      sport,
      ageGroup,
      location,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      createdBy: req.user?.uid || 'system',
      seasons: {
        '2024': {
          roster: [],
          schedule: [],
          events: [],
          wins: 0,
          losses: 0
        }
      }
    };
    
    const teamRef = await db.collection('teams').add(teamData);
    
    // Update organization team count
    await db.collection('organizations').doc(orgId).update({
      teamCount: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({
      id: teamRef.id,
      ...teamData,
      message: 'Team added to organization successfully'
    });
  } catch (error) {
    console.error('Add team to organization error:', error);
    res.status(500).json({ error: 'Failed to add team to organization' });
  }
});

// User management within organizations
app.post('/api/organizations/:orgId/users', async (req, res) => {
  try {
    const { orgId } = req.params;
    const { email, name, role = 'member' } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }
    
    // Verify organization exists
    const orgDoc = await db.collection('organizations').doc(orgId).get();
    if (!orgDoc.exists) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    // Add user to organization
    const userData = {
      email,
      name,
      role,
      organizationId: orgId,
      joinedAt: new Date().toISOString(),
      status: 'active'
    };
    
    const userRef = await db.collection('users').add(userData);
    
    // Update organization user count
    await db.collection('organizations').doc(orgId).update({
      userCount: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({
      id: userRef.id,
      ...userData,
      message: 'User added to organization successfully'
    });
  } catch (error) {
    console.error('Add user to organization error:', error);
    res.status(500).json({ error: 'Failed to add user to organization' });
  }
});

// Organization analytics
app.get('/api/organizations/:orgId/analytics', async (req, res) => {
  try {
    const { orgId } = req.params;
    const { season = '2024' } = req.query;
    
    // Get all teams for the organization
    const teamsSnapshot = await db.collection('teams')
      .where('organizationId', '==', orgId)
      .get();
    
    let totalGames = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let totalPlayers = 0;
    const sportStats = {};
    
    teamsSnapshot.forEach(teamDoc => {
      const teamData = teamDoc.data();
      const seasonData = teamData.seasons?.[season] || {};
      
      totalGames += seasonData.schedule?.length || 0;
      totalWins += seasonData.wins || 0;
      totalLosses += seasonData.losses || 0;
      totalPlayers += seasonData.roster?.length || 0;
      
      const sport = teamData.sport;
      if (!sportStats[sport]) {
        sportStats[sport] = { teams: 0, games: 0, players: 0 };
      }
      sportStats[sport].teams += 1;
      sportStats[sport].games += seasonData.schedule?.length || 0;
      sportStats[sport].players += seasonData.roster?.length || 0;
    });
    
    const analytics = {
      summary: {
        totalTeams: teamsSnapshot.size,
        totalGames,
        totalWins,
        totalLosses,
        totalPlayers,
        winPercentage: totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0
      },
      sportBreakdown: sportStats,
      season: season,
      generatedAt: new Date().toISOString()
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Organization analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch organization analytics' });
  }
});

// Middleware to check organization membership
const checkOrganizationAccess = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const userId = req.user?.uid;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user is member of organization
    const userSnapshot = await db.collection('users')
      .where('organizationId', '==', orgId)
      .where('id', '==', userId)
      .get();
    
    if (userSnapshot.empty) {
      return res.status(403).json({ error: 'Access denied to organization' });
    }
    
    next();
  } catch (error) {
    console.error('Organization access check error:', error);
    res.status(500).json({ error: 'Failed to check organization access' });
  }
};

// Apply organization access check to sensitive endpoints
app.use('/api/organizations/:orgId/users', checkOrganizationAccess);
app.use('/api/organizations/:orgId/analytics', checkOrganizationAccess);

// ─────────────────────────────────────────────────────────────────────────────
// 🌍 PUBLIC API FOR THIRD-PARTY DEVELOPERS
// ─────────────────────────────────────────────────────────────────────────────

// Public API authentication (API keys for developers)
const authenticateDeveloper = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // In production, validate against database of developer API keys
  const validApiKeys = [
    'dev_test_1234567890abcdef', // Test developer
    'dev_prod_abcdef1234567890', // Production developer
  ];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid or missing developer API key' });
  }
  
  next();
};

// Public API endpoints for developers
app.get('/api/v1/teams', authenticateDeveloper, async (req, res) => {
  try {
    const { limit = 20, offset = 0, sport, location } = req.query;
    
    let query = db.collection('teams').limit(parseInt(limit)).offset(parseInt(offset));
    
    if (sport) {
      query = query.where('sport', '==', sport);
    }
    
    if (location) {
      query = query.where('location', '==', location);
    }
    
    const snapshot = await query.get();
    const teams = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().displayName,
      sport: doc.data().sport,
      ageGroup: doc.data().ageGroup,
      location: doc.data().location,
      type: doc.data().teamType,
      createdAt: doc.data().createdAt,
      playerCount: doc.data().rosterCount || 0,
      organizationId: doc.data().organizationId
    }));
    
    res.json({
      teams,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: teams.length
      },
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Public API teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/v1/teams/:teamId', authenticateDeveloper, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = '2024' } = req.query;
    
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const teamData = teamDoc.data();
    const seasonData = teamData.seasons?.[season] || {};
    
    const teamInfo = {
      id: teamDoc.id,
      name: teamData.displayName,
      sport: teamData.sport,
      ageGroup: teamData.ageGroup,
      location: teamData.location,
      type: teamData.teamType,
      season: season,
      record: {
        wins: seasonData.wins || 0,
        losses: seasonData.losses || 0,
        gamesPlayed: seasonData.schedule?.length || 0
      },
      roster: seasonData.roster?.map(player => ({
        id: player.id,
        name: player.name,
        number: player.number,
        position: player.primaryPosition,
        battingAvg: player.avg || 0,
        homeRuns: player.hr || 0,
        rbis: player.rbi || 0,
        era: player.era || 0,
        strikeouts: player.strikeouts || 0,
        obp: player.obp || 0,
        slg: player.slg || 0,
        ops: player.ops || 0
      })) || [],
      recentGames: seasonData.schedule?.slice(-5).map(game => ({
        date: game.date,
        opponent: game.opponent,
        location: game.location,
        result: game.result,
        score: game.score,
        status: game.status
      })) || []
    };
    
    res.json({
      team: teamInfo,
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Public API team detail error:', error);
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
});

app.get('/api/v1/games', authenticateDeveloper, async (req, res) => {
  try {
    const { teamId, startDate, endDate, limit = 50, offset = 0, status } = req.query;
    
    let query = db.collection('teams').limit(parseInt(limit));
    
    if (teamId) {
      query = query.where('id', '==', teamId);
    }
    
    const snapshot = await query.get();
    const games = [];
    
    snapshot.forEach(teamDoc => {
      const teamData = teamDoc.data();
      const seasons = teamData.seasons || {};
      
      Object.values(seasons).forEach(seasonData => {
        const schedule = seasonData.schedule || [];
        
        schedule.forEach(game => {
          const gameDate = new Date(game.date);
          
          if (startDate && gameDate < new Date(startDate)) return;
          if (endDate && gameDate > new Date(endDate)) return;
          if (status && game.status !== status) return;
          
          games.push({
            id: `${teamDoc.id}_${game.date}`,
            teamId: teamDoc.id,
            teamName: teamData.displayName,
            opponent: game.opponent,
            date: game.date,
            location: game.location,
            result: game.result,
            score: game.score,
            status: game.status,
            sport: teamData.sport
          });
        });
      });
    });
    
    // Sort by date and paginate
    games.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginatedGames = games.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      games: paginatedGames,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: games.length
      },
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Public API games error:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/v1/players/search', authenticateDeveloper, async (req, res) => {
  try {
    const { name, position, minAvg, maxAvg, limit = 20, offset = 0 } = req.query;
    
    let query = db.collection('teams').limit(parseInt(limit));
    const players = [];
    
    const snapshot = await query.get();
    
    snapshot.forEach(teamDoc => {
      const teamData = teamDoc.data();
      const seasons = teamData.seasons || {};
      
      Object.values(seasons).forEach(seasonData => {
        const roster = seasonData.roster || [];
        
        roster.forEach(player => {
          // Apply filters
          if (name && !player.name.toLowerCase().includes(name.toLowerCase())) return;
          if (position && player.primaryPosition !== position) return;
          if (minAvg && (player.avg || 0) < parseFloat(minAvg)) return;
          if (maxAvg && (player.avg || 0) > parseFloat(maxAvg)) return;
          
          players.push({
            id: player.id,
            name: player.name,
            number: player.number,
            position: player.primaryPosition,
            teamId: teamDoc.id,
            teamName: teamData.displayName,
            sport: teamData.sport,
            battingAvg: player.avg || 0,
            homeRuns: player.hr || 0,
            rbis: player.rbi || 0,
            era: player.era || 0,
            strikeouts: player.strikeouts || 0,
            obp: player.obp || 0,
            slg: player.slg || 0,
            ops: player.ops || 0
          });
        });
      });
    });
    
    // Sort by name and paginate
    players.sort((a, b) => a.name.localeCompare(b.name));
    const paginatedPlayers = players.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      players: paginatedPlayers,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: players.length
      },
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Public API player search error:', error);
    res.status(500).json({ error: 'Failed to search players' });
  }
});

// API documentation and developer resources
app.get('/api/v1/docs', (req, res) => {
  const docs = {
    title: 'GameTracker Public API',
    version: 'v1',
    description: 'Build amazing sports applications with GameTracker\'s comprehensive sports data API',
    baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Get your API key by registering as a GameTracker developer',
      signupUrl: `${req.protocol}://${req.get('host')}/developers/signup`
    },
    endpoints: [
      {
        method: 'GET',
        path: '/teams',
        description: 'Get a list of teams with filtering options',
        parameters: {
          limit: 'Number of teams to return (default: 20, max: 100)',
          offset: 'Number of teams to skip (default: 0)',
          sport: 'Filter by sport (Baseball, Softball, etc.)',
          location: 'Filter by location'
        },
        example: '/api/v1/teams?sport=Baseball&limit=10',
        response: 'Array of team objects with basic information'
      },
      {
        method: 'GET',
        path: '/teams/{teamId}',
        description: 'Get detailed information about a specific team',
        parameters: {
          teamId: 'Unique identifier for the team',
          season: 'Season year (default: 2024)'
        },
        example: '/api/v1/teams/abc123?season=2024',
        response: 'Detailed team object with roster and recent games'
      },
      {
        method: 'GET',
        path: '/games',
        description: 'Get games across all teams with filtering',
        parameters: {
          teamId: 'Filter by specific team',
          startDate: 'Filter games from this date (YYYY-MM-DD)',
          endDate: 'Filter games until this date (YYYY-MM-DD)',
          status: 'Filter by game status (Scheduled, In Progress, Final)',
          limit: 'Number of games to return (default: 50, max: 200)',
          offset: 'Number of games to skip (default: 0)'
        },
        example: '/api/v1/games?status=Final&limit=20',
        response: 'Array of game objects with results and scores'
      },
      {
        method: 'GET',
        path: '/players/search',
        description: 'Search for players across all teams',
        parameters: {
          name: 'Search by player name (partial match)',
          position: 'Filter by position (P, C, 1B, 2B, SS, 3B, LF, CF, RF, DH)',
          minAvg: 'Minimum batting average (0.000 - 1.000)',
          maxAvg: 'Maximum batting average (0.000 - 1.000)',
          limit: 'Number of players to return (default: 20, max: 100)',
          offset: 'Number of players to skip (default: 0)'
        },
        example: '/api/v1/players/search?position=SS&minAvg=0.300',
        response: 'Array of player objects with statistics'
      }
    ],
    rateLimit: {
      requests: '5000',
      period: 'hour',
      description: 'Maximum requests per hour per API key'
    },
    dataFields: {
      team: ['id', 'name', 'sport', 'ageGroup', 'location', 'type', 'createdAt', 'playerCount'],
      player: ['id', 'name', 'number', 'position', 'battingAvg', 'homeRuns', 'rbis', 'era', 'strikeouts', 'obp', 'slg', 'ops'],
      game: ['id', 'teamId', 'teamName', 'opponent', 'date', 'location', 'result', 'score', 'status', 'sport']
    },
    sdks: {
      javascript: 'https://github.com/gametracker/js-sdk',
      python: 'https://github.com/gametracker/python-sdk',
      'c-sharp': 'https://github.com/gametracker/csharp-sdk'
    },
    support: {
      documentation: 'https://docs.gametracker.com/api',
      developers: 'developers@gametracker.com',
      status: 'https://status.gametracker.com',
      community: 'https://community.gametracker.com'
    },
    examples: {
      javascript: `
// Get all baseball teams
const response = await fetch('/api/v1/teams?sport=Baseball', {
  headers: { 'X-API-Key': 'your-api-key' }
});
const teams = await response.json();

// Search for shortstops with high batting average
const players = await fetch('/api/v1/players/search?position=SS&minAvg=0.300', {
  headers: { 'X-API-Key': 'your-api-key' }
});
      `,
      python: `
import gametracker

client = gametracker.Client(api_key='your-api-key')

# Get team details
team = client.teams.get('team-id-here')
print(f"Team: {team.name}, Record: {team.record}")

# Search for players
players = client.players.search(position='P', min_avg=2.50)
for player in players:
    print(f"{player.name}: {player.era} ERA")
      `,
      'c-sharp': `
using GameTracker.SDK;

var client = new GameTrackerClient("your-api-key");

// Get recent games
var games = await client.Games.GetAsync(status: "Final", limit: 10);
foreach (var game in games)
{
    Console.WriteLine($"{game.TeamName} vs {game.Opponent}: {game.Score}");
}
      `
    }
  };
  
  res.json(docs);
});

// Developer signup endpoint
app.post('/api/v1/developers/signup', async (req, res) => {
  try {
    const { name, email, company, website, useCase } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Generate API key
    const apiKey = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const developerData = {
      name,
      email,
      company,
      website,
      useCase,
      apiKey,
      status: 'pending',
      createdAt: new Date().toISOString(),
      requestsThisHour: 0,
      totalRequests: 0
    };
    
    // In production, save to database
    console.log('New developer signup:', developerData);
    
    res.json({
      message: 'Developer application received. Your API key is pending approval.',
      apiKey: apiKey,
      status: 'pending'
    });
  } catch (error) {
    console.error('Developer signup error:', error);
    res.status(500).json({ error: 'Failed to process developer signup' });
  }
});

// Rate limiting for public API
const publicApiRateLimit = new Map();
const checkPublicApiRateLimit = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const now = Date.now();
  const hour = 60 * 60 * 1000; // 1 hour in milliseconds
  
  if (!publicApiRateLimit.has(apiKey)) {
    publicApiRateLimit.set(apiKey, { count: 1, resetTime: now + hour });
    return next();
  }
  
  const rateLimitData = publicApiRateLimit.get(apiKey);
  
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 1;
    rateLimitData.resetTime = now + hour;
    return next();
  }
  
  if (rateLimitData.count >= 5000) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      resetTime: rateLimitData.resetTime,
      limit: '5000 requests per hour'
    });
  }
  
  rateLimitData.count++;
  next();
};

// Apply rate limiting to all public API routes
app.use('/api/v1', checkPublicApiRateLimit);

// ─────────────────────────────────────────────────────────────────────────────
// 🔄 REAL-TIME COLLABORATION WEBSOCKET SERVER
// ─────────────────────────────────────────────────────────────────────────────

const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Store active connections and game rooms
const connections = new Map(); // userId -> { ws, gameId, userName, color }
const gameRooms = new Map(); // gameId -> Set of userIds

// Generate random color for collaborators
const generateUserColor = () => {
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  let userId = null;
  let gameId = null;
  let userName = null;
  let userColor = generateUserColor();
  
  // Parse URL parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  
  if (pathParts[1] === 'collaborate' && pathParts[2]) {
    gameId = pathParts[2];
    userId = url.searchParams.get('userId');
    userName = url.searchParams.get('userName');
  }
  
  if (!userId || !gameId || !userName) {
    console.log('Invalid connection parameters, closing connection');
    ws.close(1008, 'Invalid parameters');
    return;
  }
  
  // Store connection
  connections.set(userId, { ws, gameId, userName, color: userColor });
  
  // Add to game room
  if (!gameRooms.has(gameId)) {
    gameRooms.set(gameId, new Set());
  }
  gameRooms.get(gameId).add(userId);
  
  console.log(`User ${userName} (${userId}) joined game ${gameId}`);
  
  // Notify others in the room
  broadcastToGame(gameId, {
    type: 'user_joined',
    data: {
      userId,
      userName,
      color: userColor,
      timestamp: Date.now()
    }
  }, userId);
  
  // Send current room state to new user
  const roomUsers = Array.from(gameRooms.get(gameId) || []).map(uid => {
    const conn = connections.get(uid);
    return conn ? {
      userId: uid,
      userName: conn.userName,
      color: conn.color,
      timestamp: Date.now()
    } : null;
  }).filter(Boolean);
  
  ws.send(JSON.stringify({
    type: 'room_state',
    data: {
      gameId,
      users: roomUsers,
      timestamp: Date.now()
    }
  }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(userId, gameId, data);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  // Handle connection close
  ws.on('close', () => {
    console.log(`User ${userName} (${userId}) disconnected from game ${gameId}`);
    
    // Remove from connections
    connections.delete(userId);
    
    // Remove from game room
    if (gameRooms.has(gameId)) {
      gameRooms.get(gameId).delete(userId);
      
      // Clean up empty rooms
      if (gameRooms.get(gameId).size === 0) {
        gameRooms.delete(gameId);
      }
    }
    
    // Notify others
    broadcastToGame(gameId, {
      type: 'user_left',
      data: {
        userId,
        userName,
        timestamp: Date.now()
      }
    });
  });
  
  // Handle connection error
  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
  });
});

// Handle incoming messages
function handleMessage(userId, gameId, message) {
  const { type, data } = message;
  const connection = connections.get(userId);
  
  if (!connection) return;
  
  switch (type) {
    case 'heartbeat':
      // Respond to heartbeat
      connection.ws.send(JSON.stringify({
        type: 'heartbeat_response',
        data: { timestamp: Date.now() }
      }));
      break;
      
    case 'presence':
      // Update user presence
      connection.ws.send(JSON.stringify({
        type: 'presence_update',
        data: { ...data, timestamp: Date.now() }
      }));
      break;
      
    case 'cursor':
      // Broadcast cursor position to others
      broadcastToGame(gameId, {
        type: 'cursor',
        data: {
          userId,
          ...data,
          timestamp: Date.now()
        }
      }, userId);
      break;
      
    case 'action':
      // Broadcast shared action to others
      broadcastToGame(gameId, {
        type: 'action',
        data: {
          userId,
          userName: connection.userName,
          ...data,
          timestamp: Date.now()
        }
      }, userId);
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
}

// Broadcast message to all users in a game room
function broadcastToGame(gameId, message, excludeUserId = null) {
  const roomUsers = gameRooms.get(gameId);
  if (!roomUsers) return;
  
  const messageStr = JSON.stringify(message);
  
  roomUsers.forEach(userId => {
    if (userId === excludeUserId) return;
    
    const connection = connections.get(userId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(messageStr);
    }
  });
}

// Clean up inactive connections periodically
setInterval(() => {
  const now = Date.now();
  connections.forEach((connection, userId) => {
    if (connection.ws.readyState === WebSocket.OPEN) {
      // Send ping to check connection
      connection.ws.ping();
    } else {
      // Remove dead connection
      connections.delete(userId);
      if (gameRooms.has(connection.gameId)) {
        gameRooms.get(connection.gameId).delete(userId);
      }
    }
  });
}, 30000); // Check every 30 seconds

console.log('WebSocket server started on port 8080');

server.listen(port, () => {
  console.log(`GameTracker backend running on http://localhost:${port}`);
  if (allowLocalAuthWrites) {
    console.log("Local practice mode: signed-in coach writes are allowed on this laptop.");
  }
});
