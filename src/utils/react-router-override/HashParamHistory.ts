import { createPath, History, Location, parsePath, To } from '@remix-run/router';
import { createLocation } from './createLocation';
import { UrlHistoryOptions } from './UrlHistoryOptions.type';
import { getUrlBasedHistory } from './getUrlBasedHistory';
import { warning } from '../utils';
import { DEFAULT_PATH_PARAM_NAME } from '../../const';

export type HashParamHistoryOptions = UrlHistoryOptions & {
  paramName?: string;
};

/**
 * Специальная история для интеграции с платформой Mini Apps ВКонтакте.
 * Позволяет передавать в хэше путь вместе с параметрами запуска.
 */
export function createHashParamHistory(options: HashParamHistoryOptions = {}): History {
  const paramName = options.paramName || DEFAULT_PATH_PARAM_NAME;

  function createHashParamLocation(window: Window, globalHistory: Window['history']) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const pathFromHash = hashParams.get(paramName) || '';
    const { pathname = '/', search = '', hash = '' } = parsePath(pathFromHash);
    return createLocation(
      '',
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      (globalHistory.state && globalHistory.state.usr) || null,
      (globalHistory.state && globalHistory.state.key) || 'default',
    );
  }

  function createHashParamHref(window: Window, to: To) {
    const currentHashParams = new URLSearchParams(window.location.hash.substring(1));
    const base = window.document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      const url = window.location.href;
      const hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    currentHashParams.set(paramName, typeof to === 'string' ? to : createPath(to));
    return href + '#' + currentHashParams.toString();
  }

  function validateHashParamLocation(location: Readonly<Location>, to: To) {
    warning(
      location.pathname.startsWith('/'),
      `relative pathnames are not supported in hash param history.push(${JSON.stringify(to)})`,
    );
  }

  return getUrlBasedHistory(
    createHashParamLocation,
    createHashParamHref,
    validateHashParamLocation,
    options,
  );
}
