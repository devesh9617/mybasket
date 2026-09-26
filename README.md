# 🛒 MyBasket — Smart Grocery Shopping App

A professional, production-quality **Full-Stack Frontend Developer** portfolio project demonstrating modern React.js, API integration, state management, responsive UI, authentication, and clean frontend architecture.

> Built to showcase real-world engineering skills in a Frontend Developer interview.

---

## 📌 Overview

**MyBasket** is a modern e-commerce shopping application that allows users to browse products from a live API, manage a persistent shopping cart, place orders, and track order history — all with a professional, responsive UI.

---

## ✨ Features

### Core Functionality
- 🛍️ **Product Catalog** — Browse real products from FakeStore API
- 🔍 **Search + Filter + Sort** — Debounced search, category filter, multi-sort options
- 📖 **Product Detail** — Full product page with related products
- 🛒 **Shopping Cart** — Persistent cart with quantity management
- 🏷️ **Promo Codes** — BASKET10 (10% off), SAVE20 (20% off)
- 📦 **Order Management** — Place, track, and cancel orders
- 🧾 **Checkout Flow** — 3-step (Shipping → Payment → Confirm)

### Authentication
- 📝 Register with form validation + password strength meter
- 🔐 Login with JWT simulation + session persistence
- 🔒 Protected routes with redirect back to intended URL
- 🔑 Forgot Password flow
- ✏️ Profile edit with change password

