const mongoose = require('mongoose');

const wastePickupSchema = new mongoose.Schema({
  pickupId: {
    type: String,
    required: true,
    unique: true
  },
  citizen: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    societyName: String
  },
  wasteCategory: {
    type: String,
    required: true,
    enum: [
      'Agricultural & Coconut Shells',
      'Industrial Denim & Textiles',
      'Clean Paper & Cardboard Scrap',
      'Dry Recyclable Hard Plastics'
    ]
  },
  estimatedWeightKg: {
    type: Number,
    required: true,
    min: 1
  },
  pickupDate: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      'Morning (9 AM - 12 PM)',
      'Afternoon (1 PM - 4 PM)',
      'Evening (5 PM - 7 PM)'
    ]
  },
  notes: String,
  qrCodeData: String,
  assignedCart: {
    cartId: { type: String, default: 'CART-04 (GPS Enabled)' },
    operatorName: { type: String, default: 'Raju Kumar' },
    operatorPhone: { type: String, default: '+91 98765 11223' }
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Cart Dispatched', 'Collected & QR Tagged', 'Received at Facility', 'Sent for Upcycling'],
    default: 'Scheduled'
  },
  statusHistory: [{
    status: String,
    time: { type: Date, default: Date.now }
  }],
  ecoPointsAwarded: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WastePickup', wastePickupSchema);
