import firebase from 'firebase/compat/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  writeBatch
} from 'firebase/firestore';
import { ChargingSession } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyDtuD9l8x0H0bn6F0adQbymEzRq5E0vagw",
  authDomain: "ecochargedb.firebaseapp.com",
  projectId: "ecochargedb",
  storageBucket: "ecochargedb.firebasestorage.app",
  messagingSenderId: "946156862837",
  appId: "1:946156862837:web:4483ebb5f4d3b6664e673c",
  measurementId: "G-04PX95KMZH"
};

// Initialize Firebase
// Using namespace import helps resolve issues where named exports might not be detected correctly in some environments
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = getFirestore(app);


const COLLECTION_NAME = 'sessions';

// Helper functions for Firestore operations

export const getSessions = async (): Promise<ChargingSession[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const sessions: ChargingSession[] = [];
    querySnapshot.forEach((doc) => {
      sessions.push(doc.data() as ChargingSession);
    });
    return sessions;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export const addSession = async (session: ChargingSession): Promise<void> => {
  try {
    // Use setDoc with session.id as the document ID for easier deletion later
    await setDoc(doc(db, COLLECTION_NAME, session.id), session);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const deleteSession = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error removing document: ", error);
    throw error;
  }
};

export const bulkAddSessions = async (sessions: ChargingSession[]): Promise<void> => {
  const batch = writeBatch(db);
  sessions.forEach((session) => {
    const docRef = doc(db, COLLECTION_NAME, session.id);
    batch.set(docRef, session);
  });
  await batch.commit();
};