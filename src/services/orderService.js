import { LOCAL_STORAGE_KEYS } from '../constants/index.js';
import { generateOrderId } from '../utils/formatters.js';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

/**
 * Get orders for a specific user
 */
export const getOrders = async (userId) => {
  await delay(400);
  const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  return all.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId, userId) => {
  await delay(300);
  const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  const order = all.find((o) => o.id === orderId && o.userId === userId);
  if (!order) throw new Error('Order not found.');
  return order;
};

/**
 * Place a new order from cart items
 */
export const placeOrder = async ({ userId, items, shippingAddress, paymentMethod, subtotal }) => {
  await delay(900);

  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  const order = {
    id: generateOrderId(),
    userId,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    tax: parseFloat(tax.toFixed(2)),
    shipping,
    total: parseFloat(total.toFixed(2)),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  all.unshift(order);
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(all));

  return order;
};

/**
 * Cancel an order (only if pending/processing)
 */
export const cancelOrder = async (orderId, userId) => {
  await delay(400);

  const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  const index = all.findIndex((o) => o.id === orderId && o.userId === userId);

  if (index === -1) throw new Error('Order not found.');
  if (!['pending', 'processing'].includes(all[index].status)) {
    throw new Error('This order cannot be cancelled.');
  }

  all[index].status = 'cancelled';
  all[index].updatedAt = new Date().toISOString();
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(all));

  return all[index];
};

/**
 * Get all orders (admin view)
 */
export const getAllOrders = async () => {
  await delay(500);
  const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS) || '[]');
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
