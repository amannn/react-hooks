import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import usePromised, {PromiseState} from '../src';

const API = {
  submitFeedback() {
    return Promise.resolve('Thank you for your feedback!');
  },
  triggerError() {
    return Promise.reject(new Error('Please login first.'));
  }
};

function FeedbackForm() {
  const [promise, setPromise] = usePromised<string, Error>();

  function onSubmit() {
    setPromise(API.submitFeedback());
  }

  function onTriggerError() {
    setPromise(API.triggerError());
  }

  function onReset() {
    setPromise(undefined);
  }

  return (
    <>
      <button disabled={promise.pending} onClick={onSubmit} type="button">
        Submit feedback
      </button>
      <button onClick={onTriggerError} type="button">
        Trigger error
      </button>
      <button onClick={onReset} type="button">
        Reset
      </button>
      <p>State: {promise.state}</p>

      {/* Direct access without checking a state variable first */}
      <p>{promise.result}</p>

      {/* Assessing the state before checking state-specific properties */}
      {promise.fulfilled && <p>Result: {promise.result}</p>}
      {promise.rejected && <p>Error: {promise.error.message}</p>}
    </>
  );
}

it('handles an async flow', async () => {
  render(<FeedbackForm />);
  screen.getByText(`State: ${PromiseState.IDLE}`);

  fireEvent.click(screen.getByText('Submit feedback'));
  screen.getByText(`State: ${PromiseState.PENDING}`);

  await waitFor(() => screen.getByText(`State: ${PromiseState.FULFILLED}`));
  screen.getByText('Result: Thank you for your feedback!');
});

it('handles errors', async () => {
  render(<FeedbackForm />);
  screen.getByText(`State: ${PromiseState.IDLE}`);

  fireEvent.click(screen.getByText('Trigger error'));
  screen.getByText(`State: ${PromiseState.PENDING}`);

  await waitFor(() => screen.getByText(`State: ${PromiseState.REJECTED}`));
  screen.getByText('Error: Please login first.');
});

it('can reset the state', async () => {
  render(<FeedbackForm />);
  screen.getByText(`State: ${PromiseState.IDLE}`);

  fireEvent.click(screen.getByText('Submit feedback'));
  screen.getByText(`State: ${PromiseState.PENDING}`);

  fireEvent.click(screen.getByText('Reset'));
  screen.getByText(`State: ${PromiseState.IDLE}`);

  // Make sure the resolved promise is ignored
  await Promise.resolve();
  screen.getByText(`State: ${PromiseState.IDLE}`);

  fireEvent.click(screen.getByText('Submit feedback'));
  screen.getByText(`State: ${PromiseState.PENDING}`);

  await waitFor(() => screen.getByText(`State: ${PromiseState.FULFILLED}`));
  fireEvent.click(screen.getByText('Reset'));
  screen.getByText(`State: ${PromiseState.IDLE}`);
});
