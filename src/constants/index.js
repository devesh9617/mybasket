export const APP_NAME = 'MyBasket';
export const APP_DESCRIPTION = 'Your smart grocery shopping companion';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};

export const CATEGORIES = {
  ALL: 'all',
  ELECTRONICS: 'electronics',
  JEWELERY: "jewelery",
  MENS_CLOTHING: "men's clothing",
  WOMENS_CLOTHING: "women's clothing",
};

export const CATEGORY_LABELS = {
  all: 'All Products',
  electronics: 'Electronics',
  jewelery: 'Jewellery',
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
};

export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STYLES = {
  pending: 'badge-yellow',
  processing: 'badge-blue',
  shipped: 'badge-blue',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

export const ITEMS_PER_PAGE = 8;

export const MAX_CART_QUANTITY = 10;

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'mb_auth_user',
  CART: 'mb_cart',
  ORDERS: 'mb_orders',
  USERS: 'mb_users',
  THEME: 'mb_theme',
};

export const DEMO_CREDENTIALS = {
  email: 'demo@mybasket.com',
  password: 'Demo@12345',
  name: 'Demo User',
  role: 'user',
};

export const ADMIN_CREDENTIALS = {
  email: 'admin@mybasket.com',
  password: 'Admin@12345',
  name: 'Admin User',
  role: 'admin',
};
