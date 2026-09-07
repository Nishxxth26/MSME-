const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../data/db');

// GET all orders
router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    orders: db.orders || []
  });
});

// GET order by ID
router.get('/:id', (req, res) => {
  const db = readDb();
  const order = db.orders.find(o => o.id === req.params.id);

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
      message: `Minimum order of $${coupon.minAmount.toFixed(2)} required for code ${coupon.code}`
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
router.post('/', (req, res) => {
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

  // Calculate pricing & eco metrics
  let subtotal = 0;
  let totalCarbonSavedKg = 0;
  let plasticAvoidedCount = 0;

  const processedItems = items.map(item => {
    const matchedProduct = db.products.find(p => p.id === item.productId || p.id === item.id);
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

  // Calculate coupon discount
  let discount = 0;
  if (couponCode) {
    const coupon = (db.coupons || []).find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon && subtotal >= coupon.minAmount) {
      discount += (subtotal * (coupon.discountPercent / 100));
    }
  }

  // EcoPoints discount ($1 off for every 20 EcoPoints)
  let pointsDiscount = 0;
  if (ecoPointsUsed && Number(ecoPointsUsed) > 0) {
    pointsDiscount = Math.min(Number(ecoPointsUsed) * 0.05, subtotal - discount);
    discount += pointsDiscount;
  }

  const packagingFee = packaging?.includes('Zero-Waste') ? 0.00 : 1.50;
  const shippingFee = subtotal >= 40 ? 0.00 : 4.99;
  const grandTotal = Math.max(0, subtotal - discount + packagingFee + shippingFee);

  // Trees funded: 1 tree for every $35 spent
  const treesFunded = Math.max(1, Math.floor(grandTotal / 35));

  // Generate unique Order ID
  const orderId = 'ECO-' + Math.floor(10000 + Math.random() * 90000);
  const now = new Date().toISOString();

  const newOrder = {
    id: orderId,
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
    ecoPointsEarned: Math.round(grandTotal)
  };

  db.orders.unshift(newOrder);

  // Update platform-wide impact statistics
  if (!db.impactStats) {
    db.impactStats = {
      totalOrders: 0,
      totalTreesPlanted: 0,
      totalCarbonSavedKg: 0,
      totalPlasticAvoided: 0,
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
    message: 'Order placed successfully!',
    order: newOrder
  });
});

// PATCH order status (for MSME Seller management)
router.patch('/:id/status', (req, res) => {
  const db = readDb();
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const order = db.orders.find(o => o.id === req.params.id);
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
