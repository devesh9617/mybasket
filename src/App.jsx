import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { ROUTES } from './constants/index.js';

// Lazy loaded pages for code splitting
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Full-screen page loading fallback
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center" aria-label="Loading page">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      <p className="text-sm text-gray-400">Loading…</p>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {/* Global toast notifications */}
            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '10px',
                  fontSize: '14px',
                },
              }}
            />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public layout — full app shell with Navbar */}
                <Route element={<AppLayout />}>
                  <Route path={ROUTES.HOME} element={<Landing />} />

                  {/* Protected app routes */}
                  <Route
                    path={ROUTES.DASHBOARD}
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                  />
                  <Route
                    path={ROUTES.PRODUCTS}
                    element={<ProtectedRoute><Products /></ProtectedRoute>}
                  />
                  <Route
                    path={ROUTES.PRODUCT_DETAIL}
                    element={<ProtectedRoute><ProductDetail /></ProtectedRoute>}
                  />
                  <Route
                    path={ROUTES.CART}
                    element={<ProtectedRoute><Cart /></ProtectedRoute>}
                  />
                  <Route
                    path={ROUTES.CHECKOUT}
                    element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                  />
                  <Route
                    path={ROUTES.ORDERS}
                    element={<ProtectedRoute><Orders /></ProtectedRoute>}
                  />
                  <Route
                    path="/orders/:id"
                    element={<ProtectedRoute><Orders /></ProtectedRoute>}
                  />
                  <Route
                    path={ROUTES.PROFILE}
                    element={<ProtectedRoute><Profile /></ProtectedRoute>}
                  />

                  {/* 404 */}
                  <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                </Route>

                {/* Auth layout — minimal centered card */}
                <Route element={<AuthLayout />}>
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.REGISTER} element={<Register />} />
                  <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                </Route>
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
