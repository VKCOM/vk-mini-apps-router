import { useCallback, useEffect, useState } from 'react';
import { STATE_KEY_CLEAR_FUTURE } from '../const';
import { Location, Router } from '@remix-run/router';
import { ViewHistory } from '../view-history';

export function useRemoveFutureHistoryOnModalClose(router: Router, viewHistory: ViewHistory) {
  const [inCleaning, setInCleaning] = useState(false);
  const [cleanLocation, setCleanLocation] = useState<Location | null>(null);
  const cleanUp = useCallback((event: PopStateEvent) => {
    if (inCleaning && cleanLocation) {
      setInCleaning(false);
      router.navigate(cleanLocation);
    }
    if (event.state?.usr?.[STATE_KEY_CLEAR_FUTURE] && viewHistory.position) {
      const cleanState = { ...router.state.location.state };
      delete cleanState[STATE_KEY_CLEAR_FUTURE];
      setCleanLocation({ ...router.state.location, state: cleanState });
      window.history.back();
      setInCleaning(true);
    }
  }, [inCleaning, cleanLocation, router, viewHistory]);
  useEffect(() => {
    window.addEventListener('popstate', cleanUp);
    return () => window.removeEventListener('popstate', cleanUp);
  }, [cleanUp]);
}
