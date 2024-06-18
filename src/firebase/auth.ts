import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { User, PictureGroup } from '../types/enitites';

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

  // Create a new document reference for the default picture group
  const defaultGroupRef = doc(collection(db, 'pictureGroups'));
  const defaultGroupId = defaultGroupRef.id;

  const defaultPictureGroup: PictureGroup = {
    id: defaultGroupId,
    name: 'Generated Images',
    pictures: [],
    isPrivate: true,
  };

  const userData: Partial<User> = {
    id: user.uid,
    username: email, // You can customize this field as needed
    email: email,
    likedPictures: [],
    profilePic: '',
    pictureGroups: [defaultPictureGroup],
  };

  // Add user data to Firestore
  await setDoc(doc(db, 'users', user.uid), userData);

  console.log(
    `Created new user with ID ${user.uid} and added default picture group`,
  );

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
