export type { RouteWithoutRoot, RouteWithRoot, RouteLeaf } from './type';
export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export { RouterLink } from './components/RouterLink';
export { createHashRouter } from './utils/createHashRouter';
export { createBrowserRouter } from './utils/createBrowserRouter';

export {
  useRouteNavigator,
  useParams,
  usePopout,
} from './hooks/hooks';
export { useGetPanelForView } from './hooks/useGetPanelForView';
export { useSearchParams } from './hooks/useSearchParams';
export { useFirstPageCheck } from './hooks/useFirstPageCheck';
export { useActiveVkuiLocation } from './hooks/useActiveVkuiLocation';
export { useEnableSwipeBack } from './hooks/useEnableSwipeBack';
export { useHref } from './hooks/useHref';
export { useLinkClickHandler } from './hooks/useLinkClickHandler';

export { withRouter } from './hoc/withRouter';

export type { RouteNavigator } from './services/RouteNavigator.type';
export { getInitialLocation } from './services/InitialLocation';

export { RoutesConfig, createView, createRoot, createPanel, createTab, createModal } from './page-types';
