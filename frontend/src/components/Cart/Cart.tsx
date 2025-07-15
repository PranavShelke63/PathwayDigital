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
      <div className="max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item._id} className="flex py-4 border-b">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div className="flex justify-between text-base font-medium text-contrast">
                <h3>{item.name}</h3>
                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-2 py-1 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100"
                    disabled={item.quantity >= item.stock}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 py-4 mt-4">
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