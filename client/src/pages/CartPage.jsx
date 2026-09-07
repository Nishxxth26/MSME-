import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Leaf, 
  TreePine, 
  Package, 
  Tag, 
  Check, 
  Coins, 
  Sparkles, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function CartPage({ onNavigate, onCheckout }) {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total, 
    couponDiscount, 
    pointsDiscount,
    packagingFee, 
    shippingFee, 
    totalCarbonSavedKg, 
    totalPlasticAvoided, 
    treesFunded, 
    packaging, 
    setPackaging,
    appliedCoupon,
    setAppliedCoupon,
    pointsToRedeem,
    setPointsToRedeem,
    amountNeededForFreeShipping,
    progressToFreeShipping
  } = useCart();

  const { user } = useAuth();
  const { showToast } = useProducts();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (code) => {
    const couponCode = (code || couponInput).trim().toUpperCase();
    if (!couponCode) return;

    setCouponLoading(true);
    try {
      const res = await fetch('/api/orders/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponInput('');
        showToast(`Promo code ${data.coupon.code} applied!`, 'success');
      } else {
        showToast(data.message || 'Invalid promo code', 'error');
      }
    } catch (err) {
      showToast('Error applying coupon', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-eco-50 text-eco-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-display">Your Eco Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-8">
          Support local artisans, cooperatives, and small MSME makers by choosing natural, zero-waste alternatives.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 bg-eco-600 hover:bg-eco-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Start Sustainable Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-display">Review Your Eco Cart</h1>
          <p className="text-xs text-slate-500 mt-1">
            {items.length} artisan products • Real-time carbon offset active
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-700 hover:text-eco-900 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </button>
      </div>

      {/* Free Shipping & Tree Banner */}
      <div className="bg-gradient-to-r from-eco-50 via-emerald-50 to-teal-50 p-5 rounded-2xl border border-eco-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-eco-900">
            <TreePine className="w-4 h-4 text-eco-700" />
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more for Free Carbon-Neutral Delivery & 1 Native Tree Planted!
              </span>
            ) : (
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Unlocked Free Shipping & 1 Tree Planted!
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-bold text-eco-800">{progressToFreeShipping}%</span>
        </div>
        <div className="w-full h-2.5 bg-eco-200/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-eco-600 rounded-full transition-all duration-500" 
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items (8 cols) + Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-eco-700">By {item.artisan}</span>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-mono">${item.price.toFixed(2)} each</span>
                      <span>•</span>
                      <span className="text-eco-700 font-medium text-[11px]">
                        🌿 -{(item.carbonSavedKg * item.quantity).toFixed(1)} kg CO₂
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-sm font-black font-display text-slate-900 min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Trash */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Eco-Packaging Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-eco-600" /> Sustainable Packaging Selection
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => setPackaging('biodegradable')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  packaging === 'biodegradable'
                    ? 'border-eco-600 bg-eco-50/70 text-eco-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span>Plant-Starch Compostable Box</span>
                  <span className="font-mono text-eco-800">+$1.50</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  100% home compostable starch box cushioned with shredded natural jute fibers.
                </p>
              </div>

              <div
                onClick={() => setPackaging('zero-waste')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  packaging === 'zero-waste'
                    ? 'border-eco-600 bg-eco-50/70 text-eco-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span>Minimal Zero-Waste Mailer</span>
                  <span className="font-mono text-eco-600">FREE</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Post-consumer recycled kraft envelope with non-toxic water-activated gum.
                </p>
              </div>
            </div>
          </div>

          {/* Redeem EcoPoints */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Redeem Green Wallet EcoPoints
                </h4>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Available: {user.ecoPoints} points
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Redeem points earned from past sustainable orders. 20 EcoPoints = $1.00 off!
            </p>
            <div className="flex items-center gap-4 pt-1">
              <input
                type="range"
                min="0"
                max={Math.min(user.ecoPoints, Math.floor(subtotal / 0.05))}
                step="20"
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(parseInt(e.target.value, 10))}
                className="flex-1 accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-bold font-mono text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">
                {pointsToRedeem} pts (-${(pointsToRedeem * 0.05).toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 font-display pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Promo Code Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-eco-600" /> Have a Promo Code?
              </label>
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-900 font-mono">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ECO10, EARTHDAY"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs p-2.5 uppercase font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Calculations List */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>EcoPoints ({pointsToRedeem} pts)</span>
                  <span className="font-mono">-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              {packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Compostable Packaging</span>
                  <span className="font-mono">${packagingFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Carbon-Neutral Shipping</span>
                <span className="font-mono">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="font-bold text-sm">Estimated Total</span>
                <span className="text-xl font-black font-mono text-eco-800">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Earth Impact Breakdown Card */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Total Sustainability Gain</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                • <strong>{totalCarbonSavedKg} kg CO₂</strong> emissions avoided
              </p>
              <p className="text-[11px] text-emerald-800">
                • <strong>{totalPlasticAvoided}</strong> single-use plastics diverted
              </p>
              <p className="text-[11px] text-emerald-800">
                • <strong>{treesFunded}</strong> native tree planting funded
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full py-3.5 px-4 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl shadow-lg shadow-eco-600/30 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-eco-600" />
              <span>Safe & Secure Eco-Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
