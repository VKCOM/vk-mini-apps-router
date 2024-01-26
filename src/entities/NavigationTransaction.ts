export class NavigationTransaction {
  private pointer = 0;
  private resolve: VoidFunction = () => {
    /* Empty */
  };
  private reject: VoidFunction = () => {
    /* Empty */
  };
  private promise: Promise<void> = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });

  constructor(private actions: VoidFunction[]) {}

  get isMultiAction(): boolean {
    return this.actions.length > 1;
  }

  get donePromise(): Promise<void> {
    return this.promise;
  }

  get finished(): boolean {
    return this.pointer >= this.actions.length;
  }

  doNext(): void {
    if (!this.finished) {
      this.actions[this.pointer]();
      this.pointer += 1;
    }
    // this.finished изменился при выполнении предыдущего условия - нельзя объединить в if-else.
    if (this.finished) {
      this.resolve();
    }
  }
}
