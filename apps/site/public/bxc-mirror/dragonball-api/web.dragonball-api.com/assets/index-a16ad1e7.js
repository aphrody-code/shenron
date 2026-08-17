var Yr = Object.defineProperty;
var Zr = (o, i, a) =>
	i in o ? Yr(o, i, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (o[i] = a);
var sr = (o, i, a) => (Zr(o, typeof i != "symbol" ? i + "" : i, a), a);
function _mergeNamespaces(o, i) {
	for (var a = 0; a < i.length; a++) {
		const s = i[a];
		if (typeof s != "string" && !Array.isArray(s)) {
			for (const $ in s)
				if ($ !== "default" && !($ in o)) {
					const j = Object.getOwnPropertyDescriptor(s, $);
					j && Object.defineProperty(o, $, j.get ? j : { enumerable: !0, get: () => s[$] });
				}
		}
	}
	return Object.freeze(Object.defineProperty(o, Symbol.toStringTag, { value: "Module" }));
}
(function () {
	const i = document.createElement("link").relList;
	if (i && i.supports && i.supports("modulepreload")) return;
	for (const $ of document.querySelectorAll('link[rel="modulepreload"]')) s($);
	new MutationObserver(($) => {
		for (const j of $)
			if (j.type === "childList")
				for (const _e of j.addedNodes) _e.tagName === "LINK" && _e.rel === "modulepreload" && s(_e);
	}).observe(document, { childList: !0, subtree: !0 });
	function a($) {
		const j = {};
		return (
			$.integrity && (j.integrity = $.integrity),
			$.referrerPolicy && (j.referrerPolicy = $.referrerPolicy),
			$.crossOrigin === "use-credentials"
				? (j.credentials = "include")
				: $.crossOrigin === "anonymous"
					? (j.credentials = "omit")
					: (j.credentials = "same-origin"),
			j
		);
	}
	function s($) {
		if ($.ep) return;
		$.ep = !0;
		const j = a($);
		fetch($.href, j);
	}
})();
function getDefaultExportFromCjs(o) {
	return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function getAugmentedNamespace(o) {
	if (o.__esModule) return o;
	var i = o.default;
	if (typeof i == "function") {
		var a = function s() {
			return this instanceof s
				? Reflect.construct(i, arguments, this.constructor)
				: i.apply(this, arguments);
		};
		a.prototype = i.prototype;
	} else a = {};
	return (
		Object.defineProperty(a, "__esModule", { value: !0 }),
		Object.keys(o).forEach(function (s) {
			var $ = Object.getOwnPropertyDescriptor(o, s);
			Object.defineProperty(
				a,
				s,
				$.get
					? $
					: {
							enumerable: !0,
							get: function () {
								return o[s];
							},
						}
			);
		}),
		a
	);
}
var jsxRuntime = { exports: {} },
	reactJsxRuntime_production_min = {},
	react = { exports: {} },
	react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var l$2 = Symbol.for("react.element"),
	n$2 = Symbol.for("react.portal"),
	p$3 = Symbol.for("react.fragment"),
	q$2 = Symbol.for("react.strict_mode"),
	r$2 = Symbol.for("react.profiler"),
	t$1 = Symbol.for("react.provider"),
	u = Symbol.for("react.context"),
	v$2 = Symbol.for("react.forward_ref"),
	w$1 = Symbol.for("react.suspense"),
	x$1 = Symbol.for("react.memo"),
	y$1 = Symbol.for("react.lazy"),
	z$2 = Symbol.iterator;
function A$2(o) {
	return o === null || typeof o != "object"
		? null
		: ((o = (z$2 && o[z$2]) || o["@@iterator"]), typeof o == "function" ? o : null);
}
var B$1 = {
		isMounted: function () {
			return !1;
		},
		enqueueForceUpdate: function () {},
		enqueueReplaceState: function () {},
		enqueueSetState: function () {},
	},
	C$1 = Object.assign,
	D$1 = {};
function E$1(o, i, a) {
	((this.props = o), (this.context = i), (this.refs = D$1), (this.updater = a || B$1));
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function (o, i) {
	if (typeof o != "object" && typeof o != "function" && o != null)
		throw Error(
			"setState(...): takes an object of state variables to update or a function which returns an object of state variables."
		);
	this.updater.enqueueSetState(this, o, i, "setState");
};
E$1.prototype.forceUpdate = function (o) {
	this.updater.enqueueForceUpdate(this, o, "forceUpdate");
};
function F() {}
F.prototype = E$1.prototype;
function G$1(o, i, a) {
	((this.props = o), (this.context = i), (this.refs = D$1), (this.updater = a || B$1));
}
var H$1 = (G$1.prototype = new F());
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = !0;
var I$1 = Array.isArray,
	J = Object.prototype.hasOwnProperty,
	K$1 = { current: null },
	L$1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function M$1(o, i, a) {
	var s,
		$ = {},
		j = null,
		_e = null;
	if (i != null)
		for (s in (i.ref !== void 0 && (_e = i.ref), i.key !== void 0 && (j = "" + i.key), i))
			J.call(i, s) && !L$1.hasOwnProperty(s) && ($[s] = i[s]);
	var et = arguments.length - 2;
	if (et === 1) $.children = a;
	else if (1 < et) {
		for (var tt = Array(et), rt = 0; rt < et; rt++) tt[rt] = arguments[rt + 2];
		$.children = tt;
	}
	if (o && o.defaultProps) for (s in ((et = o.defaultProps), et)) $[s] === void 0 && ($[s] = et[s]);
	return { $$typeof: l$2, type: o, key: j, ref: _e, props: $, _owner: K$1.current };
}
function N$1(o, i) {
	return { $$typeof: l$2, type: o.type, key: i, ref: o.ref, props: o.props, _owner: o._owner };
}
function O$1(o) {
	return typeof o == "object" && o !== null && o.$$typeof === l$2;
}
function escape(o) {
	var i = { "=": "=0", ":": "=2" };
	return (
		"$" +
		o.replace(/[=:]/g, function (a) {
			return i[a];
		})
	);
}
var P$1 = /\/+/g;
function Q$1(o, i) {
	return typeof o == "object" && o !== null && o.key != null ? escape("" + o.key) : i.toString(36);
}
function R$1(o, i, a, s, $) {
	var j = typeof o;
	(j === "undefined" || j === "boolean") && (o = null);
	var _e = !1;
	if (o === null) _e = !0;
	else
		switch (j) {
			case "string":
			case "number":
				_e = !0;
				break;
			case "object":
				switch (o.$$typeof) {
					case l$2:
					case n$2:
						_e = !0;
				}
		}
	if (_e)
		return (
			(_e = o),
			($ = $(_e)),
			(o = s === "" ? "." + Q$1(_e, 0) : s),
			I$1($)
				? ((a = ""),
					o != null && (a = o.replace(P$1, "$&/") + "/"),
					R$1($, i, a, "", function (rt) {
						return rt;
					}))
				: $ != null &&
					(O$1($) &&
						($ = N$1(
							$,
							a +
								(!$.key || (_e && _e.key === $.key) ? "" : ("" + $.key).replace(P$1, "$&/") + "/") +
								o
						)),
					i.push($)),
			1
		);
	if (((_e = 0), (s = s === "" ? "." : s + ":"), I$1(o)))
		for (var et = 0; et < o.length; et++) {
			j = o[et];
			var tt = s + Q$1(j, et);
			_e += R$1(j, i, a, tt, $);
		}
	else if (((tt = A$2(o)), typeof tt == "function"))
		for (o = tt.call(o), et = 0; !(j = o.next()).done; )
			((j = j.value), (tt = s + Q$1(j, et++)), (_e += R$1(j, i, a, tt, $)));
	else if (j === "object")
		throw (
			(i = String(o)),
			Error(
				"Objects are not valid as a React child (found: " +
					(i === "[object Object]" ? "object with keys {" + Object.keys(o).join(", ") + "}" : i) +
					"). If you meant to render a collection of children, use an array instead."
			)
		);
	return _e;
}
function S$1(o, i, a) {
	if (o == null) return o;
	var s = [],
		$ = 0;
	return (
		R$1(o, s, "", "", function (j) {
			return i.call(a, j, $++);
		}),
		s
	);
}
function T$1(o) {
	if (o._status === -1) {
		var i = o._result;
		((i = i()),
			i.then(
				function (a) {
					(o._status === 0 || o._status === -1) && ((o._status = 1), (o._result = a));
				},
				function (a) {
					(o._status === 0 || o._status === -1) && ((o._status = 2), (o._result = a));
				}
			),
			o._status === -1 && ((o._status = 0), (o._result = i)));
	}
	if (o._status === 1) return o._result.default;
	throw o._result;
}
var U$1 = { current: null },
	V$1 = { transition: null },
	W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
react_production_min.Children = {
	map: S$1,
	forEach: function (o, i, a) {
		S$1(
			o,
			function () {
				i.apply(this, arguments);
			},
			a
		);
	},
	count: function (o) {
		var i = 0;
		return (
			S$1(o, function () {
				i++;
			}),
			i
		);
	},
	toArray: function (o) {
		return (
			S$1(o, function (i) {
				return i;
			}) || []
		);
	},
	only: function (o) {
		if (!O$1(o))
			throw Error("React.Children.only expected to receive a single React element child.");
		return o;
	},
};
react_production_min.Component = E$1;
react_production_min.Fragment = p$3;
react_production_min.Profiler = r$2;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$2;
react_production_min.Suspense = w$1;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.cloneElement = function (o, i, a) {
	if (o == null)
		throw Error(
			"React.cloneElement(...): The argument must be a React element, but you passed " + o + "."
		);
	var s = C$1({}, o.props),
		$ = o.key,
		j = o.ref,
		_e = o._owner;
	if (i != null) {
		if (
			(i.ref !== void 0 && ((j = i.ref), (_e = K$1.current)),
			i.key !== void 0 && ($ = "" + i.key),
			o.type && o.type.defaultProps)
		)
			var et = o.type.defaultProps;
		for (tt in i)
			J.call(i, tt) &&
				!L$1.hasOwnProperty(tt) &&
				(s[tt] = i[tt] === void 0 && et !== void 0 ? et[tt] : i[tt]);
	}
	var tt = arguments.length - 2;
	if (tt === 1) s.children = a;
	else if (1 < tt) {
		et = Array(tt);
		for (var rt = 0; rt < tt; rt++) et[rt] = arguments[rt + 2];
		s.children = et;
	}
	return { $$typeof: l$2, type: o.type, key: $, ref: j, props: s, _owner: _e };
};
react_production_min.createContext = function (o) {
	return (
		(o = {
			$$typeof: u,
			_currentValue: o,
			_currentValue2: o,
			_threadCount: 0,
			Provider: null,
			Consumer: null,
			_defaultValue: null,
			_globalName: null,
		}),
		(o.Provider = { $$typeof: t$1, _context: o }),
		(o.Consumer = o)
	);
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function (o) {
	var i = M$1.bind(null, o);
	return ((i.type = o), i);
};
react_production_min.createRef = function () {
	return { current: null };
};
react_production_min.forwardRef = function (o) {
	return { $$typeof: v$2, render: o };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function (o) {
	return { $$typeof: y$1, _payload: { _status: -1, _result: o }, _init: T$1 };
};
react_production_min.memo = function (o, i) {
	return { $$typeof: x$1, type: o, compare: i === void 0 ? null : i };
};
react_production_min.startTransition = function (o) {
	var i = V$1.transition;
	V$1.transition = {};
	try {
		o();
	} finally {
		V$1.transition = i;
	}
};
react_production_min.unstable_act = function () {
	throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function (o, i) {
	return U$1.current.useCallback(o, i);
};
react_production_min.useContext = function (o) {
	return U$1.current.useContext(o);
};
react_production_min.useDebugValue = function () {};
react_production_min.useDeferredValue = function (o) {
	return U$1.current.useDeferredValue(o);
};
react_production_min.useEffect = function (o, i) {
	return U$1.current.useEffect(o, i);
};
react_production_min.useId = function () {
	return U$1.current.useId();
};
react_production_min.useImperativeHandle = function (o, i, a) {
	return U$1.current.useImperativeHandle(o, i, a);
};
react_production_min.useInsertionEffect = function (o, i) {
	return U$1.current.useInsertionEffect(o, i);
};
react_production_min.useLayoutEffect = function (o, i) {
	return U$1.current.useLayoutEffect(o, i);
};
react_production_min.useMemo = function (o, i) {
	return U$1.current.useMemo(o, i);
};
react_production_min.useReducer = function (o, i, a) {
	return U$1.current.useReducer(o, i, a);
};
react_production_min.useRef = function (o) {
	return U$1.current.useRef(o);
};
react_production_min.useState = function (o) {
	return U$1.current.useState(o);
};
react_production_min.useSyncExternalStore = function (o, i, a) {
	return U$1.current.useSyncExternalStore(o, i, a);
};
react_production_min.useTransition = function () {
	return U$1.current.useTransition();
};
react_production_min.version = "18.2.0";
react.exports = react_production_min;
var reactExports = react.exports;
const React = getDefaultExportFromCjs(reactExports),
	React$1 = _mergeNamespaces({ __proto__: null, default: React }, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var f$1 = reactExports,
	k$1 = Symbol.for("react.element"),
	l$1 = Symbol.for("react.fragment"),
	m$2 = Object.prototype.hasOwnProperty,
	n$1 = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
	p$2 = { key: !0, ref: !0, __self: !0, __source: !0 };
function q$1(o, i, a) {
	var s,
		$ = {},
		j = null,
		_e = null;
	(a !== void 0 && (j = "" + a),
		i.key !== void 0 && (j = "" + i.key),
		i.ref !== void 0 && (_e = i.ref));
	for (s in i) m$2.call(i, s) && !p$2.hasOwnProperty(s) && ($[s] = i[s]);
	if (o && o.defaultProps) for (s in ((i = o.defaultProps), i)) $[s] === void 0 && ($[s] = i[s]);
	return { $$typeof: k$1, type: o, key: j, ref: _e, props: $, _owner: n$1.current };
}
reactJsxRuntime_production_min.Fragment = l$1;
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
jsxRuntime.exports = reactJsxRuntime_production_min;
var jsxRuntimeExports = jsxRuntime.exports,
	client = {},
	reactDom = { exports: {} },
	reactDom_production_min = {},
	scheduler = { exports: {} },
	scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (o) {
	function i(Ct, St) {
		var kt = Ct.length;
		Ct.push(St);
		e: for (; 0 < kt; ) {
			var Ut = (kt - 1) >>> 1,
				Wt = Ct[Ut];
			if (0 < $(Wt, St)) ((Ct[Ut] = St), (Ct[kt] = Wt), (kt = Ut));
			else break e;
		}
	}
	function a(Ct) {
		return Ct.length === 0 ? null : Ct[0];
	}
	function s(Ct) {
		if (Ct.length === 0) return null;
		var St = Ct[0],
			kt = Ct.pop();
		if (kt !== St) {
			Ct[0] = kt;
			e: for (var Ut = 0, Wt = Ct.length, Xt = Wt >>> 1; Ut < Xt; ) {
				var Gt = 2 * (Ut + 1) - 1,
					er = Ct[Gt],
					Jt = Gt + 1,
					lr = Ct[Jt];
				if (0 > $(er, kt))
					Jt < Wt && 0 > $(lr, er)
						? ((Ct[Ut] = lr), (Ct[Jt] = kt), (Ut = Jt))
						: ((Ct[Ut] = er), (Ct[Gt] = kt), (Ut = Gt));
				else if (Jt < Wt && 0 > $(lr, kt)) ((Ct[Ut] = lr), (Ct[Jt] = kt), (Ut = Jt));
				else break e;
			}
		}
		return St;
	}
	function $(Ct, St) {
		var kt = Ct.sortIndex - St.sortIndex;
		return kt !== 0 ? kt : Ct.id - St.id;
	}
	if (typeof performance == "object" && typeof performance.now == "function") {
		var j = performance;
		o.unstable_now = function () {
			return j.now();
		};
	} else {
		var _e = Date,
			et = _e.now();
		o.unstable_now = function () {
			return _e.now() - et;
		};
	}
	var tt = [],
		rt = [],
		nt = 1,
		it = null,
		ot = 3,
		st = !1,
		lt = !1,
		dt = !1,
		pt = typeof setTimeout == "function" ? setTimeout : null,
		ct = typeof clearTimeout == "function" ? clearTimeout : null,
		at = typeof setImmediate < "u" ? setImmediate : null;
	typeof navigator < "u" &&
		navigator.scheduling !== void 0 &&
		navigator.scheduling.isInputPending !== void 0 &&
		navigator.scheduling.isInputPending.bind(navigator.scheduling);
	function ft(Ct) {
		for (var St = a(rt); St !== null; ) {
			if (St.callback === null) s(rt);
			else if (St.startTime <= Ct) (s(rt), (St.sortIndex = St.expirationTime), i(tt, St));
			else break;
			St = a(rt);
		}
	}
	function ut(Ct) {
		if (((dt = !1), ft(Ct), !lt))
			if (a(tt) !== null) ((lt = !0), jt(ht));
			else {
				var St = a(rt);
				St !== null && It(ut, St.startTime - Ct);
			}
	}
	function ht(Ct, St) {
		((lt = !1), dt && ((dt = !1), ct(Et), (Et = -1)), (st = !0));
		var kt = ot;
		try {
			for (ft(St), it = a(tt); it !== null && (!(it.expirationTime > St) || (Ct && !Tt())); ) {
				var Ut = it.callback;
				if (typeof Ut == "function") {
					((it.callback = null), (ot = it.priorityLevel));
					var Wt = Ut(it.expirationTime <= St);
					((St = o.unstable_now()),
						typeof Wt == "function" ? (it.callback = Wt) : it === a(tt) && s(tt),
						ft(St));
				} else s(tt);
				it = a(tt);
			}
			if (it !== null) var Xt = !0;
			else {
				var Gt = a(rt);
				(Gt !== null && It(ut, Gt.startTime - St), (Xt = !1));
			}
			return Xt;
		} finally {
			((it = null), (ot = kt), (st = !1));
		}
	}
	var yt = !1,
		mt = null,
		Et = -1,
		Rt = 5,
		vt = -1;
	function Tt() {
		return !(o.unstable_now() - vt < Rt);
	}
	function Pt() {
		if (mt !== null) {
			var Ct = o.unstable_now();
			vt = Ct;
			var St = !0;
			try {
				St = mt(!0, Ct);
			} finally {
				St ? Dt() : ((yt = !1), (mt = null));
			}
		} else yt = !1;
	}
	var Dt;
	if (typeof at == "function")
		Dt = function () {
			at(Pt);
		};
	else if (typeof MessageChannel < "u") {
		var Nt = new MessageChannel(),
			$t = Nt.port2;
		((Nt.port1.onmessage = Pt),
			(Dt = function () {
				$t.postMessage(null);
			}));
	} else
		Dt = function () {
			pt(Pt, 0);
		};
	function jt(Ct) {
		((mt = Ct), yt || ((yt = !0), Dt()));
	}
	function It(Ct, St) {
		Et = pt(function () {
			Ct(o.unstable_now());
		}, St);
	}
	((o.unstable_IdlePriority = 5),
		(o.unstable_ImmediatePriority = 1),
		(o.unstable_LowPriority = 4),
		(o.unstable_NormalPriority = 3),
		(o.unstable_Profiling = null),
		(o.unstable_UserBlockingPriority = 2),
		(o.unstable_cancelCallback = function (Ct) {
			Ct.callback = null;
		}),
		(o.unstable_continueExecution = function () {
			lt || st || ((lt = !0), jt(ht));
		}),
		(o.unstable_forceFrameRate = function (Ct) {
			0 > Ct || 125 < Ct
				? console.error(
						"forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
					)
				: (Rt = 0 < Ct ? Math.floor(1e3 / Ct) : 5);
		}),
		(o.unstable_getCurrentPriorityLevel = function () {
			return ot;
		}),
		(o.unstable_getFirstCallbackNode = function () {
			return a(tt);
		}),
		(o.unstable_next = function (Ct) {
			switch (ot) {
				case 1:
				case 2:
				case 3:
					var St = 3;
					break;
				default:
					St = ot;
			}
			var kt = ot;
			ot = St;
			try {
				return Ct();
			} finally {
				ot = kt;
			}
		}),
		(o.unstable_pauseExecution = function () {}),
		(o.unstable_requestPaint = function () {}),
		(o.unstable_runWithPriority = function (Ct, St) {
			switch (Ct) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
					break;
				default:
					Ct = 3;
			}
			var kt = ot;
			ot = Ct;
			try {
				return St();
			} finally {
				ot = kt;
			}
		}),
		(o.unstable_scheduleCallback = function (Ct, St, kt) {
			var Ut = o.unstable_now();
			switch (
				(typeof kt == "object" && kt !== null
					? ((kt = kt.delay), (kt = typeof kt == "number" && 0 < kt ? Ut + kt : Ut))
					: (kt = Ut),
				Ct)
			) {
				case 1:
					var Wt = -1;
					break;
				case 2:
					Wt = 250;
					break;
				case 5:
					Wt = 1073741823;
					break;
				case 4:
					Wt = 1e4;
					break;
				default:
					Wt = 5e3;
			}
			return (
				(Wt = kt + Wt),
				(Ct = {
					id: nt++,
					callback: St,
					priorityLevel: Ct,
					startTime: kt,
					expirationTime: Wt,
					sortIndex: -1,
				}),
				kt > Ut
					? ((Ct.sortIndex = kt),
						i(rt, Ct),
						a(tt) === null &&
							Ct === a(rt) &&
							(dt ? (ct(Et), (Et = -1)) : (dt = !0), It(ut, kt - Ut)))
					: ((Ct.sortIndex = Wt), i(tt, Ct), lt || st || ((lt = !0), jt(ht))),
				Ct
			);
		}),
		(o.unstable_shouldYield = Tt),
		(o.unstable_wrapCallback = function (Ct) {
			var St = ot;
			return function () {
				var kt = ot;
				ot = St;
				try {
					return Ct.apply(this, arguments);
				} finally {
					ot = kt;
				}
			};
		}));
})(scheduler_production_min);
scheduler.exports = scheduler_production_min;
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var aa = reactExports,
	ca = schedulerExports;
function p$1(o) {
	for (
		var i = "https://reactjs.org/docs/error-decoder.html?invariant=" + o, a = 1;
		a < arguments.length;
		a++
	)
		i += "&args[]=" + encodeURIComponent(arguments[a]);
	return (
		"Minified React error #" +
		o +
		"; visit " +
		i +
		" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	);
}
var da = new Set(),
	ea = {};
function fa(o, i) {
	(ha(o, i), ha(o + "Capture", i));
}
function ha(o, i) {
	for (ea[o] = i, o = 0; o < i.length; o++) da.add(i[o]);
}
var ia = !(
		typeof window > "u" ||
		typeof window.document > "u" ||
		typeof window.document.createElement > "u"
	),
	ja = Object.prototype.hasOwnProperty,
	ka =
		/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
	la = {},
	ma = {};
function oa(o) {
	return ja.call(ma, o) ? !0 : ja.call(la, o) ? !1 : ka.test(o) ? (ma[o] = !0) : ((la[o] = !0), !1);
}
function pa(o, i, a, s) {
	if (a !== null && a.type === 0) return !1;
	switch (typeof i) {
		case "function":
		case "symbol":
			return !0;
		case "boolean":
			return s
				? !1
				: a !== null
					? !a.acceptsBooleans
					: ((o = o.toLowerCase().slice(0, 5)), o !== "data-" && o !== "aria-");
		default:
			return !1;
	}
}
function qa(o, i, a, s) {
	if (i === null || typeof i > "u" || pa(o, i, a, s)) return !0;
	if (s) return !1;
	if (a !== null)
		switch (a.type) {
			case 3:
				return !i;
			case 4:
				return i === !1;
			case 5:
				return isNaN(i);
			case 6:
				return isNaN(i) || 1 > i;
		}
	return !1;
}
function v$1(o, i, a, s, $, j, _e) {
	((this.acceptsBooleans = i === 2 || i === 3 || i === 4),
		(this.attributeName = s),
		(this.attributeNamespace = $),
		(this.mustUseProperty = a),
		(this.propertyName = o),
		(this.type = i),
		(this.sanitizeURL = j),
		(this.removeEmptyString = _e));
}
var z$1 = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
	.split(" ")
	.forEach(function (o) {
		z$1[o] = new v$1(o, 0, !1, o, null, !1, !1);
	});
[
	["acceptCharset", "accept-charset"],
	["className", "class"],
	["htmlFor", "for"],
	["httpEquiv", "http-equiv"],
].forEach(function (o) {
	var i = o[0];
	z$1[i] = new v$1(i, 1, !1, o[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (o) {
	z$1[o] = new v$1(o, 2, !1, o.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (o) {
	z$1[o] = new v$1(o, 2, !1, o, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
	.split(" ")
	.forEach(function (o) {
		z$1[o] = new v$1(o, 3, !1, o.toLowerCase(), null, !1, !1);
	});
["checked", "multiple", "muted", "selected"].forEach(function (o) {
	z$1[o] = new v$1(o, 3, !0, o, null, !1, !1);
});
["capture", "download"].forEach(function (o) {
	z$1[o] = new v$1(o, 4, !1, o, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (o) {
	z$1[o] = new v$1(o, 6, !1, o, null, !1, !1);
});
["rowSpan", "start"].forEach(function (o) {
	z$1[o] = new v$1(o, 5, !1, o.toLowerCase(), null, !1, !1);
});
var ra = /[\-:]([a-z])/g;
function sa(o) {
	return o[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
	.split(" ")
	.forEach(function (o) {
		var i = o.replace(ra, sa);
		z$1[i] = new v$1(i, 1, !1, o, null, !1, !1);
	});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
	.split(" ")
	.forEach(function (o) {
		var i = o.replace(ra, sa);
		z$1[i] = new v$1(i, 1, !1, o, "http://www.w3.org/1999/xlink", !1, !1);
	});
["xml:base", "xml:lang", "xml:space"].forEach(function (o) {
	var i = o.replace(ra, sa);
	z$1[i] = new v$1(i, 1, !1, o, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (o) {
	z$1[o] = new v$1(o, 1, !1, o.toLowerCase(), null, !1, !1);
});
z$1.xlinkHref = new v$1("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function (o) {
	z$1[o] = new v$1(o, 1, !1, o.toLowerCase(), null, !0, !0);
});
function ta(o, i, a, s) {
	var $ = z$1.hasOwnProperty(i) ? z$1[i] : null;
	($ !== null
		? $.type !== 0
		: s || !(2 < i.length) || (i[0] !== "o" && i[0] !== "O") || (i[1] !== "n" && i[1] !== "N")) &&
		(qa(i, a, $, s) && (a = null),
		s || $ === null
			? oa(i) && (a === null ? o.removeAttribute(i) : o.setAttribute(i, "" + a))
			: $.mustUseProperty
				? (o[$.propertyName] = a === null ? ($.type === 3 ? !1 : "") : a)
				: ((i = $.attributeName),
					(s = $.attributeNamespace),
					a === null
						? o.removeAttribute(i)
						: (($ = $.type),
							(a = $ === 3 || ($ === 4 && a === !0) ? "" : "" + a),
							s ? o.setAttributeNS(s, i, a) : o.setAttribute(i, a))));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
	va = Symbol.for("react.element"),
	wa = Symbol.for("react.portal"),
	ya = Symbol.for("react.fragment"),
	za = Symbol.for("react.strict_mode"),
	Aa = Symbol.for("react.profiler"),
	Ba = Symbol.for("react.provider"),
	Ca = Symbol.for("react.context"),
	Da = Symbol.for("react.forward_ref"),
	Ea = Symbol.for("react.suspense"),
	Fa = Symbol.for("react.suspense_list"),
	Ga = Symbol.for("react.memo"),
	Ha = Symbol.for("react.lazy"),
	Ia = Symbol.for("react.offscreen"),
	Ja = Symbol.iterator;
function Ka(o) {
	return o === null || typeof o != "object"
		? null
		: ((o = (Ja && o[Ja]) || o["@@iterator"]), typeof o == "function" ? o : null);
}
var A$1 = Object.assign,
	La;
function Ma(o) {
	if (La === void 0)
		try {
			throw Error();
		} catch (a) {
			var i = a.stack.trim().match(/\n( *(at )?)/);
			La = (i && i[1]) || "";
		}
	return (
		`
` +
		La +
		o
	);
}
var Na = !1;
function Oa(o, i) {
	if (!o || Na) return "";
	Na = !0;
	var a = Error.prepareStackTrace;
	Error.prepareStackTrace = void 0;
	try {
		if (i)
			if (
				((i = function () {
					throw Error();
				}),
				Object.defineProperty(i.prototype, "props", {
					set: function () {
						throw Error();
					},
				}),
				typeof Reflect == "object" && Reflect.construct)
			) {
				try {
					Reflect.construct(i, []);
				} catch (rt) {
					var s = rt;
				}
				Reflect.construct(o, [], i);
			} else {
				try {
					i.call();
				} catch (rt) {
					s = rt;
				}
				o.call(i.prototype);
			}
		else {
			try {
				throw Error();
			} catch (rt) {
				s = rt;
			}
			o();
		}
	} catch (rt) {
		if (rt && s && typeof rt.stack == "string") {
			for (
				var $ = rt.stack.split(`
`),
					j = s.stack.split(`
`),
					_e = $.length - 1,
					et = j.length - 1;
				1 <= _e && 0 <= et && $[_e] !== j[et];
			)
				et--;
			for (; 1 <= _e && 0 <= et; _e--, et--)
				if ($[_e] !== j[et]) {
					if (_e !== 1 || et !== 1)
						do
							if ((_e--, et--, 0 > et || $[_e] !== j[et])) {
								var tt =
									`
` + $[_e].replace(" at new ", " at ");
								return (
									o.displayName &&
										tt.includes("<anonymous>") &&
										(tt = tt.replace("<anonymous>", o.displayName)),
									tt
								);
							}
						while (1 <= _e && 0 <= et);
					break;
				}
		}
	} finally {
		((Na = !1), (Error.prepareStackTrace = a));
	}
	return (o = o ? o.displayName || o.name : "") ? Ma(o) : "";
}
function Pa(o) {
	switch (o.tag) {
		case 5:
			return Ma(o.type);
		case 16:
			return Ma("Lazy");
		case 13:
			return Ma("Suspense");
		case 19:
			return Ma("SuspenseList");
		case 0:
		case 2:
		case 15:
			return ((o = Oa(o.type, !1)), o);
		case 11:
			return ((o = Oa(o.type.render, !1)), o);
		case 1:
			return ((o = Oa(o.type, !0)), o);
		default:
			return "";
	}
}
function Qa(o) {
	if (o == null) return null;
	if (typeof o == "function") return o.displayName || o.name || null;
	if (typeof o == "string") return o;
	switch (o) {
		case ya:
			return "Fragment";
		case wa:
			return "Portal";
		case Aa:
			return "Profiler";
		case za:
			return "StrictMode";
		case Ea:
			return "Suspense";
		case Fa:
			return "SuspenseList";
	}
	if (typeof o == "object")
		switch (o.$$typeof) {
			case Ca:
				return (o.displayName || "Context") + ".Consumer";
			case Ba:
				return (o._context.displayName || "Context") + ".Provider";
			case Da:
				var i = o.render;
				return (
					(o = o.displayName),
					o ||
						((o = i.displayName || i.name || ""),
						(o = o !== "" ? "ForwardRef(" + o + ")" : "ForwardRef")),
					o
				);
			case Ga:
				return ((i = o.displayName || null), i !== null ? i : Qa(o.type) || "Memo");
			case Ha:
				((i = o._payload), (o = o._init));
				try {
					return Qa(o(i));
				} catch {}
		}
	return null;
}
function Ra(o) {
	var i = o.type;
	switch (o.tag) {
		case 24:
			return "Cache";
		case 9:
			return (i.displayName || "Context") + ".Consumer";
		case 10:
			return (i._context.displayName || "Context") + ".Provider";
		case 18:
			return "DehydratedFragment";
		case 11:
			return (
				(o = i.render),
				(o = o.displayName || o.name || ""),
				i.displayName || (o !== "" ? "ForwardRef(" + o + ")" : "ForwardRef")
			);
		case 7:
			return "Fragment";
		case 5:
			return i;
		case 4:
			return "Portal";
		case 3:
			return "Root";
		case 6:
			return "Text";
		case 16:
			return Qa(i);
		case 8:
			return i === za ? "StrictMode" : "Mode";
		case 22:
			return "Offscreen";
		case 12:
			return "Profiler";
		case 21:
			return "Scope";
		case 13:
			return "Suspense";
		case 19:
			return "SuspenseList";
		case 25:
			return "TracingMarker";
		case 1:
		case 0:
		case 17:
		case 2:
		case 14:
		case 15:
			if (typeof i == "function") return i.displayName || i.name || null;
			if (typeof i == "string") return i;
	}
	return null;
}
function Sa(o) {
	switch (typeof o) {
		case "boolean":
		case "number":
		case "string":
		case "undefined":
			return o;
		case "object":
			return o;
		default:
			return "";
	}
}
function Ta(o) {
	var i = o.type;
	return (o = o.nodeName) && o.toLowerCase() === "input" && (i === "checkbox" || i === "radio");
}
function Ua(o) {
	var i = Ta(o) ? "checked" : "value",
		a = Object.getOwnPropertyDescriptor(o.constructor.prototype, i),
		s = "" + o[i];
	if (
		!o.hasOwnProperty(i) &&
		typeof a < "u" &&
		typeof a.get == "function" &&
		typeof a.set == "function"
	) {
		var $ = a.get,
			j = a.set;
		return (
			Object.defineProperty(o, i, {
				configurable: !0,
				get: function () {
					return $.call(this);
				},
				set: function (_e) {
					((s = "" + _e), j.call(this, _e));
				},
			}),
			Object.defineProperty(o, i, { enumerable: a.enumerable }),
			{
				getValue: function () {
					return s;
				},
				setValue: function (_e) {
					s = "" + _e;
				},
				stopTracking: function () {
					((o._valueTracker = null), delete o[i]);
				},
			}
		);
	}
}
function Va(o) {
	o._valueTracker || (o._valueTracker = Ua(o));
}
function Wa(o) {
	if (!o) return !1;
	var i = o._valueTracker;
	if (!i) return !0;
	var a = i.getValue(),
		s = "";
	return (
		o && (s = Ta(o) ? (o.checked ? "true" : "false") : o.value),
		(o = s),
		o !== a ? (i.setValue(o), !0) : !1
	);
}
function Xa(o) {
	if (((o = o || (typeof document < "u" ? document : void 0)), typeof o > "u")) return null;
	try {
		return o.activeElement || o.body;
	} catch {
		return o.body;
	}
}
function Ya(o, i) {
	var a = i.checked;
	return A$1({}, i, {
		defaultChecked: void 0,
		defaultValue: void 0,
		value: void 0,
		checked: a ?? o._wrapperState.initialChecked,
	});
}
function Za(o, i) {
	var a = i.defaultValue == null ? "" : i.defaultValue,
		s = i.checked != null ? i.checked : i.defaultChecked;
	((a = Sa(i.value != null ? i.value : a)),
		(o._wrapperState = {
			initialChecked: s,
			initialValue: a,
			controlled: i.type === "checkbox" || i.type === "radio" ? i.checked != null : i.value != null,
		}));
}
function ab(o, i) {
	((i = i.checked), i != null && ta(o, "checked", i, !1));
}
function bb(o, i) {
	ab(o, i);
	var a = Sa(i.value),
		s = i.type;
	if (a != null)
		s === "number"
			? ((a === 0 && o.value === "") || o.value != a) && (o.value = "" + a)
			: o.value !== "" + a && (o.value = "" + a);
	else if (s === "submit" || s === "reset") {
		o.removeAttribute("value");
		return;
	}
	(i.hasOwnProperty("value")
		? cb(o, i.type, a)
		: i.hasOwnProperty("defaultValue") && cb(o, i.type, Sa(i.defaultValue)),
		i.checked == null && i.defaultChecked != null && (o.defaultChecked = !!i.defaultChecked));
}
function db(o, i, a) {
	if (i.hasOwnProperty("value") || i.hasOwnProperty("defaultValue")) {
		var s = i.type;
		if (!((s !== "submit" && s !== "reset") || (i.value !== void 0 && i.value !== null))) return;
		((i = "" + o._wrapperState.initialValue),
			a || i === o.value || (o.value = i),
			(o.defaultValue = i));
	}
	((a = o.name),
		a !== "" && (o.name = ""),
		(o.defaultChecked = !!o._wrapperState.initialChecked),
		a !== "" && (o.name = a));
}
function cb(o, i, a) {
	(i !== "number" || Xa(o.ownerDocument) !== o) &&
		(a == null
			? (o.defaultValue = "" + o._wrapperState.initialValue)
			: o.defaultValue !== "" + a && (o.defaultValue = "" + a));
}
var eb = Array.isArray;
function fb(o, i, a, s) {
	if (((o = o.options), i)) {
		i = {};
		for (var $ = 0; $ < a.length; $++) i["$" + a[$]] = !0;
		for (a = 0; a < o.length; a++)
			(($ = i.hasOwnProperty("$" + o[a].value)),
				o[a].selected !== $ && (o[a].selected = $),
				$ && s && (o[a].defaultSelected = !0));
	} else {
		for (a = "" + Sa(a), i = null, $ = 0; $ < o.length; $++) {
			if (o[$].value === a) {
				((o[$].selected = !0), s && (o[$].defaultSelected = !0));
				return;
			}
			i !== null || o[$].disabled || (i = o[$]);
		}
		i !== null && (i.selected = !0);
	}
}
function gb(o, i) {
	if (i.dangerouslySetInnerHTML != null) throw Error(p$1(91));
	return A$1({}, i, {
		value: void 0,
		defaultValue: void 0,
		children: "" + o._wrapperState.initialValue,
	});
}
function hb(o, i) {
	var a = i.value;
	if (a == null) {
		if (((a = i.children), (i = i.defaultValue), a != null)) {
			if (i != null) throw Error(p$1(92));
			if (eb(a)) {
				if (1 < a.length) throw Error(p$1(93));
				a = a[0];
			}
			i = a;
		}
		(i == null && (i = ""), (a = i));
	}
	o._wrapperState = { initialValue: Sa(a) };
}
function ib(o, i) {
	var a = Sa(i.value),
		s = Sa(i.defaultValue);
	(a != null &&
		((a = "" + a),
		a !== o.value && (o.value = a),
		i.defaultValue == null && o.defaultValue !== a && (o.defaultValue = a)),
		s != null && (o.defaultValue = "" + s));
}
function jb(o) {
	var i = o.textContent;
	i === o._wrapperState.initialValue && i !== "" && i !== null && (o.value = i);
}
function kb(o) {
	switch (o) {
		case "svg":
			return "http://www.w3.org/2000/svg";
		case "math":
			return "http://www.w3.org/1998/Math/MathML";
		default:
			return "http://www.w3.org/1999/xhtml";
	}
}
function lb(o, i) {
	return o == null || o === "http://www.w3.org/1999/xhtml"
		? kb(i)
		: o === "http://www.w3.org/2000/svg" && i === "foreignObject"
			? "http://www.w3.org/1999/xhtml"
			: o;
}
var mb,
	nb = (function (o) {
		return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
			? function (i, a, s, $) {
					MSApp.execUnsafeLocalFunction(function () {
						return o(i, a, s, $);
					});
				}
			: o;
	})(function (o, i) {
		if (o.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in o) o.innerHTML = i;
		else {
			for (
				mb = mb || document.createElement("div"),
					mb.innerHTML = "<svg>" + i.valueOf().toString() + "</svg>",
					i = mb.firstChild;
				o.firstChild;
			)
				o.removeChild(o.firstChild);
			for (; i.firstChild; ) o.appendChild(i.firstChild);
		}
	});
function ob(o, i) {
	if (i) {
		var a = o.firstChild;
		if (a && a === o.lastChild && a.nodeType === 3) {
			a.nodeValue = i;
			return;
		}
	}
	o.textContent = i;
}
var pb = {
		animationIterationCount: !0,
		aspectRatio: !0,
		borderImageOutset: !0,
		borderImageSlice: !0,
		borderImageWidth: !0,
		boxFlex: !0,
		boxFlexGroup: !0,
		boxOrdinalGroup: !0,
		columnCount: !0,
		columns: !0,
		flex: !0,
		flexGrow: !0,
		flexPositive: !0,
		flexShrink: !0,
		flexNegative: !0,
		flexOrder: !0,
		gridArea: !0,
		gridRow: !0,
		gridRowEnd: !0,
		gridRowSpan: !0,
		gridRowStart: !0,
		gridColumn: !0,
		gridColumnEnd: !0,
		gridColumnSpan: !0,
		gridColumnStart: !0,
		fontWeight: !0,
		lineClamp: !0,
		lineHeight: !0,
		opacity: !0,
		order: !0,
		orphans: !0,
		tabSize: !0,
		widows: !0,
		zIndex: !0,
		zoom: !0,
		fillOpacity: !0,
		floodOpacity: !0,
		stopOpacity: !0,
		strokeDasharray: !0,
		strokeDashoffset: !0,
		strokeMiterlimit: !0,
		strokeOpacity: !0,
		strokeWidth: !0,
	},
	qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function (o) {
	qb.forEach(function (i) {
		((i = i + o.charAt(0).toUpperCase() + o.substring(1)), (pb[i] = pb[o]));
	});
});
function rb(o, i, a) {
	return i == null || typeof i == "boolean" || i === ""
		? ""
		: a || typeof i != "number" || i === 0 || (pb.hasOwnProperty(o) && pb[o])
			? ("" + i).trim()
			: i + "px";
}
function sb(o, i) {
	o = o.style;
	for (var a in i)
		if (i.hasOwnProperty(a)) {
			var s = a.indexOf("--") === 0,
				$ = rb(a, i[a], s);
			(a === "float" && (a = "cssFloat"), s ? o.setProperty(a, $) : (o[a] = $));
		}
}
var tb = A$1(
	{ menuitem: !0 },
	{
		area: !0,
		base: !0,
		br: !0,
		col: !0,
		embed: !0,
		hr: !0,
		img: !0,
		input: !0,
		keygen: !0,
		link: !0,
		meta: !0,
		param: !0,
		source: !0,
		track: !0,
		wbr: !0,
	}
);
function ub(o, i) {
	if (i) {
		if (tb[o] && (i.children != null || i.dangerouslySetInnerHTML != null))
			throw Error(p$1(137, o));
		if (i.dangerouslySetInnerHTML != null) {
			if (i.children != null) throw Error(p$1(60));
			if (typeof i.dangerouslySetInnerHTML != "object" || !("__html" in i.dangerouslySetInnerHTML))
				throw Error(p$1(61));
		}
		if (i.style != null && typeof i.style != "object") throw Error(p$1(62));
	}
}
function vb(o, i) {
	if (o.indexOf("-") === -1) return typeof i.is == "string";
	switch (o) {
		case "annotation-xml":
		case "color-profile":
		case "font-face":
		case "font-face-src":
		case "font-face-uri":
		case "font-face-format":
		case "font-face-name":
		case "missing-glyph":
			return !1;
		default:
			return !0;
	}
}
var wb = null;
function xb(o) {
	return (
		(o = o.target || o.srcElement || window),
		o.correspondingUseElement && (o = o.correspondingUseElement),
		o.nodeType === 3 ? o.parentNode : o
	);
}
var yb = null,
	zb = null,
	Ab = null;
function Bb(o) {
	if ((o = Cb(o))) {
		if (typeof yb != "function") throw Error(p$1(280));
		var i = o.stateNode;
		i && ((i = Db(i)), yb(o.stateNode, o.type, i));
	}
}
function Eb(o) {
	zb ? (Ab ? Ab.push(o) : (Ab = [o])) : (zb = o);
}
function Fb() {
	if (zb) {
		var o = zb,
			i = Ab;
		if (((Ab = zb = null), Bb(o), i)) for (o = 0; o < i.length; o++) Bb(i[o]);
	}
}
function Gb(o, i) {
	return o(i);
}
function Hb() {}
var Ib = !1;
function Jb(o, i, a) {
	if (Ib) return o(i, a);
	Ib = !0;
	try {
		return Gb(o, i, a);
	} finally {
		((Ib = !1), (zb !== null || Ab !== null) && (Hb(), Fb()));
	}
}
function Kb(o, i) {
	var a = o.stateNode;
	if (a === null) return null;
	var s = Db(a);
	if (s === null) return null;
	a = s[i];
	e: switch (i) {
		case "onClick":
		case "onClickCapture":
		case "onDoubleClick":
		case "onDoubleClickCapture":
		case "onMouseDown":
		case "onMouseDownCapture":
		case "onMouseMove":
		case "onMouseMoveCapture":
		case "onMouseUp":
		case "onMouseUpCapture":
		case "onMouseEnter":
			((s = !s.disabled) ||
				((o = o.type),
				(s = !(o === "button" || o === "input" || o === "select" || o === "textarea"))),
				(o = !s));
			break e;
		default:
			o = !1;
	}
	if (o) return null;
	if (a && typeof a != "function") throw Error(p$1(231, i, typeof a));
	return a;
}
var Lb = !1;
if (ia)
	try {
		var Mb = {};
		(Object.defineProperty(Mb, "passive", {
			get: function () {
				Lb = !0;
			},
		}),
			window.addEventListener("test", Mb, Mb),
			window.removeEventListener("test", Mb, Mb));
	} catch {
		Lb = !1;
	}
function Nb(o, i, a, s, $, j, _e, et, tt) {
	var rt = Array.prototype.slice.call(arguments, 3);
	try {
		i.apply(a, rt);
	} catch (nt) {
		this.onError(nt);
	}
}
var Ob = !1,
	Pb = null,
	Qb = !1,
	Rb = null,
	Sb = {
		onError: function (o) {
			((Ob = !0), (Pb = o));
		},
	};
function Tb(o, i, a, s, $, j, _e, et, tt) {
	((Ob = !1), (Pb = null), Nb.apply(Sb, arguments));
}
function Ub(o, i, a, s, $, j, _e, et, tt) {
	if ((Tb.apply(this, arguments), Ob)) {
		if (Ob) {
			var rt = Pb;
			((Ob = !1), (Pb = null));
		} else throw Error(p$1(198));
		Qb || ((Qb = !0), (Rb = rt));
	}
}
function Vb(o) {
	var i = o,
		a = o;
	if (o.alternate) for (; i.return; ) i = i.return;
	else {
		o = i;
		do ((i = o), i.flags & 4098 && (a = i.return), (o = i.return));
		while (o);
	}
	return i.tag === 3 ? a : null;
}
function Wb(o) {
	if (o.tag === 13) {
		var i = o.memoizedState;
		if ((i === null && ((o = o.alternate), o !== null && (i = o.memoizedState)), i !== null))
			return i.dehydrated;
	}
	return null;
}
function Xb(o) {
	if (Vb(o) !== o) throw Error(p$1(188));
}
function Yb(o) {
	var i = o.alternate;
	if (!i) {
		if (((i = Vb(o)), i === null)) throw Error(p$1(188));
		return i !== o ? null : o;
	}
	for (var a = o, s = i; ; ) {
		var $ = a.return;
		if ($ === null) break;
		var j = $.alternate;
		if (j === null) {
			if (((s = $.return), s !== null)) {
				a = s;
				continue;
			}
			break;
		}
		if ($.child === j.child) {
			for (j = $.child; j; ) {
				if (j === a) return (Xb($), o);
				if (j === s) return (Xb($), i);
				j = j.sibling;
			}
			throw Error(p$1(188));
		}
		if (a.return !== s.return) ((a = $), (s = j));
		else {
			for (var _e = !1, et = $.child; et; ) {
				if (et === a) {
					((_e = !0), (a = $), (s = j));
					break;
				}
				if (et === s) {
					((_e = !0), (s = $), (a = j));
					break;
				}
				et = et.sibling;
			}
			if (!_e) {
				for (et = j.child; et; ) {
					if (et === a) {
						((_e = !0), (a = j), (s = $));
						break;
					}
					if (et === s) {
						((_e = !0), (s = j), (a = $));
						break;
					}
					et = et.sibling;
				}
				if (!_e) throw Error(p$1(189));
			}
		}
		if (a.alternate !== s) throw Error(p$1(190));
	}
	if (a.tag !== 3) throw Error(p$1(188));
	return a.stateNode.current === a ? o : i;
}
function Zb(o) {
	return ((o = Yb(o)), o !== null ? $b(o) : null);
}
function $b(o) {
	if (o.tag === 5 || o.tag === 6) return o;
	for (o = o.child; o !== null; ) {
		var i = $b(o);
		if (i !== null) return i;
		o = o.sibling;
	}
	return null;
}
var ac = ca.unstable_scheduleCallback,
	bc = ca.unstable_cancelCallback,
	cc = ca.unstable_shouldYield,
	dc = ca.unstable_requestPaint,
	B = ca.unstable_now,
	ec = ca.unstable_getCurrentPriorityLevel,
	fc = ca.unstable_ImmediatePriority,
	gc = ca.unstable_UserBlockingPriority,
	hc = ca.unstable_NormalPriority,
	ic = ca.unstable_LowPriority,
	jc = ca.unstable_IdlePriority,
	kc = null,
	lc = null;
function mc(o) {
	if (lc && typeof lc.onCommitFiberRoot == "function")
		try {
			lc.onCommitFiberRoot(kc, o, void 0, (o.current.flags & 128) === 128);
		} catch {}
}
var oc = Math.clz32 ? Math.clz32 : nc,
	pc = Math.log,
	qc = Math.LN2;
function nc(o) {
	return ((o >>>= 0), o === 0 ? 32 : (31 - ((pc(o) / qc) | 0)) | 0);
}
var rc = 64,
	sc = 4194304;
function tc(o) {
	switch (o & -o) {
		case 1:
			return 1;
		case 2:
			return 2;
		case 4:
			return 4;
		case 8:
			return 8;
		case 16:
			return 16;
		case 32:
			return 32;
		case 64:
		case 128:
		case 256:
		case 512:
		case 1024:
		case 2048:
		case 4096:
		case 8192:
		case 16384:
		case 32768:
		case 65536:
		case 131072:
		case 262144:
		case 524288:
		case 1048576:
		case 2097152:
			return o & 4194240;
		case 4194304:
		case 8388608:
		case 16777216:
		case 33554432:
		case 67108864:
			return o & 130023424;
		case 134217728:
			return 134217728;
		case 268435456:
			return 268435456;
		case 536870912:
			return 536870912;
		case 1073741824:
			return 1073741824;
		default:
			return o;
	}
}
function uc(o, i) {
	var a = o.pendingLanes;
	if (a === 0) return 0;
	var s = 0,
		$ = o.suspendedLanes,
		j = o.pingedLanes,
		_e = a & 268435455;
	if (_e !== 0) {
		var et = _e & ~$;
		et !== 0 ? (s = tc(et)) : ((j &= _e), j !== 0 && (s = tc(j)));
	} else ((_e = a & ~$), _e !== 0 ? (s = tc(_e)) : j !== 0 && (s = tc(j)));
	if (s === 0) return 0;
	if (
		i !== 0 &&
		i !== s &&
		!(i & $) &&
		(($ = s & -s), (j = i & -i), $ >= j || ($ === 16 && (j & 4194240) !== 0))
	)
		return i;
	if ((s & 4 && (s |= a & 16), (i = o.entangledLanes), i !== 0))
		for (o = o.entanglements, i &= s; 0 < i; )
			((a = 31 - oc(i)), ($ = 1 << a), (s |= o[a]), (i &= ~$));
	return s;
}
function vc(o, i) {
	switch (o) {
		case 1:
		case 2:
		case 4:
			return i + 250;
		case 8:
		case 16:
		case 32:
		case 64:
		case 128:
		case 256:
		case 512:
		case 1024:
		case 2048:
		case 4096:
		case 8192:
		case 16384:
		case 32768:
		case 65536:
		case 131072:
		case 262144:
		case 524288:
		case 1048576:
		case 2097152:
			return i + 5e3;
		case 4194304:
		case 8388608:
		case 16777216:
		case 33554432:
		case 67108864:
			return -1;
		case 134217728:
		case 268435456:
		case 536870912:
		case 1073741824:
			return -1;
		default:
			return -1;
	}
}
function wc(o, i) {
	for (
		var a = o.suspendedLanes, s = o.pingedLanes, $ = o.expirationTimes, j = o.pendingLanes;
		0 < j;
	) {
		var _e = 31 - oc(j),
			et = 1 << _e,
			tt = $[_e];
		(tt === -1 ? (!(et & a) || et & s) && ($[_e] = vc(et, i)) : tt <= i && (o.expiredLanes |= et),
			(j &= ~et));
	}
}
function xc(o) {
	return ((o = o.pendingLanes & -1073741825), o !== 0 ? o : o & 1073741824 ? 1073741824 : 0);
}
function yc() {
	var o = rc;
	return ((rc <<= 1), !(rc & 4194240) && (rc = 64), o);
}
function zc(o) {
	for (var i = [], a = 0; 31 > a; a++) i.push(o);
	return i;
}
function Ac(o, i, a) {
	((o.pendingLanes |= i),
		i !== 536870912 && ((o.suspendedLanes = 0), (o.pingedLanes = 0)),
		(o = o.eventTimes),
		(i = 31 - oc(i)),
		(o[i] = a));
}
function Bc(o, i) {
	var a = o.pendingLanes & ~i;
	((o.pendingLanes = i),
		(o.suspendedLanes = 0),
		(o.pingedLanes = 0),
		(o.expiredLanes &= i),
		(o.mutableReadLanes &= i),
		(o.entangledLanes &= i),
		(i = o.entanglements));
	var s = o.eventTimes;
	for (o = o.expirationTimes; 0 < a; ) {
		var $ = 31 - oc(a),
			j = 1 << $;
		((i[$] = 0), (s[$] = -1), (o[$] = -1), (a &= ~j));
	}
}
function Cc(o, i) {
	var a = (o.entangledLanes |= i);
	for (o = o.entanglements; a; ) {
		var s = 31 - oc(a),
			$ = 1 << s;
		(($ & i) | (o[s] & i) && (o[s] |= i), (a &= ~$));
	}
}
var C = 0;
function Dc(o) {
	return ((o &= -o), 1 < o ? (4 < o ? (o & 268435455 ? 16 : 536870912) : 4) : 1);
}
var Ec,
	Fc,
	Gc,
	Hc,
	Ic,
	Jc = !1,
	Kc = [],
	Lc = null,
	Mc = null,
	Nc = null,
	Oc = new Map(),
	Pc = new Map(),
	Qc = [],
	Rc =
		"mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
			" "
		);
function Sc(o, i) {
	switch (o) {
		case "focusin":
		case "focusout":
			Lc = null;
			break;
		case "dragenter":
		case "dragleave":
			Mc = null;
			break;
		case "mouseover":
		case "mouseout":
			Nc = null;
			break;
		case "pointerover":
		case "pointerout":
			Oc.delete(i.pointerId);
			break;
		case "gotpointercapture":
		case "lostpointercapture":
			Pc.delete(i.pointerId);
	}
}
function Tc(o, i, a, s, $, j) {
	return o === null || o.nativeEvent !== j
		? ((o = {
				blockedOn: i,
				domEventName: a,
				eventSystemFlags: s,
				nativeEvent: j,
				targetContainers: [$],
			}),
			i !== null && ((i = Cb(i)), i !== null && Fc(i)),
			o)
		: ((o.eventSystemFlags |= s),
			(i = o.targetContainers),
			$ !== null && i.indexOf($) === -1 && i.push($),
			o);
}
function Uc(o, i, a, s, $) {
	switch (i) {
		case "focusin":
			return ((Lc = Tc(Lc, o, i, a, s, $)), !0);
		case "dragenter":
			return ((Mc = Tc(Mc, o, i, a, s, $)), !0);
		case "mouseover":
			return ((Nc = Tc(Nc, o, i, a, s, $)), !0);
		case "pointerover":
			var j = $.pointerId;
			return (Oc.set(j, Tc(Oc.get(j) || null, o, i, a, s, $)), !0);
		case "gotpointercapture":
			return ((j = $.pointerId), Pc.set(j, Tc(Pc.get(j) || null, o, i, a, s, $)), !0);
	}
	return !1;
}
function Vc(o) {
	var i = Wc(o.target);
	if (i !== null) {
		var a = Vb(i);
		if (a !== null) {
			if (((i = a.tag), i === 13)) {
				if (((i = Wb(a)), i !== null)) {
					((o.blockedOn = i),
						Ic(o.priority, function () {
							Gc(a);
						}));
					return;
				}
			} else if (i === 3 && a.stateNode.current.memoizedState.isDehydrated) {
				o.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
				return;
			}
		}
	}
	o.blockedOn = null;
}
function Xc(o) {
	if (o.blockedOn !== null) return !1;
	for (var i = o.targetContainers; 0 < i.length; ) {
		var a = Yc(o.domEventName, o.eventSystemFlags, i[0], o.nativeEvent);
		if (a === null) {
			a = o.nativeEvent;
			var s = new a.constructor(a.type, a);
			((wb = s), a.target.dispatchEvent(s), (wb = null));
		} else return ((i = Cb(a)), i !== null && Fc(i), (o.blockedOn = a), !1);
		i.shift();
	}
	return !0;
}
function Zc(o, i, a) {
	Xc(o) && a.delete(i);
}
function $c() {
	((Jc = !1),
		Lc !== null && Xc(Lc) && (Lc = null),
		Mc !== null && Xc(Mc) && (Mc = null),
		Nc !== null && Xc(Nc) && (Nc = null),
		Oc.forEach(Zc),
		Pc.forEach(Zc));
}
function ad(o, i) {
	o.blockedOn === i &&
		((o.blockedOn = null),
		Jc || ((Jc = !0), ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(o) {
	function i($) {
		return ad($, o);
	}
	if (0 < Kc.length) {
		ad(Kc[0], o);
		for (var a = 1; a < Kc.length; a++) {
			var s = Kc[a];
			s.blockedOn === o && (s.blockedOn = null);
		}
	}
	for (
		Lc !== null && ad(Lc, o),
			Mc !== null && ad(Mc, o),
			Nc !== null && ad(Nc, o),
			Oc.forEach(i),
			Pc.forEach(i),
			a = 0;
		a < Qc.length;
		a++
	)
		((s = Qc[a]), s.blockedOn === o && (s.blockedOn = null));
	for (; 0 < Qc.length && ((a = Qc[0]), a.blockedOn === null); )
		(Vc(a), a.blockedOn === null && Qc.shift());
}
var cd = ua.ReactCurrentBatchConfig,
	dd = !0;
function ed(o, i, a, s) {
	var $ = C,
		j = cd.transition;
	cd.transition = null;
	try {
		((C = 1), fd(o, i, a, s));
	} finally {
		((C = $), (cd.transition = j));
	}
}
function gd(o, i, a, s) {
	var $ = C,
		j = cd.transition;
	cd.transition = null;
	try {
		((C = 4), fd(o, i, a, s));
	} finally {
		((C = $), (cd.transition = j));
	}
}
function fd(o, i, a, s) {
	if (dd) {
		var $ = Yc(o, i, a, s);
		if ($ === null) (hd(o, i, s, id, a), Sc(o, s));
		else if (Uc($, o, i, a, s)) s.stopPropagation();
		else if ((Sc(o, s), i & 4 && -1 < Rc.indexOf(o))) {
			for (; $ !== null; ) {
				var j = Cb($);
				if ((j !== null && Ec(j), (j = Yc(o, i, a, s)), j === null && hd(o, i, s, id, a), j === $))
					break;
				$ = j;
			}
			$ !== null && s.stopPropagation();
		} else hd(o, i, s, null, a);
	}
}
var id = null;
function Yc(o, i, a, s) {
	if (((id = null), (o = xb(s)), (o = Wc(o)), o !== null))
		if (((i = Vb(o)), i === null)) o = null;
		else if (((a = i.tag), a === 13)) {
			if (((o = Wb(i)), o !== null)) return o;
			o = null;
		} else if (a === 3) {
			if (i.stateNode.current.memoizedState.isDehydrated)
				return i.tag === 3 ? i.stateNode.containerInfo : null;
			o = null;
		} else i !== o && (o = null);
	return ((id = o), null);
}
function jd(o) {
	switch (o) {
		case "cancel":
		case "click":
		case "close":
		case "contextmenu":
		case "copy":
		case "cut":
		case "auxclick":
		case "dblclick":
		case "dragend":
		case "dragstart":
		case "drop":
		case "focusin":
		case "focusout":
		case "input":
		case "invalid":
		case "keydown":
		case "keypress":
		case "keyup":
		case "mousedown":
		case "mouseup":
		case "paste":
		case "pause":
		case "play":
		case "pointercancel":
		case "pointerdown":
		case "pointerup":
		case "ratechange":
		case "reset":
		case "resize":
		case "seeked":
		case "submit":
		case "touchcancel":
		case "touchend":
		case "touchstart":
		case "volumechange":
		case "change":
		case "selectionchange":
		case "textInput":
		case "compositionstart":
		case "compositionend":
		case "compositionupdate":
		case "beforeblur":
		case "afterblur":
		case "beforeinput":
		case "blur":
		case "fullscreenchange":
		case "focus":
		case "hashchange":
		case "popstate":
		case "select":
		case "selectstart":
			return 1;
		case "drag":
		case "dragenter":
		case "dragexit":
		case "dragleave":
		case "dragover":
		case "mousemove":
		case "mouseout":
		case "mouseover":
		case "pointermove":
		case "pointerout":
		case "pointerover":
		case "scroll":
		case "toggle":
		case "touchmove":
		case "wheel":
		case "mouseenter":
		case "mouseleave":
		case "pointerenter":
		case "pointerleave":
			return 4;
		case "message":
			switch (ec()) {
				case fc:
					return 1;
				case gc:
					return 4;
				case hc:
				case ic:
					return 16;
				case jc:
					return 536870912;
				default:
					return 16;
			}
		default:
			return 16;
	}
}
var kd = null,
	ld = null,
	md = null;
function nd() {
	if (md) return md;
	var o,
		i = ld,
		a = i.length,
		s,
		$ = "value" in kd ? kd.value : kd.textContent,
		j = $.length;
	for (o = 0; o < a && i[o] === $[o]; o++);
	var _e = a - o;
	for (s = 1; s <= _e && i[a - s] === $[j - s]; s++);
	return (md = $.slice(o, 1 < s ? 1 - s : void 0));
}
function od(o) {
	var i = o.keyCode;
	return (
		"charCode" in o ? ((o = o.charCode), o === 0 && i === 13 && (o = 13)) : (o = i),
		o === 10 && (o = 13),
		32 <= o || o === 13 ? o : 0
	);
}
function pd() {
	return !0;
}
function qd() {
	return !1;
}
function rd(o) {
	function i(a, s, $, j, _e) {
		((this._reactName = a),
			(this._targetInst = $),
			(this.type = s),
			(this.nativeEvent = j),
			(this.target = _e),
			(this.currentTarget = null));
		for (var et in o) o.hasOwnProperty(et) && ((a = o[et]), (this[et] = a ? a(j) : j[et]));
		return (
			(this.isDefaultPrevented = (
				j.defaultPrevented != null ? j.defaultPrevented : j.returnValue === !1
			)
				? pd
				: qd),
			(this.isPropagationStopped = qd),
			this
		);
	}
	return (
		A$1(i.prototype, {
			preventDefault: function () {
				this.defaultPrevented = !0;
				var a = this.nativeEvent;
				a &&
					(a.preventDefault
						? a.preventDefault()
						: typeof a.returnValue != "unknown" && (a.returnValue = !1),
					(this.isDefaultPrevented = pd));
			},
			stopPropagation: function () {
				var a = this.nativeEvent;
				a &&
					(a.stopPropagation
						? a.stopPropagation()
						: typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0),
					(this.isPropagationStopped = pd));
			},
			persist: function () {},
			isPersistent: pd,
		}),
		i
	);
}
var sd = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function (o) {
			return o.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0,
	},
	td = rd(sd),
	ud = A$1({}, sd, { view: 0, detail: 0 }),
	vd = rd(ud),
	wd,
	xd,
	yd,
	Ad = A$1({}, ud, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: zd,
		button: 0,
		buttons: 0,
		relatedTarget: function (o) {
			return o.relatedTarget === void 0
				? o.fromElement === o.srcElement
					? o.toElement
					: o.fromElement
				: o.relatedTarget;
		},
		movementX: function (o) {
			return "movementX" in o
				? o.movementX
				: (o !== yd &&
						(yd && o.type === "mousemove"
							? ((wd = o.screenX - yd.screenX), (xd = o.screenY - yd.screenY))
							: (xd = wd = 0),
						(yd = o)),
					wd);
		},
		movementY: function (o) {
			return "movementY" in o ? o.movementY : xd;
		},
	}),
	Bd = rd(Ad),
	Cd = A$1({}, Ad, { dataTransfer: 0 }),
	Dd = rd(Cd),
	Ed = A$1({}, ud, { relatedTarget: 0 }),
	Fd = rd(Ed),
	Gd = A$1({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
	Hd = rd(Gd),
	Id = A$1({}, sd, {
		clipboardData: function (o) {
			return "clipboardData" in o ? o.clipboardData : window.clipboardData;
		},
	}),
	Jd = rd(Id),
	Kd = A$1({}, sd, { data: 0 }),
	Ld = rd(Kd),
	Md = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified",
	},
	Nd = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta",
	},
	Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(o) {
	var i = this.nativeEvent;
	return i.getModifierState ? i.getModifierState(o) : (o = Od[o]) ? !!i[o] : !1;
}
function zd() {
	return Pd;
}
var Qd = A$1({}, ud, {
		key: function (o) {
			if (o.key) {
				var i = Md[o.key] || o.key;
				if (i !== "Unidentified") return i;
			}
			return o.type === "keypress"
				? ((o = od(o)), o === 13 ? "Enter" : String.fromCharCode(o))
				: o.type === "keydown" || o.type === "keyup"
					? Nd[o.keyCode] || "Unidentified"
					: "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: zd,
		charCode: function (o) {
			return o.type === "keypress" ? od(o) : 0;
		},
		keyCode: function (o) {
			return o.type === "keydown" || o.type === "keyup" ? o.keyCode : 0;
		},
		which: function (o) {
			return o.type === "keypress"
				? od(o)
				: o.type === "keydown" || o.type === "keyup"
					? o.keyCode
					: 0;
		},
	}),
	Rd = rd(Qd),
	Sd = A$1({}, Ad, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0,
	}),
	Td = rd(Sd),
	Ud = A$1({}, ud, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: zd,
	}),
	Vd = rd(Ud),
	Wd = A$1({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
	Xd = rd(Wd),
	Yd = A$1({}, Ad, {
		deltaX: function (o) {
			return "deltaX" in o ? o.deltaX : "wheelDeltaX" in o ? -o.wheelDeltaX : 0;
		},
		deltaY: function (o) {
			return "deltaY" in o
				? o.deltaY
				: "wheelDeltaY" in o
					? -o.wheelDeltaY
					: "wheelDelta" in o
						? -o.wheelDelta
						: 0;
		},
		deltaZ: 0,
		deltaMode: 0,
	}),
	Zd = rd(Yd),
	$d = [9, 13, 27, 32],
	ae = ia && "CompositionEvent" in window,
	be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be,
	de = ia && (!ae || (be && 8 < be && 11 >= be)),
	ee = String.fromCharCode(32),
	fe = !1;
function ge(o, i) {
	switch (o) {
		case "keyup":
			return $d.indexOf(i.keyCode) !== -1;
		case "keydown":
			return i.keyCode !== 229;
		case "keypress":
		case "mousedown":
		case "focusout":
			return !0;
		default:
			return !1;
	}
}
function he(o) {
	return ((o = o.detail), typeof o == "object" && "data" in o ? o.data : null);
}
var ie = !1;
function je(o, i) {
	switch (o) {
		case "compositionend":
			return he(i);
		case "keypress":
			return i.which !== 32 ? null : ((fe = !0), ee);
		case "textInput":
			return ((o = i.data), o === ee && fe ? null : o);
		default:
			return null;
	}
}
function ke(o, i) {
	if (ie)
		return o === "compositionend" || (!ae && ge(o, i))
			? ((o = nd()), (md = ld = kd = null), (ie = !1), o)
			: null;
	switch (o) {
		case "paste":
			return null;
		case "keypress":
			if (!(i.ctrlKey || i.altKey || i.metaKey) || (i.ctrlKey && i.altKey)) {
				if (i.char && 1 < i.char.length) return i.char;
				if (i.which) return String.fromCharCode(i.which);
			}
			return null;
		case "compositionend":
			return de && i.locale !== "ko" ? null : i.data;
		default:
			return null;
	}
}
var le = {
	color: !0,
	date: !0,
	datetime: !0,
	"datetime-local": !0,
	email: !0,
	month: !0,
	number: !0,
	password: !0,
	range: !0,
	search: !0,
	tel: !0,
	text: !0,
	time: !0,
	url: !0,
	week: !0,
};
function me(o) {
	var i = o && o.nodeName && o.nodeName.toLowerCase();
	return i === "input" ? !!le[o.type] : i === "textarea";
}
function ne(o, i, a, s) {
	(Eb(s),
		(i = oe(i, "onChange")),
		0 < i.length &&
			((a = new td("onChange", "change", null, a, s)), o.push({ event: a, listeners: i })));
}
var pe = null,
	qe = null;
function re(o) {
	se(o, 0);
}
function te(o) {
	var i = ue(o);
	if (Wa(i)) return o;
}
function ve(o, i) {
	if (o === "change") return i;
}
var we = !1;
if (ia) {
	var xe;
	if (ia) {
		var ye = "oninput" in document;
		if (!ye) {
			var ze = document.createElement("div");
			(ze.setAttribute("oninput", "return;"), (ye = typeof ze.oninput == "function"));
		}
		xe = ye;
	} else xe = !1;
	we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
	pe && (pe.detachEvent("onpropertychange", Be), (qe = pe = null));
}
function Be(o) {
	if (o.propertyName === "value" && te(qe)) {
		var i = [];
		(ne(i, qe, o, xb(o)), Jb(re, i));
	}
}
function Ce(o, i, a) {
	o === "focusin"
		? (Ae(), (pe = i), (qe = a), pe.attachEvent("onpropertychange", Be))
		: o === "focusout" && Ae();
}
function De(o) {
	if (o === "selectionchange" || o === "keyup" || o === "keydown") return te(qe);
}
function Ee(o, i) {
	if (o === "click") return te(i);
}
function Fe(o, i) {
	if (o === "input" || o === "change") return te(i);
}
function Ge(o, i) {
	return (o === i && (o !== 0 || 1 / o === 1 / i)) || (o !== o && i !== i);
}
var He = typeof Object.is == "function" ? Object.is : Ge;
function Ie(o, i) {
	if (He(o, i)) return !0;
	if (typeof o != "object" || o === null || typeof i != "object" || i === null) return !1;
	var a = Object.keys(o),
		s = Object.keys(i);
	if (a.length !== s.length) return !1;
	for (s = 0; s < a.length; s++) {
		var $ = a[s];
		if (!ja.call(i, $) || !He(o[$], i[$])) return !1;
	}
	return !0;
}
function Je(o) {
	for (; o && o.firstChild; ) o = o.firstChild;
	return o;
}
function Ke(o, i) {
	var a = Je(o);
	o = 0;
	for (var s; a; ) {
		if (a.nodeType === 3) {
			if (((s = o + a.textContent.length), o <= i && s >= i)) return { node: a, offset: i - o };
			o = s;
		}
		e: {
			for (; a; ) {
				if (a.nextSibling) {
					a = a.nextSibling;
					break e;
				}
				a = a.parentNode;
			}
			a = void 0;
		}
		a = Je(a);
	}
}
function Le(o, i) {
	return o && i
		? o === i
			? !0
			: o && o.nodeType === 3
				? !1
				: i && i.nodeType === 3
					? Le(o, i.parentNode)
					: "contains" in o
						? o.contains(i)
						: o.compareDocumentPosition
							? !!(o.compareDocumentPosition(i) & 16)
							: !1
		: !1;
}
function Me() {
	for (var o = window, i = Xa(); i instanceof o.HTMLIFrameElement; ) {
		try {
			var a = typeof i.contentWindow.location.href == "string";
		} catch {
			a = !1;
		}
		if (a) o = i.contentWindow;
		else break;
		i = Xa(o.document);
	}
	return i;
}
function Ne(o) {
	var i = o && o.nodeName && o.nodeName.toLowerCase();
	return (
		i &&
		((i === "input" &&
			(o.type === "text" ||
				o.type === "search" ||
				o.type === "tel" ||
				o.type === "url" ||
				o.type === "password")) ||
			i === "textarea" ||
			o.contentEditable === "true")
	);
}
function Oe(o) {
	var i = Me(),
		a = o.focusedElem,
		s = o.selectionRange;
	if (i !== a && a && a.ownerDocument && Le(a.ownerDocument.documentElement, a)) {
		if (s !== null && Ne(a)) {
			if (((i = s.start), (o = s.end), o === void 0 && (o = i), "selectionStart" in a))
				((a.selectionStart = i), (a.selectionEnd = Math.min(o, a.value.length)));
			else if (
				((o = ((i = a.ownerDocument || document) && i.defaultView) || window), o.getSelection)
			) {
				o = o.getSelection();
				var $ = a.textContent.length,
					j = Math.min(s.start, $);
				((s = s.end === void 0 ? j : Math.min(s.end, $)),
					!o.extend && j > s && (($ = s), (s = j), (j = $)),
					($ = Ke(a, j)));
				var _e = Ke(a, s);
				$ &&
					_e &&
					(o.rangeCount !== 1 ||
						o.anchorNode !== $.node ||
						o.anchorOffset !== $.offset ||
						o.focusNode !== _e.node ||
						o.focusOffset !== _e.offset) &&
					((i = i.createRange()),
					i.setStart($.node, $.offset),
					o.removeAllRanges(),
					j > s
						? (o.addRange(i), o.extend(_e.node, _e.offset))
						: (i.setEnd(_e.node, _e.offset), o.addRange(i)));
			}
		}
		for (i = [], o = a; (o = o.parentNode); )
			o.nodeType === 1 && i.push({ element: o, left: o.scrollLeft, top: o.scrollTop });
		for (typeof a.focus == "function" && a.focus(), a = 0; a < i.length; a++)
			((o = i[a]), (o.element.scrollLeft = o.left), (o.element.scrollTop = o.top));
	}
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode,
	Qe = null,
	Re = null,
	Se = null,
	Te = !1;
function Ue(o, i, a) {
	var s = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
	Te ||
		Qe == null ||
		Qe !== Xa(s) ||
		((s = Qe),
		"selectionStart" in s && Ne(s)
			? (s = { start: s.selectionStart, end: s.selectionEnd })
			: ((s = ((s.ownerDocument && s.ownerDocument.defaultView) || window).getSelection()),
				(s = {
					anchorNode: s.anchorNode,
					anchorOffset: s.anchorOffset,
					focusNode: s.focusNode,
					focusOffset: s.focusOffset,
				})),
		(Se && Ie(Se, s)) ||
			((Se = s),
			(s = oe(Re, "onSelect")),
			0 < s.length &&
				((i = new td("onSelect", "select", null, i, a)),
				o.push({ event: i, listeners: s }),
				(i.target = Qe))));
}
function Ve(o, i) {
	var a = {};
	return (
		(a[o.toLowerCase()] = i.toLowerCase()),
		(a["Webkit" + o] = "webkit" + i),
		(a["Moz" + o] = "moz" + i),
		a
	);
}
var We = {
		animationend: Ve("Animation", "AnimationEnd"),
		animationiteration: Ve("Animation", "AnimationIteration"),
		animationstart: Ve("Animation", "AnimationStart"),
		transitionend: Ve("Transition", "TransitionEnd"),
	},
	Xe = {},
	Ye = {};
ia &&
	((Ye = document.createElement("div").style),
	"AnimationEvent" in window ||
		(delete We.animationend.animation,
		delete We.animationiteration.animation,
		delete We.animationstart.animation),
	"TransitionEvent" in window || delete We.transitionend.transition);
function Ze(o) {
	if (Xe[o]) return Xe[o];
	if (!We[o]) return o;
	var i = We[o],
		a;
	for (a in i) if (i.hasOwnProperty(a) && a in Ye) return (Xe[o] = i[a]);
	return o;
}
var $e = Ze("animationend"),
	af = Ze("animationiteration"),
	bf = Ze("animationstart"),
	cf = Ze("transitionend"),
	df = new Map(),
	ef =
		"abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
			" "
		);
function ff(o, i) {
	(df.set(o, i), fa(i, [o]));
}
for (var gf = 0; gf < ef.length; gf++) {
	var hf = ef[gf],
		jf = hf.toLowerCase(),
		kf = hf[0].toUpperCase() + hf.slice(1);
	ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa(
	"onSelect",
	"focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")
);
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf =
		"abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
			" "
		),
	mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(o, i, a) {
	var s = o.type || "unknown-event";
	((o.currentTarget = a), Ub(s, i, void 0, o), (o.currentTarget = null));
}
function se(o, i) {
	i = (i & 4) !== 0;
	for (var a = 0; a < o.length; a++) {
		var s = o[a],
			$ = s.event;
		s = s.listeners;
		e: {
			var j = void 0;
			if (i)
				for (var _e = s.length - 1; 0 <= _e; _e--) {
					var et = s[_e],
						tt = et.instance,
						rt = et.currentTarget;
					if (((et = et.listener), tt !== j && $.isPropagationStopped())) break e;
					(nf($, et, rt), (j = tt));
				}
			else
				for (_e = 0; _e < s.length; _e++) {
					if (
						((et = s[_e]),
						(tt = et.instance),
						(rt = et.currentTarget),
						(et = et.listener),
						tt !== j && $.isPropagationStopped())
					)
						break e;
					(nf($, et, rt), (j = tt));
				}
		}
	}
	if (Qb) throw ((o = Rb), (Qb = !1), (Rb = null), o);
}
function D(o, i) {
	var a = i[of];
	a === void 0 && (a = i[of] = new Set());
	var s = o + "__bubble";
	a.has(s) || (pf(i, o, 2, !1), a.add(s));
}
function qf(o, i, a) {
	var s = 0;
	(i && (s |= 4), pf(a, o, s, i));
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(o) {
	if (!o[rf]) {
		((o[rf] = !0),
			da.forEach(function (a) {
				a !== "selectionchange" && (mf.has(a) || qf(a, !1, o), qf(a, !0, o));
			}));
		var i = o.nodeType === 9 ? o : o.ownerDocument;
		i === null || i[rf] || ((i[rf] = !0), qf("selectionchange", !1, i));
	}
}
function pf(o, i, a, s) {
	switch (jd(i)) {
		case 1:
			var $ = ed;
			break;
		case 4:
			$ = gd;
			break;
		default:
			$ = fd;
	}
	((a = $.bind(null, i, a, o)),
		($ = void 0),
		!Lb || (i !== "touchstart" && i !== "touchmove" && i !== "wheel") || ($ = !0),
		s
			? $ !== void 0
				? o.addEventListener(i, a, { capture: !0, passive: $ })
				: o.addEventListener(i, a, !0)
			: $ !== void 0
				? o.addEventListener(i, a, { passive: $ })
				: o.addEventListener(i, a, !1));
}
function hd(o, i, a, s, $) {
	var j = s;
	if (!(i & 1) && !(i & 2) && s !== null)
		e: for (;;) {
			if (s === null) return;
			var _e = s.tag;
			if (_e === 3 || _e === 4) {
				var et = s.stateNode.containerInfo;
				if (et === $ || (et.nodeType === 8 && et.parentNode === $)) break;
				if (_e === 4)
					for (_e = s.return; _e !== null; ) {
						var tt = _e.tag;
						if (
							(tt === 3 || tt === 4) &&
							((tt = _e.stateNode.containerInfo),
							tt === $ || (tt.nodeType === 8 && tt.parentNode === $))
						)
							return;
						_e = _e.return;
					}
				for (; et !== null; ) {
					if (((_e = Wc(et)), _e === null)) return;
					if (((tt = _e.tag), tt === 5 || tt === 6)) {
						s = j = _e;
						continue e;
					}
					et = et.parentNode;
				}
			}
			s = s.return;
		}
	Jb(function () {
		var rt = j,
			nt = xb(a),
			it = [];
		e: {
			var ot = df.get(o);
			if (ot !== void 0) {
				var st = td,
					lt = o;
				switch (o) {
					case "keypress":
						if (od(a) === 0) break e;
					case "keydown":
					case "keyup":
						st = Rd;
						break;
					case "focusin":
						((lt = "focus"), (st = Fd));
						break;
					case "focusout":
						((lt = "blur"), (st = Fd));
						break;
					case "beforeblur":
					case "afterblur":
						st = Fd;
						break;
					case "click":
						if (a.button === 2) break e;
					case "auxclick":
					case "dblclick":
					case "mousedown":
					case "mousemove":
					case "mouseup":
					case "mouseout":
					case "mouseover":
					case "contextmenu":
						st = Bd;
						break;
					case "drag":
					case "dragend":
					case "dragenter":
					case "dragexit":
					case "dragleave":
					case "dragover":
					case "dragstart":
					case "drop":
						st = Dd;
						break;
					case "touchcancel":
					case "touchend":
					case "touchmove":
					case "touchstart":
						st = Vd;
						break;
					case $e:
					case af:
					case bf:
						st = Hd;
						break;
					case cf:
						st = Xd;
						break;
					case "scroll":
						st = vd;
						break;
					case "wheel":
						st = Zd;
						break;
					case "copy":
					case "cut":
					case "paste":
						st = Jd;
						break;
					case "gotpointercapture":
					case "lostpointercapture":
					case "pointercancel":
					case "pointerdown":
					case "pointermove":
					case "pointerout":
					case "pointerover":
					case "pointerup":
						st = Td;
				}
				var dt = (i & 4) !== 0,
					pt = !dt && o === "scroll",
					ct = dt ? (ot !== null ? ot + "Capture" : null) : ot;
				dt = [];
				for (var at = rt, ft; at !== null; ) {
					ft = at;
					var ut = ft.stateNode;
					if (
						(ft.tag === 5 &&
							ut !== null &&
							((ft = ut),
							ct !== null && ((ut = Kb(at, ct)), ut != null && dt.push(tf(at, ut, ft)))),
						pt)
					)
						break;
					at = at.return;
				}
				0 < dt.length &&
					((ot = new st(ot, lt, null, a, nt)), it.push({ event: ot, listeners: dt }));
			}
		}
		if (!(i & 7)) {
			e: {
				if (
					((ot = o === "mouseover" || o === "pointerover"),
					(st = o === "mouseout" || o === "pointerout"),
					ot && a !== wb && (lt = a.relatedTarget || a.fromElement) && (Wc(lt) || lt[uf]))
				)
					break e;
				if (
					(st || ot) &&
					((ot =
						nt.window === nt
							? nt
							: (ot = nt.ownerDocument)
								? ot.defaultView || ot.parentWindow
								: window),
					st
						? ((lt = a.relatedTarget || a.toElement),
							(st = rt),
							(lt = lt ? Wc(lt) : null),
							lt !== null &&
								((pt = Vb(lt)), lt !== pt || (lt.tag !== 5 && lt.tag !== 6)) &&
								(lt = null))
						: ((st = null), (lt = rt)),
					st !== lt)
				) {
					if (
						((dt = Bd),
						(ut = "onMouseLeave"),
						(ct = "onMouseEnter"),
						(at = "mouse"),
						(o === "pointerout" || o === "pointerover") &&
							((dt = Td), (ut = "onPointerLeave"), (ct = "onPointerEnter"), (at = "pointer")),
						(pt = st == null ? ot : ue(st)),
						(ft = lt == null ? ot : ue(lt)),
						(ot = new dt(ut, at + "leave", st, a, nt)),
						(ot.target = pt),
						(ot.relatedTarget = ft),
						(ut = null),
						Wc(nt) === rt &&
							((dt = new dt(ct, at + "enter", lt, a, nt)),
							(dt.target = ft),
							(dt.relatedTarget = pt),
							(ut = dt)),
						(pt = ut),
						st && lt)
					)
						t: {
							for (dt = st, ct = lt, at = 0, ft = dt; ft; ft = vf(ft)) at++;
							for (ft = 0, ut = ct; ut; ut = vf(ut)) ft++;
							for (; 0 < at - ft; ) ((dt = vf(dt)), at--);
							for (; 0 < ft - at; ) ((ct = vf(ct)), ft--);
							for (; at--; ) {
								if (dt === ct || (ct !== null && dt === ct.alternate)) break t;
								((dt = vf(dt)), (ct = vf(ct)));
							}
							dt = null;
						}
					else dt = null;
					(st !== null && wf(it, ot, st, dt, !1),
						lt !== null && pt !== null && wf(it, pt, lt, dt, !0));
				}
			}
			e: {
				if (
					((ot = rt ? ue(rt) : window),
					(st = ot.nodeName && ot.nodeName.toLowerCase()),
					st === "select" || (st === "input" && ot.type === "file"))
				)
					var ht = ve;
				else if (me(ot))
					if (we) ht = Fe;
					else {
						ht = De;
						var yt = Ce;
					}
				else
					(st = ot.nodeName) &&
						st.toLowerCase() === "input" &&
						(ot.type === "checkbox" || ot.type === "radio") &&
						(ht = Ee);
				if (ht && (ht = ht(o, rt))) {
					ne(it, ht, a, nt);
					break e;
				}
				(yt && yt(o, ot, rt),
					o === "focusout" &&
						(yt = ot._wrapperState) &&
						yt.controlled &&
						ot.type === "number" &&
						cb(ot, "number", ot.value));
			}
			switch (((yt = rt ? ue(rt) : window), o)) {
				case "focusin":
					(me(yt) || yt.contentEditable === "true") && ((Qe = yt), (Re = rt), (Se = null));
					break;
				case "focusout":
					Se = Re = Qe = null;
					break;
				case "mousedown":
					Te = !0;
					break;
				case "contextmenu":
				case "mouseup":
				case "dragend":
					((Te = !1), Ue(it, a, nt));
					break;
				case "selectionchange":
					if (Pe) break;
				case "keydown":
				case "keyup":
					Ue(it, a, nt);
			}
			var mt;
			if (ae)
				e: {
					switch (o) {
						case "compositionstart":
							var Et = "onCompositionStart";
							break e;
						case "compositionend":
							Et = "onCompositionEnd";
							break e;
						case "compositionupdate":
							Et = "onCompositionUpdate";
							break e;
					}
					Et = void 0;
				}
			else
				ie
					? ge(o, a) && (Et = "onCompositionEnd")
					: o === "keydown" && a.keyCode === 229 && (Et = "onCompositionStart");
			(Et &&
				(de &&
					a.locale !== "ko" &&
					(ie || Et !== "onCompositionStart"
						? Et === "onCompositionEnd" && ie && (mt = nd())
						: ((kd = nt), (ld = "value" in kd ? kd.value : kd.textContent), (ie = !0))),
				(yt = oe(rt, Et)),
				0 < yt.length &&
					((Et = new Ld(Et, o, null, a, nt)),
					it.push({ event: Et, listeners: yt }),
					mt ? (Et.data = mt) : ((mt = he(a)), mt !== null && (Et.data = mt)))),
				(mt = ce ? je(o, a) : ke(o, a)) &&
					((rt = oe(rt, "onBeforeInput")),
					0 < rt.length &&
						((nt = new Ld("onBeforeInput", "beforeinput", null, a, nt)),
						it.push({ event: nt, listeners: rt }),
						(nt.data = mt))));
		}
		se(it, i);
	});
}
function tf(o, i, a) {
	return { instance: o, listener: i, currentTarget: a };
}
function oe(o, i) {
	for (var a = i + "Capture", s = []; o !== null; ) {
		var $ = o,
			j = $.stateNode;
		($.tag === 5 &&
			j !== null &&
			(($ = j),
			(j = Kb(o, a)),
			j != null && s.unshift(tf(o, j, $)),
			(j = Kb(o, i)),
			j != null && s.push(tf(o, j, $))),
			(o = o.return));
	}
	return s;
}
function vf(o) {
	if (o === null) return null;
	do o = o.return;
	while (o && o.tag !== 5);
	return o || null;
}
function wf(o, i, a, s, $) {
	for (var j = i._reactName, _e = []; a !== null && a !== s; ) {
		var et = a,
			tt = et.alternate,
			rt = et.stateNode;
		if (tt !== null && tt === s) break;
		(et.tag === 5 &&
			rt !== null &&
			((et = rt),
			$
				? ((tt = Kb(a, j)), tt != null && _e.unshift(tf(a, tt, et)))
				: $ || ((tt = Kb(a, j)), tt != null && _e.push(tf(a, tt, et)))),
			(a = a.return));
	}
	_e.length !== 0 && o.push({ event: i, listeners: _e });
}
var xf = /\r\n?/g,
	yf = /\u0000|\uFFFD/g;
function zf(o) {
	return (typeof o == "string" ? o : "" + o)
		.replace(
			xf,
			`
`
		)
		.replace(yf, "");
}
function Af(o, i, a) {
	if (((i = zf(i)), zf(o) !== i && a)) throw Error(p$1(425));
}
function Bf() {}
var Cf = null,
	Df = null;
function Ef(o, i) {
	return (
		o === "textarea" ||
		o === "noscript" ||
		typeof i.children == "string" ||
		typeof i.children == "number" ||
		(typeof i.dangerouslySetInnerHTML == "object" &&
			i.dangerouslySetInnerHTML !== null &&
			i.dangerouslySetInnerHTML.__html != null)
	);
}
var Ff = typeof setTimeout == "function" ? setTimeout : void 0,
	Gf = typeof clearTimeout == "function" ? clearTimeout : void 0,
	Hf = typeof Promise == "function" ? Promise : void 0,
	Jf =
		typeof queueMicrotask == "function"
			? queueMicrotask
			: typeof Hf < "u"
				? function (o) {
						return Hf.resolve(null).then(o).catch(If);
					}
				: Ff;
function If(o) {
	setTimeout(function () {
		throw o;
	});
}
function Kf(o, i) {
	var a = i,
		s = 0;
	do {
		var $ = a.nextSibling;
		if ((o.removeChild(a), $ && $.nodeType === 8))
			if (((a = $.data), a === "/$")) {
				if (s === 0) {
					(o.removeChild($), bd(i));
					return;
				}
				s--;
			} else (a !== "$" && a !== "$?" && a !== "$!") || s++;
		a = $;
	} while (a);
	bd(i);
}
function Lf(o) {
	for (; o != null; o = o.nextSibling) {
		var i = o.nodeType;
		if (i === 1 || i === 3) break;
		if (i === 8) {
			if (((i = o.data), i === "$" || i === "$!" || i === "$?")) break;
			if (i === "/$") return null;
		}
	}
	return o;
}
function Mf(o) {
	o = o.previousSibling;
	for (var i = 0; o; ) {
		if (o.nodeType === 8) {
			var a = o.data;
			if (a === "$" || a === "$!" || a === "$?") {
				if (i === 0) return o;
				i--;
			} else a === "/$" && i++;
		}
		o = o.previousSibling;
	}
	return null;
}
var Nf = Math.random().toString(36).slice(2),
	Of = "__reactFiber$" + Nf,
	Pf = "__reactProps$" + Nf,
	uf = "__reactContainer$" + Nf,
	of = "__reactEvents$" + Nf,
	Qf = "__reactListeners$" + Nf,
	Rf = "__reactHandles$" + Nf;
function Wc(o) {
	var i = o[Of];
	if (i) return i;
	for (var a = o.parentNode; a; ) {
		if ((i = a[uf] || a[Of])) {
			if (((a = i.alternate), i.child !== null || (a !== null && a.child !== null)))
				for (o = Mf(o); o !== null; ) {
					if ((a = o[Of])) return a;
					o = Mf(o);
				}
			return i;
		}
		((o = a), (a = o.parentNode));
	}
	return null;
}
function Cb(o) {
	return (
		(o = o[Of] || o[uf]),
		!o || (o.tag !== 5 && o.tag !== 6 && o.tag !== 13 && o.tag !== 3) ? null : o
	);
}
function ue(o) {
	if (o.tag === 5 || o.tag === 6) return o.stateNode;
	throw Error(p$1(33));
}
function Db(o) {
	return o[Pf] || null;
}
var Sf = [],
	Tf = -1;
function Uf(o) {
	return { current: o };
}
function E(o) {
	0 > Tf || ((o.current = Sf[Tf]), (Sf[Tf] = null), Tf--);
}
function G(o, i) {
	(Tf++, (Sf[Tf] = o.current), (o.current = i));
}
var Vf = {},
	H = Uf(Vf),
	Wf = Uf(!1),
	Xf = Vf;
function Yf(o, i) {
	var a = o.type.contextTypes;
	if (!a) return Vf;
	var s = o.stateNode;
	if (s && s.__reactInternalMemoizedUnmaskedChildContext === i)
		return s.__reactInternalMemoizedMaskedChildContext;
	var $ = {},
		j;
	for (j in a) $[j] = i[j];
	return (
		s &&
			((o = o.stateNode),
			(o.__reactInternalMemoizedUnmaskedChildContext = i),
			(o.__reactInternalMemoizedMaskedChildContext = $)),
		$
	);
}
function Zf(o) {
	return ((o = o.childContextTypes), o != null);
}
function $f() {
	(E(Wf), E(H));
}
function ag(o, i, a) {
	if (H.current !== Vf) throw Error(p$1(168));
	(G(H, i), G(Wf, a));
}
function bg(o, i, a) {
	var s = o.stateNode;
	if (((i = i.childContextTypes), typeof s.getChildContext != "function")) return a;
	s = s.getChildContext();
	for (var $ in s) if (!($ in i)) throw Error(p$1(108, Ra(o) || "Unknown", $));
	return A$1({}, a, s);
}
function cg(o) {
	return (
		(o = ((o = o.stateNode) && o.__reactInternalMemoizedMergedChildContext) || Vf),
		(Xf = H.current),
		G(H, o),
		G(Wf, Wf.current),
		!0
	);
}
function dg(o, i, a) {
	var s = o.stateNode;
	if (!s) throw Error(p$1(169));
	(a
		? ((o = bg(o, i, Xf)), (s.__reactInternalMemoizedMergedChildContext = o), E(Wf), E(H), G(H, o))
		: E(Wf),
		G(Wf, a));
}
var eg = null,
	fg = !1,
	gg = !1;
function hg(o) {
	eg === null ? (eg = [o]) : eg.push(o);
}
function ig(o) {
	((fg = !0), hg(o));
}
function jg() {
	if (!gg && eg !== null) {
		gg = !0;
		var o = 0,
			i = C;
		try {
			var a = eg;
			for (C = 1; o < a.length; o++) {
				var s = a[o];
				do s = s(!0);
				while (s !== null);
			}
			((eg = null), (fg = !1));
		} catch ($) {
			throw (eg !== null && (eg = eg.slice(o + 1)), ac(fc, jg), $);
		} finally {
			((C = i), (gg = !1));
		}
	}
	return null;
}
var kg = [],
	lg = 0,
	mg = null,
	ng = 0,
	og = [],
	pg = 0,
	qg = null,
	rg = 1,
	sg = "";
function tg(o, i) {
	((kg[lg++] = ng), (kg[lg++] = mg), (mg = o), (ng = i));
}
function ug(o, i, a) {
	((og[pg++] = rg), (og[pg++] = sg), (og[pg++] = qg), (qg = o));
	var s = rg;
	o = sg;
	var $ = 32 - oc(s) - 1;
	((s &= ~(1 << $)), (a += 1));
	var j = 32 - oc(i) + $;
	if (30 < j) {
		var _e = $ - ($ % 5);
		((j = (s & ((1 << _e) - 1)).toString(32)),
			(s >>= _e),
			($ -= _e),
			(rg = (1 << (32 - oc(i) + $)) | (a << $) | s),
			(sg = j + o));
	} else ((rg = (1 << j) | (a << $) | s), (sg = o));
}
function vg(o) {
	o.return !== null && (tg(o, 1), ug(o, 1, 0));
}
function wg(o) {
	for (; o === mg; ) ((mg = kg[--lg]), (kg[lg] = null), (ng = kg[--lg]), (kg[lg] = null));
	for (; o === qg; )
		((qg = og[--pg]),
			(og[pg] = null),
			(sg = og[--pg]),
			(og[pg] = null),
			(rg = og[--pg]),
			(og[pg] = null));
}
var xg = null,
	yg = null,
	I = !1,
	zg = null;
function Ag(o, i) {
	var a = Bg(5, null, null, 0);
	((a.elementType = "DELETED"),
		(a.stateNode = i),
		(a.return = o),
		(i = o.deletions),
		i === null ? ((o.deletions = [a]), (o.flags |= 16)) : i.push(a));
}
function Cg(o, i) {
	switch (o.tag) {
		case 5:
			var a = o.type;
			return (
				(i = i.nodeType !== 1 || a.toLowerCase() !== i.nodeName.toLowerCase() ? null : i),
				i !== null ? ((o.stateNode = i), (xg = o), (yg = Lf(i.firstChild)), !0) : !1
			);
		case 6:
			return (
				(i = o.pendingProps === "" || i.nodeType !== 3 ? null : i),
				i !== null ? ((o.stateNode = i), (xg = o), (yg = null), !0) : !1
			);
		case 13:
			return (
				(i = i.nodeType !== 8 ? null : i),
				i !== null
					? ((a = qg !== null ? { id: rg, overflow: sg } : null),
						(o.memoizedState = { dehydrated: i, treeContext: a, retryLane: 1073741824 }),
						(a = Bg(18, null, null, 0)),
						(a.stateNode = i),
						(a.return = o),
						(o.child = a),
						(xg = o),
						(yg = null),
						!0)
					: !1
			);
		default:
			return !1;
	}
}
function Dg(o) {
	return (o.mode & 1) !== 0 && (o.flags & 128) === 0;
}
function Eg(o) {
	if (I) {
		var i = yg;
		if (i) {
			var a = i;
			if (!Cg(o, i)) {
				if (Dg(o)) throw Error(p$1(418));
				i = Lf(a.nextSibling);
				var s = xg;
				i && Cg(o, i) ? Ag(s, a) : ((o.flags = (o.flags & -4097) | 2), (I = !1), (xg = o));
			}
		} else {
			if (Dg(o)) throw Error(p$1(418));
			((o.flags = (o.flags & -4097) | 2), (I = !1), (xg = o));
		}
	}
}
function Fg(o) {
	for (o = o.return; o !== null && o.tag !== 5 && o.tag !== 3 && o.tag !== 13; ) o = o.return;
	xg = o;
}
function Gg(o) {
	if (o !== xg) return !1;
	if (!I) return (Fg(o), (I = !0), !1);
	var i;
	if (
		((i = o.tag !== 3) &&
			!(i = o.tag !== 5) &&
			((i = o.type), (i = i !== "head" && i !== "body" && !Ef(o.type, o.memoizedProps))),
		i && (i = yg))
	) {
		if (Dg(o)) throw (Hg(), Error(p$1(418)));
		for (; i; ) (Ag(o, i), (i = Lf(i.nextSibling)));
	}
	if ((Fg(o), o.tag === 13)) {
		if (((o = o.memoizedState), (o = o !== null ? o.dehydrated : null), !o)) throw Error(p$1(317));
		e: {
			for (o = o.nextSibling, i = 0; o; ) {
				if (o.nodeType === 8) {
					var a = o.data;
					if (a === "/$") {
						if (i === 0) {
							yg = Lf(o.nextSibling);
							break e;
						}
						i--;
					} else (a !== "$" && a !== "$!" && a !== "$?") || i++;
				}
				o = o.nextSibling;
			}
			yg = null;
		}
	} else yg = xg ? Lf(o.stateNode.nextSibling) : null;
	return !0;
}
function Hg() {
	for (var o = yg; o; ) o = Lf(o.nextSibling);
}
function Ig() {
	((yg = xg = null), (I = !1));
}
function Jg(o) {
	zg === null ? (zg = [o]) : zg.push(o);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(o, i) {
	if (o && o.defaultProps) {
		((i = A$1({}, i)), (o = o.defaultProps));
		for (var a in o) i[a] === void 0 && (i[a] = o[a]);
		return i;
	}
	return i;
}
var Mg = Uf(null),
	Ng = null,
	Og = null,
	Pg = null;
function Qg() {
	Pg = Og = Ng = null;
}
function Rg(o) {
	var i = Mg.current;
	(E(Mg), (o._currentValue = i));
}
function Sg(o, i, a) {
	for (; o !== null; ) {
		var s = o.alternate;
		if (
			((o.childLanes & i) !== i
				? ((o.childLanes |= i), s !== null && (s.childLanes |= i))
				: s !== null && (s.childLanes & i) !== i && (s.childLanes |= i),
			o === a)
		)
			break;
		o = o.return;
	}
}
function Tg(o, i) {
	((Ng = o),
		(Pg = Og = null),
		(o = o.dependencies),
		o !== null && o.firstContext !== null && (o.lanes & i && (Ug = !0), (o.firstContext = null)));
}
function Vg(o) {
	var i = o._currentValue;
	if (Pg !== o)
		if (((o = { context: o, memoizedValue: i, next: null }), Og === null)) {
			if (Ng === null) throw Error(p$1(308));
			((Og = o), (Ng.dependencies = { lanes: 0, firstContext: o }));
		} else Og = Og.next = o;
	return i;
}
var Wg = null;
function Xg(o) {
	Wg === null ? (Wg = [o]) : Wg.push(o);
}
function Yg(o, i, a, s) {
	var $ = i.interleaved;
	return (
		$ === null ? ((a.next = a), Xg(i)) : ((a.next = $.next), ($.next = a)),
		(i.interleaved = a),
		Zg(o, s)
	);
}
function Zg(o, i) {
	o.lanes |= i;
	var a = o.alternate;
	for (a !== null && (a.lanes |= i), a = o, o = o.return; o !== null; )
		((o.childLanes |= i),
			(a = o.alternate),
			a !== null && (a.childLanes |= i),
			(a = o),
			(o = o.return));
	return a.tag === 3 ? a.stateNode : null;
}
var $g = !1;
function ah(o) {
	o.updateQueue = {
		baseState: o.memoizedState,
		firstBaseUpdate: null,
		lastBaseUpdate: null,
		shared: { pending: null, interleaved: null, lanes: 0 },
		effects: null,
	};
}
function bh(o, i) {
	((o = o.updateQueue),
		i.updateQueue === o &&
			(i.updateQueue = {
				baseState: o.baseState,
				firstBaseUpdate: o.firstBaseUpdate,
				lastBaseUpdate: o.lastBaseUpdate,
				shared: o.shared,
				effects: o.effects,
			}));
}
function ch(o, i) {
	return { eventTime: o, lane: i, tag: 0, payload: null, callback: null, next: null };
}
function dh(o, i, a) {
	var s = o.updateQueue;
	if (s === null) return null;
	if (((s = s.shared), K & 2)) {
		var $ = s.pending;
		return (
			$ === null ? (i.next = i) : ((i.next = $.next), ($.next = i)), (s.pending = i), Zg(o, a)
		);
	}
	return (
		($ = s.interleaved),
		$ === null ? ((i.next = i), Xg(s)) : ((i.next = $.next), ($.next = i)),
		(s.interleaved = i),
		Zg(o, a)
	);
}
function eh(o, i, a) {
	if (((i = i.updateQueue), i !== null && ((i = i.shared), (a & 4194240) !== 0))) {
		var s = i.lanes;
		((s &= o.pendingLanes), (a |= s), (i.lanes = a), Cc(o, a));
	}
}
function fh(o, i) {
	var a = o.updateQueue,
		s = o.alternate;
	if (s !== null && ((s = s.updateQueue), a === s)) {
		var $ = null,
			j = null;
		if (((a = a.firstBaseUpdate), a !== null)) {
			do {
				var _e = {
					eventTime: a.eventTime,
					lane: a.lane,
					tag: a.tag,
					payload: a.payload,
					callback: a.callback,
					next: null,
				};
				(j === null ? ($ = j = _e) : (j = j.next = _e), (a = a.next));
			} while (a !== null);
			j === null ? ($ = j = i) : (j = j.next = i);
		} else $ = j = i;
		((a = {
			baseState: s.baseState,
			firstBaseUpdate: $,
			lastBaseUpdate: j,
			shared: s.shared,
			effects: s.effects,
		}),
			(o.updateQueue = a));
		return;
	}
	((o = a.lastBaseUpdate),
		o === null ? (a.firstBaseUpdate = i) : (o.next = i),
		(a.lastBaseUpdate = i));
}
function gh(o, i, a, s) {
	var $ = o.updateQueue;
	$g = !1;
	var j = $.firstBaseUpdate,
		_e = $.lastBaseUpdate,
		et = $.shared.pending;
	if (et !== null) {
		$.shared.pending = null;
		var tt = et,
			rt = tt.next;
		((tt.next = null), _e === null ? (j = rt) : (_e.next = rt), (_e = tt));
		var nt = o.alternate;
		nt !== null &&
			((nt = nt.updateQueue),
			(et = nt.lastBaseUpdate),
			et !== _e &&
				(et === null ? (nt.firstBaseUpdate = rt) : (et.next = rt), (nt.lastBaseUpdate = tt)));
	}
	if (j !== null) {
		var it = $.baseState;
		((_e = 0), (nt = rt = tt = null), (et = j));
		do {
			var ot = et.lane,
				st = et.eventTime;
			if ((s & ot) === ot) {
				nt !== null &&
					(nt = nt.next =
						{
							eventTime: st,
							lane: 0,
							tag: et.tag,
							payload: et.payload,
							callback: et.callback,
							next: null,
						});
				e: {
					var lt = o,
						dt = et;
					switch (((ot = i), (st = a), dt.tag)) {
						case 1:
							if (((lt = dt.payload), typeof lt == "function")) {
								it = lt.call(st, it, ot);
								break e;
							}
							it = lt;
							break e;
						case 3:
							lt.flags = (lt.flags & -65537) | 128;
						case 0:
							if (
								((lt = dt.payload),
								(ot = typeof lt == "function" ? lt.call(st, it, ot) : lt),
								ot == null)
							)
								break e;
							it = A$1({}, it, ot);
							break e;
						case 2:
							$g = !0;
					}
				}
				et.callback !== null &&
					et.lane !== 0 &&
					((o.flags |= 64), (ot = $.effects), ot === null ? ($.effects = [et]) : ot.push(et));
			} else
				((st = {
					eventTime: st,
					lane: ot,
					tag: et.tag,
					payload: et.payload,
					callback: et.callback,
					next: null,
				}),
					nt === null ? ((rt = nt = st), (tt = it)) : (nt = nt.next = st),
					(_e |= ot));
			if (((et = et.next), et === null)) {
				if (((et = $.shared.pending), et === null)) break;
				((ot = et),
					(et = ot.next),
					(ot.next = null),
					($.lastBaseUpdate = ot),
					($.shared.pending = null));
			}
		} while (1);
		if (
			(nt === null && (tt = it),
			($.baseState = tt),
			($.firstBaseUpdate = rt),
			($.lastBaseUpdate = nt),
			(i = $.shared.interleaved),
			i !== null)
		) {
			$ = i;
			do ((_e |= $.lane), ($ = $.next));
			while ($ !== i);
		} else j === null && ($.shared.lanes = 0);
		((hh |= _e), (o.lanes = _e), (o.memoizedState = it));
	}
}
function ih(o, i, a) {
	if (((o = i.effects), (i.effects = null), o !== null))
		for (i = 0; i < o.length; i++) {
			var s = o[i],
				$ = s.callback;
			if ($ !== null) {
				if (((s.callback = null), (s = a), typeof $ != "function")) throw Error(p$1(191, $));
				$.call(s);
			}
		}
}
var jh = new aa.Component().refs;
function kh(o, i, a, s) {
	((i = o.memoizedState),
		(a = a(s, i)),
		(a = a == null ? i : A$1({}, i, a)),
		(o.memoizedState = a),
		o.lanes === 0 && (o.updateQueue.baseState = a));
}
var nh = {
	isMounted: function (o) {
		return (o = o._reactInternals) ? Vb(o) === o : !1;
	},
	enqueueSetState: function (o, i, a) {
		o = o._reactInternals;
		var s = L(),
			$ = lh(o),
			j = ch(s, $);
		((j.payload = i),
			a != null && (j.callback = a),
			(i = dh(o, j, $)),
			i !== null && (mh(i, o, $, s), eh(i, o, $)));
	},
	enqueueReplaceState: function (o, i, a) {
		o = o._reactInternals;
		var s = L(),
			$ = lh(o),
			j = ch(s, $);
		((j.tag = 1),
			(j.payload = i),
			a != null && (j.callback = a),
			(i = dh(o, j, $)),
			i !== null && (mh(i, o, $, s), eh(i, o, $)));
	},
	enqueueForceUpdate: function (o, i) {
		o = o._reactInternals;
		var a = L(),
			s = lh(o),
			$ = ch(a, s);
		(($.tag = 2),
			i != null && ($.callback = i),
			(i = dh(o, $, s)),
			i !== null && (mh(i, o, s, a), eh(i, o, s)));
	},
};
function oh(o, i, a, s, $, j, _e) {
	return (
		(o = o.stateNode),
		typeof o.shouldComponentUpdate == "function"
			? o.shouldComponentUpdate(s, j, _e)
			: i.prototype && i.prototype.isPureReactComponent
				? !Ie(a, s) || !Ie($, j)
				: !0
	);
}
function ph(o, i, a) {
	var s = !1,
		$ = Vf,
		j = i.contextType;
	return (
		typeof j == "object" && j !== null
			? (j = Vg(j))
			: (($ = Zf(i) ? Xf : H.current), (s = i.contextTypes), (j = (s = s != null) ? Yf(o, $) : Vf)),
		(i = new i(a, j)),
		(o.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null),
		(i.updater = nh),
		(o.stateNode = i),
		(i._reactInternals = o),
		s &&
			((o = o.stateNode),
			(o.__reactInternalMemoizedUnmaskedChildContext = $),
			(o.__reactInternalMemoizedMaskedChildContext = j)),
		i
	);
}
function qh(o, i, a, s) {
	((o = i.state),
		typeof i.componentWillReceiveProps == "function" && i.componentWillReceiveProps(a, s),
		typeof i.UNSAFE_componentWillReceiveProps == "function" &&
			i.UNSAFE_componentWillReceiveProps(a, s),
		i.state !== o && nh.enqueueReplaceState(i, i.state, null));
}
function rh(o, i, a, s) {
	var $ = o.stateNode;
	(($.props = a), ($.state = o.memoizedState), ($.refs = jh), ah(o));
	var j = i.contextType;
	(typeof j == "object" && j !== null
		? ($.context = Vg(j))
		: ((j = Zf(i) ? Xf : H.current), ($.context = Yf(o, j))),
		($.state = o.memoizedState),
		(j = i.getDerivedStateFromProps),
		typeof j == "function" && (kh(o, i, j, a), ($.state = o.memoizedState)),
		typeof i.getDerivedStateFromProps == "function" ||
			typeof $.getSnapshotBeforeUpdate == "function" ||
			(typeof $.UNSAFE_componentWillMount != "function" &&
				typeof $.componentWillMount != "function") ||
			((i = $.state),
			typeof $.componentWillMount == "function" && $.componentWillMount(),
			typeof $.UNSAFE_componentWillMount == "function" && $.UNSAFE_componentWillMount(),
			i !== $.state && nh.enqueueReplaceState($, $.state, null),
			gh(o, a, $, s),
			($.state = o.memoizedState)),
		typeof $.componentDidMount == "function" && (o.flags |= 4194308));
}
function sh(o, i, a) {
	if (((o = a.ref), o !== null && typeof o != "function" && typeof o != "object")) {
		if (a._owner) {
			if (((a = a._owner), a)) {
				if (a.tag !== 1) throw Error(p$1(309));
				var s = a.stateNode;
			}
			if (!s) throw Error(p$1(147, o));
			var $ = s,
				j = "" + o;
			return i !== null && i.ref !== null && typeof i.ref == "function" && i.ref._stringRef === j
				? i.ref
				: ((i = function (_e) {
						var et = $.refs;
						(et === jh && (et = $.refs = {}), _e === null ? delete et[j] : (et[j] = _e));
					}),
					(i._stringRef = j),
					i);
		}
		if (typeof o != "string") throw Error(p$1(284));
		if (!a._owner) throw Error(p$1(290, o));
	}
	return o;
}
function th(o, i) {
	throw (
		(o = Object.prototype.toString.call(i)),
		Error(
			p$1(31, o === "[object Object]" ? "object with keys {" + Object.keys(i).join(", ") + "}" : o)
		)
	);
}
function uh(o) {
	var i = o._init;
	return i(o._payload);
}
function vh(o) {
	function i(ct, at) {
		if (o) {
			var ft = ct.deletions;
			ft === null ? ((ct.deletions = [at]), (ct.flags |= 16)) : ft.push(at);
		}
	}
	function a(ct, at) {
		if (!o) return null;
		for (; at !== null; ) (i(ct, at), (at = at.sibling));
		return null;
	}
	function s(ct, at) {
		for (ct = new Map(); at !== null; )
			(at.key !== null ? ct.set(at.key, at) : ct.set(at.index, at), (at = at.sibling));
		return ct;
	}
	function $(ct, at) {
		return ((ct = wh(ct, at)), (ct.index = 0), (ct.sibling = null), ct);
	}
	function j(ct, at, ft) {
		return (
			(ct.index = ft),
			o
				? ((ft = ct.alternate),
					ft !== null
						? ((ft = ft.index), ft < at ? ((ct.flags |= 2), at) : ft)
						: ((ct.flags |= 2), at))
				: ((ct.flags |= 1048576), at)
		);
	}
	function _e(ct) {
		return (o && ct.alternate === null && (ct.flags |= 2), ct);
	}
	function et(ct, at, ft, ut) {
		return at === null || at.tag !== 6
			? ((at = xh(ft, ct.mode, ut)), (at.return = ct), at)
			: ((at = $(at, ft)), (at.return = ct), at);
	}
	function tt(ct, at, ft, ut) {
		var ht = ft.type;
		return ht === ya
			? nt(ct, at, ft.props.children, ut, ft.key)
			: at !== null &&
				  (at.elementType === ht ||
						(typeof ht == "object" && ht !== null && ht.$$typeof === Ha && uh(ht) === at.type))
				? ((ut = $(at, ft.props)), (ut.ref = sh(ct, at, ft)), (ut.return = ct), ut)
				: ((ut = yh(ft.type, ft.key, ft.props, null, ct.mode, ut)),
					(ut.ref = sh(ct, at, ft)),
					(ut.return = ct),
					ut);
	}
	function rt(ct, at, ft, ut) {
		return at === null ||
			at.tag !== 4 ||
			at.stateNode.containerInfo !== ft.containerInfo ||
			at.stateNode.implementation !== ft.implementation
			? ((at = zh(ft, ct.mode, ut)), (at.return = ct), at)
			: ((at = $(at, ft.children || [])), (at.return = ct), at);
	}
	function nt(ct, at, ft, ut, ht) {
		return at === null || at.tag !== 7
			? ((at = Ah(ft, ct.mode, ut, ht)), (at.return = ct), at)
			: ((at = $(at, ft)), (at.return = ct), at);
	}
	function it(ct, at, ft) {
		if ((typeof at == "string" && at !== "") || typeof at == "number")
			return ((at = xh("" + at, ct.mode, ft)), (at.return = ct), at);
		if (typeof at == "object" && at !== null) {
			switch (at.$$typeof) {
				case va:
					return (
						(ft = yh(at.type, at.key, at.props, null, ct.mode, ft)),
						(ft.ref = sh(ct, null, at)),
						(ft.return = ct),
						ft
					);
				case wa:
					return ((at = zh(at, ct.mode, ft)), (at.return = ct), at);
				case Ha:
					var ut = at._init;
					return it(ct, ut(at._payload), ft);
			}
			if (eb(at) || Ka(at)) return ((at = Ah(at, ct.mode, ft, null)), (at.return = ct), at);
			th(ct, at);
		}
		return null;
	}
	function ot(ct, at, ft, ut) {
		var ht = at !== null ? at.key : null;
		if ((typeof ft == "string" && ft !== "") || typeof ft == "number")
			return ht !== null ? null : et(ct, at, "" + ft, ut);
		if (typeof ft == "object" && ft !== null) {
			switch (ft.$$typeof) {
				case va:
					return ft.key === ht ? tt(ct, at, ft, ut) : null;
				case wa:
					return ft.key === ht ? rt(ct, at, ft, ut) : null;
				case Ha:
					return ((ht = ft._init), ot(ct, at, ht(ft._payload), ut));
			}
			if (eb(ft) || Ka(ft)) return ht !== null ? null : nt(ct, at, ft, ut, null);
			th(ct, ft);
		}
		return null;
	}
	function st(ct, at, ft, ut, ht) {
		if ((typeof ut == "string" && ut !== "") || typeof ut == "number")
			return ((ct = ct.get(ft) || null), et(at, ct, "" + ut, ht));
		if (typeof ut == "object" && ut !== null) {
			switch (ut.$$typeof) {
				case va:
					return ((ct = ct.get(ut.key === null ? ft : ut.key) || null), tt(at, ct, ut, ht));
				case wa:
					return ((ct = ct.get(ut.key === null ? ft : ut.key) || null), rt(at, ct, ut, ht));
				case Ha:
					var yt = ut._init;
					return st(ct, at, ft, yt(ut._payload), ht);
			}
			if (eb(ut) || Ka(ut)) return ((ct = ct.get(ft) || null), nt(at, ct, ut, ht, null));
			th(at, ut);
		}
		return null;
	}
	function lt(ct, at, ft, ut) {
		for (
			var ht = null, yt = null, mt = at, Et = (at = 0), Rt = null;
			mt !== null && Et < ft.length;
			Et++
		) {
			mt.index > Et ? ((Rt = mt), (mt = null)) : (Rt = mt.sibling);
			var vt = ot(ct, mt, ft[Et], ut);
			if (vt === null) {
				mt === null && (mt = Rt);
				break;
			}
			(o && mt && vt.alternate === null && i(ct, mt),
				(at = j(vt, at, Et)),
				yt === null ? (ht = vt) : (yt.sibling = vt),
				(yt = vt),
				(mt = Rt));
		}
		if (Et === ft.length) return (a(ct, mt), I && tg(ct, Et), ht);
		if (mt === null) {
			for (; Et < ft.length; Et++)
				((mt = it(ct, ft[Et], ut)),
					mt !== null &&
						((at = j(mt, at, Et)), yt === null ? (ht = mt) : (yt.sibling = mt), (yt = mt)));
			return (I && tg(ct, Et), ht);
		}
		for (mt = s(ct, mt); Et < ft.length; Et++)
			((Rt = st(mt, ct, Et, ft[Et], ut)),
				Rt !== null &&
					(o && Rt.alternate !== null && mt.delete(Rt.key === null ? Et : Rt.key),
					(at = j(Rt, at, Et)),
					yt === null ? (ht = Rt) : (yt.sibling = Rt),
					(yt = Rt)));
		return (
			o &&
				mt.forEach(function (Tt) {
					return i(ct, Tt);
				}),
			I && tg(ct, Et),
			ht
		);
	}
	function dt(ct, at, ft, ut) {
		var ht = Ka(ft);
		if (typeof ht != "function") throw Error(p$1(150));
		if (((ft = ht.call(ft)), ft == null)) throw Error(p$1(151));
		for (
			var yt = (ht = null), mt = at, Et = (at = 0), Rt = null, vt = ft.next();
			mt !== null && !vt.done;
			Et++, vt = ft.next()
		) {
			mt.index > Et ? ((Rt = mt), (mt = null)) : (Rt = mt.sibling);
			var Tt = ot(ct, mt, vt.value, ut);
			if (Tt === null) {
				mt === null && (mt = Rt);
				break;
			}
			(o && mt && Tt.alternate === null && i(ct, mt),
				(at = j(Tt, at, Et)),
				yt === null ? (ht = Tt) : (yt.sibling = Tt),
				(yt = Tt),
				(mt = Rt));
		}
		if (vt.done) return (a(ct, mt), I && tg(ct, Et), ht);
		if (mt === null) {
			for (; !vt.done; Et++, vt = ft.next())
				((vt = it(ct, vt.value, ut)),
					vt !== null &&
						((at = j(vt, at, Et)), yt === null ? (ht = vt) : (yt.sibling = vt), (yt = vt)));
			return (I && tg(ct, Et), ht);
		}
		for (mt = s(ct, mt); !vt.done; Et++, vt = ft.next())
			((vt = st(mt, ct, Et, vt.value, ut)),
				vt !== null &&
					(o && vt.alternate !== null && mt.delete(vt.key === null ? Et : vt.key),
					(at = j(vt, at, Et)),
					yt === null ? (ht = vt) : (yt.sibling = vt),
					(yt = vt)));
		return (
			o &&
				mt.forEach(function (Pt) {
					return i(ct, Pt);
				}),
			I && tg(ct, Et),
			ht
		);
	}
	function pt(ct, at, ft, ut) {
		if (
			(typeof ft == "object" &&
				ft !== null &&
				ft.type === ya &&
				ft.key === null &&
				(ft = ft.props.children),
			typeof ft == "object" && ft !== null)
		) {
			switch (ft.$$typeof) {
				case va:
					e: {
						for (var ht = ft.key, yt = at; yt !== null; ) {
							if (yt.key === ht) {
								if (((ht = ft.type), ht === ya)) {
									if (yt.tag === 7) {
										(a(ct, yt.sibling),
											(at = $(yt, ft.props.children)),
											(at.return = ct),
											(ct = at));
										break e;
									}
								} else if (
									yt.elementType === ht ||
									(typeof ht == "object" && ht !== null && ht.$$typeof === Ha && uh(ht) === yt.type)
								) {
									(a(ct, yt.sibling),
										(at = $(yt, ft.props)),
										(at.ref = sh(ct, yt, ft)),
										(at.return = ct),
										(ct = at));
									break e;
								}
								a(ct, yt);
								break;
							} else i(ct, yt);
							yt = yt.sibling;
						}
						ft.type === ya
							? ((at = Ah(ft.props.children, ct.mode, ut, ft.key)), (at.return = ct), (ct = at))
							: ((ut = yh(ft.type, ft.key, ft.props, null, ct.mode, ut)),
								(ut.ref = sh(ct, at, ft)),
								(ut.return = ct),
								(ct = ut));
					}
					return _e(ct);
				case wa:
					e: {
						for (yt = ft.key; at !== null; ) {
							if (at.key === yt)
								if (
									at.tag === 4 &&
									at.stateNode.containerInfo === ft.containerInfo &&
									at.stateNode.implementation === ft.implementation
								) {
									(a(ct, at.sibling), (at = $(at, ft.children || [])), (at.return = ct), (ct = at));
									break e;
								} else {
									a(ct, at);
									break;
								}
							else i(ct, at);
							at = at.sibling;
						}
						((at = zh(ft, ct.mode, ut)), (at.return = ct), (ct = at));
					}
					return _e(ct);
				case Ha:
					return ((yt = ft._init), pt(ct, at, yt(ft._payload), ut));
			}
			if (eb(ft)) return lt(ct, at, ft, ut);
			if (Ka(ft)) return dt(ct, at, ft, ut);
			th(ct, ft);
		}
		return (typeof ft == "string" && ft !== "") || typeof ft == "number"
			? ((ft = "" + ft),
				at !== null && at.tag === 6
					? (a(ct, at.sibling), (at = $(at, ft)), (at.return = ct), (ct = at))
					: (a(ct, at), (at = xh(ft, ct.mode, ut)), (at.return = ct), (ct = at)),
				_e(ct))
			: a(ct, at);
	}
	return pt;
}
var Bh = vh(!0),
	Ch = vh(!1),
	Dh = {},
	Eh = Uf(Dh),
	Fh = Uf(Dh),
	Gh = Uf(Dh);
function Hh(o) {
	if (o === Dh) throw Error(p$1(174));
	return o;
}
function Ih(o, i) {
	switch ((G(Gh, i), G(Fh, o), G(Eh, Dh), (o = i.nodeType), o)) {
		case 9:
		case 11:
			i = (i = i.documentElement) ? i.namespaceURI : lb(null, "");
			break;
		default:
			((o = o === 8 ? i.parentNode : i),
				(i = o.namespaceURI || null),
				(o = o.tagName),
				(i = lb(i, o)));
	}
	(E(Eh), G(Eh, i));
}
function Jh() {
	(E(Eh), E(Fh), E(Gh));
}
function Kh(o) {
	Hh(Gh.current);
	var i = Hh(Eh.current),
		a = lb(i, o.type);
	i !== a && (G(Fh, o), G(Eh, a));
}
function Lh(o) {
	Fh.current === o && (E(Eh), E(Fh));
}
var M = Uf(0);
function Mh(o) {
	for (var i = o; i !== null; ) {
		if (i.tag === 13) {
			var a = i.memoizedState;
			if (a !== null && ((a = a.dehydrated), a === null || a.data === "$?" || a.data === "$!"))
				return i;
		} else if (i.tag === 19 && i.memoizedProps.revealOrder !== void 0) {
			if (i.flags & 128) return i;
		} else if (i.child !== null) {
			((i.child.return = i), (i = i.child));
			continue;
		}
		if (i === o) break;
		for (; i.sibling === null; ) {
			if (i.return === null || i.return === o) return null;
			i = i.return;
		}
		((i.sibling.return = i.return), (i = i.sibling));
	}
	return null;
}
var Nh = [];
function Oh() {
	for (var o = 0; o < Nh.length; o++) Nh[o]._workInProgressVersionPrimary = null;
	Nh.length = 0;
}
var Ph = ua.ReactCurrentDispatcher,
	Qh = ua.ReactCurrentBatchConfig,
	Rh = 0,
	N = null,
	O = null,
	P = null,
	Sh = !1,
	Th = !1,
	Uh = 0,
	Vh = 0;
function Q() {
	throw Error(p$1(321));
}
function Wh(o, i) {
	if (i === null) return !1;
	for (var a = 0; a < i.length && a < o.length; a++) if (!He(o[a], i[a])) return !1;
	return !0;
}
function Xh(o, i, a, s, $, j) {
	if (
		((Rh = j),
		(N = i),
		(i.memoizedState = null),
		(i.updateQueue = null),
		(i.lanes = 0),
		(Ph.current = o === null || o.memoizedState === null ? Yh : Zh),
		(o = a(s, $)),
		Th)
	) {
		j = 0;
		do {
			if (((Th = !1), (Uh = 0), 25 <= j)) throw Error(p$1(301));
			((j += 1), (P = O = null), (i.updateQueue = null), (Ph.current = $h), (o = a(s, $)));
		} while (Th);
	}
	if (
		((Ph.current = ai),
		(i = O !== null && O.next !== null),
		(Rh = 0),
		(P = O = N = null),
		(Sh = !1),
		i)
	)
		throw Error(p$1(300));
	return o;
}
function bi() {
	var o = Uh !== 0;
	return ((Uh = 0), o);
}
function ci() {
	var o = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
	return (P === null ? (N.memoizedState = P = o) : (P = P.next = o), P);
}
function di() {
	if (O === null) {
		var o = N.alternate;
		o = o !== null ? o.memoizedState : null;
	} else o = O.next;
	var i = P === null ? N.memoizedState : P.next;
	if (i !== null) ((P = i), (O = o));
	else {
		if (o === null) throw Error(p$1(310));
		((O = o),
			(o = {
				memoizedState: O.memoizedState,
				baseState: O.baseState,
				baseQueue: O.baseQueue,
				queue: O.queue,
				next: null,
			}),
			P === null ? (N.memoizedState = P = o) : (P = P.next = o));
	}
	return P;
}
function ei(o, i) {
	return typeof i == "function" ? i(o) : i;
}
function fi(o) {
	var i = di(),
		a = i.queue;
	if (a === null) throw Error(p$1(311));
	a.lastRenderedReducer = o;
	var s = O,
		$ = s.baseQueue,
		j = a.pending;
	if (j !== null) {
		if ($ !== null) {
			var _e = $.next;
			(($.next = j.next), (j.next = _e));
		}
		((s.baseQueue = $ = j), (a.pending = null));
	}
	if ($ !== null) {
		((j = $.next), (s = s.baseState));
		var et = (_e = null),
			tt = null,
			rt = j;
		do {
			var nt = rt.lane;
			if ((Rh & nt) === nt)
				(tt !== null &&
					(tt = tt.next =
						{
							lane: 0,
							action: rt.action,
							hasEagerState: rt.hasEagerState,
							eagerState: rt.eagerState,
							next: null,
						}),
					(s = rt.hasEagerState ? rt.eagerState : o(s, rt.action)));
			else {
				var it = {
					lane: nt,
					action: rt.action,
					hasEagerState: rt.hasEagerState,
					eagerState: rt.eagerState,
					next: null,
				};
				(tt === null ? ((et = tt = it), (_e = s)) : (tt = tt.next = it),
					(N.lanes |= nt),
					(hh |= nt));
			}
			rt = rt.next;
		} while (rt !== null && rt !== j);
		(tt === null ? (_e = s) : (tt.next = et),
			He(s, i.memoizedState) || (Ug = !0),
			(i.memoizedState = s),
			(i.baseState = _e),
			(i.baseQueue = tt),
			(a.lastRenderedState = s));
	}
	if (((o = a.interleaved), o !== null)) {
		$ = o;
		do ((j = $.lane), (N.lanes |= j), (hh |= j), ($ = $.next));
		while ($ !== o);
	} else $ === null && (a.lanes = 0);
	return [i.memoizedState, a.dispatch];
}
function gi(o) {
	var i = di(),
		a = i.queue;
	if (a === null) throw Error(p$1(311));
	a.lastRenderedReducer = o;
	var s = a.dispatch,
		$ = a.pending,
		j = i.memoizedState;
	if ($ !== null) {
		a.pending = null;
		var _e = ($ = $.next);
		do ((j = o(j, _e.action)), (_e = _e.next));
		while (_e !== $);
		(He(j, i.memoizedState) || (Ug = !0),
			(i.memoizedState = j),
			i.baseQueue === null && (i.baseState = j),
			(a.lastRenderedState = j));
	}
	return [j, s];
}
function hi() {}
function ii(o, i) {
	var a = N,
		s = di(),
		$ = i(),
		j = !He(s.memoizedState, $);
	if (
		(j && ((s.memoizedState = $), (Ug = !0)),
		(s = s.queue),
		ji(ki.bind(null, a, s, o), [o]),
		s.getSnapshot !== i || j || (P !== null && P.memoizedState.tag & 1))
	) {
		if (((a.flags |= 2048), li(9, mi.bind(null, a, s, $, i), void 0, null), R === null))
			throw Error(p$1(349));
		Rh & 30 || ni(a, i, $);
	}
	return $;
}
function ni(o, i, a) {
	((o.flags |= 16384),
		(o = { getSnapshot: i, value: a }),
		(i = N.updateQueue),
		i === null
			? ((i = { lastEffect: null, stores: null }), (N.updateQueue = i), (i.stores = [o]))
			: ((a = i.stores), a === null ? (i.stores = [o]) : a.push(o)));
}
function mi(o, i, a, s) {
	((i.value = a), (i.getSnapshot = s), oi(i) && pi(o));
}
function ki(o, i, a) {
	return a(function () {
		oi(i) && pi(o);
	});
}
function oi(o) {
	var i = o.getSnapshot;
	o = o.value;
	try {
		var a = i();
		return !He(o, a);
	} catch {
		return !0;
	}
}
function pi(o) {
	var i = Zg(o, 1);
	i !== null && mh(i, o, 1, -1);
}
function qi(o) {
	var i = ci();
	return (
		typeof o == "function" && (o = o()),
		(i.memoizedState = i.baseState = o),
		(o = {
			pending: null,
			interleaved: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ei,
			lastRenderedState: o,
		}),
		(i.queue = o),
		(o = o.dispatch = ri.bind(null, N, o)),
		[i.memoizedState, o]
	);
}
function li(o, i, a, s) {
	return (
		(o = { tag: o, create: i, destroy: a, deps: s, next: null }),
		(i = N.updateQueue),
		i === null
			? ((i = { lastEffect: null, stores: null }), (N.updateQueue = i), (i.lastEffect = o.next = o))
			: ((a = i.lastEffect),
				a === null
					? (i.lastEffect = o.next = o)
					: ((s = a.next), (a.next = o), (o.next = s), (i.lastEffect = o))),
		o
	);
}
function si() {
	return di().memoizedState;
}
function ti(o, i, a, s) {
	var $ = ci();
	((N.flags |= o), ($.memoizedState = li(1 | i, a, void 0, s === void 0 ? null : s)));
}
function ui(o, i, a, s) {
	var $ = di();
	s = s === void 0 ? null : s;
	var j = void 0;
	if (O !== null) {
		var _e = O.memoizedState;
		if (((j = _e.destroy), s !== null && Wh(s, _e.deps))) {
			$.memoizedState = li(i, a, j, s);
			return;
		}
	}
	((N.flags |= o), ($.memoizedState = li(1 | i, a, j, s)));
}
function vi(o, i) {
	return ti(8390656, 8, o, i);
}
function ji(o, i) {
	return ui(2048, 8, o, i);
}
function wi(o, i) {
	return ui(4, 2, o, i);
}
function xi(o, i) {
	return ui(4, 4, o, i);
}
function yi(o, i) {
	if (typeof i == "function")
		return (
			(o = o()),
			i(o),
			function () {
				i(null);
			}
		);
	if (i != null)
		return (
			(o = o()),
			(i.current = o),
			function () {
				i.current = null;
			}
		);
}
function zi(o, i, a) {
	return ((a = a != null ? a.concat([o]) : null), ui(4, 4, yi.bind(null, i, o), a));
}
function Ai() {}
function Bi(o, i) {
	var a = di();
	i = i === void 0 ? null : i;
	var s = a.memoizedState;
	return s !== null && i !== null && Wh(i, s[1]) ? s[0] : ((a.memoizedState = [o, i]), o);
}
function Ci(o, i) {
	var a = di();
	i = i === void 0 ? null : i;
	var s = a.memoizedState;
	return s !== null && i !== null && Wh(i, s[1])
		? s[0]
		: ((o = o()), (a.memoizedState = [o, i]), o);
}
function Di(o, i, a) {
	return Rh & 21
		? (He(a, i) || ((a = yc()), (N.lanes |= a), (hh |= a), (o.baseState = !0)), i)
		: (o.baseState && ((o.baseState = !1), (Ug = !0)), (o.memoizedState = a));
}
function Ei(o, i) {
	var a = C;
	((C = a !== 0 && 4 > a ? a : 4), o(!0));
	var s = Qh.transition;
	Qh.transition = {};
	try {
		(o(!1), i());
	} finally {
		((C = a), (Qh.transition = s));
	}
}
function Fi() {
	return di().memoizedState;
}
function Gi(o, i, a) {
	var s = lh(o);
	if (((a = { lane: s, action: a, hasEagerState: !1, eagerState: null, next: null }), Hi(o)))
		Ii(i, a);
	else if (((a = Yg(o, i, a, s)), a !== null)) {
		var $ = L();
		(mh(a, o, s, $), Ji(a, i, s));
	}
}
function ri(o, i, a) {
	var s = lh(o),
		$ = { lane: s, action: a, hasEagerState: !1, eagerState: null, next: null };
	if (Hi(o)) Ii(i, $);
	else {
		var j = o.alternate;
		if (o.lanes === 0 && (j === null || j.lanes === 0) && ((j = i.lastRenderedReducer), j !== null))
			try {
				var _e = i.lastRenderedState,
					et = j(_e, a);
				if ((($.hasEagerState = !0), ($.eagerState = et), He(et, _e))) {
					var tt = i.interleaved;
					(tt === null ? (($.next = $), Xg(i)) : (($.next = tt.next), (tt.next = $)),
						(i.interleaved = $));
					return;
				}
			} catch {
			} finally {
			}
		((a = Yg(o, i, $, s)), a !== null && (($ = L()), mh(a, o, s, $), Ji(a, i, s)));
	}
}
function Hi(o) {
	var i = o.alternate;
	return o === N || (i !== null && i === N);
}
function Ii(o, i) {
	Th = Sh = !0;
	var a = o.pending;
	(a === null ? (i.next = i) : ((i.next = a.next), (a.next = i)), (o.pending = i));
}
function Ji(o, i, a) {
	if (a & 4194240) {
		var s = i.lanes;
		((s &= o.pendingLanes), (a |= s), (i.lanes = a), Cc(o, a));
	}
}
var ai = {
		readContext: Vg,
		useCallback: Q,
		useContext: Q,
		useEffect: Q,
		useImperativeHandle: Q,
		useInsertionEffect: Q,
		useLayoutEffect: Q,
		useMemo: Q,
		useReducer: Q,
		useRef: Q,
		useState: Q,
		useDebugValue: Q,
		useDeferredValue: Q,
		useTransition: Q,
		useMutableSource: Q,
		useSyncExternalStore: Q,
		useId: Q,
		unstable_isNewReconciler: !1,
	},
	Yh = {
		readContext: Vg,
		useCallback: function (o, i) {
			return ((ci().memoizedState = [o, i === void 0 ? null : i]), o);
		},
		useContext: Vg,
		useEffect: vi,
		useImperativeHandle: function (o, i, a) {
			return ((a = a != null ? a.concat([o]) : null), ti(4194308, 4, yi.bind(null, i, o), a));
		},
		useLayoutEffect: function (o, i) {
			return ti(4194308, 4, o, i);
		},
		useInsertionEffect: function (o, i) {
			return ti(4, 2, o, i);
		},
		useMemo: function (o, i) {
			var a = ci();
			return ((i = i === void 0 ? null : i), (o = o()), (a.memoizedState = [o, i]), o);
		},
		useReducer: function (o, i, a) {
			var s = ci();
			return (
				(i = a !== void 0 ? a(i) : i),
				(s.memoizedState = s.baseState = i),
				(o = {
					pending: null,
					interleaved: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: o,
					lastRenderedState: i,
				}),
				(s.queue = o),
				(o = o.dispatch = Gi.bind(null, N, o)),
				[s.memoizedState, o]
			);
		},
		useRef: function (o) {
			var i = ci();
			return ((o = { current: o }), (i.memoizedState = o));
		},
		useState: qi,
		useDebugValue: Ai,
		useDeferredValue: function (o) {
			return (ci().memoizedState = o);
		},
		useTransition: function () {
			var o = qi(!1),
				i = o[0];
			return ((o = Ei.bind(null, o[1])), (ci().memoizedState = o), [i, o]);
		},
		useMutableSource: function () {},
		useSyncExternalStore: function (o, i, a) {
			var s = N,
				$ = ci();
			if (I) {
				if (a === void 0) throw Error(p$1(407));
				a = a();
			} else {
				if (((a = i()), R === null)) throw Error(p$1(349));
				Rh & 30 || ni(s, i, a);
			}
			$.memoizedState = a;
			var j = { value: a, getSnapshot: i };
			return (
				($.queue = j),
				vi(ki.bind(null, s, j, o), [o]),
				(s.flags |= 2048),
				li(9, mi.bind(null, s, j, a, i), void 0, null),
				a
			);
		},
		useId: function () {
			var o = ci(),
				i = R.identifierPrefix;
			if (I) {
				var a = sg,
					s = rg;
				((a = (s & ~(1 << (32 - oc(s) - 1))).toString(32) + a),
					(i = ":" + i + "R" + a),
					(a = Uh++),
					0 < a && (i += "H" + a.toString(32)),
					(i += ":"));
			} else ((a = Vh++), (i = ":" + i + "r" + a.toString(32) + ":"));
			return (o.memoizedState = i);
		},
		unstable_isNewReconciler: !1,
	},
	Zh = {
		readContext: Vg,
		useCallback: Bi,
		useContext: Vg,
		useEffect: ji,
		useImperativeHandle: zi,
		useInsertionEffect: wi,
		useLayoutEffect: xi,
		useMemo: Ci,
		useReducer: fi,
		useRef: si,
		useState: function () {
			return fi(ei);
		},
		useDebugValue: Ai,
		useDeferredValue: function (o) {
			var i = di();
			return Di(i, O.memoizedState, o);
		},
		useTransition: function () {
			var o = fi(ei)[0],
				i = di().memoizedState;
			return [o, i];
		},
		useMutableSource: hi,
		useSyncExternalStore: ii,
		useId: Fi,
		unstable_isNewReconciler: !1,
	},
	$h = {
		readContext: Vg,
		useCallback: Bi,
		useContext: Vg,
		useEffect: ji,
		useImperativeHandle: zi,
		useInsertionEffect: wi,
		useLayoutEffect: xi,
		useMemo: Ci,
		useReducer: gi,
		useRef: si,
		useState: function () {
			return gi(ei);
		},
		useDebugValue: Ai,
		useDeferredValue: function (o) {
			var i = di();
			return O === null ? (i.memoizedState = o) : Di(i, O.memoizedState, o);
		},
		useTransition: function () {
			var o = gi(ei)[0],
				i = di().memoizedState;
			return [o, i];
		},
		useMutableSource: hi,
		useSyncExternalStore: ii,
		useId: Fi,
		unstable_isNewReconciler: !1,
	};
function Ki(o, i) {
	try {
		var a = "",
			s = i;
		do ((a += Pa(s)), (s = s.return));
		while (s);
		var $ = a;
	} catch (j) {
		$ =
			`
Error generating stack: ` +
			j.message +
			`
` +
			j.stack;
	}
	return { value: o, source: i, stack: $, digest: null };
}
function Li(o, i, a) {
	return { value: o, source: null, stack: a ?? null, digest: i ?? null };
}
function Mi(o, i) {
	try {
		console.error(i.value);
	} catch (a) {
		setTimeout(function () {
			throw a;
		});
	}
}
var Ni = typeof WeakMap == "function" ? WeakMap : Map;
function Oi(o, i, a) {
	((a = ch(-1, a)), (a.tag = 3), (a.payload = { element: null }));
	var s = i.value;
	return (
		(a.callback = function () {
			(Pi || ((Pi = !0), (Qi = s)), Mi(o, i));
		}),
		a
	);
}
function Ri(o, i, a) {
	((a = ch(-1, a)), (a.tag = 3));
	var s = o.type.getDerivedStateFromError;
	if (typeof s == "function") {
		var $ = i.value;
		((a.payload = function () {
			return s($);
		}),
			(a.callback = function () {
				Mi(o, i);
			}));
	}
	var j = o.stateNode;
	return (
		j !== null &&
			typeof j.componentDidCatch == "function" &&
			(a.callback = function () {
				(Mi(o, i), typeof s != "function" && (Si === null ? (Si = new Set([this])) : Si.add(this)));
				var _e = i.stack;
				this.componentDidCatch(i.value, { componentStack: _e !== null ? _e : "" });
			}),
		a
	);
}
function Ti(o, i, a) {
	var s = o.pingCache;
	if (s === null) {
		s = o.pingCache = new Ni();
		var $ = new Set();
		s.set(i, $);
	} else (($ = s.get(i)), $ === void 0 && (($ = new Set()), s.set(i, $)));
	$.has(a) || ($.add(a), (o = Ui.bind(null, o, i, a)), i.then(o, o));
}
function Vi(o) {
	do {
		var i;
		if (
			((i = o.tag === 13) && ((i = o.memoizedState), (i = i !== null ? i.dehydrated !== null : !0)),
			i)
		)
			return o;
		o = o.return;
	} while (o !== null);
	return null;
}
function Wi(o, i, a, s, $) {
	return o.mode & 1
		? ((o.flags |= 65536), (o.lanes = $), o)
		: (o === i
				? (o.flags |= 65536)
				: ((o.flags |= 128),
					(a.flags |= 131072),
					(a.flags &= -52805),
					a.tag === 1 &&
						(a.alternate === null ? (a.tag = 17) : ((i = ch(-1, 1)), (i.tag = 2), dh(a, i, 1))),
					(a.lanes |= 1)),
			o);
}
var Xi = ua.ReactCurrentOwner,
	Ug = !1;
function Yi(o, i, a, s) {
	i.child = o === null ? Ch(i, null, a, s) : Bh(i, o.child, a, s);
}
function Zi(o, i, a, s, $) {
	a = a.render;
	var j = i.ref;
	return (
		Tg(i, $),
		(s = Xh(o, i, a, s, j, $)),
		(a = bi()),
		o !== null && !Ug
			? ((i.updateQueue = o.updateQueue), (i.flags &= -2053), (o.lanes &= ~$), $i(o, i, $))
			: (I && a && vg(i), (i.flags |= 1), Yi(o, i, s, $), i.child)
	);
}
function aj(o, i, a, s, $) {
	if (o === null) {
		var j = a.type;
		return typeof j == "function" &&
			!bj(j) &&
			j.defaultProps === void 0 &&
			a.compare === null &&
			a.defaultProps === void 0
			? ((i.tag = 15), (i.type = j), cj(o, i, j, s, $))
			: ((o = yh(a.type, null, s, i, i.mode, $)), (o.ref = i.ref), (o.return = i), (i.child = o));
	}
	if (((j = o.child), !(o.lanes & $))) {
		var _e = j.memoizedProps;
		if (((a = a.compare), (a = a !== null ? a : Ie), a(_e, s) && o.ref === i.ref))
			return $i(o, i, $);
	}
	return ((i.flags |= 1), (o = wh(j, s)), (o.ref = i.ref), (o.return = i), (i.child = o));
}
function cj(o, i, a, s, $) {
	if (o !== null) {
		var j = o.memoizedProps;
		if (Ie(j, s) && o.ref === i.ref)
			if (((Ug = !1), (i.pendingProps = s = j), (o.lanes & $) !== 0)) o.flags & 131072 && (Ug = !0);
			else return ((i.lanes = o.lanes), $i(o, i, $));
	}
	return dj(o, i, a, s, $);
}
function ej(o, i, a) {
	var s = i.pendingProps,
		$ = s.children,
		j = o !== null ? o.memoizedState : null;
	if (s.mode === "hidden")
		if (!(i.mode & 1))
			((i.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
				G(fj, gj),
				(gj |= a));
		else {
			if (!(a & 1073741824))
				return (
					(o = j !== null ? j.baseLanes | a : a),
					(i.lanes = i.childLanes = 1073741824),
					(i.memoizedState = { baseLanes: o, cachePool: null, transitions: null }),
					(i.updateQueue = null),
					G(fj, gj),
					(gj |= o),
					null
				);
			((i.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
				(s = j !== null ? j.baseLanes : a),
				G(fj, gj),
				(gj |= s));
		}
	else
		(j !== null ? ((s = j.baseLanes | a), (i.memoizedState = null)) : (s = a),
			G(fj, gj),
			(gj |= s));
	return (Yi(o, i, $, a), i.child);
}
function hj(o, i) {
	var a = i.ref;
	((o === null && a !== null) || (o !== null && o.ref !== a)) &&
		((i.flags |= 512), (i.flags |= 2097152));
}
function dj(o, i, a, s, $) {
	var j = Zf(a) ? Xf : H.current;
	return (
		(j = Yf(i, j)),
		Tg(i, $),
		(a = Xh(o, i, a, s, j, $)),
		(s = bi()),
		o !== null && !Ug
			? ((i.updateQueue = o.updateQueue), (i.flags &= -2053), (o.lanes &= ~$), $i(o, i, $))
			: (I && s && vg(i), (i.flags |= 1), Yi(o, i, a, $), i.child)
	);
}
function ij(o, i, a, s, $) {
	if (Zf(a)) {
		var j = !0;
		cg(i);
	} else j = !1;
	if ((Tg(i, $), i.stateNode === null)) (jj(o, i), ph(i, a, s), rh(i, a, s, $), (s = !0));
	else if (o === null) {
		var _e = i.stateNode,
			et = i.memoizedProps;
		_e.props = et;
		var tt = _e.context,
			rt = a.contextType;
		typeof rt == "object" && rt !== null
			? (rt = Vg(rt))
			: ((rt = Zf(a) ? Xf : H.current), (rt = Yf(i, rt)));
		var nt = a.getDerivedStateFromProps,
			it = typeof nt == "function" || typeof _e.getSnapshotBeforeUpdate == "function";
		(it ||
			(typeof _e.UNSAFE_componentWillReceiveProps != "function" &&
				typeof _e.componentWillReceiveProps != "function") ||
			((et !== s || tt !== rt) && qh(i, _e, s, rt)),
			($g = !1));
		var ot = i.memoizedState;
		((_e.state = ot),
			gh(i, s, _e, $),
			(tt = i.memoizedState),
			et !== s || ot !== tt || Wf.current || $g
				? (typeof nt == "function" && (kh(i, a, nt, s), (tt = i.memoizedState)),
					(et = $g || oh(i, a, et, s, ot, tt, rt))
						? (it ||
								(typeof _e.UNSAFE_componentWillMount != "function" &&
									typeof _e.componentWillMount != "function") ||
								(typeof _e.componentWillMount == "function" && _e.componentWillMount(),
								typeof _e.UNSAFE_componentWillMount == "function" &&
									_e.UNSAFE_componentWillMount()),
							typeof _e.componentDidMount == "function" && (i.flags |= 4194308))
						: (typeof _e.componentDidMount == "function" && (i.flags |= 4194308),
							(i.memoizedProps = s),
							(i.memoizedState = tt)),
					(_e.props = s),
					(_e.state = tt),
					(_e.context = rt),
					(s = et))
				: (typeof _e.componentDidMount == "function" && (i.flags |= 4194308), (s = !1)));
	} else {
		((_e = i.stateNode),
			bh(o, i),
			(et = i.memoizedProps),
			(rt = i.type === i.elementType ? et : Lg(i.type, et)),
			(_e.props = rt),
			(it = i.pendingProps),
			(ot = _e.context),
			(tt = a.contextType),
			typeof tt == "object" && tt !== null
				? (tt = Vg(tt))
				: ((tt = Zf(a) ? Xf : H.current), (tt = Yf(i, tt))));
		var st = a.getDerivedStateFromProps;
		((nt = typeof st == "function" || typeof _e.getSnapshotBeforeUpdate == "function") ||
			(typeof _e.UNSAFE_componentWillReceiveProps != "function" &&
				typeof _e.componentWillReceiveProps != "function") ||
			((et !== it || ot !== tt) && qh(i, _e, s, tt)),
			($g = !1),
			(ot = i.memoizedState),
			(_e.state = ot),
			gh(i, s, _e, $));
		var lt = i.memoizedState;
		et !== it || ot !== lt || Wf.current || $g
			? (typeof st == "function" && (kh(i, a, st, s), (lt = i.memoizedState)),
				(rt = $g || oh(i, a, rt, s, ot, lt, tt) || !1)
					? (nt ||
							(typeof _e.UNSAFE_componentWillUpdate != "function" &&
								typeof _e.componentWillUpdate != "function") ||
							(typeof _e.componentWillUpdate == "function" && _e.componentWillUpdate(s, lt, tt),
							typeof _e.UNSAFE_componentWillUpdate == "function" &&
								_e.UNSAFE_componentWillUpdate(s, lt, tt)),
						typeof _e.componentDidUpdate == "function" && (i.flags |= 4),
						typeof _e.getSnapshotBeforeUpdate == "function" && (i.flags |= 1024))
					: (typeof _e.componentDidUpdate != "function" ||
							(et === o.memoizedProps && ot === o.memoizedState) ||
							(i.flags |= 4),
						typeof _e.getSnapshotBeforeUpdate != "function" ||
							(et === o.memoizedProps && ot === o.memoizedState) ||
							(i.flags |= 1024),
						(i.memoizedProps = s),
						(i.memoizedState = lt)),
				(_e.props = s),
				(_e.state = lt),
				(_e.context = tt),
				(s = rt))
			: (typeof _e.componentDidUpdate != "function" ||
					(et === o.memoizedProps && ot === o.memoizedState) ||
					(i.flags |= 4),
				typeof _e.getSnapshotBeforeUpdate != "function" ||
					(et === o.memoizedProps && ot === o.memoizedState) ||
					(i.flags |= 1024),
				(s = !1));
	}
	return kj(o, i, a, s, j, $);
}
function kj(o, i, a, s, $, j) {
	hj(o, i);
	var _e = (i.flags & 128) !== 0;
	if (!s && !_e) return ($ && dg(i, a, !1), $i(o, i, j));
	((s = i.stateNode), (Xi.current = i));
	var et = _e && typeof a.getDerivedStateFromError != "function" ? null : s.render();
	return (
		(i.flags |= 1),
		o !== null && _e
			? ((i.child = Bh(i, o.child, null, j)), (i.child = Bh(i, null, et, j)))
			: Yi(o, i, et, j),
		(i.memoizedState = s.state),
		$ && dg(i, a, !0),
		i.child
	);
}
function lj(o) {
	var i = o.stateNode;
	(i.pendingContext
		? ag(o, i.pendingContext, i.pendingContext !== i.context)
		: i.context && ag(o, i.context, !1),
		Ih(o, i.containerInfo));
}
function mj(o, i, a, s, $) {
	return (Ig(), Jg($), (i.flags |= 256), Yi(o, i, a, s), i.child);
}
var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
function oj(o) {
	return { baseLanes: o, cachePool: null, transitions: null };
}
function pj(o, i, a) {
	var s = i.pendingProps,
		$ = M.current,
		j = !1,
		_e = (i.flags & 128) !== 0,
		et;
	if (
		((et = _e) || (et = o !== null && o.memoizedState === null ? !1 : ($ & 2) !== 0),
		et ? ((j = !0), (i.flags &= -129)) : (o === null || o.memoizedState !== null) && ($ |= 1),
		G(M, $ & 1),
		o === null)
	)
		return (
			Eg(i),
			(o = i.memoizedState),
			o !== null && ((o = o.dehydrated), o !== null)
				? (i.mode & 1 ? (o.data === "$!" ? (i.lanes = 8) : (i.lanes = 1073741824)) : (i.lanes = 1),
					null)
				: ((_e = s.children),
					(o = s.fallback),
					j
						? ((s = i.mode),
							(j = i.child),
							(_e = { mode: "hidden", children: _e }),
							!(s & 1) && j !== null
								? ((j.childLanes = 0), (j.pendingProps = _e))
								: (j = qj(_e, s, 0, null)),
							(o = Ah(o, s, a, null)),
							(j.return = i),
							(o.return = i),
							(j.sibling = o),
							(i.child = j),
							(i.child.memoizedState = oj(a)),
							(i.memoizedState = nj),
							o)
						: rj(i, _e))
		);
	if ((($ = o.memoizedState), $ !== null && ((et = $.dehydrated), et !== null)))
		return sj(o, i, _e, s, et, $, a);
	if (j) {
		((j = s.fallback), (_e = i.mode), ($ = o.child), (et = $.sibling));
		var tt = { mode: "hidden", children: s.children };
		return (
			!(_e & 1) && i.child !== $
				? ((s = i.child), (s.childLanes = 0), (s.pendingProps = tt), (i.deletions = null))
				: ((s = wh($, tt)), (s.subtreeFlags = $.subtreeFlags & 14680064)),
			et !== null ? (j = wh(et, j)) : ((j = Ah(j, _e, a, null)), (j.flags |= 2)),
			(j.return = i),
			(s.return = i),
			(s.sibling = j),
			(i.child = s),
			(s = j),
			(j = i.child),
			(_e = o.child.memoizedState),
			(_e =
				_e === null
					? oj(a)
					: { baseLanes: _e.baseLanes | a, cachePool: null, transitions: _e.transitions }),
			(j.memoizedState = _e),
			(j.childLanes = o.childLanes & ~a),
			(i.memoizedState = nj),
			s
		);
	}
	return (
		(j = o.child),
		(o = j.sibling),
		(s = wh(j, { mode: "visible", children: s.children })),
		!(i.mode & 1) && (s.lanes = a),
		(s.return = i),
		(s.sibling = null),
		o !== null &&
			((a = i.deletions), a === null ? ((i.deletions = [o]), (i.flags |= 16)) : a.push(o)),
		(i.child = s),
		(i.memoizedState = null),
		s
	);
}
function rj(o, i) {
	return (
		(i = qj({ mode: "visible", children: i }, o.mode, 0, null)), (i.return = o), (o.child = i)
	);
}
function tj(o, i, a, s) {
	return (
		s !== null && Jg(s),
		Bh(i, o.child, null, a),
		(o = rj(i, i.pendingProps.children)),
		(o.flags |= 2),
		(i.memoizedState = null),
		o
	);
}
function sj(o, i, a, s, $, j, _e) {
	if (a)
		return i.flags & 256
			? ((i.flags &= -257), (s = Li(Error(p$1(422)))), tj(o, i, _e, s))
			: i.memoizedState !== null
				? ((i.child = o.child), (i.flags |= 128), null)
				: ((j = s.fallback),
					($ = i.mode),
					(s = qj({ mode: "visible", children: s.children }, $, 0, null)),
					(j = Ah(j, $, _e, null)),
					(j.flags |= 2),
					(s.return = i),
					(j.return = i),
					(s.sibling = j),
					(i.child = s),
					i.mode & 1 && Bh(i, o.child, null, _e),
					(i.child.memoizedState = oj(_e)),
					(i.memoizedState = nj),
					j);
	if (!(i.mode & 1)) return tj(o, i, _e, null);
	if ($.data === "$!") {
		if (((s = $.nextSibling && $.nextSibling.dataset), s)) var et = s.dgst;
		return ((s = et), (j = Error(p$1(419))), (s = Li(j, s, void 0)), tj(o, i, _e, s));
	}
	if (((et = (_e & o.childLanes) !== 0), Ug || et)) {
		if (((s = R), s !== null)) {
			switch (_e & -_e) {
				case 4:
					$ = 2;
					break;
				case 16:
					$ = 8;
					break;
				case 64:
				case 128:
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072:
				case 262144:
				case 524288:
				case 1048576:
				case 2097152:
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432:
				case 67108864:
					$ = 32;
					break;
				case 536870912:
					$ = 268435456;
					break;
				default:
					$ = 0;
			}
			(($ = $ & (s.suspendedLanes | _e) ? 0 : $),
				$ !== 0 && $ !== j.retryLane && ((j.retryLane = $), Zg(o, $), mh(s, o, $, -1)));
		}
		return (uj(), (s = Li(Error(p$1(421)))), tj(o, i, _e, s));
	}
	return $.data === "$?"
		? ((i.flags |= 128), (i.child = o.child), (i = vj.bind(null, o)), ($._reactRetry = i), null)
		: ((o = j.treeContext),
			(yg = Lf($.nextSibling)),
			(xg = i),
			(I = !0),
			(zg = null),
			o !== null &&
				((og[pg++] = rg),
				(og[pg++] = sg),
				(og[pg++] = qg),
				(rg = o.id),
				(sg = o.overflow),
				(qg = i)),
			(i = rj(i, s.children)),
			(i.flags |= 4096),
			i);
}
function wj(o, i, a) {
	o.lanes |= i;
	var s = o.alternate;
	(s !== null && (s.lanes |= i), Sg(o.return, i, a));
}
function xj(o, i, a, s, $) {
	var j = o.memoizedState;
	j === null
		? (o.memoizedState = {
				isBackwards: i,
				rendering: null,
				renderingStartTime: 0,
				last: s,
				tail: a,
				tailMode: $,
			})
		: ((j.isBackwards = i),
			(j.rendering = null),
			(j.renderingStartTime = 0),
			(j.last = s),
			(j.tail = a),
			(j.tailMode = $));
}
function yj(o, i, a) {
	var s = i.pendingProps,
		$ = s.revealOrder,
		j = s.tail;
	if ((Yi(o, i, s.children, a), (s = M.current), s & 2)) ((s = (s & 1) | 2), (i.flags |= 128));
	else {
		if (o !== null && o.flags & 128)
			e: for (o = i.child; o !== null; ) {
				if (o.tag === 13) o.memoizedState !== null && wj(o, a, i);
				else if (o.tag === 19) wj(o, a, i);
				else if (o.child !== null) {
					((o.child.return = o), (o = o.child));
					continue;
				}
				if (o === i) break e;
				for (; o.sibling === null; ) {
					if (o.return === null || o.return === i) break e;
					o = o.return;
				}
				((o.sibling.return = o.return), (o = o.sibling));
			}
		s &= 1;
	}
	if ((G(M, s), !(i.mode & 1))) i.memoizedState = null;
	else
		switch ($) {
			case "forwards":
				for (a = i.child, $ = null; a !== null; )
					((o = a.alternate), o !== null && Mh(o) === null && ($ = a), (a = a.sibling));
				((a = $),
					a === null ? (($ = i.child), (i.child = null)) : (($ = a.sibling), (a.sibling = null)),
					xj(i, !1, $, a, j));
				break;
			case "backwards":
				for (a = null, $ = i.child, i.child = null; $ !== null; ) {
					if (((o = $.alternate), o !== null && Mh(o) === null)) {
						i.child = $;
						break;
					}
					((o = $.sibling), ($.sibling = a), (a = $), ($ = o));
				}
				xj(i, !0, a, null, j);
				break;
			case "together":
				xj(i, !1, null, null, void 0);
				break;
			default:
				i.memoizedState = null;
		}
	return i.child;
}
function jj(o, i) {
	!(i.mode & 1) && o !== null && ((o.alternate = null), (i.alternate = null), (i.flags |= 2));
}
function $i(o, i, a) {
	if ((o !== null && (i.dependencies = o.dependencies), (hh |= i.lanes), !(a & i.childLanes)))
		return null;
	if (o !== null && i.child !== o.child) throw Error(p$1(153));
	if (i.child !== null) {
		for (o = i.child, a = wh(o, o.pendingProps), i.child = a, a.return = i; o.sibling !== null; )
			((o = o.sibling), (a = a.sibling = wh(o, o.pendingProps)), (a.return = i));
		a.sibling = null;
	}
	return i.child;
}
function zj(o, i, a) {
	switch (i.tag) {
		case 3:
			(lj(i), Ig());
			break;
		case 5:
			Kh(i);
			break;
		case 1:
			Zf(i.type) && cg(i);
			break;
		case 4:
			Ih(i, i.stateNode.containerInfo);
			break;
		case 10:
			var s = i.type._context,
				$ = i.memoizedProps.value;
			(G(Mg, s._currentValue), (s._currentValue = $));
			break;
		case 13:
			if (((s = i.memoizedState), s !== null))
				return s.dehydrated !== null
					? (G(M, M.current & 1), (i.flags |= 128), null)
					: a & i.child.childLanes
						? pj(o, i, a)
						: (G(M, M.current & 1), (o = $i(o, i, a)), o !== null ? o.sibling : null);
			G(M, M.current & 1);
			break;
		case 19:
			if (((s = (a & i.childLanes) !== 0), o.flags & 128)) {
				if (s) return yj(o, i, a);
				i.flags |= 128;
			}
			if (
				(($ = i.memoizedState),
				$ !== null && (($.rendering = null), ($.tail = null), ($.lastEffect = null)),
				G(M, M.current),
				s)
			)
				break;
			return null;
		case 22:
		case 23:
			return ((i.lanes = 0), ej(o, i, a));
	}
	return $i(o, i, a);
}
var Aj, Bj, Cj, Dj;
Aj = function (o, i) {
	for (var a = i.child; a !== null; ) {
		if (a.tag === 5 || a.tag === 6) o.appendChild(a.stateNode);
		else if (a.tag !== 4 && a.child !== null) {
			((a.child.return = a), (a = a.child));
			continue;
		}
		if (a === i) break;
		for (; a.sibling === null; ) {
			if (a.return === null || a.return === i) return;
			a = a.return;
		}
		((a.sibling.return = a.return), (a = a.sibling));
	}
};
Bj = function () {};
Cj = function (o, i, a, s) {
	var $ = o.memoizedProps;
	if ($ !== s) {
		((o = i.stateNode), Hh(Eh.current));
		var j = null;
		switch (a) {
			case "input":
				(($ = Ya(o, $)), (s = Ya(o, s)), (j = []));
				break;
			case "select":
				(($ = A$1({}, $, { value: void 0 })), (s = A$1({}, s, { value: void 0 })), (j = []));
				break;
			case "textarea":
				(($ = gb(o, $)), (s = gb(o, s)), (j = []));
				break;
			default:
				typeof $.onClick != "function" && typeof s.onClick == "function" && (o.onclick = Bf);
		}
		ub(a, s);
		var _e;
		a = null;
		for (rt in $)
			if (!s.hasOwnProperty(rt) && $.hasOwnProperty(rt) && $[rt] != null)
				if (rt === "style") {
					var et = $[rt];
					for (_e in et) et.hasOwnProperty(_e) && (a || (a = {}), (a[_e] = ""));
				} else
					rt !== "dangerouslySetInnerHTML" &&
						rt !== "children" &&
						rt !== "suppressContentEditableWarning" &&
						rt !== "suppressHydrationWarning" &&
						rt !== "autoFocus" &&
						(ea.hasOwnProperty(rt) ? j || (j = []) : (j = j || []).push(rt, null));
		for (rt in s) {
			var tt = s[rt];
			if (
				((et = $ != null ? $[rt] : void 0),
				s.hasOwnProperty(rt) && tt !== et && (tt != null || et != null))
			)
				if (rt === "style")
					if (et) {
						for (_e in et)
							!et.hasOwnProperty(_e) ||
								(tt && tt.hasOwnProperty(_e)) ||
								(a || (a = {}), (a[_e] = ""));
						for (_e in tt)
							tt.hasOwnProperty(_e) && et[_e] !== tt[_e] && (a || (a = {}), (a[_e] = tt[_e]));
					} else (a || (j || (j = []), j.push(rt, a)), (a = tt));
				else
					rt === "dangerouslySetInnerHTML"
						? ((tt = tt ? tt.__html : void 0),
							(et = et ? et.__html : void 0),
							tt != null && et !== tt && (j = j || []).push(rt, tt))
						: rt === "children"
							? (typeof tt != "string" && typeof tt != "number") || (j = j || []).push(rt, "" + tt)
							: rt !== "suppressContentEditableWarning" &&
								rt !== "suppressHydrationWarning" &&
								(ea.hasOwnProperty(rt)
									? (tt != null && rt === "onScroll" && D("scroll", o), j || et === tt || (j = []))
									: (j = j || []).push(rt, tt));
		}
		a && (j = j || []).push("style", a);
		var rt = j;
		(i.updateQueue = rt) && (i.flags |= 4);
	}
};
Dj = function (o, i, a, s) {
	a !== s && (i.flags |= 4);
};
function Ej(o, i) {
	if (!I)
		switch (o.tailMode) {
			case "hidden":
				i = o.tail;
				for (var a = null; i !== null; ) (i.alternate !== null && (a = i), (i = i.sibling));
				a === null ? (o.tail = null) : (a.sibling = null);
				break;
			case "collapsed":
				a = o.tail;
				for (var s = null; a !== null; ) (a.alternate !== null && (s = a), (a = a.sibling));
				s === null
					? i || o.tail === null
						? (o.tail = null)
						: (o.tail.sibling = null)
					: (s.sibling = null);
		}
}
function S(o) {
	var i = o.alternate !== null && o.alternate.child === o.child,
		a = 0,
		s = 0;
	if (i)
		for (var $ = o.child; $ !== null; )
			((a |= $.lanes | $.childLanes),
				(s |= $.subtreeFlags & 14680064),
				(s |= $.flags & 14680064),
				($.return = o),
				($ = $.sibling));
	else
		for ($ = o.child; $ !== null; )
			((a |= $.lanes | $.childLanes),
				(s |= $.subtreeFlags),
				(s |= $.flags),
				($.return = o),
				($ = $.sibling));
	return ((o.subtreeFlags |= s), (o.childLanes = a), i);
}
function Fj(o, i, a) {
	var s = i.pendingProps;
	switch ((wg(i), i.tag)) {
		case 2:
		case 16:
		case 15:
		case 0:
		case 11:
		case 7:
		case 8:
		case 12:
		case 9:
		case 14:
			return (S(i), null);
		case 1:
			return (Zf(i.type) && $f(), S(i), null);
		case 3:
			return (
				(s = i.stateNode),
				Jh(),
				E(Wf),
				E(H),
				Oh(),
				s.pendingContext && ((s.context = s.pendingContext), (s.pendingContext = null)),
				(o === null || o.child === null) &&
					(Gg(i)
						? (i.flags |= 4)
						: o === null ||
							(o.memoizedState.isDehydrated && !(i.flags & 256)) ||
							((i.flags |= 1024), zg !== null && (Gj(zg), (zg = null)))),
				Bj(o, i),
				S(i),
				null
			);
		case 5:
			Lh(i);
			var $ = Hh(Gh.current);
			if (((a = i.type), o !== null && i.stateNode != null))
				(Cj(o, i, a, s, $), o.ref !== i.ref && ((i.flags |= 512), (i.flags |= 2097152)));
			else {
				if (!s) {
					if (i.stateNode === null) throw Error(p$1(166));
					return (S(i), null);
				}
				if (((o = Hh(Eh.current)), Gg(i))) {
					((s = i.stateNode), (a = i.type));
					var j = i.memoizedProps;
					switch (((s[Of] = i), (s[Pf] = j), (o = (i.mode & 1) !== 0), a)) {
						case "dialog":
							(D("cancel", s), D("close", s));
							break;
						case "iframe":
						case "object":
						case "embed":
							D("load", s);
							break;
						case "video":
						case "audio":
							for ($ = 0; $ < lf.length; $++) D(lf[$], s);
							break;
						case "source":
							D("error", s);
							break;
						case "img":
						case "image":
						case "link":
							(D("error", s), D("load", s));
							break;
						case "details":
							D("toggle", s);
							break;
						case "input":
							(Za(s, j), D("invalid", s));
							break;
						case "select":
							((s._wrapperState = { wasMultiple: !!j.multiple }), D("invalid", s));
							break;
						case "textarea":
							(hb(s, j), D("invalid", s));
					}
					(ub(a, j), ($ = null));
					for (var _e in j)
						if (j.hasOwnProperty(_e)) {
							var et = j[_e];
							_e === "children"
								? typeof et == "string"
									? s.textContent !== et &&
										(j.suppressHydrationWarning !== !0 && Af(s.textContent, et, o),
										($ = ["children", et]))
									: typeof et == "number" &&
										s.textContent !== "" + et &&
										(j.suppressHydrationWarning !== !0 && Af(s.textContent, et, o),
										($ = ["children", "" + et]))
								: ea.hasOwnProperty(_e) && et != null && _e === "onScroll" && D("scroll", s);
						}
					switch (a) {
						case "input":
							(Va(s), db(s, j, !0));
							break;
						case "textarea":
							(Va(s), jb(s));
							break;
						case "select":
						case "option":
							break;
						default:
							typeof j.onClick == "function" && (s.onclick = Bf);
					}
					((s = $), (i.updateQueue = s), s !== null && (i.flags |= 4));
				} else {
					((_e = $.nodeType === 9 ? $ : $.ownerDocument),
						o === "http://www.w3.org/1999/xhtml" && (o = kb(a)),
						o === "http://www.w3.org/1999/xhtml"
							? a === "script"
								? ((o = _e.createElement("div")),
									(o.innerHTML = "<script><\/script>"),
									(o = o.removeChild(o.firstChild)))
								: typeof s.is == "string"
									? (o = _e.createElement(a, { is: s.is }))
									: ((o = _e.createElement(a)),
										a === "select" &&
											((_e = o), s.multiple ? (_e.multiple = !0) : s.size && (_e.size = s.size)))
							: (o = _e.createElementNS(o, a)),
						(o[Of] = i),
						(o[Pf] = s),
						Aj(o, i, !1, !1),
						(i.stateNode = o));
					e: {
						switch (((_e = vb(a, s)), a)) {
							case "dialog":
								(D("cancel", o), D("close", o), ($ = s));
								break;
							case "iframe":
							case "object":
							case "embed":
								(D("load", o), ($ = s));
								break;
							case "video":
							case "audio":
								for ($ = 0; $ < lf.length; $++) D(lf[$], o);
								$ = s;
								break;
							case "source":
								(D("error", o), ($ = s));
								break;
							case "img":
							case "image":
							case "link":
								(D("error", o), D("load", o), ($ = s));
								break;
							case "details":
								(D("toggle", o), ($ = s));
								break;
							case "input":
								(Za(o, s), ($ = Ya(o, s)), D("invalid", o));
								break;
							case "option":
								$ = s;
								break;
							case "select":
								((o._wrapperState = { wasMultiple: !!s.multiple }),
									($ = A$1({}, s, { value: void 0 })),
									D("invalid", o));
								break;
							case "textarea":
								(hb(o, s), ($ = gb(o, s)), D("invalid", o));
								break;
							default:
								$ = s;
						}
						(ub(a, $), (et = $));
						for (j in et)
							if (et.hasOwnProperty(j)) {
								var tt = et[j];
								j === "style"
									? sb(o, tt)
									: j === "dangerouslySetInnerHTML"
										? ((tt = tt ? tt.__html : void 0), tt != null && nb(o, tt))
										: j === "children"
											? typeof tt == "string"
												? (a !== "textarea" || tt !== "") && ob(o, tt)
												: typeof tt == "number" && ob(o, "" + tt)
											: j !== "suppressContentEditableWarning" &&
												j !== "suppressHydrationWarning" &&
												j !== "autoFocus" &&
												(ea.hasOwnProperty(j)
													? tt != null && j === "onScroll" && D("scroll", o)
													: tt != null && ta(o, j, tt, _e));
							}
						switch (a) {
							case "input":
								(Va(o), db(o, s, !1));
								break;
							case "textarea":
								(Va(o), jb(o));
								break;
							case "option":
								s.value != null && o.setAttribute("value", "" + Sa(s.value));
								break;
							case "select":
								((o.multiple = !!s.multiple),
									(j = s.value),
									j != null
										? fb(o, !!s.multiple, j, !1)
										: s.defaultValue != null && fb(o, !!s.multiple, s.defaultValue, !0));
								break;
							default:
								typeof $.onClick == "function" && (o.onclick = Bf);
						}
						switch (a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								s = !!s.autoFocus;
								break e;
							case "img":
								s = !0;
								break e;
							default:
								s = !1;
						}
					}
					s && (i.flags |= 4);
				}
				i.ref !== null && ((i.flags |= 512), (i.flags |= 2097152));
			}
			return (S(i), null);
		case 6:
			if (o && i.stateNode != null) Dj(o, i, o.memoizedProps, s);
			else {
				if (typeof s != "string" && i.stateNode === null) throw Error(p$1(166));
				if (((a = Hh(Gh.current)), Hh(Eh.current), Gg(i))) {
					if (
						((s = i.stateNode),
						(a = i.memoizedProps),
						(s[Of] = i),
						(j = s.nodeValue !== a) && ((o = xg), o !== null))
					)
						switch (o.tag) {
							case 3:
								Af(s.nodeValue, a, (o.mode & 1) !== 0);
								break;
							case 5:
								o.memoizedProps.suppressHydrationWarning !== !0 &&
									Af(s.nodeValue, a, (o.mode & 1) !== 0);
						}
					j && (i.flags |= 4);
				} else
					((s = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(s)),
						(s[Of] = i),
						(i.stateNode = s));
			}
			return (S(i), null);
		case 13:
			if (
				(E(M),
				(s = i.memoizedState),
				o === null || (o.memoizedState !== null && o.memoizedState.dehydrated !== null))
			) {
				if (I && yg !== null && i.mode & 1 && !(i.flags & 128))
					(Hg(), Ig(), (i.flags |= 98560), (j = !1));
				else if (((j = Gg(i)), s !== null && s.dehydrated !== null)) {
					if (o === null) {
						if (!j) throw Error(p$1(318));
						if (((j = i.memoizedState), (j = j !== null ? j.dehydrated : null), !j))
							throw Error(p$1(317));
						j[Of] = i;
					} else (Ig(), !(i.flags & 128) && (i.memoizedState = null), (i.flags |= 4));
					(S(i), (j = !1));
				} else (zg !== null && (Gj(zg), (zg = null)), (j = !0));
				if (!j) return i.flags & 65536 ? i : null;
			}
			return i.flags & 128
				? ((i.lanes = a), i)
				: ((s = s !== null),
					s !== (o !== null && o.memoizedState !== null) &&
						s &&
						((i.child.flags |= 8192),
						i.mode & 1 && (o === null || M.current & 1 ? T === 0 && (T = 3) : uj())),
					i.updateQueue !== null && (i.flags |= 4),
					S(i),
					null);
		case 4:
			return (Jh(), Bj(o, i), o === null && sf(i.stateNode.containerInfo), S(i), null);
		case 10:
			return (Rg(i.type._context), S(i), null);
		case 17:
			return (Zf(i.type) && $f(), S(i), null);
		case 19:
			if ((E(M), (j = i.memoizedState), j === null)) return (S(i), null);
			if (((s = (i.flags & 128) !== 0), (_e = j.rendering), _e === null))
				if (s) Ej(j, !1);
				else {
					if (T !== 0 || (o !== null && o.flags & 128))
						for (o = i.child; o !== null; ) {
							if (((_e = Mh(o)), _e !== null)) {
								for (
									i.flags |= 128,
										Ej(j, !1),
										s = _e.updateQueue,
										s !== null && ((i.updateQueue = s), (i.flags |= 4)),
										i.subtreeFlags = 0,
										s = a,
										a = i.child;
									a !== null;
								)
									((j = a),
										(o = s),
										(j.flags &= 14680066),
										(_e = j.alternate),
										_e === null
											? ((j.childLanes = 0),
												(j.lanes = o),
												(j.child = null),
												(j.subtreeFlags = 0),
												(j.memoizedProps = null),
												(j.memoizedState = null),
												(j.updateQueue = null),
												(j.dependencies = null),
												(j.stateNode = null))
											: ((j.childLanes = _e.childLanes),
												(j.lanes = _e.lanes),
												(j.child = _e.child),
												(j.subtreeFlags = 0),
												(j.deletions = null),
												(j.memoizedProps = _e.memoizedProps),
												(j.memoizedState = _e.memoizedState),
												(j.updateQueue = _e.updateQueue),
												(j.type = _e.type),
												(o = _e.dependencies),
												(j.dependencies =
													o === null ? null : { lanes: o.lanes, firstContext: o.firstContext })),
										(a = a.sibling));
								return (G(M, (M.current & 1) | 2), i.child);
							}
							o = o.sibling;
						}
					j.tail !== null &&
						B() > Hj &&
						((i.flags |= 128), (s = !0), Ej(j, !1), (i.lanes = 4194304));
				}
			else {
				if (!s)
					if (((o = Mh(_e)), o !== null)) {
						if (
							((i.flags |= 128),
							(s = !0),
							(a = o.updateQueue),
							a !== null && ((i.updateQueue = a), (i.flags |= 4)),
							Ej(j, !0),
							j.tail === null && j.tailMode === "hidden" && !_e.alternate && !I)
						)
							return (S(i), null);
					} else
						2 * B() - j.renderingStartTime > Hj &&
							a !== 1073741824 &&
							((i.flags |= 128), (s = !0), Ej(j, !1), (i.lanes = 4194304));
				j.isBackwards
					? ((_e.sibling = i.child), (i.child = _e))
					: ((a = j.last), a !== null ? (a.sibling = _e) : (i.child = _e), (j.last = _e));
			}
			return j.tail !== null
				? ((i = j.tail),
					(j.rendering = i),
					(j.tail = i.sibling),
					(j.renderingStartTime = B()),
					(i.sibling = null),
					(a = M.current),
					G(M, s ? (a & 1) | 2 : a & 1),
					i)
				: (S(i), null);
		case 22:
		case 23:
			return (
				Ij(),
				(s = i.memoizedState !== null),
				o !== null && (o.memoizedState !== null) !== s && (i.flags |= 8192),
				s && i.mode & 1 ? gj & 1073741824 && (S(i), i.subtreeFlags & 6 && (i.flags |= 8192)) : S(i),
				null
			);
		case 24:
			return null;
		case 25:
			return null;
	}
	throw Error(p$1(156, i.tag));
}
function Jj(o, i) {
	switch ((wg(i), i.tag)) {
		case 1:
			return (
				Zf(i.type) && $f(), (o = i.flags), o & 65536 ? ((i.flags = (o & -65537) | 128), i) : null
			);
		case 3:
			return (
				Jh(),
				E(Wf),
				E(H),
				Oh(),
				(o = i.flags),
				o & 65536 && !(o & 128) ? ((i.flags = (o & -65537) | 128), i) : null
			);
		case 5:
			return (Lh(i), null);
		case 13:
			if ((E(M), (o = i.memoizedState), o !== null && o.dehydrated !== null)) {
				if (i.alternate === null) throw Error(p$1(340));
				Ig();
			}
			return ((o = i.flags), o & 65536 ? ((i.flags = (o & -65537) | 128), i) : null);
		case 19:
			return (E(M), null);
		case 4:
			return (Jh(), null);
		case 10:
			return (Rg(i.type._context), null);
		case 22:
		case 23:
			return (Ij(), null);
		case 24:
			return null;
		default:
			return null;
	}
}
var Kj = !1,
	U = !1,
	Lj = typeof WeakSet == "function" ? WeakSet : Set,
	V = null;
function Mj(o, i) {
	var a = o.ref;
	if (a !== null)
		if (typeof a == "function")
			try {
				a(null);
			} catch (s) {
				W(o, i, s);
			}
		else a.current = null;
}
function Nj(o, i, a) {
	try {
		a();
	} catch (s) {
		W(o, i, s);
	}
}
var Oj = !1;
function Pj(o, i) {
	if (((Cf = dd), (o = Me()), Ne(o))) {
		if ("selectionStart" in o) var a = { start: o.selectionStart, end: o.selectionEnd };
		else
			e: {
				a = ((a = o.ownerDocument) && a.defaultView) || window;
				var s = a.getSelection && a.getSelection();
				if (s && s.rangeCount !== 0) {
					a = s.anchorNode;
					var $ = s.anchorOffset,
						j = s.focusNode;
					s = s.focusOffset;
					try {
						(a.nodeType, j.nodeType);
					} catch {
						a = null;
						break e;
					}
					var _e = 0,
						et = -1,
						tt = -1,
						rt = 0,
						nt = 0,
						it = o,
						ot = null;
					t: for (;;) {
						for (
							var st;
							it !== a || ($ !== 0 && it.nodeType !== 3) || (et = _e + $),
								it !== j || (s !== 0 && it.nodeType !== 3) || (tt = _e + s),
								it.nodeType === 3 && (_e += it.nodeValue.length),
								(st = it.firstChild) !== null;
						)
							((ot = it), (it = st));
						for (;;) {
							if (it === o) break t;
							if (
								(ot === a && ++rt === $ && (et = _e),
								ot === j && ++nt === s && (tt = _e),
								(st = it.nextSibling) !== null)
							)
								break;
							((it = ot), (ot = it.parentNode));
						}
						it = st;
					}
					a = et === -1 || tt === -1 ? null : { start: et, end: tt };
				} else a = null;
			}
		a = a || { start: 0, end: 0 };
	} else a = null;
	for (Df = { focusedElem: o, selectionRange: a }, dd = !1, V = i; V !== null; )
		if (((i = V), (o = i.child), (i.subtreeFlags & 1028) !== 0 && o !== null))
			((o.return = i), (V = o));
		else
			for (; V !== null; ) {
				i = V;
				try {
					var lt = i.alternate;
					if (i.flags & 1024)
						switch (i.tag) {
							case 0:
							case 11:
							case 15:
								break;
							case 1:
								if (lt !== null) {
									var dt = lt.memoizedProps,
										pt = lt.memoizedState,
										ct = i.stateNode,
										at = ct.getSnapshotBeforeUpdate(
											i.elementType === i.type ? dt : Lg(i.type, dt),
											pt
										);
									ct.__reactInternalSnapshotBeforeUpdate = at;
								}
								break;
							case 3:
								var ft = i.stateNode.containerInfo;
								ft.nodeType === 1
									? (ft.textContent = "")
									: ft.nodeType === 9 && ft.documentElement && ft.removeChild(ft.documentElement);
								break;
							case 5:
							case 6:
							case 4:
							case 17:
								break;
							default:
								throw Error(p$1(163));
						}
				} catch (ut) {
					W(i, i.return, ut);
				}
				if (((o = i.sibling), o !== null)) {
					((o.return = i.return), (V = o));
					break;
				}
				V = i.return;
			}
	return ((lt = Oj), (Oj = !1), lt);
}
function Qj(o, i, a) {
	var s = i.updateQueue;
	if (((s = s !== null ? s.lastEffect : null), s !== null)) {
		var $ = (s = s.next);
		do {
			if (($.tag & o) === o) {
				var j = $.destroy;
				(($.destroy = void 0), j !== void 0 && Nj(i, a, j));
			}
			$ = $.next;
		} while ($ !== s);
	}
}
function Rj(o, i) {
	if (((i = i.updateQueue), (i = i !== null ? i.lastEffect : null), i !== null)) {
		var a = (i = i.next);
		do {
			if ((a.tag & o) === o) {
				var s = a.create;
				a.destroy = s();
			}
			a = a.next;
		} while (a !== i);
	}
}
function Sj(o) {
	var i = o.ref;
	if (i !== null) {
		var a = o.stateNode;
		switch (o.tag) {
			case 5:
				o = a;
				break;
			default:
				o = a;
		}
		typeof i == "function" ? i(o) : (i.current = o);
	}
}
function Tj(o) {
	var i = o.alternate;
	(i !== null && ((o.alternate = null), Tj(i)),
		(o.child = null),
		(o.deletions = null),
		(o.sibling = null),
		o.tag === 5 &&
			((i = o.stateNode),
			i !== null && (delete i[Of], delete i[Pf], delete i[of], delete i[Qf], delete i[Rf])),
		(o.stateNode = null),
		(o.return = null),
		(o.dependencies = null),
		(o.memoizedProps = null),
		(o.memoizedState = null),
		(o.pendingProps = null),
		(o.stateNode = null),
		(o.updateQueue = null));
}
function Uj(o) {
	return o.tag === 5 || o.tag === 3 || o.tag === 4;
}
function Vj(o) {
	e: for (;;) {
		for (; o.sibling === null; ) {
			if (o.return === null || Uj(o.return)) return null;
			o = o.return;
		}
		for (o.sibling.return = o.return, o = o.sibling; o.tag !== 5 && o.tag !== 6 && o.tag !== 18; ) {
			if (o.flags & 2 || o.child === null || o.tag === 4) continue e;
			((o.child.return = o), (o = o.child));
		}
		if (!(o.flags & 2)) return o.stateNode;
	}
}
function Wj(o, i, a) {
	var s = o.tag;
	if (s === 5 || s === 6)
		((o = o.stateNode),
			i
				? a.nodeType === 8
					? a.parentNode.insertBefore(o, i)
					: a.insertBefore(o, i)
				: (a.nodeType === 8
						? ((i = a.parentNode), i.insertBefore(o, a))
						: ((i = a), i.appendChild(o)),
					(a = a._reactRootContainer),
					a != null || i.onclick !== null || (i.onclick = Bf)));
	else if (s !== 4 && ((o = o.child), o !== null))
		for (Wj(o, i, a), o = o.sibling; o !== null; ) (Wj(o, i, a), (o = o.sibling));
}
function Xj(o, i, a) {
	var s = o.tag;
	if (s === 5 || s === 6) ((o = o.stateNode), i ? a.insertBefore(o, i) : a.appendChild(o));
	else if (s !== 4 && ((o = o.child), o !== null))
		for (Xj(o, i, a), o = o.sibling; o !== null; ) (Xj(o, i, a), (o = o.sibling));
}
var X = null,
	Yj = !1;
function Zj(o, i, a) {
	for (a = a.child; a !== null; ) (ak(o, i, a), (a = a.sibling));
}
function ak(o, i, a) {
	if (lc && typeof lc.onCommitFiberUnmount == "function")
		try {
			lc.onCommitFiberUnmount(kc, a);
		} catch {}
	switch (a.tag) {
		case 5:
			U || Mj(a, i);
		case 6:
			var s = X,
				$ = Yj;
			((X = null),
				Zj(o, i, a),
				(X = s),
				(Yj = $),
				X !== null &&
					(Yj
						? ((o = X),
							(a = a.stateNode),
							o.nodeType === 8 ? o.parentNode.removeChild(a) : o.removeChild(a))
						: X.removeChild(a.stateNode)));
			break;
		case 18:
			X !== null &&
				(Yj
					? ((o = X),
						(a = a.stateNode),
						o.nodeType === 8 ? Kf(o.parentNode, a) : o.nodeType === 1 && Kf(o, a),
						bd(o))
					: Kf(X, a.stateNode));
			break;
		case 4:
			((s = X),
				($ = Yj),
				(X = a.stateNode.containerInfo),
				(Yj = !0),
				Zj(o, i, a),
				(X = s),
				(Yj = $));
			break;
		case 0:
		case 11:
		case 14:
		case 15:
			if (!U && ((s = a.updateQueue), s !== null && ((s = s.lastEffect), s !== null))) {
				$ = s = s.next;
				do {
					var j = $,
						_e = j.destroy;
					((j = j.tag), _e !== void 0 && (j & 2 || j & 4) && Nj(a, i, _e), ($ = $.next));
				} while ($ !== s);
			}
			Zj(o, i, a);
			break;
		case 1:
			if (!U && (Mj(a, i), (s = a.stateNode), typeof s.componentWillUnmount == "function"))
				try {
					((s.props = a.memoizedProps), (s.state = a.memoizedState), s.componentWillUnmount());
				} catch (et) {
					W(a, i, et);
				}
			Zj(o, i, a);
			break;
		case 21:
			Zj(o, i, a);
			break;
		case 22:
			a.mode & 1 ? ((U = (s = U) || a.memoizedState !== null), Zj(o, i, a), (U = s)) : Zj(o, i, a);
			break;
		default:
			Zj(o, i, a);
	}
}
function bk(o) {
	var i = o.updateQueue;
	if (i !== null) {
		o.updateQueue = null;
		var a = o.stateNode;
		(a === null && (a = o.stateNode = new Lj()),
			i.forEach(function (s) {
				var $ = ck.bind(null, o, s);
				a.has(s) || (a.add(s), s.then($, $));
			}));
	}
}
function dk(o, i) {
	var a = i.deletions;
	if (a !== null)
		for (var s = 0; s < a.length; s++) {
			var $ = a[s];
			try {
				var j = o,
					_e = i,
					et = _e;
				e: for (; et !== null; ) {
					switch (et.tag) {
						case 5:
							((X = et.stateNode), (Yj = !1));
							break e;
						case 3:
							((X = et.stateNode.containerInfo), (Yj = !0));
							break e;
						case 4:
							((X = et.stateNode.containerInfo), (Yj = !0));
							break e;
					}
					et = et.return;
				}
				if (X === null) throw Error(p$1(160));
				(ak(j, _e, $), (X = null), (Yj = !1));
				var tt = $.alternate;
				(tt !== null && (tt.return = null), ($.return = null));
			} catch (rt) {
				W($, i, rt);
			}
		}
	if (i.subtreeFlags & 12854) for (i = i.child; i !== null; ) (ek(i, o), (i = i.sibling));
}
function ek(o, i) {
	var a = o.alternate,
		s = o.flags;
	switch (o.tag) {
		case 0:
		case 11:
		case 14:
		case 15:
			if ((dk(i, o), fk(o), s & 4)) {
				try {
					(Qj(3, o, o.return), Rj(3, o));
				} catch (dt) {
					W(o, o.return, dt);
				}
				try {
					Qj(5, o, o.return);
				} catch (dt) {
					W(o, o.return, dt);
				}
			}
			break;
		case 1:
			(dk(i, o), fk(o), s & 512 && a !== null && Mj(a, a.return));
			break;
		case 5:
			if ((dk(i, o), fk(o), s & 512 && a !== null && Mj(a, a.return), o.flags & 32)) {
				var $ = o.stateNode;
				try {
					ob($, "");
				} catch (dt) {
					W(o, o.return, dt);
				}
			}
			if (s & 4 && (($ = o.stateNode), $ != null)) {
				var j = o.memoizedProps,
					_e = a !== null ? a.memoizedProps : j,
					et = o.type,
					tt = o.updateQueue;
				if (((o.updateQueue = null), tt !== null))
					try {
						(et === "input" && j.type === "radio" && j.name != null && ab($, j), vb(et, _e));
						var rt = vb(et, j);
						for (_e = 0; _e < tt.length; _e += 2) {
							var nt = tt[_e],
								it = tt[_e + 1];
							nt === "style"
								? sb($, it)
								: nt === "dangerouslySetInnerHTML"
									? nb($, it)
									: nt === "children"
										? ob($, it)
										: ta($, nt, it, rt);
						}
						switch (et) {
							case "input":
								bb($, j);
								break;
							case "textarea":
								ib($, j);
								break;
							case "select":
								var ot = $._wrapperState.wasMultiple;
								$._wrapperState.wasMultiple = !!j.multiple;
								var st = j.value;
								st != null
									? fb($, !!j.multiple, st, !1)
									: ot !== !!j.multiple &&
										(j.defaultValue != null
											? fb($, !!j.multiple, j.defaultValue, !0)
											: fb($, !!j.multiple, j.multiple ? [] : "", !1));
						}
						$[Pf] = j;
					} catch (dt) {
						W(o, o.return, dt);
					}
			}
			break;
		case 6:
			if ((dk(i, o), fk(o), s & 4)) {
				if (o.stateNode === null) throw Error(p$1(162));
				(($ = o.stateNode), (j = o.memoizedProps));
				try {
					$.nodeValue = j;
				} catch (dt) {
					W(o, o.return, dt);
				}
			}
			break;
		case 3:
			if ((dk(i, o), fk(o), s & 4 && a !== null && a.memoizedState.isDehydrated))
				try {
					bd(i.containerInfo);
				} catch (dt) {
					W(o, o.return, dt);
				}
			break;
		case 4:
			(dk(i, o), fk(o));
			break;
		case 13:
			(dk(i, o),
				fk(o),
				($ = o.child),
				$.flags & 8192 &&
					((j = $.memoizedState !== null),
					($.stateNode.isHidden = j),
					!j || ($.alternate !== null && $.alternate.memoizedState !== null) || (gk = B())),
				s & 4 && bk(o));
			break;
		case 22:
			if (
				((nt = a !== null && a.memoizedState !== null),
				o.mode & 1 ? ((U = (rt = U) || nt), dk(i, o), (U = rt)) : dk(i, o),
				fk(o),
				s & 8192)
			) {
				if (((rt = o.memoizedState !== null), (o.stateNode.isHidden = rt) && !nt && o.mode & 1))
					for (V = o, nt = o.child; nt !== null; ) {
						for (it = V = nt; V !== null; ) {
							switch (((ot = V), (st = ot.child), ot.tag)) {
								case 0:
								case 11:
								case 14:
								case 15:
									Qj(4, ot, ot.return);
									break;
								case 1:
									Mj(ot, ot.return);
									var lt = ot.stateNode;
									if (typeof lt.componentWillUnmount == "function") {
										((s = ot), (a = ot.return));
										try {
											((i = s),
												(lt.props = i.memoizedProps),
												(lt.state = i.memoizedState),
												lt.componentWillUnmount());
										} catch (dt) {
											W(s, a, dt);
										}
									}
									break;
								case 5:
									Mj(ot, ot.return);
									break;
								case 22:
									if (ot.memoizedState !== null) {
										hk(it);
										continue;
									}
							}
							st !== null ? ((st.return = ot), (V = st)) : hk(it);
						}
						nt = nt.sibling;
					}
				e: for (nt = null, it = o; ; ) {
					if (it.tag === 5) {
						if (nt === null) {
							nt = it;
							try {
								(($ = it.stateNode),
									rt
										? ((j = $.style),
											typeof j.setProperty == "function"
												? j.setProperty("display", "none", "important")
												: (j.display = "none"))
										: ((et = it.stateNode),
											(tt = it.memoizedProps.style),
											(_e = tt != null && tt.hasOwnProperty("display") ? tt.display : null),
											(et.style.display = rb("display", _e))));
							} catch (dt) {
								W(o, o.return, dt);
							}
						}
					} else if (it.tag === 6) {
						if (nt === null)
							try {
								it.stateNode.nodeValue = rt ? "" : it.memoizedProps;
							} catch (dt) {
								W(o, o.return, dt);
							}
					} else if (
						((it.tag !== 22 && it.tag !== 23) || it.memoizedState === null || it === o) &&
						it.child !== null
					) {
						((it.child.return = it), (it = it.child));
						continue;
					}
					if (it === o) break e;
					for (; it.sibling === null; ) {
						if (it.return === null || it.return === o) break e;
						(nt === it && (nt = null), (it = it.return));
					}
					(nt === it && (nt = null), (it.sibling.return = it.return), (it = it.sibling));
				}
			}
			break;
		case 19:
			(dk(i, o), fk(o), s & 4 && bk(o));
			break;
		case 21:
			break;
		default:
			(dk(i, o), fk(o));
	}
}
function fk(o) {
	var i = o.flags;
	if (i & 2) {
		try {
			e: {
				for (var a = o.return; a !== null; ) {
					if (Uj(a)) {
						var s = a;
						break e;
					}
					a = a.return;
				}
				throw Error(p$1(160));
			}
			switch (s.tag) {
				case 5:
					var $ = s.stateNode;
					s.flags & 32 && (ob($, ""), (s.flags &= -33));
					var j = Vj(o);
					Xj(o, j, $);
					break;
				case 3:
				case 4:
					var _e = s.stateNode.containerInfo,
						et = Vj(o);
					Wj(o, et, _e);
					break;
				default:
					throw Error(p$1(161));
			}
		} catch (tt) {
			W(o, o.return, tt);
		}
		o.flags &= -3;
	}
	i & 4096 && (o.flags &= -4097);
}
function ik(o, i, a) {
	((V = o), jk(o));
}
function jk(o, i, a) {
	for (var s = (o.mode & 1) !== 0; V !== null; ) {
		var $ = V,
			j = $.child;
		if ($.tag === 22 && s) {
			var _e = $.memoizedState !== null || Kj;
			if (!_e) {
				var et = $.alternate,
					tt = (et !== null && et.memoizedState !== null) || U;
				et = Kj;
				var rt = U;
				if (((Kj = _e), (U = tt) && !rt))
					for (V = $; V !== null; )
						((_e = V),
							(tt = _e.child),
							_e.tag === 22 && _e.memoizedState !== null
								? kk($)
								: tt !== null
									? ((tt.return = _e), (V = tt))
									: kk($));
				for (; j !== null; ) ((V = j), jk(j), (j = j.sibling));
				((V = $), (Kj = et), (U = rt));
			}
			lk(o);
		} else $.subtreeFlags & 8772 && j !== null ? ((j.return = $), (V = j)) : lk(o);
	}
}
function lk(o) {
	for (; V !== null; ) {
		var i = V;
		if (i.flags & 8772) {
			var a = i.alternate;
			try {
				if (i.flags & 8772)
					switch (i.tag) {
						case 0:
						case 11:
						case 15:
							U || Rj(5, i);
							break;
						case 1:
							var s = i.stateNode;
							if (i.flags & 4 && !U)
								if (a === null) s.componentDidMount();
								else {
									var $ = i.elementType === i.type ? a.memoizedProps : Lg(i.type, a.memoizedProps);
									s.componentDidUpdate($, a.memoizedState, s.__reactInternalSnapshotBeforeUpdate);
								}
							var j = i.updateQueue;
							j !== null && ih(i, j, s);
							break;
						case 3:
							var _e = i.updateQueue;
							if (_e !== null) {
								if (((a = null), i.child !== null))
									switch (i.child.tag) {
										case 5:
											a = i.child.stateNode;
											break;
										case 1:
											a = i.child.stateNode;
									}
								ih(i, _e, a);
							}
							break;
						case 5:
							var et = i.stateNode;
							if (a === null && i.flags & 4) {
								a = et;
								var tt = i.memoizedProps;
								switch (i.type) {
									case "button":
									case "input":
									case "select":
									case "textarea":
										tt.autoFocus && a.focus();
										break;
									case "img":
										tt.src && (a.src = tt.src);
								}
							}
							break;
						case 6:
							break;
						case 4:
							break;
						case 12:
							break;
						case 13:
							if (i.memoizedState === null) {
								var rt = i.alternate;
								if (rt !== null) {
									var nt = rt.memoizedState;
									if (nt !== null) {
										var it = nt.dehydrated;
										it !== null && bd(it);
									}
								}
							}
							break;
						case 19:
						case 17:
						case 21:
						case 22:
						case 23:
						case 25:
							break;
						default:
							throw Error(p$1(163));
					}
				U || (i.flags & 512 && Sj(i));
			} catch (ot) {
				W(i, i.return, ot);
			}
		}
		if (i === o) {
			V = null;
			break;
		}
		if (((a = i.sibling), a !== null)) {
			((a.return = i.return), (V = a));
			break;
		}
		V = i.return;
	}
}
function hk(o) {
	for (; V !== null; ) {
		var i = V;
		if (i === o) {
			V = null;
			break;
		}
		var a = i.sibling;
		if (a !== null) {
			((a.return = i.return), (V = a));
			break;
		}
		V = i.return;
	}
}
function kk(o) {
	for (; V !== null; ) {
		var i = V;
		try {
			switch (i.tag) {
				case 0:
				case 11:
				case 15:
					var a = i.return;
					try {
						Rj(4, i);
					} catch (tt) {
						W(i, a, tt);
					}
					break;
				case 1:
					var s = i.stateNode;
					if (typeof s.componentDidMount == "function") {
						var $ = i.return;
						try {
							s.componentDidMount();
						} catch (tt) {
							W(i, $, tt);
						}
					}
					var j = i.return;
					try {
						Sj(i);
					} catch (tt) {
						W(i, j, tt);
					}
					break;
				case 5:
					var _e = i.return;
					try {
						Sj(i);
					} catch (tt) {
						W(i, _e, tt);
					}
			}
		} catch (tt) {
			W(i, i.return, tt);
		}
		if (i === o) {
			V = null;
			break;
		}
		var et = i.sibling;
		if (et !== null) {
			((et.return = i.return), (V = et));
			break;
		}
		V = i.return;
	}
}
var mk = Math.ceil,
	nk = ua.ReactCurrentDispatcher,
	ok = ua.ReactCurrentOwner,
	pk = ua.ReactCurrentBatchConfig,
	K = 0,
	R = null,
	Y = null,
	Z = 0,
	gj = 0,
	fj = Uf(0),
	T = 0,
	qk = null,
	hh = 0,
	rk = 0,
	sk = 0,
	tk = null,
	uk = null,
	gk = 0,
	Hj = 1 / 0,
	vk = null,
	Pi = !1,
	Qi = null,
	Si = null,
	wk = !1,
	xk = null,
	yk = 0,
	zk = 0,
	Ak = null,
	Bk = -1,
	Ck = 0;
function L() {
	return K & 6 ? B() : Bk !== -1 ? Bk : (Bk = B());
}
function lh(o) {
	return o.mode & 1
		? K & 2 && Z !== 0
			? Z & -Z
			: Kg.transition !== null
				? (Ck === 0 && (Ck = yc()), Ck)
				: ((o = C), o !== 0 || ((o = window.event), (o = o === void 0 ? 16 : jd(o.type))), o)
		: 1;
}
function mh(o, i, a, s) {
	if (50 < zk) throw ((zk = 0), (Ak = null), Error(p$1(185)));
	(Ac(o, a, s),
		(!(K & 2) || o !== R) &&
			(o === R && (!(K & 2) && (rk |= a), T === 4 && Dk(o, Z)),
			Ek(o, s),
			a === 1 && K === 0 && !(i.mode & 1) && ((Hj = B() + 500), fg && jg())));
}
function Ek(o, i) {
	var a = o.callbackNode;
	wc(o, i);
	var s = uc(o, o === R ? Z : 0);
	if (s === 0) (a !== null && bc(a), (o.callbackNode = null), (o.callbackPriority = 0));
	else if (((i = s & -s), o.callbackPriority !== i)) {
		if ((a != null && bc(a), i === 1))
			(o.tag === 0 ? ig(Fk.bind(null, o)) : hg(Fk.bind(null, o)),
				Jf(function () {
					!(K & 6) && jg();
				}),
				(a = null));
		else {
			switch (Dc(s)) {
				case 1:
					a = fc;
					break;
				case 4:
					a = gc;
					break;
				case 16:
					a = hc;
					break;
				case 536870912:
					a = jc;
					break;
				default:
					a = hc;
			}
			a = Gk(a, Hk.bind(null, o));
		}
		((o.callbackPriority = i), (o.callbackNode = a));
	}
}
function Hk(o, i) {
	if (((Bk = -1), (Ck = 0), K & 6)) throw Error(p$1(327));
	var a = o.callbackNode;
	if (Ik() && o.callbackNode !== a) return null;
	var s = uc(o, o === R ? Z : 0);
	if (s === 0) return null;
	if (s & 30 || s & o.expiredLanes || i) i = Jk(o, s);
	else {
		i = s;
		var $ = K;
		K |= 2;
		var j = Kk();
		(R !== o || Z !== i) && ((vk = null), (Hj = B() + 500), Lk(o, i));
		do
			try {
				Mk();
				break;
			} catch (et) {
				Nk(o, et);
			}
		while (1);
		(Qg(), (nk.current = j), (K = $), Y !== null ? (i = 0) : ((R = null), (Z = 0), (i = T)));
	}
	if (i !== 0) {
		if ((i === 2 && (($ = xc(o)), $ !== 0 && ((s = $), (i = Ok(o, $)))), i === 1))
			throw ((a = qk), Lk(o, 0), Dk(o, s), Ek(o, B()), a);
		if (i === 6) Dk(o, s);
		else {
			if (
				(($ = o.current.alternate),
				!(s & 30) &&
					!Pk($) &&
					((i = Jk(o, s)), i === 2 && ((j = xc(o)), j !== 0 && ((s = j), (i = Ok(o, j)))), i === 1))
			)
				throw ((a = qk), Lk(o, 0), Dk(o, s), Ek(o, B()), a);
			switch (((o.finishedWork = $), (o.finishedLanes = s), i)) {
				case 0:
				case 1:
					throw Error(p$1(345));
				case 2:
					Qk(o, uk, vk);
					break;
				case 3:
					if ((Dk(o, s), (s & 130023424) === s && ((i = gk + 500 - B()), 10 < i))) {
						if (uc(o, 0) !== 0) break;
						if ((($ = o.suspendedLanes), ($ & s) !== s)) {
							(L(), (o.pingedLanes |= o.suspendedLanes & $));
							break;
						}
						o.timeoutHandle = Ff(Qk.bind(null, o, uk, vk), i);
						break;
					}
					Qk(o, uk, vk);
					break;
				case 4:
					if ((Dk(o, s), (s & 4194240) === s)) break;
					for (i = o.eventTimes, $ = -1; 0 < s; ) {
						var _e = 31 - oc(s);
						((j = 1 << _e), (_e = i[_e]), _e > $ && ($ = _e), (s &= ~j));
					}
					if (
						((s = $),
						(s = B() - s),
						(s =
							(120 > s
								? 120
								: 480 > s
									? 480
									: 1080 > s
										? 1080
										: 1920 > s
											? 1920
											: 3e3 > s
												? 3e3
												: 4320 > s
													? 4320
													: 1960 * mk(s / 1960)) - s),
						10 < s)
					) {
						o.timeoutHandle = Ff(Qk.bind(null, o, uk, vk), s);
						break;
					}
					Qk(o, uk, vk);
					break;
				case 5:
					Qk(o, uk, vk);
					break;
				default:
					throw Error(p$1(329));
			}
		}
	}
	return (Ek(o, B()), o.callbackNode === a ? Hk.bind(null, o) : null);
}
function Ok(o, i) {
	var a = tk;
	return (
		o.current.memoizedState.isDehydrated && (Lk(o, i).flags |= 256),
		(o = Jk(o, i)),
		o !== 2 && ((i = uk), (uk = a), i !== null && Gj(i)),
		o
	);
}
function Gj(o) {
	uk === null ? (uk = o) : uk.push.apply(uk, o);
}
function Pk(o) {
	for (var i = o; ; ) {
		if (i.flags & 16384) {
			var a = i.updateQueue;
			if (a !== null && ((a = a.stores), a !== null))
				for (var s = 0; s < a.length; s++) {
					var $ = a[s],
						j = $.getSnapshot;
					$ = $.value;
					try {
						if (!He(j(), $)) return !1;
					} catch {
						return !1;
					}
				}
		}
		if (((a = i.child), i.subtreeFlags & 16384 && a !== null)) ((a.return = i), (i = a));
		else {
			if (i === o) break;
			for (; i.sibling === null; ) {
				if (i.return === null || i.return === o) return !0;
				i = i.return;
			}
			((i.sibling.return = i.return), (i = i.sibling));
		}
	}
	return !0;
}
function Dk(o, i) {
	for (
		i &= ~sk, i &= ~rk, o.suspendedLanes |= i, o.pingedLanes &= ~i, o = o.expirationTimes;
		0 < i;
	) {
		var a = 31 - oc(i),
			s = 1 << a;
		((o[a] = -1), (i &= ~s));
	}
}
function Fk(o) {
	if (K & 6) throw Error(p$1(327));
	Ik();
	var i = uc(o, 0);
	if (!(i & 1)) return (Ek(o, B()), null);
	var a = Jk(o, i);
	if (o.tag !== 0 && a === 2) {
		var s = xc(o);
		s !== 0 && ((i = s), (a = Ok(o, s)));
	}
	if (a === 1) throw ((a = qk), Lk(o, 0), Dk(o, i), Ek(o, B()), a);
	if (a === 6) throw Error(p$1(345));
	return (
		(o.finishedWork = o.current.alternate), (o.finishedLanes = i), Qk(o, uk, vk), Ek(o, B()), null
	);
}
function Rk(o, i) {
	var a = K;
	K |= 1;
	try {
		return o(i);
	} finally {
		((K = a), K === 0 && ((Hj = B() + 500), fg && jg()));
	}
}
function Sk(o) {
	xk !== null && xk.tag === 0 && !(K & 6) && Ik();
	var i = K;
	K |= 1;
	var a = pk.transition,
		s = C;
	try {
		if (((pk.transition = null), (C = 1), o)) return o();
	} finally {
		((C = s), (pk.transition = a), (K = i), !(K & 6) && jg());
	}
}
function Ij() {
	((gj = fj.current), E(fj));
}
function Lk(o, i) {
	((o.finishedWork = null), (o.finishedLanes = 0));
	var a = o.timeoutHandle;
	if ((a !== -1 && ((o.timeoutHandle = -1), Gf(a)), Y !== null))
		for (a = Y.return; a !== null; ) {
			var s = a;
			switch ((wg(s), s.tag)) {
				case 1:
					((s = s.type.childContextTypes), s != null && $f());
					break;
				case 3:
					(Jh(), E(Wf), E(H), Oh());
					break;
				case 5:
					Lh(s);
					break;
				case 4:
					Jh();
					break;
				case 13:
					E(M);
					break;
				case 19:
					E(M);
					break;
				case 10:
					Rg(s.type._context);
					break;
				case 22:
				case 23:
					Ij();
			}
			a = a.return;
		}
	if (
		((R = o),
		(Y = o = wh(o.current, null)),
		(Z = gj = i),
		(T = 0),
		(qk = null),
		(sk = rk = hh = 0),
		(uk = tk = null),
		Wg !== null)
	) {
		for (i = 0; i < Wg.length; i++)
			if (((a = Wg[i]), (s = a.interleaved), s !== null)) {
				a.interleaved = null;
				var $ = s.next,
					j = a.pending;
				if (j !== null) {
					var _e = j.next;
					((j.next = $), (s.next = _e));
				}
				a.pending = s;
			}
		Wg = null;
	}
	return o;
}
function Nk(o, i) {
	do {
		var a = Y;
		try {
			if ((Qg(), (Ph.current = ai), Sh)) {
				for (var s = N.memoizedState; s !== null; ) {
					var $ = s.queue;
					($ !== null && ($.pending = null), (s = s.next));
				}
				Sh = !1;
			}
			if (
				((Rh = 0),
				(P = O = N = null),
				(Th = !1),
				(Uh = 0),
				(ok.current = null),
				a === null || a.return === null)
			) {
				((T = 1), (qk = i), (Y = null));
				break;
			}
			e: {
				var j = o,
					_e = a.return,
					et = a,
					tt = i;
				if (
					((i = Z),
					(et.flags |= 32768),
					tt !== null && typeof tt == "object" && typeof tt.then == "function")
				) {
					var rt = tt,
						nt = et,
						it = nt.tag;
					if (!(nt.mode & 1) && (it === 0 || it === 11 || it === 15)) {
						var ot = nt.alternate;
						ot
							? ((nt.updateQueue = ot.updateQueue),
								(nt.memoizedState = ot.memoizedState),
								(nt.lanes = ot.lanes))
							: ((nt.updateQueue = null), (nt.memoizedState = null));
					}
					var st = Vi(_e);
					if (st !== null) {
						((st.flags &= -257),
							Wi(st, _e, et, j, i),
							st.mode & 1 && Ti(j, rt, i),
							(i = st),
							(tt = rt));
						var lt = i.updateQueue;
						if (lt === null) {
							var dt = new Set();
							(dt.add(tt), (i.updateQueue = dt));
						} else lt.add(tt);
						break e;
					} else {
						if (!(i & 1)) {
							(Ti(j, rt, i), uj());
							break e;
						}
						tt = Error(p$1(426));
					}
				} else if (I && et.mode & 1) {
					var pt = Vi(_e);
					if (pt !== null) {
						(!(pt.flags & 65536) && (pt.flags |= 256), Wi(pt, _e, et, j, i), Jg(Ki(tt, et)));
						break e;
					}
				}
				((j = tt = Ki(tt, et)),
					T !== 4 && (T = 2),
					tk === null ? (tk = [j]) : tk.push(j),
					(j = _e));
				do {
					switch (j.tag) {
						case 3:
							((j.flags |= 65536), (i &= -i), (j.lanes |= i));
							var ct = Oi(j, tt, i);
							fh(j, ct);
							break e;
						case 1:
							et = tt;
							var at = j.type,
								ft = j.stateNode;
							if (
								!(j.flags & 128) &&
								(typeof at.getDerivedStateFromError == "function" ||
									(ft !== null &&
										typeof ft.componentDidCatch == "function" &&
										(Si === null || !Si.has(ft))))
							) {
								((j.flags |= 65536), (i &= -i), (j.lanes |= i));
								var ut = Ri(j, et, i);
								fh(j, ut);
								break e;
							}
					}
					j = j.return;
				} while (j !== null);
			}
			Tk(a);
		} catch (ht) {
			((i = ht), Y === a && a !== null && (Y = a = a.return));
			continue;
		}
		break;
	} while (1);
}
function Kk() {
	var o = nk.current;
	return ((nk.current = ai), o === null ? ai : o);
}
function uj() {
	((T === 0 || T === 3 || T === 2) && (T = 4),
		R === null || (!(hh & 268435455) && !(rk & 268435455)) || Dk(R, Z));
}
function Jk(o, i) {
	var a = K;
	K |= 2;
	var s = Kk();
	(R !== o || Z !== i) && ((vk = null), Lk(o, i));
	do
		try {
			Uk();
			break;
		} catch ($) {
			Nk(o, $);
		}
	while (1);
	if ((Qg(), (K = a), (nk.current = s), Y !== null)) throw Error(p$1(261));
	return ((R = null), (Z = 0), T);
}
function Uk() {
	for (; Y !== null; ) Vk(Y);
}
function Mk() {
	for (; Y !== null && !cc(); ) Vk(Y);
}
function Vk(o) {
	var i = Wk(o.alternate, o, gj);
	((o.memoizedProps = o.pendingProps), i === null ? Tk(o) : (Y = i), (ok.current = null));
}
function Tk(o) {
	var i = o;
	do {
		var a = i.alternate;
		if (((o = i.return), i.flags & 32768)) {
			if (((a = Jj(a, i)), a !== null)) {
				((a.flags &= 32767), (Y = a));
				return;
			}
			if (o !== null) ((o.flags |= 32768), (o.subtreeFlags = 0), (o.deletions = null));
			else {
				((T = 6), (Y = null));
				return;
			}
		} else if (((a = Fj(a, i, gj)), a !== null)) {
			Y = a;
			return;
		}
		if (((i = i.sibling), i !== null)) {
			Y = i;
			return;
		}
		Y = i = o;
	} while (i !== null);
	T === 0 && (T = 5);
}
function Qk(o, i, a) {
	var s = C,
		$ = pk.transition;
	try {
		((pk.transition = null), (C = 1), Xk(o, i, a, s));
	} finally {
		((pk.transition = $), (C = s));
	}
	return null;
}
function Xk(o, i, a, s) {
	do Ik();
	while (xk !== null);
	if (K & 6) throw Error(p$1(327));
	a = o.finishedWork;
	var $ = o.finishedLanes;
	if (a === null) return null;
	if (((o.finishedWork = null), (o.finishedLanes = 0), a === o.current)) throw Error(p$1(177));
	((o.callbackNode = null), (o.callbackPriority = 0));
	var j = a.lanes | a.childLanes;
	if (
		(Bc(o, j),
		o === R && ((Y = R = null), (Z = 0)),
		(!(a.subtreeFlags & 2064) && !(a.flags & 2064)) ||
			wk ||
			((wk = !0),
			Gk(hc, function () {
				return (Ik(), null);
			})),
		(j = (a.flags & 15990) !== 0),
		a.subtreeFlags & 15990 || j)
	) {
		((j = pk.transition), (pk.transition = null));
		var _e = C;
		C = 1;
		var et = K;
		((K |= 4),
			(ok.current = null),
			Pj(o, a),
			ek(a, o),
			Oe(Df),
			(dd = !!Cf),
			(Df = Cf = null),
			(o.current = a),
			ik(a),
			dc(),
			(K = et),
			(C = _e),
			(pk.transition = j));
	} else o.current = a;
	if (
		(wk && ((wk = !1), (xk = o), (yk = $)),
		(j = o.pendingLanes),
		j === 0 && (Si = null),
		mc(a.stateNode),
		Ek(o, B()),
		i !== null)
	)
		for (s = o.onRecoverableError, a = 0; a < i.length; a++)
			(($ = i[a]), s($.value, { componentStack: $.stack, digest: $.digest }));
	if (Pi) throw ((Pi = !1), (o = Qi), (Qi = null), o);
	return (
		yk & 1 && o.tag !== 0 && Ik(),
		(j = o.pendingLanes),
		j & 1 ? (o === Ak ? zk++ : ((zk = 0), (Ak = o))) : (zk = 0),
		jg(),
		null
	);
}
function Ik() {
	if (xk !== null) {
		var o = Dc(yk),
			i = pk.transition,
			a = C;
		try {
			if (((pk.transition = null), (C = 16 > o ? 16 : o), xk === null)) var s = !1;
			else {
				if (((o = xk), (xk = null), (yk = 0), K & 6)) throw Error(p$1(331));
				var $ = K;
				for (K |= 4, V = o.current; V !== null; ) {
					var j = V,
						_e = j.child;
					if (V.flags & 16) {
						var et = j.deletions;
						if (et !== null) {
							for (var tt = 0; tt < et.length; tt++) {
								var rt = et[tt];
								for (V = rt; V !== null; ) {
									var nt = V;
									switch (nt.tag) {
										case 0:
										case 11:
										case 15:
											Qj(8, nt, j);
									}
									var it = nt.child;
									if (it !== null) ((it.return = nt), (V = it));
									else
										for (; V !== null; ) {
											nt = V;
											var ot = nt.sibling,
												st = nt.return;
											if ((Tj(nt), nt === rt)) {
												V = null;
												break;
											}
											if (ot !== null) {
												((ot.return = st), (V = ot));
												break;
											}
											V = st;
										}
								}
							}
							var lt = j.alternate;
							if (lt !== null) {
								var dt = lt.child;
								if (dt !== null) {
									lt.child = null;
									do {
										var pt = dt.sibling;
										((dt.sibling = null), (dt = pt));
									} while (dt !== null);
								}
							}
							V = j;
						}
					}
					if (j.subtreeFlags & 2064 && _e !== null) ((_e.return = j), (V = _e));
					else
						e: for (; V !== null; ) {
							if (((j = V), j.flags & 2048))
								switch (j.tag) {
									case 0:
									case 11:
									case 15:
										Qj(9, j, j.return);
								}
							var ct = j.sibling;
							if (ct !== null) {
								((ct.return = j.return), (V = ct));
								break e;
							}
							V = j.return;
						}
				}
				var at = o.current;
				for (V = at; V !== null; ) {
					_e = V;
					var ft = _e.child;
					if (_e.subtreeFlags & 2064 && ft !== null) ((ft.return = _e), (V = ft));
					else
						e: for (_e = at; V !== null; ) {
							if (((et = V), et.flags & 2048))
								try {
									switch (et.tag) {
										case 0:
										case 11:
										case 15:
											Rj(9, et);
									}
								} catch (ht) {
									W(et, et.return, ht);
								}
							if (et === _e) {
								V = null;
								break e;
							}
							var ut = et.sibling;
							if (ut !== null) {
								((ut.return = et.return), (V = ut));
								break e;
							}
							V = et.return;
						}
				}
				if (((K = $), jg(), lc && typeof lc.onPostCommitFiberRoot == "function"))
					try {
						lc.onPostCommitFiberRoot(kc, o);
					} catch {}
				s = !0;
			}
			return s;
		} finally {
			((C = a), (pk.transition = i));
		}
	}
	return !1;
}
function Yk(o, i, a) {
	((i = Ki(a, i)),
		(i = Oi(o, i, 1)),
		(o = dh(o, i, 1)),
		(i = L()),
		o !== null && (Ac(o, 1, i), Ek(o, i)));
}
function W(o, i, a) {
	if (o.tag === 3) Yk(o, o, a);
	else
		for (; i !== null; ) {
			if (i.tag === 3) {
				Yk(i, o, a);
				break;
			} else if (i.tag === 1) {
				var s = i.stateNode;
				if (
					typeof i.type.getDerivedStateFromError == "function" ||
					(typeof s.componentDidCatch == "function" && (Si === null || !Si.has(s)))
				) {
					((o = Ki(a, o)),
						(o = Ri(i, o, 1)),
						(i = dh(i, o, 1)),
						(o = L()),
						i !== null && (Ac(i, 1, o), Ek(i, o)));
					break;
				}
			}
			i = i.return;
		}
}
function Ui(o, i, a) {
	var s = o.pingCache;
	(s !== null && s.delete(i),
		(i = L()),
		(o.pingedLanes |= o.suspendedLanes & a),
		R === o &&
			(Z & a) === a &&
			(T === 4 || (T === 3 && (Z & 130023424) === Z && 500 > B() - gk) ? Lk(o, 0) : (sk |= a)),
		Ek(o, i));
}
function Zk(o, i) {
	i === 0 && (o.mode & 1 ? ((i = sc), (sc <<= 1), !(sc & 130023424) && (sc = 4194304)) : (i = 1));
	var a = L();
	((o = Zg(o, i)), o !== null && (Ac(o, i, a), Ek(o, a)));
}
function vj(o) {
	var i = o.memoizedState,
		a = 0;
	(i !== null && (a = i.retryLane), Zk(o, a));
}
function ck(o, i) {
	var a = 0;
	switch (o.tag) {
		case 13:
			var s = o.stateNode,
				$ = o.memoizedState;
			$ !== null && (a = $.retryLane);
			break;
		case 19:
			s = o.stateNode;
			break;
		default:
			throw Error(p$1(314));
	}
	(s !== null && s.delete(i), Zk(o, a));
}
var Wk;
Wk = function (o, i, a) {
	if (o !== null)
		if (o.memoizedProps !== i.pendingProps || Wf.current) Ug = !0;
		else {
			if (!(o.lanes & a) && !(i.flags & 128)) return ((Ug = !1), zj(o, i, a));
			Ug = !!(o.flags & 131072);
		}
	else ((Ug = !1), I && i.flags & 1048576 && ug(i, ng, i.index));
	switch (((i.lanes = 0), i.tag)) {
		case 2:
			var s = i.type;
			(jj(o, i), (o = i.pendingProps));
			var $ = Yf(i, H.current);
			(Tg(i, a), ($ = Xh(null, i, s, o, $, a)));
			var j = bi();
			return (
				(i.flags |= 1),
				typeof $ == "object" && $ !== null && typeof $.render == "function" && $.$$typeof === void 0
					? ((i.tag = 1),
						(i.memoizedState = null),
						(i.updateQueue = null),
						Zf(s) ? ((j = !0), cg(i)) : (j = !1),
						(i.memoizedState = $.state !== null && $.state !== void 0 ? $.state : null),
						ah(i),
						($.updater = nh),
						(i.stateNode = $),
						($._reactInternals = i),
						rh(i, s, o, a),
						(i = kj(null, i, s, !0, j, a)))
					: ((i.tag = 0), I && j && vg(i), Yi(null, i, $, a), (i = i.child)),
				i
			);
		case 16:
			s = i.elementType;
			e: {
				switch (
					(jj(o, i),
					(o = i.pendingProps),
					($ = s._init),
					(s = $(s._payload)),
					(i.type = s),
					($ = i.tag = $k(s)),
					(o = Lg(s, o)),
					$)
				) {
					case 0:
						i = dj(null, i, s, o, a);
						break e;
					case 1:
						i = ij(null, i, s, o, a);
						break e;
					case 11:
						i = Zi(null, i, s, o, a);
						break e;
					case 14:
						i = aj(null, i, s, Lg(s.type, o), a);
						break e;
				}
				throw Error(p$1(306, s, ""));
			}
			return i;
		case 0:
			return (
				(s = i.type),
				($ = i.pendingProps),
				($ = i.elementType === s ? $ : Lg(s, $)),
				dj(o, i, s, $, a)
			);
		case 1:
			return (
				(s = i.type),
				($ = i.pendingProps),
				($ = i.elementType === s ? $ : Lg(s, $)),
				ij(o, i, s, $, a)
			);
		case 3:
			e: {
				if ((lj(i), o === null)) throw Error(p$1(387));
				((s = i.pendingProps), (j = i.memoizedState), ($ = j.element), bh(o, i), gh(i, s, null, a));
				var _e = i.memoizedState;
				if (((s = _e.element), j.isDehydrated))
					if (
						((j = {
							element: s,
							isDehydrated: !1,
							cache: _e.cache,
							pendingSuspenseBoundaries: _e.pendingSuspenseBoundaries,
							transitions: _e.transitions,
						}),
						(i.updateQueue.baseState = j),
						(i.memoizedState = j),
						i.flags & 256)
					) {
						(($ = Ki(Error(p$1(423)), i)), (i = mj(o, i, s, a, $)));
						break e;
					} else if (s !== $) {
						(($ = Ki(Error(p$1(424)), i)), (i = mj(o, i, s, a, $)));
						break e;
					} else
						for (
							yg = Lf(i.stateNode.containerInfo.firstChild),
								xg = i,
								I = !0,
								zg = null,
								a = Ch(i, null, s, a),
								i.child = a;
							a;
						)
							((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
				else {
					if ((Ig(), s === $)) {
						i = $i(o, i, a);
						break e;
					}
					Yi(o, i, s, a);
				}
				i = i.child;
			}
			return i;
		case 5:
			return (
				Kh(i),
				o === null && Eg(i),
				(s = i.type),
				($ = i.pendingProps),
				(j = o !== null ? o.memoizedProps : null),
				(_e = $.children),
				Ef(s, $) ? (_e = null) : j !== null && Ef(s, j) && (i.flags |= 32),
				hj(o, i),
				Yi(o, i, _e, a),
				i.child
			);
		case 6:
			return (o === null && Eg(i), null);
		case 13:
			return pj(o, i, a);
		case 4:
			return (
				Ih(i, i.stateNode.containerInfo),
				(s = i.pendingProps),
				o === null ? (i.child = Bh(i, null, s, a)) : Yi(o, i, s, a),
				i.child
			);
		case 11:
			return (
				(s = i.type),
				($ = i.pendingProps),
				($ = i.elementType === s ? $ : Lg(s, $)),
				Zi(o, i, s, $, a)
			);
		case 7:
			return (Yi(o, i, i.pendingProps, a), i.child);
		case 8:
			return (Yi(o, i, i.pendingProps.children, a), i.child);
		case 12:
			return (Yi(o, i, i.pendingProps.children, a), i.child);
		case 10:
			e: {
				if (
					((s = i.type._context),
					($ = i.pendingProps),
					(j = i.memoizedProps),
					(_e = $.value),
					G(Mg, s._currentValue),
					(s._currentValue = _e),
					j !== null)
				)
					if (He(j.value, _e)) {
						if (j.children === $.children && !Wf.current) {
							i = $i(o, i, a);
							break e;
						}
					} else
						for (j = i.child, j !== null && (j.return = i); j !== null; ) {
							var et = j.dependencies;
							if (et !== null) {
								_e = j.child;
								for (var tt = et.firstContext; tt !== null; ) {
									if (tt.context === s) {
										if (j.tag === 1) {
											((tt = ch(-1, a & -a)), (tt.tag = 2));
											var rt = j.updateQueue;
											if (rt !== null) {
												rt = rt.shared;
												var nt = rt.pending;
												(nt === null ? (tt.next = tt) : ((tt.next = nt.next), (nt.next = tt)),
													(rt.pending = tt));
											}
										}
										((j.lanes |= a),
											(tt = j.alternate),
											tt !== null && (tt.lanes |= a),
											Sg(j.return, a, i),
											(et.lanes |= a));
										break;
									}
									tt = tt.next;
								}
							} else if (j.tag === 10) _e = j.type === i.type ? null : j.child;
							else if (j.tag === 18) {
								if (((_e = j.return), _e === null)) throw Error(p$1(341));
								((_e.lanes |= a),
									(et = _e.alternate),
									et !== null && (et.lanes |= a),
									Sg(_e, a, i),
									(_e = j.sibling));
							} else _e = j.child;
							if (_e !== null) _e.return = j;
							else
								for (_e = j; _e !== null; ) {
									if (_e === i) {
										_e = null;
										break;
									}
									if (((j = _e.sibling), j !== null)) {
										((j.return = _e.return), (_e = j));
										break;
									}
									_e = _e.return;
								}
							j = _e;
						}
				(Yi(o, i, $.children, a), (i = i.child));
			}
			return i;
		case 9:
			return (
				($ = i.type),
				(s = i.pendingProps.children),
				Tg(i, a),
				($ = Vg($)),
				(s = s($)),
				(i.flags |= 1),
				Yi(o, i, s, a),
				i.child
			);
		case 14:
			return ((s = i.type), ($ = Lg(s, i.pendingProps)), ($ = Lg(s.type, $)), aj(o, i, s, $, a));
		case 15:
			return cj(o, i, i.type, i.pendingProps, a);
		case 17:
			return (
				(s = i.type),
				($ = i.pendingProps),
				($ = i.elementType === s ? $ : Lg(s, $)),
				jj(o, i),
				(i.tag = 1),
				Zf(s) ? ((o = !0), cg(i)) : (o = !1),
				Tg(i, a),
				ph(i, s, $),
				rh(i, s, $, a),
				kj(null, i, s, !0, o, a)
			);
		case 19:
			return yj(o, i, a);
		case 22:
			return ej(o, i, a);
	}
	throw Error(p$1(156, i.tag));
};
function Gk(o, i) {
	return ac(o, i);
}
function al(o, i, a, s) {
	((this.tag = o),
		(this.key = a),
		(this.sibling =
			this.child =
			this.return =
			this.stateNode =
			this.type =
			this.elementType =
				null),
		(this.index = 0),
		(this.ref = null),
		(this.pendingProps = i),
		(this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
		(this.mode = s),
		(this.subtreeFlags = this.flags = 0),
		(this.deletions = null),
		(this.childLanes = this.lanes = 0),
		(this.alternate = null));
}
function Bg(o, i, a, s) {
	return new al(o, i, a, s);
}
function bj(o) {
	return ((o = o.prototype), !(!o || !o.isReactComponent));
}
function $k(o) {
	if (typeof o == "function") return bj(o) ? 1 : 0;
	if (o != null) {
		if (((o = o.$$typeof), o === Da)) return 11;
		if (o === Ga) return 14;
	}
	return 2;
}
function wh(o, i) {
	var a = o.alternate;
	return (
		a === null
			? ((a = Bg(o.tag, i, o.key, o.mode)),
				(a.elementType = o.elementType),
				(a.type = o.type),
				(a.stateNode = o.stateNode),
				(a.alternate = o),
				(o.alternate = a))
			: ((a.pendingProps = i),
				(a.type = o.type),
				(a.flags = 0),
				(a.subtreeFlags = 0),
				(a.deletions = null)),
		(a.flags = o.flags & 14680064),
		(a.childLanes = o.childLanes),
		(a.lanes = o.lanes),
		(a.child = o.child),
		(a.memoizedProps = o.memoizedProps),
		(a.memoizedState = o.memoizedState),
		(a.updateQueue = o.updateQueue),
		(i = o.dependencies),
		(a.dependencies = i === null ? null : { lanes: i.lanes, firstContext: i.firstContext }),
		(a.sibling = o.sibling),
		(a.index = o.index),
		(a.ref = o.ref),
		a
	);
}
function yh(o, i, a, s, $, j) {
	var _e = 2;
	if (((s = o), typeof o == "function")) bj(o) && (_e = 1);
	else if (typeof o == "string") _e = 5;
	else
		e: switch (o) {
			case ya:
				return Ah(a.children, $, j, i);
			case za:
				((_e = 8), ($ |= 8));
				break;
			case Aa:
				return ((o = Bg(12, a, i, $ | 2)), (o.elementType = Aa), (o.lanes = j), o);
			case Ea:
				return ((o = Bg(13, a, i, $)), (o.elementType = Ea), (o.lanes = j), o);
			case Fa:
				return ((o = Bg(19, a, i, $)), (o.elementType = Fa), (o.lanes = j), o);
			case Ia:
				return qj(a, $, j, i);
			default:
				if (typeof o == "object" && o !== null)
					switch (o.$$typeof) {
						case Ba:
							_e = 10;
							break e;
						case Ca:
							_e = 9;
							break e;
						case Da:
							_e = 11;
							break e;
						case Ga:
							_e = 14;
							break e;
						case Ha:
							((_e = 16), (s = null));
							break e;
					}
				throw Error(p$1(130, o == null ? o : typeof o, ""));
		}
	return ((i = Bg(_e, a, i, $)), (i.elementType = o), (i.type = s), (i.lanes = j), i);
}
function Ah(o, i, a, s) {
	return ((o = Bg(7, o, s, i)), (o.lanes = a), o);
}
function qj(o, i, a, s) {
	return (
		(o = Bg(22, o, s, i)), (o.elementType = Ia), (o.lanes = a), (o.stateNode = { isHidden: !1 }), o
	);
}
function xh(o, i, a) {
	return ((o = Bg(6, o, null, i)), (o.lanes = a), o);
}
function zh(o, i, a) {
	return (
		(i = Bg(4, o.children !== null ? o.children : [], o.key, i)),
		(i.lanes = a),
		(i.stateNode = {
			containerInfo: o.containerInfo,
			pendingChildren: null,
			implementation: o.implementation,
		}),
		i
	);
}
function bl(o, i, a, s, $) {
	((this.tag = i),
		(this.containerInfo = o),
		(this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
		(this.timeoutHandle = -1),
		(this.callbackNode = this.pendingContext = this.context = null),
		(this.callbackPriority = 0),
		(this.eventTimes = zc(0)),
		(this.expirationTimes = zc(-1)),
		(this.entangledLanes =
			this.finishedLanes =
			this.mutableReadLanes =
			this.expiredLanes =
			this.pingedLanes =
			this.suspendedLanes =
			this.pendingLanes =
				0),
		(this.entanglements = zc(0)),
		(this.identifierPrefix = s),
		(this.onRecoverableError = $),
		(this.mutableSourceEagerHydrationData = null));
}
function cl(o, i, a, s, $, j, _e, et, tt) {
	return (
		(o = new bl(o, i, a, et, tt)),
		i === 1 ? ((i = 1), j === !0 && (i |= 8)) : (i = 0),
		(j = Bg(3, null, null, i)),
		(o.current = j),
		(j.stateNode = o),
		(j.memoizedState = {
			element: s,
			isDehydrated: a,
			cache: null,
			transitions: null,
			pendingSuspenseBoundaries: null,
		}),
		ah(j),
		o
	);
}
function dl(o, i, a) {
	var s = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
	return {
		$$typeof: wa,
		key: s == null ? null : "" + s,
		children: o,
		containerInfo: i,
		implementation: a,
	};
}
function el(o) {
	if (!o) return Vf;
	o = o._reactInternals;
	e: {
		if (Vb(o) !== o || o.tag !== 1) throw Error(p$1(170));
		var i = o;
		do {
			switch (i.tag) {
				case 3:
					i = i.stateNode.context;
					break e;
				case 1:
					if (Zf(i.type)) {
						i = i.stateNode.__reactInternalMemoizedMergedChildContext;
						break e;
					}
			}
			i = i.return;
		} while (i !== null);
		throw Error(p$1(171));
	}
	if (o.tag === 1) {
		var a = o.type;
		if (Zf(a)) return bg(o, a, i);
	}
	return i;
}
function fl(o, i, a, s, $, j, _e, et, tt) {
	return (
		(o = cl(a, s, !0, o, $, j, _e, et, tt)),
		(o.context = el(null)),
		(a = o.current),
		(s = L()),
		($ = lh(a)),
		(j = ch(s, $)),
		(j.callback = i ?? null),
		dh(a, j, $),
		(o.current.lanes = $),
		Ac(o, $, s),
		Ek(o, s),
		o
	);
}
function gl(o, i, a, s) {
	var $ = i.current,
		j = L(),
		_e = lh($);
	return (
		(a = el(a)),
		i.context === null ? (i.context = a) : (i.pendingContext = a),
		(i = ch(j, _e)),
		(i.payload = { element: o }),
		(s = s === void 0 ? null : s),
		s !== null && (i.callback = s),
		(o = dh($, i, _e)),
		o !== null && (mh(o, $, _e, j), eh(o, $, _e)),
		_e
	);
}
function hl(o) {
	if (((o = o.current), !o.child)) return null;
	switch (o.child.tag) {
		case 5:
			return o.child.stateNode;
		default:
			return o.child.stateNode;
	}
}
function il(o, i) {
	if (((o = o.memoizedState), o !== null && o.dehydrated !== null)) {
		var a = o.retryLane;
		o.retryLane = a !== 0 && a < i ? a : i;
	}
}
function jl(o, i) {
	(il(o, i), (o = o.alternate) && il(o, i));
}
function kl() {
	return null;
}
var ll =
	typeof reportError == "function"
		? reportError
		: function (o) {
				console.error(o);
			};
function ml(o) {
	this._internalRoot = o;
}
nl.prototype.render = ml.prototype.render = function (o) {
	var i = this._internalRoot;
	if (i === null) throw Error(p$1(409));
	gl(o, i, null, null);
};
nl.prototype.unmount = ml.prototype.unmount = function () {
	var o = this._internalRoot;
	if (o !== null) {
		this._internalRoot = null;
		var i = o.containerInfo;
		(Sk(function () {
			gl(null, o, null, null);
		}),
			(i[uf] = null));
	}
};
function nl(o) {
	this._internalRoot = o;
}
nl.prototype.unstable_scheduleHydration = function (o) {
	if (o) {
		var i = Hc();
		o = { blockedOn: null, target: o, priority: i };
		for (var a = 0; a < Qc.length && i !== 0 && i < Qc[a].priority; a++);
		(Qc.splice(a, 0, o), a === 0 && Vc(o));
	}
};
function ol(o) {
	return !(!o || (o.nodeType !== 1 && o.nodeType !== 9 && o.nodeType !== 11));
}
function pl(o) {
	return !(
		!o ||
		(o.nodeType !== 1 &&
			o.nodeType !== 9 &&
			o.nodeType !== 11 &&
			(o.nodeType !== 8 || o.nodeValue !== " react-mount-point-unstable "))
	);
}
function ql() {}
function rl(o, i, a, s, $) {
	if ($) {
		if (typeof s == "function") {
			var j = s;
			s = function () {
				var rt = hl(_e);
				j.call(rt);
			};
		}
		var _e = fl(i, s, o, 0, null, !1, !1, "", ql);
		return (
			(o._reactRootContainer = _e),
			(o[uf] = _e.current),
			sf(o.nodeType === 8 ? o.parentNode : o),
			Sk(),
			_e
		);
	}
	for (; ($ = o.lastChild); ) o.removeChild($);
	if (typeof s == "function") {
		var et = s;
		s = function () {
			var rt = hl(tt);
			et.call(rt);
		};
	}
	var tt = cl(o, 0, !1, null, null, !1, !1, "", ql);
	return (
		(o._reactRootContainer = tt),
		(o[uf] = tt.current),
		sf(o.nodeType === 8 ? o.parentNode : o),
		Sk(function () {
			gl(i, tt, a, s);
		}),
		tt
	);
}
function sl(o, i, a, s, $) {
	var j = a._reactRootContainer;
	if (j) {
		var _e = j;
		if (typeof $ == "function") {
			var et = $;
			$ = function () {
				var tt = hl(_e);
				et.call(tt);
			};
		}
		gl(i, _e, o, $);
	} else _e = rl(a, i, o, $, s);
	return hl(_e);
}
Ec = function (o) {
	switch (o.tag) {
		case 3:
			var i = o.stateNode;
			if (i.current.memoizedState.isDehydrated) {
				var a = tc(i.pendingLanes);
				a !== 0 && (Cc(i, a | 1), Ek(i, B()), !(K & 6) && ((Hj = B() + 500), jg()));
			}
			break;
		case 13:
			(Sk(function () {
				var s = Zg(o, 1);
				if (s !== null) {
					var $ = L();
					mh(s, o, 1, $);
				}
			}),
				jl(o, 1));
	}
};
Fc = function (o) {
	if (o.tag === 13) {
		var i = Zg(o, 134217728);
		if (i !== null) {
			var a = L();
			mh(i, o, 134217728, a);
		}
		jl(o, 134217728);
	}
};
Gc = function (o) {
	if (o.tag === 13) {
		var i = lh(o),
			a = Zg(o, i);
		if (a !== null) {
			var s = L();
			mh(a, o, i, s);
		}
		jl(o, i);
	}
};
Hc = function () {
	return C;
};
Ic = function (o, i) {
	var a = C;
	try {
		return ((C = o), i());
	} finally {
		C = a;
	}
};
yb = function (o, i, a) {
	switch (i) {
		case "input":
			if ((bb(o, a), (i = a.name), a.type === "radio" && i != null)) {
				for (a = o; a.parentNode; ) a = a.parentNode;
				for (
					a = a.querySelectorAll("input[name=" + JSON.stringify("" + i) + '][type="radio"]'), i = 0;
					i < a.length;
					i++
				) {
					var s = a[i];
					if (s !== o && s.form === o.form) {
						var $ = Db(s);
						if (!$) throw Error(p$1(90));
						(Wa(s), bb(s, $));
					}
				}
			}
			break;
		case "textarea":
			ib(o, a);
			break;
		case "select":
			((i = a.value), i != null && fb(o, !!a.multiple, i, !1));
	}
};
Gb = Rk;
Hb = Sk;
var tl = { usingClientEntryPoint: !1, Events: [Cb, ue, Db, Eb, Fb, Rk] },
	ul = {
		findFiberByHostInstance: Wc,
		bundleType: 0,
		version: "18.2.0",
		rendererPackageName: "react-dom",
	},
	vl = {
		bundleType: ul.bundleType,
		version: ul.version,
		rendererPackageName: ul.rendererPackageName,
		rendererConfig: ul.rendererConfig,
		overrideHookState: null,
		overrideHookStateDeletePath: null,
		overrideHookStateRenamePath: null,
		overrideProps: null,
		overridePropsDeletePath: null,
		overridePropsRenamePath: null,
		setErrorHandler: null,
		setSuspenseHandler: null,
		scheduleUpdate: null,
		currentDispatcherRef: ua.ReactCurrentDispatcher,
		findHostInstanceByFiber: function (o) {
			return ((o = Zb(o)), o === null ? null : o.stateNode);
		},
		findFiberByHostInstance: ul.findFiberByHostInstance || kl,
		findHostInstancesForRefresh: null,
		scheduleRefresh: null,
		scheduleRoot: null,
		setRefreshHandler: null,
		getCurrentFiber: null,
		reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
	};
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
	var wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
	if (!wl.isDisabled && wl.supportsFiber)
		try {
			((kc = wl.inject(vl)), (lc = wl));
		} catch {}
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
reactDom_production_min.createPortal = function (o, i) {
	var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
	if (!ol(i)) throw Error(p$1(200));
	return dl(o, i, null, a);
};
reactDom_production_min.createRoot = function (o, i) {
	if (!ol(o)) throw Error(p$1(299));
	var a = !1,
		s = "",
		$ = ll;
	return (
		i != null &&
			(i.unstable_strictMode === !0 && (a = !0),
			i.identifierPrefix !== void 0 && (s = i.identifierPrefix),
			i.onRecoverableError !== void 0 && ($ = i.onRecoverableError)),
		(i = cl(o, 1, !1, null, null, a, !1, s, $)),
		(o[uf] = i.current),
		sf(o.nodeType === 8 ? o.parentNode : o),
		new ml(i)
	);
};
reactDom_production_min.findDOMNode = function (o) {
	if (o == null) return null;
	if (o.nodeType === 1) return o;
	var i = o._reactInternals;
	if (i === void 0)
		throw typeof o.render == "function"
			? Error(p$1(188))
			: ((o = Object.keys(o).join(",")), Error(p$1(268, o)));
	return ((o = Zb(i)), (o = o === null ? null : o.stateNode), o);
};
reactDom_production_min.flushSync = function (o) {
	return Sk(o);
};
reactDom_production_min.hydrate = function (o, i, a) {
	if (!pl(i)) throw Error(p$1(200));
	return sl(null, o, i, !0, a);
};
reactDom_production_min.hydrateRoot = function (o, i, a) {
	if (!ol(o)) throw Error(p$1(405));
	var s = (a != null && a.hydratedSources) || null,
		$ = !1,
		j = "",
		_e = ll;
	if (
		(a != null &&
			(a.unstable_strictMode === !0 && ($ = !0),
			a.identifierPrefix !== void 0 && (j = a.identifierPrefix),
			a.onRecoverableError !== void 0 && (_e = a.onRecoverableError)),
		(i = fl(i, null, o, 1, a ?? null, $, !1, j, _e)),
		(o[uf] = i.current),
		sf(o),
		s)
	)
		for (o = 0; o < s.length; o++)
			((a = s[o]),
				($ = a._getVersion),
				($ = $(a._source)),
				i.mutableSourceEagerHydrationData == null
					? (i.mutableSourceEagerHydrationData = [a, $])
					: i.mutableSourceEagerHydrationData.push(a, $));
	return new nl(i);
};
reactDom_production_min.render = function (o, i, a) {
	if (!pl(i)) throw Error(p$1(200));
	return sl(null, o, i, !1, a);
};
reactDom_production_min.unmountComponentAtNode = function (o) {
	if (!pl(o)) throw Error(p$1(40));
	return o._reactRootContainer
		? (Sk(function () {
				sl(null, null, o, !1, function () {
					((o._reactRootContainer = null), (o[uf] = null));
				});
			}),
			!0)
		: !1;
};
reactDom_production_min.unstable_batchedUpdates = Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function (o, i, a, s) {
	if (!pl(a)) throw Error(p$1(200));
	if (o == null || o._reactInternals === void 0) throw Error(p$1(38));
	return sl(o, i, a, !1, s);
};
reactDom_production_min.version = "18.2.0-next-9e3b772b8-20220608";
function checkDCE() {
	if (
		!(
			typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
			typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
		)
	)
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (o) {
			console.error(o);
		}
}
(checkDCE(), (reactDom.exports = reactDom_production_min));
var reactDomExports = reactDom.exports;
const ReactDOM = getDefaultExportFromCjs(reactDomExports);
var m$1 = reactDomExports;
((client.createRoot = m$1.createRoot), (client.hydrateRoot = m$1.hydrateRoot));
var hasElementType = typeof Element < "u",
	hasMap = typeof Map == "function",
	hasSet = typeof Set == "function",
	hasArrayBuffer = typeof ArrayBuffer == "function" && !!ArrayBuffer.isView;
function equal(o, i) {
	if (o === i) return !0;
	if (o && i && typeof o == "object" && typeof i == "object") {
		if (o.constructor !== i.constructor) return !1;
		var a, s, $;
		if (Array.isArray(o)) {
			if (((a = o.length), a != i.length)) return !1;
			for (s = a; s-- !== 0; ) if (!equal(o[s], i[s])) return !1;
			return !0;
		}
		var j;
		if (hasMap && o instanceof Map && i instanceof Map) {
			if (o.size !== i.size) return !1;
			for (j = o.entries(); !(s = j.next()).done; ) if (!i.has(s.value[0])) return !1;
			for (j = o.entries(); !(s = j.next()).done; )
				if (!equal(s.value[1], i.get(s.value[0]))) return !1;
			return !0;
		}
		if (hasSet && o instanceof Set && i instanceof Set) {
			if (o.size !== i.size) return !1;
			for (j = o.entries(); !(s = j.next()).done; ) if (!i.has(s.value[0])) return !1;
			return !0;
		}
		if (hasArrayBuffer && ArrayBuffer.isView(o) && ArrayBuffer.isView(i)) {
			if (((a = o.length), a != i.length)) return !1;
			for (s = a; s-- !== 0; ) if (o[s] !== i[s]) return !1;
			return !0;
		}
		if (o.constructor === RegExp) return o.source === i.source && o.flags === i.flags;
		if (
			o.valueOf !== Object.prototype.valueOf &&
			typeof o.valueOf == "function" &&
			typeof i.valueOf == "function"
		)
			return o.valueOf() === i.valueOf();
		if (
			o.toString !== Object.prototype.toString &&
			typeof o.toString == "function" &&
			typeof i.toString == "function"
		)
			return o.toString() === i.toString();
		if ((($ = Object.keys(o)), (a = $.length), a !== Object.keys(i).length)) return !1;
		for (s = a; s-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(i, $[s])) return !1;
		if (hasElementType && o instanceof Element) return !1;
		for (s = a; s-- !== 0; )
			if (
				!(($[s] === "_owner" || $[s] === "__v" || $[s] === "__o") && o.$$typeof) &&
				!equal(o[$[s]], i[$[s]])
			)
				return !1;
		return !0;
	}
	return o !== o && i !== i;
}
var reactFastCompare = function (i, a) {
	try {
		return equal(i, a);
	} catch (s) {
		if ((s.message || "").match(/stack|recursion/i))
			return (console.warn("react-fast-compare cannot handle circular refs"), !1);
		throw s;
	}
};
const fastCompare = getDefaultExportFromCjs(reactFastCompare);
var invariant$1 = function (o, i, a, s, $, j, _e, et) {
		if (!o) {
			var tt;
			if (i === void 0)
				tt = new Error(
					"Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
				);
			else {
				var rt = [a, s, $, j, _e, et],
					nt = 0;
				((tt = new Error(
					i.replace(/%s/g, function () {
						return rt[nt++];
					})
				)),
					(tt.name = "Invariant Violation"));
			}
			throw ((tt.framesToPop = 1), tt);
		}
	},
	browser = invariant$1;
const invariant$2 = getDefaultExportFromCjs(browser);
var shallowequal = function (i, a, s, $) {
	var j = s ? s.call($, i, a) : void 0;
	if (j !== void 0) return !!j;
	if (i === a) return !0;
	if (typeof i != "object" || !i || typeof a != "object" || !a) return !1;
	var _e = Object.keys(i),
		et = Object.keys(a);
	if (_e.length !== et.length) return !1;
	for (var tt = Object.prototype.hasOwnProperty.bind(a), rt = 0; rt < _e.length; rt++) {
		var nt = _e[rt];
		if (!tt(nt)) return !1;
		var it = i[nt],
			ot = a[nt];
		if (((j = s ? s.call($, it, ot, nt) : void 0), j === !1 || (j === void 0 && it !== ot)))
			return !1;
	}
	return !0;
};
const shallowEqual = getDefaultExportFromCjs(shallowequal);
var TAG_NAMES = ((o) => (
		(o.BASE = "base"),
		(o.BODY = "body"),
		(o.HEAD = "head"),
		(o.HTML = "html"),
		(o.LINK = "link"),
		(o.META = "meta"),
		(o.NOSCRIPT = "noscript"),
		(o.SCRIPT = "script"),
		(o.STYLE = "style"),
		(o.TITLE = "title"),
		(o.FRAGMENT = "Symbol(react.fragment)"),
		o
	))(TAG_NAMES || {}),
	SEO_PRIORITY_TAGS = {
		link: { rel: ["amphtml", "canonical", "alternate"] },
		script: { type: ["application/ld+json"] },
		meta: {
			charset: "",
			name: ["generator", "robots", "description"],
			property: [
				"og:type",
				"og:title",
				"og:url",
				"og:image",
				"og:image:alt",
				"og:description",
				"twitter:url",
				"twitter:title",
				"twitter:description",
				"twitter:image",
				"twitter:image:alt",
				"twitter:card",
				"twitter:site",
			],
		},
	},
	VALID_TAG_NAMES = Object.values(TAG_NAMES),
	REACT_TAG_MAP = {
		accesskey: "accessKey",
		charset: "charSet",
		class: "className",
		contenteditable: "contentEditable",
		contextmenu: "contextMenu",
		"http-equiv": "httpEquiv",
		itemprop: "itemProp",
		tabindex: "tabIndex",
	},
	HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce((o, [i, a]) => ((o[a] = i), o), {}),
	HELMET_ATTRIBUTE = "data-rh",
	HELMET_PROPS = {
		DEFAULT_TITLE: "defaultTitle",
		DEFER: "defer",
		ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
		ON_CHANGE_CLIENT_STATE: "onChangeClientState",
		TITLE_TEMPLATE: "titleTemplate",
		PRIORITIZE_SEO_TAGS: "prioritizeSeoTags",
	},
	getInnermostProperty = (o, i) => {
		for (let a = o.length - 1; a >= 0; a -= 1) {
			const s = o[a];
			if (Object.prototype.hasOwnProperty.call(s, i)) return s[i];
		}
		return null;
	},
	getTitleFromPropsList = (o) => {
		let i = getInnermostProperty(o, "title");
		const a = getInnermostProperty(o, HELMET_PROPS.TITLE_TEMPLATE);
		if ((Array.isArray(i) && (i = i.join("")), a && i)) return a.replace(/%s/g, () => i);
		const s = getInnermostProperty(o, HELMET_PROPS.DEFAULT_TITLE);
		return i || s || void 0;
	},
	getOnChangeClientState = (o) =>
		getInnermostProperty(o, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {}),
	getAttributesFromPropsList = (o, i) =>
		i
			.filter((a) => typeof a[o] < "u")
			.map((a) => a[o])
			.reduce((a, s) => ({ ...a, ...s }), {}),
	getBaseTagFromPropsList = (o, i) =>
		i
			.filter((a) => typeof a.base < "u")
			.map((a) => a.base)
			.reverse()
			.reduce((a, s) => {
				if (!a.length) {
					const $ = Object.keys(s);
					for (let j = 0; j < $.length; j += 1) {
						const et = $[j].toLowerCase();
						if (o.indexOf(et) !== -1 && s[et]) return a.concat(s);
					}
				}
				return a;
			}, []),
	warn = (o) => console && typeof console.warn == "function" && console.warn(o),
	getTagsFromPropsList = (o, i, a) => {
		const s = {};
		return a
			.filter(($) =>
				Array.isArray($[o])
					? !0
					: (typeof $[o] < "u" &&
							warn(`Helmet: ${o} should be of type "Array". Instead found type "${typeof $[o]}"`),
						!1)
			)
			.map(($) => $[o])
			.reverse()
			.reduce(($, j) => {
				const _e = {};
				j.filter((tt) => {
					let rt;
					const nt = Object.keys(tt);
					for (let ot = 0; ot < nt.length; ot += 1) {
						const st = nt[ot],
							lt = st.toLowerCase();
						(i.indexOf(lt) !== -1 &&
							!(rt === "rel" && tt[rt].toLowerCase() === "canonical") &&
							!(lt === "rel" && tt[lt].toLowerCase() === "stylesheet") &&
							(rt = lt),
							i.indexOf(st) !== -1 &&
								(st === "innerHTML" || st === "cssText" || st === "itemprop") &&
								(rt = st));
					}
					if (!rt || !tt[rt]) return !1;
					const it = tt[rt].toLowerCase();
					return (
						s[rt] || (s[rt] = {}), _e[rt] || (_e[rt] = {}), s[rt][it] ? !1 : ((_e[rt][it] = !0), !0)
					);
				})
					.reverse()
					.forEach((tt) => $.push(tt));
				const et = Object.keys(_e);
				for (let tt = 0; tt < et.length; tt += 1) {
					const rt = et[tt],
						nt = { ...s[rt], ..._e[rt] };
					s[rt] = nt;
				}
				return $;
			}, [])
			.reverse();
	},
	getAnyTrueFromPropsList = (o, i) => {
		if (Array.isArray(o) && o.length) {
			for (let a = 0; a < o.length; a += 1) if (o[a][i]) return !0;
		}
		return !1;
	},
	reducePropsToState = (o) => ({
		baseTag: getBaseTagFromPropsList(["href"], o),
		bodyAttributes: getAttributesFromPropsList("bodyAttributes", o),
		defer: getInnermostProperty(o, HELMET_PROPS.DEFER),
		encode: getInnermostProperty(o, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
		htmlAttributes: getAttributesFromPropsList("htmlAttributes", o),
		linkTags: getTagsFromPropsList("link", ["rel", "href"], o),
		metaTags: getTagsFromPropsList(
			"meta",
			["name", "charset", "http-equiv", "property", "itemprop"],
			o
		),
		noscriptTags: getTagsFromPropsList("noscript", ["innerHTML"], o),
		onChangeClientState: getOnChangeClientState(o),
		scriptTags: getTagsFromPropsList("script", ["src", "innerHTML"], o),
		styleTags: getTagsFromPropsList("style", ["cssText"], o),
		title: getTitleFromPropsList(o),
		titleAttributes: getAttributesFromPropsList("titleAttributes", o),
		prioritizeSeoTags: getAnyTrueFromPropsList(o, HELMET_PROPS.PRIORITIZE_SEO_TAGS),
	}),
	flattenArray = (o) => (Array.isArray(o) ? o.join("") : o),
	checkIfPropsMatch = (o, i) => {
		const a = Object.keys(o);
		for (let s = 0; s < a.length; s += 1) if (i[a[s]] && i[a[s]].includes(o[a[s]])) return !0;
		return !1;
	},
	prioritizer = (o, i) =>
		Array.isArray(o)
			? o.reduce((a, s) => (checkIfPropsMatch(s, i) ? a.priority.push(s) : a.default.push(s), a), {
					priority: [],
					default: [],
				})
			: { default: o, priority: [] },
	without = (o, i) => ({ ...o, [i]: void 0 }),
	SELF_CLOSING_TAGS = ["noscript", "script", "style"],
	encodeSpecialCharacters = (o, i = !0) =>
		i === !1
			? String(o)
			: String(o)
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#x27;"),
	generateElementAttributesAsString = (o) =>
		Object.keys(o).reduce((i, a) => {
			const s = typeof o[a] < "u" ? `${a}="${o[a]}"` : `${a}`;
			return i ? `${i} ${s}` : s;
		}, ""),
	generateTitleAsString = (o, i, a, s) => {
		const $ = generateElementAttributesAsString(a),
			j = flattenArray(i);
		return $
			? `<${o} ${HELMET_ATTRIBUTE}="true" ${$}>${encodeSpecialCharacters(j, s)}</${o}>`
			: `<${o} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(j, s)}</${o}>`;
	},
	generateTagsAsString = (o, i, a = !0) =>
		i.reduce((s, $) => {
			const j = $,
				_e = Object.keys(j)
					.filter((rt) => !(rt === "innerHTML" || rt === "cssText"))
					.reduce((rt, nt) => {
						const it = typeof j[nt] > "u" ? nt : `${nt}="${encodeSpecialCharacters(j[nt], a)}"`;
						return rt ? `${rt} ${it}` : it;
					}, ""),
				et = j.innerHTML || j.cssText || "",
				tt = SELF_CLOSING_TAGS.indexOf(o) === -1;
			return `${s}<${o} ${HELMET_ATTRIBUTE}="true" ${_e}${tt ? "/>" : `>${et}</${o}>`}`;
		}, ""),
	convertElementAttributesToReactProps = (o, i = {}) =>
		Object.keys(o).reduce((a, s) => {
			const $ = REACT_TAG_MAP[s];
			return ((a[$ || s] = o[s]), a);
		}, i),
	generateTitleAsReactComponent = (o, i, a) => {
		const s = { key: i, [HELMET_ATTRIBUTE]: !0 },
			$ = convertElementAttributesToReactProps(a, s);
		return [React.createElement("title", $, i)];
	},
	generateTagsAsReactComponent = (o, i) =>
		i.map((a, s) => {
			const $ = { key: s, [HELMET_ATTRIBUTE]: !0 };
			return (
				Object.keys(a).forEach((j) => {
					const et = REACT_TAG_MAP[j] || j;
					if (et === "innerHTML" || et === "cssText") {
						const tt = a.innerHTML || a.cssText;
						$.dangerouslySetInnerHTML = { __html: tt };
					} else $[et] = a[j];
				}),
				React.createElement(o, $)
			);
		}),
	getMethodsForTag = (o, i, a = !0) => {
		switch (o) {
			case "title":
				return {
					toComponent: () => generateTitleAsReactComponent(o, i.title, i.titleAttributes),
					toString: () => generateTitleAsString(o, i.title, i.titleAttributes, a),
				};
			case "bodyAttributes":
			case "htmlAttributes":
				return {
					toComponent: () => convertElementAttributesToReactProps(i),
					toString: () => generateElementAttributesAsString(i),
				};
			default:
				return {
					toComponent: () => generateTagsAsReactComponent(o, i),
					toString: () => generateTagsAsString(o, i, a),
				};
		}
	},
	getPriorityMethods = ({ metaTags: o, linkTags: i, scriptTags: a, encode: s }) => {
		const $ = prioritizer(o, SEO_PRIORITY_TAGS.meta),
			j = prioritizer(i, SEO_PRIORITY_TAGS.link),
			_e = prioritizer(a, SEO_PRIORITY_TAGS.script);
		return {
			priorityMethods: {
				toComponent: () => [
					...generateTagsAsReactComponent("meta", $.priority),
					...generateTagsAsReactComponent("link", j.priority),
					...generateTagsAsReactComponent("script", _e.priority),
				],
				toString: () =>
					`${getMethodsForTag("meta", $.priority, s)} ${getMethodsForTag("link", j.priority, s)} ${getMethodsForTag("script", _e.priority, s)}`,
			},
			metaTags: $.default,
			linkTags: j.default,
			scriptTags: _e.default,
		};
	},
	mapStateOnServer = (o) => {
		const {
			baseTag: i,
			bodyAttributes: a,
			encode: s = !0,
			htmlAttributes: $,
			noscriptTags: j,
			styleTags: _e,
			title: et = "",
			titleAttributes: tt,
			prioritizeSeoTags: rt,
		} = o;
		let { linkTags: nt, metaTags: it, scriptTags: ot } = o,
			st = { toComponent: () => {}, toString: () => "" };
		return (
			rt &&
				({
					priorityMethods: st,
					linkTags: nt,
					metaTags: it,
					scriptTags: ot,
				} = getPriorityMethods(o)),
			{
				priority: st,
				base: getMethodsForTag("base", i, s),
				bodyAttributes: getMethodsForTag("bodyAttributes", a, s),
				htmlAttributes: getMethodsForTag("htmlAttributes", $, s),
				link: getMethodsForTag("link", nt, s),
				meta: getMethodsForTag("meta", it, s),
				noscript: getMethodsForTag("noscript", j, s),
				script: getMethodsForTag("script", ot, s),
				style: getMethodsForTag("style", _e, s),
				title: getMethodsForTag("title", { title: et, titleAttributes: tt }, s),
			}
		);
	},
	server_default = mapStateOnServer,
	instances = [],
	isDocument = !!(typeof window < "u" && window.document && window.document.createElement),
	HelmetData = class {
		constructor(o, i) {
			sr(this, "instances", []);
			sr(this, "canUseDOM", isDocument);
			sr(this, "context");
			sr(this, "value", {
				setHelmet: (o) => {
					this.context.helmet = o;
				},
				helmetInstances: {
					get: () => (this.canUseDOM ? instances : this.instances),
					add: (o) => {
						(this.canUseDOM ? instances : this.instances).push(o);
					},
					remove: (o) => {
						const i = (this.canUseDOM ? instances : this.instances).indexOf(o);
						(this.canUseDOM ? instances : this.instances).splice(i, 1);
					},
				},
			});
			((this.context = o),
				(this.canUseDOM = i || !1),
				i ||
					(o.helmet = server_default({
						baseTag: [],
						bodyAttributes: {},
						encodeSpecialCharacters: !0,
						htmlAttributes: {},
						linkTags: [],
						metaTags: [],
						noscriptTags: [],
						scriptTags: [],
						styleTags: [],
						title: "",
						titleAttributes: {},
					})));
		}
	},
	defaultValue = {},
	Context = React.createContext(defaultValue),
	xr,
	HelmetProvider =
		((xr = class extends reactExports.Component {
			constructor(a) {
				super(a);
				sr(this, "helmetData");
				this.helmetData = new HelmetData(this.props.context || {}, xr.canUseDOM);
			}
			render() {
				return React.createElement(
					Context.Provider,
					{ value: this.helmetData.value },
					this.props.children
				);
			}
		}),
		sr(xr, "canUseDOM", isDocument),
		xr),
	updateTags = (o, i) => {
		const a = document.head || document.querySelector("head"),
			s = a.querySelectorAll(`${o}[${HELMET_ATTRIBUTE}]`),
			$ = [].slice.call(s),
			j = [];
		let _e;
		return (
			i &&
				i.length &&
				i.forEach((et) => {
					const tt = document.createElement(o);
					for (const rt in et)
						if (Object.prototype.hasOwnProperty.call(et, rt))
							if (rt === "innerHTML") tt.innerHTML = et.innerHTML;
							else if (rt === "cssText")
								tt.styleSheet
									? (tt.styleSheet.cssText = et.cssText)
									: tt.appendChild(document.createTextNode(et.cssText));
							else {
								const nt = rt,
									it = typeof et[nt] > "u" ? "" : et[nt];
								tt.setAttribute(rt, it);
							}
					(tt.setAttribute(HELMET_ATTRIBUTE, "true"),
						$.some((rt, nt) => ((_e = nt), tt.isEqualNode(rt))) ? $.splice(_e, 1) : j.push(tt));
				}),
			$.forEach((et) => {
				var tt;
				return (tt = et.parentNode) == null ? void 0 : tt.removeChild(et);
			}),
			j.forEach((et) => a.appendChild(et)),
			{ oldTags: $, newTags: j }
		);
	},
	updateAttributes = (o, i) => {
		const a = document.getElementsByTagName(o)[0];
		if (!a) return;
		const s = a.getAttribute(HELMET_ATTRIBUTE),
			$ = s ? s.split(",") : [],
			j = [...$],
			_e = Object.keys(i);
		for (const et of _e) {
			const tt = i[et] || "";
			(a.getAttribute(et) !== tt && a.setAttribute(et, tt), $.indexOf(et) === -1 && $.push(et));
			const rt = j.indexOf(et);
			rt !== -1 && j.splice(rt, 1);
		}
		for (let et = j.length - 1; et >= 0; et -= 1) a.removeAttribute(j[et]);
		$.length === j.length
			? a.removeAttribute(HELMET_ATTRIBUTE)
			: a.getAttribute(HELMET_ATTRIBUTE) !== _e.join(",") &&
				a.setAttribute(HELMET_ATTRIBUTE, _e.join(","));
	},
	updateTitle = (o, i) => {
		(typeof o < "u" && document.title !== o && (document.title = flattenArray(o)),
			updateAttributes("title", i));
	},
	commitTagChanges = (o, i) => {
		const {
			baseTag: a,
			bodyAttributes: s,
			htmlAttributes: $,
			linkTags: j,
			metaTags: _e,
			noscriptTags: et,
			onChangeClientState: tt,
			scriptTags: rt,
			styleTags: nt,
			title: it,
			titleAttributes: ot,
		} = o;
		(updateAttributes("body", s), updateAttributes("html", $), updateTitle(it, ot));
		const st = {
				baseTag: updateTags("base", a),
				linkTags: updateTags("link", j),
				metaTags: updateTags("meta", _e),
				noscriptTags: updateTags("noscript", et),
				scriptTags: updateTags("script", rt),
				styleTags: updateTags("style", nt),
			},
			lt = {},
			dt = {};
		(Object.keys(st).forEach((pt) => {
			const { newTags: ct, oldTags: at } = st[pt];
			(ct.length && (lt[pt] = ct), at.length && (dt[pt] = st[pt].oldTags));
		}),
			i && i(),
			tt(o, lt, dt));
	},
	_helmetCallback = null,
	handleStateChangeOnClient = (o) => {
		(_helmetCallback && cancelAnimationFrame(_helmetCallback),
			o.defer
				? (_helmetCallback = requestAnimationFrame(() => {
						commitTagChanges(o, () => {
							_helmetCallback = null;
						});
					}))
				: (commitTagChanges(o), (_helmetCallback = null)));
	},
	client_default = handleStateChangeOnClient,
	HelmetDispatcher = class extends reactExports.Component {
		constructor() {
			super(...arguments);
			sr(this, "rendered", !1);
		}
		shouldComponentUpdate(i) {
			return !shallowEqual(i, this.props);
		}
		componentDidUpdate() {
			this.emitChange();
		}
		componentWillUnmount() {
			const { helmetInstances: i } = this.props.context;
			(i.remove(this), this.emitChange());
		}
		emitChange() {
			const { helmetInstances: i, setHelmet: a } = this.props.context;
			let s = null;
			const $ = reducePropsToState(
				i.get().map((j) => {
					const _e = { ...j.props };
					return (delete _e.context, _e);
				})
			);
			(HelmetProvider.canUseDOM ? client_default($) : server_default && (s = server_default($)),
				a(s));
		}
		init() {
			if (this.rendered) return;
			this.rendered = !0;
			const { helmetInstances: i } = this.props.context;
			(i.add(this), this.emitChange());
		}
		render() {
			return (this.init(), null);
		}
	},
	Ur,
	Helmet =
		((Ur = class extends reactExports.Component {
			shouldComponentUpdate(o) {
				return !fastCompare(without(this.props, "helmetData"), without(o, "helmetData"));
			}
			mapNestedChildrenToProps(o, i) {
				if (!i) return null;
				switch (o.type) {
					case "script":
					case "noscript":
						return { innerHTML: i };
					case "style":
						return { cssText: i };
					default:
						throw new Error(
							`<${o.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
						);
				}
			}
			flattenArrayTypeChildren(o, i, a, s) {
				return {
					...i,
					[o.type]: [...(i[o.type] || []), { ...a, ...this.mapNestedChildrenToProps(o, s) }],
				};
			}
			mapObjectTypeChildren(o, i, a, s) {
				switch (o.type) {
					case "title":
						return { ...i, [o.type]: s, titleAttributes: { ...a } };
					case "body":
						return { ...i, bodyAttributes: { ...a } };
					case "html":
						return { ...i, htmlAttributes: { ...a } };
					default:
						return { ...i, [o.type]: { ...a } };
				}
			}
			mapArrayTypeChildrenToProps(o, i) {
				let a = { ...i };
				return (
					Object.keys(o).forEach((s) => {
						a = { ...a, [s]: o[s] };
					}),
					a
				);
			}
			warnOnInvalidChildren(o, i) {
				return (
					invariant$2(
						VALID_TAG_NAMES.some((a) => o.type === a),
						typeof o.type == "function"
							? "You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information."
							: `Only elements types ${VALID_TAG_NAMES.join(", ")} are allowed. Helmet does not support rendering <${o.type}> elements. Refer to our API for more information.`
					),
					invariant$2(
						!i ||
							typeof i == "string" ||
							(Array.isArray(i) && !i.some((a) => typeof a != "string")),
						`Helmet expects a string as a child of <${o.type}>. Did you forget to wrap your children in braces? ( <${o.type}>{\`\`}</${o.type}> ) Refer to our API for more information.`
					),
					!0
				);
			}
			mapChildrenToProps(o, i) {
				let a = {};
				return (
					React.Children.forEach(o, (s) => {
						if (!s || !s.props) return;
						const { children: $, ...j } = s.props,
							_e = Object.keys(j).reduce(
								(tt, rt) => ((tt[HTML_TAG_MAP[rt] || rt] = j[rt]), tt),
								{}
							);
						let { type: et } = s;
						switch (
							(typeof et == "symbol" ? (et = et.toString()) : this.warnOnInvalidChildren(s, $), et)
						) {
							case "Symbol(react.fragment)":
								i = this.mapChildrenToProps($, i);
								break;
							case "link":
							case "meta":
							case "noscript":
							case "script":
							case "style":
								a = this.flattenArrayTypeChildren(s, a, _e, $);
								break;
							default:
								i = this.mapObjectTypeChildren(s, i, _e, $);
								break;
						}
					}),
					this.mapArrayTypeChildrenToProps(a, i)
				);
			}
			render() {
				const { children: o, ...i } = this.props;
				let a = { ...i },
					{ helmetData: s } = i;
				if ((o && (a = this.mapChildrenToProps(o, a)), s && !(s instanceof HelmetData))) {
					const $ = s;
					((s = new HelmetData($.context, !0)), delete a.helmetData);
				}
				return s
					? React.createElement(HelmetDispatcher, { ...a, context: s.value })
					: React.createElement(Context.Consumer, null, ($) =>
							React.createElement(HelmetDispatcher, { ...a, context: $ })
						);
			}
		}),
		sr(Ur, "defaultProps", { defer: !0, encodeSpecialCharacters: !0, prioritizeSeoTags: !1 }),
		Ur);
/**
 * @remix-run/router v1.11.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function _extends$c() {
	return (
		(_extends$c = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$c.apply(this, arguments)
	);
}
var Action;
(function (o) {
	((o.Pop = "POP"), (o.Push = "PUSH"), (o.Replace = "REPLACE"));
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createMemoryHistory(o) {
	o === void 0 && (o = {});
	let { initialEntries: i = ["/"], initialIndex: a, v5Compat: s = !1 } = o,
		$;
	$ = i.map((st, lt) =>
		nt(st, typeof st == "string" ? null : st.state, lt === 0 ? "default" : void 0)
	);
	let j = tt(a ?? $.length - 1),
		_e = Action.Pop,
		et = null;
	function tt(st) {
		return Math.min(Math.max(st, 0), $.length - 1);
	}
	function rt() {
		return $[j];
	}
	function nt(st, lt, dt) {
		lt === void 0 && (lt = null);
		let pt = createLocation($ ? rt().pathname : "/", st, lt, dt);
		return (
			warning(
				pt.pathname.charAt(0) === "/",
				"relative pathnames are not supported in memory history: " + JSON.stringify(st)
			),
			pt
		);
	}
	function it(st) {
		return typeof st == "string" ? st : createPath(st);
	}
	return {
		get index() {
			return j;
		},
		get action() {
			return _e;
		},
		get location() {
			return rt();
		},
		createHref: it,
		createURL(st) {
			return new URL(it(st), "http://localhost");
		},
		encodeLocation(st) {
			let lt = typeof st == "string" ? parsePath(st) : st;
			return { pathname: lt.pathname || "", search: lt.search || "", hash: lt.hash || "" };
		},
		push(st, lt) {
			_e = Action.Push;
			let dt = nt(st, lt);
			((j += 1), $.splice(j, $.length, dt), s && et && et({ action: _e, location: dt, delta: 1 }));
		},
		replace(st, lt) {
			_e = Action.Replace;
			let dt = nt(st, lt);
			(($[j] = dt), s && et && et({ action: _e, location: dt, delta: 0 }));
		},
		go(st) {
			_e = Action.Pop;
			let lt = tt(j + st),
				dt = $[lt];
			((j = lt), et && et({ action: _e, location: dt, delta: st }));
		},
		listen(st) {
			return (
				(et = st),
				() => {
					et = null;
				}
			);
		},
	};
}
function createBrowserHistory(o) {
	o === void 0 && (o = {});
	function i(s, $) {
		let { pathname: j, search: _e, hash: et } = s.location;
		return createLocation(
			"",
			{ pathname: j, search: _e, hash: et },
			($.state && $.state.usr) || null,
			($.state && $.state.key) || "default"
		);
	}
	function a(s, $) {
		return typeof $ == "string" ? $ : createPath($);
	}
	return getUrlBasedHistory(i, a, null, o);
}
function createHashHistory(o) {
	o === void 0 && (o = {});
	function i($, j) {
		let {
			pathname: _e = "/",
			search: et = "",
			hash: tt = "",
		} = parsePath($.location.hash.substr(1));
		return (
			!_e.startsWith("/") && !_e.startsWith(".") && (_e = "/" + _e),
			createLocation(
				"",
				{ pathname: _e, search: et, hash: tt },
				(j.state && j.state.usr) || null,
				(j.state && j.state.key) || "default"
			)
		);
	}
	function a($, j) {
		let _e = $.document.querySelector("base"),
			et = "";
		if (_e && _e.getAttribute("href")) {
			let tt = $.location.href,
				rt = tt.indexOf("#");
			et = rt === -1 ? tt : tt.slice(0, rt);
		}
		return et + "#" + (typeof j == "string" ? j : createPath(j));
	}
	function s($, j) {
		warning(
			$.pathname.charAt(0) === "/",
			"relative pathnames are not supported in hash history.push(" + JSON.stringify(j) + ")"
		);
	}
	return getUrlBasedHistory(i, a, s, o);
}
function invariant(o, i) {
	if (o === !1 || o === null || typeof o > "u") throw new Error(i);
}
function warning(o, i) {
	if (!o) {
		typeof console < "u" && console.warn(i);
		try {
			throw new Error(i);
		} catch {}
	}
}
function createKey() {
	return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(o, i) {
	return { usr: o.state, key: o.key, idx: i };
}
function createLocation(o, i, a, s) {
	return (
		a === void 0 && (a = null),
		_extends$c(
			{ pathname: typeof o == "string" ? o : o.pathname, search: "", hash: "" },
			typeof i == "string" ? parsePath(i) : i,
			{ state: a, key: (i && i.key) || s || createKey() }
		)
	);
}
function createPath(o) {
	let { pathname: i = "/", search: a = "", hash: s = "" } = o;
	return (
		a && a !== "?" && (i += a.charAt(0) === "?" ? a : "?" + a),
		s && s !== "#" && (i += s.charAt(0) === "#" ? s : "#" + s),
		i
	);
}
function parsePath(o) {
	let i = {};
	if (o) {
		let a = o.indexOf("#");
		a >= 0 && ((i.hash = o.substr(a)), (o = o.substr(0, a)));
		let s = o.indexOf("?");
		(s >= 0 && ((i.search = o.substr(s)), (o = o.substr(0, s))), o && (i.pathname = o));
	}
	return i;
}
function getUrlBasedHistory(o, i, a, s) {
	s === void 0 && (s = {});
	let { window: $ = document.defaultView, v5Compat: j = !1 } = s,
		_e = $.history,
		et = Action.Pop,
		tt = null,
		rt = nt();
	rt == null && ((rt = 0), _e.replaceState(_extends$c({}, _e.state, { idx: rt }), ""));
	function nt() {
		return (_e.state || { idx: null }).idx;
	}
	function it() {
		et = Action.Pop;
		let pt = nt(),
			ct = pt == null ? null : pt - rt;
		((rt = pt), tt && tt({ action: et, location: dt.location, delta: ct }));
	}
	function ot(pt, ct) {
		et = Action.Push;
		let at = createLocation(dt.location, pt, ct);
		(a && a(at, pt), (rt = nt() + 1));
		let ft = getHistoryState(at, rt),
			ut = dt.createHref(at);
		try {
			_e.pushState(ft, "", ut);
		} catch (ht) {
			if (ht instanceof DOMException && ht.name === "DataCloneError") throw ht;
			$.location.assign(ut);
		}
		j && tt && tt({ action: et, location: dt.location, delta: 1 });
	}
	function st(pt, ct) {
		et = Action.Replace;
		let at = createLocation(dt.location, pt, ct);
		(a && a(at, pt), (rt = nt()));
		let ft = getHistoryState(at, rt),
			ut = dt.createHref(at);
		(_e.replaceState(ft, "", ut), j && tt && tt({ action: et, location: dt.location, delta: 0 }));
	}
	function lt(pt) {
		let ct = $.location.origin !== "null" ? $.location.origin : $.location.href,
			at = typeof pt == "string" ? pt : createPath(pt);
		return (
			invariant(ct, "No window.location.(origin|href) available to create URL for href: " + at),
			new URL(at, ct)
		);
	}
	let dt = {
		get action() {
			return et;
		},
		get location() {
			return o($, _e);
		},
		listen(pt) {
			if (tt) throw new Error("A history only accepts one active listener");
			return (
				$.addEventListener(PopStateEventType, it),
				(tt = pt),
				() => {
					($.removeEventListener(PopStateEventType, it), (tt = null));
				}
			);
		},
		createHref(pt) {
			return i($, pt);
		},
		createURL: lt,
		encodeLocation(pt) {
			let ct = lt(pt);
			return { pathname: ct.pathname, search: ct.search, hash: ct.hash };
		},
		push: ot,
		replace: st,
		go(pt) {
			return _e.go(pt);
		},
	};
	return dt;
}
var ResultType;
(function (o) {
	((o.data = "data"), (o.deferred = "deferred"), (o.redirect = "redirect"), (o.error = "error"));
})(ResultType || (ResultType = {}));
const immutableRouteKeys = new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function isIndexRoute(o) {
	return o.index === !0;
}
function convertRoutesToDataRoutes(o, i, a, s) {
	return (
		a === void 0 && (a = []),
		s === void 0 && (s = {}),
		o.map(($, j) => {
			let _e = [...a, j],
				et = typeof $.id == "string" ? $.id : _e.join("-");
			if (
				(invariant($.index !== !0 || !$.children, "Cannot specify children on an index route"),
				invariant(
					!s[et],
					'Found a route id collision on id "' +
						et +
						`".  Route id's must be globally unique within Data Router usages`
				),
				isIndexRoute($))
			) {
				let tt = _extends$c({}, $, i($), { id: et });
				return ((s[et] = tt), tt);
			} else {
				let tt = _extends$c({}, $, i($), { id: et, children: void 0 });
				return (
					(s[et] = tt),
					$.children && (tt.children = convertRoutesToDataRoutes($.children, i, _e, s)),
					tt
				);
			}
		})
	);
}
function matchRoutes(o, i, a) {
	a === void 0 && (a = "/");
	let s = typeof i == "string" ? parsePath(i) : i,
		$ = stripBasename(s.pathname || "/", a);
	if ($ == null) return null;
	let j = flattenRoutes(o);
	rankRouteBranches(j);
	let _e = null;
	for (let et = 0; _e == null && et < j.length; ++et)
		_e = matchRouteBranch(j[et], safelyDecodeURI($));
	return _e;
}
function convertRouteMatchToUiMatch(o, i) {
	let { route: a, pathname: s, params: $ } = o;
	return { id: a.id, pathname: s, params: $, data: i[a.id], handle: a.handle };
}
function flattenRoutes(o, i, a, s) {
	(i === void 0 && (i = []), a === void 0 && (a = []), s === void 0 && (s = ""));
	let $ = (j, _e, et) => {
		let tt = {
			relativePath: et === void 0 ? j.path || "" : et,
			caseSensitive: j.caseSensitive === !0,
			childrenIndex: _e,
			route: j,
		};
		tt.relativePath.startsWith("/") &&
			(invariant(
				tt.relativePath.startsWith(s),
				'Absolute route path "' +
					tt.relativePath +
					'" nested under path ' +
					('"' + s + '" is not valid. An absolute child route path ') +
					"must start with the combined path of all its parent routes."
			),
			(tt.relativePath = tt.relativePath.slice(s.length)));
		let rt = joinPaths([s, tt.relativePath]),
			nt = a.concat(tt);
		(j.children &&
			j.children.length > 0 &&
			(invariant(
				j.index !== !0,
				"Index routes must not have child routes. Please remove " +
					('all child routes from route path "' + rt + '".')
			),
			flattenRoutes(j.children, i, nt, rt)),
			!(j.path == null && !j.index) &&
				i.push({ path: rt, score: computeScore(rt, j.index), routesMeta: nt }));
	};
	return (
		o.forEach((j, _e) => {
			var et;
			if (j.path === "" || !((et = j.path) != null && et.includes("?"))) $(j, _e);
			else for (let tt of explodeOptionalSegments(j.path)) $(j, _e, tt);
		}),
		i
	);
}
function explodeOptionalSegments(o) {
	let i = o.split("/");
	if (i.length === 0) return [];
	let [a, ...s] = i,
		$ = a.endsWith("?"),
		j = a.replace(/\?$/, "");
	if (s.length === 0) return $ ? [j, ""] : [j];
	let _e = explodeOptionalSegments(s.join("/")),
		et = [];
	return (
		et.push(..._e.map((tt) => (tt === "" ? j : [j, tt].join("/")))),
		$ && et.push(..._e),
		et.map((tt) => (o.startsWith("/") && tt === "" ? "/" : tt))
	);
}
function rankRouteBranches(o) {
	o.sort((i, a) =>
		i.score !== a.score
			? a.score - i.score
			: compareIndexes(
					i.routesMeta.map((s) => s.childrenIndex),
					a.routesMeta.map((s) => s.childrenIndex)
				)
	);
}
const paramRe = /^:\w+$/,
	dynamicSegmentValue = 3,
	indexRouteValue = 2,
	emptySegmentValue = 1,
	staticSegmentValue = 10,
	splatPenalty = -2,
	isSplat = (o) => o === "*";
function computeScore(o, i) {
	let a = o.split("/"),
		s = a.length;
	return (
		a.some(isSplat) && (s += splatPenalty),
		i && (s += indexRouteValue),
		a
			.filter(($) => !isSplat($))
			.reduce(
				($, j) =>
					$ +
					(paramRe.test(j)
						? dynamicSegmentValue
						: j === ""
							? emptySegmentValue
							: staticSegmentValue),
				s
			)
	);
}
function compareIndexes(o, i) {
	return o.length === i.length && o.slice(0, -1).every((s, $) => s === i[$])
		? o[o.length - 1] - i[i.length - 1]
		: 0;
}
function matchRouteBranch(o, i) {
	let { routesMeta: a } = o,
		s = {},
		$ = "/",
		j = [];
	for (let _e = 0; _e < a.length; ++_e) {
		let et = a[_e],
			tt = _e === a.length - 1,
			rt = $ === "/" ? i : i.slice($.length) || "/",
			nt = matchPath({ path: et.relativePath, caseSensitive: et.caseSensitive, end: tt }, rt);
		if (!nt) return null;
		Object.assign(s, nt.params);
		let it = et.route;
		(j.push({
			params: s,
			pathname: joinPaths([$, nt.pathname]),
			pathnameBase: normalizePathname(joinPaths([$, nt.pathnameBase])),
			route: it,
		}),
			nt.pathnameBase !== "/" && ($ = joinPaths([$, nt.pathnameBase])));
	}
	return j;
}
function generatePath(o, i) {
	i === void 0 && (i = {});
	let a = o;
	a.endsWith("*") &&
		a !== "*" &&
		!a.endsWith("/*") &&
		(warning(
			!1,
			'Route path "' +
				a +
				'" will be treated as if it were ' +
				('"' + a.replace(/\*$/, "/*") + '" because the `*` character must ') +
				"always follow a `/` in the pattern. To get rid of this warning, " +
				('please change the route path to "' + a.replace(/\*$/, "/*") + '".')
		),
		(a = a.replace(/\*$/, "/*")));
	const s = a.startsWith("/") ? "/" : "",
		$ = (_e) => (_e == null ? "" : typeof _e == "string" ? _e : String(_e)),
		j = a
			.split(/\/+/)
			.map((_e, et, tt) => {
				if (et === tt.length - 1 && _e === "*") return $(i["*"]);
				const nt = _e.match(/^:(\w+)(\??)$/);
				if (nt) {
					const [, it, ot] = nt;
					let st = i[it];
					return (invariant(ot === "?" || st != null, 'Missing ":' + it + '" param'), $(st));
				}
				return _e.replace(/\?$/g, "");
			})
			.filter((_e) => !!_e);
	return s + j.join("/");
}
function matchPath(o, i) {
	typeof o == "string" && (o = { path: o, caseSensitive: !1, end: !0 });
	let [a, s] = compilePath(o.path, o.caseSensitive, o.end),
		$ = i.match(a);
	if (!$) return null;
	let j = $[0],
		_e = j.replace(/(.)\/+$/, "$1"),
		et = $.slice(1);
	return {
		params: s.reduce((rt, nt, it) => {
			let { paramName: ot, isOptional: st } = nt;
			if (ot === "*") {
				let dt = et[it] || "";
				_e = j.slice(0, j.length - dt.length).replace(/(.)\/+$/, "$1");
			}
			const lt = et[it];
			return (
				st && !lt ? (rt[ot] = void 0) : (rt[ot] = safelyDecodeURIComponent(lt || "", ot)), rt
			);
		}, {}),
		pathname: j,
		pathnameBase: _e,
		pattern: o,
	};
}
function compilePath(o, i, a) {
	(i === void 0 && (i = !1),
		a === void 0 && (a = !0),
		warning(
			o === "*" || !o.endsWith("*") || o.endsWith("/*"),
			'Route path "' +
				o +
				'" will be treated as if it were ' +
				('"' + o.replace(/\*$/, "/*") + '" because the `*` character must ') +
				"always follow a `/` in the pattern. To get rid of this warning, " +
				('please change the route path to "' + o.replace(/\*$/, "/*") + '".')
		));
	let s = [],
		$ =
			"^" +
			o
				.replace(/\/*\*?$/, "")
				.replace(/^\/*/, "/")
				.replace(/[\\.*+^${}|()[\]]/g, "\\$&")
				.replace(
					/\/:(\w+)(\?)?/g,
					(_e, et, tt) => (
						s.push({ paramName: et, isOptional: tt != null }),
						tt ? "/?([^\\/]+)?" : "/([^\\/]+)"
					)
				);
	return (
		o.endsWith("*")
			? (s.push({ paramName: "*" }), ($ += o === "*" || o === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
			: a
				? ($ += "\\/*$")
				: o !== "" && o !== "/" && ($ += "(?:(?=\\/|$))"),
		[new RegExp($, i ? void 0 : "i"), s]
	);
}
function safelyDecodeURI(o) {
	try {
		return decodeURI(o);
	} catch (i) {
		return (
			warning(
				!1,
				'The URL path "' +
					o +
					'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
					("encoding (" + i + ").")
			),
			o
		);
	}
}
function safelyDecodeURIComponent(o, i) {
	try {
		return decodeURIComponent(o);
	} catch (a) {
		return (
			warning(
				!1,
				'The value for the URL param "' +
					i +
					'" will not be decoded because' +
					(' the string "' + o + '" is a malformed URL segment. This is probably') +
					(" due to a bad percent encoding (" + a + ").")
			),
			o
		);
	}
}
function stripBasename(o, i) {
	if (i === "/") return o;
	if (!o.toLowerCase().startsWith(i.toLowerCase())) return null;
	let a = i.endsWith("/") ? i.length - 1 : i.length,
		s = o.charAt(a);
	return s && s !== "/" ? null : o.slice(a) || "/";
}
function resolvePath(o, i) {
	i === void 0 && (i = "/");
	let { pathname: a, search: s = "", hash: $ = "" } = typeof o == "string" ? parsePath(o) : o;
	return {
		pathname: a ? (a.startsWith("/") ? a : resolvePathname(a, i)) : i,
		search: normalizeSearch(s),
		hash: normalizeHash($),
	};
}
function resolvePathname(o, i) {
	let a = i.replace(/\/+$/, "").split("/");
	return (
		o.split("/").forEach(($) => {
			$ === ".." ? a.length > 1 && a.pop() : $ !== "." && a.push($);
		}),
		a.length > 1 ? a.join("/") : "/"
	);
}
function getInvalidPathError(o, i, a, s) {
	return (
		"Cannot include a '" +
		o +
		"' character in a manually specified " +
		("`to." + i + "` field [" + JSON.stringify(s) + "].  Please separate it out to the ") +
		("`to." + a + "` field. Alternatively you may provide the full path as ") +
		'a string in <Link to="..."> and the router will parse it for you.'
	);
}
function getPathContributingMatches(o) {
	return o.filter((i, a) => a === 0 || (i.route.path && i.route.path.length > 0));
}
function resolveTo(o, i, a, s) {
	s === void 0 && (s = !1);
	let $;
	typeof o == "string"
		? ($ = parsePath(o))
		: (($ = _extends$c({}, o)),
			invariant(
				!$.pathname || !$.pathname.includes("?"),
				getInvalidPathError("?", "pathname", "search", $)
			),
			invariant(
				!$.pathname || !$.pathname.includes("#"),
				getInvalidPathError("#", "pathname", "hash", $)
			),
			invariant(
				!$.search || !$.search.includes("#"),
				getInvalidPathError("#", "search", "hash", $)
			));
	let j = o === "" || $.pathname === "",
		_e = j ? "/" : $.pathname,
		et;
	if (s || _e == null) et = a;
	else {
		let it = i.length - 1;
		if (_e.startsWith("..")) {
			let ot = _e.split("/");
			for (; ot[0] === ".."; ) (ot.shift(), (it -= 1));
			$.pathname = ot.join("/");
		}
		et = it >= 0 ? i[it] : "/";
	}
	let tt = resolvePath($, et),
		rt = _e && _e !== "/" && _e.endsWith("/"),
		nt = (j || _e === ".") && a.endsWith("/");
	return (!tt.pathname.endsWith("/") && (rt || nt) && (tt.pathname += "/"), tt);
}
const joinPaths = (o) => o.join("/").replace(/\/\/+/g, "/"),
	normalizePathname = (o) => o.replace(/\/+$/, "").replace(/^\/*/, "/"),
	normalizeSearch = (o) => (!o || o === "?" ? "" : o.startsWith("?") ? o : "?" + o),
	normalizeHash = (o) => (!o || o === "#" ? "" : o.startsWith("#") ? o : "#" + o),
	json = function (i, a) {
		a === void 0 && (a = {});
		let s = typeof a == "number" ? { status: a } : a,
			$ = new Headers(s.headers);
		return (
			$.has("Content-Type") || $.set("Content-Type", "application/json; charset=utf-8"),
			new Response(JSON.stringify(i), _extends$c({}, s, { headers: $ }))
		);
	};
class AbortedDeferredError extends Error {}
class DeferredData {
	constructor(i, a) {
		((this.pendingKeysSet = new Set()),
			(this.subscribers = new Set()),
			(this.deferredKeys = []),
			invariant(
				i && typeof i == "object" && !Array.isArray(i),
				"defer() only accepts plain objects"
			));
		let s;
		((this.abortPromise = new Promise((j, _e) => (s = _e))),
			(this.controller = new AbortController()));
		let $ = () => s(new AbortedDeferredError("Deferred data aborted"));
		((this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", $)),
			this.controller.signal.addEventListener("abort", $),
			(this.data = Object.entries(i).reduce((j, _e) => {
				let [et, tt] = _e;
				return Object.assign(j, { [et]: this.trackPromise(et, tt) });
			}, {})),
			this.done && this.unlistenAbortSignal(),
			(this.init = a));
	}
	trackPromise(i, a) {
		if (!(a instanceof Promise)) return a;
		(this.deferredKeys.push(i), this.pendingKeysSet.add(i));
		let s = Promise.race([a, this.abortPromise]).then(
			($) => this.onSettle(s, i, void 0, $),
			($) => this.onSettle(s, i, $)
		);
		return (s.catch(() => {}), Object.defineProperty(s, "_tracked", { get: () => !0 }), s);
	}
	onSettle(i, a, s, $) {
		if (this.controller.signal.aborted && s instanceof AbortedDeferredError)
			return (
				this.unlistenAbortSignal(),
				Object.defineProperty(i, "_error", { get: () => s }),
				Promise.reject(s)
			);
		if (
			(this.pendingKeysSet.delete(a),
			this.done && this.unlistenAbortSignal(),
			s === void 0 && $ === void 0)
		) {
			let j = new Error(
				'Deferred data for key "' +
					a +
					'" resolved/rejected with `undefined`, you must resolve/reject with a value or `null`.'
			);
			return (
				Object.defineProperty(i, "_error", { get: () => j }), this.emit(!1, a), Promise.reject(j)
			);
		}
		return $ === void 0
			? (Object.defineProperty(i, "_error", { get: () => s }), this.emit(!1, a), Promise.reject(s))
			: (Object.defineProperty(i, "_data", { get: () => $ }), this.emit(!1, a), $);
	}
	emit(i, a) {
		this.subscribers.forEach((s) => s(i, a));
	}
	subscribe(i) {
		return (this.subscribers.add(i), () => this.subscribers.delete(i));
	}
	cancel() {
		(this.controller.abort(),
			this.pendingKeysSet.forEach((i, a) => this.pendingKeysSet.delete(a)),
			this.emit(!0));
	}
	async resolveData(i) {
		let a = !1;
		if (!this.done) {
			let s = () => this.cancel();
			(i.addEventListener("abort", s),
				(a = await new Promise(($) => {
					this.subscribe((j) => {
						(i.removeEventListener("abort", s), (j || this.done) && $(j));
					});
				})));
		}
		return a;
	}
	get done() {
		return this.pendingKeysSet.size === 0;
	}
	get unwrappedData() {
		return (
			invariant(
				this.data !== null && this.done,
				"Can only unwrap data on initialized and settled deferreds"
			),
			Object.entries(this.data).reduce((i, a) => {
				let [s, $] = a;
				return Object.assign(i, { [s]: unwrapTrackedPromise($) });
			}, {})
		);
	}
	get pendingKeys() {
		return Array.from(this.pendingKeysSet);
	}
}
function isTrackedPromise(o) {
	return o instanceof Promise && o._tracked === !0;
}
function unwrapTrackedPromise(o) {
	if (!isTrackedPromise(o)) return o;
	if (o._error) throw o._error;
	return o._data;
}
const defer = function (i, a) {
		a === void 0 && (a = {});
		let s = typeof a == "number" ? { status: a } : a;
		return new DeferredData(i, s);
	},
	redirect = function (i, a) {
		a === void 0 && (a = 302);
		let s = a;
		typeof s == "number" ? (s = { status: s }) : typeof s.status > "u" && (s.status = 302);
		let $ = new Headers(s.headers);
		return ($.set("Location", i), new Response(null, _extends$c({}, s, { headers: $ })));
	},
	redirectDocument = (o, i) => {
		let a = redirect(o, i);
		return (a.headers.set("X-Remix-Reload-Document", "true"), a);
	};
class ErrorResponseImpl {
	constructor(i, a, s, $) {
		($ === void 0 && ($ = !1),
			(this.status = i),
			(this.statusText = a || ""),
			(this.internal = $),
			s instanceof Error ? ((this.data = s.toString()), (this.error = s)) : (this.data = s));
	}
}
function isRouteErrorResponse(o) {
	return (
		o != null &&
		typeof o.status == "number" &&
		typeof o.statusText == "string" &&
		typeof o.internal == "boolean" &&
		"data" in o
	);
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"],
	validMutationMethods = new Set(validMutationMethodsArr),
	validRequestMethodsArr = ["get", ...validMutationMethodsArr],
	validRequestMethods = new Set(validRequestMethodsArr),
	redirectStatusCodes = new Set([301, 302, 303, 307, 308]),
	redirectPreserveMethodStatusCodes = new Set([307, 308]),
	IDLE_NAVIGATION = {
		state: "idle",
		location: void 0,
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0,
	},
	IDLE_FETCHER = {
		state: "idle",
		data: void 0,
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0,
	},
	IDLE_BLOCKER = { state: "unblocked", proceed: void 0, reset: void 0, location: void 0 },
	ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
	defaultMapRouteProperties = (o) => ({ hasErrorBoundary: !!o.hasErrorBoundary }),
	TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
function createRouter(o) {
	const i = o.window ? o.window : typeof window < "u" ? window : void 0,
		a = typeof i < "u" && typeof i.document < "u" && typeof i.document.createElement < "u",
		s = !a;
	invariant(o.routes.length > 0, "You must provide a non-empty routes array to createRouter");
	let $;
	if (o.mapRouteProperties) $ = o.mapRouteProperties;
	else if (o.detectErrorBoundary) {
		let gt = o.detectErrorBoundary;
		$ = (xt) => ({ hasErrorBoundary: gt(xt) });
	} else $ = defaultMapRouteProperties;
	let j = {},
		_e = convertRoutesToDataRoutes(o.routes, $, void 0, j),
		et,
		tt = o.basename || "/",
		rt = _extends$c(
			{ v7_fetcherPersist: !1, v7_normalizeFormMethod: !1, v7_prependBasename: !1 },
			o.future
		),
		nt = null,
		it = new Set(),
		ot = null,
		st = null,
		lt = null,
		dt = o.hydrationData != null,
		pt = matchRoutes(_e, o.history.location, tt),
		ct = null;
	if (pt == null) {
		let gt = getInternalRouterError(404, { pathname: o.history.location.pathname }),
			{ matches: xt, route: bt } = getShortCircuitMatches(_e);
		((pt = xt), (ct = { [bt.id]: gt }));
	}
	let at =
			!pt.some((gt) => gt.route.lazy) &&
			(!pt.some((gt) => gt.route.loader) || o.hydrationData != null),
		ft,
		ut = {
			historyAction: o.history.action,
			location: o.history.location,
			matches: pt,
			initialized: at,
			navigation: IDLE_NAVIGATION,
			restoreScrollPosition: o.hydrationData != null ? !1 : null,
			preventScrollReset: !1,
			revalidation: "idle",
			loaderData: (o.hydrationData && o.hydrationData.loaderData) || {},
			actionData: (o.hydrationData && o.hydrationData.actionData) || null,
			errors: (o.hydrationData && o.hydrationData.errors) || ct,
			fetchers: new Map(),
			blockers: new Map(),
		},
		ht = Action.Pop,
		yt = !1,
		mt,
		Et = !1,
		Rt = new Map(),
		vt = null,
		Tt = !1,
		Pt = !1,
		Dt = [],
		Nt = [],
		$t = new Map(),
		jt = 0,
		It = -1,
		Ct = new Map(),
		St = new Set(),
		kt = new Map(),
		Ut = new Map(),
		Wt = new Set(),
		Xt = new Map(),
		Gt = new Map(),
		er = !1;
	function Jt() {
		if (
			((nt = o.history.listen((gt) => {
				let { action: xt, location: bt, delta: wt } = gt;
				if (er) {
					er = !1;
					return;
				}
				warning(
					Gt.size === 0 || wt != null,
					"You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL."
				);
				let Ot = Lr({ currentLocation: ut.location, nextLocation: bt, historyAction: xt });
				if (Ot && wt != null) {
					((er = !0),
						o.history.go(wt * -1),
						hr(Ot, {
							state: "blocked",
							location: bt,
							proceed() {
								(hr(Ot, { state: "proceeding", proceed: void 0, reset: void 0, location: bt }),
									o.history.go(wt));
							},
							reset() {
								let At = new Map(ut.blockers);
								(At.set(Ot, IDLE_BLOCKER), Ht({ blockers: At }));
							},
						}));
					return;
				}
				return nr(xt, bt);
			})),
			a)
		) {
			restoreAppliedTransitions(i, Rt);
			let gt = () => persistAppliedTransitions(i, Rt);
			(i.addEventListener("pagehide", gt), (vt = () => i.removeEventListener("pagehide", gt)));
		}
		return (ut.initialized || nr(Action.Pop, ut.location), ft);
	}
	function lr() {
		(nt && nt(),
			vt && vt(),
			it.clear(),
			mt && mt.abort(),
			ut.fetchers.forEach((gt, xt) => ir(xt)),
			ut.blockers.forEach((gt, xt) => jr(xt)));
	}
	function kr(gt) {
		return (it.add(gt), () => it.delete(gt));
	}
	function Ht(gt, xt) {
		ut = _extends$c({}, ut, gt);
		let bt = [],
			wt = [];
		(rt.v7_fetcherPersist &&
			ut.fetchers.forEach((Ot, At) => {
				Ot.state === "idle" && (Wt.has(At) ? wt.push(At) : bt.push(At));
			}),
			it.forEach((Ot) => Ot(ut, { deletedFetchers: wt, unstable_viewTransitionOpts: xt })),
			rt.v7_fetcherPersist &&
				(bt.forEach((Ot) => ut.fetchers.delete(Ot)), wt.forEach((Ot) => ir(Ot))));
	}
	function dr(gt, xt) {
		var bt, wt;
		let Ot =
				ut.actionData != null &&
				ut.navigation.formMethod != null &&
				isMutationMethod(ut.navigation.formMethod) &&
				ut.navigation.state === "loading" &&
				((bt = gt.state) == null ? void 0 : bt._isRedirect) !== !0,
			At;
		xt.actionData
			? Object.keys(xt.actionData).length > 0
				? (At = xt.actionData)
				: (At = null)
			: Ot
				? (At = ut.actionData)
				: (At = null);
		let Bt = xt.loaderData
				? mergeLoaderData(ut.loaderData, xt.loaderData, xt.matches || [], xt.errors)
				: ut.loaderData,
			Lt = ut.blockers;
		Lt.size > 0 && ((Lt = new Map(Lt)), Lt.forEach((qt, zt) => Lt.set(zt, IDLE_BLOCKER)));
		let Mt =
			yt === !0 ||
			(ut.navigation.formMethod != null &&
				isMutationMethod(ut.navigation.formMethod) &&
				((wt = gt.state) == null ? void 0 : wt._isRedirect) !== !0);
		(et && ((_e = et), (et = void 0)),
			Tt ||
				ht === Action.Pop ||
				(ht === Action.Push
					? o.history.push(gt, gt.state)
					: ht === Action.Replace && o.history.replace(gt, gt.state)));
		let Kt;
		if (ht === Action.Pop) {
			let qt = Rt.get(ut.location.pathname);
			qt && qt.has(gt.pathname)
				? (Kt = { currentLocation: ut.location, nextLocation: gt })
				: Rt.has(gt.pathname) && (Kt = { currentLocation: gt, nextLocation: ut.location });
		} else if (Et) {
			let qt = Rt.get(ut.location.pathname);
			(qt ? qt.add(gt.pathname) : ((qt = new Set([gt.pathname])), Rt.set(ut.location.pathname, qt)),
				(Kt = { currentLocation: ut.location, nextLocation: gt }));
		}
		(Ht(
			_extends$c({}, xt, {
				actionData: At,
				loaderData: Bt,
				historyAction: ht,
				location: gt,
				initialized: !0,
				navigation: IDLE_NAVIGATION,
				revalidation: "idle",
				restoreScrollPosition: Hr(gt, xt.matches || ut.matches),
				preventScrollReset: Mt,
				blockers: Lt,
			}),
			Kt
		),
			(ht = Action.Pop),
			(yt = !1),
			(Et = !1),
			(Tt = !1),
			(Pt = !1),
			(Dt = []),
			(Nt = []));
	}
	async function Rr(gt, xt) {
		if (typeof gt == "number") {
			o.history.go(gt);
			return;
		}
		let bt = normalizeTo(
				ut.location,
				ut.matches,
				tt,
				rt.v7_prependBasename,
				gt,
				xt == null ? void 0 : xt.fromRouteId,
				xt == null ? void 0 : xt.relative
			),
			{
				path: wt,
				submission: Ot,
				error: At,
			} = normalizeNavigateOptions(rt.v7_normalizeFormMethod, !1, bt, xt),
			Bt = ut.location,
			Lt = createLocation(ut.location, wt, xt && xt.state);
		Lt = _extends$c({}, Lt, o.history.encodeLocation(Lt));
		let Mt = xt && xt.replace != null ? xt.replace : void 0,
			Kt = Action.Push;
		Mt === !0
			? (Kt = Action.Replace)
			: Mt === !1 ||
				(Ot != null &&
					isMutationMethod(Ot.formMethod) &&
					Ot.formAction === ut.location.pathname + ut.location.search &&
					(Kt = Action.Replace));
		let qt = xt && "preventScrollReset" in xt ? xt.preventScrollReset === !0 : void 0,
			zt = Lr({ currentLocation: Bt, nextLocation: Lt, historyAction: Kt });
		if (zt) {
			hr(zt, {
				state: "blocked",
				location: Lt,
				proceed() {
					(hr(zt, { state: "proceeding", proceed: void 0, reset: void 0, location: Lt }),
						Rr(gt, xt));
				},
				reset() {
					let Qt = new Map(ut.blockers);
					(Qt.set(zt, IDLE_BLOCKER), Ht({ blockers: Qt }));
				},
			});
			return;
		}
		return await nr(Kt, Lt, {
			submission: Ot,
			pendingError: At,
			preventScrollReset: qt,
			replace: xt && xt.replace,
			enableViewTransition: xt && xt.unstable_viewTransition,
		});
	}
	function _r() {
		if ((vr(), Ht({ revalidation: "loading" }), ut.navigation.state !== "submitting")) {
			if (ut.navigation.state === "idle") {
				nr(ut.historyAction, ut.location, { startUninterruptedRevalidation: !0 });
				return;
			}
			nr(ht || ut.historyAction, ut.navigation.location, { overrideNavigation: ut.navigation });
		}
	}
	async function nr(gt, xt, bt) {
		(mt && mt.abort(),
			(mt = null),
			(ht = gt),
			(Tt = (bt && bt.startUninterruptedRevalidation) === !0),
			Qr(ut.location, ut.matches),
			(yt = (bt && bt.preventScrollReset) === !0),
			(Et = (bt && bt.enableViewTransition) === !0));
		let wt = et || _e,
			Ot = bt && bt.overrideNavigation,
			At = matchRoutes(wt, xt, tt);
		if (!At) {
			let Qt = getInternalRouterError(404, { pathname: xt.pathname }),
				{ matches: Zt, route: mr } = getShortCircuitMatches(wt);
			(Dr(), dr(xt, { matches: Zt, loaderData: {}, errors: { [mr.id]: Qt } }));
			return;
		}
		if (
			ut.initialized &&
			!Pt &&
			isHashChangeOnly(ut.location, xt) &&
			!(bt && bt.submission && isMutationMethod(bt.submission.formMethod))
		) {
			dr(xt, { matches: At });
			return;
		}
		mt = new AbortController();
		let Bt = createClientSideRequest(o.history, xt, mt.signal, bt && bt.submission),
			Lt,
			Mt;
		if (bt && bt.pendingError) Mt = { [findNearestBoundary(At).route.id]: bt.pendingError };
		else if (bt && bt.submission && isMutationMethod(bt.submission.formMethod)) {
			let Qt = await Pr(Bt, xt, bt.submission, At, { replace: bt.replace });
			if (Qt.shortCircuited) return;
			((Lt = Qt.pendingActionData),
				(Mt = Qt.pendingActionError),
				(Ot = getLoadingNavigation(xt, bt.submission)),
				(Bt = new Request(Bt.url, { signal: Bt.signal })));
		}
		let {
			shortCircuited: Kt,
			loaderData: qt,
			errors: zt,
		} = await Mr(
			Bt,
			xt,
			At,
			Ot,
			bt && bt.submission,
			bt && bt.fetcherSubmission,
			bt && bt.replace,
			Lt,
			Mt
		);
		Kt ||
			((mt = null),
			dr(
				xt,
				_extends$c({ matches: At }, Lt ? { actionData: Lt } : {}, { loaderData: qt, errors: zt })
			));
	}
	async function Pr(gt, xt, bt, wt, Ot) {
		(Ot === void 0 && (Ot = {}), vr());
		let At = getSubmittingNavigation(xt, bt);
		Ht({ navigation: At });
		let Bt,
			Lt = getTargetMatch(wt, xt);
		if (!Lt.route.action && !Lt.route.lazy)
			Bt = {
				type: ResultType.error,
				error: getInternalRouterError(405, {
					method: gt.method,
					pathname: xt.pathname,
					routeId: Lt.route.id,
				}),
			};
		else if (((Bt = await callLoaderOrAction("action", gt, Lt, wt, j, $, tt)), gt.signal.aborted))
			return { shortCircuited: !0 };
		if (isRedirectResult(Bt)) {
			let Mt;
			return (
				Ot && Ot.replace != null
					? (Mt = Ot.replace)
					: (Mt = Bt.location === ut.location.pathname + ut.location.search),
				await or(ut, Bt, { submission: bt, replace: Mt }),
				{ shortCircuited: !0 }
			);
		}
		if (isErrorResult(Bt)) {
			let Mt = findNearestBoundary(wt, Lt.route.id);
			return (
				(Ot && Ot.replace) !== !0 && (ht = Action.Push),
				{ pendingActionData: {}, pendingActionError: { [Mt.route.id]: Bt.error } }
			);
		}
		if (isDeferredResult(Bt)) throw getInternalRouterError(400, { type: "defer-action" });
		return { pendingActionData: { [Lt.route.id]: Bt.data } };
	}
	async function Mr(gt, xt, bt, wt, Ot, At, Bt, Lt, Mt) {
		let Kt = wt || getLoadingNavigation(xt, Ot),
			qt = Ot || At || getSubmissionFromNavigation(Kt),
			zt = et || _e,
			[Qt, Zt] = getMatchesToLoad(o.history, ut, bt, qt, xt, Pt, Dt, Nt, kt, St, zt, tt, Lt, Mt);
		if (
			(Dr(
				(Vt) =>
					!(bt && bt.some((tr) => tr.route.id === Vt)) ||
					(Qt && Qt.some((tr) => tr.route.id === Vt))
			),
			(It = ++jt),
			Qt.length === 0 && Zt.length === 0)
		) {
			let Vt = $r();
			return (
				dr(
					xt,
					_extends$c(
						{ matches: bt, loaderData: {}, errors: Mt || null },
						Lt ? { actionData: Lt } : {},
						Vt ? { fetchers: new Map(ut.fetchers) } : {}
					)
				),
				{ shortCircuited: !0 }
			);
		}
		if (!Tt) {
			Zt.forEach((tr) => {
				let cr = ut.fetchers.get(tr.key),
					Yt = getLoadingFetcher(void 0, cr ? cr.data : void 0);
				ut.fetchers.set(tr.key, Yt);
			});
			let Vt = Lt || ut.actionData;
			Ht(
				_extends$c(
					{ navigation: Kt },
					Vt ? (Object.keys(Vt).length === 0 ? { actionData: null } : { actionData: Vt }) : {},
					Zt.length > 0 ? { fetchers: new Map(ut.fetchers) } : {}
				)
			);
		}
		Zt.forEach((Vt) => {
			($t.has(Vt.key) && rr(Vt.key), Vt.controller && $t.set(Vt.key, Vt.controller));
		});
		let mr = () => Zt.forEach((Vt) => rr(Vt.key));
		mt && mt.signal.addEventListener("abort", mr);
		let {
			results: gr,
			loaderResults: br,
			fetcherResults: Nr,
		} = await yr(ut.matches, bt, Qt, Zt, gt);
		if (gt.signal.aborted) return { shortCircuited: !0 };
		(mt && mt.signal.removeEventListener("abort", mr), Zt.forEach((Vt) => $t.delete(Vt.key)));
		let ar = findRedirect(gr);
		if (ar) {
			if (ar.idx >= Qt.length) {
				let Vt = Zt[ar.idx - Qt.length].key;
				St.add(Vt);
			}
			return (await or(ut, ar.result, { replace: Bt }), { shortCircuited: !0 });
		}
		let { loaderData: ur, errors: Tr } = processLoaderData(ut, bt, Qt, br, Mt, Zt, Nr, Xt);
		Xt.forEach((Vt, tr) => {
			Vt.subscribe((cr) => {
				(cr || Vt.done) && Xt.delete(tr);
			});
		});
		let Fr = $r(),
			Br = Ft(It),
			zr = Fr || Br || Zt.length > 0;
		return _extends$c({ loaderData: ur, errors: Tr }, zr ? { fetchers: new Map(ut.fetchers) } : {});
	}
	function Sr(gt) {
		return (
			rt.v7_fetcherPersist && (Ut.set(gt, (Ut.get(gt) || 0) + 1), Wt.has(gt) && Wt.delete(gt)),
			ut.fetchers.get(gt) || IDLE_FETCHER
		);
	}
	function Or(gt, xt, bt, wt) {
		if (s)
			throw new Error(
				"router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback."
			);
		$t.has(gt) && rr(gt);
		let Ot = et || _e,
			At = normalizeTo(
				ut.location,
				ut.matches,
				tt,
				rt.v7_prependBasename,
				bt,
				xt,
				wt == null ? void 0 : wt.relative
			),
			Bt = matchRoutes(Ot, At, tt);
		if (!Bt) {
			fr(gt, xt, getInternalRouterError(404, { pathname: At }));
			return;
		}
		let {
			path: Lt,
			submission: Mt,
			error: Kt,
		} = normalizeNavigateOptions(rt.v7_normalizeFormMethod, !0, At, wt);
		if (Kt) {
			fr(gt, xt, Kt);
			return;
		}
		let qt = getTargetMatch(Bt, Lt);
		if (((yt = (wt && wt.preventScrollReset) === !0), Mt && isMutationMethod(Mt.formMethod))) {
			Ir(gt, xt, Lt, qt, Bt, Mt);
			return;
		}
		(kt.set(gt, { routeId: xt, path: Lt }), Ar(gt, xt, Lt, qt, Bt, Mt));
	}
	async function Ir(gt, xt, bt, wt, Ot, At) {
		if ((vr(), kt.delete(gt), !wt.route.action && !wt.route.lazy)) {
			let Yt = getInternalRouterError(405, { method: At.formMethod, pathname: bt, routeId: xt });
			fr(gt, xt, Yt);
			return;
		}
		let Bt = ut.fetchers.get(gt),
			Lt = getSubmittingFetcher(At, Bt);
		(ut.fetchers.set(gt, Lt), Ht({ fetchers: new Map(ut.fetchers) }));
		let Mt = new AbortController(),
			Kt = createClientSideRequest(o.history, bt, Mt.signal, At);
		$t.set(gt, Mt);
		let qt = jt,
			zt = await callLoaderOrAction("action", Kt, wt, Ot, j, $, tt);
		if (Kt.signal.aborted) {
			$t.get(gt) === Mt && $t.delete(gt);
			return;
		}
		if (Wt.has(gt)) {
			(ut.fetchers.set(gt, getDoneFetcher(void 0)), Ht({ fetchers: new Map(ut.fetchers) }));
			return;
		}
		if (isRedirectResult(zt))
			if (($t.delete(gt), It > qt)) {
				let Yt = getDoneFetcher(void 0);
				(ut.fetchers.set(gt, Yt), Ht({ fetchers: new Map(ut.fetchers) }));
				return;
			} else {
				St.add(gt);
				let Yt = getLoadingFetcher(At);
				return (
					ut.fetchers.set(gt, Yt),
					Ht({ fetchers: new Map(ut.fetchers) }),
					or(ut, zt, { fetcherSubmission: At })
				);
			}
		if (isErrorResult(zt)) {
			fr(gt, xt, zt.error);
			return;
		}
		if (isDeferredResult(zt)) throw getInternalRouterError(400, { type: "defer-action" });
		let Qt = ut.navigation.location || ut.location,
			Zt = createClientSideRequest(o.history, Qt, Mt.signal),
			mr = et || _e,
			gr =
				ut.navigation.state !== "idle" ? matchRoutes(mr, ut.navigation.location, tt) : ut.matches;
		invariant(gr, "Didn't find any matches after fetcher action");
		let br = ++jt;
		Ct.set(gt, br);
		let Nr = getLoadingFetcher(At, zt.data);
		ut.fetchers.set(gt, Nr);
		let [ar, ur] = getMatchesToLoad(
			o.history,
			ut,
			gr,
			At,
			Qt,
			Pt,
			Dt,
			Nt,
			kt,
			St,
			mr,
			tt,
			{ [wt.route.id]: zt.data },
			void 0
		);
		(ur
			.filter((Yt) => Yt.key !== gt)
			.forEach((Yt) => {
				let Cr = Yt.key,
					Vr = ut.fetchers.get(Cr),
					qr = getLoadingFetcher(void 0, Vr ? Vr.data : void 0);
				(ut.fetchers.set(Cr, qr), $t.has(Cr) && rr(Cr), Yt.controller && $t.set(Cr, Yt.controller));
			}),
			Ht({ fetchers: new Map(ut.fetchers) }));
		let Tr = () => ur.forEach((Yt) => rr(Yt.key));
		Mt.signal.addEventListener("abort", Tr);
		let {
			results: Fr,
			loaderResults: Br,
			fetcherResults: zr,
		} = await yr(ut.matches, gr, ar, ur, Zt);
		if (Mt.signal.aborted) return;
		(Mt.signal.removeEventListener("abort", Tr),
			Ct.delete(gt),
			$t.delete(gt),
			ur.forEach((Yt) => $t.delete(Yt.key)));
		let Vt = findRedirect(Fr);
		if (Vt) {
			if (Vt.idx >= ar.length) {
				let Yt = ur[Vt.idx - ar.length].key;
				St.add(Yt);
			}
			return or(ut, Vt.result);
		}
		let { loaderData: tr, errors: cr } = processLoaderData(
			ut,
			ut.matches,
			ar,
			Br,
			void 0,
			ur,
			zr,
			Xt
		);
		if (ut.fetchers.has(gt)) {
			let Yt = getDoneFetcher(zt.data);
			ut.fetchers.set(gt, Yt);
		}
		(Ft(br),
			ut.navigation.state === "loading" && br > It
				? (invariant(ht, "Expected pending action"),
					mt && mt.abort(),
					dr(ut.navigation.location, {
						matches: gr,
						loaderData: tr,
						errors: cr,
						fetchers: new Map(ut.fetchers),
					}))
				: (Ht({
						errors: cr,
						loaderData: mergeLoaderData(ut.loaderData, tr, gr, cr),
						fetchers: new Map(ut.fetchers),
					}),
					(Pt = !1)));
	}
	async function Ar(gt, xt, bt, wt, Ot, At) {
		let Bt = ut.fetchers.get(gt),
			Lt = getLoadingFetcher(At, Bt ? Bt.data : void 0);
		(ut.fetchers.set(gt, Lt), Ht({ fetchers: new Map(ut.fetchers) }));
		let Mt = new AbortController(),
			Kt = createClientSideRequest(o.history, bt, Mt.signal);
		$t.set(gt, Mt);
		let qt = jt,
			zt = await callLoaderOrAction("loader", Kt, wt, Ot, j, $, tt);
		if (
			(isDeferredResult(zt) && (zt = (await resolveDeferredData(zt, Kt.signal, !0)) || zt),
			$t.get(gt) === Mt && $t.delete(gt),
			Kt.signal.aborted)
		)
			return;
		if (Wt.has(gt)) {
			(ut.fetchers.set(gt, getDoneFetcher(void 0)), Ht({ fetchers: new Map(ut.fetchers) }));
			return;
		}
		if (isRedirectResult(zt))
			if (It > qt) {
				let Zt = getDoneFetcher(void 0);
				(ut.fetchers.set(gt, Zt), Ht({ fetchers: new Map(ut.fetchers) }));
				return;
			} else {
				(St.add(gt), await or(ut, zt));
				return;
			}
		if (isErrorResult(zt)) {
			fr(gt, xt, zt.error);
			return;
		}
		invariant(!isDeferredResult(zt), "Unhandled fetcher deferred data");
		let Qt = getDoneFetcher(zt.data);
		(ut.fetchers.set(gt, Qt), Ht({ fetchers: new Map(ut.fetchers) }));
	}
	async function or(gt, xt, bt) {
		let { submission: wt, fetcherSubmission: Ot, replace: At } = bt === void 0 ? {} : bt;
		xt.revalidate && (Pt = !0);
		let Bt = createLocation(gt.location, xt.location, { _isRedirect: !0 });
		if ((invariant(Bt, "Expected a location on the redirect navigation"), a)) {
			let Qt = !1;
			if (xt.reloadDocument) Qt = !0;
			else if (ABSOLUTE_URL_REGEX$1.test(xt.location)) {
				const Zt = o.history.createURL(xt.location);
				Qt = Zt.origin !== i.location.origin || stripBasename(Zt.pathname, tt) == null;
			}
			if (Qt) {
				At ? i.location.replace(xt.location) : i.location.assign(xt.location);
				return;
			}
		}
		mt = null;
		let Lt = At === !0 ? Action.Replace : Action.Push,
			{ formMethod: Mt, formAction: Kt, formEncType: qt } = gt.navigation;
		!wt && !Ot && Mt && Kt && qt && (wt = getSubmissionFromNavigation(gt.navigation));
		let zt = wt || Ot;
		if (redirectPreserveMethodStatusCodes.has(xt.status) && zt && isMutationMethod(zt.formMethod))
			await nr(Lt, Bt, {
				submission: _extends$c({}, zt, { formAction: xt.location }),
				preventScrollReset: yt,
			});
		else {
			let Qt = getLoadingNavigation(Bt, wt);
			await nr(Lt, Bt, { overrideNavigation: Qt, fetcherSubmission: Ot, preventScrollReset: yt });
		}
	}
	async function yr(gt, xt, bt, wt, Ot) {
		let At = await Promise.all([
				...bt.map((Mt) => callLoaderOrAction("loader", Ot, Mt, xt, j, $, tt)),
				...wt.map((Mt) =>
					Mt.matches && Mt.match && Mt.controller
						? callLoaderOrAction(
								"loader",
								createClientSideRequest(o.history, Mt.path, Mt.controller.signal),
								Mt.match,
								Mt.matches,
								j,
								$,
								tt
							)
						: { type: ResultType.error, error: getInternalRouterError(404, { pathname: Mt.path }) }
				),
			]),
			Bt = At.slice(0, bt.length),
			Lt = At.slice(bt.length);
		return (
			await Promise.all([
				resolveDeferredResults(
					gt,
					bt,
					Bt,
					Bt.map(() => Ot.signal),
					!1,
					ut.loaderData
				),
				resolveDeferredResults(
					gt,
					wt.map((Mt) => Mt.match),
					Lt,
					wt.map((Mt) => (Mt.controller ? Mt.controller.signal : null)),
					!0
				),
			]),
			{ results: At, loaderResults: Bt, fetcherResults: Lt }
		);
	}
	function vr() {
		((Pt = !0),
			Dt.push(...Dr()),
			kt.forEach((gt, xt) => {
				$t.has(xt) && (Nt.push(xt), rr(xt));
			}));
	}
	function fr(gt, xt, bt) {
		let wt = findNearestBoundary(ut.matches, xt);
		(ir(gt), Ht({ errors: { [wt.route.id]: bt }, fetchers: new Map(ut.fetchers) }));
	}
	function ir(gt) {
		let xt = ut.fetchers.get(gt);
		($t.has(gt) && !(xt && xt.state === "loading" && Ct.has(gt)) && rr(gt),
			kt.delete(gt),
			Ct.delete(gt),
			St.delete(gt),
			Wt.delete(gt),
			ut.fetchers.delete(gt));
	}
	function pr(gt) {
		if (rt.v7_fetcherPersist) {
			let xt = (Ut.get(gt) || 0) - 1;
			xt <= 0 ? (Ut.delete(gt), Wt.add(gt)) : Ut.set(gt, xt);
		} else ir(gt);
		Ht({ fetchers: new Map(ut.fetchers) });
	}
	function rr(gt) {
		let xt = $t.get(gt);
		(invariant(xt, "Expected fetch controller: " + gt), xt.abort(), $t.delete(gt));
	}
	function Er(gt) {
		for (let xt of gt) {
			let bt = Sr(xt),
				wt = getDoneFetcher(bt.data);
			ut.fetchers.set(xt, wt);
		}
	}
	function $r() {
		let gt = [],
			xt = !1;
		for (let bt of St) {
			let wt = ut.fetchers.get(bt);
			(invariant(wt, "Expected fetcher: " + bt),
				wt.state === "loading" && (St.delete(bt), gt.push(bt), (xt = !0)));
		}
		return (Er(gt), xt);
	}
	function Ft(gt) {
		let xt = [];
		for (let [bt, wt] of Ct)
			if (wt < gt) {
				let Ot = ut.fetchers.get(bt);
				(invariant(Ot, "Expected fetcher: " + bt),
					Ot.state === "loading" && (rr(bt), Ct.delete(bt), xt.push(bt)));
			}
		return (Er(xt), xt.length > 0);
	}
	function wr(gt, xt) {
		let bt = ut.blockers.get(gt) || IDLE_BLOCKER;
		return (Gt.get(gt) !== xt && Gt.set(gt, xt), bt);
	}
	function jr(gt) {
		(ut.blockers.delete(gt), Gt.delete(gt));
	}
	function hr(gt, xt) {
		let bt = ut.blockers.get(gt) || IDLE_BLOCKER;
		invariant(
			(bt.state === "unblocked" && xt.state === "blocked") ||
				(bt.state === "blocked" && xt.state === "blocked") ||
				(bt.state === "blocked" && xt.state === "proceeding") ||
				(bt.state === "blocked" && xt.state === "unblocked") ||
				(bt.state === "proceeding" && xt.state === "unblocked"),
			"Invalid blocker state transition: " + bt.state + " -> " + xt.state
		);
		let wt = new Map(ut.blockers);
		(wt.set(gt, xt), Ht({ blockers: wt }));
	}
	function Lr(gt) {
		let { currentLocation: xt, nextLocation: bt, historyAction: wt } = gt;
		if (Gt.size === 0) return;
		Gt.size > 1 && warning(!1, "A router only supports one blocker at a time");
		let Ot = Array.from(Gt.entries()),
			[At, Bt] = Ot[Ot.length - 1],
			Lt = ut.blockers.get(At);
		if (
			!(Lt && Lt.state === "proceeding") &&
			Bt({ currentLocation: xt, nextLocation: bt, historyAction: wt })
		)
			return At;
	}
	function Dr(gt) {
		let xt = [];
		return (
			Xt.forEach((bt, wt) => {
				(!gt || gt(wt)) && (bt.cancel(), xt.push(wt), Xt.delete(wt));
			}),
			xt
		);
	}
	function Kr(gt, xt, bt) {
		if (((ot = gt), (lt = xt), (st = bt || null), !dt && ut.navigation === IDLE_NAVIGATION)) {
			dt = !0;
			let wt = Hr(ut.location, ut.matches);
			wt != null && Ht({ restoreScrollPosition: wt });
		}
		return () => {
			((ot = null), (lt = null), (st = null));
		};
	}
	function Wr(gt, xt) {
		return (
			(st &&
				st(
					gt,
					xt.map((wt) => convertRouteMatchToUiMatch(wt, ut.loaderData))
				)) ||
			gt.key
		);
	}
	function Qr(gt, xt) {
		if (ot && lt) {
			let bt = Wr(gt, xt);
			ot[bt] = lt();
		}
	}
	function Hr(gt, xt) {
		if (ot) {
			let bt = Wr(gt, xt),
				wt = ot[bt];
			if (typeof wt == "number") return wt;
		}
		return null;
	}
	function Gr(gt) {
		((j = {}), (et = convertRoutesToDataRoutes(gt, $, void 0, j)));
	}
	return (
		(ft = {
			get basename() {
				return tt;
			},
			get state() {
				return ut;
			},
			get routes() {
				return _e;
			},
			get window() {
				return i;
			},
			initialize: Jt,
			subscribe: kr,
			enableScrollRestoration: Kr,
			navigate: Rr,
			fetch: Or,
			revalidate: _r,
			createHref: (gt) => o.history.createHref(gt),
			encodeLocation: (gt) => o.history.encodeLocation(gt),
			getFetcher: Sr,
			deleteFetcher: pr,
			dispose: lr,
			getBlocker: wr,
			deleteBlocker: jr,
			_internalFetchControllers: $t,
			_internalActiveDeferreds: Xt,
			_internalSetRoutes: Gr,
		}),
		ft
	);
}
function isSubmissionNavigation(o) {
	return (
		o != null && (("formData" in o && o.formData != null) || ("body" in o && o.body !== void 0))
	);
}
function normalizeTo(o, i, a, s, $, j, _e) {
	let et, tt;
	if (j != null && _e !== "path") {
		et = [];
		for (let nt of i)
			if ((et.push(nt), nt.route.id === j)) {
				tt = nt;
				break;
			}
	} else ((et = i), (tt = i[i.length - 1]));
	let rt = resolveTo(
		$ || ".",
		getPathContributingMatches(et).map((nt) => nt.pathnameBase),
		stripBasename(o.pathname, a) || o.pathname,
		_e === "path"
	);
	return (
		$ == null && ((rt.search = o.search), (rt.hash = o.hash)),
		($ == null || $ === "" || $ === ".") &&
			tt &&
			tt.route.index &&
			!hasNakedIndexQuery(rt.search) &&
			(rt.search = rt.search ? rt.search.replace(/^\?/, "?index&") : "?index"),
		s && a !== "/" && (rt.pathname = rt.pathname === "/" ? a : joinPaths([a, rt.pathname])),
		createPath(rt)
	);
}
function normalizeNavigateOptions(o, i, a, s) {
	if (!s || !isSubmissionNavigation(s)) return { path: a };
	if (s.formMethod && !isValidMethod(s.formMethod))
		return { path: a, error: getInternalRouterError(405, { method: s.formMethod }) };
	let $ = () => ({ path: a, error: getInternalRouterError(400, { type: "invalid-body" }) }),
		j = s.formMethod || "get",
		_e = o ? j.toUpperCase() : j.toLowerCase(),
		et = stripHashFromPath(a);
	if (s.body !== void 0) {
		if (s.formEncType === "text/plain") {
			if (!isMutationMethod(_e)) return $();
			let ot =
				typeof s.body == "string"
					? s.body
					: s.body instanceof FormData || s.body instanceof URLSearchParams
						? Array.from(s.body.entries()).reduce((st, lt) => {
								let [dt, pt] = lt;
								return (
									"" +
									st +
									dt +
									"=" +
									pt +
									`
`
								);
							}, "")
						: String(s.body);
			return {
				path: a,
				submission: {
					formMethod: _e,
					formAction: et,
					formEncType: s.formEncType,
					formData: void 0,
					json: void 0,
					text: ot,
				},
			};
		} else if (s.formEncType === "application/json") {
			if (!isMutationMethod(_e)) return $();
			try {
				let ot = typeof s.body == "string" ? JSON.parse(s.body) : s.body;
				return {
					path: a,
					submission: {
						formMethod: _e,
						formAction: et,
						formEncType: s.formEncType,
						formData: void 0,
						json: ot,
						text: void 0,
					},
				};
			} catch {
				return $();
			}
		}
	}
	invariant(typeof FormData == "function", "FormData is not available in this environment");
	let tt, rt;
	if (s.formData) ((tt = convertFormDataToSearchParams(s.formData)), (rt = s.formData));
	else if (s.body instanceof FormData)
		((tt = convertFormDataToSearchParams(s.body)), (rt = s.body));
	else if (s.body instanceof URLSearchParams)
		((tt = s.body), (rt = convertSearchParamsToFormData(tt)));
	else if (s.body == null) ((tt = new URLSearchParams()), (rt = new FormData()));
	else
		try {
			((tt = new URLSearchParams(s.body)), (rt = convertSearchParamsToFormData(tt)));
		} catch {
			return $();
		}
	let nt = {
		formMethod: _e,
		formAction: et,
		formEncType: (s && s.formEncType) || "application/x-www-form-urlencoded",
		formData: rt,
		json: void 0,
		text: void 0,
	};
	if (isMutationMethod(nt.formMethod)) return { path: a, submission: nt };
	let it = parsePath(a);
	return (
		i && it.search && hasNakedIndexQuery(it.search) && tt.append("index", ""),
		(it.search = "?" + tt),
		{ path: createPath(it), submission: nt }
	);
}
function getLoaderMatchesUntilBoundary(o, i) {
	let a = o;
	if (i) {
		let s = o.findIndex(($) => $.route.id === i);
		s >= 0 && (a = o.slice(0, s));
	}
	return a;
}
function getMatchesToLoad(o, i, a, s, $, j, _e, et, tt, rt, nt, it, ot, st) {
	let lt = st ? Object.values(st)[0] : ot ? Object.values(ot)[0] : void 0,
		dt = o.createURL(i.location),
		pt = o.createURL($),
		ct = st ? Object.keys(st)[0] : void 0,
		ft = getLoaderMatchesUntilBoundary(a, ct).filter((ht, yt) => {
			if (ht.route.lazy) return !0;
			if (ht.route.loader == null) return !1;
			if (isNewLoader(i.loaderData, i.matches[yt], ht) || _e.some((Rt) => Rt === ht.route.id))
				return !0;
			let mt = i.matches[yt],
				Et = ht;
			return shouldRevalidateLoader(
				ht,
				_extends$c(
					{ currentUrl: dt, currentParams: mt.params, nextUrl: pt, nextParams: Et.params },
					s,
					{
						actionResult: lt,
						defaultShouldRevalidate:
							j ||
							dt.pathname + dt.search === pt.pathname + pt.search ||
							dt.search !== pt.search ||
							isNewRouteInstance(mt, Et),
					}
				)
			);
		}),
		ut = [];
	return (
		tt.forEach((ht, yt) => {
			if (!a.some((Tt) => Tt.route.id === ht.routeId)) return;
			let mt = matchRoutes(nt, ht.path, it);
			if (!mt) {
				ut.push({
					key: yt,
					routeId: ht.routeId,
					path: ht.path,
					matches: null,
					match: null,
					controller: null,
				});
				return;
			}
			let Et = i.fetchers.get(yt),
				Rt = getTargetMatch(mt, ht.path),
				vt = !1;
			(rt.has(yt)
				? (vt = !1)
				: et.includes(yt)
					? (vt = !0)
					: Et && Et.state !== "idle" && Et.data === void 0
						? (vt = j)
						: (vt = shouldRevalidateLoader(
								Rt,
								_extends$c(
									{
										currentUrl: dt,
										currentParams: i.matches[i.matches.length - 1].params,
										nextUrl: pt,
										nextParams: a[a.length - 1].params,
									},
									s,
									{ actionResult: lt, defaultShouldRevalidate: j }
								)
							)),
				vt &&
					ut.push({
						key: yt,
						routeId: ht.routeId,
						path: ht.path,
						matches: mt,
						match: Rt,
						controller: new AbortController(),
					}));
		}),
		[ft, ut]
	);
}
function isNewLoader(o, i, a) {
	let s = !i || a.route.id !== i.route.id,
		$ = o[a.route.id] === void 0;
	return s || $;
}
function isNewRouteInstance(o, i) {
	let a = o.route.path;
	return (
		o.pathname !== i.pathname || (a != null && a.endsWith("*") && o.params["*"] !== i.params["*"])
	);
}
function shouldRevalidateLoader(o, i) {
	if (o.route.shouldRevalidate) {
		let a = o.route.shouldRevalidate(i);
		if (typeof a == "boolean") return a;
	}
	return i.defaultShouldRevalidate;
}
async function loadLazyRouteModule(o, i, a) {
	if (!o.lazy) return;
	let s = await o.lazy();
	if (!o.lazy) return;
	let $ = a[o.id];
	invariant($, "No route found in manifest");
	let j = {};
	for (let _e in s) {
		let tt = $[_e] !== void 0 && _e !== "hasErrorBoundary";
		(warning(
			!tt,
			'Route "' +
				$.id +
				'" has a static property "' +
				_e +
				'" defined but its lazy function is also returning a value for this property. ' +
				('The lazy route property "' + _e + '" will be ignored.')
		),
			!tt && !immutableRouteKeys.has(_e) && (j[_e] = s[_e]));
	}
	(Object.assign($, j), Object.assign($, _extends$c({}, i($), { lazy: void 0 })));
}
async function callLoaderOrAction(o, i, a, s, $, j, _e, et) {
	et === void 0 && (et = {});
	let tt,
		rt,
		nt,
		it = (lt) => {
			let dt,
				pt = new Promise((ct, at) => (dt = at));
			return (
				(nt = () => dt()),
				i.signal.addEventListener("abort", nt),
				Promise.race([lt({ request: i, params: a.params, context: et.requestContext }), pt])
			);
		};
	try {
		let lt = a.route[o];
		if (a.route.lazy)
			if (lt) {
				let dt,
					pt = await Promise.all([
						it(lt).catch((ct) => {
							dt = ct;
						}),
						loadLazyRouteModule(a.route, j, $),
					]);
				if (dt) throw dt;
				rt = pt[0];
			} else if ((await loadLazyRouteModule(a.route, j, $), (lt = a.route[o]), lt))
				rt = await it(lt);
			else if (o === "action") {
				let dt = new URL(i.url),
					pt = dt.pathname + dt.search;
				throw getInternalRouterError(405, { method: i.method, pathname: pt, routeId: a.route.id });
			} else return { type: ResultType.data, data: void 0 };
		else if (lt) rt = await it(lt);
		else {
			let dt = new URL(i.url),
				pt = dt.pathname + dt.search;
			throw getInternalRouterError(404, { pathname: pt });
		}
		invariant(
			rt !== void 0,
			"You defined " +
				(o === "action" ? "an action" : "a loader") +
				" for route " +
				('"' + a.route.id + "\" but didn't return anything from your `" + o + "` ") +
				"function. Please return a value or `null`."
		);
	} catch (lt) {
		((tt = ResultType.error), (rt = lt));
	} finally {
		nt && i.signal.removeEventListener("abort", nt);
	}
	if (isResponse(rt)) {
		let lt = rt.status;
		if (redirectStatusCodes.has(lt)) {
			let ct = rt.headers.get("Location");
			if (
				(invariant(
					ct,
					"Redirects returned/thrown from loaders/actions must have a Location header"
				),
				!ABSOLUTE_URL_REGEX$1.test(ct))
			)
				ct = normalizeTo(new URL(i.url), s.slice(0, s.indexOf(a) + 1), _e, !0, ct);
			else if (!et.isStaticRequest) {
				let at = new URL(i.url),
					ft = ct.startsWith("//") ? new URL(at.protocol + ct) : new URL(ct),
					ut = stripBasename(ft.pathname, _e) != null;
				ft.origin === at.origin && ut && (ct = ft.pathname + ft.search + ft.hash);
			}
			if (et.isStaticRequest) throw (rt.headers.set("Location", ct), rt);
			return {
				type: ResultType.redirect,
				status: lt,
				location: ct,
				revalidate: rt.headers.get("X-Remix-Revalidate") !== null,
				reloadDocument: rt.headers.get("X-Remix-Reload-Document") !== null,
			};
		}
		if (et.isRouteRequest)
			throw { type: tt === ResultType.error ? ResultType.error : ResultType.data, response: rt };
		let dt,
			pt = rt.headers.get("Content-Type");
		return (
			pt && /\bapplication\/json\b/.test(pt) ? (dt = await rt.json()) : (dt = await rt.text()),
			tt === ResultType.error
				? { type: tt, error: new ErrorResponseImpl(lt, rt.statusText, dt), headers: rt.headers }
				: { type: ResultType.data, data: dt, statusCode: rt.status, headers: rt.headers }
		);
	}
	if (tt === ResultType.error) return { type: tt, error: rt };
	if (isDeferredData(rt)) {
		var ot, st;
		return {
			type: ResultType.deferred,
			deferredData: rt,
			statusCode: (ot = rt.init) == null ? void 0 : ot.status,
			headers: ((st = rt.init) == null ? void 0 : st.headers) && new Headers(rt.init.headers),
		};
	}
	return { type: ResultType.data, data: rt };
}
function createClientSideRequest(o, i, a, s) {
	let $ = o.createURL(stripHashFromPath(i)).toString(),
		j = { signal: a };
	if (s && isMutationMethod(s.formMethod)) {
		let { formMethod: _e, formEncType: et } = s;
		((j.method = _e.toUpperCase()),
			et === "application/json"
				? ((j.headers = new Headers({ "Content-Type": et })), (j.body = JSON.stringify(s.json)))
				: et === "text/plain"
					? (j.body = s.text)
					: et === "application/x-www-form-urlencoded" && s.formData
						? (j.body = convertFormDataToSearchParams(s.formData))
						: (j.body = s.formData));
	}
	return new Request($, j);
}
function convertFormDataToSearchParams(o) {
	let i = new URLSearchParams();
	for (let [a, s] of o.entries()) i.append(a, typeof s == "string" ? s : s.name);
	return i;
}
function convertSearchParamsToFormData(o) {
	let i = new FormData();
	for (let [a, s] of o.entries()) i.append(a, s);
	return i;
}
function processRouteLoaderData(o, i, a, s, $) {
	let j = {},
		_e = null,
		et,
		tt = !1,
		rt = {};
	return (
		a.forEach((nt, it) => {
			let ot = i[it].route.id;
			if (
				(invariant(!isRedirectResult(nt), "Cannot handle redirect results in processLoaderData"),
				isErrorResult(nt))
			) {
				let st = findNearestBoundary(o, ot),
					lt = nt.error;
				(s && ((lt = Object.values(s)[0]), (s = void 0)),
					(_e = _e || {}),
					_e[st.route.id] == null && (_e[st.route.id] = lt),
					(j[ot] = void 0),
					tt || ((tt = !0), (et = isRouteErrorResponse(nt.error) ? nt.error.status : 500)),
					nt.headers && (rt[ot] = nt.headers));
			} else
				(isDeferredResult(nt)
					? ($.set(ot, nt.deferredData), (j[ot] = nt.deferredData.data))
					: (j[ot] = nt.data),
					nt.statusCode != null && nt.statusCode !== 200 && !tt && (et = nt.statusCode),
					nt.headers && (rt[ot] = nt.headers));
		}),
		s && ((_e = s), (j[Object.keys(s)[0]] = void 0)),
		{ loaderData: j, errors: _e, statusCode: et || 200, loaderHeaders: rt }
	);
}
function processLoaderData(o, i, a, s, $, j, _e, et) {
	let { loaderData: tt, errors: rt } = processRouteLoaderData(i, a, s, $, et);
	for (let nt = 0; nt < j.length; nt++) {
		let { key: it, match: ot, controller: st } = j[nt];
		invariant(_e !== void 0 && _e[nt] !== void 0, "Did not find corresponding fetcher result");
		let lt = _e[nt];
		if (!(st && st.signal.aborted))
			if (isErrorResult(lt)) {
				let dt = findNearestBoundary(o.matches, ot == null ? void 0 : ot.route.id);
				((rt && rt[dt.route.id]) || (rt = _extends$c({}, rt, { [dt.route.id]: lt.error })),
					o.fetchers.delete(it));
			} else if (isRedirectResult(lt)) invariant(!1, "Unhandled fetcher revalidation redirect");
			else if (isDeferredResult(lt)) invariant(!1, "Unhandled fetcher deferred data");
			else {
				let dt = getDoneFetcher(lt.data);
				o.fetchers.set(it, dt);
			}
	}
	return { loaderData: tt, errors: rt };
}
function mergeLoaderData(o, i, a, s) {
	let $ = _extends$c({}, i);
	for (let j of a) {
		let _e = j.route.id;
		if (
			(i.hasOwnProperty(_e)
				? i[_e] !== void 0 && ($[_e] = i[_e])
				: o[_e] !== void 0 && j.route.loader && ($[_e] = o[_e]),
			s && s.hasOwnProperty(_e))
		)
			break;
	}
	return $;
}
function findNearestBoundary(o, i) {
	return (
		(i ? o.slice(0, o.findIndex((s) => s.route.id === i) + 1) : [...o])
			.reverse()
			.find((s) => s.route.hasErrorBoundary === !0) || o[0]
	);
}
function getShortCircuitMatches(o) {
	let i =
		o.length === 1
			? o[0]
			: o.find((a) => a.index || !a.path || a.path === "/") || { id: "__shim-error-route__" };
	return { matches: [{ params: {}, pathname: "", pathnameBase: "", route: i }], route: i };
}
function getInternalRouterError(o, i) {
	let { pathname: a, routeId: s, method: $, type: j } = i === void 0 ? {} : i,
		_e = "Unknown Server Error",
		et = "Unknown @remix-run/router error";
	return (
		o === 400
			? ((_e = "Bad Request"),
				$ && a && s
					? (et =
							"You made a " +
							$ +
							' request to "' +
							a +
							'" but ' +
							('did not provide a `loader` for route "' + s + '", ') +
							"so there is no way to handle the request.")
					: j === "defer-action"
						? (et = "defer() is not supported in actions")
						: j === "invalid-body" && (et = "Unable to encode submission body"))
			: o === 403
				? ((_e = "Forbidden"), (et = 'Route "' + s + '" does not match URL "' + a + '"'))
				: o === 404
					? ((_e = "Not Found"), (et = 'No route matches URL "' + a + '"'))
					: o === 405 &&
						((_e = "Method Not Allowed"),
						$ && a && s
							? (et =
									"You made a " +
									$.toUpperCase() +
									' request to "' +
									a +
									'" but ' +
									('did not provide an `action` for route "' + s + '", ') +
									"so there is no way to handle the request.")
							: $ && (et = 'Invalid request method "' + $.toUpperCase() + '"')),
		new ErrorResponseImpl(o || 500, _e, new Error(et), !0)
	);
}
function findRedirect(o) {
	for (let i = o.length - 1; i >= 0; i--) {
		let a = o[i];
		if (isRedirectResult(a)) return { result: a, idx: i };
	}
}
function stripHashFromPath(o) {
	let i = typeof o == "string" ? parsePath(o) : o;
	return createPath(_extends$c({}, i, { hash: "" }));
}
function isHashChangeOnly(o, i) {
	return o.pathname !== i.pathname || o.search !== i.search
		? !1
		: o.hash === ""
			? i.hash !== ""
			: o.hash === i.hash
				? !0
				: i.hash !== "";
}
function isDeferredResult(o) {
	return o.type === ResultType.deferred;
}
function isErrorResult(o) {
	return o.type === ResultType.error;
}
function isRedirectResult(o) {
	return (o && o.type) === ResultType.redirect;
}
function isDeferredData(o) {
	let i = o;
	return (
		i &&
		typeof i == "object" &&
		typeof i.data == "object" &&
		typeof i.subscribe == "function" &&
		typeof i.cancel == "function" &&
		typeof i.resolveData == "function"
	);
}
function isResponse(o) {
	return (
		o != null &&
		typeof o.status == "number" &&
		typeof o.statusText == "string" &&
		typeof o.headers == "object" &&
		typeof o.body < "u"
	);
}
function isValidMethod(o) {
	return validRequestMethods.has(o.toLowerCase());
}
function isMutationMethod(o) {
	return validMutationMethods.has(o.toLowerCase());
}
async function resolveDeferredResults(o, i, a, s, $, j) {
	for (let _e = 0; _e < a.length; _e++) {
		let et = a[_e],
			tt = i[_e];
		if (!tt) continue;
		let rt = o.find((it) => it.route.id === tt.route.id),
			nt = rt != null && !isNewRouteInstance(rt, tt) && (j && j[tt.route.id]) !== void 0;
		if (isDeferredResult(et) && ($ || nt)) {
			let it = s[_e];
			(invariant(it, "Expected an AbortSignal for revalidating fetcher deferred result"),
				await resolveDeferredData(et, it, $).then((ot) => {
					ot && (a[_e] = ot || a[_e]);
				}));
		}
	}
}
async function resolveDeferredData(o, i, a) {
	if ((a === void 0 && (a = !1), !(await o.deferredData.resolveData(i)))) {
		if (a)
			try {
				return { type: ResultType.data, data: o.deferredData.unwrappedData };
			} catch ($) {
				return { type: ResultType.error, error: $ };
			}
		return { type: ResultType.data, data: o.deferredData.data };
	}
}
function hasNakedIndexQuery(o) {
	return new URLSearchParams(o).getAll("index").some((i) => i === "");
}
function getTargetMatch(o, i) {
	let a = typeof i == "string" ? parsePath(i).search : i.search;
	if (o[o.length - 1].route.index && hasNakedIndexQuery(a || "")) return o[o.length - 1];
	let s = getPathContributingMatches(o);
	return s[s.length - 1];
}
function getSubmissionFromNavigation(o) {
	let { formMethod: i, formAction: a, formEncType: s, text: $, formData: j, json: _e } = o;
	if (!(!i || !a || !s)) {
		if ($ != null)
			return {
				formMethod: i,
				formAction: a,
				formEncType: s,
				formData: void 0,
				json: void 0,
				text: $,
			};
		if (j != null)
			return {
				formMethod: i,
				formAction: a,
				formEncType: s,
				formData: j,
				json: void 0,
				text: void 0,
			};
		if (_e !== void 0)
			return {
				formMethod: i,
				formAction: a,
				formEncType: s,
				formData: void 0,
				json: _e,
				text: void 0,
			};
	}
}
function getLoadingNavigation(o, i) {
	return i
		? {
				state: "loading",
				location: o,
				formMethod: i.formMethod,
				formAction: i.formAction,
				formEncType: i.formEncType,
				formData: i.formData,
				json: i.json,
				text: i.text,
			}
		: {
				state: "loading",
				location: o,
				formMethod: void 0,
				formAction: void 0,
				formEncType: void 0,
				formData: void 0,
				json: void 0,
				text: void 0,
			};
}
function getSubmittingNavigation(o, i) {
	return {
		state: "submitting",
		location: o,
		formMethod: i.formMethod,
		formAction: i.formAction,
		formEncType: i.formEncType,
		formData: i.formData,
		json: i.json,
		text: i.text,
	};
}
function getLoadingFetcher(o, i) {
	return o
		? {
				state: "loading",
				formMethod: o.formMethod,
				formAction: o.formAction,
				formEncType: o.formEncType,
				formData: o.formData,
				json: o.json,
				text: o.text,
				data: i,
			}
		: {
				state: "loading",
				formMethod: void 0,
				formAction: void 0,
				formEncType: void 0,
				formData: void 0,
				json: void 0,
				text: void 0,
				data: i,
			};
}
function getSubmittingFetcher(o, i) {
	return {
		state: "submitting",
		formMethod: o.formMethod,
		formAction: o.formAction,
		formEncType: o.formEncType,
		formData: o.formData,
		json: o.json,
		text: o.text,
		data: i ? i.data : void 0,
	};
}
function getDoneFetcher(o) {
	return {
		state: "idle",
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0,
		data: o,
	};
}
function restoreAppliedTransitions(o, i) {
	try {
		let a = o.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
		if (a) {
			let s = JSON.parse(a);
			for (let [$, j] of Object.entries(s || {}))
				j && Array.isArray(j) && i.set($, new Set(j || []));
		}
	} catch {}
}
function persistAppliedTransitions(o, i) {
	if (i.size > 0) {
		let a = {};
		for (let [s, $] of i) a[s] = [...$];
		try {
			o.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(a));
		} catch (s) {
			warning(!1, "Failed to save applied view transitions in sessionStorage (" + s + ").");
		}
	}
}
/**
 * React Router v6.18.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function _extends$b() {
	return (
		(_extends$b = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$b.apply(this, arguments)
	);
}
const DataRouterContext = reactExports.createContext(null),
	DataRouterStateContext = reactExports.createContext(null),
	AwaitContext = reactExports.createContext(null),
	NavigationContext = reactExports.createContext(null),
	LocationContext = reactExports.createContext(null),
	RouteContext = reactExports.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
	RouteErrorContext = reactExports.createContext(null);
function useHref(o, i) {
	let { relative: a } = i === void 0 ? {} : i;
	useInRouterContext() || invariant(!1);
	let { basename: s, navigator: $ } = reactExports.useContext(NavigationContext),
		{ hash: j, pathname: _e, search: et } = useResolvedPath(o, { relative: a }),
		tt = _e;
	return (
		s !== "/" && (tt = _e === "/" ? s : joinPaths([s, _e])),
		$.createHref({ pathname: tt, search: et, hash: j })
	);
}
function useInRouterContext() {
	return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
	return (useInRouterContext() || invariant(!1), reactExports.useContext(LocationContext).location);
}
function useNavigationType() {
	return reactExports.useContext(LocationContext).navigationType;
}
function useMatch(o) {
	useInRouterContext() || invariant(!1);
	let { pathname: i } = useLocation();
	return reactExports.useMemo(() => matchPath(o, i), [i, o]);
}
function useIsomorphicLayoutEffect(o) {
	reactExports.useContext(NavigationContext).static || reactExports.useLayoutEffect(o);
}
function useNavigate() {
	let { isDataRoute: o } = reactExports.useContext(RouteContext);
	return o ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
	useInRouterContext() || invariant(!1);
	let o = reactExports.useContext(DataRouterContext),
		{ basename: i, navigator: a } = reactExports.useContext(NavigationContext),
		{ matches: s } = reactExports.useContext(RouteContext),
		{ pathname: $ } = useLocation(),
		j = JSON.stringify(getPathContributingMatches(s).map((tt) => tt.pathnameBase)),
		_e = reactExports.useRef(!1);
	return (
		useIsomorphicLayoutEffect(() => {
			_e.current = !0;
		}),
		reactExports.useCallback(
			function (tt, rt) {
				if ((rt === void 0 && (rt = {}), !_e.current)) return;
				if (typeof tt == "number") {
					a.go(tt);
					return;
				}
				let nt = resolveTo(tt, JSON.parse(j), $, rt.relative === "path");
				(o == null &&
					i !== "/" &&
					(nt.pathname = nt.pathname === "/" ? i : joinPaths([i, nt.pathname])),
					(rt.replace ? a.replace : a.push)(nt, rt.state, rt));
			},
			[i, a, j, $, o]
		)
	);
}
const OutletContext = reactExports.createContext(null);
function useOutletContext() {
	return reactExports.useContext(OutletContext);
}
function useOutlet(o) {
	let i = reactExports.useContext(RouteContext).outlet;
	return i && reactExports.createElement(OutletContext.Provider, { value: o }, i);
}
function useParams() {
	let { matches: o } = reactExports.useContext(RouteContext),
		i = o[o.length - 1];
	return i ? i.params : {};
}
function useResolvedPath(o, i) {
	let { relative: a } = i === void 0 ? {} : i,
		{ matches: s } = reactExports.useContext(RouteContext),
		{ pathname: $ } = useLocation(),
		j = JSON.stringify(getPathContributingMatches(s).map((_e) => _e.pathnameBase));
	return reactExports.useMemo(() => resolveTo(o, JSON.parse(j), $, a === "path"), [o, j, $, a]);
}
function useRoutes(o, i) {
	return useRoutesImpl(o, i);
}
function useRoutesImpl(o, i, a) {
	useInRouterContext() || invariant(!1);
	let { navigator: s } = reactExports.useContext(NavigationContext),
		{ matches: $ } = reactExports.useContext(RouteContext),
		j = $[$.length - 1],
		_e = j ? j.params : {};
	j && j.pathname;
	let et = j ? j.pathnameBase : "/";
	j && j.route;
	let tt = useLocation(),
		rt;
	if (i) {
		var nt;
		let dt = typeof i == "string" ? parsePath(i) : i;
		(et === "/" || ((nt = dt.pathname) != null && nt.startsWith(et)) || invariant(!1), (rt = dt));
	} else rt = tt;
	let it = rt.pathname || "/",
		ot = et === "/" ? it : it.slice(et.length) || "/",
		st = matchRoutes(o, { pathname: ot }),
		lt = _renderMatches(
			st &&
				st.map((dt) =>
					Object.assign({}, dt, {
						params: Object.assign({}, _e, dt.params),
						pathname: joinPaths([
							et,
							s.encodeLocation ? s.encodeLocation(dt.pathname).pathname : dt.pathname,
						]),
						pathnameBase:
							dt.pathnameBase === "/"
								? et
								: joinPaths([
										et,
										s.encodeLocation ? s.encodeLocation(dt.pathnameBase).pathname : dt.pathnameBase,
									]),
					})
				),
			$,
			a
		);
	return i && lt
		? reactExports.createElement(
				LocationContext.Provider,
				{
					value: {
						location: _extends$b(
							{ pathname: "/", search: "", hash: "", state: null, key: "default" },
							rt
						),
						navigationType: Action.Pop,
					},
				},
				lt
			)
		: lt;
}
function DefaultErrorComponent() {
	let o = useRouteError(),
		i = isRouteErrorResponse(o)
			? o.status + " " + o.statusText
			: o instanceof Error
				? o.message
				: JSON.stringify(o),
		a = o instanceof Error ? o.stack : null,
		$ = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" },
		j = null;
	return reactExports.createElement(
		reactExports.Fragment,
		null,
		reactExports.createElement("h2", null, "Unexpected Application Error!"),
		reactExports.createElement("h3", { style: { fontStyle: "italic" } }, i),
		a ? reactExports.createElement("pre", { style: $ }, a) : null,
		j
	);
}
const defaultErrorElement = reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
	constructor(i) {
		(super(i),
			(this.state = { location: i.location, revalidation: i.revalidation, error: i.error }));
	}
	static getDerivedStateFromError(i) {
		return { error: i };
	}
	static getDerivedStateFromProps(i, a) {
		return a.location !== i.location || (a.revalidation !== "idle" && i.revalidation === "idle")
			? { error: i.error, location: i.location, revalidation: i.revalidation }
			: {
					error: i.error || a.error,
					location: a.location,
					revalidation: i.revalidation || a.revalidation,
				};
	}
	componentDidCatch(i, a) {
		console.error("React Router caught the following error during render", i, a);
	}
	render() {
		return this.state.error
			? reactExports.createElement(
					RouteContext.Provider,
					{ value: this.props.routeContext },
					reactExports.createElement(RouteErrorContext.Provider, {
						value: this.state.error,
						children: this.props.component,
					})
				)
			: this.props.children;
	}
}
function RenderedRoute(o) {
	let { routeContext: i, match: a, children: s } = o,
		$ = reactExports.useContext(DataRouterContext);
	return (
		$ &&
			$.static &&
			$.staticContext &&
			(a.route.errorElement || a.route.ErrorBoundary) &&
			($.staticContext._deepestRenderedBoundaryId = a.route.id),
		reactExports.createElement(RouteContext.Provider, { value: i }, s)
	);
}
function _renderMatches(o, i, a) {
	var s;
	if ((i === void 0 && (i = []), a === void 0 && (a = null), o == null)) {
		var $;
		if (($ = a) != null && $.errors) o = a.matches;
		else return null;
	}
	let j = o,
		_e = (s = a) == null ? void 0 : s.errors;
	if (_e != null) {
		let et = j.findIndex((tt) => tt.route.id && (_e == null ? void 0 : _e[tt.route.id]));
		(et >= 0 || invariant(!1), (j = j.slice(0, Math.min(j.length, et + 1))));
	}
	return j.reduceRight((et, tt, rt) => {
		let nt = tt.route.id ? (_e == null ? void 0 : _e[tt.route.id]) : null,
			it = null;
		a && (it = tt.route.errorElement || defaultErrorElement);
		let ot = i.concat(j.slice(0, rt + 1)),
			st = () => {
				let lt;
				return (
					nt
						? (lt = it)
						: tt.route.Component
							? (lt = reactExports.createElement(tt.route.Component, null))
							: tt.route.element
								? (lt = tt.route.element)
								: (lt = et),
					reactExports.createElement(RenderedRoute, {
						match: tt,
						routeContext: { outlet: et, matches: ot, isDataRoute: a != null },
						children: lt,
					})
				);
			};
		return a && (tt.route.ErrorBoundary || tt.route.errorElement || rt === 0)
			? reactExports.createElement(RenderErrorBoundary, {
					location: a.location,
					revalidation: a.revalidation,
					component: it,
					error: nt,
					children: st(),
					routeContext: { outlet: null, matches: ot, isDataRoute: !0 },
				})
			: st();
	}, null);
}
var DataRouterHook$1 = (function (o) {
		return (
			(o.UseBlocker = "useBlocker"),
			(o.UseRevalidator = "useRevalidator"),
			(o.UseNavigateStable = "useNavigate"),
			o
		);
	})(DataRouterHook$1 || {}),
	DataRouterStateHook$1 = (function (o) {
		return (
			(o.UseBlocker = "useBlocker"),
			(o.UseLoaderData = "useLoaderData"),
			(o.UseActionData = "useActionData"),
			(o.UseRouteError = "useRouteError"),
			(o.UseNavigation = "useNavigation"),
			(o.UseRouteLoaderData = "useRouteLoaderData"),
			(o.UseMatches = "useMatches"),
			(o.UseRevalidator = "useRevalidator"),
			(o.UseNavigateStable = "useNavigate"),
			(o.UseRouteId = "useRouteId"),
			o
		);
	})(DataRouterStateHook$1 || {});
function useDataRouterContext$1(o) {
	let i = reactExports.useContext(DataRouterContext);
	return (i || invariant(!1), i);
}
function useDataRouterState$1(o) {
	let i = reactExports.useContext(DataRouterStateContext);
	return (i || invariant(!1), i);
}
function useRouteContext(o) {
	let i = reactExports.useContext(RouteContext);
	return (i || invariant(!1), i);
}
function useCurrentRouteId(o) {
	let i = useRouteContext(),
		a = i.matches[i.matches.length - 1];
	return (a.route.id || invariant(!1), a.route.id);
}
function useRouteId() {
	return useCurrentRouteId(DataRouterStateHook$1.UseRouteId);
}
function useNavigation() {
	return useDataRouterState$1(DataRouterStateHook$1.UseNavigation).navigation;
}
function useRevalidator() {
	let o = useDataRouterContext$1(DataRouterHook$1.UseRevalidator),
		i = useDataRouterState$1(DataRouterStateHook$1.UseRevalidator);
	return reactExports.useMemo(
		() => ({ revalidate: o.router.revalidate, state: i.revalidation }),
		[o.router.revalidate, i.revalidation]
	);
}
function useMatches() {
	let { matches: o, loaderData: i } = useDataRouterState$1(DataRouterStateHook$1.UseMatches);
	return reactExports.useMemo(() => o.map((a) => convertRouteMatchToUiMatch(a, i)), [o, i]);
}
function useLoaderData() {
	let o = useDataRouterState$1(DataRouterStateHook$1.UseLoaderData),
		i = useCurrentRouteId(DataRouterStateHook$1.UseLoaderData);
	if (o.errors && o.errors[i] != null) {
		console.error("You cannot `useLoaderData` in an errorElement (routeId: " + i + ")");
		return;
	}
	return o.loaderData[i];
}
function useRouteLoaderData(o) {
	return useDataRouterState$1(DataRouterStateHook$1.UseRouteLoaderData).loaderData[o];
}
function useActionData() {
	let o = useDataRouterState$1(DataRouterStateHook$1.UseActionData);
	return (
		reactExports.useContext(RouteContext) || invariant(!1),
		Object.values((o == null ? void 0 : o.actionData) || {})[0]
	);
}
function useRouteError() {
	var o;
	let i = reactExports.useContext(RouteErrorContext),
		a = useDataRouterState$1(DataRouterStateHook$1.UseRouteError),
		s = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);
	return i || ((o = a.errors) == null ? void 0 : o[s]);
}
function useAsyncValue() {
	let o = reactExports.useContext(AwaitContext);
	return o == null ? void 0 : o._data;
}
function useAsyncError() {
	let o = reactExports.useContext(AwaitContext);
	return o == null ? void 0 : o._error;
}
let blockerId = 0;
function useBlocker(o) {
	let { router: i, basename: a } = useDataRouterContext$1(DataRouterHook$1.UseBlocker),
		s = useDataRouterState$1(DataRouterStateHook$1.UseBlocker),
		[$, j] = reactExports.useState(""),
		_e = reactExports.useCallback(
			(et) => {
				if (typeof o != "function") return !!o;
				if (a === "/") return o(et);
				let { currentLocation: tt, nextLocation: rt, historyAction: nt } = et;
				return o({
					currentLocation: _extends$b({}, tt, {
						pathname: stripBasename(tt.pathname, a) || tt.pathname,
					}),
					nextLocation: _extends$b({}, rt, {
						pathname: stripBasename(rt.pathname, a) || rt.pathname,
					}),
					historyAction: nt,
				});
			},
			[a, o]
		);
	return (
		reactExports.useEffect(() => {
			let et = String(++blockerId);
			return (j(et), () => i.deleteBlocker(et));
		}, [i]),
		reactExports.useEffect(() => {
			$ !== "" && i.getBlocker($, _e);
		}, [i, $, _e]),
		$ && s.blockers.has($) ? s.blockers.get($) : IDLE_BLOCKER
	);
}
function useNavigateStable() {
	let { router: o } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable),
		i = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable),
		a = reactExports.useRef(!1);
	return (
		useIsomorphicLayoutEffect(() => {
			a.current = !0;
		}),
		reactExports.useCallback(
			function ($, j) {
				(j === void 0 && (j = {}),
					a.current &&
						(typeof $ == "number"
							? o.navigate($)
							: o.navigate($, _extends$b({ fromRouteId: i }, j))));
			},
			[o, i]
		)
	);
}
const START_TRANSITION$1 = "startTransition",
	startTransitionImpl$1 = React$1[START_TRANSITION$1];
function MemoryRouter(o) {
	let { basename: i, children: a, initialEntries: s, initialIndex: $, future: j } = o,
		_e = reactExports.useRef();
	_e.current == null &&
		(_e.current = createMemoryHistory({ initialEntries: s, initialIndex: $, v5Compat: !0 }));
	let et = _e.current,
		[tt, rt] = reactExports.useState({ action: et.action, location: et.location }),
		{ v7_startTransition: nt } = j || {},
		it = reactExports.useCallback(
			(ot) => {
				nt && startTransitionImpl$1 ? startTransitionImpl$1(() => rt(ot)) : rt(ot);
			},
			[rt, nt]
		);
	return (
		reactExports.useLayoutEffect(() => et.listen(it), [et, it]),
		reactExports.createElement(Router, {
			basename: i,
			children: a,
			location: tt.location,
			navigationType: tt.action,
			navigator: et,
		})
	);
}
function Navigate(o) {
	let { to: i, replace: a, state: s, relative: $ } = o;
	useInRouterContext() || invariant(!1);
	let { matches: j } = reactExports.useContext(RouteContext),
		{ pathname: _e } = useLocation(),
		et = useNavigate(),
		tt = resolveTo(
			i,
			getPathContributingMatches(j).map((nt) => nt.pathnameBase),
			_e,
			$ === "path"
		),
		rt = JSON.stringify(tt);
	return (
		reactExports.useEffect(
			() => et(JSON.parse(rt), { replace: a, state: s, relative: $ }),
			[et, rt, $, a, s]
		),
		null
	);
}
function Outlet(o) {
	return useOutlet(o.context);
}
function Route(o) {
	invariant(!1);
}
function Router(o) {
	let {
		basename: i = "/",
		children: a = null,
		location: s,
		navigationType: $ = Action.Pop,
		navigator: j,
		static: _e = !1,
	} = o;
	useInRouterContext() && invariant(!1);
	let et = i.replace(/^\/*/, "/"),
		tt = reactExports.useMemo(() => ({ basename: et, navigator: j, static: _e }), [et, j, _e]);
	typeof s == "string" && (s = parsePath(s));
	let {
			pathname: rt = "/",
			search: nt = "",
			hash: it = "",
			state: ot = null,
			key: st = "default",
		} = s,
		lt = reactExports.useMemo(() => {
			let dt = stripBasename(rt, et);
			return dt == null
				? null
				: {
						location: { pathname: dt, search: nt, hash: it, state: ot, key: st },
						navigationType: $,
					};
		}, [et, rt, nt, it, ot, st, $]);
	return lt == null
		? null
		: reactExports.createElement(
				NavigationContext.Provider,
				{ value: tt },
				reactExports.createElement(LocationContext.Provider, { children: a, value: lt })
			);
}
function Routes(o) {
	let { children: i, location: a } = o;
	return useRoutes(createRoutesFromChildren(i), a);
}
function Await(o) {
	let { children: i, errorElement: a, resolve: s } = o;
	return reactExports.createElement(
		AwaitErrorBoundary,
		{ resolve: s, errorElement: a },
		reactExports.createElement(ResolveAwait, null, i)
	);
}
var AwaitRenderStatus = (function (o) {
	return (
		(o[(o.pending = 0)] = "pending"),
		(o[(o.success = 1)] = "success"),
		(o[(o.error = 2)] = "error"),
		o
	);
})(AwaitRenderStatus || {});
const neverSettledPromise = new Promise(() => {});
class AwaitErrorBoundary extends reactExports.Component {
	constructor(i) {
		(super(i), (this.state = { error: null }));
	}
	static getDerivedStateFromError(i) {
		return { error: i };
	}
	componentDidCatch(i, a) {
		console.error("<Await> caught the following error during render", i, a);
	}
	render() {
		let { children: i, errorElement: a, resolve: s } = this.props,
			$ = null,
			j = AwaitRenderStatus.pending;
		if (!(s instanceof Promise))
			((j = AwaitRenderStatus.success),
				($ = Promise.resolve()),
				Object.defineProperty($, "_tracked", { get: () => !0 }),
				Object.defineProperty($, "_data", { get: () => s }));
		else if (this.state.error) {
			j = AwaitRenderStatus.error;
			let _e = this.state.error;
			(($ = Promise.reject().catch(() => {})),
				Object.defineProperty($, "_tracked", { get: () => !0 }),
				Object.defineProperty($, "_error", { get: () => _e }));
		} else
			s._tracked
				? (($ = s),
					(j =
						$._error !== void 0
							? AwaitRenderStatus.error
							: $._data !== void 0
								? AwaitRenderStatus.success
								: AwaitRenderStatus.pending))
				: ((j = AwaitRenderStatus.pending),
					Object.defineProperty(s, "_tracked", { get: () => !0 }),
					($ = s.then(
						(_e) => Object.defineProperty(s, "_data", { get: () => _e }),
						(_e) => Object.defineProperty(s, "_error", { get: () => _e })
					)));
		if (j === AwaitRenderStatus.error && $._error instanceof AbortedDeferredError)
			throw neverSettledPromise;
		if (j === AwaitRenderStatus.error && !a) throw $._error;
		if (j === AwaitRenderStatus.error)
			return reactExports.createElement(AwaitContext.Provider, { value: $, children: a });
		if (j === AwaitRenderStatus.success)
			return reactExports.createElement(AwaitContext.Provider, { value: $, children: i });
		throw $;
	}
}
function ResolveAwait(o) {
	let { children: i } = o,
		a = useAsyncValue(),
		s = typeof i == "function" ? i(a) : i;
	return reactExports.createElement(reactExports.Fragment, null, s);
}
function createRoutesFromChildren(o, i) {
	i === void 0 && (i = []);
	let a = [];
	return (
		reactExports.Children.forEach(o, (s, $) => {
			if (!reactExports.isValidElement(s)) return;
			let j = [...i, $];
			if (s.type === reactExports.Fragment) {
				a.push.apply(a, createRoutesFromChildren(s.props.children, j));
				return;
			}
			(s.type !== Route && invariant(!1), !s.props.index || !s.props.children || invariant(!1));
			let _e = {
				id: s.props.id || j.join("-"),
				caseSensitive: s.props.caseSensitive,
				element: s.props.element,
				Component: s.props.Component,
				index: s.props.index,
				path: s.props.path,
				loader: s.props.loader,
				action: s.props.action,
				errorElement: s.props.errorElement,
				ErrorBoundary: s.props.ErrorBoundary,
				hasErrorBoundary: s.props.ErrorBoundary != null || s.props.errorElement != null,
				shouldRevalidate: s.props.shouldRevalidate,
				handle: s.props.handle,
				lazy: s.props.lazy,
			};
			(s.props.children && (_e.children = createRoutesFromChildren(s.props.children, j)),
				a.push(_e));
		}),
		a
	);
}
function renderMatches(o) {
	return _renderMatches(o);
}
function mapRouteProperties(o) {
	let i = { hasErrorBoundary: o.ErrorBoundary != null || o.errorElement != null };
	return (
		o.Component &&
			Object.assign(i, { element: reactExports.createElement(o.Component), Component: void 0 }),
		o.ErrorBoundary &&
			Object.assign(i, {
				errorElement: reactExports.createElement(o.ErrorBoundary),
				ErrorBoundary: void 0,
			}),
		i
	);
}
function createMemoryRouter(o, i) {
	return createRouter({
		basename: i == null ? void 0 : i.basename,
		future: _extends$b({}, i == null ? void 0 : i.future, { v7_prependBasename: !0 }),
		history: createMemoryHistory({
			initialEntries: i == null ? void 0 : i.initialEntries,
			initialIndex: i == null ? void 0 : i.initialIndex,
		}),
		hydrationData: i == null ? void 0 : i.hydrationData,
		routes: o,
		mapRouteProperties,
	}).initialize();
}
/**
 * React Router DOM v6.18.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function _extends$a() {
	return (
		(_extends$a = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$a.apply(this, arguments)
	);
}
function _objectWithoutPropertiesLoose$1(o, i) {
	if (o == null) return {};
	var a = {},
		s = Object.keys(o),
		$,
		j;
	for (j = 0; j < s.length; j++) (($ = s[j]), !(i.indexOf($) >= 0) && (a[$] = o[$]));
	return a;
}
const defaultMethod = "get",
	defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(o) {
	return o != null && typeof o.tagName == "string";
}
function isButtonElement(o) {
	return isHtmlElement(o) && o.tagName.toLowerCase() === "button";
}
function isFormElement(o) {
	return isHtmlElement(o) && o.tagName.toLowerCase() === "form";
}
function isInputElement(o) {
	return isHtmlElement(o) && o.tagName.toLowerCase() === "input";
}
function isModifiedEvent(o) {
	return !!(o.metaKey || o.altKey || o.ctrlKey || o.shiftKey);
}
function shouldProcessLinkClick(o, i) {
	return o.button === 0 && (!i || i === "_self") && !isModifiedEvent(o);
}
function createSearchParams(o) {
	return (
		o === void 0 && (o = ""),
		new URLSearchParams(
			typeof o == "string" || Array.isArray(o) || o instanceof URLSearchParams
				? o
				: Object.keys(o).reduce((i, a) => {
						let s = o[a];
						return i.concat(Array.isArray(s) ? s.map(($) => [a, $]) : [[a, s]]);
					}, [])
		)
	);
}
function getSearchParamsForLocation(o, i) {
	let a = createSearchParams(o);
	return (
		i &&
			i.forEach((s, $) => {
				a.has($) ||
					i.getAll($).forEach((j) => {
						a.append($, j);
					});
			}),
		a
	);
}
let _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
	if (_formDataSupportsSubmitter === null)
		try {
			(new FormData(document.createElement("form"), 0), (_formDataSupportsSubmitter = !1));
		} catch {
			_formDataSupportsSubmitter = !0;
		}
	return _formDataSupportsSubmitter;
}
const supportedFormEncTypes = new Set([
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain",
]);
function getFormEncType(o) {
	return o != null && !supportedFormEncTypes.has(o) ? null : o;
}
function getFormSubmissionInfo(o, i) {
	let a, s, $, j, _e;
	if (isFormElement(o)) {
		let et = o.getAttribute("action");
		((s = et ? stripBasename(et, i) : null),
			(a = o.getAttribute("method") || defaultMethod),
			($ = getFormEncType(o.getAttribute("enctype")) || defaultEncType),
			(j = new FormData(o)));
	} else if (
		isButtonElement(o) ||
		(isInputElement(o) && (o.type === "submit" || o.type === "image"))
	) {
		let et = o.form;
		if (et == null)
			throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
		let tt = o.getAttribute("formaction") || et.getAttribute("action");
		if (
			((s = tt ? stripBasename(tt, i) : null),
			(a = o.getAttribute("formmethod") || et.getAttribute("method") || defaultMethod),
			($ =
				getFormEncType(o.getAttribute("formenctype")) ||
				getFormEncType(et.getAttribute("enctype")) ||
				defaultEncType),
			(j = new FormData(et, o)),
			!isFormDataSubmitterSupported())
		) {
			let { name: rt, type: nt, value: it } = o;
			if (nt === "image") {
				let ot = rt ? rt + "." : "";
				(j.append(ot + "x", "0"), j.append(ot + "y", "0"));
			} else rt && j.append(rt, it);
		}
	} else {
		if (isHtmlElement(o))
			throw new Error(
				'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
			);
		((a = defaultMethod), (s = null), ($ = defaultEncType), (_e = o));
	}
	return (
		j && $ === "text/plain" && ((_e = j), (j = void 0)),
		{ action: s, method: a.toLowerCase(), encType: $, formData: j, body: _e }
	);
}
const _excluded$q = [
		"onClick",
		"relative",
		"reloadDocument",
		"replace",
		"state",
		"target",
		"to",
		"preventScrollReset",
		"unstable_viewTransition",
	],
	_excluded2 = [
		"aria-current",
		"caseSensitive",
		"className",
		"end",
		"style",
		"to",
		"unstable_viewTransition",
		"children",
	],
	_excluded3 = [
		"fetcherKey",
		"navigate",
		"reloadDocument",
		"replace",
		"state",
		"method",
		"action",
		"onSubmit",
		"relative",
		"preventScrollReset",
		"unstable_viewTransition",
	];
function createBrowserRouter(o, i) {
	return createRouter({
		basename: i == null ? void 0 : i.basename,
		future: _extends$a({}, i == null ? void 0 : i.future, { v7_prependBasename: !0 }),
		history: createBrowserHistory({ window: i == null ? void 0 : i.window }),
		hydrationData: (i == null ? void 0 : i.hydrationData) || parseHydrationData(),
		routes: o,
		mapRouteProperties,
		window: i == null ? void 0 : i.window,
	}).initialize();
}
function createHashRouter(o, i) {
	return createRouter({
		basename: i == null ? void 0 : i.basename,
		future: _extends$a({}, i == null ? void 0 : i.future, { v7_prependBasename: !0 }),
		history: createHashHistory({ window: i == null ? void 0 : i.window }),
		hydrationData: (i == null ? void 0 : i.hydrationData) || parseHydrationData(),
		routes: o,
		mapRouteProperties,
		window: i == null ? void 0 : i.window,
	}).initialize();
}
function parseHydrationData() {
	var o;
	let i = (o = window) == null ? void 0 : o.__staticRouterHydrationData;
	return (i && i.errors && (i = _extends$a({}, i, { errors: deserializeErrors(i.errors) })), i);
}
function deserializeErrors(o) {
	if (!o) return null;
	let i = Object.entries(o),
		a = {};
	for (let [s, $] of i)
		if ($ && $.__type === "RouteErrorResponse")
			a[s] = new ErrorResponseImpl($.status, $.statusText, $.data, $.internal === !0);
		else if ($ && $.__type === "Error") {
			if ($.__subType) {
				let j = window[$.__subType];
				if (typeof j == "function")
					try {
						let _e = new j($.message);
						((_e.stack = ""), (a[s] = _e));
					} catch {}
			}
			if (a[s] == null) {
				let j = new Error($.message);
				((j.stack = ""), (a[s] = j));
			}
		} else a[s] = $;
	return a;
}
const ViewTransitionContext = reactExports.createContext({ isTransitioning: !1 }),
	FetchersContext = reactExports.createContext(new Map()),
	START_TRANSITION = "startTransition",
	startTransitionImpl = React$1[START_TRANSITION];
function startTransitionSafe(o) {
	startTransitionImpl ? startTransitionImpl(o) : o();
}
class Deferred {
	constructor() {
		((this.status = "pending"),
			(this.promise = new Promise((i, a) => {
				((this.resolve = (s) => {
					this.status === "pending" && ((this.status = "resolved"), i(s));
				}),
					(this.reject = (s) => {
						this.status === "pending" && ((this.status = "rejected"), a(s));
					}));
			})));
	}
}
function RouterProvider(o) {
	let { fallbackElement: i, router: a, future: s } = o,
		[$, j] = reactExports.useState(a.state),
		[_e, et] = reactExports.useState(),
		[tt, rt] = reactExports.useState({ isTransitioning: !1 }),
		[nt, it] = reactExports.useState(),
		[ot, st] = reactExports.useState(),
		[lt, dt] = reactExports.useState(),
		pt = reactExports.useRef(new Map()),
		{ v7_startTransition: ct } = s || {},
		at = reactExports.useCallback(
			(mt) => {
				ct ? startTransitionSafe(mt) : mt();
			},
			[ct]
		),
		ft = reactExports.useCallback(
			(mt, Et) => {
				let { deletedFetchers: Rt, unstable_viewTransitionOpts: vt } = Et;
				(Rt.forEach((Tt) => pt.current.delete(Tt)),
					mt.fetchers.forEach((Tt, Pt) => {
						Tt.data !== void 0 && pt.current.set(Pt, Tt.data);
					}),
					!vt || a.window == null || typeof a.window.document.startViewTransition != "function"
						? at(() => j(mt))
						: ot && nt
							? (nt.resolve(),
								ot.skipTransition(),
								dt({
									state: mt,
									currentLocation: vt.currentLocation,
									nextLocation: vt.nextLocation,
								}))
							: (et(mt),
								rt({
									isTransitioning: !0,
									currentLocation: vt.currentLocation,
									nextLocation: vt.nextLocation,
								})));
			},
			[a.window, ot, nt, pt, at]
		);
	(reactExports.useLayoutEffect(() => a.subscribe(ft), [a, ft]),
		reactExports.useEffect(() => {
			tt.isTransitioning && it(new Deferred());
		}, [tt.isTransitioning]),
		reactExports.useEffect(() => {
			if (nt && _e && a.window) {
				let mt = _e,
					Et = nt.promise,
					Rt = a.window.document.startViewTransition(async () => {
						(at(() => j(mt)), await Et);
					});
				(Rt.finished.finally(() => {
					(it(void 0), st(void 0), et(void 0), rt({ isTransitioning: !1 }));
				}),
					st(Rt));
			}
		}, [at, _e, nt, a.window]),
		reactExports.useEffect(() => {
			nt && _e && $.location.key === _e.location.key && nt.resolve();
		}, [nt, ot, $.location, _e]),
		reactExports.useEffect(() => {
			!tt.isTransitioning &&
				lt &&
				(et(lt.state),
				rt({
					isTransitioning: !0,
					currentLocation: lt.currentLocation,
					nextLocation: lt.nextLocation,
				}),
				dt(void 0));
		}, [tt.isTransitioning, lt]));
	let ut = reactExports.useMemo(
			() => ({
				createHref: a.createHref,
				encodeLocation: a.encodeLocation,
				go: (mt) => a.navigate(mt),
				push: (mt, Et, Rt) =>
					a.navigate(mt, {
						state: Et,
						preventScrollReset: Rt == null ? void 0 : Rt.preventScrollReset,
					}),
				replace: (mt, Et, Rt) =>
					a.navigate(mt, {
						replace: !0,
						state: Et,
						preventScrollReset: Rt == null ? void 0 : Rt.preventScrollReset,
					}),
			}),
			[a]
		),
		ht = a.basename || "/",
		yt = reactExports.useMemo(
			() => ({ router: a, navigator: ut, static: !1, basename: ht }),
			[a, ut, ht]
		);
	return reactExports.createElement(
		reactExports.Fragment,
		null,
		reactExports.createElement(
			DataRouterContext.Provider,
			{ value: yt },
			reactExports.createElement(
				DataRouterStateContext.Provider,
				{ value: $ },
				reactExports.createElement(
					FetchersContext.Provider,
					{ value: pt.current },
					reactExports.createElement(
						ViewTransitionContext.Provider,
						{ value: tt },
						reactExports.createElement(
							Router,
							{
								basename: ht,
								location: $.location,
								navigationType: $.historyAction,
								navigator: ut,
							},
							$.initialized
								? reactExports.createElement(DataRoutes, { routes: a.routes, state: $ })
								: i
						)
					)
				)
			)
		),
		null
	);
}
function DataRoutes(o) {
	let { routes: i, state: a } = o;
	return useRoutesImpl(i, void 0, a);
}
function BrowserRouter(o) {
	let { basename: i, children: a, future: s, window: $ } = o,
		j = reactExports.useRef();
	j.current == null && (j.current = createBrowserHistory({ window: $, v5Compat: !0 }));
	let _e = j.current,
		[et, tt] = reactExports.useState({ action: _e.action, location: _e.location }),
		{ v7_startTransition: rt } = s || {},
		nt = reactExports.useCallback(
			(it) => {
				rt && startTransitionImpl ? startTransitionImpl(() => tt(it)) : tt(it);
			},
			[tt, rt]
		);
	return (
		reactExports.useLayoutEffect(() => _e.listen(nt), [_e, nt]),
		reactExports.createElement(Router, {
			basename: i,
			children: a,
			location: et.location,
			navigationType: et.action,
			navigator: _e,
		})
	);
}
function HashRouter(o) {
	let { basename: i, children: a, future: s, window: $ } = o,
		j = reactExports.useRef();
	j.current == null && (j.current = createHashHistory({ window: $, v5Compat: !0 }));
	let _e = j.current,
		[et, tt] = reactExports.useState({ action: _e.action, location: _e.location }),
		{ v7_startTransition: rt } = s || {},
		nt = reactExports.useCallback(
			(it) => {
				rt && startTransitionImpl ? startTransitionImpl(() => tt(it)) : tt(it);
			},
			[tt, rt]
		);
	return (
		reactExports.useLayoutEffect(() => _e.listen(nt), [_e, nt]),
		reactExports.createElement(Router, {
			basename: i,
			children: a,
			location: et.location,
			navigationType: et.action,
			navigator: _e,
		})
	);
}
function HistoryRouter(o) {
	let { basename: i, children: a, future: s, history: $ } = o,
		[j, _e] = reactExports.useState({ action: $.action, location: $.location }),
		{ v7_startTransition: et } = s || {},
		tt = reactExports.useCallback(
			(rt) => {
				et && startTransitionImpl ? startTransitionImpl(() => _e(rt)) : _e(rt);
			},
			[_e, et]
		);
	return (
		reactExports.useLayoutEffect(() => $.listen(tt), [$, tt]),
		reactExports.createElement(Router, {
			basename: i,
			children: a,
			location: j.location,
			navigationType: j.action,
			navigator: $,
		})
	);
}
const isBrowser$1 =
		typeof window < "u" &&
		typeof window.document < "u" &&
		typeof window.document.createElement < "u",
	ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
	Link = reactExports.forwardRef(function (i, a) {
		let {
				onClick: s,
				relative: $,
				reloadDocument: j,
				replace: _e,
				state: et,
				target: tt,
				to: rt,
				preventScrollReset: nt,
				unstable_viewTransition: it,
			} = i,
			ot = _objectWithoutPropertiesLoose$1(i, _excluded$q),
			{ basename: st } = reactExports.useContext(NavigationContext),
			lt,
			dt = !1;
		if (typeof rt == "string" && ABSOLUTE_URL_REGEX.test(rt) && ((lt = rt), isBrowser$1))
			try {
				let ft = new URL(window.location.href),
					ut = rt.startsWith("//") ? new URL(ft.protocol + rt) : new URL(rt),
					ht = stripBasename(ut.pathname, st);
				ut.origin === ft.origin && ht != null ? (rt = ht + ut.search + ut.hash) : (dt = !0);
			} catch {}
		let pt = useHref(rt, { relative: $ }),
			ct = useLinkClickHandler(rt, {
				replace: _e,
				state: et,
				target: tt,
				preventScrollReset: nt,
				relative: $,
				unstable_viewTransition: it,
			});
		function at(ft) {
			(s && s(ft), ft.defaultPrevented || ct(ft));
		}
		return reactExports.createElement(
			"a",
			_extends$a({}, ot, { href: lt || pt, onClick: dt || j ? s : at, ref: a, target: tt })
		);
	}),
	NavLink = reactExports.forwardRef(function (i, a) {
		let {
				"aria-current": s = "page",
				caseSensitive: $ = !1,
				className: j = "",
				end: _e = !1,
				style: et,
				to: tt,
				unstable_viewTransition: rt,
				children: nt,
			} = i,
			it = _objectWithoutPropertiesLoose$1(i, _excluded2),
			ot = useResolvedPath(tt, { relative: it.relative }),
			st = useLocation(),
			lt = reactExports.useContext(DataRouterStateContext),
			{ navigator: dt } = reactExports.useContext(NavigationContext),
			pt = lt != null && useViewTransitionState(ot) && rt === !0,
			ct = dt.encodeLocation ? dt.encodeLocation(ot).pathname : ot.pathname,
			at = st.pathname,
			ft = lt && lt.navigation && lt.navigation.location ? lt.navigation.location.pathname : null;
		$ || ((at = at.toLowerCase()), (ft = ft ? ft.toLowerCase() : null), (ct = ct.toLowerCase()));
		let ut = at === ct || (!_e && at.startsWith(ct) && at.charAt(ct.length) === "/"),
			ht = ft != null && (ft === ct || (!_e && ft.startsWith(ct) && ft.charAt(ct.length) === "/")),
			yt = { isActive: ut, isPending: ht, isTransitioning: pt },
			mt = ut ? s : void 0,
			Et;
		typeof j == "function"
			? (Et = j(yt))
			: (Et = [j, ut ? "active" : null, ht ? "pending" : null, pt ? "transitioning" : null]
					.filter(Boolean)
					.join(" "));
		let Rt = typeof et == "function" ? et(yt) : et;
		return reactExports.createElement(
			Link,
			_extends$a({}, it, {
				"aria-current": mt,
				className: Et,
				ref: a,
				style: Rt,
				to: tt,
				unstable_viewTransition: rt,
			}),
			typeof nt == "function" ? nt(yt) : nt
		);
	}),
	Form = reactExports.forwardRef((o, i) => {
		let {
				fetcherKey: a,
				navigate: s,
				reloadDocument: $,
				replace: j,
				state: _e,
				method: et = defaultMethod,
				action: tt,
				onSubmit: rt,
				relative: nt,
				preventScrollReset: it,
				unstable_viewTransition: ot,
			} = o,
			st = _objectWithoutPropertiesLoose$1(o, _excluded3),
			lt = useSubmit(),
			dt = useFormAction(tt, { relative: nt }),
			pt = et.toLowerCase() === "get" ? "get" : "post",
			ct = (at) => {
				if ((rt && rt(at), at.defaultPrevented)) return;
				at.preventDefault();
				let ft = at.nativeEvent.submitter,
					ut = (ft == null ? void 0 : ft.getAttribute("formmethod")) || et;
				lt(ft || at.currentTarget, {
					fetcherKey: a,
					method: ut,
					navigate: s,
					replace: j,
					state: _e,
					relative: nt,
					preventScrollReset: it,
					unstable_viewTransition: ot,
				});
			};
		return reactExports.createElement(
			"form",
			_extends$a({ ref: i, method: pt, action: dt, onSubmit: $ ? rt : ct }, st)
		);
	});
function ScrollRestoration(o) {
	let { getKey: i, storageKey: a } = o;
	return (useScrollRestoration({ getKey: i, storageKey: a }), null);
}
var DataRouterHook;
(function (o) {
	((o.UseScrollRestoration = "useScrollRestoration"),
		(o.UseSubmit = "useSubmit"),
		(o.UseSubmitFetcher = "useSubmitFetcher"),
		(o.UseFetcher = "useFetcher"),
		(o.useViewTransitionState = "useViewTransitionState"));
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function (o) {
	((o.UseFetcher = "useFetcher"),
		(o.UseFetchers = "useFetchers"),
		(o.UseScrollRestoration = "useScrollRestoration"));
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useDataRouterContext(o) {
	let i = reactExports.useContext(DataRouterContext);
	return (i || invariant(!1), i);
}
function useDataRouterState(o) {
	let i = reactExports.useContext(DataRouterStateContext);
	return (i || invariant(!1), i);
}
function useLinkClickHandler(o, i) {
	let {
			target: a,
			replace: s,
			state: $,
			preventScrollReset: j,
			relative: _e,
			unstable_viewTransition: et,
		} = i === void 0 ? {} : i,
		tt = useNavigate(),
		rt = useLocation(),
		nt = useResolvedPath(o, { relative: _e });
	return reactExports.useCallback(
		(it) => {
			if (shouldProcessLinkClick(it, a)) {
				it.preventDefault();
				let ot = s !== void 0 ? s : createPath(rt) === createPath(nt);
				tt(o, {
					replace: ot,
					state: $,
					preventScrollReset: j,
					relative: _e,
					unstable_viewTransition: et,
				});
			}
		},
		[rt, tt, nt, s, $, a, o, j, _e, et]
	);
}
function useSearchParams(o) {
	let i = reactExports.useRef(createSearchParams(o)),
		a = reactExports.useRef(!1),
		s = useLocation(),
		$ = reactExports.useMemo(
			() => getSearchParamsForLocation(s.search, a.current ? null : i.current),
			[s.search]
		),
		j = useNavigate(),
		_e = reactExports.useCallback(
			(et, tt) => {
				const rt = createSearchParams(typeof et == "function" ? et($) : et);
				((a.current = !0), j("?" + rt, tt));
			},
			[j, $]
		);
	return [$, _e];
}
function validateClientSideSubmission() {
	if (typeof document > "u")
		throw new Error(
			"You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead."
		);
}
let fetcherId = 0,
	getUniqueFetcherId = () => "__" + String(++fetcherId) + "__";
function useSubmit() {
	let { router: o } = useDataRouterContext(DataRouterHook.UseSubmit),
		{ basename: i } = reactExports.useContext(NavigationContext),
		a = useRouteId();
	return reactExports.useCallback(
		function (s, $) {
			($ === void 0 && ($ = {}), validateClientSideSubmission());
			let {
				action: j,
				method: _e,
				encType: et,
				formData: tt,
				body: rt,
			} = getFormSubmissionInfo(s, i);
			if ($.navigate === !1) {
				let nt = $.fetcherKey || getUniqueFetcherId();
				o.fetch(nt, a, $.action || j, {
					preventScrollReset: $.preventScrollReset,
					formData: tt,
					body: rt,
					formMethod: $.method || _e,
					formEncType: $.encType || et,
				});
			} else
				o.navigate($.action || j, {
					preventScrollReset: $.preventScrollReset,
					formData: tt,
					body: rt,
					formMethod: $.method || _e,
					formEncType: $.encType || et,
					replace: $.replace,
					state: $.state,
					fromRouteId: a,
					unstable_viewTransition: $.unstable_viewTransition,
				});
		},
		[o, i, a]
	);
}
function useFormAction(o, i) {
	let { relative: a } = i === void 0 ? {} : i,
		{ basename: s } = reactExports.useContext(NavigationContext),
		$ = reactExports.useContext(RouteContext);
	$ || invariant(!1);
	let [j] = $.matches.slice(-1),
		_e = _extends$a({}, useResolvedPath(o || ".", { relative: a })),
		et = useLocation();
	if (o == null && ((_e.search = et.search), j.route.index)) {
		let tt = new URLSearchParams(_e.search);
		(tt.delete("index"), (_e.search = tt.toString() ? "?" + tt.toString() : ""));
	}
	return (
		(!o || o === ".") &&
			j.route.index &&
			(_e.search = _e.search ? _e.search.replace(/^\?/, "?index&") : "?index"),
		s !== "/" && (_e.pathname = _e.pathname === "/" ? s : joinPaths([s, _e.pathname])),
		createPath(_e)
	);
}
function useFetcher(o) {
	var i;
	let { key: a } = o === void 0 ? {} : o,
		{ router: s } = useDataRouterContext(DataRouterHook.UseFetcher),
		$ = useDataRouterState(DataRouterStateHook.UseFetcher),
		j = reactExports.useContext(FetchersContext),
		_e = reactExports.useContext(RouteContext),
		et = (i = _e.matches[_e.matches.length - 1]) == null ? void 0 : i.route.id;
	(j || invariant(!1), _e || invariant(!1), et == null && invariant(!1));
	let [tt, rt] = reactExports.useState(a || "");
	(tt || rt(getUniqueFetcherId()),
		reactExports.useEffect(
			() => (
				s.getFetcher(tt),
				() => {
					s.deleteFetcher(tt);
				}
			),
			[s, tt]
		));
	let nt = reactExports.useCallback(
			(ct) => {
				(et || invariant(!1), s.fetch(tt, et, ct));
			},
			[tt, et, s]
		),
		it = useSubmit(),
		ot = reactExports.useCallback(
			(ct, at) => {
				it(ct, _extends$a({}, at, { navigate: !1, fetcherKey: tt }));
			},
			[tt, it]
		),
		st = reactExports.useMemo(
			() =>
				reactExports.forwardRef((at, ft) =>
					reactExports.createElement(
						Form,
						_extends$a({}, at, { navigate: !1, fetcherKey: tt, ref: ft })
					)
				),
			[tt]
		),
		lt = $.fetchers.get(tt) || IDLE_FETCHER,
		dt = j.get(tt);
	return reactExports.useMemo(
		() => _extends$a({ Form: st, submit: ot, load: nt }, lt, { data: dt }),
		[st, ot, nt, lt, dt]
	);
}
function useFetchers() {
	let o = useDataRouterState(DataRouterStateHook.UseFetchers);
	return Array.from(o.fetchers.entries()).map((i) => {
		let [a, s] = i;
		return _extends$a({}, s, { key: a });
	});
}
const SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
let savedScrollPositions = {};
function useScrollRestoration(o) {
	let { getKey: i, storageKey: a } = o === void 0 ? {} : o,
		{ router: s } = useDataRouterContext(DataRouterHook.UseScrollRestoration),
		{ restoreScrollPosition: $, preventScrollReset: j } = useDataRouterState(
			DataRouterStateHook.UseScrollRestoration
		),
		{ basename: _e } = reactExports.useContext(NavigationContext),
		et = useLocation(),
		tt = useMatches(),
		rt = useNavigation();
	(reactExports.useEffect(
		() => (
			(window.history.scrollRestoration = "manual"),
			() => {
				window.history.scrollRestoration = "auto";
			}
		),
		[]
	),
		usePageHide(
			reactExports.useCallback(() => {
				if (rt.state === "idle") {
					let nt = (i ? i(et, tt) : null) || et.key;
					savedScrollPositions[nt] = window.scrollY;
				}
				try {
					sessionStorage.setItem(
						a || SCROLL_RESTORATION_STORAGE_KEY,
						JSON.stringify(savedScrollPositions)
					);
				} catch {}
				window.history.scrollRestoration = "auto";
			}, [a, i, rt.state, et, tt])
		),
		typeof document < "u" &&
			(reactExports.useLayoutEffect(() => {
				try {
					let nt = sessionStorage.getItem(a || SCROLL_RESTORATION_STORAGE_KEY);
					nt && (savedScrollPositions = JSON.parse(nt));
				} catch {}
			}, [a]),
			reactExports.useLayoutEffect(() => {
				let nt =
						i && _e !== "/"
							? (ot, st) =>
									i(
										_extends$a({}, ot, { pathname: stripBasename(ot.pathname, _e) || ot.pathname }),
										st
									)
							: i,
					it =
						s == null
							? void 0
							: s.enableScrollRestoration(savedScrollPositions, () => window.scrollY, nt);
				return () => it && it();
			}, [s, _e, i]),
			reactExports.useLayoutEffect(() => {
				if ($ !== !1) {
					if (typeof $ == "number") {
						window.scrollTo(0, $);
						return;
					}
					if (et.hash) {
						let nt = document.getElementById(decodeURIComponent(et.hash.slice(1)));
						if (nt) {
							nt.scrollIntoView();
							return;
						}
					}
					j !== !0 && window.scrollTo(0, 0);
				}
			}, [et, $, j])));
}
function useBeforeUnload(o, i) {
	let { capture: a } = i || {};
	reactExports.useEffect(() => {
		let s = a != null ? { capture: a } : void 0;
		return (
			window.addEventListener("beforeunload", o, s),
			() => {
				window.removeEventListener("beforeunload", o, s);
			}
		);
	}, [o, a]);
}
function usePageHide(o, i) {
	let { capture: a } = i || {};
	reactExports.useEffect(() => {
		let s = a != null ? { capture: a } : void 0;
		return (
			window.addEventListener("pagehide", o, s),
			() => {
				window.removeEventListener("pagehide", o, s);
			}
		);
	}, [o, a]);
}
function usePrompt(o) {
	let { when: i, message: a } = o,
		s = useBlocker(i);
	(reactExports.useEffect(() => {
		s.state === "blocked" && (window.confirm(a) ? setTimeout(s.proceed, 0) : s.reset());
	}, [s, a]),
		reactExports.useEffect(() => {
			s.state === "blocked" && !i && s.reset();
		}, [s, i]));
}
function useViewTransitionState(o, i) {
	i === void 0 && (i = {});
	let a = reactExports.useContext(ViewTransitionContext);
	a == null && invariant(!1);
	let { basename: s } = useDataRouterContext(DataRouterHook.useViewTransitionState),
		$ = useResolvedPath(o, { relative: i.relative });
	if (!a.isTransitioning) return !1;
	let j = stripBasename(a.currentLocation.pathname, s) || a.currentLocation.pathname,
		_e = stripBasename(a.nextLocation.pathname, s) || a.nextLocation.pathname;
	return matchPath($.pathname, _e) != null || matchPath($.pathname, j) != null;
}
const dist = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			AbortedDeferredError,
			Await,
			BrowserRouter,
			Form,
			HashRouter,
			Link,
			MemoryRouter,
			NavLink,
			Navigate,
			get NavigationType() {
				return Action;
			},
			Outlet,
			Route,
			Router,
			RouterProvider,
			Routes,
			ScrollRestoration,
			UNSAFE_DataRouterContext: DataRouterContext,
			UNSAFE_DataRouterStateContext: DataRouterStateContext,
			UNSAFE_FetchersContext: FetchersContext,
			UNSAFE_LocationContext: LocationContext,
			UNSAFE_NavigationContext: NavigationContext,
			UNSAFE_RouteContext: RouteContext,
			UNSAFE_ViewTransitionContext: ViewTransitionContext,
			UNSAFE_useRouteId: useRouteId,
			UNSAFE_useScrollRestoration: useScrollRestoration,
			createBrowserRouter,
			createHashRouter,
			createMemoryRouter,
			createPath,
			createRoutesFromChildren,
			createRoutesFromElements: createRoutesFromChildren,
			createSearchParams,
			defer,
			generatePath,
			isRouteErrorResponse,
			json,
			matchPath,
			matchRoutes,
			parsePath,
			redirect,
			redirectDocument,
			renderMatches,
			resolvePath,
			unstable_HistoryRouter: HistoryRouter,
			unstable_useBlocker: useBlocker,
			unstable_usePrompt: usePrompt,
			unstable_useViewTransitionState: useViewTransitionState,
			useActionData,
			useAsyncError,
			useAsyncValue,
			useBeforeUnload,
			useFetcher,
			useFetchers,
			useFormAction,
			useHref,
			useInRouterContext,
			useLinkClickHandler,
			useLoaderData,
			useLocation,
			useMatch,
			useMatches,
			useNavigate,
			useNavigation,
			useNavigationType,
			useOutlet,
			useOutletContext,
			useParams,
			useResolvedPath,
			useRevalidator,
			useRouteError,
			useRouteLoaderData,
			useRoutes,
			useSearchParams,
			useSubmit,
		},
		Symbol.toStringTag,
		{ value: "Module" }
	)
);
var lib = { exports: {} };
const require$$1 = getAugmentedNamespace(dist);
/*! For license information please see index.js.LICENSE.txt */ (function (o, i) {
	(function (a, s) {
		o.exports = s();
	})(globalThis, function () {
		return (function () {
			var a = {
					44: function (_e, et, tt) {
						var rt = tt(497),
							nt = Symbol.for("react.element"),
							it = Symbol.for("react.fragment"),
							ot = Object.prototype.hasOwnProperty,
							st = rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
							lt = { key: !0, ref: !0, __self: !0, __source: !0 };
						((et.Fragment = it),
							(et.jsx = function (dt, pt, ct) {
								var at,
									ft = {},
									ut = null,
									ht = null;
								for (at in (ct !== void 0 && (ut = "" + ct),
								pt.key !== void 0 && (ut = "" + pt.key),
								pt.ref !== void 0 && (ht = pt.ref),
								pt))
									ot.call(pt, at) && !lt.hasOwnProperty(at) && (ft[at] = pt[at]);
								if (dt && dt.defaultProps)
									for (at in (pt = dt.defaultProps)) ft[at] === void 0 && (ft[at] = pt[at]);
								return { $$typeof: nt, type: dt, key: ut, ref: ht, props: ft, _owner: st.current };
							}));
					},
					598: function (_e, et, tt) {
						_e.exports = tt(44);
					},
					497: function (_e) {
						_e.exports = reactExports;
					},
				},
				s = {};
			function $(_e) {
				var et = s[_e];
				if (et !== void 0) return et.exports;
				var tt = (s[_e] = { exports: {} });
				return (a[_e](tt, tt.exports, $), tt.exports);
			}
			(($.d = function (_e, et) {
				for (var tt in et)
					$.o(et, tt) &&
						!$.o(_e, tt) &&
						Object.defineProperty(_e, tt, { enumerable: !0, get: et[tt] });
			}),
				($.o = function (_e, et) {
					return Object.prototype.hasOwnProperty.call(_e, et);
				}),
				($.r = function (_e) {
					(typeof Symbol < "u" &&
						Symbol.toStringTag &&
						Object.defineProperty(_e, Symbol.toStringTag, { value: "Module" }),
						Object.defineProperty(_e, "__esModule", { value: !0 }));
				}));
			var j = {};
			return (
				(function () {
					($.r(j),
						$.d(j, {
							ScrollToTop: function () {
								return nt;
							},
							useScrollToTop: function () {
								return tt;
							},
						}));
					var _e = $(497),
						et = require$$1,
						tt = function () {
							var it = (0, et.useLocation)(),
								ot = it.pathname,
								st = it.state;
							(0, _e.useEffect)(
								function () {
									(st == null ? void 0 : st.scrollToTop) !== !1 && window.scrollTo(0, 0);
								},
								[ot, st]
							);
						},
						rt = $(598),
						nt = function (it) {
							var ot = it.children;
							return (tt(), (0, rt.jsx)(rt.Fragment, { children: _e.Children.toArray(ot) }));
						};
				})(),
				j
			);
		})();
	});
})(lib);
var libExports = lib.exports;
const common = { black: "#000", white: "#fff" },
	common$1 = common,
	red = {
		50: "#ffebee",
		100: "#ffcdd2",
		200: "#ef9a9a",
		300: "#e57373",
		400: "#ef5350",
		500: "#f44336",
		600: "#e53935",
		700: "#d32f2f",
		800: "#c62828",
		900: "#b71c1c",
		A100: "#ff8a80",
		A200: "#ff5252",
		A400: "#ff1744",
		A700: "#d50000",
	},
	red$1 = red,
	purple = {
		50: "#f3e5f5",
		100: "#e1bee7",
		200: "#ce93d8",
		300: "#ba68c8",
		400: "#ab47bc",
		500: "#9c27b0",
		600: "#8e24aa",
		700: "#7b1fa2",
		800: "#6a1b9a",
		900: "#4a148c",
		A100: "#ea80fc",
		A200: "#e040fb",
		A400: "#d500f9",
		A700: "#aa00ff",
	},
	purple$1 = purple,
	blue = {
		50: "#e3f2fd",
		100: "#bbdefb",
		200: "#90caf9",
		300: "#64b5f6",
		400: "#42a5f5",
		500: "#2196f3",
		600: "#1e88e5",
		700: "#1976d2",
		800: "#1565c0",
		900: "#0d47a1",
		A100: "#82b1ff",
		A200: "#448aff",
		A400: "#2979ff",
		A700: "#2962ff",
	},
	blue$1 = blue,
	lightBlue = {
		50: "#e1f5fe",
		100: "#b3e5fc",
		200: "#81d4fa",
		300: "#4fc3f7",
		400: "#29b6f6",
		500: "#03a9f4",
		600: "#039be5",
		700: "#0288d1",
		800: "#0277bd",
		900: "#01579b",
		A100: "#80d8ff",
		A200: "#40c4ff",
		A400: "#00b0ff",
		A700: "#0091ea",
	},
	lightBlue$1 = lightBlue,
	green = {
		50: "#e8f5e9",
		100: "#c8e6c9",
		200: "#a5d6a7",
		300: "#81c784",
		400: "#66bb6a",
		500: "#4caf50",
		600: "#43a047",
		700: "#388e3c",
		800: "#2e7d32",
		900: "#1b5e20",
		A100: "#b9f6ca",
		A200: "#69f0ae",
		A400: "#00e676",
		A700: "#00c853",
	},
	green$1 = green,
	yellow = {
		50: "#fffde7",
		100: "#fff9c4",
		200: "#fff59d",
		300: "#fff176",
		400: "#ffee58",
		500: "#ffeb3b",
		600: "#fdd835",
		700: "#fbc02d",
		800: "#f9a825",
		900: "#f57f17",
		A100: "#ffff8d",
		A200: "#ffff00",
		A400: "#ffea00",
		A700: "#ffd600",
	},
	yellow$1 = yellow,
	orange = {
		50: "#fff3e0",
		100: "#ffe0b2",
		200: "#ffcc80",
		300: "#ffb74d",
		400: "#ffa726",
		500: "#ff9800",
		600: "#fb8c00",
		700: "#f57c00",
		800: "#ef6c00",
		900: "#e65100",
		A100: "#ffd180",
		A200: "#ffab40",
		A400: "#ff9100",
		A700: "#ff6d00",
	},
	orange$1 = orange,
	grey = {
		50: "#fafafa",
		100: "#f5f5f5",
		200: "#eeeeee",
		300: "#e0e0e0",
		400: "#bdbdbd",
		500: "#9e9e9e",
		600: "#757575",
		700: "#616161",
		800: "#424242",
		900: "#212121",
		A100: "#f5f5f5",
		A200: "#eeeeee",
		A400: "#bdbdbd",
		A700: "#616161",
	},
	grey$1 = grey;
function _extends$9() {
	return (
		(_extends$9 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$9.apply(this, arguments)
	);
}
function isPlainObject$1(o) {
	return o !== null && typeof o == "object" && o.constructor === Object;
}
function deepClone(o) {
	if (!isPlainObject$1(o)) return o;
	const i = {};
	return (
		Object.keys(o).forEach((a) => {
			i[a] = deepClone(o[a]);
		}),
		i
	);
}
function deepmerge(o, i, a = { clone: !0 }) {
	const s = a.clone ? _extends$9({}, o) : o;
	return (
		isPlainObject$1(o) &&
			isPlainObject$1(i) &&
			Object.keys(i).forEach(($) => {
				$ !== "__proto__" &&
					(isPlainObject$1(i[$]) && $ in o && isPlainObject$1(o[$])
						? (s[$] = deepmerge(o[$], i[$], a))
						: a.clone
							? (s[$] = isPlainObject$1(i[$]) ? deepClone(i[$]) : i[$])
							: (s[$] = i[$]));
			}),
		s
	);
}
function formatMuiErrorMessage(o) {
	let i = "https://mui.com/production-error/?code=" + o;
	for (let a = 1; a < arguments.length; a += 1) i += "&args[]=" + encodeURIComponent(arguments[a]);
	return "Minified MUI error #" + o + "; visit " + i + " for the full message.";
}
function capitalize(o) {
	if (typeof o != "string") throw new Error(formatMuiErrorMessage(7));
	return o.charAt(0).toUpperCase() + o.slice(1);
}
function createChainedFunction(...o) {
	return o.reduce(
		(i, a) =>
			a == null
				? i
				: function (...$) {
						(i.apply(this, $), a.apply(this, $));
					},
		() => {}
	);
}
function debounce(o, i = 166) {
	let a;
	function s(...$) {
		const j = () => {
			o.apply(this, $);
		};
		(clearTimeout(a), (a = setTimeout(j, i)));
	}
	return (
		(s.clear = () => {
			clearTimeout(a);
		}),
		s
	);
}
function deprecatedPropType(o, i) {
	return () => null;
}
function isMuiElement(o, i) {
	var a, s;
	return (
		reactExports.isValidElement(o) &&
		i.indexOf(
			(a = o.type.muiName) != null
				? a
				: (s = o.type) == null || (s = s._payload) == null || (s = s.value) == null
					? void 0
					: s.muiName
		) !== -1
	);
}
function ownerDocument(o) {
	return (o && o.ownerDocument) || document;
}
function ownerWindow(o) {
	return ownerDocument(o).defaultView || window;
}
function requirePropFactory(o, i) {
	return () => null;
}
function setRef(o, i) {
	typeof o == "function" ? o(i) : o && (o.current = i);
}
const useEnhancedEffect =
		typeof window < "u" ? reactExports.useLayoutEffect : reactExports.useEffect,
	useEnhancedEffect$1 = useEnhancedEffect;
let globalId = 0;
function useGlobalId(o) {
	const [i, a] = reactExports.useState(o),
		s = o || i;
	return (
		reactExports.useEffect(() => {
			i == null && ((globalId += 1), a(`mui-${globalId}`));
		}, [i]),
		s
	);
}
const maybeReactUseId = React$1["useId".toString()];
function useId(o) {
	if (maybeReactUseId !== void 0) {
		const i = maybeReactUseId();
		return o ?? i;
	}
	return useGlobalId(o);
}
function unsupportedProp(o, i, a, s, $) {
	return null;
}
function useControlled({ controlled: o, default: i, name: a, state: s = "value" }) {
	const { current: $ } = reactExports.useRef(o !== void 0),
		[j, _e] = reactExports.useState(i),
		et = $ ? o : j,
		tt = reactExports.useCallback((rt) => {
			$ || _e(rt);
		}, []);
	return [et, tt];
}
function useEventCallback(o) {
	const i = reactExports.useRef(o);
	return (
		useEnhancedEffect$1(() => {
			i.current = o;
		}),
		reactExports.useRef((...a) => (0, i.current)(...a)).current
	);
}
function useForkRef(...o) {
	return reactExports.useMemo(
		() =>
			o.every((i) => i == null)
				? null
				: (i) => {
						o.forEach((a) => {
							setRef(a, i);
						});
					},
		o
	);
}
let hadKeyboardEvent = !0,
	hadFocusVisibleRecently = !1,
	hadFocusVisibleRecentlyTimeout;
const inputTypesWhitelist = {
	text: !0,
	search: !0,
	url: !0,
	tel: !0,
	email: !0,
	password: !0,
	number: !0,
	date: !0,
	month: !0,
	week: !0,
	time: !0,
	datetime: !0,
	"datetime-local": !0,
};
function focusTriggersKeyboardModality(o) {
	const { type: i, tagName: a } = o;
	return !!(
		(a === "INPUT" && inputTypesWhitelist[i] && !o.readOnly) ||
		(a === "TEXTAREA" && !o.readOnly) ||
		o.isContentEditable
	);
}
function handleKeyDown(o) {
	o.metaKey || o.altKey || o.ctrlKey || (hadKeyboardEvent = !0);
}
function handlePointerDown() {
	hadKeyboardEvent = !1;
}
function handleVisibilityChange() {
	this.visibilityState === "hidden" && hadFocusVisibleRecently && (hadKeyboardEvent = !0);
}
function prepare(o) {
	(o.addEventListener("keydown", handleKeyDown, !0),
		o.addEventListener("mousedown", handlePointerDown, !0),
		o.addEventListener("pointerdown", handlePointerDown, !0),
		o.addEventListener("touchstart", handlePointerDown, !0),
		o.addEventListener("visibilitychange", handleVisibilityChange, !0));
}
function isFocusVisible(o) {
	const { target: i } = o;
	try {
		return i.matches(":focus-visible");
	} catch {}
	return hadKeyboardEvent || focusTriggersKeyboardModality(i);
}
function useIsFocusVisible() {
	const o = reactExports.useCallback(($) => {
			$ != null && prepare($.ownerDocument);
		}, []),
		i = reactExports.useRef(!1);
	function a() {
		return i.current
			? ((hadFocusVisibleRecently = !0),
				window.clearTimeout(hadFocusVisibleRecentlyTimeout),
				(hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
					hadFocusVisibleRecently = !1;
				}, 100)),
				(i.current = !1),
				!0)
			: !1;
	}
	function s($) {
		return isFocusVisible($) ? ((i.current = !0), !0) : !1;
	}
	return { isFocusVisibleRef: i, onFocus: s, onBlur: a, ref: o };
}
function resolveProps(o, i) {
	const a = _extends$9({}, i);
	return (
		Object.keys(o).forEach((s) => {
			if (s.toString().match(/^(components|slots)$/)) a[s] = _extends$9({}, o[s], a[s]);
			else if (s.toString().match(/^(componentsProps|slotProps)$/)) {
				const $ = o[s] || {},
					j = i[s];
				((a[s] = {}),
					!j || !Object.keys(j)
						? (a[s] = $)
						: !$ || !Object.keys($)
							? (a[s] = j)
							: ((a[s] = _extends$9({}, j)),
								Object.keys($).forEach((_e) => {
									a[s][_e] = resolveProps($[_e], j[_e]);
								})));
			} else a[s] === void 0 && (a[s] = o[s]);
		}),
		a
	);
}
function composeClasses(o, i, a = void 0) {
	const s = {};
	return (
		Object.keys(o).forEach(($) => {
			s[$] = o[$]
				.reduce((j, _e) => {
					if (_e) {
						const et = i(_e);
						(et !== "" && j.push(et), a && a[_e] && j.push(a[_e]));
					}
					return j;
				}, [])
				.join(" ");
		}),
		s
	);
}
const defaultGenerator = (o) => o,
	createClassNameGenerator = () => {
		let o = defaultGenerator;
		return {
			configure(i) {
				o = i;
			},
			generate(i) {
				return o(i);
			},
			reset() {
				o = defaultGenerator;
			},
		};
	},
	ClassNameGenerator = createClassNameGenerator(),
	ClassNameGenerator$1 = ClassNameGenerator,
	globalStateClassesMapping = {
		active: "active",
		checked: "checked",
		completed: "completed",
		disabled: "disabled",
		error: "error",
		expanded: "expanded",
		focused: "focused",
		focusVisible: "focusVisible",
		open: "open",
		readOnly: "readOnly",
		required: "required",
		selected: "selected",
	};
function generateUtilityClass(o, i, a = "Mui") {
	const s = globalStateClassesMapping[i];
	return s ? `${a}-${s}` : `${ClassNameGenerator$1.generate(o)}-${i}`;
}
function generateUtilityClasses(o, i, a = "Mui") {
	const s = {};
	return (
		i.forEach(($) => {
			s[$] = generateUtilityClass(o, $, a);
		}),
		s
	);
}
const THEME_ID = "$$material";
function _objectWithoutPropertiesLoose(o, i) {
	if (o == null) return {};
	var a = {},
		s = Object.keys(o),
		$,
		j;
	for (j = 0; j < s.length; j++) (($ = s[j]), !(i.indexOf($) >= 0) && (a[$] = o[$]));
	return a;
}
function memoize$1(o) {
	var i = Object.create(null);
	return function (a) {
		return (i[a] === void 0 && (i[a] = o(a)), i[a]);
	};
}
var reactPropsRegex =
		/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,
	isPropValid = memoize$1(function (o) {
		return (
			reactPropsRegex.test(o) ||
			(o.charCodeAt(0) === 111 && o.charCodeAt(1) === 110 && o.charCodeAt(2) < 91)
		);
	});
function sheetForTag(o) {
	if (o.sheet) return o.sheet;
	for (var i = 0; i < document.styleSheets.length; i++)
		if (document.styleSheets[i].ownerNode === o) return document.styleSheets[i];
}
function createStyleElement(o) {
	var i = document.createElement("style");
	return (
		i.setAttribute("data-emotion", o.key),
		o.nonce !== void 0 && i.setAttribute("nonce", o.nonce),
		i.appendChild(document.createTextNode("")),
		i.setAttribute("data-s", ""),
		i
	);
}
var StyleSheet = (function () {
		function o(a) {
			var s = this;
			((this._insertTag = function ($) {
				var j;
				(s.tags.length === 0
					? s.insertionPoint
						? (j = s.insertionPoint.nextSibling)
						: s.prepend
							? (j = s.container.firstChild)
							: (j = s.before)
					: (j = s.tags[s.tags.length - 1].nextSibling),
					s.container.insertBefore($, j),
					s.tags.push($));
			}),
				(this.isSpeedy = a.speedy === void 0 ? !0 : a.speedy),
				(this.tags = []),
				(this.ctr = 0),
				(this.nonce = a.nonce),
				(this.key = a.key),
				(this.container = a.container),
				(this.prepend = a.prepend),
				(this.insertionPoint = a.insertionPoint),
				(this.before = null));
		}
		var i = o.prototype;
		return (
			(i.hydrate = function (s) {
				s.forEach(this._insertTag);
			}),
			(i.insert = function (s) {
				this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(createStyleElement(this));
				var $ = this.tags[this.tags.length - 1];
				if (this.isSpeedy) {
					var j = sheetForTag($);
					try {
						j.insertRule(s, j.cssRules.length);
					} catch {}
				} else $.appendChild(document.createTextNode(s));
				this.ctr++;
			}),
			(i.flush = function () {
				(this.tags.forEach(function (s) {
					return s.parentNode && s.parentNode.removeChild(s);
				}),
					(this.tags = []),
					(this.ctr = 0));
			}),
			o
		);
	})(),
	MS = "-ms-",
	MOZ = "-moz-",
	WEBKIT = "-webkit-",
	COMMENT = "comm",
	RULESET = "rule",
	DECLARATION = "decl",
	IMPORT = "@import",
	KEYFRAMES = "@keyframes",
	LAYER = "@layer",
	abs = Math.abs,
	from = String.fromCharCode,
	assign = Object.assign;
function hash(o, i) {
	return charat(o, 0) ^ 45
		? (((((((i << 2) ^ charat(o, 0)) << 2) ^ charat(o, 1)) << 2) ^ charat(o, 2)) << 2) ^
				charat(o, 3)
		: 0;
}
function trim(o) {
	return o.trim();
}
function match(o, i) {
	return (o = i.exec(o)) ? o[0] : o;
}
function replace(o, i, a) {
	return o.replace(i, a);
}
function indexof(o, i) {
	return o.indexOf(i);
}
function charat(o, i) {
	return o.charCodeAt(i) | 0;
}
function substr(o, i, a) {
	return o.slice(i, a);
}
function strlen(o) {
	return o.length;
}
function sizeof(o) {
	return o.length;
}
function append(o, i) {
	return (i.push(o), o);
}
function combine(o, i) {
	return o.map(i).join("");
}
var line = 1,
	column = 1,
	length = 0,
	position = 0,
	character = 0,
	characters = "";
function node(o, i, a, s, $, j, _e) {
	return {
		value: o,
		root: i,
		parent: a,
		type: s,
		props: $,
		children: j,
		line,
		column,
		length: _e,
		return: "",
	};
}
function copy(o, i) {
	return assign(node("", null, null, "", null, null, 0), o, { length: -o.length }, i);
}
function char() {
	return character;
}
function prev() {
	return (
		(character = position > 0 ? charat(characters, --position) : 0),
		column--,
		character === 10 && ((column = 1), line--),
		character
	);
}
function next() {
	return (
		(character = position < length ? charat(characters, position++) : 0),
		column++,
		character === 10 && ((column = 1), line++),
		character
	);
}
function peek() {
	return charat(characters, position);
}
function caret() {
	return position;
}
function slice(o, i) {
	return substr(characters, o, i);
}
function token(o) {
	switch (o) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32:
			return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125:
			return 4;
		case 58:
			return 3;
		case 34:
		case 39:
		case 40:
		case 91:
			return 2;
		case 41:
		case 93:
			return 1;
	}
	return 0;
}
function alloc(o) {
	return ((line = column = 1), (length = strlen((characters = o))), (position = 0), []);
}
function dealloc(o) {
	return ((characters = ""), o);
}
function delimit(o) {
	return trim(slice(position - 1, delimiter(o === 91 ? o + 2 : o === 40 ? o + 1 : o)));
}
function whitespace(o) {
	for (; (character = peek()) && character < 33; ) next();
	return token(o) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(o, i) {
	for (
		;
		--i &&
		next() &&
		!(
			character < 48 ||
			character > 102 ||
			(character > 57 && character < 65) ||
			(character > 70 && character < 97)
		);
	);
	return slice(o, caret() + (i < 6 && peek() == 32 && next() == 32));
}
function delimiter(o) {
	for (; next(); )
		switch (character) {
			case o:
				return position;
			case 34:
			case 39:
				o !== 34 && o !== 39 && delimiter(character);
				break;
			case 40:
				o === 41 && delimiter(o);
				break;
			case 92:
				next();
				break;
		}
	return position;
}
function commenter(o, i) {
	for (; next() && o + character !== 47 + 10; )
		if (o + character === 42 + 42 && peek() === 47) break;
	return "/*" + slice(i, position - 1) + "*" + from(o === 47 ? o : next());
}
function identifier(o) {
	for (; !token(peek()); ) next();
	return slice(o, position);
}
function compile(o) {
	return dealloc(parse("", null, null, null, [""], (o = alloc(o)), 0, [0], o));
}
function parse(o, i, a, s, $, j, _e, et, tt) {
	for (
		var rt = 0,
			nt = 0,
			it = _e,
			ot = 0,
			st = 0,
			lt = 0,
			dt = 1,
			pt = 1,
			ct = 1,
			at = 0,
			ft = "",
			ut = $,
			ht = j,
			yt = s,
			mt = ft;
		pt;
	)
		switch (((lt = at), (at = next()))) {
			case 40:
				if (lt != 108 && charat(mt, it - 1) == 58) {
					indexof((mt += replace(delimit(at), "&", "&\f")), "&\f") != -1 && (ct = -1);
					break;
				}
			case 34:
			case 39:
			case 91:
				mt += delimit(at);
				break;
			case 9:
			case 10:
			case 13:
			case 32:
				mt += whitespace(lt);
				break;
			case 92:
				mt += escaping(caret() - 1, 7);
				continue;
			case 47:
				switch (peek()) {
					case 42:
					case 47:
						append(comment(commenter(next(), caret()), i, a), tt);
						break;
					default:
						mt += "/";
				}
				break;
			case 123 * dt:
				et[rt++] = strlen(mt) * ct;
			case 125 * dt:
			case 59:
			case 0:
				switch (at) {
					case 0:
					case 125:
						pt = 0;
					case 59 + nt:
						(ct == -1 && (mt = replace(mt, /\f/g, "")),
							st > 0 &&
								strlen(mt) - it &&
								append(
									st > 32
										? declaration(mt + ";", s, a, it - 1)
										: declaration(replace(mt, " ", "") + ";", s, a, it - 2),
									tt
								));
						break;
					case 59:
						mt += ";";
					default:
						if (
							(append((yt = ruleset(mt, i, a, rt, nt, $, et, ft, (ut = []), (ht = []), it)), j),
							at === 123)
						)
							if (nt === 0) parse(mt, i, yt, yt, ut, j, it, et, ht);
							else
								switch (ot === 99 && charat(mt, 3) === 110 ? 100 : ot) {
									case 100:
									case 108:
									case 109:
									case 115:
										parse(
											o,
											yt,
											yt,
											s && append(ruleset(o, yt, yt, 0, 0, $, et, ft, $, (ut = []), it), ht),
											$,
											ht,
											it,
											et,
											s ? ut : ht
										);
										break;
									default:
										parse(mt, yt, yt, yt, [""], ht, 0, et, ht);
								}
				}
				((rt = nt = st = 0), (dt = ct = 1), (ft = mt = ""), (it = _e));
				break;
			case 58:
				((it = 1 + strlen(mt)), (st = lt));
			default:
				if (dt < 1) {
					if (at == 123) --dt;
					else if (at == 125 && dt++ == 0 && prev() == 125) continue;
				}
				switch (((mt += from(at)), at * dt)) {
					case 38:
						ct = nt > 0 ? 1 : ((mt += "\f"), -1);
						break;
					case 44:
						((et[rt++] = (strlen(mt) - 1) * ct), (ct = 1));
						break;
					case 64:
						(peek() === 45 && (mt += delimit(next())),
							(ot = peek()),
							(nt = it = strlen((ft = mt += identifier(caret())))),
							at++);
						break;
					case 45:
						lt === 45 && strlen(mt) == 2 && (dt = 0);
				}
		}
	return j;
}
function ruleset(o, i, a, s, $, j, _e, et, tt, rt, nt) {
	for (
		var it = $ - 1, ot = $ === 0 ? j : [""], st = sizeof(ot), lt = 0, dt = 0, pt = 0;
		lt < s;
		++lt
	)
		for (var ct = 0, at = substr(o, it + 1, (it = abs((dt = _e[lt])))), ft = o; ct < st; ++ct)
			(ft = trim(dt > 0 ? ot[ct] + " " + at : replace(at, /&\f/g, ot[ct]))) && (tt[pt++] = ft);
	return node(o, i, a, $ === 0 ? RULESET : et, tt, rt, nt);
}
function comment(o, i, a) {
	return node(o, i, a, COMMENT, from(char()), substr(o, 2, -2), 0);
}
function declaration(o, i, a, s) {
	return node(o, i, a, DECLARATION, substr(o, 0, s), substr(o, s + 1, -1), s);
}
function serialize(o, i) {
	for (var a = "", s = sizeof(o), $ = 0; $ < s; $++) a += i(o[$], $, o, i) || "";
	return a;
}
function stringify(o, i, a, s) {
	switch (o.type) {
		case LAYER:
			if (o.children.length) break;
		case IMPORT:
		case DECLARATION:
			return (o.return = o.return || o.value);
		case COMMENT:
			return "";
		case KEYFRAMES:
			return (o.return = o.value + "{" + serialize(o.children, s) + "}");
		case RULESET:
			o.value = o.props.join(",");
	}
	return strlen((a = serialize(o.children, s))) ? (o.return = o.value + "{" + a + "}") : "";
}
function middleware(o) {
	var i = sizeof(o);
	return function (a, s, $, j) {
		for (var _e = "", et = 0; et < i; et++) _e += o[et](a, s, $, j) || "";
		return _e;
	};
}
function rulesheet(o) {
	return function (i) {
		i.root || ((i = i.return) && o(i));
	};
}
var identifierWithPointTracking = function (i, a, s) {
		for (var $ = 0, j = 0; ($ = j), (j = peek()), $ === 38 && j === 12 && (a[s] = 1), !token(j); )
			next();
		return slice(i, position);
	},
	toRules = function (i, a) {
		var s = -1,
			$ = 44;
		do
			switch (token($)) {
				case 0:
					($ === 38 && peek() === 12 && (a[s] = 1),
						(i[s] += identifierWithPointTracking(position - 1, a, s)));
					break;
				case 2:
					i[s] += delimit($);
					break;
				case 4:
					if ($ === 44) {
						((i[++s] = peek() === 58 ? "&\f" : ""), (a[s] = i[s].length));
						break;
					}
				default:
					i[s] += from($);
			}
		while (($ = next()));
		return i;
	},
	getRules = function (i, a) {
		return dealloc(toRules(alloc(i), a));
	},
	fixedElements = new WeakMap(),
	compat = function (i) {
		if (!(i.type !== "rule" || !i.parent || i.length < 1)) {
			for (
				var a = i.value, s = i.parent, $ = i.column === s.column && i.line === s.line;
				s.type !== "rule";
			)
				if (((s = s.parent), !s)) return;
			if (!(i.props.length === 1 && a.charCodeAt(0) !== 58 && !fixedElements.get(s)) && !$) {
				fixedElements.set(i, !0);
				for (var j = [], _e = getRules(a, j), et = s.props, tt = 0, rt = 0; tt < _e.length; tt++)
					for (var nt = 0; nt < et.length; nt++, rt++)
						i.props[rt] = j[tt] ? _e[tt].replace(/&\f/g, et[nt]) : et[nt] + " " + _e[tt];
			}
		}
	},
	removeLabel = function (i) {
		if (i.type === "decl") {
			var a = i.value;
			a.charCodeAt(0) === 108 && a.charCodeAt(2) === 98 && ((i.return = ""), (i.value = ""));
		}
	};
function prefix(o, i) {
	switch (hash(o, i)) {
		case 5103:
			return WEBKIT + "print-" + o + o;
		case 5737:
		case 4201:
		case 3177:
		case 3433:
		case 1641:
		case 4457:
		case 2921:
		case 5572:
		case 6356:
		case 5844:
		case 3191:
		case 6645:
		case 3005:
		case 6391:
		case 5879:
		case 5623:
		case 6135:
		case 4599:
		case 4855:
		case 4215:
		case 6389:
		case 5109:
		case 5365:
		case 5621:
		case 3829:
			return WEBKIT + o + o;
		case 5349:
		case 4246:
		case 4810:
		case 6968:
		case 2756:
			return WEBKIT + o + MOZ + o + MS + o + o;
		case 6828:
		case 4268:
			return WEBKIT + o + MS + o + o;
		case 6165:
			return WEBKIT + o + MS + "flex-" + o + o;
		case 5187:
			return WEBKIT + o + replace(o, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + o;
		case 5443:
			return WEBKIT + o + MS + "flex-item-" + replace(o, /flex-|-self/, "") + o;
		case 4675:
			return WEBKIT + o + MS + "flex-line-pack" + replace(o, /align-content|flex-|-self/, "") + o;
		case 5548:
			return WEBKIT + o + MS + replace(o, "shrink", "negative") + o;
		case 5292:
			return WEBKIT + o + MS + replace(o, "basis", "preferred-size") + o;
		case 6060:
			return (
				WEBKIT +
				"box-" +
				replace(o, "-grow", "") +
				WEBKIT +
				o +
				MS +
				replace(o, "grow", "positive") +
				o
			);
		case 4554:
			return WEBKIT + replace(o, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + o;
		case 6187:
			return (
				replace(
					replace(replace(o, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"),
					o,
					""
				) + o
			);
		case 5495:
		case 3959:
			return replace(o, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
		case 4968:
			return (
				replace(
					replace(o, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"),
					/s.+-b[^;]+/,
					"justify"
				) +
				WEBKIT +
				o +
				o
			);
		case 4095:
		case 3583:
		case 4068:
		case 2532:
			return replace(o, /(.+)-inline(.+)/, WEBKIT + "$1$2") + o;
		case 8116:
		case 7059:
		case 5753:
		case 5535:
		case 5445:
		case 5701:
		case 4933:
		case 4677:
		case 5533:
		case 5789:
		case 5021:
		case 4765:
			if (strlen(o) - 1 - i > 6)
				switch (charat(o, i + 1)) {
					case 109:
						if (charat(o, i + 4) !== 45) break;
					case 102:
						return (
							replace(
								o,
								/(.+:)(.+)-([^]+)/,
								"$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(o, i + 3) == 108 ? "$3" : "$2-$3")
							) + o
						);
					case 115:
						return ~indexof(o, "stretch")
							? prefix(replace(o, "stretch", "fill-available"), i) + o
							: o;
				}
			break;
		case 4949:
			if (charat(o, i + 1) !== 115) break;
		case 6444:
			switch (charat(o, strlen(o) - 3 - (~indexof(o, "!important") && 10))) {
				case 107:
					return replace(o, ":", ":" + WEBKIT) + o;
				case 101:
					return (
						replace(
							o,
							/(.+:)([^;!]+)(;|!.+)?/,
							"$1" +
								WEBKIT +
								(charat(o, 14) === 45 ? "inline-" : "") +
								"box$3$1" +
								WEBKIT +
								"$2$3$1" +
								MS +
								"$2box$3"
						) + o
					);
			}
			break;
		case 5936:
			switch (charat(o, i + 11)) {
				case 114:
					return WEBKIT + o + MS + replace(o, /[svh]\w+-[tblr]{2}/, "tb") + o;
				case 108:
					return WEBKIT + o + MS + replace(o, /[svh]\w+-[tblr]{2}/, "tb-rl") + o;
				case 45:
					return WEBKIT + o + MS + replace(o, /[svh]\w+-[tblr]{2}/, "lr") + o;
			}
			return WEBKIT + o + MS + o + o;
	}
	return o;
}
var prefixer = function (i, a, s, $) {
		if (i.length > -1 && !i.return)
			switch (i.type) {
				case DECLARATION:
					i.return = prefix(i.value, i.length);
					break;
				case KEYFRAMES:
					return serialize([copy(i, { value: replace(i.value, "@", "@" + WEBKIT) })], $);
				case RULESET:
					if (i.length)
						return combine(i.props, function (j) {
							switch (match(j, /(::plac\w+|:read-\w+)/)) {
								case ":read-only":
								case ":read-write":
									return serialize(
										[copy(i, { props: [replace(j, /:(read-\w+)/, ":" + MOZ + "$1")] })],
										$
									);
								case "::placeholder":
									return serialize(
										[
											copy(i, { props: [replace(j, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }),
											copy(i, { props: [replace(j, /:(plac\w+)/, ":" + MOZ + "$1")] }),
											copy(i, { props: [replace(j, /:(plac\w+)/, MS + "input-$1")] }),
										],
										$
									);
							}
							return "";
						});
			}
	},
	defaultStylisPlugins = [prefixer],
	createCache = function (i) {
		var a = i.key;
		if (a === "css") {
			var s = document.querySelectorAll("style[data-emotion]:not([data-s])");
			Array.prototype.forEach.call(s, function (dt) {
				var pt = dt.getAttribute("data-emotion");
				pt.indexOf(" ") !== -1 && (document.head.appendChild(dt), dt.setAttribute("data-s", ""));
			});
		}
		var $ = i.stylisPlugins || defaultStylisPlugins,
			j = {},
			_e,
			et = [];
		((_e = i.container || document.head),
			Array.prototype.forEach.call(
				document.querySelectorAll('style[data-emotion^="' + a + ' "]'),
				function (dt) {
					for (var pt = dt.getAttribute("data-emotion").split(" "), ct = 1; ct < pt.length; ct++)
						j[pt[ct]] = !0;
					et.push(dt);
				}
			));
		var tt,
			rt = [compat, removeLabel];
		{
			var nt,
				it = [
					stringify,
					rulesheet(function (dt) {
						nt.insert(dt);
					}),
				],
				ot = middleware(rt.concat($, it)),
				st = function (pt) {
					return serialize(compile(pt), ot);
				};
			tt = function (pt, ct, at, ft) {
				((nt = at),
					st(pt ? pt + "{" + ct.styles + "}" : ct.styles),
					ft && (lt.inserted[ct.name] = !0));
			};
		}
		var lt = {
			key: a,
			sheet: new StyleSheet({
				key: a,
				container: _e,
				nonce: i.nonce,
				speedy: i.speedy,
				prepend: i.prepend,
				insertionPoint: i.insertionPoint,
			}),
			nonce: i.nonce,
			inserted: j,
			registered: {},
			insert: tt,
		};
		return (lt.sheet.hydrate(et), lt);
	},
	reactIs$1 = { exports: {} },
	reactIs_production_min = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var b = typeof Symbol == "function" && Symbol.for,
	c = b ? Symbol.for("react.element") : 60103,
	d = b ? Symbol.for("react.portal") : 60106,
	e = b ? Symbol.for("react.fragment") : 60107,
	f = b ? Symbol.for("react.strict_mode") : 60108,
	g = b ? Symbol.for("react.profiler") : 60114,
	h = b ? Symbol.for("react.provider") : 60109,
	k = b ? Symbol.for("react.context") : 60110,
	l = b ? Symbol.for("react.async_mode") : 60111,
	m = b ? Symbol.for("react.concurrent_mode") : 60111,
	n = b ? Symbol.for("react.forward_ref") : 60112,
	p = b ? Symbol.for("react.suspense") : 60113,
	q = b ? Symbol.for("react.suspense_list") : 60120,
	r$1 = b ? Symbol.for("react.memo") : 60115,
	t = b ? Symbol.for("react.lazy") : 60116,
	v = b ? Symbol.for("react.block") : 60121,
	w = b ? Symbol.for("react.fundamental") : 60117,
	x = b ? Symbol.for("react.responder") : 60118,
	y = b ? Symbol.for("react.scope") : 60119;
function z(o) {
	if (typeof o == "object" && o !== null) {
		var i = o.$$typeof;
		switch (i) {
			case c:
				switch (((o = o.type), o)) {
					case l:
					case m:
					case e:
					case g:
					case f:
					case p:
						return o;
					default:
						switch (((o = o && o.$$typeof), o)) {
							case k:
							case n:
							case t:
							case r$1:
							case h:
								return o;
							default:
								return i;
						}
				}
			case d:
				return i;
		}
	}
}
function A(o) {
	return z(o) === m;
}
reactIs_production_min.AsyncMode = l;
reactIs_production_min.ConcurrentMode = m;
reactIs_production_min.ContextConsumer = k;
reactIs_production_min.ContextProvider = h;
reactIs_production_min.Element = c;
reactIs_production_min.ForwardRef = n;
reactIs_production_min.Fragment = e;
reactIs_production_min.Lazy = t;
reactIs_production_min.Memo = r$1;
reactIs_production_min.Portal = d;
reactIs_production_min.Profiler = g;
reactIs_production_min.StrictMode = f;
reactIs_production_min.Suspense = p;
reactIs_production_min.isAsyncMode = function (o) {
	return A(o) || z(o) === l;
};
reactIs_production_min.isConcurrentMode = A;
reactIs_production_min.isContextConsumer = function (o) {
	return z(o) === k;
};
reactIs_production_min.isContextProvider = function (o) {
	return z(o) === h;
};
reactIs_production_min.isElement = function (o) {
	return typeof o == "object" && o !== null && o.$$typeof === c;
};
reactIs_production_min.isForwardRef = function (o) {
	return z(o) === n;
};
reactIs_production_min.isFragment = function (o) {
	return z(o) === e;
};
reactIs_production_min.isLazy = function (o) {
	return z(o) === t;
};
reactIs_production_min.isMemo = function (o) {
	return z(o) === r$1;
};
reactIs_production_min.isPortal = function (o) {
	return z(o) === d;
};
reactIs_production_min.isProfiler = function (o) {
	return z(o) === g;
};
reactIs_production_min.isStrictMode = function (o) {
	return z(o) === f;
};
reactIs_production_min.isSuspense = function (o) {
	return z(o) === p;
};
reactIs_production_min.isValidElementType = function (o) {
	return (
		typeof o == "string" ||
		typeof o == "function" ||
		o === e ||
		o === m ||
		o === g ||
		o === f ||
		o === p ||
		o === q ||
		(typeof o == "object" &&
			o !== null &&
			(o.$$typeof === t ||
				o.$$typeof === r$1 ||
				o.$$typeof === h ||
				o.$$typeof === k ||
				o.$$typeof === n ||
				o.$$typeof === w ||
				o.$$typeof === x ||
				o.$$typeof === y ||
				o.$$typeof === v))
	);
};
reactIs_production_min.typeOf = z;
reactIs$1.exports = reactIs_production_min;
var reactIsExports = reactIs$1.exports,
	reactIs = reactIsExports,
	FORWARD_REF_STATICS = {
		$$typeof: !0,
		render: !0,
		defaultProps: !0,
		displayName: !0,
		propTypes: !0,
	},
	MEMO_STATICS = {
		$$typeof: !0,
		compare: !0,
		defaultProps: !0,
		displayName: !0,
		propTypes: !0,
		type: !0,
	},
	TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
var isBrowser = !0;
function getRegisteredStyles(o, i, a) {
	var s = "";
	return (
		a.split(" ").forEach(function ($) {
			o[$] !== void 0 ? i.push(o[$] + ";") : (s += $ + " ");
		}),
		s
	);
}
var registerStyles = function (i, a, s) {
		var $ = i.key + "-" + a.name;
		(s === !1 || isBrowser === !1) && i.registered[$] === void 0 && (i.registered[$] = a.styles);
	},
	insertStyles = function (i, a, s) {
		registerStyles(i, a, s);
		var $ = i.key + "-" + a.name;
		if (i.inserted[a.name] === void 0) {
			var j = a;
			do (i.insert(a === j ? "." + $ : "", j, i.sheet, !0), (j = j.next));
			while (j !== void 0);
		}
	};
function murmur2(o) {
	for (var i = 0, a, s = 0, $ = o.length; $ >= 4; ++s, $ -= 4)
		((a =
			(o.charCodeAt(s) & 255) |
			((o.charCodeAt(++s) & 255) << 8) |
			((o.charCodeAt(++s) & 255) << 16) |
			((o.charCodeAt(++s) & 255) << 24)),
			(a = (a & 65535) * 1540483477 + (((a >>> 16) * 59797) << 16)),
			(a ^= a >>> 24),
			(i =
				((a & 65535) * 1540483477 + (((a >>> 16) * 59797) << 16)) ^
				((i & 65535) * 1540483477 + (((i >>> 16) * 59797) << 16))));
	switch ($) {
		case 3:
			i ^= (o.charCodeAt(s + 2) & 255) << 16;
		case 2:
			i ^= (o.charCodeAt(s + 1) & 255) << 8;
		case 1:
			((i ^= o.charCodeAt(s) & 255), (i = (i & 65535) * 1540483477 + (((i >>> 16) * 59797) << 16)));
	}
	return (
		(i ^= i >>> 13),
		(i = (i & 65535) * 1540483477 + (((i >>> 16) * 59797) << 16)),
		((i ^ (i >>> 15)) >>> 0).toString(36)
	);
}
var unitlessKeys = {
		animationIterationCount: 1,
		aspectRatio: 1,
		borderImageOutset: 1,
		borderImageSlice: 1,
		borderImageWidth: 1,
		boxFlex: 1,
		boxFlexGroup: 1,
		boxOrdinalGroup: 1,
		columnCount: 1,
		columns: 1,
		flex: 1,
		flexGrow: 1,
		flexPositive: 1,
		flexShrink: 1,
		flexNegative: 1,
		flexOrder: 1,
		gridRow: 1,
		gridRowEnd: 1,
		gridRowSpan: 1,
		gridRowStart: 1,
		gridColumn: 1,
		gridColumnEnd: 1,
		gridColumnSpan: 1,
		gridColumnStart: 1,
		msGridRow: 1,
		msGridRowSpan: 1,
		msGridColumn: 1,
		msGridColumnSpan: 1,
		fontWeight: 1,
		lineHeight: 1,
		opacity: 1,
		order: 1,
		orphans: 1,
		tabSize: 1,
		widows: 1,
		zIndex: 1,
		zoom: 1,
		WebkitLineClamp: 1,
		fillOpacity: 1,
		floodOpacity: 1,
		stopOpacity: 1,
		strokeDasharray: 1,
		strokeDashoffset: 1,
		strokeMiterlimit: 1,
		strokeOpacity: 1,
		strokeWidth: 1,
	},
	hyphenateRegex = /[A-Z]|^ms/g,
	animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g,
	isCustomProperty = function (i) {
		return i.charCodeAt(1) === 45;
	},
	isProcessableValue = function (i) {
		return i != null && typeof i != "boolean";
	},
	processStyleName = memoize$1(function (o) {
		return isCustomProperty(o) ? o : o.replace(hyphenateRegex, "-$&").toLowerCase();
	}),
	processStyleValue = function (i, a) {
		switch (i) {
			case "animation":
			case "animationName":
				if (typeof a == "string")
					return a.replace(animationRegex, function (s, $, j) {
						return ((cursor = { name: $, styles: j, next: cursor }), $);
					});
		}
		return unitlessKeys[i] !== 1 && !isCustomProperty(i) && typeof a == "number" && a !== 0
			? a + "px"
			: a;
	},
	noComponentSelectorMessage =
		"Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
function handleInterpolation(o, i, a) {
	if (a == null) return "";
	if (a.__emotion_styles !== void 0) return a;
	switch (typeof a) {
		case "boolean":
			return "";
		case "object": {
			if (a.anim === 1)
				return ((cursor = { name: a.name, styles: a.styles, next: cursor }), a.name);
			if (a.styles !== void 0) {
				var s = a.next;
				if (s !== void 0)
					for (; s !== void 0; )
						((cursor = { name: s.name, styles: s.styles, next: cursor }), (s = s.next));
				var $ = a.styles + ";";
				return $;
			}
			return createStringFromObject(o, i, a);
		}
		case "function": {
			if (o !== void 0) {
				var j = cursor,
					_e = a(o);
				return ((cursor = j), handleInterpolation(o, i, _e));
			}
			break;
		}
	}
	if (i == null) return a;
	var et = i[a];
	return et !== void 0 ? et : a;
}
function createStringFromObject(o, i, a) {
	var s = "";
	if (Array.isArray(a))
		for (var $ = 0; $ < a.length; $++) s += handleInterpolation(o, i, a[$]) + ";";
	else
		for (var j in a) {
			var _e = a[j];
			if (typeof _e != "object")
				i != null && i[_e] !== void 0
					? (s += j + "{" + i[_e] + "}")
					: isProcessableValue(_e) &&
						(s += processStyleName(j) + ":" + processStyleValue(j, _e) + ";");
			else if (Array.isArray(_e) && typeof _e[0] == "string" && (i == null || i[_e[0]] === void 0))
				for (var et = 0; et < _e.length; et++)
					isProcessableValue(_e[et]) &&
						(s += processStyleName(j) + ":" + processStyleValue(j, _e[et]) + ";");
			else {
				var tt = handleInterpolation(o, i, _e);
				switch (j) {
					case "animation":
					case "animationName": {
						s += processStyleName(j) + ":" + tt + ";";
						break;
					}
					default:
						s += j + "{" + tt + "}";
				}
			}
		}
	return s;
}
var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g,
	cursor,
	serializeStyles = function (i, a, s) {
		if (i.length === 1 && typeof i[0] == "object" && i[0] !== null && i[0].styles !== void 0)
			return i[0];
		var $ = !0,
			j = "";
		cursor = void 0;
		var _e = i[0];
		_e == null || _e.raw === void 0
			? (($ = !1), (j += handleInterpolation(s, a, _e)))
			: (j += _e[0]);
		for (var et = 1; et < i.length; et++)
			((j += handleInterpolation(s, a, i[et])), $ && (j += _e[et]));
		labelPattern.lastIndex = 0;
		for (var tt = "", rt; (rt = labelPattern.exec(j)) !== null; ) tt += "-" + rt[1];
		var nt = murmur2(j) + tt;
		return { name: nt, styles: j, next: cursor };
	},
	syncFallback = function (i) {
		return i();
	},
	useInsertionEffect = React$1["useInsertionEffect"] ? React$1["useInsertionEffect"] : !1,
	useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback,
	useInsertionEffectWithLayoutFallback = useInsertionEffect || reactExports.useLayoutEffect,
	EmotionCacheContext = reactExports.createContext(
		typeof HTMLElement < "u" ? createCache({ key: "css" }) : null
	);
EmotionCacheContext.Provider;
var withEmotionCache = function (i) {
		return reactExports.forwardRef(function (a, s) {
			var $ = reactExports.useContext(EmotionCacheContext);
			return i(a, $, s);
		});
	},
	ThemeContext$2 = reactExports.createContext({}),
	Global = withEmotionCache(function (o, i) {
		var a = o.styles,
			s = serializeStyles([a], void 0, reactExports.useContext(ThemeContext$2)),
			$ = reactExports.useRef();
		return (
			useInsertionEffectWithLayoutFallback(
				function () {
					var j = i.key + "-global",
						_e = new i.sheet.constructor({
							key: j,
							nonce: i.sheet.nonce,
							container: i.sheet.container,
							speedy: i.sheet.isSpeedy,
						}),
						et = !1,
						tt = document.querySelector('style[data-emotion="' + j + " " + s.name + '"]');
					return (
						i.sheet.tags.length && (_e.before = i.sheet.tags[0]),
						tt !== null && ((et = !0), tt.setAttribute("data-emotion", j), _e.hydrate([tt])),
						($.current = [_e, et]),
						function () {
							_e.flush();
						}
					);
				},
				[i]
			),
			useInsertionEffectWithLayoutFallback(
				function () {
					var j = $.current,
						_e = j[0],
						et = j[1];
					if (et) {
						j[1] = !1;
						return;
					}
					if ((s.next !== void 0 && insertStyles(i, s.next, !0), _e.tags.length)) {
						var tt = _e.tags[_e.tags.length - 1].nextElementSibling;
						((_e.before = tt), _e.flush());
					}
					i.insert("", s, _e, !1);
				},
				[i, s.name]
			),
			null
		);
	});
function css() {
	for (var o = arguments.length, i = new Array(o), a = 0; a < o; a++) i[a] = arguments[a];
	return serializeStyles(i);
}
var keyframes = function () {
		var i = css.apply(void 0, arguments),
			a = "animation-" + i.name;
		return {
			name: a,
			styles: "@keyframes " + a + "{" + i.styles + "}",
			anim: 1,
			toString: function () {
				return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
			},
		};
	},
	testOmitPropsOnStringTag = isPropValid,
	testOmitPropsOnComponent = function (i) {
		return i !== "theme";
	},
	getDefaultShouldForwardProp = function (i) {
		return typeof i == "string" && i.charCodeAt(0) > 96
			? testOmitPropsOnStringTag
			: testOmitPropsOnComponent;
	},
	composeShouldForwardProps = function (i, a, s) {
		var $;
		if (a) {
			var j = a.shouldForwardProp;
			$ =
				i.__emotion_forwardProp && j
					? function (_e) {
							return i.__emotion_forwardProp(_e) && j(_e);
						}
					: j;
		}
		return (typeof $ != "function" && s && ($ = i.__emotion_forwardProp), $);
	},
	Insertion = function (i) {
		var a = i.cache,
			s = i.serialized,
			$ = i.isStringTag;
		return (
			registerStyles(a, s, $),
			useInsertionEffectAlwaysWithSyncFallback(function () {
				return insertStyles(a, s, $);
			}),
			null
		);
	},
	createStyled$1 = function o(i, a) {
		var s = i.__emotion_real === i,
			$ = (s && i.__emotion_base) || i,
			j,
			_e;
		a !== void 0 && ((j = a.label), (_e = a.target));
		var et = composeShouldForwardProps(i, a, s),
			tt = et || getDefaultShouldForwardProp($),
			rt = !tt("as");
		return function () {
			var nt = arguments,
				it = s && i.__emotion_styles !== void 0 ? i.__emotion_styles.slice(0) : [];
			if ((j !== void 0 && it.push("label:" + j + ";"), nt[0] == null || nt[0].raw === void 0))
				it.push.apply(it, nt);
			else {
				it.push(nt[0][0]);
				for (var ot = nt.length, st = 1; st < ot; st++) it.push(nt[st], nt[0][st]);
			}
			var lt = withEmotionCache(function (dt, pt, ct) {
				var at = (rt && dt.as) || $,
					ft = "",
					ut = [],
					ht = dt;
				if (dt.theme == null) {
					ht = {};
					for (var yt in dt) ht[yt] = dt[yt];
					ht.theme = reactExports.useContext(ThemeContext$2);
				}
				typeof dt.className == "string"
					? (ft = getRegisteredStyles(pt.registered, ut, dt.className))
					: dt.className != null && (ft = dt.className + " ");
				var mt = serializeStyles(it.concat(ut), pt.registered, ht);
				((ft += pt.key + "-" + mt.name), _e !== void 0 && (ft += " " + _e));
				var Et = rt && et === void 0 ? getDefaultShouldForwardProp(at) : tt,
					Rt = {};
				for (var vt in dt) (rt && vt === "as") || (Et(vt) && (Rt[vt] = dt[vt]));
				return (
					(Rt.className = ft),
					(Rt.ref = ct),
					reactExports.createElement(
						reactExports.Fragment,
						null,
						reactExports.createElement(Insertion, {
							cache: pt,
							serialized: mt,
							isStringTag: typeof at == "string",
						}),
						reactExports.createElement(at, Rt)
					)
				);
			});
			return (
				(lt.displayName =
					j !== void 0
						? j
						: "Styled(" +
							(typeof $ == "string" ? $ : $.displayName || $.name || "Component") +
							")"),
				(lt.defaultProps = i.defaultProps),
				(lt.__emotion_real = lt),
				(lt.__emotion_base = $),
				(lt.__emotion_styles = it),
				(lt.__emotion_forwardProp = et),
				Object.defineProperty(lt, "toString", {
					value: function () {
						return "." + _e;
					},
				}),
				(lt.withComponent = function (dt, pt) {
					return o(
						dt,
						_extends$9({}, a, pt, { shouldForwardProp: composeShouldForwardProps(lt, pt, !0) })
					).apply(void 0, it);
				}),
				lt
			);
		};
	},
	tags = [
		"a",
		"abbr",
		"address",
		"area",
		"article",
		"aside",
		"audio",
		"b",
		"base",
		"bdi",
		"bdo",
		"big",
		"blockquote",
		"body",
		"br",
		"button",
		"canvas",
		"caption",
		"cite",
		"code",
		"col",
		"colgroup",
		"data",
		"datalist",
		"dd",
		"del",
		"details",
		"dfn",
		"dialog",
		"div",
		"dl",
		"dt",
		"em",
		"embed",
		"fieldset",
		"figcaption",
		"figure",
		"footer",
		"form",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"head",
		"header",
		"hgroup",
		"hr",
		"html",
		"i",
		"iframe",
		"img",
		"input",
		"ins",
		"kbd",
		"keygen",
		"label",
		"legend",
		"li",
		"link",
		"main",
		"map",
		"mark",
		"marquee",
		"menu",
		"menuitem",
		"meta",
		"meter",
		"nav",
		"noscript",
		"object",
		"ol",
		"optgroup",
		"option",
		"output",
		"p",
		"param",
		"picture",
		"pre",
		"progress",
		"q",
		"rp",
		"rt",
		"ruby",
		"s",
		"samp",
		"script",
		"section",
		"select",
		"small",
		"source",
		"span",
		"strong",
		"style",
		"sub",
		"summary",
		"sup",
		"table",
		"tbody",
		"td",
		"textarea",
		"tfoot",
		"th",
		"thead",
		"time",
		"title",
		"tr",
		"track",
		"u",
		"ul",
		"var",
		"video",
		"wbr",
		"circle",
		"clipPath",
		"defs",
		"ellipse",
		"foreignObject",
		"g",
		"image",
		"line",
		"linearGradient",
		"mask",
		"path",
		"pattern",
		"polygon",
		"polyline",
		"radialGradient",
		"rect",
		"stop",
		"svg",
		"text",
		"tspan",
	],
	newStyled = createStyled$1.bind();
tags.forEach(function (o) {
	newStyled[o] = newStyled(o);
});
function isEmpty$2(o) {
	return o == null || Object.keys(o).length === 0;
}
function GlobalStyles$2(o) {
	const { styles: i, defaultTheme: a = {} } = o,
		s = typeof i == "function" ? ($) => i(isEmpty$2($) ? a : $) : i;
	return jsxRuntimeExports.jsx(Global, { styles: s });
}
/**
 * @mui/styled-engine v5.14.17
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ function styled$3(o, i) {
	return newStyled(o, i);
}
const internal_processStyles = (o, i) => {
		Array.isArray(o.__emotion_styles) && (o.__emotion_styles = i(o.__emotion_styles));
	},
	_excluded$p = ["values", "unit", "step"],
	sortBreakpointsValues = (o) => {
		const i = Object.keys(o).map((a) => ({ key: a, val: o[a] })) || [];
		return (
			i.sort((a, s) => a.val - s.val), i.reduce((a, s) => _extends$9({}, a, { [s.key]: s.val }), {})
		);
	};
function createBreakpoints(o) {
	const {
			values: i = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
			unit: a = "px",
			step: s = 5,
		} = o,
		$ = _objectWithoutPropertiesLoose(o, _excluded$p),
		j = sortBreakpointsValues(i),
		_e = Object.keys(j);
	function et(ot) {
		return `@media (min-width:${typeof i[ot] == "number" ? i[ot] : ot}${a})`;
	}
	function tt(ot) {
		return `@media (max-width:${(typeof i[ot] == "number" ? i[ot] : ot) - s / 100}${a})`;
	}
	function rt(ot, st) {
		const lt = _e.indexOf(st);
		return `@media (min-width:${typeof i[ot] == "number" ? i[ot] : ot}${a}) and (max-width:${(lt !== -1 && typeof i[_e[lt]] == "number" ? i[_e[lt]] : st) - s / 100}${a})`;
	}
	function nt(ot) {
		return _e.indexOf(ot) + 1 < _e.length ? rt(ot, _e[_e.indexOf(ot) + 1]) : et(ot);
	}
	function it(ot) {
		const st = _e.indexOf(ot);
		return st === 0
			? et(_e[1])
			: st === _e.length - 1
				? tt(_e[st])
				: rt(ot, _e[_e.indexOf(ot) + 1]).replace("@media", "@media not all and");
	}
	return _extends$9(
		{ keys: _e, values: j, up: et, down: tt, between: rt, only: nt, not: it, unit: a },
		$
	);
}
const shape = { borderRadius: 4 },
	shape$1 = shape;
function merge(o, i) {
	return i ? deepmerge(o, i, { clone: !1 }) : o;
}
const values$1 = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
	defaultBreakpoints = {
		keys: ["xs", "sm", "md", "lg", "xl"],
		up: (o) => `@media (min-width:${values$1[o]}px)`,
	};
function handleBreakpoints(o, i, a) {
	const s = o.theme || {};
	if (Array.isArray(i)) {
		const j = s.breakpoints || defaultBreakpoints;
		return i.reduce((_e, et, tt) => ((_e[j.up(j.keys[tt])] = a(i[tt])), _e), {});
	}
	if (typeof i == "object") {
		const j = s.breakpoints || defaultBreakpoints;
		return Object.keys(i).reduce((_e, et) => {
			if (Object.keys(j.values || values$1).indexOf(et) !== -1) {
				const tt = j.up(et);
				_e[tt] = a(i[et], et);
			} else {
				const tt = et;
				_e[tt] = i[tt];
			}
			return _e;
		}, {});
	}
	return a(i);
}
function createEmptyBreakpointObject(o = {}) {
	var i;
	return (
		((i = o.keys) == null
			? void 0
			: i.reduce((s, $) => {
					const j = o.up($);
					return ((s[j] = {}), s);
				}, {})) || {}
	);
}
function removeUnusedBreakpoints(o, i) {
	return o.reduce((a, s) => {
		const $ = a[s];
		return ((!$ || Object.keys($).length === 0) && delete a[s], a);
	}, i);
}
function mergeBreakpointsInOrder(o, ...i) {
	const a = createEmptyBreakpointObject(o),
		s = [a, ...i].reduce(($, j) => deepmerge($, j), {});
	return removeUnusedBreakpoints(Object.keys(a), s);
}
function computeBreakpointsBase(o, i) {
	if (typeof o != "object") return {};
	const a = {},
		s = Object.keys(i);
	return (
		Array.isArray(o)
			? s.forEach(($, j) => {
					j < o.length && (a[$] = !0);
				})
			: s.forEach(($) => {
					o[$] != null && (a[$] = !0);
				}),
		a
	);
}
function resolveBreakpointValues({ values: o, breakpoints: i, base: a }) {
	const s = a || computeBreakpointsBase(o, i),
		$ = Object.keys(s);
	if ($.length === 0) return o;
	let j;
	return $.reduce(
		(_e, et, tt) => (
			Array.isArray(o)
				? ((_e[et] = o[tt] != null ? o[tt] : o[j]), (j = tt))
				: typeof o == "object"
					? ((_e[et] = o[et] != null ? o[et] : o[j]), (j = et))
					: (_e[et] = o),
			_e
		),
		{}
	);
}
function getPath(o, i, a = !0) {
	if (!i || typeof i != "string") return null;
	if (o && o.vars && a) {
		const s = `vars.${i}`.split(".").reduce(($, j) => ($ && $[j] ? $[j] : null), o);
		if (s != null) return s;
	}
	return i.split(".").reduce((s, $) => (s && s[$] != null ? s[$] : null), o);
}
function getStyleValue(o, i, a, s = a) {
	let $;
	return (
		typeof o == "function"
			? ($ = o(a))
			: Array.isArray(o)
				? ($ = o[a] || s)
				: ($ = getPath(o, a) || s),
		i && ($ = i($, s, o)),
		$
	);
}
function style$3(o) {
	const { prop: i, cssProperty: a = o.prop, themeKey: s, transform: $ } = o,
		j = (_e) => {
			if (_e[i] == null) return null;
			const et = _e[i],
				tt = _e.theme,
				rt = getPath(tt, s) || {};
			return handleBreakpoints(_e, et, (it) => {
				let ot = getStyleValue(rt, $, it);
				return (
					it === ot &&
						typeof it == "string" &&
						(ot = getStyleValue(rt, $, `${i}${it === "default" ? "" : capitalize(it)}`, it)),
					a === !1 ? ot : { [a]: ot }
				);
			});
		};
	return ((j.propTypes = {}), (j.filterProps = [i]), j);
}
function memoize(o) {
	const i = {};
	return (a) => (i[a] === void 0 && (i[a] = o(a)), i[a]);
}
const properties = { m: "margin", p: "padding" },
	directions = {
		t: "Top",
		r: "Right",
		b: "Bottom",
		l: "Left",
		x: ["Left", "Right"],
		y: ["Top", "Bottom"],
	},
	aliases = { marginX: "mx", marginY: "my", paddingX: "px", paddingY: "py" },
	getCssProperties = memoize((o) => {
		if (o.length > 2)
			if (aliases[o]) o = aliases[o];
			else return [o];
		const [i, a] = o.split(""),
			s = properties[i],
			$ = directions[a] || "";
		return Array.isArray($) ? $.map((j) => s + j) : [s + $];
	}),
	marginKeys = [
		"m",
		"mt",
		"mr",
		"mb",
		"ml",
		"mx",
		"my",
		"margin",
		"marginTop",
		"marginRight",
		"marginBottom",
		"marginLeft",
		"marginX",
		"marginY",
		"marginInline",
		"marginInlineStart",
		"marginInlineEnd",
		"marginBlock",
		"marginBlockStart",
		"marginBlockEnd",
	],
	paddingKeys = [
		"p",
		"pt",
		"pr",
		"pb",
		"pl",
		"px",
		"py",
		"padding",
		"paddingTop",
		"paddingRight",
		"paddingBottom",
		"paddingLeft",
		"paddingX",
		"paddingY",
		"paddingInline",
		"paddingInlineStart",
		"paddingInlineEnd",
		"paddingBlock",
		"paddingBlockStart",
		"paddingBlockEnd",
	];
[...marginKeys, ...paddingKeys];
function createUnaryUnit(o, i, a, s) {
	var $;
	const j = ($ = getPath(o, i, !1)) != null ? $ : a;
	return typeof j == "number"
		? (_e) => (typeof _e == "string" ? _e : j * _e)
		: Array.isArray(j)
			? (_e) => (typeof _e == "string" ? _e : j[_e])
			: typeof j == "function"
				? j
				: () => {};
}
function createUnarySpacing(o) {
	return createUnaryUnit(o, "spacing", 8);
}
function getValue(o, i) {
	if (typeof i == "string" || i == null) return i;
	const a = Math.abs(i),
		s = o(a);
	return i >= 0 ? s : typeof s == "number" ? -s : `-${s}`;
}
function getStyleFromPropValue(o, i) {
	return (a) => o.reduce((s, $) => ((s[$] = getValue(i, a)), s), {});
}
function resolveCssProperty(o, i, a, s) {
	if (i.indexOf(a) === -1) return null;
	const $ = getCssProperties(a),
		j = getStyleFromPropValue($, s),
		_e = o[a];
	return handleBreakpoints(o, _e, j);
}
function style$2(o, i) {
	const a = createUnarySpacing(o.theme);
	return Object.keys(o)
		.map((s) => resolveCssProperty(o, i, s, a))
		.reduce(merge, {});
}
function margin(o) {
	return style$2(o, marginKeys);
}
margin.propTypes = {};
margin.filterProps = marginKeys;
function padding(o) {
	return style$2(o, paddingKeys);
}
padding.propTypes = {};
padding.filterProps = paddingKeys;
function createSpacing(o = 8) {
	if (o.mui) return o;
	const i = createUnarySpacing({ spacing: o }),
		a = (...s) =>
			(s.length === 0 ? [1] : s)
				.map((j) => {
					const _e = i(j);
					return typeof _e == "number" ? `${_e}px` : _e;
				})
				.join(" ");
	return ((a.mui = !0), a);
}
function compose(...o) {
	const i = o.reduce(
			(s, $) => (
				$.filterProps.forEach((j) => {
					s[j] = $;
				}),
				s
			),
			{}
		),
		a = (s) => Object.keys(s).reduce(($, j) => (i[j] ? merge($, i[j](s)) : $), {});
	return ((a.propTypes = {}), (a.filterProps = o.reduce((s, $) => s.concat($.filterProps), [])), a);
}
function borderTransform(o) {
	return typeof o != "number" ? o : `${o}px solid`;
}
const border = style$3({ prop: "border", themeKey: "borders", transform: borderTransform }),
	borderTop = style$3({ prop: "borderTop", themeKey: "borders", transform: borderTransform }),
	borderRight = style$3({ prop: "borderRight", themeKey: "borders", transform: borderTransform }),
	borderBottom = style$3({ prop: "borderBottom", themeKey: "borders", transform: borderTransform }),
	borderLeft = style$3({ prop: "borderLeft", themeKey: "borders", transform: borderTransform }),
	borderColor = style$3({ prop: "borderColor", themeKey: "palette" }),
	borderTopColor = style$3({ prop: "borderTopColor", themeKey: "palette" }),
	borderRightColor = style$3({ prop: "borderRightColor", themeKey: "palette" }),
	borderBottomColor = style$3({ prop: "borderBottomColor", themeKey: "palette" }),
	borderLeftColor = style$3({ prop: "borderLeftColor", themeKey: "palette" }),
	borderRadius = (o) => {
		if (o.borderRadius !== void 0 && o.borderRadius !== null) {
			const i = createUnaryUnit(o.theme, "shape.borderRadius", 4),
				a = (s) => ({ borderRadius: getValue(i, s) });
			return handleBreakpoints(o, o.borderRadius, a);
		}
		return null;
	};
borderRadius.propTypes = {};
borderRadius.filterProps = ["borderRadius"];
compose(
	border,
	borderTop,
	borderRight,
	borderBottom,
	borderLeft,
	borderColor,
	borderTopColor,
	borderRightColor,
	borderBottomColor,
	borderLeftColor,
	borderRadius
);
const gap = (o) => {
	if (o.gap !== void 0 && o.gap !== null) {
		const i = createUnaryUnit(o.theme, "spacing", 8),
			a = (s) => ({ gap: getValue(i, s) });
		return handleBreakpoints(o, o.gap, a);
	}
	return null;
};
gap.propTypes = {};
gap.filterProps = ["gap"];
const columnGap = (o) => {
	if (o.columnGap !== void 0 && o.columnGap !== null) {
		const i = createUnaryUnit(o.theme, "spacing", 8),
			a = (s) => ({ columnGap: getValue(i, s) });
		return handleBreakpoints(o, o.columnGap, a);
	}
	return null;
};
columnGap.propTypes = {};
columnGap.filterProps = ["columnGap"];
const rowGap = (o) => {
	if (o.rowGap !== void 0 && o.rowGap !== null) {
		const i = createUnaryUnit(o.theme, "spacing", 8),
			a = (s) => ({ rowGap: getValue(i, s) });
		return handleBreakpoints(o, o.rowGap, a);
	}
	return null;
};
rowGap.propTypes = {};
rowGap.filterProps = ["rowGap"];
const gridColumn = style$3({ prop: "gridColumn" }),
	gridRow = style$3({ prop: "gridRow" }),
	gridAutoFlow = style$3({ prop: "gridAutoFlow" }),
	gridAutoColumns = style$3({ prop: "gridAutoColumns" }),
	gridAutoRows = style$3({ prop: "gridAutoRows" }),
	gridTemplateColumns = style$3({ prop: "gridTemplateColumns" }),
	gridTemplateRows = style$3({ prop: "gridTemplateRows" }),
	gridTemplateAreas = style$3({ prop: "gridTemplateAreas" }),
	gridArea = style$3({ prop: "gridArea" });
compose(
	gap,
	columnGap,
	rowGap,
	gridColumn,
	gridRow,
	gridAutoFlow,
	gridAutoColumns,
	gridAutoRows,
	gridTemplateColumns,
	gridTemplateRows,
	gridTemplateAreas,
	gridArea
);
function paletteTransform(o, i) {
	return i === "grey" ? i : o;
}
const color = style$3({ prop: "color", themeKey: "palette", transform: paletteTransform }),
	bgcolor = style$3({
		prop: "bgcolor",
		cssProperty: "backgroundColor",
		themeKey: "palette",
		transform: paletteTransform,
	}),
	backgroundColor = style$3({
		prop: "backgroundColor",
		themeKey: "palette",
		transform: paletteTransform,
	});
compose(color, bgcolor, backgroundColor);
function sizingTransform(o) {
	return o <= 1 && o !== 0 ? `${o * 100}%` : o;
}
const width = style$3({ prop: "width", transform: sizingTransform }),
	maxWidth = (o) => {
		if (o.maxWidth !== void 0 && o.maxWidth !== null) {
			const i = (a) => {
				var s, $;
				const j =
					((s = o.theme) == null || (s = s.breakpoints) == null || (s = s.values) == null
						? void 0
						: s[a]) || values$1[a];
				return j
					? (($ = o.theme) == null || ($ = $.breakpoints) == null ? void 0 : $.unit) !== "px"
						? { maxWidth: `${j}${o.theme.breakpoints.unit}` }
						: { maxWidth: j }
					: { maxWidth: sizingTransform(a) };
			};
			return handleBreakpoints(o, o.maxWidth, i);
		}
		return null;
	};
maxWidth.filterProps = ["maxWidth"];
const minWidth = style$3({ prop: "minWidth", transform: sizingTransform }),
	height = style$3({ prop: "height", transform: sizingTransform }),
	maxHeight = style$3({ prop: "maxHeight", transform: sizingTransform }),
	minHeight = style$3({ prop: "minHeight", transform: sizingTransform });
style$3({ prop: "size", cssProperty: "width", transform: sizingTransform });
style$3({ prop: "size", cssProperty: "height", transform: sizingTransform });
const boxSizing = style$3({ prop: "boxSizing" });
compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
const defaultSxConfig = {
		border: { themeKey: "borders", transform: borderTransform },
		borderTop: { themeKey: "borders", transform: borderTransform },
		borderRight: { themeKey: "borders", transform: borderTransform },
		borderBottom: { themeKey: "borders", transform: borderTransform },
		borderLeft: { themeKey: "borders", transform: borderTransform },
		borderColor: { themeKey: "palette" },
		borderTopColor: { themeKey: "palette" },
		borderRightColor: { themeKey: "palette" },
		borderBottomColor: { themeKey: "palette" },
		borderLeftColor: { themeKey: "palette" },
		borderRadius: { themeKey: "shape.borderRadius", style: borderRadius },
		color: { themeKey: "palette", transform: paletteTransform },
		bgcolor: { themeKey: "palette", cssProperty: "backgroundColor", transform: paletteTransform },
		backgroundColor: { themeKey: "palette", transform: paletteTransform },
		p: { style: padding },
		pt: { style: padding },
		pr: { style: padding },
		pb: { style: padding },
		pl: { style: padding },
		px: { style: padding },
		py: { style: padding },
		padding: { style: padding },
		paddingTop: { style: padding },
		paddingRight: { style: padding },
		paddingBottom: { style: padding },
		paddingLeft: { style: padding },
		paddingX: { style: padding },
		paddingY: { style: padding },
		paddingInline: { style: padding },
		paddingInlineStart: { style: padding },
		paddingInlineEnd: { style: padding },
		paddingBlock: { style: padding },
		paddingBlockStart: { style: padding },
		paddingBlockEnd: { style: padding },
		m: { style: margin },
		mt: { style: margin },
		mr: { style: margin },
		mb: { style: margin },
		ml: { style: margin },
		mx: { style: margin },
		my: { style: margin },
		margin: { style: margin },
		marginTop: { style: margin },
		marginRight: { style: margin },
		marginBottom: { style: margin },
		marginLeft: { style: margin },
		marginX: { style: margin },
		marginY: { style: margin },
		marginInline: { style: margin },
		marginInlineStart: { style: margin },
		marginInlineEnd: { style: margin },
		marginBlock: { style: margin },
		marginBlockStart: { style: margin },
		marginBlockEnd: { style: margin },
		displayPrint: { cssProperty: !1, transform: (o) => ({ "@media print": { display: o } }) },
		display: {},
		overflow: {},
		textOverflow: {},
		visibility: {},
		whiteSpace: {},
		flexBasis: {},
		flexDirection: {},
		flexWrap: {},
		justifyContent: {},
		alignItems: {},
		alignContent: {},
		order: {},
		flex: {},
		flexGrow: {},
		flexShrink: {},
		alignSelf: {},
		justifyItems: {},
		justifySelf: {},
		gap: { style: gap },
		rowGap: { style: rowGap },
		columnGap: { style: columnGap },
		gridColumn: {},
		gridRow: {},
		gridAutoFlow: {},
		gridAutoColumns: {},
		gridAutoRows: {},
		gridTemplateColumns: {},
		gridTemplateRows: {},
		gridTemplateAreas: {},
		gridArea: {},
		position: {},
		zIndex: { themeKey: "zIndex" },
		top: {},
		right: {},
		bottom: {},
		left: {},
		boxShadow: { themeKey: "shadows" },
		width: { transform: sizingTransform },
		maxWidth: { style: maxWidth },
		minWidth: { transform: sizingTransform },
		height: { transform: sizingTransform },
		maxHeight: { transform: sizingTransform },
		minHeight: { transform: sizingTransform },
		boxSizing: {},
		fontFamily: { themeKey: "typography" },
		fontSize: { themeKey: "typography" },
		fontStyle: { themeKey: "typography" },
		fontWeight: { themeKey: "typography" },
		letterSpacing: {},
		textTransform: {},
		lineHeight: {},
		textAlign: {},
		typography: { cssProperty: !1, themeKey: "typography" },
	},
	defaultSxConfig$1 = defaultSxConfig;
function objectsHaveSameKeys(...o) {
	const i = o.reduce((s, $) => s.concat(Object.keys($)), []),
		a = new Set(i);
	return o.every((s) => a.size === Object.keys(s).length);
}
function callIfFn(o, i) {
	return typeof o == "function" ? o(i) : o;
}
function unstable_createStyleFunctionSx() {
	function o(a, s, $, j) {
		const _e = { [a]: s, theme: $ },
			et = j[a];
		if (!et) return { [a]: s };
		const { cssProperty: tt = a, themeKey: rt, transform: nt, style: it } = et;
		if (s == null) return null;
		if (rt === "typography" && s === "inherit") return { [a]: s };
		const ot = getPath($, rt) || {};
		return it
			? it(_e)
			: handleBreakpoints(_e, s, (lt) => {
					let dt = getStyleValue(ot, nt, lt);
					return (
						lt === dt &&
							typeof lt == "string" &&
							(dt = getStyleValue(ot, nt, `${a}${lt === "default" ? "" : capitalize(lt)}`, lt)),
						tt === !1 ? dt : { [tt]: dt }
					);
				});
	}
	function i(a) {
		var s;
		const { sx: $, theme: j = {} } = a || {};
		if (!$) return null;
		const _e = (s = j.unstable_sxConfig) != null ? s : defaultSxConfig$1;
		function et(tt) {
			let rt = tt;
			if (typeof tt == "function") rt = tt(j);
			else if (typeof tt != "object") return tt;
			if (!rt) return null;
			const nt = createEmptyBreakpointObject(j.breakpoints),
				it = Object.keys(nt);
			let ot = nt;
			return (
				Object.keys(rt).forEach((st) => {
					const lt = callIfFn(rt[st], j);
					if (lt != null)
						if (typeof lt == "object")
							if (_e[st]) ot = merge(ot, o(st, lt, j, _e));
							else {
								const dt = handleBreakpoints({ theme: j }, lt, (pt) => ({ [st]: pt }));
								objectsHaveSameKeys(dt, lt)
									? (ot[st] = i({ sx: lt, theme: j }))
									: (ot = merge(ot, dt));
							}
						else ot = merge(ot, o(st, lt, j, _e));
				}),
				removeUnusedBreakpoints(it, ot)
			);
		}
		return Array.isArray($) ? $.map(et) : et($);
	}
	return i;
}
const styleFunctionSx = unstable_createStyleFunctionSx();
styleFunctionSx.filterProps = ["sx"];
const styleFunctionSx$1 = styleFunctionSx,
	_excluded$o = ["breakpoints", "palette", "spacing", "shape"];
function createTheme$1(o = {}, ...i) {
	const { breakpoints: a = {}, palette: s = {}, spacing: $, shape: j = {} } = o,
		_e = _objectWithoutPropertiesLoose(o, _excluded$o),
		et = createBreakpoints(a),
		tt = createSpacing($);
	let rt = deepmerge(
		{
			breakpoints: et,
			direction: "ltr",
			components: {},
			palette: _extends$9({ mode: "light" }, s),
			spacing: tt,
			shape: _extends$9({}, shape$1, j),
		},
		_e
	);
	return (
		(rt = i.reduce((nt, it) => deepmerge(nt, it), rt)),
		(rt.unstable_sxConfig = _extends$9(
			{},
			defaultSxConfig$1,
			_e == null ? void 0 : _e.unstable_sxConfig
		)),
		(rt.unstable_sx = function (it) {
			return styleFunctionSx$1({ sx: it, theme: this });
		}),
		rt
	);
}
function isObjectEmpty(o) {
	return Object.keys(o).length === 0;
}
function useTheme$3(o = null) {
	const i = reactExports.useContext(ThemeContext$2);
	return !i || isObjectEmpty(i) ? o : i;
}
const systemDefaultTheme$1 = createTheme$1();
function useTheme$2(o = systemDefaultTheme$1) {
	return useTheme$3(o);
}
function GlobalStyles$1({ styles: o, themeId: i, defaultTheme: a = {} }) {
	const s = useTheme$2(a),
		$ = typeof o == "function" ? o((i && s[i]) || s) : o;
	return jsxRuntimeExports.jsx(GlobalStyles$2, { styles: $ });
}
const _excluded$n = ["sx"],
	splitProps = (o) => {
		var i, a;
		const s = { systemProps: {}, otherProps: {} },
			$ =
				(i = o == null || (a = o.theme) == null ? void 0 : a.unstable_sxConfig) != null
					? i
					: defaultSxConfig$1;
		return (
			Object.keys(o).forEach((j) => {
				$[j] ? (s.systemProps[j] = o[j]) : (s.otherProps[j] = o[j]);
			}),
			s
		);
	};
function extendSxProp(o) {
	const { sx: i } = o,
		a = _objectWithoutPropertiesLoose(o, _excluded$n),
		{ systemProps: s, otherProps: $ } = splitProps(a);
	let j;
	return (
		Array.isArray(i)
			? (j = [s, ...i])
			: typeof i == "function"
				? (j = (..._e) => {
						const et = i(..._e);
						return isPlainObject$1(et) ? _extends$9({}, s, et) : s;
					})
				: (j = _extends$9({}, s, i)),
		_extends$9({}, $, { sx: j })
	);
}
function r(o) {
	var i,
		a,
		s = "";
	if (typeof o == "string" || typeof o == "number") s += o;
	else if (typeof o == "object")
		if (Array.isArray(o))
			for (i = 0; i < o.length; i++) o[i] && (a = r(o[i])) && (s && (s += " "), (s += a));
		else for (i in o) o[i] && (s && (s += " "), (s += i));
	return s;
}
function clsx() {
	for (var o, i, a = 0, s = ""; a < arguments.length; )
		(o = arguments[a++]) && (i = r(o)) && (s && (s += " "), (s += i));
	return s;
}
const _excluded$m = ["className", "component"];
function createBox(o = {}) {
	const {
			themeId: i,
			defaultTheme: a,
			defaultClassName: s = "MuiBox-root",
			generateClassName: $,
		} = o,
		j = styled$3("div", {
			shouldForwardProp: (et) => et !== "theme" && et !== "sx" && et !== "as",
		})(styleFunctionSx$1);
	return reactExports.forwardRef(function (tt, rt) {
		const nt = useTheme$2(a),
			it = extendSxProp(tt),
			{ className: ot, component: st = "div" } = it,
			lt = _objectWithoutPropertiesLoose(it, _excluded$m);
		return jsxRuntimeExports.jsx(
			j,
			_extends$9(
				{ as: st, ref: rt, className: clsx(ot, $ ? $(s) : s), theme: (i && nt[i]) || nt },
				lt
			)
		);
	});
}
const _excluded$l = ["variant"];
function isEmpty$1(o) {
	return o.length === 0;
}
function propsToClassKey(o) {
	const { variant: i } = o,
		a = _objectWithoutPropertiesLoose(o, _excluded$l);
	let s = i || "";
	return (
		Object.keys(a)
			.sort()
			.forEach(($) => {
				$ === "color"
					? (s += isEmpty$1(s) ? o[$] : capitalize(o[$]))
					: (s += `${isEmpty$1(s) ? $ : capitalize($)}${capitalize(o[$].toString())}`);
			}),
		s
	);
}
const _excluded$k = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
function isEmpty(o) {
	return Object.keys(o).length === 0;
}
function isStringTag(o) {
	return typeof o == "string" && o.charCodeAt(0) > 96;
}
const getStyleOverrides = (o, i) =>
		i.components && i.components[o] && i.components[o].styleOverrides
			? i.components[o].styleOverrides
			: null,
	transformVariants = (o) => {
		const i = {};
		return (
			o &&
				o.forEach((a) => {
					const s = propsToClassKey(a.props);
					i[s] = a.style;
				}),
			i
		);
	},
	getVariantStyles = (o, i) => {
		let a = [];
		return (
			i &&
				i.components &&
				i.components[o] &&
				i.components[o].variants &&
				(a = i.components[o].variants),
			transformVariants(a)
		);
	},
	variantsResolver = (o, i, a) => {
		const { ownerState: s = {} } = o,
			$ = [];
		return (
			a &&
				a.forEach((j) => {
					let _e = !0;
					(Object.keys(j.props).forEach((et) => {
						s[et] !== j.props[et] && o[et] !== j.props[et] && (_e = !1);
					}),
						_e && $.push(i[propsToClassKey(j.props)]));
				}),
			$
		);
	},
	themeVariantsResolver = (o, i, a, s) => {
		var $;
		const j = a == null || ($ = a.components) == null || ($ = $[s]) == null ? void 0 : $.variants;
		return variantsResolver(o, i, j);
	};
function shouldForwardProp(o) {
	return o !== "ownerState" && o !== "theme" && o !== "sx" && o !== "as";
}
const systemDefaultTheme = createTheme$1(),
	lowercaseFirstLetter = (o) => o && o.charAt(0).toLowerCase() + o.slice(1);
function resolveTheme({ defaultTheme: o, theme: i, themeId: a }) {
	return isEmpty(i) ? o : i[a] || i;
}
function defaultOverridesResolver(o) {
	return o ? (i, a) => a[o] : null;
}
const muiStyledFunctionResolver = ({ styledArg: o, props: i, defaultTheme: a, themeId: s }) => {
	const $ = o(
		_extends$9({}, i, { theme: resolveTheme(_extends$9({}, i, { defaultTheme: a, themeId: s })) })
	);
	let j;
	if (($ && $.variants && ((j = $.variants), delete $.variants), j)) {
		const _e = variantsResolver(i, transformVariants(j), j);
		return [$, ..._e];
	}
	return $;
};
function createStyled(o = {}) {
	const {
			themeId: i,
			defaultTheme: a = systemDefaultTheme,
			rootShouldForwardProp: s = shouldForwardProp,
			slotShouldForwardProp: $ = shouldForwardProp,
		} = o,
		j = (_e) =>
			styleFunctionSx$1(
				_extends$9({}, _e, {
					theme: resolveTheme(_extends$9({}, _e, { defaultTheme: a, themeId: i })),
				})
			);
	return (
		(j.__mui_systemSx = !0),
		(_e, et = {}) => {
			internal_processStyles(_e, (ut) => ut.filter((ht) => !(ht != null && ht.__mui_systemSx)));
			const {
					name: tt,
					slot: rt,
					skipVariantsResolver: nt,
					skipSx: it,
					overridesResolver: ot = defaultOverridesResolver(lowercaseFirstLetter(rt)),
				} = et,
				st = _objectWithoutPropertiesLoose(et, _excluded$k),
				lt = nt !== void 0 ? nt : (rt && rt !== "Root" && rt !== "root") || !1,
				dt = it || !1;
			let pt,
				ct = shouldForwardProp;
			rt === "Root" || rt === "root" ? (ct = s) : rt ? (ct = $) : isStringTag(_e) && (ct = void 0);
			const at = styled$3(_e, _extends$9({ shouldForwardProp: ct, label: pt }, st)),
				ft = (ut, ...ht) => {
					const yt = ht
						? ht.map((vt) => {
								if (typeof vt == "function" && vt.__emotion_real !== vt)
									return (Tt) =>
										muiStyledFunctionResolver({
											styledArg: vt,
											props: Tt,
											defaultTheme: a,
											themeId: i,
										});
								if (isPlainObject$1(vt)) {
									let Tt = vt,
										Pt;
									return (
										vt &&
											vt.variants &&
											((Pt = vt.variants),
											delete Tt.variants,
											(Tt = (Dt) => {
												let Nt = vt;
												return (
													variantsResolver(Dt, transformVariants(Pt), Pt).forEach((jt) => {
														Nt = deepmerge(Nt, jt);
													}),
													Nt
												);
											})),
										Tt
									);
								}
								return vt;
							})
						: [];
					let mt = ut;
					if (isPlainObject$1(ut)) {
						let vt;
						ut &&
							ut.variants &&
							((vt = ut.variants),
							delete mt.variants,
							(mt = (Tt) => {
								let Pt = ut;
								return (
									variantsResolver(Tt, transformVariants(vt), vt).forEach((Nt) => {
										Pt = deepmerge(Pt, Nt);
									}),
									Pt
								);
							}));
					} else
						typeof ut == "function" &&
							ut.__emotion_real !== ut &&
							(mt = (vt) =>
								muiStyledFunctionResolver({
									styledArg: ut,
									props: vt,
									defaultTheme: a,
									themeId: i,
								}));
					(tt &&
						ot &&
						yt.push((vt) => {
							const Tt = resolveTheme(_extends$9({}, vt, { defaultTheme: a, themeId: i })),
								Pt = getStyleOverrides(tt, Tt);
							if (Pt) {
								const Dt = {};
								return (
									Object.entries(Pt).forEach(([Nt, $t]) => {
										Dt[Nt] = typeof $t == "function" ? $t(_extends$9({}, vt, { theme: Tt })) : $t;
									}),
									ot(vt, Dt)
								);
							}
							return null;
						}),
						tt &&
							!lt &&
							yt.push((vt) => {
								const Tt = resolveTheme(_extends$9({}, vt, { defaultTheme: a, themeId: i }));
								return themeVariantsResolver(vt, getVariantStyles(tt, Tt), Tt, tt);
							}),
						dt || yt.push(j));
					const Et = yt.length - ht.length;
					if (Array.isArray(ut) && Et > 0) {
						const vt = new Array(Et).fill("");
						((mt = [...ut, ...vt]), (mt.raw = [...ut.raw, ...vt]));
					}
					const Rt = at(mt, ...yt);
					return (_e.muiName && (Rt.muiName = _e.muiName), Rt);
				};
			return (at.withConfig && (ft.withConfig = at.withConfig), ft);
		}
	);
}
const styled$2 = createStyled(),
	systemStyled = styled$2;
function getThemeProps(o) {
	const { theme: i, name: a, props: s } = o;
	return !i || !i.components || !i.components[a] || !i.components[a].defaultProps
		? s
		: resolveProps(i.components[a].defaultProps, s);
}
function useThemeProps$1({ props: o, name: i, defaultTheme: a, themeId: s }) {
	let $ = useTheme$2(a);
	return (s && ($ = $[s] || $), getThemeProps({ theme: $, name: i, props: o }));
}
function clamp(o, i = 0, a = 1) {
	return Math.min(Math.max(i, o), a);
}
function hexToRgb(o) {
	o = o.slice(1);
	const i = new RegExp(`.{1,${o.length >= 6 ? 2 : 1}}`, "g");
	let a = o.match(i);
	return (
		a && a[0].length === 1 && (a = a.map((s) => s + s)),
		a
			? `rgb${a.length === 4 ? "a" : ""}(${a.map((s, $) => ($ < 3 ? parseInt(s, 16) : Math.round((parseInt(s, 16) / 255) * 1e3) / 1e3)).join(", ")})`
			: ""
	);
}
function decomposeColor(o) {
	if (o.type) return o;
	if (o.charAt(0) === "#") return decomposeColor(hexToRgb(o));
	const i = o.indexOf("("),
		a = o.substring(0, i);
	if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(a) === -1)
		throw new Error(formatMuiErrorMessage(9, o));
	let s = o.substring(i + 1, o.length - 1),
		$;
	if (a === "color") {
		if (
			((s = s.split(" ")),
			($ = s.shift()),
			s.length === 4 && s[3].charAt(0) === "/" && (s[3] = s[3].slice(1)),
			["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf($) === -1)
		)
			throw new Error(formatMuiErrorMessage(10, $));
	} else s = s.split(",");
	return ((s = s.map((j) => parseFloat(j))), { type: a, values: s, colorSpace: $ });
}
function recomposeColor(o) {
	const { type: i, colorSpace: a } = o;
	let { values: s } = o;
	return (
		i.indexOf("rgb") !== -1
			? (s = s.map(($, j) => (j < 3 ? parseInt($, 10) : $)))
			: i.indexOf("hsl") !== -1 && ((s[1] = `${s[1]}%`), (s[2] = `${s[2]}%`)),
		i.indexOf("color") !== -1 ? (s = `${a} ${s.join(" ")}`) : (s = `${s.join(", ")}`),
		`${i}(${s})`
	);
}
function hslToRgb(o) {
	o = decomposeColor(o);
	const { values: i } = o,
		a = i[0],
		s = i[1] / 100,
		$ = i[2] / 100,
		j = s * Math.min($, 1 - $),
		_e = (rt, nt = (rt + a / 30) % 12) => $ - j * Math.max(Math.min(nt - 3, 9 - nt, 1), -1);
	let et = "rgb";
	const tt = [Math.round(_e(0) * 255), Math.round(_e(8) * 255), Math.round(_e(4) * 255)];
	return (
		o.type === "hsla" && ((et += "a"), tt.push(i[3])), recomposeColor({ type: et, values: tt })
	);
}
function getLuminance(o) {
	o = decomposeColor(o);
	let i = o.type === "hsl" || o.type === "hsla" ? decomposeColor(hslToRgb(o)).values : o.values;
	return (
		(i = i.map(
			(a) => (
				o.type !== "color" && (a /= 255),
				a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4
			)
		)),
		Number((0.2126 * i[0] + 0.7152 * i[1] + 0.0722 * i[2]).toFixed(3))
	);
}
function getContrastRatio(o, i) {
	const a = getLuminance(o),
		s = getLuminance(i);
	return (Math.max(a, s) + 0.05) / (Math.min(a, s) + 0.05);
}
function alpha(o, i) {
	return (
		(o = decomposeColor(o)),
		(i = clamp(i)),
		(o.type === "rgb" || o.type === "hsl") && (o.type += "a"),
		o.type === "color" ? (o.values[3] = `/${i}`) : (o.values[3] = i),
		recomposeColor(o)
	);
}
function darken(o, i) {
	if (((o = decomposeColor(o)), (i = clamp(i)), o.type.indexOf("hsl") !== -1)) o.values[2] *= 1 - i;
	else if (o.type.indexOf("rgb") !== -1 || o.type.indexOf("color") !== -1)
		for (let a = 0; a < 3; a += 1) o.values[a] *= 1 - i;
	return recomposeColor(o);
}
function lighten(o, i) {
	if (((o = decomposeColor(o)), (i = clamp(i)), o.type.indexOf("hsl") !== -1))
		o.values[2] += (100 - o.values[2]) * i;
	else if (o.type.indexOf("rgb") !== -1)
		for (let a = 0; a < 3; a += 1) o.values[a] += (255 - o.values[a]) * i;
	else if (o.type.indexOf("color") !== -1)
		for (let a = 0; a < 3; a += 1) o.values[a] += (1 - o.values[a]) * i;
	return recomposeColor(o);
}
const ThemeContext = reactExports.createContext(null),
	ThemeContext$1 = ThemeContext;
function useTheme$1() {
	return reactExports.useContext(ThemeContext$1);
}
const hasSymbol = typeof Symbol == "function" && Symbol.for,
	nested = hasSymbol ? Symbol.for("mui.nested") : "__THEME_NESTED__";
function mergeOuterLocalTheme(o, i) {
	return typeof i == "function" ? i(o) : _extends$9({}, o, i);
}
function ThemeProvider$2(o) {
	const { children: i, theme: a } = o,
		s = useTheme$1(),
		$ = reactExports.useMemo(() => {
			const j = s === null ? a : mergeOuterLocalTheme(s, a);
			return (j != null && (j[nested] = s !== null), j);
		}, [a, s]);
	return jsxRuntimeExports.jsx(ThemeContext$1.Provider, { value: $, children: i });
}
const EMPTY_THEME = {};
function useThemeScoping(o, i, a, s = !1) {
	return reactExports.useMemo(() => {
		const $ = (o && i[o]) || i;
		if (typeof a == "function") {
			const j = a($),
				_e = o ? _extends$9({}, i, { [o]: j }) : j;
			return s ? () => _e : _e;
		}
		return o ? _extends$9({}, i, { [o]: a }) : _extends$9({}, i, a);
	}, [o, i, a, s]);
}
function ThemeProvider$1(o) {
	const { children: i, theme: a, themeId: s } = o,
		$ = useTheme$3(EMPTY_THEME),
		j = useTheme$1() || EMPTY_THEME,
		_e = useThemeScoping(s, $, a),
		et = useThemeScoping(s, j, a, !0);
	return jsxRuntimeExports.jsx(ThemeProvider$2, {
		theme: et,
		children: jsxRuntimeExports.jsx(ThemeContext$2.Provider, { value: _e, children: i }),
	});
}
const _excluded$j = ["className", "component", "disableGutters", "fixed", "maxWidth", "classes"],
	defaultTheme$4 = createTheme$1(),
	defaultCreateStyledComponent$1 = systemStyled("div", {
		name: "MuiContainer",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				i[`maxWidth${capitalize(String(a.maxWidth))}`],
				a.fixed && i.fixed,
				a.disableGutters && i.disableGutters,
			];
		},
	}),
	useThemePropsDefault$1 = (o) =>
		useThemeProps$1({ props: o, name: "MuiContainer", defaultTheme: defaultTheme$4 }),
	useUtilityClasses$a = (o, i) => {
		const a = (tt) => generateUtilityClass(i, tt),
			{ classes: s, fixed: $, disableGutters: j, maxWidth: _e } = o,
			et = {
				root: [
					"root",
					_e && `maxWidth${capitalize(String(_e))}`,
					$ && "fixed",
					j && "disableGutters",
				],
			};
		return composeClasses(et, a, s);
	};
function createContainer(o = {}) {
	const {
			createStyledComponent: i = defaultCreateStyledComponent$1,
			useThemeProps: a = useThemePropsDefault$1,
			componentName: s = "MuiContainer",
		} = o,
		$ = i(
			({ theme: _e, ownerState: et }) =>
				_extends$9(
					{
						width: "100%",
						marginLeft: "auto",
						boxSizing: "border-box",
						marginRight: "auto",
						display: "block",
					},
					!et.disableGutters && {
						paddingLeft: _e.spacing(2),
						paddingRight: _e.spacing(2),
						[_e.breakpoints.up("sm")]: { paddingLeft: _e.spacing(3), paddingRight: _e.spacing(3) },
					}
				),
			({ theme: _e, ownerState: et }) =>
				et.fixed &&
				Object.keys(_e.breakpoints.values).reduce((tt, rt) => {
					const nt = rt,
						it = _e.breakpoints.values[nt];
					return (
						it !== 0 && (tt[_e.breakpoints.up(nt)] = { maxWidth: `${it}${_e.breakpoints.unit}` }),
						tt
					);
				}, {}),
			({ theme: _e, ownerState: et }) =>
				_extends$9(
					{},
					et.maxWidth === "xs" && {
						[_e.breakpoints.up("xs")]: { maxWidth: Math.max(_e.breakpoints.values.xs, 444) },
					},
					et.maxWidth &&
						et.maxWidth !== "xs" && {
							[_e.breakpoints.up(et.maxWidth)]: {
								maxWidth: `${_e.breakpoints.values[et.maxWidth]}${_e.breakpoints.unit}`,
							},
						}
				)
		);
	return reactExports.forwardRef(function (et, tt) {
		const rt = a(et),
			{
				className: nt,
				component: it = "div",
				disableGutters: ot = !1,
				fixed: st = !1,
				maxWidth: lt = "lg",
			} = rt,
			dt = _objectWithoutPropertiesLoose(rt, _excluded$j),
			pt = _extends$9({}, rt, { component: it, disableGutters: ot, fixed: st, maxWidth: lt }),
			ct = useUtilityClasses$a(pt, s);
		return jsxRuntimeExports.jsx(
			$,
			_extends$9({ as: it, ownerState: pt, className: clsx(ct.root, nt), ref: tt }, dt)
		);
	});
}
const _excluded$i = [
		"component",
		"direction",
		"spacing",
		"divider",
		"children",
		"className",
		"useFlexGap",
	],
	defaultTheme$3 = createTheme$1(),
	defaultCreateStyledComponent = systemStyled("div", {
		name: "MuiStack",
		slot: "Root",
		overridesResolver: (o, i) => i.root,
	});
function useThemePropsDefault(o) {
	return useThemeProps$1({ props: o, name: "MuiStack", defaultTheme: defaultTheme$3 });
}
function joinChildren(o, i) {
	const a = reactExports.Children.toArray(o).filter(Boolean);
	return a.reduce(
		(s, $, j) => (
			s.push($),
			j < a.length - 1 && s.push(reactExports.cloneElement(i, { key: `separator-${j}` })),
			s
		),
		[]
	);
}
const getSideFromDirection = (o) =>
		({ row: "Left", "row-reverse": "Right", column: "Top", "column-reverse": "Bottom" })[o],
	style$1 = ({ ownerState: o, theme: i }) => {
		let a = _extends$9(
			{ display: "flex", flexDirection: "column" },
			handleBreakpoints(
				{ theme: i },
				resolveBreakpointValues({ values: o.direction, breakpoints: i.breakpoints.values }),
				(s) => ({ flexDirection: s })
			)
		);
		if (o.spacing) {
			const s = createUnarySpacing(i),
				$ = Object.keys(i.breakpoints.values).reduce(
					(tt, rt) => (
						((typeof o.spacing == "object" && o.spacing[rt] != null) ||
							(typeof o.direction == "object" && o.direction[rt] != null)) &&
							(tt[rt] = !0),
						tt
					),
					{}
				),
				j = resolveBreakpointValues({ values: o.direction, base: $ }),
				_e = resolveBreakpointValues({ values: o.spacing, base: $ });
			(typeof j == "object" &&
				Object.keys(j).forEach((tt, rt, nt) => {
					if (!j[tt]) {
						const ot = rt > 0 ? j[nt[rt - 1]] : "column";
						j[tt] = ot;
					}
				}),
				(a = deepmerge(
					a,
					handleBreakpoints({ theme: i }, _e, (tt, rt) =>
						o.useFlexGap
							? { gap: getValue(s, tt) }
							: {
									"& > :not(style):not(style)": { margin: 0 },
									"& > :not(style) ~ :not(style)": {
										[`margin${getSideFromDirection(rt ? j[rt] : o.direction)}`]: getValue(s, tt),
									},
								}
					)
				)));
		}
		return ((a = mergeBreakpointsInOrder(i.breakpoints, a)), a);
	};
function createStack(o = {}) {
	const {
			createStyledComponent: i = defaultCreateStyledComponent,
			useThemeProps: a = useThemePropsDefault,
			componentName: s = "MuiStack",
		} = o,
		$ = () => composeClasses({ root: ["root"] }, (tt) => generateUtilityClass(s, tt), {}),
		j = i(style$1);
	return reactExports.forwardRef(function (tt, rt) {
		const nt = a(tt),
			it = extendSxProp(nt),
			{
				component: ot = "div",
				direction: st = "column",
				spacing: lt = 0,
				divider: dt,
				children: pt,
				className: ct,
				useFlexGap: at = !1,
			} = it,
			ft = _objectWithoutPropertiesLoose(it, _excluded$i),
			ut = { direction: st, spacing: lt, useFlexGap: at },
			ht = $();
		return jsxRuntimeExports.jsx(
			j,
			_extends$9({ as: ot, ownerState: ut, ref: rt, className: clsx(ht.root, ct) }, ft, {
				children: dt ? joinChildren(pt, dt) : pt,
			})
		);
	});
}
const Stack$2 = createStack(),
	Stack$3 = Stack$2;
function createMixins(o, i) {
	return _extends$9(
		{
			toolbar: {
				minHeight: 56,
				[o.up("xs")]: { "@media (orientation: landscape)": { minHeight: 48 } },
				[o.up("sm")]: { minHeight: 64 },
			},
		},
		i
	);
}
const _excluded$h = ["mode", "contrastThreshold", "tonalOffset"],
	light = {
		text: {
			primary: "rgba(0, 0, 0, 0.87)",
			secondary: "rgba(0, 0, 0, 0.6)",
			disabled: "rgba(0, 0, 0, 0.38)",
		},
		divider: "rgba(0, 0, 0, 0.12)",
		background: { paper: common$1.white, default: common$1.white },
		action: {
			active: "rgba(0, 0, 0, 0.54)",
			hover: "rgba(0, 0, 0, 0.04)",
			hoverOpacity: 0.04,
			selected: "rgba(0, 0, 0, 0.08)",
			selectedOpacity: 0.08,
			disabled: "rgba(0, 0, 0, 0.26)",
			disabledBackground: "rgba(0, 0, 0, 0.12)",
			disabledOpacity: 0.38,
			focus: "rgba(0, 0, 0, 0.12)",
			focusOpacity: 0.12,
			activatedOpacity: 0.12,
		},
	},
	dark$1 = {
		text: {
			primary: common$1.white,
			secondary: "rgba(255, 255, 255, 0.7)",
			disabled: "rgba(255, 255, 255, 0.5)",
			icon: "rgba(255, 255, 255, 0.5)",
		},
		divider: "rgba(255, 255, 255, 0.12)",
		background: { paper: "#121212", default: "#121212" },
		action: {
			active: common$1.white,
			hover: "rgba(255, 255, 255, 0.08)",
			hoverOpacity: 0.08,
			selected: "rgba(255, 255, 255, 0.16)",
			selectedOpacity: 0.16,
			disabled: "rgba(255, 255, 255, 0.3)",
			disabledBackground: "rgba(255, 255, 255, 0.12)",
			disabledOpacity: 0.38,
			focus: "rgba(255, 255, 255, 0.12)",
			focusOpacity: 0.12,
			activatedOpacity: 0.24,
		},
	};
function addLightOrDark(o, i, a, s) {
	const $ = s.light || s,
		j = s.dark || s * 1.5;
	o[i] ||
		(o.hasOwnProperty(a)
			? (o[i] = o[a])
			: i === "light"
				? (o.light = lighten(o.main, $))
				: i === "dark" && (o.dark = darken(o.main, j)));
}
function getDefaultPrimary(o = "light") {
	return o === "dark"
		? { main: blue$1[200], light: blue$1[50], dark: blue$1[400] }
		: { main: blue$1[700], light: blue$1[400], dark: blue$1[800] };
}
function getDefaultSecondary(o = "light") {
	return o === "dark"
		? { main: purple$1[200], light: purple$1[50], dark: purple$1[400] }
		: { main: purple$1[500], light: purple$1[300], dark: purple$1[700] };
}
function getDefaultError(o = "light") {
	return o === "dark"
		? { main: red$1[500], light: red$1[300], dark: red$1[700] }
		: { main: red$1[700], light: red$1[400], dark: red$1[800] };
}
function getDefaultInfo(o = "light") {
	return o === "dark"
		? { main: lightBlue$1[400], light: lightBlue$1[300], dark: lightBlue$1[700] }
		: { main: lightBlue$1[700], light: lightBlue$1[500], dark: lightBlue$1[900] };
}
function getDefaultSuccess(o = "light") {
	return o === "dark"
		? { main: green$1[400], light: green$1[300], dark: green$1[700] }
		: { main: green$1[800], light: green$1[500], dark: green$1[900] };
}
function getDefaultWarning(o = "light") {
	return o === "dark"
		? { main: orange$1[400], light: orange$1[300], dark: orange$1[700] }
		: { main: "#ed6c02", light: orange$1[500], dark: orange$1[900] };
}
function createPalette(o) {
	const { mode: i = "light", contrastThreshold: a = 3, tonalOffset: s = 0.2 } = o,
		$ = _objectWithoutPropertiesLoose(o, _excluded$h),
		j = o.primary || getDefaultPrimary(i),
		_e = o.secondary || getDefaultSecondary(i),
		et = o.error || getDefaultError(i),
		tt = o.info || getDefaultInfo(i),
		rt = o.success || getDefaultSuccess(i),
		nt = o.warning || getDefaultWarning(i);
	function it(dt) {
		return getContrastRatio(dt, dark$1.text.primary) >= a
			? dark$1.text.primary
			: light.text.primary;
	}
	const ot = ({
			color: dt,
			name: pt,
			mainShade: ct = 500,
			lightShade: at = 300,
			darkShade: ft = 700,
		}) => {
			if (
				((dt = _extends$9({}, dt)),
				!dt.main && dt[ct] && (dt.main = dt[ct]),
				!dt.hasOwnProperty("main"))
			)
				throw new Error(formatMuiErrorMessage(11, pt ? ` (${pt})` : "", ct));
			if (typeof dt.main != "string")
				throw new Error(formatMuiErrorMessage(12, pt ? ` (${pt})` : "", JSON.stringify(dt.main)));
			return (
				addLightOrDark(dt, "light", at, s),
				addLightOrDark(dt, "dark", ft, s),
				dt.contrastText || (dt.contrastText = it(dt.main)),
				dt
			);
		},
		st = { dark: dark$1, light };
	return deepmerge(
		_extends$9(
			{
				common: _extends$9({}, common$1),
				mode: i,
				primary: ot({ color: j, name: "primary" }),
				secondary: ot({
					color: _e,
					name: "secondary",
					mainShade: "A400",
					lightShade: "A200",
					darkShade: "A700",
				}),
				error: ot({ color: et, name: "error" }),
				warning: ot({ color: nt, name: "warning" }),
				info: ot({ color: tt, name: "info" }),
				success: ot({ color: rt, name: "success" }),
				grey: grey$1,
				contrastThreshold: a,
				getContrastText: it,
				augmentColor: ot,
				tonalOffset: s,
			},
			st[i]
		),
		$
	);
}
const _excluded$g = [
	"fontFamily",
	"fontSize",
	"fontWeightLight",
	"fontWeightRegular",
	"fontWeightMedium",
	"fontWeightBold",
	"htmlFontSize",
	"allVariants",
	"pxToRem",
];
function round(o) {
	return Math.round(o * 1e5) / 1e5;
}
const caseAllCaps = { textTransform: "uppercase" },
	defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
function createTypography(o, i) {
	const a = typeof i == "function" ? i(o) : i,
		{
			fontFamily: s = defaultFontFamily,
			fontSize: $ = 14,
			fontWeightLight: j = 300,
			fontWeightRegular: _e = 400,
			fontWeightMedium: et = 500,
			fontWeightBold: tt = 700,
			htmlFontSize: rt = 16,
			allVariants: nt,
			pxToRem: it,
		} = a,
		ot = _objectWithoutPropertiesLoose(a, _excluded$g),
		st = $ / 14,
		lt = it || ((ct) => `${(ct / rt) * st}rem`),
		dt = (ct, at, ft, ut, ht) =>
			_extends$9(
				{ fontFamily: s, fontWeight: ct, fontSize: lt(at), lineHeight: ft },
				s === defaultFontFamily ? { letterSpacing: `${round(ut / at)}em` } : {},
				ht,
				nt
			),
		pt = {
			h1: dt(j, 96, 1.167, -1.5),
			h2: dt(j, 60, 1.2, -0.5),
			h3: dt(_e, 48, 1.167, 0),
			h4: dt(_e, 34, 1.235, 0.25),
			h5: dt(_e, 24, 1.334, 0),
			h6: dt(et, 20, 1.6, 0.15),
			subtitle1: dt(_e, 16, 1.75, 0.15),
			subtitle2: dt(et, 14, 1.57, 0.1),
			body1: dt(_e, 16, 1.5, 0.15),
			body2: dt(_e, 14, 1.43, 0.15),
			button: dt(et, 14, 1.75, 0.4, caseAllCaps),
			caption: dt(_e, 12, 1.66, 0.4),
			overline: dt(_e, 12, 2.66, 1, caseAllCaps),
			inherit: {
				fontFamily: "inherit",
				fontWeight: "inherit",
				fontSize: "inherit",
				lineHeight: "inherit",
				letterSpacing: "inherit",
			},
		};
	return deepmerge(
		_extends$9(
			{
				htmlFontSize: rt,
				pxToRem: lt,
				fontFamily: s,
				fontSize: $,
				fontWeightLight: j,
				fontWeightRegular: _e,
				fontWeightMedium: et,
				fontWeightBold: tt,
			},
			pt
		),
		ot,
		{ clone: !1 }
	);
}
const shadowKeyUmbraOpacity = 0.2,
	shadowKeyPenumbraOpacity = 0.14,
	shadowAmbientShadowOpacity = 0.12;
function createShadow(...o) {
	return [
		`${o[0]}px ${o[1]}px ${o[2]}px ${o[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`,
		`${o[4]}px ${o[5]}px ${o[6]}px ${o[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`,
		`${o[8]}px ${o[9]}px ${o[10]}px ${o[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`,
	].join(",");
}
const shadows = [
		"none",
		createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0),
		createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0),
		createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0),
		createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
		createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
		createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
		createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
		createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
		createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
		createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
		createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
		createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
		createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
		createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
		createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
		createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
		createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
		createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
		createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
		createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
		createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
		createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
		createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
		createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8),
	],
	shadows$1 = shadows,
	_excluded$f = ["duration", "easing", "delay"],
	easing = {
		easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
		easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
		easeIn: "cubic-bezier(0.4, 0, 1, 1)",
		sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
	},
	duration = {
		shortest: 150,
		shorter: 200,
		short: 250,
		standard: 300,
		complex: 375,
		enteringScreen: 225,
		leavingScreen: 195,
	};
function formatMs(o) {
	return `${Math.round(o)}ms`;
}
function getAutoHeightDuration(o) {
	if (!o) return 0;
	const i = o / 36;
	return Math.round((4 + 15 * i ** 0.25 + i / 5) * 10);
}
function createTransitions(o) {
	const i = _extends$9({}, easing, o.easing),
		a = _extends$9({}, duration, o.duration);
	return _extends$9(
		{
			getAutoHeightDuration,
			create: ($ = ["all"], j = {}) => {
				const { duration: _e = a.standard, easing: et = i.easeInOut, delay: tt = 0 } = j;
				return (
					_objectWithoutPropertiesLoose(j, _excluded$f),
					(Array.isArray($) ? $ : [$])
						.map(
							(rt) =>
								`${rt} ${typeof _e == "string" ? _e : formatMs(_e)} ${et} ${typeof tt == "string" ? tt : formatMs(tt)}`
						)
						.join(",")
				);
			},
		},
		o,
		{ easing: i, duration: a }
	);
}
const zIndex = {
		mobileStepper: 1e3,
		fab: 1050,
		speedDial: 1050,
		appBar: 1100,
		drawer: 1200,
		modal: 1300,
		snackbar: 1400,
		tooltip: 1500,
	},
	zIndex$1 = zIndex,
	_excluded$e = [
		"breakpoints",
		"mixins",
		"spacing",
		"palette",
		"transitions",
		"typography",
		"shape",
	];
function createTheme(o = {}, ...i) {
	const { mixins: a = {}, palette: s = {}, transitions: $ = {}, typography: j = {} } = o,
		_e = _objectWithoutPropertiesLoose(o, _excluded$e);
	if (o.vars) throw new Error(formatMuiErrorMessage(18));
	const et = createPalette(s),
		tt = createTheme$1(o);
	let rt = deepmerge(tt, {
		mixins: createMixins(tt.breakpoints, a),
		palette: et,
		shadows: shadows$1.slice(),
		typography: createTypography(et, j),
		transitions: createTransitions($),
		zIndex: _extends$9({}, zIndex$1),
	});
	return (
		(rt = deepmerge(rt, _e)),
		(rt = i.reduce((nt, it) => deepmerge(nt, it), rt)),
		(rt.unstable_sxConfig = _extends$9(
			{},
			defaultSxConfig$1,
			_e == null ? void 0 : _e.unstable_sxConfig
		)),
		(rt.unstable_sx = function (it) {
			return styleFunctionSx$1({ sx: it, theme: this });
		}),
		rt
	);
}
const defaultTheme$1 = createTheme(),
	defaultTheme$2 = defaultTheme$1;
function useTheme() {
	const o = useTheme$2(defaultTheme$2);
	return o[THEME_ID] || o;
}
function useThemeProps({ props: o, name: i }) {
	return useThemeProps$1({ props: o, name: i, defaultTheme: defaultTheme$2, themeId: THEME_ID });
}
const rootShouldForwardProp = (o) => shouldForwardProp(o) && o !== "classes",
	styled = createStyled({ themeId: THEME_ID, defaultTheme: defaultTheme$2, rootShouldForwardProp }),
	styled$1 = styled,
	_excluded$d = ["theme"];
function ThemeProvider(o) {
	let { theme: i } = o,
		a = _objectWithoutPropertiesLoose(o, _excluded$d);
	const s = i[THEME_ID];
	return jsxRuntimeExports.jsx(
		ThemeProvider$1,
		_extends$9({}, a, { themeId: s ? THEME_ID : void 0, theme: s || i })
	);
}
const getOverlayAlpha = (o) => {
		let i;
		return (o < 1 ? (i = 5.11916 * o ** 2) : (i = 4.5 * Math.log(o + 1) + 2), (i / 100).toFixed(2));
	},
	getOverlayAlpha$1 = getOverlayAlpha;
function getSvgIconUtilityClass(o) {
	return generateUtilityClass("MuiSvgIcon", o);
}
generateUtilityClasses("MuiSvgIcon", [
	"root",
	"colorPrimary",
	"colorSecondary",
	"colorAction",
	"colorError",
	"colorDisabled",
	"fontSizeInherit",
	"fontSizeSmall",
	"fontSizeMedium",
	"fontSizeLarge",
]);
const _excluded$c = [
		"children",
		"className",
		"color",
		"component",
		"fontSize",
		"htmlColor",
		"inheritViewBox",
		"titleAccess",
		"viewBox",
	],
	useUtilityClasses$9 = (o) => {
		const { color: i, fontSize: a, classes: s } = o,
			$ = {
				root: ["root", i !== "inherit" && `color${capitalize(i)}`, `fontSize${capitalize(a)}`],
			};
		return composeClasses($, getSvgIconUtilityClass, s);
	},
	SvgIconRoot = styled$1("svg", {
		name: "MuiSvgIcon",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				a.color !== "inherit" && i[`color${capitalize(a.color)}`],
				i[`fontSize${capitalize(a.fontSize)}`],
			];
		},
	})(({ theme: o, ownerState: i }) => {
		var a, s, $, j, _e, et, tt, rt, nt, it, ot, st, lt;
		return {
			userSelect: "none",
			width: "1em",
			height: "1em",
			display: "inline-block",
			fill: i.hasSvgAsChild ? void 0 : "currentColor",
			flexShrink: 0,
			transition:
				(a = o.transitions) == null || (s = a.create) == null
					? void 0
					: s.call(a, "fill", {
							duration:
								($ = o.transitions) == null || ($ = $.duration) == null ? void 0 : $.shorter,
						}),
			fontSize: {
				inherit: "inherit",
				small:
					((j = o.typography) == null || (_e = j.pxToRem) == null ? void 0 : _e.call(j, 20)) ||
					"1.25rem",
				medium:
					((et = o.typography) == null || (tt = et.pxToRem) == null ? void 0 : tt.call(et, 24)) ||
					"1.5rem",
				large:
					((rt = o.typography) == null || (nt = rt.pxToRem) == null ? void 0 : nt.call(rt, 35)) ||
					"2.1875rem",
			}[i.fontSize],
			color:
				(it =
					(ot = (o.vars || o).palette) == null || (ot = ot[i.color]) == null ? void 0 : ot.main) !=
				null
					? it
					: {
							action:
								(st = (o.vars || o).palette) == null || (st = st.action) == null
									? void 0
									: st.active,
							disabled:
								(lt = (o.vars || o).palette) == null || (lt = lt.action) == null
									? void 0
									: lt.disabled,
							inherit: void 0,
						}[i.color],
		};
	}),
	SvgIcon = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiSvgIcon" }),
			{
				children: $,
				className: j,
				color: _e = "inherit",
				component: et = "svg",
				fontSize: tt = "medium",
				htmlColor: rt,
				inheritViewBox: nt = !1,
				titleAccess: it,
				viewBox: ot = "0 0 24 24",
			} = s,
			st = _objectWithoutPropertiesLoose(s, _excluded$c),
			lt = reactExports.isValidElement($) && $.type === "svg",
			dt = _extends$9({}, s, {
				color: _e,
				component: et,
				fontSize: tt,
				instanceFontSize: i.fontSize,
				inheritViewBox: nt,
				viewBox: ot,
				hasSvgAsChild: lt,
			}),
			pt = {};
		nt || (pt.viewBox = ot);
		const ct = useUtilityClasses$9(dt);
		return jsxRuntimeExports.jsxs(
			SvgIconRoot,
			_extends$9(
				{
					as: et,
					className: clsx(ct.root, j),
					focusable: "false",
					color: rt,
					"aria-hidden": it ? void 0 : !0,
					role: it ? "img" : void 0,
					ref: a,
				},
				pt,
				st,
				lt && $.props,
				{
					ownerState: dt,
					children: [
						lt ? $.props.children : $,
						it ? jsxRuntimeExports.jsx("title", { children: it }) : null,
					],
				}
			)
		);
	});
SvgIcon.muiName = "SvgIcon";
const SvgIcon$1 = SvgIcon;
function createSvgIcon$1(o, i) {
	function a(s, $) {
		return jsxRuntimeExports.jsx(
			SvgIcon$1,
			_extends$9({ "data-testid": `${i}Icon`, ref: $ }, s, { children: o })
		);
	}
	return ((a.muiName = SvgIcon$1.muiName), reactExports.memo(reactExports.forwardRef(a)));
}
const unstable_ClassNameGenerator = {
		configure: (o) => {
			ClassNameGenerator$1.configure(o);
		},
	},
	utils = Object.freeze(
		Object.defineProperty(
			{
				__proto__: null,
				capitalize,
				createChainedFunction,
				createSvgIcon: createSvgIcon$1,
				debounce,
				deprecatedPropType,
				isMuiElement,
				ownerDocument,
				ownerWindow,
				requirePropFactory,
				setRef,
				unstable_ClassNameGenerator,
				unstable_useEnhancedEffect: useEnhancedEffect$1,
				unstable_useId: useId,
				unsupportedProp,
				useControlled,
				useEventCallback,
				useForkRef,
				useIsFocusVisible,
			},
			Symbol.toStringTag,
			{ value: "Module" }
		)
	);
function _setPrototypeOf(o, i) {
	return (
		(_setPrototypeOf = Object.setPrototypeOf
			? Object.setPrototypeOf.bind()
			: function (s, $) {
					return ((s.__proto__ = $), s);
				}),
		_setPrototypeOf(o, i)
	);
}
function _inheritsLoose(o, i) {
	((o.prototype = Object.create(i.prototype)),
		(o.prototype.constructor = o),
		_setPrototypeOf(o, i));
}
const config = { disabled: !1 },
	TransitionGroupContext = React.createContext(null);
var forceReflow = function (i) {
		return i.scrollTop;
	},
	UNMOUNTED = "unmounted",
	EXITED = "exited",
	ENTERING = "entering",
	ENTERED = "entered",
	EXITING = "exiting",
	Transition = (function (o) {
		_inheritsLoose(i, o);
		function i(s, $) {
			var j;
			j = o.call(this, s, $) || this;
			var _e = $,
				et = _e && !_e.isMounting ? s.enter : s.appear,
				tt;
			return (
				(j.appearStatus = null),
				s.in
					? et
						? ((tt = EXITED), (j.appearStatus = ENTERING))
						: (tt = ENTERED)
					: s.unmountOnExit || s.mountOnEnter
						? (tt = UNMOUNTED)
						: (tt = EXITED),
				(j.state = { status: tt }),
				(j.nextCallback = null),
				j
			);
		}
		i.getDerivedStateFromProps = function ($, j) {
			var _e = $.in;
			return _e && j.status === UNMOUNTED ? { status: EXITED } : null;
		};
		var a = i.prototype;
		return (
			(a.componentDidMount = function () {
				this.updateStatus(!0, this.appearStatus);
			}),
			(a.componentDidUpdate = function ($) {
				var j = null;
				if ($ !== this.props) {
					var _e = this.state.status;
					this.props.in
						? _e !== ENTERING && _e !== ENTERED && (j = ENTERING)
						: (_e === ENTERING || _e === ENTERED) && (j = EXITING);
				}
				this.updateStatus(!1, j);
			}),
			(a.componentWillUnmount = function () {
				this.cancelNextCallback();
			}),
			(a.getTimeouts = function () {
				var $ = this.props.timeout,
					j,
					_e,
					et;
				return (
					(j = _e = et = $),
					$ != null &&
						typeof $ != "number" &&
						((j = $.exit), (_e = $.enter), (et = $.appear !== void 0 ? $.appear : _e)),
					{ exit: j, enter: _e, appear: et }
				);
			}),
			(a.updateStatus = function ($, j) {
				if (($ === void 0 && ($ = !1), j !== null))
					if ((this.cancelNextCallback(), j === ENTERING)) {
						if (this.props.unmountOnExit || this.props.mountOnEnter) {
							var _e = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
							_e && forceReflow(_e);
						}
						this.performEnter($);
					} else this.performExit();
				else
					this.props.unmountOnExit &&
						this.state.status === EXITED &&
						this.setState({ status: UNMOUNTED });
			}),
			(a.performEnter = function ($) {
				var j = this,
					_e = this.props.enter,
					et = this.context ? this.context.isMounting : $,
					tt = this.props.nodeRef ? [et] : [ReactDOM.findDOMNode(this), et],
					rt = tt[0],
					nt = tt[1],
					it = this.getTimeouts(),
					ot = et ? it.appear : it.enter;
				if ((!$ && !_e) || config.disabled) {
					this.safeSetState({ status: ENTERED }, function () {
						j.props.onEntered(rt);
					});
					return;
				}
				(this.props.onEnter(rt, nt),
					this.safeSetState({ status: ENTERING }, function () {
						(j.props.onEntering(rt, nt),
							j.onTransitionEnd(ot, function () {
								j.safeSetState({ status: ENTERED }, function () {
									j.props.onEntered(rt, nt);
								});
							}));
					}));
			}),
			(a.performExit = function () {
				var $ = this,
					j = this.props.exit,
					_e = this.getTimeouts(),
					et = this.props.nodeRef ? void 0 : ReactDOM.findDOMNode(this);
				if (!j || config.disabled) {
					this.safeSetState({ status: EXITED }, function () {
						$.props.onExited(et);
					});
					return;
				}
				(this.props.onExit(et),
					this.safeSetState({ status: EXITING }, function () {
						($.props.onExiting(et),
							$.onTransitionEnd(_e.exit, function () {
								$.safeSetState({ status: EXITED }, function () {
									$.props.onExited(et);
								});
							}));
					}));
			}),
			(a.cancelNextCallback = function () {
				this.nextCallback !== null && (this.nextCallback.cancel(), (this.nextCallback = null));
			}),
			(a.safeSetState = function ($, j) {
				((j = this.setNextCallback(j)), this.setState($, j));
			}),
			(a.setNextCallback = function ($) {
				var j = this,
					_e = !0;
				return (
					(this.nextCallback = function (et) {
						_e && ((_e = !1), (j.nextCallback = null), $(et));
					}),
					(this.nextCallback.cancel = function () {
						_e = !1;
					}),
					this.nextCallback
				);
			}),
			(a.onTransitionEnd = function ($, j) {
				this.setNextCallback(j);
				var _e = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this),
					et = $ == null && !this.props.addEndListener;
				if (!_e || et) {
					setTimeout(this.nextCallback, 0);
					return;
				}
				if (this.props.addEndListener) {
					var tt = this.props.nodeRef ? [this.nextCallback] : [_e, this.nextCallback],
						rt = tt[0],
						nt = tt[1];
					this.props.addEndListener(rt, nt);
				}
				$ != null && setTimeout(this.nextCallback, $);
			}),
			(a.render = function () {
				var $ = this.state.status;
				if ($ === UNMOUNTED) return null;
				var j = this.props,
					_e = j.children;
				(j.in,
					j.mountOnEnter,
					j.unmountOnExit,
					j.appear,
					j.enter,
					j.exit,
					j.timeout,
					j.addEndListener,
					j.onEnter,
					j.onEntering,
					j.onEntered,
					j.onExit,
					j.onExiting,
					j.onExited,
					j.nodeRef);
				var et = _objectWithoutPropertiesLoose(j, [
					"children",
					"in",
					"mountOnEnter",
					"unmountOnExit",
					"appear",
					"enter",
					"exit",
					"timeout",
					"addEndListener",
					"onEnter",
					"onEntering",
					"onEntered",
					"onExit",
					"onExiting",
					"onExited",
					"nodeRef",
				]);
				return React.createElement(
					TransitionGroupContext.Provider,
					{ value: null },
					typeof _e == "function" ? _e($, et) : React.cloneElement(React.Children.only(_e), et)
				);
			}),
			i
		);
	})(React.Component);
Transition.contextType = TransitionGroupContext;
Transition.propTypes = {};
function noop$1() {}
Transition.defaultProps = {
	in: !1,
	mountOnEnter: !1,
	unmountOnExit: !1,
	appear: !1,
	enter: !0,
	exit: !0,
	onEnter: noop$1,
	onEntering: noop$1,
	onEntered: noop$1,
	onExit: noop$1,
	onExiting: noop$1,
	onExited: noop$1,
};
Transition.UNMOUNTED = UNMOUNTED;
Transition.EXITED = EXITED;
Transition.ENTERING = ENTERING;
Transition.ENTERED = ENTERED;
Transition.EXITING = EXITING;
const Transition$1 = Transition;
function _assertThisInitialized(o) {
	if (o === void 0)
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return o;
}
function getChildMapping(o, i) {
	var a = function (j) {
			return i && reactExports.isValidElement(j) ? i(j) : j;
		},
		s = Object.create(null);
	return (
		o &&
			reactExports.Children.map(o, function ($) {
				return $;
			}).forEach(function ($) {
				s[$.key] = a($);
			}),
		s
	);
}
function mergeChildMappings(o, i) {
	((o = o || {}), (i = i || {}));
	function a(nt) {
		return nt in i ? i[nt] : o[nt];
	}
	var s = Object.create(null),
		$ = [];
	for (var j in o) j in i ? $.length && ((s[j] = $), ($ = [])) : $.push(j);
	var _e,
		et = {};
	for (var tt in i) {
		if (s[tt])
			for (_e = 0; _e < s[tt].length; _e++) {
				var rt = s[tt][_e];
				et[s[tt][_e]] = a(rt);
			}
		et[tt] = a(tt);
	}
	for (_e = 0; _e < $.length; _e++) et[$[_e]] = a($[_e]);
	return et;
}
function getProp(o, i, a) {
	return a[i] != null ? a[i] : o.props[i];
}
function getInitialChildMapping(o, i) {
	return getChildMapping(o.children, function (a) {
		return reactExports.cloneElement(a, {
			onExited: i.bind(null, a),
			in: !0,
			appear: getProp(a, "appear", o),
			enter: getProp(a, "enter", o),
			exit: getProp(a, "exit", o),
		});
	});
}
function getNextChildMapping(o, i, a) {
	var s = getChildMapping(o.children),
		$ = mergeChildMappings(i, s);
	return (
		Object.keys($).forEach(function (j) {
			var _e = $[j];
			if (reactExports.isValidElement(_e)) {
				var et = j in i,
					tt = j in s,
					rt = i[j],
					nt = reactExports.isValidElement(rt) && !rt.props.in;
				tt && (!et || nt)
					? ($[j] = reactExports.cloneElement(_e, {
							onExited: a.bind(null, _e),
							in: !0,
							exit: getProp(_e, "exit", o),
							enter: getProp(_e, "enter", o),
						}))
					: !tt && et && !nt
						? ($[j] = reactExports.cloneElement(_e, { in: !1 }))
						: tt &&
							et &&
							reactExports.isValidElement(rt) &&
							($[j] = reactExports.cloneElement(_e, {
								onExited: a.bind(null, _e),
								in: rt.props.in,
								exit: getProp(_e, "exit", o),
								enter: getProp(_e, "enter", o),
							}));
			}
		}),
		$
	);
}
var values =
		Object.values ||
		function (o) {
			return Object.keys(o).map(function (i) {
				return o[i];
			});
		},
	defaultProps = {
		component: "div",
		childFactory: function (i) {
			return i;
		},
	},
	TransitionGroup = (function (o) {
		_inheritsLoose(i, o);
		function i(s, $) {
			var j;
			j = o.call(this, s, $) || this;
			var _e = j.handleExited.bind(_assertThisInitialized(j));
			return (
				(j.state = { contextValue: { isMounting: !0 }, handleExited: _e, firstRender: !0 }), j
			);
		}
		var a = i.prototype;
		return (
			(a.componentDidMount = function () {
				((this.mounted = !0), this.setState({ contextValue: { isMounting: !1 } }));
			}),
			(a.componentWillUnmount = function () {
				this.mounted = !1;
			}),
			(i.getDerivedStateFromProps = function ($, j) {
				var _e = j.children,
					et = j.handleExited,
					tt = j.firstRender;
				return {
					children: tt ? getInitialChildMapping($, et) : getNextChildMapping($, _e, et),
					firstRender: !1,
				};
			}),
			(a.handleExited = function ($, j) {
				var _e = getChildMapping(this.props.children);
				$.key in _e ||
					($.props.onExited && $.props.onExited(j),
					this.mounted &&
						this.setState(function (et) {
							var tt = _extends$9({}, et.children);
							return (delete tt[$.key], { children: tt });
						}));
			}),
			(a.render = function () {
				var $ = this.props,
					j = $.component,
					_e = $.childFactory,
					et = _objectWithoutPropertiesLoose($, ["component", "childFactory"]),
					tt = this.state.contextValue,
					rt = values(this.state.children).map(_e);
				return (
					delete et.appear,
					delete et.enter,
					delete et.exit,
					j === null
						? React.createElement(TransitionGroupContext.Provider, { value: tt }, rt)
						: React.createElement(
								TransitionGroupContext.Provider,
								{ value: tt },
								React.createElement(j, et, rt)
							)
				);
			}),
			i
		);
	})(React.Component);
TransitionGroup.propTypes = {};
TransitionGroup.defaultProps = defaultProps;
const TransitionGroup$1 = TransitionGroup,
	reflow = (o) => o.scrollTop;
function getTransitionProps(o, i) {
	var a, s;
	const { timeout: $, easing: j, style: _e = {} } = o;
	return {
		duration: (a = _e.transitionDuration) != null ? a : typeof $ == "number" ? $ : $[i.mode] || 0,
		easing: (s = _e.transitionTimingFunction) != null ? s : typeof j == "object" ? j[i.mode] : j,
		delay: _e.transitionDelay,
	};
}
function getPaperUtilityClass(o) {
	return generateUtilityClass("MuiPaper", o);
}
generateUtilityClasses("MuiPaper", [
	"root",
	"rounded",
	"outlined",
	"elevation",
	"elevation0",
	"elevation1",
	"elevation2",
	"elevation3",
	"elevation4",
	"elevation5",
	"elevation6",
	"elevation7",
	"elevation8",
	"elevation9",
	"elevation10",
	"elevation11",
	"elevation12",
	"elevation13",
	"elevation14",
	"elevation15",
	"elevation16",
	"elevation17",
	"elevation18",
	"elevation19",
	"elevation20",
	"elevation21",
	"elevation22",
	"elevation23",
	"elevation24",
]);
const _excluded$b = ["className", "component", "elevation", "square", "variant"],
	useUtilityClasses$8 = (o) => {
		const { square: i, elevation: a, variant: s, classes: $ } = o,
			j = { root: ["root", s, !i && "rounded", s === "elevation" && `elevation${a}`] };
		return composeClasses(j, getPaperUtilityClass, $);
	},
	PaperRoot = styled$1("div", {
		name: "MuiPaper",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				i[a.variant],
				!a.square && i.rounded,
				a.variant === "elevation" && i[`elevation${a.elevation}`],
			];
		},
	})(({ theme: o, ownerState: i }) => {
		var a;
		return _extends$9(
			{
				backgroundColor: (o.vars || o).palette.background.paper,
				color: (o.vars || o).palette.text.primary,
				transition: o.transitions.create("box-shadow"),
			},
			!i.square && { borderRadius: o.shape.borderRadius },
			i.variant === "outlined" && { border: `1px solid ${(o.vars || o).palette.divider}` },
			i.variant === "elevation" &&
				_extends$9(
					{ boxShadow: (o.vars || o).shadows[i.elevation] },
					!o.vars &&
						o.palette.mode === "dark" && {
							backgroundImage: `linear-gradient(${alpha("#fff", getOverlayAlpha$1(i.elevation))}, ${alpha("#fff", getOverlayAlpha$1(i.elevation))})`,
						},
					o.vars && { backgroundImage: (a = o.vars.overlays) == null ? void 0 : a[i.elevation] }
				)
		);
	}),
	Paper = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiPaper" }),
			{
				className: $,
				component: j = "div",
				elevation: _e = 1,
				square: et = !1,
				variant: tt = "elevation",
			} = s,
			rt = _objectWithoutPropertiesLoose(s, _excluded$b),
			nt = _extends$9({}, s, { component: j, elevation: _e, square: et, variant: tt }),
			it = useUtilityClasses$8(nt);
		return jsxRuntimeExports.jsx(
			PaperRoot,
			_extends$9({ as: j, ownerState: nt, className: clsx(it.root, $), ref: a }, rt)
		);
	}),
	Paper$1 = Paper;
function Ripple(o) {
	const {
			className: i,
			classes: a,
			pulsate: s = !1,
			rippleX: $,
			rippleY: j,
			rippleSize: _e,
			in: et,
			onExited: tt,
			timeout: rt,
		} = o,
		[nt, it] = reactExports.useState(!1),
		ot = clsx(i, a.ripple, a.rippleVisible, s && a.ripplePulsate),
		st = { width: _e, height: _e, top: -(_e / 2) + j, left: -(_e / 2) + $ },
		lt = clsx(a.child, nt && a.childLeaving, s && a.childPulsate);
	return (
		!et && !nt && it(!0),
		reactExports.useEffect(() => {
			if (!et && tt != null) {
				const dt = setTimeout(tt, rt);
				return () => {
					clearTimeout(dt);
				};
			}
		}, [tt, et, rt]),
		jsxRuntimeExports.jsx("span", {
			className: ot,
			style: st,
			children: jsxRuntimeExports.jsx("span", { className: lt }),
		})
	);
}
const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", [
		"root",
		"ripple",
		"rippleVisible",
		"ripplePulsate",
		"child",
		"childLeaving",
		"childPulsate",
	]),
	touchRippleClasses$1 = touchRippleClasses,
	_excluded$a = ["center", "classes", "className"];
let _$1 = (o) => o,
	_t$1,
	_t2$1,
	_t3$1,
	_t4$1;
const DURATION = 550,
	DELAY_RIPPLE = 80,
	enterKeyframe = keyframes(
		_t$1 ||
			(_t$1 = _$1`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)
	),
	exitKeyframe = keyframes(
		_t2$1 ||
			(_t2$1 = _$1`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)
	),
	pulsateKeyframe = keyframes(
		_t3$1 ||
			(_t3$1 = _$1`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)
	),
	TouchRippleRoot = styled$1("span", { name: "MuiTouchRipple", slot: "Root" })({
		overflow: "hidden",
		pointerEvents: "none",
		position: "absolute",
		zIndex: 0,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		borderRadius: "inherit",
	}),
	TouchRippleRipple = styled$1(Ripple, { name: "MuiTouchRipple", slot: "Ripple" })(
		_t4$1 ||
			(_t4$1 = _$1`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`),
		touchRippleClasses$1.rippleVisible,
		enterKeyframe,
		DURATION,
		({ theme: o }) => o.transitions.easing.easeInOut,
		touchRippleClasses$1.ripplePulsate,
		({ theme: o }) => o.transitions.duration.shorter,
		touchRippleClasses$1.child,
		touchRippleClasses$1.childLeaving,
		exitKeyframe,
		DURATION,
		({ theme: o }) => o.transitions.easing.easeInOut,
		touchRippleClasses$1.childPulsate,
		pulsateKeyframe,
		({ theme: o }) => o.transitions.easing.easeInOut
	),
	TouchRipple = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiTouchRipple" }),
			{ center: $ = !1, classes: j = {}, className: _e } = s,
			et = _objectWithoutPropertiesLoose(s, _excluded$a),
			[tt, rt] = reactExports.useState([]),
			nt = reactExports.useRef(0),
			it = reactExports.useRef(null);
		reactExports.useEffect(() => {
			it.current && (it.current(), (it.current = null));
		}, [tt]);
		const ot = reactExports.useRef(!1),
			st = reactExports.useRef(0),
			lt = reactExports.useRef(null),
			dt = reactExports.useRef(null);
		reactExports.useEffect(
			() => () => {
				st.current && clearTimeout(st.current);
			},
			[]
		);
		const pt = reactExports.useCallback(
				(ut) => {
					const { pulsate: ht, rippleX: yt, rippleY: mt, rippleSize: Et, cb: Rt } = ut;
					(rt((vt) => [
						...vt,
						jsxRuntimeExports.jsx(
							TouchRippleRipple,
							{
								classes: {
									ripple: clsx(j.ripple, touchRippleClasses$1.ripple),
									rippleVisible: clsx(j.rippleVisible, touchRippleClasses$1.rippleVisible),
									ripplePulsate: clsx(j.ripplePulsate, touchRippleClasses$1.ripplePulsate),
									child: clsx(j.child, touchRippleClasses$1.child),
									childLeaving: clsx(j.childLeaving, touchRippleClasses$1.childLeaving),
									childPulsate: clsx(j.childPulsate, touchRippleClasses$1.childPulsate),
								},
								timeout: DURATION,
								pulsate: ht,
								rippleX: yt,
								rippleY: mt,
								rippleSize: Et,
							},
							nt.current
						),
					]),
						(nt.current += 1),
						(it.current = Rt));
				},
				[j]
			),
			ct = reactExports.useCallback(
				(ut = {}, ht = {}, yt = () => {}) => {
					const { pulsate: mt = !1, center: Et = $ || ht.pulsate, fakeElement: Rt = !1 } = ht;
					if ((ut == null ? void 0 : ut.type) === "mousedown" && ot.current) {
						ot.current = !1;
						return;
					}
					(ut == null ? void 0 : ut.type) === "touchstart" && (ot.current = !0);
					const vt = Rt ? null : dt.current,
						Tt = vt ? vt.getBoundingClientRect() : { width: 0, height: 0, left: 0, top: 0 };
					let Pt, Dt, Nt;
					if (
						Et ||
						ut === void 0 ||
						(ut.clientX === 0 && ut.clientY === 0) ||
						(!ut.clientX && !ut.touches)
					)
						((Pt = Math.round(Tt.width / 2)), (Dt = Math.round(Tt.height / 2)));
					else {
						const { clientX: $t, clientY: jt } =
							ut.touches && ut.touches.length > 0 ? ut.touches[0] : ut;
						((Pt = Math.round($t - Tt.left)), (Dt = Math.round(jt - Tt.top)));
					}
					if (Et)
						((Nt = Math.sqrt((2 * Tt.width ** 2 + Tt.height ** 2) / 3)), Nt % 2 === 0 && (Nt += 1));
					else {
						const $t = Math.max(Math.abs((vt ? vt.clientWidth : 0) - Pt), Pt) * 2 + 2,
							jt = Math.max(Math.abs((vt ? vt.clientHeight : 0) - Dt), Dt) * 2 + 2;
						Nt = Math.sqrt($t ** 2 + jt ** 2);
					}
					ut != null && ut.touches
						? lt.current === null &&
							((lt.current = () => {
								pt({ pulsate: mt, rippleX: Pt, rippleY: Dt, rippleSize: Nt, cb: yt });
							}),
							(st.current = setTimeout(() => {
								lt.current && (lt.current(), (lt.current = null));
							}, DELAY_RIPPLE)))
						: pt({ pulsate: mt, rippleX: Pt, rippleY: Dt, rippleSize: Nt, cb: yt });
				},
				[$, pt]
			),
			at = reactExports.useCallback(() => {
				ct({}, { pulsate: !0 });
			}, [ct]),
			ft = reactExports.useCallback((ut, ht) => {
				if (
					(clearTimeout(st.current), (ut == null ? void 0 : ut.type) === "touchend" && lt.current)
				) {
					(lt.current(),
						(lt.current = null),
						(st.current = setTimeout(() => {
							ft(ut, ht);
						})));
					return;
				}
				((lt.current = null), rt((yt) => (yt.length > 0 ? yt.slice(1) : yt)), (it.current = ht));
			}, []);
		return (
			reactExports.useImperativeHandle(a, () => ({ pulsate: at, start: ct, stop: ft }), [
				at,
				ct,
				ft,
			]),
			jsxRuntimeExports.jsx(
				TouchRippleRoot,
				_extends$9({ className: clsx(touchRippleClasses$1.root, j.root, _e), ref: dt }, et, {
					children: jsxRuntimeExports.jsx(TransitionGroup$1, {
						component: null,
						exit: !0,
						children: tt,
					}),
				})
			)
		);
	}),
	TouchRipple$1 = TouchRipple;
function getButtonBaseUtilityClass(o) {
	return generateUtilityClass("MuiButtonBase", o);
}
const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", [
		"root",
		"disabled",
		"focusVisible",
	]),
	buttonBaseClasses$1 = buttonBaseClasses,
	_excluded$9 = [
		"action",
		"centerRipple",
		"children",
		"className",
		"component",
		"disabled",
		"disableRipple",
		"disableTouchRipple",
		"focusRipple",
		"focusVisibleClassName",
		"LinkComponent",
		"onBlur",
		"onClick",
		"onContextMenu",
		"onDragLeave",
		"onFocus",
		"onFocusVisible",
		"onKeyDown",
		"onKeyUp",
		"onMouseDown",
		"onMouseLeave",
		"onMouseUp",
		"onTouchEnd",
		"onTouchMove",
		"onTouchStart",
		"tabIndex",
		"TouchRippleProps",
		"touchRippleRef",
		"type",
	],
	useUtilityClasses$7 = (o) => {
		const { disabled: i, focusVisible: a, focusVisibleClassName: s, classes: $ } = o,
			_e = composeClasses(
				{ root: ["root", i && "disabled", a && "focusVisible"] },
				getButtonBaseUtilityClass,
				$
			);
		return (a && s && (_e.root += ` ${s}`), _e);
	},
	ButtonBaseRoot = styled$1("button", {
		name: "MuiButtonBase",
		slot: "Root",
		overridesResolver: (o, i) => i.root,
	})({
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		boxSizing: "border-box",
		WebkitTapHighlightColor: "transparent",
		backgroundColor: "transparent",
		outline: 0,
		border: 0,
		margin: 0,
		borderRadius: 0,
		padding: 0,
		cursor: "pointer",
		userSelect: "none",
		verticalAlign: "middle",
		MozAppearance: "none",
		WebkitAppearance: "none",
		textDecoration: "none",
		color: "inherit",
		"&::-moz-focus-inner": { borderStyle: "none" },
		[`&.${buttonBaseClasses$1.disabled}`]: { pointerEvents: "none", cursor: "default" },
		"@media print": { colorAdjust: "exact" },
	}),
	ButtonBase = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiButtonBase" }),
			{
				action: $,
				centerRipple: j = !1,
				children: _e,
				className: et,
				component: tt = "button",
				disabled: rt = !1,
				disableRipple: nt = !1,
				disableTouchRipple: it = !1,
				focusRipple: ot = !1,
				LinkComponent: st = "a",
				onBlur: lt,
				onClick: dt,
				onContextMenu: pt,
				onDragLeave: ct,
				onFocus: at,
				onFocusVisible: ft,
				onKeyDown: ut,
				onKeyUp: ht,
				onMouseDown: yt,
				onMouseLeave: mt,
				onMouseUp: Et,
				onTouchEnd: Rt,
				onTouchMove: vt,
				onTouchStart: Tt,
				tabIndex: Pt = 0,
				TouchRippleProps: Dt,
				touchRippleRef: Nt,
				type: $t,
			} = s,
			jt = _objectWithoutPropertiesLoose(s, _excluded$9),
			It = reactExports.useRef(null),
			Ct = reactExports.useRef(null),
			St = useForkRef(Ct, Nt),
			{ isFocusVisibleRef: kt, onFocus: Ut, onBlur: Wt, ref: Xt } = useIsFocusVisible(),
			[Gt, er] = reactExports.useState(!1);
		(rt && Gt && er(!1),
			reactExports.useImperativeHandle(
				$,
				() => ({
					focusVisible: () => {
						(er(!0), It.current.focus());
					},
				}),
				[]
			));
		const [Jt, lr] = reactExports.useState(!1);
		reactExports.useEffect(() => {
			lr(!0);
		}, []);
		const kr = Jt && !nt && !rt;
		reactExports.useEffect(() => {
			Gt && ot && !nt && Jt && Ct.current.pulsate();
		}, [nt, ot, Gt, Jt]);
		function Ht(Ft, wr, jr = it) {
			return useEventCallback((hr) => (wr && wr(hr), !jr && Ct.current && Ct.current[Ft](hr), !0));
		}
		const dr = Ht("start", yt),
			Rr = Ht("stop", pt),
			_r = Ht("stop", ct),
			nr = Ht("stop", Et),
			Pr = Ht("stop", (Ft) => {
				(Gt && Ft.preventDefault(), mt && mt(Ft));
			}),
			Mr = Ht("start", Tt),
			Sr = Ht("stop", Rt),
			Or = Ht("stop", vt),
			Ir = Ht(
				"stop",
				(Ft) => {
					(Wt(Ft), kt.current === !1 && er(!1), lt && lt(Ft));
				},
				!1
			),
			Ar = useEventCallback((Ft) => {
				(It.current || (It.current = Ft.currentTarget),
					Ut(Ft),
					kt.current === !0 && (er(!0), ft && ft(Ft)),
					at && at(Ft));
			}),
			or = () => {
				const Ft = It.current;
				return tt && tt !== "button" && !(Ft.tagName === "A" && Ft.href);
			},
			yr = reactExports.useRef(!1),
			vr = useEventCallback((Ft) => {
				(ot &&
					!yr.current &&
					Gt &&
					Ct.current &&
					Ft.key === " " &&
					((yr.current = !0),
					Ct.current.stop(Ft, () => {
						Ct.current.start(Ft);
					})),
					Ft.target === Ft.currentTarget && or() && Ft.key === " " && Ft.preventDefault(),
					ut && ut(Ft),
					Ft.target === Ft.currentTarget &&
						or() &&
						Ft.key === "Enter" &&
						!rt &&
						(Ft.preventDefault(), dt && dt(Ft)));
			}),
			fr = useEventCallback((Ft) => {
				(ot &&
					Ft.key === " " &&
					Ct.current &&
					Gt &&
					!Ft.defaultPrevented &&
					((yr.current = !1),
					Ct.current.stop(Ft, () => {
						Ct.current.pulsate(Ft);
					})),
					ht && ht(Ft),
					dt &&
						Ft.target === Ft.currentTarget &&
						or() &&
						Ft.key === " " &&
						!Ft.defaultPrevented &&
						dt(Ft));
			});
		let ir = tt;
		ir === "button" && (jt.href || jt.to) && (ir = st);
		const pr = {};
		ir === "button"
			? ((pr.type = $t === void 0 ? "button" : $t), (pr.disabled = rt))
			: (!jt.href && !jt.to && (pr.role = "button"), rt && (pr["aria-disabled"] = rt));
		const rr = useForkRef(a, Xt, It),
			Er = _extends$9({}, s, {
				centerRipple: j,
				component: tt,
				disabled: rt,
				disableRipple: nt,
				disableTouchRipple: it,
				focusRipple: ot,
				tabIndex: Pt,
				focusVisible: Gt,
			}),
			$r = useUtilityClasses$7(Er);
		return jsxRuntimeExports.jsxs(
			ButtonBaseRoot,
			_extends$9(
				{
					as: ir,
					className: clsx($r.root, et),
					ownerState: Er,
					onBlur: Ir,
					onClick: dt,
					onContextMenu: Rr,
					onFocus: Ar,
					onKeyDown: vr,
					onKeyUp: fr,
					onMouseDown: dr,
					onMouseLeave: Pr,
					onMouseUp: nr,
					onDragLeave: _r,
					onTouchEnd: Sr,
					onTouchMove: Or,
					onTouchStart: Mr,
					ref: rr,
					tabIndex: rt ? -1 : Pt,
					type: $t,
				},
				pr,
				jt,
				{
					children: [
						_e,
						kr
							? jsxRuntimeExports.jsx(TouchRipple$1, _extends$9({ ref: St, center: j }, Dt))
							: null,
					],
				}
			)
		);
	}),
	ButtonBase$1 = ButtonBase;
function getAlertUtilityClass(o) {
	return generateUtilityClass("MuiAlert", o);
}
const alertClasses = generateUtilityClasses("MuiAlert", [
		"root",
		"action",
		"icon",
		"message",
		"filled",
		"filledSuccess",
		"filledInfo",
		"filledWarning",
		"filledError",
		"outlined",
		"outlinedSuccess",
		"outlinedInfo",
		"outlinedWarning",
		"outlinedError",
		"standard",
		"standardSuccess",
		"standardInfo",
		"standardWarning",
		"standardError",
	]),
	alertClasses$1 = alertClasses;
function getIconButtonUtilityClass(o) {
	return generateUtilityClass("MuiIconButton", o);
}
const iconButtonClasses = generateUtilityClasses("MuiIconButton", [
		"root",
		"disabled",
		"colorInherit",
		"colorPrimary",
		"colorSecondary",
		"colorError",
		"colorInfo",
		"colorSuccess",
		"colorWarning",
		"edgeStart",
		"edgeEnd",
		"sizeSmall",
		"sizeMedium",
		"sizeLarge",
	]),
	iconButtonClasses$1 = iconButtonClasses,
	_excluded$8 = [
		"edge",
		"children",
		"className",
		"color",
		"disabled",
		"disableFocusRipple",
		"size",
	],
	useUtilityClasses$6 = (o) => {
		const { classes: i, disabled: a, color: s, edge: $, size: j } = o,
			_e = {
				root: [
					"root",
					a && "disabled",
					s !== "default" && `color${capitalize(s)}`,
					$ && `edge${capitalize($)}`,
					`size${capitalize(j)}`,
				],
			};
		return composeClasses(_e, getIconButtonUtilityClass, i);
	},
	IconButtonRoot = styled$1(ButtonBase$1, {
		name: "MuiIconButton",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				a.color !== "default" && i[`color${capitalize(a.color)}`],
				a.edge && i[`edge${capitalize(a.edge)}`],
				i[`size${capitalize(a.size)}`],
			];
		},
	})(
		({ theme: o, ownerState: i }) =>
			_extends$9(
				{
					textAlign: "center",
					flex: "0 0 auto",
					fontSize: o.typography.pxToRem(24),
					padding: 8,
					borderRadius: "50%",
					overflow: "visible",
					color: (o.vars || o).palette.action.active,
					transition: o.transitions.create("background-color", {
						duration: o.transitions.duration.shortest,
					}),
				},
				!i.disableRipple && {
					"&:hover": {
						backgroundColor: o.vars
							? `rgba(${o.vars.palette.action.activeChannel} / ${o.vars.palette.action.hoverOpacity})`
							: alpha(o.palette.action.active, o.palette.action.hoverOpacity),
						"@media (hover: none)": { backgroundColor: "transparent" },
					},
				},
				i.edge === "start" && { marginLeft: i.size === "small" ? -3 : -12 },
				i.edge === "end" && { marginRight: i.size === "small" ? -3 : -12 }
			),
		({ theme: o, ownerState: i }) => {
			var a;
			const s = (a = (o.vars || o).palette) == null ? void 0 : a[i.color];
			return _extends$9(
				{},
				i.color === "inherit" && { color: "inherit" },
				i.color !== "inherit" &&
					i.color !== "default" &&
					_extends$9(
						{ color: s == null ? void 0 : s.main },
						!i.disableRipple && {
							"&:hover": _extends$9(
								{},
								s && {
									backgroundColor: o.vars
										? `rgba(${s.mainChannel} / ${o.vars.palette.action.hoverOpacity})`
										: alpha(s.main, o.palette.action.hoverOpacity),
								},
								{ "@media (hover: none)": { backgroundColor: "transparent" } }
							),
						}
					),
				i.size === "small" && { padding: 5, fontSize: o.typography.pxToRem(18) },
				i.size === "large" && { padding: 12, fontSize: o.typography.pxToRem(28) },
				{
					[`&.${iconButtonClasses$1.disabled}`]: {
						backgroundColor: "transparent",
						color: (o.vars || o).palette.action.disabled,
					},
				}
			);
		}
	),
	IconButton = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiIconButton" }),
			{
				edge: $ = !1,
				children: j,
				className: _e,
				color: et = "default",
				disabled: tt = !1,
				disableFocusRipple: rt = !1,
				size: nt = "medium",
			} = s,
			it = _objectWithoutPropertiesLoose(s, _excluded$8),
			ot = _extends$9({}, s, {
				edge: $,
				color: et,
				disabled: tt,
				disableFocusRipple: rt,
				size: nt,
			}),
			st = useUtilityClasses$6(ot);
		return jsxRuntimeExports.jsx(
			IconButtonRoot,
			_extends$9(
				{
					className: clsx(st.root, _e),
					centerRipple: !0,
					focusRipple: !rt,
					disabled: tt,
					ref: a,
					ownerState: ot,
				},
				it,
				{ children: j }
			)
		);
	}),
	IconButton$1 = IconButton,
	SuccessOutlinedIcon = createSvgIcon$1(
		jsxRuntimeExports.jsx("path", {
			d: "M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z",
		}),
		"SuccessOutlined"
	),
	ReportProblemOutlinedIcon = createSvgIcon$1(
		jsxRuntimeExports.jsx("path", {
			d: "M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z",
		}),
		"ReportProblemOutlined"
	),
	ErrorOutlineIcon = createSvgIcon$1(
		jsxRuntimeExports.jsx("path", {
			d: "M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
		}),
		"ErrorOutline"
	),
	InfoOutlinedIcon = createSvgIcon$1(
		jsxRuntimeExports.jsx("path", {
			d: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z",
		}),
		"InfoOutlined"
	),
	ClearIcon = createSvgIcon$1(
		jsxRuntimeExports.jsx("path", {
			d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
		}),
		"Close"
	),
	_excluded$7 = [
		"action",
		"children",
		"className",
		"closeText",
		"color",
		"components",
		"componentsProps",
		"icon",
		"iconMapping",
		"onClose",
		"role",
		"severity",
		"slotProps",
		"slots",
		"variant",
	],
	useUtilityClasses$5 = (o) => {
		const { variant: i, color: a, severity: s, classes: $ } = o,
			j = {
				root: ["root", `${i}${capitalize(a || s)}`, `${i}`],
				icon: ["icon"],
				message: ["message"],
				action: ["action"],
			};
		return composeClasses(j, getAlertUtilityClass, $);
	},
	AlertRoot = styled$1(Paper$1, {
		name: "MuiAlert",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [i.root, i[a.variant], i[`${a.variant}${capitalize(a.color || a.severity)}`]];
		},
	})(({ theme: o, ownerState: i }) => {
		const a = o.palette.mode === "light" ? darken : lighten,
			s = o.palette.mode === "light" ? lighten : darken,
			$ = i.color || i.severity;
		return _extends$9(
			{},
			o.typography.body2,
			{ backgroundColor: "transparent", display: "flex", padding: "6px 16px" },
			$ &&
				i.variant === "standard" && {
					color: o.vars ? o.vars.palette.Alert[`${$}Color`] : a(o.palette[$].light, 0.6),
					backgroundColor: o.vars
						? o.vars.palette.Alert[`${$}StandardBg`]
						: s(o.palette[$].light, 0.9),
					[`& .${alertClasses$1.icon}`]: o.vars
						? { color: o.vars.palette.Alert[`${$}IconColor`] }
						: { color: o.palette[$].main },
				},
			$ &&
				i.variant === "outlined" && {
					color: o.vars ? o.vars.palette.Alert[`${$}Color`] : a(o.palette[$].light, 0.6),
					border: `1px solid ${(o.vars || o).palette[$].light}`,
					[`& .${alertClasses$1.icon}`]: o.vars
						? { color: o.vars.palette.Alert[`${$}IconColor`] }
						: { color: o.palette[$].main },
				},
			$ &&
				i.variant === "filled" &&
				_extends$9(
					{ fontWeight: o.typography.fontWeightMedium },
					o.vars
						? {
								color: o.vars.palette.Alert[`${$}FilledColor`],
								backgroundColor: o.vars.palette.Alert[`${$}FilledBg`],
							}
						: {
								backgroundColor: o.palette.mode === "dark" ? o.palette[$].dark : o.palette[$].main,
								color: o.palette.getContrastText(o.palette[$].main),
							}
				)
		);
	}),
	AlertIcon = styled$1("div", {
		name: "MuiAlert",
		slot: "Icon",
		overridesResolver: (o, i) => i.icon,
	})({ marginRight: 12, padding: "7px 0", display: "flex", fontSize: 22, opacity: 0.9 }),
	AlertMessage = styled$1("div", {
		name: "MuiAlert",
		slot: "Message",
		overridesResolver: (o, i) => i.message,
	})({ padding: "8px 0", minWidth: 0, overflow: "auto" }),
	AlertAction = styled$1("div", {
		name: "MuiAlert",
		slot: "Action",
		overridesResolver: (o, i) => i.action,
	})({
		display: "flex",
		alignItems: "flex-start",
		padding: "4px 0 0 16px",
		marginLeft: "auto",
		marginRight: -8,
	}),
	defaultIconMapping = {
		success: jsxRuntimeExports.jsx(SuccessOutlinedIcon, { fontSize: "inherit" }),
		warning: jsxRuntimeExports.jsx(ReportProblemOutlinedIcon, { fontSize: "inherit" }),
		error: jsxRuntimeExports.jsx(ErrorOutlineIcon, { fontSize: "inherit" }),
		info: jsxRuntimeExports.jsx(InfoOutlinedIcon, { fontSize: "inherit" }),
	},
	Alert = reactExports.forwardRef(function (i, a) {
		var s, $, j, _e, et, tt;
		const rt = useThemeProps({ props: i, name: "MuiAlert" }),
			{
				action: nt,
				children: it,
				className: ot,
				closeText: st = "Close",
				color: lt,
				components: dt = {},
				componentsProps: pt = {},
				icon: ct,
				iconMapping: at = defaultIconMapping,
				onClose: ft,
				role: ut = "alert",
				severity: ht = "success",
				slotProps: yt = {},
				slots: mt = {},
				variant: Et = "standard",
			} = rt,
			Rt = _objectWithoutPropertiesLoose(rt, _excluded$7),
			vt = _extends$9({}, rt, { color: lt, severity: ht, variant: Et }),
			Tt = useUtilityClasses$5(vt),
			Pt = (s = ($ = mt.closeButton) != null ? $ : dt.CloseButton) != null ? s : IconButton$1,
			Dt = (j = (_e = mt.closeIcon) != null ? _e : dt.CloseIcon) != null ? j : ClearIcon,
			Nt = (et = yt.closeButton) != null ? et : pt.closeButton,
			$t = (tt = yt.closeIcon) != null ? tt : pt.closeIcon;
		return jsxRuntimeExports.jsxs(
			AlertRoot,
			_extends$9(
				{ role: ut, elevation: 0, ownerState: vt, className: clsx(Tt.root, ot), ref: a },
				Rt,
				{
					children: [
						ct !== !1
							? jsxRuntimeExports.jsx(AlertIcon, {
									ownerState: vt,
									className: Tt.icon,
									children: ct || at[ht] || defaultIconMapping[ht],
								})
							: null,
						jsxRuntimeExports.jsx(AlertMessage, {
							ownerState: vt,
							className: Tt.message,
							children: it,
						}),
						nt != null
							? jsxRuntimeExports.jsx(AlertAction, {
									ownerState: vt,
									className: Tt.action,
									children: nt,
								})
							: null,
						nt == null && ft
							? jsxRuntimeExports.jsx(AlertAction, {
									ownerState: vt,
									className: Tt.action,
									children: jsxRuntimeExports.jsx(
										Pt,
										_extends$9(
											{ size: "small", "aria-label": st, title: st, color: "inherit", onClick: ft },
											Nt,
											{ children: jsxRuntimeExports.jsx(Dt, _extends$9({ fontSize: "small" }, $t)) }
										)
									),
								})
							: null,
					],
				}
			)
		);
	}),
	Alert$1 = Alert;
function getTypographyUtilityClass(o) {
	return generateUtilityClass("MuiTypography", o);
}
generateUtilityClasses("MuiTypography", [
	"root",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"subtitle1",
	"subtitle2",
	"body1",
	"body2",
	"inherit",
	"button",
	"caption",
	"overline",
	"alignLeft",
	"alignRight",
	"alignCenter",
	"alignJustify",
	"noWrap",
	"gutterBottom",
	"paragraph",
]);
const _excluded$6 = [
		"align",
		"className",
		"component",
		"gutterBottom",
		"noWrap",
		"paragraph",
		"variant",
		"variantMapping",
	],
	useUtilityClasses$4 = (o) => {
		const { align: i, gutterBottom: a, noWrap: s, paragraph: $, variant: j, classes: _e } = o,
			et = {
				root: [
					"root",
					j,
					o.align !== "inherit" && `align${capitalize(i)}`,
					a && "gutterBottom",
					s && "noWrap",
					$ && "paragraph",
				],
			};
		return composeClasses(et, getTypographyUtilityClass, _e);
	},
	TypographyRoot = styled$1("span", {
		name: "MuiTypography",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				a.variant && i[a.variant],
				a.align !== "inherit" && i[`align${capitalize(a.align)}`],
				a.noWrap && i.noWrap,
				a.gutterBottom && i.gutterBottom,
				a.paragraph && i.paragraph,
			];
		},
	})(({ theme: o, ownerState: i }) =>
		_extends$9(
			{ margin: 0 },
			i.variant === "inherit" && { font: "inherit" },
			i.variant !== "inherit" && o.typography[i.variant],
			i.align !== "inherit" && { textAlign: i.align },
			i.noWrap && { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
			i.gutterBottom && { marginBottom: "0.35em" },
			i.paragraph && { marginBottom: 16 }
		)
	),
	defaultVariantMapping = {
		h1: "h1",
		h2: "h2",
		h3: "h3",
		h4: "h4",
		h5: "h5",
		h6: "h6",
		subtitle1: "h6",
		subtitle2: "h6",
		body1: "p",
		body2: "p",
		inherit: "p",
	},
	colorTransformations = {
		primary: "primary.main",
		textPrimary: "text.primary",
		secondary: "secondary.main",
		textSecondary: "text.secondary",
		error: "error.main",
	},
	transformDeprecatedColors = (o) => colorTransformations[o] || o,
	Typography = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiTypography" }),
			$ = transformDeprecatedColors(s.color),
			j = extendSxProp(_extends$9({}, s, { color: $ })),
			{
				align: _e = "inherit",
				className: et,
				component: tt,
				gutterBottom: rt = !1,
				noWrap: nt = !1,
				paragraph: it = !1,
				variant: ot = "body1",
				variantMapping: st = defaultVariantMapping,
			} = j,
			lt = _objectWithoutPropertiesLoose(j, _excluded$6),
			dt = _extends$9({}, j, {
				align: _e,
				color: $,
				className: et,
				component: tt,
				gutterBottom: rt,
				noWrap: nt,
				paragraph: it,
				variant: ot,
				variantMapping: st,
			}),
			pt = tt || (it ? "p" : st[ot] || defaultVariantMapping[ot]) || "span",
			ct = useUtilityClasses$4(dt);
		return jsxRuntimeExports.jsx(
			TypographyRoot,
			_extends$9({ as: pt, ref: a, ownerState: dt, className: clsx(ct.root, et) }, lt)
		);
	}),
	Typography$1 = Typography;
function GlobalStyles(o) {
	return jsxRuntimeExports.jsx(
		GlobalStyles$1,
		_extends$9({}, o, { defaultTheme: defaultTheme$2, themeId: THEME_ID })
	);
}
const defaultTheme = createTheme(),
	Box = createBox({
		themeId: THEME_ID,
		defaultTheme,
		defaultClassName: "MuiBox-root",
		generateClassName: ClassNameGenerator$1.generate,
	}),
	Box$1 = Box;
function getButtonUtilityClass(o) {
	return generateUtilityClass("MuiButton", o);
}
const buttonClasses = generateUtilityClasses("MuiButton", [
		"root",
		"text",
		"textInherit",
		"textPrimary",
		"textSecondary",
		"textSuccess",
		"textError",
		"textInfo",
		"textWarning",
		"outlined",
		"outlinedInherit",
		"outlinedPrimary",
		"outlinedSecondary",
		"outlinedSuccess",
		"outlinedError",
		"outlinedInfo",
		"outlinedWarning",
		"contained",
		"containedInherit",
		"containedPrimary",
		"containedSecondary",
		"containedSuccess",
		"containedError",
		"containedInfo",
		"containedWarning",
		"disableElevation",
		"focusVisible",
		"disabled",
		"colorInherit",
		"textSizeSmall",
		"textSizeMedium",
		"textSizeLarge",
		"outlinedSizeSmall",
		"outlinedSizeMedium",
		"outlinedSizeLarge",
		"containedSizeSmall",
		"containedSizeMedium",
		"containedSizeLarge",
		"sizeMedium",
		"sizeSmall",
		"sizeLarge",
		"fullWidth",
		"startIcon",
		"endIcon",
		"iconSizeSmall",
		"iconSizeMedium",
		"iconSizeLarge",
	]),
	buttonClasses$1 = buttonClasses,
	ButtonGroupContext = reactExports.createContext({}),
	ButtonGroupContext$1 = ButtonGroupContext,
	ButtonGroupButtonContext = reactExports.createContext(void 0),
	ButtonGroupButtonContext$1 = ButtonGroupButtonContext,
	_excluded$5 = [
		"children",
		"color",
		"component",
		"className",
		"disabled",
		"disableElevation",
		"disableFocusRipple",
		"endIcon",
		"focusVisibleClassName",
		"fullWidth",
		"size",
		"startIcon",
		"type",
		"variant",
	],
	useUtilityClasses$3 = (o) => {
		const { color: i, disableElevation: a, fullWidth: s, size: $, variant: j, classes: _e } = o,
			et = {
				root: [
					"root",
					j,
					`${j}${capitalize(i)}`,
					`size${capitalize($)}`,
					`${j}Size${capitalize($)}`,
					i === "inherit" && "colorInherit",
					a && "disableElevation",
					s && "fullWidth",
				],
				label: ["label"],
				startIcon: ["startIcon", `iconSize${capitalize($)}`],
				endIcon: ["endIcon", `iconSize${capitalize($)}`],
			},
			tt = composeClasses(et, getButtonUtilityClass, _e);
		return _extends$9({}, _e, tt);
	},
	commonIconStyles = (o) =>
		_extends$9(
			{},
			o.size === "small" && { "& > *:nth-of-type(1)": { fontSize: 18 } },
			o.size === "medium" && { "& > *:nth-of-type(1)": { fontSize: 20 } },
			o.size === "large" && { "& > *:nth-of-type(1)": { fontSize: 22 } }
		),
	ButtonRoot = styled$1(ButtonBase$1, {
		shouldForwardProp: (o) => rootShouldForwardProp(o) || o === "classes",
		name: "MuiButton",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				i[a.variant],
				i[`${a.variant}${capitalize(a.color)}`],
				i[`size${capitalize(a.size)}`],
				i[`${a.variant}Size${capitalize(a.size)}`],
				a.color === "inherit" && i.colorInherit,
				a.disableElevation && i.disableElevation,
				a.fullWidth && i.fullWidth,
			];
		},
	})(
		({ theme: o, ownerState: i }) => {
			var a, s;
			const $ = o.palette.mode === "light" ? o.palette.grey[300] : o.palette.grey[800],
				j = o.palette.mode === "light" ? o.palette.grey.A100 : o.palette.grey[700];
			return _extends$9(
				{},
				o.typography.button,
				{
					minWidth: 64,
					padding: "6px 16px",
					borderRadius: (o.vars || o).shape.borderRadius,
					transition: o.transitions.create(
						["background-color", "box-shadow", "border-color", "color"],
						{ duration: o.transitions.duration.short }
					),
					"&:hover": _extends$9(
						{
							textDecoration: "none",
							backgroundColor: o.vars
								? `rgba(${o.vars.palette.text.primaryChannel} / ${o.vars.palette.action.hoverOpacity})`
								: alpha(o.palette.text.primary, o.palette.action.hoverOpacity),
							"@media (hover: none)": { backgroundColor: "transparent" },
						},
						i.variant === "text" &&
							i.color !== "inherit" && {
								backgroundColor: o.vars
									? `rgba(${o.vars.palette[i.color].mainChannel} / ${o.vars.palette.action.hoverOpacity})`
									: alpha(o.palette[i.color].main, o.palette.action.hoverOpacity),
								"@media (hover: none)": { backgroundColor: "transparent" },
							},
						i.variant === "outlined" &&
							i.color !== "inherit" && {
								border: `1px solid ${(o.vars || o).palette[i.color].main}`,
								backgroundColor: o.vars
									? `rgba(${o.vars.palette[i.color].mainChannel} / ${o.vars.palette.action.hoverOpacity})`
									: alpha(o.palette[i.color].main, o.palette.action.hoverOpacity),
								"@media (hover: none)": { backgroundColor: "transparent" },
							},
						i.variant === "contained" && {
							backgroundColor: o.vars ? o.vars.palette.Button.inheritContainedHoverBg : j,
							boxShadow: (o.vars || o).shadows[4],
							"@media (hover: none)": {
								boxShadow: (o.vars || o).shadows[2],
								backgroundColor: (o.vars || o).palette.grey[300],
							},
						},
						i.variant === "contained" &&
							i.color !== "inherit" && {
								backgroundColor: (o.vars || o).palette[i.color].dark,
								"@media (hover: none)": { backgroundColor: (o.vars || o).palette[i.color].main },
							}
					),
					"&:active": _extends$9(
						{},
						i.variant === "contained" && { boxShadow: (o.vars || o).shadows[8] }
					),
					[`&.${buttonClasses$1.focusVisible}`]: _extends$9(
						{},
						i.variant === "contained" && { boxShadow: (o.vars || o).shadows[6] }
					),
					[`&.${buttonClasses$1.disabled}`]: _extends$9(
						{ color: (o.vars || o).palette.action.disabled },
						i.variant === "outlined" && {
							border: `1px solid ${(o.vars || o).palette.action.disabledBackground}`,
						},
						i.variant === "contained" && {
							color: (o.vars || o).palette.action.disabled,
							boxShadow: (o.vars || o).shadows[0],
							backgroundColor: (o.vars || o).palette.action.disabledBackground,
						}
					),
				},
				i.variant === "text" && { padding: "6px 8px" },
				i.variant === "text" &&
					i.color !== "inherit" && { color: (o.vars || o).palette[i.color].main },
				i.variant === "outlined" && { padding: "5px 15px", border: "1px solid currentColor" },
				i.variant === "outlined" &&
					i.color !== "inherit" && {
						color: (o.vars || o).palette[i.color].main,
						border: o.vars
							? `1px solid rgba(${o.vars.palette[i.color].mainChannel} / 0.5)`
							: `1px solid ${alpha(o.palette[i.color].main, 0.5)}`,
					},
				i.variant === "contained" && {
					color: o.vars
						? o.vars.palette.text.primary
						: (a = (s = o.palette).getContrastText) == null
							? void 0
							: a.call(s, o.palette.grey[300]),
					backgroundColor: o.vars ? o.vars.palette.Button.inheritContainedBg : $,
					boxShadow: (o.vars || o).shadows[2],
				},
				i.variant === "contained" &&
					i.color !== "inherit" && {
						color: (o.vars || o).palette[i.color].contrastText,
						backgroundColor: (o.vars || o).palette[i.color].main,
					},
				i.color === "inherit" && { color: "inherit", borderColor: "currentColor" },
				i.size === "small" &&
					i.variant === "text" && { padding: "4px 5px", fontSize: o.typography.pxToRem(13) },
				i.size === "large" &&
					i.variant === "text" && { padding: "8px 11px", fontSize: o.typography.pxToRem(15) },
				i.size === "small" &&
					i.variant === "outlined" && { padding: "3px 9px", fontSize: o.typography.pxToRem(13) },
				i.size === "large" &&
					i.variant === "outlined" && { padding: "7px 21px", fontSize: o.typography.pxToRem(15) },
				i.size === "small" &&
					i.variant === "contained" && { padding: "4px 10px", fontSize: o.typography.pxToRem(13) },
				i.size === "large" &&
					i.variant === "contained" && { padding: "8px 22px", fontSize: o.typography.pxToRem(15) },
				i.fullWidth && { width: "100%" }
			);
		},
		({ ownerState: o }) =>
			o.disableElevation && {
				boxShadow: "none",
				"&:hover": { boxShadow: "none" },
				[`&.${buttonClasses$1.focusVisible}`]: { boxShadow: "none" },
				"&:active": { boxShadow: "none" },
				[`&.${buttonClasses$1.disabled}`]: { boxShadow: "none" },
			}
	),
	ButtonStartIcon = styled$1("span", {
		name: "MuiButton",
		slot: "StartIcon",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [i.startIcon, i[`iconSize${capitalize(a.size)}`]];
		},
	})(({ ownerState: o }) =>
		_extends$9(
			{ display: "inherit", marginRight: 8, marginLeft: -4 },
			o.size === "small" && { marginLeft: -2 },
			commonIconStyles(o)
		)
	),
	ButtonEndIcon = styled$1("span", {
		name: "MuiButton",
		slot: "EndIcon",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [i.endIcon, i[`iconSize${capitalize(a.size)}`]];
		},
	})(({ ownerState: o }) =>
		_extends$9(
			{ display: "inherit", marginRight: -4, marginLeft: 8 },
			o.size === "small" && { marginRight: -2 },
			commonIconStyles(o)
		)
	),
	Button = reactExports.forwardRef(function (i, a) {
		const s = reactExports.useContext(ButtonGroupContext$1),
			$ = reactExports.useContext(ButtonGroupButtonContext$1),
			j = resolveProps(s, i),
			_e = useThemeProps({ props: j, name: "MuiButton" }),
			{
				children: et,
				color: tt = "primary",
				component: rt = "button",
				className: nt,
				disabled: it = !1,
				disableElevation: ot = !1,
				disableFocusRipple: st = !1,
				endIcon: lt,
				focusVisibleClassName: dt,
				fullWidth: pt = !1,
				size: ct = "medium",
				startIcon: at,
				type: ft,
				variant: ut = "text",
			} = _e,
			ht = _objectWithoutPropertiesLoose(_e, _excluded$5),
			yt = _extends$9({}, _e, {
				color: tt,
				component: rt,
				disabled: it,
				disableElevation: ot,
				disableFocusRipple: st,
				fullWidth: pt,
				size: ct,
				type: ft,
				variant: ut,
			}),
			mt = useUtilityClasses$3(yt),
			Et =
				at &&
				jsxRuntimeExports.jsx(ButtonStartIcon, {
					className: mt.startIcon,
					ownerState: yt,
					children: at,
				}),
			Rt =
				lt &&
				jsxRuntimeExports.jsx(ButtonEndIcon, {
					className: mt.endIcon,
					ownerState: yt,
					children: lt,
				}),
			vt = $ || "";
		return jsxRuntimeExports.jsxs(
			ButtonRoot,
			_extends$9(
				{
					ownerState: yt,
					className: clsx(s.className, mt.root, nt, vt),
					component: rt,
					disabled: it,
					focusRipple: !st,
					focusVisibleClassName: clsx(mt.focusVisible, dt),
					ref: a,
					type: ft,
				},
				ht,
				{ classes: mt, children: [Et, et, Rt] }
			)
		);
	}),
	Button$1 = Button;
function getCircularProgressUtilityClass(o) {
	return generateUtilityClass("MuiCircularProgress", o);
}
generateUtilityClasses("MuiCircularProgress", [
	"root",
	"determinate",
	"indeterminate",
	"colorPrimary",
	"colorSecondary",
	"svg",
	"circle",
	"circleDeterminate",
	"circleIndeterminate",
	"circleDisableShrink",
]);
const _excluded$4 = [
	"className",
	"color",
	"disableShrink",
	"size",
	"style",
	"thickness",
	"value",
	"variant",
];
let _ = (o) => o,
	_t,
	_t2,
	_t3,
	_t4;
const SIZE = 44,
	circularRotateKeyframe = keyframes(
		_t ||
			(_t = _`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)
	),
	circularDashKeyframe = keyframes(
		_t2 ||
			(_t2 = _`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)
	),
	useUtilityClasses$2 = (o) => {
		const { classes: i, variant: a, color: s, disableShrink: $ } = o,
			j = {
				root: ["root", a, `color${capitalize(s)}`],
				svg: ["svg"],
				circle: ["circle", `circle${capitalize(a)}`, $ && "circleDisableShrink"],
			};
		return composeClasses(j, getCircularProgressUtilityClass, i);
	},
	CircularProgressRoot = styled$1("span", {
		name: "MuiCircularProgress",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [i.root, i[a.variant], i[`color${capitalize(a.color)}`]];
		},
	})(
		({ ownerState: o, theme: i }) =>
			_extends$9(
				{ display: "inline-block" },
				o.variant === "determinate" && { transition: i.transitions.create("transform") },
				o.color !== "inherit" && { color: (i.vars || i).palette[o.color].main }
			),
		({ ownerState: o }) =>
			o.variant === "indeterminate" &&
			css(
				_t3 ||
					(_t3 = _`
      animation: ${0} 1.4s linear infinite;
    `),
				circularRotateKeyframe
			)
	),
	CircularProgressSVG = styled$1("svg", {
		name: "MuiCircularProgress",
		slot: "Svg",
		overridesResolver: (o, i) => i.svg,
	})({ display: "block" }),
	CircularProgressCircle = styled$1("circle", {
		name: "MuiCircularProgress",
		slot: "Circle",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.circle,
				i[`circle${capitalize(a.variant)}`],
				a.disableShrink && i.circleDisableShrink,
			];
		},
	})(
		({ ownerState: o, theme: i }) =>
			_extends$9(
				{ stroke: "currentColor" },
				o.variant === "determinate" && { transition: i.transitions.create("stroke-dashoffset") },
				o.variant === "indeterminate" && { strokeDasharray: "80px, 200px", strokeDashoffset: 0 }
			),
		({ ownerState: o }) =>
			o.variant === "indeterminate" &&
			!o.disableShrink &&
			css(
				_t4 ||
					(_t4 = _`
      animation: ${0} 1.4s ease-in-out infinite;
    `),
				circularDashKeyframe
			)
	),
	CircularProgress = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiCircularProgress" }),
			{
				className: $,
				color: j = "primary",
				disableShrink: _e = !1,
				size: et = 40,
				style: tt,
				thickness: rt = 3.6,
				value: nt = 0,
				variant: it = "indeterminate",
			} = s,
			ot = _objectWithoutPropertiesLoose(s, _excluded$4),
			st = _extends$9({}, s, {
				color: j,
				disableShrink: _e,
				size: et,
				thickness: rt,
				value: nt,
				variant: it,
			}),
			lt = useUtilityClasses$2(st),
			dt = {},
			pt = {},
			ct = {};
		if (it === "determinate") {
			const at = 2 * Math.PI * ((SIZE - rt) / 2);
			((dt.strokeDasharray = at.toFixed(3)),
				(ct["aria-valuenow"] = Math.round(nt)),
				(dt.strokeDashoffset = `${(((100 - nt) / 100) * at).toFixed(3)}px`),
				(pt.transform = "rotate(-90deg)"));
		}
		return jsxRuntimeExports.jsx(
			CircularProgressRoot,
			_extends$9(
				{
					className: clsx(lt.root, $),
					style: _extends$9({ width: et, height: et }, pt, tt),
					ownerState: st,
					ref: a,
					role: "progressbar",
				},
				ct,
				ot,
				{
					children: jsxRuntimeExports.jsx(CircularProgressSVG, {
						className: lt.svg,
						ownerState: st,
						viewBox: `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`,
						children: jsxRuntimeExports.jsx(CircularProgressCircle, {
							className: lt.circle,
							style: dt,
							ownerState: st,
							cx: SIZE,
							cy: SIZE,
							r: (SIZE - rt) / 2,
							fill: "none",
							strokeWidth: rt,
						}),
					}),
				}
			)
		);
	}),
	CircularProgress$1 = CircularProgress,
	Container = createContainer({
		createStyledComponent: styled$1("div", {
			name: "MuiContainer",
			slot: "Root",
			overridesResolver: (o, i) => {
				const { ownerState: a } = o;
				return [
					i.root,
					i[`maxWidth${capitalize(String(a.maxWidth))}`],
					a.fixed && i.fixed,
					a.disableGutters && i.disableGutters,
				];
			},
		}),
		useThemeProps: (o) => useThemeProps({ props: o, name: "MuiContainer" }),
	}),
	Container$1 = Container,
	html = (o, i) =>
		_extends$9(
			{
				WebkitFontSmoothing: "antialiased",
				MozOsxFontSmoothing: "grayscale",
				boxSizing: "border-box",
				WebkitTextSizeAdjust: "100%",
			},
			i && !o.vars && { colorScheme: o.palette.mode }
		),
	body = (o) =>
		_extends$9({ color: (o.vars || o).palette.text.primary }, o.typography.body1, {
			backgroundColor: (o.vars || o).palette.background.default,
			"@media print": { backgroundColor: (o.vars || o).palette.common.white },
		}),
	styles$1 = (o, i = !1) => {
		var a;
		const s = {};
		i &&
			o.colorSchemes &&
			Object.entries(o.colorSchemes).forEach(([_e, et]) => {
				var tt;
				s[o.getColorSchemeSelector(_e).replace(/\s*&/, "")] = {
					colorScheme: (tt = et.palette) == null ? void 0 : tt.mode,
				};
			});
		let $ = _extends$9(
			{
				html: html(o, i),
				"*, *::before, *::after": { boxSizing: "inherit" },
				"strong, b": { fontWeight: o.typography.fontWeightBold },
				body: _extends$9({ margin: 0 }, body(o), {
					"&::backdrop": { backgroundColor: (o.vars || o).palette.background.default },
				}),
			},
			s
		);
		const j =
			(a = o.components) == null || (a = a.MuiCssBaseline) == null ? void 0 : a.styleOverrides;
		return (j && ($ = [$, j]), $);
	};
function CssBaseline(o) {
	const i = useThemeProps({ props: o, name: "MuiCssBaseline" }),
		{ children: a, enableColorScheme: s = !1 } = i;
	return jsxRuntimeExports.jsxs(reactExports.Fragment, {
		children: [jsxRuntimeExports.jsx(GlobalStyles, { styles: ($) => styles$1($, s) }), a],
	});
}
function getDividerUtilityClass(o) {
	return generateUtilityClass("MuiDivider", o);
}
generateUtilityClasses("MuiDivider", [
	"root",
	"absolute",
	"fullWidth",
	"inset",
	"middle",
	"flexItem",
	"light",
	"vertical",
	"withChildren",
	"withChildrenVertical",
	"textAlignRight",
	"textAlignLeft",
	"wrapper",
	"wrapperVertical",
]);
const _excluded$3 = [
		"absolute",
		"children",
		"className",
		"component",
		"flexItem",
		"light",
		"orientation",
		"role",
		"textAlign",
		"variant",
	],
	useUtilityClasses$1 = (o) => {
		const {
			absolute: i,
			children: a,
			classes: s,
			flexItem: $,
			light: j,
			orientation: _e,
			textAlign: et,
			variant: tt,
		} = o;
		return composeClasses(
			{
				root: [
					"root",
					i && "absolute",
					tt,
					j && "light",
					_e === "vertical" && "vertical",
					$ && "flexItem",
					a && "withChildren",
					a && _e === "vertical" && "withChildrenVertical",
					et === "right" && _e !== "vertical" && "textAlignRight",
					et === "left" && _e !== "vertical" && "textAlignLeft",
				],
				wrapper: ["wrapper", _e === "vertical" && "wrapperVertical"],
			},
			getDividerUtilityClass,
			s
		);
	},
	DividerRoot = styled$1("div", {
		name: "MuiDivider",
		slot: "Root",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				a.absolute && i.absolute,
				i[a.variant],
				a.light && i.light,
				a.orientation === "vertical" && i.vertical,
				a.flexItem && i.flexItem,
				a.children && i.withChildren,
				a.children && a.orientation === "vertical" && i.withChildrenVertical,
				a.textAlign === "right" && a.orientation !== "vertical" && i.textAlignRight,
				a.textAlign === "left" && a.orientation !== "vertical" && i.textAlignLeft,
			];
		},
	})(
		({ theme: o, ownerState: i }) =>
			_extends$9(
				{
					margin: 0,
					flexShrink: 0,
					borderWidth: 0,
					borderStyle: "solid",
					borderColor: (o.vars || o).palette.divider,
					borderBottomWidth: "thin",
				},
				i.absolute && { position: "absolute", bottom: 0, left: 0, width: "100%" },
				i.light && {
					borderColor: o.vars
						? `rgba(${o.vars.palette.dividerChannel} / 0.08)`
						: alpha(o.palette.divider, 0.08),
				},
				i.variant === "inset" && { marginLeft: 72 },
				i.variant === "middle" &&
					i.orientation === "horizontal" && { marginLeft: o.spacing(2), marginRight: o.spacing(2) },
				i.variant === "middle" &&
					i.orientation === "vertical" && { marginTop: o.spacing(1), marginBottom: o.spacing(1) },
				i.orientation === "vertical" && {
					height: "100%",
					borderBottomWidth: 0,
					borderRightWidth: "thin",
				},
				i.flexItem && { alignSelf: "stretch", height: "auto" }
			),
		({ ownerState: o }) =>
			_extends$9(
				{},
				o.children && {
					display: "flex",
					whiteSpace: "nowrap",
					textAlign: "center",
					border: 0,
					"&::before, &::after": { content: '""', alignSelf: "center" },
				}
			),
		({ theme: o, ownerState: i }) =>
			_extends$9(
				{},
				i.children &&
					i.orientation !== "vertical" && {
						"&::before, &::after": {
							width: "100%",
							borderTop: `thin solid ${(o.vars || o).palette.divider}`,
						},
					}
			),
		({ theme: o, ownerState: i }) =>
			_extends$9(
				{},
				i.children &&
					i.orientation === "vertical" && {
						flexDirection: "column",
						"&::before, &::after": {
							height: "100%",
							borderLeft: `thin solid ${(o.vars || o).palette.divider}`,
						},
					}
			),
		({ ownerState: o }) =>
			_extends$9(
				{},
				o.textAlign === "right" &&
					o.orientation !== "vertical" && {
						"&::before": { width: "90%" },
						"&::after": { width: "10%" },
					},
				o.textAlign === "left" &&
					o.orientation !== "vertical" && {
						"&::before": { width: "10%" },
						"&::after": { width: "90%" },
					}
			)
	),
	DividerWrapper = styled$1("span", {
		name: "MuiDivider",
		slot: "Wrapper",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [i.wrapper, a.orientation === "vertical" && i.wrapperVertical];
		},
	})(({ theme: o, ownerState: i }) =>
		_extends$9(
			{
				display: "inline-block",
				paddingLeft: `calc(${o.spacing(1)} * 1.2)`,
				paddingRight: `calc(${o.spacing(1)} * 1.2)`,
			},
			i.orientation === "vertical" && {
				paddingTop: `calc(${o.spacing(1)} * 1.2)`,
				paddingBottom: `calc(${o.spacing(1)} * 1.2)`,
			}
		)
	),
	Divider = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiDivider" }),
			{
				absolute: $ = !1,
				children: j,
				className: _e,
				component: et = j ? "div" : "hr",
				flexItem: tt = !1,
				light: rt = !1,
				orientation: nt = "horizontal",
				role: it = et !== "hr" ? "separator" : void 0,
				textAlign: ot = "center",
				variant: st = "fullWidth",
			} = s,
			lt = _objectWithoutPropertiesLoose(s, _excluded$3),
			dt = _extends$9({}, s, {
				absolute: $,
				component: et,
				flexItem: tt,
				light: rt,
				orientation: nt,
				role: it,
				textAlign: ot,
				variant: st,
			}),
			pt = useUtilityClasses$1(dt);
		return jsxRuntimeExports.jsx(
			DividerRoot,
			_extends$9({ as: et, className: clsx(pt.root, _e), role: it, ref: a, ownerState: dt }, lt, {
				children: j
					? jsxRuntimeExports.jsx(DividerWrapper, {
							className: pt.wrapper,
							ownerState: dt,
							children: j,
						})
					: null,
			})
		);
	});
Divider.muiSkipListHighlight = !0;
const Divider$1 = Divider;
function getFabUtilityClass(o) {
	return generateUtilityClass("MuiFab", o);
}
const fabClasses = generateUtilityClasses("MuiFab", [
		"root",
		"primary",
		"secondary",
		"extended",
		"circular",
		"focusVisible",
		"disabled",
		"colorInherit",
		"sizeSmall",
		"sizeMedium",
		"sizeLarge",
		"info",
		"error",
		"warning",
		"success",
	]),
	fabClasses$1 = fabClasses,
	_excluded$2 = [
		"children",
		"className",
		"color",
		"component",
		"disabled",
		"disableFocusRipple",
		"focusVisibleClassName",
		"size",
		"variant",
	],
	useUtilityClasses = (o) => {
		const { color: i, variant: a, classes: s, size: $ } = o,
			j = { root: ["root", a, `size${capitalize($)}`, i === "inherit" ? "colorInherit" : i] },
			_e = composeClasses(j, getFabUtilityClass, s);
		return _extends$9({}, s, _e);
	},
	FabRoot = styled$1(ButtonBase$1, {
		name: "MuiFab",
		slot: "Root",
		shouldForwardProp: (o) => rootShouldForwardProp(o) || o === "classes",
		overridesResolver: (o, i) => {
			const { ownerState: a } = o;
			return [
				i.root,
				i[a.variant],
				i[`size${capitalize(a.size)}`],
				a.color === "inherit" && i.colorInherit,
				i[capitalize(a.size)],
				i[a.color],
			];
		},
	})(
		({ theme: o, ownerState: i }) => {
			var a, s;
			return _extends$9(
				{},
				o.typography.button,
				{
					minHeight: 36,
					transition: o.transitions.create(["background-color", "box-shadow", "border-color"], {
						duration: o.transitions.duration.short,
					}),
					borderRadius: "50%",
					padding: 0,
					minWidth: 0,
					width: 56,
					height: 56,
					zIndex: (o.vars || o).zIndex.fab,
					boxShadow: (o.vars || o).shadows[6],
					"&:active": { boxShadow: (o.vars || o).shadows[12] },
					color: o.vars
						? o.vars.palette.text.primary
						: (a = (s = o.palette).getContrastText) == null
							? void 0
							: a.call(s, o.palette.grey[300]),
					backgroundColor: (o.vars || o).palette.grey[300],
					"&:hover": {
						backgroundColor: (o.vars || o).palette.grey.A100,
						"@media (hover: none)": { backgroundColor: (o.vars || o).palette.grey[300] },
						textDecoration: "none",
					},
					[`&.${fabClasses$1.focusVisible}`]: { boxShadow: (o.vars || o).shadows[6] },
				},
				i.size === "small" && { width: 40, height: 40 },
				i.size === "medium" && { width: 48, height: 48 },
				i.variant === "extended" && {
					borderRadius: 48 / 2,
					padding: "0 16px",
					width: "auto",
					minHeight: "auto",
					minWidth: 48,
					height: 48,
				},
				i.variant === "extended" &&
					i.size === "small" && {
						width: "auto",
						padding: "0 8px",
						borderRadius: 34 / 2,
						minWidth: 34,
						height: 34,
					},
				i.variant === "extended" &&
					i.size === "medium" && {
						width: "auto",
						padding: "0 16px",
						borderRadius: 40 / 2,
						minWidth: 40,
						height: 40,
					},
				i.color === "inherit" && { color: "inherit" }
			);
		},
		({ theme: o, ownerState: i }) =>
			_extends$9(
				{},
				i.color !== "inherit" &&
					i.color !== "default" &&
					(o.vars || o).palette[i.color] != null && {
						color: (o.vars || o).palette[i.color].contrastText,
						backgroundColor: (o.vars || o).palette[i.color].main,
						"&:hover": {
							backgroundColor: (o.vars || o).palette[i.color].dark,
							"@media (hover: none)": { backgroundColor: (o.vars || o).palette[i.color].main },
						},
					}
			),
		({ theme: o }) => ({
			[`&.${fabClasses$1.disabled}`]: {
				color: (o.vars || o).palette.action.disabled,
				boxShadow: (o.vars || o).shadows[0],
				backgroundColor: (o.vars || o).palette.action.disabledBackground,
			},
		})
	),
	Fab = reactExports.forwardRef(function (i, a) {
		const s = useThemeProps({ props: i, name: "MuiFab" }),
			{
				children: $,
				className: j,
				color: _e = "default",
				component: et = "button",
				disabled: tt = !1,
				disableFocusRipple: rt = !1,
				focusVisibleClassName: nt,
				size: it = "large",
				variant: ot = "circular",
			} = s,
			st = _objectWithoutPropertiesLoose(s, _excluded$2),
			lt = _extends$9({}, s, {
				color: _e,
				component: et,
				disabled: tt,
				disableFocusRipple: rt,
				size: it,
				variant: ot,
			}),
			dt = useUtilityClasses(lt);
		return jsxRuntimeExports.jsx(
			FabRoot,
			_extends$9(
				{
					className: clsx(dt.root, j),
					component: et,
					disabled: tt,
					focusRipple: !rt,
					focusVisibleClassName: clsx(dt.focusVisible, nt),
					ownerState: lt,
					ref: a,
				},
				st,
				{ classes: dt, children: $ }
			)
		);
	}),
	Fab$1 = Fab,
	Stack = createStack({
		createStyledComponent: styled$1("div", {
			name: "MuiStack",
			slot: "Root",
			overridesResolver: (o, i) => i.root,
		}),
		useThemeProps: (o) => useThemeProps({ props: o, name: "MuiStack" }),
	}),
	Stack$1 = Stack,
	_excluded$1 = [
		"addEndListener",
		"appear",
		"children",
		"easing",
		"in",
		"onEnter",
		"onEntered",
		"onEntering",
		"onExit",
		"onExited",
		"onExiting",
		"style",
		"timeout",
		"TransitionComponent",
	];
function getScale(o) {
	return `scale(${o}, ${o ** 2})`;
}
const styles = {
		entering: { opacity: 1, transform: getScale(1) },
		entered: { opacity: 1, transform: "none" },
	},
	isWebKit154 =
		typeof navigator < "u" &&
		/^((?!chrome|android).)*(safari|mobile)/i.test(navigator.userAgent) &&
		/(os |version\/)15(.|_)4/i.test(navigator.userAgent),
	Grow = reactExports.forwardRef(function (i, a) {
		const {
				addEndListener: s,
				appear: $ = !0,
				children: j,
				easing: _e,
				in: et,
				onEnter: tt,
				onEntered: rt,
				onEntering: nt,
				onExit: it,
				onExited: ot,
				onExiting: st,
				style: lt,
				timeout: dt = "auto",
				TransitionComponent: pt = Transition$1,
			} = i,
			ct = _objectWithoutPropertiesLoose(i, _excluded$1),
			at = reactExports.useRef(),
			ft = reactExports.useRef(),
			ut = useTheme(),
			ht = reactExports.useRef(null),
			yt = useForkRef(ht, j.ref, a),
			mt = ($t) => (jt) => {
				if ($t) {
					const It = ht.current;
					jt === void 0 ? $t(It) : $t(It, jt);
				}
			},
			Et = mt(nt),
			Rt = mt(($t, jt) => {
				reflow($t);
				const {
					duration: It,
					delay: Ct,
					easing: St,
				} = getTransitionProps({ style: lt, timeout: dt, easing: _e }, { mode: "enter" });
				let kt;
				(dt === "auto"
					? ((kt = ut.transitions.getAutoHeightDuration($t.clientHeight)), (ft.current = kt))
					: (kt = It),
					($t.style.transition = [
						ut.transitions.create("opacity", { duration: kt, delay: Ct }),
						ut.transitions.create("transform", {
							duration: isWebKit154 ? kt : kt * 0.666,
							delay: Ct,
							easing: St,
						}),
					].join(",")),
					tt && tt($t, jt));
			}),
			vt = mt(rt),
			Tt = mt(st),
			Pt = mt(($t) => {
				const {
					duration: jt,
					delay: It,
					easing: Ct,
				} = getTransitionProps({ style: lt, timeout: dt, easing: _e }, { mode: "exit" });
				let St;
				(dt === "auto"
					? ((St = ut.transitions.getAutoHeightDuration($t.clientHeight)), (ft.current = St))
					: (St = jt),
					($t.style.transition = [
						ut.transitions.create("opacity", { duration: St, delay: It }),
						ut.transitions.create("transform", {
							duration: isWebKit154 ? St : St * 0.666,
							delay: isWebKit154 ? It : It || St * 0.333,
							easing: Ct,
						}),
					].join(",")),
					($t.style.opacity = 0),
					($t.style.transform = getScale(0.75)),
					it && it($t));
			}),
			Dt = mt(ot),
			Nt = ($t) => {
				(dt === "auto" && (at.current = setTimeout($t, ft.current || 0)), s && s(ht.current, $t));
			};
		return (
			reactExports.useEffect(
				() => () => {
					clearTimeout(at.current);
				},
				[]
			),
			jsxRuntimeExports.jsx(
				pt,
				_extends$9(
					{
						appear: $,
						in: et,
						nodeRef: ht,
						onEnter: Rt,
						onEntered: vt,
						onEntering: Et,
						onExit: Pt,
						onExited: Dt,
						onExiting: Tt,
						addEndListener: Nt,
						timeout: dt === "auto" ? null : dt,
					},
					ct,
					{
						children: ($t, jt) =>
							reactExports.cloneElement(
								j,
								_extends$9(
									{
										style: _extends$9(
											{
												opacity: 0,
												transform: getScale(0.75),
												visibility: $t === "exited" && !et ? "hidden" : void 0,
											},
											styles[$t],
											lt,
											j.props.style
										),
										ref: yt,
									},
									jt
								)
							),
					}
				)
			)
		);
	});
Grow.muiSupportAuto = !0;
const Grow$1 = Grow;
function useMediaQueryOld(o, i, a, s, $) {
	const [j, _e] = reactExports.useState(() => ($ && a ? a(o).matches : s ? s(o).matches : i));
	return (
		useEnhancedEffect$1(() => {
			let et = !0;
			if (!a) return;
			const tt = a(o),
				rt = () => {
					et && _e(tt.matches);
				};
			return (
				rt(),
				tt.addListener(rt),
				() => {
					((et = !1), tt.removeListener(rt));
				}
			);
		}, [o, a]),
		j
	);
}
const maybeReactUseSyncExternalStore = React$1["useSyncExternalStore"];
function useMediaQueryNew(o, i, a, s, $) {
	const j = reactExports.useCallback(() => i, [i]),
		_e = reactExports.useMemo(() => {
			if ($ && a) return () => a(o).matches;
			if (s !== null) {
				const { matches: nt } = s(o);
				return () => nt;
			}
			return j;
		}, [j, o, s, $, a]),
		[et, tt] = reactExports.useMemo(() => {
			if (a === null) return [j, () => () => {}];
			const nt = a(o);
			return [
				() => nt.matches,
				(it) => (
					nt.addListener(it),
					() => {
						nt.removeListener(it);
					}
				),
			];
		}, [j, a, o]);
	return maybeReactUseSyncExternalStore(tt, et, _e);
}
function useMediaQuery(o, i = {}) {
	const a = useTheme$3(),
		s = typeof window < "u" && typeof window.matchMedia < "u",
		{
			defaultMatches: $ = !1,
			matchMedia: j = s ? window.matchMedia : null,
			ssrMatchMedia: _e = null,
			noSsr: et = !1,
		} = getThemeProps({ name: "MuiUseMediaQuery", props: i, theme: a });
	let tt = typeof o == "function" ? o(a) : o;
	return (
		(tt = tt.replace(/^@media( ?)/m, "")),
		(maybeReactUseSyncExternalStore !== void 0 ? useMediaQueryNew : useMediaQueryOld)(
			tt,
			$,
			j,
			_e,
			et
		)
	);
}
const _excluded = ["getTrigger", "target"];
function defaultTrigger(o, i) {
	const { disableHysteresis: a = !1, threshold: s = 100, target: $ } = i,
		j = o.current;
	return (
		$ && (o.current = $.pageYOffset !== void 0 ? $.pageYOffset : $.scrollTop),
		!a && j !== void 0 && o.current < j ? !1 : o.current > s
	);
}
const defaultTarget = typeof window < "u" ? window : null;
function useScrollTrigger(o = {}) {
	const { getTrigger: i = defaultTrigger, target: a = defaultTarget } = o,
		s = _objectWithoutPropertiesLoose(o, _excluded),
		$ = reactExports.useRef(),
		[j, _e] = reactExports.useState(() => i($, s));
	return (
		reactExports.useEffect(() => {
			const et = () => {
				_e(i($, _extends$9({ target: a }, s)));
			};
			return (
				et(),
				a.addEventListener("scroll", et, { passive: !0 }),
				() => {
					a.removeEventListener("scroll", et, { passive: !0 });
				}
			);
		}, [a, i, JSON.stringify(s)]),
		j
	);
}
const Nav = () => {
	const o = useNavigate(),
		i = useMediaQuery("(min-width:600px)");
	return jsxRuntimeExports.jsxs(Box$1, {
		sx: { display: "flex", justifyContent: "space-between", alignItems: "center" },
		component: "nav",
		children: [
			jsxRuntimeExports.jsx(Box$1, {
				component: "img",
				src: "images-compress/android-icon-192x192.webp",
				width: 60,
				height: 60,
				alt: "Dragonball-Goku-icon",
				bgcolor: "white",
				sx: { cursor: "pointer" },
				onClick: () => {
					o("/");
				},
			}),
			jsxRuntimeExports.jsxs(Stack$1, {
				direction: "row",
				gap: 3,
				alignItems: "center",
				children: [
					jsxRuntimeExports.jsx(Typography$1, {
						component: Link,
						to: "/documentation",
						sx: { textDecoration: "none" },
						variant: "h6",
						color: "text.primary",
						fontWeight: "900",
						children: "Docs",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						component: Link,
						to: "/about",
						sx: { textDecoration: "none" },
						variant: "h6",
						color: "text.primary",
						fontWeight: "900",
						children: "About",
					}),
					i
						? jsxRuntimeExports.jsx(Button$1, {
								variant: "contained",
								color: "primary",
								disableElevation: !0,
								sx: { color: "white" },
								onClick: () => {
									o("/support");
								},
								children: "support us",
							})
						: jsxRuntimeExports.jsx(Box$1, {
								component: "img",
								src: "images-compress/support-icon.svg",
								width: 40,
								height: 40,
								alt: "support-icon",
								sx: { p: 1.2, borderRadius: 2, bgcolor: "primary.main", cursor: "pointer" },
								onClick: () => {
									o("/support");
								},
							}),
				],
			}),
		],
	});
};
var GitHub = {},
	interopRequireDefault = { exports: {} };
(function (o) {
	function i(a) {
		return a && a.__esModule ? a : { default: a };
	}
	((o.exports = i), (o.exports.__esModule = !0), (o.exports.default = o.exports));
})(interopRequireDefault);
var interopRequireDefaultExports = interopRequireDefault.exports,
	createSvgIcon = {};
const require$$0 = getAugmentedNamespace(utils);
var hasRequiredCreateSvgIcon;
function requireCreateSvgIcon() {
	return (
		hasRequiredCreateSvgIcon ||
			((hasRequiredCreateSvgIcon = 1),
			(function (o) {
				"use client";
				(Object.defineProperty(o, "__esModule", { value: !0 }),
					Object.defineProperty(o, "default", {
						enumerable: !0,
						get: function () {
							return i.createSvgIcon;
						},
					}));
				var i = require$$0;
			})(createSvgIcon)),
		createSvgIcon
	);
}
var _interopRequireDefault$3 = interopRequireDefaultExports;
Object.defineProperty(GitHub, "__esModule", { value: !0 });
var default_1$3 = (GitHub.default = void 0);
_interopRequireWildcard$1(reactExports);
var _createSvgIcon$3 = _interopRequireDefault$3(requireCreateSvgIcon()),
	_jsxRuntime$3 = jsxRuntimeExports;
function _getRequireWildcardCache$1(o) {
	if (typeof WeakMap != "function") return null;
	var i = new WeakMap(),
		a = new WeakMap();
	return (_getRequireWildcardCache$1 = function (s) {
		return s ? a : i;
	})(o);
}
function _interopRequireWildcard$1(o, i) {
	if (!i && o && o.__esModule) return o;
	if (o === null || (typeof o != "object" && typeof o != "function")) return { default: o };
	var a = _getRequireWildcardCache$1(i);
	if (a && a.has(o)) return a.get(o);
	var s = {},
		$ = Object.defineProperty && Object.getOwnPropertyDescriptor;
	for (var j in o)
		if (j !== "default" && Object.prototype.hasOwnProperty.call(o, j)) {
			var _e = $ ? Object.getOwnPropertyDescriptor(o, j) : null;
			_e && (_e.get || _e.set) ? Object.defineProperty(s, j, _e) : (s[j] = o[j]);
		}
	return ((s.default = o), a && a.set(o, s), s);
}
var _default$3 = (0, _createSvgIcon$3.default)(
	(0, _jsxRuntime$3.jsx)("path", {
		d: "M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27",
	}),
	"GitHub"
);
default_1$3 = GitHub.default = _default$3;
var LinkedIn = {},
	_interopRequireDefault$2 = interopRequireDefaultExports;
Object.defineProperty(LinkedIn, "__esModule", { value: !0 });
var default_1$2 = (LinkedIn.default = void 0);
_interopRequireWildcard(reactExports);
var _createSvgIcon$2 = _interopRequireDefault$2(requireCreateSvgIcon()),
	_jsxRuntime$2 = jsxRuntimeExports;
function _getRequireWildcardCache(o) {
	if (typeof WeakMap != "function") return null;
	var i = new WeakMap(),
		a = new WeakMap();
	return (_getRequireWildcardCache = function (s) {
		return s ? a : i;
	})(o);
}
function _interopRequireWildcard(o, i) {
	if (!i && o && o.__esModule) return o;
	if (o === null || (typeof o != "object" && typeof o != "function")) return { default: o };
	var a = _getRequireWildcardCache(i);
	if (a && a.has(o)) return a.get(o);
	var s = {},
		$ = Object.defineProperty && Object.getOwnPropertyDescriptor;
	for (var j in o)
		if (j !== "default" && Object.prototype.hasOwnProperty.call(o, j)) {
			var _e = $ ? Object.getOwnPropertyDescriptor(o, j) : null;
			_e && (_e.get || _e.set) ? Object.defineProperty(s, j, _e) : (s[j] = o[j]);
		}
	return ((s.default = o), a && a.set(o, s), s);
}
var _default$2 = (0, _createSvgIcon$2.default)(
	(0, _jsxRuntime$2.jsx)("path", {
		d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
	}),
	"LinkedIn"
);
default_1$2 = LinkedIn.default = _default$2;
var Favorite = {},
	_interopRequireDefault$1 = interopRequireDefaultExports;
Object.defineProperty(Favorite, "__esModule", { value: !0 });
var default_1$1 = (Favorite.default = void 0),
	_createSvgIcon$1 = _interopRequireDefault$1(requireCreateSvgIcon()),
	_jsxRuntime$1 = jsxRuntimeExports,
	_default$1 = (0, _createSvgIcon$1.default)(
		(0, _jsxRuntime$1.jsx)("path", {
			d: "m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
		}),
		"Favorite"
	);
default_1$1 = Favorite.default = _default$1;
const Footer = () => {
		const [o, i] = reactExports.useState({ characters: 58, transformations: 49, planets: 20 }),
			[a, s] = reactExports.useState(null);
		return (
			reactExports.useEffect(() => {
				(async () => {
					var j;
					try {
						const et = await (
							await fetch(
								"https://api.uptimerobot.com/v2/getMonitors?api_key=m795654103-7a4b23b1aaf46b45cdeceadc",
								{ method: "POST", headers: { "Content-Type": "application/json" } }
							)
						).json();
						s((j = et == null ? void 0 : et.monitors[0]) == null ? void 0 : j.status);
					} catch (_e) {
						console.log("Error fetching server status:", _e);
					}
				})();
			}, []),
			jsxRuntimeExports.jsxs(Box$1, {
				component: "footer",
				textAlign: "center",
				sx: {
					backgroundColor: "rgb(32, 35, 41)",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					color: "white",
				},
				py: 5,
				children: [
					jsxRuntimeExports.jsxs(Stack$1, {
						direction: { xs: "column", md: "row" },
						gap: 2,
						children: [
							jsxRuntimeExports.jsxs(Typography$1, {
								fontWeight: "900",
								variant: "body2",
								color: "background.paper",
								children: ["CHARACTERS: ", o.characters],
							}),
							jsxRuntimeExports.jsxs(Typography$1, {
								fontWeight: "900",
								variant: "body2",
								color: "background.paper",
								children: ["TRANSFORMATIONS: ", o.transformations],
							}),
							jsxRuntimeExports.jsxs(Typography$1, {
								fontWeight: "900",
								variant: "body2",
								color: "background.paper",
								children: ["PLANETS: ", o.planets],
							}),
						],
					}),
					jsxRuntimeExports.jsx(Divider$1, { sx: { width: "400px", my: 2, bgcolor: "white" } }),
					jsxRuntimeExports.jsx(Box$1, {
						component: Link,
						to: "https://stats.uptimerobot.com/Vq3orF05Rl",
						target: "_blank",
						children: jsxRuntimeExports.jsxs(Typography$1, {
							fontWeight: "900",
							component: "div",
							variant: "body2",
							color: "background.paper",
							mt: 2,
							children: [
								"SERVER STATUS:",
								" ",
								a === 2
									? jsxRuntimeExports.jsx(Box$1, {
											component: "div",
											display: "inline-block",
											borderRadius: "50%",
											height: "10px",
											width: "10px",
											bgcolor: "green",
										})
									: jsxRuntimeExports.jsx(Box$1, {
											component: "div",
											borderRadius: "50%",
											display: "inline-block",
											height: "10px",
											width: "10px",
											bgcolor: "red",
										}),
							],
						}),
					}),
					jsxRuntimeExports.jsxs(Stack$1, {
						direction: "row",
						gap: 4,
						my: 4,
						alignItems: "center",
						children: [
							jsxRuntimeExports.jsx(Box$1, {
								component: "img",
								src: "https://d0.awsstatic.com/logos/powered-by-aws-white.png",
								alt: "Powered by AWS Cloud Computing",
								width: 120,
								height: 40,
								sx: {
									minHeight: "40px",
									maxHeight: "40px",
									objectFit: "contain",
									objectPosition: "center",
									width: "100%",
									cursor: "pointer",
									"&:hover": { opacity: 0.8 },
								},
								onClick: () => {
									window.open("https://aws.amazon.com/what-is-cloud-computing", "_blank");
								},
							}),
							jsxRuntimeExports.jsx("a", {
								href: "https://www.netlify.com",
								rel: "noopener noreferrer",
								target: "_blank",
								"aria-label": "link to Netlify website",
								children: jsxRuntimeExports.jsxs("svg", {
									width: "120px",
									viewBox: "0 0 93 34",
									fill: "none",
									children: [
										jsxRuntimeExports.jsx("path", {
											fillRule: "evenodd",
											clipRule: "evenodd",
											d: "M23.6162 12.0244C23.7871 12.1102 23.9295 12.2246 24.0435 12.3532C24.0577 12.3675 24.0577 12.3675 24.072 12.3675H24.0862L27.3623 10.9521C27.3765 10.9378 27.3908 10.9235 27.3908 10.9092C27.3908 10.8949 27.3908 10.8806 27.3765 10.8663L24.3141 7.79226C24.2999 7.77796 24.2856 7.77796 24.2856 7.77796H24.2714C24.2572 7.77796 24.2429 7.79226 24.2429 7.82086L23.5735 11.9815C23.5877 11.9958 23.6019 12.0244 23.6162 12.0244ZM16.8219 9.23633C16.9786 9.47939 17.0783 9.76535 17.1068 10.0513C17.1068 10.0656 17.121 10.0799 17.1353 10.0942L22.0066 12.196H22.0209C22.0351 12.196 22.0494 12.196 22.0494 12.1817C22.1918 12.0673 22.3627 11.9815 22.5479 11.9243C22.5621 11.9243 22.5764 11.91 22.5764 11.8814L23.374 6.86291C23.374 6.84861 23.374 6.83431 23.3598 6.82002L20.3116 3.74601C20.2974 3.73171 20.2974 3.73171 20.2831 3.73171C20.2689 3.73171 20.2547 3.74601 20.2547 3.7603L16.8219 9.16484C16.8077 9.19344 16.8077 9.22204 16.8219 9.23633ZM33.4586 16.9714L28.2312 11.7098C28.2169 11.6955 28.2027 11.6955 28.2027 11.6955H28.1884L24.6417 13.2254C24.6275 13.2397 24.6132 13.254 24.6132 13.2683C24.6132 13.2826 24.6275 13.3112 24.6417 13.3112L33.3874 17.0715H33.4017C33.4159 17.0715 33.4301 17.0715 33.4301 17.0572L33.4586 17.0286C33.4871 17.0286 33.4871 16.9857 33.4586 16.9714ZM32.5898 17.8293L24.2002 14.2262H24.1859C24.1717 14.2262 24.1574 14.2262 24.1432 14.2405C23.9153 14.5551 23.5735 14.7553 23.1746 14.8124C23.1604 14.8124 23.1319 14.8267 23.1319 14.8553L22.2345 20.4458C22.2345 20.4601 22.2345 20.4743 22.2488 20.4886C22.5621 20.7317 22.7473 21.0892 22.79 21.4895C22.79 21.5181 22.8043 21.5324 22.8328 21.5324L27.9036 22.6047H27.9178C27.932 22.6047 27.9463 22.6047 27.9463 22.5904L32.5898 17.9151C32.604 17.9008 32.604 17.8865 32.604 17.8722C32.604 17.8579 32.604 17.8436 32.5898 17.8293ZM21.4796 13.0538L16.8931 11.0807H16.8789C16.8646 11.0807 16.8504 11.095 16.8361 11.1093C16.5228 11.5955 15.9958 11.8814 15.426 11.8814C15.3405 11.8814 15.2551 11.8671 15.1554 11.8528H15.1411C15.1269 11.8528 15.1126 11.8671 15.0984 11.8814L11.3238 17.815C11.3096 17.8293 11.3096 17.8579 11.3238 17.8722C11.338 17.8865 11.3523 17.8865 11.3665 17.8865H11.3808L21.4511 13.5257C21.4654 13.5114 21.4796 13.4971 21.4796 13.4828V13.4256V13.3541C21.4796 13.2683 21.4939 13.1825 21.5081 13.111C21.5081 13.0824 21.4939 13.0681 21.4796 13.0538ZM27.0062 23.434L22.5479 22.5046H22.5337C22.5194 22.5046 22.5052 22.5189 22.4909 22.5189C22.32 22.7334 22.1063 22.905 21.85 23.005C21.8357 23.005 21.8215 23.0336 21.8215 23.0479L20.7532 29.7107C20.7532 29.7393 20.7674 29.7536 20.7817 29.7679H20.8102C20.8244 29.7679 20.8386 29.7679 20.8386 29.7536L27.0204 23.5341C27.0347 23.5198 27.0347 23.5055 27.0347 23.4912C27.0347 23.4483 27.0204 23.434 27.0062 23.434ZM20.7817 22.9764C20.3544 22.8049 20.041 22.4188 19.927 21.9756C19.927 21.9613 19.9128 21.947 19.8843 21.9327L11.6229 20.2027C11.6229 20.2027 11.6229 20.2027 11.6087 20.2027C11.5944 20.2027 11.5802 20.217 11.5659 20.2313C11.5232 20.3028 11.4947 20.36 11.452 20.4172C11.4378 20.4315 11.4378 20.4601 11.452 20.4743L18.9727 31.5122C18.987 31.5265 18.987 31.5265 19.0012 31.5265C19.0154 31.5265 19.0297 31.5265 19.0297 31.5122L19.4855 31.0547C19.4855 31.0404 19.4997 31.0404 19.4997 31.0261L20.7817 23.0193C20.8102 23.0193 20.8102 22.9907 20.7817 22.9764ZM11.7938 19.1876C11.7938 19.2161 11.8081 19.2304 11.8366 19.2304L20.0268 20.9462H20.041C20.0552 20.9462 20.0695 20.9319 20.0837 20.9176C20.3259 20.4886 20.7532 20.2027 21.2375 20.1741C21.266 20.1741 21.2802 20.1598 21.2802 20.1312L22.1633 14.6266C22.1633 14.6123 22.1633 14.5837 22.1348 14.5837C22.0779 14.5408 22.0209 14.4979 21.9497 14.4264C21.9354 14.4121 21.9212 14.4121 21.9212 14.4121H21.9069L11.7796 18.8015C11.7511 18.8158 11.7511 18.8301 11.7511 18.8587C11.7654 18.9731 11.7938 19.0732 11.7938 19.1876ZM8.3611 20.5744C8.31837 20.5172 8.27563 20.46 8.2329 20.3886C8.21866 20.3743 8.20442 20.36 8.19017 20.36H8.17593L4.64347 21.8898C4.62923 21.8898 4.61498 21.9041 4.61498 21.9184C4.61498 21.9327 4.61498 21.947 4.62923 21.9613L6.35273 23.6913C6.36697 23.7056 6.38121 23.7056 6.38121 23.7056C6.39546 23.7056 6.4097 23.6913 6.42394 23.677L8.37534 20.603C8.37534 20.603 8.37534 20.5887 8.3611 20.5744ZM10.6971 21.132C10.6828 21.1177 10.6686 21.1034 10.6543 21.1034H10.6401C10.3837 21.2178 10.1273 21.275 9.85669 21.275C9.64304 21.275 9.44362 21.2464 9.22997 21.1749H9.21572C9.20148 21.1749 9.18724 21.1892 9.17299 21.2035L7.12189 24.4348L7.10765 24.4491C7.0934 24.4634 7.0934 24.492 7.10765 24.5063L16.537 33.9857C16.5513 34 16.5655 34 16.5655 34C16.5798 34 16.594 34 16.594 33.9857L18.2463 32.3129C18.2605 32.2986 18.2605 32.27 18.2463 32.2557L10.6971 21.132ZM9.37241 17.4003C9.38665 17.4146 9.40089 17.4289 9.41514 17.4289H9.42938C9.57182 17.4003 9.7285 17.3717 9.87094 17.3717C10.0276 17.3717 10.1985 17.4003 10.3552 17.4432H10.3695C10.3837 17.4432 10.398 17.4289 10.4122 17.4146L14.2295 11.4096C14.2438 11.3953 14.2438 11.3667 14.2295 11.3524C13.9304 11.0378 13.7595 10.6232 13.7595 10.18C13.7595 10.0513 13.7737 9.92262 13.8022 9.79394C13.8022 9.76535 13.788 9.75105 13.7737 9.73675C13.2894 9.52229 9.00207 7.69218 9.00207 7.67788H8.98782C8.97358 7.67788 8.95934 7.67788 8.95934 7.69218L5.32717 11.3524C5.31293 11.3667 5.31293 11.3953 5.32717 11.4096L9.37241 17.4003ZM9.78548 6.9344C9.78548 6.9344 14.1156 8.7931 14.3008 8.87889H14.315C14.3292 8.87889 14.3292 8.87889 14.3435 8.86459C14.6426 8.62153 15.0272 8.47855 15.4118 8.47855C15.5969 8.47855 15.7821 8.50715 15.9673 8.56434H15.9815C15.9958 8.56434 16.01 8.55004 16.0243 8.53574L19.5425 3.00252C19.5567 2.98823 19.5567 2.95963 19.5425 2.94533L16.6225 0.0142977C16.6082 0 16.6082 0 16.594 0C16.5798 0 16.5655 0 16.5655 0.0142977L9.78548 6.84861C9.77123 6.86291 9.77123 6.87721 9.77123 6.89151C9.75699 6.9201 9.77123 6.9201 9.78548 6.9344ZM8.10471 18.4441C8.11895 18.4441 8.1332 18.4298 8.14744 18.4155C8.2329 18.2439 8.3611 18.0866 8.48929 17.9436C8.50353 17.9294 8.50353 17.9008 8.48929 17.8865C8.44656 17.8293 4.5865 12.1674 4.5865 12.1531C4.57225 12.1388 4.57225 12.1388 4.54377 12.1245C4.52952 12.1245 4.51528 12.1245 4.51528 12.1388L0.0142438 16.6569C0 16.6712 0 16.6854 0 16.6997C0 16.714 0.0142438 16.7283 0.0427313 16.7283L8.10471 18.4441C8.09047 18.4441 8.09047 18.4441 8.10471 18.4441ZM7.73437 19.4306C7.73437 19.402 7.72013 19.3877 7.69164 19.3877L0.697945 17.9151C0.697945 17.9151 0.697945 17.9151 0.683701 17.9151C0.669458 17.9151 0.655214 17.9294 0.64097 17.9436C0.626726 17.9579 0.64097 17.9865 0.655214 18.0008L3.7746 21.1463C3.78885 21.1606 3.80309 21.1606 3.80309 21.1606H3.81733L7.69164 19.4878C7.72013 19.4592 7.73437 19.4449 7.73437 19.4306Z",
											fill: "#f0f0f0",
										}),
										jsxRuntimeExports.jsx("path", {
											fillRule: "evenodd",
											clipRule: "evenodd",
											d: "M67.5019 14.765H69.7772V29.3121H67.5019V14.765ZM44.2222 18.8694C42.9992 18.8694 42.0179 19.3301 41.2642 20.2376L41.1931 19.0509H39.06V29.2981H41.3353V22.0106C41.7904 21.173 42.473 20.7541 43.3832 20.7541C44.0089 20.7541 44.464 20.9077 44.7484 21.2288C45.0328 21.5359 45.1608 22.0246 45.1608 22.6667V29.2981H47.4361V22.5271C47.4077 20.098 46.3411 18.8694 44.2222 18.8694ZM54.0489 18.8694C53.1814 18.8694 52.3992 19.0928 51.6882 19.5395C50.9771 19.9863 50.4367 20.6145 50.0386 21.4242C49.6546 22.234 49.4555 23.1414 49.4555 24.1606V24.4398C49.4555 25.9615 49.9106 27.19 50.8065 28.1114C51.7024 29.0328 52.8685 29.4936 54.3191 29.4936C55.1581 29.4936 55.926 29.326 56.6086 28.991C57.2912 28.6559 57.8316 28.1812 58.2298 27.567L57.0068 26.3803C56.3527 27.2319 55.4994 27.6647 54.4613 27.6647C53.7218 27.6647 53.0961 27.4134 52.6125 26.9248C52.1148 26.4362 51.8446 25.766 51.7735 24.9144H58.4005V23.993C58.4005 22.3596 58.0165 21.1031 57.277 20.2097C56.4949 19.3162 55.4283 18.8694 54.0489 18.8694ZM56.1251 23.2252H51.7877C51.8873 22.4294 52.1433 21.8151 52.5272 21.3824C52.9112 20.9356 53.4231 20.7262 54.0489 20.7262C54.6746 20.7262 55.1723 20.9217 55.5278 21.3126C55.8834 21.7035 56.0825 22.2898 56.1393 23.0577V23.2252H56.1251ZM63.52 27.3296C63.3636 27.1621 63.2925 26.8689 63.2925 26.478V20.7541H65.0843V19.0509H63.2925V16.5659H61.0171V19.0509H59.3533V20.7541H61.0171V26.5618C61.0171 28.5163 61.8988 29.4936 63.648 29.4936C64.1315 29.4936 64.6292 29.4238 65.1554 29.2702V27.4832C64.8852 27.553 64.615 27.5809 64.359 27.5809C63.9466 27.5949 63.6764 27.5111 63.52 27.3296ZM73.304 19.0649H75.5793V29.3121H73.304V19.0649ZM88.492 26.0173L86.3446 19.0649H83.8844L87.4538 29.2562L87.1268 30.1357C86.9561 30.6383 86.7286 30.9874 86.4299 31.1968C86.1455 31.4062 85.7047 31.5179 85.1358 31.5179L84.7092 31.4899V33.2769C85.1074 33.3886 85.4771 33.4444 85.8042 33.4444C87.2832 33.4444 88.3355 32.5789 88.9613 30.8617L93 19.0649H90.5682L88.492 26.0173ZM80.0447 15.4909C79.419 16.1052 79.1061 16.9847 79.1061 18.1295V19.0649H77.5561V20.7681H79.1061V29.3121H81.3815V20.7681H83.4435V19.0649H81.3815V18.1574C81.3815 17.0266 81.9219 16.4682 83.0169 16.4682C83.344 16.4682 83.6426 16.4961 83.8844 16.538L83.9413 14.737C83.4862 14.6254 83.0738 14.5695 82.6614 14.5695C81.5521 14.5556 80.6704 14.8767 80.0447 15.4909ZM75.5793 14.5556V16.5659H73.304V14.5556H75.5793Z",
											fill: "#f0f0f0",
										}),
										jsxRuntimeExports.jsx("path", {
											fillRule: "evenodd",
											clipRule: "evenodd",
											d: "M39 10.7088V5.08117H40.9326C41.6206 5.08117 42.1875 5.30084 42.6332 5.74018C43.079 6.17952 43.3019 6.74318 43.3019 7.43118V8.36268C43.3019 9.05326 43.079 9.61692 42.6332 10.0537C42.1875 10.4905 41.6206 10.7088 40.9326 10.7088H39ZM40.1286 5.95083V9.84304H40.8746C41.2792 9.84304 41.5961 9.70647 41.8254 9.43333C42.0548 9.16019 42.1694 8.80331 42.1694 8.36268V7.42345C42.1694 6.98798 42.0548 6.63367 41.8254 6.36053C41.5961 6.08739 41.2792 5.95083 40.8746 5.95083H40.1286ZM48.6358 8.23513H46.3051V9.84304H49.0301V10.7088H45.1765V5.08117H49.0223V5.95083H46.3051V7.36547H48.6358V8.23513ZM51.84 8.66803V10.7088H50.7114V5.08117H52.9532C53.6 5.08117 54.1089 5.24608 54.4799 5.57591C54.851 5.90574 55.0365 6.33992 55.0365 6.87846C55.0365 7.41701 54.851 7.84991 54.4799 8.17716C54.1089 8.50441 53.6 8.66803 52.9532 8.66803H51.84ZM51.84 7.79837H52.9532C53.2676 7.79837 53.5059 7.71269 53.6683 7.54134C53.8306 7.36998 53.9118 7.1516 53.9118 6.8862C53.9118 6.61563 53.8312 6.3921 53.6702 6.21559C53.5091 6.03908 53.2701 5.95083 52.9532 5.95083H51.84V7.79837ZM57.9856 9.84304H60.4903V10.7088H56.857V5.08117H57.9856V9.84304ZM66.4271 8.40133C66.4271 9.09191 66.2088 9.66266 65.772 10.1136C65.3352 10.5645 64.7677 10.79 64.0694 10.79C63.3762 10.79 62.8132 10.5645 62.3803 10.1136C61.9474 9.66266 61.731 9.09191 61.731 8.40133V7.38867C61.731 6.70066 61.9468 6.13056 62.3784 5.67833C62.81 5.22611 63.3724 5 64.0655 5C64.7638 5 65.332 5.22611 65.7701 5.67833C66.2081 6.13056 66.4271 6.70066 66.4271 7.38867V8.40133ZM65.2985 7.38093C65.2985 6.94288 65.189 6.58343 64.97 6.30256C64.7509 6.02169 64.4495 5.88126 64.0655 5.88126C63.6816 5.88126 63.384 6.02104 63.1727 6.30062C62.9614 6.5802 62.8557 6.94031 62.8557 7.38093V8.40133C62.8557 8.84712 62.9627 9.21044 63.1765 9.49131C63.3904 9.77218 63.688 9.91261 64.0694 9.91261C64.4559 9.91261 64.7574 9.77218 64.9738 9.49131C65.1903 9.21044 65.2985 8.84712 65.2985 8.40133V7.38093ZM70.0642 7.67469H70.0874L71.3166 5.08117H72.5534L70.6208 8.72987V10.7088H69.4961V8.6719L67.5983 5.08117H68.8351L70.0642 7.67469ZM77.0524 9.24007C77.0524 9.02362 76.9758 8.84969 76.8225 8.71828C76.6691 8.58686 76.4005 8.46318 76.0166 8.34722C75.3466 8.15396 74.8403 7.92463 74.4976 7.65923C74.1549 7.39382 73.9835 7.0305 73.9835 6.56925C73.9835 6.10801 74.18 5.73116 74.5729 5.43869C74.9659 5.14623 75.4677 5 76.0784 5C76.6968 5 77.2006 5.16427 77.5897 5.49281C77.9788 5.82135 78.1669 6.22654 78.154 6.7084L78.1463 6.73159H77.0524C77.0524 6.47133 76.9655 6.26068 76.7915 6.09964C76.6176 5.93859 76.3735 5.85806 76.0591 5.85806C75.7576 5.85806 75.5244 5.92506 75.3595 6.05905C75.1946 6.19305 75.1121 6.3644 75.1121 6.57312C75.1121 6.7638 75.2004 6.92034 75.3769 7.04273C75.5534 7.16513 75.8581 7.29461 76.291 7.43118C76.912 7.60383 77.3823 7.83187 77.7018 8.11531C78.0213 8.39876 78.1811 8.7711 78.1811 9.23234C78.1811 9.7142 77.991 10.0943 77.611 10.3726C77.2309 10.6509 76.7291 10.79 76.1055 10.79C75.4922 10.79 74.9575 10.6322 74.5014 10.3165C74.0453 10.0009 73.8237 9.55831 73.8366 8.98884L73.8444 8.96565H74.9421C74.9421 9.30063 75.0445 9.54606 75.2493 9.70196C75.4542 9.85786 75.7396 9.9358 76.1055 9.9358C76.4121 9.9358 76.6466 9.87267 76.8089 9.74641C76.9713 9.62015 77.0524 9.45137 77.0524 9.24007ZM82.9855 10.7088V5.08117H84.8871C85.5493 5.08117 86.066 5.21001 86.437 5.46768C86.8081 5.72536 86.9936 6.11058 86.9936 6.62336C86.9936 6.88362 86.9247 7.11617 86.7868 7.32102C86.649 7.52588 86.4486 7.67984 86.1858 7.78291C86.5233 7.85506 86.7765 8.00966 86.9453 8.24673C87.1141 8.48379 87.1985 8.75822 87.1985 9.07001C87.1985 9.60855 87.0207 10.0163 86.6651 10.2933C86.3095 10.5703 85.8057 10.7088 85.1538 10.7088H82.9855ZM84.1141 8.21967V9.84304H85.1538C85.4527 9.84304 85.6807 9.77797 85.8379 9.64785C85.9951 9.51772 86.0737 9.32511 86.0737 9.07001C86.0737 8.79429 86.0067 8.58364 85.8727 8.43805C85.7387 8.29247 85.5274 8.21967 85.2388 8.21967H84.1141ZM84.1141 7.43891H84.9258C85.2272 7.43891 85.4591 7.37707 85.6215 7.25338C85.7838 7.1297 85.865 6.94933 85.865 6.71226C85.865 6.45201 85.7832 6.26004 85.6196 6.13636C85.4559 6.01267 85.2118 5.95083 84.8871 5.95083H84.1141V7.43891ZM90.5109 7.67469H90.5341L91.7632 5.08117H93.0001L91.0675 8.72987V10.7088H89.9427V8.6719L88.0449 5.08117H89.2818L90.5109 7.67469Z",
											fill: "#BCBCBC",
										}),
									],
								}),
							}),
						],
					}),
					jsxRuntimeExports.jsxs(Stack$1, {
						direction: "row",
						gap: 4,
						mt: 2,
						children: [
							jsxRuntimeExports.jsx(default_1$3, {
								onClick: () => window.open("https://github.com/intentodepirata", "_blank"),
								sx: { cursor: "pointer" },
							}),
							jsxRuntimeExports.jsx(default_1$2, {
								onClick: () =>
									window.open("https://www.linkedin.com/in/antonio-alvarez-lopez/", "_blank"),
								sx: { cursor: "pointer" },
							}),
							jsxRuntimeExports.jsx(default_1$1, {
								onClick: () => window.open("https://ko-fi.com/dragonballapi", "_blank"),
								sx: { cursor: "pointer" },
							}),
						],
					}),
					jsxRuntimeExports.jsxs(Typography$1, {
						fontWeight: "900",
						component: "div",
						variant: "body2",
						color: "background.paper",
						mt: 2,
						children: [
							"< >",
							" by",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://antonioalvarez.dev/",
								target: "_blank",
								fontWeight: "900",
								variant: "body2",
								color: "background.paper",
								sx: {
									color: "white",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "primary.main" },
								},
								children: "Antonio Alvarez",
							}),
							" ",
							new Date().getFullYear(),
						],
					}),
				],
			})
		);
	},
	useSmoothScroll = () => {
		reactExports.useEffect(() => {
			const o = (i) => {
				if (i.target.tagName === "A") {
					const a = i.target.getAttribute("href").substring(1),
						s = document.getElementById(a);
					s && (i.preventDefault(), window.scrollTo({ top: s.offsetTop - 84, behavior: "smooth" }));
				}
			};
			return (
				document.addEventListener("click", o),
				() => {
					document.removeEventListener("click", o);
				}
			);
		}, []);
	},
	seoData = {
		"/": {
			title: "Dragonball API",
			description:
				"The Dragon Ball API is the Best API REST that provides information about the characters, transformations, power stats, planets, locations, and much more...",
		},
		"/documentation": {
			title: "Documentation",
			description:
				"The Dragon Ball API Documentation is a full guide on how to use the Dragon Ball API and endpoints of the API ",
		},
		"/about": {
			title: "About",
			description:
				"The Dragon Ball API About is a description and motivation of the project and how it was created ",
		},
		"/support": {
			title: "Support us",
			description: "The Dragon Ball API Support is a way of helping the project and mantaining it",
		},
		"/*": {
			title: "404 - Page Not Found",
			description:
				"The Dragon Ball API 404 is a page that tells you that the page you are looking for does not exist",
		},
	},
	SEO = ({ title: o, description: i }) =>
		jsxRuntimeExports.jsxs(Helmet, {
			children: [
				jsxRuntimeExports.jsx("title", { children: o }),
				jsxRuntimeExports.jsx("meta", { name: "description", content: i }),
			],
		}),
	DynamicSEO = () => {
		const o = useLocation(),
			{ title: i, description: a } = seoData[o.pathname] || {};
		return jsxRuntimeExports.jsx(SEO, { title: i, description: a });
	};
function Layout() {
	const o = useScrollTrigger({ threshold: 0 });
	return (
		useSmoothScroll(),
		jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
			children: [
				jsxRuntimeExports.jsx(DynamicSEO, {}),
				jsxRuntimeExports.jsx(Paper$1, {
					component: "header",
					elevation: o ? 4 : 0,
					sx: {
						position: "fixed",
						px: 3,
						top: 0,
						height: 60,
						width: "100%",
						zIndex: 5,
						backgroundColor: "white",
						transition: "box-shadow 0.3s ease",
					},
					children: jsxRuntimeExports.jsx(Nav, {}),
				}),
				jsxRuntimeExports.jsx(Box$1, {
					component: "main",
					sx: { mt: 7 },
					children: jsxRuntimeExports.jsx(Outlet, {}),
				}),
				jsxRuntimeExports.jsx(Footer, {}),
			],
		})
	);
}
var KeyboardDoubleArrowDown = {},
	_interopRequireDefault = interopRequireDefaultExports;
Object.defineProperty(KeyboardDoubleArrowDown, "__esModule", { value: !0 });
var default_1 = (KeyboardDoubleArrowDown.default = void 0),
	_createSvgIcon = _interopRequireDefault(requireCreateSvgIcon()),
	_jsxRuntime = jsxRuntimeExports,
	_default = (0, _createSvgIcon.default)(
		[
			(0, _jsxRuntime.jsx)("path", { d: "M18 6.41 16.59 5 12 9.58 7.41 5 6 6.41l6 6z" }, "0"),
			(0, _jsxRuntime.jsx)("path", { d: "m18 13-1.41-1.41L12 16.17l-4.59-4.58L6 13l6 6z" }, "1"),
		],
		"KeyboardDoubleArrowDown"
	);
default_1 = KeyboardDoubleArrowDown.default = _default;
const CardSmall = ({ character: o }) => {
	const { id: i, name: a, ki: s, maxKi: $, race: j, gender: _e, affiliation: et, image: tt } = o;
	return jsxRuntimeExports.jsx(Grow$1, {
		in: !0,
		timeout: 500,
		children: jsxRuntimeExports.jsxs(Box$1, {
			component: "article",
			sx: {
				width: "280px",
				display: "flex",
				flexDirection: "column",
				background: "rgb(60, 62, 68)",
				borderRadius: "0.5rem",
				margin: "0.75rem",
				cursor: "pointer",
				boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
			},
			onClick: () => {
				window.location.href = `https://dragonball-api.com/api/characters/${i}`;
			},
			children: [
				jsxRuntimeExports.jsx(Box$1, {
					sx: {
						width: "100%",
						position: "relative",
						backgroundImage: 'url("images-compress/89980.webp")',
						backgroundPosition: "center",
						backgroundSize: "cover",
						bgcolor: "white",
						minHeight: "350px",
						maxHeight: "350px",
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
					},
					children: jsxRuntimeExports.jsx(Box$1, {
						sx: {
							position: "absolute",
							top: -20,
							width: "100%",
							height: "100%",
							minHeight: "400px",
							maxHeight: "400px",
							margin: 0,
							objectPosition: "center",
							objectFit: "contain",
							zIndex: 0,
							"&:hover ": { transform: "scale(1.2)" },
							transition: "transform 0.6s ease",
						},
						component: "img",
						src: tt,
						alt: a,
					}),
				}),
				jsxRuntimeExports.jsxs(Box$1, {
					sx: {
						padding: "0.75rem",
						color: "rgb(255, 255, 255)",
						display: "flex",
						flexDirection: "column",
					},
					children: [
						jsxRuntimeExports.jsxs(Box$1, {
							zIndex: 1,
							children: [
								jsxRuntimeExports.jsx(Typography$1, {
									sx: { fontSize: "1.5rem", fontWeight: "800" },
									variant: "h2",
									color: "white",
									children: a,
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									color: "primary.main",
									sx: {
										textTransform: "capitalize",
										whiteSpace: "nowrap",
										textOverflow: "ellipsis",
										overflow: "hidden",
										mb: 2,
										fontWeight: "bold",
									},
									children: [j, " - ", _e],
								}),
							],
						}),
						jsxRuntimeExports.jsxs(Stack$3, {
							direction: "column",
							gap: 1,
							children: [
								jsxRuntimeExports.jsxs(Box$1, {
									children: [
										jsxRuntimeExports.jsx(Typography$1, {
											component: "p",
											sx: { color: "rgb(245, 245, 245)", fontSize: "1rem" },
											lineHeight: 0.5,
											fontWeight: "600",
											children: "Base KI:",
										}),
										jsxRuntimeExports.jsx(Typography$1, {
											component: "span",
											sx: { color: "primary.main", fontWeight: "bold" },
											lineHeight: 0.5,
											children: s,
										}),
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									children: [
										jsxRuntimeExports.jsx(Typography$1, {
											sx: { color: "rgb(245, 245, 245)", fontSize: "1rem" },
											component: "p",
											lineHeight: 0.5,
											fontWeight: "600",
											children: "Total KI:",
										}),
										jsxRuntimeExports.jsx(Typography$1, {
											sx: { color: "primary.main", fontWeight: "bold" },
											component: "span",
											lineHeight: 0.5,
											children: $,
										}),
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									children: [
										jsxRuntimeExports.jsx(Typography$1, {
											component: "p",
											sx: { color: "rgb(245, 245, 245)", fontSize: "1rem" },
											lineHeight: 0.5,
											fontWeight: "600",
											children: "Afilliation:",
										}),
										jsxRuntimeExports.jsx(Typography$1, {
											sx: { color: "primary.main", fontWeight: "bold" },
											lineHeight: 0.5,
											component: "span",
											children: et,
										}),
									],
								}),
							],
						}),
					],
				}),
			],
		}),
	});
};
var Subscribable = (function () {
		function o() {
			this.listeners = [];
		}
		var i = o.prototype;
		return (
			(i.subscribe = function (s) {
				var $ = this,
					j = s || function () {};
				return (
					this.listeners.push(j),
					this.onSubscribe(),
					function () {
						(($.listeners = $.listeners.filter(function (_e) {
							return _e !== j;
						})),
							$.onUnsubscribe());
					}
				);
			}),
			(i.hasListeners = function () {
				return this.listeners.length > 0;
			}),
			(i.onSubscribe = function () {}),
			(i.onUnsubscribe = function () {}),
			o
		);
	})(),
	isServer = typeof window > "u";
function noop() {}
function functionalUpdate(o, i) {
	return typeof o == "function" ? o(i) : o;
}
function isValidTimeout(o) {
	return typeof o == "number" && o >= 0 && o !== 1 / 0;
}
function ensureQueryKeyArray(o) {
	return Array.isArray(o) ? o : [o];
}
function timeUntilStale(o, i) {
	return Math.max(o + (i || 0) - Date.now(), 0);
}
function parseQueryArgs(o, i, a) {
	return isQueryKey(o)
		? typeof i == "function"
			? _extends$9({}, a, { queryKey: o, queryFn: i })
			: _extends$9({}, i, { queryKey: o })
		: o;
}
function parseFilterArgs(o, i, a) {
	return isQueryKey(o) ? [_extends$9({}, i, { queryKey: o }), a] : [o || {}, i];
}
function mapQueryStatusFilter(o, i) {
	if ((o === !0 && i === !0) || (o == null && i == null)) return "all";
	if (o === !1 && i === !1) return "none";
	var a = o ?? !i;
	return a ? "active" : "inactive";
}
function matchQuery(o, i) {
	var a = o.active,
		s = o.exact,
		$ = o.fetching,
		j = o.inactive,
		_e = o.predicate,
		et = o.queryKey,
		tt = o.stale;
	if (isQueryKey(et)) {
		if (s) {
			if (i.queryHash !== hashQueryKeyByOptions(et, i.options)) return !1;
		} else if (!partialMatchKey(i.queryKey, et)) return !1;
	}
	var rt = mapQueryStatusFilter(a, j);
	if (rt === "none") return !1;
	if (rt !== "all") {
		var nt = i.isActive();
		if ((rt === "active" && !nt) || (rt === "inactive" && nt)) return !1;
	}
	return !(
		(typeof tt == "boolean" && i.isStale() !== tt) ||
		(typeof $ == "boolean" && i.isFetching() !== $) ||
		(_e && !_e(i))
	);
}
function matchMutation(o, i) {
	var a = o.exact,
		s = o.fetching,
		$ = o.predicate,
		j = o.mutationKey;
	if (isQueryKey(j)) {
		if (!i.options.mutationKey) return !1;
		if (a) {
			if (hashQueryKey(i.options.mutationKey) !== hashQueryKey(j)) return !1;
		} else if (!partialMatchKey(i.options.mutationKey, j)) return !1;
	}
	return !((typeof s == "boolean" && (i.state.status === "loading") !== s) || ($ && !$(i)));
}
function hashQueryKeyByOptions(o, i) {
	var a = (i == null ? void 0 : i.queryKeyHashFn) || hashQueryKey;
	return a(o);
}
function hashQueryKey(o) {
	var i = ensureQueryKeyArray(o);
	return stableValueHash(i);
}
function stableValueHash(o) {
	return JSON.stringify(o, function (i, a) {
		return isPlainObject(a)
			? Object.keys(a)
					.sort()
					.reduce(function (s, $) {
						return ((s[$] = a[$]), s);
					}, {})
			: a;
	});
}
function partialMatchKey(o, i) {
	return partialDeepEqual(ensureQueryKeyArray(o), ensureQueryKeyArray(i));
}
function partialDeepEqual(o, i) {
	return o === i
		? !0
		: typeof o != typeof i
			? !1
			: o && i && typeof o == "object" && typeof i == "object"
				? !Object.keys(i).some(function (a) {
						return !partialDeepEqual(o[a], i[a]);
					})
				: !1;
}
function replaceEqualDeep(o, i) {
	if (o === i) return o;
	var a = Array.isArray(o) && Array.isArray(i);
	if (a || (isPlainObject(o) && isPlainObject(i))) {
		for (
			var s = a ? o.length : Object.keys(o).length,
				$ = a ? i : Object.keys(i),
				j = $.length,
				_e = a ? [] : {},
				et = 0,
				tt = 0;
			tt < j;
			tt++
		) {
			var rt = a ? tt : $[tt];
			((_e[rt] = replaceEqualDeep(o[rt], i[rt])), _e[rt] === o[rt] && et++);
		}
		return s === j && et === s ? o : _e;
	}
	return i;
}
function shallowEqualObjects(o, i) {
	if ((o && !i) || (i && !o)) return !1;
	for (var a in o) if (o[a] !== i[a]) return !1;
	return !0;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return !1;
	var i = o.constructor;
	if (typeof i > "u") return !0;
	var a = i.prototype;
	return !(!hasObjectPrototype(a) || !a.hasOwnProperty("isPrototypeOf"));
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function isQueryKey(o) {
	return typeof o == "string" || Array.isArray(o);
}
function sleep(o) {
	return new Promise(function (i) {
		setTimeout(i, o);
	});
}
function scheduleMicrotask(o) {
	Promise.resolve()
		.then(o)
		.catch(function (i) {
			return setTimeout(function () {
				throw i;
			});
		});
}
function getAbortController() {
	if (typeof AbortController == "function") return new AbortController();
}
var FocusManager = (function (o) {
		_inheritsLoose(i, o);
		function i() {
			var s;
			return (
				(s = o.call(this) || this),
				(s.setup = function ($) {
					var j;
					if (!isServer && (j = window) != null && j.addEventListener) {
						var _e = function () {
							return $();
						};
						return (
							window.addEventListener("visibilitychange", _e, !1),
							window.addEventListener("focus", _e, !1),
							function () {
								(window.removeEventListener("visibilitychange", _e),
									window.removeEventListener("focus", _e));
							}
						);
					}
				}),
				s
			);
		}
		var a = i.prototype;
		return (
			(a.onSubscribe = function () {
				this.cleanup || this.setEventListener(this.setup);
			}),
			(a.onUnsubscribe = function () {
				if (!this.hasListeners()) {
					var $;
					(($ = this.cleanup) == null || $.call(this), (this.cleanup = void 0));
				}
			}),
			(a.setEventListener = function ($) {
				var j,
					_e = this;
				((this.setup = $),
					(j = this.cleanup) == null || j.call(this),
					(this.cleanup = $(function (et) {
						typeof et == "boolean" ? _e.setFocused(et) : _e.onFocus();
					})));
			}),
			(a.setFocused = function ($) {
				((this.focused = $), $ && this.onFocus());
			}),
			(a.onFocus = function () {
				this.listeners.forEach(function ($) {
					$();
				});
			}),
			(a.isFocused = function () {
				return typeof this.focused == "boolean"
					? this.focused
					: typeof document > "u"
						? !0
						: [void 0, "visible", "prerender"].includes(document.visibilityState);
			}),
			i
		);
	})(Subscribable),
	focusManager = new FocusManager(),
	OnlineManager = (function (o) {
		_inheritsLoose(i, o);
		function i() {
			var s;
			return (
				(s = o.call(this) || this),
				(s.setup = function ($) {
					var j;
					if (!isServer && (j = window) != null && j.addEventListener) {
						var _e = function () {
							return $();
						};
						return (
							window.addEventListener("online", _e, !1),
							window.addEventListener("offline", _e, !1),
							function () {
								(window.removeEventListener("online", _e),
									window.removeEventListener("offline", _e));
							}
						);
					}
				}),
				s
			);
		}
		var a = i.prototype;
		return (
			(a.onSubscribe = function () {
				this.cleanup || this.setEventListener(this.setup);
			}),
			(a.onUnsubscribe = function () {
				if (!this.hasListeners()) {
					var $;
					(($ = this.cleanup) == null || $.call(this), (this.cleanup = void 0));
				}
			}),
			(a.setEventListener = function ($) {
				var j,
					_e = this;
				((this.setup = $),
					(j = this.cleanup) == null || j.call(this),
					(this.cleanup = $(function (et) {
						typeof et == "boolean" ? _e.setOnline(et) : _e.onOnline();
					})));
			}),
			(a.setOnline = function ($) {
				((this.online = $), $ && this.onOnline());
			}),
			(a.onOnline = function () {
				this.listeners.forEach(function ($) {
					$();
				});
			}),
			(a.isOnline = function () {
				return typeof this.online == "boolean"
					? this.online
					: typeof navigator > "u" || typeof navigator.onLine > "u"
						? !0
						: navigator.onLine;
			}),
			i
		);
	})(Subscribable),
	onlineManager = new OnlineManager();
function defaultRetryDelay(o) {
	return Math.min(1e3 * Math.pow(2, o), 3e4);
}
function isCancelable(o) {
	return typeof (o == null ? void 0 : o.cancel) == "function";
}
var CancelledError = function (i) {
	((this.revert = i == null ? void 0 : i.revert), (this.silent = i == null ? void 0 : i.silent));
};
function isCancelledError(o) {
	return o instanceof CancelledError;
}
var Retryer = function (i) {
		var a = this,
			s = !1,
			$,
			j,
			_e,
			et;
		((this.abort = i.abort),
			(this.cancel = function (ot) {
				return $ == null ? void 0 : $(ot);
			}),
			(this.cancelRetry = function () {
				s = !0;
			}),
			(this.continueRetry = function () {
				s = !1;
			}),
			(this.continue = function () {
				return j == null ? void 0 : j();
			}),
			(this.failureCount = 0),
			(this.isPaused = !1),
			(this.isResolved = !1),
			(this.isTransportCancelable = !1),
			(this.promise = new Promise(function (ot, st) {
				((_e = ot), (et = st));
			})));
		var tt = function (st) {
				a.isResolved ||
					((a.isResolved = !0), i.onSuccess == null || i.onSuccess(st), j == null || j(), _e(st));
			},
			rt = function (st) {
				a.isResolved ||
					((a.isResolved = !0), i.onError == null || i.onError(st), j == null || j(), et(st));
			},
			nt = function () {
				return new Promise(function (st) {
					((j = st), (a.isPaused = !0), i.onPause == null || i.onPause());
				}).then(function () {
					((j = void 0), (a.isPaused = !1), i.onContinue == null || i.onContinue());
				});
			},
			it = function ot() {
				if (!a.isResolved) {
					var st;
					try {
						st = i.fn();
					} catch (lt) {
						st = Promise.reject(lt);
					}
					(($ = function (dt) {
						if (
							!a.isResolved &&
							(rt(new CancelledError(dt)), a.abort == null || a.abort(), isCancelable(st))
						)
							try {
								st.cancel();
							} catch {}
					}),
						(a.isTransportCancelable = isCancelable(st)),
						Promise.resolve(st)
							.then(tt)
							.catch(function (lt) {
								var dt, pt;
								if (!a.isResolved) {
									var ct = (dt = i.retry) != null ? dt : 3,
										at = (pt = i.retryDelay) != null ? pt : defaultRetryDelay,
										ft = typeof at == "function" ? at(a.failureCount, lt) : at,
										ut =
											ct === !0 ||
											(typeof ct == "number" && a.failureCount < ct) ||
											(typeof ct == "function" && ct(a.failureCount, lt));
									if (s || !ut) {
										rt(lt);
										return;
									}
									(a.failureCount++,
										i.onFail == null || i.onFail(a.failureCount, lt),
										sleep(ft)
											.then(function () {
												if (!focusManager.isFocused() || !onlineManager.isOnline()) return nt();
											})
											.then(function () {
												s ? rt(lt) : ot();
											}));
								}
							}));
				}
			};
		it();
	},
	NotifyManager = (function () {
		function o() {
			((this.queue = []),
				(this.transactions = 0),
				(this.notifyFn = function (a) {
					a();
				}),
				(this.batchNotifyFn = function (a) {
					a();
				}));
		}
		var i = o.prototype;
		return (
			(i.batch = function (s) {
				var $;
				this.transactions++;
				try {
					$ = s();
				} finally {
					(this.transactions--, this.transactions || this.flush());
				}
				return $;
			}),
			(i.schedule = function (s) {
				var $ = this;
				this.transactions
					? this.queue.push(s)
					: scheduleMicrotask(function () {
							$.notifyFn(s);
						});
			}),
			(i.batchCalls = function (s) {
				var $ = this;
				return function () {
					for (var j = arguments.length, _e = new Array(j), et = 0; et < j; et++)
						_e[et] = arguments[et];
					$.schedule(function () {
						s.apply(void 0, _e);
					});
				};
			}),
			(i.flush = function () {
				var s = this,
					$ = this.queue;
				((this.queue = []),
					$.length &&
						scheduleMicrotask(function () {
							s.batchNotifyFn(function () {
								$.forEach(function (j) {
									s.notifyFn(j);
								});
							});
						}));
			}),
			(i.setNotifyFunction = function (s) {
				this.notifyFn = s;
			}),
			(i.setBatchNotifyFunction = function (s) {
				this.batchNotifyFn = s;
			}),
			o
		);
	})(),
	notifyManager = new NotifyManager(),
	logger$1 = console;
function getLogger() {
	return logger$1;
}
function setLogger(o) {
	logger$1 = o;
}
var Query = (function () {
		function o(a) {
			((this.abortSignalConsumed = !1),
				(this.hadObservers = !1),
				(this.defaultOptions = a.defaultOptions),
				this.setOptions(a.options),
				(this.observers = []),
				(this.cache = a.cache),
				(this.queryKey = a.queryKey),
				(this.queryHash = a.queryHash),
				(this.initialState = a.state || this.getDefaultState(this.options)),
				(this.state = this.initialState),
				(this.meta = a.meta),
				this.scheduleGc());
		}
		var i = o.prototype;
		return (
			(i.setOptions = function (s) {
				var $;
				((this.options = _extends$9({}, this.defaultOptions, s)),
					(this.meta = s == null ? void 0 : s.meta),
					(this.cacheTime = Math.max(
						this.cacheTime || 0,
						($ = this.options.cacheTime) != null ? $ : 5 * 60 * 1e3
					)));
			}),
			(i.setDefaultOptions = function (s) {
				this.defaultOptions = s;
			}),
			(i.scheduleGc = function () {
				var s = this;
				(this.clearGcTimeout(),
					isValidTimeout(this.cacheTime) &&
						(this.gcTimeout = setTimeout(function () {
							s.optionalRemove();
						}, this.cacheTime)));
			}),
			(i.clearGcTimeout = function () {
				this.gcTimeout && (clearTimeout(this.gcTimeout), (this.gcTimeout = void 0));
			}),
			(i.optionalRemove = function () {
				this.observers.length ||
					(this.state.isFetching
						? this.hadObservers && this.scheduleGc()
						: this.cache.remove(this));
			}),
			(i.setData = function (s, $) {
				var j,
					_e,
					et = this.state.data,
					tt = functionalUpdate(s, et);
				return (
					(j = (_e = this.options).isDataEqual) != null && j.call(_e, et, tt)
						? (tt = et)
						: this.options.structuralSharing !== !1 && (tt = replaceEqualDeep(et, tt)),
					this.dispatch({
						data: tt,
						type: "success",
						dataUpdatedAt: $ == null ? void 0 : $.updatedAt,
					}),
					tt
				);
			}),
			(i.setState = function (s, $) {
				this.dispatch({ type: "setState", state: s, setStateOptions: $ });
			}),
			(i.cancel = function (s) {
				var $,
					j = this.promise;
				return (
					($ = this.retryer) == null || $.cancel(s),
					j ? j.then(noop).catch(noop) : Promise.resolve()
				);
			}),
			(i.destroy = function () {
				(this.clearGcTimeout(), this.cancel({ silent: !0 }));
			}),
			(i.reset = function () {
				(this.destroy(), this.setState(this.initialState));
			}),
			(i.isActive = function () {
				return this.observers.some(function (s) {
					return s.options.enabled !== !1;
				});
			}),
			(i.isFetching = function () {
				return this.state.isFetching;
			}),
			(i.isStale = function () {
				return (
					this.state.isInvalidated ||
					!this.state.dataUpdatedAt ||
					this.observers.some(function (s) {
						return s.getCurrentResult().isStale;
					})
				);
			}),
			(i.isStaleByTime = function (s) {
				return (
					s === void 0 && (s = 0),
					this.state.isInvalidated ||
						!this.state.dataUpdatedAt ||
						!timeUntilStale(this.state.dataUpdatedAt, s)
				);
			}),
			(i.onFocus = function () {
				var s,
					$ = this.observers.find(function (j) {
						return j.shouldFetchOnWindowFocus();
					});
				($ && $.refetch(), (s = this.retryer) == null || s.continue());
			}),
			(i.onOnline = function () {
				var s,
					$ = this.observers.find(function (j) {
						return j.shouldFetchOnReconnect();
					});
				($ && $.refetch(), (s = this.retryer) == null || s.continue());
			}),
			(i.addObserver = function (s) {
				this.observers.indexOf(s) === -1 &&
					(this.observers.push(s),
					(this.hadObservers = !0),
					this.clearGcTimeout(),
					this.cache.notify({ type: "observerAdded", query: this, observer: s }));
			}),
			(i.removeObserver = function (s) {
				this.observers.indexOf(s) !== -1 &&
					((this.observers = this.observers.filter(function ($) {
						return $ !== s;
					})),
					this.observers.length ||
						(this.retryer &&
							(this.retryer.isTransportCancelable || this.abortSignalConsumed
								? this.retryer.cancel({ revert: !0 })
								: this.retryer.cancelRetry()),
						this.cacheTime ? this.scheduleGc() : this.cache.remove(this)),
					this.cache.notify({ type: "observerRemoved", query: this, observer: s }));
			}),
			(i.getObserversCount = function () {
				return this.observers.length;
			}),
			(i.invalidate = function () {
				this.state.isInvalidated || this.dispatch({ type: "invalidate" });
			}),
			(i.fetch = function (s, $) {
				var j = this,
					_e,
					et,
					tt;
				if (this.state.isFetching) {
					if (this.state.dataUpdatedAt && $ != null && $.cancelRefetch) this.cancel({ silent: !0 });
					else if (this.promise) {
						var rt;
						return ((rt = this.retryer) == null || rt.continueRetry(), this.promise);
					}
				}
				if ((s && this.setOptions(s), !this.options.queryFn)) {
					var nt = this.observers.find(function (at) {
						return at.options.queryFn;
					});
					nt && this.setOptions(nt.options);
				}
				var it = ensureQueryKeyArray(this.queryKey),
					ot = getAbortController(),
					st = { queryKey: it, pageParam: void 0, meta: this.meta };
				Object.defineProperty(st, "signal", {
					enumerable: !0,
					get: function () {
						if (ot) return ((j.abortSignalConsumed = !0), ot.signal);
					},
				});
				var lt = function () {
						return j.options.queryFn
							? ((j.abortSignalConsumed = !1), j.options.queryFn(st))
							: Promise.reject("Missing queryFn");
					},
					dt = {
						fetchOptions: $,
						options: this.options,
						queryKey: it,
						state: this.state,
						fetchFn: lt,
						meta: this.meta,
					};
				if ((_e = this.options.behavior) != null && _e.onFetch) {
					var pt;
					(pt = this.options.behavior) == null || pt.onFetch(dt);
				}
				if (
					((this.revertState = this.state),
					!this.state.isFetching ||
						this.state.fetchMeta !== ((et = dt.fetchOptions) == null ? void 0 : et.meta))
				) {
					var ct;
					this.dispatch({ type: "fetch", meta: (ct = dt.fetchOptions) == null ? void 0 : ct.meta });
				}
				return (
					(this.retryer = new Retryer({
						fn: dt.fetchFn,
						abort: ot == null || (tt = ot.abort) == null ? void 0 : tt.bind(ot),
						onSuccess: function (ft) {
							(j.setData(ft),
								j.cache.config.onSuccess == null || j.cache.config.onSuccess(ft, j),
								j.cacheTime === 0 && j.optionalRemove());
						},
						onError: function (ft) {
							((isCancelledError(ft) && ft.silent) || j.dispatch({ type: "error", error: ft }),
								isCancelledError(ft) ||
									(j.cache.config.onError == null || j.cache.config.onError(ft, j),
									getLogger().error(ft)),
								j.cacheTime === 0 && j.optionalRemove());
						},
						onFail: function () {
							j.dispatch({ type: "failed" });
						},
						onPause: function () {
							j.dispatch({ type: "pause" });
						},
						onContinue: function () {
							j.dispatch({ type: "continue" });
						},
						retry: dt.options.retry,
						retryDelay: dt.options.retryDelay,
					})),
					(this.promise = this.retryer.promise),
					this.promise
				);
			}),
			(i.dispatch = function (s) {
				var $ = this;
				((this.state = this.reducer(this.state, s)),
					notifyManager.batch(function () {
						($.observers.forEach(function (j) {
							j.onQueryUpdate(s);
						}),
							$.cache.notify({ query: $, type: "queryUpdated", action: s }));
					}));
			}),
			(i.getDefaultState = function (s) {
				var $ = typeof s.initialData == "function" ? s.initialData() : s.initialData,
					j = typeof s.initialData < "u",
					_e = j
						? typeof s.initialDataUpdatedAt == "function"
							? s.initialDataUpdatedAt()
							: s.initialDataUpdatedAt
						: 0,
					et = typeof $ < "u";
				return {
					data: $,
					dataUpdateCount: 0,
					dataUpdatedAt: et ? (_e ?? Date.now()) : 0,
					error: null,
					errorUpdateCount: 0,
					errorUpdatedAt: 0,
					fetchFailureCount: 0,
					fetchMeta: null,
					isFetching: !1,
					isInvalidated: !1,
					isPaused: !1,
					status: et ? "success" : "idle",
				};
			}),
			(i.reducer = function (s, $) {
				var j, _e;
				switch ($.type) {
					case "failed":
						return _extends$9({}, s, { fetchFailureCount: s.fetchFailureCount + 1 });
					case "pause":
						return _extends$9({}, s, { isPaused: !0 });
					case "continue":
						return _extends$9({}, s, { isPaused: !1 });
					case "fetch":
						return _extends$9(
							{},
							s,
							{
								fetchFailureCount: 0,
								fetchMeta: (j = $.meta) != null ? j : null,
								isFetching: !0,
								isPaused: !1,
							},
							!s.dataUpdatedAt && { error: null, status: "loading" }
						);
					case "success":
						return _extends$9({}, s, {
							data: $.data,
							dataUpdateCount: s.dataUpdateCount + 1,
							dataUpdatedAt: (_e = $.dataUpdatedAt) != null ? _e : Date.now(),
							error: null,
							fetchFailureCount: 0,
							isFetching: !1,
							isInvalidated: !1,
							isPaused: !1,
							status: "success",
						});
					case "error":
						var et = $.error;
						return isCancelledError(et) && et.revert && this.revertState
							? _extends$9({}, this.revertState)
							: _extends$9({}, s, {
									error: et,
									errorUpdateCount: s.errorUpdateCount + 1,
									errorUpdatedAt: Date.now(),
									fetchFailureCount: s.fetchFailureCount + 1,
									isFetching: !1,
									isPaused: !1,
									status: "error",
								});
					case "invalidate":
						return _extends$9({}, s, { isInvalidated: !0 });
					case "setState":
						return _extends$9({}, s, $.state);
					default:
						return s;
				}
			}),
			o
		);
	})(),
	QueryCache = (function (o) {
		_inheritsLoose(i, o);
		function i(s) {
			var $;
			return (
				($ = o.call(this) || this), ($.config = s || {}), ($.queries = []), ($.queriesMap = {}), $
			);
		}
		var a = i.prototype;
		return (
			(a.build = function ($, j, _e) {
				var et,
					tt = j.queryKey,
					rt = (et = j.queryHash) != null ? et : hashQueryKeyByOptions(tt, j),
					nt = this.get(rt);
				return (
					nt ||
						((nt = new Query({
							cache: this,
							queryKey: tt,
							queryHash: rt,
							options: $.defaultQueryOptions(j),
							state: _e,
							defaultOptions: $.getQueryDefaults(tt),
							meta: j.meta,
						})),
						this.add(nt)),
					nt
				);
			}),
			(a.add = function ($) {
				this.queriesMap[$.queryHash] ||
					((this.queriesMap[$.queryHash] = $),
					this.queries.push($),
					this.notify({ type: "queryAdded", query: $ }));
			}),
			(a.remove = function ($) {
				var j = this.queriesMap[$.queryHash];
				j &&
					($.destroy(),
					(this.queries = this.queries.filter(function (_e) {
						return _e !== $;
					})),
					j === $ && delete this.queriesMap[$.queryHash],
					this.notify({ type: "queryRemoved", query: $ }));
			}),
			(a.clear = function () {
				var $ = this;
				notifyManager.batch(function () {
					$.queries.forEach(function (j) {
						$.remove(j);
					});
				});
			}),
			(a.get = function ($) {
				return this.queriesMap[$];
			}),
			(a.getAll = function () {
				return this.queries;
			}),
			(a.find = function ($, j) {
				var _e = parseFilterArgs($, j),
					et = _e[0];
				return (
					typeof et.exact > "u" && (et.exact = !0),
					this.queries.find(function (tt) {
						return matchQuery(et, tt);
					})
				);
			}),
			(a.findAll = function ($, j) {
				var _e = parseFilterArgs($, j),
					et = _e[0];
				return Object.keys(et).length > 0
					? this.queries.filter(function (tt) {
							return matchQuery(et, tt);
						})
					: this.queries;
			}),
			(a.notify = function ($) {
				var j = this;
				notifyManager.batch(function () {
					j.listeners.forEach(function (_e) {
						_e($);
					});
				});
			}),
			(a.onFocus = function () {
				var $ = this;
				notifyManager.batch(function () {
					$.queries.forEach(function (j) {
						j.onFocus();
					});
				});
			}),
			(a.onOnline = function () {
				var $ = this;
				notifyManager.batch(function () {
					$.queries.forEach(function (j) {
						j.onOnline();
					});
				});
			}),
			i
		);
	})(Subscribable),
	Mutation = (function () {
		function o(a) {
			((this.options = _extends$9({}, a.defaultOptions, a.options)),
				(this.mutationId = a.mutationId),
				(this.mutationCache = a.mutationCache),
				(this.observers = []),
				(this.state = a.state || getDefaultState()),
				(this.meta = a.meta));
		}
		var i = o.prototype;
		return (
			(i.setState = function (s) {
				this.dispatch({ type: "setState", state: s });
			}),
			(i.addObserver = function (s) {
				this.observers.indexOf(s) === -1 && this.observers.push(s);
			}),
			(i.removeObserver = function (s) {
				this.observers = this.observers.filter(function ($) {
					return $ !== s;
				});
			}),
			(i.cancel = function () {
				return this.retryer
					? (this.retryer.cancel(), this.retryer.promise.then(noop).catch(noop))
					: Promise.resolve();
			}),
			(i.continue = function () {
				return this.retryer ? (this.retryer.continue(), this.retryer.promise) : this.execute();
			}),
			(i.execute = function () {
				var s = this,
					$,
					j = this.state.status === "loading",
					_e = Promise.resolve();
				return (
					j ||
						(this.dispatch({ type: "loading", variables: this.options.variables }),
						(_e = _e
							.then(function () {
								s.mutationCache.config.onMutate == null ||
									s.mutationCache.config.onMutate(s.state.variables, s);
							})
							.then(function () {
								return s.options.onMutate == null ? void 0 : s.options.onMutate(s.state.variables);
							})
							.then(function (et) {
								et !== s.state.context &&
									s.dispatch({ type: "loading", context: et, variables: s.state.variables });
							}))),
					_e
						.then(function () {
							return s.executeMutation();
						})
						.then(function (et) {
							(($ = et),
								s.mutationCache.config.onSuccess == null ||
									s.mutationCache.config.onSuccess($, s.state.variables, s.state.context, s));
						})
						.then(function () {
							return s.options.onSuccess == null
								? void 0
								: s.options.onSuccess($, s.state.variables, s.state.context);
						})
						.then(function () {
							return s.options.onSettled == null
								? void 0
								: s.options.onSettled($, null, s.state.variables, s.state.context);
						})
						.then(function () {
							return (s.dispatch({ type: "success", data: $ }), $);
						})
						.catch(function (et) {
							return (
								s.mutationCache.config.onError == null ||
									s.mutationCache.config.onError(et, s.state.variables, s.state.context, s),
								getLogger().error(et),
								Promise.resolve()
									.then(function () {
										return s.options.onError == null
											? void 0
											: s.options.onError(et, s.state.variables, s.state.context);
									})
									.then(function () {
										return s.options.onSettled == null
											? void 0
											: s.options.onSettled(void 0, et, s.state.variables, s.state.context);
									})
									.then(function () {
										throw (s.dispatch({ type: "error", error: et }), et);
									})
							);
						})
				);
			}),
			(i.executeMutation = function () {
				var s = this,
					$;
				return (
					(this.retryer = new Retryer({
						fn: function () {
							return s.options.mutationFn
								? s.options.mutationFn(s.state.variables)
								: Promise.reject("No mutationFn found");
						},
						onFail: function () {
							s.dispatch({ type: "failed" });
						},
						onPause: function () {
							s.dispatch({ type: "pause" });
						},
						onContinue: function () {
							s.dispatch({ type: "continue" });
						},
						retry: ($ = this.options.retry) != null ? $ : 0,
						retryDelay: this.options.retryDelay,
					})),
					this.retryer.promise
				);
			}),
			(i.dispatch = function (s) {
				var $ = this;
				((this.state = reducer(this.state, s)),
					notifyManager.batch(function () {
						($.observers.forEach(function (j) {
							j.onMutationUpdate(s);
						}),
							$.mutationCache.notify($));
					}));
			}),
			o
		);
	})();
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		isPaused: !1,
		status: "idle",
		variables: void 0,
	};
}
function reducer(o, i) {
	switch (i.type) {
		case "failed":
			return _extends$9({}, o, { failureCount: o.failureCount + 1 });
		case "pause":
			return _extends$9({}, o, { isPaused: !0 });
		case "continue":
			return _extends$9({}, o, { isPaused: !1 });
		case "loading":
			return _extends$9({}, o, {
				context: i.context,
				data: void 0,
				error: null,
				isPaused: !1,
				status: "loading",
				variables: i.variables,
			});
		case "success":
			return _extends$9({}, o, { data: i.data, error: null, status: "success", isPaused: !1 });
		case "error":
			return _extends$9({}, o, {
				data: void 0,
				error: i.error,
				failureCount: o.failureCount + 1,
				isPaused: !1,
				status: "error",
			});
		case "setState":
			return _extends$9({}, o, i.state);
		default:
			return o;
	}
}
var MutationCache = (function (o) {
	_inheritsLoose(i, o);
	function i(s) {
		var $;
		return (
			($ = o.call(this) || this), ($.config = s || {}), ($.mutations = []), ($.mutationId = 0), $
		);
	}
	var a = i.prototype;
	return (
		(a.build = function ($, j, _e) {
			var et = new Mutation({
				mutationCache: this,
				mutationId: ++this.mutationId,
				options: $.defaultMutationOptions(j),
				state: _e,
				defaultOptions: j.mutationKey ? $.getMutationDefaults(j.mutationKey) : void 0,
				meta: j.meta,
			});
			return (this.add(et), et);
		}),
		(a.add = function ($) {
			(this.mutations.push($), this.notify($));
		}),
		(a.remove = function ($) {
			((this.mutations = this.mutations.filter(function (j) {
				return j !== $;
			})),
				$.cancel(),
				this.notify($));
		}),
		(a.clear = function () {
			var $ = this;
			notifyManager.batch(function () {
				$.mutations.forEach(function (j) {
					$.remove(j);
				});
			});
		}),
		(a.getAll = function () {
			return this.mutations;
		}),
		(a.find = function ($) {
			return (
				typeof $.exact > "u" && ($.exact = !0),
				this.mutations.find(function (j) {
					return matchMutation($, j);
				})
			);
		}),
		(a.findAll = function ($) {
			return this.mutations.filter(function (j) {
				return matchMutation($, j);
			});
		}),
		(a.notify = function ($) {
			var j = this;
			notifyManager.batch(function () {
				j.listeners.forEach(function (_e) {
					_e($);
				});
			});
		}),
		(a.onFocus = function () {
			this.resumePausedMutations();
		}),
		(a.onOnline = function () {
			this.resumePausedMutations();
		}),
		(a.resumePausedMutations = function () {
			var $ = this.mutations.filter(function (j) {
				return j.state.isPaused;
			});
			return notifyManager.batch(function () {
				return $.reduce(function (j, _e) {
					return j.then(function () {
						return _e.continue().catch(noop);
					});
				}, Promise.resolve());
			});
		}),
		i
	);
})(Subscribable);
function infiniteQueryBehavior() {
	return {
		onFetch: function (i) {
			i.fetchFn = function () {
				var a,
					s,
					$,
					j,
					_e,
					et,
					tt = (a = i.fetchOptions) == null || (s = a.meta) == null ? void 0 : s.refetchPage,
					rt = ($ = i.fetchOptions) == null || (j = $.meta) == null ? void 0 : j.fetchMore,
					nt = rt == null ? void 0 : rt.pageParam,
					it = (rt == null ? void 0 : rt.direction) === "forward",
					ot = (rt == null ? void 0 : rt.direction) === "backward",
					st = ((_e = i.state.data) == null ? void 0 : _e.pages) || [],
					lt = ((et = i.state.data) == null ? void 0 : et.pageParams) || [],
					dt = getAbortController(),
					pt = dt == null ? void 0 : dt.signal,
					ct = lt,
					at = !1,
					ft =
						i.options.queryFn ||
						function () {
							return Promise.reject("Missing queryFn");
						},
					ut = function (Nt, $t, jt, It) {
						return (
							(ct = It ? [$t].concat(ct) : [].concat(ct, [$t])),
							It ? [jt].concat(Nt) : [].concat(Nt, [jt])
						);
					},
					ht = function (Nt, $t, jt, It) {
						if (at) return Promise.reject("Cancelled");
						if (typeof jt > "u" && !$t && Nt.length) return Promise.resolve(Nt);
						var Ct = { queryKey: i.queryKey, signal: pt, pageParam: jt, meta: i.meta },
							St = ft(Ct),
							kt = Promise.resolve(St).then(function (Wt) {
								return ut(Nt, jt, Wt, It);
							});
						if (isCancelable(St)) {
							var Ut = kt;
							Ut.cancel = St.cancel;
						}
						return kt;
					},
					yt;
				if (!st.length) yt = ht([]);
				else if (it) {
					var mt = typeof nt < "u",
						Et = mt ? nt : getNextPageParam(i.options, st);
					yt = ht(st, mt, Et);
				} else if (ot) {
					var Rt = typeof nt < "u",
						vt = Rt ? nt : getPreviousPageParam(i.options, st);
					yt = ht(st, Rt, vt, !0);
				} else
					(function () {
						ct = [];
						var Dt = typeof i.options.getNextPageParam > "u",
							Nt = tt && st[0] ? tt(st[0], 0, st) : !0;
						yt = Nt ? ht([], Dt, lt[0]) : Promise.resolve(ut([], lt[0], st[0]));
						for (
							var $t = function (Ct) {
									yt = yt.then(function (St) {
										var kt = tt && st[Ct] ? tt(st[Ct], Ct, st) : !0;
										if (kt) {
											var Ut = Dt ? lt[Ct] : getNextPageParam(i.options, St);
											return ht(St, Dt, Ut);
										}
										return Promise.resolve(ut(St, lt[Ct], st[Ct]));
									});
								},
								jt = 1;
							jt < st.length;
							jt++
						)
							$t(jt);
					})();
				var Tt = yt.then(function (Dt) {
						return { pages: Dt, pageParams: ct };
					}),
					Pt = Tt;
				return (
					(Pt.cancel = function () {
						((at = !0), dt == null || dt.abort(), isCancelable(yt) && yt.cancel());
					}),
					Tt
				);
			};
		},
	};
}
function getNextPageParam(o, i) {
	return o.getNextPageParam == null ? void 0 : o.getNextPageParam(i[i.length - 1], i);
}
function getPreviousPageParam(o, i) {
	return o.getPreviousPageParam == null ? void 0 : o.getPreviousPageParam(i[0], i);
}
function hasNextPage(o, i) {
	if (o.getNextPageParam && Array.isArray(i)) {
		var a = getNextPageParam(o, i);
		return typeof a < "u" && a !== null && a !== !1;
	}
}
function hasPreviousPage(o, i) {
	if (o.getPreviousPageParam && Array.isArray(i)) {
		var a = getPreviousPageParam(o, i);
		return typeof a < "u" && a !== null && a !== !1;
	}
}
var QueryClient = (function () {
		function o(a) {
			(a === void 0 && (a = {}),
				(this.queryCache = a.queryCache || new QueryCache()),
				(this.mutationCache = a.mutationCache || new MutationCache()),
				(this.defaultOptions = a.defaultOptions || {}),
				(this.queryDefaults = []),
				(this.mutationDefaults = []));
		}
		var i = o.prototype;
		return (
			(i.mount = function () {
				var s = this;
				((this.unsubscribeFocus = focusManager.subscribe(function () {
					focusManager.isFocused() &&
						onlineManager.isOnline() &&
						(s.mutationCache.onFocus(), s.queryCache.onFocus());
				})),
					(this.unsubscribeOnline = onlineManager.subscribe(function () {
						focusManager.isFocused() &&
							onlineManager.isOnline() &&
							(s.mutationCache.onOnline(), s.queryCache.onOnline());
					})));
			}),
			(i.unmount = function () {
				var s, $;
				((s = this.unsubscribeFocus) == null || s.call(this),
					($ = this.unsubscribeOnline) == null || $.call(this));
			}),
			(i.isFetching = function (s, $) {
				var j = parseFilterArgs(s, $),
					_e = j[0];
				return ((_e.fetching = !0), this.queryCache.findAll(_e).length);
			}),
			(i.isMutating = function (s) {
				return this.mutationCache.findAll(_extends$9({}, s, { fetching: !0 })).length;
			}),
			(i.getQueryData = function (s, $) {
				var j;
				return (j = this.queryCache.find(s, $)) == null ? void 0 : j.state.data;
			}),
			(i.getQueriesData = function (s) {
				return this.getQueryCache()
					.findAll(s)
					.map(function ($) {
						var j = $.queryKey,
							_e = $.state,
							et = _e.data;
						return [j, et];
					});
			}),
			(i.setQueryData = function (s, $, j) {
				var _e = parseQueryArgs(s),
					et = this.defaultQueryOptions(_e);
				return this.queryCache.build(this, et).setData($, j);
			}),
			(i.setQueriesData = function (s, $, j) {
				var _e = this;
				return notifyManager.batch(function () {
					return _e
						.getQueryCache()
						.findAll(s)
						.map(function (et) {
							var tt = et.queryKey;
							return [tt, _e.setQueryData(tt, $, j)];
						});
				});
			}),
			(i.getQueryState = function (s, $) {
				var j;
				return (j = this.queryCache.find(s, $)) == null ? void 0 : j.state;
			}),
			(i.removeQueries = function (s, $) {
				var j = parseFilterArgs(s, $),
					_e = j[0],
					et = this.queryCache;
				notifyManager.batch(function () {
					et.findAll(_e).forEach(function (tt) {
						et.remove(tt);
					});
				});
			}),
			(i.resetQueries = function (s, $, j) {
				var _e = this,
					et = parseFilterArgs(s, $, j),
					tt = et[0],
					rt = et[1],
					nt = this.queryCache,
					it = _extends$9({}, tt, { active: !0 });
				return notifyManager.batch(function () {
					return (
						nt.findAll(tt).forEach(function (ot) {
							ot.reset();
						}),
						_e.refetchQueries(it, rt)
					);
				});
			}),
			(i.cancelQueries = function (s, $, j) {
				var _e = this,
					et = parseFilterArgs(s, $, j),
					tt = et[0],
					rt = et[1],
					nt = rt === void 0 ? {} : rt;
				typeof nt.revert > "u" && (nt.revert = !0);
				var it = notifyManager.batch(function () {
					return _e.queryCache.findAll(tt).map(function (ot) {
						return ot.cancel(nt);
					});
				});
				return Promise.all(it).then(noop).catch(noop);
			}),
			(i.invalidateQueries = function (s, $, j) {
				var _e,
					et,
					tt,
					rt = this,
					nt = parseFilterArgs(s, $, j),
					it = nt[0],
					ot = nt[1],
					st = _extends$9({}, it, {
						active: (_e = (et = it.refetchActive) != null ? et : it.active) != null ? _e : !0,
						inactive: (tt = it.refetchInactive) != null ? tt : !1,
					});
				return notifyManager.batch(function () {
					return (
						rt.queryCache.findAll(it).forEach(function (lt) {
							lt.invalidate();
						}),
						rt.refetchQueries(st, ot)
					);
				});
			}),
			(i.refetchQueries = function (s, $, j) {
				var _e = this,
					et = parseFilterArgs(s, $, j),
					tt = et[0],
					rt = et[1],
					nt = notifyManager.batch(function () {
						return _e.queryCache.findAll(tt).map(function (ot) {
							return ot.fetch(
								void 0,
								_extends$9({}, rt, { meta: { refetchPage: tt == null ? void 0 : tt.refetchPage } })
							);
						});
					}),
					it = Promise.all(nt).then(noop);
				return ((rt != null && rt.throwOnError) || (it = it.catch(noop)), it);
			}),
			(i.fetchQuery = function (s, $, j) {
				var _e = parseQueryArgs(s, $, j),
					et = this.defaultQueryOptions(_e);
				typeof et.retry > "u" && (et.retry = !1);
				var tt = this.queryCache.build(this, et);
				return tt.isStaleByTime(et.staleTime) ? tt.fetch(et) : Promise.resolve(tt.state.data);
			}),
			(i.prefetchQuery = function (s, $, j) {
				return this.fetchQuery(s, $, j).then(noop).catch(noop);
			}),
			(i.fetchInfiniteQuery = function (s, $, j) {
				var _e = parseQueryArgs(s, $, j);
				return ((_e.behavior = infiniteQueryBehavior()), this.fetchQuery(_e));
			}),
			(i.prefetchInfiniteQuery = function (s, $, j) {
				return this.fetchInfiniteQuery(s, $, j).then(noop).catch(noop);
			}),
			(i.cancelMutations = function () {
				var s = this,
					$ = notifyManager.batch(function () {
						return s.mutationCache.getAll().map(function (j) {
							return j.cancel();
						});
					});
				return Promise.all($).then(noop).catch(noop);
			}),
			(i.resumePausedMutations = function () {
				return this.getMutationCache().resumePausedMutations();
			}),
			(i.executeMutation = function (s) {
				return this.mutationCache.build(this, s).execute();
			}),
			(i.getQueryCache = function () {
				return this.queryCache;
			}),
			(i.getMutationCache = function () {
				return this.mutationCache;
			}),
			(i.getDefaultOptions = function () {
				return this.defaultOptions;
			}),
			(i.setDefaultOptions = function (s) {
				this.defaultOptions = s;
			}),
			(i.setQueryDefaults = function (s, $) {
				var j = this.queryDefaults.find(function (_e) {
					return hashQueryKey(s) === hashQueryKey(_e.queryKey);
				});
				j ? (j.defaultOptions = $) : this.queryDefaults.push({ queryKey: s, defaultOptions: $ });
			}),
			(i.getQueryDefaults = function (s) {
				var $;
				return s
					? ($ = this.queryDefaults.find(function (j) {
							return partialMatchKey(s, j.queryKey);
						})) == null
						? void 0
						: $.defaultOptions
					: void 0;
			}),
			(i.setMutationDefaults = function (s, $) {
				var j = this.mutationDefaults.find(function (_e) {
					return hashQueryKey(s) === hashQueryKey(_e.mutationKey);
				});
				j
					? (j.defaultOptions = $)
					: this.mutationDefaults.push({ mutationKey: s, defaultOptions: $ });
			}),
			(i.getMutationDefaults = function (s) {
				var $;
				return s
					? ($ = this.mutationDefaults.find(function (j) {
							return partialMatchKey(s, j.mutationKey);
						})) == null
						? void 0
						: $.defaultOptions
					: void 0;
			}),
			(i.defaultQueryOptions = function (s) {
				if (s != null && s._defaulted) return s;
				var $ = _extends$9(
					{},
					this.defaultOptions.queries,
					this.getQueryDefaults(s == null ? void 0 : s.queryKey),
					s,
					{ _defaulted: !0 }
				);
				return (
					!$.queryHash && $.queryKey && ($.queryHash = hashQueryKeyByOptions($.queryKey, $)), $
				);
			}),
			(i.defaultQueryObserverOptions = function (s) {
				return this.defaultQueryOptions(s);
			}),
			(i.defaultMutationOptions = function (s) {
				return s != null && s._defaulted
					? s
					: _extends$9(
							{},
							this.defaultOptions.mutations,
							this.getMutationDefaults(s == null ? void 0 : s.mutationKey),
							s,
							{ _defaulted: !0 }
						);
			}),
			(i.clear = function () {
				(this.queryCache.clear(), this.mutationCache.clear());
			}),
			o
		);
	})(),
	QueryObserver = (function (o) {
		_inheritsLoose(i, o);
		function i(s, $) {
			var j;
			return (
				(j = o.call(this) || this),
				(j.client = s),
				(j.options = $),
				(j.trackedProps = []),
				(j.selectError = null),
				j.bindMethods(),
				j.setOptions($),
				j
			);
		}
		var a = i.prototype;
		return (
			(a.bindMethods = function () {
				((this.remove = this.remove.bind(this)), (this.refetch = this.refetch.bind(this)));
			}),
			(a.onSubscribe = function () {
				this.listeners.length === 1 &&
					(this.currentQuery.addObserver(this),
					shouldFetchOnMount(this.currentQuery, this.options) && this.executeFetch(),
					this.updateTimers());
			}),
			(a.onUnsubscribe = function () {
				this.listeners.length || this.destroy();
			}),
			(a.shouldFetchOnReconnect = function () {
				return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnReconnect);
			}),
			(a.shouldFetchOnWindowFocus = function () {
				return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
			}),
			(a.destroy = function () {
				((this.listeners = []), this.clearTimers(), this.currentQuery.removeObserver(this));
			}),
			(a.setOptions = function ($, j) {
				var _e = this.options,
					et = this.currentQuery;
				if (
					((this.options = this.client.defaultQueryObserverOptions($)),
					typeof this.options.enabled < "u" && typeof this.options.enabled != "boolean")
				)
					throw new Error("Expected enabled to be a boolean");
				(this.options.queryKey || (this.options.queryKey = _e.queryKey), this.updateQuery());
				var tt = this.hasListeners();
				(tt &&
					shouldFetchOptionally(this.currentQuery, et, this.options, _e) &&
					this.executeFetch(),
					this.updateResult(j),
					tt &&
						(this.currentQuery !== et ||
							this.options.enabled !== _e.enabled ||
							this.options.staleTime !== _e.staleTime) &&
						this.updateStaleTimeout());
				var rt = this.computeRefetchInterval();
				tt &&
					(this.currentQuery !== et ||
						this.options.enabled !== _e.enabled ||
						rt !== this.currentRefetchInterval) &&
					this.updateRefetchInterval(rt);
			}),
			(a.getOptimisticResult = function ($) {
				var j = this.client.defaultQueryObserverOptions($),
					_e = this.client.getQueryCache().build(this.client, j);
				return this.createResult(_e, j);
			}),
			(a.getCurrentResult = function () {
				return this.currentResult;
			}),
			(a.trackResult = function ($, j) {
				var _e = this,
					et = {},
					tt = function (nt) {
						_e.trackedProps.includes(nt) || _e.trackedProps.push(nt);
					};
				return (
					Object.keys($).forEach(function (rt) {
						Object.defineProperty(et, rt, {
							configurable: !1,
							enumerable: !0,
							get: function () {
								return (tt(rt), $[rt]);
							},
						});
					}),
					(j.useErrorBoundary || j.suspense) && tt("error"),
					et
				);
			}),
			(a.getNextResult = function ($) {
				var j = this;
				return new Promise(function (_e, et) {
					var tt = j.subscribe(function (rt) {
						rt.isFetching ||
							(tt(), rt.isError && $ != null && $.throwOnError ? et(rt.error) : _e(rt));
					});
				});
			}),
			(a.getCurrentQuery = function () {
				return this.currentQuery;
			}),
			(a.remove = function () {
				this.client.getQueryCache().remove(this.currentQuery);
			}),
			(a.refetch = function ($) {
				return this.fetch(
					_extends$9({}, $, { meta: { refetchPage: $ == null ? void 0 : $.refetchPage } })
				);
			}),
			(a.fetchOptimistic = function ($) {
				var j = this,
					_e = this.client.defaultQueryObserverOptions($),
					et = this.client.getQueryCache().build(this.client, _e);
				return et.fetch().then(function () {
					return j.createResult(et, _e);
				});
			}),
			(a.fetch = function ($) {
				var j = this;
				return this.executeFetch($).then(function () {
					return (j.updateResult(), j.currentResult);
				});
			}),
			(a.executeFetch = function ($) {
				this.updateQuery();
				var j = this.currentQuery.fetch(this.options, $);
				return (($ != null && $.throwOnError) || (j = j.catch(noop)), j);
			}),
			(a.updateStaleTimeout = function () {
				var $ = this;
				if (
					(this.clearStaleTimeout(),
					!(isServer || this.currentResult.isStale || !isValidTimeout(this.options.staleTime)))
				) {
					var j = timeUntilStale(this.currentResult.dataUpdatedAt, this.options.staleTime),
						_e = j + 1;
					this.staleTimeoutId = setTimeout(function () {
						$.currentResult.isStale || $.updateResult();
					}, _e);
				}
			}),
			(a.computeRefetchInterval = function () {
				var $;
				return typeof this.options.refetchInterval == "function"
					? this.options.refetchInterval(this.currentResult.data, this.currentQuery)
					: ($ = this.options.refetchInterval) != null
						? $
						: !1;
			}),
			(a.updateRefetchInterval = function ($) {
				var j = this;
				(this.clearRefetchInterval(),
					(this.currentRefetchInterval = $),
					!(
						isServer ||
						this.options.enabled === !1 ||
						!isValidTimeout(this.currentRefetchInterval) ||
						this.currentRefetchInterval === 0
					) &&
						(this.refetchIntervalId = setInterval(function () {
							(j.options.refetchIntervalInBackground || focusManager.isFocused()) &&
								j.executeFetch();
						}, this.currentRefetchInterval)));
			}),
			(a.updateTimers = function () {
				(this.updateStaleTimeout(), this.updateRefetchInterval(this.computeRefetchInterval()));
			}),
			(a.clearTimers = function () {
				(this.clearStaleTimeout(), this.clearRefetchInterval());
			}),
			(a.clearStaleTimeout = function () {
				this.staleTimeoutId && (clearTimeout(this.staleTimeoutId), (this.staleTimeoutId = void 0));
			}),
			(a.clearRefetchInterval = function () {
				this.refetchIntervalId &&
					(clearInterval(this.refetchIntervalId), (this.refetchIntervalId = void 0));
			}),
			(a.createResult = function ($, j) {
				var _e = this.currentQuery,
					et = this.options,
					tt = this.currentResult,
					rt = this.currentResultState,
					nt = this.currentResultOptions,
					it = $ !== _e,
					ot = it ? $.state : this.currentQueryInitialState,
					st = it ? this.currentResult : this.previousQueryResult,
					lt = $.state,
					dt = lt.dataUpdatedAt,
					pt = lt.error,
					ct = lt.errorUpdatedAt,
					at = lt.isFetching,
					ft = lt.status,
					ut = !1,
					ht = !1,
					yt;
				if (j.optimisticResults) {
					var mt = this.hasListeners(),
						Et = !mt && shouldFetchOnMount($, j),
						Rt = mt && shouldFetchOptionally($, _e, j, et);
					(Et || Rt) && ((at = !0), dt || (ft = "loading"));
				}
				if (
					j.keepPreviousData &&
					!lt.dataUpdateCount &&
					st != null &&
					st.isSuccess &&
					ft !== "error"
				)
					((yt = st.data), (dt = st.dataUpdatedAt), (ft = st.status), (ut = !0));
				else if (j.select && typeof lt.data < "u")
					if (tt && lt.data === (rt == null ? void 0 : rt.data) && j.select === this.selectFn)
						yt = this.selectResult;
					else
						try {
							((this.selectFn = j.select),
								(yt = j.select(lt.data)),
								j.structuralSharing !== !1 &&
									(yt = replaceEqualDeep(tt == null ? void 0 : tt.data, yt)),
								(this.selectResult = yt),
								(this.selectError = null));
						} catch (Pt) {
							(getLogger().error(Pt), (this.selectError = Pt));
						}
				else yt = lt.data;
				if (
					typeof j.placeholderData < "u" &&
					typeof yt > "u" &&
					(ft === "loading" || ft === "idle")
				) {
					var vt;
					if (
						tt != null &&
						tt.isPlaceholderData &&
						j.placeholderData === (nt == null ? void 0 : nt.placeholderData)
					)
						vt = tt.data;
					else if (
						((vt =
							typeof j.placeholderData == "function" ? j.placeholderData() : j.placeholderData),
						j.select && typeof vt < "u")
					)
						try {
							((vt = j.select(vt)),
								j.structuralSharing !== !1 &&
									(vt = replaceEqualDeep(tt == null ? void 0 : tt.data, vt)),
								(this.selectError = null));
						} catch (Pt) {
							(getLogger().error(Pt), (this.selectError = Pt));
						}
					typeof vt < "u" && ((ft = "success"), (yt = vt), (ht = !0));
				}
				this.selectError &&
					((pt = this.selectError), (yt = this.selectResult), (ct = Date.now()), (ft = "error"));
				var Tt = {
					status: ft,
					isLoading: ft === "loading",
					isSuccess: ft === "success",
					isError: ft === "error",
					isIdle: ft === "idle",
					data: yt,
					dataUpdatedAt: dt,
					error: pt,
					errorUpdatedAt: ct,
					failureCount: lt.fetchFailureCount,
					errorUpdateCount: lt.errorUpdateCount,
					isFetched: lt.dataUpdateCount > 0 || lt.errorUpdateCount > 0,
					isFetchedAfterMount:
						lt.dataUpdateCount > ot.dataUpdateCount || lt.errorUpdateCount > ot.errorUpdateCount,
					isFetching: at,
					isRefetching: at && ft !== "loading",
					isLoadingError: ft === "error" && lt.dataUpdatedAt === 0,
					isPlaceholderData: ht,
					isPreviousData: ut,
					isRefetchError: ft === "error" && lt.dataUpdatedAt !== 0,
					isStale: isStale($, j),
					refetch: this.refetch,
					remove: this.remove,
				};
				return Tt;
			}),
			(a.shouldNotifyListeners = function ($, j) {
				if (!j) return !0;
				var _e = this.options,
					et = _e.notifyOnChangeProps,
					tt = _e.notifyOnChangePropsExclusions;
				if ((!et && !tt) || (et === "tracked" && !this.trackedProps.length)) return !0;
				var rt = et === "tracked" ? this.trackedProps : et;
				return Object.keys($).some(function (nt) {
					var it = nt,
						ot = $[it] !== j[it],
						st =
							rt == null
								? void 0
								: rt.some(function (dt) {
										return dt === nt;
									}),
						lt =
							tt == null
								? void 0
								: tt.some(function (dt) {
										return dt === nt;
									});
					return ot && !lt && (!rt || st);
				});
			}),
			(a.updateResult = function ($) {
				var j = this.currentResult;
				if (
					((this.currentResult = this.createResult(this.currentQuery, this.options)),
					(this.currentResultState = this.currentQuery.state),
					(this.currentResultOptions = this.options),
					!shallowEqualObjects(this.currentResult, j))
				) {
					var _e = { cache: !0 };
					(($ == null ? void 0 : $.listeners) !== !1 &&
						this.shouldNotifyListeners(this.currentResult, j) &&
						(_e.listeners = !0),
						this.notify(_extends$9({}, _e, $)));
				}
			}),
			(a.updateQuery = function () {
				var $ = this.client.getQueryCache().build(this.client, this.options);
				if ($ !== this.currentQuery) {
					var j = this.currentQuery;
					((this.currentQuery = $),
						(this.currentQueryInitialState = $.state),
						(this.previousQueryResult = this.currentResult),
						this.hasListeners() && (j == null || j.removeObserver(this), $.addObserver(this)));
				}
			}),
			(a.onQueryUpdate = function ($) {
				var j = {};
				($.type === "success"
					? (j.onSuccess = !0)
					: $.type === "error" && !isCancelledError($.error) && (j.onError = !0),
					this.updateResult(j),
					this.hasListeners() && this.updateTimers());
			}),
			(a.notify = function ($) {
				var j = this;
				notifyManager.batch(function () {
					($.onSuccess
						? (j.options.onSuccess == null || j.options.onSuccess(j.currentResult.data),
							j.options.onSettled == null || j.options.onSettled(j.currentResult.data, null))
						: $.onError &&
							(j.options.onError == null || j.options.onError(j.currentResult.error),
							j.options.onSettled == null || j.options.onSettled(void 0, j.currentResult.error)),
						$.listeners &&
							j.listeners.forEach(function (_e) {
								_e(j.currentResult);
							}),
						$.cache &&
							j.client
								.getQueryCache()
								.notify({ query: j.currentQuery, type: "observerResultsUpdated" }));
				});
			}),
			i
		);
	})(Subscribable);
function shouldLoadOnMount(o, i) {
	return (
		i.enabled !== !1 &&
		!o.state.dataUpdatedAt &&
		!(o.state.status === "error" && i.retryOnMount === !1)
	);
}
function shouldFetchOnMount(o, i) {
	return (
		shouldLoadOnMount(o, i) || (o.state.dataUpdatedAt > 0 && shouldFetchOn(o, i, i.refetchOnMount))
	);
}
function shouldFetchOn(o, i, a) {
	if (i.enabled !== !1) {
		var s = typeof a == "function" ? a(o) : a;
		return s === "always" || (s !== !1 && isStale(o, i));
	}
	return !1;
}
function shouldFetchOptionally(o, i, a, s) {
	return (
		a.enabled !== !1 &&
		(o !== i || s.enabled === !1) &&
		(!a.suspense || o.state.status !== "error") &&
		isStale(o, a)
	);
}
function isStale(o, i) {
	return o.isStaleByTime(i.staleTime);
}
var InfiniteQueryObserver = (function (o) {
		_inheritsLoose(i, o);
		function i(s, $) {
			return o.call(this, s, $) || this;
		}
		var a = i.prototype;
		return (
			(a.bindMethods = function () {
				(o.prototype.bindMethods.call(this),
					(this.fetchNextPage = this.fetchNextPage.bind(this)),
					(this.fetchPreviousPage = this.fetchPreviousPage.bind(this)));
			}),
			(a.setOptions = function ($, j) {
				o.prototype.setOptions.call(
					this,
					_extends$9({}, $, { behavior: infiniteQueryBehavior() }),
					j
				);
			}),
			(a.getOptimisticResult = function ($) {
				return (
					($.behavior = infiniteQueryBehavior()), o.prototype.getOptimisticResult.call(this, $)
				);
			}),
			(a.fetchNextPage = function ($) {
				var j;
				return this.fetch({
					cancelRefetch: (j = $ == null ? void 0 : $.cancelRefetch) != null ? j : !0,
					throwOnError: $ == null ? void 0 : $.throwOnError,
					meta: {
						fetchMore: { direction: "forward", pageParam: $ == null ? void 0 : $.pageParam },
					},
				});
			}),
			(a.fetchPreviousPage = function ($) {
				var j;
				return this.fetch({
					cancelRefetch: (j = $ == null ? void 0 : $.cancelRefetch) != null ? j : !0,
					throwOnError: $ == null ? void 0 : $.throwOnError,
					meta: {
						fetchMore: { direction: "backward", pageParam: $ == null ? void 0 : $.pageParam },
					},
				});
			}),
			(a.createResult = function ($, j) {
				var _e,
					et,
					tt,
					rt,
					nt,
					it,
					ot = $.state,
					st = o.prototype.createResult.call(this, $, j);
				return _extends$9({}, st, {
					fetchNextPage: this.fetchNextPage,
					fetchPreviousPage: this.fetchPreviousPage,
					hasNextPage: hasNextPage(j, (_e = ot.data) == null ? void 0 : _e.pages),
					hasPreviousPage: hasPreviousPage(j, (et = ot.data) == null ? void 0 : et.pages),
					isFetchingNextPage:
						ot.isFetching &&
						((tt = ot.fetchMeta) == null || (rt = tt.fetchMore) == null ? void 0 : rt.direction) ===
							"forward",
					isFetchingPreviousPage:
						ot.isFetching &&
						((nt = ot.fetchMeta) == null || (it = nt.fetchMore) == null ? void 0 : it.direction) ===
							"backward",
				});
			}),
			i
		);
	})(QueryObserver),
	unstable_batchedUpdates = ReactDOM.unstable_batchedUpdates;
notifyManager.setBatchNotifyFunction(unstable_batchedUpdates);
var logger = console;
setLogger(logger);
var defaultContext = React.createContext(void 0),
	QueryClientSharingContext = React.createContext(!1);
function getQueryClientContext(o) {
	return o && typeof window < "u"
		? (window.ReactQueryClientContext || (window.ReactQueryClientContext = defaultContext),
			window.ReactQueryClientContext)
		: defaultContext;
}
var useQueryClient = function () {
		var i = React.useContext(getQueryClientContext(React.useContext(QueryClientSharingContext)));
		if (!i) throw new Error("No QueryClient set, use QueryClientProvider to set one");
		return i;
	},
	QueryClientProvider = function (i) {
		var a = i.client,
			s = i.contextSharing,
			$ = s === void 0 ? !1 : s,
			j = i.children;
		React.useEffect(
			function () {
				return (
					a.mount(),
					function () {
						a.unmount();
					}
				);
			},
			[a]
		);
		var _e = getQueryClientContext($);
		return React.createElement(
			QueryClientSharingContext.Provider,
			{ value: $ },
			React.createElement(_e.Provider, { value: a }, j)
		);
	};
function createValue() {
	var o = !1;
	return {
		clearReset: function () {
			o = !1;
		},
		reset: function () {
			o = !0;
		},
		isReset: function () {
			return o;
		},
	};
}
var QueryErrorResetBoundaryContext = React.createContext(createValue()),
	useQueryErrorResetBoundary = function () {
		return React.useContext(QueryErrorResetBoundaryContext);
	};
function shouldThrowError(o, i, a) {
	return typeof i == "function" ? i.apply(void 0, a) : typeof i == "boolean" ? i : !!o;
}
function useBaseQuery(o, i) {
	var a = React.useRef(!1),
		s = React.useState(0),
		$ = s[1],
		j = useQueryClient(),
		_e = useQueryErrorResetBoundary(),
		et = j.defaultQueryObserverOptions(o);
	((et.optimisticResults = !0),
		et.onError && (et.onError = notifyManager.batchCalls(et.onError)),
		et.onSuccess && (et.onSuccess = notifyManager.batchCalls(et.onSuccess)),
		et.onSettled && (et.onSettled = notifyManager.batchCalls(et.onSettled)),
		et.suspense &&
			(typeof et.staleTime != "number" && (et.staleTime = 1e3),
			et.cacheTime === 0 && (et.cacheTime = 1)),
		(et.suspense || et.useErrorBoundary) && (_e.isReset() || (et.retryOnMount = !1)));
	var tt = React.useState(function () {
			return new i(j, et);
		}),
		rt = tt[0],
		nt = rt.getOptimisticResult(et);
	if (
		(React.useEffect(
			function () {
				((a.current = !0), _e.clearReset());
				var it = rt.subscribe(
					notifyManager.batchCalls(function () {
						a.current &&
							$(function (ot) {
								return ot + 1;
							});
					})
				);
				return (
					rt.updateResult(),
					function () {
						((a.current = !1), it());
					}
				);
			},
			[_e, rt]
		),
		React.useEffect(
			function () {
				rt.setOptions(et, { listeners: !1 });
			},
			[et, rt]
		),
		et.suspense && nt.isLoading)
	)
		throw rt
			.fetchOptimistic(et)
			.then(function (it) {
				var ot = it.data;
				(et.onSuccess == null || et.onSuccess(ot), et.onSettled == null || et.onSettled(ot, null));
			})
			.catch(function (it) {
				(_e.clearReset(),
					et.onError == null || et.onError(it),
					et.onSettled == null || et.onSettled(void 0, it));
			});
	if (
		nt.isError &&
		!_e.isReset() &&
		!nt.isFetching &&
		shouldThrowError(et.suspense, et.useErrorBoundary, [nt.error, rt.getCurrentQuery()])
	)
		throw nt.error;
	return (et.notifyOnChangeProps === "tracked" && (nt = rt.trackResult(nt, et)), nt);
}
function useInfiniteQuery(o, i, a) {
	var s = parseQueryArgs(o, i, a);
	return useBaseQuery(s, InfiniteQueryObserver);
}
const apiUrl = {
	pagination: "https://dragonball-api.com/api/characters?page=2&limit=5",
	links: [],
	singleCharacter: "https://dragonball-api.com/api/characters/1",
	singleCharacterNoTransformation: "https://dragonball-api.com/api/characters/4",
	allCharacters: "https://dragonball-api.com/api/characters",
	filterCharacter: "https://dragonball-api.com/api/characters?race=Saiyan&affiliation=Z fighter",
	singlePlanet: "https://dragonball-api.com/api/planets/1",
	singlePlanetNoCharacter: "https://dragonball-api.com/api/planets/7",
	allPlanets: "https://dragonball-api.com/api/planets",
	filterPlanets: "https://dragonball-api.com/api/planets?isDestroyed=true",
};
async function fetchCharacters(o) {
	return await (await fetch(`https://dragonball-api.com/api/characters?limit=4&page=${o}`)).json();
}
var observerMap = new Map(),
	RootIds = new WeakMap(),
	rootId = 0,
	unsupportedValue = void 0;
function getRootId(o) {
	return o
		? (RootIds.has(o) || ((rootId += 1), RootIds.set(o, rootId.toString())), RootIds.get(o))
		: "0";
}
function optionsToId(o) {
	return Object.keys(o)
		.sort()
		.filter((i) => o[i] !== void 0)
		.map((i) => `${i}_${i === "root" ? getRootId(o.root) : o[i]}`)
		.toString();
}
function createObserver(o) {
	let i = optionsToId(o),
		a = observerMap.get(i);
	if (!a) {
		const s = new Map();
		let $;
		const j = new IntersectionObserver((_e) => {
			_e.forEach((et) => {
				var tt;
				const rt = et.isIntersecting && $.some((nt) => et.intersectionRatio >= nt);
				(o.trackVisibility && typeof et.isVisible > "u" && (et.isVisible = rt),
					(tt = s.get(et.target)) == null ||
						tt.forEach((nt) => {
							nt(rt, et);
						}));
			});
		}, o);
		(($ = j.thresholds || (Array.isArray(o.threshold) ? o.threshold : [o.threshold || 0])),
			(a = { id: i, observer: j, elements: s }),
			observerMap.set(i, a));
	}
	return a;
}
function observe(o, i, a = {}, s = unsupportedValue) {
	if (typeof window.IntersectionObserver > "u" && s !== void 0) {
		const tt = o.getBoundingClientRect();
		return (
			i(s, {
				isIntersecting: s,
				target: o,
				intersectionRatio: typeof a.threshold == "number" ? a.threshold : 0,
				time: 0,
				boundingClientRect: tt,
				intersectionRect: tt,
				rootBounds: tt,
			}),
			() => {}
		);
	}
	const { id: $, observer: j, elements: _e } = createObserver(a);
	let et = _e.get(o) || [];
	return (
		_e.has(o) || _e.set(o, et),
		et.push(i),
		j.observe(o),
		function () {
			(et.splice(et.indexOf(i), 1),
				et.length === 0 && (_e.delete(o), j.unobserve(o)),
				_e.size === 0 && (j.disconnect(), observerMap.delete($)));
		}
	);
}
function useInView({
	threshold: o,
	delay: i,
	trackVisibility: a,
	rootMargin: s,
	root: $,
	triggerOnce: j,
	skip: _e,
	initialInView: et,
	fallbackInView: tt,
	onChange: rt,
} = {}) {
	var nt;
	const [it, ot] = reactExports.useState(null),
		st = reactExports.useRef(),
		[lt, dt] = reactExports.useState({ inView: !!et, entry: void 0 });
	((st.current = rt),
		reactExports.useEffect(() => {
			if (_e || !it) return;
			let ft;
			return (
				(ft = observe(
					it,
					(ut, ht) => {
						(dt({ inView: ut, entry: ht }),
							st.current && st.current(ut, ht),
							ht.isIntersecting && j && ft && (ft(), (ft = void 0)));
					},
					{ root: $, rootMargin: s, threshold: o, trackVisibility: a, delay: i },
					tt
				)),
				() => {
					ft && ft();
				}
			);
		}, [Array.isArray(o) ? o.toString() : o, it, $, s, j, _e, a, tt, i]));
	const pt = (nt = lt.entry) == null ? void 0 : nt.target,
		ct = reactExports.useRef();
	!it &&
		pt &&
		!j &&
		!_e &&
		ct.current !== pt &&
		((ct.current = pt), dt({ inView: !!et, entry: void 0 }));
	const at = [ot, lt.inView, lt.entry];
	return ((at.ref = at[0]), (at.inView = at[1]), (at.entry = at[2]), at);
}
const Home = () => {
		const [o, i] = useInView(),
			a = useScrollTrigger({ threshold: 300 }),
			{
				data: s,
				fetchNextPage: $,
				hasNextPage: j,
				isError: _e,
				error: et,
				isFetchingNextPage: tt,
			} = useInfiniteQuery({
				queryKey: "characters",
				queryFn: ({ pageParam: rt = 1 }) => fetchCharacters(rt),
				getNextPageParam: (rt, nt) =>
					rt.meta.currentPage < rt.meta.totalPages ? rt.meta.currentPage + 1 : void 0,
			});
		return (
			reactExports.useEffect(() => {
				i && j && a && $();
			}, [i, j, $, a]),
			_e
				? jsxRuntimeExports.jsxs("div", { children: ["Error: ", et.message] })
				: jsxRuntimeExports.jsxs(Box$1, {
						sx: { minHeight: "calc(100vh - 422.7px)", background: "rgb(39, 43, 51)" },
						children: [
							jsxRuntimeExports.jsxs(Box$1, {
								sx: {
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									px: 2,
									py: { xs: 2, sm: 8 },
								},
								children: [
									jsxRuntimeExports.jsx(Box$1, {
										component: "img",
										src: "/images-compress/logo_dragonballapi.webp",
										alt: "logo dragonball api",
										sx: {
											width: "100%",
											objectFit: "contain",
											maxHeight: "780px",
											maxWidth: { xs: "600px", sm: "780px" },
										},
									}),
									jsxRuntimeExports.jsx(Typography$1, {
										variant: "h1",
										sx: { fontSize: { xs: 21, sm: 40 } },
										component: "h1",
										color: "primary",
										fontWeight: "900",
										fontFamily: "tahoma",
										children: "The Dragon Ball API",
									}),
								],
							}),
							jsxRuntimeExports.jsx(Box$1, {
								sx: {
									display: "grid",
									p: 2,
									gap: 4,
									mx: "auto",
									maxWidth: "1400px",
									placeContent: "center",
									placeItems: "center",
									gridTemplateColumns: {
										xs: "repeat(1, 1fr)",
										sm: "repeat(2, 1fr)",
										md: "repeat(3, 1fr)",
										lg: "repeat(4, 1fr)",
									},
								},
								children:
									s == null
										? void 0
										: s.pages.map((rt, nt) =>
												jsxRuntimeExports.jsx(
													reactExports.Fragment,
													{
														children: rt.items.map((it) =>
															jsxRuntimeExports.jsx(CardSmall, { character: it }, it.id)
														),
													},
													nt
												)
											),
							}),
							jsxRuntimeExports.jsxs(Box$1, {
								ref: o,
								sx: {
									height: 80,
									width: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
								},
								children: [
									j &&
										s &&
										jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "h6",
													component: "p",
													color: "secondary.light",
													children: "Scroll Down for more characters",
												}),
												jsxRuntimeExports.jsx(Box$1, {
													sx: {
														animation: "bounce 1.5s infinite  ",
														"@keyframes bounce": {
															"0%, 100%": { transform: "translateY(0)" },
															"50%": { transform: "translateY(10px)" },
														},
													},
													children: jsxRuntimeExports.jsx(default_1, {
														sx: { color: "secondary.light" },
													}),
												}),
											],
										}),
									tt && jsxRuntimeExports.jsx(CircularProgress$1, { size: 50 }),
								],
							}),
						],
					})
		);
	},
	About = () =>
		jsxRuntimeExports.jsx(Container$1, {
			maxWidth: "md",
			sx: { color: "text.secondary", mt: 12, pb: 10 },
			children: jsxRuntimeExports.jsxs(Box$1, {
				component: "article",
				children: [
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h2",
						component: "h1",
						color: "initial",
						fontWeight: "900",
						mb: 6,
						children: "About",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h5",
						color: "initial",
						fontWeight: "900",
						mb: 1,
						children: "What is this?",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 2,
						children:
							'The Dragon Ball API is a comprehensive REST API inspired by the iconic television series Dragon Ball. This API grants users access to an extensive database featuring hundreds of characters, images, transformations, and planets from the Dragon Ball universe. It encompasses canonical information derived from various series, including Dragon Ball Z, Dragon Ball GT, Dragon Ball Super, as well as films, and a touch of Dragon Ball Heroes."',
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						component: Link,
						to: "https://web.dragonball-api.com/documentation",
						sx: {
							color: "initial",
							pb: 0.5,
							borderBottom: "2px solid #9c27b0 ",
							textDecoration: "none",
							"&:hover": { color: "secondary.main" },
						},
						children: "Check out the documentation to get started.",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h5",
						color: "initial",
						fontWeight: "900",
						mt: 6,
						mb: 1,
						children: "Who are you?",
					}),
					jsxRuntimeExports.jsxs(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 2,
						children: [
							`"I'm`,
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://antonioalvarez.dev/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Antonio Alvarez",
							}),
							" ",
							", a guy who loves to develop things. I studied at",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://www.releevant.com",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Relevant",
							}),
							" ",
							'in the Polo de Contenidos Digitales in Malaga, and I have a deep passion for Dragon Ball."',
						],
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h5",
						color: "initial",
						fontWeight: "900",
						mt: 6,
						mb: 1,
						children: "Why did you build this?",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 2,
						children:
							"Well, my passion for Dragon Ball and the desire to assist fellow students led me to develop this resource. As a student myself, I understand the challenges we face, and I wanted to contribute something valuable to make the learning journey more enjoyable. This project is my way of combining my love for Dragon Ball with a commitment to supporting students by providing a helpful tool. It's a personalized initiative to make learning and exploring the Dragon Ball universe a bit more exciting and educational for everyone involved.",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h5",
						color: "initial",
						fontWeight: "900",
						mt: 6,
						mb: 1,
						children: "Technical stuff?",
					}),
					jsxRuntimeExports.jsxs(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 2,
						children: [
							"The Dragon Ball API is developed using",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://nestjs.com/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "NestJS",
							}),
							" ",
							", which is built on the",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://expressjs.com/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Express",
							}),
							" ",
							"engine. NestJS is a powerful and strongly-typed Typescript framework that provides a robust structure for building scalable web applications. It utilizes MySQL as the database for storing information and leverages the",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://cloudinary.com/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Cloudinary",
							}),
							" ",
							"API for handling images. The entire application is hosted on an",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://aws.amazon.com/es/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "AWS EC2 instance",
							}),
							" ",
							", taking advantage of its scalability and cloud services.",
							jsxRuntimeExports.jsx("br", {}),
							jsxRuntimeExports.jsx("br", {}),
							"Continuous Integration/Continuous Deployment (CI/CD) is managed through a",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://github.com/features/actions",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "GitHub Actions",
							}),
							" ",
							"runner, also configured on AWS to ensure smooth and efficient code integration. This setup ensures that any changes made in the",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://github.com/intentodepirata/api-dragonball",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "GitHub repository",
							}),
							" ",
							"are automatically reflected in the AWS instance, keeping the application always up-to-date and running.",
							jsxRuntimeExports.jsx("br", {}),
							jsxRuntimeExports.jsx("br", {}),
							"As for the web interface, it's built on",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://vitejs.dev/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Vite",
							}),
							" ",
							",",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://react.dev/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "React",
							}),
							" ",
							"with",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://mui.com/material-ui/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Material-UI",
							}),
							" ",
							"for an appealing design and an intuitive user experience. The web application is hosted on",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://www.netlify.com/",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "Netlify",
							}),
							" ",
							", providing fast and easy deployments, as well as straightforward hosting and domain management. This combination of technologies offers a solid and efficient environment for both development and the end-user experience.",
						],
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h5",
						color: "initial",
						fontWeight: "900",
						mt: 6,
						mb: 1,
						children: "Copyright?",
					}),
					jsxRuntimeExports.jsxs(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 2,
						children: [
							"All Dragon Ball characters, images, and related content featured in this project are the intellectual property of their respective creators, Akira Toriyama and Toei Animation. We acknowledge and respect their creative work. This project is a fan-created initiative and is not intended for commercial purposes. No copyright infringement is intended, and all rights to Dragon Ball belong to its rightful owners.",
							jsxRuntimeExports.jsx("br", {}),
							jsxRuntimeExports.jsx("br", {}),
							"This project is open source and welcomes contributions from the community. You can find the source code on",
							" ",
							jsxRuntimeExports.jsx(Typography$1, {
								component: Link,
								to: "https://github.com/intentodepirata/api-dragonball",
								target: "_blank",
								sx: {
									color: "initial",
									pb: 0.5,
									borderBottom: "2px solid #9c27b0 ",
									textDecoration: "none",
									"&:hover": { color: "secondary.main" },
								},
								children: "this link",
							}),
							" ",
							". Feel free to explore, contribute, and enhance the project as we collectively celebrate our love for Dragon Ball. Please check the project's license for more details on usage and distribution.",
						],
					}),
				],
			}),
		}),
	Support = () =>
		jsxRuntimeExports.jsx(Container$1, {
			maxWidth: "md",
			sx: { color: "text.secondary", pt: 12, pb: 10, minHeight: "calc(100vh - 422.7px)" },
			children: jsxRuntimeExports.jsxs(Box$1, {
				component: "article",
				children: [
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "h2",
						component: "h1",
						color: "initial",
						fontWeight: "900",
						mb: 2,
						children: "Support The Dragon Ball API",
					}),
					jsxRuntimeExports.jsx(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 4,
						fontWeight: "600",
						children: "Help to maintain The Dragon Ball API's infrastructure!",
					}),
					jsxRuntimeExports.jsxs(Typography$1, {
						variant: "body1",
						color: "inherit",
						mb: 4,
						children: [
							"If you find value in using this API for your applications, online tutorials, or coding challenges, kindly consider supporting us to sustain and maintain the project.",
							jsxRuntimeExports.jsx("br", {}),
							jsxRuntimeExports.jsx("br", {}),
							"This project is a labor of love, and we don't generate revenue from it. We invest our free time to ensure the API runs smoothly and the data stays current. Your contributions, regardless of size, play a crucial role in securing the future of this project.",
							jsxRuntimeExports.jsx("br", {}),
							jsxRuntimeExports.jsx("br", {}),
							"Thank you for your support!",
						],
					}),
					jsxRuntimeExports.jsx(Link, {
						to: "https://ko-fi.com/dragonballapi",
						target: "_blank",
						children: jsxRuntimeExports.jsx(Box$1, {
							component: "img",
							src: "images-compress/support.webp",
						}),
					}),
				],
			}),
		}),
	NotFound = () =>
		jsxRuntimeExports.jsx(Box$1, {
			sx: {
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "calc(100vh - 420px)",
			},
			children: jsxRuntimeExports.jsx(Box$1, {
				component: "img",
				src: "/images-compress/404-imagen.webp",
				alt: "imagen pagina no encontrada",
				sx: { width: "100%", objectFit: "contain", maxWidth: "900px", maxHeight: "900px" },
			}),
		}),
	NavBar = ({ setOpen: o, isOpen: i, matches: a }) =>
		jsxRuntimeExports.jsx(Box$1, {
			component: "aside",
			sx: {
				transform: i | a ? "translateX(0)" : "translateX(-100%)",
				width: i | a ? "300px" : " 0px",
				transition: "all 0.3s ease",
				zIndex: 4,
			},
			children: jsxRuntimeExports.jsxs(Box$1, {
				sx: {
					display: "flex",
					flexDirection: "column",
					gap: 2,
					p: 3,
					position: "sticky",
					top: "60px",
					height: "calc(100vh - 60px)",
					opacity: 1,
					transform: i | a ? "translateX(0)" : "translateX(-100%)",
					width: i | a ? "300px" : " 0px",
					overflowY: "auto",
					borderRight: i ? "none" : "1px solid rgba(46, 41, 51, 0.08)",
					backgroundColor: "white",
					color: "text.primary",
					transition: "all 0.3s ease",
					"&::-webkit-scrollbar": { display: "none" },
				},
				children: [
					jsxRuntimeExports.jsxs(Box$1, {
						mt: 2,
						children: [
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#introduction",
								variant: "h5",
								color: "initial",
								fontWeight: "700",
								mb: 1,
								onClick: () => o(!1),
								children: "Introduction",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#swagger",
								variant: "body1",
								onClick: () => o(!1),
								children: "Swagger docs",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#routes",
								variant: "body1",
								onClick: () => o(!1),
								children: "Routes",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#response",
								variant: "body1",
								onClick: () => o(!1),
								children: "Response",
							}),
						],
					}),
					jsxRuntimeExports.jsxs(Box$1, {
						mt: 4,
						children: [
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#pagination",
								variant: "h5",
								color: "initial",
								fontWeight: "700",
								mb: 1,
								onClick: () => o(!1),
								children: "Pagination",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#info",
								variant: "body1",
								onClick: () => o(!1),
								children: "Info and pagination",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#pagelimit",
								variant: "body1",
								onClick: () => o(!1),
								children: "Page and limit",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#links",
								variant: "body1",
								onClick: () => o(!1),
								children: "Links for navigation",
							}),
						],
					}),
					jsxRuntimeExports.jsxs(Box$1, {
						mt: 4,
						children: [
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#character",
								variant: "h5",
								color: "initial",
								fontWeight: "bold",
								mb: 1,
								onClick: () => o(!1),
								children: "Characters",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#charactersall",
								variant: "body1",
								onClick: () => o(!1),
								children: "Get all characters",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#singlecharacter",
								variant: "body1",
								onClick: () => o(!1),
								children: "Get single character",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#filtercharacter",
								variant: "body1",
								onClick: () => o(!1),
								children: "Filter characters",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#transformation",
								variant: "body1",
								onClick: () => o(!1),
								children: "Transformations",
							}),
						],
					}),
					jsxRuntimeExports.jsxs(Box$1, {
						mt: 4,
						children: [
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#planet",
								variant: "h5",
								color: "initial",
								fontWeight: "bold",
								mb: 1,
								onClick: () => o(!1),
								children: "Planets",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#allplanets",
								variant: "body1",
								onClick: () => o(!1),
								children: "Get all planets",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#singleplanet",
								variant: "body1",
								onClick: () => o(!1),
								children: "Get single planet",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#filterplanets",
								variant: "body1",
								onClick: () => o(!1),
								children: "Filter planets",
							}),
							jsxRuntimeExports.jsx(Typography$1, {
								component: "a",
								display: "block",
								href: "#characterplanets",
								variant: "body1",
								mb: 1,
								onClick: () => o(!1),
								children: "Characters of a planet",
							}),
						],
					}),
				],
			}),
		});
function isObject(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function objectSize(o) {
	return Array.isArray(o) ? o.length : isObject(o) ? Object.keys(o).length : 0;
}
function stringifyForCopying(o, i) {
	if (typeof o == "string") return o;
	try {
		return JSON.stringify(
			o,
			(a, s) => {
				switch (typeof s) {
					case "bigint":
						return String(s) + "n";
					case "number":
					case "boolean":
					case "object":
					case "string":
						return s;
					default:
						return String(s);
				}
			},
			i
		);
	} catch (a) {
		return `${a.name}: ${a.message}` || "JSON.stringify failed";
	}
}
function isCollapsed(o, i, a, s, $, j) {
	if (j && j.collapsed !== void 0) return !!j.collapsed;
	if (typeof s == "boolean") return s;
	if (typeof s == "number" && i > s) return !0;
	const _e = objectSize(o);
	if (typeof s == "function") {
		const et = safeCall(s, [{ node: o, depth: i, indexOrName: a, size: _e }]);
		if (typeof et == "boolean") return et;
	}
	return !!((Array.isArray(o) && _e > $) || (isObject(o) && _e > $));
}
function ifDisplay(o, i, a) {
	return typeof o == "boolean"
		? o
		: !!((typeof o == "number" && i > o) || (o === "collapsed" && a) || (o === "expanded" && !a));
}
function safeCall(o, i) {
	try {
		return o(...i);
	} catch (a) {
		reportError(a);
	}
}
function editableAdd(o) {
	if (o === !0 || (isObject(o) && o.add === !0)) return !0;
}
function editableEdit(o) {
	if (o === !0 || (isObject(o) && o.edit === !0)) return !0;
}
function editableDelete(o) {
	if (o === !0 || (isObject(o) && o.delete === !0)) return !0;
}
function isReactComponent(o) {
	return typeof o == "function";
}
function customAdd(o) {
	return !o || o.add === void 0 || !!o.add;
}
function customEdit(o) {
	return !o || o.edit === void 0 || !!o.edit;
}
function customDelete(o) {
	return !o || o.delete === void 0 || !!o.delete;
}
function customCopy(o) {
	return !o || o.enableClipboard === void 0 || !!o.enableClipboard;
}
function resolveEvalFailedNewValue(o, i) {
	return o === "string" ? i.trim().replace(/^\"([\s\S]+?)\"$/, "$1") : i;
}
var _path$7;
function _extends$7() {
	return (
		(_extends$7 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$7.apply(this, arguments)
	);
}
var SvgAngleDown = function (i) {
		return reactExports.createElement(
			"svg",
			_extends$7({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 16 16" }, i),
			_path$7 ||
				(_path$7 = reactExports.createElement("path", {
					fill: "currentColor",
					d: "M12.473 5.806a.666.666 0 0 0-.946 0L8.473 8.86a.667.667 0 0 1-.946 0L4.473 5.806a.667.667 0 1 0-.946.94l3.06 3.06a2 2 0 0 0 2.826 0l3.06-3.06a.667.667 0 0 0 0-.94Z",
				}))
		);
	},
	_path$6;
function _extends$6() {
	return (
		(_extends$6 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$6.apply(this, arguments)
	);
}
var SvgCopy = function (i) {
		return reactExports.createElement(
			"svg",
			_extends$6({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
			_path$6 ||
				(_path$6 = reactExports.createElement("path", {
					fill: "currentColor",
					d: "M17.542 2.5h-4.75a3.963 3.963 0 0 0-3.959 3.958v4.75a3.963 3.963 0 0 0 3.959 3.959h4.75a3.963 3.963 0 0 0 3.958-3.959v-4.75A3.963 3.963 0 0 0 17.542 2.5Zm2.375 8.708a2.378 2.378 0 0 1-2.375 2.375h-4.75a2.378 2.378 0 0 1-2.375-2.375v-4.75a2.378 2.378 0 0 1 2.375-2.375h4.75a2.378 2.378 0 0 1 2.375 2.375v4.75Zm-4.75 6.334a3.963 3.963 0 0 1-3.959 3.958h-4.75A3.963 3.963 0 0 1 2.5 17.542v-4.75a3.963 3.963 0 0 1 3.958-3.959.791.791 0 1 1 0 1.584 2.378 2.378 0 0 0-2.375 2.375v4.75a2.378 2.378 0 0 0 2.375 2.375h4.75a2.378 2.378 0 0 0 2.375-2.375.792.792 0 1 1 1.584 0Z",
				}))
		);
	},
	_path$5,
	_path2$4;
function _extends$5() {
	return (
		(_extends$5 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$5.apply(this, arguments)
	);
}
var SvgCopied = function (i) {
	return reactExports.createElement(
		"svg",
		_extends$5({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
		_path$5 ||
			(_path$5 = reactExports.createElement("path", {
				fill: "currentColor",
				d: "M17.25 3H6.75A3.755 3.755 0 0 0 3 6.75v10.5A3.754 3.754 0 0 0 6.75 21h10.5A3.754 3.754 0 0 0 21 17.25V6.75A3.755 3.755 0 0 0 17.25 3Zm2.25 14.25a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 6.75 4.5h10.5a2.25 2.25 0 0 1 2.25 2.25v10.5Z",
			})),
		_path2$4 ||
			(_path2$4 = reactExports.createElement("path", {
				fill: "#14C786",
				d: "M10.312 14.45 7.83 11.906a.625.625 0 0 0-.896 0 .659.659 0 0 0 0 .918l2.481 2.546a1.264 1.264 0 0 0 .896.381 1.237 1.237 0 0 0 .895-.38l5.858-6.011a.658.658 0 0 0 0-.919.625.625 0 0 0-.896 0l-5.857 6.01Z",
			}))
	);
};
function CopyButton({ node: o }) {
	const [i, a] = reactExports.useState(!1);
	return i
		? jsxRuntimeExports.jsx(SvgCopied, {
				className: "json-view--copy",
				style: { display: "inline-block" },
			})
		: jsxRuntimeExports.jsx(SvgCopy, {
				onClick: (s) => {
					const $ = stringifyForCopying(o);
					(s.stopPropagation(),
						navigator.clipboard.writeText($),
						a(!0),
						setTimeout(() => a(!1), 3e3));
				},
				className: "json-view--copy",
			});
}
function NameValue({
	indexOrName: o,
	value: i,
	depth: a,
	parent: s,
	deleteHandle: $,
	editHandle: j,
}) {
	return jsxRuntimeExports.jsxs(
		"div",
		Object.assign(
			{ className: "json-view--pair" },
			{
				children: [
					jsxRuntimeExports.jsx(
						"span",
						Object.assign(
							{ className: typeof o == "number" ? "json-view--index" : "json-view--property" },
							{ children: o }
						)
					),
					":",
					" ",
					jsxRuntimeExports.jsx(JsonNode, {
						node: i,
						depth: a + 1,
						deleteHandle: $,
						editHandle: j,
						parent: s,
						indexOrName: o,
					}),
				],
			}
		)
	);
}
var _path$4, _path2$3;
function _extends$4() {
	return (
		(_extends$4 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$4.apply(this, arguments)
	);
}
var SvgTrash = function (i) {
		return reactExports.createElement(
			"svg",
			_extends$4({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
			_path$4 ||
				(_path$4 = reactExports.createElement("path", {
					fill: "currentColor",
					d: "M18.75 6h-2.325a3.757 3.757 0 0 0-3.675-3h-1.5a3.757 3.757 0 0 0-3.675 3H5.25a.75.75 0 0 0 0 1.5H6v9.75A3.754 3.754 0 0 0 9.75 21h4.5A3.754 3.754 0 0 0 18 17.25V7.5h.75a.75.75 0 1 0 0-1.5Zm-7.5-1.5h1.5A2.255 2.255 0 0 1 14.872 6H9.128a2.255 2.255 0 0 1 2.122-1.5Zm5.25 12.75a2.25 2.25 0 0 1-2.25 2.25h-4.5a2.25 2.25 0 0 1-2.25-2.25V7.5h9v9.75Z",
				})),
			_path2$3 ||
				(_path2$3 = reactExports.createElement("path", {
					fill: "#DA0000",
					d: "M10.5 16.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 1 0-1.5 0v4.5a.75.75 0 0 0 .75.75ZM13.5 16.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 1 0-1.5 0v4.5a.75.75 0 0 0 .75.75Z",
				}))
		);
	},
	_path$3,
	_path2$2;
function _extends$3() {
	return (
		(_extends$3 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$3.apply(this, arguments)
	);
}
var SvgAddSquare = function (i) {
		return reactExports.createElement(
			"svg",
			_extends$3({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
			_path$3 ||
				(_path$3 = reactExports.createElement("path", {
					fill: "currentColor",
					d: "M21 6.75v10.5A3.754 3.754 0 0 1 17.25 21H6.75A3.754 3.754 0 0 1 3 17.25V6.75A3.754 3.754 0 0 1 6.75 3h10.5A3.754 3.754 0 0 1 21 6.75Zm-1.5 0c0-1.24-1.01-2.25-2.25-2.25H6.75C5.51 4.5 4.5 5.51 4.5 6.75v10.5c0 1.24 1.01 2.25 2.25 2.25h10.5c1.24 0 2.25-1.01 2.25-2.25V6.75Z",
				})),
			_path2$2 ||
				(_path2$2 = reactExports.createElement("path", {
					fill: "#14C786",
					d: "M15 12.75a.75.75 0 1 0 0-1.5h-2.25V9a.75.75 0 1 0-1.5 0v2.25H9a.75.75 0 1 0 0 1.5h2.25V15a.75.75 0 1 0 1.5 0v-2.25H15Z",
				}))
		);
	},
	_path$2,
	_path2$1;
function _extends$2() {
	return (
		(_extends$2 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$2.apply(this, arguments)
	);
}
var SvgDone = function (i) {
		return reactExports.createElement(
			"svg",
			_extends$2({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
			_path$2 ||
				(_path$2 = reactExports.createElement("path", {
					fill: "currentColor",
					d: "M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 16.5a7.5 7.5 0 1 1 7.5-7.5 7.509 7.509 0 0 1-7.5 7.5Z",
				})),
			_path2$1 ||
				(_path2$1 = reactExports.createElement("path", {
					fill: "#14C786",
					d: "m10.85 13.96-1.986-2.036a.5.5 0 0 0-.716 0 .527.527 0 0 0 0 .735l1.985 2.036a1.01 1.01 0 0 0 .717.305.99.99 0 0 0 .716-.305l4.686-4.808a.526.526 0 0 0 0-.735.5.5 0 0 0-.716 0l-4.687 4.809Z",
				}))
		);
	},
	_path$1,
	_path2;
function _extends$1() {
	return (
		(_extends$1 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$1.apply(this, arguments)
	);
}
var SvgCancel = function (i) {
	return reactExports.createElement(
		"svg",
		_extends$1({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
		_path$1 ||
			(_path$1 = reactExports.createElement("path", {
				fill: "#DA0000",
				d: "M15 9a.75.75 0 0 0-1.06 0L12 10.94 10.06 9A.75.75 0 0 0 9 10.06L10.94 12 9 13.94A.75.75 0 0 0 10.06 15L12 13.06 13.94 15A.75.75 0 0 0 15 13.94L13.06 12 15 10.06A.75.75 0 0 0 15 9Z",
			})),
		_path2 ||
			(_path2 = reactExports.createElement("path", {
				fill: "currentColor",
				d: "M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 16.5a7.5 7.5 0 1 1 7.5-7.5 7.509 7.509 0 0 1-7.5 7.5Z",
			}))
	);
};
function ObjectNode({ node: o, depth: i, indexOrName: a, deleteHandle: s, customOptions: $ }) {
	const {
			collapsed: j,
			enableClipboard: _e,
			collapseObjectsAfterLength: et,
			editable: tt,
			onDelete: rt,
			src: nt,
			onAdd: it,
			onEdit: ot,
			onChange: st,
			forceUpdate: lt,
			displaySize: dt,
		} = reactExports.useContext(JsonViewContext),
		pt = isObject(o),
		[ct, at] = reactExports.useState(isCollapsed(o, i, a, j, et, $));
	reactExports.useEffect(() => {
		at(isCollapsed(o, i, a, j, et, $));
	}, [j, et]);
	const ft = reactExports.useCallback(
			(jt, It, Ct) => {
				(Array.isArray(o) ? (o[+jt] = It) : o && (o[jt] = It),
					ot &&
						ot({
							newValue: It,
							oldValue: Ct,
							depth: i,
							src: nt,
							indexOrName: jt,
							parentType: pt ? "object" : "array",
						}),
					st &&
						st({
							type: "edit",
							depth: i,
							src: nt,
							indexOrName: jt,
							parentType: pt ? "object" : "array",
						}),
					lt());
			},
			[o, ot, st, lt]
		),
		ut = (jt) => {
			(Array.isArray(o) ? o.splice(+jt, 1) : o && delete o[jt], lt());
		},
		[ht, yt] = reactExports.useState(!1),
		mt = () => {
			(yt(!1),
				s && s(a),
				rt &&
					rt({ value: o, depth: i, src: nt, indexOrName: a, parentType: pt ? "object" : "array" }),
				st &&
					st({
						type: "delete",
						depth: i,
						src: nt,
						indexOrName: a,
						parentType: pt ? "object" : "array",
					}));
		},
		[Et, Rt] = reactExports.useState(!1),
		vt = reactExports.useRef(null),
		Tt = () => {
			var jt;
			if (pt) {
				const It = (jt = vt.current) === null || jt === void 0 ? void 0 : jt.value;
				It &&
					((o[It] = null),
					vt.current && (vt.current.value = ""),
					Rt(!1),
					it && it({ indexOrName: It, depth: i, src: nt, parentType: "object" }),
					st && st({ type: "add", indexOrName: It, depth: i, src: nt, parentType: "object" }));
			} else if (Array.isArray(o)) {
				const It = o;
				(It.push(null),
					it && it({ indexOrName: It.length - 1, depth: i, src: nt, parentType: "array" }),
					st &&
						st({
							type: "add",
							indexOrName: It.length - 1,
							depth: i,
							src: nt,
							parentType: "array",
						}));
			}
			lt();
		},
		Pt = (jt) => {
			jt.key === "Enter" ? (jt.preventDefault(), Tt()) : jt.key === "Escape" && Nt();
		},
		Dt = ht || Et,
		Nt = () => {
			(yt(!1), Rt(!1));
		},
		$t = jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
			children: [
				!ct &&
					!Dt &&
					jsxRuntimeExports.jsxs(
						"span",
						Object.assign(
							{ onClick: () => at(!0) },
							{
								children: [
									ifDisplay(dt, i, ct) &&
										jsxRuntimeExports.jsxs(
											"span",
											Object.assign(
												{ className: "jv-size" },
												{ children: [objectSize(o), " Items"] }
											)
										),
									jsxRuntimeExports.jsx(SvgAngleDown, { className: "jv-chevron" }),
								],
							}
						)
					),
				Et &&
					pt &&
					jsxRuntimeExports.jsx("input", {
						className: "json-view--input",
						placeholder: "property",
						ref: vt,
						onKeyDown: Pt,
					}),
				Dt &&
					jsxRuntimeExports.jsx(SvgDone, {
						className: "json-view--edit",
						style: { display: "inline-block" },
						onClick: Et ? Tt : mt,
					}),
				Dt &&
					jsxRuntimeExports.jsx(SvgCancel, {
						className: "json-view--edit",
						style: { display: "inline-block" },
						onClick: Nt,
					}),
				!ct && !Dt && _e && customCopy($) && jsxRuntimeExports.jsx(CopyButton, { node: o }),
				!ct &&
					!Dt &&
					editableAdd(tt) &&
					customAdd($) &&
					jsxRuntimeExports.jsx(SvgAddSquare, {
						className: "json-view--edit",
						onClick: () => {
							pt
								? (Rt(!0),
									setTimeout(() => {
										var jt;
										return (jt = vt.current) === null || jt === void 0 ? void 0 : jt.focus();
									}))
								: Tt();
						},
					}),
				!ct &&
					!Dt &&
					editableDelete(tt) &&
					customDelete($) &&
					s &&
					jsxRuntimeExports.jsx(SvgTrash, { className: "json-view--edit", onClick: () => yt(!0) }),
			],
		});
	return Array.isArray(o)
		? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
				children: [
					jsxRuntimeExports.jsx("span", { children: "[" }),
					$t,
					ct
						? jsxRuntimeExports.jsx(
								"button",
								Object.assign(
									{ onClick: () => at(!1), className: "jv-button" },
									{ children: "..." }
								)
							)
						: jsxRuntimeExports.jsx(
								"div",
								Object.assign(
									{ className: "jv-indent" },
									{
										children: o.map((jt, It) =>
											jsxRuntimeExports.jsx(
												NameValue,
												{
													indexOrName: It,
													value: jt,
													depth: i,
													parent: o,
													deleteHandle: ut,
													editHandle: ft,
												},
												String(a) + String(It)
											)
										),
									}
								)
							),
					jsxRuntimeExports.jsx("span", { children: "]" }),
					ct &&
						ifDisplay(dt, i, ct) &&
						jsxRuntimeExports.jsxs(
							"span",
							Object.assign(
								{ onClick: () => at(!1), className: "jv-size" },
								{ children: [objectSize(o), " Items"] }
							)
						),
				],
			})
		: pt
			? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
					children: [
						jsxRuntimeExports.jsx("span", { children: "{" }),
						$t,
						ct
							? jsxRuntimeExports.jsx(
									"button",
									Object.assign(
										{ onClick: () => at(!1), className: "jv-button" },
										{ children: "..." }
									)
								)
							: jsxRuntimeExports.jsx(
									"div",
									Object.assign(
										{ className: "jv-indent" },
										{
											children: Object.entries(o).map(([jt, It]) =>
												jsxRuntimeExports.jsx(
													NameValue,
													{
														indexOrName: jt,
														value: It,
														depth: i,
														parent: o,
														deleteHandle: ut,
														editHandle: ft,
													},
													String(a) + String(jt)
												)
											),
										}
									)
								),
						jsxRuntimeExports.jsx("span", { children: "}" }),
						ct &&
							ifDisplay(dt, i, ct) &&
							jsxRuntimeExports.jsxs(
								"span",
								Object.assign(
									{ onClick: () => at(!1), className: "jv-size" },
									{ children: [objectSize(o), " Items"] }
								)
							),
					],
				})
			: null;
}
const LongString = React.forwardRef(({ str: o, className: i, ctrlClick: a }, s) => {
	let { collapseStringMode: $, collapseStringsAfterLength: j } =
		reactExports.useContext(JsonViewContext);
	const [_e, et] = reactExports.useState(!0);
	j = j > 0 ? j : 0;
	const tt = o.replace(/\s+/g, " "),
		rt = (nt) => {
			(nt.ctrlKey || nt.metaKey) && a ? a(nt) : et(!_e);
		};
	if (o.length <= j)
		return jsxRuntimeExports.jsxs(
			"span",
			Object.assign({ className: i, onClick: a }, { children: ['"', o, '"'] })
		);
	if ($ === "address")
		return o.length <= 10
			? jsxRuntimeExports.jsxs(
					"span",
					Object.assign({ className: i, onClick: a }, { children: ['"', o, '"'] })
				)
			: jsxRuntimeExports.jsxs(
					"span",
					Object.assign(
						{ onClick: rt, className: i + " cursor-pointer" },
						{ children: ['"', _e ? tt.slice(0, 6) + "..." + tt.slice(-4) : o, '"'] }
					)
				);
	if ($ === "directly")
		return jsxRuntimeExports.jsxs(
			"span",
			Object.assign(
				{ onClick: rt, className: i + " cursor-pointer" },
				{ children: ['"', _e ? tt.slice(0, j) + "..." : o, '"'] }
			)
		);
	if ($ === "word") {
		let nt = j,
			it = j + 1,
			ot = tt,
			st = 1;
		for (;;) {
			if (/\W/.test(o[nt])) {
				ot = o.slice(0, nt);
				break;
			}
			if (/\W/.test(o[it])) {
				ot = o.slice(0, it);
				break;
			}
			if (st === 6) {
				ot = o.slice(0, j);
				break;
			}
			(st++, nt--, it++);
		}
		return jsxRuntimeExports.jsxs(
			"span",
			Object.assign(
				{ onClick: rt, className: i + " cursor-pointer" },
				{ children: ['"', _e ? ot + "..." : o, '"'] }
			)
		);
	}
	return jsxRuntimeExports.jsxs(
		"span",
		Object.assign({ className: i }, { children: ['"', o, '"'] })
	);
});
var _path;
function _extends$8() {
	return (
		(_extends$8 = Object.assign
			? Object.assign.bind()
			: function (o) {
					for (var i = 1; i < arguments.length; i++) {
						var a = arguments[i];
						for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
					}
					return o;
				}),
		_extends$8.apply(this, arguments)
	);
}
var SvgEdit = function (i) {
	return reactExports.createElement(
		"svg",
		_extends$8({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, i),
		_path ||
			(_path = reactExports.createElement("path", {
				fill: "currentColor",
				d: "M17.25 3H6.75A3.754 3.754 0 0 0 3 6.75v10.5A3.754 3.754 0 0 0 6.75 21h10.5A3.754 3.754 0 0 0 21 17.25V6.75A3.754 3.754 0 0 0 17.25 3Zm2.25 14.25c0 1.24-1.01 2.25-2.25 2.25H6.75c-1.24 0-2.25-1.01-2.25-2.25V6.75c0-1.24 1.01-2.25 2.25-2.25h10.5c1.24 0 2.25 1.01 2.25 2.25v10.5Zm-6.09-9.466-5.031 5.03a2.981 2.981 0 0 0-.879 2.121v1.19c0 .415.336.75.75.75h1.19c.8 0 1.554-.312 2.12-.879l5.03-5.03a2.252 2.252 0 0 0 0-3.182c-.85-.85-2.331-.85-3.18 0Zm-2.91 7.151c-.28.28-.666.44-1.06.44H9v-.44c0-.4.156-.777.44-1.06l3.187-3.188 1.06 1.061-3.187 3.188Zm5.03-5.03-.782.783-1.06-1.061.782-.782a.766.766 0 0 1 1.06 0 .75.75 0 0 1 0 1.06Z",
			}))
	);
};
function JsonNode({ node, depth, deleteHandle: _deleteHandle, indexOrName, parent, editHandle }) {
	const {
		collapseStringsAfterLength,
		enableClipboard,
		editable,
		src,
		onDelete,
		onChange,
		customizeNode,
	} = reactExports.useContext(JsonViewContext);
	let customReturn;
	if (
		(typeof customizeNode == "function" &&
			(customReturn = safeCall(customizeNode, [{ node, depth, indexOrName }])),
		customReturn)
	) {
		if (reactExports.isValidElement(customReturn)) return customReturn;
		if (isReactComponent(customReturn)) {
			const o = customReturn;
			return jsxRuntimeExports.jsx(o, { node, depth, indexOrName });
		}
	}
	if (Array.isArray(node) || isObject(node))
		return jsxRuntimeExports.jsx(ObjectNode, {
			node,
			depth,
			indexOrName,
			deleteHandle: _deleteHandle,
			customOptions: typeof customReturn == "object" ? customReturn : void 0,
		});
	{
		const type = typeof node,
			[editing, setEditing] = reactExports.useState(!1),
			[deleting, setDeleting] = reactExports.useState(!1),
			valueRef = reactExports.useRef(null),
			edit = () => {
				(setEditing(!0),
					setTimeout(() => {
						var o, i;
						((o = window.getSelection()) === null ||
							o === void 0 ||
							o.selectAllChildren(valueRef.current),
							(i = valueRef.current) === null || i === void 0 || i.focus());
					}));
			},
			done = reactExports.useCallback(() => {
				const newValue = valueRef.current.innerText;
				try {
					const evalValue = eval(newValue);
					editHandle && editHandle(indexOrName, evalValue, node);
				} catch (o) {
					const i = resolveEvalFailedNewValue(type, newValue);
					editHandle && editHandle(indexOrName, i, node);
				}
				setEditing(!1);
			}, [editHandle]),
			cancel = () => {
				(setEditing(!1), setDeleting(!1));
			},
			deleteHandle = () => {
				(setDeleting(!1),
					_deleteHandle && _deleteHandle(indexOrName),
					onDelete &&
						onDelete({
							value: node,
							depth,
							src,
							indexOrName,
							parentType: Array.isArray(parent) ? "array" : "object",
						}),
					onChange &&
						onChange({
							depth,
							src,
							indexOrName,
							parentType: Array.isArray(parent) ? "array" : "object",
							type: "delete",
						}));
			},
			handleKeyDown = reactExports.useCallback(
				(o) => {
					o.key === "Enter" ? (o.preventDefault(), done()) : o.key === "Escape" && cancel();
				},
				[done]
			),
			isEditing = editing || deleting,
			ctrlClick =
				!isEditing && editableEdit(editable) && customEdit(customReturn) && editHandle
					? (o) => {
							(o.ctrlKey || o.metaKey) && edit();
						}
					: void 0,
			Icons = jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
				children: [
					isEditing &&
						jsxRuntimeExports.jsx(SvgDone, {
							className: "json-view--edit",
							style: { display: "inline-block" },
							onClick: deleting ? deleteHandle : done,
						}),
					isEditing &&
						jsxRuntimeExports.jsx(SvgCancel, {
							className: "json-view--edit",
							style: { display: "inline-block" },
							onClick: cancel,
						}),
					!isEditing &&
						enableClipboard &&
						customCopy(customReturn) &&
						jsxRuntimeExports.jsx(CopyButton, { node }),
					!isEditing &&
						editableEdit(editable) &&
						customEdit(customReturn) &&
						editHandle &&
						jsxRuntimeExports.jsx(SvgEdit, { className: "json-view--edit", onClick: edit }),
					!isEditing &&
						editableDelete(editable) &&
						customDelete(customReturn) &&
						_deleteHandle &&
						jsxRuntimeExports.jsx(SvgTrash, {
							className: "json-view--edit",
							onClick: () => setDeleting(!0),
						}),
				],
			});
		let className = "json-view--string";
		switch (
			(typeof (customReturn == null ? void 0 : customReturn.className) == "string" &&
				(className += " " + customReturn.className),
			type)
		) {
			case "number":
			case "bigint":
				className = "json-view--number";
				break;
			case "boolean":
				className = "json-view--boolean";
				break;
			case "object":
				className = "json-view--null";
				break;
		}
		deleting && (className += " json-view--deleting");
		let displayValue = String(node);
		type === "bigint" && (displayValue += "n");
		const EditingElement = reactExports.useMemo(
			() =>
				jsxRuntimeExports.jsx("span", {
					contentEditable: !0,
					className,
					dangerouslySetInnerHTML: {
						__html: type === "string" ? `"${displayValue}"` : displayValue,
					},
					ref: valueRef,
					onKeyDown: handleKeyDown,
				}),
			[displayValue, type, handleKeyDown]
		);
		return type === "string"
			? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
					children: [
						editing
							? EditingElement
							: node.length > collapseStringsAfterLength
								? jsxRuntimeExports.jsx(LongString, {
										str: node,
										ref: valueRef,
										className,
										ctrlClick,
									})
								: jsxRuntimeExports.jsxs(
										"span",
										Object.assign(
											{ className, onClick: ctrlClick },
											{ children: ['"', displayValue, '"'] }
										)
									),
						Icons,
					],
				})
			: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
					children: [
						editing
							? EditingElement
							: jsxRuntimeExports.jsx(
									"span",
									Object.assign({ className, onClick: ctrlClick }, { children: displayValue })
								),
						Icons,
					],
				});
	}
}
const JsonViewContext = reactExports.createContext({
	src: void 0,
	collapseStringsAfterLength: 99,
	collapseStringMode: "directly",
	collapseObjectsAfterLength: 20,
	collapsed: !1,
	enableClipboard: !0,
	editable: !1,
	onEdit: void 0,
	onDelete: void 0,
	onAdd: void 0,
	onChange: void 0,
	forceUpdate: () => {},
	customizeNode: void 0,
	displaySize: void 0,
});
function JsonView({
	src: o,
	collapseStringsAfterLength: i = 99,
	collapseStringMode: a = "directly",
	collapseObjectsAfterLength: s = 99,
	collapsed: $,
	enableClipboard: j = !0,
	editable: _e = !1,
	onEdit: et,
	onDelete: tt,
	onAdd: rt,
	onChange: nt,
	dark: it = !1,
	theme: ot = "default",
	customizeNode: st,
	displaySize: lt,
}) {
	const [dt, pt] = reactExports.useState(0),
		ct = reactExports.useCallback(() => pt((at) => ++at), []);
	return jsxRuntimeExports.jsx(
		JsonViewContext.Provider,
		Object.assign(
			{
				value: {
					src: o,
					collapseStringsAfterLength: i,
					collapseStringMode: a,
					collapseObjectsAfterLength: s,
					collapsed: $,
					enableClipboard: j,
					editable: _e,
					onEdit: et,
					onDelete: tt,
					onAdd: rt,
					onChange: nt,
					forceUpdate: ct,
					customizeNode: st,
					displaySize: lt,
				},
			},
			{
				children: jsxRuntimeExports.jsx(
					"code",
					Object.assign(
						{
							className:
								"json-view" +
								(it ? " dark" : "") +
								(ot && ot !== "default" ? " json-view_" + ot : ""),
						},
						{ children: jsxRuntimeExports.jsx(JsonNode, { node: o, depth: 1 }) }
					)
				),
			}
		)
	);
}
const area = 48,
	Burger = ({
		color: o = "currentColor",
		direction: i = "left",
		distance: a = "md",
		duration: s = 0.4,
		easing: $ = "cubic-bezier(0, 0, 0, 1)",
		hideOutline: j = !0,
		label: _e,
		lines: et = 3,
		onToggle: tt,
		render: rt,
		rounded: nt = !1,
		size: it = 32,
		toggle: ot,
		toggled: st,
	}) => {
		const [lt, dt] = reactExports.useState(!1),
			pt = Math.max(12, Math.min(area, it)),
			ct = Math.round((area - pt) / 2),
			at = pt / 12,
			ft = Math.round(at),
			ht = pt / (et * ((a === "lg" ? 0.25 : a === "sm" ? 0.75 : 0.5) + (et === 3 ? 1 : 1.25))),
			yt = Math.round(ht),
			mt = ft * et + yt * (et - 1),
			Et = Math.round((area - mt) / 2),
			Rt =
				et === 3
					? a === "lg"
						? 4.0425
						: a === "sm"
							? 5.1625
							: 4.6325
					: a === "lg"
						? 6.7875
						: a === "sm"
							? 8.4875
							: 7.6675,
			vt = (at - ft + (ht - yt)) / (et === 3 ? 1 : 2),
			Tt = parseFloat((pt / Rt - vt / (4 / 3)).toFixed(2)),
			Pt = Math.max(0, s),
			Dt = {
				cursor: "pointer",
				height: `${area}px`,
				position: "relative",
				transition: `${Pt}s ${$}`,
				userSelect: "none",
				width: `${area}px`,
			},
			Nt = { background: o, height: `${ft}px`, left: `${ct}px`, position: "absolute" };
		(j && (Dt.outline = "none"), nt && (Nt.borderRadius = "9em"));
		const $t = ot || dt,
			jt = st !== void 0 ? st : lt;
		return rt({
			barHeight: ft,
			barStyles: Nt,
			burgerStyles: Dt,
			easing: $,
			handler: () => {
				($t(!jt), typeof tt == "function" && tt(!jt));
			},
			isLeft: i === "left",
			isToggled: jt,
			label: _e,
			margin: yt,
			move: Tt,
			time: Pt,
			topOffset: Et,
			width: pt,
		});
	};
function _extends() {
	return (
		(_extends =
			Object.assign ||
			function (o) {
				for (var i = 1; i < arguments.length; i++) {
					var a = arguments[i];
					for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (o[s] = a[s]);
				}
				return o;
			}),
		_extends.apply(this, arguments)
	);
}
const Tilt = (o) =>
		React.createElement(
			Burger,
			_extends({}, o, {
				render: (i) =>
					React.createElement(
						"div",
						{
							className: "hamburger-react",
							"aria-label": i.label,
							"aria-expanded": i.isToggled,
							onClick: i.handler,
							onKeyUp: (a) => a.key === "Enter" && i.handler(),
							role: "button",
							style: {
								...i.burgerStyles,
								transform: `${i.isToggled ? `rotate(${90 * (i.isLeft ? -1 : 1)}deg)` : "none"}`,
							},
							tabIndex: 0,
						},
						React.createElement("div", {
							style: {
								...i.barStyles,
								width: `${i.width}px`,
								top: `${i.topOffset}px`,
								transition: `${i.time}s ${i.easing}`,
								transform: `${i.isToggled ? `rotate(${45 * (i.isLeft ? -1 : 1)}deg) translate(${i.move * (i.isLeft ? -1 : 1)}px, ${i.move}px)` : "none"}`,
							},
						}),
						React.createElement("div", {
							style: {
								...i.barStyles,
								width: `${i.width}px`,
								top: `${i.topOffset + i.barHeight + i.margin}px`,
								transition: `${i.time}s ${i.easing}`,
								transform: `${i.isToggled ? "scaleX(0)" : "none"}`,
							},
						}),
						React.createElement("div", {
							style: {
								...i.barStyles,
								width: `${i.width}px`,
								top: `${i.topOffset + i.barHeight * 2 + i.margin * 2}px`,
								transition: `${i.time}s ${i.easing}`,
								transform: `${i.isToggled ? `rotate(${45 * (i.isLeft ? 1 : -1)}deg) translate(${i.move * (i.isLeft ? -1 : 1)}px, ${i.move * -1}px)` : "none"}`,
							},
						})
					),
			})
		),
	dark = "",
	style = "",
	Docs = () => {
		var lt, dt, pt, ct;
		const [o, i] = reactExports.useState({
				pagination: null,
				allCharacters: null,
				singleCharacter: null,
				filterCharacter: null,
				singleCharacterNoTransformation: null,
				singlePlanet: null,
				singlePlanetNoCharacter: null,
				allPlanets: null,
				filterPlanets: null,
			}),
			[a, s] = reactExports.useState(1),
			[$, j] = reactExports.useState(null),
			[_e, et] = reactExports.useState([]),
			[tt, rt] = reactExports.useState(apiUrl.pagination),
			[nt, it] = reactExports.useState(!1),
			ot = useMediaQuery("(min-width:600px)"),
			st = async (at, ft) => {
				try {
					const ht = await (await fetch(at)).json();
					i((yt) => ({ ...yt, [ft]: ht }));
				} catch (ut) {
					console.error(`Error fetching JSON data for ${ft}:`, ut);
				}
			};
		return (
			reactExports.useEffect(() => {
				(st(apiUrl.pagination, "pagination"),
					st(apiUrl.allCharacters, "allCharacters"),
					st(apiUrl.singleCharacter, "singleCharacter"),
					st(apiUrl.filterCharacter, "filterCharacter"),
					st(apiUrl.singleCharacterNoTransformation, "singleCharacterNoTransformation"),
					st(apiUrl.singlePlanet, "singlePlanet"),
					st(apiUrl.singlePlanetNoCharacter, "singlePlanetNoCharacter"),
					st(apiUrl.allPlanets, "allPlanets"),
					st(apiUrl.filterPlanets, "filterPlanets"));
			}, []),
			reactExports.useEffect(() => {
				o != null && o.pagination && et(o == null ? void 0 : o.pagination.links);
			}, [o, o == null ? void 0 : o.pagination]),
			reactExports.useEffect(() => {
				(async () => {
					try {
						const ut = await (await fetch(tt)).json();
						j(ut);
					} catch (ft) {
						console.error("Error fetching JSON data:", ft);
					}
				})();
			}, [tt]),
			reactExports.useEffect(() => {
				nt && window.scrollTo(0, 0);
			}),
			jsxRuntimeExports.jsxs(Box$1, {
				sx: { display: "flex", pb: 10, minHeight: "calc(100vh - 422.7px)" },
				children: [
					jsxRuntimeExports.jsx(NavBar, { setOpen: it, isOpen: nt, matches: ot }),
					!ot &&
						jsxRuntimeExports.jsx(Fab$1, {
							color: "primary",
							"aria-label": "show drawer menu",
							sx: { position: "fixed", bottom: 20, right: 20 },
							children: jsxRuntimeExports.jsx(Tilt, { size: 20, toggled: nt, toggle: it }),
						}),
					jsxRuntimeExports.jsx(Box$1, {
						sx: { overflow: "hidden", flexGrow: 1, display: nt ? "none" : "block" },
						component: "article",
						children: jsxRuntimeExports.jsxs(Container$1, {
							maxWidth: "md",
							sx: { color: "text.primary" },
							children: [
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "h1",
									component: "h1",
									color: "initial",
									fontWeight: "900",
									mt: 4,
									mb: 6,
									children: "Documentation",
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "introduction",
									variant: "h3",
									component: "h2",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									mb: 2,
									children: "Introduction",
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "body1",
									mb: 1,
									children:
										"This is the documentation for the Dragon Ball API, providing you with insights on how to use it. Below, we will explore all the routes and data structures, helping you become acquainted with the API.",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									mb: 6,
									sx: { display: "flex", alignItems: "center" },
									id: "swagger",
									children: [
										"Explore and test the API by clicking here. --",
										">",
										" ",
										jsxRuntimeExports.jsxs(Typography$1, {
											component: "a",
											href: "http://dragonball-api.com/api-docs",
											target: "_blank",
											rel: "canonical",
											sx: {
												ml: 1,
												display: "flex",
												alignItems: "center",
												color: "primary.main",
												pb: 0.5,
												textDecoration: "none",
												"&:hover": { color: "secondary.main" },
											},
											children: [
												jsxRuntimeExports.jsx(Box$1, {
													id: "swagger",
													component: "img",
													alt: "Swagger Logo",
													width: 95,
													height: 30,
													rel: "noopener noreferrer",
													src: "https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white",
												}),
												" ",
											],
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "h5",
									component: "h3",
									color: "initial",
									fontWeight: "bold",
									mb: 2,
									id: "routes",
									children: "Routes",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "initial",
									fontWeight: "700",
									mb: 2,
									children: [
										"Base URL:",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											component: "a",
											href: "http://dragonball-api.com/api-docs",
											rel: "canonical",
											sx: {
												color: "initial",
												pb: 0.5,
												borderBottom: "2px solid #9c27b0 ",
												textDecoration: "none",
												"&:hover": { color: "secondary.main" },
											},
											children: "https://www.dragonball-api.com/api",
										}),
									],
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "inherit",
									mb: 2,
									children: [
										"The base URL remains constant and is essential for progressively adding different routes that provide the desired information. All responses are in the form of",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "GET",
										}),
										" ",
										"requests via",
										" ",
										jsxRuntimeExports.jsxs(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: [" ", "HTTPS", " "],
										}),
										"and return data in",
										jsxRuntimeExports.jsxs(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: [" ", "JSON", " "],
										}),
										"format.",
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "body1",
									children: "Currently, there are two types of resources:",
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									component: "ul",
									mb: 6,
									children: [
										jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											component: "li",
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													color: "initial",
													fontWeight: "700",
													component: "a",
													href: "#response",
													onClick: () => s(1),
													sx: {
														color: "initial",
														pb: 0.5,
														borderBottom: "2px solid #9c27b0 ",
														textDecoration: "none",
														"&:hover": { color: "secondary.main" },
													},
													children: "Characters:",
												}),
												" ",
												"(Retrieves all the characters)",
											],
										}),
										jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											component: "li",
											mb: 1,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													component: "a",
													fontWeight: "700",
													href: "#planets",
													onClick: () => s(2),
													sx: {
														color: "initial",
														pb: 0.5,
														borderBottom: "2px solid #9c27b0 ",
														textDecoration: "none",
														"&:hover": { color: "secondary.main" },
													},
													children: "Planets:",
												}),
												" ",
												"(Retrieves all the planets)",
											],
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "h5",
									component: "h3",
									color: "initial",
									fontWeight: "bold",
									mb: 1,
									id: "response",
									children: "Response:",
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "body1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: a === 1 ? apiUrl.allCharacters : apiUrl.allPlanets,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src:
												a === 1
													? o == null
														? void 0
														: o.allCharacters
													: o == null
														? void 0
														: o.allPlanets,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapseObjectsAfterLength: 5,
											collapseStringsAfterLength: 100,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "pagination",
									variant: "h3",
									component: "h2",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Pagination",
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "info",
									variant: "h5",
									component: "h3",
									color: "initial",
									fontWeight: "bold",
									mt: 6,
									mb: 2,
									children: "Info and Pagination",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "inherit",
									children: [
										"The API will automatically paginate responses. By default, it returns an object with an array called",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "ITEMS",
										}),
										" ",
										"with 10 elements, an object named",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "META",
										}),
										" ",
										"containing pagination information, and another named",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "LINKS",
										}),
										" ",
										"with links to navigate to other pages.",
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "pagelimit",
									component: "h3",
									variant: "h5",
									color: "initial",
									fontWeight: "bold",
									mt: 6,
									mb: 2,
									children: "Page and Limit",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "inherit",
									children: [
										"The API can receive two arguments:",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "PAGE",
										}),
										" ",
										"indicating the page number, and",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "LIMIT",
										}),
										" ",
										"indicating the maximum number of items per page. If not specified, it defaults to 10 elements.",
										" ",
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 2,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													component: "h3",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.pagination,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.pagination,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapseObjectsAfterLength: 5,
											collapseStringsAfterLength: 100,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "links",
									variant: "h5",
									component: "h3",
									color: "initial",
									fontWeight: "bold",
									mt: 6,
									children: "LINKS:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									mt: 2,
									children: [
										"Consider incorporating buttons for page navigation using the 'links' object. Automatically generate the URL based on the initial call.",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "FIRST",
										}),
										" ",
										"navigate to the first page,",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "PREVIOUS",
										}),
										" ",
										"navigate to the previous page,",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "NEXT",
										}),
										" ",
										"navigate to the next page, and",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "LAST",
										}),
										" ",
										"navigate to the last page.",
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "body1",
									color: "initial",
									mt: 2,
									children: "There are 4 links for navigation:",
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									component: "ul",
									mb: 6,
									children: [
										jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											color: "initial",
											component: "li",
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													color: "initial",
													fontWeight: "700",
													component: "span",
													onClick: () => rt(_e == null ? void 0 : _e.first),
													sx: {
														cursor: "pointer",
														color: "initial",
														pb: 0.5,
														borderBottom: "2px solid #9c27b0 ",
														textDecoration: "none",
														"&:hover": { color: "secondary.main" },
													},
													children: "First",
												}),
												" ",
												"(Navigate to the first page.)",
											],
										}),
										jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											color: "initial",
											component: "li",
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													color: "initial",
													component: "span",
													fontWeight: "700",
													onClick: () => rt(_e == null ? void 0 : _e.next),
													sx: {
														cursor: "pointer",
														color: "initial",
														pb: 0.5,
														borderBottom: "2px solid #9c27b0 ",
														textDecoration: "none",
														"&:hover": { color: "secondary.main" },
													},
													children: "Next",
												}),
												" ",
												"(Navigate to the next page.)",
											],
										}),
										jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											color: "initial",
											component: "li",
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													color: "initial",
													component: "span",
													fontWeight: "700",
													onClick: () => rt(_e == null ? void 0 : _e.previous),
													sx: {
														cursor: "pointer",
														color: "initial",
														pb: 0.5,
														borderBottom: "2px solid #9c27b0 ",
														textDecoration: "none",
														"&:hover": { color: "secondary.main" },
													},
													children: "Previous",
												}),
												" ",
												"(Navigate to the previous page)",
											],
										}),
										jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											color: "initial",
											component: "li",
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "body1",
													color: "initial",
													component: "span",
													fontWeight: "700",
													onClick: () => rt(_e == null ? void 0 : _e.last),
													sx: {
														cursor: "pointer",
														color: "initial",
														pb: 0.5,
														borderBottom: "2px solid #9c27b0 ",
														textDecoration: "none",
														"&:hover": { color: "secondary.main" },
													},
													children: "Last",
												}),
												" ",
												"(Navigate to the last page.)",
											],
										}),
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 2,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: tt,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: $,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapseObjectsAfterLength: 5,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "character",
									variant: "h3",
									component: "h2",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Character",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									mt: 2,
									children: [
										"Currently, there are a total of",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children:
												(dt =
													(lt = o == null ? void 0 : o.allCharacters) == null ? void 0 : lt.meta) ==
												null
													? void 0
													: dt.totalItems,
										}),
										" ",
										"characters and",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "43",
										}),
										" ",
										"transformations",
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "charactersall",
									variant: "h4",
									component: "h3",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Get all characters:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "initial",
									mt: 2,
									children: [
										"You can access the list of characters by using the",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "/characters",
										}),
										" ",
										"endpoint.",
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 2,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.allCharacters,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.allCharacters,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 2,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "singlecharacter",
									variant: "h4",
									component: "h3",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Get a single character:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									mt: 2,
									children: [
										"You can get a single character by adding the",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											children: "id",
										}),
										" ",
										"as a parameter:",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "/character/2",
										}),
										" ",
										"endpoint.",
										jsxRuntimeExports.jsx("br", {}),
										jsxRuntimeExports.jsx("br", {}),
										"Single character comes with 2 news atributes:",
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									component: "ul",
									children: [
										jsxRuntimeExports.jsx("li", {
											children: jsxRuntimeExports.jsxs(Typography$1, {
												variant: "body1",
												color: "inherit",
												mt: 2,
												children: [
													jsxRuntimeExports.jsx(Typography$1, {
														component: "span",
														backgroundColor: "#f5f5f5",
														fontWeight: "700",
														p: 0.5,
														children: "originPlanet:",
													}),
													" ",
													"Object with the planet where the character came from",
												],
											}),
										}),
										jsxRuntimeExports.jsx("li", {
											children: jsxRuntimeExports.jsxs(Typography$1, {
												variant: "body1",
												color: "inherit",
												mt: 2,
												children: [
													jsxRuntimeExports.jsx(Typography$1, {
														component: "span",
														backgroundColor: "#f5f5f5",
														fontWeight: "700",
														p: 0.5,
														children: "transformations:",
													}),
													" ",
													"An array with all the transformations of the character",
												],
											}),
										}),
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 2,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.singleCharacter,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.singleCharacter,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 2,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "filtercharacter",
									variant: "h4",
									component: "h3",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Filter characters:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									mt: 2,
									children: [
										"You can also include filters in the URL by including additional query parameters. To start filtering add a",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "?",
										}),
										" ",
										"followed by the query",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "<query>=<value>",
										}),
										" ",
										"If you want to chain several queries in the same call, use",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "&",
										}),
										" ",
										"followed by the query.",
										jsxRuntimeExports.jsx("br", {}),
										jsxRuntimeExports.jsx("br", {}),
										"For example, If you want to check how many Saiyans are Fighter Z , just add",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "?race=Saiyan&affiliation=Z fighter",
										}),
										" ",
										"to the URL.",
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									component: "ul",
									mb: 4,
									children: [
										jsxRuntimeExports.jsx("li", {
											children: jsxRuntimeExports.jsxs(Typography$1, {
												variant: "body1",
												color: "inherit",
												children: [
													jsxRuntimeExports.jsx(Typography$1, {
														component: "span",
														backgroundColor: "#f5f5f5",
														fontWeight: "500",
														color: "text.secondary",
														px: 1,
														py: 0.5,
														mx: 0.5,
														children: "name",
													}),
													" ",
													"filter by the given name.",
												],
											}),
										}),
										jsxRuntimeExports.jsx("li", {
											children: jsxRuntimeExports.jsxs(Typography$1, {
												variant: "body1",
												color: "inherit",
												mt: 1,
												children: [
													jsxRuntimeExports.jsx(Typography$1, {
														component: "span",
														backgroundColor: "#f5f5f5",
														fontWeight: "500",
														color: "text.secondary",
														px: 1,
														py: 0.5,
														mx: 0.5,
														children: "gender",
													}),
													" ",
													"filter by the given gender ",
													"(",
													jsxRuntimeExports.jsx(Typography$1, {
														color: "text.secondary",
														backgroundColor: "#f5f5f5",
														component: "span",
														variant: "subtitle1",
														fontWeight: "500",
														p: 0.5,
														mx: 0.5,
														children: "Male",
													}),
													" ",
													",",
													jsxRuntimeExports.jsx(Typography$1, {
														color: "text.secondary",
														backgroundColor: "#f5f5f5",
														component: "span",
														variant: "subtitle1",
														fontWeight: "500",
														p: 0.5,
														mx: 0.5,
														children: "Female",
													}),
													" ",
													",",
													jsxRuntimeExports.jsx(Typography$1, {
														color: "text.secondary",
														backgroundColor: "#f5f5f5",
														component: "span",
														variant: "subtitle1",
														fontWeight: "500",
														p: 0.5,
														mx: 0.5,
														children: "Unknown",
													}),
													" ",
													")",
												],
											}),
										}),
										jsxRuntimeExports.jsxs("li", {
											children: [
												jsxRuntimeExports.jsxs(Typography$1, {
													variant: "body1",
													color: "inherit",
													my: 1,
													children: [
														jsxRuntimeExports.jsx(Typography$1, {
															component: "span",
															backgroundColor: "#f5f5f5",
															fontWeight: "500",
															color: "text.secondary",
															px: 1,
															py: 0.5,
															mx: 0.5,
															children: "race",
														}),
														" ",
														"filter by the given race:",
													],
												}),
												jsxRuntimeExports.jsxs(Box$1, {
													ml: 2,
													children: [
														"(",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Human",
														}),
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Saiyan",
														}),
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Namekian",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Majin",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Frieza Race",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Android",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Jiren Race",
														}),
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "God",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Angel",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Evil",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Nucleico",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Nucleico benigno",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Unknown)",
														}),
													],
												}),
											],
										}),
										jsxRuntimeExports.jsxs("li", {
											children: [
												jsxRuntimeExports.jsxs(Typography$1, {
													variant: "body1",
													color: "inherit",
													my: 1,
													children: [
														jsxRuntimeExports.jsx(Typography$1, {
															component: "span",
															backgroundColor: "#f5f5f5",
															fontWeight: "500",
															color: "text.secondary",
															px: 1,
															py: 0.5,
															mx: 0.5,
															children: "affiliation",
														}),
														"filter by the given affiliation:",
													],
												}),
												jsxRuntimeExports.jsxs(Box$1, {
													ml: 2,
													children: [
														" ",
														"(",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Z Fighter",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Red Ribbon Army",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Namekian Warrior",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Freelancer",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Army of Frieza",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Pride Troopers",
														}),
														" ",
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Assistant of Vermoud",
														}),
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "God",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Assistant of Beerus",
														}),
														" ",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Villain",
														}),
														",",
														jsxRuntimeExports.jsx(Typography$1, {
															color: "text.secondary",
															backgroundColor: "#f5f5f5",
															component: "span",
															variant: "subtitle1",
															fontWeight: "500",
															p: 0.5,
															mx: 0.5,
															children: "Other",
														}),
														" ",
														")",
													],
												}),
											],
										}),
									],
								}),
								jsxRuntimeExports.jsx(Alert$1, {
									sx: {
										p: 1,
										borderLeft: "8px solid #FF9801",
										bgcolor: "#FFE2C3",
										display: "flex",
										alignItems: "center",
									},
									severity: "warning",
									children: jsxRuntimeExports.jsx(Typography$1, {
										variant: "body1",
										color: "text.secondary",
										fontStyle: "italic",
										children: "Filters dont have Pagination!",
									}),
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 3,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.filterCharacter,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.filterCharacter,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 2,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "transformation",
									variant: "h4",
									component: "h3",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Transformations",
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "body1",
									mt: 2,
									children:
										"Is an array of character transformations, if no have transformation, array will be empty.",
								}),
								jsxRuntimeExports.jsx(Alert$1, {
									sx: {
										mt: 2,
										p: 1,
										borderLeft: "8px solid #FF9801",
										bgcolor: "#FFE2C3",
										display: "flex",
										alignItems: "center",
									},
									severity: "warning",
									children: jsxRuntimeExports.jsx(Typography$1, {
										variant: "body1",
										color: "text.secondary",
										fontStyle: "italic",
										children: "Some characters dont have transformations!",
									}),
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 3,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.singleCharacterNoTransformation,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.singleCharacterNoTransformation,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 3,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "planet",
									component: "h2",
									variant: "h3",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Planets",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									mt: 2,
									children: [
										"Currently there are a total of",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children:
												(ct =
													(pt = o == null ? void 0 : o.allPlanets) == null ? void 0 : pt.meta) ==
												null
													? void 0
													: ct.totalItems,
										}),
										" ",
										"planet, each character is associated with a planet.",
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "allplanets",
									component: "h3",
									variant: "h4",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Get all planets:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "initial",
									mt: 2,
									children: [
										"You can access the list of planets by using the",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "/planets",
										}),
										" ",
										"endpoint.",
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 2,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.allPlanets,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.allPlanets,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 2,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "singleplanet",
									component: "h3",
									variant: "h4",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Get a single planet:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									id: "singleplanet",
									variant: "body1",
									mt: 2,
									children: [
										"You can get a single planet by adding the",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "id",
										}),
										" ",
										"as parameter:",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "/planets/2",
										}),
										" ",
										"endpoint.",
										jsxRuntimeExports.jsx("br", {}),
										"Single planet comes with 1 new atribute:",
									],
								}),
								jsxRuntimeExports.jsx(Box$1, {
									component: "ul",
									children: jsxRuntimeExports.jsx("li", {
										children: jsxRuntimeExports.jsxs(Typography$1, {
											variant: "body1",
											color: "inherit",
											mt: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "span",
													variant: "subtitle1",
													backgroundColor: "#f5f5f5",
													fontWeight: "700",
													p: 0.5,
													children: "characters:",
												}),
												" ",
												"Retrieves an array with a all characters came from",
											],
										}),
									}),
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 2,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.singlePlanet,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.singlePlanet,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 2,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "filterplanets",
									component: "h3",
									variant: "h4",
									color: "initial",
									fontWeight: "800",
									mt: 10,
									children: "Filter planets:",
								}),
								jsxRuntimeExports.jsxs(Typography$1, {
									variant: "body1",
									color: "inherit",
									mt: 2,
									children: [
										"You can also include filters in the URL by including additional query parameters. To start filtering add a",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "?",
										}),
										" ",
										"followed by the query",
										" ",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "<query>=<value>",
										}),
										" ",
										"If you want to chain several queries in the same call, use",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "text.secondary",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "&",
										}),
										" ",
										"followed by the query.",
										jsxRuntimeExports.jsx("br", {}),
										"For example, If you want to check how many planet are destroyed , just add",
										jsxRuntimeExports.jsx(Typography$1, {
											color: "initial",
											backgroundColor: "#f5f5f5",
											component: "span",
											variant: "subtitle1",
											fontWeight: "500",
											p: 0.5,
											mx: 0.5,
											children: "?isDestroyed=true",
										}),
										" ",
										"to the URL.",
									],
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									component: "ul",
									mb: 2,
									children: [
										jsxRuntimeExports.jsx("li", {
											children: jsxRuntimeExports.jsxs(Typography$1, {
												variant: "body1",
												color: "inherit",
												mt: 2,
												children: [
													jsxRuntimeExports.jsx(Typography$1, {
														component: "span",
														backgroundColor: "#f5f5f5",
														fontWeight: "500",
														color: "text.secondary",
														px: 1,
														py: 0.5,
														mx: 0.5,
														children: "name",
													}),
													" ",
													"filter by the given name.",
												],
											}),
										}),
										jsxRuntimeExports.jsx("li", {
											children: jsxRuntimeExports.jsxs(Typography$1, {
												variant: "body1",
												color: "inherit",
												mt: 2,
												children: [
													jsxRuntimeExports.jsx(Typography$1, {
														component: "span",
														backgroundColor: "#f5f5f5",
														fontWeight: "500",
														color: "text.secondary",
														px: 1,
														py: 0.5,
														mx: 0.5,
														children: "isDestroyed",
													}),
													" ",
													"filter by the given gender ",
													"(",
													jsxRuntimeExports.jsx(Typography$1, {
														color: "text.secondary",
														backgroundColor: "#f5f5f5",
														component: "span",
														variant: "subtitle1",
														fontWeight: "500",
														p: 0.5,
														mx: 0.5,
														children: "true",
													}),
													" ",
													",",
													jsxRuntimeExports.jsx(Typography$1, {
														color: "text.secondary",
														backgroundColor: "#f5f5f5",
														component: "span",
														variant: "subtitle1",
														fontWeight: "500",
														p: 0.5,
														mx: 0.5,
														children: "false",
													}),
													" ",
													")",
												],
											}),
										}),
									],
								}),
								jsxRuntimeExports.jsx(Alert$1, {
									sx: {
										p: 1,
										display: "flex",
										alignItems: "center",
										borderLeft: "8px solid #FF9801",
										bgcolor: "#FFE2C3",
									},
									severity: "warning",
									children: jsxRuntimeExports.jsx(Typography$1, {
										variant: "body1",
										color: "text.secondary",
										fontStyle: "italic",
										children: "Filters dont have Pagination!",
									}),
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 3,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.filterPlanets,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.filterPlanets,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 3,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									id: "characterplanets",
									variant: "h4",
									component: "h3",
									color: "initial",
									fontWeight: "700",
									mt: 6,
									children: "Characters of a planet",
								}),
								jsxRuntimeExports.jsx(Typography$1, {
									variant: "body1",
									mt: 2,
									children:
										"It is an array of characters who live on that planet. If there are no characters, the array will be empty.",
								}),
								jsxRuntimeExports.jsx(Alert$1, {
									sx: {
										mt: 2,
										p: 1,
										borderLeft: "8px solid #FF9801",
										bgcolor: "#FFE2C3",
										display: "flex",
										alignItems: "center",
									},
									severity: "warning",
									children: jsxRuntimeExports.jsx(Typography$1, {
										variant: "body1",
										color: "text.secondary",
										fontStyle: "italic",
										children: "Some planets dont have characters associated!",
									}),
								}),
								jsxRuntimeExports.jsxs(Box$1, {
									sx: {
										backgroundColor: "rgb(32, 35, 41)",
										p: 2,
										borderRadius: 2,
										overflow: "auto",
										mt: 3,
									},
									children: [
										jsxRuntimeExports.jsxs(Stack$1, {
											direction: "row",
											gap: 2,
											sx: { mt: 1, pb: 3, px: 2, borderBottom: "1px solid lavender" },
											mb: 2,
											children: [
												jsxRuntimeExports.jsx(Typography$1, {
													component: "h3",
													variant: "subtitle1",
													color: "#54F157",
													fontWeight: "bold",
													children: "GET",
												}),
												jsxRuntimeExports.jsx(Typography$1, {
													variant: "subtitle1",
													color: "whitesmoke",
													fontWeight: "bold",
													children: apiUrl.singlePlanetNoCharacter,
												}),
											],
										}),
										jsxRuntimeExports.jsx(JsonView, {
											src: o == null ? void 0 : o.singlePlanetNoCharacter,
											displaySize: "small",
											dark: !0,
											theme: "vscode",
											collapsed: 3,
											collapseStringsAfterLength: 50,
											enableClipboard: !1,
										}),
									],
								}),
							],
						}),
					}),
				],
			})
		);
	};
function App() {
	return jsxRuntimeExports.jsx(HelmetProvider, {
		children: jsxRuntimeExports.jsxs(BrowserRouter, {
			children: [
				jsxRuntimeExports.jsx(libExports.ScrollToTop, {}),
				jsxRuntimeExports.jsx(Routes, {
					children: jsxRuntimeExports.jsxs(Route, {
						path: "/",
						element: jsxRuntimeExports.jsx(Layout, {}),
						children: [
							jsxRuntimeExports.jsx(Route, { index: !0, element: jsxRuntimeExports.jsx(Home, {}) }),
							jsxRuntimeExports.jsx(Route, {
								path: "/documentation",
								element: jsxRuntimeExports.jsx(Docs, {}),
							}),
							jsxRuntimeExports.jsx(Route, {
								path: "/about",
								element: jsxRuntimeExports.jsx(About, {}),
							}),
							jsxRuntimeExports.jsx(Route, {
								path: "/support",
								element: jsxRuntimeExports.jsx(Support, {}),
							}),
							jsxRuntimeExports.jsx(Route, {
								path: "/*",
								element: jsxRuntimeExports.jsx(NotFound, {}),
							}),
						],
					}),
				}),
			],
		}),
	});
}
const index = "",
	theme = createTheme({
		palette: {
			primary: { dark: yellow$1[800], main: yellow$1[700], light: yellow$1[100] },
			secondary: { dark: grey$1[900], main: grey$1[500], light: grey$1[100] },
			text: { primary: grey$1[700], secondary: grey$1[600] },
			background: { paper: grey$1[400] },
		},
		typography: {
			h1: { fontSize: "40px" },
			h2: { fontSize: "36px" },
			h3: { fontSize: "32px" },
			h4: { fontSize: "28px" },
			h5: { fontSize: "24px" },
			h6: { fontSize: "20px" },
			body1: { fontSize: "18px", lineHeight: 1.8 },
		},
	}),
	_300 = "",
	_400 = "",
	_500 = "",
	_700 = "",
	_900 = "",
	queryClient = new QueryClient();
client
	.createRoot(document.getElementById("root"))
	.render(
		jsxRuntimeExports.jsx(reactExports.StrictMode, {
			children: jsxRuntimeExports.jsxs(ThemeProvider, {
				theme,
				children: [
					jsxRuntimeExports.jsx(CssBaseline, {}),
					jsxRuntimeExports.jsx(QueryClientProvider, {
						client: queryClient,
						children: jsxRuntimeExports.jsx(App, {}),
					}),
				],
			}),
		})
	);
