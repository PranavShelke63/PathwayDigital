import React, { useState, useEffect } from 'react';
import { Product, productsApi, categoriesApi, Category, deleteImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import LoadingSpinner from '../LoadingSpinner';

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  // Move all useState calls to the top
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customSpecKey, setCustomSpecKey] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  // Update formData to only include fields from backend Product.js
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    brand: '',
    category: 'ASUS MB 1&2',
    price: 0,
    image: '',
    images: [],
    stock: 0,
    warranty: '',
    specifications: {},
    features: [],
    ratings: 0,
    numReviews: 0,
  });
  const [step, setStep] = useState(1);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data.data.categories);
    } catch (err) {
      setCategories([]);
    }
  };

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Use selectedProduct for edit, createdProduct for add, fallback to formData
        const product = selectedProduct || createdProduct || formData;
        let categoryName = 'UnknownCategory';
        if (typeof product.category === 'object' && product.category !== null) {
          categoryName = (product.category as any).name;
        } else if (typeof product.category === 'string') {
          const found = categories.find(cat => cat._id === product.category);
          if (found) categoryName = found.name;
        }
        const response = await productsApi.uploadImage(
          file,
          product.brand || 'UnknownBrand',
          categoryName,
          product.name || 'UnknownProduct'
        );
        setFormData(prev => ({ ...prev, image: response.data.data.url }));
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const uploadedUrls: string[] = [];
    // Use selectedProduct for edit, createdProduct for add, fallback to formData
    const product = selectedProduct || createdProduct || formData;
    let categoryName = 'UnknownCategory';
    if (typeof product.category === 'object' && product.category !== null) {
      categoryName = (product.category as any).name;
    } else if (typeof product.category === 'string') {
      const found = categories.find(cat => cat._id === product.category);
      if (found) categoryName = found.name;
    }
    for (const file of files) {
      try {
        const response = await productsApi.uploadImage(
          file,
          product.brand || 'UnknownBrand',
          categoryName,
          product.name || 'UnknownProduct'
        );
        uploadedUrls.push(response.data.data.url);
      } catch {
        setError('Failed to upload one or more images');
      }
    }
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...uploadedUrls] }));
  };

  const handleRemoveImage = async (imgPath: string, isMain: boolean = false) => {
    try {
      await deleteImage(imgPath);
      if (isMain) {
        setFormData(prev => ({ ...prev, image: '' }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: prev.images?.filter(img => img !== imgPath)
        }));
      }
    } catch {
      setError('Failed to delete image');
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Update existing product
        await productsApi.update(selectedProduct._id, formData);
        // Go to step 2 for image editing
        setStep(2);
      } else {
        // Create product without images
        const { _id, ...productData } = formData; // Remove _id if present
        const response = await productsApi.create(productData as Omit<Product, '_id'>);
        setCreatedProduct(response.data.data.data || response.data.data); // support both possible API shapes
        setStep(2);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save product details');
    }
  };

  const handleImagesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = selectedProduct?._id || createdProduct?._id;
    if (!productId) return;
    try {
      await productsApi.update(productId, {
        image: formData.image,
        images: formData.images,
      });
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
      setCreatedProduct(null);
      setStep(1);
      setFormData({
        name: '',
        description: 'No description provided.',
        brand: '',
        category: '',
        price: 0,
        image: '',
        images: [],
        stock: 0,
        warranty: '',
        specifications: {},
        features: [],
        ratings: 0,
        numReviews: 0,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save product images');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      ...product,
      description: product.description && product.description.trim() !== '' ? product.description : 'No description provided.',
      specifications: { ...product.specifications },
      images: product.images || [],
    });
    setStep(1);
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

  // Helper to format price with commas and rupee symbol
  const formatPrice = (price: number) => `₹ ${price.toLocaleString('en-IN')}`;

  if (loading) return <LoadingSpinner message="Loading products..." />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  // 1. Category dropdown: use backend enum values
  // const CATEGORY_OPTIONS = [
  //   'ASUS MB 1&2',
  //   'ASUS VGA',
  //   'ASUS Headset',
  //   'ASUS Keyboard',
  //   'ASUS Mouse',
  //   'ASUS Monitor',
  //   'ASUS ODD',
  //   'PSU Chasis',
  //   'ASUS NUC',
  // ];

  // 2. Main image and multiple images support
  // 3. Specifications: match ProductDetails keys and allow editing
  // Remove DEFAULT_SPEC_FIELDS and only use keys from formData.specifications
  const allSpecKeys = Object.keys(formData.specifications || {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-contrast">Product Management</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setFormData({
              name: '',
              description: 'No description provided.',
              brand: '',
              category: '', // <-- empty string, not a name!
              price: 0,
              image: '',
              images: [],
              stock: 0,
              warranty: '',
              specifications: {},
              features: [],
              ratings: 0,
              numReviews: 0,
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
        {/* Responsive table wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Image</th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Stock</th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <img src={getImageUrl(product.image)} alt={product.name} className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded" />
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{formatPrice(product.price)}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap capitalize">{typeof product.category === 'object' && product.category !== null ? product.category.name : product.category || ''}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 sm:gap-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Edit"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Delete"
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
      </div>
      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-4xl max-h-[95vh] overflow-y-auto p-2 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-contrast">
                {selectedProduct ? (step === 1 ? 'Edit Product - Details' : 'Edit Product - Images') : (step === 1 ? 'Add New Product - Details' : 'Add New Product - Images')}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setStep(1); setSelectedProduct(null); setCreatedProduct(null); }} className="text-gray-500 hover:text-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            {step === 1 ? (
              <form onSubmit={handleDetailsSubmit} className="space-y-4 sm:space-y-6">
                {/* Details/specifications form (same as before, minus image fields) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  {/* Basic Information */}
                  <div className="space-y-3 sm:space-y-4">
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
                        value={typeof formData.category === 'object' && formData.category !== null ? formData.category._id : formData.category || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(option => (
                          <option key={option._id} value={option._id}>{option.name}</option>
                        ))}
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
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg font-medium text-contrast">Specifications</h3>
                    
                    {allSpecKeys.map((key) => (
                      <div key={key} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={key}
                          readOnly
                          className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50"
                        />
                        <input
                          type="text"
                          name={`specifications.${key}`}
                          value={Array.isArray((formData.specifications || {})[key]) ? (formData.specifications || {})[key].join(', ') : (formData.specifications || {})[key] || ''}
                          onChange={e => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              specifications: {
                                ...prev.specifications,
                                [key]: value.includes(',') ? value.split(',').map(s => s.trim()) : value,
                              },
                            }));
                          }}
                          className="w-2/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                        <button type="button" onClick={() => {
                          const { [key]: _, ...rest } = formData.specifications || {};
                          setFormData(prev => ({ ...prev, specifications: rest }));
                        }} className="btn-secondary text-xs">Remove</button>
                      </div>
                    ))}
                    {/* Add custom spec field */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Custom spec key"
                        value={customSpecKey}
                        onChange={e => setCustomSpecKey(e.target.value)}
                        className="w-full sm:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customSpecKey && !(formData.specifications && customSpecKey in formData.specifications)) {
                            setFormData(prev => ({
                              ...prev,
                              specifications: { ...prev.specifications, [customSpecKey]: '' },
                            }));
                            setCustomSpecKey('');
                          }
                        }}
                        className="btn-primary text-xs"
                      >Add Spec Field</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                  <button type="button" onClick={() => { setIsModalOpen(false); setStep(1); setSelectedProduct(null); setCreatedProduct(null); }} className="btn-secondary w-full sm:w-auto">Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto">{selectedProduct ? 'Next: Edit Images' : 'Next: Add Images'}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleImagesSubmit} className="space-y-4 sm:space-y-6">
                {/* Only image upload fields, using selectedProduct or createdProduct info for upload paths */}
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full"
                  />
                  {formData.image && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={getImageUrl(formData.image)} alt="Preview" className="h-20 w-20 object-cover rounded" />
                      <button type="button" onClick={() => handleRemoveImage(formData.image as string, true)} className="btn-secondary text-xs">Remove</button>
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    className="mt-1 block w-full"
                  />
                  {formData.images && formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={getImageUrl(img)} alt={`Product ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                          {img && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(img as string, false)}
                              className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 group-hover:block hidden"
                              title="Remove image"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                  <button type="button" onClick={() => { setIsModalOpen(false); setStep(1); setSelectedProduct(null); setCreatedProduct(null); }} className="btn-secondary w-full sm:w-auto">Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto">Finish</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 