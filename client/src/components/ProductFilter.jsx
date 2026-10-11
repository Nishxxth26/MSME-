import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Leaf, 
  Sparkles, 
  Home, 
  Smile, 
  Coffee, 
  ShoppingBag, 
  Apple 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function ProductFilter() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedEcoScore,
    setSelectedEcoScore,
    selectedMsmeType,
    setSelectedMsmeType,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy
  } = useProducts();

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedEcoScore('all');
    setSelectedMsmeType('all');
    setPriceRange([0, 100]);
    setSortBy('default');
  };

  const isFiltered = 
    selectedCategory !== 'all' || 
    selectedEcoScore !== 'all' || 
    selectedMsmeType !== 'all' || 
    priceRange[1] < 100 || 
    sortBy !== 'default';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 font-display">
          <Filter className="w-4 h-4 text-eco-600" />
          <span>Filter Eco Catalog</span>
        </div>
        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-eco-700 hover:text-eco-900 font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
          Categories
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                selectedCategory === cat.id
                  ? 'bg-eco-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eco-Score Rating */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-eco-600" /> Eco-Score
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
          {['all', 'A+', 'A', 'B'].map((score) => (
            <button
              key={score}
              onClick={() => setSelectedEcoScore(score)}
              className={`py-1.5 rounded-lg border text-center transition-all ${
                selectedEcoScore === score
                  ? 'bg-eco-100 border-eco-500 text-eco-900 font-bold ring-1 ring-eco-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {score === 'all' ? 'All' : score}
            </button>
          ))}
        </div>
      </div>

      {/* MSME Enterprise Type */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
          MSME Producer Type
        </label>
        <select
          value={selectedMsmeType}
          onChange={(e) => setSelectedMsmeType(e.target.value)}
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 text-slate-700"
        >
          <option value="all">All MSME Producers</option>
          <option value="women">Women-Led Enterprises</option>
          <option value="handmade">Handmade Eco Collectives</option>
          <option value="circular">Circular & Upcycled Startups</option>
          <option value="organic">Organic Farmer Co-ops</option>
          <option value="tribal">Tribal & Indigenous Unions</option>
        </select>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
          <span className="uppercase tracking-wider">Max Price</span>
          <span className="text-eco-800 font-mono text-sm font-extrabold">
            ₹{priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="1500"
          step="50"
          value={priceRange[1] > 1500 ? 1500 : (priceRange[1] < 200 ? 200 : priceRange[1])}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
          className="w-full accent-eco-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
          <span>₹200</span>
          <span>₹1,500</span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Sort Catalog
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 text-slate-700"
        >
          <option value="default">Featured Eco Picks</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="eco">Highest Carbon Saved (CO₂)</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>
    </div>
  );
}
