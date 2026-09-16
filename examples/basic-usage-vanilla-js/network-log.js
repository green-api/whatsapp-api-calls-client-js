function redact(text, token) {
  if (!token) return text;
  return text.split(token).join('***');
}

function bodyToText(body) {
  if (body === undefined || body === null) return '';
  if (typeof body === 'string') return body;
  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}

function patchFetch(logFn, getRedactToken) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function patchedFetch(input, init) {
    const method = (init && init.method ? init.method : 'GET').toUpperCase();
    const url = typeof input === 'string' ? input : input.url;
    const token = getRedactToken();
    const requestBody = init && init.body !== undefined ? ` ${bodyToText(init.body)}` : '';
    logFn(`🌐➡️ ${method} ${redact(url + requestBody, token)}`);
    try {
      const response = await nativeFetch(input, init);
      response
        .clone()
        .text()
        .then((text) => {
          const suffix = text ? ` ${text}` : '';
          logFn(`🌐⬅️ ${response.status} ${method} ${redact(url + suffix, getRedactToken())}`);
        })
        .catch(() => {});
      return response;
    } catch (error) {
      logFn(`🌐❌ ${method} ${redact(url, getRedactToken())} error=${error.message}`);
      throw error;
    }
  };
}

function patchWebSocket(logFn, getRedactToken) {
  const NativeWebSocket = window.WebSocket;

  class LoggingWebSocket extends NativeWebSocket {
    constructor(url, protocols) {
      super(url, protocols);
      const redactedUrl = () => redact(String(url), getRedactToken());
      this.addEventListener('open', () => logFn(`🔌🟢 connect ${redactedUrl()}`));
      this.addEventListener('close', (event) =>
        logFn(`🔌🔴 disconnect ${redactedUrl()} code=${event.code} reason=${event.reason}`),
      );
      this.addEventListener('error', () => logFn(`🔌⚠️ error ${redactedUrl()}`));
      this.addEventListener('message', (event) =>
        logFn(`🔌⬅️ ${redact(String(event.data), getRedactToken())}`),
      );
    }

    send(data) {
      logFn(`🔌➡️ ${redact(String(data), getRedactToken())}`);
      super.send(data);
    }
  }

  window.WebSocket = LoggingWebSocket;
}

export function installNetworkLogging(logFn, getRedactToken) {
  patchFetch(logFn, getRedactToken);
  patchWebSocket(logFn, getRedactToken);
}
