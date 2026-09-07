import React, { useState } from 'react';
import { Filter, Search, Sparkles, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import { useProducts } from '../context/ProductContext';

export default function ShopPage({ onSelectProduct }) {
  const { 
    products, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    selectedEcoScore,
    setSelectedEcoScore,
    selectedMsmeType,
    setSelectedMsmeType,
    categories 
  } = useProducts();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategoryObj = categories.find(c => c.id === selectedCategory);
  const categoryTitle = currentCategoryObj ? currentCategoryObj.name : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-eco-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Sustainable Catalog
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display">
            {categoryTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Handcrafted with organic, upcycled, and renewable materials by local Indian MSMEs.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 shadow-sm"
          >
            <Filter className="w-4 h-4 text-eco-600" />
            <span>Filters & Categories</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(selectedCategory !== 'all' || selectedEcoScore !== 'all' || selectedMsmeType !== 'all' || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 font-medium">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-eco-50 border border-eco-200 text-eco-800 text-xs px-2.5 py-1 rounded-full font-medium">
              Category: {categoryTitle}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedEcoScore !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">
              Eco-Score: {selectedEcoScore}
              <button onClick={() => setSelectedEcoScore('all')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedMsmeType !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
              MSME: {selectedMsmeType}
              <button onClick={() => setSelectedMsmeType('all')} className="hover:text-amber-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-slate-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilter />
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No eco products matched your search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try clearing some filters or searching for terms like "bamboo", "coconut", or "organic".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedEcoScore('all');
                  setSelectedMsmeType('all');
                  setSearchQuery('');
                }}
                className="bg-eco-600 hover:bg-eco-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div>
              <div className="text-xs text-slate-500 font-medium mb-4">
                Showing <strong className="text-slate-800">{products.length}</strong> sustainable products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 font-display">Filters</h3>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilter />
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-eco-600 text-white font-bold rounded-xl text-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
