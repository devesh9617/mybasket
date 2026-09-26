import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

/**
 * Reusable Input component with label, error, helper text, and password toggle.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      required = false,
      className = '',
      containerClassName = '',
      leftIcon: LeftIcon,
      rightElement,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-0.5 text-red-500" aria-hidden="true"> *</span>}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LeftIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            id={props.id || props.name}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.name}-error` : helperText ? `${props.name}-hint` : undefined}
            className={clsx(
              'input-field',
              LeftIcon && 'pl-10',
              (isPassword || rightElement) && 'pr-10',
              error && 'input-error',
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {!isPassword && rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${props.name}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${props.name}-hint`} className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
