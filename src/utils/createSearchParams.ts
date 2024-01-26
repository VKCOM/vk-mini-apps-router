export type ParamKeyValuePair = [string, string];

export type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams;

function convertObjectToURLInit(init: Record<string, string | string[]>) {
  return Object.keys(init).reduce<ParamKeyValuePair[]>((memo, key) => {
    const value = init[key];
    return memo.concat(
      Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]],
    );
  }, []);
}

/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
export function createSearchParams(
  init: URLSearchParamsInit = ''
): URLSearchParams {
  const inputIsReadyForInstantiation = typeof init === 'string' ||
    Array.isArray(init) ||
    init instanceof URLSearchParams;
  return new URLSearchParams(inputIsReadyForInstantiation ? init : convertObjectToURLInit(init));
}

export function getSearchParamsForLocation(
  locationSearch: string,
  defaultSearchParams: URLSearchParams | null
) {
  const searchParams = createSearchParams(locationSearch);

  if (defaultSearchParams) {
    for (let key of defaultSearchParams.keys()) {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    }
  }

  return searchParams;
}
