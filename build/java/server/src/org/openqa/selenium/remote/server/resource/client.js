function aa() {
  return function() {
  }
}
function ba(a) {
  return function(b) {
    this[a] = b
  }
}
function e(a) {
  return function() {
    return this[a]
  }
}
function p(a) {
  return function() {
    return a
  }
}
var q, r = this;
function ca(a) {
  a = a.split(".");
  for(var b = r, c;c = a.shift();) {
    if(null != b[c]) {
      b = b[c]
    }else {
      return null
    }
  }
  return b
}
function t() {
}
function da(a) {
  a.Qa = function() {
    return a.Ne ? a.Ne : a.Ne = new a
  }
}
function ea(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
}
function fa(a) {
  return void 0 !== a
}
function u(a) {
  return"array" == ea(a)
}
function ha(a) {
  var b = ea(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function v(a) {
  return"string" == typeof a
}
function ia(a) {
  return"function" == ea(a)
}
function ja(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
}
function ka(a) {
  return a[la] || (a[la] = ++oa)
}
var la = "closure_uid_" + (1E9 * Math.random() >>> 0), oa = 0;
function pa(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function qa(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}
function x(a, b, c) {
  x = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? pa : qa;
  return x.apply(null, arguments)
}
function ra(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
}
var sa = Date.now || function() {
  return+new Date
};
function y(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.b = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
}
;function ta(a, b) {
  this.code = a;
  this.state = ua[a] || va;
  this.message = b || "";
  var c = this.state.replace(/((?:^|\s+)[a-z])/g, function(a) {
    return a.toUpperCase().replace(/^[\s\xa0]+/g, "")
  }), d = c.length - 5;
  if(0 > d || c.indexOf("Error", d) != d) {
    c += "Error"
  }
  this.name = c;
  c = Error(this.message);
  c.name = this.name;
  this.stack = c.stack || ""
}
y(ta, Error);
var va = "unknown error", ua = {15:"element not selectable", 11:"element not visible", 31:"ime engine activation failed", 30:"ime not available", 24:"invalid cookie domain", 29:"invalid element coordinates", 12:"invalid element state", 32:"invalid selector", 51:"invalid selector", 52:"invalid selector", 17:"javascript error", 405:"unsupported operation", 34:"move target out of bounds", 27:"no such alert", 7:"no such element", 8:"no such frame", 23:"no such window", 28:"script timeout", 33:"session not created", 
10:"stale element reference", 0:"success", 21:"timeout", 25:"unable to set cookie", 26:"unexpected alert open"};
ua[13] = va;
ua[9] = "unknown command";
ta.prototype.toString = function() {
  return this.name + ": " + this.message
};
function wa(a) {
  var b = a.status;
  if(0 == b) {
    return a
  }
  b = b || 13;
  a = a.value;
  if(!a || !ja(a)) {
    throw new ta(b, a + "");
  }
  throw new ta(b, a.message + "");
}
;function xa() {
  0 != ya && (this.th = Error().stack, za[ka(this)] = this)
}
var ya = 0, za = {};
xa.prototype.Mc = !1;
xa.prototype.B = function() {
  if(!this.Mc && (this.Mc = !0, this.g(), 0 != ya)) {
    var a = ka(this);
    delete za[a]
  }
};
xa.prototype.g = function() {
  if(this.sc) {
    for(;this.sc.length;) {
      this.sc.shift()()
    }
  }
};
function Aa(a) {
  a && "function" == typeof a.B && a.B()
}
;function Ba(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, Ba) : this.stack = Error().stack || "";
  a && (this.message = String(a))
}
y(Ba, Error);
Ba.prototype.name = "CustomError";
function Ca(a, b) {
  for(var c = a.split("%s"), d = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < c.length;) {
    d += c.shift() + f.shift()
  }
  return d + c.join("%s")
}
function Da(a) {
  if(!Ea.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(Fa, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(Ga, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(Ha, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(Ia, "&quot;"));
  return a
}
var Fa = /&/g, Ga = /</g, Ha = />/g, Ia = /\"/g, Ea = /[&<>\"]/;
function Ja(a, b) {
  return Array(b + 1).join(a)
}
function Ka(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
}
function La(a) {
  var b = v(void 0) ? "undefined".replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08") : "\\s";
  return a.replace(RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, f) {
    return b + f.toUpperCase()
  })
}
;function Ma(a, b) {
  b.unshift(a);
  Ba.call(this, Ca.apply(null, b));
  b.shift();
  this.Bh = a
}
y(Ma, Ba);
Ma.prototype.name = "AssertionError";
function Na(a, b) {
  throw new Ma("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;function Oa() {
  var a = Pa;
  return a[a.length - 1]
}
var z = Array.prototype, Qa = z.indexOf ? function(a, b, c) {
  return z.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(v(a)) {
    return v(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, A = z.forEach ? function(a, b, c) {
  z.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = v(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && b.call(c, f[g], g, a)
  }
}, Ra = z.filter ? function(a, b, c) {
  return z.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = [], g = 0, h = v(a) ? a.split("") : a, k = 0;k < d;k++) {
    if(k in h) {
      var l = h[k];
      b.call(c, l, k, a) && (f[g++] = l)
    }
  }
  return f
}, Sa = z.map ? function(a, b, c) {
  return z.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = Array(d), g = v(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in g && (f[h] = b.call(c, g[h], h, a))
  }
  return f
}, Ta = z.every ? function(a, b, c) {
  return z.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = v(a) ? a.split("") : a, g = 0;g < d;g++) {
    if(g in f && !b.call(c, f[g], g, a)) {
      return!1
    }
  }
  return!0
};
function Ua(a, b) {
  return 0 <= Qa(a, b)
}
function Va(a, b) {
  var c = Qa(a, b), d;
  (d = 0 <= c) && z.splice.call(a, c, 1);
  return d
}
function Wa(a) {
  return z.concat.apply(z, arguments)
}
function Xa(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
function Ya(a, b, c, d) {
  z.splice.apply(a, Za(arguments, 1))
}
function Za(a, b, c) {
  return 2 >= arguments.length ? z.slice.call(a, b) : z.slice.call(a, b, c)
}
;function $a(a, b) {
  for(var c in a) {
    b.call(void 0, a[c], c, a)
  }
}
function ab(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function bb(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var cb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function db(a, b) {
  for(var c, d, f = 1;f < arguments.length;f++) {
    d = arguments[f];
    for(c in d) {
      a[c] = d[c]
    }
    for(var g = 0;g < cb.length;g++) {
      c = cb[g], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
function eb(a) {
  var b = arguments.length;
  if(1 == b && u(arguments[0])) {
    return eb.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
}
;function fb(a) {
  if("function" == typeof a.fa) {
    return a.fa()
  }
  if(v(a)) {
    return a.split("")
  }
  if(ha(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return ab(a)
}
function gb(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ha(a) || v(a)) {
      A(a, b, c)
    }else {
      var d;
      if("function" == typeof a.Eb) {
        d = a.Eb()
      }else {
        if("function" != typeof a.fa) {
          if(ha(a) || v(a)) {
            d = [];
            for(var f = a.length, g = 0;g < f;g++) {
              d.push(g)
            }
          }else {
            d = bb(a)
          }
        }else {
          d = void 0
        }
      }
      for(var f = fb(a), g = f.length, h = 0;h < g;h++) {
        b.call(c, f[h], d && d[h], a)
      }
    }
  }
}
;function hb(a, b) {
  this.R = {};
  this.w = [];
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.qd(a)
  }
}
q = hb.prototype;
q.l = 0;
q.oe = 0;
q.fa = function() {
  ib(this);
  for(var a = [], b = 0;b < this.w.length;b++) {
    a.push(this.R[this.w[b]])
  }
  return a
};
q.Eb = function() {
  ib(this);
  return this.w.concat()
};
q.yb = function(a) {
  return jb(this.R, a)
};
q.clear = function() {
  this.R = {};
  this.oe = this.l = this.w.length = 0
};
q.remove = function(a) {
  return jb(this.R, a) ? (delete this.R[a], this.l--, this.oe++, this.w.length > 2 * this.l && ib(this), !0) : !1
};
function ib(a) {
  if(a.l != a.w.length) {
    for(var b = 0, c = 0;b < a.w.length;) {
      var d = a.w[b];
      jb(a.R, d) && (a.w[c++] = d);
      b++
    }
    a.w.length = c
  }
  if(a.l != a.w.length) {
    for(var f = {}, c = b = 0;b < a.w.length;) {
      d = a.w[b], jb(f, d) || (a.w[c++] = d, f[d] = 1), b++
    }
    a.w.length = c
  }
}
q.get = function(a, b) {
  return jb(this.R, a) ? this.R[a] : b
};
q.set = function(a, b) {
  jb(this.R, a) || (this.l++, this.w.push(a), this.oe++);
  this.R[a] = b
};
q.qd = function(a) {
  var b;
  a instanceof hb ? (b = a.Eb(), a = a.fa()) : (b = bb(a), a = ab(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
q.ca = function() {
  return new hb(this)
};
function jb(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;var kb, lb, mb, nb, ob;
function pb() {
  return r.navigator ? r.navigator.userAgent : null
}
function qb() {
  return r.navigator
}
nb = mb = lb = kb = !1;
var rb;
if(rb = pb()) {
  var sb = qb();
  kb = 0 == rb.indexOf("Opera");
  lb = !kb && -1 != rb.indexOf("MSIE");
  mb = !kb && -1 != rb.indexOf("WebKit");
  nb = !kb && !mb && "Gecko" == sb.product
}
var B = kb, C = lb, D = nb, G = mb, tb = qb();
ob = -1 != (tb && tb.platform || "").indexOf("Mac");
var ub = !!qb() && -1 != (qb().appVersion || "").indexOf("X11");
function vb() {
  var a = r.document;
  return a ? a.documentMode : void 0
}
var wb;
a: {
  var xb = "", yb;
  if(B && r.opera) {
    var zb = r.opera.version, xb = "function" == typeof zb ? zb() : zb
  }else {
    if(D ? yb = /rv\:([^\);]+)(\)|;)/ : C ? yb = /MSIE\s+([^\);]+)(\)|;)/ : G && (yb = /WebKit\/(\S+)/), yb) {
      var Ab = yb.exec(pb()), xb = Ab ? Ab[1] : ""
    }
  }
  if(C) {
    var Bb = vb();
    if(Bb > parseFloat(xb)) {
      wb = String(Bb);
      break a
    }
  }
  wb = xb
}
var Cb = {};
function H(a) {
  var b;
  if(!(b = Cb[a])) {
    b = 0;
    for(var c = String(wb).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(c.length, d.length), g = 0;0 == b && g < f;g++) {
      var h = c[g] || "", k = d[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), n = RegExp("(\\d*)(\\D*)", "g");
      do {
        var m = l.exec(h) || ["", "", ""], s = n.exec(k) || ["", "", ""];
        if(0 == m[0].length && 0 == s[0].length) {
          break
        }
        b = ((0 == m[1].length ? 0 : parseInt(m[1], 10)) < (0 == s[1].length ? 0 : parseInt(s[1], 10)) ? -1 : (0 == m[1].length ? 0 : parseInt(m[1], 10)) > (0 == s[1].length ? 0 : parseInt(s[1], 10)) ? 1 : 0) || ((0 == m[2].length) < (0 == s[2].length) ? -1 : (0 == m[2].length) > (0 == s[2].length) ? 1 : 0) || (m[2] < s[2] ? -1 : m[2] > s[2] ? 1 : 0)
      }while(0 == b)
    }
    b = Cb[a] = 0 <= b
  }
  return b
}
function Db(a) {
  return C && Eb >= a
}
var Fb = r.document, Eb = Fb && C ? vb() || ("CSS1Compat" == Fb.compatMode ? parseInt(wb, 10) : 5) : void 0;
var Gb = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function Hb(a) {
  if(Ib) {
    Ib = !1;
    var b = r.location;
    if(b) {
      var c = b.href;
      if(c && (c = (c = Hb(c)[3] || null) && decodeURIComponent(c)) && c != b.hostname) {
        throw Ib = !0, Error();
      }
    }
  }
  return a.match(Gb)
}
var Ib = G;
function Jb(a, b) {
  var c;
  if(a instanceof Jb) {
    this.ka = fa(b) ? b : a.ka, Kb(this, a.Ub), c = a.od, Lb(this), this.od = c, c = a.gc, Lb(this), this.gc = c, Mb(this, a.fd), c = a.qb, Lb(this), this.qb = c, Nb(this, a.Ja.ca()), c = a.Pc, Lb(this), this.Pc = c
  }else {
    if(a && (c = Hb(String(a)))) {
      this.ka = !!b;
      Kb(this, c[1] || "", !0);
      var d = c[2] || "";
      Lb(this);
      this.od = d ? decodeURIComponent(d) : "";
      d = c[3] || "";
      Lb(this);
      this.gc = d ? decodeURIComponent(d) : "";
      Mb(this, c[4]);
      d = c[5] || "";
      Lb(this);
      this.qb = d ? decodeURIComponent(d) : "";
      Nb(this, c[6] || "", !0);
      c = c[7] || "";
      Lb(this);
      this.Pc = c ? decodeURIComponent(c) : ""
    }else {
      this.ka = !!b, this.Ja = new Ob(null, 0, this.ka)
    }
  }
}
q = Jb.prototype;
q.Ub = "";
q.od = "";
q.gc = "";
q.fd = null;
q.qb = "";
q.Pc = "";
q.vg = !1;
q.ka = !1;
q.toString = function() {
  var a = [], b = this.Ub;
  b && a.push(Pb(b, Qb), ":");
  if(b = this.gc) {
    a.push("//");
    var c = this.od;
    c && a.push(Pb(c, Qb), "@");
    a.push(encodeURIComponent(String(b)));
    b = this.fd;
    null != b && a.push(":", String(b))
  }
  if(b = this.qb) {
    this.gc && "/" != b.charAt(0) && a.push("/"), a.push(Pb(b, "/" == b.charAt(0) ? Rb : Sb))
  }
  (b = this.Ja.toString()) && a.push("?", b);
  (b = this.Pc) && a.push("#", Pb(b, Tb));
  return a.join("")
};
q.ca = function() {
  return new Jb(this)
};
function Kb(a, b, c) {
  Lb(a);
  a.Ub = c ? b ? decodeURIComponent(b) : "" : b;
  a.Ub && (a.Ub = a.Ub.replace(/:$/, ""))
}
function Mb(a, b) {
  Lb(a);
  if(b) {
    b = Number(b);
    if(isNaN(b) || 0 > b) {
      throw Error("Bad port number " + b);
    }
    a.fd = b
  }else {
    a.fd = null
  }
}
function Nb(a, b, c) {
  Lb(a);
  b instanceof Ob ? (a.Ja = b, a.Ja.je(a.ka)) : (c || (b = Pb(b, Ub)), a.Ja = new Ob(b, 0, a.ka))
}
function Lb(a) {
  if(a.vg) {
    throw Error("Tried to modify a read-only Uri");
  }
}
q.je = function(a) {
  this.ka = a;
  this.Ja && this.Ja.je(a);
  return this
};
function Pb(a, b) {
  return v(a) ? encodeURI(a).replace(b, Vb) : null
}
function Vb(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Qb = /[#\/\?@]/g, Sb = /[\#\?:]/g, Rb = /[\#\?]/g, Ub = /[\#\?@]/g, Tb = /#/g;
function Ob(a, b, c) {
  this.da = a || null;
  this.ka = !!c
}
function Wb(a) {
  if(!a.v && (a.v = new hb, a.l = 0, a.da)) {
    for(var b = a.da.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), f = null, g = null;
      0 <= d ? (f = b[c].substring(0, d), g = b[c].substring(d + 1)) : f = b[c];
      f = decodeURIComponent(f.replace(/\+/g, " "));
      f = Xb(a, f);
      a.add(f, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "")
    }
  }
}
q = Ob.prototype;
q.v = null;
q.l = null;
q.add = function(a, b) {
  Wb(this);
  this.da = null;
  a = Xb(this, a);
  var c = this.v.get(a);
  c || this.v.set(a, c = []);
  c.push(b);
  this.l++;
  return this
};
q.remove = function(a) {
  Wb(this);
  a = Xb(this, a);
  return this.v.yb(a) ? (this.da = null, this.l -= this.v.get(a).length, this.v.remove(a)) : !1
};
q.clear = function() {
  this.v = this.da = null;
  this.l = 0
};
q.yb = function(a) {
  Wb(this);
  a = Xb(this, a);
  return this.v.yb(a)
};
q.Eb = function() {
  Wb(this);
  for(var a = this.v.fa(), b = this.v.Eb(), c = [], d = 0;d < b.length;d++) {
    for(var f = a[d], g = 0;g < f.length;g++) {
      c.push(b[d])
    }
  }
  return c
};
q.fa = function(a) {
  Wb(this);
  var b = [];
  if(a) {
    this.yb(a) && (b = Wa(b, this.v.get(Xb(this, a))))
  }else {
    a = this.v.fa();
    for(var c = 0;c < a.length;c++) {
      b = Wa(b, a[c])
    }
  }
  return b
};
q.set = function(a, b) {
  Wb(this);
  this.da = null;
  a = Xb(this, a);
  this.yb(a) && (this.l -= this.v.get(a).length);
  this.v.set(a, [b]);
  this.l++;
  return this
};
q.get = function(a, b) {
  var c = a ? this.fa(a) : [];
  return 0 < c.length ? String(c[0]) : b
};
q.toString = function() {
  if(this.da) {
    return this.da
  }
  if(!this.v) {
    return""
  }
  for(var a = [], b = this.v.Eb(), c = 0;c < b.length;c++) {
    for(var d = b[c], f = encodeURIComponent(String(d)), d = this.fa(d), g = 0;g < d.length;g++) {
      var h = f;
      "" !== d[g] && (h += "=" + encodeURIComponent(String(d[g])));
      a.push(h)
    }
  }
  return this.da = a.join("&")
};
q.ca = function() {
  var a = new Ob;
  a.da = this.da;
  this.v && (a.v = this.v.ca(), a.l = this.l);
  return a
};
function Xb(a, b) {
  var c = String(b);
  a.ka && (c = c.toLowerCase());
  return c
}
q.je = function(a) {
  a && !this.ka && (Wb(this), this.da = null, gb(this.v, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.remove(d), 0 < a.length && (this.da = null, this.v.set(Xb(this, d), Xa(a)), this.l += a.length))
  }, this));
  this.ka = a
};
function Yb(a) {
  this.R = new hb;
  a && this.qd(a)
}
function Zb(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ka(a) : b.substr(0, 1) + a
}
q = Yb.prototype;
q.add = function(a) {
  this.R.set(Zb(a), a)
};
q.qd = function(a) {
  a = fb(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
q.Za = function(a) {
  a = fb(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
q.remove = function(a) {
  return this.R.remove(Zb(a))
};
q.clear = function() {
  this.R.clear()
};
q.contains = function(a) {
  return this.R.yb(Zb(a))
};
q.Oe = function(a) {
  var b = new Yb;
  a = fb(a);
  for(var c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d)
  }
  return b
};
q.fa = function() {
  return this.R.fa()
};
q.ca = function() {
  return new Yb(this)
};
function $b(a) {
  return bc(a || arguments.callee.caller, [])
}
function bc(a, b) {
  var c = [];
  if(Ua(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(cc(a) + "(");
      for(var d = a.arguments, f = 0;f < d.length;f++) {
        0 < f && c.push(", ");
        var g;
        g = d[f];
        switch(typeof g) {
          case "object":
            g = g ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            g = String(g);
            break;
          case "boolean":
            g = g ? "true" : "false";
            break;
          case "function":
            g = (g = cc(g)) ? g : "[fn]";
            break;
          default:
            g = typeof g
        }
        40 < g.length && (g = g.substr(0, 40) + "...");
        c.push(g)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(bc(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function cc(a) {
  if(dc[a]) {
    return dc[a]
  }
  a = String(a);
  if(!dc[a]) {
    var b = /function ([^\(]+)/.exec(a);
    dc[a] = b ? b[1] : "[Anonymous]"
  }
  return dc[a]
}
var dc = {};
function ec(a, b, c, d, f) {
  this.reset(a, b, c, d, f)
}
ec.prototype.eh = 0;
ec.prototype.Fd = null;
ec.prototype.Ed = null;
var fc = 0;
ec.prototype.reset = function(a, b, c, d, f) {
  this.eh = "number" == typeof f ? f : fc++;
  this.Af = d || sa();
  this.ob = a;
  this.Yd = b;
  this.We = c;
  delete this.Fd;
  delete this.Ed
};
ec.prototype.qf = ba("ob");
ec.prototype.rf = ba("Yd");
function gc(a) {
  this.pb = a
}
gc.prototype.F = null;
gc.prototype.ob = null;
gc.prototype.n = null;
gc.prototype.Kb = null;
function hc(a, b) {
  this.name = a;
  this.value = b
}
hc.prototype.toString = e("name");
var ic = new hc("SHOUT", 1200), jc = new hc("SEVERE", 1E3), kc = new hc("WARNING", 900), lc = new hc("INFO", 800), mc = new hc("CONFIG", 700);
q = gc.prototype;
q.getName = e("pb");
q.getParent = e("F");
q.De = function() {
  this.n || (this.n = {});
  return this.n
};
q.qf = ba("ob");
function nc(a) {
  if(a.ob) {
    return a.ob
  }
  if(a.F) {
    return nc(a.F)
  }
  Na("Root logger has no level set.");
  return null
}
q.log = function(a, b, c) {
  if(a.value >= nc(this).value) {
    for(a = this.Yf(a, b, c), b = "log:" + a.Yd, r.console && (r.console.timeStamp ? r.console.timeStamp(b) : r.console.markTimeline && r.console.markTimeline(b)), r.msWriteProfilerMark && r.msWriteProfilerMark(b), b = this;b;) {
      c = b;
      var d = a;
      if(c.Kb) {
        for(var f = 0, g = void 0;g = c.Kb[f];f++) {
          g(d)
        }
      }
      b = b.getParent()
    }
  }
};
q.Yf = function(a, b, c) {
  var d = new ec(a, String(b), this.pb);
  if(c) {
    d.Fd = c;
    var f;
    var g = arguments.callee.caller;
    try {
      var h;
      var k = ca("window.location.href");
      if(v(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:k, stack:"Not available"}
      }else {
        var l, n, m = !1;
        try {
          l = c.lineNumber || c.zh || "Not available"
        }catch(s) {
          l = "Not available", m = !0
        }
        try {
          n = c.fileName || c.filename || c.sourceURL || r.$googDebugFname || k
        }catch(w) {
          n = "Not available", m = !0
        }
        h = !m && c.lineNumber && c.fileName && c.stack ? c : {message:c.message, name:c.name, lineNumber:l, fileName:n, stack:c.stack || "Not available"}
      }
      f = "Message: " + Da(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + Da(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + Da($b(g) + "-> ")
    }catch(ga) {
      f = "Exception trying to expose exception! You win, we lose. " + ga
    }
    d.Ed = f
  }
  return d
};
q.info = function(a, b) {
  this.log(lc, a, b)
};
var oc = {}, pc = null;
function qc() {
  pc || (pc = new gc(""), oc[""] = pc, pc.qf(mc))
}
function rc(a) {
  qc();
  var b;
  if(!(b = oc[a])) {
    b = new gc(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = rc(a.substr(0, c));
    c.De()[d] = b;
    b.F = c;
    oc[a] = b
  }
  return b
}
;function sc() {
  this.mf = sa()
}
var tc = new sc;
sc.prototype.set = ba("mf");
sc.prototype.reset = function() {
  this.set(sa())
};
sc.prototype.get = e("mf");
function uc(a) {
  this.$g = a || "";
  this.mh = tc
}
q = uc.prototype;
q.tf = !0;
q.jh = !0;
q.ih = !0;
q.vf = !1;
q.kh = !1;
function vc(a) {
  return 10 > a ? "0" + a : String(a)
}
function wc(a, b) {
  var c = (a.Af - b) / 1E3, d = c.toFixed(3), f = 0;
  if(1 > c) {
    f = 2
  }else {
    for(;100 > c;) {
      f++, c *= 10
    }
  }
  for(;0 < f--;) {
    d = " " + d
  }
  return d
}
function xc(a) {
  uc.call(this, a)
}
y(xc, uc);
function yc() {
  this.lf = x(this.Hf, this);
  this.Jd = new xc;
  this.Jd.tf = !1;
  this.Qe = this.Jd.vf = !1;
  this.Ve = "";
  this.Wf = {}
}
function zc(a, b) {
  if(b != a.Qe) {
    var c;
    qc();
    c = pc;
    if(b) {
      var d = a.lf;
      c.Kb || (c.Kb = []);
      c.Kb.push(d)
    }else {
      (c = c.Kb) && Va(c, a.lf), a.Ah = ""
    }
    a.Qe = b
  }
}
yc.prototype.Hf = function(a) {
  if(!this.Wf[a.We]) {
    var b;
    b = this.Jd;
    var c = [];
    c.push(b.$g, " ");
    if(b.tf) {
      var d = new Date(a.Af);
      c.push("[", vc(d.getFullYear() - 2E3) + vc(d.getMonth() + 1) + vc(d.getDate()) + " " + vc(d.getHours()) + ":" + vc(d.getMinutes()) + ":" + vc(d.getSeconds()) + "." + vc(Math.floor(d.getMilliseconds() / 10)), "] ")
    }
    b.jh && c.push("[", wc(a, b.mh.get()), "s] ");
    b.ih && c.push("[", a.We, "] ");
    b.kh && c.push("[", a.ob.name, "] ");
    c.push(a.Yd, "\n");
    b.vf && a.Fd && c.push(a.Ed, "\n");
    b = c.join("");
    if(c = Ac) {
      switch(a.ob) {
        case ic:
          Bc(c, "info", b);
          break;
        case jc:
          Bc(c, "error", b);
          break;
        case kc:
          Bc(c, "warn", b);
          break;
        default:
          Bc(c, "debug", b)
      }
    }else {
      window.opera ? window.opera.postError(b) : this.Ve += b
    }
  }
};
var Ac = window.console;
function Bc(a, b, c) {
  if(a[b]) {
    a[b](c)
  }else {
    a.log(c)
  }
}
;var Cc = !C || Db(9), Dc = !C || Db(9), Ec = C && !H("9");
!G || H("528");
D && H("1.9b") || C && H("8") || B && H("9.5") || G && H("528");
D && !H("8") || C && H("9");
function I(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
q = I.prototype;
q.g = aa();
q.B = aa();
q.Ya = !1;
q.defaultPrevented = !1;
q.of = !0;
q.stopPropagation = function() {
  this.Ya = !0
};
q.preventDefault = function() {
  this.defaultPrevented = !0;
  this.of = !1
};
function Fc(a) {
  a.preventDefault()
}
;function Gc(a) {
  Gc[" "](a);
  return a
}
Gc[" "] = t;
function Hc(a, b) {
  a && this.nb(a, b)
}
y(Hc, I);
var Ic = [1, 4, 2];
q = Hc.prototype;
q.target = null;
q.relatedTarget = null;
q.offsetX = 0;
q.offsetY = 0;
q.clientX = 0;
q.clientY = 0;
q.screenX = 0;
q.screenY = 0;
q.button = 0;
q.keyCode = 0;
q.charCode = 0;
q.ctrlKey = !1;
q.altKey = !1;
q.shiftKey = !1;
q.metaKey = !1;
q.ce = !1;
q.ra = null;
q.nb = function(a, b) {
  var c = this.type = a.type;
  I.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(D) {
      var f;
      a: {
        try {
          Gc(d.nodeName);
          f = !0;
          break a
        }catch(g) {
        }
        f = !1
      }
      f || (d = null)
    }
  }else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = G || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = G || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.ce = ob ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.ra = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Ya
};
function Jc(a) {
  return(Cc ? 0 == a.ra.button : "click" == a.type ? !0 : !!(a.ra.button & Ic[0])) && !(G && ob && a.ctrlKey)
}
q.stopPropagation = function() {
  Hc.b.stopPropagation.call(this);
  this.ra.stopPropagation ? this.ra.stopPropagation() : this.ra.cancelBubble = !0
};
q.preventDefault = function() {
  Hc.b.preventDefault.call(this);
  var a = this.ra;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, Ec) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
q.g = aa();
var Kc = "closure_listenable_" + (1E6 * Math.random() | 0);
function Lc(a) {
  return!(!a || !a[Kc])
}
var Mc = 0;
function Nc(a, b, c, d, f, g) {
  this.Ca = a;
  this.kf = b;
  this.src = c;
  this.type = d;
  this.capture = !!f;
  this.mb = g;
  this.key = ++Mc;
  this.ua = this.wb = !1
}
;var Oc = {}, Pc = {}, Qc = {}, Rc = {};
function J(a, b, c, d, f) {
  if(u(b)) {
    for(var g = 0;g < b.length;g++) {
      J(a, b[g], c, d, f)
    }
    return null
  }
  c = Sc(c);
  return Lc(a) ? a.h(b, c, d, f) : Tc(a, b, c, !1, d, f)
}
function Tc(a, b, c, d, f, g) {
  if(!b) {
    throw Error("Invalid event type");
  }
  f = !!f;
  var h = Pc;
  b in h || (h[b] = {l:0, Ka:0});
  h = h[b];
  f in h || (h[f] = {l:0, Ka:0}, h.l++);
  var h = h[f], k = ka(a), l;
  h.Ka++;
  if(h[k]) {
    l = h[k];
    for(var n = 0;n < l.length;n++) {
      if(h = l[n], h.Ca == c && h.mb == g) {
        if(h.ua) {
          break
        }
        d || (l[n].wb = !1);
        return l[n]
      }
    }
  }else {
    l = h[k] = [], h.l++
  }
  n = Uc();
  h = new Nc(c, n, a, b, f, g);
  h.wb = d;
  n.src = a;
  n.Ca = h;
  l.push(h);
  Qc[k] || (Qc[k] = []);
  Qc[k].push(h);
  a.addEventListener ? a.addEventListener(b, n, f) : a.attachEvent(b in Rc ? Rc[b] : Rc[b] = "on" + b, n);
  return Oc[h.key] = h
}
function Uc() {
  var a = Vc, b = Dc ? function(c) {
    return a.call(b.src, b.Ca, c)
  } : function(c) {
    c = a.call(b.src, b.Ca, c);
    if(!c) {
      return c
    }
  };
  return b
}
function Wc(a, b, c, d, f) {
  if(u(b)) {
    for(var g = 0;g < b.length;g++) {
      Wc(a, b[g], c, d, f)
    }
    return null
  }
  c = Sc(c);
  return Lc(a) ? a.Wd(b, c, d, f) : Tc(a, b, c, !0, d, f)
}
function Xc(a, b, c, d, f) {
  if(u(b)) {
    for(var g = 0;g < b.length;g++) {
      Xc(a, b[g], c, d, f)
    }
  }else {
    if(c = Sc(c), Lc(a)) {
      a.aa(b, c, d, f)
    }else {
      if(d = !!d, a = Yc(a, b, d)) {
        for(g = 0;g < a.length;g++) {
          if(a[g].Ca == c && a[g].capture == d && a[g].mb == f) {
            K(a[g]);
            break
          }
        }
      }
    }
  }
}
function K(a) {
  if("number" == typeof a || !a || a.ua) {
    return!1
  }
  var b = a.src;
  if(Lc(b)) {
    return Zc(b, a)
  }
  var c = a.type, d = a.kf, f = a.capture;
  b.removeEventListener ? b.removeEventListener(c, d, f) : b.detachEvent && b.detachEvent(c in Rc ? Rc[c] : Rc[c] = "on" + c, d);
  b = ka(b);
  Qc[b] && (d = Qc[b], Va(d, a), 0 == d.length && delete Qc[b]);
  a.ua = !0;
  a.Ca = null;
  a.kf = null;
  a.src = null;
  a.mb = null;
  if(d = Pc[c][f][b]) {
    d.$e = !0, $c(c, f, b, d)
  }
  delete Oc[a.key];
  return!0
}
function $c(a, b, c, d) {
  if(!d.ad && d.$e) {
    for(var f = 0, g = 0;f < d.length;f++) {
      d[f].ua || (f != g && (d[g] = d[f]), g++)
    }
    d.length = g;
    d.$e = !1;
    0 == g && (delete Pc[a][b][c], Pc[a][b].l--, 0 == Pc[a][b].l && (delete Pc[a][b], Pc[a].l--), 0 == Pc[a].l && delete Pc[a])
  }
}
function ad(a) {
  var b = 0;
  if(null != a) {
    if(a && Lc(a)) {
      a.hd(void 0)
    }else {
      if(a = ka(a), Qc[a]) {
        a = Qc[a];
        for(var c = a.length - 1;0 <= c;c--) {
          K(a[c]), b++
        }
      }
    }
  }else {
    $a(Oc, function(a) {
      K(a);
      b++
    })
  }
}
function Yc(a, b, c) {
  var d = Pc;
  return b in d && (d = d[b], c in d && (d = d[c], a = ka(a), d[a])) ? d[a] : null
}
function bd(a, b, c, d, f) {
  var g = 1;
  b = ka(b);
  if(a[b]) {
    var h = --a.Ka, k = a[b];
    k.ad ? k.ad++ : k.ad = 1;
    try {
      for(var l = k.length, n = 0;n < l;n++) {
        var m = k[n];
        m && !m.ua && (g &= !1 !== cd(m, f))
      }
    }finally {
      a.Ka = Math.max(h, a.Ka), k.ad--, $c(c, d, b, k)
    }
  }
  return Boolean(g)
}
function cd(a, b) {
  var c = a.Ca, d = a.mb || a.src;
  a.wb && K(a);
  return c.call(d, b)
}
function Vc(a, b) {
  if(a.ua) {
    return!0
  }
  var c = a.type, d = Pc;
  if(!(c in d)) {
    return!0
  }
  var d = d[c], f, g;
  if(!Dc) {
    f = b || ca("window.event");
    var h = !0 in d, k = !1 in d;
    if(h) {
      if(0 > f.keyCode || void 0 != f.returnValue) {
        return!0
      }
      a: {
        var l = !1;
        if(0 == f.keyCode) {
          try {
            f.keyCode = -1;
            break a
          }catch(n) {
            l = !0
          }
        }
        if(l || void 0 == f.returnValue) {
          f.returnValue = !0
        }
      }
    }
    l = new Hc;
    l.nb(f, this);
    f = !0;
    try {
      if(h) {
        for(var m = [], s = l.currentTarget;s;s = s.parentNode) {
          m.push(s)
        }
        g = d[!0];
        g.Ka = g.l;
        for(var w = m.length - 1;!l.Ya && 0 <= w && g.Ka;w--) {
          l.currentTarget = m[w], f &= bd(g, m[w], c, !0, l)
        }
        if(k) {
          for(g = d[!1], g.Ka = g.l, w = 0;!l.Ya && w < m.length && g.Ka;w++) {
            l.currentTarget = m[w], f &= bd(g, m[w], c, !1, l)
          }
        }
      }else {
        f = cd(a, l)
      }
    }finally {
      m && (m.length = 0)
    }
    return f
  }
  c = new Hc(b, this);
  return f = cd(a, c)
}
var dd = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
function Sc(a) {
  return ia(a) ? a : a[dd] || (a[dd] = function(b) {
    return a.handleEvent(b)
  })
}
;var ed, fd = !C || Db(9), gd = !D && !C || C && Db(9) || D && H("1.9.1"), hd = C && !H("9");
var id = "OPTION";
function jd(a) {
  a = a.className;
  return v(a) && a.match(/\S+/g) || []
}
function kd(a, b) {
  for(var c = jd(a), d = Za(arguments, 1), f = c.length + d.length, g = c, h = 0;h < d.length;h++) {
    Ua(g, d[h]) || g.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == f
}
function ld(a, b) {
  var c = jd(a), d = Za(arguments, 1), f = md(c, d);
  a.className = f.join(" ");
  return f.length == c.length - d.length
}
function md(a, b) {
  return Ra(a, function(a) {
    return!Ua(b, a)
  })
}
;function L(a, b) {
  this.x = fa(a) ? a : 0;
  this.y = fa(b) ? b : 0
}
L.prototype.ca = function() {
  return new L(this.x, this.y)
};
L.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
};
function nd(a, b) {
  return new L(a.x - b.x, a.y - b.y)
}
L.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this
};
L.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this
};
function od(a, b) {
  this.width = a;
  this.height = b
}
od.prototype.ca = function() {
  return new od(this.width, this.height)
};
od.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
};
od.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
od.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
function M(a) {
  return a ? new pd(N(a)) : ed || (ed = new pd)
}
function qd(a, b) {
  $a(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in rd ? a.setAttribute(rd[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var rd = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
function sd(a) {
  a = a.document;
  a = "CSS1Compat" == a.compatMode ? a.documentElement : a.body;
  return new od(a.clientWidth, a.clientHeight)
}
function td(a) {
  return G || "CSS1Compat" != a.compatMode ? a.body || a.documentElement : a.documentElement
}
function ud(a) {
  return a ? a.parentWindow || a.defaultView : window
}
function vd(a, b, c) {
  return wd(document, arguments)
}
function wd(a, b) {
  var c = b[0], d = b[1];
  if(!fd && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', Da(d.name), '"');
    if(d.type) {
      c.push(' type="', Da(d.type), '"');
      var f = {};
      db(f, d);
      delete f.type;
      d = f
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (v(d) ? c.className = d : u(d) ? kd.apply(null, [c].concat(d)) : qd(c, d));
  2 < b.length && xd(a, c, b, 2);
  return c
}
function xd(a, b, c, d) {
  function f(c) {
    c && b.appendChild(v(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var g = c[d];
    !ha(g) || ja(g) && 0 < g.nodeType ? f(g) : A(yd(g) ? Xa(g) : g, f)
  }
}
function zd(a, b) {
  xd(N(a), a, arguments, 1)
}
function Ad(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
}
function Bd(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
}
function Cd(a, b) {
  if(a.contains && 1 == b.nodeType) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
}
function N(a) {
  return 9 == a.nodeType ? a : a.ownerDocument || a.document
}
function Dd(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && 3 == a.firstChild.nodeType) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      Ad(a), a.appendChild(N(a).createTextNode(String(b)))
    }
  }
}
var Ed = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1}, Fd = {IMG:" ", BR:"\n"};
function Gd(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, "number" == typeof a && 0 <= a && 32768 > a) : !1
}
function Hd(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
}
function Id(a) {
  var b = [];
  Jd(a, b, !1);
  return b.join("")
}
function Jd(a, b, c) {
  if(!(a.nodeName in Ed)) {
    if(3 == a.nodeType) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in Fd) {
        b.push(Fd[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          Jd(a, b, c), a = a.nextSibling
        }
      }
    }
  }
}
function yd(a) {
  if(a && "number" == typeof a.length) {
    if(ja(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(ia(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
}
function pd(a) {
  this.r = a || r.document || document
}
q = pd.prototype;
q.j = M;
function O(a) {
  return a.r
}
q.a = function(a) {
  return v(a) ? this.r.getElementById(a) : a
};
q.c = function(a, b, c) {
  return wd(this.r, arguments)
};
q.createElement = function(a) {
  return this.r.createElement(a)
};
q.createTextNode = function(a) {
  return this.r.createTextNode(String(a))
};
function Kd(a) {
  return"CSS1Compat" == a.r.compatMode
}
function Ld(a) {
  return a.r.parentWindow || a.r.defaultView
}
function Md(a) {
  var b = a.r;
  a = td(b);
  b = b.parentWindow || b.defaultView;
  return C && H("10") && b.pageYOffset != a.scrollTop ? new L(a.scrollLeft, a.scrollTop) : new L(b.pageXOffset || a.scrollLeft, b.pageYOffset || a.scrollTop)
}
q.Kd = function(a) {
  var b;
  a: {
    a = a || this.r;
    try {
      b = a && a.activeElement;
      break a
    }catch(c) {
    }
    b = null
  }
  return b
};
q.appendChild = function(a, b) {
  a.appendChild(b)
};
q.append = zd;
q.removeNode = Bd;
q.De = function(a) {
  return gd && void 0 != a.children ? a.children : Ra(a.childNodes, function(a) {
    return 1 == a.nodeType
  })
};
q.contains = Cd;
q.gh = Dd;
function P(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
}
q = P.prototype;
q.ca = function() {
  return new P(this.top, this.right, this.bottom, this.left)
};
q.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
};
q.contains = function(a) {
  return this && a ? a instanceof P ? a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom : a.x >= this.left && a.x <= this.right && a.y >= this.top && a.y <= this.bottom : !1
};
function Nd(a, b) {
  var c = b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0, d = b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0;
  return Math.sqrt(c * c + d * d)
}
q.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this
};
q.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this
};
function Od(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
}
q = Od.prototype;
q.ca = function() {
  return new Od(this.left, this.top, this.width, this.height)
};
function Pd(a) {
  return new P(a.top, a.left + a.width, a.top + a.height, a.left)
}
q.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
};
q.Oe = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
  }
  return!1
};
q.contains = function(a) {
  return a instanceof Od ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
q.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
q.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
function Qd(a, b, c) {
  v(b) ? Rd(a, c, b) : $a(b, ra(Rd, a))
}
function Rd(a, b, c) {
  var d;
  a: {
    if(d = Ka(c), void 0 === a.style[d] && (c = (G ? "Webkit" : D ? "Moz" : C ? "ms" : B ? "O" : null) + La(c), void 0 !== a.style[c])) {
      d = c;
      break a
    }
  }
  d && (a.style[d] = b)
}
function R(a, b) {
  var c = N(a);
  return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
}
function Sd(a, b) {
  return R(a, b) || (a.currentStyle ? a.currentStyle[b] : null) || a.style && a.style[b]
}
function Td(a) {
  return Sd(a, "position")
}
function Ud(a, b, c) {
  var d, f = D && (ob || ub) && H("1.9");
  b instanceof L ? (d = b.x, b = b.y) : (d = b, b = c);
  a.style.left = Vd(d, f);
  a.style.top = Vd(b, f)
}
function Wd(a) {
  a = a ? N(a) : document;
  return!C || Db(9) || Kd(M(a)) ? a.documentElement : a.body
}
function Xd(a) {
  var b;
  try {
    b = a.getBoundingClientRect()
  }catch(c) {
    return{left:0, top:0, right:0, bottom:0}
  }
  C && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b
}
function Yd(a) {
  if(C && !Db(8)) {
    return a.offsetParent
  }
  var b = N(a), c = Sd(a, "position"), d = "fixed" == c || "absolute" == c;
  for(a = a.parentNode;a && a != b;a = a.parentNode) {
    if(c = Sd(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a
    }
  }
  return null
}
function Zd(a) {
  for(var b = new P(0, Infinity, Infinity, 0), c = M(a), d = c.r.body, f = c.r.documentElement, g = td(c.r);a = Yd(a);) {
    if(!(C && 0 == a.clientWidth || G && 0 == a.clientHeight && a == d || a == d || a == f || "visible" == Sd(a, "overflow"))) {
      var h = $d(a), k;
      k = a;
      if(D && !H("1.9")) {
        var l = parseFloat(R(k, "borderLeftWidth"));
        if(ae(k)) {
          var n = k.offsetWidth - k.clientWidth - l - parseFloat(R(k, "borderRightWidth")), l = l + n
        }
        k = new L(l, parseFloat(R(k, "borderTopWidth")))
      }else {
        k = new L(k.clientLeft, k.clientTop)
      }
      h.x += k.x;
      h.y += k.y;
      b.top = Math.max(b.top, h.y);
      b.right = Math.min(b.right, h.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, h.y + a.clientHeight);
      b.left = Math.max(b.left, h.x)
    }
  }
  d = g.scrollLeft;
  g = g.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, g);
  c = sd(Ld(c) || window);
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, g + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
}
function $d(a) {
  var b, c = N(a), d = Sd(a, "position"), f = D && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), g = new L(0, 0), h = Wd(c);
  if(a == h) {
    return g
  }
  if(a.getBoundingClientRect) {
    b = Xd(a), a = Md(M(c)), g.x = b.left + a.x, g.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !f) {
      b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(h), g.x = b.screenX - a.screenX, g.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        g.x += b.offsetLeft;
        g.y += b.offsetTop;
        b != a && (g.x += b.clientLeft || 0, g.y += b.clientTop || 0);
        if(G && "fixed" == Td(b)) {
          g.x += c.body.scrollLeft;
          g.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(B || G && "absolute" == d) {
        g.y -= c.body.offsetTop
      }
      for(b = a;(b = Yd(b)) && b != c.body && b != h;) {
        g.x -= b.scrollLeft, B && "TR" == b.tagName || (g.y -= b.scrollTop)
      }
    }
  }
  return g
}
function be(a, b, c) {
  if(b instanceof od) {
    c = b.height, b = b.width
  }else {
    if(void 0 == c) {
      throw Error("missing height argument");
    }
  }
  a.style.width = Vd(b, !0);
  a.style.height = Vd(c, !0)
}
function Vd(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a
}
function ce(a) {
  if("none" != Sd(a, "display")) {
    return de(a)
  }
  var b = a.style, c = b.display, d = b.visibility, f = b.position;
  b.visibility = "hidden";
  b.position = "absolute";
  b.display = "inline";
  a = de(a);
  b.display = c;
  b.position = f;
  b.visibility = d;
  return a
}
function de(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = G && !b && !c;
  return fa(b) && !d || !a.getBoundingClientRect ? new od(b, c) : (a = Xd(a), new od(a.right - a.left, a.bottom - a.top))
}
function ee(a) {
  var b = $d(a);
  a = ce(a);
  return new Od(b.x, b.y, a.width, a.height)
}
function fe(a, b) {
  var c = a.style;
  "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
}
function S(a, b) {
  a.style.display = b ? "" : "none"
}
function ae(a) {
  return"rtl" == Sd(a, "direction")
}
var ge = D ? "MozUserSelect" : G ? "WebkitUserSelect" : null;
function he(a, b, c) {
  c = c ? null : a.getElementsByTagName("*");
  if(ge) {
    if(b = b ? "none" : "", a.style[ge] = b, c) {
      a = 0;
      for(var d;d = c[a];a++) {
        d.style[ge] = b
      }
    }
  }else {
    if(C || B) {
      if(b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for(a = 0;d = c[a];a++) {
          d.setAttribute("unselectable", b)
        }
      }
    }
  }
}
function ie(a, b) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }
  var c = a.style.left, d = a.runtimeStyle.left;
  a.runtimeStyle.left = a.currentStyle.left;
  a.style.left = b;
  var f = a.style.pixelLeft;
  a.style.left = c;
  a.runtimeStyle.left = d;
  return f
}
function je(a, b) {
  var c = a.currentStyle ? a.currentStyle[b] : null;
  return c ? ie(a, c) : 0
}
var ke = {thin:2, medium:4, thick:6};
function le(a, b) {
  if("none" == (a.currentStyle ? a.currentStyle[b + "Style"] : null)) {
    return 0
  }
  var c = a.currentStyle ? a.currentStyle[b + "Width"] : null;
  return c in ke ? ke[c] : ie(a, c)
}
function me(a) {
  if(C && !Db(9)) {
    var b = le(a, "borderLeft"), c = le(a, "borderRight"), d = le(a, "borderTop");
    a = le(a, "borderBottom");
    return new P(d, c, a, b)
  }
  b = R(a, "borderLeftWidth");
  c = R(a, "borderRightWidth");
  d = R(a, "borderTopWidth");
  a = R(a, "borderBottomWidth");
  return new P(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
}
var ne = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
function oe(a) {
  xa.call(this);
  this.Z = a;
  this.w = {}
}
y(oe, xa);
var pe = [];
q = oe.prototype;
q.h = function(a, b, c, d, f) {
  u(b) || (pe[0] = b, b = pe);
  for(var g = 0;g < b.length;g++) {
    var h = J(a, b[g], c || this, d || !1, f || this.Z || this);
    if(!h) {
      break
    }
    this.w[h.key] = h
  }
  return this
};
q.Wd = function(a, b, c, d, f) {
  if(u(b)) {
    for(var g = 0;g < b.length;g++) {
      this.Wd(a, b[g], c, d, f)
    }
  }else {
    a = Wc(a, b, c || this, d, f || this.Z || this), this.w[a.key] = a
  }
  return this
};
q.aa = function(a, b, c, d, f) {
  if(u(b)) {
    for(var g = 0;g < b.length;g++) {
      this.aa(a, b[g], c, d, f)
    }
  }else {
    a: {
      if(f = f || this.Z || this, d = !!d, c = Sc(c || this), Lc(a)) {
        a = a.qa[b], b = -1, a && (b = qe(a, c, d, f)), f = -1 < b ? a[b] : null
      }else {
        if(a = Yc(a, b, d)) {
          for(b = 0;b < a.length;b++) {
            if(!a[b].ua && a[b].Ca == c && a[b].capture == d && a[b].mb == f) {
              f = a[b];
              break a
            }
          }
        }
        f = null
      }
    }
    f && (K(f), delete this.w[f.key])
  }
  return this
};
q.Za = function() {
  $a(this.w, K);
  this.w = {}
};
q.g = function() {
  oe.b.g.call(this);
  this.Za()
};
q.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
function U() {
  xa.call(this);
  this.qa = {};
  this.Gf = this
}
y(U, xa);
U.prototype[Kc] = !0;
q = U.prototype;
q.dd = null;
q.ke = ba("dd");
q.addEventListener = function(a, b, c, d) {
  J(this, a, b, c, d)
};
q.removeEventListener = function(a, b, c, d) {
  Xc(this, a, b, c, d)
};
q.dispatchEvent = function(a) {
  var b, c = this.dd;
  if(c) {
    for(b = [];c;c = c.dd) {
      b.push(c)
    }
  }
  var c = this.Gf, d = a.type || a;
  if(v(a)) {
    a = new I(a, c)
  }else {
    if(a instanceof I) {
      a.target = a.target || c
    }else {
      var f = a;
      a = new I(d, c);
      db(a, f)
    }
  }
  var f = !0, g;
  if(b) {
    for(var h = b.length - 1;!a.Ya && 0 <= h;h--) {
      g = a.currentTarget = b[h], f = re(g, d, !0, a) && f
    }
  }
  a.Ya || (g = a.currentTarget = c, f = re(g, d, !0, a) && f, a.Ya || (f = re(g, d, !1, a) && f));
  if(b) {
    for(h = 0;!a.Ya && h < b.length;h++) {
      g = a.currentTarget = b[h], f = re(g, d, !1, a) && f
    }
  }
  return f
};
q.g = function() {
  U.b.g.call(this);
  this.hd();
  this.dd = null
};
q.h = function(a, b, c, d) {
  return se(this, a, b, !1, c, d)
};
q.Wd = function(a, b, c, d) {
  return se(this, a, b, !0, c, d)
};
function se(a, b, c, d, f, g) {
  var h = a.qa[b] || (a.qa[b] = []), k = qe(h, c, f, g);
  if(-1 < k) {
    return a = h[k], d || (a.wb = !1), a
  }
  a = new Nc(c, null, a, b, !!f, g);
  a.wb = d;
  h.push(a);
  return a
}
q.aa = function(a, b, c, d) {
  if(!(a in this.qa)) {
    return!1
  }
  a = this.qa[a];
  b = qe(a, b, c, d);
  return-1 < b ? (c = a[b], delete Oc[c.key], c.ua = !0, 1 == z.splice.call(a, b, 1).length) : !1
};
function Zc(a, b) {
  var c = b.type;
  if(!(c in a.qa)) {
    return!1
  }
  if(c = Va(a.qa[c], b)) {
    delete Oc[b.key], b.ua = !0
  }
  return c
}
q.hd = function(a) {
  var b = 0, c;
  for(c in this.qa) {
    if(!a || c == a) {
      for(var d = this.qa[c], f = 0;f < d.length;f++) {
        ++b, delete Oc[d[f].key], d[f].ua = !0
      }
      d.length = 0
    }
  }
  return b
};
function re(a, b, c, d) {
  if(!(b in a.qa)) {
    return!0
  }
  var f = !0;
  b = Xa(a.qa[b]);
  for(var g = 0;g < b.length;++g) {
    var h = b[g];
    if(h && !h.ua && h.capture == c) {
      var k = h.Ca, l = h.mb || h.src;
      h.wb && Zc(a, h);
      f = !1 !== k.call(l, d) && f
    }
  }
  return f && !1 != d.of
}
function qe(a, b, c, d) {
  for(var f = 0;f < a.length;++f) {
    var g = a[f];
    if(g.Ca == b && g.capture == !!c && g.mb == d) {
      return f
    }
  }
  return-1
}
;function te() {
}
da(te);
te.prototype.Fg = 0;
te.Qa();
function V(a) {
  U.call(this);
  this.ia = a || M();
  this.$a = ue
}
y(V, U);
V.prototype.sg = te.Qa();
var ue = null;
function ve(a, b) {
  switch(a) {
    case 1:
      return b ? "disable" : "enable";
    case 2:
      return b ? "highlight" : "unhighlight";
    case 4:
      return b ? "activate" : "deactivate";
    case 8:
      return b ? "select" : "unselect";
    case 16:
      return b ? "check" : "uncheck";
    case 32:
      return b ? "focus" : "blur";
    case 64:
      return b ? "open" : "close"
  }
  throw Error("Invalid component state");
}
q = V.prototype;
q.Ta = null;
q.t = !1;
q.e = null;
q.$a = null;
q.Cg = null;
q.F = null;
q.n = null;
q.V = null;
q.ph = !1;
q.I = function() {
  return this.Ta || (this.Ta = ":" + (this.sg.Fg++).toString(36))
};
q.a = e("e");
q.X = function() {
  return this.Hb || (this.Hb = new oe(this))
};
q.yc = function(a) {
  if(this == a) {
    throw Error("Unable to set parent component");
  }
  if(a && this.F && this.Ta && this.F.V && this.Ta && (this.Ta in this.F.V && this.F.V[this.Ta]) && this.F != a) {
    throw Error("Unable to set parent component");
  }
  this.F = a;
  V.b.ke.call(this, a)
};
q.getParent = e("F");
q.ke = function(a) {
  if(this.F && this.F != a) {
    throw Error("Method not supported");
  }
  V.b.ke.call(this, a)
};
q.j = e("ia");
q.c = function() {
  this.e = this.ia.createElement("div")
};
q.Fa = function(a) {
  we(this, a)
};
function we(a, b, c) {
  if(a.t) {
    throw Error("Component already rendered");
  }
  a.e || a.c();
  b ? b.insertBefore(a.e, c || null) : a.ia.r.body.appendChild(a.e);
  a.F && !a.F.t || a.J()
}
q.J = function() {
  this.t = !0;
  xe(this, function(a) {
    !a.t && a.a() && a.J()
  })
};
q.ea = function() {
  xe(this, function(a) {
    a.t && a.ea()
  });
  this.Hb && this.Hb.Za();
  this.t = !1
};
q.g = function() {
  this.t && this.ea();
  this.Hb && (this.Hb.B(), delete this.Hb);
  xe(this, function(a) {
    a.B()
  });
  !this.ph && this.e && Bd(this.e);
  this.F = this.Cg = this.e = this.V = this.n = null;
  V.b.g.call(this)
};
q.U = function(a, b) {
  this.Ic(a, ye(this), b)
};
q.Ic = function(a, b, c) {
  if(a.t && (c || !this.t)) {
    throw Error("Component already rendered");
  }
  if(0 > b || b > ye(this)) {
    throw Error("Child component index out of bounds");
  }
  this.V && this.n || (this.V = {}, this.n = []);
  if(a.getParent() == this) {
    var d = a.I();
    this.V[d] = a;
    Va(this.n, a)
  }else {
    var d = this.V, f = a.I();
    if(f in d) {
      throw Error('The object already contains the key "' + f + '"');
    }
    d[f] = a
  }
  a.yc(this);
  Ya(this.n, b, 0, a);
  a.t && this.t && a.getParent() == this ? (c = this.ja(), c.insertBefore(a.a(), c.childNodes[b] || null)) : c ? (this.e || this.c(), b = W(this, b + 1), we(a, this.ja(), b ? b.e : null)) : this.t && (!a.t && a.e && a.e.parentNode && 1 == a.e.parentNode.nodeType) && a.J()
};
q.ja = e("e");
function ze(a) {
  null == a.$a && (a.$a = ae(a.t ? a.e : a.ia.r.body));
  return a.$a
}
q.Xb = function(a) {
  if(this.t) {
    throw Error("Component already rendered");
  }
  this.$a = a
};
function ye(a) {
  return a.n ? a.n.length : 0
}
function W(a, b) {
  return a.n ? a.n[b] || null : null
}
function xe(a, b, c) {
  a.n && A(a.n, b, c)
}
function Ae(a, b) {
  return a.n && b ? Qa(a.n, b) : -1
}
q.removeChild = function(a, b) {
  if(a) {
    var c = v(a) ? a : a.I();
    a = this.V && c ? (c in this.V ? this.V[c] : void 0) || null : null;
    if(c && a) {
      var d = this.V;
      c in d && delete d[c];
      Va(this.n, a);
      b && (a.ea(), a.e && Bd(a.e));
      a.yc(null)
    }
  }
  if(!a) {
    throw Error("Child is not in parent component");
  }
  return a
};
function Be() {
  V.call(this)
}
y(Be, V);
q = Be.prototype;
q.$d = null;
q.g = function() {
  ad(this.a());
  K(this.$d);
  this.$d = null;
  Be.b.g.call(this)
};
q.c = function() {
  var a = this.j().c("DIV", "banner");
  Qd(a, "position", "absolute");
  Qd(a, "top", "0");
  J(a, "click", x(this.k, this, !1));
  this.e = a;
  this.kd();
  this.$d = J(Ce(this), "resize", this.kd, !1, this)
};
q.k = function(a) {
  S(this.a(), a);
  this.kd()
};
q.rf = function(a) {
  this.j().gh(this.a(), a);
  this.kd()
};
function Ce(a) {
  a = O(a.j());
  return ud(a) || window
}
q.kd = function() {
  if(!this.a().style.display) {
    var a = Ce(this), b = Md(this.j()).x, c = ce(this.a()), a = Math.max(b + sd(a || window).width / 2 - c.width / 2, 0);
    Ud(this.a(), a, 0)
  }
};
function De(a, b, c) {
  I.call(this, a, b);
  this.data = c
}
y(De, I);
var Ee;
function Fe(a, b) {
  b ? a.setAttribute("role", b) : a.removeAttribute("role")
}
function Ge(a, b, c) {
  ha(c) && (c = c.join(" "));
  var d = "aria-" + b;
  "" === c || void 0 == c ? (Ee || (Ee = {atomic:!1, autocomplete:"none", dropeffect:"none", haspopup:!1, live:"off", multiline:!1, multiselectable:!1, orientation:"vertical", readonly:!1, relevant:"additions text", required:!1, sort:"none", busy:!1, disabled:!1, hidden:!1, invalid:"false"}), c = Ee, b in c ? a.setAttribute(d, c[b]) : a.removeAttribute(d)) : a.setAttribute(d, c)
}
;function He(a, b, c, d, f) {
  if(!(C || G && H("525"))) {
    return!0
  }
  if(ob && f) {
    return Ie(a)
  }
  if(f && !d || !c && (17 == b || 18 == b || ob && 91 == b)) {
    return!1
  }
  if(G && d && c) {
    switch(a) {
      case 220:
      ;
      case 219:
      ;
      case 221:
      ;
      case 192:
      ;
      case 186:
      ;
      case 189:
      ;
      case 187:
      ;
      case 188:
      ;
      case 190:
      ;
      case 191:
      ;
      case 192:
      ;
      case 222:
        return!1
    }
  }
  if(C && d && b == a) {
    return!1
  }
  switch(a) {
    case 13:
      return!(C && Db(9));
    case 27:
      return!G
  }
  return Ie(a)
}
function Ie(a) {
  if(48 <= a && 57 >= a || 96 <= a && 106 >= a || 65 <= a && 90 >= a || G && 0 == a) {
    return!0
  }
  switch(a) {
    case 32:
    ;
    case 63:
    ;
    case 107:
    ;
    case 109:
    ;
    case 110:
    ;
    case 111:
    ;
    case 186:
    ;
    case 59:
    ;
    case 189:
    ;
    case 187:
    ;
    case 61:
    ;
    case 188:
    ;
    case 190:
    ;
    case 191:
    ;
    case 192:
    ;
    case 222:
    ;
    case 219:
    ;
    case 220:
    ;
    case 221:
      return!0;
    default:
      return!1
  }
}
function Je(a) {
  switch(a) {
    case 61:
      return 187;
    case 59:
      return 186;
    case 224:
      return 91;
    case 0:
      return 224;
    default:
      return a
  }
}
;function Ke(a, b, c) {
  U.call(this);
  this.target = a;
  this.handle = b || a;
  this.Zc = c || new Od(NaN, NaN, NaN, NaN);
  this.r = N(a);
  this.C = new oe(this);
  a = ra(Aa, this.C);
  this.sc || (this.sc = []);
  this.sc.push(x(a, void 0));
  J(this.handle, ["touchstart", "mousedown"], this.xf, !1, this)
}
y(Ke, U);
var Le = C || D && H("1.9.3");
q = Ke.prototype;
q.clientX = 0;
q.clientY = 0;
q.screenX = 0;
q.screenY = 0;
q.yf = 0;
q.zf = 0;
q.Ab = 0;
q.Bb = 0;
q.pa = !0;
q.hb = !1;
q.Le = 0;
q.Dg = 0;
q.tg = !1;
q.ne = !1;
q.X = e("C");
q.va = ba("pa");
q.g = function() {
  Ke.b.g.call(this);
  Xc(this.handle, ["touchstart", "mousedown"], this.xf, !1, this);
  this.C.Za();
  Le && this.r.releaseCapture();
  this.handle = this.target = null
};
function Me(a) {
  fa(a.$a) || (a.$a = ae(a.target));
  return a.$a
}
q.xf = function(a) {
  var b = "mousedown" == a.type;
  if(!this.pa || this.hb || b && !Jc(a)) {
    this.dispatchEvent("earlycancel")
  }else {
    Ne(a);
    if(0 == this.Le) {
      if(this.dispatchEvent(new Oe("start", this, a.clientX, a.clientY, a))) {
        this.hb = !0, a.preventDefault()
      }else {
        return
      }
    }else {
      a.preventDefault()
    }
    var b = this.r, c = b.documentElement, d = !Le;
    this.C.h(b, ["touchmove", "mousemove"], this.jg, d);
    this.C.h(b, ["touchend", "mouseup"], this.Oc, d);
    Le ? (c.setCapture(!1), this.C.h(c, "losecapture", this.Oc)) : this.C.h(ud(b), "blur", this.Oc);
    C && this.tg && this.C.h(b, "dragstart", Fc);
    this.dh && this.C.h(this.dh, "scroll", this.Rg, d);
    this.clientX = this.yf = a.clientX;
    this.clientY = this.zf = a.clientY;
    this.screenX = a.screenX;
    this.screenY = a.screenY;
    this.ne ? (a = this.target, b = a.offsetLeft, c = a.offsetParent, c || "fixed" != Td(a) || (c = N(a).documentElement), c ? (D ? (d = me(c), b += d.left) : Db(8) && (d = me(c), b -= d.left), a = ae(c) ? c.clientWidth - (b + a.offsetWidth) : b) : a = b) : a = this.target.offsetLeft;
    this.Ab = a;
    this.Bb = this.target.offsetTop;
    this.be = Md(M(this.r));
    this.Dg = sa()
  }
};
q.Oc = function(a, b) {
  this.C.Za();
  Le && this.r.releaseCapture();
  if(this.hb) {
    Ne(a);
    this.hb = !1;
    var c = Pe(this, this.Ab), d = Qe(this, this.Bb);
    this.dispatchEvent(new Oe("end", this, a.clientX, a.clientY, a, c, d, b || "touchcancel" == a.type))
  }else {
    this.dispatchEvent("earlycancel")
  }
};
function Ne(a) {
  var b = a.type;
  "touchstart" == b || "touchmove" == b ? a.nb(a.ra.targetTouches[0], a.currentTarget) : "touchend" != b && "touchcancel" != b || a.nb(a.ra.changedTouches[0], a.currentTarget)
}
q.jg = function(a) {
  if(this.pa) {
    Ne(a);
    var b = (this.ne && Me(this) ? -1 : 1) * (a.clientX - this.clientX), c = a.clientY - this.clientY;
    this.clientX = a.clientX;
    this.clientY = a.clientY;
    this.screenX = a.screenX;
    this.screenY = a.screenY;
    if(!this.hb) {
      var d = this.yf - this.clientX, f = this.zf - this.clientY;
      if(d * d + f * f > this.Le) {
        if(this.dispatchEvent(new Oe("start", this, a.clientX, a.clientY, a))) {
          this.hb = !0
        }else {
          this.Mc || this.Oc(a);
          return
        }
      }
    }
    c = Re(this, b, c);
    b = c.x;
    c = c.y;
    this.hb && this.dispatchEvent(new Oe("beforedrag", this, a.clientX, a.clientY, a, b, c)) && (Se(this, a, b, c), a.preventDefault())
  }
};
function Re(a, b, c) {
  var d = Md(M(a.r));
  b += d.x - a.be.x;
  c += d.y - a.be.y;
  a.be = d;
  a.Ab += b;
  a.Bb += c;
  b = Pe(a, a.Ab);
  a = Qe(a, a.Bb);
  return new L(b, a)
}
q.Rg = function(a) {
  var b = Re(this, 0, 0);
  a.clientX = this.clientX;
  a.clientY = this.clientY;
  Se(this, a, b.x, b.y)
};
function Se(a, b, c, d) {
  a.ne && Me(a) ? a.target.style.right = c + "px" : a.target.style.left = c + "px";
  a.target.style.top = d + "px";
  a.dispatchEvent(new Oe("drag", a, b.clientX, b.clientY, b, c, d))
}
function Pe(a, b) {
  var c = a.Zc, d = isNaN(c.left) ? null : c.left, c = isNaN(c.width) ? 0 : c.width;
  return Math.min(null != d ? d + c : Infinity, Math.max(null != d ? d : -Infinity, b))
}
function Qe(a, b) {
  var c = a.Zc, d = isNaN(c.top) ? null : c.top, c = isNaN(c.height) ? 0 : c.height;
  return Math.min(null != d ? d + c : Infinity, Math.max(null != d ? d : -Infinity, b))
}
function Oe(a, b, c, d, f, g, h, k) {
  I.call(this, a);
  this.clientX = c;
  this.clientY = d;
  this.qh = f;
  this.left = fa(g) ? g : b.Ab;
  this.top = fa(h) ? h : b.Bb;
  this.vh = b;
  this.uh = !!k
}
y(Oe, I);
function Te(a, b, c) {
  if(ia(a)) {
    c && (a = x(a, c))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = x(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return 2147483647 < b ? -1 : r.setTimeout(a, b || 0)
}
;function Ue(a) {
  U.call(this);
  this.e = a;
  a = C ? "focusout" : "blur";
  this.yg = J(this.e, C ? "focusin" : "focus", this, !C);
  this.zg = J(this.e, a, this, !C)
}
y(Ue, U);
Ue.prototype.handleEvent = function(a) {
  var b = new Hc(a.ra);
  b.type = "focusin" == a.type || "focus" == a.type ? "focusin" : "focusout";
  this.dispatchEvent(b)
};
Ue.prototype.g = function() {
  Ue.b.g.call(this);
  K(this.yg);
  K(this.zg);
  delete this.e
};
function Ve(a, b) {
  U.call(this);
  this.Z = new oe(this);
  this.he(a || null);
  b && (this.$b = b)
}
y(Ve, U);
q = Ve.prototype;
q.e = null;
q.Lf = !0;
q.se = null;
q.Ob = !1;
q.hh = !1;
q.Vd = -1;
q.Se = -1;
q.rg = !1;
q.Uf = !0;
q.$b = "toggle_display";
q.a = e("e");
q.he = function(a) {
  if(this.Ob) {
    throw Error("Can not change this state of the popup while showing.");
  }
  this.e = a
};
q.X = e("Z");
q.p = e("Ob");
q.k = function(a) {
  this.Ac && this.Ac.stop();
  this.oc && this.oc.stop();
  a ? this.le() : this.Mb()
};
q.$ = t;
q.le = function() {
  if(!this.Ob && this.Zd()) {
    if(!this.e) {
      throw Error("Caller must call setElement before trying to show the popup");
    }
    this.$();
    var a = N(this.e);
    this.rg && this.Z.h(a, "keydown", this.Ng, !0);
    if(this.Lf) {
      if(this.Z.h(a, "mousedown", this.bf, !0), C) {
        var b;
        try {
          b = a.activeElement
        }catch(c) {
        }
        for(;b && "IFRAME" == b.nodeName;) {
          try {
            var d = b.contentDocument || b.contentWindow.document
          }catch(f) {
            break
          }
          a = d;
          b = a.activeElement
        }
        this.Z.h(a, "mousedown", this.bf, !0);
        this.Z.h(a, "deactivate", this.af)
      }else {
        this.Z.h(a, "blur", this.af)
      }
    }
    "toggle_display" == this.$b ? (this.e.style.visibility = "visible", S(this.e, !0)) : "move_offscreen" == this.$b && this.$();
    this.Ob = !0;
    this.Ac ? (Wc(this.Ac, "end", this.Wa, !1, this), this.Ac.play()) : this.Wa()
  }
};
q.Mb = function(a) {
  if(!this.Ob || !this.dispatchEvent({type:"beforehide", target:a})) {
    return!1
  }
  this.Z && this.Z.Za();
  this.Ob = !1;
  this.Se = sa();
  this.oc ? (Wc(this.oc, "end", ra(this.ve, a), !1, this), this.oc.play()) : this.ve(a);
  return!0
};
q.ve = function(a) {
  "toggle_display" == this.$b ? this.hh ? Te(this.Ke, 0, this) : this.Ke() : "move_offscreen" == this.$b && (this.e.style.top = "-10000px");
  this.tc(a)
};
q.Ke = function() {
  this.e.style.visibility = "hidden";
  S(this.e, !1)
};
q.Zd = function() {
  return this.dispatchEvent("beforeshow")
};
q.Wa = function() {
  this.Vd = sa();
  this.Se = -1;
  this.dispatchEvent("show")
};
q.tc = function(a) {
  this.dispatchEvent({type:"hide", target:a})
};
q.bf = function(a) {
  a = a.target;
  Cd(this.e, a) || (this.se && !Cd(this.se, a) || 150 > sa() - this.Vd) || this.Mb(a)
};
q.Ng = function(a) {
  27 == a.keyCode && this.Mb(a.target) && (a.preventDefault(), a.stopPropagation())
};
q.af = function(a) {
  if(this.Uf) {
    var b = N(this.e);
    if("undefined" != typeof document.activeElement) {
      if(a = b.activeElement, !a || Cd(this.e, a) || "BODY" == a.tagName) {
        return
      }
    }else {
      if(a.target != b) {
        return
      }
    }
    150 > sa() - this.Vd || this.Mb()
  }
};
q.g = function() {
  Ve.b.g.call(this);
  this.Z.B();
  Aa(this.Ac);
  Aa(this.oc);
  delete this.e;
  delete this.Z
};
function We(a, b) {
  V.call(this, b);
  this.oh = !!a;
  this.qc = null
}
y(We, V);
q = We.prototype;
q.Hd = null;
q.O = !1;
q.ba = null;
q.P = null;
q.xa = null;
q.xd = !1;
q.W = p("goog-modalpopup");
q.Qc = e("ba");
q.c = function() {
  We.b.c.call(this);
  var a = this.a();
  kd(a, this.W());
  Hd(a, !0);
  S(a, !1);
  this.oh && !this.P && (this.P = this.j().c("iframe", {frameborder:0, style:"border:0;vertical-align:bottom;", src:'javascript:""'}), this.P.className = this.W() + "-bg", S(this.P, !1), fe(this.P, 0));
  this.ba || (this.ba = this.j().c("div", this.W() + "-bg"), S(this.ba, !1));
  this.xa || (this.xa = this.j().createElement("span"), S(this.xa, !1), Hd(this.xa, !0), this.xa.style.position = "absolute")
};
q.nf = function() {
  this.xd = !1
};
q.J = function() {
  if(this.P) {
    var a = this.a();
    a.parentNode && a.parentNode.insertBefore(this.P, a)
  }
  a = this.a();
  a.parentNode && a.parentNode.insertBefore(this.ba, a);
  We.b.J.call(this);
  a = this.a();
  a.parentNode && a.parentNode.insertBefore(this.xa, a.nextSibling);
  this.Hd = new Ue(O(this.j()));
  this.X().h(this.Hd, "focusin", this.Og);
  Xe(this, !1)
};
q.ea = function() {
  this.p() && this.k(!1);
  Aa(this.Hd);
  We.b.ea.call(this);
  Bd(this.P);
  Bd(this.ba);
  Bd(this.xa)
};
q.k = function(a) {
  a != this.O && (this.Tb && this.Tb.stop(), this.cc && this.cc.stop(), this.Sb && this.Sb.stop(), this.bc && this.bc.stop(), this.t && Xe(this, a), a ? this.le() : this.Mb())
};
function Xe(a, b) {
  for(var c = O(a.j()).body.firstChild;c;c = c.nextSibling) {
    if(1 == c.nodeType) {
      var d = c;
      b ? Ge(d, "hidden", b) : d.removeAttribute("aria-hidden")
    }
  }
  c = a.e;
  (d = !b) ? Ge(c, "hidden", d) : c.removeAttribute("aria-hidden")
}
q.le = function() {
  if(this.dispatchEvent("beforeshow")) {
    try {
      this.qc = O(this.j()).activeElement
    }catch(a) {
    }
    this.ee();
    this.$();
    this.X().h(Ld(this.j()), "resize", this.ee);
    Ye(this, !0);
    this.focus();
    this.O = !0;
    this.Tb && this.cc ? (Wc(this.Tb, "end", this.cd, !1, this), this.cc.play(), this.Tb.play()) : this.cd()
  }
};
q.Mb = function() {
  if(this.dispatchEvent("beforehide")) {
    this.X().aa(Ld(this.j()), "resize", this.ee);
    this.O = !1;
    this.Sb && this.bc ? (Wc(this.Sb, "end", this.bd, !1, this), this.bc.play(), this.Sb.play()) : this.bd();
    try {
      var a = O(this.j()).body, b = O(this.j()).activeElement || a;
      this.qc && (b == a && this.qc != a) && this.qc.focus()
    }catch(c) {
    }
    this.qc = null
  }
};
function Ye(a, b) {
  a.P && S(a.P, b);
  a.ba && S(a.ba, b);
  S(a.a(), b);
  S(a.xa, b)
}
q.cd = function() {
  this.dispatchEvent("show")
};
q.bd = function() {
  Ye(this, !1);
  this.dispatchEvent("hide")
};
q.p = e("O");
q.focus = function() {
  this.Ce()
};
q.ee = function() {
  this.P && S(this.P, !1);
  this.ba && S(this.ba, !1);
  var a = O(this.j()), b = sd(ud(a) || window || window), c = Math.max(b.width, Math.max(a.body.scrollWidth, a.documentElement.scrollWidth)), a = Math.max(b.height, Math.max(a.body.scrollHeight, a.documentElement.scrollHeight));
  this.P && (S(this.P, !0), be(this.P, c, a));
  this.ba && (S(this.ba, !0), be(this.ba, c, a))
};
q.$ = function() {
  var a = O(this.j()), b = ud(a) || window;
  if("fixed" == Td(this.a())) {
    var c = a = 0
  }else {
    c = Md(this.j()), a = c.x, c = c.y
  }
  var d = ce(this.a()), b = sd(b || window), a = Math.max(a + b.width / 2 - d.width / 2, 0), c = Math.max(c + b.height / 2 - d.height / 2, 0);
  Ud(this.a(), a, c);
  Ud(this.xa, a, c)
};
q.Og = function(a) {
  this.xd ? this.nf() : a.target == this.xa && Te(this.Ce, 0, this)
};
q.Ce = function() {
  try {
    C && O(this.j()).body.focus(), this.a().focus()
  }catch(a) {
  }
};
q.g = function() {
  Aa(this.Tb);
  this.Tb = null;
  Aa(this.Sb);
  this.Sb = null;
  Aa(this.cc);
  this.cc = null;
  Aa(this.bc);
  this.bc = null;
  We.b.g.call(this)
};
function X(a, b, c) {
  We.call(this, b, c);
  this.ya = a || "modal-dialog";
  this.ha = Y(Y(new Ze, $e, !0), af, !1, !0)
}
y(X, We);
q = X.prototype;
q.Vf = !0;
q.He = !0;
q.Ze = !0;
q.Tf = !0;
q.wd = 0.5;
q.Cf = "";
q.oa = "";
q.Pa = null;
q.Sf = !1;
q.Zb = null;
q.Dc = null;
q.Bf = null;
q.nd = null;
q.dc = null;
q.na = null;
q.gd = "dialog";
q.W = e("ya");
function bf(a, b) {
  a.Cf = b;
  a.Dc && Dd(a.Dc, b)
}
q.tb = function(a) {
  this.oa = a;
  this.dc && (this.dc.innerHTML = a)
};
q.ja = function() {
  this.a() || this.Fa();
  return this.dc
};
q.Qc = function() {
  this.a() || this.Fa();
  return X.b.Qc.call(this)
};
function cf(a, b) {
  if(a.a()) {
    var c = a.Zb, d = a.ya + "-title-draggable";
    b ? kd(c, d) : ld(c, d)
  }
  b && !a.Pa ? (a.Pa = new Ke(a.a(), a.Zb), kd(a.Zb, a.ya + "-title-draggable"), J(a.Pa, "start", a.fh, !1, a)) : !b && a.Pa && (a.Pa.B(), a.Pa = null)
}
q.c = function() {
  X.b.c.call(this);
  var a = this.a(), b = this.j();
  this.Zb = b.c("div", {className:this.ya + "-title", id:this.I()}, this.Dc = b.c("span", this.ya + "-title-text", this.Cf), this.nd = b.c("span", this.ya + "-title-close"));
  zd(a, this.Zb, this.dc = b.c("div", this.ya + "-content"), this.na = b.c("div", this.ya + "-buttons"));
  this.Bf = this.Zb.id;
  Fe(a, this.gd);
  Ge(a, "labelledby", this.Bf || "");
  this.oa && (this.dc.innerHTML = this.oa);
  S(this.nd, this.He);
  this.ha && (a = this.ha, a.e = this.na, a.Fa());
  S(this.na, !!this.ha);
  this.wd = this.wd;
  this.a() && (a = this.Qc()) && fe(a, this.wd)
};
q.J = function() {
  X.b.J.call(this);
  this.X().h(this.a(), "keydown", this.cf).h(this.a(), "keypress", this.cf);
  this.X().h(this.na, "click", this.Ig);
  cf(this, this.Tf);
  this.X().h(this.nd, "click", this.Tg);
  var a = this.a();
  Fe(a, this.gd);
  "" !== this.Dc.id && Ge(a, "labelledby", this.Dc.id);
  if(!this.Ze && (this.Ze = !1, this.t)) {
    var a = this.j(), b = this.Qc();
    a.removeNode(this.P);
    a.removeNode(b)
  }
};
q.ea = function() {
  this.p() && this.k(!1);
  cf(this, !1);
  X.b.ea.call(this)
};
q.k = function(a) {
  a != this.p() && (this.t || this.Fa(), X.b.k.call(this, a))
};
q.cd = function() {
  X.b.cd.call(this);
  this.dispatchEvent(df)
};
q.bd = function() {
  X.b.bd.call(this);
  this.dispatchEvent(ef);
  this.Sf && this.B()
};
q.focus = function() {
  X.b.focus.call(this);
  if(this.ha) {
    var a = this.ha.Lc;
    if(a) {
      for(var b = O(this.j()), c = this.na.getElementsByTagName("button"), d = 0, f;f = c[d];d++) {
        if(f.name == a && !f.disabled) {
          try {
            if(G || B) {
              var g = b.createElement("input");
              g.style.cssText = "position:fixed;width:0;height:0;left:0;top:0;";
              this.a().appendChild(g);
              g.focus();
              this.a().removeChild(g)
            }
            f.focus()
          }catch(h) {
          }
          break
        }
      }
    }
  }
};
q.fh = function() {
  var a = O(this.j()), b = sd(ud(a) || window || window), c = Math.max(a.body.scrollWidth, b.width), a = Math.max(a.body.scrollHeight, b.height), d = ce(this.a());
  "fixed" == Td(this.a()) ? (b = new Od(0, 0, Math.max(0, b.width - d.width), Math.max(0, b.height - d.height)), this.Pa.Zc = b || new Od(NaN, NaN, NaN, NaN)) : this.Pa.Zc = new Od(0, 0, c - d.width, a - d.height) || new Od(NaN, NaN, NaN, NaN)
};
q.Tg = function() {
  if(this.He) {
    var a = this.ha, b = a && a.Ad;
    b ? (a = a.get(b), this.dispatchEvent(new ff(b, a)) && this.k(!1)) : this.k(!1)
  }
};
q.g = function() {
  this.na = this.nd = null;
  X.b.g.call(this)
};
q.Ig = function(a) {
  a: {
    for(a = a.target;null != a && a != this.na;) {
      if("BUTTON" == a.tagName) {
        break a
      }
      a = a.parentNode
    }
    a = null
  }
  if(a && !a.disabled) {
    a = a.name;
    var b = this.ha.get(a);
    this.dispatchEvent(new ff(a, b)) && this.k(!1)
  }
};
q.cf = function(a) {
  var b = !1, c = !1, d = this.ha, f = a.target;
  if("keydown" == a.type) {
    if(this.Vf && 27 == a.keyCode) {
      var g = d && d.Ad, f = "SELECT" == f.tagName && !f.disabled;
      g && !f ? (c = !0, b = d.get(g), b = this.dispatchEvent(new ff(g, b))) : f || (b = !0)
    }else {
      if(9 == a.keyCode && a.shiftKey && f == this.a()) {
        this.xd = !0;
        try {
          this.xa.focus()
        }catch(h) {
        }
        Te(this.nf, 0, this)
      }
    }
  }else {
    if(13 == a.keyCode) {
      if("BUTTON" == f.tagName && !f.disabled) {
        g = f.name
      }else {
        if(d) {
          var k = d.Lc, l;
          if(l = k) {
            a: {
              l = d.e.getElementsByTagName("BUTTON");
              for(var n = 0, m;m = l[n];n++) {
                if(m.name == k || m.id == k) {
                  l = m;
                  break a
                }
              }
              l = null
            }
          }
          f = ("TEXTAREA" == f.tagName || "SELECT" == f.tagName || "A" == f.tagName) && !f.disabled;
          !l || (l.disabled || f) || (g = k)
        }
      }
      g && d && (c = !0, b = this.dispatchEvent(new ff(g, String(d.get(g)))))
    }
  }
  if(b || c) {
    a.stopPropagation(), a.preventDefault()
  }
  b && this.k(!1)
};
function ff(a, b) {
  this.type = gf;
  this.key = a;
  this.caption = b
}
y(ff, I);
var gf = "dialogselect", ef = "afterhide", df = "aftershow";
function Ze(a) {
  this.ia = a || M();
  hb.call(this)
}
y(Ze, hb);
q = Ze.prototype;
q.ya = "goog-buttonset";
q.Lc = null;
q.e = null;
q.Ad = null;
q.set = function(a, b, c, d) {
  hb.prototype.set.call(this, a, b);
  c && (this.Lc = a);
  d && (this.Ad = a);
  return this
};
function Y(a, b, c, d) {
  return a.set(b.key, b.caption, c, d)
}
q.Fa = function() {
  if(this.e) {
    this.e.innerHTML = "";
    var a = M(this.e);
    gb(this, function(b, c) {
      var d = a.c("button", {name:c}, b);
      c == this.Lc && (d.className = this.ya + "-default");
      this.e.appendChild(d)
    }, this)
  }
};
q.a = e("e");
q.j = e("ia");
var $e = {key:"ok", caption:"OK"}, af = {key:"cancel", caption:"Cancel"}, hf = {key:"yes", caption:"Yes"}, jf = {key:"no", caption:"No"}, kf = {key:"save", caption:"Save"}, lf = {key:"continue", caption:"Continue"};
"undefined" != typeof document && (Y(new Ze, $e, !0, !0), Y(Y(new Ze, $e, !0), af, !1, !0), Y(Y(new Ze, hf, !0), jf, !1, !0), Y(Y(Y(new Ze, hf), jf, !0), af, !1, !0), Y(Y(Y(new Ze, lf), kf), af, !0, !0));
function mf() {
  X.call(this, void 0, !0);
  this.ha = Y(new Ze, $e, !0, !0);
  if(this.na) {
    if(this.ha) {
      var a = this.ha;
      a.e = this.na;
      a.Fa()
    }else {
      this.na.innerHTML = ""
    }
    S(this.na, !!this.ha)
  }
  this.M(nf)
}
y(mf, X);
var nf = 0;
mf.prototype.D = nf;
mf.prototype.g = function() {
  delete this.D;
  mf.b.g.call(this)
};
mf.prototype.M = function(a) {
  this.D = a;
  switch(a) {
    case 1:
      bf(this, "Screenshot");
      break;
    default:
      bf(this, "Taking Screenshot..."), this.tb("")
  }
};
function of() {
  V.call(this)
}
y(of, V);
of.prototype.c = function() {
  this.e = this.j().c("DIV", "server-info");
  pf(this)
};
function pf(a, b, c, d) {
  var f = [];
  b && f.push(b);
  c && f.push("v" + c);
  d && f.push("r" + d);
  Dd(a.a(), f.length ? f.join("\u00a0\u00a0|\u00a0\u00a0") : "Server info unavailable")
}
;function qf(a, b) {
  U.call(this);
  a && this.ac(a, b)
}
y(qf, U);
q = qf.prototype;
q.e = null;
q.Xc = null;
q.Td = null;
q.Yc = null;
q.ga = -1;
q.Va = -1;
q.td = !1;
var rf = {3:13, 12:144, 63232:38, 63233:40, 63234:37, 63235:39, 63236:112, 63237:113, 63238:114, 63239:115, 63240:116, 63241:117, 63242:118, 63243:119, 63244:120, 63245:121, 63246:122, 63247:123, 63248:44, 63272:46, 63273:36, 63275:35, 63276:33, 63277:34, 63289:144, 63302:45}, sf = {Up:38, Down:40, Left:37, Right:39, Enter:13, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, "U+007F":46, Home:36, End:35, PageUp:33, PageDown:34, Insert:45}, tf = C || 
G && H("525"), uf = ob && D;
q = qf.prototype;
q.hg = function(a) {
  G && (17 == this.ga && !a.ctrlKey || 18 == this.ga && !a.altKey || ob && 91 == this.ga && !a.metaKey) && (this.Va = this.ga = -1);
  -1 == this.ga && (a.ctrlKey && 17 != a.keyCode ? this.ga = 17 : a.altKey && 18 != a.keyCode ? this.ga = 18 : a.metaKey && 91 != a.keyCode && (this.ga = 91));
  tf && !He(a.keyCode, this.ga, a.shiftKey, a.ctrlKey, a.altKey) ? this.handleEvent(a) : (this.Va = D ? Je(a.keyCode) : a.keyCode, uf && (this.td = a.altKey))
};
q.ig = function(a) {
  this.Va = this.ga = -1;
  this.td = a.altKey
};
q.handleEvent = function(a) {
  var b = a.ra, c, d, f = b.altKey;
  C && "keypress" == a.type ? (c = this.Va, d = 13 != c && 27 != c ? b.keyCode : 0) : G && "keypress" == a.type ? (c = this.Va, d = 0 <= b.charCode && 63232 > b.charCode && Ie(c) ? b.charCode : 0) : B ? (c = this.Va, d = Ie(c) ? b.keyCode : 0) : (c = b.keyCode || this.Va, d = b.charCode || 0, uf && (f = this.td), ob && (63 == d && 224 == c) && (c = 191));
  var g = c, h = b.keyIdentifier;
  c ? 63232 <= c && c in rf ? g = rf[c] : 25 == c && a.shiftKey && (g = 9) : h && h in sf && (g = sf[h]);
  a = g == this.ga;
  this.ga = g;
  b = new vf(g, d, a, b);
  b.altKey = f;
  this.dispatchEvent(b)
};
q.a = e("e");
q.ac = function(a, b) {
  this.Yc && this.detach();
  this.e = a;
  this.Xc = J(this.e, "keypress", this, b);
  this.Td = J(this.e, "keydown", this.hg, b, this);
  this.Yc = J(this.e, "keyup", this.ig, b, this)
};
q.detach = function() {
  this.Xc && (K(this.Xc), K(this.Td), K(this.Yc), this.Yc = this.Td = this.Xc = null);
  this.e = null;
  this.Va = this.ga = -1
};
q.g = function() {
  qf.b.g.call(this);
  this.detach()
};
function vf(a, b, c, d) {
  d && this.nb(d, void 0);
  this.type = "key";
  this.keyCode = a;
  this.charCode = b;
  this.repeat = c
}
y(vf, Hc);
function wf() {
}
var xf;
da(wf);
q = wf.prototype;
q.lb = aa();
q.c = function(a) {
  var b = a.j().c("div", this.Db(a).join(" "), a.oa);
  a.p() || Ge(b, "hidden", !a.p());
  a.isEnabled() || this.Na(b, 1, !a.isEnabled());
  a.N & 8 && this.Na(b, 8, !!(a.D & 8));
  a.N & 16 && this.Na(b, 16, !!(a.D & 16));
  a.N & 64 && this.Na(b, 64, !!(a.D & 64));
  return b
};
q.ja = function(a) {
  return a
};
q.hc = function(a, b, c) {
  if(a = a.a ? a.a() : a) {
    if(C && !H("7")) {
      var d = yf(jd(a), b);
      d.push(b);
      ra(c ? kd : ld, a).apply(null, d)
    }else {
      c ? kd(a, b) : ld(a, b)
    }
  }
};
q.Vc = function(a) {
  ze(a) && this.Xb(a.a(), !0);
  a.isEnabled() && this.Wb(a, a.p())
};
q.md = function(a, b) {
  he(a, !b, !C && !B)
};
q.Xb = function(a, b) {
  this.hc(a, this.W() + "-rtl", b)
};
q.Ua = function(a) {
  var b;
  return a.N & 32 && (b = a.K()) ? Gd(b) : !1
};
q.Wb = function(a, b) {
  var c;
  if(a.N & 32 && (c = a.K())) {
    if(!b && a.D & 32) {
      try {
        c.blur()
      }catch(d) {
      }
      a.D & 32 && a.kc(null)
    }
    Gd(c) != b && Hd(c, b)
  }
};
q.k = function(a, b) {
  S(a, b);
  a && Ge(a, "hidden", !b)
};
q.M = function(a, b, c) {
  var d = a.a();
  if(d) {
    var f = zf(this, b);
    f && this.hc(a, f, c);
    this.Na(d, b, c)
  }
};
q.Na = function(a, b, c) {
  xf || (xf = {1:"disabled", 8:"selected", 16:"checked", 64:"expanded"});
  (b = xf[b]) && Ge(a, b, c)
};
q.tb = function(a, b) {
  var c = this.ja(a);
  if(c && (Ad(c), b)) {
    if(v(b)) {
      Dd(c, b)
    }else {
      var d = function(a) {
        if(a) {
          var b = N(c);
          c.appendChild(v(a) ? b.createTextNode(a) : a)
        }
      };
      u(b) ? A(b, d) : !ha(b) || "nodeType" in b ? d(b) : A(Xa(b), d)
    }
  }
};
q.K = function(a) {
  return a.a()
};
q.W = p("goog-control");
q.Db = function(a) {
  var b = this.W(), c = [b], d = this.W();
  d != b && c.push(d);
  b = a.jc();
  for(d = [];b;) {
    var f = b & -b;
    d.push(zf(this, f));
    b &= ~f
  }
  c.push.apply(c, d);
  (a = a.za) && c.push.apply(c, a);
  C && !H("7") && c.push.apply(c, yf(c));
  return c
};
function yf(a, b) {
  var c = [];
  b && (a = a.concat([b]));
  A([], function(d) {
    !Ta(d, ra(Ua, a)) || b && !Ua(d, b) || c.push(d.join("_"))
  });
  return c
}
function zf(a, b) {
  if(!a.ue) {
    var c = a.W();
    a.ue = {1:c + "-disabled", 2:c + "-hover", 4:c + "-active", 8:c + "-selected", 16:c + "-checked", 32:c + "-focused", 64:c + "-open"}
  }
  return a.ue[b]
}
;function Af(a, b) {
  if(!a) {
    throw Error("Invalid class name " + a);
  }
  if(!ia(b)) {
    throw Error("Invalid decorator function " + b);
  }
}
var Bf = {};
function Z(a, b, c) {
  V.call(this, c);
  if(!b) {
    b = this.constructor;
    for(var d;b;) {
      d = ka(b);
      if(d = Bf[d]) {
        break
      }
      b = b.b ? b.b.constructor : null
    }
    b = d ? ia(d.Qa) ? d.Qa() : new d : null
  }
  this.m = b;
  this.oa = a
}
y(Z, V);
q = Z.prototype;
q.oa = null;
q.D = 0;
q.N = 39;
q.vd = 255;
q.ub = 0;
q.O = !0;
q.za = null;
q.Nd = !0;
q.sd = !1;
q.gd = null;
function Cf(a, b) {
  a.t && b != a.Nd && Df(a, b);
  a.Nd = b
}
q.K = function() {
  return this.m.K(this)
};
q.Rc = function() {
  return this.la || (this.la = new qf)
};
q.hc = function(a, b) {
  b ? a && (this.za ? Ua(this.za, a) || this.za.push(a) : this.za = [a], this.m.hc(this, a, !0)) : a && (this.za && Va(this.za, a)) && (0 == this.za.length && (this.za = null), this.m.hc(this, a, !1))
};
q.c = function() {
  var a = this.m.c(this);
  this.e = a;
  var b = this.gd || this.m.lb();
  b && Fe(a, b);
  this.sd || this.m.md(a, !1);
  this.p() || this.m.k(a, !1)
};
q.ja = function() {
  return this.m.ja(this.a())
};
q.J = function() {
  Z.b.J.call(this);
  this.m.Vc(this);
  if(this.N & -2 && (this.Nd && Df(this, !0), this.N & 32)) {
    var a = this.K();
    if(a) {
      var b = this.Rc();
      b.ac(a);
      this.X().h(b, "key", this.Sa).h(a, "focus", this.Ra).h(a, "blur", this.kc)
    }
  }
};
function Df(a, b) {
  var c = a.X(), d = a.a();
  b ? (c.h(d, "mouseover", a.Jb).h(d, "mousedown", a.nc).h(d, "mouseup", a.Pd).h(d, "mouseout", a.Od), a.lc != t && c.h(d, "contextmenu", a.lc), C && c.h(d, "dblclick", a.Ee)) : (c.aa(d, "mouseover", a.Jb).aa(d, "mousedown", a.nc).aa(d, "mouseup", a.Pd).aa(d, "mouseout", a.Od), a.lc != t && c.aa(d, "contextmenu", a.lc), C && c.aa(d, "dblclick", a.Ee))
}
q.ea = function() {
  Z.b.ea.call(this);
  this.la && this.la.detach();
  this.p() && this.isEnabled() && this.m.Wb(this, !1)
};
q.g = function() {
  Z.b.g.call(this);
  this.la && (this.la.B(), delete this.la);
  delete this.m;
  this.za = this.oa = null
};
q.tb = function(a) {
  this.m.tb(this.a(), a);
  this.oa = a
};
function Ef(a) {
  a = a.oa;
  if(!a) {
    return""
  }
  if(!v(a)) {
    if(u(a)) {
      a = Sa(a, Id).join("")
    }else {
      if(hd && "innerText" in a) {
        a = a.innerText.replace(/(\r\n|\r|\n)/g, "\n")
      }else {
        var b = [];
        Jd(a, b, !0);
        a = b.join("")
      }
      a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
      a = a.replace(/\u200B/g, "");
      hd || (a = a.replace(/ +/g, " "));
      " " != a && (a = a.replace(/^\s*/, ""))
    }
  }
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
}
q.Xb = function(a) {
  Z.b.Xb.call(this, a);
  var b = this.a();
  b && this.m.Xb(b, a)
};
q.md = function(a) {
  this.sd = a;
  var b = this.a();
  b && this.m.md(b, a)
};
q.p = e("O");
q.k = function(a, b) {
  if(b || this.O != a && this.dispatchEvent(a ? "show" : "hide")) {
    var c = this.a();
    c && this.m.k(c, a);
    this.isEnabled() && this.m.Wb(this, a);
    this.O = a;
    return!0
  }
  return!1
};
q.isEnabled = function() {
  return!(this.D & 1)
};
q.va = function(a) {
  var b = this.getParent();
  b && "function" == typeof b.isEnabled && !b.isEnabled() || !Ff(this, 1, !a) || (a || (this.setActive(!1), this.wa(!1)), this.p() && this.m.Wb(this, a), this.M(1, !a))
};
q.wa = function(a) {
  Ff(this, 2, a) && this.M(2, a)
};
q.setActive = function(a) {
  Ff(this, 4, a) && this.M(4, a)
};
function Gf(a, b) {
  Ff(a, 8, b) && a.M(8, b)
}
function Hf(a, b) {
  Ff(a, 64, b) && a.M(64, b)
}
q.jc = e("D");
q.M = function(a, b) {
  this.N & a && b != !!(this.D & a) && (this.m.M(this, a, b), this.D = b ? this.D | a : this.D & ~a)
};
function If(a, b, c) {
  if(a.t && a.D & b && !c) {
    throw Error("Component already rendered");
  }
  !c && a.D & b && a.M(b, !1);
  a.N = c ? a.N | b : a.N & ~b
}
function $(a, b) {
  return!!(a.vd & b) && !!(a.N & b)
}
function Ff(a, b, c) {
  return!!(a.N & b) && !!(a.D & b) != c && (!(a.ub & b) || a.dispatchEvent(ve(b, c))) && !a.Mc
}
q.Jb = function(a) {
  (!a.relatedTarget || !Cd(this.a(), a.relatedTarget)) && (this.dispatchEvent("enter") && this.isEnabled() && $(this, 2)) && this.wa(!0)
};
q.Od = function(a) {
  a.relatedTarget && Cd(this.a(), a.relatedTarget) || !this.dispatchEvent("leave") || ($(this, 4) && this.setActive(!1), $(this, 2) && this.wa(!1))
};
q.lc = t;
q.nc = function(a) {
  this.isEnabled() && ($(this, 2) && this.wa(!0), Jc(a) && ($(this, 4) && this.setActive(!0), this.m.Ua(this) && this.K().focus()));
  !this.sd && Jc(a) && a.preventDefault()
};
q.Pd = function(a) {
  this.isEnabled() && ($(this, 2) && this.wa(!0), this.D & 4 && (this.vc(a) && $(this, 4)) && this.setActive(!1))
};
q.Ee = function(a) {
  this.isEnabled() && this.vc(a)
};
q.vc = function(a) {
  if($(this, 16)) {
    var b = !(this.D & 16);
    Ff(this, 16, b) && this.M(16, b)
  }
  $(this, 8) && Gf(this, !0);
  $(this, 64) && Hf(this, !(this.D & 64));
  b = new I("action", this);
  a && (b.altKey = a.altKey, b.ctrlKey = a.ctrlKey, b.metaKey = a.metaKey, b.shiftKey = a.shiftKey, b.ce = a.ce);
  return this.dispatchEvent(b)
};
q.Ra = function() {
  $(this, 32) && Ff(this, 32, !0) && this.M(32, !0)
};
q.kc = function() {
  $(this, 4) && this.setActive(!1);
  $(this, 32) && Ff(this, 32, !1) && this.M(32, !1)
};
q.Sa = function(a) {
  return this.p() && this.isEnabled() && this.mc(a) ? (a.preventDefault(), a.stopPropagation(), !0) : !1
};
q.mc = function(a) {
  return 13 == a.keyCode && this.vc(a)
};
if(!ia(Z)) {
  throw Error("Invalid component class " + Z);
}
if(!ia(wf)) {
  throw Error("Invalid renderer class " + wf);
}
var Jf = ka(Z);
Bf[Jf] = wf;
Af("goog-control", function() {
  return new Z(null)
});
function Kf() {
}
y(Kf, wf);
da(Kf);
q = Kf.prototype;
q.W = p("goog-tab");
q.lb = p("tab");
q.c = function(a) {
  var b = Kf.b.c.call(this, a);
  (a = a.Fb()) && this.Ma(b, a);
  return b
};
q.Fb = function(a) {
  return a.title || ""
};
q.Ma = function(a, b) {
  a && (a.title = b || "")
};
function Lf(a, b, c) {
  Z.call(this, a, b || Kf.Qa(), c);
  If(this, 8, !0);
  this.ub |= 9
}
y(Lf, Z);
Lf.prototype.Fb = e("Ec");
Lf.prototype.Ma = function(a) {
  this.m.Ma(this.a(), a);
  this.sf(a)
};
Lf.prototype.sf = ba("Ec");
Af("goog-tab", function() {
  return new Lf(null)
});
function Mf() {
}
da(Mf);
q = Mf.prototype;
q.lb = aa();
function Nf(a, b) {
  a && (a.tabIndex = b ? 0 : -1)
}
q.c = function(a) {
  return a.j().c("div", this.Db(a).join(" "))
};
q.ja = function(a) {
  return a
};
q.Vc = function(a) {
  a = a.a();
  he(a, !0, D);
  C && (a.hideFocus = !0);
  var b = this.lb();
  b && Fe(a, b)
};
q.K = function(a) {
  return a.a()
};
q.W = p("goog-container");
q.Db = function(a) {
  var b = this.W(), c = [b, a.Xa == Of ? b + "-horizontal" : b + "-vertical"];
  a.isEnabled() || c.push(b + "-disabled");
  return c
};
function Pf(a, b, c) {
  V.call(this, c);
  this.m = b || Mf.Qa();
  this.Xa = a || Qf
}
y(Pf, V);
var Of = "horizontal", Qf = "vertical";
q = Pf.prototype;
q.Ud = null;
q.la = null;
q.m = null;
q.Xa = null;
q.O = !0;
q.pa = !0;
q.Id = !0;
q.L = -1;
q.H = null;
q.Qb = !1;
q.If = !1;
q.Vg = !0;
q.Ia = null;
q.K = function() {
  return this.Ud || this.m.K(this)
};
q.Rc = function() {
  return this.la || (this.la = new qf(this.K()))
};
q.c = function() {
  this.e = this.m.c(this)
};
q.ja = function() {
  return this.m.ja(this.a())
};
q.J = function() {
  Pf.b.J.call(this);
  xe(this, function(a) {
    a.t && Rf(this, a)
  }, this);
  var a = this.a();
  this.m.Vc(this);
  this.k(this.O, !0);
  this.X().h(this, "enter", this.dg).h(this, "highlight", this.gg).h(this, "unhighlight", this.pg).h(this, "open", this.kg).h(this, "close", this.bg).h(a, "mousedown", this.nc).h(N(a), "mouseup", this.cg).h(a, ["mousedown", "mouseup", "mouseover", "mouseout", "contextmenu"], this.ag);
  this.Ua() && Sf(this, !0)
};
function Sf(a, b) {
  var c = a.X(), d = a.K();
  b ? c.h(d, "focus", a.Ra).h(d, "blur", a.kc).h(a.Rc(), "key", a.Sa) : c.aa(d, "focus", a.Ra).aa(d, "blur", a.kc).aa(a.Rc(), "key", a.Sa)
}
q.ea = function() {
  Tf(this, -1);
  this.H && Hf(this.H, !1);
  this.Qb = !1;
  Pf.b.ea.call(this)
};
q.g = function() {
  Pf.b.g.call(this);
  this.la && (this.la.B(), this.la = null);
  this.m = this.H = this.Ia = this.Ud = null
};
q.dg = p(!0);
q.gg = function(a) {
  var b = Ae(this, a.target);
  if(-1 < b && b != this.L) {
    var c = W(this, this.L);
    c && c.wa(!1);
    this.L = b;
    c = W(this, this.L);
    this.Qb && c.setActive(!0);
    this.Vg && (this.H && c != this.H) && (c.N & 64 ? Hf(c, !0) : Hf(this.H, !1))
  }
  b = this.a();
  null != a.target.a() && Ge(b, "activedescendant", a.target.a().id)
};
q.pg = function(a) {
  a.target == W(this, this.L) && (this.L = -1);
  this.a().removeAttribute("aria-activedescendant")
};
q.kg = function(a) {
  (a = a.target) && (a != this.H && a.getParent() == this) && (this.H && Hf(this.H, !1), this.H = a)
};
q.bg = function(a) {
  a.target == this.H && (this.H = null)
};
q.nc = function(a) {
  this.pa && (this.Qb = !0);
  var b = this.K();
  b && Gd(b) ? b.focus() : a.preventDefault()
};
q.cg = function() {
  this.Qb = !1
};
q.ag = function(a) {
  var b;
  a: {
    b = a.target;
    if(this.Ia) {
      for(var c = this.a();b && b !== c;) {
        var d = b.id;
        if(d in this.Ia) {
          b = this.Ia[d];
          break a
        }
        b = b.parentNode
      }
    }
    b = null
  }
  if(b) {
    switch(a.type) {
      case "mousedown":
        b.nc(a);
        break;
      case "mouseup":
        b.Pd(a);
        break;
      case "mouseover":
        b.Jb(a);
        break;
      case "mouseout":
        b.Od(a);
        break;
      case "contextmenu":
        b.lc(a)
    }
  }
};
q.Ra = aa();
q.kc = function() {
  Tf(this, -1);
  this.Qb = !1;
  this.H && Hf(this.H, !1)
};
q.Sa = function(a) {
  return this.isEnabled() && this.p() && (0 != ye(this) || this.Ud) && this.mc(a) ? (a.preventDefault(), a.stopPropagation(), !0) : !1
};
q.mc = function(a) {
  var b = W(this, this.L);
  if(b && "function" == typeof b.Sa && b.Sa(a) || this.H && this.H != b && "function" == typeof this.H.Sa && this.H.Sa(a)) {
    return!0
  }
  if(a.shiftKey || a.ctrlKey || a.metaKey || a.altKey) {
    return!1
  }
  switch(a.keyCode) {
    case 27:
      if(this.Ua()) {
        this.K().blur()
      }else {
        return!1
      }
      break;
    case 36:
      Uf(this);
      break;
    case 35:
      Vf(this);
      break;
    case 38:
      if(this.Xa == Qf) {
        Wf(this)
      }else {
        return!1
      }
      break;
    case 37:
      if(this.Xa == Of) {
        ze(this) ? Xf(this) : Wf(this)
      }else {
        return!1
      }
      break;
    case 40:
      if(this.Xa == Qf) {
        Xf(this)
      }else {
        return!1
      }
      break;
    case 39:
      if(this.Xa == Of) {
        ze(this) ? Wf(this) : Xf(this)
      }else {
        return!1
      }
      break;
    default:
      return!1
  }
  return!0
};
function Rf(a, b) {
  var c = b.a(), c = c.id || (c.id = b.I());
  a.Ia || (a.Ia = {});
  a.Ia[c] = b
}
q.U = function(a, b) {
  Pf.b.U.call(this, a, b)
};
q.Ic = function(a, b, c) {
  a.ub |= 2;
  a.ub |= 64;
  !this.Ua() && this.If || If(a, 32, !1);
  Cf(a, !1);
  Pf.b.Ic.call(this, a, b, c);
  a.t && this.t && Rf(this, a);
  b <= this.L && this.L++
};
q.removeChild = function(a, b) {
  if(a = v(a) ? this.V && a ? (a in this.V ? this.V[a] : void 0) || null : null : a) {
    var c = Ae(this, a);
    -1 != c && (c == this.L ? a.wa(!1) : c < this.L && this.L--);
    var d = a.a();
    d && (d.id && this.Ia) && (c = this.Ia, d = d.id, d in c && delete c[d])
  }
  a = Pf.b.removeChild.call(this, a, b);
  Cf(a, !0);
  return a
};
q.p = e("O");
q.k = function(a, b) {
  if(b || this.O != a && this.dispatchEvent(a ? "show" : "hide")) {
    this.O = a;
    var c = this.a();
    c && (S(c, a), this.Ua() && Nf(this.K(), this.pa && this.O), b || this.dispatchEvent(this.O ? "aftershow" : "afterhide"));
    return!0
  }
  return!1
};
q.isEnabled = e("pa");
q.va = function(a) {
  this.pa != a && this.dispatchEvent(a ? "enable" : "disable") && (a ? (this.pa = !0, xe(this, function(a) {
    a.Ff ? delete a.Ff : a.va(!0)
  })) : (xe(this, function(a) {
    a.isEnabled() ? a.va(!1) : a.Ff = !0
  }), this.Qb = this.pa = !1), this.Ua() && Nf(this.K(), a && this.O))
};
q.Ua = e("Id");
q.Wb = function(a) {
  a != this.Id && this.t && Sf(this, a);
  this.Id = a;
  this.pa && this.O && Nf(this.K(), a)
};
function Tf(a, b) {
  var c = W(a, b);
  c ? c.wa(!0) : -1 < a.L && W(a, a.L).wa(!1)
}
q.wa = function(a) {
  Tf(this, Ae(this, a))
};
function Uf(a) {
  Yf(a, function(a, c) {
    return(a + 1) % c
  }, ye(a) - 1)
}
function Vf(a) {
  Yf(a, function(a, c) {
    a--;
    return 0 > a ? c - 1 : a
  }, 0)
}
function Xf(a) {
  Yf(a, function(a, c) {
    return(a + 1) % c
  }, a.L)
}
function Wf(a) {
  Yf(a, function(a, c) {
    a--;
    return 0 > a ? c - 1 : a
  }, a.L)
}
function Yf(a, b, c) {
  c = 0 > c ? Ae(a, a.H) : c;
  var d = ye(a);
  c = b.call(a, c, d);
  for(var f = 0;f <= d;) {
    var g = W(a, c);
    if(g && g.p() && g.isEnabled() && g.N & 2) {
      a.ie(c);
      break
    }
    f++;
    c = b.call(a, c, d)
  }
}
q.ie = function(a) {
  Tf(this, a)
};
function Zf() {
}
y(Zf, Mf);
da(Zf);
Zf.prototype.W = p("goog-tab-bar");
Zf.prototype.lb = p("tablist");
Zf.prototype.Db = function(a) {
  var b = Zf.b.Db.call(this, a);
  if(!this.te) {
    var c = this.W();
    this.te = eb($f, c + "-top", ag, c + "-bottom", bg, c + "-start", cg, c + "-end")
  }
  b.push(this.te[a.Ag]);
  return b
};
function dg(a, b, c) {
  a = a || $f;
  if(this.a()) {
    throw Error("Component already rendered");
  }
  this.Xa = a == bg || a == cg ? Qf : Of;
  this.Ag = a;
  Pf.call(this, this.Xa, b || Zf.Qa(), c);
  eg(this)
}
y(dg, Pf);
var $f = "top", ag = "bottom", bg = "start", cg = "end";
q = dg.prototype;
q.Mf = !0;
q.Y = null;
q.J = function() {
  dg.b.J.call(this);
  eg(this)
};
q.g = function() {
  dg.b.g.call(this);
  this.Y = null
};
q.removeChild = function(a, b) {
  fg(this, a);
  return dg.b.removeChild.call(this, a, b)
};
q.ie = function(a) {
  dg.b.ie.call(this, a);
  this.Mf && gg(this, W(this, a))
};
function gg(a, b) {
  b ? Gf(b, !0) : a.Y && Gf(a.Y, !1)
}
function fg(a, b) {
  if(b && b == a.Y) {
    for(var c = Ae(a, b), d = c - 1;b = W(a, d);d--) {
      if(b.p() && b.isEnabled()) {
        gg(a, b);
        return
      }
    }
    for(c += 1;b = W(a, c);c++) {
      if(b.p() && b.isEnabled()) {
        gg(a, b);
        return
      }
    }
    gg(a, null)
  }
}
q.ng = function(a) {
  this.Y && this.Y != a.target && Gf(this.Y, !1);
  this.Y = a.target
};
q.og = function(a) {
  a.target == this.Y && (this.Y = null)
};
q.lg = function(a) {
  fg(this, a.target)
};
q.mg = function(a) {
  fg(this, a.target)
};
q.Ra = function() {
  W(this, this.L) || this.wa(this.Y || W(this, 0))
};
function eg(a) {
  a.X().h(a, "select", a.ng).h(a, "unselect", a.og).h(a, "disable", a.lg).h(a, "hide", a.mg)
}
Af("goog-tab-bar", function() {
  return new dg
});
function hg() {
  V.call(this)
}
y(hg, V);
hg.prototype.ib = null;
hg.prototype.g = function() {
  delete this.ib;
  hg.b.g.call(this)
};
hg.prototype.c = function() {
  this.e = this.j().c("DIV", "control-block");
  this.ib && (A(this.ib, this.addElement, this), this.ib = null)
};
hg.prototype.addElement = function(a) {
  var b = this.a();
  if(b) {
    if(b.childNodes.length) {
      var c = this.j().createTextNode("\u00a0\u00a0|\u00a0\u00a0");
      b.appendChild(c)
    }
    b.appendChild(a)
  }else {
    this.ib || (this.ib = []), this.ib.push(a)
  }
};
function ig(a) {
  X.call(this, void 0, !0);
  bf(this, a);
  J(this, gf, this.Ug, !1, this)
}
y(ig, X);
ig.prototype.c = function() {
  ig.b.c.call(this);
  var a = this.ja(), b = this.xe();
  a.appendChild(b)
};
ig.prototype.k = function(a) {
  ig.b.k.call(this, a);
  a && this.dispatchEvent("show")
};
ig.prototype.Ug = function(a) {
  "ok" == a.key && this.Ie() && this.dispatchEvent("action")
};
function jg(a) {
  ig.call(this, "Create a New Session");
  this.zd = Sa(a, function(a) {
    return v(a) ? {browserName:a} : a
  });
  J(this, "show", this.Wa, !1, this)
}
y(jg, ig);
q = jg.prototype;
q.cb = null;
q.g = function() {
  delete this.zd;
  delete this.cb;
  jg.b.g.call(this)
};
q.xe = function() {
  function a(a) {
    var d = a.browserName;
    (a = a.version) && (d += " " + a);
    return b.c(id, null, d)
  }
  var b = this.j();
  this.cb = b.c("SELECT", null, a(""));
  A(this.zd, function(b) {
    b = a(b);
    this.cb.appendChild(b)
  }, this);
  return b.c("LABEL", null, "Browser:\u00a0", this.cb)
};
q.Md = function() {
  return this.zd[this.cb.selectedIndex - 1]
};
q.Ie = function() {
  return!!this.cb.selectedIndex
};
q.Wa = function() {
  this.cb.selectedIndex = 0
};
function kg(a) {
  V.call(this);
  this.Te = a
}
y(kg, V);
kg.prototype.g = function() {
  delete this.Te;
  kg.b.g.call(this)
};
kg.prototype.c = function() {
  var a = this.j();
  this.e = a.c("FIELDSET", null, a.c("LEGEND", null, this.Te), this.ye())
};
kg.prototype.ye = p(null);
function lg() {
}
y(lg, wf);
da(lg);
q = lg.prototype;
q.lb = p("button");
q.Na = function(a, b, c) {
  switch(b) {
    case 8:
    ;
    case 16:
      Ge(a, "pressed", c);
      break;
    default:
    ;
    case 64:
    ;
    case 1:
      lg.b.Na.call(this, a, b, c)
  }
};
q.c = function(a) {
  var b = lg.b.c.call(this, a);
  this.Ma(b, a.Fb());
  var c = a.Gb();
  c && this.zc(b, c);
  a.N & 16 && this.Na(b, 16, !!(a.D & 16));
  return b
};
q.Gb = t;
q.zc = t;
q.Fb = function(a) {
  return a.title
};
q.Ma = function(a, b) {
  a && b && (a.title = b)
};
q.W = p("goog-button");
function mg() {
}
y(mg, lg);
da(mg);
q = mg.prototype;
q.lb = aa();
q.c = function(a) {
  Cf(a, !1);
  a.vd &= -256;
  If(a, 32, !1);
  return a.j().c("button", {"class":this.Db(a).join(" "), disabled:!a.isEnabled(), title:a.Fb() || "", value:a.Gb() || ""}, Ef(a) || "")
};
q.Vc = function(a) {
  a.X().h(a.a(), "click", a.vc)
};
q.md = t;
q.Xb = t;
q.Ua = function(a) {
  return a.isEnabled()
};
q.Wb = t;
q.M = function(a, b, c) {
  mg.b.M.call(this, a, b, c);
  (a = a.a()) && 1 == b && (a.disabled = c)
};
q.Gb = function(a) {
  return a.value
};
q.zc = function(a, b) {
  a && (a.value = b)
};
q.Na = t;
function ng(a, b, c) {
  Z.call(this, a, b || mg.Qa(), c)
}
y(ng, Z);
q = ng.prototype;
q.Gb = e("Ef");
q.zc = function(a) {
  this.Ef = a;
  this.m.zc(this.a(), a)
};
q.Fb = e("Ec");
q.Ma = function(a) {
  this.Ec = a;
  this.m.Ma(this.a(), a)
};
q.sf = ba("Ec");
q.g = function() {
  ng.b.g.call(this);
  delete this.Ef;
  delete this.Ec
};
q.J = function() {
  ng.b.J.call(this);
  if(this.N & 32) {
    var a = this.K();
    a && this.X().h(a, "keyup", this.mc)
  }
};
q.mc = function(a) {
  return 13 == a.keyCode && "key" == a.type || 32 == a.keyCode && "keyup" == a.type ? this.vc(a) : 32 == a.keyCode
};
Af("goog-button", function() {
  return new ng(null)
});
function og(a) {
  a = String(a);
  if(/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
}
function pg(a) {
  this.jd = a
}
function qg(a, b) {
  var c = [];
  rg(a, b, c);
  return c.join("")
}
function rg(a, b, c) {
  switch(typeof b) {
    case "string":
      sg(b, c);
      break;
    case "number":
      c.push(isFinite(b) && !isNaN(b) ? b : "null");
      break;
    case "boolean":
      c.push(b);
      break;
    case "undefined":
      c.push("null");
      break;
    case "object":
      if(null == b) {
        c.push("null");
        break
      }
      if(u(b)) {
        var d = b.length;
        c.push("[");
        for(var f = "", g = 0;g < d;g++) {
          c.push(f), f = b[g], rg(a, a.jd ? a.jd.call(b, String(g), f) : f, c), f = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(g in b) {
        Object.prototype.hasOwnProperty.call(b, g) && (f = b[g], "function" != typeof f && (c.push(d), sg(g, c), c.push(":"), rg(a, a.jd ? a.jd.call(b, g, f) : f, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof b);
  }
}
var tg = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, ug = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function sg(a, b) {
  b.push('"', a.replace(ug, function(a) {
    if(a in tg) {
      return tg[a]
    }
    var b = a.charCodeAt(0), f = "\\u";
    16 > b ? f += "000" : 256 > b ? f += "00" : 4096 > b && (f += "0");
    return tg[a] = f + b.toString(16)
  }), '"')
}
;function vg(a, b) {
  null != a && this.append.apply(this, arguments)
}
q = vg.prototype;
q.eb = "";
q.set = function(a) {
  this.eb = "" + a
};
q.append = function(a, b, c) {
  this.eb += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.eb += arguments[d]
    }
  }
  return this
};
q.clear = function() {
  this.eb = ""
};
q.toString = e("eb");
function wg(a, b) {
  var c = Array.prototype.slice.call(arguments), d = c.shift();
  if("undefined" == typeof d) {
    throw Error("[goog.string.format] Template required");
  }
  return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, d, k, l, n, m, s) {
    if("%" == n) {
      return"%"
    }
    var w = c.shift();
    if("undefined" == typeof w) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = w;
    return xg[n].apply(null, arguments)
  })
}
var xg = {s:function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + Ja(" ", c - a.length) : Ja(" ", c - a.length) + a
}, f:function(a, b, c, d, f) {
  d = a.toString();
  isNaN(f) || "" == f || (d = a.toFixed(f));
  var g;
  g = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (d = g + d);
  if(isNaN(c) || d.length >= c) {
    return d
  }
  d = isNaN(f) ? Math.abs(a).toString() : Math.abs(a).toFixed(f);
  a = c - d.length - g.length;
  return d = 0 <= b.indexOf("-", 0) ? g + d + Ja(" ", a) : g + Ja(0 <= b.indexOf("0", 0) ? "0" : " ", a) + d
}, d:function(a, b, c, d, f, g, h, k) {
  return xg.f(parseInt(a, 10), b, c, d, 0, g, h, k)
}};
xg.i = xg.d;
xg.u = xg.d;
function yg() {
  this.q = new zg || new zg;
  this.Sd = new pg
}
function Ag(a) {
  var b = new yg;
  if(null == a) {
    return""
  }
  if(v(a)) {
    if(/^[\s\xa0]*$/.test(a)) {
      return""
    }
    a = og(a)
  }
  var c = new vg;
  Bg(b, a, c, 0);
  return c.toString()
}
function Bg(a, b, c, d) {
  var f = ea(b);
  switch(f) {
    case "null":
    ;
    case "boolean":
    ;
    case "number":
    ;
    case "string":
      c.append(wg(a.q.hf, f), qg(a.Sd, b), wg(a.q.gf, f));
      break;
    case "array":
      c.append(a.q.Kf);
      for(var g = 0, g = 0;g < b.length;g++) {
        0 < g && c.append(a.q.jf), c.append(a.q.$c), c.append(Ja(a.q.Cc, d + a.q.Uc)), Bg(a, b[g], c, d + a.q.Uc)
      }
      0 < g && (c.append(a.q.$c), c.append(Ja(a.q.Cc, d)));
      c.append(a.q.Jf);
      break;
    case "object":
      c.append(a.q.Hg);
      f = 0;
      for(g in b) {
        if(b.hasOwnProperty(g)) {
          0 < f && c.append(a.q.jf);
          c.append(a.q.$c);
          c.append(Ja(a.q.Cc, d + a.q.Uc));
          var h = a;
          c.append(h.q.Zg, qg(h.Sd, g), h.q.Yg);
          c.append(a.q.Eg, a.q.Cc);
          Bg(a, b[g], c, d + a.q.Uc);
          f++
        }
      }
      0 < f && (c.append(a.q.$c), c.append(Ja(a.q.Cc, d)));
      c.append(a.q.Gg);
      break;
    default:
      c.append(wg(a.q.hf, "unknown"), qg(a.Sd, ""), wg(a.q.gf, "unknown"))
  }
}
function zg() {
}
q = zg.prototype;
q.Cc = " ";
q.$c = "\n";
q.Hg = "{";
q.Gg = "}";
q.Kf = "[";
q.Jf = "]";
q.jf = ",";
q.Eg = ":";
q.Zg = "";
q.Yg = "";
q.hf = "";
q.gf = "";
q.Uc = 2;
function Cg(a, b, c, d, f, g, h, k) {
  var l, n;
  if(l = c.offsetParent) {
    var m = "HTML" == l.tagName || "BODY" == l.tagName;
    m && "static" == Td(l) || (n = $d(l), m || (m = (m = ae(l)) && D ? -l.scrollLeft : !m || C && H("8") || "visible" == Sd(l, "overflowX") ? l.scrollLeft : l.scrollWidth - l.clientWidth - l.scrollLeft, n = nd(n, new L(m, l.scrollTop))))
  }
  l = n || new L;
  n = ee(a);
  (m = Zd(a)) && n.Oe(new Od(m.left, m.top, m.right - m.left, m.bottom - m.top));
  var m = M(a), s = M(c);
  if(m.r != s.r) {
    var w = m.r.body, s = Ld(s), ga = new L(0, 0), ma = ud(N(w)), T = w;
    do {
      var E;
      if(ma == s) {
        E = $d(T)
      }else {
        E = T;
        var Q = void 0;
        if(E.getBoundingClientRect) {
          Q = Xd(E), Q = new L(Q.left, Q.top)
        }else {
          var Q = Md(M(E)), F = $d(E), Q = new L(F.x - Q.x, F.y - Q.y)
        }
        F = void 0;
        if(D && !H(12)) {
          F = void 0;
          F = void 0;
          C ? F = "-ms-transform" : G ? F = "-webkit-transform" : B ? F = "-o-transform" : D && (F = "-moz-transform");
          var ac = void 0;
          F && (ac = Sd(E, F));
          ac || (ac = Sd(E, "transform"));
          F = ac ? (E = ac.match(ne)) ? new L(parseFloat(E[1]), parseFloat(E[2])) : new L(0, 0) : new L(0, 0);
          F = new L(Q.x + F.x, Q.y + F.y)
        }else {
          F = Q
        }
        E = F
      }
      ga.x += E.x;
      ga.y += E.y
    }while(ma && ma != s && (T = ma.frameElement) && (ma = ma.parent));
    w = nd(ga, $d(w));
    C && !Kd(m) && (w = nd(w, Md(m)));
    n.left += w.x;
    n.top += w.y
  }
  a = (b & 4 && ae(a) ? b ^ 2 : b) & -5;
  b = new L(a & 2 ? n.left + n.width : n.left, a & 1 ? n.top + n.height : n.top);
  b = nd(b, l);
  f && (b.x += (a & 2 ? -1 : 1) * f.x, b.y += (a & 1 ? -1 : 1) * f.y);
  var na;
  h && (na = Zd(c)) && (na.top -= l.y, na.right -= l.x, na.bottom -= l.y, na.left -= l.x);
  return Dg(b, c, d, g, na, h, k)
}
function Dg(a, b, c, d, f, g, h) {
  a = a.ca();
  var k = 0, l = (c & 4 && ae(b) ? c ^ 2 : c) & -5;
  c = ce(b);
  h = h ? h.ca() : c.ca();
  if(d || 0 != l) {
    l & 2 ? a.x -= h.width + (d ? d.right : 0) : d && (a.x += d.left), l & 1 ? a.y -= h.height + (d ? d.bottom : 0) : d && (a.y += d.top)
  }
  if(g && (f ? (k = a, d = 0, 65 == (g & 65) && (k.x < f.left || k.x >= f.right) && (g &= -2), 132 == (g & 132) && (k.y < f.top || k.y >= f.bottom) && (g &= -5), k.x < f.left && g & 1 && (k.x = f.left, d |= 1), k.x < f.left && (k.x + h.width > f.right && g & 16) && (h.width = Math.max(h.width - (k.x + h.width - f.right), 0), d |= 4), k.x + h.width > f.right && g & 1 && (k.x = Math.max(f.right - h.width, f.left), d |= 1), g & 2 && (d |= (k.x < f.left ? 16 : 0) | (k.x + h.width > f.right ? 32 : 0)), 
  k.y < f.top && g & 4 && (k.y = f.top, d |= 2), k.y <= f.top && (k.y + h.height < f.bottom && g & 32) && (h.height = Math.max(h.height - (f.top - k.y), 0), k.y = f.top, d |= 8), k.y >= f.top && (k.y + h.height > f.bottom && g & 32) && (h.height = Math.max(h.height - (k.y + h.height - f.bottom), 0), d |= 8), k.y + h.height > f.bottom && g & 4 && (k.y = Math.max(f.bottom - h.height, f.top), d |= 2), g & 8 && (d |= (k.y < f.top ? 64 : 0) | (k.y + h.height > f.bottom ? 128 : 0)), k = d) : k = 256, k & 
  496)) {
    return k
  }
  Ud(b, a);
  c == h || c && h && c.width == h.width && c.height == h.height || (f = Kd(M(N(b))), !C || f && H("8") ? (b = b.style, D ? b.MozBoxSizing = "border-box" : G ? b.WebkitBoxSizing = "border-box" : b.boxSizing = "border-box", b.width = Math.max(h.width, 0) + "px", b.height = Math.max(h.height, 0) + "px") : (a = b.style, f ? (C ? (f = je(b, "paddingLeft"), c = je(b, "paddingRight"), g = je(b, "paddingTop"), d = je(b, "paddingBottom"), f = new P(g, c, d, f)) : (f = R(b, "paddingLeft"), c = R(b, "paddingRight"), 
  g = R(b, "paddingTop"), d = R(b, "paddingBottom"), f = new P(parseFloat(g), parseFloat(c), parseFloat(d), parseFloat(f))), b = me(b), a.pixelWidth = h.width - b.left - f.left - f.right - b.right, a.pixelHeight = h.height - b.top - f.top - f.bottom - b.bottom) : (a.pixelWidth = h.width, a.pixelHeight = h.height)));
  return k
}
;function Eg() {
}
Eg.prototype.$ = aa();
function Fg(a, b, c) {
  this.element = a;
  this.we = b;
  this.Wg = c
}
y(Fg, Eg);
Fg.prototype.$ = function(a, b, c) {
  Cg(this.element, this.we, a, b, void 0, c, this.Wg)
};
function Gg(a, b) {
  this.Cd = a instanceof L ? a : new L(a, b)
}
y(Gg, Eg);
Gg.prototype.$ = function(a, b, c, d) {
  Cg(Wd(a), 0, a, b, this.Cd, c, null, d)
};
function Hg(a, b) {
  this.Xg = 4;
  this.de = b || void 0;
  Ve.call(this, a)
}
y(Hg, Ve);
Hg.prototype.$ = function() {
  if(this.de) {
    var a = !this.p() && "move_offscreen" != this.$b, b = this.a();
    a && (b.style.visibility = "hidden", S(b, !0));
    this.de.$(b, this.Xg, this.Bg);
    a && S(b, !1)
  }
};
function Ig(a, b, c) {
  this.ia = c || (a ? M(v(a) ? document.getElementById(a) : a) : M());
  Hg.call(this, this.ia.c("div", {style:"position:absolute;display:none;"}));
  this.gb = new L(1, 1);
  this.jb = new Yb;
  a && this.ac(a);
  null != b && Dd(this.a(), b)
}
y(Ig, Hg);
var Jg = [];
q = Ig.prototype;
q.G = null;
q.className = "goog-tooltip";
q.uf = 500;
q.Je = 0;
q.j = e("ia");
q.ac = function(a) {
  a = v(a) ? document.getElementById(a) : a;
  this.jb.add(a);
  J(a, "mouseover", this.Jb, !1, this);
  J(a, "mouseout", this.Sc, !1, this);
  J(a, "mousemove", this.Ib, !1, this);
  J(a, "focus", this.Ra, !1, this);
  J(a, "blur", this.Sc, !1, this)
};
q.detach = function(a) {
  if(a) {
    a = v(a) ? document.getElementById(a) : a, Kg(this, a), this.jb.remove(a)
  }else {
    for(var b = this.jb.fa(), c = 0;a = b[c];c++) {
      Kg(this, a)
    }
    this.jb.clear()
  }
};
function Kg(a, b) {
  Xc(b, "mouseover", a.Jb, !1, a);
  Xc(b, "mouseout", a.Sc, !1, a);
  Xc(b, "mousemove", a.Ib, !1, a);
  Xc(b, "focus", a.Ra, !1, a);
  Xc(b, "blur", a.Sc, !1, a)
}
q.Ld = e("Je");
q.he = function(a) {
  var b = this.a();
  b && Bd(b);
  Ig.b.he.call(this, a);
  a && (b = this.ia.r.body, b.insertBefore(a, b.lastChild))
};
q.jc = function() {
  return this.ab ? this.p() ? 4 : 1 : this.Lb ? 3 : this.p() ? 2 : 0
};
q.Wc = function(a) {
  if(!this.p()) {
    return!1
  }
  var b = $d(this.a()), c = ce(this.a());
  return b.x <= a.x && a.x <= b.x + c.width && b.y <= a.y && a.y <= b.y + c.height
};
q.Zd = function() {
  if(!Ve.prototype.Zd.call(this)) {
    return!1
  }
  if(this.anchor) {
    for(var a, b = 0;a = Jg[b];b++) {
      Cd(a.a(), this.anchor) || a.k(!1)
    }
  }
  Ua(Jg, this) || Jg.push(this);
  a = this.a();
  a.className = this.className;
  Lg(this);
  J(a, "mouseover", this.Qd, !1, this);
  J(a, "mouseout", this.Ge, !1, this);
  Mg(this);
  return!0
};
q.tc = function() {
  Va(Jg, this);
  for(var a = this.a(), b, c = 0;b = Jg[c];c++) {
    b.anchor && Cd(a, b.anchor) && b.k(!1)
  }
  this.ff && Ng(this.ff);
  Xc(a, "mouseover", this.Qd, !1, this);
  Xc(a, "mouseout", this.Ge, !1, this);
  this.anchor = void 0;
  0 == this.jc() && (this.ld = !1);
  Ve.prototype.tc.call(this)
};
q.Ye = function(a, b) {
  this.anchor == a && this.jb.contains(this.anchor) && (this.ld || !this.Dh ? (this.k(!1), this.p() || (this.anchor = a, this.de = b || Og(this, 0) || void 0, this.p() && this.$(), this.k(!0))) : this.anchor = void 0);
  this.ab = void 0
};
q.Kd = e("G");
q.Xe = function(a) {
  this.Lb = void 0;
  a == this.anchor && (null != this.G && (this.G == this.a() || this.jb.contains(this.G)) || this.xb && this.xb.G || this.k(!1))
};
function Pg(a, b) {
  var c = Md(a.ia);
  a.gb.x = b.clientX + c.x;
  a.gb.y = b.clientY + c.y
}
q.Jb = function(a) {
  var b = Qg(this, a.target);
  this.G = b;
  Lg(this);
  b != this.anchor && (this.anchor = b, this.ab || (this.ab = Te(x(this.Ye, this, b, void 0), this.uf)), Rg(this), Pg(this, a))
};
function Qg(a, b) {
  try {
    for(;b && !a.jb.contains(b);) {
      b = b.parentNode
    }
    return b
  }catch(c) {
    return null
  }
}
q.Ib = function(a) {
  Pg(this, a);
  this.ld = !0
};
q.Ra = function(a) {
  this.G = a = Qg(this, a.target);
  this.ld = !0;
  if(this.anchor != a) {
    this.anchor = a;
    var b = Og(this, 1);
    Lg(this);
    this.ab || (this.ab = Te(x(this.Ye, this, a, b), this.uf));
    Rg(this)
  }
};
function Og(a, b) {
  if(0 == b) {
    var c = a.gb.ca();
    return new Sg(c)
  }
  return new Tg(a.G)
}
function Rg(a) {
  if(a.anchor) {
    for(var b, c = 0;b = Jg[c];c++) {
      Cd(b.a(), a.anchor) && (b.xb = a, a.ff = b)
    }
  }
}
q.Sc = function(a) {
  var b = Qg(this, a.target), c = Qg(this, a.relatedTarget);
  b != c && (b == this.G && (this.G = null), Mg(this), this.ld = !1, !this.p() || a.relatedTarget && Cd(this.a(), a.relatedTarget) ? this.anchor = void 0 : Ng(this))
};
q.Qd = function() {
  var a = this.a();
  this.G != a && (Lg(this), this.G = a)
};
q.Ge = function(a) {
  var b = this.a();
  this.G != b || a.relatedTarget && Cd(b, a.relatedTarget) || (this.G = null, Ng(this))
};
function Mg(a) {
  a.ab && (r.clearTimeout(a.ab), a.ab = void 0)
}
function Ng(a) {
  2 == a.jc() && (a.Lb = Te(x(a.Xe, a, a.anchor), a.Ld()))
}
function Lg(a) {
  a.Lb && (r.clearTimeout(a.Lb), a.Lb = void 0)
}
q.g = function() {
  this.k(!1);
  Mg(this);
  this.detach();
  this.a() && Bd(this.a());
  this.G = null;
  delete this.ia;
  Ig.b.g.call(this)
};
function Sg(a, b) {
  Gg.call(this, a, b)
}
y(Sg, Gg);
Sg.prototype.$ = function(a, b, c) {
  b = Wd(a);
  b = Zd(b);
  c = c ? new P(c.top + 10, c.right, c.bottom, c.left + 10) : new P(10, 0, 0, 10);
  Dg(this.Cd, a, 4, c, b, 9) & 496 && Dg(this.Cd, a, 4, c, b, 5)
};
function Tg(a) {
  Fg.call(this, a, 3)
}
y(Tg, Fg);
Tg.prototype.$ = function(a, b, c) {
  var d = new L(10, 0);
  Cg(this.element, this.we, a, b, d, c, 9) & 496 && Cg(this.element, 2, a, 1, d, c, 5)
};
function Ug(a, b, c) {
  Ig.call(this, a, b, c)
}
y(Ug, Ig);
q = Ug.prototype;
q.ze = !1;
q.Rf = 100;
q.Fc = !1;
q.Wa = function() {
  Ug.b.Wa.call(this);
  this.Jc = Pd(ee(this.a()));
  this.anchor && (this.ud = Pd(ee(this.anchor)));
  this.Fc = this.ze;
  J(O(this.j()), "mousemove", this.Ib, !1, this)
};
q.tc = function() {
  Xc(O(this.j()), "mousemove", this.Ib, !1, this);
  this.ud = this.Jc = null;
  this.Fc = !1;
  Ug.b.tc.call(this)
};
q.Wc = function(a) {
  if(this.pc) {
    var b = $d(this.a()), c = ce(this.a());
    return b.x - this.pc.left <= a.x && a.x <= b.x + c.width + this.pc.right && b.y - this.pc.top <= a.y && a.y <= b.y + c.height + this.pc.bottom
  }
  return Ug.b.Wc.call(this, a)
};
function Vg(a, b) {
  if(a.ud && a.ud.contains(b) || a.Wc(b)) {
    return!0
  }
  var c = a.xb;
  return!!c && c.Wc(b)
}
q.Xe = function(a) {
  this.Lb = void 0;
  a != this.anchor || (Vg(this, this.gb) || (this.Kd() || this.xb && this.xb.G) || D && 0 == this.gb.x && 0 == this.gb.y) || this.k(!1)
};
q.Ib = function(a) {
  var b = this.p();
  if(this.Jc) {
    var c = Md(this.j()), c = new L(a.clientX + c.x, a.clientY + c.y);
    Vg(this, c) ? b = !1 : this.Fc && (b = Nd(this.Jc, c) >= Nd(this.Jc, this.gb))
  }
  if(b) {
    if(Ng(this), this.G = null, b = this.xb) {
      b.G = null
    }
  }else {
    3 == this.jc() && Lg(this)
  }
  Ug.b.Ib.call(this, a)
};
q.Qd = function() {
  this.Kd() != this.a() && (this.Fc = !1, this.G = this.a())
};
q.Ld = function() {
  return this.Fc ? this.Rf : Ug.b.Ld.call(this)
};
function Wg() {
  Ig.call(this, void 0, void 0, void 0);
  var a = this.j();
  this.yd = a.createElement("PRE");
  this.Kc = a.c("BUTTON", null, "Close");
  J(this.Kc, "click", x(this.k, this, !1));
  a = a.c("DIV", null, this.yd, a.createElement("HR"), a.c("DIV", {style:"text-align: center;"}, this.Kc));
  this.a().appendChild(a)
}
y(Wg, Ug);
Wg.prototype.g = function() {
  ad(this.Kc);
  delete this.Kc;
  delete this.yd;
  Wg.b.g.call(this)
};
Wg.prototype.update = function(a) {
  this.yd.innerHTML = Ag(a || {})
};
function Xg() {
  V.call(this);
  this.Q = new hg;
  this.U(this.Q);
  this.fb = new X(void 0, !0);
  bf(this.fb, "Delete session?");
  this.fb.tb("Are you sure you want to delete this session?");
  J(this.fb, gf, this.Jg, !1, this);
  this.fc = new ng("Delete Session");
  this.U(this.fc);
  J(this.fc, "action", x(this.fb.k, this.fb, !0));
  this.La = new ng("Take Screenshot");
  this.U(this.La);
  J(this.La, "action", this.ae, !1, this);
  this.Oa = new Wg;
  this.Oa.pc = new P(5, 5, 5, 5) || null;
  this.Oa.ze = !0;
  var a = this.Oa, b = new P(10, 0, 0, 0);
  a.Bg = null == b || b instanceof P ? b : new P(b, void 0, void 0, void 0);
  a.p() && a.$();
  this.Oa.Je = 250
}
y(Xg, V);
q = Xg.prototype;
q.g = function() {
  this.Oa.B();
  this.fb.B();
  delete this.Q;
  delete this.Nc;
  delete this.pd;
  delete this.ge;
  delete this.fb;
  delete this.Oa;
  delete this.La;
  delete this.fc;
  delete this.me;
  Xg.b.g.call(this)
};
q.c = function() {
  this.La.c();
  this.fc.c();
  this.Q.c();
  var a = this.j();
  this.Nc = a.c("DIV", "goog-tab-content empty-view", "No Sessions");
  this.ge = a.createElement("SPAN");
  this.me = a.c("DIV", "todo", "\u00a0");
  this.me.disabled = !0;
  this.Q.addElement(this.ge);
  var b;
  this.Q.addElement(b = a.c("SPAN", "session-capabilities", "Capabilities"));
  this.Q.addElement(this.La.a());
  this.Q.addElement(this.fc.a());
  this.pd = a.c("DIV", "goog-tab-content", this.Q.a(), this.me);
  this.e = a.c("DIV", null, this.Nc, this.pd, a.c("DIV", "goog-tab-bar-clear"));
  this.update(null);
  this.Oa.ac(b)
};
q.rd = function(a) {
  this.Q.addElement(a)
};
q.update = function(a) {
  var b = !!a;
  S(this.Nc, !b);
  S(this.pd, b);
  a && (Dd(this.ge, a.I()), this.Oa.update(a.Ha), a.Ha.get("takesScreenshot") ? (this.La.va(!0), this.La.Ma("")) : (this.La.va(!1), this.La.Ma("Screenshots not supported")))
};
q.Jg = function(a) {
  "ok" == a.key && this.dispatchEvent("delete")
};
q.ae = function() {
  this.dispatchEvent("screenshot")
};
function Yg(a) {
  kg.call(this, "Sessions");
  this.A = new dg(bg, null);
  this.Ga = new Xg;
  this.zb = new jg(a);
  this.ec = this.j().c("BUTTON", null, "Create Session");
  this.wc = this.j().c("BUTTON", null, "Refresh Sessions");
  this.Q = new hg;
  this.ma = [];
  this.Df = setInterval(x(this.nh, this), 300);
  this.U(this.A);
  this.U(this.Ga);
  this.U(this.Q);
  this.va(!1);
  this.Q.addElement(this.ec);
  this.Q.addElement(this.wc);
  J(this.ec, "click", x(this.zb.k, this.zb, !0));
  J(this.wc, "click", x(this.dispatchEvent, this, "refresh"));
  J(this.A, "select", this.Sg, !1, this);
  J(this.zb, "action", this.Kg, !1, this)
}
y(Yg, kg);
q = Yg.prototype;
q.g = function() {
  ad(this.ec);
  ad(this.wc);
  clearInterval(this.Df);
  this.zb.B();
  delete this.zb;
  delete this.A;
  delete this.Ga;
  delete this.Q;
  delete this.ma;
  delete this.Df;
  Yg.b.g.call(this)
};
q.ye = function() {
  this.A.c();
  this.Ga.c();
  this.Q.c();
  return this.j().c("DIV", "session-container", this.Q.a(), this.A.a(), this.Ga.a())
};
q.va = function(a) {
  a ? (this.ec.removeAttribute("disabled"), this.wc.removeAttribute("disabled")) : (this.ec.setAttribute("disabled", "disabled"), this.wc.setAttribute("disabled", "disabled"))
};
q.rd = function(a) {
  this.Ga.rd(a)
};
function Zg(a) {
  return(a = a.A.Y) ? a.sb : null
}
q.nh = function() {
  if(this.ma.length) {
    var a = this.ma[0].oa, a = 5 === a.length ? "." : a + ".";
    A(this.ma, function(b) {
      b.tb(a)
    })
  }
};
function $g(a) {
  var b = ce(a.A.a());
  a = a.Ga;
  b = b.height + 20;
  Qd(a.Nc, "height", b + "px");
  Qd(a.pd, "height", b + "px")
}
q.qe = function(a) {
  a = new ah(a);
  var b = this.ma.shift(), c = Ae(this.A, b);
  0 > c ? this.A.U(a, !0) : (this.A.Ic(a, c, !0), this.A.removeChild(b, !0));
  $g(this);
  gg(this.A, a)
};
function bh(a, b) {
  var c = new hb;
  A(b, function(a) {
    c.set(a.I(), a)
  });
  for(var d = a.A, f = d.Y, g = [], h = ye(d) - a.ma.length, k = 0;k < h;++k) {
    g.push(W(d, k))
  }
  A(g, function(a) {
    var b = a.sb.I(), g = c.get(b);
    g ? (c.remove(b), a.sb = g) : (d.removeChild(a, !0), f === a && (f = null))
  }, a);
  A(a.ma, function(a) {
    d.removeChild(a, !0)
  });
  a.ma = [];
  A(c.fa(), a.qe, a);
  f ? (a.Ga.update(f.sb), gg(d, f)) : ye(d) ? gg(d, W(d, 0)) : a.Ga.update(null)
}
q.Kg = function() {
  var a = ".";
  this.ma.length && (a = this.ma[0].oa);
  a = new Lf(a, null, this.j());
  a.va(!1);
  this.ma.push(a);
  this.A.U(a, !0);
  $g(this);
  a = new De("create", this, this.zb.Md());
  this.dispatchEvent(a)
};
q.Sg = function() {
  var a = this.A.Y;
  this.Ga.update(a ? a.sb : null)
};
function ah(a) {
  var b = a.Ha.get("browserName") || "unknown browser", b = b.toLowerCase().replace(/(^|\b)[a-z]/g, function(a) {
    return a.toUpperCase()
  });
  Lf.call(this, b);
  this.sb = a
}
y(ah, Lf);
ah.prototype.g = function() {
  delete this.sb;
  ah.b.g.call(this)
};
var ch = !!r.DOMTokenList, dh = ch ? function(a) {
  return a.classList
} : function(a) {
  a = a.className;
  return v(a) && a.match(/\S+/g) || []
}, eh = ch ? function(a, b) {
  return a.classList.contains(b)
} : function(a, b) {
  return Ua(dh(a), b)
}, fh = ch ? function(a, b) {
  a.classList.add(b)
} : function(a, b) {
  eh(a, b) || (a.className += 0 < a.className.length ? " " + b : b)
}, gh = ch ? function(a, b) {
  a.classList.remove(b)
} : function(a, b) {
  eh(a, b) && (a.className = Ra(dh(a), function(a) {
    return a != b
  }).join(" "))
};
function hh(a, b) {
  V.call(this, b);
  this.Pb = a || ""
}
y(hh, V);
hh.prototype.Aa = null;
hh.prototype.xg = 10;
var ih = "placeholder" in document.createElement("input");
q = hh.prototype;
q.Tc = !1;
q.c = function() {
  this.e = this.j().c("input", {type:"text"})
};
q.J = function() {
  hh.b.J.call(this);
  var a = new oe(this);
  a.h(this.a(), "focus", this.Fe);
  a.h(this.a(), "blur", this.$f);
  ih ? this.C = a : (D && a.h(this.a(), ["keypress", "keydown", "keyup"], this.eg), a.h(ud(N(this.a())), "load", this.qg), this.C = a, jh(this));
  kh(this);
  this.a().wg = this
};
q.ea = function() {
  hh.b.ea.call(this);
  this.C && (this.C.B(), this.C = null);
  this.a().wg = null
};
function jh(a) {
  !a.Xf && (a.C && a.a().form) && (a.C.h(a.a().form, "submit", a.fg), a.Xf = !0)
}
q.g = function() {
  hh.b.g.call(this);
  this.C && (this.C.B(), this.C = null)
};
q.Hc = "label-input-label";
q.Fe = function() {
  this.Tc = !0;
  gh(this.a(), this.Hc);
  if(!ih && !lh(this) && !this.ug) {
    var a = this, b = function() {
      a.a() && (a.a().value = "")
    };
    C ? Te(b, 10) : b()
  }
};
q.$f = function() {
  ih || (this.C.aa(this.a(), "click", this.Fe), this.Aa = null);
  this.Tc = !1;
  kh(this)
};
q.eg = function(a) {
  27 == a.keyCode && ("keydown" == a.type ? this.Aa = this.a().value : "keypress" == a.type ? this.a().value = this.Aa : "keyup" == a.type && (this.Aa = null), a.preventDefault())
};
q.fg = function() {
  lh(this) || (this.a().value = "", Te(this.Zf, 10, this))
};
q.Zf = function() {
  lh(this) || (this.a().value = this.Pb)
};
q.qg = function() {
  kh(this)
};
function lh(a) {
  return!!a.a() && "" != a.a().value && a.a().value != a.Pb
}
q.clear = function() {
  this.a().value = "";
  null != this.Aa && (this.Aa = "")
};
q.reset = function() {
  lh(this) && (this.clear(), kh(this))
};
q.zc = function(a) {
  null != this.Aa && (this.Aa = a);
  this.a().value = a;
  kh(this)
};
q.Gb = function() {
  return null != this.Aa ? this.Aa : lh(this) ? this.a().value : ""
};
function kh(a) {
  var b = a.a();
  ih ? a.a().placeholder != a.Pb && (a.a().placeholder = a.Pb) : (jh(a), Ge(b, "label", a.Pb));
  lh(a) ? (b = a.a(), gh(b, a.Hc)) : (a.ug || a.Tc || (b = a.a(), fh(b, a.Hc)), ih || Te(a.ah, a.xg, a))
}
q.va = function(a) {
  this.a().disabled = !a;
  var b = this.a(), c = this.Hc + "-disabled";
  a ? gh(b, c) : fh(b, c)
};
q.isEnabled = function() {
  return!this.a().disabled
};
q.ah = function() {
  !this.a() || (lh(this) || this.Tc) || (this.a().value = this.Pb)
};
function mh() {
  ig.call(this, "Open WebDriverJS Script");
  J(this, "show", this.Wa, !1, this);
  this.Ba = new hh("Script URL");
  this.U(this.Ba)
}
y(mh, ig);
q = mh.prototype;
q.g = function() {
  delete this.Ba;
  mh.b.g.call(this)
};
q.xe = function() {
  var a = vd("A", {href:"http://code.google.com/p/selenium/wiki/WebDriverJs", target:"_blank"}, "WebDriverJS");
  this.Ba.c();
  kd(this.Ba.a(), "url-input");
  var b = this.j();
  return b.c("DIV", null, b.c("P", null, "Open a page that has the ", a, " client. The page will be opened with the query parameters required to communicate with the server."), this.Ba.a())
};
q.Wa = function() {
  this.Ba.clear();
  this.Ba.a().focus();
  this.Ba.a().blur()
};
q.Md = function() {
  return this.Ba.Gb()
};
q.Ie = function() {
  return lh(this.Ba)
};
function nh() {
  ng.call(this, "Load Script");
  this.Rb = new mh;
  J(this.Rb, "action", this.Pg, !1, this);
  J(this, "action", x(this.Rb.k, this.Rb, !0))
}
y(nh, ng);
nh.prototype.g = function() {
  this.Rb.B();
  delete this.Rb;
  nh.b.g.call(this)
};
nh.prototype.Pg = function() {
  var a = new De("loadscript", this, this.Rb.Md());
  this.dispatchEvent(a)
};
function oh(a) {
  this.pb = a;
  this.ef = {}
}
oh.prototype.getName = e("pb");
oh.prototype.setParameter = function(a, b) {
  this.ef[a] = b;
  return this
};
function ph(a) {
  this.Ha = {};
  a && qh(this, a)
}
function qh(a, b) {
  var c = b instanceof ph ? b.Ha : b, d;
  for(d in c) {
    c.hasOwnProperty(d) && a.set(d, c[d])
  }
  return a
}
ph.prototype.set = function(a, b) {
  null != b ? this.Ha[a] = b : delete this.Ha[a];
  return this
};
ph.prototype.get = function(a) {
  var b = null;
  this.Ha.hasOwnProperty(a) && (b = this.Ha[a]);
  return null != b ? b : null
};
function rh(a, b) {
  this.Ta = a;
  this.Ha = qh(new ph, b)
}
rh.prototype.I = e("Ta");
function sh() {
  this.Cb = {}
}
sh.prototype.Dd = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1), d = this.Cb[a];
  if(d) {
    for(var f = 0;f < d.length;) {
      var g = d[f];
      g.wh.apply(g.scope, c);
      d[f] === g && (d[f].Ch ? d.splice(f, 1) : f += 1)
    }
  }
};
function th(a) {
  var b = a.Cb.uncaughtException;
  b || (b = a.Cb.uncaughtException = []);
  return b
}
sh.prototype.hd = function(a) {
  fa(a) ? delete this.Cb[a] : this.Cb = {};
  return this
};
function uh(a) {
  this.Bc = a || 0;
  var b;
  if(vh) {
    b = Error(), Error.captureStackTrace(b, uh)
  }else {
    this.Bc += 1;
    try {
      null.x()
    }catch(c) {
      b = c
    }
  }
  this.wf = wh(b)
}
var vh = ia(Error.captureStackTrace);
if(!vh) {
  try {
    throw Error();
  }catch(xh) {
  }
}
uh.prototype.uc = null;
function yh(a, b, c, d) {
  this.Qf = a || "";
  this.pb = b || "";
  this.re = c || "";
  this.Gc = this.qb = d || "";
  this.sh = this.Ue = -1;
  d && (a = /:(\d+)(?::(\d+))?$/.exec(d)) && (this.Ue = Number(a[1]), this.rh = Number(a[2] || -1), this.Gc = d.substr(0, a.index))
}
var zh = new yh("", "", "", "");
yh.prototype.getName = e("pb");
yh.prototype.toString = function() {
  var a = this.Qf;
  a && "new " !== a && (a += ".");
  var a = a + this.pb, a = a + (this.re ? " [as " + this.re + "]" : ""), b = this.qb || "<anonymous>";
  return"    at " + (a ? a + " (" + b + ")" : b)
};
var Ah = RegExp("^    at(?: (?:(?:((?:new )?(?:\\[object Object\\]|[a-zA-Z_$][\\w$]*(?:\\.[a-zA-Z_$][\\w$]*)*))\\.|(new )))?((?:[a-zA-Z_$][\\w$]*|<anonymous>))(?: \\[as ([a-zA-Z_$][\\w$]*)\\])?)? (?:\\((.*)\\)|(.*))$"), Bh = /^([a-zA-Z_$][\w$]*[\w./<$]*)?(?:\(.*\))?@(?::0|((?:http|https|file):\/\/[^\s]+|javascript:.*))$/, Ch = RegExp("^(?:(?:([a-zA-Z_$][\\w$]*)|<anonymous function(?:\\: (?:([a-zA-Z_$][\\w$]*(?:\\.[a-zA-Z_$][\\w$]*)*)\\.)?([a-zA-Z_$][\\w$]*))?>)(?:\\(.*\\)))?@((?:http|https|file)://[^\\s]+|javascript:.*)?$"), 
Dh = /^   at ([a-zA-Z_$][\w$]*(?:\s+\w+)*)\s*(?:\((.*)\))$/, Eh = RegExp("^> (?:(?:([a-zA-Z_$][\\w$]*(?:\\.[a-zA-Z_$][\\w$]*)*)\\.)?([a-zA-Z_$][\\w$]*)(?:\\(.*\\))?(?: \\[as ([a-zA-Z_$][\\w$]*)\\])?(?: at )?)?(?:(.*:\\d+:\\d+)|((?:http|https|file)://[^\\s]+|javascript:.*))?$");
function Fh(a) {
  var b = a.match(Ah);
  if(b) {
    return new yh(b[1] || b[2], b[3], b[4], b[5] || b[6])
  }
  if(5E5 < a.length) {
    var c = a.indexOf("("), b = a.lastIndexOf("@"), d = a.lastIndexOf(":"), f = "";
    0 <= c && c < b && (f = a.substring(0, c));
    c = "";
    0 <= b && b + 1 < d && (c = a.substring(b + 1));
    return new yh("", f, "", c)
  }
  return(b = a.match(Bh)) ? new yh("", b[1], "", b[2]) : (b = a.match(Ch)) ? new yh(b[2], b[1] || b[3], "", b[4]) : (b = a.match(Dh)) ? new yh("", b[1], "", b[2]) : "> (unknown)" == a || "> anonymous" == a ? zh : (b = a.match(Eh)) ? new yh(b[1], b[2], b[3], b[4] || b[5]) : null
}
function wh(a) {
  var b = a.stack || a.Eh || "";
  a += "\n";
  0 == b.lastIndexOf(a, 0) && (b = b.substring(a.length));
  return b
}
function Gh(a) {
  if(!a) {
    return[]
  }
  a = a.replace(/\s*$/, "").split("\n");
  for(var b = [], c = 0;c < a.length;c++) {
    var d = Fh(a[c]);
    B && 2 == c && 0 == d.Ue || b.push(d || zh)
  }
  return b
}
;/*
 Portions of this code are from the Dojo toolkit, received under the
 BSD License:
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation
     and/or other materials provided with the distribution.
 Neither the name of the Dojo Foundation nor the names of its contributors
     may be used to endorse or promote products derived from this software
     without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
*/
function Hh() {
}
Hh.prototype.cancel = function() {
  throw new TypeError('Unimplemented function: "cancel"');
};
Hh.prototype.Rd = function() {
  throw new TypeError('Unimplemented function: "isPending"');
};
Hh.prototype.T = function() {
  throw new TypeError('Unimplemented function: "then"');
};
function Ih(a, b) {
  a.T(null, b)
}
Hh.prototype.pe = function(a, b, c) {
  return this.T(x(a, c), x(b, c))
};
function Jh(a, b) {
  function c() {
    return T == Kh
  }
  function d() {
    w = []
  }
  function f(a, b) {
    if(Kh === T) {
      if(T = Lh, Mh(b) && b !== F) {
        var c = ra(g, a), d = ra(g, Nh);
        b instanceof Jh ? b.T(c, d) : Oh(b, c, d)
      }else {
        g(a, b)
      }
    }
  }
  function g(a, b) {
    a === Nh && (ja(b) && v(b.message)) && (b = Ph(s, b));
    T = a;
    for(E = b;w.length;) {
      k(w.shift())
    }
    ga || T != Nh || (ma = h(E))
  }
  function h(a) {
    s.rb += 1;
    return s.vb.setTimeout(function() {
      s.rb -= 1;
      var b = s;
      Qh(a) && Ph(b, a);
      b.rc++;
      if(b.o) {
        var c = b.o.getParent();
        c && c.removeChild(b.o);
        var d = b.o;
        b.o = c;
        d.Ea(a)
      }else {
        Rh(b, a)
      }
    }, 0)
  }
  function k(a) {
    var b = T == Sh ? a.Of : a.Be;
    b ? Th(s, ra(b, E), a.kb, a.Ea) : T == Nh ? a.Ea(E) : a.kb(E)
  }
  function l(a) {
    f(Sh, a)
  }
  function n(a) {
    f(Nh, a)
  }
  function m(b) {
    c() && (a && (b = a(b) || b), n(b))
  }
  var s = b || Oa() || Uh, w = [], ga = !1, ma = null, T = Kh, E, Q = new Hh, F = this;
  this.Da = Q;
  this.Da.T = this.T = function(a, b) {
    if(!a && !b) {
      return Q
    }
    ga = !0;
    ma && (s.rb -= 1, s.vb.clearTimeout(ma));
    var c = new Jh(m, s), d = {Of:a, Be:b, kb:c.kb, Ea:c.Ea};
    T == Kh || T == Lh ? w.push(d) : k(d);
    return c.Da
  };
  this.Da.cancel = this.cancel = m;
  this.Da.Rd = this.Rd = c;
  this.kb = l;
  this.Ea = this.Be = n;
  this instanceof Vh && (this.Za = d);
  this.then = this.T;
  this.cancel = m;
  this.fulfill = l;
  this.reject = n;
  this.isPending = c;
  this.promise = this.Da;
  this.Da.then = this.T;
  this.Da.cancel = m;
  this.Da.isPending = c
}
y(Jh, Hh);
var Nh = -1, Kh = 0, Lh = 1, Sh = 2;
function Qh(a) {
  return a instanceof Error || ja(a) && ("[object Error]" === Object.prototype.toString.call(a) || a.xh)
}
function Mh(a) {
  return!!a && ja(a) && ia(a.then)
}
function Wh(a) {
  var b = new Jh(function() {
    throw Error("This Deferred may not be cancelled");
  });
  try {
    a(function(a, c) {
      a ? b.Ea(a) : b.kb(c)
    })
  }catch(c) {
    b.Ea(c)
  }
  return b.Da
}
function Oh(a, b, c) {
  Mh(a) ? a.T(b, c) : a && ja(a) && ia(a.pe) ? a.pe(b, c) : b && b(a)
}
function Xh(a) {
  this.Cb = {};
  this.vb = a || Yh;
  this.Nb = []
}
y(Xh, sh);
var Yh = function() {
  function a(a) {
    return function(c, d) {
      return a(c, d)
    }
  }
  return{clearInterval:a(clearInterval), clearTimeout:a(clearTimeout), setInterval:a(setInterval), setTimeout:a(setTimeout)}
}();
q = Xh.prototype;
q.o = null;
q.fe = null;
q.Yb = null;
q.ic = null;
q.rb = 0;
q.rc = 0;
q.reset = function() {
  this.o = null;
  this.Nb = [];
  this.hd();
  Zh(this);
  $h(this)
};
function ai(a) {
  for(var b = [], c = a.o;c;) {
    var d = c.ed;
    d && b.push(d);
    c = c.getParent()
  }
  return Sa(Wa(a.Nb, b), function(a) {
    return a.toString()
  })
}
function bi(a) {
  a.rc && (Ya(a.Nb, a.Nb.length - a.rc, a.rc), a.rc = 0);
  a.Nb.pop()
}
function Ph(a, b) {
  if(b.webdriver_promise_error_) {
    return b
  }
  var c = ai(a);
  if(c.length) {
    var d = b, f = Gh(wh(d)), g = "", g = d.message ? (d.name ? d.name + ": " : "") + d.message : d.toString();
    d.stack = g + "\n" + f.join("\n");
    b = d;
    b.stack += ["\n==== async task ====\n", c.join("\n==== async task ====\n")].join("");
    b.webdriver_promise_error_ = !0
  }
  return b
}
q.execute = function(a, b) {
  Zh(this);
  this.o || (this.o = new ci(this));
  var c = new uh(1), c = new Vh(this, a, b || "", c);
  (this.fe || this.o).U(c);
  this.Dd("scheduleTask");
  this.ic || (this.ic = this.vb.setInterval(x(this.bh, this), 10));
  return c.Da
};
function $h(a) {
  a.ic && (a.vb.clearInterval(a.ic), a.ic = null)
}
q.bh = function() {
  if(!this.rb) {
    if(this.o) {
      var a;
      if(!this.o.ed && (a = di(this))) {
        var b = this.o;
        b.ed = a;
        var c = x(function() {
          this.Nb.push(a);
          b.ed = null
        }, this);
        bi(this);
        var d = this;
        Th(this, a.execute, function(b) {
          c();
          a.kb(b)
        }, function(b) {
          c();
          Qh(b) || Mh(b) || (b = Error(b));
          a.Ea(Ph(d, b))
        }, !0)
      }
    }else {
      ei(this)
    }
  }
};
function di(a) {
  var b;
  b = a.o;
  b.Pe = !0;
  b.sa = null;
  b = b.n[0];
  if(!b) {
    return a.o.yh || (b = a.o, a.o === b && (a.o = b.getParent()), b.getParent() && b.getParent().removeChild(b), bi(a), b.kb(), a.o || ei(a)), null
  }
  if(b instanceof ci) {
    return a.o = b, di(a)
  }
  b.getParent().removeChild(b);
  return b
}
function Th(a, b, c, d, f) {
  function g(a) {
    var b = h.getParent();
    b && b.removeChild(h);
    a && h.Bd(a);
    k.o = l
  }
  var h = new ci(a), k = a, l = a.o;
  try {
    a.o ? a.o.U(h) : a.o = h;
    f && (a.o = h);
    try {
      a.fe = h;
      Pa.push(a);
      var n = b()
    }finally {
      Pa.pop(), a.fe = null
    }
    h.Re = !0;
    h.n.length ? h.T(function() {
      Oh(n, c, d)
    }, function(a) {
      n instanceof Hh && n.Rd() && (n.cancel(a), a = n);
      d(a)
    }) : (g(), Oh(n, c, d))
  }catch(m) {
    g(new fi(m)), d(m)
  }
}
function ei(a) {
  a.Yb || ($h(a), a.Yb = a.vb.setTimeout(function() {
    a.Yb = null;
    a.Dd("idle")
  }, 0))
}
function Zh(a) {
  a.Yb && (a.vb.clearTimeout(a.Yb), a.Yb = null)
}
function Rh(a, b) {
  a.o = null;
  Zh(a);
  $h(a);
  th(a).length ? a.Dd("uncaughtException", b) : a.vb.setTimeout(function() {
    throw b;
  }, 0)
}
function gi(a) {
  Jh.call(this, null, a)
}
y(gi, Jh);
gi.prototype.F = null;
gi.prototype.getParent = e("F");
gi.prototype.yc = ba("F");
function ci(a) {
  Jh.call(this, null, a);
  var b = x(this.Ea, this), c = x(this.Bd, this);
  this.Ea = function(a) {
    c(new fi(a));
    b(a)
  };
  this.n = []
}
y(ci, gi);
q = ci.prototype;
q.ed = null;
q.Pe = !1;
q.Re = !1;
q.sa = null;
q.Bd = function(a) {
  A(this.n, function(b) {
    b instanceof ci ? b.Bd(a) : (b.Za(), Ih(b, t), b.cancel(a))
  })
};
q.U = function(a) {
  if(this.sa && this.sa instanceof ci && !this.sa.Re) {
    this.sa.U(a)
  }else {
    if(a.yc(this), this.Pe && a instanceof ci) {
      var b = 0;
      this.sa instanceof ci && (b = Qa(this.n, this.sa) + 1);
      Ya(this.n, b, 0, a);
      this.sa = a
    }else {
      this.sa = a, this.n.push(a)
    }
  }
};
q.removeChild = function(a) {
  var b = Qa(this.n, a);
  a.yc(null);
  z.splice.call(this.n, b, 1);
  this.sa === a && (this.sa = null)
};
q.toString = function() {
  return"[" + Sa(this.n, function(a) {
    return a.toString()
  }).join(", ") + "]"
};
function Vh(a, b, c, d) {
  Jh.call(this, null, a);
  this.execute = b;
  this.Ae = c;
  this.lh = d
}
y(Vh, gi);
Vh.prototype.toString = function() {
  var a;
  a = this.lh;
  null === a.uc && (a.uc = Gh(a.wf), a.Bc && (a.uc = Za(a.uc, a.Bc)), delete a.Bc, delete a.wf);
  a = a.uc;
  var b = this.Ae;
  a.length && (this.Ae && (b += "\n"), b += a.join("\n"));
  return b
};
function fi(a) {
  Ba.call(this, "Task discarded due to a previous task failure: " + a)
}
y(fi, Ba);
fi.prototype.name = "CanceledTaskError";
var Uh = new Xh, Pa = [];
function hi(a, b) {
  xa.call(this);
  this.ta = rc("remote.ui.Client");
  this.Xd = new yc;
  zc(this.Xd, !0);
  this.Gc = a;
  this.Gd = b;
  this.bb = new Be;
  this.pf = new of;
  this.S = new Yg(ii);
  this.Vb = new mf;
  this.xc = new nh;
  J(this.S, "create", this.Lg, !1, this);
  J(this.S, "delete", this.Mg, !1, this);
  J(this.S, "refresh", this.df, !1, this);
  J(this.S, "screenshot", this.ae, !1, this);
  J(this.xc, "loadscript", this.Qg, !1, this)
}
y(hi, xa);
var ii = "android;chrome;firefox;internet explorer;iphone;opera".split(";");
q = hi.prototype;
q.g = function() {
  this.bb.B();
  this.S.B();
  this.Vb.B();
  this.xc.B();
  zc(this.Xd, !1);
  delete this.ta;
  delete this.Gd;
  delete this.Xd;
  delete this.S;
  delete this.bb;
  delete this.Vb;
  delete this.xc;
  hi.b.g.call(this)
};
q.nb = function(a) {
  this.bb.Fa();
  this.bb.k(!1);
  this.S.Fa(a);
  this.pf.Fa(a);
  this.xc.Fa();
  this.S.rd(this.xc.a());
  return ji(this).T(x(function() {
    this.S.va(!0);
    this.df()
  }, this))
};
function ki(a, b) {
  a.bb.k(!1);
  var c = x(a.Gd.execute, a.Gd, b);
  return Wh(c).T(wa)
}
function li(a, b, c) {
  a.ta.log(jc, b + "\n" + c, void 0);
  a.bb.rf(b);
  a.bb.k(!0)
}
function ji(a) {
  a.ta.info("Retrieving server status...");
  return ki(a, new oh("getStatus")).T(x(function(a) {
    var c = a.value || {};
    (a = c.os) && a.name && (a = a.name + (a.version ? " " + a.version : ""));
    c = c.build;
    pf(this.pf, a, c && c.version, c && c.revision)
  }, a))
}
q.df = function() {
  this.ta.info("Refreshing sessions...");
  var a = this;
  Ih(ki(this, new oh("getSessions")).T(function(b) {
    b = b.value;
    b = Sa(b, function(a) {
      return new rh(a.id, a.capabilities)
    });
    bh(a.S, b)
  }), function(b) {
    li(a, "Unable to refresh session list.", b)
  })
};
q.Lg = function(a) {
  this.ta.info("Creating new session for " + a.data.browserName);
  a = (new oh("newSession")).setParameter("desiredCapabilities", a.data);
  var b = this;
  Ih(ki(this, a).T(function(a) {
    a = new rh(a.sessionId, a.value);
    b.S.qe(a)
  }), function(a) {
    li(b, "Unable to create new session.", a);
    a = b.S;
    var d = a.ma.shift();
    d && (a.A.removeChild(d, !0), $g(a))
  })
};
q.Mg = function() {
  var a = Zg(this.S);
  if(a) {
    this.ta.info("Deleting session: " + a.I());
    var b = (new oh("quit")).setParameter("sessionId", a.I()), c = this;
    Ih(ki(this, b).T(function() {
      for(var b = c.S, f = b.A.Y, g, h = ye(b.A), k = 0;k < h;++k) {
        var l = W(b.A, k);
        if(l.sb.I() == a.I()) {
          g = l;
          break
        }
      }
      g && (b.A.removeChild(g, !0), g.B(), f == g && ye(b.A) ? (b = b.A, gg(b, W(b, 0))) : b.Ga.update(null))
    }), function(a) {
      li(c, "Unable to delete session.", a)
    })
  }else {
    this.ta.log(kc, "Cannot delete session; no session selected!", void 0)
  }
};
q.Qg = function(a) {
  var b = Zg(this.S);
  if(b) {
    a = new Jb(a.data);
    a.Ja.add("wdsid", b.I());
    a.Ja.add("wdurl", this.Gc);
    var c = (new oh("get")).setParameter("sessionId", b.I()).setParameter("url", a.toString());
    this.ta.info("In session(" + b.I() + "), loading " + a);
    Ih(ki(this, c), x(function(a) {
      li(this, "Unable to load URL", a)
    }, this))
  }else {
    this.ta.log(kc, "Cannot load url: " + a.data + "; no session selected!", void 0)
  }
};
q.ae = function() {
  var a = Zg(this.S);
  if(a) {
    this.ta.info("Taking screenshot: " + a.I());
    a = (new oh("screenshot")).setParameter("sessionId", a.I());
    this.Vb.M(nf);
    this.Vb.k(!0);
    var b = this;
    Ih(ki(this, a).T(function(a) {
      var d = b.Vb;
      a = a.value;
      if(d.p()) {
        d.M(1);
        a = "data:image/png;base64," + a;
        var f = d.j();
        a = f.c("A", {href:a, target:"_blank"}, f.c("IMG", {src:a}));
        d.tb("");
        d.ja().appendChild(a);
        d.$()
      }
    }), function(a) {
      b.Vb.k(!1);
      li(b, "Unable to take screenshot.", a)
    })
  }else {
    this.ta.log(kc, "Cannot take screenshot; no session selected!", void 0)
  }
};
function mi(a) {
  this.Pf = a
}
mi.prototype.execute = function(a, b) {
  var c = ni[a.getName()];
  if(!c) {
    throw Error("Unrecognized command: " + a.getName());
  }
  var d = a.ef, f = oi(c.path, d);
  this.Pf.send(new pi(c.method, f, d), function(a, c) {
    var d;
    if(!a) {
      try {
        a: {
          try {
            d = og(c.body);
            break a
          }catch(f) {
          }
          var n = {status:0, value:c.body.replace(/\r\n/g, "\n")};
          199 < c.status && 300 > c.status || (n.status = 404 == c.status ? 9 : 13);
          d = n
        }
      }catch(m) {
        a = m
      }
    }
    b(a, d)
  })
};
function oi(a, b) {
  var c = a.match(/\/:(\w+)\b/g);
  if(c) {
    for(var d = 0;d < c.length;++d) {
      var f = c[d].substring(2);
      if(f in b) {
        var g = b[f];
        g && g.ELEMENT && (g = g.ELEMENT);
        a = a.replace(c[d], "/" + g);
        delete b[f]
      }else {
        throw Error("Missing required parameter: " + f);
      }
    }
  }
  return a
}
var ni = function() {
  function a(a) {
    return c("POST", a)
  }
  function b(a) {
    return c("GET", a)
  }
  function c(a, b) {
    return{method:a, path:b}
  }
  return(new function() {
    var a = {};
    this.put = function(b, c) {
      a[b] = c;
      return this
    };
    this.Nf = function() {
      return a
    }
  }).put("getStatus", b("/status")).put("newSession", a("/session")).put("getSessions", b("/sessions")).put("getSessionCapabilities", b("/session/:sessionId")).put("quit", c("DELETE", "/session/:sessionId")).put("close", c("DELETE", "/session/:sessionId/window")).put("getCurrentWindowHandle", b("/session/:sessionId/window_handle")).put("getWindowHandles", b("/session/:sessionId/window_handles")).put("getCurrentUrl", b("/session/:sessionId/url")).put("get", a("/session/:sessionId/url")).put("goBack", 
  a("/session/:sessionId/back")).put("goForward", a("/session/:sessionId/forward")).put("refresh", a("/session/:sessionId/refresh")).put("addCookie", a("/session/:sessionId/cookie")).put("getCookies", b("/session/:sessionId/cookie")).put("deleteAllCookies", c("DELETE", "/session/:sessionId/cookie")).put("deleteCookie", c("DELETE", "/session/:sessionId/cookie/:name")).put("findElement", a("/session/:sessionId/element")).put("findElements", a("/session/:sessionId/elements")).put("getActiveElement", 
  a("/session/:sessionId/element/active")).put("findChildElement", a("/session/:sessionId/element/:id/element")).put("findChildElements", a("/session/:sessionId/element/:id/elements")).put("clearElement", a("/session/:sessionId/element/:id/clear")).put("clickElement", a("/session/:sessionId/element/:id/click")).put("sendKeysToElement", a("/session/:sessionId/element/:id/value")).put("submitElement", a("/session/:sessionId/element/:id/submit")).put("getElementText", b("/session/:sessionId/element/:id/text")).put("getElementTagName", 
  b("/session/:sessionId/element/:id/name")).put("isElementSelected", b("/session/:sessionId/element/:id/selected")).put("isElementEnabled", b("/session/:sessionId/element/:id/enabled")).put("isElementDisplayed", b("/session/:sessionId/element/:id/displayed")).put("getElementLocation", b("/session/:sessionId/element/:id/location")).put("getElementSize", b("/session/:sessionId/element/:id/size")).put("getElementAttribute", b("/session/:sessionId/element/:id/attribute/:name")).put("getElementValueOfCssProperty", 
  b("/session/:sessionId/element/:id/css/:propertyName")).put("elementEquals", b("/session/:sessionId/element/:id/equals/:other")).put("switchToWindow", a("/session/:sessionId/window")).put("maximizeWindow", a("/session/:sessionId/window/:windowHandle/maximize")).put("getWindowPosition", b("/session/:sessionId/window/:windowHandle/position")).put("setWindowPosition", a("/session/:sessionId/window/:windowHandle/position")).put("getWindowSize", b("/session/:sessionId/window/:windowHandle/size")).put("setWindowSize", 
  a("/session/:sessionId/window/:windowHandle/size")).put("switchToFrame", a("/session/:sessionId/frame")).put("getPageSource", b("/session/:sessionId/source")).put("getTitle", b("/session/:sessionId/title")).put("executeScript", a("/session/:sessionId/execute")).put("executeAsyncScript", a("/session/:sessionId/execute_async")).put("screenshot", b("/session/:sessionId/screenshot")).put("setTimeout", a("/session/:sessionId/timeouts")).put("setScriptTimeout", a("/session/:sessionId/timeouts/async_script")).put("implicitlyWait", 
  a("/session/:sessionId/timeouts/implicit_wait")).put("mouseMove", a("/session/:sessionId/moveto")).put("mouseClick", a("/session/:sessionId/click")).put("mouseDoubleClick", a("/session/:sessionId/doubleclick")).put("mouseDown", a("/session/:sessionId/buttondown")).put("mouseUp", a("/session/:sessionId/buttonup")).put("mouseMove", a("/session/:sessionId/moveto")).put("sendKeysToActiveElement", a("/session/:sessionId/keys")).put("acceptAlert", a("/session/:sessionId/accept_alert")).put("dismissAlert", 
  a("/session/:sessionId/dismiss_alert")).put("getAlertText", b("/session/:sessionId/alert_text")).put("setAlertValue", a("/session/:sessionId/alert_text")).put("getLog", a("/session/:sessionId/log")).put("getAvailableLogTypes", b("/session/:sessionId/log/types")).put("getSessionLogs", a("/logs")).Nf()
}();
function qi(a) {
  var b = [], c;
  for(c in a) {
    b.push(c + ": " + a[c])
  }
  return b.join("\n")
}
function pi(a, b, c) {
  this.method = a;
  this.path = b;
  this.data = c || {};
  this.headers = {Accept:"application/json; charset=utf-8"}
}
pi.prototype.toString = function() {
  return[this.method + " " + this.path + " HTTP/1.1", qi(this.headers), "", qg(new pg(void 0), this.data)].join("\n")
};
function ri(a, b, c) {
  this.status = a;
  this.body = c;
  this.headers = {};
  for(var d in b) {
    this.headers[d.toLowerCase()] = b[d]
  }
}
function si(a) {
  var b = {};
  if(a.getAllResponseHeaders) {
    var c = a.getAllResponseHeaders();
    c && (c = c.replace(/\r\n/g, "\n").split("\n"), A(c, function(a) {
      a = a.split(/\s*:\s*/, 2);
      a[0] && (b[a[0]] = a[1] || "")
    }))
  }
  return new ri(a.status || 200, b, a.responseText.replace(/\0/g, ""))
}
ri.prototype.toString = function() {
  var a = qi(this.headers), b = ["HTTP/1.1 " + this.status, a];
  a && b.push("");
  this.body && b.push(this.body);
  return b.join("\n")
};
function ti() {
}
;var ui;
function vi() {
}
y(vi, ti);
function wi() {
  var a;
  a: {
    var b = ui;
    if(!b.Me && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
      for(var c = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], d = 0;d < c.length;d++) {
        var f = c[d];
        try {
          new ActiveXObject(f);
          a = b.Me = f;
          break a
        }catch(g) {
        }
      }
      throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
    }
    a = b.Me
  }
  return a ? new ActiveXObject(a) : new XMLHttpRequest
}
ui = new vi;
function xi(a) {
  this.Gc = a
}
xi.prototype.send = function(a, b) {
  try {
    var c = wi(), d = this.Gc + a.path;
    c.open(a.method, d, !0);
    c.onload = function() {
      b(null, si(c))
    };
    c.onerror = function() {
      b(Error(["Unable to send request: ", a.method, " ", d, "\nOriginal request:\n", a].join("")))
    };
    for(var f in a.headers) {
      c.setRequestHeader(f, a.headers[f] + "")
    }
    c.send(qg(new pg(void 0), a.data))
  }catch(g) {
    b(g)
  }
};
function yi() {
  var a = window.location, a = [a.protocol, "//", a.host, a.pathname.replace(/\/static\/resource(?:\/[^\/]*)?$/, "")].join("");
  (new hi(a, new mi(new xi(a)))).nb()
}
var zi = ["init"], Ai = r;
zi[0] in Ai || !Ai.execScript || Ai.execScript("var " + zi[0]);
for(var Bi;zi.length && (Bi = zi.shift());) {
  zi.length || void 0 === yi ? Ai = Ai[Bi] ? Ai[Bi] : Ai[Bi] = {} : Ai[Bi] = yi
}
;for(var Ci = document.getElementsByTagName("script"), Di = "./", Ei = 0;Ei < Ci.length;Ei++) {
  var Fi = Ci[Ei].src, Gi = Fi.length;
  if("test_bootstrap.js" == Fi.substr(Gi - 17)) {
    Di = Fi.substr(0, Gi - 17);
    break
  }
}
for(var Hi = ["../../../third_party/closure/goog/base.js", "../../deps.js"], Ii = 0;Ii < Hi.length;Ii++) {
  document.write('<script type="text/javascript" src="' + Di + Hi[Ii] + '">\x3c/script>')
}
;
