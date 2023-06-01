import React from 'react';

import { Panel, PanelHeader, Header, Button, Group, ButtonGroup } from '@vkontakte/vkui';
import { NavProp } from '../types';
import { PERSIK_PANEL_MODALS } from '../routes';
import { useRouteNavigator, useEnableSwipeBack } from '@vkontakte/vk-mini-apps-router';
import { AppMap } from '../appMap/AppMap';
import { EmptyPopout } from '../popouts/EmptyPopout';

export const Empty = ({ nav }: NavProp) => {
  useEnableSwipeBack();
  const routeNavigator = useRouteNavigator();

  const popout = EmptyPopout();
  return (
    <Panel nav={nav}>
      <PanelHeader>Пустая страница</PanelHeader>

      <Group header={<Header mode="secondary">Пример навигации</Header>}>
        <ButtonGroup stretched mode="vertical">
          <ButtonGroup stretched mode="horizontal">
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('/tra-ta-ta')}>
              Пойди туда, не знаю куда (404)
            </Button>
            <Button stretched size="l" mode="primary" onClick={() => routeNavigator.push('/')}>
              На главную
            </Button>
          </ButtonGroup>
          <ButtonGroup stretched mode="horizontal">
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.showModal(PERSIK_PANEL_MODALS.PERSIK)}>
              Открыть модалку без изменения пути
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.showPopout(popout)}>
              Открыть попап без изменения пути
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </Group>
      <AppMap></AppMap>
    </Panel>
  );
};
