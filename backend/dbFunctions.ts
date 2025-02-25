import {db} from './firebaseInit';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore/lite';

// type for journal entry
interface Entry {
    timestamp: Timestamp;
    title: string;
    content: string;
}

// input: userId (string)
// output: array of journal entries [{timestamp: string, title: string, content: string}, ...]
export async function getUserEntries(userId: string) {
    // Query a reference to a subcollection
    const querySnapshot = await getDocs(collection(db, "users", userId, "journalEntries"));
    return querySnapshot.docs.map(doc => doc.data()) as Entry[];
}

// input: userId (string), entry {timestamp: string, title: string, content: string}
export async function postUserEntry(userId: string, entryData: Entry) {
    // Add a new document with a generated id.
    await addDoc(collection(db, "users", userId, "journalEntries"), entryData);
}