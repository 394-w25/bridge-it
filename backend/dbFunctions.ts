import {db} from './firebaseInit';
import { orderBy, collection, query, onSnapshot, getDocs, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore';
import { getGeminiResponse } from "./gemini"; 

// Type for journal entry stored in Firestore
interface EntryInput {
  content: string;
  timestamp: Timestamp;
}

interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
}

export async function postUser(userInfo: UserInfo) {
  await setDoc(doc(db, 'users', userInfo.uid), userInfo);
}

// Add a new journal entry (storing only timestamp)
export async function postUserEntry(userId: string, entryData: EntryInput) {
  
  const improvedDescription = await getGeminiResponse(entryData.content); 
  
  await addDoc(collection(db, "users", userId, "journalEntries"), {
    content: entryData.content,
    type: improvedDescription.type,
    title: improvedDescription.title,
    summary: improvedDescription.summary,
    hardSkills: improvedDescription.hardSkills,
    softSkills: improvedDescription.softSkills,
    reflection: improvedDescription.reflection,
    timestamp: entryData.timestamp, // Store timestamp only
  });

  return improvedDescription;
}

// Fetch user entries (sorted by timestamp)
export async function getUserEntries(userId: string): Promise<EntryInput[]> {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
    orderBy("timestamp", "desc") // Ensure sorting
  );

  const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => doc.data() as EntryInput);
  return querySnapshot.docs.map(doc => {
    const data = doc.data() as Partial<EntryInput>; // Ensure type safety

    return {
      title: data.title || "Untitled",
      content: data.content || "",  // ✅ Include user input
      summary: data.summary || "No summary available",
      hardSkills: data.hardSkills || "No hard skills identified",
      softSkills: data.softSkills || "No soft skills identified",
      reflection: data.reflection || "No reflection available",
      timestamp: data.timestamp ? data.timestamp as Timestamp : Timestamp.now(),
    };
  });
}

// Listen for real-time updates on user's journal entries
export function listenToUserEntries(userId: string, callback: (entries: EntryInput[]) => void) {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
    orderBy("timestamp", "desc") // Ensure sorting
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const formattedEntries = snapshot.docs.map(doc => doc.data() as EntryInput);
    callback(formattedEntries);
  });
  return unsubscribe;
}