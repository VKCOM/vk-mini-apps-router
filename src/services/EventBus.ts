export class EventBus {
  private static instance?: EventBus;
  private subscriptions: Record<string, Set<Function>> = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  private isEventExist(contextName: string) {
    return contextName in this.subscriptions;
  }

  public static broadcast(contextName: string, args: unknown[]) {
    const eventBus = EventBus.getInstance();
    if (!eventBus.isEventExist(contextName)) {
      return;
    }

    eventBus.subscriptions[contextName].forEach((callback) => callback(...args));
  }

  public static subscribe<T extends Function>(contextName: string, callback: T) {
    const eventBus = EventBus.getInstance();

    if (!eventBus.isEventExist(contextName)) {
      eventBus.subscriptions[contextName] = new Set();
    }

    const callbacks = eventBus.subscriptions[contextName];
    callbacks.add(callback);

    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        delete eventBus.subscriptions[contextName];
      }
    };
  }
}
