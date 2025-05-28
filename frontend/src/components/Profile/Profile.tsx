import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-contrast">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Banner */}
        <div className="bg-primary px-6 py-8">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white text-primary flex items-center justify-center text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-accent mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="border-b border-gray-200">
            <h3 className="text-lg font-semibold text-contrast mb-4">Account Information</h3>
            <dl className="divide-y divide-gray-200">
              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="text-sm text-contrast col-span-2">{user?.name}</dd>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="text-sm text-contrast col-span-2">{user?.email}</dd>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Account type</dt>
                <dd className="text-sm text-contrast col-span-2 capitalize">{user?.role}</dd>
              </div>
            </dl>
          </div>

          {/* Account Actions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-contrast mb-4">Account Actions</h3>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <button className="btn-primary w-full sm:w-auto">
                Edit Profile
              </button>
              <button className="btn-secondary w-full sm:w-auto">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 