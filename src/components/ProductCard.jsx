import React, { useState } from 'react';
import { Star, Check, Eye, ShoppingCart, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, splitPriceParts } from '../utils/currency';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart, setQuickViewProduct, navigateTo } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  const { whole, fraction } = splitPriceParts(product.price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleOpenDetail = () => {
    navigateTo('product-detail', product);
  };

  // Render Star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={15} fill="#de7921" color="#de7921" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star key={i} size={15} fill="#de7921" color="#de7921" style={{ opacity: 0.8 }} />
        );
      } else {
        stars.push(
          <Star key={i} size={15} color="#d5d9d9" />
        );
      }
    }
    return stars;
  };

  return (
    <article className="product-card" onClick={handleOpenDetail}>
      {/* Badge Top */}
      <div className="product-card-top-badge">
        {product.badge && (
          <span className={`card-badge ${product.badge.toLowerCase().includes('deal') ? 'deal-badge' : 'choice-badge'}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="product-image-box">
        <img 
          src={product.imageURL} 
          alt={product.title} 
          className="product-thumbnail" 
          loading="lazy" 
        />
        <button 
          className="quick-view-overlay-btn"
          onClick={handleQuickView}
          aria-label={`Quick view ${product.title}`}
        >
          <Eye size={15} /> Quick View
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>

        {/* Rating and Reviews */}
        <div className="product-rating-row">
          <div className="product-stars">{renderStars(product.rating)}</div>
          <span className="rating-score">{product.rating.toFixed(1)}</span>
          <span className="review-count">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price & Discounts */}
        <div className="product-pricing">
          <div className="price-display">
            <span className="price-currency">₹</span>
            <span className="price-whole">{whole}</span>
            <span className="price-fraction">{fraction}</span>
          </div>

          {product.originalPrice && product.originalPrice > product.price && (
            <div className="original-price-wrap">
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
              <span className="save-percent">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Prime Tag & Fast Delivery */}
        {product.isPrime && (
          <div className="prime-delivery-notice">
            <span className="badge-prime">Prime</span>
            <span className="delivery-time">Get it <strong>Tomorrow</strong></span>
          </div>
        )}

        {/* Stock Availability */}
        <div className="stock-notice">
          {product.inStock ? (
            <span className="in-stock">
              <Check size={14} /> In Stock
            </span>
          ) : (
            <span className="out-of-stock">Currently unavailable</span>
          )}
        </div>

        {/* Action Button */}
        <div className="product-card-actions">
          <button
            className={`btn-primary add-to-cart-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={16} />
            <span>{isAdding ? 'Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
