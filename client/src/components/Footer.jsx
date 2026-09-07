import React from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  TreePine, 
  HeartHandshake, 
  Truck, 
  Award,
  ArrowRight
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-eco-900/60 border border-eco-500/30 text-eco-400 flex items-center justify-center flex-shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">1 Order = 1 Tree</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                We partner with verified agroforestry NGOs to plant native trees for every qualifying order.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-eco-900/60 border border-eco-500/30 text-eco-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Direct MSME Support</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Zero middleman commissions. 88% of purchase value directly reaches rural artisans and small makers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-eco-900/60 border border-eco-500/30 text-eco-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Carbon-Neutral EV Transit</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Deliveries are bundled and fulfilled via electric cargo vehicles with 100% compostable boxes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-eco-900/60 border border-eco-500/30 text-eco-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Verified Eco-Scores</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every product undergo life-cycle analysis: raw material origin, biodegradability, and carbon footprint.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-eco-600 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white font-display">
                Eco<span className="text-eco-400">Cart</span> MSME
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              India's first dedicated sustainable marketplace connecting conscious consumers with verified Micro, Small & Medium artisanal enterprises. Crafting a greener tomorrow, one cart at a time.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-eco-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-eco-400" />
              <span>Registered MSME Facilitator • Udyam Compliant</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Navigation</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-eco-400 transition-colors">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('impact')} className="hover:text-eco-400 transition-colors">
                  Green Impact Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seller')} className="hover:text-eco-400 transition-colors">
                  MSME Artisan Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-eco-400 transition-colors">
                  Shopping Cart & Breakdown
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Eco Newsletter</h5>
            <p className="text-xs text-slate-400 mb-3">
              Receive artisan stories, zero-waste recipes, and exclusive green coupons.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-eco-500 flex-1"
              />
              <button className="bg-eco-600 hover:bg-eco-500 text-white p-2 rounded-xl transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EcoCart Technologies. Designed for Sustainable MSME Empowerment.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Fair Trade Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Carbon Offset Audits</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
