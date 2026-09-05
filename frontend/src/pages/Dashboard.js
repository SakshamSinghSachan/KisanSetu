import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiTrendingUp, HiShoppingCart, HiCurrencyRupee, HiPackage, HiPlus, HiEye, HiTrash, HiTruck, HiCheckCircle, HiClock } from 'react-icons/hi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  outForDelivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const Dashboard = () => {
  const { user, API } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        API.get('/products/my-products'),
        API.get('/orders'),
        API.get('/analytics/dashboard')
      ]);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data?.orders || []);
      setStats(statsRes.data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status, note: `Status updated to ${status}` });
      toast.success(`Order ${status}`);
      fetchAllData();
    } catch (error) { toast.error('Failed to update'); }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      toast.success('Product deleted');
      fetchAllData();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const totalEarnings = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status));
  const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Earnings (₹)',
      data: [2000, 4500, 3200, 5800, 4200, 7500, 6800, 8200, 7100, 9500, 8800, 11000],
      fill: true,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }]
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Welcome, {user?.name}! 👨‍🌾</h1>
            <p className="text-gray-600 mt-1">Manage your farm products and track orders</p>
          </div>
          <Link to="/add-product" className="btn-primary flex items-center space-x-2">
            <HiPlus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <HiCurrencyRupee className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</h3>
            <p className="text-green-100 text-sm">Total Earnings</p>
          </div>
          <div className="card-premium p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <HiShoppingCart className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">{orders.length}</h3>
            <p className="text-blue-100 text-sm">Total Orders</p>
          </div>
          <div className="card-premium p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white">
            <HiPackage className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">{products.length}</h3>
            <p className="text-orange-100 text-sm">Products Listed</p>
          </div>
          <div className="card-premium p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <HiTrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-2xl font-bold">{totalSold} kg</h3>
            <p className="text-purple-100 text-sm">Total Sold</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[{id: 'overview', label: 'Overview'}, {id: 'products', label: 'My Products'}, {id: 'orders', label: 'Orders'}, {id: 'pending', label: `Pending (${pendingOrders.length})`}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold mb-4">Earnings Overview</h3>
              <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-primary-600 text-sm">View All</button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-sm">#{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">{order.buyer?.name || 'Customer'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">₹{order.total}</div>
                        <span className={`badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-500 text-center py-4">No orders yet</p>}
                </div>
              </div>
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">My Products</h3>
                  <button onClick={() => setActiveTab('products')} className="text-primary-600 text-sm">View All</button>
                </div>
                <div className="space-y-3">
                  {products.slice(0, 5).map(product => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🥬</div>
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">Stock: {product.quantity} {product.unit}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-primary-600">₹{product.price}/{product.unit}</div>
                        <div className="text-xs text-gray-500">Sold: {product.soldCount || 0}</div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-gray-500 text-center py-4">No products listed yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Products ({products.length})</h3>
              <Link to="/add-product" className="btn-primary text-sm !py-2 flex items-center space-x-1">
                <HiPlus className="w-4 h-4" />
                <span>Add New</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Sold</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🥬</div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-primary-600">₹{product.price}/{product.unit}</td>
                      <td className="py-3">
                        <span className={`font-medium ${product.quantity < 10 ? 'text-red-600' : 'text-green-600'}`}>{product.quantity}</span>
                      </td>
                      <td className="py-3">{product.soldCount || 0}</td>
                      <td className="py-3"><span className="badge bg-gray-100 text-gray-800">{product.category}</span></td>
                      <td className="py-3"><span className={`badge ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <Link to={`/product/${product._id}`} className="p-1 text-blue-500 hover:text-blue-700"><HiEye className="w-4 h-4" /></Link>
                          <button onClick={() => deleteProduct(product._id)} className="p-1 text-red-500 hover:text-red-700"><HiTrash className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div className="text-center py-12"><div className="text-6xl mb-4">📦</div><h3 className="text-lg font-semibold mb-2">No products listed yet</h3><Link to="/add-product" className="btn-primary mt-4 inline-block">Add Your First Product</Link></div>}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold mb-4">All Orders ({orders.length})</h3>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-primary-600">#{order.orderNumber}</span>
                        <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Buyer:</span> {order.buyer?.name || 'Customer'} | {order.buyer?.phone || ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.map((item, i) => <span key={i}>{item.name} x {item.quantity} {item.unit}{i < order.items.length - 1 ? ', ' : ''}</span>)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold">₹{order.total}</div>
                        <div className={`text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {order.status === 'pending' && <button onClick={() => updateOrderStatus(order._id, 'confirmed')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200">Confirm</button>}
                        {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order._id, 'shipped')} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200">Ship</button>}
                        {order.status === 'shipped' && <button onClick={() => updateOrderStatus(order._id, 'delivered')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200">Deliver</button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="text-center py-12"><div className="text-6xl mb-4">📦</div><h3 className="text-lg font-semibold mb-2">No orders yet</h3><p className="text-gray-500">Orders will appear when customers buy your products</p></div>}
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Orders ({pendingOrders.length})</h3>
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <div key={order._id} className="border-2 border-yellow-200 rounded-xl p-4 bg-yellow-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-primary-600">#{order.orderNumber}</span>
                        <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1"><span className="font-medium">Buyer:</span> {order.buyer?.name} | {order.buyer?.phone}</div>
                      <div className="text-sm text-gray-500">{order.items?.map((item, i) => <span key={i}>{item.name} x {item.quantity} {item.unit}{i < order.items.length - 1 ? ', ' : ''}</span>)}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold">₹{order.total}</div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && <button onClick={() => updateOrderStatus(order._id, 'confirmed')} className="btn-primary text-sm !py-2">Accept Order</button>}
                        {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order._id, 'shipped')} className="btn-primary text-sm !py-2">Mark Shipped</button>}
                        <button onClick={() => updateOrderStatus(order._id, 'cancelled')} className="btn-ghost text-sm !py-2 text-red-600 hover:bg-red-50">Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pendingOrders.length === 0 && <div className="text-center py-12"><HiCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">All caught up!</h3><p className="text-gray-500">No pending orders right now</p></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
