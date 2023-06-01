import { ModalPage, ModalPageHeader, Group, CellButton, Div } from '@vkontakte/vkui';
import React from 'react';
import persik_fish from '../img/persik_fish.png';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { HOME_PANEL_MODALS } from '../routes';

export const OnboardingTwo = ({ nav }: { nav: string }) => {
  const routeNavigator = useRouteNavigator();
  return (
    <ModalPage header={<ModalPageHeader>Шаг 2</ModalPageHeader>} id={nav}>
      <Div>Продолжим!</Div>
      <Div>Когда персик голоден, он выглядит так:</Div>
      <img className="Persik" src={persik_fish} alt="Persik The Cat" />
      <Group>
        <CellButton onClick={() => routeNavigator.push(`/${HOME_PANEL_MODALS.ONBOARDING_3}`)}>Далее</CellButton>
      </Group>
    </ModalPage>
  );
}
