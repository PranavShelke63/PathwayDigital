import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  inline?: boolean;
  color?: 'white' | 'primary' | 'gray';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false,
  inline = false,
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const colorClasses = {
    white: 'border-white',
    primary: 'border-primary',
    gray: 'border-gray-500'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : inline
    ? 'flex items-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className={inline ? 'flex items-center' : 'text-center'}>
        <div className={`animate-spin rounded-full border-b-2 ${colorClasses[color]} ${sizeClasses[size]} ${inline ? 'mr-2' : 'mx-auto'}`}></div>
        {message && !inline && (
          <p className="text-gray-500 mt-4">{message}</p>
        )}
        {message && inline && (
          <span className="text-sm">{message}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 