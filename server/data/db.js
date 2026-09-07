const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {
      categories: [],
      products: [],
      coupons: [],
      orders: [],
      impactStats: {
        totalOrders: 0,
        totalTreesPlanted: 0,
        totalCarbonSavedKg: 0,
        totalPlasticAvoided: 0,
        activeMsmeArtisans: 0
      }
    };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

module.exports = {
  readDb,
  writeDb
};
