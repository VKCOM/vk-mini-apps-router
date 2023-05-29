import React from 'react';

import { ModalPage, ModalPageHeader, Group, CellButton, Alert } from '@vkontakte/vkui';

import persik from '../img/persik.png';
import persik_fish from '../img/persik_fish.png';
import persik_sad from '../img/persik_sad.png';
import './PersikModal.css';
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-app-router';
import { NavProp } from '../types';
import { PERSIK_PANEL_MODALS } from '../routes';

const IMAGES = { persik, persik_fish, persik_sad };

export const PersikModal = (props: NavProp) => {
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
          title: 'Забрать',
          autoClose: true,
          mode: 'destructive',
          action: () => setTimeout(() => routeNavigator.replace('/persik/sad/persik_modal', { keepSearchParams: true }), 100),
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => routeNavigator.hidePopout()}
      header="Еда персика"
      text="Вы уверены, что хотите забрать у персика еду?"
    />;

  const { em: emotion } = useParams({ modal: PERSIK_PANEL_MODALS.PERSIK }) ?? {};
  const image: string = IMAGES[`persik${emotion ? '_' : ''}${emotion ?? ''}` as keyof typeof IMAGES];
  return (
      <ModalPage
        id={props.nav}
        header={<ModalPageHeader>Персик в модалке</ModalPageHeader>}
      >
        <Group>
          <CellButton onClick={() => routeNavigator.push(`/persik${emotion ? '/' + emotion : ''}/user_modal`, { keepSearchParams: true })}>Информация о пользователе</CellButton>
          <CellButton onClick={() => routeNavigator.showPopout(popup)}>Открыть попаут из модалки</CellButton>
        </Group>
        <img className="Persik" src={image} alt="Persik The Cat" />
      </ModalPage>
  );
};
