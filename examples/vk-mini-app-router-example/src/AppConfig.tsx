import React, { useEffect } from 'react';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import App from './App';
import { router } from './routes';
import { RouterProvider } from '@vkontakte/vk-mini-app-router';
import bridge from '@vkontakte/vk-bridge';

export const AppConfig = () => {

  useEffect(() => {
    async function subscribeToNavigation() {
      await bridge.subscribe((event) => {
        if (!event.detail) {
          return;
        }
        console.log(event.detail.type, event.detail.data);
      });
    }
    subscribeToNavigation();
  }, [])

  return (
    <ConfigProvider isWebView>
      <AdaptivityProvider>
        <AppRoot>
          {/*<RouterProvider router={router} notFound={<p>'Custom not found'</p>}>*/}
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}
