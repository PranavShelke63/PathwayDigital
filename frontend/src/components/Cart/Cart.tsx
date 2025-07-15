import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Cart: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
  const getImageUrl = (image: string | undefined) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${backendBase}/${image}`;
  };

  if (items.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-h-96 overflow-y-auto pb-32 sm:pb-0">
        {items.map((item) => (
          <div key={item._id} className="flex flex-col sm:flex-row py-4 border-b gap-3 sm:gap-0">
            <div className="h-24 w-full sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mx-auto sm:mx-0">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex-1 flex flex-col mt-2 sm:mt-0 sm:ml-4">
              <div className="flex flex-col sm:flex-row sm:justify-between text-base font-medium text-contrast">
                <h3 className="truncate max-w-[80vw]">{item.name}</h3>
                <p className="mt-1 sm:mt-0 sm:ml-4">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-2 sm:p-1 hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                  <span className="px-3 py-1 text-base sm:text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-2 sm:p-1 hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity >= item.stock}
                  >
                    <PlusIcon className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                </div>
                {/* Remove button: icon on mobile, text on desktop */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 hover:text-red-500 flex items-center justify-center p-2 sm:p-0"
                  aria-label="Remove"
                >
                  <span className="block sm:hidden"><XMarkIcon className="h-6 w-6" /></span>
                  <span className="hidden sm:block text-sm font-medium">Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Sticky checkout bar on mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-4 sm:static sm:py-4 sm:mt-4 z-20">
        <div className="flex justify-between text-base font-medium text-contrast">
          <p>Subtotal</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
        <div className="mt-4">
          <Link
            to="/checkout"
            onClick={onClose}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90"
          >
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart; 