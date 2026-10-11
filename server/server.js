const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const impactRouter = require('./routes/impact');
const pickupsRouter = require('./routes/pickups');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with auto-failover
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/impact', impactRouter);
app.use('/api/pickups', pickupsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { isConnected } = require('./config/db');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EcoCart MSME API',
    database: isConnected() ? 'MongoDB Connected' : 'Resilient JSON Store Active'
  });
});

// Serve frontend static build in production (e.g. on Render)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA catch-all route (serves index.html for non-API client routes)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`EcoCart MSME Server running on port ${PORT}`);
});
