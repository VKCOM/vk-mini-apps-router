import { ViewNavigationRecord } from './type';
import { Action, RouterState } from '@remix-run/router';
import { getContextFromState } from './utils';

export class ViewHistory {
  private history: ViewNavigationRecord[] = [];
  private position = -1;

  updateNavigation(state: RouterState): void {
    const record = this.getViewRecordFromState(state);
    if (record) {
      switch (state.historyAction) {
        case Action.Push:
          this.push(record);
          break;
        case Action.Pop:
          this.pop(record);
          break;
        case Action.Replace:
          this.replace(record);
          break;
      }
    }
  }

  get panelsHistory(): string[] {
    const currentView = this.history[this.position].view;
    const reversedClone = this.history.slice(0, this.position + 1).reverse();
    const rightLimit = reversedClone.findIndex((item) => item.view !== currentView);
    const historyCopy = reversedClone.slice(0, rightLimit > -1 ? rightLimit : reversedClone.length).reverse();
    return historyCopy.map(({ panel }) => panel);
  }
  private push(record: ViewNavigationRecord): void {
    this.history = this.history.slice(0, this.position + 1);
    this.history.push(record);
    this.position = this.history.length - 1;
  }
  private replace(record: ViewNavigationRecord): void {
    this.history[this.position] = record;
  }
  private pop(record: ViewNavigationRecord): void {
    this.position = this.history.findIndex(({ locationKey }) => locationKey === record.locationKey);
  }
  private getViewRecordFromState(state: RouterState): ViewNavigationRecord | undefined {
    const context = getContextFromState(state);
    if (context.viewMatch && context.panelMatch) {
      return {
        view: context.viewMatch.route.view,
        panel: context.panelMatch.route.panel,
        locationKey: state.location.key,
      };
    }
    return undefined;
  }
}
