import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Leaf, 
  Package, 
  TreePine, 
  Sparkles, 
  Tag,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function CartDrawer({ onCheckout, onViewFullCart }) {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total,
    couponDiscount,
    packagingFee,
    shippingFee,
    totalCarbonSavedKg,
    totalPlasticAvoided,
    treesFunded,
    progressToFreeShipping,
    amountNeededForFreeShipping,
    packaging,
    setPackaging,
    appliedCoupon,
    setAppliedCoupon
  } = useCart();

  const { showToast } = useProducts();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/orders/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponInput('');
        showToast(`Promo code ${data.coupon.code} applied! Saved $${data.coupon.discountAmount.toFixed(2)}`, 'success');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        showToast(data.message || 'Invalid promo code', 'error');
      }
    } catch (err) {
      const fallbackCoupons = {
        ECO10: { code: 'ECO10', discountPercent: 10, minAmount: 499, description: '10% off your eco-conscious order' },
        SWACHH15: { code: 'SWACHH15', discountPercent: 15, minAmount: 799, description: '15% off orders above ₹799 for Swachh Bharat' },
        MSMEFIRST: { code: 'MSMEFIRST', discountPercent: 20, minAmount: 999, description: '20% off for first-time MSME supporters' }
      };
      const found = fallbackCoupons[code];
      if (found && subtotal >= found.minAmount) {
        const discountAmount = subtotal * (found.discountPercent / 100);
        const c = { ...found, discountAmount };
        setAppliedCoupon(c);
        setCouponInput('');
        showToast(`Promo code ${c.code} applied! Saved ₹${discountAmount.toFixed(0)}`, 'success');
      } else if (found && subtotal < found.minAmount) {
        setCouponError(`Min order of ₹${found.minAmount} required for ${code}`);
      } else {
        setCouponError('Invalid promo code');
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-eco-100 text-eco-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Your Eco Cart</h2>
                <p className="text-xs text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''} from local artisans</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Eco-Impact & Free Shipping Progress Bar */}
          <div className="bg-gradient-to-br from-eco-50 via-eco-100/50 to-emerald-50 px-5 py-3 border-b border-eco-200/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-eco-900">
                <TreePine className="w-4 h-4 text-eco-600" />
                {amountNeededForFreeShipping > 0 ? (
                  <>Add <strong className="text-eco-800">₹{amountNeededForFreeShipping.toFixed(0)}</strong> for Free Carbon-Neutral Shipping & 1 Tree Planted!</>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Unlocked Free Shipping & 1 Tree Planted!
                  </span>
                )}
              </span>
              <span className="text-eco-700 font-mono text-[11px]">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-2 bg-eco-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-eco-500 to-emerald-600 transition-all duration-500 ease-out"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-eco-50 text-eco-500 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Support indigenous artisans and explore handmade, earth-friendly essentials.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-eco-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-eco-700 transition-colors shadow-sm"
                >
                  Explore Catalog <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-white hover:border-eco-200 transition-all shadow-sm"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-50"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1 -mr-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>By {item.artisan}</span>
                      </p>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 font-display">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (₹{item.price.toLocaleString('en-IN')} ea)
                        </span>
                      </div>

                      {/* Counter */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-slate-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Eco contribution pill */}
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-eco-700 font-medium">
                      <span className="inline-flex items-center gap-0.5 bg-eco-50 px-1.5 py-0.5 rounded border border-eco-200/50">
                        🌿 -{(item.carbonSavedKg * item.quantity).toFixed(1)} kg CO₂
                      </span>
                      <span className="inline-flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50 text-emerald-700">
                        🌊 {item.plasticAvoided * item.quantity} plastics avoided
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Packaging Preference */}
            {items.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-eco-600" />
                  Eco-Packaging Option
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPackaging('biodegradable')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      packaging === 'biodegradable'
                        ? 'border-eco-600 bg-eco-50/70 text-eco-900 ring-1 ring-eco-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>Plant-Starch Box</span>
                      <span className="text-eco-700 font-mono">+₹49</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">100% home compostable box with jute twine.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackaging('zero-waste')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      packaging === 'zero-waste'
                        ? 'border-eco-600 bg-eco-50/70 text-eco-900 ring-1 ring-eco-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>Minimal Zero-Waste</span>
                      <span className="text-eco-600 font-mono">FREE</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Recycled kraft envelope with zero fillers.</p>
                  </button>
                </div>
              </div>
            )}

            {/* Coupon Section */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  Apply Eco Discount Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-800 font-mono">{appliedCoupon.code}</span>
                        <span className="text-emerald-700 ml-1.5 font-medium">({appliedCoupon.discountPercent}% Off)</span>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ECO10 or SWACHH15"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-xs uppercase font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 disabled:opacity-50 transition-colors"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                    )}

                    {/* Quick promo code pills */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-400">Try:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon('ECO10')}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 hover:bg-eco-100 text-slate-700 hover:text-eco-800 rounded border border-slate-200 transition-colors"
                      >
                        ECO10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon('SWACHH15')}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 hover:bg-eco-100 text-slate-700 hover:text-eco-800 rounded border border-slate-200 transition-colors"
                      >
                        SWACHH15
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon('MSMEFIRST')}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 hover:bg-eco-100 text-slate-700 hover:text-eco-800 rounded border border-slate-200 transition-colors"
                      >
                        MSMEFIRST
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer & Total */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200 space-y-3">
              {/* Eco-Impact Badge */}
              <div className="bg-white p-3 rounded-xl border border-eco-200 shadow-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-eco-100 text-eco-700 flex items-center justify-center font-bold">
                    🌱
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Your Earth Impact</p>
                    <p className="text-[11px] text-slate-500">
                      {totalCarbonSavedKg} kg CO₂ offset • {totalPlasticAvoided} plastics avoided
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                    <TreePine className="w-3 h-3" /> {treesFunded} {treesFunded === 1 ? 'Tree' : 'Trees'}
                  </span>
                </div>
              </div>

              {/* Price Calculation Lines */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-mono font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Eco Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {packagingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Biodegradable Packaging</span>
                    <span className="font-mono">₹{packagingFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Carbon-Neutral Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      `₹${shippingFee.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="font-mono text-base font-black text-eco-800">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckout();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-eco-600 to-eco-700 hover:from-eco-700 hover:to-eco-800 text-white font-bold rounded-xl shadow-lg shadow-eco-600/30 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Proceed to Green Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onViewFullCart();
                  }}
                  className="w-full py-2 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 text-xs transition-colors"
                >
                  View Full Cart & Breakdown
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-eco-600" />
                <span>100% Fair Trade Direct-to-Artisan Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
