import React from 'react';

import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, SimpleCell, Switch } from '@vkontakte/vkui';
import { GoFunctionProp, NavProp, UserInfo } from '../types';
import { useEnableSwipeBack } from '@vkontakte/vk-mini-app-router';

type HomeProps = NavProp & GoFunctionProp & {
	fetchedUser: UserInfo,
};

export const Home = ({ nav, go, fetchedUser }: HomeProps) => {
	useEnableSwipeBack();
	const [top, setTop] = React.useState(false);
	const [overlay, setOverlay] = React.useState(false);
	const [close, setClose] = React.useState(true);

	const showAd = () => bridge.send('VKWebAppShowBannerAd' as any, {
		can_close: close,
		banner_location: top ? 'top' : 'bottom',
		layout_type: overlay ? 'overlay' : 'resize',
	}).then((data) => {
		console.log(data);
	});
	return (
		<Panel nav={nav}>
			<PanelHeader>Главная</PanelHeader>
			{fetchedUser &&
				<Group header={<Header mode="secondary">Данные пользователя, полученные через VK Bridge</Header>}>
					<Cell
						before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
						subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
					>
						{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
					</Cell>
				</Group>}

			<Group header={<Header mode="secondary">Пример навигации</Header>}>
				<Div>
					<Group>
						<Button stretched size="l" mode="secondary" onClick={() => go('/persik?additional=tra-ta-ta')}>
							Покажите Персика, пожалуйста
						</Button>
						<Button stretched size="l" mode="secondary" onClick={() => go('/persik/fish')}>
							А Персик не голоден?
						</Button>
						<Button stretched size="l" mode="secondary" onClick={() => go('/empty')}>
							На пустую страницу!!!
						</Button>
						<Button stretched size="l" mode="secondary" onClick={() => go('/alternative')}>
							На другой Root.
						</Button>
					</Group>
					<Group>
						<SimpleCell Component="label" after={<Switch onChange={() => setTop(!top)} />}>
							Вверху страницы
						</SimpleCell>
						<SimpleCell Component="label" after={<Switch onChange={() => setOverlay(!overlay)} />}>
							Поверх контента
						</SimpleCell>
						<SimpleCell Component="label" after={<Switch onChange={() => setClose(!close)} defaultChecked />}>
							Можно закрыть
						</SimpleCell>
						<Button stretched size="l" mode="secondary" onClick={showAd}>
							Рекламу в студию!
						</Button>
					</Group>
					<Button stretched size="l" mode="secondary" onClick={() => bridge.send('VKWebAppOpenApp', { app_id: 6703670 })}>
						Открыть тестовое приложение
					</Button>
				</Div>
			</Group>
		</Panel>
	);
};
