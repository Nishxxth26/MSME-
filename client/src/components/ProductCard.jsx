import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Check, 
  Star, 
  Leaf, 
  ShieldCheck, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, showToast } = useProducts();
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    showToast(`Added "${product.name.slice(0, 24)}..." to cart!`, 'success');
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Eco Score Badge styles
  const getEcoScoreColor = (score) => {
    switch (score) {
      case 'A+': return 'bg-emerald-600 text-white';
      case 'A': return 'bg-eco-600 text-white';
      case 'B': return 'bg-amber-600 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-eco-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title="Save to Eco Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Eco Score Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className={`text-[11px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 font-mono ${getEcoScoreColor(product.ecoScore)}`}>
            <Leaf className="w-3 h-3" /> Eco {product.ecoScore}
          </span>
          {product.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Carbon Offset Floating Chip */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/95 backdrop-blur-md text-eco-800 px-2.5 py-1 rounded-full shadow-sm border border-eco-100">
            <Sparkles className="w-3 h-3 text-eco-600" /> -{product.carbonSavedKg} kg CO₂
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 backdrop-blur-md px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan & Location Line */}
          {product.artisan && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="font-semibold text-eco-700 flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-eco-600 flex-shrink-0" />
                {product.artisan.name}
              </span>
              <span className="text-slate-400 flex items-center gap-0.5 truncate max-w-[120px]">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {product.artisan.location}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-eco-700 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Rating & Eco Attributes */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-900 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewsCount} reviews)</span>
          </div>

          {/* Materials Tag Preview */}
          {product.materials && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.materials.slice(0, 2).map((mat, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                  {mat}
                </span>
              ))}
              {product.materials.length > 2 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{product.materials.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 font-display">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-eco-700 font-medium block">
              Direct MSME Price
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-eco-50 hover:bg-eco-600 text-eco-800 hover:text-white border border-eco-200 hover:border-eco-600'
            }`}
            title="Add to Shopping Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
