# whatsapp-api-calls-client Library for JavaScript

![](https://img.shields.io/badge/license-CC%20BY--ND%204.0-green)

## Поддержка

[![Support](https://img.shields.io/badge/support@green--api.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@green-api.com)
[![Support](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/greenapi_support_ru_bot)
[![Support](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/79993331223)

## Руководства и новости

[![Guides](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/@green-api)
[![News](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/green_api)
[![News](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VaHUM5TBA1f7cG29nO1C)

- [Documentation on English](../README.md)

Библиотека позволяет принимать и совершать голосовые звонки WhatsApp из JavaScript- или
TypeScript-приложения через API сервиса [green-api.com](https://green-api.com/). Обмен
сигнализацией идёт по WebSocket, звук — по WebRTC, поэтому всё работает прямо в браузере и
ничего доустанавливать рядом не нужно. Чтобы воспользоваться библиотекой, нужно получить
`ID_INSTANCE` и `API_TOKEN_INSTANCE` в [личном кабинете](https://console.green-api.com/).
Есть бесплатный тариф инстанса разработчика.

В репозитории лежит готовое клиентское приложение на этой библиотеке — см. ниже. С него и
стоит начинать: всё описанное в этом документе там применено в работающем виде.

## React-клиент

`examples/react` — это рабочий софтфон и эталонная реализация для библиотеки.

Он закрывает то, что приложению звонков действительно приходится делать:

- **Авторизация** по `idInstance` / `apiTokenInstance`, сохраняется между перезагрузками.
- **Набор** по номеру телефона — выбор страны, форматирование по ходу ввода — либо по лиду,
  когда номер собеседника неизвестен.
- **Контакты** с аватарками и поиском: показаны оба адреса собеседника, звонок прямо из
  строки.
- **Входящие звонки**: окно с аватаркой и именем звонящего, приём и отклонение.
- **Экран звонка**: с кем говорите, сколько длится, индикаторы уровня в обе стороны,
  отключение микрофона, отбой.
- **Звуки вызова**: гудки дозвона и рингтон входящего, синтезированные — без звуковых файлов.
- **Состояние соединения**, включая переподключение прямо посреди звонка.

### Запуск

```shell
cd examples/react
npm install
npm run dev
```

`npm install` нужен только при первой установке. Vite напечатает адрес, на котором поднялся;
откройте его и войдите с данными из [личного кабинета](https://console.green-api.com/).
Инстанс при этом должен быть уже авторизован там по QR-коду — библиотека занимается только
звонками.

### Как устроен

Что смотреть в первую очередь, в порядке прохождения звонка:

| Файл | Что в нём |
| --- | --- |
| `src/voip/index.ts` | Единственные клиент и соединение на всё приложение, а также последние потоки и статус связи — чтобы компонент, смонтированный позже, их всё-таки нашёл |
| `src/hooks/useCallsConnection.ts` | То же соединение в виде состояния React |
| `src/components/softphone.tsx` | Набор: страна или лид, форматирование, клавиатура |
| `src/common/address.ts` | Модель адреса — номер и лид это альтернативы, и набирается ровно один из них |
| `src/components/incoming-call.tsx` | Окно входящего звонка |
| `src/pages/call.tsx` | Экран звонка: собеседник, таймер, индикаторы, мьют, отбой |
| `src/hooks/useVoip.ts` | Потоки и проигрывающие их аудиоэлементы, связанные в обе стороны |
| `src/voip/ringing.ts` | Гудки дозвона и рингтон |

Три вещи там неочевидны по API, и каждая ошибка тихая — ничего не падает, просто не работает:

1. **Сначала сигнализация, потом звук.** `dial()` или `accept()` должны завершиться до
   `startAudioBridge()`: оффер, не относящийся ни к какому звонку, сервер отклоняет.
2. **Мост поднимается раньше, чем появляется экран звонка.** К моменту монтирования
   аудиоэлементов события `local-stream-ready` и `remote-stream-ready` уже отработали, поэтому
   потоки запоминаются, а не только слушаются. Одной подписки мало — звонок будет беззвучным.
3. **Мьют локальный, и его надо восстанавливать.** Трек из `local-stream-ready` — тот самый,
   что добавлен в peer connection, поэтому `track.enabled = false` и есть то, что перестаёт
   слышать собеседник. После обрыва сокета посреди звонка библиотека поднимает мост заново с
   **новым** микрофоном и звонок при этом не завершает — мьют, поставленный до обрыва, нужно
   перенести на новый трек, иначе экран продолжит утверждать то, чего уже нет.

## Установка библиотеки

Библиотека работает и в сборке, и на обычной браузерной странице.

```shell
npm i @green-api/whatsapp-api-calls-client-js
```

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';
```

## Как пользоваться

Библиотека состоит из двух частей. `GreenApiVoipClient` — обёртка над REST-методами: набрать,
принять, отклонить, положить трубку. `CallsConnection`, который возвращает `connectCalls()`,
держит WebSocket: сообщает состояние звонка, объявляет входящие и несёт звук по WebRTC.

### Открыть соединение

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

const client = new GreenApiVoipClient({
  idInstance: 'your-id-instance',
  apiTokenInstance: 'your-api-token-instance',
  apiUrl: 'your-api-url', // адрес API вашего инстанса, например https://1234.api.green-api.com
});

// Переподключается само. Текущее состояние звонка приходит сразу после подключения и на
// каждое изменение, поэтому страница, перезагруженная посреди звонка, сразу покажет верное.
const calls = client.connectCalls();

calls.addEventListener('connect', () => console.log('Соединение установлено.'));
calls.addEventListener('disconnect', (event) => console.log('Обрыв:', event.detail.reason));
calls.addEventListener('state', (event) => {
  const { state, info } = event.detail; // 'idle' | 'inc-call' | 'out-call' | 'on-call'
  console.log('Состояние звонка:', state, info ?? '');
});
```

### Принять звонок

```javascript
const audio = document.querySelector('audio');

calls.addEventListener('incoming-call', async (event) => {
  const { id, wid, name } = event.detail;
  console.log('Входящий звонок от', name || wid);

  // Здесь показывайте своё окно; тут звонок принимается сразу.
  await client.accept();
  await calls.startAudioBridge();
});

calls.addEventListener('remote-stream-ready', (event) => {
  audio.srcObject = event.detail;
});
```

### Позвонить

```javascript
// Номер телефона, chatId вида `79991234567@c.us` либо лид вида `1062110180230@lid`.
await client.dial('79991234567');
await calls.startAudioBridge();
```

Неудача с мостом звонок не отменяет: на сервере он остаётся, и `startAudioBridge()` можно
вызвать ещё раз. Так же звук возвращают после перезагрузки страницы — если `calls.state.state`
равно `out-call` или `on-call`, а `calls.hasAudioBridge` — `false`, поднимайте мост без
повторного набора.

### Завершить звонок

```javascript
await client.hangUp(); // активный звонок
await client.reject(); // входящий

calls.addEventListener('end-call', (event) => {
  const { reason, cause } = event.detail;
  // reason: 'call-ended' (завершил сервер) либо 'connection-lost'
  // cause: слово сервера — 'hangup', 'timeout', 'accepted_elsewhere', …
  console.log('Звонок завершён.', cause ?? '');
});
```

Аудиомост библиотека разбирает сама при завершении звонка. `calls.close()` останавливает мост
и закрывает сокет, когда звонки больше не нужны.

## Другие примеры

- [Vanilla JS](../examples/basic-usage-vanilla-js/) — те же звонки без фреймворка, чтобы
  посмотреть на API отдельно.

Оба примера запускаются одинаково: `npm install`, затем `npm run dev`.

## Документация

[Пошаговое руководство](./step-by-step_ru.md) проводит через всю интеграцию — от настройки
проекта до обработки каждого события.

## Сторонние библиотеки

У самой библиотеки нет зависимостей времени выполнения. React-клиент использует
[React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/),
[React Router](https://reactrouter.com/), [Ant Design](https://ant.design/),
[иконки MUI](https://mui.com/material-ui/material-icons/) и
[libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js).

## Лицензия

Лицензировано на условиях Creative Commons. Подробности — в файле [LICENSE](../LICENSE).
