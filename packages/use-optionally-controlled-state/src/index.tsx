import {useState, useCallback, useRef} from 'react';
import useConstant from 'use-constant';

/**
 * Enables a component state to be either controlled or uncontrolled.
 */
export default function useOptionallyControlledState<Value>({
  controlledValue,
  initialValue,
  onChange
}: {
  controlledValue?: Value;
  initialValue?: Value;
  onChange?(value: Value): void;
}): [Value | undefined, (value: Value) => void] {
  const isControlled = controlledValue !== undefined;
  const initialIsControlled = useConstant(() => isControlled);
  const [stateValue, setStateValue] = useState(initialValue);

  if (__DEV__) {
    if (initialValue === undefined && controlledValue === undefined) {
      throw new Error(
        'Either an initial or a controlled value should be provided.'
      );
    }

    if (initialIsControlled && !isControlled) {
      throw new Error(
        'Can not change from controlled to uncontrolled mode. If `undefined` needs to be used for controlled values, please use `null` instead.'
      );
    }

    if (!initialIsControlled && isControlled) {
      throw new Error(
        'Can not change from uncontrolled to controlled mode. Please supply an initial value other than `undefined` to make the state controlled over its lifetime. If `undefined` needs to be used for controlled values, please use `null` instead.'
      );
    }
  }

  const value = isControlled ? controlledValue : stateValue;

  const isControlledRef = useRef(false);
  isControlledRef.current = isControlled;
  const onValueChange = useCallback(
    (nextValue: Value) => {
      if (!isControlledRef.current) setStateValue(nextValue);
      if (onChange) onChange(nextValue);
    },
    [onChange]
  );

  return [value, onValueChange];
}
