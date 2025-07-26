import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const NavigationTest: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-contrast mb-8">Navigation Stacking Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Authentication Status</h2>
          <p className="mb-2">
            <strong>User:</strong> {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'Not logged in'}
          </p>
          <p className="mb-2">
            <strong>Role:</strong> {user?.role || 'Guest'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Public Pages</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-primary hover:text-primary/80">Home</Link>
              <Link to="/shop" className="block text-primary hover:text-primary/80">Shop</Link>
              <Link to="/about" className="block text-primary hover:text-primary/80">About</Link>
              <Link to="/contact" className="block text-primary hover:text-primary/80">Contact</Link>
              <Link to="/services" className="block text-primary hover:text-primary/80">Services</Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Protected Pages</h3>
            <div className="space-y-2">
              <Link to="/profile" className="block text-primary hover:text-primary/80">Profile</Link>
              <Link to="/wishlist" className="block text-primary hover:text-primary/80">Wishlist</Link>
              <Link to="/cart" className="block text-primary hover:text-primary/80">Cart</Link>
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin" className="block text-primary hover:text-primary/80">Admin Dashboard</Link>
                  <Link to="/admin/products" className="block text-primary hover:text-primary/80">Product Management</Link>
                  <Link to="/admin/users" className="block text-primary hover:text-primary/80">User Management</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Test Scenarios</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Scenario 1: Try to access protected page while logged out</h4>
              <p className="text-sm text-gray-600 mb-2">
                Click on a protected page (like Profile) while logged out. You should be redirected to login.
                After logging in, you should be redirected back to the original page.
              </p>
              <Link to="/profile" className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Try Profile (Protected)
              </Link>
            </div>

            <div>
              <h4 className="font-medium mb-2">Scenario 2: Try to access login/register while logged in</h4>
              <p className="text-sm text-gray-600 mb-2">
                If you're logged in, try to access login or register pages. You should be redirected away.
              </p>
              <div className="space-x-2">
                <Link to="/login" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Try Login
                </Link>
                <Link to="/register" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Try Register
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Scenario 3: Test back button behavior</h4>
              <p className="text-sm text-gray-600 mb-2">
                Navigate to a protected page, get redirected to login, then use the back button.
                You should not end up back on the login page if you're already authenticated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTest; 