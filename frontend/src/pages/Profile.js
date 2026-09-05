import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiCamera, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, API } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: { street: '', city: '', state: '', pincode: '' }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/auth/profile', form);
      toast.success('Profile updated!');
    } catch (error) { toast.error('Failed to update profile'); }
    setLoading(false);
  };

  const roleLabels = { farmer: '👨‍🌾 Farmer', consumer: '🛒 Consumer', fpo: '🏛️ FPO', bulkBuyer: '🏪 Bulk Buyer', admin: '⚙️ Admin' };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-8">My Profile</h1>

        <div className="card-premium p-8 mb-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <HiCamera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-500">{roleLabels[user?.role] || user?.role}</p>
              <div className="flex items-center mt-1">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
                <span className="text-sm text-gray-500 ml-2">(4.8)</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field !pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field !pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-field !pl-10" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Street" value={form.address.street} onChange={(e) => setForm({...form, address: {...form.address, street: e.target.value}})} className="input-field md:col-span-2" />
                <input type="text" placeholder="City" value={form.address.city} onChange={(e) => setForm({...form, address: {...form.address, city: e.target.value}})} className="input-field" />
                <input type="text" placeholder="State" value={form.address.state} onChange={(e) => setForm({...form, address: {...form.address, state: e.target.value}})} className="input-field" />
                <input type="text" placeholder="Pincode" value={form.address.pincode} onChange={(e) => setForm({...form, address: {...form.address, pincode: e.target.value}})} className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
              <HiSave className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        <div className="card-premium p-6">
          <h3 className="font-semibold mb-4">Account Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <div className="text-2xl font-bold text-primary-600">12</div>
              <div className="text-sm text-gray-600">Orders</div>
            </div>
            <div className="text-center p-4 bg-saffron-50 rounded-xl">
              <div className="text-2xl font-bold text-saffron-600">₹15,400</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
