import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiLocationMarker, HiClock, HiCurrencyRupee, HiTruck, HiMap, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Logistics = () => {
  const { API } = useAuth();
  const [origin, setOrigin] = useState({ lat: 28.6139, lng: 77.2090, address: 'New Delhi' });
  const [destinations, setDestinations] = useState([
    { lat: 28.7041, lng: 77.1025, address: 'Rohini, Delhi' },
    { lat: 28.5450, lng: 77.2600, address: 'Noida, UP' }
  ]);
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('optimize');

  const optimizeRoute = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/logistics/optimize-route', { origin, destinations });
      setRouteResult(data);
      toast.success('Route optimized!');
    } catch (error) { toast.error('Failed to optimize route'); }
    setLoading(false);
  };

  const addDestination = () => {
    setDestinations([...destinations, { lat: 28.6 + Math.random() * 0.2, lng: 77.2 + Math.random() * 0.2, address: `Stop ${destinations.length + 1}` }]);
  };

  const savingsData = [
    { label: 'Distance Saved', value: `${routeResult?.savings?.distance || 0}%`, icon: HiMap, color: 'text-blue-600' },
    { label: 'Time Saved', value: `${routeResult?.savings?.time || 0}%`, icon: HiClock, color: 'text-green-600' },
    { label: 'Cost per Delivery', value: `₹${Math.round((routeResult?.estimatedCost || 0) / Math.max(destinations.length, 1))}`, icon: HiCurrencyRupee, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading">Smart Logistics</h1>
          <p className="text-gray-600 mt-1">AI-powered route optimization for fastest deliveries</p>
        </div>

        <div className="flex gap-2 mb-6">
          {[{ id: 'optimize', label: 'Route Optimizer' }, { id: 'track', label: 'Track Delivery' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'optimize' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <HiLocationMarker className="w-5 h-5 text-primary-500" />
                  <span>Origin</span>
                </h3>
                <div className="space-y-3">
                  <input type="text" value={origin.address} onChange={(e) => setOrigin({...origin, address: e.target.value})} className="input-field text-sm" placeholder="Pickup location" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={origin.lat} onChange={(e) => setOrigin({...origin, lat: parseFloat(e.target.value)})} className="input-field text-sm" placeholder="Latitude" step="0.0001" />
                    <input type="number" value={origin.lng} onChange={(e) => setOrigin({...origin, lng: parseFloat(e.target.value)})} className="input-field text-sm" placeholder="Longitude" step="0.0001" />
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <HiTruck className="w-5 h-5 text-saffron-500" />
                    <span>Destinations ({destinations.length})</span>
                  </h3>
                  <button onClick={addDestination} className="text-sm text-primary-600 font-medium hover:text-primary-700">+ Add</button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {destinations.map((dest, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <input type="text" value={dest.address} onChange={(e) => { const newDest = [...destinations]; newDest[i].address = e.target.value; setDestinations(newDest); }} className="flex-1 text-sm border-0 bg-transparent focus:ring-0" />
                    </div>
                  ))}
                </div>
                <button onClick={optimizeRoute} disabled={loading} className="w-full btn-primary mt-4">
                  {loading ? 'Optimizing...' : 'Optimize Route'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              {routeResult ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {savingsData.map((item, i) => (
                      <div key={i} className="card-premium p-4 text-center">
                        <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                        <div className="text-2xl font-bold">{item.value}</div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Optimized Route</h3>
                      <div className="text-sm text-gray-500">
                        Total: {routeResult.totalDistance} km • {routeResult.estimatedTime} min
                      </div>
                    </div>
                    <div className="space-y-3">
                      {routeResult.route.map((point, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? 'bg-green-500' : i === routeResult.route.length - 1 ? 'bg-red-500' : 'bg-primary-500'}`}>
                            {i === 0 ? 'A' : i === routeResult.route.length - 1 ? 'B' : i}
                          </div>
                          <div className="flex-1 p-3 bg-gray-50 rounded-xl">
                            <div className="font-medium">{point.address || `Point ${i}`}</div>
                            <div className="text-xs text-gray-500">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</div>
                          </div>
                          {i < routeResult.route.length - 1 && (
                            <div className="text-sm text-gray-400">
                              {Math.round(getDistance(routeResult.route[i], routeResult.route[i + 1]) * 10) / 10} km
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium p-6 bg-gradient-to-r from-primary-50 to-saffron-50">
                    <h3 className="font-semibold mb-3">Delivery Summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-600">{routeResult.estimatedCost}</div>
                        <div className="text-sm text-gray-600">Est. Cost (₹)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-saffron-600">{routeResult.estimatedTime}</div>
                        <div className="text-sm text-gray-600">Est. Time (min)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{routeResult.totalDistance}</div>
                        <div className="text-sm text-gray-600">Total Distance (km)</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-premium p-12 text-center">
                  <HiMap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Route Optimization</h3>
                  <p className="text-gray-500 mb-6">Add destinations and click optimize to find the best route</p>
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                    <div className="text-center">
                      <HiClock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                      <div className="text-sm font-medium">Save Time</div>
                    </div>
                    <div className="text-center">
                      <HiCurrencyRupee className="w-8 h-8 text-saffron-500 mx-auto mb-2" />
                      <div className="text-sm font-medium">Cut Costs</div>
                    </div>
                    <div className="text-center">
                      <HiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-sm font-medium">Fast Delivery</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="card-premium p-8 text-center">
            <HiTruck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Your Delivery</h3>
            <p className="text-gray-500 mb-6">Enter your order ID to track delivery status</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="text" className="input-field flex-1" placeholder="Enter Order ID" />
              <button className="btn-primary">Track</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getDistance(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export default Logistics;
