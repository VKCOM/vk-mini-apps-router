export type { BlockerFunction, Blocker } from '@remix-run/router';
export type { RouteWithoutRoot, RouteWithRoot, RouteLeaf } from './type';
export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export { RouterLink } from './components/RouterLink';
export { createHashRouter } from './utils/createHashRouter';
export { createHashParamRouter } from './utils/createHashParamRouter';
export { createBrowserRouter } from './utils/createBrowserRouter';

export { useRouteNavigator, usePopout } from './hooks/hooks';
export { useParams } from './hooks/useParams';
export { useGetPanelForView } from './hooks/useGetPanelForView';
export { useSearchParams } from './hooks/useSearchParams';
export type { SetURLSearchParams } from './hooks/useSearchParams';
export { useMetaParams } from './hooks/useMetaParams';
export { useHistoryManager } from './hooks/useHistoryManager';
export type { ViewNavigationRecord } from './services/ViewNavigationRecord.type';
export { useFirstPageCheck } from './hooks/useFirstPageCheck';
export { useActiveVkuiLocation } from './hooks/useActiveVkuiLocation';
export { useEnableSwipeBack } from './hooks/useEnableSwipeBack';
export { useHref } from './hooks/useHref';
export { useBlocker } from './hooks/useBlocker';
export { useLinkClickHandler } from './hooks/useLinkClickHandler';

export { withRouter } from './hoc/withRouter';

export type { RouteNavigator } from './services/RouteNavigator.type';
export { getInitialLocation } from './services/InitialLocation';

export {
  RoutesConfig,
  createView,
  createRoot,
  createPanel,
  createTab,
  createModal,
} from './page-types';
