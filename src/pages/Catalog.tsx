import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../mockData';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import CatalogHero from '../sections/catalog/CatalogHero';
import CatalogMain from '../sections/catalog/CatalogMain';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Hamısı');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const dbProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['Hamısı', 'LED Monitor', 'Səs Sistemləri', 'İşıq Avadanlıqları', 'Podium', 'Trust – Ferma'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'Hamısı' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, products]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'Hamısı') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-20 pb-20">
      <CatalogHero />
      <CatalogMain 
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        filteredProducts={filteredProducts}
        categories={categories}
      />
    </div>
  );
}
