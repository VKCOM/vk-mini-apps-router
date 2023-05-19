import { Page, PageWithParams } from '../page-types/common';
import { Params } from '@remix-run/router';

export interface NavigationOptions {
  keepSearchParams?: boolean;
}

export function hasNavigationOptionsKeys<T extends {}>(object: T): boolean {
  const base: Required<NavigationOptions> = {
    keepSearchParams: true,
  };
  const keys = Object.keys(base);
  return Object.keys(object).some((key) => keys.includes(key)) as any;
}

export interface RouteNavigator {
  push<T extends string>(to: PageWithParams<T>, params: Params<T>, options?: NavigationOptions): Promise<void>;
  push(to: string | Page, options?: NavigationOptions): Promise<void>;

  replace<T extends string>(to: PageWithParams<T>, params: Params<T>, options?: NavigationOptions): Promise<void>;
  replace(to: string | Page, options?: NavigationOptions): Promise<void>;

  back(to?: number): Promise<void>;

  backToFirst(): Promise<void>;

  go(to: number): Promise<void>;

  showModal(id: string): Promise<void>;

  /**
   * Закрыть модальное окно, открытое методом showModal или навигацией (push/replace/back).
   *
   * @param pushPanel Установите значение в true, если хотите выполнить PUSH навигацию.
   * В случае, если модальное окно было открыто через навигацию, можно закрыть окно шагом назад
   * или навигацией вперед на родительскую панель.<br>
   * По умолчанию false.
   */
  hideModal(pushPanel?: boolean): Promise<void>;

  showPopout(popout: JSX.Element | null): Promise<void>;

  hidePopout(): Promise<void>;

  transaction(actions: VoidFunction[]): Promise<void>;
}
