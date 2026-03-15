import { GreenApiVoipClientInitOptions } from 'common';

export const call = async (phoneNumber: number, options: GreenApiVoipClientInitOptions) => {
  //const { idInstance, apiTokenInstance } = options;

  const url = `${options.apiUrl}/webrtc/ws?idInstance=test-instance-1`;

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
