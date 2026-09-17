import { useEffect, useState } from 'react';

import { CallsConnection } from '@green-api/whatsapp-api-calls-client-js';

import { getConnection, onConnectionChange } from 'voip';

/**
 * The current calls connection, re-rendering the component when it is replaced.
 *
 * The connection appears only after authorization and is replaced whenever the credentials
 * change, so a component that subscribes to its events has to know when to resubscribe —
 * listeners left on a closed connection would simply go quiet.
 */
export const useCallsConnection = (): CallsConnection | null => {
  const [connection, setConnection] = useState<CallsConnection | null>(getConnection);

  useEffect(() => onConnectionChange(setConnection), []);

  return connection;
};
