import React, { useState } from 'react';
import { 
  Leaf, 
  ShoppingCart, 
  Search, 
  Store, 
  User, 
  Coins, 
  Heart, 
  Menu, 
  X,
  Sparkles,
  TreePine,
  ArrowRight,
  LogOut,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function Navbar({ activePage, setActivePage }) {
  const { itemCount, setIsCartOpen, total } = useCart();
  const { 
    role, 
    toggleRole, 
    user, 
    isAuthenticated, 
    logout, 
    openLoginModal 
  } = useAuth();
  const { searchQuery, setSearchQuery, wishlist } = useProducts();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-eco-100 shadow-sm transition-all">
      {/* Top Eco Announcement Bar */}
      <div className="bg-gradient-to-r from-eco-800 via-eco-700 to-eco-800 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-eco-600/60 px-2 py-0.5 rounded-full text-[11px] font-medium border border-eco-400/30">
              <TreePine className="w-3 h-3 text-eco-200" /> MSME Earth Pledge
            </span>
            <span className="hidden sm:inline text-eco-100">
              Every purchase funds 1 tree planting & directly empowers rural artisans across India
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline text-eco-200 font-mono">Use code <strong className="text-white underline">ECO10</strong> for 10% off</span>
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-amber-200">{user?.ecoPoints || 0}</span>
              <span className="text-[11px] text-eco-200">EcoPoints</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center text-white shadow-md shadow-eco-600/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                  Eco<span className="text-eco-600">Cart</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-200">
                  MSME
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-1 hidden sm:block">
                Artisanal • Sustainable • Direct
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search eco candles, bamboo items, handloom..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'shop') setActivePage('shop');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 bg-slate-200 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'home'
                  ? 'text-eco-700 bg-eco-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'shop'
                  ? 'text-eco-700 bg-eco-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Shop Catalog
            </button>
            <button
              onClick={() => handleNavClick('impact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activePage === 'impact'
                  ? 'text-eco-700 bg-eco-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-eco-500" />
              Green Impact
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* MSME Role Switcher */}
            <button
              onClick={() => {
                toggleRole();
                if (role === 'customer') {
                  setActivePage('seller');
                } else {
                  setActivePage('shop');
                }
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
                role === 'seller'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-eco-50 text-eco-800 border-eco-200 hover:bg-eco-100'
              }`}
              title="Switch between Customer and MSME Artisan Seller mode"
            >
              <Store className="w-4 h-4" />
              <span>{role === 'seller' ? 'Seller Mode Active' : 'MSME Mode'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('impact')}
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Eco Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-eco-600 hover:bg-eco-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-eco-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-amber-400 text-slate-900 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                ${total.toFixed(2)}
              </span>
            </button>

            {/* User Account / Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-eco-500"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[90px]">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-eco-700 font-semibold leading-tight capitalize">{role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Account Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1 text-xs">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-eco-800 font-semibold">🌱 {user.ecoPoints} pts</span>
                        <span className="text-amber-800 font-mono text-[10px] uppercase font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                          {role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('impact')}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-eco-50 hover:text-eco-800 font-medium flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-eco-600" />
                      <span>Green Impact Wallet</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('seller')}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800 font-medium flex items-center gap-2"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      <span>MSME Seller Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleRole();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Switch to {role === 'customer' ? 'Artisan' : 'Shopper'} View</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('login')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                <User className="w-4 h-4 text-eco-300" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search eco products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'shop') setActivePage('shop');
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'home' ? 'bg-eco-50 text-eco-700 font-semibold' : 'text-slate-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'shop' ? 'bg-eco-50 text-eco-700 font-semibold' : 'text-slate-600'
              }`}
            >
              Shop Catalog
            </button>
            <button
              onClick={() => handleNavClick('impact')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'impact' ? 'bg-eco-50 text-eco-700 font-semibold' : 'text-slate-600'
              }`}
            >
              Green Impact & Wallet
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal('login');
                }}
                className="w-full py-2.5 mt-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-eco-300" />
                <span>Sign In / Create Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.name})</span>
              </button>
            )}

            <button
              onClick={() => {
                toggleRole();
                handleNavClick(role === 'customer' ? 'seller' : 'shop');
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-between mt-2"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-700" />
                {role === 'seller' ? 'Switch to Shopper View' : 'Switch to MSME Seller Portal'}
              </span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
