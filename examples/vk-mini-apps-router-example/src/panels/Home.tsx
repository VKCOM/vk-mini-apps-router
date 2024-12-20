import React from 'react';

import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  ButtonGroup,
  Avatar,
} from '@vkontakte/vkui';
import { GoFunctionProp, GoToFirstPageProp, NavProp, UserInfo } from '../types';
import { useEnableSwipeBack } from '@vkontakte/vk-mini-apps-router';
import { AppMap } from '../appMap/AppMap';

type HomeProps = NavProp &
  GoFunctionProp & {
    fetchedUser: UserInfo;
  } & GoToFirstPageProp;

export const Home = ({ nav, go, goToFirstPage, fetchedUser }: HomeProps) => {
  useEnableSwipeBack();

  return (
    <Panel nav={nav}>
      <PanelHeader>Главная</PanelHeader>
      {fetchedUser && (
        <Group
          header={<Header>Данные пользователя, полученные через VK Bridge</Header>}
        >
          <Cell
            before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
            subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
          >
            {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
          </Cell>
        </Group>
      )}

      <Group>
        <ButtonGroup stretched mode="vertical">
          <ButtonGroup mode="horizontal" stretched>
            <Button
              stretched
              size="l"
              mode="secondary"
              onClick={() => go('/persik?additional=tra-ta-ta')}
            >
              Покажите Персика, пожалуйста
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => go('/persik/fish')}>
              А Персик не голоден?
            </Button>
          </ButtonGroup>

          <ButtonGroup mode="horizontal" stretched>
            <Button stretched size="l" mode="secondary" onClick={() => go('/onboarding_1')}>
              Обучение
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => go('/blocker_modal')}>
              Блокировка навигации
            </Button>
          </ButtonGroup>

          <ButtonGroup mode="horizontal" stretched>
            <Button stretched size="l" mode="secondary" onClick={() => go('/empty')}>
              На пустую страницу!
            </Button>
            <Button stretched size="l" mode="secondary" onClick={() => go('/alternative')}>
              На другой Root
            </Button>
          </ButtonGroup>

          <ButtonGroup mode="horizontal" stretched>
            <Button stretched size="l" mode="secondary" onClick={() => go('/blocker')}>
              Страница выхода с подтверждением
            </Button>
            <Button stretched size="l" mode="secondary" onClick={goToFirstPage}>
              На самую первую страницу
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </Group>
      <AppMap></AppMap>
    </Panel>
  );
};
