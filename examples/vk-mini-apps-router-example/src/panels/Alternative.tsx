import React from 'react';

import { Panel, PanelHeader, Header, Button, ButtonGroup, Group, Tabs, TabsItem } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import { GoFunctionProp, NavProp } from '../types';
import { useEnableSwipeBack, useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';
import { ALTERNATIVE_PANEL_TABS, HOME_PANEL_MODALS, PERSIK_PANEL_MODALS } from '../routes';
import { AppMap } from '../appMap/AppMap';

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
            id={ALTERNATIVE_PANEL_TABS.TAB_1}
            aria-controls={`${ALTERNATIVE_PANEL_TABS.TAB_1}_content`}
          >{ALTERNATIVE_PANEL_TABS.TAB_1}</TabsItem>
          <TabsItem
            selected={activeTab === ALTERNATIVE_PANEL_TABS.TAB_2}
            onClick={() => go('/alternative/tab2')}
            id={ALTERNATIVE_PANEL_TABS.TAB_2}
            aria-controls={`${ALTERNATIVE_PANEL_TABS.TAB_2}_content`}
          >{ALTERNATIVE_PANEL_TABS.TAB_2}</TabsItem>
          <TabsItem
            selected={activeTab === ALTERNATIVE_PANEL_TABS.TAB_3}
            onClick={() => go('/alternative/tab3')}
            id={ALTERNATIVE_PANEL_TABS.TAB_3}
            aria-controls={`${ALTERNATIVE_PANEL_TABS.TAB_3}_content`}
          >{ALTERNATIVE_PANEL_TABS.TAB_3}</TabsItem>
        </Tabs>
      </PanelHeader>

      {activeTab === ALTERNATIVE_PANEL_TABS.TAB_1 &&
        <Group
          header={<Header mode="secondary">Другой Root с Tabs</Header>}
          id={`${ALTERNATIVE_PANEL_TABS.TAB_1}_content`}
          aria-labelledby={ALTERNATIVE_PANEL_TABS.TAB_1}
          tabIndex={0}
        >
          <ButtonGroup stretched mode="horizontal">
            <Button stretched size="l" mode="secondary" onClick={() => sendToClient()}>
              VKWebAppSendToClient с fragment: '/persik'
            </Button>
            <Button stretched size="l" mode="primary" onClick={() => go('/')}>
              На главную
            </Button>
          </ButtonGroup>
        </Group>
      }

      {activeTab === ALTERNATIVE_PANEL_TABS.TAB_2 &&
        <Group
          header={<Header mode="secondary">Тут ничего</Header>}
          id={`${ALTERNATIVE_PANEL_TABS.TAB_2}_content`}
          aria-labelledby={ALTERNATIVE_PANEL_TABS.TAB_2}
          tabIndex={0}
        >
          <Button stretched size="l" mode="primary" onClick={() => go('/')}>
            На главную
          </Button>
        </Group>
      }

      {activeTab === ALTERNATIVE_PANEL_TABS.TAB_3 &&
        <Group
          header={<Header mode="secondary">Модальные окна над табом</Header>}
          id={`${ALTERNATIVE_PANEL_TABS.TAB_3}_content`}
          aria-labelledby={ALTERNATIVE_PANEL_TABS.TAB_3}
          tabIndex={0}
        >
          <ButtonGroup stretched mode="horizontal">
            <Button stretched size="l" mode="secondary" onClick={() => go(`/alternative/tab3/${PERSIK_PANEL_MODALS.PERSIK}`)}>
              Модалка с персиком
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => go(`/alternative/tab3/${HOME_PANEL_MODALS.USER}`)}>
              Модалка с юзером
            </Button>
          </ButtonGroup>
        </Group>
      }
      <AppMap></AppMap>
    </Panel>
  );
};
