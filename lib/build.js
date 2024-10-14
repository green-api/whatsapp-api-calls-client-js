var ve = Object.defineProperty;
var _e = (s, e, t) => e in s ? ve(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var f = (s, e, t) => (_e(s, typeof e != "symbol" ? e + "" : e, t), t);
function be(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var z = [
  "stun:",
  "turn:"
], Ce = function(s) {
  var e = (s || {}).url || s, t, n, i = {};
  return typeof e != "string" && !(e instanceof String) || (e = e.trim(), t = z[z.indexOf(e.slice(0, 5))], !t) ? s : (e = e.slice(5), n = e.split("@"), i.username = s.username, i.credential = s.credential, n.length > 1 && (e = n[1], n = n[0].split(":"), i.username = n[0], i.credential = (s || {}).credential || n[1] || ""), i.url = t + e, i.urls = [i.url], i);
};
const ke = [
  "stun.l.google.com:19302",
  "stun1.l.google.com:19302",
  "stun2.l.google.com:19302",
  "stun3.l.google.com:19302",
  "stun4.l.google.com:19302",
  "stun.ekiga.net",
  "stun.ideasip.com",
  "stun.schlund.de",
  "stun.stunprotocol.org:3478",
  "stun.voiparound.com",
  "stun.voipbuster.com",
  "stun.voipstunt.com",
  "stun.voxgratia.org"
], Te = [];
var Ae = Ce, Re = function(s) {
  var e = {
    stun: (s || {}).stun || ke,
    turn: (s || {}).turn || Te
  }, t = (s || {}).stunCount || 2, n = (s || {}).turnCount || 0, i;
  function r(o, a) {
    for (var h = [], d = [].concat(e[o]), p; d.length && h.length < a; )
      p = Math.random() * d.length | 0, h = h.concat(d.splice(p, 1));
    return h.map(function(y) {
      return typeof y != "string" && !(y instanceof String) ? y : Ae(o + ":" + y);
    });
  }
  return i = [].concat(r("stun", t)), n && (i = i.concat(r("turn", n))), i;
}, Se = Re;
const Oe = /* @__PURE__ */ be(Se), E = /* @__PURE__ */ Object.create(null);
E.open = "0";
E.close = "1";
E.ping = "2";
E.pong = "3";
E.message = "4";
E.upgrade = "5";
E.noop = "6";
const L = /* @__PURE__ */ Object.create(null);
Object.keys(E).forEach((s) => {
  L[E[s]] = s;
});
const D = { type: "error", data: "parser error" }, oe = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", ae = typeof ArrayBuffer == "function", ce = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s && s.buffer instanceof ArrayBuffer, $ = ({ type: s, data: e }, t, n) => oe && e instanceof Blob ? t ? n(e) : X(e, n) : ae && (e instanceof ArrayBuffer || ce(e)) ? t ? n(e) : X(new Blob([e]), n) : n(E[s] + (e || "")), X = (s, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const n = t.result.split(",")[1];
    e("b" + (n || ""));
  }, t.readAsDataURL(s);
};
function j(s) {
  return s instanceof Uint8Array ? s : s instanceof ArrayBuffer ? new Uint8Array(s) : new Uint8Array(s.buffer, s.byteOffset, s.byteLength);
}
let I;
function Le(s, e) {
  if (oe && s.data instanceof Blob)
    return s.data.arrayBuffer().then(j).then(e);
  if (ae && (s.data instanceof ArrayBuffer || ce(s.data)))
    return e(j(s.data));
  $(s, !1, (t) => {
    I || (I = new TextEncoder()), e(I.encode(t));
  });
}
const G = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", k = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let s = 0; s < G.length; s++)
  k[G.charCodeAt(s)] = s;
