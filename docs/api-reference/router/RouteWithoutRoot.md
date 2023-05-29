# RouteWithoutRoot
Описание маршрута в приложении, имеющем один компонент `Root`.

Наследует базовые свойства маршрута от [`CommonRouteObject`](CommonRouteObject.md)

## Объявление типа
```tsx
export interface PanelWithoutRoot extends CommonRouteObject {
  view: string;
  panel: string;
}

export interface ModalWithoutRoot extends PanelWithoutRoot {
  modal: string;
}

export type RouteWithoutRoot = PanelWithoutRoot | ModalWithoutRoot;
```
