import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import logo from '../../assets/bgLOGO.png';

const CartPage: React.FC = () => {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart, loading, error } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
  
  const getImageUrl = (image: string | undefined) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${backendBase}/${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-primary hover:text-primary/80 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <img src={logo} alt="PATHWAY DIGITAL" className="h-20 w-auto mx-auto mb-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our products!
            </p>
            <div className="space-y-4">
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
              >
                Start Shopping
              </Link>
              <div className="text-sm text-gray-500">
                <p>Discover amazing products at great prices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
             
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-500">Manage your items</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="text-2xl font-bold text-primary">{totalItems}</div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                <p className="text-sm text-gray-500">Review and manage your selections</p>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
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
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Brand: {item.brand}
                            </p>
                            <p className="text-xl font-bold text-primary mt-2">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                            disabled={loading}
                            aria-label="Remove item"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <label className="text-sm font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                                disabled={item.quantity <= 1 || loading}
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center bg-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                                disabled={item.quantity >= item.stock || loading}
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-sm text-gray-500">
                              {item.stock} available
                            </span>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Item Total</p>
                            <p className="text-xl font-bold text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.quantity >= item.stock && (
                          <p className="text-xs text-orange-600 mt-2 bg-orange-50 px-2 py-1 rounded">
                            Maximum available quantity reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-4">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500">Review your order details</p>
              </div>
              <div className="p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary">₹{(totalPrice * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-105"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/shop"
                  className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 