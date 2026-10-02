const ORDERS_KEY = 'amazon_clone_orders_v2';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  /**
   * Retrieve all previous orders from localStorage
   */
  getOrders() {
    try {
      if (localStorage.getItem('amazon_clone_orders')) {
        localStorage.removeItem('amazon_clone_orders');
      }
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Failed to load orders', err);
      return [];
    }
  },

  /**
   * Generate an authentic Amazon-format order ID: 3 digits - 7 digits - 7 digits
   */
  generateOrderId() {
    const p1 = Math.floor(100 + Math.random() * 900);
    const p2 = Math.floor(1000000 + Math.random() * 9000000);
    const p3 = Math.floor(1000000 + Math.random() * 9000000);
    return `${p1}-${p2}-${p3}`;
  },

  /**
   * Submit mock payment and place the order
   */
  async placeOrder({
    items,
    shippingAddress,
    paymentMethod,
    totals
  }) {
    // Simulate real gateway authorization delay
    await delay(1200);

    if (!items || items.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
      throw new Error('Incomplete shipping address.');
    }

    const orderId = this.generateOrderId();
    const orderDate = new Date().toISOString();

    // Calculate delivery estimate: 2 business days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    const newOrder = {
      orderId,
      createdAt: orderDate,
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }),
      status: 'Preparing for Shipment',
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        imageURL: item.product.imageURL,
        quantity: item.quantity,
        brand: item.product.brand
      })),
      shippingAddress: { ...shippingAddress },
      paymentMethod: {
        type: paymentMethod.type || 'credit_card',
        cardLast4: paymentMethod.cardNumber ? paymentMethod.cardNumber.slice(-4) : '4242',
        cardBrand: paymentMethod.cardBrand || 'Visa'
      },
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        itemCount: totals.itemCount
      }
    };

    // Save to localStorage order history
    const existingOrders = this.getOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    } catch (err) {
      console.error('Failed to save order to localStorage', err);
    }

    return newOrder;
  }
};
