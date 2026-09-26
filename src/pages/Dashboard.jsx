import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Clock,
  ShoppingBasket,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getOrders } from '../services/orderService.js';
import { ROUTES, ORDER_STATUS_STYLES, ORDER_STATUS_LABELS } from '../constants/index.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { StatCardSkeleton, TableRowSkeleton } from '../components/ui/Skeleton.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import clsx from 'clsx';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {sub && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
      </div>
      <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', color)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { itemCount, subtotal } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrders(user.id);
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    load();
  }, [user.id]);

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const recentOrders = orders.slice(0, 5);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {greeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <Link to={ROUTES.PRODUCTS} className="btn-primary shrink-0">
          <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
          Browse Products
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoadingOrders ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={Package}
              label="Total Orders"
              value={orders.length}
              sub={`${deliveredCount} delivered`}
              color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            />
            <StatCard
              icon={DollarSign}
              label="Total Spent"
              value={formatCurrency(totalSpent)}
              sub="Lifetime value"
              color="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
            />
            <StatCard
              icon={ShoppingCart}
              label="Cart Items"
              value={itemCount}
              sub={itemCount > 0 ? `${formatCurrency(subtotal)} subtotal` : 'Cart is empty'}
              color="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
            />
            <StatCard
              icon={TrendingUp}
              label="Active Orders"
              value={orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length}
              sub="In progress"
              color="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
            />
          </>
        )}
      </div>

      {/* Quick Actions + Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="card p-5">
          <h2 className="section-title mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              {
                icon: ShoppingBasket,
                label: 'Browse all products',
                sub: 'Explore our catalog',
                to: ROUTES.PRODUCTS,
                color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400',
              },
              {
                icon: ShoppingCart,
                label: 'View my cart',
                sub: `${itemCount} items`,
                to: ROUTES.CART,
                color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
              },
              {
                icon: Package,
                label: 'Order history',
                sub: `${orders.length} orders`,
                to: ROUTES.ORDERS,
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
              },
              {
                icon: Clock,
                label: 'Active orders',
                sub: `${orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length} in progress`,
                to: ROUTES.ORDERS,
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
              },
            ].map(({ icon: Icon, label, sub, to, color }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className={clsx('flex h-9 w-9 items-center justify-center rounded-lg', color)}>
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 className="section-title">Recent Orders</h2>
            <Link
              to={ROUTES.ORDERS}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoadingOrders ? (
            <div className="overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={4} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : recentOrders.length === 0 ? (
            <EmptyState
              icon="package"
              title="No orders yet"
              description="Your orders will appear here once you make a purchase."
              action={
                <Link to={ROUTES.PRODUCTS} className="btn-primary text-sm">
                  Start shopping
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Order ID', 'Date', 'Total', 'Status'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono font-medium text-gray-700 dark:text-gray-300">
                        {order.id}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            ORDER_STATUS_STYLES[order.status]?.replace('badge-', '') || 'gray'
                          }
                          dot
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
