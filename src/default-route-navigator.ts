import { RouteNavigator } from './contexts';
import { AgnosticDataRouteObject, AgnosticRouteMatch, Router } from '@remix-run/router';
import { resolveRouteToPath } from './utils';

export class DefaultRouteNavigator implements RouteNavigator {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public push(to: string | AgnosticRouteMatch<string, AgnosticDataRouteObject>): void {
    if (typeof to === 'string') {
      this.router.navigate(to);
    } else {
      this.router.navigate(resolveRouteToPath(to.route, this.router.routes, to.params));
    }
  }

  public replace(path: string): void {
    this.router.navigate(path, { replace: true });
  }

  public get activeViewHistory(): string[] {
    console.log('activeViewHistory');
    return [];
  }
}
