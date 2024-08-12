import { NavigationTransaction } from '../entities/NavigationTransaction';

export class TransactionExecutor {
  private static instance?: TransactionExecutor;
  private transactions: NavigationTransaction[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!TransactionExecutor.instance) {
      TransactionExecutor.instance = new TransactionExecutor();
    }

    return TransactionExecutor.instance;
  }

  public static get isRunSyncActive() {
    const transactionExecutor = TransactionExecutor.getInstance();
    const hasMultipleTransactions = transactionExecutor.transactions.length > 1;
    const hasSingleMultiActionTransaction =
      transactionExecutor.transactions.length === 1 &&
      transactionExecutor.transactions[0].isMultiAction;

    return hasMultipleTransactions || hasSingleMultiActionTransaction;
  }

  public static add(transaction: NavigationTransaction) {
    const transactionExecutor = TransactionExecutor.getInstance();
    transactionExecutor.transactions.push(transaction);
  }

  public static resetTransactions() {
    const transactionExecutor = TransactionExecutor.getInstance();
    transactionExecutor.transactions = [];
  }

  public static async doNext(): Promise<void> {
    const transactionExecutor = TransactionExecutor.getInstance();
    const transactions = transactionExecutor.transactions;
    // Нужно делать асинхронно, иначе будет бесконечный цикл навигация-изменение стейта-навигация...
    setTimeout(() => {
      if (transactions.length) {
        transactions[0].doNext();
        if (transactions[0].finished) {
          transactions.shift();
        }
      }
    });
  }
}
