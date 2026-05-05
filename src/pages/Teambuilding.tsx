import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { GAMES, CONCEPTS } from '../data/teambuilding';
import TeambuildingHero from '../sections/teambuilding/TeambuildingHero';
import TeambuildingGrid from '../sections/teambuilding/TeambuildingGrid';
import TeambuildingDetailView from '../sections/teambuilding/TeambuildingDetailView';
import TeambuildingAuthModal from '../sections/teambuilding/TeambuildingAuthModal';

export default function Teambuilding() {
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type');
  
  const [activeTab, setActiveTab] = useState<'games' | 'concepts'>('games');
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [step, setStep] = useState<'list' | 'register' | 'otp' | 'details' | 'concept-select'>('list');
  
  const [formData, setFormData] = useState({ name: '', phone: '', company: '' });
  const [otp, setOtp] = useState('');
  const [verifiedGames, setVerifiedGames] = useState<Set<string>>(new Set());
  
  const [orderExtraData, setOrderExtraData] = useState({
    location: '',
    participants: '',
    date: ''
  });

  useEffect(() => {
    if (typeFilter) {
      setActiveTab('games');
    }
  }, [typeFilter]);

  const filteredGames = typeFilter 
    ? GAMES.filter(g => g.category.toLowerCase() === typeFilter.toLowerCase())
    : GAMES;

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
    if (verifiedGames.has(game.id)) {
      setStep('details');
    } else {
      setStep('register');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('OTP Kodunuz: 123456'); 
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      const newVerified = new Set(verifiedGames);
      newVerified.add(selectedGame.id);
      setVerifiedGames(newVerified);
      setStep('details');
    } else {
      alert('Yanlış OTP kod! (Şərti kod: 123456)');
    }
  };

  const handleOrder = async () => {
    if (!selectedGame || !selectedConcept) return;

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({
        id: `tb-${Date.now()}`,
        name: `${selectedGame.name} (${selectedConcept.name})`,
        price: 0,
        quantity: 1,
        image: selectedGame.image,
        type: 'teambuilding',
        technicalAnswers: {
          'Konsepsiya': selectedConcept.name,
          'Məkan': orderExtraData.location,
          'İştirakçı sayı': orderExtraData.participants,
          'Tarix': orderExtraData.date
        }
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));

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
          concepts={CONCEPTS}
        />
      ) : (
        <>
          <TeambuildingHero />

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
            concepts={CONCEPTS}
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
        otp={otp}
        setOtp={setOtp}
        handleRegister={handleRegister}
        handleVerifyOtp={handleVerifyOtp}
      />
    </div>
  );
}
