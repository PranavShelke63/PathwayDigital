import { useState } from 'react';
import { Link } from 'react-router-dom';

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'peripherals', name: 'Peripherals' },
    { id: 'components', name: 'Components' },
    { id: 'monitors', name: 'Monitors' }
  ];

  // This is a placeholder. In a real application, you would fetch products from an API
  const mockProducts = [
    {
      id: '1',
      name: 'Gaming Laptop',
      price: 1299.99,
      description: 'High-performance gaming laptop with RTX 4060',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1468&q=80',
      category: 'laptops'
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      price: 129.99,
      description: 'RGB mechanical keyboard with Cherry MX switches',
      image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'peripherals'
    },
    {
      id: '3',
      name: 'Gaming Mouse',
      price: 99.99,
      description: 'High-precision gaming mouse with adjustable DPI',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1467&q=80',
      category: 'peripherals'
    },
    {
      id: '4',
      name: 'Gaming Monitor',
      price: 399.99,
      description: '27" 1440p 165Hz gaming monitor',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'monitors'
    },
    {
      id: '5',
      name: 'RTX 4080 Graphics Card',
      price: 799.99,
      description: 'High-end graphics card for gaming and content creation',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'components'
    },
    {
      id: '6',
      name: 'Intel i9 Processor',
      price: 549.99,
      description: '13th Gen Intel Core i9 processor',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'components'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="bg-background">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="pb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-contrast">Shop</h1>
          <p className="mt-4 text-base text-gray-500">
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

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card group">
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
                    <Link to={`/product/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                </div>
                <p className="text-sm font-medium text-contrast">${product.price.toFixed(2)}</p>
              </div>
              <button
                type="button"
                className="btn-primary mt-4 w-full"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop; 