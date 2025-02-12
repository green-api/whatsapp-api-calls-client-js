## Подготовка
Установить библиотеку `socket.io-client`, окружение должно поддерживать WEBRTC для конечной работы звонков

## Установить соединение по socket.io
### Описание
Успешная установка соединения открывает доступ к расширенному сигнальному серверу.
Иными словами, соединение сможет принимать стандартные события сигнализации (ADD_PEER, REMOVE_PEER, SESSION_DESCRIPTION, ICE_CANDIDATE), а также
некоторые дополнительные события (INCOMING_CALL, CALL_STATE, END_CALL)

### Хост
В качестве хоста нужно использовать схему: `https://{{pool}}.voip.green-api.com`, где пул - первые четыре цифры подключаемого инстанса.

Например, для инстанса `1101000001` pool=1101, тогда хост будет следующим: `https://1101.voip.green-api.com`.
```ts
import { io } from 'socket.io-client';

const pool = '1101'
const host = `https://${pool}.voip.green-api.com`

this.socket = io(host, {
    transports: ['websocket'],
    autoConnect: false,
});
```

### Авторизация
В качестве данных авторизации необходимо указать объект:
```ts
const idInstance = '1101000001'
const apiTokenInstance = '****************************************************'

socket.auth = {
    idInstance: idInstance, // id инстанса
    apiInstanceToken: apiTokenInstance, // токен инстанса
    type: 'external', // остается неизменным
}
```

## Обработка событий socket.io
### Сигнализация
Лучше всего ознакомиться с тем вариантом, который заложен в класс GreenApiVoipClient, по своей сути там все стандартно

### Входящий звонок (incoming-call)
При получении события incoming-call необходимо в течении `payload.timeout` секунд отправить событие в сокет

#### Отклонение входящего звонка
```ts
socket.on('incoming-call', async (payload: IncomingCallPayload) => {
    // const localMediaStream = await navigator.mediaDevices.getUserMedia({ audio: audio, video: video });

    socket.emit('incoming-call-answer', { reject: true });
});
```

#### Принятие входящего звонка
Вам необходимо отправить в ответ два события:
1. событие incoming-call-answer с reject=false
2. событие join указав в качестве callId идентификатор инстанса

```ts
socket.on('incoming-call', async (payload: IncomingCallPayload) => {
    socket.emit('incoming-call-answer', { reject: false });
    socket.emit('join', { callID: idInstance });
});
```

### Исходящий звонок (outgoing-call)
Необходимо сделать http запрос:
```ts
const phoneNumber = 18273028182

const apiUrl = 'https://1101.api.green-api.com'
const idInstance = '1101000001'
const apiTokenInstance = '****************************************************'
const url = `${apiUrl}/waInstance${idInstance}/call/${apiTokenInstance}`;

const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ phoneNumber: phoneNumber }),
    headers: {
      'Content-Type': 'application/json',
    },
});

const payload = await response.json();

if (response.status === 200) {
    const { callId } = payload // получение id звонка
} else {
    const { message } = payload // получение статуса/уточнения ошибки
}
```

### Окончание звонка (end-call)
#### Исходящее завершение звонка
Необходимо отправить событие end-call и дождаться пока не придет ack. В целом ack является лишь мерой предосторожности в случаях, когда сервер по каким-либо причинам получил ошибку при завершении звонка
```ts
socket.emit('end-call', {})
```

```ts
const ack = await socket.emitWithAck('end-call', {});

if (ack) {
    // успешное завершение звонка
} else {
    // ошибка на стороне сервера
}
```

#### Входящее завершение звонка
Вам необходимо отправить в ответ событие leave указав в качестве callId идентификатор инстанса

```ts
socket.on('end-call', async (payload: EndCallPayload) => {
    socket.emit('leave', { callID: idInstance });
});
```

### Событие состояния звонка (call-state)
Событие носит чисто информативный характер и несет в себе кучу сырых данных Whatsapp

```ts
socket.on('end-call', async (payload: CallStatePayload) => {
    
});
```