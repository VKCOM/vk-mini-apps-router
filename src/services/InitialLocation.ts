import { Location } from '@remix-run/router';

export class InitialLocation {
  private static _instance: InitialLocation | undefined;
  private _value: Location;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(value: Location) {
    this._value = value;
  }

  static init(value: Location): void {
    if (!InitialLocation._instance) {
      InitialLocation._instance = new InitialLocation(value);
    }
  }

  static get value(): Location | undefined {
    return InitialLocation._instance?._value;
  }
}

export function getInitialLocation(): Location | undefined {
  return InitialLocation.value;
}
