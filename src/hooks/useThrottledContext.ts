import { Context, useContext, useEffect, useState } from 'react';
import { ContextThrottleService } from '../services/ContextThrottleService';
import { EventBus } from '../services/EventBus';

export function useThrottledContext<T>(context: Context<T>): [T, T | null] {
  const contextValue = useContext(context);
  const contextName = context.displayName ?? '';
  const initialContextData = ContextThrottleService.retrieveContextInfo(contextName, contextValue);

  const [prevValue, setPrevValue] = useState<T | null>(initialContextData.prevValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialContextData.throttledValue);

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

  if (!contextName) {
    console.error('No context display name found');
    return [contextValue, null];
  }

  return [throttledValue, prevValue];
}
