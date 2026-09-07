import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Leaf, 
  TreePine, 
  ShieldCheck, 
  MapPin, 
  Star, 
  ShoppingCart, 
  Check, 
  Heart, 
  Sparkles, 
  Package, 
  RotateCcw,
  Truck,
  Award,
  Plus,
  Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ product, onBack, onSelectProduct }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { wishlist, toggleWishlist, showToast, products } = useProducts();

  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Review form states
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Pooja Verma',
      rating: 5,
      date: '3 days ago',
      comment: 'Absolutely in love with the artisanal quality! Smells heavenly and you can feel the love put in by the maker.',
      verified: true
    },
    {
      id: 2,
      author: 'Arjun Nair',
      rating: 5,
      date: '1 week ago',
      comment: 'Super fast carbon-neutral delivery and zero plastic in the packaging. Will definitely buy again from this MSME!',
      verified: true
    }
  ]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    showToast(`Added ${quantity} x "${product.name.slice(0, 20)}..." to your cart!`, 'success');
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    showToast('Thank you for supporting this MSME with your review!', 'success');
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-eco-700 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Images Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Eco Badge */}
            <div className="absolute top-4 left-4">
              <span className="text-xs font-black tracking-wider px-3 py-1 bg-emerald-600 text-white rounded-full shadow-lg font-mono flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> Eco-Score {product.ecoScore}
              </span>
            </div>
          </div>

          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-eco-600 ring-2 ring-eco-500/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Artisan Tag */}
            {product.artisan && (
              <div className="flex items-center gap-2 text-xs font-semibold text-eco-700 mb-2">
                <ShieldCheck className="w-4 h-4 text-eco-600" />
                <span>Crafted by {product.artisan.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 flex items-center gap-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {product.artisan.location}
                </span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display leading-tight">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-display">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-eco-700 font-semibold mt-0.5">
                Direct artisan price • Taxes included
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              In Stock ({product.stock} units)
            </span>
          </div>

          {/* Eco Impact Highlights Card */}
          <div className="bg-gradient-to-br from-eco-50 via-emerald-50/50 to-teal-50 p-4 rounded-2xl border border-eco-200 space-y-2">
            <h4 className="text-xs font-bold text-eco-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-eco-600" /> Sustainability Profile
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-eco-100">
                <span className="text-[10px] text-slate-500 font-medium block">Carbon Saved</span>
                <span className="font-extrabold text-eco-800 font-mono text-sm">
                  🌿 -{(product.carbonSavedKg * quantity).toFixed(1)} kg CO₂
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-eco-100">
                <span className="text-[10px] text-slate-500 font-medium block">Plastic Avoided</span>
                <span className="font-extrabold text-emerald-800 font-mono text-sm">
                  🌊 {product.plasticAvoided * quantity} Single-Use Bottles
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Product Overview
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Materials */}
          {product.materials && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ethical Materials & Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 50, quantity + 1))}
                  className="p-3 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-eco-600 hover:bg-eco-700 text-white shadow-eco-600/30 hover:scale-[1.01]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to EcoCart • ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                setIsCartOpen(true);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-eco-800 bg-eco-50 hover:bg-eco-100 border border-eco-200 transition-colors"
            >
              Buy Now & Open Cart Drawer
            </button>
          </div>

          {/* Delivery & Assurance Notes */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-eco-600" />
              <span>Carbon-Neutral Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-eco-600" />
              <span>Zero-Plastic Mailer</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-eco-600" />
              <span>7-Day Artisan Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-eco-600" />
              <span>Funds 1 Tree Planted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Maker Artisan Section */}
      {product.artisan && (
        <section className="bg-gradient-to-r from-earth-50 via-white to-amber-50/50 rounded-3xl p-8 border border-earth-200 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified MSME Producer
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-display">
              About {product.artisan.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.artisan.story}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
              <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
                Founder: <strong>{product.artisan.founder}</strong>
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
                Region: <strong>{product.artisan.location}</strong>
              </span>
              <span className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800">
                Udyam MSME: <strong>{product.artisan.msmeRegNo}</strong>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews & Feedback Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-display">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-slate-500">Real feedback from verified sustainable shoppers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200/60">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 h-fit space-y-4">
            <h4 className="text-sm font-bold text-slate-900 font-display">Write an Eco-Review</h4>
            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review</label>
                <textarea
                  required
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How does this sustainable item feel and perform?"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-eco-600 hover:bg-eco-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Sustainable Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-6 border-t border-slate-200 space-y-6">
          <h3 className="text-2xl font-black text-slate-900 font-display">
            More Sustainable Finds You'll Love
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
