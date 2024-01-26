// @ts-expect-error
import { Link } from '@vkontakte/vkui';
import { useHref } from '../hooks/useHref';
import { RelativeRoutingType, To } from '@remix-run/router';
import {
  AnchorHTMLAttributes,
  CSSProperties,
  forwardRef,
  ReactNode,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useLinkClickHandler } from '../hooks/useLinkClickHandler';

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  reloadDocument?: boolean;
  replace?: boolean;
  relative?: RelativeRoutingType;
  to: To;
}

export interface RouterLinkProps
  extends Omit<LinkProps, 'className' | 'style' | 'children'> {
  children?:
  | ReactNode
  | ((props: { isActive: boolean; isPending: boolean }) => ReactNode);
  caseSensitive?: boolean;
  className?:
  | string
  | ((props: {
    isActive: boolean;
    isPending: boolean;
  }) => string | undefined);
  end?: boolean;
  style?:
  | CSSProperties
  | ((props: {
    isActive: boolean;
    isPending: boolean;
  }) => CSSProperties | undefined);
}

const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

const isBrowser =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function(
    {
      to,
      relative,
      replace,
      target,
      reloadDocument,
      onClick,
      ...rest
    }: RouterLinkProps,
    ref,
  ) {
    // Rendered into <a href> for absolute URLs
    let absoluteHref;
    let isExternal = false;

    if (typeof to === 'string' && ABSOLUTE_URL_REGEX.test(to)) {
      // Render the absolute href server- and client-side
      absoluteHref = to;

      // Only check for external origins client-side
      if (isBrowser) {
        const currentUrl = new URL(window.location.href);
        const targetUrl = to.startsWith('//')
          ? new URL(currentUrl.protocol + to)
          : new URL(to);
        const path = targetUrl.pathname;

        if (targetUrl.origin === currentUrl.origin) {
          // Strip the protocol/origin/basename for same-origin absolute URLs
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      }
    }
    
    const href = useHref(to, { relative });

    const internalOnClick = useLinkClickHandler(to, {
      replace,
      target,
      relative,
    });

    function handleClick(
      event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>
    ) {
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
        ref={ref}
        target={target}
      ></Link>
    );
  }
);
