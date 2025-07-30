import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ordersApi, Order } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import LoadingSpinner from '../LoadingSpinner';

const UserOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);



  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getUserOrders();
      setOrders(response.data.data.orders);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchOrders} 
            className="text-primary hover:text-primary/80 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track your order history</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <CalendarIcon className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Order #{order._id?.slice(-8) || 'Unknown'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt || '')}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {typeof item.product === 'object' && item.product.image ? (
                            <img
                              src={getImageUrl(item.product.image)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', e.currentTarget.src);
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                              onLoad={(e) => {
                                console.log('Image loaded successfully:', e.currentTarget.src);
                              }}
                            />
                          ) : null}
                          <div className="hidden w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {typeof item.product === 'object' ? item.product.name : 'Product'}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Quantity: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-primary/10"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>{selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Details */}
                  {selectedOrder?._id === order._id && (
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Shipping Address */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <p>Method: {order.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p>Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
                            <p>Order Date: {formatDate(order.createdAt || '')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders; 