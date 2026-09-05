import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiTrendingUp, HiShoppingCart, HiCurrencyRupee, HiCube, HiPlus, HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { user, API } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/analytics/dashboard');
        setStats(data);
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
      fill: true,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }]
  };

  const doughnutData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Others'],
    datasets: [{ data: [35, 25, 20, 15, 5], backgroundColor: ['#22c55e', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899'], borderWidth: 0 }]
  };

  const statCards = [
    { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: HiCurrencyRupee, change: '+12.5%', up: true, color: 'from-green-500 to-emerald-600' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: HiShoppingCart, change: '+8.2%', up: true, color: 'from-blue-500 to-indigo-600' },
    { title: 'Active Products', value: '24', icon: HiCube, change: '+5', up: true, color: 'from-purple-500 to-pink-600' },
    { title: 'Growth Rate', value: '18%', icon: HiTrendingUp, change: '+3.2%', up: true, color: 'from-orange-500 to-amber-600' }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your {user?.role === 'farmer' ? 'farm' : 'orders'}</p>
          </div>
          {user?.role === 'farmer' && (
            <Link to="/add-product" className="btn-primary flex items-center space-x-2">
              <HiPlus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="card-premium p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${card.up ? 'text-green-600' : 'text-red-600'}`}>
                  {card.up ? <HiArrowUp className="w-4 h-4" /> : <HiArrowDown className="w-4 h-4" />}
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold">{card.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card-premium p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Link to="/orders" className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentOrders || []).map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-primary-600">{order.orderNumber}</td>
                    <td className="py-3">{order.buyer?.name || 'Customer'}</td>
                    <td className="py-3 font-semibold">₹{order.total}</td>
                    <td className="py-3">
                      <span className={`badge ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-500">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
