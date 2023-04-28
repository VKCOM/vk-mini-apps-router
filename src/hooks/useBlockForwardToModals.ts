import { useCallback, useEffect, useState } from 'react';
import { Blocker, BlockerFunction, Router } from '@remix-run/router';
import { STATE_KEY_BLOCK_FORWARD_NAVIGATION, STATE_KEY_SHOW_MODAL, STATE_KEY_SHOW_POPOUT } from '../const';
import { ViewHistory } from '../view-history';

let blockerId = 0;
const processedKeys: string[] = [];

export function useBlockForwardToModals(router: Router, viewHistory: ViewHistory): Blocker {
  const [blockerKey] = useState(() => String(++blockerId));

  const blockerFunction = useCallback<BlockerFunction>(({ historyAction, nextLocation }) => {
    const isPopForward = viewHistory.isPopForward(historyAction, nextLocation.key);
    const blockEnabled = isPopForward && nextLocation.key !== 'default';
    return Boolean(blockEnabled && nextLocation.state?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION]);
  }, [viewHistory]);

  const blocker = router.getBlocker(blockerKey, blockerFunction);

  useEffect(
    () => {
      router.subscribe((state) => {
        const key = state.location.key;
        const isPopBackward = viewHistory.isPopBackward(state.historyAction, key);
        if (isPopBackward && state.location.state?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION] && !processedKeys.includes(key)) {
          processedKeys.push(key);
          const replaceState = { ...window.history.state };
          if (replaceState.usr?.[STATE_KEY_SHOW_MODAL]) {
            replaceState.usr = { ...replaceState.usr };
            delete replaceState.usr?.[STATE_KEY_SHOW_MODAL];
            delete replaceState.usr?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION];
          }
          if (replaceState.usr?.[STATE_KEY_SHOW_POPOUT]) {
            replaceState.usr = { ...replaceState.usr };
            delete replaceState.usr?.[STATE_KEY_SHOW_POPOUT];
            delete replaceState.usr?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION];
          }
          window.history.replaceState(replaceState, '');
          router.navigate(-1).then(() => processedKeys.splice(processedKeys.findIndex((name) => name === key), 1));
        }
      });

      // Cleanup on unmount
      return () => router.deleteBlocker(blockerKey);
    },
    [router, blockerKey, viewHistory],
  );

  return blocker;
}
