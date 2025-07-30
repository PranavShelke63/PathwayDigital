import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, productsApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { HeartIcon, ShoppingCartIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import LoadingSpinner from '../LoadingSpinner';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

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
  const isInCart = cartItem !== undefined;

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

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      toast.error('Please log in to add items to cart.');
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    
    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
      const action = isInCart ? 'Updated' : 'Added';
      toast.success(`${action} ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= remainingStock) {
      setQuantity(newQuantity);
    }
  };



  const handlePrevImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center">
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
    <div className="bg-background py-6 sm:py-12">
      <div className="max-w-2xl sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Mobile layout */}
        <div className="block lg:hidden">
          <div className="flex flex-col items-center w-full">
            {/* Product Image */}
            <div className="relative w-full max-w-lg aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-6">
              {product && product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(product.images[currentImageIndex])}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: isMobile ? '50vh' : '500px' }}
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow text-xl"
                        aria-label="Previous image"
                        style={{ zIndex: 2 }}
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow text-xl"
                        aria-label="Next image"
                        style={{ zIndex: 2 }}
                      >
                        &#8594;
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {product.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`inline-block w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full px-4">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900 flex-1 pr-4">{product.name}</h1>
            <button
              onClick={handleWishlistToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {inWishlist ? (
                <HeartSolidIcon className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-gray-400" />
              )}
            </button>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Brand: {product.brand} | Category: {typeof product.category === 'object' && product.category !== null ? product.category.name : product.category || ''}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    remainingStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {remainingStock > 0 ? `${remainingStock} in stock` : 'Out of stock'}
                  </div>
                  {isInCart && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {cartItem?.quantity} in cart
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
            {remainingStock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity {isInCart && `(${cartItem?.quantity} already in cart)`}
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= remainingStock}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {remainingStock} available
                    </span>
                  </div>
                  {isInCart && (
                    <p className="text-sm text-blue-600 mt-2">
                      Adding {quantity} more to your existing {cartItem?.quantity} in cart
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleAddToCart}
                  disabled={remainingStock === 0 || addingToCart}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    remainingStock === 0 || addingToCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isInCart 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
                  {addingToCart ? (
                    <LoadingSpinner 
                      size="sm" 
                      color="white" 
                      inline={true} 
                      message={isInCart ? 'Updating...' : 'Adding...'} 
                    />
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      {remainingStock === 0 ? 'Out of Stock' : 
                       isInCart ? `Add ${quantity} More to Cart` : 'Add to Cart'}
                    </>
                  )}
            </button>

            {isInCart && (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View Cart ({cartItem?.quantity} items)
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Shop
            </button>
          </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
            {product.description && product.description.trim() !== '' ? product.description : 'No description provided.'}
                </p>
          </div>

              {/* Specifications */}
          {product && product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                <tbody>
                  {(Object.entries(product.specifications) as [string, unknown][]).map(
                    ([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {Array.isArray(value) ? value.join(', ') : value?.toString()}
                              </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
                  </div>
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col items-center w-full sticky top-8 self-start">
            <div className="relative w-full max-w-lg aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              {product && product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(product.images[currentImageIndex])}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '500px' }}
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow text-xl"
                        aria-label="Previous image"
                        style={{ zIndex: 2 }}
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow text-xl"
                        aria-label="Next image"
                        style={{ zIndex: 2 }}
                      >
                        &#8594;
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {product.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`inline-block w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            {/* Thumbnails for desktop */}
            {product?.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-16 h-16 object-contain rounded border cursor-pointer ${idx === currentImageIndex ? 'border-primary' : 'border-gray-300'}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between items-start mb-6">
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

            <div className="mb-6">
              <p className="text-3xl text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>Brand: {product.brand}</span>
                <span>Category: {typeof product.category === 'object' && product.category !== null ? product.category.name : product.category || ''}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                remainingStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {remainingStock > 0 ? `${remainingStock} in stock` : 'Out of stock'}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description && product.description.trim() !== '' ? product.description : 'No description provided.'}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-8">
              {remainingStock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity {isInCart && `(${cartItem?.quantity} already in cart)`}
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= remainingStock}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {remainingStock} available
                    </span>
                  </div>
                  {isInCart && (
                    <p className="text-sm text-blue-600 mt-2">
                      Adding {quantity} more to your existing {cartItem?.quantity} in cart
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Shop
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={remainingStock === 0 || addingToCart}
                  className={`flex-1 inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    remainingStock === 0 || addingToCart
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {remainingStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </>
                  )}
                </button>
              </div>
            </div>
           
            {/* Specifications section for desktop */}
            {product && product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                  <tbody>
                    {(Object.entries(product.specifications) as [string, unknown][]).map(
                      ([key, value], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {Array.isArray(value) ? value.join(', ') : value?.toString()}
                            </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 