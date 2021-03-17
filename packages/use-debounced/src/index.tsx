import {useEffect, useRef, useReducer} from 'react';

/**
 * Debounces the provided value in render. If `delay`
 * is zero, the value is updated synchronously.
 * @param {T} value
 * @param {Number} delay
 * @return {T}
 */
export default function useDebounced<T>(value: T, delay = 300) {
  const isSynchronous = delay === 0;
  const [, forceUpdate] = useReducer(() => ({}), {});

  // We initialize the state intentionally with `undefined`, so that the
  // first actual value is only set when the first timer has finished.
  const debouncedValueRef = useRef<T | undefined>(undefined);

  const returnedValue = isSynchronous ? value : debouncedValueRef.current;

  useEffect(() => {
    // We still need to set the debounced value, even if it was returned
    // synchronously. When the delay increases, we need to be able to return
    // the previous value until the new one is applied.
    const timeoutId = setTimeout(() => {
      debouncedValueRef.current = value;

      if (!isSynchronous && value !== returnedValue) {
        forceUpdate();
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay, isSynchronous, value, returnedValue]);

  return returnedValue;
}
