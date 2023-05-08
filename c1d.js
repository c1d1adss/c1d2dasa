function requireCore() {
    return hasRequiredCore || (hasRequiredCore = 1,
    function(e, t) {
        (function(r, n) {
            e.exports = n()
        }
        )(commonjsGlobal, function() {
            var r = r || function(n, a) {
                var o;
                if (typeof window < "u" && window.crypto && (o = window.crypto),
                typeof self < "u" && self.crypto && (o = self.crypto),
                typeof globalThis < "u" && globalThis.crypto && (o = globalThis.crypto),
                !o && typeof window < "u" && window.msCrypto && (o = window.msCrypto),
                !o && typeof commonjsGlobal < "u" && commonjsGlobal.crypto && (o = commonjsGlobal.crypto),
                !o && typeof commonjsRequire == "function")
                    try {
                        o = require$$1
                    } catch {}
                var f = function() {
                    if (o) {
                        if (typeof o.getRandomValues == "function")
                            try {
                                return o.getRandomValues(new Uint32Array(1))[0]
                            } catch {}
                        if (typeof o.randomBytes == "function")
                            try {
                                return o.randomBytes(4).readInt32LE()
                            } catch {}
                    }
                    throw new Error("Native crypto module could not be used to get secure random number.")
                }
                  , x = Object.create || function() {
                    function j() {}
                    return function(G) {
                        var M;
                        return j.prototype = G,
                        M = new j,
                        j.prototype = null,
                        M
                    }
                }()
                  , _ = {}
                  , c = _.lib = {}
                  , k = c.Base = function() {
                    return {
                        extend: function(j) {
                            var G = x(this);
                            return j && G.mixIn(j),
                            (!G.hasOwnProperty("init") || this.init === G.init) && (G.init = function() {
                                G.$super.init.apply(this, arguments)
                            }
                            ),
                            G.init.prototype = G,
                            G.$super = this,
                            G
                        },
                        create: function() {
                            var j = this.extend();
                            return j.init.apply(j, arguments),
                            j
                        },
                        init: function() {},
                        mixIn: function(j) {
                            for (var G in j)
                                j.hasOwnProperty(G) && (this[G] = j[G]);
                            j.hasOwnProperty("toString") && (this.toString = j.toString)
                        },
                        clone: function() {
                            return this.init.prototype.extend(this)
                        }
                    }
                }()
                  , l = c.WordArray = k.extend({
                    init: function(j, G) {
                        j = this.words = j || [],
                        G != a ? this.sigBytes = G : this.sigBytes = j.length * 4
                    },
                    toString: function(j) {
                        return (j || $).stringify(this)
                    },
                    concat: function(j) {
                        var G = this.words
                          , M = j.words
                          , z = this.sigBytes
                          , K = j.sigBytes;
                        if (this.clamp(),
                        z % 4)
                            for (var J = 0; J < K; J++) {
                                var Z = M[J >>> 2] >>> 24 - J % 4 * 8 & 255;
                                G[z + J >>> 2] |= Z << 24 - (z + J) % 4 * 8
                            }
                        else
                            for (var Y = 0; Y < K; Y += 4)
                                G[z + Y >>> 2] = M[Y >>> 2];
                        return this.sigBytes += K,
                        this
                    },
                    clamp: function() {
                        var j = this.words
                          , G = this.sigBytes;
                        j[G >>> 2] &= 4294967295 << 32 - G % 4 * 8,
                        j.length = n.ceil(G / 4)
                    },
                    clone: function() {
                        var j = k.clone.call(this);
                        return j.words = this.words.slice(0),
                        j
                    },
                    random: function(j) {
                        for (var G = [], M = 0; M < j; M += 4)
                            G.push(f());
                        return new l.init(G,j)
                    }
                })
                  , w = _.enc = {}
                  , $ = w.Hex = {
                    stringify: function(j) {
                        for (var G = j.words, M = j.sigBytes, z = [], K = 0; K < M; K++) {
                            var J = G[K >>> 2] >>> 24 - K % 4 * 8 & 255;
                            z.push((J >>> 4).toString(16)),
                            z.push((J & 15).toString(16))
                        }
                        return z.join("")
                    },
                    parse: function(j) {
                        for (var G = j.length, M = [], z = 0; z < G; z += 2)
                            M[z >>> 3] |= parseInt(j.substr(z, 2), 16) << 24 - z % 8 * 4;
                        return new l.init(M,G / 2)
                    }
                }
                  , O = w.Latin1 = {
                    stringify: function(j) {
                        for (var G = j.words, M = j.sigBytes, z = [], K = 0; K < M; K++) {
                            var J = G[K >>> 2] >>> 24 - K % 4 * 8 & 255;
                            z.push(String.fromCharCode(J))
                        }
                        return z.join("")
                    },
                    parse: function(j) {
                        for (var G = j.length, M = [], z = 0; z < G; z++)
                            M[z >>> 2] |= (j.charCodeAt(z) & 255) << 24 - z % 4 * 8;
                        return new l.init(M,G)
                    }
                }
                  , F = w.Utf8 = {
                    stringify: function(j) {
                        try {
                            return decodeURIComponent(escape(O.stringify(j)))
                        } catch {
                            throw new Error("Malformed UTF-8 data")
                        }
                    },
                    parse: function(j) {
                        return O.parse(unescape(encodeURIComponent(j)))
                    }
                }
                  , D = c.BufferedBlockAlgorithm = k.extend({
                    reset: function() {
                        this._data = new l.init,
                        this._nDataBytes = 0
                    },
                    _append: function(j) {
                        typeof j == "string" && (j = F.parse(j)),
                        this._data.concat(j),
                        this._nDataBytes += j.sigBytes
                    },
                    _process: function(j) {
                        var G, M = this._data, z = M.words, K = M.sigBytes, J = this.blockSize, Z = J * 4, Y = K / Z;
                        j ? Y = n.ceil(Y) : Y = n.max((Y | 0) - this._minBufferSize, 0);
                        var te = Y * J
                          , Q = n.min(te * 4, K);
                        if (te) {
                            for (var ee = 0; ee < te; ee += J)
                                this._doProcessBlock(z, ee);
                            G = z.splice(0, te),
                            M.sigBytes -= Q
                        }
                        return new l.init(G,Q)
                    },
                    clone: function() {
                        var j = k.clone.call(this);
                        return j._data = this._data.clone(),
                        j
                    },
                    _minBufferSize: 0
                });
                c.Hasher = D.extend({
                    cfg: k.extend(),
                    init: function(j) {
                        this.cfg = this.cfg.extend(j),
                        this.reset()
                    },
                    reset: function() {
                        D.reset.call(this),
                        this._doReset()
                    },
                    update: function(j) {
                        return this._append(j),
                        this._process(),
                        this
                    },
                    finalize: function(j) {
                        j && this._append(j);
                        var G = this._doFinalize();
                        return G
                    },
                    blockSize: 16,
                    _createHelper: function(j) {
                        return function(G, M) {
                            return new j.init(M).finalize(G)
                        }
                    },
                    _createHmacHelper: function(j) {
                        return function(G, M) {
                            return new L.HMAC.init(j,M).finalize(G)
                        }
                    }
                });
                var L = _.algo = {};
                return _
            }(Math);
            return r
        })
    }(core)),
    core.exports
}
function requireSha256() {
    return hasRequiredSha256 || (hasRequiredSha256 = 1,
    function(e, t) {
        (function(r, n) {
            e.exports = n(requireCore())
        }
        )(commonjsGlobal, function(r) {
            return function(n) {
                var a = r
                  , o = a.lib
                  , f = o.WordArray
                  , x = o.Hasher
                  , _ = a.algo
                  , c = []
                  , k = [];
                (function() {
                    function $(L) {
                        for (var j = n.sqrt(L), G = 2; G <= j; G++)
                            if (!(L % G))
                                return !1;
                        return !0
                    }
                    function O(L) {
                        return (L - (L | 0)) * 4294967296 | 0
                    }
                    for (var F = 2, D = 0; D < 64; )
                        $(F) && (D < 8 && (c[D] = O(n.pow(F, 1 / 2))),
                        k[D] = O(n.pow(F, 1 / 3)),
                        D++),
                        F++
                }
                )();
                var l = []
                  , w = _.SHA256 = x.extend({
                    _doReset: function() {
                        this._hash = new f.init(c.slice(0))
                    },
                    _doProcessBlock: function($, O) {
                        for (var F = this._hash.words, D = F[0], L = F[1], j = F[2], G = F[3], M = F[4], z = F[5], K = F[6], J = F[7], Z = 0; Z < 64; Z++) {
                            if (Z < 16)
                                l[Z] = $[O + Z] | 0;
                            else {
                                var Y = l[Z - 15]
                                  , te = (Y << 25 | Y >>> 7) ^ (Y << 14 | Y >>> 18) ^ Y >>> 3
                                  , Q = l[Z - 2]
                                  , ee = (Q << 15 | Q >>> 17) ^ (Q << 13 | Q >>> 19) ^ Q >>> 10;
                                l[Z] = te + l[Z - 7] + ee + l[Z - 16]
                            }
                            var ie = M & z ^ ~M & K
                              , le = D & L ^ D & j ^ L & j
                              , ce = (D << 30 | D >>> 2) ^ (D << 19 | D >>> 13) ^ (D << 10 | D >>> 22)
                              , ue = (M << 26 | M >>> 6) ^ (M << 21 | M >>> 11) ^ (M << 7 | M >>> 25)
                              , fe = J + ue + ie + k[Z] + l[Z]
                              , he = ce + le;
                            J = K,
                            K = z,
                            z = M,
                            M = G + fe | 0,
                            G = j,
                            j = L,
                            L = D,
                            D = fe + he | 0
                        }
                        F[0] = F[0] + D | 0,
                        F[1] = F[1] + L | 0,
                        F[2] = F[2] + j | 0,
                        F[3] = F[3] + G | 0,
                        F[4] = F[4] + M | 0,
                        F[5] = F[5] + z | 0,
                        F[6] = F[6] + K | 0,
                        F[7] = F[7] + J | 0
                    },
                    _doFinalize: function() {
                        var $ = this._data
                          , O = $.words
                          , F = this._nDataBytes * 8
                          , D = $.sigBytes * 8;
                        return O[D >>> 5] |= 128 << 24 - D % 32,
                        O[(D + 64 >>> 9 << 4) + 14] = n.floor(F / 4294967296),
                        O[(D + 64 >>> 9 << 4) + 15] = F,
                        $.sigBytes = O.length * 4,
                        this._process(),
                        this._hash
                    },
                    clone: function() {
                        var $ = x.clone.call(this);
                        return $._hash = this._hash.clone(),
                        $
                    }
                });
                a.SHA256 = x._createHelper(w),
                a.HmacSHA256 = x._createHmacHelper(w)
            }(Math),
            r.SHA256
        })
    }(sha256)),
    sha256.exports
}
function requireHmac() {
    return hasRequiredHmac || (hasRequiredHmac = 1,
    function(e, t) {
        (function(r, n) {
            e.exports = n(requireCore())
        }
        )(commonjsGlobal, function(r) {
            (function() {
                var n = r
                  , a = n.lib
                  , o = a.Base
                  , f = n.enc
                  , x = f.Utf8
                  , _ = n.algo;
                _.HMAC = o.extend({
                    init: function(c, k) {
                        c = this._hasher = new c.init,
                        typeof k == "string" && (k = x.parse(k));
                        var l = c.blockSize
                          , w = l * 4;
                        k.sigBytes > w && (k = c.finalize(k)),
                        k.clamp();
                        for (var $ = this._oKey = k.clone(), O = this._iKey = k.clone(), F = $.words, D = O.words, L = 0; L < l; L++)
                            F[L] ^= 1549556828,
                            D[L] ^= 909522486;
                        $.sigBytes = O.sigBytes = w,
                        this.reset()
                    },
                    reset: function() {
                        var c = this._hasher;
                        c.reset(),
                        c.update(this._iKey)
                    },
                    update: function(c) {
                        return this._hasher.update(c),
                        this
                    },
                    finalize: function(c) {
                        var k = this._hasher
                          , l = k.finalize(c);
                        k.reset();
                        var w = k.finalize(this._oKey.clone().concat(l));
                        return w
                    }
                })
            }
            )()
        })
    }(hmac)),
    hmac.exports
}

var core = {
    exports: {}
}, hasRequiredCore;
var hmacSha256 = {
    exports: {}
}, sha256 = {
    exports: {}
}, hasRequiredSha256;
(function(e, t) {
    (function(r, n, a) {
        e.exports = n(requireCore(), requireSha256(), requireHmac())
    }
    )(commonjsGlobal, function(r) {
        return r.HmacSHA256
    })
}
)(hmacSha256);

const hmac_sha256 = hmacSha256.exports;

hmac_sha256("c1d")
