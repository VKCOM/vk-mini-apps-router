import { Params } from '@remix-run/router';

export interface ViewNavigationRecord {
  position: number;
  locationKey: string;
  path: string;
  params: Params;
  state: Record<string, unknown> | null;
  view: string;
  panel: string;
  root?: string;
  tab?: string;
  modal?: string;
  popout?: string;
}
