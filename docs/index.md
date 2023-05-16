# Руководство пользователя @vkontakte/vk-mini-app-router
Ниже приведены инструкции для запуска и использования `@vkontakte/vk-mini-app-router` в вашем приложении на основе библиотеки VKUI.

[Описание публичных интерфейсов тут.](api-reference/apiReference.md)

Вы можете запустить [демо-приложение](../examples/vk-mini-app-router-example/README.md) для ознакомления с функционалом роутера.

## Установка

TODO: добавить ссылку на npm пакет!

## Подключение роутера

1. Создайте роутер с помощью функции `createHashRouter`, передав ей [описания путей приложения](#настройка-маршрутов)
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
Можно задать список маршрутов приложения через массив объектов `RouteWithoutRoot`
(в случае, когда приложение имеет несколько элементов `Root`, обернутых в `Epic`) или `RouteWithRoot` (если Root всего один).

Параметр `path` определяет URL, на котором компонент нужно вывести. Параметры `root`, `view`, `panel`, `modal` определяют компоненты UI,
ответственные за рендеринг нужной страницы.

Пример использования (создание роутера смотри в разделе [Подключение роутера](#подключение-роутера)):
```tsx
import { RouteWithRoot, createHashRouter } from '@vkontakte/vk-mini-app-router';

const routes: RouteWithRoot[] = [
  {
    path: '/',
    panel: 'home_panel',
    view: 'default_view',
    root: 'default_root',
  },
  {
    path: `/user`,
    modal: 'user_modal',
    panel: 'home_panel',
    view: 'default_view',
    root: 'default_root',
  },
  {
    path: `/persik/:emotion`,
    panel: 'persik_panel',
    view: 'default_view',
    root: 'default_root',
  },
  // Другие маршруты...
]

// Далее список маршрутов нужно передать в функцию создания роутера:
const router = createHashRouter(routes);
```

## Навигация
Для выполнения навигации в библиотеке существует интерфейс `RouteNavigator`.\
Получить к нему доступ можно через хук `useRouteNavigator`.

```tsx
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router';

export function PersikPage() {
  const routeNavigator = useRouteNavigator();
  
  return (
    <Button onClick={() => routeNavigator.push('/')}>
      На главную
    </Button>
  );
}
```

Метод `RouteNavigator.push(path)` добавляет новую запись в историю. При этом более поздние записи удаляются,
если пользователь находился не на последней.

Метод `RouteNavigator.replace(path)` заменяет текущую запись в истории. При этом текущая запись становится более недоступной,
предыдущие и следующие записи сохраняются.

### Навигация по строке
В методы `RouteNavigator.push(path)` и `RouteNavigator.replace(path)` можно передать строку URL.
```tsx
routeNavigator.push('/');
routeNavigator.push('/persik');
routeNavigator.push('/user/123');
```

В случае навигации на `/user/123` путь страницы имеет параметр `/user/:id`.
При отображении страницы можно [использовать параметры](#использование-параметров-из-URL) из пути для отображения запрошенных данных.

### Навигация назад
Метод `RouteNavigator.back()` работает как браузерная кнопка назад.

### Логика перехода назад с "первой" страницы
Часто кнопка назад делает шаг назад по истории.
Это бывает нежелательно при входе в приложение по прямой ссылке.
Можно проверить, есть ли записи в истории навигации используя хук `useFirstPageCheck()`.

```tsx
import { useFirstPageCheck, routeNavigator } from '@vkontakte/vk-mini-app-router';
import { PanelPanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

const routeNavigator = useRouteNavigator();
const isFirstPage = useFirstPageCheck();
<PanelHeader
  before={<PanelHeaderBack onClick={() => isFirstPage ? routeNavigator.push('/') : routeNavigator.back()} />}
>
```

### Использование параметров из URL
Для объявления пути содержащего параметр используйте двоеточие, за которым следует имя параметра (`:id`).

Например:
```tsx
const routes: RouteWithoutRoot[] = [
  {
    path: `/persik/:emotion`, // Параметр emotion.
    panel: 'persik_panel',
    view: 'default_view',
  },
  // Другие маршруты...
]
```

Имя параметра занимает все место от `/` до `/`:\
`/user/:id/edit` - верный путь\
`/user_:id/edit` - неверный путь

Путь может содержать несколько параметров.

### Использование query параметров
Параметры строки поиска (после знака `?` в URL) представлены в виде [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).\
Получить к ним доступ можно через хук `useSearchParams()`, который возвращает их текущее значение и метод для их изменения.

```tsx
import { useSearchParams } from '@vkontakte/vk-mini-app-router';

export function PersikPage() {
  const [params, setParams] = useSearchParams();

  return (
    <Button onClick={() => setParams(params.set('name', 'persik'))}>
      {params.get('name')}
    </Button>
  );
}
```

## Модальные окна и компоненты popout
Роутер можно использовать для отображения модальных страниц, карточек или компонентов Popout (загрузка, подтверждение, уведомление).\
Модальные страницы и карточки можно выводить как с изменением URL, так и без, в зависимости от бизнес-логики.\
Popout всегда выводится без изменения URL.

В любом случае пользователь может использовать браузерную или нативную кнопку назад, чтобы закрыть модальные окно или Popout.\
Вперед можно будет вернуться только если модальное окно было выведено со сменой URL.

### Отображение модальных окон
В VKUI модальные страницы и карточки выводятся внутри `ModalRoot`.
```tsx
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-app-router';
import { ModalPage, ModalRoot } from '@vkontakte/vkui';

export function Modals() {
  const routeNavigator = useRouteNavigator();
  const { modal: activeModal } = useActiveVkuiLocation();
  return (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <ModalPage id='persik_modal'>/* Содержимое модального окна (может быть в другом файле) */</ModalPage>
      <ModalPage id='user_modal'>/* Содержимое модального окна (может быть в другом файле) */</ModalPage>
    </ModalRoot>
  );
}
```

Модальные страницы (`<Modals />`) нужно подключить в приложении.\
Сделать это можно через поле `modal` компонента [SplitLayout](https://vkcom.github.io/VKUI/#/SplitLayout).\
Например, можно обернуть в SplitLayout все приложение, или каждую страницу, на которой есть модальное окно или Popout.

Метод `routeNavigator.hideModal()` закрывает модальное окно.
Его следует указать как реакцию на `onClose` каждого окна или компонента `ModalRoot`.

### Открытие модальных окон с путем (собственный URL)
Бывают случаи, когда URL должен меняться при открытии модального окна.\
Например, если можно поделиться ссылкой на страницу с открытым окном (карточка товара поверх каталога).\
Такие окна должны быть зарегистрированы в списке маршрутов приложения (параметр `modal`):
```tsx
const routes: RouteWithRoot[] = [
  {
    path: `/user`,
    modal: 'user_modal',
    panel: 'home_panel',
    view: 'default_view',
    root: 'default_root',
  },
  // Другие маршруты...
]
```

Чтобы показать такое окно, нужно выполнить [навигацию на нужный URL](#навигация).

### Открытие модальных окон без изменения пути
Бывает и так, что модальное окно не имеет смысла в отрыве от текущей сессии.
Тогда его удобнее показать без изменения URL.\
Такое окно не регистрируется в списке маршрутов,
но [регистрируется в ModalRoot](#отображение-модальных-окон).

Но для его отображения не нужно осуществлять навигацию.\
Вместо этого следует вызвать метод `routeNavigator.showModal('modal_id')` с ID модального окна.\
Закрыть модальное окно программно можно вызвав метод `routeNavigator.hideModal()`.

### Открытие компонентов popout окон без изменения пути
Компоненты `Popout` не имеют смысла в отрыве от текущей сессии, потому что обычно показывают временное состояние,
уведомляют о произошедшем событии или просят у пользователя подтвердить действие.\
Поэтому различные Popout отображаются без изменения URL.

Для отображения компонента Popout следует передать его JSX.Element в метод `routeNavigator.showPopout(renderedElement)`.\
Для получения открытого через роутер Popout есть хук `usePopout()`.
Popout можно вывести через поле `popout` компонента [SplitLayout](https://vkcom.github.io/VKUI/#/SplitLayout).\
Например, можно обернуть в SplitLayout все приложение, или каждую страницу, на которой есть модальное окно или Popout.

Закрыть Popout программно можно вызвав метод `routeNavigator.hidePopout()`.

App.tsx:
```tsx
import { SplitLayout, SplitCol } from '@vkontakte/vkui';
import { usePopout } from '@vkontakte/vk-mini-app-router';

function App() {
  const routerPopout = usePopout();
  return (
    <SplitLayout popout={routerPopout}>
      <SplitCol>/* Разные Root, View, Panel */</SplitCol>
    </SplitLayout>
  );
}
```

Persik.tsx:
```tsx
import { Button, Alert } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router';

export const Persik = () => {
  const routeNavigator = useRouteNavigator();
  const popup =
    <Alert
      actions={[
        {
          title: 'Забрать',
          autoClose: true,
          mode: 'destructive',
          // Задержать открытие другой страницы с помощью setTimeout, чтобы завершилась анимация закрытия Alert.
          action: () => setTimeout(() => routeNavigator.push('/persik/sad', { keepSearchParams: true }), 100),
        },
      ]}
      onClose={() => routeNavigator.hidePopout()}
      header="Еда персика"
      text="Вы уверены, что хотите забрать у персика еду?"
    />;

  return (
    <Button onClick={() => routeNavigator.showPopout(popup)}>Открыть попаут из модалки</Button>
  );
};
```

## Обработка несуществующих путей (404)
При попытке перехода на несуществующий адрес пользователю будет показан специальный экран.
По умолчанию экран сообщает о том что страница не найдена и предлагает перейти на главную (`/`).

Можно передать в `RouterProvider` свою страницу ошибки. Свойство `notFound` принимает `JSX.Element`.
```tsx
<RouterProvider router={router} notFound={<p>Ничегошеньки!</p>}>
  /* Ваше приложение */
</RouterProvider>
```

## Обработка ошибок приложения и загрузки данных (5xx)
Роутер не работает с данными и рендерингом - все ошибки происходят вне функций роутера.\
Обработка и отображение ошибок приложения и сервера остается на стороне приложения.

## Типизация маршрутов
Роутер поддерживает TypeScript.

### Объявление типизированных путей
Маршруты можно объявить с использованием функций.\
Такой подход позволяет использовать не только URL при навигации в приложении,
но и типизированные объекты с подсказками о необходимых параметрах.

Пример использования:
```tsx
import {
  createHashRouter,
  createModal,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-app-router';

export const routes = RoutesConfig.create([
  createRoot('default_root', [
    createView('default_view', [
      createPanel('home_panel', `/`),
      createPanel('persik_panel', `/persik/:emotion`, [
        createModal('persik_modal', `/persik/:emotion/modal`, ['emotion'] as const),
        // Другие createModal(...),
      ], ['emotion'] as const),
      // Другие createPanel(...),
    ]),
    // Другие createView(...),
  ]),
  // Другие createRoot(...),
]);

export const router = createHashRouter(routes.getRoutes());
```

Страницы доступны как свойства `routes`: `routes.default_root.default_view.persik_panel`

### Навигация по объекту
В методы `RouteNavigator.push(page, params?)` и `RouteNavigator.replace(page, params?)` можно передать типизированный объект,
полученный при объявлении маршрутов через `RoutesConfig.create()`.
```tsx
routeNavigator.push(routes.default_root.default_view.home_panel);
routeNavigator.push(routes.default_root.default_view.persik_panel, { 'emotion': 'sad' });
routeNavigator.push(routes.default_root.default_view.persik_panel.persik_modal, { 'emotion': 'sad' });
```

При этом IDE будет подсказывать, нужны ли параметры и какие должны быть ключи.

## Визуальные эффекты
Основная особенность роутера - интеграция с библиотекой VKUI.
Роутер предоставляет данные, необходимые для плавной и надежной работы анимаций библиотеки.

### Плавный переход между панелями и swipe back
View в библиотеке VKUI предоставляет возможность плавного перехода между панелями жестом swipe back.
Подробнее можно [почитать тут](https://vkcom.github.io/VKUI/#/View).\
Нужную для настройки информацию можно получить из роутера.

История переходов между панелями внутри одной `View` доступна в виде свойства `panelsHistory` объекта,
возвращаемого хуком `useActiveVkuiLocation()`.

```tsx
import { Root, View, Panel } from '@vkontakte/vkui';
import { useRouteNavigator, useActiveVkuiLocation } from '@vkontakte/vk-mini-app-router';

function App() {
  const {
    view: activeView,
    panel: activePanel,
    panelsHistory,
  } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  return (
    <Root activeView={activeView}>
      <View
        nav="default_view"
        history={panelsHistory}
        activePanel={activePanel}
        onSwipeBack={() => routeNavigator.back()}
      >
        <Panel nav="home_panel">Содержимое страницы</Panel>
        <Panel nav="persik_panel">Содержимое страницы</Panel>
      </View>
    </Root>
  );
}
```
