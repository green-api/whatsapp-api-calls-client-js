import { API_URL, GreenApiVoipClientInitOptions } from 'common';

export const call = async (phoneNumber: number, options: GreenApiVoipClientInitOptions) => {
  const { idInstance, apiTokenInstance } = options;

  const url = `${API_URL}waInstance${idInstance}/call/${apiTokenInstance}`;

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
    headers: {
      'Content-Type': 'application/json',
    }
  });
};
