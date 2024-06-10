import { getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZCadIHcqvsyMujD3s0gdukRWuv6dMLJU",
  authDomain: "licenta-37c86.firebaseapp.com",
  projectId: "licenta-37c86",
  storageBucket: "licenta-37c86.appspot.com",
  messagingSenderId: "723316395357",
  appId: "1:723316395357:web:2ec0de018cb63e8afb2cb4"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, auth, db, storage };
