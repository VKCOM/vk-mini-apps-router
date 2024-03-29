import { ModalPage, ModalPageHeader, Group, CellButton, Div } from '@vkontakte/vkui';
import React from 'react';
import persik from '../img/persik.png';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { HOME_PANEL_MODALS } from '../routes';

export const OnboardingOne = ({ nav }: { nav: string }) => {
  const routeNavigator = useRouteNavigator();
  return (
    <ModalPage header={<ModalPageHeader>Шаг 1</ModalPageHeader>} id={nav}>
      <Div>Добро пожаловать в наше замечательное приложение!</Div>
      <Div>Когда персик доволен, он выглядит так:</Div>
      <img height={130} className="Persik" src={persik} alt="Persik The Cat" />
      <Group>
        <CellButton onClick={() => routeNavigator.push(`/${HOME_PANEL_MODALS.ONBOARDING_2}`)}>Далее</CellButton>
      </Group>
    </ModalPage>
  );
}
