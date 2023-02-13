import {render, waitFor} from '@testing-library/react';
import * as React from 'react';
import usePresence from '../src';

function Expander({
  children,
  initialEnter,
  isOpen,
  transitionDuration = 50
}: {
  initialEnter?: boolean;
  children: React.ReactNode;
  isOpen: boolean;
  transitionDuration?: number;
}) {
  const values = usePresence(isOpen, {transitionDuration, initialEnter});
  const {isAnimating, isMounted, isVisible} = values;
  const testId =
    Object.entries(values)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(', ') || 'none';

  return (
    <div data-testid={testId}>
      {isMounted && (
        <div
          style={{
            overflow: 'hidden',
            maxHeight: 0,
            transitionDuration: `${transitionDuration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionProperty: 'max-height, opacity',
            opacity: 0,
            ...(isVisible && {
              maxHeight: 9999,
              opacity: 1,
              transitionTimingFunction: 'cubic-bezier(0.8, 0, 0.6, 1)'
            }),
            ...(isAnimating && {willChange: 'max-height, opacity'})
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Component(
  props: Omit<React.ComponentProps<typeof Expander>, 'children'>
) {
  return <Expander {...props}>Hello</Expander>;
}

it('immediately mounts an element by default without animation', () => {
  const {getByTestId} = render(<Component isOpen />);
  getByTestId('isMounted, isVisible');
});

it('can animate the appearance of an element', async () => {
  const {getByTestId} = render(<Component initialEnter isOpen />);
  getByTestId('isMounted, isAnimating, isEntering');
  await waitFor(() =>
    getByTestId('isMounted, isVisible, isAnimating, isEntering')
  );
  await waitFor(() => getByTestId('isMounted, isVisible'));
});

it('can animate the exit of an element', async () => {
  const {getByTestId, rerender} = render(<Component isOpen />);
  getByTestId('isMounted, isVisible');
  rerender(<Component isOpen={false} />);
  getByTestId('isMounted, isAnimating, isExiting');
  await waitFor(() => getByTestId('isMounted, isAnimating, isExiting'));
  await waitFor(() => getByTestId('none'));
});
