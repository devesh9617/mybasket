import { Link } from 'react-router-dom';
import { ShoppingBasket, ShoppingCart, Package, Star, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES, DEMO_CREDENTIALS } from '../constants/index.js';

const features = [
  {
    icon: ShoppingCart,
    title: 'Smart Cart',
    description: 'Add items instantly, manage quantities, and see your total update in real time.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    icon: Package,
    title: 'Order Tracking',
    description: 'View your complete order history with statuses and delivery estimates.',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    icon: Star,
    title: 'Curated Products',
    description: 'Browse a wide range of quality products across electronics, fashion, and more.',
    color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays safe with JWT authentication and proper session management.',
    color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Built with Vite for blazing-fast loads on any device or screen size.',
    color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  },
  {
    icon: BarChart3,
    title: 'Personal Dashboard',
    description: 'See your spending stats, recent orders, and quick actions at a glance.',
    color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-900/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/20" aria-hidden="true" />

        <div className="page-container relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tagline chip */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
              <ShoppingBasket className="h-3.5 w-3.5" aria-hidden="true" />
              Your smart shopping companion
            </div>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl">
              Shop smarter with{' '}
              <span className="text-primary-600">MyBasket</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400 text-balance">
              Browse thousands of products, manage your cart effortlessly, and track every order —
              all in one clean, fast, and secure platform.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <Link to={ROUTES.DASHBOARD} className="btn-primary px-6 py-3 text-base">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link to={ROUTES.REGISTER} className="btn-primary px-6 py-3 text-base">
                    Get started free
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link to={ROUTES.LOGIN} className="btn-secondary px-6 py-3 text-base">
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {/* Demo credentials hint */}
            {!isAuthenticated && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Try the demo:{' '}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {DEMO_CREDENTIALS.email}
                </code>{' '}
                /{' '}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {DEMO_CREDENTIALS.password}
                </code>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="page-container">
          <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 lg:grid-cols-4">
            {[
              { value: '200+', label: 'Products' },
              { value: '4', label: 'Categories' },
              { value: '100%', label: 'Responsive' },
              { value: 'Free', label: 'No credit card' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-8">
                <span className="text-2xl font-extrabold text-primary-600">{value}</span>
                <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Everything you need to shop better
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            A modern shopping experience with powerful features built for real users.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="card p-6 card-hover">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600 dark:bg-primary-700">
        <div className="page-container py-14 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to start shopping?
          </h2>
          <p className="mt-3 text-primary-100">
            Join today and explore hundreds of products instantly.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {isAuthenticated ? (
              <Link
                to={ROUTES.PRODUCTS}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-colors"
              >
                Browse Products
              </Link>
            ) : (
              <>
                <Link
                  to={ROUTES.REGISTER}
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-colors"
                >
                  Create free account
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="rounded-lg border border-primary-400 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-500 transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
