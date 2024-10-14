import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

const voipClient = new GreenApiVoipClient();

const audioElement = document.createElement('audio');

async function run() {
  voipClient.addEventListener("local-stream-ready", (...args) => console.log("local-stream-ready", ...args));
  voipClient.addEventListener("remote-stream-ready", (...args) => {
    console.log("remote-stream-ready", ...args);
    audioElement.srcObject = args[0].detail;
    audioElement.play();
  });
  voipClient.addEventListener("end-call", (...args) => {
    console.log("end-call", ...args);
    audioElement.srcObject = null;
    audioElement.pause();
  });
  voipClient.addEventListener("call-state", (...args) => console.log("call-state", ...args));
  voipClient.addEventListener("incoming-call", (...args) => console.log("incoming-call", ...args));
}

run();

const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const startCallButton = document.getElementById('startCallButton');
const endCallButton = document.getElementById('endCallButton');
const phoneNumberInput = document.getElementById('phoneNumber');

let isInitialized = false;

connectButton.addEventListener('click', async () => {
  const idInstance = document.getElementById('idInstance').value;
  const apiTokenInstance = document.getElementById('apiTokenInstance').value;

  await voipClient.init({
    idInstance: idInstance,
    apiTokenInstance: apiTokenInstance
  });

  isInitialized = true;
  phoneNumberInput.disabled = false;
  startCallButton.disabled = false;
  disconnectButton.disabled = false;
  connectButton.disabled = true;
  endCallButton.disabled = false;
});

disconnectButton.addEventListener('click', async () => {
  voipClient.destroy();
  isInitialized = false;
  phoneNumberInput.disabled = true;
  startCallButton.disabled = true;
  disconnectButton.disabled = true;
  connectButton.disabled = false;
  endCallButton.disabled = true;
});

startCallButton.addEventListener('click', async () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  await voipClient.startCall(parseInt(phoneNumber), true, false);
});

endCallButton.addEventListener('click', async () => {
  const ended = await voipClient.endCall();
  console.log(`endCall result: ${ended}`);
});

//#region incoming-call
const incomingCallPortal = document.getElementById('incoming-call-portal');
const incomingCallPhone = document.getElementById('incoming-call-phone');
const acceptCallButton = document.getElementById('acceptCallButton');
const rejectCallButton = document.getElementById('rejectCallButton');

let incomingCallTimeout = null;

voipClient.addEventListener("incoming-call", (event) => {
  incomingCallPhone.textContent = event.detail.info.wid.user;
  incomingCallPortal.style.display = 'flex';

  incomingCallTimeout = setTimeout(() => {
    incomingCallPortal.style.display = 'none';
  }, event.detail.timeout * 1000);
});

acceptCallButton.addEventListener('click', async () => {
  if (incomingCallTimeout !== null) {
    clearTimeout(incomingCallTimeout);
    incomingCallPortal.style.display = 'none';
  }

  const accepted = await voipClient.acceptCall();
  console.log(`acceptCall result: ${accepted}`);
});

rejectCallButton.addEventListener('click', async () => {
  if (incomingCallTimeout !== null) {
    clearTimeout(incomingCallTimeout);
    incomingCallPortal.style.display = 'none';
  }

  const rejected = await voipClient.rejectCall();
  console.log(`rejectCall result: ${rejected}`);
});

//#endregion