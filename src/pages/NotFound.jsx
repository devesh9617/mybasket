import { Link } from 'react-router-dom';
import { ShoppingBasket, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/index.js';

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16 animate-fade-in">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
      <ShoppingBasket className="h-10 w-10 text-gray-400 dark:text-gray-500" aria-hidden="true" />
    </div>

    <h1 className="text-6xl font-extrabold text-primary-600 dark:text-primary-500">404</h1>
    <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h2>
    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>

    <div className="mt-8 flex gap-3">
      <Link to={ROUTES.HOME} className="btn-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Go Home
      </Link>
      <Link to={ROUTES.PRODUCTS} className="btn-secondary">
        Browse Products
      </Link>
    </div>
  </div>
);

export default NotFound;
