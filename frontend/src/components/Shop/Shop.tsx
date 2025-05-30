import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, productsApi } from '../../services/api';

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            {filteredProducts.map((product) => (
              <div key={product._id} className="card group">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-contrast">
                      <Link to={`/product/${product._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Brand: {product.brand}</span>
                      {product.stock > 0 ? (
                        <span className="ml-4 text-sm text-green-600">In Stock: {product.stock}</span>
                      ) : (
                        <span className="ml-4 text-sm text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-contrast">${product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  className="btn-primary mt-4 w-full"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;