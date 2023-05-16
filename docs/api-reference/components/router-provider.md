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

## Свойства

### `router`
_Обязательное_

Объект типа `Router` созданный при помощи метода [`createHashRouter`](../router/create-hash-router.md).

### `notFound`
_Необязательное, использует стандартный компонент по умолчанию_

Компонент для отображения в случае, если путь не найден.

### `useBridge`
_Необязательное, по умолчанию `true`_

Должно быть `true` при запуске приложения внутри ВКонтакте (vk.com, m.vk.com, приложения для iOS, Android).

Если приложение запущено самостоятельно, следует установить `false`.
