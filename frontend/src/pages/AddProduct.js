import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiUpload, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Organic', 'Other'];
const units = ['kg', 'dozen', 'piece', 'bundle', 'litre', 'quintal'];

const AddProduct = () => {
  const { API } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', category: 'Vegetables', price: '', unit: 'kg', quantity: '',
    organic: false, harvestDate: '', minOrderQuantity: '1',
    bulkDiscount: { enabled: false, minQuantity: '', discountPercent: '' }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/products', { ...form, price: Number(form.price), quantity: Number(form.quantity) });
      toast.success('Product listed successfully!');
      navigate('/dashboard');
    } catch (error) { toast.error(error.response?.data?.error || 'Failed to add product'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Add New Product</h1>
        <p className="text-gray-600 mb-8">List your fresh produce on KisanSetu</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" placeholder="e.g., Fresh Organic Tomatoes" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" rows="3" placeholder="Describe your product..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organic</label>
                  <label className="flex items-center space-x-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={form.organic} onChange={(e) => setForm({...form, organic: e.target.checked})} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">This is an organic product</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="input-field" placeholder="0" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit *</label>
                <select value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} className="input-field">
                  {units.map(u => <option key={u}>per {u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Quantity *</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} className="input-field" placeholder="0" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Order Quantity</label>
                <input type="number" value={form.minOrderQuantity} onChange={(e) => setForm({...form, minOrderQuantity: e.target.value})} className="input-field" placeholder="1" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Harvest Date</label>
              <input type="date" value={form.harvestDate} onChange={(e) => setForm({...form, harvestDate: e.target.value})} className="input-field" />
            </div>
          </div>

          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition cursor-pointer">
              <HiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary !py-4 text-lg">
            {loading ? 'Listing Product...' : 'List Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
