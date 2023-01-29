import {useEffect, useState} from 'react';

type SharedTransitionConfig = {
  /** Duration in milliseconds used both for enter and exit transitions. */
  transitionDuration: number;
};

type SeparateTransitionConfig = {
  /** Duration in milliseconds used for enter transitions (overrides `transitionDuration` if provided). */
  enterTransitionDuration: number;
  /** Duration in milliseconds used for exit transitions (overrides `transitionDuration` if provided). */
  exitTransitionDuration: number;
};

type UsePresenceOptions = (
  | SharedTransitionConfig
  | SeparateTransitionConfig
  | (SharedTransitionConfig & SeparateTransitionConfig)
) & {
  /** Opt-in to animating the entering of an element if `isVisible` is `true` during the initial mount. */
  initialEnter?: boolean;
};

/**
 * Animates the appearance of its children.
 */
export default function usePresence(
  /** Indicates whether the component that the resulting values will be used upon should be visible to the user. */
  isVisible: boolean,
  opts: UsePresenceOptions
) {
  const exitTransitionDuration =
    'exitTransitionDuration' in opts
      ? opts.exitTransitionDuration
      : opts.transitionDuration;
  const enterTransitionDuration =
    'enterTransitionDuration' in opts
      ? opts.enterTransitionDuration
      : opts.transitionDuration;

  const initialEnter = opts.initialEnter ?? false;
  const [animateIsVisible, setAnimateIsVisible] = useState(
    initialEnter ? false : isVisible
  );
  const [isMounted, setIsMounted] = useState(isVisible);
  const [hasEntered, setHasEntered] = useState(
    initialEnter ? false : isVisible
  );

  const isExiting = isMounted && !isVisible;
  const isEntering = isVisible && !hasEntered;
  const isAnimating = isEntering || isExiting;

  useEffect(() => {
    if (isVisible) {
      // `animateVisible` needs to be set to `true` in a second step, as
      // when both flags would be flipped at the same time, there would
      // be no transition. See the second effect below.
      setIsMounted(true);
    } else {
      setHasEntered(false);
      setAnimateIsVisible(false);

      const timeoutId = setTimeout(() => {
        setIsMounted(false);
      }, exitTransitionDuration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isVisible, exitTransitionDuration]);

  useEffect(() => {
    if (isVisible && isMounted && !animateIsVisible) {
      // Force a reflow so the initial styles are flushed to the DOM
      if (typeof document !== undefined) {
        // We need a side effect so Terser doesn't remove this statement
        (window as any)._usePresenceReflow = document.body.offsetHeight;
      }

      const animationFrameId = requestAnimationFrame(() => {
        setAnimateIsVisible(true);
      });

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [animateIsVisible, enterTransitionDuration, isMounted, isVisible]);

  useEffect(() => {
    if (animateIsVisible && !hasEntered) {
      const timeoutId = setTimeout(() => {
        setHasEntered(true);
      }, enterTransitionDuration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [animateIsVisible, enterTransitionDuration, hasEntered]);

  return {
    isMounted,
    isVisible: animateIsVisible,
    isAnimating,
    isEntering,
    isExiting
  };
}

type UseUniqueDataPresenceOptions<T> = {
  /** Check if two instances of type T are equal, defaults to a === comparison */
  equalityCheck?(a: T, b: T): boolean;
  /** Check if an instance of type T is considered valid to render, defaults to Boolean function */
  validationCheck?(a: T): boolean;
} & UsePresenceOptions;

function defaultEqualityCheck<T>(a: T, b: T) {
  return a === b;
}
function defaultValidationCheck<T>(a: T) {
  return Boolean(a);
}

export function useUniqueDataPresence<T>(
  dataInput: T,
  {
    equalityCheck = defaultEqualityCheck,
    validationCheck = defaultValidationCheck,
    ...opts
  }: UseUniqueDataPresenceOptions<T>
) {
  const [data, setData] = useState(dataInput);
  const [shouldBeMounted, setShouldBeMounted] = useState(validationCheck(data));
  const {isMounted, isVisible} = usePresence(shouldBeMounted, opts);
  useEffect(() => {
    if (!equalityCheck(data, dataInput)) {
      if (isMounted) {
        setShouldBeMounted(false);
      } else if (validationCheck(dataInput)) {
        setData(dataInput);
        setShouldBeMounted(true);
      }
    } else if (!validationCheck(dataInput)) {
      setShouldBeMounted(false);
    } else if (validationCheck(data)) {
      setShouldBeMounted(true);
    }
  }, [
    dataInput,
    data,
    shouldBeMounted,
    isMounted,
    validationCheck,
    equalityCheck
  ]);

  return {isMounted: isMounted && validationCheck(data), isVisible, data};
}
