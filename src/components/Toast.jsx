import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, ShoppingCart, X, AlertTriangle, Info } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import './Toast.css';

export const Toast = () => {
  const { toast, hideToast, navigateTo, cartTotals } = useStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className={`toast-notification-banner ${toast.type || 'success'}`} role="status">
      <div className="toast-left">
        {toast.type === 'warn' ? (
          <AlertTriangle size={22} className="toast-icon warn" />
        ) : toast.type === 'info' ? (
          <Info size={22} className="toast-icon info" />
        ) : (
          <CheckCircle2 size={22} className="toast-icon success" />
        )}

        {toast.product && toast.product.imageURL && (
          <img 
            src={toast.product.imageURL} 
            alt={toast.product.title} 
            className="toast-thumb" 
          />
        )}

        <div className="toast-text-wrap">
          <span className="toast-title">{toast.message}</span>
          {toast.type === 'success' && (
            <span className="toast-sub">
              Cart subtotal ({cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}): <strong>{formatPrice(cartTotals.subtotal)}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="toast-right">
        {toast.type === 'success' && (
          <button 
            className="btn-primary toast-cart-btn"
            onClick={() => {
              hideToast();
              navigateTo('cart');
            }}
          >
            <ShoppingCart size={15} />
            <span>Go to Cart</span>
          </button>
        )}
        <button 
          className="toast-close-btn"
          onClick={hideToast}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