### UI/UX
- 🌗 **Dark/Light Mode** — OS preference detection + persistence
- 📱 **Fully Responsive** — Mobile-first, works on all screen sizes
- ⚡ **Skeleton Loading** — No blank screens during data fetch
- 📭 **Empty States** — Helpful CTAs when no data exists
- 🔔 **Toast Notifications** — Success/error feedback on every action
- 💬 **Confirmation Modals** — Before destructive actions

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Forms | React Hook Form |
| State | Context API + useReducer patterns |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| API | FakeStore API (https://fakestoreapi.com) |
| Storage | localStorage (auth, cart, orders) |

---

## 🏗️ Frontend Architecture

```
src/
├── assets/                  # Static assets
├── components/
│   ├── ui/                  # Reusable primitives
│   │   ├── Button.jsx       # Variants: primary/secondary/ghost/danger
│   │   ├── Input.jsx        # Label, error, icon, password toggle
│   │   ├── Modal.jsx        # Accessible, focus-trapped modal
│   │   ├── Badge.jsx        # Status badges with dot indicator
│   │   ├── Skeleton.jsx     # Loading placeholders
│   │   ├── EmptyState.jsx   # No-data states with CTA
│   │   └── Pagination.jsx   # Smart page navigation
│   └── products/
│       └── ProductCard.jsx  # Product display card
├── pages/
│   ├── Landing.jsx          # Public home page
│   ├── Login.jsx            # Auth: sign in
│   ├── Register.jsx         # Auth: sign up
│   ├── ForgotPassword.jsx   # Auth: reset
│   ├── Dashboard.jsx        # User dashboard with stats
│   ├── Products.jsx         # Product catalog
│   ├── ProductDetail.jsx    # Single product view
│   ├── Cart.jsx             # Shopping cart
│   ├── Checkout.jsx         # 3-step checkout
│   ├── Orders.jsx           # Order history
│   ├── Profile.jsx          # User settings
│   └── NotFound.jsx         # 404 page
├── layouts/
│   ├── AppLayout.jsx        # Navbar + main + Footer wrapper
│   ├── AuthLayout.jsx       # Centered card for auth pages
│   ├── Navbar.jsx           # Responsive sticky navigation
│   └── Footer.jsx           # Site footer
├── hooks/
│   ├── useDebounce.js       # Delay value updates (search)
│   ├── useAsync.js          # Async state management
│   └── usePagination.js     # Page slicing logic
├── context/
│   ├── AuthContext.jsx      # Auth state + session restore
│   ├── CartContext.jsx      # Cart + localStorage sync
│   └── ThemeContext.jsx     # Dark/light mode
├── services/
│   ├── api.js               # Axios instance + interceptors
│   ├── authService.js       # Auth logic (localStorage-based)
│   ├── productService.js    # FakeStore API calls
│   └── orderService.js      # Order CRUD
├── utils/
│   ├── formatters.js        # Currency, date, string helpers
│   └── validators.js        # Validation rules + RHF rules
├── constants/
│   └── index.js             # Routes, categories, statuses
├── routes/
│   └── ProtectedRoute.jsx   # Auth guard with redirect
├── App.jsx                  # Root with lazy routes + providers
└── main.jsx                 # Vite entry point
```

---

## 🔐 Authentication Flow

1. User visits `/login` or `/register`
2. Credentials validated client-side (React Hook Form)
3. Auth service checks/stores users in localStorage
4. A simulated JWT token is created and stored
5. `AuthContext` restores session from localStorage on mount
6. `ProtectedRoute` checks `isAuthenticated` before rendering
7. Unauthenticated access redirects to `/login` with `state.from` preserved
8. After login, user is redirected back to the original URL

> **Note:** Auth is localStorage-based for this demo. Replace `authService.js` with real backend calls (e.g., `POST /api/auth/login`) to connect to a real backend.

---

## 🗄️ State Management

| State | Solution |
|---|---|
| Authentication | AuthContext (useState + localStorage) |
| Cart | CartContext (useState + localStorage) |
| Theme | ThemeContext (useState + localStorage) |
| Form state | React Hook Form |
| Server/async | Local useState per component |
| Derived data | useMemo (filtering, sorting, pagination) |

---

## 📡 API Integration

All product data comes from the live **FakeStore API**:

| Endpoint | Usage |
|---|---|
| `GET /products` | All products |
| `GET /products/:id` | Single product |
| `GET /products/categories` | Category list |
| `GET /products/category/:name` | Filter by category |

Axios instance (`services/api.js`) includes:
- Base URL from environment variable
- Request interceptor: injects auth token
- Response interceptor: normalizes errors + handles 401

---

## ⚙️ Environment Variables

```env
VITE_API_BASE_URL=https://fakestoreapi.com
```

Copy `.env.example` to `.env` and configure.

---

## 🚀 Installation & Running Locally

```bash
# Clone the repository
git clone <your-repo-url>
cd mybasket

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at **http://localhost:3000**

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Demo User | demo@mybasket.com | Demo@12345 |
| Admin | admin@mybasket.com | Admin@12345 |
| Promo Codes | BASKET10 (10% off), SAVE20 (20% off) | — |

---

## 🎯 Interview Demo Flow

1. **Landing Page** → Show hero, features, demo credentials
2. **Register** → Show form validation + password strength
3. **Login** → Show protected route redirect, session persistence
4. **Dashboard** → Stats, recent orders, quick actions
5. **Products** → Search, filter by category, sort, pagination
6. **Product Detail** → Add to cart, quantity controls, related products
7. **Cart** → Quantity update, remove, promo code, order summary
8. **Checkout** → 3-step form flow, validation, order placement
9. **Orders** → Order history, status filter, expandable rows, cancel modal
10. **Profile** → Tabbed settings, change password, account info
11. **Logout** → Clear session, redirect to home
12. **Dark Mode** → Toggle theme, persistence across refresh
13. **Protected Routes** → Access /dashboard without login → redirected

---

## ⚡ Performance Optimizations

- **Code Splitting** — All pages are lazy-loaded with `React.lazy + Suspense`
- **Debounced Search** — 350ms delay prevents excessive re-renders
- **Memoization** — `useMemo` for filtered/sorted product lists
- **useCallback** — Stable function references in context
- **Lazy Image Loading** — `loading="lazy"` on all product images
- **localStorage Init** — Cart initialized from storage to avoid flicker

---

## ♿ Accessibility

- Semantic HTML (`header`, `nav`, `main`, `section`, `dl`)
- `aria-label`, `aria-expanded`, `aria-current`, `aria-live`
- `role="dialog"`, `aria-modal` on modals
- Focus management in modal (Escape key, focus restoration)
- Keyboard navigable dropdowns and menus
- Proper `<label for>` associations on all form fields
- Error messages linked via `aria-describedby`
- Sufficient color contrast ratios

---

## 🌐 Deployment Readiness

| Target | Platform |
|---|---|
| Frontend | Vercel, Netlify |
| API | FakeStore API (external) |
| Auth/Orders | Replace localStorage with backend (Render/Railway) |

Build with: `npm run build` → deploy `dist/` folder.

---

## 🔮 Future Improvements

- [ ] Real backend (Node.js + Express + MongoDB)
- [ ] JWT-based authentication with refresh tokens
- [ ] Cloudinary for profile image uploads
- [ ] Wishlist / Saved products feature
- [ ] Product reviews and ratings
- [ ] Admin dashboard (user management, product CRUD)
- [ ] Email notifications (Nodemailer)
- [ ] PWA support (offline cart)
- [ ] Unit and integration tests (Vitest + Testing Library)

---

## 👨‍💻 Author

Built as a portfolio project to demonstrate modern frontend engineering practices.

> Tech Stack: React 18 · Vite · Tailwind CSS · React Router v6 · Axios · React Hook Form · Context API · Lucide React
