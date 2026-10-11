const express = require('express');
const router = express.Router();
const { isConnected } = require('../config/db');
const Product = require('../models/Product');
const { readDb, writeDb } = require('../data/db');

// GET all products with filtering, search, and sorting
router.get('/', async (req, res) => {
  const { category, search, ecoScore, msmeType, minPrice, maxPrice, sort } = req.query;

  try {
    if (isConnected()) {
      let query = {};
      if (category && category !== 'all') query.category = new RegExp(`^${category}$`, 'i');
      if (ecoScore && ecoScore !== 'all') query.ecoScore = ecoScore;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }
      if (search) {
        const q = new RegExp(search.trim(), 'i');
        query.$or = [{ name: q }, { description: q }, { 'artisan.name': q }, { 'artisan.location': q }];
      }

      let sortOption = {};
      if (sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price-desc') sortOption = { price: -1 };
      else if (sort === 'eco') sortOption = { carbonSavedKg: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };

      const mongoProducts = await Product.find(query).sort(sortOption);
      if (mongoProducts && mongoProducts.length > 0) {
        return res.json({ success: true, count: mongoProducts.length, products: mongoProducts });
      }
    }
  } catch (err) {
    console.warn('MongoDB query products failed, using JSON db:', err.message);
  }

  // Fallback to JSON db
  const db = readDb();
  let results = [...(db.products || [])];

  if (category && category !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.artisan && p.artisan.name.toLowerCase().includes(q)) ||
      (p.artisan && p.artisan.location.toLowerCase().includes(q)) ||
      (p.materials && p.materials.some(m => m.toLowerCase().includes(q)))
    );
  }

  if (ecoScore && ecoScore !== 'all') {
    results = results.filter(p => p.ecoScore === ecoScore);
  }

  if (msmeType && msmeType !== 'all') {
    results = results.filter(p =>
      p.artisan && p.artisan.msmeType.toLowerCase().includes(msmeType.toLowerCase())
    );
  }

  if (minPrice) {
    results = results.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    results = results.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'eco') {
    results.sort((a, b) => (b.carbonSavedKg || 0) - (a.carbonSavedKg || 0));
  } else if (sort === 'rating') {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  res.json({
    success: true,
    count: results.length,
    products: results
  });
});

// GET single product by id
router.get('/:id', async (req, res) => {
  try {
    if (isConnected()) {
      const p = await Product.findOne({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
      if (p) return res.json({ success: true, product: p });
    }
  } catch (err) {}

  const db = readDb();
  const product = (db.products || []).find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, product });
});

// POST new product (MSME Seller)
router.post('/', async (req, res) => {
  const db = readDb();
  const {
    name,
    category,
    price,
    originalPrice,
    stock,
    ecoScore,
    carbonSavedKg,
    plasticAvoided,
    badge,
    images,
    materials,
    description,
    artisan,
    certifications
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
  }

  const newProduct = {
    id: 'prod-' + Date.now(),
    name,
    category,
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : Math.round(parseFloat(price) * 1.3),
    rating: 5.0,
    reviewsCount: 1,
    stock: stock !== undefined ? parseInt(stock, 10) : 25,
    ecoScore: ecoScore || 'A+',
    carbonSavedKg: carbonSavedKg ? parseFloat(carbonSavedKg) : 2.5,
    plasticAvoided: plasticAvoided ? parseInt(plasticAvoided, 10) : 5,
    badge: badge || 'New Eco Release',
    images: Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    materials: Array.isArray(materials) ? materials : (materials ? materials.split(',').map(s => s.trim()) : ['Natural Organic Materials']),
    description: description || 'Artisanal eco-friendly product crafted with care by local MSME makers.',
    artisan: {
      id: artisan?.id || 'art-' + Date.now(),
      name: artisan?.name || 'Local Artisan Workshop',
      founder: artisan?.founder || 'Artisan Maker',
      location: artisan?.location || 'India',
      msmeType: artisan?.msmeType || 'Handmade Micro Enterprise',
      msmeRegNo: artisan?.msmeRegNo || 'UDYAM-IN-' + Math.floor(100000 + Math.random() * 900000),
      verifiedMsme: true,
      story: artisan?.story || 'Empowering indigenous craft traditions and sustainable livelihoods.'
    },
    certifications: Array.isArray(certifications) ? certifications : ['Zero Waste', 'Fair Trade Certified']
  };

  try {
    if (isConnected()) {
      await Product.create(newProduct);
    }
  } catch (err) {
    console.warn('MongoDB product create failed, fallback to JSON:', err.message);
  }

  if (!db.products) db.products = [];
  db.products.unshift(newProduct);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: newProduct
  });
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    if (isConnected()) {
      await Product.findOneAndUpdate(
        { $or: [{ id: req.params.id }, { _id: req.params.id }] },
        req.body,
        { new: true }
      );
    }
  } catch (err) {}

  const db = readDb();
  const index = (db.products || []).findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : existing.price,
    stock: req.body.stock !== undefined ? parseInt(req.body.stock, 10) : existing.stock
  };

  db.products[index] = updated;
  writeDb(db);

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updated
  });
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    if (isConnected()) {
      await Product.findOneAndDelete({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
    }
  } catch (err) {}

  const db = readDb();
  const index = (db.products || []).findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const removed = db.products.splice(index, 1);
  writeDb(db);

  res.json({
    success: true,
    message: 'Product deleted successfully',
    product: removed[0]
  });
});

module.exports = router;
