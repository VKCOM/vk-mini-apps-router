import { ModalPage, ModalPageHeader, Group, CellButton, Div } from '@vkontakte/vkui';
import React from 'react';
import persik_sad from '../img/persik_sad.png';
import { useRouteNavigator, RouteNavigator } from '@vkontakte/vk-mini-apps-router';

export const OnboardingThree = ({ nav }: { nav: string }) => {
  const routeNavigator: RouteNavigator = useRouteNavigator();
  const onClick = async () => {
    routeNavigator.runSync([
      () => routeNavigator.backToFirst(),
      () => routeNavigator.replace('/'),
      () => routeNavigator.push('/'),
      () => routeNavigator.back(),
    ]);
  };
  return (
    <ModalPage header={<ModalPageHeader>Шаг 3</ModalPageHeader>} id={nav}>
      <Div>Завершаем!</Div>
      <Div>Когда персик огорчен, он выглядит так:</Div>
      <img className="Persik" src={persik_sad} alt="Persik The Cat" />
      <Group>
        <CellButton onClick={onClick}>Закончить</CellButton>
      </Group>
    </ModalPage>
  );
}
