import { useEffect, useRef } from 'react';
import { BridgeService } from '../services/BridgeService';
import {
  parseURLSearchParamsForGetLaunchParams,
  EGetLaunchParamsResponsePlatforms,
} from '@vkontakte/vk-bridge';

export function useEnableSwipeBack() {
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);
  const consumerId = useRef<string | null>(null);

  useEffect(() => {
    if (
      vk_platform !== EGetLaunchParamsResponsePlatforms.MOBILE_IPHONE &&
      vk_platform !== EGetLaunchParamsResponsePlatforms.MOBILE_IPHONE_MESSENGER &&
      vk_platform !== EGetLaunchParamsResponsePlatforms.MOBILE_IPAD
    ) {
      return;
    }
    consumerId.current = BridgeService.enableNativeSwipeBack();

    return () => {
      if (consumerId.current !== null) {
        BridgeService.disableNativeSwipeBack(consumerId.current);
      }
    };
  }, []);
}
