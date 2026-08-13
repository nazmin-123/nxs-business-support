import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { demoStore, IS_DEMO_MODE } from './demoStore';

// Firebase configuration from environment or fallback placeholders
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSy_DEMO_KEY_NXS_BUSINESS',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nxs-business-support.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nxs-business-support',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nxs-business-support.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

/**
 * Perform Google SSO Authentication
 */
export async function signInWithGoogle() {
  if (IS_DEMO_MODE || !import.meta.env.VITE_FIREBASE_API_KEY) {
    // Demo Mode Google SSO simulation
    console.log('🔑 Demo Google SSO Active: Logging in Alexander Wright...');
    return demoStore.getUser();
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Sync profile to Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName || 'Business Owner',
        email: user.email || '',
        stripe_customer_id: null,
        subscription_status: 'active',
        currency_preference: 'INR',
        created_at: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    console.warn('Firebase Auth failed, falling back to Demo User:', error);
    return demoStore.getUser();
  }
}

export async function logoutUser() {
  if (IS_DEMO_MODE || !import.meta.env.VITE_FIREBASE_API_KEY) {
    console.log('Logged out of demo session');
    return;
  }
  await firebaseSignOut(auth);
}
