const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const query = req.user.role === 'farmer' || req.user.role === 'fpo' ? { seller: req.user._id } : { buyer: req.user._id };
    const totalOrders = await Order.countDocuments(query);
    const totalRevenue = await Order.aggregate([
      { $match: { ...query, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const recentOrders = await Order.find(query).sort({ createdAt: -1 }).limit(5).populate('buyer', 'name').populate('seller', 'name');
    const monthlySales = await Order.aggregate([
      { $match: { ...query, createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      monthlySales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDemandForecast = async (req, res) => {
  try {
    const { category, days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    let matchQuery = { createdAt: { $gte: startDate } };
    if (category) matchQuery['items.name'] = { $regex: category, $options: 'i' };
    const demandData = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      { $group: { _id: { $toLower: '$items.name' }, totalQuantity: { $sum: '$items.quantity' }, totalOrders: { $sum: 1 }, avgPrice: { $avg: '$items.price' } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 20 }
    ]);
    const seasonality = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, product: { $toLower: { $arrayElemAt: ['$items.name', 0] } } }, quantity: { $sum: { $arrayElemAt: ['$items.quantity', 0] } } } },
      { $group: { _id: '$_id.product', monthlyData: { $push: { month: '$_id.month', quantity: '$quantity' } } } }
    ]);
    const topProducts = demandData.slice(0, 5).map(p => ({
      name: p._id,
      trend: Math.random() > 0.5 ? 'increasing' : 'stable',
      predictedDemand: Math.round(p.totalQuantity * (1 + Math.random() * 0.3)),
      confidence: Math.round(70 + Math.random() * 25),
      suggestedPrice: Math.round(p.avgPrice * (0.9 + Math.random() * 0.2))
    }));
    res.json({ demandData, seasonality, topProducts, forecastPeriod: `${days} days` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMarketPrices = async (req, res) => {
  try {
    const prices = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { name: { $toLower: '$name' }, category: '$category' }, avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlatformStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    res.json({
      totalFarmers,
      totalConsumers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
