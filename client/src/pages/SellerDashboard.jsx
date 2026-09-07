import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Leaf, 
  TreePine, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function SellerDashboard({ onNavigate }) {
  const { products, addProduct, deleteProduct, showToast, categories } = useProducts();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'add-product'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'home-living',
    price: '',
    originalPrice: '',
    stock: 25,
    ecoScore: 'A+',
    carbonSavedKg: 2.5,
    plasticAvoided: 5,
    badge: 'Artisan Handcrafted',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    materials: 'Organic Cotton, Natural Indigo Dyes',
    description: '',
    artisanName: 'Vanya Weavers Co-op',
    artisanLocation: 'Maheshwar, MP',
    artisanMsmeReg: 'UDYAM-MP-26-004418',
    artisanStory: 'Generational weavers reviving slow handloom techniques with fair wages.'
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      showToast('Please provide product name and price', 'error');
      return;
    }

    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: parseFloat(newProd.price),
      originalPrice: newProd.originalPrice ? parseFloat(newProd.originalPrice) : parseFloat(newProd.price) * 1.25,
      stock: parseInt(newProd.stock, 10),
      ecoScore: newProd.ecoScore,
      carbonSavedKg: parseFloat(newProd.carbonSavedKg),
      plasticAvoided: parseInt(newProd.plasticAvoided, 10),
      badge: newProd.badge,
      images: [newProd.imageUrl],
      materials: newProd.materials.split(',').map(m => m.trim()),
      description: newProd.description || 'Authentic eco-friendly handicraft designed for zero-waste living.',
      artisan: {
        name: newProd.artisanName,
        location: newProd.artisanLocation,
        msmeType: 'Artisanal Producer',
        msmeRegNo: newProd.artisanMsmeReg,
        verifiedMsme: true,
        story: newProd.artisanStory
      },
      certifications: ['Fair Trade', '100% Biodegradable', 'Zero Plastic']
    };

    const res = await addProduct(payload);
    if (res.success) {
      setIsAddModalOpen(false);
      // Reset
      setNewProd({
        name: '',
        category: 'home-living',
        price: '',
        originalPrice: '',
        stock: 25,
        ecoScore: 'A+',
        carbonSavedKg: 2.5,
        plasticAvoided: 5,
        badge: 'Artisan Handcrafted',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        materials: 'Organic Cotton, Natural Indigo Dyes',
        description: '',
        artisanName: 'Vanya Weavers Co-op',
        artisanLocation: 'Maheshwar, MP',
        artisanMsmeReg: 'UDYAM-MP-26-004418',
        artisanStory: 'Generational weavers reviving slow handloom techniques with fair wages.'
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
        fetchOrders();
      }
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const totalCarbonOffsetByCatalog = products.reduce((sum, p) => sum + (p.carbonSavedKg || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" /> MSME Vendor & Artisan Portal
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight">
            Artisan Workshop Management
          </h1>
          <p className="text-xs text-amber-100/80 max-w-xl">
            Manage your sustainable product catalog, track incoming customer orders, and monitor your direct environmental impact.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>List New Eco Product</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Orders Fulfilled</span>
            <Package className="w-4 h-4 text-eco-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {orders.length}
          </div>
          <p className="text-[11px] text-eco-700 font-semibold">Verified MSME sales</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Sales Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Direct to producer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Eco Catalog</span>
            <Leaf className="w-4 h-4 text-eco-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {products.length} Products
          </div>
          <p className="text-[11px] text-eco-700 font-semibold">100% sustainable materials</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Avg Carbon Offset</span>
            <TreePine className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {(totalCarbonOffsetByCatalog / (products.length || 1)).toFixed(1)} kg / item
          </div>
          <p className="text-[11px] text-teal-700 font-semibold">Certified life-cycle saving</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'border-b-2 border-eco-600 text-eco-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Product Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-b-2 border-eco-600 text-eco-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: Product Inventory */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Eco-Score</th>
                  <th className="p-4">CO₂ Offset</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.artisan?.name || 'Local Maker'}</p>
                      </div>
                    </td>

                    <td className="p-4 capitalize text-slate-600 font-medium">
                      {p.category.replace('-', ' ')}
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-900">
                      ${p.price.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                        p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.ecoScore}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-eco-700 font-bold">
                      -{p.carbonSavedKg} kg
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Total Paid</th>
                  <th className="p-4">Packaging & Shipping</th>
                  <th className="p-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold font-mono text-slate-900">{o.id}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(o.date).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{o.customer?.name}</p>
                      <p className="text-[10px] text-slate-400">{o.customer?.city}, {o.customer?.state}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800">
                        {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {o.items?.map(i => i.name).join(', ')}
                      </p>
                    </td>

                    <td className="p-4 font-mono font-bold text-eco-800">
                      ${o.pricing?.total.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-slate-700 text-[11px]">{o.packaging}</p>
                      <p className="text-[10px] text-eco-700">{o.shippingMethod}</p>
                    </td>

                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-eco-500"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Artisan Confirmed">Artisan Confirmed</option>
                        <option value="Eco-Packed & Dispatched">Eco-Packed & Dispatched</option>
                        <option value="In Carbon-Neutral Transit">In Carbon-Neutral Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add New Eco Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">List New Sustainable Product</h3>
                <p className="text-xs text-slate-500">Provide product details and environmental credentials</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handwoven Hemp Crossbody Bag"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eco-Score Rating</label>
                  <select
                    value={newProd.ecoScore}
                    onChange={(e) => setNewProd({ ...newProd, ecoScore: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  >
                    <option value="A+">A+ (Zero Carbon, 100% Compostable)</option>
                    <option value="A">A (Organic & Recycled Materials)</option>
                    <option value="B">B (Low Environmental Footprint)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="24.50"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="32.00"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carbon Saved (kg CO₂)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProd.carbonSavedKg}
                    onChange={(e) => setNewProd({ ...newProd, carbonSavedKg: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plastics Avoided</label>
                  <input
                    type="number"
                    value={newProd.plasticAvoided}
                    onChange={(e) => setNewProd({ ...newProd, plasticAvoided: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProd.imageUrl}
                    onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Sustainable Materials (Comma separated)</label>
                  <input
                    type="text"
                    value={newProd.materials}
                    onChange={(e) => setNewProd({ ...newProd, materials: e.target.value })}
                    placeholder="Pure Himalayan Hemp, Organic Cotton, Brass Zippers"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Description & Craft Story</label>
                  <textarea
                    rows="3"
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    placeholder="Share how this product is handcrafted and its eco advantages..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-eco-600 hover:bg-eco-700 text-white font-bold rounded-xl shadow-md"
                >
                  Publish to Eco Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
