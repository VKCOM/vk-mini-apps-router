# Хук `useActiveVkuiLocation()`

## Определение типов
```tsx
interface ActiveVkuiLocationObject {
  root?: string;
  view?: string;
  panel?: string;
  tab?: string;
  modal?: string;
  hasOverlay: boolean;
  panelsHistory: string[];
}
export function useActiveVkuiLocation(): ActiveVkuiLocationObject {}
```
## Свойства возвращаемого объекта
### `root`
`string | undefined`\
Строковый идентификатор компонента `Root`,
который сейчас должен быть виден в `Epic`.

### `view`
`string | undefined`\
Строковый идентификатор компонента `View`,
который сейчас должен быть виден в `Root`.\
Может быть `undefined` в случае, когда маршрут не найден.

### `panel`
`string | undefined`\
Строковый идентификатор компонента `Panel`,
который сейчас должен быть виден во `View`.\
Может быть `undefined` в случае, когда маршрут не найден.

### `tab`
`string | undefined`\
Строковый идентификатор компонента `TabsItem`,
который сейчас должен быть виден в `Tabs` текущей `Panel`.\
Может быть `undefined` в случае, табов на странице нет
или ни один не был выбран.

### `modal`
`string | undefined`\
Строковый идентификатор модального окна (`ModalPage` или `ModalCard`),
который сейчас должен быть виден в `ModalRoot`.

### `hasOverlay`
`boolean`\
Возвращает `true` если сейчас открыто любое модальное окно или Popout.

### `panelsHistory`
`string[]`\
История идентификаторов панелей для текущего `View`.\
В случае ошибок (на текущем пути не определено свойство `view`) возвращает пустой массив.
