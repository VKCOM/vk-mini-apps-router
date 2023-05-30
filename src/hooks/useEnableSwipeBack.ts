import { useEffect, useRef } from 'react';
import { BridgeService } from '../services/BridgeService';

export const useEnableSwipeBack = () => {
  const consumerId = useRef<string | null>(null);

  useEffect(() => {
    consumerId.current = BridgeService.enableNativeSwipeBack();

    return () => {
      if (consumerId.current !== null) {
        BridgeService.disableNativeSwipeBack(consumerId.current);
      }
    };
  }, []);
};
