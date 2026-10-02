import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, 
  Search, 
  ChevronRight, 
  RotateCcw, 
  ExternalLink, 
  Truck, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatPrice } from '../utils/currency';
import './OrdersPage.css';

export const OrdersPage = () => {
  const { orders, addToCart, navigateTo } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const idMatch = order.orderId.toLowerCase().includes(term);
    const itemMatch = order.items.some((i) => i.title.toLowerCase().includes(term));
    return idMatch || itemMatch;
  });

  const handleBuyAgain = (item) => {
    addToCart(
      {
        id: item.id,
        title: item.title,
        price: item.price,
        imageURL: item.imageURL,
        inStock: true,
        isPrime: true,
        brand: item.brand
      },
      1
    );
  };

  return (
    <div className="orders-page-container">
      {/* Breadcrumb nav */}
      <div className="orders-breadcrumbs">
        <span onClick={() => navigateTo('home')} className="crumb-link">Your Account</span>
        <span className="crumb-sep">›</span>
        <span className="crumb-active">Your Orders</span>
      </div>

      <div className="orders-header-row">
        <h1>Your Orders</h1>
        
        {/* Search orders */}
        <div className="orders-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search all orders by product or order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="orders-tabs-row">
        <button className="order-tab active">
          Orders ({orders.length})
        </button>
        <button className="order-tab">Buy Again</button>
        <button className="order-tab">Not Yet Shipped</button>
        <button className="order-tab">Cancelled Orders</button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-empty-state">
          <Package size={48} className="empty-pkg-icon" />
          <h3>No orders found</h3>
          <p>
            {searchTerm 
              ? `We didn't find any orders matching "${searchTerm}".`
              : 'You haven’t placed any orders yet.'}
          </p>
          <button className="btn-primary" onClick={() => navigateTo('home')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-card-list">
          {filteredOrders.map((order) => (
            <article key={order.orderId} className="order-card">
              {/* Card Meta Top Bar */}
              <div className="order-card-meta-bar">
                <div className="meta-group">
                  <span className="meta-title">Order Placed</span>
                  <span className="meta-data">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="meta-group">
                  <span className="meta-title">Total</span>
                  <span className="meta-data font-bold">{formatPrice(order.totals.total)}</span>
                </div>

                <div className="meta-group">
                  <span className="meta-title">Ship To</span>
                  <span className="meta-data ship-to-name">
                    {order.shippingAddress.fullName}
                  </span>
                </div>

                <div className="meta-group order-number-group">
                  <span className="meta-title">Order # {order.orderId}</span>
                  <div className="meta-links">
                    <button 
                      className="text-link-btn"
                      onClick={() => navigateTo('confirmation', order)}
                    >
                      View order details
                    </button>
                    <span className="link-sep">|</span>
                    <button 
                      className="text-link-btn"
                      onClick={() => window.print()}
                    >
                      Invoice
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Status & Delivery Date */}
              <div className="order-card-body">
                <div className="order-status-head">
                  <div className="status-badge-row">
                    <CheckCircle2 size={20} color="#067d62" />
                    <h3>{order.status}</h3>
                  </div>
                  <span className="eta-text">
                    Estimated delivery: <strong>{order.estimatedDelivery}</strong>
                  </span>
                </div>

                {/* Items in order */}
                <div className="order-items-grid">
                  <div className="order-items-column">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-product-row">
                        <img 
                          src={item.imageURL} 
                          alt={item.title} 
                          className="order-product-thumb" 
                        />
                        <div className="order-product-info">
                          <h4 className="order-item-title">{item.title}</h4>
                          <span className="order-item-specs">Qty: {item.quantity} | {formatPrice(item.price)} each</span>
                          <button
                            className="btn-primary buy-again-btn"
                            onClick={() => handleBuyAgain(item)}
                          >
                            <RotateCcw size={14} /> Buy it again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Column */}
                  <div className="order-actions-column">
                    <button 
                      className="btn-secondary order-action-btn track-btn"
                      onClick={() => setTrackingModalOrder(order)}
                    >
                      <Truck size={16} /> Track package
                    </button>
                    <button 
                      className="btn-secondary order-action-btn"
                      onClick={() => navigateTo('home')}
                    >
                      Leave seller feedback
                    </button>
                    <button 
                      className="btn-secondary order-action-btn"
                      onClick={() => navigateTo('home')}
                    >
                      Write a product review
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Package Tracking Dialog Modal */}
      {trackingModalOrder && (
        <div className="modal-backdrop" onClick={() => setTrackingModalOrder(null)}>
          <div className="tracking-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <h3>Tracking Details - Order #{trackingModalOrder.orderId}</h3>
              <button className="close-btn" onClick={() => setTrackingModalOrder(null)}>✕</button>
            </div>
            <div className="tracking-modal-body">
              <div className="tracking-status-hero">
                <Truck size={32} color="#067d62" />
                <div>
                  <h4>{trackingModalOrder.status}</h4>
                  <p>Carrier: Amazon Logistics (TBA{Math.floor(100000000 + Math.random() * 900000000)})</p>
                  <p>Estimated Delivery: <strong>{trackingModalOrder.estimatedDelivery}</strong></p>
                </div>
              </div>
              <div className="tracking-checkpoints">
                <div className="checkpoint completed">
                  <div className="cp-dot" />
                  <div className="cp-info">
                    <strong>Package arrived at Amazon Fulfillment Center</strong>
                    <span>Local Facility • Today, 10:15 AM</span>
                  </div>
                </div>
                <div className="checkpoint active">
                  <div className="cp-dot" />
                  <div className="cp-info">
                    <strong>Order information sent to carrier</strong>
                    <span>Electronic notification generated • Today, 8:30 AM</span>
                  </div>
                </div>
                <div className="checkpoint">
                  <div className="cp-dot" />
                  <div className="cp-info">
                    <strong>Order Placed</strong>
                    <span>Verification completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
