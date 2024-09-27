import { Page, PageWithParams } from '../page-types/common';
import { BlockerFunction, Params, To } from '@remix-run/router';

export interface NavigationOptions {
  keepSearchParams?: boolean;
  state?: Record<string, unknown>;
}

export interface RouteNavigator {
  push<T extends string>(
    to: To | PageWithParams<T>,
    params: Params<T>,
    options?: NavigationOptions,
  ): Promise<void>;
  push(to: To | Page, options?: NavigationOptions): Promise<void>;

  replace<T extends string>(
    to: To | PageWithParams<T>,
    params: Params<T>,
    options?: NavigationOptions,
  ): Promise<void>;
  replace(to: To | Page, options?: NavigationOptions): Promise<void>;

  back(to?: number): Promise<void>;

  backToFirst(): Promise<void>;

  go(to: number): Promise<void>;

  showModal(id: string): Promise<void>;

  block(onLeave: BlockerFunction): () => void;

  /**
   * Закрыть модальное окно, открытое методом showModal или навигацией (push/replace/back).
   *
   * @param pushPanel Установите значение в true, если хотите выполнить PUSH навигацию.
   * В случае, если модальное окно было открыто через навигацию, можно закрыть окно шагом назад
   * или навигацией вперед на родительскую панель.<br>
   * По умолчанию false.
   */
  hideModal(pushPanel?: boolean): Promise<void>;

  showPopout(popout: JSX.Element): Promise<void>;

  hidePopout(): Promise<void>;

  runSync(actions: VoidFunction[]): Promise<void>;
}
