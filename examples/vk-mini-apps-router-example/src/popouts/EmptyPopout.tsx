import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Alert } from '@vkontakte/vkui';

export const EmptyPopout = () => {
  const routeNavigator = useRouteNavigator();
  return (
    <Alert
      actions={[
        {
          title: 'Отмена',
          mode: 'cancel',
        },
        {
          title: 'Да',
          mode: 'destructive',
          action: () => console.log('Кнопка нажата.'),
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => routeNavigator.hidePopout()}
      title="Просто попап"
      description="Точно хотите нажать красную кнопку?"
    />
  );
}
