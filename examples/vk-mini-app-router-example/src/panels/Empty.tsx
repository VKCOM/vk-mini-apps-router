import React from 'react';

import { Panel, PanelHeader, Header, Button, Group, Div, Alert } from '@vkontakte/vkui';
import { NavProp } from '../types';
import { PERSIK_PANEL_MODALS, routes } from '../routes';
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router';

export const Empty = ({ nav }: NavProp) => {
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

  const defaultView = routes.default_root.default_view;
  return (
    <Panel nav={nav}>
      <PanelHeader>Пустая страница</PanelHeader>

      <Group header={<Header mode="secondary">Пример навигации</Header>}>
        <Div>
          <Group>
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push(defaultView.persik)}>
              Покажите Персика, пожалуйста
            </Button>
            <Button
              stretched
              size="l"
              mode="secondary"
              onClick={() => routeNavigator.push(defaultView.persik_0, { emotion: 'fish' })}
            >
              А Персик не голоден?
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('/tra-ta-ta')}>
              Пойди туда, не знаю куда (404)
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.showModal(PERSIK_PANEL_MODALS.PERSIK)}>
              Открыть модалку без изменения пути
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.showPopout(popup)}>
              Открыть попап без изменения пути
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('/')}>
              На главную
            </Button>
          </Group>
        </Div>
      </Group>
    </Panel>
  );
};
