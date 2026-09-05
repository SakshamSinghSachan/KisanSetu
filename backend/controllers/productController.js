const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id,
      location: req.body.location || {
        type: 'Point',
        coordinates: [77.2090, 28.6139],
        address: 'India'
      }
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, organic, location, sort, page = 1, limit = 12 } = req.query;
    let query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (organic === 'true') query.organic = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (location) {
      const [lat, lng, radius] = location.split(',').map(Number);
      query.location = { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: (radius || 50) * 1000 } };
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'price_low') sortOption = { price: 1 };
    else if (sort === 'price_high') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };
    else if (sort === 'popular') sortOption = { soldCount: -1 };
    const products = await Product.find(query).populate('seller', 'name avatar rating address').sort(sortOption).skip((page - 1) * limit).limit(Number(limit));
    const total = await Product.countDocuments(query);
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name avatar rating phone address');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, seller: req.user._id }, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
