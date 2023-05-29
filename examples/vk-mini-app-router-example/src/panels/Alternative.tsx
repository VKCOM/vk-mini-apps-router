import React from 'react';

import { Panel, PanelHeader, Header, Button, Group, Div, Tabs, TabsItem } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import { GoFunctionProp, NavProp } from '../types';
import { useEnableSwipeBack, useActiveVkuiLocation } from '@vkontakte/vk-mini-app-router';
import { ALTERNATIVE_PANEL_TABS, HOME_PANEL_MODALS, PERSIK_PANEL_MODALS } from '../routes';

export const Alternative = ({ nav, go }: NavProp & GoFunctionProp) => {
  useEnableSwipeBack();
  const { tab } = useActiveVkuiLocation();
  const activeTab = tab || ALTERNATIVE_PANEL_TABS.TAB_1;
  function sendToClient() {
    bridge.send('VKWebAppSendToClient', { fragment: '/persik' })
      .then((data) => console.log('VKWebAppSendToClient', data));
  }

  return (
    <Panel nav={nav}>
      <PanelHeader>
        <Tabs>
          <TabsItem
            selected={activeTab === ALTERNATIVE_PANEL_TABS.TAB_1}
            onClick={() => go('/alternative/tab1')}
          >{ALTERNATIVE_PANEL_TABS.TAB_1}</TabsItem>
          <TabsItem
            selected={activeTab === ALTERNATIVE_PANEL_TABS.TAB_2}
            onClick={() => go('/alternative/tab2')}
          >{ALTERNATIVE_PANEL_TABS.TAB_2}</TabsItem>
          <TabsItem
            selected={activeTab === ALTERNATIVE_PANEL_TABS.TAB_3}
            onClick={() => go('/alternative/tab3')}
          >{ALTERNATIVE_PANEL_TABS.TAB_3}</TabsItem>
        </Tabs>
      </PanelHeader>

      {activeTab === ALTERNATIVE_PANEL_TABS.TAB_1 &&
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
      }

      {activeTab === ALTERNATIVE_PANEL_TABS.TAB_2 &&
        <Div>Контент второго таба</Div>
      }

      {activeTab === ALTERNATIVE_PANEL_TABS.TAB_3 &&
        <Group header={<Header mode="secondary">Пример навигации</Header>}>
          <Div>
            <Group>
              <Button stretched size="l" mode="secondary" onClick={() => go(`/alternative/tab3/${PERSIK_PANEL_MODALS.PERSIK}`)}>
                Модалка с персиком
              </Button>
              <Button stretched size="l" mode="secondary" onClick={() => go(`/alternative/tab3/${HOME_PANEL_MODALS.USER}`)}>
                Модалка с юзером
              </Button>
            </Group>
          </Div>
        </Group>
      }
    </Panel>
  );
};
