export interface RouteNavigator {
  push(path: string): void;

  replace(path: string): void;

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
