import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  TreePine, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Users, 
  ShoppingBag,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function HomePage({ onNavigate, onSelectProduct }) {
  const { products, categories, setSelectedCategory } = useProducts();
  const { setIsCartOpen } = useCart();
  const [platformStats, setPlatformStats] = useState({
    totalOrders: 1284,
    totalTreesPlanted: 1542,
    totalCarbonSavedKg: 5890.4,
    totalPlasticAvoided: 28400,
    activeMsmeArtisans: 48
  });

  useEffect(() => {
    fetch('/api/impact/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setPlatformStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eco-900 via-eco-800 to-slate-900 text-white shadow-xl mx-4 sm:mx-6 lg:mx-8 mt-4 p-8 sm:p-14 lg:p-16">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-eco-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-eco-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Direct-from-Artisan MSME Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.1]">
            Conscious Shopping. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-300 via-emerald-200 to-amber-200">
              Direct MSME Impact.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Discover handcrafted, zero-waste products made by verified rural cooperatives and micro-enterprises. Every order eliminates single-use plastics and funds verified tree planting.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 text-sm transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Eco Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('impact')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl backdrop-blur-md border border-white/15 text-sm transition-all flex items-center gap-2"
            >
              <TreePine className="w-4 h-4 text-emerald-300" />
              <span>Track Live Impact</span>
            </button>
          </div>

          {/* Mini Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              <span>100% Verified MSMEs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              <span>Carbon-Neutral Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              <span>Fair Living Wages</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-eco-700 font-display">
              {platformStats.totalTreesPlanted.toLocaleString()}+
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trees Planted</p>
            <p className="text-[11px] text-slate-400">Via native reforestation partners</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-display">
              {platformStats.totalCarbonSavedKg.toLocaleString()} <span className="text-lg">kg</span>
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">CO₂ Offset</p>
            <p className="text-[11px] text-slate-400">Through eco materials & EVs</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-700 font-display">
              {platformStats.totalPlasticAvoided.toLocaleString()}+
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Plastics Avoided</p>
            <p className="text-[11px] text-slate-400">Single-use bottles diverted</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-800 font-display">
              {platformStats.activeMsmeArtisans}
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">MSME Clusters</p>
            <p className="text-[11px] text-slate-400">Rural women & artisan groups</p>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">Shop by Eco Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ethically made goods for daily sustainable living</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              onNavigate('shop');
            }}
            className="text-xs font-bold text-eco-700 hover:text-eco-900 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                onNavigate('shop');
              }}
              className="bg-white hover:bg-eco-50/60 p-4 rounded-2xl border border-slate-200/80 hover:border-eco-300 transition-all text-center cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-eco-100/80 text-eco-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-eco-800 transition-colors">
                {cat.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider mb-1">
              <Leaf className="w-3.5 h-3.5" /> Handpicked for You
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-display">Trending Sustainable Finds</h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-eco-700 hover:text-eco-900 flex items-center gap-1"
          >
            Browse All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Meet The Makers Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-eco-50/80 rounded-3xl p-8 sm:p-12 border border-amber-200/60">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 px-3 py-1 bg-amber-100 rounded-full">
              Artisan Spotlight
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-display mt-3">
              The Hands Behind Your Eco Goods
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              Every EcoCart product connects you to an authentic micro-enterprise preserving time-honored Indian craft traditions while caring for Mother Earth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                  alt="Meera Pillai"
                  className="w-14 h-14 rounded-full object-cover border-2 border-eco-500"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Meera Pillai</h4>
                  <p className="text-xs text-eco-700 font-medium">Prakriti Naturals, Kerala</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    UDYAM-KL-02-004819
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "We take discarded coastal coconut shells and create soot-free aromatherapy candles. We provide full-time dignified jobs to 14 village women."
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
                  alt="Ramesh Gowda"
                  className="w-14 h-14 rounded-full object-cover border-2 border-eco-500"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ramesh Gowda</h4>
                  <p className="text-xs text-eco-700 font-medium">EarthRoot Crafts, Mysuru</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    UDYAM-KR-18-009124
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Our family has been hand-carving sustainably harvested bamboo and neem wood for 3 generations. Zero plastics, 100% biodegradable care."
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Sneha Patel"
                  className="w-14 h-14 rounded-full object-cover border-2 border-eco-500"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sneha Patel</h4>
                  <p className="text-xs text-eco-700 font-medium">PunarVastra, Surat</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    UDYAM-GJ-22-005612
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "We collect discarded factory denim off-cuts and combine them with natural golden jute to create rugged, stylish zero-waste laptop sleeves."
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
