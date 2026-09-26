import { Link, Outlet } from 'react-router-dom';
import { ShoppingBasket, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Minimal layout for auth pages (Login, Register, Forgot Password).
 * Centered card with branding.
 */
const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-white/80 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center gap-2.5 font-bold text-gray-900 dark:text-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-glow">
            <ShoppingBasket className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-2xl">
            My<span className="text-primary-600">Basket</span>
          </span>
        </Link>

        {/* Auth card */}
        <div className="w-full max-w-md">
          <div className="card p-8 shadow-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
