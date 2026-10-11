const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecocart_msme';

  try {
    console.log(`Connecting to MongoDB at ${uri.replace(/\/\/.*@/, '//<credentials>@')}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`MongoDB not accessible: ${error.message}. Running with resilient JSON database fallback.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  isConnected: getIsConnected
};
