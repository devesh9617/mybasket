import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, CheckCircle2, ArrowLeft, ShoppingBasket } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { placeOrder } from '../services/orderService.js';
import { ROUTES } from '../constants/index.js';
import { formatCurrency, truncate } from '../utils/formatters.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [shippingData, setShippingData] = useState(null);

  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  const { register: registerShipping, handleSubmit: handleShippingSubmit, formState: { errors: shippingErrors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: user?.address || '',
      city: '',
      zip: '',
      country: 'United States',
    },
    mode: 'onBlur',
  });

  const { register: registerPayment, handleSubmit: handlePaymentSubmit, formState: { errors: paymentErrors } } = useForm({ mode: 'onBlur' });

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        <Link to={ROUTES.PRODUCTS} className="btn-primary mt-4 inline-flex">
          Browse Products
        </Link>
      </div>
    );
  }

  // Order placed success screen
  if (placedOrder) {
    return (
      <div className="page-container py-16 animate-fade-in">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <CheckCircle2 className="h-10 w-10 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Placed! 🎉</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="mt-6 card p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-xs font-medium text-gray-900 dark:text-gray-100">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(placedOrder.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. Delivery</span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date(placedOrder.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={() => navigate(ROUTES.ORDERS)} fullWidth>
              <ShoppingBasket className="h-4 w-4" />
              View My Orders
            </Button>
            <Link to={ROUTES.PRODUCTS} className="btn-secondary w-full justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onShippingSubmit = (data) => {
    setShippingData(data);
    setStep(1);
  };

  const onPaymentSubmit = () => {
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const order = await placeOrder({
        userId: user.id,
        items: items.map(({ id, title, price, quantity, image }) => ({ id, title, price, quantity, image })),
        shippingAddress: shippingData,
        paymentMethod: 'card',
        subtotal,
      });
      clearCart();
      setPlacedOrder(order);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="mx-auto max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all',
                    i <= step
                      ? 'bg-primary-600 text-white'
                      : 'border-2 border-gray-300 text-gray-400 dark:border-gray-700'
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={clsx('mt-1 text-xs', i <= step ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-400')}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx('mx-2 flex-1 h-0.5 transition-all', i < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-800')} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Step Forms */}
          <div className="lg:col-span-3">
            {step === 0 && (
              <div className="card p-6">
                <h2 className="section-title mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-600" /> Shipping Address
                </h2>
                <form onSubmit={handleShippingSubmit(onShippingSubmit)} noValidate className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full Name" name="name" id="ship-name" required error={shippingErrors.name?.message}
                      {...registerShipping('name', { required: 'Name is required' })} />
                    <Input label="Email" type="email" name="email" id="ship-email" required error={shippingErrors.email?.message}
                      {...registerShipping('email', { required: 'Email is required' })} />
                  </div>
                  <Input label="Street Address" name="address" id="ship-address" placeholder="123 Main St" required error={shippingErrors.address?.message}
                    {...registerShipping('address', { required: 'Address is required' })} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input label="City" name="city" id="ship-city" required error={shippingErrors.city?.message}
                      {...registerShipping('city', { required: 'City is required' })} />
                    <Input label="ZIP Code" name="zip" id="ship-zip" required error={shippingErrors.zip?.message}
                      {...registerShipping('zip', { required: 'ZIP is required', pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP' } })} />
                    <Input label="Country" name="country" id="ship-country" required
                      {...registerShipping('country')} />
                  </div>
                  <Button type="submit" fullWidth size="lg">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === 1 && (
              <div className="card p-6">
                <h2 className="section-title mb-5 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary-600" /> Payment Details
                </h2>
                <form onSubmit={handlePaymentSubmit(onPaymentSubmit)} noValidate className="space-y-4">
                  <Input label="Cardholder Name" name="cardName" id="card-name" placeholder="Jane Doe" required error={paymentErrors.cardName?.message}
                    {...registerPayment('cardName', { required: 'Cardholder name is required' })} />
                  <Input label="Card Number" name="cardNumber" id="card-number" placeholder="4242 4242 4242 4242" required error={paymentErrors.cardNumber?.message}
                    {...registerPayment('cardNumber', {
                      required: 'Card number is required',
                      pattern: { value: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/, message: 'Enter a valid 16-digit card number' }
                    })} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Expiry Date" name="expiry" id="card-expiry" placeholder="MM/YY" required error={paymentErrors.expiry?.message}
                      {...registerPayment('expiry', {
                        required: 'Expiry is required',
                        pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Format: MM/YY' }
                      })} />
                    <Input label="CVV" name="cvv" id="card-cvv" placeholder="123" required error={paymentErrors.cvv?.message}
                      {...registerPayment('cvv', {
                        required: 'CVV is required',
                        pattern: { value: /^\d{3,4}$/, message: '3-4 digits' }
                      })} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 This is a demo — no real payment is processed.
                  </p>
                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" fullWidth>Review Order</Button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h2 className="section-title mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-600" /> Review & Confirm
                </h2>

                {shippingData && (
                  <div className="mb-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Shipping To</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{shippingData.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData.address}, {shippingData.city} {shippingData.zip}</p>
                  </div>
                )}

                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Items ({items.length})
                </p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300 line-clamp-1 flex-1 mr-3">{truncate(item.title, 35)} × {item.quantity}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button fullWidth isLoading={isPlacing} onClick={handlePlaceOrder}>
                    Place Order · {formatCurrency(total)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-2">
            <div className="card p-4 text-sm space-y-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Summary</p>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="line-clamp-1 flex-1 mr-2">{truncate(item.title, 20)} ×{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Tax (8%)</span><span>{formatCurrency(tax)}</span></div>
              <div className="divider" />
              <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
