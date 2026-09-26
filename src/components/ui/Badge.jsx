import clsx from 'clsx';

const variantClasses = {
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  blue: 'badge-blue',
  gray: 'badge-gray',
};

/**
 * Badge / chip component for statuses and labels.
 */
const Badge = ({ children, variant = 'gray', className = '', dot = false }) => (
  <span className={clsx(variantClasses[variant], className)}>
    {dot && (
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full',
          variant === 'green' && 'bg-primary-500',
          variant === 'yellow' && 'bg-yellow-500',
          variant === 'red' && 'bg-red-500',
          variant === 'blue' && 'bg-blue-500',
          variant === 'gray' && 'bg-gray-400'
        )}
        aria-hidden="true"
      />
    )}
    {children}
  </span>
);

export default Badge;
