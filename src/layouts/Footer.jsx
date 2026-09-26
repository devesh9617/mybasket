import { Link } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';
import { ROUTES } from '../constants/index.js';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="page-container py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600">
              <ShoppingBasket className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span>My<span className="text-primary-600">Basket</span></span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link to={ROUTES.PRODUCTS} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Products
            </Link>
            <Link to={ROUTES.ORDERS} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Orders
            </Link>
            <a
              href="https://fakestoreapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              API
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {year} MyBasket. Built with React + Vite.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
