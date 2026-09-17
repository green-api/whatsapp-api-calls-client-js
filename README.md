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

This library lets a JavaScript or TypeScript application place and receive WhatsApp voice
calls through the API service [green-api.com](https://green-api.com/en/). It talks to the
calls API over a WebSocket and carries the audio over WebRTC, so it runs in the browser with
nothing to install alongside it. To use it you need an `ID_INSTANCE` and an
`API_TOKEN_INSTANCE` from the [control panel](https://console.green-api.com). The library is
free for developers.

The repository ships a full client application built on the library — see below. It is the
place to look first: every feature described in this README is used there in context.

## The React client

`examples/react` is a working softphone, and the reference implementation for this library.

It covers what a calls application actually has to do:

- **Authorization** with `idInstance` / `apiTokenInstance`, kept across reloads.
- **Dialling** by phone number — country picker, per-country formatting as you type — or by
  LID, for a peer whose number is not known.
- **Contacts** with avatars and search, showing both of a peer's addresses, and dialling
  straight from a row.
- **Incoming calls**: a prompt with the caller's avatar and name, accept and reject.
- **The call screen**: who you are talking to, how long for, live level meters for both
  directions, microphone mute, hang up.
- **Ringing**: a ringback while the far end has not picked up, a ring tone for an incoming
  call, both synthesised — no audio files.
- **Connection state**, including a reconnect in the middle of a call.

### Running it

```shell
cd examples/react
npm install
npm run dev
```

`npm install` is needed only the first time. Vite prints the address it is serving on; open
it, sign in with the credentials from the [control panel](https://console.green-api.com/),
and the instance must already be authorized there by scanning the QR code — this library
deals with calls only.

### How it is put together

The parts worth reading first, in the order a call goes through them:

| File | What it holds |
| --- | --- |
| `src/voip/index.ts` | The one client and connection for the whole app, plus the last streams and connection status, so a component that mounts late still finds them |
| `src/hooks/useCallsConnection.ts` | That connection as React state |
| `src/components/softphone.tsx` | Dialling: country or LID, formatting, the keypad |
| `src/common/address.ts` | The address model — a phone number and a LID are alternatives, and only one of them is what gets dialled |
| `src/components/incoming-call.tsx` | The incoming prompt |
| `src/pages/call.tsx` | The call screen: peer, timer, meters, mute, hang up |
| `src/hooks/useVoip.ts` | Streams and the audio elements that play them, wired in both directions |
| `src/voip/ringing.ts` | The ringback and ring tones |

Three things in there are not obvious from the API, and each one is a silent failure if you
get it wrong:

1. **Signalling first, audio second.** `dial()` or `accept()` must resolve before
   `startAudioBridge()`: the server rejects an offer that belongs to no call.
2. **The bridge comes up before the call screen does.** `local-stream-ready` and
   `remote-stream-ready` have already fired by the time the audio elements mount, so the
   streams are remembered rather than only listened for. Subscribing alone leaves the call
   silent.
3. **Mute is local, and it has to be re-applied.** The track handed out with
   `local-stream-ready` is the one added to the peer connection, so `track.enabled = false`
   is what the peer stops hearing. After a socket drop mid-call the library raises the bridge
   again with a *new* microphone and without ending the call — a mute set before the drop
   must be put back on the new track, or the screen goes on claiming a mute that no longer
   holds.

## Installing the library

The library works both in a bundled app and in a plain browser page.

```shell
npm i @green-api/whatsapp-api-calls-client-js
```

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';
```

## Using it

The library has two parts. `GreenApiVoipClient` wraps the REST methods — dial, accept,
reject, hang up. `CallsConnection`, returned by `connectCalls()`, holds the WebSocket: it
reports the call state, announces incoming calls, and carries the WebRTC audio.

### Opening the connection

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

const client = new GreenApiVoipClient({
  idInstance: 'your-id-instance',
  apiTokenInstance: 'your-api-token-instance',
  apiUrl: 'your-api-url', // the API host of your instance, e.g. https://1234.api.green-api.com
});

// Reconnects on its own. The current call state arrives right after connecting and on
// every change, so a page reloaded mid-call shows the right thing at once.
const calls = client.connectCalls();

calls.addEventListener('connect', () => console.log('Calls connection is up.'));
calls.addEventListener('disconnect', (event) => console.log('Lost:', event.detail.reason));
calls.addEventListener('state', (event) => {
  const { state, info } = event.detail; // 'idle' | 'inc-call' | 'out-call' | 'on-call'
  console.log('Call state:', state, info ?? '');
});
```

### Receiving a call

```javascript
const audio = document.querySelector('audio');

calls.addEventListener('incoming-call', async (event) => {
  const { id, wid, name } = event.detail;
  console.log('Incoming call from', name || wid);

  // Show your own UI here; this accepts immediately.
  await client.accept();
  await calls.startAudioBridge();
});

calls.addEventListener('remote-stream-ready', (event) => {
  audio.srcObject = event.detail;
});
```

### Placing a call

```javascript
// A phone number, a chatId such as `79991234567@c.us`, or a LID such as `1062110180230@lid`.
await client.dial('79991234567');
await calls.startAudioBridge();
```

A failed bridge does not cancel the call: the server keeps it, and `startAudioBridge()` can
be called again. That is also how audio is reattached after a reload — if `calls.state.state`
is `out-call` or `on-call` and `calls.hasAudioBridge` is `false`, start the bridge without
dialling again.

### Ending a call

```javascript
await client.hangUp(); // an active call
await client.reject(); // an incoming one

calls.addEventListener('end-call', (event) => {
  const { reason, cause } = event.detail;
  // reason: 'call-ended' (the server ended it) or 'connection-lost'
  // cause: the server's own word — 'hangup', 'timeout', 'accepted_elsewhere', …
  console.log('Call ended.', cause ?? '');
});
```

The library tears the audio bridge down itself when a call ends. `calls.close()` stops the
bridge and closes the socket when you are done with calls altogether.

## Other examples

- [Vanilla JS](./examples/basic-usage-vanilla-js/) — the same calls without a framework, for
  reading the API on its own.

Both examples are started the same way: `npm install`, then `npm run dev`.

## Documentation

The [step-by-step guide](./docs/step-by-step.md) goes through the whole integration, from
setting up the project to handling every event.

## Third-party libraries

The library itself has no runtime dependencies. The React client uses
[React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/),
[React Router](https://reactrouter.com/), [Ant Design](https://ant.design/),
[MUI icons](https://mui.com/material-ui/material-icons/) and
[libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js).

## License

Licensed under the Creative Commons License. For additional information, see [LICENSE](LICENSE).
