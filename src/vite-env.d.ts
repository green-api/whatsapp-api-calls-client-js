/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RTC_ICE_SERVERS: string;
}

declare module 'freeice';
