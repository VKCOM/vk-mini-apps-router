import { ReactElement } from 'react';
import { RouteNavigator } from '../contexts';

const DivStyles = {
  background: '#3f5d81 url(https://vk.com/images/error404.png) no-repeat 50% 50%',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  margin: '0',
  cursor: 'pointer',
};

export type DefaultNotFoundProps = {
  navigator: RouteNavigator;
};

export function DefaultNotFound({ navigator }: DefaultNotFoundProps): ReactElement {
  return (
    <div onClick={() => navigator.replace('/')} className="default-not-found" style={DivStyles}>
    </div>
  );
}