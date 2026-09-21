import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../mockData';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import CatalogMain from '../sections/catalog/CatalogMain';
import { motion } from 'motion/react';

const CATEGORIES = ['Hamısı', 'LED Monitor', 'Səs Sistemləri', 'İşıq Avadanlıqları', 'Podium', 'Trust – Ferma'];

export default function CatalogCategory() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const decodedCategory = category ? decodeURIComponent(category) : 'Hamısı';
  const validCategory = CATEGORIES.includes(decodedCategory) ? decodedCategory : 'Hamısı';

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const dbProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = validCategory === 'Hamısı' || p.category === validCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, validCategory, products]);

  const handleCategorySelect = (cat: string) => {
    if (cat === 'Hamısı') {
      navigate('/catalog');
    } else {
      navigate(`/catalog/${encodeURIComponent(cat)}`);
    }
  };

  return (
    <div className="pb-20">
      <section className="relative -mt-[72px] pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-brand-bg via-brand-bg to-brand-card overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <div
            className="absolute top-0 left-1/4 w-[40vw] h-[50%]"
            style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white/5" />
          <div className="absolute top-2/4 left-0 right-0 h-px bg-white/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-5 h-px bg-premium-orange" />
            <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">
              Avadanlıq Kataloqu
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-8"
          >
            {validCategory === 'Hamısı' ? (
              <>Texniki <br /><span className="text-white/50 italic">İnventar.</span></>
            ) : (
              <>{validCategory}</>
            )}
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed"
          >
            Premium audio-vizual avadanlıqlar — dünyanın aparıcı istehsalçılarından, ən yüksək sənaye standartlarında.
          </motion.p>
        </div>
      </section>

      <CatalogMain
        search={search}
        setSearch={setSearch}
        selectedCategory={validCategory}
        onCategorySelect={handleCategorySelect}
        filteredProducts={filteredProducts}
        categories={CATEGORIES}
      />
    </div>
  );
}
