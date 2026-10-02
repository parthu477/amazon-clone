import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { orderService } from '../services/orderService';

const CART_STORAGE_KEY = 'amazon_clone_cart_items_v2';
const SAVED_STORAGE_KEY = 'amazon_clone_saved_items_v2';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // 1. Cart state with localStorage initialization
  const [cart, setCart] = useState(() => {
    try {
      if (localStorage.getItem('amazon_clone_cart_items')) {
        localStorage.removeItem('amazon_clone_cart_items');
      }
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  });

  // 2. Saved For Later items
  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      if (localStorage.getItem('amazon_clone_saved_items')) {
        localStorage.removeItem('amazon_clone_saved_items');
      }
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 3. Past orders state
  const [orders, setOrders] = useState(() => orderService.getOrders());

  // 4. User Session
  const [userSession] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.in',
    isPrime: true,
    location: 'Mumbai 400001',
    address: {
      fullName: 'Rahul Sharma',
      address: 'Flat 402, Greenfield Heights, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400053',
      phone: '+91 98765 43210'
    }
  });

  // 5. Navigation & View Routing
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'cart' | 'checkout' | 'confirmation' | 'orders' | 'product-detail'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // 6. Global Search & Filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 7. Toast feedback notification
  const [toast, setToast] = useState(null);

  // Synchronize cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Synchronize saved items with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedForLater));
    } catch (e) {
      console.error('Failed to save savedForLater to localStorage', e);
    }
  }, [savedForLater]);

  // Trigger Toast notification
  const showToast = useCallback((message, type = 'success', product = null) => {
    setToast({
      id: Date.now(),
      message,
      type,
      product
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Cart operations
  const addToCart = useCallback((product, quantity = 1, showFeedback = true) => {
    if (!product || !product.inStock) {
      showToast('This item is currently out of stock.', 'warn');
      return;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        // Increment quantity if already exists
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + qty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity: qty, addedAt: new Date().toISOString() }];
      }
    });

    if (showFeedback) {
      showToast(`Added ${qty} ${qty > 1 ? 'items' : 'item'} to your Cart`, 'success', product);
    }
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.product.id === productId);
      if (removedItem) {
        showToast(`Removed "${removedItem.product.title.slice(0, 32)}..." from Cart`, 'info');
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  }, [showToast]);

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  }, [removeFromCart]);

  const saveForLaterAction = useCallback((productId) => {
    setCart((prevCart) => {
      const itemToSave = prevCart.find((i) => i.product.id === productId);
      if (itemToSave) {
        setSavedForLater((prevSaved) => {
          if (prevSaved.some((s) => s.product.id === productId)) return prevSaved;
          return [...prevSaved, itemToSave];
        });
        showToast(`Moved to Saved for Later`, 'info', itemToSave.product);
      }
      return prevCart.filter((i) => i.product.id !== productId);
    });
  }, [showToast]);

  const moveToCartAction = useCallback((productId) => {
    setSavedForLater((prevSaved) => {
      const itemToMove = prevSaved.find((i) => i.product.id === productId);
      if (itemToMove) {
        addToCart(itemToMove.product, itemToMove.quantity || 1, false);
        showToast(`Moved back to Cart`, 'success', itemToMove.product);
      }
      return prevSaved.filter((i) => i.product.id !== productId);
    });
  }, [addToCart, showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // silent
    }
  }, []);

  // Navigation helper
  const navigateTo = useCallback((view, data = null) => {
    if (view === 'product-detail' && data) {
      setSelectedProduct(data);
    }
    if (view === 'confirmation' && data) {
      setConfirmedOrder(data);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate order & cart totals
  const cartTotals = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Free delivery threshold = ₹499, or free if user has Prime
    const freeShippingThreshold = 499.00;
    const qualifiesForFreeShipping = userSession.isPrime || subtotal >= freeShippingThreshold;
    const shipping = cart.length === 0 ? 0 : (qualifiesForFreeShipping ? 0.00 : 40.00);
    
    // Estimated GST: 18%
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    return {
      itemCount,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      qualifiesForFreeShipping,
      remainingForFreeShipping: parseFloat(remainingForFreeShipping.toFixed(2))
    };
  }, [cart, userSession.isPrime]);

  // Order Placement logic
  const handlePlaceOrder = useCallback(async ({ shippingAddress, paymentMethod }) => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty');
    }

    const orderResult = await orderService.placeOrder({
      items: cart,
      shippingAddress,
      paymentMethod,
      totals: cartTotals
    });

    // Update global orders state
    setOrders((prev) => [orderResult, ...prev]);

    // Clear cart state completely
    clearCart();

    // Route to confirmation view
    navigateTo('confirmation', orderResult);
    return orderResult;
  }, [cart, cartTotals, clearCart, navigateTo]);

  const value = {
    cart,
    savedForLater,
    orders,
    userSession,
    currentView,
    selectedProduct,
    quickViewProduct,
    confirmedOrder,
    searchQuery,
    selectedCategory,
    toast,
    cartTotals,
    addToCart,
    updateQuantity,
    removeFromCart,
    saveForLaterAction,
    moveToCartAction,
    clearCart,
    navigateTo,
    setSelectedProduct,
    setQuickViewProduct,
    setSearchQuery,
    setSelectedCategory,
    showToast,
    hideToast,
    handlePlaceOrder
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
