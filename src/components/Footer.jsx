import React from 'react';
import { useStore } from '../context/StoreContext';
import { Globe } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const { navigateTo } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="amazon-footer">
      {/* Back to top banner */}
      <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
        Back to top
      </button>

      {/* Main 4-column links */}
      <div className="footer-links-container">
        <div className="footer-col">
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="#careers" onClick={(e) => e.preventDefault()}>Careers</a></li>
            <li><a href="#blog" onClick={(e) => e.preventDefault()}>Amazon Newsletter</a></li>
            <li><a href="#about" onClick={(e) => e.preventDefault()}>About Amazon</a></li>
            <li><a href="#investor" onClick={(e) => e.preventDefault()}>Investor Relations</a></li>
            <li><a href="#devices" onClick={(e) => e.preventDefault()}>Amazon Devices</a></li>
            <li><a href="#science" onClick={(e) => e.preventDefault()}>Amazon Science</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Make Money with Us</h3>
          <ul>
            <li><a href="#sell" onClick={(e) => e.preventDefault()}>Sell products on Amazon</a></li>
            <li><a href="#sell-apps" onClick={(e) => e.preventDefault()}>Sell on Amazon Business</a></li>
            <li><a href="#affiliate" onClick={(e) => e.preventDefault()}>Become an Affiliate</a></li>
            <li><a href="#advertise" onClick={(e) => e.preventDefault()}>Advertise Your Products</a></li>
            <li><a href="#self-publish" onClick={(e) => e.preventDefault()}>Self-Publish with Us</a></li>
            <li><a href="#host-hub" onClick={(e) => e.preventDefault()}>Host an Amazon Hub</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Amazon Payment Products</h3>
          <ul>
            <li><a href="#rewards" onClick={(e) => e.preventDefault()}>Amazon Visa</a></li>
            <li><a href="#store-card" onClick={(e) => e.preventDefault()}>Amazon Store Card</a></li>
            <li><a href="#points" onClick={(e) => e.preventDefault()}>Amazon Secured Card</a></li>
            <li><a href="#points-shop" onClick={(e) => e.preventDefault()}>Shop with Points</a></li>
            <li><a href="#reload" onClick={(e) => e.preventDefault()}>Reload Your Balance</a></li>
            <li><a href="#currency" onClick={(e) => e.preventDefault()}>Amazon Currency Converter</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Let Us Help You</h3>
          <ul>
            <li><button className="footer-btn-link" onClick={() => navigateTo('orders')}>Your Orders</button></li>
            <li><a href="#shipping" onClick={(e) => e.preventDefault()}>Shipping Rates & Policies</a></li>
            <li><a href="#returns" onClick={(e) => e.preventDefault()}>Returns & Replacements</a></li>
            <li><a href="#manage-content" onClick={(e) => e.preventDefault()}>Manage Your Content and Devices</a></li>
            <li><a href="#help" onClick={(e) => e.preventDefault()}>Help & Customer Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-divider" />

      {/* Brand & Language Bar */}
      <div className="footer-brand-bar">
        <div 
          className="footer-logo"
          onClick={() => navigateTo('home')}
          role="button"
          tabIndex={0}
        >
          <span className="logo-text">amazon</span>
          <span className="logo-domain">.in</span>
        </div>

        <div className="footer-preferences">
          <div className="pref-badge">
            <Globe size={15} />
            <span>English</span>
          </div>
          <div className="pref-badge">
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹</span>
            <span>INR - Indian Rupee</span>
          </div>
          <div className="pref-badge">
            <span>🇮🇳 India</span>
          </div>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="footer-legal">
        <div className="legal-links">
          <a href="#terms" onClick={(e) => e.preventDefault()}>Conditions of Use</a>
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Notice</a>
          <a href="#consumer" onClick={(e) => e.preventDefault()}>Consumer Health Data Privacy Disclosure</a>
          <a href="#ads" onClick={(e) => e.preventDefault()}>Your Ads Privacy Choices</a>
        </div>
        <p className="copyright-text">
          © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates. Engineered for demonstration purposes.
        </p>
      </div>
    </footer>
  );
};
