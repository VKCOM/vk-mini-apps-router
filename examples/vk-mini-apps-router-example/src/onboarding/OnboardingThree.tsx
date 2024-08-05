import { ModalPage, ModalPageHeader, Group, CellButton, Div } from '@vkontakte/vkui';
import React from 'react';
import persik_sad from '../img/persik_sad.png';
import { useRouteNavigator, RouteNavigator } from '@vkontakte/vk-mini-apps-router';

export const OnboardingThree = ({ nav }: { nav: string }) => {
  const routeNavigator: RouteNavigator = useRouteNavigator();
  const onClick = async () => {
    routeNavigator.runSync([
      () => routeNavigator.backToFirst(),
      () => routeNavigator.push('/persik'),
      () => routeNavigator.push('/persik/persik_modal'),
    ]);
  };
  return (
    <ModalPage header={<ModalPageHeader>Шаг 3</ModalPageHeader>} id={nav}>
      <Div>Завершаем!</Div>
      <Div>Когда персик огорчен, он выглядит так:</Div>
      <img height={130} className="Persik" src={persik_sad} alt="Persik The Cat" />
      <Group>
        <Div>1) Возвращаемся в начало навигации</Div>
        <Div>2) /persik</Div>
        <Div>3) /persik/persik_modal</Div>
        <CellButton onClick={onClick}>Выполнить runSync</CellButton>
      </Group>
    </ModalPage>
  );
}
