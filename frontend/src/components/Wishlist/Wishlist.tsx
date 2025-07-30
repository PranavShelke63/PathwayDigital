import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { HeartIcon, ShoppingCartIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Product } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isInCart = (productId: string) => {
    return cartItems.some(item => item._id === productId);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your saved items</p>
          </div>
        </div>

        {/* Mobile Grid - Following Shop page pattern */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 lg:grid-cols-3 xl:gap-x-8">
          {items.map((product) => (
            <div key={product._id} className="card group relative block rounded-lg shadow-md bg-white overflow-hidden border border-gray-100 hover:shadow-xl hover:scale-[1.03] transition-all duration-200">
              {/* Product Image */}
              <div className="relative">
                <Link to={`/product/${product._id}`} className="block">
                  <div className="flex items-center justify-center w-full aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-200 z-10 w-10 h-10 flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 px-3">
                <div>
                  <Link to={`/product/${product._id}`} className="block hover:text-primary transition-colors">
                    <h3 className="text-base font-semibold text-contrast group-hover:text-primary truncate">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs text-gray-500">Brand: {product.brand}</span>
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600">In Stock: {product.stock}</span>
                      ) : (
                        <span className="text-xs text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </Link>
                </div>
                <p className="text-base font-bold text-contrast">₹{product.price.toFixed(2)}</p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={isInCart(product._id)}
                className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isInCart(product._id)
                    ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg'
                    : 'bg-primary text-white hover:bg-primary/80 hover:shadow-lg'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 