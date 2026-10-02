import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { OrdersPage } from './components/OrdersPage';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import './App.css';

const AppContent = () => {
  const { currentView, selectedProduct } = useStore();

  // If in checkout flow, display dedicated streamlined checkout view
  if (currentView === 'checkout') {
    return (
      <main className="app-shell checkout-mode">
        <CheckoutPage />
        <Toast />
      </main>
    );
  }

  return (
    <div className="app-shell">
      {/* Universal Amazon Navigation */}
      <Header />
      <SubNav />

      {/* Main View Router */}
      <main className="app-main-content">
        {currentView === 'home' && (
          <>
            <HeroBanner />
            <ProductGrid />
          </>
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage product={selectedProduct} />
        )}

        {currentView === 'cart' && (
          <CartPage />
        )}

        {currentView === 'confirmation' && (
          <OrderConfirmationPage />
        )}

        {currentView === 'orders' && (
          <OrdersPage />
        )}
      </main>

      {/* Quick View Dialog Modal */}
      <ProductModal />

      {/* Slide-in Notifications */}
      <Toast />

      {/* Multi-tier Amazon Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
