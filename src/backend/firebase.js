import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_API_ID,
};

//initialize firebase and firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 
function for storing game results in firestore
db = firestore database
gameStats = firestore collection to store game results(game,won,lost)
addDoc = adding a document(containing all data) to the collection gameStats
*/
export const saveGameResult = async (game, won, lost) => {
  try {
    const date = new Date().toLocaleDateString();
    await addDoc(collection(db, "gameStats"), {
      game,
      won,
      lost,
      date,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

/*
function for retrieving game results from firestore
querySnapshot = contains whole result
stats = extracting and  mapping as firestore document id and data() extracts the game results
getDocs = fetches document from the collection
*/
export const fetchGameStats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "gameStats"));
    const stats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return stats.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error("Error fetching game stats: ", e);
    return [];
  }
};

/*
function for storing user's game results 
adding a new document collection in "gameStats" for user specific 
*/
export const saveUserGameStats = async (userId, gameData) => {
  try {
    const now = new Date();
    const date = new Date().toLocaleDateString();
    const time = now.toLocaleTimeString();
    await addDoc(collection(db, "gameStats"), {
      userId,
      game: gameData.game,
      won: gameData.won,
      lost: gameData.lost,
      date,
      time,
      username: gameData.username,
    });
    return true;
  } catch (error) {
    console.error("Error saving game stats:", error);
    return false;
  }
};

/*
function for retrieving user's game results
query =  querying it with "where" and "orderBy"
*/
export const fetchUserGameStats = async (userId) => {
  try {
    const gameStatsRef = collection(db, "gameStats");
    const q = query(
      gameStatsRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const stats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return [];
  }
};

/*
function to save/update a user profile in firestore based on userId
*/
export const saveUserProfile = async (userId, username, profileImg) => {
  try {
    const userProfileRef = collection(db, "userProfiles");
    const q = query(userProfileRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // create new profile
      await addDoc(userProfileRef, {
        userId,
        username,
        profileImg,
      });
    } else {
      // update existing profile
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { profileImg });
    }
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
};

/*
function to retrieve a user's profile  based on userId
*/
export const fetchUserProfile = async (userId) => {
  try {
    const userProfileRef = collection(db, "userProfiles");
    const q = query(userProfileRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export { db };
