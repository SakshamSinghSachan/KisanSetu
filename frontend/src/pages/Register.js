import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiArrowRight, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const roles = [
  { id: 'farmer', label: 'Farmer', icon: '👨‍🌾', desc: 'Sell your produce directly', color: 'from-green-500 to-emerald-600' },
  { id: 'consumer', label: 'Consumer', icon: '🛒', desc: 'Buy fresh produce', color: 'from-blue-500 to-indigo-600' },
  { id: 'fpo', label: 'FPO', icon: '🏛️', desc: 'Farmer Producer Organization', color: 'from-purple-500 to-pink-600' },
  { id: 'bulkBuyer', label: 'Bulk Buyer', icon: '🏪', desc: 'Wholesale purchasing', color: 'from-orange-500 to-amber-600' }
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'consumer' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-saffron-500 px-4 pt-20 pb-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2LTJoLTZ2NmgydjJ6bTAtOHYtMmgtMnYyaDJ6bTYgOGgtMnY0aDJ2LTR6bTAtOHYtMmgtMnYyaDJ6bTYgOGgtMnY0aDJ2LTR6bTAtOHYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-primary-600 font-bold text-2xl">K</span>
            </motion.div>
          </Link>
          <h1 className="text-4xl font-bold font-heading text-white mb-2">Join KisanSetu</h1>
          <p className="text-white/80 text-lg">Start your journey in fair agriculture trade</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s 
                  ? 'bg-white text-primary-600 shadow-lg' 
                  : 'bg-white/20 text-white/60'
              }`}>
                {step > s ? <HiCheck className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all ${step > s ? 'bg-white' : 'bg-white/20'}`}></div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">I am a...</h2>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <motion.button 
                      key={role.id} 
                      type="button" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setForm({ ...form, role: role.id })} 
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                        form.role === role.id 
                          ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {form.role === role.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <HiCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-3`}>
                        <span className="text-2xl">{role.icon}</span>
                      </div>
                      <div className="font-bold text-gray-900 mb-1">{role.label}</div>
                      <div className="text-sm text-gray-500">{role.desc}</div>
                    </motion.button>
                  ))}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button" 
                  onClick={() => setStep(2)} 
                  className="w-full mt-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <HiArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Details</h2>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Change Role
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative group">
                      <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="text" 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-gray-50 focus:bg-white" 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative group">
                      <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="email" 
                        value={form.email} 
                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-gray-50 focus:bg-white" 
                        placeholder="your@email.com" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative group">
                      <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="tel" 
                        value={form.phone} 
                        onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-gray-50 focus:bg-white" 
                        placeholder="+91 98765 43210" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative group">
                      <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="password" 
                        value={form.password} 
                        onChange={(e) => setForm({ ...form, password: e.target.value })} 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-gray-50 focus:bg-white" 
                        placeholder="Min 6 characters" 
                        required 
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Must be at least 6 characters</p>
                  </div>

                  {/* Submit */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <HiArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-white/60 text-sm"
        >
          By signing up, you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
