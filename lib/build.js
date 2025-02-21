var Ae = Object.defineProperty;
var Te = (s, e, t) => e in s ? Ae(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var u = (s, e, t) => (Te(s, typeof e != "symbol" ? e + "" : e, t), t);
const y = /* @__PURE__ */ Object.create(null);
y.open = "0";
y.close = "1";
y.ping = "2";
y.pong = "3";
y.message = "4";
y.upgrade = "5";
y.noop = "6";
const L = /* @__PURE__ */ Object.create(null);
Object.keys(y).forEach((s) => {
  L[y[s]] = s;
});
const U = { type: "error", data: "parser error" }, ue = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", fe = typeof ArrayBuffer == "function", de = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s && s.buffer instanceof ArrayBuffer, K = ({ type: s, data: e }, t, n) => ue && e instanceof Blob ? t ? n(e) : j(e, n) : fe && (e instanceof ArrayBuffer || de(e)) ? t ? n(e) : j(new Blob([e]), n) : n(y[s] + (e || "")), j = (s, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const n = t.result.split(",")[1];
    e("b" + (n || ""));
  }, t.readAsDataURL(s);
};
function Q(s) {
  return s instanceof Uint8Array ? s : s instanceof ArrayBuffer ? new Uint8Array(s) : new Uint8Array(s.buffer, s.byteOffset, s.byteLength);
}
let D;
function Se(s, e) {
  if (ue && s.data instanceof Blob)
    return s.data.arrayBuffer().then(Q).then(e);
  if (fe && (s.data instanceof ArrayBuffer || de(s.data)))
    return e(Q(s.data));
  K(s, !1, (t) => {
    D || (D = new TextEncoder()), e(D.encode(t));
  });
}
const Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", k = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let s = 0; s < Z.length; s++)
  k[Z.charCodeAt(s)] = s;
