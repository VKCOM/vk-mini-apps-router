import { ViewHistory } from '.';

export class HistoryManager {
  public constructor(private readonly viewHistory: ViewHistory) {}

  public getCurrentPosition() {
    return this.viewHistory.position;
  }

  public getHistory() {
    return this.viewHistory.historyStack;
  }
}
