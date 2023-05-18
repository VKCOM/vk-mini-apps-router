import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import bridge from '@vkontakte/vk-bridge';

// Init VK  Mini App
bridge.send('VKWebAppInit');

createApp(App).use(router).mount('#app');
