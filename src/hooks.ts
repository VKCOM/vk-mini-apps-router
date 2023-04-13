import { useContext, useState } from 'react';
import { ActiveVkuiLocationContext, ActiveVkuiLocationObject, RouterContext, RouterContextObject } from './contexts';

export function useRouterContext(): RouterContextObject | null {
  return useContext(RouterContext);
}

export function useActiveVkuiLocation(): ActiveVkuiLocationObject | null {
  return useContext(ActiveVkuiLocationContext);
}

export function useForceUpdate() {
  const [, setState] = useState(0);

  return () => {
    setState(Date.now());
  };
}
