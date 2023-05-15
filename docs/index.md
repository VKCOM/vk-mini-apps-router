# Руководство пользователя @vkontakte/vk-mini-app-router
Ниже приведены инструкции для запуска и использования `@vkontakte/vk-mini-app-router` в вашем приложении на основе библиотеки VKUI.

Вы можете запустить [демо-приложение](TODO:Добавить ссылку) для ознакомления с функционалом роутера.

## Установка

TODO: добавить ссылку на npm пакет!

## Подключение роутера

1. Создайте роутер с помощью функции `createHashRouter` из [описания путей приложения](#настройка-маршрутов)
```tsx
import { createHashRouter } from '@vkontakte/vk-mini-app-router';
const router = createHashRouter([/* описание путей приложения */]);
```
2. Оберните приложение в `RouterProvider`, передав ему `router`
```tsx
import { RouterProvider } from '@vkontakte/vk-mini-app-router';
import App from './App';

<RouterProvider router={router}>
  <App />
</RouterProvider>
```

Пример целиком, с подключением конфигурации VKUI:
```tsx
import { RouterProvider, createHashRouter } from '@vkontakte/vk-mini-app-router';
import { createRoot } from 'react-dom/client';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import { App } from './App'; // Пример содержимого будет ниже.

const router = createHashRouter([
  {
    path: '/',
    panel: 'home_panel',
    view: 'default_view',
  },
]);

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <AppRoot>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>
);
```

## Использование роутера для отображения страниц

Информацию о текущем местоположении пользователя можно получить из хука `useActiveVkuiLocation`:
```tsx
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-app-router';
import { Root, View, Panel } from '@vkontakte/vkui';

export function App() {
  const { view: activeView, panel: activePanel } = useActiveVkuiLocation();

  return(
    <Root activeView={activeView}>
      <View nav="default_view" activePanel={activePanel}>
        <Panel nav="home_panel">/* Содержимое страницы Home */</Panel>
        <Panel nav="persik_panel">/* Содержимое страницы Persik */</Panel>
        // Другие компоненты Panel
      </View>
      // Другие компоненты View
    </Root>
  )
}
```

## Настройка маршрутов
### В виде объекта JSON

### С типизацией

## Навигация

## Модальные окна и компоненты popout

### Отображение модальных окон с путем (собственный URL)

### Отображение модальных окон без изменения пути

### Отображение компонентов popout окон без изменения пути

## Обработка несуществующих путей (404)

## Обработка ошибок загрузки (5xx)

## Визуальные эффекты

### Плавный переход между панелями и swipe back
