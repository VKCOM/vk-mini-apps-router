import { useCallback, useRef } from 'react';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Alert } from '@vkontakte/vkui';

export function OffencePersikPopout() {
  const routeNavigator = useRouteNavigator();
  const closeWithAction = useRef(false);

  const handleTakeFood = useCallback(() => {
    closeWithAction.current = true;

    routeNavigator.runSync([
      () => routeNavigator.hidePopout(),
      () => routeNavigator.replace('/persik/sad/persik_modal/sad', { keepSearchParams: true }), 
    ]);
  }, [routeNavigator]);

  const handleClose = useCallback(() => {
    if (!closeWithAction.current) {
      routeNavigator.hidePopout();
    }

    closeWithAction.current = false;
  }, [closeWithAction, routeNavigator]);

  return (
    <Alert
      actions={[
        {
          title: 'Отмена',
          mode: 'cancel',
        },
        {
          title: 'Забрать',
          mode: 'destructive',
          action: handleTakeFood,
        },
      ]}
      actionsLayout="horizontal"
      onClose={handleClose}
      title="Еда персика"
      description="Вы уверены, что хотите забрать у персика еду?"
    />
  );
}
