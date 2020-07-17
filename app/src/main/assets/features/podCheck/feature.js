(function () {
'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var PreconditionFailure = (function (_super) {
    __extends(PreconditionFailure, _super);
    function PreconditionFailure(interruptExecution) {
        if (interruptExecution === void 0) { interruptExecution = false; }
        var _this = _super.call(this) || this;
        _this.interruptExecution = interruptExecution;
        _this.footprint = PreconditionFailure.SharedFootPrint;
        return _this;
    }
    PreconditionFailure.isFailure = function (err) {
        return err != null && err.footprint === PreconditionFailure.SharedFootPrint;
    };
    PreconditionFailure.SharedFootPrint = Symbol["for"]('fast-check/PreconditionFailure');
    return PreconditionFailure;
}(Error));

var pre = function (expectTruthy) {
    if (!expectTruthy) {
        throw new PreconditionFailure();
    }
};

var Nil = (function () {
    function Nil() {
    }
    Nil.prototype[Symbol.iterator] = function () {
        return this;
    };
    Nil.prototype.next = function (value) {
        return { value: value, done: true };
    };
    Nil.nil = new Nil();
    return Nil;
}());
function nilHelper() {
    return Nil.nil;
}
function mapHelper(g, f) {
    var g_1, g_1_1, v, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_1 = __values(g), g_1_1 = g_1.next();
                _b.label = 1;
            case 1:
                if (!!g_1_1.done) return [3, 4];
                v = g_1_1.value;
                return [4, f(v)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_1_1 = g_1.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_1_1 && !g_1_1.done && (_a = g_1["return"])) _a.call(g_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 7: return [2];
        }
    });
}
function flatMapHelper(g, f) {
    var g_2, g_2_1, v, e_2_1;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_2 = __values(g), g_2_1 = g_2.next();
                _b.label = 1;
            case 1:
                if (!!g_2_1.done) return [3, 4];
                v = g_2_1.value;
                return [5, __values(f(v))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_2_1 = g_2.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_2_1 = _b.sent();
                e_2 = { error: e_2_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_2_1 && !g_2_1.done && (_a = g_2["return"])) _a.call(g_2);
                }
                finally { if (e_2) throw e_2.error; }
                return [7];
            case 7: return [2];
        }
    });
}
function filterHelper(g, f) {
    var g_3, g_3_1, v, e_3_1;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_3 = __values(g), g_3_1 = g_3.next();
                _b.label = 1;
            case 1:
                if (!!g_3_1.done) return [3, 4];
                v = g_3_1.value;
                if (!f(v)) return [3, 3];
                return [4, v];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_3_1 = g_3.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_3_1 && !g_3_1.done && (_a = g_3["return"])) _a.call(g_3);
                }
                finally { if (e_3) throw e_3.error; }
                return [7];
            case 7: return [2];
        }
    });
}
function takeWhileHelper(g, f) {
    var cur;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cur = g.next();
                _a.label = 1;
            case 1:
                if (!(!cur.done && f(cur.value))) return [3, 3];
                return [4, cur.value];
            case 2:
                _a.sent();
                cur = g.next();
                return [3, 1];
            case 3: return [2];
        }
    });
}
function joinHelper(g, others) {
    var cur, others_1, others_1_1, s, cur, e_4_1;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cur = g.next();
                _b.label = 1;
            case 1:
                if (!!cur.done) return [3, 4];
                return [4, cur.value];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                cur = g.next();
                return [3, 1];
            case 4:
                _b.trys.push([4, 11, 12, 13]);
                others_1 = __values(others), others_1_1 = others_1.next();
                _b.label = 5;
            case 5:
                if (!!others_1_1.done) return [3, 10];
                s = others_1_1.value;
                cur = s.next();
                _b.label = 6;
            case 6:
                if (!!cur.done) return [3, 9];
                return [4, cur.value];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                cur = s.next();
                return [3, 6];
            case 9:
                others_1_1 = others_1.next();
                return [3, 5];
            case 10: return [3, 13];
            case 11:
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3, 13];
            case 12:
                try {
                    if (others_1_1 && !others_1_1.done && (_a = others_1["return"])) _a.call(others_1);
                }
                finally { if (e_4) throw e_4.error; }
                return [7];
            case 13: return [2];
        }
    });
}

var Stream = (function () {
    function Stream(g) {
        this.g = g;
    }
    Stream.nil = function () {
        return new Stream(nilHelper());
    };
    Stream.prototype.next = function () {
        return this.g.next();
    };
    Stream.prototype[Symbol.iterator] = function () {
        return this.g;
    };
    Stream.prototype.map = function (f) {
        return new Stream(mapHelper(this.g, f));
    };
    Stream.prototype.flatMap = function (f) {
        return new Stream(flatMapHelper(this.g, f));
    };
    Stream.prototype.dropWhile = function (f) {
        var foundEligible = false;
        function helper(v) {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(foundEligible || !f(v))) return [3, 2];
                        foundEligible = true;
                        return [4, v];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }
        return this.flatMap(helper);
    };
    Stream.prototype.drop = function (n) {
        var idx = 0;
        function helper() {
            return idx++ < n;
        }
        return this.dropWhile(helper);
    };
    Stream.prototype.takeWhile = function (f) {
        return new Stream(takeWhileHelper(this.g, f));
    };
    Stream.prototype.take = function (n) {
        var idx = 0;
        function helper() {
            return idx++ < n;
        }
        return this.takeWhile(helper);
    };
    Stream.prototype.filter = function (f) {
        return new Stream(filterHelper(this.g, f));
    };
    Stream.prototype.every = function (f) {
        var e_1, _a;
        try {
            for (var _b = __values(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (!f(v)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    Stream.prototype.has = function (f) {
        var e_2, _a;
        try {
            for (var _b = __values(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (f(v)) {
                    return [true, v];
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return [false, null];
    };
    Stream.prototype.join = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return new Stream(joinHelper(this.g, others));
    };
    Stream.prototype.getNthOrLast = function (nth) {
        var e_3, _a;
        var remaining = nth;
        var last = null;
        try {
            for (var _b = __values(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (remaining-- === 0)
                    return v;
                last = v;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return last;
    };
    return Stream;
}());
function stream(g) {
    return new Stream(g);
}

var cloneMethod = Symbol["for"]('fast-check/cloneMethod');
var hasCloneMethod = function (instance) {
    return instance instanceof Object && typeof instance[cloneMethod] === 'function';
};

var Shrinkable = (function () {
    function Shrinkable(value_, shrink) {
        if (shrink === void 0) { shrink = function () { return Stream.nil(); }; }
        this.value_ = value_;
        this.shrink = shrink;
        this.hasToBeCloned = hasCloneMethod(value_);
        this.readOnce = false;
        Object.defineProperty(this, 'value', { get: this.getValue });
    }
    Shrinkable.prototype.getValue = function () {
        if (this.hasToBeCloned) {
            if (!this.readOnce) {
                this.readOnce = true;
                return this.value_;
            }
            return this.value_[cloneMethod]();
        }
        return this.value_;
    };
    Shrinkable.prototype.applyMapper = function (mapper) {
        var _this = this;
        if (this.hasToBeCloned) {
            var out = mapper(this.value);
            if (out instanceof Object) {
                out[cloneMethod] = function () { return mapper(_this.value); };
            }
            return out;
        }
        return mapper(this.value);
    };
    Shrinkable.prototype.map = function (mapper) {
        var _this = this;
        return new Shrinkable(this.applyMapper(mapper), function () { return _this.shrink().map(function (v) { return v.map(mapper); }); });
    };
    Shrinkable.prototype.filter = function (refinement) {
        var _this = this;
        var refinementOnShrinkable = function (s) {
            return refinement(s.value);
        };
        return new Shrinkable(this.value, function () {
            return _this.shrink()
                .filter(refinementOnShrinkable)
                .map(function (v) { return v.filter(refinement); });
        });
    };
    return Shrinkable;
}());

var Arbitrary = (function () {
    function Arbitrary() {
    }
    Arbitrary.prototype.filter = function (refinement) {
        var arb = this;
        var refinementOnShrinkable = function (s) {
            return refinement(s.value);
        };
        return new ((function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.generate = function (mrng) {
                var g = arb.generate(mrng);
                while (!refinementOnShrinkable(g)) {
                    g = arb.generate(mrng);
                }
                return g.filter(refinement);
            };
            class_1.prototype.withBias = function (freq) {
                return arb.withBias(freq).filter(refinement);
            };
            return class_1;
        }(Arbitrary)))();
    };
    Arbitrary.prototype.map = function (mapper) {
        var arb = this;
        return new ((function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_2.prototype.generate = function (mrng) {
                return arb.generate(mrng).map(mapper);
            };
            class_2.prototype.withBias = function (freq) {
                return arb.withBias(freq).map(mapper);
            };
            return class_2;
        }(Arbitrary)))();
    };
    Arbitrary.shrinkChain = function (mrng, src, dst, fmapper) {
        return new Shrinkable(dst.value, function () {
            return src
                .shrink()
                .map(function (v) {
                return Arbitrary.shrinkChain(mrng.clone(), v, fmapper(v.value).generate(mrng.clone()), fmapper);
            })
                .join(dst.shrink());
        });
    };
    Arbitrary.prototype.chain = function (fmapper) {
        var arb = this;
        return new ((function (_super) {
            __extends(class_3, _super);
            function class_3() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_3.prototype.generate = function (mrng) {
                var clonedMrng = mrng.clone();
                var src = arb.generate(mrng);
                var dst = fmapper(src.value).generate(mrng);
                return Arbitrary.shrinkChain(clonedMrng, src, dst, fmapper);
            };
            class_3.prototype.withBias = function (freq) {
                return arb.withBias(freq).chain(function (t) { return fmapper(t).withBias(freq); });
            };
            return class_3;
        }(Arbitrary)))();
    };
    Arbitrary.prototype.noShrink = function () {
        var arb = this;
        return new ((function (_super) {
            __extends(class_4, _super);
            function class_4() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_4.prototype.generate = function (mrng) {
                return new Shrinkable(arb.generate(mrng).value);
            };
            class_4.prototype.withBias = function (freq) {
                return arb.withBias(freq).noShrink();
            };
            return class_4;
        }(Arbitrary)))();
    };
    Arbitrary.prototype.withBias = function (_freq) {
        return this;
    };
    Arbitrary.prototype.noBias = function () {
        var arb = this;
        return new ((function (_super) {
            __extends(class_5, _super);
            function class_5() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_5.prototype.generate = function (mrng) {
                return arb.generate(mrng);
            };
            return class_5;
        }(Arbitrary)))();
    };
    return Arbitrary;
}());

var GenericTupleArbitrary = (function (_super) {
    __extends(GenericTupleArbitrary, _super);
    function GenericTupleArbitrary(arbs) {
        var _this = _super.call(this) || this;
        _this.arbs = arbs;
        for (var idx = 0; idx !== arbs.length; ++idx) {
            var arb = arbs[idx];
            if (arb == null || arb.generate == null)
                throw new Error("Invalid parameter encountered at index " + idx + ": expecting an Arbitrary");
        }
        return _this;
    }
    GenericTupleArbitrary.makeItCloneable = function (vs, shrinkables) {
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            GenericTupleArbitrary.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    GenericTupleArbitrary.wrapper = function (shrinkables) {
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== shrinkables.length; ++idx) {
            var s = shrinkables[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            GenericTupleArbitrary.makeItCloneable(vs, shrinkables);
        }
        return new Shrinkable(vs, function () { return GenericTupleArbitrary.shrinkImpl(shrinkables).map(GenericTupleArbitrary.wrapper); });
    };
    GenericTupleArbitrary.prototype.generate = function (mrng) {
        return GenericTupleArbitrary.wrapper(this.arbs.map(function (a) { return a.generate(mrng); }));
    };
    GenericTupleArbitrary.shrinkImpl = function (value) {
        var s = Stream.nil();
        var _loop_1 = function (idx) {
            s = s.join(value[idx].shrink().map(function (v) {
                return value
                    .slice(0, idx)
                    .concat([v])
                    .concat(value.slice(idx + 1));
            }));
        };
        for (var idx = 0; idx !== value.length; ++idx) {
            _loop_1(idx);
        }
        return s;
    };
    GenericTupleArbitrary.prototype.withBias = function (freq) {
        return new GenericTupleArbitrary(this.arbs.map(function (a) { return a.withBias(freq); }));
    };
    return GenericTupleArbitrary;
}(Arbitrary));
function genericTuple(arbs) {
    return new GenericTupleArbitrary(arbs);
}

function tuple() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    return new GenericTupleArbitrary(arbs);
}

var runIdToFrequency = function (runId) { return 2 + Math.floor(Math.log(runId + 1) / Math.log(10)); };

var AsyncProperty = (function () {
    function AsyncProperty(arb, predicate) {
        this.arb = arb;
        this.predicate = predicate;
        this.beforeEachHook = AsyncProperty.dummyHook;
        this.afterEachHook = AsyncProperty.dummyHook;
        this.isAsync = function () { return true; };
    }
    AsyncProperty.prototype.generate = function (mrng, runId) {
        return runId != null ? this.arb.withBias(runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
    };
    AsyncProperty.prototype.run = function (v) {
        return __awaiter(this, void 0, void 0, function () {
            var output, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.beforeEachHook()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 7]);
                        return [4, this.predicate(v)];
                    case 3:
                        output = _a.sent();
                        return [2, output == null || output === true ? null : 'Property failed by returning false'];
                    case 4:
                        err_1 = _a.sent();
                        if (PreconditionFailure.isFailure(err_1))
                            return [2, err_1];
                        if (err_1 instanceof Error && err_1.stack)
                            return [2, err_1 + "\n\nStack trace: " + err_1.stack];
                        return [2, "" + err_1];
                    case 5: return [4, this.afterEachHook()];
                    case 6:
                        _a.sent();
                        return [7];
                    case 7: return [2];
                }
            });
        });
    };
    AsyncProperty.prototype.beforeEach = function (hookFunction) {
        this.beforeEachHook = hookFunction;
        return this;
    };
    AsyncProperty.prototype.afterEach = function (hookFunction) {
        this.afterEachHook = hookFunction;
        return this;
    };
    AsyncProperty.dummyHook = function () { };
    return AsyncProperty;
}());

function asyncProperty() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2)
        throw new Error('asyncProperty expects at least two parameters');
    var arbs = args.slice(0, args.length - 1);
    var p = args[args.length - 1];
    return new AsyncProperty(genericTuple(arbs), function (t) { return p.apply(void 0, __spread(t)); });
}

var Property = (function () {
    function Property(arb, predicate) {
        this.arb = arb;
        this.predicate = predicate;
        this.beforeEachHook = Property.dummyHook;
        this.afterEachHook = Property.dummyHook;
        this.isAsync = function () { return false; };
    }
    Property.prototype.generate = function (mrng, runId) {
        return runId != null ? this.arb.withBias(runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
    };
    Property.prototype.run = function (v) {
        this.beforeEachHook();
        try {
            var output = this.predicate(v);
            return output == null || output === true ? null : 'Property failed by returning false';
        }
        catch (err) {
            if (PreconditionFailure.isFailure(err))
                return err;
            if (err instanceof Error && err.stack)
                return err + "\n\nStack trace: " + err.stack;
            return "" + err;
        }
        finally {
            this.afterEachHook();
        }
    };
    Property.prototype.beforeEach = function (hookFunction) {
        this.beforeEachHook = hookFunction;
        return this;
    };
    Property.prototype.afterEach = function (hookFunction) {
        this.afterEachHook = hookFunction;
        return this;
    };
    Property.dummyHook = function () { };
    return Property;
}());

function property() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2)
        throw new Error('property expects at least two parameters');
    var arbs = args.slice(0, args.length - 1);
    var p = args[args.length - 1];
    return new Property(genericTuple(arbs), function (t) { return p.apply(void 0, __spread(t)); });
}

var internalGlobalThis = (function (global) {
    return global.globalThis ? global.globalThis : global;
})(typeof undefined === 'object' ? undefined : Function('return this')());
var getGlobal = function () { return internalGlobalThis; };

var globalParametersSymbol = Symbol["for"]('fast-check/GlobalParameters');
var configureGlobal = function (parameters) {
    getGlobal()[globalParametersSymbol] = parameters;
};
var readConfigureGlobal = function () {
    return getGlobal()[globalParametersSymbol];
};
var resetConfigureGlobal = function () {
    delete getGlobal()[globalParametersSymbol];
};

function generateN(rng, num) {
    var cur = rng;
    var out = [];
    for (var idx = 0; idx != num; ++idx) {
        var nextOut = cur.next();
        out.push(nextOut[0]);
        cur = nextOut[1];
    }
    return [out, cur];
}
function skipN(rng, num) {
    return generateN(rng, num)[1];
}

var MULTIPLIER = 0x000343fd;
var INCREMENT = 0x00269ec3;
var MASK = 0xffffffff;
var MASK_2 = (1 << 31) - 1;
var computeNextSeed = function (seed) {
    return (seed * MULTIPLIER + INCREMENT) & MASK;
};
var computeValueFromNextSeed = function (nextseed) {
    return (nextseed & MASK_2) >> 16;
};
var LinearCongruential = (function () {
    function LinearCongruential(seed) {
        this.seed = seed;
    }
    LinearCongruential.prototype.min = function () {
        return LinearCongruential.min;
    };
    LinearCongruential.prototype.max = function () {
        return LinearCongruential.max;
    };
    LinearCongruential.prototype.next = function () {
        var nextseed = computeNextSeed(this.seed);
        return [computeValueFromNextSeed(nextseed), new LinearCongruential(nextseed)];
    };
    LinearCongruential.min = 0;
    LinearCongruential.max = Math.pow(2, 15) - 1;
    return LinearCongruential;
}());
var LinearCongruential32 = (function () {
    function LinearCongruential32(seed) {
        this.seed = seed;
    }
    LinearCongruential32.prototype.min = function () {
        return LinearCongruential32.min;
    };
    LinearCongruential32.prototype.max = function () {
        return LinearCongruential32.max;
    };
    LinearCongruential32.prototype.next = function () {
        var s1 = computeNextSeed(this.seed);
        var v1 = computeValueFromNextSeed(s1);
        var s2 = computeNextSeed(s1);
        var v2 = computeValueFromNextSeed(s2);
        var s3 = computeNextSeed(s2);
        var v3 = computeValueFromNextSeed(s3);
        var vnext = v3 + ((v2 + (v1 << 15)) << 15);
        return [((vnext + 0x80000000) | 0) + 0x80000000, new LinearCongruential32(s3)];
    };
    LinearCongruential32.min = 0;
    LinearCongruential32.max = 0xffffffff;
    return LinearCongruential32;
}());
var congruential = function (seed) {
    return new LinearCongruential(seed);
};
var congruential32 = function (seed) {
    return new LinearCongruential32(seed);
};

function toUint32(num) {
    return (num | 0) >= 0 ? num | 0 : (num | 0) + 4294967296;
}
function product32bits(a, b) {
    var alo = a & 0xffff;
    var ahi = (a >>> 16) & 0xffff;
    var blo = b & 0xffff;
    var bhi = (b >>> 16) & 0xffff;
    return alo * blo + ((alo * bhi + ahi * blo) << 16);
}
var MersenneTwister = (function () {
    function MersenneTwister(states, index) {
        if (index >= MersenneTwister.N) {
            this.states = MersenneTwister.twist(states);
            this.index = 0;
        }
        else {
            this.states = states;
            this.index = index;
        }
    }
    MersenneTwister.twist = function (prev) {
        var mt = prev.slice();
        for (var idx = 0; idx !== MersenneTwister.N - MersenneTwister.M; ++idx) {
            var y_1 = (mt[idx] & MersenneTwister.MASK_UPPER) + (mt[idx + 1] & MersenneTwister.MASK_LOWER);
            mt[idx] = mt[idx + MersenneTwister.M] ^ (y_1 >>> 1) ^ (-(y_1 & 1) & MersenneTwister.A);
        }
        for (var idx = MersenneTwister.N - MersenneTwister.M; idx !== MersenneTwister.N - 1; ++idx) {
            var y_2 = (mt[idx] & MersenneTwister.MASK_UPPER) + (mt[idx + 1] & MersenneTwister.MASK_LOWER);
            mt[idx] = mt[idx + MersenneTwister.M - MersenneTwister.N] ^ (y_2 >>> 1) ^ (-(y_2 & 1) & MersenneTwister.A);
        }
        var y = (mt[MersenneTwister.N - 1] & MersenneTwister.MASK_UPPER) + (mt[0] & MersenneTwister.MASK_LOWER);
        mt[MersenneTwister.N - 1] = mt[MersenneTwister.M - 1] ^ (y >>> 1) ^ (-(y & 1) & MersenneTwister.A);
        return mt;
    };
    MersenneTwister.seeded = function (seed) {
        var out = Array(MersenneTwister.N);
        out[0] = seed;
        for (var idx = 1; idx !== MersenneTwister.N; ++idx) {
            var xored = out[idx - 1] ^ (out[idx - 1] >>> 30);
            out[idx] = (product32bits(MersenneTwister.F, xored) + idx) | 0;
        }
        return out;
    };
    MersenneTwister.from = function (seed) {
        return new MersenneTwister(MersenneTwister.seeded(seed), MersenneTwister.N);
    };
    MersenneTwister.prototype.min = function () {
        return MersenneTwister.min;
    };
    MersenneTwister.prototype.max = function () {
        return MersenneTwister.max;
    };
    MersenneTwister.prototype.next = function () {
        var y = this.states[this.index];
        y ^= this.states[this.index] >>> MersenneTwister.U;
        y ^= (y << MersenneTwister.S) & MersenneTwister.B;
        y ^= (y << MersenneTwister.T) & MersenneTwister.C;
        y ^= y >>> MersenneTwister.L;
        return [toUint32(y), new MersenneTwister(this.states, this.index + 1)];
    };
    MersenneTwister.min = 0;
    MersenneTwister.max = 0xffffffff;
    MersenneTwister.N = 624;
    MersenneTwister.M = 397;
    MersenneTwister.R = 31;
    MersenneTwister.A = 0x9908b0df;
    MersenneTwister.F = 1812433253;
    MersenneTwister.U = 11;
    MersenneTwister.S = 7;
    MersenneTwister.B = 0x9d2c5680;
    MersenneTwister.T = 15;
    MersenneTwister.C = 0xefc60000;
    MersenneTwister.L = 18;
    MersenneTwister.MASK_LOWER = Math.pow(2, MersenneTwister.R) - 1;
    MersenneTwister.MASK_UPPER = Math.pow(2, MersenneTwister.R);
    return MersenneTwister;
}());
function MersenneTwister$1 (seed) {
    return MersenneTwister.from(seed);
}

var XorShift128Plus = (function () {
    function XorShift128Plus(s01, s00, s11, s10) {
        this.s01 = s01;
        this.s00 = s00;
        this.s11 = s11;
        this.s10 = s10;
    }
    XorShift128Plus.prototype.min = function () {
        return -0x80000000;
    };
    XorShift128Plus.prototype.max = function () {
        return 0x7fffffff;
    };
    XorShift128Plus.prototype.next = function () {
        var a0 = this.s00 ^ (this.s00 << 23);
        var a1 = this.s01 ^ ((this.s01 << 23) | (this.s00 >>> 9));
        var b0 = a0 ^ this.s10 ^ ((a0 >>> 18) | (a1 << 14)) ^ ((this.s10 >>> 5) | (this.s11 << 27));
        var b1 = a1 ^ this.s11 ^ (a1 >>> 18) ^ (this.s11 >>> 5);
        return [(this.s00 + this.s10) | 0, new XorShift128Plus(this.s11, this.s10, b1, b0)];
    };
    XorShift128Plus.prototype.jump = function () {
        var rngRunner = this;
        var ns01 = 0;
        var ns00 = 0;
        var ns11 = 0;
        var ns10 = 0;
        var jump = [0x635d2dff, 0x8a5cd789, 0x5c472f96, 0x121fd215];
        for (var i = 0; i !== 4; ++i) {
            for (var mask = 1; mask; mask <<= 1) {
                if (jump[i] & mask) {
                    ns01 ^= rngRunner.s01;
                    ns00 ^= rngRunner.s00;
                    ns11 ^= rngRunner.s11;
                    ns10 ^= rngRunner.s10;
                }
                rngRunner = rngRunner.next()[1];
            }
        }
        return new XorShift128Plus(ns01, ns00, ns11, ns10);
    };
    return XorShift128Plus;
}());
var xorshift128plus = function (seed) {
    return new XorShift128Plus(-1, ~seed, seed | 0, 0);
};

var XoroShiro128Plus = (function () {
    function XoroShiro128Plus(s01, s00, s11, s10) {
        this.s01 = s01;
        this.s00 = s00;
        this.s11 = s11;
        this.s10 = s10;
    }
    XoroShiro128Plus.prototype.min = function () {
        return -0x80000000;
    };
    XoroShiro128Plus.prototype.max = function () {
        return 0x7fffffff;
    };
    XoroShiro128Plus.prototype.next = function () {
        var a0 = this.s10 ^ this.s00;
        var a1 = this.s11 ^ this.s01;
        var ns00 = (this.s00 << 24) ^ (this.s01 >>> 8) ^ a0 ^ (a0 << 16);
        var ns01 = (this.s01 << 24) ^ (this.s00 >>> 8) ^ a1 ^ ((a1 << 16) | (a0 >>> 16));
        var ns10 = (a1 << 5) ^ (a0 >>> 27);
        var ns11 = (a0 << 5) ^ (a1 >>> 27);
        return [(this.s00 + this.s10) | 0, new XoroShiro128Plus(ns01, ns00, ns11, ns10)];
    };
    XoroShiro128Plus.prototype.jump = function () {
        var rngRunner = this;
        var ns01 = 0;
        var ns00 = 0;
        var ns11 = 0;
        var ns10 = 0;
        var jump = [0xd8f554a5, 0xdf900294, 0x4b3201fc, 0x170865df];
        for (var i = 0; i !== 4; ++i) {
            for (var mask = 1; mask; mask <<= 1) {
                if (jump[i] & mask) {
                    ns01 ^= rngRunner.s01;
                    ns00 ^= rngRunner.s00;
                    ns11 ^= rngRunner.s11;
                    ns10 ^= rngRunner.s10;
                }
                rngRunner = rngRunner.next()[1];
            }
        }
        return new XoroShiro128Plus(ns01, ns00, ns11, ns10);
    };
    return XoroShiro128Plus;
}());
var xoroshiro128plus = function (seed) {
    return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
};

function uniformBigIntInternal(from, diff, rng) {
    var MinRng = BigInt(rng.min());
    var NumValues = BigInt(rng.max() - rng.min() + 1);
    var FinalNumValues = NumValues;
    var NumIterations = BigInt(1);
    while (FinalNumValues < diff) {
        FinalNumValues *= NumValues;
        ++NumIterations;
    }
    var MaxAcceptedRandom = FinalNumValues - (FinalNumValues % diff);
    var nrng = rng;
    while (true) {
        var value = BigInt(0);
        for (var num = BigInt(0); num !== NumIterations; ++num) {
            var out = nrng.next();
            value = NumValues * value + (BigInt(out[0]) - MinRng);
            nrng = out[1];
        }
        if (value < MaxAcceptedRandom) {
            var inDiff = value - diff * (value / diff);
            return [inDiff + from, nrng];
        }
    }
}
function uniformBigIntDistribution(from, to, rng) {
    var diff = to - from + BigInt(1);
    if (rng != null) {
        return uniformBigIntInternal(from, diff, rng);
    }
    return function (rng) {
        return uniformBigIntInternal(from, diff, rng);
    };
}

function uniformIntInternal(from, diff, rng) {
    var MinRng = rng.min();
    var NumValues = rng.max() - rng.min() + 1;
    if (diff <= NumValues) {
        var nrng_1 = rng;
        var MaxAllowed = NumValues - (NumValues % diff);
        while (true) {
            var out = nrng_1.next();
            var deltaV = out[0] - MinRng;
            nrng_1 = out[1];
            if (deltaV < MaxAllowed) {
                return [(deltaV % diff) + from, nrng_1];
            }
        }
    }
    var FinalNumValues = 1;
    var NumIterations = 0;
    while (FinalNumValues < diff) {
        FinalNumValues *= NumValues;
        ++NumIterations;
    }
    var MaxAcceptedRandom = diff * Math.floor((1 * FinalNumValues) / diff);
    var nrng = rng;
    while (true) {
        var value = 0;
        for (var num = 0; num !== NumIterations; ++num) {
            var out = nrng.next();
            value = NumValues * value + (out[0] - MinRng);
            nrng = out[1];
        }
        if (value < MaxAcceptedRandom) {
            var inDiff = value - diff * Math.floor((1 * value) / diff);
            return [inDiff + from, nrng];
        }
    }
}
function uniformIntDistribution(from, to, rng) {
    var diff = to - from + 1;
    if (rng != null) {
        return uniformIntInternal(from, diff, rng);
    }
    return function (rng) {
        return uniformIntInternal(from, diff, rng);
    };
}

var prand = /*#__PURE__*/Object.freeze({
__proto__: null,
generateN: generateN,
skipN: skipN,
congruential: congruential,
congruential32: congruential32,
mersenne: MersenneTwister$1,
xorshift128plus: xorshift128plus,
xoroshiro128plus: xoroshiro128plus,
uniformBigIntDistribution: uniformBigIntDistribution,
uniformIntDistribution: uniformIntDistribution
});

var VerbosityLevel;
(function (VerbosityLevel) {
    VerbosityLevel[VerbosityLevel["None"] = 0] = "None";
    VerbosityLevel[VerbosityLevel["Verbose"] = 1] = "Verbose";
    VerbosityLevel[VerbosityLevel["VeryVerbose"] = 2] = "VeryVerbose";
})(VerbosityLevel || (VerbosityLevel = {}));

var QualifiedParameters = (function () {
    function QualifiedParameters(op) {
        var p = op || {};
        this.seed = QualifiedParameters.readSeed(p);
        this.randomType = QualifiedParameters.readRandomType(p);
        this.numRuns = QualifiedParameters.readNumRuns(p);
        this.verbose = QualifiedParameters.readVerbose(p);
        this.maxSkipsPerRun = QualifiedParameters.readOrDefault(p, 'maxSkipsPerRun', 100);
        this.timeout = QualifiedParameters.readOrDefault(p, 'timeout', null);
        this.skipAllAfterTimeLimit = QualifiedParameters.readOrDefault(p, 'skipAllAfterTimeLimit', null);
        this.interruptAfterTimeLimit = QualifiedParameters.readOrDefault(p, 'interruptAfterTimeLimit', null);
        this.markInterruptAsFailure = QualifiedParameters.readBoolean(p, 'markInterruptAsFailure');
        this.logger = QualifiedParameters.readOrDefault(p, 'logger', function (v) {
            console.log(v);
        });
        this.path = QualifiedParameters.readOrDefault(p, 'path', '');
        this.unbiased = QualifiedParameters.readBoolean(p, 'unbiased');
        this.examples = QualifiedParameters.readOrDefault(p, 'examples', []);
        this.endOnFailure = QualifiedParameters.readBoolean(p, 'endOnFailure');
        this.reporter = QualifiedParameters.readOrDefault(p, 'reporter', null);
        this.asyncReporter = QualifiedParameters.readOrDefault(p, 'asyncReporter', null);
    }
    QualifiedParameters.prototype.toParameters = function () {
        var orUndefined = function (value) { return (value !== null ? value : undefined); };
        return {
            seed: this.seed,
            randomType: this.randomType,
            numRuns: this.numRuns,
            maxSkipsPerRun: this.maxSkipsPerRun,
            timeout: orUndefined(this.timeout),
            skipAllAfterTimeLimit: orUndefined(this.skipAllAfterTimeLimit),
            interruptAfterTimeLimit: orUndefined(this.interruptAfterTimeLimit),
            markInterruptAsFailure: this.markInterruptAsFailure,
            path: this.path,
            logger: this.logger,
            unbiased: this.unbiased,
            verbose: this.verbose,
            examples: this.examples,
            endOnFailure: this.endOnFailure,
            reporter: orUndefined(this.reporter),
            asyncReporter: orUndefined(this.asyncReporter)
        };
    };
    QualifiedParameters.read = function (op) {
        return new QualifiedParameters(op);
    };
    QualifiedParameters.readSeed = function (p) {
        if (p.seed == null)
            return Date.now() ^ (Math.random() * 0x100000000);
        var seed32 = p.seed | 0;
        if (p.seed === seed32)
            return seed32;
        var gap = p.seed - seed32;
        return seed32 ^ (gap * 0x100000000);
    };
    QualifiedParameters.readRandomType = function (p) {
        if (p.randomType == null)
            return prand.xorshift128plus;
        if (typeof p.randomType === 'string') {
            switch (p.randomType) {
                case 'mersenne':
                    return prand.mersenne;
                case 'congruential':
                    return prand.congruential;
                case 'congruential32':
                    return prand.congruential32;
                case 'xorshift128plus':
                    return prand.xorshift128plus;
                case 'xoroshiro128plus':
                    return prand.xoroshiro128plus;
                default:
                    throw new Error("Invalid random specified: '" + p.randomType + "'");
            }
        }
        return p.randomType;
    };
    QualifiedParameters.readNumRuns = function (p) {
        var defaultValue = 100;
        if (p.numRuns != null)
            return p.numRuns;
        if (p.num_runs != null)
            return p.num_runs;
        return defaultValue;
    };
    QualifiedParameters.readVerbose = function (p) {
        if (p.verbose == null)
            return VerbosityLevel.None;
        if (typeof p.verbose === 'boolean') {
            return p.verbose === true ? VerbosityLevel.Verbose : VerbosityLevel.None;
        }
        if (p.verbose <= VerbosityLevel.None) {
            return VerbosityLevel.None;
        }
        if (p.verbose >= VerbosityLevel.VeryVerbose) {
            return VerbosityLevel.VeryVerbose;
        }
        return p.verbose | 0;
    };
    QualifiedParameters.readBoolean = function (p, key) { return p[key] === true; };
    QualifiedParameters.readOrDefault = function (p, key, defaultValue) { return (p[key] != null ? p[key] : defaultValue); };
    return QualifiedParameters;
}());

var SkipAfterProperty = (function () {
    function SkipAfterProperty(property, getTime, timeLimit, interruptExecution) {
        var _this = this;
        this.property = property;
        this.getTime = getTime;
        this.interruptExecution = interruptExecution;
        this.isAsync = function () { return _this.property.isAsync(); };
        this.generate = function (mrng, runId) { return _this.property.generate(mrng, runId); };
        this.run = function (v) {
            if (_this.getTime() >= _this.skipAfterTime) {
                var preconditionFailure = new PreconditionFailure(_this.interruptExecution);
                if (_this.isAsync()) {
                    return Promise.resolve(preconditionFailure);
                }
                else {
                    return preconditionFailure;
                }
            }
            return _this.property.run(v);
        };
        this.skipAfterTime = this.getTime() + timeLimit;
    }
    return SkipAfterProperty;
}());

var timeoutAfter = function (timeMs) {
    var timeoutHandle = null;
    var promise = new Promise(function (resolve) {
        timeoutHandle = setTimeout(function () {
            resolve("Property timeout: exceeded limit of " + timeMs + " milliseconds");
        }, timeMs);
    });
    return {
        clear: function () { return clearTimeout(timeoutHandle); },
        promise: promise
    };
};
var TimeoutProperty = (function () {
    function TimeoutProperty(property, timeMs) {
        this.property = property;
        this.timeMs = timeMs;
        this.isAsync = function () { return true; };
    }
    TimeoutProperty.prototype.generate = function (mrng, runId) {
        return this.property.generate(mrng, runId);
    };
    TimeoutProperty.prototype.run = function (v) {
        return __awaiter(this, void 0, void 0, function () {
            var t, propRun;
            return __generator(this, function (_a) {
                t = timeoutAfter(this.timeMs);
                propRun = Promise.race([this.property.run(v), t.promise]);
                propRun.then(t.clear, t.clear);
                return [2, propRun];
            });
        });
    };
    return TimeoutProperty;
}());

var UnbiasedProperty = (function () {
    function UnbiasedProperty(property) {
        var _this = this;
        this.property = property;
        this.isAsync = function () { return _this.property.isAsync(); };
        this.generate = function (mrng, _runId) { return _this.property.generate(mrng); };
        this.run = function (v) { return _this.property.run(v); };
    }
    return UnbiasedProperty;
}());

function decorateProperty(rawProperty, qParams) {
    var prop = rawProperty;
    if (rawProperty.isAsync() && qParams.timeout != null)
        prop = new TimeoutProperty(prop, qParams.timeout);
    if (qParams.unbiased === true)
        prop = new UnbiasedProperty(prop);
    if (qParams.skipAllAfterTimeLimit != null)
        prop = new SkipAfterProperty(prop, Date.now, qParams.skipAllAfterTimeLimit, false);
    if (qParams.interruptAfterTimeLimit != null)
        prop = new SkipAfterProperty(prop, Date.now, qParams.interruptAfterTimeLimit, true);
    return prop;
}

var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus[ExecutionStatus["Success"] = 0] = "Success";
    ExecutionStatus[ExecutionStatus["Skipped"] = -1] = "Skipped";
    ExecutionStatus[ExecutionStatus["Failure"] = 1] = "Failure";
})(ExecutionStatus || (ExecutionStatus = {}));

var RunExecution = (function () {
    function RunExecution(verbosity, interruptedAsFailure) {
        var _this = this;
        this.verbosity = verbosity;
        this.interruptedAsFailure = interruptedAsFailure;
        this.isSuccess = function () { return _this.pathToFailure == null; };
        this.firstFailure = function () { return (_this.pathToFailure ? +_this.pathToFailure.split(':')[0] : -1); };
        this.numShrinks = function () { return (_this.pathToFailure ? _this.pathToFailure.split(':').length - 1 : 0); };
        this.rootExecutionTrees = [];
        this.currentLevelExecutionTrees = this.rootExecutionTrees;
        this.failure = null;
        this.numSkips = 0;
        this.numSuccesses = 0;
        this.interrupted = false;
    }
    RunExecution.prototype.appendExecutionTree = function (status, value) {
        var currentTree = { status: status, value: value, children: [] };
        this.currentLevelExecutionTrees.push(currentTree);
        return currentTree;
    };
    RunExecution.prototype.fail = function (value, id, message) {
        if (this.verbosity >= VerbosityLevel.Verbose) {
            var currentTree = this.appendExecutionTree(ExecutionStatus.Failure, value);
            this.currentLevelExecutionTrees = currentTree.children;
        }
        if (this.pathToFailure == null)
            this.pathToFailure = "" + id;
        else
            this.pathToFailure += ":" + id;
        this.value = value;
        this.failure = message;
    };
    RunExecution.prototype.skip = function (value) {
        if (this.verbosity >= VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus.Skipped, value);
        }
        if (this.pathToFailure == null) {
            ++this.numSkips;
        }
    };
    RunExecution.prototype.success = function (value) {
        if (this.verbosity >= VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus.Success, value);
        }
        if (this.pathToFailure == null) {
            ++this.numSuccesses;
        }
    };
    RunExecution.prototype.interrupt = function () {
        this.interrupted = true;
    };
    RunExecution.prototype.extractFailures = function () {
        if (this.isSuccess()) {
            return [];
        }
        var failures = [];
        var cursor = this.rootExecutionTrees;
        while (cursor.length > 0 && cursor[cursor.length - 1].status === ExecutionStatus.Failure) {
            var failureTree = cursor[cursor.length - 1];
            failures.push(failureTree.value);
            cursor = failureTree.children;
        }
        return failures;
    };
    RunExecution.prototype.toRunDetails = function (seed, basePath, numRuns, maxSkips, qParams) {
        if (!this.isSuccess()) {
            return {
                failed: true,
                interrupted: this.interrupted,
                numRuns: this.firstFailure() + 1 - this.numSkips,
                numSkips: this.numSkips,
                numShrinks: this.numShrinks(),
                seed: seed,
                counterexample: this.value,
                counterexamplePath: RunExecution.mergePaths(basePath, this.pathToFailure),
                error: this.failure,
                failures: this.extractFailures(),
                executionSummary: this.rootExecutionTrees,
                verbose: this.verbosity,
                runConfiguration: qParams.toParameters()
            };
        }
        var failed = this.numSkips > maxSkips || (this.interrupted && this.interruptedAsFailure);
        return {
            failed: failed,
            interrupted: this.interrupted,
            numRuns: this.numSuccesses,
            numSkips: this.numSkips,
            numShrinks: 0,
            seed: seed,
            counterexample: null,
            counterexamplePath: null,
            error: null,
            failures: [],
            executionSummary: this.rootExecutionTrees,
            verbose: this.verbosity,
            runConfiguration: qParams.toParameters()
        };
    };
    RunExecution.mergePaths = function (offsetPath, path) {
        if (offsetPath.length === 0)
            return path;
        var offsetItems = offsetPath.split(':');
        var remainingItems = path.split(':');
        var middle = +offsetItems[offsetItems.length - 1] + +remainingItems[0];
        return __spread(offsetItems.slice(0, offsetItems.length - 1), ["" + middle], remainingItems.slice(1)).join(':');
    };
    return RunExecution;
}());

var RunnerIterator = (function () {
    function RunnerIterator(sourceValues, verbose, interruptedAsFailure) {
        this.sourceValues = sourceValues;
        this.runExecution = new RunExecution(verbose, interruptedAsFailure);
        this.currentIdx = -1;
        this.nextValues = sourceValues;
    }
    RunnerIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    RunnerIterator.prototype.next = function (value) {
        var nextValue = this.nextValues.next();
        if (nextValue.done || this.runExecution.interrupted) {
            return { done: true, value: value };
        }
        this.currentShrinkable = nextValue.value;
        ++this.currentIdx;
        return { done: false, value: nextValue.value.value_ };
    };
    RunnerIterator.prototype.handleResult = function (result) {
        if (result != null && typeof result === 'string') {
            this.runExecution.fail(this.currentShrinkable.value_, this.currentIdx, result);
            this.currentIdx = -1;
            this.nextValues = this.currentShrinkable.shrink();
        }
        else if (result != null) {
            if (!result.interruptExecution) {
                this.runExecution.skip(this.currentShrinkable.value_);
                this.sourceValues.skippedOne();
            }
            else {
                this.runExecution.interrupt();
            }
        }
        else {
            this.runExecution.success(this.currentShrinkable.value_);
        }
    };
    return RunnerIterator;
}());

var SourceValuesIterator = (function () {
    function SourceValuesIterator(initialValues, maxInitialIterations, remainingSkips) {
        this.initialValues = initialValues;
        this.maxInitialIterations = maxInitialIterations;
        this.remainingSkips = remainingSkips;
    }
    SourceValuesIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    SourceValuesIterator.prototype.next = function (value) {
        if (--this.maxInitialIterations !== -1 && this.remainingSkips >= 0) {
            var n = this.initialValues.next();
            if (!n.done)
                return { value: n.value(), done: false };
        }
        return { value: value, done: true };
    };
    SourceValuesIterator.prototype.skippedOne = function () {
        --this.remainingSkips;
        ++this.maxInitialIterations;
    };
    return SourceValuesIterator;
}());

var Random = (function () {
    function Random(internalRng) {
        this.internalRng = internalRng;
    }
    Random.prototype.clone = function () {
        return new Random(this.internalRng);
    };
    Random.prototype.uniformIn = function (rangeMin, rangeMax) {
        var g = uniformIntDistribution(rangeMin, rangeMax, this.internalRng);
        this.internalRng = g[1];
        return g[0];
    };
    Random.prototype.next = function (bits) {
        return this.uniformIn(0, (1 << bits) - 1);
    };
    Random.prototype.nextBoolean = function () {
        return this.uniformIn(0, 1) === 1;
    };
    Random.prototype.nextInt = function (min, max) {
        return this.uniformIn(min == null ? Random.MIN_INT : min, max == null ? Random.MAX_INT : max);
    };
    Random.prototype.nextBigInt = function (min, max) {
        var g = uniformBigIntDistribution(min, max, this.internalRng);
        this.internalRng = g[1];
        return g[0];
    };
    Random.prototype.nextDouble = function () {
        var a = this.next(26);
        var b = this.next(27);
        return (a * Random.DBL_FACTOR + b) * Random.DBL_DIVISOR;
    };
    Random.MIN_INT = 0x80000000 | 0;
    Random.MAX_INT = 0x7fffffff | 0;
    Random.DBL_FACTOR = Math.pow(2, 27);
    Random.DBL_DIVISOR = Math.pow(2, -53);
    return Random;
}());

function lazyGenerate(generator, rng, idx) {
    return function () { return generator.generate(new Random(rng), idx); };
}
function toss(generator, seed, random, examples) {
    var idx, rng;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [5, __values(examples.map(function (e) { return function () { return new Shrinkable(e); }; }))];
            case 1:
                _a.sent();
                idx = 0;
                rng = random(seed);
                _a.label = 2;
            case 2:
                rng = rng.jump ? rng.jump() : skipN(rng, 42);
                return [4, lazyGenerate(generator, rng, idx++)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3, 2];
            case 5: return [2];
        }
    });
}

function pathWalk(path, initialValues) {
    var e_1, _a;
    var values = stream(initialValues);
    var segments = path.split(':').map(function (text) { return +text; });
    if (segments.length === 0)
        return values;
    if (!segments.every(function (v) { return !Number.isNaN(v); })) {
        throw new Error("Unable to replay, got invalid path=" + path);
    }
    values = values.drop(segments[0]);
    try {
        for (var _b = __values(segments.slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var s = _c.value;
            var valueToShrink = values.getNthOrLast(0);
            if (valueToShrink == null) {
                throw new Error("Unable to replay, got wrong path=" + path);
            }
            values = valueToShrink.shrink().drop(s);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return values;
}

var findSymbolNameRegex = /^Symbol\((.*)\)$/;
function getSymbolDescription(s) {
    if (s.description !== undefined)
        return s.description;
    var m = findSymbolNameRegex.exec(String(s));
    return m && m[1].length ? m[1] : null;
}
function stringifyNumber(numValue) {
    switch (numValue) {
        case 0:
            return 1 / numValue === Number.NEGATIVE_INFINITY ? '-0' : '0';
        case Number.NEGATIVE_INFINITY:
            return 'Number.NEGATIVE_INFINITY';
        case Number.POSITIVE_INFINITY:
            return 'Number.POSITIVE_INFINITY';
        default:
            return numValue === numValue ? String(numValue) : 'Number.NaN';
    }
}
function stringifyInternal(value, previousValues) {
    var currentValues = previousValues.concat([value]);
    if (typeof value === 'object') {
        if (previousValues.indexOf(value) !== -1)
            return '[cyclic]';
    }
    switch (Object.prototype.toString.call(value)) {
        case '[object Array]':
            return "[" + value.map(function (v) { return stringifyInternal(v, currentValues); }).join(',') + "]";
        case '[object BigInt]':
            return value + "n";
        case '[object Boolean]':
            return typeof value === 'boolean' ? JSON.stringify(value) : "new Boolean(" + JSON.stringify(value) + ")";
        case '[object Date]': {
            var d = value;
            return Number.isNaN(d.getTime()) ? "new Date(NaN)" : "new Date(" + JSON.stringify(d.toISOString()) + ")";
        }
        case '[object Map]':
            return "new Map(" + stringifyInternal(Array.from(value), currentValues) + ")";
        case '[object Null]':
            return "null";
        case '[object Number]':
            return typeof value === 'number' ? stringifyNumber(value) : "new Number(" + stringifyNumber(Number(value)) + ")";
        case '[object Object]': {
            try {
                var toStringAccessor = value.toString;
                if (typeof toStringAccessor === 'function' && toStringAccessor !== Object.prototype.toString) {
                    return value.toString();
                }
            }
            catch (err) {
                return '[object Object]';
            }
            var rawRepr = '{' +
                Object.keys(value)
                    .map(function (k) {
                    return (k === '__proto__' ? '["__proto__"]' : JSON.stringify(k)) + ":" + stringifyInternal(value[k], currentValues);
                })
                    .join(',') +
                '}';
            if (Object.getPrototypeOf(value) === null) {
                return rawRepr === '{}' ? 'Object.create(null)' : "Object.assign(Object.create(null)," + rawRepr + ")";
            }
            return rawRepr;
        }
        case '[object Set]':
            return "new Set(" + stringifyInternal(Array.from(value), currentValues) + ")";
        case '[object String]':
            return typeof value === 'string' ? JSON.stringify(value) : "new String(" + JSON.stringify(value) + ")";
        case '[object Symbol]': {
            var s = value;
            if (Symbol.keyFor(s) !== undefined) {
                return "Symbol.for(" + JSON.stringify(Symbol.keyFor(s)) + ")";
            }
            var desc = getSymbolDescription(s);
            return desc !== null ? "Symbol(" + JSON.stringify(desc) + ")" : "Symbol()";
        }
        case '[object Undefined]':
            return "undefined";
        default:
            try {
                return value.toString();
            }
            catch (_a) {
                return Object.prototype.toString.call(value);
            }
    }
}
function stringify(value) {
    return stringifyInternal(value, []);
}

function formatHints(hints) {
    if (hints.length === 1) {
        return "Hint: " + hints[0];
    }
    return hints.map(function (h, idx) { return "Hint (" + (idx + 1) + "): " + h; }).join('\n');
}
function formatFailures(failures) {
    return "Encountered failures were:\n- " + failures.map(stringify).join('\n- ');
}
function formatExecutionSummary(executionTrees) {
    var e_1, _a, e_2, _b;
    var summaryLines = [];
    var remainingTreesAndDepth = [];
    try {
        for (var _c = __values(executionTrees.reverse()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var tree = _d.value;
            remainingTreesAndDepth.push({ depth: 1, tree: tree });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    while (remainingTreesAndDepth.length !== 0) {
        var currentTreeAndDepth = remainingTreesAndDepth.pop();
        var currentTree = currentTreeAndDepth.tree;
        var currentDepth = currentTreeAndDepth.depth;
        var statusIcon = currentTree.status === ExecutionStatus.Success
            ? '\x1b[32m\u221A\x1b[0m'
            : currentTree.status === ExecutionStatus.Failure
                ? '\x1b[31m\xD7\x1b[0m'
                : '\x1b[33m!\x1b[0m';
        var leftPadding = Array(currentDepth).join('. ');
        summaryLines.push("" + leftPadding + statusIcon + " " + stringify(currentTree.value));
        try {
            for (var _e = (e_2 = void 0, __values(currentTree.children.reverse())), _f = _e.next(); !_f.done; _f = _e.next()) {
                var tree = _f.value;
                remainingTreesAndDepth.push({ depth: currentDepth + 1, tree: tree });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return "Execution summary:\n" + summaryLines.join('\n');
}
function preFormatTooManySkipped(out) {
    var message = "Failed to run property, too many pre-condition failures encountered\n{ seed: " + out.seed + " }\n\nRan " + out.numRuns + " time(s)\nSkipped " + out.numSkips + " time(s)";
    var details = null;
    var hints = [
        'Try to reduce the number of rejected values by combining map, flatMap and built-in arbitraries',
        'Increase failure tolerance by setting maxSkipsPerRun to an higher value',
    ];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
        details = formatExecutionSummary(out.executionSummary);
    }
    else {
        hints.push('Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status');
    }
    return { message: message, details: details, hints: hints };
}
function preFormatFailure(out) {
    var message = "Property failed after " + out.numRuns + " tests\n{ seed: " + out.seed + ", path: \"" + out.counterexamplePath + "\", endOnFailure: true }\nCounterexample: " + stringify(out.counterexample) + "\nShrunk " + out.numShrinks + " time(s)\nGot error: " + out.error;
    var details = null;
    var hints = [];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
        details = formatExecutionSummary(out.executionSummary);
    }
    else if (out.verbose === VerbosityLevel.Verbose) {
        details = formatFailures(out.failures);
    }
    else {
        hints.push('Enable verbose mode in order to have the list of all failing values encountered during the run');
    }
    return { message: message, details: details, hints: hints };
}
function preFormatEarlyInterrupted(out) {
    var message = "Property interrupted after " + out.numRuns + " tests\n{ seed: " + out.seed + " }";
    var details = null;
    var hints = [];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
        details = formatExecutionSummary(out.executionSummary);
    }
    else {
        hints.push('Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status');
    }
    return { message: message, details: details, hints: hints };
}
function defaultReportMessage(out) {
    if (!out.failed)
        return;
    var _a = out.counterexamplePath === null
        ? out.interrupted
            ? preFormatEarlyInterrupted(out)
            : preFormatTooManySkipped(out)
        : preFormatFailure(out), message = _a.message, details = _a.details, hints = _a.hints;
    var errorMessage = message;
    if (details != null)
        errorMessage += "\n\n" + details;
    if (hints.length > 0)
        errorMessage += "\n\n" + formatHints(hints);
    return errorMessage;
}
function throwIfFailed(out) {
    if (!out.failed)
        return;
    throw new Error(defaultReportMessage(out));
}
function reportRunDetails(out) {
    if (out.runConfiguration.asyncReporter)
        return out.runConfiguration.asyncReporter(out);
    else if (out.runConfiguration.reporter)
        return out.runConfiguration.reporter(out);
    else
        return throwIfFailed(out);
}

function runIt(property, sourceValues, verbose, interruptedAsFailure) {
    var e_1, _a;
    var runner = new RunnerIterator(sourceValues, verbose, interruptedAsFailure);
    try {
        for (var runner_1 = __values(runner), runner_1_1 = runner_1.next(); !runner_1_1.done; runner_1_1 = runner_1.next()) {
            var v = runner_1_1.value;
            var out = property.run(v);
            runner.handleResult(out);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (runner_1_1 && !runner_1_1.done && (_a = runner_1["return"])) _a.call(runner_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return runner.runExecution;
}
function asyncRunIt(property, sourceValues, verbose, interruptedAsFailure) {
    return __awaiter(this, void 0, void 0, function () {
        var runner, runner_2, runner_2_1, v, out, e_2_1;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runner = new RunnerIterator(sourceValues, verbose, interruptedAsFailure);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    runner_2 = __values(runner), runner_2_1 = runner_2.next();
                    _b.label = 2;
                case 2:
                    if (!!runner_2_1.done) return [3, 5];
                    v = runner_2_1.value;
                    return [4, property.run(v)];
                case 3:
                    out = _b.sent();
                    runner.handleResult(out);
                    _b.label = 4;
                case 4:
                    runner_2_1 = runner_2.next();
                    return [3, 2];
                case 5: return [3, 8];
                case 6:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 8];
                case 7:
                    try {
                        if (runner_2_1 && !runner_2_1.done && (_a = runner_2["return"])) _a.call(runner_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7];
                case 8: return [2, runner.runExecution];
            }
        });
    });
}
function runnerPathWalker(valueProducers, path) {
    var pathPoints = path.split(':');
    var pathStream = stream(valueProducers)
        .drop(pathPoints.length > 0 ? +pathPoints[0] : 0)
        .map(function (producer) { return producer(); });
    var adaptedPath = __spread(['0'], pathPoints.slice(1)).join(':');
    return stream(pathWalk(adaptedPath, pathStream)).map(function (v) { return function () { return v; }; });
}
function buildInitialValues(valueProducers, qParams) {
    var rawValues = qParams.path.length === 0 ? stream(valueProducers) : runnerPathWalker(valueProducers, qParams.path);
    if (!qParams.endOnFailure)
        return rawValues;
    return rawValues.map(function (shrinkableGen) {
        return function () {
            var s = shrinkableGen();
            return new Shrinkable(s.value_);
        };
    });
}
function check(rawProperty, params) {
    if (rawProperty == null || rawProperty.generate == null)
        throw new Error('Invalid property encountered, please use a valid property');
    if (rawProperty.run == null)
        throw new Error('Invalid property encountered, please use a valid property not an arbitrary');
    var qParams = QualifiedParameters.read(__assign(__assign({}, readConfigureGlobal()), params));
    if (qParams.reporter !== null && qParams.asyncReporter !== null)
        throw new Error('Invalid parameters encountered, reporter and asyncReporter cannot be specified together');
    if (qParams.asyncReporter !== null && rawProperty.isAsync())
        throw new Error('Invalid parameters encountered, only asyncProperty can be used when asyncReporter specified');
    var property = decorateProperty(rawProperty, qParams);
    var generator = toss(property, qParams.seed, qParams.randomType, qParams.examples);
    var maxInitialIterations = qParams.path.indexOf(':') === -1 ? qParams.numRuns : -1;
    var maxSkips = qParams.numRuns * qParams.maxSkipsPerRun;
    var initialValues = buildInitialValues(generator, qParams);
    var sourceValues = new SourceValuesIterator(initialValues, maxInitialIterations, maxSkips);
    return property.isAsync()
        ? asyncRunIt(property, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).then(function (e) {
            return e.toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips, qParams);
        })
        : runIt(property, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips, qParams);
}
function assert(property, params) {
    var out = check(property, params);
    if (property.isAsync())
        return out.then(reportRunDetails);
    else
        reportRunDetails(out);
}

var ObjectEntriesImpl = function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);
    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
};
var ObjectEntries = Object.entries ? Object.entries : ObjectEntriesImpl;
var repeatUpToLength = function (src, targetLength) {
    for (; targetLength > src.length; src += src)
        ;
    return src;
};
var StringPadEndImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return String(src) + padString.slice(0, targetLength);
};
var StringPadStartImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return padString.slice(0, targetLength) + String(src);
};
var wrapStringPad = function (method) {
    return (method &&
        (function (src, targetLength, padString) { return method.call(src, targetLength, padString); }));
};
var StringPadEnd = wrapStringPad(String.prototype.padEnd) || StringPadEndImpl;
var StringPadStart = wrapStringPad(String.prototype.padStart) || StringPadStartImpl;
var StringFromCodePointLimitedImpl = function (codePoint) {
    if (codePoint < 0x10000)
        return String.fromCharCode(codePoint);
    codePoint -= 0x10000;
    return String.fromCharCode((codePoint >> 10) + 0xd800) + String.fromCharCode((codePoint % 0x400) + 0xdc00);
};
var StringFromCodePointLimited = String.fromCodePoint ? String.fromCodePoint : StringFromCodePointLimitedImpl;

function toProperty(generator, qParams) {
    var prop = !Object.prototype.hasOwnProperty.call(generator, 'isAsync')
        ? new Property(generator, function () { return true; })
        : generator;
    return qParams.unbiased === true ? new UnbiasedProperty(prop) : prop;
}
function streamSample(generator, params) {
    var extendedParams = typeof params === 'number'
        ? __assign(__assign({}, readConfigureGlobal()), { numRuns: params }) : __assign(__assign({}, readConfigureGlobal()), params);
    var qParams = QualifiedParameters.read(extendedParams);
    var tossedValues = stream(toss(toProperty(generator, qParams), qParams.seed, qParams.randomType, qParams.examples));
    if (qParams.path.length === 0) {
        return tossedValues.take(qParams.numRuns).map(function (s) { return s().value_; });
    }
    return stream(pathWalk(qParams.path, tossedValues.map(function (s) { return s(); })))
        .take(qParams.numRuns)
        .map(function (s) { return s.value_; });
}
function sample(generator, params) {
    return __spread(streamSample(generator, params));
}
function statistics(generator, classify, params) {
    var e_1, _a, e_2, _b, e_3, _c;
    var extendedParams = typeof params === 'number'
        ? __assign(__assign({}, readConfigureGlobal()), { numRuns: params }) : __assign(__assign({}, readConfigureGlobal()), params);
    var qParams = QualifiedParameters.read(extendedParams);
    var recorded = {};
    try {
        for (var _d = __values(streamSample(generator, params)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var g = _e.value;
            var out = classify(g);
            var categories = Array.isArray(out) ? out : [out];
            try {
                for (var categories_1 = (e_2 = void 0, __values(categories)), categories_1_1 = categories_1.next(); !categories_1_1.done; categories_1_1 = categories_1.next()) {
                    var c = categories_1_1.value;
                    recorded[c] = (recorded[c] || 0) + 1;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (categories_1_1 && !categories_1_1.done && (_b = categories_1["return"])) _b.call(categories_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var data = ObjectEntries(recorded)
        .sort(function (a, b) { return b[1] - a[1]; })
        .map(function (i) { return [i[0], ((i[1] * 100.0) / qParams.numRuns).toFixed(2) + "%"]; });
    var longestName = data.map(function (i) { return i[0].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    var longestPercent = data.map(function (i) { return i[1].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var item = data_1_1.value;
            qParams.logger(StringPadEnd(item[0], longestName, '.') + ".." + StringPadStart(item[1], longestPercent, '.'));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_c = data_1["return"])) _c.call(data_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}

var BiasedArbitraryWrapper = (function (_super) {
    __extends(BiasedArbitraryWrapper, _super);
    function BiasedArbitraryWrapper(freq, arb, biasedArbBuilder) {
        var _this = _super.call(this) || this;
        _this.freq = freq;
        _this.arb = arb;
        _this.biasedArbBuilder = biasedArbBuilder;
        return _this;
    }
    BiasedArbitraryWrapper.prototype.generate = function (mrng) {
        return mrng.nextInt(1, this.freq) === 1 ? this.biasedArbBuilder(this.arb).generate(mrng) : this.arb.generate(mrng);
    };
    return BiasedArbitraryWrapper;
}(Arbitrary));
function biasWrapper(freq, arb, biasedArbBuilder) {
    return new BiasedArbitraryWrapper(freq, arb, biasedArbBuilder);
}

var ArbitraryWithShrink = (function (_super) {
    __extends(ArbitraryWithShrink, _super);
    function ArbitraryWithShrink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArbitraryWithShrink.prototype.shrinkableFor = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce === true).map(function (v) { return _this.shrinkableFor(v, true); }); });
    };
    return ArbitraryWithShrink;
}(Arbitrary));

function biasNumeric(min, max, Ctor, logLike) {
    if (min === max) {
        return new Ctor(min, max);
    }
    if (min < 0) {
        return max > 0
            ? new Ctor(-logLike(-min), logLike(max))
            : new Ctor((max - logLike((max - min))), max);
    }
    return new Ctor(min, min + logLike((max - min)));
}

function shrinkNumericInternal(current, target, shrunkOnce, halvePos, halveNeg) {
    var realGap = (current - target);
    function shrinkDecr() {
        var gap, toremove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gap = shrunkOnce ? halvePos(realGap) : realGap;
                    toremove = gap;
                    _a.label = 1;
                case 1:
                    if (!(toremove > 0)) return [3, 4];
                    return [4, (current - toremove)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    toremove = halvePos(toremove);
                    return [3, 1];
                case 4: return [2];
            }
        });
    }
    function shrinkIncr() {
        var gap, toremove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gap = shrunkOnce ? halveNeg(realGap) : realGap;
                    toremove = gap;
                    _a.label = 1;
                case 1:
                    if (!(toremove < 0)) return [3, 4];
                    return [4, (current - toremove)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    toremove = halveNeg(toremove);
                    return [3, 1];
                case 4: return [2];
            }
        });
    }
    return realGap > 0 ? stream(shrinkDecr()) : stream(shrinkIncr());
}
function halveBigInt(n) {
    return n / BigInt(2);
}
function halvePosNumber(n) {
    return Math.floor(n / 2);
}
function halveNegNumber(n) {
    return Math.ceil(n / 2);
}
function shrinkNumeric(zero, min, max, current, shrunkOnce, halvePos, halveNeg) {
    if (min <= zero && max >= zero) {
        return shrinkNumericInternal(current, zero, shrunkOnce, halvePos, halveNeg);
    }
    return current < zero
        ? shrinkNumericInternal(current, max, shrunkOnce, halvePos, halveNeg)
        : shrinkNumericInternal(current, min, shrunkOnce, halvePos, halveNeg);
}
function shrinkNumber(min, max, current, shrunkOnce) {
    return shrinkNumeric(0, min, max, current, shrunkOnce, halvePosNumber, halveNegNumber);
}
function shrinkBigInt(min, max, current, shrunkOnce) {
    return shrinkNumeric(BigInt(0), min, max, current, shrunkOnce, halveBigInt, halveBigInt);
}

var IntegerArbitrary = (function (_super) {
    __extends(IntegerArbitrary, _super);
    function IntegerArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.biasedIntegerArbitrary = null;
        _this.min = min === undefined ? IntegerArbitrary.MIN_INT : min;
        _this.max = max === undefined ? IntegerArbitrary.MAX_INT : max;
        return _this;
    }
    IntegerArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    IntegerArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextInt(this.min, this.max), false);
    };
    IntegerArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return shrinkNumber(this.min, this.max, value, shrunkOnce === true);
    };
    IntegerArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedIntegerArbitrary != null) {
            return this.biasedIntegerArbitrary;
        }
        var log2 = function (v) { return Math.floor(Math.log(v) / Math.log(2)); };
        this.biasedIntegerArbitrary = biasNumeric(this.min, this.max, IntegerArbitrary, log2);
        return this.biasedIntegerArbitrary;
    };
    IntegerArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    IntegerArbitrary.MIN_INT = 0x80000000 | 0;
    IntegerArbitrary.MAX_INT = 0x7fffffff | 0;
    return IntegerArbitrary;
}(ArbitraryWithShrink));
function integer(a, b) {
    if (a !== undefined && b !== undefined && a > b)
        throw new Error('fc.integer maximum value should be equal or greater than the minimum one');
    return b === undefined ? new IntegerArbitrary(undefined, a) : new IntegerArbitrary(a, b);
}
function maxSafeInteger() {
    return integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}
function nat(a) {
    if (a !== undefined && a < 0)
        throw new Error('fc.nat value should be greater than or equal to 0');
    return new IntegerArbitrary(0, a);
}
function maxSafeNat() {
    return nat(Number.MAX_SAFE_INTEGER);
}

var LazyIterableIterator = (function () {
    function LazyIterableIterator(producer) {
        this.producer = producer;
    }
    LazyIterableIterator.prototype[Symbol.iterator] = function () {
        if (this.it === undefined) {
            this.it = this.producer();
        }
        return this.it;
    };
    LazyIterableIterator.prototype.next = function () {
        if (this.it === undefined) {
            this.it = this.producer();
        }
        return this.it.next();
    };
    return LazyIterableIterator;
}());
function makeLazy(producer) {
    return new LazyIterableIterator(producer);
}

var ArrayArbitrary = (function (_super) {
    __extends(ArrayArbitrary, _super);
    function ArrayArbitrary(arb, minLength, maxLength, preFilter) {
        if (preFilter === void 0) { preFilter = function (tab) { return tab; }; }
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        _this.preFilter = preFilter;
        _this.lengthArb = integer(minLength, maxLength);
        return _this;
    }
    ArrayArbitrary.makeItCloneable = function (vs, shrinkables) {
        var _this = this;
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            _this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    ArrayArbitrary.prototype.wrapper = function (itemsRaw, shrunkOnce) {
        var _this = this;
        var items = this.preFilter(itemsRaw);
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== items.length; ++idx) {
            var s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            ArrayArbitrary.makeItCloneable(vs, items);
        }
        return new Shrinkable(vs, function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    ArrayArbitrary.prototype.generate = function (mrng) {
        var size = this.lengthArb.generate(mrng);
        var items = [];
        for (var idx = 0; idx !== size.value; ++idx) {
            items.push(this.arb.generate(mrng));
        }
        return this.wrapper(items, false);
    };
    ArrayArbitrary.prototype.shrinkImpl = function (items, shrunkOnce) {
        var _this = this;
        if (items.length === 0) {
            return Stream.nil();
        }
        var size = this.lengthArb.shrinkableFor(items.length, shrunkOnce);
        return size
            .shrink()
            .map(function (l) { return items.slice(items.length - l.value); })
            .join(items[0].shrink().map(function (v) { return [v].concat(items.slice(1)); }))
            .join(items.length > this.minLength
            ? makeLazy(function () {
                return _this.shrinkImpl(items.slice(1), false)
                    .filter(function (vs) { return _this.minLength <= vs.length + 1; })
                    .map(function (vs) { return [items[0]].concat(vs); });
            })
            : Stream.nil());
    };
    ArrayArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) {
            var lowBiased = new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.preFilter);
            var highBiasedArbBuilder = function () {
                return originalArbitrary.minLength !== originalArbitrary.maxLength
                    ? new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.minLength +
                        Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)), originalArbitrary.preFilter)
                    : new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.preFilter);
            };
            return biasWrapper(freq, lowBiased, highBiasedArbBuilder);
        });
    };
    return ArrayArbitrary;
}(Arbitrary));
function array(arb, aLength, bLength) {
    if (bLength == null)
        return new ArrayArbitrary(arb, 0, aLength == null ? 10 : aLength);
    return new ArrayArbitrary(arb, aLength || 0, bLength);
}

var BigIntArbitrary = (function (_super) {
    __extends(BigIntArbitrary, _super);
    function BigIntArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.min = min;
        _this.max = max;
        _this.biasedBigIntArbitrary = null;
        return _this;
    }
    BigIntArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    BigIntArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextBigInt(this.min, this.max), false);
    };
    BigIntArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return shrinkBigInt(this.min, this.max, value, shrunkOnce === true);
    };
    BigIntArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedBigIntArbitrary != null) {
            return this.biasedBigIntArbitrary;
        }
        var logLike = function (v) {
            if (v === BigInt(0))
                return BigInt(0);
            return BigInt(v.toString().length);
        };
        this.biasedBigIntArbitrary = biasNumeric(this.min, this.max, BigIntArbitrary, logLike);
        return this.biasedBigIntArbitrary;
    };
    BigIntArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    return BigIntArbitrary;
}(ArbitraryWithShrink));
function bigIntN(n) {
    return new BigIntArbitrary(BigInt(-1) << BigInt(n - 1), (BigInt(1) << BigInt(n - 1)) - BigInt(1));
}
function bigUintN(n) {
    return new BigIntArbitrary(BigInt(0), (BigInt(1) << BigInt(n)) - BigInt(1));
}
function bigInt(min, max) {
    return max === undefined ? bigIntN(256) : new BigIntArbitrary(min, max);
}
function bigUint(max) {
    return max === undefined ? bigUintN(256) : new BigIntArbitrary(BigInt(0), max);
}

function boolean() {
    return integer(0, 1)
        .map(function (v) { return v === 1; })
        .noBias();
}

function findOrUndefined(ts, f) {
    for (var i = 0; i < ts.length; i++) {
        var t = ts[i];
        if (f(t))
            return t;
    }
    return undefined;
}

var ConstantArbitrary = (function (_super) {
    __extends(ConstantArbitrary, _super);
    function ConstantArbitrary(values) {
        var _this = _super.call(this) || this;
        _this.values = values;
        return _this;
    }
    ConstantArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        if (this.values.length === 1)
            return new Shrinkable(this.values[0]);
        var id = mrng.nextInt(0, this.values.length - 1);
        if (id === 0)
            return new Shrinkable(this.values[0]);
        function g(v) {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Shrinkable(v)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }
        return new Shrinkable(this.values[id], function () { return stream(g(_this.values[0])); });
    };
    return ConstantArbitrary;
}(Arbitrary));
function constant(value) {
    if (hasCloneMethod(value)) {
        throw new Error('fc.constant does not accept cloneable values, use fc.clonedConstant instead');
    }
    return new ConstantArbitrary([value]);
}
function clonedConstant(value) {
    if (hasCloneMethod(value)) {
        var producer = function () { return value[cloneMethod](); };
        return new ConstantArbitrary([producer]).map(function (c) { return c(); });
    }
    return new ConstantArbitrary([value]);
}
function constantFrom() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    if (values.length === 0) {
        throw new Error('fc.constantFrom expects at least one parameter');
    }
    if (findOrUndefined(values, function (v) { return hasCloneMethod(v); }) != undefined) {
        throw new Error('fc.constantFrom does not accept cloneable values, not supported for the moment');
    }
    return new ConstantArbitrary(__spread(values));
}

function falsy(constraints) {
    if (!constraints || !constraints.withBigInt)
        return constantFrom(false, null, undefined, 0, '', NaN);
    else
        return constantFrom(false, null, undefined, 0, '', NaN, BigInt(0));
}

function CharacterArbitrary(min, max, mapToCode) {
    return integer(min, max).map(function (n) { return StringFromCodePointLimited(mapToCode(n)); });
}
var preferPrintableMapper = function (v) {
    if (v < 95)
        return v + 0x20;
    if (v <= 0x7e)
        return v - 95;
    return v;
};
function char() {
    return CharacterArbitrary(0x20, 0x7e, function (v) { return v; });
}
function hexa() {
    function mapper(v) {
        return v < 10
            ? v + 48
            : v + 97 - 10;
    }
    return CharacterArbitrary(0, 15, mapper);
}
function base64() {
    function mapper(v) {
        if (v < 26)
            return v + 65;
        if (v < 52)
            return v + 97 - 26;
        if (v < 62)
            return v + 48 - 52;
        return v === 62 ? 43 : 47;
    }
    return CharacterArbitrary(0, 63, mapper);
}
function ascii() {
    return CharacterArbitrary(0x00, 0x7f, preferPrintableMapper);
}
function char16bits() {
    return CharacterArbitrary(0x0000, 0xffff, preferPrintableMapper);
}
function unicode() {
    var gapSize = 0xdfff + 1 - 0xd800;
    function mapping(v) {
        if (v < 0xd800)
            return preferPrintableMapper(v);
        return v + gapSize;
    }
    return CharacterArbitrary(0x0000, 0xffff - gapSize, mapping);
}
function fullUnicode() {
    var gapSize = 0xdfff + 1 - 0xd800;
    function mapping(v) {
        if (v < 0xd800)
            return preferPrintableMapper(v);
        return v + gapSize;
    }
    return CharacterArbitrary(0x0000, 0x10ffff - gapSize, mapping);
}

var ContextImplem = (function () {
    function ContextImplem() {
        this.receivedLogs = [];
    }
    ContextImplem.prototype.log = function (data) {
        this.receivedLogs.push(data);
    };
    ContextImplem.prototype.size = function () {
        return this.receivedLogs.length;
    };
    ContextImplem.prototype.toString = function () {
        return JSON.stringify({ logs: this.receivedLogs });
    };
    ContextImplem.prototype[cloneMethod] = function () {
        return new ContextImplem();
    };
    return ContextImplem;
}());
var context = function () { return clonedConstant(new ContextImplem()); };

function date(constraints) {
    var intMin = constraints && constraints.min ? constraints.min.getTime() : -8640000000000000;
    var intMax = constraints && constraints.max ? constraints.max.getTime() : 8640000000000000;
    if (Number.isNaN(intMin))
        throw new Error('fc.date min must be valid instance of Date');
    if (Number.isNaN(intMin))
        throw new Error('fc.date max must be valid instance of Date');
    if (intMin > intMax)
        throw new Error('fc.date max must be greater or equal to min');
    return integer(intMin, intMax).map(function (a) { return new Date(a); });
}

var DedupArbitrary = (function (_super) {
    __extends(DedupArbitrary, _super);
    function DedupArbitrary(arb, numValues) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.numValues = numValues;
        return _this;
    }
    DedupArbitrary.prototype.generate = function (mrng) {
        var items = [];
        if (this.numValues <= 0) {
            return this.wrapper(items);
        }
        for (var idx = 0; idx !== this.numValues - 1; ++idx) {
            items.push(this.arb.generate(mrng.clone()));
        }
        items.push(this.arb.generate(mrng));
        return this.wrapper(items);
    };
    DedupArbitrary.makeItCloneable = function (vs, shrinkables) {
        var _this = this;
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            _this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    DedupArbitrary.prototype.wrapper = function (items) {
        var _this = this;
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== items.length; ++idx) {
            var s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            DedupArbitrary.makeItCloneable(vs, items);
        }
        return new Shrinkable(vs, function () { return stream(_this.shrinkImpl(items)).map(function (v) { return _this.wrapper(v); }); });
    };
    DedupArbitrary.prototype.shrinkImpl = function (items) {
        var its, cur;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (items.length === 0) {
                        return [2];
                    }
                    its = items.map(function (s) { return s.shrink()[Symbol.iterator](); });
                    cur = its.map(function (it) { return it.next(); });
                    _a.label = 1;
                case 1:
                    if (!!cur[0].done) return [3, 3];
                    return [4, cur.map(function (c) { return c.value; })];
                case 2:
                    _a.sent();
                    cur = its.map(function (it) { return it.next(); });
                    return [3, 1];
                case 3: return [2];
            }
        });
    };
    return DedupArbitrary;
}(Arbitrary));
function dedup(arb, numValues) {
    return new DedupArbitrary(arb, numValues);
}

function subArrayContains(tab, upperBound, includeValue) {
    for (var idx = 0; idx < upperBound; ++idx) {
        if (includeValue(tab[idx]))
            return true;
    }
    return false;
}
function swap(tab, idx1, idx2) {
    var temp = tab[idx1];
    tab[idx1] = tab[idx2];
    tab[idx2] = temp;
}
function buildCompareFilter(compare) {
    return function (tab) {
        var finalLength = tab.length;
        var _loop_1 = function (idx) {
            if (subArrayContains(tab, idx, function (t) { return compare(t.value_, tab[idx].value_); })) {
                --finalLength;
                swap(tab, idx, finalLength);
            }
        };
        for (var idx = tab.length - 1; idx !== -1; --idx) {
            _loop_1(idx);
        }
        return tab.slice(0, finalLength);
    };
}
function set(arb, aLength, bLength, compareFn) {
    var minLength = bLength == null || typeof bLength !== 'number' ? 0 : aLength;
    var maxLength = aLength == null || typeof aLength !== 'number' ? 10 : typeof bLength === 'number' ? bLength : aLength;
    var compare = compareFn != null
        ? compareFn
        : typeof bLength === 'function'
            ? bLength
            : typeof aLength === 'function'
                ? aLength
                : function (a, b) { return a === b; };
    var arrayArb = new ArrayArbitrary(arb, minLength, maxLength, buildCompareFilter(compare));
    if (minLength === 0)
        return arrayArb;
    return arrayArb.filter(function (tab) { return tab.length >= minLength; });
}

function toObject(items) {
    var e_1, _a;
    var obj = {};
    try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var keyValue = items_1_1.value;
            obj[keyValue[0]] = keyValue[1];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1["return"])) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}
function dictionary(keyArb, valueArb) {
    return set(tuple(keyArb, valueArb), function (t1, t2) { return t1[0] === t2[0]; }).map(toObject);
}

var FrequencyArbitrary = (function (_super) {
    __extends(FrequencyArbitrary, _super);
    function FrequencyArbitrary(warbs) {
        var _this = _super.call(this) || this;
        _this.warbs = warbs;
        var currentWeight = 0;
        _this.summedWarbs = [];
        for (var idx = 0; idx !== warbs.length; ++idx) {
            currentWeight += warbs[idx].weight;
            _this.summedWarbs.push({ weight: currentWeight, arbitrary: warbs[idx].arbitrary });
        }
        _this.totalWeight = currentWeight;
        return _this;
    }
    FrequencyArbitrary.prototype.generate = function (mrng) {
        var selected = mrng.nextInt(0, this.totalWeight - 1);
        for (var idx = 0; idx !== this.summedWarbs.length; ++idx) {
            if (selected < this.summedWarbs[idx].weight)
                return this.summedWarbs[idx].arbitrary.generate(mrng);
        }
        throw new Error("Unable to generate from fc.frequency");
    };
    FrequencyArbitrary.prototype.withBias = function (freq) {
        return new FrequencyArbitrary(this.warbs.map(function (v) { return ({ weight: v.weight, arbitrary: v.arbitrary.withBias(freq) }); }));
    };
    return FrequencyArbitrary;
}(Arbitrary));
function frequency() {
    var warbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        warbs[_i] = arguments[_i];
    }
    if (warbs.length === 0) {
        throw new Error('fc.frequency expects at least one parameter');
    }
    return new FrequencyArbitrary(__spread(warbs));
}

function computeNumChoices(options) {
    if (options.length === 0)
        throw new Error("fc.mapToConstant expects at least one option");
    var numChoices = 0;
    for (var idx = 0; idx !== options.length; ++idx) {
        if (options[idx].num < 0)
            throw new Error("fc.mapToConstant expects all options to have a number of entries greater or equal to zero");
        numChoices += options[idx].num;
    }
    if (numChoices === 0)
        throw new Error("fc.mapToConstant expects at least one choice among options");
    return numChoices;
}
function mapToConstant() {
    var entries = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        entries[_i] = arguments[_i];
    }
    var numChoices = computeNumChoices(entries);
    return nat(numChoices - 1).map(function (choice) {
        var idx = -1;
        var numSkips = 0;
        while (choice >= numSkips) {
            numSkips += entries[++idx].num;
        }
        return entries[idx].build(choice - numSkips + entries[idx].num);
    });
}

var lowerCaseMapper = { num: 26, build: function (v) { return String.fromCharCode(v + 0x61); } };
var upperCaseMapper = { num: 26, build: function (v) { return String.fromCharCode(v + 0x41); } };
var numericMapper = { num: 10, build: function (v) { return String.fromCharCode(v + 0x30); } };
var percentCharArb = fullUnicode().map(function (c) {
    var encoded = encodeURIComponent(c);
    return c !== encoded ? encoded : "%" + c.charCodeAt(0).toString(16);
});
var buildLowerAlphaArb = function (others) {
    return mapToConstant(lowerCaseMapper, { num: others.length, build: function (v) { return others[v]; } });
};
var buildLowerAlphaNumericArb = function (others) {
    return mapToConstant(lowerCaseMapper, numericMapper, { num: others.length, build: function (v) { return others[v]; } });
};
var buildAlphaNumericArb = function (others) {
    return mapToConstant(lowerCaseMapper, upperCaseMapper, numericMapper, { num: others.length, build: function (v) { return others[v]; } });
};
var buildAlphaNumericPercentArb = function (others) {
    return frequency({
        weight: 10,
        arbitrary: buildAlphaNumericArb(others)
    }, {
        weight: 1,
        arbitrary: percentCharArb
    });
};

var OptionArbitrary = (function (_super) {
    __extends(OptionArbitrary, _super);
    function OptionArbitrary(arb, frequency, nil) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.frequency = frequency;
        _this.nil = nil;
        _this.isOptionArb = nat(frequency);
        return _this;
    }
    OptionArbitrary.extendedShrinkable = function (s, nil) {
        function g() {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Shrinkable(nil)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }
        return new Shrinkable(s.value_, function () {
            return s
                .shrink()
                .map(function (v) { return OptionArbitrary.extendedShrinkable(v, nil); })
                .join(g());
        });
    };
    OptionArbitrary.prototype.generate = function (mrng) {
        return this.isOptionArb.generate(mrng).value === 0
            ? new Shrinkable(this.nil)
            : OptionArbitrary.extendedShrinkable(this.arb.generate(mrng), this.nil);
    };
    OptionArbitrary.prototype.withBias = function (freq) {
        return new OptionArbitrary(this.arb.withBias(freq), this.frequency, this.nil);
    };
    return OptionArbitrary;
}(Arbitrary));
function option(arb, constraints) {
    if (!constraints)
        return new OptionArbitrary(arb, 5, null);
    if (typeof constraints === 'number')
        return new OptionArbitrary(arb, constraints, null);
    return new OptionArbitrary(arb, constraints.freq == null ? 5 : constraints.freq, Object.prototype.hasOwnProperty.call(constraints, 'nil') ? constraints.nil : null);
}

function StringArbitrary(charArb, aLength, bLength) {
    var arrayArb = aLength != null ? (bLength != null ? array(charArb, aLength, bLength) : array(charArb, aLength)) : array(charArb);
    return arrayArb.map(function (tab) { return tab.join(''); });
}
function Base64StringArbitrary(minLength, maxLength) {
    if (minLength > maxLength)
        throw new Error('Minimal length should be inferior or equal to maximal length');
    if (minLength % 4 !== 0)
        throw new Error('Minimal length of base64 strings must be a multiple of 4');
    if (maxLength % 4 !== 0)
        throw new Error('Maximal length of base64 strings must be a multiple of 4');
    return StringArbitrary(base64(), minLength, maxLength).map(function (s) {
        switch (s.length % 4) {
            case 0:
                return s;
            case 3:
                return s + "=";
            case 2:
                return s + "==";
            default:
                return s.slice(1);
        }
    });
}
function stringOf(charArb, aLength, bLength) {
    return StringArbitrary(charArb, aLength, bLength);
}
function string(aLength, bLength) {
    return StringArbitrary(char(), aLength, bLength);
}
function asciiString(aLength, bLength) {
    return StringArbitrary(ascii(), aLength, bLength);
}
function string16bits(aLength, bLength) {
    return StringArbitrary(char16bits(), aLength, bLength);
}
function unicodeString(aLength, bLength) {
    return StringArbitrary(unicode(), aLength, bLength);
}
function fullUnicodeString(aLength, bLength) {
    return StringArbitrary(fullUnicode(), aLength, bLength);
}
function hexaString(aLength, bLength) {
    return StringArbitrary(hexa(), aLength, bLength);
}
function base64String(aLength, bLength) {
    var minLength = aLength != null && bLength != null ? aLength : 0;
    var maxLength = bLength == null ? (aLength == null ? 16 : aLength) : bLength;
    return Base64StringArbitrary(minLength + 3 - ((minLength + 3) % 4), maxLength - (maxLength % 4));
}

function subdomain() {
    var alphaNumericArb = buildLowerAlphaNumericArb([]);
    var alphaNumericHyphenArb = buildLowerAlphaNumericArb(['-']);
    return tuple(alphaNumericArb, option(tuple(stringOf(alphaNumericHyphenArb), alphaNumericArb)))
        .map(function (_a) {
        var _b = __read(_a, 2), f = _b[0], d = _b[1];
        return (d === null ? f : "" + f + d[0] + d[1]);
    })
        .filter(function (d) { return d.length <= 63; })
        .filter(function (d) {
        return d.length < 4 || d[0] !== 'x' || d[1] !== 'n' || d[2] !== '-' || d[3] !== '-';
    });
}
function domain() {
    var alphaNumericArb = buildLowerAlphaArb([]);
    var extensionArb = stringOf(alphaNumericArb, 2, 10);
    return tuple(array(subdomain(), 1, 5), extensionArb)
        .map(function (_a) {
        var _b = __read(_a, 2), mid = _b[0], ext = _b[1];
        return mid.join('.') + "." + ext;
    })
        .filter(function (d) { return d.length <= 255; });
}
function hostUserInfo() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':'];
    return stringOf(buildAlphaNumericPercentArb(others));
}

function emailAddress() {
    var others = ['!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
    var atextArb = buildLowerAlphaNumericArb(others);
    var dotAtomArb = array(stringOf(atextArb, 1, 10), 1, 5).map(function (a) { return a.join('.'); });
    return tuple(dotAtomArb, domain()).map(function (_a) {
        var _b = __read(_a, 2), lp = _b[0], d = _b[1];
        return lp + "@" + d;
    });
}

function next(n) {
    return integer(0, (1 << n) - 1);
}
var floatInternal = function () {
    return next(24).map(function (v) { return v / (1 << 24); });
};
function float(a, b) {
    if (a === undefined)
        return floatInternal();
    if (b === undefined)
        return floatInternal().map(function (v) { return v * a; });
    return floatInternal().map(function (v) { return a + v * (b - a); });
}
var doubleFactor = Math.pow(2, 27);
var doubleDivisor = Math.pow(2, -53);
var doubleInternal = function () {
    return tuple(next(26), next(27)).map(function (v) { return (v[0] * doubleFactor + v[1]) * doubleDivisor; });
};
function double(a, b) {
    if (a === undefined)
        return doubleInternal();
    if (b === undefined)
        return doubleInternal().map(function (v) { return v * a; });
    return doubleInternal().map(function (v) { return a + v * (b - a); });
}

var crc32Table = [
    0x00000000,
    0x77073096,
    0xee0e612c,
    0x990951ba,
    0x076dc419,
    0x706af48f,
    0xe963a535,
    0x9e6495a3,
    0x0edb8832,
    0x79dcb8a4,
    0xe0d5e91e,
    0x97d2d988,
    0x09b64c2b,
    0x7eb17cbd,
    0xe7b82d07,
    0x90bf1d91,
    0x1db71064,
    0x6ab020f2,
    0xf3b97148,
    0x84be41de,
    0x1adad47d,
    0x6ddde4eb,
    0xf4d4b551,
    0x83d385c7,
    0x136c9856,
    0x646ba8c0,
    0xfd62f97a,
    0x8a65c9ec,
    0x14015c4f,
    0x63066cd9,
    0xfa0f3d63,
    0x8d080df5,
    0x3b6e20c8,
    0x4c69105e,
    0xd56041e4,
    0xa2677172,
    0x3c03e4d1,
    0x4b04d447,
    0xd20d85fd,
    0xa50ab56b,
    0x35b5a8fa,
    0x42b2986c,
    0xdbbbc9d6,
    0xacbcf940,
    0x32d86ce3,
    0x45df5c75,
    0xdcd60dcf,
    0xabd13d59,
    0x26d930ac,
    0x51de003a,
    0xc8d75180,
    0xbfd06116,
    0x21b4f4b5,
    0x56b3c423,
    0xcfba9599,
    0xb8bda50f,
    0x2802b89e,
    0x5f058808,
    0xc60cd9b2,
    0xb10be924,
    0x2f6f7c87,
    0x58684c11,
    0xc1611dab,
    0xb6662d3d,
    0x76dc4190,
    0x01db7106,
    0x98d220bc,
    0xefd5102a,
    0x71b18589,
    0x06b6b51f,
    0x9fbfe4a5,
    0xe8b8d433,
    0x7807c9a2,
    0x0f00f934,
    0x9609a88e,
    0xe10e9818,
    0x7f6a0dbb,
    0x086d3d2d,
    0x91646c97,
    0xe6635c01,
    0x6b6b51f4,
    0x1c6c6162,
    0x856530d8,
    0xf262004e,
    0x6c0695ed,
    0x1b01a57b,
    0x8208f4c1,
    0xf50fc457,
    0x65b0d9c6,
    0x12b7e950,
    0x8bbeb8ea,
    0xfcb9887c,
    0x62dd1ddf,
    0x15da2d49,
    0x8cd37cf3,
    0xfbd44c65,
    0x4db26158,
    0x3ab551ce,
    0xa3bc0074,
    0xd4bb30e2,
    0x4adfa541,
    0x3dd895d7,
    0xa4d1c46d,
    0xd3d6f4fb,
    0x4369e96a,
    0x346ed9fc,
    0xad678846,
    0xda60b8d0,
    0x44042d73,
    0x33031de5,
    0xaa0a4c5f,
    0xdd0d7cc9,
    0x5005713c,
    0x270241aa,
    0xbe0b1010,
    0xc90c2086,
    0x5768b525,
    0x206f85b3,
    0xb966d409,
    0xce61e49f,
    0x5edef90e,
    0x29d9c998,
    0xb0d09822,
    0xc7d7a8b4,
    0x59b33d17,
    0x2eb40d81,
    0xb7bd5c3b,
    0xc0ba6cad,
    0xedb88320,
    0x9abfb3b6,
    0x03b6e20c,
    0x74b1d29a,
    0xead54739,
    0x9dd277af,
    0x04db2615,
    0x73dc1683,
    0xe3630b12,
    0x94643b84,
    0x0d6d6a3e,
    0x7a6a5aa8,
    0xe40ecf0b,
    0x9309ff9d,
    0x0a00ae27,
    0x7d079eb1,
    0xf00f9344,
    0x8708a3d2,
    0x1e01f268,
    0x6906c2fe,
    0xf762575d,
    0x806567cb,
    0x196c3671,
    0x6e6b06e7,
    0xfed41b76,
    0x89d32be0,
    0x10da7a5a,
    0x67dd4acc,
    0xf9b9df6f,
    0x8ebeeff9,
    0x17b7be43,
    0x60b08ed5,
    0xd6d6a3e8,
    0xa1d1937e,
    0x38d8c2c4,
    0x4fdff252,
    0xd1bb67f1,
    0xa6bc5767,
    0x3fb506dd,
    0x48b2364b,
    0xd80d2bda,
    0xaf0a1b4c,
    0x36034af6,
    0x41047a60,
    0xdf60efc3,
    0xa867df55,
    0x316e8eef,
    0x4669be79,
    0xcb61b38c,
    0xbc66831a,
    0x256fd2a0,
    0x5268e236,
    0xcc0c7795,
    0xbb0b4703,
    0x220216b9,
    0x5505262f,
    0xc5ba3bbe,
    0xb2bd0b28,
    0x2bb45a92,
    0x5cb36a04,
    0xc2d7ffa7,
    0xb5d0cf31,
    0x2cd99e8b,
    0x5bdeae1d,
    0x9b64c2b0,
    0xec63f226,
    0x756aa39c,
    0x026d930a,
    0x9c0906a9,
    0xeb0e363f,
    0x72076785,
    0x05005713,
    0x95bf4a82,
    0xe2b87a14,
    0x7bb12bae,
    0x0cb61b38,
    0x92d28e9b,
    0xe5d5be0d,
    0x7cdcefb7,
    0x0bdbdf21,
    0x86d3d2d4,
    0xf1d4e242,
    0x68ddb3f8,
    0x1fda836e,
    0x81be16cd,
    0xf6b9265b,
    0x6fb077e1,
    0x18b74777,
    0x88085ae6,
    0xff0f6a70,
    0x66063bca,
    0x11010b5c,
    0x8f659eff,
    0xf862ae69,
    0x616bffd3,
    0x166ccf45,
    0xa00ae278,
    0xd70dd2ee,
    0x4e048354,
    0x3903b3c2,
    0xa7672661,
    0xd06016f7,
    0x4969474d,
    0x3e6e77db,
    0xaed16a4a,
    0xd9d65adc,
    0x40df0b66,
    0x37d83bf0,
    0xa9bcae53,
    0xdebb9ec5,
    0x47b2cf7f,
    0x30b5ffe9,
    0xbdbdf21c,
    0xcabac28a,
    0x53b39330,
    0x24b4a3a6,
    0xbad03605,
    0xcdd70693,
    0x54de5729,
    0x23d967bf,
    0xb3667a2e,
    0xc4614ab8,
    0x5d681b02,
    0x2a6f2b94,
    0xb40bbe37,
    0xc30c8ea1,
    0x5a05df1b,
    0x2d02ef8d,
];
function hash(repr) {
    var buf = Buffer.from(repr);
    var crc = 0xffffffff;
    for (var idx = 0; idx !== buf.length; ++idx) {
        crc = crc32Table[(crc & 0xff) ^ buf[idx]] ^ (crc >> 8);
    }
    return (crc | 0) + 0x80000000;
}

function func(arb) {
    return tuple(array(arb, 1, 10), integer().noShrink()).map(function (_a) {
        var _b = __read(_a, 2), outs = _b[0], seed = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var repr = stringify(args);
                var val = outs[hash("" + seed + repr) % outs.length];
                recorded[repr] = val;
                return hasCloneMethod(val) ? val[cloneMethod]() : val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + stringify(recorded[k]); })
                                .join(', ') +
                            '>';
                    }
                },
                _a[cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
function compareFuncImplem(cmp) {
    return tuple(integer().noShrink(), integer(1, 0xffffffff).noShrink()).map(function (_a) {
        var _b = __read(_a, 2), seed = _b[0], hashEnvSize = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function (a, b) {
                var reprA = stringify(a);
                var reprB = stringify(b);
                var hA = hash("" + seed + reprA) % hashEnvSize;
                var hB = hash("" + seed + reprB) % hashEnvSize;
                var val = cmp(hA, hB);
                recorded["[" + reprA + "," + reprB + "]"] = val;
                return val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + recorded[k]; })
                                .join(', ') +
                            '>';
                    }
                },
                _a[cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
function compareFunc() {
    return compareFuncImplem(function (hA, hB) { return hA - hB; });
}
function compareBooleanFunc() {
    return compareFuncImplem(function (hA, hB) { return hA < hB; });
}

var OneOfArbitrary = (function (_super) {
    __extends(OneOfArbitrary, _super);
    function OneOfArbitrary(arbs) {
        var _this = _super.call(this) || this;
        _this.arbs = arbs;
        return _this;
    }
    OneOfArbitrary.prototype.generate = function (mrng) {
        var id = mrng.nextInt(0, this.arbs.length - 1);
        return this.arbs[id].generate(mrng);
    };
    OneOfArbitrary.prototype.withBias = function (freq) {
        return new OneOfArbitrary(this.arbs.map(function (a) { return a.withBias(freq); }));
    };
    return OneOfArbitrary;
}(Arbitrary));
function oneof() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    if (arbs.length === 0) {
        throw new Error('fc.oneof expects at least one parameter');
    }
    return new OneOfArbitrary(__spread(arbs));
}

function ipV4() {
    return tuple(nat(255), nat(255), nat(255), nat(255)).map(function (_a) {
        var _b = __read(_a, 4), a = _b[0], b = _b[1], c = _b[2], d = _b[3];
        return a + "." + b + "." + c + "." + d;
    });
}
function ipV4Extended() {
    var natRepr = function (maxValue) {
        return tuple(constantFrom('dec', 'oct', 'hex'), nat(maxValue)).map(function (_a) {
            var _b = __read(_a, 2), style = _b[0], v = _b[1];
            switch (style) {
                case 'oct':
                    return "0" + Number(v).toString(8);
                case 'hex':
                    return "0x" + Number(v).toString(16);
                case 'dec':
                default:
                    return "" + v;
            }
        });
    };
    return oneof(tuple(natRepr(255), natRepr(255), natRepr(255), natRepr(255)).map(function (_a) {
        var _b = __read(_a, 4), a = _b[0], b = _b[1], c = _b[2], d = _b[3];
        return a + "." + b + "." + c + "." + d;
    }), tuple(natRepr(255), natRepr(255), natRepr(65535)).map(function (_a) {
        var _b = __read(_a, 3), a = _b[0], b = _b[1], c = _b[2];
        return a + "." + b + "." + c;
    }), tuple(natRepr(255), natRepr(16777215)).map(function (_a) {
        var _b = __read(_a, 2), a = _b[0], b = _b[1];
        return a + "." + b;
    }), natRepr(4294967295));
}
function ipV6() {
    var h16Arb = hexaString(1, 4);
    var ls32Arb = oneof(tuple(h16Arb, h16Arb).map(function (_a) {
        var _b = __read(_a, 2), a = _b[0], b = _b[1];
        return a + ":" + b;
    }), ipV4());
    return oneof(tuple(array(h16Arb, 6, 6), ls32Arb).map(function (_a) {
        var _b = __read(_a, 2), eh = _b[0], l = _b[1];
        return eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 5, 5), ls32Arb).map(function (_a) {
        var _b = __read(_a, 2), eh = _b[0], l = _b[1];
        return "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 1), array(h16Arb, 4, 4), ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 2), array(h16Arb, 3, 3), ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 3), array(h16Arb, 2, 2), ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh.join(':') + ":" + l;
    }), tuple(array(h16Arb, 0, 4), h16Arb, ls32Arb).map(function (_a) {
        var _b = __read(_a, 3), bh = _b[0], eh = _b[1], l = _b[2];
        return bh.join(':') + "::" + eh + ":" + l;
    }), tuple(array(h16Arb, 0, 5), ls32Arb).map(function (_a) {
        var _b = __read(_a, 2), bh = _b[0], l = _b[1];
        return bh.join(':') + "::" + l;
    }), tuple(array(h16Arb, 0, 6), h16Arb).map(function (_a) {
        var _b = __read(_a, 2), bh = _b[0], eh = _b[1];
        return bh.join(':') + "::" + eh;
    }), tuple(array(h16Arb, 0, 7)).map(function (_a) {
        var _b = __read(_a, 1), bh = _b[0];
        return bh.join(':') + "::";
    }));
}

var LazyArbitrary = (function (_super) {
    __extends(LazyArbitrary, _super);
    function LazyArbitrary(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.numBiasLevels = 0;
        _this.lastBiasedArbitrary = null;
        _this.underlying = null;
        return _this;
    }
    LazyArbitrary.prototype.generate = function (mrng) {
        if (!this.underlying) {
            throw new Error("Lazy arbitrary " + JSON.stringify(this.name) + " not correctly initialized");
        }
        return this.underlying.generate(mrng);
    };
    LazyArbitrary.prototype.withBias = function (freq) {
        if (!this.underlying) {
            throw new Error("Lazy arbitrary " + JSON.stringify(this.name) + " not correctly initialized");
        }
        if (this.numBiasLevels >= LazyArbitrary.MaxBiasLevels) {
            return this;
        }
        if (this.lastBiasedArbitrary !== null &&
            this.lastBiasedArbitrary.freq === freq &&
            this.lastBiasedArbitrary.arb === this.underlying &&
            this.lastBiasedArbitrary.lvl === this.numBiasLevels) {
            return this.lastBiasedArbitrary.biasedArb;
        }
        ++this.numBiasLevels;
        var biasedArb = this.underlying.withBias(freq);
        --this.numBiasLevels;
        this.lastBiasedArbitrary = {
            arb: this.underlying,
            lvl: this.numBiasLevels,
            freq: freq,
            biasedArb: biasedArb
        };
        return biasedArb;
    };
    LazyArbitrary.MaxBiasLevels = 5;
    return LazyArbitrary;
}(Arbitrary));
function isLazyArbitrary(arb) {
    return typeof arb === 'object' && arb !== null && Object.prototype.hasOwnProperty.call(arb, 'underlying');
}
function updateLazy(strictArbs, lazyArbs, key) {
    var lazyAtKey = lazyArbs[key];
    var lazyArb = isLazyArbitrary(lazyAtKey) ? lazyAtKey : new LazyArbitrary(key);
    lazyArb.underlying = strictArbs[key];
    lazyArbs[key] = lazyArb;
}
function letrec(builder) {
    var lazyArbs = Object.create(null);
    var tie = function (key) {
        if (!Object.prototype.hasOwnProperty.call(lazyArbs, key))
            lazyArbs[key] = new LazyArbitrary(key);
        return lazyArbs[key];
    };
    var strictArbs = builder(tie);
    for (var key in strictArbs) {
        if (!Object.prototype.hasOwnProperty.call(strictArbs, key)) {
            continue;
        }
        updateLazy(strictArbs, lazyArbs, key);
    }
    if (!Object.prototype.hasOwnProperty.call(strictArbs, '__proto__') &&
        isLazyArbitrary(strictArbs['__proto__'])) {
        updateLazy(strictArbs, lazyArbs, '__proto__');
    }
    return strictArbs;
}

var h = function (v, w) {
    return { arbitrary: constant(v), weight: w };
};
var loremWord = function () {
    return frequency(h('non', 6), h('adipiscing', 5), h('ligula', 5), h('enim', 5), h('pellentesque', 5), h('in', 5), h('augue', 5), h('et', 5), h('nulla', 5), h('lorem', 4), h('sit', 4), h('sed', 4), h('diam', 4), h('fermentum', 4), h('ut', 4), h('eu', 4), h('aliquam', 4), h('mauris', 4), h('vitae', 4), h('felis', 4), h('ipsum', 3), h('dolor', 3), h('amet,', 3), h('elit', 3), h('euismod', 3), h('mi', 3), h('orci', 3), h('erat', 3), h('praesent', 3), h('egestas', 3), h('leo', 3), h('vel', 3), h('sapien', 3), h('integer', 3), h('curabitur', 3), h('convallis', 3), h('purus', 3), h('risus', 2), h('suspendisse', 2), h('lectus', 2), h('nec,', 2), h('ultricies', 2), h('sed,', 2), h('cras', 2), h('elementum', 2), h('ultrices', 2), h('maecenas', 2), h('massa,', 2), h('varius', 2), h('a,', 2), h('semper', 2), h('proin', 2), h('nec', 2), h('nisl', 2), h('amet', 2), h('duis', 2), h('congue', 2), h('libero', 2), h('vestibulum', 2), h('pede', 2), h('blandit', 2), h('sodales', 2), h('ante', 2), h('nibh', 2), h('ac', 2), h('aenean', 2), h('massa', 2), h('suscipit', 2), h('sollicitudin', 2), h('fusce', 2), h('tempus', 2), h('aliquam,', 2), h('nunc', 2), h('ullamcorper', 2), h('rhoncus', 2), h('metus', 2), h('faucibus,', 2), h('justo', 2), h('magna', 2), h('at', 2), h('tincidunt', 2), h('consectetur', 1), h('tortor,', 1), h('dignissim', 1), h('congue,', 1), h('non,', 1), h('porttitor,', 1), h('nonummy', 1), h('molestie,', 1), h('est', 1), h('eleifend', 1), h('mi,', 1), h('arcu', 1), h('scelerisque', 1), h('vitae,', 1), h('consequat', 1), h('in,', 1), h('pretium', 1), h('volutpat', 1), h('pharetra', 1), h('tempor', 1), h('bibendum', 1), h('odio', 1), h('dui', 1), h('primis', 1), h('faucibus', 1), h('luctus', 1), h('posuere', 1), h('cubilia', 1), h('curae,', 1), h('hendrerit', 1), h('velit', 1), h('mauris,', 1), h('gravida', 1), h('ornare', 1), h('ut,', 1), h('pulvinar', 1), h('varius,', 1), h('turpis', 1), h('nibh,', 1), h('eros', 1), h('id', 1), h('aliquet', 1), h('quis', 1), h('lobortis', 1), h('consectetuer', 1), h('morbi', 1), h('vehicula', 1), h('tortor', 1), h('tellus,', 1), h('id,', 1), h('eu,', 1), h('quam', 1), h('feugiat,', 1), h('posuere,', 1), h('iaculis', 1), h('lectus,', 1), h('tristique', 1), h('mollis,', 1), h('nisl,', 1), h('vulputate', 1), h('sem', 1), h('vivamus', 1), h('placerat', 1), h('imperdiet', 1), h('cursus', 1), h('rutrum', 1), h('iaculis,', 1), h('augue,', 1), h('lacus', 1));
};
function lorem(maxWordsCount, sentencesMode) {
    var maxCount = maxWordsCount || 5;
    if (maxCount < 1)
        throw new Error("lorem has to produce at least one word/sentence");
    if (sentencesMode) {
        var sentence = array(loremWord(), 1, 10)
            .map(function (words) { return words.join(' '); })
            .map(function (s) { return (s[s.length - 1] === ',' ? s.substr(0, s.length - 1) : s); })
            .map(function (s) { return s[0].toUpperCase() + s.substring(1) + '.'; });
        return array(sentence, 1, maxCount).map(function (sentences) { return sentences.join(' '); });
    }
    else {
        return array(loremWord(), 1, maxCount).map(function (words) {
            return words.map(function (w) { return (w[w.length - 1] === ',' ? w.substr(0, w.length - 1) : w); }).join(' ');
        });
    }
}

var MemoArbitrary = (function (_super) {
    __extends(MemoArbitrary, _super);
    function MemoArbitrary(underlying) {
        var _this = _super.call(this) || this;
        _this.underlying = underlying;
        _this.lastFreq = -1;
        _this.lastBiased = _this;
        return _this;
    }
    MemoArbitrary.prototype.generate = function (mrng) {
        return this.underlying.generate(mrng);
    };
    MemoArbitrary.prototype.withBias = function (freq) {
        if (freq !== this.lastFreq) {
            this.lastFreq = freq;
            this.lastBiased = this.underlying.withBias(freq);
        }
        return this.lastBiased;
    };
    return MemoArbitrary;
}(Arbitrary));
var contextRemainingDepth = 10;
var memo = function (builder) {
    var previous = {};
    return (function (maxDepth) {
        var n = maxDepth !== undefined ? maxDepth : contextRemainingDepth;
        if (!Object.prototype.hasOwnProperty.call(previous, n)) {
            var prev = contextRemainingDepth;
            contextRemainingDepth = n - 1;
            previous[n] = new MemoArbitrary(builder(n));
            contextRemainingDepth = prev;
        }
        return previous[n];
    });
};

function countToggledBits(n) {
    var count = 0;
    while (n > BigInt(0)) {
        if (n & BigInt(1))
            ++count;
        n >>= BigInt(1);
    }
    return count;
}
function computeNextFlags(flags, nextSize) {
    var allowedMask = (BigInt(1) << BigInt(nextSize)) - BigInt(1);
    var preservedFlags = flags & allowedMask;
    var numMissingFlags = countToggledBits(flags - preservedFlags);
    var nFlags = preservedFlags;
    for (var mask = BigInt(1); mask <= allowedMask && numMissingFlags !== 0; mask <<= BigInt(1)) {
        if (!(nFlags & mask)) {
            nFlags |= mask;
            --numMissingFlags;
        }
    }
    return nFlags;
}
var MixedCaseArbitrary = (function (_super) {
    __extends(MixedCaseArbitrary, _super);
    function MixedCaseArbitrary(stringArb, toggleCase) {
        var _this = _super.call(this) || this;
        _this.stringArb = stringArb;
        _this.toggleCase = toggleCase;
        return _this;
    }
    MixedCaseArbitrary.prototype.computeTogglePositions = function (chars) {
        var positions = [];
        for (var idx = 0; idx !== chars.length; ++idx) {
            if (this.toggleCase(chars[idx]) !== chars[idx])
                positions.push(idx);
        }
        return positions;
    };
    MixedCaseArbitrary.prototype.wrapper = function (rawCase, chars, togglePositions, flags) {
        var _this = this;
        var newChars = chars.slice();
        for (var idx = 0, mask = BigInt(1); idx !== togglePositions.length; ++idx, mask <<= BigInt(1)) {
            if (flags & mask)
                newChars[togglePositions[idx]] = this.toggleCase(newChars[togglePositions[idx]]);
        }
        return new Shrinkable(newChars.join(''), function () { return _this.shrinkImpl(rawCase, chars, togglePositions, flags); });
    };
    MixedCaseArbitrary.prototype.shrinkImpl = function (rawCase, chars, togglePositions, flags) {
        var _this = this;
        return rawCase
            .shrink()
            .map(function (s) {
            var nChars = __spread(s.value_);
            var nTogglePositions = _this.computeTogglePositions(nChars);
            var nFlags = computeNextFlags(flags, nTogglePositions.length);
            return _this.wrapper(s, nChars, nTogglePositions, nFlags);
        })
            .join(bigUintN(togglePositions.length)
            .shrinkableFor(flags)
            .shrink()
            .map(function (nFlags) {
            return _this.wrapper(new Shrinkable(rawCase.value), chars, togglePositions, nFlags.value_);
        }));
    };
    MixedCaseArbitrary.prototype.generate = function (mrng) {
        var rawCaseShrinkable = this.stringArb.generate(mrng);
        var chars = __spread(rawCaseShrinkable.value_);
        var togglePositions = this.computeTogglePositions(chars);
        var flagsArb = bigUintN(togglePositions.length);
        var flags = flagsArb.generate(mrng).value_;
        return this.wrapper(rawCaseShrinkable, chars, togglePositions, flags);
    };
    return MixedCaseArbitrary;
}(Arbitrary));
function defaultToggleCase(rawChar) {
    var upper = rawChar.toUpperCase();
    if (upper !== rawChar)
        return upper;
    return rawChar.toLowerCase();
}
function mixedCase(stringArb, constraints) {
    if (typeof BigInt === 'undefined') {
        throw new Error("mixedCase requires BigInt support");
    }
    var toggleCase = (constraints && constraints.toggleCase) || defaultToggleCase;
    return new MixedCaseArbitrary(stringArb, toggleCase);
}

var ObjectConstraints = (function () {
    function ObjectConstraints(key, values, maxDepth, maxKeys, withSet, withMap, withObjectString, withNullPrototype, withBigInt) {
        this.key = key;
        this.values = values;
        this.maxDepth = maxDepth;
        this.maxKeys = maxKeys;
        this.withSet = withSet;
        this.withMap = withMap;
        this.withObjectString = withObjectString;
        this.withNullPrototype = withNullPrototype;
        this.withBigInt = withBigInt;
    }
    ObjectConstraints.defaultValues = function () {
        return [
            boolean(),
            integer(),
            double(),
            string(),
            oneof(string(), constant(null), constant(undefined)),
            oneof(double(), constant(-0), constant(0), constant(Number.NaN), constant(Number.POSITIVE_INFINITY), constant(Number.NEGATIVE_INFINITY), constant(Number.EPSILON), constant(Number.MIN_VALUE), constant(Number.MAX_VALUE), constant(Number.MIN_SAFE_INTEGER), constant(Number.MAX_SAFE_INTEGER)),
        ];
    };
    ObjectConstraints.boxArbitraries = function (arbs) {
        return arbs.map(function (arb) {
            return arb.map(function (v) {
                switch (typeof v) {
                    case 'boolean':
                        return new Boolean(v);
                    case 'number':
                        return new Number(v);
                    case 'string':
                        return new String(v);
                    default:
                        return v;
                }
            });
        });
    };
    ObjectConstraints.boxArbitrariesIfNeeded = function (arbs, boxEnabled) {
        return boxEnabled ? ObjectConstraints.boxArbitraries(arbs).concat(arbs) : arbs;
    };
    ObjectConstraints.from = function (settings) {
        function getOr(access, value) {
            return settings != null && access() != null ? access() : value;
        }
        return new ObjectConstraints(getOr(function () { return settings.key; }, string()), ObjectConstraints.boxArbitrariesIfNeeded(getOr(function () { return settings.values; }, ObjectConstraints.defaultValues()), getOr(function () { return settings.withBoxedValues; }, false)), getOr(function () { return settings.maxDepth; }, 2), getOr(function () { return settings.maxKeys; }, 5), getOr(function () { return settings.withSet; }, false), getOr(function () { return settings.withMap; }, false), getOr(function () { return settings.withObjectString; }, false), getOr(function () { return settings.withNullPrototype; }, false), getOr(function () { return settings.withBigInt; }, false));
    };
    return ObjectConstraints;
}());
var anythingInternal = function (constraints) {
    var arbKeys = constraints.withObjectString
        ? memo(function (n) {
            return frequency({ arbitrary: constraints.key, weight: 10 }, { arbitrary: anythingArb(n).map(function (o) { return stringify(o); }), weight: 1 });
        })
        : memo(function () { return constraints.key; });
    var arbitrariesForBase = constraints.values;
    var maxDepth = constraints.maxDepth;
    var maxKeys = constraints.maxKeys;
    var entriesOf = function (keyArb, valueArb) {
        return set(tuple(keyArb, valueArb), 0, maxKeys, function (t1, t2) { return t1[0] === t2[0]; });
    };
    var mapOf = function (ka, va) { return entriesOf(ka, va).map(function (v) { return new Map(v); }); };
    var dictOf = function (ka, va) { return entriesOf(ka, va).map(function (v) { return toObject(v); }); };
    var baseArb = oneof.apply(void 0, __spread(arbitrariesForBase));
    var arrayBaseArb = oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return array(arb, 0, maxKeys); })));
    var objectBaseArb = function (n) { return oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return dictOf(arbKeys(n), arb); }))); };
    var setBaseArb = function () { return oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return set(arb, 0, maxKeys).map(function (v) { return new Set(v); }); }))); };
    var mapBaseArb = function (n) { return oneof.apply(void 0, __spread(arbitrariesForBase.map(function (arb) { return mapOf(arbKeys(n), arb); }))); };
    var arrayArb = memo(function (n) { return oneof(arrayBaseArb, array(anythingArb(n), 0, maxKeys)); });
    var setArb = memo(function (n) {
        return oneof(setBaseArb(), set(anythingArb(n), 0, maxKeys).map(function (v) { return new Set(v); }));
    });
    var mapArb = memo(function (n) {
        return oneof(mapBaseArb(n), oneof(mapOf(arbKeys(n), anythingArb(n)), mapOf(anythingArb(n), anythingArb(n))));
    });
    var objectArb = memo(function (n) { return oneof(objectBaseArb(n), dictOf(arbKeys(n), anythingArb(n))); });
    var anythingArb = memo(function (n) {
        if (n <= 0)
            return oneof(baseArb);
        return oneof.apply(void 0, __spread([baseArb,
            arrayArb(),
            objectArb()], (constraints.withMap ? [mapArb()] : []), (constraints.withSet ? [setArb()] : []), (constraints.withObjectString ? [anythingArb().map(function (o) { return stringify(o); })] : []), (constraints.withNullPrototype ? [objectArb().map(function (o) { return Object.assign(Object.create(null), o); })] : []), (constraints.withBigInt ? [bigInt()] : [])));
    });
    return anythingArb(maxDepth);
};
var objectInternal = function (constraints) {
    return dictionary(constraints.key, anythingInternal(constraints));
};
function anything(settings) {
    return anythingInternal(ObjectConstraints.from(settings));
}
function object(settings) {
    return objectInternal(ObjectConstraints.from(settings));
}
function jsonSettings(stringArbitrary, maxDepth) {
    var key = stringArbitrary;
    var values = [boolean(), integer(), double(), stringArbitrary, constant(null)];
    return maxDepth != null ? { key: key, values: values, maxDepth: maxDepth } : { key: key, values: values };
}
function jsonObject(maxDepth) {
    return anything(jsonSettings(string(), maxDepth));
}
function unicodeJsonObject(maxDepth) {
    return anything(jsonSettings(unicodeString(), maxDepth));
}
function json(maxDepth) {
    var arb = maxDepth != null ? jsonObject(maxDepth) : jsonObject();
    return arb.map(JSON.stringify);
}
function unicodeJson(maxDepth) {
    var arb = maxDepth != null ? unicodeJsonObject(maxDepth) : unicodeJsonObject();
    return arb.map(JSON.stringify);
}

function rawRecord(recordModel) {
    var keys = Object.keys(recordModel);
    var arbs = keys.map(function (v) { return recordModel[v]; });
    return genericTuple(arbs).map(function (gs) {
        var obj = {};
        for (var idx = 0; idx !== keys.length; ++idx)
            obj[keys[idx]] = gs[idx];
        return obj;
    });
}
function record(recordModel, constraints) {
    var e_1, _a;
    if (constraints == null || (constraints.withDeletedKeys !== true && constraints.with_deleted_keys !== true))
        return rawRecord(recordModel);
    var updatedRecordModel = {};
    try {
        for (var _b = __values(Object.keys(recordModel)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var k = _c.value;
            updatedRecordModel[k] = option(recordModel[k].map(function (v) { return ({ value: v }); }));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return rawRecord(updatedRecordModel).map(function (obj) {
        var e_2, _a;
        var nobj = {};
        try {
            for (var _b = __values(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (obj[k] != null)
                    nobj[k] = obj[k].value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return nobj;
    });
}

var StreamArbitrary = (function (_super) {
    __extends(StreamArbitrary, _super);
    function StreamArbitrary(arb) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        return _this;
    }
    StreamArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var g = function (arb, clonedMrng) {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4, arb.generate(clonedMrng).value_];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        };
        var producer = function () { return new Stream(g(_this.arb, mrng.clone())); };
        var toString = function () { return "Stream(" + __spread(producer().take(10).map(stringify)).join(',') + "...)"; };
        var enrichedProducer = function () {
            var _a;
            return Object.assign(producer(), (_a = { toString: toString }, _a[cloneMethod] = enrichedProducer, _a));
        };
        return new Shrinkable(enrichedProducer());
    };
    StreamArbitrary.prototype.withBias = function (freq) {
        var _this = this;
        return biasWrapper(freq, this, function () { return new StreamArbitrary(_this.arb.withBias(freq)); });
    };
    return StreamArbitrary;
}(Arbitrary));
function infiniteStream(arb) {
    return new StreamArbitrary(arb);
}

var SubarrayArbitrary = (function (_super) {
    __extends(SubarrayArbitrary, _super);
    function SubarrayArbitrary(originalArray, isOrdered, minLength, maxLength) {
        var _this = _super.call(this) || this;
        _this.originalArray = originalArray;
        _this.isOrdered = isOrdered;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        if (minLength < 0 || minLength > originalArray.length)
            throw new Error('fc.*{s|S}ubarrayOf expects the minimal length to be between 0 and the size of the original array');
        if (maxLength < 0 || maxLength > originalArray.length)
            throw new Error('fc.*{s|S}ubarrayOf expects the maximal length to be between 0 and the size of the original array');
        if (minLength > maxLength)
            throw new Error('fc.*{s|S}ubarrayOf expects the minimal length to be inferior or equal to the maximal length');
        _this.lengthArb = integer(minLength, maxLength);
        return _this;
    }
    SubarrayArbitrary.prototype.wrapper = function (items, shrunkOnce) {
        var _this = this;
        return new Shrinkable(items, function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    SubarrayArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var remainingElements = this.originalArray.map(function (v, idx) { return idx; });
        var size = this.lengthArb.generate(mrng).value;
        var ids = [];
        for (var idx = 0; idx !== size; ++idx) {
            var selectedIdIndex = mrng.nextInt(0, remainingElements.length - 1);
            ids.push(remainingElements[selectedIdIndex]);
            remainingElements.splice(selectedIdIndex, 1);
        }
        if (this.isOrdered)
            ids.sort(function (a, b) { return a - b; });
        return this.wrapper(ids.map(function (i) { return _this.originalArray[i]; }), false);
    };
    SubarrayArbitrary.prototype.shrinkImpl = function (items, shrunkOnce) {
        var _this = this;
        if (items.length === 0) {
            return Stream.nil();
        }
        var size = this.lengthArb.shrinkableFor(items.length, shrunkOnce);
        return size
            .shrink()
            .map(function (l) { return items.slice(items.length - l.value); })
            .join(items.length > this.minLength
            ? makeLazy(function () {
                return _this.shrinkImpl(items.slice(1), false)
                    .filter(function (vs) { return _this.minLength <= vs.length + 1; })
                    .map(function (vs) { return [items[0]].concat(vs); });
            })
            : Stream.nil());
    };
    SubarrayArbitrary.prototype.withBias = function (freq) {
        return this.minLength !== this.maxLength
            ? biasWrapper(freq, this, function (originalArbitrary) {
                return new SubarrayArbitrary(originalArbitrary.originalArray, originalArbitrary.isOrdered, originalArbitrary.minLength, originalArbitrary.minLength +
                    Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)));
            })
            : this;
    };
    return SubarrayArbitrary;
}(Arbitrary));
function subarray(originalArray, minLength, maxLength) {
    if (minLength != null && maxLength != null)
        return new SubarrayArbitrary(originalArray, true, minLength, maxLength);
    return new SubarrayArbitrary(originalArray, true, 0, originalArray.length);
}
function shuffledSubarray(originalArray, minLength, maxLength) {
    if (minLength != null && maxLength != null)
        return new SubarrayArbitrary(originalArray, false, minLength, maxLength);
    return new SubarrayArbitrary(originalArray, false, 0, originalArray.length);
}

var padEight = function (arb) { return arb.map(function (n) { return StringPadStart(n.toString(16), 8, '0'); }); };
function uuid() {
    var padded = padEight(nat(0xffffffff));
    var secondPadded = padEight(integer(0x10000000, 0x5fffffff));
    var thirdPadded = padEight(integer(0x80000000, 0xbfffffff));
    return tuple(padded, secondPadded, thirdPadded, padded).map(function (t) {
        return t[0] + "-" + t[1].substring(4) + "-" + t[1].substring(0, 4) + "-" + t[2].substring(0, 4) + "-" + t[2].substring(4) + t[3];
    });
}
function uuidV(versionNumber) {
    var padded = padEight(nat(0xffffffff));
    var secondPadded = padEight(nat(0x0fffffff));
    var thirdPadded = padEight(integer(0x80000000, 0xbfffffff));
    return tuple(padded, secondPadded, thirdPadded, padded).map(function (t) {
        return t[0] + "-" + t[1].substring(4) + "-" + versionNumber + t[1].substring(1, 4) + "-" + t[2].substring(0, 4) + "-" + t[2].substring(4) + t[3];
    });
}

function webAuthority(constraints) {
    var c = constraints || {};
    var hostnameArbs = [domain()]
        .concat(c.withIPv4 === true ? [ipV4()] : [])
        .concat(c.withIPv6 === true ? [ipV6().map(function (ip) { return "[" + ip + "]"; })] : [])
        .concat(c.withIPv4Extended === true ? [ipV4Extended()] : []);
    return tuple(c.withUserInfo === true ? option(hostUserInfo()) : constant(null), oneof.apply(void 0, __spread(hostnameArbs)), c.withPort === true ? option(nat(65535)) : constant(null)).map(function (_a) {
        var _b = __read(_a, 3), u = _b[0], h = _b[1], p = _b[2];
        return (u === null ? '' : u + "@") + h + (p === null ? '' : ":" + p);
    });
}
function webSegment() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@'];
    return stringOf(buildAlphaNumericPercentArb(others));
}
function uriQueryOrFragment() {
    var others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@', '/', '?'];
    return stringOf(buildAlphaNumericPercentArb(others));
}
function webQueryParameters() {
    return uriQueryOrFragment();
}
function webFragments() {
    return uriQueryOrFragment();
}
function webUrl(constraints) {
    var c = constraints || {};
    var validSchemes = c.validSchemes || ['http', 'https'];
    var schemeArb = constantFrom.apply(void 0, __spread(validSchemes));
    var authorityArb = webAuthority(c.authoritySettings);
    var pathArb = array(webSegment()).map(function (p) { return p.map(function (v) { return "/" + v; }).join(''); });
    return tuple(schemeArb, authorityArb, pathArb, c.withQueryParameters === true ? option(webQueryParameters()) : constant(null), c.withFragments === true ? option(webFragments()) : constant(null)).map(function (_a) {
        var _b = __read(_a, 5), s = _b[0], a = _b[1], p = _b[2], q = _b[3], f = _b[4];
        return s + "://" + a + p + (q === null ? '' : "?" + q) + (f === null ? '' : "#" + f);
    });
}

var ReplayPath = (function () {
    function ReplayPath() {
    }
    ReplayPath.parse = function (replayPathStr) {
        var _a = __read(replayPathStr.split(':'), 2), serializedCount = _a[0], serializedChanges = _a[1];
        var counts = this.parseCounts(serializedCount);
        var changes = this.parseChanges(serializedChanges);
        return this.parseOccurences(counts, changes);
    };
    ReplayPath.stringify = function (replayPath) {
        var occurences = this.countOccurences(replayPath);
        var serializedCount = this.stringifyCounts(occurences);
        var serializedChanges = this.stringifyChanges(occurences);
        return serializedCount + ":" + serializedChanges;
    };
    ReplayPath.intToB64 = function (n) {
        if (n < 26)
            return String.fromCharCode(n + 65);
        if (n < 52)
            return String.fromCharCode(n + 97 - 26);
        if (n < 62)
            return String.fromCharCode(n + 48 - 52);
        return String.fromCharCode(n === 62 ? 43 : 47);
    };
    ReplayPath.b64ToInt = function (c) {
        if (c >= 'a')
            return c.charCodeAt(0) - 97 + 26;
        if (c >= 'A')
            return c.charCodeAt(0) - 65;
        if (c >= '0')
            return c.charCodeAt(0) - 48 + 52;
        return c === '+' ? 62 : 63;
    };
    ReplayPath.countOccurences = function (replayPath) {
        return replayPath.reduce(function (counts, cur) {
            if (counts.length === 0 || counts[counts.length - 1].count === 64 || counts[counts.length - 1].value !== cur)
                counts.push({ value: cur, count: 1 });
            else
                counts[counts.length - 1].count += 1;
            return counts;
        }, []);
    };
    ReplayPath.parseOccurences = function (counts, changes) {
        var replayPath = [];
        for (var idx = 0; idx !== counts.length; ++idx) {
            var count = counts[idx];
            var value = changes[idx];
            for (var num = 0; num !== count; ++num)
                replayPath.push(value);
        }
        return replayPath;
    };
    ReplayPath.stringifyChanges = function (occurences) {
        var serializedChanges = '';
        for (var idx = 0; idx < occurences.length; idx += 6) {
            var changesInt = occurences
                .slice(idx, idx + 6)
                .reduceRight(function (prev, cur) { return prev * 2 + (cur.value ? 1 : 0); }, 0);
            serializedChanges += this.intToB64(changesInt);
        }
        return serializedChanges;
    };
    ReplayPath.parseChanges = function (serializedChanges) {
        var _this = this;
        var changesInt = serializedChanges.split('').map(function (c) { return _this.b64ToInt(c); });
        var changes = [];
        for (var idx = 0; idx !== changesInt.length; ++idx) {
            var current = changesInt[idx];
            for (var n = 0; n !== 6; ++n, current >>= 1) {
                changes.push(current % 2 === 1);
            }
        }
        return changes;
    };
    ReplayPath.stringifyCounts = function (occurences) {
        var _this = this;
        return occurences.map(function (_a) {
            var count = _a.count;
            return _this.intToB64(count - 1);
        }).join('');
    };
    ReplayPath.parseCounts = function (serializedCount) {
        var _this = this;
        return serializedCount.split('').map(function (c) { return _this.b64ToInt(c) + 1; });
    };
    return ReplayPath;
}());

var CommandsIterable = (function () {
    function CommandsIterable(commands, metadataForReplay) {
        this.commands = commands;
        this.metadataForReplay = metadataForReplay;
    }
    CommandsIterable.prototype[Symbol.iterator] = function () {
        return this.commands[Symbol.iterator]();
    };
    CommandsIterable.prototype[cloneMethod] = function () {
        return new CommandsIterable(this.commands.map(function (c) { return c.clone(); }), this.metadataForReplay);
    };
    CommandsIterable.prototype.toString = function () {
        var serializedCommands = this.commands
            .filter(function (c) { return c.hasRan; })
            .map(function (c) { return c.toString(); })
            .join(',');
        var metadata = this.metadataForReplay();
        return metadata.length !== 0 ? serializedCommands + " /*" + metadata + "*/" : serializedCommands;
    };
    return CommandsIterable;
}());

var CommandWrapper = (function () {
    function CommandWrapper(cmd) {
        this.cmd = cmd;
        this.hasRan = false;
    }
    CommandWrapper.prototype.check = function (m) {
        return this.cmd.check(m);
    };
    CommandWrapper.prototype.run = function (m, r) {
        this.hasRan = true;
        return this.cmd.run(m, r);
    };
    CommandWrapper.prototype.clone = function () {
        if (hasCloneMethod(this.cmd))
            return new CommandWrapper(this.cmd[cloneMethod]());
        return new CommandWrapper(this.cmd);
    };
    CommandWrapper.prototype.toString = function () {
        return this.cmd.toString();
    };
    return CommandWrapper;
}());

var CommandsArbitrary = (function (_super) {
    __extends(CommandsArbitrary, _super);
    function CommandsArbitrary(commandArbs, maxCommands, sourceReplayPath, disableReplayLog) {
        var _this = _super.call(this) || this;
        _this.sourceReplayPath = sourceReplayPath;
        _this.disableReplayLog = disableReplayLog;
        _this.oneCommandArb = oneof.apply(void 0, __spread(commandArbs)).map(function (c) { return new CommandWrapper(c); });
        _this.lengthArb = nat(maxCommands);
        _this.replayPath = [];
        _this.replayPathPosition = 0;
        return _this;
    }
    CommandsArbitrary.prototype.metadataForReplay = function () {
        return this.disableReplayLog ? '' : "replayPath=" + JSON.stringify(ReplayPath.stringify(this.replayPath));
    };
    CommandsArbitrary.prototype.wrapper = function (items, shrunkOnce) {
        var _this = this;
        return new Shrinkable(new CommandsIterable(items.map(function (s) { return s.value_; }), function () { return _this.metadataForReplay(); }), function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    CommandsArbitrary.prototype.generate = function (mrng) {
        var size = this.lengthArb.generate(mrng);
        var items = Array(size.value_);
        for (var idx = 0; idx !== size.value_; ++idx) {
            var item = this.oneCommandArb.generate(mrng);
            items[idx] = item;
        }
        this.replayPathPosition = 0;
        return this.wrapper(items, false);
    };
    CommandsArbitrary.prototype.filterOnExecution = function (itemsRaw) {
        var e_1, _a;
        var items = [];
        try {
            for (var itemsRaw_1 = __values(itemsRaw), itemsRaw_1_1 = itemsRaw_1.next(); !itemsRaw_1_1.done; itemsRaw_1_1 = itemsRaw_1.next()) {
                var c = itemsRaw_1_1.value;
                if (c.value_.hasRan) {
                    this.replayPath.push(true);
                    items.push(c);
                }
                else
                    this.replayPath.push(false);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (itemsRaw_1_1 && !itemsRaw_1_1.done && (_a = itemsRaw_1["return"])) _a.call(itemsRaw_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return items;
    };
    CommandsArbitrary.prototype.filterOnReplay = function (itemsRaw) {
        var _this = this;
        return itemsRaw.filter(function (c, idx) {
            var state = _this.replayPath[_this.replayPathPosition + idx];
            if (state === undefined)
                throw new Error("Too short replayPath");
            if (!state && c.value_.hasRan)
                throw new Error("Mismatch between replayPath and real execution");
            return state;
        });
    };
    CommandsArbitrary.prototype.filterForShrinkImpl = function (itemsRaw) {
        if (this.replayPathPosition === 0) {
            this.replayPath = this.sourceReplayPath !== null ? ReplayPath.parse(this.sourceReplayPath) : [];
        }
        var items = this.replayPathPosition < this.replayPath.length
            ? this.filterOnReplay(itemsRaw)
            : this.filterOnExecution(itemsRaw);
        this.replayPathPosition += itemsRaw.length;
        return items;
    };
    CommandsArbitrary.prototype.shrinkImpl = function (itemsRaw, shrunkOnce) {
        var _this = this;
        var items = this.filterForShrinkImpl(itemsRaw);
        if (items.length === 0) {
            return Stream.nil();
        }
        var rootShrink = shrunkOnce
            ? Stream.nil()
            : new Stream([[]][Symbol.iterator]());
        var nextShrinks = [];
        var _loop_1 = function (numToKeep) {
            nextShrinks.push(makeLazy(function () {
                var size = _this.lengthArb.shrinkableFor(items.length - 1 - numToKeep, false);
                var fixedStart = items.slice(0, numToKeep);
                return size.shrink().map(function (l) { return fixedStart.concat(items.slice(items.length - (l.value + 1))); });
            }));
        };
        for (var numToKeep = 0; numToKeep !== items.length; ++numToKeep) {
            _loop_1(numToKeep);
        }
        var _loop_2 = function (itemAt) {
            nextShrinks.push(makeLazy(function () { return items[itemAt].shrink().map(function (v) { return items.slice(0, itemAt).concat([v], items.slice(itemAt + 1)); }); }));
        };
        for (var itemAt = 0; itemAt !== items.length; ++itemAt) {
            _loop_2(itemAt);
        }
        return rootShrink.join.apply(rootShrink, __spread(nextShrinks)).map(function (shrinkables) {
            return shrinkables.map(function (c) {
                return new Shrinkable(c.value_.clone(), c.shrink);
            });
        });
    };
    return CommandsArbitrary;
}(Arbitrary));
function commands(commandArbs, settings) {
    var config = settings == null ? {} : typeof settings === 'number' ? { maxCommands: settings } : settings;
    return new CommandsArbitrary(commandArbs, config.maxCommands != null ? config.maxCommands : 10, config.replayPath != null ? config.replayPath : null, !!config.disableReplayLog);
}

var ScheduledCommand = (function () {
    function ScheduledCommand(s, cmd) {
        this.s = s;
        this.cmd = cmd;
    }
    ScheduledCommand.prototype.check = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            var error, checkPassed, status;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        checkPassed = false;
                        return [4, this.s.scheduleSequence([
                                {
                                    label: "check@" + this.cmd.toString(),
                                    builder: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var err_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4, Promise.resolve(this.cmd.check(m))];
                                                case 1:
                                                    checkPassed = _a.sent();
                                                    return [3, 3];
                                                case 2:
                                                    err_1 = _a.sent();
                                                    error = err_1;
                                                    throw err_1;
                                                case 3: return [2];
                                            }
                                        });
                                    }); }
                                },
                            ]).task];
                    case 1:
                        status = _a.sent();
                        if (status.faulty) {
                            throw error;
                        }
                        return [2, checkPassed];
                }
            });
        });
    };
    ScheduledCommand.prototype.run = function (m, r) {
        return __awaiter(this, void 0, void 0, function () {
            var error, status;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        return [4, this.s.scheduleSequence([
                                {
                                    label: "run@" + this.cmd.toString(),
                                    builder: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var err_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4, this.cmd.run(m, r)];
                                                case 1:
                                                    _a.sent();
                                                    return [3, 3];
                                                case 2:
                                                    err_2 = _a.sent();
                                                    error = err_2;
                                                    throw err_2;
                                                case 3: return [2];
                                            }
                                        });
                                    }); }
                                },
                            ]).task];
                    case 1:
                        status = _a.sent();
                        if (status.faulty) {
                            throw error;
                        }
                        return [2];
                }
            });
        });
    };
    return ScheduledCommand;
}());
var scheduleCommands = function (s, cmds) {
    var cmds_1, cmds_1_1, cmd, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                cmds_1 = __values(cmds), cmds_1_1 = cmds_1.next();
                _b.label = 1;
            case 1:
                if (!!cmds_1_1.done) return [3, 4];
                cmd = cmds_1_1.value;
                return [4, new ScheduledCommand(s, cmd)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                cmds_1_1 = cmds_1.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 7];
            case 6:
                try {
                    if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1["return"])) _a.call(cmds_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 7: return [2];
        }
    });
};

var genericModelRun = function (s, cmds, initialValue, runCmd, then) {
    return s.then(function (o) {
        var e_1, _a;
        var model = o.model, real = o.real;
        var state = initialValue;
        var _loop_1 = function (c) {
            state = then(state, function () {
                return runCmd(c, model, real);
            });
        };
        try {
            for (var cmds_1 = __values(cmds), cmds_1_1 = cmds_1.next(); !cmds_1_1.done; cmds_1_1 = cmds_1.next()) {
                var c = cmds_1_1.value;
                _loop_1(c);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1["return"])) _a.call(cmds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return state;
    });
};
var internalModelRun = function (s, cmds) {
    var then = function (p, c) { return c(); };
    var setupProducer = {
        then: function (fun) {
            fun(s());
            return undefined;
        }
    };
    var runSync = function (cmd, m, r) {
        if (cmd.check(m))
            cmd.run(m, r);
        return undefined;
    };
    return genericModelRun(setupProducer, cmds, undefined, runSync, then);
};
var isAsyncSetup = function (s) {
    return typeof s.then === 'function';
};
var internalAsyncModelRun = function (s, cmds, defaultPromise) {
    if (defaultPromise === void 0) { defaultPromise = Promise.resolve(); }
    return __awaiter(void 0, void 0, void 0, function () {
        var then, setupProducer, runAsync;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    then = function (p, c) { return p.then(c); };
                    setupProducer = {
                        then: function (fun) {
                            var out = s();
                            if (isAsyncSetup(out))
                                return out.then(fun);
                            else
                                return fun(out);
                        }
                    };
                    runAsync = function (cmd, m, r) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cmd.check(m)];
                                case 1:
                                    if (!_a.sent()) return [3, 3];
                                    return [4, cmd.run(m, r)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2];
                            }
                        });
                    }); };
                    return [4, genericModelRun(setupProducer, cmds, defaultPromise, runAsync, then)];
                case 1: return [2, _a.sent()];
            }
        });
    });
};
var modelRun = function (s, cmds) {
    internalModelRun(s, cmds);
};
var asyncModelRun = function (s, cmds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, internalAsyncModelRun(s, cmds)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var scheduledModelRun = function (scheduler, s, cmds) { return __awaiter(void 0, void 0, void 0, function () {
    var scheduledCommands, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scheduledCommands = scheduleCommands(scheduler, cmds);
                out = internalAsyncModelRun(s, scheduledCommands, scheduler.schedule(Promise.resolve(), 'startModel'));
                return [4, scheduler.waitAll()];
            case 1:
                _a.sent();
                return [4, out];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };

function escapeForTemplateString(originalText) {
    return originalText.replace(/([$`\\])/g, '\\$1').replace(/\r/g, '\\r');
}

var SchedulerImplem = (function () {
    function SchedulerImplem(act, taskSelector) {
        this.act = act;
        this.taskSelector = taskSelector;
        this.lastTaskId = 0;
        this.sourceTaskSelector = taskSelector.clone();
        this.scheduledTasks = [];
        this.triggeredTasks = [];
    }
    SchedulerImplem.buildLog = function (reportItem) {
        return "[task${" + reportItem.taskId + "}] " + (reportItem.label.length !== 0 ? reportItem.schedulingType + "::" + reportItem.label : reportItem.schedulingType) + " " + reportItem.status + (reportItem.outputValue !== undefined ? " with value " + escapeForTemplateString(reportItem.outputValue) : '');
    };
    SchedulerImplem.prototype.log = function (schedulingType, taskId, label, metadata, status, data) {
        this.triggeredTasks.push({
            status: status,
            schedulingType: schedulingType,
            taskId: taskId,
            label: label,
            metadata: metadata,
            outputValue: data !== undefined ? stringify(data) : undefined
        });
    };
    SchedulerImplem.prototype.scheduleInternal = function (schedulingType, label, task, metadata, thenTaskToBeAwaited) {
        var _this = this;
        var trigger = null;
        var taskId = ++this.lastTaskId;
        var scheduledPromise = new Promise(function (resolve, reject) {
            trigger = function () {
                (thenTaskToBeAwaited ? task.then(function () { return thenTaskToBeAwaited(); }) : task).then(function (data) {
                    _this.log(schedulingType, taskId, label, metadata, 'resolved', data);
                    return resolve(data);
                }, function (err) {
                    _this.log(schedulingType, taskId, label, metadata, 'rejected', err);
                    return reject(err);
                });
            };
        });
        this.scheduledTasks.push({
            original: task,
            scheduled: scheduledPromise,
            trigger: trigger,
            schedulingType: schedulingType,
            taskId: taskId,
            label: label,
            metadata: metadata
        });
        return scheduledPromise;
    };
    SchedulerImplem.prototype.schedule = function (task, label, metadata) {
        return this.scheduleInternal('promise', label || '', task, metadata);
    };
    SchedulerImplem.prototype.scheduleFunction = function (asyncFunction) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.scheduleInternal('function', asyncFunction.name + "(" + args.map(stringify).join(',') + ")", asyncFunction.apply(void 0, __spread(args)), undefined);
        };
    };
    SchedulerImplem.prototype.scheduleSequence = function (sequenceBuilders) {
        var _this = this;
        var status = { done: false, faulty: false };
        var dummyResolvedPromise = { then: function (f) { return f(); } };
        var resolveSequenceTask = function () { };
        var sequenceTask = new Promise(function (resolve) { return (resolveSequenceTask = resolve); });
        sequenceBuilders
            .reduce(function (previouslyScheduled, item) {
            var _a = __read(typeof item === 'function' ? [item, item.name, undefined] : [item.builder, item.label, item.metadata], 3), builder = _a[0], label = _a[1], metadata = _a[2];
            return previouslyScheduled.then(function () {
                var scheduled = _this.scheduleInternal('sequence', label, dummyResolvedPromise, metadata, function () { return builder(); });
                scheduled["catch"](function () {
                    status.faulty = true;
                    resolveSequenceTask();
                });
                return scheduled;
            });
        }, dummyResolvedPromise)
            .then(function () {
            status.done = true;
            resolveSequenceTask();
        }, function () {
        });
        return Object.assign(status, {
            task: Promise.resolve(sequenceTask).then(function () {
                return { done: status.done, faulty: status.faulty };
            })
        });
    };
    SchedulerImplem.prototype.count = function () {
        return this.scheduledTasks.length;
    };
    SchedulerImplem.prototype.internalWaitOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var taskIndex, _a, scheduledTask, _err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.scheduledTasks.length === 0) {
                            throw new Error('No task scheduled');
                        }
                        taskIndex = this.taskSelector.nextTaskIndex(this.scheduledTasks);
                        _a = __read(this.scheduledTasks.splice(taskIndex, 1), 1), scheduledTask = _a[0];
                        scheduledTask.trigger();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, scheduledTask.scheduled];
                    case 2:
                        _b.sent();
                        return [3, 4];
                    case 3:
                        _err_1 = _b.sent();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    SchedulerImplem.prototype.waitOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.act(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.internalWaitOne()];
                                case 1: return [2, _a.sent()];
                            }
                        }); }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SchedulerImplem.prototype.waitAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.scheduledTasks.length > 0)) return [3, 2];
                        return [4, this.waitOne()];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        });
    };
    SchedulerImplem.prototype.report = function () {
        return __spread(this.triggeredTasks, this.scheduledTasks.map(function (t) { return ({
            status: 'pending',
            schedulingType: t.schedulingType,
            taskId: t.taskId,
            label: t.label,
            metadata: t.metadata
        }); }));
    };
    SchedulerImplem.prototype.toString = function () {
        return ('schedulerFor()`\n' +
            this.report()
                .map(SchedulerImplem.buildLog)
                .map(function (log) { return "-> " + log; })
                .join('\n') +
            '`');
    };
    SchedulerImplem.prototype[cloneMethod] = function () {
        return new SchedulerImplem(this.act, this.sourceTaskSelector);
    };
    return SchedulerImplem;
}());
var SchedulerArbitrary = (function (_super) {
    __extends(SchedulerArbitrary, _super);
    function SchedulerArbitrary(act) {
        var _this = _super.call(this) || this;
        _this.act = act;
        return _this;
    }
    SchedulerArbitrary.prototype.generate = function (mrng) {
        var buildNextTaskIndex = function (r) {
            return {
                clone: function () { return buildNextTaskIndex(r.clone()); },
                nextTaskIndex: function (scheduledTasks) {
                    return r.nextInt(0, scheduledTasks.length - 1);
                }
            };
        };
        return new Shrinkable(new SchedulerImplem(this.act, buildNextTaskIndex(mrng.clone())));
    };
    return SchedulerArbitrary;
}(Arbitrary));
function scheduler(constraints) {
    var _a = (constraints || {}).act, act = _a === void 0 ? function (f) { return f(); } : _a;
    return new SchedulerArbitrary(act);
}
function schedulerFor(customOrderingOrConstraints, constraintsOrUndefined) {
    var _a = (Array.isArray(customOrderingOrConstraints)
        ? constraintsOrUndefined || {}
        : customOrderingOrConstraints || {}).act, act = _a === void 0 ? function (f) { return f(); } : _a;
    var buildSchedulerFor = function (ordering) {
        var buildNextTaskIndex = function () {
            var numTasks = 0;
            return {
                clone: function () { return buildNextTaskIndex(); },
                nextTaskIndex: function (scheduledTasks) {
                    if (ordering.length <= numTasks) {
                        throw new Error("Invalid schedulerFor defined: too many tasks have been scheduled");
                    }
                    var taskIndex = scheduledTasks.findIndex(function (t) { return t.taskId === ordering[numTasks]; });
                    if (taskIndex === -1) {
                        throw new Error("Invalid schedulerFor defined: unable to find next task");
                    }
                    ++numTasks;
                    return taskIndex;
                }
            };
        };
        return new SchedulerImplem(act, buildNextTaskIndex());
    };
    if (Array.isArray(customOrderingOrConstraints)) {
        return buildSchedulerFor(customOrderingOrConstraints);
    }
    else {
        return function (_strs) {
            var ordering = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ordering[_i - 1] = arguments[_i];
            }
            return buildSchedulerFor(ordering);
        };
    }
}

var __type = 'module';
var __version = '1.26.0';

var fc = /*#__PURE__*/Object.freeze({
__proto__: null,
__type: __type,
__version: __version,
sample: sample,
statistics: statistics,
check: check,
assert: assert,
pre: pre,
property: property,
asyncProperty: asyncProperty,
boolean: boolean,
falsy: falsy,
float: float,
double: double,
integer: integer,
nat: nat,
maxSafeInteger: maxSafeInteger,
maxSafeNat: maxSafeNat,
bigIntN: bigIntN,
bigUintN: bigUintN,
bigInt: bigInt,
bigUint: bigUint,
char: char,
ascii: ascii,
char16bits: char16bits,
unicode: unicode,
fullUnicode: fullUnicode,
hexa: hexa,
base64: base64,
mixedCase: mixedCase,
string: string,
asciiString: asciiString,
string16bits: string16bits,
stringOf: stringOf,
unicodeString: unicodeString,
fullUnicodeString: fullUnicodeString,
hexaString: hexaString,
base64String: base64String,
lorem: lorem,
constant: constant,
constantFrom: constantFrom,
clonedConstant: clonedConstant,
mapToConstant: mapToConstant,
option: option,
oneof: oneof,
frequency: frequency,
dedup: dedup,
shuffledSubarray: shuffledSubarray,
subarray: subarray,
array: array,
infiniteStream: infiniteStream,
set: set,
tuple: tuple,
genericTuple: genericTuple,
record: record,
dictionary: dictionary,
anything: anything,
object: object,
json: json,
jsonObject: jsonObject,
unicodeJson: unicodeJson,
unicodeJsonObject: unicodeJsonObject,
letrec: letrec,
memo: memo,
compareBooleanFunc: compareBooleanFunc,
compareFunc: compareFunc,
func: func,
context: context,
date: date,
ipV4: ipV4,
ipV4Extended: ipV4Extended,
ipV6: ipV6,
domain: domain,
webAuthority: webAuthority,
webSegment: webSegment,
webFragments: webFragments,
webQueryParameters: webQueryParameters,
webUrl: webUrl,
emailAddress: emailAddress,
uuid: uuid,
uuidV: uuidV,
asyncModelRun: asyncModelRun,
modelRun: modelRun,
scheduledModelRun: scheduledModelRun,
commands: commands,
scheduler: scheduler,
schedulerFor: schedulerFor,
Arbitrary: Arbitrary,
Shrinkable: Shrinkable,
cloneMethod: cloneMethod,
stringify: stringify,
defaultReportMessage: defaultReportMessage,
get ExecutionStatus () { return ExecutionStatus; },
ObjectConstraints: ObjectConstraints,
Random: Random,
Stream: Stream,
stream: stream,
get VerbosityLevel () { return VerbosityLevel; },
configureGlobal: configureGlobal,
readConfigureGlobal: readConfigureGlobal,
resetConfigureGlobal: resetConfigureGlobal
});

/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
}
/*!
 * Primary Exports
 */

var assertionError = AssertionError;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || AssertionError;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  } else {
    try {
      throw new Error();
    } catch(e) {
      this.stack = e.stack;
    }
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError.prototype.constructor = AssertionError;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};

/* !
 * Chai - pathval utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

/**
 * ### .hasProperty(object, name)
 *
 * This allows checking whether an object has own
 * or inherited from prototype chain named property.
 *
 * Basically does the same thing as the `in`
 * operator but works properly with null/undefined values
 * and other primitives.
 *
 *     var obj = {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *
 * The following would be the results.
 *
 *     hasProperty(obj, 'str');  // true
 *     hasProperty(obj, 'constructor');  // true
 *     hasProperty(obj, 'bar');  // false
 *
 *     hasProperty(obj.str, 'length'); // true
 *     hasProperty(obj.str, 1);  // true
 *     hasProperty(obj.str, 5);  // false
 *
 *     hasProperty(obj.arr, 'length');  // true
 *     hasProperty(obj.arr, 2);  // true
 *     hasProperty(obj.arr, 3);  // false
 *
 * @param {Object} object
 * @param {String|Symbol} name
 * @returns {Boolean} whether it exists
 * @namespace Utils
 * @name hasProperty
 * @api public
 */

function hasProperty(obj, name) {
  if (typeof obj === 'undefined' || obj === null) {
    return false;
  }

  // The `in` operator does not work with primitives.
  return name in Object(obj);
}

/* !
 * ## parsePath(path)
 *
 * Helper function used to parse string object
 * paths. Use in conjunction with `internalGetPathValue`.
 *
 *      var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be infinitely deep and nested.
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
 *
 * @param {String} path
 * @returns {Object} parsed
 * @api private
 */

function parsePath(path) {
  var str = path.replace(/([^\\])\[/g, '$1.[');
  var parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function mapMatches(value) {
    var regexp = /^\[(\d+)\]$/;
    var mArr = regexp.exec(value);
    var parsed = null;
    if (mArr) {
      parsed = { i: parseFloat(mArr[1]) };
    } else {
      parsed = { p: value.replace(/\\([.\[\]])/g, '$1') };
    }

    return parsed;
  });
}

/* !
 * ## internalGetPathValue(obj, parsed[, pathDepth])
 *
 * Helper companion function for `.parsePath` that returns
 * the value located at the parsed address.
 *
 *      var value = getPathValue(obj, parsed);
 *
 * @param {Object} object to search against
 * @param {Object} parsed definition from `parsePath`.
 * @param {Number} depth (nesting level) of the property we want to retrieve
 * @returns {Object|Undefined} value
 * @api private
 */

function internalGetPathValue(obj, parsed, pathDepth) {
  var temporaryValue = obj;
  var res = null;
  pathDepth = (typeof pathDepth === 'undefined' ? parsed.length : pathDepth);

  for (var i = 0; i < pathDepth; i++) {
    var part = parsed[i];
    if (temporaryValue) {
      if (typeof part.p === 'undefined') {
        temporaryValue = temporaryValue[part.i];
      } else {
        temporaryValue = temporaryValue[part.p];
      }

      if (i === (pathDepth - 1)) {
        res = temporaryValue;
      }
    }
  }

  return res;
}

/* !
 * ## internalSetPathValue(obj, value, parsed)
 *
 * Companion function for `parsePath` that sets
 * the value located at a parsed address.
 *
 *  internalSetPathValue(obj, 'value', parsed);
 *
 * @param {Object} object to search and define on
 * @param {*} value to use upon set
 * @param {Object} parsed definition from `parsePath`
 * @api private
 */

function internalSetPathValue(obj, val, parsed) {
  var tempObj = obj;
  var pathDepth = parsed.length;
  var part = null;
  // Here we iterate through every part of the path
  for (var i = 0; i < pathDepth; i++) {
    var propName = null;
    var propVal = null;
    part = parsed[i];

    // If it's the last part of the path, we set the 'propName' value with the property name
    if (i === (pathDepth - 1)) {
      propName = typeof part.p === 'undefined' ? part.i : part.p;
      // Now we set the property with the name held by 'propName' on object with the desired val
      tempObj[propName] = val;
    } else if (typeof part.p !== 'undefined' && tempObj[part.p]) {
      tempObj = tempObj[part.p];
    } else if (typeof part.i !== 'undefined' && tempObj[part.i]) {
      tempObj = tempObj[part.i];
    } else {
      // If the obj doesn't have the property we create one with that name to define it
      var next = parsed[i + 1];
      // Here we set the name of the property which will be defined
      propName = typeof part.p === 'undefined' ? part.i : part.p;
      // Here we decide if this property will be an array or a new object
      propVal = typeof next.p === 'undefined' ? [] : {};
      tempObj[propName] = propVal;
      tempObj = tempObj[propName];
    }
  }
}

/**
 * ### .getPathInfo(object, path)
 *
 * This allows the retrieval of property info in an
 * object given a string path.
 *
 * The path info consists of an object with the
 * following properties:
 *
 * * parent - The parent object of the property referenced by `path`
 * * name - The name of the final property, a number if it was an array indexer
 * * value - The value of the property, if it exists, otherwise `undefined`
 * * exists - Whether the property exists or not
 *
 * @param {Object} object
 * @param {String} path
 * @returns {Object} info
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

function getPathInfo(obj, path) {
  var parsed = parsePath(path);
  var last = parsed[parsed.length - 1];
  var info = {
    parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: internalGetPathValue(obj, parsed),
  };
  info.exists = hasProperty(info.parent, info.name);

  return info;
}

/**
 * ### .getPathValue(object, path)
 *
 * This allows the retrieval of values in an
 * object given a string path.
 *
 *     var obj = {
 *         prop1: {
 *             arr: ['a', 'b', 'c']
 *           , str: 'Hello'
 *         }
 *       , prop2: {
 *             arr: [ { nested: 'Universe' } ]
 *           , str: 'Hello again!'
 *         }
 *     }
 *
 * The following would be the results.
 *
 *     getPathValue(obj, 'prop1.str'); // Hello
 *     getPathValue(obj, 'prop1.att[2]'); // b
 *     getPathValue(obj, 'prop2.arr[0].nested'); // Universe
 *
 * @param {Object} object
 * @param {String} path
 * @returns {Object} value or `undefined`
 * @namespace Utils
 * @name getPathValue
 * @api public
 */

function getPathValue(obj, path) {
  var info = getPathInfo(obj, path);
  return info.value;
}

/**
 * ### .setPathValue(object, path, value)
 *
 * Define the value in an object at a given string path.
 *
 * ```js
 * var obj = {
 *     prop1: {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *   , prop2: {
 *         arr: [ { nested: 'Universe' } ]
 *       , str: 'Hello again!'
 *     }
 * };
 * ```
 *
 * The following would be acceptable.
 *
 * ```js
 * var properties = require('tea-properties');
 * properties.set(obj, 'prop1.str', 'Hello Universe!');
 * properties.set(obj, 'prop1.arr[2]', 'B');
 * properties.set(obj, 'prop2.arr[0].nested.value', { hello: 'universe' });
 * ```
 *
 * @param {Object} object
 * @param {String} path
 * @param {Mixed} value
 * @api private
 */

function setPathValue(obj, path, val) {
  var parsed = parsePath(path);
  internalSetPathValue(obj, val, parsed);
  return obj;
}

var pathval = {
  hasProperty: hasProperty,
  getPathInfo: getPathInfo,
  getPathValue: getPathValue,
  setPathValue: setPathValue,
};

/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .flag(object, key, [value])
 *
 * Get or set a flag value on an object. If a
 * value is provided it will be set, else it will
 * return the currently set value or `undefined` if
 * the value is not set.
 *
 *     utils.flag(this, 'foo', 'bar'); // setter
 *     utils.flag(this, 'foo'); // getter, returns `bar`
 *
 * @param {Object} object constructed Assertion
 * @param {String} key
 * @param {Mixed} value (optional)
 * @namespace Utils
 * @name flag
 * @api private
 */

var flag = function flag(obj, key, value) {
  var flags = obj.__flags || (obj.__flags = Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
};

/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */



/**
 * ### .test(object, expression)
 *
 * Test and object for expression.
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name test
 */

var test = function test(obj, args) {
  var negate = flag(obj, 'negate')
    , expr = args[0];
  return negate ? !expr : expr;
};

var typeDetect = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	 module.exports = factory() ;
}(commonjsGlobal, (function () {
/* !
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var promiseExists = typeof Promise === 'function';

/* eslint-disable no-undef */
var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
/**
 * ### typeOf (obj)
 *
 * Uses `Object.prototype.toString` to determine the type of an object,
 * normalising behaviour across engine versions & well optimised.
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
function typeDetect(obj) {
  /* ! Speed optimisation
   * Pre:
   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
   * Post:
   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
   */
  var typeofObj = typeof obj;
  if (typeofObj !== 'object') {
    return typeofObj;
  }

  /* ! Speed optimisation
   * Pre:
   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
   * Post:
   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
   */
  if (obj === null) {
    return 'null';
  }

  /* ! Spec Conformance
   * Test: `Object.prototype.toString.call(window)``
   *  - Node === "[object global]"
   *  - Chrome === "[object global]"
   *  - Firefox === "[object Window]"
   *  - PhantomJS === "[object Window]"
   *  - Safari === "[object Window]"
   *  - IE 11 === "[object Window]"
   *  - IE Edge === "[object Window]"
   * Test: `Object.prototype.toString.call(this)``
   *  - Chrome Worker === "[object global]"
   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
   *  - IE 11 Worker === "[object WorkerGlobalScope]"
   *  - IE Edge Worker === "[object WorkerGlobalScope]"
   */
  if (obj === globalObject) {
    return 'global';
  }

  /* ! Speed optimisation
   * Pre:
   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
   * Post:
   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
   */
  if (
    Array.isArray(obj) &&
    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
  ) {
    return 'Array';
  }

  // Not caching existence of `window` and related properties due to potential
  // for `window` to be unset before tests in quasi-browser environments.
  if (typeof window === 'object' && window !== null) {
    /* ! Spec Conformance
     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
     * WhatWG HTML$7.7.3 - The `Location` interface
     * Test: `Object.prototype.toString.call(window.location)``
     *  - IE <=11 === "[object Object]"
     *  - IE Edge <=13 === "[object Object]"
     */
    if (typeof window.location === 'object' && obj === window.location) {
      return 'Location';
    }

    /* ! Spec Conformance
     * (https://html.spec.whatwg.org/#document)
     * WhatWG HTML$3.1.1 - The `Document` object
     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
     *       which suggests that browsers should use HTMLTableCellElement for
     *       both TD and TH elements. WhatWG separates these.
     *       WhatWG HTML states:
     *         > For historical reasons, Window objects must also have a
     *         > writable, configurable, non-enumerable property named
     *         > HTMLDocument whose value is the Document interface object.
     * Test: `Object.prototype.toString.call(document)``
     *  - Chrome === "[object HTMLDocument]"
     *  - Firefox === "[object HTMLDocument]"
     *  - Safari === "[object HTMLDocument]"
     *  - IE <=10 === "[object Document]"
     *  - IE 11 === "[object HTMLDocument]"
     *  - IE Edge <=13 === "[object HTMLDocument]"
     */
    if (typeof window.document === 'object' && obj === window.document) {
      return 'Document';
    }

    if (typeof window.navigator === 'object') {
      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
       *  - IE <=10 === "[object MSMimeTypesCollection]"
       */
      if (typeof window.navigator.mimeTypes === 'object' &&
          obj === window.navigator.mimeTypes) {
        return 'MimeTypeArray';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
       * Test: `Object.prototype.toString.call(navigator.plugins)``
       *  - IE <=10 === "[object MSPluginsCollection]"
       */
      if (typeof window.navigator.plugins === 'object' &&
          obj === window.navigator.plugins) {
        return 'PluginArray';
      }
    }

    if ((typeof window.HTMLElement === 'function' ||
        typeof window.HTMLElement === 'object') &&
        obj instanceof window.HTMLElement) {
      /* ! Spec Conformance
      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
      *  - IE <=10 === "[object HTMLBlockElement]"
      */
      if (obj.tagName === 'BLOCKQUOTE') {
        return 'HTMLQuoteElement';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
       *       which suggests that browsers should use HTMLTableCellElement for
       *       both TD and TH elements. WhatWG separates these.
       * Test: Object.prototype.toString.call(document.createElement('td'))
       *  - Chrome === "[object HTMLTableCellElement]"
       *  - Firefox === "[object HTMLTableCellElement]"
       *  - Safari === "[object HTMLTableCellElement]"
       */
      if (obj.tagName === 'TD') {
        return 'HTMLTableDataCellElement';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
       *       which suggests that browsers should use HTMLTableCellElement for
       *       both TD and TH elements. WhatWG separates these.
       * Test: Object.prototype.toString.call(document.createElement('th'))
       *  - Chrome === "[object HTMLTableCellElement]"
       *  - Firefox === "[object HTMLTableCellElement]"
       *  - Safari === "[object HTMLTableCellElement]"
       */
      if (obj.tagName === 'TH') {
        return 'HTMLTableHeaderCellElement';
      }
    }
  }

  /* ! Speed optimisation
  * Pre:
  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
  * Post:
  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
  */
  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
  if (typeof stringTag === 'string') {
    return stringTag;
  }

  var objPrototype = Object.getPrototypeOf(obj);
  /* ! Speed optimisation
  * Pre:
  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
  * Post:
  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
  */
  if (objPrototype === RegExp.prototype) {
    return 'RegExp';
  }

  /* ! Speed optimisation
  * Pre:
  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
  * Post:
  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
  */
  if (objPrototype === Date.prototype) {
    return 'Date';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
   * Test: `Object.prototype.toString.call(Promise.resolve())``
   *  - Chrome <=47 === "[object Object]"
   *  - Edge <=20 === "[object Object]"
   *  - Firefox 29-Latest === "[object Promise]"
   *  - Safari 7.1-Latest === "[object Promise]"
   */
  if (promiseExists && objPrototype === Promise.prototype) {
    return 'Promise';
  }

  /* ! Speed optimisation
  * Pre:
  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
  * Post:
  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
  */
  if (setExists && objPrototype === Set.prototype) {
    return 'Set';
  }

  /* ! Speed optimisation
  * Pre:
  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
  * Post:
  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
  */
  if (mapExists && objPrototype === Map.prototype) {
    return 'Map';
  }

  /* ! Speed optimisation
  * Pre:
  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
  * Post:
  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
  */
  if (weakSetExists && objPrototype === WeakSet.prototype) {
    return 'WeakSet';
  }

  /* ! Speed optimisation
  * Pre:
  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
  * Post:
  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
  */
  if (weakMapExists && objPrototype === WeakMap.prototype) {
    return 'WeakMap';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
   *  - Edge <=13 === "[object Object]"
   */
  if (dataViewExists && objPrototype === DataView.prototype) {
    return 'DataView';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
   * Test: `Object.prototype.toString.call(new Map().entries())``
   *  - Edge <=13 === "[object Object]"
   */
  if (mapExists && objPrototype === mapIteratorPrototype) {
    return 'Map Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
   * Test: `Object.prototype.toString.call(new Set().entries())``
   *  - Edge <=13 === "[object Object]"
   */
  if (setExists && objPrototype === setIteratorPrototype) {
    return 'Set Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
   *  - Edge <=13 === "[object Object]"
   */
  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
    return 'Array Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
   *  - Edge <=13 === "[object Object]"
   */
  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
    return 'String Iterator';
  }

  /* ! Speed optimisation
  * Pre:
  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
  * Post:
  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
  */
  if (objPrototype === null) {
    return 'Object';
  }

  return Object
    .prototype
    .toString
    .call(obj)
    .slice(toStringLeftSliceLength, toStringRightSliceLength);
}

return typeDetect;

})));
});

/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .expectTypes(obj, types)
 *
 * Ensures that the object being tested against is of a valid type.
 *
 *     utils.expectTypes(this, ['array', 'object', 'string']);
 *
 * @param {Mixed} obj constructed Assertion
 * @param {Array} type A list of allowed types for this assertion
 * @namespace Utils
 * @name expectTypes
 * @api public
 */





var expectTypes = function expectTypes(obj, types) {
  var flagMsg = flag(obj, 'message');
  var ssfi = flag(obj, 'ssfi');

  flagMsg = flagMsg ? flagMsg + ': ' : '';

  obj = flag(obj, 'object');
  types = types.map(function (t) { return t.toLowerCase(); });
  types.sort();

  // Transforms ['lorem', 'ipsum'] into 'a lorem, or an ipsum'
  var str = types.map(function (t, index) {
    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
    return or + art + ' ' + t;
  }).join(', ');

  var objType = typeDetect(obj).toLowerCase();

  if (!types.some(function (expected) { return objType === expected; })) {
    throw new assertionError(
      flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given',
      undefined,
      ssfi
    );
  }
};

/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getActual(object, [actual])
 *
 * Returns the `actual` value for an Assertion.
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getActual
 */

var getActual = function getActual(obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
};

/* !
 * Chai - getFuncName utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getFuncName(constructorFn)
 *
 * Returns the name of a function.
 * When a non-function instance is passed, returns `null`.
 * This also includes a polyfill function if `aFunc.name` is not defined.
 *
 * @name getFuncName
 * @param {Function} funct
 * @namespace Utils
 * @api public
 */

var toString = Function.prototype.toString;
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
function getFuncName(aFunc) {
  if (typeof aFunc !== 'function') {
    return null;
  }

  var name = '';
  if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
    // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
    var match = toString.call(aFunc).match(functionNameMatch);
    if (match) {
      name = match[1];
    }
  } else {
    // If we've got a `name` property we just use it
    name = aFunc.name;
  }

  return name;
}

var getFuncName_1 = getFuncName;

/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getProperties(object)
 *
 * This allows the retrieval of property names of an object, enumerable or not,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getProperties
 * @api public
 */

var getProperties = function getProperties(object) {
  var result = Object.getOwnPropertyNames(object);

  function addProperty(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }

  var proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
};

/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getEnumerableProperties(object)
 *
 * This allows the retrieval of enumerable property names of an object,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getEnumerableProperties
 * @api public
 */

var getEnumerableProperties = function getEnumerableProperties(object) {
  var result = [];
  for (var name in object) {
    result.push(name);
  }
  return result;
};

var config = {

  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {Boolean}
   * @api public
   */

  includeStack: false,

  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {Boolean}
   * @api public
   */

  showDiff: true,

  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded, for
   * example for large data structures, the value is replaced with something
   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   * This is especially userful when doing assertions on arrays: having this
   * set to a reasonable large value makes the failure messages readily
   * inspectable.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {Number}
   * @api public
   */

  truncateThreshold: 40,

  /**
   * ### config.useProxy
   *
   * User configurable property, defines if chai will use a Proxy to throw
   * an error when a non-existent property is read, which protects users
   * from typos when using property-based assertions.
   *
   * Set it to false if you want to disable this feature.
   *
   *     chai.config.useProxy = false;  // disable use of Proxy
   *
   * This feature is automatically disabled regardless of this config value
   * in environments that don't support proxies.
   *
   * @param {Boolean}
   * @api public
   */

  useProxy: true,

  /**
   * ### config.proxyExcludedKeys
   *
   * User configurable property, defines which properties should be ignored
   * instead of throwing an error if they do not exist on the assertion.
   * This is only applied if the environment Chai is running in supports proxies and
   * if the `useProxy` configuration setting is enabled.
   * By default, `then` and `inspect` will not throw an error if they do not exist on the
   * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
   * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
   *
   *     // By default these keys will not throw an error if they do not exist on the assertion object
   *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
   *
   * @param {Array}
   * @api public
   */

  proxyExcludedKeys: ['then', 'catch', 'inspect', 'toJSON']
};

var inspect_1 = createCommonjsModule(function (module, exports) {
// This is (almost) directly from Node.js utils
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js






module.exports = inspect;

/**
 * ### .inspect(obj, [showHidden], [depth], [colors])
 *
 * Echoes the value of a value. Tries to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects. Default is false.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 * @namespace Utils
 * @name inspect
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

// Returns true if object is a DOM element.
var isDOMElement = function (object) {
  if (typeof HTMLElement === 'object') {
    return object instanceof HTMLElement;
  } else {
    return object &&
      typeof object === 'object' &&
      'nodeType' in object &&
      object.nodeType === 1 &&
      typeof object.nodeName === 'string';
  }
};

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (typeof ret !== 'string') {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // If this is a DOM element, try to get the outer HTML.
  if (isDOMElement(value)) {
    if ('outerHTML' in value) {
      return value.outerHTML;
      // This value does not have an outerHTML attribute,
      //   it could still be an XML element
    } else {
      // Attempt to serialize it
      try {
        if (document.xmlVersion) {
          var xmlSerializer = new XMLSerializer();
          return xmlSerializer.serializeToString(value);
        } else {
          // Firefox 11- do not support outerHTML
          //   It does, however, support innerHTML
          //   Use the following to render the element
          var ns = "http://www.w3.org/1999/xhtml";
          var container = document.createElementNS(ns, '_');

          container.appendChild(value.cloneNode(false));
          var html = container.innerHTML
            .replace('><', '>' + value.innerHTML + '<');
          container.innerHTML = '';
          return html;
        }
      } catch (err) {
        // This could be a non-native DOM implementation,
        //   continue with the normal flow:
        //   printing the element as if it is an object.
      }
    }
  }

  // Look up the keys of the object.
  var visibleKeys = getEnumerableProperties(value);
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

  var name, nameSuffix;

  // Some type of object without properties can be shortcut.
  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,
  // a `stack` plus `description` property; ignore those for consistency.
  if (keys.length === 0 || (isError(value) && (
      (keys.length === 1 && keys[0] === 'stack') ||
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')
     ))) {
    if (typeof value === 'function') {
      name = getFuncName_1(value);
      nameSuffix = name ? ': ' + name : '';
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = ''
    , array = false
    , typedArray = false
    , braces = ['{', '}'];

  if (isTypedArray(value)) {
    typedArray = true;
    braces = ['[', ']'];
  }

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    name = getFuncName_1(value);
    nameSuffix = name ? ': ' + name : '';
    base = ' [Function' + nameSuffix + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    return formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else if (typedArray) {
    return formatTypedArray(value);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      if (value === 0 && (1/value) === -Infinity) {
        return ctx.stylize('-0', 'number');
      }
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');

    case 'symbol':
      return ctx.stylize(value.toString(), 'symbol');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}

function formatTypedArray(value) {
  var str = '[ ';

  for (var i = 0; i < value.length; ++i) {
    if (str.length >= config.truncateThreshold - 7) {
      str += '...';
      break;
    }
    str += value[i] + ', ';
  }
  str += ' ]';

  // Removing trailing `, ` if the array was not truncated
  if (str.indexOf(',  ]') !== -1) {
    str = str.replace(',  ]', ' ]');
  }

  return str;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name;
  var propDescriptor = Object.getOwnPropertyDescriptor(value, key);
  var str;

  if (propDescriptor) {
    if (propDescriptor.get) {
      if (propDescriptor.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (propDescriptor.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (visibleKeys.indexOf(key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isTypedArray(ar) {
  // Unfortunately there's no way to check if an object is a TypedArray
  // We have to check if it's one of these types
  return (typeof ar === 'object' && /\w+Array]$/.test(objectToString(ar)));
}

function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
});

/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */




/**
 * ### .objDisplay(object)
 *
 * Determines if an object or an array matches
 * criteria to be inspected in-line for error
 * messages or should be truncated.
 *
 * @param {Mixed} javascript object to inspect
 * @name objDisplay
 * @namespace Utils
 * @api public
 */

var objDisplay = function objDisplay(obj) {
  var str = inspect_1(obj)
    , type = Object.prototype.toString.call(obj);

  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type === '[object Function]') {
      return !obj.name || obj.name === ''
        ? '[Function]'
        : '[Function: ' + obj.name + ']';
    } else if (type === '[object Array]') {
      return '[ Array(' + obj.length + ') ]';
    } else if (type === '[object Object]') {
      var keys = Object.keys(obj)
        , kstr = keys.length > 2
          ? keys.splice(0, 2).join(', ') + ', ...'
          : keys.join(', ');
      return '{ Object (' + kstr + ') }';
    } else {
      return str;
    }
  } else {
    return str;
  }
};

/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */



/**
 * ### .getMessage(object, message, negateMessage)
 *
 * Construct the error message based on flags
 * and template tags. Template tags will return
 * a stringified inspection of the object referenced.
 *
 * Message template tags:
 * - `#{this}` current asserted object
 * - `#{act}` actual value
 * - `#{exp}` expected value
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getMessage
 * @api public
 */

var getMessage = function getMessage(obj, args) {
  var negate = flag(obj, 'negate')
    , val = flag(obj, 'object')
    , expected = args[3]
    , actual = getActual(obj, args)
    , msg = negate ? args[2] : args[1]
    , flagMsg = flag(obj, 'message');

  if(typeof msg === "function") msg = msg();
  msg = msg || '';
  msg = msg
    .replace(/#\{this\}/g, function () { return objDisplay(val); })
    .replace(/#\{act\}/g, function () { return objDisplay(actual); })
    .replace(/#\{exp\}/g, function () { return objDisplay(expected); });

  return flagMsg ? flagMsg + ': ' + msg : msg;
};

/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .transferFlags(assertion, object, includeAll = true)
 *
 * Transfer all the flags for `assertion` to `object`. If
 * `includeAll` is set to `false`, then the base Chai
 * assertion flags (namely `object`, `ssfi`, `lockSsfi`,
 * and `message`) will not be transferred.
 *
 *
 *     var newAssertion = new Assertion();
 *     utils.transferFlags(assertion, newAssertion);
 *
 *     var anotherAssertion = new Assertion(myObj);
 *     utils.transferFlags(assertion, anotherAssertion, false);
 *
 * @param {Assertion} assertion the assertion to transfer the flags from
 * @param {Object} object the object to transfer the flags to; usually a new assertion
 * @param {Boolean} includeAll
 * @namespace Utils
 * @name transferFlags
 * @api private
 */

var transferFlags = function transferFlags(assertion, object, includeAll) {
  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

  if (!object.__flags) {
    object.__flags = Object.create(null);
  }

  includeAll = arguments.length === 3 ? includeAll : true;

  for (var flag in flags) {
    if (includeAll ||
        (flag !== 'object' && flag !== 'ssfi' && flag !== 'lockSsfi' && flag != 'message')) {
      object.__flags[flag] = flags[flag];
    }
  }
};

/* globals Symbol: false, Uint8Array: false, WeakMap: false */
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


function FakeMap() {
  this._key = 'chai/deep-eql__' + Math.random() + Date.now();
}

FakeMap.prototype = {
  get: function getMap(key) {
    return key[this._key];
  },
  set: function setMap(key, value) {
    if (Object.isExtensible(key)) {
      Object.defineProperty(key, this._key, {
        value: value,
        configurable: true,
      });
    }
  },
};

var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
/*!
 * Check to see if the MemoizeMap has recorded a result of the two operands
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {MemoizeMap} memoizeMap
 * @returns {Boolean|null} result
*/
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
  // Technically, WeakMap keys can *only* be objects, not primitives.
  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
    return null;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    var result = leftHandMap.get(rightHandOperand);
    if (typeof result === 'boolean') {
      return result;
    }
  }
  return null;
}

/*!
 * Set the result of the equality into the MemoizeMap
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {MemoizeMap} memoizeMap
 * @param {Boolean} result
*/
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
  // Technically, WeakMap keys can *only* be objects, not primitives.
  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
    return;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    leftHandMap.set(rightHandOperand, result);
  } else {
    leftHandMap = new MemoizeMap();
    leftHandMap.set(rightHandOperand, result);
    memoizeMap.set(leftHandOperand, leftHandMap);
  }
}

/*!
 * Primary Export
 */

var deepEql = deepEqual;
var MemoizeMap_1 = MemoizeMap;

/**
 * Assert deeply nested sameValue equality between two objects of any type.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (optional) Additional options
 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
    references to blow the stack.
 * @return {Boolean} equal match
 */
function deepEqual(leftHandOperand, rightHandOperand, options) {
  // If we have a comparator, we can't assume anything; so bail to its check first.
  if (options && options.comparator) {
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
  }

  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
  if (simpleResult !== null) {
    return simpleResult;
  }

  // Deeper comparisons are pushed through to a larger function
  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}

/**
 * Many comparisons can be canceled out early via simple equality or primitive checks.
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @return {Boolean|null} equal match
 */
function simpleEqual(leftHandOperand, rightHandOperand) {
  // Equal references (except for Numbers) can be returned early
  if (leftHandOperand === rightHandOperand) {
    // Handle +-0 cases
    return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
  }

  // handle NaN cases
  if (
    leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
    rightHandOperand !== rightHandOperand // eslint-disable-line no-self-compare
  ) {
    return true;
  }

  // Anything that is not an 'object', i.e. symbols, functions, booleans, numbers,
  // strings, and undefined, can be compared by reference.
  if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
    // Easy out b/c it would have passed the first equality check
    return false;
  }
  return null;
}

/*!
 * The main logic of the `deepEqual` function.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (optional) Additional options
 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
    references to blow the stack.
 * @return {Boolean} equal match
*/
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
  options = options || {};
  options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
  var comparator = options && options.comparator;

  // Check if a memoized result exists.
  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
  if (memoizeResultLeft !== null) {
    return memoizeResultLeft;
  }
  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
  if (memoizeResultRight !== null) {
    return memoizeResultRight;
  }

  // If a comparator is present, use it.
  if (comparator) {
    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
    // Comparators may return null, in which case we want to go back to default behavior.
    if (comparatorResult === false || comparatorResult === true) {
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
      return comparatorResult;
    }
    // To allow comparators to override *any* behavior, we ran them first. Since it didn't decide
    // what to do, we need to make sure to return the basic tests first before we move on.
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) {
      // Don't memoize this, it takes longer to set/retrieve than to just compare.
      return simpleResult;
    }
  }

  var leftHandType = typeDetect(leftHandOperand);
  if (leftHandType !== typeDetect(rightHandOperand)) {
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
    return false;
  }

  // Temporarily set the operands in the memoize object to prevent blowing the stack
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);

  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
  return result;
}

function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
  switch (leftHandType) {
    case 'String':
    case 'Number':
    case 'Boolean':
    case 'Date':
      // If these types are their instance types (e.g. `new Number`) then re-deepEqual against their values
      return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
    case 'Promise':
    case 'Symbol':
    case 'function':
    case 'WeakMap':
    case 'WeakSet':
    case 'Error':
      return leftHandOperand === rightHandOperand;
    case 'Arguments':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'Array':
      return iterableEqual(leftHandOperand, rightHandOperand, options);
    case 'RegExp':
      return regexpEqual(leftHandOperand, rightHandOperand);
    case 'Generator':
      return generatorEqual(leftHandOperand, rightHandOperand, options);
    case 'DataView':
      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
    case 'ArrayBuffer':
      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
    case 'Set':
      return entriesEqual(leftHandOperand, rightHandOperand, options);
    case 'Map':
      return entriesEqual(leftHandOperand, rightHandOperand, options);
    default:
      return objectEqual(leftHandOperand, rightHandOperand, options);
  }
}

/*!
 * Compare two Regular Expressions for equality.
 *
 * @param {RegExp} leftHandOperand
 * @param {RegExp} rightHandOperand
 * @return {Boolean} result
 */

function regexpEqual(leftHandOperand, rightHandOperand) {
  return leftHandOperand.toString() === rightHandOperand.toString();
}

/*!
 * Compare two Sets/Maps for equality. Faster than other equality functions.
 *
 * @param {Set} leftHandOperand
 * @param {Set} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */

function entriesEqual(leftHandOperand, rightHandOperand, options) {
  // IE11 doesn't support Set#entries or Set#@@iterator, so we need manually populate using Set#forEach
  if (leftHandOperand.size !== rightHandOperand.size) {
    return false;
  }
  if (leftHandOperand.size === 0) {
    return true;
  }
  var leftHandItems = [];
  var rightHandItems = [];
  leftHandOperand.forEach(function gatherEntries(key, value) {
    leftHandItems.push([ key, value ]);
  });
  rightHandOperand.forEach(function gatherEntries(key, value) {
    rightHandItems.push([ key, value ]);
  });
  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}

/*!
 * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */

function iterableEqual(leftHandOperand, rightHandOperand, options) {
  var length = leftHandOperand.length;
  if (length !== rightHandOperand.length) {
    return false;
  }
  if (length === 0) {
    return true;
  }
  var index = -1;
  while (++index < length) {
    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
      return false;
    }
  }
  return true;
}

/*!
 * Simple equality for generator objects such as those returned by generator functions.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */

function generatorEqual(leftHandOperand, rightHandOperand, options) {
  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}

/*!
 * Determine if the given object has an @@iterator function.
 *
 * @param {Object} target
 * @return {Boolean} `true` if the object has an @@iterator function.
 */
function hasIteratorFunction(target) {
  return typeof Symbol !== 'undefined' &&
    typeof target === 'object' &&
    typeof Symbol.iterator !== 'undefined' &&
    typeof target[Symbol.iterator] === 'function';
}

/*!
 * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
 * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
 *
 * @param {Object} target
 * @returns {Array} an array of entries from the @@iterator function
 */
function getIteratorEntries(target) {
  if (hasIteratorFunction(target)) {
    try {
      return getGeneratorEntries(target[Symbol.iterator]());
    } catch (iteratorError) {
      return [];
    }
  }
  return [];
}

/*!
 * Gets all entries from a Generator. This will consume the generator - which could have side effects.
 *
 * @param {Generator} target
 * @returns {Array} an array of entries from the Generator.
 */
function getGeneratorEntries(generator) {
  var generatorResult = generator.next();
  var accumulator = [ generatorResult.value ];
  while (generatorResult.done === false) {
    generatorResult = generator.next();
    accumulator.push(generatorResult.value);
  }
  return accumulator;
}

/*!
 * Gets all own and inherited enumerable keys from a target.
 *
 * @param {Object} target
 * @returns {Array} an array of own and inherited enumerable keys from the target.
 */
function getEnumerableKeys(target) {
  var keys = [];
  for (var key in target) {
    keys.push(key);
  }
  return keys;
}

/*!
 * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
 * each key. If any value of the given key is not equal, the function will return false (early).
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
  var length = keys.length;
  if (length === 0) {
    return true;
  }
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
      return false;
    }
  }
  return true;
}

/*!
 * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
 * for each enumerable key in the object.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */

function objectEqual(leftHandOperand, rightHandOperand, options) {
  var leftHandKeys = getEnumerableKeys(leftHandOperand);
  var rightHandKeys = getEnumerableKeys(rightHandOperand);
  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
    leftHandKeys.sort();
    rightHandKeys.sort();
    if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
      return false;
    }
    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
  }

  var leftHandEntries = getIteratorEntries(leftHandOperand);
  var rightHandEntries = getIteratorEntries(rightHandOperand);
  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
    leftHandEntries.sort();
    rightHandEntries.sort();
    return iterableEqual(leftHandEntries, rightHandEntries, options);
  }

  if (leftHandKeys.length === 0 &&
      leftHandEntries.length === 0 &&
      rightHandKeys.length === 0 &&
      rightHandEntries.length === 0) {
    return true;
  }

  return false;
}

/*!
 * Returns true if the argument is a primitive.
 *
 * This intentionally returns true for all objects that can be compared by reference,
 * including functions and symbols.
 *
 * @param {Mixed} value
 * @return {Boolean} result
 */
function isPrimitive(value) {
  return value === null || typeof value !== 'object';
}
deepEql.MemoizeMap = MemoizeMap_1;

/*!
 * Chai - isProxyEnabled helper
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .isProxyEnabled()
 *
 * Helper function to check if Chai's proxy protection feature is enabled. If
 * proxies are unsupported or disabled via the user's Chai config, then return
 * false. Otherwise, return true.
 *
 * @namespace Utils
 * @name isProxyEnabled
 */

var isProxyEnabled = function isProxyEnabled() {
  return config.useProxy &&
    typeof Proxy !== 'undefined' &&
    typeof Reflect !== 'undefined';
};

/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */






/**
 * ### .addProperty(ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @namespace Utils
 * @name addProperty
 * @api public
 */

var addProperty = function addProperty(ctx, name, getter) {
  getter = getter === undefined ? function () {} : getter;

  Object.defineProperty(ctx, name,
    { get: function propertyGetter() {
        // Setting the `ssfi` flag to `propertyGetter` causes this function to
        // be the starting point for removing implementation frames from the
        // stack trace of a failed assertion.
        //
        // However, we only want to use this function as the starting point if
        // the `lockSsfi` flag isn't set and proxy protection is disabled.
        //
        // If the `lockSsfi` flag is set, then either this assertion has been
        // overwritten by another assertion, or this assertion is being invoked
        // from inside of another assertion. In the first case, the `ssfi` flag
        // has already been set by the overwriting assertion. In the second
        // case, the `ssfi` flag has already been set by the outer assertion.
        //
        // If proxy protection is enabled, then the `ssfi` flag has already been
        // set by the proxy getter.
        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
          flag(this, 'ssfi', propertyGetter);
        }

        var result = getter.call(this);
        if (result !== undefined)
          return result;

        var newAssertion = new chai.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      }
    , configurable: true
  });
};

var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');

/*!
 * Chai - addLengthGuard utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .addLengthGuard(fn, assertionName, isChainable)
 *
 * Define `length` as a getter on the given uninvoked method assertion. The
 * getter acts as a guard against chaining `length` directly off of an uninvoked
 * method assertion, which is a problem because it references `function`'s
 * built-in `length` property instead of Chai's `length` assertion. When the
 * getter catches the user making this mistake, it throws an error with a
 * helpful message.
 *
 * There are two ways in which this mistake can be made. The first way is by
 * chaining the `length` assertion directly off of an uninvoked chainable
 * method. In this case, Chai suggests that the user use `lengthOf` instead. The
 * second way is by chaining the `length` assertion directly off of an uninvoked
 * non-chainable method. Non-chainable methods must be invoked prior to
 * chaining. In this case, Chai suggests that the user consult the docs for the
 * given assertion.
 *
 * If the `length` property of functions is unconfigurable, then return `fn`
 * without modification.
 *
 * Note that in ES6, the function's `length` property is configurable, so once
 * support for legacy environments is dropped, Chai's `length` property can
 * replace the built-in function's `length` property, and this length guard will
 * no longer be necessary. In the mean time, maintaining consistency across all
 * environments is the priority.
 *
 * @param {Function} fn
 * @param {String} assertionName
 * @param {Boolean} isChainable
 * @namespace Utils
 * @name addLengthGuard
 */

var addLengthGuard = function addLengthGuard (fn, assertionName, isChainable) {
  if (!fnLengthDesc.configurable) return fn;

  Object.defineProperty(fn, 'length', {
    get: function () {
      if (isChainable) {
        throw Error('Invalid Chai property: ' + assertionName + '.length. Due' +
          ' to a compatibility issue, "length" cannot directly follow "' +
          assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
      }

      throw Error('Invalid Chai property: ' + assertionName + '.length. See' +
        ' docs for proper usage of "' + assertionName + '".');
    }
  });

  return fn;
};

/*!
 * Chai - proxify utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .proxify(object)
 *
 * Return a proxy of given object that throws an error when a non-existent
 * property is read. By default, the root cause is assumed to be a misspelled
 * property, and thus an attempt is made to offer a reasonable suggestion from
 * the list of existing properties. However, if a nonChainableMethodName is
 * provided, then the root cause is instead a failure to invoke a non-chainable
 * method prior to reading the non-existent property.
 *
 * If proxies are unsupported or disabled via the user's Chai config, then
 * return object without modification.
 *
 * @param {Object} obj
 * @param {String} nonChainableMethodName
 * @namespace Utils
 * @name proxify
 */

var builtins = ['__flags', '__methods', '_obj', 'assert'];

var proxify = function proxify(obj, nonChainableMethodName) {
  if (!isProxyEnabled()) return obj;

  return new Proxy(obj, {
    get: function proxyGetter(target, property) {
      // This check is here because we should not throw errors on Symbol properties
      // such as `Symbol.toStringTag`.
      // The values for which an error should be thrown can be configured using
      // the `config.proxyExcludedKeys` setting.
      if (typeof property === 'string' &&
          config.proxyExcludedKeys.indexOf(property) === -1 &&
          !Reflect.has(target, property)) {
        // Special message for invalid property access of non-chainable methods.
        if (nonChainableMethodName) {
          throw Error('Invalid Chai property: ' + nonChainableMethodName + '.' +
            property + '. See docs for proper usage of "' +
            nonChainableMethodName + '".');
        }

        // If the property is reasonably close to an existing Chai property,
        // suggest that property to the user. Only suggest properties with a
        // distance less than 4.
        var suggestion = null;
        var suggestionDistance = 4;
        getProperties(target).forEach(function(prop) {
          if (
            !Object.prototype.hasOwnProperty(prop) &&
            builtins.indexOf(prop) === -1
          ) {
            var dist = stringDistanceCapped(
              property,
              prop,
              suggestionDistance
            );
            if (dist < suggestionDistance) {
              suggestion = prop;
              suggestionDistance = dist;
            }
          }
        });

        if (suggestion !== null) {
          throw Error('Invalid Chai property: ' + property +
            '. Did you mean "' + suggestion + '"?');
        } else {
          throw Error('Invalid Chai property: ' + property);
        }
      }

      // Use this proxy getter as the starting point for removing implementation
      // frames from the stack trace of a failed assertion. For property
      // assertions, this prevents the proxy getter from showing up in the stack
      // trace since it's invoked before the property getter. For method and
      // chainable method assertions, this flag will end up getting changed to
      // the method wrapper, which is good since this frame will no longer be in
      // the stack once the method is invoked. Note that Chai builtin assertion
      // properties such as `__flags` are skipped since this is only meant to
      // capture the starting point of an assertion. This step is also skipped
      // if the `lockSsfi` flag is set, thus indicating that this assertion is
      // being called from within another assertion. In that case, the `ssfi`
      // flag is already set to the outer assertion's starting point.
      if (builtins.indexOf(property) === -1 && !flag(target, 'lockSsfi')) {
        flag(target, 'ssfi', proxyGetter);
      }

      return Reflect.get(target, property);
    }
  });
};

/**
 * # stringDistanceCapped(strA, strB, cap)
 * Return the Levenshtein distance between two strings, but no more than cap.
 * @param {string} strA
 * @param {string} strB
 * @param {number} number
 * @return {number} min(string distance between strA and strB, cap)
 * @api private
 */

function stringDistanceCapped(strA, strB, cap) {
  if (Math.abs(strA.length - strB.length) >= cap) {
    return cap;
  }

  var memo = [];
  // `memo` is a two-dimensional array containing distances.
  // memo[i][j] is the distance between strA.slice(0, i) and
  // strB.slice(0, j).
  for (var i = 0; i <= strA.length; i++) {
    memo[i] = Array(strB.length + 1).fill(0);
    memo[i][0] = i;
  }
  for (var j = 0; j < strB.length; j++) {
    memo[0][j] = j;
  }

  for (var i = 1; i <= strA.length; i++) {
    var ch = strA.charCodeAt(i - 1);
    for (var j = 1; j <= strB.length; j++) {
      if (Math.abs(i - j) >= cap) {
        memo[i][j] = cap;
        continue;
      }
      memo[i][j] = Math.min(
        memo[i - 1][j] + 1,
        memo[i][j - 1] + 1,
        memo[i - 1][j - 1] +
          (ch === strB.charCodeAt(j - 1) ? 0 : 1)
      );
    }
  }

  return memo[strA.length][strB.length];
}

/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */







/**
 * ### .addMethod(ctx, name, method)
 *
 * Adds a method to the prototype of an object.
 *
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(fooStr).to.be.foo('bar');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for name
 * @namespace Utils
 * @name addMethod
 * @api public
 */

var addMethod = function addMethod(ctx, name, method) {
  var methodWrapper = function () {
    // Setting the `ssfi` flag to `methodWrapper` causes this function to be the
    // starting point for removing implementation frames from the stack trace of
    // a failed assertion.
    //
    // However, we only want to use this function as the starting point if the
    // `lockSsfi` flag isn't set.
    //
    // If the `lockSsfi` flag is set, then either this assertion has been
    // overwritten by another assertion, or this assertion is being invoked from
    // inside of another assertion. In the first case, the `ssfi` flag has
    // already been set by the overwriting assertion. In the second case, the
    // `ssfi` flag has already been set by the outer assertion.
    if (!flag(this, 'lockSsfi')) {
      flag(this, 'ssfi', methodWrapper);
    }

    var result = method.apply(this, arguments);
    if (result !== undefined)
      return result;

    var newAssertion = new chai.Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  };

  addLengthGuard(methodWrapper, name, false);
  ctx[name] = proxify(methodWrapper, name);
};

/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */






/**
 * ### .overwriteProperty(ctx, name, fn)
 *
 * Overwrites an already existing property getter and provides
 * access to previous value. Must return function to use as getter.
 *
 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
 *       return function () {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.name).to.equal('bar');
 *         } else {
 *           _super.call(this);
 *         }
 *       }
 *     });
 *
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.ok;
 *
 * @param {Object} ctx object whose property is to be overwritten
 * @param {String} name of property to overwrite
 * @param {Function} getter function that returns a getter function to be used for name
 * @namespace Utils
 * @name overwriteProperty
 * @api public
 */

var overwriteProperty = function overwriteProperty(ctx, name, getter) {
  var _get = Object.getOwnPropertyDescriptor(ctx, name)
    , _super = function () {};

  if (_get && 'function' === typeof _get.get)
    _super = _get.get;

  Object.defineProperty(ctx, name,
    { get: function overwritingPropertyGetter() {
        // Setting the `ssfi` flag to `overwritingPropertyGetter` causes this
        // function to be the starting point for removing implementation frames
        // from the stack trace of a failed assertion.
        //
        // However, we only want to use this function as the starting point if
        // the `lockSsfi` flag isn't set and proxy protection is disabled.
        //
        // If the `lockSsfi` flag is set, then either this assertion has been
        // overwritten by another assertion, or this assertion is being invoked
        // from inside of another assertion. In the first case, the `ssfi` flag
        // has already been set by the overwriting assertion. In the second
        // case, the `ssfi` flag has already been set by the outer assertion.
        //
        // If proxy protection is enabled, then the `ssfi` flag has already been
        // set by the proxy getter.
        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
          flag(this, 'ssfi', overwritingPropertyGetter);
        }

        // Setting the `lockSsfi` flag to `true` prevents the overwritten
        // assertion from changing the `ssfi` flag. By this point, the `ssfi`
        // flag is already set to the correct starting point for this assertion.
        var origLockSsfi = flag(this, 'lockSsfi');
        flag(this, 'lockSsfi', true);
        var result = getter(_super).call(this);
        flag(this, 'lockSsfi', origLockSsfi);

        if (result !== undefined) {
          return result;
        }

        var newAssertion = new chai.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      }
    , configurable: true
  });
};

/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */







/**
 * ### .overwriteMethod(ctx, name, fn)
 *
 * Overwrites an already existing method and provides
 * access to previous function. Must return function
 * to be used for name.
 *
 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
 *       return function (str) {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.value).to.equal(str);
 *         } else {
 *           _super.apply(this, arguments);
 *         }
 *       }
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.equal('bar');
 *
 * @param {Object} ctx object whose method is to be overwritten
 * @param {String} name of method to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @namespace Utils
 * @name overwriteMethod
 * @api public
 */

var overwriteMethod = function overwriteMethod(ctx, name, method) {
  var _method = ctx[name]
    , _super = function () {
      throw new Error(name + ' is not a function');
    };

  if (_method && 'function' === typeof _method)
    _super = _method;

  var overwritingMethodWrapper = function () {
    // Setting the `ssfi` flag to `overwritingMethodWrapper` causes this
    // function to be the starting point for removing implementation frames from
    // the stack trace of a failed assertion.
    //
    // However, we only want to use this function as the starting point if the
    // `lockSsfi` flag isn't set.
    //
    // If the `lockSsfi` flag is set, then either this assertion has been
    // overwritten by another assertion, or this assertion is being invoked from
    // inside of another assertion. In the first case, the `ssfi` flag has
    // already been set by the overwriting assertion. In the second case, the
    // `ssfi` flag has already been set by the outer assertion.
    if (!flag(this, 'lockSsfi')) {
      flag(this, 'ssfi', overwritingMethodWrapper);
    }

    // Setting the `lockSsfi` flag to `true` prevents the overwritten assertion
    // from changing the `ssfi` flag. By this point, the `ssfi` flag is already
    // set to the correct starting point for this assertion.
    var origLockSsfi = flag(this, 'lockSsfi');
    flag(this, 'lockSsfi', true);
    var result = method(_super).apply(this, arguments);
    flag(this, 'lockSsfi', origLockSsfi);

    if (result !== undefined) {
      return result;
    }

    var newAssertion = new chai.Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  };

  addLengthGuard(overwritingMethodWrapper, name, false);
  ctx[name] = proxify(overwritingMethodWrapper, name);
};

/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */







/*!
 * Module variables
 */

// Check whether `Object.setPrototypeOf` is supported
var canSetPrototype = typeof Object.setPrototypeOf === 'function';

// Without `Object.setPrototypeOf` support, this module will need to add properties to a function.
// However, some of functions' own props are not configurable and should be skipped.
var testFn = function() {};
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
  var propDesc = Object.getOwnPropertyDescriptor(testFn, name);

  // Note: PhantomJS 1.x includes `callee` as one of `testFn`'s own properties,
  // but then returns `undefined` as the property descriptor for `callee`. As a
  // workaround, we perform an otherwise unnecessary type-check for `propDesc`,
  // and then filter it out if it's not an object as it should be.
  if (typeof propDesc !== 'object')
    return true;

  return !propDesc.configurable;
});

// Cache `Function` properties
var call  = Function.prototype.call,
    apply = Function.prototype.apply;

/**
 * ### .addChainableMethod(ctx, name, method, chainingBehavior)
 *
 * Adds a method to an object, such that the method can also be chained.
 *
 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
 *
 * The result can then be used as both a method assertion, executing both `method` and
 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
 *
 *     expect(fooStr).to.be.foo('bar');
 *     expect(fooStr).to.be.foo.equal('foo');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for `name`, when called
 * @param {Function} chainingBehavior function to be called every time the property is accessed
 * @namespace Utils
 * @name addChainableMethod
 * @api public
 */

var addChainableMethod = function addChainableMethod(ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== 'function') {
    chainingBehavior = function () { };
  }

  var chainableBehavior = {
      method: method
    , chainingBehavior: chainingBehavior
  };

  // save the methods so we can overwrite them later, if we need to.
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;

  Object.defineProperty(ctx, name,
    { get: function chainableMethodGetter() {
        chainableBehavior.chainingBehavior.call(this);

        var chainableMethodWrapper = function () {
          // Setting the `ssfi` flag to `chainableMethodWrapper` causes this
          // function to be the starting point for removing implementation
          // frames from the stack trace of a failed assertion.
          //
          // However, we only want to use this function as the starting point if
          // the `lockSsfi` flag isn't set.
          //
          // If the `lockSsfi` flag is set, then this assertion is being
          // invoked from inside of another assertion. In this case, the `ssfi`
          // flag has already been set by the outer assertion.
          //
          // Note that overwriting a chainable method merely replaces the saved
          // methods in `ctx.__methods` instead of completely replacing the
          // overwritten assertion. Therefore, an overwriting assertion won't
          // set the `ssfi` or `lockSsfi` flags.
          if (!flag(this, 'lockSsfi')) {
            flag(this, 'ssfi', chainableMethodWrapper);
          }

          var result = chainableBehavior.method.apply(this, arguments);
          if (result !== undefined) {
            return result;
          }

          var newAssertion = new chai.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        };

        addLengthGuard(chainableMethodWrapper, name, true);

        // Use `Object.setPrototypeOf` if available
        if (canSetPrototype) {
          // Inherit all properties from the object by replacing the `Function` prototype
          var prototype = Object.create(this);
          // Restore the `call` and `apply` methods from `Function`
          prototype.call = call;
          prototype.apply = apply;
          Object.setPrototypeOf(chainableMethodWrapper, prototype);
        }
        // Otherwise, redefine all properties (slow!)
        else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function (asserterName) {
            if (excludeNames.indexOf(asserterName) !== -1) {
              return;
            }

            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
            Object.defineProperty(chainableMethodWrapper, asserterName, pd);
          });
        }

        transferFlags(this, chainableMethodWrapper);
        return proxify(chainableMethodWrapper);
      }
    , configurable: true
  });
};

/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */




/**
 * ### .overwriteChainableMethod(ctx, name, method, chainingBehavior)
 *
 * Overwrites an already existing chainable method
 * and provides access to the previous function or
 * property.  Must return functions to be used for
 * name.
 *
 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'lengthOf',
 *       function (_super) {
 *       }
 *     , function (_super) {
 *       }
 *     );
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.have.lengthOf(3);
 *     expect(myFoo).to.have.lengthOf.above(3);
 *
 * @param {Object} ctx object whose method / property is to be overwritten
 * @param {String} name of method / property to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @param {Function} chainingBehavior function that returns a function to be used for property
 * @namespace Utils
 * @name overwriteChainableMethod
 * @api public
 */

var overwriteChainableMethod = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
  var chainableBehavior = ctx.__methods[name];

  var _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
    var result = chainingBehavior(_chainingBehavior).call(this);
    if (result !== undefined) {
      return result;
    }

    var newAssertion = new chai.Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  };

  var _method = chainableBehavior.method;
  chainableBehavior.method = function overwritingChainableMethodWrapper() {
    var result = method(_method).apply(this, arguments);
    if (result !== undefined) {
      return result;
    }

    var newAssertion = new chai.Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  };
};

/*!
 * Chai - compareByInspect utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */



/**
 * ### .compareByInspect(mixed, mixed)
 *
 * To be used as a compareFunction with Array.prototype.sort. Compares elements
 * using inspect instead of default behavior of using toString so that Symbols
 * and objects with irregular/missing toString can still be sorted without a
 * TypeError.
 *
 * @param {Mixed} first element to compare
 * @param {Mixed} second element to compare
 * @returns {Number} -1 if 'a' should come before 'b'; otherwise 1
 * @name compareByInspect
 * @namespace Utils
 * @api public
 */

var compareByInspect = function compareByInspect(a, b) {
  return inspect_1(a) < inspect_1(b) ? -1 : 1;
};

/*!
 * Chai - getOwnEnumerablePropertySymbols utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getOwnEnumerablePropertySymbols(object)
 *
 * This allows the retrieval of directly-owned enumerable property symbols of an
 * object. This function is necessary because Object.getOwnPropertySymbols
 * returns both enumerable and non-enumerable property symbols.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getOwnEnumerablePropertySymbols
 * @api public
 */

var getOwnEnumerablePropertySymbols = function getOwnEnumerablePropertySymbols(obj) {
  if (typeof Object.getOwnPropertySymbols !== 'function') return [];

  return Object.getOwnPropertySymbols(obj).filter(function (sym) {
    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
  });
};

/*!
 * Chai - getOwnEnumerableProperties utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */



/**
 * ### .getOwnEnumerableProperties(object)
 *
 * This allows the retrieval of directly-owned enumerable property names and
 * symbols of an object. This function is necessary because Object.keys only
 * returns enumerable property names, not enumerable property symbols.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getOwnEnumerableProperties
 * @api public
 */

var getOwnEnumerableProperties = function getOwnEnumerableProperties(obj) {
  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
};

/* !
 * Chai - checkError utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .checkError
 *
 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
 *
 * @api public
 */

/**
 * ### .compatibleInstance(thrown, errorLike)
 *
 * Checks if two instances are compatible (strict equal).
 * Returns false if errorLike is not an instance of Error, because instances
 * can only be compatible if they're both error instances.
 *
 * @name compatibleInstance
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleInstance(thrown, errorLike) {
  return errorLike instanceof Error && thrown === errorLike;
}

/**
 * ### .compatibleConstructor(thrown, errorLike)
 *
 * Checks if two constructors are compatible.
 * This function can receive either an error constructor or
 * an error instance as the `errorLike` argument.
 * Constructors are compatible if they're the same or if one is
 * an instance of another.
 *
 * @name compatibleConstructor
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleConstructor(thrown, errorLike) {
  if (errorLike instanceof Error) {
    // If `errorLike` is an instance of any error we compare their constructors
    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
    return thrown.constructor === errorLike || thrown instanceof errorLike;
  }

  return false;
}

/**
 * ### .compatibleMessage(thrown, errMatcher)
 *
 * Checks if an error's message is compatible with a matcher (String or RegExp).
 * If the message contains the String or passes the RegExp test,
 * it is considered compatible.
 *
 * @name compatibleMessage
 * @param {Error} thrown error
 * @param {String|RegExp} errMatcher to look for into the message
 * @namespace Utils
 * @api public
 */

function compatibleMessage(thrown, errMatcher) {
  var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
  if (errMatcher instanceof RegExp) {
    return errMatcher.test(comparisonString);
  } else if (typeof errMatcher === 'string') {
    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
  }

  return false;
}

/**
 * ### .getFunctionName(constructorFn)
 *
 * Returns the name of a function.
 * This also includes a polyfill function if `constructorFn.name` is not defined.
 *
 * @name getFunctionName
 * @param {Function} constructorFn
 * @namespace Utils
 * @api private
 */

var functionNameMatch$1 = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
function getFunctionName(constructorFn) {
  var name = '';
  if (typeof constructorFn.name === 'undefined') {
    // Here we run a polyfill if constructorFn.name is not defined
    var match = String(constructorFn).match(functionNameMatch$1);
    if (match) {
      name = match[1];
    }
  } else {
    name = constructorFn.name;
  }

  return name;
}

/**
 * ### .getConstructorName(errorLike)
 *
 * Gets the constructor name for an Error instance or constructor itself.
 *
 * @name getConstructorName
 * @param {Error|ErrorConstructor} errorLike
 * @namespace Utils
 * @api public
 */

function getConstructorName(errorLike) {
  var constructorName = errorLike;
  if (errorLike instanceof Error) {
    constructorName = getFunctionName(errorLike.constructor);
  } else if (typeof errorLike === 'function') {
    // If `err` is not an instance of Error it is an error constructor itself or another function.
    // If we've got a common function we get its name, otherwise we may need to create a new instance
    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
    constructorName = getFunctionName(errorLike).trim() ||
        getFunctionName(new errorLike()); // eslint-disable-line new-cap
  }

  return constructorName;
}

/**
 * ### .getMessage(errorLike)
 *
 * Gets the error message from an error.
 * If `err` is a String itself, we return it.
 * If the error has no message, we return an empty string.
 *
 * @name getMessage
 * @param {Error|String} errorLike
 * @namespace Utils
 * @api public
 */

function getMessage$1(errorLike) {
  var msg = '';
  if (errorLike && errorLike.message) {
    msg = errorLike.message;
  } else if (typeof errorLike === 'string') {
    msg = errorLike;
  }

  return msg;
}

var checkError = {
  compatibleInstance: compatibleInstance,
  compatibleConstructor: compatibleConstructor,
  compatibleMessage: compatibleMessage,
  getMessage: getMessage$1,
  getConstructorName: getConstructorName,
};

/*!
 * Chai - isNaN utility
 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
 * MIT Licensed
 */

/**
 * ### .isNaN(value)
 *
 * Checks if the given value is NaN or not.
 *
 *     utils.isNaN(NaN); // true
 *
 * @param {Value} The value which has to be checked if it is NaN
 * @name isNaN
 * @api private
 */

function isNaN$1(value) {
  // Refer http://www.ecma-international.org/ecma-262/6.0/#sec-isnan-number
  // section's NOTE.
  return value !== value;
}

// If ECMAScript 6's Number.isNaN is present, prefer that.
var _isNaN = Number.isNaN || isNaN$1;

/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Dependencies that are used for multiple exports are required here only once
 */



/*!
 * test utility
 */

var test$1 = test;

/*!
 * type utility
 */

var type = typeDetect;

/*!
 * expectTypes utility
 */
var expectTypes$1 = expectTypes;

/*!
 * message utility
 */

var getMessage$2 = getMessage;

/*!
 * actual utility
 */

var getActual$1 = getActual;

/*!
 * Inspect util
 */

var inspect = inspect_1;

/*!
 * Object Display util
 */

var objDisplay$1 = objDisplay;

/*!
 * Flag utility
 */

var flag$1 = flag;

/*!
 * Flag transferring utility
 */

var transferFlags$1 = transferFlags;

/*!
 * Deep equal utility
 */

var eql = deepEql;

/*!
 * Deep path info
 */

var getPathInfo$1 = pathval.getPathInfo;

/*!
 * Check if a property exists
 */

var hasProperty$1 = pathval.hasProperty;

/*!
 * Function name
 */

var getName = getFuncName_1;

/*!
 * add Property
 */

var addProperty$1 = addProperty;

/*!
 * add Method
 */

var addMethod$1 = addMethod;

/*!
 * overwrite Property
 */

var overwriteProperty$1 = overwriteProperty;

/*!
 * overwrite Method
 */

var overwriteMethod$1 = overwriteMethod;

/*!
 * Add a chainable method
 */

var addChainableMethod$1 = addChainableMethod;

/*!
 * Overwrite chainable method
 */

var overwriteChainableMethod$1 = overwriteChainableMethod;

/*!
 * Compare by inspect method
 */

var compareByInspect$1 = compareByInspect;

/*!
 * Get own enumerable property symbols method
 */

var getOwnEnumerablePropertySymbols$1 = getOwnEnumerablePropertySymbols;

/*!
 * Get own enumerable properties method
 */

var getOwnEnumerableProperties$1 = getOwnEnumerableProperties;

/*!
 * Checks error against a given set of criteria
 */

var checkError$1 = checkError;

/*!
 * Proxify util
 */

var proxify$1 = proxify;

/*!
 * addLengthGuard util
 */

var addLengthGuard$1 = addLengthGuard;

/*!
 * isProxyEnabled helper
 */

var isProxyEnabled$1 = isProxyEnabled;

/*!
 * isNaN method
 */

var _isNaN$1 = _isNaN;

var utils = {
	test: test$1,
	type: type,
	expectTypes: expectTypes$1,
	getMessage: getMessage$2,
	getActual: getActual$1,
	inspect: inspect,
	objDisplay: objDisplay$1,
	flag: flag$1,
	transferFlags: transferFlags$1,
	eql: eql,
	getPathInfo: getPathInfo$1,
	hasProperty: hasProperty$1,
	getName: getName,
	addProperty: addProperty$1,
	addMethod: addMethod$1,
	overwriteProperty: overwriteProperty$1,
	overwriteMethod: overwriteMethod$1,
	addChainableMethod: addChainableMethod$1,
	overwriteChainableMethod: overwriteChainableMethod$1,
	compareByInspect: compareByInspect$1,
	getOwnEnumerablePropertySymbols: getOwnEnumerablePropertySymbols$1,
	getOwnEnumerableProperties: getOwnEnumerableProperties$1,
	checkError: checkError$1,
	proxify: proxify$1,
	addLengthGuard: addLengthGuard$1,
	isProxyEnabled: isProxyEnabled$1,
	isNaN: _isNaN$1
};

/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */



var assertion = function (_chai, util) {
  /*!
   * Module dependencies.
   */

  var AssertionError = _chai.AssertionError
    , flag = util.flag;

  /*!
   * Module export.
   */

  _chai.Assertion = Assertion;

  /*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * `Assertion` objects contain metadata in the form of flags. Three flags can
   * be assigned during instantiation by passing arguments to this constructor:
   *
   * - `object`: This flag contains the target of the assertion. For example, in
   *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
   *   contain `numKittens` so that the `equal` assertion can reference it when
   *   needed.
   *
   * - `message`: This flag contains an optional custom error message to be
   *   prepended to the error message that's generated by the assertion when it
   *   fails.
   *
   * - `ssfi`: This flag stands for "start stack function indicator". It
   *   contains a function reference that serves as the starting point for
   *   removing frames from the stack trace of the error that's created by the
   *   assertion when it fails. The goal is to provide a cleaner stack trace to
   *   end users by removing Chai's internal functions. Note that it only works
   *   in environments that support `Error.captureStackTrace`, and only when
   *   `Chai.config.includeStack` hasn't been set to `false`.
   *
   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
   *   should retain its current value, even as assertions are chained off of
   *   this object. This is usually set to `true` when creating a new assertion
   *   from within another assertion. It's also temporarily set to `true` before
   *   an overwritten assertion gets called by the overwriting assertion.
   *
   * @param {Mixed} obj target of the assertion
   * @param {String} msg (optional) custom error message
   * @param {Function} ssfi (optional) starting point for removing stack frames
   * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
   * @api private
   */

  function Assertion (obj, msg, ssfi, lockSsfi) {
    flag(this, 'ssfi', ssfi || Assertion);
    flag(this, 'lockSsfi', lockSsfi);
    flag(this, 'object', obj);
    flag(this, 'message', msg);

    return util.proxify(this);
  }

  Object.defineProperty(Assertion, 'includeStack', {
    get: function() {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      return config.includeStack;
    },
    set: function(value) {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      config.includeStack = value;
    }
  });

  Object.defineProperty(Assertion, 'showDiff', {
    get: function() {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      return config.showDiff;
    },
    set: function(value) {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      config.showDiff = value;
    }
  });

  Assertion.addProperty = function (name, fn) {
    util.addProperty(this.prototype, name, fn);
  };

  Assertion.addMethod = function (name, fn) {
    util.addMethod(this.prototype, name, fn);
  };

  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  Assertion.overwriteProperty = function (name, fn) {
    util.overwriteProperty(this.prototype, name, fn);
  };

  Assertion.overwriteMethod = function (name, fn) {
    util.overwriteMethod(this.prototype, name, fn);
  };

  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  /**
   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {Philosophical} expression to be tested
   * @param {String|Function} message or function that returns message to display if expression fails
   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
   * @param {Mixed} expected value (remember to check for negation)
   * @param {Mixed} actual (optional) will default to `this.obj`
   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
   * @api private
   */

  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
    var ok = util.test(this, arguments);
    if (false !== showDiff) showDiff = true;
    if (undefined === expected && undefined === _actual) showDiff = false;
    if (true !== config.showDiff) showDiff = false;

    if (!ok) {
      msg = util.getMessage(this, arguments);
      var actual = util.getActual(this, arguments);
      throw new AssertionError(msg, {
          actual: actual
        , expected: expected
        , showDiff: showDiff
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));
    }
  };

  /*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   */

  Object.defineProperty(Assertion.prototype, '_obj',
    { get: function () {
        return flag(this, 'object');
      }
    , set: function (val) {
        flag(this, 'object', val);
      }
  });
};

/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var assertions = function (chai, _) {
  var Assertion = chai.Assertion
    , AssertionError = chai.AssertionError
    , flag = _.flag;

  /**
   * ### Language Chains
   *
   * The following are provided as chainable getters to improve the readability
   * of your assertions.
   *
   * **Chains**
   *
   * - to
   * - be
   * - been
   * - is
   * - that
   * - which
   * - and
   * - has
   * - have
   * - with
   * - at
   * - of
   * - same
   * - but
   * - does
   * - still
   *
   * @name language chains
   * @namespace BDD
   * @api public
   */

  [ 'to', 'be', 'been', 'is'
  , 'and', 'has', 'have', 'with'
  , 'that', 'which', 'at', 'of'
  , 'same', 'but', 'does', 'still' ].forEach(function (chain) {
    Assertion.addProperty(chain);
  });

  /**
   * ### .not
   *
   * Negates all assertions that follow in the chain.
   *
   *     expect(function () {}).to.not.throw();
   *     expect({a: 1}).to.not.have.property('b');
   *     expect([1, 2]).to.be.an('array').that.does.not.include(3);
   *
   * Just because you can negate any assertion with `.not` doesn't mean you
   * should. With great power comes great responsibility. It's often best to
   * assert that the one expected output was produced, rather than asserting
   * that one of countless unexpected outputs wasn't produced. See individual
   * assertions for specific guidance.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(2).to.not.equal(1); // Not recommended
   *
   * @name not
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('not', function () {
    flag(this, 'negate', true);
  });

  /**
   * ### .deep
   *
   * Causes all `.equal`, `.include`, `.members`, `.keys`, and `.property`
   * assertions that follow in the chain to use deep equality instead of strict
   * (`===`) equality. See the `deep-eql` project page for info on the deep
   * equality algorithm: https://github.com/chaijs/deep-eql.
   *
   *     // Target object deeply (but not strictly) equals `{a: 1}`
   *     expect({a: 1}).to.deep.equal({a: 1});
   *     expect({a: 1}).to.not.equal({a: 1});
   *
   *     // Target array deeply (but not strictly) includes `{a: 1}`
   *     expect([{a: 1}]).to.deep.include({a: 1});
   *     expect([{a: 1}]).to.not.include({a: 1});
   *
   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
   *
   *     // Target array deeply (but not strictly) has member `{a: 1}`
   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
   *
   *     // Target set deeply (but not strictly) has key `{a: 1}`
   *     expect(new Set([{a: 1}])).to.have.deep.keys([{a: 1}]);
   *     expect(new Set([{a: 1}])).to.not.have.keys([{a: 1}]);
   *
   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
   *
   * @name deep
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('deep', function () {
    flag(this, 'deep', true);
  });

  /**
   * ### .nested
   *
   * Enables dot- and bracket-notation in all `.property` and `.include`
   * assertions that follow in the chain.
   *
   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
   *
   * If `.` or `[]` are part of an actual property name, they can be escaped by
   * adding two backslashes before them.
   *
   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
   *     expect({'.a': {'[b]': 'x'}}).to.nested.include({'\\.a.\\[b\\]': 'x'});
   *
   * `.nested` cannot be combined with `.own`.
   *
   * @name nested
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('nested', function () {
    flag(this, 'nested', true);
  });

  /**
   * ### .own
   *
   * Causes all `.property` and `.include` assertions that follow in the chain
   * to ignore inherited properties.
   *
   *     Object.prototype.b = 2;
   *
   *     expect({a: 1}).to.have.own.property('a');
   *     expect({a: 1}).to.have.property('b');
   *     expect({a: 1}).to.not.have.own.property('b');
   *
   *     expect({a: 1}).to.own.include({a: 1});
   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
   *
   * `.own` cannot be combined with `.nested`.
   *
   * @name own
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('own', function () {
    flag(this, 'own', true);
  });

  /**
   * ### .ordered
   *
   * Causes all `.members` assertions that follow in the chain to require that
   * members be in the same order.
   *
   *     expect([1, 2]).to.have.ordered.members([1, 2])
   *       .but.not.have.ordered.members([2, 1]);
   *
   * When `.include` and `.ordered` are combined, the ordering begins at the
   * start of both arrays.
   *
   *     expect([1, 2, 3]).to.include.ordered.members([1, 2])
   *       .but.not.include.ordered.members([2, 3]);
   *
   * @name ordered
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('ordered', function () {
    flag(this, 'ordered', true);
  });

  /**
   * ### .any
   *
   * Causes all `.keys` assertions that follow in the chain to only require that
   * the target have at least one of the given keys. This is the opposite of
   * `.all`, which requires that the target have all of the given keys.
   *
   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
   *
   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
   *
   * @name any
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('any', function () {
    flag(this, 'any', true);
    flag(this, 'all', false);
  });

  /**
   * ### .all
   *
   * Causes all `.keys` assertions that follow in the chain to require that the
   * target have all of the given keys. This is the opposite of `.any`, which
   * only requires that the target have at least one of the given keys.
   *
   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
   *
   * Note that `.all` is used by default when neither `.all` nor `.any` are
   * added earlier in the chain. However, it's often best to add `.all` anyway
   * because it improves readability.
   *
   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
   *
   * @name all
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('all', function () {
    flag(this, 'all', true);
    flag(this, 'any', false);
  });

  /**
   * ### .a(type[, msg])
   *
   * Asserts that the target's type is equal to the given string `type`. Types
   * are case insensitive. See the `type-detect` project page for info on the
   * type detection algorithm: https://github.com/chaijs/type-detect.
   *
   *     expect('foo').to.be.a('string');
   *     expect({a: 1}).to.be.an('object');
   *     expect(null).to.be.a('null');
   *     expect(undefined).to.be.an('undefined');
   *     expect(new Error).to.be.an('error');
   *     expect(Promise.resolve()).to.be.a('promise');
   *     expect(new Float32Array).to.be.a('float32array');
   *     expect(Symbol()).to.be.a('symbol');
   *
   * `.a` supports objects that have a custom type set via `Symbol.toStringTag`.
   *
   *     var myObj = {
   *       [Symbol.toStringTag]: 'myCustomType'
   *     };
   *
   *     expect(myObj).to.be.a('myCustomType').but.not.an('object');
   *
   * It's often best to use `.a` to check a target's type before making more
   * assertions on the same target. That way, you avoid unexpected behavior from
   * any assertion that does different things based on the target's type.
   *
   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
   *     expect([]).to.be.an('array').that.is.empty;
   *
   * Add `.not` earlier in the chain to negate `.a`. However, it's often best to
   * assert that the target is the expected type, rather than asserting that it
   * isn't one of many unexpected types.
   *
   *     expect('foo').to.be.a('string'); // Recommended
   *     expect('foo').to.not.be.an('array'); // Not recommended
   *
   * `.a` accepts an optional `msg` argument which is a custom error message to
   * show when the assertion fails. The message can also be given as the second
   * argument to `expect`.
   *
   *     expect(1).to.be.a('string', 'nooo why fail??');
   *     expect(1, 'nooo why fail??').to.be.a('string');
   *
   * `.a` can also be used as a language chain to improve the readability of
   * your assertions.
   *
   *     expect({b: 2}).to.have.a.property('b');
   *
   * The alias `.an` can be used interchangeably with `.a`.
   *
   * @name a
   * @alias an
   * @param {String} type
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function an (type, msg) {
    if (msg) flag(this, 'message', msg);
    type = type.toLowerCase();
    var obj = flag(this, 'object')
      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

    this.assert(
        type === _.type(obj).toLowerCase()
      , 'expected #{this} to be ' + article + type
      , 'expected #{this} not to be ' + article + type
    );
  }

  Assertion.addChainableMethod('an', an);
  Assertion.addChainableMethod('a', an);

  /**
   * ### .include(val[, msg])
   *
   * When the target is a string, `.include` asserts that the given string `val`
   * is a substring of the target.
   *
   *     expect('foobar').to.include('foo');
   *
   * When the target is an array, `.include` asserts that the given `val` is a
   * member of the target.
   *
   *     expect([1, 2, 3]).to.include(2);
   *
   * When the target is an object, `.include` asserts that the given object
   * `val`'s properties are a subset of the target's properties.
   *
   *     expect({a: 1, b: 2, c: 3}).to.include({a: 1, b: 2});
   *
   * When the target is a Set or WeakSet, `.include` asserts that the given `val` is a
   * member of the target. SameValueZero equality algorithm is used.
   *
   *     expect(new Set([1, 2])).to.include(2);
   *
   * When the target is a Map, `.include` asserts that the given `val` is one of
   * the values of the target. SameValueZero equality algorithm is used.
   *
   *     expect(new Map([['a', 1], ['b', 2]])).to.include(2);
   *
   * Because `.include` does different things based on the target's type, it's
   * important to check the target's type before using `.include`. See the `.a`
   * doc for info on testing a target's type.
   *
   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
   *
   * By default, strict (`===`) equality is used to compare array members and
   * object properties. Add `.deep` earlier in the chain to use deep equality
   * instead (WeakSet targets are not supported). See the `deep-eql` project
   * page for info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
   *
   *     // Target array deeply (but not strictly) includes `{a: 1}`
   *     expect([{a: 1}]).to.deep.include({a: 1});
   *     expect([{a: 1}]).to.not.include({a: 1});
   *
   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
   *
   * By default, all of the target's properties are searched when working with
   * objects. This includes properties that are inherited and/or non-enumerable.
   * Add `.own` earlier in the chain to exclude the target's inherited
   * properties from the search.
   *
   *     Object.prototype.b = 2;
   *
   *     expect({a: 1}).to.own.include({a: 1});
   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
   *
   * Note that a target object is always only searched for `val`'s own
   * enumerable properties.
   *
   * `.deep` and `.own` can be combined.
   *
   *     expect({a: {b: 2}}).to.deep.own.include({a: {b: 2}});
   *
   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
   * referencing nested properties.
   *
   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
   *
   * If `.` or `[]` are part of an actual property name, they can be escaped by
   * adding two backslashes before them.
   *
   *     expect({'.a': {'[b]': 2}}).to.nested.include({'\\.a.\\[b\\]': 2});
   *
   * `.deep` and `.nested` can be combined.
   *
   *     expect({a: {b: [{c: 3}]}}).to.deep.nested.include({'a.b[0]': {c: 3}});
   *
   * `.own` and `.nested` cannot be combined.
   *
   * Add `.not` earlier in the chain to negate `.include`.
   *
   *     expect('foobar').to.not.include('taco');
   *     expect([1, 2, 3]).to.not.include(4);
   *
   * However, it's dangerous to negate `.include` when the target is an object.
   * The problem is that it creates uncertain expectations by asserting that the
   * target object doesn't have all of `val`'s key/value pairs but may or may
   * not have some of them. It's often best to identify the exact output that's
   * expected, and then write an assertion that only accepts that exact output.
   *
   * When the target object isn't even expected to have `val`'s keys, it's
   * often best to assert exactly that.
   *
   *     expect({c: 3}).to.not.have.any.keys('a', 'b'); // Recommended
   *     expect({c: 3}).to.not.include({a: 1, b: 2}); // Not recommended
   *
   * When the target object is expected to have `val`'s keys, it's often best to
   * assert that each of the properties has its expected value, rather than
   * asserting that each property doesn't have one of many unexpected values.
   *
   *     expect({a: 3, b: 4}).to.include({a: 3, b: 4}); // Recommended
   *     expect({a: 3, b: 4}).to.not.include({a: 1, b: 2}); // Not recommended
   *
   * `.include` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect([1, 2, 3]).to.include(4, 'nooo why fail??');
   *     expect([1, 2, 3], 'nooo why fail??').to.include(4);
   *
   * `.include` can also be used as a language chain, causing all `.members` and
   * `.keys` assertions that follow in the chain to require the target to be a
   * superset of the expected set, rather than an identical set. Note that
   * `.members` ignores duplicates in the subset when `.include` is added.
   *
   *     // Target object's keys are a superset of ['a', 'b'] but not identical
   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
   *
   *     // Target array is a superset of [1, 2] but not identical
   *     expect([1, 2, 3]).to.include.members([1, 2]);
   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
   *
   *     // Duplicates in the subset are ignored
   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
   *
   * Note that adding `.any` earlier in the chain causes the `.keys` assertion
   * to ignore `.include`.
   *
   *     // Both assertions are identical
   *     expect({a: 1}).to.include.any.keys('a', 'b');
   *     expect({a: 1}).to.have.any.keys('a', 'b');
   *
   * The aliases `.includes`, `.contain`, and `.contains` can be used
   * interchangeably with `.include`.
   *
   * @name include
   * @alias contain
   * @alias includes
   * @alias contains
   * @param {Mixed} val
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function SameValueZero(a, b) {
    return (_.isNaN(a) && _.isNaN(b)) || a === b;
  }

  function includeChainingBehavior () {
    flag(this, 'contains', true);
  }

  function include (val, msg) {
    if (msg) flag(this, 'message', msg);

    var obj = flag(this, 'object')
      , objType = _.type(obj).toLowerCase()
      , flagMsg = flag(this, 'message')
      , negate = flag(this, 'negate')
      , ssfi = flag(this, 'ssfi')
      , isDeep = flag(this, 'deep')
      , descriptor = isDeep ? 'deep ' : '';

    flagMsg = flagMsg ? flagMsg + ': ' : '';

    var included = false;

    switch (objType) {
      case 'string':
        included = obj.indexOf(val) !== -1;
        break;

      case 'weakset':
        if (isDeep) {
          throw new AssertionError(
            flagMsg + 'unable to use .deep.include with WeakSet',
            undefined,
            ssfi
          );
        }

        included = obj.has(val);
        break;

      case 'map':
        var isEql = isDeep ? _.eql : SameValueZero;
        obj.forEach(function (item) {
          included = included || isEql(item, val);
        });
        break;

      case 'set':
        if (isDeep) {
          obj.forEach(function (item) {
            included = included || _.eql(item, val);
          });
        } else {
          included = obj.has(val);
        }
        break;

      case 'array':
        if (isDeep) {
          included = obj.some(function (item) {
            return _.eql(item, val);
          });
        } else {
          included = obj.indexOf(val) !== -1;
        }
        break;

      default:
        // This block is for asserting a subset of properties in an object.
        // `_.expectTypes` isn't used here because `.include` should work with
        // objects with a custom `@@toStringTag`.
        if (val !== Object(val)) {
          throw new AssertionError(
            flagMsg + 'object tested must be an array, a map, an object,'
              + ' a set, a string, or a weakset, but ' + objType + ' given',
            undefined,
            ssfi
          );
        }

        var props = Object.keys(val)
          , firstErr = null
          , numErrs = 0;

        props.forEach(function (prop) {
          var propAssertion = new Assertion(obj);
          _.transferFlags(this, propAssertion, true);
          flag(propAssertion, 'lockSsfi', true);

          if (!negate || props.length === 1) {
            propAssertion.property(prop, val[prop]);
            return;
          }

          try {
            propAssertion.property(prop, val[prop]);
          } catch (err) {
            if (!_.checkError.compatibleConstructor(err, AssertionError)) {
              throw err;
            }
            if (firstErr === null) firstErr = err;
            numErrs++;
          }
        }, this);

        // When validating .not.include with multiple properties, we only want
        // to throw an assertion error if all of the properties are included,
        // in which case we throw the first property assertion error that we
        // encountered.
        if (negate && props.length > 1 && numErrs === props.length) {
          throw firstErr;
        }
        return;
    }

    // Assert inclusion in collection or substring in a string.
    this.assert(
      included
      , 'expected #{this} to ' + descriptor + 'include ' + _.inspect(val)
      , 'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val));
  }

  Assertion.addChainableMethod('include', include, includeChainingBehavior);
  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

  /**
   * ### .ok
   *
   * Asserts that the target is a truthy value (considered `true` in boolean context).
   * However, it's often best to assert that the target is strictly (`===`) or
   * deeply equal to its expected value.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.be.ok; // Not recommended
   *
   *     expect(true).to.be.true; // Recommended
   *     expect(true).to.be.ok; // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.ok`.
   *
   *     expect(0).to.equal(0); // Recommended
   *     expect(0).to.not.be.ok; // Not recommended
   *
   *     expect(false).to.be.false; // Recommended
   *     expect(false).to.not.be.ok; // Not recommended
   *
   *     expect(null).to.be.null; // Recommended
   *     expect(null).to.not.be.ok; // Not recommended
   *
   *     expect(undefined).to.be.undefined; // Recommended
   *     expect(undefined).to.not.be.ok; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(false, 'nooo why fail??').to.be.ok;
   *
   * @name ok
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('ok', function () {
    this.assert(
        flag(this, 'object')
      , 'expected #{this} to be truthy'
      , 'expected #{this} to be falsy');
  });

  /**
   * ### .true
   *
   * Asserts that the target is strictly (`===`) equal to `true`.
   *
   *     expect(true).to.be.true;
   *
   * Add `.not` earlier in the chain to negate `.true`. However, it's often best
   * to assert that the target is equal to its expected value, rather than not
   * equal to `true`.
   *
   *     expect(false).to.be.false; // Recommended
   *     expect(false).to.not.be.true; // Not recommended
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.true; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(false, 'nooo why fail??').to.be.true;
   *
   * @name true
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('true', function () {
    this.assert(
        true === flag(this, 'object')
      , 'expected #{this} to be true'
      , 'expected #{this} to be false'
      , flag(this, 'negate') ? false : true
    );
  });

  /**
   * ### .false
   *
   * Asserts that the target is strictly (`===`) equal to `false`.
   *
   *     expect(false).to.be.false;
   *
   * Add `.not` earlier in the chain to negate `.false`. However, it's often
   * best to assert that the target is equal to its expected value, rather than
   * not equal to `false`.
   *
   *     expect(true).to.be.true; // Recommended
   *     expect(true).to.not.be.false; // Not recommended
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.false; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(true, 'nooo why fail??').to.be.false;
   *
   * @name false
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('false', function () {
    this.assert(
        false === flag(this, 'object')
      , 'expected #{this} to be false'
      , 'expected #{this} to be true'
      , flag(this, 'negate') ? true : false
    );
  });

  /**
   * ### .null
   *
   * Asserts that the target is strictly (`===`) equal to `null`.
   *
   *     expect(null).to.be.null;
   *
   * Add `.not` earlier in the chain to negate `.null`. However, it's often best
   * to assert that the target is equal to its expected value, rather than not
   * equal to `null`.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.null; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(42, 'nooo why fail??').to.be.null;
   *
   * @name null
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('null', function () {
    this.assert(
        null === flag(this, 'object')
      , 'expected #{this} to be null'
      , 'expected #{this} not to be null'
    );
  });

  /**
   * ### .undefined
   *
   * Asserts that the target is strictly (`===`) equal to `undefined`.
   *
   *     expect(undefined).to.be.undefined;
   *
   * Add `.not` earlier in the chain to negate `.undefined`. However, it's often
   * best to assert that the target is equal to its expected value, rather than
   * not equal to `undefined`.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.undefined; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(42, 'nooo why fail??').to.be.undefined;
   *
   * @name undefined
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('undefined', function () {
    this.assert(
        undefined === flag(this, 'object')
      , 'expected #{this} to be undefined'
      , 'expected #{this} not to be undefined'
    );
  });

  /**
   * ### .NaN
   *
   * Asserts that the target is exactly `NaN`.
   *
   *     expect(NaN).to.be.NaN;
   *
   * Add `.not` earlier in the chain to negate `.NaN`. However, it's often best
   * to assert that the target is equal to its expected value, rather than not
   * equal to `NaN`.
   *
   *     expect('foo').to.equal('foo'); // Recommended
   *     expect('foo').to.not.be.NaN; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(42, 'nooo why fail??').to.be.NaN;
   *
   * @name NaN
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('NaN', function () {
    this.assert(
        _.isNaN(flag(this, 'object'))
        , 'expected #{this} to be NaN'
        , 'expected #{this} not to be NaN'
    );
  });

  /**
   * ### .exist
   *
   * Asserts that the target is not strictly (`===`) equal to either `null` or
   * `undefined`. However, it's often best to assert that the target is equal to
   * its expected value.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.exist; // Not recommended
   *
   *     expect(0).to.equal(0); // Recommended
   *     expect(0).to.exist; // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.exist`.
   *
   *     expect(null).to.be.null; // Recommended
   *     expect(null).to.not.exist; // Not recommended
   *
   *     expect(undefined).to.be.undefined; // Recommended
   *     expect(undefined).to.not.exist; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(null, 'nooo why fail??').to.exist;
   *
   * @name exist
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('exist', function () {
    var val = flag(this, 'object');
    this.assert(
        val !== null && val !== undefined
      , 'expected #{this} to exist'
      , 'expected #{this} to not exist'
    );
  });

  /**
   * ### .empty
   *
   * When the target is a string or array, `.empty` asserts that the target's
   * `length` property is strictly (`===`) equal to `0`.
   *
   *     expect([]).to.be.empty;
   *     expect('').to.be.empty;
   *
   * When the target is a map or set, `.empty` asserts that the target's `size`
   * property is strictly equal to `0`.
   *
   *     expect(new Set()).to.be.empty;
   *     expect(new Map()).to.be.empty;
   *
   * When the target is a non-function object, `.empty` asserts that the target
   * doesn't have any own enumerable properties. Properties with Symbol-based
   * keys are excluded from the count.
   *
   *     expect({}).to.be.empty;
   *
   * Because `.empty` does different things based on the target's type, it's
   * important to check the target's type before using `.empty`. See the `.a`
   * doc for info on testing a target's type.
   *
   *     expect([]).to.be.an('array').that.is.empty;
   *
   * Add `.not` earlier in the chain to negate `.empty`. However, it's often
   * best to assert that the target contains its expected number of values,
   * rather than asserting that it's not empty.
   *
   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
   *     expect([1, 2, 3]).to.not.be.empty; // Not recommended
   *
   *     expect(new Set([1, 2, 3])).to.have.property('size', 3); // Recommended
   *     expect(new Set([1, 2, 3])).to.not.be.empty; // Not recommended
   *
   *     expect(Object.keys({a: 1})).to.have.lengthOf(1); // Recommended
   *     expect({a: 1}).to.not.be.empty; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect([1, 2, 3], 'nooo why fail??').to.be.empty;
   *
   * @name empty
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('empty', function () {
    var val = flag(this, 'object')
      , ssfi = flag(this, 'ssfi')
      , flagMsg = flag(this, 'message')
      , itemsCount;

    flagMsg = flagMsg ? flagMsg + ': ' : '';

    switch (_.type(val).toLowerCase()) {
      case 'array':
      case 'string':
        itemsCount = val.length;
        break;
      case 'map':
      case 'set':
        itemsCount = val.size;
        break;
      case 'weakmap':
      case 'weakset':
        throw new AssertionError(
          flagMsg + '.empty was passed a weak collection',
          undefined,
          ssfi
        );
      case 'function':
        var msg = flagMsg + '.empty was passed a function ' + _.getName(val);
        throw new AssertionError(msg.trim(), undefined, ssfi);
      default:
        if (val !== Object(val)) {
          throw new AssertionError(
            flagMsg + '.empty was passed non-string primitive ' + _.inspect(val),
            undefined,
            ssfi
          );
        }
        itemsCount = Object.keys(val).length;
    }

    this.assert(
        0 === itemsCount
      , 'expected #{this} to be empty'
      , 'expected #{this} not to be empty'
    );
  });

  /**
   * ### .arguments
   *
   * Asserts that the target is an `arguments` object.
   *
   *     function test () {
   *       expect(arguments).to.be.arguments;
   *     }
   *
   *     test();
   *
   * Add `.not` earlier in the chain to negate `.arguments`. However, it's often
   * best to assert which type the target is expected to be, rather than
   * asserting that its not an `arguments` object.
   *
   *     expect('foo').to.be.a('string'); // Recommended
   *     expect('foo').to.not.be.arguments; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect({}, 'nooo why fail??').to.be.arguments;
   *
   * The alias `.Arguments` can be used interchangeably with `.arguments`.
   *
   * @name arguments
   * @alias Arguments
   * @namespace BDD
   * @api public
   */

  function checkArguments () {
    var obj = flag(this, 'object')
      , type = _.type(obj);
    this.assert(
        'Arguments' === type
      , 'expected #{this} to be arguments but got ' + type
      , 'expected #{this} to not be arguments'
    );
  }

  Assertion.addProperty('arguments', checkArguments);
  Assertion.addProperty('Arguments', checkArguments);

  /**
   * ### .equal(val[, msg])
   *
   * Asserts that the target is strictly (`===`) equal to the given `val`.
   *
   *     expect(1).to.equal(1);
   *     expect('foo').to.equal('foo');
   *
   * Add `.deep` earlier in the chain to use deep equality instead. See the
   * `deep-eql` project page for info on the deep equality algorithm:
   * https://github.com/chaijs/deep-eql.
   *
   *     // Target object deeply (but not strictly) equals `{a: 1}`
   *     expect({a: 1}).to.deep.equal({a: 1});
   *     expect({a: 1}).to.not.equal({a: 1});
   *
   *     // Target array deeply (but not strictly) equals `[1, 2]`
   *     expect([1, 2]).to.deep.equal([1, 2]);
   *     expect([1, 2]).to.not.equal([1, 2]);
   *
   * Add `.not` earlier in the chain to negate `.equal`. However, it's often
   * best to assert that the target is equal to its expected value, rather than
   * not equal to one of countless unexpected values.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.equal(2); // Not recommended
   *
   * `.equal` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect(1).to.equal(2, 'nooo why fail??');
   *     expect(1, 'nooo why fail??').to.equal(2);
   *
   * The aliases `.equals` and `eq` can be used interchangeably with `.equal`.
   *
   * @name equal
   * @alias equals
   * @alias eq
   * @param {Mixed} val
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertEqual (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'deep')) {
      var prevLockSsfi = flag(this, 'lockSsfi');
      flag(this, 'lockSsfi', true);
      this.eql(val);
      flag(this, 'lockSsfi', prevLockSsfi);
    } else {
      this.assert(
          val === obj
        , 'expected #{this} to equal #{exp}'
        , 'expected #{this} to not equal #{exp}'
        , val
        , this._obj
        , true
      );
    }
  }

  Assertion.addMethod('equal', assertEqual);
  Assertion.addMethod('equals', assertEqual);
  Assertion.addMethod('eq', assertEqual);

  /**
   * ### .eql(obj[, msg])
   *
   * Asserts that the target is deeply equal to the given `obj`. See the
   * `deep-eql` project page for info on the deep equality algorithm:
   * https://github.com/chaijs/deep-eql.
   *
   *     // Target object is deeply (but not strictly) equal to {a: 1}
   *     expect({a: 1}).to.eql({a: 1}).but.not.equal({a: 1});
   *
   *     // Target array is deeply (but not strictly) equal to [1, 2]
   *     expect([1, 2]).to.eql([1, 2]).but.not.equal([1, 2]);
   *
   * Add `.not` earlier in the chain to negate `.eql`. However, it's often best
   * to assert that the target is deeply equal to its expected value, rather
   * than not deeply equal to one of countless unexpected values.
   *
   *     expect({a: 1}).to.eql({a: 1}); // Recommended
   *     expect({a: 1}).to.not.eql({b: 2}); // Not recommended
   *
   * `.eql` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect({a: 1}).to.eql({b: 2}, 'nooo why fail??');
   *     expect({a: 1}, 'nooo why fail??').to.eql({b: 2});
   *
   * The alias `.eqls` can be used interchangeably with `.eql`.
   *
   * The `.deep.equal` assertion is almost identical to `.eql` but with one
   * difference: `.deep.equal` causes deep equality comparisons to also be used
   * for any other assertions that follow in the chain.
   *
   * @name eql
   * @alias eqls
   * @param {Mixed} obj
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertEql(obj, msg) {
    if (msg) flag(this, 'message', msg);
    this.assert(
        _.eql(obj, flag(this, 'object'))
      , 'expected #{this} to deeply equal #{exp}'
      , 'expected #{this} to not deeply equal #{exp}'
      , obj
      , this._obj
      , true
    );
  }

  Assertion.addMethod('eql', assertEql);
  Assertion.addMethod('eqls', assertEql);

  /**
   * ### .above(n[, msg])
   *
   * Asserts that the target is a number or a date greater than the given number or date `n` respectively.
   * However, it's often best to assert that the target is equal to its expected
   * value.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(2).to.be.above(1); // Not recommended
   *
   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
   * or `size` is greater than the given number `n`.
   *
   *     expect('foo').to.have.lengthOf(3); // Recommended
   *     expect('foo').to.have.lengthOf.above(2); // Not recommended
   *
   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
   *     expect([1, 2, 3]).to.have.lengthOf.above(2); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.above`.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(1).to.not.be.above(2); // Not recommended
   *
   * `.above` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect(1).to.be.above(2, 'nooo why fail??');
   *     expect(1, 'nooo why fail??').to.be.above(2);
   *
   * The aliases `.gt` and `.greaterThan` can be used interchangeably with
   * `.above`.
   *
   * @name above
   * @alias gt
   * @alias greaterThan
   * @param {Number} n
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertAbove (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , doLength = flag(this, 'doLength')
      , flagMsg = flag(this, 'message')
      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
      , ssfi = flag(this, 'ssfi')
      , objType = _.type(obj).toLowerCase()
      , nType = _.type(n).toLowerCase()
      , errorMessage
      , shouldThrow = true;

    if (doLength && objType !== 'map' && objType !== 'set') {
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }

    if (!doLength && (objType === 'date' && nType !== 'date')) {
      errorMessage = msgPrefix + 'the argument to above must be a date';
    } else if (nType !== 'number' && (doLength || objType === 'number')) {
      errorMessage = msgPrefix + 'the argument to above must be a number';
    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
      shouldThrow = false;
    }

    if (shouldThrow) {
      throw new AssertionError(errorMessage, undefined, ssfi);
    }

    if (doLength) {
      var descriptor = 'length'
        , itemsCount;
      if (objType === 'map' || objType === 'set') {
        descriptor = 'size';
        itemsCount = obj.size;
      } else {
        itemsCount = obj.length;
      }
      this.assert(
          itemsCount > n
        , 'expected #{this} to have a ' + descriptor + ' above #{exp} but got #{act}'
        , 'expected #{this} to not have a ' + descriptor + ' above #{exp}'
        , n
        , itemsCount
      );
    } else {
      this.assert(
          obj > n
        , 'expected #{this} to be above #{exp}'
        , 'expected #{this} to be at most #{exp}'
        , n
      );
    }
  }

  Assertion.addMethod('above', assertAbove);
  Assertion.addMethod('gt', assertAbove);
  Assertion.addMethod('greaterThan', assertAbove);

  /**
   * ### .least(n[, msg])
   *
   * Asserts that the target is a number or a date greater than or equal to the given
   * number or date `n` respectively. However, it's often best to assert that the target is equal to
   * its expected value.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(2).to.be.at.least(1); // Not recommended
   *     expect(2).to.be.at.least(2); // Not recommended
   *
   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
   * or `size` is greater than or equal to the given number `n`.
   *
   *     expect('foo').to.have.lengthOf(3); // Recommended
   *     expect('foo').to.have.lengthOf.at.least(2); // Not recommended
   *
   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
   *     expect([1, 2, 3]).to.have.lengthOf.at.least(2); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.least`.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.at.least(2); // Not recommended
   *
   * `.least` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect(1).to.be.at.least(2, 'nooo why fail??');
   *     expect(1, 'nooo why fail??').to.be.at.least(2);
   *
   * The alias `.gte` can be used interchangeably with `.least`.
   *
   * @name least
   * @alias gte
   * @param {Number} n
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertLeast (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , doLength = flag(this, 'doLength')
      , flagMsg = flag(this, 'message')
      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
      , ssfi = flag(this, 'ssfi')
      , objType = _.type(obj).toLowerCase()
      , nType = _.type(n).toLowerCase()
      , errorMessage
      , shouldThrow = true;

    if (doLength && objType !== 'map' && objType !== 'set') {
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }

    if (!doLength && (objType === 'date' && nType !== 'date')) {
      errorMessage = msgPrefix + 'the argument to least must be a date';
    } else if (nType !== 'number' && (doLength || objType === 'number')) {
      errorMessage = msgPrefix + 'the argument to least must be a number';
    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
      shouldThrow = false;
    }

    if (shouldThrow) {
      throw new AssertionError(errorMessage, undefined, ssfi);
    }

    if (doLength) {
      var descriptor = 'length'
        , itemsCount;
      if (objType === 'map' || objType === 'set') {
        descriptor = 'size';
        itemsCount = obj.size;
      } else {
        itemsCount = obj.length;
      }
      this.assert(
          itemsCount >= n
        , 'expected #{this} to have a ' + descriptor + ' at least #{exp} but got #{act}'
        , 'expected #{this} to have a ' + descriptor + ' below #{exp}'
        , n
        , itemsCount
      );
    } else {
      this.assert(
          obj >= n
        , 'expected #{this} to be at least #{exp}'
        , 'expected #{this} to be below #{exp}'
        , n
      );
    }
  }

  Assertion.addMethod('least', assertLeast);
  Assertion.addMethod('gte', assertLeast);

  /**
   * ### .below(n[, msg])
   *
   * Asserts that the target is a number or a date less than the given number or date `n` respectively.
   * However, it's often best to assert that the target is equal to its expected
   * value.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.be.below(2); // Not recommended
   *
   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
   * or `size` is less than the given number `n`.
   *
   *     expect('foo').to.have.lengthOf(3); // Recommended
   *     expect('foo').to.have.lengthOf.below(4); // Not recommended
   *
   *     expect([1, 2, 3]).to.have.length(3); // Recommended
   *     expect([1, 2, 3]).to.have.lengthOf.below(4); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.below`.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(2).to.not.be.below(1); // Not recommended
   *
   * `.below` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect(2).to.be.below(1, 'nooo why fail??');
   *     expect(2, 'nooo why fail??').to.be.below(1);
   *
   * The aliases `.lt` and `.lessThan` can be used interchangeably with
   * `.below`.
   *
   * @name below
   * @alias lt
   * @alias lessThan
   * @param {Number} n
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertBelow (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , doLength = flag(this, 'doLength')
      , flagMsg = flag(this, 'message')
      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
      , ssfi = flag(this, 'ssfi')
      , objType = _.type(obj).toLowerCase()
      , nType = _.type(n).toLowerCase()
      , errorMessage
      , shouldThrow = true;

    if (doLength && objType !== 'map' && objType !== 'set') {
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }

    if (!doLength && (objType === 'date' && nType !== 'date')) {
      errorMessage = msgPrefix + 'the argument to below must be a date';
    } else if (nType !== 'number' && (doLength || objType === 'number')) {
      errorMessage = msgPrefix + 'the argument to below must be a number';
    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
      shouldThrow = false;
    }

    if (shouldThrow) {
      throw new AssertionError(errorMessage, undefined, ssfi);
    }

    if (doLength) {
      var descriptor = 'length'
        , itemsCount;
      if (objType === 'map' || objType === 'set') {
        descriptor = 'size';
        itemsCount = obj.size;
      } else {
        itemsCount = obj.length;
      }
      this.assert(
          itemsCount < n
        , 'expected #{this} to have a ' + descriptor + ' below #{exp} but got #{act}'
        , 'expected #{this} to not have a ' + descriptor + ' below #{exp}'
        , n
        , itemsCount
      );
    } else {
      this.assert(
          obj < n
        , 'expected #{this} to be below #{exp}'
        , 'expected #{this} to be at least #{exp}'
        , n
      );
    }
  }

  Assertion.addMethod('below', assertBelow);
  Assertion.addMethod('lt', assertBelow);
  Assertion.addMethod('lessThan', assertBelow);

  /**
   * ### .most(n[, msg])
   *
   * Asserts that the target is a number or a date less than or equal to the given number
   * or date `n` respectively. However, it's often best to assert that the target is equal to its
   * expected value.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.be.at.most(2); // Not recommended
   *     expect(1).to.be.at.most(1); // Not recommended
   *
   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
   * or `size` is less than or equal to the given number `n`.
   *
   *     expect('foo').to.have.lengthOf(3); // Recommended
   *     expect('foo').to.have.lengthOf.at.most(4); // Not recommended
   *
   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
   *     expect([1, 2, 3]).to.have.lengthOf.at.most(4); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.most`.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(2).to.not.be.at.most(1); // Not recommended
   *
   * `.most` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect(2).to.be.at.most(1, 'nooo why fail??');
   *     expect(2, 'nooo why fail??').to.be.at.most(1);
   *
   * The alias `.lte` can be used interchangeably with `.most`.
   *
   * @name most
   * @alias lte
   * @param {Number} n
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertMost (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , doLength = flag(this, 'doLength')
      , flagMsg = flag(this, 'message')
      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
      , ssfi = flag(this, 'ssfi')
      , objType = _.type(obj).toLowerCase()
      , nType = _.type(n).toLowerCase()
      , errorMessage
      , shouldThrow = true;

    if (doLength && objType !== 'map' && objType !== 'set') {
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }

    if (!doLength && (objType === 'date' && nType !== 'date')) {
      errorMessage = msgPrefix + 'the argument to most must be a date';
    } else if (nType !== 'number' && (doLength || objType === 'number')) {
      errorMessage = msgPrefix + 'the argument to most must be a number';
    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
      shouldThrow = false;
    }

    if (shouldThrow) {
      throw new AssertionError(errorMessage, undefined, ssfi);
    }

    if (doLength) {
      var descriptor = 'length'
        , itemsCount;
      if (objType === 'map' || objType === 'set') {
        descriptor = 'size';
        itemsCount = obj.size;
      } else {
        itemsCount = obj.length;
      }
      this.assert(
          itemsCount <= n
        , 'expected #{this} to have a ' + descriptor + ' at most #{exp} but got #{act}'
        , 'expected #{this} to have a ' + descriptor + ' above #{exp}'
        , n
        , itemsCount
      );
    } else {
      this.assert(
          obj <= n
        , 'expected #{this} to be at most #{exp}'
        , 'expected #{this} to be above #{exp}'
        , n
      );
    }
  }

  Assertion.addMethod('most', assertMost);
  Assertion.addMethod('lte', assertMost);

  /**
   * ### .within(start, finish[, msg])
   *
   * Asserts that the target is a number or a date greater than or equal to the given
   * number or date `start`, and less than or equal to the given number or date `finish` respectively.
   * However, it's often best to assert that the target is equal to its expected
   * value.
   *
   *     expect(2).to.equal(2); // Recommended
   *     expect(2).to.be.within(1, 3); // Not recommended
   *     expect(2).to.be.within(2, 3); // Not recommended
   *     expect(2).to.be.within(1, 2); // Not recommended
   *
   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
   * or `size` is greater than or equal to the given number `start`, and less
   * than or equal to the given number `finish`.
   *
   *     expect('foo').to.have.lengthOf(3); // Recommended
   *     expect('foo').to.have.lengthOf.within(2, 4); // Not recommended
   *
   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
   *     expect([1, 2, 3]).to.have.lengthOf.within(2, 4); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.within`.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.within(2, 4); // Not recommended
   *
   * `.within` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect(4).to.be.within(1, 3, 'nooo why fail??');
   *     expect(4, 'nooo why fail??').to.be.within(1, 3);
   *
   * @name within
   * @param {Number} start lower bound inclusive
   * @param {Number} finish upper bound inclusive
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('within', function (start, finish, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , doLength = flag(this, 'doLength')
      , flagMsg = flag(this, 'message')
      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
      , ssfi = flag(this, 'ssfi')
      , objType = _.type(obj).toLowerCase()
      , startType = _.type(start).toLowerCase()
      , finishType = _.type(finish).toLowerCase()
      , errorMessage
      , shouldThrow = true
      , range = (startType === 'date' && finishType === 'date')
          ? start.toUTCString() + '..' + finish.toUTCString()
          : start + '..' + finish;

    if (doLength && objType !== 'map' && objType !== 'set') {
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }

    if (!doLength && (objType === 'date' && (startType !== 'date' || finishType !== 'date'))) {
      errorMessage = msgPrefix + 'the arguments to within must be dates';
    } else if ((startType !== 'number' || finishType !== 'number') && (doLength || objType === 'number')) {
      errorMessage = msgPrefix + 'the arguments to within must be numbers';
    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
      shouldThrow = false;
    }

    if (shouldThrow) {
      throw new AssertionError(errorMessage, undefined, ssfi);
    }

    if (doLength) {
      var descriptor = 'length'
        , itemsCount;
      if (objType === 'map' || objType === 'set') {
        descriptor = 'size';
        itemsCount = obj.size;
      } else {
        itemsCount = obj.length;
      }
      this.assert(
          itemsCount >= start && itemsCount <= finish
        , 'expected #{this} to have a ' + descriptor + ' within ' + range
        , 'expected #{this} to not have a ' + descriptor + ' within ' + range
      );
    } else {
      this.assert(
          obj >= start && obj <= finish
        , 'expected #{this} to be within ' + range
        , 'expected #{this} to not be within ' + range
      );
    }
  });

  /**
   * ### .instanceof(constructor[, msg])
   *
   * Asserts that the target is an instance of the given `constructor`.
   *
   *     function Cat () { }
   *
   *     expect(new Cat()).to.be.an.instanceof(Cat);
   *     expect([1, 2]).to.be.an.instanceof(Array);
   *
   * Add `.not` earlier in the chain to negate `.instanceof`.
   *
   *     expect({a: 1}).to.not.be.an.instanceof(Array);
   *
   * `.instanceof` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect(1).to.be.an.instanceof(Array, 'nooo why fail??');
   *     expect(1, 'nooo why fail??').to.be.an.instanceof(Array);
   *
   * Due to limitations in ES5, `.instanceof` may not always work as expected
   * when using a transpiler such as Babel or TypeScript. In particular, it may
   * produce unexpected results when subclassing built-in object such as
   * `Array`, `Error`, and `Map`. See your transpiler's docs for details:
   *
   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
   *
   * The alias `.instanceOf` can be used interchangeably with `.instanceof`.
   *
   * @name instanceof
   * @param {Constructor} constructor
   * @param {String} msg _optional_
   * @alias instanceOf
   * @namespace BDD
   * @api public
   */

  function assertInstanceOf (constructor, msg) {
    if (msg) flag(this, 'message', msg);

    var target = flag(this, 'object');
    var ssfi = flag(this, 'ssfi');
    var flagMsg = flag(this, 'message');

    try {
      var isInstanceOf = target instanceof constructor;
    } catch (err) {
      if (err instanceof TypeError) {
        flagMsg = flagMsg ? flagMsg + ': ' : '';
        throw new AssertionError(
          flagMsg + 'The instanceof assertion needs a constructor but '
            + _.type(constructor) + ' was given.',
          undefined,
          ssfi
        );
      }
      throw err;
    }

    var name = _.getName(constructor);
    if (name === null) {
      name = 'an unnamed constructor';
    }

    this.assert(
        isInstanceOf
      , 'expected #{this} to be an instance of ' + name
      , 'expected #{this} to not be an instance of ' + name
    );
  }
  Assertion.addMethod('instanceof', assertInstanceOf);
  Assertion.addMethod('instanceOf', assertInstanceOf);

  /**
   * ### .property(name[, val[, msg]])
   *
   * Asserts that the target has a property with the given key `name`.
   *
   *     expect({a: 1}).to.have.property('a');
   *
   * When `val` is provided, `.property` also asserts that the property's value
   * is equal to the given `val`.
   *
   *     expect({a: 1}).to.have.property('a', 1);
   *
   * By default, strict (`===`) equality is used. Add `.deep` earlier in the
   * chain to use deep equality instead. See the `deep-eql` project page for
   * info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
   *
   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
   *
   * The target's enumerable and non-enumerable properties are always included
   * in the search. By default, both own and inherited properties are included.
   * Add `.own` earlier in the chain to exclude inherited properties from the
   * search.
   *
   *     Object.prototype.b = 2;
   *
   *     expect({a: 1}).to.have.own.property('a');
   *     expect({a: 1}).to.have.own.property('a', 1);
   *     expect({a: 1}).to.have.property('b');
   *     expect({a: 1}).to.not.have.own.property('b');
   *
   * `.deep` and `.own` can be combined.
   *
   *     expect({x: {a: 1}}).to.have.deep.own.property('x', {a: 1});
   *
   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
   * referencing nested properties.
   *
   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]', 'y');
   *
   * If `.` or `[]` are part of an actual property name, they can be escaped by
   * adding two backslashes before them.
   *
   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
   *
   * `.deep` and `.nested` can be combined.
   *
   *     expect({a: {b: [{c: 3}]}})
   *       .to.have.deep.nested.property('a.b[0]', {c: 3});
   *
   * `.own` and `.nested` cannot be combined.
   *
   * Add `.not` earlier in the chain to negate `.property`.
   *
   *     expect({a: 1}).to.not.have.property('b');
   *
   * However, it's dangerous to negate `.property` when providing `val`. The
   * problem is that it creates uncertain expectations by asserting that the
   * target either doesn't have a property with the given key `name`, or that it
   * does have a property with the given key `name` but its value isn't equal to
   * the given `val`. It's often best to identify the exact output that's
   * expected, and then write an assertion that only accepts that exact output.
   *
   * When the target isn't expected to have a property with the given key
   * `name`, it's often best to assert exactly that.
   *
   *     expect({b: 2}).to.not.have.property('a'); // Recommended
   *     expect({b: 2}).to.not.have.property('a', 1); // Not recommended
   *
   * When the target is expected to have a property with the given key `name`,
   * it's often best to assert that the property has its expected value, rather
   * than asserting that it doesn't have one of many unexpected values.
   *
   *     expect({a: 3}).to.have.property('a', 3); // Recommended
   *     expect({a: 3}).to.not.have.property('a', 1); // Not recommended
   *
   * `.property` changes the target of any assertions that follow in the chain
   * to be the value of the property from the original target object.
   *
   *     expect({a: 1}).to.have.property('a').that.is.a('number');
   *
   * `.property` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`. When not providing `val`, only use the
   * second form.
   *
   *     // Recommended
   *     expect({a: 1}).to.have.property('a', 2, 'nooo why fail??');
   *     expect({a: 1}, 'nooo why fail??').to.have.property('a', 2);
   *     expect({a: 1}, 'nooo why fail??').to.have.property('b');
   *
   *     // Not recommended
   *     expect({a: 1}).to.have.property('b', undefined, 'nooo why fail??');
   *
   * The above assertion isn't the same thing as not providing `val`. Instead,
   * it's asserting that the target object has a `b` property that's equal to
   * `undefined`.
   *
   * The assertions `.ownProperty` and `.haveOwnProperty` can be used
   * interchangeably with `.own.property`.
   *
   * @name property
   * @param {String} name
   * @param {Mixed} val (optional)
   * @param {String} msg _optional_
   * @returns value of property for chaining
   * @namespace BDD
   * @api public
   */

  function assertProperty (name, val, msg) {
    if (msg) flag(this, 'message', msg);

    var isNested = flag(this, 'nested')
      , isOwn = flag(this, 'own')
      , flagMsg = flag(this, 'message')
      , obj = flag(this, 'object')
      , ssfi = flag(this, 'ssfi')
      , nameType = typeof name;

    flagMsg = flagMsg ? flagMsg + ': ' : '';

    if (isNested) {
      if (nameType !== 'string') {
        throw new AssertionError(
          flagMsg + 'the argument to property must be a string when using nested syntax',
          undefined,
          ssfi
        );
      }
    } else {
      if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol') {
        throw new AssertionError(
          flagMsg + 'the argument to property must be a string, number, or symbol',
          undefined,
          ssfi
        );
      }
    }

    if (isNested && isOwn) {
      throw new AssertionError(
        flagMsg + 'The "nested" and "own" flags cannot be combined.',
        undefined,
        ssfi
      );
    }

    if (obj === null || obj === undefined) {
      throw new AssertionError(
        flagMsg + 'Target cannot be null or undefined.',
        undefined,
        ssfi
      );
    }

    var isDeep = flag(this, 'deep')
      , negate = flag(this, 'negate')
      , pathInfo = isNested ? _.getPathInfo(obj, name) : null
      , value = isNested ? pathInfo.value : obj[name];

    var descriptor = '';
    if (isDeep) descriptor += 'deep ';
    if (isOwn) descriptor += 'own ';
    if (isNested) descriptor += 'nested ';
    descriptor += 'property ';

    var hasProperty;
    if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
    else if (isNested) hasProperty = pathInfo.exists;
    else hasProperty = _.hasProperty(obj, name);

    // When performing a negated assertion for both name and val, merely having
    // a property with the given name isn't enough to cause the assertion to
    // fail. It must both have a property with the given name, and the value of
    // that property must equal the given val. Therefore, skip this assertion in
    // favor of the next.
    if (!negate || arguments.length === 1) {
      this.assert(
          hasProperty
        , 'expected #{this} to have ' + descriptor + _.inspect(name)
        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
    }

    if (arguments.length > 1) {
      this.assert(
          hasProperty && (isDeep ? _.eql(val, value) : val === value)
        , 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
        , 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}'
        , val
        , value
      );
    }

    flag(this, 'object', value);
  }

  Assertion.addMethod('property', assertProperty);

  function assertOwnProperty (name, value, msg) {
    flag(this, 'own', true);
    assertProperty.apply(this, arguments);
  }

  Assertion.addMethod('ownProperty', assertOwnProperty);
  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

  /**
   * ### .ownPropertyDescriptor(name[, descriptor[, msg]])
   *
   * Asserts that the target has its own property descriptor with the given key
   * `name`. Enumerable and non-enumerable properties are included in the
   * search.
   *
   *     expect({a: 1}).to.have.ownPropertyDescriptor('a');
   *
   * When `descriptor` is provided, `.ownPropertyDescriptor` also asserts that
   * the property's descriptor is deeply equal to the given `descriptor`. See
   * the `deep-eql` project page for info on the deep equality algorithm:
   * https://github.com/chaijs/deep-eql.
   *
   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
   *       configurable: true,
   *       enumerable: true,
   *       writable: true,
   *       value: 1,
   *     });
   *
   * Add `.not` earlier in the chain to negate `.ownPropertyDescriptor`.
   *
   *     expect({a: 1}).to.not.have.ownPropertyDescriptor('b');
   *
   * However, it's dangerous to negate `.ownPropertyDescriptor` when providing
   * a `descriptor`. The problem is that it creates uncertain expectations by
   * asserting that the target either doesn't have a property descriptor with
   * the given key `name`, or that it does have a property descriptor with the
   * given key `name` but its not deeply equal to the given `descriptor`. It's
   * often best to identify the exact output that's expected, and then write an
   * assertion that only accepts that exact output.
   *
   * When the target isn't expected to have a property descriptor with the given
   * key `name`, it's often best to assert exactly that.
   *
   *     // Recommended
   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a');
   *
   *     // Not recommended
   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a', {
   *       configurable: true,
   *       enumerable: true,
   *       writable: true,
   *       value: 1,
   *     });
   *
   * When the target is expected to have a property descriptor with the given
   * key `name`, it's often best to assert that the property has its expected
   * descriptor, rather than asserting that it doesn't have one of many
   * unexpected descriptors.
   *
   *     // Recommended
   *     expect({a: 3}).to.have.ownPropertyDescriptor('a', {
   *       configurable: true,
   *       enumerable: true,
   *       writable: true,
   *       value: 3,
   *     });
   *
   *     // Not recommended
   *     expect({a: 3}).to.not.have.ownPropertyDescriptor('a', {
   *       configurable: true,
   *       enumerable: true,
   *       writable: true,
   *       value: 1,
   *     });
   *
   * `.ownPropertyDescriptor` changes the target of any assertions that follow
   * in the chain to be the value of the property descriptor from the original
   * target object.
   *
   *     expect({a: 1}).to.have.ownPropertyDescriptor('a')
   *       .that.has.property('enumerable', true);
   *
   * `.ownPropertyDescriptor` accepts an optional `msg` argument which is a
   * custom error message to show when the assertion fails. The message can also
   * be given as the second argument to `expect`. When not providing
   * `descriptor`, only use the second form.
   *
   *     // Recommended
   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
   *       configurable: true,
   *       enumerable: true,
   *       writable: true,
   *       value: 2,
   *     }, 'nooo why fail??');
   *
   *     // Recommended
   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('a', {
   *       configurable: true,
   *       enumerable: true,
   *       writable: true,
   *       value: 2,
   *     });
   *
   *     // Recommended
   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('b');
   *
   *     // Not recommended
   *     expect({a: 1})
   *       .to.have.ownPropertyDescriptor('b', undefined, 'nooo why fail??');
   *
   * The above assertion isn't the same thing as not providing `descriptor`.
   * Instead, it's asserting that the target object has a `b` property
   * descriptor that's deeply equal to `undefined`.
   *
   * The alias `.haveOwnPropertyDescriptor` can be used interchangeably with
   * `.ownPropertyDescriptor`.
   *
   * @name ownPropertyDescriptor
   * @alias haveOwnPropertyDescriptor
   * @param {String} name
   * @param {Object} descriptor _optional_
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnPropertyDescriptor (name, descriptor, msg) {
    if (typeof descriptor === 'string') {
      msg = descriptor;
      descriptor = null;
    }
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
    if (actualDescriptor && descriptor) {
      this.assert(
          _.eql(descriptor, actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
        , descriptor
        , actualDescriptor
        , true
      );
    } else {
      this.assert(
          actualDescriptor
        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
      );
    }
    flag(this, 'object', actualDescriptor);
  }

  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

  /**
   * ### .lengthOf(n[, msg])
   *
   * Asserts that the target's `length` or `size` is equal to the given number
   * `n`.
   *
   *     expect([1, 2, 3]).to.have.lengthOf(3);
   *     expect('foo').to.have.lengthOf(3);
   *     expect(new Set([1, 2, 3])).to.have.lengthOf(3);
   *     expect(new Map([['a', 1], ['b', 2], ['c', 3]])).to.have.lengthOf(3);
   *
   * Add `.not` earlier in the chain to negate `.lengthOf`. However, it's often
   * best to assert that the target's `length` property is equal to its expected
   * value, rather than not equal to one of many unexpected values.
   *
   *     expect('foo').to.have.lengthOf(3); // Recommended
   *     expect('foo').to.not.have.lengthOf(4); // Not recommended
   *
   * `.lengthOf` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect([1, 2, 3]).to.have.lengthOf(2, 'nooo why fail??');
   *     expect([1, 2, 3], 'nooo why fail??').to.have.lengthOf(2);
   *
   * `.lengthOf` can also be used as a language chain, causing all `.above`,
   * `.below`, `.least`, `.most`, and `.within` assertions that follow in the
   * chain to use the target's `length` property as the target. However, it's
   * often best to assert that the target's `length` property is equal to its
   * expected length, rather than asserting that its `length` property falls
   * within some range of values.
   *
   *     // Recommended
   *     expect([1, 2, 3]).to.have.lengthOf(3);
   *
   *     // Not recommended
   *     expect([1, 2, 3]).to.have.lengthOf.above(2);
   *     expect([1, 2, 3]).to.have.lengthOf.below(4);
   *     expect([1, 2, 3]).to.have.lengthOf.at.least(3);
   *     expect([1, 2, 3]).to.have.lengthOf.at.most(3);
   *     expect([1, 2, 3]).to.have.lengthOf.within(2,4);
   *
   * Due to a compatibility issue, the alias `.length` can't be chained directly
   * off of an uninvoked method such as `.a`. Therefore, `.length` can't be used
   * interchangeably with `.lengthOf` in every situation. It's recommended to
   * always use `.lengthOf` instead of `.length`.
   *
   *     expect([1, 2, 3]).to.have.a.length(3); // incompatible; throws error
   *     expect([1, 2, 3]).to.have.a.lengthOf(3);  // passes as expected
   *
   * @name lengthOf
   * @alias length
   * @param {Number} n
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertLengthChain () {
    flag(this, 'doLength', true);
  }

  function assertLength (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , objType = _.type(obj).toLowerCase()
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi')
      , descriptor = 'length'
      , itemsCount;

    switch (objType) {
      case 'map':
      case 'set':
        descriptor = 'size';
        itemsCount = obj.size;
        break;
      default:
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
        itemsCount = obj.length;
    }

    this.assert(
        itemsCount == n
      , 'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}'
      , 'expected #{this} to not have a ' + descriptor + ' of #{act}'
      , n
      , itemsCount
    );
  }

  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
  Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);

  /**
   * ### .match(re[, msg])
   *
   * Asserts that the target matches the given regular expression `re`.
   *
   *     expect('foobar').to.match(/^foo/);
   *
   * Add `.not` earlier in the chain to negate `.match`.
   *
   *     expect('foobar').to.not.match(/taco/);
   *
   * `.match` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect('foobar').to.match(/taco/, 'nooo why fail??');
   *     expect('foobar', 'nooo why fail??').to.match(/taco/);
   *
   * The alias `.matches` can be used interchangeably with `.match`.
   *
   * @name match
   * @alias matches
   * @param {RegExp} re
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */
  function assertMatch(re, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        re.exec(obj)
      , 'expected #{this} to match ' + re
      , 'expected #{this} not to match ' + re
    );
  }

  Assertion.addMethod('match', assertMatch);
  Assertion.addMethod('matches', assertMatch);

  /**
   * ### .string(str[, msg])
   *
   * Asserts that the target string contains the given substring `str`.
   *
   *     expect('foobar').to.have.string('bar');
   *
   * Add `.not` earlier in the chain to negate `.string`.
   *
   *     expect('foobar').to.not.have.string('taco');
   *
   * `.string` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect('foobar').to.have.string('taco', 'nooo why fail??');
   *     expect('foobar', 'nooo why fail??').to.have.string('taco');
   *
   * @name string
   * @param {String} str
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('string', function (str, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');
    new Assertion(obj, flagMsg, ssfi, true).is.a('string');

    this.assert(
        ~obj.indexOf(str)
      , 'expected #{this} to contain ' + _.inspect(str)
      , 'expected #{this} to not contain ' + _.inspect(str)
    );
  });

  /**
   * ### .keys(key1[, key2[, ...]])
   *
   * Asserts that the target object, array, map, or set has the given keys. Only
   * the target's own inherited properties are included in the search.
   *
   * When the target is an object or array, keys can be provided as one or more
   * string arguments, a single array argument, or a single object argument. In
   * the latter case, only the keys in the given object matter; the values are
   * ignored.
   *
   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
   *     expect(['x', 'y']).to.have.all.keys(0, 1);
   *
   *     expect({a: 1, b: 2}).to.have.all.keys(['a', 'b']);
   *     expect(['x', 'y']).to.have.all.keys([0, 1]);
   *
   *     expect({a: 1, b: 2}).to.have.all.keys({a: 4, b: 5}); // ignore 4 and 5
   *     expect(['x', 'y']).to.have.all.keys({0: 4, 1: 5}); // ignore 4 and 5
   *
   * When the target is a map or set, each key must be provided as a separate
   * argument.
   *
   *     expect(new Map([['a', 1], ['b', 2]])).to.have.all.keys('a', 'b');
   *     expect(new Set(['a', 'b'])).to.have.all.keys('a', 'b');
   *
   * Because `.keys` does different things based on the target's type, it's
   * important to check the target's type before using `.keys`. See the `.a` doc
   * for info on testing a target's type.
   *
   *     expect({a: 1, b: 2}).to.be.an('object').that.has.all.keys('a', 'b');
   *
   * By default, strict (`===`) equality is used to compare keys of maps and
   * sets. Add `.deep` earlier in the chain to use deep equality instead. See
   * the `deep-eql` project page for info on the deep equality algorithm:
   * https://github.com/chaijs/deep-eql.
   *
   *     // Target set deeply (but not strictly) has key `{a: 1}`
   *     expect(new Set([{a: 1}])).to.have.all.deep.keys([{a: 1}]);
   *     expect(new Set([{a: 1}])).to.not.have.all.keys([{a: 1}]);
   *
   * By default, the target must have all of the given keys and no more. Add
   * `.any` earlier in the chain to only require that the target have at least
   * one of the given keys. Also, add `.not` earlier in the chain to negate
   * `.keys`. It's often best to add `.any` when negating `.keys`, and to use
   * `.all` when asserting `.keys` without negation.
   *
   * When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
   * exactly what's expected of the output, whereas `.not.all.keys` creates
   * uncertain expectations.
   *
   *     // Recommended; asserts that target doesn't have any of the given keys
   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
   *
   *     // Not recommended; asserts that target doesn't have all of the given
   *     // keys but may or may not have some of them
   *     expect({a: 1, b: 2}).to.not.have.all.keys('c', 'd');
   *
   * When asserting `.keys` without negation, `.all` is preferred because
   * `.all.keys` asserts exactly what's expected of the output, whereas
   * `.any.keys` creates uncertain expectations.
   *
   *     // Recommended; asserts that target has all the given keys
   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
   *
   *     // Not recommended; asserts that target has at least one of the given
   *     // keys but may or may not have more of them
   *     expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
   *
   * Note that `.all` is used by default when neither `.all` nor `.any` appear
   * earlier in the chain. However, it's often best to add `.all` anyway because
   * it improves readability.
   *
   *     // Both assertions are identical
   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b'); // Recommended
   *     expect({a: 1, b: 2}).to.have.keys('a', 'b'); // Not recommended
   *
   * Add `.include` earlier in the chain to require that the target's keys be a
   * superset of the expected keys, rather than identical sets.
   *
   *     // Target object's keys are a superset of ['a', 'b'] but not identical
   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
   *
   * However, if `.any` and `.include` are combined, only the `.any` takes
   * effect. The `.include` is ignored in this case.
   *
   *     // Both assertions are identical
   *     expect({a: 1}).to.have.any.keys('a', 'b');
   *     expect({a: 1}).to.include.any.keys('a', 'b');
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect({a: 1}, 'nooo why fail??').to.have.key('b');
   *
   * The alias `.key` can be used interchangeably with `.keys`.
   *
   * @name keys
   * @alias key
   * @param {...String|Array|Object} keys
   * @namespace BDD
   * @api public
   */

  function assertKeys (keys) {
    var obj = flag(this, 'object')
      , objType = _.type(obj)
      , keysType = _.type(keys)
      , ssfi = flag(this, 'ssfi')
      , isDeep = flag(this, 'deep')
      , str
      , deepStr = ''
      , actual
      , ok = true
      , flagMsg = flag(this, 'message');

    flagMsg = flagMsg ? flagMsg + ': ' : '';
    var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

    if (objType === 'Map' || objType === 'Set') {
      deepStr = isDeep ? 'deeply ' : '';
      actual = [];

      // Map and Set '.keys' aren't supported in IE 11. Therefore, use .forEach.
      obj.forEach(function (val, key) { actual.push(key); });

      if (keysType !== 'Array') {
        keys = Array.prototype.slice.call(arguments);
      }
    } else {
      actual = _.getOwnEnumerableProperties(obj);

      switch (keysType) {
        case 'Array':
          if (arguments.length > 1) {
            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
          }
          break;
        case 'Object':
          if (arguments.length > 1) {
            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
          }
          keys = Object.keys(keys);
          break;
        default:
          keys = Array.prototype.slice.call(arguments);
      }

      // Only stringify non-Symbols because Symbols would become "Symbol()"
      keys = keys.map(function (val) {
        return typeof val === 'symbol' ? val : String(val);
      });
    }

    if (!keys.length) {
      throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
    }

    var len = keys.length
      , any = flag(this, 'any')
      , all = flag(this, 'all')
      , expected = keys;

    if (!any && !all) {
      all = true;
    }

    // Has any
    if (any) {
      ok = expected.some(function(expectedKey) {
        return actual.some(function(actualKey) {
          if (isDeep) {
            return _.eql(expectedKey, actualKey);
          } else {
            return expectedKey === actualKey;
          }
        });
      });
    }

    // Has all
    if (all) {
      ok = expected.every(function(expectedKey) {
        return actual.some(function(actualKey) {
          if (isDeep) {
            return _.eql(expectedKey, actualKey);
          } else {
            return expectedKey === actualKey;
          }
        });
      });

      if (!flag(this, 'contains')) {
        ok = ok && keys.length == actual.length;
      }
    }

    // Key string
    if (len > 1) {
      keys = keys.map(function(key) {
        return _.inspect(key);
      });
      var last = keys.pop();
      if (all) {
        str = keys.join(', ') + ', and ' + last;
      }
      if (any) {
        str = keys.join(', ') + ', or ' + last;
      }
    } else {
      str = _.inspect(keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

    // Assertion
    this.assert(
        ok
      , 'expected #{this} to ' + deepStr + str
      , 'expected #{this} to not ' + deepStr + str
      , expected.slice(0).sort(_.compareByInspect)
      , actual.sort(_.compareByInspect)
      , true
    );
  }

  Assertion.addMethod('keys', assertKeys);
  Assertion.addMethod('key', assertKeys);

  /**
   * ### .throw([errorLike], [errMsgMatcher], [msg])
   *
   * When no arguments are provided, `.throw` invokes the target function and
   * asserts that an error is thrown.
   *
   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
   *
   *     expect(badFn).to.throw();
   *
   * When one argument is provided, and it's an error constructor, `.throw`
   * invokes the target function and asserts that an error is thrown that's an
   * instance of that error constructor.
   *
   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
   *
   *     expect(badFn).to.throw(TypeError);
   *
   * When one argument is provided, and it's an error instance, `.throw` invokes
   * the target function and asserts that an error is thrown that's strictly
   * (`===`) equal to that error instance.
   *
   *     var err = new TypeError('Illegal salmon!');
   *     var badFn = function () { throw err; };
   *
   *     expect(badFn).to.throw(err);
   *
   * When one argument is provided, and it's a string, `.throw` invokes the
   * target function and asserts that an error is thrown with a message that
   * contains that string.
   *
   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
   *
   *     expect(badFn).to.throw('salmon');
   *
   * When one argument is provided, and it's a regular expression, `.throw`
   * invokes the target function and asserts that an error is thrown with a
   * message that matches that regular expression.
   *
   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
   *
   *     expect(badFn).to.throw(/salmon/);
   *
   * When two arguments are provided, and the first is an error instance or
   * constructor, and the second is a string or regular expression, `.throw`
   * invokes the function and asserts that an error is thrown that fulfills both
   * conditions as described above.
   *
   *     var err = new TypeError('Illegal salmon!');
   *     var badFn = function () { throw err; };
   *
   *     expect(badFn).to.throw(TypeError, 'salmon');
   *     expect(badFn).to.throw(TypeError, /salmon/);
   *     expect(badFn).to.throw(err, 'salmon');
   *     expect(badFn).to.throw(err, /salmon/);
   *
   * Add `.not` earlier in the chain to negate `.throw`.
   *
   *     var goodFn = function () {};
   *
   *     expect(goodFn).to.not.throw();
   *
   * However, it's dangerous to negate `.throw` when providing any arguments.
   * The problem is that it creates uncertain expectations by asserting that the
   * target either doesn't throw an error, or that it throws an error but of a
   * different type than the given type, or that it throws an error of the given
   * type but with a message that doesn't include the given string. It's often
   * best to identify the exact output that's expected, and then write an
   * assertion that only accepts that exact output.
   *
   * When the target isn't expected to throw an error, it's often best to assert
   * exactly that.
   *
   *     var goodFn = function () {};
   *
   *     expect(goodFn).to.not.throw(); // Recommended
   *     expect(goodFn).to.not.throw(ReferenceError, 'x'); // Not recommended
   *
   * When the target is expected to throw an error, it's often best to assert
   * that the error is of its expected type, and has a message that includes an
   * expected string, rather than asserting that it doesn't have one of many
   * unexpected types, and doesn't have a message that includes some string.
   *
   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
   *
   *     expect(badFn).to.throw(TypeError, 'salmon'); // Recommended
   *     expect(badFn).to.not.throw(ReferenceError, 'x'); // Not recommended
   *
   * `.throw` changes the target of any assertions that follow in the chain to
   * be the error object that's thrown.
   *
   *     var err = new TypeError('Illegal salmon!');
   *     err.code = 42;
   *     var badFn = function () { throw err; };
   *
   *     expect(badFn).to.throw(TypeError).with.property('code', 42);
   *
   * `.throw` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`. When not providing two arguments, always use
   * the second form.
   *
   *     var goodFn = function () {};
   *
   *     expect(goodFn).to.throw(TypeError, 'x', 'nooo why fail??');
   *     expect(goodFn, 'nooo why fail??').to.throw();
   *
   * Due to limitations in ES5, `.throw` may not always work as expected when
   * using a transpiler such as Babel or TypeScript. In particular, it may
   * produce unexpected results when subclassing the built-in `Error` object and
   * then passing the subclassed constructor to `.throw`. See your transpiler's
   * docs for details:
   *
   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
   *
   * Beware of some common mistakes when using the `throw` assertion. One common
   * mistake is to accidentally invoke the function yourself instead of letting
   * the `throw` assertion invoke the function for you. For example, when
   * testing if a function named `fn` throws, provide `fn` instead of `fn()` as
   * the target for the assertion.
   *
   *     expect(fn).to.throw();     // Good! Tests `fn` as desired
   *     expect(fn()).to.throw();   // Bad! Tests result of `fn()`, not `fn`
   *
   * If you need to assert that your function `fn` throws when passed certain
   * arguments, then wrap a call to `fn` inside of another function.
   *
   *     expect(function () { fn(42); }).to.throw();  // Function expression
   *     expect(() => fn(42)).to.throw();             // ES6 arrow function
   *
   * Another common mistake is to provide an object method (or any stand-alone
   * function that relies on `this`) as the target of the assertion. Doing so is
   * problematic because the `this` context will be lost when the function is
   * invoked by `.throw`; there's no way for it to know what `this` is supposed
   * to be. There are two ways around this problem. One solution is to wrap the
   * method or function call inside of another function. Another solution is to
   * use `bind`.
   *
   *     expect(function () { cat.meow(); }).to.throw();  // Function expression
   *     expect(() => cat.meow()).to.throw();             // ES6 arrow function
   *     expect(cat.meow.bind(cat)).to.throw();           // Bind
   *
   * Finally, it's worth mentioning that it's a best practice in JavaScript to
   * only throw `Error` and derivatives of `Error` such as `ReferenceError`,
   * `TypeError`, and user-defined objects that extend `Error`. No other type of
   * value will generate a stack trace when initialized. With that said, the
   * `throw` assertion does technically support any type of value being thrown,
   * not just `Error` and its derivatives.
   *
   * The aliases `.throws` and `.Throw` can be used interchangeably with
   * `.throw`.
   *
   * @name throw
   * @alias throws
   * @alias Throw
   * @param {Error|ErrorConstructor} errorLike
   * @param {String|RegExp} errMsgMatcher error message
   * @param {String} msg _optional_
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @returns error for chaining (null if no error)
   * @namespace BDD
   * @api public
   */

  function assertThrows (errorLike, errMsgMatcher, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , ssfi = flag(this, 'ssfi')
      , flagMsg = flag(this, 'message')
      , negate = flag(this, 'negate') || false;
    new Assertion(obj, flagMsg, ssfi, true).is.a('function');

    if (errorLike instanceof RegExp || typeof errorLike === 'string') {
      errMsgMatcher = errorLike;
      errorLike = null;
    }

    var caughtErr;
    try {
      obj();
    } catch (err) {
      caughtErr = err;
    }

    // If we have the negate flag enabled and at least one valid argument it means we do expect an error
    // but we want it to match a given set of criteria
    var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;

    // If we've got the negate flag enabled and both args, we should only fail if both aren't compatible
    // See Issue #551 and PR #683@GitHub
    var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
    var errorLikeFail = false;
    var errMsgMatcherFail = false;

    // Checking if error was thrown
    if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
      // We need this to display results correctly according to their types
      var errorLikeString = 'an error';
      if (errorLike instanceof Error) {
        errorLikeString = '#{exp}';
      } else if (errorLike) {
        errorLikeString = _.checkError.getConstructorName(errorLike);
      }

      this.assert(
          caughtErr
        , 'expected #{this} to throw ' + errorLikeString
        , 'expected #{this} to not throw an error but #{act} was thrown'
        , errorLike && errorLike.toString()
        , (caughtErr instanceof Error ?
            caughtErr.toString() : (typeof caughtErr === 'string' ? caughtErr : caughtErr &&
                                    _.checkError.getConstructorName(caughtErr)))
      );
    }

    if (errorLike && caughtErr) {
      // We should compare instances only if `errorLike` is an instance of `Error`
      if (errorLike instanceof Error) {
        var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);

        if (isCompatibleInstance === negate) {
          // These checks were created to ensure we won't fail too soon when we've got both args and a negate
          // See Issue #551 and PR #683@GitHub
          if (everyArgIsDefined && negate) {
            errorLikeFail = true;
          } else {
            this.assert(
                negate
              , 'expected #{this} to throw #{exp} but #{act} was thrown'
              , 'expected #{this} to not throw #{exp}' + (caughtErr && !negate ? ' but #{act} was thrown' : '')
              , errorLike.toString()
              , caughtErr.toString()
            );
          }
        }
      }

      var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
      if (isCompatibleConstructor === negate) {
        if (everyArgIsDefined && negate) {
            errorLikeFail = true;
        } else {
          this.assert(
              negate
            , 'expected #{this} to throw #{exp} but #{act} was thrown'
            , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
            , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
            , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
          );
        }
      }
    }

    if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
      // Here we check compatible messages
      var placeholder = 'including';
      if (errMsgMatcher instanceof RegExp) {
        placeholder = 'matching';
      }

      var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
      if (isCompatibleMessage === negate) {
        if (everyArgIsDefined && negate) {
            errMsgMatcherFail = true;
        } else {
          this.assert(
            negate
            , 'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}'
            , 'expected #{this} to throw error not ' + placeholder + ' #{exp}'
            ,  errMsgMatcher
            ,  _.checkError.getMessage(caughtErr)
          );
        }
      }
    }

    // If both assertions failed and both should've matched we throw an error
    if (errorLikeFail && errMsgMatcherFail) {
      this.assert(
        negate
        , 'expected #{this} to throw #{exp} but #{act} was thrown'
        , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
        , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
        , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
      );
    }

    flag(this, 'object', caughtErr);
  }
  Assertion.addMethod('throw', assertThrows);
  Assertion.addMethod('throws', assertThrows);
  Assertion.addMethod('Throw', assertThrows);

  /**
   * ### .respondTo(method[, msg])
   *
   * When the target is a non-function object, `.respondTo` asserts that the
   * target has a method with the given name `method`. The method can be own or
   * inherited, and it can be enumerable or non-enumerable.
   *
   *     function Cat () {}
   *     Cat.prototype.meow = function () {};
   *
   *     expect(new Cat()).to.respondTo('meow');
   *
   * When the target is a function, `.respondTo` asserts that the target's
   * `prototype` property has a method with the given name `method`. Again, the
   * method can be own or inherited, and it can be enumerable or non-enumerable.
   *
   *     function Cat () {}
   *     Cat.prototype.meow = function () {};
   *
   *     expect(Cat).to.respondTo('meow');
   *
   * Add `.itself` earlier in the chain to force `.respondTo` to treat the
   * target as a non-function object, even if it's a function. Thus, it asserts
   * that the target has a method with the given name `method`, rather than
   * asserting that the target's `prototype` property has a method with the
   * given name `method`.
   *
   *     function Cat () {}
   *     Cat.prototype.meow = function () {};
   *     Cat.hiss = function () {};
   *
   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
   *
   * When not adding `.itself`, it's important to check the target's type before
   * using `.respondTo`. See the `.a` doc for info on checking a target's type.
   *
   *     function Cat () {}
   *     Cat.prototype.meow = function () {};
   *
   *     expect(new Cat()).to.be.an('object').that.respondsTo('meow');
   *
   * Add `.not` earlier in the chain to negate `.respondTo`.
   *
   *     function Dog () {}
   *     Dog.prototype.bark = function () {};
   *
   *     expect(new Dog()).to.not.respondTo('meow');
   *
   * `.respondTo` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect({}).to.respondTo('meow', 'nooo why fail??');
   *     expect({}, 'nooo why fail??').to.respondTo('meow');
   *
   * The alias `.respondsTo` can be used interchangeably with `.respondTo`.
   *
   * @name respondTo
   * @alias respondsTo
   * @param {String} method
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function respondTo (method, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , itself = flag(this, 'itself')
      , context = ('function' === typeof obj && !itself)
        ? obj.prototype[method]
        : obj[method];

    this.assert(
        'function' === typeof context
      , 'expected #{this} to respond to ' + _.inspect(method)
      , 'expected #{this} to not respond to ' + _.inspect(method)
    );
  }

  Assertion.addMethod('respondTo', respondTo);
  Assertion.addMethod('respondsTo', respondTo);

  /**
   * ### .itself
   *
   * Forces all `.respondTo` assertions that follow in the chain to behave as if
   * the target is a non-function object, even if it's a function. Thus, it
   * causes `.respondTo` to assert that the target has a method with the given
   * name, rather than asserting that the target's `prototype` property has a
   * method with the given name.
   *
   *     function Cat () {}
   *     Cat.prototype.meow = function () {};
   *     Cat.hiss = function () {};
   *
   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
   *
   * @name itself
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('itself', function () {
    flag(this, 'itself', true);
  });

  /**
   * ### .satisfy(matcher[, msg])
   *
   * Invokes the given `matcher` function with the target being passed as the
   * first argument, and asserts that the value returned is truthy.
   *
   *     expect(1).to.satisfy(function(num) {
   *       return num > 0;
   *     });
   *
   * Add `.not` earlier in the chain to negate `.satisfy`.
   *
   *     expect(1).to.not.satisfy(function(num) {
   *       return num > 2;
   *     });
   *
   * `.satisfy` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect(1).to.satisfy(function(num) {
   *       return num > 2;
   *     }, 'nooo why fail??');
   *
   *     expect(1, 'nooo why fail??').to.satisfy(function(num) {
   *       return num > 2;
   *     });
   *
   * The alias `.satisfies` can be used interchangeably with `.satisfy`.
   *
   * @name satisfy
   * @alias satisfies
   * @param {Function} matcher
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function satisfy (matcher, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var result = matcher(obj);
    this.assert(
        result
      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
      , flag(this, 'negate') ? false : true
      , result
    );
  }

  Assertion.addMethod('satisfy', satisfy);
  Assertion.addMethod('satisfies', satisfy);

  /**
   * ### .closeTo(expected, delta[, msg])
   *
   * Asserts that the target is a number that's within a given +/- `delta` range
   * of the given number `expected`. However, it's often best to assert that the
   * target is equal to its expected value.
   *
   *     // Recommended
   *     expect(1.5).to.equal(1.5);
   *
   *     // Not recommended
   *     expect(1.5).to.be.closeTo(1, 0.5);
   *     expect(1.5).to.be.closeTo(2, 0.5);
   *     expect(1.5).to.be.closeTo(1, 1);
   *
   * Add `.not` earlier in the chain to negate `.closeTo`.
   *
   *     expect(1.5).to.equal(1.5); // Recommended
   *     expect(1.5).to.not.be.closeTo(3, 1); // Not recommended
   *
   * `.closeTo` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect(1.5).to.be.closeTo(3, 1, 'nooo why fail??');
   *     expect(1.5, 'nooo why fail??').to.be.closeTo(3, 1);
   *
   * The alias `.approximately` can be used interchangeably with `.closeTo`.
   *
   * @name closeTo
   * @alias approximately
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function closeTo(expected, delta, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');

    new Assertion(obj, flagMsg, ssfi, true).is.a('number');
    if (typeof expected !== 'number' || typeof delta !== 'number') {
      flagMsg = flagMsg ? flagMsg + ': ' : '';
      throw new AssertionError(
          flagMsg + 'the arguments to closeTo or approximately must be numbers',
          undefined,
          ssfi
      );
    }

    this.assert(
        Math.abs(obj - expected) <= delta
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
    );
  }

  Assertion.addMethod('closeTo', closeTo);
  Assertion.addMethod('approximately', closeTo);

  // Note: Duplicates are ignored if testing for inclusion instead of sameness.
  function isSubsetOf(subset, superset, cmp, contains, ordered) {
    if (!contains) {
      if (subset.length !== superset.length) return false;
      superset = superset.slice();
    }

    return subset.every(function(elem, idx) {
      if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];

      if (!cmp) {
        var matchIdx = superset.indexOf(elem);
        if (matchIdx === -1) return false;

        // Remove match from superset so not counted twice if duplicate in subset.
        if (!contains) superset.splice(matchIdx, 1);
        return true;
      }

      return superset.some(function(elem2, matchIdx) {
        if (!cmp(elem, elem2)) return false;

        // Remove match from superset so not counted twice if duplicate in subset.
        if (!contains) superset.splice(matchIdx, 1);
        return true;
      });
    });
  }

  /**
   * ### .members(set[, msg])
   *
   * Asserts that the target array has the same members as the given array
   * `set`.
   *
   *     expect([1, 2, 3]).to.have.members([2, 1, 3]);
   *     expect([1, 2, 2]).to.have.members([2, 1, 2]);
   *
   * By default, members are compared using strict (`===`) equality. Add `.deep`
   * earlier in the chain to use deep equality instead. See the `deep-eql`
   * project page for info on the deep equality algorithm:
   * https://github.com/chaijs/deep-eql.
   *
   *     // Target array deeply (but not strictly) has member `{a: 1}`
   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
   *
   * By default, order doesn't matter. Add `.ordered` earlier in the chain to
   * require that members appear in the same order.
   *
   *     expect([1, 2, 3]).to.have.ordered.members([1, 2, 3]);
   *     expect([1, 2, 3]).to.have.members([2, 1, 3])
   *       .but.not.ordered.members([2, 1, 3]);
   *
   * By default, both arrays must be the same size. Add `.include` earlier in
   * the chain to require that the target's members be a superset of the
   * expected members. Note that duplicates are ignored in the subset when
   * `.include` is added.
   *
   *     // Target array is a superset of [1, 2] but not identical
   *     expect([1, 2, 3]).to.include.members([1, 2]);
   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
   *
   *     // Duplicates in the subset are ignored
   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
   *
   * `.deep`, `.ordered`, and `.include` can all be combined. However, if
   * `.include` and `.ordered` are combined, the ordering begins at the start of
   * both arrays.
   *
   *     expect([{a: 1}, {b: 2}, {c: 3}])
   *       .to.include.deep.ordered.members([{a: 1}, {b: 2}])
   *       .but.not.include.deep.ordered.members([{b: 2}, {c: 3}]);
   *
   * Add `.not` earlier in the chain to negate `.members`. However, it's
   * dangerous to do so. The problem is that it creates uncertain expectations
   * by asserting that the target array doesn't have all of the same members as
   * the given array `set` but may or may not have some of them. It's often best
   * to identify the exact output that's expected, and then write an assertion
   * that only accepts that exact output.
   *
   *     expect([1, 2]).to.not.include(3).and.not.include(4); // Recommended
   *     expect([1, 2]).to.not.have.members([3, 4]); // Not recommended
   *
   * `.members` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`.
   *
   *     expect([1, 2]).to.have.members([1, 2, 3], 'nooo why fail??');
   *     expect([1, 2], 'nooo why fail??').to.have.members([1, 2, 3]);
   *
   * @name members
   * @param {Array} set
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('members', function (subset, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');

    new Assertion(obj, flagMsg, ssfi, true).to.be.an('array');
    new Assertion(subset, flagMsg, ssfi, true).to.be.an('array');

    var contains = flag(this, 'contains');
    var ordered = flag(this, 'ordered');

    var subject, failMsg, failNegateMsg;

    if (contains) {
      subject = ordered ? 'an ordered superset' : 'a superset';
      failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
      failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
    } else {
      subject = ordered ? 'ordered members' : 'members';
      failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
      failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
    }

    var cmp = flag(this, 'deep') ? _.eql : undefined;

    this.assert(
        isSubsetOf(subset, obj, cmp, contains, ordered)
      , failMsg
      , failNegateMsg
      , subset
      , obj
      , true
    );
  });

  /**
   * ### .oneOf(list[, msg])
   *
   * Asserts that the target is a member of the given array `list`. However,
   * it's often best to assert that the target is equal to its expected value.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.be.oneOf([1, 2, 3]); // Not recommended
   *
   * Comparisons are performed using strict (`===`) equality.
   *
   * Add `.not` earlier in the chain to negate `.oneOf`.
   *
   *     expect(1).to.equal(1); // Recommended
   *     expect(1).to.not.be.oneOf([2, 3, 4]); // Not recommended
   *
   * `.oneOf` accepts an optional `msg` argument which is a custom error message
   * to show when the assertion fails. The message can also be given as the
   * second argument to `expect`.
   *
   *     expect(1).to.be.oneOf([2, 3, 4], 'nooo why fail??');
   *     expect(1, 'nooo why fail??').to.be.oneOf([2, 3, 4]);
   *
   * @name oneOf
   * @param {Array<*>} list
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function oneOf (list, msg) {
    if (msg) flag(this, 'message', msg);
    var expected = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');
    new Assertion(list, flagMsg, ssfi, true).to.be.an('array');

    this.assert(
        list.indexOf(expected) > -1
      , 'expected #{this} to be one of #{exp}'
      , 'expected #{this} to not be one of #{exp}'
      , list
      , expected
    );
  }

  Assertion.addMethod('oneOf', oneOf);

  /**
   * ### .change(subject[, prop[, msg]])
   *
   * When one argument is provided, `.change` asserts that the given function
   * `subject` returns a different value when it's invoked before the target
   * function compared to when it's invoked afterward. However, it's often best
   * to assert that `subject` is equal to its expected value.
   *
   *     var dots = ''
   *       , addDot = function () { dots += '.'; }
   *       , getDots = function () { return dots; };
   *
   *     // Recommended
   *     expect(getDots()).to.equal('');
   *     addDot();
   *     expect(getDots()).to.equal('.');
   *
   *     // Not recommended
   *     expect(addDot).to.change(getDots);
   *
   * When two arguments are provided, `.change` asserts that the value of the
   * given object `subject`'s `prop` property is different before invoking the
   * target function compared to afterward.
   *
   *     var myObj = {dots: ''}
   *       , addDot = function () { myObj.dots += '.'; };
   *
   *     // Recommended
   *     expect(myObj).to.have.property('dots', '');
   *     addDot();
   *     expect(myObj).to.have.property('dots', '.');
   *
   *     // Not recommended
   *     expect(addDot).to.change(myObj, 'dots');
   *
   * Strict (`===`) equality is used to compare before and after values.
   *
   * Add `.not` earlier in the chain to negate `.change`.
   *
   *     var dots = ''
   *       , noop = function () {}
   *       , getDots = function () { return dots; };
   *
   *     expect(noop).to.not.change(getDots);
   *
   *     var myObj = {dots: ''}
   *       , noop = function () {};
   *
   *     expect(noop).to.not.change(myObj, 'dots');
   *
   * `.change` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`. When not providing two arguments, always
   * use the second form.
   *
   *     var myObj = {dots: ''}
   *       , addDot = function () { myObj.dots += '.'; };
   *
   *     expect(addDot).to.not.change(myObj, 'dots', 'nooo why fail??');
   *
   *     var dots = ''
   *       , addDot = function () { dots += '.'; }
   *       , getDots = function () { return dots; };
   *
   *     expect(addDot, 'nooo why fail??').to.not.change(getDots);
   *
   * `.change` also causes all `.by` assertions that follow in the chain to
   * assert how much a numeric subject was increased or decreased by. However,
   * it's dangerous to use `.change.by`. The problem is that it creates
   * uncertain expectations by asserting that the subject either increases by
   * the given delta, or that it decreases by the given delta. It's often best
   * to identify the exact output that's expected, and then write an assertion
   * that only accepts that exact output.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; }
   *       , subtractTwo = function () { myObj.val -= 2; };
   *
   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
   *
   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
   *
   * The alias `.changes` can be used interchangeably with `.change`.
   *
   * @name change
   * @alias changes
   * @param {String} subject
   * @param {String} prop name _optional_
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertChanges (subject, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');
    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

    var initial;
    if (!prop) {
      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
      initial = subject();
    } else {
      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
      initial = subject[prop];
    }

    fn();

    var final = prop === undefined || prop === null ? subject() : subject[prop];
    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

    // This gets flagged because of the .by(delta) assertion
    flag(this, 'deltaMsgObj', msgObj);
    flag(this, 'initialDeltaValue', initial);
    flag(this, 'finalDeltaValue', final);
    flag(this, 'deltaBehavior', 'change');
    flag(this, 'realDelta', final !== initial);

    this.assert(
      initial !== final
      , 'expected ' + msgObj + ' to change'
      , 'expected ' + msgObj + ' to not change'
    );
  }

  Assertion.addMethod('change', assertChanges);
  Assertion.addMethod('changes', assertChanges);

  /**
   * ### .increase(subject[, prop[, msg]])
   *
   * When one argument is provided, `.increase` asserts that the given function
   * `subject` returns a greater number when it's invoked after invoking the
   * target function compared to when it's invoked beforehand. `.increase` also
   * causes all `.by` assertions that follow in the chain to assert how much
   * greater of a number is returned. It's often best to assert that the return
   * value increased by the expected amount, rather than asserting it increased
   * by any amount.
   *
   *     var val = 1
   *       , addTwo = function () { val += 2; }
   *       , getVal = function () { return val; };
   *
   *     expect(addTwo).to.increase(getVal).by(2); // Recommended
   *     expect(addTwo).to.increase(getVal); // Not recommended
   *
   * When two arguments are provided, `.increase` asserts that the value of the
   * given object `subject`'s `prop` property is greater after invoking the
   * target function compared to beforehand.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; };
   *
   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
   *     expect(addTwo).to.increase(myObj, 'val'); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.increase`. However, it's
   * dangerous to do so. The problem is that it creates uncertain expectations
   * by asserting that the subject either decreases, or that it stays the same.
   * It's often best to identify the exact output that's expected, and then
   * write an assertion that only accepts that exact output.
   *
   * When the subject is expected to decrease, it's often best to assert that it
   * decreased by the expected amount.
   *
   *     var myObj = {val: 1}
   *       , subtractTwo = function () { myObj.val -= 2; };
   *
   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
   *     expect(subtractTwo).to.not.increase(myObj, 'val'); // Not recommended
   *
   * When the subject is expected to stay the same, it's often best to assert
   * exactly that.
   *
   *     var myObj = {val: 1}
   *       , noop = function () {};
   *
   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
   *     expect(noop).to.not.increase(myObj, 'val'); // Not recommended
   *
   * `.increase` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`. When not providing two arguments, always
   * use the second form.
   *
   *     var myObj = {val: 1}
   *       , noop = function () {};
   *
   *     expect(noop).to.increase(myObj, 'val', 'nooo why fail??');
   *
   *     var val = 1
   *       , noop = function () {}
   *       , getVal = function () { return val; };
   *
   *     expect(noop, 'nooo why fail??').to.increase(getVal);
   *
   * The alias `.increases` can be used interchangeably with `.increase`.
   *
   * @name increase
   * @alias increases
   * @param {String|Function} subject
   * @param {String} prop name _optional_
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertIncreases (subject, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');
    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

    var initial;
    if (!prop) {
      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
      initial = subject();
    } else {
      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
      initial = subject[prop];
    }

    // Make sure that the target is a number
    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

    fn();

    var final = prop === undefined || prop === null ? subject() : subject[prop];
    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

    flag(this, 'deltaMsgObj', msgObj);
    flag(this, 'initialDeltaValue', initial);
    flag(this, 'finalDeltaValue', final);
    flag(this, 'deltaBehavior', 'increase');
    flag(this, 'realDelta', final - initial);

    this.assert(
      final - initial > 0
      , 'expected ' + msgObj + ' to increase'
      , 'expected ' + msgObj + ' to not increase'
    );
  }

  Assertion.addMethod('increase', assertIncreases);
  Assertion.addMethod('increases', assertIncreases);

  /**
   * ### .decrease(subject[, prop[, msg]])
   *
   * When one argument is provided, `.decrease` asserts that the given function
   * `subject` returns a lesser number when it's invoked after invoking the
   * target function compared to when it's invoked beforehand. `.decrease` also
   * causes all `.by` assertions that follow in the chain to assert how much
   * lesser of a number is returned. It's often best to assert that the return
   * value decreased by the expected amount, rather than asserting it decreased
   * by any amount.
   *
   *     var val = 1
   *       , subtractTwo = function () { val -= 2; }
   *       , getVal = function () { return val; };
   *
   *     expect(subtractTwo).to.decrease(getVal).by(2); // Recommended
   *     expect(subtractTwo).to.decrease(getVal); // Not recommended
   *
   * When two arguments are provided, `.decrease` asserts that the value of the
   * given object `subject`'s `prop` property is lesser after invoking the
   * target function compared to beforehand.
   *
   *     var myObj = {val: 1}
   *       , subtractTwo = function () { myObj.val -= 2; };
   *
   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
   *     expect(subtractTwo).to.decrease(myObj, 'val'); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.decrease`. However, it's
   * dangerous to do so. The problem is that it creates uncertain expectations
   * by asserting that the subject either increases, or that it stays the same.
   * It's often best to identify the exact output that's expected, and then
   * write an assertion that only accepts that exact output.
   *
   * When the subject is expected to increase, it's often best to assert that it
   * increased by the expected amount.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; };
   *
   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
   *     expect(addTwo).to.not.decrease(myObj, 'val'); // Not recommended
   *
   * When the subject is expected to stay the same, it's often best to assert
   * exactly that.
   *
   *     var myObj = {val: 1}
   *       , noop = function () {};
   *
   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
   *     expect(noop).to.not.decrease(myObj, 'val'); // Not recommended
   *
   * `.decrease` accepts an optional `msg` argument which is a custom error
   * message to show when the assertion fails. The message can also be given as
   * the second argument to `expect`. When not providing two arguments, always
   * use the second form.
   *
   *     var myObj = {val: 1}
   *       , noop = function () {};
   *
   *     expect(noop).to.decrease(myObj, 'val', 'nooo why fail??');
   *
   *     var val = 1
   *       , noop = function () {}
   *       , getVal = function () { return val; };
   *
   *     expect(noop, 'nooo why fail??').to.decrease(getVal);
   *
   * The alias `.decreases` can be used interchangeably with `.decrease`.
   *
   * @name decrease
   * @alias decreases
   * @param {String|Function} subject
   * @param {String} prop name _optional_
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertDecreases (subject, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object')
      , flagMsg = flag(this, 'message')
      , ssfi = flag(this, 'ssfi');
    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

    var initial;
    if (!prop) {
      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
      initial = subject();
    } else {
      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
      initial = subject[prop];
    }

    // Make sure that the target is a number
    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

    fn();

    var final = prop === undefined || prop === null ? subject() : subject[prop];
    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

    flag(this, 'deltaMsgObj', msgObj);
    flag(this, 'initialDeltaValue', initial);
    flag(this, 'finalDeltaValue', final);
    flag(this, 'deltaBehavior', 'decrease');
    flag(this, 'realDelta', initial - final);

    this.assert(
      final - initial < 0
      , 'expected ' + msgObj + ' to decrease'
      , 'expected ' + msgObj + ' to not decrease'
    );
  }

  Assertion.addMethod('decrease', assertDecreases);
  Assertion.addMethod('decreases', assertDecreases);

  /**
   * ### .by(delta[, msg])
   *
   * When following an `.increase` assertion in the chain, `.by` asserts that
   * the subject of the `.increase` assertion increased by the given `delta`.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; };
   *
   *     expect(addTwo).to.increase(myObj, 'val').by(2);
   *
   * When following a `.decrease` assertion in the chain, `.by` asserts that the
   * subject of the `.decrease` assertion decreased by the given `delta`.
   *
   *     var myObj = {val: 1}
   *       , subtractTwo = function () { myObj.val -= 2; };
   *
   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2);
   *
   * When following a `.change` assertion in the chain, `.by` asserts that the
   * subject of the `.change` assertion either increased or decreased by the
   * given `delta`. However, it's dangerous to use `.change.by`. The problem is
   * that it creates uncertain expectations. It's often best to identify the
   * exact output that's expected, and then write an assertion that only accepts
   * that exact output.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; }
   *       , subtractTwo = function () { myObj.val -= 2; };
   *
   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
   *
   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
   *
   * Add `.not` earlier in the chain to negate `.by`. However, it's often best
   * to assert that the subject changed by its expected delta, rather than
   * asserting that it didn't change by one of countless unexpected deltas.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; };
   *
   *     // Recommended
   *     expect(addTwo).to.increase(myObj, 'val').by(2);
   *
   *     // Not recommended
   *     expect(addTwo).to.increase(myObj, 'val').but.not.by(3);
   *
   * `.by` accepts an optional `msg` argument which is a custom error message to
   * show when the assertion fails. The message can also be given as the second
   * argument to `expect`.
   *
   *     var myObj = {val: 1}
   *       , addTwo = function () { myObj.val += 2; };
   *
   *     expect(addTwo).to.increase(myObj, 'val').by(3, 'nooo why fail??');
   *     expect(addTwo, 'nooo why fail??').to.increase(myObj, 'val').by(3);
   *
   * @name by
   * @param {Number} delta
   * @param {String} msg _optional_
   * @namespace BDD
   * @api public
   */

  function assertDelta(delta, msg) {
    if (msg) flag(this, 'message', msg);

    var msgObj = flag(this, 'deltaMsgObj');
    var initial = flag(this, 'initialDeltaValue');
    var final = flag(this, 'finalDeltaValue');
    var behavior = flag(this, 'deltaBehavior');
    var realDelta = flag(this, 'realDelta');

    var expression;
    if (behavior === 'change') {
      expression = Math.abs(final - initial) === Math.abs(delta);
    } else {
      expression = realDelta === Math.abs(delta);
    }

    this.assert(
      expression
      , 'expected ' + msgObj + ' to ' + behavior + ' by ' + delta
      , 'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta
    );
  }

  Assertion.addMethod('by', assertDelta);

  /**
   * ### .extensible
   *
   * Asserts that the target is extensible, which means that new properties can
   * be added to it. Primitives are never extensible.
   *
   *     expect({a: 1}).to.be.extensible;
   *
   * Add `.not` earlier in the chain to negate `.extensible`.
   *
   *     var nonExtensibleObject = Object.preventExtensions({})
   *       , sealedObject = Object.seal({})
   *       , frozenObject = Object.freeze({});
   *
   *     expect(nonExtensibleObject).to.not.be.extensible;
   *     expect(sealedObject).to.not.be.extensible;
   *     expect(frozenObject).to.not.be.extensible;
   *     expect(1).to.not.be.extensible;
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect(1, 'nooo why fail??').to.be.extensible;
   *
   * @name extensible
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('extensible', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
    // The following provides ES6 behavior for ES5 environments.

    var isExtensible = obj === Object(obj) && Object.isExtensible(obj);

    this.assert(
      isExtensible
      , 'expected #{this} to be extensible'
      , 'expected #{this} to not be extensible'
    );
  });

  /**
   * ### .sealed
   *
   * Asserts that the target is sealed, which means that new properties can't be
   * added to it, and its existing properties can't be reconfigured or deleted.
   * However, it's possible that its existing properties can still be reassigned
   * to different values. Primitives are always sealed.
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect(sealedObject).to.be.sealed;
   *     expect(frozenObject).to.be.sealed;
   *     expect(1).to.be.sealed;
   *
   * Add `.not` earlier in the chain to negate `.sealed`.
   *
   *     expect({a: 1}).to.not.be.sealed;
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect({a: 1}, 'nooo why fail??').to.be.sealed;
   *
   * @name sealed
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('sealed', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
    // The following provides ES6 behavior for ES5 environments.

    var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;

    this.assert(
      isSealed
      , 'expected #{this} to be sealed'
      , 'expected #{this} to not be sealed'
    );
  });

  /**
   * ### .frozen
   *
   * Asserts that the target is frozen, which means that new properties can't be
   * added to it, and its existing properties can't be reassigned to different
   * values, reconfigured, or deleted. Primitives are always frozen.
   *
   *     var frozenObject = Object.freeze({});
   *
   *     expect(frozenObject).to.be.frozen;
   *     expect(1).to.be.frozen;
   *
   * Add `.not` earlier in the chain to negate `.frozen`.
   *
   *     expect({a: 1}).to.not.be.frozen;
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect({a: 1}, 'nooo why fail??').to.be.frozen;
   *
   * @name frozen
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('frozen', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
    // The following provides ES6 behavior for ES5 environments.

    var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;

    this.assert(
      isFrozen
      , 'expected #{this} to be frozen'
      , 'expected #{this} to not be frozen'
    );
  });

  /**
   * ### .finite
   *
   * Asserts that the target is a number, and isn't `NaN` or positive/negative
   * `Infinity`.
   *
   *     expect(1).to.be.finite;
   *
   * Add `.not` earlier in the chain to negate `.finite`. However, it's
   * dangerous to do so. The problem is that it creates uncertain expectations
   * by asserting that the subject either isn't a number, or that it's `NaN`, or
   * that it's positive `Infinity`, or that it's negative `Infinity`. It's often
   * best to identify the exact output that's expected, and then write an
   * assertion that only accepts that exact output.
   *
   * When the target isn't expected to be a number, it's often best to assert
   * that it's the expected type, rather than asserting that it isn't one of
   * many unexpected types.
   *
   *     expect('foo').to.be.a('string'); // Recommended
   *     expect('foo').to.not.be.finite; // Not recommended
   *
   * When the target is expected to be `NaN`, it's often best to assert exactly
   * that.
   *
   *     expect(NaN).to.be.NaN; // Recommended
   *     expect(NaN).to.not.be.finite; // Not recommended
   *
   * When the target is expected to be positive infinity, it's often best to
   * assert exactly that.
   *
   *     expect(Infinity).to.equal(Infinity); // Recommended
   *     expect(Infinity).to.not.be.finite; // Not recommended
   *
   * When the target is expected to be negative infinity, it's often best to
   * assert exactly that.
   *
   *     expect(-Infinity).to.equal(-Infinity); // Recommended
   *     expect(-Infinity).to.not.be.finite; // Not recommended
   *
   * A custom error message can be given as the second argument to `expect`.
   *
   *     expect('foo', 'nooo why fail??').to.be.finite;
   *
   * @name finite
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('finite', function(msg) {
    var obj = flag(this, 'object');

    this.assert(
        typeof obj === 'number' && isFinite(obj)
      , 'expected #{this} to be a finite number'
      , 'expected #{this} to not be a finite number'
    );
  });
};

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var expect = function (chai, util) {
  chai.expect = function (val, message) {
    return new chai.Assertion(val, message);
  };

  /**
   * ### .fail([message])
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure.
   *
   *     expect.fail();
   *     expect.fail("custom error message");
   *     expect.fail(1, 2);
   *     expect.fail(1, 2, "custom error message");
   *     expect.fail(1, 2, "custom error message", ">");
   *     expect.fail(1, 2, undefined, ">");
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace BDD
   * @api public
   */

  chai.expect.fail = function (actual, expected, message, operator) {
    if (arguments.length < 2) {
        message = actual;
        actual = undefined;
    }

    message = message || 'expect.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, chai.expect.fail);
  };
};

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var should = function (chai, util) {
  var Assertion = chai.Assertion;

  function loadShould () {
    // explicitly define this method as function as to have it's name to include as `ssfi`
    function shouldGetter() {
      if (this instanceof String
          || this instanceof Number
          || this instanceof Boolean
          || typeof Symbol === 'function' && this instanceof Symbol) {
        return new Assertion(this.valueOf(), null, shouldGetter);
      }
      return new Assertion(this, null, shouldGetter);
    }
    function shouldSetter(value) {
      // See https://github.com/chaijs/chai/issues/86: this makes
      // `whatever.should = someValue` actually set `someValue`, which is
      // especially useful for `global.should = require('chai').should()`.
      //
      // Note that we have to use [[DefineProperty]] instead of [[Put]]
      // since otherwise we would trigger this very setter!
      Object.defineProperty(this, 'should', {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    // modify Object.prototype to have `should`
    Object.defineProperty(Object.prototype, 'should', {
      set: shouldSetter
      , get: shouldGetter
      , configurable: true
    });

    var should = {};

    /**
     * ### .fail([message])
     * ### .fail(actual, expected, [message], [operator])
     *
     * Throw a failure.
     *
     *     should.fail();
     *     should.fail("custom error message");
     *     should.fail(1, 2);
     *     should.fail(1, 2, "custom error message");
     *     should.fail(1, 2, "custom error message", ">");
     *     should.fail(1, 2, undefined, ">");
     *
     *
     * @name fail
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @param {String} operator
     * @namespace BDD
     * @api public
     */

    should.fail = function (actual, expected, message, operator) {
      if (arguments.length < 2) {
          message = actual;
          actual = undefined;
      }

      message = message || 'should.fail()';
      throw new chai.AssertionError(message, {
          actual: actual
        , expected: expected
        , operator: operator
      }, should.fail);
    };

    /**
     * ### .equal(actual, expected, [message])
     *
     * Asserts non-strict equality (`==`) of `actual` and `expected`.
     *
     *     should.equal(3, '3', '== coerces values to strings');
     *
     * @name equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
     *
     * Asserts that `function` will throw an error that is an instance of
     * `constructor`, or alternately that it will throw an error with message
     * matching `regexp`.
     *
     *     should.throw(fn, 'function throws a reference error');
     *     should.throw(fn, /function throws a reference error/);
     *     should.throw(fn, ReferenceError);
     *     should.throw(fn, ReferenceError, 'function throws a reference error');
     *     should.throw(fn, ReferenceError, /function throws a reference error/);
     *
     * @name throw
     * @alias Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.Throw(errt, errs);
    };

    /**
     * ### .exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var foo = 'hi';
     *
     *     should.exist(foo, 'foo exists');
     *
     * @name exist
     * @namespace Should
     * @api public
     */

    should.exist = function (val, msg) {
      new Assertion(val, msg).to.exist;
    };

    // negation
    should.not = {};

    /**
     * ### .not.equal(actual, expected, [message])
     *
     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
     *
     *     should.not.equal(3, 4, 'these numbers are not equal');
     *
     * @name not.equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.not.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.not.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/regexp], [message])
     *
     * Asserts that `function` will _not_ throw an error that is an instance of
     * `constructor`, or alternately that it will not throw an error with message
     * matching `regexp`.
     *
     *     should.not.throw(fn, Error, 'function does not throw');
     *
     * @name not.throw
     * @alias not.Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.not.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.not.Throw(errt, errs);
    };

    /**
     * ### .not.exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var bar = null;
     *
     *     should.not.exist(bar, 'bar does not exist');
     *
     * @name not.exist
     * @namespace Should
     * @api public
     */

    should.not.exist = function (val, msg) {
      new Assertion(val, msg).to.not.exist;
    };

    should['throw'] = should['Throw'];
    should.not['throw'] = should.not['Throw'];

    return should;
  }
  chai.should = loadShould;
  chai.Should = loadShould;
};

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var assert$1 = function (chai, util) {
  /*!
   * Chai dependencies.
   */

  var Assertion = chai.Assertion
    , flag = util.flag;

  /*!
   * Module export.
   */

  /**
   * ### assert(expression, message)
   *
   * Write your own test expressions.
   *
   *     assert('foo' !== 'bar', 'foo is not bar');
   *     assert(Array.isArray([]), 'empty arrays are arrays');
   *
   * @param {Mixed} expression to test for truthiness
   * @param {String} message to display on error
   * @name assert
   * @namespace Assert
   * @api public
   */

  var assert = chai.assert = function (express, errmsg) {
    var test = new Assertion(null, null, chai.assert, true);
    test.assert(
        express
      , errmsg
      , '[ negation message unavailable ]'
    );
  };

  /**
   * ### .fail([message])
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure. Node.js `assert` module-compatible.
   *
   *     assert.fail();
   *     assert.fail("custom error message");
   *     assert.fail(1, 2);
   *     assert.fail(1, 2, "custom error message");
   *     assert.fail(1, 2, "custom error message", ">");
   *     assert.fail(1, 2, undefined, ">");
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Assert
   * @api public
   */

  assert.fail = function (actual, expected, message, operator) {
    if (arguments.length < 2) {
        // Comply with Node's fail([message]) interface

        message = actual;
        actual = undefined;
    }

    message = message || 'assert.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, assert.fail);
  };

  /**
   * ### .isOk(object, [message])
   *
   * Asserts that `object` is truthy.
   *
   *     assert.isOk('everything', 'everything is ok');
   *     assert.isOk(false, 'this will fail');
   *
   * @name isOk
   * @alias ok
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isOk = function (val, msg) {
    new Assertion(val, msg, assert.isOk, true).is.ok;
  };

  /**
   * ### .isNotOk(object, [message])
   *
   * Asserts that `object` is falsy.
   *
   *     assert.isNotOk('everything', 'this will fail');
   *     assert.isNotOk(false, 'this will pass');
   *
   * @name isNotOk
   * @alias notOk
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotOk = function (val, msg) {
    new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
  };

  /**
   * ### .equal(actual, expected, [message])
   *
   * Asserts non-strict equality (`==`) of `actual` and `expected`.
   *
   *     assert.equal(3, '3', '== coerces values to strings');
   *
   * @name equal
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.equal = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.equal, true);

    test.assert(
        exp == flag(test, 'object')
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{act}'
      , exp
      , act
      , true
    );
  };

  /**
   * ### .notEqual(actual, expected, [message])
   *
   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
   *
   *     assert.notEqual(3, 4, 'these numbers are not equal');
   *
   * @name notEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notEqual = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.notEqual, true);

    test.assert(
        exp != flag(test, 'object')
      , 'expected #{this} to not equal #{exp}'
      , 'expected #{this} to equal #{act}'
      , exp
      , act
      , true
    );
  };

  /**
   * ### .strictEqual(actual, expected, [message])
   *
   * Asserts strict equality (`===`) of `actual` and `expected`.
   *
   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
   *
   * @name strictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
  };

  /**
   * ### .notStrictEqual(actual, expected, [message])
   *
   * Asserts strict inequality (`!==`) of `actual` and `expected`.
   *
   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
   *
   * @name notStrictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
  };

  /**
   * ### .deepEqual(actual, expected, [message])
   *
   * Asserts that `actual` is deeply equal to `expected`.
   *
   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
   *
   * @name deepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @alias deepStrictEqual
   * @namespace Assert
   * @api public
   */

  assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
  };

  /**
   * ### .notDeepEqual(actual, expected, [message])
   *
   * Assert that `actual` is not deeply equal to `expected`.
   *
   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
   *
   * @name notDeepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
  };

   /**
   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
   *
   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`.
   *
   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
   *
   * @name isAbove
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAbove
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAbove = function (val, abv, msg) {
    new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
  };

   /**
   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
   *
   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`.
   *
   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
   *
   * @name isAtLeast
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtLeast
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtLeast = function (val, atlst, msg) {
    new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
  };

   /**
   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
   *
   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`.
   *
   *     assert.isBelow(3, 6, '3 is strictly less than 6');
   *
   * @name isBelow
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeBelow
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBelow = function (val, blw, msg) {
    new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
  };

   /**
   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
   *
   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`.
   *
   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
   *
   * @name isAtMost
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtMost
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtMost = function (val, atmst, msg) {
    new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
  };

  /**
   * ### .isTrue(value, [message])
   *
   * Asserts that `value` is true.
   *
   *     var teaServed = true;
   *     assert.isTrue(teaServed, 'the tea has been served');
   *
   * @name isTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isTrue = function (val, msg) {
    new Assertion(val, msg, assert.isTrue, true).is['true'];
  };

  /**
   * ### .isNotTrue(value, [message])
   *
   * Asserts that `value` is not true.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotTrue(tea, 'great, time for tea!');
   *
   * @name isNotTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotTrue = function (val, msg) {
    new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
  };

  /**
   * ### .isFalse(value, [message])
   *
   * Asserts that `value` is false.
   *
   *     var teaServed = false;
   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
   *
   * @name isFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFalse = function (val, msg) {
    new Assertion(val, msg, assert.isFalse, true).is['false'];
  };

  /**
   * ### .isNotFalse(value, [message])
   *
   * Asserts that `value` is not false.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotFalse(tea, 'great, time for tea!');
   *
   * @name isNotFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFalse = function (val, msg) {
    new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
  };

  /**
   * ### .isNull(value, [message])
   *
   * Asserts that `value` is null.
   *
   *     assert.isNull(err, 'there was no error');
   *
   * @name isNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNull = function (val, msg) {
    new Assertion(val, msg, assert.isNull, true).to.equal(null);
  };

  /**
   * ### .isNotNull(value, [message])
   *
   * Asserts that `value` is not null.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotNull(tea, 'great, time for tea!');
   *
   * @name isNotNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNull = function (val, msg) {
    new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
  };

  /**
   * ### .isNaN
   *
   * Asserts that value is NaN.
   *
   *     assert.isNaN(NaN, 'NaN is NaN');
   *
   * @name isNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNaN = function (val, msg) {
    new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
  };

  /**
   * ### .isNotNaN
   *
   * Asserts that value is not NaN.
   *
   *     assert.isNotNaN(4, '4 is not NaN');
   *
   * @name isNotNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */
  assert.isNotNaN = function (val, msg) {
    new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
  };

  /**
   * ### .exists
   *
   * Asserts that the target is neither `null` nor `undefined`.
   *
   *     var foo = 'hi';
   *
   *     assert.exists(foo, 'foo is neither `null` nor `undefined`');
   *
   * @name exists
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.exists = function (val, msg) {
    new Assertion(val, msg, assert.exists, true).to.exist;
  };

  /**
   * ### .notExists
   *
   * Asserts that the target is either `null` or `undefined`.
   *
   *     var bar = null
   *       , baz;
   *
   *     assert.notExists(bar);
   *     assert.notExists(baz, 'baz is either null or undefined');
   *
   * @name notExists
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notExists = function (val, msg) {
    new Assertion(val, msg, assert.notExists, true).to.not.exist;
  };

  /**
   * ### .isUndefined(value, [message])
   *
   * Asserts that `value` is `undefined`.
   *
   *     var tea;
   *     assert.isUndefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isUndefined = function (val, msg) {
    new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
  };

  /**
   * ### .isDefined(value, [message])
   *
   * Asserts that `value` is not `undefined`.
   *
   *     var tea = 'cup of chai';
   *     assert.isDefined(tea, 'tea has been defined');
   *
   * @name isDefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isDefined = function (val, msg) {
    new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
  };

  /**
   * ### .isFunction(value, [message])
   *
   * Asserts that `value` is a function.
   *
   *     function serveTea() { return 'cup of tea'; };
   *     assert.isFunction(serveTea, 'great, we can have tea now');
   *
   * @name isFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFunction = function (val, msg) {
    new Assertion(val, msg, assert.isFunction, true).to.be.a('function');
  };

  /**
   * ### .isNotFunction(value, [message])
   *
   * Asserts that `value` is _not_ a function.
   *
   *     var serveTea = [ 'heat', 'pour', 'sip' ];
   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
   *
   * @name isNotFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFunction = function (val, msg) {
    new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a('function');
  };

  /**
   * ### .isObject(value, [message])
   *
   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
   * _The assertion does not match subclassed objects._
   *
   *     var selection = { name: 'Chai', serve: 'with spices' };
   *     assert.isObject(selection, 'tea selection is an object');
   *
   * @name isObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isObject = function (val, msg) {
    new Assertion(val, msg, assert.isObject, true).to.be.a('object');
  };

  /**
   * ### .isNotObject(value, [message])
   *
   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
   *
   *     var selection = 'chai'
   *     assert.isNotObject(selection, 'tea selection is not an object');
   *     assert.isNotObject(null, 'null is not an object');
   *
   * @name isNotObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotObject = function (val, msg) {
    new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
  };

  /**
   * ### .isArray(value, [message])
   *
   * Asserts that `value` is an array.
   *
   *     var menu = [ 'green', 'chai', 'oolong' ];
   *     assert.isArray(menu, 'what kind of tea do we want?');
   *
   * @name isArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isArray = function (val, msg) {
    new Assertion(val, msg, assert.isArray, true).to.be.an('array');
  };

  /**
   * ### .isNotArray(value, [message])
   *
   * Asserts that `value` is _not_ an array.
   *
   *     var menu = 'green|chai|oolong';
   *     assert.isNotArray(menu, 'what kind of tea do we want?');
   *
   * @name isNotArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotArray = function (val, msg) {
    new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
  };

  /**
   * ### .isString(value, [message])
   *
   * Asserts that `value` is a string.
   *
   *     var teaOrder = 'chai';
   *     assert.isString(teaOrder, 'order placed');
   *
   * @name isString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isString = function (val, msg) {
    new Assertion(val, msg, assert.isString, true).to.be.a('string');
  };

  /**
   * ### .isNotString(value, [message])
   *
   * Asserts that `value` is _not_ a string.
   *
   *     var teaOrder = 4;
   *     assert.isNotString(teaOrder, 'order placed');
   *
   * @name isNotString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotString = function (val, msg) {
    new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
  };

  /**
   * ### .isNumber(value, [message])
   *
   * Asserts that `value` is a number.
   *
   *     var cups = 2;
   *     assert.isNumber(cups, 'how many cups');
   *
   * @name isNumber
   * @param {Number} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNumber = function (val, msg) {
    new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
  };

  /**
   * ### .isNotNumber(value, [message])
   *
   * Asserts that `value` is _not_ a number.
   *
   *     var cups = '2 cups please';
   *     assert.isNotNumber(cups, 'how many cups');
   *
   * @name isNotNumber
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNumber = function (val, msg) {
    new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
  };

   /**
   * ### .isFinite(value, [message])
   *
   * Asserts that `value` is a finite number. Unlike `.isNumber`, this will fail for `NaN` and `Infinity`.
   *
   *     var cups = 2;
   *     assert.isFinite(cups, 'how many cups');
   *
   *     assert.isFinite(NaN); // throws
   *
   * @name isFinite
   * @param {Number} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFinite = function (val, msg) {
    new Assertion(val, msg, assert.isFinite, true).to.be.finite;
  };

  /**
   * ### .isBoolean(value, [message])
   *
   * Asserts that `value` is a boolean.
   *
   *     var teaReady = true
   *       , teaServed = false;
   *
   *     assert.isBoolean(teaReady, 'is the tea ready');
   *     assert.isBoolean(teaServed, 'has tea been served');
   *
   * @name isBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBoolean = function (val, msg) {
    new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
  };

  /**
   * ### .isNotBoolean(value, [message])
   *
   * Asserts that `value` is _not_ a boolean.
   *
   *     var teaReady = 'yep'
   *       , teaServed = 'nope';
   *
   *     assert.isNotBoolean(teaReady, 'is the tea ready');
   *     assert.isNotBoolean(teaServed, 'has tea been served');
   *
   * @name isNotBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotBoolean = function (val, msg) {
    new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
  };

  /**
   * ### .typeOf(value, name, [message])
   *
   * Asserts that `value`'s type is `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
   *     assert.typeOf('tea', 'string', 'we have a string');
   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
   *     assert.typeOf(null, 'null', 'we have a null');
   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
   *
   * @name typeOf
   * @param {Mixed} value
   * @param {String} name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.typeOf = function (val, type, msg) {
    new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
  };

  /**
   * ### .notTypeOf(value, name, [message])
   *
   * Asserts that `value`'s type is _not_ `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
   *
   * @name notTypeOf
   * @param {Mixed} value
   * @param {String} typeof name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notTypeOf = function (val, type, msg) {
    new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
  };

  /**
   * ### .instanceOf(object, constructor, [message])
   *
   * Asserts that `value` is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new Tea('chai');
   *
   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
   *
   * @name instanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.instanceOf = function (val, type, msg) {
    new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
  };

  /**
   * ### .notInstanceOf(object, constructor, [message])
   *
   * Asserts `value` is not an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new String('chai');
   *
   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
   *
   * @name notInstanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInstanceOf = function (val, type, msg) {
    new Assertion(val, msg, assert.notInstanceOf, true)
      .to.not.be.instanceOf(type);
  };

  /**
   * ### .include(haystack, needle, [message])
   *
   * Asserts that `haystack` includes `needle`. Can be used to assert the
   * inclusion of a value in an array, a substring in a string, or a subset of
   * properties in an object.
   *
   *     assert.include([1,2,3], 2, 'array contains value');
   *     assert.include('foobar', 'foo', 'string contains substring');
   *     assert.include({ foo: 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property');
   *
   * Strict equality (===) is used. When asserting the inclusion of a value in
   * an array, the array is searched for an element that's strictly equal to the
   * given value. When asserting a subset of properties in an object, the object
   * is searched for the given property keys, checking that each one is present
   * and strictly equal to the given property value. For instance:
   *
   *     var obj1 = {a: 1}
   *       , obj2 = {b: 2};
   *     assert.include([obj1, obj2], obj1);
   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1});
   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1, bar: obj2});
   *
   * @name include
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.include = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.include, true).include(inc);
  };

  /**
   * ### .notInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` does not include `needle`. Can be used to assert
   * the absence of a value in an array, a substring in a string, or a subset of
   * properties in an object.
   *
   *     assert.notInclude([1,2,3], 4, "array doesn't contain value");
   *     assert.notInclude('foobar', 'baz', "string doesn't contain substring");
   *     assert.notInclude({ foo: 'bar', hello: 'universe' }, { foo: 'baz' }, 'object doesn't contain property');
   *
   * Strict equality (===) is used. When asserting the absence of a value in an
   * array, the array is searched to confirm the absence of an element that's
   * strictly equal to the given value. When asserting a subset of properties in
   * an object, the object is searched to confirm that at least one of the given
   * property keys is either not present or not strictly equal to the given
   * property value. For instance:
   *
   *     var obj1 = {a: 1}
   *       , obj2 = {b: 2};
   *     assert.notInclude([obj1, obj2], {a: 1});
   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: obj1, bar: {b: 2}});
   *
   * @name notInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
  };

  /**
   * ### .deepInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` includes `needle`. Can be used to assert the
   * inclusion of a value in an array or a subset of properties in an object.
   * Deep equality is used.
   *
   *     var obj1 = {a: 1}
   *       , obj2 = {b: 2};
   *     assert.deepInclude([obj1, obj2], {a: 1});
   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 2}});
   *
   * @name deepInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
  };

  /**
   * ### .notDeepInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` does not include `needle`. Can be used to assert
   * the absence of a value in an array or a subset of properties in an object.
   * Deep equality is used.
   *
   *     var obj1 = {a: 1}
   *       , obj2 = {b: 2};
   *     assert.notDeepInclude([obj1, obj2], {a: 9});
   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 9}});
   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 9}});
   *
   * @name notDeepInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
  };

  /**
   * ### .nestedInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' includes 'needle'.
   * Can be used to assert the inclusion of a subset of properties in an
   * object.
   * Enables the use of dot- and bracket-notation for referencing nested
   * properties.
   * '[]' and '.' in property names can be escaped using double backslashes.
   *
   *     assert.nestedInclude({'.a': {'b': 'x'}}, {'\\.a.[b]': 'x'});
   *     assert.nestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'x'});
   *
   * @name nestedInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.nestedInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
  };

  /**
   * ### .notNestedInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' does not include 'needle'.
   * Can be used to assert the absence of a subset of properties in an
   * object.
   * Enables the use of dot- and bracket-notation for referencing nested
   * properties.
   * '[]' and '.' in property names can be escaped using double backslashes.
   *
   *     assert.notNestedInclude({'.a': {'b': 'x'}}, {'\\.a.b': 'y'});
   *     assert.notNestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'y'});
   *
   * @name notNestedInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notNestedInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notNestedInclude, true)
      .not.nested.include(inc);
  };

  /**
   * ### .deepNestedInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' includes 'needle'.
   * Can be used to assert the inclusion of a subset of properties in an
   * object while checking for deep equality.
   * Enables the use of dot- and bracket-notation for referencing nested
   * properties.
   * '[]' and '.' in property names can be escaped using double backslashes.
   *
   *     assert.deepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {x: 1}});
   *     assert.deepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {x: 1}});
   *
   * @name deepNestedInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepNestedInclude = function(exp, inc, msg) {
    new Assertion(exp, msg, assert.deepNestedInclude, true)
      .deep.nested.include(inc);
  };

  /**
   * ### .notDeepNestedInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' does not include 'needle'.
   * Can be used to assert the absence of a subset of properties in an
   * object while checking for deep equality.
   * Enables the use of dot- and bracket-notation for referencing nested
   * properties.
   * '[]' and '.' in property names can be escaped using double backslashes.
   *
   *     assert.notDeepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {y: 1}})
   *     assert.notDeepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {y: 2}});
   *
   * @name notDeepNestedInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepNestedInclude = function(exp, inc, msg) {
    new Assertion(exp, msg, assert.notDeepNestedInclude, true)
      .not.deep.nested.include(inc);
  };

  /**
   * ### .ownInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' includes 'needle'.
   * Can be used to assert the inclusion of a subset of properties in an
   * object while ignoring inherited properties.
   *
   *     assert.ownInclude({ a: 1 }, { a: 1 });
   *
   * @name ownInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.ownInclude = function(exp, inc, msg) {
    new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
  };

  /**
   * ### .notOwnInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' includes 'needle'.
   * Can be used to assert the absence of a subset of properties in an
   * object while ignoring inherited properties.
   *
   *     Object.prototype.b = 2;
   *
   *     assert.notOwnInclude({ a: 1 }, { b: 2 });
   *
   * @name notOwnInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notOwnInclude = function(exp, inc, msg) {
    new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
  };

  /**
   * ### .deepOwnInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' includes 'needle'.
   * Can be used to assert the inclusion of a subset of properties in an
   * object while ignoring inherited properties and checking for deep equality.
   *
   *      assert.deepOwnInclude({a: {b: 2}}, {a: {b: 2}});
   *
   * @name deepOwnInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepOwnInclude = function(exp, inc, msg) {
    new Assertion(exp, msg, assert.deepOwnInclude, true)
      .deep.own.include(inc);
  };

   /**
   * ### .notDeepOwnInclude(haystack, needle, [message])
   *
   * Asserts that 'haystack' includes 'needle'.
   * Can be used to assert the absence of a subset of properties in an
   * object while ignoring inherited properties and checking for deep equality.
   *
   *      assert.notDeepOwnInclude({a: {b: 2}}, {a: {c: 3}});
   *
   * @name notDeepOwnInclude
   * @param {Object} haystack
   * @param {Object} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepOwnInclude = function(exp, inc, msg) {
    new Assertion(exp, msg, assert.notDeepOwnInclude, true)
      .not.deep.own.include(inc);
  };

  /**
   * ### .match(value, regexp, [message])
   *
   * Asserts that `value` matches the regular expression `regexp`.
   *
   *     assert.match('foobar', /^foo/, 'regexp matches');
   *
   * @name match
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.match = function (exp, re, msg) {
    new Assertion(exp, msg, assert.match, true).to.match(re);
  };

  /**
   * ### .notMatch(value, regexp, [message])
   *
   * Asserts that `value` does not match the regular expression `regexp`.
   *
   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
   *
   * @name notMatch
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notMatch = function (exp, re, msg) {
    new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
  };

  /**
   * ### .property(object, property, [message])
   *
   * Asserts that `object` has a direct or inherited property named by
   * `property`.
   *
   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
   *     assert.property({ tea: { green: 'matcha' }}, 'toString');
   *
   * @name property
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.property = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.property, true).to.have.property(prop);
  };

  /**
   * ### .notProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a direct or inherited property named
   * by `property`.
   *
   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
   *
   * @name notProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.notProperty, true)
      .to.not.have.property(prop);
  };

  /**
   * ### .propertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a direct or inherited property named by
   * `property` with a value given by `value`. Uses a strict equality check
   * (===).
   *
   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
   *
   * @name propertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.propertyVal, true)
      .to.have.property(prop, val);
  };

  /**
   * ### .notPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` does _not_ have a direct or inherited property named
   * by `property` with value given by `value`. Uses a strict equality check
   * (===).
   *
   *     assert.notPropertyVal({ tea: 'is good' }, 'tea', 'is bad');
   *     assert.notPropertyVal({ tea: 'is good' }, 'coffee', 'is good');
   *
   * @name notPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notPropertyVal, true)
      .to.not.have.property(prop, val);
  };

  /**
   * ### .deepPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a direct or inherited property named by
   * `property` with a value given by `value`. Uses a deep equality check.
   *
   *     assert.deepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
   *
   * @name deepPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.deepPropertyVal, true)
      .to.have.deep.property(prop, val);
  };

  /**
   * ### .notDeepPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` does _not_ have a direct or inherited property named
   * by `property` with value given by `value`. Uses a deep equality check.
   *
   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
   *
   * @name notDeepPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notDeepPropertyVal, true)
      .to.not.have.deep.property(prop, val);
  };

  /**
   * ### .ownProperty(object, property, [message])
   *
   * Asserts that `object` has a direct property named by `property`. Inherited
   * properties aren't checked.
   *
   *     assert.ownProperty({ tea: { green: 'matcha' }}, 'tea');
   *
   * @name ownProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @api public
   */

  assert.ownProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.ownProperty, true)
      .to.have.own.property(prop);
  };

  /**
   * ### .notOwnProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a direct property named by
   * `property`. Inherited properties aren't checked.
   *
   *     assert.notOwnProperty({ tea: { green: 'matcha' }}, 'coffee');
   *     assert.notOwnProperty({}, 'toString');
   *
   * @name notOwnProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @api public
   */

  assert.notOwnProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.notOwnProperty, true)
      .to.not.have.own.property(prop);
  };

  /**
   * ### .ownPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a direct property named by `property` and a value
   * equal to the provided `value`. Uses a strict equality check (===).
   * Inherited properties aren't checked.
   *
   *     assert.ownPropertyVal({ coffee: 'is good'}, 'coffee', 'is good');
   *
   * @name ownPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.ownPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.ownPropertyVal, true)
      .to.have.own.property(prop, value);
  };

  /**
   * ### .notOwnPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` does _not_ have a direct property named by `property`
   * with a value equal to the provided `value`. Uses a strict equality check
   * (===). Inherited properties aren't checked.
   *
   *     assert.notOwnPropertyVal({ tea: 'is better'}, 'tea', 'is worse');
   *     assert.notOwnPropertyVal({}, 'toString', Object.prototype.toString);
   *
   * @name notOwnPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.notOwnPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.notOwnPropertyVal, true)
      .to.not.have.own.property(prop, value);
  };

  /**
   * ### .deepOwnPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a direct property named by `property` and a value
   * equal to the provided `value`. Uses a deep equality check. Inherited
   * properties aren't checked.
   *
   *     assert.deepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
   *
   * @name deepOwnPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.deepOwnPropertyVal, true)
      .to.have.deep.own.property(prop, value);
  };

  /**
   * ### .notDeepOwnPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` does _not_ have a direct property named by `property`
   * with a value equal to the provided `value`. Uses a deep equality check.
   * Inherited properties aren't checked.
   *
   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
   *     assert.notDeepOwnPropertyVal({}, 'toString', Object.prototype.toString);
   *
   * @name notDeepOwnPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true)
      .to.not.have.deep.own.property(prop, value);
  };

  /**
   * ### .nestedProperty(object, property, [message])
   *
   * Asserts that `object` has a direct or inherited property named by
   * `property`, which can be a string using dot- and bracket-notation for
   * nested reference.
   *
   *     assert.nestedProperty({ tea: { green: 'matcha' }}, 'tea.green');
   *
   * @name nestedProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.nestedProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.nestedProperty, true)
      .to.have.nested.property(prop);
  };

  /**
   * ### .notNestedProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`, which
   * can be a string using dot- and bracket-notation for nested reference. The
   * property cannot exist on the object nor anywhere in its prototype chain.
   *
   *     assert.notNestedProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
   *
   * @name notNestedProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notNestedProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.notNestedProperty, true)
      .to.not.have.nested.property(prop);
  };

  /**
   * ### .nestedPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`. `property` can use dot- and bracket-notation for nested
   * reference. Uses a strict equality check (===).
   *
   *     assert.nestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
   *
   * @name nestedPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.nestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.nestedPropertyVal, true)
      .to.have.nested.property(prop, val);
  };

  /**
   * ### .notNestedPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property` with
   * value given by `value`. `property` can use dot- and bracket-notation for
   * nested reference. Uses a strict equality check (===).
   *
   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'coffee.green', 'matcha');
   *
   * @name notNestedPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notNestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notNestedPropertyVal, true)
      .to.not.have.nested.property(prop, val);
  };

  /**
   * ### .deepNestedPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with a value given
   * by `value`. `property` can use dot- and bracket-notation for nested
   * reference. Uses a deep equality check.
   *
   *     assert.deepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yum' });
   *
   * @name deepNestedPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.deepNestedPropertyVal, true)
      .to.have.deep.nested.property(prop, val);
  };

  /**
   * ### .notDeepNestedPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property` with
   * value given by `value`. `property` can use dot- and bracket-notation for
   * nested reference. Uses a deep equality check.
   *
   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { oolong: 'yum' });
   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yuck' });
   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.black', { matcha: 'yum' });
   *
   * @name notDeepNestedPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true)
      .to.not.have.deep.nested.property(prop, val);
  };

  /**
   * ### .lengthOf(object, length, [message])
   *
   * Asserts that `object` has a `length` or `size` with the expected value.
   *
   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
   *     assert.lengthOf('foobar', 6, 'string has length of 6');
   *     assert.lengthOf(new Set([1,2,3]), 3, 'set has size of 3');
   *     assert.lengthOf(new Map([['a',1],['b',2],['c',3]]), 3, 'map has size of 3');
   *
   * @name lengthOf
   * @param {Mixed} object
   * @param {Number} length
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.lengthOf = function (exp, len, msg) {
    new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
  };

  /**
   * ### .hasAnyKeys(object, [keys], [message])
   *
   * Asserts that `object` has at least one of the `keys` provided.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'iDontExist', 'baz']);
   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, iDontExist: 99, baz: 1337});
   *     assert.hasAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
   *     assert.hasAnyKeys(new Set([{foo: 'bar'}, 'anotherKey']), [{foo: 'bar'}, 'anotherKey']);
   *
   * @name hasAnyKeys
   * @param {Mixed} object
   * @param {Array|Object} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.hasAnyKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
  };

  /**
   * ### .hasAllKeys(object, [keys], [message])
   *
   * Asserts that `object` has all and only all of the `keys` provided.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337]);
   *     assert.hasAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
   *     assert.hasAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
   *
   * @name hasAllKeys
   * @param {Mixed} object
   * @param {String[]} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.hasAllKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
  };

  /**
   * ### .containsAllKeys(object, [keys], [message])
   *
   * Asserts that `object` has all of the `keys` provided but may have more keys not listed.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'baz']);
   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, baz: 1337});
   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337});
   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}]);
   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}]);
   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
   *
   * @name containsAllKeys
   * @param {Mixed} object
   * @param {String[]} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.containsAllKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.containsAllKeys, true)
      .to.contain.all.keys(keys);
  };

  /**
   * ### .doesNotHaveAnyKeys(object, [keys], [message])
   *
   * Asserts that `object` has none of the `keys` provided.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
   *     assert.doesNotHaveAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
   *     assert.doesNotHaveAnyKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
   *
   * @name doesNotHaveAnyKeys
   * @param {Mixed} object
   * @param {String[]} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true)
      .to.not.have.any.keys(keys);
  };

  /**
   * ### .doesNotHaveAllKeys(object, [keys], [message])
   *
   * Asserts that `object` does not have at least one of the `keys` provided.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
   *     assert.doesNotHaveAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
   *     assert.doesNotHaveAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
   *
   * @name doesNotHaveAllKeys
   * @param {Mixed} object
   * @param {String[]} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.doesNotHaveAllKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAllKeys, true)
      .to.not.have.all.keys(keys);
  };

  /**
   * ### .hasAnyDeepKeys(object, [keys], [message])
   *
   * Asserts that `object` has at least one of the `keys` provided.
   * Since Sets and Maps can have objects as keys you can use this assertion to perform
   * a deep comparison.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), [{one: 'one'}, {two: 'two'}]);
   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {three: 'three'}]);
   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
   *
   * @name doesNotHaveAllKeys
   * @param {Mixed} object
   * @param {Array|Object} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.hasAnyDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAnyDeepKeys, true)
      .to.have.any.deep.keys(keys);
  };

 /**
   * ### .hasAllDeepKeys(object, [keys], [message])
   *
   * Asserts that `object` has all and only all of the `keys` provided.
   * Since Sets and Maps can have objects as keys you can use this assertion to perform
   * a deep comparison.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne']]), {one: 'one'});
   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
   *     assert.hasAllDeepKeys(new Set([{one: 'one'}]), {one: 'one'});
   *     assert.hasAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
   *
   * @name hasAllDeepKeys
   * @param {Mixed} object
   * @param {Array|Object} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.hasAllDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAllDeepKeys, true)
      .to.have.all.deep.keys(keys);
  };

 /**
   * ### .containsAllDeepKeys(object, [keys], [message])
   *
   * Asserts that `object` contains all of the `keys` provided.
   * Since Sets and Maps can have objects as keys you can use this assertion to perform
   * a deep comparison.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
   *
   * @name containsAllDeepKeys
   * @param {Mixed} object
   * @param {Array|Object} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.containsAllDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.containsAllDeepKeys, true)
      .to.contain.all.deep.keys(keys);
  };

 /**
   * ### .doesNotHaveAnyDeepKeys(object, [keys], [message])
   *
   * Asserts that `object` has none of the `keys` provided.
   * Since Sets and Maps can have objects as keys you can use this assertion to perform
   * a deep comparison.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
   *
   * @name doesNotHaveAnyDeepKeys
   * @param {Mixed} object
   * @param {Array|Object} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true)
      .to.not.have.any.deep.keys(keys);
  };

 /**
   * ### .doesNotHaveAllDeepKeys(object, [keys], [message])
   *
   * Asserts that `object` does not have at least one of the `keys` provided.
   * Since Sets and Maps can have objects as keys you can use this assertion to perform
   * a deep comparison.
   * You can also provide a single object instead of a `keys` array and its keys
   * will be used as the expected set of keys.
   *
   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {one: 'one'}]);
   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {fifty: 'fifty'}]);
   *
   * @name doesNotHaveAllDeepKeys
   * @param {Mixed} object
   * @param {Array|Object} keys
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true)
      .to.not.have.all.deep.keys(keys);
  };

 /**
   * ### .throws(fn, [errorLike/string/regexp], [string/regexp], [message])
   *
   * If `errorLike` is an `Error` constructor, asserts that `fn` will throw an error that is an
   * instance of `errorLike`.
   * If `errorLike` is an `Error` instance, asserts that the error thrown is the same
   * instance as `errorLike`.
   * If `errMsgMatcher` is provided, it also asserts that the error thrown will have a
   * message matching `errMsgMatcher`.
   *
   *     assert.throws(fn, 'Error thrown must have this msg');
   *     assert.throws(fn, /Error thrown must have a msg that matches this/);
   *     assert.throws(fn, ReferenceError);
   *     assert.throws(fn, errorInstance);
   *     assert.throws(fn, ReferenceError, 'Error thrown must be a ReferenceError and have this msg');
   *     assert.throws(fn, errorInstance, 'Error thrown must be the same errorInstance and have this msg');
   *     assert.throws(fn, ReferenceError, /Error thrown must be a ReferenceError and match this/);
   *     assert.throws(fn, errorInstance, /Error thrown must be the same errorInstance and match this/);
   *
   * @name throws
   * @alias throw
   * @alias Throw
   * @param {Function} fn
   * @param {ErrorConstructor|Error} errorLike
   * @param {RegExp|String} errMsgMatcher
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
      errMsgMatcher = errorLike;
      errorLike = null;
    }

    var assertErr = new Assertion(fn, msg, assert.throws, true)
      .to.throw(errorLike, errMsgMatcher);
    return flag(assertErr, 'object');
  };

  /**
   * ### .doesNotThrow(fn, [errorLike/string/regexp], [string/regexp], [message])
   *
   * If `errorLike` is an `Error` constructor, asserts that `fn` will _not_ throw an error that is an
   * instance of `errorLike`.
   * If `errorLike` is an `Error` instance, asserts that the error thrown is _not_ the same
   * instance as `errorLike`.
   * If `errMsgMatcher` is provided, it also asserts that the error thrown will _not_ have a
   * message matching `errMsgMatcher`.
   *
   *     assert.doesNotThrow(fn, 'Any Error thrown must not have this message');
   *     assert.doesNotThrow(fn, /Any Error thrown must not match this/);
   *     assert.doesNotThrow(fn, Error);
   *     assert.doesNotThrow(fn, errorInstance);
   *     assert.doesNotThrow(fn, Error, 'Error must not have this message');
   *     assert.doesNotThrow(fn, errorInstance, 'Error must not have this message');
   *     assert.doesNotThrow(fn, Error, /Error must not match this/);
   *     assert.doesNotThrow(fn, errorInstance, /Error must not match this/);
   *
   * @name doesNotThrow
   * @param {Function} fn
   * @param {ErrorConstructor} errorLike
   * @param {RegExp|String} errMsgMatcher
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, msg) {
    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
      errMsgMatcher = errorLike;
      errorLike = null;
    }

    new Assertion(fn, msg, assert.doesNotThrow, true)
      .to.not.throw(errorLike, errMsgMatcher);
  };

  /**
   * ### .operator(val1, operator, val2, [message])
   *
   * Compares two values using `operator`.
   *
   *     assert.operator(1, '<', 2, 'everything is ok');
   *     assert.operator(1, '>', 2, 'this will fail');
   *
   * @name operator
   * @param {Mixed} val1
   * @param {String} operator
   * @param {Mixed} val2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.operator = function (val, operator, val2, msg) {
    var ok;
    switch(operator) {
      case '==':
        ok = val == val2;
        break;
      case '===':
        ok = val === val2;
        break;
      case '>':
        ok = val > val2;
        break;
      case '>=':
        ok = val >= val2;
        break;
      case '<':
        ok = val < val2;
        break;
      case '<=':
        ok = val <= val2;
        break;
      case '!=':
        ok = val != val2;
        break;
      case '!==':
        ok = val !== val2;
        break;
      default:
        msg = msg ? msg + ': ' : msg;
        throw new chai.AssertionError(
          msg + 'Invalid operator "' + operator + '"',
          undefined,
          assert.operator
        );
    }
    var test = new Assertion(ok, msg, assert.operator, true);
    test.assert(
        true === flag(test, 'object')
      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
  };

  /**
   * ### .closeTo(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
   *
   * @name closeTo
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.closeTo = function (act, exp, delta, msg) {
    new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
  };

  /**
   * ### .approximately(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
   *
   * @name approximately
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.approximately = function (act, exp, delta, msg) {
    new Assertion(act, msg, assert.approximately, true)
      .to.be.approximately(exp, delta);
  };

  /**
   * ### .sameMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members in any order. Uses a
   * strict equality check (===).
   *
   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
   *
   * @name sameMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameMembers, true)
      .to.have.same.members(set2);
  };

  /**
   * ### .notSameMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` don't have the same members in any order.
   * Uses a strict equality check (===).
   *
   *     assert.notSameMembers([ 1, 2, 3 ], [ 5, 1, 3 ], 'not same members');
   *
   * @name notSameMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notSameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameMembers, true)
      .to.not.have.same.members(set2);
  };

  /**
   * ### .sameDeepMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members in any order. Uses a
   * deep equality check.
   *
   *     assert.sameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members');
   *
   * @name sameDeepMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameDeepMembers, true)
      .to.have.same.deep.members(set2);
  };

  /**
   * ### .notSameDeepMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` don't have the same members in any order.
   * Uses a deep equality check.
   *
   *     assert.notSameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { f: 5 }], 'not same deep members');
   *
   * @name notSameDeepMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notSameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameDeepMembers, true)
      .to.not.have.same.deep.members(set2);
  };

  /**
   * ### .sameOrderedMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members in the same order.
   * Uses a strict equality check (===).
   *
   *     assert.sameOrderedMembers([ 1, 2, 3 ], [ 1, 2, 3 ], 'same ordered members');
   *
   * @name sameOrderedMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameOrderedMembers, true)
      .to.have.same.ordered.members(set2);
  };

  /**
   * ### .notSameOrderedMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` don't have the same members in the same
   * order. Uses a strict equality check (===).
   *
   *     assert.notSameOrderedMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'not same ordered members');
   *
   * @name notSameOrderedMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notSameOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameOrderedMembers, true)
      .to.not.have.same.ordered.members(set2);
  };

  /**
   * ### .sameDeepOrderedMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members in the same order.
   * Uses a deep equality check.
   *
   * assert.sameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { c: 3 } ], 'same deep ordered members');
   *
   * @name sameDeepOrderedMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameDeepOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameDeepOrderedMembers, true)
      .to.have.same.deep.ordered.members(set2);
  };

  /**
   * ### .notSameDeepOrderedMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` don't have the same members in the same
   * order. Uses a deep equality check.
   *
   * assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { z: 5 } ], 'not same deep ordered members');
   * assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { c: 3 } ], 'not same deep ordered members');
   *
   * @name notSameDeepOrderedMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true)
      .to.not.have.same.deep.ordered.members(set2);
  };

  /**
   * ### .includeMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` in any order. Uses a
   * strict equality check (===). Duplicates are ignored.
   *
   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1, 2 ], 'include members');
   *
   * @name includeMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeMembers, true)
      .to.include.members(subset);
  };

  /**
   * ### .notIncludeMembers(superset, subset, [message])
   *
   * Asserts that `subset` isn't included in `superset` in any order. Uses a
   * strict equality check (===). Duplicates are ignored.
   *
   *     assert.notIncludeMembers([ 1, 2, 3 ], [ 5, 1 ], 'not include members');
   *
   * @name notIncludeMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notIncludeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.notIncludeMembers, true)
      .to.not.include.members(subset);
  };

  /**
   * ### .includeDeepMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` in any order. Uses a deep
   * equality check. Duplicates are ignored.
   *
   *     assert.includeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { b: 2 } ], 'include deep members');
   *
   * @name includeDeepMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeDeepMembers, true)
      .to.include.deep.members(subset);
  };

  /**
   * ### .notIncludeDeepMembers(superset, subset, [message])
   *
   * Asserts that `subset` isn't included in `superset` in any order. Uses a
   * deep equality check. Duplicates are ignored.
   *
   *     assert.notIncludeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { f: 5 } ], 'not include deep members');
   *
   * @name notIncludeDeepMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notIncludeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.notIncludeDeepMembers, true)
      .to.not.include.deep.members(subset);
  };

  /**
   * ### .includeOrderedMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` in the same order
   * beginning with the first element in `superset`. Uses a strict equality
   * check (===).
   *
   *     assert.includeOrderedMembers([ 1, 2, 3 ], [ 1, 2 ], 'include ordered members');
   *
   * @name includeOrderedMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeOrderedMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeOrderedMembers, true)
      .to.include.ordered.members(subset);
  };

  /**
   * ### .notIncludeOrderedMembers(superset, subset, [message])
   *
   * Asserts that `subset` isn't included in `superset` in the same order
   * beginning with the first element in `superset`. Uses a strict equality
   * check (===).
   *
   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 1 ], 'not include ordered members');
   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 3 ], 'not include ordered members');
   *
   * @name notIncludeOrderedMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notIncludeOrderedMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.notIncludeOrderedMembers, true)
      .to.not.include.ordered.members(subset);
  };

  /**
   * ### .includeDeepOrderedMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` in the same order
   * beginning with the first element in `superset`. Uses a deep equality
   * check.
   *
   *     assert.includeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 } ], 'include deep ordered members');
   *
   * @name includeDeepOrderedMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeDeepOrderedMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeDeepOrderedMembers, true)
      .to.include.deep.ordered.members(subset);
  };

  /**
   * ### .notIncludeDeepOrderedMembers(superset, subset, [message])
   *
   * Asserts that `subset` isn't included in `superset` in the same order
   * beginning with the first element in `superset`. Uses a deep equality
   * check.
   *
   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { f: 5 } ], 'not include deep ordered members');
   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 } ], 'not include deep ordered members');
   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { c: 3 } ], 'not include deep ordered members');
   *
   * @name notIncludeDeepOrderedMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true)
      .to.not.include.deep.ordered.members(subset);
  };

  /**
   * ### .oneOf(inList, list, [message])
   *
   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
   *
   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
   *
   * @name oneOf
   * @param {*} inList
   * @param {Array<*>} list
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.oneOf = function (inList, list, msg) {
    new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
  };

  /**
   * ### .changes(function, object, property, [message])
   *
   * Asserts that a function changes the value of a property.
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 22 };
   *     assert.changes(fn, obj, 'val');
   *
   * @name changes
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.changes = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
      msg = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
  };

   /**
   * ### .changesBy(function, object, property, delta, [message])
   *
   * Asserts that a function changes the value of a property by an amount (delta).
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val += 2 };
   *     assert.changesBy(fn, obj, 'val', 2);
   *
   * @name changesBy
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.changesBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.changesBy, true)
      .to.change(obj, prop).by(delta);
  };

   /**
   * ### .doesNotChange(function, object, property, [message])
   *
   * Asserts that a function does not change the value of a property.
   *
   *     var obj = { val: 10 };
   *     var fn = function() { console.log('foo'); };
   *     assert.doesNotChange(fn, obj, 'val');
   *
   * @name doesNotChange
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotChange = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
      msg = prop;
      prop = null;
    }

    return new Assertion(fn, msg, assert.doesNotChange, true)
      .to.not.change(obj, prop);
  };

  /**
   * ### .changesButNotBy(function, object, property, delta, [message])
   *
   * Asserts that a function does not change the value of a property or of a function's return value by an amount (delta)
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val += 10 };
   *     assert.changesButNotBy(fn, obj, 'val', 5);
   *
   * @name changesButNotBy
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.changesButNotBy, true)
      .to.change(obj, prop).but.not.by(delta);
  };

  /**
   * ### .increases(function, object, property, [message])
   *
   * Asserts that a function increases a numeric object property.
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 13 };
   *     assert.increases(fn, obj, 'val');
   *
   * @name increases
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.increases = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
      msg = prop;
      prop = null;
    }

    return new Assertion(fn, msg, assert.increases, true)
      .to.increase(obj, prop);
  };

  /**
   * ### .increasesBy(function, object, property, delta, [message])
   *
   * Asserts that a function increases a numeric object property or a function's return value by an amount (delta).
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val += 10 };
   *     assert.increasesBy(fn, obj, 'val', 10);
   *
   * @name increasesBy
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.increasesBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.increasesBy, true)
      .to.increase(obj, prop).by(delta);
  };

  /**
   * ### .doesNotIncrease(function, object, property, [message])
   *
   * Asserts that a function does not increase a numeric object property.
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 8 };
   *     assert.doesNotIncrease(fn, obj, 'val');
   *
   * @name doesNotIncrease
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotIncrease = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
      msg = prop;
      prop = null;
    }

    return new Assertion(fn, msg, assert.doesNotIncrease, true)
      .to.not.increase(obj, prop);
  };

  /**
   * ### .increasesButNotBy(function, object, property, [message])
   *
   * Asserts that a function does not increase a numeric object property or function's return value by an amount (delta).
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     assert.increasesButNotBy(fn, obj, 'val', 10);
   *
   * @name increasesButNotBy
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.increasesButNotBy, true)
      .to.increase(obj, prop).but.not.by(delta);
  };

  /**
   * ### .decreases(function, object, property, [message])
   *
   * Asserts that a function decreases a numeric object property.
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     assert.decreases(fn, obj, 'val');
   *
   * @name decreases
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.decreases = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
      msg = prop;
      prop = null;
    }

    return new Assertion(fn, msg, assert.decreases, true)
      .to.decrease(obj, prop);
  };

  /**
   * ### .decreasesBy(function, object, property, delta, [message])
   *
   * Asserts that a function decreases a numeric object property or a function's return value by an amount (delta)
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val -= 5 };
   *     assert.decreasesBy(fn, obj, 'val', 5);
   *
   * @name decreasesBy
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.decreasesBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.decreasesBy, true)
      .to.decrease(obj, prop).by(delta);
  };

  /**
   * ### .doesNotDecrease(function, object, property, [message])
   *
   * Asserts that a function does not decreases a numeric object property.
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     assert.doesNotDecrease(fn, obj, 'val');
   *
   * @name doesNotDecrease
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotDecrease = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
      msg = prop;
      prop = null;
    }

    return new Assertion(fn, msg, assert.doesNotDecrease, true)
      .to.not.decrease(obj, prop);
  };

  /**
   * ### .doesNotDecreaseBy(function, object, property, delta, [message])
   *
   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     assert.doesNotDecreaseBy(fn, obj, 'val', 1);
   *
   * @name doesNotDecrease
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    return new Assertion(fn, msg, assert.doesNotDecreaseBy, true)
      .to.not.decrease(obj, prop).by(delta);
  };

  /**
   * ### .decreasesButNotBy(function, object, property, delta, [message])
   *
   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     assert.decreasesButNotBy(fn, obj, 'val', 1);
   *
   * @name decreasesButNotBy
   * @param {Function} modifier function
   * @param {Object} object or getter function
   * @param {String} property name _optional_
   * @param {Number} change amount (delta)
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
      var tmpMsg = delta;
      delta = prop;
      msg = tmpMsg;
    } else if (arguments.length === 3) {
      delta = prop;
      prop = null;
    }

    new Assertion(fn, msg, assert.decreasesButNotBy, true)
      .to.decrease(obj, prop).but.not.by(delta);
  };

  /*!
   * ### .ifError(object)
   *
   * Asserts if value is not a false value, and throws if it is a true value.
   * This is added to allow for chai to be a drop-in replacement for Node's
   * assert class.
   *
   *     var err = new Error('I am a custom error');
   *     assert.ifError(err); // Rethrows err!
   *
   * @name ifError
   * @param {Object} object
   * @namespace Assert
   * @api public
   */

  assert.ifError = function (val) {
    if (val) {
      throw(val);
    }
  };

  /**
   * ### .isExtensible(object)
   *
   * Asserts that `object` is extensible (can have new properties added to it).
   *
   *     assert.isExtensible({});
   *
   * @name isExtensible
   * @alias extensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isExtensible = function (obj, msg) {
    new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
  };

  /**
   * ### .isNotExtensible(object)
   *
   * Asserts that `object` is _not_ extensible.
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     assert.isNotExtensible(nonExtensibleObject);
   *     assert.isNotExtensible(sealedObject);
   *     assert.isNotExtensible(frozenObject);
   *
   * @name isNotExtensible
   * @alias notExtensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotExtensible = function (obj, msg) {
    new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
  };

  /**
   * ### .isSealed(object)
   *
   * Asserts that `object` is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.seal({});
   *
   *     assert.isSealed(sealedObject);
   *     assert.isSealed(frozenObject);
   *
   * @name isSealed
   * @alias sealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isSealed = function (obj, msg) {
    new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
  };

  /**
   * ### .isNotSealed(object)
   *
   * Asserts that `object` is _not_ sealed.
   *
   *     assert.isNotSealed({});
   *
   * @name isNotSealed
   * @alias notSealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotSealed = function (obj, msg) {
    new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
  };

  /**
   * ### .isFrozen(object)
   *
   * Asserts that `object` is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *     assert.frozen(frozenObject);
   *
   * @name isFrozen
   * @alias frozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isFrozen = function (obj, msg) {
    new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
  };

  /**
   * ### .isNotFrozen(object)
   *
   * Asserts that `object` is _not_ frozen.
   *
   *     assert.isNotFrozen({});
   *
   * @name isNotFrozen
   * @alias notFrozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotFrozen = function (obj, msg) {
    new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
  };

  /**
   * ### .isEmpty(target)
   *
   * Asserts that the target does not contain any values.
   * For arrays and strings, it checks the `length` property.
   * For `Map` and `Set` instances, it checks the `size` property.
   * For non-function objects, it gets the count of own
   * enumerable string keys.
   *
   *     assert.isEmpty([]);
   *     assert.isEmpty('');
   *     assert.isEmpty(new Map);
   *     assert.isEmpty({});
   *
   * @name isEmpty
   * @alias empty
   * @param {Object|Array|String|Map|Set} target
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isEmpty = function(val, msg) {
    new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
  };

  /**
   * ### .isNotEmpty(target)
   *
   * Asserts that the target contains values.
   * For arrays and strings, it checks the `length` property.
   * For `Map` and `Set` instances, it checks the `size` property.
   * For non-function objects, it gets the count of own
   * enumerable string keys.
   *
   *     assert.isNotEmpty([1, 2]);
   *     assert.isNotEmpty('34');
   *     assert.isNotEmpty(new Set([5, 6]));
   *     assert.isNotEmpty({ key: 7 });
   *
   * @name isNotEmpty
   * @alias notEmpty
   * @param {Object|Array|String|Map|Set} target
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotEmpty = function(val, msg) {
    new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
  };

  /*!
   * Aliases.
   */

  (function alias(name, as){
    assert[as] = assert[name];
    return alias;
  })
  ('isOk', 'ok')
  ('isNotOk', 'notOk')
  ('throws', 'throw')
  ('throws', 'Throw')
  ('isExtensible', 'extensible')
  ('isNotExtensible', 'notExtensible')
  ('isSealed', 'sealed')
  ('isNotSealed', 'notSealed')
  ('isFrozen', 'frozen')
  ('isNotFrozen', 'notFrozen')
  ('isEmpty', 'empty')
  ('isNotEmpty', 'notEmpty');
};

var chai = createCommonjsModule(function (module, exports) {
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var used = [];

/*!
 * Chai version
 */

exports.version = '4.2.0';

/*!
 * Assertion Error
 */

exports.AssertionError = assertionError;

/*!
 * Utils for plugins (not exported)
 */



/**
 * # .use(function)
 *
 * Provides a way to extend the internals of Chai.
 *
 * @param {Function}
 * @returns {this} for chaining
 * @api public
 */

exports.use = function (fn) {
  if (!~used.indexOf(fn)) {
    fn(exports, utils);
    used.push(fn);
  }

  return exports;
};

/*!
 * Utility Functions
 */

exports.util = utils;

/*!
 * Configuration
 */


exports.config = config;

/*!
 * Primary `Assertion` prototype
 */


exports.use(assertion);

/*!
 * Core Assertions
 */


exports.use(assertions);

/*!
 * Expect interface
 */


exports.use(expect);

/*!
 * Should interface
 */


exports.use(should);

/*!
 * Assert interface
 */


exports.use(assert$1);
});

var chai$1 = chai;

/**
 * [fast-check](https://github.com/dubzzz/fast-check/) generators for RDFJS entities. See [[gens]] for details.
 *
 * @packageDocumentation
 */












/**
 * Creates generators for RDFJS terms and quads based on a specified data factory.
 *
 * The generators adhere to the following rules:
 *
 * - named nodes contain web URLs
 * - blank nodes contain strings with hexadecimal digits (no anonymous blanks are generated, because that would be
 *   side-effecting)
 * - literals are hexadecimal strings with the datatype being left undefined or a named node
 * - variables are hexadecimal strings and are only generated if the data factory supports them
 */
function gens(factory) {
    const namedNode = fc.webUrl().map(url => factory.namedNode(url));

    const blankNode = fc.hexaString().map(id => factory.blankNode(id));

    const literal =
        fc.tuple(fc.hexaString(), fc.oneof(fc.constant(undefined), namedNode))
            .map(([value, datatype]) => factory.literal(value, datatype));

    const variable =
        factory.variable ?
            // @ts-ignore
            fc.hexaString().map(id => factory.variable(id)) :
            undefined;

    const variables = variable ? [variable] : [];

    const term = fc.oneof(
        namedNode,
        blankNode,
        literal,
        fc.constant(factory.defaultGraph()),
        ...variables
    );

    const subject = fc.oneof(namedNode, blankNode, ...variables);
    const predicate = fc.oneof(namedNode, ...variables);
    const object = fc.oneof(namedNode, literal, blankNode, ...variables);
    const graph = fc.oneof(fc.constant(factory.defaultGraph()), namedNode, blankNode, ...variables);

    const triple = fc.tuple(subject, predicate, object).map(([s, p, o]) => factory.quad(s, p, o));
    const quad = fc.tuple(subject, predicate, object, graph).map(([s, p, o, g]) => factory.quad(s, p, o, g));

    return {
        namedNode,
        blankNode,
        literal,
        variable,
        term,
        triple,
        quad
    };
}

/**
 * Executable specification for data factories. See [[DataFactorySpec]] for details.
 *
 * @packageDocumentation
 */

/**
 * Class containing test cases for data factories. Use [[DataFactorySpec.run]] to execute all tests.
 *
 * The tests are composed of simple unit tests originating from the
 * [reference implementation](https://github.com/rdfjs-base/data-model) and custom property tests.
 *
 * Tests dealing with variables are only executed if the data factory supports variables.
 *
 * Equality of quads is tested against `null` which goes against the types but must be supported according to the
 * textual specification.
 *
 * The tests use [Chai](https://www.chaijs.com/) for assertions that are independent from any one test framework. Tests
 * are written using the standard functions `describe` and `it`. This allows them to run under different frameworks,
 * such as:
 *
 * - [Mocha](https://mochajs.org/)
 * - [Jest](https://jestjs.io/)
 * - [Jasmine](https://jasmine.github.io/)
 *
 * Cross-factory interoperability can be tested using [[ConvertSpec]].
 */
class DataFactorySpec {
    constructor(
          dataFactory
    ) {this.dataFactory = dataFactory;}

    blankNode() {
        describe('.blankNode', () => {
            it('should be a static method', () => {
                chai$1.assert.equal(typeof this.dataFactory.blankNode, 'function');
            });

            it('should create an object with a termType property that contains the value "BlankNode"', () => {
                const term = this.dataFactory.blankNode();

                chai$1.assert.equal(term.termType, 'BlankNode');
            });

            it('should create an object with a value property that contains a unique identifier', () => {
                const term1 = this.dataFactory.blankNode();
                const term2 = this.dataFactory.blankNode();

                chai$1.assert.notEqual(term1.value, term2.value);
            });

            it('should create an object with a value property that contains the given identifier', () => {
                const id = 'b1';
                const term = this.dataFactory.blankNode(id);

                chai$1.assert.equal(term.value, id);
            });

            describe('.equals', () => {
                it('should be a method', () => {
                    const term = this.dataFactory.blankNode();

                    chai$1.assert.equal(typeof term.equals, 'function');
                });

                it('should return true if termType and value are equal', () => {
                    const id = 'b1';
                    const term = this.dataFactory.blankNode(id);
                    const mock = {termType: 'BlankNode', value: id};

                    chai$1.assert.equal(term.equals(mock), true);
                });

                it('should return false if termType is not equal', () => {
                    const id = 'b1';
                    const term = this.dataFactory.blankNode(id);
                    const mock = {termType: 'NamedNode', value: id};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is not equal', () => {
                    const id = 'b1';
                    const term = this.dataFactory.blankNode(id);
                    const mock = {termType: 'BlankNode', value: id + '1'};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is falsy', () => {
                    const id = 'b1';
                    const term = this.dataFactory.blankNode(id);

                    chai$1.assert.equal(term.equals(null), false);
                });
            });
        });
    }

    defaultGraph() {
        describe('.defaultGraph', () => {
            it('should be a static method', () => {
                chai$1.assert.equal(typeof this.dataFactory.defaultGraph, 'function');
            });

            it('should create an object with a termType property that contains the value "DefaultGraph"', () => {
                const term = this.dataFactory.defaultGraph();

                chai$1.assert.equal(term.termType, 'DefaultGraph');
            });

            it('should create an object with a value property that contains an empty string', () => {
                const term = this.dataFactory.defaultGraph();

                chai$1.assert.equal(term.value, '');
            });

            describe('.equals', () => {
                it('should be a method', () => {
                    const term = this.dataFactory.defaultGraph();

                    chai$1.assert.equal(typeof term.equals, 'function');
                });

                it('should return true if termType and value are equal', () => {
                    const term = this.dataFactory.defaultGraph();
                    const mock = {termType: 'DefaultGraph', value: ''};

                    chai$1.assert.equal(term.equals(mock), true);
                });

                it('should return false if termType is not equal', () => {
                    const term = this.dataFactory.defaultGraph();
                    const mock = {termType: 'NamedNode', value: ''};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is falsy', () => {
                    const term = this.dataFactory.defaultGraph();

                    chai$1.assert.equal(term.equals(null), false);
                });
            });
        });
    }

    literal() {
        describe('.literal', () => {
            it('should be a static method', () => {
                chai$1.assert.equal(typeof this.dataFactory.literal, 'function');
            });

            it('should create an object with a termType property that contains the value "Literal"', () => {
                const string = 'example';
                const term = this.dataFactory.literal(string);

                chai$1.assert.equal(term.termType, 'Literal');
            });

            it('should create an object with a value property that contains the given string', () => {
                const string = 'example';
                const term = this.dataFactory.literal(string);

                chai$1.assert.equal(term.value, string);
            });

            it('should create an object with a language property that contains an empty string', () => {
                const string = 'example';
                const term = this.dataFactory.literal(string);

                chai$1.assert.equal(term.language, '');
            });

            it('should create an object with a language property that contains the given language string', () => {
                const string = 'example';
                const language = 'en';
                const term = this.dataFactory.literal(string, language);

                chai$1.assert.equal(term.language, language);
            });

            it('should create an object with a datatype property that contains a NamedNode with the value "http://www.w3.org/2001/XMLSchema#string"', () => {
                const string = 'example';
                const term = this.dataFactory.literal(string);

                chai$1.assert.equal(term.datatype.termType, 'NamedNode');
                chai$1.assert.equal(term.datatype.value, 'http://www.w3.org/2001/XMLSchema#string');
            });

            it('should create an object with a datatype property that contains a NamedNode with the value "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"', () => {
                const string = 'example';
                const language = 'en';
                const term = this.dataFactory.literal(string, language);

                chai$1.assert.equal(term.datatype.termType, 'NamedNode');
                chai$1.assert.equal(term.datatype.value, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
            });

            it('should create an object with a datatype property that contains a NamedNode with the given IRI', () => {
                const string = 'example';
                const datatypeIRI = 'http://example.org';
                const datatypeNode = this.dataFactory.namedNode(datatypeIRI);
                const term = this.dataFactory.literal(string, datatypeNode);

                chai$1.assert.equal(term.datatype.termType, 'NamedNode');
                chai$1.assert.equal(term.datatype.value, datatypeIRI);
            });

            it('should create an object with a datatype property that contains the given NamedNode', () => {
                const string = 'example';
                const datatype = this.dataFactory.namedNode('http://example.org');
                const term = this.dataFactory.literal(string, datatype);

                chai$1.assert.equal(term.datatype.termType, 'NamedNode');
                chai$1.assert.equal(term.datatype.value, datatype.value);
            });

            describe('.equals', () => {
                it('should be a method', () => {
                    const term = this.dataFactory.literal('');

                    chai$1.assert.equal(typeof term.equals, 'function');
                });

                it('should return true if termType, value, language and datatype are equal', () => {
                    const string = 'example';
                    const language = 'en';
                    const term = this.dataFactory.literal(string, language);
                    const mock = {
                        termType: 'Literal',
                        value: string,
                        language: language,
                        datatype: this.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
                    };

                    chai$1.assert.equal(term.equals(mock), true);
                });

                it('should return false if termType is not equal', () => {
                    const string = 'example';
                    const language = 'en';
                    const term = this.dataFactory.literal(string, language);
                    const mock = {
                        termType: 'NamedNode',
                        value: string,
                        language: language,
                        datatype: this.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
                    };

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is not equal', () => {
                    const string = 'example';
                    const language = 'en';
                    const term = this.dataFactory.literal(string, language);
                    const mock = {
                        termType: 'Literal',
                        value: string + '1',
                        language: language,
                        datatype: this.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
                    };

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if language is not equal', () => {
                    const string = 'example';
                    const language = 'en';
                    const term = this.dataFactory.literal(string, language);
                    const mock = {
                        termType: 'Literal',
                        value: string,
                        language: 'de',
                        datatype: this.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
                    };

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if datatype is not equal', () => {
                    const string = 'example';
                    const language = 'en';
                    const term = this.dataFactory.literal(string, language);
                    const mock = {
                        termType: 'Literal',
                        value: string,
                        language: language,
                        datatype: this.dataFactory.namedNode('http://example.org')
                    };

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is falsy', () => {
                    const string = 'example';
                    const language = 'en';
                    const term = this.dataFactory.literal(string, language);

                    chai$1.assert.equal(term.equals(null), false);
                });
            });
        });
    }

    namedNode() {
        describe('.namedNode', () => {
            it('should be a static method', () => {
                chai$1.assert.equal(typeof this.dataFactory.namedNode, 'function');
            });

            it('should create an object with a termType property that contains the value "NamedNode"', () => {
                const iri = 'http://example.org';
                const term = this.dataFactory.namedNode(iri);

                chai$1.assert.equal(term.termType, 'NamedNode');
            });

            it('should create an object with a value property that contains the given IRI', () => {
                const iri = 'http://example.org';
                const term = this.dataFactory.namedNode(iri);

                chai$1.assert.equal(term.value, iri);
            });

            describe('.equals', () => {
                it('should be a method', () => {
                    const iri = 'http://example.org';
                    const term = this.dataFactory.namedNode(iri);

                    chai$1.assert.equal(typeof term.equals, 'function');
                });

                it('should return true if termType and value are equal', () => {
                    const iri = 'http://example.org';
                    const term = this.dataFactory.namedNode(iri);
                    const mock = {termType: 'NamedNode', value: iri};

                    chai$1.assert.equal(term.equals(mock), true);
                });

                it('should return false if termType is not equal', () => {
                    const iri = 'http://example.org';
                    const term = this.dataFactory.namedNode(iri);
                    const mock = {termType: 'BlankNode', value: iri};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is not equal', () => {
                    const iri = 'http://example.org';
                    const term = this.dataFactory.namedNode(iri);
                    const mock = {termType: 'NamedNode', value: iri + '1'};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is falsy', () => {
                    const iri = 'http://example.org';
                    const term = this.dataFactory.namedNode(iri);

                    chai$1.assert.equal(term.equals(null), false);
                });
            });
        });
    }

    quad() {
        describe('.quad', () => {
            it('should be a static method', () => {
                chai$1.assert.equal(typeof this.dataFactory.quad, 'function');
            });

            it('should create an object with .subject, .predicate, .object and .graph with the given values', () => {
                const subject = this.dataFactory.namedNode('http://example.org/subject');
                const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                const object = this.dataFactory.namedNode('http://example.org/object');
                const graph = this.dataFactory.namedNode('http://example.org/graph');
                const quad = this.dataFactory.quad(subject, predicate, object, graph);

                chai$1.assert.equal(subject.equals(quad.subject), true);
                chai$1.assert.equal(predicate.equals(quad.predicate), true);
                chai$1.assert.equal(object.equals(quad.object), true);
                chai$1.assert.equal(graph.equals(quad.graph), true);
            });

            it('should create an object .graph set to DefaultGraph if the argument isn\'t given', () => {
                const subject = this.dataFactory.namedNode('http://example.org/subject');
                const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                const object = this.dataFactory.namedNode('http://example.org/object');
                const graph = this.dataFactory.defaultGraph();
                const quad = this.dataFactory.quad(subject, predicate, object);

                chai$1.assert.equal(quad.graph.equals(graph), true);
            });

            describe('.equals', () => {
                it('should return true if the other quad contains the same subject, predicate, object and graph', () => {
                    const subject = this.dataFactory.namedNode('http://example.org/subject');
                    const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                    const object = this.dataFactory.namedNode('http://example.org/object');
                    const graph = this.dataFactory.namedNode('http://example.org/graph');
                    const quad1 = this.dataFactory.quad(subject, predicate, object, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate, object, graph);

                    chai$1.assert.equal(quad1.equals(quad2), true);
                });

                it('should return false if the subject of the other quad is not the same', () => {
                    const subject1 = this.dataFactory.namedNode('http://example.org/subject');
                    const subject2 = this.dataFactory.namedNode('http://example.com/subject');
                    const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                    const object = this.dataFactory.namedNode('http://example.org/object');
                    const graph = this.dataFactory.namedNode('http://example.org/graph');
                    const quad1 = this.dataFactory.quad(subject1, predicate, object, graph);
                    const quad2 = this.dataFactory.quad(subject2, predicate, object, graph);

                    chai$1.assert.equal(quad1.equals(quad2), false);
                });

                it('should return false if the predicate of the other quad is not the same', () => {
                    const subject = this.dataFactory.namedNode('http://example.org/subject');
                    const predicate1 = this.dataFactory.namedNode('http://example.org/predicate');
                    const predicate2 = this.dataFactory.namedNode('http://example.com/predicate');
                    const object = this.dataFactory.namedNode('http://example.org/object');
                    const graph = this.dataFactory.namedNode('http://example.org/graph');
                    const quad1 = this.dataFactory.quad(subject, predicate1, object, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate2, object, graph);

                    chai$1.assert.equal(quad1.equals(quad2), false);
                });

                it('should return false if the object of the other quad is not the same', () => {
                    const subject = this.dataFactory.namedNode('http://example.org/subject');
                    const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                    const object1 = this.dataFactory.namedNode('http://example.org/object');
                    const object2 = this.dataFactory.namedNode('http://example.com/object');
                    const graph = this.dataFactory.namedNode('http://example.org/graph');
                    const quad1 = this.dataFactory.quad(subject, predicate, object1, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate, object2, graph);

                    chai$1.assert.equal(quad1.equals(quad2), false);
                });

                it('should return false if the graph of the other quad is not the same', () => {
                    const subject = this.dataFactory.namedNode('http://example.org/subject');
                    const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                    const object = this.dataFactory.namedNode('http://example.org/object');
                    const graph1 = this.dataFactory.namedNode('http://example.org/graph');
                    const graph2 = this.dataFactory.namedNode('http://example.com/graph');
                    const quad1 = this.dataFactory.quad(subject, predicate, object, graph1);
                    const quad2 = this.dataFactory.quad(subject, predicate, object, graph2);

                    chai$1.assert.equal(quad1.equals(quad2), false);
                });

                it('should return false if value is falsy', () => {
                    const subject = this.dataFactory.namedNode('http://example.org/subject');
                    const predicate = this.dataFactory.namedNode('http://example.org/predicate');
                    const object = this.dataFactory.namedNode('http://example.org/object');
                    const graph = this.dataFactory.namedNode('http://example.org/graph');
                    const quad = this.dataFactory.quad(subject, predicate, object, graph);

                    chai$1.assert.equal(quad.equals(null), false);
                });
            });
        });
    }

    variable() {
        let dataFactoryVariable;

        if (this.dataFactory.variable === undefined)
            return;
        else
            dataFactoryVariable = this.dataFactory.variable.bind(this.dataFactory);

        describe('.variable', () => {
            it('should be a static method', () => {
                chai$1.assert.equal(typeof dataFactoryVariable, 'function');
            });

            it('should create an object with a termType property that contains the value "Variable"', () => {
                const name = 'v';
                const term = dataFactoryVariable(name);

                chai$1.assert.equal(term.termType, 'Variable');
            });

            it('should create an object with a value property that contains the given name', () => {
                const name = 'v';
                const term = dataFactoryVariable(name);

                chai$1.assert.equal(term.value, name);
            });

            describe('.equals', () => {
                it('should be a method', () => {
                    const name = 'v';
                    const term = dataFactoryVariable(name);

                    chai$1.assert.equal(typeof term.equals, 'function');
                });

                it('should return true if termType and value are equal', () => {
                    const name = 'v';
                    const term = dataFactoryVariable(name);
                    const mock = {termType: 'Variable', value: name};

                    chai$1.assert.equal(term.equals(mock), true);
                });

                it('should return false if termType is not equal', () => {
                    const name = 'v';
                    const term = dataFactoryVariable(name);
                    const mock = {termType: 'NamedNode', value: name};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is not equal', () => {
                    const name = 'v';
                    const term = dataFactoryVariable(name);
                    const mock = {termType: 'Variable', value: name + '1'};

                    chai$1.assert.equal(term.equals(mock), false);
                });

                it('should return false if value is falsy', () => {
                    const name = 'v';
                    const term = dataFactoryVariable(name);

                    chai$1.assert.equal(term.equals(null), false);
                });
            });
        });
    }

    gen() {
        const gen = gens(this.dataFactory);
        describe("Gens", () => {
            describe("self-equals", () => {
                for (const [key, g] of Object.entries(gen))
                    if (g !== undefined)
                        it(key, () => {
                            fc.assert(fc.property(g, term => {
                                chai$1.assert((term ).equals(term));
                            }));
                        });
            });
            describe("not equal (terms)", () => {
                const keys = ["namedNode", "blankNode", "literal", "variable"];
                for (const key1 of keys)
                    for (const key2 of keys)
                        if (key1 !== key2)
                            it(`${key1}/${key2}`, () => {
                                const gen1 = (gen )[key1];
                                const gen2 = (gen )[key2];
                                if (gen1 === undefined || gen2 === undefined)
                                    return;
                                fc.assert(fc.property(gen1, gen2, (term1, term2) => {
                                    chai$1.assert.equal((term1 ).equals(term2), false);
                                }));
                            });
            });
        });
    }

    run() {
        this.blankNode();
        this.defaultGraph();
        this.literal();
        this.namedNode();
        this.quad();
        this.variable();
        this.gen();
    }
}

/**
 * Produces an object that, when accessed at any property, generates a named node that's composed of the base IRI and
 * the name of the property.
 *
 * Example:
 *
 * ```
 * const ns = namespace("http://example.org/", dataFactory);
 * const nsFoo = ns.foo;
 * // nsFoo is a NamedNode with IRI http://example.org/foo
 * ```
 *
 * Implementation taken from [@rdfjs/namespace](https://github.com/rdfjs-base/namespace).
 *
 * @param baseIRI The base IRI that is prepended to the generated named nodes
 * @param dataFactory The data factory that is used to generate named nodes
 *
 * @returns A record (backed by a `Proxy`) that can be accessed at any property
 */
function namespace(baseIRI, dataFactory) {
    return new Proxy({}, {
        get: (target, property) =>
            dataFactory.namedNode(`${baseIRI}${property}`)
    });
}

/**
 * Class containing test cases data factories. Use [[DatasetSpec.run]] to execute all tests.
 *
 * This class requires both a dataset factory and a data factory.
 *
 * The tests are composed of simple unit tests originating from the
 * [reference implementation](https://github.com/rdfjs-base/dataset).
 */
class DatasetSpec {
    constructor(
          datasetFactory,
          dataFactory
    ) {this.datasetFactory = datasetFactory;this.dataFactory = dataFactory; }

    factory() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("factory", () => {
            it("should be a function", () => {
                chai$1.assert.strictEqual(typeof this.datasetFactory.dataset, "function");
            });

            it("should add the given Quads", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);

                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                chai$1.assert(dataset.has(quad1));
                chai$1.assert(dataset.has(quad2));
            });
        });
    }

    size() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("size", () => {
            it("should be a number property", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(typeof dataset.size, "number");
            });

            it("should be 0 if there are no Quads in the Dataset", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(dataset.size, 0);
            });

            it("should be equal to the number of Quads in the Dataset", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                chai$1.assert.strictEqual(dataset.size, 2);
            });
        });
    }

    add() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("add", () => {
            it("should be a function", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(typeof dataset.add, "function");
            });

            it("should add the given Quad", () => {
                const quad = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset();

                dataset.add(quad);

                chai$1.assert(dataset.has(quad));
            });

            it("should not add duplicate Quads", () => {
                const quadA = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
                const quadB = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset();

                dataset.add(quadA);
                dataset.add(quadB);

                chai$1.assert.strictEqual(dataset.size, 1);
            });
        });
    }

    delete() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("delete", () => {
            it("should be a function", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(typeof dataset.delete, "function");
            });

            it("should remove the given Quad", () => {
                const quad = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset([quad]);

                dataset.delete(quad);

                chai$1.assert(!dataset.has(quad));
            });

            it("should remove only the given Quad", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                dataset.delete(quad1);

                chai$1.assert(!dataset.has(quad1));
                chai$1.assert(dataset.has(quad2));
            });

            it("should remove the Quad with the same SPOG as the given Quad", () => {
                const quad = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
                const quadCloned = this.dataFactory.quad(quad.subject, quad.predicate, quad.object, quad.graph);
                const dataset = this.datasetFactory.dataset([quad]);

                dataset.delete(quadCloned);

                chai$1.assert(!dataset.has(quad));
            });
        });
    }

    has() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("has", () => {
            it("should be a function", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(typeof dataset.has, "function");
            });

            it("should return false if the given Quad is not in the Dataset", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
                const dataset = this.datasetFactory.dataset([quad1]);

                chai$1.assert(!dataset.has(quad2));
            });

            it("should return true if the given Quad is in the Dataset", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                chai$1.assert(dataset.has(quad2));
            });
        });
    }

    match() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("match", () => {
            it("should be a function", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(typeof dataset.match, "function");
            });

            it("should use the given subject to select Quads", () => {
                const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
                const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const matches = dataset.match(ex.subject2);

                chai$1.assert.strictEqual(matches.size, 1);
                chai$1.assert(matches.has(quad2));
            });

            it("should use the given predicate to select Quads", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate1, ex.object);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate2, ex.object);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const matches = dataset.match(null, ex.predicate2);

                chai$1.assert.strictEqual(matches.size, 1);
                chai$1.assert(matches.has(quad2));
            });

            it("should use the given object to select Quads", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const matches = dataset.match(null, null, ex.object2);

                chai$1.assert.strictEqual(matches.size, 1);
                chai$1.assert(matches.has(quad2));
            });

            it("should use the given graph to select Quads", () => {
                const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object, ex.graph1);
                const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object, ex.graph2);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const matches = dataset.match(null, null, null, ex.graph2);

                chai$1.assert.strictEqual(matches.size, 1);
                chai$1.assert(matches.has(quad2));
            });

            it("should return an empty Dataset if there are no matches", () => {
                const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
                const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const matches = dataset.match(null, null, ex.object3);

                chai$1.assert.strictEqual(matches.size, 0);
            });
        });
    }

    iterator() {
        const ex = namespace("http://example.org/", this.dataFactory);

        describe("Symbol.iterator", () => {
            it("should be a function", () => {
                const dataset = this.datasetFactory.dataset();

                chai$1.assert.strictEqual(typeof dataset[Symbol.iterator], "function");
            });

            it("should return an iterator", () => {
                const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
                const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const iterator = dataset[Symbol.iterator]();

                chai$1.assert.strictEqual(typeof iterator.next, "function");
                chai$1.assert.strictEqual(typeof iterator.next().value, "object");
            });

            it("should iterate over all Quads", () => {
                const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
                const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
                const dataset = this.datasetFactory.dataset([quad1, quad2]);

                const iterator = dataset[Symbol.iterator]();

                const output = this.datasetFactory.dataset();

                for (let item = iterator.next(); item.value; item = iterator.next()) {
                    output.add(item.value);
                }

                chai$1.assert.strictEqual(output.size, 2);
                chai$1.assert(output.has(quad1));
                chai$1.assert(output.has(quad2));
            });
        });
    }

    run() {
        this.factory();
        this.size();
        this.add();
        this.delete();
        this.has();
        this.match();
        this.iterator();
    }
}

/**
 * This function converts an RDF term or a quad into another representation, specified by the given data factory.
 *
 * There are two overloads of this method; one for terms and another one for quads. It is guaranteed that – assuming
 * compliant factory implementations – the resulting object compares true with the input object using the `equals`
 * method. In code:
 *
 * ```javascript
 * const output = convert(input, factory);
 * assert.ok(output.equals(input));
 * ```
 *
 * Data factory implementers may want to check their implementation for cross-factory interoperability using
 * [[ConvertSpec]].
 */
function convert(input, dataFactory) {
    if ("termType" in input) {
        const term = input;

        switch (term.termType) {
            case "BlankNode":
                return dataFactory.blankNode(term.value);
            case "DefaultGraph":
                return dataFactory.defaultGraph();
            case "Literal":
                return dataFactory.literal(term.value, term.language === "" ? convert(term.datatype, dataFactory) : term.language);
            case "NamedNode":
                return dataFactory.namedNode(term.value);
            case "Variable":
                if (dataFactory.variable)
                    return dataFactory.variable(term.value);
                else
                    throw new Error("Variables are not supported");
            default:
                throw new Error("Unknown term type");
        }
    }
    else {
        const quad = input;

        return dataFactory.quad(
            convert(quad.subject, dataFactory),
            convert(quad.predicate, dataFactory),
            convert(quad.object, dataFactory),
            convert(quad.graph, dataFactory)
        );
    }
}

/**
 * Class containing test cases for cross-factory interoperability of RDF terms and quads. Use [[ConvertSpec.run]] to
 * execute all tests.
 *
 * The test cases check that conversion from terms and quads from one factory into another factory preserves equality.
 * For that, [[gens]] is used with one data factory to create terms and quads. Those are then converted into a second
 * data factory using [[convert]].
 *
 * Tests in this class are written in the same style as [[DataFactorySpec]].
 */
class ConvertSpec {

    /**
     * Create a new instance of the executable convert spec.
     * @param f1 the data factory _from which_ terms and quads are converted
     * @param f2 the data factory _into which_ terms and quads are converted
     */
    constructor(
          f1,
          f2
    ) {this.f1 = f1;this.f2 = f2;}

    run() {
        const { term, quad } = gens(this.f1);

        it("Equal after conversion (term)", () => {
            fc.assert(fc.property(term, term => {
                const converted = convert(term, this.f2);
                chai$1.assert.isTrue(term.equals(converted));
            }));
        });

        it("Equal after conversion (quad)", () => {
            fc.assert(fc.property(quad, quad => {
                const converted = convert(quad, this.f2);
                chai$1.assert.isTrue(quad.equals(converted));
            }));
        });
    }

}

var index_es = /*#__PURE__*/Object.freeze({
__proto__: null,
ConvertSpec: ConvertSpec,
DataFactorySpec: DataFactorySpec,
DatasetSpec: DatasetSpec,
convert: convert,
gens: gens,
namespace: namespace
});

var chaiAsPromised = createCommonjsModule(function (module) {
/* eslint-disable no-invalid-this */
let checkError$1 = checkError;

module.exports = (chai, utils) => {
    const Assertion = chai.Assertion;
    const assert = chai.assert;
    const proxify = utils.proxify;

    // If we are using a version of Chai that has checkError on it,
    // we want to use that version to be consistent. Otherwise, we use
    // what was passed to the factory.
    if (utils.checkError) {
        checkError$1 = utils.checkError;
    }

    function isLegacyJQueryPromise(thenable) {
        // jQuery promises are Promises/A+-compatible since 3.0.0. jQuery 3.0.0 is also the first version
        // to define the catch method.
        return typeof thenable.catch !== "function" &&
               typeof thenable.always === "function" &&
               typeof thenable.done === "function" &&
               typeof thenable.fail === "function" &&
               typeof thenable.pipe === "function" &&
               typeof thenable.progress === "function" &&
               typeof thenable.state === "function";
    }

    function assertIsAboutPromise(assertion) {
        if (typeof assertion._obj.then !== "function") {
            throw new TypeError(utils.inspect(assertion._obj) + " is not a thenable.");
        }
        if (isLegacyJQueryPromise(assertion._obj)) {
            throw new TypeError("Chai as Promised is incompatible with thenables of jQuery<3.0.0, sorry! Please " +
                                "upgrade jQuery or use another Promises/A+ compatible library (see " +
                                "http://promisesaplus.com/).");
        }
    }

    function proxifyIfSupported(assertion) {
        return proxify === undefined ? assertion : proxify(assertion);
    }

    function method(name, asserter) {
        utils.addMethod(Assertion.prototype, name, function () {
            assertIsAboutPromise(this);
            return asserter.apply(this, arguments);
        });
    }

    function property(name, asserter) {
        utils.addProperty(Assertion.prototype, name, function () {
            assertIsAboutPromise(this);
            return proxifyIfSupported(asserter.apply(this, arguments));
        });
    }

    function doNotify(promise, done) {
        promise.then(() => done(), done);
    }

    // These are for clarity and to bypass Chai refusing to allow `undefined` as actual when used with `assert`.
    function assertIfNegated(assertion, message, extra) {
        assertion.assert(true, null, message, extra.expected, extra.actual);
    }

    function assertIfNotNegated(assertion, message, extra) {
        assertion.assert(false, message, null, extra.expected, extra.actual);
    }

    function getBasePromise(assertion) {
        // We need to chain subsequent asserters on top of ones in the chain already (consider
        // `eventually.have.property("foo").that.equals("bar")`), only running them after the existing ones pass.
        // So the first base-promise is `assertion._obj`, but after that we use the assertions themselves, i.e.
        // previously derived promises, to chain off of.
        return typeof assertion.then === "function" ? assertion : assertion._obj;
    }

    function getReasonName(reason) {
        return reason instanceof Error ? reason.toString() : checkError$1.getConstructorName(reason);
    }

    // Grab these first, before we modify `Assertion.prototype`.

    const propertyNames = Object.getOwnPropertyNames(Assertion.prototype);

    const propertyDescs = {};
    for (const name of propertyNames) {
        propertyDescs[name] = Object.getOwnPropertyDescriptor(Assertion.prototype, name);
    }

    property("fulfilled", function () {
        const derivedPromise = getBasePromise(this).then(
            value => {
                assertIfNegated(this,
                                "expected promise not to be fulfilled but it was fulfilled with #{act}",
                                { actual: value });
                return value;
            },
            reason => {
                assertIfNotNegated(this,
                                   "expected promise to be fulfilled but it was rejected with #{act}",
                                   { actual: getReasonName(reason) });
                return reason;
            }
        );

        module.exports.transferPromiseness(this, derivedPromise);
        return this;
    });

    property("rejected", function () {
        const derivedPromise = getBasePromise(this).then(
            value => {
                assertIfNotNegated(this,
                                   "expected promise to be rejected but it was fulfilled with #{act}",
                                   { actual: value });
                return value;
            },
            reason => {
                assertIfNegated(this,
                                "expected promise not to be rejected but it was rejected with #{act}",
                                { actual: getReasonName(reason) });

                // Return the reason, transforming this into a fulfillment, to allow further assertions, e.g.
                // `promise.should.be.rejected.and.eventually.equal("reason")`.
                return reason;
            }
        );

        module.exports.transferPromiseness(this, derivedPromise);
        return this;
    });

    method("rejectedWith", function (errorLike, errMsgMatcher, message) {
        let errorLikeName = null;
        const negate = utils.flag(this, "negate") || false;

        // rejectedWith with that is called without arguments is
        // the same as a plain ".rejected" use.
        if (errorLike === undefined && errMsgMatcher === undefined &&
            message === undefined) {
            /* eslint-disable no-unused-expressions */
            return this.rejected;
            /* eslint-enable no-unused-expressions */
        }

        if (message !== undefined) {
            utils.flag(this, "message", message);
        }

        if (errorLike instanceof RegExp || typeof errorLike === "string") {
            errMsgMatcher = errorLike;
            errorLike = null;
        } else if (errorLike && errorLike instanceof Error) {
            errorLikeName = errorLike.toString();
        } else if (typeof errorLike === "function") {
            errorLikeName = checkError$1.getConstructorName(errorLike);
        } else {
            errorLike = null;
        }
        const everyArgIsDefined = Boolean(errorLike && errMsgMatcher);

        let matcherRelation = "including";
        if (errMsgMatcher instanceof RegExp) {
            matcherRelation = "matching";
        }

        const derivedPromise = getBasePromise(this).then(
            value => {
                let assertionMessage = null;
                let expected = null;

                if (errorLike) {
                    assertionMessage = "expected promise to be rejected with #{exp} but it was fulfilled with #{act}";
                    expected = errorLikeName;
                } else if (errMsgMatcher) {
                    assertionMessage = `expected promise to be rejected with an error ${matcherRelation} #{exp} but ` +
                                       `it was fulfilled with #{act}`;
                    expected = errMsgMatcher;
                }

                assertIfNotNegated(this, assertionMessage, { expected, actual: value });
                return value;
            },
            reason => {
                const errorLikeCompatible = errorLike && (errorLike instanceof Error ?
                                                        checkError$1.compatibleInstance(reason, errorLike) :
                                                        checkError$1.compatibleConstructor(reason, errorLike));

                const errMsgMatcherCompatible = errMsgMatcher && checkError$1.compatibleMessage(reason, errMsgMatcher);

                const reasonName = getReasonName(reason);

                if (negate && everyArgIsDefined) {
                    if (errorLikeCompatible && errMsgMatcherCompatible) {
                        this.assert(true,
                                    null,
                                    "expected promise not to be rejected with #{exp} but it was rejected " +
                                    "with #{act}",
                                    errorLikeName,
                                    reasonName);
                    }
                } else {
                    if (errorLike) {
                        this.assert(errorLikeCompatible,
                                    "expected promise to be rejected with #{exp} but it was rejected with #{act}",
                                    "expected promise not to be rejected with #{exp} but it was rejected " +
                                    "with #{act}",
                                    errorLikeName,
                                    reasonName);
                    }

                    if (errMsgMatcher) {
                        this.assert(errMsgMatcherCompatible,
                                    `expected promise to be rejected with an error ${matcherRelation} #{exp} but got ` +
                                    `#{act}`,
                                    `expected promise not to be rejected with an error ${matcherRelation} #{exp}`,
                                    errMsgMatcher,
                                    checkError$1.getMessage(reason));
                    }
                }

                return reason;
            }
        );

        module.exports.transferPromiseness(this, derivedPromise);
        return this;
    });

    property("eventually", function () {
        utils.flag(this, "eventually", true);
        return this;
    });

    method("notify", function (done) {
        doNotify(getBasePromise(this), done);
        return this;
    });

    method("become", function (value, message) {
        return this.eventually.deep.equal(value, message);
    });

    // ### `eventually`

    // We need to be careful not to trigger any getters, thus `Object.getOwnPropertyDescriptor` usage.
    const methodNames = propertyNames.filter(name => {
        return name !== "assert" && typeof propertyDescs[name].value === "function";
    });

    methodNames.forEach(methodName => {
        Assertion.overwriteMethod(methodName, originalMethod => function () {
            return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
        });
    });

    const getterNames = propertyNames.filter(name => {
        return name !== "_obj" && typeof propertyDescs[name].get === "function";
    });

    getterNames.forEach(getterName => {
        // Chainable methods are things like `an`, which can work both for `.should.be.an.instanceOf` and as
        // `should.be.an("object")`. We need to handle those specially.
        const isChainableMethod = Assertion.prototype.__methods.hasOwnProperty(getterName);

        if (isChainableMethod) {
            Assertion.overwriteChainableMethod(
                getterName,
                originalMethod => function () {
                    return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
                },
                originalGetter => function () {
                    return doAsserterAsyncAndAddThen(originalGetter, this);
                }
            );
        } else {
            Assertion.overwriteProperty(getterName, originalGetter => function () {
                return proxifyIfSupported(doAsserterAsyncAndAddThen(originalGetter, this));
            });
        }
    });

    function doAsserterAsyncAndAddThen(asserter, assertion, args) {
        // Since we're intercepting all methods/properties, we need to just pass through if they don't want
        // `eventually`, or if we've already fulfilled the promise (see below).
        if (!utils.flag(assertion, "eventually")) {
            asserter.apply(assertion, args);
            return assertion;
        }

        const derivedPromise = getBasePromise(assertion).then(value => {
            // Set up the environment for the asserter to actually run: `_obj` should be the fulfillment value, and
            // now that we have the value, we're no longer in "eventually" mode, so we won't run any of this code,
            // just the base Chai code that we get to via the short-circuit above.
            assertion._obj = value;
            utils.flag(assertion, "eventually", false);

            return args ? module.exports.transformAsserterArgs(args) : args;
        }).then(newArgs => {
            asserter.apply(assertion, newArgs);

            // Because asserters, for example `property`, can change the value of `_obj` (i.e. change the "object"
            // flag), we need to communicate this value change to subsequent chained asserters. Since we build a
            // promise chain paralleling the asserter chain, we can use it to communicate such changes.
            return assertion._obj;
        });

        module.exports.transferPromiseness(assertion, derivedPromise);
        return assertion;
    }

    // ### Now use the `Assertion` framework to build an `assert` interface.
    const originalAssertMethods = Object.getOwnPropertyNames(assert).filter(propName => {
        return typeof assert[propName] === "function";
    });

    assert.isFulfilled = (promise, message) => (new Assertion(promise, message)).to.be.fulfilled;

    assert.isRejected = (promise, errorLike, errMsgMatcher, message) => {
        const assertion = new Assertion(promise, message);
        return assertion.to.be.rejectedWith(errorLike, errMsgMatcher, message);
    };

    assert.becomes = (promise, value, message) => assert.eventually.deepEqual(promise, value, message);

    assert.doesNotBecome = (promise, value, message) => assert.eventually.notDeepEqual(promise, value, message);

    assert.eventually = {};
    originalAssertMethods.forEach(assertMethodName => {
        assert.eventually[assertMethodName] = function (promise) {
            const otherArgs = Array.prototype.slice.call(arguments, 1);

            let customRejectionHandler;
            const message = arguments[assert[assertMethodName].length - 1];
            if (typeof message === "string") {
                customRejectionHandler = reason => {
                    throw new chai.AssertionError(`${message}\n\nOriginal reason: ${utils.inspect(reason)}`);
                };
            }

            const returnedPromise = promise.then(
                fulfillmentValue => assert[assertMethodName].apply(assert, [fulfillmentValue].concat(otherArgs)),
                customRejectionHandler
            );

            returnedPromise.notify = done => {
                doNotify(returnedPromise, done);
            };

            return returnedPromise;
        };
    });
};

module.exports.transferPromiseness = (assertion, promise) => {
    assertion.then = promise.then.bind(promise);
};

module.exports.transformAsserterArgs = values => values;
});

var spec = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fc$1 = _interopDefault(fc);


var chai__default = _interopDefault(chai$1);
var chaiAsPromised$1 = _interopDefault(chaiAsPromised);

let httpbinUrl;

function getHttpbinUrl() {
    if (httpbinUrl !== undefined)
        return httpbinUrl;

    if (process.env.HTTPBIN_URL) {
        httpbinUrl = process.env.HTTPBIN_URL;
    }
    else {
        console.warn("Using live httpbin API; set HTTPBIN_URI to use local server ...");
        httpbinUrl = "https://httpbin.org";
    }

    return httpbinUrl;
}

function encodeUtf8(string) {
    if (typeof TextEncoder !== "undefined")
        return new TextEncoder().encode(string);
    else
        return Buffer.from(string, "utf-8");
}

/**
 * The specification of the [[Pod]] API. All tests are executed by calling [[podSpec]].

 * The specification manipulates files only under a path that is provided in the constructor. Callers should ensure
 * that the path exists, is empty, and not used for other purposes.
 *
 * Note that the tests use the [httpbin](https://httpbin.org/) service. Test runners should either ensure Internet
 * access or provide a URI to a local httpbin service.
 */
class PodSpec {

    constructor(
          pod,
          path,
          httpbinUrl
    ) {this.pod = pod;this.path = path;this.httpbinUrl = httpbinUrl;
        chai__default.use(chaiAsPromised$1);
    }

    polyIn() {
        const {dataFactory, polyIn} = this.pod;

        describe("polyIn", () => {

            describe("factory", () => {
                new index_es.DataFactorySpec(dataFactory).run();
            });

            it("add only allows default graph", async () => {
                const quad = dataFactory.quad(
                    dataFactory.namedNode("http://example.org/s"),
                    dataFactory.namedNode("http://example.org/p"),
                    dataFactory.namedNode("http://example.org/o"),
                    dataFactory.namedNode("http://example.org/g")
                );
                await chai$1.assert.isRejected(polyIn.add(quad), /default/);
            });

            it("add/select", async () => {
                const {triple} = index_es.gens(dataFactory);
                await fc$1.assert(fc$1.asyncProperty(fc$1.array(triple), async quads => {
                    await polyIn.add(...quads);
                    for (const quad of quads) {
                        const selected = await polyIn.select(quad);
                        chai$1.assert.lengthOf(selected, 1);
                        chai$1.assert.ok(quad.equals(selected[0]));
                    }
                }));
            });

        });
    }

    polyOut() {
        const {polyOut} = this.pod;

        describe("polyOut", () => {

            describe("Filesystem", () => {

                const pathGen = fc$1.hexaString(1, 30).map(path => this.path + "/" + path);

                async function skipIfExists(path) {
                    let cont = true;
                    try {
                        await polyOut.stat(path);
                        cont = false;
                    }
                    catch (e) {
                        // intentionally left blank
                    }
                    fc$1.pre(cont);
                }

                it("write/read", async () => {
                    await fc$1.assert(fc$1.asyncProperty(pathGen, fc$1.fullUnicodeString(), async (path, content) => {
                        await skipIfExists(path);

                        await polyOut.writeFile(path, content, { encoding: "utf-8" });

                        await chai$1.assert.eventually.equal(polyOut.readFile(path, { encoding: "utf-8" }), content);
                        await chai$1.assert.eventually.deepEqual(polyOut.readFile(path), encodeUtf8(content));
                    }));
                });

                it("stat/read", async () => {
                    await fc$1.assert(fc$1.asyncProperty(pathGen, async path => {
                        await skipIfExists(path);

                        await chai$1.assert.isRejected(polyOut.readFile(path, { encoding: "utf-8" }));
                    }));
                });

                it("stat (root)", async () => {
                    const stat = await polyOut.stat(this.path);
                    chai$1.assert.ok(stat.isDirectory());
                    chai$1.assert.notOk(stat.isFile());
                });

                it("stat (files)", async () => {
                    await fc$1.assert(fc$1.asyncProperty(pathGen, async path => {
                        let assertion;
                        try {
                            const stat = await polyOut.stat(path);
                            assertion = () => chai$1.assert.notEqual(stat.isFile(), stat.isDirectory());
                        }
                        catch (e2) {
                            assertion = () => {
                                // intentionally left blank
                            };
                        }
                        assertion();
                    }));
                });

            });

            describe("HTTP requests", () => {

                it("Successful GET (text)", async () => {
                    const response = await polyOut.fetch(`${this.httpbinUrl}/robots.txt`);
                    await chai$1.assert.eventually.equal(response.text(), "User-agent: *\nDisallow: /deny\n");
                });

                it("Successful GET (json)", async () => {
                    const response = await polyOut.fetch(`${this.httpbinUrl}/json`);
                    await chai$1.assert.eventually.property(response.json(), "slideshow");
                });

                it("Successful GET (plaintext)", async () => {
                    const response = await polyOut.fetch(`${this.httpbinUrl}/robots.txt`);
                    await chai$1.assert.isRejected(response.json(), /json/i);
                });

                it("Successful POST", async () => {
                    const postBody = `"test-post"`;
                    const response = await polyOut.fetch(
                        `${this.httpbinUrl}/anything`,
                        {
                            method: "post",
                            body: postBody,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    const json = await response.json();

                    chai$1.assert.propertyVal(json, "data", postBody);
                    chai$1.assert.propertyVal(json, "method", "POST");
                });

                it("404", async () => {
                    const response = polyOut.fetch(`${this.httpbinUrl}/status/404`);
                    await chai$1.assert.eventually.propertyVal(response, "status", 404);
                });

            });

        });
    }

    run() {
        this.polyIn();
        this.polyOut();
    }

}

/**
 * Convenience function to instantiate the [[PodSpec]] and run it immediately afterwards.
 */
function podSpec(
    pod,
    path = "/",
    httpbinUrl = "https://httpbin.org"
) {
    return new PodSpec(pod, path, httpbinUrl).run();
}

exports.PodSpec = PodSpec;
exports.getHttpbinUrl = getHttpbinUrl;
exports.podSpec = podSpec;
});

var spec$1 = /*@__PURE__*/unwrapExports(spec);

function createCommonjsModule$1(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire$1(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire$1 () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var js_cookie = createCommonjsModule$1(function (module, exports) {
(function (factory) {
	var registeredInModuleLoader;
	{
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
});

var ChainRec = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.tailRec = void 0;
/**
 * @since 2.0.0
 */
function tailRec(a, f) {
    var v = f(a);
    while (v._tag === 'Left') {
        v = f(v.left);
    }
    return v.right;
}
exports.tailRec = tailRec;
});

var _function = createCommonjsModule$1(function (module, exports) {
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hole = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.not = exports.unsafeCoerce = exports.identity = void 0;
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
exports.identity = identity;
/**
 * @since 2.0.0
 */
exports.unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
exports.not = not;
/**
 * @since 2.0.0
 */
function constant(a) {
    return function () { return a; };
}
exports.constant = constant;
/**
 * A thunk that returns always `true`
 *
 * @since 2.0.0
 */
exports.constTrue = function () {
    return true;
};
/**
 * A thunk that returns always `false`
 *
 * @since 2.0.0
 */
exports.constFalse = function () {
    return false;
};
/**
 * A thunk that returns always `null`
 *
 * @since 2.0.0
 */
exports.constNull = function () {
    return null;
};
/**
 * A thunk that returns always `undefined`
 *
 * @since 2.0.0
 */
exports.constUndefined = function () {
    return;
};
/**
 * A thunk that returns always `void`
 *
 * @since 2.0.0
 */
exports.constVoid = function () {
    return;
};
// TODO: remove in v3
/**
 * Flips the order of the arguments of a function of two arguments.
 *
 * @since 2.0.0
 */
function flip(f) {
    return function (b, a) { return f(a, b); };
}
exports.flip = flip;
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
exports.flow = flow;
/**
 * @since 2.0.0
 */
function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
}
exports.tuple = tuple;
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
exports.increment = increment;
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
exports.decrement = decrement;
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
exports.absurd = absurd;
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/lib/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
function tupled(f) {
    return function (a) { return f.apply(void 0, a); };
}
exports.tupled = tupled;
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
function untupled(f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return f(a);
    };
}
exports.untupled = untupled;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
    }
    return;
}
exports.pipe = pipe;
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
exports.hole = absurd;
});

var Either = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = exports.elem = exports.toError = exports.either = exports.getValidationMonoid = exports.MonadThrow = exports.ChainRec = exports.Extend = exports.Alt = exports.Bifunctor = exports.Traversable = exports.Foldable = exports.Monad = exports.Applicative = exports.Functor = exports.getValidationSemigroup = exports.getValidation = exports.getAltValidation = exports.getApplicativeValidation = exports.getWitherable = exports.getApplyMonoid = exports.getApplySemigroup = exports.getSemigroup = exports.getEq = exports.getShow = exports.URI = exports.throwError = exports.sequence = exports.traverse = exports.reduceRight = exports.foldMap = exports.reduce = exports.extend = exports.duplicate = exports.alt = exports.flatten = exports.chainFirst = exports.chain = exports.chainW = exports.of = exports.apSecond = exports.apFirst = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.filterOrElse = exports.orElse = exports.swap = exports.getOrElse = exports.getOrElseW = exports.fold = exports.fromPredicate = exports.fromOption = exports.stringifyJSON = exports.parseJSON = exports.tryCatch = exports.fromNullable = exports.right = exports.left = exports.isRight = exports.isLeft = void 0;


// -------------------------------------------------------------------------------------
// guards
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 *
 * @category guards
 * @since 2.0.0
 */
exports.isLeft = function (ma) { return ma._tag === 'Left'; };
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 *
 * @category guards
 * @since 2.0.0
 */
exports.isRight = function (ma) { return ma._tag === 'Right'; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 *
 * @category constructors
 * @since 2.0.0
 */
exports.left = function (e) { return ({ _tag: 'Left', left: e }); };
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 *
 * @category constructors
 * @since 2.0.0
 */
exports.right = function (a) { return ({ _tag: 'Right', right: a }); };
// TODO: make lazy in v3
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/lib/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category constructors
 * @since 2.0.0
 */
function fromNullable(e) {
    return function (a) { return (a == null ? exports.left(e) : exports.right(a)); };
}
exports.fromNullable = fromNullable;
// TODO: `onError => Lazy<A> => Either` in v3
/**
 * Constructs a new `Either` from a function that might throw
 *
 * @example
 * import { Either, left, right, tryCatch } from 'fp-ts/lib/Either'
 *
 * const unsafeHead = <A>(as: Array<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: Array<A>): Either<Error, A> => {
 *   return tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 * }
 *
 * assert.deepStrictEqual(head([]), left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), right(1))
 *
 * @category constructors
 * @since 2.0.0
 */
function tryCatch(f, onError) {
    try {
        return exports.right(f());
    }
    catch (e) {
        return exports.left(onError(e));
    }
}
exports.tryCatch = tryCatch;
/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 *
 * @example
 * import { parseJSON, toError, right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(parseJSON('{"a":1}', toError), right({ a: 1 }))
 * assert.deepStrictEqual(parseJSON('{"a":}', toError), left(new SyntaxError('Unexpected token } in JSON at position 5')))
 *
 * @category constructors
 * @since 2.0.0
 */
function parseJSON(s, onError) {
    return tryCatch(function () { return JSON.parse(s); }, onError);
}
exports.parseJSON = parseJSON;
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 *
 * @example
 * import * as E from 'fp-ts/lib/Either'
 * import { pipe } from 'fp-ts/lib/function'
 *
 * assert.deepStrictEqual(E.stringifyJSON({ a: 1 }, E.toError), E.right('{"a":1}'))
 * const circular: any = { ref: null }
 * circular.ref = circular
 * assert.deepStrictEqual(
 *   pipe(
 *     E.stringifyJSON(circular, E.toError),
 *     E.mapLeft(e => e.message.includes('Converting circular structure to JSON'))
 *   ),
 *   E.left(true)
 * )
 *
 * @category constructors
 * @since 2.0.0
 */
function stringifyJSON(u, onError) {
    return tryCatch(function () { return JSON.stringify(u); }, onError);
}
exports.stringifyJSON = stringifyJSON;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromOption = function (onNone) { return function (ma) {
    return ma._tag === 'None' ? exports.left(onNone()) : exports.right(ma.value);
}; };
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? exports.right(a) : exports.left(onFalse(a))); }; };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { fold, left, right } from 'fp-ts/lib/Either'
 * import { pipe } from 'fp-ts/lib/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     fold(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     fold(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
function fold(onLeft, onRight) {
    return function (ma) { return (exports.isLeft(ma) ? onLeft(ma.left) : onRight(ma.right)); };
}
exports.fold = fold;
/**
 * Less strict version of [`getOrElse`](#getOrElse).
 *
 * @category destructors
 * @since 2.6.0
 */
exports.getOrElseW = function (onLeft) { return function (ma) {
    return exports.isLeft(ma) ? onLeft(ma.left) : ma.right;
}; };
/**
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = exports.getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.0.0
 */
function swap(ma) {
    return exports.isLeft(ma) ? exports.right(ma.left) : exports.left(ma.right);
}
exports.swap = swap;
/**
 * @category combinators
 * @since 2.0.0
 */
function orElse(onLeft) {
    return function (ma) { return (exports.isLeft(ma) ? onLeft(ma.left) : ma); };
}
exports.orElse = orElse;
/**
 * @category combinators
 * @since 2.0.0
 */
exports.filterOrElse = function (predicate, onFalse) { return function (ma) {
    return chain_(ma, function (a) { return (predicate(a) ? exports.right(a) : exports.left(onFalse(a))); });
}; };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var map_ = function (ma, f) { return (exports.isLeft(ma) ? ma : exports.right(f(ma.right))); };
var ap_ = function (mab, ma) { return (exports.isLeft(mab) ? mab : exports.isLeft(ma) ? ma : exports.right(mab.right(ma.right))); };
var chain_ = function (ma, f) {
    return exports.isLeft(ma) ? ma : f(ma.right);
};
var reduce_ = function (fa, b, f) { return (exports.isLeft(fa) ? b : f(b, fa.right)); };
var foldMap_ = function (M) { return function (fa, f) { return (exports.isLeft(fa) ? M.empty : f(fa.right)); }; };
var reduceRight_ = function (fa, b, f) { return (exports.isLeft(fa) ? b : f(fa.right, b)); };
var traverse_ = function (F) { return function (ma, f) {
    return exports.isLeft(ma) ? F.of(exports.left(ma.left)) : F.map(f(ma.right), exports.right);
}; };
var bimap_ = function (fea, f, g) { return (exports.isLeft(fea) ? exports.left(f(fea.left)) : exports.right(g(fea.right))); };
var mapLeft_ = function (fea, f) { return (exports.isLeft(fea) ? exports.left(f(fea.left)) : fea); };
var alt_ = function (fa, that) { return (exports.isLeft(fa) ? that() : fa); };
var extend_ = function (wa, f) { return (exports.isLeft(wa) ? wa : exports.right(f(wa))); };
var chainRec_ = function (a, f) {
    return ChainRec.tailRec(f(a), function (e) {
        return exports.isLeft(e) ? exports.right(exports.left(e.left)) : exports.isLeft(e.right) ? exports.left(f(e.right.left)) : exports.right(exports.right(e.right.right));
    });
};
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
exports.map = function (f) { return function (fa) { return map_(fa, f); }; };
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.bimap = function (f, g) { return function (fa) { return bimap_(fa, f, g); }; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.mapLeft = function (f) { return function (fa) { return mapLeft_(fa, f); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = function (fa) { return function (fab) {
    return ap_(fab, fa);
}; };
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.apFirst = function (fb) { return function (fa) {
    return ap_(map_(fa, function (a) { return function () { return a; }; }), fb);
}; };
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.apSecond = function (fb) { return function (fa) {
    return ap_(map_(fa, function () { return function (b) { return b; }; }), fb);
}; };
/**
 * @category Applicative
 * @since 2.7.0
 */
exports.of = exports.right;
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
exports.chainW = function (f) { return function (ma) { return chain_(ma, f); }; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
exports.chain = exports.chainW;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category Monad
 * @since 2.0.0
 */
exports.chainFirst = function (f) { return function (ma) {
    return chain_(ma, function (a) { return map_(f(a), function () { return a; }); });
}; };
/**
 * @category Monad
 * @since 2.0.0
 */
exports.flatten = function (mma) { return chain_(mma, _function.identity); };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
exports.alt = function (that) { return function (fa) {
    return alt_(fa, that);
}; };
/**
 * @category Extend
 * @since 2.0.0
 */
exports.duplicate = function (wa) { return extend_(wa, _function.identity); };
/**
 * @category Extend
 * @since 2.0.0
 */
exports.extend = function (f) { return function (ma) {
    return extend_(ma, f);
}; };
/**
 * @category Foldable
 * @since 2.0.0
 */
exports.reduce = function (b, f) { return function (fa) {
    return reduce_(fa, b, f);
}; };
/**
 * @category Foldable
 * @since 2.0.0
 */
exports.foldMap = function (M) {
    var foldMapM = foldMap_(M);
    return function (f) { return function (fa) { return foldMapM(fa, f); }; };
};
/**
 * @category Foldable
 * @since 2.0.0
 */
exports.reduceRight = function (b, f) { return function (fa) {
    return reduceRight_(fa, b, f);
}; };
/**
 * @category Traversable
 * @since 2.6.3
 */
exports.traverse = function (F) {
    var traverseF = traverse_(F);
    return function (f) { return function (fa) { return traverseF(fa, f); }; };
};
/**
 * @category Traversable
 * @since 2.6.3
 */
exports.sequence = function (F) { return function (ma) {
    return exports.isLeft(ma) ? F.of(exports.left(ma.left)) : F.map(ma.right, exports.right);
}; };
/**
 * @category MonadThrow
 * @since 2.6.3
 */
exports.throwError = exports.left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
function getShow(SE, SA) {
    return {
        show: function (ma) { return (exports.isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
    };
}
exports.getShow = getShow;
/**
 * @category instances
 * @since 2.0.0
 */
function getEq(EL, EA) {
    return {
        equals: function (x, y) {
            return x === y || (exports.isLeft(x) ? exports.isLeft(y) && EL.equals(x.left, y.left) : exports.isRight(y) && EA.equals(x.right, y.right));
        }
    };
}
exports.getEq = getEq;
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getSemigroup<string, number>(semigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
function getSemigroup(S) {
    return {
        concat: function (x, y) { return (exports.isLeft(y) ? x : exports.isLeft(x) ? y : exports.right(S.concat(x.right, y.right))); }
    };
}
exports.getSemigroup = getSemigroup;
/**
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @example
 * import { getApplySemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup<string, number>(semigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), left('a'))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), left('b'))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
function getApplySemigroup(S) {
    return {
        concat: function (x, y) { return (exports.isLeft(x) ? x : exports.isLeft(y) ? y : exports.right(S.concat(x.right, y.right))); }
    };
}
exports.getApplySemigroup = getApplySemigroup;
/**
 * @category instances
 * @since 2.0.0
 */
function getApplyMonoid(M) {
    return {
        concat: getApplySemigroup(M).concat,
        empty: exports.right(M.empty)
    };
}
exports.getApplyMonoid = getApplyMonoid;
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.0.0
 */
function getWitherable(M) {
    var empty = exports.left(M.empty);
    var compact = function (ma) {
        return exports.isLeft(ma) ? ma : ma.right._tag === 'None' ? exports.left(M.empty) : exports.right(ma.right.value);
    };
    var separate = function (ma) {
        return exports.isLeft(ma)
            ? { left: ma, right: ma }
            : exports.isLeft(ma.right)
                ? { left: exports.right(ma.right.left), right: empty }
                : { left: empty, right: exports.right(ma.right.right) };
    };
    var partitionMap = function (ma, f) {
        if (exports.isLeft(ma)) {
            return { left: ma, right: ma };
        }
        var e = f(ma.right);
        return exports.isLeft(e) ? { left: exports.right(e.left), right: empty } : { left: empty, right: exports.right(e.right) };
    };
    var partition = function (ma, p) {
        return exports.isLeft(ma)
            ? { left: ma, right: ma }
            : p(ma.right)
                ? { left: empty, right: exports.right(ma.right) }
                : { left: exports.right(ma.right), right: empty };
    };
    var filterMap = function (ma, f) {
        if (exports.isLeft(ma)) {
            return ma;
        }
        var ob = f(ma.right);
        return ob._tag === 'None' ? exports.left(M.empty) : exports.right(ob.value);
    };
    var filter = function (ma, predicate) {
        return exports.isLeft(ma) ? ma : predicate(ma.right) ? ma : exports.left(M.empty);
    };
    var wither = function (F) {
        var traverseF = traverse_(F);
        return function (ma, f) { return F.map(traverseF(ma, f), compact); };
    };
    var wilt = function (F) {
        var traverseF = traverse_(F);
        return function (ma, f) { return F.map(traverseF(ma, f), separate); };
    };
    return {
        URI: exports.URI,
        _E: undefined,
        map: map_,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: filterMap,
        partition: partition,
        partitionMap: partitionMap,
        traverse: traverse_,
        sequence: exports.sequence,
        reduce: reduce_,
        foldMap: foldMap_,
        reduceRight: reduceRight_,
        wither: wither,
        wilt: wilt
    };
}
exports.getWitherable = getWitherable;
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeValidation(SE) {
    return {
        URI: exports.URI,
        _E: undefined,
        map: map_,
        ap: function (fab, fa) {
            return exports.isLeft(fab)
                ? exports.isLeft(fa)
                    ? exports.left(SE.concat(fab.left, fa.left))
                    : fab
                : exports.isLeft(fa)
                    ? fa
                    : exports.right(fab.right(fa.right));
        },
        of: exports.of
    };
}
exports.getApplicativeValidation = getApplicativeValidation;
/**
 * @category instances
 * @since 2.7.0
 */
function getAltValidation(SE) {
    return {
        URI: exports.URI,
        _E: undefined,
        map: map_,
        alt: function (me, that) {
            if (exports.isRight(me)) {
                return me;
            }
            var ea = that();
            return exports.isLeft(ea) ? exports.left(SE.concat(me.left, ea.left)) : ea;
        }
    };
}
exports.getAltValidation = getAltValidation;
// TODO: remove in v3
/**
 * @category instances
 * @since 2.0.0
 */
function getValidation(SE) {
    var applicativeValidation = getApplicativeValidation(SE);
    var altValidation = getAltValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: map_,
        of: exports.of,
        chain: chain_,
        bimap: bimap_,
        mapLeft: mapLeft_,
        reduce: reduce_,
        foldMap: foldMap_,
        reduceRight: reduceRight_,
        extend: extend_,
        traverse: traverse_,
        sequence: exports.sequence,
        chainRec: chainRec_,
        throwError: exports.throwError,
        ap: applicativeValidation.ap,
        alt: altValidation.alt
    };
}
exports.getValidation = getValidation;
/**
 * @category instances
 * @since 2.0.0
 */
function getValidationSemigroup(SE, SA) {
    return {
        concat: function (x, y) {
            return exports.isLeft(x) ? (exports.isLeft(y) ? exports.left(SE.concat(x.left, y.left)) : x) : exports.isLeft(y) ? y : exports.right(SA.concat(x.right, y.right));
        }
    };
}
exports.getValidationSemigroup = getValidationSemigroup;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: map_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of,
    chain: chain_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: map_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports.sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: bimap_,
    mapLeft: mapLeft_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: map_,
    extend: extend_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ChainRec = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    chain: chain_,
    chainRec: chainRec_
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of,
    chain: chain_,
    throwError: exports.throwError
};
// TODO: remove in v3
/**
 * @category instances
 * @since 2.0.0
 */
function getValidationMonoid(SE, SA) {
    return {
        concat: getValidationSemigroup(SE, SA).concat,
        empty: exports.right(SA.empty)
    };
}
exports.getValidationMonoid = getValidationMonoid;
/**
 * @category instances
 * @since 2.0.0
 */
exports.either = {
    URI: exports.URI,
    map: map_,
    of: exports.of,
    ap: ap_,
    chain: chain_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports.sequence,
    bimap: bimap_,
    mapLeft: mapLeft_,
    alt: alt_,
    extend: extend_,
    chainRec: chainRec_,
    throwError: exports.throwError
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
exports.toError = toError;
/**
 * @since 2.0.0
 */
function elem(E) {
    return function (a, ma) { return (exports.isLeft(ma) ? false : E.equals(a, ma.right)); };
}
exports.elem = elem;
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/lib/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
function exists(predicate) {
    return function (ma) { return (exports.isLeft(ma) ? false : predicate(ma.right)); };
}
exports.exists = exists;
});

var pipeable_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeable = exports.pipe = void 0;

// TODO: remove module in v3
/**
 * Use [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#flow) from `function` module instead.
 *
 * @since 2.0.0
 */
exports.pipe = _function.pipe;
var isFunctor = function (I) { return typeof I.map === 'function'; };
var isContravariant = function (I) { return typeof I.contramap === 'function'; };
var isFunctorWithIndex = function (I) { return typeof I.mapWithIndex === 'function'; };
var isApply = function (I) { return typeof I.ap === 'function'; };
var isChain = function (I) { return typeof I.chain === 'function'; };
var isBifunctor = function (I) { return typeof I.bimap === 'function'; };
var isExtend = function (I) { return typeof I.extend === 'function'; };
var isFoldable = function (I) { return typeof I.reduce === 'function'; };
var isFoldableWithIndex = function (I) { return typeof I.reduceWithIndex === 'function'; };
var isAlt = function (I) { return typeof I.alt === 'function'; };
var isCompactable = function (I) { return typeof I.compact === 'function'; };
var isFilterable = function (I) { return typeof I.filter === 'function'; };
var isFilterableWithIndex = function (I) {
    return typeof I.filterWithIndex === 'function';
};
var isProfunctor = function (I) { return typeof I.promap === 'function'; };
var isSemigroupoid = function (I) { return typeof I.compose === 'function'; };
var isMonadThrow = function (I) { return typeof I.throwError === 'function'; };
function pipeable(I) {
    var r = {};
    if (isFunctor(I)) {
        var map = function (f) { return function (fa) { return I.map(fa, f); }; };
        r.map = map;
    }
    if (isContravariant(I)) {
        var contramap = function (f) { return function (fa) { return I.contramap(fa, f); }; };
        r.contramap = contramap;
    }
    if (isFunctorWithIndex(I)) {
        var mapWithIndex = function (f) { return function (fa) { return I.mapWithIndex(fa, f); }; };
        r.mapWithIndex = mapWithIndex;
    }
    if (isApply(I)) {
        var ap = function (fa) { return function (fab) { return I.ap(fab, fa); }; };
        var apFirst = function (fb) { return function (fa) {
            return I.ap(I.map(fa, function (a) { return function () { return a; }; }), fb);
        }; };
        r.ap = ap;
        r.apFirst = apFirst;
        r.apSecond = function (fb) { return function (fa) {
            return I.ap(I.map(fa, function () { return function (b) { return b; }; }), fb);
        }; };
    }
    if (isChain(I)) {
        var chain = function (f) { return function (ma) { return I.chain(ma, f); }; };
        var chainFirst = function (f) { return function (ma) { return I.chain(ma, function (a) { return I.map(f(a), function () { return a; }); }); }; };
        var flatten = function (mma) { return I.chain(mma, _function.identity); };
        r.chain = chain;
        r.chainFirst = chainFirst;
        r.flatten = flatten;
    }
    if (isBifunctor(I)) {
        var bimap = function (f, g) { return function (fa) { return I.bimap(fa, f, g); }; };
        var mapLeft = function (f) { return function (fa) { return I.mapLeft(fa, f); }; };
        r.bimap = bimap;
        r.mapLeft = mapLeft;
    }
    if (isExtend(I)) {
        var extend = function (f) { return function (wa) { return I.extend(wa, f); }; };
        var duplicate = function (wa) { return I.extend(wa, _function.identity); };
        r.extend = extend;
        r.duplicate = duplicate;
    }
    if (isFoldable(I)) {
        var reduce = function (b, f) { return function (fa) { return I.reduce(fa, b, f); }; };
        var foldMap = function (M) {
            var foldMapM = I.foldMap(M);
            return function (f) { return function (fa) { return foldMapM(fa, f); }; };
        };
        var reduceRight = function (b, f) { return function (fa) { return I.reduceRight(fa, b, f); }; };
        r.reduce = reduce;
        r.foldMap = foldMap;
        r.reduceRight = reduceRight;
    }
    if (isFoldableWithIndex(I)) {
        var reduceWithIndex = function (b, f) { return function (fa) {
            return I.reduceWithIndex(fa, b, f);
        }; };
        var foldMapWithIndex = function (M) {
            var foldMapM = I.foldMapWithIndex(M);
            return function (f) { return function (fa) { return foldMapM(fa, f); }; };
        };
        var reduceRightWithIndex = function (b, f) { return function (fa) {
            return I.reduceRightWithIndex(fa, b, f);
        }; };
        r.reduceWithIndex = reduceWithIndex;
        r.foldMapWithIndex = foldMapWithIndex;
        r.reduceRightWithIndex = reduceRightWithIndex;
    }
    if (isAlt(I)) {
        var alt = function (that) { return function (fa) { return I.alt(fa, that); }; };
        r.alt = alt;
    }
    if (isCompactable(I)) {
        r.compact = I.compact;
        r.separate = I.separate;
    }
    if (isFilterable(I)) {
        var filter = function (predicate) { return function (fa) {
            return I.filter(fa, predicate);
        }; };
        var filterMap = function (f) { return function (fa) { return I.filterMap(fa, f); }; };
        var partition = function (predicate) { return function (fa) {
            return I.partition(fa, predicate);
        }; };
        var partitionMap = function (f) { return function (fa) { return I.partitionMap(fa, f); }; };
        r.filter = filter;
        r.filterMap = filterMap;
        r.partition = partition;
        r.partitionMap = partitionMap;
    }
    if (isFilterableWithIndex(I)) {
        var filterWithIndex = function (predicateWithIndex) { return function (fa) { return I.filterWithIndex(fa, predicateWithIndex); }; };
        var filterMapWithIndex = function (f) { return function (fa) {
            return I.filterMapWithIndex(fa, f);
        }; };
        var partitionWithIndex = function (predicateWithIndex) { return function (fa) { return I.partitionWithIndex(fa, predicateWithIndex); }; };
        var partitionMapWithIndex = function (f) { return function (fa) {
            return I.partitionMapWithIndex(fa, f);
        }; };
        r.filterWithIndex = filterWithIndex;
        r.filterMapWithIndex = filterMapWithIndex;
        r.partitionWithIndex = partitionWithIndex;
        r.partitionMapWithIndex = partitionMapWithIndex;
    }
    if (isProfunctor(I)) {
        var promap = function (f, g) { return function (fa) { return I.promap(fa, f, g); }; };
        r.promap = promap;
    }
    if (isSemigroupoid(I)) {
        var compose = function (that) { return function (fa) { return I.compose(fa, that); }; };
        r.compose = compose;
    }
    if (isMonadThrow(I)) {
        var fromOption = function (onNone) { return function (ma) {
            return ma._tag === 'None' ? I.throwError(onNone()) : I.of(ma.value);
        }; };
        var fromEither = function (ma) {
            return ma._tag === 'Left' ? I.throwError(ma.left) : I.of(ma.right);
        };
        var fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); }; };
        var filterOrElse = function (predicate, onFalse) { return function (ma) { return I.chain(ma, function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); }); }; };
        r.fromOption = fromOption;
        r.fromEither = fromEither;
        r.fromPredicate = fromPredicate;
        r.filterOrElse = filterOrElse;
    }
    return r;
}
exports.pipeable = pipeable;
});

var FreeSemigroup = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemigroup = exports.fold = exports.concat = exports.of = void 0;
/**
 * @category constructors
 * @since 2.2.7
 */
exports.of = function (a) { return ({ _tag: 'Of', value: a }); };
/**
 * @category constructors
 * @since 2.2.7
 */
exports.concat = function (left, right) { return ({
    _tag: 'Concat',
    left: left,
    right: right
}); };
/**
 * @category destructors
 * @since 2.2.7
 */
exports.fold = function (onOf, onConcat) { return function (f) {
    switch (f._tag) {
        case 'Of':
            return onOf(f.value);
        case 'Concat':
            return onConcat(f.left, f.right);
    }
}; };
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return { concat: exports.concat };
}
exports.getSemigroup = getSemigroup;
});

var DecodeError = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemigroup = exports.fold = exports.lazy = exports.member = exports.index = exports.key = exports.leaf = exports.optional = exports.required = void 0;

/**
 * @category model
 * @since 2.2.7
 */
exports.required = 'required';
/**
 * @category model
 * @since 2.2.7
 */
exports.optional = 'optional';
/**
 * @category constructors
 * @since 2.2.7
 */
exports.leaf = function (actual, error) { return ({ _tag: 'Leaf', actual: actual, error: error }); };
/**
 * @category constructors
 * @since 2.2.7
 */
exports.key = function (key, kind, errors) { return ({
    _tag: 'Key',
    key: key,
    kind: kind,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.7
 */
exports.index = function (index, kind, errors) { return ({
    _tag: 'Index',
    index: index,
    kind: kind,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.7
 */
exports.member = function (index, errors) { return ({
    _tag: 'Member',
    index: index,
    errors: errors
}); };
/**
 * @category constructors
 * @since 2.2.7
 */
exports.lazy = function (id, errors) { return ({
    _tag: 'Lazy',
    id: id,
    errors: errors
}); };
/**
 * @category destructors
 * @since 2.2.7
 */
exports.fold = function (patterns) {
    var f = function (e) {
        switch (e._tag) {
            case 'Leaf':
                return patterns.Leaf(e.actual, e.error);
            case 'Key':
                return patterns.Key(e.key, e.kind, e.errors);
            case 'Index':
                return patterns.Index(e.index, e.kind, e.errors);
            case 'Member':
                return patterns.Member(e.index, e.errors);
            case 'Lazy':
                return patterns.Lazy(e.id, e.errors);
        }
    };
    return f;
};
/**
 * @category instances
 * @since 2.2.7
 */
function getSemigroup() {
    return FreeSemigroup.getSemigroup();
}
exports.getSemigroup = getSemigroup;
});

var Schemable = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersect_ = exports.memoize = void 0;
/**
 * @since 2.2.0
 */
function memoize(f) {
    var cache = new Map();
    return function (a) {
        if (!cache.has(a)) {
            var b = f(a);
            cache.set(a, b);
            return b;
        }
        return cache.get(a);
    };
}
exports.memoize = memoize;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
var typeOf = function (x) { return (x === null ? 'null' : typeof x); };
/**
 * @internal
 */
exports.intersect_ = function (a, b) {
    if (a !== undefined && b !== undefined) {
        var tx = typeOf(a);
        var ty = typeOf(b);
        if (tx === 'object' || ty === 'object') {
            return Object.assign({}, a, b);
        }
    }
    return b;
};
});

var Guard = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemableGuard = exports.URI = exports.lazy = exports.sum = exports.union = exports.intersect = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.nullable = exports.refine = exports.object = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.literal = void 0;
/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community, see these tracking
 * [issues](https://github.com/gcanti/io-ts/issues?q=label%3Av2.2+) for further discussions and enhancements.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.2.0
 */


// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.0
 */
exports.literal = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return values.findIndex(function (a) { return a === u; }) !== -1; }
    });
};
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.0
 */
exports.string = {
    is: function (u) { return typeof u === 'string'; }
};
/**
 * Note: `NaN` is excluded.
 *
 * @category primitives
 * @since 2.2.0
 */
exports.number = {
    is: function (u) { return typeof u === 'number' && !isNaN(u); }
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.boolean = {
    is: function (u) { return typeof u === 'boolean'; }
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.UnknownArray = {
    is: Array.isArray
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.UnknownRecord = {
    is: function (u) { return Object.prototype.toString.call(u) === '[object Object]'; }
};
/**
 * @internal
 */
exports.object = {
    is: function (u) { return u != null && !exports.string.is(u) && !exports.number.is(u) && !exports.boolean.is(u); }
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.0
 */
exports.refine = function (refinement) { return function (from) { return ({
    is: function (u) { return from.is(u) && refinement(u); }
}); }; };
/**
 * @category combinators
 * @since 2.2.0
 */
exports.nullable = function (or) { return ({
    is: function (u) { return u === null || or.is(u); }
}); };
/**
 * @category combinators
 * @since 2.2.0
 */
exports.type = function (properties) {
    return pipeable_1.pipe(exports.UnknownRecord, exports.refine(function (r) {
        for (var k in properties) {
            if (!(k in r) || !properties[k].is(r[k])) {
                return false;
            }
        }
        return true;
    }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
exports.partial = function (properties) {
    return pipeable_1.pipe(exports.UnknownRecord, exports.refine(function (r) {
        for (var k in properties) {
            var v = r[k];
            if (v !== undefined && !properties[k].is(v)) {
                return false;
            }
        }
        return true;
    }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
exports.record = function (codomain) {
    return pipeable_1.pipe(exports.UnknownRecord, exports.refine(function (r) {
        for (var k in r) {
            if (!codomain.is(r[k])) {
                return false;
            }
        }
        return true;
    }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
exports.array = function (items) {
    return pipeable_1.pipe(exports.UnknownArray, exports.refine(function (us) { return us.every(items.is); }));
};
/**
 * @category combinators
 * @since 2.2.0
 */
exports.tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return Array.isArray(u) && u.length === components.length && components.every(function (c, i) { return c.is(u[i]); }); }
    });
};
/**
 * @category combinators
 * @since 2.2.0
 */
exports.intersect = function (right) { return function (left) { return ({
    is: function (u) { return left.is(u) && right.is(u); }
}); }; };
/**
 * @category combinators
 * @since 2.2.0
 */
exports.union = function () {
    var members = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        members[_i] = arguments[_i];
    }
    return ({
        is: function (u) { return members.some(function (m) { return m.is(u); }); }
    });
};
/**
 * @category combinators
 * @since 2.2.0
 */
exports.sum = function (tag) { return function (members) {
    return pipeable_1.pipe(exports.UnknownRecord, exports.refine(function (r) {
        var v = r[tag];
        if (v in members) {
            return members[v].is(r);
        }
        return false;
    }));
}; };
/**
 * @category combinators
 * @since 2.2.0
 */
exports.lazy = function (f) {
    var get = Schemable.memoize(f);
    return {
        is: function (u) { return get().is(u); }
    };
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.0
 */
exports.URI = 'io-ts/Guard';
/**
 * @category instances
 * @since 2.2.3
 */
exports.schemableGuard = {
    URI: exports.URI,
    literal: exports.literal,
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    nullable: exports.nullable,
    type: exports.type,
    partial: exports.partial,
    record: exports.record,
    array: exports.array,
    tuple: exports.tuple,
    intersect: exports.intersect,
    sum: exports.sum,
    lazy: function (_, f) { return exports.lazy(f); },
    UnknownArray: exports.UnknownArray,
    UnknownRecord: exports.UnknownRecord,
    union: exports.union,
    refine: exports.refine
};
});

var Kleisli = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.alt = exports.map = exports.compose = exports.lazy = exports.sum = exports.intersect = exports.union = exports.tuple = exports.record = exports.array = exports.partial = exports.type = exports.nullable = exports.parse = exports.refine = exports.mapLeftWithInput = exports.literal = exports.fromRefinement = void 0;



// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
function fromRefinement(M) {
    return function (refinement, onError) { return ({
        decode: function (i) { return (refinement(i) ? M.of(i) : M.throwError(onError(i))); }
    }); };
}
exports.fromRefinement = fromRefinement;
/**
 * @category constructors
 * @since 2.2.7
 */
function literal(M) {
    return function (onError) { return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return ({
            decode: function (i) { return (Guard.literal.apply(Guard, values).is(i) ? M.of(i) : M.throwError(onError(i, values))); }
        });
    }; };
}
exports.literal = literal;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
function mapLeftWithInput(M) {
    return function (f) { return function (decoder) { return ({
        decode: function (i) { return M.mapLeft(decoder.decode(i), function (e) { return f(i, e); }); }
    }); }; };
}
exports.mapLeftWithInput = mapLeftWithInput;
/**
 * @category combinators
 * @since 2.2.7
 */
function refine(M) {
    return function (refinement, onError) { return function (from) { return compose(M)(fromRefinement(M)(refinement, onError))(from); }; };
}
exports.refine = refine;
/**
 * @category combinators
 * @since 2.2.7
 */
function parse(M) {
    return function (decode) { return function (from) { return compose(M)({ decode: decode })(from); }; };
}
exports.parse = parse;
/**
 * @category combinators
 * @since 2.2.7
 */
function nullable(M) {
    return function (onError) { return function (or) { return ({
        decode: function (i) {
            return i === null
                ? M.of(null)
                : M.bimap(or.decode(i), function (e) { return onError(i, e); }, function (a) { return a; });
        }
    }); }; };
}
exports.nullable = nullable;
/**
 * @category combinators
 * @since 2.2.7
 */
function type(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return traverse(properties, function (key, decoder) {
                return M.mapLeft(decoder.decode(i[key]), function (e) { return onPropertyError(key, e); });
            });
        }
    }); }; };
}
exports.type = type;
/**
 * @category combinators
 * @since 2.2.7
 */
function partial(M) {
    var traverse = traverseRecordWithIndex(M);
    var undefinedProperty = M.of(Either.right(undefined));
    var skipProperty = M.of(Either.left(undefined));
    return function (onPropertyError) { return function (properties) { return ({
        decode: function (i) {
            return M.map(traverse(properties, function (key, decoder) {
                var ikey = i[key];
                if (ikey === undefined) {
                    return key in i
                        ? // don't strip undefined properties
                            undefinedProperty
                        : // don't add missing properties
                            skipProperty;
                }
                return M.bimap(decoder.decode(ikey), function (e) { return onPropertyError(key, e); }, function (a) { return Either.right(a); });
            }), compactRecord);
        }
    }); }; };
}
exports.partial = partial;
/**
 * @category combinators
 * @since 2.2.7
 */
function array(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onItemError) { return function (items) { return ({
        decode: function (is) { return traverse(is, function (index, i) { return M.mapLeft(items.decode(i), function (e) { return onItemError(index, e); }); }); }
    }); }; };
}
exports.array = array;
/**
 * @category combinators
 * @since 2.2.7
 */
function record(M) {
    var traverse = traverseRecordWithIndex(M);
    return function (onKeyError) { return function (codomain) { return ({
        decode: function (ir) { return traverse(ir, function (key, i) { return M.mapLeft(codomain.decode(i), function (e) { return onKeyError(key, e); }); }); }
    }); }; };
}
exports.record = record;
/**
 * @category combinators
 * @since 2.2.7
 */
function tuple(M) {
    var traverse = traverseArrayWithIndex(M);
    return function (onIndexError) { return function () {
        var components = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            components[_i] = arguments[_i];
        }
        return ({
            decode: function (is) {
                return traverse(components, function (index, decoder) {
                    return M.mapLeft(decoder.decode(is[index]), function (e) { return onIndexError(index, e); });
                });
            }
        });
    }; };
}
exports.tuple = tuple;
/**
 * @category combinators
 * @since 2.2.7
 */
function union(M) {
    return function (onMemberError) { return function () {
        var members = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            members[_i] = arguments[_i];
        }
        return ({
            decode: function (i) {
                var out = M.mapLeft(members[0].decode(i), function (e) { return onMemberError(0, e); });
                var _loop_1 = function (index) {
                    out = M.alt(out, function () { return M.mapLeft(members[index].decode(i), function (e) { return onMemberError(index, e); }); });
                };
                for (var index = 1; index < members.length; index++) {
                    _loop_1(index);
                }
                return out;
            }
        });
    }; };
}
exports.union = union;
/**
 * @category combinators
 * @since 2.2.7
 */
function intersect(M) {
    return function (right) { return function (left) { return ({
        decode: function (i) {
            return M.ap(M.map(left.decode(i), function (a) { return function (b) { return Schemable.intersect_(a, b); }; }), right.decode(i));
        }
    }); }; };
}
exports.intersect = intersect;
/**
 * @category combinators
 * @since 2.2.7
 */
function sum(M) {
    return function (onTagError) { return function (tag) { return function (members) {
        var keys = Object.keys(members);
        return {
            decode: function (ir) {
                var v = ir[tag];
                if (v in members) {
                    return members[v].decode(ir);
                }
                return M.throwError(onTagError(tag, v, keys));
            }
        };
    }; }; };
}
exports.sum = sum;
/**
 * @category combinators
 * @since 2.2.7
 */
function lazy(M) {
    return function (onError) { return function (id, f) {
        var get = Schemable.memoize(f);
        return {
            decode: function (u) { return M.mapLeft(get().decode(u), function (e) { return onError(id, e); }); }
        };
    }; };
}
exports.lazy = lazy;
/**
 * @category combinators
 * @since 2.2.7
 */
function compose(M) {
    return function (ab) { return function (ia) { return ({
        decode: function (i) { return M.chain(ia.decode(i), ab.decode); }
    }); }; };
}
exports.compose = compose;
/**
 * @category combinators
 * @since 2.2.7
 */
function map(F) {
    return function (f) { return function (ia) { return ({
        decode: function (i) { return F.map(ia.decode(i), f); }
    }); }; };
}
exports.map = map;
/**
 * @category combinators
 * @since 2.2.7
 */
function alt(A) {
    return function (that) { return function (me) { return ({
        decode: function (i) { return A.alt(me.decode(i), function () { return that().decode(i); }); }
    }); }; };
}
exports.alt = alt;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
var traverseArrayWithIndex = function (M) { return function (as, f) {
    return as.reduce(function (mbs, a, i) {
        return M.ap(M.map(mbs, function (bs) { return function (b) {
            bs.push(b);
            return bs;
        }; }), f(i, a));
    }, M.of([]));
}; };
var traverseRecordWithIndex = function (M) { return function (r, f) {
    var ks = Object.keys(r);
    if (ks.length === 0) {
        return M.of({});
    }
    var fr = M.of({});
    var _loop_2 = function (key) {
        fr = M.ap(M.map(fr, function (r) { return function (b) {
            r[key] = b;
            return r;
        }; }), f(key, r[key]));
    };
    for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
        var key = ks_1[_i];
        _loop_2(key);
    }
    return fr;
}; };
var compactRecord = function (r) {
    var out = {};
    for (var k in r) {
        var rk = r[k];
        if (Either.isRight(rk)) {
            out[k] = rk.right;
        }
    }
    return out;
};
});

var KleisliDecoder = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.alt = exports.map = exports.compose = exports.lazy = exports.sum = exports.intersect = exports.union = exports.tuple = exports.record = exports.array = exports.partial = exports.type = exports.nullable = exports.parse = exports.refine = exports.mapLeftWithInput = exports.literal = exports.fromRefinement = exports.failure = exports.success = exports.error = exports.ap = exports.SE = void 0;





// -------------------------------------------------------------------------------------
// Kleisli config
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
exports.SE = 
/*#__PURE__*/
DecodeError.getSemigroup();
/**
 * @internal
 */
exports.ap = function (fab, fa) {
    return Either.isLeft(fab)
        ? Either.isLeft(fa)
            ? Either.left(exports.SE.concat(fab.left, fa.left))
            : fab
        : Either.isLeft(fa)
            ? fa
            : Either.right(fab.right(fa.right));
};
var M = {
    URI: Either.URI,
    _E: undefined,
    map: function (fa, f) { return pipeable_1.pipe(fa, Either.map(f)); },
    ap: exports.ap,
    of: Either.right,
    chain: function (ma, f) { return pipeable_1.pipe(ma, Either.chain(f)); },
    throwError: Either.left,
    bimap: function (fa, f, g) { return pipeable_1.pipe(fa, Either.bimap(f, g)); },
    mapLeft: function (fa, f) { return pipeable_1.pipe(fa, Either.mapLeft(f)); },
    alt: function (me, that) {
        if (Either.isRight(me)) {
            return me;
        }
        var ea = that();
        return Either.isLeft(ea) ? Either.left(exports.SE.concat(me.left, ea.left)) : ea;
    }
};
/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.error = function (actual, message) { return FreeSemigroup.of(DecodeError.leaf(actual, message)); };
/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.success = Either.right;
/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.failure = function (actual, message) {
    return Either.left(exports.error(actual, message));
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
exports.fromRefinement = function (refinement, expected) {
    return Kleisli.fromRefinement(M)(refinement, function (u) { return exports.error(u, expected); });
};
/**
 * @category constructors
 * @since 2.2.7
 */
exports.literal = 
/*#__PURE__*/
Kleisli.literal(M)(function (u, values) { return exports.error(u, values.map(function (value) { return JSON.stringify(value); }).join(' | ')); });
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
exports.mapLeftWithInput = 
/*#__PURE__*/
Kleisli.mapLeftWithInput(M);
/**
 * @category combinators
 * @since 2.2.7
 */
exports.refine = function (refinement, id) { return Kleisli.refine(M)(refinement, function (a) { return exports.error(a, id); }); };
/**
 * @category combinators
 * @since 2.2.7
 */
exports.parse = 
/*#__PURE__*/
Kleisli.parse(M);
/**
 * @category combinators
 * @since 2.2.7
 */
exports.nullable = 
/*#__PURE__*/
Kleisli.nullable(M)(function (u, e) { return FreeSemigroup.concat(FreeSemigroup.of(DecodeError.member(0, exports.error(u, 'null'))), FreeSemigroup.of(DecodeError.member(1, e))); });
/**
 * @category combinators
 * @since 2.2.7
 */
exports.type = function (properties) {
    return Kleisli.type(M)(function (k, e) { return FreeSemigroup.of(DecodeError.key(k, DecodeError.required, e)); })(properties);
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.partial = function (properties) {
    return Kleisli.partial(M)(function (k, e) { return FreeSemigroup.of(DecodeError.key(k, DecodeError.optional, e)); })(properties);
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.array = function (items) {
    return Kleisli.array(M)(function (i, e) { return FreeSemigroup.of(DecodeError.index(i, DecodeError.optional, e)); })(items);
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.record = function (codomain) {
    return Kleisli.record(M)(function (k, e) { return FreeSemigroup.of(DecodeError.key(k, DecodeError.optional, e)); })(codomain);
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return Kleisli.tuple(M)(function (i, e) { return FreeSemigroup.of(DecodeError.index(i, DecodeError.required, e)); }).apply(void 0, components);
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.union = 
/*#__PURE__*/
Kleisli.union(M)(function (i, e) { return FreeSemigroup.of(DecodeError.member(i, e)); });
/**
 * @category combinators
 * @since 2.2.7
 */
exports.intersect = 
/*#__PURE__*/
Kleisli.intersect(M);
/**
 * @category combinators
 * @since 2.2.7
 */
exports.sum = function (tag) { return function (members) {
    return Kleisli.sum(M)(function (tag, value, keys) {
        return FreeSemigroup.of(DecodeError.key(tag, DecodeError.required, exports.error(value, keys.length === 0 ? 'never' : keys.map(function (k) { return JSON.stringify(k); }).join(' | '))));
    })(tag)(members);
}; };
/**
 * @category combinators
 * @since 2.2.7
 */
exports.lazy = 
/*#__PURE__*/
Kleisli.lazy(M)(function (id, e) { return FreeSemigroup.of(DecodeError.lazy(id, e)); });
/**
 * @category combinators
 * @since 2.2.7
 */
exports.compose = 
/*#__PURE__*/
Kleisli.compose(M);
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 2.2.7
 */
exports.map = 
/*#__PURE__*/
Kleisli.map(M);
/**
 * @category Alt
 * @since 2.2.7
 */
exports.alt = 
/*#__PURE__*/
Kleisli.alt(M);
});

var Decoder = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.draw = exports.schemableDecoder = exports.altDecoder = exports.functorDecoder = exports.URI = exports.alt = exports.map = exports.compose = exports.lazy = exports.sum = exports.intersect = exports.union = exports.tuple = exports.record = exports.array = exports.partial = exports.type = exports.nullable = exports.parse = exports.refine = exports.mapLeftWithInput = exports.object = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.literal = exports.fromGuard = exports.failure = exports.success = exports.error = void 0;






/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.error = KleisliDecoder.error;
/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.success = KleisliDecoder.success;
/**
 * @category DecodeError
 * @since 2.2.7
 */
exports.failure = KleisliDecoder.failure;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.2.7
 */
exports.fromGuard = function (guard, expected) { return KleisliDecoder.fromRefinement(guard.is, expected); };
/**
 * @category constructors
 * @since 2.2.7
 */
exports.literal = KleisliDecoder.literal;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @category primitives
 * @since 2.2.7
 */
exports.string = 
/*#__PURE__*/
exports.fromGuard(Guard.string, 'string');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.number = 
/*#__PURE__*/
exports.fromGuard(Guard.number, 'number');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.boolean = 
/*#__PURE__*/
exports.fromGuard(Guard.boolean, 'boolean');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.UnknownArray = 
/*#__PURE__*/
exports.fromGuard(Guard.UnknownArray, 'Array<unknown>');
/**
 * @category primitives
 * @since 2.2.7
 */
exports.UnknownRecord = 
/*#__PURE__*/
exports.fromGuard(Guard.UnknownRecord, 'Record<string, unknown>');
/**
 * @internal
 */
exports.object = 
/*#__PURE__*/
exports.fromGuard(Guard.object, 'object');
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.7
 */
exports.mapLeftWithInput = KleisliDecoder.mapLeftWithInput;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.refine = KleisliDecoder.refine;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.parse = KleisliDecoder.parse;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.nullable = KleisliDecoder.nullable;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.type = function (properties) {
    return pipeable_1.pipe(exports.object, exports.compose(KleisliDecoder.type(properties)));
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.partial = function (properties) {
    return pipeable_1.pipe(exports.object, exports.compose(KleisliDecoder.partial(properties)));
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.array = function (items) { return pipeable_1.pipe(exports.UnknownArray, exports.compose(KleisliDecoder.array(items))); };
/**
 * @category combinators
 * @since 2.2.7
 */
exports.record = function (codomain) {
    return pipeable_1.pipe(exports.UnknownRecord, exports.compose(KleisliDecoder.record(codomain)));
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.tuple = function () {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return pipeable_1.pipe(exports.UnknownArray, exports.compose(KleisliDecoder.tuple.apply(KleisliDecoder, components)));
};
/**
 * @category combinators
 * @since 2.2.7
 */
exports.union = KleisliDecoder.union;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.intersect = KleisliDecoder.intersect;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.sum = function (tag) { return function (members) {
    return pipeable_1.pipe(exports.object, exports.compose(KleisliDecoder.sum(tag)(members)));
}; };
/**
 * @category combinators
 * @since 2.2.7
 */
exports.lazy = KleisliDecoder.lazy;
/**
 * @category combinators
 * @since 2.2.7
 */
exports.compose = KleisliDecoder.compose;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var map_ = function (fa, f) { return pipeable_1.pipe(fa, exports.map(f)); };
var alt_ = function (me, that) { return pipeable_1.pipe(me, exports.alt(that)); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 2.2.7
 */
exports.map = KleisliDecoder.map;
/**
 * @category Alt
 * @since 2.2.7
 */
exports.alt = KleisliDecoder.alt;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.2.7
 */
exports.URI = 'io-ts/Decoder';
/**
 * @category instances
 * @since 2.2.7
 */
exports.functorDecoder = {
    URI: exports.URI,
    map: map_
};
/**
 * @category instances
 * @since 2.2.7
 */
exports.altDecoder = {
    URI: exports.URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 2.2.7
 */
exports.schemableDecoder = {
    URI: exports.URI,
    literal: exports.literal,
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    nullable: exports.nullable,
    type: exports.type,
    partial: exports.partial,
    record: exports.record,
    array: exports.array,
    tuple: exports.tuple,
    intersect: exports.intersect,
    sum: exports.sum,
    lazy: exports.lazy,
    UnknownArray: exports.UnknownArray,
    UnknownRecord: exports.UnknownRecord,
    union: exports.union,
    refine: exports.refine
};
var empty = [];
var make = function (value, forest) {
    if (forest === void 0) { forest = empty; }
    return ({
        value: value,
        forest: forest
    });
};
var drawTree = function (tree) { return tree.value + drawForest('\n', tree.forest); };
var drawForest = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += drawForest(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
var toTree = DecodeError.fold({
    Leaf: function (input, error) { return make("cannot decode " + JSON.stringify(input) + ", should be " + error); },
    Key: function (key, kind, errors) { return make(kind + " property " + JSON.stringify(key), toForest(errors)); },
    Index: function (index, kind, errors) { return make(kind + " index " + index, toForest(errors)); },
    Member: function (index, errors) { return make("member " + index, toForest(errors)); },
    Lazy: function (id, errors) { return make("lazy type " + id, toForest(errors)); }
});
var toForest = FreeSemigroup.fold(function (value) { return [toTree(value)]; }, function (left, right) { return toForest(left).concat(toForest(right)); });
/**
 * @since 2.2.7
 */
exports.draw = function (e) { return toForest(e).map(drawTree).join('\n'); };
/**
 * @internal
 */
exports.stringify = 
/*#__PURE__*/
Either.fold(exports.draw, function (a) { return JSON.stringify(a, null, 2); });
});

/**
 * Abstract superclass for all term types defined in this module. It should not be subclassed outside of this module.
 *
 * This class defines a generic [[equals]] function according to the RDFJS specification.
 */
class Model {
    

    equals(other) {
        if (!other || other.termType !== this.termType)
            return false;

        for (const [key, value] of Object.entries(this)) {
            const otherValue = (other )[key];
            if (value instanceof Model) {
                if (!value.equals(otherValue))
                    return false;
            }
            else if (otherValue !== value)
                return false;
        }

        return true;
    }
}

class NamedNode extends Model  {
    __init() {this.termType = "NamedNode";}

    constructor(
         value
    ) {
        super();this.value = value;NamedNode.prototype.__init.call(this);        Object.freeze(this);
    }
}

class BlankNode extends Model  {
     static __initStatic() {this.nextId = 0;}

    __init2() {this.termType = "BlankNode";}

    

    constructor(
        value
    ) {
        super();BlankNode.prototype.__init2.call(this);
        if (value)
            this.value = value;
        else
            this.value = "b" + (++BlankNode.nextId);

        Object.freeze(this);
    }
} BlankNode.__initStatic();

class Literal extends Model  {
    static  __initStatic2() {this.langStringDatatype = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');}
    static  __initStatic3() {this.stringDatatype = new NamedNode('http://www.w3.org/2001/XMLSchema#string');}

    
    
    __init3() {this.termType = "Literal";}

    constructor(
         value,
        languageOrDatatype
    ) {
        super();this.value = value;Literal.prototype.__init3.call(this);
        if (typeof languageOrDatatype === "string") {
            if (languageOrDatatype.indexOf(":") === -1) {
                this.language = languageOrDatatype;
                this.datatype = Literal.langStringDatatype;
            }
            else {
                this.language = "";
                this.datatype = new NamedNode(languageOrDatatype);
            }
        }
        else {
            this.language = "";
            this.datatype = languageOrDatatype || Literal.stringDatatype;
        }

        Object.freeze(this);
    }
} Literal.__initStatic2(); Literal.__initStatic3();

class Variable extends Model  {
    __init4() {this.termType = "Variable";}

    constructor(
         value
    ) {
        super();this.value = value;Variable.prototype.__init4.call(this);        Object.freeze(this);
    }
}

class DefaultGraph extends Model  {
    static  __initStatic4() {this.instance = new DefaultGraph();}

     constructor() {
        super();DefaultGraph.prototype.__init5.call(this);DefaultGraph.prototype.__init6.call(this);        Object.freeze(this);
    }

    __init5() {this.termType = "DefaultGraph";}
    __init6() {this.value = "";}
} DefaultGraph.__initStatic4();

class Quad  {
    constructor(
         subject,
         predicate,
         object,
         graph
    ) {this.subject = subject;this.predicate = predicate;this.object = object;this.graph = graph;
        Object.freeze(this);
    }

    equals(other) {
        return !!other && other.subject.equals(this.subject) && other.predicate.equals(this.predicate) &&
            other.object.equals(this.object) && other.graph.equals(this.graph);
    }
}

const prototypes = {
    subject: [NamedNode.prototype, BlankNode.prototype, Variable.prototype],
    predicate: [NamedNode.prototype, Variable.prototype],
    object: [NamedNode.prototype, Literal.prototype, BlankNode.prototype, Variable.prototype],
    graph: [DefaultGraph.prototype, NamedNode.prototype, BlankNode.prototype, Variable.prototype]
};

/**
 * A spec-compliant implementation of an RDFJS data factory supporting variables.
 *
 * The type of quads generated is [[Quad]], which restricts the term types of subject, predicate, object and graph
 * appropriately. For example, it is not permitted to use a [[Literal]] in subject position.
 *
 * The values returned by this factory satisfy two additional assumptions:
 *
 * 1. They are direct instances of exported classes, such as [[BlankNode]].
 *    There is no manual fiddling with prototypes.
 * 2. Those exported classes are subclasses of [[Model]] (except [[Quad]]).
 *
 * These guarantees are important for users of the data factory who want to transmit the values across serialization
 * boundaries. The spec mandates that all entities come with a JVM-style `equals` method. Unfortunately, when
 * transporting JS objects through any kind of channel (`JSON.stringify`, `MessagePort`, `postMessage`, ...) they lose
 * their methods and prototype. It is hence crucial that the prototype can be restored by the receiver of such an
 * object. Sadly, the reference implementation makes that hard by not having dedicated classes; instead, when entities
 * are created, the prototype is manually constructed and subsequently not exposed. This implementation solves the
 * problem through the exported classes that can reattached after deserialization.
 *
 * All objects returned by this factory are frozen. The factory itself is frozen too.
 *
 * Optionally, strict validation of input can be enabled. This enforces that all terms that are passed in have been
 * generated by this library and that the types of the inputs are correct (which would otherwise be enforced through
 * TypeScript).
 *
 * For the semantics of the methods, refer to [the spec](https://rdf.js.org/data-model-spec/).
 */
class DataFactory  {
    constructor(
          strict
    ) {this.strict = strict;
        Object.freeze(this);
    }

    blankNode(value) {
        if (this.strict) {
            if (value !== undefined && typeof value !== "string")
                throw new Error("Expected string or undefined");
        }

        return new BlankNode(value);
    }

    defaultGraph() {
        return DefaultGraph.instance;
    }

    literal(value, languageOrDatatype) {
        if (this.strict) {
            if (typeof value !== "string")
                throw new Error("Expected string as value");

            if (
                languageOrDatatype !== undefined &&
                typeof languageOrDatatype !== "string" &&
                Object.getPrototypeOf(languageOrDatatype) !== NamedNode.prototype
            )
                throw new Error("Expected undefined, string or NamedNode prototype as language/datatype");
        }

        return new Literal(value, languageOrDatatype);
    }

    namedNode(value) {
        if (this.strict) {
            if (typeof value !== "string")
                throw new Error("Expected string");
        }

        return new NamedNode(value);
    }

    quad(subject, predicate, object, graph) {
        if (this.strict) {
            if (!prototypes.subject.includes(Object.getPrototypeOf(subject)))
                throw new Error("Invalid prototype of subject");
            if (!prototypes.predicate.includes(Object.getPrototypeOf(predicate)))
                throw new Error("Invalid prototype of predicate");
            if (!prototypes.object.includes(Object.getPrototypeOf(object)))
                throw new Error("Invalid prototype of object");
            if (graph !== undefined && !prototypes.graph.includes(Object.getPrototypeOf(graph)))
                throw new Error("Invalid prototype of graph");
        }

        return new Quad(subject, predicate, object, graph || this.defaultGraph());
    }

    variable(value) {
        if (this.strict) {
            if (typeof value !== "string")
                throw new Error("Expected string");
        }

        return new Variable(value);
    }
}

/**
 * The default instance of [[DataFactory]].
 *
 * This instance does not perform strict validation of input.
 */
const dataFactory = new DataFactory(false);

/**
 * Turns the implementation of an endpoint specification into a plain function.
 */

/**
 * @hidden
 */


/**
 * @hidden
 */
function requestBuilder(client, state) {
    return new Proxy(new Function() , {
        apply(target, thisArg, argArray) {
            if (!Array.isArray(argArray) || argArray.length !== 0)
                throw new Error("Argument list must be empty");

            // end of line, make the call
            return client(state);
        },
        get(target, property) {
            if (typeof property !== "string")
                throw new Error(`Property ${String(property)} is not a string`);

            // nested call: return a callable function
            return (...args) =>
                requestBuilder(client, [...state, { method: property, args: args }]);
        }
    });
}

/**
 * Constructs a proxy object that turns a function call chain into a plain function call.
 */
function endpointClient(client) {
    return requestBuilder(client, []) ;
}

/**
 * Utilities for error handling.
 *
 * @packageDocumentation
 */

/**
 * An interface representing a successful computation.
 */





















/**
 * Transforms a [[Try]] into a promise that is resolved or rejected depending on [[Success]] or [[Failure]] state.
 *
 * See [[recoverPromise]] for the inverse operation.
 */
async function rethrowPromise(t) {
    if (t.tag === "success")
        return t.value;
    else
        throw t.err;
}

/**
 * Transforms a promise into a promise that is guaranteed not to be rejected. If the underlying promise is rejected,
 * the returned promise is resolved with a `Failure` containing the error.
 *
 * See [[rethrowPromise]] for the inverse operation.
 */
async function recoverPromise(p) {
    try {
        return {
            tag: "success",
            value: await p
        };
    }
    catch (err) {
        return {
            tag: "failure",
            err
        };
    }
}

/** @ignore */





/** @ignore */
function mapResource(resource, f) {
    return {
        value: f(resource.value),
        cleanup: async () => {
            if (resource.cleanup)
                await resource.cleanup();
        }
    };
}

var mapResource_1 = mapResource;
var recoverPromise_1 = recoverPromise;
var rethrowPromise_1 = rethrowPromise;

var util98373e7b = {
	mapResource: mapResource_1,
	recoverPromise: recoverPromise_1,
	rethrowPromise: rethrowPromise_1
};

/**
 * This module specifies the raw [[Port]] abstraction and combinators.
 *
 * @packageDocumentation
 */

/**
 * A handler for type `T` is a function accepting a `T` and returning `void`.
 *
 * Handlers are expected to return without throwing an error.
 */


/**
 * Contravariant map operation for [[Handler]]s. Applies the specified function on the value _before_ it is passed to
 * the handler.
 */
function mapHandler(handler, f) {
    return u => handler(f(u));
}

/**
 * A half port that only sends messages.
 *
 * This interface provides very little guarantees beside invoking the [[Handler]]s of a [[ReceivePort]] “somewhere
 * else”. In particular, sending a message provides no observable behaviour. There are no temporal guarantees when
 * sending multiple messages.
 *
 * Futhermore, it is not guaranteed that values sent through a port arrive unmodified at the other end. For example,
 * JSON stringification or variants of the
 * [Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
 * may be applied to these values. This happens because – in general – ports may be used to communicate across (logical
 * or physical) process boundaries.
 *
 * The [[SendPort.send]] method is expected to always return successfully without throwing an error.
 *
 * Implementations of this may be synchronous, for example the port returned by [[loopback]].
 */




/**
 * Map operation for [[SendPort]]s. The returned port behaves identically to the original port, but applies a function
 * to outgoing messages _before_ they are sent on the original port.
 */
function mapSendPort(port, f) {
    return {
        send: value => port.send(f(value))
    };
}

/**
 * A half port that only receives messages.
 *
 * Messages are handled asynchronously by adding (also called _registering_) [[Handler]]s. Ports should invoke all
 * handlers, but may do so in arbitrary order. If present, at least one handler must be invoked. Throwing an error in a
 * handler is undefined behaviour.
 *
 * Handlers may be `async` functions, but ports are not expected to `await` the results. This means that rejected
 * promises may go unhandled, which may be undefined behaviour depending on the platform.
 *
 * Note that it is impossible to remove handlers once added to the port. This, and custom multiplexing logic is out of
 * scope for this abstraction, but can be implemented by users on top of raw ports.
 */




/**
 * Map operation for [[ReceivePort]]s. The returned port behaves identically to the original port, but applies a
 * function to incoming messages _before_ they are sent to the handlers.
 */
function mapReceivePort(port, f) {
    return {
        addHandler: handler => port.addHandler(mapHandler(handler, f))
    };
}

/**
 * A raw port for types `In` and `Out` is a [[SendPort]] for type `Out` and a [[ReceivePort]] for type `In`.
 *
 * A mapping operation for both type parameters is provided as [[mapPort]].
 *
 * @typeParam Out type of outgoing messages
 * @typeParam In type of incoming messages
 */



/**
 * Maps a [[Port]] on both the incoming (covariant) and outgoing (contravariant) messages.
 *
 * See [[mapSendPort]] and [[mapReceivePort]] for the components.
 */
function mapPort(port, inf, outf) {
    return {
        ...mapSendPort(port, outf),
        ...mapReceivePort(port, inf)
    };
}

/**
 * Adds a handler to a [[ReceivePort]] that forwards all incoming messages to a [[SendPort]].
 *
 * @param from port from which messages are forwarded
 * @param to port to which messages are forwarded
 */
function forward(from, to) {
    from.addHandler(t => to.send(t));
}

/**
 * Bi-directionally forwards messages between two [[Port]]s.
 *
 * Both ports must have identical incoming and outcoming types. This function uses [[forward]] to forward messages from
 * the first port to the second, and again for the other direction.
 */
function connect(port1, port2) {
    forward(port1, port2);
    forward(port2, port1);
}

/**
 * Constructs a pair of uni-directionally connected ports. The result is a [[SendPort]] and a [[ReceivePort]] with the
 * same type parameters.
 *
 * Messages sent through the [[SendPort]] are immediately handled by the handlers registered with the [[ReceivePort]].
 * Communication is fully synchronous.
 */
function loopback() {
    const handlers = [];
    return [
        {
            send: value => handlers.forEach(handler => handler(value))
        },
        {
            addHandler: handler => handlers.push(handler)
        }
    ];
}

/**
 * Merges a [[SendPort]] and [[ReceivePort]] together to a full [[Port]].
 *
 * The resulting port shares the implementation of the underlying half ports.
 */
function join(send, receive) {
    return {
        send: (out) => send.send(out),
        addHandler: (handler) => receive.addHandler(handler)
    };
}

/**
 * Registers a one-off handler to a [[ReceivePort]] that listens for the next incoming message, returning a promise
 * that is resolved upon receiving that message.
 *
 * This function is the dual to [[SendPort.send]] because it allows to observe exactly one message.
 */
function receiveSingle(port) {
    return new Promise(resolve => {
        let done = false;
        const handler = data => {
            if (done)
                return;

            done = true;
            resolve(data);
        };
        port.addHandler(handler);
    });
}

var connect_1 = connect;
var forward_1 = forward;
var join_1 = join;
var loopback_1 = loopback;
var mapHandler_1 = mapHandler;
var mapPort_1 = mapPort;
var mapReceivePort_1 = mapReceivePort;
var mapSendPort_1 = mapSendPort;
var receiveSingle_1 = receiveSingle;

var portC121f47f = {
	connect: connect_1,
	forward: forward_1,
	join: join_1,
	loopback: loopback_1,
	mapHandler: mapHandler_1,
	mapPort: mapPort_1,
	mapReceivePort: mapReceivePort_1,
	mapSendPort: mapSendPort_1,
	receiveSingle: receiveSingle_1
};

/**
 * A pair of `resolve` and `reject` callbacks that resolve an underlying `Promise`.
 *
 * When creating a `Promise` through the `new Promise(executor)` constructor, the `executor` parameter is a function
 * that takes precisely this pair of functions as an argument. Consequently, an instance of `PromiseResolvers` can be
 * created as follows:
 *
 * ```
 * let resolvers: PromiseResolvers<Res>;
 * const response = new Promise<Res>((resolve, reject) => {
 *   resolvers = { resolve, reject };
 * });
 *
 * // pass `resolvers` somewhere else
 * // ...
 *
 * // when `resolvers.resolve` or `resolvers.reject` is called, a message is printed:
 * console.log(await response);
 * ```
 *
 * Note that the above snippet works because the executor passed to the `new Promise` constructor is executed
 * synchronously.
 *
 * The semantics of the callbacks is identical to the
 * [Promise specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 */
































/**
 * Turns a [[RequestPort]] into a [[Procedure]].
 *
 * This function creates a new `Promise` for each request and uses the constructs the callbacks as described in
 * [[PromiseResolvers]].
 *
 * Example usage:
 *
 * ```
 * declare const clientPort: RequestPort<string, string>;
 * const clientProc: Procedure<string, string> = client(clientPort);
 *
 * console.dir(await clientProc("world"));
 * ```
 *
 * @param port the port used to send messages
 * @returns a function that can be used to transparently send messages over a [[RequestPort]] and await the response
 */
function client(
    port
) {
    return req => new Promise((resolve, reject) => {
        port.send({
            request: req,
            resolvers: { resolve, reject }
        });
    });
}

/**
 * Add a [[Procedure]] as a handler to a [[ResponsePort]].
 *
 * This function uses [[ReceivePort.addHandler]] to add a new handler to the given [[ResponsePort]]. Upon receiving a
 * message, the given procedure is executed. If the procedure succeeds, the [[PromiseResolvers.resolve]] callback is
 * invoked. If the procedure fails, the [[PromiseResolvers.reject]] callback is invoked.
 *
 * Example usage:
 *
 * ```
 * declare const serverPort: ResponsePort<string, string>;
 * const serverProc: Procedure<string, string> = async (req: string) => {
 *     console.log(req);
 *     return `Hello ${req}`;
 * }
 *
 * server(serverPort, serverProc);
 * ```
 *
 * @param port the port to which the handler is added
 * @param procedure the function that is called for each incoming message
 */
function server(
    port,
    procedure
) {
    port.addHandler(async request => {
        try {
            const response = await procedure(request.request);
            request.resolvers.resolve(response);
        }
        catch (err) {
            request.resolvers.reject(err);
        }
    });
}

/**
 * A simple wrapper around requests with an associated request identifier.
 */












/**
 * Lifts a raw [[Port]] that supports sending identified requests and receiving identified responses to a
 * [[RequestPort]].
 *
 * In order to enable structured request-response communication on an unstructured [[Port]], this function communicates
 * through identified requests. The resulting [[RequestPort]] performs the following steps when sending a message:
 *
 * 1. the request gets assigned an increasing numeric identifier
 * 2. the [[PromiseResolvers]] are stored in an internal map
 * 3. when a response is received, the appropriate resolver is looked up from the map and resolved or rejected
 *    accordingly
 *
 * No callbacks are sent through the raw port. The resulting [[RequestPort]] acts as a request-response façade for the
 * raw port.
 *
 * Example usage:
 *
 * ```
 * declare const nodePort: MessagePort;
 * const rawPort: Port<any, any> = fromNodeMessagePort(nodePort);
 * const clientPort: RequestPort<string, string> = liftClient(rawPort);
 *
 * clientPort.send({
 *     request: "world",
 *     resolvers: {
 *         resolve: res => console.dir(await res),
 *         reject: err => console.log(`oh noes: ${err}`)
 *     }
 * });
 * ```
 *
 * Internally, the client port translates this to the following call:
 *
 * ```
 * rawPort.send({
 *     id: 42,
 *     request: "world"
 * });
 * ```
 */
function liftClient(
    port
) {
    let id = 0;
    const pending = new Map();
    port.addHandler(response => {
        const { resolve, reject } = pending.get(response.id);
        if ("error" in response)
            reject(response.error);
        else
            resolve(response.response);
    });

    return {
        send: req => {
            const currentId = ++id;
            pending.set(currentId, req.resolvers);
            port.send({
                request: req.request,
                id: currentId
            });
        }
    };
}

/**
 * Lifts a raw [[Port]] that supports receiving identified requests and sending identified responses to a
 * [[ResponsePort]].
 *
 * In order to enable structured request-response communication on an unstructured [[Port]], this function communicates
 * through identified requests. The resulting [[ResponsePort]] performs the following steps when receiving a message:
 *
 * 1. extract the numeric request identifier
 * 2. create new [[PromiseResolvers]] callbacks and sends them together with the request to the first handler that
 *    has been registered
 * 3. when the callback is resolved, send the response on the raw port together with the original request identifier
 *
 * No callbacks are sent through the raw port. The resulting [[ResponsePort]] acts as a request-response façade for the
 * raw port.
 *
 * Example usage:
 *
 * ```
 * declare const nodePort: MessagePort;
 * const rawPort: Port<any, any> = fromNodeMessagePort(nodePort);
 * const serverPort: ResponsePort<string, string> = liftServer(rawPort);
 *
 * serverPort.addHandler(({ request, { resolve, reject }}) => {
 *   console.log(request);
 *   resolve(`Hello ${request}`);
 * });
 * ```
 *
 * The resulting [[ResponsePort]] only calls the first handler that has been added, because multiple servers handling
 * the same requests is generally ill-defined.
 */
function liftServer(
    port
) {
    let handler = undefined;

    port.addHandler(async request => {
        const h = handler;
        if (!h)
            return;

        try {
            const response = await new Promise((resolve, reject) => {
                h({
                    request: request.request,
                    resolvers: {resolve, reject}
                });
            });
            port.send({
                id: request.id,
                response
            });
        }
        catch (err) {
            port.send({
                id: request.id,
                error: err
            });
        }
    });

    return {
        addHandler: h => {
            if (!handler)
                handler = h;
        }
    };
}

var client_1 = client;
var liftClient_1 = liftClient;
var liftServer_1 = liftServer;
var server_1 = server;

var procedure80cde8ee = {
	client: client_1,
	liftClient: liftClient_1,
	liftServer: liftServer_1,
	server: server_1
};

var dist = createCommonjsModule$1(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });





/**
 * Uses a [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) implementation to
 * implement a [[RequestPort]] that transmits messages via HTTP POST requests.
 *
 * The request type is fixed to `BodyInit` as defined by the DOM specification. Possible values include `Blob` or
 * `BufferSource`. Users have to convert their own data accordingly before sending down the resulting [[RequestPort]].
 * See [[jsonFetchPort]] and [[bubblewrapFetchPort]] for convenience wrappers that handle conversions.
 *
 * Upon receiving a request, the resulting [[RequestPort]] performs the following steps:
 *
 * 1. extract the request from the [[PromiseResolvers]]
 * 2. send a POST request to the specified URL with the given content type and request body
 * 3. parse the HTTP response by calling the `parse` function
 * 4. invoke the [[PromiseResolvers]] callbacks with the result of parsing
 *
 * Note that it is assumed that the HTTP response has status code 200. Otherwise, an error will be signalled by
 * calling the `reject` callback. Both server and client need to agree on a suitable application-level protocol how to
 * map errors into a response body and back from it. The default server ([[routerPort]]) requires a format function that
 * should be an inverse to `parse`.
 *
 * @param url the URL used for all requests
 * @param contentType the HTTP content type of the request
 * @param parse a function that consumes the response body and returns a successful or failed promise
 * @param fetch the Fetch implementation; `window.fetch` can be used in the browser and a polyfill on Node.js
 */
function fetchPort(
    url,
    contentType,
    parse,
    fetch
) {
    return {
        send: async request => {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": contentType
                },
                method: "post",
                body: request.request
            });

            if (!response.ok) {
                request.resolvers.reject(new Error("Invalid response code"));
                return;
            }

            try {
                const parsed = await parse(response);
                request.resolvers.resolve(parsed);
            }
            catch (err) {
                request.resolvers.reject(err);
            }
        }
    };
}

/**
 * Wrapper around [[fetchPort]] set up for JSON communication. The content type is set to `application/json`.
 *
 * This wrapper follows the same error protocol as [[jsonRouterPort]]. Outgoing requests are transformed into strings
 * using `JSON.stringify`. Conversely, incoming responses are parsed using `JSON.parse`.
 */
function jsonFetchPort(
    url,
    fetch
) {
    const rawPort = fetchPort(
        url,
        "application/json",
        async body => util98373e7b.rethrowPromise(await body.json()),
        fetch
    );

    return portC121f47f.mapSendPort(
        rawPort,
        data => ({
            resolvers: data.resolvers,
            request: JSON.stringify(data.request)
        })
    );
}

/**
 * Wrapper around [[fetchPort]] set up for raw byte stream communication. The content type is set to
 * `application/octet-stream`.
 *
 * This wrapper follows the same error protocol as [[bubblewrapRouterPort]]. Outgoing requests are encoded into byte
 * stream using Bubblewrap. Conversely, incoming responses are decoded using Bubblewrap.
 */
function bubblewrapFetchPort(
    url,
    bubblewrap,
    fetch
) {
    const rawPort = fetchPort(
        url,
        "application/octet-stream",
        async body => {
            const decoded = bubblewrap.decode(new Uint8Array(await body.arrayBuffer()));
            if (decoded.tag === "failure")
                throw decoded.err;
            else
                return decoded.value;
        },
        fetch
    );

    return portC121f47f.mapSendPort(
        rawPort,
        data => ({
            resolvers: data.resolvers,
            request: bubblewrap.encode(data.request)
        })
    );
}

/**
 * Browser-specific implementations of [[Port]].
 *
 * @packageDocumentation
 */

/**
 * Converts a browser `MessagePort` into a raw [[Port]].
 *
 * The type of outgoing messages is unconstrained. Incoming messages are `MessageEvent`s; the raw value can be accessed
 * using the `data` field. It is not possible to transfer objects with this [[Port]].
 *
 * The [[SendPort.send]] and [[ReceivePort.addHandler]] methods delegate directly to the underlying Node implementation.
 * For typed operation, it is recommended to use [[mapPort]] with type coercions.
 *
 * Note that Browser `MessagePort`s use the structured clone algorithm; that is, an object sent on the port will be
 * received as a different object.
 */
function fromBrowserMessagePort(port) {
    return {
        send(value) {
            port.postMessage(value);
        },
        addHandler(handler) {
            port.addEventListener("message", message => handler(message));
        }
    };
}

/**
 * The “inner half” of an iframe portal.
 *
 * It is possible to send and receive messages in an iframe using `window.parent` (from the iframe) and the iframe DOM
 * object (from the outer window). However, this becomes problematic when handling multiple clients whose requests need
 * to be multiplexed. The iframe portal solves this problem by establishing a dedicated, unencumbered line of
 * communication.
 *
 * The protocol works as follows:
 *
 * 1. the parent window creates the iframe
 * 2. the iframe immediately registers an event listener on the `message` event from the parent window, expecting to
 *    receive a `MessagePort`; this should be done before the iframe has been rendered fully
 * 3. the parent window waits until the iframe has been loaded (e.g. using `onload`)
 * 4. the parent window creates a fresh pair of ports using `new MessageChannel()` and transfers the second port down to
 *    the iframe using `postMessage`
 * 5. the iframe receives the `MessagePort` as a transferred object
 *
 * To aid multiplexing, a “secret” can be specified on both sides to recognize the `MessagePort` for a particular
 * channel. This is not a security feature.
 *
 * After the protocol ran, any future interaction between the iframe and its parent should happen on the `MessagePort`s
 * that have been exchanged. The entire protocol is abstracted using the pair of functions [[iframeInnerPort]] and
 * [[iframeOuterPort]].
 *
 * Usage example from within an iframe:
 *
 * ```html
 * <html>
 *     <head>
 *         <script type="module" src="bundle.js"></script>
 *         <script>
 *             const port = await iframeInnerPort("");
 *
 *             port.send("hello world!");
 *         </script>
 *     </head>
 * </html>
 * ```
 */
function iframeInnerPort(secret) {
    return new Promise((resolve, reject) => {
        const handler = event => {
            if (event.source !== window.parent || event.data !== secret)
                return;

            if (event.ports.length === 1) {
                event.ports[0].start();
                const rawPort = fromBrowserMessagePort(event.ports[0]);
                resolve(portC121f47f.mapPort(rawPort, event => event.data, any => any));
            }
            else {
                reject(`Malformed message`);
            }

            window.removeEventListener("message", handler);
        };
        window.addEventListener("message", handler);
    });
}

/**
 * The “outer half” of an iframe portal. See [[iframeInnerPort]] for details about the protocol.
 *
 * This function creates a `MessageChannel` and starts the outer port immediately. Consider a scenario where the script
 * executing inside the iframe immediately sends messages to the port. Those messages may get lost, because this
 * function may not have returned yet, so a caller may not have had the opportunity to register a handler. In any case,
 * this is a race condition. To avoid this, callers may specify an `init` function that gets called with the port before
 * it is sent to the iframe. Sending messages down that port may result in a race condition in the iframe, so it is
 * prohibited by the type.
 *
 * Usage example from an outer window:
 *
 * ```
 * const iframe = await new Promise(resolve => {
 *     const dom = document.createElement("iframe");
 *     dom.onload = () => resolve(iframe);
 *     document.getElementById("container").appendChild(dom);
 * });
 * const port = iframeOuterPort("", iframe);
 * port.addHandler(console.dir);
 * ```
 */
function iframeOuterPort(
    secret,
    iframe,
    init
) {
    const {port1, port2} = new MessageChannel();
    const rawPort = fromBrowserMessagePort(port1);
    const port$1 = portC121f47f.mapPort(rawPort, event => event.data, any => any);
    if (init)
        init(port$1);
    port1.start();
    iframe.contentWindow.postMessage(secret, "*", [port2]);
    return port$1;
}

exports.mapResource = util98373e7b.mapResource;
exports.recoverPromise = util98373e7b.recoverPromise;
exports.rethrowPromise = util98373e7b.rethrowPromise;
exports.connect = portC121f47f.connect;
exports.forward = portC121f47f.forward;
exports.join = portC121f47f.join;
exports.loopback = portC121f47f.loopback;
exports.mapHandler = portC121f47f.mapHandler;
exports.mapPort = portC121f47f.mapPort;
exports.mapReceivePort = portC121f47f.mapReceivePort;
exports.mapSendPort = portC121f47f.mapSendPort;
exports.receiveSingle = portC121f47f.receiveSingle;
exports.client = procedure80cde8ee.client;
exports.liftClient = procedure80cde8ee.liftClient;
exports.liftServer = procedure80cde8ee.liftServer;
exports.server = procedure80cde8ee.server;
exports.bubblewrapFetchPort = bubblewrapFetchPort;
exports.fetchPort = fetchPort;
exports.fromBrowserMessagePort = fromBrowserMessagePort;
exports.iframeInnerPort = iframeInnerPort;
exports.iframeOuterPort = iframeOuterPort;
exports.jsonFetchPort = jsonFetchPort;
});

var utf8 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8DecodeTD = exports.TEXT_DECODER_THRESHOLD = exports.utf8DecodeJs = exports.utf8EncodeTE = exports.TEXT_ENCODER_THRESHOLD = exports.utf8EncodeJs = exports.utf8Count = exports.TEXT_ENCODING_AVAILABLE = void 0;
exports.TEXT_ENCODING_AVAILABLE = typeof process !== "undefined" &&
    process.env.TEXT_ENCODING !== "never" &&
    typeof TextEncoder !== "undefined" &&
    typeof TextDecoder !== "undefined";
function utf8Count(str) {
    const strLength = str.length;
    let byteLength = 0;
    let pos = 0;
    while (pos < strLength) {
        let value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            byteLength++;
            continue;
        }
        else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            byteLength += 2;
        }
        else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    const extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                byteLength += 3;
            }
            else {
                // 4-byte
                byteLength += 4;
            }
        }
    }
    return byteLength;
}
exports.utf8Count = utf8Count;
function utf8EncodeJs(str, output, outputOffset) {
    const strLength = str.length;
    let offset = outputOffset;
    let pos = 0;
    while (pos < strLength) {
        let value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            output[offset++] = value;
            continue;
        }
        else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            output[offset++] = ((value >> 6) & 0x1f) | 0xc0;
        }
        else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    const extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                output[offset++] = ((value >> 12) & 0x0f) | 0xe0;
                output[offset++] = ((value >> 6) & 0x3f) | 0x80;
            }
            else {
                // 4-byte
                output[offset++] = ((value >> 18) & 0x07) | 0xf0;
                output[offset++] = ((value >> 12) & 0x3f) | 0x80;
                output[offset++] = ((value >> 6) & 0x3f) | 0x80;
            }
        }
        output[offset++] = (value & 0x3f) | 0x80;
    }
}
exports.utf8EncodeJs = utf8EncodeJs;
const sharedTextEncoder = exports.TEXT_ENCODING_AVAILABLE ? new TextEncoder() : undefined;
exports.TEXT_ENCODER_THRESHOLD = typeof process !== "undefined" && process.env.TEXT_ENCODING !== "force" ? 200 : 0;
function utf8EncodeTEencode(str, output, outputOffset) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    output.set(sharedTextEncoder.encode(str), outputOffset);
}
function utf8EncodeTEencodeInto(str, output, outputOffset) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
exports.utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
const CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
    let offset = inputOffset;
    const end = offset + byteLength;
    const units = [];
    let result = "";
    while (offset < end) {
        const byte1 = bytes[offset++];
        if ((byte1 & 0x80) === 0) {
            // 1 byte
            units.push(byte1);
        }
        else if ((byte1 & 0xe0) === 0xc0) {
            // 2 bytes
            const byte2 = bytes[offset++] & 0x3f;
            units.push(((byte1 & 0x1f) << 6) | byte2);
        }
        else if ((byte1 & 0xf0) === 0xe0) {
            // 3 bytes
            const byte2 = bytes[offset++] & 0x3f;
            const byte3 = bytes[offset++] & 0x3f;
            units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
        }
        else if ((byte1 & 0xf8) === 0xf0) {
            // 4 bytes
            const byte2 = bytes[offset++] & 0x3f;
            const byte3 = bytes[offset++] & 0x3f;
            const byte4 = bytes[offset++] & 0x3f;
            let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
            if (unit > 0xffff) {
                unit -= 0x10000;
                units.push(((unit >>> 10) & 0x3ff) | 0xd800);
                unit = 0xdc00 | (unit & 0x3ff);
            }
            units.push(unit);
        }
        else {
            units.push(byte1);
        }
        if (units.length >= CHUNK_SIZE) {
            result += String.fromCharCode(...units);
            units.length = 0;
        }
    }
    if (units.length > 0) {
        result += String.fromCharCode(...units);
    }
    return result;
}
exports.utf8DecodeJs = utf8DecodeJs;
const sharedTextDecoder = exports.TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
exports.TEXT_DECODER_THRESHOLD = typeof process !== "undefined" && process.env.TEXT_DECODER !== "force" ? 200 : 0;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
    const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sharedTextDecoder.decode(stringBytes);
}
exports.utf8DecodeTD = utf8DecodeTD;

});

var ExtData_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtData = void 0;
/**
 * ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
 */
class ExtData {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.ExtData = ExtData;

});

var int_1 = createCommonjsModule$1(function (module, exports) {
// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUint64 = exports.getInt64 = exports.setInt64 = exports.setUint64 = void 0;
function setUint64(view, offset, value) {
    const high = value / 4294967296;
    const low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
exports.setUint64 = setUint64;
function setInt64(view, offset, value) {
    const high = Math.floor(value / 4294967296);
    const low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
exports.setInt64 = setInt64;
function getInt64(view, offset) {
    const high = view.getInt32(offset);
    const low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}
exports.getInt64 = getInt64;
function getUint64(view, offset) {
    const high = view.getUint32(offset);
    const low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}
exports.getUint64 = getUint64;

});

var timestamp = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestampExtension = exports.decodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimestampExtension = exports.encodeDateToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.EXT_TIMESTAMP = void 0;
// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type

exports.EXT_TIMESTAMP = -1;
const TIMESTAMP32_MAX_SEC = 0x100000000 - 1; // 32-bit unsigned int
const TIMESTAMP64_MAX_SEC = 0x400000000 - 1; // 34-bit unsigned int
function encodeTimeSpecToTimestamp({ sec, nsec }) {
    if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
        // Here sec >= 0 && nsec >= 0
        if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
            // timestamp 32 = { sec32 (unsigned) }
            const rv = new Uint8Array(4);
            const view = new DataView(rv.buffer);
            view.setUint32(0, sec);
            return rv;
        }
        else {
            // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
            const secHigh = sec / 0x100000000;
            const secLow = sec & 0xffffffff;
            const rv = new Uint8Array(8);
            const view = new DataView(rv.buffer);
            // nsec30 | secHigh2
            view.setUint32(0, (nsec << 2) | (secHigh & 0x3));
            // secLow32
            view.setUint32(4, secLow);
            return rv;
        }
    }
    else {
        // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
        const rv = new Uint8Array(12);
        const view = new DataView(rv.buffer);
        view.setUint32(0, nsec);
        int_1.setInt64(view, 4, sec);
        return rv;
    }
}
exports.encodeTimeSpecToTimestamp = encodeTimeSpecToTimestamp;
function encodeDateToTimeSpec(date) {
    const msec = date.getTime();
    const sec = Math.floor(msec / 1e3);
    const nsec = (msec - sec * 1e3) * 1e6;
    // Normalizes { sec, nsec } to ensure nsec is unsigned.
    const nsecInSec = Math.floor(nsec / 1e9);
    return {
        sec: sec + nsecInSec,
        nsec: nsec - nsecInSec * 1e9,
    };
}
exports.encodeDateToTimeSpec = encodeDateToTimeSpec;
function encodeTimestampExtension(object) {
    if (object instanceof Date) {
        const timeSpec = encodeDateToTimeSpec(object);
        return encodeTimeSpecToTimestamp(timeSpec);
    }
    else {
        return null;
    }
}
exports.encodeTimestampExtension = encodeTimestampExtension;
function decodeTimestampToTimeSpec(data) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    // data may be 32, 64, or 96 bits
    switch (data.byteLength) {
        case 4: {
            // timestamp 32 = { sec32 }
            const sec = view.getUint32(0);
            const nsec = 0;
            return { sec, nsec };
        }
        case 8: {
            // timestamp 64 = { nsec30, sec34 }
            const nsec30AndSecHigh2 = view.getUint32(0);
            const secLow32 = view.getUint32(4);
            const sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
            const nsec = nsec30AndSecHigh2 >>> 2;
            return { sec, nsec };
        }
        case 12: {
            // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
            const sec = int_1.getInt64(view, 4);
            const nsec = view.getUint32(0);
            return { sec, nsec };
        }
        default:
            throw new Error(`Unrecognized data size for timestamp: ${data.length}`);
    }
}
exports.decodeTimestampToTimeSpec = decodeTimestampToTimeSpec;
function decodeTimestampExtension(data) {
    const timeSpec = decodeTimestampToTimeSpec(data);
    return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
exports.decodeTimestampExtension = decodeTimestampExtension;
exports.timestampExtension = {
    type: exports.EXT_TIMESTAMP,
    encode: encodeTimestampExtension,
    decode: decodeTimestampExtension,
};

});

var ExtensionCodec_1 = createCommonjsModule$1(function (module, exports) {
// ExtensionCodec to handle MessagePack extensions
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionCodec = void 0;


let ExtensionCodec = /** @class */ (() => {
    class ExtensionCodec {
        constructor() {
            // built-in extensions
            this.builtInEncoders = [];
            this.builtInDecoders = [];
            // custom extensions
            this.encoders = [];
            this.decoders = [];
            this.register(timestamp.timestampExtension);
        }
        register({ type, encode, decode, }) {
            if (type >= 0) {
                // custom extensions
                this.encoders[type] = encode;
                this.decoders[type] = decode;
            }
            else {
                // built-in extensions
                const index = 1 + type;
                this.builtInEncoders[index] = encode;
                this.builtInDecoders[index] = decode;
            }
        }
        tryToEncode(object, context) {
            // built-in extensions
            for (let i = 0; i < this.builtInEncoders.length; i++) {
                const encoder = this.builtInEncoders[i];
                if (encoder != null) {
                    const data = encoder(object, context);
                    if (data != null) {
                        const type = -1 - i;
                        return new ExtData_1.ExtData(type, data);
                    }
                }
            }
            // custom extensions
            for (let i = 0; i < this.encoders.length; i++) {
                const encoder = this.encoders[i];
                if (encoder != null) {
                    const data = encoder(object, context);
                    if (data != null) {
                        const type = i;
                        return new ExtData_1.ExtData(type, data);
                    }
                }
            }
            if (object instanceof ExtData_1.ExtData) {
                // to keep ExtData as is
                return object;
            }
            return null;
        }
        decode(data, type, context) {
            const decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
            if (decoder) {
                return decoder(data, type, context);
            }
            else {
                // decode() does not fail, returns ExtData instead.
                return new ExtData_1.ExtData(type, data);
            }
        }
    }
    ExtensionCodec.defaultCodec = new ExtensionCodec();
    return ExtensionCodec;
})();
exports.ExtensionCodec = ExtensionCodec;

});

var typedArrays = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataView = exports.ensureUint8Array = void 0;
function ensureUint8Array(buffer) {
    if (buffer instanceof Uint8Array) {
        return buffer;
    }
    else if (ArrayBuffer.isView(buffer)) {
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    else if (buffer instanceof ArrayBuffer) {
        return new Uint8Array(buffer);
    }
    else {
        // ArrayLike<number>
        return Uint8Array.from(buffer);
    }
}
exports.ensureUint8Array = ensureUint8Array;
function createDataView(buffer) {
    if (buffer instanceof ArrayBuffer) {
        return new DataView(buffer);
    }
    const bufferView = ensureUint8Array(buffer);
    return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}
exports.createDataView = createDataView;

});

var Encoder_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoder = exports.DEFAULT_INITIAL_BUFFER_SIZE = exports.DEFAULT_MAX_DEPTH = void 0;




exports.DEFAULT_MAX_DEPTH = 100;
exports.DEFAULT_INITIAL_BUFFER_SIZE = 2048;
class Encoder {
    constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context, maxDepth = exports.DEFAULT_MAX_DEPTH, initialBufferSize = exports.DEFAULT_INITIAL_BUFFER_SIZE, sortKeys = false, forceFloat32 = false, ignoreUndefined = false) {
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxDepth = maxDepth;
        this.initialBufferSize = initialBufferSize;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
    }
    encode(object, depth) {
        if (depth > this.maxDepth) {
            throw new Error(`Too deep objects in depth ${depth}`);
        }
        if (object == null) {
            this.encodeNil();
        }
        else if (typeof object === "boolean") {
            this.encodeBoolean(object);
        }
        else if (typeof object === "number") {
            this.encodeNumber(object);
        }
        else if (typeof object === "string") {
            this.encodeString(object);
        }
        else {
            this.encodeObject(object, depth);
        }
    }
    getUint8Array() {
        return this.bytes.subarray(0, this.pos);
    }
    ensureBufferSizeToWrite(sizeToWrite) {
        const requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) {
            this.resizeBuffer(requiredSize * 2);
        }
    }
    resizeBuffer(newSize) {
        const newBuffer = new ArrayBuffer(newSize);
        const newBytes = new Uint8Array(newBuffer);
        const newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
    }
    encodeNil() {
        this.writeU8(0xc0);
    }
    encodeBoolean(object) {
        if (object === false) {
            this.writeU8(0xc2);
        }
        else {
            this.writeU8(0xc3);
        }
    }
    encodeNumber(object) {
        if (Number.isSafeInteger(object)) {
            if (object >= 0) {
                if (object < 0x80) {
                    // positive fixint
                    this.writeU8(object);
                }
                else if (object < 0x100) {
                    // uint 8
                    this.writeU8(0xcc);
                    this.writeU8(object);
                }
                else if (object < 0x10000) {
                    // uint 16
                    this.writeU8(0xcd);
                    this.writeU16(object);
                }
                else if (object < 0x100000000) {
                    // uint 32
                    this.writeU8(0xce);
                    this.writeU32(object);
                }
                else {
                    // uint 64
                    this.writeU8(0xcf);
                    this.writeU64(object);
                }
            }
            else {
                if (object >= -0x20) {
                    // nagative fixint
                    this.writeU8(0xe0 | (object + 0x20));
                }
                else if (object >= -0x80) {
                    // int 8
                    this.writeU8(0xd0);
                    this.writeI8(object);
                }
                else if (object >= -0x8000) {
                    // int 16
                    this.writeU8(0xd1);
                    this.writeI16(object);
                }
                else if (object >= -0x80000000) {
                    // int 32
                    this.writeU8(0xd2);
                    this.writeI32(object);
                }
                else {
                    // int 64
                    this.writeU8(0xd3);
                    this.writeI64(object);
                }
            }
        }
        else {
            // non-integer numbers
            if (this.forceFloat32) {
                // float 32
                this.writeU8(0xca);
                this.writeF32(object);
            }
            else {
                // float 64
                this.writeU8(0xcb);
                this.writeF64(object);
            }
        }
    }
    writeStringHeader(byteLength) {
        if (byteLength < 32) {
            // fixstr
            this.writeU8(0xa0 + byteLength);
        }
        else if (byteLength < 0x100) {
            // str 8
            this.writeU8(0xd9);
            this.writeU8(byteLength);
        }
        else if (byteLength < 0x10000) {
            // str 16
            this.writeU8(0xda);
            this.writeU16(byteLength);
        }
        else if (byteLength < 0x100000000) {
            // str 32
            this.writeU8(0xdb);
            this.writeU32(byteLength);
        }
        else {
            throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
        }
    }
    encodeString(object) {
        const maxHeaderSize = 1 + 4;
        const strLength = object.length;
        if (utf8.TEXT_ENCODING_AVAILABLE && strLength > utf8.TEXT_ENCODER_THRESHOLD) {
            const byteLength = utf8.utf8Count(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            utf8.utf8EncodeTE(object, this.bytes, this.pos);
            this.pos += byteLength;
        }
        else {
            const byteLength = utf8.utf8Count(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            utf8.utf8EncodeJs(object, this.bytes, this.pos);
            this.pos += byteLength;
        }
    }
    encodeObject(object, depth) {
        // try to encode objects with custom codec first of non-primitives
        const ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) {
            this.encodeExtension(ext);
        }
        else if (Array.isArray(object)) {
            this.encodeArray(object, depth);
        }
        else if (ArrayBuffer.isView(object)) {
            this.encodeBinary(object);
        }
        else if (typeof object === "object") {
            this.encodeMap(object, depth);
        }
        else {
            // symbol, function and other special object come here unless extensionCodec handles them.
            throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
        }
    }
    encodeBinary(object) {
        const size = object.byteLength;
        if (size < 0x100) {
            // bin 8
            this.writeU8(0xc4);
            this.writeU8(size);
        }
        else if (size < 0x10000) {
            // bin 16
            this.writeU8(0xc5);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // bin 32
            this.writeU8(0xc6);
            this.writeU32(size);
        }
        else {
            throw new Error(`Too large binary: ${size}`);
        }
        const bytes = typedArrays.ensureUint8Array(object);
        this.writeU8a(bytes);
    }
    encodeArray(object, depth) {
        const size = object.length;
        if (size < 16) {
            // fixarray
            this.writeU8(0x90 + size);
        }
        else if (size < 0x10000) {
            // array 16
            this.writeU8(0xdc);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // array 32
            this.writeU8(0xdd);
            this.writeU32(size);
        }
        else {
            throw new Error(`Too large array: ${size}`);
        }
        for (const item of object) {
            this.encode(item, depth + 1);
        }
    }
    countWithoutUndefined(object, keys) {
        let count = 0;
        for (const key of keys) {
            if (object[key] !== undefined) {
                count++;
            }
        }
        return count;
    }
    encodeMap(object, depth) {
        const keys = Object.keys(object);
        if (this.sortKeys) {
            keys.sort();
        }
        const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
        if (size < 16) {
            // fixmap
            this.writeU8(0x80 + size);
        }
        else if (size < 0x10000) {
            // map 16
            this.writeU8(0xde);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // map 32
            this.writeU8(0xdf);
            this.writeU32(size);
        }
        else {
            throw new Error(`Too large map object: ${size}`);
        }
        for (const key of keys) {
            const value = object[key];
            if (!(this.ignoreUndefined && value === undefined)) {
                this.encodeString(key);
                this.encode(value, depth + 1);
            }
        }
    }
    encodeExtension(ext) {
        const size = ext.data.length;
        if (size === 1) {
            // fixext 1
            this.writeU8(0xd4);
        }
        else if (size === 2) {
            // fixext 2
            this.writeU8(0xd5);
        }
        else if (size === 4) {
            // fixext 4
            this.writeU8(0xd6);
        }
        else if (size === 8) {
            // fixext 8
            this.writeU8(0xd7);
        }
        else if (size === 16) {
            // fixext 16
            this.writeU8(0xd8);
        }
        else if (size < 0x100) {
            // ext 8
            this.writeU8(0xc7);
            this.writeU8(size);
        }
        else if (size < 0x10000) {
            // ext 16
            this.writeU8(0xc8);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // ext 32
            this.writeU8(0xc9);
            this.writeU32(size);
        }
        else {
            throw new Error(`Too large extension object: ${size}`);
        }
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
    }
    writeU8(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
    }
    writeU8a(values) {
        const size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
    }
    writeI8(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
    }
    writeU16(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
    }
    writeI16(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
    }
    writeU32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
    }
    writeI32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
    }
    writeF32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
    }
    writeF64(value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
    }
    writeU64(value) {
        this.ensureBufferSizeToWrite(8);
        int_1.setUint64(this.view, this.pos, value);
        this.pos += 8;
    }
    writeI64(value) {
        this.ensureBufferSizeToWrite(8);
        int_1.setInt64(this.view, this.pos, value);
        this.pos += 8;
    }
}
exports.Encoder = Encoder;

});

var encode_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = void 0;

const defaultEncodeOptions = {};
/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
function encode(value, options = defaultEncodeOptions) {
    const encoder = new Encoder_1.Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined);
    encoder.encode(value, 1);
    return encoder.getUint8Array();
}
exports.encode = encode;

});

var prettyByte_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyByte = void 0;
function prettyByte(byte) {
    return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}
exports.prettyByte = prettyByte;

});

var CachedKeyDecoder_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedKeyDecoder = void 0;

const DEFAULT_MAX_KEY_LENGTH = 16;
const DEFAULT_MAX_LENGTH_PER_KEY = 16;
class CachedKeyDecoder {
    constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        // avoid `new Array(N)` to create a non-sparse array for performance.
        this.caches = [];
        for (let i = 0; i < this.maxKeyLength; i++) {
            this.caches.push([]);
        }
    }
    canBeCached(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
    }
    get(bytes, inputOffset, byteLength) {
        const records = this.caches[byteLength - 1];
        const recordsLength = records.length;
        FIND_CHUNK: for (let i = 0; i < recordsLength; i++) {
            const record = records[i];
            const recordBytes = record.bytes;
            for (let j = 0; j < byteLength; j++) {
                if (recordBytes[j] !== bytes[inputOffset + j]) {
                    continue FIND_CHUNK;
                }
            }
            return record.value;
        }
        return null;
    }
    store(bytes, value) {
        const records = this.caches[bytes.length - 1];
        const record = { bytes, value };
        if (records.length >= this.maxLengthPerKey) {
            // `records` are full!
            // Set `record` to a randomized position.
            records[(Math.random() * records.length) | 0] = record;
        }
        else {
            records.push(record);
        }
    }
    decode(bytes, inputOffset, byteLength) {
        const cachedValue = this.get(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
            return cachedValue;
        }
        const value = utf8.utf8DecodeJs(bytes, inputOffset, byteLength);
        // Ensure to copy a slice of bytes because the byte may be NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
        const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, value);
        return value;
    }
}
exports.CachedKeyDecoder = CachedKeyDecoder;

});

var Decoder_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.DataViewIndexOutOfBoundsError = void 0;






const isValidMapKeyType = (key) => {
    const keyType = typeof key;
    return keyType === "string" || keyType === "number";
};
const HEAD_BYTE_REQUIRED = -1;
const EMPTY_VIEW = new DataView(new ArrayBuffer(0));
const EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
// IE11: Hack to support IE11.
// IE11: Drop this hack and just use RangeError when IE11 is obsolete.
exports.DataViewIndexOutOfBoundsError = (() => {
    try {
        // IE11: The spec says it should throw RangeError,
        // IE11: but in IE11 it throws TypeError.
        EMPTY_VIEW.getInt8(0);
    }
    catch (e) {
        return e.constructor;
    }
    throw new Error("never reached");
})();
const MORE_DATA = new exports.DataViewIndexOutOfBoundsError("Insufficient data");
const DEFAULT_MAX_LENGTH = 4294967295; // uint32_max
const sharedCachedKeyDecoder = new CachedKeyDecoder_1.CachedKeyDecoder();
class Decoder {
    constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context, maxStrLength = DEFAULT_MAX_LENGTH, maxBinLength = DEFAULT_MAX_LENGTH, maxArrayLength = DEFAULT_MAX_LENGTH, maxMapLength = DEFAULT_MAX_LENGTH, maxExtLength = DEFAULT_MAX_LENGTH, cachedKeyDecoder = sharedCachedKeyDecoder) {
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxStrLength = maxStrLength;
        this.maxBinLength = maxBinLength;
        this.maxArrayLength = maxArrayLength;
        this.maxMapLength = maxMapLength;
        this.maxExtLength = maxExtLength;
        this.cachedKeyDecoder = cachedKeyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = EMPTY_VIEW;
        this.bytes = EMPTY_BYTES;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack = [];
    }
    setBuffer(buffer) {
        this.bytes = typedArrays.ensureUint8Array(buffer);
        this.view = typedArrays.createDataView(this.bytes);
        this.pos = 0;
    }
    appendBuffer(buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining()) {
            this.setBuffer(buffer);
        }
        else {
            // retried because data is insufficient
            const remainingData = this.bytes.subarray(this.pos);
            const newData = typedArrays.ensureUint8Array(buffer);
            const concated = new Uint8Array(remainingData.length + newData.length);
            concated.set(remainingData);
            concated.set(newData, remainingData.length);
            this.setBuffer(concated);
        }
    }
    hasRemaining(size = 1) {
        return this.view.byteLength - this.pos >= size;
    }
    createNoExtraBytesError(posToShow) {
        const { view, pos } = this;
        return new RangeError(`Extra ${view.byteLength - pos} byte(s) found at buffer[${posToShow}]`);
    }
    decodeSingleSync() {
        const object = this.decodeSync();
        if (this.hasRemaining()) {
            throw this.createNoExtraBytesError(this.pos);
        }
        return object;
    }
    async decodeSingleAsync(stream) {
        let decoded = false;
        let object;
        for await (const buffer of stream) {
            if (decoded) {
                throw this.createNoExtraBytesError(this.totalPos);
            }
            this.appendBuffer(buffer);
            try {
                object = this.decodeSync();
                decoded = true;
            }
            catch (e) {
                if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) {
                    throw e; // rethrow
                }
                // fallthrough
            }
            this.totalPos += this.pos;
        }
        if (decoded) {
            if (this.hasRemaining()) {
                throw this.createNoExtraBytesError(this.totalPos);
            }
            return object;
        }
        const { headByte, pos, totalPos } = this;
        throw new RangeError(`Insufficient data in parcing ${prettyByte_1.prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
    }
    decodeArrayStream(stream) {
        return this.decodeMultiAsync(stream, true);
    }
    decodeStream(stream) {
        return this.decodeMultiAsync(stream, false);
    }
    async *decodeMultiAsync(stream, isArray) {
        let isArrayHeaderRequired = isArray;
        let arrayItemsLeft = -1;
        for await (const buffer of stream) {
            if (isArray && arrayItemsLeft === 0) {
                throw this.createNoExtraBytesError(this.totalPos);
            }
            this.appendBuffer(buffer);
            if (isArrayHeaderRequired) {
                arrayItemsLeft = this.readArraySize();
                isArrayHeaderRequired = false;
                this.complete();
            }
            try {
                while (true) {
                    yield this.decodeSync();
                    if (--arrayItemsLeft === 0) {
                        break;
                    }
                }
            }
            catch (e) {
                if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) {
                    throw e; // rethrow
                }
                // fallthrough
            }
            this.totalPos += this.pos;
        }
    }
    decodeSync() {
        DECODE: while (true) {
            const headByte = this.readHeadByte();
            let object;
            if (headByte >= 0xe0) {
                // negative fixint (111x xxxx) 0xe0 - 0xff
                object = headByte - 0x100;
            }
            else if (headByte < 0xc0) {
                if (headByte < 0x80) {
                    // positive fixint (0xxx xxxx) 0x00 - 0x7f
                    object = headByte;
                }
                else if (headByte < 0x90) {
                    // fixmap (1000 xxxx) 0x80 - 0x8f
                    const size = headByte - 0x80;
                    if (size !== 0) {
                        this.pushMapState(size);
                        this.complete();
                        continue DECODE;
                    }
                    else {
                        object = {};
                    }
                }
                else if (headByte < 0xa0) {
                    // fixarray (1001 xxxx) 0x90 - 0x9f
                    const size = headByte - 0x90;
                    if (size !== 0) {
                        this.pushArrayState(size);
                        this.complete();
                        continue DECODE;
                    }
                    else {
                        object = [];
                    }
                }
                else {
                    // fixstr (101x xxxx) 0xa0 - 0xbf
                    const byteLength = headByte - 0xa0;
                    object = this.decodeUtf8String(byteLength, 0);
                }
            }
            else if (headByte === 0xc0) {
                // nil
                object = null;
            }
            else if (headByte === 0xc2) {
                // false
                object = false;
            }
            else if (headByte === 0xc3) {
                // true
                object = true;
            }
            else if (headByte === 0xca) {
                // float 32
                object = this.readF32();
            }
            else if (headByte === 0xcb) {
                // float 64
                object = this.readF64();
            }
            else if (headByte === 0xcc) {
                // uint 8
                object = this.readU8();
            }
            else if (headByte === 0xcd) {
                // uint 16
                object = this.readU16();
            }
            else if (headByte === 0xce) {
                // uint 32
                object = this.readU32();
            }
            else if (headByte === 0xcf) {
                // uint 64
                object = this.readU64();
            }
            else if (headByte === 0xd0) {
                // int 8
                object = this.readI8();
            }
            else if (headByte === 0xd1) {
                // int 16
                object = this.readI16();
            }
            else if (headByte === 0xd2) {
                // int 32
                object = this.readI32();
            }
            else if (headByte === 0xd3) {
                // int 64
                object = this.readI64();
            }
            else if (headByte === 0xd9) {
                // str 8
                const byteLength = this.lookU8();
                object = this.decodeUtf8String(byteLength, 1);
            }
            else if (headByte === 0xda) {
                // str 16
                const byteLength = this.lookU16();
                object = this.decodeUtf8String(byteLength, 2);
            }
            else if (headByte === 0xdb) {
                // str 32
                const byteLength = this.lookU32();
                object = this.decodeUtf8String(byteLength, 4);
            }
            else if (headByte === 0xdc) {
                // array 16
                const size = this.readU16();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = [];
                }
            }
            else if (headByte === 0xdd) {
                // array 32
                const size = this.readU32();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = [];
                }
            }
            else if (headByte === 0xde) {
                // map 16
                const size = this.readU16();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = {};
                }
            }
            else if (headByte === 0xdf) {
                // map 32
                const size = this.readU32();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = {};
                }
            }
            else if (headByte === 0xc4) {
                // bin 8
                const size = this.lookU8();
                object = this.decodeBinary(size, 1);
            }
            else if (headByte === 0xc5) {
                // bin 16
                const size = this.lookU16();
                object = this.decodeBinary(size, 2);
            }
            else if (headByte === 0xc6) {
                // bin 32
                const size = this.lookU32();
                object = this.decodeBinary(size, 4);
            }
            else if (headByte === 0xd4) {
                // fixext 1
                object = this.decodeExtension(1, 0);
            }
            else if (headByte === 0xd5) {
                // fixext 2
                object = this.decodeExtension(2, 0);
            }
            else if (headByte === 0xd6) {
                // fixext 4
                object = this.decodeExtension(4, 0);
            }
            else if (headByte === 0xd7) {
                // fixext 8
                object = this.decodeExtension(8, 0);
            }
            else if (headByte === 0xd8) {
                // fixext 16
                object = this.decodeExtension(16, 0);
            }
            else if (headByte === 0xc7) {
                // ext 8
                const size = this.lookU8();
                object = this.decodeExtension(size, 1);
            }
            else if (headByte === 0xc8) {
                // ext 16
                const size = this.lookU16();
                object = this.decodeExtension(size, 2);
            }
            else if (headByte === 0xc9) {
                // ext 32
                const size = this.lookU32();
                object = this.decodeExtension(size, 4);
            }
            else {
                throw new Error(`Unrecognized type byte: ${prettyByte_1.prettyByte(headByte)}`);
            }
            this.complete();
            const stack = this.stack;
            while (stack.length > 0) {
                // arrays and maps
                const state = stack[stack.length - 1];
                if (state.type === 0 /* ARRAY */) {
                    state.array[state.position] = object;
                    state.position++;
                    if (state.position === state.size) {
                        stack.pop();
                        object = state.array;
                    }
                    else {
                        continue DECODE;
                    }
                }
                else if (state.type === 1 /* MAP_KEY */) {
                    if (!isValidMapKeyType(object)) {
                        throw new Error("The type of key must be string or number but " + typeof object);
                    }
                    state.key = object;
                    state.type = 2 /* MAP_VALUE */;
                    continue DECODE;
                }
                else {
                    // it must be `state.type === State.MAP_VALUE` here
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    state.map[state.key] = object;
                    state.readCount++;
                    if (state.readCount === state.size) {
                        stack.pop();
                        object = state.map;
                    }
                    else {
                        state.key = null;
                        state.type = 1 /* MAP_KEY */;
                        continue DECODE;
                    }
                }
            }
            return object;
        }
    }
    readHeadByte() {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
            this.headByte = this.readU8();
            // console.log("headByte", prettyByte(this.headByte));
        }
        return this.headByte;
    }
    complete() {
        this.headByte = HEAD_BYTE_REQUIRED;
    }
    readArraySize() {
        const headByte = this.readHeadByte();
        switch (headByte) {
            case 0xdc:
                return this.readU16();
            case 0xdd:
                return this.readU32();
            default: {
                if (headByte < 0xa0) {
                    return headByte - 0x90;
                }
                else {
                    throw new Error(`Unrecognized array type byte: ${prettyByte_1.prettyByte(headByte)}`);
                }
            }
        }
    }
    pushMapState(size) {
        if (size > this.maxMapLength) {
            throw new Error(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
        }
        this.stack.push({
            type: 1 /* MAP_KEY */,
            size,
            key: null,
            readCount: 0,
            map: {},
        });
    }
    pushArrayState(size) {
        if (size > this.maxArrayLength) {
            throw new Error(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
        }
        this.stack.push({
            type: 0 /* ARRAY */,
            size,
            array: new Array(size),
            position: 0,
        });
    }
    decodeUtf8String(byteLength, headerOffset) {
        var _a;
        if (byteLength > this.maxStrLength) {
            throw new Error(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
            throw MORE_DATA;
        }
        const offset = this.pos + headerOffset;
        let object;
        if (this.stateIsMapKey() && ((_a = this.cachedKeyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
            object = this.cachedKeyDecoder.decode(this.bytes, offset, byteLength);
        }
        else if (utf8.TEXT_ENCODING_AVAILABLE && byteLength > utf8.TEXT_DECODER_THRESHOLD) {
            object = utf8.utf8DecodeTD(this.bytes, offset, byteLength);
        }
        else {
            object = utf8.utf8DecodeJs(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
    }
    stateIsMapKey() {
        if (this.stack.length > 0) {
            const state = this.stack[this.stack.length - 1];
            return state.type === 1 /* MAP_KEY */;
        }
        return false;
    }
    decodeBinary(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
            throw new Error(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
            throw MORE_DATA;
        }
        const offset = this.pos + headOffset;
        const object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
    }
    decodeExtension(size, headOffset) {
        if (size > this.maxExtLength) {
            throw new Error(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
        }
        const extType = this.view.getInt8(this.pos + headOffset);
        const data = this.decodeBinary(size, headOffset + 1 /* extType */);
        return this.extensionCodec.decode(data, extType, this.context);
    }
    lookU8() {
        return this.view.getUint8(this.pos);
    }
    lookU16() {
        return this.view.getUint16(this.pos);
    }
    lookU32() {
        return this.view.getUint32(this.pos);
    }
    readU8() {
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    }
    readI8() {
        const value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
    }
    readU16() {
        const value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
    }
    readI16() {
        const value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
    }
    readU32() {
        const value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
    }
    readI32() {
        const value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
    }
    readU64() {
        const value = int_1.getUint64(this.view, this.pos);
        this.pos += 8;
        return value;
    }
    readI64() {
        const value = int_1.getInt64(this.view, this.pos);
        this.pos += 8;
        return value;
    }
    readF32() {
        const value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
    }
    readF64() {
        const value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
    }
}
exports.Decoder = Decoder;

});

var decode_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.defaultDecodeOptions = void 0;

exports.defaultDecodeOptions = {};
/**
 * It decodes a MessagePack-encoded buffer.
 *
 * This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
 */
function decode(buffer, options = exports.defaultDecodeOptions) {
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    decoder.setBuffer(buffer); // decodeSync() requires only one buffer
    return decoder.decodeSingleSync();
}
exports.decode = decode;

});

var stream$1 = createCommonjsModule$1(function (module, exports) {
// utility for whatwg streams
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAsyncIterabe = exports.asyncIterableFromStream = exports.isAsyncIterable = void 0;
function isAsyncIterable(object) {
    return object[Symbol.asyncIterator] != null;
}
exports.isAsyncIterable = isAsyncIterable;
function assertNonNull(value) {
    if (value == null) {
        throw new Error("Assertion Failure: value must not be null nor undefined");
    }
}
async function* asyncIterableFromStream(stream) {
    const reader = stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            assertNonNull(value);
            yield value;
        }
    }
    finally {
        reader.releaseLock();
    }
}
exports.asyncIterableFromStream = asyncIterableFromStream;
function ensureAsyncIterabe(streamLike) {
    if (isAsyncIterable(streamLike)) {
        return streamLike;
    }
    else {
        return asyncIterableFromStream(streamLike);
    }
}
exports.ensureAsyncIterabe = ensureAsyncIterabe;

});

var decodeAsync_1 = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeStream = exports.decodeArrayStream = exports.decodeAsync = void 0;



async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream$1$1 = stream$1.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeSingleAsync(stream$1$1);
}
exports.decodeAsync = decodeAsync;
function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream$1$1 = stream$1.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeArrayStream(stream$1$1);
}
exports.decodeArrayStream = decodeArrayStream;
function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream$1$1 = stream$1.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeStream(stream$1$1);
}
exports.decodeStream = decodeStream;

});

var dist$1 = createCommonjsModule$1(function (module, exports) {
// Main Functions:
Object.defineProperty(exports, "__esModule", { value: true });

Object.defineProperty(exports, "encode", { enumerable: true, get: function () { return encode_1.encode; } });

Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return decode_1.decode; } });

Object.defineProperty(exports, "decodeAsync", { enumerable: true, get: function () { return decodeAsync_1.decodeAsync; } });
Object.defineProperty(exports, "decodeArrayStream", { enumerable: true, get: function () { return decodeAsync_1.decodeArrayStream; } });
Object.defineProperty(exports, "decodeStream", { enumerable: true, get: function () { return decodeAsync_1.decodeStream; } });
/**
 * @experimental `Decoder` is exported for experimental use.
 */

Object.defineProperty(exports, "Decoder", { enumerable: true, get: function () { return Decoder_1.Decoder; } });
/**
 * @experimental `Encoder` is exported for experimental use.
 */

Object.defineProperty(exports, "Encoder", { enumerable: true, get: function () { return Encoder_1.Encoder; } });
// Utilitiies for Extension Types:

Object.defineProperty(exports, "ExtensionCodec", { enumerable: true, get: function () { return ExtensionCodec_1.ExtensionCodec; } });

Object.defineProperty(exports, "ExtData", { enumerable: true, get: function () { return ExtData_1.ExtData; } });

Object.defineProperty(exports, "EXT_TIMESTAMP", { enumerable: true, get: function () { return timestamp.EXT_TIMESTAMP; } });
Object.defineProperty(exports, "encodeDateToTimeSpec", { enumerable: true, get: function () { return timestamp.encodeDateToTimeSpec; } });
Object.defineProperty(exports, "encodeTimeSpecToTimestamp", { enumerable: true, get: function () { return timestamp.encodeTimeSpecToTimestamp; } });
Object.defineProperty(exports, "decodeTimestampToTimeSpec", { enumerable: true, get: function () { return timestamp.decodeTimestampToTimeSpec; } });
Object.defineProperty(exports, "encodeTimestampExtension", { enumerable: true, get: function () { return timestamp.encodeTimestampExtension; } });
Object.defineProperty(exports, "decodeTimestampExtension", { enumerable: true, get: function () { return timestamp.decodeTimestampExtension; } });

});

/**
 * This module defines the [[Bubblewrap]] class and related utilities.
 *
 * The terminology in this module is as follows:
 * - _encode_/_decode_ refers to conversion to/from byte arrays
 * - _serialize_/_deserialize_ refers to high-level object manipulation
 *
 * Library users usually only need to care about encoding and decoding; these operations are provided by
 * [[Bubblewrap.encode]] and [[Bubblewrap.decode]], respectively.
 *
 * Customizing the encoding and decoding logic can be done by registering JavaScript classes. Details can be found in
 * the documentation of [[Class]] (explanation of the custom logic) and [[Bubblewrap]] (explanation of how to register).
 *
 * We leverage [MessagePack's](https://msgpack.org/) extension types for mapping JavaScript objects to byte arrays.
 * This library defines four extension types:
 * 1. [[msgPackEtypeStrict]] is reserved for implementation purposes and will never be emitted
 * 2. [[msgPackEtypeUndef]] tags a sentinel value of class [[Undefined]]; used to distinguish `undefined` from
 *    `null` (see [[Class]] for details)
 * 3. [[msgPackEtypeClass]] tags an registered JavaScript class; there is one tag for all classes
 * 4. [[msgPackEtypeError]] tags an error of the built-in `Error` type; it is possible to specify custom logic
 *    for subclasses of `Error`
 *
 * @packageDocumentation
 */

/**
 * Symbol for static class methods that provide custom deserialization logic. See [[Class]] for an example.
 */
const deserialize = Symbol();

/**
 * Symbol for class methods that provide custom serialization logic. See [[Class]] for an example.
 */
const serialize = Symbol();









function isSerializable(t) {
    return t[serialize] !== undefined;
}

/**
 * A class that can be registered to [[Bubblewrap]].
 *
 * #### Behaviour for unregistered classes
 *
 * Without customization, [[Bubblewrap.encode]] uses `Object.entries` to encode all properties of an object as-is.
 * Consequently, the prototype after encoding is just `object`. In the following example, only the `subject` property
 * survives:
 *
 * ```javascript
 * class MyCoolClass {
 *    constructor(subject) {
 *        this.subject = subject;
 *    }
 *
 *    greet() {
 *        console.log(`Hello ${this.subject}!`);
 *    }
 * }
 *
 * const bubblewrap = Bubblewrap.create();
 * const encoded = bubblewrap.encode(new MyCoolClass("World"));
 * const decoded = bubblewrap.decode(encoded);
 * ```
 *
 * The decoded object will not have a `greet` method, because this method is defined on `MyCoolClass.prototype`. For
 * Bubblewrap, `new MyCoolClass(x)` is equivalent to `{ subject: x }`, i.e., a plain object literal.
 *
 * #### Behaviour for registered classes
 *
 * Registering a [[Class]], i.e. its constructor, changes this logic. In the above example, we could register the
 * value `MyCoolClass`, which in JavaScript is a function that constructs objects of this class.
 *
 * In the simplest case, a class' author does not have to implement any additional methods. Encoding will still use
 * `Object.entries`, but additionally include the object's prototype.
 *
 * Applied to the above example, the object will be encoded as follows:
 *
 * ```
 * encode(new MyCoolClass("World")) ≡ encode(["MyCoolClass", { subject: "World" }])
 * ```
 *
 * The string identifier `"MyCoolClass"` is supplied by the user when registering the class. When decoding, Bubblewrap
 * will look up the appropriate prototype:
 *
 * ```
 * decode(encoded) ≡ Object.create(MyCoolClass.prototype, { subject: "World" })
 * ```
 *
 * In some situations, this default logic is not sufficient. It may not work when complex class hierarchies are
 * involved.
 *
 * The logic can be further tweaked by providing additional methods. These methods must have well-known names that are
 * specified by the [[serialize]] and [[deserialize]] symbols. The following class illustrates this using a subclass
 * of `Error`:
 *
 * ```
 * class MyError extends Error {
 *    constructor(
 *        private readonly mymsg: string
 *    ) {
 *        super(`My message: ${mymsg}`);
 *    }
 *
 *    static [deserialize](mymsg: string): MyError {
 *        return new MyError(mymsg);
 *    }
 *
 *    [serialize](): any {
 *        return this.mymsg;
 *    }
 * }
 * ```
 *
 * If a `[serialize]` method is present on an object, it will be invoked before encoding that object. If a
 * `[deserialize]` method is present on the prototype of an object, it will be invoked after decoding that object.
 * Classes are free to choose any representation; the return value of `[serialize]` will be recursively processed by
 * [[Bubblewrap.encode]].
 *
 * #### Handling of `undefined`
 *
 * Due to a limitation of the MessagePack implementation used in this library, `undefined` and `null` are conflated: by
 * default, values that were `undefined` appear as `null` after decoding. This happens for example when an array has
 * `undefined` elements or an object has an enumerable property that is `undefined`.
 *
 * There is exactly one situation in which this does not happen: when registering a class to [[Bubblewrap]] _without_
 * defining a `[serialize]` method. In this case, the encoder maps `undefined` properties to the [[Undefined]] sentinel
 * class. The decoder maps this class back to `undefined`.
 *
 * Library authors defining custom `[serialize]` methods must take care of this themselves.
 *
 * It is not possible to customize this behaviour for arrays, raw objects, or `undefined` values nested below objects
 * of registered classes.
 */




























const msgPackEtypeStrict = 0x00;
const msgPackEtypeUndef = 0x01;
const msgPackEtypeClass = 0x02;
const msgPackEtypeError = 0x03;

/**
 * Sentinel class used to represent `undefined` in the MessagePack data model.
 *
 * This class has no properties.
 */
class Undefined { }

/**
 * Encoding and decoding of JavaScript values to and from byte arrays.
 *
 * An instance of this class manages two pieces of state:
 *
 * 1. the dictionary of registered classes
 * 2. a low-level MessagePack codec (implementation detail)
 *
 * The latter is initialized lazily for performance reasons. Otherwise, this class is immutable and may freely be
 * shared.
 *
 * New instances are created using the [[Bubblewrap.create]] static method. Additional classes can be registered with
 * [[Bubblewrap.addClasses]].
 *
 * It is crucial that in any given application, class keys are not reused. They are required for identifying custom
 * (de)serialization logic. Keys of registered classes are stored
 */
class Bubblewrap {
    

     constructor(
          classes,
          strict
    ) {this.classes = classes;this.strict = strict; }

    /**
     * Creates a new instance of [[Bubblewrap]] with the specified dictionary of registered classes.
     *
     * If no dictionary is specified, no classes are registered.
     *
     * @param strict if `true`, then `encode` will throw an exception when encountering any object with an unknown
     * prototype; this is only recommended for testing purposes
     */
    static create(classes, strict = false) {
        return new Bubblewrap(classes || {}, strict);
    }

    /**
     * Constructs a new, independent [[Bubblewrap]] instance with additional registered classes.
     *
     * This method throws an exception if there is a duplicate class identifier.
     */
    addClasses(more) {
        const thisKeys = Object.keys(this.classes);
        const thatKeys = Object.keys(more);
        for (const thisKey of thisKeys)
            if (thatKeys.includes(thisKey))
                throw new Error(`Duplicate identifier ${thisKey}`);
        return new Bubblewrap({ ...this.classes, ...more }, this.strict);
    }

     registerStrict(codec) {
        if (!this.strict)
            return;

        const knownPrototypes = [
            Object.prototype,
            Error.prototype,
            Undefined.prototype,
            ...Object.values(this.classes).map(cls => cls.prototype)
        ];

        codec.register({
            type: msgPackEtypeStrict,
            encode: value => {
                if (typeof value === "object" && !Array.isArray(value)) {
                    if (knownPrototypes.includes(Object.getPrototypeOf(value)))
                        // this value is probably fine, please go on
                        return null;

                    throw new Error("Attempted to encode an object with an unknown prototype");
                }
                return null;
            },
            decode: () => { throw new Error("Attempted to decode a dummy type"); }
        });
    }

     makeCodec() {
        const codec = new dist$1.ExtensionCodec();

        this.registerStrict(codec);

        codec.register({
            type: msgPackEtypeUndef,
            encode: value => value instanceof Undefined ? dist$1.encode(null) : null,
            decode: () => undefined
        });

        codec.register({
            type: msgPackEtypeClass,
            encode: _value => {
                const entries = Object.entries(this.classes);
                // assume that later entries take precedence over earlier ones
                entries.reverse();
                for (const [name, Class] of entries) {
                    if (!(_value instanceof Class))
                        continue;

                    // @ts-ignore
                    const value = _value;

                    if (isSerializable(value))
                        return dist$1.encode([name, value[serialize]()], { extensionCodec: codec });

                    const raw = Object.entries(value);
                    const entries = raw.map(([key, value]) => {
                        if (value === undefined)
                            return [key, new Undefined()];
                        else
                            return [key, value];
                    });

                    return dist$1.encode([name, entries], { extensionCodec: codec })
                }

                return null;
            },
            decode: buffer => {
                const [name, raw] = dist$1.decode(buffer, { extensionCodec: codec }) ;
                const Class = this.classes[name];

                const deserializer = Class[deserialize];
                if (deserializer !== undefined)
                    return deserializer(raw);

                const object = Object.create(Class.prototype);
                for (const [key, value] of raw )
                    object[key] = value;
                return object;
            }
        });

        codec.register({
            type: msgPackEtypeError,
            encode: value => value instanceof Error ? dist$1.encode(value.message) : null,
            decode: buffer => new Error(dist$1.decode(buffer) )
        });

        return codec;
    }

    encode(value) {
        if (!this.codec)
            this.codec = this.makeCodec();

        return dist$1.encode(value, { extensionCodec: this.codec });
    }

    decode(buffer) {
        if (!this.codec)
            this.codec = this.makeCodec();

        return dist$1.decode(buffer, { extensionCodec: this.codec });
    }
}

class FetchResponse  {

    
    
    
    
    
    

    static async of(response) {
        return new FetchResponse(
            response,
            await response.text()
        );
    }

    constructor(
        response,
          bufferedText
    ) {this.bufferedText = bufferedText;
        this.ok = response.ok;
        this.redirected = response.redirected;
        this.status = response.status;
        this.statusText = response.statusText;
        this.type = response.type;
        this.url = response.url;
    }

    async json() {
        // JSON parse error must be asynchronous (i.e. rejected promise)
        return JSON.parse(this.bufferedText);
    }

    text() {
        return Promise.resolve(this.bufferedText);
    }

}

class FileStats  {

    static of(stats) {
        return new FileStats(
            stats.isFile(),
            stats.isDirectory()
        );
    }

    constructor(
         file,
         directory
    ) {this.file = file;this.directory = directory;}

    isFile() { return this.file; }
    isDirectory() { return this.directory; }

}

const podBubblewrapClasses = {
    "@polypoly-eu/podigree.FetchResponse": FetchResponse,
    "@polypoly-eu/podigree.FileStats": FileStats,
    "@polypoly-eu/rdf.NamedNode": NamedNode,
    "@polypoly-eu/rdf.BlankNode": BlankNode,
    "@polypoly-eu/rdf.Literal": Literal,
    "@polypoly-eu/rdf.Variable": Variable,
    "@polypoly-eu/rdf.DefaultGraph": DefaultGraph,
    "@polypoly-eu/rdf.Quad": Quad
};

function bubblewrapPort(rawPort) {
    const podBubblewrap = Bubblewrap.create(podBubblewrapClasses);
    return dist.mapPort(
        rawPort,
        buf => podBubblewrap.decode(buf),
        data => podBubblewrap.encode(data)
    );
}

class RemoteClientPod  {

    

    static fromFetch(url, fetch = window.fetch) {
        const port = dist.bubblewrapFetchPort(
            url,
            Bubblewrap.create(podBubblewrapClasses),
            fetch
        );

        return new RemoteClientPod(port);
    }

    static fromRawPort(rawPort) {
        return new RemoteClientPod(dist.liftClient(bubblewrapPort(rawPort)));
    }

    constructor(
         clientPort,
          dataFactory$1 = dataFactory
    ) {this.clientPort = clientPort;this.dataFactory = dataFactory$1;
        this.rpcClient = endpointClient(dist.client(clientPort));
    }

    get polyIn() {
        return {
            add: (...quads) => this.rpcClient.polyIn().add(...quads)(),
            select: matcher => this.rpcClient.polyIn().select(matcher)()
        };
    }

    get polyOut() {
        const {rpcClient} = this;

        return new class  {
            fetch(input, init) {
                return rpcClient.polyOut().fetch(input, init || {})();
            }

            

            readFile(path, options) {
                if (options === undefined)
                    return rpcClient.polyOut().readFile(path)();
                else
                    return rpcClient.polyOut().readFile(path, options)();
            }

            readdir(path) {
                return rpcClient.polyOut().readdir(path)();
            }

            stat(path) {
                return rpcClient.polyOut().stat(path)();
            }

            writeFile(path, content, options) {
                return rpcClient.polyOut().writeFile(path, content, options)();
            }

        };
    }

}

const iframeInnerDecoder = Decoder.type({
    type: Decoder.literal("iframe")
});

const fetchDecoder = Decoder.type({
    type: Decoder.literal("fetch"),
    uri: Decoder.string
});

const specDecoder = Decoder.sum("type")({
    iframe: iframeInnerDecoder,
    fetch: fetchDecoder
});

function parseSpec(spec) {
	console.log(`feature-bootstrap.parseSpec(spec: $spec)`);
    const parsed = JSON.parse(spec);
    return pipeable_1.pipe(
        specDecoder.decode(parsed),
        Either.fold(
            () => { throw new Error("Could not decode spec"); },
            t => t
        )
    );
}

async function podOfSpec(spec) {
    switch (spec.type) {
        case "fetch":
            return RemoteClientPod.fromFetch(spec.uri);
        case "iframe":
            return RemoteClientPod.fromRawPort(await dist.iframeInnerPort(""));
    }
}

function detectSpec() {
    let cookie = undefined;
    try {
        cookie = js_cookie.get("polypoly-bootstrap");
    }
    catch (e) {
        // no cookie for us :(
    }

    if (cookie === undefined)
        return { type: "iframe" };

    return parseSpec(cookie);
}

const pod = podOfSpec(detectSpec());

pod.then(pod => {
    window.pod = pod;
    window.dispatchEvent(new CustomEvent("podReady", {
        detail: pod
    }));
});

mocha.setup("bdd");

async function setupTests(pod) {
    describe("Tests", function () {
        // FIXME performance is bad
        this.timeout(20000);
        spec$1.podSpec(pod, "/");
    });
}

(async () => {
    setupTests(await pod);
    mocha.run(failures => {
        if (window.testCompleted)
            window.testCompleted({ failures });
    });
})();

}());
