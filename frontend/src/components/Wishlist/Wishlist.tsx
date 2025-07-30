import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { HeartIcon, ShoppingCartIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Product } from '../../services/api';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isInCart = (productId: string) => {
    return cartItems.some(item => item._id === productId);
  };

  // Helper to get image URL
  const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
  const getImageUrl = (image: string | undefined) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${backendBase}/${image}`;
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      alert('Please log in to add items to cart.');
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    addToCart(product);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <HeartIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding some items to your wishlist!</p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your saved items</p>
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image Container */}
              <div className="relative">
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative w-full h-48 sm:h-56 rounded-t-xl overflow-hidden">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <Link to={`/product/${product._id}`} className="block hover:text-primary transition-colors">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-primary">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                </Link>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product._id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isInCart(product._id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                    {isInCart(product._id) ? 'In Cart' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 