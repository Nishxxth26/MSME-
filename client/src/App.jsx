import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ProductProvider, useProducts } from './context/ProductContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Notification from './components/Notification';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SellerDashboard from './pages/SellerDashboard';
import ImpactDashboard from './pages/ImpactDashboard';
import WastePickupPage from './pages/WastePickupPage';

function MainLayout() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = (order) => {
    setCompletedOrder(order);
    setActivePage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Notification />
      <AuthModal />

      <Navbar 
        activePage={activePage} 
        setActivePage={handleNavigate} 
      />

      <CartDrawer 
        onCheckout={() => handleNavigate('checkout')}
        onViewFullCart={() => handleNavigate('cart')}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage 
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage 
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage 
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'cart' && (
          <CartPage 
            onNavigate={handleNavigate}
            onCheckout={() => handleNavigate('checkout')}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage 
            onBack={() => handleNavigate('cart')}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {activePage === 'order-success' && (
          <OrderSuccessPage 
            order={completedOrder}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'seller' && (
          <SellerDashboard 
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'pickup' && (
          <WastePickupPage 
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'impact' && (
          <ImpactDashboard 
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
