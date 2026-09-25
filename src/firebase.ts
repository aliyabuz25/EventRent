import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Admin emails managed via environment variable
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'alex.sago@gmail.com').split(',').map(e => e.trim());

export async function ensureUserDoc(user: any) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  const isAdmin = ADMIN_EMAILS.some(adminEmail => user.email?.toLowerCase() === adminEmail.toLowerCase());

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: isAdmin ? 'admin' : 'client',
      createdAt: serverTimestamp()
    });
  } else {
    const currentRole = userSnap.data().role;
    if (isAdmin && currentRole !== 'admin') {
      await setDoc(userRef, { role: 'admin' }, { merge: true });
    }
  }
}
