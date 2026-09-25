import { useCallback, useEffect, useState } from 'react';

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const cart = JSON.parse(window.localStorage.getItem('cart') || '[]');
      const total = Array.isArray(cart)
        ? cart.reduce((acc: number, item: { quantity?: number }) => acc + (Number(item?.quantity) || 0), 0)
        : 0;
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    updateCartCount();
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'cart') updateCartCount();
    };
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cart-updated', handleCartUpdate as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cart-updated', handleCartUpdate as EventListener);
    };
  }, [updateCartCount]);

  return cartCount;
}
