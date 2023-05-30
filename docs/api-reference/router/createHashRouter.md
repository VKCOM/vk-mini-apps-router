# createHashRouter
Функция для создания роутера из набора маршрутов.

## Объявление типа
```tsx
export function createHashRouter(routes: RouteWithRoot[] | RouteWithoutRoot[]): Router {}
```

Интерфейс `Router` определен в библиотеке `@remix-run/router`.

## Аргументы
### routes
Массив маршрутов приложения.

Состоит из набора [`RouteWithRoot`](RouteWithRoot.md) элементов в случае,
если в приложении есть несколько компонентов `Root` (используется компонент `Epic`).\
В противном случае состоит из набора [`RouteWithoutRoot`](RouteWithoutRoot.md).
