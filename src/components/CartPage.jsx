import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Trash2, 
  Bookmark, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '../utils/currency';
import './CartPage.css';

export const CartPage = () => {
  const { 
    cart, 
    savedForLater, 
    cartTotals, 
    updateQuantity, 
    removeFromCart, 
    saveForLaterAction, 
    moveToCartAction, 
    navigateTo 
  } = useStore();

  const [isGift, setIsGift] = useState(false);

  const handleProceedToCheckout = () => {
    navigateTo('checkout');
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="cart-page-empty-wrapper">
        <div className="cart-empty-box">
          <div className="empty-cart-icon-wrap">
            <ShoppingBag size={56} className="empty-cart-icon" />
          </div>
          <h2>Your Amazon Cart is empty</h2>
          <p>Your Shopping Cart lives to serve. Give it purpose — fill it with electronics, books, kitchenware, and more.</p>
          <div className="empty-cart-actions">
            <button className="btn-primary" onClick={() => navigateTo('home')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Free Shipping Alert Banner */}
      {cart.length > 0 && (
        <div className="free-shipping-banner">
          <div className="shipping-progress-indicator">
            <span className="check-bubble">
              <Check size={16} />
            </span>
            <div className="banner-text">
              {cartTotals.qualifiesForFreeShipping ? (
                <span>
                  <strong>Your order qualifies for FREE Delivery!</strong> Choose this option at checkout. See details.
                </span>
              ) : (
                <span>
                  Add <strong>{formatPrice(cartTotals.remainingForFreeShipping)}</strong> of eligible items to get <strong>FREE Delivery</strong>.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="cart-layout">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-section">
          <div className="cart-card">
            <div className="cart-card-header">
              <h1>Shopping Cart</h1>
              <span className="cart-price-header">Price</span>
            </div>

            {cart.length === 0 ? (
              <div className="cart-no-active-items">
                <p>There are no active items in your cart.</p>
                <button className="btn-secondary" onClick={() => navigateTo('home')}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item-row">
                    {/* Item Thumbnail */}
                    <div 
                      className="cart-item-image-box"
                      onClick={() => navigateTo('product-detail', product)}
                    >
                      <img src={product.imageURL} alt={product.title} />
                    </div>

                    {/* Item Details */}
                    <div className="cart-item-details">
                      <h3 
                        className="cart-item-title" 
                        onClick={() => navigateTo('product-detail', product)}
                      >
                        {product.title}
                      </h3>

                      <div className="cart-item-stock">
                        {product.inStock ? (
                          <span className="in-stock">In Stock</span>
                        ) : (
                          <span className="out-of-stock">Out of Stock</span>
                        )}
                      </div>

                      {product.isPrime && (
                        <div className="cart-item-prime">
                          <span className="badge-prime">Prime</span>
                          <span className="prime-note">FREE One-Day & FREE Returns</span>
                        </div>
                      )}

                      <div className="cart-item-gift-check">
                        <label>
                          <input 
                            type="checkbox" 
                            name={`gift-${product.id}`} 
                          />
                          <span>This is a gift <a href="#learn-more" onClick={(e) => e.preventDefault()}>Learn more</a></span>
                        </label>
                      </div>

                      {/* Interactive Controls: Quantity dropdown & actions */}
                      <div className="cart-item-actions-row">
                        <div className="cart-qty-picker">
                          <label htmlFor={`qty-select-${product.id}`}>Qty:</label>
                          <select
                            id={`qty-select-${product.id}`}
                            value={quantity}
                            onChange={(e) => updateQuantity(product.id, e.target.value)}
                            aria-label={`Change quantity for ${product.title}`}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>

                        <span className="action-sep">|</span>

                        <button 
                          className="cart-action-btn delete-btn"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Delete ${product.title} from cart`}
                        >
                          Delete
                        </button>

                        <span className="action-sep">|</span>

                        <button 
                          className="cart-action-btn save-btn"
                          onClick={() => saveForLaterAction(product.id)}
                          aria-label={`Save ${product.title} for later`}
                        >
                          Save for later
                        </button>

                        <span className="action-sep">|</span>

                        <button 
                          className="cart-action-btn"
                          onClick={() => navigateTo('product-detail', product)}
                        >
                          Compare with similar items
                        </button>
                      </div>
                    </div>

                    {/* Price Column */}
                    <div className="cart-item-price-col">
                      <div className="price-tag">
                        {formatPrice(product.price * quantity)}
                      </div>
                      {quantity > 1 && (
                        <div className="price-unit">
                          ({formatPrice(product.price)} each)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subtotal at bottom of list */}
            {cart.length > 0 && (
              <div className="cart-card-footer">
                <div className="cart-subtotal-summary">
                  Subtotal ({cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}):{' '}
                  <strong className="subtotal-bold">{formatPrice(cartTotals.subtotal)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="cart-card saved-items-card">
              <div className="saved-card-header">
                <h2>Saved for later ({savedForLater.length} {savedForLater.length === 1 ? 'item' : 'items'})</h2>
              </div>
              <div className="saved-list">
                {savedForLater.map(({ product, quantity }) => (
                  <div key={product.id} className="saved-item-row">
                    <img 
                      src={product.imageURL} 
                      alt={product.title} 
                      className="saved-item-img" 
                      onClick={() => navigateTo('product-detail', product)}
                    />
                    <div className="saved-item-info">
                      <h4 onClick={() => navigateTo('product-detail', product)}>
                        {product.title}
                      </h4>
                      <div className="saved-price">{formatPrice(product.price)}</div>
                      <div className="saved-stock">
                        {product.inStock ? <span className="in-stock">In Stock</span> : <span className="out-of-stock">Out of Stock</span>}
                      </div>
                      <div className="saved-actions">
                        <button 
                          className="btn-secondary move-to-cart-btn"
                          onClick={() => moveToCartAction(product.id)}
                          disabled={!product.inStock}
                        >
                          Move to cart
                        </button>
                        <button 
                          className="cart-action-btn delete-btn"
                          onClick={() => moveToCartAction(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Sidebar */}
        {cart.length > 0 && (
          <aside className="cart-sidebar" aria-label="Order summary">
            <div className="cart-sidebar-card">
              {/* Free Delivery Meter */}
              <div className="free-shipping-sidebar-status">
                <div className="meter-head">
                  <Check size={18} className="check-icon" />
                  <span>
                    {cartTotals.qualifiesForFreeShipping ? (
                      <strong>Your order qualifies for FREE Delivery</strong>
                    ) : (
                      <>Add <strong>{formatPrice(cartTotals.remainingForFreeShipping)}</strong> for FREE Delivery</>
                    )}
                  </span>
                </div>
              </div>

              {/* Subtotal display */}
              <div className="sidebar-subtotal-block">
                <span className="subtotal-label">
                  Subtotal ({cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}):
                </span>
                <span className="subtotal-amount">{formatPrice(cartTotals.subtotal)}</span>
              </div>

              {/* Gift Checkbox */}
              <div className="sidebar-gift-row">
                <label>
                  <input 
                    type="checkbox" 
                    checked={isGift} 
                    onChange={(e) => setIsGift(e.target.checked)} 
                  />
                  <span>This order contains a gift</span>
                </label>
              </div>

              {/* Proceed to Checkout Button */}
              <button 
                className="btn-primary proceed-checkout-btn"
                onClick={handleProceedToCheckout}
                aria-label="Proceed to checkout"
              >
                <span>Proceed to checkout</span>
                <ArrowRight size={17} />
              </button>

              <div className="sidebar-security-badge">
                <ShieldCheck size={16} />
                <span>Safe & Secure 256-bit SSL Checkout</span>
              </div>
            </div>

            {/* Prime Membership perk box */}
            <div className="prime-perk-card">
              <div className="perk-header">
                <span className="badge-prime">Prime</span>
                <Sparkles size={16} className="perk-sparkle" />
              </div>
              <p>Enjoy unlimited Fast, Free Delivery on Millions of items, exclusive deals, and Prime Video.</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
