class c extends EventTarget {
  #s;
  #t = null;
  #n = !1;
  #e = !1;
  #r = 500;
  #a = null;
  constructor(t) {
    super(), this.#s = t, this.#o();
  }
  send(t) {
    if (this.#t?.readyState !== WebSocket.OPEN)
      throw new Error("ReconnectingSocket is not connected");
    this.#t.send(JSON.stringify(t));
  }
  /** The server refused: the socket is closed and will not reconnect until a new one is made. */
  get refused() {
    return this.#e;
  }
  close() {
    this.#n = !0, this.#a !== null && (clearTimeout(this.#a), this.#a = null), this.#t?.close(), this.#t = null;
  }
  #o() {
    const t = new WebSocket(this.#s);
    this.#t = t, t.addEventListener("open", () => {
      this.#r = 500, this.dispatchEvent(new CustomEvent("connect"));
    }), t.addEventListener("message", (e) => {
      let s;
      try {
        s = JSON.parse(e.data);
      } catch {
        return;
      }
      this.dispatchEvent(new CustomEvent("message", { detail: s }));
    }), t.addEventListener("close", (e) => {
      if (this.#t !== t || (this.#t = null, this.#n)) return;
      const s = e.code >= 4e3 && e.code <= 4999;
      this.#e = this.#e || s, this.dispatchEvent(
        new CustomEvent("disconnect", {
          detail: {
            reason: e.reason || "connection closed",
            code: e.code,
            permanent: s
          }
        })
      ), !s && this.#i();
    }), t.addEventListener("error", () => {
      t.close();
    });
  }
  #i() {
    const t = this.#r;
    this.#r = Math.min(this.#r * 2, 1e4), this.#a = setTimeout(() => {
      this.#a = null, this.#o();
    }, t);
  }
}
const o = /* @__PURE__ */ new Set(["inc-call", "out-call", "on-call"]);
function r(n) {
  return o.has(n);
}
class l extends EventTarget {
  #s;
  #t;
  #n = null;
  #e = null;
  #r = null;
  #a = [];
  #o = !1;
  #i = null;
  // The bridge was up when the socket dropped: on reconnect, if the call is still running
  // on the server, WebRTC has to be re-established by us.
  #c = !1;
  /** The error frame has already told the listener why the server is closing the socket. */
  #h = !1;
  constructor(t) {
    super(), this.#s = t, this.#t = new c(t.buildWsUrl("callsRtc")), this.#t.addEventListener("connect", () => this.dispatchEvent(new CustomEvent("connect"))), this.#t.addEventListener(
      "disconnect",
      (e) => this.#p(e.detail.reason, e.detail.code, e.detail.permanent)
    ), this.#t.addEventListener(
      "message",
      (e) => {
        this.#u(e.detail);
      }
    );
  }
  get state() {
    return this.#n;
  }
  /** Whether a WebRTC bridge is up right now (not merely an active call on the server). */
  get hasAudioBridge() {
    return this.#e !== null;
  }
  startAudioBridge() {
    return this.#e || this.#i ? Promise.reject(new Error("Audio bridge already starting or active")) : new Promise((t, e) => {
      this.#i = { resolve: t, reject: e }, this.#d().catch((s) => {
        this.#i && (this.#i = null, this.#l(!1), e(s instanceof Error ? s : new Error(String(s))));
      });
    });
  }
  async stopAudioBridge() {
    this.#c = !1, this.#l(!0);
  }
  close() {
    this.#c = !1, this.#l(!1), this.#t.close();
  }
  async #d() {
    const t = await navigator.mediaDevices.getUserMedia({ audio: !0 });
    this.#r = t, this.dispatchEvent(new CustomEvent("local-stream-ready", { detail: t }));
    const e = await this.#s.get("callsGetIceServers"), s = new RTCPeerConnection({ iceServers: e });
    this.#e = s, this.#o = !1, this.#a = [];
    for (const i of t.getTracks())
      s.addTrack(i, t);
    s.addEventListener("icecandidate", (i) => {
      i.candidate && this.#t.send({ type: "ice-candidate", candidate: i.candidate.toJSON() });
    }), s.addEventListener("track", (i) => {
      this.dispatchEvent(new CustomEvent("remote-stream-ready", { detail: i.streams[0] }));
    });
    const a = await s.createOffer();
    await s.setLocalDescription(a), this.#t.send({ type: "offer", offer: a });
  }
  #l(t) {
    t && this.#e && this.#t.send({ type: "stop" }), this.#e?.close(), this.#e = null, this.#r?.getTracks().forEach((e) => e.stop()), this.#r = null, this.#a = [], this.#o = !1;
  }
  async #u(t) {
    switch (t.type) {
      case "state":
        this.#f(t.state);
        return;
      case "answer": {
        if (!this.#e) return;
        await this.#e.setRemoteDescription(t.answer), this.#o = !0;
        for (const e of this.#a)
          await this.#e.addIceCandidate(e);
        this.#a = [], this.#i?.resolve(), this.#i = null;
        return;
      }
      case "ice-candidate":
        this.#o ? await this.#e?.addIceCandidate(t.candidate) : this.#a.push(t.candidate);
        return;
      case "error": {
        if (this.#i) {
          const e = this.#i;
          this.#i = null, this.#l(!1), e.reject(new Error(t.message));
          return;
        }
        this.#h = !0, this.dispatchEvent(new CustomEvent("error", { detail: { message: t.message } }));
        return;
      }
    }
  }
  #f(t) {
    const e = this.#n?.state;
    if (this.#n = t, this.dispatchEvent(new CustomEvent("state", { detail: t })), t.state === "inc-call" && e !== "inc-call" && t.info) {
      this.dispatchEvent(new CustomEvent("incoming-call", { detail: t.info }));
      return;
    }
    if (e && r(e) && !r(t.state)) {
      this.#c = !1, this.#l(!0), this.dispatchEvent(
        new CustomEvent("end-call", {
          detail: t.reason ? { reason: "call-ended", cause: t.reason } : { reason: "call-ended" }
        })
      );
      return;
    }
    this.#c && r(t.state) && !this.#e && !this.#i && (this.#c = !1, this.#E());
  }
  async #E() {
    try {
      await this.startAudioBridge();
    } catch (t) {
      this.dispatchEvent(
        new CustomEvent("error", {
          detail: { message: t instanceof Error ? t.message : String(t) }
        })
      );
    }
  }
  #p(t, e, s) {
    const a = this.#n?.state;
    if (a && r(a)) {
      if (this.#c = this.#e !== null, this.#i) {
        const i = this.#i;
        this.#i = null, i.reject(new Error("Socket disconnected during negotiation"));
      }
      this.#l(!1), s && (this.#c = !1), this.#c || (this.#n = null, this.dispatchEvent(new CustomEvent("end-call", { detail: { reason: "connection-lost" } })));
    } else
      this.#n = null;
    s && !this.#h && this.dispatchEvent(new CustomEvent("error", { detail: { message: t } })), this.#h = !1, this.dispatchEvent(new CustomEvent("disconnect", { detail: { reason: t, code: e, permanent: s } }));
  }
}
class h {
  #s;
  #t;
  #n;
  constructor(t) {
    this.#s = t.idInstance, this.#t = t.apiTokenInstance, this.#n = t.apiUrl.replace(/\/+$/, "");
  }
  buildUrl(t) {
    return `${this.#n}/waInstance${this.#s}/${t}/${this.#t}`;
  }
  buildWsUrl(t) {
    return this.buildUrl(t).replace(/^http/, "ws");
  }
  get(t) {
    return this.#e(t, { method: "GET" });
  }
  post(t, e) {
    return this.#e(t, {
      method: "POST",
      headers: e !== void 0 ? { "Content-Type": "application/json" } : void 0,
      body: e !== void 0 ? JSON.stringify(e) : void 0
    });
  }
  async #e(t, e) {
    const s = await fetch(this.buildUrl(t), e);
    if (!s.ok) {
      const i = await s.text().catch(() => "");
      throw new Error(`${t} failed: ${s.status} ${i}`);
    }
    if (s.status === 204)
      return;
    const a = await s.text();
    if (a)
      return JSON.parse(a);
  }
}
function d(n) {
  return n.includes("@") ? n : `${n}@c.us`;
}
class u {
  #s;
  constructor(t) {
    this.#s = new h(t);
  }
  getCallState() {
    return this.#s.get("callsState");
  }
  getIceServers() {
    return this.#s.get("callsGetIceServers");
  }
  async dial(t) {
    await this.#s.post("callsDial", { chatId: d(t) });
  }
  async accept() {
    await this.#s.post("callsAccept");
  }
  async reject() {
    await this.#s.post("callsReject");
  }
  async hangUp() {
    await this.#s.post("callsHangUp");
  }
  connectCalls() {
    return new l(this.#s);
  }
}
export {
  l as CallsConnection,
  u as GreenApiVoipClient
};
