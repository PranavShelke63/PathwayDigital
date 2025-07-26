import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../services/api';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item._id === product._id);
      if (existingItem) {
        return currentItems;
      }
      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item._id !== productId));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item._id === productId);
  };

  const totalItems = items.length;

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    totalItems
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}; 