const Ne = (s) => {
  let e = s.length * 0.75, t = s.length, n, i = 0, r, o, a, h;
  s[s.length - 1] === "=" && (e--, s[s.length - 2] === "=" && e--);
  const d = new ArrayBuffer(e), p = new Uint8Array(d);
  for (n = 0; n < t; n += 4)
    r = k[s.charCodeAt(n)], o = k[s.charCodeAt(n + 1)], a = k[s.charCodeAt(n + 2)], h = k[s.charCodeAt(n + 3)], p[i++] = r << 2 | o >> 4, p[i++] = (o & 15) << 4 | a >> 2, p[i++] = (a & 3) << 6 | h & 63;
  return d;
}, Be = typeof ArrayBuffer == "function", Y = (s, e) => {
  if (typeof s != "string")
    return {
      type: "message",
      data: he(s, e)
    };
  const t = s.charAt(0);
  return t === "b" ? {
    type: "message",
    data: xe(s.substring(1), e)
  } : L[t] ? s.length > 1 ? {
    type: L[t],
    data: s.substring(1)
  } : {
    type: L[t]
  } : D;
}, xe = (s, e) => {
  if (Be) {
    const t = Ne(s);
    return he(t, e);
  } else
    return { base64: !0, data: s };
}, he = (s, e) => {
  switch (e) {
    case "blob":
      return s instanceof Blob ? s : new Blob([s]);
    case "arraybuffer":
    default:
      return s instanceof ArrayBuffer ? s : s.buffer;
  }
}, le = "", Ie = (s, e) => {
  const t = s.length, n = new Array(t);
  let i = 0;
  s.forEach((r, o) => {
    $(r, !1, (a) => {
      n[o] = a, ++i === t && e(n.join(le));
    });
  });
}, Pe = (s, e) => {
  const t = s.split(le), n = [];
  for (let i = 0; i < t.length; i++) {
    const r = Y(t[i], e);
    if (n.push(r), r.type === "error")
      break;
  }
  return n;
};
function De() {
  return new TransformStream({
    transform(s, e) {
      Le(s, (t) => {
        const n = t.length;
        let i;
        if (n < 126)
          i = new Uint8Array(1), new DataView(i.buffer).setUint8(0, n);
        else if (n < 65536) {
          i = new Uint8Array(3);
          const r = new DataView(i.buffer);
          r.setUint8(0, 126), r.setUint16(1, n);
        } else {
          i = new Uint8Array(9);
          const r = new DataView(i.buffer);
          r.setUint8(0, 127), r.setBigUint64(1, BigInt(n));
        }
        s.data && typeof s.data != "string" && (i[0] |= 128), e.enqueue(i), e.enqueue(t);
      });
    }
  });
}
let P;
function A(s) {
  return s.reduce((e, t) => e + t.length, 0);
}
function R(s, e) {
  if (s[0].length === e)
    return s.shift();
  const t = new Uint8Array(e);
  let n = 0;
  for (let i = 0; i < e; i++)
    t[i] = s[0][n++], n === s[0].length && (s.shift(), n = 0);
  return s.length && n < s[0].length && (s[0] = s[0].slice(n)), t;
}
function Me(s, e) {
  P || (P = new TextDecoder());
  const t = [];
  let n = 0, i = -1, r = !1;
  return new TransformStream({
    transform(o, a) {
      for (t.push(o); ; ) {
        if (n === 0) {
          if (A(t) < 1)
            break;
          const h = R(t, 1);
          r = (h[0] & 128) === 128, i = h[0] & 127, i < 126 ? n = 3 : i === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (A(t) < 2)
            break;
          const h = R(t, 2);
          i = new DataView(h.buffer, h.byteOffset, h.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (A(t) < 8)
            break;
          const h = R(t, 8), d = new DataView(h.buffer, h.byteOffset, h.length), p = d.getUint32(0);
          if (p > Math.pow(2, 21) - 1) {
            a.enqueue(D);
            break;
          }
          i = p * Math.pow(2, 32) + d.getUint32(4), n = 3;
        } else {
          if (A(t) < i)
            break;
          const h = R(t, i);
          a.enqueue(Y(r ? h : P.decode(h), e)), n = 0;
        }
        if (i === 0 || i > s) {
          a.enqueue(D);
          break;
        }
      }
    }
  });
}
const ue = 4;
function u(s) {
  if (s)
    return qe(s);
}
function qe(s) {
  for (var e in u.prototype)
    s[e] = u.prototype[e];
  return s;
}
u.prototype.on = u.prototype.addEventListener = function(s, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + s] = this._callbacks["$" + s] || []).push(e), this;
};
u.prototype.once = function(s, e) {
  function t() {
    this.off(s, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(s, t), this;
};
u.prototype.off = u.prototype.removeListener = u.prototype.removeAllListeners = u.prototype.removeEventListener = function(s, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + s];
  if (!t)
    return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + s], this;
  for (var n, i = 0; i < t.length; i++)
    if (n = t[i], n === e || n.fn === e) {
      t.splice(i, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + s], this;
};
u.prototype.emit = function(s) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + s], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  if (t) {
    t = t.slice(0);
    for (var n = 0, i = t.length; n < i; ++n)
      t[n].apply(this, e);
  }
  return this;
};
u.prototype.emitReserved = u.prototype.emit;
u.prototype.listeners = function(s) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + s] || [];
};
u.prototype.hasListeners = function(s) {
  return !!this.listeners(s).length;
};
const m = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")();
function fe(s, ...e) {
  return e.reduce((t, n) => (s.hasOwnProperty(n) && (t[n] = s[n]), t), {});
}
const Ue = m.setTimeout, Ve = m.clearTimeout;
function x(s, e) {
  e.useNativeTimers ? (s.setTimeoutFn = Ue.bind(m), s.clearTimeoutFn = Ve.bind(m)) : (s.setTimeoutFn = m.setTimeout.bind(m), s.clearTimeoutFn = m.clearTimeout.bind(m));
}
const Fe = 1.33;
function $e(s) {
  return typeof s == "string" ? Ye(s) : Math.ceil((s.byteLength || s.size) * Fe);
}
function Ye(s) {
  let e = 0, t = 0;
  for (let n = 0, i = s.length; n < i; n++)
    e = s.charCodeAt(n), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (n++, t += 4);
  return t;
}
function We(s) {
  let e = "";
  for (let t in s)
    s.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(s[t]));
  return e;
}
function He(s) {
  let e = {}, t = s.split("&");
  for (let n = 0, i = t.length; n < i; n++) {
    let r = t[n].split("=");
    e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return e;
}
class Je extends Error {
  constructor(e, t, n) {
    super(e), this.description = t, this.context = n, this.type = "TransportError";
  }
}
class W extends u {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, x(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, n) {
    return super.emitReserved("error", new Je(e, t, n)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = Y(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = We(e);
    return t.length ? "?" + t : "";
  }
}
const de = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), M = 64, Ke = {};
let Q = 0, S = 0, Z;
function ee(s) {
  let e = "";
  do
    e = de[s % M] + e, s = Math.floor(s / M);
  while (s > 0);
  return e;
}
function pe() {
  const s = ee(+/* @__PURE__ */ new Date());
  return s !== Z ? (Q = 0, Z = s) : s + "." + ee(Q++);
}
for (; S < M; S++)
  Ke[de[S]] = S;
let me = !1;
try {
  me = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const ze = me;
function ye(s) {
  const e = s.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || ze))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new m[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function Xe() {
}
const je = function() {
  return new ye({
    xdomain: !1
  }).responseType != null;
}();
class Ge extends W {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), this.polling = !1, typeof location < "u") {
      const n = location.protocol === "https:";
      let i = location.port;
      i || (i = n ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || i !== e.port;
    }
    const t = e && e.forceBase64;
    this.supportsBinary = je && !t, this.opts.withCredentials && (this.cookieJar = void 0);
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this.poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this.polling || !this.writable) {
      let n = 0;
      this.polling && (n++, this.once("pollComplete", function() {
        --n || t();
      })), this.writable || (n++, this.once("drain", function() {
        --n || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  poll() {
    this.polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (n) => {
      if (this.readyState === "opening" && n.type === "open" && this.onOpen(), n.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(n);
    };
    Pe(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Ie(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = pe()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
  /**
   * Creates a request.
   *
   * @param {String} method
   * @private
   */
  request(e = {}) {
    return Object.assign(e, { xd: this.xd, cookieJar: this.cookieJar }, this.opts), new w(this.uri(), e);
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const n = this.request({
      method: "POST",
      data: e
    });
    n.on("success", t), n.on("error", (i, r) => {
      this.onError("xhr post error", i, r);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, n) => {
      this.onError("xhr poll error", t, n);
    }), this.pollXhr = e;
  }
}
class w extends u {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t) {
    super(), x(this, t), this.opts = t, this.method = t.method || "GET", this.uri = e, this.data = t.data !== void 0 ? t.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const t = fe(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this.opts.xd;
    const n = this.xhr = new ye(t);
    try {
      n.open(this.method, this.uri, !0);
      try {
        if (this.opts.extraHeaders) {
          n.setDisableHeaderCheck && n.setDisableHeaderCheck(!0);
          for (let i in this.opts.extraHeaders)
            this.opts.extraHeaders.hasOwnProperty(i) && n.setRequestHeader(i, this.opts.extraHeaders[i]);
        }
      } catch {
      }
      if (this.method === "POST")
        try {
          n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        n.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this.opts.cookieJar) === null || e === void 0 || e.addCookies(n), "withCredentials" in n && (n.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (n.timeout = this.opts.requestTimeout), n.onreadystatechange = () => {
        var i;
        n.readyState === 3 && ((i = this.opts.cookieJar) === null || i === void 0 || i.parseCookies(n)), n.readyState === 4 && (n.status === 200 || n.status === 1223 ? this.onLoad() : this.setTimeoutFn(() => {
          this.onError(typeof n.status == "number" ? n.status : 0);
        }, 0));
      }, n.send(this.data);
    } catch (i) {
      this.setTimeoutFn(() => {
        this.onError(i);
      }, 0);
      return;
    }
    typeof document < "u" && (this.index = w.requestsCount++, w.requests[this.index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  onError(e) {
    this.emitReserved("error", e, this.xhr), this.cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  cleanup(e) {
    if (!(typeof this.xhr > "u" || this.xhr === null)) {
      if (this.xhr.onreadystatechange = Xe, e)
        try {
          this.xhr.abort();
        } catch {
        }
      typeof document < "u" && delete w.requests[this.index], this.xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  onLoad() {
    const e = this.xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this.cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this.cleanup();
  }
}
w.requestsCount = 0;
w.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", te);
  else if (typeof addEventListener == "function") {
    const s = "onpagehide" in m ? "pagehide" : "unload";
    addEventListener(s, te, !1);
  }
}
function te() {
  for (let s in w.requests)
    w.requests.hasOwnProperty(s) && w.requests[s].abort();
}
const H = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), O = m.WebSocket || m.MozWebSocket, se = !0, Qe = "arraybuffer", ne = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ze extends W {
  /**
   * WebSocket transport constructor.
   *
   * @param {Object} opts - connection options
   * @protected
   */
  constructor(e) {
    super(e), this.supportsBinary = !e.forceBase64;
  }
  get name() {
    return "websocket";
  }
  doOpen() {
    if (!this.check())
      return;
    const e = this.uri(), t = this.opts.protocols, n = ne ? {} : fe(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
    try {
      this.ws = se && !ne ? t ? new O(e, t) : new O(e) : new O(e, t, n);
    } catch (i) {
      return this.emitReserved("error", i);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], i = t === e.length - 1;
      $(n, this.supportsBinary, (r) => {
        const o = {};
        try {
          se && this.ws.send(r);
        } catch {
        }
        i && H(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = pe()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @private
   */
  check() {
    return !!O;
  }
}
class et extends W {
  get name() {
    return "webtransport";
  }
  doOpen() {
    typeof WebTransport == "function" && (this.transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]), this.transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this.transport.ready.then(() => {
      this.transport.createBidirectionalStream().then((e) => {
        const t = Me(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(t).getReader(), i = De();
        i.readable.pipeTo(e.writable), this.writer = i.writable.getWriter();
        const r = () => {
          n.read().then(({ done: a, value: h }) => {
            a || (this.onPacket(h), r());
          }).catch((a) => {
          });
        };
        r();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this.writer.write(o).then(() => this.onOpen());
      });
    }));
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], i = t === e.length - 1;
      this.writer.write(n).then(() => {
        i && H(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this.transport) === null || e === void 0 || e.close();
  }
}
const tt = {
  websocket: Ze,
  webtransport: et,
  polling: Ge
}, st = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, nt = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function q(s) {
  if (s.length > 2e3)
    throw "URI too long";
  const e = s, t = s.indexOf("["), n = s.indexOf("]");
  t != -1 && n != -1 && (s = s.substring(0, t) + s.substring(t, n).replace(/:/g, ";") + s.substring(n, s.length));
  let i = st.exec(s || ""), r = {}, o = 14;
  for (; o--; )
    r[nt[o]] = i[o] || "";
  return t != -1 && n != -1 && (r.source = e, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = it(r, r.path), r.queryKey = rt(r, r.query), r;
}
function it(s, e) {
  const t = /\/{2,9}/g, n = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function rt(s, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, r) {
    i && (t[i] = r);
  }), t;
}
let ge = class v extends u {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t = {}) {
    super(), this.binaryType = Qe, this.writeBuffer = [], e && typeof e == "object" && (t = e, e = null), e ? (e = q(e), t.hostname = e.host, t.secure = e.protocol === "https" || e.protocol === "wss", t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = q(t.host).host), x(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = t.transports || [
      "polling",
      "websocket",
      "webtransport"
    ], this.writeBuffer = [], this.prevBufferLen = 0, this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = He(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this.beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this.offlineEventListener = () => {
      this.onClose("transport close", {
        description: "network connection lost"
      });
    }, addEventListener("offline", this.offlineEventListener, !1))), this.open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = ue, t.transport = e, this.id && (t.sid = this.id);
    const n = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new tt[e](n);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && v.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
      e = "websocket";
    else if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    } else
      e = this.transports[0];
    this.readyState = "opening";
    try {
      e = this.createTransport(e);
    } catch {
      this.transports.shift(), this.open();
      return;
    }
    e.open(), this.setTransport(e);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (t) => this.onClose("transport close", t));
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  probe(e) {
    let t = this.createTransport(e), n = !1;
    v.priorWebsocketSuccess = !1;
    const i = () => {
      n || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (y) => {
        if (!n)
          if (y.type === "pong" && y.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            v.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (p(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const b = new Error("probe error");
            b.transport = t.name, this.emitReserved("upgradeError", b);
          }
      }));
    };
    function r() {
      n || (n = !0, p(), t.close(), t = null);
    }
    const o = (y) => {
      const b = new Error("probe error: " + y);
      b.transport = t.name, r(), this.emitReserved("upgradeError", b);
    };
    function a() {
      o("transport closed");
    }
    function h() {
      o("socket closed");
    }
    function d(y) {
      t && y.name !== t.name && r();
    }
    const p = () => {
      t.removeListener("open", i), t.removeListener("error", o), t.removeListener("close", a), this.off("close", h), this.off("upgrading", d);
    };
    t.once("open", i), t.once("error", o), t.once("close", a), this.once("close", h), this.once("upgrading", d), this.upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      n || t.open();
    }, 200) : t.open();
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    if (this.readyState = "open", v.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
      let e = 0;
      const t = this.upgrades.length;
      for (; e < t; e++)
        this.probe(this.upgrades[e]);
    }
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), this.resetPingTimeout(), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this.sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong");
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this.onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this.resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer), this.pingTimeoutTimer = this.setTimeoutFn(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout), this.opts.autoUnref && this.pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this.getWritablePackets();
      this.transport.send(e), this.prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  getWritablePackets() {
    if (!(this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let n = 0; n < this.writeBuffer.length; n++) {
      const i = this.writeBuffer[n].data;
      if (i && (t += $e(i)), n > 0 && t > this.maxPayload)
        return this.writeBuffer.slice(0, n);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, n) {
    return this.sendPacket("message", e, t, n), this;
  }
  send(e, t, n) {
    return this.sendPacket("message", e, t, n), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  sendPacket(e, t, n, i) {
    if (typeof t == "function" && (i = t, t = void 0), typeof n == "function" && (i = n, n = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    n = n || {}, n.compress = n.compress !== !1;
    const r = {
      type: e,
      data: t,
      options: n
    };
    this.emitReserved("packetCreate", r), this.writeBuffer.push(r), i && this.once("flush", i), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this.onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, n = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? n() : e();
    }) : this.upgrading ? n() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  onError(e) {
    v.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  onClose(e, t) {
    (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") && (this.clearTimeoutFn(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), typeof removeEventListener == "function" && (removeEventListener("beforeunload", this.beforeunloadEventListener, !1), removeEventListener("offline", this.offlineEventListener, !1)), this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this.prevBufferLen = 0);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  filterUpgrades(e) {
    const t = [];
    let n = 0;
    const i = e.length;
    for (; n < i; n++)
      ~this.transports.indexOf(e[n]) && t.push(e[n]);
    return t;
  }
};
ge.protocol = ue;
function ot(s, e = "", t) {
  let n = s;
  t = t || typeof location < "u" && location, s == null && (s = t.protocol + "//" + t.host), typeof s == "string" && (s.charAt(0) === "/" && (s.charAt(1) === "/" ? s = t.protocol + s : s = t.host + s), /^(https?|wss?):\/\//.test(s) || (typeof t < "u" ? s = t.protocol + "//" + s : s = "https://" + s), n = q(s)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const r = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + r + ":" + n.port + e, n.href = n.protocol + "://" + r + (t && t.port === n.port ? "" : ":" + n.port), n;
}
const at = typeof ArrayBuffer == "function", ct = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s.buffer instanceof ArrayBuffer, we = Object.prototype.toString, ht = typeof Blob == "function" || typeof Blob < "u" && we.call(Blob) === "[object BlobConstructor]", lt = typeof File == "function" || typeof File < "u" && we.call(File) === "[object FileConstructor]";
function J(s) {
  return at && (s instanceof ArrayBuffer || ct(s)) || ht && s instanceof Blob || lt && s instanceof File;
}
function N(s, e) {
  if (!s || typeof s != "object")
    return !1;
  if (Array.isArray(s)) {
    for (let t = 0, n = s.length; t < n; t++)
      if (N(s[t]))
        return !0;
    return !1;
  }
  if (J(s))
    return !0;
  if (s.toJSON && typeof s.toJSON == "function" && arguments.length === 1)
    return N(s.toJSON(), !0);
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && N(s[t]))
      return !0;
  return !1;
}
function ut(s) {
  const e = [], t = s.data, n = s;
  return n.data = U(t, e), n.attachments = e.length, { packet: n, buffers: e };
}
function U(s, e) {
  if (!s)
    return s;
  if (J(s)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(s), t;
  } else if (Array.isArray(s)) {
    const t = new Array(s.length);
    for (let n = 0; n < s.length; n++)
      t[n] = U(s[n], e);
    return t;
  } else if (typeof s == "object" && !(s instanceof Date)) {
    const t = {};
    for (const n in s)
      Object.prototype.hasOwnProperty.call(s, n) && (t[n] = U(s[n], e));
    return t;
  }
  return s;
}
function ft(s, e) {
  return s.data = V(s.data, e), delete s.attachments, s;
}
function V(s, e) {
  if (!s)
    return s;
  if (s && s._placeholder === !0) {
    if (typeof s.num == "number" && s.num >= 0 && s.num < e.length)
      return e[s.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(s))
    for (let t = 0; t < s.length; t++)
      s[t] = V(s[t], e);
  else if (typeof s == "object")
    for (const t in s)
      Object.prototype.hasOwnProperty.call(s, t) && (s[t] = V(s[t], e));
  return s;
}
const dt = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], pt = 5;
var c;
(function(s) {
  s[s.CONNECT = 0] = "CONNECT", s[s.DISCONNECT = 1] = "DISCONNECT", s[s.EVENT = 2] = "EVENT", s[s.ACK = 3] = "ACK", s[s.CONNECT_ERROR = 4] = "CONNECT_ERROR", s[s.BINARY_EVENT = 5] = "BINARY_EVENT", s[s.BINARY_ACK = 6] = "BINARY_ACK";
})(c || (c = {}));
class mt {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === c.EVENT || e.type === c.ACK) && N(e) ? this.encodeAsBinary({
      type: e.type === c.EVENT ? c.BINARY_EVENT : c.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === c.BINARY_EVENT || e.type === c.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = ut(e), n = this.encodeAsString(t.packet), i = t.buffers;
    return i.unshift(n), i;
  }
}
function ie(s) {
  return Object.prototype.toString.call(s) === "[object Object]";
}
class K extends u {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const n = t.type === c.BINARY_EVENT;
      n || t.type === c.BINARY_ACK ? (t.type = n ? c.EVENT : c.ACK, this.reconstructor = new yt(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (J(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const n = {
      type: Number(e.charAt(0))
    };
    if (c[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === c.BINARY_EVENT || n.type === c.BINARY_ACK) {
      const r = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const o = e.substring(r, t);
      if (o != Number(o) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      n.attachments = Number(o);
    }
    if (e.charAt(t + 1) === "/") {
      const r = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      n.nsp = e.substring(r, t);
    } else
      n.nsp = "/";
    const i = e.charAt(t + 1);
    if (i !== "" && Number(i) == i) {
      const r = t + 1;
      for (; ++t; ) {
        const o = e.charAt(t);
        if (o == null || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      n.id = Number(e.substring(r, t + 1));
    }
    if (e.charAt(++t)) {
      const r = this.tryParse(e.substr(t));
      if (K.isPayloadValid(n.type, r))
        n.data = r;
      else
        throw new Error("invalid payload");
    }
    return n;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case c.CONNECT:
        return ie(t);
      case c.DISCONNECT:
        return t === void 0;
      case c.CONNECT_ERROR:
        return typeof t == "string" || ie(t);
      case c.EVENT:
      case c.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && dt.indexOf(t[0]) === -1);
      case c.ACK:
      case c.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class yt {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = ft(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: K,
  Encoder: mt,
  get PacketType() {
    return c;
  },
  protocol: pt
}, Symbol.toStringTag, { value: "Module" }));
function g(s, e, t) {
  return s.on(e, t), function() {
    s.off(e, t);
  };
}
const wt = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Ee extends u {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, n) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, n && n.auth && (this.auth = n.auth), this._opts = Object.assign({}, n), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      g(e, "open", this.onopen.bind(this)),
      g(e, "packet", this.onpacket.bind(this)),
      g(e, "error", this.onerror.bind(this)),
      g(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    if (wt.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const n = {
      type: c.EVENT,
      data: t
    };
    if (n.options = {}, n.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const o = this.ids++, a = t.pop();
      this._registerAckCallback(o, a), n.id = o;
    }
    const i = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
    return this.flags.volatile && (!i || !this.connected) || (this.connected ? (this.notifyOutgoingListeners(n), this.packet(n)) : this.sendBuffer.push(n)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var n;
    const i = (n = this.flags.timeout) !== null && n !== void 0 ? n : this._opts.ackTimeout;
    if (i === void 0) {
      this.acks[e] = t;
      return;
    }
    const r = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === e && this.sendBuffer.splice(a, 1);
      t.call(this, new Error("operation has timed out"));
    }, i), o = (...a) => {
      this.io.clearTimeoutFn(r), t.apply(this, a);
    };
    o.withError = !0, this.acks[e] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((n, i) => {
      const r = (o, a) => o ? i(o) : n(a);
      r.withError = !0, t.push(r), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const n = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((i, ...r) => n !== this._queue[0] ? void 0 : (i !== null ? n.tryCount > this._opts.retries && (this._queue.shift(), t && t(i)) : (this._queue.shift(), t && t(null, ...r)), n.pending = !1, this._drainQueue())), this._queue.push(n), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: c.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((n) => String(n.id) === e)) {
        const n = this.acks[e];
        delete this.acks[e], n.withError && n.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case c.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case c.EVENT:
        case c.BINARY_EVENT:
          this.onevent(e);
          break;
        case c.ACK:
        case c.BINARY_ACK:
          this.onack(e);
          break;
        case c.DISCONNECT:
          this.ondisconnect();
          break;
        case c.CONNECT_ERROR:
          this.destroy();
          const n = new Error(e.data.message);
          n.data = e.data.data, this.emitReserved("connect_error", n);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const n of t)
        n.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let n = !1;
    return function(...i) {
      n || (n = !0, t.packet({
        type: c.ACK,
        id: e,
        data: i
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: c.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let n = 0; n < t.length; n++)
        if (e === t[n])
          return t.splice(n, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let n = 0; n < t.length; n++)
        if (e === t[n])
          return t.splice(n, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const n of t)
        n.apply(this, e.data);
    }
  }
}
function _(s) {
  s = s || {}, this.ms = s.min || 100, this.max = s.max || 1e4, this.factor = s.factor || 2, this.jitter = s.jitter > 0 && s.jitter <= 1 ? s.jitter : 0, this.attempts = 0;
}
_.prototype.duration = function() {
  var s = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * s);
    s = Math.floor(e * 10) & 1 ? s + t : s - t;
  }
  return Math.min(s, this.max) | 0;
};
_.prototype.reset = function() {
  this.attempts = 0;
};
_.prototype.setMin = function(s) {
  this.ms = s;
};
_.prototype.setMax = function(s) {
  this.max = s;
};
_.prototype.setJitter = function(s) {
  this.jitter = s;
};
class F extends u {
  constructor(e, t) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, x(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((n = t.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new _({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const i = t.parser || gt;
    this.encoder = new i.Encoder(), this.decoder = new i.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new ge(this.uri, this.opts);
    const t = this.engine, n = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = g(t, "open", function() {
      n.onopen(), e && e();
    }), r = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), e ? e(a) : this.maybeReconnectOnOpen();
    }, o = g(t, "error", r);
    if (this._timeout !== !1) {
      const a = this._timeout, h = this.setTimeoutFn(() => {
        i(), r(new Error("timeout")), t.close();
      }, a);
      this.opts.autoUnref && h.unref(), this.subs.push(() => {
        this.clearTimeoutFn(h);
      });
    }
    return this.subs.push(i), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(g(e, "ping", this.onping.bind(this)), g(e, "data", this.ondata.bind(this)), g(e, "error", this.onerror.bind(this)), g(e, "close", this.onclose.bind(this)), g(this.decoder, "decoded", this.ondecoded.bind(this)));
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    H(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let n = this.nsps[e];
    return n ? this._autoConnect && !n.active && n.connect() : (n = new Ee(this, e, t), this.nsps[e] = n), n;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const n of t)
      if (this.nsps[n].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let n = 0; n < t.length; n++)
      this.engine.write(t[n], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close"), this.engine && this.engine.close();
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called upon engine close.
   *
   * @private
   */
  onclose(e, t) {
    this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const n = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((i) => {
          i ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", i)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && n.unref(), this.subs.push(() => {
        this.clearTimeoutFn(n);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const C = {};
function B(s, e) {
  typeof s == "object" && (e = s, s = void 0), e = e || {};
  const t = ot(s, e.path || "/socket.io"), n = t.source, i = t.id, r = t.path, o = C[i] && r in C[i].nsps, a = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let h;
  return a ? h = new F(n, e) : (C[i] || (C[i] = new F(n, e)), h = C[i]), t.query && !e.query && (e.query = t.queryKey), h.socket(t.path, e);
}
Object.assign(B, {
  Manager: F,
  Socket: Ee,
  io: B,
  connect: B
});
var l = /* @__PURE__ */ ((s) => (s.JOIN = "join", s.LEAVE = "leave", s.ADD_PEER = "add-peer", s.REMOVE_PEER = "remove-peer", s.RELAY_SDP = "relay-sdp", s.RELAY_ICE = "relay-ice", s.ICE_CANDIDATE = "ice-candidate", s.SESSION_DESCRIPTION = "session-description", s.INCOMING_CALL = "incoming-call", s.INCOMING_CALL_ANSWER = "incoming-call-answer", s.START_INCOMING_CALL = "start-incoming-call", s.END_CALL = "end-call", s.CALL_STATE = "call-state", s.LOCAL_STREAM_READY = "local-stream-ready", s.REMOTE_STREAM_READY = "remote-stream-ready", s))(l || {});
const Et = "https://api.green-api.com/", vt = async (s, e) => {
  const { idInstance: t, apiTokenInstance: n } = e, i = `${Et}waInstance${t}/call/${n}`;
  return fetch(i, {
    method: "POST",
    body: JSON.stringify({ phoneNumber: s }),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
class _t extends Error {
}
function bt(s, e) {
  const t = new Promise((n, i) => {
    setTimeout(() => i(new _t()), e);
  });
  return Promise.race([s, t]);
}
var T = /* @__PURE__ */ ((s) => (s[s.SELF = 0] = "SELF", s[s.REMOTE = 1] = "REMOTE", s[s.REJECTED = 2] = "REJECTED", s[s.TIMEOUT = 3] = "TIMEOUT", s))(T || {});
class re {
  // private state: number;
  constructor({ id: e }) {
    f(this, "id");
    this.id = e;
  }
}
class kt extends EventTarget {
  constructor() {
    super();
    f(this, "socket");
    f(this, "connectPromise");
    f(this, "peerConnections", {});
    f(this, "localMediaStream", null);
    f(this, "remoteMediaStream", null);
    f(this, "options", null);
    f(this, "incomingCallTimeout", null);
    f(this, "call", null);
    //#region socket events
    f(this, "onNewPeer", async ({ peerID: t, createOffer: n }) => {
      if (t in this.peerConnections) {
        console.warn(`Already connected to peer ${t}`);
        return;
      }
      if (this.localMediaStream == null) {
        console.warn(`Local media stream in not available while new peer handled ${t}`);
        return;
      }
      this.peerConnections[t] = new RTCPeerConnection({
        iceServers: [
          ...Oe(),
          {
            urls: ["turn:10.128.0.98:3478?transport=udp", "turn:10.128.0.98:3478?transport=tcp"],
            username: "slonway",
            credential: "123456789"
          }
        ]
      }), this.peerConnections[t].addEventListener("icecandidate", (i) => {
        i.candidate && this.socket.emit(l.RELAY_ICE, {
          peerID: t,
          iceCandidate: i.candidate
        });
      }), this.peerConnections[t].addEventListener("track", ({ streams: [i] }) => {
        this.remoteMediaStream = i, this.dispatchEvent(
          new CustomEvent(l.REMOTE_STREAM_READY, { detail: this.remoteMediaStream })
        );
      });
      for (const i of this.localMediaStream.getTracks())
        this.peerConnections[t].addTrack(i, this.localMediaStream);
      if (n) {
        const i = await this.peerConnections[t].createOffer();
        await this.peerConnections[t].setLocalDescription(i), this.socket.emit(l.RELAY_SDP, {
          peerID: t,
          sessionDescription: i
        });
      }
    });
    f(this, "onRemovePeer", ({ peerID: t }) => {
      t in this.peerConnections && this.peerConnections[t].close(), this.peerConnections[t] && delete this.peerConnections[t];
    });
    f(this, "onRemoteMedia", async ({ peerID: t, sessionDescription: n }) => {
      if (await this.peerConnections[t].setRemoteDescription(
        new RTCSessionDescription(n)
      ), n.type === "offer") {
        const i = await this.peerConnections[t].createAnswer();
        await this.peerConnections[t].setLocalDescription(i), this.socket.emit(l.RELAY_SDP, {
          peerID: t,
          sessionDescription: i
        });
      }
    });
    f(this, "onIceCandidate", async ({ peerID: t, iceCandidate: n }) => {
      await this.peerConnections[t].addIceCandidate(new RTCIceCandidate(n));
    });
    f(this, "onIncomingCall", (t) => {
      this.incomingCallTimeout = setTimeout(() => {
        this.incomingCallTimeout = null, this.dispatchEvent(new CustomEvent(l.END_CALL, { detail: { type: T.TIMEOUT } }));
      }, t.timeout * 1e3), this.call = new re({ id: t.info.callId }), this.dispatchEvent(new CustomEvent(l.INCOMING_CALL, { detail: t }));
    });
    f(this, "onCallState", (t) => {
      this.dispatchEvent(new CustomEvent(l.CALL_STATE, { detail: t }));
    });
    f(this, "onEndCall", (t) => {
      this.clearIncomingCallTimeout(), this.socket.emit(l.LEAVE, { callID: this.options.idInstance }), this.call = null, this.dispatchEvent(new CustomEvent(l.END_CALL, { detail: { type: T.REMOTE, payload: t } }));
    });
    let t;
    this.connectPromise = new Promise((n) => {
      t = n;
    }), this.socket = B("https://9906.voip.green-api.com/", {
      transports: ["websocket"],
      autoConnect: !1
    }), this.socket.on("connect", () => {
      console.log("socket connected: ", this.socket.connected, this.socket), t();
    }), this.socket.on("connect_error", (n) => {
      throw console.error(n), n;
    }), this.socket.on(l.ADD_PEER, this.onNewPeer), this.socket.on(l.REMOVE_PEER, this.onRemovePeer), this.socket.on(l.SESSION_DESCRIPTION, this.onRemoteMedia), this.socket.on(l.ICE_CANDIDATE, this.onIceCandidate), this.socket.on(l.INCOMING_CALL, this.onIncomingCall), this.socket.on(l.CALL_STATE, this.onCallState), this.socket.on(l.END_CALL, this.onEndCall);
  }
  /**
   * Method destroys connection with signaling socket server.
   */
  destroy() {
    this.socket.disconnect();
  }
  reload() {
    this.socket.disconnect(), this.socket.connect();
  }
  /**
   * Method connects to signaling socket server. If already connected won't do anything.
   */
  async init(t) {
    if (this.options = t, !this.socket.connected)
      return this.socket.auth = {
        idInstance: this.options.idInstance,
        apiInstanceToken: this.options.apiTokenInstance,
        type: "external"
      }, this.socket.connect(), this.connectPromise;
  }
  //#endregion
  /**
   * Method sends request to start whatsapp call.
   */
  async startCall(t, n = !0, i = !0) {
    if (!this.options)
      throw new Error("idInstance and apiTokenInstance doesn't exists");
    if (this.call !== null)
      throw new Error("Already in call");
    try {
      this.incomingCallTimeout !== null && (this.clearIncomingCallTimeout(), await this.rejectCall()), this.localMediaStream = await this.startCapture({ audio: n, video: i }), this.dispatchEvent(
        new CustomEvent(l.LOCAL_STREAM_READY, { detail: this.localMediaStream })
      );
    } catch {
      throw new Error("cannot get capture of audio or video");
    }
    const r = await vt(t, this.options);
    if (r.status === 200) {
      const { callId: a } = await r.json();
      this.call = new re({ id: a });
    } else
      throw new Error("Server error");
    if (!await this.socket.emitWithAck(l.JOIN, { callID: this.options.idInstance }))
      throw this.call = null, new Error("signaling server error");
  }
  /**
   * Method accepts incoming call from whatsapp.
   */
  async acceptCall(t = !0, n = !0) {
    if (!this.options)
      throw new Error("idInstance and apiTokenInstance doesn't exists");
    if (this.call === null)
      throw new Error("Not in call");
    if (this.incomingCallTimeout === null)
      throw new Error("Incoming call timeout");
    this.clearIncomingCallTimeout();
    try {
      this.localMediaStream = await this.startCapture({ audio: t, video: n }), this.dispatchEvent(
        new CustomEvent(l.LOCAL_STREAM_READY, { detail: this.localMediaStream })
      );
    } catch {
      throw new Error("cannot get capture of audio or video");
    }
    this.socket.emit(l.INCOMING_CALL_ANSWER, { reject: !1 }), this.socket.emit(l.JOIN, { callID: this.options.idInstance });
  }
  /**
   * Method rejects incoming call from whatsapp.
   */
  async rejectCall() {
    if (this.call === null)
      throw new Error("Not in call");
    if (this.incomingCallTimeout === null)
      throw new Error("Incoming call timeout");
    this.dispatchEvent(new CustomEvent(l.END_CALL, { detail: { type: T.REJECTED } })), this.socket.emit(l.INCOMING_CALL_ANSWER, { reject: !0 });
  }
  /**
   * Method closes p2p connection and sends event, that you disconnect from call room to all participants.
   */
  async endCall() {
    var t;
    if (this.call === null)
      throw new Error("Not in call");
    if (this.incomingCallTimeout !== null)
      throw new Error("Incoming call");
    try {
      (t = this.localMediaStream) == null || t.getTracks().forEach((i) => i.stop());
      for (const i in this.peerConnections)
        i in this.peerConnections && (this.peerConnections[i].close(), delete this.peerConnections[i]);
      return await bt(this.socket.emitWithAck(l.END_CALL, {}), 5e3) ? (this.call = null, this.dispatchEvent(new CustomEvent(l.END_CALL, { detail: { type: T.SELF } })), !0) : !1;
    } catch {
      return !1;
    }
  }
  startCapture(t) {
    return navigator.mediaDevices.getUserMedia(t);
  }
  clearIncomingCallTimeout() {
    this.incomingCallTimeout !== null && (clearTimeout(this.incomingCallTimeout), this.incomingCallTimeout = null);
  }
}
export {
  kt as GreenApiVoipClient
};
