import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function loadDotEnv() {
  const lines = readFileSync(".env", "utf8").split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    env[trimmed.slice(0, equalsIndex).trim()] = trimmed
      .slice(equalsIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }

  return env;
}

const env = loadDotEnv();
const serviceAccountPath =
  env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json";

initializeApp({
  credential: cert(JSON.parse(readFileSync(serviceAccountPath, "utf8"))),
});

const db = getFirestore();
const snapshot = await db.collection("teams").get();
let updated = 0;

for (const teamDoc of snapshot.docs) {
  const team = teamDoc.data();
  const memberIds = Array.from(
    new Set(
      (team.members || [])
        .map((member) => (typeof member === "string" ? member : member.uid))
        .filter(Boolean)
    )
  );

  if (!memberIds.length) continue;

  await teamDoc.ref.set({ memberIds }, { merge: true });
  updated += 1;
}

console.log(`Updated ${updated} team document(s).`);
