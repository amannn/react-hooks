import {render, screen} from '@testing-library/react';
import * as React from 'react';
import useLast from '../src';

function LastEvenValue({value}: {value: number}) {
  const evenValue = useLast(value, value % 2 === 0);
  return <p>{evenValue}</p>;
}

it('accepts values meeting the condition', () => {
  const {rerender} = render(<LastEvenValue value={2} />);
  screen.getByText('2');

  rerender(<LastEvenValue value={4} />);
  screen.getByText('4');
});

it('skips values not meeting the condition', () => {
  const {rerender} = render(<LastEvenValue value={2} />);
  screen.getByText('2');

  rerender(<LastEvenValue value={3} />);
  screen.getByText('2');

  rerender(<LastEvenValue value={4} />);
  screen.getByText('4');
});

it('skips over undefined values by default', () => {
  function LastDefinedValue({value}: {value?: number}) {
    const definedValue = useLast(value);
    return <p>{definedValue}</p>;
  }

  const {rerender} = render(<LastDefinedValue value={2} />);
  screen.getByText('2');

  rerender(<LastDefinedValue value={undefined} />);
  screen.getByText('2');
});
