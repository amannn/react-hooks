import {useState, useCallback} from 'react';
import useConstant from 'use-constant';

// Controlled
export default function useOptionallyControlledState<Value>({
  controlledValue,
  initialValue,
  onChange
}: {
  controlledValue: Value;
  initialValue?: Value;
  onChange?(value: Value): void;
}): [Value, (value: Value) => void];

// Uncontrolled without initial value
export default function useOptionallyControlledState<Value>({
  controlledValue,
  initialValue,
  onChange
}: {
  controlledValue?: Value;
  initialValue?: Value;
  onChange?(value: Value): void;
}): [Value | undefined, (value: Value) => void];

// Uncontrolled with initial value
export default function useOptionallyControlledState<Value>({
  controlledValue,
  initialValue,
  onChange
}: {
  controlledValue?: Value;
  initialValue: Value;
  onChange?(value: Value): void;
}): [Value, (value: Value) => void];

/**
 * Enables a component state to be either controlled or uncontrolled.
 */
export default function useOptionallyControlledState<Value>({
  controlledValue,
  initialValue,
  onChange
}: any) {
  const isControlled = controlledValue !== undefined;
  const initialIsControlled = useConstant(() => isControlled);
  const [stateValue, setStateValue] = useState<Value>(initialValue);

  if (__DEV__) {
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

  // Options type ensures that either `controlledValue` or `stateValue` is defined
  const value = (isControlled ? controlledValue : stateValue)!;

  const onValueChange = useCallback(
    (nextValue: Value) => {
      if (!isControlled) setStateValue(nextValue);
      if (onChange) onChange(nextValue);
    },
    [onChange, isControlled]
  );

  return [value, onValueChange];
}
