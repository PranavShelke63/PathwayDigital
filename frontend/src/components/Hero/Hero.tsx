import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 md:py-24">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins text-contrast mb-6">
              Welcome to
              <span className="text-accent block">PATHWAY DIGITAL</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Explore our wide range of laptops, PCs, and accessories. Get the best deals on premium tech products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-secondary text-white">
                Shop Now
              </Link>
              <Link to="/deals" className="btn-secondary text-white">
                View Deals
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">1000+</h3>
                <p className="text-gray-600">Products</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">24/7</h3>
                <p className="text-gray-600">Support</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">100%</h3>
                <p className="text-gray-600">Secure</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-accent/10 rounded-2xl transform -rotate-6"></div>
            <img
              src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Modern Laptop"
              className="relative rounded-2xl shadow-2xl w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Laptops</h3>
            <p className="text-gray-600 text-sm">Premium & Budget Options</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Desktop PCs</h3>
            <p className="text-gray-600 text-sm">Custom & Pre-built</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Components</h3>
            <p className="text-gray-600 text-sm">Latest Hardware</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Accessories</h3>
            <p className="text-gray-600 text-sm">Essential Add-ons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 