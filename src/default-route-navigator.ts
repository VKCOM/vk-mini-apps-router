import { RouteNavigator } from './contexts';
import { Router } from '@remix-run/router';

export class DefaultRouteNavigator implements RouteNavigator {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public push(path: string): void {
    this.router.navigate(path);
  }

  public replace(path: string): void {
    this.router.navigate(path, { replace: true });
  }

  public get activeViewHistory(): string[] {
    console.log('activeViewHistory');
    return [];
  }
}
