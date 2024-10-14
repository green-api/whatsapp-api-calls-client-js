import 'App.css';
import {FC, useCallback, useEffect, useState} from 'react';
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

export const voipClient = new GreenApiVoipClient();

async function run() {
  voipClient.addEventListener("local-stream-ready", (...args) => console.log("local-stream-ready", ...args))
  voipClient.addEventListener("remote-stream-ready", (...args) => console.log("remote-stream-ready", ...args))
  voipClient.addEventListener("end-call", (...args) => console.log("end-call", ...args))
  voipClient.addEventListener("call-state", (...args) => console.log("call-state", ...args))
  voipClient.addEventListener("incoming-call", (...args) => console.log("incoming-call", ...args))
}

run();

const App: FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [idInstance, setIdInstance] = useState<string>('');
  const [apiTokenInstance, setApiTokenInstance] = useState<string>('');

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null)

  const remoteStreamReadyHandler = useCallback((event: CustomEvent<MediaStream>) => {
    setRemoteMediaStream(event.detail);
  }, [setRemoteMediaStream])

  const onEndCall = useCallback(() => {
    setRemoteMediaStream(null);
  }, [setRemoteMediaStream])

  useEffect(() => {
    voipClient.addEventListener("remote-stream-ready", remoteStreamReadyHandler);
    voipClient.addEventListener("end-call", onEndCall);

    return () => {
      voipClient.removeEventListener("remote-stream-ready", remoteStreamReadyHandler);
      voipClient.removeEventListener("end-call", onEndCall);
    }
  }, []);

  const connectHandler = useCallback(async () => {
    await voipClient.init({
      idInstance: idInstance,
      apiTokenInstance: apiTokenInstance
    });

    setIsInitialized(true)
  }, [idInstance, apiTokenInstance]);

  const disconnectHandler = useCallback(async () => {
    voipClient.destroy();
    setIsInitialized(false)
  }, []);

  const startCallHandler = useCallback(async () => {
    await voipClient.startCall(parseInt(phoneNumber), true, false)
  }, [phoneNumber])

  const endCallHandler = useCallback(async () => {
    const ended = await voipClient.endCall();
    console.log(`endCall result: ${ended}`);
  }, []);

  const acceptCallHandler = useCallback(async () => {
    const accepted = await voipClient.acceptCall();
  }, []);

  const rejectCallHandler = useCallback(async () => {
    const rejected = await voipClient.rejectCall();
  }, []);

  return (
  <div>
    <section>
      <p>Инициализация</p>
      <input placeholder={'id инстанса'} value={idInstance} onChange={(e) => setIdInstance(e.currentTarget.value)} />
      <input placeholder={'api token инстанса'} value={apiTokenInstance} onChange={(e) => setApiTokenInstance(e.currentTarget.value)} />
      <button onClick={connectHandler} disabled={isInitialized}>connect</button>
      <button onClick={disconnectHandler} disabled={!isInitialized}>disconnect</button>
    </section>

    <section style={{ marginTop: '16px' }}>
      <p>Исходящий звонок</p>
      <input placeholder={'Номер телефона'} disabled={!isInitialized} value={phoneNumber} onChange={(e) => setPhoneNumber(e.currentTarget.value)} />
      <button onClick={startCallHandler} disabled={!isInitialized}>позвонить</button>
    </section>

    <section>
      <p>Входящий звонок</p>
      <button onClick={acceptCallHandler} disabled={!isInitialized}>ответить</button>
      <button onClick={rejectCallHandler} disabled={!isInitialized}>отклонить</button>
    </section>

    <section>
      <p>Текущий звонок</p>
      <button onClick={endCallHandler} disabled={!isInitialized}>сбросить</button>
    </section>

    <section style={{ marginTop: '16px' }}>
      {
        remoteMediaStream &&
          <audio
            ref={(instance) => {
              if (instance) {
                instance.srcObject = remoteMediaStream;
              }
            }}
            autoPlay
            playsInline
            muted={false}
            style={{
              filter: 'blur(30px)',
            }}
          />
      }
    </section>

  </div>
  );
};


export default App;
