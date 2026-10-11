const express = require('express');
const router = express.Router();
const { isConnected } = require('../config/db');
const Order = require('../models/Order');
const { readDb, writeDb } = require('../data/db');

// GET all orders
router.get('/', async (req, res) => {
  try {
    if (isConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (err) {
    console.warn('MongoDB query failed, falling back to JSON db:', err.message);
  }

  const db = readDb();
  res.json({
    success: true,
    orders: db.orders || []
  });
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    if (isConnected()) {
      const order = await Order.findOne({ $or: [{ orderId: req.params.id }, { id: req.params.id }] });
      if (order) return res.json({ success: true, order });
    }
  } catch (err) {}

  const db = readDb();
  const order = (db.orders || []).find(o => o.id === req.params.id || o.orderId === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, order });
});

// POST verify coupon
router.post('/verify-coupon', (req, res) => {
  const db = readDb();
  const { code, subtotal } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }

  const coupon = (db.coupons || []).find(c => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid promo code' });
  }

  const currentSubtotal = parseFloat(subtotal) || 0;
  if (currentSubtotal < coupon.minAmount) {
    return res.status(400).json({
      success: false,
      message: `Minimum order of ₹${coupon.minAmount} required for code ${coupon.code}`
    });
  }

  const discountAmount = (currentSubtotal * (coupon.discountPercent / 100));

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      description: coupon.description
    }
  });
});

// POST create new order
router.post('/', async (req, res) => {
  const db = readDb();
  const {
    customer,
    items,
    packaging,
    shippingMethod,
    paymentMethod,
    couponCode,
    ecoPointsUsed
  } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Customer details and cart items are required' });
  }

  // Calculate pricing & eco metrics in INR
  let subtotal = 0;
  let totalCarbonSavedKg = 0;
  let plasticAvoidedCount = 0;

  const processedItems = items.map(item => {
    const matchedProduct = (db.products || []).find(p => p.id === item.productId || p.id === item.id);
    const price = matchedProduct ? matchedProduct.price : (item.price || 0);
    const quantity = parseInt(item.quantity, 10) || 1;
    const itemSubtotal = price * quantity;
    subtotal += itemSubtotal;

    const carbonSaved = (matchedProduct ? matchedProduct.carbonSavedKg : (item.carbonSavedKg || 1)) * quantity;
    const plastic = (matchedProduct ? matchedProduct.plasticAvoided : (item.plasticAvoided || 2)) * quantity;
    totalCarbonSavedKg += carbonSaved;
    plasticAvoidedCount += plastic;

    // Decrement stock if matched
    if (matchedProduct && matchedProduct.stock >= quantity) {
      matchedProduct.stock -= quantity;
    }

    return {
      productId: matchedProduct ? matchedProduct.id : item.id,
      name: matchedProduct ? matchedProduct.name : item.name,
      price: price,
      quantity: quantity,
      image: matchedProduct ? matchedProduct.images[0] : item.image,
      carbonSavedKg: parseFloat(carbonSaved.toFixed(2)),
      plasticAvoided: plastic,
      artisan: matchedProduct && matchedProduct.artisan ? matchedProduct.artisan.name : 'MSME Artisan'
    };
  });

  // Calculate coupon discount in INR
  let discount = 0;
  if (couponCode) {
    const coupon = (db.coupons || []).find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon && subtotal >= coupon.minAmount) {
      discount += (subtotal * (coupon.discountPercent / 100));
    }
  }

  // EcoPoints discount in INR: ₹0.50 per 1 EcoPoint (100 points = ₹50)
  let pointsDiscount = 0;
  if (ecoPointsUsed && Number(ecoPointsUsed) > 0) {
    pointsDiscount = Math.min(Number(ecoPointsUsed) * 0.50, subtotal - discount);
    discount += pointsDiscount;
  }

  // INR Packaging: ₹49 for Biodegradable Box, ₹0 for Minimal Zero-Waste
  const packagingFee = packaging?.includes('Zero-Waste') ? 0 : 49;
  
  // INR Shipping: Free above ₹999, otherwise ₹60
  const shippingFee = subtotal >= 999 ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discount + packagingFee + shippingFee);

  // Trees funded: 1 tree per ₹800 spent
  const treesFunded = Math.max(1, Math.floor(grandTotal / 800));

  // Generate unique Indian Order ID
  const orderId = 'ECO-IN-' + Math.floor(10000 + Math.random() * 90000);
  const now = new Date().toISOString();

  const orderData = {
    id: orderId,
    orderId: orderId,
    date: now,
    customer: {
      name: customer.name || 'Eco Supporter',
      email: customer.email || 'customer@ecocart.org',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || ''
    },
    items: processedItems,
    pricing: {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      ecoPackagingFee: parseFloat(packagingFee.toFixed(2)),
      shipping: parseFloat(shippingFee.toFixed(2)),
      total: parseFloat(grandTotal.toFixed(2))
    },
    packaging: packaging || '100% Biodegradable Plant-Starch Box & Jute Twine',
    shippingMethod: shippingMethod || 'Electric Vehicle Carbon-Neutral Delivery',
    paymentMethod: paymentMethod || 'UPI Simulation',
    status: 'Order Placed',
    statusHistory: [
      { status: 'Order Placed', time: now }
    ],
    ecoImpact: {
      totalCarbonSavedKg: parseFloat(totalCarbonSavedKg.toFixed(2)),
      plasticAvoidedCount: plasticAvoidedCount,
      treesFunded: treesFunded
    },
    ecoPointsEarned: Math.round(grandTotal * 0.1) // 10% points reward
  };

  try {
    if (isConnected()) {
      await Order.create(orderData);
    }
  } catch (err) {
    console.warn('MongoDB order insert failed, fallback to JSON:', err.message);
  }

  // Fallback to JSON db
  if (!db.orders) db.orders = [];
  db.orders.unshift(orderData);

  // Update platform-wide impact statistics
  if (!db.impactStats) {
    db.impactStats = {
      totalOrders: 1420,
      totalTreesPlanted: 1680,
      totalCarbonSavedKg: 6420.5,
      totalPlasticAvoided: 31200,
      activeMsmeArtisans: 48
    };
  }
  db.impactStats.totalOrders += 1;
  db.impactStats.totalTreesPlanted += treesFunded;
  db.impactStats.totalCarbonSavedKg = parseFloat((db.impactStats.totalCarbonSavedKg + totalCarbonSavedKg).toFixed(1));
  db.impactStats.totalPlasticAvoided += plasticAvoidedCount;

  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully! Tree planting and carbon offset initiated.',
    order: orderData
  });
});

// PATCH order status (for MSME Seller management)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  try {
    if (isConnected()) {
      await Order.findOneAndUpdate(
        { $or: [{ orderId: req.params.id }, { id: req.params.id }] },
        { 
          $set: { status },
          $push: { statusHistory: { status, time: new Date() } }
        }
      );
    }
  } catch (err) {}

  const db = readDb();
  const order = (db.orders || []).find(o => o.id === req.params.id || o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status: status,
    time: new Date().toISOString()
  });

  writeDb(db);

  res.json({
    success: true,
    message: 'Order status updated successfully',
    order
  });
});

module.exports = router;
