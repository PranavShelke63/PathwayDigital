import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon as MenuIcon, MagnifyingGlassIcon as SearchIcon, ArrowRightOnRectangleIcon, XMarkIcon, PlusIcon, MinusIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logo from '../../assets/bgLOGO.png';
import axios from 'axios';
import WishlistDropdown, { WishlistItems, WishlistSummary } from '../Wishlist/WishlistDropdown';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems, totalItems: wishlistTotalItems, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setIsWishlistOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (!window.confirm('Are you sure you want to sign out?')) {
        return;
      }

      console.log('Starting logout process from Navbar...');
      setIsLoggingOut(true);
      
      try {
        // First attempt the API logout
        console.log('Calling logout from AuthContext...');
        await logout();
        console.log('Logout successful, clearing context states...');
        
        // Clear context states
        clearWishlist();
        
        // Close dropdowns
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        
        console.log('Navigating to login page...');
        // Navigate to login page
        navigate('/login', { replace: true });
      } catch (logoutError: any) {
        console.error('Logout error details:', {
          message: logoutError.message,
          response: logoutError.response?.data,
          status: logoutError.response?.status
        });
        throw logoutError; // Re-throw to be caught by outer catch
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sign out';
      console.error('Logout failed:', errorMessage);
      alert(errorMessage + '. Please try again or refresh the page.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="PATHWAY DIGITAL" className="h-12 w-auto" />
                <span className="text-2xl font-bold text-accent">
                  PATHWAY
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary"
              >
                Contact
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-contrast border-b-2 border-transparent hover:border-primary"
              >
                Services
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Wishlist Button */}
            <div className="relative" ref={wishlistRef}>
              <button
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                className="relative p-2 text-contrast hover:text-primary hover:bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">View wishlist</span>
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
              </button>

              {/* Wishlist Dropdown */}
              <Transition
                show={isWishlistOpen}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 max-h-[80vh] flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-medium text-gray-900">Wishlist</h3>
                    <button
                      onClick={() => setIsWishlistOpen(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <WishlistItems onClose={() => setIsWishlistOpen(false)} />
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t border-gray-200 px-4 py-6 bg-gray-50 flex-shrink-0">
                    <WishlistSummary onClose={() => setIsWishlistOpen(false)} />
                  </div>
                </div>
              </Transition>
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-contrast hover:text-primary hover:bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View cart</span>
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <div className="relative ml-3" ref={profileRef}>
                  <div>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:ring-2 hover:ring-offset-2 hover:ring-primary"
                      aria-expanded={isProfileOpen}
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center transition-colors hover:bg-primary/90">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </div>
                  <Transition
                    show={isProfileOpen}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2 text-sm text-contrast border-b">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                      {user.email === 'pranavopshelke@gmail.com' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-contrast hover:bg-background"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-contrast hover:bg-background"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-contrast hover:bg-background"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-contrast hover:bg-background"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 group flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </Transition>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary hover:text-primary/80"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-contrast hover:text-primary hover:bg-background focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <MenuIcon className="block h-6 w-6" />
              ) : (
                <XMarkIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block pl-3 pr-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block pl-3 pr-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/services"
              className="block pl-3 pr-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              {location.pathname === '/wishlist' ? (
                <HeartSolidIcon className="h-5 w-5 mr-2 text-primary" />
              ) : (
                <HeartIcon className="h-5 w-5 mr-2" />
              )}
              Wishlist
              {wishlistTotalItems > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {wishlistTotalItems}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Cart
              {totalItems > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-contrast">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {user.email === 'pranavopshelke@gmail.com' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 group flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 