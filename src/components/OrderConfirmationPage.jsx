import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle, 
  Check, 
  Copy, 
  Package, 
  Truck, 
  Clock, 
  ArrowRight, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../utils/currency';
import './OrderConfirmationPage.css';

export const OrderConfirmationPage = () => {
  const { confirmedOrder, navigateTo, userSession } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch (e) {
      console.warn('Confetti effect failed', e);
    }
  }, []);

  if (!confirmedOrder) {
    return (
      <div className="confirmation-fallback">
        <h2>No recent order found</h2>
        <button className="btn-primary" onClick={() => navigateTo('home')}>
          Return to Store
        </button>
      </div>
    );
  }

  const order = confirmedOrder;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="confirmation-page-container">
      {/* Top Success Banner */}
      <div className="confirmation-success-banner">
        <div className="banner-left">
          <CheckCircle size={36} className="success-icon" />
          <div className="banner-titles">
            <h1>Order placed, thanks!</h1>
            <p>
              Confirmation will be sent to <strong>{userSession.email}</strong>.
            </p>
          </div>
        </div>

        <div className="banner-actions">
          <button 
            className="btn-secondary view-orders-cta"
            onClick={() => navigateTo('orders')}
          >
            <Package size={16} /> View Your Orders
          </button>
          <button 
            className="btn-primary continue-cta"
            onClick={() => navigateTo('home')}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="confirmation-grid">
        {/* Main Details Panel */}
        <div className="confirmation-main-card">
          {/* Order Header / Identifier */}
          <div className="order-id-header">
            <div className="order-id-block">
              <span className="order-label">Order #</span>
              <span className="order-id-code">{order.orderId}</span>
              <button 
                className="copy-btn" 
                onClick={handleCopyOrderId}
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copied ? <Check size={14} color="#067d62" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <span className="order-date-text">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Delivery Tracker */}
          <div className="delivery-tracker-box">
            <div className="tracker-top">
              <div className="tracker-eta">
                <Truck size={24} className="truck-accent" />
                <div>
                  <h3>Guaranteed Delivery: {order.estimatedDelivery}</h3>
                  <span className="delivery-status-tag">{order.status}</span>
                </div>
              </div>
            </div>

            {/* Visual Shipment Timeline */}
            <div className="shipment-timeline">
              <div className="timeline-step completed">
                <div className="timeline-node">
                  <Check size={12} />
                </div>
                <span className="timeline-label">Ordered</span>
              </div>
              <div className="timeline-bar active-bar" />
              <div className="timeline-step in-progress">
                <div className="timeline-node pulsing" />
                <span className="timeline-label">Preparing</span>
              </div>
              <div className="timeline-bar" />
              <div className="timeline-step">
                <div className="timeline-node" />
                <span className="timeline-label">Shipped</span>
              </div>
              <div className="timeline-bar" />
              <div className="timeline-step">
                <div className="timeline-node" />
                <span className="timeline-label">Out for Delivery</span>
              </div>
              <div className="timeline-bar" />
              <div className="timeline-step">
                <div className="timeline-node" />
                <span className="timeline-label">Delivered</span>
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="confirmed-items-section">
            <h3>Items in this shipment ({order.items.length})</h3>
            <div className="confirmed-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="confirmed-item-row">
                  <img src={item.imageURL} alt={item.title} className="confirmed-item-img" />
                  <div className="confirmed-item-meta">
                    <h4>{item.title}</h4>
                    {item.brand && <span className="item-brand">{item.brand}</span>}
                    <div className="item-price-qty">
                      <strong>{formatPrice(item.price)}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="confirmed-item-subtotal">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <aside className="confirmation-aside">
          {/* Shipping Address Recap */}
          <div className="aside-card">
            <h4>Shipping Address</h4>
            <div className="address-snippet">
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.address} {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method Recap */}
          <div className="aside-card">
            <h4>Payment Method</h4>
            <div className="payment-snippet">
              <p><strong>{order.paymentMethod.cardBrand}</strong> ending in {order.paymentMethod.cardLast4}</p>
              <span className="billing-status">Billing address same as shipping</span>
            </div>
          </div>

          {/* Order Totals Breakdown */}
          <div className="aside-card totals-card">
            <h4>Order Summary</h4>
            <div className="summary-breakdown">
              <div className="breakdown-row">
                <span>Items ({order.totals.itemCount}):</span>
                <span>{formatPrice(order.totals.subtotal)}</span>
              </div>
              <div className="breakdown-row">
                <span>Shipping & Handling:</span>
                <span>{order.totals.shipping === 0 ? 'FREE' : formatPrice(order.totals.shipping)}</span>
              </div>
              <div className="breakdown-row">
                <span>Total Before Tax:</span>
                <span>{formatPrice(order.totals.subtotal + order.totals.shipping)}</span>
              </div>
              <div className="breakdown-row">
                <span>Estimated GST (18%):</span>
                <span>{formatPrice(order.totals.tax)}</span>
              </div>
              <div className="summary-divider" />
              <div className="breakdown-total">
                <span>Grand Total:</span>
                <span>{formatPrice(order.totals.total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
