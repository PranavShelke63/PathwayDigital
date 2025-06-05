import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { HeartIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();

  const isInCart = (productId: string) => {
    return cartItems.some(item => item._id === productId);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding some items to your wishlist!</p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        My Wishlist
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {items.map((product) => (
          <div key={product._id} className="relative">
            <div className="relative w-full h-72 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="relative mt-4">
              <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                disabled={isInCart(product._id)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isInCart(product._id)
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist; 