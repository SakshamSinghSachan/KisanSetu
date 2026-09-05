const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { Chat, Message } = require('../models/Chat');
const { auth, authorize } = require('../middleware/auth');

router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products', auth, authorize('admin'), async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email phone').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', auth, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer', 'name email phone').populate('seller', 'name email phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const totalFPO = await User.countDocuments({ role: 'fpo' });
    const totalBulkBuyers = await User.countDocuments({ role: 'bulkBuyer' });
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    const recentOrders = await Order.find().populate('buyer', 'name').populate('seller', 'name').sort({ createdAt: -1 }).limit(10);
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(10);

    res.json({
      totalUsers,
      totalFarmers,
      totalConsumers,
      totalFPO,
      totalBulkBuyers,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/user/:id/role', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/user/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/product/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
