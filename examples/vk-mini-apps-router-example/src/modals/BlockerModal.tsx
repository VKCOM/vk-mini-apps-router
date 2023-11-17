import { useEffect, useRef } from 'react';

import {
  Button,
  FormItem,
  FormLayout,
  Group,
  Input,
  ModalPage,
  ModalPageHeader,
} from '@vkontakte/vkui';

import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { NavProp } from '../types';

const PASSWORD = '1234';

export const BlockerModal = (props: NavProp) => {
  const unblock = useRef<() => void>();
  const passInput = useRef<HTMLInputElement>(null);
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    unblock.current = routeNavigator.block(() => true);
  }, [routeNavigator]);

  const onHandleSubmit = () => {
    const unblockFn = unblock.current;
    const inputElement = passInput.current;

    if (inputElement && unblockFn && inputElement.value === PASSWORD) {
      unblockFn();
      routeNavigator.back();
    }
  };

  return (
    <ModalPage id={props.nav} header={<ModalPageHeader>Разблокируйте навигацию!</ModalPageHeader>}>
      <Group>
        <FormLayout>
          <FormItem top={`Код разблокировки ${PASSWORD}`}>
            <Input getRef={passInput} id="pass" type="password" placeholder={PASSWORD} />
          </FormItem>

          <FormItem>
            <Button type="submit" onClick={onHandleSubmit} size="l" stretched>
              Применить код
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
    </ModalPage>
  );
};
