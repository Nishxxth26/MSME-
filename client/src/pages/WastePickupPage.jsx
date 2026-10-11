import React, { useState } from 'react';
import { 
  Recycle, 
  Truck, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Coins, 
  Leaf, 
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import confetti from 'canvas-confetti';

const WASTE_CATEGORIES = [
  {
    id: 'Agricultural & Coconut Shells',
    title: 'Coconut Shells & Agro-Waste',
    icon: '🥥',
    rewardPerKg: 10,
    minWeight: 3,
    destination: 'Upcycled into scented candles, bio-pots & artisanal kitchenware by Prakriti Naturals (Kerala).',
    accepted: 'Clean coconut halves, husks, dried areca sheaths',
    bg: 'from-amber-500/10 to-emerald-500/10',
    border: 'border-amber-200 dark:border-amber-900/50'
  },
  {
    id: 'Industrial Denim & Textiles',
    title: 'Denim & Textile Discards',
    icon: '👖',
    rewardPerKg: 15,
    minWeight: 2,
    destination: 'Sanitized and stitched into durable laptop sleeves & market totes by PunarVastra Weavers (Gujarat).',
    accepted: 'Old jeans, denim scraps, cotton fabric off-cuts, canvas',
    bg: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-blue-200 dark:border-blue-900/50'
  },
  {
    id: 'Clean Paper & Cardboard Scrap',
    title: 'Paper & Cardboard Scrap',
    icon: '📦',
    rewardPerKg: 8,
    minWeight: 5,
    destination: 'Pulped into tree-free marigold seed paper & wildflower plantable journals by Beej Paperworks (Rajasthan).',
    accepted: 'Newspapers, cartons, books, office paper (dry only)',
    bg: 'from-orange-500/10 to-amber-500/10',
    border: 'border-orange-200 dark:border-orange-900/50'
  },
  {
    id: 'Dry Recyclable Hard Plastics',
    title: 'Rigid Household Plastics',
    icon: '♻️',
    rewardPerKg: 12,
    minWeight: 2,
    destination: 'Shredded, cleaned, and compression-molded into recycled combs & eco-tiles by EarthRoot Collective.',
    accepted: 'Shampoo bottles, detergent containers, bucket fragments (HDPE/PP)',
    bg: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-200 dark:border-emerald-900/50'
  }
];

export default function WastePickupPage({ onNavigate }) {
  const { user, addOrderImpact } = useAuth();
  const { showToast } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(WASTE_CATEGORIES[0].id);
  const [weightKg, setWeightKg] = useState(5);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    societyName: '',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: 'Morning (9 AM - 12 PM)',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const activeCategory = WASTE_CATEGORIES.find(c => c.id === selectedCategory) || WASTE_CATEGORIES[0];
  const calculatedPoints = Math.round(weightKg * activeCategory.rewardPerKg);
  const discountWorth = (calculatedPoints * 0.50).toFixed(0);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      showToast('Please complete all contact and address fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      citizen: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        societyName: formData.societyName
      },
      wasteCategory: selectedCategory,
      estimatedWeightKg: weightKg,
      pickupDate: formData.pickupDate,
      timeSlot: formData.timeSlot,
      notes: formData.notes
    };

    try {
      const res = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBookingSuccess(data.pickup);
        addOrderImpact(calculatedPoints, (weightKg * 1.8), Math.max(1, Math.floor(weightKg / 10)));
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#059669', '#34D399', '#F59E0B']
        });
        showToast(`Pickup scheduled! +${calculatedPoints} EcoPoints awarded to your wallet!`, 'success');
      } else {
        throw new Error(data.message || 'Error scheduling pickup');
      }
    } catch (err) {
      // Fallback for static client mode
      const fallbackPickup = {
        pickupId: 'ECO-WASTE-' + Math.floor(1000 + Math.random() * 9000),
        citizen: payload.citizen,
        wasteCategory: selectedCategory,
        estimatedWeightKg: weightKg,
        pickupDate: formData.pickupDate,
        timeSlot: formData.timeSlot,
        notes: formData.notes || 'Household segregated dry waste.',
        qrCodeData: `ECOCART-BATCH-${selectedCategory.slice(0, 5)}-${weightKg}KG`,
        assignedCart: {
          cartId: 'CART-04 (GPS Enabled)',
          operatorName: 'Suresh Kumar',
          operatorPhone: '+91 98450 88219'
        },
        status: 'Scheduled',
        ecoPointsAwarded: calculatedPoints
      };
      setBookingSuccess(fallbackPickup);
      addOrderImpact(calculatedPoints, (weightKg * 1.8), Math.max(1, Math.floor(weightKg / 10)));
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#F59E0B']
      });
      showToast(`Pickup scheduled! +${calculatedPoints} EcoPoints awarded!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-300 dark:border-emerald-800">
            <Recycle className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>Reverse Supply Chain • Swachh Bharat & MSME Innovation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Turn Household Discards into <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">Artisanal Upcycled Wealth</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Schedule a free doorstep pickup for clean segregated recyclables. We route raw materials to local women-led MSME clusters and reward you with <strong>EcoPoints</strong> to spend on our store!
          </p>
        </div>

        {/* 4-Step Reverse Supply Chain Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Segregate at Home</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Collect coconut shells, jeans, or cardboard clean and dry.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Book Free Pickup</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select a convenient date and time slot below.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">GPS Cart & QR Tag</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Local operator collects, weighs, and scans your batch tag.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">4</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Earn & Shop</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receive wallet EcoPoints and buy upcycled products!</p>
            </div>
          </div>
        </div>

        {bookingSuccess ? (
          /* Confirmation State with QR Batch Tag */
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800/60 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Waste Pickup Scheduled!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tracking Batch ID: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{bookingSuccess.pickupId}</span>
              </p>
            </div>

            {/* QR Tracking Code Simulation */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <QrCode className="w-24 h-24 text-slate-900" />
                <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">BATCH QR CODE</span>
              </div>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 w-full">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Material Category:</span>
                  <span className="font-semibold">{bookingSuccess.wasteCategory}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Est. Quantity:</span>
                  <span className="font-semibold">{bookingSuccess.estimatedWeightKg} kg</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Pickup Date & Slot:</span>
                  <span className="font-semibold">{bookingSuccess.pickupDate} ({bookingSuccess.timeSlot})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">Assigned Cart:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{bookingSuccess.assignedCart.cartId}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Points Credited:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">+{bookingSuccess.ecoPointsAwarded} EcoPoints</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-3">
              <Coins className="w-6 h-6 text-amber-500 shrink-0" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200">
                <strong>EcoPoints Added:</strong> Your Green Wallet has received <strong>+{bookingSuccess.ecoPointsAwarded} EcoPoints</strong> (worth ₹{(bookingSuccess.ecoPointsAwarded * 0.50).toFixed(0)} discount). You can redeem them during checkout right now!
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setBookingSuccess(null)}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm text-center"
              >
                Schedule Another Pickup
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-white transition text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>Shop Upcycled Goods</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Waste Type & Weight (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Step 1: Select Waste Stream to Surrender
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WASTE_CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            +{cat.rewardPerKg} pts/kg
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{cat.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{cat.accepted}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weight Slider & Rewards */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-900 dark:text-white">
                    Step 2: Estimated Batch Weight
                  </label>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {weightKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>2 kg (Min)</span>
                  <span>15 kg</span>
                  <span>30 kg</span>
                  <span>50 kg (Bulk Society)</span>
                </div>

                {/* Reward Callout */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Green Wallet Bonus</div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white">
                        +{calculatedPoints} EcoPoints <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">(₹{discountWorth} Discount)</span>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>

                {/* Upcycling Destination Info */}
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Upcycling Partner:</strong> {activeCategory.destination}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Address, Date & Submit (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Step 3: Doorstep Pickup Details
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 560038"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House / Flat No., Street, Landmark"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Apartment / Society Name (Optional)</label>
                  <input
                    type="text"
                    name="societyName"
                    value={formData.societyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Green Palm RWA"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pickup Date *</label>
                    <input
                      type="date"
                      name="pickupDate"
                      required
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot *</label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (1 PM - 4 PM)</option>
                      <option>Evening (5 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Special Instructions</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Leave with gate security / dry segregated"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] font-bold text-white transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                <Truck className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering Batch...' : 'Confirm Free Doorstep Pickup'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero collection charge • GPS-tracked operator • Verified MSME upcycling</span>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
