'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

export function signInWithGoogle(auth: Auth) {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signOut(auth: Auth) {
  return firebaseSignOut(auth);
}
