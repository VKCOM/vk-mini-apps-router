import { ViewNavigationRecord } from './type';
import { Action, RouterState } from '@remix-run/router';
import { getContextFromState } from './utils';
import { STATE_KEY_SHOW_POPOUT } from './const';

export class ViewHistory {
  private history: ViewNavigationRecord[] = [];
  private positionInternal = -1;

  updateNavigation(state: RouterState): void {
    const record = this.getViewRecordFromState(state);
    if (record) {
      switch (state.historyAction) {
        case Action.Push:
          this.push(record);
          break;
        case Action.Pop:
          if (this.hasKey(record.locationKey)) {
            this.pop(record);
          } else {
            // В случае, если пользователь введет в адресную строку новый хэш, мы поймаем POP событие с новой локацией.
            this.push(record);
          }
          break;
        case Action.Replace:
          this.replace(record);
          break;
      }
    }
  }

  get panelsHistory(): string[] {
    if (this.positionInternal < 0) {
      return [];
    }
    const currentView = this.history[this.positionInternal].view;
    const reversedClone = this.history.slice(0, this.positionInternal + 1).reverse();
    const rightLimit = reversedClone.findIndex((item) => item.view !== currentView);
    const historyCopy = reversedClone
      .slice(0, rightLimit > -1 ? rightLimit : reversedClone.length)
      .filter((item) => !item.modal && !item.popout)
      .reverse();
    return historyCopy.map(({ panel }) => panel);
  }

  get position(): number {
    return this.positionInternal;
  }

  isPopForward(historyAction: Action, key: string): boolean {
    const newPosition = this.history.findIndex(({ locationKey }) => locationKey === key);
    return historyAction === Action.Pop && newPosition > this.position;
  }

  isPopBackward(historyAction: Action, key: string): boolean {
    const newPosition = this.history.findIndex(({ locationKey }) => locationKey === key);
    return historyAction === Action.Pop && newPosition <= this.position;
  }

  private push(record: ViewNavigationRecord): void {
    this.history = this.history.slice(0, this.positionInternal + 1);
    this.history.push(record);
    this.positionInternal = this.history.length - 1;
  }

  private replace(record: ViewNavigationRecord): void {
    this.history[this.positionInternal] = record;
  }

  private pop(record: ViewNavigationRecord): void {
    this.positionInternal = this.history.findIndex(({ locationKey }) => locationKey === record.locationKey);
  }

  private hasKey(key: string): boolean {
    return Boolean(this.history.find(({ locationKey }) => locationKey === key));
  }

  private getViewRecordFromState(state: RouterState): ViewNavigationRecord | undefined {
    const context = getContextFromState(state);
    if (context.viewMatch && context.panelMatch) {
      return {
        view: context.viewMatch.route.view,
        panel: context.panelMatch.route.panel,
        modal: context.modalMatch?.route.modal,
        popout: state.location.state?.[STATE_KEY_SHOW_POPOUT],
        locationKey: state.location.key,
      };
    }
    return undefined;
  }
}
