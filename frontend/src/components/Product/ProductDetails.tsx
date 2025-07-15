import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, productsApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { HeartIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('Product ID is required');
        }
        const response = await productsApi.getById(id);
        const productData = response.data.data.data;
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const cartItem = cartItems.find(item => item._id === id);
  const remainingStock = product ? product.stock - (cartItem?.quantity || 0) : 0;
  const inWishlist = product ? isInWishlist(product._id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;

    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-4">{error || 'Product not found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-12">
      <div className="max-w-2xl sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Mobile layout */}
        <div className="block lg:hidden">
          <div className="w-full h-[50vh] bg-gray-200 rounded-lg overflow-hidden">
            {product && (() => {
              const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
              const imageUrl = product.image.startsWith('http')
                ? product.image
                : `${backendBase}/${product.image}`;
              return (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />
              );
            })()}
          </div>
          <div className="flex items-center justify-between mt-4 px-1">
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-[60%]">{product.name}</h1>
            <span className="text-lg font-bold text-contrast">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 px-1">
            <button
              onClick={handleWishlistToggle}
              className="flex items-center justify-center p-2 rounded-full bg-white shadow hover:bg-gray-100 border border-gray-200"
            >
              {inWishlist ? (
                <HeartSolidIcon className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-gray-400" />
              )}
            </button>
            {/* Quantity selector */}
            {remainingStock > 0 && (
              <select
                id="quantity-mobile"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-md border border-gray-300 py-1 px-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                style={{ width: '70px' }}
              >
                {[...Array(Math.min(remainingStock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={remainingStock === 0}
              className={`flex-1 flex items-center justify-center px-2 py-2 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                remainingStock === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5 mr-1" />
              {remainingStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          {/* Back to Shop button */}
          <div className="mt-3 px-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Shop
            </button>
          </div>
          {/* Labeled product info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 px-1 text-xs text-gray-700">
            <span><span className="font-semibold">Brand:</span> <span className="font-medium text-gray-900">{product.brand}</span></span>
            <span><span className="font-semibold">Category:</span> <span className="font-medium text-gray-900">{product.category}</span></span>
          </div>
          <div className={`mt-2 px-1 text-xs font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}> 
            <span className="font-semibold">Availability:</span> {remainingStock > 0 ? `${remainingStock} in stock` : 'Out of stock'}
          </div>
          {/* Truncated description for mobile */}
          <div className="mt-4 px-1 text-sm text-gray-700 line-clamp-3">
            {product.description}
          </div>
        </div>
        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              {product && (() => {
                const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
                const imageUrl = product.image.startsWith('http')
                  ? product.image
                  : `${backendBase}/${product.image}`;
                return (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                );
              })()}
            </div>
          </div>
          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
              <button
                onClick={handleWishlistToggle}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {inWishlist ? (
                  <HeartSolidIcon className="h-8 w-8 text-red-500" />
                ) : (
                  <HeartIcon className="h-8 w-8 text-gray-400" />
                )}
              </button>
            </div>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center">
                <div className="text-sm text-gray-500">Brand</div>
                <div className="ml-2 text-sm font-medium text-gray-900">{product.brand}</div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="text-sm text-gray-500">Category</div>
                <div className="ml-2 text-sm font-medium text-gray-900">{product.category}</div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="text-sm text-gray-500">Availability</div>
                <div className={`ml-2 text-sm font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{remainingStock > 0 ? `${remainingStock} in stock` : 'Out of stock'}</div>
              </div>
            </div>
            <div className="mt-8">
              {remainingStock > 0 && (
                <div className="flex items-center mb-4">
                  <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">Quantity</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    {[...Array(Math.min(remainingStock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Shop
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={remainingStock === 0}
                  className={`flex-1 inline-flex items-center justify-center px-8 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    remainingStock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {remainingStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
            {/* Additional product details */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list">
                  <li>High-quality product</li>
                  <li>Durable construction</li>
                  <li>Professional grade</li>
                  <li>Reliable performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 