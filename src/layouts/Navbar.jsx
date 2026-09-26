import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBasket,
  ShoppingCart,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Package,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { ROUTES } from '../constants/index.js';
import { getInitials } from '../utils/formatters.js';
import clsx from 'clsx';

const navLinks = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.PRODUCTS, label: 'Products', icon: Package },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <nav className="page-container" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-gray-100"
            aria-label="MyBasket home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <ShoppingBasket className="h-4.5 w-4.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg">
              My<span className="text-primary-600">Basket</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={clsx('nav-link', isActive(to) && 'nav-link-active')}
                  aria-current={isActive(to) ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to={ROUTES.CART}
                  className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  aria-label={`Shopping cart, ${itemCount} items`}
                >
                  <ShoppingCart className="h-4.5 w-4.5" aria-hidden="true" />
                  {itemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg p-1.5 pr-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    id="user-menu-button"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                      {getInitials(user?.name)}
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', isUserMenuOpen && 'rotate-180')} aria-hidden="true" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-1.5 w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg animate-slide-down dark:border-gray-800 dark:bg-gray-900"
                      role="menu"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to={ROUTES.PROFILE}
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" aria-hidden="true" />
                        Profile & Settings
                      </Link>
                      <Link
                        to={ROUTES.ORDERS}
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" aria-hidden="true" />
                        My Orders
                      </Link>
                      <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to={ROUTES.LOGIN} className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-primary text-sm">
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-3 dark:border-gray-800 md:hidden animate-slide-down">
            {isAuthenticated ? (
              <div className="space-y-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={clsx('nav-link', isActive(to) && 'nav-link-active')}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                ))}
                <Link to={ROUTES.CART} className={clsx('nav-link', isActive(ROUTES.CART) && 'nav-link-active')}>
                  <ShoppingCart className="h-4 w-4" />
                  Cart {itemCount > 0 && <span className="ml-auto badge-green">{itemCount}</span>}
                </Link>
                <Link to={ROUTES.ORDERS} className={clsx('nav-link', isActive(ROUTES.ORDERS) && 'nav-link-active')}>
                  <Package className="h-4 w-4" />
                  Orders
                </Link>
                <Link to={ROUTES.PROFILE} className={clsx('nav-link', isActive(ROUTES.PROFILE) && 'nav-link-active')}>
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pb-1">
                <Link to={ROUTES.LOGIN} className="btn-secondary w-full justify-center">
                  Sign in
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-primary w-full justify-center">
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
