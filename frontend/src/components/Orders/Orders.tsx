import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Orders: React.FC = () => {
  const { user } = useAuth();

  // This is a placeholder. In a real application, you would fetch orders from an API
  const mockOrders = [
    {
      id: '1',
      date: '2024-03-15',
      total: 1299.99,
      status: 'Delivered',
      items: [
        { name: 'Gaming Laptop', price: 1299.99, quantity: 1 }
      ]
    },
    {
      id: '2',
      date: '2024-03-10',
      total: 459.98,
      status: 'Processing',
      items: [
        { name: 'Mechanical Keyboard', price: 129.99, quantity: 2 },
        { name: 'Gaming Mouse', price: 99.99, quantity: 2 }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent orders and their status.</p>
        </div>
        <div className="border-t border-gray-200">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Order #{order.id}</h4>
                  <p className="mt-1 text-sm text-gray-500">{order.date}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-900">Items:</h5>
                <ul className="mt-2 divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <li key={index} className="py-2">
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <span className="text-sm font-medium text-gray-900">
                    Total: ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders; 