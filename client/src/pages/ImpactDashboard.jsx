import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  Leaf, 
  Coins, 
  Sparkles, 
  Award, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Heart, 
  ArrowRight, 
  Trash2,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function ImpactDashboard({ onNavigate, onSelectProduct }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, products, toggleWishlist, showToast } = useProducts();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserOrders(data.orders || []);
        }
      })
      .catch(() => {
        try {
          const local = JSON.parse(localStorage.getItem('ecocart_orders') || '[]');
          setUserOrders(local);
        } catch (e) {}
      });
  }, []);

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const badges = [
    { title: 'Tree Guardian', desc: 'Funded 4+ native reforestation trees', icon: <TreePine className="w-5 h-5 text-emerald-600" />, unlocked: true },
    { title: 'Plastic Eliminator', desc: 'Diverted 25+ single-use plastic items', icon: <Leaf className="w-5 h-5 text-eco-600" />, unlocked: true },
    { title: 'Handloom Patron', desc: 'Supported 3+ rural artisan weaving clusters', icon: <Award className="w-5 h-5 text-amber-600" />, unlocked: true },
    { title: 'Zero-Waste Pioneer', desc: 'Chose biodegradable packaging 5+ times', icon: <Sparkles className="w-5 h-5 text-teal-600" />, unlocked: true }
  ];

  const handleShareImpact = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`I've saved ${user.carbonSavedKg}kg of CO2 and planted ${user.treesPlanted} trees on EcoCart! 🌱`);
      showToast('Impact copied to clipboard! Share on social media!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Profile & Impact Hero */}
      <div className="bg-gradient-to-br from-eco-900 via-eco-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-eco-400 shadow-md"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display">{user.name}</h1>
              <p className="text-xs text-eco-200">Verified Sustainable Shopper • Member since 2025</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Here is your personal environmental ledger. Every conscious purchase directly offsets emissions, cleans up single-use plastics, and supports rural MSME artisan families.
          </p>

          <div className="pt-2">
            <button
              onClick={handleShareImpact}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border border-white/20 transition-all"
            >
              <Share2 className="w-4 h-4 text-eco-300" />
              <span>Share My Green Impact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lifetime Impact Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <TreePine className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-display">
            {user.treesPlanted} Trees
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Planted in Your Name</p>
          <p className="text-[11px] text-slate-400">Native saplings in Western Ghats & Aravali</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-eco-100 text-eco-700 flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-display">
            {user.carbonSavedKg} kg
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">CO₂ Emissions Avoided</p>
          <p className="text-[11px] text-slate-400">Equivalent to 135 km of EV driving</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
            <Coins className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-display">
            {user.ecoPoints} Pts
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Green Wallet Balance</p>
          <p className="text-[11px] text-slate-400">Redeemable for ₹{((user.ecoPoints || 0) * 0.50).toFixed(0)} checkout savings</p>
        </div>
      </div>

      {/* Sustainable Badges */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 font-display">
            Your Sustainability Achievements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Badges unlocked by choosing circular and ethical alternatives</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                {b.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{b.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{b.desc}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 mt-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Unlocked
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders & Delivery Tracking */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">Past Orders & Eco Deliveries</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track shipment statuses and carbon offset records</p>
          </div>
        </div>

        {userOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No orders placed yet.</p>
        ) : (
          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-slate-900">{ord.id}</span>
                    <span className="text-xs text-slate-400">{new Date(ord.date).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {ord.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span>{ord.items?.length} items</span>
                  <span>•</span>
                  <span>Total: <strong className="text-slate-900">₹{ord.pricing?.total?.toLocaleString('en-IN') || ord.pricing?.total}</strong></span>
                  <span>•</span>
                  <span className="text-eco-800 font-medium">🌿 -{ord.ecoImpact?.totalCarbonSavedKg} kg CO₂</span>
                  <span>•</span>
                  <span className="text-emerald-800 font-medium">🌲 {ord.ecoImpact?.treesFunded} Tree Planted</span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {ord.items?.map((it, idx) => (
                    <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {it.quantity}x {it.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Eco Wishlist */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Saved Eco Wishlist ({wishlistedProducts.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Handmade favorites saved for future green orders</p>
          </div>
          {wishlistedProducts.length > 0 && (
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-eco-700 hover:text-eco-900 flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Your wishlist is empty. Tap the heart icon on any product in the catalog to save it!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm hover:shadow-md transition-all">
                <div 
                  onClick={() => onSelectProduct(p)}
                  className="cursor-pointer"
                >
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-44 object-cover rounded-xl mb-2" />
                  <span className="text-[10px] text-eco-700 font-bold">{p.artisan?.name}</span>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{p.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-sm text-slate-900">${p.price.toFixed(2)}</span>
                    <span className="text-[10px] text-eco-700 font-mono">🌿 -{p.carbonSavedKg} kg CO₂</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      addToCart(p, 1);
                      showToast(`Added "${p.name.slice(0, 16)}..." to cart!`, 'success');
                    }}
                    className="flex-1 py-2 bg-eco-600 hover:bg-eco-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
