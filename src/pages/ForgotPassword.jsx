import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, SendHorizontal } from 'lucide-react';
import { forgotPassword } from '../services/authService.js';
import { ROUTES } from '../constants/index.js';
import { validationRules } from '../utils/validators.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success('Reset instructions sent (demo mode)');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            <Mail className="h-7 w-7 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-center text-xl font-bold text-gray-900 dark:text-gray-100">Check your email</h1>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          If an account exists with that email, we&apos;ve sent password reset instructions.
        </p>
        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          (Demo mode — no actual email is sent)
        </p>
        <Link to={ROUTES.LOGIN} className="btn-primary mt-6 w-full justify-center">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Forgot password?</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          id="forgot-email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          <SendHorizontal className="h-4 w-4" />
          Send Reset Instructions
        </Button>
      </form>

      <div className="mt-5 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;
