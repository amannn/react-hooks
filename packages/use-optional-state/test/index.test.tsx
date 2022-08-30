import {fireEvent, render, screen} from '@testing-library/react';
import * as React from 'react';
import useOptionalState from '../src';

(global as any).__DEV__ = true;

type Props = {
  expanded?: boolean;
  initialExpanded?: boolean;
  onChange?(expanded: boolean): void;
};

function Expander({
  expanded: controlledExpanded,
  initialExpanded,
  onChange
}: Props) {
  const [expanded, setExpanded] = useOptionalState({
    controlledValue: controlledExpanded,
    initialValue: initialExpanded,
    onChange
  });

  function onToggle() {
    setExpanded(!expanded);
  }

  return (
    <>
      <button onClick={onToggle} type="button">
        Toggle
      </button>
      {expanded && <p>Children</p>}
    </>
  );
}

it('supports a controlled mode', () => {
  const onChange = jest.fn();

  const {rerender} = render(<Expander expanded onChange={onChange} />);
  screen.getByText('Children');
  fireEvent.click(screen.getByText('Toggle'));
  expect(onChange).toHaveBeenLastCalledWith(false);

  rerender(<Expander expanded={false} onChange={onChange} />);
  expect(screen.queryByText('Children')).toBe(null);
  fireEvent.click(screen.getByText('Toggle'));
  expect(onChange).toHaveBeenLastCalledWith(true);

  rerender(<Expander expanded />);
  screen.getByText('Children');
});

it('supports an uncontrolled mode', () => {
  const onChange = jest.fn();

  render(<Expander initialExpanded onChange={onChange} />);
  screen.getByText('Children');
  fireEvent.click(screen.getByText('Toggle'));
  expect(onChange).toHaveBeenLastCalledWith(false);

  expect(screen.queryByText('Children')).toBe(null);
  fireEvent.click(screen.getByText('Toggle'));
  expect(onChange).toHaveBeenLastCalledWith(true);
  screen.getByText('Children');
});

it('supports an uncontrolled mode with no initial value', () => {
  const onChange = jest.fn();

  render(<Expander onChange={onChange} />);
  expect(screen.queryByText('Children')).toBe(null);
  fireEvent.click(screen.getByText('Toggle'));
  expect(onChange).toHaveBeenLastCalledWith(true);

  screen.getByText('Children');
  fireEvent.click(screen.getByText('Toggle'));
  expect(onChange).toHaveBeenLastCalledWith(false);
  expect(screen.queryByText('Children')).toBe(null);
});

it('allows to use an initial value without a change handler', () => {
  // Maybe the value is read from the DOM directly
  render(<Expander initialExpanded />);
});

it('allows using a controlled value without a change handler', () => {
  // Forced static value
  render(<Expander expanded />);
});

it('uses the controlled value when both a controlled as well as an initial value is provided', () => {
  render(<Expander expanded initialExpanded={false} />);
  screen.getByText('Children');
});

it('throws when switching from uncontrolled to controlled mode', () => {
  const {rerender} = render(<Expander initialExpanded />);

  expect(() => rerender(<Expander expanded />)).toThrow(
    /Can not change from uncontrolled to controlled mode./
  );
});

it('throws when switching from controlled to uncontrolled mode', () => {
  const {rerender} = render(<Expander expanded />);

  expect(() => rerender(<Expander initialExpanded />)).toThrow(
    /Can not change from controlled to uncontrolled mode./
  );
});

/**
 * Type signature tests
 */

function TestTypes() {
  const controlled = useOptionalState({
    controlledValue: true
  });
  controlled[0].valueOf();

  const uncontrolledWithInitialValue = useOptionalState({
    initialValue: true
  });
  // @ts-expect-error Null-check would be necessary
  uncontrolledWithInitialValue[0].valueOf();

  const uncontrolledWithoutInitialValue = useOptionalState<boolean>(
    {}
  );
  // @ts-expect-error Null-check would be necessary
  uncontrolledWithoutInitialValue[0].valueOf();

  // Only used for type tests; mark the variables as used
  // eslint-disable-next-line no-unused-expressions
  [controlled, uncontrolledWithInitialValue, uncontrolledWithoutInitialValue];
}

// Expected return type: `[boolean, (value: boolean) => void]`
function Controlled(opts: {controlledValue: boolean; initialValue?: boolean}) {
  const [value, setValue] = useOptionalState(opts);

  setValue(true);
  return value.valueOf();
}

// Expected return type: `[boolean | undefined, (value: boolean) => void]`
// Note that theoretically `undefined` shouldn't be possible here,
// but the types seem to be quite hard to get right.
function UncontrolledWithInitialValue(opts: {
  controlledValue?: boolean;
  initialValue: boolean;
}) {
  const [value, setValue] = useOptionalState(opts);

  setValue(true);

  // @ts-expect-error Null-check would be necessary
  return value.valueOf();
}

// Expected return type: `[boolean | undefined, (value: boolean) => void]`
function UncontrolledWithoutInitialValue(opts: {
  controlledValue?: boolean;
  initialValue?: boolean;
}) {
  const [value, setValue] = useOptionalState(opts);

  setValue(true);

  // @ts-expect-error Null-check would be necessary
  return value.valueOf();
}

// Only used for type tests; mark the functions as used
// eslint-disable-next-line no-unused-expressions
[
  TestTypes,
  Controlled,
  UncontrolledWithInitialValue,
  UncontrolledWithoutInitialValue
];
