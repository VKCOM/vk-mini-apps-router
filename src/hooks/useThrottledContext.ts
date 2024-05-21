import { Context, useContext, useEffect, useState } from 'react';
import { ContextThrottleService } from '../services/ContextThrottleService';
import { EventBus } from '../services/EventBus';

export function useThrottledContext<T>(context: Context<T>): [T, T | null] {
  const contextValue = useContext(context);
  const contextName = context.displayName;
  const [prevValue, setPrevValue] = useState<T>(contextValue);
  const [throttledValue, setThrottledValue] = useState<T>(contextValue);

  if (!contextName) {
    console.error('No context display name found');
    return [contextValue, null];
  }

  useEffect(() => {
    const unsubscribe = EventBus.subscribe<(throttleValue: T, prevValue: T) => void>(
      contextName,
      (throttleValue, prevValue) => {
        setThrottledValue(throttleValue);
        setPrevValue(prevValue);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    ContextThrottleService.triggerContextUpdate(contextName, contextValue);
  }, [contextValue, contextName]);

  return [throttledValue, prevValue];
}
