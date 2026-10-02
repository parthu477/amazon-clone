# 📋 Amazon.in Clone — Team GitHub Issues Backlog

Welcome team! Below is the curated backlog of **8 prioritized GitHub Issues** structured for collaborative development. Each issue includes:
- **Role/Skillset** recommended
- **Priority & Labels**
- **User Story & Technical Scope**
- **Key Files to Modify**
- **Acceptance Criteria**

---

## 📌 Issue #1: [Feature] Implement UPI & Net Banking Payment Methods
- **Labels**: `enhancement`, `payment`, `priority: high`, `good first issue`
- **Suggested Assignee**: Frontend / Full-stack Developer
- **Complexity**: Medium

### Description
Currently, the checkout flow only simulates Credit/Debit cards. In India, over 75% of ecommerce transactions are completed via **UPI (Google Pay, PhonePe, Paytm, BHIM)**, Net Banking, or Cash on Delivery (COD).

### Tasks
1. In `src/components/CheckoutPage.jsx`, add payment options for:
   - **UPI (VPA / QR Code)**: Input for UPI ID (`example@upi`, `@oksbi`, `@okaxis`, `@paytm`) with format validation.
   - **Show QR Code**: Button to display a simulated dynamic UPI QR Code modal that automatically approves after 3 seconds.
   - **Net Banking**: Bank dropdown selector (HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak).
   - **Cash on Delivery (COD)**: Option available for orders below ₹10,000 with a captcha or OTP confirmation.
2. Save the selected payment details in `orderService.js` and display the exact method used on the `OrderConfirmationPage` and `OrdersPage`.

### Key Files
- `src/components/CheckoutPage.jsx` & `CheckoutPage.css`
- `src/services/orderService.js`
- `src/components/OrderConfirmationPage.jsx`
- `src/components/OrdersPage.jsx`

### Acceptance Criteria
- [ ] Users can select UPI, enter a valid `@` VPA, or click "Scan UPI QR".
- [ ] Users can choose Net Banking or Cash on Delivery.
- [ ] Order confirmation reflects the exact payment method chosen (e.g. "UPI: user@okaxis").
- [ ] Mobile responsive layout for all payment forms.

---

## 📌 Issue #2: [Feature] User Authentication System (Login, Sign-Up, OTP)
- **Labels**: `feature`, `auth`, `security`, `priority: high`
- **Suggested Assignee**: Full-stack Developer
- **Complexity**: High

### Description
Currently, the user session is mocked with a static user profile (`Rahul Sharma`) in `StoreContext.jsx`. The project needs a dedicated authentication flow allowing users to create accounts, log in, sign out, and maintain sessions.

### Tasks
1. Create dedicated views/pages:
   - `LoginPage.jsx`: Email/mobile number input, password field, "Keep me signed in", and "Create your Amazon account" CTA.
   - `SignupPage.jsx`: Full Name, Mobile Number / Email, Password (min 6 chars), and Password strength indicator.
2. Implement authentication state:
   - Integrate Firebase Auth, Supabase, or a JWT backend.
   - Persist user session across page refreshes in `localStorage`.
3. Protect routes:
   - If an unauthenticated user clicks "Proceed to Checkout", redirect them to `LoginPage`, and return to `CheckoutPage` after successful login.
4. Header integration:
   - Show "Hello, [User First Name]" and account flyout menu with "Sign Out" action.

### Key Files
- `src/components/LoginPage.jsx` & `LoginPage.css` (New)
- `src/components/SignupPage.jsx` & `SignupPage.css` (New)
- `src/context/StoreContext.jsx`
- `src/components/Header.jsx`

### Acceptance Criteria
- [ ] Users can register with validation and log into their accounts.
- [ ] Header dynamically reflects user's actual login status and name.
- [ ] Checkout requires authentication or offers guest checkout.
- [ ] Sign out clears the session and resets the cart securely.

---

## 📌 Issue #3: [Feature] Customer Reviews, Ratings Breakdown & Photo Reviews
- **Labels**: `feature`, `ui/ux`, `priority: medium`
- **Suggested Assignee**: Frontend Developer
- **Complexity**: Medium

### Description
Enhance `ProductDetailPage.jsx` by adding an Amazon-style Customer Review section with aggregate rating bars, verified purchase badges, helpful votes, and a modal to submit new reviews.

