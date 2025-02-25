import db from './firebaseInit';
import { orderBy, collection, query, onSnapshot, getDocs, addDoc, Timestamp } from 'firebase/firestore';

// Type for journal entry stored in Firestore
interface EntryInput {
  title: string;
  content: string;
}

// Type for formatted journal entry sent to React
interface Entry extends EntryInput {
  timestamp: string; // ISO string format
  day: string;
  date: string;
}

// Convert Firestore Timestamp to formatted day and date
function formatTimestamp(timestamp: Timestamp) {
  const dateObj = timestamp.toDate();
  return {
    timestamp: dateObj.toISOString(), // Keep timestamp as a string
    day: dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(), // "MON"
    date: dateObj.getDate().toString().padStart(2, "0"), // "01"
  };
}

// Fetch user entries (sorted by timestamp)
export async function getUserEntries(userId: string): Promise<Entry[]> {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const entry = doc.data() as EntryInput & { timestamp: Timestamp };
    return {
      ...entry,
      ...formatTimestamp(entry.timestamp), // Pre-process timestamp
    };
  });
}

// Add a new journal entry (storing only timestamp)
export async function postUserEntry(userId: string, entryData: EntryInput) {
  await addDoc(collection(db, "users", userId, "journalEntries"), {
    ...entryData,
    timestamp: Timestamp.now(), // Store timestamp only
  });
}

// Listen for real-time updates on user's journal entries
export function listenToUserEntries(userId: string, callback: (entries: Entry[]) => void) {
  const q = query(
    collection(db, "users", userId, "journalEntries"),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const formattedEntries = snapshot.docs.map(doc => {
      const entry = doc.data() as EntryInput & { timestamp: Timestamp };
      return {
        ...entry,
        ...formatTimestamp(entry.timestamp), // Pre-process timestamp
      };
    });

    callback(formattedEntries);
  });

  return unsubscribe;
}
