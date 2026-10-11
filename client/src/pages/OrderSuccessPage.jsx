import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  TreePine, 
  Leaf, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Truck, 
  Package, 
  Award, 
  Calendar 
} from 'lucide-react';

export default function OrderSuccessPage({ order, onNavigate }) {
  useEffect(() => {
    // Fire festive eco-friendly green and gold confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2e7c4b', '#3e9960', '#97d2aa', '#d97706', '#10b981']
    });
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No recent order found</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-eco-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-eco-800 via-eco-700 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest bg-emerald-400/20 text-emerald-200 px-3 py-1 rounded-full border border-emerald-300/30">
          Order Confirmed & Tree Planted
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display mt-3">
          Thank You for Shopping Sustainably!
        </h1>
        <p className="text-sm text-eco-100 max-w-md mx-auto mt-2">
          Your order directly supports local MSME artisans and funds certified native reforestation.
        </p>
        <div className="inline-block mt-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 font-mono text-xs">
          Order ID: <strong className="text-white">{order.id}</strong>
        </div>
      </div>

      {/* Carbon Offset Certificate Card (Printable) */}
      <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-8 sm:p-10 shadow-lg relative print:m-0 print:border-none print:shadow-none">
        {/* Certificate Watermark Stamp */}
        <div className="absolute right-8 top-8 opacity-10 pointer-events-none">
          <TreePine className="w-48 h-48 text-eco-800" />
        </div>

        <div className="border border-emerald-200 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-eco-50/50 via-white to-amber-50/30 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-eco-700">
            <Award className="w-6 h-6" />
            <span className="text-xs uppercase font-black tracking-widest">
              EcoCart Official Environmental Offset Certificate
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 italic">
            Certificate of Sustainable Commerce
          </h2>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            This certifies that <strong>{order.customer.name}</strong> made an ethical purchase directly empowering Indian MSMEs and successfully funded:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 max-w-xl mx-auto">
            <div className="p-3 bg-white rounded-xl border border-eco-200 shadow-sm">
              <span className="text-2xl font-black text-eco-800 font-display">
                {order.ecoImpact.treesFunded}
              </span>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                Native Trees Planted
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-eco-200 shadow-sm">
              <span className="text-2xl font-black text-emerald-800 font-display">
                {order.ecoImpact.totalCarbonSavedKg} kg
              </span>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                CO₂ Emissions Avoided
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-eco-200 shadow-sm">
              <span className="text-2xl font-black text-amber-800 font-display">
                {order.ecoImpact.plasticAvoidedCount}
              </span>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                Plastics Diverted
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200/80 text-xs text-slate-500 gap-2 max-w-xl mx-auto">
            <span className="font-mono">Date: {new Date(order.date).toLocaleDateString()}</span>
            <span className="text-eco-800 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> +{order.ecoPointsEarned} EcoPoints Credited
            </span>
            <span className="font-mono text-[11px]">Audit: UDYAM-ECO-2026</span>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="flex items-center justify-center gap-4 mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save Certificate
          </button>
        </div>
      </div>

      {/* Order Status & Delivery Progress */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-base font-display">
          Delivery Status & Tracking
        </h3>

        {/* Step tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {[
            { step: 'Order Placed', desc: 'Received & routed to artisan', done: true },
            { step: 'Artisan Confirmed', desc: 'Crafted with natural materials', done: true },
            { step: 'Eco-Packed', desc: 'Sealed in biodegradable mailer', done: false },
            { step: 'Carbon-Neutral Transit', desc: 'Delivered by electric cargo', done: false }
          ].map((s, idx) => (
            <div key={idx} className="relative p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.done ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {s.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="font-bold text-slate-900">{s.step}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-8">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Order Details Details Breakdown */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider">Shipping Address</h4>
            <p className="text-slate-600 font-semibold">{order.customer.name}</p>
            <p className="text-slate-500">{order.customer.address}</p>
            <p className="text-slate-500">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p className="text-slate-500 font-mono">{order.customer.phone}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider">Eco Packaging & Transit</h4>
            <p className="text-slate-600 font-semibold">{order.packaging}</p>
            <p className="text-slate-500">{order.shippingMethod}</p>
            <p className="text-slate-500">Payment: <strong className="text-slate-800">{order.paymentMethod}</strong></p>
            <p className="text-eco-700 font-bold font-mono">Total Paid: ₹{order.pricing.total.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
        <button
          onClick={() => onNavigate('impact')}
          className="w-full sm:w-auto px-6 py-3 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <span>View in Green Impact Wallet</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-colors"
        >
          Continue Supporting MSMEs
        </button>
      </div>

    </div>
  );
}
