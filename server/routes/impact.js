const express = require('express');
const router = express.Router();
const { readDb } = require('../data/db');

router.get('/stats', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    stats: db.impactStats || {
      totalOrders: 1284,
      totalTreesPlanted: 1542,
      totalCarbonSavedKg: 5890.4,
      totalPlasticAvoided: 28400,
      activeMsmeArtisans: 48
    }
  });
});

module.exports = router;
