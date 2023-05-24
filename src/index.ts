export type { RouteWithoutRoot, RouteWithRoot } from './type';
export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export { createHashRouter } from './utils/createHashRouter';

export {
  useRouteNavigator,
  useParams,
  usePopout,
} from './hooks/hooks';
export { useSearchParams } from './hooks/useSearchParams';
export { useFirstPageCheck } from './hooks/useFirstPageCheck';
export { useActiveVkuiLocation } from './hooks/useActiveVkuiLocation';
export { useEnableSwipeBack } from './hooks/useEnableSwipeBack';

export { withRouter } from './hoc/withRouter';

export type { RouteNavigator } from './services/routeNavigator.type';

export { RoutesConfig, createView, createRoot, createPanel, createModal } from './page-types';
