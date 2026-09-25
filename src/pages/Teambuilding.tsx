import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase';
import { cn } from '../lib/utils';
import TeambuildingGrid from '../sections/teambuilding/TeambuildingGrid';
import TeambuildingDetailView from '../sections/teambuilding/TeambuildingDetailView';
import TeambuildingAuthModal from '../sections/teambuilding/TeambuildingAuthModal';
import { useCart } from '../hooks/useCart';

// Firebase Phone Auth recaptcha globals
declare global {
  interface Window {
    recaptchaVerifier?: any;
    RecaptchaVerifier?: any;
  }
}

export default function Teambuilding() {
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type');

  const [games, setGames]       = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'games' | 'concepts'>('games');
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [step, setStep] = useState<'list' | 'register' | 'otp' | 'details' | 'concept-select'>('list');

  const [formData, setFormData] = useState({ name: '', phone: '', company: '' });
  const [otp, setOtp] = useState('');
  const [verifiedGames, setVerifiedGames] = useState<Set<string>>(new Set());
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<any>(null);
  const [phone, setPhone] = useState('');
  const { addItem } = useCart();

  const [orderExtraData, setOrderExtraData] = useState({
    location: '',
    participants: '',
    date: ''
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/tb/games').then(r => r.json()),
      fetch('/api/tb/concepts').then(r => r.json()),
    ]).then(([g, c]) => {
      setGames(Array.isArray(g) ? g.filter((x: any) => x.active) : []);
      setConcepts(Array.isArray(c) ? c.filter((x: any) => x.active) : []);
    }).catch(() => {}).finally(() => setDataLoading(false));
  }, []);

  useEffect(() => {
    if (typeFilter) {
      setActiveTab('games');
    }
    if (recaptchaRef.current && !recaptchaVerifier.current) {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }
      const verifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {}
      });
      recaptchaVerifier.current = verifier;
      (window as any).recaptchaVerifier = verifier;
    }
    return () => {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = undefined;
      }
    };
  }, [typeFilter]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const filteredGames = typeFilter
    ? games.filter(g => g.category.toLowerCase() === typeFilter.toLowerCase())
    : games;

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
    if (verifiedGames.has(game.id)) {
      setStep('details');
    } else {
      setStep('register');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaVerifier.current) {
      alert('Recaptcha hazır deyil. Bir az gözləyin.');
      return;
    }
    try {
      const fullPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaVerifier.current);
      setConfirmationResult(result);
      setStep('otp');
      setOtpTimer(60);
      setOtpError(null);
      setOtpAttempts(0);
    } catch (err: any) {
      alert(`SMS göndərilə bilmadi: ${err.message}`);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      setOtpError('OTP sessiyası baş tutmadı. Yenidən kod alın.');
      return;
    }
    if (otpAttempts >= 3) {
      setOtpError('Çox sayda yanlış cəhd. Yenidən kod alın.');
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      const newVerified = new Set(verifiedGames);
      newVerified.add(selectedGame.id);
      setVerifiedGames(newVerified);
      setStep('details');
      setOtpError(null);
      setOtp('');
    } catch (err: any) {
      setOtpAttempts(a => a + 1);
      const remaining = 3 - (otpAttempts + 1);
      setOtpError(remaining > 0 ? `Yanlış kod. Qalan cəhd: ${remaining}` : 'Yanlış kod. Yenidən kod alın.');
    }
  };

  const handleOrder = async () => {
    if (!selectedGame || !selectedConcept) return;

    try {
      addItem({
        productId: `tb-${Date.now()}`,
        quantity: 1,
        technicalAnswers: {
          'Oyun': selectedGame.name,
          'Konsepsiya': selectedConcept.name,
          'Məkan': orderExtraData.location,
          'İştirakçı sayı': orderExtraData.participants,
          'Tarix': orderExtraData.date,
        },
      } as any);

      alert('Sifarişiniz səbətə əlavə olundu!');
      setStep('list');
      setSelectedGame(null);
      setSelectedConcept(null);
      setOrderExtraData({ location: '', participants: '', date: '' });
    } catch (error) {
      console.error('Order error:', error);
      alert('Sifariş zamanı xəta baş verdi.');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {step === 'details' && selectedGame ? (
        <TeambuildingDetailView
          selectedGame={selectedGame}
          selectedConcept={selectedConcept}
          setSelectedConcept={setSelectedConcept}
          orderExtraData={orderExtraData}
          setOrderExtraData={setOrderExtraData}
          handleOrder={handleOrder}
          setStep={setStep}
          concepts={concepts}
        />
      ) : (
        <>
          <div className="relative -mt-[72px] pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-b from-brand-bg via-brand-bg to-brand-card overflow-hidden">
            {/* Nazik ambient glow */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
              <div
                className="absolute top-0 left-1/4 w-[40vw] h-[50%]"
                style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }}
              />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-5 h-px bg-premium-orange" />
                <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">Team Building</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-8">
                Komanda<br />
                <span className="text-white/50 italic">Tədbirləri.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed">
                Komandanızı gücləndirən yaradıcı və interaktiv etkinlik həlləri.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('games')}
                className={cn(
                  "px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
                  activeTab === 'games' ? "bg-white text-black shadow-2xl" : "bg-white/5 text-gray-500 hover:bg-white/10"
                )}
              >
                Oyunlar
              </button>
              <button
                onClick={() => setActiveTab('concepts')}
                className={cn(
                  "px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
                  activeTab === 'concepts' ? "bg-white text-black shadow-2xl" : "bg-white/5 text-gray-500 hover:bg-white/10"
                )}
              >
                Konsepsiya
              </button>
            </div>
          </div>

          <TeambuildingGrid
            activeTab={activeTab}
            filteredGames={filteredGames}
concepts={concepts}
          verifiedGames={verifiedGames}
          onGameClick={handleGameClick}
          />
        </>
      )}

      <TeambuildingAuthModal
        step={step}
        setStep={setStep}
        formData={formData}
        setFormData={setFormData}
        phone={phone}
        setPhone={setPhone}
        otp={otp}
        setOtp={setOtp}
        handleRegister={handleRegister}
        handleVerifyOtp={handleVerifyOtp}
      />
    </div>
  );
}