### Tasks
1. **Rating Histogram Bar**:
   - 5-star, 4-star, 3-star, 2-star, 1-star percentage breakdown bars with hover tooltips.
2. **Review List**:
   - Customer name, avatar/initials, star rating, verified purchase badge, date, review title, body, and photos.
   - "Helpful" button with counter that increments on click.
3. **Write a Review Modal**:
   - Modal with interactive star selector, title input, text area, and image file upload preview.
   - Submitting adds the review to the product's review list immediately.

### Key Files
- `src/components/ProductDetailPage.jsx` & `ProductDetailPage.css`
- `src/data/products.js` (add mock reviews per product)
- `src/context/StoreContext.jsx` (add `addReview(productId, review)`)

### Acceptance Criteria
- [ ] Rating breakdown percentages accurately reflect the reviews.
- [ ] Users can submit a new review that renders immediately.
- [ ] "Helpful" vote increments without reloading.
- [ ] Accessible modal with keyboard Escape support.

---

## 📌 Issue #4: [Feature] Multiple Saved Delivery Addresses & PIN Code Auto-Fill
- **Labels**: `feature`, `checkout`, `priority: medium`
- **Suggested Assignee**: Frontend Developer
- **Complexity**: Low - Medium

### Description
Allow customers to save multiple delivery addresses (Home, Office, Other), set a default address, and quickly pick an address during checkout with 1 click. Also add auto-fill for City and State when a 6-digit Indian PIN code is entered.

### Tasks
1. In `StoreContext.jsx`, create an `addresses` state (defaulting to Home & Office).
2. On `CheckoutPage.jsx`:
   - Display saved address cards with radio selectors and "Deliver to this address" button.
   - Include an "Add a new address" toggle.
3. Implement Indian Postal PIN Code Lookup:
   - When a user enters 6 digits in the PIN code input, auto-fill `City` and `State` (e.g. `400053` -> Mumbai, Maharashtra; `110001` -> New Delhi, Delhi) using a local dictionary or public postal API (`https://api.postalpincode.in/pincode/{PIN}`).

### Key Files
- `src/context/StoreContext.jsx`
- `src/components/CheckoutPage.jsx` & `CheckoutPage.css`
- `src/utils/pincode.js` (New)

### Acceptance Criteria
- [ ] Users can select from multiple saved addresses with 1 click.
- [ ] Adding a new address saves it to `localStorage`.
- [ ] Typing a 6-digit Indian PIN code auto-populates City and State.

---

## 📌 Issue #5: [Backend] Build Node.js / Express REST API & Database Schema
- **Labels**: `backend`, `database`, `api`, `architecture`, `priority: high`
- **Suggested Assignee**: Backend Developer
- **Complexity**: High

### Description
Migrate from simulated `localStorage` to a real full-stack backend built with **Node.js, Express, and MongoDB or PostgreSQL (Prisma)**.

### Tasks
1. Set up `server/` directory:
   - Express server with `cors`, `helmet`, `morgan`, and `dotenv`.
2. Define models:
   - `Product`: title, brand, description, price (INR), originalPrice, rating, reviewCount, category, badge, isPrime, inStock, stockCount, imageURL.
   - `Order`: orderId, userId, items, shippingAddress, paymentMethod, totals, status, createdAt.
   - `User`: name, email, passwordHash, isPrime, addresses.
3. Implement REST API endpoints:
   - `GET /api/products` (supports `?category=`, `?search=`, `?sort=`, `?page=`, `?limit=`)
   - `GET /api/products/:id`
   - `POST /api/orders`
   - `GET /api/orders/:userId`
4. Update frontend `productService.js` and `orderService.js` to fetch from `http://localhost:5000/api/...`.

### Key Files
- `server/package.json`, `server/server.js` (New)
- `server/routes/products.js`, `server/routes/orders.js` (New)
- `src/services/productService.js`
- `src/services/orderService.js`

### Acceptance Criteria
- [ ] Server starts on port 5000 and connects to database.
- [ ] Frontend successfully consumes backend endpoints.
- [ ] Orders are persisted in the database and visible across devices.

---

## 📌 Issue #6: [Feature] Live Autocomplete Search, Voice Search & Filter Sidebar
- **Labels**: `enhancement`, `search`, `ui/ux`, `priority: medium`
- **Suggested Assignee**: Frontend Developer
- **Complexity**: Medium

