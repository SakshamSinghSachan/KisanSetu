import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiShoppingCart, HiChat, HiChartBar, HiTruck, HiUser, HiLogout, HiPlus, HiHome, HiSearch, HiDotsVertical } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');
  const [showMore, setShowMore] = useState(false);
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

  // Essential links shown in navbar
  const essentialLinks = user ? [
    { name: 'Home', path: '/', icon: HiHome },
    { name: 'Marketplace', path: '/marketplace', icon: HiSearch },
    { name: 'Dashboard', path: '/dashboard', icon: HiChartBar },
  ] : [
    { name: 'Home', path: '/', icon: HiHome },
    { name: 'Marketplace', path: '/marketplace', icon: HiSearch },
  ];

  // Extra links hidden in dropdown
  const extraLinks = user ? [
    { name: 'Orders', path: '/orders', icon: HiShoppingCart },
    { name: 'Chat', path: '/chat', icon: HiChat },
    ...(user.role === 'farmer' || user.role === 'fpo' ? [
      { name: 'Add Product', path: '/add-product', icon: HiPlus },
      { name: 'Logistics', path: '/logistics', icon: HiTruck },
    ] : []),
  ] : [];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-800' 
            : 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <span className="text-white font-bold text-lg">K</span>
              </motion.div>
              <span className="text-xl font-bold font-heading text-white">
                Kisan<span className="text-primary-400">Setu</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {essentialLinks.map((link) => {
                const isActive = activeRoute === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'text-primary-400 bg-primary-500/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* More Dropdown for Extra Links */}
              {extraLinks.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setShowMore(!showMore)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <HiDotsVertical className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {showMore && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 overflow-hidden"
                      >
                        {extraLinks.map((link) => (
                          <Link 
                            key={link.path}
                            to={link.path}
                            onClick={() => setShowMore(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
                          >
                            <link.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{link.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all group">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md"
                    >
                      <span className="text-white text-sm font-semibold">{user.name?.charAt(0)}</span>
                    </motion.div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors hidden lg:block">{user.name}</span>
                  </Link>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout} 
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <HiLogout className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Click outside to close dropdown */}
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-gray-900 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <span className="text-xl font-bold font-heading text-white">
                      Kisan<span className="text-primary-400">Setu</span>
                    </span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {essentialLinks.map((link) => {
                    const isActive = activeRoute === link.path;
                    return (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-primary-500/10 text-primary-400' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    );
                  })}
                  
                  {extraLinks.length > 0 && (
                    <>
                      <div className="border-t border-gray-800 my-4"></div>
                      {extraLinks.map((link) => {
                        const isActive = activeRoute === link.path;
                        return (
                          <Link 
                            key={link.path} 
                            to={link.path} 
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                              isActive 
                                ? 'bg-primary-500/10 text-primary-400' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <link.icon className="w-5 h-5" />
                            <span className="font-medium">{link.name}</span>
                          </Link>
                        );
                      })}
                    </>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  {user ? (
                    <div className="space-y-3">
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{user.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                      </Link>
                      <button 
                        onClick={() => { logout(); setMobileOpen(false); }} 
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 w-full transition"
                      >
                        <HiLogout className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-white/5 hover:border-gray-600 transition">
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
