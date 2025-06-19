import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="mb-2 text-lg font-semibold tracking-wide">
          Pathway Digital
        </div>
        <div className="mb-2 text-sm opacity-80">
          Empowering your digital journey with quality tech products and services.
        </div>
        <div className="text-xs opacity-70">
          &copy; {new Date().getFullYear()} Pathway Digital. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 