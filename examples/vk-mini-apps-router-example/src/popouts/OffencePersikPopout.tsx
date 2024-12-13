import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Alert } from '@vkontakte/vkui';

export function OffencePersikPopout() {
  const routeNavigator = useRouteNavigator();
  return <Alert
    actions={[
      {
        title: 'Отмена',
        mode: 'cancel',
      },
      {
        title: 'Забрать',
        mode: 'destructive',
        action: () => setTimeout(() => routeNavigator.replace('/persik/sad/persik_modal/sad', { keepSearchParams: true }), 100),
      },
    ]}
    actionsLayout="horizontal"
    onClose={() => routeNavigator.hidePopout()}
    title="Еда персика"
    description="Вы уверены, что хотите забрать у персика еду?"
  />;
}
