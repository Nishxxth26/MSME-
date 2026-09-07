import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  Store, 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    loginAsDemo, 
    register 
  } = useAuth();

  const { showToast } = useProducts();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('customer');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer', // 'customer' | 'seller'
    enterpriseName: '',
    msmeRegNo: '',
    city: '',
    state: ''
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      showToast('Please enter your email', 'error');
      return;
    }
    const res = login(loginEmail, loginPassword, loginRole);
    showToast(`Welcome back, ${res.user.name}!`, 'success');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email) {
      showToast('Please fill in required fields', 'error');
      return;
    }
    const res = register(regData);
    showToast(
      regData.role === 'seller'
        ? `Artisan Workshop "${regData.enterpriseName || regData.name}" onboarded!`
        : `Welcome to EcoCart, ${res.user.name}! +50 EcoPoints bonus credited!`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 relative animate-fade-in">
        
        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-eco-900 via-eco-800 to-slate-900 text-white p-6 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-2 text-emerald-300 border border-white/15">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black font-display tracking-tight">
            Eco<span className="text-eco-300">Cart</span> Authentication
          </h3>
          <p className="text-xs text-eco-200 mt-0.5">
            Support rural artisans & track verified carbon offsets
          </p>
        </div>

        {/* Tabs: Sign In / Register */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setAuthModalTab('login')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalTab === 'login'
                ? 'border-eco-600 text-eco-800 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModalTab('register')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalTab === 'register'
                ? 'border-eco-600 text-eco-800 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* 1-Click Quick Demo Sign-In Box */}
          <div className="bg-gradient-to-br from-eco-50/70 to-amber-50/70 p-3.5 rounded-2xl border border-eco-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Instant Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  loginAsDemo('customer');
                  showToast('Logged in as Eco Shopper (Ananya Sharma)', 'success');
                }}
                className="p-2.5 bg-white hover:bg-eco-100/50 border border-eco-200 rounded-xl text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-eco-600" />
                  <span>Eco Shopper</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Ananya (140 pts)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemo('seller');
                  showToast('Logged in as MSME Artisan (Meera Pillai, Prakriti Naturals)', 'success');
                }}
                className="p-2.5 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-xl text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>MSME Artisan</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Prakriti Naturals</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Or with credentials
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              {/* Role Toggle */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRole('customer')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      loginRole === 'customer'
                        ? 'border-eco-600 bg-eco-50 text-eco-900 ring-1 ring-eco-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('seller')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      loginRole === 'seller'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    MSME Artisan
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl shadow-md transition-all text-xs mt-2"
              >
                Sign In to EcoCart
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Register As</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegData({ ...regData, role: 'customer' })}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      regData.role === 'customer'
                        ? 'border-eco-600 bg-eco-50 text-eco-900 ring-1 ring-eco-500'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Eco Shopper (+50 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegData({ ...regData, role: 'seller' })}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      regData.role === 'seller'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    MSME Maker / Artisan
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Krishnan"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="maya@example.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                />
              </div>

              {/* Seller Extra Fields */}
              {regData.role === 'seller' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enterprise / Workshop Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahyadri Clay Crafts"
                      value={regData.enterpriseName}
                      onChange={(e) => setRegData({ ...regData, enterpriseName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Udyam MSME Reg No (Optional)</label>
                    <input
                      type="text"
                      placeholder="UDYAM-MH-12-008910"
                      value={regData.msmeRegNo}
                      onChange={(e) => setRegData({ ...regData, msmeRegNo: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl shadow-md transition-all text-xs mt-3 flex items-center justify-center gap-1.5"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Guarantee stamp */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-eco-600" />
            <span>Encrypted Eco Identity • Zero Data Sharing</span>
          </div>

        </div>

      </div>
    </div>
  );
}
