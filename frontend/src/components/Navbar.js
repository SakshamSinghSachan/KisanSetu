import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiShoppingCart, HiChat, HiChartBar, HiTruck, HiUser, HiLogout, HiPlus, HiHome, HiSearch } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: HiHome },
    { name: 'Marketplace', path: '/marketplace', icon: HiSearch },
  ];

  const authLinks = user ? [
    { name: 'Dashboard', path: '/dashboard', icon: HiChartBar },
    { name: 'Orders', path: '/orders', icon: HiShoppingCart },
    { name: 'Chat', path: '/chat', icon: HiChat },
    ...(user.role === 'farmer' || user.role === 'fpo' ? [
      { name: 'Add Product', path: '/add-product', icon: HiPlus },
      { name: 'Logistics', path: '/logistics', icon: HiTruck },
    ] : []),
  ] : [];

  const allLinks = [...navLinks, ...authLinks];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100' 
            : 'bg-white/10 backdrop-blur-md border-b border-white/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-11 h-11 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <span className="text-white font-bold text-xl">K</span>
              </motion.div>
              <span className={`text-2xl font-bold font-heading transition-colors ${scrolled ? 'gradient-text' : 'text-white'}`}>
                KisanSetu
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {allLinks.map((link) => {
                const isActive = activeRoute === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50' 
                        : scrolled 
                          ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary-500 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all group">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md"
                    >
                      <span className="text-white text-sm font-semibold">{user.name?.charAt(0)}</span>
                    </motion.div>
                    <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'}`}>{user.name}</span>
                  </Link>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout} 
                    className={`p-2.5 rounded-xl transition-all ${
                      scrolled 
                        ? 'text-gray-500 hover:text-red-500 hover:bg-red-50' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <HiLogout className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                    scrolled 
                      ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)} 
              className={`lg:hidden p-2.5 rounded-xl transition-all ${
                scrolled 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <span className="text-xl font-bold gradient-text font-heading">KisanSetu</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {allLinks.map((link) => {
                    const isActive = activeRoute === link.path;
                    return (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-3">
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{user.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                      </Link>
                      <button 
                        onClick={() => { logout(); setMobileOpen(false); }} 
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full transition"
                      >
                        <HiLogout className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">
                        Login
                      </Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg">
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
