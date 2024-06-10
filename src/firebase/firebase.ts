import { getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBRVmjuBkOol80IJED2uJSdRLc133O8Og8',
  authDomain: 'finalproject-3efdb.firebaseapp.com',
  projectId: 'finalproject-3efdb',
  storageBucket: 'finalproject-3efdb.appspot.com',
  messagingSenderId: '211934481656',
  appId: '1:211934481656:web:f8319a5685c3ce5144ff0d',
  measurementId: 'G-37W1LYX2DZ',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, auth, db, storage };
