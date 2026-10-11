const express = require('express');
const router = express.Router();
const { isConnected } = require('../config/db');
const WastePickup = require('../models/WastePickup');
const { readDb, writeDb } = require('../data/db');

// GET all waste pickups
router.get('/', async (req, res) => {
  try {
    if (isConnected()) {
      const pickups = await WastePickup.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: pickups.length, pickups });
    }
  } catch (err) {
    console.warn('MongoDB query failed, falling back to JSON db:', err.message);
  }

  // Fallback to JSON db
  const db = readDb();
  res.json({
    success: true,
    count: (db.pickups || []).length,
    pickups: db.pickups || []
  });
});

// POST schedule a new waste pickup
router.post('/', async (req, res) => {
  const {
    citizen,
    wasteCategory,
    estimatedWeightKg,
    pickupDate,
    timeSlot,
    notes
  } = req.body;

  if (!citizen || !wasteCategory || !estimatedWeightKg || !pickupDate || !timeSlot) {
    return res.status(400).json({
      success: false,
      message: 'Citizen details, waste category, weight, date, and time slot are required.'
    });
  }

  const weight = parseFloat(estimatedWeightKg);
  // Award 10 EcoPoints per 1 kg surrendered
  const ecoPointsAwarded = Math.max(20, Math.round(weight * 10));
  const pickupId = 'ECO-WASTE-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();

  const pickupData = {
    pickupId,
    citizen: {
      name: citizen.name || 'Eco Citizen',
      email: citizen.email || 'citizen@ecocart.org',
      phone: citizen.phone || '+91 98765 00000',
      address: citizen.address || '',
      city: citizen.city || 'Bengaluru',
      state: citizen.state || 'Karnataka',
      pincode: citizen.pincode || '',
      societyName: citizen.societyName || 'Green Valley Society'
    },
    wasteCategory,
    estimatedWeightKg: weight,
    pickupDate,
    timeSlot,
    notes: notes || 'Segregated and bagged at source.',
    qrCodeData: `ECOCART-BATCH-${pickupId}-${wasteCategory.replace(/\s+/g, '_')}-${weight}KG`,
    assignedCart: {
      cartId: 'CART-0' + Math.floor(1 + Math.random() * 6) + ' (GPS Enabled)',
      operatorName: 'Suresh Kumar',
      operatorPhone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000)
    },
    status: 'Scheduled',
    statusHistory: [
      { status: 'Scheduled', time: now }
    ],
    ecoPointsAwarded
  };

  try {
    if (isConnected()) {
      const created = await WastePickup.create(pickupData);
      return res.status(201).json({
        success: true,
        message: 'Pickup scheduled successfully! Raw batch registered for MSME upcycling.',
        pickup: created
      });
    }
  } catch (err) {
    console.warn('MongoDB create failed, falling back to JSON db:', err.message);
  }

  // Fallback to JSON db
  const db = readDb();
  if (!db.pickups) db.pickups = [];
  db.pickups.unshift(pickupData);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Pickup scheduled successfully! Raw batch registered for MSME upcycling.',
    pickup: pickupData
  });
});

// PATCH update pickup status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  try {
    if (isConnected()) {
      const pickup = await WastePickup.findOneAndUpdate(
        { $or: [{ pickupId: req.params.id }, { _id: req.params.id }] },
        { 
          $set: { status },
          $push: { statusHistory: { status, time: new Date() } }
        },
        { new: true }
      );
      if (pickup) {
        return res.json({ success: true, message: 'Status updated', pickup });
      }
    }
  } catch (err) {
    console.warn('MongoDB update status failed, fallback to JSON:', err.message);
  }

  // Fallback to JSON db
  const db = readDb();
  if (!db.pickups) db.pickups = [];
  const p = db.pickups.find(x => x.pickupId === req.params.id || x.id === req.params.id);
  if (!p) {
    return res.status(404).json({ success: false, message: 'Pickup not found' });
  }

  p.status = status;
  if (!p.statusHistory) p.statusHistory = [];
  p.statusHistory.push({ status, time: new Date().toISOString() });
  writeDb(db);

  res.json({ success: true, message: 'Status updated', pickup: p });
});

module.exports = router;
