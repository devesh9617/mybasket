import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Lock, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { changePassword } from '../services/authService.js';
import { validationRules } from '../utils/validators.js';
import { getInitials } from '../utils/formatters.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
    mode: 'onBlur',
  });

  const pwForm = useForm({ mode: 'onBlur' });

  const onProfileSubmit = async (data) => {
    setIsUpdating(true);
    try {
      await updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsChangingPw(true);
    try {
      await changePassword(user.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      pwForm.reset();
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPw(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile & Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account information and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Profile card */}
        <div className="card p-6 text-center lg:col-span-1">
          <div className="relative mx-auto mb-4 h-20 w-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
              {getInitials(user?.name)}
            </div>
            <button
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-400"
              aria-label="Change profile picture"
              title="Profile pictures not supported in demo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="mt-2 inline-flex badge-blue">Admin</span>
          )}
          <p className="mt-3 text-xs text-gray-400">
            Joined{' '}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'Recently'}
          </p>

          {/* Tab nav */}
          <nav className="mt-5 space-y-1 text-left">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'w-full rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                )}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="section-title mb-5">Personal Information</h2>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    name="name"
                    id="profile-name"
                    required
                    leftIcon={User}
                    error={profileForm.formState.errors.name?.message}
                    {...profileForm.register('name', validationRules.name)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    id="profile-email"
                    required
                    leftIcon={Mail}
                    error={profileForm.formState.errors.email?.message}
                    {...profileForm.register('email', validationRules.email)}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    id="profile-phone"
                    placeholder="+1 (555) 000-0000"
                    leftIcon={Phone}
                    error={profileForm.formState.errors.phone?.message}
                    {...profileForm.register('phone', validationRules.phone)}
                  />
                  <Input
                    label="Default Address"
                    name="address"
                    id="profile-address"
                    placeholder="123 Main St, City"
                    leftIcon={MapPin}
                    {...profileForm.register('address')}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" isLoading={isUpdating}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="section-title mb-5">Change Password</h2>
              <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} noValidate className="space-y-4 max-w-sm">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  id="current-pw"
                  required
                  leftIcon={Lock}
                  error={pwForm.formState.errors.currentPassword?.message}
                  {...pwForm.register('currentPassword', { required: 'Current password is required' })}
                />
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  id="new-pw"
                  required
                  leftIcon={Lock}
                  error={pwForm.formState.errors.newPassword?.message}
                  helperText="Min 8 chars, uppercase, lowercase, and number"
                  {...pwForm.register('newPassword', validationRules.password)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  id="confirm-pw"
                  required
                  leftIcon={Lock}
                  error={pwForm.formState.errors.confirmPassword?.message}
                  {...pwForm.register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (v) => v === pwForm.watch('newPassword') || 'Passwords do not match',
                  })}
                />
                <Button type="submit" isLoading={isChangingPw}>
                  Update Password
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="section-title mb-2">Account Details</h2>
                <dl className="space-y-3 text-sm">
                  {[
                    { label: 'User ID', value: user?.id },
                    { label: 'Role', value: user?.role },
                    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="card border-red-200 p-6 dark:border-red-900/50">
                <h2 className="mb-2 font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  size="sm"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" size="sm">
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a demo application — account deletion is not implemented. In a real app, this would permanently delete your account and all associated data.
          </p>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setShowDeleteModal(false)}>Got it</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
