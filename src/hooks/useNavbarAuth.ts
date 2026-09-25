import { useEffect, useState } from 'react';

const TOKEN_KEY = 'er_admin_token';

export interface NavUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useNavbarAuth() {
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) { setUser(null); return; }
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(u => setUser(u))
        .catch(() => setUser(null));
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-changed', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-changed', onStorage);
    };
  }, []);

  return user;
}