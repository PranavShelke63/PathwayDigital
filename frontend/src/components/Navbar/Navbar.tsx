import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, Bars3Icon as MenuIcon, ArrowRightOnRectangleIcon, XMarkIcon, HeartIcon, CalendarIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logo from '../../assets/bgLOGO.png';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems, totalItems: wishlistTotalItems, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      if (!window.confirm('Are you sure you want to sign out?')) {
        return;
      }

      setIsLoggingOut(true);
      await logout();
      clearWishlist();
      setIsMenuOpen(false);
      navigate('/login', { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sign out';
      alert(errorMessage + '. Please try again or refresh the page.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="PATHWAY DIGITAL" className="h-10 w-auto" />
              <span className="text-xl font-bold text-accent hidden sm:block">
                PATHWAY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-8">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Services
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-contrast hover:text-primary hover:bg-background rounded-full transition-colors"
            >
              {location.pathname === '/wishlist' ? (
                <HeartSolidIcon className="h-6 w-6 text-primary" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
              {wishlistTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {wishlistTotalItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-contrast hover:text-primary hover:bg-background rounded-full transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Orders */}
            {user && (
              <Link
                to="/orders"
                className="p-2 text-contrast hover:text-primary hover:bg-background rounded-full transition-colors"
              >
                <CalendarIcon className="h-6 w-6" />
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-contrast hover:text-primary hover:bg-background rounded-md transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:block">{user.name}</span>
                </Link>
                {user.email === 'pranavopshelke@gmail.com' && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white rounded-md transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Quick Actions for Mobile */}
            <Link
              to="/wishlist"
              className="relative p-2 text-contrast hover:text-primary rounded-full transition-colors"
            >
              {location.pathname === '/wishlist' ? (
                <HeartSolidIcon className="h-6 w-6 text-primary" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
              {wishlistTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {wishlistTotalItems}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-contrast hover:text-primary rounded-full transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-contrast hover:text-primary rounded-full transition-colors"
            >
              {!isMenuOpen ? (
                <MenuIcon className="h-6 w-6" />
              ) : (
                <XMarkIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isMenuOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div 
          ref={menuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50"
        >
          <div className="px-4 py-6 space-y-6">
            {/* Navigation Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Contact
              </Link>
              <Link
                to="/services"
                className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Services
              </Link>
            </div>

            {/* User Section */}
            {user ? (
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Account
                  </h3>
                  
                  {/* User Info */}
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-contrast">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={closeMenu}
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      Your Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-3 text-base font-medium text-contrast hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={closeMenu}
                    >
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      Orders
                    </Link>
                    


                    {user.email === 'pranavopshelke@gmail.com' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-3 text-base font-medium text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                        onClick={closeMenu}
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Sign Out Button - Prominent and Easy to Reach */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center">
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Account
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    onClick={closeMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={closeMenu}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar; 