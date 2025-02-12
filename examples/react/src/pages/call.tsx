import 'styles/pages/call.css';

import { FC, useEffect, useState } from 'react';
import { Button, Flex, notification, Space } from 'antd';
import { Navigate } from 'react-router-dom';
import {EndCallPayload, CallStateEventPayload, WACallState, Actions} from '@green-api/whatsapp-api-calls-client-js';

import {voipClient} from "../voip";

import CountUpTimer from 'components/count-up-timer';
import StreamVisualizer from 'components/stream-visualizer';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { LOCAL_VIDEO, useVoip } from 'hooks/useVoip';
import { Routes } from 'router/routes';
import { selectHasActiveCall } from 'store/slices/call-slice';
import { generateCssLayout } from 'utils';

const Call: FC = () => {
  const { clients, provideMediaRef, remoteMediaStream, localMediaStream } = useVoip();
  const videoLayout = generateCssLayout(clients.length);
  const hasActiveCall = useAppSelector(selectHasActiveCall);

  const { setHasActiveCall } = useActions();

  const [callState, setCallState] = useState('Соединение...');

  useEffect(() => {
    const endCallHandler = (event: CustomEvent<EndCallPayload>) => {
      const payload = event.detail;
      console.log('endCallEvent', payload);

      setHasActiveCall(false);

      notification.info({
        message: 'Звонок завершён!',
        duration: 10,
      });
    };

    const callStateHandler = (event: CustomEvent<CallStateEventPayload>) => {
      console.log(event.detail)
      return;

      switch (event.detail.callState) {
        case WACallState.WACallStateCalling: {
          setCallState('Соединение...');
          break;
        }
        case WACallState.WACallStatePreacceptReceived: {
          setCallState('Идёт дозвон...');
          break;
        }
        case WACallState.WACallStateCallActive: {
          setCallState('Активен');
          break;
        }
      }
    };

    voipClient.addEventListener(Actions.END_CALL, endCallHandler);
    voipClient.addEventListener(Actions.CALL_STATE, callStateHandler);

    return () => {
      voipClient.removeEventListener(Actions.END_CALL, endCallHandler);
      voipClient.removeEventListener(Actions.CALL_STATE, callStateHandler);
    };
  }, []);

  const onClickEndCall = async () => {
    try {
      await voipClient.endCall();
      setHasActiveCall(false);
    } catch (err) {
      notification.error({
        message: 'Произошла ошибка!',
        description: (err as Error).message,
        duration: 10,
      });
    }
  };

  if (!hasActiveCall) {
    return <Navigate to={Routes.MAIN} replace />;
  }

  return (
    <div>
      <div style={{ textAlign: 'center' }}>Статус звонка: {callState}</div>
      <div className="container">
        {clients.map((clientID, index) => {
          return (
            <div key={clientID} style={videoLayout[index]} id={clientID}>
              <div className="media-wrapper">
                <audio
                  ref={(instance) => {
                    if (instance) {
                      provideMediaRef(clientID, instance);
                    }
                  }}
                  autoPlay
                  muted={false}
                />
                <div className="stream-visualizer">
                  {clientID === LOCAL_VIDEO
                    ? localMediaStream.current && (
                        <StreamVisualizer remoteStream={localMediaStream.current} />
                      )
                    : remoteMediaStream.current && (
                        <StreamVisualizer remoteStream={remoteMediaStream.current} />
                      )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Flex gap="small" align="center" vertical>
        <Space
          size={[8, 16]}
          wrap
          style={{
            marginTop: 16,
          }}
        >
          <CountUpTimer />
        </Space>
        <Space
          size={[8, 16]}
          wrap
          style={{
            marginTop: 16,
          }}
        >
          <Button onClick={onClickEndCall} type="primary" shape="round" size="large" danger>
            Завершить вызов
          </Button>
        </Space>
      </Flex>
    </div>
  );
};

export default Call;
