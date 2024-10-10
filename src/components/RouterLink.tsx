import { Link } from '@vkontakte/vkui';
import { useHref } from '../hooks/useHref';
import { RelativeRoutingType } from '@remix-run/router';
import {
  AnchorHTMLAttributes,
  CSSProperties,
  forwardRef,
  ReactNode,
  MouseEvent as ReactMouseEvent,
  Ref,
} from 'react';
import { useLinkClickHandler } from '../hooks/useLinkClickHandler';
import { InjectParamsIfNeeded } from '../page-types/common';
import { NavigationTarget } from '../services';
import { isString } from '../utils';

export interface LinkProps<T extends NavigationTarget>
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: T;
  reloadDocument?: boolean;
  replace?: boolean;
  relative?: RelativeRoutingType;
}

export interface RouterLinkProps<T extends NavigationTarget>
  extends Omit<LinkProps<T>, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  caseSensitive?: boolean;
  className?: string;
  end?: boolean;
  style?: CSSProperties;
}

const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

const isBrowser =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const RouterLinkInner = <T extends NavigationTarget>(
  {
    to,
    relative,
    replace,
    target,
    reloadDocument,
    params,
    onClick,
    ...rest
  }: InjectParamsIfNeeded<T, RouterLinkProps<T>>,
  ref: Ref<HTMLAnchorElement>,
) => {
  // Rendered into <a href> for absolute URLs
  let absoluteHref;
  let isExternal = false;
  let navigationTarget: NavigationTarget = to;

  if (isString(to) && ABSOLUTE_URL_REGEX.test(to)) {
    // Render the absolute href server- and client-side
    absoluteHref = to;

    // Only check for external origins client-side
    if (isBrowser) {
      const currentUrl = new URL(window.location.href);
      const targetUrl = to.startsWith('//') ? new URL(currentUrl.protocol + to) : new URL(to);
      const path = targetUrl.pathname;

      if (targetUrl.origin === currentUrl.origin) {
        // Strip the protocol/origin/basename for same-origin absolute URLs
        navigationTarget = path + targetUrl.search + targetUrl.hash;
      } else {
        isExternal = true;
      }
    }
  }

  const href = useHref(navigationTarget, { relative, params: params });

  const internalOnClick = useLinkClickHandler(navigationTarget, {
    replace,
    target,
    relative,
    params,
  });

  function handleClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }

  return (
    <Link
      {...rest}
      href={absoluteHref || href}
      onClick={isExternal || reloadDocument ? onClick : handleClick}
      getRootRef={ref}
      target={target}
    ></Link>
  );
};

export const RouterLink = forwardRef(RouterLinkInner) as <T extends NavigationTarget>(
  props: InjectParamsIfNeeded<T, RouterLinkProps<T>> & { ref?: Ref<HTMLAnchorElement> },
) => JSX.Element;
