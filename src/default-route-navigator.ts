import { RouteNavigator } from './contexts';
import { AgnosticDataRouteObject, AgnosticRouteMatch, Location, Router, RouterNavigateOptions } from '@remix-run/router';
import { isModalShown, resolveRouteToPath } from './utils';
import { STATE_KEY_BLOCK_FORWARD_NAVIGATION, STATE_KEY_SHOW_MODAL } from './const';

export class DefaultRouteNavigator implements RouteNavigator {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
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

  public hideModal(): void {
    if (isModalShown(this.router.state.location)) {
      this.router.navigate(-1);
    } else {
      const modalMatchIndex = this.router.state.matches.findIndex((match) => 'modal' in match.route);
      if (modalMatchIndex > -1) {
        this.navigate(this.router.state.matches[modalMatchIndex - 1]);
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
