import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, productsApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ShoppingCartIcon, HeartIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Actual filter term
  const [sortOption, setSortOption] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'ASUS Mouse', name: 'Mouse' },
    { id: 'ASUS Keyboard', name: 'Keyboard' },
    { id: 'ASUS Headset', name: 'Headset' }
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

  let filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const lowerSearch = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerSearch) ||
      product.brand.toLowerCase().includes(lowerSearch) ||
      product.category.toLowerCase().includes(lowerSearch);
    const matchesStock = !inStockOnly || product.stock > 0;
    return matchesCategory && (!searchQuery || matchesSearch) && matchesStock;
  });

  // Sorting
  if (sortOption === 'priceLowHigh') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'priceHighLow') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === 'nameAZ') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'nameZA') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
  }

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
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-contrast">Shop</h1>
              <p className="mt-3 text-base text-gray-500">
                Browse our collection of high-quality tech hardware and accessories.
              </p>
            </div>
            {/* Filter/Search Bar */}
            <div className="w-full bg-white/80 border border-gray-200 rounded-lg px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <form
                className="flex flex-col sm:flex-row flex-1 gap-2 sm:gap-3 w-full"
                onSubmit={e => {
                  e.preventDefault();
                  setSearchQuery(searchTerm);
                }}
              >
                <input
                  type="text"
                  placeholder="Search by name, brand, or category..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary h-full"
                  style={{ minWidth: '90px' }}
                >
                  Search
                </button>
                {/* Filter Icon/Button with Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSortDropdown(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    <span className="hidden sm:inline text-sm font-medium">Filter</span>
                  </button>
                  {showSortDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 ${sortOption === 'default' ? 'font-semibold text-primary' : ''}`}
                        onClick={() => { setSortOption('default'); setShowSortDropdown(false); }}
                      >Default</button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 ${sortOption === 'priceLowHigh' ? 'font-semibold text-primary' : ''}`}
                        onClick={() => { setSortOption('priceLowHigh'); setShowSortDropdown(false); }}
                      >Price: Low to High</button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 ${sortOption === 'priceHighLow' ? 'font-semibold text-primary' : ''}`}
                        onClick={() => { setSortOption('priceHighLow'); setShowSortDropdown(false); }}
                      >Price: High to Low</button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 ${sortOption === 'nameAZ' ? 'font-semibold text-primary' : ''}`}
                        onClick={() => { setSortOption('nameAZ'); setShowSortDropdown(false); }}
                      >Name: A-Z</button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 ${sortOption === 'nameZA' ? 'font-semibold text-primary' : ''}`}
                        onClick={() => { setSortOption('nameZA'); setShowSortDropdown(false); }}
                      >Name: Z-A</button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-nowrap gap-2 mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm ${
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
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 lg:grid-cols-3 xl:gap-x-8">
            {filteredProducts.map((product) => {
              const cartItem = getItemInCart(product._id);
              const isInCart = !!cartItem;
              const remainingStock = product.stock - (cartItem?.quantity || 0);
              const inWishlist = isInWishlist(product._id);

              // Compute image URL
              const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
              const imageUrl = product.image.startsWith('http')
                ? product.image
                : `${backendBase}/${product.image}`;

              return (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="card group relative block rounded-lg shadow-md bg-white overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-center w-full aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 z-10 w-10 h-10 flex items-center justify-center"
                  >
                    {inWishlist ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 px-3">
                    <div>
                      <h3 className="text-base font-semibold text-contrast group-hover:text-primary truncate">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-xs text-gray-500">Brand: {product.brand}</span>
                        {remainingStock > 0 ? (
                          <span className="text-xs text-green-600">In Stock: {remainingStock}</span>
                        ) : (
                          <span className="text-xs text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    <p className="text-base font-bold text-contrast">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
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