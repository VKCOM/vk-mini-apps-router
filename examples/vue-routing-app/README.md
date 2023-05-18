# vue-routing-app
Пример интеграции приложения на Vue и Vue Router во ВКонтакте
с помощью библиотеки `@vkontakte/vk-bridge`.

Показывает:
- как запустить приложение
- как обновить URL основной страницы, куда встроено приложение
- как принять путь из основной страницы при открытии приложения
- как обеспечить корректную работу браузерных и нативных кнопок назад и вперед

## Запуск проекта
```
yarn install
```

### Запуск в режиме разработки с горячей перезагрузкой
```
yarn serve
```

### Проверка стиля кода
```
yarn lint
```

## Как это приложение было создано
```shell
vue create vue-routing-app
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, TS, Router, CSS Pre-processors, Linter
? Choose a version of Vue.js that you want to start the project with 3.x
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with dart-sass)
? Pick a linter / formatter config: Prettier
? Pick additional lint features: Lint and fix on commit
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? No
? Pick the package manager to use when installing dependencies: Yarn
```

## Были добавлены пакеты
```json
{
  "dependencies": {
    "@vkontakte/vk-bridge": "^2.7.2"
  },
  "devDependencies": {
    "@vkontakte/vk-tunnel": "^0.1.3"
  }
}
```

## Добавлен код
### src/router/index.ts
```ts
router.beforeEach(async (to, from) => {
  if (to.query?.vk_app_id && from.fullPath === "/") {
    return { path: to.hash.replace("#", "") || "/", replace: true };
  }
});
router.afterEach((to, from) => {
  bridge.send("VKWebAppSetLocation", {
    location: to.fullPath,
    replace_state: true,
  });
});
bridge.subscribe((event) => {
  if (event.detail.type === "VKWebAppChangeFragment") {
    router.replace(event.detail.data.location);
  }
});
```

### src/main.ts
```ts
import bridge from "@vkontakte/vk-bridge";

// Init VK  Mini App
bridge.send("VKWebAppInit");
```

## Добавлены команды в package.json
```json
{
  "scripts": {
    "serve": "vue-cli-service serve --https --port 10777",
    "tunnel": "vk-tunnel --insecure=1 --http-protocol=https --ws-protocol=wss --host=0.0.0.0 --port=10777"
  }
}
```