const Re = (s) => {
  let e = s.length * 0.75, t = s.length, n, i = 0, r, o, c, h;
  s[s.length - 1] === "=" && (e--, s[s.length - 2] === "=" && e--);
  const E = new ArrayBuffer(e), g = new Uint8Array(E);
  for (n = 0; n < t; n += 4)
    r = k[s.charCodeAt(n)], o = k[s.charCodeAt(n + 1)], c = k[s.charCodeAt(n + 2)], h = k[s.charCodeAt(n + 3)], g[i++] = r << 2 | o >> 4, g[i++] = (o & 15) << 4 | c >> 2, g[i++] = (c & 3) << 6 | h & 63;
  return E;
}, Oe = typeof ArrayBuffer == "function", H = (s, e) => {
  if (typeof s != "string")
    return {
      type: "message",
      data: pe(s, e)
    };
  const t = s.charAt(0);
  return t === "b" ? {
    type: "message",
    data: Le(s.substring(1), e)
  } : L[t] ? s.length > 1 ? {
    type: L[t],
    data: s.substring(1)
  } : {
    type: L[t]
  } : U;
}, Le = (s, e) => {
  if (Oe) {
    const t = Re(s);
    return pe(t, e);
  } else
    return { base64: !0, data: s };
}, pe = (s, e) => {
  switch (e) {
    case "blob":
      return s instanceof Blob ? s : new Blob([s]);
    case "arraybuffer":
    default:
      return s instanceof ArrayBuffer ? s : s.buffer;
  }
}, me = "", Ne = (s, e) => {
  const t = s.length, n = new Array(t);
  let i = 0;
  s.forEach((r, o) => {
    K(r, !1, (c) => {
      n[o] = c, ++i === t && e(n.join(me));
    });
  });
}, Be = (s, e) => {
  const t = s.split(me), n = [];
  for (let i = 0; i < t.length; i++) {
    const r = H(t[i], e);
    if (n.push(r), r.type === "error")
      break;
  }
  return n;
};
function xe() {
  return new TransformStream({
    transform(s, e) {
      Se(s, (t) => {
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
let M;
function T(s) {
  return s.reduce((e, t) => e + t.length, 0);
}
function S(s, e) {
  if (s[0].length === e)
    return s.shift();
  const t = new Uint8Array(e);
  let n = 0;
  for (let i = 0; i < e; i++)
    t[i] = s[0][n++], n === s[0].length && (s.shift(), n = 0);
  return s.length && n < s[0].length && (s[0] = s[0].slice(n)), t;
}
function Ie(s, e) {
  M || (M = new TextDecoder());
  const t = [];
  let n = 0, i = -1, r = !1;
  return new TransformStream({
    transform(o, c) {
      for (t.push(o); ; ) {
        if (n === 0) {
          if (T(t) < 1)
            break;
          const h = S(t, 1);
          r = (h[0] & 128) === 128, i = h[0] & 127, i < 126 ? n = 3 : i === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (T(t) < 2)
            break;
          const h = S(t, 2);
          i = new DataView(h.buffer, h.byteOffset, h.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (T(t) < 8)
            break;
          const h = S(t, 8), E = new DataView(h.buffer, h.byteOffset, h.length), g = E.getUint32(0);
          if (g > Math.pow(2, 21) - 1) {
            c.enqueue(U);
            break;
          }
          i = g * Math.pow(2, 32) + E.getUint32(4), n = 3;
        } else {
          if (T(t) < i)
            break;
          const h = S(t, i);
          c.enqueue(H(r ? h : M.decode(h), e)), n = 0;
        }
        if (i === 0 || i > s) {
          c.enqueue(U);
          break;
        }
      }
    }
  });
}
const ye = 4;
function f(s) {
  if (s)
    return Pe(s);
}
function Pe(s) {
  for (var e in f.prototype)
    s[e] = f.prototype[e];
  return s;
}
f.prototype.on = f.prototype.addEventListener = function(s, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + s] = this._callbacks["$" + s] || []).push(e), this;
};
f.prototype.once = function(s, e) {
  function t() {
    this.off(s, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(s, t), this;
};
f.prototype.off = f.prototype.removeListener = f.prototype.removeAllListeners = f.prototype.removeEventListener = function(s, e) {
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
f.prototype.emit = function(s) {
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
f.prototype.emitReserved = f.prototype.emit;
f.prototype.listeners = function(s) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + s] || [];
};
f.prototype.hasListeners = function(s) {
  return !!this.listeners(s).length;
};
const d = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")();
function ge(s, ...e) {
  return e.reduce((t, n) => (s.hasOwnProperty(n) && (t[n] = s[n]), t), {});
}
const De = d.setTimeout, Me = d.clearTimeout;
function P(s, e) {
  e.useNativeTimers ? (s.setTimeoutFn = De.bind(d), s.clearTimeoutFn = Me.bind(d)) : (s.setTimeoutFn = d.setTimeout.bind(d), s.clearTimeoutFn = d.clearTimeout.bind(d));
}
const qe = 1.33;
function Ue(s) {
  return typeof s == "string" ? Ve(s) : Math.ceil((s.byteLength || s.size) * qe);
}
function Ve(s) {
  let e = 0, t = 0;
  for (let n = 0, i = s.length; n < i; n++)
    e = s.charCodeAt(n), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (n++, t += 4);
  return t;
}
function Fe(s) {
  let e = "";
  for (let t in s)
    s.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(s[t]));
  return e;
}
function We(s) {
  let e = {}, t = s.split("&");
  for (let n = 0, i = t.length; n < i; n++) {
    let r = t[n].split("=");
    e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return e;
}
class Ye extends Error {
  constructor(e, t, n) {
    super(e), this.description = t, this.context = n, this.type = "TransportError";
  }
}
class J extends f {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, P(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
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
    return super.emitReserved("error", new Ye(e, t, n)), this;
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
    const t = H(e, this.socket.binaryType);
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
    const t = Fe(e);
    return t.length ? "?" + t : "";
  }
}
const Ee = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), V = 64, $e = {};
let ee = 0, R = 0, te;
function se(s) {
  let e = "";
  do
    e = Ee[s % V] + e, s = Math.floor(s / V);
  while (s > 0);
  return e;
}
function we() {
  const s = se(+/* @__PURE__ */ new Date());
  return s !== te ? (ee = 0, te = s) : s + "." + se(ee++);
}
for (; R < V; R++)
  $e[Ee[R]] = R;
let Ce = !1;
try {
  Ce = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Ke = Ce;
function ve(s) {
  const e = s.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Ke))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new d[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function He() {
}
const Je = function() {
  return new ve({
    xdomain: !1
  }).responseType != null;
}();
class ze extends J {
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
    this.supportsBinary = Je && !t, this.opts.withCredentials && (this.cookieJar = void 0);
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
    Be(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
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
    this.writable = !1, Ne(e, (t) => {
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
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = we()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
  /**
   * Creates a request.
   *
   * @param {String} method
   * @private
   */
  request(e = {}) {
    return Object.assign(e, { xd: this.xd, cookieJar: this.cookieJar }, this.opts), new m(this.uri(), e);
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
class m extends f {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t) {
    super(), P(this, t), this.opts = t, this.method = t.method || "GET", this.uri = e, this.data = t.data !== void 0 ? t.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const t = ge(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this.opts.xd;
    const n = this.xhr = new ve(t);
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
    typeof document < "u" && (this.index = m.requestsCount++, m.requests[this.index] = this);
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
      if (this.xhr.onreadystatechange = He, e)
        try {
          this.xhr.abort();
        } catch {
        }
      typeof document < "u" && delete m.requests[this.index], this.xhr = null;
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
m.requestsCount = 0;
m.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", ne);
  else if (typeof addEventListener == "function") {
    const s = "onpagehide" in d ? "pagehide" : "unload";
    addEventListener(s, ne, !1);
  }
}
function ne() {
  for (let s in m.requests)
    m.requests.hasOwnProperty(s) && m.requests[s].abort();
}
const z = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), O = d.WebSocket || d.MozWebSocket, ie = !0, Ge = "arraybuffer", re = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Xe extends J {
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
    const e = this.uri(), t = this.opts.protocols, n = re ? {} : ge(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
    try {
      this.ws = ie && !re ? t ? new O(e, t) : new O(e) : new O(e, t, n);
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
      K(n, this.supportsBinary, (r) => {
        const o = {};
        try {
          ie && this.ws.send(r);
        } catch {
        }
        i && z(() => {
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
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = we()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
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
class je extends J {
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
        const t = Ie(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(t).getReader(), i = xe();
        i.readable.pipeTo(e.writable), this.writer = i.writable.getWriter();
        const r = () => {
          n.read().then(({ done: c, value: h }) => {
            c || (this.onPacket(h), r());
          }).catch((c) => {
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
        i && z(() => {
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
const Qe = {
  websocket: Xe,
  webtransport: je,
  polling: ze
}, Ze = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, et = [
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
function F(s) {
  if (s.length > 2e3)
    throw "URI too long";
  const e = s, t = s.indexOf("["), n = s.indexOf("]");
  t != -1 && n != -1 && (s = s.substring(0, t) + s.substring(t, n).replace(/:/g, ";") + s.substring(n, s.length));
  let i = Ze.exec(s || ""), r = {}, o = 14;
  for (; o--; )
    r[et[o]] = i[o] || "";
  return t != -1 && n != -1 && (r.source = e, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = tt(r, r.path), r.queryKey = st(r, r.query), r;
}
function tt(s, e) {
  const t = /\/{2,9}/g, n = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function st(s, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, r) {
    i && (t[i] = r);
  }), t;
}
let _e = class C extends f {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t = {}) {
    super(), this.binaryType = Ge, this.writeBuffer = [], e && typeof e == "object" && (t = e, e = null), e ? (e = F(e), t.hostname = e.host, t.secure = e.protocol === "https" || e.protocol === "wss", t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = F(t.host).host), P(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = t.transports || [
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
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = We(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
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
    t.EIO = ye, t.transport = e, this.id && (t.sid = this.id);
    const n = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new Qe[e](n);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && C.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
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
    C.priorWebsocketSuccess = !1;
    const i = () => {
      n || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (w) => {
        if (!n)
          if (w.type === "pong" && w.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            C.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (g(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const _ = new Error("probe error");
            _.transport = t.name, this.emitReserved("upgradeError", _);
          }
      }));
    };
    function r() {
      n || (n = !0, g(), t.close(), t = null);
    }
    const o = (w) => {
      const _ = new Error("probe error: " + w);
      _.transport = t.name, r(), this.emitReserved("upgradeError", _);
    };
    function c() {
      o("transport closed");
    }
    function h() {
      o("socket closed");
    }
    function E(w) {
      t && w.name !== t.name && r();
    }
    const g = () => {
      t.removeListener("open", i), t.removeListener("error", o), t.removeListener("close", c), this.off("close", h), this.off("upgrading", E);
    };
    t.once("open", i), t.once("error", o), t.once("close", c), this.once("close", h), this.once("upgrading", E), this.upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      n || t.open();
    }, 200) : t.open();
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    if (this.readyState = "open", C.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
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
      if (i && (t += Ue(i)), n > 0 && t > this.maxPayload)
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
    C.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
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
_e.protocol = ye;
function nt(s, e = "", t) {
  let n = s;
  t = t || typeof location < "u" && location, s == null && (s = t.protocol + "//" + t.host), typeof s == "string" && (s.charAt(0) === "/" && (s.charAt(1) === "/" ? s = t.protocol + s : s = t.host + s), /^(https?|wss?):\/\//.test(s) || (typeof t < "u" ? s = t.protocol + "//" + s : s = "https://" + s), n = F(s)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const r = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + r + ":" + n.port + e, n.href = n.protocol + "://" + r + (t && t.port === n.port ? "" : ":" + n.port), n;
}
const it = typeof ArrayBuffer == "function", rt = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s.buffer instanceof ArrayBuffer, be = Object.prototype.toString, ot = typeof Blob == "function" || typeof Blob < "u" && be.call(Blob) === "[object BlobConstructor]", ct = typeof File == "function" || typeof File < "u" && be.call(File) === "[object FileConstructor]";
function G(s) {
  return it && (s instanceof ArrayBuffer || rt(s)) || ot && s instanceof Blob || ct && s instanceof File;
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
  if (G(s))
    return !0;
  if (s.toJSON && typeof s.toJSON == "function" && arguments.length === 1)
    return N(s.toJSON(), !0);
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && N(s[t]))
      return !0;
  return !1;
}
function at(s) {
  const e = [], t = s.data, n = s;
  return n.data = W(t, e), n.attachments = e.length, { packet: n, buffers: e };
}
function W(s, e) {
  if (!s)
    return s;
  if (G(s)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(s), t;
  } else if (Array.isArray(s)) {
    const t = new Array(s.length);
    for (let n = 0; n < s.length; n++)
      t[n] = W(s[n], e);
    return t;
  } else if (typeof s == "object" && !(s instanceof Date)) {
    const t = {};
    for (const n in s)
      Object.prototype.hasOwnProperty.call(s, n) && (t[n] = W(s[n], e));
    return t;
  }
  return s;
}
function ht(s, e) {
  return s.data = Y(s.data, e), delete s.attachments, s;
}
function Y(s, e) {
  if (!s)
    return s;
  if (s && s._placeholder === !0) {
    if (typeof s.num == "number" && s.num >= 0 && s.num < e.length)
      return e[s.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(s))
    for (let t = 0; t < s.length; t++)
      s[t] = Y(s[t], e);
  else if (typeof s == "object")
    for (const t in s)
      Object.prototype.hasOwnProperty.call(s, t) && (s[t] = Y(s[t], e));
  return s;
}
const lt = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], ut = 5;
var a;
(function(s) {
  s[s.CONNECT = 0] = "CONNECT", s[s.DISCONNECT = 1] = "DISCONNECT", s[s.EVENT = 2] = "EVENT", s[s.ACK = 3] = "ACK", s[s.CONNECT_ERROR = 4] = "CONNECT_ERROR", s[s.BINARY_EVENT = 5] = "BINARY_EVENT", s[s.BINARY_ACK = 6] = "BINARY_ACK";
})(a || (a = {}));
class ft {
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
    return (e.type === a.EVENT || e.type === a.ACK) && N(e) ? this.encodeAsBinary({
      type: e.type === a.EVENT ? a.BINARY_EVENT : a.BINARY_ACK,
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
    return (e.type === a.BINARY_EVENT || e.type === a.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = at(e), n = this.encodeAsString(t.packet), i = t.buffers;
    return i.unshift(n), i;
  }
}
function oe(s) {
  return Object.prototype.toString.call(s) === "[object Object]";
}
class X extends f {
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
      const n = t.type === a.BINARY_EVENT;
      n || t.type === a.BINARY_ACK ? (t.type = n ? a.EVENT : a.ACK, this.reconstructor = new dt(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (G(e) || e.base64)
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
    if (a[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === a.BINARY_EVENT || n.type === a.BINARY_ACK) {
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
      if (X.isPayloadValid(n.type, r))
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
      case a.CONNECT:
        return oe(t);
      case a.DISCONNECT:
        return t === void 0;
      case a.CONNECT_ERROR:
        return typeof t == "string" || oe(t);
      case a.EVENT:
      case a.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && lt.indexOf(t[0]) === -1);
      case a.ACK:
      case a.BINARY_ACK:
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
class dt {
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
      const t = ht(this.reconPack, this.buffers);
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
const pt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: X,
  Encoder: ft,
  get PacketType() {
    return a;
  },
  protocol: ut
}, Symbol.toStringTag, { value: "Module" }));
function p(s, e, t) {
  return s.on(e, t), function() {
    s.off(e, t);
  };
}
const mt = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class ke extends f {
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
      p(e, "open", this.onopen.bind(this)),
      p(e, "packet", this.onpacket.bind(this)),
      p(e, "error", this.onerror.bind(this)),
      p(e, "close", this.onclose.bind(this))
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
    if (mt.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const n = {
      type: a.EVENT,
      data: t
    };
    if (n.options = {}, n.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const o = this.ids++, c = t.pop();
      this._registerAckCallback(o, c), n.id = o;
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
      for (let c = 0; c < this.sendBuffer.length; c++)
        this.sendBuffer[c].id === e && this.sendBuffer.splice(c, 1);
      t.call(this, new Error("operation has timed out"));
    }, i), o = (...c) => {
      this.io.clearTimeoutFn(r), t.apply(this, c);
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
      const r = (o, c) => o ? i(o) : n(c);
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
      type: a.CONNECT,
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
        case a.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case a.EVENT:
        case a.BINARY_EVENT:
          this.onevent(e);
          break;
        case a.ACK:
        case a.BINARY_ACK:
          this.onack(e);
          break;
        case a.DISCONNECT:
          this.ondisconnect();
          break;
        case a.CONNECT_ERROR:
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
        type: a.ACK,
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
    return this.connected && this.packet({ type: a.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
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
function v(s) {
  s = s || {}, this.ms = s.min || 100, this.max = s.max || 1e4, this.factor = s.factor || 2, this.jitter = s.jitter > 0 && s.jitter <= 1 ? s.jitter : 0, this.attempts = 0;
}
v.prototype.duration = function() {
  var s = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * s);
    s = Math.floor(e * 10) & 1 ? s + t : s - t;
  }
  return Math.min(s, this.max) | 0;
};
v.prototype.reset = function() {
  this.attempts = 0;
};
v.prototype.setMin = function(s) {
  this.ms = s;
};
v.prototype.setMax = function(s) {
  this.max = s;
};
v.prototype.setJitter = function(s) {
  this.jitter = s;
};
class $ extends f {
  constructor(e, t) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, P(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((n = t.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new v({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const i = t.parser || pt;
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
    this.engine = new _e(this.uri, this.opts);
    const t = this.engine, n = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = p(t, "open", function() {
      n.onopen(), e && e();
    }), r = (c) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", c), e ? e(c) : this.maybeReconnectOnOpen();
    }, o = p(t, "error", r);
    if (this._timeout !== !1) {
      const c = this._timeout, h = this.setTimeoutFn(() => {
        i(), r(new Error("timeout")), t.close();
      }, c);
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
    this.subs.push(p(e, "ping", this.onping.bind(this)), p(e, "data", this.ondata.bind(this)), p(e, "error", this.onerror.bind(this)), p(e, "close", this.onclose.bind(this)), p(this.decoder, "decoded", this.ondecoded.bind(this)));
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
    z(() => {
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
    return n ? this._autoConnect && !n.active && n.connect() : (n = new ke(this, e, t), this.nsps[e] = n), n;
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
const b = {};
function B(s, e) {
  typeof s == "object" && (e = s, s = void 0), e = e || {};
  const t = nt(s, e.path || "/socket.io"), n = t.source, i = t.id, r = t.path, o = b[i] && r in b[i].nsps, c = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let h;
  return c ? h = new $(n, e) : (b[i] || (b[i] = new $(n, e)), h = b[i]), t.query && !e.query && (e.query = t.queryKey), h.socket(t.path, e);
}
Object.assign(B, {
  Manager: $,
  Socket: ke,
  io: B,
  connect: B
});
const yt = async (s, e) => {
  const { idInstance: t, apiTokenInstance: n } = e, i = `${e.apiUrl}/waInstance${t}/call/${n}`;
  return fetch(i, {
    method: "POST",
    body: JSON.stringify({ phoneNumber: s }),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
class gt extends Error {
}
function Et(s, e) {
  const t = new Promise((n, i) => {
    setTimeout(() => i(new gt()), e);
  });
  return Promise.race([s, t]);
}
class ce {
  constructor({ id: e }) {
    u(this, "id");
    this.id = e;
  }
}
var l = /* @__PURE__ */ ((s) => (s.JOIN = "join", s.LEAVE = "leave", s.ADD_PEER = "add-peer", s.REMOVE_PEER = "remove-peer", s.RELAY_SDP = "relay-sdp", s.RELAY_ICE = "relay-ice", s.ICE_CANDIDATE = "ice-candidate", s.SESSION_DESCRIPTION = "session-description", s.INCOMING_CALL = "incoming-call", s.INCOMING_CALL_ANSWER = "incoming-call-answer", s.START_INCOMING_CALL = "start-incoming-call", s.END_CALL = "end-call", s.CALL_STATE = "call-state", s.LOCAL_STREAM_READY = "local-stream-ready", s.REMOTE_STREAM_READY = "remote-stream-ready", s.SOCKET_CONNECT = "socket-connect", s.SOCKET_DISCONNECT = "socket-disconnect", s))(l || {}), x = /* @__PURE__ */ ((s) => (s[s.WACallStateNone = 0] = "WACallStateNone", s[s.WACallStateCalling = 1] = "WACallStateCalling", s[s.WACallStatePreacceptReceived = 2] = "WACallStatePreacceptReceived", s[s.WACallStateReceivedCall = 3] = "WACallStateReceivedCall", s[s.WACallStateAcceptSent = 4] = "WACallStateAcceptSent", s[s.WACallStateAcceptReceived = 5] = "WACallStateAcceptReceived", s[s.WACallStateCallActive = 6] = "WACallStateCallActive", s[s.WACallStateCallActiveElseWhere = 7] = "WACallStateCallActiveElseWhere", s[s.WACallStateReceivedCallWithoutOffer = 8] = "WACallStateReceivedCallWithoutOffer", s))(x || {}), I = /* @__PURE__ */ ((s) => (s.CALLING = "CALLING", s.CALL_RECEIVED = "CALL_RECEIVED", s.IN_CALL = "IN_CALL", s))(I || {});
const kt = "https://api.green-api.com/";
var A = /* @__PURE__ */ ((s) => (s[s.SELF = 0] = "SELF", s[s.REMOTE = 1] = "REMOTE", s[s.REJECTED = 2] = "REJECTED", s[s.TIMEOUT = 3] = "TIMEOUT", s))(A || {});
class ae extends Error {
  constructor() {
    super("No provided idInstance and apiTokenInstance");
  }
}
class wt extends Error {
  constructor() {
    super("Already in call");
  }
}
class q extends Error {
  constructor() {
    super("No active call");
  }
}
class he extends Error {
  constructor() {
    super("Cannot get capture of audio or video");
  }
}
class Ct extends Error {
}
class vt extends Error {
  constructor() {
    super("Signaling error");
  }
}
class le extends Error {
  constructor() {
    super("No active incoming call");
  }
}
class _t extends Error {
  constructor() {
    super("Active incoming call");
  }
}
class At extends EventTarget {
  constructor() {
    super();
    u(this, "socket");
    u(this, "connectPromise", Promise.resolve());
    u(this, "peerConnections", {});
    u(this, "localMediaStream", null);
    u(this, "remoteMediaStream", null);
    u(this, "options", null);
    u(this, "incomingCallTimeout", null);
    u(this, "call", null);
    u(this, "iceServers", JSON.parse(
      '[{"urls":["stun:stun.l.google.com:19302"]},{"urls":["stun:stun1.l.google.com:19302"]},{"urls":["stun:stun2.l.google.com:19302"]},{"urls":["stun:stun3.l.google.com:19302"]},{"urls":["stun:stun4.l.google.com:19302"]},{"urls":["stun:stun.ekiga.net"]},{"urls":["stun:stun.stunprotocol.org:3478"]},{"urls":["stun:stun.voipbuster.com"]},{"urls":["stun:stun.voipstunt.com"]},{"urls":["turn:89.169.143.118:3478?transport=udp","turn:89.169.143.118:3478?transport=tcp"],"username":"slonway","credential":"123456789"}]'.replace(/\n/g, "").replace(/\s/g, "")
    ));
    //#region socket events
    u(this, "onNewPeer", async ({ peerID: t, createOffer: n }) => {
      if (t in this.peerConnections) {
        console.warn(`Already connected to peer ${t}`);
        return;
      }
      if (this.localMediaStream == null) {
        console.warn(`Local media stream in not available while new peer handled ${t}`);
        return;
      }
      this.peerConnections[t] = new RTCPeerConnection({
        iceServers: this.iceServers
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
    u(this, "onRemovePeer", ({ peerID: t }) => {
      t in this.peerConnections && this.peerConnections[t].close(), this.peerConnections[t] && delete this.peerConnections[t];
    });
    u(this, "onRemoteMedia", async ({ peerID: t, sessionDescription: n }) => {
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
    u(this, "onIceCandidate", async ({ peerID: t, iceCandidate: n }) => {
      await this.peerConnections[t].addIceCandidate(new RTCIceCandidate(n));
    });
    u(this, "onIncomingCall", (t) => {
      this.incomingCallTimeout = setTimeout(() => {
        this.incomingCallTimeout = null, this.dispatchEvent(
          new CustomEvent(l.END_CALL, { detail: { type: A.TIMEOUT } })
        );
      }, t.timeout * 1e3), this.call = new ce({ id: t.info.callId }), this.dispatchEvent(new CustomEvent(l.INCOMING_CALL, { detail: t }));
    });
    u(this, "onCallState", (t) => {
      const i = (/* @__PURE__ */ new Map([
        // [0, 'none'],
        [x.WACallStateCalling, I.CALLING],
        [x.WACallStatePreacceptReceived, I.CALL_RECEIVED],
        // [3, 'received_call'],
        // [4, 'accept_sent'],
        // [5, 'accept_received'],
        [x.WACallStateCallActive, I.IN_CALL]
        // [8, 'received_call_without_offer'],
      ])).get(t.info.info.callInfo.call_state);
      if (i == null) {
        console.log(`payload.info.info.callInfo.call_state: ${t.info.info.callInfo.call_state}`);
        return;
      }
      this.dispatchEvent(new CustomEvent(l.CALL_STATE, {
        detail: {
          state: i
        }
      }));
    });
    u(this, "onEndCall", (t) => {
      this.clearIncomingCallTimeout(), this.socket.emit(l.LEAVE, { callID: this.options.idInstance }), this.call = null, this.dispatchEvent(
        new CustomEvent(l.END_CALL, {
          detail: { type: A.REMOTE, payload: t }
        })
      );
    });
    u(this, "onSocketConnect", () => {
      this.dispatchEvent(new CustomEvent(l.SOCKET_CONNECT));
    });
    u(this, "onSocketDisconnect", (t) => {
      this.dispatchEvent(new CustomEvent(l.SOCKET_DISCONNECT, { detail: t }));
    });
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
    var r;
    if (this.options = t, (r = this.socket) != null && r.connected)
      return;
    const i = `https://${t.idInstance.slice(0, 4)}.voip.green-api.com`;
    return this.initSocket(i), this.socket.auth = {
      idInstance: this.options.idInstance,
      apiInstanceToken: this.options.apiTokenInstance,
      type: "external"
    }, this.socket.connect(), this.connectPromise;
  }
  initSocket(t) {
    let n;
    this.connectPromise = new Promise((i) => {
      n = i;
    }), this.socket = B(t, {
      transports: ["websocket"],
      autoConnect: !1
    }), this.socket.on("connect", () => {
      console.log("socket connected: ", this.socket.connected, this.socket), this.onSocketConnect(), n();
    }), this.socket.on("connect_error", (i) => {
      throw console.error(i), i;
    }), this.socket.on("disconnect", (i, r) => this.onSocketDisconnect({ reason: i, details: r })), this.socket.on(l.ADD_PEER, this.onNewPeer), this.socket.on(l.REMOVE_PEER, this.onRemovePeer), this.socket.on(l.SESSION_DESCRIPTION, this.onRemoteMedia), this.socket.on(l.ICE_CANDIDATE, this.onIceCandidate), this.socket.on(l.INCOMING_CALL, this.onIncomingCall), this.socket.on(l.CALL_STATE, this.onCallState), this.socket.on(l.END_CALL, this.onEndCall);
  }
  //#endregion
  /**
   * Method sends request to start whatsapp call.
   */
  async startCall(t, n = !0, i = !0) {
    if (!this.options)
      throw new ae();
    if (this.call !== null)
      throw new wt();
    try {
      this.incomingCallTimeout !== null && (this.clearIncomingCallTimeout(), await this.rejectCall()), this.localMediaStream = await this.startCapture({ audio: n, video: i }), this.dispatchEvent(
        new CustomEvent(l.LOCAL_STREAM_READY, { detail: this.localMediaStream })
      );
    } catch {
      throw new he();
    }
    const r = await yt(t, this.options);
    if (r.status === 200) {
      const { callId: c } = await r.json();
      this.call = new ce({ id: c });
    } else {
      const { message: c } = await r.json();
      throw new Ct(c);
    }
    if (!await this.socket.emitWithAck(l.JOIN, { callID: this.options.idInstance }))
      throw this.call = null, new vt();
  }
  /**
   * Method accepts incoming call from whatsapp.
   */
  async acceptCall(t = !0, n = !0) {
    if (!this.options)
      throw new ae();
    if (this.call === null)
      throw new q();
    if (this.incomingCallTimeout === null)
      throw new le();
    this.clearIncomingCallTimeout();
    try {
      this.localMediaStream = await this.startCapture({ audio: t, video: n }), this.dispatchEvent(
        new CustomEvent(l.LOCAL_STREAM_READY, { detail: this.localMediaStream })
      );
    } catch {
      throw new he();
    }
    this.socket.emit(l.INCOMING_CALL_ANSWER, { reject: !1 }), this.socket.emit(l.JOIN, { callID: this.options.idInstance });
  }
  /**
   * Method rejects incoming call from whatsapp.
   */
  async rejectCall() {
    if (this.call === null)
      throw new q();
    if (this.incomingCallTimeout === null)
      throw new le();
    this.dispatchEvent(
      new CustomEvent(l.END_CALL, { detail: { type: A.REJECTED } })
    ), this.socket.emit(l.INCOMING_CALL_ANSWER, { reject: !0 });
  }
  /**
   * Method closes p2p connection and sends event, that you disconnect from call room to all participants.
   */
  async endCall() {
    var t;
    if (this.call === null)
      throw new q();
    if (this.incomingCallTimeout !== null)
      throw new _t();
    try {
      (t = this.localMediaStream) == null || t.getTracks().forEach((i) => i.stop());
      for (const i in this.peerConnections)
        i in this.peerConnections && (this.peerConnections[i].close(), delete this.peerConnections[i]);
      return await Et(this.socket.emitWithAck(l.END_CALL, {}), 5e3) ? (this.call = null, this.dispatchEvent(
        new CustomEvent(l.END_CALL, { detail: { type: A.SELF } })
      ), !0) : !1;
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
  kt as API_URL,
  l as Actions,
  _t as ActiveIncomingCallError,
  wt as AlreadyInCallError,
  ae as AuthError,
  I as CallState,
  A as EndCallReasonEnum,
  At as GreenApiVoipClient,
  he as MediaStreamError,
  q as NoActiveCallError,
  le as NoActiveIncomingCallError,
  vt as SignalingError,
  Ct as StartCallError,
  x as WACallState
};
