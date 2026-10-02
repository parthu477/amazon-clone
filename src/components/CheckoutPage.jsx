import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  CreditCard, 
  MapPin, 
  Truck, 
  ArrowLeft, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { formatPrice } from '../utils/currency';
import './CheckoutPage.css';

export const CheckoutPage = () => {
  const { 
    cart, 
    cartTotals, 
    userSession, 
    handlePlaceOrder, 
    navigateTo 
  } = useStore();

  // Multi-step tracker: 1 = Shipping, 2 = Payment, 3 = Review
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Step 1: Shipping Address State & Validation
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userSession.address?.fullName || userSession.name || '',
    address: userSession.address?.address || '',
    apartment: '',
    city: userSession.address?.city || '',
    state: userSession.address?.state || 'NY',
    zipCode: userSession.address?.zipCode || '',
    phone: userSession.address?.phone || '(555) 234-5678',
    deliveryInstructions: ''
  });

  const [addressErrors, setAddressErrors] = useState({});

  // Step 2: Payment State
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'credit_card',
    cardNumber: '4242 •••• •••• 4242',
    nameOnCard: userSession.name || 'Alex Morgan',
    expiryDate: '12/28',
    cvv: '888',
    cardBrand: 'Visa'
  });

  const validateAddress = () => {
    const errors = {};
    if (!shippingAddress.fullName.trim() || shippingAddress.fullName.trim().length < 2) {
      errors.fullName = 'Please enter a valid full name.';
    }
    if (!shippingAddress.address.trim()) {
      errors.address = 'Please enter a valid street address.';
    }
    if (!shippingAddress.city.trim()) {
      errors.city = 'Please enter your city.';
    }
    if (!shippingAddress.state.trim()) {
      errors.state = 'Please enter or select a state.';
    }
    if (!shippingAddress.zipCode.trim() || !/^\d{5,6}(-\d{4})?$/.test(shippingAddress.zipCode.trim())) {
      errors.zipCode = 'Please enter a valid PIN / ZIP code (e.g. 400053 or 110001).';
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.trim().length < 7) {
      errors.phone = 'Please provide a valid phone number for delivery updates.';
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalOrderSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await handlePlaceOrder({
        shippingAddress,
        paymentMethod
      });
    } catch (err) {
      setSubmitError(err.message || 'Payment processing failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty-wrap">
        <h2>Your Cart is empty</h2>
        <p>You cannot checkout with an empty cart.</p>
        <button className="btn-primary" onClick={() => navigateTo('home')}>
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      {/* Minimal Amazon Checkout Header */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div 
            className="checkout-logo"
            onClick={() => navigateTo('cart')}
            role="button"
            tabIndex={0}
          >
            <span className="logo-text">amazon</span>
            <span className="logo-domain">.com</span>
          </div>

          <h1 className="checkout-page-title">
            Checkout <span className="checkout-item-count">({cartTotals.itemCount} items)</span>
          </h1>

          <div className="checkout-ssl-badge">
            <Lock size={18} className="lock-icon" />
          </div>
        </div>
      </header>

      {/* Modern Progress Tracker (Compliant with Modern Web Guidance) */}
      <nav aria-label="Checkout Progress" className="checkout-progress-nav">
        <ol className="checkout-progress-steps">
          <li 
            className={`step-item ${currentStep === 1 ? 'step-active' : currentStep > 1 ? 'step-done' : ''}`}
            onClick={() => currentStep > 1 && setCurrentStep(1)}
          >
            <span className="step-circle">{currentStep > 1 ? <Check size={14} /> : '1'}</span>
            <span className="step-label">Shipping address</span>
          </li>
          <li className="step-connector" />
          <li 
            className={`step-item ${currentStep === 2 ? 'step-active' : currentStep > 2 ? 'step-done' : ''}`}
            onClick={() => currentStep > 2 && setCurrentStep(2)}
          >
            <span className="step-circle">{currentStep > 2 ? <Check size={14} /> : '2'}</span>
            <span className="step-label">Payment method</span>
          </li>
          <li className="step-connector" />
          <li className={`step-item ${currentStep === 3 ? 'step-active' : ''}`}>
            <span className="step-circle">3</span>
            <span className="step-label">Review items & shipping</span>
          </li>
        </ol>
      </nav>

      {submitError && (
        <div className="checkout-error-banner" role="alert">
          <AlertCircle size={20} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Checkout Columns */}
      <div className="checkout-content-grid">
        {/* Left Column: Multi-step accordion/views */}
        <div className="checkout-main-forms">
          {/* STEP 1: Shipping Address */}
          <section className={`checkout-section ${currentStep === 1 ? 'active-section' : 'collapsed-section'}`}>
            <div className="section-header">
              <span className="section-number">1</span>
              <h2>Shipping address</h2>
              {currentStep > 1 && (
                <button 
                  className="change-step-link"
                  onClick={() => setCurrentStep(1)}
                  type="button"
                >
                  Change
                </button>
              )}
            </div>

            {currentStep === 1 ? (
              <form onSubmit={handleAddressSubmit} className="shipping-address-form" noValidate>
                <div className="form-row">
                  <div className={`form-group ${addressErrors.fullName ? 'has-error' : ''}`}>
                    <label htmlFor="fullName">Full name (First and Last name) *</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      aria-invalid={!!addressErrors.fullName}
                      aria-describedby={addressErrors.fullName ? 'fullName-error' : undefined}
                      required
                    />
                    {addressErrors.fullName && (
                      <span id="fullName-error" className="error-message">
                        {addressErrors.fullName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${addressErrors.address ? 'has-error' : ''}`}>
                    <label htmlFor="address">Street address *</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      placeholder="Street address or P.O. Box"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      aria-invalid={!!addressErrors.address}
                      aria-describedby={addressErrors.address ? 'address-error' : undefined}
                      required
                    />
                    {addressErrors.address && (
                      <span id="address-error" className="error-message">
                        {addressErrors.address}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="apartment">Apt, suite, unit, building (optional)</label>
                    <input
                      id="apartment"
                      name="apartment"
                      type="text"
                      autoComplete="address-line2"
                      value={shippingAddress.apartment}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row form-grid-3">
                  <div className={`form-group ${addressErrors.city ? 'has-error' : ''}`}>
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      aria-invalid={!!addressErrors.city}
                      required
                    />
                    {addressErrors.city && (
                      <span className="error-message">{addressErrors.city}</span>
                    )}
                  </div>

                  <div className={`form-group ${addressErrors.state ? 'has-error' : ''}`}>
                    <label htmlFor="state">State *</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      autoComplete="address-level1"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      aria-invalid={!!addressErrors.state}
                      required
                    />
                    {addressErrors.state && (
                      <span className="error-message">{addressErrors.state}</span>
                    )}
                  </div>

                  <div className={`form-group ${addressErrors.zipCode ? 'has-error' : ''}`}>
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="e.g. 10001"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      aria-invalid={!!addressErrors.zipCode}
                      required
                    />
                    {addressErrors.zipCode && (
                      <span className="error-message">{addressErrors.zipCode}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${addressErrors.phone ? 'has-error' : ''}`}>
                    <label htmlFor="phone">Phone number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      aria-invalid={!!addressErrors.phone}
                      required
                    />
                    <span className="field-hint">May be used to assist delivery</span>
                    {addressErrors.phone && (
                      <span className="error-message">{addressErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary use-address-btn">
                    Use this address
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => navigateTo('cart')}
                  >
                    Return to Cart
                  </button>
                </div>
              </form>
            ) : (
              <div className="collapsed-summary">
                <p><strong>{shippingAddress.fullName}</strong></p>
                <p>{shippingAddress.address} {shippingAddress.apartment && `, ${shippingAddress.apartment}`}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>
            )}
          </section>

          {/* STEP 2: Payment Method */}
          <section className={`checkout-section ${currentStep === 2 ? 'active-section' : 'collapsed-section'}`}>
            <div className="section-header">
              <span className="section-number">2</span>
              <h2>Payment method</h2>
              {currentStep > 2 && (
                <button 
                  className="change-step-link"
                  onClick={() => setCurrentStep(2)}
                  type="button"
                >
                  Change
                </button>
              )}
            </div>

            {currentStep === 2 ? (
              <form onSubmit={handlePaymentSubmit} className="payment-method-form">
                <div className="payment-options">
                  <label className="payment-card-option selected">
                    <input
                      type="radio"
                      name="paymentType"
                      value="credit_card"
                      checked={paymentMethod.type === 'credit_card'}
                      onChange={() => setPaymentMethod({ ...paymentMethod, type: 'credit_card' })}
                    />
                    <div className="option-content">
                      <div className="option-title-row">
                        <CreditCard size={20} className="card-icon" />
                        <strong>Credit or Debit Card (Mock Sandbox)</strong>
                      </div>
                      <p className="option-desc">Amazon accepts all major credit and debit cards.</p>

                      <div className="card-input-box">
                        <div className="form-group">
                          <label htmlFor="cardNumber">Card number</label>
                          <input
                            id="cardNumber"
                            type="text"
                            value={paymentMethod.cardNumber}
                            onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                            placeholder="4242 4242 4242 4242"
                            required
                          />
                        </div>

                        <div className="form-grid-2">
                          <div className="form-group">
                            <label htmlFor="nameOnCard">Name on card</label>
                            <input
                              id="nameOnCard"
                              type="text"
                              value={paymentMethod.nameOnCard}
                              onChange={(e) => setPaymentMethod({ ...paymentMethod, nameOnCard: e.target.value })}
                              required
                            />
                          </div>

                          <div className="form-grid-2">
                            <div className="form-group">
                              <label htmlFor="expiryDate">Expiration</label>
                              <input
                                id="expiryDate"
                                type="text"
                                placeholder="MM/YY"
                                value={paymentMethod.expiryDate}
                                onChange={(e) => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="cvv">CVV</label>
                              <input
                                id="cvv"
                                type="password"
                                maxLength="4"
                                placeholder="888"
                                value={paymentMethod.cvv}
                                onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary use-payment-btn">
                    Use this payment method
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Address
                  </button>
                </div>
              </form>
            ) : currentStep > 2 ? (
              <div className="collapsed-summary">
                <p><strong>{paymentMethod.cardBrand} ending in {paymentMethod.cardNumber.slice(-4)}</strong></p>
                <p>Name: {paymentMethod.nameOnCard} | Exp: {paymentMethod.expiryDate}</p>
              </div>
            ) : null}
          </section>

          {/* STEP 3: Review Items & Delivery */}
          <section className={`checkout-section ${currentStep === 3 ? 'active-section' : 'collapsed-section'}`}>
            <div className="section-header">
              <span className="section-number">3</span>
              <h2>Review items and delivery</h2>
            </div>

            {currentStep === 3 && (
              <div className="review-order-content">
                <div className="shipping-option-box">
                  <div className="shipping-option-head">
                    <Truck size={22} className="truck-icon" />
                    <div>
                      <h4>Guaranteed Delivery Date: Tomorrow</h4>
                      <p>If you order in the next 4 hours and 28 minutes</p>
                    </div>
                  </div>
                  <div className="shipping-speed-choice">
                    <label>
                      <input type="radio" name="shippingSpeed" defaultChecked />
                      <span>FREE Prime Two-Day Delivery</span>
                    </label>
                  </div>
                </div>

                <div className="review-items-list">
                  <h4>Items for shipment ({cartTotals.itemCount})</h4>
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="review-item-row">
                      <img src={product.imageURL} alt={product.title} className="review-item-img" />
                      <div className="review-item-info">
                        <span className="review-item-title">{product.title}</span>
                        <div className="review-item-price">
                          <strong>{formatPrice(product.price)}</strong>
                          <span className="review-item-qty">Qty: {quantity}</span>
                        </div>
                        {product.isPrime && <span className="badge-prime">Prime</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="final-place-order-banner">
                  <button
                    className="btn-primary big-place-order-btn"
                    onClick={handleFinalOrderSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="spinner-icon" />
                        <span>Processing Payment & Placing Order...</span>
                      </>
                    ) : (
                      <span>Place your order ({formatPrice(cartTotals.total)})</span>
                    )}
                  </button>
                  <p className="privacy-terms-text">
                    By placing your order, you agree to Amazon Clone's simulated privacy notice and conditions of use.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="checkout-summary-sidebar">
          <div className="summary-sticky-card">
            {currentStep === 3 && (
              <button
                className="btn-primary summary-place-order-btn"
                onClick={handleFinalOrderSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Place your order</span>
                )}
              </button>
            )}

            <div className="summary-terms-snippet">
              By placing your order, you agree to Amazon's conditions of use.
            </div>

            <div className="summary-divider" />

            <h3>Order Summary</h3>

            <div className="summary-line">
              <span>Items ({cartTotals.itemCount}):</span>
              <span>{formatPrice(cartTotals.subtotal)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping & handling:</span>
              <span>{cartTotals.shipping === 0 ? 'FREE' : formatPrice(cartTotals.shipping)}</span>
            </div>

            <div className="summary-line">
              <span>Estimated GST (18%):</span>
              <span>{formatPrice(cartTotals.tax)}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total-row">
              <span className="total-label">Order total:</span>
              <span className="total-amount">{formatPrice(cartTotals.total)}</span>
            </div>

            <div className="summary-perks">
              <div className="perk-row">
                <ShieldCheck size={16} className="perk-icon" />
                <span>Simulated Secure Payment</span>
              </div>
              <div className="perk-row">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Zero Risk Demonstration</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
