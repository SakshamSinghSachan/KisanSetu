import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShoppingCart, HiSearch, HiClock, HiCheckCircle, HiTruck, HiStar, HiLocationMarker, HiTrendingUp, HiArrowRight } from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  shipped: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  delivered: 'bg-green-500/20 text-green-400 border border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30'
};

const Dashboard = () => {
  const { user, API } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders || []);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const stats = [
    { 
      label: 'Total Orders', 
      value: orders.length, 
      icon: HiShoppingCart, 
      color: 'from-primary-500 to-emerald-600',
      bgColor: 'bg-primary-500/10',
      iconColor: 'text-primary-400'
    },
    { 
      label: 'In Progress', 
      value: pendingOrders.length, 
      icon: HiClock, 
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    { 
      label: 'Total Spent', 
      value: `₹${totalSpent.toLocaleString()}`, 
      icon: HiTrendingUp, 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-heading text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-saffron-400">{user?.name}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Track your purchases and deliveries</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gray-800/50 rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-saffron-500/10 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mb-8"
        >
          {[
            { id: 'orders', label: 'All Orders' }, 
            { id: 'active', label: `Active (${pendingOrders.length})` }, 
            { id: 'delivered', label: `Delivered (${deliveredOrders.length})` }
          ].map(tab => (
            <motion.button 
              key={tab.id} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence>
            {(activeTab === 'orders' ? orders : activeTab === 'active' ? pendingOrders : deliveredOrders).map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-bold text-primary-400 text-xl">#{order.orderNumber}</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <h4 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wider">Items</h4>
                        <div className="space-y-3">
                          {order.items?.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl">
                                🥬
                              </div>
                              <div>
                                <div className="font-semibold text-white">{item.name}</div>
                                <div className="text-sm text-gray-400">{item.quantity} {item.unit} × ₹{item.price}</div>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <p className="text-sm text-primary-400 font-medium">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                      </div>

                      {/* Seller & Address */}
                      <div>
                        <h4 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wider">Seller</h4>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold">{order.seller?.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{order.seller?.name}</div>
                            <div className="text-sm text-gray-400">Verified Seller</div>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-sm text-gray-500 mb-2 uppercase tracking-wider">Deliver To</h4>
                        <div className="flex items-start space-x-2">
                          <HiLocationMarker className="w-4 h-4 text-primary-400 mt-0.5" />
                          <p className="text-sm text-gray-300">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.tracking?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <h4 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wider">Tracking</h4>
                        <div className="flex flex-wrap gap-2">
                          {order.tracking.map((t, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1.5 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-xl">
                              {t.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="lg:text-right lg:min-w-[180px]">
                    <div className="text-3xl font-bold text-white mb-1">₹{order.total}</div>
                    <div className={`text-sm font-semibold mb-3 ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {order.paymentStatus === 'paid' ? '✓ Paid' : 'Cash on Delivery'}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <Link 
                      to={`/orders`} 
                      className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-semibold text-sm group/link"
                    >
                      <span>View Details</span>
                      <HiArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {(activeTab === 'orders' ? orders : activeTab === 'active' ? pendingOrders : deliveredOrders).length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-3xl p-16 text-center border border-gray-700/50"
            >
              <div className="text-8xl mb-6">📦</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {activeTab === 'active' ? 'No active orders' : activeTab === 'delivered' ? 'No delivered orders yet' : 'No orders yet'}
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Start shopping to see your orders here. Fresh produce from farmers awaits you!
              </p>
              <Link 
                to="/marketplace" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
              >
                <HiSearch className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
