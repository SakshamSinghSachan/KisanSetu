import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiShoppingCart, HiSearch, HiClock, HiCheckCircle, HiTruck, HiStar, HiLocationMarker } from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: HiClock,
  confirmed: HiCheckCircle,
  shipped: HiTruck,
  delivered: HiCheckCircle
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

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading">My Orders</h1>
          <p className="text-gray-600 mt-1">Track your purchases and deliveries</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 bg-gradient-to-br from-primary-500 to-emerald-600 text-white">
            <HiShoppingCart className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">{orders.length}</h3>
            <p className="text-green-100 text-sm">Total Orders</p>
          </div>
          <div className="card-premium p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white">
            <HiClock className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">{pendingOrders.length}</h3>
            <p className="text-orange-100 text-sm">In Progress</p>
          </div>
          <div className="card-premium p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <HiTruck className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</h3>
            <p className="text-blue-100 text-sm">Total Spent</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[{ id: 'orders', label: 'All Orders' }, { id: 'active', label: `Active (${pendingOrders.length})` }, { id: 'delivered', label: `Delivered (${deliveredOrders.length})` }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {(activeTab === 'orders' ? orders : activeTab === 'active' ? pendingOrders : deliveredOrders).map(order => (
            <div key={order._id} className="card-premium p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-primary-600 text-lg">#{order.orderNumber}</span>
                    <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">ITEMS</h4>
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">🥬</div>
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.quantity} {item.unit} × ₹{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">SELLER</h4>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-semibold text-sm">{order.seller?.name?.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium">{order.seller?.name}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1">DELIVER TO</h4>
                      <p className="text-sm text-gray-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                    </div>
                  </div>

                  {order.tracking?.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">TRACKING</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.tracking.map((t, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{t.status}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right md:min-w-[150px]">
                  <div className="text-2xl font-bold text-primary-600">₹{order.total}</div>
                  <div className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus === 'paid' ? 'Paid' : 'Cash on Delivery'}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}

          {(activeTab === 'orders' ? orders : activeTab === 'active' ? pendingOrders : deliveredOrders).length === 0 && (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">
                {activeTab === 'active' ? 'No active orders' : activeTab === 'delivered' ? 'No delivered orders yet' : 'No orders yet'}
              </h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link to="/marketplace" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition inline-flex items-center space-x-2">
                <HiSearch className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
