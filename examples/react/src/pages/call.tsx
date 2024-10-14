import { FC, useEffect } from 'react';

import { Button, Flex, Space, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Actions, CallStatePayload } from 'common';
import CountUpTimer from 'components/count-up-timer';
import StreamVisualizer from 'components/stream-visualizer';
import { LOCAL_VIDEO, useVoip } from 'hooks/useVoip';
import { Routes } from 'router/routes';
import 'styles/pages/call.css';
import { generateCssLayout } from 'utils';
import { voipClient } from 'voip';

const Call: FC = () => {
  const navigate = useNavigate();
  const { clients, provideMediaRef, remoteMediaStream, localMediaStream } = useVoip();
  const videoLayout = generateCssLayout(clients.length);

  useEffect(() => {
    const endCallHandler = (event: CustomEvent<CallStatePayload>) => {
      const payload = event.detail;

      if (!payload?.info) {
        return;
      }

      const participant = payload?.info?.participants?.find((participant) => !participant.is_self);

      navigate(Routes.CONTACTS);
      notification.info({
        message: 'Звонок завершён!',
        description: `${participant?.jid.user || 'Неизвестный номер'}`,
        duration: 4,
      });
    };

    voipClient.addEventListener(Actions.END_CALL, endCallHandler);

    return () => {
      voipClient.removeEventListener(Actions.END_CALL, endCallHandler);
    };
  }, []);

  const onClickEndCall = () => {
    navigate(Routes.CONTACTS);
    notification.info({
      message: 'Звонок завершён!',
      description: '',
      duration: 4,
    });
  };

  return (
    <div>
      <div className="container">
        {clients.map((clientID, index) => {
          return (
            <div key={clientID} style={videoLayout[index]} id={clientID}>
              <div className="media-wrapper">
                <video
                  width="100%"
                  height="100%"
                  ref={(instance) => {
                    provideMediaRef(clientID, instance);
                  }}
                  autoPlay
                  playsInline
                  muted={clientID === LOCAL_VIDEO}
                  style={{
                    filter: 'blur(30px)',
                  }}
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
