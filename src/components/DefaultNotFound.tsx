import { ReactElement } from 'react';
import { RouteNavigator } from '../services/routeNavigator.type';

const DivStyles = {
  background: '#3f5d81 url(https://vk.com/images/error404.png) no-repeat 50% 50%',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  margin: '0',
  cursor: 'pointer',
  backgroundSize: 'contain',
};

export type DefaultNotFoundProps = {
  routeNavigator: RouteNavigator;
};

export function DefaultNotFound({ routeNavigator }: DefaultNotFoundProps): ReactElement {
  return (
    <div onClick={() => routeNavigator.replace('/')} className="default-not-found" style={DivStyles}>
    </div>
  );
}