export declare interface CallInfo {
    id: string;
    wid: string;
    name: string;
}

export declare interface CallsConnection extends EventTarget {
    addEventListener<K extends keyof CallsConnectionEventMap>(type: K, listener: (this: CallsConnection, ev: CallsConnectionEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CallsConnectionEventMap>(type: K, listener: (this: CallsConnection, ev: CallsConnectionEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export declare class CallsConnection extends EventTarget {
    #private;
    constructor(rest: GreenApiRestClient);
    get state(): CallState | null;
    /** Whether a WebRTC bridge is up right now (not merely an active call on the server). */
    get hasAudioBridge(): boolean;
    startAudioBridge(): Promise<void>;
    stopAudioBridge(): Promise<void>;
    close(): void;
}

export declare interface CallsConnectionEventMap {
    connect: CustomEvent<undefined>;
    /**
     * `permanent` means the server refused rather than the link dropping: calls are not in
     * the instance's plan, or they are switched off on the node. There will be no reconnect,
     * and this connection can no longer place calls — make a new one.
     */
    disconnect: CustomEvent<{
        reason: string;
        code?: number;
        permanent?: boolean;
    }>;
    state: CustomEvent<CallState>;
    'incoming-call': CustomEvent<CallInfo>;
    /**
     * `reason` says whose decision it was: `call-ended` — the server ended the call (the
     * peer, a timeout, another device); `connection-lost` — our own socket dropped.
     * `cause` is the server's word from the `idle` frame (see `CallState.reason`) when there
     * was one: `accepted_elsewhere`, `hangup`, `timeout`… It is absent on `connection-lost`.
     */
    'end-call': CustomEvent<{
        reason: 'call-ended' | 'connection-lost';
        cause?: string;
    }>;
    'local-stream-ready': CustomEvent<MediaStream>;
    'remote-stream-ready': CustomEvent<MediaStream>;
    error: CustomEvent<{
        message: string;
    }>;
}

export declare interface CallState {
    state: CallStateKind;
    info?: CallInfo;
    /**
     * Why the call ended. Present only on the frame that moves the call to `idle`, and
     * only when the server named a reason. The server's own word, verbatim: `hangup`,
     * `timeout`, `accepted_elsewhere` (answered on another device of the same account),
     * `rejected_elsewhere`, `no-media`, `connect-timeout`, `instance-gone`,
     * `rejected:<reason>`… The vocabulary is open-ended, so show a word you do not
     * recognise as it came.
     */
    reason?: string;
}

export declare type CallStateKind = 'idle' | 'inc-call' | 'out-call' | 'on-call';

declare class GreenApiRestClient {
    #private;
    constructor(options: {
        idInstance: string;
        apiTokenInstance: string;
        apiUrl: string;
    });
    buildUrl(method: string): string;
    buildWsUrl(method: string): string;
    get<T>(method: string): Promise<T>;
    post<T = void>(method: string, body?: unknown): Promise<T>;
}

export declare class GreenApiVoipClient {
    #private;
    constructor(options: GreenApiVoipClientOptions);
    getCallState(): Promise<CallState>;
    getIceServers(): Promise<RTCIceServer[]>;
    dial(target: string): Promise<void>;
    accept(): Promise<void>;
    reject(): Promise<void>;
    hangUp(): Promise<void>;
    connectCalls(): CallsConnection;
}

export declare interface GreenApiVoipClientOptions {
    idInstance: string;
    apiTokenInstance: string;
    apiUrl: string;
}

export { }


declare global {
    var __WA_LOG_DEBUG: boolean | undefined;
}

