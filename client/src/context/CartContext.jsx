import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('ecocart_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'prod-1',
        name: 'Hand-Carved Coconut Shell Candle (Lavender & Cedar)',
        price: 18.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
        carbonSavedKg: 3.2,
        plasticAvoided: 4,
        artisan: 'Prakriti Naturals',
        stock: 35
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [packaging, setPackaging] = useState('biodegradable'); // 'biodegradable' | 'zero-waste'
  const [shippingMethod, setShippingMethod] = useState('ev-courier'); // 'ev-courier' | 'standard'
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ecocart_items', JSON.stringify(items));
  }, [items]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images ? product.images[0] : product.image,
            carbonSavedKg: product.carbonSavedKg || 1.5,
            plasticAvoided: product.plasticAvoided || 3,
            artisan: product.artisan ? product.artisan.name : 'MSME Maker',
            stock: product.stock || 50
          }
        ];
      }
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(newQuantity, item.stock || 99) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setPointsToRedeem(0);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const totalCarbonSavedKg = parseFloat(
    items.reduce((sum, item) => sum + ((item.carbonSavedKg || 0) * item.quantity), 0).toFixed(1)
  );

  const totalPlasticAvoided = items.reduce(
    (sum, item) => sum + ((item.plasticAvoided || 0) * item.quantity),
    0
  );

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= (appliedCoupon.minAmount || 0)) {
    couponDiscount = (subtotal * (appliedCoupon.discountPercent / 100));
  }

  // EcoPoints discount: ₹50 off per 100 points (₹0.50 per point)
  const pointsDiscount = Math.min(pointsToRedeem * 0.50, Math.max(0, subtotal - couponDiscount));

  const totalDiscount = couponDiscount + pointsDiscount;

  // Packaging fee: ₹49 for Biodegradable Box, ₹0 for Zero-Waste
  const packagingFee = packaging === 'biodegradable' ? 49 : 0;

  // Free shipping threshold = ₹999
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 60;

  const total = Math.max(0, subtotal - totalDiscount + packagingFee + (subtotal > 0 ? shippingFee : 0));

  const treesFunded = subtotal > 0 ? Math.max(1, Math.floor(total / 800)) : 0;

  // Progress to free shipping & tree incentive
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        packaging,
        setPackaging,
        shippingMethod,
        setShippingMethod,
        appliedCoupon,
        setAppliedCoupon,
        pointsToRedeem,
        setPointsToRedeem,
        itemCount,
        subtotal,
        couponDiscount,
        pointsDiscount,
        totalDiscount,
        packagingFee,
        shippingFee,
        total,
        totalCarbonSavedKg,
        totalPlasticAvoided,
        treesFunded,
        freeShippingThreshold,
        progressToFreeShipping,
        amountNeededForFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
