import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../types/enitites';

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  const userData: User = {
    id: user.uid,
    username: email, // You can customize this field as needed
    email: email,
    likedPictures: [],
  };

  // Add user data to Firestore
  await setDoc(doc(db, 'users', user.uid), userData);

  return userCredential;
};

export async function doSignInWithEmailAndPassword(
  email: string,
  password: string,
) {
  const result = signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      console.log('signed in');
      console.log(userCredential.user);
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error', errorCode, errorMessage);
    });

  return result;
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  //  result.user
  return result;
};

export const doSignOut = async () => {
  return auth.signOut();
};
