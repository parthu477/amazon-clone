import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import './ProductModal.css';

export const ProductModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo } = useStore();
  const [selectedQty, setSelectedQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedQty);
    setTimeout(() => {
      setIsAdding(false);
      setQuickViewProduct(null);
    }, 600);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQty, false);
    setQuickViewProduct(null);
    navigateTo('checkout');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i < Math.floor(rating) ? '#de7921' : 'none'}
          color={i < Math.floor(rating) ? '#de7921' : '#d5d9d9'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        <button 
          className="modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close dialog"
        >
          <X size={22} />
        </button>

        <div className="modal-body">
          {/* Product Image Gallery */}
          <div className="modal-gallery">
            <div className="modal-main-image-wrap">
              <img 
                src={product.imageURL} 
                alt={product.title} 
                className="modal-main-img" 
              />
            </div>
            {product.badge && (
              <span className="modal-badge">{product.badge}</span>
            )}
          </div>

          {/* Product Details */}
          <div className="modal-details">
            {product.brand && <div className="modal-brand">{product.brand}</div>}
            
            <h2 id="modal-product-title" className="modal-title">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="modal-rating-row">
              <div className="modal-stars">{renderStars(product.rating)}</div>
              <span className="modal-rating-num">{product.rating} out of 5</span>
              <span className="modal-rating-count">{product.reviewCount.toLocaleString()} ratings</span>
            </div>

            <div className="modal-divider" />

            {/* Price */}
            <div className="modal-price-box">
              <div className="modal-price">
                <span className="modal-currency">₹</span>
                <span className="modal-amount">{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="modal-discount-info">
                  <span className="modal-list-price">List: {formatPrice(product.originalPrice)}</span>
                  <span className="modal-save-tag">
                    Save {formatPrice(product.originalPrice - product.price)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                </div>
              )}
            </div>

            {/* Prime & Delivery */}
            {product.isPrime && (
              <div className="modal-prime-row">
                <span className="badge-prime">Prime</span>
                <span>FREE One-Day Delivery. Order within 4 hrs 12 mins.</span>
              </div>
            )}

            {/* Description */}
            <p className="modal-desc">{product.description}</p>

            {/* Key Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="modal-features">
                <h4>About this item:</h4>
                <ul>
                  {product.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assurance badges */}
            <div className="modal-assurances">
              <div className="assurance-item">
                <Truck size={20} className="assurance-icon" />
                <span>Free Delivery</span>
              </div>
              <div className="assurance-item">
                <RefreshCw size={20} className="assurance-icon" />
                <span>30 days Returnable</span>
              </div>
              <div className="assurance-item">
                <ShieldCheck size={20} className="assurance-icon" />
                <span>Secure Transaction</span>
              </div>
            </div>
          </div>

          {/* Buy Box Panel */}
          <div className="modal-buybox">
            <div className="buybox-price">{formatPrice(product.price)}</div>
            
            <div className="buybox-delivery">
              FREE delivery <strong>Tomorrow</strong>. Order within 5 hrs.
            </div>

            <div className="buybox-stock">
              {product.inStock ? (
                <span className="in-stock"><Check size={16} /> In Stock</span>
              ) : (
                <span className="out-of-stock">Currently unavailable</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="buybox-quantity">
                <label htmlFor="modal-qty">Quantity:</label>
                <select 
                  id="modal-qty"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Number(e.target.value))}
                >
                  {[...Array(Math.min(10, product.stockCount || 10)).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="buybox-buttons">
              <button
                className={`btn-primary buybox-cart-btn ${isAdding ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart size={17} />
                <span>{isAdding ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                className="btn-orange buybox-now-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>

            <div className="buybox-meta">
              <div className="meta-line">
                <span className="meta-label">Ships from</span>
                <span className="meta-val">Amazon.com</span>
              </div>
              <div className="meta-line">
                <span className="meta-label">Sold by</span>
                <span className="meta-val">{product.brand || 'Amazon.com'}</span>
              </div>
              <div className="meta-line">
                <span className="meta-label">Returns</span>
                <span className="meta-val">Eligible for Return or Refund</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
