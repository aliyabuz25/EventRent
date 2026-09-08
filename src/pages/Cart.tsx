import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_CONCEPTS } from '../mockData';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import CartItems from '../sections/cart/CartItems';
import CartCheckout from '../sections/cart/CartCheckout';
import CartEmpty from '../sections/cart/CartEmpty';
import CartSuccess from '../sections/cart/CartSuccess';
import CartLoginPrompt from '../sections/cart/CartLoginPrompt';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setShowLoginPrompt(false);
        setFormData(prev => ({
          ...prev,
          name: u.displayName || prev.name,
          email: u.email || prev.email
        }));
      } else {
        const isDemo = localStorage.getItem('demo_mode') === 'true';
        if (isDemo) {
          setUser({ displayName: localStorage.getItem('demo_user_name') || 'Tural' } as any);
          setShowLoginPrompt(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    location: '',
    note: ''
  });

  const cartItems = useMemo(() => {
    return cart.map((item: any) => {
      if (item.type === 'teambuilding') {
        return {
          ...item,
          product: {
            id: item.id,
            name: item.name,
            category: 'Timbildinq',
            images: [item.image],
            description: ''
          }
        };
      }
      if (item.type === 'catering') {
        return {
          ...item,
          product: {
            id: item.id,
            name: item.name,
            category: 'Ketrinq',
            images: [item.image],
            description: ''
          }
        };
      }
      let product = MOCK_PRODUCTS.find(p => p.id === item.productId);
      if (!product) {
        const concept = MOCK_CONCEPTS.find(c => c.id === item.productId);
        if (concept) {
          product = {
            id: concept.id,
            name: concept.name,
            category: 'Timbildinq',
            description: concept.description,
            images: ['https://picsum.photos/seed/team/800/600'],
            technicalSpecs: { 'İştirakçı': concept.participantCount, 'Məkan': concept.isIndoor ? 'Indoor' : 'Outdoor' },
            tags: concept.tags,
            relatedProducts: []
          };
        } else if (item.name && item.image) {
          product = {
            id: item.productId,
            name: item.name,
            category: item.category || 'Xidmət',
            description: '',
            images: [item.image],
            technicalSpecs: {},
            tags: [],
            relatedProducts: []
          };
        }
      }
      return { ...item, product };
    }).filter((item: any) => item.product);
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map((item: any) => {
      const itemId = item.productId || item.id;
      if (itemId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item: any) => (item.productId || item.id) !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (!user && !isDemo) {
      setShowLoginPrompt(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        status: 'new',
        items: cart,
        userId: user?.uid || 'demo_user',
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => navigate('/profile'), 3000);
    } catch (err: any) {
      setError(err.message || 'Sifariş göndərilərkən xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return <CartSuccess />;
  if (showLoginPrompt && !user && localStorage.getItem('demo_mode') !== 'true') return <CartLoginPrompt />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {cartItems.length === 0 ? (
          <CartEmpty onNavigate={() => navigate('/catalog')} />
        ) : (
          <>
            <CartItems 
              items={cartItems} 
              onUpdateQuantity={updateQuantity} 
              onRemoveItem={removeItem} 
            />
            <CartCheckout 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              itemsCount={cartItems.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
