import React from 'react';
import { ModalPage, ModalPageHeader, Group, Header, Cell, Avatar } from '@vkontakte/vkui';
import { NavProp, UserInfo } from '../types';

type UserModalProps = NavProp & {
  fetchedUser: UserInfo;
};

export const UserModal = ({ fetchedUser, nav }: UserModalProps) => {
  return (
    <ModalPage
      id={nav}
      header={<ModalPageHeader>Информация о пользователе</ModalPageHeader>}
    >
      {fetchedUser &&
        <Group header={<Header mode="secondary">Информация о пользователе, полученная через VK Bridge</Header>}>
          <Cell
            before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
            subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
          >
            {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
          </Cell>
        </Group>}
    </ModalPage>
  );
};
