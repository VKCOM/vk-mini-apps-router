import { Params, Router, RouterNavigateOptions } from '@remix-run/router';
import { createKey, fillParamsIntoPath, isModalShown, isPopoutShown } from '../utils/utils';
import { STATE_KEY_BLOCK_FORWARD_NAVIGATION, STATE_KEY_SHOW_MODAL, STATE_KEY_SHOW_POPOUT } from '../const';
import { hasNavigationOptionsKeys, NavigationOptions, RouteNavigator } from './routeNavigator.type';
import { buildPanelPathFromModalMatch } from '../utils/buildPanelPathFromModalMatch';
import { InternalRouteConfig, ModalWithRoot } from '../type';
import { Page, PageWithParams } from '../page-types/common';

export class DefaultRouteNavigator implements RouteNavigator {
  private router: Router;
  private setPopout: (popout: JSX.Element | null) => void;

  constructor(router: Router, setPopout: (popout: JSX.Element | null) => void) {
    this.router = router;
    this.setPopout = setPopout;
  }

  public push(to: string | Page | PageWithParams<string>, params: Params | NavigationOptions = {}, options: NavigationOptions = {}): void {
    const paramsAreOptions = hasNavigationOptionsKeys(params);
    const preparedOptions: NavigationOptions = paramsAreOptions ? params : options;
    const preparedParams: Params = paramsAreOptions ? {} : params as Params;
    this.navigate(to, preparedParams, { ...preparedOptions, replace: Boolean(this.router.state.location.state?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION]) });
  }

  public replace(to: string | Page | PageWithParams<string>, params: Params | NavigationOptions = {}, options: NavigationOptions = {}): void {
    const paramsAreOptions = hasNavigationOptionsKeys(params);
    const preparedOptions: NavigationOptions = paramsAreOptions ? params : options;
    const preparedParams: Params = paramsAreOptions ? {} : params as Params;
    this.navigate(to, preparedParams, { ...preparedOptions, replace: true });
  }

  public back(): void {
    this.router.navigate(-1);
  }

  public showModal(id: string): void {
    this.router.navigate(this.router.state.location, {
      state: { [STATE_KEY_SHOW_MODAL]: id, [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true },
      replace: isModalShown(this.router.state.location),
    });
  }

  public hideModal(pushPanel = false): void {
    if (!pushPanel || isModalShown(this.router.state.location)) {
      this.router.navigate(-1);
    } else {
      const modalMatch = this.router.state.matches.find((match) => 'modal' in match.route);
      if (modalMatch) {
        const route = modalMatch.route as ModalWithRoot & InternalRouteConfig;
        const path = buildPanelPathFromModalMatch(modalMatch, this.router);
        if (!path) {
          const rootMessage = route.root ? `root: ${route.root} ` : '';
          throw new Error(`There is no route registered for panel with ${rootMessage}, view: ${route.view}, panel: ${route.panel}.
Make sure this route exists or use hideModal with pushPanel set to false.`);
        }
        this.router.navigate(path);
      }
    }
  }

  public showPopout(popout: JSX.Element | null): void {
    this.setPopout(popout);
    const state: any = {
      [STATE_KEY_SHOW_POPOUT]: createKey(),
      [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true,
    };
    if (isModalShown(this.router.state.location)) {
      state[STATE_KEY_SHOW_MODAL] = this.router.state.location.state[STATE_KEY_SHOW_MODAL];
    }
    const replace = isModalShown(this.router.state.location) || isPopoutShown(this.router.state.location);
    this.router.navigate(this.router.state.location, { state, replace });
  }

  public hidePopout(): void {
    if (isPopoutShown(this.router.state.location)) {
      this.setPopout(null);
      if (isModalShown(this.router.state.location)) {
        this.router.navigate(this.router.state.location, {
          state: {
            [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true,
            [STATE_KEY_SHOW_MODAL]: this.router.state.location.state[STATE_KEY_SHOW_MODAL],
          },
          replace: true,
        });
      } else {
        this.router.navigate(-1);
      }
    }
  }

  private navigate(to: string | Page | PageWithParams<string>, params: Params, opts?: RouterNavigateOptions & NavigationOptions): void {
    let path = typeof to === 'string'
      ? to
      : to.hasParams
        ? fillParamsIntoPath(to.path, params)
        : to.path;
    if (opts?.keepSearchParams) {
      path += this.router.state.location.search;
    }
    this.router.navigate(path, opts);
  }
}
