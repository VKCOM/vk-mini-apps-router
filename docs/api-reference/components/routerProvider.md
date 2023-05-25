# RouterProvider
Компонент-обертка, предоставляющий контекст для приложения.
Позволяет использовать хуки библиотеки во вложенных компонентах.

```tsx
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import App from './App';
import { router } from './routes';
import { RouterProvider } from 'dist/index';

export const AppConfig = () => {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <RouterProvider router={router} notFound={<p>'Custom not found'</p>}>
            <App />
          </RouterProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}
```

## Свойства `RouterProviderProps`

### `router: Router`
_Обязательное_\
Объект типа `Router` созданный при помощи метода [`createHashRouter`](../router/createHashRouter.md).

### `notFound: JSX.Element`
_Необязательное, использует стандартный компонент по умолчанию_\
Компонент для отображения в случае, если путь не найден.

### `useBridge: boolean`
_Необязательное, по умолчанию `true`_\
Должно быть `true` при запуске приложения внутри ВКонтакте
(vk.com, m.vk.com, приложения для iOS, Android).\
Если приложение запущено самостоятельно, следует установить `false`.

### `children: any`
_Обязательное_\
Контент приложения, который будет использовать роутер.

### `throttled: boolean`
_Необязательное, по умолчанию `true`_\
Включение задержки для навигации.\
При включении ограничивает частоту выполнения навигации значением параметра `interval`.
Это помогает гарантировать работоспособность анимаций VKUI.\
Если несколько запросов на навигацию случиться за период задержки, выполнен будет последний.

### `interval: number`
_Необязательное, по умолчанию `400`_\
Минимальная задержка между двумя последовательными навигациями, задана в ms.

### `hierarchy: RouteLeaf[]`
_Необязательное, по умолчанию `undefined`_\
Дерево страниц, которое позволяет внести в историю навигации
сразу несколько записей при входе в приложение по прямой ссылке с
параметром `?inflate=true`.

```tsx
export interface RouteLeaf {
  path: string;
  children?: RouteLeaf[];
}
```
Пример структуры:
```tsx
export const hierarchy: RouteLeaf[] = [{
  path: '/',
  children: [
    {
      path: `/${DEFAULT_VIEW_PANELS.PERSIK}`,
      children: [{ path: `/${DEFAULT_VIEW_PANELS.PERSIK}/${PERSIK_PANEL_MODALS.PERSIK}` }],
    }, {
      path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion`,
      children: [{ path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion/${PERSIK_PANEL_MODALS.PERSIK}` }],
    },
  ],
}];
```
Пример пути: `/persik/fish/persik_modal?inflate=true`.
