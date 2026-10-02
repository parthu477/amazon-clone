import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { productService } from '../services/productService';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import './ProductGrid.css';

export const ProductGrid = () => {
  const { searchQuery, selectedCategory, setSelectedCategory } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local filters
  const [sortBy, setSortBy] = useState('featured');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProducts({
          search: searchQuery,
          category: selectedCategory,
          sortBy,
          minRating,
          inStockOnly
        });
        if (isMounted) {
          setProducts(response.products);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load products from server. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, sortBy, minRating, inStockOnly]);

  return (
    <section className="product-grid-section" id="products-section">
      {/* Top Filter and Results Bar */}
      <div className="grid-controls-bar">
        <div className="results-count-box">
          <span className="results-label">
            {searchQuery ? (
              <>Results for <strong className="query-highlight">"{searchQuery}"</strong></>
            ) : selectedCategory !== 'All' ? (
              <>Category: <strong>{selectedCategory}</strong></>
            ) : (
              <>Explore <strong>Today's Deals & Top Picks</strong></>
            )}
          </span>
          <span className="results-total">({products.length} {products.length === 1 ? 'item' : 'items'})</span>
        </div>

        {/* Filter Controls */}
        <div className="controls-group">
          {/* In Stock Only Checkbox */}
          <label className="checkbox-filter-label" htmlFor="in-stock-filter">
            <input
              type="checkbox"
              id="in-stock-filter"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In Stock Only</span>
          </label>

          {/* Rating filter */}
          <div className="filter-select-wrap">
            <label htmlFor="rating-filter">Rating:</label>
            <select
              id="rating-filter"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5 & up</option>
              <option value="4.0">4.0 & up</option>
              <option value="3.5">3.5 & up</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="filter-select-wrap">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Content Area */}
      {loading ? (
        <div className="grid-loading-state">
          <Loader2 size={36} className="spinner-icon" />
          <p>Fetching Amazon catalog...</p>
        </div>
      ) : error ? (
        <div className="grid-error-state">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="grid-empty-state">
          <h3>No matching items found</h3>
          <p>Try clearing your filters or searching with different keywords.</p>
          <button 
            className="btn-secondary"
            onClick={() => {
              setMinRating(0);
              setInStockOnly(false);
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-cards-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
