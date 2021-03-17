import {render, waitFor} from '@testing-library/react';
import * as React from 'react';
import useDebounced from '../src';

function DebouncedValue({delay = 100}) {
  const debouncedValue = useDebounced('Hello', delay);
  return <p>{debouncedValue}</p>;
}

it('delays the rendering of the provided value', async () => {
  const {container} = render(<DebouncedValue />);
  expect(container.innerHTML).toBe('<p></p>');

  await waitFor(() => {
    expect(container.innerHTML).toBe('<p>Hello</p>');
  });
});

it('sets the value synchronously if the delay is zero', () => {
  const {container} = render(<DebouncedValue delay={0} />);
  expect(container.innerHTML).toBe('<p>Hello</p>');
});
