import { EventBus } from './EventBus';
import { TransactionExecutor } from './TransactionExecutor';

interface ContextThrottleInfo {
  prevValue: unknown;
  updateTimerId: number;
  throttledValue: unknown;
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
  private contextThrottleMap: Record<string, ContextThrottleInfo> = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!ContextThrottleService.instance) {
      ContextThrottleService.instance = new ContextThrottleService();
    }

    return ContextThrottleService.instance;
  }

  private getContextThrottleInfoByName(contextName: string) {
    if (!(contextName in this.contextThrottleMap)) {
      this.contextThrottleMap[contextName] = {
        prevValue: null,
        throttledValue: null,
        lastUpdateTimestamp: 0,
        updateTimerId: 0,
      };
    }
    return this.contextThrottleMap[contextName];
  }

  private isContextChange<T>(contextName: string, newValue: T) {
    const contextData = this.getContextThrottleInfoByName(contextName);
    return !(newValue === contextData.throttledValue);
  }

  private getTimeUntilNextUpdate(lastUpdateTimestamp: number) {
    const timeSinceLastUpdate = Date.now() - lastUpdateTimestamp;
    const delayUntilNextUpdate = this.interval - timeSinceLastUpdate;
    return delayUntilNextUpdate;
  }

  private updateContextValue<T>(contextName: string, newValue: T) {
    const contextData = this.getContextThrottleInfoByName(contextName);
    contextData.prevValue = contextData.throttledValue;
    contextData.lastUpdateTimestamp = Date.now();
    contextData.throttledValue = newValue;
    EventBus.broadcast(contextName, [contextData.throttledValue, contextData.prevValue]);
  }

  private throttleUpdateContextValue<T>(contextName: string, newValue: T) {
    const contextData = this.getContextThrottleInfoByName(contextName);
    clearTimeout(contextData.updateTimerId);
    if (this.isRunSyncActive()) return;

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

  private isRunSyncActive() {
    return TransactionExecutor.isRunSyncActive;
  }

  public static triggerContextUpdate<T>(contextName: string, newValue: T) {
    const throttledService = ContextThrottleService.getInstance();

    if (!throttledService.isContextChange(contextName, newValue)) {
      return;
    }

    if (!throttledService.throttled && !throttledService.isRunSyncActive()) {
      throttledService.updateContextValue(contextName, newValue);
    } else {
      throttledService.throttleUpdateContextValue(contextName, newValue);
    }
  }

  public static updateThrottledServiceSettings(settings: ContextThrottleServiceSettings) {
    const throttledService = ContextThrottleService.getInstance();
    throttledService.interval = settings.interval;
    throttledService.throttled = settings.throttled;
  }
}
