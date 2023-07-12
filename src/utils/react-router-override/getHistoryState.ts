import { Location } from '@remix-run/router';

type HistoryState = {
  usr: any;
  key?: string;
  idx: number;
};

/**
 * For browser-based histories, we combine the state and key into an object
 */
export function getHistoryState(location: Location, index: number): HistoryState {
  return {
    usr: location.state,
    key: location.key,
    idx: index,
  };
}
