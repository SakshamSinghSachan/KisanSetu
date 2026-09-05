import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiShoppingCart, HiChat, HiChartBar, HiTruck, HiUser, HiLogout, HiPlus, HiHome, HiSearch } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold gradient-text font-heading">KisanSetu</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {[...navLinks, ...authLinks].map((link) => (
              <Link key={link.path} to={link.path} className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{user.name?.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/20 animate-in">
          <div className="px-4 py-3 space-y-1">
            {[...navLinks, ...authLinks].map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition">
                <link.icon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full">
                <HiLogout className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <div className="pt-2 space-y-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full btn-ghost text-center">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full btn-primary text-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
