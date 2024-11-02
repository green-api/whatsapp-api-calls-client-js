import { useCallback, useEffect, useRef } from 'react';

import useStateWithCallback from './useStateWithCallback';
import { voipClient } from 'voip';

export const LOCAL_VIDEO = 'LOCAL_VIDEO';
export const REMOTE_VIDEO = 'REMOTE_VIDEO';

export const useVoip = () => {
  const [clients, updateClients] = useStateWithCallback<string[]>([]);
  const peerMediaElements = useRef<Record<string, HTMLVideoElement | HTMLAudioElement | null>>({
    [LOCAL_VIDEO]: null,
    [REMOTE_VIDEO]: null,
  });

  const remoteMediaStream = useRef<MediaStream | null>(null);
  const localMediaStream = useRef<MediaStream | null>(null);

  const addNewClient = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (newClient: string, cb: Function) => {
      updateClients((list: string[]) => {
        if (!list.includes(newClient)) {
          return [...list, newClient];
        }

        return list;
      }, cb);
    },
    [updateClients]
  );

  useEffect(() => {
    const onLocalStreamReady = (event: CustomEvent<MediaStream>) => {
      localMediaStream.current = event.detail;

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

        if (localVideoElement) {
          localVideoElement.volume = 0;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    };

    const onRemoteStreamReady = (event: CustomEvent<MediaStream>) => {
      remoteMediaStream.current = event.detail;

      addNewClient(REMOTE_VIDEO, () => {
        peerMediaElements.current[REMOTE_VIDEO]!.srcObject = event.detail;
      });
    };

    voipClient.addEventListener('local-stream-ready', onLocalStreamReady);
    voipClient.addEventListener('remote-stream-ready', onRemoteStreamReady);

    return () => {
      voipClient.removeEventListener('local-stream-ready', onLocalStreamReady);
      voipClient.removeEventListener('remote-stream-ready', onRemoteStreamReady);
    };
  }, []);

  const provideMediaRef = useCallback(
    (id: string, node: HTMLVideoElement | HTMLAudioElement | null) => {
      peerMediaElements.current[id] = node;
    },
    []
  );

  return {
    clients,
    localMediaStream,
    remoteMediaStream,
    provideMediaRef,
  };
};
