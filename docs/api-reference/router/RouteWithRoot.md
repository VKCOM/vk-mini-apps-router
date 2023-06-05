# RouteWithRoot
Описание маршрута в приложении, имеющем несколько компонентов `Root` (используется компонент `Epic`).

Наследует базовые свойства маршрута от [CommonRouteObject](CommonRouteObject.md)

## Объявление типа
```tsx
export interface PanelWithRoot extends CommonRouteObject {
  root: string;
  view: string;
  panel: string;
  tab?: string;
}

export interface ModalWithRoot extends PanelWithRoot {
  modal: string;
}

export type RouteWithRoot = PanelWithRoot | ModalWithRoot;
```
