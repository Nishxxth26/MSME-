const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 1
  },
  stock: {
    type: Number,
    default: 25,
    min: 0
  },
  ecoScore: {
    type: String,
    enum: ['A+', 'A', 'B'],
    default: 'A+'
  },
  carbonSavedKg: {
    type: Number,
    default: 2.5
  },
  plasticAvoided: {
    type: Number,
    default: 5
  },
  badge: {
    type: String,
    default: 'Artisan Handcrafted'
  },
  images: [{
    type: String
  }],
  materials: [{
    type: String
  }],
  description: {
    type: String,
    trim: true
  },
  artisan: {
    id: String,
    name: { type: String, required: true },
    founder: String,
    location: String,
    msmeType: String,
    msmeRegNo: String,
    verifiedMsme: { type: Boolean, default: true },
    story: String
  },
  certifications: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
