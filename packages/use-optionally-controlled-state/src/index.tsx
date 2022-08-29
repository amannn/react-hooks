import {useState, useCallback} from 'react';
import useConstant from 'use-constant';

/**
 * Enables a component state to be either controlled or uncontrolled.
 */
export default function useOptionallyControlledState<
  ControlledValue,
  InitialValue,
  Value = undefined extends ControlledValue ? InitialValue : ControlledValue
>({
  controlledValue,
  initialValue,
  onChange
}: {
  controlledValue?: ControlledValue;
  initialValue?: InitialValue;
  onChange?(value: Value): void;
}): [Value, (value: Value) => void] {
  const isControlled = controlledValue !== undefined;
  const initialIsControlled = useConstant(() => isControlled);
  const [stateValue, setStateValue] = useState<Value | undefined>(
    initialValue as Value | undefined
  );

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
    [isControlled, onChange]
  );

  return [value as Value, onValueChange];
}
