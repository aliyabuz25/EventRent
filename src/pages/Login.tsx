import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, User as UserIcon, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mapping username to a real firebase account for testing as requested
      // If password is not provided, we use a default one
      let email = username;
      let pass = password || '123456';
      let isDemoUser = false;
      
      if (!username.includes('@')) {
        email = `${username.toLowerCase()}@red.az`;
        isDemoUser = true;
      }

      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (err: any) {
        // If demo user doesn't exist, create it once for demo purposes
        if (isDemoUser && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
          const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
          const userCred = await createUserWithEmailAndPassword(auth, email, pass);
          await updateProfile(userCred.user, { displayName: username.charAt(0).toUpperCase() + username.slice(1) });
        } else {
          throw err;
        }
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('İstifadəçi adı və ya şifrə yanlışdır.');
      } else {
        setError('Giriş zamanı xəta baş verdi. Yenidən cəhd edin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    // Direct Demo Mode login to ensure it works immediately as requested
    // We don't even try Firebase here to avoid any potential environment/config issues
    try {
      localStorage.setItem('demo_mode', 'true');
      localStorage.setItem('demo_user_name', 'Tural Rəhimov');
      
      // Small delay for visual feedback
      setTimeout(() => {
        navigate('/profile', { replace: true });
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Giriş zamanı xəta baş verdi.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        // Just ignore or show a subtle message
        setError('Giriş pəncərəsi bağlandı.');
      } else {
        setError('Google ilə giriş zamanı xəta baş verdi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-2xl shadow-black/5 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Xoş gəlmisiniz</h1>
          <p className="text-gray-500 text-sm">Sifarişlərinizi izləmək üçün daxil olun. <br/> <span className="text-red-500 font-bold">Şifrə tələb olunmur!</span></p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-6 rounded-3xl font-bold text-xl hover:bg-red-700 transition-all active:scale-95 shadow-2xl shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Giriş edilir...
              </>
            ) : (
              <>
                Daxil ol <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">və ya</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-5 rounded-3xl font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Google ilə daxil ol
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">və ya</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Google ilə daxil ol
        </button>

        <p className="text-center text-sm text-gray-500">
          Hesabınız yoxdur? <button className="text-red-600 font-bold hover:underline">Qeydiyyatdan keçin</button>
        </p>
      </div>
    </div>
  );
}
