import { useCallback } from 'react';
import { CartItem } from '../types';

const CART_KEY = 'cart';

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('cart-updated'));
}

export function useCart() {
  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const cart = readCart();
    const existing = cart.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity ?? 1;
      if (item.technicalAnswers) {
        existing.technicalAnswers = { ...existing.technicalAnswers, ...item.technicalAnswers };
      }
    } else {
      cart.push({ quantity: 1, ...item });
    }
    writeCart(cart);
  }, []);

  const removeItem = useCallback((productId: string) => {
    writeCart(readCart().filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const cart = readCart().map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    writeCart(cart);
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  const getCart = useCallback((): CartItem[] => readCart(), []);

  return { addItem, removeItem, updateQuantity, clearCart, getCart };
}
