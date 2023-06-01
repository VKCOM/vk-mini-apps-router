import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Alert } from '@vkontakte/vkui';
import React from 'react';

export const EmptyPopout = () => {
  const routeNavigator = useRouteNavigator();
  return (
    <Alert
      actions={[
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        {
          title: 'Да',
          autoClose: true,
          mode: 'destructive',
          action: () => console.log('Кнопка нажата.'),
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => routeNavigator.hidePopout()}
      header="Просто попап"
      text="Точно хотите нажать красную кнопку?"
    />
  );
}
