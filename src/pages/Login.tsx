import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSiteContent } from '../content.context';
import { t } from '../content';

export default function Login() {
  const { locale } = useSiteContent();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/profile';

  const labels = {
    welcomeTitle:     { az: 'Xoş gəlmisiniz',       en: 'Welcome',             ru: 'Добро пожаловать',    tr: 'Hoş geldiniz' },
    welcomeSubtitle:  { az: 'Sifarişlərinizi izləmək üçün daxil olun.', en: 'Sign in to track your orders.', ru: 'Войдите для отслеживания заказов.', tr: 'Siparişlerinizi takip etmek için giriş yapın.' },
    noPasswordNote:  { az: 'Şifrə tələb olunmur!', en: 'No password required!', ru: 'Пароль не требуется!',  tr: 'Şifre gerekmiyor!' },
    loginBtn:         { az: 'Daxil ol',             en: 'Sign In',              ru: 'Войти',               tr: 'Giriş yap' },
    loggingIn:        { az: 'Giriş edilir...',      en: 'Signing in...',        ru: 'Вход...',             tr: 'Giriş yapılıyor...' },
    orDivider:        { az: 'və ya',                 en: 'or',                  ru: 'или',                 tr: 'veya' },
    googleBtn:        { az: '{t(locale, labels.googleBtn)}',    en: 'Continue with Google', ru: 'Войти через Google',  tr: 'Google ile giriş yap' },
    noAccountText:    { az: 'Hesabınız yoxdur?',    en: "Don't have an account?", ru: 'Нет аккаунта?',       tr: 'Hesabınız yok mu?' },
    registerBtn:      { az: 'Qeydiyyatdan keçin',    en: 'Sign up',             ru: 'Зарегистрироваться',   tr: 'Kayıt olun' },
    invalidCreds:     { az: 'İstifadəçi adı və ya şifrə yanlışdır.', en: 'Invalid username or password.', ru: 'Неверное имя пользователя или пароль.', tr: 'Kullanıcı adı veya şifre yanlış.' },
    loginError:       { az: 'Giriş zamanı xəta baş verdi. Yenidən cəhd edin.', en: 'Login failed. Please try again.', ru: 'Ошибка входа. Попробуйте снова.', tr: 'Giriş başarısız. Tekrar deneyin.' },
    popupClosed:      { az: 'Giriş pəncərəsi bağlandı.', en: 'Login popup was closed.', ru: 'Окно входа закрыто.', tr: 'Giriş penceresi kapatıldı.' },
    googleError:      { az: 'Google ilə giriş zamanı xəta baş verdi.', en: 'Google login failed.', ru: 'Ошибка входа через Google.', tr: 'Google ile giriş başarısız.' },
  };

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
        setError(t(locale, labels.invalidCreds));
      } else {
        setError(t(locale, labels.loginError));
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
      localStorage.setItem('demo_user_name', t(locale, { az: 'Tural Rəhimov', en: 'Tural Rahimov', ru: 'Турал Рагимов', tr: 'Tural Rəhimov' }));
      
      // Small delay for visual feedback
      setTimeout(() => {
        navigate('/profile', { replace: true });
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(t(locale, labels.loginError));
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
        setError(t(locale, labels.popupClosed));
      } else {
        setError(t(locale, labels.googleError));
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
          <h1 className="text-2xl font-bold tracking-tight">{t(locale, labels.welcomeTitle)}</h1>
          <p className="text-gray-500 text-sm">{t(locale, labels.welcomeSubtitle)}<br/><span className="text-red-500 font-bold">{t(locale, labels.noPasswordNote)}</span></p>
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
                {t(locale, labels.loggingIn)}
              </>
            ) : (
              <>
                {t(locale, labels.loginBtn)} <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">{t(locale, labels.orDivider)}</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-5 rounded-3xl font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            {t(locale, labels.googleBtn)}
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
          {t(locale, labels.googleBtn)}
        </button>

        <p className="text-center text-sm text-gray-500">
          {t(locale, labels.noAccountText)} <button type="button" className="text-red-600 font-bold hover:underline">{t(locale, labels.registerBtn)}</button>
        </p>
      </div>
    </div>
  );
}
