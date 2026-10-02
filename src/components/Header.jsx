import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  ChevronDown, 
  Menu, 
  Package, 
  X,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { formatPrice } from '../utils/currency';
import './Header.css';

export const Header = () => {
  const { 
    cart, 
    cartTotals, 
    userSession, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    navigateTo, 
    currentView 
  } = useStore();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    if (currentView !== 'home') {
      navigateTo('home');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (currentView !== 'home') {
      navigateTo('home');
    }
  };

  return (
    <header className="amazon-header">
      {/* Top Main Nav */}
      <div className="header-main">
        {/* Mobile Hamburger */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Amazon Logo */}
        <div 
          className="header-logo-container" 
          onClick={() => navigateTo('home')}
          role="button"
          tabIndex={0}
          aria-label="Amazon Home"
        >
          <div className="amazon-logo">
            <span className="logo-text">amazon</span>
            <span className="logo-domain">.in</span>
            <span className="logo-smile"></span>
          </div>
          {userSession.isPrime && (
            <span className="prime-pill">
              <Sparkles size={11} /> Prime
            </span>
          )}
        </div>

        {/* Deliver To Location */}
        <div 
          className="header-deliver-to"
          onClick={() => navigateTo('checkout')}
          role="button"
          tabIndex={0}
          title="Change delivery location"
        >
          <MapPin size={18} className="deliver-icon" />
          <div className="deliver-text">
            <span className="deliver-to">Deliver to {userSession.name.split(' ')[0]}</span>
            <span className="deliver-city">{userSession.location}</span>
          </div>
        </div>

        {/* Search Bar */}
        <form className="header-search-form" onSubmit={handleSearchSubmit}>
          <div className="search-category-dropdown">
            <select 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              aria-label="Select Category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon by brand, product or keyword..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            aria-label="Search Amazon"
          />

          <button type="submit" className="search-submit-btn" aria-label="Submit Search">
            <Search size={20} />
          </button>
        </form>

        {/* Right Section Nav items */}
        <div className="header-nav-items">
          {/* Language Flag Selector */}
          <div className="nav-item nav-lang" title="Language selection">
            <span className="flag-icon">🇺🇸</span>
            <span className="nav-line-2">EN</span>
            <ChevronDown size={12} className="nav-arrow" />
          </div>

          {/* Account & Lists */}
          <div className="nav-item nav-account" role="button" tabIndex={0}>
            <span className="nav-line-1">Hello, {userSession.name.split(' ')[0]}</span>
            <span className="nav-line-2">
              Account & Lists <ChevronDown size={12} className="nav-arrow" />
            </span>
          </div>

          {/* Returns & Orders */}
          <div 
            className={`nav-item nav-orders ${currentView === 'orders' ? 'active-nav' : ''}`}
            onClick={() => navigateTo('orders')}
            role="button"
            tabIndex={0}
          >
            <span className="nav-line-1">Returns</span>
            <span className="nav-line-2">& Orders</span>
          </div>

          {/* Cart Icon & Count */}
          <div 
            className={`nav-item nav-cart ${currentView === 'cart' ? 'active-nav' : ''}`}
            onClick={() => navigateTo('cart')}
            role="button"
            tabIndex={0}
            aria-label={`Shopping cart with ${cartTotals.itemCount} items`}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={30} className="cart-svg" />
              <span className={`cart-count ${cartTotals.itemCount > 0 ? 'has-items' : ''}`}>
                {cartTotals.itemCount}
              </span>
            </div>
            <div className="cart-text">
              <span className="nav-line-1 cart-subtotal-hint">
                {formatPrice(cartTotals.subtotal)}
              </span>
              <span className="nav-line-2 cart-label">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="drawer-user">
                <span>Hello, {userSession.name}</span>
                <span className="drawer-prime">Prime Member</span>
              </div>
              <button 
                className="close-drawer-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mobile-drawer-content">
              <h4>Shop By Department</h4>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`drawer-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setMobileMenuOpen(false);
                    navigateTo('home');
                  }}
                >
                  {cat}
                </button>
              ))}
              <div className="drawer-divider"></div>
              <h4>Your Account</h4>
              <button 
                className="drawer-cat-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('orders');
                }}
              >
                <Package size={16} /> Your Orders
              </button>
              <button 
                className="drawer-cat-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('cart');
                }}
              >
                <ShoppingCart size={16} /> Your Cart ({cartTotals.itemCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
