import { User } from 'firebase/auth';
import {db} from './firebaseInit';
import { collection, getDocs, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore/lite';

// type for journal entry
interface Entry {
    timestamp: Timestamp;
    title: string;
    content: string;
}

interface UserInfo {
    uid: string;
    displayName: string;
    email: string;
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
    // Add a new document with a generated user id.
    await addDoc(collection(db, "users", userId, "journalEntries"), entryData);
}

// input: userInfo {uid: string, displayName: string, email: string}
export async function postUser(userInfo: UserInfo) {
    await setDoc(doc(db, 'users', userInfo.uid), userInfo);
}