import bridge, { ErrorData } from '@vkontakte/vk-bridge';
import { createKey } from '../utils/utils';

export class BridgeService {
  private swipeBackConsumers: string[] = [];

  private static UNSUPPORTED_PLATFORM_ERROR_CODE = 6;

  private static _instance: BridgeService | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private static handlePlatformError: (error: ErrorData) => void = (error) => {
    if (error.error_data.error_code !== BridgeService.UNSUPPORTED_PLATFORM_ERROR_CODE) {
      console.log(error);
    }
  };

  static enableNativeSwipeBack(): string {
    Promise.all([
      bridge.send('VKWebAppSetSwipeSettings', { history: true }),
      bridge.send('VKWebAppEnableSwipeBack'),
    ]).catch(BridgeService.handlePlatformError);

    const instance = BridgeService.instance;
    const consumerId = createKey();
    instance.swipeBackConsumers = [...instance.swipeBackConsumers, consumerId];

    return consumerId;
  }

  static disableNativeSwipeBack(consumerId: string) {
    const instance = BridgeService.instance;
    /**
     * Тот, кто попросил отключить нативный свайпбек, выходит из списка.
     */
    instance.swipeBackConsumers = instance.swipeBackConsumers.filter((id) => id !== consumerId);

    /**
     * Нативный свайпбек будет отключен только если больше не осталось тех, кому он нужен.
     */
    if (instance.swipeBackConsumers.length === 0) {
      Promise.all([
        bridge.send('VKWebAppSetSwipeSettings', { history: false }),
        bridge.send('VKWebAppDisableSwipeBack'),
      ]).catch(BridgeService.handlePlatformError);
    }
  }

  private static get instance(): BridgeService {
    if (!BridgeService._instance) {
      BridgeService._instance = new BridgeService();
    }
    return BridgeService._instance;
  }
}
