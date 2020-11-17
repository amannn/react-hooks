import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import usePromised, {PromiseState} from '../src';

const API = {
  submitFeedback() {
    return Promise.resolve('Thank you for your feedback!');
  },
  triggerError() {
    return Promise.reject('Please login first.');
  }
};

function FeedbackForm() {
  const [promise, setPromise] = usePromised<string>();

  function onSubmit() {
    setPromise(API.submitFeedback());
  }

  function onTriggerError() {
    setPromise(API.triggerError());
  }

  return (
    <>
      <button
        disabled={promise.state === PromiseState.PENDING}
        onClick={onSubmit}
        type="button"
      >
        Submit feedback
      </button>
      <button onClick={onTriggerError} type="button">
        Trigger error
      </button>
      <p>State: {promise.state}</p>
      {promise.state === PromiseState.FULFILLED && (
        <p>Result: {promise.result}</p>
      )}
      {promise.state === PromiseState.REJECTED && <p>Error: {promise.error}</p>}
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
