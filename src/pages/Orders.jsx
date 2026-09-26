import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, X, ShoppingBasket } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getOrders, cancelOrder } from '../services/orderService.js';
import { ROUTES, ORDER_STATUS_LABELS } from '../constants/index.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { TableRowSkeleton } from '../components/ui/Skeleton.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const statusBadgeVariant = (status) => {
  const map = { pending: 'yellow', processing: 'blue', shipped: 'blue', delivered: 'green', cancelled: 'red' };
  return map[status] || 'gray';
};

const OrderRow = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <>
      <tr
        className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <td className="px-5 py-4 text-xs font-mono font-medium text-gray-700 dark:text-gray-300">{order.id}</td>
        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</td>
        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
        <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</td>
        <td className="px-5 py-4">
          <Badge variant={statusBadgeVariant(order.status)} dot>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </td>
        <td className="px-5 py-4 text-gray-400">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </td>
      </tr>

      {/* Expanded order details */}
      {expanded && (
        <tr className="bg-gray-50 dark:bg-gray-800/30">
          <td colSpan={6} className="px-5 py-4">
            <div className="space-y-3">
              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-contain bg-white dark:bg-gray-900 p-1" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300 line-clamp-1">{item.title}</span>
                    <span className="text-gray-500">×{item.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Meta */}
              {order.shippingAddress && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Shipping: </span>
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </div>
              )}

              {/* Cancel button */}
              {canCancel && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCancel(order); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Cancel Order
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [user.id]);

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      const updated = await cancelOrder(cancelTarget.id, user.id);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success('Order cancelled successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
      setCancelTarget(null);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium transition-all',
                filter === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>{Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
            </table>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon="package"
            title={filter === 'all' ? "No orders yet" : `No ${filter} orders`}
            description={filter === 'all' ? "Start shopping to see your orders here." : "Try a different filter."}
            action={
              filter === 'all' ? (
                <Link to={ROUTES.PRODUCTS} className="btn-primary text-sm">
                  <ShoppingBasket className="h-4 w-4" /> Browse Products
                </Link>
              ) : (
                <button onClick={() => setFilter('all')} className="btn-secondary text-sm">
                  Show all orders
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Orders table">
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {['Order ID', 'Date', 'Items', 'Total', 'Status', ''].map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.map((order) => (
                  <OrderRow key={order.id} order={order} onCancel={setCancelTarget} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Order" size="sm">
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel order{' '}
            <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{cancelTarget?.id}</span>?
            This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCancelTarget(null)}>
              Keep Order
            </Button>
            <Button variant="danger" isLoading={isCancelling} onClick={handleCancel}>
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
