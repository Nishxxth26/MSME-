const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    carbonSavedKg: Number,
    plasticAvoided: Number,
    artisan: String
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    ecoPackagingFee: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  packaging: {
    type: String,
    default: 'Biodegradable Plant-Starch Box & Jute Twine'
  },
  shippingMethod: {
    type: String,
    default: 'Electric Vehicle Carbon-Neutral Cargo'
  },
  paymentMethod: {
    type: String,
    default: 'UPI'
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Artisan Confirmed', 'Eco-Packed & Dispatched', 'In Carbon-Neutral Transit', 'Delivered'],
    default: 'Order Placed'
  },
  statusHistory: [{
    status: String,
    time: { type: Date, default: Date.now }
  }],
  ecoImpact: {
    totalCarbonSavedKg: Number,
    plasticAvoidedCount: Number,
    treesFunded: Number
  },
  ecoPointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
