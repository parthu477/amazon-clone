import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Check, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  MapPin, 
  Lock 
} from 'lucide-react';
import { formatPrice } from '../utils/currency';
import './ProductDetailPage.css';

export const ProductDetailPage = ({ product }) => {
  const { addToCart, navigateTo, userSession } = useStore();
  const [selectedQty, setSelectedQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="product-not-found">
        <p>Product not found.</p>
        <button className="btn-secondary" onClick={() => navigateTo('home')}>
          Return to home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedQty);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQty, false);
    navigateTo('checkout');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          fill={i < Math.floor(rating) ? '#de7921' : 'none'}
          color={i < Math.floor(rating) ? '#de7921' : '#d5d9d9'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb nav */}
      <nav className="detail-breadcrumbs" aria-label="Breadcrumbs">
        <button className="back-link" onClick={() => navigateTo('home')}>
          <ArrowLeft size={16} /> Back to results
        </button>
        <span className="crumb-sep">›</span>
        <span>{product.category}</span>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{product.brand || 'Products'}</span>
      </nav>

      <div className="detail-layout">
        {/* Left: Product Image */}
        <div className="detail-image-section">
          <div className="detail-image-card">
            <img 
              src={product.imageURL} 
              alt={product.title} 
              className="detail-main-img" 
            />
          </div>
          {product.badge && (
            <div className="detail-badge-pill">
              <span>{product.badge}</span>
            </div>
          )}
        </div>

        {/* Center: Title & Specs */}
        <div className="detail-info-section">
          {product.brand && (
            <span className="detail-brand-link">Visit the {product.brand} Store</span>
          )}
          
          <h1 className="detail-title">{product.title}</h1>

          {/* Rating */}
          <div className="detail-ratings">
            <div className="detail-stars">{renderStars(product.rating)}</div>
            <span className="detail-rating-score">{product.rating}</span>
            <span className="detail-review-link">
              {product.reviewCount.toLocaleString()} ratings
            </span>
          </div>

          <div className="detail-divider" />

          {/* Pricing */}
          <div className="detail-pricing-box">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="detail-discount-pill">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
            <div className="detail-price-val">
              <span className="detail-currency">₹</span>
              <span className="detail-amount">{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {product.originalPrice && (
            <div className="detail-list-price">
              Typical price: <span>{formatPrice(product.originalPrice)}</span>
            </div>
          )}

          {/* Prime info */}
          {product.isPrime && (
            <div className="detail-prime-box">
              <span className="badge-prime">Prime</span>
              <span>Enjoy fast, FREE delivery and exclusive deals</span>
            </div>
          )}

          <div className="detail-divider" />

          {/* Description */}
          <div className="detail-desc-block">
            <h3>Overview</h3>
            <p>{product.description}</p>
          </div>

          {/* Features */}
          {product.features && (
            <div className="detail-features-block">
              <h3>About this item</h3>
              <ul>
                {product.features.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Buy Box */}
        <div className="detail-buybox-section">
          <div className="detail-buybox">
            <div className="detail-buybox-price">{formatPrice(product.price)}</div>
            
            <div className="detail-shipping-estimate">
              FREE delivery <strong>Tomorrow</strong>. Order within <strong>6 hrs 15 mins</strong>.
            </div>

            <div className="detail-location-pin">
              <MapPin size={15} />
              <span>Deliver to {userSession.name} - {userSession.location}</span>
            </div>

            <div className="detail-stock-status">
              {product.inStock ? (
                <span className="in-stock"><Check size={18} /> In Stock</span>
              ) : (
                <span className="out-of-stock">Currently unavailable</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="detail-qty-picker">
                <label htmlFor="detail-qty">Quantity:</label>
                <select
                  id="detail-qty"
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

            {/* Buy Buttons */}
            <div className="detail-btn-stack">
              <button
                className={`btn-primary detail-cart-btn ${isAdding ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} />
                <span>{isAdding ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                className="btn-orange detail-buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>

            <div className="secure-tx">
              <Lock size={14} />
              <span>Secure transaction</span>
            </div>

            <div className="detail-meta-table">
              <div className="meta-row">
                <span>Ships from</span>
                <span>Amazon.com</span>
              </div>
              <div className="meta-row">
                <span>Sold by</span>
                <span>{product.brand || 'Amazon.com'}</span>
              </div>
              <div className="meta-row">
                <span>Returns</span>
                <span>30-day refund / replacement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
