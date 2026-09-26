import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/index.js';
import { validationRules, getPasswordStrength } from '../utils/validators.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const strength = getPasswordStrength(passwordValue);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const password = watch('password', '');

  useEffect(() => {
    setPasswordValue(password);
  }, [password]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome to MyBasket 🎉');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Join MyBasket and start shopping smarter
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Full name"
          type="text"
          name="name"
          id="register-name"
          autoComplete="name"
          placeholder="Jane Doe"
          required
          leftIcon={User}
          error={errors.name?.message}
          {...register('name', validationRules.name)}
        />

        <Input
          label="Email address"
          type="email"
          name="email"
          id="register-email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            id="register-password"
            autoComplete="new-password"
            placeholder="Min 8 chars, upper + lower + number"
            required
            leftIcon={Lock}
            error={errors.password?.message}
            {...register('password', validationRules.password)}
          />
          {/* Password strength indicator */}
          {passwordValue && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={clsx(
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      level <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Strength:{' '}
                <span
                  className={clsx(
                    'font-medium',
                    strength.score <= 2 ? 'text-red-500' : strength.score <= 3 ? 'text-yellow-500' : 'text-primary-600'
                  )}
                >
                  {strength.label || 'Enter a password'}
                </span>
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          id="register-confirm-password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          required
          leftIcon={Lock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          className="mt-2"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default Register;
