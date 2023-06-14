
# vk-mini-apps-router

Библиотека vk-mini-apps-router — решение для декларативной маршрутизации и навигации для [мини-приложений](https://dev.vk.com/mini-apps/overview) ВКонтакте, созданных с помощью библиотеки [VKUI](https://github.com/VKCOM/VKUI).

## Ключевые особенности

* Интеграция с [VKUI](https://github.com/VKCOM/VKUI), поддержка React-компонентов этой библиотеки.

  Ваше мини-приложение будет органично вписываться в интерфейс ВКонтакте и использовать такие же визуальные эффекты при вызовы или скрытии окон и экранов.

* Поддержка навигации по экранам приложения.  Возможность открытия любого экрана в мини-приложении по прямой ссылке (включая модальные и всплывающие окна).

* Отображение модальных и всплывающих окон без изменения URL в приложении, но с возможностью закрытия этих окон кнопкой «Назад».

* Интеграция с библиотекой [VK Bridge](https://github.com/VKCOM/vk-bridge).

* Встроенная обработка ошибки 404 Not Found.

## Установка и использование

### yarn

`yarn add @vkontakte/vk-mini-apps-router`

### npm

`npm install @vkontakte/vk-mini-apps-router`

### Использование VK Bridge

Библиотека [VK Bridge](https://github.com/VKCOM/vk-bridge) не включена в репозиторий. Устанавливайте её самостоятельно.

## Документация и ресурсы

* https://dev.vk.com/libraries/router — документация библиотеки.

* [Пример использования](https://github.com/VKCOM/vk-mini-apps-router/tree/master/examples/vk-mini-apps-router-example).

* [VK Mini Apps](https://vk.com/vkappsdev) — сообщество разработчиков мини-приложений ВКонтакте.
