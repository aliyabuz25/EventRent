import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, CheckCircle2, ShoppingCart, MapPin, Calendar, Clock, FileText, UtensilsCrossed } from 'lucide-react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useCart } from '../../hooks/useCart';

const MENU_ITEMS = [
  { title: 'Soyuq Qəlyanaltılar', desc: 'Müxtəlif pendir, ət və tərəvəz çeşidləri.' },
  { title: 'İsti Yeməklər', desc: 'Milli və Avropa mətbəxinin ən dadlı nümunələri.' },
  { title: 'Desertlər', desc: 'Şirniyyat və meyvə çeşidləri ilə zəngin süfrə.' },
  { title: 'İçkilər', desc: 'Alkoqollu və alkoqolsuz içki menyusu.' },
];

export default function CateringContent() {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [formData, setFormData] = useState({
    location: '',
    date: '',
    timeRange: '',
    eventFormat: '',
    menuRequest: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useGsap(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo('.cat-badge',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    )
    .fromTo('.cat-desc',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.cat-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.07 },
      '-=0.48'
    );

    gsap.fromTo('.cat-heading',
      { x: 50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo('.cat-img',
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.7, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo('.cat-form-card',
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { dependencies: [], scope: containerRef });

  const handleOrder = () => {
    if (!formData.location || !formData.date || !formData.timeRange || !formData.eventFormat) {
      setError('Məcburi sahələri doldurun (* ile işarələnib)');
      return;
    }

    setError(null);

    addItem({
      productId: `catering-${Date.now()}`,
      quantity: 1,
      technicalAnswers: {
        'Məkan': formData.location,
        'Tarix': formData.date,
        'Saat aralığı': formData.timeRange,
        'Tədbirin formatı': formData.eventFormat,
        'Menyu tərkibi': formData.menuRequest || '—',
      },
    } as any);

    setSuccess(true);
    setTimeout(() => { navigate('/cart'); }, 1200);
  };

  const inputClassName =
    'w-full min-h-[56px] px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-base text-white transition-all duration-300 placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_30px_rgba(227,6,19,0.15)]';

  return (
    <>
      <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-12 -mt-16">
          <div className="space-y-6">
            <div className="cat-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
              <ChefHat className="w-4 h-4" /> Peşəkar Mətbəx
            </div>
            <p className="cat-desc opacity-0 text-xl text-white/70 font-light leading-relaxed">
              "Event Rent" olaraq biz, tədbirlərinizin ləzzətini artırmaq üçün ən yüksək keyfiyyətli ketrinq xidmətini təklif edirik.
              Peşəkar aşpazlarımız və təcrübəli ofisiant heyətimizlə hər bir qonağınızın məmnuniyyətini təmin edirik.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {MENU_ITEMS.map((item, i) => (
              <div key={i} className="cat-card opacity-0 space-y-4 p-8 bg-white/5 border border-white/8 rounded-5xl hover:bg-white/10 hover:border-white/15 transition-all duration-500 group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-premium-orange transition-colors">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold tracking-tight text-white">{item.title}</h4>
                  <p className="text-sm text-white/60 font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="cat-heading opacity-0 text-4xl md:text-6xl font-bold tracking-tighter leading-tight text-white">
            Keyfiyyətli Qidalanma, Peşəkar Xidmət
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="cat-img opacity-0 aspect-square rounded-[60px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Catering 1" referrerPolicy="no-referrer" />
              </div>
              <div className="cat-img opacity-0 aspect-square rounded-[60px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Catering 2" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="cat-img opacity-0 aspect-square rounded-[60px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img src="https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Catering 3" referrerPolicy="no-referrer" />
              </div>
              <div className="cat-img opacity-0 aspect-square rounded-[60px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Catering 4" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={formRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="cat-form-card opacity-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-premium-orange/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">Sifarişiniz səbətə əlavə olundu!</h3>
                <p className="text-white/60 mt-2">Səbət səhifəsinə yönləndirilirsiniz...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-premium-orange/10 border border-premium-orange/20 rounded-2xl flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-premium-orange" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">Sifariş Yarat</h2>
                    <p className="text-sm text-white/60 font-medium">Ketrinq sifarişi üçün məlumatları doldurun</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Məkan *
                  </label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Tədbir keçiriləcək məkan" className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Tarix *
                  </label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Saat aralığı *
                  </label>
                  <input type="text" required value={formData.timeRange} onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })} placeholder="məs: 18:00 - 23:00" className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Tədbirin formatı *
                  </label>
                  <input type="text" required value={formData.eventFormat} onChange={(e) => setFormData({ ...formData, eventFormat: e.target.value })} placeholder="məs: Korporativ, Düğün, Ad günü" className={inputClassName} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <ChefHat className="w-3.5 h-3.5" /> Menyu tərkibi haqqında xüsusi istək
                  </label>
                  <textarea rows={3} value={formData.menuRequest} onChange={(e) => setFormData({ ...formData, menuRequest: e.target.value })} placeholder="Menyu haqqında xüsusi istəkləriniz..." className={`${inputClassName} resize-none`} />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium backdrop-blur-md mt-6">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">!</span>
                  {error}
                </div>
              )}

              <button
                onClick={handleOrder}
                className="group relative overflow-hidden bg-white text-black px-12 py-5 rounded-full font-black text-lg hover:text-white transition-colors duration-500 flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] w-full md:w-auto mt-8 cursor-pointer"
              >
                <div className="absolute inset-0 bg-premium-orange pointer-events-none z-0 [clip-path:circle(0px_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))] transition-[clip-path] duration-500 ease-out" />
                <span className="relative z-10 flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Sifariş Yarat
                </span>
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
}
