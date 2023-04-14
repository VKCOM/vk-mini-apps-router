import { RouteNavigator } from './contexts';
import { AgnosticDataRouteObject, AgnosticRouteMatch, Router, RouterNavigateOptions } from '@remix-run/router';
import { resolveRouteToPath } from './utils';

export class DefaultRouteNavigator implements RouteNavigator {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public push(to: string | AgnosticRouteMatch<string, AgnosticDataRouteObject>): void {
    this.navigate(to);
  }

  public replace(to: string | AgnosticRouteMatch<string, AgnosticDataRouteObject>): void {
    this.navigate(to, { replace: true });
  }

  public back(): void {
    this.router.navigate(-1);
  }

  private async navigate(
    to: string | AgnosticRouteMatch<string, AgnosticDataRouteObject>,
    opts?: RouterNavigateOptions | undefined,
  ): Promise<void> {
    if (typeof to === 'string') {
      await this.router.navigate(to, opts);
    } else {
      await this.router.navigate(resolveRouteToPath(to.route, this.router.routes, to.params), opts);
    }
  }
}
