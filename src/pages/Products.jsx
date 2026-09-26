import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  fetchProducts,
  fetchCategories,
  fetchProductsByCategory,
  sortProducts,
  filterProductsBySearch,
} from '../services/productService.js';
import ProductCard from '../components/products/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import useDebounce from '../hooks/useDebounce.js';
import usePagination from '../hooks/usePagination.js';
import { SORT_OPTIONS, CATEGORY_LABELS, ITEMS_PER_PAGE } from '../constants/index.js';
import { titleCase } from '../utils/formatters.js';
import clsx from 'clsx';

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 350);

  // Fetch categories once
  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(['all', ...cats]))
      .catch(() => setCategories(['all']));
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data =
          selectedCategory === 'all'
            ? await fetchProducts()
            : await fetchProductsByCategory(selectedCategory);
        setAllProducts(data);
      } catch {
        setError('Failed to load products. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory]);

  // Derived filtered + sorted products
  const processedProducts = useMemo(() => {
    const filtered = filterProductsBySearch(allProducts, debouncedSearch);
    return sortProducts(filtered, sortBy);
  }, [allProducts, debouncedSearch, sortBy]);

  const pagination = usePagination(processedProducts, ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || sortBy !== 'default';

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isLoading
            ? 'Loading products…'
            : `${processedProducts.length} product${processedProducts.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Search + Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 pr-9"
            aria-label="Search products"
            id="product-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field w-auto min-w-[160px]"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={clsx(
            'btn-secondary shrink-0 sm:hidden',
            hasActiveFilters && 'border-primary-500 text-primary-600 dark:border-primary-500 dark:text-primary-400'
          )}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters{hasActiveFilters && ' •'}
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <aside
          className={clsx(
            'shrink-0',
            'hidden sm:block w-48',
            showFilters && 'block w-full sm:w-48'
          )}
          aria-label="Category filters"
        >
          <div className="card p-3">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </p>
            <nav className="space-y-0.5">
              {(categories.length > 1 ? categories : ['all']).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    'w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors',
                    selectedCategory === cat
                      ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  )}
                  aria-pressed={selectedCategory === cat}
                >
                  {CATEGORY_LABELS[cat] || titleCase(cat)}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {error ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => setSelectedCategory(selectedCategory)}
                className="btn-primary mt-4 text-sm"
              >
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : pagination.paginatedData.length === 0 ? (
            <EmptyState
              icon="search"
              title="No products found"
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'No products available in this category.'
              }
              action={
                hasActiveFilters ? (
                  <button onClick={clearFilters} className="btn-primary text-sm">
                    Clear filters
                  </button>
                ) : null
              }
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pagination.paginatedData.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <Pagination
                  {...pagination}
                  onPageChange={pagination.goToPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
