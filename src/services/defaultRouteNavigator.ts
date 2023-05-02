import { AgnosticDataRouteObject, AgnosticRouteMatch, Location, Router, RouterNavigateOptions } from '@remix-run/router';
import { createKey, isModalShown, isPopoutShown, resolveRouteToPath } from '../utils/utils';
import { STATE_KEY_BLOCK_FORWARD_NAVIGATION, STATE_KEY_SHOW_MODAL, STATE_KEY_SHOW_POPOUT } from '../const';
import { RouteNavigator } from './routeNavigator.type';

export class DefaultRouteNavigator implements RouteNavigator {
  private router: Router;
  private setPopout: (popout: JSX.Element | null) => void;

  constructor(router: Router, setPopout: (popout: JSX.Element | null) => void) {
    this.router = router;
    this.setPopout = setPopout;
  }

  public push(to: string): void {
    this.navigate(to, { replace: Boolean(this.router.state.location.state?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION]) });
  }

  public replace(to: string): void {
    this.navigate(to, { replace: true });
  }

  public back(): void {
    this.router.navigate(-1);
  }

  public showModal(id: string): void {
    this.navigate(this.router.state.location, {
      state: { [STATE_KEY_SHOW_MODAL]: id, [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true },
      replace: isModalShown(this.router.state.location),
    });
  }

  public hideModal(pushPanel = false): void {
    if (!pushPanel || isModalShown(this.router.state.location)) {
      this.router.navigate(-1);
    } else {
      const modalMatchIndex = this.router.state.matches.findIndex((match) => 'modal' in match.route);
      if (modalMatchIndex > -1) {
        this.navigate(this.router.state.matches[modalMatchIndex - 1]);
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
    this.navigate(this.router.state.location, { state, replace });
  }

  public hidePopout(): void {
    if (isPopoutShown(this.router.state.location)) {
      this.setPopout(null);
      if (isModalShown(this.router.state.location)) {
        this.navigate(this.router.state.location, {
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

  private async navigate(
    to: string | AgnosticRouteMatch<string, AgnosticDataRouteObject> | Location,
    opts?: RouterNavigateOptions | undefined,
  ): Promise<void> {
    if (typeof to === 'string' || 'key' in to) {
      await this.router.navigate(to, opts);
    } else {
      await this.router.navigate(resolveRouteToPath(to.route, this.router.routes, to.params), opts);
    }
  }
}
