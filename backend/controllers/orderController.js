const Order = require('../models/Order');
const Product = require('../models/Product');

const generateOrderNumber = () => {
  return 'KS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Product not found: ${item.productId}` });
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({ product: product._id, name: product.name, quantity: item.quantity, unit: product.unit, price: product.price, total: itemTotal });
      product.quantity -= item.quantity;
      product.soldCount += item.quantity;
      await product.save();
    }
    const deliveryFee = subtotal > 500 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;
    const order = new Order({
      orderNumber: generateOrderNumber(),
      buyer: req.user._id,
      seller: items[0].sellerId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod,
      shippingAddress,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tracking: [{ status: 'Order placed', location: 'System', note: 'Order confirmed' }]
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (req.user.role === 'farmer' || req.user.role === 'fpo') {
      query.seller = req.user._id;
    } else {
      query.buyer = req.user._id;
    }
    if (status) query.status = status;
    const orders = await Order.find(query).populate('buyer', 'name phone').populate('seller', 'name phone').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyer', 'name phone email address').populate('seller', 'name phone email address');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, location, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    order.tracking.push({ status, location: location || 'System', note });
    if (status === 'delivered') order.deliveryDate = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
