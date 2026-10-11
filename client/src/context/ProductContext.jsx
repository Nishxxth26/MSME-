import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../data/defaultProducts';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ecocart_catalog_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEcoScore, setSelectedEcoScore] = useState('all');
  const [selectedMsmeType, setSelectedMsmeType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1500]);
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
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  // Filter fallback products locally
  const filterLocalProducts = useCallback(() => {
    const saved = localStorage.getItem('ecocart_catalog_products');
    let source = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    let filtered = [...source];

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.artisan && p.artisan.name.toLowerCase().includes(q)) ||
        (p.artisan && p.artisan.location.toLowerCase().includes(q))
      );
    }

    if (selectedEcoScore && selectedEcoScore !== 'all') {
      filtered = filtered.filter(p => p.ecoScore === selectedEcoScore);
    }

    if (selectedMsmeType && selectedMsmeType !== 'all') {
      filtered = filtered.filter(p =>
        p.artisan && p.artisan.msmeType.toLowerCase().includes(selectedMsmeType.toLowerCase())
      );
    }

    if (priceRange[1] < 1500) {
      filtered = filtered.filter(p => p.price <= priceRange[1]);
    }

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'eco') {
      filtered.sort((a, b) => (b.carbonSavedKg || 0) - (a.carbonSavedKg || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setProducts(filtered);
  }, [selectedCategory, searchQuery, selectedEcoScore, selectedMsmeType, priceRange, sortBy]);

  // Fetch products from API or fallback locally
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedEcoScore && selectedEcoScore !== 'all') params.append('ecoScore', selectedEcoScore);
      if (selectedMsmeType && selectedMsmeType !== 'all') params.append('msmeType', selectedMsmeType);
      if (priceRange[1] < 1500) params.append('maxPrice', priceRange[1]);
      if (sortBy && sortBy !== 'default') params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      } else {
        filterLocalProducts();
      }
    } catch (err) {
      filterLocalProducts();
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedEcoScore, selectedMsmeType, priceRange, sortBy, filterLocalProducts]);

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
      }
    } catch (err) {
      // Offline fallback: save locally
      const newProd = {
        ...productData,
        id: 'prod-' + Date.now(),
        rating: 5.0,
        reviewsCount: 1,
        images: productData.images || ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80']
      };
      setProducts(prev => {
        const updated = [newProd, ...prev];
        localStorage.setItem('ecocart_catalog_products', JSON.stringify(updated));
        return updated;
      });
      showToast('New eco-product listed successfully!', 'success');
      return { success: true, product: newProd };
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
      setProducts(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, ...updatedData } : p);
        localStorage.setItem('ecocart_catalog_products', JSON.stringify(updated));
        return updated;
      });
      showToast('Product updated successfully!', 'success');
      return { success: true };
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
      setProducts(prev => {
        const updated = prev.filter(p => p.id !== id);
        localStorage.setItem('ecocart_catalog_products', JSON.stringify(updated));
        return updated;
      });
      showToast('Product removed from catalog', 'info');
      return { success: true };
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
