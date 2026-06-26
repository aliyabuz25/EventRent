import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

export function useNavbarAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => setUser(nextUser));
    return () => unsub();
  }, []);

  return user;
}