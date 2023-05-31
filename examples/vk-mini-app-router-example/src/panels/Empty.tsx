import React from 'react';

import { Panel, PanelHeader, Header, Button, Group, ButtonGroup, Alert } from '@vkontakte/vkui';
import { NavProp } from '../types';
import { PERSIK_PANEL_MODALS } from '../routes';
import { useRouteNavigator, useEnableSwipeBack } from '@vkontakte/vk-mini-app-router';
import { AppMap } from '../appMap/AppMap';

export const Empty = ({ nav }: NavProp) => {
  useEnableSwipeBack();
  const routeNavigator = useRouteNavigator();
  const popup =
    <Alert
      actions={[
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        {
          title: 'Да',
          autoClose: true,
          mode: 'destructive',
          action: () => console.log('Кнопка нажата.'),
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => routeNavigator.hidePopout()}
      header="Просто попап"
      text="Точно хотите нажать красную кнопку?"
    />;

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
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.showPopout(popup)}>
              Открыть попап без изменения пути
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </Group>
      <AppMap></AppMap>
    </Panel>
  );
};
