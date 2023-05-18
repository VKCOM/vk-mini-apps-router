import { TransactionExecutor } from './TransactionExecutor';

export class NavigationTransaction {
  private pointer = 0;
  private resolve: VoidFunction = () => { /* Empty */ };
  private reject: VoidFunction = () => { /* Empty */ };
  private promise: Promise<void> = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });

  constructor(private actions: VoidFunction[]) {}

  start(executor: TransactionExecutor): Promise<void> {
    executor.add(this);
    this.doNext();
    return this.promise;
  }

  get finished(): boolean {
    return this.pointer >= this.actions.length;
  }

  async doNext(): Promise<void> {
    if (!this.finished) {
      this.actions[this.pointer]();
      this.pointer += 1;
    }
    if (this.finished) {
      this.resolve();
    }
  }
}
