# RouteNavigator
Интерфейс для осуществления навигации в приложении.
Позволяет переходить между страницами, обновлять URL,
открывать и закрывать модальные окна и компоненты Popout.

## Типы
### NavigationOptions
```tsx
interface NavigationOptions {
  keepSearchParams?: boolean;
}
```
`keepSearchParams` - сохраняет параметры поискового запроса при переходе на новый URL.

## Методы
### push()
Переход на новый URL. В историю будет добавлена новая запись.

#### `push(to: string, options?: NavigationOptions): void;`
URL задан строкой в параметре `to`.

#### `push(to: Page, options?: NavigationOptions): void;`
URL задан объектом типа `Page` в параметре `to`.

#### `push<T extends string>(to: PageWithParams<T>, params: Params<T>, options?: NavigationOptions): void;`
URL задан объектом типа `PageWithParams` в параметре `to`,
обязательно должны быть передан объект `params`, со всеми необходимыми ключами.

### replace()
Переход на новый URL. В историю будет обновлена последняя запись.

#### `replace(to: string, options?: NavigationOptions): void;`
URL задан строкой в параметре `to`.

#### `replace(to: Page, options?: NavigationOptions): void;`
URL задан объектом типа `Page` в параметре `to`.

#### `replace<T extends string>(to: PageWithParams<T>, params: Params<T>, options?: NavigationOptions): void;`
URL задан объектом типа `PageWithParams` в параметре `to`,
обязательно должны быть передан объект `params`, со всеми необходимыми ключами.

### `back(): void;`
Шаг назад по истории навигации.

### `transaction(actions: VoidFunction[]): Promise<void>`
Выполнить несколько переходов разом, пользователь увидит только последний.\
Промис будет завершен после выполнения последнего действия.\
Каждая функция должна выполнять ровно один вызов метода routeNavigator.

Пример использования:
```tsx
routeNavigator.transaction([
  () => routeNavigator.back(-2),
  () => routeNavigator.replace('/'),
  () => routeNavigator.push('/'),
]);
```

### `showModal(id: string): void;`
Открыть модальное окно с идентификатором `id` без изменения URL.
Будет добавлена новая запись в историю, либо обновлена предыдущая,
если вызвать при открытом функцией `showModal` модальном окне.

### `hideModal(pushPanel?: boolean): void;`
Закрывает модальное окно, если оно было открыто.

#### `pushPanel`
_По умолчанию `false`_\
Делает шаг назад по истории навигации, если значение `false`
Делает шаг вперед на панель, указанную в маршруте модального окна при `true` (работает только для модальных окон с собственным путем).

### `showPopout(popout: JSX.Element | null): void;`
Открыть Popout без изменения URL.
Будет добавлена новая запись в историю, либо обновлена предыдущая,
если вызвать при открытом функцией `showModal` модальном окне.

#### `popout`
Контент Popout, который нужно показать на странице. 
Например, [ActionSheet](https://vkcom.github.io/VKUI/#/ActionSheet),
[Alert](https://vkcom.github.io/VKUI/#/Alert)
[ScreenSpinner](https://vkcom.github.io/VKUI/#/ScreenSpinner),
[Snackbar](https://vkcom.github.io/VKUI/#/Snackbar)

### `hidePopout(): void;`
Убирает Popout, если был открыт.
