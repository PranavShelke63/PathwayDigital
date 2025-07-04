import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { usersApi } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await usersApi.getAll();
        setUserCount(response.data.data.users.length);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Analytics Card */}
        <div className="card flex flex-col justify-between min-h-[260px]">
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
            <Link to="/admin/users" className="block">
              <div className="cursor-pointer hover:bg-gray-100 p-2 -mx-2 rounded transition-colors">
                <p className="text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-accent">
                  {loading ? (
                    <span className="inline-block w-8 h-8 border-t-2 border-accent rounded-full animate-spin"></span>
                  ) : (
                    userCount
                  )}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Products Card */}
        <div className="card flex flex-col justify-between min-h-[260px]">
          <h3 className="text-lg font-semibold text-contrast mb-4">Product Management</h3>
          <div className="space-y-4">
            <Link to="/admin/products" className="btn-primary w-full block text-center">
              Manage Products
            </Link>
            <button className="btn-secondary w-full">View Analytics</button>
            <button className="btn-secondary w-full">Manage Categories</button>
          </div>
        </div>

        {/* Customer Support Card */}
        <div className="card flex flex-col justify-between min-h-[260px]">
          <h3 className="text-lg font-semibold text-contrast mb-4">Customer Support</h3>
          <div className="space-y-4">
            <Link to="/admin/queries" className="btn-primary w-full block text-center">
              View Customer Queries
            </Link>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                You have new customer inquiries waiting for your response.
              </p>
            </div>
          </div>
        </div>

        {/* Repair CRM Card */}
        <div className="card flex flex-col justify-between min-h-[260px]">
          <h3 className="text-lg font-semibold text-contrast mb-4">Repair CRM</h3>
          <div className="space-y-4">
            <Link to="/admin/repairs/new" className="btn-primary w-full block text-center">
              New Repair Entry
            </Link>
            <Link to="/admin/repairs" className="btn-secondary w-full block text-center">
              Repair Jobs Dashboard
            </Link>
          </div>
        </div>

        {/* Quotation Bills Card */}
        <div className="card flex flex-col justify-between min-h-[260px]">
          <h3 className="text-lg font-semibold text-contrast mb-4">Quotation Bills</h3>
          <div className="space-y-4">
            <Link to="/admin/quotation/new" className="btn-primary w-full block text-center">
              Create Quotation Bill
            </Link>
            <Link to="/admin/quotation" className="btn-secondary w-full block text-center">
              View Quotations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 