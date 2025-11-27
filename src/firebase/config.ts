'use client';

// Import the functions you need from the SDKs you need
import { initializeApp }from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcJ-WZaG2l26K0MFLCQbTUX19qGkwzOVc",
  authDomain: "sample-firebase-ai-app-ca6ce.firebaseapp.com",
  projectId: "sample-firebase-ai-app-ca6ce",
  storageBucket: "sample-firebase-ai-app-ca6ce.appspot.com",
  messagingSenderId: "957367123804",
  appId: "1:957367123804:web:8b0192ed8f62678e054b99"
};

function initializeFirebase() {
  return initializeApp(firebaseConfig);
}

export { initializeFirebase, firebaseConfig };
