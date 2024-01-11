import { useCallback, useEffect, useRef } from 'react';

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
import { BlockerFunction } from '@remix-run/router';

const PASSWORD = '1234';

export const BlockerModal = (props: NavProp) => {
  const routeNavigator = useRouteNavigator();
  const unblock = useRef<() => void>();
  const passInput = useRef<HTMLInputElement>(null);

  const blockerFn = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation, historyAction }) => {
      console.log('Current location', currentLocation);
      console.log('Next location', nextLocation);
      console.log('historyAction', historyAction);

      return true;
    },
    [],
  );

  useEffect(() => {
    unblock.current = routeNavigator.block(blockerFn);
  }, [routeNavigator, blockerFn]);

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
