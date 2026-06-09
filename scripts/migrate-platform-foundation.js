import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function loadDotEnv() {
  return Object.fromEntries(
    readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [
          line.slice(0, index).trim(),
          line.slice(index + 1).trim().replace(/^["']|["']$/g, ""),
        ];
      })
  );
}

const env = loadDotEnv();
const serviceAccountPath =
  env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json";

initializeApp({
  credential: cert(JSON.parse(readFileSync(serviceAccountPath, "utf8"))),
});

const db = getFirestore();
const organizationId = "irvin-high-school";
const teamId = "e3UukXkIjMHcr0uB5rZ3";
const seasonId = "2025–2026";
const liveGameId = "irvin-rockets-live";

const teamRef = db.collection("teams").doc(teamId);
const seasonRef = db.collection("seasons").doc(seasonId);
const [teamSnap, seasonSnap] = await Promise.all([teamRef.get(), seasonRef.get()]);

if (!teamSnap.exists) throw new Error("Irvin Rockets team was not found");
if (!seasonSnap.exists) throw new Error("2025–2026 season was not found");

const team = teamSnap.data();
const season = seasonSnap.data();
const batch = db.batch();

batch.set(
  db.collection("migrationBackups").doc(`season-${seasonId}`),
  {
    collection: "seasons",
    documentId: seasonId,
    data: season,
    backedUpAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

batch.set(
  db.collection("organizations").doc(organizationId),
  {
    name: "Irvin High School",
    organizationType: "school",
    ownerId: team.owner,
    visibility: "public",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

batch.set(
  teamRef,
  {
    organizationId,
    sport: "baseball",
    visibility: "public",
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

batch.set(
  seasonRef,
  {
    teamId,
    organizationId,
    name: "2025–2026 Baseball",
    visibility: "public",
    published: true,
    migratedToPlatformFoundation: true,
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

for (const member of team.members || []) {
  const uid = typeof member === "string" ? member : member.uid;
  const role = typeof member === "string" ? "member" : member.role || "member";
  if (!uid) continue;

  batch.set(
    db.collection("teamMembers").doc(`${teamId}_${uid}`),
    {
      organizationId,
      teamId,
      uid,
      role,
      status: "active",
      joinedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

for (const player of season.roster || []) {
  const athleteId = `${teamId}_${player.id}`;
  batch.set(
    db.collection("athletes").doc(athleteId),
    {
      organizationId,
      teamId,
      seasonId,
      firstName: player.firstName || "",
      lastName: player.lastName || "",
      jersey: player.jersey || "",
      visibility: "public",
      legacyStats: player,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

batch.set(
  db.collection("games").doc(liveGameId),
  {
    organizationId,
    teamId,
    seasonId,
    homeTeamName: "Irvin Rockets",
    opponentName: "Fabens High School",
    location: "Home",
    gameType: "District",
    status: "live",
    visibility: "public",
    inning: 1,
    half: "top",
    balls: 0,
    strikes: 0,
    outs: 0,
    pitchCount: 0,
    currentBatter: "",
    currentPitcher: "",
    runners: { first: false, second: false, third: false },
    ourInnings: [0, 0, 0, 0, 0, 0, 0],
    theirInnings: [0, 0, 0, 0, 0, 0, 0],
    ourHits: 0,
    theirHits: 0,
    ourErrors: 0,
    theirErrors: 0,
    eventSequence: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

for (const legacyGame of season.schedule || []) {
  batch.set(
    db.collection("games").doc(`legacy-${seasonId}-${legacyGame.id}`),
    {
      ...legacyGame,
      organizationId,
      teamId,
      seasonId,
      visibility: "public",
      migratedFromLegacySeason: true,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

await batch.commit();

console.log(
  `Platform foundation migrated: organization, team, season, ${
    (team.members || []).length
  } membership(s), ${(season.roster || []).length} athlete(s), live game, and ${
    (season.schedule || []).length
  } historical game(s).`
);
