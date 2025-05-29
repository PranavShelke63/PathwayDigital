import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon as MenuIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/bgLOGO.png';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
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
                <span className="text-2xl font-bold text-primary">
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
            </div>
          </div>

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
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-contrast hover:bg-background"
                    >
                      Sign out
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

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-contrast hover:text-primary hover:bg-background focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-contrast hover:text-primary hover:bg-background"
                  >
                    Sign out
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