import { initialProducts, CATEGORIES } from '../data/products';

// Simulated database in memory / localStorage fallback
const STORAGE_KEY = 'amazon_clone_products_db_v2';

const getDatabase = () => {
  try {
    // Clear legacy v1 database if it exists to ensure INR prices load smoothly
    if (localStorage.getItem('amazon_clone_products_db')) {
      localStorage.removeItem('amazon_clone_products_db');
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Unable to access localStorage, fallback to initial products', e);
  }
  return initialProducts;
};

// Simulated network latency utility
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Service to fetch products with filtering, search, sorting, and pagination
 */
export const productService = {
  /**
   * Fetch all products matching criteria
   */
  async getProducts({
    search = '',
    category = 'All',
    sortBy = 'featured',
    minRating = 0,
    inStockOnly = false
  } = {}) {
    await delay(200);
    let items = [...getDatabase()];

    // Category filter
    if (category && category !== 'All') {
      items = items.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search query filter (matches title, description, brand, category)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Rating filter
    if (minRating > 0) {
      items = items.filter((item) => item.rating >= minRating);
    }

    // In Stock filter
    if (inStockOnly) {
      items = items.filter((item) => item.inStock);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        items.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        // natural order with deals first
        items.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
    }

    return {
      products: items,
      total: items.length
    };
  },

  /**
   * Fetch single product details
   */
  async getProductById(id) {
    await delay(150);
    const items = getDatabase();
    const product = items.find((p) => String(p.id) === String(id));
    if (!product) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    return product;
  },

  /**
   * Fetch categories list
   */
  async getCategories() {
    await delay(100);
    return CATEGORIES;
  },

  /**
   * Fetch featured deals of the day
   */
  async getDeals() {
    await delay(150);
    const items = getDatabase();
    return items.filter((p) => p.badge && p.inStock).slice(0, 4);
  }
};
