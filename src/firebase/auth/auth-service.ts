'use client';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const saveUserToFirestore = async (user: User) => {
  const firestore = getFirestore(getApp());
  const userRef = doc(firestore, 'users', user.uid);
  const userData = {
    id: user.uid,
    name: user.displayName || 'Anonymous User',
    avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`, // Fallback avatar
    email: user.email,
  };
  // Use setDoc with merge to create or update the user document
  await setDoc(userRef, userData, { merge: true });
};

export async function signInWithGoogle(auth: Auth) {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // After sign-in, save the user to Firestore
  await saveUserToFirestore(result.user);
  return result;
}

export function signOut(auth: Auth) {
  return firebaseSignOut(auth);
}
