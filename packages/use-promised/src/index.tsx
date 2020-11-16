import {useState, useEffect} from 'react';

export enum PromiseState {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED'
}

export type PromiseData<ResultType, ErrorType> =
  | {state: PromiseState.IDLE}
  | {state: PromiseState.PENDING}
  | {state: PromiseState.REJECTED; error: ErrorType}
  | {state: PromiseState.FULFILLED; result: ResultType};

export default function usePromised<Result, Error extends unknown>(): [
  PromiseData<Result, Error>,
  (promise: Promise<Result>) => void
] {
  const [promise, setPromise] = useState<Promise<Result>>();
  const [data, setData] = useState<PromiseData<Result, Error>>({
    state: PromiseState.IDLE
  });

  useEffect(() => {
    let isCanceled = false;

    if (promise) {
      setData({state: PromiseState.PENDING});

      promise
        .then((receivedResult) => {
          if (isCanceled) return;

          setData({
            state: PromiseState.FULFILLED,
            result: receivedResult
          });
        })
        .catch((receivedError) => {
          if (isCanceled) return;

          setData({
            state: PromiseState.REJECTED,
            error: receivedError
          });
        });
    } else {
      setData({state: PromiseState.IDLE});
    }

    return () => {
      isCanceled = true;
    };
  }, [promise]);

  return [data, setPromise];
}
