import { Page, PageWithParams } from '../page-types/common';
import { BlockerFunction, Params } from '@remix-run/router';

export interface NavigationOptions {
  keepSearchParams?: boolean;
  state?: Record<string, unknown> | null;
}

type NavigationPath = {
  pathname?: string;
  search?: URLSearchParams | Record<string, string> | string;
  hash?: string;
};

type NavigationTo = string | Partial<NavigationPath>;

export interface ExtendedPathWithParams<T extends string>
  extends Partial<Omit<NavigationPath, 'pathname'>> {
  pathname: PageWithParams<T>;
}

export interface ExtendedPath extends Partial<Omit<NavigationPath, 'pathname'>> {
  pathname: Page;
}

export interface RouteNavigator {
  push<T extends string>(
    to: NavigationTo | PageWithParams<T> | ExtendedPathWithParams<T>,
    params: Params<T>,
    options?: NavigationOptions,
  ): Promise<void>;
  push(to: NavigationTo | Page | ExtendedPath, options?: NavigationOptions): Promise<void>;

  replace<T extends string>(
    to: NavigationTo | PageWithParams<T>,
    params: Params<T>,
    options?: NavigationOptions,
  ): Promise<void>;
  replace(to: NavigationTo | Page, options?: NavigationOptions): Promise<void>;

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
   *
   * @param options - Необязательный параметр для дополнительных настроек навигации.
   *
   * @param options.replace - Если true, текущее модальное окно будет закрыто с заменой
   * текущей записи истории на родительскую панель. По умолчанию false, что означает закрытие модального окна
   * с добавлением новой записи в историю или возвратом на один шаг назад.
   */
  hideModal(pushPanel?: boolean, options?: { replace: boolean }): Promise<void>;

  showPopout(popout: JSX.Element): Promise<void>;

  hidePopout(): Promise<void>;

  runSync(actions: VoidFunction[]): Promise<void>;
}

export type NavigationTarget =
  | NavigationTo
  | PageWithParams<string>
  | Page
  | ExtendedPathWithParams<string>
  | ExtendedPath;
