import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, productsApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'desktops', name: 'Desktops' },
    { id: 'components', name: 'Components' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'monitors', name: 'Monitors' },
    { id: 'networking', name: 'Networking' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll();
      setProducts(response.data.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const getItemInCart = (productId: string) => {
    return cartItems.find(item => item._id === productId);
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading products...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="bg-background">
      <div className="max-w-2xl mx-auto pt-8 px-4 sm:pt-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-contrast">Shop</h1>
          <p className="mt-3 text-base text-gray-500">
            Browse our collection of high-quality tech hardware and accessories.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-background text-contrast hover:bg-accent'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {filteredProducts.map((product) => {
              const cartItem = getItemInCart(product._id);
              const isInCart = !!cartItem;
              const remainingStock = product.stock - (cartItem?.quantity || 0);
              const inWishlist = isInWishlist(product._id);

              return (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="card group relative block"
                >
                  <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
                  >
                    {inWishlist ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-contrast group-hover:text-primary">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Brand: {product.brand}</span>
                        {remainingStock > 0 ? (
                          <span className="ml-4 text-sm text-green-600">In Stock: {remainingStock}</span>
                        ) : (
                          <span className="ml-4 text-sm text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-contrast">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      remainingStock === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isInCart
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                    disabled={remainingStock === 0}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    {remainingStock === 0
                      ? 'Out of Stock'
                      : isInCart
                      ? `Add More (${cartItem.quantity} in cart)`
                      : 'Add to Cart'}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;