### Description
Provide an authentic Amazon search experience with live predictive autocomplete suggestions, recent search history, price slider filters, and browser Web Speech voice search.

### Tasks
1. **Live Search Suggestions**:
   - As the user types in the header search input (debounced by 200ms), display a dropdown with matching keywords and matching products with thumbnail and price.
2. **Search History**:
   - Store recent queries in `localStorage` and display "Recent Searches" with a "Clear all" button when focusing on an empty search bar.
3. **Price Range & Brand Sidebar Filter**:
   - On desktop, add a left sidebar filter on `ProductGrid` with price sliders (₹500 to ₹1,50,000) and brand checkboxes.
4. **Voice Search**:
   - Add microphone icon in search bar using browser `webkitSpeechRecognition` / `SpeechRecognition` API.

### Key Files
- `src/components/Header.jsx` & `Header.css`
- `src/components/ProductGrid.jsx` & `ProductGrid.css`
- `src/services/productService.js`

### Acceptance Criteria
- [ ] Typing in search input displays relevant real-time suggestions.
- [ ] Clicking a suggestion navigates directly or filters the catalog.
- [ ] Price slider dynamically filters products in real-time.
- [ ] Voice search transcribes speech to query string seamlessly.

---

## 📌 Issue #7: [Feature] Visual Order Tracking Stepper & Order Cancellation
- **Labels**: `feature`, `orders`, `ui/ux`, `priority: low`
- **Suggested Assignee**: Frontend Developer
- **Complexity**: Low - Medium

### Description
Give customers complete visibility into order fulfillment with an Amazon-style visual tracking timeline modal, order status progression, and an order cancellation flow.

### Tasks
1. **Interactive Tracking Timeline**:
   - Click "Track Package" on any order in `OrdersPage` to open a modal with a 4-step progress stepper:
     1. Ordered & Confirmed
     2. Shipped
     3. Out for Delivery
     4. Delivered
   - Show estimated delivery date, courier name (e.g. "Amazon Shipping / Delhivery"), and tracking ID.
2. **Cancel Order Workflow**:
   - Orders placed less than 2 hours ago show a "Cancel Items" button.
   - Clicking opens a confirmation modal asking for a reason ("Ordered by mistake", "Found cheaper price", "Shipping too slow").
   - Updates order status to "Cancelled" and restores product inventory.
3. **Download Invoice**:
   - Add a printable or downloadable PDF receipt slip.

### Key Files
- `src/components/OrdersPage.jsx` & `OrdersPage.css`
- `src/services/orderService.js`

### Acceptance Criteria
- [ ] Tracking modal clearly shows progress with active status badge.
- [ ] Customers can cancel recently placed orders.
- [ ] Invoice view formats cleanly for printing.

---

## 📌 Issue #8: [Testing & CI/CD] Vitest Test Suite & GitHub Actions Workflow
- **Labels**: `testing`, `ci/cd`, `devops`, `priority: medium`
- **Suggested Assignee**: QA / DevOps Engineer
- **Complexity**: Medium

### Description
Implement automated testing to ensure currency math (₹ INR, 18% GST, free delivery thresholds), cart actions, and checkout flows remain rock solid as team members contribute.

### Tasks
1. Set up **Vitest** and **React Testing Library**:
   - `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
   - Add `"test": "vitest"` script to `package.json`.
2. Unit Tests:
   - `src/utils/currency.test.js`: Test `formatPrice`, `splitPriceParts`, and Indian number formatting.
   - `src/context/StoreContext.test.jsx`: Test adding items, quantity updates, removal, and cart totals calculation.
3. End-to-End / Integration Tests:
   - Test full purchasing flow: Add product -> View Cart -> Enter Address -> Place Order -> Verify Order in History.
4. GitHub Actions CI:
   - Create `.github/workflows/ci.yml` that runs on every `push` and `pull_request`:
     - Checks linting (`npm run lint`)
     - Runs tests (`npm test`)
     - Validates build (`npm run build`)

### Key Files
- `package.json` & `vite.config.js`
- `src/utils/currency.test.js` (New)
- `src/context/StoreContext.test.jsx` (New)
- `.github/workflows/ci.yml` (New)

### Acceptance Criteria
- [ ] `npm test` runs and passes all tests.
- [ ] GitHub Actions workflow triggers on PRs and verifies builds automatically.
