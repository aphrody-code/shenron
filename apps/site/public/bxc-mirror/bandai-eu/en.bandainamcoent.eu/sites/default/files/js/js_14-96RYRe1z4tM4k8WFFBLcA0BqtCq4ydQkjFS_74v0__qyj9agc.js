/* @license GPL-2.0-or-later https://git.drupalcode.org/project/once/-/raw/v1.0.1/LICENSE.md */
/*! @drupal/once - v1.0.1 - 2021-06-12 */
var once = (function () {
	"use strict";
	var n = /[\11\12\14\15\40]+/,
		e = "data-once",
		t = document;
	function r(n, t, r) {
		return n[t + "Attribute"](e, r);
	}
	function o(e) {
		if ("string" != typeof e) throw new TypeError("once ID must be a string");
		if ("" === e || n.test(e)) throw new RangeError("once ID must not be empty or contain spaces");
		return '[data-once~="' + e + '"]';
	}
	function u(n) {
		if (!(n instanceof Element)) throw new TypeError("The element must be an instance of Element");
		return !0;
	}
	function i(n, e) {
		void 0 === e && (e = t);
		var r = n;
		if (null === n) r = [];
		else {
			if (!n) throw new TypeError("Selector must not be empty");
			"string" != typeof n || (e !== t && !u(e))
				? n instanceof Element && (r = [n])
				: (r = e.querySelectorAll(n));
		}
		return Array.prototype.slice.call(r);
	}
	function c(n, e, t) {
		return e.filter(function (e) {
			var r = u(e) && e.matches(n);
			return (r && t && t(e), r);
		});
	}
	function f(e, t) {
		var o = t.add,
			u = t.remove,
			i = [];
		(r(e, "has") &&
			r(e, "get")
				.trim()
				.split(n)
				.forEach(function (n) {
					i.indexOf(n) < 0 && n !== u && i.push(n);
				}),
			o && i.push(o));
		var c = i.join(" ");
		r(e, "" === c ? "remove" : "set", c);
	}
	function a(n, e, t) {
		return c(":not(" + o(n) + ")", i(e, t), function (e) {
			return f(e, { add: n });
		});
	}
	return (
		(a.remove = function (n, e, t) {
			return c(o(n), i(e, t), function (e) {
				return f(e, { remove: n });
			});
		}),
		(a.filter = function (n, e, t) {
			return c(o(n), i(e, t));
		}),
		(a.find = function (n, e) {
			return i(n ? o(n) : "[data-once]", e);
		}),
		a
	);
})();
/* @license Public Domain https://raw.githubusercontent.com/jquery/jquery-ui/1.13.2/LICENSE.txt */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return ((e.ui = e.ui || {}), (e.ui.version = "1.13.2"));
});

/*!
 * jQuery UI :data 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return e.extend(e.expr.pseudos, {
		data: e.expr.createPseudo
			? e.expr.createPseudo(function (n) {
					return function (t) {
						return !!e.data(t, n);
					};
				})
			: function (n, t, r) {
					return !!e.data(n, r[3]);
				},
	});
});

/*!
 * jQuery UI Disable Selection 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return e.fn.extend({
		disableSelection:
			((n = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown"),
			function () {
				return this.on(n + ".ui-disableSelection", function (e) {
					e.preventDefault();
				});
			}),
		enableSelection: function () {
			return this.off(".ui-disableSelection");
		},
	});
	var n;
});

/*!
 * jQuery UI Focusable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return (
		(e.ui.focusable = function (i, t) {
			var n,
				s,
				r,
				u,
				a,
				o = i.nodeName.toLowerCase();
			return "area" === o
				? ((s = (n = i.parentNode).name),
					!(!i.href || !s || "map" !== n.nodeName.toLowerCase()) &&
						(r = e("img[usemap='#" + s + "']")).length > 0 &&
						r.is(":visible"))
				: (/^(input|select|textarea|button|object)$/.test(o)
						? (u = !i.disabled) && (a = e(i).closest("fieldset")[0]) && (u = !a.disabled)
						: (u = ("a" === o && i.href) || t),
					u &&
						e(i).is(":visible") &&
						(function (e) {
							var i = e.css("visibility");
							for (; "inherit" === i; ) i = (e = e.parent()).css("visibility");
							return "visible" === i;
						})(e(i)));
		}),
		e.extend(e.expr.pseudos, {
			focusable: function (i) {
				return e.ui.focusable(i, null != e.attr(i, "tabindex"));
			},
		}),
		e.ui.focusable
	);
});

!(function (t) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery);
})(function (t) {
	"use strict";
	return (t.fn._form = function () {
		return "string" == typeof this[0].form ? this.closest("form") : t(this[0].form);
	});
});

!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return (e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()));
});

/*!
 * jQuery UI Keycode 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return (e.ui.keyCode = {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38,
	});
});

/*!
 * jQuery UI Labels 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (t) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery);
})(function (t) {
	"use strict";
	return (t.fn.labels = function () {
		var e, s, i, n, a;
		return this.length
			? this[0].labels && this[0].labels.length
				? this.pushStack(this[0].labels)
				: ((n = this.eq(0).parents("label")),
					(i = this.attr("id")) &&
						((a = (e = this.eq(0).parents().last()).add(e.length ? e.siblings() : this.siblings())),
						(s = "label[for='" + t.escapeSelector(i) + "']"),
						(n = n.add(a.find(s).addBack(s)))),
					this.pushStack(n))
			: this.pushStack([]);
	});
});

!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return (e.ui.plugin = {
		add: function (n, i, t) {
			var u,
				o = e.ui[n].prototype;
			for (u in t) ((o.plugins[u] = o.plugins[u] || []), o.plugins[u].push([i, t[u]]));
		},
		call: function (e, n, i, t) {
			var u,
				o = e.plugins[n];
			if (o && (t || (e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType)))
				for (u = 0; u < o.length; u++) e.options[o[u][0]] && o[u][1].apply(e.element, i);
		},
	});
});

!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return (e.ui.safeActiveElement = function (e) {
		var n;
		try {
			n = e.activeElement;
		} catch (t) {
			n = e.body;
		}
		return (n || (n = e.body), n.nodeName || (n = e.body), n);
	});
});

!(function (e) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], e) : e(jQuery);
})(function (e) {
	"use strict";
	return (e.ui.safeBlur = function (n) {
		n && "body" !== n.nodeName.toLowerCase() && e(n).trigger("blur");
	});
});

/*!
 * jQuery UI Scroll Parent 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (t) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery);
})(function (t) {
	"use strict";
	return (t.fn.scrollParent = function (e) {
		var s = this.css("position"),
			n = "absolute" === s,
			o = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			i = this.parents()
				.filter(function () {
					var e = t(this);
					return (
						(!n || "static" !== e.css("position")) &&
						o.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
					);
				})
				.eq(0);
		return "fixed" !== s && i.length ? i : t(this[0].ownerDocument || document);
	});
});

/*!
 * jQuery UI Tabbable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd
		? define(["jquery", "./version", "./focusable"], e)
		: e(jQuery);
})(function (e) {
	"use strict";
	return e.extend(e.expr.pseudos, {
		tabbable: function (n) {
			var t = e.attr(n, "tabindex"),
				u = null != t;
			return (!u || t >= 0) && e.ui.focusable(n, u);
		},
	});
});

/*!
 * jQuery UI Unique ID 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (i) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], i) : i(jQuery);
})(function (i) {
	"use strict";
	return i.fn.extend({
		uniqueId:
			((e = 0),
			function () {
				return this.each(function () {
					this.id || (this.id = "ui-id-" + ++e);
				});
			}),
		removeUniqueId: function () {
			return this.each(function () {
				/^ui-id-\d+$/.test(this.id) && i(this).removeAttr("id");
			});
		},
	});
	var e;
});

/*!
 * jQuery UI Position 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
!(function (t) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery);
})(function (t) {
	"use strict";
	return (
		(function () {
			var i,
				o = Math.max,
				e = Math.abs,
				n = /left|center|right/,
				l = /top|center|bottom/,
				f = /[\+\-]\d+(\.[\d]+)?%?/,
				s = /^\w+/,
				h = /%$/,
				r = t.fn.position;
			function c(t, i, o) {
				return [
					parseFloat(t[0]) * (h.test(t[0]) ? i / 100 : 1),
					parseFloat(t[1]) * (h.test(t[1]) ? o / 100 : 1),
				];
			}
			function p(i, o) {
				return parseInt(t.css(i, o), 10) || 0;
			}
			function a(t) {
				return null != t && t === t.window;
			}
			function d(t) {
				var i = t[0];
				return 9 === i.nodeType
					? { width: t.width(), height: t.height(), offset: { top: 0, left: 0 } }
					: a(i)
						? {
								width: t.width(),
								height: t.height(),
								offset: { top: t.scrollTop(), left: t.scrollLeft() },
							}
						: i.preventDefault
							? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } }
							: { width: t.outerWidth(), height: t.outerHeight(), offset: t.offset() };
			}
			((t.position = {
				scrollbarWidth: function () {
					if (void 0 !== i) return i;
					var o,
						e,
						n = t(
							"<div style='display:block;position:absolute;width:200px;height:200px;overflow:hidden;'><div style='height:300px;width:auto;'></div></div>"
						),
						l = n.children()[0];
					return (
						t("body").append(n),
						(o = l.offsetWidth),
						n.css("overflow", "scroll"),
						o === (e = l.offsetWidth) && (e = n[0].clientWidth),
						n.remove(),
						(i = o - e)
					);
				},
				getScrollInfo: function (i) {
					var o = i.isWindow || i.isDocument ? "" : i.element.css("overflow-x"),
						e = i.isWindow || i.isDocument ? "" : i.element.css("overflow-y"),
						n = "scroll" === o || ("auto" === o && i.width < i.element[0].scrollWidth);
					return {
						width:
							"scroll" === e || ("auto" === e && i.height < i.element[0].scrollHeight)
								? t.position.scrollbarWidth()
								: 0,
						height: n ? t.position.scrollbarWidth() : 0,
					};
				},
				getWithinInfo: function (i) {
					var o = t(i || window),
						e = a(o[0]),
						n = !!o[0] && 9 === o[0].nodeType;
					return {
						element: o,
						isWindow: e,
						isDocument: n,
						offset: !e && !n ? t(i).offset() : { left: 0, top: 0 },
						scrollLeft: o.scrollLeft(),
						scrollTop: o.scrollTop(),
						width: o.outerWidth(),
						height: o.outerHeight(),
					};
				},
			}),
				(t.fn.position = function (i) {
					if (!i || !i.of) return r.apply(this, arguments);
					var h,
						a,
						g,
						u,
						m,
						w,
						W = "string" == typeof (i = t.extend({}, i)).of ? t(document).find(i.of) : t(i.of),
						v = t.position.getWithinInfo(i.within),
						y = t.position.getScrollInfo(v),
						H = (i.collision || "flip").split(" "),
						b = {};
					return (
						(w = d(W)),
						W[0].preventDefault && (i.at = "left top"),
						(a = w.width),
						(g = w.height),
						(u = w.offset),
						(m = t.extend({}, u)),
						t.each(["my", "at"], function () {
							var t,
								o,
								e = (i[this] || "").split(" ");
							(1 === e.length &&
								(e = n.test(e[0])
									? e.concat(["center"])
									: l.test(e[0])
										? ["center"].concat(e)
										: ["center", "center"]),
								(e[0] = n.test(e[0]) ? e[0] : "center"),
								(e[1] = l.test(e[1]) ? e[1] : "center"),
								(t = f.exec(e[0])),
								(o = f.exec(e[1])),
								(b[this] = [t ? t[0] : 0, o ? o[0] : 0]),
								(i[this] = [s.exec(e[0])[0], s.exec(e[1])[0]]));
						}),
						1 === H.length && (H[1] = H[0]),
						"right" === i.at[0] ? (m.left += a) : "center" === i.at[0] && (m.left += a / 2),
						"bottom" === i.at[1] ? (m.top += g) : "center" === i.at[1] && (m.top += g / 2),
						(h = c(b.at, a, g)),
						(m.left += h[0]),
						(m.top += h[1]),
						this.each(function () {
							var n,
								l,
								f = t(this),
								s = f.outerWidth(),
								r = f.outerHeight(),
								d = p(this, "marginLeft"),
								w = p(this, "marginTop"),
								x = s + d + p(this, "marginRight") + y.width,
								T = r + w + p(this, "marginBottom") + y.height,
								L = t.extend({}, m),
								P = c(b.my, f.outerWidth(), f.outerHeight());
							("right" === i.my[0] ? (L.left -= s) : "center" === i.my[0] && (L.left -= s / 2),
								"bottom" === i.my[1] ? (L.top -= r) : "center" === i.my[1] && (L.top -= r / 2),
								(L.left += P[0]),
								(L.top += P[1]),
								(n = { marginLeft: d, marginTop: w }),
								t.each(["left", "top"], function (o, e) {
									t.ui.position[H[o]] &&
										t.ui.position[H[o]][e](L, {
											targetWidth: a,
											targetHeight: g,
											elemWidth: s,
											elemHeight: r,
											collisionPosition: n,
											collisionWidth: x,
											collisionHeight: T,
											offset: [h[0] + P[0], h[1] + P[1]],
											my: i.my,
											at: i.at,
											within: v,
											elem: f,
										});
								}),
								i.using &&
									(l = function (t) {
										var n = u.left - L.left,
											l = n + a - s,
											h = u.top - L.top,
											c = h + g - r,
											p = {
												target: { element: W, left: u.left, top: u.top, width: a, height: g },
												element: { element: f, left: L.left, top: L.top, width: s, height: r },
												horizontal: l < 0 ? "left" : n > 0 ? "right" : "center",
												vertical: c < 0 ? "top" : h > 0 ? "bottom" : "middle",
											};
										(a < s && e(n + l) < a && (p.horizontal = "center"),
											g < r && e(h + c) < g && (p.vertical = "middle"),
											o(e(n), e(l)) > o(e(h), e(c))
												? (p.important = "horizontal")
												: (p.important = "vertical"),
											i.using.call(this, t, p));
									}),
								f.offset(t.extend(L, { using: l })));
						})
					);
				}),
				(t.ui.position = {
					fit: {
						left: function (t, i) {
							var e,
								n = i.within,
								l = n.isWindow ? n.scrollLeft : n.offset.left,
								f = n.width,
								s = t.left - i.collisionPosition.marginLeft,
								h = l - s,
								r = s + i.collisionWidth - f - l;
							i.collisionWidth > f
								? h > 0 && r <= 0
									? ((e = t.left + h + i.collisionWidth - f - l), (t.left += h - e))
									: (t.left = r > 0 && h <= 0 ? l : h > r ? l + f - i.collisionWidth : l)
								: h > 0
									? (t.left += h)
									: r > 0
										? (t.left -= r)
										: (t.left = o(t.left - s, t.left));
						},
						top: function (t, i) {
							var e,
								n = i.within,
								l = n.isWindow ? n.scrollTop : n.offset.top,
								f = i.within.height,
								s = t.top - i.collisionPosition.marginTop,
								h = l - s,
								r = s + i.collisionHeight - f - l;
							i.collisionHeight > f
								? h > 0 && r <= 0
									? ((e = t.top + h + i.collisionHeight - f - l), (t.top += h - e))
									: (t.top = r > 0 && h <= 0 ? l : h > r ? l + f - i.collisionHeight : l)
								: h > 0
									? (t.top += h)
									: r > 0
										? (t.top -= r)
										: (t.top = o(t.top - s, t.top));
						},
					},
					flip: {
						left: function (t, i) {
							var o,
								n,
								l = i.within,
								f = l.offset.left + l.scrollLeft,
								s = l.width,
								h = l.isWindow ? l.scrollLeft : l.offset.left,
								r = t.left - i.collisionPosition.marginLeft,
								c = r - h,
								p = r + i.collisionWidth - s - h,
								a = "left" === i.my[0] ? -i.elemWidth : "right" === i.my[0] ? i.elemWidth : 0,
								d = "left" === i.at[0] ? i.targetWidth : "right" === i.at[0] ? -i.targetWidth : 0,
								g = -2 * i.offset[0];
							c < 0
								? ((o = t.left + a + d + g + i.collisionWidth - s - f) < 0 || o < e(c)) &&
									(t.left += a + d + g)
								: p > 0 &&
									((n = t.left - i.collisionPosition.marginLeft + a + d + g - h) > 0 || e(n) < p) &&
									(t.left += a + d + g);
						},
						top: function (t, i) {
							var o,
								n,
								l = i.within,
								f = l.offset.top + l.scrollTop,
								s = l.height,
								h = l.isWindow ? l.scrollTop : l.offset.top,
								r = t.top - i.collisionPosition.marginTop,
								c = r - h,
								p = r + i.collisionHeight - s - h,
								a = "top" === i.my[1] ? -i.elemHeight : "bottom" === i.my[1] ? i.elemHeight : 0,
								d = "top" === i.at[1] ? i.targetHeight : "bottom" === i.at[1] ? -i.targetHeight : 0,
								g = -2 * i.offset[1];
							c < 0
								? ((n = t.top + a + d + g + i.collisionHeight - s - f) < 0 || n < e(c)) &&
									(t.top += a + d + g)
								: p > 0 &&
									((o = t.top - i.collisionPosition.marginTop + a + d + g - h) > 0 || e(o) < p) &&
									(t.top += a + d + g);
						},
					},
					flipfit: {
						left: function () {
							(t.ui.position.flip.left.apply(this, arguments),
								t.ui.position.fit.left.apply(this, arguments));
						},
						top: function () {
							(t.ui.position.flip.top.apply(this, arguments),
								t.ui.position.fit.top.apply(this, arguments));
						},
					},
				}));
		})(),
		t.ui.position
	);
});

/*!
 * jQuery UI Widget 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (t) {
	"use strict";
	"function" == typeof define && define.amd ? define(["jquery", "./version"], t) : t(jQuery);
})(function (t) {
	"use strict";
	var e,
		i = 0,
		s = Array.prototype.hasOwnProperty,
		n = Array.prototype.slice;
	return (
		(t.cleanData =
			((e = t.cleanData),
			function (i) {
				var s, n, o;
				for (o = 0; null != (n = i[o]); o++)
					(s = t._data(n, "events")) && s.remove && t(n).triggerHandler("remove");
				e(i);
			})),
		(t.widget = function (e, i, s) {
			var n,
				o,
				a,
				r = {},
				l = e.split(".")[0],
				u = l + "-" + (e = e.split(".")[1]);
			return (
				s || ((s = i), (i = t.Widget)),
				Array.isArray(s) && (s = t.extend.apply(null, [{}].concat(s))),
				(t.expr.pseudos[u.toLowerCase()] = function (e) {
					return !!t.data(e, u);
				}),
				(t[l] = t[l] || {}),
				(n = t[l][e]),
				(o = t[l][e] =
					function (t, e) {
						if (!this || !this._createWidget) return new o(t, e);
						arguments.length && this._createWidget(t, e);
					}),
				t.extend(o, n, { version: s.version, _proto: t.extend({}, s), _childConstructors: [] }),
				((a = new i()).options = t.widget.extend({}, a.options)),
				t.each(s, function (t, e) {
					r[t] =
						"function" == typeof e
							? (function () {
									function s() {
										return i.prototype[t].apply(this, arguments);
									}
									function n(e) {
										return i.prototype[t].apply(this, e);
									}
									return function () {
										var t,
											i = this._super,
											o = this._superApply;
										return (
											(this._super = s),
											(this._superApply = n),
											(t = e.apply(this, arguments)),
											(this._super = i),
											(this._superApply = o),
											t
										);
									};
								})()
							: e;
				}),
				(o.prototype = t.widget.extend(
					a,
					{ widgetEventPrefix: (n && a.widgetEventPrefix) || e },
					r,
					{ constructor: o, namespace: l, widgetName: e, widgetFullName: u }
				)),
				n
					? (t.each(n._childConstructors, function (e, i) {
							var s = i.prototype;
							t.widget(s.namespace + "." + s.widgetName, o, i._proto);
						}),
						delete n._childConstructors)
					: i._childConstructors.push(o),
				t.widget.bridge(e, o),
				o
			);
		}),
		(t.widget.extend = function (e) {
			for (var i, o, a = n.call(arguments, 1), r = 0, l = a.length; r < l; r++)
				for (i in a[r])
					((o = a[r][i]),
						s.call(a[r], i) &&
							void 0 !== o &&
							(t.isPlainObject(o)
								? (e[i] = t.isPlainObject(e[i])
										? t.widget.extend({}, e[i], o)
										: t.widget.extend({}, o))
								: (e[i] = o)));
			return e;
		}),
		(t.widget.bridge = function (e, i) {
			var s = i.prototype.widgetFullName || e;
			t.fn[e] = function (o) {
				var a = "string" == typeof o,
					r = n.call(arguments, 1),
					l = this;
				return (
					a
						? this.length || "instance" !== o
							? this.each(function () {
									var i,
										n = t.data(this, s);
									return "instance" === o
										? ((l = n), !1)
										: n
											? "function" != typeof n[o] || "_" === o.charAt(0)
												? t.error("no such method '" + o + "' for " + e + " widget instance")
												: (i = n[o].apply(n, r)) !== n && void 0 !== i
													? ((l = i && i.jquery ? l.pushStack(i.get()) : i), !1)
													: void 0
											: t.error(
													"cannot call methods on " +
														e +
														" prior to initialization; attempted to call method '" +
														o +
														"'"
												);
								})
							: (l = void 0)
						: (r.length && (o = t.widget.extend.apply(null, [o].concat(r))),
							this.each(function () {
								var e = t.data(this, s);
								e ? (e.option(o || {}), e._init && e._init()) : t.data(this, s, new i(o, this));
							})),
					l
				);
			};
		}),
		(t.Widget = function () {}),
		(t.Widget._childConstructors = []),
		(t.Widget.prototype = {
			widgetName: "widget",
			widgetEventPrefix: "",
			defaultElement: "<div>",
			options: { classes: {}, disabled: !1, create: null },
			_createWidget: function (e, s) {
				((s = t(s || this.defaultElement || this)[0]),
					(this.element = t(s)),
					(this.uuid = i++),
					(this.eventNamespace = "." + this.widgetName + this.uuid),
					(this.bindings = t()),
					(this.hoverable = t()),
					(this.focusable = t()),
					(this.classesElementLookup = {}),
					s !== this &&
						(t.data(s, this.widgetFullName, this),
						this._on(!0, this.element, {
							remove: function (t) {
								t.target === s && this.destroy();
							},
						}),
						(this.document = t(s.style ? s.ownerDocument : s.document || s)),
						(this.window = t(this.document[0].defaultView || this.document[0].parentWindow))),
					(this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e)),
					this._create(),
					this.options.disabled && this._setOptionDisabled(this.options.disabled),
					this._trigger("create", null, this._getCreateEventData()),
					this._init());
			},
			_getCreateOptions: function () {
				return {};
			},
			_getCreateEventData: t.noop,
			_create: t.noop,
			_init: t.noop,
			destroy: function () {
				var e = this;
				(this._destroy(),
					t.each(this.classesElementLookup, function (t, i) {
						e._removeClass(i, t);
					}),
					this.element.off(this.eventNamespace).removeData(this.widgetFullName),
					this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),
					this.bindings.off(this.eventNamespace));
			},
			_destroy: t.noop,
			widget: function () {
				return this.element;
			},
			option: function (e, i) {
				var s,
					n,
					o,
					a = e;
				if (0 === arguments.length) return t.widget.extend({}, this.options);
				if ("string" == typeof e)
					if (((a = {}), (s = e.split(".")), (e = s.shift()), s.length)) {
						for (n = a[e] = t.widget.extend({}, this.options[e]), o = 0; o < s.length - 1; o++)
							((n[s[o]] = n[s[o]] || {}), (n = n[s[o]]));
						if (((e = s.pop()), 1 === arguments.length)) return void 0 === n[e] ? null : n[e];
						n[e] = i;
					} else {
						if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
						a[e] = i;
					}
				return (this._setOptions(a), this);
			},
			_setOptions: function (t) {
				var e;
				for (e in t) this._setOption(e, t[e]);
				return this;
			},
			_setOption: function (t, e) {
				return (
					"classes" === t && this._setOptionClasses(e),
					(this.options[t] = e),
					"disabled" === t && this._setOptionDisabled(e),
					this
				);
			},
			_setOptionClasses: function (e) {
				var i, s, n;
				for (i in e)
					((n = this.classesElementLookup[i]),
						e[i] !== this.options.classes[i] &&
							n &&
							n.length &&
							((s = t(n.get())),
							this._removeClass(n, i),
							s.addClass(this._classes({ element: s, keys: i, classes: e, add: !0 }))));
			},
			_setOptionDisabled: function (t) {
				(this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!t),
					t &&
						(this._removeClass(this.hoverable, null, "ui-state-hover"),
						this._removeClass(this.focusable, null, "ui-state-focus")));
			},
			enable: function () {
				return this._setOptions({ disabled: !1 });
			},
			disable: function () {
				return this._setOptions({ disabled: !0 });
			},
			_classes: function (e) {
				var i = [],
					s = this;
				function n() {
					var i = [];
					(e.element.each(function (e, n) {
						t
							.map(s.classesElementLookup, function (t) {
								return t;
							})
							.some(function (t) {
								return t.is(n);
							}) || i.push(n);
					}),
						s._on(t(i), { remove: "_untrackClassesElement" }));
				}
				function o(o, a) {
					var r, l;
					for (l = 0; l < o.length; l++)
						((r = s.classesElementLookup[o[l]] || t()),
							e.add
								? (n(), (r = t(t.uniqueSort(r.get().concat(e.element.get())))))
								: (r = t(r.not(e.element).get())),
							(s.classesElementLookup[o[l]] = r),
							i.push(o[l]),
							a && e.classes[o[l]] && i.push(e.classes[o[l]]));
				}
				return (
					(e = t.extend({ element: this.element, classes: this.options.classes || {} }, e)).keys &&
						o(e.keys.match(/\S+/g) || [], !0),
					e.extra && o(e.extra.match(/\S+/g) || []),
					i.join(" ")
				);
			},
			_untrackClassesElement: function (e) {
				var i = this;
				(t.each(i.classesElementLookup, function (s, n) {
					-1 !== t.inArray(e.target, n) && (i.classesElementLookup[s] = t(n.not(e.target).get()));
				}),
					this._off(t(e.target)));
			},
			_removeClass: function (t, e, i) {
				return this._toggleClass(t, e, i, !1);
			},
			_addClass: function (t, e, i) {
				return this._toggleClass(t, e, i, !0);
			},
			_toggleClass: function (t, e, i, s) {
				s = "boolean" == typeof s ? s : i;
				var n = "string" == typeof t || null === t,
					o = { extra: n ? e : i, keys: n ? t : e, element: n ? this.element : t, add: s };
				return (o.element.toggleClass(this._classes(o), s), this);
			},
			_on: function (e, i, s) {
				var n,
					o = this;
				("boolean" != typeof e && ((s = i), (i = e), (e = !1)),
					s
						? ((i = n = t(i)), (this.bindings = this.bindings.add(i)))
						: ((s = i), (i = this.element), (n = this.widget())),
					t.each(s, function (s, a) {
						function r() {
							if (e || (!0 !== o.options.disabled && !t(this).hasClass("ui-state-disabled")))
								return ("string" == typeof a ? o[a] : a).apply(o, arguments);
						}
						"string" != typeof a && (r.guid = a.guid = a.guid || r.guid || t.guid++);
						var l = s.match(/^([\w:-]*)\s*(.*)$/),
							u = l[1] + o.eventNamespace,
							h = l[2];
						h ? n.on(u, h, r) : i.on(u, r);
					}));
			},
			_off: function (e, i) {
				((i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace),
					e.off(i),
					(this.bindings = t(this.bindings.not(e).get())),
					(this.focusable = t(this.focusable.not(e).get())),
					(this.hoverable = t(this.hoverable.not(e).get())));
			},
			_delay: function (t, e) {
				var i = this;
				return setTimeout(
					function () {
						return ("string" == typeof t ? i[t] : t).apply(i, arguments);
					},
					e || 0
				);
			},
			_hoverable: function (e) {
				((this.hoverable = this.hoverable.add(e)),
					this._on(e, {
						mouseenter: function (e) {
							this._addClass(t(e.currentTarget), null, "ui-state-hover");
						},
						mouseleave: function (e) {
							this._removeClass(t(e.currentTarget), null, "ui-state-hover");
						},
					}));
			},
			_focusable: function (e) {
				((this.focusable = this.focusable.add(e)),
					this._on(e, {
						focusin: function (e) {
							this._addClass(t(e.currentTarget), null, "ui-state-focus");
						},
						focusout: function (e) {
							this._removeClass(t(e.currentTarget), null, "ui-state-focus");
						},
					}));
			},
			_trigger: function (e, i, s) {
				var n,
					o,
					a = this.options[e];
				if (
					((s = s || {}),
					((i = t.Event(i)).type = (
						e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e
					).toLowerCase()),
					(i.target = this.element[0]),
					(o = i.originalEvent))
				)
					for (n in o) n in i || (i[n] = o[n]);
				return (
					this.element.trigger(i, s),
					!(
						("function" == typeof a && !1 === a.apply(this.element[0], [i].concat(s))) ||
						i.isDefaultPrevented()
					)
				);
			},
		}),
		t.each({ show: "fadeIn", hide: "fadeOut" }, function (e, i) {
			t.Widget.prototype["_" + e] = function (s, n, o) {
				var a;
				"string" == typeof n && (n = { effect: n });
				var r = n ? (!0 === n || "number" == typeof n ? i : n.effect || i) : e;
				("number" == typeof (n = n || {}) ? (n = { duration: n }) : !0 === n && (n = {}),
					(a = !t.isEmptyObject(n)),
					(n.complete = o),
					n.delay && s.delay(n.delay),
					a && t.effects && t.effects.effect[r]
						? s[e](n)
						: r !== e && s[r]
							? s[r](n.duration, n.easing, o)
							: s.queue(function (i) {
									(t(this)[e](), o && o.call(s[0]), i());
								}));
			};
		}),
		t.widget
	);
});

/*!
 * jQuery UI Menu 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd
		? define(
				[
					"jquery",
					"../keycode",
					"../position",
					"../safe-active-element",
					"../unique-id",
					"../version",
					"../widget",
				],
				e
			)
		: e(jQuery);
})(function (e) {
	"use strict";
	return e.widget("ui.menu", {
		version: "1.13.2",
		defaultElement: "<ul>",
		delay: 300,
		options: {
			icons: { submenu: "ui-icon-caret-1-e" },
			items: "> *",
			menus: "ul",
			position: { my: "left top", at: "right top" },
			role: "menu",
			blur: null,
			focus: null,
			select: null,
		},
		_create: function () {
			((this.activeMenu = this.element),
				(this.mouseHandled = !1),
				(this.lastMousePosition = { x: null, y: null }),
				this.element.uniqueId().attr({ role: this.options.role, tabIndex: 0 }),
				this._addClass("ui-menu", "ui-widget ui-widget-content"),
				this._on({
					"mousedown .ui-menu-item": function (e) {
						(e.preventDefault(), this._activateItem(e));
					},
					"click .ui-menu-item": function (t) {
						var i = e(t.target),
							s = e(e.ui.safeActiveElement(this.document[0]));
						!this.mouseHandled &&
							i.not(".ui-state-disabled").length &&
							(this.select(t),
							t.isPropagationStopped() || (this.mouseHandled = !0),
							i.has(".ui-menu").length
								? this.expand(t)
								: !this.element.is(":focus") &&
									s.closest(".ui-menu").length &&
									(this.element.trigger("focus", [!0]),
									this.active &&
										1 === this.active.parents(".ui-menu").length &&
										clearTimeout(this.timer)));
					},
					"mouseenter .ui-menu-item": "_activateItem",
					"mousemove .ui-menu-item": "_activateItem",
					mouseleave: "collapseAll",
					"mouseleave .ui-menu": "collapseAll",
					focus: function (e, t) {
						var i = this.active || this._menuItems().first();
						t || this.focus(e, i);
					},
					blur: function (t) {
						this._delay(function () {
							!e.contains(this.element[0], e.ui.safeActiveElement(this.document[0])) &&
								this.collapseAll(t);
						});
					},
					keydown: "_keydown",
				}),
				this.refresh(),
				this._on(this.document, {
					click: function (e) {
						(this._closeOnDocumentClick(e) && this.collapseAll(e, !0), (this.mouseHandled = !1));
					},
				}));
		},
		_activateItem: function (t) {
			if (
				!this.previousFilter &&
				(t.clientX !== this.lastMousePosition.x || t.clientY !== this.lastMousePosition.y)
			) {
				this.lastMousePosition = { x: t.clientX, y: t.clientY };
				var i = e(t.target).closest(".ui-menu-item"),
					s = e(t.currentTarget);
				i[0] === s[0] &&
					(s.is(".ui-state-active") ||
						(this._removeClass(s.siblings().children(".ui-state-active"), null, "ui-state-active"),
						this.focus(t, s)));
			}
		},
		_destroy: function () {
			var t = this.element
				.find(".ui-menu-item")
				.removeAttr("role aria-disabled")
				.children(".ui-menu-item-wrapper")
				.removeUniqueId()
				.removeAttr("tabIndex role aria-haspopup");
			(this.element
				.removeAttr("aria-activedescendant")
				.find(".ui-menu")
				.addBack()
				.removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex")
				.removeUniqueId()
				.show(),
				t.children().each(function () {
					var t = e(this);
					t.data("ui-menu-submenu-caret") && t.remove();
				}));
		},
		_keydown: function (t) {
			var i,
				s,
				n,
				a,
				u = !0;
			switch (t.keyCode) {
				case e.ui.keyCode.PAGE_UP:
					this.previousPage(t);
					break;
				case e.ui.keyCode.PAGE_DOWN:
					this.nextPage(t);
					break;
				case e.ui.keyCode.HOME:
					this._move("first", "first", t);
					break;
				case e.ui.keyCode.END:
					this._move("last", "last", t);
					break;
				case e.ui.keyCode.UP:
					this.previous(t);
					break;
				case e.ui.keyCode.DOWN:
					this.next(t);
					break;
				case e.ui.keyCode.LEFT:
					this.collapse(t);
					break;
				case e.ui.keyCode.RIGHT:
					this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
					break;
				case e.ui.keyCode.ENTER:
				case e.ui.keyCode.SPACE:
					this._activate(t);
					break;
				case e.ui.keyCode.ESCAPE:
					this.collapse(t);
					break;
				default:
					((u = !1),
						(s = this.previousFilter || ""),
						(a = !1),
						(n =
							t.keyCode >= 96 && t.keyCode <= 105
								? (t.keyCode - 96).toString()
								: String.fromCharCode(t.keyCode)),
						clearTimeout(this.filterTimer),
						n === s ? (a = !0) : (n = s + n),
						(i = this._filterMenuItems(n)),
						(i = a && -1 !== i.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : i)
							.length || ((n = String.fromCharCode(t.keyCode)), (i = this._filterMenuItems(n))),
						i.length
							? (this.focus(t, i),
								(this.previousFilter = n),
								(this.filterTimer = this._delay(
									function () {
										delete this.previousFilter;
									},
									1e3
								)))
							: delete this.previousFilter);
			}
			u && t.preventDefault();
		},
		_activate: function (e) {
			this.active &&
				!this.active.is(".ui-state-disabled") &&
				(this.active.children("[aria-haspopup='true']").length ? this.expand(e) : this.select(e));
		},
		refresh: function () {
			var t,
				i,
				s,
				n,
				a = this,
				u = this.options.icons.submenu,
				o = this.element.find(this.options.menus);
			(this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length),
				(i = o
					.filter(":not(.ui-menu)")
					.hide()
					.attr({ role: this.options.role, "aria-hidden": "true", "aria-expanded": "false" })
					.each(function () {
						var t = e(this),
							i = t.prev(),
							s = e("<span>").data("ui-menu-submenu-caret", !0);
						(a._addClass(s, "ui-menu-icon", "ui-icon " + u),
							i.attr("aria-haspopup", "true").prepend(s),
							t.attr("aria-labelledby", i.attr("id")));
					})),
				this._addClass(i, "ui-menu", "ui-widget ui-widget-content ui-front"),
				(t = o.add(this.element).find(this.options.items)).not(".ui-menu-item").each(function () {
					var t = e(this);
					a._isDivider(t) && a._addClass(t, "ui-menu-divider", "ui-widget-content");
				}),
				(n = (s = t.not(".ui-menu-item, .ui-menu-divider"))
					.children()
					.not(".ui-menu")
					.uniqueId()
					.attr({ tabIndex: -1, role: this._itemRole() })),
				this._addClass(s, "ui-menu-item")._addClass(n, "ui-menu-item-wrapper"),
				t.filter(".ui-state-disabled").attr("aria-disabled", "true"),
				this.active && !e.contains(this.element[0], this.active[0]) && this.blur());
		},
		_itemRole: function () {
			return { menu: "menuitem", listbox: "option" }[this.options.role];
		},
		_setOption: function (e, t) {
			if ("icons" === e) {
				var i = this.element.find(".ui-menu-icon");
				this._removeClass(i, null, this.options.icons.submenu)._addClass(i, null, t.submenu);
			}
			this._super(e, t);
		},
		_setOptionDisabled: function (e) {
			(this._super(e),
				this.element.attr("aria-disabled", String(e)),
				this._toggleClass(null, "ui-state-disabled", !!e));
		},
		focus: function (e, t) {
			var i, s, n;
			(this.blur(e, e && "focus" === e.type),
				this._scrollIntoView(t),
				(this.active = t.first()),
				(s = this.active.children(".ui-menu-item-wrapper")),
				this._addClass(s, null, "ui-state-active"),
				this.options.role && this.element.attr("aria-activedescendant", s.attr("id")),
				(n = this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper")),
				this._addClass(n, null, "ui-state-active"),
				e && "keydown" === e.type
					? this._close()
					: (this.timer = this._delay(
							function () {
								this._close();
							},
							this.delay
						)),
				(i = t.children(".ui-menu")).length && e && /^mouse/.test(e.type) && this._startOpening(i),
				(this.activeMenu = t.parent()),
				this._trigger("focus", e, { item: t }));
		},
		_scrollIntoView: function (t) {
			var i, s, n, a, u, o;
			this._hasScroll() &&
				((i = parseFloat(e.css(this.activeMenu[0], "borderTopWidth")) || 0),
				(s = parseFloat(e.css(this.activeMenu[0], "paddingTop")) || 0),
				(n = t.offset().top - this.activeMenu.offset().top - i - s),
				(a = this.activeMenu.scrollTop()),
				(u = this.activeMenu.height()),
				(o = t.outerHeight()),
				n < 0
					? this.activeMenu.scrollTop(a + n)
					: n + o > u && this.activeMenu.scrollTop(a + n - u + o));
		},
		blur: function (e, t) {
			(t || clearTimeout(this.timer),
				this.active &&
					(this._removeClass(
						this.active.children(".ui-menu-item-wrapper"),
						null,
						"ui-state-active"
					),
					this._trigger("blur", e, { item: this.active }),
					(this.active = null)));
		},
		_startOpening: function (e) {
			(clearTimeout(this.timer),
				"true" === e.attr("aria-hidden") &&
					(this.timer = this._delay(
						function () {
							(this._close(), this._open(e));
						},
						this.delay
					)));
		},
		_open: function (t) {
			var i = e.extend({ of: this.active }, this.options.position);
			(clearTimeout(this.timer),
				this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true"),
				t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i));
		},
		collapseAll: function (t, i) {
			(clearTimeout(this.timer),
				(this.timer = this._delay(
					function () {
						var s = i ? this.element : e(t && t.target).closest(this.element.find(".ui-menu"));
						(s.length || (s = this.element),
							this._close(s),
							this.blur(t),
							this._removeClass(s.find(".ui-state-active"), null, "ui-state-active"),
							(this.activeMenu = s));
					},
					i ? 0 : this.delay
				)));
		},
		_close: function (e) {
			(e || (e = this.active ? this.active.parent() : this.element),
				e.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false"));
		},
		_closeOnDocumentClick: function (t) {
			return !e(t.target).closest(".ui-menu").length;
		},
		_isDivider: function (e) {
			return !/[^\-\u2014\u2013\s]/.test(e.text());
		},
		collapse: function (e) {
			var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
			t && t.length && (this._close(), this.focus(e, t));
		},
		expand: function (e) {
			var t = this.active && this._menuItems(this.active.children(".ui-menu")).first();
			t &&
				t.length &&
				(this._open(t.parent()),
				this._delay(function () {
					this.focus(e, t);
				}));
		},
		next: function (e) {
			this._move("next", "first", e);
		},
		previous: function (e) {
			this._move("prev", "last", e);
		},
		isFirstItem: function () {
			return this.active && !this.active.prevAll(".ui-menu-item").length;
		},
		isLastItem: function () {
			return this.active && !this.active.nextAll(".ui-menu-item").length;
		},
		_menuItems: function (e) {
			return (e || this.element).find(this.options.items).filter(".ui-menu-item");
		},
		_move: function (e, t, i) {
			var s;
			(this.active &&
				(s =
					"first" === e || "last" === e
						? this.active["first" === e ? "prevAll" : "nextAll"](".ui-menu-item").last()
						: this.active[e + "All"](".ui-menu-item").first()),
				(s && s.length && this.active) || (s = this._menuItems(this.activeMenu)[t]()),
				this.focus(i, s));
		},
		nextPage: function (t) {
			var i, s, n;
			this.active
				? this.isLastItem() ||
					(this._hasScroll()
						? ((s = this.active.offset().top),
							(n = this.element.innerHeight()),
							0 === e.fn.jquery.indexOf("3.2.") &&
								(n += this.element[0].offsetHeight - this.element.outerHeight()),
							this.active.nextAll(".ui-menu-item").each(function () {
								return (i = e(this)).offset().top - s - n < 0;
							}),
							this.focus(t, i))
						: this.focus(t, this._menuItems(this.activeMenu)[this.active ? "last" : "first"]()))
				: this.next(t);
		},
		previousPage: function (t) {
			var i, s, n;
			this.active
				? this.isFirstItem() ||
					(this._hasScroll()
						? ((s = this.active.offset().top),
							(n = this.element.innerHeight()),
							0 === e.fn.jquery.indexOf("3.2.") &&
								(n += this.element[0].offsetHeight - this.element.outerHeight()),
							this.active.prevAll(".ui-menu-item").each(function () {
								return (i = e(this)).offset().top - s + n > 0;
							}),
							this.focus(t, i))
						: this.focus(t, this._menuItems(this.activeMenu).first()))
				: this.next(t);
		},
		_hasScroll: function () {
			return this.element.outerHeight() < this.element.prop("scrollHeight");
		},
		select: function (t) {
			this.active = this.active || e(t.target).closest(".ui-menu-item");
			var i = { item: this.active };
			(this.active.has(".ui-menu").length || this.collapseAll(t, !0),
				this._trigger("select", t, i));
		},
		_filterMenuItems: function (t) {
			var i = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
				s = new RegExp("^" + i, "i");
			return this.activeMenu
				.find(this.options.items)
				.filter(".ui-menu-item")
				.filter(function () {
					return s.test(
						String.prototype.trim.call(e(this).children(".ui-menu-item-wrapper").text())
					);
				});
		},
	});
});

/*!
 * jQuery UI Autocomplete 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (e) {
	"use strict";
	"function" == typeof define && define.amd
		? define(
				[
					"jquery",
					"./menu",
					"../keycode",
					"../position",
					"../safe-active-element",
					"../version",
					"../widget",
				],
				e
			)
		: e(jQuery);
})(function (e) {
	"use strict";
	return (
		e.widget("ui.autocomplete", {
			version: "1.13.2",
			defaultElement: "<input>",
			options: {
				appendTo: null,
				autoFocus: !1,
				delay: 300,
				minLength: 1,
				position: { my: "left top", at: "left bottom", collision: "none" },
				source: null,
				change: null,
				close: null,
				focus: null,
				open: null,
				response: null,
				search: null,
				select: null,
			},
			requestIndex: 0,
			pending: 0,
			liveRegionTimer: null,
			_create: function () {
				var t,
					i,
					s,
					n = this.element[0].nodeName.toLowerCase(),
					o = "textarea" === n,
					u = "input" === n;
				((this.isMultiLine = o || (!u && this._isContentEditable(this.element))),
					(this.valueMethod = this.element[o || u ? "val" : "text"]),
					(this.isNewMenu = !0),
					this._addClass("ui-autocomplete-input"),
					this.element.attr("autocomplete", "off"),
					this._on(this.element, {
						keydown: function (n) {
							if (this.element.prop("readOnly")) return ((t = !0), (s = !0), void (i = !0));
							((t = !1), (s = !1), (i = !1));
							var o = e.ui.keyCode;
							switch (n.keyCode) {
								case o.PAGE_UP:
									((t = !0), this._move("previousPage", n));
									break;
								case o.PAGE_DOWN:
									((t = !0), this._move("nextPage", n));
									break;
								case o.UP:
									((t = !0), this._keyEvent("previous", n));
									break;
								case o.DOWN:
									((t = !0), this._keyEvent("next", n));
									break;
								case o.ENTER:
									this.menu.active && ((t = !0), n.preventDefault(), this.menu.select(n));
									break;
								case o.TAB:
									this.menu.active && this.menu.select(n);
									break;
								case o.ESCAPE:
									this.menu.element.is(":visible") &&
										(this.isMultiLine || this._value(this.term), this.close(n), n.preventDefault());
									break;
								default:
									((i = !0), this._searchTimeout(n));
							}
						},
						keypress: function (s) {
							if (t)
								return (
									(t = !1),
									void (
										(this.isMultiLine && !this.menu.element.is(":visible")) ||
										s.preventDefault()
									)
								);
							if (!i) {
								var n = e.ui.keyCode;
								switch (s.keyCode) {
									case n.PAGE_UP:
										this._move("previousPage", s);
										break;
									case n.PAGE_DOWN:
										this._move("nextPage", s);
										break;
									case n.UP:
										this._keyEvent("previous", s);
										break;
									case n.DOWN:
										this._keyEvent("next", s);
								}
							}
						},
						input: function (e) {
							if (s) return ((s = !1), void e.preventDefault());
							this._searchTimeout(e);
						},
						focus: function () {
							((this.selectedItem = null), (this.previous = this._value()));
						},
						blur: function (e) {
							(clearTimeout(this.searching), this.close(e), this._change(e));
						},
					}),
					this._initSource(),
					(this.menu = e("<ul>")
						.appendTo(this._appendTo())
						.menu({ role: null })
						.hide()
						.attr({ unselectable: "on" })
						.menu("instance")),
					this._addClass(this.menu.element, "ui-autocomplete", "ui-front"),
					this._on(this.menu.element, {
						mousedown: function (e) {
							e.preventDefault();
						},
						menufocus: function (t, i) {
							var s, n;
							if (
								this.isNewMenu &&
								((this.isNewMenu = !1), t.originalEvent && /^mouse/.test(t.originalEvent.type))
							)
								return (
									this.menu.blur(),
									void this.document.one("mousemove", function () {
										e(t.target).trigger(t.originalEvent);
									})
								);
							((n = i.item.data("ui-autocomplete-item")),
								!1 !== this._trigger("focus", t, { item: n }) &&
									t.originalEvent &&
									/^key/.test(t.originalEvent.type) &&
									this._value(n.value),
								(s = i.item.attr("aria-label") || n.value) &&
									String.prototype.trim.call(s).length &&
									(clearTimeout(this.liveRegionTimer),
									(this.liveRegionTimer = this._delay(
										function () {
											this.liveRegion.html(e("<div>").text(s));
										},
										100
									))));
						},
						menuselect: function (t, i) {
							var s = i.item.data("ui-autocomplete-item"),
								n = this.previous;
							(this.element[0] !== e.ui.safeActiveElement(this.document[0]) &&
								(this.element.trigger("focus"),
								(this.previous = n),
								this._delay(function () {
									((this.previous = n), (this.selectedItem = s));
								})),
								!1 !== this._trigger("select", t, { item: s }) && this._value(s.value),
								(this.term = this._value()),
								this.close(t),
								(this.selectedItem = s));
						},
					}),
					(this.liveRegion = e("<div>", {
						role: "status",
						"aria-live": "assertive",
						"aria-relevant": "additions",
					}).appendTo(this.document[0].body)),
					this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"),
					this._on(this.window, {
						beforeunload: function () {
							this.element.removeAttr("autocomplete");
						},
					}));
			},
			_destroy: function () {
				(clearTimeout(this.searching),
					this.element.removeAttr("autocomplete"),
					this.menu.element.remove(),
					this.liveRegion.remove());
			},
			_setOption: function (e, t) {
				(this._super(e, t),
					"source" === e && this._initSource(),
					"appendTo" === e && this.menu.element.appendTo(this._appendTo()),
					"disabled" === e && t && this.xhr && this.xhr.abort());
			},
			_isEventTargetInWidget: function (t) {
				var i = this.menu.element[0];
				return t.target === this.element[0] || t.target === i || e.contains(i, t.target);
			},
			_closeOnClickOutside: function (e) {
				this._isEventTargetInWidget(e) || this.close();
			},
			_appendTo: function () {
				var t = this.options.appendTo;
				return (
					t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)),
					(t && t[0]) || (t = this.element.closest(".ui-front, dialog")),
					t.length || (t = this.document[0].body),
					t
				);
			},
			_initSource: function () {
				var t,
					i,
					s = this;
				Array.isArray(this.options.source)
					? ((t = this.options.source),
						(this.source = function (i, s) {
							s(e.ui.autocomplete.filter(t, i.term));
						}))
					: "string" == typeof this.options.source
						? ((i = this.options.source),
							(this.source = function (t, n) {
								(s.xhr && s.xhr.abort(),
									(s.xhr = e.ajax({
										url: i,
										data: t,
										dataType: "json",
										success: function (e) {
											n(e);
										},
										error: function () {
											n([]);
										},
									})));
							}))
						: (this.source = this.options.source);
			},
			_searchTimeout: function (e) {
				(clearTimeout(this.searching),
					(this.searching = this._delay(
						function () {
							var t = this.term === this._value(),
								i = this.menu.element.is(":visible"),
								s = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
							(t && (!t || i || s)) || ((this.selectedItem = null), this.search(null, e));
						},
						this.options.delay
					)));
			},
			search: function (e, t) {
				return (
					(e = null != e ? e : this._value()),
					(this.term = this._value()),
					e.length < this.options.minLength
						? this.close(t)
						: !1 !== this._trigger("search", t)
							? this._search(e)
							: void 0
				);
			},
			_search: function (e) {
				(this.pending++,
					this._addClass("ui-autocomplete-loading"),
					(this.cancelSearch = !1),
					this.source({ term: e }, this._response()));
			},
			_response: function () {
				var e = ++this.requestIndex;
				return function (t) {
					(e === this.requestIndex && this.__response(t),
						this.pending--,
						this.pending || this._removeClass("ui-autocomplete-loading"));
				}.bind(this);
			},
			__response: function (e) {
				(e && (e = this._normalize(e)),
					this._trigger("response", null, { content: e }),
					!this.options.disabled && e && e.length && !this.cancelSearch
						? (this._suggest(e), this._trigger("open"))
						: this._close());
			},
			close: function (e) {
				((this.cancelSearch = !0), this._close(e));
			},
			_close: function (e) {
				(this._off(this.document, "mousedown"),
					this.menu.element.is(":visible") &&
						(this.menu.element.hide(),
						this.menu.blur(),
						(this.isNewMenu = !0),
						this._trigger("close", e)));
			},
			_change: function (e) {
				this.previous !== this._value() && this._trigger("change", e, { item: this.selectedItem });
			},
			_normalize: function (t) {
				return t.length && t[0].label && t[0].value
					? t
					: e.map(t, function (t) {
							return "string" == typeof t
								? { label: t, value: t }
								: e.extend({}, t, { label: t.label || t.value, value: t.value || t.label });
						});
			},
			_suggest: function (t) {
				var i = this.menu.element.empty();
				(this._renderMenu(i, t),
					(this.isNewMenu = !0),
					this.menu.refresh(),
					i.show(),
					this._resizeMenu(),
					i.position(e.extend({ of: this.element }, this.options.position)),
					this.options.autoFocus && this.menu.next(),
					this._on(this.document, { mousedown: "_closeOnClickOutside" }));
			},
			_resizeMenu: function () {
				var e = this.menu.element;
				e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()));
			},
			_renderMenu: function (t, i) {
				var s = this;
				e.each(i, function (e, i) {
					s._renderItemData(t, i);
				});
			},
			_renderItemData: function (e, t) {
				return this._renderItem(e, t).data("ui-autocomplete-item", t);
			},
			_renderItem: function (t, i) {
				return e("<li>").append(e("<div>").text(i.label)).appendTo(t);
			},
			_move: function (e, t) {
				if (this.menu.element.is(":visible"))
					return (this.menu.isFirstItem() && /^previous/.test(e)) ||
						(this.menu.isLastItem() && /^next/.test(e))
						? (this.isMultiLine || this._value(this.term), void this.menu.blur())
						: void this.menu[e](t);
				this.search(null, t);
			},
			widget: function () {
				return this.menu.element;
			},
			_value: function () {
				return this.valueMethod.apply(this.element, arguments);
			},
			_keyEvent: function (e, t) {
				(this.isMultiLine && !this.menu.element.is(":visible")) ||
					(this._move(e, t), t.preventDefault());
			},
			_isContentEditable: function (e) {
				if (!e.length) return !1;
				var t = e.prop("contentEditable");
				return "inherit" === t ? this._isContentEditable(e.parent()) : "true" === t;
			},
		}),
		e.extend(e.ui.autocomplete, {
			escapeRegex: function (e) {
				return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
			},
			filter: function (t, i) {
				var s = new RegExp(e.ui.autocomplete.escapeRegex(i), "i");
				return e.grep(t, function (e) {
					return s.test(e.label || e.value || e);
				});
			},
		}),
		e.widget("ui.autocomplete", e.ui.autocomplete, {
			options: {
				messages: {
					noResults: "No search results.",
					results: function (e) {
						return (
							e +
							(e > 1 ? " results are" : " result is") +
							" available, use up and down arrow keys to navigate."
						);
					},
				},
			},
			__response: function (t) {
				var i;
				(this._superApply(arguments),
					this.options.disabled ||
						this.cancelSearch ||
						((i =
							t && t.length
								? this.options.messages.results(t.length)
								: this.options.messages.noResults),
						clearTimeout(this.liveRegionTimer),
						(this.liveRegionTimer = this._delay(
							function () {
								this.liveRegion.html(e("<div>").text(i));
							},
							100
						))));
			},
		}),
		e.ui.autocomplete
	);
});

/* @license MIT https://raw.githubusercontent.com/focus-trap/tabbable/v6.3.0/LICENSE */
/*!
 * tabbable 6.3.0
 * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
 */
!(function (t, e) {
	"object" == typeof exports && "undefined" != typeof module
		? e(exports)
		: "function" == typeof define && define.amd
			? define(["exports"], e)
			: ((t = "undefined" != typeof globalThis ? globalThis : t || self),
				(function () {
					var n = t.tabbable,
						o = (t.tabbable = {});
					(e(o),
						(o.noConflict = function () {
							return ((t.tabbable = n), o);
						}));
				})());
})(this, function (t) {
	"use strict";
	var e = [
			"input:not([inert])",
			"select:not([inert])",
			"textarea:not([inert])",
			"a[href]:not([inert])",
			"button:not([inert])",
			"[tabindex]:not(slot):not([inert])",
			"audio[controls]:not([inert])",
			"video[controls]:not([inert])",
			'[contenteditable]:not([contenteditable="false"]):not([inert])',
			"details>summary:first-of-type:not([inert])",
			"details:not([inert])",
		],
		n = e.join(","),
		o = "undefined" == typeof Element,
		r = o
			? function () {}
			: Element.prototype.matches ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.webkitMatchesSelector,
		i =
			!o && Element.prototype.getRootNode
				? function (t) {
						var e;
						return null == t || null === (e = t.getRootNode) || void 0 === e ? void 0 : e.call(t);
					}
				: function (t) {
						return null == t ? void 0 : t.ownerDocument;
					},
		a = function (t, e) {
			var n;
			void 0 === e && (e = !0);
			var o =
				null == t || null === (n = t.getAttribute) || void 0 === n ? void 0 : n.call(t, "inert");
			return "" === o || "true" === o || (e && t && a(t.parentNode));
		},
		l = function (t, e, o) {
			if (a(t)) return [];
			var i = Array.prototype.slice.apply(t.querySelectorAll(n));
			return (e && r.call(t, n) && i.unshift(t), (i = i.filter(o)));
		},
		u = function (t, e, o) {
			for (var i = [], l = Array.from(t); l.length; ) {
				var c = l.shift();
				if (!a(c, !1))
					if ("SLOT" === c.tagName) {
						var d = c.assignedElements(),
							f = d.length ? d : c.children,
							s = u(f, !0, o);
						o.flatten ? i.push.apply(i, s) : i.push({ scopeParent: c, candidates: s });
					} else {
						r.call(c, n) && o.filter(c) && (e || !t.includes(c)) && i.push(c);
						var p = c.shadowRoot || ("function" == typeof o.getShadowRoot && o.getShadowRoot(c)),
							h = !a(p, !1) && (!o.shadowRootFilter || o.shadowRootFilter(c));
						if (p && h) {
							var v = u(!0 === p ? c.children : p.children, !0, o);
							o.flatten ? i.push.apply(i, v) : i.push({ scopeParent: c, candidates: v });
						} else l.unshift.apply(l, c.children);
					}
			}
			return i;
		},
		c = function (t) {
			return !isNaN(parseInt(t.getAttribute("tabindex"), 10));
		},
		d = function (t) {
			if (!t) throw new Error("No node provided");
			return t.tabIndex < 0 &&
				(/^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) ||
					(function (t) {
						var e,
							n =
								null == t || null === (e = t.getAttribute) || void 0 === e
									? void 0
									: e.call(t, "contenteditable");
						return "" === n || "true" === n;
					})(t)) &&
				!c(t)
				? 0
				: t.tabIndex;
		},
		f = function (t, e) {
			return t.tabIndex === e.tabIndex
				? t.documentOrder - e.documentOrder
				: t.tabIndex - e.tabIndex;
		},
		s = function (t) {
			return "INPUT" === t.tagName;
		},
		p = function (t) {
			return (
				(function (t) {
					return s(t) && "radio" === t.type;
				})(t) &&
				!(function (t) {
					if (!t.name) return !0;
					var e,
						n = t.form || i(t),
						o = function (t) {
							return n.querySelectorAll('input[type="radio"][name="' + t + '"]');
						};
					if (
						"undefined" != typeof window &&
						void 0 !== window.CSS &&
						"function" == typeof window.CSS.escape
					)
						e = o(window.CSS.escape(t.name));
					else
						try {
							e = o(t.name);
						} catch (t) {
							return (
								console.error(
									"Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",
									t.message
								),
								!1
							);
						}
					var r = (function (t, e) {
						for (var n = 0; n < t.length; n++) if (t[n].checked && t[n].form === e) return t[n];
					})(e, t.form);
					return !r || r === t;
				})(t)
			);
		},
		h = function (t) {
			var e = t.getBoundingClientRect(),
				n = e.width,
				o = e.height;
			return 0 === n && 0 === o;
		},
		v = function (t, e) {
			var n = e.displayCheck,
				o = e.getShadowRoot;
			if ("full-native" === n && "checkVisibility" in t)
				return !t.checkVisibility({
					checkOpacity: !1,
					opacityProperty: !1,
					contentVisibilityAuto: !0,
					visibilityProperty: !0,
					checkVisibilityCSS: !0,
				});
			if ("hidden" === getComputedStyle(t).visibility) return !0;
			var a = r.call(t, "details>summary:first-of-type") ? t.parentElement : t;
			if (r.call(a, "details:not([open]) *")) return !0;
			if (n && "full" !== n && "full-native" !== n && "legacy-full" !== n) {
				if ("non-zero-area" === n) return h(t);
			} else {
				if ("function" == typeof o) {
					for (var l = t; t; ) {
						var u = t.parentElement,
							c = i(t);
						if (u && !u.shadowRoot && !0 === o(u)) return h(t);
						t = t.assignedSlot ? t.assignedSlot : u || c === t.ownerDocument ? u : c.host;
					}
					t = l;
				}
				if (
					(function (t) {
						var e,
							n,
							o,
							r,
							a = t && i(t),
							l = null === (e = a) || void 0 === e ? void 0 : e.host,
							u = !1;
						if (a && a !== t)
							for (
								u = !!(
									(null !== (n = l) &&
										void 0 !== n &&
										null !== (o = n.ownerDocument) &&
										void 0 !== o &&
										o.contains(l)) ||
									(null != t && null !== (r = t.ownerDocument) && void 0 !== r && r.contains(t))
								);
								!u && l;
							) {
								var c, d, f;
								u = !(
									null === (d = l = null === (c = a = i(l)) || void 0 === c ? void 0 : c.host) ||
									void 0 === d ||
									null === (f = d.ownerDocument) ||
									void 0 === f ||
									!f.contains(l)
								);
							}
						return u;
					})(t)
				)
					return !t.getClientRects().length;
				if ("legacy-full" !== n) return !0;
			}
			return !1;
		},
		b = function (t, e) {
			return !(
				e.disabled ||
				a(e) ||
				(function (t) {
					return s(t) && "hidden" === t.type;
				})(e) ||
				v(e, t) ||
				(function (t) {
					return (
						"DETAILS" === t.tagName &&
						Array.prototype.slice.apply(t.children).some(function (t) {
							return "SUMMARY" === t.tagName;
						})
					);
				})(e) ||
				(function (t) {
					if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
						for (var e = t.parentElement; e; ) {
							if ("FIELDSET" === e.tagName && e.disabled) {
								for (var n = 0; n < e.children.length; n++) {
									var o = e.children.item(n);
									if ("LEGEND" === o.tagName)
										return !!r.call(e, "fieldset[disabled] *") || !o.contains(t);
								}
								return !0;
							}
							e = e.parentElement;
						}
					return !1;
				})(e)
			);
		},
		y = function (t, e) {
			return !(p(e) || d(e) < 0 || !b(t, e));
		},
		m = function (t) {
			var e = parseInt(t.getAttribute("tabindex"), 10);
			return !!(isNaN(e) || e >= 0);
		},
		g = function (t) {
			var e = [],
				n = [];
			return (
				t.forEach(function (t, o) {
					var r = !!t.scopeParent,
						i = r ? t.scopeParent : t,
						a = (function (t, e) {
							var n = d(t);
							return n < 0 && e && !c(t) ? 0 : n;
						})(i, r),
						l = r ? g(t.candidates) : i;
					0 === a
						? r
							? e.push.apply(e, l)
							: e.push(i)
						: n.push({ documentOrder: o, tabIndex: a, item: t, isScope: r, content: l });
				}),
				n
					.sort(f)
					.reduce(
						function (t, e) {
							return (e.isScope ? t.push.apply(t, e.content) : t.push(e.content), t);
						},
						[]
					)
					.concat(e)
			);
		},
		w = e.concat("iframe").join(",");
	((t.focusable = function (t, e) {
		return (e = e || {}).getShadowRoot
			? u([t], e.includeContainer, {
					filter: b.bind(null, e),
					flatten: !0,
					getShadowRoot: e.getShadowRoot,
				})
			: l(t, e.includeContainer, b.bind(null, e));
	}),
		(t.getTabIndex = d),
		(t.isFocusable = function (t, e) {
			if (((e = e || {}), !t)) throw new Error("No node provided");
			return !1 !== r.call(t, w) && b(e, t);
		}),
		(t.isTabbable = function (t, e) {
			if (((e = e || {}), !t)) throw new Error("No node provided");
			return !1 !== r.call(t, n) && y(e, t);
		}),
		(t.tabbable = function (t, e) {
			var n;
			return (
				(n = (e = e || {}).getShadowRoot
					? u([t], e.includeContainer, {
							filter: y.bind(null, e),
							flatten: !1,
							getShadowRoot: e.getShadowRoot,
							shadowRootFilter: m,
						})
					: l(t, e.includeContainer, y.bind(null, e))),
				g(n)
			);
		}));
});
/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function () {
	function r(e, n, t) {
		function o(i, f) {
			if (!n[i]) {
				if (!e[i]) {
					var c = "function" == typeof require && require;
					if (!f && c) return c(i, !0);
					if (u) return u(i, !0);
					var a = new Error("Cannot find module '" + i + "'");
					throw ((a.code = "MODULE_NOT_FOUND"), a);
				}
				var p = (n[i] = { exports: {} });
				e[i][0].call(
					p.exports,
					function (r) {
						var n = e[i][1][r];
						return o(n || r);
					},
					p,
					p.exports,
					r,
					e,
					n,
					t
				);
			}
			return n[i].exports;
		}
		for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
		return o;
	}
	return r;
})()(
	{
		1: [
			function (require, module, exports) {
				"use strict";
				(function ($, Drupal, once) {
					"use strict";
					Drupal.behaviors.bne_common_common = {
						attach: function (context) {
							const htmlElement = document.documentElement;
							once("js-header", "#js-header").forEach(function (element) {
								const header = element;
								const headerNavButtonToggle = document.getElementById(
									"js-header__nav-button-toggle"
								);
								const headerOverlay = document.getElementById("js-header__overlay");
								let isHeaderNavsOpened = false;
								let previousKnownScrollPosition = window.scrollY;
								let lastKnownScrollPosition = 0;
								let tickingScroll = false;
								const accountMenuButtonToggle = document.getElementById(
									"js-header__account-button"
								);
								const accountMenu = document.getElementById("js-header__account-menu");
								let isAccountMenuOpened = false;
								function headerOnScroll() {
									lastKnownScrollPosition = window.scrollY;
									if (!tickingScroll) {
										window.requestAnimationFrame(function () {
											switchHeaderOnScroll(lastKnownScrollPosition);
											tickingScroll = false;
										});
										tickingScroll = true;
									}
								}
								function switchHeaderOnScroll(scrollYPos) {
									if (scrollYPos === 0) {
										htmlElement.classList.remove("js-html--header-small");
										htmlElement.classList.remove("js-html--header__top--hidden");
									} else {
										htmlElement.classList.add("js-html--header-small");
										if (scrollYPos < previousKnownScrollPosition)
											htmlElement.classList.remove("js-html--header__top--hidden");
										else htmlElement.classList.add("js-html--header__top--hidden");
									}
									previousKnownScrollPosition = scrollYPos;
								}
								function toggleHeader() {
									if (
										accountMenu &&
										accountMenu.classList.contains("js-header__account-menu--opened")
									)
										toggleAccountMenu();
									isHeaderNavsOpened = !isHeaderNavsOpened;
									htmlElement.classList.toggle("js-html-header--overflow-visible");
									headerNavButtonToggle.setAttribute("aria-expanded", isHeaderNavsOpened);
									htmlElement.classList.toggle("js-html-header--opened");
									htmlElement.classList.toggle("js-html--no-scroll");
								}
								document.addEventListener("scroll", headerOnScroll, false);
								switchHeaderOnScroll(window.scrollY);
								if (headerNavButtonToggle)
									headerNavButtonToggle.addEventListener("click", function () {
										toggleHeader();
									});
								headerOverlay.addEventListener("click", function () {
									if (htmlElement.classList.contains("js-html-header--opened")) toggleHeader();
								});
								function toggleAccountMenu() {
									if (htmlElement.classList.contains("js-html-header--opened")) toggleHeader();
									isAccountMenuOpened = !isAccountMenuOpened;
									htmlElement.classList.toggle("js-html-header--overflow-visible");
									accountMenuButtonToggle.setAttribute("aria-expanded", isAccountMenuOpened);
									accountMenu.classList.toggle("js-header__account-menu--opened");
								}
								if (accountMenuButtonToggle)
									accountMenuButtonToggle.addEventListener("click", function () {
										toggleAccountMenu();
									});
								if (accountMenu && accountMenuButtonToggle)
									document.addEventListener("click", function (event) {
										let isClickInsideAccountMenuButtonToggle = accountMenuButtonToggle.contains(
											event.target
										);
										if (!isClickInsideAccountMenuButtonToggle)
											if (accountMenu.classList.contains("js-header__account-menu--opened")) {
												let isClickInsideAccountMenu = accountMenu.contains(event.target);
												if (!isClickInsideAccountMenu) toggleAccountMenu();
											}
									});
							});
							enquire.register("screen and (min-width: 992px)", {
								match: function () {
									if (htmlElement.classList.contains("js-html-header--opened")) toggleHeader();
								},
							});
							once("footer", ".footer").forEach(function (element) {
								const footerPopin = document.getElementById("js-footer__actions-popin");
								const footerPopinOverlay = document.getElementById(
									"js-footer__actions-popin-overlay"
								);
								const footerPopinButtonsOpen = document.querySelectorAll(
									".js-footer__actions-popin-button-open"
								);
								const footerPopinButtonClose = document.getElementById(
									"js-footer__actions-popin-button-close"
								);
								let isFooterPopinOpened = false;
								function toggleFooterPopin() {
									isFooterPopinOpened = !isFooterPopinOpened;
									if (footerPopinButtonsOpen)
										footerPopinButtonsOpen.forEach(function (footerPopinButtonOpen) {
											footerPopinButtonOpen.setAttribute("aria-expanded", isFooterPopinOpened);
										});
									if (footerPopinButtonClose)
										footerPopinButtonClose.setAttribute("aria-expanded", isFooterPopinOpened);
									footerPopin.classList.toggle("js-footer__actions-popin--opened");
									htmlElement.classList.toggle("js-html--no-scroll");
								}
								if (footerPopinButtonsOpen)
									footerPopinButtonsOpen.forEach(function (footerPopinButtonOpen) {
										footerPopinButtonOpen.addEventListener("click", function () {
											toggleFooterPopin();
										});
									});
								if (footerPopinButtonClose)
									footerPopinButtonClose.addEventListener("click", function () {
										toggleFooterPopin();
									});
								if (footerPopinOverlay)
									footerPopinOverlay.addEventListener("click", function () {
										toggleFooterPopin();
									});
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{},
		],
		2: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once, drupalSettings) {
					Drupal.behaviors.axeptio = {
						attach: function (context, settings) {
							once("initAxeptio", "body", context).forEach(function () {
								const clientId = drupalSettings.axeptio.clientId;
								const cookiesVersion = drupalSettings.axeptio.cookiesVersion;
								const googleTagManagerId = drupalSettings.axeptio.googleTagManagerId;
								const userCookiesDomain = drupalSettings.axeptio.userCookiesDomain;
								window.axeptioSettings = {
									clientId,
									cookiesVersion,
									userCookiesDomain,
									googleConsentMode: {
										default: {
											analytics_storage: "denied",
											ad_storage: "denied",
											ad_user_data: "denied",
											ad_personalization: "denied",
											wait_for_update: 500,
										},
									},
								};
								(function loadAxeptioSDK(d, s) {
									const t = d.getElementsByTagName(s)[0];
									const e = d.createElement(s);
									e.async = true;
									e.src = "//static.axept.io/sdk.js";
									t.parentNode.insertBefore(e, t);
								})(document, "script");
								const lang = document.documentElement.getAttribute("lang");
								let vendorNames = {
									youtube: "YouTube",
									youtube_API: "YouTube JS API",
									modio: "Mod.io",
									google_recaptcha: "reCAPTCHA",
								};
								const trans = {
									fr: { allow: "Autoriser", fallback: "est désactivé." },
									en: { allow: "Allow", fallback: "is disabled." },
									de: { allow: "Erlauben", fallback: "ist deaktiviert." },
									it: { allow: "Consenti", fallback: "è disattivato." },
									es: { allow: "Permitir", fallback: "está deshabilitado." },
									ar: { allow: "Allow", fallback: "is disabled." },
									ru: { allow: "Позволить", fallback: "Деактивирован." },
								};
								let previousChoices;
								let gtmTagLoaded = false;
								let youTubeJSApiTagLoaded = false;
								let recaptchaTagLoaded = false;
								function getElementWidth(element) {
									return element.getAttribute("width") || element.clientWidth;
								}
								function getElementHeight(element) {
									return element.getAttribute("height") || element.clientHeight;
								}
								document.querySelectorAll("[data-requires-vendor-consent]").forEach((el) => {
									const vendor = el.getAttribute("data-requires-vendor-consent");
									const parentEl = el.parentElement;
									if (!parentEl.classList.contains("js-bne-cookies-consent")) {
										if (parentEl.classList.contains("responsive-iframe-container"))
											parentEl.classList.add("bne-cookies-consent", "js-bne-cookies-consent");
										else {
											const currentParentEl = el.parentNode;
											const newParentEl = document.createElement("div");
											newParentEl.classList.add("bne-cookies-consent", "js-bne-cookies-consent");
											let elWidth = getElementWidth(el);
											newParentEl.setAttribute("width", elWidth);
											let elHeight = getElementHeight(el);
											newParentEl.setAttribute("height", elHeight);
											let elStyle = el.getAttribute("style");
											if (elStyle) newParentEl.setAttribute("style", elStyle);
											currentParentEl.replaceChild(newParentEl, el);
											newParentEl.appendChild(el);
										}
										if (!vendorNames[vendor])
											vendorNames[vendor] = vendor[0].toUpperCase() + vendor.slice(1);
										el.insertAdjacentHTML(
											"afterend",
											`<div data-hide-on-vendor-consent="${vendor}" class="bne-cookies-consent__overlay">${vendorNames[vendor]} ${trans[lang]["fallback"]}<button type="button" class="bne-btn bne-cookies-consent__cta" onclick="window.axeptioHandleVendors({'${vendor}': true})">${trans[lang]["allow"]}</button></div>`
										);
									}
								});
								function loadGTMTag(loadedOnce) {
									if (!loadedOnce) {
										window.dataLayer = window.dataLayer || [];
										window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
										const firstScriptTag = document.getElementsByTagName("script")[0];
										const tag = document.createElement("script");
										tag.async = true;
										tag.src = "https://www.googletagmanager.com/gtm.js?id=".concat(
											googleTagManagerId
										);
										firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
										gtmTagLoaded = true;
									}
								}
								function loadYouTubeJSApiTag(loadedOnce) {
									if (!loadedOnce) {
										const tag = document.createElement("script");
										const firstScriptTag = document.getElementsByTagName("script")[0];
										tag.src = "https://www.youtube.com/iframe_api";
										firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
										youTubeJSApiTagLoaded = true;
									}
								}
								function loadRecaptchaTag(loadedOnce) {
									if (!loadedOnce) {
										const tag = document.createElement("script");
										const firstScriptTag = document.getElementsByTagName("script")[0];
										tag.async = true;
										tag.defer = true;
										tag.src = "https://www.google.com/recaptcha/api.js";
										firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
										recaptchaTagLoaded = true;
									}
								}
								function loadDrimifyTag() {
									return new Promise((resolve, reject) => {
										const tag = document.createElement("script");
										const firstScriptTag = document.getElementsByTagName("script")[0];
										tag.src = "https://cdn-apps.drimify.com/prod/widget/index.js";
										tag.type = "text/javascript";
										tag.onload = resolve;
										tag.onerror = reject;
										firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
									});
								}
								function initDrimifyWidget(el) {
									let widget = DigitaService.Widget.Create({
										element: el.id,
										autoscroll: el.dataset.autoscroll === "true",
										engine: el.dataset.engine,
										fixed: false,
										height: ["auto"],
										sharingurl: el.dataset.sharingurl,
										width: el.dataset.width,
									});
									widget.load();
								}
								function cleanChoicesMap(vendorsMap) {
									let googleConsentModeMap;
									vendorsMap.delete("$$token");
									vendorsMap.delete("$$date");
									vendorsMap.delete("$$cookiesVersion");
									vendorsMap.delete("$$completed");
									vendorsMap.delete("axeptio");
									vendorsMap.delete("Matomo");
									vendorsMap.delete("matomo");
									vendorsMap.delete("BNE_REDEEM_SERVER");
									vendorsMap.delete("BNE_CLOSEDBETA_SERVER");
									vendorsMap.delete("BNE_Identity_server");
									vendorsMap.delete("BNE_Identity_server_user_connecter");
									if (vendorsMap.has("$$googleConsentMode")) {
										googleConsentModeMap = new Map(
											Object.entries(vendorsMap.get("$$googleConsentMode"))
										);
										vendorsMap.delete("$$googleConsentMode");
									}
									return new Map([...vendorsMap, ...googleConsentModeMap]);
								}
								function reloadPageIfNewlyRefusedVendor(previousChoicesMap, choicesMap) {
									choicesMap.forEach(function (value, key) {
										let previousValue = previousChoicesMap.get(key);
										if (
											(value === false || value === undefined || value === "denied") &&
											(previousValue === true || previousValue === "granted")
										)
											window.location.reload();
									});
								}
								(window._axcb = window._axcb || []).push(function (sdk) {
									sdk.on("cookies:complete", function (choices) {
										if (choices.googletagmanager) loadGTMTag(gtmTagLoaded);
										document.querySelectorAll("[data-requires-vendor-consent]").forEach((el) => {
											const vendor = el.getAttribute("data-requires-vendor-consent");
											if (choices[vendor]) {
												if (!el.hasAttribute("src") && el.hasAttribute("data-src"))
													el.setAttribute("src", el.getAttribute("data-src"));
												switch (vendor) {
													case "youtube_API":
														loadYouTubeJSApiTag(youTubeJSApiTagLoaded);
														break;
													case "modio":
														window.addEventListener("message", (e) => {
															if (el.getAttribute("src").includes(e.origin)) {
																if (Number.isInteger(e.data?.modioHeight)) {
																	el.parentNode.style.height = "auto";
																	el.style.height = `${e.data.modioHeight}px`;
																}
																if (e.data?.modioScrollToTop) el.scrollIntoView();
															}
														});
														break;
													case "google_recaptcha":
														loadRecaptchaTag(recaptchaTagLoaded);
														break;
													case "drimify":
														if (!el.hasAttribute("data-init"))
															loadDrimifyTag()
																.then(() => {
																	initDrimifyWidget(el);
																	el.setAttribute("data-init", "true");
																})
																.catch((error) => {
																	console.error("Drimify script loading failed: ", error);
																});
														break;
												}
											}
										});
										document.querySelectorAll("[data-hide-on-vendor-consent]").forEach((el) => {
											const vendor = el.getAttribute("data-hide-on-vendor-consent");
											el.style.display = choices[vendor] ? "none" : "flex";
										});
										if (!previousChoices) previousChoices = choices;
										else {
											let previousChoicesMap = cleanChoicesMap(
												new Map(Object.entries(previousChoices))
											);
											let choicesMap = cleanChoicesMap(new Map(Object.entries(choices)));
											reloadPageIfNewlyRefusedVendor(previousChoicesMap, choicesMap);
											previousChoices = choices;
										}
									});
								});
							});
						},
					};
				})(Drupal, once, drupalSettings);
			},
			{},
		],
		3: [
			function (require, module, exports) {
				"use strict";
				require("./gdpr");
				require("./common");
			},
			{ "./common": 1, "./gdpr": 2 },
		],
	},
	{},
	[3]
);
/* @license MIT http://opensource.org/licenses/mit-license.php */
/*! Select2 4.0.13 | https://github.com/select2/select2/blob/master/LICENSE.md */
!(function (n) {
	"function" == typeof define && define.amd
		? define(["jquery"], n)
		: "object" == typeof module && module.exports
			? (module.exports = function (e, t) {
					return (
						void 0 === t &&
							(t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)),
						n(t),
						t
					);
				})
			: n(jQuery);
})(function (u) {
	var e = (function () {
			if (u && u.fn && u.fn.select2 && u.fn.select2.amd) var e = u.fn.select2.amd;
			var t, n, r, h, o, s, f, g, m, v, y, _, i, a, b;
			function w(e, t) {
				return i.call(e, t);
			}
			function l(e, t) {
				var n,
					r,
					i,
					o,
					s,
					a,
					l,
					c,
					u,
					d,
					p,
					h = t && t.split("/"),
					f = y.map,
					g = (f && f["*"]) || {};
				if (e) {
					for (
						s = (e = e.split("/")).length - 1,
							y.nodeIdCompat && b.test(e[s]) && (e[s] = e[s].replace(b, "")),
							"." === e[0].charAt(0) && h && (e = h.slice(0, h.length - 1).concat(e)),
							u = 0;
						u < e.length;
						u++
					)
						if ("." === (p = e[u])) (e.splice(u, 1), (u -= 1));
						else if (".." === p) {
							if (0 === u || (1 === u && ".." === e[2]) || ".." === e[u - 1]) continue;
							0 < u && (e.splice(u - 1, 2), (u -= 2));
						}
					e = e.join("/");
				}
				if ((h || g) && f) {
					for (u = (n = e.split("/")).length; 0 < u; u -= 1) {
						if (((r = n.slice(0, u).join("/")), h))
							for (d = h.length; 0 < d; d -= 1)
								if ((i = (i = f[h.slice(0, d).join("/")]) && i[r])) {
									((o = i), (a = u));
									break;
								}
						if (o) break;
						!l && g && g[r] && ((l = g[r]), (c = u));
					}
					(!o && l && ((o = l), (a = c)), o && (n.splice(0, a, o), (e = n.join("/"))));
				}
				return e;
			}
			function A(t, n) {
				return function () {
					var e = a.call(arguments, 0);
					return (
						"string" != typeof e[0] && 1 === e.length && e.push(null), s.apply(h, e.concat([t, n]))
					);
				};
			}
			function x(t) {
				return function (e) {
					m[t] = e;
				};
			}
			function D(e) {
				if (w(v, e)) {
					var t = v[e];
					(delete v[e], (_[e] = !0), o.apply(h, t));
				}
				if (!w(m, e) && !w(_, e)) throw new Error("No " + e);
				return m[e];
			}
			function c(e) {
				var t,
					n = e ? e.indexOf("!") : -1;
				return (-1 < n && ((t = e.substring(0, n)), (e = e.substring(n + 1, e.length))), [t, e]);
			}
			function S(e) {
				return e ? c(e) : [];
			}
			return (
				(e && e.requirejs) ||
					(e ? (n = e) : (e = {}),
					(m = {}),
					(v = {}),
					(y = {}),
					(_ = {}),
					(i = Object.prototype.hasOwnProperty),
					(a = [].slice),
					(b = /\.js$/),
					(f = function (e, t) {
						var n,
							r = c(e),
							i = r[0],
							o = t[1];
						return (
							(e = r[1]),
							i && (n = D((i = l(i, o)))),
							i
								? (e =
										n && n.normalize
											? n.normalize(
													e,
													(function (t) {
														return function (e) {
															return l(e, t);
														};
													})(o)
												)
											: l(e, o))
								: ((i = (r = c((e = l(e, o))))[0]), (e = r[1]), i && (n = D(i))),
							{ f: i ? i + "!" + e : e, n: e, pr: i, p: n }
						);
					}),
					(g = {
						require: function (e) {
							return A(e);
						},
						exports: function (e) {
							var t = m[e];
							return void 0 !== t ? t : (m[e] = {});
						},
						module: function (e) {
							return {
								id: e,
								uri: "",
								exports: m[e],
								config: (function (e) {
									return function () {
										return (y && y.config && y.config[e]) || {};
									};
								})(e),
							};
						},
					}),
					(o = function (e, t, n, r) {
						var i,
							o,
							s,
							a,
							l,
							c,
							u,
							d = [],
							p = typeof n;
						if (((c = S((r = r || e))), "undefined" == p || "function" == p)) {
							for (
								t = !t.length && n.length ? ["require", "exports", "module"] : t, l = 0;
								l < t.length;
								l += 1
							)
								if ("require" === (o = (a = f(t[l], c)).f)) d[l] = g.require(e);
								else if ("exports" === o) ((d[l] = g.exports(e)), (u = !0));
								else if ("module" === o) i = d[l] = g.module(e);
								else if (w(m, o) || w(v, o) || w(_, o)) d[l] = D(o);
								else {
									if (!a.p) throw new Error(e + " missing " + o);
									(a.p.load(a.n, A(r, !0), x(o), {}), (d[l] = m[o]));
								}
							((s = n ? n.apply(m[e], d) : void 0),
								e &&
									(i && i.exports !== h && i.exports !== m[e]
										? (m[e] = i.exports)
										: (s === h && u) || (m[e] = s)));
						} else e && (m[e] = n);
					}),
					(t =
						n =
						s =
							function (e, t, n, r, i) {
								if ("string" == typeof e) return g[e] ? g[e](t) : D(f(e, S(t)).f);
								if (!e.splice) {
									if (((y = e).deps && s(y.deps, y.callback), !t)) return;
									t.splice ? ((e = t), (t = n), (n = null)) : (e = h);
								}
								return (
									(t = t || function () {}),
									"function" == typeof n && ((n = r), (r = i)),
									r
										? o(h, e, t, n)
										: setTimeout(function () {
												o(h, e, t, n);
											}, 4),
									s
								);
							}),
					(s.config = function (e) {
						return s(e);
					}),
					(t._defined = m),
					((r = function (e, t, n) {
						if ("string" != typeof e)
							throw new Error("See almond README: incorrect module build, no module name");
						(t.splice || ((n = t), (t = [])), w(m, e) || w(v, e) || (v[e] = [e, t, n]));
					}).amd = { jQuery: !0 }),
					(e.requirejs = t),
					(e.require = n),
					(e.define = r)),
				e.define("almond", function () {}),
				e.define("jquery", [], function () {
					var e = u || $;
					return (
						null == e &&
							console &&
							console.error &&
							console.error(
								"Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."
							),
						e
					);
				}),
				e.define("select2/utils", ["jquery"], function (o) {
					var i = {};
					function u(e) {
						var t = e.prototype,
							n = [];
						for (var r in t) {
							"function" == typeof t[r] && "constructor" !== r && n.push(r);
						}
						return n;
					}
					((i.Extend = function (e, t) {
						var n = {}.hasOwnProperty;
						function r() {
							this.constructor = e;
						}
						for (var i in t) n.call(t, i) && (e[i] = t[i]);
						return (
							(r.prototype = t.prototype), (e.prototype = new r()), (e.__super__ = t.prototype), e
						);
					}),
						(i.Decorate = function (r, i) {
							var e = u(i),
								t = u(r);
							function o() {
								var e = Array.prototype.unshift,
									t = i.prototype.constructor.length,
									n = r.prototype.constructor;
								(0 < t &&
									(e.call(arguments, r.prototype.constructor), (n = i.prototype.constructor)),
									n.apply(this, arguments));
							}
							((i.displayName = r.displayName),
								(o.prototype = new (function () {
									this.constructor = o;
								})()));
							for (var n = 0; n < t.length; n++) {
								var s = t[n];
								o.prototype[s] = r.prototype[s];
							}
							function a(e) {
								var t = function () {};
								e in o.prototype && (t = o.prototype[e]);
								var n = i.prototype[e];
								return function () {
									return (Array.prototype.unshift.call(arguments, t), n.apply(this, arguments));
								};
							}
							for (var l = 0; l < e.length; l++) {
								var c = e[l];
								o.prototype[c] = a(c);
							}
							return o;
						}));
					function e() {
						this.listeners = {};
					}
					((e.prototype.on = function (e, t) {
						((this.listeners = this.listeners || {}),
							e in this.listeners ? this.listeners[e].push(t) : (this.listeners[e] = [t]));
					}),
						(e.prototype.trigger = function (e) {
							var t = Array.prototype.slice,
								n = t.call(arguments, 1);
							((this.listeners = this.listeners || {}),
								null == n && (n = []),
								0 === n.length && n.push({}),
								(n[0]._type = e) in this.listeners &&
									this.invoke(this.listeners[e], t.call(arguments, 1)),
								"*" in this.listeners && this.invoke(this.listeners["*"], arguments));
						}),
						(e.prototype.invoke = function (e, t) {
							for (var n = 0, r = e.length; n < r; n++) e[n].apply(this, t);
						}),
						(i.Observable = e),
						(i.generateChars = function (e) {
							for (var t = "", n = 0; n < e; n++) {
								t += Math.floor(36 * Math.random()).toString(36);
							}
							return t;
						}),
						(i.bind = function (e, t) {
							return function () {
								e.apply(t, arguments);
							};
						}),
						(i._convertData = function (e) {
							for (var t in e) {
								var n = t.split("-"),
									r = e;
								if (1 !== n.length) {
									for (var i = 0; i < n.length; i++) {
										var o = n[i];
										((o = o.substring(0, 1).toLowerCase() + o.substring(1)) in r || (r[o] = {}),
											i == n.length - 1 && (r[o] = e[t]),
											(r = r[o]));
									}
									delete e[t];
								}
							}
							return e;
						}),
						(i.hasScroll = function (e, t) {
							var n = o(t),
								r = t.style.overflowX,
								i = t.style.overflowY;
							return (
								(r !== i || ("hidden" !== i && "visible" !== i)) &&
								("scroll" === r ||
									"scroll" === i ||
									n.innerHeight() < t.scrollHeight ||
									n.innerWidth() < t.scrollWidth)
							);
						}),
						(i.escapeMarkup = function (e) {
							var t = {
								"\\": "&#92;",
								"&": "&amp;",
								"<": "&lt;",
								">": "&gt;",
								'"': "&quot;",
								"'": "&#39;",
								"/": "&#47;",
							};
							return "string" != typeof e
								? e
								: String(e).replace(/[&<>"'\/\\]/g, function (e) {
										return t[e];
									});
						}),
						(i.appendMany = function (e, t) {
							if ("1.7" === o.fn.jquery.substr(0, 3)) {
								var n = o();
								(o.map(t, function (e) {
									n = n.add(e);
								}),
									(t = n));
							}
							e.append(t);
						}),
						(i.__cache = {}));
					var n = 0;
					return (
						(i.GetUniqueElementId = function (e) {
							var t = e.getAttribute("data-select2-id");
							return (
								null == t &&
									(e.id
										? ((t = e.id), e.setAttribute("data-select2-id", t))
										: (e.setAttribute("data-select2-id", ++n), (t = n.toString()))),
								t
							);
						}),
						(i.StoreData = function (e, t, n) {
							var r = i.GetUniqueElementId(e);
							(i.__cache[r] || (i.__cache[r] = {}), (i.__cache[r][t] = n));
						}),
						(i.GetData = function (e, t) {
							var n = i.GetUniqueElementId(e);
							return t
								? i.__cache[n] && null != i.__cache[n][t]
									? i.__cache[n][t]
									: o(e).data(t)
								: i.__cache[n];
						}),
						(i.RemoveData = function (e) {
							var t = i.GetUniqueElementId(e);
							(null != i.__cache[t] && delete i.__cache[t], e.removeAttribute("data-select2-id"));
						}),
						i
					);
				}),
				e.define("select2/results", ["jquery", "./utils"], function (h, f) {
					function r(e, t, n) {
						((this.$element = e),
							(this.data = n),
							(this.options = t),
							r.__super__.constructor.call(this));
					}
					return (
						f.Extend(r, f.Observable),
						(r.prototype.render = function () {
							var e = h('<ul class="select2-results__options" role="listbox"></ul>');
							return (
								this.options.get("multiple") && e.attr("aria-multiselectable", "true"),
								(this.$results = e)
							);
						}),
						(r.prototype.clear = function () {
							this.$results.empty();
						}),
						(r.prototype.displayMessage = function (e) {
							var t = this.options.get("escapeMarkup");
							(this.clear(), this.hideLoading());
							var n = h(
									'<li role="alert" aria-live="assertive" class="select2-results__option"></li>'
								),
								r = this.options.get("translations").get(e.message);
							(n.append(t(r(e.args))),
								(n[0].className += " select2-results__message"),
								this.$results.append(n));
						}),
						(r.prototype.hideMessages = function () {
							this.$results.find(".select2-results__message").remove();
						}),
						(r.prototype.append = function (e) {
							this.hideLoading();
							var t = [];
							if (null != e.results && 0 !== e.results.length) {
								e.results = this.sort(e.results);
								for (var n = 0; n < e.results.length; n++) {
									var r = e.results[n],
										i = this.option(r);
									t.push(i);
								}
								this.$results.append(t);
							} else
								0 === this.$results.children().length &&
									this.trigger("results:message", { message: "noResults" });
						}),
						(r.prototype.position = function (e, t) {
							t.find(".select2-results").append(e);
						}),
						(r.prototype.sort = function (e) {
							return this.options.get("sorter")(e);
						}),
						(r.prototype.highlightFirstItem = function () {
							var e = this.$results.find(".select2-results__option[aria-selected]"),
								t = e.filter("[aria-selected=true]");
							(0 < t.length ? t.first().trigger("mouseenter") : e.first().trigger("mouseenter"),
								this.ensureHighlightVisible());
						}),
						(r.prototype.setClasses = function () {
							var t = this;
							this.data.current(function (e) {
								var r = h.map(e, function (e) {
									return e.id.toString();
								});
								t.$results.find(".select2-results__option[aria-selected]").each(function () {
									var e = h(this),
										t = f.GetData(this, "data"),
										n = "" + t.id;
									(null != t.element && t.element.selected) ||
									(null == t.element && -1 < h.inArray(n, r))
										? e.attr("aria-selected", "true")
										: e.attr("aria-selected", "false");
								});
							});
						}),
						(r.prototype.showLoading = function (e) {
							this.hideLoading();
							var t = {
									disabled: !0,
									loading: !0,
									text: this.options.get("translations").get("searching")(e),
								},
								n = this.option(t);
							((n.className += " loading-results"), this.$results.prepend(n));
						}),
						(r.prototype.hideLoading = function () {
							this.$results.find(".loading-results").remove();
						}),
						(r.prototype.option = function (e) {
							var t = document.createElement("li");
							t.className = "select2-results__option";
							var n = { role: "option", "aria-selected": "false" },
								r =
									window.Element.prototype.matches ||
									window.Element.prototype.msMatchesSelector ||
									window.Element.prototype.webkitMatchesSelector;
							for (var i in (((null != e.element && r.call(e.element, ":disabled")) ||
								(null == e.element && e.disabled)) &&
								(delete n["aria-selected"], (n["aria-disabled"] = "true")),
							null == e.id && delete n["aria-selected"],
							null != e._resultId && (t.id = e._resultId),
							e.title && (t.title = e.title),
							e.children &&
								((n.role = "group"), (n["aria-label"] = e.text), delete n["aria-selected"]),
							n)) {
								var o = n[i];
								t.setAttribute(i, o);
							}
							if (e.children) {
								var s = h(t),
									a = document.createElement("strong");
								a.className = "select2-results__group";
								h(a);
								this.template(e, a);
								for (var l = [], c = 0; c < e.children.length; c++) {
									var u = e.children[c],
										d = this.option(u);
									l.push(d);
								}
								var p = h("<ul></ul>", {
									class: "select2-results__options select2-results__options--nested",
								});
								(p.append(l), s.append(a), s.append(p));
							} else this.template(e, t);
							return (f.StoreData(t, "data", e), t);
						}),
						(r.prototype.bind = function (t, e) {
							var l = this,
								n = t.id + "-results";
							(this.$results.attr("id", n),
								t.on("results:all", function (e) {
									(l.clear(),
										l.append(e.data),
										t.isOpen() && (l.setClasses(), l.highlightFirstItem()));
								}),
								t.on("results:append", function (e) {
									(l.append(e.data), t.isOpen() && l.setClasses());
								}),
								t.on("query", function (e) {
									(l.hideMessages(), l.showLoading(e));
								}),
								t.on("select", function () {
									t.isOpen() &&
										(l.setClasses(), l.options.get("scrollAfterSelect") && l.highlightFirstItem());
								}),
								t.on("unselect", function () {
									t.isOpen() &&
										(l.setClasses(), l.options.get("scrollAfterSelect") && l.highlightFirstItem());
								}),
								t.on("open", function () {
									(l.$results.attr("aria-expanded", "true"),
										l.$results.attr("aria-hidden", "false"),
										l.setClasses(),
										l.ensureHighlightVisible());
								}),
								t.on("close", function () {
									(l.$results.attr("aria-expanded", "false"),
										l.$results.attr("aria-hidden", "true"),
										l.$results.removeAttr("aria-activedescendant"));
								}),
								t.on("results:toggle", function () {
									var e = l.getHighlightedResults();
									0 !== e.length && e.trigger("mouseup");
								}),
								t.on("results:select", function () {
									var e = l.getHighlightedResults();
									if (0 !== e.length) {
										var t = f.GetData(e[0], "data");
										"true" == e.attr("aria-selected")
											? l.trigger("close", {})
											: l.trigger("select", { data: t });
									}
								}),
								t.on("results:previous", function () {
									var e = l.getHighlightedResults(),
										t = l.$results.find("[aria-selected]"),
										n = t.index(e);
									if (!(n <= 0)) {
										var r = n - 1;
										0 === e.length && (r = 0);
										var i = t.eq(r);
										i.trigger("mouseenter");
										var o = l.$results.offset().top,
											s = i.offset().top,
											a = l.$results.scrollTop() + (s - o);
										0 === r ? l.$results.scrollTop(0) : s - o < 0 && l.$results.scrollTop(a);
									}
								}),
								t.on("results:next", function () {
									var e = l.getHighlightedResults(),
										t = l.$results.find("[aria-selected]"),
										n = t.index(e) + 1;
									if (!(n >= t.length)) {
										var r = t.eq(n);
										r.trigger("mouseenter");
										var i = l.$results.offset().top + l.$results.outerHeight(!1),
											o = r.offset().top + r.outerHeight(!1),
											s = l.$results.scrollTop() + o - i;
										0 === n ? l.$results.scrollTop(0) : i < o && l.$results.scrollTop(s);
									}
								}),
								t.on("results:focus", function (e) {
									e.element.addClass("select2-results__option--highlighted");
								}),
								t.on("results:message", function (e) {
									l.displayMessage(e);
								}),
								h.fn.mousewheel &&
									this.$results.on("mousewheel", function (e) {
										var t = l.$results.scrollTop(),
											n = l.$results.get(0).scrollHeight - t + e.deltaY,
											r = 0 < e.deltaY && t - e.deltaY <= 0,
											i = e.deltaY < 0 && n <= l.$results.height();
										r
											? (l.$results.scrollTop(0), e.preventDefault(), e.stopPropagation())
											: i &&
												(l.$results.scrollTop(l.$results.get(0).scrollHeight - l.$results.height()),
												e.preventDefault(),
												e.stopPropagation());
									}),
								this.$results.on(
									"mouseup",
									".select2-results__option[aria-selected]",
									function (e) {
										var t = h(this),
											n = f.GetData(this, "data");
										"true" !== t.attr("aria-selected")
											? l.trigger("select", { originalEvent: e, data: n })
											: l.options.get("multiple")
												? l.trigger("unselect", { originalEvent: e, data: n })
												: l.trigger("close", {});
									}
								),
								this.$results.on(
									"mouseenter",
									".select2-results__option[aria-selected]",
									function (e) {
										var t = f.GetData(this, "data");
										(l.getHighlightedResults().removeClass("select2-results__option--highlighted"),
											l.trigger("results:focus", { data: t, element: h(this) }));
									}
								));
						}),
						(r.prototype.getHighlightedResults = function () {
							return this.$results.find(".select2-results__option--highlighted");
						}),
						(r.prototype.destroy = function () {
							this.$results.remove();
						}),
						(r.prototype.ensureHighlightVisible = function () {
							var e = this.getHighlightedResults();
							if (0 !== e.length) {
								var t = this.$results.find("[aria-selected]").index(e),
									n = this.$results.offset().top,
									r = e.offset().top,
									i = this.$results.scrollTop() + (r - n),
									o = r - n;
								((i -= 2 * e.outerHeight(!1)),
									t <= 2
										? this.$results.scrollTop(0)
										: (o > this.$results.outerHeight() || o < 0) && this.$results.scrollTop(i));
							}
						}),
						(r.prototype.template = function (e, t) {
							var n = this.options.get("templateResult"),
								r = this.options.get("escapeMarkup"),
								i = n(e, t);
							null == i
								? (t.style.display = "none")
								: "string" == typeof i
									? (t.innerHTML = r(i))
									: h(t).append(i);
						}),
						r
					);
				}),
				e.define("select2/keys", [], function () {
					return {
						BACKSPACE: 8,
						TAB: 9,
						ENTER: 13,
						SHIFT: 16,
						CTRL: 17,
						ALT: 18,
						ESC: 27,
						SPACE: 32,
						PAGE_UP: 33,
						PAGE_DOWN: 34,
						END: 35,
						HOME: 36,
						LEFT: 37,
						UP: 38,
						RIGHT: 39,
						DOWN: 40,
						DELETE: 46,
					};
				}),
				e.define("select2/selection/base", ["jquery", "../utils", "../keys"], function (n, r, i) {
					function o(e, t) {
						((this.$element = e), (this.options = t), o.__super__.constructor.call(this));
					}
					return (
						r.Extend(o, r.Observable),
						(o.prototype.render = function () {
							var e = n(
								'<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>'
							);
							return (
								(this._tabindex = 0),
								null != r.GetData(this.$element[0], "old-tabindex")
									? (this._tabindex = r.GetData(this.$element[0], "old-tabindex"))
									: null != this.$element.attr("tabindex") &&
										(this._tabindex = this.$element.attr("tabindex")),
								e.attr("title", this.$element.attr("title")),
								e.attr("tabindex", this._tabindex),
								e.attr("aria-disabled", "false"),
								(this.$selection = e)
							);
						}),
						(o.prototype.bind = function (e, t) {
							var n = this,
								r = e.id + "-results";
							((this.container = e),
								this.$selection.on("focus", function (e) {
									n.trigger("focus", e);
								}),
								this.$selection.on("blur", function (e) {
									n._handleBlur(e);
								}),
								this.$selection.on("keydown", function (e) {
									(n.trigger("keypress", e), e.which === i.SPACE && e.preventDefault());
								}),
								e.on("results:focus", function (e) {
									n.$selection.attr("aria-activedescendant", e.data._resultId);
								}),
								e.on("selection:update", function (e) {
									n.update(e.data);
								}),
								e.on("open", function () {
									(n.$selection.attr("aria-expanded", "true"),
										n.$selection.attr("aria-owns", r),
										n._attachCloseHandler(e));
								}),
								e.on("close", function () {
									(n.$selection.attr("aria-expanded", "false"),
										n.$selection.removeAttr("aria-activedescendant"),
										n.$selection.removeAttr("aria-owns"),
										n.$selection.trigger("focus"),
										n._detachCloseHandler(e));
								}),
								e.on("enable", function () {
									(n.$selection.attr("tabindex", n._tabindex),
										n.$selection.attr("aria-disabled", "false"));
								}),
								e.on("disable", function () {
									(n.$selection.attr("tabindex", "-1"), n.$selection.attr("aria-disabled", "true"));
								}));
						}),
						(o.prototype._handleBlur = function (e) {
							var t = this;
							window.setTimeout(function () {
								document.activeElement == t.$selection[0] ||
									n.contains(t.$selection[0], document.activeElement) ||
									t.trigger("blur", e);
							}, 1);
						}),
						(o.prototype._attachCloseHandler = function (e) {
							n(document.body).on("mousedown.select2." + e.id, function (e) {
								var t = n(e.target).closest(".select2");
								n(".select2.select2-container--open").each(function () {
									this != t[0] && r.GetData(this, "element").select2("close");
								});
							});
						}),
						(o.prototype._detachCloseHandler = function (e) {
							n(document.body).off("mousedown.select2." + e.id);
						}),
						(o.prototype.position = function (e, t) {
							t.find(".selection").append(e);
						}),
						(o.prototype.destroy = function () {
							this._detachCloseHandler(this.container);
						}),
						(o.prototype.update = function (e) {
							throw new Error("The `update` method must be defined in child classes.");
						}),
						(o.prototype.isEnabled = function () {
							return !this.isDisabled();
						}),
						(o.prototype.isDisabled = function () {
							return this.options.get("disabled");
						}),
						o
					);
				}),
				e.define(
					"select2/selection/single",
					["jquery", "./base", "../utils", "../keys"],
					function (e, t, n, r) {
						function i() {
							i.__super__.constructor.apply(this, arguments);
						}
						return (
							n.Extend(i, t),
							(i.prototype.render = function () {
								var e = i.__super__.render.call(this);
								return (
									e.addClass("select2-selection--single"),
									e.html(
										'<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'
									),
									e
								);
							}),
							(i.prototype.bind = function (t, e) {
								var n = this;
								i.__super__.bind.apply(this, arguments);
								var r = t.id + "-container";
								(this.$selection
									.find(".select2-selection__rendered")
									.attr("id", r)
									.attr("role", "textbox")
									.attr("aria-readonly", "true"),
									this.$selection.attr("aria-labelledby", r),
									this.$selection.on("mousedown", function (e) {
										1 === e.which && n.trigger("toggle", { originalEvent: e });
									}),
									this.$selection.on("focus", function (e) {}),
									this.$selection.on("blur", function (e) {}),
									t.on("focus", function (e) {
										t.isOpen() || n.$selection.trigger("focus");
									}));
							}),
							(i.prototype.clear = function () {
								var e = this.$selection.find(".select2-selection__rendered");
								(e.empty(), e.removeAttr("title"));
							}),
							(i.prototype.display = function (e, t) {
								var n = this.options.get("templateSelection");
								return this.options.get("escapeMarkup")(n(e, t));
							}),
							(i.prototype.selectionContainer = function () {
								return e("<span></span>");
							}),
							(i.prototype.update = function (e) {
								if (0 !== e.length) {
									var t = e[0],
										n = this.$selection.find(".select2-selection__rendered"),
										r = this.display(t, n);
									n.empty().append(r);
									var i = t.title || t.text;
									i ? n.attr("title", i) : n.removeAttr("title");
								} else this.clear();
							}),
							i
						);
					}
				),
				e.define(
					"select2/selection/multiple",
					["jquery", "./base", "../utils"],
					function (i, e, l) {
						function n(e, t) {
							n.__super__.constructor.apply(this, arguments);
						}
						return (
							l.Extend(n, e),
							(n.prototype.render = function () {
								var e = n.__super__.render.call(this);
								return (
									e.addClass("select2-selection--multiple"),
									e.html('<ul class="select2-selection__rendered"></ul>'),
									e
								);
							}),
							(n.prototype.bind = function (e, t) {
								var r = this;
								(n.__super__.bind.apply(this, arguments),
									this.$selection.on("click", function (e) {
										r.trigger("toggle", { originalEvent: e });
									}),
									this.$selection.on("click", ".select2-selection__choice__remove", function (e) {
										if (!r.isDisabled()) {
											var t = i(this).parent(),
												n = l.GetData(t[0], "data");
											r.trigger("unselect", { originalEvent: e, data: n });
										}
									}));
							}),
							(n.prototype.clear = function () {
								var e = this.$selection.find(".select2-selection__rendered");
								(e.empty(), e.removeAttr("title"));
							}),
							(n.prototype.display = function (e, t) {
								var n = this.options.get("templateSelection");
								return this.options.get("escapeMarkup")(n(e, t));
							}),
							(n.prototype.selectionContainer = function () {
								return i(
									'<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>'
								);
							}),
							(n.prototype.update = function (e) {
								if ((this.clear(), 0 !== e.length)) {
									for (var t = [], n = 0; n < e.length; n++) {
										var r = e[n],
											i = this.selectionContainer(),
											o = this.display(r, i);
										i.append(o);
										var s = r.title || r.text;
										(s && i.attr("title", s), l.StoreData(i[0], "data", r), t.push(i));
									}
									var a = this.$selection.find(".select2-selection__rendered");
									l.appendMany(a, t);
								}
							}),
							n
						);
					}
				),
				e.define("select2/selection/placeholder", ["../utils"], function (e) {
					function t(e, t, n) {
						((this.placeholder = this.normalizePlaceholder(n.get("placeholder"))),
							e.call(this, t, n));
					}
					return (
						(t.prototype.normalizePlaceholder = function (e, t) {
							return ("string" == typeof t && (t = { id: "", text: t }), t);
						}),
						(t.prototype.createPlaceholder = function (e, t) {
							var n = this.selectionContainer();
							return (
								n.html(this.display(t)),
								n
									.addClass("select2-selection__placeholder")
									.removeClass("select2-selection__choice"),
								n
							);
						}),
						(t.prototype.update = function (e, t) {
							var n = 1 == t.length && t[0].id != this.placeholder.id;
							if (1 < t.length || n) return e.call(this, t);
							this.clear();
							var r = this.createPlaceholder(this.placeholder);
							this.$selection.find(".select2-selection__rendered").append(r);
						}),
						t
					);
				}),
				e.define(
					"select2/selection/allowClear",
					["jquery", "../keys", "../utils"],
					function (i, r, a) {
						function e() {}
						return (
							(e.prototype.bind = function (e, t, n) {
								var r = this;
								(e.call(this, t, n),
									null == this.placeholder &&
										this.options.get("debug") &&
										window.console &&
										console.error &&
										console.error(
											"Select2: The `allowClear` option should be used in combination with the `placeholder` option."
										),
									this.$selection.on("mousedown", ".select2-selection__clear", function (e) {
										r._handleClear(e);
									}),
									t.on("keypress", function (e) {
										r._handleKeyboardClear(e, t);
									}));
							}),
							(e.prototype._handleClear = function (e, t) {
								if (!this.isDisabled()) {
									var n = this.$selection.find(".select2-selection__clear");
									if (0 !== n.length) {
										t.stopPropagation();
										var r = a.GetData(n[0], "data"),
											i = this.$element.val();
										this.$element.val(this.placeholder.id);
										var o = { data: r };
										if ((this.trigger("clear", o), o.prevented)) this.$element.val(i);
										else {
											for (var s = 0; s < r.length; s++)
												if (((o = { data: r[s] }), this.trigger("unselect", o), o.prevented))
													return void this.$element.val(i);
											(this.$element.trigger("input").trigger("change"),
												this.trigger("toggle", {}));
										}
									}
								}
							}),
							(e.prototype._handleKeyboardClear = function (e, t, n) {
								n.isOpen() ||
									(t.which != r.DELETE && t.which != r.BACKSPACE) ||
									this._handleClear(t);
							}),
							(e.prototype.update = function (e, t) {
								if (
									(e.call(this, t),
									!(
										0 < this.$selection.find(".select2-selection__placeholder").length ||
										0 === t.length
									))
								) {
									var n = this.options.get("translations").get("removeAllItems"),
										r = i(
											'<span class="select2-selection__clear" title="' + n() + '">&times;</span>'
										);
									(a.StoreData(r[0], "data", t),
										this.$selection.find(".select2-selection__rendered").prepend(r));
								}
							}),
							e
						);
					}
				),
				e.define("select2/selection/search", ["jquery", "../utils", "../keys"], function (r, a, l) {
					function e(e, t, n) {
						e.call(this, t, n);
					}
					return (
						(e.prototype.render = function (e) {
							var t = r(
								'<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>'
							);
							((this.$searchContainer = t), (this.$search = t.find("input")));
							var n = e.call(this);
							return (this._transferTabIndex(), n);
						}),
						(e.prototype.bind = function (e, t, n) {
							var r = this,
								i = t.id + "-results";
							(e.call(this, t, n),
								t.on("open", function () {
									(r.$search.attr("aria-controls", i), r.$search.trigger("focus"));
								}),
								t.on("close", function () {
									(r.$search.val(""),
										r.$search.removeAttr("aria-controls"),
										r.$search.removeAttr("aria-activedescendant"),
										r.$search.trigger("focus"));
								}),
								t.on("enable", function () {
									(r.$search.prop("disabled", !1), r._transferTabIndex());
								}),
								t.on("disable", function () {
									r.$search.prop("disabled", !0);
								}),
								t.on("focus", function (e) {
									r.$search.trigger("focus");
								}),
								t.on("results:focus", function (e) {
									e.data._resultId
										? r.$search.attr("aria-activedescendant", e.data._resultId)
										: r.$search.removeAttr("aria-activedescendant");
								}),
								this.$selection.on("focusin", ".select2-search--inline", function (e) {
									r.trigger("focus", e);
								}),
								this.$selection.on("focusout", ".select2-search--inline", function (e) {
									r._handleBlur(e);
								}),
								this.$selection.on("keydown", ".select2-search--inline", function (e) {
									if (
										(e.stopPropagation(),
										r.trigger("keypress", e),
										(r._keyUpPrevented = e.isDefaultPrevented()),
										e.which === l.BACKSPACE && "" === r.$search.val())
									) {
										var t = r.$searchContainer.prev(".select2-selection__choice");
										if (0 < t.length) {
											var n = a.GetData(t[0], "data");
											(r.searchRemoveChoice(n), e.preventDefault());
										}
									}
								}),
								this.$selection.on("click", ".select2-search--inline", function (e) {
									r.$search.val() && e.stopPropagation();
								}));
							var o = document.documentMode,
								s = o && o <= 11;
							(this.$selection.on("input.searchcheck", ".select2-search--inline", function (e) {
								s
									? r.$selection.off("input.search input.searchcheck")
									: r.$selection.off("keyup.search");
							}),
								this.$selection.on(
									"keyup.search input.search",
									".select2-search--inline",
									function (e) {
										if (s && "input" === e.type) r.$selection.off("input.search input.searchcheck");
										else {
											var t = e.which;
											t != l.SHIFT && t != l.CTRL && t != l.ALT && t != l.TAB && r.handleSearch(e);
										}
									}
								));
						}),
						(e.prototype._transferTabIndex = function (e) {
							(this.$search.attr("tabindex", this.$selection.attr("tabindex")),
								this.$selection.attr("tabindex", "-1"));
						}),
						(e.prototype.createPlaceholder = function (e, t) {
							this.$search.attr("placeholder", t.text);
						}),
						(e.prototype.update = function (e, t) {
							var n = this.$search[0] == document.activeElement;
							(this.$search.attr("placeholder", ""),
								e.call(this, t),
								this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),
								this.resizeSearch(),
								n && this.$search.trigger("focus"));
						}),
						(e.prototype.handleSearch = function () {
							if ((this.resizeSearch(), !this._keyUpPrevented)) {
								var e = this.$search.val();
								this.trigger("query", { term: e });
							}
							this._keyUpPrevented = !1;
						}),
						(e.prototype.searchRemoveChoice = function (e, t) {
							(this.trigger("unselect", { data: t }),
								this.$search.val(t.text),
								this.handleSearch());
						}),
						(e.prototype.resizeSearch = function () {
							this.$search.css("width", "25px");
							var e = "";
							"" !== this.$search.attr("placeholder")
								? (e = this.$selection.find(".select2-selection__rendered").width())
								: (e = 0.75 * (this.$search.val().length + 1) + "em");
							this.$search.css("width", e);
						}),
						e
					);
				}),
				e.define("select2/selection/eventRelay", ["jquery"], function (s) {
					function e() {}
					return (
						(e.prototype.bind = function (e, t, n) {
							var r = this,
								i = [
									"open",
									"opening",
									"close",
									"closing",
									"select",
									"selecting",
									"unselect",
									"unselecting",
									"clear",
									"clearing",
								],
								o = ["opening", "closing", "selecting", "unselecting", "clearing"];
							(e.call(this, t, n),
								t.on("*", function (e, t) {
									if (-1 !== s.inArray(e, i)) {
										t = t || {};
										var n = s.Event("select2:" + e, { params: t });
										(r.$element.trigger(n),
											-1 !== s.inArray(e, o) && (t.prevented = n.isDefaultPrevented()));
									}
								}));
						}),
						e
					);
				}),
				e.define("select2/translation", ["jquery", "require"], function (t, n) {
					function r(e) {
						this.dict = e || {};
					}
					return (
						(r.prototype.all = function () {
							return this.dict;
						}),
						(r.prototype.get = function (e) {
							return this.dict[e];
						}),
						(r.prototype.extend = function (e) {
							this.dict = t.extend({}, e.all(), this.dict);
						}),
						(r._cache = {}),
						(r.loadPath = function (e) {
							if (!(e in r._cache)) {
								var t = n(e);
								r._cache[e] = t;
							}
							return new r(r._cache[e]);
						}),
						r
					);
				}),
				e.define("select2/diacritics", [], function () {
					return {
						"Ⓐ": "A",
						Ａ: "A",
						À: "A",
						Á: "A",
						Â: "A",
						Ầ: "A",
						Ấ: "A",
						Ẫ: "A",
						Ẩ: "A",
						Ã: "A",
						Ā: "A",
						Ă: "A",
						Ằ: "A",
						Ắ: "A",
						Ẵ: "A",
						Ẳ: "A",
						Ȧ: "A",
						Ǡ: "A",
						Ä: "A",
						Ǟ: "A",
						Ả: "A",
						Å: "A",
						Ǻ: "A",
						Ǎ: "A",
						Ȁ: "A",
						Ȃ: "A",
						Ạ: "A",
						Ậ: "A",
						Ặ: "A",
						Ḁ: "A",
						Ą: "A",
						Ⱥ: "A",
						Ɐ: "A",
						Ꜳ: "AA",
						Æ: "AE",
						Ǽ: "AE",
						Ǣ: "AE",
						Ꜵ: "AO",
						Ꜷ: "AU",
						Ꜹ: "AV",
						Ꜻ: "AV",
						Ꜽ: "AY",
						"Ⓑ": "B",
						Ｂ: "B",
						Ḃ: "B",
						Ḅ: "B",
						Ḇ: "B",
						Ƀ: "B",
						Ƃ: "B",
						Ɓ: "B",
						"Ⓒ": "C",
						Ｃ: "C",
						Ć: "C",
						Ĉ: "C",
						Ċ: "C",
						Č: "C",
						Ç: "C",
						Ḉ: "C",
						Ƈ: "C",
						Ȼ: "C",
						Ꜿ: "C",
						"Ⓓ": "D",
						Ｄ: "D",
						Ḋ: "D",
						Ď: "D",
						Ḍ: "D",
						Ḑ: "D",
						Ḓ: "D",
						Ḏ: "D",
						Đ: "D",
						Ƌ: "D",
						Ɗ: "D",
						Ɖ: "D",
						Ꝺ: "D",
						Ǳ: "DZ",
						Ǆ: "DZ",
						ǲ: "Dz",
						ǅ: "Dz",
						"Ⓔ": "E",
						Ｅ: "E",
						È: "E",
						É: "E",
						Ê: "E",
						Ề: "E",
						Ế: "E",
						Ễ: "E",
						Ể: "E",
						Ẽ: "E",
						Ē: "E",
						Ḕ: "E",
						Ḗ: "E",
						Ĕ: "E",
						Ė: "E",
						Ë: "E",
						Ẻ: "E",
						Ě: "E",
						Ȅ: "E",
						Ȇ: "E",
						Ẹ: "E",
						Ệ: "E",
						Ȩ: "E",
						Ḝ: "E",
						Ę: "E",
						Ḙ: "E",
						Ḛ: "E",
						Ɛ: "E",
						Ǝ: "E",
						"Ⓕ": "F",
						Ｆ: "F",
						Ḟ: "F",
						Ƒ: "F",
						Ꝼ: "F",
						"Ⓖ": "G",
						Ｇ: "G",
						Ǵ: "G",
						Ĝ: "G",
						Ḡ: "G",
						Ğ: "G",
						Ġ: "G",
						Ǧ: "G",
						Ģ: "G",
						Ǥ: "G",
						Ɠ: "G",
						Ꞡ: "G",
						Ᵹ: "G",
						Ꝿ: "G",
						"Ⓗ": "H",
						Ｈ: "H",
						Ĥ: "H",
						Ḣ: "H",
						Ḧ: "H",
						Ȟ: "H",
						Ḥ: "H",
						Ḩ: "H",
						Ḫ: "H",
						Ħ: "H",
						Ⱨ: "H",
						Ⱶ: "H",
						Ɥ: "H",
						"Ⓘ": "I",
						Ｉ: "I",
						Ì: "I",
						Í: "I",
						Î: "I",
						Ĩ: "I",
						Ī: "I",
						Ĭ: "I",
						İ: "I",
						Ï: "I",
						Ḯ: "I",
						Ỉ: "I",
						Ǐ: "I",
						Ȉ: "I",
						Ȋ: "I",
						Ị: "I",
						Į: "I",
						Ḭ: "I",
						Ɨ: "I",
						"Ⓙ": "J",
						Ｊ: "J",
						Ĵ: "J",
						Ɉ: "J",
						"Ⓚ": "K",
						Ｋ: "K",
						Ḱ: "K",
						Ǩ: "K",
						Ḳ: "K",
						Ķ: "K",
						Ḵ: "K",
						Ƙ: "K",
						Ⱪ: "K",
						Ꝁ: "K",
						Ꝃ: "K",
						Ꝅ: "K",
						Ꞣ: "K",
						"Ⓛ": "L",
						Ｌ: "L",
						Ŀ: "L",
						Ĺ: "L",
						Ľ: "L",
						Ḷ: "L",
						Ḹ: "L",
						Ļ: "L",
						Ḽ: "L",
						Ḻ: "L",
						Ł: "L",
						Ƚ: "L",
						Ɫ: "L",
						Ⱡ: "L",
						Ꝉ: "L",
						Ꝇ: "L",
						Ꞁ: "L",
						Ǉ: "LJ",
						ǈ: "Lj",
						"Ⓜ": "M",
						Ｍ: "M",
						Ḿ: "M",
						Ṁ: "M",
						Ṃ: "M",
						Ɱ: "M",
						Ɯ: "M",
						"Ⓝ": "N",
						Ｎ: "N",
						Ǹ: "N",
						Ń: "N",
						Ñ: "N",
						Ṅ: "N",
						Ň: "N",
						Ṇ: "N",
						Ņ: "N",
						Ṋ: "N",
						Ṉ: "N",
						Ƞ: "N",
						Ɲ: "N",
						Ꞑ: "N",
						Ꞥ: "N",
						Ǌ: "NJ",
						ǋ: "Nj",
						"Ⓞ": "O",
						Ｏ: "O",
						Ò: "O",
						Ó: "O",
						Ô: "O",
						Ồ: "O",
						Ố: "O",
						Ỗ: "O",
						Ổ: "O",
						Õ: "O",
						Ṍ: "O",
						Ȭ: "O",
						Ṏ: "O",
						Ō: "O",
						Ṑ: "O",
						Ṓ: "O",
						Ŏ: "O",
						Ȯ: "O",
						Ȱ: "O",
						Ö: "O",
						Ȫ: "O",
						Ỏ: "O",
						Ő: "O",
						Ǒ: "O",
						Ȍ: "O",
						Ȏ: "O",
						Ơ: "O",
						Ờ: "O",
						Ớ: "O",
						Ỡ: "O",
						Ở: "O",
						Ợ: "O",
						Ọ: "O",
						Ộ: "O",
						Ǫ: "O",
						Ǭ: "O",
						Ø: "O",
						Ǿ: "O",
						Ɔ: "O",
						Ɵ: "O",
						Ꝋ: "O",
						Ꝍ: "O",
						Œ: "OE",
						Ƣ: "OI",
						Ꝏ: "OO",
						Ȣ: "OU",
						"Ⓟ": "P",
						Ｐ: "P",
						Ṕ: "P",
						Ṗ: "P",
						Ƥ: "P",
						Ᵽ: "P",
						Ꝑ: "P",
						Ꝓ: "P",
						Ꝕ: "P",
						"Ⓠ": "Q",
						Ｑ: "Q",
						Ꝗ: "Q",
						Ꝙ: "Q",
						Ɋ: "Q",
						"Ⓡ": "R",
						Ｒ: "R",
						Ŕ: "R",
						Ṙ: "R",
						Ř: "R",
						Ȑ: "R",
						Ȓ: "R",
						Ṛ: "R",
						Ṝ: "R",
						Ŗ: "R",
						Ṟ: "R",
						Ɍ: "R",
						Ɽ: "R",
						Ꝛ: "R",
						Ꞧ: "R",
						Ꞃ: "R",
						"Ⓢ": "S",
						Ｓ: "S",
						ẞ: "S",
						Ś: "S",
						Ṥ: "S",
						Ŝ: "S",
						Ṡ: "S",
						Š: "S",
						Ṧ: "S",
						Ṣ: "S",
						Ṩ: "S",
						Ș: "S",
						Ş: "S",
						Ȿ: "S",
						Ꞩ: "S",
						Ꞅ: "S",
						"Ⓣ": "T",
						Ｔ: "T",
						Ṫ: "T",
						Ť: "T",
						Ṭ: "T",
						Ț: "T",
						Ţ: "T",
						Ṱ: "T",
						Ṯ: "T",
						Ŧ: "T",
						Ƭ: "T",
						Ʈ: "T",
						Ⱦ: "T",
						Ꞇ: "T",
						Ꜩ: "TZ",
						"Ⓤ": "U",
						Ｕ: "U",
						Ù: "U",
						Ú: "U",
						Û: "U",
						Ũ: "U",
						Ṹ: "U",
						Ū: "U",
						Ṻ: "U",
						Ŭ: "U",
						Ü: "U",
						Ǜ: "U",
						Ǘ: "U",
						Ǖ: "U",
						Ǚ: "U",
						Ủ: "U",
						Ů: "U",
						Ű: "U",
						Ǔ: "U",
						Ȕ: "U",
						Ȗ: "U",
						Ư: "U",
						Ừ: "U",
						Ứ: "U",
						Ữ: "U",
						Ử: "U",
						Ự: "U",
						Ụ: "U",
						Ṳ: "U",
						Ų: "U",
						Ṷ: "U",
						Ṵ: "U",
						Ʉ: "U",
						"Ⓥ": "V",
						Ｖ: "V",
						Ṽ: "V",
						Ṿ: "V",
						Ʋ: "V",
						Ꝟ: "V",
						Ʌ: "V",
						Ꝡ: "VY",
						"Ⓦ": "W",
						Ｗ: "W",
						Ẁ: "W",
						Ẃ: "W",
						Ŵ: "W",
						Ẇ: "W",
						Ẅ: "W",
						Ẉ: "W",
						Ⱳ: "W",
						"Ⓧ": "X",
						Ｘ: "X",
						Ẋ: "X",
						Ẍ: "X",
						"Ⓨ": "Y",
						Ｙ: "Y",
						Ỳ: "Y",
						Ý: "Y",
						Ŷ: "Y",
						Ỹ: "Y",
						Ȳ: "Y",
						Ẏ: "Y",
						Ÿ: "Y",
						Ỷ: "Y",
						Ỵ: "Y",
						Ƴ: "Y",
						Ɏ: "Y",
						Ỿ: "Y",
						"Ⓩ": "Z",
						Ｚ: "Z",
						Ź: "Z",
						Ẑ: "Z",
						Ż: "Z",
						Ž: "Z",
						Ẓ: "Z",
						Ẕ: "Z",
						Ƶ: "Z",
						Ȥ: "Z",
						Ɀ: "Z",
						Ⱬ: "Z",
						Ꝣ: "Z",
						"ⓐ": "a",
						ａ: "a",
						ẚ: "a",
						à: "a",
						á: "a",
						â: "a",
						ầ: "a",
						ấ: "a",
						ẫ: "a",
						ẩ: "a",
						ã: "a",
						ā: "a",
						ă: "a",
						ằ: "a",
						ắ: "a",
						ẵ: "a",
						ẳ: "a",
						ȧ: "a",
						ǡ: "a",
						ä: "a",
						ǟ: "a",
						ả: "a",
						å: "a",
						ǻ: "a",
						ǎ: "a",
						ȁ: "a",
						ȃ: "a",
						ạ: "a",
						ậ: "a",
						ặ: "a",
						ḁ: "a",
						ą: "a",
						ⱥ: "a",
						ɐ: "a",
						ꜳ: "aa",
						æ: "ae",
						ǽ: "ae",
						ǣ: "ae",
						ꜵ: "ao",
						ꜷ: "au",
						ꜹ: "av",
						ꜻ: "av",
						ꜽ: "ay",
						"ⓑ": "b",
						ｂ: "b",
						ḃ: "b",
						ḅ: "b",
						ḇ: "b",
						ƀ: "b",
						ƃ: "b",
						ɓ: "b",
						"ⓒ": "c",
						ｃ: "c",
						ć: "c",
						ĉ: "c",
						ċ: "c",
						č: "c",
						ç: "c",
						ḉ: "c",
						ƈ: "c",
						ȼ: "c",
						ꜿ: "c",
						ↄ: "c",
						"ⓓ": "d",
						ｄ: "d",
						ḋ: "d",
						ď: "d",
						ḍ: "d",
						ḑ: "d",
						ḓ: "d",
						ḏ: "d",
						đ: "d",
						ƌ: "d",
						ɖ: "d",
						ɗ: "d",
						ꝺ: "d",
						ǳ: "dz",
						ǆ: "dz",
						"ⓔ": "e",
						ｅ: "e",
						è: "e",
						é: "e",
						ê: "e",
						ề: "e",
						ế: "e",
						ễ: "e",
						ể: "e",
						ẽ: "e",
						ē: "e",
						ḕ: "e",
						ḗ: "e",
						ĕ: "e",
						ė: "e",
						ë: "e",
						ẻ: "e",
						ě: "e",
						ȅ: "e",
						ȇ: "e",
						ẹ: "e",
						ệ: "e",
						ȩ: "e",
						ḝ: "e",
						ę: "e",
						ḙ: "e",
						ḛ: "e",
						ɇ: "e",
						ɛ: "e",
						ǝ: "e",
						"ⓕ": "f",
						ｆ: "f",
						ḟ: "f",
						ƒ: "f",
						ꝼ: "f",
						"ⓖ": "g",
						ｇ: "g",
						ǵ: "g",
						ĝ: "g",
						ḡ: "g",
						ğ: "g",
						ġ: "g",
						ǧ: "g",
						ģ: "g",
						ǥ: "g",
						ɠ: "g",
						ꞡ: "g",
						ᵹ: "g",
						ꝿ: "g",
						"ⓗ": "h",
						ｈ: "h",
						ĥ: "h",
						ḣ: "h",
						ḧ: "h",
						ȟ: "h",
						ḥ: "h",
						ḩ: "h",
						ḫ: "h",
						ẖ: "h",
						ħ: "h",
						ⱨ: "h",
						ⱶ: "h",
						ɥ: "h",
						ƕ: "hv",
						"ⓘ": "i",
						ｉ: "i",
						ì: "i",
						í: "i",
						î: "i",
						ĩ: "i",
						ī: "i",
						ĭ: "i",
						ï: "i",
						ḯ: "i",
						ỉ: "i",
						ǐ: "i",
						ȉ: "i",
						ȋ: "i",
						ị: "i",
						į: "i",
						ḭ: "i",
						ɨ: "i",
						ı: "i",
						"ⓙ": "j",
						ｊ: "j",
						ĵ: "j",
						ǰ: "j",
						ɉ: "j",
						"ⓚ": "k",
						ｋ: "k",
						ḱ: "k",
						ǩ: "k",
						ḳ: "k",
						ķ: "k",
						ḵ: "k",
						ƙ: "k",
						ⱪ: "k",
						ꝁ: "k",
						ꝃ: "k",
						ꝅ: "k",
						ꞣ: "k",
						"ⓛ": "l",
						ｌ: "l",
						ŀ: "l",
						ĺ: "l",
						ľ: "l",
						ḷ: "l",
						ḹ: "l",
						ļ: "l",
						ḽ: "l",
						ḻ: "l",
						ſ: "l",
						ł: "l",
						ƚ: "l",
						ɫ: "l",
						ⱡ: "l",
						ꝉ: "l",
						ꞁ: "l",
						ꝇ: "l",
						ǉ: "lj",
						"ⓜ": "m",
						ｍ: "m",
						ḿ: "m",
						ṁ: "m",
						ṃ: "m",
						ɱ: "m",
						ɯ: "m",
						"ⓝ": "n",
						ｎ: "n",
						ǹ: "n",
						ń: "n",
						ñ: "n",
						ṅ: "n",
						ň: "n",
						ṇ: "n",
						ņ: "n",
						ṋ: "n",
						ṉ: "n",
						ƞ: "n",
						ɲ: "n",
						ŉ: "n",
						ꞑ: "n",
						ꞥ: "n",
						ǌ: "nj",
						"ⓞ": "o",
						ｏ: "o",
						ò: "o",
						ó: "o",
						ô: "o",
						ồ: "o",
						ố: "o",
						ỗ: "o",
						ổ: "o",
						õ: "o",
						ṍ: "o",
						ȭ: "o",
						ṏ: "o",
						ō: "o",
						ṑ: "o",
						ṓ: "o",
						ŏ: "o",
						ȯ: "o",
						ȱ: "o",
						ö: "o",
						ȫ: "o",
						ỏ: "o",
						ő: "o",
						ǒ: "o",
						ȍ: "o",
						ȏ: "o",
						ơ: "o",
						ờ: "o",
						ớ: "o",
						ỡ: "o",
						ở: "o",
						ợ: "o",
						ọ: "o",
						ộ: "o",
						ǫ: "o",
						ǭ: "o",
						ø: "o",
						ǿ: "o",
						ɔ: "o",
						ꝋ: "o",
						ꝍ: "o",
						ɵ: "o",
						œ: "oe",
						ƣ: "oi",
						ȣ: "ou",
						ꝏ: "oo",
						"ⓟ": "p",
						ｐ: "p",
						ṕ: "p",
						ṗ: "p",
						ƥ: "p",
						ᵽ: "p",
						ꝑ: "p",
						ꝓ: "p",
						ꝕ: "p",
						"ⓠ": "q",
						ｑ: "q",
						ɋ: "q",
						ꝗ: "q",
						ꝙ: "q",
						"ⓡ": "r",
						ｒ: "r",
						ŕ: "r",
						ṙ: "r",
						ř: "r",
						ȑ: "r",
						ȓ: "r",
						ṛ: "r",
						ṝ: "r",
						ŗ: "r",
						ṟ: "r",
						ɍ: "r",
						ɽ: "r",
						ꝛ: "r",
						ꞧ: "r",
						ꞃ: "r",
						"ⓢ": "s",
						ｓ: "s",
						ß: "s",
						ś: "s",
						ṥ: "s",
						ŝ: "s",
						ṡ: "s",
						š: "s",
						ṧ: "s",
						ṣ: "s",
						ṩ: "s",
						ș: "s",
						ş: "s",
						ȿ: "s",
						ꞩ: "s",
						ꞅ: "s",
						ẛ: "s",
						"ⓣ": "t",
						ｔ: "t",
						ṫ: "t",
						ẗ: "t",
						ť: "t",
						ṭ: "t",
						ț: "t",
						ţ: "t",
						ṱ: "t",
						ṯ: "t",
						ŧ: "t",
						ƭ: "t",
						ʈ: "t",
						ⱦ: "t",
						ꞇ: "t",
						ꜩ: "tz",
						"ⓤ": "u",
						ｕ: "u",
						ù: "u",
						ú: "u",
						û: "u",
						ũ: "u",
						ṹ: "u",
						ū: "u",
						ṻ: "u",
						ŭ: "u",
						ü: "u",
						ǜ: "u",
						ǘ: "u",
						ǖ: "u",
						ǚ: "u",
						ủ: "u",
						ů: "u",
						ű: "u",
						ǔ: "u",
						ȕ: "u",
						ȗ: "u",
						ư: "u",
						ừ: "u",
						ứ: "u",
						ữ: "u",
						ử: "u",
						ự: "u",
						ụ: "u",
						ṳ: "u",
						ų: "u",
						ṷ: "u",
						ṵ: "u",
						ʉ: "u",
						"ⓥ": "v",
						ｖ: "v",
						ṽ: "v",
						ṿ: "v",
						ʋ: "v",
						ꝟ: "v",
						ʌ: "v",
						ꝡ: "vy",
						"ⓦ": "w",
						ｗ: "w",
						ẁ: "w",
						ẃ: "w",
						ŵ: "w",
						ẇ: "w",
						ẅ: "w",
						ẘ: "w",
						ẉ: "w",
						ⱳ: "w",
						"ⓧ": "x",
						ｘ: "x",
						ẋ: "x",
						ẍ: "x",
						"ⓨ": "y",
						ｙ: "y",
						ỳ: "y",
						ý: "y",
						ŷ: "y",
						ỹ: "y",
						ȳ: "y",
						ẏ: "y",
						ÿ: "y",
						ỷ: "y",
						ẙ: "y",
						ỵ: "y",
						ƴ: "y",
						ɏ: "y",
						ỿ: "y",
						"ⓩ": "z",
						ｚ: "z",
						ź: "z",
						ẑ: "z",
						ż: "z",
						ž: "z",
						ẓ: "z",
						ẕ: "z",
						ƶ: "z",
						ȥ: "z",
						ɀ: "z",
						ⱬ: "z",
						ꝣ: "z",
						Ά: "Α",
						Έ: "Ε",
						Ή: "Η",
						Ί: "Ι",
						Ϊ: "Ι",
						Ό: "Ο",
						Ύ: "Υ",
						Ϋ: "Υ",
						Ώ: "Ω",
						ά: "α",
						έ: "ε",
						ή: "η",
						ί: "ι",
						ϊ: "ι",
						ΐ: "ι",
						ό: "ο",
						ύ: "υ",
						ϋ: "υ",
						ΰ: "υ",
						ώ: "ω",
						ς: "σ",
						"’": "'",
					};
				}),
				e.define("select2/data/base", ["../utils"], function (r) {
					function n(e, t) {
						n.__super__.constructor.call(this);
					}
					return (
						r.Extend(n, r.Observable),
						(n.prototype.current = function (e) {
							throw new Error("The `current` method must be defined in child classes.");
						}),
						(n.prototype.query = function (e, t) {
							throw new Error("The `query` method must be defined in child classes.");
						}),
						(n.prototype.bind = function (e, t) {}),
						(n.prototype.destroy = function () {}),
						(n.prototype.generateResultId = function (e, t) {
							var n = e.id + "-result-";
							return (
								(n += r.generateChars(4)),
								null != t.id ? (n += "-" + t.id.toString()) : (n += "-" + r.generateChars(4)),
								n
							);
						}),
						n
					);
				}),
				e.define("select2/data/select", ["./base", "../utils", "jquery"], function (e, a, l) {
					function n(e, t) {
						((this.$element = e), (this.options = t), n.__super__.constructor.call(this));
					}
					return (
						a.Extend(n, e),
						(n.prototype.current = function (e) {
							var n = [],
								r = this;
							(this.$element.find(":selected").each(function () {
								var e = l(this),
									t = r.item(e);
								n.push(t);
							}),
								e(n));
						}),
						(n.prototype.select = function (i) {
							var o = this;
							if (((i.selected = !0), l(i.element).is("option")))
								return (
									(i.element.selected = !0), void this.$element.trigger("input").trigger("change")
								);
							if (this.$element.prop("multiple"))
								this.current(function (e) {
									var t = [];
									(i = [i]).push.apply(i, e);
									for (var n = 0; n < i.length; n++) {
										var r = i[n].id;
										-1 === l.inArray(r, t) && t.push(r);
									}
									(o.$element.val(t), o.$element.trigger("input").trigger("change"));
								});
							else {
								var e = i.id;
								(this.$element.val(e), this.$element.trigger("input").trigger("change"));
							}
						}),
						(n.prototype.unselect = function (i) {
							var o = this;
							if (this.$element.prop("multiple")) {
								if (((i.selected = !1), l(i.element).is("option")))
									return (
										(i.element.selected = !1), void this.$element.trigger("input").trigger("change")
									);
								this.current(function (e) {
									for (var t = [], n = 0; n < e.length; n++) {
										var r = e[n].id;
										r !== i.id && -1 === l.inArray(r, t) && t.push(r);
									}
									(o.$element.val(t), o.$element.trigger("input").trigger("change"));
								});
							}
						}),
						(n.prototype.bind = function (e, t) {
							var n = this;
							((this.container = e).on("select", function (e) {
								n.select(e.data);
							}),
								e.on("unselect", function (e) {
									n.unselect(e.data);
								}));
						}),
						(n.prototype.destroy = function () {
							this.$element.find("*").each(function () {
								a.RemoveData(this);
							});
						}),
						(n.prototype.query = function (r, e) {
							var i = [],
								o = this;
							(this.$element.children().each(function () {
								var e = l(this);
								if (e.is("option") || e.is("optgroup")) {
									var t = o.item(e),
										n = o.matches(r, t);
									null !== n && i.push(n);
								}
							}),
								e({ results: i }));
						}),
						(n.prototype.addOptions = function (e) {
							a.appendMany(this.$element, e);
						}),
						(n.prototype.option = function (e) {
							var t;
							(e.children
								? ((t = document.createElement("optgroup")).label = e.text)
								: void 0 !== (t = document.createElement("option")).textContent
									? (t.textContent = e.text)
									: (t.innerText = e.text),
								void 0 !== e.id && (t.value = e.id),
								e.disabled && (t.disabled = !0),
								e.selected && (t.selected = !0),
								e.title && (t.title = e.title));
							var n = l(t),
								r = this._normalizeItem(e);
							return ((r.element = t), a.StoreData(t, "data", r), n);
						}),
						(n.prototype.item = function (e) {
							var t = {};
							if (null != (t = a.GetData(e[0], "data"))) return t;
							if (e.is("option"))
								t = {
									id: e.val(),
									text: e.text(),
									disabled: e.prop("disabled"),
									selected: e.prop("selected"),
									title: e.prop("title"),
								};
							else if (e.is("optgroup")) {
								t = { text: e.prop("label"), children: [], title: e.prop("title") };
								for (var n = e.children("option"), r = [], i = 0; i < n.length; i++) {
									var o = l(n[i]),
										s = this.item(o);
									r.push(s);
								}
								t.children = r;
							}
							return (
								((t = this._normalizeItem(t)).element = e[0]), a.StoreData(e[0], "data", t), t
							);
						}),
						(n.prototype._normalizeItem = function (e) {
							e !== Object(e) && (e = { id: e, text: e });
							return (
								null != (e = l.extend({}, { text: "" }, e)).id && (e.id = e.id.toString()),
								null != e.text && (e.text = e.text.toString()),
								null == e._resultId &&
									e.id &&
									null != this.container &&
									(e._resultId = this.generateResultId(this.container, e)),
								l.extend({}, { selected: !1, disabled: !1 }, e)
							);
						}),
						(n.prototype.matches = function (e, t) {
							return this.options.get("matcher")(e, t);
						}),
						n
					);
				}),
				e.define("select2/data/array", ["./select", "../utils", "jquery"], function (e, f, g) {
					function r(e, t) {
						((this._dataToConvert = t.get("data") || []), r.__super__.constructor.call(this, e, t));
					}
					return (
						f.Extend(r, e),
						(r.prototype.bind = function (e, t) {
							(r.__super__.bind.call(this, e, t),
								this.addOptions(this.convertToOptions(this._dataToConvert)));
						}),
						(r.prototype.select = function (n) {
							var e = this.$element.find("option").filter(function (e, t) {
								return t.value == n.id.toString();
							});
							(0 === e.length && ((e = this.option(n)), this.addOptions(e)),
								r.__super__.select.call(this, n));
						}),
						(r.prototype.convertToOptions = function (e) {
							var t = this,
								n = this.$element.find("option"),
								r = n
									.map(function () {
										return t.item(g(this)).id;
									})
									.get(),
								i = [];
							function o(e) {
								return function () {
									return g(this).val() == e.id;
								};
							}
							for (var s = 0; s < e.length; s++) {
								var a = this._normalizeItem(e[s]);
								if (0 <= g.inArray(a.id, r)) {
									var l = n.filter(o(a)),
										c = this.item(l),
										u = g.extend(!0, {}, a, c),
										d = this.option(u);
									l.replaceWith(d);
								} else {
									var p = this.option(a);
									if (a.children) {
										var h = this.convertToOptions(a.children);
										f.appendMany(p, h);
									}
									i.push(p);
								}
							}
							return i;
						}),
						r
					);
				}),
				e.define("select2/data/ajax", ["./array", "../utils", "jquery"], function (e, t, o) {
					function n(e, t) {
						((this.ajaxOptions = this._applyDefaults(t.get("ajax"))),
							null != this.ajaxOptions.processResults &&
								(this.processResults = this.ajaxOptions.processResults),
							n.__super__.constructor.call(this, e, t));
					}
					return (
						t.Extend(n, e),
						(n.prototype._applyDefaults = function (e) {
							var t = {
								data: function (e) {
									return o.extend({}, e, { q: e.term });
								},
								transport: function (e, t, n) {
									var r = o.ajax(e);
									return (r.then(t), r.fail(n), r);
								},
							};
							return o.extend({}, t, e, !0);
						}),
						(n.prototype.processResults = function (e) {
							return e;
						}),
						(n.prototype.query = function (n, r) {
							var i = this;
							null != this._request &&
								(o.isFunction(this._request.abort) && this._request.abort(),
								(this._request = null));
							var t = o.extend({ type: "GET" }, this.ajaxOptions);
							function e() {
								var e = t.transport(
									t,
									function (e) {
										var t = i.processResults(e, n);
										(i.options.get("debug") &&
											window.console &&
											console.error &&
											((t && t.results && o.isArray(t.results)) ||
												console.error(
													"Select2: The AJAX results did not return an array in the `results` key of the response."
												)),
											r(t));
									},
									function () {
										("status" in e && (0 === e.status || "0" === e.status)) ||
											i.trigger("results:message", { message: "errorLoading" });
									}
								);
								i._request = e;
							}
							("function" == typeof t.url && (t.url = t.url.call(this.$element, n)),
								"function" == typeof t.data && (t.data = t.data.call(this.$element, n)),
								this.ajaxOptions.delay && null != n.term
									? (this._queryTimeout && window.clearTimeout(this._queryTimeout),
										(this._queryTimeout = window.setTimeout(e, this.ajaxOptions.delay)))
									: e());
						}),
						n
					);
				}),
				e.define("select2/data/tags", ["jquery"], function (u) {
					function e(e, t, n) {
						var r = n.get("tags"),
							i = n.get("createTag");
						void 0 !== i && (this.createTag = i);
						var o = n.get("insertTag");
						if ((void 0 !== o && (this.insertTag = o), e.call(this, t, n), u.isArray(r)))
							for (var s = 0; s < r.length; s++) {
								var a = r[s],
									l = this._normalizeItem(a),
									c = this.option(l);
								this.$element.append(c);
							}
					}
					return (
						(e.prototype.query = function (e, c, u) {
							var d = this;
							(this._removeOldTags(),
								null != c.term && null == c.page
									? e.call(this, c, function e(t, n) {
											for (var r = t.results, i = 0; i < r.length; i++) {
												var o = r[i],
													s = null != o.children && !e({ results: o.children }, !0);
												if ((o.text || "").toUpperCase() === (c.term || "").toUpperCase() || s)
													return !n && ((t.data = r), void u(t));
											}
											if (n) return !0;
											var a = d.createTag(c);
											if (null != a) {
												var l = d.option(a);
												(l.attr("data-select2-tag", !0), d.addOptions([l]), d.insertTag(r, a));
											}
											((t.results = r), u(t));
										})
									: e.call(this, c, u));
						}),
						(e.prototype.createTag = function (e, t) {
							var n = u.trim(t.term);
							return "" === n ? null : { id: n, text: n };
						}),
						(e.prototype.insertTag = function (e, t, n) {
							t.unshift(n);
						}),
						(e.prototype._removeOldTags = function (e) {
							this.$element.find("option[data-select2-tag]").each(function () {
								this.selected || u(this).remove();
							});
						}),
						e
					);
				}),
				e.define("select2/data/tokenizer", ["jquery"], function (d) {
					function e(e, t, n) {
						var r = n.get("tokenizer");
						(void 0 !== r && (this.tokenizer = r), e.call(this, t, n));
					}
					return (
						(e.prototype.bind = function (e, t, n) {
							(e.call(this, t, n),
								(this.$search =
									t.dropdown.$search || t.selection.$search || n.find(".select2-search__field")));
						}),
						(e.prototype.query = function (e, t, n) {
							var r = this;
							t.term = t.term || "";
							var i = this.tokenizer(t, this.options, function (e) {
								var t = r._normalizeItem(e);
								if (
									!r.$element.find("option").filter(function () {
										return d(this).val() === t.id;
									}).length
								) {
									var n = r.option(t);
									(n.attr("data-select2-tag", !0), r._removeOldTags(), r.addOptions([n]));
								}
								!(function (e) {
									r.trigger("select", { data: e });
								})(t);
							});
							(i.term !== t.term &&
								(this.$search.length && (this.$search.val(i.term), this.$search.trigger("focus")),
								(t.term = i.term)),
								e.call(this, t, n));
						}),
						(e.prototype.tokenizer = function (e, t, n, r) {
							for (
								var i = n.get("tokenSeparators") || [],
									o = t.term,
									s = 0,
									a =
										this.createTag ||
										function (e) {
											return { id: e.term, text: e.term };
										};
								s < o.length;
							) {
								var l = o[s];
								if (-1 !== d.inArray(l, i)) {
									var c = o.substr(0, s),
										u = a(d.extend({}, t, { term: c }));
									null != u ? (r(u), (o = o.substr(s + 1) || ""), (s = 0)) : s++;
								} else s++;
							}
							return { term: o };
						}),
						e
					);
				}),
				e.define("select2/data/minimumInputLength", [], function () {
					function e(e, t, n) {
						((this.minimumInputLength = n.get("minimumInputLength")), e.call(this, t, n));
					}
					return (
						(e.prototype.query = function (e, t, n) {
							((t.term = t.term || ""),
								t.term.length < this.minimumInputLength
									? this.trigger("results:message", {
											message: "inputTooShort",
											args: { minimum: this.minimumInputLength, input: t.term, params: t },
										})
									: e.call(this, t, n));
						}),
						e
					);
				}),
				e.define("select2/data/maximumInputLength", [], function () {
					function e(e, t, n) {
						((this.maximumInputLength = n.get("maximumInputLength")), e.call(this, t, n));
					}
					return (
						(e.prototype.query = function (e, t, n) {
							((t.term = t.term || ""),
								0 < this.maximumInputLength && t.term.length > this.maximumInputLength
									? this.trigger("results:message", {
											message: "inputTooLong",
											args: { maximum: this.maximumInputLength, input: t.term, params: t },
										})
									: e.call(this, t, n));
						}),
						e
					);
				}),
				e.define("select2/data/maximumSelectionLength", [], function () {
					function e(e, t, n) {
						((this.maximumSelectionLength = n.get("maximumSelectionLength")), e.call(this, t, n));
					}
					return (
						(e.prototype.bind = function (e, t, n) {
							var r = this;
							(e.call(this, t, n),
								t.on("select", function () {
									r._checkIfMaximumSelected();
								}));
						}),
						(e.prototype.query = function (e, t, n) {
							var r = this;
							this._checkIfMaximumSelected(function () {
								e.call(r, t, n);
							});
						}),
						(e.prototype._checkIfMaximumSelected = function (e, n) {
							var r = this;
							this.current(function (e) {
								var t = null != e ? e.length : 0;
								0 < r.maximumSelectionLength && t >= r.maximumSelectionLength
									? r.trigger("results:message", {
											message: "maximumSelected",
											args: { maximum: r.maximumSelectionLength },
										})
									: n && n();
							});
						}),
						e
					);
				}),
				e.define("select2/dropdown", ["jquery", "./utils"], function (t, e) {
					function n(e, t) {
						((this.$element = e), (this.options = t), n.__super__.constructor.call(this));
					}
					return (
						e.Extend(n, e.Observable),
						(n.prototype.render = function () {
							var e = t(
								'<span class="select2-dropdown"><span class="select2-results"></span></span>'
							);
							return (e.attr("dir", this.options.get("dir")), (this.$dropdown = e));
						}),
						(n.prototype.bind = function () {}),
						(n.prototype.position = function (e, t) {}),
						(n.prototype.destroy = function () {
							this.$dropdown.remove();
						}),
						n
					);
				}),
				e.define("select2/dropdown/search", ["jquery", "../utils"], function (o, e) {
					function t() {}
					return (
						(t.prototype.render = function (e) {
							var t = e.call(this),
								n = o(
									'<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>'
								);
							return (
								(this.$searchContainer = n), (this.$search = n.find("input")), t.prepend(n), t
							);
						}),
						(t.prototype.bind = function (e, t, n) {
							var r = this,
								i = t.id + "-results";
							(e.call(this, t, n),
								this.$search.on("keydown", function (e) {
									(r.trigger("keypress", e), (r._keyUpPrevented = e.isDefaultPrevented()));
								}),
								this.$search.on("input", function (e) {
									o(this).off("keyup");
								}),
								this.$search.on("keyup input", function (e) {
									r.handleSearch(e);
								}),
								t.on("open", function () {
									(r.$search.attr("tabindex", 0),
										r.$search.attr("aria-controls", i),
										r.$search.trigger("focus"),
										window.setTimeout(function () {
											r.$search.trigger("focus");
										}, 0));
								}),
								t.on("close", function () {
									(r.$search.attr("tabindex", -1),
										r.$search.removeAttr("aria-controls"),
										r.$search.removeAttr("aria-activedescendant"),
										r.$search.val(""),
										r.$search.trigger("blur"));
								}),
								t.on("focus", function () {
									t.isOpen() || r.$search.trigger("focus");
								}),
								t.on("results:all", function (e) {
									(null != e.query.term && "" !== e.query.term) ||
										(r.showSearch(e)
											? r.$searchContainer.removeClass("select2-search--hide")
											: r.$searchContainer.addClass("select2-search--hide"));
								}),
								t.on("results:focus", function (e) {
									e.data._resultId
										? r.$search.attr("aria-activedescendant", e.data._resultId)
										: r.$search.removeAttr("aria-activedescendant");
								}));
						}),
						(t.prototype.handleSearch = function (e) {
							if (!this._keyUpPrevented) {
								var t = this.$search.val();
								this.trigger("query", { term: t });
							}
							this._keyUpPrevented = !1;
						}),
						(t.prototype.showSearch = function (e, t) {
							return !0;
						}),
						t
					);
				}),
				e.define("select2/dropdown/hidePlaceholder", [], function () {
					function e(e, t, n, r) {
						((this.placeholder = this.normalizePlaceholder(n.get("placeholder"))),
							e.call(this, t, n, r));
					}
					return (
						(e.prototype.append = function (e, t) {
							((t.results = this.removePlaceholder(t.results)), e.call(this, t));
						}),
						(e.prototype.normalizePlaceholder = function (e, t) {
							return ("string" == typeof t && (t = { id: "", text: t }), t);
						}),
						(e.prototype.removePlaceholder = function (e, t) {
							for (var n = t.slice(0), r = t.length - 1; 0 <= r; r--) {
								var i = t[r];
								this.placeholder.id === i.id && n.splice(r, 1);
							}
							return n;
						}),
						e
					);
				}),
				e.define("select2/dropdown/infiniteScroll", ["jquery"], function (n) {
					function e(e, t, n, r) {
						((this.lastParams = {}),
							e.call(this, t, n, r),
							(this.$loadingMore = this.createLoadingMore()),
							(this.loading = !1));
					}
					return (
						(e.prototype.append = function (e, t) {
							(this.$loadingMore.remove(),
								(this.loading = !1),
								e.call(this, t),
								this.showLoadingMore(t) &&
									(this.$results.append(this.$loadingMore), this.loadMoreIfNeeded()));
						}),
						(e.prototype.bind = function (e, t, n) {
							var r = this;
							(e.call(this, t, n),
								t.on("query", function (e) {
									((r.lastParams = e), (r.loading = !0));
								}),
								t.on("query:append", function (e) {
									((r.lastParams = e), (r.loading = !0));
								}),
								this.$results.on("scroll", this.loadMoreIfNeeded.bind(this)));
						}),
						(e.prototype.loadMoreIfNeeded = function () {
							var e = n.contains(document.documentElement, this.$loadingMore[0]);
							if (!this.loading && e) {
								var t = this.$results.offset().top + this.$results.outerHeight(!1);
								this.$loadingMore.offset().top + this.$loadingMore.outerHeight(!1) <= t + 50 &&
									this.loadMore();
							}
						}),
						(e.prototype.loadMore = function () {
							this.loading = !0;
							var e = n.extend({}, { page: 1 }, this.lastParams);
							(e.page++, this.trigger("query:append", e));
						}),
						(e.prototype.showLoadingMore = function (e, t) {
							return t.pagination && t.pagination.more;
						}),
						(e.prototype.createLoadingMore = function () {
							var e = n(
									'<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'
								),
								t = this.options.get("translations").get("loadingMore");
							return (e.html(t(this.lastParams)), e);
						}),
						e
					);
				}),
				e.define("select2/dropdown/attachBody", ["jquery", "../utils"], function (f, a) {
					function e(e, t, n) {
						((this.$dropdownParent = f(n.get("dropdownParent") || document.body)),
							e.call(this, t, n));
					}
					return (
						(e.prototype.bind = function (e, t, n) {
							var r = this;
							(e.call(this, t, n),
								t.on("open", function () {
									(r._showDropdown(),
										r._attachPositioningHandler(t),
										r._bindContainerResultHandlers(t));
								}),
								t.on("close", function () {
									(r._hideDropdown(), r._detachPositioningHandler(t));
								}),
								this.$dropdownContainer.on("mousedown", function (e) {
									e.stopPropagation();
								}));
						}),
						(e.prototype.destroy = function (e) {
							(e.call(this), this.$dropdownContainer.remove());
						}),
						(e.prototype.position = function (e, t, n) {
							(t.attr("class", n.attr("class")),
								t.removeClass("select2"),
								t.addClass("select2-container--open"),
								t.css({ position: "absolute", top: -999999 }),
								(this.$container = n));
						}),
						(e.prototype.render = function (e) {
							var t = f("<span></span>"),
								n = e.call(this);
							return (t.append(n), (this.$dropdownContainer = t));
						}),
						(e.prototype._hideDropdown = function (e) {
							this.$dropdownContainer.detach();
						}),
						(e.prototype._bindContainerResultHandlers = function (e, t) {
							if (!this._containerResultsHandlersBound) {
								var n = this;
								(t.on("results:all", function () {
									(n._positionDropdown(), n._resizeDropdown());
								}),
									t.on("results:append", function () {
										(n._positionDropdown(), n._resizeDropdown());
									}),
									t.on("results:message", function () {
										(n._positionDropdown(), n._resizeDropdown());
									}),
									t.on("select", function () {
										(n._positionDropdown(), n._resizeDropdown());
									}),
									t.on("unselect", function () {
										(n._positionDropdown(), n._resizeDropdown());
									}),
									(this._containerResultsHandlersBound = !0));
							}
						}),
						(e.prototype._attachPositioningHandler = function (e, t) {
							var n = this,
								r = "scroll.select2." + t.id,
								i = "resize.select2." + t.id,
								o = "orientationchange.select2." + t.id,
								s = this.$container.parents().filter(a.hasScroll);
							(s.each(function () {
								a.StoreData(this, "select2-scroll-position", {
									x: f(this).scrollLeft(),
									y: f(this).scrollTop(),
								});
							}),
								s.on(r, function (e) {
									var t = a.GetData(this, "select2-scroll-position");
									f(this).scrollTop(t.y);
								}),
								f(window).on(r + " " + i + " " + o, function (e) {
									(n._positionDropdown(), n._resizeDropdown());
								}));
						}),
						(e.prototype._detachPositioningHandler = function (e, t) {
							var n = "scroll.select2." + t.id,
								r = "resize.select2." + t.id,
								i = "orientationchange.select2." + t.id;
							(this.$container.parents().filter(a.hasScroll).off(n),
								f(window).off(n + " " + r + " " + i));
						}),
						(e.prototype._positionDropdown = function () {
							var e = f(window),
								t = this.$dropdown.hasClass("select2-dropdown--above"),
								n = this.$dropdown.hasClass("select2-dropdown--below"),
								r = null,
								i = this.$container.offset();
							i.bottom = i.top + this.$container.outerHeight(!1);
							var o = { height: this.$container.outerHeight(!1) };
							((o.top = i.top), (o.bottom = i.top + o.height));
							var s = this.$dropdown.outerHeight(!1),
								a = e.scrollTop(),
								l = e.scrollTop() + e.height(),
								c = a < i.top - s,
								u = l > i.bottom + s,
								d = { left: i.left, top: o.bottom },
								p = this.$dropdownParent;
							"static" === p.css("position") && (p = p.offsetParent());
							var h = { top: 0, left: 0 };
							((f.contains(document.body, p[0]) || p[0].isConnected) && (h = p.offset()),
								(d.top -= h.top),
								(d.left -= h.left),
								t || n || (r = "below"),
								u || !c || t ? !c && u && t && (r = "below") : (r = "above"),
								("above" == r || (t && "below" !== r)) && (d.top = o.top - h.top - s),
								null != r &&
									(this.$dropdown
										.removeClass("select2-dropdown--below select2-dropdown--above")
										.addClass("select2-dropdown--" + r),
									this.$container
										.removeClass("select2-container--below select2-container--above")
										.addClass("select2-container--" + r)),
								this.$dropdownContainer.css(d));
						}),
						(e.prototype._resizeDropdown = function () {
							var e = { width: this.$container.outerWidth(!1) + "px" };
							(this.options.get("dropdownAutoWidth") &&
								((e.minWidth = e.width), (e.position = "relative"), (e.width = "auto")),
								this.$dropdown.css(e));
						}),
						(e.prototype._showDropdown = function (e) {
							(this.$dropdownContainer.appendTo(this.$dropdownParent),
								this._positionDropdown(),
								this._resizeDropdown());
						}),
						e
					);
				}),
				e.define("select2/dropdown/minimumResultsForSearch", [], function () {
					function e(e, t, n, r) {
						((this.minimumResultsForSearch = n.get("minimumResultsForSearch")),
							this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0),
							e.call(this, t, n, r));
					}
					return (
						(e.prototype.showSearch = function (e, t) {
							return (
								!(
									(function e(t) {
										for (var n = 0, r = 0; r < t.length; r++) {
											var i = t[r];
											i.children ? (n += e(i.children)) : n++;
										}
										return n;
									})(t.data.results) < this.minimumResultsForSearch
								) && e.call(this, t)
							);
						}),
						e
					);
				}),
				e.define("select2/dropdown/selectOnClose", ["../utils"], function (o) {
					function e() {}
					return (
						(e.prototype.bind = function (e, t, n) {
							var r = this;
							(e.call(this, t, n),
								t.on("close", function (e) {
									r._handleSelectOnClose(e);
								}));
						}),
						(e.prototype._handleSelectOnClose = function (e, t) {
							if (t && null != t.originalSelect2Event) {
								var n = t.originalSelect2Event;
								if ("select" === n._type || "unselect" === n._type) return;
							}
							var r = this.getHighlightedResults();
							if (!(r.length < 1)) {
								var i = o.GetData(r[0], "data");
								(null != i.element && i.element.selected) ||
									(null == i.element && i.selected) ||
									this.trigger("select", { data: i });
							}
						}),
						e
					);
				}),
				e.define("select2/dropdown/closeOnSelect", [], function () {
					function e() {}
					return (
						(e.prototype.bind = function (e, t, n) {
							var r = this;
							(e.call(this, t, n),
								t.on("select", function (e) {
									r._selectTriggered(e);
								}),
								t.on("unselect", function (e) {
									r._selectTriggered(e);
								}));
						}),
						(e.prototype._selectTriggered = function (e, t) {
							var n = t.originalEvent;
							(n && (n.ctrlKey || n.metaKey)) ||
								this.trigger("close", { originalEvent: n, originalSelect2Event: t });
						}),
						e
					);
				}),
				e.define("select2/i18n/en", [], function () {
					return {
						errorLoading: function () {
							return "The results could not be loaded.";
						},
						inputTooLong: function (e) {
							var t = e.input.length - e.maximum,
								n = "Please delete " + t + " character";
							return (1 != t && (n += "s"), n);
						},
						inputTooShort: function (e) {
							return "Please enter " + (e.minimum - e.input.length) + " or more characters";
						},
						loadingMore: function () {
							return "Loading more results…";
						},
						maximumSelected: function (e) {
							var t = "You can only select " + e.maximum + " item";
							return (1 != e.maximum && (t += "s"), t);
						},
						noResults: function () {
							return "No results found";
						},
						searching: function () {
							return "Searching…";
						},
						removeAllItems: function () {
							return "Remove all items";
						},
					};
				}),
				e.define(
					"select2/defaults",
					[
						"jquery",
						"require",
						"./results",
						"./selection/single",
						"./selection/multiple",
						"./selection/placeholder",
						"./selection/allowClear",
						"./selection/search",
						"./selection/eventRelay",
						"./utils",
						"./translation",
						"./diacritics",
						"./data/select",
						"./data/array",
						"./data/ajax",
						"./data/tags",
						"./data/tokenizer",
						"./data/minimumInputLength",
						"./data/maximumInputLength",
						"./data/maximumSelectionLength",
						"./dropdown",
						"./dropdown/search",
						"./dropdown/hidePlaceholder",
						"./dropdown/infiniteScroll",
						"./dropdown/attachBody",
						"./dropdown/minimumResultsForSearch",
						"./dropdown/selectOnClose",
						"./dropdown/closeOnSelect",
						"./i18n/en",
					],
					function (
						c,
						u,
						d,
						p,
						h,
						f,
						g,
						m,
						v,
						y,
						s,
						t,
						_,
						$,
						b,
						w,
						A,
						x,
						D,
						S,
						E,
						C,
						O,
						T,
						q,
						L,
						I,
						j,
						e
					) {
						function n() {
							this.reset();
						}
						return (
							(n.prototype.apply = function (e) {
								if (null == (e = c.extend(!0, {}, this.defaults, e)).dataAdapter) {
									if (
										(null != e.ajax
											? (e.dataAdapter = b)
											: null != e.data
												? (e.dataAdapter = $)
												: (e.dataAdapter = _),
										0 < e.minimumInputLength && (e.dataAdapter = y.Decorate(e.dataAdapter, x)),
										0 < e.maximumInputLength && (e.dataAdapter = y.Decorate(e.dataAdapter, D)),
										0 < e.maximumSelectionLength && (e.dataAdapter = y.Decorate(e.dataAdapter, S)),
										e.tags && (e.dataAdapter = y.Decorate(e.dataAdapter, w)),
										(null == e.tokenSeparators && null == e.tokenizer) ||
											(e.dataAdapter = y.Decorate(e.dataAdapter, A)),
										null != e.query)
									) {
										var t = u(e.amdBase + "compat/query");
										e.dataAdapter = y.Decorate(e.dataAdapter, t);
									}
									if (null != e.initSelection) {
										var n = u(e.amdBase + "compat/initSelection");
										e.dataAdapter = y.Decorate(e.dataAdapter, n);
									}
								}
								if (
									(null == e.resultsAdapter &&
										((e.resultsAdapter = d),
										null != e.ajax && (e.resultsAdapter = y.Decorate(e.resultsAdapter, T)),
										null != e.placeholder && (e.resultsAdapter = y.Decorate(e.resultsAdapter, O)),
										e.selectOnClose && (e.resultsAdapter = y.Decorate(e.resultsAdapter, I))),
									null == e.dropdownAdapter)
								) {
									if (e.multiple) e.dropdownAdapter = E;
									else {
										var r = y.Decorate(E, C);
										e.dropdownAdapter = r;
									}
									if (
										(0 !== e.minimumResultsForSearch &&
											(e.dropdownAdapter = y.Decorate(e.dropdownAdapter, L)),
										e.closeOnSelect && (e.dropdownAdapter = y.Decorate(e.dropdownAdapter, j)),
										null != e.dropdownCssClass ||
											null != e.dropdownCss ||
											null != e.adaptDropdownCssClass)
									) {
										var i = u(e.amdBase + "compat/dropdownCss");
										e.dropdownAdapter = y.Decorate(e.dropdownAdapter, i);
									}
									e.dropdownAdapter = y.Decorate(e.dropdownAdapter, q);
								}
								if (null == e.selectionAdapter) {
									if (
										(e.multiple ? (e.selectionAdapter = h) : (e.selectionAdapter = p),
										null != e.placeholder &&
											(e.selectionAdapter = y.Decorate(e.selectionAdapter, f)),
										e.allowClear && (e.selectionAdapter = y.Decorate(e.selectionAdapter, g)),
										e.multiple && (e.selectionAdapter = y.Decorate(e.selectionAdapter, m)),
										null != e.containerCssClass ||
											null != e.containerCss ||
											null != e.adaptContainerCssClass)
									) {
										var o = u(e.amdBase + "compat/containerCss");
										e.selectionAdapter = y.Decorate(e.selectionAdapter, o);
									}
									e.selectionAdapter = y.Decorate(e.selectionAdapter, v);
								}
								((e.language = this._resolveLanguage(e.language)), e.language.push("en"));
								for (var s = [], a = 0; a < e.language.length; a++) {
									var l = e.language[a];
									-1 === s.indexOf(l) && s.push(l);
								}
								return (
									(e.language = s),
									(e.translations = this._processTranslations(e.language, e.debug)),
									e
								);
							}),
							(n.prototype.reset = function () {
								function a(e) {
									return e.replace(/[^\u0000-\u007E]/g, function (e) {
										return t[e] || e;
									});
								}
								this.defaults = {
									amdBase: "./",
									amdLanguageBase: "./i18n/",
									closeOnSelect: !0,
									debug: !1,
									dropdownAutoWidth: !1,
									escapeMarkup: y.escapeMarkup,
									language: {},
									matcher: function e(t, n) {
										if ("" === c.trim(t.term)) return n;
										if (n.children && 0 < n.children.length) {
											for (var r = c.extend(!0, {}, n), i = n.children.length - 1; 0 <= i; i--)
												null == e(t, n.children[i]) && r.children.splice(i, 1);
											return 0 < r.children.length ? r : e(t, r);
										}
										var o = a(n.text).toUpperCase(),
											s = a(t.term).toUpperCase();
										return -1 < o.indexOf(s) ? n : null;
									},
									minimumInputLength: 0,
									maximumInputLength: 0,
									maximumSelectionLength: 0,
									minimumResultsForSearch: 0,
									selectOnClose: !1,
									scrollAfterSelect: !1,
									sorter: function (e) {
										return e;
									},
									templateResult: function (e) {
										return e.text;
									},
									templateSelection: function (e) {
										return e.text;
									},
									theme: "default",
									width: "resolve",
								};
							}),
							(n.prototype.applyFromElement = function (e, t) {
								var n = e.language,
									r = this.defaults.language,
									i = t.prop("lang"),
									o = t.closest("[lang]").prop("lang"),
									s = Array.prototype.concat.call(
										this._resolveLanguage(i),
										this._resolveLanguage(n),
										this._resolveLanguage(r),
										this._resolveLanguage(o)
									);
								return ((e.language = s), e);
							}),
							(n.prototype._resolveLanguage = function (e) {
								if (!e) return [];
								if (c.isEmptyObject(e)) return [];
								if (c.isPlainObject(e)) return [e];
								var t;
								t = c.isArray(e) ? e : [e];
								for (var n = [], r = 0; r < t.length; r++)
									if ((n.push(t[r]), "string" == typeof t[r] && 0 < t[r].indexOf("-"))) {
										var i = t[r].split("-")[0];
										n.push(i);
									}
								return n;
							}),
							(n.prototype._processTranslations = function (e, t) {
								for (var n = new s(), r = 0; r < e.length; r++) {
									var i = new s(),
										o = e[r];
									if ("string" == typeof o)
										try {
											i = s.loadPath(o);
										} catch (e) {
											try {
												((o = this.defaults.amdLanguageBase + o), (i = s.loadPath(o)));
											} catch (e) {
												t &&
													window.console &&
													console.warn &&
													console.warn(
														'Select2: The language file for "' +
															o +
															'" could not be automatically loaded. A fallback will be used instead.'
													);
											}
										}
									else i = c.isPlainObject(o) ? new s(o) : o;
									n.extend(i);
								}
								return n;
							}),
							(n.prototype.set = function (e, t) {
								var n = {};
								n[c.camelCase(e)] = t;
								var r = y._convertData(n);
								c.extend(!0, this.defaults, r);
							}),
							new n()
						);
					}
				),
				e.define(
					"select2/options",
					["require", "jquery", "./defaults", "./utils"],
					function (r, d, i, p) {
						function e(e, t) {
							if (
								((this.options = e),
								null != t && this.fromElement(t),
								null != t && (this.options = i.applyFromElement(this.options, t)),
								(this.options = i.apply(this.options)),
								t && t.is("input"))
							) {
								var n = r(this.get("amdBase") + "compat/inputData");
								this.options.dataAdapter = p.Decorate(this.options.dataAdapter, n);
							}
						}
						return (
							(e.prototype.fromElement = function (e) {
								var t = ["select2"];
								(null == this.options.multiple && (this.options.multiple = e.prop("multiple")),
									null == this.options.disabled && (this.options.disabled = e.prop("disabled")),
									null == this.options.dir &&
										(e.prop("dir")
											? (this.options.dir = e.prop("dir"))
											: e.closest("[dir]").prop("dir")
												? (this.options.dir = e.closest("[dir]").prop("dir"))
												: (this.options.dir = "ltr")),
									e.prop("disabled", this.options.disabled),
									e.prop("multiple", this.options.multiple),
									p.GetData(e[0], "select2Tags") &&
										(this.options.debug &&
											window.console &&
											console.warn &&
											console.warn(
												'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'
											),
										p.StoreData(e[0], "data", p.GetData(e[0], "select2Tags")),
										p.StoreData(e[0], "tags", !0)),
									p.GetData(e[0], "ajaxUrl") &&
										(this.options.debug &&
											window.console &&
											console.warn &&
											console.warn(
												"Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."
											),
										e.attr("ajax--url", p.GetData(e[0], "ajaxUrl")),
										p.StoreData(e[0], "ajax-Url", p.GetData(e[0], "ajaxUrl"))));
								var n = {};
								function r(e, t) {
									return t.toUpperCase();
								}
								for (var i = 0; i < e[0].attributes.length; i++) {
									var o = e[0].attributes[i].name,
										s = "data-";
									if (o.substr(0, s.length) == s) {
										var a = o.substring(s.length),
											l = p.GetData(e[0], a);
										n[a.replace(/-([a-z])/g, r)] = l;
									}
								}
								d.fn.jquery &&
									"1." == d.fn.jquery.substr(0, 2) &&
									e[0].dataset &&
									(n = d.extend(!0, {}, e[0].dataset, n));
								var c = d.extend(!0, {}, p.GetData(e[0]), n);
								for (var u in (c = p._convertData(c)))
									-1 < d.inArray(u, t) ||
										(d.isPlainObject(this.options[u])
											? d.extend(this.options[u], c[u])
											: (this.options[u] = c[u]));
								return this;
							}),
							(e.prototype.get = function (e) {
								return this.options[e];
							}),
							(e.prototype.set = function (e, t) {
								this.options[e] = t;
							}),
							e
						);
					}
				),
				e.define(
					"select2/core",
					["jquery", "./options", "./utils", "./keys"],
					function (o, c, u, r) {
						var d = function (e, t) {
							(null != u.GetData(e[0], "select2") && u.GetData(e[0], "select2").destroy(),
								(this.$element = e),
								(this.id = this._generateId(e)),
								(t = t || {}),
								(this.options = new c(t, e)),
								d.__super__.constructor.call(this));
							var n = e.attr("tabindex") || 0;
							(u.StoreData(e[0], "old-tabindex", n), e.attr("tabindex", "-1"));
							var r = this.options.get("dataAdapter");
							this.dataAdapter = new r(e, this.options);
							var i = this.render();
							this._placeContainer(i);
							var o = this.options.get("selectionAdapter");
							((this.selection = new o(e, this.options)),
								(this.$selection = this.selection.render()),
								this.selection.position(this.$selection, i));
							var s = this.options.get("dropdownAdapter");
							((this.dropdown = new s(e, this.options)),
								(this.$dropdown = this.dropdown.render()),
								this.dropdown.position(this.$dropdown, i));
							var a = this.options.get("resultsAdapter");
							((this.results = new a(e, this.options, this.dataAdapter)),
								(this.$results = this.results.render()),
								this.results.position(this.$results, this.$dropdown));
							var l = this;
							(this._bindAdapters(),
								this._registerDomEvents(),
								this._registerDataEvents(),
								this._registerSelectionEvents(),
								this._registerDropdownEvents(),
								this._registerResultsEvents(),
								this._registerEvents(),
								this.dataAdapter.current(function (e) {
									l.trigger("selection:update", { data: e });
								}),
								e.addClass("select2-hidden-accessible"),
								e.attr("aria-hidden", "true"),
								this._syncAttributes(),
								u.StoreData(e[0], "select2", this),
								e.data("select2", this));
						};
						return (
							u.Extend(d, u.Observable),
							(d.prototype._generateId = function (e) {
								return (
									"select2-" +
									(null != e.attr("id")
										? e.attr("id")
										: null != e.attr("name")
											? e.attr("name") + "-" + u.generateChars(2)
											: u.generateChars(4)
									).replace(/(:|\.|\[|\]|,)/g, "")
								);
							}),
							(d.prototype._placeContainer = function (e) {
								e.insertAfter(this.$element);
								var t = this._resolveWidth(this.$element, this.options.get("width"));
								null != t && e.css("width", t);
							}),
							(d.prototype._resolveWidth = function (e, t) {
								var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
								if ("resolve" == t) {
									var r = this._resolveWidth(e, "style");
									return null != r ? r : this._resolveWidth(e, "element");
								}
								if ("element" == t) {
									var i = e.outerWidth(!1);
									return i <= 0 ? "auto" : i + "px";
								}
								if ("style" != t)
									return "computedstyle" != t ? t : window.getComputedStyle(e[0]).width;
								var o = e.attr("style");
								if ("string" != typeof o) return null;
								for (var s = o.split(";"), a = 0, l = s.length; a < l; a += 1) {
									var c = s[a].replace(/\s/g, "").match(n);
									if (null !== c && 1 <= c.length) return c[1];
								}
								return null;
							}),
							(d.prototype._bindAdapters = function () {
								(this.dataAdapter.bind(this, this.$container),
									this.selection.bind(this, this.$container),
									this.dropdown.bind(this, this.$container),
									this.results.bind(this, this.$container));
							}),
							(d.prototype._registerDomEvents = function () {
								var t = this;
								(this.$element.on("change.select2", function () {
									t.dataAdapter.current(function (e) {
										t.trigger("selection:update", { data: e });
									});
								}),
									this.$element.on("focus.select2", function (e) {
										t.trigger("focus", e);
									}),
									(this._syncA = u.bind(this._syncAttributes, this)),
									(this._syncS = u.bind(this._syncSubtree, this)),
									this.$element[0].attachEvent &&
										this.$element[0].attachEvent("onpropertychange", this._syncA));
								var e =
									window.MutationObserver ||
									window.WebKitMutationObserver ||
									window.MozMutationObserver;
								null != e
									? ((this._observer = new e(function (e) {
											(t._syncA(), t._syncS(null, e));
										})),
										this._observer.observe(this.$element[0], {
											attributes: !0,
											childList: !0,
											subtree: !1,
										}))
									: this.$element[0].addEventListener &&
										(this.$element[0].addEventListener("DOMAttrModified", t._syncA, !1),
										this.$element[0].addEventListener("DOMNodeInserted", t._syncS, !1),
										this.$element[0].addEventListener("DOMNodeRemoved", t._syncS, !1));
							}),
							(d.prototype._registerDataEvents = function () {
								var n = this;
								this.dataAdapter.on("*", function (e, t) {
									n.trigger(e, t);
								});
							}),
							(d.prototype._registerSelectionEvents = function () {
								var n = this,
									r = ["toggle", "focus"];
								(this.selection.on("toggle", function () {
									n.toggleDropdown();
								}),
									this.selection.on("focus", function (e) {
										n.focus(e);
									}),
									this.selection.on("*", function (e, t) {
										-1 === o.inArray(e, r) && n.trigger(e, t);
									}));
							}),
							(d.prototype._registerDropdownEvents = function () {
								var n = this;
								this.dropdown.on("*", function (e, t) {
									n.trigger(e, t);
								});
							}),
							(d.prototype._registerResultsEvents = function () {
								var n = this;
								this.results.on("*", function (e, t) {
									n.trigger(e, t);
								});
							}),
							(d.prototype._registerEvents = function () {
								var n = this;
								(this.on("open", function () {
									n.$container.addClass("select2-container--open");
								}),
									this.on("close", function () {
										n.$container.removeClass("select2-container--open");
									}),
									this.on("enable", function () {
										n.$container.removeClass("select2-container--disabled");
									}),
									this.on("disable", function () {
										n.$container.addClass("select2-container--disabled");
									}),
									this.on("blur", function () {
										n.$container.removeClass("select2-container--focus");
									}),
									this.on("query", function (t) {
										(n.isOpen() || n.trigger("open", {}),
											this.dataAdapter.query(t, function (e) {
												n.trigger("results:all", { data: e, query: t });
											}));
									}),
									this.on("query:append", function (t) {
										this.dataAdapter.query(t, function (e) {
											n.trigger("results:append", { data: e, query: t });
										});
									}),
									this.on("keypress", function (e) {
										var t = e.which;
										n.isOpen()
											? t === r.ESC || t === r.TAB || (t === r.UP && e.altKey)
												? (n.close(e), e.preventDefault())
												: t === r.ENTER
													? (n.trigger("results:select", {}), e.preventDefault())
													: t === r.SPACE && e.ctrlKey
														? (n.trigger("results:toggle", {}), e.preventDefault())
														: t === r.UP
															? (n.trigger("results:previous", {}), e.preventDefault())
															: t === r.DOWN && (n.trigger("results:next", {}), e.preventDefault())
											: (t === r.ENTER || t === r.SPACE || (t === r.DOWN && e.altKey)) &&
												(n.open(), e.preventDefault());
									}));
							}),
							(d.prototype._syncAttributes = function () {
								(this.options.set("disabled", this.$element.prop("disabled")),
									this.isDisabled()
										? (this.isOpen() && this.close(), this.trigger("disable", {}))
										: this.trigger("enable", {}));
							}),
							(d.prototype._isChangeMutation = function (e, t) {
								var n = !1,
									r = this;
								if (
									!e ||
									!e.target ||
									"OPTION" === e.target.nodeName ||
									"OPTGROUP" === e.target.nodeName
								) {
									if (t)
										if (t.addedNodes && 0 < t.addedNodes.length)
											for (var i = 0; i < t.addedNodes.length; i++) {
												t.addedNodes[i].selected && (n = !0);
											}
										else
											t.removedNodes && 0 < t.removedNodes.length
												? (n = !0)
												: o.isArray(t) &&
													o.each(t, function (e, t) {
														if (r._isChangeMutation(e, t)) return !(n = !0);
													});
									else n = !0;
									return n;
								}
							}),
							(d.prototype._syncSubtree = function (e, t) {
								var n = this._isChangeMutation(e, t),
									r = this;
								n &&
									this.dataAdapter.current(function (e) {
										r.trigger("selection:update", { data: e });
									});
							}),
							(d.prototype.trigger = function (e, t) {
								var n = d.__super__.trigger,
									r = {
										open: "opening",
										close: "closing",
										select: "selecting",
										unselect: "unselecting",
										clear: "clearing",
									};
								if ((void 0 === t && (t = {}), e in r)) {
									var i = r[e],
										o = { prevented: !1, name: e, args: t };
									if ((n.call(this, i, o), o.prevented)) return void (t.prevented = !0);
								}
								n.call(this, e, t);
							}),
							(d.prototype.toggleDropdown = function () {
								this.isDisabled() || (this.isOpen() ? this.close() : this.open());
							}),
							(d.prototype.open = function () {
								this.isOpen() || this.isDisabled() || this.trigger("query", {});
							}),
							(d.prototype.close = function (e) {
								this.isOpen() && this.trigger("close", { originalEvent: e });
							}),
							(d.prototype.isEnabled = function () {
								return !this.isDisabled();
							}),
							(d.prototype.isDisabled = function () {
								return this.options.get("disabled");
							}),
							(d.prototype.isOpen = function () {
								return this.$container.hasClass("select2-container--open");
							}),
							(d.prototype.hasFocus = function () {
								return this.$container.hasClass("select2-container--focus");
							}),
							(d.prototype.focus = function (e) {
								this.hasFocus() ||
									(this.$container.addClass("select2-container--focus"), this.trigger("focus", {}));
							}),
							(d.prototype.enable = function (e) {
								(this.options.get("debug") &&
									window.console &&
									console.warn &&
									console.warn(
										'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'
									),
									(null != e && 0 !== e.length) || (e = [!0]));
								var t = !e[0];
								this.$element.prop("disabled", t);
							}),
							(d.prototype.data = function () {
								this.options.get("debug") &&
									0 < arguments.length &&
									window.console &&
									console.warn &&
									console.warn(
										'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.'
									);
								var t = [];
								return (
									this.dataAdapter.current(function (e) {
										t = e;
									}),
									t
								);
							}),
							(d.prototype.val = function (e) {
								if (
									(this.options.get("debug") &&
										window.console &&
										console.warn &&
										console.warn(
											'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'
										),
									null == e || 0 === e.length)
								)
									return this.$element.val();
								var t = e[0];
								(o.isArray(t) &&
									(t = o.map(t, function (e) {
										return e.toString();
									})),
									this.$element.val(t).trigger("input").trigger("change"));
							}),
							(d.prototype.destroy = function () {
								(this.$container.remove(),
									this.$element[0].detachEvent &&
										this.$element[0].detachEvent("onpropertychange", this._syncA),
									null != this._observer
										? (this._observer.disconnect(), (this._observer = null))
										: this.$element[0].removeEventListener &&
											(this.$element[0].removeEventListener("DOMAttrModified", this._syncA, !1),
											this.$element[0].removeEventListener("DOMNodeInserted", this._syncS, !1),
											this.$element[0].removeEventListener("DOMNodeRemoved", this._syncS, !1)),
									(this._syncA = null),
									(this._syncS = null),
									this.$element.off(".select2"),
									this.$element.attr("tabindex", u.GetData(this.$element[0], "old-tabindex")),
									this.$element.removeClass("select2-hidden-accessible"),
									this.$element.attr("aria-hidden", "false"),
									u.RemoveData(this.$element[0]),
									this.$element.removeData("select2"),
									this.dataAdapter.destroy(),
									this.selection.destroy(),
									this.dropdown.destroy(),
									this.results.destroy(),
									(this.dataAdapter = null),
									(this.selection = null),
									(this.dropdown = null),
									(this.results = null));
							}),
							(d.prototype.render = function () {
								var e = o(
									'<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>'
								);
								return (
									e.attr("dir", this.options.get("dir")),
									(this.$container = e),
									this.$container.addClass("select2-container--" + this.options.get("theme")),
									u.StoreData(e[0], "element", this.$element),
									e
								);
							}),
							d
						);
					}
				),
				e.define("jquery-mousewheel", ["jquery"], function (e) {
					return e;
				}),
				e.define(
					"jquery.select2",
					[
						"jquery",
						"jquery-mousewheel",
						"./select2/core",
						"./select2/defaults",
						"./select2/utils",
					],
					function (i, e, o, t, s) {
						if (null == i.fn.select2) {
							var a = ["open", "close", "destroy"];
							i.fn.select2 = function (t) {
								if ("object" == typeof (t = t || {}))
									return (
										this.each(function () {
											var e = i.extend(!0, {}, t);
											new o(i(this), e);
										}),
										this
									);
								if ("string" != typeof t) throw new Error("Invalid arguments for Select2: " + t);
								var n,
									r = Array.prototype.slice.call(arguments, 1);
								return (
									this.each(function () {
										var e = s.GetData(this, "select2");
										(null == e &&
											window.console &&
											console.error &&
											console.error(
												"The select2('" +
													t +
													"') method was called on an element that is not using Select2."
											),
											(n = e[t].apply(e, r)));
									}),
									-1 < i.inArray(t, a) ? this : n
								);
							};
						}
						return (null == i.fn.select2.defaults && (i.fn.select2.defaults = t), o);
					}
				),
				{ define: e.define, require: e.require }
			);
		})(),
		t = e.require("jquery.select2");
	return ((u.fn.select2.amd = e), t);
});
/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") module.exports = f();
	else if (typeof define === "function" && define.amd) define([], f);
	else {
		var g;
		if (typeof window !== "undefined") g = window;
		else if (typeof global !== "undefined") g = global;
		else if (typeof self !== "undefined") g = self;
		else g = this;
		g.enquire = f();
	}
})(function () {
	var define, module, exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a) return a(o, !0);
					if (i) return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw ((f.code = "MODULE_NOT_FOUND"), f);
				}
				var l = (n[o] = { exports: {} });
				t[o][0].call(
					l.exports,
					function (e) {
						var n = t[o][1][e];
						return s(n ? n : e);
					},
					l,
					l.exports,
					e,
					t,
					n,
					r
				);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++) s(r[o]);
		return s;
	})(
		{
			1: [
				function (require, module, exports) {
					var QueryHandler = require(3);
					var each = require(4).each;
					function MediaQuery(query, isUnconditional) {
						this.query = query;
						this.isUnconditional = isUnconditional;
						this.handlers = [];
						this.mql = window.matchMedia(query);
						var self = this;
						this.listener = function (mql) {
							self.mql = mql.currentTarget || mql;
							self.assess();
						};
						this.mql.addListener(this.listener);
					}
					MediaQuery.prototype = {
						constuctor: MediaQuery,
						addHandler: function (handler) {
							var qh = new QueryHandler(handler);
							this.handlers.push(qh);
							this.matches() && qh.on();
						},
						removeHandler: function (handler) {
							var handlers = this.handlers;
							each(handlers, function (h, i) {
								if (h.equals(handler)) {
									h.destroy();
									return !handlers.splice(i, 1);
								}
							});
						},
						matches: function () {
							return this.mql.matches || this.isUnconditional;
						},
						clear: function () {
							each(this.handlers, function (handler) {
								handler.destroy();
							});
							this.mql.removeListener(this.listener);
							this.handlers.length = 0;
						},
						assess: function () {
							var action = this.matches() ? "on" : "off";
							each(this.handlers, function (handler) {
								handler[action]();
							});
						},
					};
					module.exports = MediaQuery;
				},
				{ 3: 3, 4: 4 },
			],
			2: [
				function (require, module, exports) {
					var MediaQuery = require(1);
					var Util = require(4);
					var each = Util.each;
					var isFunction = Util.isFunction;
					var isArray = Util.isArray;
					function MediaQueryDispatch() {
						if (!window.matchMedia)
							throw new Error("matchMedia not present, legacy browsers require a polyfill");
						this.queries = {};
						this.browserIsIncapable = !window.matchMedia("only all").matches;
					}
					MediaQueryDispatch.prototype = {
						constructor: MediaQueryDispatch,
						register: function (q, options, shouldDegrade) {
							var queries = this.queries,
								isUnconditional = shouldDegrade && this.browserIsIncapable;
							if (!queries[q]) queries[q] = new MediaQuery(q, isUnconditional);
							if (isFunction(options)) options = { match: options };
							if (!isArray(options)) options = [options];
							each(options, function (handler) {
								if (isFunction(handler)) handler = { match: handler };
								queries[q].addHandler(handler);
							});
							return this;
						},
						unregister: function (q, handler) {
							var query = this.queries[q];
							if (query)
								if (handler) query.removeHandler(handler);
								else {
									query.clear();
									delete this.queries[q];
								}
							return this;
						},
					};
					module.exports = MediaQueryDispatch;
				},
				{ 1: 1, 4: 4 },
			],
			3: [
				function (require, module, exports) {
					function QueryHandler(options) {
						this.options = options;
						!options.deferSetup && this.setup();
					}
					QueryHandler.prototype = {
						constructor: QueryHandler,
						setup: function () {
							if (this.options.setup) this.options.setup();
							this.initialised = true;
						},
						on: function () {
							!this.initialised && this.setup();
							this.options.match && this.options.match();
						},
						off: function () {
							this.options.unmatch && this.options.unmatch();
						},
						destroy: function () {
							this.options.destroy ? this.options.destroy() : this.off();
						},
						equals: function (target) {
							return this.options === target || this.options.match === target;
						},
					};
					module.exports = QueryHandler;
				},
				{},
			],
			4: [
				function (require, module, exports) {
					function each(collection, fn) {
						var i = 0,
							length = collection.length,
							cont;
						for (i; i < length; i++) {
							cont = fn(collection[i], i);
							if (cont === false) break;
						}
					}
					function isArray(target) {
						return Object.prototype.toString.apply(target) === "[object Array]";
					}
					function isFunction(target) {
						return typeof target === "function";
					}
					module.exports = { isFunction, isArray, each };
				},
				{},
			],
			5: [
				function (require, module, exports) {
					var MediaQueryDispatch = require(2);
					module.exports = new MediaQueryDispatch();
				},
				{ 2: 2 },
			],
		},
		{},
		[5]
	)(5);
});
(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) define(["jquery"], factory);
	else if (typeof module === "object" && module.exports)
		module.exports = function (root, jQuery) {
			if (jQuery === undefined)
				if (typeof window !== "undefined") jQuery = require("jquery");
				else jQuery = require("jquery")(root);
			factory(jQuery);
			return jQuery;
		};
	else factory(jQuery);
})(function ($) {
	"use strict";
	var Slick = window.Slick || {};
	Slick = (function () {
		var instanceUid = 0;
		function Slick(element, settings) {
			var _ = this,
				dataSettings;
			_.defaults = {
				accessibility: true,
				adaptiveHeight: false,
				appendArrows: $(element),
				appendDots: $(element),
				arrows: true,
				asNavFor: null,
				prevArrow:
					'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
				nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: "50px",
				cssEase: "ease",
				customPaging: function (slider, i) {
					return $('<button type="button"></button>').text(i + 1);
				},
				dots: false,
				dotsClass: "slick-dots",
				draggable: true,
				easing: "linear",
				edgeFriction: 0.35,
				fade: false,
				focusOnSelect: false,
				focusOnChange: false,
				infinite: true,
				initialSlide: 0,
				lazyLoad: "ondemand",
				mobileFirst: false,
				pauseOnHover: true,
				pauseOnFocus: true,
				pauseOnDotsHover: false,
				respondTo: "window",
				responsive: null,
				rows: 1,
				rtl: false,
				slide: "",
				slidesPerRow: 1,
				slidesToShow: 1,
				slidesToScroll: 1,
				speed: 500,
				swipe: true,
				swipeToSlide: false,
				touchMove: true,
				touchThreshold: 5,
				useCSS: true,
				useTransform: true,
				variableWidth: false,
				vertical: false,
				verticalSwiping: false,
				waitForAnimate: true,
				zIndex: 1000,
			};
			_.initials = {
				animating: false,
				dragging: false,
				autoPlayTimer: null,
				currentDirection: 0,
				currentLeft: null,
				currentSlide: 0,
				direction: 1,
				$dots: null,
				listWidth: null,
				listHeight: null,
				loadIndex: 0,
				$nextArrow: null,
				$prevArrow: null,
				scrolling: false,
				slideCount: null,
				slideWidth: null,
				$slideTrack: null,
				$slides: null,
				sliding: false,
				slideOffset: 0,
				swipeLeft: null,
				swiping: false,
				$list: null,
				touchObject: {},
				transformsEnabled: false,
				unslicked: false,
			};
			$.extend(_, _.initials);
			_.activeBreakpoint = null;
			_.animType = null;
			_.animProp = null;
			_.breakpoints = [];
			_.breakpointSettings = [];
			_.cssTransitions = false;
			_.focussed = false;
			_.interrupted = false;
			_.hidden = "hidden";
			_.paused = true;
			_.positionProp = null;
			_.respondTo = null;
			_.rowCount = 1;
			_.shouldClick = true;
			_.$slider = $(element);
			_.$slidesCache = null;
			_.transformType = null;
			_.transitionType = null;
			_.visibilityChange = "visibilitychange";
			_.windowWidth = 0;
			_.windowTimer = null;
			dataSettings = $(element).data("slick") || {};
			_.options = $.extend({}, _.defaults, settings, dataSettings);
			_.currentSlide = _.options.initialSlide;
			_.originalSettings = _.options;
			_.autoPlay = $.proxy(_.autoPlay, _);
			_.autoPlayClear = $.proxy(_.autoPlayClear, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.clickHandler = $.proxy(_.clickHandler, _);
			_.selectHandler = $.proxy(_.selectHandler, _);
			_.setPosition = $.proxy(_.setPosition, _);
			_.swipeHandler = $.proxy(_.swipeHandler, _);
			_.dragHandler = $.proxy(_.dragHandler, _);
			_.keyHandler = $.proxy(_.keyHandler, _);
			_.instanceUid = instanceUid++;
			_.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
			_.registerBreakpoints();
			_.init(true);
		}
		return Slick;
	})();
	Slick.prototype.activateADA = function () {
		var _ = this;
		_.$slideTrack
			.find(".slick-active")
			.attr({ "aria-hidden": "false", tabindex: "0" })
			.find("a, input, button, select")
			.attr({ tabindex: "0" });
	};
	Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
		var _ = this;
		if (typeof index === "boolean") {
			addBefore = index;
			index = null;
		} else {
			if (index < 0 || index >= _.slideCount) return false;
		}
		_.unload();
		if (typeof index === "number")
			if (index === 0 && _.$slides.length === 0) $(markup).appendTo(_.$slideTrack);
			else if (addBefore) $(markup).insertBefore(_.$slides.eq(index));
			else $(markup).insertAfter(_.$slides.eq(index));
		else if (addBefore === true) $(markup).prependTo(_.$slideTrack);
		else $(markup).appendTo(_.$slideTrack);
		_.$slides = _.$slideTrack.children(this.options.slide);
		_.$slideTrack.children(this.options.slide).detach();
		_.$slideTrack.append(_.$slides);
		_.$slides.each(function (index, element) {
			$(element).attr("data-slick-index", index);
		});
		_.$slidesCache = _.$slides;
		_.reinit();
	};
	Slick.prototype.animateHeight = function () {
		var _ = this;
		if (
			_.options.slidesToShow === 1 &&
			_.options.adaptiveHeight === true &&
			_.options.vertical === false
		) {
			var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
			_.$list.animate({ height: targetHeight }, _.options.speed);
		}
	};
	Slick.prototype.animateSlide = function (targetLeft, callback) {
		var animProps = {},
			_ = this;
		_.animateHeight();
		if (_.options.rtl === true && _.options.vertical === false) targetLeft = -targetLeft;
		if (_.transformsEnabled === false)
			if (_.options.vertical === false)
				_.$slideTrack.animate({ left: targetLeft }, _.options.speed, _.options.easing, callback);
			else _.$slideTrack.animate({ top: targetLeft }, _.options.speed, _.options.easing, callback);
		else if (_.cssTransitions === false) {
			if (_.options.rtl === true) _.currentLeft = -_.currentLeft;
			$({ animStart: _.currentLeft }).animate(
				{ animStart: targetLeft },
				{
					duration: _.options.speed,
					easing: _.options.easing,
					step: function (now) {
						now = Math.ceil(now);
						if (_.options.vertical === false) {
							animProps[_.animType] = "translate(" + now + "px, 0px)";
							_.$slideTrack.css(animProps);
						} else {
							animProps[_.animType] = "translate(0px," + now + "px)";
							_.$slideTrack.css(animProps);
						}
					},
					complete: function () {
						if (callback) callback.call();
					},
				}
			);
		} else {
			_.applyTransition();
			targetLeft = Math.ceil(targetLeft);
			if (_.options.vertical === false)
				animProps[_.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)";
			else animProps[_.animType] = "translate3d(0px," + targetLeft + "px, 0px)";
			_.$slideTrack.css(animProps);
			if (callback)
				setTimeout(function () {
					_.disableTransition();
					callback.call();
				}, _.options.speed);
		}
	};
	Slick.prototype.getNavTarget = function () {
		var _ = this,
			asNavFor = _.options.asNavFor;
		if (asNavFor && asNavFor !== null) asNavFor = $(asNavFor).not(_.$slider);
		return asNavFor;
	};
	Slick.prototype.asNavFor = function (index) {
		var _ = this,
			asNavFor = _.getNavTarget();
		if (asNavFor !== null && typeof asNavFor === "object")
			asNavFor.each(function () {
				var target = $(this).slick("getSlick");
				if (!target.unslicked) target.slideHandler(index, true);
			});
	};
	Slick.prototype.applyTransition = function (slide) {
		var _ = this,
			transition = {};
		if (_.options.fade === false)
			transition[_.transitionType] =
				_.transformType + " " + _.options.speed + "ms " + _.options.cssEase;
		else transition[_.transitionType] = "opacity " + _.options.speed + "ms " + _.options.cssEase;
		if (_.options.fade === false) _.$slideTrack.css(transition);
		else _.$slides.eq(slide).css(transition);
	};
	Slick.prototype.autoPlay = function () {
		var _ = this;
		_.autoPlayClear();
		if (_.slideCount > _.options.slidesToShow)
			_.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
	};
	Slick.prototype.autoPlayClear = function () {
		var _ = this;
		if (_.autoPlayTimer) clearInterval(_.autoPlayTimer);
	};
	Slick.prototype.autoPlayIterator = function () {
		var _ = this,
			slideTo = _.currentSlide + _.options.slidesToScroll;
		if (!_.paused && !_.interrupted && !_.focussed) {
			if (_.options.infinite === false)
				if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) _.direction = 0;
				else {
					if (_.direction === 0) {
						slideTo = _.currentSlide - _.options.slidesToScroll;
						if (_.currentSlide - 1 === 0) _.direction = 1;
					}
				}
			_.slideHandler(slideTo);
		}
	};
	Slick.prototype.buildArrows = function () {
		var _ = this;
		if (_.options.arrows === true) {
			_.$prevArrow = $(_.options.prevArrow).addClass("slick-arrow");
			_.$nextArrow = $(_.options.nextArrow).addClass("slick-arrow");
			if (_.slideCount > _.options.slidesToShow) {
				_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");
				_.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");
				if (_.htmlExpr.test(_.options.prevArrow)) _.$prevArrow.prependTo(_.options.appendArrows);
				if (_.htmlExpr.test(_.options.nextArrow)) _.$nextArrow.appendTo(_.options.appendArrows);
				if (_.options.infinite !== true)
					_.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
			} else
				_.$prevArrow
					.add(_.$nextArrow)
					.addClass("slick-hidden")
					.attr({ "aria-disabled": "true", tabindex: "-1" });
		}
	};
	Slick.prototype.buildDots = function () {
		var _ = this,
			i,
			dot;
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			_.$slider.addClass("slick-dotted");
			dot = $("<ul></ul>").addClass(_.options.dotsClass);
			for (i = 0; i <= _.getDotCount(); i += 1)
				dot.append($("<li></li>").append(_.options.customPaging.call(this, _, i)));
			_.$dots = dot.appendTo(_.options.appendDots);
			_.$dots.find("li").first().addClass("slick-active");
		}
	};
	Slick.prototype.buildOut = function () {
		var _ = this;
		_.$slides = _.$slider.children(_.options.slide + ":not(.slick-cloned)").addClass("slick-slide");
		_.slideCount = _.$slides.length;
		_.$slides.each(function (index, element) {
			$(element)
				.attr("data-slick-index", index)
				.data("originalStyling", $(element).attr("style") || "");
		});
		_.$slider.addClass("slick-slider");
		_.$slideTrack =
			_.slideCount === 0
				? $('<div class="slick-track"></div>').appendTo(_.$slider)
				: _.$slides.wrapAll('<div class="slick-track"></div>').parent();
		_.$list = _.$slideTrack.wrap('<div class="slick-list"></div>').parent();
		_.$slideTrack.css("opacity", 0);
		if (_.options.centerMode === true || _.options.swipeToSlide === true)
			_.options.slidesToScroll = 1;
		$("img[data-lazy]", _.$slider).not("[src]").addClass("slick-loading");
		_.setupInfinite();
		_.buildArrows();
		_.buildDots();
		_.updateDots();
		_.setSlideClasses(typeof _.currentSlide === "number" ? _.currentSlide : 0);
		if (_.options.draggable === true) _.$list.addClass("draggable");
	};
	Slick.prototype.buildRows = function () {
		var _ = this,
			a,
			b,
			c,
			newSlides,
			numOfSlides,
			originalSlides,
			slidesPerSection;
		newSlides = document.createDocumentFragment();
		originalSlides = _.$slider.children();
		if (_.options.rows > 0) {
			slidesPerSection = _.options.slidesPerRow * _.options.rows;
			numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);
			for (a = 0; a < numOfSlides; a++) {
				var slide = document.createElement("div");
				for (b = 0; b < _.options.rows; b++) {
					var row = document.createElement("div");
					for (c = 0; c < _.options.slidesPerRow; c++) {
						var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
						if (originalSlides.get(target)) row.appendChild(originalSlides.get(target));
					}
					slide.appendChild(row);
				}
				newSlides.appendChild(slide);
			}
			_.$slider.empty().append(newSlides);
			_.$slider
				.children()
				.children()
				.children()
				.css({ width: 100 / _.options.slidesPerRow + "%", display: "inline-block" });
		}
	};
	Slick.prototype.checkResponsive = function (initial, forceUpdate) {
		var _ = this,
			breakpoint,
			targetBreakpoint,
			respondToWidth,
			triggerBreakpoint = false;
		var sliderWidth = _.$slider.width();
		var windowWidth = window.innerWidth || $(window).width();
		if (_.respondTo === "window") respondToWidth = windowWidth;
		else if (_.respondTo === "slider") respondToWidth = sliderWidth;
		else {
			if (_.respondTo === "min") respondToWidth = Math.min(windowWidth, sliderWidth);
		}
		if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
			targetBreakpoint = null;
			for (breakpoint in _.breakpoints)
				if (_.breakpoints.hasOwnProperty(breakpoint))
					if (_.originalSettings.mobileFirst === false) {
						if (respondToWidth < _.breakpoints[breakpoint])
							targetBreakpoint = _.breakpoints[breakpoint];
					} else {
						if (respondToWidth > _.breakpoints[breakpoint])
							targetBreakpoint = _.breakpoints[breakpoint];
					}
			if (targetBreakpoint !== null)
				if (_.activeBreakpoint !== null) {
					if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
						_.activeBreakpoint = targetBreakpoint;
						if (_.breakpointSettings[targetBreakpoint] === "unslick") _.unslick(targetBreakpoint);
						else {
							_.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
							if (initial === true) _.currentSlide = _.options.initialSlide;
							_.refresh(initial);
						}
						triggerBreakpoint = targetBreakpoint;
					}
				} else {
					_.activeBreakpoint = targetBreakpoint;
					if (_.breakpointSettings[targetBreakpoint] === "unslick") _.unslick(targetBreakpoint);
					else {
						_.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
						if (initial === true) _.currentSlide = _.options.initialSlide;
						_.refresh(initial);
					}
					triggerBreakpoint = targetBreakpoint;
				}
			else {
				if (_.activeBreakpoint !== null) {
					_.activeBreakpoint = null;
					_.options = _.originalSettings;
					if (initial === true) _.currentSlide = _.options.initialSlide;
					_.refresh(initial);
					triggerBreakpoint = targetBreakpoint;
				}
			}
			if (!initial && triggerBreakpoint !== false)
				_.$slider.trigger("breakpoint", [_, triggerBreakpoint]);
		}
	};
	Slick.prototype.changeSlide = function (event, dontAnimate) {
		var _ = this,
			$target = $(event.currentTarget),
			indexOffset,
			slideOffset,
			unevenOffset;
		if ($target.is("a")) event.preventDefault();
		if (!$target.is("li")) $target = $target.closest("li");
		unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
		indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;
		switch (event.data.message) {
			case "previous":
				slideOffset =
					indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
				if (_.slideCount > _.options.slidesToShow)
					_.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
				break;
			case "next":
				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
				if (_.slideCount > _.options.slidesToShow)
					_.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
				break;
			case "index":
				var index =
					event.data.index === 0
						? 0
						: event.data.index || $target.index() * _.options.slidesToScroll;
				_.slideHandler(_.checkNavigable(index), false, dontAnimate);
				$target.children().trigger("focus");
				break;
			default:
				return;
		}
	};
	Slick.prototype.checkNavigable = function (index) {
		var _ = this,
			navigables,
			prevNavigable;
		navigables = _.getNavigableIndexes();
		prevNavigable = 0;
		if (index > navigables[navigables.length - 1]) index = navigables[navigables.length - 1];
		else
			for (var n in navigables) {
				if (index < navigables[n]) {
					index = prevNavigable;
					break;
				}
				prevNavigable = navigables[n];
			}
		return index;
	};
	Slick.prototype.cleanUpEvents = function () {
		var _ = this;
		if (_.options.dots && _.$dots !== null) {
			$("li", _.$dots)
				.off("click.slick", _.changeSlide)
				.off("mouseenter.slick", $.proxy(_.interrupt, _, true))
				.off("mouseleave.slick", $.proxy(_.interrupt, _, false));
			if (_.options.accessibility === true) _.$dots.off("keydown.slick", _.keyHandler);
		}
		_.$slider.off("focus.slick blur.slick");
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow && _.$prevArrow.off("click.slick", _.changeSlide);
			_.$nextArrow && _.$nextArrow.off("click.slick", _.changeSlide);
			if (_.options.accessibility === true) {
				_.$prevArrow && _.$prevArrow.off("keydown.slick", _.keyHandler);
				_.$nextArrow && _.$nextArrow.off("keydown.slick", _.keyHandler);
			}
		}
		_.$list.off("touchstart.slick mousedown.slick", _.swipeHandler);
		_.$list.off("touchmove.slick mousemove.slick", _.swipeHandler);
		_.$list.off("touchend.slick mouseup.slick", _.swipeHandler);
		_.$list.off("touchcancel.slick mouseleave.slick", _.swipeHandler);
		_.$list.off("click.slick", _.clickHandler);
		$(document).off(_.visibilityChange, _.visibility);
		_.cleanUpSlideEvents();
		if (_.options.accessibility === true) _.$list.off("keydown.slick", _.keyHandler);
		if (_.options.focusOnSelect === true)
			$(_.$slideTrack).children().off("click.slick", _.selectHandler);
		$(window).off("orientationchange.slick.slick-" + _.instanceUid, _.orientationChange);
		$(window).off("resize.slick.slick-" + _.instanceUid, _.resize);
		$("[draggable!=true]", _.$slideTrack).off("dragstart", _.preventDefault);
		$(window).off("load.slick.slick-" + _.instanceUid, _.setPosition);
	};
	Slick.prototype.cleanUpSlideEvents = function () {
		var _ = this;
		_.$list.off("mouseenter.slick", $.proxy(_.interrupt, _, true));
		_.$list.off("mouseleave.slick", $.proxy(_.interrupt, _, false));
	};
	Slick.prototype.cleanUpRows = function () {
		var _ = this,
			originalSlides;
		if (_.options.rows > 0) {
			originalSlides = _.$slides.children().children();
			originalSlides.removeAttr("style");
			_.$slider.empty().append(originalSlides);
		}
	};
	Slick.prototype.clickHandler = function (event) {
		var _ = this;
		if (_.shouldClick === false) {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
		}
	};
	Slick.prototype.destroy = function (refresh) {
		var _ = this;
		_.autoPlayClear();
		_.touchObject = {};
		_.cleanUpEvents();
		$(".slick-cloned", _.$slider).detach();
		if (_.$dots) _.$dots.remove();
		if (_.$prevArrow && _.$prevArrow.length) {
			_.$prevArrow
				.removeClass("slick-disabled slick-arrow slick-hidden")
				.removeAttr("aria-hidden aria-disabled tabindex")
				.css("display", "");
			if (_.htmlExpr.test(_.options.prevArrow)) _.$prevArrow.remove();
		}
		if (_.$nextArrow && _.$nextArrow.length) {
			_.$nextArrow
				.removeClass("slick-disabled slick-arrow slick-hidden")
				.removeAttr("aria-hidden aria-disabled tabindex")
				.css("display", "");
			if (_.htmlExpr.test(_.options.nextArrow)) _.$nextArrow.remove();
		}
		if (_.$slides) {
			_.$slides
				.removeClass("slick-slide slick-active slick-center slick-visible slick-current")
				.removeAttr("aria-hidden")
				.removeAttr("data-slick-index")
				.each(function () {
					$(this).attr("style", $(this).data("originalStyling"));
				});
			_.$slideTrack.children(this.options.slide).detach();
			_.$slideTrack.detach();
			_.$list.detach();
			_.$slider.append(_.$slides);
		}
		_.cleanUpRows();
		_.$slider.removeClass("slick-slider");
		_.$slider.removeClass("slick-initialized");
		_.$slider.removeClass("slick-dotted");
		_.unslicked = true;
		if (!refresh) _.$slider.trigger("destroy", [_]);
	};
	Slick.prototype.disableTransition = function (slide) {
		var _ = this,
			transition = {};
		transition[_.transitionType] = "";
		if (_.options.fade === false) _.$slideTrack.css(transition);
		else _.$slides.eq(slide).css(transition);
	};
	Slick.prototype.fadeSlide = function (slideIndex, callback) {
		var _ = this;
		if (_.cssTransitions === false) {
			_.$slides.eq(slideIndex).css({ zIndex: _.options.zIndex });
			_.$slides.eq(slideIndex).animate({ opacity: 1 }, _.options.speed, _.options.easing, callback);
		} else {
			_.applyTransition(slideIndex);
			_.$slides.eq(slideIndex).css({ opacity: 1, zIndex: _.options.zIndex });
			if (callback)
				setTimeout(function () {
					_.disableTransition(slideIndex);
					callback.call();
				}, _.options.speed);
		}
	};
	Slick.prototype.fadeSlideOut = function (slideIndex) {
		var _ = this;
		if (_.cssTransitions === false)
			_.$slides
				.eq(slideIndex)
				.animate({ opacity: 0, zIndex: _.options.zIndex - 2 }, _.options.speed, _.options.easing);
		else {
			_.applyTransition(slideIndex);
			_.$slides.eq(slideIndex).css({ opacity: 0, zIndex: _.options.zIndex - 2 });
		}
	};
	Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
		var _ = this;
		if (filter !== null) {
			_.$slidesCache = _.$slides;
			_.unload();
			_.$slideTrack.children(this.options.slide).detach();
			_.$slidesCache.filter(filter).appendTo(_.$slideTrack);
			_.reinit();
		}
	};
	Slick.prototype.focusHandler = function () {
		var _ = this;
		_.$slider
			.off("focus.slick blur.slick")
			.on("focus.slick", "*", function (event) {
				var $sf = $(this);
				setTimeout(function () {
					if (_.options.pauseOnFocus)
						if ($sf.is(":focus")) {
							_.focussed = true;
							_.autoPlay();
						}
				}, 0);
			})
			.on("blur.slick", "*", function (event) {
				var $sf = $(this);
				if (_.options.pauseOnFocus) {
					_.focussed = false;
					_.autoPlay();
				}
			});
	};
	Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
		var _ = this;
		return _.currentSlide;
	};
	Slick.prototype.getDotCount = function () {
		var _ = this;
		var breakPoint = 0;
		var counter = 0;
		var pagerQty = 0;
		if (_.options.infinite === true)
			if (_.slideCount <= _.options.slidesToShow) ++pagerQty;
			else
				while (breakPoint < _.slideCount) {
					++pagerQty;
					breakPoint = counter + _.options.slidesToScroll;
					counter +=
						_.options.slidesToScroll <= _.options.slidesToShow
							? _.options.slidesToScroll
							: _.options.slidesToShow;
				}
		else if (_.options.centerMode === true) pagerQty = _.slideCount;
		else if (!_.options.asNavFor)
			pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
		else
			while (breakPoint < _.slideCount) {
				++pagerQty;
				breakPoint = counter + _.options.slidesToScroll;
				counter +=
					_.options.slidesToScroll <= _.options.slidesToShow
						? _.options.slidesToScroll
						: _.options.slidesToShow;
			}
		return pagerQty - 1;
	};
	Slick.prototype.getLeft = function (slideIndex) {
		var _ = this,
			targetLeft,
			verticalHeight,
			verticalOffset = 0,
			targetSlide,
			coef;
		_.slideOffset = 0;
		verticalHeight = _.$slides.first().outerHeight(true);
		if (_.options.infinite === true) {
			if (_.slideCount > _.options.slidesToShow) {
				_.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
				coef = -1;
				if (_.options.vertical === true && _.options.centerMode === true)
					if (_.options.slidesToShow === 2) coef = -1.5;
					else {
						if (_.options.slidesToShow === 1) coef = -2;
					}
				verticalOffset = verticalHeight * _.options.slidesToShow * coef;
			}
			if (_.slideCount % _.options.slidesToScroll !== 0)
				if (
					slideIndex + _.options.slidesToScroll > _.slideCount &&
					_.slideCount > _.options.slidesToShow
				)
					if (slideIndex > _.slideCount) {
						_.slideOffset =
							(_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
						verticalOffset =
							(_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
					} else {
						_.slideOffset = (_.slideCount % _.options.slidesToScroll) * _.slideWidth * -1;
						verticalOffset = (_.slideCount % _.options.slidesToScroll) * verticalHeight * -1;
					}
		} else {
			if (slideIndex + _.options.slidesToShow > _.slideCount) {
				_.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
				verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
			}
		}
		if (_.slideCount <= _.options.slidesToShow) {
			_.slideOffset = 0;
			verticalOffset = 0;
		}
		if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow)
			_.slideOffset =
				(_.slideWidth * Math.floor(_.options.slidesToShow)) / 2 - (_.slideWidth * _.slideCount) / 2;
		else if (_.options.centerMode === true && _.options.infinite === true)
			_.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
		else {
			if (_.options.centerMode === true) {
				_.slideOffset = 0;
				_.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
			}
		}
		if (_.options.vertical === false) targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
		else targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
		if (_.options.variableWidth === true) {
			if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false)
				targetSlide = _.$slideTrack.children(".slick-slide").eq(slideIndex);
			else
				targetSlide = _.$slideTrack
					.children(".slick-slide")
					.eq(slideIndex + _.options.slidesToShow);
			if (_.options.rtl === true)
				if (targetSlide[0])
					targetLeft =
						(_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
				else targetLeft = 0;
			else targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
			if (_.options.centerMode === true) {
				if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false)
					targetSlide = _.$slideTrack.children(".slick-slide").eq(slideIndex);
				else
					targetSlide = _.$slideTrack
						.children(".slick-slide")
						.eq(slideIndex + _.options.slidesToShow + 1);
				if (_.options.rtl === true)
					if (targetSlide[0])
						targetLeft =
							(_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
					else targetLeft = 0;
				else targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
				targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
			}
		}
		return targetLeft;
	};
	Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
		var _ = this;
		return _.options[option];
	};
	Slick.prototype.getNavigableIndexes = function () {
		var _ = this,
			breakPoint = 0,
			counter = 0,
			indexes = [],
			max;
		if (_.options.infinite === false) max = _.slideCount;
		else {
			breakPoint = _.options.slidesToScroll * -1;
			counter = _.options.slidesToScroll * -1;
			max = _.slideCount * 2;
		}
		while (breakPoint < max) {
			indexes.push(breakPoint);
			breakPoint = counter + _.options.slidesToScroll;
			counter +=
				_.options.slidesToScroll <= _.options.slidesToShow
					? _.options.slidesToScroll
					: _.options.slidesToShow;
		}
		return indexes;
	};
	Slick.prototype.getSlick = function () {
		return this;
	};
	Slick.prototype.getSlideCount = function () {
		var _ = this,
			slidesTraversed,
			swipedSlide,
			swipeTarget,
			centerOffset;
		centerOffset = _.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0;
		swipeTarget = _.swipeLeft * -1 + centerOffset;
		if (_.options.swipeToSlide === true) {
			_.$slideTrack.find(".slick-slide").each(function (index, slide) {
				var slideOuterWidth, slideOffset, slideRightBoundary;
				slideOuterWidth = $(slide).outerWidth();
				slideOffset = slide.offsetLeft;
				if (_.options.centerMode !== true) slideOffset += slideOuterWidth / 2;
				slideRightBoundary = slideOffset + slideOuterWidth;
				if (swipeTarget < slideRightBoundary) {
					swipedSlide = slide;
					return false;
				}
			});
			slidesTraversed = Math.abs($(swipedSlide).attr("data-slick-index") - _.currentSlide) || 1;
			return slidesTraversed;
		} else return _.options.slidesToScroll;
	};
	Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
		var _ = this;
		_.changeSlide({ data: { message: "index", index: parseInt(slide) } }, dontAnimate);
	};
	Slick.prototype.init = function (creation) {
		var _ = this;
		if (!$(_.$slider).hasClass("slick-initialized")) {
			$(_.$slider).addClass("slick-initialized");
			_.buildRows();
			_.buildOut();
			_.setProps();
			_.startLoad();
			_.loadSlider();
			_.initializeEvents();
			_.updateArrows();
			_.updateDots();
			_.checkResponsive(true);
			_.focusHandler();
		}
		if (creation) _.$slider.trigger("init", [_]);
		if (_.options.accessibility === true) _.initADA();
		if (_.options.autoplay) {
			_.paused = false;
			_.autoPlay();
		}
	};
	Slick.prototype.initADA = function () {
		var _ = this,
			numDotGroups = Math.ceil(_.slideCount / _.options.slidesToScroll),
			tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
				return val >= 0 && val < _.slideCount;
			});
		_.$slides
			.add(_.$slideTrack.find(".slick-cloned"))
			.attr({ "aria-hidden": "true", tabindex: "-1" })
			.find("a, input, button, select")
			.attr({ tabindex: "-1" });
		if (_.$dots !== null) {
			_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function (i) {
				var slideControlIndex = tabControlIndexes.indexOf(i);
				$(this).attr({ role: "tabpanel", id: "slick-slide" + _.instanceUid + i, tabindex: -1 });
				if (slideControlIndex !== -1) {
					var ariaButtonControl = "slick-slide-control" + _.instanceUid + slideControlIndex;
					if ($("#" + ariaButtonControl).length)
						$(this).attr({ "aria-describedby": ariaButtonControl });
				}
			});
			_.$dots
				.attr("role", "tablist")
				.find("li")
				.each(function (i) {
					var mappedSlideIndex = tabControlIndexes[i];
					$(this).attr({ role: "presentation" });
					$(this)
						.find("button")
						.first()
						.attr({
							role: "tab",
							id: "slick-slide-control" + _.instanceUid + i,
							"aria-controls": "slick-slide" + _.instanceUid + mappedSlideIndex,
							"aria-label": i + 1 + " / " + numDotGroups,
							"aria-selected": null,
							tabindex: "-1",
						});
				})
				.eq(_.currentSlide)
				.find("button")
				.attr({ "aria-selected": "true", tabindex: "0" })
				.end();
		}
		for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++)
			if (_.options.focusOnChange) _.$slides.eq(i).attr({ tabindex: "0" });
			else _.$slides.eq(i).removeAttr("tabindex");
		_.activateADA();
	};
	Slick.prototype.initArrowEvents = function () {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.off("click.slick").on("click.slick", { message: "previous" }, _.changeSlide);
			_.$nextArrow.off("click.slick").on("click.slick", { message: "next" }, _.changeSlide);
			if (_.options.accessibility === true) {
				_.$prevArrow.on("keydown.slick", _.keyHandler);
				_.$nextArrow.on("keydown.slick", _.keyHandler);
			}
		}
	};
	Slick.prototype.initDotEvents = function () {
		var _ = this;
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			$("li", _.$dots).on("click.slick", { message: "index" }, _.changeSlide);
			if (_.options.accessibility === true) _.$dots.on("keydown.slick", _.keyHandler);
		}
		if (
			_.options.dots === true &&
			_.options.pauseOnDotsHover === true &&
			_.slideCount > _.options.slidesToShow
		)
			$("li", _.$dots)
				.on("mouseenter.slick", $.proxy(_.interrupt, _, true))
				.on("mouseleave.slick", $.proxy(_.interrupt, _, false));
	};
	Slick.prototype.initSlideEvents = function () {
		var _ = this;
		if (_.options.pauseOnHover) {
			_.$list.on("mouseenter.slick", $.proxy(_.interrupt, _, true));
			_.$list.on("mouseleave.slick", $.proxy(_.interrupt, _, false));
		}
	};
	Slick.prototype.initializeEvents = function () {
		var _ = this;
		_.initArrowEvents();
		_.initDotEvents();
		_.initSlideEvents();
		_.$list.on("touchstart.slick mousedown.slick", { action: "start" }, _.swipeHandler);
		_.$list.on("touchmove.slick mousemove.slick", { action: "move" }, _.swipeHandler);
		_.$list.on("touchend.slick mouseup.slick", { action: "end" }, _.swipeHandler);
		_.$list.on("touchcancel.slick mouseleave.slick", { action: "end" }, _.swipeHandler);
		_.$list.on("click.slick", _.clickHandler);
		$(document).on(_.visibilityChange, $.proxy(_.visibility, _));
		if (_.options.accessibility === true) _.$list.on("keydown.slick", _.keyHandler);
		if (_.options.focusOnSelect === true)
			$(_.$slideTrack).children().on("click.slick", _.selectHandler);
		$(window).on("orientationchange.slick.slick-" + _.instanceUid, $.proxy(_.orientationChange, _));
		$(window).on("resize.slick.slick-" + _.instanceUid, $.proxy(_.resize, _));
		$("[draggable!=true]", _.$slideTrack).on("dragstart", _.preventDefault);
		$(window).on("load.slick.slick-" + _.instanceUid, _.setPosition);
		$(_.setPosition);
	};
	Slick.prototype.initUI = function () {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.show();
			_.$nextArrow.show();
		}
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) _.$dots.show();
	};
	Slick.prototype.keyHandler = function (event) {
		var _ = this;
		if (!event.target.tagName.match("TEXTAREA|INPUT|SELECT"))
			if (event.keyCode === 37 && _.options.accessibility === true)
				_.changeSlide({ data: { message: _.options.rtl === true ? "next" : "previous" } });
			else {
				if (event.keyCode === 39 && _.options.accessibility === true)
					_.changeSlide({ data: { message: _.options.rtl === true ? "previous" : "next" } });
			}
	};
	Slick.prototype.lazyLoad = function () {
		var _ = this,
			loadRange,
			cloneRange,
			rangeStart,
			rangeEnd;
		function loadImages(imagesScope) {
			$("img[data-lazy]", imagesScope).each(function () {
				var image = $(this),
					imageSource = $(this).attr("data-lazy"),
					imageSrcSet = $(this).attr("data-srcset"),
					imageSizes = $(this).attr("data-sizes") || _.$slider.attr("data-sizes"),
					imageToLoad = document.createElement("img");
				imageToLoad.onload = function () {
					image.animate({ opacity: 0 }, 100, function () {
						if (imageSrcSet) {
							image.attr("srcset", imageSrcSet);
							if (imageSizes) image.attr("sizes", imageSizes);
						}
						image.attr("src", imageSource).animate({ opacity: 1 }, 200, function () {
							image.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
						});
						_.$slider.trigger("lazyLoaded", [_, image, imageSource]);
					});
				};
				imageToLoad.onerror = function () {
					image
						.removeAttr("data-lazy")
						.removeClass("slick-loading")
						.addClass("slick-lazyload-error");
					_.$slider.trigger("lazyLoadError", [_, image, imageSource]);
				};
				imageToLoad.src = imageSource;
			});
		}
		if (_.options.centerMode === true)
			if (_.options.infinite === true) {
				rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
				rangeEnd = rangeStart + _.options.slidesToShow + 2;
			} else {
				rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
				rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
			}
		else {
			rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
			rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
			if (_.options.fade === true) {
				if (rangeStart > 0) rangeStart--;
				if (rangeEnd <= _.slideCount) rangeEnd++;
			}
		}
		loadRange = _.$slider.find(".slick-slide").slice(rangeStart, rangeEnd);
		if (_.options.lazyLoad === "anticipated") {
			var prevSlide = rangeStart - 1,
				nextSlide = rangeEnd,
				$slides = _.$slider.find(".slick-slide");
			for (var i = 0; i < _.options.slidesToScroll; i++) {
				if (prevSlide < 0) prevSlide = _.slideCount - 1;
				loadRange = loadRange.add($slides.eq(prevSlide));
				loadRange = loadRange.add($slides.eq(nextSlide));
				prevSlide--;
				nextSlide++;
			}
		}
		loadImages(loadRange);
		if (_.slideCount <= _.options.slidesToShow) {
			cloneRange = _.$slider.find(".slick-slide");
			loadImages(cloneRange);
		} else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
			cloneRange = _.$slider.find(".slick-cloned").slice(0, _.options.slidesToShow);
			loadImages(cloneRange);
		} else {
			if (_.currentSlide === 0) {
				cloneRange = _.$slider.find(".slick-cloned").slice(_.options.slidesToShow * -1);
				loadImages(cloneRange);
			}
		}
	};
	Slick.prototype.loadSlider = function () {
		var _ = this;
		_.setPosition();
		_.$slideTrack.css({ opacity: "1" });
		_.$slider.removeClass("slick-loading");
		_.initUI();
		if (_.options.lazyLoad === "progressive") _.progressiveLazyLoad();
	};
	Slick.prototype.next = Slick.prototype.slickNext = function () {
		var _ = this;
		_.changeSlide({ data: { message: "next" } });
	};
	Slick.prototype.orientationChange = function () {
		var _ = this;
		_.checkResponsive();
		_.setPosition();
	};
	Slick.prototype.pause = Slick.prototype.slickPause = function () {
		var _ = this;
		_.autoPlayClear();
		_.paused = true;
	};
	Slick.prototype.play = Slick.prototype.slickPlay = function () {
		var _ = this;
		_.autoPlay();
		_.options.autoplay = true;
		_.paused = false;
		_.focussed = false;
		_.interrupted = false;
	};
	Slick.prototype.postSlide = function (index) {
		var _ = this;
		if (!_.unslicked) {
			_.$slider.trigger("afterChange", [_, index]);
			_.animating = false;
			if (_.slideCount > _.options.slidesToShow) _.setPosition();
			_.swipeLeft = null;
			if (_.options.autoplay) _.autoPlay();
			if (_.options.accessibility === true) {
				_.initADA();
				if (_.options.focusOnChange) {
					var $currentSlide = $(_.$slides.get(_.currentSlide));
					$currentSlide.attr("tabindex", 0).trigger("focus");
				}
			}
		}
	};
	Slick.prototype.prev = Slick.prototype.slickPrev = function () {
		var _ = this;
		_.changeSlide({ data: { message: "previous" } });
	};
	Slick.prototype.preventDefault = function (event) {
		event.preventDefault();
	};
	Slick.prototype.progressiveLazyLoad = function (tryCount) {
		tryCount = tryCount || 1;
		var _ = this,
			$imgsToLoad = $("img[data-lazy]", _.$slider),
			image,
			imageSource,
			imageSrcSet,
			imageSizes,
			imageToLoad;
		if ($imgsToLoad.length) {
			image = $imgsToLoad.first();
			imageSource = image.attr("data-lazy");
			imageSrcSet = image.attr("data-srcset");
			imageSizes = image.attr("data-sizes") || _.$slider.attr("data-sizes");
			imageToLoad = document.createElement("img");
			imageToLoad.onload = function () {
				if (imageSrcSet) {
					image.attr("srcset", imageSrcSet);
					if (imageSizes) image.attr("sizes", imageSizes);
				}
				image
					.attr("src", imageSource)
					.removeAttr("data-lazy data-srcset data-sizes")
					.removeClass("slick-loading");
				if (_.options.adaptiveHeight === true) _.setPosition();
				_.$slider.trigger("lazyLoaded", [_, image, imageSource]);
				_.progressiveLazyLoad();
			};
			imageToLoad.onerror = function () {
				if (tryCount < 3)
					setTimeout(function () {
						_.progressiveLazyLoad(tryCount + 1);
					}, 500);
				else {
					image
						.removeAttr("data-lazy")
						.removeClass("slick-loading")
						.addClass("slick-lazyload-error");
					_.$slider.trigger("lazyLoadError", [_, image, imageSource]);
					_.progressiveLazyLoad();
				}
			};
			imageToLoad.src = imageSource;
		} else _.$slider.trigger("allImagesLoaded", [_]);
	};
	Slick.prototype.refresh = function (initializing) {
		var _ = this,
			currentSlide,
			lastVisibleIndex;
		lastVisibleIndex = _.slideCount - _.options.slidesToShow;
		if (!_.options.infinite && _.currentSlide > lastVisibleIndex) _.currentSlide = lastVisibleIndex;
		if (_.slideCount <= _.options.slidesToShow) _.currentSlide = 0;
		currentSlide = _.currentSlide;
		_.destroy(true);
		$.extend(_, _.initials, { currentSlide });
		_.init();
		if (!initializing) _.changeSlide({ data: { message: "index", index: currentSlide } }, false);
	};
	Slick.prototype.registerBreakpoints = function () {
		var _ = this,
			breakpoint,
			currentBreakpoint,
			l,
			responsiveSettings = _.options.responsive || null;
		if (Array.isArray(responsiveSettings) && responsiveSettings.length) {
			_.respondTo = _.options.respondTo || "window";
			for (breakpoint in responsiveSettings) {
				l = _.breakpoints.length - 1;
				if (responsiveSettings.hasOwnProperty(breakpoint)) {
					currentBreakpoint = responsiveSettings[breakpoint].breakpoint;
					while (l >= 0) {
						if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint)
							_.breakpoints.splice(l, 1);
						l--;
					}
					_.breakpoints.push(currentBreakpoint);
					_.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
				}
			}
			_.breakpoints.sort(function (a, b) {
				return _.options.mobileFirst ? a - b : b - a;
			});
		}
	};
	Slick.prototype.reinit = function () {
		var _ = this;
		_.$slides = _.$slideTrack.children(_.options.slide).addClass("slick-slide");
		_.slideCount = _.$slides.length;
		if (_.currentSlide >= _.slideCount && _.currentSlide !== 0)
			_.currentSlide = _.currentSlide - _.options.slidesToScroll;
		if (_.slideCount <= _.options.slidesToShow) _.currentSlide = 0;
		_.registerBreakpoints();
		_.setProps();
		_.setupInfinite();
		_.buildArrows();
		_.updateArrows();
		_.initArrowEvents();
		_.buildDots();
		_.updateDots();
		_.initDotEvents();
		_.cleanUpSlideEvents();
		_.initSlideEvents();
		_.checkResponsive(false, true);
		if (_.options.focusOnSelect === true)
			$(_.$slideTrack).children().on("click.slick", _.selectHandler);
		_.setSlideClasses(typeof _.currentSlide === "number" ? _.currentSlide : 0);
		_.setPosition();
		_.focusHandler();
		_.paused = !_.options.autoplay;
		_.autoPlay();
		_.$slider.trigger("reInit", [_]);
	};
	Slick.prototype.resize = function () {
		var _ = this;
		if ($(window).width() !== _.windowWidth) {
			clearTimeout(_.windowDelay);
			_.windowDelay = window.setTimeout(function () {
				_.windowWidth = $(window).width();
				_.checkResponsive();
				if (!_.unslicked) _.setPosition();
			}, 50);
		}
	};
	Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (
		index,
		removeBefore,
		removeAll
	) {
		var _ = this;
		if (typeof index === "boolean") {
			removeBefore = index;
			index = removeBefore === true ? 0 : _.slideCount - 1;
		} else index = removeBefore === true ? --index : index;
		if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) return false;
		_.unload();
		if (removeAll === true) _.$slideTrack.children().remove();
		else _.$slideTrack.children(this.options.slide).eq(index).remove();
		_.$slides = _.$slideTrack.children(this.options.slide);
		_.$slideTrack.children(this.options.slide).detach();
		_.$slideTrack.append(_.$slides);
		_.$slidesCache = _.$slides;
		_.reinit();
	};
	Slick.prototype.setCSS = function (position) {
		var _ = this,
			positionProps = {},
			x,
			y;
		if (_.options.rtl === true) position = -position;
		x = _.positionProp == "left" ? Math.ceil(position) + "px" : "0px";
		y = _.positionProp == "top" ? Math.ceil(position) + "px" : "0px";
		positionProps[_.positionProp] = position;
		if (_.transformsEnabled === false) _.$slideTrack.css(positionProps);
		else {
			positionProps = {};
			if (_.cssTransitions === false) {
				positionProps[_.animType] = "translate(" + x + ", " + y + ")";
				_.$slideTrack.css(positionProps);
			} else {
				positionProps[_.animType] = "translate3d(" + x + ", " + y + ", 0px)";
				_.$slideTrack.css(positionProps);
			}
		}
	};
	Slick.prototype.setDimensions = function () {
		var _ = this;
		if (_.options.vertical === false) {
			if (_.options.centerMode === true) _.$list.css({ padding: "0px " + _.options.centerPadding });
		} else {
			_.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
			if (_.options.centerMode === true) _.$list.css({ padding: _.options.centerPadding + " 0px" });
		}
		_.listWidth = _.$list.width();
		_.listHeight = _.$list.height();
		if (_.options.vertical === false && _.options.variableWidth === false) {
			_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
			_.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children(".slick-slide").length));
		} else if (_.options.variableWidth === true) _.$slideTrack.width(5000 * _.slideCount);
		else {
			_.slideWidth = Math.ceil(_.listWidth);
			_.$slideTrack.height(
				Math.ceil(
					_.$slides.first().outerHeight(true) * _.$slideTrack.children(".slick-slide").length
				)
			);
		}
		var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
		if (_.options.variableWidth === false)
			_.$slideTrack.children(".slick-slide").width(_.slideWidth - offset);
	};
	Slick.prototype.setFade = function () {
		var _ = this,
			targetLeft;
		_.$slides.each(function (index, element) {
			targetLeft = _.slideWidth * index * -1;
			if (_.options.rtl === true)
				$(element).css({
					position: "relative",
					right: targetLeft,
					top: "0",
					zIndex: _.options.zIndex - 2,
					opacity: "0",
				});
			else
				$(element).css({
					position: "relative",
					left: targetLeft,
					top: "0",
					zIndex: _.options.zIndex - 2,
					opacity: "0",
				});
		});
		_.$slides.eq(_.currentSlide).css({ zIndex: _.options.zIndex - 1, opacity: "1" });
	};
	Slick.prototype.setHeight = function () {
		var _ = this;
		if (
			_.options.slidesToShow === 1 &&
			_.options.adaptiveHeight === true &&
			_.options.vertical === false
		) {
			var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
			_.$list.css("height", targetHeight + "px");
		}
	};
	Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
		var _ = this,
			l,
			item,
			option,
			value,
			refresh = false,
			type;
		if ($.isPlainObject(arguments[0])) {
			option = arguments[0];
			refresh = arguments[1];
			type = "multiple";
		} else {
			if (typeof arguments[0] === "string") {
				option = arguments[0];
				value = arguments[1];
				refresh = arguments[2];
				if (arguments[0] === "responsive" && Array.isArray(arguments[1])) type = "responsive";
				else {
					if (typeof arguments[1] !== "undefined") type = "single";
				}
			}
		}
		if (type === "single") _.options[option] = value;
		else if (type === "multiple")
			$.each(option, function (opt, val) {
				_.options[opt] = val;
			});
		else {
			if (type === "responsive")
				for (item in value)
					if (!Array.isArray(_.options.responsive)) _.options.responsive = [value[item]];
					else {
						l = _.options.responsive.length - 1;
						while (l >= 0) {
							if (_.options.responsive[l].breakpoint === value[item].breakpoint)
								_.options.responsive.splice(l, 1);
							l--;
						}
						_.options.responsive.push(value[item]);
					}
		}
		if (refresh) {
			_.unload();
			_.reinit();
		}
	};
	Slick.prototype.setPosition = function () {
		var _ = this;
		_.setDimensions();
		_.setHeight();
		if (_.options.fade === false) _.setCSS(_.getLeft(_.currentSlide));
		else _.setFade();
		_.$slider.trigger("setPosition", [_]);
	};
	Slick.prototype.setProps = function () {
		var _ = this,
			bodyStyle = document.body.style;
		_.positionProp = _.options.vertical === true ? "top" : "left";
		if (_.positionProp === "top") _.$slider.addClass("slick-vertical");
		else _.$slider.removeClass("slick-vertical");
		if (
			bodyStyle.WebkitTransition !== undefined ||
			bodyStyle.MozTransition !== undefined ||
			bodyStyle.msTransition !== undefined
		)
			if (_.options.useCSS === true) _.cssTransitions = true;
		if (_.options.fade)
			if (typeof _.options.zIndex === "number") {
				if (_.options.zIndex < 3) _.options.zIndex = 3;
			} else _.options.zIndex = _.defaults.zIndex;
		if (bodyStyle.OTransform !== undefined) {
			_.animType = "OTransform";
			_.transformType = "-o-transform";
			_.transitionType = "OTransition";
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
				_.animType = false;
		}
		if (bodyStyle.MozTransform !== undefined) {
			_.animType = "MozTransform";
			_.transformType = "-moz-transform";
			_.transitionType = "MozTransition";
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined)
				_.animType = false;
		}
		if (bodyStyle.webkitTransform !== undefined) {
			_.animType = "webkitTransform";
			_.transformType = "-webkit-transform";
			_.transitionType = "webkitTransition";
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
				_.animType = false;
		}
		if (bodyStyle.msTransform !== undefined) {
			_.animType = "msTransform";
			_.transformType = "-ms-transform";
			_.transitionType = "msTransition";
			if (bodyStyle.msTransform === undefined) _.animType = false;
		}
		if (bodyStyle.transform !== undefined && _.animType !== false) {
			_.animType = "transform";
			_.transformType = "transform";
			_.transitionType = "transition";
		}
		_.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
	};
	Slick.prototype.setSlideClasses = function (index) {
		var _ = this,
			centerOffset,
			allSlides,
			indexOffset,
			remainder;
		allSlides = _.$slider
			.find(".slick-slide")
			.removeClass("slick-active slick-center slick-current")
			.attr("aria-hidden", "true");
		_.$slides.eq(index).addClass("slick-current");
		if (_.options.centerMode === true) {
			var evenCoef;
			if (_.options.slidesToShow >= _.$slides.length) {
				evenCoef = -1;
				centerOffset = _.options.slidesToShow = _.$slides.length;
			} else {
				evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
				centerOffset = Math.floor(_.options.slidesToShow / 2);
			}
			if (_.options.infinite === true) {
				if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset)
					_.$slides
						.slice(index - centerOffset + evenCoef, index + centerOffset + 1)
						.addClass("slick-active")
						.attr("aria-hidden", "false");
				else {
					indexOffset = _.options.slidesToShow + index;
					allSlides
						.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
						.addClass("slick-active")
						.attr("aria-hidden", "false");
				}
				if (index === 0)
					allSlides.eq(_.options.slidesToShow + _.slideCount + 1).addClass("slick-center");
				else {
					if (index === _.slideCount - 1)
						allSlides.eq(_.options.slidesToShow).addClass("slick-center");
				}
			}
			_.$slides.eq(index).addClass("slick-center");
		} else if (index >= 0 && index <= _.slideCount - _.options.slidesToShow)
			_.$slides
				.slice(index, index + _.options.slidesToShow)
				.addClass("slick-active")
				.attr("aria-hidden", "false");
		else if (allSlides.length <= _.options.slidesToShow)
			allSlides.addClass("slick-active").attr("aria-hidden", "false");
		else {
			remainder = _.slideCount % _.options.slidesToShow;
			indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
			if (
				_.options.slidesToShow == _.options.slidesToScroll &&
				_.slideCount - index < _.options.slidesToShow
			)
				allSlides
					.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
					.addClass("slick-active")
					.attr("aria-hidden", "false");
			else
				allSlides
					.slice(indexOffset, indexOffset + _.options.slidesToShow)
					.addClass("slick-active")
					.attr("aria-hidden", "false");
		}
		if (_.options.lazyLoad === "ondemand" || _.options.lazyLoad === "anticipated") _.lazyLoad();
	};
	Slick.prototype.setupInfinite = function () {
		var _ = this,
			i,
			slideIndex,
			infiniteCount;
		if (_.options.fade === true) _.options.centerMode = false;
		if (_.options.infinite === true && _.options.fade === false) {
			slideIndex = null;
			if (_.slideCount > _.options.slidesToShow) {
				if (_.options.centerMode === true) infiniteCount = _.options.slidesToShow + 1;
				else infiniteCount = _.options.slidesToShow;
				for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
					slideIndex = i - 1;
					$(_.$slides[slideIndex])
						.clone(true)
						.removeAttr("id")
						.attr("data-slick-index", slideIndex - _.slideCount)
						.prependTo(_.$slideTrack)
						.addClass("slick-cloned");
				}
				for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
					slideIndex = i;
					$(_.$slides[slideIndex])
						.clone(true)
						.removeAttr("id")
						.attr("data-slick-index", slideIndex + _.slideCount)
						.appendTo(_.$slideTrack)
						.addClass("slick-cloned");
				}
				_.$slideTrack
					.find(".slick-cloned")
					.find("[id]")
					.each(function () {
						$(this).removeAttr("id");
					});
			}
		}
	};
	Slick.prototype.interrupt = function (toggle) {
		var _ = this;
		if (!toggle) _.autoPlay();
		_.interrupted = toggle;
	};
	Slick.prototype.selectHandler = function (event) {
		var _ = this;
		var targetElement = $(event.target).is(".slick-slide")
			? $(event.target)
			: $(event.target).parents(".slick-slide");
		var index = parseInt(targetElement.attr("data-slick-index"));
		if (!index) index = 0;
		if (_.slideCount <= _.options.slidesToShow) {
			_.slideHandler(index, false, true);
			return;
		}
		_.slideHandler(index);
	};
	Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
		var targetSlide,
			animSlide,
			oldSlide,
			slideLeft,
			targetLeft = null,
			_ = this,
			navTarget;
		sync = sync || false;
		if (_.animating === true && _.options.waitForAnimate === true) return;
		if (_.options.fade === true && _.currentSlide === index) return;
		if (sync === false) _.asNavFor(index);
		targetSlide = index;
		targetLeft = _.getLeft(targetSlide);
		slideLeft = _.getLeft(_.currentSlide);
		_.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
		if (
			_.options.infinite === false &&
			_.options.centerMode === false &&
			(index < 0 || index > _.getDotCount() * _.options.slidesToScroll)
		) {
			if (_.options.fade === false) {
				targetSlide = _.currentSlide;
				if (dontAnimate !== true && _.slideCount > _.options.slidesToShow)
					_.animateSlide(slideLeft, function () {
						_.postSlide(targetSlide);
					});
				else _.postSlide(targetSlide);
			}
			return;
		} else {
			if (
				_.options.infinite === false &&
				_.options.centerMode === true &&
				(index < 0 || index > _.slideCount - _.options.slidesToScroll)
			) {
				if (_.options.fade === false) {
					targetSlide = _.currentSlide;
					if (dontAnimate !== true && _.slideCount > _.options.slidesToShow)
						_.animateSlide(slideLeft, function () {
							_.postSlide(targetSlide);
						});
					else _.postSlide(targetSlide);
				}
				return;
			}
		}
		if (_.options.autoplay) clearInterval(_.autoPlayTimer);
		if (targetSlide < 0)
			if (_.slideCount % _.options.slidesToScroll !== 0)
				animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
			else animSlide = _.slideCount + targetSlide;
		else if (targetSlide >= _.slideCount)
			if (_.slideCount % _.options.slidesToScroll !== 0) animSlide = 0;
			else animSlide = targetSlide - _.slideCount;
		else animSlide = targetSlide;
		_.animating = true;
		_.$slider.trigger("beforeChange", [_, _.currentSlide, animSlide]);
		oldSlide = _.currentSlide;
		_.currentSlide = animSlide;
		_.setSlideClasses(_.currentSlide);
		if (_.options.asNavFor) {
			navTarget = _.getNavTarget();
			navTarget = navTarget.slick("getSlick");
			if (navTarget.slideCount <= navTarget.options.slidesToShow)
				navTarget.setSlideClasses(_.currentSlide);
		}
		_.updateDots();
		_.updateArrows();
		if (_.options.fade === true) {
			if (dontAnimate !== true) {
				_.fadeSlideOut(oldSlide);
				_.fadeSlide(animSlide, function () {
					_.postSlide(animSlide);
				});
			} else _.postSlide(animSlide);
			_.animateHeight();
			return;
		}
		if (dontAnimate !== true && _.slideCount > _.options.slidesToShow)
			_.animateSlide(targetLeft, function () {
				_.postSlide(animSlide);
			});
		else _.postSlide(animSlide);
	};
	Slick.prototype.startLoad = function () {
		var _ = this;
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow.hide();
			_.$nextArrow.hide();
		}
		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) _.$dots.hide();
		_.$slider.addClass("slick-loading");
	};
	Slick.prototype.swipeDirection = function () {
		var xDist,
			yDist,
			r,
			swipeAngle,
			_ = this;
		xDist = _.touchObject.startX - _.touchObject.curX;
		yDist = _.touchObject.startY - _.touchObject.curY;
		r = Math.atan2(yDist, xDist);
		swipeAngle = Math.round((r * 180) / Math.PI);
		if (swipeAngle < 0) swipeAngle = 360 - Math.abs(swipeAngle);
		if (swipeAngle <= 45 && swipeAngle >= 0) return _.options.rtl === false ? "left" : "right";
		if (swipeAngle <= 360 && swipeAngle >= 315) return _.options.rtl === false ? "left" : "right";
		if (swipeAngle >= 135 && swipeAngle <= 225) return _.options.rtl === false ? "right" : "left";
		if (_.options.verticalSwiping === true)
			if (swipeAngle >= 35 && swipeAngle <= 135) return "down";
			else return "up";
		return "vertical";
	};
	Slick.prototype.swipeEnd = function (event) {
		var _ = this,
			slideCount,
			direction;
		_.dragging = false;
		_.swiping = false;
		if (_.scrolling) {
			_.scrolling = false;
			return false;
		}
		_.interrupted = false;
		_.shouldClick = _.touchObject.swipeLength > 10 ? false : true;
		if (_.touchObject.curX === undefined) return false;
		if (_.touchObject.edgeHit === true) _.$slider.trigger("edge", [_, _.swipeDirection()]);
		if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
			direction = _.swipeDirection();
			switch (direction) {
				case "left":
				case "down":
					slideCount = _.options.swipeToSlide
						? _.checkNavigable(_.currentSlide + _.getSlideCount())
						: _.currentSlide + _.getSlideCount();
					_.currentDirection = 0;
					break;
				case "right":
				case "up":
					slideCount = _.options.swipeToSlide
						? _.checkNavigable(_.currentSlide - _.getSlideCount())
						: _.currentSlide - _.getSlideCount();
					_.currentDirection = 1;
					break;
				default:
			}
			if (direction != "vertical") {
				_.slideHandler(slideCount);
				_.touchObject = {};
				_.$slider.trigger("swipe", [_, direction]);
			}
		} else {
			if (_.touchObject.startX !== _.touchObject.curX) {
				_.slideHandler(_.currentSlide);
				_.touchObject = {};
			}
		}
	};
	Slick.prototype.swipeHandler = function (event) {
		var _ = this;
		if (_.options.swipe === false || ("ontouchend" in document && _.options.swipe === false))
			return;
		else {
			if (_.options.draggable === false && event.type.indexOf("mouse") !== -1) return;
		}
		_.touchObject.fingerCount =
			event.originalEvent && event.originalEvent.touches !== undefined
				? event.originalEvent.touches.length
				: 1;
		_.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;
		if (_.options.verticalSwiping === true)
			_.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
		switch (event.data.action) {
			case "start":
				_.swipeStart(event);
				break;
			case "move":
				_.swipeMove(event);
				break;
			case "end":
				_.swipeEnd(event);
				break;
		}
	};
	Slick.prototype.swipeMove = function (event) {
		var _ = this,
			edgeWasHit = false,
			curLeft,
			swipeDirection,
			swipeLength,
			positionOffset,
			touches,
			verticalSwipeLength;
		touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
		if (!_.dragging || _.scrolling || (touches && touches.length !== 1)) return false;
		curLeft = _.getLeft(_.currentSlide);
		_.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
		_.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
		_.touchObject.swipeLength = Math.round(
			Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))
		);
		verticalSwipeLength = Math.round(
			Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2))
		);
		if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
			_.scrolling = true;
			return false;
		}
		if (_.options.verticalSwiping === true) _.touchObject.swipeLength = verticalSwipeLength;
		swipeDirection = _.swipeDirection();
		if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
			_.swiping = true;
			event.preventDefault();
		}
		positionOffset =
			(_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
		if (_.options.verticalSwiping === true)
			positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
		swipeLength = _.touchObject.swipeLength;
		_.touchObject.edgeHit = false;
		if (_.options.infinite === false)
			if (
				(_.currentSlide === 0 && swipeDirection === "right") ||
				(_.currentSlide >= _.getDotCount() && swipeDirection === "left")
			) {
				swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
				_.touchObject.edgeHit = true;
			}
		if (_.options.vertical === false) _.swipeLeft = curLeft + swipeLength * positionOffset;
		else _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
		if (_.options.verticalSwiping === true) _.swipeLeft = curLeft + swipeLength * positionOffset;
		if (_.options.fade === true || _.options.touchMove === false) return false;
		if (_.animating === true) {
			_.swipeLeft = null;
			return false;
		}
		_.setCSS(_.swipeLeft);
	};
	Slick.prototype.swipeStart = function (event) {
		var _ = this,
			touches;
		_.interrupted = true;
		if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
			_.touchObject = {};
			return false;
		}
		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined)
			touches = event.originalEvent.touches[0];
		_.touchObject.startX = _.touchObject.curX =
			touches !== undefined ? touches.pageX : event.clientX;
		_.touchObject.startY = _.touchObject.curY =
			touches !== undefined ? touches.pageY : event.clientY;
		_.dragging = true;
	};
	Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
		var _ = this;
		if (_.$slidesCache !== null) {
			_.unload();
			_.$slideTrack.children(this.options.slide).detach();
			_.$slidesCache.appendTo(_.$slideTrack);
			_.reinit();
		}
	};
	Slick.prototype.unload = function () {
		var _ = this;
		$(".slick-cloned", _.$slider).remove();
		if (_.$dots) _.$dots.remove();
		if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) _.$prevArrow.remove();
		if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) _.$nextArrow.remove();
		_.$slides
			.removeClass("slick-slide slick-active slick-visible slick-current")
			.attr("aria-hidden", "true")
			.css("width", "");
	};
	Slick.prototype.unslick = function (fromBreakpoint) {
		var _ = this;
		_.$slider.trigger("unslick", [_, fromBreakpoint]);
		_.destroy();
	};
	Slick.prototype.updateArrows = function () {
		var _ = this,
			centerOffset;
		centerOffset = Math.floor(_.options.slidesToShow / 2);
		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
			_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
			_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
			if (_.currentSlide === 0) {
				_.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
				_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
			} else if (
				_.currentSlide >= _.slideCount - _.options.slidesToShow &&
				_.options.centerMode === false
			) {
				_.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
				_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
			} else {
				if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
					_.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
					_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
				}
			}
		}
	};
	Slick.prototype.updateDots = function () {
		var _ = this;
		if (_.$dots !== null) {
			_.$dots.find("li").removeClass("slick-active").end();
			_.$dots
				.find("li")
				.eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
				.addClass("slick-active");
		}
	};
	Slick.prototype.visibility = function () {
		var _ = this;
		if (_.options.autoplay)
			if (document[_.hidden]) _.interrupted = true;
			else _.interrupted = false;
	};
	$.fn.slick = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt == "object" || typeof opt == "undefined") _[i].slick = new Slick(_[i], opt);
			else ret = _[i].slick[opt].apply(_[i].slick, args);
			if (typeof ret != "undefined") return ret;
		}
		return _;
	};
});
("use strict");
let modalIndex = 0;
function getModalOpener(openers, clickedOpener) {
	const focusableTags = ["a", "button", "li"];
	const openerIsFocusable = (op) =>
		focusableTags.includes(jQuery(op).prop("tagName").toLowerCase());
	return openerIsFocusable(clickedOpener)
		? jQuery(clickedOpener)
		: openers.filter((_, opener) => openerIsFocusable(opener));
}
function prepareModal(element, opener, modalOptions = {}) {
	const openingClass = "on";
	let lastOpener;
	let triggeredOpener;
	const options = {
		withCloser: true,
		modalClass: "",
		copyElement: false,
		delay: 0,
		gtmEvent: false,
		openable: true,
		buildWhenOpen: false,
		lastOpenerFocusOnModalClose: true,
		removeUrlHashOnModalClose: false,
		...modalOptions,
	};
	const modalContainer = buildModal(options.withCloser, options.modalClass);
	const eventContentInModalWasAdded = new CustomEvent("content-in-modal-was-added", {
		detail: { modalId: modalContainer.attr("id") },
	});
	const content = modalContainer.find(".modal--content");
	if (!options.buildWhenOpen) {
		content.append(options.copyElement ? jQuery(element).clone() : jQuery(element));
		document.dispatchEvent(eventContentInModalWasAdded);
	}
	const modalCloser = modalContainer.find(".modal--closer");
	const $html = jQuery("html");
	if (opener === "delay")
		setTimeout(function () {
			openModal($html, modalContainer, modalCloser, openingClass, opener, options.gtmEvent);
		}, options.delay);
	else {
		if (options.openable === true) opener.data("openable", true);
		else opener.data("openable", false);
		jQuery(opener).click(function () {
			triggeredOpener = this;
			lastOpener = getModalOpener(opener, this);
			if (jQuery(opener).data("openable") === true) {
				if (options.buildWhenOpen) {
					content.append(options.copyElement ? jQuery(element).clone() : jQuery(element));
					document.dispatchEvent(eventContentInModalWasAdded);
				}
				document.dispatchEvent(
					new CustomEvent("modal-opener-was-triggered-and-modal-will-be-opened", {
						detail: { modalId: modalContainer.attr("id"), triggeredOpener: triggeredOpener },
					})
				);
				openModal(
					$html,
					modalContainer,
					modalCloser,
					openingClass,
					triggeredOpener,
					options.gtmEvent
				);
			}
		});
	}
	modalCloser.click(() => {
		$html.removeClass("js-html--no-scroll");
		modalContainer.toggle(0, () => {
			modalContainer.removeClass(openingClass);
			document.dispatchEvent(
				new CustomEvent("modal-was-closed", { detail: { modalId: modalContainer.attr("id") } })
			);
			if (options.buildWhenOpen)
				content.children(":not(.modal--closer)").each(function (index, el) {
					el.remove();
				});
			if (options.lastOpenerFocusOnModalClose && lastOpener && lastOpener.length === 1)
				lastOpener.focus();
			if (options.removeUrlHashOnModalClose)
				history.pushState("", document.title, window.location.pathname + window.location.search);
		});
	});
}
function openModal($html, $modalContainer, $modalCloser, openingClass, triggeredOpener, gtmEvent) {
	$html.addClass("js-html--no-scroll");
	$modalContainer.toggle(0, () => {
		$modalContainer.addClass(openingClass);
		$modalContainer.css("display", "flex");
		$modalCloser.first().focus();
	});
	if (gtmEvent) Drupal.bnee_gtm.send(gtmEvent);
	document.dispatchEvent(
		new CustomEvent("modal-was-opened", {
			detail: { modalId: $modalContainer.attr("id"), triggeredOpener: triggeredOpener },
		})
	);
}
function buildModal(withCloser, containerClass) {
	const modalTemplate =
		jQuery(`<div class="modal--container ${containerClass}" id="modal-${modalIndex}">
    <div class="modal--content">
    ${withCloser ? '<button type="button" class="modal--closer" title="close"></button>' : ""}</div>
  </div>`);
	jQuery("body").append(modalTemplate);
	modalIndex++;
	return jQuery(`#modal-${modalIndex - 1}`);
}
("use strict");
(function (Drupal, once) {
	function toggleAccordionItem(button, content) {
		if (button.getAttribute("aria-expanded") === "true") {
			content.classList.remove("bne-accordion__item-content--opened");
			button.setAttribute("aria-expanded", false);
		} else {
			content.classList.add("bne-accordion__item-content--opened");
			button.setAttribute("aria-expanded", true);
		}
	}
	Drupal.behaviors.initAccordion = {
		attach: (context) => {
			once("initAccordionBehavior", ".js-bne-accordion__item", context).forEach(
				function (accordionItem) {
					const btn = accordionItem.querySelector(".js-bne-accordion__item-btn");
					const content = accordionItem.querySelector(".js-bne-accordion__item-content");
					if (btn && content)
						btn.addEventListener(
							"click",
							function () {
								toggleAccordionItem(btn, content);
							},
							false
						);
				}
			);
		},
	};
})(Drupal, once);
(function () {
	function r(e, n, t) {
		function o(i, f) {
			if (!n[i]) {
				if (!e[i]) {
					var c = "function" == typeof require && require;
					if (!f && c) return c(i, !0);
					if (u) return u(i, !0);
					var a = new Error("Cannot find module '" + i + "'");
					throw ((a.code = "MODULE_NOT_FOUND"), a);
				}
				var p = (n[i] = { exports: {} });
				e[i][0].call(
					p.exports,
					function (r) {
						var n = e[i][1][r];
						return o(n || r);
					},
					p,
					p.exports,
					r,
					e,
					n,
					t
				);
			}
			return n[i].exports;
		}
		for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
		return o;
	}
	return r;
})()(
	{
		1: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				var _progress = require("./progress");
				(function ($, Drupal, once) {
					let userHasInteracted = false;
					function resetAllProgress(carouselDots) {
						let allProgress = carouselDots.querySelectorAll(".js-ult-progress");
						if (allProgress)
							allProgress.forEach(function (currentProgress) {
								currentProgress.dataset.pause = userHasInteracted;
								if ((0, _progress.getProgressValue)(currentProgress) !== 0) {
									let currentProgressFallbackValue = currentProgress.querySelector(
										".js-ult-progress__fallback-value"
									);
									(0, _progress.resetProgress)(currentProgress, currentProgressFallbackValue);
								}
							});
					}
					function pauseCarousel($carouselSlider, carouselDots) {
						$carouselSlider.slick("slickPause");
						userHasInteracted = true;
						resetAllProgress(carouselDots);
					}
					Drupal.behaviors.initCarousel = {
						attach: (context) => {
							$(once("initCarouselBehavior", ".js-ult-carousel", context)).each(function () {
								const $carousel = $(this);
								const carousel = this;
								if ($carousel.length > 0) {
									const $carouselSlider = $carousel.find(".js-ult-carousel__list");
									const $carouselDots = $carousel.find(".js-ult-carousel__dots");
									const carouselDots = $carouselDots[0];
									const $carouselArrows = $carousel.find(".js-ult-carousel__arrows");
									const prevArrow =
										'<button type="button" class="slick-prev"><span class="sr-only">' +
										Drupal.t("Previous slide") +
										"</span></button>";
									const nextArrow =
										'<button type="button" class="slick-next"><span class="sr-only">' +
										Drupal.t("Next slide") +
										"</span></button>";
									let previousSlideIndex;
									const carouselOptions = $carousel.data("ultCarousel");
									$carouselSlider.on("init", function (event, slick) {
										if (carouselOptions.dots && carouselOptions.dotsMultipleProgressBars) {
											$carouselDots.find("button").each(function (index) {
												let currentButtonContent = $(this).html();
												$(this).html(`
                  <div class="ult-progress-container ult-carousel__progress-container hero-carousel__progress-container">
                    <progress class="ult-progress js-ult-progress hero-carousel__progress"
                              data-target-value="100"
                              value="0"
                              max="100"
                              data-slide-index="${index}"
                              data-pause="false">
                      ${Drupal.t("Slide")} ${currentButtonContent} ${Drupal.t("progress:")}
                      <span class="sr-only js-ult-progress__fallback-value">0</span>%
                    </progress>
                  </div>
                `);
												if (index === 0) {
													let currentProgress = this.querySelector(".js-ult-progress");
													let currentProgressFallbackValue = currentProgress.querySelector(
														".js-ult-progress__fallback-value"
													);
													(0, _progress.startProgress)(
														currentProgress,
														currentProgressFallbackValue,
														carouselOptions.autoplaySpeed
													);
												}
											});
											const carouselAllButtons = carousel.querySelectorAll("button");
											if (carouselAllButtons)
												carouselAllButtons.forEach(function (currentButton) {
													currentButton.addEventListener("click", function () {
														if (!userHasInteracted) pauseCarousel($carouselSlider, carouselDots);
													});
												});
										}
									});
									$carouselSlider.on("swipe", function (event, slick, direction) {
										if (
											carouselOptions.dots &&
											carouselOptions.dotsMultipleProgressBars &&
											!userHasInteracted
										)
											pauseCarousel($carouselSlider, carouselDots);
									});
									$carouselSlider.on(
										"beforeChange",
										function (event, slick, currentSlide, nextSlide) {
											previousSlideIndex = currentSlide;
										}
									);
									$carouselSlider.on("afterChange", function (event, slick, currentSlide) {
										if (!userHasInteracted) {
											let previousProgress = carouselDots.querySelector(
												'.js-ult-progress[data-slide-index="' + previousSlideIndex + '"]'
											);
											let previousProgressFallbackValue = previousProgress.querySelector(
												".js-ult-progress__fallback-value"
											);
											(0, _progress.resetProgress)(previousProgress, previousProgressFallbackValue);
											let currentProgress = carouselDots.querySelector(
												'.js-ult-progress[data-slide-index="' + currentSlide + '"]'
											);
											let currentProgressFallbackValue = currentProgress.querySelector(
												".js-ult-progress__fallback-value"
											);
											(0, _progress.startProgress)(
												currentProgress,
												currentProgressFallbackValue,
												carouselOptions.autoplaySpeed
											);
										} else resetAllProgress(carouselDots);
									});
									$carouselSlider
										.not(".slick-initialized")
										.slick({
											slidesToShow: carouselOptions.slidesToShow,
											pauseOnHover: carouselOptions.pauseOnHover,
											appendArrows: $carouselArrows,
											prevArrow,
											nextArrow,
											dots: carouselOptions.dots,
											appendDots: $carouselDots,
											adaptiveHeight: carouselOptions.adaptiveHeight,
											autoplay: carouselOptions.autoplay,
											autoplaySpeed: carouselOptions.autoplaySpeed,
											rtl: _globalVars.isRtl,
										});
								}
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4, "./progress": 9 },
		],
		2: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once) {
					Drupal.behaviors.initCopyTxt = {
						attach: (context) => {
							once("initCopyTxtBehavior", ".js-ult-copy-txt", context).forEach(function (el) {
								const btnCopyTxt = el;
								if (btnCopyTxt)
									btnCopyTxt.addEventListener("click", function () {
										navigator.clipboard.writeText(btnCopyTxt.dataset.copyTxt).then(
											function () {
												btnCopyTxt.classList.add("js-ult-copy-txt__copied");
											},
											function () {
												console.error("Error copying to clipboard");
											}
										);
									});
							});
						},
					};
				})(Drupal, once);
			},
			{},
		],
		3: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once) {
					Drupal.behaviors.initDropdown = {
						attach: (context) => {
							once("initDropdownBehavior", ".js-ult-dropdown", context).forEach(function (el) {
								const dropdown = el;
								let dropdownOptions;
								if (dropdown) {
									let isDropdownOpened = false;
									let dropdownCloseOnButtonClickOnly = false;
									const dropdownButtonToggle = dropdown.querySelector(".js-ult-dropdown__button");
									const dropdownContent = dropdown.querySelector(".js-ult-dropdown__content");
									if (dropdown.dataset.ultDropdown) {
										dropdownOptions = JSON.parse(dropdown.dataset.ultDropdown);
										dropdownCloseOnButtonClickOnly =
											dropdownOptions.closeOnButtonClickOnly === "true";
									}
									function toggleDropdown() {
										isDropdownOpened = !isDropdownOpened;
										dropdownButtonToggle.setAttribute("aria-expanded", isDropdownOpened);
										dropdownButtonToggle.classList.toggle("js-ult-dropdown__button--opened");
										dropdownContent.classList.toggle("js-ult-dropdown__content--opened");
									}
									if (dropdownButtonToggle)
										dropdownButtonToggle.addEventListener("click", function () {
											toggleDropdown();
										});
									if (dropdownContent && dropdownButtonToggle && !dropdownCloseOnButtonClickOnly)
										document.addEventListener("click", function (event) {
											let isClickInsideDropdownButtonToggle = dropdownButtonToggle.contains(
												event.target
											);
											if (!isClickInsideDropdownButtonToggle)
												if (
													dropdownContent.classList.contains("js-ult-dropdown__content--opened")
												) {
													let isClickInsideDropdownContent = dropdownContent.contains(event.target);
													if (!isClickInsideDropdownContent) toggleDropdown();
												}
										});
								}
							});
						},
					};
				})(Drupal, once);
			},
			{},
		],
		4: [
			function (require, module, exports) {
				"use strict";
				Object.defineProperty(exports, "__esModule", { value: true });
				exports.isRtl = exports.htmlElement = void 0;
				const htmlElement = (exports.htmlElement = document.documentElement);
				const isRtl = (exports.isRtl = htmlElement.getAttribute("dir") === "rtl");
			},
			{},
		],
		5: [
			function (require, module, exports) {
				"use strict";
				Object.defineProperty(exports, "__esModule", { value: true });
				exports.lozadObserver = void 0;
				const lozadObserver = (exports.lozadObserver = lozad());
				lozadObserver.observe();
			},
			{},
		],
		6: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					let $carousel;
					let $filters;
					let $filtersTitle;
					let $filtersDropdown;
					let $filtersItems;
					let $counter;
					let $controllers;
					let originalNbOfItemsInCarousel;
					let deviceAccordingToScreenSize;
					let prevValueDeviceAccordingToScreenSize;
					let modalsInit = false;
					const youtubePlayersReady = new Map();
					Drupal.behaviors.mediaGalleryAdvanced = {
						attach: (context) => {
							$(once("mediaGalleryAdvancedBehavior", ".js-ult-media-gallery-adv", context)).each(
								function () {
									let $gallery = $(this);
									if (modalsInit === true) modalsInit = false;
									enquire.register("screen and (min-width: 2560px)", {
										match: function () {
											deviceAccordingToScreenSize = "desktop";
											initModals($gallery);
											reInitInternalVideos();
											setCarousel($gallery, true, "calc(100% / 3)");
											prevValueDeviceAccordingToScreenSize = deviceAccordingToScreenSize;
										},
									});
									enquire.register("screen and (min-width: 992px) and (max-width: 2559px)", {
										match: function () {
											deviceAccordingToScreenSize = "desktop";
											initModals($gallery);
											reInitInternalVideos();
											setCarousel($gallery, true, "25%");
											prevValueDeviceAccordingToScreenSize = deviceAccordingToScreenSize;
										},
									});
									enquire.register("screen and (max-width: 991px)", {
										match: function () {
											deviceAccordingToScreenSize = "mobile";
											initModals($gallery);
											reInitInternalVideos();
											setCarousel($gallery, false, "0px");
											prevValueDeviceAccordingToScreenSize = deviceAccordingToScreenSize;
										},
									});
									initYouTubePlayers();
								}
							);
						},
					};
					function onPlayerReady(event) {
						let currentYoutubePlayer = event.target;
						let currentYoutubePlayerContainer = currentYoutubePlayer
							.getIframe()
							.closest(".js-ult-media-gallery-adv__item-media--external-video");
						currentYoutubePlayerContainer.classList.add(
							"js-ult-media-gallery-adv__item-media--external-video--can-play"
						);
						youtubePlayersReady.set(currentYoutubePlayerContainer, currentYoutubePlayer);
					}
					function initYouTubePlayers() {
						let youtubePlayerIframe;
						const youtubePlayers = document.querySelectorAll(".js-youtube-player");
						if (youtubePlayers)
							window.onYouTubeIframeAPIReady = function () {
								youtubePlayers.forEach(function (currentYoutubePlayer) {
									youtubePlayerIframe = new YT.Player(currentYoutubePlayer, {
										width: "1920",
										height: "1080",
										videoId: currentYoutubePlayer.dataset.youtubeVideoId,
										host: "https://www.youtube-nocookie.com",
										origin: window.location.origin,
										playerVars: { rel: 0 },
										events: { onReady: onPlayerReady },
									});
								});
							};
					}
					function switchVideoSources(video, switchTo) {
						let videoSources = video.querySelectorAll("source");
						if (videoSources) {
							videoSources.forEach(function (currentVideoSource) {
								currentVideoSource.dataset.src =
									switchTo === "mobile"
										? currentVideoSource.dataset.mobileSrc
										: currentVideoSource.dataset.desktopSrc;
								if (currentVideoSource.hasAttribute("src"))
									currentVideoSource.removeAttribute("src");
							});
							video.removeAttribute("data-loaded");
						}
					}
					function initInternalVideo(video, buttonPlay, buttonPause) {
						const videoLozadObserver = lozad(video, {
							loaded: function (el) {
								if (buttonPlay) {
									if (
										buttonPlay.classList.contains(
											"ult-media-gallery-adv__item-media-play-button--hidden"
										)
									)
										buttonPlay.classList.remove(
											"ult-media-gallery-adv__item-media-play-button--hidden"
										);
									buttonPlay.addEventListener("click", function () {
										buttonPlay.classList.add(
											"ult-media-gallery-adv__item-media-play-button--hidden"
										);
										el.play();
									});
									if (buttonPause)
										buttonPause.addEventListener("click", function () {
											buttonPlay.classList.remove(
												"ult-media-gallery-adv__item-media-play-button--hidden"
											);
											el.pause();
										});
								}
							},
						});
						videoLozadObserver.observe();
					}
					function reInitInternalVideos() {
						if (
							prevValueDeviceAccordingToScreenSize &&
							prevValueDeviceAccordingToScreenSize !== deviceAccordingToScreenSize
						) {
							const modals = document.querySelectorAll(".modal--ult-media-gallery-advanced");
							if (modals)
								modals.forEach(function (currentModal) {
									if (currentModal.querySelector(".js-ult-media-gallery-adv__item-media--video")) {
										const modalCloseButton = currentModal.querySelector(".modal--closer");
										const modalPlayButton = currentModal.querySelector(
											".js-ult-media-gallery-adv__item-media-video-play-button"
										);
										const video = currentModal.querySelector(
											".js-ult-media-gallery-adv__item-media-video"
										);
										switchVideoSources(video, deviceAccordingToScreenSize);
										initInternalVideo(video, modalPlayButton, modalCloseButton);
									}
								});
						}
					}
					function initModals($gallery) {
						if (!modalsInit) {
							const $galleryItems = $gallery.find(".js-ult-media-gallery-adv__item");
							if ($galleryItems.length > 0) {
								let modalId, modalContainer;
								document.addEventListener("content-in-modal-was-added", function (e) {
									modalId = e.detail.modalId;
									modalContainer = document.getElementById(modalId);
									if (modalContainer.classList.contains("modal--ult-media-gallery-advanced")) {
										const modal = document.querySelector(
											"#" + modalId + " .js-ult-media-gallery-adv__item-media"
										);
										const modalCloseButton = document.querySelector(
											"#" + modalId + " .modal--closer"
										);
										const isInternalVideo = modal.classList.contains(
											"js-ult-media-gallery-adv__item-media--video"
										);
										const isExternalVideo = modal.classList.contains(
											"js-ult-media-gallery-adv__item-media--external-video"
										);
										if (isInternalVideo && modalCloseButton) {
											const modalPlayButton = document.querySelector(
												"#" + modalId + " .js-ult-media-gallery-adv__item-media-video-play-button"
											);
											const video = document.querySelector(
												"#" + modalId + " .js-ult-media-gallery-adv__item-media-video"
											);
											switchVideoSources(video, deviceAccordingToScreenSize);
											initInternalVideo(video, modalPlayButton, modalCloseButton);
										}
										if (isExternalVideo && modalCloseButton)
											modalCloseButton.addEventListener("click", function () {
												if (
													modal.classList.contains(
														"js-ult-media-gallery-adv__item-media--external-video--can-play"
													)
												) {
													let currentYoutubePlayer = youtubePlayersReady.get(modal);
													if (currentYoutubePlayer) currentYoutubePlayer.pauseVideo();
												}
											});
									}
								});
								let galleryItemOpenable = true;
								$galleryItems.each(function (index) {
									let $currentGalleryItem = $(this);
									let $currentGalleryItemMedia = $currentGalleryItem.find(
										".js-ult-media-gallery-adv__item-media"
									);
									if (index !== 0) galleryItemOpenable = false;
									prepareModal($currentGalleryItemMedia, $currentGalleryItem, {
										openable: galleryItemOpenable,
										copyElement: true,
										modalClass: "modal--container--fullscreen modal--ult-media-gallery-advanced",
									});
									$currentGalleryItemMedia
										.find(".js-ult-media-gallery-adv__item-media-video")
										.remove();
								});
							}
							modalsInit = true;
						}
					}
					function setCarousel($gallery, isInfinite, paddingForCenteredSlides) {
						$carousel = $gallery.find(".js-ult-media-gallery-adv__carousel");
						if ($carousel)
							if ($carousel.hasClass("slick-initialized")) {
								$carousel.slick("slickSetOption", "infinite", isInfinite, true);
								$carousel.slick("slickSetOption", "centerPadding", paddingForCenteredSlides, true);
							} else {
								$filters = $gallery.find(".js-ult-media-gallery-adv__filters");
								$counter = $gallery.find(".js-ult-media-gallery-adv__counter");
								$controllers = $gallery.find(".js-ult-media-gallery-adv__controllers");
								originalNbOfItemsInCarousel = $carousel.children().length;
								if (originalNbOfItemsInCarousel > 0) {
									const prevArrow =
										'<button type="button" class="slick-prev"><span class="sr-only">' +
										Drupal.t("Previous slide") +
										"</span></button>";
									const nextArrow =
										'<button type="button" class="slick-next"><span class="sr-only">' +
										Drupal.t("Next slide") +
										"</span></button>";
									initNumberOfItemsPerFilter(originalNbOfItemsInCarousel);
									initListenersOnFilters($carousel, $filters);
									setCounterTotal(
										$carousel.parents(".js-ult-media-gallery-adv").find(".js-counter__total-item"),
										originalNbOfItemsInCarousel
									);
									$carousel.slick({
										appendArrows: $controllers,
										autoplay: false,
										infinite: isInfinite,
										centerMode: true,
										centerPadding: paddingForCenteredSlides,
										initialSlide: 0,
										prevArrow,
										nextArrow,
										slidesToShow: 1,
										slidesToScroll: 1,
										swipeToSlide: true,
										rtl: _globalVars.isRtl,
									});
									$carousel.find(".slick-slide").each(function (index) {
										$(this).addClass(
											"js-ult-media-gallery-adv__item-slide " +
												"js-ult-media-gallery-adv__item-slide--" +
												$(this).find(".js-ult-media-gallery-adv__item").data("type")
										);
									});
									initListenersOnSlides($carousel);
									$carousel.on("afterChange", function (event, slick, currentSlide) {
										setCounterCurrentItem(
											slick.$slider
												.parents(".js-ult-media-gallery-adv")
												.find(".js-counter__current-item"),
											currentSlide
										);
										$controllers.find("button").blur();
									});
								}
							}
					}
					function setCounterCurrentItem($counterCurrentItem, currentSlide) {
						$counterCurrentItem.html(currentSlide + 1);
					}
					function setCounterTotal($counterTotalItems, numberOfVisibleItems) {
						$counterTotalItems.html(numberOfVisibleItems);
					}
					function initNumberOfItemsPerFilter(originalNbOfItemsInCarousel) {
						let filter;
						$filters.find(".js-ult-media-gallery-adv__filters-content-item").each(function (index) {
							filter = $(this);
							if (filter.data("filter") != "all")
								filter.attr(
									"data-number",
									$carousel.find(".js-ult-media-gallery-adv__item--" + filter.data("filter")).length
								);
							else filter.attr("data-number", originalNbOfItemsInCarousel);
						});
					}
					function initListenersOnFilters($carousel, $filters) {
						$filtersItems = $filters.find(".js-ult-media-gallery-adv__filters-content-item");
						let filterClicked;
						$filtersItems.each(function (index) {
							$(this).on("click", function (event) {
								filterClicked = $(this);
								$filtersTitle = $filters.find(".js-ult-media-gallery-adv__filters-title");
								$filtersDropdown = $filters.find(".js-ult-media-gallery-adv__filters-content");
								$filtersItems = $filters.find(".js-ult-media-gallery-adv__filters-content-item");
								$filtersTitle.removeClass("js-ult-dropdown__button--opened");
								$filtersDropdown.removeClass("js-ult-dropdown__content--opened");
								$filtersTitle.html(filterClicked.html());
								$carousel.slick("slickUnfilter");
								let numberOfVisibleItems;
								if (
									filterClicked.data("number") !== undefined &&
									filterClicked.data("number") != "0"
								) {
									numberOfVisibleItems = filterClicked.data("number");
									if (filterClicked.data("filter") != "all")
										$carousel.slick(
											"slickFilter",
											".js-ult-media-gallery-adv__item-slide--" + filterClicked.data("filter")
										);
								}
								$carousel.slick("slickGoTo", 0);
								setCounterCurrentItem(
									$carousel.parents(".js-ult-media-gallery-adv").find(".js-counter__current-item"),
									0
								);
								setCounterTotal(
									$carousel.parents(".js-ult-media-gallery-adv").find(".js-counter__total-item"),
									numberOfVisibleItems
								);
								$filtersItems.removeClass("dropdown__content-item--selected");
								filterClicked.addClass("dropdown__content-item--selected");
							});
						});
					}
					function initListenersOnSlides($carousel) {
						let currentSlide;
						let $slides = $carousel.find(".js-ult-media-gallery-adv__item-slide");
						$slides.each(function (index) {
							let $slide = $(this);
							$slide.on("click", function (event) {
								if (!$(this).hasClass("slick-current")) {
									currentSlide = $carousel.find(".slick-current");
									if ($(this).index() > currentSlide.index()) $carousel.slick("slickNext");
									else {
										if ($(this).index() < currentSlide.index()) $carousel.slick("slickPrev");
									}
								}
							});
						});
						$carousel.find(".slick-current .js-ult-media-gallery-adv__item").data("openable", true);
						$carousel.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
							if (currentSlide === nextSlide)
								$carousel
									.find(".slick-current .js-ult-media-gallery-adv__item")
									.data("openable", false);
						});
						$carousel.on("swipe", function (event, slick, direction) {
							$slides.find(".js-ult-media-gallery-adv__item").data("openable", false);
						});
						$carousel.on("afterChange", function (event, slick, currentSlide) {
							$slides.find(".js-ult-media-gallery-adv__item").data("openable", false);
							$carousel
								.find(".slick-current .js-ult-media-gallery-adv__item")
								.data("openable", true);
						});
					}
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		7: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					let hasListenersBeenInitialized = false;
					let deviceAccordingToScreenSize;
					function switchVideoSources(video, switchTo) {
						let videoSources = video.querySelectorAll("source");
						if (videoSources) {
							videoSources.forEach(function (currentVideoSource) {
								let oldSource = currentVideoSource.dataset.src;
								let newSource;
								if (switchTo === "mobile") newSource = currentVideoSource.dataset.mobileSrc;
								else {
									if (switchTo === "desktop")
										if (currentVideoSource.dataset.desktopSrc)
											newSource = currentVideoSource.dataset.desktopSrc;
										else newSource = oldSource;
								}
								currentVideoSource.dataset.src = currentVideoSource.dataset.src.replace(
									oldSource,
									newSource
								);
								if (currentVideoSource.hasAttribute("src"))
									currentVideoSource.removeAttribute("src");
							});
							video.removeAttribute("data-loaded");
						}
					}
					Drupal.behaviors.mediaGallery = {
						attach: (context) => {
							$(once("mediaGalleryBehavior", ".js-ult-media-gallery", context)).each(function () {
								initOnceListenersOnDocumentForModals();
								let gallery = this;
								enquire.register("screen and (min-width: 2560px)", {
									match: function () {
										deviceAccordingToScreenSize = "desktop";
										setMediaGallery(gallery);
									},
								});
								enquire.register("screen and (min-width: 992px)", {
									match: function () {
										deviceAccordingToScreenSize = "desktop";
										setMediaGallery(gallery);
									},
								});
								enquire.register("screen and (max-width: 991px)", {
									match: function () {
										deviceAccordingToScreenSize = "mobile";
										setMediaGallery(gallery);
									},
								});
							});
							function setMediaGallery(gallery) {
								if (gallery.querySelector(".js-ult-media-gallery__carousel")) {
									const mediaGallery = gallery;
									const $openers = $(gallery)
										.parent()
										.find(".js-ult-media-gallery__carousel-opener");
									const mediaGalleryOptions = {
										copyElement: true,
										buildWhenOpen: true,
										modalClass: "title-theme ult-media-gallery__modal js-modal--media-gallery",
									};
									prepareModal(mediaGallery, $openers, mediaGalleryOptions);
								}
							}
							function initOnceListenersOnDocumentForModals() {
								if (!hasListenersBeenInitialized) {
									document.addEventListener(
										"modal-opener-was-triggered-and-modal-will-be-opened",
										function (e) {
											setAndRefreshCarouselWhenModalOpens(e, "before");
										}
									);
									document.addEventListener("modal-was-opened", function (e) {
										setAndRefreshCarouselWhenModalOpens(e, "after");
									});
									document.addEventListener("modal-was-closed", function (e) {
										let $modalContainer = $("#" + e.detail.modalId);
										if ($modalContainer.hasClass("js-modal--media-gallery"))
											reinitAllExternalVideos($modalContainer);
									});
									document.addEventListener("content-video-was-loaded", function (e) {
										let video = e.detail.video;
										e.detail.videoPlayerButton.addEventListener("click", function (e) {
											video.parentElement.parentElement.classList.add(
												"js-ult-media--video--played"
											);
											video.play();
										});
									});
									hasListenersBeenInitialized = true;
								}
							}
							function setAndRefreshCarouselWhenModalOpens(e, when) {
								let $modalContainer = $("#" + e.detail.modalId);
								if ($modalContainer.hasClass("js-modal--media-gallery")) {
									let $carousel = $modalContainer.find(".js-ult-media-gallery__carousel-list");
									if (when == "before")
										if (!$carousel.hasClass("slick-initialized")) {
											let textPrevArrow = Drupal.t("Previous item");
											let textNextArrow = Drupal.t("Next item");
											const prevArrow =
												'<button type="button" class="slick-prev"><span class="sr-only">' +
												textPrevArrow +
												"</span></button>";
											const nextArrow =
												'<button type="button" class="slick-next"><span class="sr-only">' +
												textNextArrow +
												"</span></button>";
											$carousel.slick({
												prevArrow,
												nextArrow,
												adaptiveHeight: false,
												rtl: _globalVars.isRtl,
												initialSlide: getSlideToGoTo(e),
											});
											if ($carousel.find(".js-media-gallery__modal-media--external-video"))
												$carousel
													.find(".js-media-gallery__modal-media--external-video")
													.each(function (index, videoContainer) {
														setPlayButtonClickableForExternalVideo(videoContainer);
													});
											$carousel.on(
												"beforeChange",
												function (event, slick, currentSlide, nextSlide) {
													if (currentSlide != nextSlide) {
														let $videosPlayedContainerInCarousel = $carousel.find(
															".js-ult-media--video--played"
														);
														if ($videosPlayedContainerInCarousel.length > 0)
															$videosPlayedContainerInCarousel.each(
																function (index, videoPlayedContainer) {
																	videoPlayedContainer.classList.remove(
																		"js-ult-media--video--played"
																	);
																	videoPlayedContainer.querySelector("video").pause();
																}
															);
														reinitAllExternalVideos($modalContainer);
													}
												}
											);
										} else $carousel.slick("slickGoTo", getSlideToGoTo(e));
									else {
										if (when == "after") {
											if (!$carousel.hasClass("videos-loaded")) {
												const $videoContainersInCarousel =
													$carousel.find(".js-modal__media--video");
												if ($videoContainersInCarousel && $videoContainersInCarousel.length > 0)
													$videoContainersInCarousel.each(function (i, videoContainer) {
														const video = videoContainer.querySelector(".js-ult-media__video");
														const videoPlayerButton =
															videoContainer.querySelector(".js-ult-media__cta");
														if (video) {
															let videoLozadObserver;
															enquire.register("screen and (max-width: 767px)", {
																match: function () {
																	switchVideoSources(video, "mobile");
																	startVideoLozadObserver();
																},
															});
															enquire.register("screen and (min-width: 768px)", {
																match: function () {
																	switchVideoSources(video, "desktop");
																	startVideoLozadObserver();
																},
															});
															function startVideoLozadObserver() {
																if (!videoLozadObserver)
																	videoLozadObserver = lozad(video, {
																		loaded: function (el) {
																			document.dispatchEvent(
																				new CustomEvent("content-video-was-loaded", {
																					detail: {
																						videoPlayerButton: videoPlayerButton,
																						video: el,
																					},
																				})
																			);
																		},
																	});
																videoLozadObserver.observe();
															}
														}
													});
												$carousel.addClass("videos-loaded");
											}
											$carousel.slick("setPosition");
										}
									}
								}
							}
							function getSlideToGoTo(e) {
								let slideToGoTo = 0;
								if (e.detail.triggeredOpener != "delay") {
									let $triggeredOpener = $(e.detail.triggeredOpener);
									slideToGoTo = $triggeredOpener.data("index");
								}
								return slideToGoTo;
							}
							function setPlayButtonClickableForExternalVideo(videoContainer) {
								if (videoContainer.querySelector(".js-ult-media__cta"))
									videoContainer
										.querySelector(".js-ult-media__cta")
										.addEventListener("click", function (e) {
											videoContainer.classList.add("js-ult-media--external-video--played");
										});
							}
							function reinitAllExternalVideos($modalContainer) {
								let $externalVideosPlayedContainerInModal = $modalContainer.find(
									".js-ult-media--external-video--played"
								);
								if ($externalVideosPlayedContainerInModal.length > 0)
									$externalVideosPlayedContainerInModal.each(function (i, externalVideoSlide) {
										let parentExternalVideoSlide = externalVideoSlide.parentElement;
										externalVideoSlide.classList.remove("js-ult-media--external-video--played");
										let tempExternalVideoSlide = externalVideoSlide.cloneNode(true);
										externalVideoSlide.remove();
										parentExternalVideoSlide.appendChild(tempExternalVideoSlide);
										setPlayButtonClickableForExternalVideo(
											parentExternalVideoSlide.firstElementChild
										);
									});
							}
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		8: [
			function (require, module, exports) {
				"use strict";
				(function ($, Drupal, once) {
					Drupal.behaviors.newsletterModal = {
						attach: (context) => {
							$(once("newsletterModalBehavior", ".js-ult-newsletter-modal__content", context)).each(
								function () {
									let newsletterModal = document.querySelector(".js-ult-newsletter-modal");
									let $newsletterModal = $(".js-ult-newsletter-modal");
									let $newsletterModalOpener = $(".js-ult-newsletter-modal-opener");
									prepareModal($newsletterModal, $newsletterModalOpener, {
										modalClass: "modal--container--newsletter",
									});
									newsletterModal.style.setProperty(
										"--js-newsletter-birth-date-label",
										'"' + document.querySelector(".js-form-item-birth-date label").innerText + '"'
									);
									function openNewsletterIfRegisterParam() {
										if (window.location.href.search(/(\?|&)register=?/) !== -1)
											$newsletterModalOpener.click();
									}
									openNewsletterIfRegisterParam();
								}
							);
						},
					};
				})(jQuery, Drupal, once);
			},
			{},
		],
		9: [
			function (require, module, exports) {
				"use strict";
				Object.defineProperty(exports, "__esModule", { value: true });
				exports.getProgressValue = getProgressValue;
				exports.resetProgress = resetProgress;
				exports.startProgress = startProgress;
				function startProgress(progressElement, progressFallbackValue, duration) {
					let start = 0,
						targetValue = parseInt(progressElement.dataset.targetValue, 10),
						max = parseInt(progressElement.max, 10),
						delay = duration / max;
					let loading = function () {
						progressElement.value = start;
						progressFallbackValue.textContent = start;
						if (start === targetValue || progressElement.dataset.pause === "true")
							clearInterval(animate);
						start++;
					};
					let animate = setInterval(function () {
						loading();
					}, delay);
				}
				function resetProgress(progressElement, progressFallbackValue) {
					progressElement.value = 0;
					progressFallbackValue.textContent = 0;
				}
				function getProgressValue(progressElement) {
					return progressElement.value;
				}
			},
			{},
		],
		10: [
			function (require, module, exports) {
				"use strict";
				require("./global-vars");
				require("./lazy-load");
				require("./dropdown");
				require("./video-autoplay");
				require("./carousel");
				require("./copy-text");
				require("./media-gallery-adv");
				require("./media-gallery");
				require("./newsletter-modal");
			},
			{
				"./carousel": 1,
				"./copy-text": 2,
				"./dropdown": 3,
				"./global-vars": 4,
				"./lazy-load": 5,
				"./media-gallery": 7,
				"./media-gallery-adv": 6,
				"./newsletter-modal": 8,
				"./video-autoplay": 11,
			},
		],
		11: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once) {
					let videoLozadObserver;
					function startLozadObserver(videoLozadObserver, video) {
						if (!videoLozadObserver)
							videoLozadObserver = lozad(video, {
								loaded: function (el) {
									el.play();
								},
							});
						videoLozadObserver.observe();
					}
					function switchVideoSources(video, switchTo) {
						const videoSources = video.querySelectorAll("source");
						if (videoSources) {
							videoSources.forEach(function (currentVideoSource) {
								const oldSource = currentVideoSource.dataset.src;
								let newSource;
								if (switchTo === "mobile") newSource = currentVideoSource.dataset.mobileSrc;
								else {
									if (switchTo === "desktop") newSource = currentVideoSource.dataset.desktopSrc;
								}
								if (newSource === undefined) video.classList.add("js-ult-video-autoplay--hidden");
								else {
									video.classList.remove("js-ult-video-autoplay--hidden");
									currentVideoSource.dataset.src = currentVideoSource.dataset.src.replace(
										oldSource,
										newSource
									);
									if (currentVideoSource.hasAttribute("src"))
										currentVideoSource.removeAttribute("src");
								}
							});
							video.removeAttribute("data-loaded");
						}
					}
					Drupal.behaviors.initUltVideoAutoplay = {
						attach: (context) => {
							once("initUltVideoAutoplayBehavior", ".js-ult-video-autoplay", context).forEach(
								function (el) {
									const video = el;
									if (video) {
										const videoBreakpointSwitch = parseInt(video.dataset.breakpointSwitch, 10);
										enquire.register(`screen and (max-width: ${videoBreakpointSwitch - 1}px)`, {
											match: function () {
												switchVideoSources(video, "mobile");
												startLozadObserver(videoLozadObserver, video);
											},
										});
										enquire.register(`screen and (min-width: ${videoBreakpointSwitch}px)`, {
											match: function () {
												switchVideoSources(video, "desktop");
												startLozadObserver(videoLozadObserver, video);
											},
										});
									}
								}
							);
						},
					};
				})(Drupal, once);
			},
			{},
		],
	},
	{},
	[10]
);
("use strict");
(function (Drupal, once) {
	Drupal.behaviors.initNavSecondary = {
		attach: (context) => {
			once("initNavSecondaryBehavior", "#js-nav-secondary", context).forEach(function (el) {
				const navSecondary = el;
				let navSecondaryMenuMobile;
				let navSecondaryMenuMobileBtnToggle;
				const htmlElement = document.documentElement;
				let isDesktop;
				let navSecondarySubList;
				let navSecondarySubListBtnToggle;
				function toggleNavSecondaryDropdown(button, nav) {
					if (nav === navSecondary) {
						htmlElement.classList.toggle("js-html-header--overflow-visible");
						nav.classList.toggle("js-nav-secondary--opened");
					} else {
						if (isDesktop) htmlElement.classList.toggle("js-html-header--overflow-visible");
						nav.classList.toggle("js-nav-secondary__sub-list--opened");
					}
					if (button.getAttribute("aria-expanded") === "true")
						button.setAttribute("aria-expanded", false);
					else button.setAttribute("aria-expanded", true);
				}
				function closeStillOpenedNav() {
					let currentlyOpenedSublist = navSecondary.querySelector(
						".js-nav-secondary__sub-list--opened"
					);
					if (currentlyOpenedSublist) {
						let currentlyOpenedSublistBtnToggle =
							currentlyOpenedSublist.parentElement.querySelector(
								".js-nav-secondary__sub-list-button-toggle"
							);
						toggleNavSecondaryDropdown(currentlyOpenedSublistBtnToggle, currentlyOpenedSublist);
					}
				}
				if (navSecondary) {
					navSecondaryMenuMobile = document.getElementById("js-nav-secondary__list");
					navSecondaryMenuMobileBtnToggle = document.getElementById(
						"js-nav-secondary__button-toggle"
					);
					navSecondaryMenuMobileBtnToggle.addEventListener(
						"click",
						function () {
							toggleNavSecondaryDropdown(navSecondaryMenuMobileBtnToggle, navSecondary);
						},
						false
					);
					if (navSecondary && navSecondaryMenuMobile && navSecondaryMenuMobileBtnToggle)
						document.addEventListener("click", function (event) {
							let isClickInsideNavSecondaryMenuMobileBtnToggle =
								navSecondaryMenuMobileBtnToggle.contains(event.target);
							if (!isClickInsideNavSecondaryMenuMobileBtnToggle)
								if (navSecondary.classList.contains("js-nav-secondary--opened")) {
									let isClickInsideNavSecondaryMenuMobile = navSecondaryMenuMobile.contains(
										event.target
									);
									if (!isClickInsideNavSecondaryMenuMobile)
										toggleNavSecondaryDropdown(navSecondaryMenuMobileBtnToggle, navSecondary);
								}
						});
					navSecondarySubListBtnToggle = document.querySelectorAll(
						".js-nav-secondary__sub-list-button-toggle"
					);
					navSecondarySubList = document.querySelectorAll(".js-nav-secondary__sub-list");
					if (navSecondarySubListBtnToggle && navSecondarySubList) {
						enquire.register("screen and (max-width: 991px)", {
							match: function () {
								if (isDesktop === true) closeStillOpenedNav();
								isDesktop = false;
							},
						});
						enquire.register("screen and (min-width: 992px)", {
							match: function () {
								if (isDesktop === false) {
									closeStillOpenedNav();
									if (navSecondary.classList.contains("js-nav-secondary--opened"))
										toggleNavSecondaryDropdown(navSecondaryMenuMobileBtnToggle, navSecondary);
								}
								isDesktop = true;
							},
						});
						navSecondarySubListBtnToggle.forEach(function (currentNavSecondarySubListBtnToggle) {
							let currentNavSecondarySubList =
								currentNavSecondarySubListBtnToggle.parentElement.querySelector(
									".js-nav-secondary__sub-list"
								);
							currentNavSecondarySubListBtnToggle.addEventListener(
								"click",
								function () {
									toggleNavSecondaryDropdown(
										currentNavSecondarySubListBtnToggle,
										currentNavSecondarySubList
									);
								},
								false
							);
							document.addEventListener("click", function (event) {
								let isClickInsideCurrentNavSecondarySubListBtnToggle =
									currentNavSecondarySubListBtnToggle.contains(event.target);
								if (!isClickInsideCurrentNavSecondarySubListBtnToggle)
									if (
										currentNavSecondarySubList.classList.contains(
											"js-nav-secondary__sub-list--opened"
										)
									) {
										let isClickInsideCurrentNavSecondarySubList =
											currentNavSecondarySubList.contains(event.target);
										if (!isClickInsideCurrentNavSecondarySubList)
											toggleNavSecondaryDropdown(
												currentNavSecondarySubListBtnToggle,
												currentNavSecondarySubList
											);
									}
							});
						});
					}
				}
			});
		},
	};
})(Drupal, once);
(function () {
	"use strict";
	var document =
		typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};
	var isCommonjs = typeof module !== "undefined" && module.exports;
	var fn = (function () {
		var val;
		var fnMap = [
			[
				"requestFullscreen",
				"exitFullscreen",
				"fullscreenElement",
				"fullscreenEnabled",
				"fullscreenchange",
				"fullscreenerror",
			],
			[
				"webkitRequestFullscreen",
				"webkitExitFullscreen",
				"webkitFullscreenElement",
				"webkitFullscreenEnabled",
				"webkitfullscreenchange",
				"webkitfullscreenerror",
			],
			[
				"webkitRequestFullScreen",
				"webkitCancelFullScreen",
				"webkitCurrentFullScreenElement",
				"webkitCancelFullScreen",
				"webkitfullscreenchange",
				"webkitfullscreenerror",
			],
			[
				"mozRequestFullScreen",
				"mozCancelFullScreen",
				"mozFullScreenElement",
				"mozFullScreenEnabled",
				"mozfullscreenchange",
				"mozfullscreenerror",
			],
			[
				"msRequestFullscreen",
				"msExitFullscreen",
				"msFullscreenElement",
				"msFullscreenEnabled",
				"MSFullscreenChange",
				"MSFullscreenError",
			],
		];
		var i = 0;
		var l = fnMap.length;
		var ret = {};
		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1] in document) {
				for (i = 0; i < val.length; i++) ret[fnMap[0][i]] = val[i];
				return ret;
			}
		}
		return false;
	})();
	var eventNameMap = { change: fn.fullscreenchange, error: fn.fullscreenerror };
	var screenfull = {
		request: function (element, options) {
			return new Promise(
				function (resolve, reject) {
					var onFullScreenEntered = function () {
						this.off("change", onFullScreenEntered);
						resolve();
					}.bind(this);
					this.on("change", onFullScreenEntered);
					element = element || document.documentElement;
					var returnPromise = element[fn.requestFullscreen](options);
					if (returnPromise instanceof Promise)
						returnPromise.then(onFullScreenEntered).catch(reject);
				}.bind(this)
			);
		},
		exit: function () {
			return new Promise(
				function (resolve, reject) {
					if (!this.isFullscreen) {
						resolve();
						return;
					}
					var onFullScreenExit = function () {
						this.off("change", onFullScreenExit);
						resolve();
					}.bind(this);
					this.on("change", onFullScreenExit);
					var returnPromise = document[fn.exitFullscreen]();
					if (returnPromise instanceof Promise) returnPromise.then(onFullScreenExit).catch(reject);
				}.bind(this)
			);
		},
		toggle: function (element, options) {
			return this.isFullscreen ? this.exit() : this.request(element, options);
		},
		onchange: function (callback) {
			this.on("change", callback);
		},
		onerror: function (callback) {
			this.on("error", callback);
		},
		on: function (event, callback) {
			var eventName = eventNameMap[event];
			if (eventName) document.addEventListener(eventName, callback, false);
		},
		off: function (event, callback) {
			var eventName = eventNameMap[event];
			if (eventName) document.removeEventListener(eventName, callback, false);
		},
		raw: fn,
	};
	if (!fn) {
		if (isCommonjs) module.exports = { isEnabled: false };
		else window.screenfull = { isEnabled: false };
		return;
	}
	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			},
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			},
		},
		isEnabled: {
			enumerable: true,
			get: function () {
				return Boolean(document[fn.fullscreenEnabled]);
			},
		},
	});
	if (isCommonjs) module.exports = screenfull;
	else window.screenfull = screenfull;
})();
(function () {
	function r(e, n, t) {
		function o(i, f) {
			if (!n[i]) {
				if (!e[i]) {
					var c = "function" == typeof require && require;
					if (!f && c) return c(i, !0);
					if (u) return u(i, !0);
					var a = new Error("Cannot find module '" + i + "'");
					throw ((a.code = "MODULE_NOT_FOUND"), a);
				}
				var p = (n[i] = { exports: {} });
				e[i][0].call(
					p.exports,
					function (r) {
						var n = e[i][1][r];
						return o(n || r);
					},
					p,
					p.exports,
					r,
					e,
					n,
					t
				);
			}
			return n[i].exports;
		}
		for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
		return o;
	}
	return r;
})()(
	{
		1: [
			function (require, module, exports) {
				"use strict";
				function _defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}
				function _createClass(Constructor, protoProps, staticProps) {
					if (protoProps) _defineProperties(Constructor.prototype, protoProps);
					if (staticProps) _defineProperties(Constructor, staticProps);
					Object.defineProperty(Constructor, "prototype", { writable: false });
					return Constructor;
				}
				Object.defineProperty(exports, "__esModule", { value: true });
				var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
				var CREATED = 1;
				var MOUNTED = 2;
				var IDLE = 3;
				var MOVING = 4;
				var SCROLLING = 5;
				var DRAGGING = 6;
				var DESTROYED = 7;
				var STATES = { CREATED, MOUNTED, IDLE, MOVING, SCROLLING, DRAGGING, DESTROYED };
				function empty(array) {
					array.length = 0;
				}
				function slice(arrayLike, start, end) {
					return Array.prototype.slice.call(arrayLike, start, end);
				}
				function apply(func) {
					return func.bind.apply(func, [null].concat(slice(arguments, 1)));
				}
				var nextTick = setTimeout;
				var noop = function noop() {};
				function raf(func) {
					return requestAnimationFrame(func);
				}
				function typeOf(type, subject) {
					return typeof subject === type;
				}
				function isObject(subject) {
					return !isNull(subject) && typeOf("object", subject);
				}
				var isArray = Array.isArray;
				var isFunction = apply(typeOf, "function");
				var isString = apply(typeOf, "string");
				var isUndefined = apply(typeOf, "undefined");
				function isNull(subject) {
					return subject === null;
				}
				function isHTMLElement(subject) {
					try {
						return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
					} catch (e) {
						return false;
					}
				}
				function toArray(value) {
					return isArray(value) ? value : [value];
				}
				function forEach(values, iteratee) {
					toArray(values).forEach(iteratee);
				}
				function includes(array, value) {
					return array.indexOf(value) > -1;
				}
				function push(array, items) {
					array.push.apply(array, toArray(items));
					return array;
				}
				function toggleClass(elm, classes, add) {
					if (elm)
						forEach(classes, function (name) {
							if (name) elm.classList[add ? "add" : "remove"](name);
						});
				}
				function addClass(elm, classes) {
					toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
				}
				function append(parent, children) {
					forEach(children, parent.appendChild.bind(parent));
				}
				function before(nodes, ref) {
					forEach(nodes, function (node) {
						var parent = (ref || node).parentNode;
						if (parent) parent.insertBefore(node, ref);
					});
				}
				function matches(elm, selector) {
					return (
						isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector)
					);
				}
				function children(parent, selector) {
					var children2 = parent ? slice(parent.children) : [];
					return selector
						? children2.filter(function (child) {
								return matches(child, selector);
							})
						: children2;
				}
				function child(parent, selector) {
					return selector ? children(parent, selector)[0] : parent.firstElementChild;
				}
				var ownKeys = Object.keys;
				function forOwn(object, iteratee, right) {
					if (object)
						(right ? ownKeys(object).reverse() : ownKeys(object)).forEach(function (key) {
							key !== "__proto__" && iteratee(object[key], key);
						});
					return object;
				}
				function assign(object) {
					slice(arguments, 1).forEach(function (source) {
						forOwn(source, function (value, key) {
							object[key] = source[key];
						});
					});
					return object;
				}
				function merge(object) {
					slice(arguments, 1).forEach(function (source) {
						forOwn(source, function (value, key) {
							if (isArray(value)) object[key] = value.slice();
							else if (isObject(value))
								object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
							else object[key] = value;
						});
					});
					return object;
				}
				function omit(object, keys) {
					forEach(keys || ownKeys(object), function (key) {
						delete object[key];
					});
				}
				function removeAttribute(elms, attrs) {
					forEach(elms, function (elm) {
						forEach(attrs, function (attr) {
							elm && elm.removeAttribute(attr);
						});
					});
				}
				function setAttribute(elms, attrs, value) {
					if (isObject(attrs))
						forOwn(attrs, function (value2, name) {
							setAttribute(elms, name, value2);
						});
					else
						forEach(elms, function (elm) {
							isNull(value) || value === ""
								? removeAttribute(elm, attrs)
								: elm.setAttribute(attrs, String(value));
						});
				}
				function create(tag, attrs, parent) {
					var elm = document.createElement(tag);
					if (attrs) isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
					parent && append(parent, elm);
					return elm;
				}
				function style(elm, prop, value) {
					if (isUndefined(value)) return getComputedStyle(elm)[prop];
					if (!isNull(value)) elm.style[prop] = "" + value;
				}
				function display(elm, display2) {
					style(elm, "display", display2);
				}
				function focus(elm) {
					(elm["setActive"] && elm["setActive"]()) || elm.focus({ preventScroll: true });
				}
				function getAttribute(elm, attr) {
					return elm.getAttribute(attr);
				}
				function hasClass(elm, className) {
					return elm && elm.classList.contains(className);
				}
				function rect(target) {
					return target.getBoundingClientRect();
				}
				function remove(nodes) {
					forEach(nodes, function (node) {
						if (node && node.parentNode) node.parentNode.removeChild(node);
					});
				}
				function parseHtml(html) {
					return child(new DOMParser().parseFromString(html, "text/html").body);
				}
				function prevent(e, stopPropagation) {
					e.preventDefault();
					if (stopPropagation) {
						e.stopPropagation();
						e.stopImmediatePropagation();
					}
				}
				function query(parent, selector) {
					return parent && parent.querySelector(selector);
				}
				function queryAll(parent, selector) {
					return selector ? slice(parent.querySelectorAll(selector)) : [];
				}
				function removeClass(elm, classes) {
					toggleClass(elm, classes, false);
				}
				function timeOf(e) {
					return e.timeStamp;
				}
				function unit(value) {
					return isString(value) ? value : value ? value + "px" : "";
				}
				var PROJECT_CODE = "splide";
				var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
				function assert(condition, message) {
					if (!condition) throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
				}
				var min = Math.min,
					max = Math.max,
					floor = Math.floor,
					ceil = Math.ceil,
					abs = Math.abs;
				function approximatelyEqual(x, y, epsilon) {
					return abs(x - y) < epsilon;
				}
				function between(number, x, y, exclusive) {
					var minimum = min(x, y);
					var maximum = max(x, y);
					return exclusive
						? minimum < number && number < maximum
						: minimum <= number && number <= maximum;
				}
				function clamp(number, x, y) {
					var minimum = min(x, y);
					var maximum = max(x, y);
					return min(max(minimum, number), maximum);
				}
				function sign(x) {
					return +(x > 0) - +(x < 0);
				}
				function camelToKebab(string) {
					return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
				}
				function format(string, replacements) {
					forEach(replacements, function (replacement) {
						string = string.replace("%s", "" + replacement);
					});
					return string;
				}
				function pad(number) {
					return number < 10 ? "0" + number : "" + number;
				}
				var ids = {};
				function uniqueId(prefix) {
					return "" + prefix + pad((ids[prefix] = (ids[prefix] || 0) + 1));
				}
				function EventBinder() {
					var listeners = [];
					function bind(targets, events, callback, options) {
						forEachEvent(targets, events, function (target, event, namespace) {
							var isEventTarget = "addEventListener" in target;
							var remover = isEventTarget
								? target.removeEventListener.bind(target, event, callback, options)
								: target["removeListener"].bind(target, callback);
							isEventTarget
								? target.addEventListener(event, callback, options)
								: target["addListener"](callback);
							listeners.push([target, event, namespace, callback, remover]);
						});
					}
					function unbind(targets, events, callback) {
						forEachEvent(targets, events, function (target, event, namespace) {
							listeners = listeners.filter(function (listener) {
								if (
									listener[0] === target &&
									listener[1] === event &&
									listener[2] === namespace &&
									(!callback || listener[3] === callback)
								) {
									listener[4]();
									return false;
								}
								return true;
							});
						});
					}
					function dispatch(target, type, detail) {
						var e;
						var bubbles = true;
						if (typeof CustomEvent === "function") e = new CustomEvent(type, { bubbles, detail });
						else {
							e = document.createEvent("CustomEvent");
							e.initCustomEvent(type, bubbles, false, detail);
						}
						target.dispatchEvent(e);
						return e;
					}
					function forEachEvent(targets, events, iteratee) {
						forEach(targets, function (target) {
							target &&
								forEach(events, function (events2) {
									events2.split(" ").forEach(function (eventNS) {
										var fragment = eventNS.split(".");
										iteratee(target, fragment[0], fragment[1]);
									});
								});
						});
					}
					function destroy() {
						listeners.forEach(function (data) {
							data[4]();
						});
						empty(listeners);
					}
					return { bind, unbind, dispatch, destroy };
				}
				var EVENT_MOUNTED = "mounted";
				var EVENT_READY = "ready";
				var EVENT_MOVE = "move";
				var EVENT_MOVED = "moved";
				var EVENT_CLICK = "click";
				var EVENT_ACTIVE = "active";
				var EVENT_INACTIVE = "inactive";
				var EVENT_VISIBLE = "visible";
				var EVENT_HIDDEN = "hidden";
				var EVENT_REFRESH = "refresh";
				var EVENT_UPDATED = "updated";
				var EVENT_RESIZE = "resize";
				var EVENT_RESIZED = "resized";
				var EVENT_DRAG = "drag";
				var EVENT_DRAGGING = "dragging";
				var EVENT_DRAGGED = "dragged";
				var EVENT_SCROLL = "scroll";
				var EVENT_SCROLLED = "scrolled";
				var EVENT_OVERFLOW = "overflow";
				var EVENT_DESTROY = "destroy";
				var EVENT_ARROWS_MOUNTED = "arrows:mounted";
				var EVENT_ARROWS_UPDATED = "arrows:updated";
				var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
				var EVENT_PAGINATION_UPDATED = "pagination:updated";
				var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
				var EVENT_AUTOPLAY_PLAY = "autoplay:play";
				var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
				var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
				var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
				var EVENT_SLIDE_KEYDOWN = "sk";
				var EVENT_SHIFTED = "sh";
				var EVENT_END_INDEX_CHANGED = "ei";
				function EventInterface(Splide2) {
					var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
					var binder = EventBinder();
					function on(events, callback) {
						binder.bind(bus, toArray(events).join(" "), function (e) {
							callback.apply(callback, isArray(e.detail) ? e.detail : []);
						});
					}
					function emit(event) {
						binder.dispatch(bus, event, slice(arguments, 1));
					}
					if (Splide2) Splide2.event.on(EVENT_DESTROY, binder.destroy);
					return assign(binder, { bus, on, off: apply(binder.unbind, bus), emit });
				}
				function RequestInterval(interval, onInterval, onUpdate, limit) {
					var now = Date.now;
					var startTime;
					var rate = 0;
					var id;
					var paused = true;
					var count = 0;
					function update() {
						if (!paused) {
							rate = interval ? min((now() - startTime) / interval, 1) : 1;
							onUpdate && onUpdate(rate);
							if (rate >= 1) {
								onInterval();
								startTime = now();
								if (limit && ++count >= limit) return pause();
							}
							id = raf(update);
						}
					}
					function start(resume) {
						resume || cancel();
						startTime = now() - (resume ? rate * interval : 0);
						paused = false;
						id = raf(update);
					}
					function pause() {
						paused = true;
					}
					function rewind() {
						startTime = now();
						rate = 0;
						if (onUpdate) onUpdate(rate);
					}
					function cancel() {
						id && cancelAnimationFrame(id);
						rate = 0;
						id = 0;
						paused = true;
					}
					function set(time) {
						interval = time;
					}
					function isPaused() {
						return paused;
					}
					return { start, rewind, pause, cancel, set, isPaused };
				}
				function State(initialState) {
					var state = initialState;
					function set(value) {
						state = value;
					}
					function is(states) {
						return includes(toArray(states), state);
					}
					return { set, is };
				}
				function Throttle(func, duration) {
					var interval = RequestInterval(duration || 0, func, null, 1);
					return function () {
						interval.isPaused() && interval.start();
					};
				}
				function Media(Splide2, Components2, options) {
					var state = Splide2.state;
					var breakpoints = options.breakpoints || {};
					var reducedMotion = options.reducedMotion || {};
					var binder = EventBinder();
					var queries = [];
					function setup() {
						var isMin = options.mediaQuery === "min";
						ownKeys(breakpoints)
							.sort(function (n, m) {
								return isMin ? +n - +m : +m - +n;
							})
							.forEach(function (key) {
								register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
							});
						register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
						update();
					}
					function destroy(completely) {
						if (completely) binder.destroy();
					}
					function register(options2, query) {
						var queryList = matchMedia(query);
						binder.bind(queryList, "change", update);
						queries.push([options2, queryList]);
					}
					function update() {
						var destroyed = state.is(DESTROYED);
						var direction = options.direction;
						var merged = queries.reduce(function (merged2, entry) {
							return merge(merged2, entry[1].matches ? entry[0] : {});
						}, {});
						omit(options);
						set(merged);
						if (options.destroy) Splide2.destroy(options.destroy === "completely");
						else if (destroyed) {
							destroy(true);
							Splide2.mount();
						} else direction !== options.direction && Splide2.refresh();
					}
					function reduce(enable) {
						if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches)
							enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
					}
					function set(opts, base, notify) {
						merge(options, opts);
						base && merge(Object.getPrototypeOf(options), opts);
						if (notify || !state.is(CREATED)) Splide2.emit(EVENT_UPDATED, options);
					}
					return { setup, destroy, reduce, set };
				}
				var ARROW = "Arrow";
				var ARROW_LEFT = ARROW + "Left";
				var ARROW_RIGHT = ARROW + "Right";
				var ARROW_UP = ARROW + "Up";
				var ARROW_DOWN = ARROW + "Down";
				var LTR = "ltr";
				var RTL = "rtl";
				var TTB = "ttb";
				var ORIENTATION_MAP = {
					width: ["height"],
					left: ["top", "right"],
					right: ["bottom", "left"],
					x: ["y"],
					X: ["Y"],
					Y: ["X"],
					ArrowLeft: [ARROW_UP, ARROW_RIGHT],
					ArrowRight: [ARROW_DOWN, ARROW_LEFT],
				};
				function Direction(Splide2, Components2, options) {
					function resolve(prop, axisOnly, direction) {
						direction = direction || options.direction;
						var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
						return (
							(ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index]) ||
							prop.replace(/width|left|right/i, function (match, offset) {
								var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
								return offset > 0
									? replacement.charAt(0).toUpperCase() + replacement.slice(1)
									: replacement;
							})
						);
					}
					function orient(value) {
						return value * (options.direction === RTL ? 1 : -1);
					}
					return { resolve, orient };
				}
				var ROLE = "role";
				var TAB_INDEX = "tabindex";
				var DISABLED = "disabled";
				var ARIA_PREFIX = "aria-";
				var ARIA_CONTROLS = ARIA_PREFIX + "controls";
				var ARIA_CURRENT = ARIA_PREFIX + "current";
				var ARIA_SELECTED = ARIA_PREFIX + "selected";
				var ARIA_LABEL = ARIA_PREFIX + "label";
				var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
				var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
				var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
				var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
				var ARIA_LIVE = ARIA_PREFIX + "live";
				var ARIA_BUSY = ARIA_PREFIX + "busy";
				var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
				var ALL_ATTRIBUTES = [
					ROLE,
					TAB_INDEX,
					DISABLED,
					ARIA_CONTROLS,
					ARIA_CURRENT,
					ARIA_LABEL,
					ARIA_LABELLEDBY,
					ARIA_HIDDEN,
					ARIA_ORIENTATION,
					ARIA_ROLEDESCRIPTION,
				];
				var CLASS_PREFIX = PROJECT_CODE + "__";
				var STATUS_CLASS_PREFIX = "is-";
				var CLASS_ROOT = PROJECT_CODE;
				var CLASS_TRACK = CLASS_PREFIX + "track";
				var CLASS_LIST = CLASS_PREFIX + "list";
				var CLASS_SLIDE = CLASS_PREFIX + "slide";
				var CLASS_CLONE = CLASS_SLIDE + "--clone";
				var CLASS_CONTAINER = CLASS_SLIDE + "__container";
				var CLASS_ARROWS = CLASS_PREFIX + "arrows";
				var CLASS_ARROW = CLASS_PREFIX + "arrow";
				var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
				var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
				var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
				var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
				var CLASS_PROGRESS = CLASS_PREFIX + "progress";
				var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
				var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
				var CLASS_TOGGLE_PLAY = CLASS_TOGGLE + "__play";
				var CLASS_TOGGLE_PAUSE = CLASS_TOGGLE + "__pause";
				var CLASS_SPINNER = CLASS_PREFIX + "spinner";
				var CLASS_SR = CLASS_PREFIX + "sr";
				var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
				var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
				var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
				var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
				var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
				var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
				var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
				var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
				var STATUS_CLASSES = [
					CLASS_ACTIVE,
					CLASS_VISIBLE,
					CLASS_PREV,
					CLASS_NEXT,
					CLASS_LOADING,
					CLASS_FOCUS_IN,
					CLASS_OVERFLOW,
				];
				var CLASSES = {
					slide: CLASS_SLIDE,
					clone: CLASS_CLONE,
					arrows: CLASS_ARROWS,
					arrow: CLASS_ARROW,
					prev: CLASS_ARROW_PREV,
					next: CLASS_ARROW_NEXT,
					pagination: CLASS_PAGINATION,
					page: CLASS_PAGINATION_PAGE,
					spinner: CLASS_SPINNER,
				};
				function closest(from, selector) {
					if (isFunction(from.closest)) return from.closest(selector);
					var elm = from;
					while (elm && elm.nodeType === 1) {
						if (matches(elm, selector)) break;
						elm = elm.parentElement;
					}
					return elm;
				}
				var FRICTION = 5;
				var LOG_INTERVAL = 200;
				var POINTER_DOWN_EVENTS = "touchstart mousedown";
				var POINTER_MOVE_EVENTS = "touchmove mousemove";
				var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";
				function Elements(Splide2, Components2, options) {
					var _EventInterface = EventInterface(Splide2),
						on = _EventInterface.on,
						bind = _EventInterface.bind;
					var root = Splide2.root;
					var i18n = options.i18n;
					var elements = {};
					var slides = [];
					var rootClasses = [];
					var trackClasses = [];
					var track;
					var list;
					var isUsingKey;
					function setup() {
						collect();
						init();
						update();
					}
					function mount() {
						on(EVENT_REFRESH, destroy);
						on(EVENT_REFRESH, setup);
						on(EVENT_UPDATED, update);
						bind(
							document,
							POINTER_DOWN_EVENTS + " keydown",
							function (e) {
								isUsingKey = e.type === "keydown";
							},
							{ capture: true }
						);
						bind(root, "focusin", function () {
							toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
						});
					}
					function destroy(completely) {
						var attrs = ALL_ATTRIBUTES.concat("style");
						empty(slides);
						removeClass(root, rootClasses);
						removeClass(track, trackClasses);
						removeAttribute([track, list], attrs);
						removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
					}
					function update() {
						removeClass(root, rootClasses);
						removeClass(track, trackClasses);
						rootClasses = getClasses(CLASS_ROOT);
						trackClasses = getClasses(CLASS_TRACK);
						addClass(root, rootClasses);
						addClass(track, trackClasses);
						setAttribute(root, ARIA_LABEL, options.label);
						setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
					}
					function collect() {
						track = find("." + CLASS_TRACK);
						list = child(track, "." + CLASS_LIST);
						assert(track && list, "A track/list element is missing.");
						push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
						forOwn(
							{
								arrows: CLASS_ARROWS,
								pagination: CLASS_PAGINATION,
								prev: CLASS_ARROW_PREV,
								next: CLASS_ARROW_NEXT,
								bar: CLASS_PROGRESS_BAR,
								toggle: CLASS_TOGGLE,
							},
							function (className, key) {
								elements[key] = find("." + className);
							}
						);
						assign(elements, { root, track, list, slides });
					}
					function init() {
						var id = root.id || uniqueId(PROJECT_CODE);
						var role = options.role;
						root.id = id;
						track.id = track.id || id + "-track";
						list.id = list.id || id + "-list";
						if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role)
							setAttribute(root, ROLE, role);
						setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
						setAttribute(list, ROLE, "presentation");
					}
					function find(selector) {
						var elm = query(root, selector);
						return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
					}
					function getClasses(base) {
						return [
							base + "--" + options.type,
							base + "--" + options.direction,
							options.drag && base + "--draggable",
							options.isNavigation && base + "--nav",
							base === CLASS_ROOT && CLASS_ACTIVE,
						];
					}
					return assign(elements, { setup, mount, destroy });
				}
				var SLIDE = "slide";
				var LOOP = "loop";
				var FADE = "fade";
				function Slide$1(Splide2, index, slideIndex, slide) {
					var event = EventInterface(Splide2);
					var on = event.on,
						emit = event.emit,
						bind = event.bind;
					var Components = Splide2.Components,
						root = Splide2.root,
						options = Splide2.options;
					var isNavigation = options.isNavigation,
						updateOnMove = options.updateOnMove,
						i18n = options.i18n,
						pagination = options.pagination,
						slideFocus = options.slideFocus;
					var resolve = Components.Direction.resolve;
					var styles = getAttribute(slide, "style");
					var label = getAttribute(slide, ARIA_LABEL);
					var isClone = slideIndex > -1;
					var container = child(slide, "." + CLASS_CONTAINER);
					var destroyed;
					function mount() {
						if (!isClone) {
							slide.id = root.id + "-slide" + pad(index + 1);
							setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
							setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
							setAttribute(
								slide,
								ARIA_LABEL,
								label || format(i18n.slideLabel, [index + 1, Splide2.length])
							);
						}
						listen();
					}
					function listen() {
						bind(slide, "click", apply(emit, EVENT_CLICK, self));
						bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
						on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
						on(EVENT_NAVIGATION_MOUNTED, initNavigation);
						if (updateOnMove) on(EVENT_MOVE, onMove);
					}
					function destroy() {
						destroyed = true;
						event.destroy();
						removeClass(slide, STATUS_CLASSES);
						removeAttribute(slide, ALL_ATTRIBUTES);
						setAttribute(slide, "style", styles);
						setAttribute(slide, ARIA_LABEL, label || "");
					}
					function initNavigation() {
						var controls = Splide2.splides
							.map(function (target) {
								var Slide2 = target.splide.Components.Slides.getAt(index);
								return Slide2 ? Slide2.slide.id : "";
							})
							.join(" ");
						setAttribute(
							slide,
							ARIA_LABEL,
							format(i18n.slideX, (isClone ? slideIndex : index) + 1)
						);
						setAttribute(slide, ARIA_CONTROLS, controls);
						setAttribute(slide, ROLE, slideFocus ? "button" : "");
						slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
					}
					function onMove() {
						if (!destroyed) update();
					}
					function update() {
						if (!destroyed) {
							var curr = Splide2.index;
							updateActivity();
							updateVisibility();
							toggleClass(slide, CLASS_PREV, index === curr - 1);
							toggleClass(slide, CLASS_NEXT, index === curr + 1);
						}
					}
					function updateActivity() {
						var active = isActive();
						if (active !== hasClass(slide, CLASS_ACTIVE)) {
							toggleClass(slide, CLASS_ACTIVE, active);
							setAttribute(slide, ARIA_CURRENT, (isNavigation && active) || "");
							emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
						}
					}
					function updateVisibility() {
						var visible = isVisible();
						var hidden = !visible && (!isActive() || isClone);
						if (!Splide2.state.is([MOVING, SCROLLING]))
							setAttribute(slide, ARIA_HIDDEN, hidden || "");
						setAttribute(
							queryAll(slide, options.focusableNodes || ""),
							TAB_INDEX,
							hidden ? -1 : ""
						);
						if (slideFocus) setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
						if (visible !== hasClass(slide, CLASS_VISIBLE)) {
							toggleClass(slide, CLASS_VISIBLE, visible);
							emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
						}
						if (!visible && document.activeElement === slide) {
							var Slide2 = Components.Slides.getAt(Splide2.index);
							Slide2 && focus(Slide2.slide);
						}
					}
					function style$1(prop, value, useContainer) {
						style((useContainer && container) || slide, prop, value);
					}
					function isActive() {
						var curr = Splide2.index;
						return curr === index || (options.cloneStatus && curr === slideIndex);
					}
					function isVisible() {
						if (Splide2.is(FADE)) return isActive();
						var trackRect = rect(Components.Elements.track);
						var slideRect = rect(slide);
						var left = resolve("left", true);
						var right = resolve("right", true);
						return (
							floor(trackRect[left]) <= ceil(slideRect[left]) &&
							floor(slideRect[right]) <= ceil(trackRect[right])
						);
					}
					function isWithin(from, distance) {
						var diff = abs(from - index);
						if (!isClone && (options.rewind || Splide2.is(LOOP)))
							diff = min(diff, Splide2.length - diff);
						return diff <= distance;
					}
					var self = {
						index,
						slideIndex,
						slide,
						container,
						isClone,
						mount,
						destroy,
						update,
						style: style$1,
						isWithin,
					};
					return self;
				}
				function Slides(Splide2, Components2, options) {
					var _EventInterface2 = EventInterface(Splide2),
						on = _EventInterface2.on,
						emit = _EventInterface2.emit,
						bind = _EventInterface2.bind;
					var _Components2$Elements = Components2.Elements,
						slides = _Components2$Elements.slides,
						list = _Components2$Elements.list;
					var Slides2 = [];
					function mount() {
						init();
						on(EVENT_REFRESH, destroy);
						on(EVENT_REFRESH, init);
					}
					function init() {
						slides.forEach(function (slide, index) {
							register(slide, index, -1);
						});
					}
					function destroy() {
						forEach$1(function (Slide2) {
							Slide2.destroy();
						});
						empty(Slides2);
					}
					function update() {
						forEach$1(function (Slide2) {
							Slide2.update();
						});
					}
					function register(slide, index, slideIndex) {
						var object = Slide$1(Splide2, index, slideIndex, slide);
						object.mount();
						Slides2.push(object);
						Slides2.sort(function (Slide1, Slide2) {
							return Slide1.index - Slide2.index;
						});
					}
					function get(excludeClones) {
						return excludeClones
							? filter(function (Slide2) {
									return !Slide2.isClone;
								})
							: Slides2;
					}
					function getIn(page) {
						var Controller = Components2.Controller;
						var index = Controller.toIndex(page);
						var max = Controller.hasFocus() ? 1 : options.perPage;
						return filter(function (Slide2) {
							return between(Slide2.index, index, index + max - 1);
						});
					}
					function getAt(index) {
						return filter(index)[0];
					}
					function add(items, index) {
						forEach(items, function (slide) {
							if (isString(slide)) slide = parseHtml(slide);
							if (isHTMLElement(slide)) {
								var ref = slides[index];
								ref ? before(slide, ref) : append(list, slide);
								addClass(slide, options.classes.slide);
								observeImages(slide, apply(emit, EVENT_RESIZE));
							}
						});
						emit(EVENT_REFRESH);
					}
					function remove$1(matcher) {
						remove(
							filter(matcher).map(function (Slide2) {
								return Slide2.slide;
							})
						);
						emit(EVENT_REFRESH);
					}
					function forEach$1(iteratee, excludeClones) {
						get(excludeClones).forEach(iteratee);
					}
					function filter(matcher) {
						return Slides2.filter(
							isFunction(matcher)
								? matcher
								: function (Slide2) {
										return isString(matcher)
											? matches(Slide2.slide, matcher)
											: includes(toArray(matcher), Slide2.index);
									}
						);
					}
					function style(prop, value, useContainer) {
						forEach$1(function (Slide2) {
							Slide2.style(prop, value, useContainer);
						});
					}
					function observeImages(elm, callback) {
						var images = queryAll(elm, "img");
						var length = images.length;
						if (length)
							images.forEach(function (img) {
								bind(img, "load error", function () {
									if (!--length) callback();
								});
							});
						else callback();
					}
					function getLength(excludeClones) {
						return excludeClones ? slides.length : Slides2.length;
					}
					function isEnough() {
						return Slides2.length > options.perPage;
					}
					return {
						mount,
						destroy,
						update,
						register,
						get,
						getIn,
						getAt,
						add,
						remove: remove$1,
						forEach: forEach$1,
						filter,
						style,
						getLength,
						isEnough,
					};
				}
				function Layout(Splide2, Components2, options) {
					var _EventInterface3 = EventInterface(Splide2),
						on = _EventInterface3.on,
						bind = _EventInterface3.bind,
						emit = _EventInterface3.emit;
					var Slides = Components2.Slides;
					var resolve = Components2.Direction.resolve;
					var _Components2$Elements2 = Components2.Elements,
						root = _Components2$Elements2.root,
						track = _Components2$Elements2.track,
						list = _Components2$Elements2.list;
					var getAt = Slides.getAt,
						styleSlides = Slides.style;
					var vertical;
					var rootRect;
					var overflow;
					function mount() {
						init();
						bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
						on([EVENT_UPDATED, EVENT_REFRESH], init);
						on(EVENT_RESIZE, resize);
					}
					function init() {
						vertical = options.direction === TTB;
						style(root, "maxWidth", unit(options.width));
						style(track, resolve("paddingLeft"), cssPadding(false));
						style(track, resolve("paddingRight"), cssPadding(true));
						resize(true);
					}
					function resize(force) {
						var newRect = rect(root);
						if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
							style(track, "height", cssTrackHeight());
							styleSlides(resolve("marginRight"), unit(options.gap));
							styleSlides("width", cssSlideWidth());
							styleSlides("height", cssSlideHeight(), true);
							rootRect = newRect;
							emit(EVENT_RESIZED);
							if (overflow !== (overflow = isOverflow())) {
								toggleClass(root, CLASS_OVERFLOW, overflow);
								emit(EVENT_OVERFLOW, overflow);
							}
						}
					}
					function cssPadding(right) {
						var padding = options.padding;
						var prop = resolve(right ? "right" : "left");
						return (padding && unit(padding[prop] || (isObject(padding) ? 0 : padding))) || "0px";
					}
					function cssTrackHeight() {
						var height = "";
						if (vertical) {
							height = cssHeight();
							assert(height, "height or heightRatio is missing.");
							height =
								"calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
						}
						return height;
					}
					function cssHeight() {
						return unit(options.height || rect(list).width * options.heightRatio);
					}
					function cssSlideWidth() {
						return options.autoWidth
							? null
							: unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
					}
					function cssSlideHeight() {
						return (
							unit(options.fixedHeight) ||
							(vertical ? (options.autoHeight ? null : cssSlideSize()) : cssHeight())
						);
					}
					function cssSlideSize() {
						var gap = unit(options.gap);
						return (
							"calc((100%" +
							(gap && " + " + gap) +
							")/" +
							(options.perPage || 1) +
							(gap && " - " + gap) +
							")"
						);
					}
					function listSize() {
						return rect(list)[resolve("width")];
					}
					function slideSize(index, withoutGap) {
						var Slide = getAt(index || 0);
						return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
					}
					function totalSize(index, withoutGap) {
						var Slide = getAt(index);
						if (Slide) {
							var right = rect(Slide.slide)[resolve("right")];
							var left = rect(list)[resolve("left")];
							return abs(right - left) + (withoutGap ? 0 : getGap());
						}
						return 0;
					}
					function sliderSize(withoutGap) {
						return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
					}
					function getGap() {
						var Slide = getAt(0);
						return (Slide && parseFloat(style(Slide.slide, resolve("marginRight")))) || 0;
					}
					function getPadding(right) {
						return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
					}
					function isOverflow() {
						return Splide2.is(FADE) || sliderSize(true) > listSize();
					}
					return {
						mount,
						resize,
						listSize,
						slideSize,
						sliderSize,
						totalSize,
						getPadding,
						isOverflow,
					};
				}
				var MULTIPLIER = 2;
				function Clones(Splide2, Components2, options) {
					var event = EventInterface(Splide2);
					var on = event.on;
					var Elements = Components2.Elements,
						Slides = Components2.Slides;
					var resolve = Components2.Direction.resolve;
					var clones = [];
					var cloneCount;
					function mount() {
						on(EVENT_REFRESH, remount);
						on([EVENT_UPDATED, EVENT_RESIZE], observe);
						if ((cloneCount = computeCloneCount())) {
							generate(cloneCount);
							Components2.Layout.resize(true);
						}
					}
					function remount() {
						destroy();
						mount();
					}
					function destroy() {
						remove(clones);
						empty(clones);
						event.destroy();
					}
					function observe() {
						var count = computeCloneCount();
						if (cloneCount !== count) if (cloneCount < count || !count) event.emit(EVENT_REFRESH);
					}
					function generate(count) {
						var slides = Slides.get().slice();
						var length = slides.length;
						if (length) {
							while (slides.length < count) push(slides, slides);
							push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
								var isHead = index < count;
								var clone = cloneDeep(Slide.slide, index);
								isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
								push(clones, clone);
								Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
							});
						}
					}
					function cloneDeep(elm, index) {
						var clone = elm.cloneNode(true);
						addClass(clone, options.classes.clone);
						clone.id = Splide2.root.id + "-clone" + pad(index + 1);
						return clone;
					}
					function computeCloneCount() {
						var clones2 = options.clones;
						if (!Splide2.is(LOOP)) clones2 = 0;
						else {
							if (isUndefined(clones2)) {
								var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
								var fixedCount =
									fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
								clones2 =
									fixedCount ||
									(options[resolve("autoWidth")] && Splide2.length) ||
									options.perPage * MULTIPLIER;
							}
						}
						return clones2;
					}
					return { mount, destroy };
				}
				function Move(Splide2, Components2, options) {
					var _EventInterface4 = EventInterface(Splide2),
						on = _EventInterface4.on,
						emit = _EventInterface4.emit;
					var set = Splide2.state.set;
					var _Components2$Layout = Components2.Layout,
						slideSize = _Components2$Layout.slideSize,
						getPadding = _Components2$Layout.getPadding,
						totalSize = _Components2$Layout.totalSize,
						listSize = _Components2$Layout.listSize,
						sliderSize = _Components2$Layout.sliderSize;
					var _Components2$Directio = Components2.Direction,
						resolve = _Components2$Directio.resolve,
						orient = _Components2$Directio.orient;
					var _Components2$Elements3 = Components2.Elements,
						list = _Components2$Elements3.list,
						track = _Components2$Elements3.track;
					var Transition;
					function mount() {
						Transition = Components2.Transition;
						on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
					}
					function reposition() {
						if (!Components2.Controller.isBusy()) {
							Components2.Scroll.cancel();
							jump(Splide2.index);
							Components2.Slides.update();
						}
					}
					function move(dest, index, prev, callback) {
						if (dest !== index && canShift(dest > prev)) {
							cancel();
							translate(shift(getPosition(), dest > prev), true);
						}
						set(MOVING);
						emit(EVENT_MOVE, index, prev, dest);
						Transition.start(index, function () {
							set(IDLE);
							emit(EVENT_MOVED, index, prev, dest);
							callback && callback();
						});
					}
					function jump(index) {
						translate(toPosition(index, true));
					}
					function translate(position, preventLoop) {
						if (!Splide2.is(FADE)) {
							var destination = preventLoop ? position : loop(position);
							style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
							position !== destination && emit(EVENT_SHIFTED);
						}
					}
					function loop(position) {
						if (Splide2.is(LOOP)) {
							var index = toIndex(position);
							var exceededMax = index > Components2.Controller.getEnd();
							var exceededMin = index < 0;
							if (exceededMin || exceededMax) position = shift(position, exceededMax);
						}
						return position;
					}
					function shift(position, backwards) {
						var excess = position - getLimit(backwards);
						var size = sliderSize();
						position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
						return position;
					}
					function cancel() {
						translate(getPosition(), true);
						Transition.cancel();
					}
					function toIndex(position) {
						var Slides = Components2.Slides.get();
						var index = 0;
						var minDistance = Infinity;
						for (var i = 0; i < Slides.length; i++) {
							var slideIndex = Slides[i].index;
							var distance = abs(toPosition(slideIndex, true) - position);
							if (distance <= minDistance) {
								minDistance = distance;
								index = slideIndex;
							} else break;
						}
						return index;
					}
					function toPosition(index, trimming) {
						var position = orient(totalSize(index - 1) - offset(index));
						return trimming ? trim(position) : position;
					}
					function getPosition() {
						var left = resolve("left");
						return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
					}
					function trim(position) {
						if (options.trimSpace && Splide2.is(SLIDE))
							position = clamp(position, 0, orient(sliderSize(true) - listSize()));
						return position;
					}
					function offset(index) {
						var focus = options.focus;
						return focus === "center"
							? (listSize() - slideSize(index, true)) / 2
							: +focus * slideSize(index) || 0;
					}
					function getLimit(max) {
						return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
					}
					function canShift(backwards) {
						var shifted = orient(shift(getPosition(), backwards));
						return backwards
							? shifted >= 0
							: shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
					}
					function exceededLimit(max, position) {
						position = isUndefined(position) ? getPosition() : position;
						var exceededMin = max !== true && orient(position) < orient(getLimit(false));
						var exceededMax = max !== false && orient(position) > orient(getLimit(true));
						return exceededMin || exceededMax;
					}
					return {
						mount,
						move,
						jump,
						translate,
						shift,
						cancel,
						toIndex,
						toPosition,
						getPosition,
						getLimit,
						exceededLimit,
						reposition,
					};
				}
				function Controller(Splide2, Components2, options) {
					var _EventInterface5 = EventInterface(Splide2),
						on = _EventInterface5.on,
						emit = _EventInterface5.emit;
					var Move = Components2.Move;
					var getPosition = Move.getPosition,
						getLimit = Move.getLimit,
						toPosition = Move.toPosition;
					var _Components2$Slides = Components2.Slides,
						isEnough = _Components2$Slides.isEnough,
						getLength = _Components2$Slides.getLength;
					var omitEnd = options.omitEnd;
					var isLoop = Splide2.is(LOOP);
					var isSlide = Splide2.is(SLIDE);
					var getNext = apply(getAdjacent, false);
					var getPrev = apply(getAdjacent, true);
					var currIndex = options.start || 0;
					var endIndex;
					var prevIndex = currIndex;
					var slideCount;
					var perMove;
					var perPage;
					function mount() {
						init();
						on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], init);
						on(EVENT_RESIZED, onResized);
					}
					function init() {
						slideCount = getLength(true);
						perMove = options.perMove;
						perPage = options.perPage;
						endIndex = getEnd();
						var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);
						if (index !== currIndex) {
							currIndex = index;
							Move.reposition();
						}
					}
					function onResized() {
						if (endIndex !== getEnd()) emit(EVENT_END_INDEX_CHANGED);
					}
					function go(control, allowSameIndex, callback) {
						if (!isBusy()) {
							var dest = parse(control);
							var index = loop(dest);
							if (index > -1 && (allowSameIndex || index !== currIndex)) {
								setIndex(index);
								Move.move(dest, index, prevIndex, callback);
							}
						}
					}
					function scroll(destination, duration, snap, callback) {
						Components2.Scroll.scroll(destination, duration, snap, function () {
							var index = loop(Move.toIndex(getPosition()));
							setIndex(omitEnd ? min(index, endIndex) : index);
							callback && callback();
						});
					}
					function parse(control) {
						var index = currIndex;
						if (isString(control)) {
							var _ref = control.match(/([+\-<>])(\d+)?/) || [],
								indicator = _ref[1],
								number = _ref[2];
							if (indicator === "+" || indicator === "-")
								index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
							else if (indicator === ">") index = number ? toIndex(+number) : getNext(true);
							else {
								if (indicator === "<") index = getPrev(true);
							}
						} else index = isLoop ? control : clamp(control, 0, endIndex);
						return index;
					}
					function getAdjacent(prev, destination) {
						var number = perMove || (hasFocus() ? 1 : perPage);
						var dest = computeDestIndex(
							currIndex + number * (prev ? -1 : 1),
							currIndex,
							!(perMove || hasFocus())
						);
						if (dest === -1 && isSlide)
							if (!approximatelyEqual(getPosition(), getLimit(!prev), 1))
								return prev ? 0 : endIndex;
						return destination ? dest : loop(dest);
					}
					function computeDestIndex(dest, from, snapPage) {
						if (isEnough() || hasFocus()) {
							var index = computeMovableDestIndex(dest);
							if (index !== dest) {
								from = dest;
								dest = index;
								snapPage = false;
							}
							if (dest < 0 || dest > endIndex)
								if (
									!perMove &&
									(between(0, dest, from, true) || between(endIndex, from, dest, true))
								)
									dest = toIndex(toPage(dest));
								else if (isLoop)
									dest = snapPage
										? dest < 0
											? -(slideCount % perPage || perPage)
											: slideCount
										: dest;
								else if (options.rewind) dest = dest < 0 ? endIndex : 0;
								else dest = -1;
							else {
								if (snapPage && dest !== from)
									dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
							}
						} else dest = -1;
						return dest;
					}
					function computeMovableDestIndex(dest) {
						if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
							var position = getPosition();
							while (
								position === toPosition(dest, true) &&
								between(dest, 0, Splide2.length - 1, !options.rewind)
							)
								dest < currIndex ? --dest : ++dest;
						}
						return dest;
					}
					function loop(index) {
						return isLoop ? (index + slideCount) % slideCount || 0 : index;
					}
					function getEnd() {
						var end = slideCount - (hasFocus() || (isLoop && perMove) ? 1 : perPage);
						while (omitEnd && end-- > 0)
							if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
								end++;
								break;
							}
						return clamp(end, 0, slideCount - 1);
					}
					function toIndex(page) {
						return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
					}
					function toPage(index) {
						return hasFocus()
							? min(index, endIndex)
							: floor((index >= endIndex ? slideCount - 1 : index) / perPage);
					}
					function toDest(destination) {
						var closest = Move.toIndex(destination);
						return isSlide ? clamp(closest, 0, endIndex) : closest;
					}
					function setIndex(index) {
						if (index !== currIndex) {
							prevIndex = currIndex;
							currIndex = index;
						}
					}
					function getIndex(prev) {
						return prev ? prevIndex : currIndex;
					}
					function hasFocus() {
						return !isUndefined(options.focus) || options.isNavigation;
					}
					function isBusy() {
						return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
					}
					return {
						mount,
						go,
						scroll,
						getNext,
						getPrev,
						getAdjacent,
						getEnd,
						setIndex,
						getIndex,
						toIndex,
						toPage,
						toDest,
						hasFocus,
						isBusy,
					};
				}
				var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
				var PATH =
					"m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
				var SIZE = 40;
				function Arrows(Splide2, Components2, options) {
					var event = EventInterface(Splide2);
					var on = event.on,
						bind = event.bind,
						emit = event.emit;
					var classes = options.classes,
						i18n = options.i18n;
					var Elements = Components2.Elements,
						Controller = Components2.Controller;
					var placeholder = Elements.arrows,
						track = Elements.track;
					var wrapper = placeholder;
					var prev = Elements.prev;
					var next = Elements.next;
					var created;
					var wrapperClasses;
					var arrows = {};
					function mount() {
						init();
						on(EVENT_UPDATED, remount);
					}
					function remount() {
						destroy();
						mount();
					}
					function init() {
						var enabled = options.arrows;
						if (enabled && !(prev && next)) createArrows();
						if (prev && next) {
							assign(arrows, { prev, next });
							display(wrapper, enabled ? "" : "none");
							addClass(wrapper, (wrapperClasses = CLASS_ARROWS + "--" + options.direction));
							if (enabled) {
								listen();
								update();
								setAttribute([prev, next], ARIA_CONTROLS, track.id);
								emit(EVENT_ARROWS_MOUNTED, prev, next);
							}
						}
					}
					function destroy() {
						event.destroy();
						removeClass(wrapper, wrapperClasses);
						if (created) {
							remove(placeholder ? [prev, next] : wrapper);
							prev = next = null;
						} else removeAttribute([prev, next], ALL_ATTRIBUTES);
					}
					function listen() {
						on(
							[EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED],
							update
						);
						bind(next, "click", apply(go, ">"));
						bind(prev, "click", apply(go, "<"));
					}
					function go(control) {
						Controller.go(control, true);
					}
					function createArrows() {
						wrapper = placeholder || create("div", classes.arrows);
						prev = createArrow(true);
						next = createArrow(false);
						created = true;
						append(wrapper, [prev, next]);
						!placeholder && before(wrapper, track);
					}
					function createArrow(prev2) {
						var arrow =
							'<button class="' +
							classes.arrow +
							" " +
							(prev2 ? classes.prev : classes.next) +
							'" type="button"><svg xmlns="' +
							XML_NAME_SPACE +
							'" viewBox="0 0 ' +
							SIZE +
							" " +
							SIZE +
							'" width="' +
							SIZE +
							'" height="' +
							SIZE +
							'" focusable="false"><path d="' +
							(options.arrowPath || PATH) +
							'" />';
						return parseHtml(arrow);
					}
					function update() {
						if (prev && next) {
							var index = Splide2.index;
							var prevIndex = Controller.getPrev();
							var nextIndex = Controller.getNext();
							var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
							var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
							prev.disabled = prevIndex < 0;
							next.disabled = nextIndex < 0;
							setAttribute(prev, ARIA_LABEL, prevLabel);
							setAttribute(next, ARIA_LABEL, nextLabel);
							emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
						}
					}
					return { arrows, mount, destroy, update };
				}
				var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";
				function Autoplay(Splide2, Components2, options) {
					var _EventInterface6 = EventInterface(Splide2),
						on = _EventInterface6.on,
						bind = _EventInterface6.bind,
						emit = _EventInterface6.emit;
					var interval = RequestInterval(
						options.interval,
						Splide2.go.bind(Splide2, ">"),
						onAnimationFrame
					);
					var isPaused = interval.isPaused;
					var Elements = Components2.Elements,
						_Components2$Elements4 = Components2.Elements,
						root = _Components2$Elements4.root,
						toggle = _Components2$Elements4.toggle;
					var autoplay = options.autoplay;
					var hovered;
					var focused;
					var stopped = autoplay === "pause";
					function mount() {
						if (autoplay) {
							listen();
							toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
							stopped || play();
							update();
						}
					}
					function listen() {
						if (options.pauseOnHover)
							bind(root, "mouseenter mouseleave", function (e) {
								hovered = e.type === "mouseenter";
								autoToggle();
							});
						if (options.pauseOnFocus)
							bind(root, "focusin focusout", function (e) {
								focused = e.type === "focusin";
								autoToggle();
							});
						if (toggle)
							bind(toggle, "click", function () {
								stopped ? play() : pause(true);
							});
						on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
						on(EVENT_MOVE, onMove);
					}
					function play() {
						if (isPaused() && Components2.Slides.isEnough()) {
							interval.start(!options.resetProgress);
							focused = hovered = stopped = false;
							update();
							emit(EVENT_AUTOPLAY_PLAY);
						}
					}
					function pause(stop) {
						if (stop === void 0) stop = true;
						stopped = !!stop;
						update();
						if (!isPaused()) {
							interval.pause();
							emit(EVENT_AUTOPLAY_PAUSE);
						}
					}
					function autoToggle() {
						if (!stopped) hovered || focused ? pause(false) : play();
					}
					function update() {
						if (toggle) {
							toggleClass(toggle, CLASS_ACTIVE, !stopped);
							setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
						}
					}
					function onAnimationFrame(rate) {
						var bar = Elements.bar;
						bar && style(bar, "width", rate * 100 + "%");
						emit(EVENT_AUTOPLAY_PLAYING, rate);
					}
					function onMove(index) {
						var Slide = Components2.Slides.getAt(index);
						interval.set(
							(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE)) || options.interval
						);
					}
					return { mount, destroy: interval.cancel, play, pause, isPaused };
				}
				function Cover(Splide2, Components2, options) {
					var _EventInterface7 = EventInterface(Splide2),
						on = _EventInterface7.on;
					function mount() {
						if (options.cover) {
							on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
							on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
						}
					}
					function cover(cover2) {
						Components2.Slides.forEach(function (Slide) {
							var img = child(Slide.container || Slide.slide, "img");
							if (img && img.src) toggle(cover2, img, Slide);
						});
					}
					function toggle(cover2, img, Slide) {
						Slide.style(
							"background",
							cover2 ? 'center/cover no-repeat url("' + img.src + '")' : "",
							true
						);
						display(img, cover2 ? "none" : "");
					}
					return { mount, destroy: apply(cover, false) };
				}
				var BOUNCE_DIFF_THRESHOLD = 10;
				var BOUNCE_DURATION = 600;
				var FRICTION_FACTOR = 0.6;
				var BASE_VELOCITY = 1.5;
				var MIN_DURATION = 800;
				function Scroll(Splide2, Components2, options) {
					var _EventInterface8 = EventInterface(Splide2),
						on = _EventInterface8.on,
						emit = _EventInterface8.emit;
					var set = Splide2.state.set;
					var Move = Components2.Move;
					var getPosition = Move.getPosition,
						getLimit = Move.getLimit,
						exceededLimit = Move.exceededLimit,
						translate = Move.translate;
					var isSlide = Splide2.is(SLIDE);
					var interval;
					var callback;
					var friction = 1;
					function mount() {
						on(EVENT_MOVE, clear);
						on([EVENT_UPDATED, EVENT_REFRESH], cancel);
					}
					function scroll(destination, duration, snap, onScrolled, noConstrain) {
						var from = getPosition();
						clear();
						if (snap && (!isSlide || !exceededLimit())) {
							var size = Components2.Layout.sliderSize();
							var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
							destination =
								Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
						}
						var noDistance = approximatelyEqual(from, destination, 1);
						friction = 1;
						duration = noDistance
							? 0
							: duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
						callback = onScrolled;
						interval = RequestInterval(
							duration,
							onEnd,
							apply(update, from, destination, noConstrain),
							1
						);
						set(SCROLLING);
						emit(EVENT_SCROLL);
						interval.start();
					}
					function onEnd() {
						set(IDLE);
						callback && callback();
						emit(EVENT_SCROLLED);
					}
					function update(from, to, noConstrain, rate) {
						var position = getPosition();
						var target = from + (to - from) * easing(rate);
						var diff = (target - position) * friction;
						translate(position + diff);
						if (isSlide && !noConstrain && exceededLimit()) {
							friction *= FRICTION_FACTOR;
							if (abs(diff) < BOUNCE_DIFF_THRESHOLD)
								scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
						}
					}
					function clear() {
						if (interval) interval.cancel();
					}
					function cancel() {
						if (interval && !interval.isPaused()) {
							clear();
							onEnd();
						}
					}
					function easing(t) {
						var easingFunc = options.easingFunc;
						return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
					}
					return { mount, destroy: clear, scroll, cancel };
				}
				var SCROLL_LISTENER_OPTIONS = { passive: false, capture: true };
				function Drag(Splide2, Components2, options) {
					var _EventInterface9 = EventInterface(Splide2),
						on = _EventInterface9.on,
						emit = _EventInterface9.emit,
						bind = _EventInterface9.bind,
						unbind = _EventInterface9.unbind;
					var state = Splide2.state;
					var Move = Components2.Move,
						Scroll = Components2.Scroll,
						Controller = Components2.Controller,
						track = Components2.Elements.track,
						reduce = Components2.Media.reduce;
					var _Components2$Directio2 = Components2.Direction,
						resolve = _Components2$Directio2.resolve,
						orient = _Components2$Directio2.orient;
					var getPosition = Move.getPosition,
						exceededLimit = Move.exceededLimit;
					var basePosition;
					var baseEvent;
					var prevBaseEvent;
					var isFree;
					var dragging;
					var exceeded = false;
					var clickPrevented;
					var disabled;
					var target;
					function mount() {
						bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
						bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
						bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
						bind(track, "click", onClick, { capture: true });
						bind(track, "dragstart", prevent);
						on([EVENT_MOUNTED, EVENT_UPDATED], init);
					}
					function init() {
						var drag = options.drag;
						disable(!drag);
						isFree = drag === "free";
					}
					function onPointerDown(e) {
						clickPrevented = false;
						if (!disabled) {
							var isTouch = isTouchEvent(e);
							if (isDraggable(e.target) && (isTouch || !e.button))
								if (!Controller.isBusy()) {
									target = isTouch ? track : window;
									dragging = state.is([MOVING, SCROLLING]);
									prevBaseEvent = null;
									bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
									bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
									Move.cancel();
									Scroll.cancel();
									save(e);
								} else prevent(e, true);
						}
					}
					function onPointerMove(e) {
						if (!state.is(DRAGGING)) {
							state.set(DRAGGING);
							emit(EVENT_DRAG);
						}
						if (e.cancelable)
							if (dragging) {
								Move.translate(basePosition + constrain(diffCoord(e)));
								var expired = diffTime(e) > LOG_INTERVAL;
								var hasExceeded = exceeded !== (exceeded = exceededLimit());
								if (expired || hasExceeded) save(e);
								clickPrevented = true;
								emit(EVENT_DRAGGING);
								prevent(e);
							} else {
								if (isSliderDirection(e)) {
									dragging = shouldStart(e);
									prevent(e);
								}
							}
					}
					function onPointerUp(e) {
						if (state.is(DRAGGING)) {
							state.set(IDLE);
							emit(EVENT_DRAGGED);
						}
						if (dragging) {
							move(e);
							prevent(e);
						}
						unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
						unbind(target, POINTER_UP_EVENTS, onPointerUp);
						dragging = false;
					}
					function onClick(e) {
						if (!disabled && clickPrevented) prevent(e, true);
					}
					function save(e) {
						prevBaseEvent = baseEvent;
						baseEvent = e;
						basePosition = getPosition();
					}
					function move(e) {
						var velocity = computeVelocity(e);
						var destination = computeDestination(velocity);
						var rewind = options.rewind && options.rewindByDrag;
						reduce(false);
						if (isFree) Controller.scroll(destination, 0, options.snap);
						else if (Splide2.is(FADE))
							Controller.go(orient(sign(velocity)) < 0 ? (rewind ? "<" : "-") : rewind ? ">" : "+");
						else if (Splide2.is(SLIDE) && exceeded && rewind)
							Controller.go(exceededLimit(true) ? ">" : "<");
						else Controller.go(Controller.toDest(destination), true);
						reduce(true);
					}
					function shouldStart(e) {
						var thresholds = options.dragMinThreshold;
						var isObj = isObject(thresholds);
						var mouse = (isObj && thresholds.mouse) || 0;
						var touch = (isObj ? thresholds.touch : +thresholds) || 10;
						return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
					}
					function isSliderDirection(e) {
						return abs(diffCoord(e)) > abs(diffCoord(e, true));
					}
					function computeVelocity(e) {
						if (Splide2.is(LOOP) || !exceeded) {
							var time = diffTime(e);
							if (time && time < LOG_INTERVAL) return diffCoord(e) / time;
						}
						return 0;
					}
					function computeDestination(velocity) {
						return (
							getPosition() +
							sign(velocity) *
								min(
									abs(velocity) * (options.flickPower || 600),
									isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1)
								)
						);
					}
					function diffCoord(e, orthogonal) {
						return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
					}
					function diffTime(e) {
						return timeOf(e) - timeOf(getBaseEvent(e));
					}
					function getBaseEvent(e) {
						return (baseEvent === e && prevBaseEvent) || baseEvent;
					}
					function coordOf(e, orthogonal) {
						return (isTouchEvent(e) ? e.changedTouches[0] : e)[
							"page" + resolve(orthogonal ? "Y" : "X")
						];
					}
					function constrain(diff) {
						return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
					}
					function isDraggable(target2) {
						var noDrag = options.noDrag;
						return (
							!matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) &&
							(!noDrag || !matches(target2, noDrag))
						);
					}
					function isTouchEvent(e) {
						return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
					}
					function isDragging() {
						return dragging;
					}
					function disable(value) {
						disabled = value;
					}
					return { mount, disable, isDragging };
				}
				var NORMALIZATION_MAP = {
					Spacebar: " ",
					Right: ARROW_RIGHT,
					Left: ARROW_LEFT,
					Up: ARROW_UP,
					Down: ARROW_DOWN,
				};
				function normalizeKey(key) {
					key = isString(key) ? key : key.key;
					return NORMALIZATION_MAP[key] || key;
				}
				var KEYBOARD_EVENT = "keydown";
				function Keyboard(Splide2, Components2, options) {
					var _EventInterface10 = EventInterface(Splide2),
						on = _EventInterface10.on,
						bind = _EventInterface10.bind,
						unbind = _EventInterface10.unbind;
					var root = Splide2.root;
					var resolve = Components2.Direction.resolve;
					var target;
					var disabled;
					function mount() {
						init();
						on(EVENT_UPDATED, destroy);
						on(EVENT_UPDATED, init);
						on(EVENT_MOVE, onMove);
					}
					function init() {
						var keyboard = options.keyboard;
						if (keyboard) {
							target = keyboard === "global" ? window : root;
							bind(target, KEYBOARD_EVENT, onKeydown);
						}
					}
					function destroy() {
						unbind(target, KEYBOARD_EVENT);
					}
					function disable(value) {
						disabled = value;
					}
					function onMove() {
						var _disabled = disabled;
						disabled = true;
						nextTick(function () {
							disabled = _disabled;
						});
					}
					function onKeydown(e) {
						if (!disabled) {
							var key = normalizeKey(e);
							if (key === resolve(ARROW_LEFT)) Splide2.go("<");
							else {
								if (key === resolve(ARROW_RIGHT)) Splide2.go(">");
							}
						}
					}
					return { mount, destroy, disable };
				}
				var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
				var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
				var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";
				function LazyLoad(Splide2, Components2, options) {
					var _EventInterface11 = EventInterface(Splide2),
						on = _EventInterface11.on,
						off = _EventInterface11.off,
						bind = _EventInterface11.bind,
						emit = _EventInterface11.emit;
					var isSequential = options.lazyLoad === "sequential";
					var events = [EVENT_MOVED, EVENT_SCROLLED];
					var entries = [];
					function mount() {
						if (options.lazyLoad) {
							init();
							on(EVENT_REFRESH, init);
						}
					}
					function init() {
						empty(entries);
						register();
						if (isSequential) loadNext();
						else {
							off(events);
							on(events, check);
							check();
						}
					}
					function register() {
						Components2.Slides.forEach(function (Slide) {
							queryAll(Slide.slide, IMAGE_SELECTOR).forEach(function (img) {
								var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
								var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);
								if (src !== img.src || srcset !== img.srcset) {
									var className = options.classes.spinner;
									var parent = img.parentElement;
									var spinner = child(parent, "." + className) || create("span", className, parent);
									entries.push([img, Slide, spinner]);
									img.src || display(img, "none");
								}
							});
						});
					}
					function check() {
						entries = entries.filter(function (data) {
							var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
							return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
						});
						entries.length || off(events);
					}
					function load(data) {
						var img = data[0];
						addClass(data[1].slide, CLASS_LOADING);
						bind(img, "load error", apply(onLoad, data));
						setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
						setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
						removeAttribute(img, SRC_DATA_ATTRIBUTE);
						removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
					}
					function onLoad(data, e) {
						var img = data[0],
							Slide = data[1];
						removeClass(Slide.slide, CLASS_LOADING);
						if (e.type !== "error") {
							remove(data[2]);
							display(img, "");
							emit(EVENT_LAZYLOAD_LOADED, img, Slide);
							emit(EVENT_RESIZE);
						}
						isSequential && loadNext();
					}
					function loadNext() {
						entries.length && load(entries.shift());
					}
					return { mount, destroy: apply(empty, entries), check };
				}
				function Pagination(Splide2, Components2, options) {
					var event = EventInterface(Splide2);
					var on = event.on,
						emit = event.emit,
						bind = event.bind;
					var Slides = Components2.Slides,
						Elements = Components2.Elements,
						Controller = Components2.Controller;
					var hasFocus = Controller.hasFocus,
						getIndex = Controller.getIndex,
						go = Controller.go;
					var resolve = Components2.Direction.resolve;
					var placeholder = Elements.pagination;
					var items = [];
					var list;
					var paginationClasses;
					function mount() {
						destroy();
						on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], mount);
						var enabled = options.pagination;
						placeholder && display(placeholder, enabled ? "" : "none");
						if (enabled) {
							on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
							createPagination();
							update();
							emit(EVENT_PAGINATION_MOUNTED, { list, items }, getAt(Splide2.index));
						}
					}
					function destroy() {
						if (list) {
							remove(placeholder ? slice(list.children) : list);
							removeClass(list, paginationClasses);
							empty(items);
							list = null;
						}
						event.destroy();
					}
					function createPagination() {
						var length = Splide2.length;
						var classes = options.classes,
							i18n = options.i18n,
							perPage = options.perPage;
						var max = hasFocus() ? Controller.getEnd() + 1 : ceil(length / perPage);
						list = placeholder || create("ul", classes.pagination, Elements.track.parentElement);
						addClass(list, (paginationClasses = CLASS_PAGINATION + "--" + getDirection()));
						setAttribute(list, ROLE, "tablist");
						setAttribute(list, ARIA_LABEL, i18n.select);
						setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");
						for (var i = 0; i < max; i++) {
							var li = create("li", null, list);
							var button = create("button", { class: classes.page, type: "button" }, li);
							var controls = Slides.getIn(i).map(function (Slide) {
								return Slide.slide.id;
							});
							var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
							bind(button, "click", apply(onClick, i));
							if (options.paginationKeyboard) bind(button, "keydown", apply(onKeydown, i));
							setAttribute(li, ROLE, "presentation");
							setAttribute(button, ROLE, "tab");
							setAttribute(button, ARIA_CONTROLS, controls.join(" "));
							setAttribute(button, ARIA_LABEL, format(text, i + 1));
							setAttribute(button, TAB_INDEX, -1);
							items.push({ li, button, page: i });
						}
					}
					function onClick(page) {
						go(">" + page, true);
					}
					function onKeydown(page, e) {
						var length = items.length;
						var key = normalizeKey(e);
						var dir = getDirection();
						var nextPage = -1;
						if (key === resolve(ARROW_RIGHT, false, dir)) nextPage = ++page % length;
						else if (key === resolve(ARROW_LEFT, false, dir)) nextPage = (--page + length) % length;
						else if (key === "Home") nextPage = 0;
						else {
							if (key === "End") nextPage = length - 1;
						}
						var item = items[nextPage];
						if (item) {
							focus(item.button);
							go(">" + nextPage);
							prevent(e, true);
						}
					}
					function getDirection() {
						return options.paginationDirection || options.direction;
					}
					function getAt(index) {
						return items[Controller.toPage(index)];
					}
					function update() {
						var prev = getAt(getIndex(true));
						var curr = getAt(getIndex());
						if (prev) {
							var button = prev.button;
							removeClass(button, CLASS_ACTIVE);
							removeAttribute(button, ARIA_SELECTED);
							setAttribute(button, TAB_INDEX, -1);
						}
						if (curr) {
							var _button = curr.button;
							addClass(_button, CLASS_ACTIVE);
							setAttribute(_button, ARIA_SELECTED, true);
							setAttribute(_button, TAB_INDEX, "");
						}
						emit(EVENT_PAGINATION_UPDATED, { list, items }, prev, curr);
					}
					return { items, mount, destroy, getAt, update };
				}
				var TRIGGER_KEYS = [" ", "Enter"];
				function Sync(Splide2, Components2, options) {
					var isNavigation = options.isNavigation,
						slideFocus = options.slideFocus;
					var events = [];
					function mount() {
						Splide2.splides.forEach(function (target) {
							if (!target.isParent) {
								sync(Splide2, target.splide);
								sync(target.splide, Splide2);
							}
						});
						if (isNavigation) navigate();
					}
					function destroy() {
						events.forEach(function (event) {
							event.destroy();
						});
						empty(events);
					}
					function remount() {
						destroy();
						mount();
					}
					function sync(splide, target) {
						var event = EventInterface(splide);
						event.on(EVENT_MOVE, function (index, prev, dest) {
							target.go(target.is(LOOP) ? dest : index);
						});
						events.push(event);
					}
					function navigate() {
						var event = EventInterface(Splide2);
						var on = event.on;
						on(EVENT_CLICK, onClick);
						on(EVENT_SLIDE_KEYDOWN, onKeydown);
						on([EVENT_MOUNTED, EVENT_UPDATED], update);
						events.push(event);
						event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
					}
					function update() {
						setAttribute(
							Components2.Elements.list,
							ARIA_ORIENTATION,
							options.direction === TTB ? "vertical" : ""
						);
					}
					function onClick(Slide) {
						Splide2.go(Slide.index);
					}
					function onKeydown(Slide, e) {
						if (includes(TRIGGER_KEYS, normalizeKey(e))) {
							onClick(Slide);
							prevent(e);
						}
					}
					return {
						setup: apply(
							Components2.Media.set,
							{ slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus },
							true
						),
						mount,
						destroy,
						remount,
					};
				}
				function Wheel(Splide2, Components2, options) {
					var _EventInterface12 = EventInterface(Splide2),
						bind = _EventInterface12.bind;
					var lastTime = 0;
					function mount() {
						if (options.wheel)
							bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
					}
					function onWheel(e) {
						if (e.cancelable) {
							var deltaY = e.deltaY;
							var backwards = deltaY < 0;
							var timeStamp = timeOf(e);
							var _min = options.wheelMinThreshold || 0;
							var sleep = options.wheelSleep || 0;
							if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
								Splide2.go(backwards ? "<" : ">");
								lastTime = timeStamp;
							}
							shouldPrevent(backwards) && prevent(e);
						}
					}
					function shouldPrevent(backwards) {
						return (
							!options.releaseWheel ||
							Splide2.state.is(MOVING) ||
							Components2.Controller.getAdjacent(backwards) !== -1
						);
					}
					return { mount };
				}
				var SR_REMOVAL_DELAY = 90;
				function Live(Splide2, Components2, options) {
					var _EventInterface13 = EventInterface(Splide2),
						on = _EventInterface13.on;
					var track = Components2.Elements.track;
					var enabled = options.live && !options.isNavigation;
					var sr = create("span", CLASS_SR);
					var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));
					function mount() {
						if (enabled) {
							disable(!Components2.Autoplay.isPaused());
							setAttribute(track, ARIA_ATOMIC, true);
							sr.textContent = "\u2026";
							on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
							on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
							on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle, true));
						}
					}
					function toggle(active) {
						setAttribute(track, ARIA_BUSY, active);
						if (active) {
							append(track, sr);
							interval.start();
						} else {
							remove(sr);
							interval.cancel();
						}
					}
					function destroy() {
						removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
						remove(sr);
					}
					function disable(disabled) {
						if (enabled) setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
					}
					return { mount, disable, destroy };
				}
				var ComponentConstructors = Object.freeze({
					__proto__: null,
					Media,
					Direction,
					Elements,
					Slides,
					Layout,
					Clones,
					Move,
					Controller,
					Arrows,
					Autoplay,
					Cover,
					Scroll,
					Drag,
					Keyboard,
					LazyLoad,
					Pagination,
					Sync,
					Wheel,
					Live,
				});
				var I18N = {
					prev: "Previous slide",
					next: "Next slide",
					first: "Go to first slide",
					last: "Go to last slide",
					slideX: "Go to slide %s",
					pageX: "Go to page %s",
					play: "Start autoplay",
					pause: "Pause autoplay",
					carousel: "carousel",
					slide: "slide",
					select: "Select a slide to show",
					slideLabel: "%s of %s",
				};
				var DEFAULTS = {
					type: "slide",
					role: "region",
					speed: 400,
					perPage: 1,
					cloneStatus: true,
					arrows: true,
					pagination: true,
					paginationKeyboard: true,
					interval: 5e3,
					pauseOnHover: true,
					pauseOnFocus: true,
					resetProgress: true,
					easing: "cubic-bezier(0.25, 1, 0.5, 1)",
					drag: true,
					direction: "ltr",
					trimSpace: true,
					focusableNodes: "a, button, textarea, input, select, iframe",
					live: true,
					classes: CLASSES,
					i18n: I18N,
					reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
				};
				function Fade(Splide2, Components2, options) {
					var Slides = Components2.Slides;
					function mount() {
						EventInterface(Splide2).on([EVENT_MOUNTED, EVENT_REFRESH], init);
					}
					function init() {
						Slides.forEach(function (Slide) {
							Slide.style("transform", "translateX(-" + 100 * Slide.index + "%)");
						});
					}
					function start(index, done) {
						Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
						nextTick(done);
					}
					return { mount, start, cancel: noop };
				}
				function Slide(Splide2, Components2, options) {
					var Move = Components2.Move,
						Controller = Components2.Controller,
						Scroll = Components2.Scroll;
					var list = Components2.Elements.list;
					var transition = apply(style, list, "transition");
					var endCallback;
					function mount() {
						EventInterface(Splide2).bind(list, "transitionend", function (e) {
							if (e.target === list && endCallback) {
								cancel();
								endCallback();
							}
						});
					}
					function start(index, done) {
						var destination = Move.toPosition(index, true);
						var position = Move.getPosition();
						var speed = getSpeed(index);
						if (abs(destination - position) >= 1 && speed >= 1)
							if (options.useScroll) Scroll.scroll(destination, speed, false, done);
							else {
								transition("transform " + speed + "ms " + options.easing);
								Move.translate(destination, true);
								endCallback = done;
							}
						else {
							Move.jump(index);
							done();
						}
					}
					function cancel() {
						transition("");
						Scroll.cancel();
					}
					function getSpeed(index) {
						var rewindSpeed = options.rewindSpeed;
						if (Splide2.is(SLIDE) && rewindSpeed) {
							var prev = Controller.getIndex(true);
							var end = Controller.getEnd();
							if ((prev === 0 && index >= end) || (prev >= end && index === 0)) return rewindSpeed;
						}
						return options.speed;
					}
					return { mount, start, cancel };
				}
				var _Splide = (function () {
					function _Splide(target, options) {
						this.event = EventInterface();
						this.Components = {};
						this.state = State(CREATED);
						this.splides = [];
						this._o = {};
						this._E = {};
						var root = isString(target) ? query(document, target) : target;
						assert(root, root + " is invalid.");
						this.root = root;
						options = merge(
							{
								label: getAttribute(root, ARIA_LABEL) || "",
								labelledby: getAttribute(root, ARIA_LABELLEDBY) || "",
							},
							DEFAULTS,
							_Splide.defaults,
							options || {}
						);
						try {
							merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
						} catch (e) {
							assert(false, "Invalid JSON");
						}
						this._o = Object.create(merge({}, options));
					}
					var _proto = _Splide.prototype;
					_proto.mount = function mount(Extensions, Transition) {
						var _this = this;
						var state = this.state,
							Components2 = this.Components;
						assert(state.is([CREATED, DESTROYED]), "Already mounted!");
						state.set(CREATED);
						this._C = Components2;
						this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
						this._E = Extensions || this._E;
						var Constructors = assign({}, ComponentConstructors, this._E, { Transition: this._T });
						forOwn(Constructors, function (Component, key) {
							var component = Component(_this, Components2, _this._o);
							Components2[key] = component;
							component.setup && component.setup();
						});
						forOwn(Components2, function (component) {
							component.mount && component.mount();
						});
						this.emit(EVENT_MOUNTED);
						addClass(this.root, CLASS_INITIALIZED);
						state.set(IDLE);
						this.emit(EVENT_READY);
						return this;
					};
					_proto.sync = function sync(splide) {
						this.splides.push({ splide });
						splide.splides.push({ splide: this, isParent: true });
						if (this.state.is(IDLE)) {
							this._C.Sync.remount();
							splide.Components.Sync.remount();
						}
						return this;
					};
					_proto.go = function go(control) {
						this._C.Controller.go(control);
						return this;
					};
					_proto.on = function on(events, callback) {
						this.event.on(events, callback);
						return this;
					};
					_proto.off = function off(events) {
						this.event.off(events);
						return this;
					};
					_proto.emit = function emit(event) {
						var _this$event;
						(_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));
						return this;
					};
					_proto.add = function add(slides, index) {
						this._C.Slides.add(slides, index);
						return this;
					};
					_proto.remove = function remove(matcher) {
						this._C.Slides.remove(matcher);
						return this;
					};
					_proto.is = function is(type) {
						return this._o.type === type;
					};
					_proto.refresh = function refresh() {
						this.emit(EVENT_REFRESH);
						return this;
					};
					_proto.destroy = function destroy(completely) {
						if (completely === void 0) completely = true;
						var event = this.event,
							state = this.state;
						if (state.is(CREATED))
							EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
						else {
							forOwn(
								this._C,
								function (component) {
									component.destroy && component.destroy(completely);
								},
								true
							);
							event.emit(EVENT_DESTROY);
							event.destroy();
							completely && empty(this.splides);
							state.set(DESTROYED);
						}
						return this;
					};
					_createClass(_Splide, [
						{
							key: "options",
							get: function get() {
								return this._o;
							},
							set: function set(options) {
								this._C.Media.set(options, true, true);
							},
						},
						{
							key: "length",
							get: function get() {
								return this._C.Slides.getLength(true);
							},
						},
						{
							key: "index",
							get: function get() {
								return this._C.Controller.getIndex();
							},
						},
					]);
					return _Splide;
				})();
				var Splide = _Splide;
				Splide.defaults = {};
				Splide.STATES = STATES;
				var CLASS_RENDERED = "is-rendered";
				var RENDERER_DEFAULT_CONFIG = { listTag: "ul", slideTag: "li" };
				var Style = (function () {
					function Style(id, options) {
						this.styles = {};
						this.id = id;
						this.options = options;
					}
					var _proto2 = Style.prototype;
					_proto2.rule = function rule(selector, prop, value, breakpoint) {
						breakpoint = breakpoint || "default";
						var selectors = (this.styles[breakpoint] = this.styles[breakpoint] || {});
						var styles = (selectors[selector] = selectors[selector] || {});
						styles[prop] = value;
					};
					_proto2.build = function build() {
						var _this2 = this;
						var css = "";
						if (this.styles.default) css += this.buildSelectors(this.styles.default);
						Object.keys(this.styles)
							.sort(function (n, m) {
								return _this2.options.mediaQuery === "min" ? +n - +m : +m - +n;
							})
							.forEach(function (breakpoint) {
								if (breakpoint !== "default") {
									css += "@media screen and (max-width: " + breakpoint + "px) {";
									css += _this2.buildSelectors(_this2.styles[breakpoint]);
									css += "}";
								}
							});
						return css;
					};
					_proto2.buildSelectors = function buildSelectors(selectors) {
						var _this3 = this;
						var css = "";
						forOwn(selectors, function (styles, selector) {
							selector = ("#" + _this3.id + " " + selector).trim();
							css += selector + " {";
							forOwn(styles, function (value, prop) {
								if (value || value === 0) css += prop + ": " + value + ";";
							});
							css += "}";
						});
						return css;
					};
					return Style;
				})();
				var SplideRenderer = (function () {
					function SplideRenderer(contents, options, config, defaults) {
						this.slides = [];
						this.options = {};
						this.breakpoints = [];
						merge(DEFAULTS, defaults || {});
						merge(merge(this.options, DEFAULTS), options || {});
						this.contents = contents;
						this.config = assign({}, RENDERER_DEFAULT_CONFIG, config || {});
						this.id = this.config.id || uniqueId("splide");
						this.Style = new Style(this.id, this.options);
						this.Direction = Direction(null, null, this.options);
						assert(this.contents.length, "Provide at least 1 content.");
						this.init();
					}
					SplideRenderer.clean = function clean(splide) {
						var _EventInterface14 = EventInterface(splide),
							on = _EventInterface14.on;
						var root = splide.root;
						var clones = queryAll(root, "." + CLASS_CLONE);
						on(EVENT_MOUNTED, function () {
							remove(child(root, "style"));
						});
						remove(clones);
					};
					var _proto3 = SplideRenderer.prototype;
					_proto3.init = function init() {
						this.parseBreakpoints();
						this.initSlides();
						this.registerRootStyles();
						this.registerTrackStyles();
						this.registerSlideStyles();
						this.registerListStyles();
					};
					_proto3.initSlides = function initSlides() {
						var _this4 = this;
						push(
							this.slides,
							this.contents.map(function (content, index) {
								content = isString(content) ? { html: content } : content;
								content.styles = content.styles || {};
								content.attrs = content.attrs || {};
								_this4.cover(content);
								var classes =
									_this4.options.classes.slide + " " + (index === 0 ? CLASS_ACTIVE : "");
								assign(content.attrs, {
									class: (classes + " " + (content.attrs.class || "")).trim(),
									style: _this4.buildStyles(content.styles),
								});
								return content;
							})
						);
						if (this.isLoop()) this.generateClones(this.slides);
					};
					_proto3.registerRootStyles = function registerRootStyles() {
						var _this5 = this;
						this.breakpoints.forEach(function (_ref2) {
							var width = _ref2[0],
								options = _ref2[1];
							_this5.Style.rule(" ", "max-width", unit(options.width), width);
						});
					};
					_proto3.registerTrackStyles = function registerTrackStyles() {
						var _this6 = this;
						var Style2 = this.Style;
						var selector = "." + CLASS_TRACK;
						this.breakpoints.forEach(function (_ref3) {
							var width = _ref3[0],
								options = _ref3[1];
							Style2.rule(
								selector,
								_this6.resolve("paddingLeft"),
								_this6.cssPadding(options, false),
								width
							);
							Style2.rule(
								selector,
								_this6.resolve("paddingRight"),
								_this6.cssPadding(options, true),
								width
							);
							Style2.rule(selector, "height", _this6.cssTrackHeight(options), width);
						});
					};
					_proto3.registerListStyles = function registerListStyles() {
						var _this7 = this;
						var Style2 = this.Style;
						var selector = "." + CLASS_LIST;
						this.breakpoints.forEach(function (_ref4) {
							var width = _ref4[0],
								options = _ref4[1];
							Style2.rule(selector, "transform", _this7.buildTranslate(options), width);
							if (!_this7.cssSlideHeight(options))
								Style2.rule(selector, "aspect-ratio", _this7.cssAspectRatio(options), width);
						});
					};
					_proto3.registerSlideStyles = function registerSlideStyles() {
						var _this8 = this;
						var Style2 = this.Style;
						var selector = "." + CLASS_SLIDE;
						this.breakpoints.forEach(function (_ref5) {
							var width = _ref5[0],
								options = _ref5[1];
							Style2.rule(selector, "width", _this8.cssSlideWidth(options), width);
							Style2.rule(selector, "height", _this8.cssSlideHeight(options) || "100%", width);
							Style2.rule(
								selector,
								_this8.resolve("marginRight"),
								unit(options.gap) || "0px",
								width
							);
							Style2.rule(selector + " > img", "display", options.cover ? "none" : "inline", width);
						});
					};
					_proto3.buildTranslate = function buildTranslate(options) {
						var _this$Direction = this.Direction,
							resolve = _this$Direction.resolve,
							orient = _this$Direction.orient;
						var values = [];
						values.push(this.cssOffsetClones(options));
						values.push(this.cssOffsetGaps(options));
						if (this.isCenter(options)) {
							values.push(this.buildCssValue(orient(-50), "%"));
							values.push.apply(values, this.cssOffsetCenter(options));
						}
						return values
							.filter(Boolean)
							.map(function (value) {
								return "translate" + resolve("X") + "(" + value + ")";
							})
							.join(" ");
					};
					_proto3.cssOffsetClones = function cssOffsetClones(options) {
						var _this$Direction2 = this.Direction,
							resolve = _this$Direction2.resolve,
							orient = _this$Direction2.orient;
						var cloneCount = this.getCloneCount();
						if (this.isFixedWidth(options)) {
							var _this$parseCssValue = this.parseCssValue(options[resolve("fixedWidth")]),
								value = _this$parseCssValue.value,
								unit2 = _this$parseCssValue.unit;
							return this.buildCssValue(orient(value) * cloneCount, unit2);
						}
						var percent = (100 * cloneCount) / options.perPage;
						return orient(percent) + "%";
					};
					_proto3.cssOffsetCenter = function cssOffsetCenter(options) {
						var _this$Direction3 = this.Direction,
							resolve = _this$Direction3.resolve,
							orient = _this$Direction3.orient;
						if (this.isFixedWidth(options)) {
							var _this$parseCssValue2 = this.parseCssValue(options[resolve("fixedWidth")]),
								value = _this$parseCssValue2.value,
								unit2 = _this$parseCssValue2.unit;
							return [this.buildCssValue(orient(value / 2), unit2)];
						}
						var values = [];
						var perPage = options.perPage,
							gap = options.gap;
						values.push(orient(50 / perPage) + "%");
						if (gap) {
							var _this$parseCssValue3 = this.parseCssValue(gap),
								_value = _this$parseCssValue3.value,
								_unit = _this$parseCssValue3.unit;
							var gapOffset = (_value / perPage - _value) / 2;
							values.push(this.buildCssValue(orient(gapOffset), _unit));
						}
						return values;
					};
					_proto3.cssOffsetGaps = function cssOffsetGaps(options) {
						var cloneCount = this.getCloneCount();
						if (cloneCount && options.gap) {
							var orient = this.Direction.orient;
							var _this$parseCssValue4 = this.parseCssValue(options.gap),
								value = _this$parseCssValue4.value,
								unit2 = _this$parseCssValue4.unit;
							if (this.isFixedWidth(options))
								return this.buildCssValue(orient(value * cloneCount), unit2);
							var perPage = options.perPage;
							var gaps = cloneCount / perPage;
							return this.buildCssValue(orient(gaps * value), unit2);
						}
						return "";
					};
					_proto3.resolve = function resolve(prop) {
						return camelToKebab(this.Direction.resolve(prop));
					};
					_proto3.cssPadding = function cssPadding(options, right) {
						var padding = options.padding;
						var prop = this.Direction.resolve(right ? "right" : "left", true);
						return (padding && unit(padding[prop] || (isObject(padding) ? 0 : padding))) || "0px";
					};
					_proto3.cssTrackHeight = function cssTrackHeight(options) {
						var height = "";
						if (this.isVertical()) {
							height = this.cssHeight(options);
							assert(height, '"height" is missing.');
							height =
								"calc(" +
								height +
								" - " +
								this.cssPadding(options, false) +
								" - " +
								this.cssPadding(options, true) +
								")";
						}
						return height;
					};
					_proto3.cssHeight = function cssHeight(options) {
						return unit(options.height);
					};
					_proto3.cssSlideWidth = function cssSlideWidth(options) {
						return options.autoWidth
							? ""
							: unit(options.fixedWidth) || (this.isVertical() ? "" : this.cssSlideSize(options));
					};
					_proto3.cssSlideHeight = function cssSlideHeight(options) {
						return (
							unit(options.fixedHeight) ||
							(this.isVertical()
								? options.autoHeight
									? ""
									: this.cssSlideSize(options)
								: this.cssHeight(options))
						);
					};
					_proto3.cssSlideSize = function cssSlideSize(options) {
						var gap = unit(options.gap);
						return (
							"calc((100%" +
							(gap && " + " + gap) +
							")/" +
							(options.perPage || 1) +
							(gap && " - " + gap) +
							")"
						);
					};
					_proto3.cssAspectRatio = function cssAspectRatio(options) {
						var heightRatio = options.heightRatio;
						return heightRatio ? "" + 1 / heightRatio : "";
					};
					_proto3.buildCssValue = function buildCssValue(value, unit2) {
						return "" + value + unit2;
					};
					_proto3.parseCssValue = function parseCssValue(value) {
						if (isString(value)) {
							var number = parseFloat(value) || 0;
							var unit2 = value.replace(/\d*(\.\d*)?/, "") || "px";
							return { value: number, unit: unit2 };
						}
						return { value, unit: "px" };
					};
					_proto3.parseBreakpoints = function parseBreakpoints() {
						var _this9 = this;
						var breakpoints = this.options.breakpoints;
						this.breakpoints.push(["default", this.options]);
						if (breakpoints)
							forOwn(breakpoints, function (options, width) {
								_this9.breakpoints.push([width, merge(merge({}, _this9.options), options)]);
							});
					};
					_proto3.isFixedWidth = function isFixedWidth(options) {
						return !!options[this.Direction.resolve("fixedWidth")];
					};
					_proto3.isLoop = function isLoop() {
						return this.options.type === LOOP;
					};
					_proto3.isCenter = function isCenter(options) {
						if (options.focus === "center") {
							if (this.isLoop()) return true;
							if (this.options.type === SLIDE) return !this.options.trimSpace;
						}
						return false;
					};
					_proto3.isVertical = function isVertical() {
						return this.options.direction === TTB;
					};
					_proto3.buildClasses = function buildClasses() {
						var options = this.options;
						return [
							CLASS_ROOT,
							CLASS_ROOT + "--" + options.type,
							CLASS_ROOT + "--" + options.direction,
							options.drag && CLASS_ROOT + "--draggable",
							options.isNavigation && CLASS_ROOT + "--nav",
							CLASS_ACTIVE,
							!this.config.hidden && CLASS_RENDERED,
						]
							.filter(Boolean)
							.join(" ");
					};
					_proto3.buildAttrs = function buildAttrs(attrs) {
						var attr = "";
						forOwn(attrs, function (value, key) {
							attr += value ? " " + camelToKebab(key) + '="' + value + '"' : "";
						});
						return attr.trim();
					};
					_proto3.buildStyles = function buildStyles(styles) {
						var style = "";
						forOwn(styles, function (value, key) {
							style += " " + camelToKebab(key) + ":" + value + ";";
						});
						return style.trim();
					};
					_proto3.renderSlides = function renderSlides() {
						var _this10 = this;
						var tag = this.config.slideTag;
						return this.slides
							.map(function (content) {
								return (
									"<" +
									tag +
									" " +
									_this10.buildAttrs(content.attrs) +
									">" +
									(content.html || "") +
									"</" +
									tag +
									">"
								);
							})
							.join("");
					};
					_proto3.cover = function cover(content) {
						var styles = content.styles,
							_content$html = content.html,
							html = _content$html === void 0 ? "" : _content$html;
						if (this.options.cover && !this.options.lazyLoad) {
							var src = html.match(/<img.*?src\s*=\s*(['"])(.+?)\1.*?>/);
							if (src && src[2]) styles.background = "center/cover no-repeat url('" + src[2] + "')";
						}
					};
					_proto3.generateClones = function generateClones(contents) {
						var classes = this.options.classes;
						var count = this.getCloneCount();
						var slides = contents.slice();
						while (slides.length < count) push(slides, slides);
						push(slides.slice(-count).reverse(), slides.slice(0, count)).forEach(
							function (content, index) {
								var attrs = assign({}, content.attrs, {
									class: content.attrs.class + " " + classes.clone,
								});
								var clone = assign({}, content, { attrs });
								index < count ? contents.unshift(clone) : contents.push(clone);
							}
						);
					};
					_proto3.getCloneCount = function getCloneCount() {
						if (this.isLoop()) {
							var options = this.options;
							if (options.clones) return options.clones;
							var perPage = max.apply(
								void 0,
								this.breakpoints.map(function (_ref6) {
									var options2 = _ref6[1];
									return options2.perPage;
								})
							);
							return perPage * ((options.flickMaxPages || 1) + 1);
						}
						return 0;
					};
					_proto3.renderArrows = function renderArrows() {
						var html = "";
						html += '<div class="' + this.options.classes.arrows + '">';
						html += this.renderArrow(true);
						html += this.renderArrow(false);
						html += "</div>";
						return html;
					};
					_proto3.renderArrow = function renderArrow(prev) {
						var _this$options = this.options,
							classes = _this$options.classes,
							i18n = _this$options.i18n;
						var attrs = {
							class: classes.arrow + " " + (prev ? classes.prev : classes.next),
							type: "button",
							ariaLabel: prev ? i18n.prev : i18n.next,
						};
						return (
							"<button " +
							this.buildAttrs(attrs) +
							'><svg xmlns="' +
							XML_NAME_SPACE +
							'" viewBox="0 0 ' +
							SIZE +
							" " +
							SIZE +
							'" width="' +
							SIZE +
							'" height="' +
							SIZE +
							'"><path d="' +
							(this.options.arrowPath || PATH) +
							'" /></svg></button>'
						);
					};
					_proto3.html = function html() {
						var _this$config = this.config,
							rootClass = _this$config.rootClass,
							listTag = _this$config.listTag,
							arrows = _this$config.arrows,
							beforeTrack = _this$config.beforeTrack,
							afterTrack = _this$config.afterTrack,
							slider = _this$config.slider,
							beforeSlider = _this$config.beforeSlider,
							afterSlider = _this$config.afterSlider;
						var html = "";
						html +=
							'<div id="' +
							this.id +
							'" class="' +
							this.buildClasses() +
							" " +
							(rootClass || "") +
							'">';
						html += "<style>" + this.Style.build() + "</style>";
						if (slider) {
							html += beforeSlider || "";
							html += '<div class="splide__slider">';
						}
						html += beforeTrack || "";
						if (arrows) html += this.renderArrows();
						html += '<div class="splide__track">';
						html += "<" + listTag + ' class="splide__list">';
						html += this.renderSlides();
						html += "</" + listTag + ">";
						html += "</div>";
						html += afterTrack || "";
						if (slider) {
							html += "</div>";
							html += afterSlider || "";
						}
						html += "</div>";
						return html;
					};
					return SplideRenderer;
				})();
				exports.CLASSES = CLASSES;
				exports.CLASS_ACTIVE = CLASS_ACTIVE;
				exports.CLASS_ARROW = CLASS_ARROW;
				exports.CLASS_ARROWS = CLASS_ARROWS;
				exports.CLASS_ARROW_NEXT = CLASS_ARROW_NEXT;
				exports.CLASS_ARROW_PREV = CLASS_ARROW_PREV;
				exports.CLASS_CLONE = CLASS_CLONE;
				exports.CLASS_CONTAINER = CLASS_CONTAINER;
				exports.CLASS_FOCUS_IN = CLASS_FOCUS_IN;
				exports.CLASS_INITIALIZED = CLASS_INITIALIZED;
				exports.CLASS_LIST = CLASS_LIST;
				exports.CLASS_LOADING = CLASS_LOADING;
				exports.CLASS_NEXT = CLASS_NEXT;
				exports.CLASS_OVERFLOW = CLASS_OVERFLOW;
				exports.CLASS_PAGINATION = CLASS_PAGINATION;
				exports.CLASS_PAGINATION_PAGE = CLASS_PAGINATION_PAGE;
				exports.CLASS_PREV = CLASS_PREV;
				exports.CLASS_PROGRESS = CLASS_PROGRESS;
				exports.CLASS_PROGRESS_BAR = CLASS_PROGRESS_BAR;
				exports.CLASS_ROOT = CLASS_ROOT;
				exports.CLASS_SLIDE = CLASS_SLIDE;
				exports.CLASS_SPINNER = CLASS_SPINNER;
				exports.CLASS_SR = CLASS_SR;
				exports.CLASS_TOGGLE = CLASS_TOGGLE;
				exports.CLASS_TOGGLE_PAUSE = CLASS_TOGGLE_PAUSE;
				exports.CLASS_TOGGLE_PLAY = CLASS_TOGGLE_PLAY;
				exports.CLASS_TRACK = CLASS_TRACK;
				exports.CLASS_VISIBLE = CLASS_VISIBLE;
				exports.DEFAULTS = DEFAULTS;
				exports.EVENT_ACTIVE = EVENT_ACTIVE;
				exports.EVENT_ARROWS_MOUNTED = EVENT_ARROWS_MOUNTED;
				exports.EVENT_ARROWS_UPDATED = EVENT_ARROWS_UPDATED;
				exports.EVENT_AUTOPLAY_PAUSE = EVENT_AUTOPLAY_PAUSE;
				exports.EVENT_AUTOPLAY_PLAY = EVENT_AUTOPLAY_PLAY;
				exports.EVENT_AUTOPLAY_PLAYING = EVENT_AUTOPLAY_PLAYING;
				exports.EVENT_CLICK = EVENT_CLICK;
				exports.EVENT_DESTROY = EVENT_DESTROY;
				exports.EVENT_DRAG = EVENT_DRAG;
				exports.EVENT_DRAGGED = EVENT_DRAGGED;
				exports.EVENT_DRAGGING = EVENT_DRAGGING;
				exports.EVENT_END_INDEX_CHANGED = EVENT_END_INDEX_CHANGED;
				exports.EVENT_HIDDEN = EVENT_HIDDEN;
				exports.EVENT_INACTIVE = EVENT_INACTIVE;
				exports.EVENT_LAZYLOAD_LOADED = EVENT_LAZYLOAD_LOADED;
				exports.EVENT_MOUNTED = EVENT_MOUNTED;
				exports.EVENT_MOVE = EVENT_MOVE;
				exports.EVENT_MOVED = EVENT_MOVED;
				exports.EVENT_NAVIGATION_MOUNTED = EVENT_NAVIGATION_MOUNTED;
				exports.EVENT_OVERFLOW = EVENT_OVERFLOW;
				exports.EVENT_PAGINATION_MOUNTED = EVENT_PAGINATION_MOUNTED;
				exports.EVENT_PAGINATION_UPDATED = EVENT_PAGINATION_UPDATED;
				exports.EVENT_READY = EVENT_READY;
				exports.EVENT_REFRESH = EVENT_REFRESH;
				exports.EVENT_RESIZE = EVENT_RESIZE;
				exports.EVENT_RESIZED = EVENT_RESIZED;
				exports.EVENT_SCROLL = EVENT_SCROLL;
				exports.EVENT_SCROLLED = EVENT_SCROLLED;
				exports.EVENT_SHIFTED = EVENT_SHIFTED;
				exports.EVENT_SLIDE_KEYDOWN = EVENT_SLIDE_KEYDOWN;
				exports.EVENT_UPDATED = EVENT_UPDATED;
				exports.EVENT_VISIBLE = EVENT_VISIBLE;
				exports.EventBinder = EventBinder;
				exports.EventInterface = EventInterface;
				exports.FADE = FADE;
				exports.LOOP = LOOP;
				exports.LTR = LTR;
				exports.RTL = RTL;
				exports.RequestInterval = RequestInterval;
				exports.SLIDE = SLIDE;
				exports.STATUS_CLASSES = STATUS_CLASSES;
				exports.Splide = Splide;
				exports.SplideRenderer = SplideRenderer;
				exports.State = State;
				exports.TTB = TTB;
				exports.Throttle = Throttle;
				exports["default"] = Splide;
			},
			{},
		],
		2: [
			function (require, module, exports) {
				"use strict";
				var _splide = _interopRequireDefault(require("@splidejs/splide"));
				function _interopRequireDefault(e) {
					return e && e.__esModule ? e : { default: e };
				}
				(function (Drupal, once) {
					Drupal.behaviors.initArticleVisuals = {
						attach: (context) => {
							once("initArticleVisualsBehavior", ".js-article__visuals", context).forEach(
								function (el) {
									const articleVisuals = el;
									const articleVisualsCta = articleVisuals.querySelector(
										".js-article__visuals-play-cta"
									);
									const articleVisualsVideo = articleVisuals.querySelector(
										".js-article__visuals-youtube-video-player"
									);
									const articleVisualsCarousel = articleVisuals.querySelector(
										".js-article__visuals-carousel"
									);
									const articleVisualsThumbnailsCarousel = articleVisuals.querySelector(
										".js-article__visuals-thumbnails-carousel"
									);
									if (articleVisualsCta && articleVisualsVideo)
										articleVisualsCta.addEventListener("click", function () {
											if (
												articleVisualsVideo.classList.contains(
													"js-article__visuals-youtube-video-player--hidden"
												)
											)
												articleVisualsVideo.classList.remove(
													"js-article__visuals-youtube-video-player--hidden"
												);
										});
									if (articleVisualsCarousel && articleVisualsThumbnailsCarousel) {
										const mainCarousel = new _splide.default(articleVisualsCarousel, {
											arrows: false,
											pagination: false,
										});
										const thumbnailsCarousel = new _splide.default(
											articleVisualsThumbnailsCarousel,
											{
												fixedWidth: 120,
												fixedHeight: 68,
												gap: 19,
												arrows: false,
												rewind: true,
												pagination: false,
												isNavigation: true,
												breakpoints: { 1279: { fixedWidth: 110, fixedHeight: 62, gap: 10 } },
											}
										);
										mainCarousel.sync(thumbnailsCarousel);
										mainCarousel.mount();
										thumbnailsCarousel.mount();
									}
								}
							);
						},
					};
				})(Drupal, once);
			},
			{ "@splidejs/splide": 1 },
		],
		3: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					Drupal.behaviors.initCardsCarousel = {
						attach: (context) => {
							$(once("initCardsCarouselBehavior", ".js-cards-carousel", context)).each(function () {
								const $cardsCarousel = $(this);
								if ($cardsCarousel.length > 0) {
									const $cardsCarouselSlider = $cardsCarousel.find(".js-cards-carousel__list");
									const carouselType = $cardsCarouselSlider.data("carousel-type");
									let textPrevArrow;
									let textNextArrow;
									switch (carouselType) {
										case "game":
											textPrevArrow = Drupal.t("Previous game");
											textNextArrow = Drupal.t("Next game");
											break;
										case "product":
											textPrevArrow = Drupal.t("Previous product");
											textNextArrow = Drupal.t("Next product");
											break;
										case "reward":
											textPrevArrow = Drupal.t("Previous reward");
											textNextArrow = Drupal.t("Next reward");
											break;
										case "news":
											textPrevArrow = Drupal.t("Previous news");
											textNextArrow = Drupal.t("Next news");
											break;
										default:
											textPrevArrow = Drupal.t("Previous item");
											textNextArrow = Drupal.t("Next item");
									}
									const prevArrow =
										'<button type="button" class="slick-prev"><span class="sr-only">' +
										textPrevArrow +
										"</span></button>";
									const nextArrow =
										'<button type="button" class="slick-next"><span class="sr-only">' +
										textNextArrow +
										"</span></button>";
									function createCarousel(
										$carousel,
										isInfinite = true,
										slidesToShowBigDesktop = 3,
										slidesToShowMediumDesktop = 2,
										slidesToShowSmallDesktop = 2,
										slidesToShowTablet = 2,
										slidesToShowMobile = 1,
										slidesToShowSmallMobile = 1
									) {
										if ($carousel.length > 0)
											$carousel.not(".slick-initialized").slick({
												infinite: isInfinite,
												prevArrow,
												nextArrow,
												slidesToShow: slidesToShowBigDesktop,
												rtl: _globalVars.isRtl,
												responsive: [
													{
														breakpoint: 1600,
														settings: { slidesToShow: slidesToShowMediumDesktop },
													},
													{
														breakpoint: 1440,
														settings: { slidesToShow: slidesToShowSmallDesktop },
													},
													{
														breakpoint: 992,
														settings: { slidesToShow: slidesToShowTablet, arrows: false },
													},
													{
														breakpoint: 768,
														settings: { slidesToShow: slidesToShowMobile, arrows: false },
													},
													{
														breakpoint: 640,
														settings: { slidesToShow: slidesToShowSmallMobile, arrows: false },
													},
												],
											});
									}
									if ($cardsCarousel.hasClass("js-cards-carousel--no-carousel-mobile"))
										enquire.register("screen and (min-width: 768px)", {
											match: function () {
												createCarousel($cardsCarouselSlider, false, 2);
											},
										});
									else if (carouselType === "product" || carouselType === "reward")
										createCarousel($cardsCarouselSlider, true, 5, 4, 3, 2, 2, 1);
									else createCarousel($cardsCarouselSlider);
								}
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		4: [
			function (require, module, exports) {
				"use strict";
				Object.defineProperty(exports, "__esModule", { value: true });
				exports.lozadObserver = exports.isRtl = exports.htmlElement = void 0;
				const htmlElement = (exports.htmlElement = document.documentElement);
				const isRtl = (exports.isRtl = htmlElement.getAttribute("dir") === "rtl");
				const lozadObserver = (exports.lozadObserver = lozad());
			},
			{},
		],
		5: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once) {
					let youtubePlayerContainer;
					let youtubeVideoPlayer;
					let internalVideoPlayer;
					let internalVideo;
					let youtubePlayer;
					let isYoutubePlayerContainerInFullscreen = false;
					let isInternalVideoInFullscreen = false;
					function isYoutubePlayerContainerWentFullscreen() {
						return (
							screenfull.isFullscreen &&
							screenfull.element.classList.contains("js-hero-banner__visuals-youtube-video-iframe")
						);
					}
					function isInternalVideoWentFullscreen() {
						return (
							screenfull.isFullscreen &&
							screenfull.element.classList.contains("js-hero-banner__visuals-video-highlight-video")
						);
					}
					function switchVideoSources(video, switchTo) {
						const videoSources = video.querySelectorAll("source");
						if (videoSources)
							videoSources.forEach(function (currentVideoSource) {
								const oldSource = currentVideoSource.dataset.src;
								let newSource;
								if (switchTo === "mobile") newSource = currentVideoSource.dataset.mobileSrc;
								else {
									if (switchTo === "desktop") newSource = currentVideoSource.dataset.desktopSrc;
								}
								if (newSource !== undefined) {
									currentVideoSource.dataset.src = currentVideoSource.dataset.src.replace(
										oldSource,
										newSource
									);
									if (currentVideoSource.hasAttribute("src"))
										currentVideoSource.removeAttribute("src");
								}
							});
					}
					if (screenfull.isEnabled) {
						screenfull.on("error", (event) => {
							console.error("Failed to enable fullscreen", event);
						});
						screenfull.on("change", () => {
							if (isInternalVideoWentFullscreen()) isInternalVideoInFullscreen = true;
							else if (isInternalVideoInFullscreen) {
								internalVideo.pause();
								internalVideoPlayer.classList.add(
									"js-hero-banner__visuals-video-highlight--hidden"
								);
								isInternalVideoInFullscreen = false;
							} else if (isYoutubePlayerContainerWentFullscreen())
								isYoutubePlayerContainerInFullscreen = true;
							else {
								if (isYoutubePlayerContainerInFullscreen) {
									youtubePlayer.pauseVideo();
									youtubeVideoPlayer.classList.add(
										"js-hero-banner__visuals-youtube-video-player--hidden"
									);
									isYoutubePlayerContainerInFullscreen = false;
								}
							}
						});
					}
					Drupal.behaviors.initHeroBannerVideoFullscreen = {
						attach: (context) => {
							once(
								"initHeroBannerVideoFullscreenBehavior",
								".js-hero-banner__wrapper--video-fullscreen",
								context
							).forEach(function (el) {
								const heroBannerWrapper = el;
								const heroBannerCtaFullscreen = heroBannerWrapper.querySelector(
									".js-hero-banner__visuals-cta-video-fullscreen"
								);
								internalVideoPlayer = heroBannerWrapper.querySelector(
									".js-hero-banner__visuals-video-highlight"
								);
								youtubeVideoPlayer = heroBannerWrapper.querySelector(
									".js-hero-banner__visuals-youtube-video-player"
								);
								if (internalVideoPlayer) {
									internalVideo = internalVideoPlayer.querySelector("video");
									let internalPlayerVisible = false;
									if (internalVideo) {
										const videoBreakpointSwitch = parseInt(
											internalVideo.dataset.breakpointSwitch,
											10
										);
										enquire.register(`screen and (max-width: ${videoBreakpointSwitch - 1}px)`, {
											match: function () {
												switchVideoSources(internalVideo, "mobile");
											},
										});
										enquire.register(`screen and (min-width: ${videoBreakpointSwitch}px)`, {
											match: function () {
												switchVideoSources(internalVideo, "desktop");
											},
										});
									}
									function playInternalVideo() {
										if (internalVideo && internalPlayerVisible === true) {
											internalVideo.onended = () => {
												screenfull.exit();
												internalVideoPlayer.classList.add(
													"js-hero-banner__visuals-video-highlight--hidden"
												);
												internalPlayerVisible = false;
											};
											const videoSources = internalVideo.querySelectorAll("source");
											if (videoSources)
												videoSources.forEach(function (currentVideoSource) {
													if (!currentVideoSource.hasAttribute("src")) {
														currentVideoSource.src = currentVideoSource.dataset.src;
														if (videoSources[videoSources.length - 1] === currentVideoSource)
															internalVideo.load();
													}
												});
											if (screenfull.isEnabled) screenfull.request(internalVideo);
											internalVideo.play();
										}
									}
									heroBannerCtaFullscreen.addEventListener("click", function () {
										if (
											internalVideoPlayer.classList.contains(
												"js-hero-banner__visuals-video-highlight--hidden"
											)
										) {
											internalVideoPlayer.classList.remove(
												"js-hero-banner__visuals-video-highlight--hidden"
											);
											internalPlayerVisible = true;
											playInternalVideo();
										}
									});
								} else {
									if (heroBannerCtaFullscreen && youtubeVideoPlayer) {
										youtubePlayerContainer = youtubeVideoPlayer.querySelector(
											".js-hero-banner__visuals-youtube-video-iframe"
										);
										let youtubeIframe;
										let youtubePlayerVisible = false;
										function playVideo(youtubePlayer, youtubePlayerVisible) {
											if (youtubePlayer && youtubePlayerVisible === true)
												if (screenfull.isEnabled) {
													screenfull.request(youtubePlayerContainer);
													youtubePlayer.playVideo();
												}
										}
										heroBannerCtaFullscreen.addEventListener("click", function () {
											if (
												youtubeVideoPlayer.classList.contains(
													"js-hero-banner__visuals-youtube-video-player--hidden"
												)
											) {
												youtubeVideoPlayer.classList.remove(
													"js-hero-banner__visuals-youtube-video-player--hidden"
												);
												youtubePlayerVisible = true;
												playVideo(youtubePlayer, youtubePlayerVisible);
											}
										});
										window.onYouTubeIframeAPIReady = function () {
											youtubeIframe = new YT.Player(youtubePlayerContainer, {
												width: "1920",
												height: "1080",
												videoId: youtubePlayerContainer.dataset.youtubeVideoId,
												host: "https://www.youtube-nocookie.com",
												origin: window.location.origin,
												playerVars: { fs: 0, rel: 0 },
												events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
											});
										};
										function onPlayerReady(event) {
											youtubePlayerContainer = youtubeVideoPlayer.querySelector(
												".js-hero-banner__visuals-youtube-video-iframe"
											);
											youtubePlayer = event.target;
											playVideo(youtubePlayer, youtubePlayerVisible);
										}
										function onPlayerStateChange(event) {
											if (event.data === YT.PlayerState.ENDED) {
												screenfull.exit();
												youtubeVideoPlayer.classList.add(
													"js-hero-banner__visuals-youtube-video-player--hidden"
												);
											}
										}
									}
								}
							});
						},
					};
				})(Drupal, once);
			},
			{},
		],
		6: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once) {
					Drupal.behaviors.initHowToGetPoints = {
						attach: (context) => {
							once("initHowToGetPointsBehavior", "#js-join-the-club", context).forEach(
								function (el) {
									const joinTheClub = el;
									const howToGetPointsButton = document.getElementById(
										"js-how-to-get-points__button"
									);
									const howToGetPointsContent = document.getElementById(
										"js-how-to-get-points__list"
									);
									let isHowToGetPointsContentOpened = false;
									if (howToGetPointsButton && howToGetPointsContent) {
										enquire.register("screen and (max-width: 991px)", {
											match: function () {
												howToGetPointsButton.addEventListener(
													"click",
													toggleHowToGetPointsContent,
													false
												);
											},
											unmatch: function () {
												howToGetPointsButton.removeEventListener(
													"click",
													toggleHowToGetPointsContent,
													false
												);
											},
										});
										enquire.register("screen and (min-width: 992px)", {
											match: function () {
												joinTheClub.classList.remove(
													"js-join-the-club--how-to-get-points__list--opened"
												);
												isHowToGetPointsContentOpened = true;
												howToGetPointsButton.setAttribute("aria-expanded", true);
												howToGetPointsButton.classList.add("js-how-to-get-points__button--opened");
												howToGetPointsContent.classList.add("js-how-to-get-points__list--opened");
											},
											unmatch: function () {
												isHowToGetPointsContentOpened = false;
												howToGetPointsButton.setAttribute("aria-expanded", false);
												howToGetPointsButton.classList.remove(
													"js-how-to-get-points__button--opened"
												);
												howToGetPointsContent.classList.remove(
													"js-how-to-get-points__list--opened"
												);
											},
										});
										function toggleHowToGetPointsContent() {
											isHowToGetPointsContentOpened = !isHowToGetPointsContentOpened;
											howToGetPointsButton.setAttribute(
												"aria-expanded",
												isHowToGetPointsContentOpened
											);
											joinTheClub.classList.toggle(
												"js-join-the-club--how-to-get-points__list--opened"
											);
											howToGetPointsButton.classList.toggle("js-how-to-get-points__button--opened");
											howToGetPointsContent.classList.toggle("js-how-to-get-points__list--opened");
										}
									}
								}
							);
						},
					};
				})(Drupal, once);
			},
			{},
		],
		7: [
			function (require, module, exports) {
				"use strict";
				function switchVideoSources(video, oldSource, newSource) {
					let videoSources = video.querySelectorAll("source");
					if (videoSources) {
						videoSources.forEach(function (currentVideoSource) {
							currentVideoSource.dataset.src = currentVideoSource.dataset.src.replace(
								oldSource,
								newSource
							);
							if (currentVideoSource.hasAttribute("src")) currentVideoSource.removeAttribute("src");
						});
						video.removeAttribute("data-loaded");
					}
				}
				(function (Drupal, once) {
					Drupal.behaviors.initIntroVideo = {
						attach: (context) => {
							once("initIntroVideoBehavior", "#js-intro-video__video", context).forEach(
								function (el) {
									const introVideo = el;
									let introVideoLozadObserver;
									function startLozadObserver() {
										if (!introVideoLozadObserver)
											introVideoLozadObserver = lozad(introVideo, {
												loaded: function (el) {
													el.play();
												},
											});
										introVideoLozadObserver.observe();
									}
									enquire.register("screen and (max-width: 767px)", {
										match: function () {
											switchVideoSources(introVideo, "--desktop.", ".");
											startLozadObserver();
										},
									});
									enquire.register("screen and (min-width: 768px)", {
										match: function () {
											switchVideoSources(introVideo, ".", "--desktop.");
											startLozadObserver();
										},
									});
								}
							);
						},
					};
				})(Drupal, once);
			},
			{},
		],
		8: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					Drupal.behaviors.initJoinTheClubSlider = {
						attach: (context) => {
							$(
								once("initJoinTheClubSliderBehavior", "#js-join-the-club__feed-list", context)
							).each(function () {
								let $joinTheClubSlider = $(this);
								let prevArrow =
									'<button type="button" class="slick-prev"><span class="sr-only">' +
									Drupal.t("Previous reward") +
									"</span></button>";
								let nextArrow =
									'<button type="button" class="slick-next"><span class="sr-only">' +
									Drupal.t("Next reward") +
									"</span></button>";
								if ($joinTheClubSlider.length > 0)
									$joinTheClubSlider.not(".slick-initialized").slick({
										infinite: false,
										prevArrow,
										nextArrow,
										slidesToShow: 4,
										rtl: _globalVars.isRtl,
										responsive: [
											{ breakpoint: 1280, settings: { slidesToShow: 3 } },
											{ breakpoint: 992, settings: { arrows: false, slidesToShow: 2 } },
											{ breakpoint: 640, settings: { arrows: false, slidesToShow: 1 } },
										],
									});
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		9: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					Drupal.behaviors.initNewsCarousel = {
						attach: (context) => {
							$(once("initNewsCarouselBehavior", ".js-news-carousel", context)).each(function () {
								const $newsCarousel = $(this);
								if ($newsCarousel.length > 0) {
									let isInitMobile = false;
									let isInitDesktop = false;
									const $newsCarouselSlider = $newsCarousel.find(".js-news-carousel__list");
									const $newsCarouselDots = $newsCarousel.find(".js-news-carousel__dots");
									const $newsCarouselArrows = $newsCarousel.find(".js-news-carousel__arrows");
									const prevArrow =
										'<button type="button" class="slick-prev"><span class="sr-only">' +
										Drupal.t("Previous news") +
										"</span></button>";
									const nextArrow =
										'<button type="button" class="slick-next"><span class="sr-only">' +
										Drupal.t("Next news") +
										"</span></button>";
									function createNewsCarouselSliderCounter() {
										$newsCarouselSlider.on(
											"beforeChange",
											function (event, slick, currentSlide, nextSlide) {
												$newsCarousel.find(".js-counter__current-item").text(nextSlide + 1);
											}
										);
									}
									function createNewsCarouselSliderMobile() {
										$newsCarouselSlider
											.not(".slick-initialized")
											.slick({
												infinite: false,
												arrows: false,
												dots: true,
												appendDots: $newsCarouselDots,
												slidesToShow: 1,
												rtl: _globalVars.isRtl,
											});
										createNewsCarouselSliderCounter();
									}
									function createNewsCarouselSliderDesktop() {
										const $newsCarouselDescriptionsContainer = $newsCarousel.find(
											".js-news-carousel__desktop-descriptions-container"
										);
										$newsCarouselDescriptionsContainer.append(
											'<div class="js-news-carousel__desktop-descriptions"></div>'
										);
										const $newsCarouselSliderDescriptions = $newsCarouselDescriptionsContainer.find(
											".js-news-carousel__desktop-descriptions"
										);
										const $newsCarouselSliderAllDescriptions = $newsCarouselSlider.find(
											".js-news-carousel__item-description"
										);
										$newsCarouselSliderAllDescriptions
											.clone()
											.appendTo($newsCarouselSliderDescriptions);
										const $newsCarouselSliderNewDescriptions = $newsCarouselSliderDescriptions.find(
											".js-news-carousel__item-description"
										);
										$newsCarouselSliderNewDescriptions.each(function (index) {
											$(this).attr("data-index", index);
											if (index === 0)
												$(this).addClass("js-news-carousel__item-description--visible");
										});
										$newsCarouselSlider
											.not(".slick-initialized")
											.slick({
												infinite: false,
												arrows: true,
												appendArrows: $newsCarouselArrows,
												prevArrow,
												nextArrow,
												dots: true,
												appendDots: $newsCarouselDots,
												slidesToShow: 1,
												rtl: _globalVars.isRtl,
											});
										let $currentDescription;
										let $nextDescription;
										$newsCarouselSlider.on(
											"beforeChange",
											function (event, slick, currentSlide, nextSlide) {
												$currentDescription = $newsCarouselSliderNewDescriptions.filter(
													'[data-index="' + currentSlide + '"]'
												);
												$currentDescription.removeClass(
													"js-news-carousel__item-description--visible"
												);
												$nextDescription = $newsCarouselSliderNewDescriptions.filter(
													'[data-index="' + nextSlide + '"]'
												);
												$nextDescription.addClass("js-news-carousel__item-description--visible");
											}
										);
										createNewsCarouselSliderCounter();
									}
									function destroyNewsCarouselSliderDesktop() {
										$newsCarousel.find(".js-news-carousel__desktop-descriptions").remove();
										$newsCarouselSlider.slick("unslick");
									}
									enquire.register("screen and (max-width: 991px)", {
										match: function () {
											if (isInitDesktop === true) {
												destroyNewsCarouselSliderDesktop();
												isInitDesktop = false;
											}
											createNewsCarouselSliderMobile();
											isInitMobile = true;
										},
									});
									enquire.register("screen and (min-width: 992px)", {
										match: function () {
											if (isInitMobile === true) {
												$newsCarouselSlider.slick("unslick");
												isInitMobile = false;
											}
											createNewsCarouselSliderDesktop();
											isInitDesktop = true;
										},
									});
								}
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		10: [
			function (require, module, exports) {
				"use strict";
				(function (Drupal, once) {
					Drupal.behaviors.initStickyNewsletter = {
						attach: (context) => {
							once(
								"initStickyNewsletterBehavior",
								".js-newsletter--sticky-trigger",
								context
							).forEach(function (el) {
								const triggerBlock = el;
								const newsletter = document.getElementById("js-newsletter");
								newsletter.classList.add("js-newsletter--sticky");
								const destroyBlock = document.getElementById("js-newsletter--sticky-destroy");
								let newsletterTransitionDuration = getComputedStyle(newsletter).getPropertyValue(
									"--newsletter--sticky-transition-duration"
								);
								newsletterTransitionDuration = parseFloat(newsletterTransitionDuration) * 1000;
								const newsletterButtonClose = document.getElementById(
									"js-newsletter--sticky__button-close"
								);
								let newsletterHasBeenClosed = false;
								newsletter.classList.add("js-newsletter--sticky--hidden");
								const triggerBlockCallback = (entries, triggerBlockObserver) => {
									entries.forEach((entry) => {
										if (entry.isIntersecting) {
											newsletter.classList.add("js-newsletter--sticky--visible");
											triggerBlockObserver.disconnect();
										}
									});
								};
								const destroyBlockCallback = (entries, destroyBlockObserver) => {
									entries.forEach((entry) => {
										if (entry.isIntersecting)
											if (!newsletterHasBeenClosed) {
												newsletterHasBeenClosed = true;
												newsletter.classList.add("js-newsletter--sticky--destroyed");
												destroyBlockObserver.disconnect();
												setTimeout(() => {
													newsletter.classList.remove("js-newsletter--sticky--destroyed");
													newsletter.classList.remove("js-newsletter--sticky--visible");
													newsletter.classList.remove("js-newsletter--sticky--hidden");
													newsletter.classList.remove("js-newsletter--sticky");
												}, newsletterTransitionDuration);
											}
									});
								};
								const triggerBlockObserver = new IntersectionObserver(triggerBlockCallback);
								triggerBlockObserver.observe(triggerBlock);
								const destroyBlockObserver = new IntersectionObserver(destroyBlockCallback);
								destroyBlockObserver.observe(destroyBlock);
								newsletterButtonClose.addEventListener("click", () => {
									newsletterHasBeenClosed = true;
									newsletter.classList.add("js-newsletter--sticky--closed");
									destroyBlockObserver.disconnect();
									setTimeout(() => {
										newsletter.classList.remove("js-newsletter--sticky--closed");
										newsletter.classList.remove("js-newsletter--sticky--visible");
										newsletter.classList.remove("js-newsletter--sticky--hidden");
										newsletter.classList.remove("js-newsletter--sticky");
									}, newsletterTransitionDuration);
								});
							});
						},
					};
				})(Drupal, once);
			},
			{},
		],
		11: [
			function (require, module, exports) {
				"use strict";
				(function ($, Drupal, once) {
					Drupal.behaviors.popinCharacter = {
						attach: (context) => {
							$(once("popinCharacterBehavior", ".js-popin-character", context)).each(
								function (index) {
									const $popinContainer = $(this);
									const $popinOpener = $popinContainer.find(".js-popin-character__button-open");
									const $popinContent = $popinContainer.find(".js-popin-character__content");
									prepareModal($popinContent, $popinOpener, {
										modalClass: "modal--container--character popin-character",
										lastOpenerFocusOnModalClose: false,
										removeUrlHashOnModalClose: true,
									});
									if (
										index + 1 === document.querySelectorAll(".js-popin-character").length &&
										window.location.hash
									) {
										const popinCharacterOpenerId = `#js-popin-character__button-open--${window.location.hash.substring(1)}`;
										if ($(popinCharacterOpenerId).length > 0) $(popinCharacterOpenerId).click();
									}
								}
							);
						},
					};
				})(jQuery, Drupal, once);
			},
			{},
		],
		12: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					Drupal.behaviors.newsletter = {
						attach: (context) => {
							$(once("initNewsletterPopin", "#js-popin-newsletter__content", context)).each(
								function () {
									const $popinContent = $(this);
									const popin = document.getElementById("js-popin-newsletter");
									const popinOverlay = document.getElementById("js-popin__overlay");
									const popinButtonsOpen = document.querySelectorAll(
										".js-popin-newsletter__button-open"
									);
									const popinButtonClose = document.getElementById("js-popin__button-close");
									const popinButtonAccordionToggle = document.getElementById(
										"js-popin__button-accordion"
									);
									const popinAccordion = document.getElementById("js-popin__accordion");
									const popinImgContainer = document.getElementById("js-popin__img-container");
									const $newsletterSocialsTeaserEmail = $(
										"#js-newsletter-socials-teaser__newsletter-form-email"
									);
									const $popinInputEmail = $("#edit-email-address");
									let isPopinOpened = false;
									let isAccordionOpened = false;
									function openNewsletterIfRegisterParam() {
										if (window.location.href.search(/(\?|&)register=?/) !== -1) togglePopin();
									}
									function copyInputValueOnChange($input1, $input2) {
										const $inputs = $($input1, $input2);
										$inputs.change(function () {
											$input2.val($(this).val());
										});
									}
									function togglePopin() {
										isPopinOpened = !isPopinOpened;
										if (popinButtonsOpen)
											popinButtonsOpen.forEach(function (currentPopinButtonOpen) {
												currentPopinButtonOpen.setAttribute("aria-expanded", isPopinOpened);
											});
										popinButtonClose.setAttribute("aria-expanded", isPopinOpened);
										popin.classList.toggle("js-popin--opened");
										_globalVars.htmlElement.classList.toggle("js-html--no-scroll");
									}
									function toggleAccordion() {
										isAccordionOpened = !isAccordionOpened;
										popinButtonAccordionToggle.setAttribute("aria-expanded", isAccordionOpened);
										popinButtonAccordionToggle.classList.toggle(
											"js-popin__button-accordion--opened"
										);
										popinAccordion.classList.toggle("js-popin__accordion--visible");
									}
									if ($newsletterSocialsTeaserEmail.length > 0 && $popinInputEmail.length > 0)
										copyInputValueOnChange($newsletterSocialsTeaserEmail, $popinInputEmail);
									if (popinButtonsOpen)
										popinButtonsOpen.forEach(function (currentPopinButtonOpen) {
											currentPopinButtonOpen.addEventListener("click", function () {
												togglePopin();
											});
										});
									if (popinButtonClose)
										popinButtonClose.addEventListener("click", function () {
											togglePopin();
										});
									if (popinOverlay)
										popinOverlay.addEventListener("click", function () {
											togglePopin();
										});
									if (popinButtonAccordionToggle)
										popinButtonAccordionToggle.addEventListener("click", function () {
											toggleAccordion();
										});
									openNewsletterIfRegisterParam();
									const $birthDate = $popinContent.find(
										".webform-submission-form .form-item-birth-date"
									);
									$birthDate.find("input").attr("placeholder", $birthDate.find("> label").text());
									if (popinImgContainer) {
										const popinImg = popinImgContainer.querySelector("img");
										if (popinImg && popinImg.classList.contains("twic"))
											enquire.register("screen and (min-width: 992px)", {
												match: function () {
													popinImg.dataset.twicFocus = "top-right";
												},
												unmatch: function () {
													popinImg.dataset.twicFocus = "none";
												},
											});
									}
								}
							);
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		13: [
			function (require, module, exports) {
				"use strict";
				(function ($, Drupal, once) {
					Drupal.behaviors.initProductsRangeModalMediaGallery = {
						attach: (context) => {
							$(
								once(
									"initProductsRangeModalMediaGalleryBehavior",
									".js-products-range__product-modal-media-gallery",
									context
								)
							).each(function () {
								const productModalMediaGallery = this;
								const $productImages = $(this).parent().find(".js-popin-carousel__button-open");
								const productModalMediaGalleryOptions = {
									copyElement: true,
									buildWhenOpen: true,
									modalClass:
										"title-theme modal--container--fullscreen modal--container--carousel js-modal--product-range__product-media-gallery",
								};
								prepareModal(
									productModalMediaGallery,
									$productImages,
									productModalMediaGalleryOptions
								);
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{},
		],
		14: [
			function (require, module, exports) {
				"use strict";
				(function ($, Drupal, once) {
					Drupal.behaviors.initProductsRangeModalRetailers = {
						attach: (context) => {
							$(
								once(
									"initProductsRangeModalRetailersBehavior",
									".js-products-range__product-modal-retailers",
									context
								)
							).each(function () {
								const productModalRetailers = this;
								const $productRetailersOpener = $(this)
									.parent()
									.find(".js-products-range__product-cta--retailers");
								const productModalRetailersOptions = {
									modalClass: "title-theme modal--container--grid-of-ctas",
								};
								prepareModal(
									productModalRetailers,
									$productRetailersOpener,
									productModalRetailersOptions
								);
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{},
		],
		15: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					Drupal.behaviors.initProductsRange = {
						attach: (context) => {
							$(once("initProductsRangeBehavior", "#js-products-range", context)).each(function () {
								document.addEventListener(
									"modal-opener-was-triggered-and-modal-will-be-opened",
									function (e) {
										setAndRefreshCarouselWhenModalOpens(e, "before");
									}
								);
								document.addEventListener("modal-was-opened", function (e) {
									setAndRefreshCarouselWhenModalOpens(e, "after");
								});
								document.addEventListener("modal-was-closed", function (e) {
									let $modalContainer = $("#" + e.detail.modalId);
									if ($modalContainer.hasClass("js-modal--product-range__product-media-gallery")) {
										let videoContainersInModal = $modalContainer.find(".js-modal__media--video");
										if (videoContainersInModal.length > 0)
											videoContainersInModal.each(function (index, videoContainer) {
												videoContainer.classList.remove(
													"modal__media--video--played",
													"modal__media--video--paused"
												);
												videoContainer.querySelector("video").currentTime = "0";
											});
										reinitAllExternalVideos($modalContainer);
									}
								});
								document.addEventListener("content-video-was-loaded", function (e) {
									let video = e.detail.video;
									e.detail.videoPlayerButton.addEventListener("click", function (e) {
										video.parentElement.classList.add("modal__media--video--played");
										video.play();
									});
								});
								function setAndRefreshCarouselWhenModalOpens(e, when) {
									let $modalContainer = $("#" + e.detail.modalId);
									if ($modalContainer.hasClass("js-modal--product-range__product-media-gallery")) {
										let $carousel = $modalContainer.find(
											".js-products-range__product-carousel-list"
										);
										if (when == "before")
											if (!$carousel.hasClass("slick-initialized")) {
												let textPrevArrow = Drupal.t("Previous item");
												let textNextArrow = Drupal.t("Next item");
												const prevArrow =
													'<button type="button" class="slick-prev"><span class="sr-only">' +
													textPrevArrow +
													"</span></button>";
												const nextArrow =
													'<button type="button" class="slick-next"><span class="sr-only">' +
													textNextArrow +
													"</span></button>";
												$carousel.slick({
													prevArrow,
													nextArrow,
													adaptiveHeight: false,
													rtl: _globalVars.isRtl,
													initialSlide: getSlideToGoTo(e),
												});
												if ($carousel.find(".js-modal__media--external-video"))
													$carousel
														.find(".js-modal__media--external-video")
														.each(function (index, videoContainer) {
															setPlayButtonClickableForExternalVideo(videoContainer);
														});
												$carousel.on(
													"beforeChange",
													function (event, slick, currentSlide, nextSlide) {
														if (currentSlide != nextSlide) {
															let $videosPlayedContainerInCarousel = $carousel.find(
																".modal__media--video--played"
															);
															if ($videosPlayedContainerInCarousel.length > 0)
																$videosPlayedContainerInCarousel.each(
																	function (index, videoPlayedContainer) {
																		videoPlayedContainer.classList.remove(
																			"modal__media--video--played"
																		);
																		videoPlayedContainer.querySelector("video").pause();
																		let currentTime =
																			videoPlayedContainer.querySelector("video").currentTime;
																		let indexVideoPlayed =
																			videoPlayedContainer.getAttribute("data-index");
																		let $originalAndCopiesOfTheVideoPlayed = $carousel.find(
																			".js-modal__media--video--" + indexVideoPlayed
																		);
																		if ($originalAndCopiesOfTheVideoPlayed.length > 0)
																			$originalAndCopiesOfTheVideoPlayed.each(
																				function (j, originalOrCopy) {
																					originalOrCopy.classList.add(
																						"modal__media--video--paused"
																					);
																					originalOrCopy.querySelector("video").currentTime =
																						"" + currentTime;
																				}
																			);
																	}
																);
															reinitAllExternalVideos($modalContainer);
														}
													}
												);
											} else $carousel.slick("slickGoTo", getSlideToGoTo(e));
										else {
											if (when == "after") {
												if (!$carousel.hasClass("videos-loaded")) {
													const $videoContainersInCarousel =
														$carousel.find(".js-modal__media--video");
													if ($videoContainersInCarousel && $videoContainersInCarousel.length > 0)
														$videoContainersInCarousel.each(function (i, videoContainer) {
															const video = videoContainer.querySelector(".js-modal__media-video");
															const videoPlayerButton = videoContainer.querySelector(
																".js-modal__media-video-tag"
															);
															if (video) {
																let videoLozadObserver;
																enquire.register("screen and (max-width: 767px)", {
																	match: function () {
																		switchVideoSources(video, "mobile");
																		startVideoLozadObserver();
																	},
																});
																enquire.register("screen and (min-width: 768px)", {
																	match: function () {
																		switchVideoSources(video, "desktop");
																		startVideoLozadObserver();
																	},
																});
																function startVideoLozadObserver() {
																	if (!videoLozadObserver)
																		videoLozadObserver = lozad(video, {
																			loaded: function (el) {
																				document.dispatchEvent(
																					new CustomEvent("content-video-was-loaded", {
																						detail: {
																							videoPlayerButton: videoPlayerButton,
																							video: el,
																						},
																					})
																				);
																			},
																		});
																	videoLozadObserver.observe();
																}
															}
														});
													$carousel.addClass("videos-loaded");
												}
												$carousel.slick("setPosition");
											}
										}
									}
								}
							});
							function getSlideToGoTo(e) {
								let slideToGoTo = 0;
								if (e.detail.triggeredOpener != "delay") {
									let $triggeredOpener = $(e.detail.triggeredOpener);
									slideToGoTo = $triggeredOpener.data("index");
								}
								return slideToGoTo;
							}
							function switchVideoSources(video, switchTo) {
								let videoSources = video.querySelectorAll("source");
								if (videoSources) {
									videoSources.forEach(function (currentVideoSource) {
										let oldSource = currentVideoSource.dataset.src;
										let newSource;
										if (switchTo === "mobile") newSource = currentVideoSource.dataset.mobileSrc;
										else {
											if (switchTo === "desktop")
												if (currentVideoSource.dataset.desktopSrc)
													newSource = currentVideoSource.dataset.desktopSrc;
												else newSource = oldSource;
										}
										currentVideoSource.dataset.src = currentVideoSource.dataset.src.replace(
											oldSource,
											newSource
										);
										if (currentVideoSource.hasAttribute("src"))
											currentVideoSource.removeAttribute("src");
									});
									video.removeAttribute("data-loaded");
								}
							}
							function reinitAllExternalVideos($modalContainer) {
								let $externalVideosPlayedContainerInModal = $modalContainer.find(
									".js-modal__media--external-video--played"
								);
								if ($externalVideosPlayedContainerInModal.length > 0)
									$externalVideosPlayedContainerInModal.each(function (i, externalVideoSlide) {
										let parentExternalVideoSlide = externalVideoSlide.parentElement;
										externalVideoSlide.classList.remove("js-modal__media--external-video--played");
										let tempExternalVideoSlide = externalVideoSlide.cloneNode(true);
										externalVideoSlide.remove();
										parentExternalVideoSlide.appendChild(tempExternalVideoSlide);
										setPlayButtonClickableForExternalVideo(
											parentExternalVideoSlide.firstElementChild
										);
									});
							}
							function setPlayButtonClickableForExternalVideo(videoContainer) {
								if (videoContainer.querySelector(".js-modal__media-video-tag"))
									videoContainer
										.querySelector(".js-modal__media-video-tag")
										.addEventListener("click", function (e) {
											videoContainer.classList.add("js-modal__media--external-video--played");
										});
							}
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
		16: [
			function (require, module, exports) {
				"use strict";
				const pushEventClose = new Event("push-event-close");
				(function ($, Drupal, once) {
					Drupal.behaviors.pushEvent = {
						attach: (context) => {
							$(once("initPushEvent", "#js-push-event", context)).each(function () {
								const $topBanner = $(this);
								$(document).on("click", "#js-push-event__button-close", function () {
									$topBanner.hide();
									document.dispatchEvent(pushEventClose);
									$.ajax({ url: "/push-event-close", cache: false });
								});
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{},
		],
		17: [
			function (require, module, exports) {
				"use strict";
				require("./global-vars");
				require("./push-event");
				require("./intro-video");
				require("./newsletter-sticky");
				require("./join-the-club");
				require("./how-to-get-points");
				require("./store");
				require("./news-carousel");
				require("./cards-carousel");
				require("./hero-banner");
				require("./popin");
				require("./popin-character");
				require("./article-page");
				require("./products-range");
				require("./products-range-modal-media-gallery");
				require("./products-range-modal-retailers");
			},
			{
				"./article-page": 2,
				"./cards-carousel": 3,
				"./global-vars": 4,
				"./hero-banner": 5,
				"./how-to-get-points": 6,
				"./intro-video": 7,
				"./join-the-club": 8,
				"./news-carousel": 9,
				"./newsletter-sticky": 10,
				"./popin": 12,
				"./popin-character": 11,
				"./products-range": 15,
				"./products-range-modal-media-gallery": 13,
				"./products-range-modal-retailers": 14,
				"./push-event": 16,
				"./store": 18,
			},
		],
		18: [
			function (require, module, exports) {
				"use strict";
				var _globalVars = require("./global-vars");
				(function ($, Drupal, once) {
					Drupal.behaviors.initStoreSlider = {
						attach: (context) => {
							$(once("initStoreSliderBehavior", "#js-store__feed-list", context)).each(function () {
								let $joinTheClubSlider = $(this);
								if ($joinTheClubSlider.length > 0)
									$joinTheClubSlider.not(".slick-initialized").slick({
										infinite: false,
										arrows: false,
										slidesToShow: 5,
										rtl: _globalVars.isRtl,
										responsive: [
											{ breakpoint: 1600, settings: { slidesToShow: 4 } },
											{ breakpoint: 1280, settings: { slidesToShow: 3 } },
											{ breakpoint: 992, settings: { slidesToShow: 2 } },
											{ breakpoint: 640, settings: { slidesToShow: 1 } },
										],
									});
							});
						},
					};
				})(jQuery, Drupal, once);
			},
			{ "./global-vars": 4 },
		],
	},
	{},
	[17]
);
(function ($, Drupal) {
	Drupal.theme.progressBar = function (id) {
		const escapedId = Drupal.checkPlain(id);
		return (
			`<div id="${escapedId}" class="progress" aria-live="polite">` +
			'<div class="progress__label">&nbsp;</div>' +
			'<div class="progress__track"><div class="progress__bar"></div></div>' +
			'<div class="progress__percentage"></div>' +
			'<div class="progress__description">&nbsp;</div>' +
			"</div>"
		);
	};
	Drupal.ProgressBar = function (id, updateCallback, method, errorCallback) {
		this.id = id;
		this.method = method || "GET";
		this.updateCallback = updateCallback;
		this.errorCallback = errorCallback;
		this.element = $(Drupal.theme("progressBar", id));
	};
	$.extend(Drupal.ProgressBar.prototype, {
		setProgress(percentage, message, label) {
			if (percentage >= 0 && percentage <= 100) {
				$(this.element)
					.find("div.progress__bar")
					.each(function () {
						this.style.width = `${percentage}%`;
					});
				$(this.element).find("div.progress__percentage").html(`${percentage}%`);
			}
			$("div.progress__description", this.element).html(message);
			$("div.progress__label", this.element).html(label);
			if (this.updateCallback) this.updateCallback(percentage, message, this);
		},
		startMonitoring(uri, delay) {
			this.delay = delay;
			this.uri = uri;
			this.sendPing();
		},
		stopMonitoring() {
			clearTimeout(this.timer);
			this.uri = null;
		},
		sendPing() {
			if (this.timer) clearTimeout(this.timer);
			if (this.uri) {
				const pb = this;
				let uri = this.uri;
				if (!uri.includes("?")) uri += "?";
				else uri += "&";
				uri += "_format=json";
				$.ajax({
					type: this.method,
					url: uri,
					data: "",
					dataType: "json",
					success(progress) {
						if (progress.status === 0) {
							pb.displayError(progress.data);
							return;
						}
						pb.setProgress(progress.percentage, progress.message, progress.label);
						pb.timer = setTimeout(() => {
							pb.sendPing();
						}, pb.delay);
					},
					error(xmlhttp) {
						const e = new Drupal.AjaxError(xmlhttp, pb.uri);
						pb.displayError(`<pre>${e.message}</pre>`);
					},
				});
			}
		},
		displayError(string) {
			const error = $('<div class="messages messages--error"></div>').html(string);
			$(this.element).before(error).hide();
			if (this.errorCallback) this.errorCallback(this);
		},
	});
})(jQuery, Drupal);
/* @license MIT https://raw.githubusercontent.com/muicss/loadjs/4.3.0/LICENSE.txt */
loadjs = (function () {
	var h = function () {},
		o = {},
		c = {},
		f = {};
	function u(e, n) {
		if (e) {
			var t = f[e];
			if (((c[e] = n), t)) for (; t.length; ) (t[0](e, n), t.splice(0, 1));
		}
	}
	function l(e, n) {
		(e.call && (e = { success: e }), n.length ? (e.error || h)(n) : (e.success || h)(e));
	}
	function p(t, r, i, s) {
		var o,
			e,
			u,
			n = document,
			c = i.async,
			f = (i.numRetries || 0) + 1,
			l = i.before || h,
			a = t.replace(/[\?|#].*$/, ""),
			d = t.replace(/^(css|img|module|nomodule)!/, "");
		if (((s = s || 0), /(^css!|\.css$)/.test(a)))
			(((u = n.createElement("link")).rel = "stylesheet"),
				(u.href = d),
				(o = "hideFocus" in u) && u.relList && ((o = 0), (u.rel = "preload"), (u.as = "style")));
		else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(a)) (u = n.createElement("img")).src = d;
		else if (
			(((u = n.createElement("script")).src = d),
			(u.async = void 0 === c || c),
			(e = "noModule" in u),
			/^module!/.test(a))
		) {
			if (!e) return r(t, "l");
			u.type = "module";
		} else if (/^nomodule!/.test(a) && e) return r(t, "l");
		!(u.onload =
			u.onerror =
			u.onbeforeload =
				function (e) {
					var n = e.type[0];
					if (o)
						try {
							u.sheet.cssText.length || (n = "e");
						} catch (e) {
							18 != e.code && (n = "e");
						}
					if ("e" == n) {
						if ((s += 1) < f) return p(t, r, i, s);
					} else if ("preload" == u.rel && "style" == u.as) return (u.rel = "stylesheet");
					r(t, n, e.defaultPrevented);
				}) !== l(t, u) && n.head.appendChild(u);
	}
	function t(e, n, t) {
		var r, i;
		if ((n && n.trim && (r = n), (i = (r ? t : n) || {}), r)) {
			if (r in o) throw "LoadJS";
			o[r] = !0;
		}
		function s(n, t) {
			!(function (e, r, n) {
				var t,
					i,
					s = (e = e.push ? e : [e]).length,
					o = s,
					u = [];
				for (
					t = function (e, n, t) {
						if (("e" == n && u.push(e), "b" == n)) {
							if (!t) return;
							u.push(e);
						}
						--s || r(u);
					},
						i = 0;
					i < o;
					i++
				)
					p(e[i], t, n);
			})(
				e,
				function (e) {
					(l(i, e), n && l({ success: n, error: t }, e), u(r, e));
				},
				i
			);
		}
		if (i.returnPromise) return new Promise(s);
		s();
	}
	return (
		(t.ready = function (e, n) {
			return (
				(function (e, t) {
					e = e.push ? e : [e];
					var n,
						r,
						i,
						s = [],
						o = e.length,
						u = o;
					for (
						n = function (e, n) {
							(n.length && s.push(e), --u || t(s));
						};
						o--;
					)
						((r = e[o]), (i = c[r]) ? n(r, i) : (f[r] = f[r] || []).push(n));
				})(e, function (e) {
					l(n, e);
				}),
				t
			);
		}),
		(t.done = function (e) {
			u(e, []);
		}),
		(t.reset = function () {
			((o = {}), (c = {}), (f = {}));
		}),
		(t.isDefined = function (e) {
			return e in o;
		}),
		t
	);
})();
/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
Drupal.debounce = function (func, wait, immediate) {
	let timeout;
	let result;
	return function (...args) {
		const context = this;
		const later = function () {
			timeout = null;
			if (!immediate) result = func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) result = func.apply(context, args);
		return result;
	};
};
(function (Drupal, debounce) {
	let liveElement;
	const announcements = [];
	Drupal.behaviors.drupalAnnounce = {
		attach(context) {
			if (!liveElement) {
				liveElement = document.createElement("div");
				liveElement.id = "drupal-live-announce";
				liveElement.className = "visually-hidden";
				liveElement.setAttribute("aria-live", "polite");
				liveElement.setAttribute("aria-busy", "false");
				document.body.appendChild(liveElement);
			}
		},
	};
	function announce() {
		const text = [];
		let priority = "polite";
		let announcement;
		const il = announcements.length;
		for (let i = 0; i < il; i++) {
			announcement = announcements.pop();
			text.unshift(announcement.text);
			if (announcement.priority === "assertive") priority = "assertive";
		}
		if (text.length) {
			liveElement.innerHTML = "";
			liveElement.setAttribute("aria-busy", "true");
			liveElement.setAttribute("aria-live", priority);
			liveElement.innerHTML = text.join("\n");
			liveElement.setAttribute("aria-busy", "false");
		}
	}
	Drupal.announce = function (text, priority) {
		announcements.push({ text, priority });
		return debounce(announce, 200)();
	};
})(Drupal, Drupal.debounce);
((Drupal) => {
	Drupal.Message = class {
		constructor(messageWrapper = null) {
			if (!messageWrapper) this.messageWrapper = Drupal.Message.defaultWrapper();
			else this.messageWrapper = messageWrapper;
		}
		static defaultWrapper() {
			let wrapper =
				document.querySelector("[data-drupal-messages]") ||
				document.querySelector("[data-drupal-messages-fallback]");
			if (!wrapper) {
				wrapper = document.createElement("div");
				document.body.appendChild(wrapper);
			}
			if (wrapper.hasAttribute("data-drupal-messages-fallback")) {
				wrapper.removeAttribute("data-drupal-messages-fallback");
				wrapper.classList.remove("hidden");
			}
			wrapper.setAttribute("data-drupal-messages", "");
			return wrapper.innerHTML === ""
				? Drupal.Message.messageInternalWrapper(wrapper)
				: wrapper.firstElementChild;
		}
		static getMessageTypeLabels() {
			return {
				status: Drupal.t("Status message"),
				error: Drupal.t("Error message"),
				warning: Drupal.t("Warning message"),
			};
		}
		add(message, options = {}) {
			if (!options.hasOwnProperty("type")) options.type = "status";
			if (typeof message !== "string") throw new Error("Message must be a string.");
			Drupal.Message.announce(message, options);
			options.id = options.id
				? String(options.id)
				: `${options.type}-${Math.random().toFixed(15).replace("0.", "")}`;
			if (!Drupal.Message.getMessageTypeLabels().hasOwnProperty(options.type)) {
				const { type } = options;
				throw new Error(
					`The message type, ${type}, is not present in Drupal.Message.getMessageTypeLabels().`
				);
			}
			this.messageWrapper.appendChild(Drupal.theme("message", { text: message }, options));
			return options.id;
		}
		select(id) {
			return this.messageWrapper.querySelector(`[data-drupal-message-id^="${id}"]`);
		}
		remove(id) {
			return this.messageWrapper.removeChild(this.select(id));
		}
		clear() {
			this.messageWrapper.querySelectorAll("[data-drupal-message-id]").forEach((message) => {
				this.messageWrapper.removeChild(message);
			});
		}
		static announce(message, options) {
			if (!options.priority && (options.type === "warning" || options.type === "error"))
				options.priority = "assertive";
			if (options.announce !== "") Drupal.announce(options.announce || message, options.priority);
		}
		static messageInternalWrapper(messageWrapper) {
			const innerWrapper = document.createElement("div");
			innerWrapper.setAttribute("class", "messages__wrapper");
			messageWrapper.insertAdjacentElement("afterbegin", innerWrapper);
			return innerWrapper;
		}
	};
	Drupal.theme.message = ({ text }, { type, id }) => {
		const messagesTypes = Drupal.Message.getMessageTypeLabels();
		const messageWrapper = document.createElement("div");
		messageWrapper.setAttribute("class", `messages messages--${type}`);
		messageWrapper.setAttribute(
			"role",
			type === "error" || type === "warning" ? "alert" : "status"
		);
		messageWrapper.setAttribute("data-drupal-message-id", id);
		messageWrapper.setAttribute("data-drupal-message-type", type);
		messageWrapper.setAttribute("aria-label", messagesTypes[type]);
		messageWrapper.innerHTML = `${text}`;
		return messageWrapper;
	};
})(Drupal);
(function ($, window, Drupal, drupalSettings, loadjs, { isFocusable, tabbable }) {
	Drupal.behaviors.AJAX = {
		attach(context, settings) {
			function loadAjaxBehavior(base) {
				const elementSettings = settings.ajax[base];
				if (typeof elementSettings.selector === "undefined") elementSettings.selector = `#${base}`;
				once("drupal-ajax", $(elementSettings.selector)).forEach((el) => {
					elementSettings.element = el;
					elementSettings.base = base;
					Drupal.ajax(elementSettings);
				});
			}
			Object.keys(settings.ajax || {}).forEach(loadAjaxBehavior);
			Drupal.ajax.bindAjaxLinks(document.body);
			once("ajax", ".use-ajax-submit").forEach((el) => {
				const elementSettings = {
					url: $(el.form).attr("action"),
					setClick: true,
					event: "click",
					progress: { type: "throbber" },
					base: el.id,
					element: el,
				};
				Drupal.ajax(elementSettings);
			});
		},
		detach(context, settings, trigger) {
			if (trigger === "unload")
				Drupal.ajax.expired().forEach((instance) => {
					Drupal.ajax.instances[instance.instanceIndex] = null;
				});
		},
	};
	Drupal.AjaxError = function (xmlhttp, uri, customMessage) {
		let statusCode;
		let statusText;
		let responseText;
		if (xmlhttp.status)
			statusCode = `\n${Drupal.t("An AJAX HTTP error occurred.")}\n${Drupal.t("HTTP Result Code: !status", { "!status": xmlhttp.status })}`;
		else statusCode = `\n${Drupal.t("An AJAX HTTP request terminated abnormally.")}`;
		statusCode += `\n${Drupal.t("Debugging information follows.")}`;
		const pathText = `\n${Drupal.t("Path: !uri", { "!uri": uri })}`;
		statusText = "";
		try {
			statusText = `\n${Drupal.t("StatusText: !statusText", { "!statusText": xmlhttp.statusText.trim() })}`;
		} catch (e) {}
		responseText = "";
		try {
			responseText = `\n${Drupal.t("ResponseText: !responseText", { "!responseText": xmlhttp.responseText.trim() })}`;
		} catch (e) {}
		responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, "");
		responseText = responseText.replace(/[\n]+\s+/g, "\n");
		const readyStateText =
			xmlhttp.status === 0
				? `\n${Drupal.t("ReadyState: !readyState", { "!readyState": xmlhttp.readyState })}`
				: "";
		customMessage = customMessage
			? `\n${Drupal.t("CustomMessage: !customMessage", { "!customMessage": customMessage })}`
			: "";
		this.message =
			statusCode + pathText + statusText + customMessage + responseText + readyStateText;
		this.name = "AjaxError";
		if (!Drupal.AjaxError.messages) Drupal.AjaxError.messages = new Drupal.Message();
		Drupal.AjaxError.messages.add(
			Drupal.t(
				"Oops, something went wrong. Check your browser's developer console for more details."
			),
			{ type: "error" }
		);
	};
	Drupal.AjaxError.prototype = new Error();
	Drupal.AjaxError.prototype.constructor = Drupal.AjaxError;
	Drupal.ajax = function (settings) {
		if (arguments.length !== 1)
			throw new Error("Drupal.ajax() function must be called with one configuration object only");
		const base = settings.base || false;
		const element = settings.element || false;
		delete settings.base;
		delete settings.element;
		if (!settings.progress && !element) settings.progress = false;
		const ajax = new Drupal.Ajax(base, element, settings);
		ajax.instanceIndex = Drupal.ajax.instances.length;
		Drupal.ajax.instances.push(ajax);
		return ajax;
	};
	Drupal.ajax.instances = [];
	Drupal.ajax.expired = function () {
		return Drupal.ajax.instances.filter(
			(instance) =>
				instance && instance.element !== false && !document.body.contains(instance.element)
		);
	};
	Drupal.ajax.bindAjaxLinks = (element) => {
		once("ajax", ".use-ajax", element).forEach((ajaxLink) => {
			const $linkElement = $(ajaxLink);
			const elementSettings = {
				progress: { type: "throbber" },
				dialogType: $linkElement.data("dialog-type"),
				dialog: $linkElement.data("dialog-options"),
				dialogRenderer: $linkElement.data("dialog-renderer"),
				base: $linkElement.attr("id"),
				element: ajaxLink,
			};
			const href = $linkElement.attr("href");
			if (href) {
				elementSettings.url = href;
				elementSettings.event = "click";
			}
			const httpMethod = $linkElement.data("ajax-http-method");
			if (httpMethod) elementSettings.httpMethod = httpMethod;
			Drupal.ajax(elementSettings);
		});
	};
	Drupal.Ajax = function (base, element, elementSettings) {
		const defaults = {
			httpMethod: "POST",
			event: element ? "mousedown" : null,
			keypress: true,
			selector: base ? `#${base}` : null,
			effect: "none",
			speed: "none",
			method: "replaceWith",
			progress: { type: "throbber", message: Drupal.t("Processing...") },
			submit: { js: true },
		};
		$.extend(this, defaults, elementSettings);
		this.commands = new Drupal.AjaxCommands();
		this.instanceIndex = false;
		if (this.wrapper) this.wrapper = `#${this.wrapper}`;
		this.element = element;
		this.preCommandsFocusedElementSelector = null;
		this.elementSettings = elementSettings;
		if (this.element?.form) this.$form = $(this.element.form);
		if (!this.url) {
			const $element = $(this.element);
			if (this.element.tagName === "A") this.url = $element.attr("href");
			else {
				if (this.element && element.form) this.url = this.$form.attr("action");
			}
		}
		const originalUrl = this.url;
		this.url = this.url.replace(/\/nojs(\/|$|\?|#)/, "/ajax$1");
		if (drupalSettings.ajaxTrustedUrl[originalUrl]) drupalSettings.ajaxTrustedUrl[this.url] = true;
		const ajax = this;
		ajax.options = {
			url: ajax.url,
			data: ajax.submit,
			isInProgress() {
				return ajax.ajaxing;
			},
			beforeSerialize(elementSettings, options) {
				return ajax.beforeSerialize(elementSettings, options);
			},
			beforeSubmit(formValues, elementSettings, options) {
				ajax.ajaxing = true;
				ajax.preCommandsFocusedElementSelector = null;
				return ajax.beforeSubmit(formValues, elementSettings, options);
			},
			beforeSend(xmlhttprequest, options) {
				ajax.ajaxing = true;
				return ajax.beforeSend(xmlhttprequest, options);
			},
			success(response, status, xmlhttprequest) {
				ajax.preCommandsFocusedElementSelector =
					document.activeElement.getAttribute("data-drupal-selector");
				if (typeof response === "string") response = JSON.parse(response);
				if (response !== null && !drupalSettings.ajaxTrustedUrl[ajax.url])
					if (xmlhttprequest.getResponseHeader("X-Drupal-Ajax-Token") !== "1") {
						const customMessage = Drupal.t(
							"The response failed verification so will not be processed."
						);
						return ajax.error(xmlhttprequest, ajax.url, customMessage);
					}
				return Promise.resolve(ajax.success(response, status)).then(() => {
					ajax.ajaxing = false;
					$(document).trigger("ajaxSuccess", [xmlhttprequest, this]);
					$(document).trigger("ajaxComplete", [xmlhttprequest, this]);
					if (--$.active === 0) $(document).trigger("ajaxStop");
				});
			},
			error(xmlhttprequest, status, error) {
				ajax.ajaxing = false;
			},
			complete(xmlhttprequest, status) {
				if (status === "error" || status === "parsererror")
					return ajax.error(xmlhttprequest, ajax.url);
			},
			dataType: "json",
			jsonp: false,
			method: ajax.httpMethod,
		};
		if (elementSettings.dialog) ajax.options.data.dialogOptions = elementSettings.dialog;
		if (!ajax.options.url.includes("?")) ajax.options.url += "?";
		else ajax.options.url += "&";
		let wrapper = `drupal_${elementSettings.dialogType || "ajax"}`;
		if (elementSettings.dialogRenderer) wrapper += `.${elementSettings.dialogRenderer}`;
		ajax.options.url += `${Drupal.ajax.WRAPPER_FORMAT}=${wrapper}`;
		$(ajax.element).on(elementSettings.event, function (event) {
			if (!drupalSettings.ajaxTrustedUrl[ajax.url] && !Drupal.url.isLocal(ajax.url))
				throw new Error(
					Drupal.t("The callback URL is not local and not trusted: !url", { "!url": ajax.url })
				);
			return ajax.eventResponse(this, event);
		});
		if (elementSettings.keypress)
			$(ajax.element).on("keypress", function (event) {
				return ajax.keypressResponse(this, event);
			});
		if (elementSettings.prevent) $(ajax.element).on(elementSettings.prevent, false);
	};
	Drupal.ajax.WRAPPER_FORMAT = "_wrapper_format";
	Drupal.Ajax.AJAX_REQUEST_PARAMETER = "_drupal_ajax";
	Drupal.Ajax.prototype.execute = function () {
		if (this.ajaxing) return;
		try {
			this.beforeSerialize(this.element, this.options);
			return $.ajax(this.options);
		} catch (e) {
			this.ajaxing = false;
			window.alert(
				`An error occurred while attempting to process ${this.options.url}: ${e.message}`
			);
			return $.Deferred().reject();
		}
	};
	Drupal.Ajax.prototype.keypressResponse = function (element, event) {
		const ajax = this;
		if (
			event.which === 13 ||
			(event.which === 32 &&
				element.type !== "text" &&
				element.type !== "textarea" &&
				element.type !== "tel" &&
				element.type !== "number")
		) {
			event.preventDefault();
			event.stopPropagation();
			$(element).trigger(ajax.elementSettings.event);
		}
	};
	Drupal.Ajax.prototype.eventResponse = function (element, event) {
		event.preventDefault();
		event.stopPropagation();
		const ajax = this;
		if (ajax.ajaxing) return;
		try {
			if (ajax.$form) {
				if (ajax.setClick) element.form.clk = element;
				ajax.$form.ajaxSubmit(ajax.options);
			} else {
				ajax.beforeSerialize(ajax.element, ajax.options);
				$.ajax(ajax.options);
			}
		} catch (e) {
			ajax.ajaxing = false;
			window.alert(
				`An error occurred while attempting to process ${ajax.options.url}: ${e.message}`
			);
		}
	};
	Drupal.Ajax.prototype.beforeSerialize = function (element, options) {
		if (this.$form && document.body.contains(this.$form.get(0))) {
			const settings = this.settings || drupalSettings;
			Drupal.detachBehaviors(this.$form.get(0), settings, "serialize");
		}
		options.data[Drupal.Ajax.AJAX_REQUEST_PARAMETER] = 1;
		const pageState = drupalSettings.ajaxPageState;
		options.data["ajax_page_state[theme]"] = pageState.theme;
		options.data["ajax_page_state[theme_token]"] = pageState.theme_token;
		options.data["ajax_page_state[libraries]"] = pageState.libraries;
	};
	Drupal.Ajax.prototype.beforeSubmit = function (formValues, element, options) {};
	Drupal.Ajax.prototype.beforeSend = function (xmlhttprequest, options) {
		if (this.$form) {
			options.extraData = options.extraData || {};
			options.extraData.ajax_iframe_upload = "1";
			const v = $.fieldValue(this.element);
			if (v !== null) options.extraData[this.element.name] = v;
		}
		$(this.element).prop("disabled", true);
		if (!this.progress || !this.progress.type) return;
		const progressIndicatorMethod = `setProgressIndicator${this.progress.type.slice(0, 1).toUpperCase()}${this.progress.type.slice(1).toLowerCase()}`;
		if (progressIndicatorMethod in this && typeof this[progressIndicatorMethod] === "function")
			this[progressIndicatorMethod].call(this);
	};
	Drupal.theme.ajaxProgressThrobber = (message) => {
		const messageMarkup =
			typeof message === "string" ? Drupal.theme("ajaxProgressMessage", message) : "";
		const throbber = '<div class="throbber">&nbsp;</div>';
		return `<div class="ajax-progress ajax-progress-throbber">${throbber}${messageMarkup}</div>`;
	};
	Drupal.theme.ajaxProgressIndicatorFullscreen = () =>
		'<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>';
	Drupal.theme.ajaxProgressMessage = (message) => `<div class="message">${message}</div>`;
	Drupal.theme.ajaxProgressBar = ($element) =>
		$('<div class="ajax-progress ajax-progress-bar"></div>').append($element);
	Drupal.Ajax.prototype.setProgressIndicatorBar = function () {
		const progressBar = new Drupal.ProgressBar(
			`ajax-progress-${this.element.id}`,
			$.noop,
			this.progress.method,
			$.noop
		);
		if (this.progress.message) progressBar.setProgress(-1, this.progress.message);
		if (this.progress.url)
			progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
		this.progress.element = $(Drupal.theme("ajaxProgressBar", progressBar.element));
		this.progress.object = progressBar;
		$(this.element).after(this.progress.element);
	};
	Drupal.Ajax.prototype.setProgressIndicatorThrobber = function () {
		this.progress.element = $(Drupal.theme("ajaxProgressThrobber", this.progress.message));
		if ($(this.element).closest("[data-drupal-ajax-container]").length)
			$(this.element).closest("[data-drupal-ajax-container]").after(this.progress.element);
		else $(this.element).after(this.progress.element);
	};
	Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function () {
		this.progress.element = $(Drupal.theme("ajaxProgressIndicatorFullscreen"));
		$("body").append(this.progress.element);
	};
	Drupal.Ajax.prototype.commandExecutionQueue = function (response, status) {
		const ajaxCommands = this.commands;
		return Object.keys(response || {}).reduce(
			(executionQueue, key) =>
				executionQueue.then(() => {
					const { command } = response[key];
					if (command && ajaxCommands[command])
						return ajaxCommands[command](this, response[key], status);
				}),
			Promise.resolve()
		);
	};
	Drupal.Ajax.prototype.success = function (response, status) {
		if (this.progress.element) $(this.progress.element).remove();
		if (this.progress.object) this.progress.object.stopMonitoring();
		$(this.element).prop("disabled", false);
		const elementParents = $(this.element).parents("[data-drupal-selector]").addBack().toArray();
		const focusChanged = Object.keys(response || {}).some((key) => {
			const { command, method } = response[key];
			return (
				command === "focusFirst" ||
				command === "openDialog" ||
				(command === "invoke" && method === "focus")
			);
		});
		return this.commandExecutionQueue(response, status)
			.then(() => {
				if (!focusChanged) {
					let target = false;
					if (this.element) {
						if ($(this.element).data("refocus-blur") && this.preCommandsFocusedElementSelector)
							target = document.querySelector(
								`[data-drupal-selector="${this.preCommandsFocusedElementSelector}"]`
							);
						if (!target && !$(this.element).data("disable-refocus")) {
							for (let n = elementParents.length - 1; !target && n >= 0; n--)
								target = document.querySelector(
									`[data-drupal-selector="${elementParents[n].getAttribute("data-drupal-selector")}"]`
								);
						}
					}
					if (target) $(target).trigger("focus");
				}
				if (this.$form && document.body.contains(this.$form.get(0))) {
					const settings = this.settings || drupalSettings;
					Drupal.attachBehaviors(this.$form.get(0), settings);
				}
				this.settings = null;
			})
			.catch((error) =>
				console.error(
					Drupal.t("An error occurred during the execution of the Ajax response: !error", {
						"!error": error,
					})
				)
			);
	};
	Drupal.Ajax.prototype.getEffect = function (response) {
		const type = response.effect || this.effect;
		const speed = response.speed || this.speed;
		const effect = {};
		if (type === "none") {
			effect.showEffect = "show";
			effect.hideEffect = "hide";
			effect.showSpeed = "";
		} else if (type === "fade") {
			effect.showEffect = "fadeIn";
			effect.hideEffect = "fadeOut";
			effect.showSpeed = speed;
		} else {
			effect.showEffect = `${type}Toggle`;
			effect.hideEffect = `${type}Toggle`;
			effect.showSpeed = speed;
		}
		return effect;
	};
	Drupal.Ajax.prototype.error = function (xmlhttprequest, uri, customMessage) {
		if (this.progress.element) $(this.progress.element).remove();
		if (this.progress.object) this.progress.object.stopMonitoring();
		$(this.wrapper).show();
		$(this.element).prop("disabled", false);
		if (this.$form && document.body.contains(this.$form.get(0))) {
			const settings = this.settings || drupalSettings;
			Drupal.attachBehaviors(this.$form.get(0), settings);
		}
		throw new Drupal.AjaxError(xmlhttprequest, uri, customMessage);
	};
	Drupal.theme.ajaxWrapperNewContent = ($newContent, ajax, response) =>
		(response.effect || ajax.effect) !== "none" &&
		$newContent.filter(
			(i) =>
				!(
					$newContent[i].nodeName === "#comment" ||
					($newContent[i].nodeName === "#text" && /^(\s|\n|\r)*$/.test($newContent[i].textContent))
				)
		).length > 1
			? Drupal.theme("ajaxWrapperMultipleRootElements", $newContent)
			: $newContent;
	Drupal.theme.ajaxWrapperMultipleRootElements = ($elements) => $("<div></div>").append($elements);
	Drupal.AjaxCommands = function () {};
	Drupal.AjaxCommands.prototype = {
		insert(ajax, response) {
			const $wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
			const method = response.method || ajax.method;
			const effect = ajax.getEffect(response);
			const settings = response.settings || ajax.settings || drupalSettings;
			const parseHTML = (htmlString) => {
				const fragment = document.createDocumentFragment();
				const template = fragment.appendChild(document.createElement("template"));
				template.innerHTML = htmlString;
				return template.content.childNodes;
			};
			let $newContent = $(parseHTML(response.data));
			$newContent = Drupal.theme("ajaxWrapperNewContent", $newContent, ajax, response);
			switch (method) {
				case "html":
				case "replaceWith":
				case "replaceAll":
				case "empty":
				case "remove":
					Drupal.detachBehaviors($wrapper.get(0), settings);
					break;
				default:
					break;
			}
			$wrapper[method]($newContent);
			if (effect.showEffect !== "show") $newContent.hide();
			const $ajaxNewContent = $newContent.find(".ajax-new-content");
			if ($ajaxNewContent.length) {
				$ajaxNewContent.hide();
				$newContent.show();
				$ajaxNewContent[effect.showEffect](effect.showSpeed);
			} else {
				if (effect.showEffect !== "show") $newContent[effect.showEffect](effect.showSpeed);
			}
			$newContent.each((index, element) => {
				if (element.nodeType === Node.ELEMENT_NODE && document.documentElement.contains(element))
					Drupal.attachBehaviors(element, settings);
			});
		},
		remove(ajax, response, status) {
			const settings = response.settings || ajax.settings || drupalSettings;
			$(response.selector)
				.each(function () {
					Drupal.detachBehaviors(this, settings);
				})
				.remove();
		},
		changed(ajax, response, status) {
			const $element = $(response.selector);
			if (!$element.hasClass("ajax-changed")) {
				$element.addClass("ajax-changed");
				if (response.asterisk)
					$element
						.find(response.asterisk)
						.append(` <abbr class="ajax-changed" title="${Drupal.t("Changed")}">*</abbr> `);
			}
		},
		alert(ajax, response, status) {
			window.alert(response.text);
		},
		announce(ajax, response) {
			if (response.priority) Drupal.announce(response.text, response.priority);
			else Drupal.announce(response.text);
		},
		redirect(ajax, response, status) {
			window.location = response.url;
		},
		css(ajax, response, status) {
			$(response.selector).css(response.argument);
		},
		settings(ajax, response, status) {
			const ajaxSettings = drupalSettings.ajax;
			if (ajaxSettings)
				Drupal.ajax.expired().forEach((instance) => {
					if (instance.selector) {
						const selector = instance.selector.replace("#", "");
						if (selector in ajaxSettings) delete ajaxSettings[selector];
					}
				});
			if (response.merge) $.extend(true, drupalSettings, response.settings);
			else ajax.settings = response.settings;
		},
		data(ajax, response, status) {
			$(response.selector).data(response.name, response.value);
		},
		focusFirst(ajax, response, status) {
			let focusChanged = false;
			const container = document.querySelector(response.selector);
			if (container) {
				const tabbableElements = tabbable(container);
				if (tabbableElements.length) {
					tabbableElements[0].focus();
					focusChanged = true;
				} else {
					if (isFocusable(container)) {
						container.focus();
						focusChanged = true;
					}
				}
			}
			if (ajax.hasOwnProperty("element") && !focusChanged) ajax.element.focus();
		},
		invoke(ajax, response, status) {
			const $element = $(response.selector);
			$element[response.method](...response.args);
		},
		restripe(ajax, response, status) {
			$(response.selector)
				.find("> tbody > tr:visible, > tr:visible")
				.removeClass("odd even")
				.filter(":even")
				.addClass("odd")
				.end()
				.filter(":odd")
				.addClass("even");
		},
		update_build_id(ajax, response, status) {
			document
				.querySelectorAll(`input[name="form_build_id"][value="${response.old}"]`)
				.forEach((item) => {
					item.value = response.new;
				});
		},
		add_css(ajax, response, status) {
			const allUniqueBundleIds = response.data.map(function (style) {
				const uniqueBundleId = style.href;
				if (!loadjs.isDefined(uniqueBundleId))
					loadjs(`css!${style.href}`, uniqueBundleId, {
						before(path, styleEl) {
							Object.keys(style).forEach((attributeKey) => {
								styleEl.setAttribute(attributeKey, style[attributeKey]);
							});
						},
					});
				return uniqueBundleId;
			});
			return new Promise((resolve, reject) => {
				loadjs.ready(allUniqueBundleIds, {
					success() {
						resolve();
					},
					error(depsNotFound) {
						const message = Drupal.t(`The following files could not be loaded: @dependencies`, {
							"@dependencies": depsNotFound.join(", "),
						});
						reject(message);
					},
				});
			});
		},
		message(ajax, response) {
			const messages = new Drupal.Message(
				document.querySelector(response.messageWrapperQuerySelector)
			);
			if (response.clearPrevious) messages.clear();
			messages.add(response.message, response.messageOptions);
		},
		add_js(ajax, response, status) {
			const parentEl = document.querySelector(response.selector || "body");
			const settings = ajax.settings || drupalSettings;
			const allUniqueBundleIds = response.data.map((script) => {
				const uniqueBundleId = script.src;
				if (!loadjs.isDefined(uniqueBundleId))
					loadjs(script.src, uniqueBundleId, {
						async: false,
						before(path, scriptEl) {
							Object.keys(script).forEach((attributeKey) => {
								scriptEl.setAttribute(attributeKey, script[attributeKey]);
							});
							parentEl.appendChild(scriptEl);
							return false;
						},
					});
				return uniqueBundleId;
			});
			return new Promise((resolve, reject) => {
				loadjs.ready(allUniqueBundleIds, {
					success() {
						Drupal.attachBehaviors(parentEl, settings);
						resolve();
					},
					error(depsNotFound) {
						const message = Drupal.t(`The following files could not be loaded: @dependencies`, {
							"@dependencies": depsNotFound.join(", "),
						});
						reject(message);
					},
				});
			});
		},
		scrollTop(ajax, response) {
			document.querySelector(response.selector)?.scrollIntoView();
		},
	};
	const stopEvent = (xhr, settings) => {
		return (
			xhr.getResponseHeader("X-Drupal-Ajax-Token") === "1" &&
			typeof settings.isInProgress === "function" &&
			settings.isInProgress()
		);
	};
	$.extend(true, $.event.special, {
		ajaxSuccess: {
			trigger(event, xhr, settings) {
				if (stopEvent(xhr, settings)) return false;
			},
		},
		ajaxComplete: {
			trigger(event, xhr, settings) {
				if (stopEvent(xhr, settings)) {
					$.active++;
					return false;
				}
			},
		},
	});
})(jQuery, window, Drupal, drupalSettings, loadjs, window.tabbable);
(function (Drupal) {
	Drupal.theme.ajaxProgressBar = function ($element) {
		return $element.addClass("ajax-progress ajax-progress-bar");
	};
})(Drupal);
!(function (n, t) {
	"use strict";
	t &&
		(t.prototype.gtmEventSend = function (t, e) {
			n.bnee_gtm.send(e.event, { ...e.data });
		});
})((jQuery, Drupal), Drupal.AjaxCommands);
!(function (o, l) {
	"use strict";
	((l.bnee_gtm = {}),
		(window.dataLayer = window.dataLayer || []),
		o(document).on("click", ".has-gtm-event", function () {
			var e = o(this);
			l.bnee_gtm.send(e.data("gtm-event"), e.data("gtm-vars"));
		}),
		o(".page-cta--newsletter > button").click(function () {
			l.bnee_gtm.send("newsletter-popin-click", { "button-type": "Floating cta" });
		}),
		o(".view-newsletter.view-display-id-block_1 .js-newsletter-modal-opener").click(function () {
			l.bnee_gtm.send("newsletter-popin-click", { "button-type": "Banner Game Page" });
		}),
		o(".view-newsletter.view-display-id-block_3 .js-newsletter-modal-opener").click(function () {
			l.bnee_gtm.send("newsletter-popin-click", { "button-type": "News Sidebar" });
		}),
		o(".view-downloadable-asset a").click(function () {
			l.bnee_gtm.send("media-download", {});
		}),
		o(".intro-video__link").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Header",
			});
		}),
		o(".event-highlight__infos-cta").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Event Banner",
			});
		}),
		o(".join-the-club__cta").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Ep!c Banner",
			});
		}),
		o(".store__cta").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Store Banner",
			});
		}),
		o(".how-to-get-points__item-link").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Get Points Banner",
			});
		}),
		o(".beta__cta").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Closed Beta Banner",
			});
		}),
		o(".next-releases__highlight-link").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Last Release Banner",
			});
		}),
		o(".next-releases__link").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "Next Releases Banner",
			});
		}),
		o(".news-carousel__cta").click(function () {
			let e = o(this);
			l.bnee_gtm.send("corpo-section-click", {
				"cta-name": e.text(),
				site: e.attr("href"),
				"section-name": "News Banner",
			});
		}),
		o(".js-retailer-edition").each((e, t) => {
			const n = o(t),
				a = n.find(".js-retailer-edition__title").data("edition");
			n.find(".js-retailer-edition__cta").click(function () {
				var e = o(".js-block-retailers__platform.checked input").val(),
					t = o(".js-block-retailers__country-select option:selected").text(),
					n = o(this).data("gtm-title");
				l.bnee_gtm.send("buy-click", { platform: e, country: t, edition: a, "click-type": n });
			});
		}),
		o(document).on("click", "a.js-retailer-modal__retailer", function () {
			var e = o(this).find(".js-retailer-modal__retailer-name").text().toLowerCase().trim(),
				t = o(".js-block-retailers__platform.checked input").val(),
				n = o(".js-block-retailers__country-select option:selected").text(),
				a = o(".js-retailer-modal").data("edition");
			l.bnee_gtm.send("retailer-click", {
				platform: t,
				country: n,
				edition: a,
				"retailer-name": e,
			});
		}),
		o(document).on("click", ".node__thumbnail__page a", function () {
			var e = o(this);
			l.bnee_gtm.send("page-click", {
				"page-name": e.find("h3").text(),
				"section-name": "Pages List",
			});
		}),
		o(document).on("click", ".js-related-title-teaser .views-row a", function () {
			var e = "See more";
			(o(this).hasClass("shop") && (e = "Buy"),
				l.bnee_gtm.send("news-game-click", { "click-type": e }));
		}),
		o(document).on("click", ".js-vote-like__cta", function () {
			l.bnee_gtm.send("news-action-click", { "action-name": "Like" });
		}),
		o(document).on("click", ".js-movies-catalog__article-link", function () {
			var e = o(this).data("cta-name") || "";
			const t = o(this).parents(".js-movies-catalog__article");
			var n = t.data("film-name") || "",
				a = t.data("content-category") || "",
				i = t.data("brand") || "";
			l.bnee_gtm.send("film-click", {
				"film-name": n,
				brand: i,
				contentCategory: a,
				pageCategory: "Films",
				"cta-name": e,
			});
		}),
		o(document).on("click", ".js-hero-banner__link-actions-cta", function () {
			var e = o(this).data("cta-name") || "";
			const t = o(this).parents(".js-hero-banner__article");
			var n = t.hasClass("js-hero-banner__article--films-entry-details")
					? "header-film-details-click"
					: "header-film-click",
				a = t.hasClass("js-hero-banner__article--films-entry-details")
					? "Films entry details"
					: "Films",
				i = t.data("film-name") || "",
				c = t.data("brand") || "",
				s = t.data("content-category") || "";
			l.bnee_gtm.send(n, {
				"film-name": i,
				brand: c,
				contentCategory: s,
				pageCategory: a,
				"cta-name": e,
			});
		}),
		o(document).on("click", ".js-hero-banner__visuals-cta-video-fullscreen", function () {
			const e = o(this).parents(".js-hero-banner__article");
			var t = e.hasClass("js-hero-banner__article--films-entry-details")
					? "header-video-film-details-click"
					: "header-video-film-click",
				n = e.hasClass("js-hero-banner__article--films-entry-details")
					? "Films entry details"
					: "Films",
				a = e.data("film-name") || "",
				i = e.data("brand") || "",
				c = e.data("content-category") || "";
			l.bnee_gtm.send(t, { "film-name": a, brand: i, contentCategory: c, pageCategory: n });
		}),
		o(document).on("click", ".js-episode__cta", function () {
			var e = o(this).data("cta-name") || "";
			const t = o(this).closest(".episode__item-content") || "",
				n = o("article[data-film-name]") || "";
			var a = n.data("film-name") || "",
				i = n.data("brand") || "",
				c = n.data("content-category") || "",
				s = t.data("item-name") || "";
			l.bnee_gtm.send("film-entry-details-click", {
				"film-name": a,
				brand: i,
				contentCategory: c,
				pageCategory: "Films entry details",
				"cta-name": e,
				"item-name": s,
			});
		}),
		(l.bnee_gtm.send = function (e, t) {
			return window.dataLayer.push({ event: e, ...t });
		}));
})(jQuery, Drupal, drupalSettings);
!(function (v, e, t) {
	"use strict";
	e.behaviors.bneeSearchApiAutocomplete = {
		extraFetched: !1,
		attach: (e) => {
			v(t("bneeSearchApiAutocompleteBehavior", "#js-search-menu", e)).each(function () {
				const t = v(this),
					n = document.documentElement,
					e = document.getElementById("js-button-toggle-search-menu"),
					s = document.getElementById("js-search-menu"),
					c = document.getElementById("js-header__nav"),
					o = document.getElementById("js-search-menu__overlay"),
					a = s.querySelector('input[data-drupal-selector="edit-query"]');
				let i = !1,
					u,
					l;
				var r = t.find("#edit-query"),
					d = t.find("#edit-query--2"),
					m = t.find("#edit-query--3"),
					h = t.find("#js-search-menu__autocomplete");
				const p = t.find("#js-search-menu__quick-links");
				function f(e) {
					e.value = "";
				}
				function _() {
					(p.removeClass("js-search-menu__quick-links--visible"),
						p.addClass("js-search-menu__quick-links--hidden"));
				}
				function g() {
					c && c.classList.remove("js-header__nav--hidden");
				}
				function j() {
					((i = !i),
						e.setAttribute("aria-expanded", i),
						n.classList.toggle("js-html-header--overflow-visible"),
						n.classList.toggle("js-html-header__search-menu--opened"),
						u && n.classList.toggle("js-html--no-scroll"),
						!0 === i
							? setTimeout(function () {
									a.focus();
								}, 300)
							: (f(a), _(), g()));
				}
				(0 < r.length ? (l = r) : 0 < d.length ? (l = d) : 0 < m.length && (l = m),
					v.widget("custom.typecomplete", v.ui.autocomplete, {
						options: { highlightClass: "ui-autocomplete-highlight" },
						_renderItem: function (e, t) {
							var n = new RegExp("(" + this.term + ")", "gi"),
								s = this.options.highlightClass,
								s = t.label.replace(n, "<span class='" + s + "'>$1</span>"),
								e = v("<li/>").appendTo(e);
							return (
								v("<a/>")
									.attr("href", t.url)
									.attr("class", "has-gtm-event")
									.attr("data-gtm-event", "corpo-search-result-click")
									.attr(
										"data-gtm-vars",
										'{"category-type":"' + t.gtmType + '","content-name":"' + t.label + '"}'
									)
									.html(s)
									.appendTo(e),
								e
							);
						},
						_create: function () {
							(this._super(),
								this.widget().menu("option", "items", "> :not(.ui-autocomplete-type)"));
						},
						_renderMenu: function (s, e) {
							var c = this,
								o = "";
							(_(),
								v.each(e, function (e, t) {
									var n;
									(t.type != o &&
										(s.append("<li class='ui-autocomplete-type'>" + t.type + "</li>"),
										(o = t.type)),
										(n = c._renderItemData(s, t)),
										t.type && n.attr("aria-label", t.type + " : " + t.label));
								}));
						},
					}),
					l.typecomplete({
						appendTo: h,
						delay: 200,
						minLength: 2,
						source: function (e, t) {
							v.ajax({
								url: "/bnee_search_api_autocomplete/" + e.term,
								dataType: "json",
								success: function (e) {
									t(e);
								},
							});
						},
					}),
					e.addEventListener("click", function () {
						j();
					}),
					o.addEventListener("click", function () {
						j();
					}),
					l.focusin(function () {
						(p.removeClass("js-search-menu__quick-links--hidden"),
							p.addClass("js-search-menu__quick-links--visible"),
							u && c && c.classList.add("js-header__nav--hidden"));
					}),
					enquire.register("screen and (max-width: 991px)", {
						match: function () {
							((u = !0),
								l.off("focusout.searchMenuAutocompleteInputDesktop"),
								n.classList.contains("js-html-header__search-menu--opened") &&
									n.classList.add("js-html--no-scroll"),
								l.on("focusout.searchMenuAutocompleteInputMobile", function () {
									v(document).on("click.document-click", function (e) {
										(f(a),
											0 === v(e.target).closest(t).length &&
												(g(),
												p.hasClass("js-search-menu__quick-links--visible") && _(),
												n.classList.contains("js-html-header__search-menu--opened") && j()),
											v(document).off(".document-click"));
									});
								}));
						},
					}),
					enquire.register("screen and (min-width: 992px)", {
						match: function () {
							((u = !1),
								l.off("focusout.searchMenuAutocompleteInputMobile"),
								n.classList.contains("js-html-header__search-menu--opened") &&
									n.classList.remove("js-html--no-scroll"),
								g(),
								l.on("focusout.searchMenuAutocompleteInputDesktop", function () {
									v(document).on("click.document-click", function (e) {
										0 === v(e.target).closest(t).length &&
											(_(), j(), v(document).off(".document-click"));
									});
								}));
						},
					}));
			});
		},
	};
})(jQuery, Drupal, once);
/* @license GPL-2.0-or-later https://raw.githubusercontent.com/jquery-form/form/master/LICENSE */
(function (factory) {
	if (typeof define === "function" && define.amd) define(["jquery"], factory);
	else if (typeof module === "object" && module.exports)
		module.exports = function (root, jQuery) {
			if (typeof jQuery === "undefined")
				if (typeof window !== "undefined") jQuery = require("jquery");
				else jQuery = require("jquery")(root);
			factory(jQuery);
			return jQuery;
		};
	else factory(jQuery);
})(function ($) {
	"use strict";
	var rCRLF = /\r?\n/g;
	var feature = {};
	feature.fileapi = $('<input type="file">').get(0).files !== undefined;
	feature.formdata = typeof window.FormData !== "undefined";
	var hasProp = !!$.fn.prop;
	$.fn.attr2 = function () {
		if (!hasProp) return this.attr.apply(this, arguments);
		var val = this.prop.apply(this, arguments);
		if ((val && val.jquery) || typeof val === "string") return val;
		return this.attr.apply(this, arguments);
	};
	$.fn.ajaxSubmit = function (options, data, dataType, onSuccess) {
		if (!this.length) {
			log("ajaxSubmit: skipping submit process - no element selected");
			return this;
		}
		var method,
			action,
			url,
			isMsie,
			iframeSrc,
			$form = this;
		if (typeof options === "function") options = { success: options };
		else if (typeof options === "string" || (options === false && arguments.length > 0)) {
			options = { url: options, data: data, dataType: dataType };
			if (typeof onSuccess === "function") options.success = onSuccess;
		} else {
			if (typeof options === "undefined") options = {};
		}
		method = options.method || options.type || this.attr2("method");
		action = options.url || this.attr2("action");
		url = typeof action === "string" ? action.trim() : "";
		url = url || window.location.href || "";
		if (url) url = (url.match(/^([^#]+)/) || [])[1];
		isMsie = /(MSIE|Trident)/.test(navigator.userAgent || "");
		iframeSrc =
			isMsie && /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank";
		options = $.extend(
			true,
			{ url, success: $.ajaxSettings.success, type: method || $.ajaxSettings.type, iframeSrc },
			options
		);
		var veto = {};
		this.trigger("form-pre-serialize", [this, options, veto]);
		if (veto.veto) {
			log("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
			return this;
		}
		if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
			log("ajaxSubmit: submit aborted via beforeSerialize callback");
			return this;
		}
		var traditional = options.traditional;
		if (typeof traditional === "undefined") traditional = $.ajaxSettings.traditional;
		var elements = [];
		var qx,
			a = this.formToArray(options.semantic, elements, options.filtering);
		if (options.data) {
			var optionsData = typeof options.data === "function" ? options.data(a) : options.data;
			options.extraData = optionsData;
			qx = $.param(optionsData, traditional);
		}
		if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
			log("ajaxSubmit: submit aborted via beforeSubmit callback");
			return this;
		}
		this.trigger("form-submit-validate", [a, this, options, veto]);
		if (veto.veto) {
			log("ajaxSubmit: submit vetoed via form-submit-validate trigger");
			return this;
		}
		var q = $.param(a, traditional);
		if (qx) q = q ? q + "&" + qx : qx;
		if (options.type.toUpperCase() === "GET") {
			options.url += (options.url.indexOf("?") >= 0 ? "&" : "?") + q;
			options.data = null;
		} else options.data = q;
		var callbacks = [];
		if (options.resetForm)
			callbacks.push(function () {
				$form.resetForm();
			});
		if (options.clearForm)
			callbacks.push(function () {
				$form.clearForm(options.includeHidden);
			});
		if (!options.dataType && options.target) {
			var oldSuccess = options.success || function () {};
			callbacks.push(function (data, textStatus, jqXHR) {
				var successArguments = arguments,
					fn = options.replaceTarget ? "replaceWith" : "html";
				$(options.target)
					[fn](data)
					.each(function () {
						oldSuccess.apply(this, successArguments);
					});
			});
		} else {
			if (options.success)
				if (Array.isArray(options.success)) callbacks = callbacks.concat(options.success);
				else callbacks.push(options.success);
		}
		options.success = function (data, status, xhr) {
			var context = options.context || this;
			for (var i = 0, max = callbacks.length; i < max; i++)
				callbacks[i].apply(context, [data, status, xhr || $form, $form]);
		};
		if (options.error) {
			var oldError = options.error;
			options.error = function (xhr, status, error) {
				var context = options.context || this;
				oldError.apply(context, [xhr, status, error, $form]);
			};
		}
		if (options.complete) {
			var oldComplete = options.complete;
			options.complete = function (xhr, status) {
				var context = options.context || this;
				oldComplete.apply(context, [xhr, status, $form]);
			};
		}
		var fileInputs = $("input[type=file]:enabled", this).filter(function () {
			return $(this).val() !== "";
		});
		var hasFileInputs = fileInputs.length > 0;
		var mp = "multipart/form-data";
		var multipart = $form.attr("enctype") === mp || $form.attr("encoding") === mp;
		var fileAPI = feature.fileapi && feature.formdata;
		log("fileAPI :" + fileAPI);
		var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;
		var jqxhr;
		if (options.iframe !== false && (options.iframe || shouldUseFrame))
			if (options.closeKeepAlive)
				$.get(options.closeKeepAlive, function () {
					jqxhr = fileUploadIframe(a);
				});
			else jqxhr = fileUploadIframe(a);
		else if ((hasFileInputs || multipart) && fileAPI) jqxhr = fileUploadXhr(a);
		else jqxhr = $.ajax(options);
		$form.removeData("jqxhr").data("jqxhr", jqxhr);
		for (var k = 0; k < elements.length; k++) elements[k] = null;
		this.trigger("form-submit-notify", [this, options]);
		return this;
		function deepSerialize(extraData) {
			var serialized = $.param(extraData, options.traditional).split("&");
			var len = serialized.length;
			var result = [];
			var i, part;
			for (i = 0; i < len; i++) {
				serialized[i] = serialized[i].replace(/\+/g, " ");
				part = serialized[i].split("=");
				result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
			}
			return result;
		}
		function fileUploadXhr(a) {
			var formdata = new FormData();
			for (var i = 0; i < a.length; i++) formdata.append(a[i].name, a[i].value);
			if (options.extraData) {
				var serializedData = deepSerialize(options.extraData);
				for (i = 0; i < serializedData.length; i++)
					if (serializedData[i]) formdata.append(serializedData[i][0], serializedData[i][1]);
			}
			options.data = null;
			var s = $.extend(true, {}, $.ajaxSettings, options, {
				contentType: false,
				processData: false,
				cache: false,
				type: method || "POST",
			});
			if (options.uploadProgress)
				s.xhr = function () {
					var xhr = $.ajaxSettings.xhr();
					if (xhr.upload)
						xhr.upload.addEventListener(
							"progress",
							function (event) {
								var percent = 0;
								var position = event.loaded || event.position;
								var total = event.total;
								if (event.lengthComputable) percent = Math.ceil((position / total) * 100);
								options.uploadProgress(event, position, total, percent);
							},
							false
						);
					return xhr;
				};
			s.data = null;
			var beforeSend = s.beforeSend;
			s.beforeSend = function (xhr, o) {
				if (options.formData) o.data = options.formData;
				else o.data = formdata;
				if (beforeSend) beforeSend.call(this, xhr, o);
			};
			return $.ajax(s);
		}
		function fileUploadIframe(a) {
			var form = $form[0],
				el,
				i,
				s,
				g,
				id,
				$io,
				io,
				xhr,
				sub,
				n,
				timedOut,
				timeoutHandle;
			var deferred = $.Deferred();
			deferred.abort = function (status) {
				xhr.abort(status);
			};
			if (a)
				for (i = 0; i < elements.length; i++) {
					el = $(elements[i]);
					if (hasProp) el.prop("disabled", false);
					else el.removeAttr("disabled");
				}
			s = $.extend(true, {}, $.ajaxSettings, options);
			s.context = s.context || s;
			id = "jqFormIO" + new Date().getTime();
			var ownerDocument = form.ownerDocument;
			var $body = $form.closest("body");
			if (s.iframeTarget) {
				$io = $(s.iframeTarget, ownerDocument);
				n = $io.attr2("name");
				if (!n) $io.attr2("name", id);
				else id = n;
			} else {
				$io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />', ownerDocument);
				$io.css({ position: "absolute", top: "-1000px", left: "-1000px" });
			}
			io = $io[0];
			xhr = {
				aborted: 0,
				responseText: null,
				responseXML: null,
				status: 0,
				statusText: "n/a",
				getAllResponseHeaders: function () {},
				getResponseHeader: function () {},
				setRequestHeader: function () {},
				abort: function (status) {
					var e = status === "timeout" ? "timeout" : "aborted";
					log("aborting upload... " + e);
					this.aborted = 1;
					try {
						if (io.contentWindow.document.execCommand)
							io.contentWindow.document.execCommand("Stop");
					} catch (ignore) {}
					$io.attr("src", s.iframeSrc);
					xhr.error = e;
					if (s.error) s.error.call(s.context, xhr, e, status);
					if (g) $.event.trigger("ajaxError", [xhr, s, e]);
					if (s.complete) s.complete.call(s.context, xhr, e);
				},
			};
			g = s.global;
			if (g && $.active++ === 0) $.event.trigger("ajaxStart");
			if (g) $.event.trigger("ajaxSend", [xhr, s]);
			if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
				if (s.global) $.active--;
				deferred.reject();
				return deferred;
			}
			if (xhr.aborted) {
				deferred.reject();
				return deferred;
			}
			sub = form.clk;
			if (sub) {
				n = sub.name;
				if (n && !sub.disabled) {
					s.extraData = s.extraData || {};
					s.extraData[n] = sub.value;
					if (sub.type === "image") {
						s.extraData[n + ".x"] = form.clk_x;
						s.extraData[n + ".y"] = form.clk_y;
					}
				}
			}
			var CLIENT_TIMEOUT_ABORT = 1;
			var SERVER_ABORT = 2;
			function getDoc(frame) {
				var doc = null;
				try {
					if (frame.contentWindow) doc = frame.contentWindow.document;
				} catch (err) {
					log("cannot get iframe.contentWindow document: " + err);
				}
				if (doc) return doc;
				try {
					doc = frame.contentDocument ? frame.contentDocument : frame.document;
				} catch (err) {
					log("cannot get iframe.contentDocument: " + err);
					doc = frame.document;
				}
				return doc;
			}
			var csrf_token = $("meta[name=csrf-token]").attr("content");
			var csrf_param = $("meta[name=csrf-param]").attr("content");
			if (csrf_param && csrf_token) {
				s.extraData = s.extraData || {};
				s.extraData[csrf_param] = csrf_token;
			}
			function doSubmit() {
				var t = $form.attr2("target"),
					a = $form.attr2("action"),
					mp = "multipart/form-data",
					et = $form.attr("enctype") || $form.attr("encoding") || mp;
				form.setAttribute("target", id);
				if (!method || /post/i.test(method)) form.setAttribute("method", "POST");
				if (a !== s.url) form.setAttribute("action", s.url);
				if (!s.skipEncodingOverride && (!method || /post/i.test(method)))
					$form.attr({ encoding: "multipart/form-data", enctype: "multipart/form-data" });
				if (s.timeout)
					timeoutHandle = setTimeout(function () {
						timedOut = true;
						cb(CLIENT_TIMEOUT_ABORT);
					}, s.timeout);
				function checkState() {
					try {
						var state = getDoc(io).readyState;
						log("state = " + state);
						if (state && state.toLowerCase() === "uninitialized") setTimeout(checkState, 50);
					} catch (e) {
						log("Server abort: ", e, " (", e.name, ")");
						cb(SERVER_ABORT);
						if (timeoutHandle) clearTimeout(timeoutHandle);
						timeoutHandle = undefined;
					}
				}
				var extraInputs = [];
				try {
					if (s.extraData)
						for (var n in s.extraData)
							if (s.extraData.hasOwnProperty(n))
								if (
									$.isPlainObject(s.extraData[n]) &&
									s.extraData[n].hasOwnProperty("name") &&
									s.extraData[n].hasOwnProperty("value")
								)
									extraInputs.push(
										$('<input type="hidden" name="' + s.extraData[n].name + '">', ownerDocument)
											.val(s.extraData[n].value)
											.appendTo(form)[0]
									);
								else
									extraInputs.push(
										$('<input type="hidden" name="' + n + '">', ownerDocument)
											.val(s.extraData[n])
											.appendTo(form)[0]
									);
					if (!s.iframeTarget) $io.appendTo($body);
					if (io.attachEvent) io.attachEvent("onload", cb);
					else io.addEventListener("load", cb, false);
					setTimeout(checkState, 15);
					try {
						form.submit();
					} catch (err) {
						var submitFn = document.createElement("form").submit;
						submitFn.apply(form);
					}
				} finally {
					form.setAttribute("action", a);
					form.setAttribute("enctype", et);
					if (t) form.setAttribute("target", t);
					else $form.removeAttr("target");
					$(extraInputs).remove();
				}
			}
			if (s.forceSync) doSubmit();
			else setTimeout(doSubmit, 10);
			var data,
				doc,
				domCheckCount = 50,
				callbackProcessed;
			function cb(e) {
				if (xhr.aborted || callbackProcessed) return;
				doc = getDoc(io);
				if (!doc) {
					log("cannot access response document");
					e = SERVER_ABORT;
				}
				if (e === CLIENT_TIMEOUT_ABORT && xhr) {
					xhr.abort("timeout");
					deferred.reject(xhr, "timeout");
					return;
				}
				if (e === SERVER_ABORT && xhr) {
					xhr.abort("server abort");
					deferred.reject(xhr, "error", "server abort");
					return;
				}
				if (!doc || doc.location.href === s.iframeSrc) if (!timedOut) return;
				if (io.detachEvent) io.detachEvent("onload", cb);
				else io.removeEventListener("load", cb, false);
				var status = "success",
					errMsg;
				try {
					if (timedOut) throw "timeout";
					var isXml = s.dataType === "xml" || doc.XMLDocument || $.isXMLDoc(doc);
					log("isXml=" + isXml);
					if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML))
						if (--domCheckCount) {
							log("requeing onLoad callback, DOM not available");
							setTimeout(cb, 250);
							return;
						}
					var docRoot = doc.body ? doc.body : doc.documentElement;
					xhr.responseText = docRoot ? docRoot.innerHTML : null;
					xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
					if (isXml) s.dataType = "xml";
					xhr.getResponseHeader = function (header) {
						var headers = { "content-type": s.dataType };
						return headers[header.toLowerCase()];
					};
					if (docRoot) {
						xhr.status = Number(docRoot.getAttribute("status")) || xhr.status;
						xhr.statusText = docRoot.getAttribute("statusText") || xhr.statusText;
					}
					var dt = (s.dataType || "").toLowerCase();
					var scr = /(json|script|text)/.test(dt);
					if (scr || s.textarea) {
						var ta = doc.getElementsByTagName("textarea")[0];
						if (ta) {
							xhr.responseText = ta.value;
							xhr.status = Number(ta.getAttribute("status")) || xhr.status;
							xhr.statusText = ta.getAttribute("statusText") || xhr.statusText;
						} else {
							if (scr) {
								var pre = doc.getElementsByTagName("pre")[0];
								var b = doc.getElementsByTagName("body")[0];
								if (pre) xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
								else {
									if (b) xhr.responseText = b.textContent ? b.textContent : b.innerText;
								}
							}
						}
					} else {
						if (dt === "xml" && !xhr.responseXML && xhr.responseText)
							xhr.responseXML = toXml(xhr.responseText);
					}
					try {
						data = httpData(xhr, dt, s);
					} catch (err) {
						status = "parsererror";
						xhr.error = errMsg = err || status;
					}
				} catch (err) {
					log("error caught: ", err);
					status = "error";
					xhr.error = errMsg = err || status;
				}
				if (xhr.aborted) {
					log("upload aborted");
					status = null;
				}
				if (xhr.status)
					status =
						(xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 ? "success" : "error";
				if (status === "success") {
					if (s.success) s.success.call(s.context, data, "success", xhr);
					deferred.resolve(xhr.responseText, "success", xhr);
					if (g) $.event.trigger("ajaxSuccess", [xhr, s]);
				} else {
					if (status) {
						if (typeof errMsg === "undefined") errMsg = xhr.statusText;
						if (s.error) s.error.call(s.context, xhr, status, errMsg);
						deferred.reject(xhr, "error", errMsg);
						if (g) $.event.trigger("ajaxError", [xhr, s, errMsg]);
					}
				}
				if (g) $.event.trigger("ajaxComplete", [xhr, s]);
				if (g && !--$.active) $.event.trigger("ajaxStop");
				if (s.complete) s.complete.call(s.context, xhr, status);
				callbackProcessed = true;
				if (s.timeout) clearTimeout(timeoutHandle);
				setTimeout(function () {
					if (!s.iframeTarget) $io.remove();
					else $io.attr("src", s.iframeSrc);
					xhr.responseXML = null;
				}, 100);
			}
			var toXml =
				$.parseXML ||
				function (s, doc) {
					if (window.ActiveXObject) {
						doc = new ActiveXObject("Microsoft.XMLDOM");
						doc.async = "false";
						doc.loadXML(s);
					} else doc = new DOMParser().parseFromString(s, "text/xml");
					return doc && doc.documentElement && doc.documentElement.nodeName !== "parsererror"
						? doc
						: null;
				};
			var httpData = function (xhr, type, s) {
				var ct = xhr.getResponseHeader("content-type") || "",
					xml = (type === "xml" || !type) && ct.indexOf("xml") >= 0,
					data = xml ? xhr.responseXML : xhr.responseText;
				if (xml && data.documentElement.nodeName === "parsererror")
					if ($.error) $.error("parsererror");
				if (s && s.dataFilter) data = s.dataFilter(data, type);
				if (typeof data === "string")
					if ((type === "json" || !type) && ct.indexOf("json") >= 0) data = JSON.parse(data);
					else {
						if ((type === "script" || !type) && ct.indexOf("javascript") >= 0) $.globalEval(data);
					}
				return data;
			};
			return deferred;
		}
	};
	$.fn.ajaxForm = function (options, data, dataType, onSuccess) {
		if (typeof options === "string" || (options === false && arguments.length > 0)) {
			options = { url: options, data: data, dataType: dataType };
			if (typeof onSuccess === "function") options.success = onSuccess;
		}
		options = options || {};
		options.delegation = options.delegation && typeof $.fn.on === "function";
		if (!options.delegation && this.length === 0) {
			var o = { s: this.selector, c: this.context };
			if (!$.isReady && o.s) {
				log("DOM not ready, queuing ajaxForm");
				$(function () {
					$(o.s, o.c).ajaxForm(options);
				});
				return this;
			}
			log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
			return this;
		}
		if (options.delegation) {
			$(document)
				.off("submit.form-plugin", this.selector, doAjaxSubmit)
				.off("click.form-plugin", this.selector, captureSubmittingElement)
				.on("submit.form-plugin", this.selector, options, doAjaxSubmit)
				.on("click.form-plugin", this.selector, options, captureSubmittingElement);
			return this;
		}
		if (options.beforeFormUnbind) options.beforeFormUnbind(this, options);
		return this.ajaxFormUnbind()
			.on("submit.form-plugin", options, doAjaxSubmit)
			.on("click.form-plugin", options, captureSubmittingElement);
	};
	function doAjaxSubmit(e) {
		var options = e.data;
		if (!e.isDefaultPrevented()) {
			e.preventDefault();
			$(e.target).closest("form").ajaxSubmit(options);
		}
	}
	function captureSubmittingElement(e) {
		var target = e.target;
		var $el = $(target);
		if (!$el.is("[type=submit],[type=image]")) {
			var t = $el.closest("[type=submit]");
			if (t.length === 0) return;
			target = t[0];
		}
		var form = target.form;
		form.clk = target;
		if (target.type === "image")
			if (typeof e.offsetX !== "undefined") {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset === "function") {
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		setTimeout(function () {
			form.clk = form.clk_x = form.clk_y = null;
		}, 100);
	}
	$.fn.ajaxFormUnbind = function () {
		return this.off("submit.form-plugin click.form-plugin");
	};
	$.fn.formToArray = function (semantic, elements, filtering) {
		var a = [];
		if (this.length === 0) return a;
		var form = this[0];
		var formId = this.attr("id");
		var els =
			semantic || typeof form.elements === "undefined"
				? form.getElementsByTagName("*")
				: form.elements;
		var els2;
		if (els) els = $.makeArray(els);
		if (formId && (semantic || /(Edge|Trident)\//.test(navigator.userAgent))) {
			els2 = $(':input[form="' + formId + '"]').get();
			if (els2.length) els = (els || []).concat(els2);
		}
		if (!els || !els.length) return a;
		if (typeof filtering === "function") els = $.map(els, filtering);
		var i, j, n, v, el, max, jmax;
		for (i = 0, max = els.length; i < max; i++) {
			el = els[i];
			n = el.name;
			if (!n || el.disabled) continue;
			if (semantic && form.clk && el.type === "image") {
				if (form.clk === el) {
					a.push({ name: n, value: $(el).val(), type: el.type });
					a.push({ name: n + ".x", value: form.clk_x }, { name: n + ".y", value: form.clk_y });
				}
				continue;
			}
			v = $.fieldValue(el, true);
			if (v && v.constructor === Array) {
				if (elements) elements.push(el);
				for (j = 0, jmax = v.length; j < jmax; j++) a.push({ name: n, value: v[j] });
			} else if (feature.fileapi && el.type === "file") {
				if (elements) elements.push(el);
				var files = el.files;
				if (files.length)
					for (j = 0; j < files.length; j++) a.push({ name: n, value: files[j], type: el.type });
				else a.push({ name: n, value: "", type: el.type });
			} else {
				if (v !== null && typeof v !== "undefined") {
					if (elements) elements.push(el);
					a.push({ name: n, value: v, type: el.type, required: el.required });
				}
			}
		}
		if (!semantic && form.clk) {
			var $input = $(form.clk),
				input = $input[0];
			n = input.name;
			if (n && !input.disabled && input.type === "image") {
				a.push({ name: n, value: $input.val() });
				a.push({ name: n + ".x", value: form.clk_x }, { name: n + ".y", value: form.clk_y });
			}
		}
		return a;
	};
	$.fn.formSerialize = function (semantic) {
		return $.param(this.formToArray(semantic));
	};
	$.fn.fieldSerialize = function (successful) {
		var a = [];
		this.each(function () {
			var n = this.name;
			if (!n) return;
			var v = $.fieldValue(this, successful);
			if (v && v.constructor === Array)
				for (var i = 0, max = v.length; i < max; i++) a.push({ name: n, value: v[i] });
			else {
				if (v !== null && typeof v !== "undefined") a.push({ name: this.name, value: v });
			}
		});
		return $.param(a);
	};
	$.fn.fieldValue = function (successful) {
		for (var val = [], i = 0, max = this.length; i < max; i++) {
			var el = this[i];
			var v = $.fieldValue(el, successful);
			if (v === null || typeof v === "undefined" || (v.constructor === Array && !v.length))
				continue;
			if (Array.isArray(v)) val = val.concat(v);
			else val.push(v);
		}
		return val;
	};
	$.fieldValue = function (el, successful) {
		var n = el.name,
			t = el.type,
			tag = el.tagName.toLowerCase();
		if (typeof successful === "undefined") successful = true;
		if (
			successful &&
			(!n ||
				el.disabled ||
				t === "reset" ||
				t === "button" ||
				((t === "checkbox" || t === "radio") && !el.checked) ||
				((t === "submit" || t === "image") && el.form && el.form.clk !== el) ||
				(tag === "select" && el.selectedIndex === -1))
		)
			return null;
		if (tag === "select") {
			var index = el.selectedIndex;
			if (index < 0) return null;
			var a = [],
				ops = el.options;
			var one = t === "select-one";
			var max = one ? index + 1 : ops.length;
			for (var i = one ? index : 0; i < max; i++) {
				var op = ops[i];
				if (op.selected && !op.disabled) {
					var v = op.value;
					if (!v)
						v =
							op.attributes && op.attributes.value && !op.attributes.value.specified
								? op.text
								: op.value;
					if (one) return v;
					a.push(v);
				}
			}
			return a;
		}
		return $(el).val().replace(rCRLF, "\r\n");
	};
	$.fn.clearForm = function (includeHidden) {
		return this.each(function () {
			$("input,select,textarea", this).clearFields(includeHidden);
		});
	};
	$.fn.clearFields = $.fn.clearInputs = function (includeHidden) {
		var re =
			/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
		return this.each(function () {
			var t = this.type,
				tag = this.tagName.toLowerCase();
			if (re.test(t) || tag === "textarea") this.value = "";
			else if (t === "checkbox" || t === "radio") this.checked = false;
			else if (tag === "select") this.selectedIndex = -1;
			else if (t === "file")
				if (/MSIE/.test(navigator.userAgent)) $(this).replaceWith($(this).clone(true));
				else $(this).val("");
			else {
				if (includeHidden)
					if (
						(includeHidden === true && /hidden/.test(t)) ||
						(typeof includeHidden === "string" && $(this).is(includeHidden))
					)
						this.value = "";
			}
		});
	};
	$.fn.resetForm = function () {
		return this.each(function () {
			var el = $(this);
			var tag = this.tagName.toLowerCase();
			switch (tag) {
				case "input":
					this.checked = this.defaultChecked;
				case "textarea":
					this.value = this.defaultValue;
					return true;
				case "option":
				case "optgroup":
					var select = el.parents("select");
					if (select.length && select[0].multiple)
						if (tag === "option") this.selected = this.defaultSelected;
						else el.find("option").resetForm();
					else select.resetForm();
					return true;
				case "select":
					el.find("option").each(function (i) {
						this.selected = this.defaultSelected;
						if (this.defaultSelected && !el[0].multiple) {
							el[0].selectedIndex = i;
							return false;
						}
					});
					return true;
				case "label":
					var forEl = $(el.attr("for"));
					var list = el.find("input,select,textarea");
					if (forEl[0]) list.unshift(forEl[0]);
					list.resetForm();
					return true;
				case "form":
					if (
						typeof this.reset === "function" ||
						(typeof this.reset === "object" && !this.reset.nodeType)
					)
						this.reset();
					return true;
				default:
					el.find("form,input,label,select,textarea").resetForm();
					return true;
			}
		});
	};
	$.fn.enable = function (b) {
		if (typeof b === "undefined") b = true;
		return this.each(function () {
			this.disabled = !b;
		});
	};
	$.fn.selected = function (select) {
		if (typeof select === "undefined") select = true;
		return this.each(function () {
			var t = this.type;
			if (t === "checkbox" || t === "radio") this.checked = select;
			else {
				if (this.tagName.toLowerCase() === "option") {
					var $sel = $(this).parent("select");
					if (select && $sel[0] && $sel[0].type === "select-one")
						$sel.find("option").selected(false);
					this.selected = select;
				}
			}
		});
	};
	$.fn.ajaxSubmit.debug = false;
	function log() {
		if (!$.fn.ajaxSubmit.debug) return;
		var msg = "[jquery.form] " + Array.prototype.join.call(arguments, "");
		if (window.console && window.console.log) window.console.log(msg);
		else {
			if (window.opera && window.opera.postError) window.opera.postError(msg);
		}
	}
});
/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function ($, Drupal) {
	Drupal.webform = Drupal.webform || {};
	Drupal.webform.scrollTopOffset =
		Drupal.webform.scrollTopOffset || ($("#toolbar-administration").length ? 140 : 10);
	Drupal.webformScrollTop = function (element, target) {
		if (!target) return;
		var $element = $(element);
		var offset = $element.offset();
		var $scrollTarget = $element;
		while ($scrollTarget.scrollTop() === 0 && $($scrollTarget).parent())
			$scrollTarget = $scrollTarget.parent();
		if (target === "page" && $scrollTarget.length && $scrollTarget[0].tagName === "HTML") {
			var rect = $($scrollTarget)[0].getBoundingClientRect();
			if (
				!(
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <= $(window).height() &&
					rect.right <= $(window).width()
				)
			)
				$scrollTarget.animate({ scrollTop: 0 }, 500);
		} else {
			if (offset.top - Drupal.webform.scrollTopOffset < $scrollTarget.scrollTop())
				$scrollTarget.animate({ scrollTop: offset.top - Drupal.webform.scrollTopOffset }, 500);
		}
	};
	Drupal.webformScrolledIntoView = function ($element) {
		if (!Drupal.webformIsScrolledIntoView($element))
			$("html, body").animate(
				{ scrollTop: $element.offset().top - Drupal.webform.scrollTopOffset },
				500
			);
	};
	Drupal.webformIsScrolledIntoView = function (element) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemTop = $(element).offset().top;
		var elemBottom = elemTop + $(element).height();
		return elemBottom <= docViewBottom && elemTop >= docViewTop;
	};
})(jQuery, Drupal);
(function ($, Drupal, drupalSettings, once, tabbable) {
	Drupal.webform = Drupal.webform || {};
	Drupal.webform.ajax = Drupal.webform.ajax || {};
	Drupal.webform.ajax.scrollTopOffset =
		Drupal.webform.ajax.scrollTopOffset || ($("#toolbar-administration").length ? 140 : 10);
	Drupal.webform.scrollTopOffset = Drupal.webform.ajax.scrollTopOffset;
	Drupal.behaviors.webformAjaxLink = {
		attach(context) {
			$(once("webform-ajax-link", ".webform-ajax-link", context)).each(function () {
				var element_settings = {};
				element_settings.progress = { type: "fullscreen" };
				var href = $(this).attr("href");
				if (href) {
					element_settings.url = href;
					element_settings.event = "click";
				}
				element_settings.dialogType = $(this).data("dialog-type");
				element_settings.dialogRenderer = $(this).data("dialog-renderer");
				element_settings.dialog = $(this).data("dialog-options");
				element_settings.base = $(this).attr("id");
				element_settings.element = this;
				Drupal.ajax(element_settings);
				if (element_settings.dialogRenderer === "off_canvas")
					$(this).on("click", function () {
						$(".ui-dialog.webform-ui-dialog:visible").find(".ui-dialog-content").dialog("close");
					});
			});
		},
	};
	Drupal.behaviors.webformAjaxHash = {
		attach(context) {
			$(once("webform-ajax-hash", "[data-hash]", context)).each(function () {
				var hash = $(this).data("hash");
				if (hash)
					$(this).on("click", function () {
						location.hash = $(this).data("hash");
					});
			});
		},
	};
	Drupal.behaviors.webformConfirmationBackAjax = {
		attach(context) {
			$(
				once("webform-confirmation-back-ajax", ".js-webform-confirmation-back-link-ajax", context)
			).on("click", function (event) {
				var $form = $(this).parents("form");
				$form.find(".js-webform-confirmation-back-submit-ajax").trigger("click");
				var $progress_indicator = $form.find(".ajax-progress");
				if ($progress_indicator) $(this).after($progress_indicator);
				event.preventDefault();
				event.stopPropagation();
			});
		},
	};
	var updateKey;
	var addElement;
	Drupal.AjaxCommands.prototype.webformInsert = function (ajax, response, status) {
		this.insert(ajax, response, status);
		if (addElement) {
			var addSelector =
				addElement === "_root_"
					? "#webform-ui-add-element"
					: '[data-drupal-selector="edit-webform-ui-elements-' + addElement + '-add"]';
			$(addSelector).trigger("click");
		}
		if (!addElement && updateKey) {
			var $element = $('tr[data-webform-key="' + updateKey + '"]');
			$element.addClass("color-success");
			setTimeout(function () {
				$element.removeClass("color-success");
			}, 3000);
			const tabbableElements = tabbable.tabbable($element.get(0));
			const filteredElements = tabbableElements.filter(
				(element) => !element.classList.contains("tabledrag-handle")
			);
			if (filteredElements.length) filteredElements[0].focus();
			Drupal.webformScrolledIntoView($element);
		} else $("#main-content").trigger("focus");
		var $wrapper = $(response.selector);
		if ($wrapper.parents(".ui-dialog").length === 0) {
			var $messages = $wrapper.find(".messages");
			if (addElement) $messages.remove();
			else {
				if ($messages.length) {
					var $floatingMessage = $("#webform-ajax-messages");
					if ($floatingMessage.length === 0) {
						$floatingMessage = $(
							'<div id="webform-ajax-messages" class="webform-ajax-messages"></div>'
						);
						$("body").append($floatingMessage);
					}
					if ($floatingMessage.is(":animated")) $floatingMessage.stop(true, true);
					$floatingMessage.html($messages).show().delay(3000).fadeOut(1000);
				}
			}
		}
		updateKey = null;
		addElement = null;
	};
	Drupal.AjaxCommands.prototype.webformScrollTop = function (ajax, response) {
		Drupal.webformScrollTop(response.selector, response.target);
		var $form = $(response.selector + "-content").find("form");
		if (!$form.hasClass("js-webform-autofocus")) $(response.selector + "-content").trigger("focus");
	};
	Drupal.AjaxCommands.prototype.webformRefresh = function (ajax, response, status) {
		var a = document.createElement("a");
		a.href = response.url;
		var forceReload = response.url.match(/\?reload=([^&]+)($|&)/) ? RegExp.$1 : null;
		if (forceReload) {
			response.url = response.url.replace(/\?reload=([^&]+)($|&)/, "");
			this.redirect(ajax, response, status);
			return;
		}
		if (a.pathname === window.location.pathname && $(".webform-ajax-refresh").length) {
			updateKey = response.url.match(/[?|&]update=([^&]+)($|&)/) ? RegExp.$1 : null;
			addElement = response.url.match(/[?|&]add_element=([^&]+)($|&)/) ? RegExp.$1 : null;
			$(".webform-ajax-refresh").trigger("click");
			$("#drupal-off-canvas").hide();
		} else {
			if (Drupal.behaviors.webformUnsaved) Drupal.behaviors.webformUnsaved.clear();
			if (drupalSettings.webform_share && drupalSettings.webform_share.page)
				window.top.location = response.url;
			else this.redirect(ajax, response, status);
		}
	};
	Drupal.AjaxCommands.prototype.webformCloseDialog = function (ajax, response, status) {
		if ($("#drupal-off-canvas-wrapper").length) {
			$("#drupal-off-canvas-wrapper").remove();
			$("body").removeClass("js-tray-open");
			$(document).off(".off-canvas");
			$(window).off(".off-canvas");
			var edge = document.documentElement.dir === "rtl" ? "left" : "right";
			var $mainCanvasWrapper = $("[data-off-canvas-main-canvas]");
			$mainCanvasWrapper.css("padding-" + edge, 0);
			$(window).trigger("resize.tabs");
		}
		if ($(response.selector).hasClass("ui-dialog-content"))
			this.closeDialog(ajax, response, status);
	};
	Drupal.AjaxCommands.prototype.webformConfirmReload = function (ajax, response) {
		if (window.confirm(response.message)) window.location.reload(true);
	};
})(jQuery, Drupal, drupalSettings, once, tabbable);
(function ($, Drupal, once) {
	var hasLocalStorage = (function () {
		try {
			localStorage.setItem("webform", "webform");
			localStorage.removeItem("webform");
			return true;
		} catch (e) {
			return false;
		}
	})();
	Drupal.behaviors.webformDetailsSave = {
		attach(context) {
			if (!hasLocalStorage) return;
			$(once("webform-details-summary-save", "details > summary", context)).on(
				"click",
				function () {
					var $details = $(this).parent();
					if ($details[0].hasAttribute("data-webform-details-nosave")) return;
					var name = Drupal.webformDetailsSaveGetName($details);
					if (!name) return;
					var open = $details.attr("open") !== "open" ? "1" : "0";
					localStorage.setItem(name, open);
				}
			);
			$(once("webform-details-save", "details", context)).each(function () {
				var $details = $(this);
				var name = Drupal.webformDetailsSaveGetName($details);
				if (!name) return;
				var open = localStorage.getItem(name);
				if (open === null) return;
				if (open === "1") $details.attr("open", "open");
				else $details.removeAttr("open");
			});
		},
	};
	Drupal.webformDetailsSaveGetName = function ($details) {
		if (!hasLocalStorage) return "";
		if ($details.hasClass("vertical-tabs__pane")) return "";
		var webformId = $details.attr("data-webform-element-id");
		if (webformId) return "Drupal.webform." + webformId.replace("--", ".");
		var detailsId = $details.attr("id");
		if (!detailsId) return "";
		var $form = $details.parents("form");
		if (!$form.length || !$form.attr("id")) return "";
		var formId = $form.attr("id");
		if (!formId) return "";
		formId = formId.replace(/--.+?$/, "").replace(/-/g, "_");
		detailsId = detailsId.replace(/--.+?$/, "").replace(/-/g, "_");
		return "Drupal.webform." + formId + "." + detailsId;
	};
})(jQuery, Drupal, once);
(function ($, Drupal, once) {
	Drupal.webform = Drupal.webform || {};
	Drupal.webform.detailsToggle = Drupal.webform.detailsToggle || {};
	Drupal.webform.detailsToggle.options = Drupal.webform.detailsToggle.options || {};
	Drupal.behaviors.webformDetailsToggle = {
		attach(context) {
			$(once("webform-details-toggle", ".js-webform-details-toggle", context)).each(function () {
				var $form = $(this);
				var $tabs = $form.find(".webform-tabs");
				var selector = $tabs.length
					? ".webform-tab"
					: ".js-webform-details-toggle, .webform-elements";
				var $details = $form.find("details").filter(function () {
					var $parents = $(this).parentsUntil(selector);
					return $parents.find("details").length === 0;
				});
				if ($details.length < 2) return;
				var options = $.extend(
					{ button: '<button type="button" class="webform-details-toggle-state"></button>' },
					Drupal.webform.detailsToggle.options
				);
				var $toggle = $(options.button)
					.attr("title", Drupal.t("Toggle details widget state."))
					.on("click", function (e) {
						var $details = $form.find("details:not(.vertical-tabs__pane)");
						var $summary = $details.find("summary");
						var open;
						if (Drupal.webform.detailsToggle.isFormDetailsOpen($form)) {
							$details.removeAttr("open");
							$summary.attr("aria-expanded", "false");
							open = 0;
						} else {
							$details.attr("open", "open");
							$summary.attr("aria-expanded", "true");
							open = 1;
						}
						Drupal.webform.detailsToggle.setDetailsToggleLabel($form);
						if (Drupal.webformDetailsSaveGetName)
							$details.each(function () {
								var name = Drupal.webformDetailsSaveGetName($(this));
								if (name) localStorage.setItem(name, open);
							});
					})
					.wrap('<div class="webform-details-toggle-state-wrapper"></div>')
					.parent();
				if ($tabs.length) $tabs.find(".item-list:first-child").eq(0).before($toggle);
				else $details.eq(0).before($toggle);
				Drupal.webform.detailsToggle.setDetailsToggleLabel($form);
			});
		},
	};
	Drupal.webform.detailsToggle.isFormDetailsOpen = function ($form) {
		return $form.find("details[open]").length === $form.find("details").length;
	};
	Drupal.webform.detailsToggle.setDetailsToggleLabel = function ($form) {
		var isOpen = Drupal.webform.detailsToggle.isFormDetailsOpen($form);
		var label = isOpen ? Drupal.t("Collapse all") : Drupal.t("Expand all");
		$form.find(".webform-details-toggle-state").html(label);
		var text = isOpen
			? Drupal.t("All details have been expanded.")
			: Drupal.t("All details have been collapsed.");
		Drupal.announce(text);
	};
})(jQuery, Drupal, once);
(function ($, Drupal, once) {
	var hasLocalStorage = (function () {
		try {
			localStorage.setItem("webform", "webform");
			localStorage.removeItem("webform");
			return true;
		} catch (e) {
			return false;
		}
	})();
	var hasSessionStorage = (function () {
		try {
			sessionStorage.setItem("webform", "webform");
			sessionStorage.removeItem("webform");
			return true;
		} catch (e) {
			return false;
		}
	})();
	Drupal.behaviors.webformMessageClose = {
		attach(context) {
			$(once("webform-message--close", ".js-webform-message--close", context)).each(function () {
				var $element = $(this);
				var id = $element.attr("data-message-id");
				var storage = $element.attr("data-message-storage");
				var effect = $element.attr("data-message-close-effect") || "hide";
				switch (effect) {
					case "slide":
						effect = "slideUp";
						break;
					case "fade":
						effect = "fadeOut";
						break;
				}
				if (isClosed($element, storage, id)) return;
				if (
					$element.attr("style") !== "display: none;" &&
					!$element.hasClass("js-webform-states-hidden")
				)
					$element.show();
				$element.find(".js-webform-message__link").on("click", function (event) {
					$element[effect]();
					setClosed($element, storage, id);
					$element.trigger("close");
					event.preventDefault();
				});
			});
		},
	};
	function isClosed($element, storage, id) {
		if (!id || !storage) return false;
		switch (storage) {
			case "local":
				if (hasLocalStorage) return localStorage.getItem("Drupal.webform.message." + id) || false;
				return false;
			case "session":
				if (hasSessionStorage)
					return sessionStorage.getItem("Drupal.webform.message." + id) || false;
				return false;
			default:
				return false;
		}
	}
	function setClosed($element, storage, id) {
		if (!id || !storage) return;
		switch (storage) {
			case "local":
				if (hasLocalStorage) localStorage.setItem("Drupal.webform.message." + id, true);
				break;
			case "session":
				if (hasSessionStorage) sessionStorage.setItem("Drupal.webform.message." + id, true);
				break;
			case "user":
			case "state":
			case "custom":
				$.get($element.find(".js-webform-message__link").attr("href"));
				return true;
		}
	}
})(jQuery, Drupal, once);
(function ($, Drupal, once) {
	Drupal.behaviors.webformSelectOptionsDisabled = {
		attach(context) {
			$(
				once(
					"webform-select-options-disabled",
					"select[data-webform-select-options-disabled]",
					context
				)
			).each(function () {
				var $select = $(this);
				var disabled = $select.attr("data-webform-select-options-disabled").split(/\s*,\s*/);
				$select
					.find("option")
					.filter(function isDisabled() {
						return $.inArray(this.value, disabled) !== -1;
					})
					.attr("disabled", "disabled");
			});
		},
	};
})(jQuery, Drupal, once);
if (!jQuery.isArray)
	jQuery.isArray =
		Array.isArray ||
		function (value) {
			return Object.prototype.toString.call(value) === "[object Array]";
		};
if (!jQuery.trim)
	jQuery.trim = function (text) {
		return text == null ? "" : text.trim();
	};
(function ($, Drupal, once) {
	Drupal.webform = Drupal.webform || {};
	Drupal.webform.select2 = Drupal.webform.select2 || {};
	Drupal.webform.select2.options = Drupal.webform.select2.options || {};
	Drupal.webform.select2.options.width = Drupal.webform.select2.options.width || "100%";
	Drupal.webform.select2.options.widthInline = Drupal.webform.select2.options.widthInline || "50%";
	Drupal.behaviors.webformSelect2 = {
		attach(context) {
			if (!$.fn.select2) return;
			$(
				once("webform-select2", "select.js-webform-select2, .js-webform-select2 select", context)
			).each(function () {
				var $select = $(this);
				var options = {};
				if ($select.parents(".webform-element--title-inline").length)
					options.width = Drupal.webform.select2.options.widthInline;
				options = $.extend(options, Drupal.webform.select2.options);
				if ($select.data("placeholder")) {
					options.placeholder = $select.data("placeholder");
					if (!$select.prop("multiple")) options.allowClear = true;
				}
				if ($select.data("limit")) options.maximumSelectionLength = $select.data("limit");
				if ($select.attr("data-options"))
					options = $.extend(true, options, JSON.parse($select.attr("data-options")));
				$select.select2(options);
			});
		},
	};
	$(function () {
		if ($.fn.select2)
			$(document).on("state:visible state:visible-slide", function (e) {
				$("select.select2-hidden-accessible").select2("close");
			});
		if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
			var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
			$.ui.dialog.prototype._allowInteraction = function (e) {
				if ($(e.target).closest(".select2-dropdown").length) return true;
				return ui_dialog_interaction.apply(this, arguments);
			};
		}
	});
})(jQuery, Drupal, once);
(function ($, Drupal, debounce) {
	$.fn.drupalGetSummary = function () {
		const callback = this.data("summaryCallback");
		if (!this[0] || !callback) return "";
		const result = callback(this[0]);
		return result ? result.trim() : "";
	};
	$.fn.drupalSetSummary = function (callback) {
		const self = this;
		if (typeof callback !== "function") {
			const val = callback;
			callback = function () {
				return val;
			};
		}
		return this.data("summaryCallback", callback)
			.off("formUpdated.summary")
			.on("formUpdated.summary", () => {
				self.trigger("summaryUpdated");
			})
			.trigger("summaryUpdated");
	};
	Drupal.behaviors.formSingleSubmit = {
		attach() {
			function onFormSubmit(e) {
				const $form = $(e.currentTarget);
				const formValues = new URLSearchParams(new FormData(e.target)).toString();
				const previousValues = $form.attr("data-drupal-form-submit-last");
				if (previousValues === formValues) e.preventDefault();
				else $form.attr("data-drupal-form-submit-last", formValues);
			}
			$(once("form-single-submit", "body")).on(
				"submit.singleSubmit",
				'form:not([method~="GET"])',
				onFormSubmit
			);
		},
	};
	function triggerFormUpdated(element) {
		$(element).trigger("formUpdated");
	}
	function fieldsList(form) {
		return [].map.call(form.querySelectorAll("[name][id]"), (el) => el.id);
	}
	Drupal.behaviors.formUpdated = {
		attach(context) {
			const $context = $(context);
			const contextIsForm = context.tagName === "FORM";
			const $forms = $(once("form-updated", contextIsForm ? $context : $context.find("form")));
			let formFields;
			if ($forms.length)
				$.makeArray($forms).forEach((form) => {
					const events = "change.formUpdated input.formUpdated ";
					const eventHandler = debounce((event) => {
						triggerFormUpdated(event.target);
					}, 300);
					formFields = fieldsList(form).join(",");
					form.setAttribute("data-drupal-form-fields", formFields);
					$(form).on(events, eventHandler);
				});
			if (contextIsForm) {
				formFields = fieldsList(context).join(",");
				const currentFields = $(context).attr("data-drupal-form-fields");
				if (formFields !== currentFields) triggerFormUpdated(context);
			}
		},
		detach(context, settings, trigger) {
			const $context = $(context);
			const contextIsForm = context.tagName === "FORM";
			if (trigger === "unload")
				once
					.remove("form-updated", contextIsForm ? $context : $context.find("form"))
					.forEach((form) => {
						form.removeAttribute("data-drupal-form-fields");
						$(form).off(".formUpdated");
					});
		},
	};
	Drupal.behaviors.fillUserInfoFromBrowser = {
		attach(context, settings) {
			const userInfo = ["name", "mail", "homepage"];
			const $forms = $(once("user-info-from-browser", "[data-user-info-from-browser]"));
			if ($forms.length)
				userInfo.forEach((info) => {
					const $element = $forms.find(`[name=${info}]`);
					const browserData = localStorage.getItem(`Drupal.visitor.${info}`);
					if (!$element.length) return;
					const emptyValue = $element[0].value === "";
					const defaultValue = $element.attr("data-drupal-default-value") === $element[0].value;
					if (browserData && (emptyValue || defaultValue))
						$element.each(function (index, item) {
							item.value = browserData;
						});
				});
			$forms.on("submit", () => {
				userInfo.forEach((info) => {
					const $element = $forms.find(`[name=${info}]`);
					if ($element.length) localStorage.setItem(`Drupal.visitor.${info}`, $element[0].value);
				});
			});
		},
	};
	const handleFragmentLinkClickOrHashChange = (e) => {
		let url;
		if (e.type === "click")
			url = e.currentTarget.location ? e.currentTarget.location : e.currentTarget;
		else url = window.location;
		const hash = url.hash.substring(1);
		if (hash) {
			const $target = $(`#${hash}`);
			$("body").trigger("formFragmentLinkClickOrHashChange", [$target]);
			setTimeout(() => $target.trigger("focus"), 300);
		}
	};
	const debouncedHandleFragmentLinkClickOrHashChange = debounce(
		handleFragmentLinkClickOrHashChange,
		300,
		true
	);
	$(window).on("hashchange.form-fragment", debouncedHandleFragmentLinkClickOrHashChange);
	$(document).on(
		"click.form-fragment",
		'a[href*="#"]',
		debouncedHandleFragmentLinkClickOrHashChange
	);
})(jQuery, Drupal, Drupal.debounce);
(function ($, Drupal) {
	var isChrome = /chrom(e|ium)/.test(window.navigator.userAgent.toLowerCase());
	if (isChrome) {
		var backButton = false;
		if (window.performance) {
			var navEntries = window.performance.getEntriesByType("navigation");
			if (navEntries.length > 0 && navEntries[0].type === "back_forward") backButton = true;
			else {
				if (
					window.performance.navigation &&
					window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD
				)
					backButton = true;
			}
		}
		if (backButton) {
			var attachBehaviors = Drupal.attachBehaviors;
			Drupal.attachBehaviors = function (context, settings) {
				setTimeout(function () {
					attachBehaviors(context, settings);
				}, 300);
			};
		}
	}
})(jQuery, Drupal);
(function ($, Drupal) {
	const states = { postponed: [] };
	Drupal.states = states;
	function invert(a, invertState) {
		return invertState && typeof a !== "undefined" ? !a : a;
	}
	function compare(a, b) {
		if (a === b) return typeof a === "undefined" ? a : true;
		return typeof a === "undefined" || typeof b === "undefined";
	}
	function ternary(a, b) {
		if (typeof a === "undefined") return b;
		if (typeof b === "undefined") return a;
		return a && b;
	}
	Drupal.behaviors.states = {
		attach(context, settings) {
			const elements = once("states", "[data-drupal-states]", context);
			const il = elements.length;
			for (let i = 0; i < il; i++) {
				const config = JSON.parse(elements[i].getAttribute("data-drupal-states"));
				Object.keys(config || {}).forEach((state) => {
					new states.Dependent({
						element: $(elements[i]),
						state: states.State.sanitize(state),
						constraints: config[state],
					});
				});
			}
			while (states.postponed.length) states.postponed.shift()();
		},
	};
	states.Dependent = function (args) {
		$.extend(this, { values: {}, oldValue: null }, args);
		this.dependees = this.getDependees();
		Object.keys(this.dependees || {}).forEach((selector) => {
			this.initializeDependee(selector, this.dependees[selector]);
		});
	};
	states.Dependent.comparisons = {
		RegExp(reference, value) {
			return reference.test(value);
		},
		Function(reference, value) {
			return reference(value);
		},
		Array(reference, value) {
			if (!Array.isArray(value)) return false;
			return JSON.stringify(reference.sort()) === JSON.stringify(value.sort());
		},
		Number(reference, value) {
			return typeof value === "string"
				? compare(reference.toString(), value)
				: compare(reference, value);
		},
	};
	states.Dependent.prototype = {
		initializeDependee(selector, dependeeStates) {
			this.values[selector] = {};
			Object.keys(dependeeStates).forEach((i) => {
				let state = dependeeStates[i];
				if ($.inArray(state, dependeeStates) === -1) return;
				state = states.State.sanitize(state);
				this.values[selector][state.name] = null;
				$(selector).on(`state:${state}`, { selector, state }, (e) => {
					this.update(e.data.selector, e.data.state, e.value);
				});
				new states.Trigger({ selector, state });
			});
		},
		compare(reference, selector, state) {
			const value = this.values[selector][state.name];
			if (reference.constructor.name in states.Dependent.comparisons)
				return states.Dependent.comparisons[reference.constructor.name](reference, value);
			return compare(reference, value);
		},
		update(selector, state, value) {
			if (value !== this.values[selector][state.name]) {
				this.values[selector][state.name] = value;
				this.reevaluate();
			}
		},
		reevaluate() {
			let value = this.verifyConstraints(this.constraints);
			if (value !== this.oldValue) {
				this.oldValue = value;
				value = invert(value, this.state.invert);
				this.element.trigger({ type: `state:${this.state}`, value, trigger: true });
			}
		},
		verifyConstraints(constraints, selector) {
			let result;
			if (Array.isArray(constraints)) {
				const hasXor = $.inArray("xor", constraints) === -1;
				const len = constraints.length;
				for (let i = 0; i < len; i++)
					if (constraints[i] !== "xor") {
						const constraint = this.checkConstraints(constraints[i], selector, i);
						if (constraint && (hasXor || result)) return hasXor;
						result = result || constraint;
					}
			} else {
				if ($.isPlainObject(constraints)) {
					for (const n in constraints)
						if (constraints.hasOwnProperty(n)) {
							result = ternary(result, this.checkConstraints(constraints[n], selector, n));
							if (result === false) return false;
						}
				}
			}
			return result;
		},
		checkConstraints(value, selector, state) {
			if (typeof state !== "string" || /[0-9]/.test(state[0])) state = null;
			else {
				if (typeof selector === "undefined") {
					selector = state;
					state = null;
				}
			}
			if (state !== null) {
				state = states.State.sanitize(state);
				return invert(this.compare(value, selector, state), state.invert);
			}
			return this.verifyConstraints(value, selector);
		},
		getDependees() {
			const cache = {};
			const _compare = this.compare;
			this.compare = function (reference, selector, state) {
				(cache[selector] || (cache[selector] = [])).push(state.name);
			};
			this.verifyConstraints(this.constraints);
			this.compare = _compare;
			return cache;
		},
	};
	states.Trigger = function (args) {
		$.extend(this, args);
		if (this.state in states.Trigger.states) {
			this.element = $(this.selector);
			if (!this.element.data(`trigger:${this.state}`)) this.initialize();
		}
	};
	states.Trigger.prototype = {
		initialize() {
			const trigger = states.Trigger.states[this.state];
			if (typeof trigger === "function") trigger.call(window, this.element);
			else
				Object.keys(trigger || {}).forEach((event) => {
					this.defaultTrigger(event, trigger[event]);
				});
			this.element.data(`trigger:${this.state}`, true);
		},
		defaultTrigger(event, valueFn) {
			let oldValue = valueFn.call(this.element);
			this.element.on(
				event,
				function (e) {
					const value = valueFn.call(this.element, e);
					if (oldValue !== value) {
						this.element.trigger({ type: `state:${this.state}`, value, oldValue });
						oldValue = value;
					}
				}.bind(this)
			);
			states.postponed.push(
				function () {
					this.element.trigger({ type: `state:${this.state}`, value: oldValue, oldValue: null });
				}.bind(this)
			);
		},
	};
	states.Trigger.states = {
		empty: {
			keyup() {
				return this.val() === "";
			},
			change() {
				return this.val() === "";
			},
		},
		checked: {
			change() {
				let checked = false;
				this.each(function () {
					checked = $(this).prop("checked");
					return !checked;
				});
				return checked;
			},
		},
		value: {
			keyup() {
				if (this.length > 1) return this.filter(":checked").val() || false;
				return this.val();
			},
			change() {
				if (this.length > 1) return this.filter(":checked").val() || false;
				return this.val();
			},
		},
		collapsed: {
			collapsed(e) {
				return typeof e !== "undefined" && "value" in e ? e.value : !this[0].hasAttribute("open");
			},
		},
	};
	states.State = function (state) {
		this.pristine = state;
		this.name = state;
		let process = true;
		do {
			while (this.name.charAt(0) === "!") {
				this.name = this.name.substring(1);
				this.invert = !this.invert;
			}
			if (this.name in states.State.aliases) this.name = states.State.aliases[this.name];
			else process = false;
		} while (process);
	};
	states.State.sanitize = function (state) {
		if (state instanceof states.State) return state;
		return new states.State(state);
	};
	states.State.aliases = {
		enabled: "!disabled",
		invisible: "!visible",
		invalid: "!valid",
		untouched: "!touched",
		optional: "!required",
		filled: "!empty",
		unchecked: "!checked",
		irrelevant: "!relevant",
		expanded: "!collapsed",
		open: "!collapsed",
		closed: "collapsed",
		readwrite: "!readonly",
	};
	states.State.prototype = {
		invert: false,
		toString() {
			return this.name;
		},
	};
	const $document = $(document);
	$document.on("state:disabled", (e) => {
		const tagsSupportDisable = "button, fieldset, optgroup, option, select, textarea, input";
		if (e.trigger)
			$(e.target)
				.closest(".js-form-item, .js-form-submit, .js-form-wrapper")
				.toggleClass("form-disabled", e.value)
				.find(tagsSupportDisable)
				.addBack(tagsSupportDisable)
				.prop("disabled", e.value);
	});
	$document.on("state:readonly", (e) => {
		if (e.trigger)
			$(e.target)
				.closest(".js-form-item, .js-form-submit, .js-form-wrapper")
				.toggleClass("form-readonly", e.value)
				.find("input, textarea")
				.prop("readonly", e.value);
	});
	$document.on("state:required", (e) => {
		if (e.trigger)
			if (e.value) {
				const label = `label${e.target.id ? `[for=${e.target.id}]` : ""}`;
				const $label = $(e.target)
					.attr({ required: "required" })
					.closest(".js-form-item, .js-form-wrapper")
					.find(label);
				if (!$label.hasClass("js-form-required").length)
					$label.addClass("js-form-required form-required");
			} else
				$(e.target)
					.removeAttr("required")
					.closest(".js-form-item, .js-form-wrapper")
					.find("label.js-form-required")
					.removeClass("js-form-required form-required");
	});
	$document.on("state:visible", (e) => {
		if (e.trigger) {
			let $element = $(e.target).closest(".js-form-item, .js-form-submit, .js-form-wrapper");
			if (e.target.tagName === "A") $element = $(e.target);
			$element.toggle(e.value);
		}
	});
	$document.on("state:checked", (e) => {
		if (e.trigger)
			$(e.target)
				.closest(".js-form-item, .js-form-wrapper")
				.find("input")
				.prop("checked", e.value)
				.trigger("change");
	});
	$document.on("state:collapsed", (e) => {
		if (e.trigger)
			if (e.target.hasAttribute("open") === e.value) $(e.target).find("> summary").trigger("click");
	});
})(jQuery, Drupal);
(function ($, Drupal, once) {
	Drupal.webform = Drupal.webform || {};
	Drupal.webform.states = Drupal.webform.states || {};
	Drupal.webform.states.slideDown = Drupal.webform.states.slideDown || {};
	Drupal.webform.states.slideDown.duration = "slow";
	Drupal.webform.states.slideUp = Drupal.webform.states.slideUp || {};
	Drupal.webform.states.slideUp.duration = "fast";
	$.fn.hasData = function (data) {
		return typeof this.data(data) !== "undefined";
	};
	$.fn.isWebform = function () {
		return $(this).closest(
			'form.webform-submission-form, form[id^="webform"], form[data-is-webform]'
		).length
			? true
			: false;
	};
	$.fn.isWebformElement = function () {
		return $(this).isWebform() || $(this).closest("[data-is-webform-element]").length
			? true
			: false;
	};
	Drupal.states.Trigger.states.empty.change = function change() {
		return this.val() === "";
	};
	Drupal.states.Dependent.comparisons.Object = function (reference, value) {
		if ("pattern" in reference) return new RegExp(reference["pattern"]).test(value);
		else if ("!pattern" in reference) return !new RegExp(reference["!pattern"]).test(value);
		else if ("less" in reference)
			return value !== "" && parseFloat(reference["less"]) > parseFloat(value);
		else if ("less_equal" in reference)
			return value !== "" && parseFloat(reference["less_equal"]) >= parseFloat(value);
		else if ("greater" in reference)
			return value !== "" && parseFloat(reference["greater"]) < parseFloat(value);
		else if ("greater_equal" in reference)
			return value !== "" && parseFloat(reference["greater_equal"]) <= parseFloat(value);
		else if ("between" in reference || "!between" in reference) {
			if (value === "") return false;
			var between = reference["between"] || reference["!between"];
			var betweenParts = between.split(":");
			var greater = betweenParts[0];
			var less = typeof betweenParts[1] !== "undefined" ? betweenParts[1] : null;
			var isGreaterThan =
				greater === null || greater === "" || parseFloat(value) >= parseFloat(greater);
			var isLessThan = less === null || less === "" || parseFloat(value) <= parseFloat(less);
			var result = isGreaterThan && isLessThan;
			return reference["!between"] ? !result : result;
		} else return reference.indexOf(value) !== false;
	};
	var $document = $(document);
	$document.on("state:required", function (e) {
		if (e.trigger && $(e.target).isWebformElement()) {
			var $target = $(e.target);
			toggleRequired($target.find('input[type="file"]'), e.value);
			if (
				$target.is(
					".js-form-type-radios, .js-form-type-webform-radios-other, .js-webform-type-radios, .js-webform-type-webform-radios-other, .js-webform-type-webform-entity-radios, .webform-likert-table"
				)
			) {
				$target.toggleClass("required", e.value);
				toggleRequired($target.find('input[type="radio"]'), e.value);
			}
			if (
				$target.is(
					".js-form-type-checkboxes, .js-form-type-webform-checkboxes-other, .js-webform-type-checkboxes, .js-webform-type-webform-checkboxes-other"
				)
			) {
				$target.toggleClass("required", e.value);
				var $checkboxes = $target.find('input[type="checkbox"]');
				if (e.value) {
					$checkboxes.on("click", statesCheckboxesRequiredEventHandler);
					checkboxesRequired($target);
				} else {
					$checkboxes.off("click", statesCheckboxesRequiredEventHandler);
					toggleRequired($checkboxes, false);
				}
			}
			if ($target.is(".js-webform-tableselect")) {
				$target.toggleClass("required", e.value);
				var isMultiple = $target.is("[multiple]");
				if (isMultiple) {
					var $tbody = $target.find("tbody");
					var $checkboxes = $tbody.find('input[type="checkbox"]');
					copyRequireMessage($target, $checkboxes);
					if (e.value) {
						$checkboxes.on("click change", statesCheckboxesRequiredEventHandler);
						checkboxesRequired($tbody);
					} else {
						$checkboxes.off("click change ", statesCheckboxesRequiredEventHandler);
						toggleRequired($tbody, false);
					}
				} else {
					var $radios = $target.find('input[type="radio"]');
					copyRequireMessage($target, $radios);
					toggleRequired($radios, e.value);
				}
			}
			if ($target.is(".js-form-type-webform-select-other, .js-webform-type-webform-select-other")) {
				var $select = $target.find("select");
				toggleRequired($select, e.value);
				copyRequireMessage($target, $select);
			}
			if ($target.find("> label:not([for])").length)
				$target.find("> label").toggleClass("js-form-required form-required", e.value);
			if ($target.is(".js-webform-type-radios, .js-webform-type-checkboxes, fieldset"))
				$target
					.find(
						"legend span.fieldset-legend:not(.visually-hidden),legend span.fieldset__label:not(.visually-hidden)"
					)
					.toggleClass("js-form-required form-required", e.value);
			if ($target.is("fieldset")) $target.removeAttr("required aria-required");
		}
	});
	$document.on("state:checked", function (e) {
		if (e.trigger) $(e.target).trigger("change");
	});
	$document.on("state:readonly", function (e) {
		if (e.trigger && $(e.target).isWebformElement()) {
			$(e.target)
				.prop("readonly", e.value)
				.closest(".js-form-item, .js-form-wrapper")
				.toggleClass("webform-readonly", e.value)
				.find("input, textarea")
				.prop("readonly", e.value);
			$(e.target)
				.trigger("webform:readonly")
				.find("select, input, textarea, button")
				.trigger("webform:readonly");
		}
	});
	$document.on("state:visible state:visible-slide", function (e) {
		if (e.trigger && $(e.target).isWebformElement())
			if (e.value)
				$(":input", e.target)
					.addBack()
					.each(function () {
						restoreValueAndRequired(this);
						triggerEventHandlers(this);
					});
			else
				$(":input", e.target)
					.addBack()
					.each(function () {
						backupValueAndRequired(this);
						clearValueAndRequired(this);
						triggerEventHandlers(this);
					});
	});
	$document.on("state:visible-slide", function (e) {
		if (e.trigger && $(e.target).isWebformElement()) {
			var effect = e.value ? "slideDown" : "slideUp";
			var duration = Drupal.webform.states[effect].duration;
			$(e.target).closest(".js-form-item, .js-form-submit, .js-form-wrapper")[effect](duration);
		}
	});
	Drupal.states.State.aliases["invisible-slide"] = "!visible-slide";
	$document.on("state:disabled", function (e) {
		if (e.trigger && $(e.target).isWebformElement()) {
			$(e.target)
				.prop("disabled", e.value)
				.closest(".js-form-item, .js-form-submit, .js-form-wrapper")
				.toggleClass("form-disabled", e.value)
				.find("select, input, textarea, button")
				.prop("disabled", e.value);
			var fileElements = $(e.target).find(':input[type="hidden"][name$="[fids]"]');
			if (fileElements.length) {
				if ($(e.target).is("fieldset")) $(e.target).prop("disabled", false);
				fileElements.removeAttr("disabled");
			}
			$(e.target)
				.trigger("webform:disabled")
				.find("select, input, textarea, button")
				.trigger("webform:disabled");
		}
	});
	Drupal.behaviors.webformCheckboxesRequired = {
		attach(context) {
			$(
				once(
					"webform-checkboxes-required",
					".js-form-type-checkboxes.required, .webform-term-checkboxes.required, .js-form-type-webform-checkboxes-other.required, .js-webform-type-checkboxes.required, .js-webform-type-webform-checkboxes-other.required, .js-webform-type-webform-radios-other.checkboxes",
					context
				)
			).each(function () {
				var $element = $(this);
				$element.find('input[type="checkbox"]').on("click", statesCheckboxesRequiredEventHandler);
				setTimeout(function () {
					checkboxesRequired($element);
				});
			});
		},
	};
	Drupal.behaviors.webformRadiosRequired = {
		attach(context) {
			$(
				once(
					"webform-radios-required",
					".js-form-type-radios, .js-form-type-webform-radios-other, .js-webform-type-radios, .js-webform-type-webform-radios-other, .js-webform-type-webform-entity-radios, .js-webform-type-webform-scale",
					context
				)
			).each(function () {
				var $element = $(this);
				setTimeout(function () {
					radiosRequired($element);
				});
			});
		},
	};
	Drupal.behaviors.webformTableSelectRequired = {
		attach(context) {
			$(once("webform-tableselect-required", ".js-webform-tableselect.required", context)).each(
				function () {
					var $element = $(this);
					var $tbody = $element.find("tbody");
					var isMultiple = $element.is("[multiple]");
					if (isMultiple)
						$tbody.find('input[type="checkbox"]').on("click change", function () {
							checkboxesRequired($tbody);
						});
					setTimeout(function () {
						isMultiple ? checkboxesRequired($tbody) : radiosRequired($element);
					});
				}
			);
		},
	};
	function checkboxesRequired($element) {
		var $firstCheckbox = $element.find('input[type="checkbox"]').first();
		var isChecked = $element.find('input[type="checkbox"]').is(":checked");
		toggleRequired($firstCheckbox, !isChecked);
		copyRequireMessage($element, $firstCheckbox);
	}
	function radiosRequired($element) {
		var $radios = $element.find('input[type="radio"]');
		var isRequired = $element.hasClass("required");
		toggleRequired($radios, isRequired);
		copyRequireMessage($element, $radios);
	}
	function statesCheckboxesRequiredEventHandler() {
		var $element = $(this).closest(
			".js-webform-type-checkboxes, .js-webform-type-webform-checkboxes-other, .js-webform-type-webform-term-checkboxes, .js-webform-tableselect tbody"
		);
		checkboxesRequired($element);
	}
	function triggerEventHandlers(input) {
		var $input = $(input);
		var type = input.type;
		var tag = input.tagName.toLowerCase();
		var extraParameters = ["webform.states"];
		if (type === "checkbox" || type === "radio")
			$input.trigger("change", extraParameters).trigger("blur", extraParameters);
		else if (tag === "select") {
			if ($input.closest(".webform-type-address").length) {
				if (
					!$input.data("webform-states-address-initialized") &&
					$input.attr("autocomplete") === "country" &&
					$input.val() === $input.find("option[selected]").attr("value")
				)
					return;
				$input.data("webform-states-address-initialized", true);
			}
			$input.trigger("change", extraParameters).trigger("blur", extraParameters);
		} else {
			if (type !== "submit" && type !== "button" && type !== "file") {
				var hasInputMask = $.fn.inputmask && $input.hasClass("js-webform-input-mask");
				hasInputMask && $input.inputmask("remove");
				$input
					.trigger("input", extraParameters)
					.trigger("change", extraParameters)
					.trigger("keydown", extraParameters)
					.trigger("keyup", extraParameters)
					.trigger("blur", extraParameters);
				hasInputMask && $input.inputmask();
			}
		}
	}
	function backupValueAndRequired(input) {
		var $input = $(input);
		var type = input.type;
		var tag = input.tagName.toLowerCase();
		if ($input.prop("required") && !$input.hasData("webform-required"))
			$input.data("webform-required", true);
		if (!$input.hasData("webform-value"))
			if (type === "checkbox" || type === "radio")
				$input.data("webform-value", $input.prop("checked"));
			else if (tag === "select") {
				var values = [];
				$input.find("option:selected").each(function (i, option) {
					values[i] = option.value;
				});
				$input.data("webform-value", values);
			} else {
				if (type !== "submit" && type !== "button") $input.data("webform-value", input.value);
			}
	}
	function restoreValueAndRequired(input) {
		var $input = $(input);
		var value = $input.data("webform-value");
		if (typeof value !== "undefined") {
			var type = input.type;
			var tag = input.tagName.toLowerCase();
			if (type === "checkbox" || type === "radio") $input.prop("checked", value);
			else if (tag === "select")
				$.each(value, function (i, option_value) {
					option_value = option_value.replace(/'/g, "\\\'");
					$input.find("option[value='" + option_value + "']").prop("selected", true);
				});
			else {
				if (type !== "submit" && type !== "button") input.value = value;
			}
			$input.removeData("webform-value");
		}
		var required = $input.data("webform-required");
		if (typeof required !== "undefined") {
			if (required) $input.prop("required", true);
			$input.removeData("webform-required");
		}
	}
	function clearValueAndRequired(input) {
		var $input = $(input);
		if ($input.closest("[data-webform-states-no-clear]").length) return;
		var type = input.type;
		var tag = input.tagName.toLowerCase();
		if (type === "checkbox" || type === "radio") $input.prop("checked", false);
		else if (tag === "select")
			if ($input.find('option[value=""]').length) $input.val("");
			else input.selectedIndex = -1;
		else {
			if (type !== "submit" && type !== "button") input.value = type === "color" ? "#000000" : "";
		}
		$input.prop("required", false);
	}
	function toggleRequired($input, required) {
		var isCheckboxOrRadio = $input.attr("type") === "radio" || $input.attr("type") === "checkbox";
		if (required)
			if (isCheckboxOrRadio) $input.attr({ required: "required" });
			else $input.attr({ required: "required", "aria-required": "true" });
		else {
			if (isCheckboxOrRadio) $input.removeAttr("required");
			else $input.removeAttr("required aria-required");
			$input.each(function () {
				this.setCustomValidity && this.setCustomValidity("");
			});
		}
	}
	function copyRequireMessage($source, $destination) {
		if ($source.attr("data-msg-required"))
			$destination.attr("data-msg-required", $source.attr("data-msg-required"));
	}
})(jQuery, Drupal, once);
(function ($, Drupal, once) {
	Drupal.behaviors.webformRemoveFormSingleSubmit = {
		attach: function attach() {
			function onFormSubmit(e) {
				var $form = $(e.currentTarget);
				$form.removeAttr("data-drupal-form-submit-last");
			}
			$(once("webform-single-submit", "body")).on(
				"submit.singleSubmit",
				"form.webform-remove-single-submit",
				onFormSubmit
			);
		},
	};
	Drupal.behaviors.webformDisableAutoSubmit = {
		attach(context) {
			$(
				once(
					"webform-disable-autosubmit",
					$(".js-webform-disable-autosubmit input").not(":button, :submit, :reset, :image, :file")
				)
			).on("keyup keypress", function (e) {
				if (e.which === 13) {
					e.preventDefault();
					return false;
				}
			});
		},
	};
	Drupal.behaviors.webformRequiredError = {
		attach(context) {
			$(
				once(
					"webform-required-error",
					$(context).find(":input[data-webform-required-error], :input[data-webform-pattern-error]")
				)
			)
				.on("invalid", function () {
					this.setCustomValidity("");
					if (this.valid) return;
					if (this.validity.patternMismatch && $(this).attr("data-webform-pattern-error"))
						this.setCustomValidity($(this).attr("data-webform-pattern-error"));
					else {
						if (this.validity.valueMissing && $(this).attr("data-webform-required-error"))
							this.setCustomValidity($(this).attr("data-webform-required-error"));
					}
				})
				.on("input change", function () {
					var name = $(this).attr("name");
					$(this.form)
						.find(':input[name="' + name + '"]')
						.each(function () {
							this.setCustomValidity("");
						});
				});
		},
	};
	$(document).on("state:required", function (e) {
		$(e.target)
			.filter(":input[data-webform-required-error]")
			.each(function () {
				this.setCustomValidity("");
			});
	});
})(jQuery, Drupal, once);
(function ($, Drupal, once) {
	Drupal.behaviors.webformSubmitOnce = {
		clear: function () {
			var $form = $(".js-webform-submit-once");
			$form.removeData("webform-submitted");
			$form
				.find(".js-webform-wizard-pages-links :submit, .form-actions :submit")
				.removeClass("is-disabled");
			$form.find(".form-actions .ajax-progress.ajax-progress-throbber").remove();
		},
		attach(context) {
			$(once("webform-submit-once", ".js-webform-submit-once", context)).each(function () {
				var $form = $(this);
				$form.removeData("webform-submitted");
				$form
					.find(".js-webform-wizard-pages-links :submit, .form-actions :submit")
					.removeClass("js-webform-submit-clicked");
				$form
					.find(".js-webform-wizard-pages-links :submit, .form-actions :submit")
					.on("click", function () {
						$form
							.find(".js-webform-wizard-pages-links :submit, .form-actions :submit")
							.removeClass("js-webform-submit-clicked");
						$(this).addClass("js-webform-submit-clicked");
					});
				$(this).on("submit", function () {
					var $clickedButton = $form.find(
						".js-webform-wizard-pages-links :submit.js-webform-submit-clicked, .form-actions :submit.js-webform-submit-clicked"
					);
					if (
						!$clickedButton.attr("formnovalidate") &&
						typeof jQuery.fn.valid === "function" &&
						!$form.valid()
					)
						return false;
					if ($form.data("webform-submitted")) return false;
					$form.data("webform-submitted", "true");
					$form
						.find(".js-webform-wizard-pages-links :submit, .form-actions :submit")
						.addClass("is-disabled");
					$clickedButton.after(Drupal.theme.ajaxProgressThrobber());
				});
			});
		},
	};
})(jQuery, Drupal, once);
