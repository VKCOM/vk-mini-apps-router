import React from 'react';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import App from './App';
import { hierarchy, router } from './routes';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';

export const AppConfig = () => {
  return (
    <ConfigProvider isWebView>
      <AdaptivityProvider>
        <AppRoot>
          {/*<RouterProvider router={router} notFound={<p>'Custom not found'</p>}>*/}
          <RouterProvider router={router} hierarchy={hierarchy}>
            <App />
          </RouterProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}
