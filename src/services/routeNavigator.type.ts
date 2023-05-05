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
  push<T extends string>(to: PageWithParams<T>, params: Params<T>, options?: NavigationOptions): void;
  push(to: string | Page, options?: NavigationOptions): void;

  replace<T extends string>(to: PageWithParams<T>, params: Params<T>, options?: NavigationOptions): void;
  replace(to: string | Page, options?: NavigationOptions): void;

  back(): void;

  showModal(id: string): void;

  /**
   * Закрыть модальное окно, открытое методом showModal или навигацией (push/replace/back).
   *
   * @param pushPanel Установите значение в true, если хотите выполнить PUSH навигацию.
   * В случае, если модальное окно было открыто через навигацию, можно закрыть окно шагом назад
   * или навигацией вперед на родительскую панель.<br>
   * По умолчанию false.
   */
  hideModal(pushPanel?: boolean): void;

  showPopout(popout: JSX.Element | null): void;

  hidePopout(): void;
}
