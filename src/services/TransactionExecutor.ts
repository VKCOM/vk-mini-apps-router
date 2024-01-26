import { NavigationTransaction } from '../entities/NavigationTransaction';

export class TransactionExecutor {
  private transactions: NavigationTransaction[] = [];

  constructor(private forceUpdate: () => void) {}

  get initialDelay(): number {
    return this.transactions.length > 1 ||
      (this.transactions.length > 0 && this.transactions[0].isMultiAction)
      ? 100
      : 0;
  }

  add(transaction: NavigationTransaction): void {
    this.transactions.push(transaction);
    this.forceUpdate();
  }

  async doNext(): Promise<void> {
    // Нужно делать асинхронно, иначе будет бесконечный цикл навигация-изменение стейта-навигация...
    setTimeout(() => {
      if (this.transactions.length) {
        this.transactions[0].doNext();
        if (this.transactions[0].finished) {
          this.transactions.shift();
        }
      }
    });
  }
}
