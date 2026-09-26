import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency, truncate, titleCase } from '../../utils/formatters.js';
import { ROUTES } from '../../constants/index.js';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ProductCard = ({ product }) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation
    addItem(product);
    toast.success(`"${truncate(product.title, 30)}" added to cart!`, {
      icon: '🛒',
    });
  };

  const categoryPath = ROUTES.PRODUCT_DETAIL.replace(':id', product.id);

  return (
    <Link
      to={categoryPath}
      className="card card-hover group flex flex-col overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`View ${product.title}, ${formatCurrency(product.price)}`}
    >
      {/* Image */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-50 p-4 dark:bg-gray-800/50">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {/* Rating chip */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm dark:bg-gray-900/80">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-200">{product.rating?.rate}</span>
          <span className="text-gray-400">({product.rating?.count})</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1.5 text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
          {titleCase(product.category)}
        </span>
        <h3 className="flex-1 text-sm font-medium leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">
          {product.title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={inCart}
            aria-label={inCart ? 'Already in cart' : 'Add to cart'}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95',
              inCart
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            )}
          >
            {inCart ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
