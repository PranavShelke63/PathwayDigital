import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, cartApi } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load cart from backend when user is authenticated
  const loadCart = async () => {
    if (!user) {
      setItems([]);
      setInitialLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await cartApi.get();
      console.log('Load cart response:', response.data);
      
      // Validate response structure
      if (!response.data?.data?.cart?.items) {
        throw new Error('Invalid response structure');
      }
      
      const cartItems = response.data.data.cart.items.map((item: any) => {
        if (!item.product) {
          console.error('Invalid item structure:', item);
          throw new Error('Invalid item structure in response');
        }
        return {
          ...item.product,
          quantity: item.quantity
        };
      });
      console.log('Mapped cart items:', cartItems);
      setItems(cartItems);
    } catch (err: any) {
      console.error('Error loading cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load cart');
      setItems([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }

    console.log('Adding to cart:', { productId: product._id, quantity });
    setLoading(true);
    setError(null);
    try {
      const response = await cartApi.addItem(product._id, quantity);
      console.log('Add response:', response.data);
      
      // Validate response structure
      if (!response.data?.data?.cart?.items) {
        throw new Error('Invalid response structure');
      }
      
      const cartItems = response.data.data.cart.items.map((item: any) => {
        if (!item.product) {
          console.error('Invalid item structure:', item);
          throw new Error('Invalid item structure in response');
        }
        return {
          ...item.product,
          quantity: item.quantity
        };
      });
      console.log('Mapped cart items:', cartItems);
      setItems(cartItems);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    console.log('Removing product from cart:', productId);
    setLoading(true);
    setError(null);
    try {
      const response = await cartApi.removeItem(productId);
      console.log('Remove response:', response.data);
      
      // Validate response structure
      if (!response.data?.data?.cart?.items) {
        throw new Error('Invalid response structure');
      }
      
      const cartItems = response.data.data.cart.items.map((item: any) => {
        if (!item.product) {
          console.error('Invalid item structure:', item);
          throw new Error('Invalid item structure in response');
        }
        return {
          ...item.product,
          quantity: item.quantity
        };
      });
      console.log('Mapped cart items:', cartItems);
      setItems(cartItems);
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    console.log('Updating quantity:', { productId, quantity });
    setLoading(true);
    setError(null);
    try {
      const response = await cartApi.updateItem(productId, quantity);
      console.log('Update response:', response.data);
      
      // Validate response structure
      if (!response.data?.data?.cart?.items) {
        throw new Error('Invalid response structure');
      }
      
      const cartItems = response.data.data.cart.items.map((item: any) => {
        if (!item.product) {
          console.error('Invalid item structure:', item);
          throw new Error('Invalid item structure in response');
        }
        return {
          ...item.product,
          quantity: item.quantity
        };
      });
      console.log('Mapped cart items:', cartItems);
      setItems(cartItems);
    } catch (err: any) {
      console.error('Error updating cart quantity:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      await cartApi.clear();
      setItems([]);
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    loading: loading || initialLoading,
    error
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 