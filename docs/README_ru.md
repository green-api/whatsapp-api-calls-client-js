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

Библиотека JavaScript WhatsАpp API Calls Client позволяет легко создавать JavaScript/TypeScript приложения для приема входящих звонков и создания исходящих звонков через WhatsApp через API
сервиса [green-api.com](https://green-api.com/). Чтобы воспользоваться библиотекой, нужно получить `ID_INSTANCE` и `API_TOKEN_INSTANCE` в [личном кабинете](https://console.green-api.com/). Есть бесплатный тариф инстанса разработчика. 


## API

API библиотеки основана на WebSockets и WebRTC(Web Real-Time Communication — коммуникация в режиме реального времени) протоколе.  

Плюсы использования WebRTC:

* Доступность в браузерах
* Низкая задержка
* Контроль перегрузки
* Обязательное шифрование
 
## Установка и импорт библиотеки  

Библиотека поддерживает только окружение браузера и может быть установлена как с помощью пакетного менеджера, так и без него. 

**Установка для Webpack и npm приложений:**

```shell
npm i @green-api/whatsapp-api-calls-client-js
```

**Импорт библиотеки в проект:**

Для ES6 JavaScript или TypeScript
```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';
```

**Импорт и установка Vanilla JS приложений, добавьте строку в ваш index.html**
```html
<script src="https://unpkg.com/@green-api/whatsapp-api-client/lib/whatsapp-api-client.min.js"></script>
```  

## Аутентификация  

Для использования библиотеки вам понадобится учетная запись GREEN-API на сайте [green-api.com](https://green-api.com/en). Пройдите аутентификацю с помощью мобильного приложения WhatsApp. Чтобы зарегистрировать учетную запись, вам необходимо перейти на [панель управления](https://console.green-api.com/). После регистрации вы получите уникальную пару ключей `ID_INSTANCE` и `API_TOKEN_INSTANCE`. Аутентификация мобильного приложения WhatsApp может быть выполнена в [панели управления](https://console.green-api.com/). Вам необходимо будет отсканировать QR-код.

## Примеры  

Класс `GreenApiVoipClient` это EventEmitter класс, который генерирует события, с помощью которыми можно управлять жизненным циклом вызова.  

### Как инициализировать объект  

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

// Инициализация объекта VoipClient  
const greenApiVoipClient = new GreenApiVoipClient();

// Примеры параметров инициализации, замените их фактическими данными вашего инстанса
const initOptions = {
  idInstance: 'your-id-instance',
  apiTokenInstance: 'your-api-token-instance',
  apiUrl: 'your-api-url-voip' // обычно https://pool.voip.green-api.com, где pool представляет собой первые 4 символа idInstance
};

// Инициализация клиента  
greenApiVoipClient.init(initOptions).then(() => {
  console.log('GreenApiVoipClient initialized and connected.');
}).catch(error => {
  console.error('Failed to initialize GreenApiVoipClient:', error);
});
```

### Обработка входящих звонков  

```javascript
const callBtns = document.getElementById('initBtns');
const audioElement = document.createElement('audio'); // Аудио элемент для передачи звукового потока

// Запустите Event и получайте информацию о звонке из WhatsApp
greenApiVoipClient.addEventListener('incoming-call', (event) => {
  console.log(event.detail.info);

  // Отобразить кнопки принятия и отклонения вызова
  const acceptCallBtn = document.createElement('button');
  const rejectCallBtn = document.createElement('button');
  
  acceptCallBtn.addEventListener('click', async () => {
    await greenApiVoipClient.acceptCall();
  });
  
  rejectCallBtn.addEventListener('click', async () => {
    await greenApiVoipClient.rejectCall();
  });

  callBtns.append(acceptCallBtn, rejectCallBtn);
});

greenApiVoipClient.addEventListener('remote-stream-ready', (event) => {
  // Назначьте удаленному медиапотоку значение из события, чтобы вы могли слышать голос другого участника вызова
  audioElement.srcObject = event.detail;
});
```  

### Обработка исходящих звонков  

```javascript
const callBtn = document.getElementById('call');
const audioElement = document.getElementById('remote'); // Аудио элемент для передачи звукового потока

callBtn.addEventListener('click', async () => {
  try {
    await greenApiVoipClient.startCall('Номер телефона получателя');
  } catch (err) {
    console.error(err);
  }
});

greenApiVoipClient.addEventListener('remote-stream-ready', (event) => {
  // Назначьте удаленному медиапотоку значение из события, чтобы вы могли слышать голос другого участника вызова
  audioElement.srcObject = event.detail;
});
```  

## Демо примеры на Vanilla JS и React:  

Вы можете ознакомиться с нашими демонстрационными примерами по ссылкам ниже:

   * [Vanilla JS](./examples/basic-usage-vanilla-js/)  
   * [React JS](./examples/react/)  

Скачайте необходимый пример из репозитория по ссылке. После выполните в папке проекта следующие шаги:

```shell
npm install  
npm run dev  
```
`npm install` достаточно выполнять один раз при первой установке.  

После этого вам станет доступен веб-интерфейс клиента по указанному адресу, например:  

```
 npm run dev

> vite-project@0.0.0 dev
> vite

  VITE v5.2.11  ready in 969 ms

  ➜  Local:   http://localhost:80/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Откройте ссылку в предпочитаемом браузере. Для работы используйте `idInstance` И `apiTokenInstance` из [личного кабинета](https://console.green-api.com/). После авторизации вы можете принимать входящие звонки и совершать исходящие.

Для остановки сервера нажмите `Ctrl + C` и затем нажмите кнопку `Y` в вашем терминале.

## Документация  

Для более детальной информации ознакомьтесь с нашим ["Пошаговым руководством"](./step-by-step_ru.md).

## Сторонние библиотеки  

- [socket.io-client](https://www.npmjs.com/package/socket.io-client) - WebSocket library
- [freeice](https://www.npmjs.com/package/freeice) - Free random STUN or TURN server for your WebRTC application


## Лицензия  

Лицензировано на условиях [Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)](https://creativecommons.org/licenses/by-nd/4.0/).
