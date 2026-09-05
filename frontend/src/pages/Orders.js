import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiSearch, HiEye, HiTruck } from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  outForDelivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const Orders = () => {
  const { API } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await API.get(`/orders${params}`);
      setOrders(data.orders || []);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status, note: `Status updated to ${status}` });
      fetchOrders();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Orders</h1>
        <p className="text-gray-600 mb-8">Track and manage your orders</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="card-premium p-6 animate-pulse"><div className="h-20 bg-gray-200 rounded"></div></div>)}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card-premium p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-primary-600">#{order.orderNumber}</span>
                      <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span>{order.items?.length} items</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold">₹{order.total}</div>
                      <div className={`text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <HiEye className="w-5 h-5 text-gray-600" />
                      </button>
                      {(order.status === 'confirmed' || order.status === 'processing') && (
                        <button onClick={() => updateStatus(order._id, 'shipped')} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                          <HiTruck className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {selectedOrder?._id === order._id && (
                  <div className="mt-4 pt-4 border-t animate-in">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Items</h4>
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm py-1">
                            <span>{item.name} x {item.quantity} {item.unit}</span>
                            <span className="font-medium">₹{item.total}</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Tracking</h4>
                        <div className="space-y-2">
                          {order.tracking?.map((t, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div>
                              <div>
                                <div className="font-medium">{t.status}</div>
                                <div className="text-gray-500 text-xs">{new Date(t.timestamp).toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-gray-500">Orders will appear here once placed</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
