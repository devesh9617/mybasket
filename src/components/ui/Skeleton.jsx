import clsx from 'clsx';

/**
 * Skeleton loading placeholder with pulse animation.
 */
export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={clsx('skeleton', className)}
    aria-hidden="true"
    {...props}
  />
);

/**
 * Skeleton for a product card
 */
export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <Skeleton className="h-56 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-16 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for a stat card
 */
export const StatCardSkeleton = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  </div>
);

/**
 * Skeleton for a table row
 */
export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full max-w-[140px]" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
