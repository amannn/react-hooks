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
      result: undefined;
      error: undefined;
    }
  | {
      state: PromiseState.PENDING;
      idle: false;
      pending: true;
      rejected: false;
      fulfilled: false;
      result: undefined;
      error: undefined;
    }
  | {
      state: PromiseState.REJECTED;
      idle: false;
      pending: false;
      rejected: true;
      fulfilled: false;
      result: undefined;
      error: ErrorType;
    }
  | {
      state: PromiseState.FULFILLED;
      idle: false;
      pending: false;
      rejected: false;
      fulfilled: true;
      result: ResultType;
      error: undefined;
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
    fulfilled: false,
    error: undefined,
    result: undefined
  });

  useEffect(() => {
    let isCanceled = false;

    if (promise) {
      setData({
        state: PromiseState.PENDING,
        idle: false,
        pending: true,
        rejected: false,
        fulfilled: false,
        error: undefined,
        result: undefined
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
            result: receivedResult,
            error: undefined
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
            error: receivedError,
            result: undefined
          });
        });
    } else {
      setData({
        state: PromiseState.IDLE,
        idle: true,
        pending: false,
        rejected: false,
        fulfilled: false,
        result: undefined,
        error: undefined
      });
    }

    return () => {
      isCanceled = true;
    };
  }, [promise]);

  return [data, setPromise];
}
