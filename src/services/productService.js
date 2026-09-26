import api from './api.js';

/**
 * Fetch all products with optional limit
 */
export const fetchProducts = async (limit) => {
  const url = limit ? `/products?limit=${limit}` : '/products';
  const { data } = await api.get(url);
  return data;
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  const { data } = await api.get('/products/categories');
  return data;
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = async (category) => {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`);
  return data;
};

/**
 * Sort products client-side based on sort option string
 */
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

/**
 * Filter products by search query against title and category
 */
export const filterProductsBySearch = (products, query) => {
  if (!query.trim()) return products;
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );
};
