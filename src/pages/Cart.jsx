import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { ROUTES, MAX_CART_QUANTITY } from '../constants/index.js';
import { formatCurrency, truncate } from '../utils/formatters.js';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { useState } from 'react';

const PROMO_CODES = { BASKET10: 0.10, SAVE20: 0.20 };

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const shipping = subtotal >= 50 ? 0 : subtotal === 0 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const discount = appliedPromo ? subtotal * PROMO_CODES[appliedPromo] : 0;
  const total = subtotal - discount + tax + shipping;

  const handleRemove = (item) => {
    removeItem(item.id);
    toast.success(`"${truncate(item.title, 25)}" removed from cart`);
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
      toast.success(`Promo "${code}" applied! ${(PROMO_CODES[code] * 100).toFixed(0)}% off 🎉`);
    } else {
      setPromoError('Invalid promo code. Try BASKET10 or SAVE20.');
      setAppliedPromo(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon="basket"
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start browsing to find something you love."
          action={
            <Link to={ROUTES.PRODUCTS} className="btn-primary">
              <ShoppingBasket className="h-4 w-4" />
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={() => {
            clearCart();
            toast.success('Cart cleared');
          }}
          className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 text-sm"
        >
          <Trash2 className="h-4 w-4" />
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              {/* Image */}
              <Link
                to={`/products/${item.id}`}
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2 dark:bg-gray-800"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </Link>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/products/${item.id}`}
                    className="text-sm font-medium leading-snug text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400 line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => handleRemove(item)}
                    className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                    aria-label={`Remove ${truncate(item.title, 20)} from cart`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-l-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-800"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-r-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-800"
                      disabled={item.quantity >= MAX_CART_QUANTITY}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="section-title mb-4">Order Summary</h2>

            {/* Promo code */}
            <div className="mb-4">
              <label htmlFor="promo-code" className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Promo Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="promo-code"
                    type="text"
                    placeholder="BASKET10"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                    className="input-field pl-8 text-sm"
                  />
                </div>
                <button onClick={applyPromo} className="btn-secondary shrink-0 text-sm">
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="mt-1.5 text-xs text-red-500">{promoError}</p>
              )}
              {appliedPromo && (
                <p className="mt-1.5 text-xs text-primary-600 dark:text-primary-400">
                  ✓ Code &quot;{appliedPromo}&quot; applied ({(PROMO_CODES[appliedPromo] * 100).toFixed(0)}% off)
                </p>
              )}
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary-600 dark:text-primary-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? (subtotal > 0 ? 'FREE' : '—') : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>{subtotal > 0 ? formatCurrency(tax) : '—'}</span>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {subtotal < 50 && subtotal > 0 && (
              <p className="mt-3 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                Add {formatCurrency(50 - subtotal)} more for free shipping!
              </p>
            )}

            <Button
              fullWidth
              size="lg"
              className="mt-4"
              onClick={() => navigate(ROUTES.CHECKOUT)}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>

            <Link
              to={ROUTES.PRODUCTS}
              className="mt-3 flex w-full items-center justify-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
