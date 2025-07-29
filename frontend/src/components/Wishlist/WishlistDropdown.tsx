import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { HeartIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '../../services/api';

// WishlistItems component for scrollable content
export const WishlistItems: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const { user } = useAuth();
  
  const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
  
  const getImageUrl = (image: string | undefined) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${backendBase}/${image}`;
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item._id === productId);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('Please login to add items to cart.');
      return;
    }
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-400 mb-4">
          <HeartIcon className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-500 text-lg font-medium">Your wishlist is empty</p>
        <p className="text-gray-400 text-sm mt-2">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      {items.map((item) => (
        <div key={item._id} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Brand: {item.brand}
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  ₹{item.price.toFixed(2)}
                </p>
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove from wishlist"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-4">
              <button
                onClick={() => handleAddToCart(item)}
                disabled={isInCart(item._id)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isInCart(item._id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                {isInCart(item._id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// WishlistSummary component for the footer
export const WishlistSummary: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { items } = useWishlist();

  return (
    <div className="space-y-4">
      {/* Item Count */}
      <div className="flex justify-between text-base font-medium text-gray-900">
        <span>Wishlist ({items.length} items)</span>
      </div>

      {/* View Wishlist Button */}
      <Link
        to="/wishlist"
        onClick={onClose}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        View Wishlist
      </Link>

      {/* Continue Shopping */}
      <button
        onClick={onClose}
        className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
};

// Keep the original component for backward compatibility
const WishlistDropdown: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-400 mb-4">
          <HeartIcon className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-500 text-lg font-medium">Your wishlist is empty</p>
        <p className="text-gray-400 text-sm mt-2">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Wishlist Items */}
      <div className="px-4 py-6 space-y-4 pb-4">
        <WishlistItems onClose={onClose} />
      </div>

      {/* Wishlist Summary */}
      <div className="border-t border-gray-200 px-4 py-6 bg-gray-50">
        <WishlistSummary onClose={onClose} />
      </div>
    </div>
  );
};

export default WishlistDropdown; 