import { useState, useEffect } from 'react';

/**
 * Returns a debounced value that updates only after the specified delay.
 * Useful for search inputs to avoid excessive API calls on every keystroke.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
