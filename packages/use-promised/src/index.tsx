import {useState, useEffect} from 'react';

export enum PromiseState {
  IDLE = 'idle',
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled'
}

export type PromiseData<ResultType, ErrorType> =
  | {
      state: PromiseState.IDLE;
      idle: true;
      pending: false;
      rejected: false;
      fulfilled: false;
    }
  | {
      state: PromiseState.PENDING;
      idle: false;
      pending: true;
      rejected: false;
      fulfilled: false;
    }
  | {
      state: PromiseState.REJECTED;
      idle: false;
      pending: false;
      rejected: true;
      fulfilled: false;
      error: ErrorType;
    }
  | {
      state: PromiseState.FULFILLED;
      idle: false;
      pending: false;
      rejected: false;
      fulfilled: true;
      result: ResultType;
    };

export default function usePromised<Result = unknown, Error = unknown>(): [
  PromiseData<Result, Error>,
  (promise: Promise<Result>) => void
] {
  const [promise, setPromise] = useState<Promise<Result>>();
  const [data, setData] = useState<PromiseData<Result, Error>>({
    state: PromiseState.IDLE,
    idle: true,
    pending: false,
    rejected: false,
    fulfilled: false
  });

  useEffect(() => {
    let isCanceled = false;

    if (promise) {
      setData({
        state: PromiseState.PENDING,
        idle: false,
        pending: true,
        rejected: false,
        fulfilled: false
      });

      promise
        .then((receivedResult) => {
          if (isCanceled) return;

          setData({
            state: PromiseState.FULFILLED,
            idle: false,
            pending: false,
            rejected: false,
            fulfilled: true,
            result: receivedResult
          });
        })
        .catch((receivedError) => {
          if (isCanceled) return;

          setData({
            state: PromiseState.REJECTED,
            idle: false,
            pending: false,
            rejected: true,
            fulfilled: false,
            error: receivedError
          });
        });
    } else {
      setData({
        state: PromiseState.IDLE,
        idle: true,
        pending: false,
        rejected: false,
        fulfilled: false
      });
    }

    return () => {
      isCanceled = true;
    };
  }, [promise]);

  return [data, setPromise];
}
