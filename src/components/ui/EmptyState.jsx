import { ShoppingBasket, Package, Search, FileText } from 'lucide-react';

const iconMap = {
  basket: ShoppingBasket,
  package: Package,
  search: Search,
  file: FileText,
};

/**
 * Consistent empty state component used throughout the app.
 */
const EmptyState = ({
  icon = 'package',
  title = 'Nothing here yet',
  description = '',
  action = null,
  className = '',
}) => {
  const Icon = iconMap[icon] || Package;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
