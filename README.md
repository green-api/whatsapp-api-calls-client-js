# whatsapp-api-calls-client Library for JavaScript

[![license](https://img.shields.io/badge/license-CC%20BY--ND%204.0-green)](https://creativecommons.org/licenses/by-nd/4.0/)

## Support Links

[![Support](https://img.shields.io/badge/support@green--api.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@greenapi.com)
[![Support](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/greenapi_support_eng_bot)
[![Support](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/77273122366)

## Guides & News

[![Guides](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/@greenapi-en)
[![News](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/green_api)
[![News](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VaLj6J4LNSa2B5Jx6s3h)

- [Документация на русском языке](./docs/README_ru.md)

This library helps you easily create a JavaScript/TypeScript application to receive incoming calls and start outgoing calls via WhatsApp using the API service [green-api.com](https://green-api.com/en/). To use this library, you need to obtain your `ID_INSTANCE` and `API_TOKEN_INSTANCE` from [control panel](](https://console.green-api.com)). The library is free for developers.

## API

The API is based on WebSockets and the WebRTC protocol.

Pros of using WebRTC:

* Availability in browsers;
* Low latency;
* Congestion control;
* Mandatory encryption.

## Installing & Importing

Library supports both browser environment without package managers and Node/Webpack apps with package manager that can
handle `require` or `import` module expressions.

**Installing for webpack and npm based apps:**

```shell
npm i @green-api/whatsapp-api-calls-client-js
```

**Way to import the library in a project:**

Using ES6 JavaScript or TypeScript
```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';
```

**Import & installing for vanilla JavaScript modify index.html:**
```html
<script src="https://unpkg.com/@green-api/whatsapp-api-client/lib/whatsapp-api-client.min.js"></script>
```  

## Authentication

To use the library, you need a GREEN-API account on [green-api.com](https://green-api.com/en) and authentication completed by mobile WhatsApp app. To register the account, you must proceed to the [control panel](https://console.green-api.com/). After registering you get unique pair of `ID_INSTANCE` and `API_TOKEN_INSTANCE` keys.

WhatsApp mobile app authentication may be achieved by [control panel](https://console.green-api.com/). You need to
scan QR-code generated within the control panel.

## Examples

The GreenApiVoipClient class emits several important events that you can listen to in order to manage the lifecycle of a call.

### Initialization

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

// Initialize the GreenApiVoipClient
const greenApiVoipClient = new GreenApiVoipClient();

// Example initialization options, replace with your actual instance details
const initOptions = {
  idInstance: 'your-id-instance',
  apiTokenInstance: 'your-api-token-instance',
};

// Initialize the client
greenApiVoipClient.init(initOptions).then(() => {
  console.log('GreenApiVoipClient initialized and connected.');
}).catch(error => {
  console.error('Failed to initialize GreenApiVoipClient:', error);
});
```

### Handling Incoming Calls

```javascript
const callBtns = document.getElementById('initBtns');
const audioElement = document.createElement('audio'); // audio element to play the sound

// Subscribe to the incoming call event and get call info from WhatsApp
greenApiVoipClient.addEventListener('incoming-call', (event) => {
  console.log(event.detail.info);

  // Render accept and reject call buttons
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
  // Assign remote media stream value from event so you can hear the voice of the other call participant
  audioElement.srcObject = event.detail;
});
```

### Making Outgoing Calls

```javascript
const callBtn = document.getElementById('call');
const audioElement = document.getElementById('remote'); // audio element to play the sound

callBtn.addEventListener('click', async () => {
  try {
    await greenApiVoipClient.startCall('Receiver phone number');
  } catch (err) {
    console.error(err);
  }
});

greenApiVoipClient.addEventListener('remote-stream-ready', (event) => {
  // Assign remote media stream value from event so you can hear the voice of the other call participant
  audioElement.srcObject = event.detail;
});
```  

## Demo examples on Vanilla JS & React

You can find our demo examples:
* [Vanilla JS](./examples/basic-usage-vanilla-js/)
* [React JS](./examples/react/)

Download the required example from the repository at the link. Then  following steps in the project folder:

```shell
npm install

npm run dev
```
`npm install` runs only once during the first installation.

After that, the client web interface will be available for you at the specified address, for example:

```
npm run dev

> vite-project@0.0.0 dev
> vite

VITE v5.2.11 ready in 969 ms

➜ Local: http://localhost:80/
➜ Network: use --host to expose
➜ press h + enter to show help
```

Open the link in your preferred browser. For work with the app, use `idInstance` and `apiTokenInstance` from [control panel](https://console.green-api.com/). After authorization, you can receive incoming calls and make outgoing ones.

To stop the server, press `Ctrl + C` and after press the `Y` button in your terminal.

## Documentation

For more detailed information, please refer to the [Step by step guide](./docs/step-by-step.md).

## Third-party Libraries

- [socket.io-client](https://www.npmjs.com/package/socket.io-client) - WebSocket library
- [freeice](https://www.npmjs.com/package/freeice) - Free random STUN or TURN server for your WebRTC application

## License

Licensed under the Creative Commons License. For additional information, see [LICENSE](LICENSE).
