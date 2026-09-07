import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Coins, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  TreePine,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function CheckoutPage({ onBack, onOrderComplete }) {
  const { 
    items, 
    subtotal, 
    total, 
    couponDiscount, 
    pointsDiscount,
    packagingFee, 
    shippingFee, 
    packaging, 
    appliedCoupon,
    pointsToRedeem,
    totalCarbonSavedKg,
    totalPlasticAvoided,
    treesFunded,
    clearCart
  } = useCart();

  const { user, deductEcoPoints, addOrderImpact } = useAuth();
  const { showToast } = useProducts();

  // Step state: 1: Address, 2: Delivery, 3: Payment
  const [currentStep, setCurrentStep] = useState(1);

  // Address Form
  const [formData, setFormData] = useState({
    name: user.name || 'Ananya Sharma',
    email: user.email || 'ananya.sharma@example.com',
    phone: user.phone || '+91 98765 43210',
    address: user.address || '42 Green Valley Enclave, Indiranagar',
    city: user.city || 'Bengaluru',
    state: user.state || 'Karnataka',
    pincode: user.pincode || '560038'
  });

  // Shipping Method
  const [selectedShipping, setSelectedShipping] = useState('Electric Vehicle Carbon-Neutral Cargo');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'ecopoints', 'cod'
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const orderPayload = {
        customer: formData,
        items: items,
        packaging: packaging === 'biodegradable' 
          ? 'Biodegradable Plant-Starch Box & Jute Twine' 
          : 'Minimal Zero-Waste Recycled Kraft Mailer',
        shippingMethod: selectedShipping,
        paymentMethod: paymentMethod.toUpperCase(),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        ecoPointsUsed: pointsToRedeem
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update user state
        if (pointsToRedeem > 0) {
          deductEcoPoints(pointsToRedeem);
        }
        addOrderImpact(data.order.ecoPointsEarned, data.order.ecoImpact.totalCarbonSavedKg, data.order.ecoImpact.treesFunded);

        // Clear cart
        clearCart();

        showToast('Order placed successfully! Planting your tree...', 'success');
        onOrderComplete(data.order);
      } else {
        showToast(data.message || 'Error processing order', 'error');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      showToast('Network error processing your order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-eco-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </button>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Lock className="w-3.5 h-3.5 text-eco-600" />
          <span>SSL 256-bit Encrypted Eco Checkout</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
          {[
            { step: 1, label: 'Delivery Details' },
            { step: 2, label: 'Eco Shipping' },
            { step: 3, label: 'Payment' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep === item.step
                    ? 'bg-eco-600 text-white ring-4 ring-eco-100 shadow-md'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-5 h-5" /> : item.step}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${
                currentStep === item.step ? 'text-eco-800 font-bold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Checkout Grid: Left Steps (7 cols) + Right Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Steps Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">1. Shipping Address</h3>
                <p className="text-xs text-slate-500">Where should our zero-emission EV courier deliver?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-3 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Continue to Eco Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Method */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">2. Choose Delivery Method</h3>
                <p className="text-xs text-slate-500">Every method guarantees zero net carbon emissions</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Electric Vehicle (EV) Carbon-Neutral Delivery',
                    desc: 'Fulfilled via regional EV fleet and bundled local routing.',
                    fee: shippingFee === 0 ? 'FREE' : '$4.99',
                    estimate: 'Delivered in 2 - 3 business days',
                    icon: '⚡'
                  },
                  {
                    title: 'Green Rail & Surface Express',
                    desc: 'Lowest emissions transport corridors with certified carbon offsets.',
                    fee: shippingFee === 0 ? 'FREE' : '$2.99',
                    estimate: 'Delivered in 3 - 4 business days',
                    icon: '🚆'
                  }
                ].map((meth, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedShipping(meth.title)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedShipping === meth.title
                        ? 'border-eco-600 bg-eco-50/70 text-eco-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{meth.icon}</span>
                        <div>
                          <p className="font-bold text-slate-900">{meth.title}</p>
                          <p className="text-[11px] text-slate-500">{meth.desc}</p>
                          <p className="text-[10px] text-eco-700 font-semibold mt-0.5">{meth.estimate}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm text-slate-800">{meth.fee}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Simulation */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">3. Eco Payment Simulation</h3>
                <p className="text-xs text-slate-500">Select a payment mode (Safe test simulation)</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { id: 'upi', label: 'UPI / QR Code', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'ecopoints', label: 'Green Wallet', icon: <Coins className="w-4 h-4" /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote className="w-4 h-4" /> }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === m.id
                        ? 'border-eco-600 bg-eco-50 text-eco-900 font-bold ring-2 ring-eco-500/20'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment details container */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                {paymentMethod === 'upi' && (
                  <div className="text-center space-y-3 py-2">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 mx-auto shadow-inner flex items-center justify-center">
                      {/* Sim QR code */}
                      <div className="w-full h-full border-2 border-dashed border-eco-500 rounded-lg flex flex-col items-center justify-center p-2">
                        <QrCode className="w-12 h-12 text-eco-700 mb-1" />
                        <span className="text-[10px] font-mono text-slate-600 font-bold">SCAN & PAY</span>
                        <span className="text-[9px] text-eco-700 font-semibold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Scan using Google Pay, PhonePe, Paytm, or BHIM. Instant zero-fee verification.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4242"
                        defaultValue="4242 4242 4242 4242"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="12/28"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          defaultValue="789"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'ecopoints' && (
                  <div className="text-xs space-y-2 py-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>EcoPoints Balance:</span>
                      <span className="font-mono text-amber-700 font-bold">{user.ecoPoints} points</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Your points contribute toward sustainability funding. Remaining balance charged to default card.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="text-xs py-2 space-y-1">
                    <p className="font-semibold text-slate-800">Cash / UPI on Delivery</p>
                    <p className="text-slate-500 text-[11px]">
                      Pay the EV delivery partner when you receive your compostable package.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 bg-gradient-to-r from-eco-600 to-emerald-700 hover:from-eco-700 hover:to-emerald-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-eco-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Confirming Eco-Order...</span>
                  ) : (
                    <>
                      <span>Place Sustainable Order (${total.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Items & Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 font-display text-sm pb-2 border-b border-slate-100">
              Cart Items ({items.length})
            </h4>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={it.image} alt={it.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{it.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Qty: {it.quantity} × ${it.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-slate-900 flex-shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Eco Discount</span>
                  <span className="font-mono">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>EcoPoints Discount</span>
                  <span className="font-mono">-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              {packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Biodegradable Packaging</span>
                  <span className="font-mono">${packagingFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Carbon-Neutral Delivery</span>
                <span className="font-mono">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-lg font-black font-mono text-eco-800">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Carbon Offset Certificate Promise */}
            <div className="p-3.5 bg-gradient-to-br from-eco-50 via-emerald-50 to-teal-50 rounded-xl border border-eco-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-eco-900">
                <TreePine className="w-4 h-4 text-eco-700" />
                <span>Your Order Funds</span>
              </div>
              <p className="text-[11px] text-eco-800">
                • <strong>{treesFunded} Native Tree</strong> planted through rural agroforestry
              </p>
              <p className="text-[11px] text-eco-800">
                • <strong>{totalCarbonSavedKg} kg CO₂</strong> offset certified
              </p>
              <p className="text-[11px] text-eco-800">
                • <strong>{Math.round(total)} EcoPoints</strong> earned for your wallet
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
