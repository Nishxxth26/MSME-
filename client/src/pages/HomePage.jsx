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
  CheckCircle2,
  Recycle,
  Truck,
  QrCode
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function HomePage({ onNavigate, onSelectProduct }) {
  const { products, categories, setSelectedCategory } = useProducts();
  const { setIsCartOpen } = useCart();
  const [platformStats, setPlatformStats] = useState({
    totalOrders: 1420,
    totalTreesPlanted: 1680,
    totalCarbonSavedKg: 6420.5,
    totalPlasticAvoided: 31200,
    activeMsmeArtisans: 48,
    totalWasteCollectedKg: 4850
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
            <span>Swachh Bharat & MSME Innovation • Circular Supply Chain</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.1]">
            Turn Waste into Wealth. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-300 via-emerald-200 to-amber-200">
              Direct MSME Impact.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Schedule free doorstep pickup for recyclable discards (coconut shells, denim scraps, clean paper), earn <strong>EcoPoints</strong>, and shop handcrafted upcycled goods directly from rural women cooperatives!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 text-sm transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Upcycled Goods</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('pickup')}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-semibold px-6 py-3.5 rounded-2xl backdrop-blur-md text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <Recycle className="w-4 h-4 text-amber-300" />
              <span>♻️ Schedule Waste Pickup</span>
            </button>

            <button
              onClick={() => onNavigate('impact')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-2xl backdrop-blur-md border border-white/15 text-sm transition-all flex items-center gap-2"
            >
              <TreePine className="w-4 h-4 text-emerald-300" />
              <span>Green Impact</span>
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
              <span>Free EV Delivery above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              <span>GPS Reverse Logistics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sustainability Impact Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              {platformStats.totalTreesPlanted.toLocaleString('en-IN')}
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trees Planted</p>
            <p className="text-[11px] text-slate-400">1 tree every ₹800 spent</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-eco-700 font-display">
              {platformStats.totalCarbonSavedKg.toLocaleString('en-IN')} kg
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">CO₂ Avoided</p>
            <p className="text-[11px] text-slate-400">Verified carbon accounting</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-display">
              {(platformStats.totalWasteCollectedKg || 4850).toLocaleString('en-IN')} kg
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Waste Diverted</p>
            <p className="text-[11px] text-slate-400">Doorstep reverse pickups</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-700 font-display">
              {platformStats.activeMsmeArtisans}
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">MSME Clusters</p>
            <p className="text-[11px] text-slate-400">Rural women & artisan groups</p>
          </div>
        </div>
      </section>

      {/* Circular Economy Flow Section (From Proposal Page 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30">
              The EcoCart Circular Supply Chain
            </span>
            <h2 className="text-3xl font-black font-display tracking-tight text-white">
              How Reverse Logistics Converts Waste to Wealth
            </h2>
            <p className="text-xs text-slate-300">
              Direct implementation of our smart, resilient supply chain methodology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-bold text-base text-white">Doorstep Pickup</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Households & societies schedule free pickups for coconut shells, scrap denim, paper & hard plastics.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-bold text-base text-white">GPS Cart & QR Tag</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Local collection operators weigh the discard and issue a digital QR batch tracking tag for supply chain transparency.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="font-bold text-base text-white">MSME Upcycling</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Local women Self-Help Groups (SHGs) and rural weavers clean, process, and craft them into luxury eco-products.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-base">
                4
              </div>
              <h3 className="font-bold text-base text-white">Marketplace & Points</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Finished products are listed on EcoCart. Citizens spend earned EcoPoints with automated Carbon Offset Certificates!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">Shop by Eco Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ethically made goods for daily sustainable living in India</p>
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
            View All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
