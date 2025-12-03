
'use client';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const saveUserToFirestore = async (user: User) => {
  const firestore = getFirestore(getApp());
  const userRef = doc(firestore, 'users', user.uid);
  const userData = {
    id: user.uid,
    name: user.displayName || 'Anonymous User',
    avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`, // Fallback avatar
    email: user.email,
    status: 'online',
    lastSeen: serverTimestamp(),
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

export async function signUpWithEmailAndPassword(auth: Auth, email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update the user's profile with the display name
  await updateProfile(user, { displayName });
  
  // Reload the user to get the updated profile information
  await user.reload();
  const updatedUser = auth.currentUser;

  if (updatedUser) {
    // Save user to Firestore with updated info
    await saveUserToFirestore(updatedUser);
    
    // Send verification email
    await sendEmailVerification(updatedUser);
  }


  return userCredential;
}

export function signInWithEmailAndPassword(auth: Auth, email: string, password: string) {
    return firebaseSignInWithEmailAndPassword(auth, email, password);
}


export async function signOut(auth: Auth) {
  if (auth.currentUser) {
    const firestore = getFirestore(getApp());
    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    await setDoc(userRef, { status: 'offline', lastSeen: serverTimestamp() }, { merge: true });
  }
  return firebaseSignOut(auth);
}
