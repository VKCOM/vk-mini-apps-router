import { Context, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ThrottledContext } from '../contexts';

type NullableFunction = (() => void) | null;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FUNCTION = () => {};

export function useThrottledContext<T>(context: Context<T>): [T, T | null, () => void] {
  const { enabled, interval, firstActionDelay } = useContext(ThrottledContext);
  const prevValue = useRef<T | null>(null);
  const value = useContext(context);
  const updated = useRef(0);
  const updateTimer = useRef(0);
  const updateCallback = useRef<NullableFunction>(null);
  const [throttledValue, setThrottledValue] = useState<T>(value);

  if (!enabled) {
    const returnPrev = prevValue.current;
    prevValue.current = value;
    return [value, returnPrev, EMPTY_FUNCTION];
  }

  useEffect(() => {
    const timeDiff = Date.now() - updated.current;
    const throttleDelay = interval - timeDiff;
    const initialDelay = throttleDelay <= 0 ? firstActionDelay : 0;
    const delay = Math.max(initialDelay, throttleDelay);
    if (delay <= 0) {
      updated.current = Date.now();
      setThrottledValue(value);
    } else {
      clearTimeout(updateTimer.current);
      updateCallback.current = () => {
        updateCallback.current = null;
        updated.current = Date.now();
        setThrottledValue(value);
      };
      updateTimer.current = setTimeout(updateCallback.current, delay);
    }
  }, [value]);

  const onTransitionEnd = useCallback(() => {
    updated.current = 0;
    if (updateCallback.current) {
      clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(updateCallback.current, 1);
    }
  }, []);

  const returnPrev = prevValue.current;
  prevValue.current = throttledValue;
  return [throttledValue, returnPrev, onTransitionEnd];
}
