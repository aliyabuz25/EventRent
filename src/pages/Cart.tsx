import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItems from '../sections/cart/CartItems';
import CartCheckout from '../sections/cart/CartCheckout';
import CartEmpty from '../sections/cart/CartEmpty';
import CartSuccess from '../sections/cart/CartSuccess';
import { useCart } from '../hooks/useCart';

const TOKEN_KEY = 'er_admin_token';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart]           = useState<any[]>(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const { clearCart } = useCart();

  /* Pre-fill form from JWT user */
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', eventDate: '', location: '', note: ''
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (!u) return;
        setFormData(prev => ({ ...prev, name: u.name || prev.name, email: u.email || prev.email }));
      }).catch(() => {});
  }, []);

  /* sync cart from localStorage */
  useEffect(() => {
    const sync = () => setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    window.addEventListener('cart-updated', sync);
    return () => window.removeEventListener('cart-updated', sync);
  }, []);

  const cartItems = useMemo(() => {
    return cart.map((item: any) => {
      const product = {
        id:          item.productId || item.id,
        name:        item.name        || 'Xidmət',
        category:    item.category    || 'Xidmət',
        description: item.description || '',
        images:      item.image ? [item.image] : [],
        technicalSpecs: item.technicalAnswers || {},
        tags: [],
        relatedProducts: [],
      };
      return { ...item, product };
    });
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map((item: any) => {
      const itemId = item.productId || item.id;
      if (itemId === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item: any) => (item.productId || item.id) !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem(TOKEN_KEY) || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name:       formData.name,
          phone:      formData.phone,
          email:      formData.email,
          event_date: formData.eventDate,
          location:   formData.location,
          note:       formData.note,
          items:      cart,
          source:     'website',
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Sifariş göndərilmədi.');
        return;
      }

      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    } catch {
      setError('Serverə qoşulma alınmadı. Bir az sonra yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return <CartSuccess />;

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