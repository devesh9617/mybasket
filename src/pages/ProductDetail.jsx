import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Check, Minus, Plus, Package } from 'lucide-react';
import { fetchProductById, fetchProductsByCategory } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency, truncate, titleCase } from '../utils/formatters.js';
import { ROUTES, MAX_CART_QUANTITY } from '../constants/index.js';
import { Skeleton, ProductCardSkeleton } from '../components/ui/Skeleton.jsx';
import ProductCard from '../components/products/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const inCart = product ? isInCart(product.id) : false;
  const cartQty = product ? getItemQuantity(product.id) : 0;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      setProduct(null);
      setRelated([]);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        // Fetch related products (same category, exclude current)
        const rel = await fetchProductsByCategory(data.category);
        setRelated(rel.filter((p) => p.id !== data.id).slice(0, 4));
      } catch {
        setError('Product not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`Added ${qty}x "${truncate(product.title, 25)}" to cart!`, { icon: '🛒' });
  };

  const handleQuantityChange = (delta) => {
    if (inCart) {
      updateQuantity(product.id, cartQty + delta);
    } else {
      setQty((prev) => Math.min(Math.max(prev + delta, 1), MAX_CART_QUANTITY));
    }
  };

  const displayQty = inCart ? cartQty : qty;

  const ratingStars = product
    ? Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating.rate))
    : [];

  if (error) {
    return (
      <div className="page-container py-16 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{error}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost mb-6 text-sm"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      {/* Main product section */}
      {isLoading ? (
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ) : product ? (
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-10 dark:border-gray-800 dark:bg-gray-900">
            <img
              src={product.image}
              alt={product.title}
              className="h-80 w-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="mb-2 text-sm font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {titleCase(product.category)}
            </span>

            <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-gray-100">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-0.5" aria-label={`Rating: ${product.rating.rate} out of 5`}>
                {ratingStars.map((filled, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'h-4 w-4',
                      filled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.rating.rate}
              </span>
              <span className="text-sm text-gray-400">({product.rating.count} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {formatCurrency(product.price)}
              </span>
              {product.price > 50 && (
                <span className="ml-3 badge-green">Free Shipping</span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="mt-6 flex items-center gap-3">
              {/* Qty controls */}
              <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={displayQty <= (inCart ? 0 : 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-l-lg text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span
                  className="flex h-10 min-w-[2.5rem] items-center justify-center text-sm font-semibold text-gray-900 dark:text-gray-100"
                  aria-live="polite"
                  aria-label={`Quantity: ${displayQty}`}
                >
                  {displayQty}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={displayQty >= MAX_CART_QUANTITY}
                  className="flex h-10 w-10 items-center justify-center rounded-r-lg text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add to cart */}
              {inCart ? (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => navigate(ROUTES.CART)}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  View in Cart
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  Add to Cart
                </Button>
              )}
            </div>

            {/* Go to cart shortcut */}
            {inCart && (
              <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
                ✓ {cartQty} item{cartQty !== 1 ? 's' : ''} in your cart
              </p>
            )}

            {/* Free shipping note */}
            <div className="mt-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
              🚚 Free shipping on orders over $50 · Returns within 30 days
            </div>
          </div>
        </div>
      ) : null}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title mb-5">Related Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
