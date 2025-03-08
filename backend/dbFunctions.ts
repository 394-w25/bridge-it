import {db} from './firebaseInit';
import { orderBy, collection, query, onSnapshot, getDocs, addDoc, setDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { getGeminiResponse } from "./gemini"; 

// Type for journal entry stored in Firestore
interface EntryInput {
  id: string;
  title: string;
  content: string;
  summary: string;
  hardSkills: string;
  softSkills: string;
  reflection: string;
  categories?: string[];
  timestamp: Timestamp;
  shortSummary: string;
}

interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
}

export async function postUser(userInfo: UserInfo) {
  await setDoc(doc(db, 'users', userInfo.uid), {displayName: userInfo.displayName, email: userInfo.email});
}

function parseGeminiCategories(csvString: string): string[] {
  return csvString
    .split(',')      // Split by commas
    .map(cat => cat.trim().toLowerCase())  // Trim spaces & normalize case
    .filter(cat => cat.length > 0);  // Remove any empty values
}


// Add a new journal entry (storing only timestamp)
export async function postUserEntry(userId: string, entryData: EntryInput) {
  
  const improvedDescription = await getGeminiResponse(entryData.content); 
  // const shortSummary = await getGeminiSummary(entryData.content);

  const parsedCategories = parseGeminiCategories(improvedDescription.categories);
  await addDoc(collection(db, "users", userId, "journalEntries"), {
    content: entryData.content,
    type: improvedDescription.type,
    title: improvedDescription.title,
    summary: improvedDescription.summary,
    hardSkills: improvedDescription.hardSkills,
    softSkills: improvedDescription.softSkills,
    reflection: improvedDescription.reflection,
    categories: parsedCategories,
    timestamp: entryData.timestamp, // Store timestamp only
    shortSummary: improvedDescription.shortsummary,
  });

  return improvedDescription;
}

// Fetch user entries (sorted by timestamp)
export async function getUserEntries(userId: string): Promise<(EntryInput & { id: string })[]> {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
    orderBy("timestamp", "desc") // Ensure sorting
  );

  const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => doc.data() as EntryInput);
  return querySnapshot.docs.map(doc => {
    const data = doc.data() as Partial<EntryInput>; // Ensure type safety
    console.log('getting short summary from firestore here', data.shortSummary);
    return {
      id: doc.id,
      title: data.title || "Untitled",
      content: data.content || "",  // ✅ Include user input
      summary: data.summary || "No summary available",
      hardSkills: data.hardSkills || "No hard skills identified",
      softSkills: data.softSkills || "No soft skills identified",
      reflection: data.reflection || "No reflection available",
      // categories: data.categories || [],
      categories: Array.isArray(data.categories) ? data.categories : [],
      timestamp: data.timestamp ? data.timestamp as Timestamp : Timestamp.now(),
      shortSummary: data.shortSummary || "No short summmery available",
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
    const formattedEntries = snapshot.docs.map(doc => {
      const data = doc.data() as EntryInput;
      return {
        ...data,
        id: doc.id,
      };
    });  
    callback(formattedEntries);
  });
  return unsubscribe;
}


export async function updateUserEntry(userId: string, entryId: string, updatedData: Partial<EntryInput>) {
  try {
    const entryRef = doc(db, "users", userId, "journalEntries", entryId);
    await updateDoc(entryRef, {
      title: updatedData.title,
      // content: updatedData.content,
      // summary: updatedData.summary,
      hardSkills: updatedData.hardSkills,
      softSkills: updatedData.softSkills,
      reflection: updatedData.reflection,
      // categories: updatedData.categories,
      shortSummary: updatedData.shortSummary,
      // You can also update the timestamp if needed:
      // timestamp: updatedData.timestamp,
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
}
