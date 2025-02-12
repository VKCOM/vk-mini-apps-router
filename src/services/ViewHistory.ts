import { Action, AgnosticRouteMatch, RouterState } from '@remix-run/router';
import { getRouteContext } from '../utils/utils';
import { STATE_KEY_SHOW_POPOUT } from '../const';
import { ViewNavigationRecord } from './ViewNavigationRecord.type';
import { PageInternal } from '../type';

export class ViewHistory {
  private history: ViewNavigationRecord[] = [];
  private positionInternal = -1;

  updateNavigation(state: RouterState): void {
    const { match } = getRouteContext(state);

    if (!match) {
      return;
    }

    const record = this.createViewRecord(state, match);

    switch (state.historyAction) {
      case Action.Push:
        this.push(record);
        break;
      case Action.Pop:
        if (this.hasKey(state.location.key)) {
          this.pop(state);
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

  get isFirstPage(): boolean {
    return this.positionInternal < 1;
  }

  get panelsHistory(): string[] {
    if (this.history.length < 0) {
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

  get historyStack(): ViewNavigationRecord[] {
    return this.history.map((item) => ({ ...item }));
  }

  isPopForward(historyAction: Action, key: string): boolean {
    const newPosition = this.history.findIndex(({ locationKey }) => locationKey === key);
    return historyAction === Action.Pop && newPosition > this.position;
  }

  isPopBackward(historyAction: Action, key: string): boolean {
    const newPosition = this.history.findIndex(({ locationKey }) => locationKey === key);
    return historyAction === Action.Pop && newPosition <= this.position;
  }

  resetHistory() {
    this.positionInternal = -1;
    this.history = [];
  }

  private push(record: ViewNavigationRecord): void {
    this.history = this.history.slice(0, this.positionInternal + 1);
    this.history.push(record);
    this.positionInternal = this.history.length - 1;
    record.position = this.position;
  }

  private replace(record: ViewNavigationRecord): void {
    this.history[this.position] = record;
    record.position = this.position;
  }

  private pop(state: RouterState): void {
    this.positionInternal = this.history.findIndex(
      ({ locationKey }) => locationKey === state.location.key,
    );
  }

  private hasKey(key: string): boolean {
    return Boolean(this.history.find(({ locationKey }) => locationKey === key));
  }

  private createViewRecord(
    state: RouterState,
    match: AgnosticRouteMatch<string, PageInternal>,
  ): ViewNavigationRecord {
    const { route, params } = match;

    return {
      position: -1,
      path: state.location.pathname,
      state: state.location.state,
      params,
      root: 'root' in route ? route.root : undefined,
      view: route.view,
      panel: route.panel,
      modal: 'modal' in route ? route.modal : undefined,
      tab: route.tab,
      popout: state.location.state?.[STATE_KEY_SHOW_POPOUT],
      locationKey: state.location.key,
    };
  }
}
