import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Redirect if not admin
  if (!user || user.email !== 'pranavopshelke@gmail.com') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-contrast">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your store and view analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Analytics Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-contrast mb-4">Analytics Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-contrast">125</p>
            </div>
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">$12,450</p>
            </div>
            <div>
              <p className="text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-accent">48</p>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-contrast mb-4">Product Management</h3>
          <div className="space-y-4">
            <button className="btn-primary w-full">Add New Product</button>
            <button className="btn-secondary w-full">View All Products</button>
            <button className="btn-secondary w-full">Manage Categories</button>
          </div>
        </div>

        {/* Orders Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-contrast mb-4">Recent Orders</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">#1234</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Delivered
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">#1235</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Processing
              </span>
            </div>
            <button className="btn-secondary w-full mt-4">View All Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 