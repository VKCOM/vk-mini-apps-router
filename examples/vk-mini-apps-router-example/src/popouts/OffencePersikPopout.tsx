import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Alert } from '@vkontakte/vkui';
import React from 'react';

export function OffencePersikPopout() {
  const routeNavigator = useRouteNavigator();
  return <Alert
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
        action: () => setTimeout(() => routeNavigator.replace('/persik/sad/persik_modal/sad', { keepSearchParams: true }), 100),
      },
    ]}
    actionsLayout="horizontal"
    onClose={() => routeNavigator.hidePopout()}
    header="Еда персика"
    text="Вы уверены, что хотите забрать у персика еду?"
  />;
}
