import { LOCAL_STORAGE_KEYS, DEMO_CREDENTIALS, ADMIN_CREDENTIALS } from '../constants/index.js';

/**
 * Simulate a simple JWT-style token (base64 encoded payload)
 * In a real app this would come from your backend.
 */
const createToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  const sig = btoa(`${header}.${body}.signature`);
  return `${header}.${body}.${sig}`;
};

/**
 * Seed default users if none exist in localStorage
 */
const seedDefaultUsers = () => {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  if (existing) return JSON.parse(existing);

  const defaultUsers = [
    {
      id: 'user-demo',
      name: DEMO_CREDENTIALS.name,
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      role: DEMO_CREDENTIALS.role,
      avatar: null,
      phone: '+1 (555) 000-0000',
      address: '123 Demo Street, San Francisco, CA 94102',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'user-admin',
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
      role: ADMIN_CREDENTIALS.role,
      avatar: null,
      phone: '+1 (555) 000-0001',
      address: '456 Admin Ave, San Francisco, CA 94103',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  return defaultUsers;
};

/**
 * Simulate network latency for a realistic feel
 */
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

/**
 * Register a new user
 */
export const register = async ({ name, email, password }) => {
  await delay(800);

  const users = seedDefaultUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In real app: bcrypt hash on backend
    role: 'user',
    avatar: null,
    phone: '',
    address: '',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));

  const { password: _, ...userWithoutPassword } = newUser;
  const token = createToken({ id: newUser.id, email: newUser.email, role: newUser.role });

  return { user: userWithoutPassword, token };
};

/**
 * Login with email and password
 */
export const login = async ({ email, password }) => {
  await delay(700);

  const users = seedDefaultUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password. Please try again.');
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = createToken({ id: user.id, email: user.email, role: user.role });

  return { user: userWithoutPassword, token };
};

/**
 * Update user profile in localStorage
 */
export const updateProfile = async (userId, updates) => {
  await delay(600);

  const users = seedDefaultUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) throw new Error('User not found.');

  // Prevent email conflict
  if (updates.email) {
    const emailConflict = users.find(
      (u) => u.email.toLowerCase() === updates.email.toLowerCase() && u.id !== userId
    );
    if (emailConflict) throw new Error('Email is already in use by another account.');
  }

  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));

  const { password: _, ...userWithoutPassword } = users[index];
  return userWithoutPassword;
};

/**
 * Change user password
 */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  await delay(600);

  const users = seedDefaultUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) throw new Error('User not found.');
  if (users[index].password !== currentPassword) {
    throw new Error('Current password is incorrect.');
  }

  users[index].password = newPassword;
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Simulate forgot password — returns a reset token
 */
export const forgotPassword = async (email) => {
  await delay(800);

  const users = seedDefaultUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Don't reveal if email exists — security best practice
    return { message: 'If an account exists, a reset link has been sent.' };
  }

  // In a real app: send email with token. Here we simulate.
  return { message: 'If an account exists, a reset link has been sent.' };
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  await delay(500);
  const users = seedDefaultUsers();
  return users.map(({ password: _, ...u }) => u);
};
