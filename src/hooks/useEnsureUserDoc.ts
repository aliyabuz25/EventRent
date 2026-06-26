import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, ensureUserDoc } from '../firebase';

export function useEnsureUserDoc() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) await ensureUserDoc(user);
    });
    return () => unsubscribe();
  }, []);
}

