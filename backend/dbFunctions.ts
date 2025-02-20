import db from './firebaseInit';
import { orderBy, collection, query, onSnapshot, getDocs, addDoc, Timestamp } from 'firebase/firestore';

// type for journal entry
interface EntryInput {
  title: string;
  content: string;
}

interface Entry extends EntryInput {
    timestamp: Timestamp;
}

// input: userId (string)
// output: array of journal entries [{timestamp: string, title: string, content: string}, ...]
export async function getUserEntries(userId: string) {
    // Query a reference to a subcollection and order by timestamp (newest first)
    const q = query(
      collection(db, "users", userId, "journalEntries"),
      orderBy("timestamp", "desc")
    )

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data()) as Entry[];
}

// input: userId (string), entryData({title: string, content: string})
export async function postUserEntry(userId: string, entryData: EntryInput) {
    await addDoc(collection(db, "users", userId, "journalEntries"), {
      ...entryData,
      timestamp: Timestamp.now(), // Use Firestore Timestamp format
    });
  }
  
// input: userId (string), callback function to handle real-time updates
export function listenToUserEntries(userId: string, callback: (entries: Entry[]) => void) {
    const q = query(
      collection(db, "users", userId, "journalEntries"),
      orderBy("timestamp", "desc")
    );

    // Subscribe to Firestore updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(doc => doc.data()) as Entry[];
        callback(entries);
    });

    return unsubscribe; // Return the unsubscribe function to stop listening when needed
}