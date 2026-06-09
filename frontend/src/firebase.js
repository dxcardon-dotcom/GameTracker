import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqDLWru8w6nJdsEGFVC3J12nb_vjogQ1Q",
  authDomain: "gametrackerpro-40eff.firebaseapp.com",
  projectId: "gametrackerpro-40eff",
  storageBucket: "gametrackerpro-40eff.firebasestorage.app",
  messagingSenderId: "174996810815",
  appId: "1:174996810815:web:309eccd9d0d20ec134dc8a",
  measurementId: "G-MNJWM2DD9F"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// ⭐ This line initializes and exports the database so BroadcastConsole can read it!
export const db = getFirestore(app);
export const storage = getStorage(app);

// ========================================================
// 💾 DATABASE SYNC HELPERS (Firestore Mappings)
// ========================================================

/**
 * Pushes default local archive data to Cloud Firestore if it doesn't exist.
 * This ensures your historical archives aren't lost on the initial hookup.
 */
export const seedInitialDatabaseArchive = async (initialData) => {
  try {
    for (const [seasonYear, data] of Object.entries(initialData)) {
      const seasonRef = doc(db, "seasons", seasonYear);
      await setDoc(seasonRef, {
        schedule: data.schedule,
        roster: data.roster
      }, { merge: true });
    }
    console.log("Firestore database seeded successfully with historical segments.");
  } catch (error) {
    console.error("Error seeding historical data structures:", error);
  }
};

/**
 * Commits a single completed game structure into a specific season's schedule array.
 */
export const commitGameToCloudHistory = async (seasonYear, gameEntry) => {
  const seasonRef = doc(db, "seasons", seasonYear);
  await updateDoc(seasonRef, {
    schedule: arrayUnion(gameEntry)
  });
};

/**
 * Replaces the entire active roster array for a season (used for bulk updates like box scores).
 */
export const updateCloudRosterMetrics = async (seasonYear, updatedRoster) => {
  const seasonRef = doc(db, "seasons", seasonYear);
  await updateDoc(seasonRef, {
    roster: updatedRoster
  });
};

/**
 * Creates a brand new document ledger for a newly opened school year segment.
 */
export const initializeNewCloudSeason = async (seasonYear) => {
  const seasonRef = doc(db, "seasons", seasonYear);
  await setDoc(seasonRef, {
    schedule: [],
    roster: []
  });
};
