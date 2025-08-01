import React from 'react';
import { Product } from '../../services/api';
import { StarIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-heading font-semibold text-contrast truncate">
            {product.name}
          </h4>
          <p className="text-sm text-gray-500 truncate font-sans">
            {product.brand}
          </p>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.ratings) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1 font-sans">
              ({product.numReviews})
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-semibold text-primary">
              ${product.price}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.stock > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 