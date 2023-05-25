import { RouteNavigator } from '../services/routeNavigator.type';
import { RouteContextObject } from '../contexts';
import { RouteLeaf, RouteLeafWithParents } from '../type';
import { TransactionExecutor } from '../services/TransactionExecutor';
import { NavigationTransaction } from '../entities/NavigationTransaction';
import { fillParamsIntoPath } from './utils';
import { createSearchParams } from './createSearchParams';
import { SEARCH_PARAM_INFLATE } from '../const';

function flattenBranch(leafs: RouteLeaf[], parents: RouteLeafWithParents[]): RouteLeafWithParents[] {
  return leafs.map((leaf) => {
    const leafWithParents = { ...leaf, parents };
    return leaf.children ? flattenBranch(leaf.children, [...parents, leafWithParents]) : leafWithParents;
  }).flat();
}

export function fillHistory(config: RouteLeaf[], routeNavigator: RouteNavigator, context: RouteContextObject, transactionExecutor: TransactionExecutor) {
  const leafs = flattenBranch(config, []);
  const currentLocation = context.state.location;
  const params = context.match?.params ?? {};
  const targetPath = context.match?.route.path;
  const targetLeaf = leafs.find((leaf) => leaf.path === targetPath);
  if (!targetLeaf) {
    return;
  }
  const records = targetLeaf.parents.map(({ path }) => fillParamsIntoPath(path, params));
  setTimeout(() => {
    if (records.length) {
      const searchParams = createSearchParams(currentLocation.search);
      searchParams.delete(SEARCH_PARAM_INFLATE);
      const search = searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '';
      const to = `${currentLocation.pathname}${search}${currentLocation.hash}`;
      const firstParent = records.shift() as string;
      const actions = [
        () => routeNavigator.replace(firstParent),
        ...records.map((record) => () => routeNavigator.push(record)),
        () => routeNavigator.push(to),
      ];
      const transaction = new NavigationTransaction(actions);
      transactionExecutor.add(transaction);
      transactionExecutor.doNext();
    }
  }, 1);
}
