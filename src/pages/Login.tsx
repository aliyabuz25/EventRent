import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, ArrowRight, Mail, Lock, Eye, EyeOff, User, X } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSiteContent } from '../content.context';
import { t } from '../content';

const TOKEN_KEY = 'er_admin_token';

export default function Login() {
  const { locale } = useSiteContent();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Register form state
  const [rName, setRName]         = useState('');
  const [rEmail, setREmail]       = useState('');
  const [rPass, setRPass]         = useState('');
  const [rShowPass, setRShowPass] = useState(false);
  const [rError, setRError]       = useState<string | null>(null);
  const [rLoading, setRLoading]   = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = (location.state as any)?.from?.pathname || '/profile';

  const L = {
    welcomeTitle:    { az: 'Xoş gəlmisiniz',       en: 'Welcome back',          ru: 'Добро пожаловать',   tr: 'Hoş geldiniz' },
    welcomeSubtitle: { az: 'Sifarişlərinizi izləmək üçün daxil olun.', en: 'Sign in to track your orders.', ru: 'Войдите для отслеживания заказов.', tr: 'Siparişlerinizi takip etmek için giriş yapın.' },
    emailLabel:      { az: 'Email',                  en: 'Email',                 ru: 'Email',              tr: 'Email' },
    passLabel:       { az: 'Şifrə',                  en: 'Password',              ru: 'Пароль',             tr: 'Şifre' },
    loginBtn:        { az: 'Daxil ol',               en: 'Sign In',               ru: 'Войти',              tr: 'Giriş yap' },
    loggingIn:       { az: 'Giriş edilir...',         en: 'Signing in...',         ru: 'Вход...',            tr: 'Giriş yapılıyor...' },
    orDivider:       { az: 'və ya',                   en: 'or',                   ru: 'или',                tr: 'veya' },
    googleBtn:       { az: 'Google ilə daxil ol',     en: 'Continue with Google', ru: 'Войти через Google', tr: 'Google ile giriş yap' },
    noAccountText:   { az: 'Hesabınız yoxdur?',       en: "Don't have an account?", ru: 'Нет аккаунта?',    tr: 'Hesabınız yok mu?' },
    registerBtn:     { az: 'Qeydiyyatdan keçin',      en: 'Sign up',              ru: 'Зарегистрироваться', tr: 'Kayıt olun' },
    regTitle:        { az: 'Qeydiyyat',               en: 'Create Account',       ru: 'Регистрация',        tr: 'Kayıt Ol' },
    regName:         { az: 'Ad Soyad',                en: 'Full Name',            ru: 'Имя Фамилия',        tr: 'Ad Soyad' },
    regEmail:        { az: 'Email',                   en: 'Email',                ru: 'Email',              tr: 'Email' },
    regPass:         { az: 'Şifrə',                   en: 'Password',             ru: 'Пароль',             tr: 'Şifre' },
    regBtn:          { az: 'Qeydiyyatdan keç',        en: 'Create Account',       ru: 'Зарегистрироваться', tr: 'Kayıt Ol' },
    regError:        { az: 'Qeydiyyat zamanı xəta.',  en: 'Registration failed.', ru: 'Ошибка регистрации.', tr: 'Kayıt başarısız.' },
    alreadyAccount:  { az: 'Artıq hesabınız var?',    en: 'Already have an account?', ru: 'Уже есть аккаунт?', tr: 'Zaten hesabınız var mı?' },
    signInLink:      { az: 'Daxil olun',              en: 'Sign in',              ru: 'Войти',              tr: 'Giriş yap' },
    invalidCreds:    { az: 'Email və ya şifrə yanlışdır.', en: 'Invalid email or password.', ru: 'Неверный email или пароль.', tr: 'Email veya şifre yanlış.' },
    loginError:      { az: 'Giriş zamanı xəta baş verdi.', en: 'Login failed. Please try again.', ru: 'Ошибка входа.', tr: 'Giriş başarısız.' },
    popupClosed:     { az: 'Giriş pəncərəsi bağlandı.', en: 'Login popup was closed.', ru: 'Окно входа закрыто.', tr: 'Giriş penceresi kapatıldı.' },
    googleError:     { az: 'Google ilə giriş alınmadı.', en: 'Google login failed.', ru: 'Ошибка Google входа.', tr: 'Google ile giriş başarısız.' },
  };

  /* ── Email / password login → backend JWT ── */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t(locale, L.invalidCreds)); return; }
      localStorage.setItem(TOKEN_KEY, data.token);
      window.dispatchEvent(new Event('auth-changed'));
      navigate(from, { replace: true });
    } catch { setError(t(locale, L.loginError)); }
    finally { setIsLoading(false); }
  };

  /* ── Google login → Firebase ── */
  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError(t(locale, L.popupClosed));
      } else {
        setError(t(locale, L.googleError));
      }
    } finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRError(null);
    setRLoading(true);
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rName, email: rEmail.trim().toLowerCase(), password: rPass }),
      });
      const data = await res.json();
      if (!res.ok) { setRError(data.error || t(locale, L.regError)); return; }
      localStorage.setItem(TOKEN_KEY, data.token);
      window.dispatchEvent(new Event('auth-changed'));
      setShowRegister(false);
      navigate(from, { replace: true });
    } catch { setRError(t(locale, L.regError)); }
    finally { setRLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-premium-orange/10 rounded-full blur-[80px] pointer-events-none -z-10" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-premium-orange shadow-inner">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white mt-4">{t(locale, L.welcomeTitle)}</h1>
          <p className="text-white/50 text-sm font-medium">{t(locale, L.welcomeSubtitle)}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold backdrop-blur-md relative z-10 mt-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6 relative z-10 mt-8">
          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-white/50 mb-2">
                {t(locale, L.emailLabel)}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/20 rounded-2xl py-4 pl-11 pr-4 text-sm font-medium outline-none focus:border-premium-orange/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-white/50 mb-2">
                {t(locale, L.passLabel)}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/20 rounded-2xl py-4 pl-11 pr-11 text-sm font-medium outline-none focus:border-premium-orange/50 focus:bg-white/[0.08] transition-all"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-3 bg-white text-black py-5 rounded-[20px] font-black text-base hover:text-white transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] disabled:opacity-50 cursor-pointer"
              onMouseEnter={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`); }}
              onMouseLeave={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`); }}
            >
              <div className="absolute inset-0 bg-premium-orange pointer-events-none z-0 [clip-path:circle(0px_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))] transition-[clip-path] duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                  <><div className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent rounded-full animate-spin transition-colors" />{t(locale, L.loggingIn)}</>
                ) : (
                  <>{t(locale, L.loginBtn)} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#111] px-4 text-white/40 font-black">{t(locale, L.orDivider)}</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-[20px] font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {t(locale, L.googleBtn)}
          </button>
        </div>

        <p className="text-center text-sm text-white/50 mt-8 relative z-10">
          {t(locale, L.noAccountText)}{' '}
          <button type="button" onClick={() => { setShowRegister(true); setRError(null); }} className="text-premium-orange font-bold hover:underline">
            {t(locale, L.registerBtn)}
          </button>
        </p>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} onClick={() => setShowRegister(false)}>
          <div className="bg-[#111] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRegister(false)} className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-premium-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-premium-orange">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white">{t(locale, L.regTitle)}</h2>
            </div>

            {rError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {rError}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{t(locale, L.regName)}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input type="text" required value={rName} onChange={e => setRName(e.target.value)} placeholder="Ad Soyad"
                    className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-premium-orange/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{t(locale, L.regEmail)}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input type="email" required value={rEmail} onChange={e => setREmail(e.target.value)} placeholder="email@example.com"
                    className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-premium-orange/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{t(locale, L.regPass)}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input type={rShowPass ? 'text' : 'password'} required minLength={6} value={rPass} onChange={e => setRPass(e.target.value)} placeholder="••••••••"
                    className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/20 rounded-2xl py-3.5 pl-11 pr-11 text-sm font-medium outline-none focus:border-premium-orange/50 transition-all" />
                  <button type="button" onClick={() => setRShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {rShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={rLoading}
                className="w-full bg-premium-orange hover:bg-premium-orange/90 text-white font-black py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {rLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {t(locale, L.loggingIn)}</> : t(locale, L.regBtn)}
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-5">
              {t(locale, L.alreadyAccount)}{' '}
              <button type="button" onClick={() => setShowRegister(false)} className="text-premium-orange font-bold hover:underline">
                {t(locale, L.signInLink)}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}