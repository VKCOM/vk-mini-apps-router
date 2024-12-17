import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { SplitCol, SplitLayout, View, Root, Epic, ModalRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator,
  useGetPanelForView,
  useFirstPageCheck,
  useHistoryManager
} from '@vkontakte/vk-mini-apps-router';

import { Home } from './panels/Home';
import { Persik } from './panels/Persik';
import { Blocker } from './panels/Blocker';

import {
  ALTERNATIVE_ROOT,
  ALTERNATIVE_VIEW,
  ALTERNATIVE_VIEW_PANELS,
  DEFAULT_ROOT,
  DEFAULT_VIEW,
  DEFAULT_VIEW_PANELS,
  EMPTY_VIEW,
  EMPTY_VIEW_PANELS,
  HOME_PANEL_MODALS,
  PERSIK_PANEL_MODALS,
} from './routes';
import { Empty } from './panels/Empty';
import { PersikModal } from './modals/PersikModal';
import { UserModal } from './modals/UserModal';
import { Alternative } from './panels/Alternative';
import { BlockerModal } from './modals/BlockerModal';
import { OnboardingOne } from './onboarding/OnboardingOne';
import { OnboardingTwo } from './onboarding/OnboardingTwo';
import { OnboardingThree } from './onboarding/OnboardingThree';

function App() {
  const [fetchedUser, setUser] = useState<any>(null);
  const isFirstPage = useFirstPageCheck();
  const routerPopout = usePopout();
  const routeNavigator = useRouteNavigator();
  const historyManager = useHistoryManager();
  const {
    root: activeRoot = DEFAULT_ROOT,
    view: activeView = DEFAULT_VIEW,
    modal: activeModal,
    panelsHistory,
  } = useActiveVkuiLocation();

  const defaultActivePanel = useGetPanelForView(DEFAULT_VIEW);
  const emptyActivePanel = useGetPanelForView(EMPTY_VIEW);
  const alternativeActivePanel = useGetPanelForView(ALTERNATIVE_VIEW);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
    }
    fetchData();
  }, []);

  const goToFirstPage = () => {
    routeNavigator.go(-historyManager.getCurrentPosition());
  };

  const go = (path: string) => {
    routeNavigator.push(path);
  };

  const modal = (
    <ModalRoot activeModal={activeModal} onClose={() => routeNavigator.hideModal(false, {replace: isFirstPage})}>
      <PersikModal nav={PERSIK_PANEL_MODALS.PERSIK} />
      <BlockerModal nav={HOME_PANEL_MODALS.BLOCKER} />
      <UserModal nav={HOME_PANEL_MODALS.USER} fetchedUser={fetchedUser} />
      <OnboardingOne nav={HOME_PANEL_MODALS.ONBOARDING_1} />
      <OnboardingTwo nav={HOME_PANEL_MODALS.ONBOARDING_2} />
      <OnboardingThree nav={HOME_PANEL_MODALS.ONBOARDING_3} />
    </ModalRoot>
  );

  const history = activeModal || routerPopout ? [] : panelsHistory;
  return (
    <SplitLayout>
      {routerPopout}
      {modal}
      <SplitCol>
        <Epic activeStory={activeRoot}>
          <Root activeView={activeView} nav={DEFAULT_ROOT}>
            <View
              nav={DEFAULT_VIEW}
              history={history}
              activePanel={defaultActivePanel || DEFAULT_VIEW_PANELS.HOME}
              onSwipeBack={() => routeNavigator.back()}
            >
              <Home nav={DEFAULT_VIEW_PANELS.HOME} fetchedUser={fetchedUser} go={go} goToFirstPage={goToFirstPage} />
              <Persik nav={DEFAULT_VIEW_PANELS.PERSIK} />
              <Blocker nav={DEFAULT_VIEW_PANELS.BLOCKER} />
            </View>
            <View
              nav={EMPTY_VIEW}
              history={history}
              activePanel={emptyActivePanel || EMPTY_VIEW_PANELS.EMPTY}
              onSwipeBack={() => routeNavigator.back()}
            >
              <Empty nav={EMPTY_VIEW_PANELS.EMPTY} />
            </View>
          </Root>
          <Root activeView={activeView} nav={ALTERNATIVE_ROOT}>
            <View
              nav={ALTERNATIVE_VIEW}
              history={history}
              activePanel={alternativeActivePanel || ALTERNATIVE_VIEW_PANELS.ALTERNATIVE}
              onSwipeBack={() => routeNavigator.back()}
            >
              <Alternative nav={ALTERNATIVE_VIEW_PANELS.ALTERNATIVE} go={go} />
            </View>
          </Root>
        </Epic>
      </SplitCol>
    </SplitLayout>
  );
}

export default App;
