import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


// const firebaseConfig = {
//   apiKey: "AIzaSyCOM_LxWNSVW85EXbENmd1A8EOKFfP0bwM",
//   authDomain: "floppi-c55d5.firebaseapp.com",
//   projectId: "floppi-c55d5",
//   storageBucket: "floppi-c55d5.firebasestorage.app",
//   messagingSenderId: "553154371566",
//   appId: "1:553154371566:web:f285302562e6b4d72238ff",
//   measurementId: "G-B2KGWQG71F"
// };

const firebaseConfig = {
  apiKey: `${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}`,
  authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.EXPO_PUBLIC_FIREBASE_APP_ID}`,
  measurementId: `${process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID}`
};

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider, db};