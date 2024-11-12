export interface ViewNavigationRecord {
  position: number;
  locationKey: string;
  path: string;
  state: Record<string, unknown> | null;
  view: string;
  panel: string;
  root?: string;
  tab?: string;
  modal?: string;
  popout?: string;
}
