import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEcoScore, setSelectedEcoScore] = useState('all');
  const [selectedMsmeType, setSelectedMsmeType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('default');

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ecocart_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-5'];
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  useEffect(() => {
    localStorage.setItem('ecocart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your eco wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to your eco wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (err) {
      console.warn('API fetch categories failed, using fallback categories', err);
      setCategories([
        { id: 'all', name: 'All Products', icon: 'Sparkles' },
        { id: 'home-living', name: 'Home & Living', icon: 'Home' },
        { id: 'personal-care', name: 'Personal Care', icon: 'Smile' },
        { id: 'kitchen-dining', name: 'Kitchen & Dining', icon: 'Coffee' },
        { id: 'fashion-accessories', name: 'Fashion & Accessories', icon: 'ShoppingBag' },
        { id: 'zero-waste', name: 'Zero Waste Stationery', icon: 'Leaf' },
        { id: 'organic-foods', name: 'Organic Pantry', icon: 'Apple' }
      ]);
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedEcoScore && selectedEcoScore !== 'all') params.append('ecoScore', selectedEcoScore);
      if (selectedMsmeType && selectedMsmeType !== 'all') params.append('msmeType', selectedMsmeType);
      if (priceRange[1] < 100) params.append('maxPrice', priceRange[1]);
      if (sortBy && sortBy !== 'default') params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      } else {
        throw new Error('Failed to load products');
      }
    } catch (err) {
      console.warn('API products fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedEcoScore, selectedMsmeType, priceRange, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // MSME Seller: Add Product
  const addProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => [data.product, ...prev]);
        showToast('New eco-product listed successfully!', 'success');
        return { success: true, product: data.product };
      } else {
        const err = await res.json();
        showToast(err.message || 'Error listing product', 'error');
        return { success: false, message: err.message };
      }
    } catch (err) {
      showToast('Network error while adding product', 'error');
      return { success: false, message: err.message };
    }
  };

  // MSME Seller: Update Product
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? data.product : p));
        showToast('Product updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast('Failed to update product', 'error');
      return { success: false };
    }
  };

  // MSME Seller: Delete Product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product removed from catalog', 'info');
        return { success: true };
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
      return { success: false };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedEcoScore,
        setSelectedEcoScore,
        selectedMsmeType,
        setSelectedMsmeType,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        wishlist,
        toggleWishlist,
        toast,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
