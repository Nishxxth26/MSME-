const express = require('express');
const router = express.Router();
const { readDb } = require('../data/db');

router.get('/', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    categories: db.categories || []
  });
});

module.exports = router;
