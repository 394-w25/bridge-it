import {db} from './firebaseInit';
import { orderBy, collection, query, onSnapshot, getDoc, getDocs, addDoc, setDoc, doc, Timestamp, where, updateDoc } from 'firebase/firestore';
import { getGeminiResponse } from "./gemini"; 

// Type for journal entry stored in Firestore
export interface EntryInput {
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

interface JobInfo {
  jid: string;
  positionName: string;
  jobPosting: string;
  companyInfo: string;
  keyStrength: string;
  interviewQ: string;
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
  
  // const improvedDescription = await getGeminiResponse(entryData.content); 
  // // const shortSummary = await getGeminiSummary(entryData.content);

  // const parsedCategories = entryData.categories
  // ? parseGeminiCategories(entryData.categories.join(','))
  // : [];
  const parsedCategories = entryData.categories
  ? parseGeminiCategories(entryData.categories.map(cat => cat.toLowerCase()).join(','))
  : [];

  // const parsedCategories = parseGeminiCategories(entryData.categories.join(','));
  // await addDoc(collection(db, "users", userId, "journalEntries"), {
  //   content: entryData.content,
  //   type: improvedDescription.type,
  //   title: improvedDescription.title,
  //   summary: improvedDescription.summary,
  //   hardSkills: improvedDescription.hardSkills,
  //   softSkills: improvedDescription.softSkills,
  //   reflection: improvedDescription.reflection,
  //   categories: parsedCategories,
  //   timestamp: entryData.timestamp, // Store timestamp only
  //   shortSummary: improvedDescription.shortsummary,
  // });

  // return improvedDescription;
  await addDoc(collection(db, "users", userId, "journalEntries"), {
    content: entryData.content,
    title: entryData.title,
    summary: entryData.summary,
    hardSkills: entryData.hardSkills,
    softSkills: entryData.softSkills,
    reflection: entryData.reflection,
    categories: entryData.categories,
    timestamp: entryData.timestamp,
    shortSummary: entryData.shortSummary,
  });

  return entryData;
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
    const rawCategories = data.categories as unknown;
    const categories =
      typeof rawCategories === "string"
        ? (rawCategories as string)
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
        : (data.categories || []);
    const entry: EntryInput & { id: string } = {
      id: doc.id,
      title: data.title || "Untitled",
      content: data.content || "",
      summary: data.summary || "No summary available",
      hardSkills: data.hardSkills || "No hard skills identified",
      softSkills: data.softSkills || "No soft skills identified",
      reflection: data.reflection || "No reflection available",
      categories,
      timestamp: data.timestamp ? data.timestamp as Timestamp : Timestamp.now(),
      shortSummary: data.shortSummary || "No short summary available",
    };
    return entry;
  });
}

// Listen for real-time updates on user's journal entries
export function listenToUserEntries(userId: string, callback: (entries: (EntryInput & { id: string })[]) => void) {

  const q = query(
    collection(db, "users", userId, "journalEntries"),
    orderBy("timestamp", "desc") // Ensure sorting
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const formattedEntries = snapshot.docs.map(doc => {
      const data = doc.data() as Partial<EntryInput>;
      const rawCategories = data.categories as unknown;
      const categories =
        typeof rawCategories === "string"
          ? (rawCategories as string)
              .split(',')
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0)
          : (data.categories || []);
        const identifiedHardSkills = data.hardSkills
        ? data.hardSkills.split(",").map(s => s.trim())
        : [];
      const identifiedSoftSkills = data.softSkills
        ? data.softSkills.split(",").map(s => s.trim())
        : [];
      return {
        ...data,
        id: doc.id,
        title: data.title || "Untitled",
        content: data.content || "",
        summary: data.summary || "No summary available",
        identifiedHardSkills,
        identifiedSoftSkills,
        reflection: data.reflection || "No reflection available",
        categories,
        timestamp: data.timestamp ? data.timestamp as Timestamp : Timestamp.now(),
        shortSummary: data.shortSummary || "No short summary available",
      } as EntryInput & { id: string };;
    });  
    callback(formattedEntries);
  });
  return unsubscribe;
}

export async function postJobInfo(userId: string, jobInfo: JobInfo){
  await addDoc(collection(db, "users", userId, "jobs"), {
    positionName: jobInfo.positionName,
    jobPosting: jobInfo.jobPosting,
    companyInfo: jobInfo.companyInfo,
    keyStrength: jobInfo.keyStrength,
    interviewQ: jobInfo.interviewQ,
  });
}


export async function updateUserEntry(userId: string, entryId: string, updatedData: Partial<EntryInput>) {
  try {
    const entryRef = doc(db, "users", userId, "journalEntries", entryId);
    await updateDoc(entryRef, {
      title: updatedData.title || "Untitled",
      // content: updatedData.content,
      // summary: updatedData.summary,
      hardSkills: updatedData.hardSkills,
      softSkills: updatedData.softSkills,
      reflection: updatedData.reflection,
      categories: updatedData.categories ?? [],
      shortSummary: updatedData.shortSummary || "no shortSummary here",
      // You can also update the timestamp if needed:
      // timestamp: updatedData.timestamp,
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
}

export async function saveUserBlurb(userId: string, blurb: string){
  await setDoc(doc(db, "users", userId), {blurb: blurb}, {merge: true});
}

export async function getUserBlurb(userId: string): Promise<string | null> {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists() && userDoc.data().blurb) {
    return userDoc.data().blurb;
  } else {
    return null;
  }
}
