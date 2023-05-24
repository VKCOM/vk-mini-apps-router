import React from 'react';

import { Panel, PanelHeader, Header, Button, Group, Div } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import { GoFunctionProp, NavProp } from '../types';
import { useEnableSwipeBack } from '@vkontakte/vk-mini-app-router';

export const Alternative = ({ nav, go }: NavProp & GoFunctionProp) => {
  useEnableSwipeBack();
  function sendToClient() {
    bridge.send('VKWebAppSendToClient', { fragment: '/persik' })
      .then((data) => console.log('VKWebAppSendToClient', data));
  }

  return (
    <Panel nav={nav}>
      <PanelHeader>Другой Root, другая View</PanelHeader>

      <Group header={<Header mode="secondary">Пример навигации</Header>}>
        <Div>
          <Group>
            <Button stretched size="l" mode="secondary" onClick={() => go('/')}>
              На главную
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => sendToClient()}>
              VKWebAppSendToClient с fragment: '/persik'
            </Button>
          </Group>
        </Div>
      </Group>
    </Panel>
  );
};
