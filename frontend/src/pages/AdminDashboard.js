import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiUsers, HiShoppingCart, HiCurrencyRupee, HiPackage, HiTrash, HiRefresh, HiCog } from 'react-icons/hi';
import toast from 'react-hot-toast';

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  farmer: 'bg-green-100 text-green-800',
  consumer: 'bg-blue-100 text-blue-800',
  fpo: 'bg-orange-100 text-orange-800',
  bulkBuyer: 'bg-pink-100 text-pink-800'
};

const AdminDashboard = () => {
  const { API } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/products'),
        API.get('/admin/orders')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const changeRole = async (userId, newRole) => {
    try {
      await API.put(`/admin/user/${userId}/role`, { role: newRole });
      toast.success('Role updated!');
      fetchData();
    } catch (error) { toast.error('Failed to update role'); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/user/${userId}`);
      toast.success('User deleted!');
      fetchData();
    } catch (error) { toast.error('Failed to delete user'); }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/product/${productId}`);
      toast.success('Product deleted!');
      fetchData();
    } catch (error) { toast.error('Failed to delete product'); }
  };

  const makeAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to make this user an Admin?')) return;
    await changeRole(userId, 'admin');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: HiUsers, color: 'from-blue-500 to-indigo-600', sub: `Farmers: ${stats?.totalFarmers || 0} | Consumers: ${stats?.totalConsumers || 0}` },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: HiPackage, color: 'from-green-500 to-emerald-600', sub: `Active: ${stats?.activeProducts || 0}` },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: HiShoppingCart, color: 'from-orange-500 to-amber-600', sub: 'All time' },
    { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: HiCurrencyRupee, color: 'from-purple-500 to-pink-600', sub: 'Platform total' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <HiCog className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
              <p className="text-gray-600">Full control over KisanSetu platform</p>
            </div>
          </div>
          <button onClick={fetchData} className="btn-primary flex items-center space-x-2">
            <HiRefresh className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="card-premium p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">{card.value}</h3>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'products', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white border text-gray-600'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-premium p-6">
              <h3 className="font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats?.recentUsers?.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{user.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <span className={`badge ${roleColors[user.role]}`}>{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-premium p-6">
              <h3 className="font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {stats?.recentOrders?.map(order => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-sm">#{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">{order.buyer?.name} → {order.seller?.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">₹{order.total}</div>
                      <span className={`badge text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card-premium p-6">
            <h3 className="font-semibold mb-4">All Users ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">{user.name?.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 text-sm">{user.phone}</td>
                      <td className="py-3">
                        <select value={user.role} onChange={(e) => changeRole(user._id, e.target.value)} className="text-xs border rounded-lg px-2 py-1">
                          <option value="farmer">Farmer</option>
                          <option value="consumer">Consumer</option>
                          <option value="fpo">FPO</option>
                          <option value="bulkBuyer">Bulk Buyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          {user.role !== 'admin' && (
                            <button onClick={() => makeAdmin(user._id)} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200">Make Admin</button>
                          )}
                          <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-700"><HiTrash className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="card-premium p-6">
            <h3 className="font-semibold mb-4">All Products ({products.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Seller</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3 text-sm text-gray-600">{product.seller?.name}</td>
                      <td className="py-3 font-semibold text-primary-600">₹{product.price}/{product.unit}</td>
                      <td className="py-3">{product.quantity}</td>
                      <td className="py-3"><span className="badge bg-gray-100 text-gray-800">{product.category}</span></td>
                      <td className="py-3">
                        <button onClick={() => deleteProduct(product._id)} className="text-red-500 hover:text-red-700"><HiTrash className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card-premium p-6">
            <h3 className="font-semibold mb-4">All Orders ({orders.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Order #</th>
                    <th className="pb-3 font-medium">Buyer</th>
                    <th className="pb-3 font-medium">Seller</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 font-medium text-primary-600">#{order.orderNumber}</td>
                      <td className="py-3 text-sm">{order.buyer?.name}</td>
                      <td className="py-3 text-sm">{order.seller?.name}</td>
                      <td className="py-3 font-semibold">₹{order.total}</td>
                      <td className="py-3">
                        <span className={`badge ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
