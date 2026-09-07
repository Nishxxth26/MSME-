# EcoCart 🌿 — MSME Sustainable Online Shopping Cart

EcoCart is an e-commerce platform crafted for **Micro, Small & Medium Enterprises (MSMEs)**, rural artisans, and environmentally conscious consumers. It combines modern shopping cart functionality with real-time ecological intelligence—tracking carbon offsets, plastic elimination, eco-scoring, and artisanal storytelling.

---

## 🌟 Key Features

### 1. 🛒 Dynamic Eco-Shopping Cart & Drawer
- **Real-time Carbon & Plastic Offset Counter**: Calculates cumulative CO₂ saved (kg) and single-use plastic bottles avoided as items are added.
- **Eco-Progress Bar**: Incentivizes green orders by displaying progress towards Free Carbon-Neutral Shipping and 1 Native Tree Planted (at $40+).
- **Sustainable Packaging Selector**:
  - *100% Compostable Plant-Starch Box & Jute Twine* (+$1.50)
  - *Minimal Zero-Waste Recycled Kraft Mailer* (FREE)
- **EcoPoints & Green Wallet Redemption**: Earn points on every purchase and redeem directly at checkout ($1 off for every 20 points).
- **Green Promo Codes**: Built-in promo validation (`ECO10` for 10% off, `EARTHDAY` for 15% off, `MSMEFIRST` for 20% off).

### 2. 🌾 Direct MSME Artisan Catalog
- Products sourced directly from verified Indian MSME cooperatives and women-led rural clusters (Udyam registration verified).
- **Eco-Score Badges**: Life-cycle ratings (`A+`, `A`, `B`) reflecting material biodegradability, energy inputs, and packaging.
- **"Meet the Maker" Profiles**: Highlights the artisan's name, region, traditional craft technique, and fair-wage story.
- **Comprehensive Filtering**: Filter by category, Eco-Score, MSME enterprise type, price range, and sort by highest carbon offset or customer rating.

### 3. 🚚 Multi-Step Eco-Checkout & Certificates
- **3-Step Checkout**: Delivery address -> Zero-emission EV courier preference -> Payment simulation.
- **Simulated Payment Gateways**: UPI / QR Code scan simulation, Credit/Debit cards, Green Wallet, and Cash on Delivery.
- **Printable Carbon Offset Certificate**: Official certificate generated upon order placement featuring the customer's name, tree count, and CO₂ offset.
- **Live Order Tracker**: Follow the order from artisan receipt to eco-packing, EV transit, and delivery.

### 4. 🏬 MSME Seller / Artisan Portal
- Seamless toggle between Shopper View and MSME Seller Portal.
- **Catalog Management**: Add, update, and delete sustainable products with instant catalog synchronization.
- **Order Fulfillment**: Track customer orders and update status (`Order Placed` -> `Artisan Confirmed` -> `Eco-Packed` -> `Delivered`).
- **Environmental & Revenue Analytics**: Monitor store earnings, units fulfilled, and platform-wide carbon offset.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
From the project root:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running the Application

#### Option A: Run Server and Client Separately
1. Start the backend API (Port 5000):
```bash
cd server
npm start
```
2. In a separate terminal, start the Vite frontend (Port 5173):
```bash
cd client
npm run dev
```

3. Open your browser at:
```
http://localhost:5173
```

---

## 📡 Backend API Endpoints

- `GET /api/products` — Filterable product catalog (query params: `category`, `search`, `ecoScore`, `msmeType`, `sort`, `minPrice`, `maxPrice`)
- `GET /api/products/:id` — Single product details
- `POST /api/products` — List new eco-product (MSME Seller)
- `PUT /api/products/:id` — Update existing product
- `DELETE /api/products/:id` — Remove product
- `GET /api/categories` — Product categories
- `GET /api/orders` — List customer orders
- `POST /api/orders` — Create new order with eco calculations
- `PATCH /api/orders/:id/status` — Update order fulfillment status
- `POST /api/orders/verify-coupon` — Validate coupon codes
- `GET /api/impact/stats` — Platform-wide sustainability statistics
- `GET /api/health` — API health check

---

## 🌿 Sustainability Data Model
- **Trees Funded**: Automatically calculated based on order total (1 tree per $35 spent).
- **Carbon Saved**: Calculated from raw materials compared to standard petroleum-based industrial alternatives.
- **Packaging Waste**: Zero-plastic compliance with water-activated starch and post-consumer kraft mailers.
