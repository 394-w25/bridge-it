import db from './firebaseInit';
import { orderBy, collection, query, onSnapshot, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { getGeminiResponse } from "./gemini"; 

// Type for journal entry stored in Firestore
interface EntryInput {
  title: string;
  content: string;
  timestamp: Timestamp;
}

export async function getUserEntries(userId: string): Promise<EntryInput[]> {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as EntryInput);
}

// Add a new journal entry (storing only timestamp)
export async function postUserEntry(userId: string, entryData: EntryInput) {
  const improvedDescription = await getGeminiResponse(entryData.content); 
  
  await addDoc(collection(db, "users", userId, "journalEntries"), {
    title: entryData.title,
    content: improvedDescription,
    timestamp: entryData.timestamp,
  });

  return improvedDescription;
}

// Listen for real-time updates on user's journal entries
export function listenToUserEntries(userId: string, callback: (entries: EntryInput[]) => void) {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const formattedEntries = snapshot.docs.map(doc => doc.data() as EntryInput);
    callback(formattedEntries);
  });

  return unsubscribe;
}
