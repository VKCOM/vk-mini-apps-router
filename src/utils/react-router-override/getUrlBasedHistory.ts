import { Action, createPath, History, Location, To } from '@remix-run/router';
import { UrlHistoryOptions } from './UrlHistoryOptions.type';
import { Listener } from '@remix-run/router/dist/history';
import { createLocation } from './createLocation';
import { getHistoryState } from './getHistoryState';
import { invariant } from '../utils';

const PopStateEventType = 'popstate';

/* eslint-disable @typescript-eslint/no-use-before-define */
export function getUrlBasedHistory(
  getLocation: (window: Window, globalHistory: Window['history']) => Location,
  createHref: (window: Window, to: To) => string,
  validateLocation: ((location: Readonly<Location>, to: To) => void) | null,
  options: UrlHistoryOptions = {},
): History {
  const { window = document.defaultView!, v5Compat = false } = options;
  const globalHistory = window.history;
  let action = Action.Pop;
  let listener: Listener | null = null;

  let index = getIndex()!;
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function getIndex(): number {
    const state = globalHistory.state || { idx: null };
    return state.idx;
  }

  function handlePop() {
    action = Action.Pop;
    const nextIndex = getIndex();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({ action, location: history.location, delta });
    }
  }

  function push(to: To, state?: any) {
    action = Action.Push;
    const location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);

    index = getIndex() + 1;
    const historyState = getHistoryState(location, index);
    const url = history.createHref(location);

    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, '', url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, const that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === 'DataCloneError') {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }

    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 1 });
    }
  }

  function replace(to: To, state?: any) {
    action = Action.Replace;
    const location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);

    index = getIndex();
    const historyState = getHistoryState(location, index);
    const url = history.createHref(location);
    globalHistory.replaceState(historyState, '', url);

    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 0 });
    }
  }

  function createURL(to: To): URL {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    const base = window.location.origin !== 'null' ? window.location.origin : window.location.href;

    const href = typeof to === 'string' ? to : createPath(to);
    invariant(base, `No window.location.(origin|href) available to create URL for href: ${href}`);
    return new URL(href, base);
  }

  const history: History = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn: Listener) {
      if (listener) {
        throw new Error('A history only accepts one active listener');
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;

      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      const url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    },
  };

  return history;
}
