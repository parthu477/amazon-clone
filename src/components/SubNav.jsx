import React from 'react';
import { useStore } from '../context/StoreContext';
import { Menu, Zap } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import './SubNav.css';

export const SubNav = () => {
  const { selectedCategory, setSelectedCategory, navigateTo } = useStore();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigateTo('home');
  };

  return (
    <div className="amazon-subnav">
      <div className="subnav-container">
        {/* All Button */}
        <button 
          className={`subnav-item subnav-all-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('All')}
        >
          <Menu size={18} />
          <span>All</span>
        </button>

        {/* Dynamic Category items */}
        <div className="subnav-links">
          <button 
            className="subnav-item deal-link"
            onClick={() => handleCategoryClick('All')}
          >
            <Zap size={14} className="deal-icon" />
            <span>Today's Deals</span>
          </button>

          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <button
              key={cat}
              className={`subnav-item ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}

          <button className="subnav-item hide-on-mobile" onClick={() => navigateTo('home')}>
            Customer Service
          </button>
          <button className="subnav-item hide-on-tablet" onClick={() => navigateTo('home')}>
            Registry
          </button>
          <button className="subnav-item hide-on-tablet" onClick={() => navigateTo('home')}>
            Gift Cards
          </button>
        </div>

        {/* Prime Banner Promo */}
        <div className="subnav-prime-banner">
          <span className="subnav-prime-tag">Prime</span>
          <span className="subnav-prime-text">FREE Delivery on orders over ₹499</span>
        </div>
      </div>
    </div>
  );
};
