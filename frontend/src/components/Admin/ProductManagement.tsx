import React, { useState, useEffect } from 'react';
import { Product, productsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'laptops',
    brand: '',
    stock: 0,
    warranty: '',
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      display: '',
      operatingSystem: '',
      connectivity: [],
      ports: [],
    },
    features: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!user || user.email !== 'pranavopshelke@gmail.com') {
    return <Navigate to="/" replace />;
  }

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data.data.data); // Access the nested data structure
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Product] as Record<string, any> || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const response = await productsApi.uploadImage(file);
        setFormData(prev => ({ ...prev, image: response.data.data.url }));
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await productsApi.update(selectedProduct._id, formData);
      } else {
        await productsApi.create(formData as Omit<Product, '_id'>);
      }
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'laptops',
        brand: '',
        stock: 0,
        warranty: '',
        specifications: {
          processor: '',
          ram: '',
          storage: '',
          graphics: '',
          display: '',
          operatingSystem: '',
          connectivity: [],
          ports: [],
        },
        features: [],
      });
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        await fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  // Helper to get image URL
  const backendBase = (process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000');
  const getImageUrl = (image: string | undefined) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `${backendBase}/${image}`;
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-contrast">Product Management</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setFormData({
              name: '',
              description: '',
              price: 0,
              category: 'laptops',
              brand: '',
              stock: 0,
              warranty: '',
              specifications: {
                processor: '',
                ram: '',
                storage: '',
                graphics: '',
                display: '',
                operatingSystem: '',
                connectivity: [],
                ports: [],
              },
              features: [],
            });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={getImageUrl(product.image)} alt={product.name} className="h-12 w-12 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-contrast">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    >
                      <option value="laptops">Laptops</option>
                      <option value="desktops">Desktops</option>
                      <option value="components">Components</option>
                      <option value="accessories">Accessories</option>
                      <option value="monitors">Monitors</option>
                      <option value="networking">Networking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-contrast">Specifications</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Processor</label>
                    <input
                      type="text"
                      name="specifications.processor"
                      value={formData.specifications?.processor || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">RAM</label>
                    <input
                      type="text"
                      name="specifications.ram"
                      value={formData.specifications?.ram || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Storage</label>
                    <input
                      type="text"
                      name="specifications.storage"
                      value={formData.specifications?.storage || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Graphics</label>
                    <input
                      type="text"
                      name="specifications.graphics"
                      value={formData.specifications?.graphics || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Display</label>
                    <input
                      type="text"
                      name="specifications.display"
                      value={formData.specifications?.display || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Operating System</label>
                    <input
                      type="text"
                      name="specifications.operatingSystem"
                      value={formData.specifications?.operatingSystem || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Connectivity (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.specifications?.connectivity?.join(', ') || ''}
                      onChange={(e) => handleArrayInputChange(e, 'specifications.connectivity')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ports (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.specifications?.ports?.join(', ') || ''}
                      onChange={(e) => handleArrayInputChange(e, 'specifications.ports')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.features?.join(', ') || ''}
                      onChange={(e) => handleArrayInputChange(e, 'features')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1 block w-full"
                    />
                    {formData.image && (
                      <img src={getImageUrl(formData.image)} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 