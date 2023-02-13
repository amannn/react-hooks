import {render, waitFor} from '@testing-library/react';
import * as React from 'react';
import {usePresenceSwitch} from '../src';

function Expander({
  initialEnter,
  text,
  transitionDuration = 50
}: {
  initialEnter?: boolean;
  text?: string;
  transitionDuration?: number;
}) {
  const {mountedItem, ...values} = usePresenceSwitch(text, {
    transitionDuration,
    initialEnter
  });
  const {isMounted, isVisible} = values;
  const testId =
    Object.entries(values)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(', ') || 'none';

  return (
    <div data-testid={testId}>
      {isMounted ? (
        <div
          style={{
            opacity: 0,
            transitionDuration: `${transitionDuration}ms`,
            transitionProperty: 'opacity',
            ...(isVisible && {
              opacity: 1
            })
          }}
        >
          {mountedItem}
        </div>
      ) : (
        <div>Nothing mounted</div>
      )}
    </div>
  );
}

it("can animate the exit and re-entrance of a component that has changed it's rendered data", async () => {
  const {getByTestId, getByText, rerender} = render(
    <Expander text="initial value" />
  );
  getByTestId('isVisible, isMounted');
  getByText('initial value');
  rerender(<Expander text="re-assigned value" />);
  getByTestId('isAnimating, isExiting, isMounted');
  getByText('initial value');
  await waitFor(() => getByTestId('isVisible, isMounted'));
  getByText('re-assigned value');
});

it("can animate the initial entrance and exit of a component based on it's rendered data", async () => {
  const {getByTestId, getByText, rerender} = render(
    <Expander text={undefined} />
  );
  getByTestId('none');
  getByText('Nothing mounted');
  rerender(<Expander text="initial value" />);
  getByTestId('isAnimating, isEntering, isMounted');
  getByText('initial value');
  await waitFor(() => getByTestId('isVisible, isMounted'));
  rerender(<Expander text={undefined} />);
  getByTestId('isAnimating, isExiting, isMounted');
  getByText('initial value');
  await waitFor(() => getByTestId('none'));
  getByText('Nothing mounted');
});
