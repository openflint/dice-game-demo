(function(e, c) {
    var g = e.document,
        h = e.location,
        i = e.navigator,
        m = Array.prototype.push,
        f = Array.prototype.slice,
        l = Array.prototype.indexOf,
        d = Array.prototype.concat,
        k = Object.prototype.toString,
        b = Object.prototype.hasOwnProperty,
        j = function(o, n) {
            return new j.fn.init(o, n)
        };
    j.fn = {
        prevObject: null,
        Aui_RegExp: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            POS: /:(not|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)$/
        },
        selector: function(o, r) {
            var r = typeof r === "string" ? [g] : r || [g];
            if (j.isString(o)) {
                var n = this,
                    p = this.Aui_RegExp,
                    s = o.split(","),
                    t = function(v, u) {
                        return v.test(u) ? v.exec(u)[0] : ""
                    };
                fnSelect = function(y, x, w) {
                    var v = [],
                        z = /[#\.]{1}/g.exec(y),
                        u = t(w.TAG, y);
                    switch (z && z[0]) {
                        case "#":
                            v = u ? this.getElement(t(w.ID, y).substring(1), x, u, "id") : [g.getElementById(y.substring(1))];
                            break;
                        case ".":
                            v = this.getByClass(x, t(w.CLASS, y).substring(1), u);
                            break;
                        default:
                            v = this.getElement(null, x, u, "tagName")
                    }
                    return v
                }, selectAttr = function(v, z) {
                    var w = /\[(.+?)\]/g.test(z) ? z.match(/\[(.+?)\]/g) : "",
                        u = [];
                    if (w) {
                        j.each(v, function() {
                            var E = this,
                                B = w.length - 1,
                                A = true;
                            while (B >= 0) {
                                var D = w[B] ? w[B].match(/[^\[\]=\'\"\s]+/g) : "",
                                    C = D.length;
                                if (C === 1) {
                                    if (!(E[D[0]] || E.getAttribute(D[0]))) {
                                        A = false
                                    }
                                } else {
                                    if (!((E[D[0]] || E.getAttribute(D[0])) === D[1])) {
                                        A = false
                                    }
                                }
                                B -= 1
                            }
                            A && u.push(E)
                        })
                    }
                    return u.length ? u : v;
                    var y = w ? w.match(/[^\[\]=\'\"\s]+/g) : "",
                        x = y.length;
                    j.each(v, function() {
                        var A = this[y[0]] || this.getAttribute(y[0]);
                        if (x) {
                            if (x === 1) {
                                A && u.push(this)
                            } else {
                                A === y[1] && u.push(this)
                            }
                        }
                    })
                }, selectFilter = function(u, z, y) {
                    var v = t(y, z);
                    if (!v) {
                        return u
                    }
                    var x = v.substring(1),
                        u = this.makeArray(u),
                        w = /\d+/.test(x) ? parseInt(/\d+/.exec(x)[0], 10) : 0;
                    result = [];
                    switch (/\w+/gi.exec(x)[0]) {
                        case "odd":
                            j.each(u, function(A) {
                                (A % 2 === 1) && result.push(this)
                            });
                            break;
                        case "even":
                            j.each(u, function(A) {
                                (A % 2 === 0) && result.push(this)
                            });
                            break;
                        case "first":
                            result.push(u[0]);
                            break;
                        case "last":
                            result.push(u[u.length - 1]);
                            break;
                        case "gt":
                            result = u.slice(w);
                            break;
                        case "lt":
                            result = u.slice(0, w);
                            break;
                        case "eq":
                            result.push(u[w]);
                            break;
                        case "not":
                            u.splice(w, 1);
                            result = u;
                            break;
                        default:
                            return u
                    }
                    return result.length ? result : u
                }, handleStr = function(x) {
                    var w = x.match(/\S+(\[.+?\](\[.+?\])*)|\S+/g),
                        u = w.length - 1,
                        v = [];
                    while (u >= 0) {
                        w[u] !== "" && v.unshift(w[u].replace(/\s+/g, ""));
                        u -= 1
                    }
                    return v.join(" ").replace(/(\s+\:)/g, ":")
                };
                var q = [];
                j.each(s, function(w, u) {
                    var u = /\[.+?\]/g.test(u) ? handleStr(u) : u,
                        x = x || r;
                    j.each(j.trim(u.replace(/\s{2,}/g, " ")).split(" "), function(v, y) {
                        x = fnSelect.call(n, j.trim(y), x, p);
                        x = selectAttr.call(n, x, y);
                        x = selectFilter.call(n, x, y, p.POS)
                    });
                    q = q.concat(x)
                })
            } else {
                if (typeof o === "object") {
                    return o instanceof Array ? o : o.item ? this.makeArray(o) : o.constructor === "Aui" ? this.toArray(o) : [o]
                }
            }
            return q
        },
        color10: function(t) {
            var v = /^#{1}[0-9|a-f]{6}$/ig,
                n = /^#{1}[0-9|a-f]{3}$/ig,
                s = /((GB|rgb)\()|(\))/g,
                p = function(y, z, x) {
                    return parseInt(y.toString().substring(z, x), 16)
                },
                w = function(x) {
                    return parseInt(x, 10)
                };
            if (n.test(t)) {
                var t = t.substring(1),
                    q = t.slice(0, 1),
                    u = t.slice(1, 2),
                    o = t.slice(2, 3);
                return [parseInt((q + q), 16), parseInt((u + u), 16), parseInt((o + o), 16)]
            } else {
                if (v.test(t)) {
                    var t = t.substring(1);
                    return [p(t, 0, 2), p(t, 4, 2), p(t, 6, 4)]
                } else {
                    if (s.test(t)) {
                        var r = t.replace(s, "").split(",");
                        return [w(r[0]), w(r[1]), w(r[2])]
                    }
                }
            }
        },
        init: function(n, o) {
            if (!n) {
                return this
            }
            this.length = 0;
            var p = this._Aui.selector(n, o) || [];
            this._Aui.prevObject = p;
            m.apply(this, p)
        },
        getStyle: function(o, n) {
            return o.currentStyle ? o.currentStyle[n] || 1 : getComputedStyle(o, false)[n]
        },
        getSize: function(r, v, q, s, p) {
            var u = r[0];
            switch (u) {
                case g:
                    var t = u.documentElement["scroll" + v],
                        n = u.documentElement["client" + v];
                    return (t > n ? t : n) + p;
                    break;
                case e:
                    return g.documentElement["client" + v];
                    break;
                default:
                    if (q) {
                        var w = 0,
                            o = this.getStyle;
                        j.each(s, function() {
                            w += parseInt(o(u, this), 10)
                        });
                        return w + u["offset" + v]
                    } else {
                        return u["offset" + v]
                    }
            }
        },
        getByClass: function(o, r, p) {
            var n = [],
                r = r || "*",
                q = RegExp("\\b" + r + "\\b", "i");
            j.each(o, function() {
                j.each(this.getElementsByTagName(p), function() {
                    q.test(this.className) && n.push(this)
                })
            });
            return n
        },
        getElement: function(r, q, p, s) {
            var o = this,
                n = [],
                p = p || "*",
                q = q instanceof Array ? q : q.length ? this.makeArray(q) : [q];
            j.each(q, function() {
                if (s === "id") {
                    j.each(this.getElementsByTagName(p), function() {
                        this.id === r && n.push(this)
                    })
                } else {
                    n = n.concat(o.makeArray(this.getElementsByTagName(p)))
                }
            });
            return n
        },
        makeArray: function(p) {
            try {
                return f.apply(p)
            } catch (o) {
                var n = [];
                j.each(p, function(r, q) {
                    r !== "length" && n.push(this)
                })
            }
            return n
        },
        returnNodeList: function(n) {
            var o = g.createElement("div");
            o.innerHTML = n;
            return o.childNodes
        },
        IsIeVer: function(n) {
            return parseInt(j.browser().match(/\d+/g), 10) < n
        },
        insertNode: function(o, p, t, r) {
            var n = p[0];
            if (typeof o === "string") {
                var q = /<.+?>.{0,}?<\/.+?>/g;
                if (q.test(o)) {
                    var s = this.makeArray(this.returnNodeList(o));
                    j.each(s, function(u, v) {
                        r.insertBefore(v, t)
                    })
                } else {
                    r.insertBefore(g.createElement(o.match(/\b[a-zA-Z]+\b/g)[0]), t)
                }
            } else {
                r.insertBefore(o, t)
            }
            return p
        },
        getOffset: function(o, p) {
            var n = o[p];
            while (o !== g.documentElement) {
                o = o.parentNode;
                n += o[p]
            }
            return n
        },
        changeStr: function(n) {
            return /\-\w?/ig.test(n) ? n.replace(/\-\w?/ig, n.match(/\-\w?/ig)[0].charAt(1).toUpperCase()) : n
        },
        changeStr2: function(n) {
            return /[A-Z]{1}/g.test(n) ? n.replace(/[A-Z]{1}/g, "-" + n.substring(n.search(/[A-Z]{1}/g), n.search(/[A-Z]{1}/g) + 1).toLowerCase()) : n
        },
        toArray: function(q, o) {
            try {
                return f.apply(q, o)
            } catch (p) {
                var n = [];
                j.each(q, function(s, r) {
                    n.push(this)
                })
            }
            return n
        },
        toAui: function(o) {
            var n = j();
            if (m.apply(n, o)) {
                return n
            } else {
                j.each(o, function(q, p) {
                    n[q] = this
                });
                n.length = o.length;
                return n
            }
        },
        animation: function(t, z, r, x, v) {
            var v = j.easing[(typeof v === "string" ? v : "easeDefault") || "easeDefault"],
                r = r * 0.1 || 40,
                s = this,
                y = 0,
                u = t,
                p = u.style,
                o = p.length > 0 || p.length === c,
                n = /(^#{1})|[rgb|RGB]{3}/,
                q = (function(E, D, C) {
                    var F = {},
                        A;
                    for (A in D) {
                        var B = n.test(D[A]);
                        F[A] = B ? s.color10(C.getStyle(E, s.changeStr(A))) : C.getStyle(E, s.changeStr(A))
                    }
                    return F
                })(u, z, this),
                w = function(E, D, B, G, F) {
                    var A = [];
                    for (var C = 0; C < 3; C += 1) {
                        A.push(Math.ceil(E(D, B[C], (G[C] - B[C]), F)))
                    }
                    return "rgb( " + A.join(",") + ")"
                };
            u.isFx = true;
            if (u.timer) {
                return false
            }
            clearTimeout(u.timer);
            (function() {
                var C = "";
                if (y < r) {
                    y++;
                    for (var A in z) {
                        var B = n.test(z[A]);
                        _isopacity = A === "opacity", _b = _isopacity ? parseFloat(q[A] * 100) / 100 : B ? q[A] : parseInt(q[A], 10), _c = B ? s.color10(z[A]) : _isopacity ? z[A] : parseInt(z[A], 10), _v = v(y, _b, (_c - _b), r), _v = _isopacity ? Math.ceil(_v * 100) / 100 : B ? w(v, y, _b, _c, r) : Math.ceil(_v) + "px";
                        if (o) {
                            if (_isopacity) {
                                p.opacity = _v;
                                p.filter = "alpha( opacity = " + _v * 100 + ")"
                            } else {
                                p[A] = _v
                            }
                        } else {
                            if (_isopacity) {
                                C += "opacity:" + _v + ";filter:alpha( opacity = " + _v * 100 + ");"
                            } else {
                                C += s.changeStr2(A) + ":" + _v + ";"
                            }
                        }
                    }
                    if (!o) {
                        p.cssText = C
                    }
                    u.timer = setTimeout(arguments.callee, 10)
                } else {
                    u.isFx = false;
                    u.timer = null;
                    j.isFunction(x) && x.call(u)
                }
            })()
        }
    };
    j.fn.init.prototype = {
        _Aui: j.fn,
        constructor: "Aui",
        splice: [].splice,
        concat: [].concat,
        slice: function() {
            return this._Aui.toAui(this._Aui.toArray(this, arguments))
        },
        push: m,
        objToString: k,
        objHasOwn: b,
        eq: function(n) {
            return n < 0 ? this : this.slice(n, n + 1)
        },
        children: function(o) {
            var n = function(q, r) {
                var p = [];
                j.each(q, function() {
                    var s = this;
                    j.each(this.children, function() {
                        var t = this;
                        if (this.nodeType === 1) {
                            if (j.isString(r)) {
                                t.tagName.toLowerCase() === r.toLowerCase() && p.push(t)
                            } else {
                                p.push(t)
                            }
                        }
                    })
                });
                return p
            };
            return this._Aui.toAui(n(this, o))
        },
        parents: function(r) {
            var o = this,
                n = [],
                p = null,
                q = 0;
            j.each(o, function() {
                if (j.isString(r)) {
                    p = this.parentNode;
                    while (p.tagName.toLowerCase() !== r.toLowerCase()) {
                        p = p.parentNode
                    }
                    n[q] !== p && n.push(p)
                } else {
                    n.push(this.parentNode)
                }
            });
            return o._Aui.toAui(n)
        },
        index: function(o) {
            var n = this,
                p = n._Aui.toArray,
                q = o ? p(n, 0) : (function(t, u) {
                    var s = [];
                    j.each(t, function() {
                        this.tagName === u && s.push(this)
                    });
                    return s
                })(n[0].parentNode.children, n[0].tagName),
                r = o ? o[0] || o : n[0];
            return (function(s, v) {
                if (l) {
                    return l.call(s, v)
                } else {
                    var u = s.length,
                        t;
                    for (t = 0; t < u; t += 1) {
                        if (s[t] === v) {
                            return t
                        }
                    }
                    return -1
                }
            }(q, r))
        },
        end: function() {
            return this._Aui.toAui(this._Aui.prevObject)
        },
        html: function(n) {
            if (n) {
                $.each(this, function() {
                    this.innerHTML = n
                });
                return this
            } else {
                return this[0].innerHTML
            }
        },
        text: function(o) {
            var n = function(p) {
                return j.trim(p.toString().replace(/<.+?>/g, ""), "all")
            };
            if (o) {
                $.each(this, function() {
                    this.innerHTML = n(o)
                });
                return this
            } else {
                return n(this[0].innerHTML)
            }
        },
        find: function(n) {
            if (n) {
                return this._Aui.toAui(this._Aui.selector(n, this))
            } else {
                return this
            }
        },
        left: function(n) {
            var o = this._Aui.getOffset,
                p = this[0];
            return n ? o(p, "offsetLeft") : p.offsetLeft
        },
        top: function(n) {
            var o = this._Aui.getOffset,
                p = this[0];
            return n ? o(p, "offsetTop") : p.offsetTop
        },
        width: function(n) {
            return this._Aui.getSize(this, "Width", n || false, ["marginLeft", "marginRight"], 0)
        },
        height: function(n) {
            return this._Aui.getSize(this, "Height", n || false, ["marginTop", "marginBottom"], this._Aui.IsIeVer(8) ? 10 : 0)
        },
        getScroll: function(n, o) {
            return n.tagName ? n["scroll" + o] : (g.documentElement["scroll" + o] || g.body["scroll" + o])
        },
        scrollTop: function(n) {
            return this.getScroll(this[0], "Top")
        },
        scrollLeft: function(n) {
            return this.getScroll(this[0], "Left")
        },
        getStyle: function(n) {
            return j.isString(n) ? this._Aui.getStyle(this[0], this._Aui.changeStr(n)) : c
        },
        setStyle: function(p, o) {
            if (j.isString(p) && o !== c) {
                var p = this._Aui.changeStr(p);
                j.each(this, function() {
                    if (p === "opacity") {
                        this.style.filter = "alpha(opacity=" + o * 100 + ")";
                        this.style.opacity = o
                    } else {
                        this.style[p] = typeof o === "number" ? o + "px" : o
                    }
                })
            } else {
                if (j.typeOf(p) === "object") {
                    var n = this._Aui.changeStr;
                    j.each(this, function() {
                        _self = this;
                        j.each(p, function(r, q) {
                            var r = n(r);
                            if (r === "opacity") {
                                _self.style.filter = "alpha(opacity=" + q * 100 + ")";
                                _self.style.opacity = q
                            } else {
                                _self.style[r] = typeof q === "number" ? q + "px" : q
                            }
                        })
                    })
                }
            }
            return this
        },
        removeStyle: function(n) {
            if (j.isString(n)) {
                var n = this._Aui.changeStr(n);
                j.each(this, function() {
                    n === "opacity" && (this.style.filter = "");
                    this.style[n] = ""
                })
            }
            return this
        },
        getAttr: function(n) {
            return typeof n !== "string" && this[0].getAttribute(n) || this[0].className
        },
        setAttr: function(n, o) {
            if (typeof n === "string" && o !== c) {
                j.each(this, function() {
                    n === "class" ? this.className += " " + o : this.setAttribute(n, o)
                })
            } else {
                if (j.typeOf(n) === "object") {
                    j.each(this, function() {
                        _self = this;
                        j.each(n, function(q, p) {
                            q === "class" ? _self.className += " " + p : _self.setAttribute(q, p)
                        })
                    })
                }
            }
            return this
        },
        removeAttr: function(n) {
            if (typeof n === "string") {
                j.each(this, function() {
                    this === "class" ? this.className = "" : this.removeAttribute(n)
                })
            }
            return this
        },
        addClass: function(n) {
            if (j.isString(n)) {
                j.each(this, function() {
                    var o = this.className,
                        p = RegExp(n, "ig");
                    if (o) {
                        if (!p.test(o)) {
                            this.className += " " + n
                        }
                    } else {
                        this.className = n
                    }
                })
            }
            return this
        },
        removeClass: function(p) {
            if (j.isString(p)) {
                var o = RegExp("(s{1}\b" + p + "\b)|(\b" + p + "\bs{1})", "ig"),
                    n = this.className;
                j.each(this, function() {
                    if (n) {
                        this.className = n.replace(o, "")
                    } else {
                        this.className = ""
                    }
                })
            }
            return this
        },
        hasClass: function(n) {
            return (j.isString(n)) ? RegExp("\\b" + n + "\\b", "ig").test(this[0].className) : false
        },
        hover: function(n, o) {
            this.bind("mouseover", n);
            this.bind("mouseout", o);
            return this
        },
        toggle: function() {
            var o = arguments,
                n = o.length - 1;
            for (; n >= 0; n -= 1) {
                if (!j.isFunction(o[n])) {
                    return this
                }
            }
            this.bind("click", function() {
                this.count = this.count || 0;
                o[this.count++ % o.length].call(this)
            });
            return this
        },
        bind: function(o, n) {
            j.each(this, function(r, q) {
                var p = this;
                p.queue = p.queue || {};
                var s = p.queue[o] = p.queue[o] || [];
                s.unshift(n);
                if (!s._handler_) {
                    s._handler_ = function(y) {
                        var t = y || e.event,
                            u = t.type,
                            z = function(C, D, E) {
                                for (var A = 0, B; B = C[A++];) {
                                    if (false === B.call(E, D)) {
                                        D.preventDefault ? D.preventDefault() : D.returnValue = false
                                    }
                                }
                            };
                        t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true;
                        if (u === "mouseover" || u === "mouseout") {
                            var v = u === "mouseover" ? t.fromElement : t.toElement,
                                x = t.currentTarget,
                                w = t.relatedTarget || v;
                            if (!j.contains(x, w) && x !== w) {
                                z(s, t, p)
                            }
                        } else {
                            z(s, t, p)
                        }
                    }
                }
                p.addEventListener ? p.addEventListener(o, s._handler_, false) : p.attachEvent("on" + o, s._handler_)
            });
            return this
        },
        unbind: function(p, o) {
            var n = function(s, q, r) {
                r.removeEventListener ? r.removeEventListener(s, q._handler_, false) : r.detachEvent("on" + s, q._handler_)
            };
            j.each(this, function(s, r) {
                var q = this;
                if (p) {
                    try {
                        var t = q.queue[p];
                        if (o) {
                            j.each(t, function() {
                                t[s] === o && t.splice(s, 1)
                            })
                        } else {
                            t.length = 0
                        }
                        n(p, t, q)
                    } catch (u) {
                        return this
                    }
                } else {
                    j.each(q.queue, function(x, w) {
                        n(x, q.queue[x], q)
                    });
                    try {
                        delete q.queue
                    } catch (u) {
                        q.queue = c
                    }
                }
            });
            return this
        },
        after: function(p) {
            var o = this,
                r = o[0],
                q = r.parentNode,
                n = r.nextSibling;
            while (n.nodeType !== 1) {
                n = n.nextSibling
            }
            this._Aui.insertNode(p, o, n, q);
            return o
        },
        before: function(o) {
            var n = this,
                q = n[0],
                p = q.parentNode;
            this._Aui.insertNode(o, n, q, p);
            return n
        },
        append: function(o) {
            var n = this,
                p = n[0].children,
                q = p[p.length];
            this._Aui.insertNode(o, n, q, n[0]);
            return n
        },
        prepend: function(o) {
            var n = this,
                p = n[0].children[0];
            this._Aui.insertNode(o, n, p, n[0]);
            return n
        },
        next: function() {
            var o = this[0],
                n = o.nextSibling;
            while (n.nodeType !== 1) {
                n = n.nextSibling
            }
            return this._Aui.toAui([n])
        },
        prev: function() {
            var o = this[0],
                n = o.previousSibling;
            while (n.nodeType !== 1) {
                n = n.previousSibling
            }
            return this._Aui.toAui([n])
        },
        siblings: function(q) {
            var o = this[0],
                p = o.parentNode.children,
                n = [];
            j.each(p, function() {
                if (q) {
                    this.nodeName.toLowerCase() === q.toLowerCase() && this !== o && n.push(this)
                } else {
                    this !== o && n.push(this)
                }
            });
            return this._Aui.toAui(n)
        },
        remove: function() {
            j.each(this, function() {
                this.parentNode.removeChild(this)
            });
            return this
        },
        show: function() {
            if (this.length) {
                j.each(this, function() {
                    this.style.display = "block"
                })
            }
            return this
        },
        hide: function() {
            if (this.length) {
                j.each(this, function() {
                    this.style.display = "none"
                })
            }
            return this
        },
        fx: function(o, p, r, q) {
            var n = this;
            j.each(n, function() {
                var s = this;
                setTimeout(function() {
                    n._Aui.animation.call(n._Aui, s, o, p, r, q);
                    s.timeout = 0
                }, (this.timeout || 0))
            });
            return n
        },
        stop: function() {
            var n = this;
            j.each(n, function() {
                if (this.isFx) {
                    clearTimeout(this.timer);
                    this.timer = null
                }
            });
            return n
        },
        delay: function(o) {
            var n = this;
            var o = o && typeof o === "number" ? o : 0;
            j.each(n, function() {
                this.timeout = o
            });
            return this
        }
    };
    j.easing = {
        easeDefault: function(o, n, q, p) {
            return o * q / p + n
        },
        easeInQuad: function(o, n, q, p) {
            return q * (o /= p) * o + n
        },
        easeOutQuad: function(o, n, q, p) {
            return -q * (o /= p) * (o - 2) + n
        },
        easeInOutQuad: function(o, n, q, p) {
            if ((o /= p / 2) < 1) {
                return q / 2 * o * o + n
            }
            return -q / 2 * ((--o) * (o - 2) - 1) + n
        },
        easeInCubic: function(o, n, q, p) {
            return q * (o /= p) * o * o + n
        },
        easeOutCubic: function(o, n, q, p) {
            return q * ((o = o / p - 1) * o * o + 1) + n
        },
        easeInOutCubic: function(o, n, q, p) {
            if ((o /= p / 2) < 1) {
                return q / 2 * o * o * o + n
            }
            return q / 2 * ((o -= 2) * o * o + 2) + n
        },
        easeInQuart: function(o, n, q, p) {
            return q * (o /= p) * o * o * o + n
        },
        easeOutQuart: function(o, n, q, p) {
            return -q * ((o = o / p - 1) * o * o * o - 1) + n
        },
        easeInOutQuart: function(o, n, q, p) {
            if ((o /= p / 2) < 1) {
                return q / 2 * o * o * o * o + n
            }
            return -q / 2 * ((o -= 2) * o * o * o - 2) + n
        },
        easeInQuint: function(o, n, q, p) {
            return q * (o /= p) * o * o * o * o + n
        },
        easeOutQuint: function(o, n, q, p) {
            return q * ((o = o / p - 1) * o * o * o * o + 1) + n
        },
        easeInOutQuint: function(o, n, q, p) {
            if ((o /= p / 2) < 1) {
                return q / 2 * o * o * o * o * o + n
            }
            return q / 2 * ((o -= 2) * o * o * o * o + 2) + n
        },
        easeInSine: function(o, n, q, p) {
            return -q * Math.cos(o / p * (Math.PI / 2)) + q + n
        },
        easeOutSine: function(o, n, q, p) {
            return q * Math.sin(o / p * (Math.PI / 2)) + n
        },
        easeInOutSine: function(o, n, q, p) {
            return -q / 2 * (Math.cos(Math.PI * o / p) - 1) + n
        },
        easeInExpo: function(o, n, q, p) {
            return (o == 0) ? n : q * Math.pow(2, 10 * (o / p - 1)) + n
        },
        easeOutExpo: function(o, n, q, p) {
            return (o == p) ? n + q : q * (-Math.pow(2, -10 * o / p) + 1) + n
        },
        easeInOutExpo: function(o, n, q, p) {
            if (o == 0) {
                return n
            }
            if (o == p) {
                return n + q
            }
            if ((o /= p / 2) < 1) {
                return q / 2 * Math.pow(2, 10 * (o - 1)) + n
            }
            return q / 2 * (-Math.pow(2, -10 * --o) + 2) + n
        },
        easeInCirc: function(o, n, q, p) {
            return -q * (Math.sqrt(1 - (o /= p) * o) - 1) + n
        },
        easeOutCirc: function(o, n, q, p) {
            return q * Math.sqrt(1 - (o = o / p - 1) * o) + n
        },
        easeInOutCirc: function(o, n, q, p) {
            if ((o /= p / 2) < 1) {
                return -q / 2 * (Math.sqrt(1 - o * o) - 1) + n
            }
            return q / 2 * (Math.sqrt(1 - (o -= 2) * o) + 1) + n
        },
        easeInElastic: function(q, n, w, v) {
            var r = 1.70158;
            var u = 0;
            var o = w;
            if (q == 0) {
                return n
            }
            if ((q /= v) == 1) {
                return n + w
            }
            if (!u) {
                u = v * 0.3
            }
            if (o < Math.abs(w)) {
                o = w;
                var r = u / 4
            } else {
                var r = u / (2 * Math.PI) * Math.asin(w / o)
            }
            return -(o * Math.pow(2, 10 * (q -= 1)) * Math.sin((q * v - r) * (2 * Math.PI) / u)) + n
        },
        easeOutElastic: function(q, n, w, v) {
            var r = 1.70158;
            var u = 0;
            var o = w;
            if (q == 0) {
                return n
            }
            if ((q /= v) == 1) {
                return n + w
            }
            if (!u) {
                u = v * 0.3
            }
            if (o < Math.abs(w)) {
                o = w;
                var r = u / 4
            } else {
                var r = u / (2 * Math.PI) * Math.asin(w / o)
            }
            return o * Math.pow(2, -10 * q) * Math.sin((q * v - r) * (2 * Math.PI) / u) + w + n
        },
        easeInOutElastic: function(q, n, w, v) {
            var r = 1.70158;
            var u = 0;
            var o = w;
            if (q == 0) {
                return n
            }
            if ((q /= v / 2) == 2) {
                return n + w
            }
            if (!u) {
                u = v * (0.3 * 1.5)
            }
            if (o < Math.abs(w)) {
                o = w;
                var r = u / 4
            } else {
                var r = u / (2 * Math.PI) * Math.asin(w / o)
            } if (q < 1) {
                return -0.5 * (o * Math.pow(2, 10 * (q -= 1)) * Math.sin((q * v - r) * (2 * Math.PI) / u)) + n
            }
            return o * Math.pow(2, -10 * (q -= 1)) * Math.sin((q * v - r) * (2 * Math.PI) / u) * 0.5 + w + n
        },
        easeInBack: function(o, n, r, q, p) {
            if (p == c) {
                p = 1.70158
            }
            return r * (o /= q) * o * ((p + 1) * o - p) + n
        },
        easeOutBack: function(o, n, r, q, p) {
            if (p == c) {
                p = 1.70158
            }
            return r * ((o = o / q - 1) * o * ((p + 1) * o + p) + 1) + n
        },
        easeInOutBack: function(o, n, r, q, p) {
            if (p == c) {
                p = 1.70158
            }
            if ((o /= q / 2) < 1) {
                return r / 2 * (o * o * (((p *= (1.525)) + 1) * o - p)) + n
            }
            return r / 2 * ((o -= 2) * o * (((p *= (1.525)) + 1) * o + p) + 2) + n
        },
        easeInBounce: function(o, n, q, p) {
            return q - j.easing.easeOutBounce(p - o, 0, q, p) + n
        },
        easeOutBounce: function(o, n, q, p) {
            if ((o /= p) < (1 / 2.75)) {
                return q * (7.5625 * o * o) + n
            } else {
                if (o < (2 / 2.75)) {
                    return q * (7.5625 * (o -= (1.5 / 2.75)) * o + 0.75) + n
                } else {
                    if (o < (2.5 / 2.75)) {
                        return q * (7.5625 * (o -= (2.25 / 2.75)) * o + 0.9375) + n
                    } else {
                        return q * (7.5625 * (o -= (2.625 / 2.75)) * o + 0.984375) + n
                    }
                }
            }
        },
        easeInOutBounce: function(o, n, q, p) {
            if (o < p / 2) {
                return j.easing.easeInBounce(o * 2, 0, q, p) * 0.5 + n
            }
            return j.easing.easeOutBounce(o * 2 - p, 0, q, p) * 0.5 + q * 0.5 + n
        }
    };
    j.toString = function() {
        return "Aui v1.52"
    };
    j.contains = function(n, p) {
        try {
            return n.contains ? n != p && n.contains(p) : !!(n.compareDocumentPosition(p) && 16)
        } catch (o) {}
    };
    j.ready = function(n) {
        var o = [];
        var p = function() {
            if (arguments.callee.loaded) {
                return false
            }
            arguments.callee.loaded = true;
            var r = o,
                t = o.length;
            for (var s = 0; s < t; s += 1) {
                r[s]()
            }
        };
        var q = function() {
            try {
                g.documentElement.doScroll("left")
            } catch (r) {
                setTimeout(arguments.callee, 1);
                return
            }
            p()
        };
        o.push(n);
        if (g.addEventListener) {
            g.addEventListener("DOMContentLoaded", p, false)
        } else {
            q()
        }
    };
    j.loadjs = function(n, r, p) {
        var o = g.getElementsByTagName("head")[0];
        script = g.createElement("script"), p = p || "utf-8";
        script.onload = script.onreadystatechange = script.onerror = function() {
            if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) {
                return false
            }
            script.onload = script.onreadystatechange = script.onerror = null;
            script.src = "";
            script.parentNode.removeChild(script);
            script = null;
            j.isFunction(r) && r()
        };
        script.charset = p;
        script.src = n;
        try {
            o.appendChild(script)
        } catch (q) {}
    };
    j.loadmultiJS = function(o, r, q) {
        if (Object.prototype.toString.call(o) === "[object Array]") {
            this.suc = 0;
            this.len = o.length;
            var n = this;
            for (var p = 0; p < o.length; p += 1) {
                j.loadjs(o[p], function() {
                    n.suc++;
                    if (n.suc == n.len) {
                        try {
                            j.isFunction(r) && r()
                        } catch (s) {}
                    }
                }, q)
            }
        } else {
            if (typeof o === "string") {
                j.loadjs(o, r, q)
            }
        }
    };
    j.makeString = function(p) {
        var o = function(r) {
                var s = [];
                $.each(r, function(u, t) {
                    s.push(u + "=" + t)
                });
                return s
            },
            q = $.typeOf(p);
        if (q === "object" || q === "array") {
            return o(p).join("&")
        } else {
            if (typeof p === "string" && /[\:\&]+/g.test(p)) {
                var n = /(^[\"\']\{?)|([\"\']\}?$)/g.test(p) ? JSON.parse(p) : p;
                return typeof n === "string" ? n : o(n).join("&")
            }
        }
    };
    j.byID = function(n) {
        return [g.getElementById(n.substring(1))]
    };
    j.byTagName = function(n) {
        return j.fn.makeArray(g.getElementsByTagName(n))
    };
    j.byClass = function(n) {
        var p = j.fn,
            o = p.Aui_RegExp.TAG;
        return p.getByClass([g], p.Aui_RegExp.CLASS.exec(n)[0].substring(1), o.test(n) ? o.exec(n)[0] : "*")
    };
    j.ajax = function(q) {
        var s = e.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP") || null;
        if (!s) {
            return false
        }
        var t = q.type.toLowerCase() || "get",
            o = q.url || "",
            r = q.data || null,
            p = q.code || "utf-8",
            u = q.error || c,
            v = q.beforeSend || c,
            w = q.success || c,
            x = j.makeString(r),
            n = /\?{1}/.test(o) ? r ? o.slice(0, o.search(/\?{1}/)) : o : o;
        if (t === "get") {
            x && (n += "?" + x);
            x = null
        }
        s.open(t, n, true);
        s.readyState === 1 && v != c && v.call(e, s, s.readyState, "beforeSend");
        s.onreadystatechange = function() {
            if (s.readyState === 4) {
                if (s.status === 200) {
                    w != c && w.call(e, s.responseText, s.status, "success")
                } else {
                    u != c && u.call(e, s, s.status, "error")
                }
            }
        };
        t === "post" && s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=" + p + "");
        s.send(x)
    };
    j.isString = function(n) {
        return n && typeof n === "string"
    };
    j.isFunction = function(n) {
        return n && typeof n === "function"
    };
    j.trim = function(p, n) {
        return p.replace(n ? n === "all" ? /\s+/g : n === "left" ? /^\s+/g : n === "right" ? /\s+$/g : c : /(^\s+)|(\s+$)/g, "")
    };
    j.browser = function() {
        var o = i.userAgent.toLowerCase(),
            n = "";
        j.each(["msie", "firefox", "chrome", "opera", "safari", "camino", "gecko"], function() {
            if (o.match(RegExp(this, "g"))) {
                if (/msie/g.test(this)) {
                    n = o.match(/ie\s?\d{1}/ig)[0].replace(/\s/g, "")
                } else {
                    n = this
                }
                return false
            }
        });
        return n
    };
    j.each = function(q, s) {
        var r = j.typeOf(q),
            o = j.isFunction(s),
            p;
        if (r === "array" || r === "Aui" || r === "dom") {
            var n = q.length;
            !n && o && s.call(q, 0, q);
            for (p = 0; p < n; p += 1) {
                if (o && s.call(q[p], p, q[p]) === false) {
                    return false
                }
            }
        } else {
            if (r === "object") {
                for (p in q) {
                    if (o && s.call(q[p], p, q[p]) === false) {
                        return false
                    }
                }
            }
        }
        return q
    };
    j.typeOf = function(p) {
        var s = {},
            o, n = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object"],
            r = n.length;
        for (o = 0; o < r; o += 1) {
            s["[object " + n[o] + "]"] = n[o].toLowerCase()
        }
        var q = p == null ? String(p) : s[k.call(p)] || "dom";
        return q === "object" ? k.call(p) === "[object Object]" ? p.constructor === "Aui" ? "Aui" : "object" : "dom" : q
    };
    var a = ("blur|focus|load|resize|scroll|unload|click|dblclick|mousedown|mouseup|mousemove|mouseover|mouseout|change|reset|select|submit|keydown|keypress|keyup|error").split("|");
    j.each(a, function() {
        var n = this;
        j.fn.init.prototype[n] = function(o) {
            o && j.isFunction(o) && j.each(this, function() {
                this["on" + n] = o
            })
        }
    });
    j.extend = function(o, n) {
        if (typeof o === "object" && j.typeOf(n) === "object") {
            j.each(n, function(q, p) {
                o[q] = p
            })
        }
        return o
    };
    j.fn.extend = function(n) {
        return j.extend.call(j, j.fn.init.prototype, n)
    };
    e.$ = e.Aui = j
})(window);