# useEnableSwipeBack
Хук для включения и выключения жеста iOS Swipe Back на стороне ВКонтакте.

Может быть размещен на "первых" панелях компонентов View.\
После выхода с такой панели Swipe Back на стороне ВКонтакте будет отключен.
Это позволит на других панелях использовать обработку жеста
внутри приложения библиотекой VKUI для анимации переходов между панелями.

Обратите внимание, хук `useEnableSwipeBack` отключит обработку
Swipe Back на стороне ВКонтакте только ПОСЛЕ выхода с панели, где он был использован.
То есть если пользователь зайдет в приложение по прямой ссылке на другую
панель, Swipe Back на стороне ВКонтакте будет работать до входа и выхода
на панель с хуком `useEnableSwipeBack`.

Если логика работы этого хука вам не подходит, вы можете его не использовать
и описать свою логику с помощью вызовов [VKWebAppSetSwipeSettings](https://dev.vk.com/bridge/VKWebAppSetSwipeSettings).\
_(Для внутренних приложений
[VKWebAppEnableSwipeBack](https://dev.vk.com/bridge/VKWebAppEnableSwipeBack) и
[VKWebAppDisableSwipeBack](https://dev.vk.com/bridge/VKWebAppDisableSwipeBack)
)_

Подробности логики работы в статье VKUI [View -> iOS Swipe Back](https://vkcom.github.io/VKUI/#/View?id=iosswipeback)
