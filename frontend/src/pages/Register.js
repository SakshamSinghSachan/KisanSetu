import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

const roles = [
  { id: 'farmer', label: 'Farmer', icon: '👨‍🌾', desc: 'Sell your produce directly' },
  { id: 'consumer', label: 'Consumer', icon: '🛒', desc: 'Buy fresh produce' },
  { id: 'fpo', label: 'FPO', icon: '🏛️', desc: 'Farmer Producer Organization' },
  { id: 'bulkBuyer', label: 'Bulk Buyer', icon: '🏪', desc: 'Wholesale purchasing' }
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'consumer' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-saffron-50 px-4 pt-20 pb-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-heading">Join KisanSetu</h1>
          <p className="text-gray-600 mt-2">Start your journey in fair agriculture trade</p>
        </div>
        <div className="card-premium p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button key={role.id} type="button" onClick={() => setForm({ ...form, role: role.id })} className={`p-4 rounded-xl border-2 text-left transition-all ${form.role === role.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="font-semibold text-sm">{role.label}</div>
                  <div className="text-xs text-gray-500">{role.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field !pl-10" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field !pl-10" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field !pl-10" placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field !pl-10" placeholder="Min 6 characters" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
