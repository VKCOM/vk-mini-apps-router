import React, { ChangeEvent, useState } from 'react';

import { Button, Group, Panel, PanelHeader, PanelHeaderBack, Input, FormItem } from '@vkontakte/vkui';

import persik from '../img/persik.png';
import persik_fish from '../img/persik_fish.png';
import persik_sad from '../img/persik_sad.png';
import './Persik.css';
import { useParams, useSearchParams, useFirstPageCheck, useRouteNavigator } from '@vkontakte/vk-mini-app-router';
import { NavProp } from '../types';
import { routes } from '../routes';

const IMAGES = { persik, persik_fish, persik_sad };

const Persik = (props: NavProp) => {
	const { emotion } = useParams() ?? {};
	const [params, setParams] = useSearchParams();
	const [additional, setAdditional] = useState(params.get('additional'));
	function updateSearch() {
		if (additional) {
			params.set('additional', additional);
		} else {
			params.delete('additional');
		}
		setParams(params);
	}
	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setAdditional(event.target.value);
	}

	const persikPanel = routes.default_root.default_view.persik;
	const persikEmotionPanel = routes.default_root.default_view.persik_0;
	let image: string | undefined = IMAGES[`persik${emotion ? '_' : ''}${emotion ?? ''}` as keyof typeof IMAGES];
	const isFirstPage = useFirstPageCheck();
	const routeNavigator = useRouteNavigator();
	return (
		<Panel nav={props.nav}>
			<PanelHeader
				before={<PanelHeaderBack onClick={() => isFirstPage ? routeNavigator.push('/') : routeNavigator.back()} />}
			>
				Персик {params.get('additional')}
			</PanelHeader>
			<Group>
				{!!emotion && <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push(persikPanel, { keepSearchParams: true })}>
					Погладить персика
				</Button>}
				{emotion !== 'fish' && <Button
					stretched
					size="l"
					mode="secondary"
					onClick={() => routeNavigator.push(persikEmotionPanel, { emotion: 'fish' }, { keepSearchParams: true })}
				>Хочешь кушать?</Button>}
				{emotion !== 'sad' && <Button
					stretched size="l"
					mode="secondary"
					onClick={() => routeNavigator.push(persikEmotionPanel, { emotion: 'sad' }, { keepSearchParams: true })}
				>А еды нет...</Button>}
				<Button stretched size="l" mode="secondary" onClick={() =>
					routeNavigator.push(`/persik${emotion ? '/' + emotion : ''}/persik_modal`, { keepSearchParams: true })}>
					Персик в модалке
				</Button>
				<FormItem top="Дополнительный текст в заголовке">
					<Input type="text" onChange={handleChange}></Input>
				</FormItem>
				<Button stretched size="l" mode="secondary" onClick={updateSearch}>
					Обновить текст в заголовке.
				</Button>
				<Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('/')}>
					На главную
				</Button>
			</Group>
			<img className="Persik" src={image} alt="Persik The Cat" />
		</Panel>
	);
};

export default Persik;
