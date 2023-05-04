export type WithChildren<Target extends {}, Children extends {}> = Target & {
  [key in keyof Children]: Children[key];
};

export interface HasId<T extends string = string> {
  id: T;
}

export interface HasChildren<T extends {}> {
  get children(): T[];
}

export interface RepresentsRoutes<T> {
  getRoutes(): T[];
}

export type GetId<Obj extends HasId> = Obj extends { id: infer X } ? X : never;

export type AddChild<Target extends {}, V extends HasId> = WithChildren<Target, { [key in GetId<V>]: V }>;

export interface Page {
  path: string;
  hasParams: false;
}

export type WithParams<T extends string> = {
  paramKeys: T[];
};

export interface PageWithParams<T extends string> extends WithParams<T> {
  path: string;
  hasParams: true;
}
