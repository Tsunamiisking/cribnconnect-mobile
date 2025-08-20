// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import getAnalytics from 'firebase/analytics'
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB90dWTnnbAwqhs3QNnWncmnRi1PBsQaOs",
  authDomain: "cribandconnect.firebaseapp.com",
  projectId: "cribandconnect",
  storageBucket: "cribandconnect.firebasestorage.app",
  messagingSenderId: "908984266223",
  appId: "1:908984266223:web:fdf81e12346d22cd781a1a",
  measurementId: "G-Y6LEK89W96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Cloud Functions and get a reference to the service
const functions = getFunctions(app);

export { auth, db, storage, functions };
export default app;
