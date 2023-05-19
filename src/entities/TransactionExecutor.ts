import { NavigationTransaction } from './NavigationTransaction';

export class TransactionExecutor {
  private transactions: NavigationTransaction[] = [];

  get initialDelay(): number {
    return this.transactions.length ? 100 : 0;
  }

  add(transaction: NavigationTransaction): void {
    this.transactions.push(transaction);
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
    }, 1);
  }
}
