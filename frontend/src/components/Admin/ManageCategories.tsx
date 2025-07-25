import React, { useEffect, useState } from 'react';
import { categoriesApi, Category, productsApi, Product } from '../../services/api';
import toast from 'react-hot-toast';

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; description?: string }>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewCategoryId, setViewCategoryId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data.data.categories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productsApi.getAll();
      setProducts(res.data.data.data);
    } catch (err) {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form);
        toast.success('Category updated');
      } else {
        await categoriesApi.create(form);
        toast.success('Category created');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditingId(cat._id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoriesApi.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting category');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-contrast">Manage Categories</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="btn-primary">
          {editingId ? 'Update Category' : 'Add Category'}
        </button>
        {editingId && (
          <button type="button" className="ml-4 btn-secondary" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}>
            Cancel
          </button>
        )}
      </form>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Category List</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : categories.length === 0 ? (
          <div>No categories found.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map(cat => {
              const count = products.filter(p => (typeof p.category === 'object' && p.category !== null ? p.category._id : p.category) === cat._id).length;
              const isViewing = viewCategoryId === cat._id;
              return (
                <li key={cat._id} className="py-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-contrast">{cat.name} <span className="text-xs text-gray-500">({count} product{count !== 1 ? 's' : ''})</span></div>
                      {cat.description && <div className="text-sm text-gray-500">{cat.description}</div>}
                    </div>
                    <div className="flex gap-2 items-center">
                      <button className="btn-secondary" onClick={() => handleEdit(cat)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
                      <button className="btn-primary text-xs" onClick={() => setViewCategoryId(isViewing ? null : cat._id)}>
                        {isViewing ? 'Hide Products' : 'View All Products'}
                      </button>
                    </div>
                  </div>
                  {isViewing && (
                    <div className="mt-2 bg-gray-50 rounded p-3">
                      {products.filter(p => (typeof p.category === 'object' && p.category !== null ? p.category._id : p.category) === cat._id).length === 0 ? (
                        <div className="text-sm text-gray-500">No products in this category.</div>
                      ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {products.filter(p => (typeof p.category === 'object' && p.category !== null ? p.category._id : p.category) === cat._id).map(p => (
                            <li key={p._id} className="flex items-center gap-4 bg-white rounded shadow p-2 border border-gray-100">
                              <img
                                src={p.image?.startsWith('http') ? p.image : `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}/${p.image}`}
                                alt={p.name}
                                className="w-14 h-14 object-contain rounded border"
                                style={{ background: '#f3f4f6' }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-contrast truncate">{p.name}</div>
                                <div className="text-xs text-gray-500 truncate">Brand: <span className="font-medium text-gray-700">{p.brand}</span></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCategories; 