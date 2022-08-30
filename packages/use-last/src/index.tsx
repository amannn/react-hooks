import {useRef} from 'react';

/**
 * Returns the latest version of `value` that matches a critera.
 * By default the value is checked for `!== undefined`.
 */
export default function useLast<Value>(value: Value, isValid?: boolean) {
  const lastValueRef = useRef<Value>();

  if (isValid === undefined) {
    isValid = value !== undefined;
  }

  if (isValid) {
    lastValueRef.current = value;
  }

  return lastValueRef.current;
}
