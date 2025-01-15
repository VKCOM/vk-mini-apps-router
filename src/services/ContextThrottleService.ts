import { EventBus } from './EventBus';
import { TransactionExecutor } from './TransactionExecutor';

interface ContextThrottleInfo<T = unknown> {
  prevValue: T | null;
  updateTimerId: number;
  throttledValue: T;
  lastUpdateTimestamp: number;
}

interface ContextThrottleServiceSettings {
  interval: number;
  throttled: boolean;
}

export class ContextThrottleService {
  private static instance?: ContextThrottleService;
  private interval = 0;
  private throttled = true;
  private contextThrottleMap: Map<string, ContextThrottleInfo> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!ContextThrottleService.instance) {
      ContextThrottleService.instance = new ContextThrottleService();
    }

    return ContextThrottleService.instance;
  }

  private getWithInitThrottleInfoByName<T>(
    contextName: string,
    contextValue: T,
  ): ContextThrottleInfo<T> {
    if (!this.contextThrottleMap.has(contextName)) {
      const contextData = {
        prevValue: null,
        throttledValue: contextValue,
        lastUpdateTimestamp: 0,
        updateTimerId: 0,
      };

      this.contextThrottleMap.set(contextName, contextData);
    }

    return this.contextThrottleMap.get(contextName) as ContextThrottleInfo<T>;
  }

  private getTimeUntilNextUpdate(lastUpdateTimestamp: number) {
    const timeSinceLastUpdate = Date.now() - lastUpdateTimestamp;
    const delayUntilNextUpdate = this.interval - timeSinceLastUpdate;
    return delayUntilNextUpdate;
  }

  private updateContextValue<T>(contextName: string, newValue: T) {
    const contextData = this.getWithInitThrottleInfoByName(contextName, newValue);

    if (newValue === contextData.throttledValue) {
      return;
    }

    contextData.prevValue = contextData.throttledValue;
    contextData.lastUpdateTimestamp = Date.now();
    contextData.throttledValue = newValue;
    EventBus.broadcast(contextName, [contextData.throttledValue, contextData.prevValue]);
  }

  private throttleUpdateContextValue<T>(contextName: string, newValue: T) {
    const contextData = this.getWithInitThrottleInfoByName(contextName, newValue);
    clearTimeout(contextData.updateTimerId);

    if (TransactionExecutor.isRunSyncActive) {
      return;
    }

    const lastUpdateTimestamp = contextData.lastUpdateTimestamp;
    const timeUntilNextUpdate = this.getTimeUntilNextUpdate(lastUpdateTimestamp);

    if (timeUntilNextUpdate <= 0) {
      this.updateContextValue(contextName, newValue);
    } else {
      contextData.updateTimerId = setTimeout(() => {
        this.updateContextValue(contextName, newValue);
      }, timeUntilNextUpdate);
    }
  }

  public static triggerContextUpdate<T>(contextName: string, newValue: T) {
    const throttledService = ContextThrottleService.getInstance();
    const contextData = throttledService.getWithInitThrottleInfoByName(contextName, newValue);

    if (newValue === contextData.throttledValue) {
      return;
    }

    if (!throttledService.throttled && !TransactionExecutor.isRunSyncActive) {
      throttledService.updateContextValue(contextName, newValue);
    } else {
      throttledService.throttleUpdateContextValue(contextName, newValue);
    }
  }

  public static retrieveContextInfo<T>(contextName: string, contextValue: T) {
    const throttledService = ContextThrottleService.getInstance();
    const { prevValue, throttledValue } = throttledService.getWithInitThrottleInfoByName(
      contextName,
      contextValue,
    );

    return { prevValue, throttledValue };
  }

  public static updateThrottledServiceSettings(settings: ContextThrottleServiceSettings) {
    const throttledService = ContextThrottleService.getInstance();
    throttledService.interval = settings.interval;
    throttledService.throttled = settings.throttled;
  }
}
