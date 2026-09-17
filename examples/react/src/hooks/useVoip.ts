import { useCallback, useEffect, useRef, useState } from 'react';

import { useCallsConnection } from './useCallsConnection';
import { getMediaStreams } from 'voip';

export const LOCAL_VIDEO = 'LOCAL_VIDEO';
export const REMOTE_VIDEO = 'REMOTE_VIDEO';

/**
 * The media of the current call: which streams exist and where to render them.
 *
 * A stream and the element that plays it appear in either order — the bridge is raised
 * before the call screen is on screen, and the elements mount only after this hook adds
 * their ids. So both directions are wired: a stream that arrives for an element already
 * on screen is attached at once, and an element that mounts later picks up the stream it
 * was waiting for. Relying on one direction alone is what leaves a call silent.
 */
export const useVoip = () => {
  const connection = useCallsConnection();
  const [clients, setClients] = useState<string[]>([]);

  const peerMediaElements = useRef<Record<string, HTMLVideoElement | HTMLAudioElement | null>>({
    [LOCAL_VIDEO]: null,
    [REMOTE_VIDEO]: null,
  });

  const remoteMediaStream = useRef<MediaStream | null>(null);
  const localMediaStream = useRef<MediaStream | null>(null);

  const streamOf = useCallback((id: string) => {
    return id === LOCAL_VIDEO ? localMediaStream.current : remoteMediaStream.current;
  }, []);

  /** Puts a stream on its element. Own voice is silenced, or the caller hears themselves. */
  const play = useCallback((id: string, node: HTMLVideoElement | HTMLAudioElement) => {
    const stream = id === LOCAL_VIDEO ? localMediaStream.current : remoteMediaStream.current;

    if (!stream) {
      return;
    }

    if (id === LOCAL_VIDEO) {
      node.volume = 0;
    }

    node.srcObject = stream;
  }, []);

  const attach = useCallback(
    (id: string, stream: MediaStream) => {
      if (id === LOCAL_VIDEO) {
        localMediaStream.current = stream;
      } else {
        remoteMediaStream.current = stream;
      }

      const node = peerMediaElements.current[id];

      if (node) {
        play(id, node);
      }

      // A new array even when the id is already known: after a reconnect the same id carries
      // a different stream, and the components read those streams out of refs during render.
      // Returning the identical array would let React skip the render and leave the meters
      // drawing a stream that has already been stopped.
      setClients((list) => (list.includes(id) ? [...list] : [...list, id]));
    },
    [play]
  );

  useEffect(() => {
    if (!connection) {
      return;
    }

    const onLocalStreamReady = (event: Event) =>
      attach(LOCAL_VIDEO, (event as CustomEvent<MediaStream>).detail);
    const onRemoteStreamReady = (event: Event) =>
      attach(REMOTE_VIDEO, (event as CustomEvent<MediaStream>).detail);

    connection.addEventListener('local-stream-ready', onLocalStreamReady);
    connection.addEventListener('remote-stream-ready', onRemoteStreamReady);

    // Whatever the bridge produced before this screen existed: those events are long gone,
    // so subscribing alone would never bring the audio in.
    const { local, remote } = getMediaStreams();

    if (local) {
      attach(LOCAL_VIDEO, local);
    }

    if (remote) {
      attach(REMOTE_VIDEO, remote);
    }

    return () => {
      connection.removeEventListener('local-stream-ready', onLocalStreamReady);
      connection.removeEventListener('remote-stream-ready', onRemoteStreamReady);
    };
  }, [connection, attach]);

  const provideMediaRef = useCallback(
    (id: string, node: HTMLVideoElement | HTMLAudioElement | null) => {
      peerMediaElements.current[id] = node;

      if (node) {
        play(id, node);
      }
    },
    [play]
  );

  return {
    clients,
    localMediaStream,
    remoteMediaStream,
    provideMediaRef,
    streamOf,
  };
};
