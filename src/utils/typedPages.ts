import { Params } from '@remix-run/router';

export interface Page<T extends string | undefined> {
  buildPath(params: T): string;
  get paramKeys(): T;
}

type WithParams<T extends string| undefined> = {
  paramKeys?: T[] | undefined;
};

type PanelPageOptions<T extends string | undefined> = WithParams<T>;
type ViewPageOptions<T extends string | undefined> = WithParams<T>;

export class PanelPage<T extends string | undefined> implements Page<T> {
  private internalParamKeys: T[] | undefined;

  private constructor(id: string, options?: PanelPageOptions<T>) {
    this.internalParamKeys = options?.paramKeys;
  }
  buildPath(): string {}

  get paramKeys(): T {
    return this.internalParamKeys as T;
  }

  static createInView<T extends string | undefined>(view: ViewPage<any>, id: string, options?: PanelPageOptions<T>) {
    return new PanelPage(id, options);
  }
}

export class ViewPage<T extends string | undefined> implements Page<T> {
  private internalParamKeys: T[] | undefined;

  constructor(id: string, options?: ViewPageOptions<T>) {
    this.internalParamKeys = options?.paramKeys;
  }
  buildPath(): string {}

  get paramKeys(): T {
    return this.internalParamKeys as T;
  }

  addPanel<K extends string | undefined>(path: string, id: string, options?: PanelPageOptions<K>): PanelPage<'' extends T ? K : K | T> {
    return PanelPage.createInView(this, id, options);
  }
}

const VIEW_1 = new ViewPage('VIEW_1');
const VIEW_2 = new ViewPage('VIEW_2', { paramKeys: ['param2'] });

const PANEL_1 = VIEW_1.addPanel('', 'PANEL_1');
const PANEL_2 = VIEW_1.addPanel('p2', 'PANEL_2');
const PANEL_3 = VIEW_1.addPanel('p3', 'PANEL_3', { paramKeys: ['param1'] });
const PANEL_4 = VIEW_2.addPanel('p3', 'PANEL_3', { paramKeys: ['param3'] });

const routes = {
  '/': VIEW_1,
  '/view2': VIEW_2,
};

// function navigate(page: string): void
function navigate<T extends undefined>(page: Page<T>): void
function navigate<T extends string>(page: Page<T>, params: Required<Params<T>>): void
// function navigate<P extends Page<undefined>>(page: P extends Page<infer X> ? X extends string ? Page<X> : never : never): void
// function navigate<P extends Page<string>>(page: P, params: P extends Page<infer X> ? X extends string ? Required<Params<X>> : never : never): void
// function navigate<T extends string>(page: Page<T>, params: Params<T>): void
// function navigate<T extends string | undefined, P extends Page<T>>(
//   page: P | string,
//   params?: T extends string ? Params<T> : undefined,
// ): void {}
function navigate(
  page: any,
  params?: any,
): void {}

function getUrl<T extends Params | undefined = undefined>(): string {}

navigate(PANEL_1);
navigate(PANEL_3, { param1: '' });
navigate(PANEL_4, { param2: '', param3: '' });
// =============
navigate(PANEL_1, {  });
navigate(PANEL_3, {  });
navigate(PANEL_3);
navigate(PANEL_4);


