import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiTrendingUp, HiTrendingDown, HiChartBar, HiLightBulb } from 'react-icons/hi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { API } = useAuth();
  const [forecast, setForecast] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => { fetchData(); }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [forecastRes, pricesRes] = await Promise.all([
        API.get(`/analytics/demand-forecast?days=${timeRange}`),
        API.get('/analytics/market-prices')
      ]);
      setForecast(forecastRes.data);
      setMarketPrices(pricesRes.data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const demandChartData = forecast ? {
    labels: forecast.demandData.slice(0, 10).map(d => d._id),
    datasets: [{
      label: 'Demand (Qty)',
      data: forecast.demandData.slice(0, 10).map(d => d.totalQuantity),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderRadius: 8
    }]
  } : null;

  const priceTrendData = forecast ? {
    labels: forecast.demandData.slice(0, 8).map(d => d._id),
    datasets: [{
      label: 'Avg Price (₹)',
      data: forecast.demandData.slice(0, 8).map(d => Math.round(d.avgPrice)),
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      fill: true,
      tension: 0.4
    }]
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">AI Analytics</h1>
            <p className="text-gray-600 mt-1">Demand forecasting & market insights powered by AI</p>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setTimeRange(d)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${timeRange === d ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'}`}>
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Demand Forecast</h3>
              <HiChartBar className="w-5 h-5 text-primary-500" />
            </div>
            {demandChartData && <Bar data={demandChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Price Trends</h3>
              <HiTrendingUp className="w-5 h-5 text-saffron-500" />
            </div>
            {priceTrendData && <Line data={priceTrendData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
          </div>
        </div>

        <div className="card-premium p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <HiLightBulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(forecast?.topProducts || []).map((product, i) => (
              <div key={i} className="bg-gradient-to-br from-primary-50 to-saffron-50 rounded-xl p-5 border border-primary-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold capitalize">{product.name}</h4>
                  <span className={`badge ${product.trend === 'increasing' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {product.trend === 'increasing' ? <HiTrendingUp className="w-3 h-3 mr-1" /> : <HiTrendingDown className="w-3 h-3 mr-1" />}
                    {product.trend}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted Demand:</span>
                    <span className="font-medium">{product.predictedDemand} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium">{product.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suggested Price:</span>
                    <span className="font-semibold text-primary-600">₹{product.suggestedPrice}/kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold mb-4">Market Prices</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Avg Price</th>
                  <th className="pb-3 font-medium">Min</th>
                  <th className="pb-3 font-medium">Max</th>
                  <th className="pb-3 font-medium">Listings</th>
                </tr>
              </thead>
              <tbody>
                {marketPrices.slice(0, 15).map((item, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium capitalize">{item._id.name}</td>
                    <td className="py-3 text-gray-500">{item._id.category}</td>
                    <td className="py-3 font-semibold text-primary-600">₹{Math.round(item.avgPrice)}</td>
                    <td className="py-3 text-green-600">₹{Math.round(item.minPrice)}</td>
                    <td className="py-3 text-red-600">₹{Math.round(item.maxPrice)}</td>
                    <td className="py-3">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
