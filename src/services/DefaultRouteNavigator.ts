import { Params, Router, RouterNavigateOptions, UNSAFE_invariant as invariant } from '@remix-run/router';
import { createKey, fillParamsIntoPath, isModalShown, isPopoutShown } from '../utils/utils';
import { STATE_KEY_BLOCK_FORWARD_NAVIGATION, STATE_KEY_SHOW_MODAL, STATE_KEY_SHOW_POPOUT } from '../const';
import { hasNavigationOptionsKeys, NavigationOptions, RouteNavigator } from './RouteNavigator.type';
import { buildPanelPathFromModalMatch } from '../utils/buildPanelPathFromModalMatch';
import { InternalRouteConfig, ModalWithRoot } from '../type';
import { Page, PageWithParams } from '../page-types/common';
import { ViewHistory } from './ViewHistory';
import { TransactionExecutor } from './TransactionExecutor';
import { NavigationTransaction } from '../entities/NavigationTransaction';

export class DefaultRouteNavigator implements RouteNavigator {
  private readonly router: Router;
  private readonly setPopout: (popout: JSX.Element | null) => void;

  constructor(
    router: Router,
    private viewHistory: ViewHistory,
    private transactionExecutor: TransactionExecutor,
    setPopout: (popout: JSX.Element | null) => void,
  ) {
    this.router = router;
    this.setPopout = setPopout;
  }

  public async push(
    to: string | Page | PageWithParams<string>,
    paramsOrOptions: Params | NavigationOptions = {},
    options: NavigationOptions = {}
  ): Promise<void> {
    const paramsAreOptions = hasNavigationOptionsKeys(paramsOrOptions);
    const preparedOptions: NavigationOptions = paramsAreOptions ? paramsOrOptions : options;
    const fullOptions = { ...preparedOptions, replace: Boolean(this.router.state.location.state?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION]) };
    const preparedParams: Params = paramsAreOptions ? {} : paramsOrOptions as Params;
    await this.navigate(to, fullOptions, preparedParams);
  }

  public async replace(
    to: string | Page | PageWithParams<string>,
    paramsOrOptions: Params | NavigationOptions = {},
    options: NavigationOptions = {}
  ): Promise<void> {
    const paramsAreOptions = hasNavigationOptionsKeys(paramsOrOptions);
    const preparedOptions: NavigationOptions = paramsAreOptions ? paramsOrOptions : options;
    const preparedParams: Params = paramsAreOptions ? {} : paramsOrOptions as Params;
    await this.navigate(to, { ...preparedOptions, replace: true }, preparedParams);
  }

  public async back(to = -1): Promise<void> {
    invariant(to < 0, `Parameter 'to' must be negative, ${to} passed. Use method 'go()' for any integer offset`);
    await this.go(to);
  }

  public async backToFirst(): Promise<void> {
    if (this.viewHistory.position > 0) {
      await this.go(-this.viewHistory.position);
    } else {
      await this.transactionExecutor.doNext();
    }
  }

  public async go(to: number): Promise<void> {
    if (to === 0) {
      await this.transactionExecutor.doNext();
    } else {
      await this.router.navigate(to);
    }
  }

  public transaction(actions: VoidFunction[]): Promise<void> {
    const transaction = new NavigationTransaction(actions);
    this.transactionExecutor.add(transaction);
    this.transactionExecutor.doNext();
    return transaction.donePromise;
  }

  public async showModal(id: string): Promise<void> {
    await this.router.navigate(this.router.state.location, {
      state: { [STATE_KEY_SHOW_MODAL]: id, [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true },
      replace: isModalShown(this.router.state.location),
    });
  }

  public async hideModal(pushPanel = false): Promise<void> {
    if (!pushPanel && !this.viewHistory.isFirstPage || isModalShown(this.router.state.location)) {
      await this.router.navigate(-1);
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
        await this.navigate(path, { keepSearchParams: true });
      } else {
        await this.transactionExecutor.doNext();
      }
    }
  }

  public async showPopout(popout: JSX.Element | null): Promise<void> {
    this.setPopout(popout);
    const state: any = {
      [STATE_KEY_SHOW_POPOUT]: createKey(),
      [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true,
    };
    if (isModalShown(this.router.state.location)) {
      state[STATE_KEY_SHOW_MODAL] = this.router.state.location.state[STATE_KEY_SHOW_MODAL];
    }
    const replace = isModalShown(this.router.state.location) || isPopoutShown(this.router.state.location);
    await this.router.navigate(this.router.state.location, { state, replace });
  }

  public async hidePopout(): Promise<void> {
    if (isPopoutShown(this.router.state.location)) {
      this.setPopout(null);
      if (isModalShown(this.router.state.location)) {
        await this.router.navigate(this.router.state.location, {
          state: {
            [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true,
            [STATE_KEY_SHOW_MODAL]: this.router.state.location.state[STATE_KEY_SHOW_MODAL],
          },
          replace: true,
        });
      } else {
        await this.router.navigate(-1);
      }
    } else {
      await this.transactionExecutor.doNext();
    }
  }

  private async navigate(
    to: string | Page | PageWithParams<string>,
    opts?: RouterNavigateOptions & NavigationOptions,
    params: Params = {}
  ): Promise<void> {
    let path = typeof to === 'string'
      ? to
      : to.hasParams
        ? fillParamsIntoPath(to.path, params)
        : to.path;

    if (opts?.keepSearchParams) {
      path += this.router.state.location.search;
    }

    await this.router.navigate(path, opts);
  }
}
