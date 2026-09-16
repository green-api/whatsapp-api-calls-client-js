import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

import { installNetworkLogging } from './network-log.js';

const $ = (id) => document.getElementById(id);
const logEl = $('log');

const CONNECTION_STORAGE_KEY = 'gaVoipDemo:connection';

function loadSavedConnection() {
  try {
    const raw = localStorage.getItem(CONNECTION_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (typeof saved.apiUrl === 'string') $('apiUrl').value = saved.apiUrl;
    if (typeof saved.idInstance === 'string') $('idInstance').value = saved.idInstance;
    if (typeof saved.apiTokenInstance === 'string') {
      $('apiTokenInstance').value = saved.apiTokenInstance;
    }
  } catch {
    // localStorage is unavailable or the data is broken — just leave the fields empty
  }
}

function saveConnection() {
  try {
    localStorage.setItem(
      CONNECTION_STORAGE_KEY,
      JSON.stringify({
        apiUrl: $('apiUrl').value,
        idInstance: $('idInstance').value,
        apiTokenInstance: $('apiTokenInstance').value,
      }),
    );
  } catch {
    // localStorage is unavailable — just do not save
  }
}

loadSavedConnection();

function log(...args) {
  const line = `[${new Date().toISOString().slice(11, 23)}] ${args
    .map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
    .join(' ')}`;
  logEl.textContent += `${line}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

let redactToken = '';
installNetworkLogging(log, () => redactToken);

function show(el, visible) {
  el.style.display = visible ? '' : 'none';
}

const connectFieldset = $('connectFieldset');
const stateFieldset = $('stateFieldset');
const stateSpan = $('state');
const dialFieldset = $('dialFieldset');
const dialTargetInput = $('dialTarget');
const incomingFieldset = $('incomingFieldset');
const incomingCallInfo = $('incomingCallInfo');
const activeCallFieldset = $('activeCallFieldset');
const connectMediaButton = $('connectMediaButton');
const remoteAudio = $('remoteAudio');

let client = null;
let calls = null;

// Each block is shown only for the states it belongs to. The state comes from
// CallsConnection.state, which the server sends on connect and on every change
// (see the protocol spec, §3/§8).
function render(kind) {
  show(dialFieldset, kind === 'idle');
  show(incomingFieldset, kind === 'inc-call');
  show(activeCallFieldset, kind === 'inc-call' || kind === 'out-call' || kind === 'on-call');
}

// The call is already running on the server (out-call/on-call) but this tab has no
// WebRTC bridge: either the page was reloaded mid-call, or the socket is restoring
// itself (see calls-connection.ts) and the button is not needed.
// Not shown for inc-call — "Accept" is already there.
function refreshConnectMediaButton() {
  const kind = calls?.state?.state;
  const needsManualConnect = (kind === 'out-call' || kind === 'on-call') && !calls.hasAudioBridge;
  show(connectMediaButton, needsManualConnect);
}

function resetUi() {
  connectFieldset.disabled = false;
  show(stateFieldset, false);
  show(dialFieldset, false);
  show(incomingFieldset, false);
  show(activeCallFieldset, false);
  show(connectMediaButton, false);
  stateSpan.textContent = '-';
  stateSpan.classList.remove('incoming');
  incomingCallInfo.textContent = '';
  remoteAudio.srcObject = null;
}

$('connectButton').addEventListener('click', () => {
  saveConnection();
  redactToken = $('apiTokenInstance').value;

  client = new GreenApiVoipClient({
    apiUrl: $('apiUrl').value,
    idInstance: $('idInstance').value,
    apiTokenInstance: $('apiTokenInstance').value,
  });

  connectFieldset.disabled = true;
  show(stateFieldset, true);

  calls = client.connectCalls();
  calls.addEventListener('connect', () => log('ℹ️ calls: connect'));
  calls.addEventListener('disconnect', (event) => {
    if (event.detail.permanent) {
      log('⛔ the server refused:', event.detail.reason, `(code ${event.detail.code})`);
      log('ℹ️ there will be no reconnect — calls are unavailable for this instance');

      return;
    }

    log('ℹ️ calls: disconnect', event.detail.reason);
  });
  calls.addEventListener('error', (event) => log('⚠️ calls error:', event.detail.message));

  calls.addEventListener('state', (event) => {
    const kind = event.detail.state;
    stateSpan.textContent = kind;
    stateSpan.classList.toggle('incoming', kind === 'inc-call');
    log('ℹ️ state:', event.detail);
    render(kind);
    refreshConnectMediaButton();
  });

  calls.addEventListener('incoming-call', (event) => {
    const info = event.detail;
    incomingCallInfo.textContent = `${info.name} (${info.wid})`;
  });

  calls.addEventListener('end-call', (event) => {
    const { reason, cause } = event.detail;
    log('ℹ️ end-call:', cause ? `${reason} (${cause})` : reason);
    incomingCallInfo.textContent = '';
    remoteAudio.srcObject = null;
  });

  calls.addEventListener('local-stream-ready', () => log('ℹ️ local-stream-ready'));
  calls.addEventListener('remote-stream-ready', (event) => {
    remoteAudio.srcObject = event.detail;
    remoteAudio.play().catch(() => {});
    refreshConnectMediaButton();
  });
});

$('resetButton').addEventListener('click', () => {
  calls?.close();
  client = null;
  calls = null;
  resetUi();
});

// The order is "signalling first, bridge second", and it is not arbitrary: the browser
// leg on the server belongs to a call, and an offer without a call is refused ("no active
// call"). The bridge, in turn, counts as up only once the answer arrives, so
// "bridge, then dial" would wait for an answer that comes only after the dial — and would
// wait forever. For accept the call already exists (inc-call), but the order is kept the
// same so the example teaches one practice rather than two.
// A failed bridge does not cancel the call: the server keeps it, and the
// "Join the call audio" button raises the bridge again.
async function thenAudioBridge(action, actionErrorPrefix) {
  try {
    await action();
  } catch (error) {
    log(`⚠️ ${actionErrorPrefix}:`, error.message);
    return;
  }
  try {
    await calls.startAudioBridge();
  } catch (error) {
    log('⚠️ startAudioBridge error:', error.message);
  }
}

$('dialButton').addEventListener('click', () => {
  thenAudioBridge(() => client.dial(dialTargetInput.value), 'dial error');
});

$('acceptButton').addEventListener('click', () => {
  thenAudioBridge(() => client.accept(), 'accept error');
});

// The call is already running on the server (the page was reloaded mid-conversation, say)
// and this tab has no WebRTC bridge yet — so just raise the bridge, without dial/accept
// (the call is active anyway).
connectMediaButton.addEventListener('click', async () => {
  connectMediaButton.disabled = true;
  try {
    await calls.startAudioBridge();
    log('ℹ️ audio bridge: joined manually');
  } catch (error) {
    log('⚠️ connectMedia error:', error.message);
  } finally {
    connectMediaButton.disabled = false;
    refreshConnectMediaButton();
  }
});

$('rejectButton').addEventListener('click', () => {
  client.reject().catch((error) => log('⚠️ reject error:', error.message));
});

$('hangUpButton').addEventListener('click', () => {
  client.hangUp().catch((error) => log('⚠️ hangUp error:', error.message));
});

$('clearLogButton').addEventListener('click', () => {
  logEl.textContent = '';
});
