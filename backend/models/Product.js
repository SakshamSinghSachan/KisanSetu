const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  price: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  organic: { type: Boolean, default: false },
  harvestDate: Date,
  expiryDate: Date,
  certifications: [String],
  ratings: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [String],
  minOrderQuantity: { type: Number, default: 1 },
  bulkDiscount: {
    enabled: { type: Boolean, default: false },
    minQuantity: Number,
    discountPercent: Number
  }
}, { timestamps: true });

productSchema.index({ 'location': '2dsphere' });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
