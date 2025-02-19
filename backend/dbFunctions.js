import { db } from './firebaseInit.js';
import { collection, getDocs } from 'firebase/firestore/lite';

// input: userId (string)
// output: array of journal entries [{timestamp: string, title: string, content: string}, ...]
export async function getUserEntries(userId) {
    data = [];
    // Query a reference to a subcollection
    const querySnapshot = await getDocs(collection(db, "users", userId, "journalEntries"));
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
        console.log(doc.id, " => ", doc.data());
    });
    return data;
}

// input: userId (string), entry {timestamp: string, title: string, content: string}
export async function postUserEntry(userId, entry) {
    // Add a new document with a generated id.
    await addDoc(collection(db, "users", userId, "journalEntries"), entry);
}