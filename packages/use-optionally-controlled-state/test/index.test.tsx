import {fireEvent, render, screen} from '@testing-library/react';
import * as React from 'react';
import useOptionallyControlledState from '../src';

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
  const [expanded, setExpanded] = useOptionallyControlledState({
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

it('throws when neither a controlled nor an initial value is provided', () => {
  expect(() => render(<Expander />)).toThrow(
    'Either an initial or a controlled value should be provided.'
  );
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
