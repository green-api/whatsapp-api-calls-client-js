var j = (c, n, t) => {
  if (!n.has(c))
    throw TypeError("Cannot " + t);
};
var e = (c, n, t) => (j(c, n, "read from private field"), t ? t.call(c) : n.get(c)), r = (c, n, t) => {
  if (n.has(c))
    throw TypeError("Cannot add the same private member more than once");
  n instanceof WeakSet ? n.add(c) : n.set(c, t);
}, s = (c, n, t, i) => (j(c, n, "write to private field"), i ? i.call(c, t) : n.set(c, t), t);
var o = (c, n, t) => (j(c, n, "access private method"), t);
var _, p, L, T, A, C, M, G, P, W;
class Y extends EventTarget {
  constructor(t) {
    super();
    r(this, M);
    r(this, P);
    r(this, _, void 0);
    r(this, p, null);
    r(this, L, !1);
    r(this, T, !1);
    r(this, A, 500);
    r(this, C, null);
    s(this, _, t), o(this, M, G).call(this);
  }
  send(t) {
    var i;
    if (((i = e(this, p)) == null ? void 0 : i.readyState) !== WebSocket.OPEN)
      throw new Error("ReconnectingSocket is not connected");
    e(this, p).send(JSON.stringify(t));
  }
  /** The server refused: the socket is closed and will not reconnect until a new one is made. */
  get refused() {
    return e(this, T);
  }
  close() {
    var t;
    s(this, L, !0), e(this, C) !== null && (clearTimeout(e(this, C)), s(this, C, null)), (t = e(this, p)) == null || t.close(), s(this, p, null);
  }
}
_ = new WeakMap(), p = new WeakMap(), L = new WeakMap(), T = new WeakMap(), A = new WeakMap(), C = new WeakMap(), M = new WeakSet(), G = function() {
  const t = new WebSocket(e(this, _));
  s(this, p, t), t.addEventListener("open", () => {
    s(this, A, 500), this.dispatchEvent(new CustomEvent("connect"));
  }), t.addEventListener("message", (i) => {
    let a;
    try {
      a = JSON.parse(i.data);
    } catch {
      return;
    }
    this.dispatchEvent(new CustomEvent("message", { detail: a }));
  }), t.addEventListener("close", (i) => {
    if (e(this, p) !== t || (s(this, p, null), e(this, L)))
      return;
    const a = i.code >= 4e3 && i.code <= 4999;
    s(this, T, e(this, T) || a), this.dispatchEvent(
      new CustomEvent("disconnect", {
        detail: {
          reason: i.reason || "connection closed",
          code: i.code,
          permanent: a
        }
      })
    ), !a && o(this, P, W).call(this);
  }), t.addEventListener("error", () => {
    t.close();
  });
}, P = new WeakSet(), W = function() {
  const t = e(this, A);
  s(this, A, Math.min(e(this, A) * 2, 1e4)), s(this, C, setTimeout(() => {
    s(this, C, null), o(this, M, G).call(this);
  }, t));
};
const Z = /* @__PURE__ */ new Set(["inc-call", "out-call", "on-call"]);
function F(c) {
  return Z.has(c);
}
var k, u, w, h, y, S, I, l, f, N, $, X, g, m, b, q, K, H, x, V, D, z;
class tt extends EventTarget {
  constructor(t) {
    super();
    r(this, $);
    r(this, g);
    r(this, b);
    r(this, K);
    r(this, x);
    r(this, D);
    r(this, k, void 0);
    r(this, u, void 0);
    r(this, w, null);
    r(this, h, null);
    r(this, y, null);
    r(this, S, []);
    r(this, I, !1);
    r(this, l, null);
    // The bridge was up when the socket dropped: on reconnect, if the call is still running
    // on the server, WebRTC has to be re-established by us.
    r(this, f, !1);
    /** The error frame has already told the listener why the server is closing the socket. */
    r(this, N, !1);
    s(this, k, t), s(this, u, new Y(t.buildWsUrl("callsRtc"))), e(this, u).addEventListener("connect", () => this.dispatchEvent(new CustomEvent("connect"))), e(this, u).addEventListener(
      "disconnect",
      (i) => o(this, D, z).call(this, i.detail.reason, i.detail.code, i.detail.permanent)
    ), e(this, u).addEventListener(
      "message",
      (i) => void o(this, b, q).call(this, i.detail)
    );
  }
  get state() {
    return e(this, w);
  }
  /** Whether a WebRTC bridge is up right now (not merely an active call on the server). */
  get hasAudioBridge() {
    return e(this, h) !== null;
  }
  startAudioBridge() {
    return e(this, h) || e(this, l) ? Promise.reject(new Error("Audio bridge already starting or active")) : new Promise((t, i) => {
      s(this, l, { resolve: t, reject: i }), o(this, $, X).call(this).catch((a) => {
        e(this, l) && (s(this, l, null), o(this, g, m).call(this, !1), i(a instanceof Error ? a : new Error(String(a))));
      });
    });
  }
  async stopAudioBridge() {
    s(this, f, !1), o(this, g, m).call(this, !0);
  }
  close() {
    s(this, f, !1), o(this, g, m).call(this, !1), e(this, u).close();
  }
}
k = new WeakMap(), u = new WeakMap(), w = new WeakMap(), h = new WeakMap(), y = new WeakMap(), S = new WeakMap(), I = new WeakMap(), l = new WeakMap(), f = new WeakMap(), N = new WeakMap(), $ = new WeakSet(), X = async function() {
  const t = await navigator.mediaDevices.getUserMedia({ audio: !0 });
  s(this, y, t), this.dispatchEvent(new CustomEvent("local-stream-ready", { detail: t }));
  const i = await e(this, k).get("callsGetIceServers"), a = new RTCPeerConnection({ iceServers: i });
  s(this, h, a), s(this, I, !1), s(this, S, []);
  for (const v of t.getTracks())
    a.addTrack(v, t);
  a.addEventListener("icecandidate", (v) => {
    v.candidate && e(this, u).send({ type: "ice-candidate", candidate: v.candidate.toJSON() });
  }), a.addEventListener("track", (v) => {
    this.dispatchEvent(new CustomEvent("remote-stream-ready", { detail: v.streams[0] }));
  });
  const d = await a.createOffer();
  await a.setLocalDescription(d), e(this, u).send({ type: "offer", offer: d });
}, g = new WeakSet(), m = function(t) {
  var i, a;
  t && e(this, h) && e(this, u).send({ type: "stop" }), (i = e(this, h)) == null || i.close(), s(this, h, null), (a = e(this, y)) == null || a.getTracks().forEach((d) => d.stop()), s(this, y, null), s(this, S, []), s(this, I, !1);
}, b = new WeakSet(), q = async function(t) {
  var i, a;
  switch (t.type) {
    case "state":
      o(this, K, H).call(this, t.state);
      return;
    case "answer": {
      if (!e(this, h))
        return;
      await e(this, h).setRemoteDescription(t.answer), s(this, I, !0);
      for (const d of e(this, S))
        await e(this, h).addIceCandidate(d);
      s(this, S, []), (i = e(this, l)) == null || i.resolve(), s(this, l, null);
      return;
    }
    case "ice-candidate":
      e(this, I) ? await ((a = e(this, h)) == null ? void 0 : a.addIceCandidate(t.candidate)) : e(this, S).push(t.candidate);
      return;
    case "error": {
      if (e(this, l)) {
        const d = e(this, l);
        s(this, l, null), o(this, g, m).call(this, !1), d.reject(new Error(t.message));
        return;
      }
      s(this, N, !0), this.dispatchEvent(new CustomEvent("error", { detail: { message: t.message } }));
      return;
    }
  }
}, K = new WeakSet(), H = function(t) {
  var a;
  const i = (a = e(this, w)) == null ? void 0 : a.state;
  if (s(this, w, t), this.dispatchEvent(new CustomEvent("state", { detail: t })), t.state === "inc-call" && i !== "inc-call" && t.info) {
    this.dispatchEvent(new CustomEvent("incoming-call", { detail: t.info }));
    return;
  }
  if (i && F(i) && !F(t.state)) {
    s(this, f, !1), o(this, g, m).call(this, !0), this.dispatchEvent(
      new CustomEvent("end-call", {
        detail: t.reason ? { reason: "call-ended", cause: t.reason } : { reason: "call-ended" }
      })
    );
    return;
  }
  e(this, f) && F(t.state) && !e(this, h) && !e(this, l) && (s(this, f, !1), o(this, x, V).call(this));
}, x = new WeakSet(), V = async function() {
  try {
    await this.startAudioBridge();
  } catch (t) {
    this.dispatchEvent(
      new CustomEvent("error", {
        detail: { message: t instanceof Error ? t.message : String(t) }
      })
    );
  }
}, D = new WeakSet(), z = function(t, i, a) {
  var v;
  const d = (v = e(this, w)) == null ? void 0 : v.state;
  if (d && F(d)) {
    if (s(this, f, e(this, h) !== null), e(this, l)) {
      const Q = e(this, l);
      s(this, l, null), Q.reject(new Error("Socket disconnected during negotiation"));
    }
    o(this, g, m).call(this, !1), a && s(this, f, !1), e(this, f) || (s(this, w, null), this.dispatchEvent(new CustomEvent("end-call", { detail: { reason: "connection-lost" } })));
  } else
    s(this, w, null);
  a && !e(this, N) && this.dispatchEvent(new CustomEvent("error", { detail: { message: t } })), s(this, N, !1), this.dispatchEvent(new CustomEvent("disconnect", { detail: { reason: t, code: i, permanent: a } }));
};
var O, B, R, U, J;
class et {
  constructor(n) {
    r(this, U);
    r(this, O, void 0);
    r(this, B, void 0);
    r(this, R, void 0);
    s(this, O, n.idInstance), s(this, B, n.apiTokenInstance), s(this, R, n.apiUrl.replace(/\/+$/, ""));
  }
  buildUrl(n) {
    return `${e(this, R)}/waInstance${e(this, O)}/${n}/${e(this, B)}`;
  }
  buildWsUrl(n) {
    return this.buildUrl(n).replace(/^http/, "ws");
  }
  get(n) {
    return o(this, U, J).call(this, n, { method: "GET" });
  }
  post(n, t) {
    return o(this, U, J).call(this, n, {
      method: "POST",
      headers: t !== void 0 ? { "Content-Type": "application/json" } : void 0,
      body: t !== void 0 ? JSON.stringify(t) : void 0
    });
  }
}
O = new WeakMap(), B = new WeakMap(), R = new WeakMap(), U = new WeakSet(), J = async function(n, t) {
  const i = await fetch(this.buildUrl(n), t);
  if (!i.ok) {
    const d = await i.text().catch(() => "");
    throw new Error(`${n} failed: ${i.status} ${d}`);
  }
  if (i.status === 204)
    return;
  const a = await i.text();
  if (a)
    return JSON.parse(a);
};
function st(c) {
  return c.includes("@") ? c : `${c}@c.us`;
}
var E;
class nt {
  constructor(n) {
    r(this, E, void 0);
    s(this, E, new et(n));
  }
  getCallState() {
    return e(this, E).get("callsState");
  }
  getIceServers() {
    return e(this, E).get("callsGetIceServers");
  }
  async dial(n) {
    await e(this, E).post("callsDial", { chatId: st(n) });
  }
  async accept() {
    await e(this, E).post("callsAccept");
  }
  async reject() {
    await e(this, E).post("callsReject");
  }
  async hangUp() {
    await e(this, E).post("callsHangUp");
  }
  connectCalls() {
    return new tt(e(this, E));
  }
}
E = new WeakMap();
export {
  tt as CallsConnection,
  nt as GreenApiVoipClient
};
