import React, { useCallback } from 'react';

import { Panel, PanelHeader, Button, ButtonGroup, Header } from '@vkontakte/vkui';
import { NavProp } from '../types';
import {
  useRouteNavigator,
  useEnableSwipeBack,
  useBlocker,
  useActiveVkuiLocation,
  BlockerFunction,
} from '@vkontakte/vk-mini-apps-router';
import { DEFAULT_VIEW_PANELS } from '../routes';

export const Blocker = ({ nav }: NavProp) => {
  useEnableSwipeBack();
  const { panel } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const blockerFn = useCallback<BlockerFunction>(({ historyAction }) => {
    return historyAction !== "PUSH";
  }, []);

  const blocker = useBlocker(blockerFn);
  const showConfirmButtons = panel !== DEFAULT_VIEW_PANELS.BLOCKER || blocker.state === 'blocked';

  const goToHomePanel = () => {
    routeNavigator.replace('/');
  };

  const onConfirmExit = () => {
    if (blocker.proceed) blocker.proceed();
  };

  const onCancelExit = () => {
    if (blocker.reset) blocker.reset();
  };

  return (
    <Panel nav={nav}>
      <PanelHeader>Панель с подтверждением выхода</PanelHeader>
      {showConfirmButtons && (
        <>
          <Header>Вы уверены что хотите выйти</Header>
          <ButtonGroup stretched mode="horizontal">
            <Button stretched size="l" mode="primary" onClick={onConfirmExit}>
              Да
            </Button>
            <Button stretched size="l" mode="primary" onClick={onCancelExit}>
              Нет
            </Button>
          </ButtonGroup>
        </>
      )}

      {!showConfirmButtons && (
        <>
          <ButtonGroup stretched mode="horizontal">
            <Button stretched size="l" mode="primary" onClick={goToHomePanel}>
              Перейти на главную панель
            </Button>
          </ButtonGroup>
        </>
      )}
    </Panel>
  );
};
