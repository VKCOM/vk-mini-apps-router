export type NavProp = {
  nav: string,
};

export type GoFunctionProp = {
  go: (path: string) => void,
};

export type UserInfo = {
  photo_200?: string,
  first_name?: string,
  last_name?: string,
  city?: {
    title?: string,
  },
};
