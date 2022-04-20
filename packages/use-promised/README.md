# use-promised

[![Stable release](https://img.shields.io/npm/v/use-promised.svg)](https://npm.im/use-promised)

A React hook to implement asynchronous callbacks without having to deal with asynchronicity.

## The problem

Can you tell what could go wrong with this code?

```jsx
function FeedbackForm() {
  const [result, setResult] = useState();
  const [error, setError] = useState();

  function onSubmit() {
    API.submitFeedback()
      .then((receivedResult) => {
        setResult(receivedResult);
      })
      .catch((receivedError) => {
        setError(receivedError);
      });
  }

  return (
    <>
      <button onClick={onSubmit} type="button">
        Submit feedback
      </button>
      <p>Result: {result}</p>
      <p>Error: {error}</p>
      ...
    </>
  );
}
```

Here are some issues with this code:

1. The button can be submitted multiple times while the operation is pending. The fix is adding more state to track the loading state.
2. When the button is clicked multiple times, there's a race condition which result will be shown eventually.
3. When the component unmounts in the middle of the request, you'll see the dreaded "Can't perform a React state update on an unmounted component" warning.
4. If an error is received, it won't be removed when a new attempt is made – even if a subsequent request succeeds.

The list goes on but the point is: **Handling async callbacks in React components is hard**.

Maybe you've heard that you can avoid these issues by moving your code into `useEffect`, but [that hook has its own peculiarities to be aware of](https://overreacted.io/a-complete-guide-to-useeffect/).

## This solution

This is a custom hook that attempts to remove all the complexity that comes with handling asynchronicity in callbacks correctly.

**Features:**

- Feels like synchronous programming – no `useEffect`.
- Pending requests are canceled when they are interrupted by another request.
- Impossible states like having a result and error simultaneously are prevented.
- When you're using TypeScript you'll benefit from additional guardrails.
- If your asynchronous callback reaches through multiple levels of components, you can subscribe to the promise result right on the level where you need it – no need to pass down a loading and error state. If desired, you can subscribe in multiple components at the same time.

## Example

```jsx
import usePromised, {PromiseState} from 'use-promised';

function FeedbackForm() {
  const [promise, setPromise] = usePromised();

  function onSubmit() {
    setPromise(API.submitFeedback());
  }

  return (
    <>
      <button
        disabled={promise.pending}
        onClick={onSubmit}
        type="button"
      >
        Submit feedback
      </button>
      {promise.fulfilled && (
        <p>Result: {promise.result}</p>
      )}
      {promise.rejected && (
        <p>Error: {promise.error}</p>
      )}
    </>
  );
}
```

Note that you can also read the state in a generic fashion from `promise.state`.
