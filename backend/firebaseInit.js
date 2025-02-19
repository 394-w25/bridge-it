import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore/lite';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOM_LxWNSVW85EXbENmd1A8EOKFfP0bwM",
  authDomain: "floppi-c55d5.firebaseapp.com",
  projectId: "floppi-c55d5",
  storageBucket: "floppi-c55d5.firebasestorage.app",
  messagingSenderId: "553154371566",
  appId: "1:553154371566:web:f285302562e6b4d72238ff",
  measurementId: "G-B2KGWQG71F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;