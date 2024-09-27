import { BlockerFunction, Params, Router, RouterNavigateOptions, To } from '@remix-run/router';
import {
  createKey,
  getParamKeys,
  getPathFromTo,
  isModalShown,
  isPopoutShown,
} from '../utils/utils';
import {
  NAVIGATION_BLOCKER_KEY,
  STATE_KEY_BLOCK_FORWARD_NAVIGATION,
  STATE_KEY_SHOW_MODAL,
  STATE_KEY_SHOW_POPOUT,
} from '../const';
import { NavigationOptions, RouteNavigator } from './RouteNavigator.type';
import { buildPanelPathFromModalMatch } from '../utils/buildPanelPathFromModalMatch';
import { InternalRouteConfig, ModalWithRoot } from '../type';
import { Page, PageWithParams } from '../page-types/common';
import { ViewHistory } from './ViewHistory';
import { TransactionExecutor } from './TransactionExecutor';
import { NavigationTransaction } from '../entities/NavigationTransaction';

export class DefaultRouteNavigator implements RouteNavigator {
  private readonly router: Router;
  private readonly setPopout: (popout: JSX.Element | null) => void;
  private blockers: Map<string, BlockerFunction> = new Map();
  private blockerId = 0;

  constructor(
    router: Router,
    private viewHistory: ViewHistory,
    setPopout: (popout: JSX.Element | null) => void,
  ) {
    this.router = router;
    this.setPopout = setPopout;
  }

  public async push(
    to: To | Page | PageWithParams<string>,
    paramsOrOptions: Params | NavigationOptions = {},
    options: NavigationOptions = {},
  ): Promise<void> {
    const { preparedOptions, preparedParams } = this.parseParams(to, paramsOrOptions, options);
    const fullOptions = {
      ...preparedOptions,
      replace: Boolean(this.router.state.location.state?.[STATE_KEY_BLOCK_FORWARD_NAVIGATION]),
    };

    await this.navigate(to, fullOptions, preparedParams);
  }

  public async replace(
    to: To | Page | PageWithParams<string>,
    paramsOrOptions: Params | NavigationOptions = {},
    options: NavigationOptions = {},
  ): Promise<void> {
    const { preparedOptions, preparedParams } = this.parseParams(to, paramsOrOptions, options);

    await this.navigate(to, { ...preparedOptions, replace: true }, preparedParams);
  }

  public async back(to = 1): Promise<void> {
    if (to === 0) {
      return;
    }
    await this.go(-Math.abs(to));
  }

  public async backToFirst(): Promise<void> {
    if (this.viewHistory.position > 0) {
      await this.go(-this.viewHistory.position);
    } else {
      await TransactionExecutor.doNext();
    }
  }

  public async go(to: number): Promise<void> {
    if (to === 0) {
      await TransactionExecutor.doNext();
    } else {
      await this.router.navigate(to);
    }
  }

  public runSync(actions: VoidFunction[]): Promise<void> {
    const transaction = new NavigationTransaction(actions);
    TransactionExecutor.add(transaction);
    TransactionExecutor.doNext();
    return transaction.donePromise;
  }

  public async showModal(id: string): Promise<void> {
    await this.router.navigate(this.router.state.location, {
      state: { [STATE_KEY_SHOW_MODAL]: id, [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true },
      replace: isModalShown(this.router.state.location),
    });
  }

  public async hideModal(pushPanel = false): Promise<void> {
    if ((!pushPanel && !this.viewHistory.isFirstPage) || isModalShown(this.router.state.location)) {
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
        await TransactionExecutor.doNext();
      }
    }
  }

  public async showPopout(popout: JSX.Element): Promise<void> {
    this.setPopout(popout);
    const state: any = {
      [STATE_KEY_SHOW_POPOUT]: createKey(),
      [STATE_KEY_BLOCK_FORWARD_NAVIGATION]: true,
    };
    if (isModalShown(this.router.state.location)) {
      state[STATE_KEY_SHOW_MODAL] = this.router.state.location.state[STATE_KEY_SHOW_MODAL];
    }
    const replace =
      isModalShown(this.router.state.location) || isPopoutShown(this.router.state.location);
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
      await TransactionExecutor.doNext();
    }
  }

  public block(blocker: BlockerFunction) {
    const key = (++this.blockerId).toString();
    this.blockers.set(key, blocker);
    const onLeave: BlockerFunction = (data) => {
      return Array.from(this.blockers.values()).some((fn) => fn(data));
    };
    this.router.getBlocker(NAVIGATION_BLOCKER_KEY, onLeave);

    return () => {
      this.blockers.delete(key);
    };
  }

  private async navigate(
    to: To | Page | PageWithParams<string>,
    opts?: RouterNavigateOptions & NavigationOptions,
    params: Params = {},
  ): Promise<void> {
    let path = getPathFromTo({ to, params, defaultPathname: this.router.state.location.pathname });
    const newUrl = new URL(path, window.location.origin);

    if (opts?.keepSearchParams && !newUrl.search) {
      path += this.router.state.location.search;
    }

    await this.router.navigate(path, opts);
  }

  private validateOptions({ state, keepSearchParams }: NavigationOptions = {}) {
    const invalidState = state && typeof state !== 'object';
    const invalidKeepSearchParams = keepSearchParams && typeof keepSearchParams !== 'boolean';

    if (invalidState || invalidKeepSearchParams) {
      console.warn('Invalid navigate options type');
      return {};
    }
    return { state, keepSearchParams };
  }

  private parseParams(
    to: To | Page | PageWithParams<string>,
    paramsOrOptions: Params | NavigationOptions = {},
    options: NavigationOptions = {},
  ) {
    const path = typeof to === 'object' ? ('path' in to ? to.path : to.pathname || '') : to;

    if (getParamKeys(path).length) {
      return {
        preparedParams: paramsOrOptions as Params,
        preparedOptions: this.validateOptions(options),
      };
    }

    return { preparedParams: {}, preparedOptions: this.validateOptions(paramsOrOptions) };
  }
}
