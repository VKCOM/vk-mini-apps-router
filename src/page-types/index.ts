import { createView as cv } from './ViewConfig';
//  В Webpack есть особенность, которая не позволяет подключить библиотеку при наличии файла с одними ре-экспортами.
export const createView = cv;
export { createRoot } from './RootConfig';
export { createPanel } from './PanelPage';
export { createModal } from './ModalPage';
export { createTab } from './TabPage';
export { RoutesConfig } from './RoutesConfig';
