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

	var ChainRec = createCommonjsModule(function (module, exports) {
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

	unwrapExports(ChainRec);
	var ChainRec_1 = ChainRec.tailRec;

	var _function = createCommonjsModule(function (module, exports) {
	/**
	 * @since 2.0.0
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.not = exports.unsafeCoerce = exports.identity = void 0;
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
	});

	unwrapExports(_function);
	var _function_1 = _function.untupled;
	var _function_2 = _function.tupled;
	var _function_3 = _function.absurd;
	var _function_4 = _function.decrement;
	var _function_5 = _function.increment;
	var _function_6 = _function.tuple;
	var _function_7 = _function.flow;
	var _function_8 = _function.flip;
	var _function_9 = _function.constVoid;
	var _function_10 = _function.constUndefined;
	var _function_11 = _function.constNull;
	var _function_12 = _function.constFalse;
	var _function_13 = _function.constTrue;
	var _function_14 = _function.constant;
	var _function_15 = _function.not;
	var _function_16 = _function.unsafeCoerce;
	var _function_17 = _function.identity;

	var Either = createCommonjsModule(function (module, exports) {
	/**
	 * Represents a value of one of two possible types (a disjoint union).
	 *
	 * An instance of `Either` is either an instance of `Left` or `Right`.
	 *
	 * A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
	 * `None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
	 * dictates that `Left` is used for failure and `Right` is used for success.
	 *
	 * For example, you could use `Either<string, number>` to detect whether a received input is a `string` or a `number`.
	 *
	 * ```ts
	 * import { Either, left, right } from 'fp-ts/lib/Either'
	 *
	 * function parse(input: string): Either<Error, number> {
	 *   const n = parseInt(input, 10)
	 *   return isNaN(n) ? left(new Error('not a number')) : right(n)
	 * }
	 * ```
	 *
	 * `Either` is right-biased, which means that `Right` is assumed to be the default case to operate on. If it is `Left`,
	 * operations like `map`, `chain`, ... return the `Left` value unchanged:
	 *
	 * ```ts
	 * import { map, left, right } from 'fp-ts/lib/Either'
	 * import { pipe } from 'fp-ts/lib/pipeable'
	 *
	 * pipe(right(12), map(double)) // right(24)
	 * pipe(left(23), map(double))  // left(23)
	 * ```
	 *
	 * @since 2.0.0
	 */
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.either = exports.bifunctorEither = exports.applicativeEither = exports.filterOrElse = exports.fromPredicate = exports.fromOption = exports.reduceRight = exports.reduce = exports.mapLeft = exports.map = exports.foldMap = exports.bimap = exports.flatten = exports.extend = exports.duplicate = exports.chainW = exports.chainFirst = exports.chain = exports.apSecond = exports.apFirst = exports.ap = exports.alt = exports.getValidationMonoid = exports.getValidationSemigroup = exports.getValidation = exports.getWitherable = exports.stringifyJSON = exports.parseJSON = exports.exists = exports.elem = exports.getOrElseW = exports.getOrElse = exports.orElse = exports.swap = exports.isRight = exports.isLeft = exports.getApplyMonoid = exports.getApplySemigroup = exports.getSemigroup = exports.getEq = exports.getShow = exports.fold = exports.tryCatch = exports.toError = exports.fromNullable = exports.right = exports.left = exports.URI = void 0;


	/**
	 * @since 2.0.0
	 */
	exports.URI = 'Either';
	/**
	 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
	 * structure
	 *
	 * @since 2.0.0
	 */
	function left(e) {
	    return { _tag: 'Left', left: e };
	}
	exports.left = left;
	/**
	 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
	 * of this structure
	 *
	 * @since 2.0.0
	 */
	function right(a) {
	    return { _tag: 'Right', right: a };
	}
	exports.right = right;
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
	 * @since 2.0.0
	 */
	function fromNullable(e) {
	    return function (a) { return (a == null ? left(e) : right(a)); };
	}
	exports.fromNullable = fromNullable;
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
	 * @since 2.0.0
	 */
	function tryCatch(f, onError) {
	    try {
	        return right(f());
	    }
	    catch (e) {
	        return left(onError(e));
	    }
	}
	exports.tryCatch = tryCatch;
	/**
	 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
	 * if the value is a `Right` the inner value is applied to the second function.
	 *
	 * @example
	 * import { fold, left, right } from 'fp-ts/lib/Either'
	 * import { pipe } from 'fp-ts/lib/pipeable'
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
	 * @since 2.0.0
	 */
	function fold(onLeft, onRight) {
	    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : onRight(ma.right)); };
	}
	exports.fold = fold;
	/**
	 * @since 2.0.0
	 */
	function getShow(SE, SA) {
	    return {
	        show: function (ma) { return (isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
	    };
	}
	exports.getShow = getShow;
	/**
	 * @since 2.0.0
	 */
	function getEq(EL, EA) {
	    return {
	        equals: function (x, y) {
	            return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
	        }
	    };
	}
	exports.getEq = getEq;
	/**
	 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
	 * appended using the provided `Semigroup`
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
	 *
	 * @since 2.0.0
	 */
	function getSemigroup(S) {
	    return {
	        concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right))); }
	    };
	}
	exports.getSemigroup = getSemigroup;
	/**
	 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
	 * are appended using the provided `Semigroup`
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
	 *
	 * @since 2.0.0
	 */
	function getApplySemigroup(S) {
	    return {
	        concat: function (x, y) { return (isLeft(x) ? x : isLeft(y) ? y : right(S.concat(x.right, y.right))); }
	    };
	}
	exports.getApplySemigroup = getApplySemigroup;
	/**
	 * @since 2.0.0
	 */
	function getApplyMonoid(M) {
	    return __assign(__assign({}, getApplySemigroup(M)), { empty: right(M.empty) });
	}
	exports.getApplyMonoid = getApplyMonoid;
	/**
	 * Returns `true` if the either is an instance of `Left`, `false` otherwise
	 *
	 * @since 2.0.0
	 */
	function isLeft(ma) {
	    switch (ma._tag) {
	        case 'Left':
	            return true;
	        case 'Right':
	            return false;
	    }
	}
	exports.isLeft = isLeft;
	/**
	 * Returns `true` if the either is an instance of `Right`, `false` otherwise
	 *
	 * @since 2.0.0
	 */
	function isRight(ma) {
	    return isLeft(ma) ? false : true;
	}
	exports.isRight = isRight;
	/**
	 * @since 2.0.0
	 */
	function swap(ma) {
	    return isLeft(ma) ? right(ma.left) : left(ma.right);
	}
	exports.swap = swap;
	/**
	 * @since 2.0.0
	 */
	function orElse(onLeft) {
	    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma); };
	}
	exports.orElse = orElse;
	/**
	 * @since 2.0.0
	 */
	function getOrElse(onLeft) {
	    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma.right); };
	}
	exports.getOrElse = getOrElse;
	/**
	 * @since 2.6.0
	 */
	exports.getOrElseW = getOrElse;
	/**
	 * @since 2.0.0
	 */
	function elem(E) {
	    return function (a, ma) { return (isLeft(ma) ? false : E.equals(a, ma.right)); };
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
	    return function (ma) { return (isLeft(ma) ? false : predicate(ma.right)); };
	}
	exports.exists = exists;
	/**
	 * Converts a JavaScript Object Notation (JSON) string into an object.
	 *
	 * @example
	 * import { parseJSON, toError, right, left } from 'fp-ts/lib/Either'
	 *
	 * assert.deepStrictEqual(parseJSON('{"a":1}', toError), right({ a: 1 }))
	 * assert.deepStrictEqual(parseJSON('{"a":}', toError), left(new SyntaxError('Unexpected token } in JSON at position 5')))
	 *
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
	 * import { pipe } from 'fp-ts/lib/pipeable'
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
	 * @since 2.0.0
	 */
	function stringifyJSON(u, onError) {
	    return tryCatch(function () { return JSON.stringify(u); }, onError);
	}
	exports.stringifyJSON = stringifyJSON;
	/**
	 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
	 *
	 * @since 2.0.0
	 */
	function getWitherable(M) {
	    var empty = left(M.empty);
	    var compact = function (ma) {
	        return isLeft(ma) ? ma : ma.right._tag === 'None' ? left(M.empty) : right(ma.right.value);
	    };
	    var separate = function (ma) {
	        return isLeft(ma)
	            ? { left: ma, right: ma }
	            : isLeft(ma.right)
	                ? { left: right(ma.right.left), right: empty }
	                : { left: empty, right: right(ma.right.right) };
	    };
	    var partitionMap = function (ma, f) {
	        if (isLeft(ma)) {
	            return { left: ma, right: ma };
	        }
	        var e = f(ma.right);
	        return isLeft(e) ? { left: right(e.left), right: empty } : { left: empty, right: right(e.right) };
	    };
	    var partition = function (ma, p) {
	        return isLeft(ma)
	            ? { left: ma, right: ma }
	            : p(ma.right)
	                ? { left: empty, right: right(ma.right) }
	                : { left: right(ma.right), right: empty };
	    };
	    var filterMap = function (ma, f) {
	        if (isLeft(ma)) {
	            return ma;
	        }
	        var ob = f(ma.right);
	        return ob._tag === 'None' ? left(M.empty) : right(ob.value);
	    };
	    var filter = function (ma, predicate) {
	        return isLeft(ma) ? ma : predicate(ma.right) ? ma : left(M.empty);
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
	        sequence: sequence_,
	        reduce: reduce_,
	        foldMap: foldMap_,
	        reduceRight: reduceRight_,
	        wither: wither,
	        wilt: wilt
	    };
	}
	exports.getWitherable = getWitherable;
	/**
	 * @since 2.0.0
	 */
	function getValidation(S) {
	    return __assign(__assign({}, exports.either), { _E: undefined, ap: function (mab, ma) {
	            return isLeft(mab)
	                ? isLeft(ma)
	                    ? left(S.concat(mab.left, ma.left))
	                    : mab
	                : isLeft(ma)
	                    ? ma
	                    : right(mab.right(ma.right));
	        }, alt: function (fx, f) {
	            if (isRight(fx)) {
	                return fx;
	            }
	            var fy = f();
	            return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy;
	        } });
	}
	exports.getValidation = getValidation;
	/**
	 * @since 2.0.0
	 */
	function getValidationSemigroup(SE, SA) {
	    return {
	        concat: function (fx, fy) {
	            return isLeft(fx)
	                ? isLeft(fy)
	                    ? left(SE.concat(fx.left, fy.left))
	                    : fx
	                : isLeft(fy)
	                    ? fy
	                    : right(SA.concat(fx.right, fy.right));
	        }
	    };
	}
	exports.getValidationSemigroup = getValidationSemigroup;
	/**
	 * @since 2.0.0
	 */
	function getValidationMonoid(SE, SA) {
	    return {
	        concat: getValidationSemigroup(SE, SA).concat,
	        empty: right(SA.empty)
	    };
	}
	exports.getValidationMonoid = getValidationMonoid;
	// -------------------------------------------------------------------------------------
	// pipeables
	// -------------------------------------------------------------------------------------
	var map_ = function (ma, f) {
	    return isLeft(ma) ? ma : right(f(ma.right));
	};
	var ap_ = function (mab, ma) {
	    return isLeft(mab) ? mab : isLeft(ma) ? ma : right(mab.right(ma.right));
	};
	var chain_ = function (ma, f) {
	    return isLeft(ma) ? ma : f(ma.right);
	};
	var reduce_ = function (fa, b, f) {
	    return isLeft(fa) ? b : f(b, fa.right);
	};
	var foldMap_ = function (M) { return function (fa, f) {
	    return isLeft(fa) ? M.empty : f(fa.right);
	}; };
	var reduceRight_ = function (fa, b, f) {
	    return isLeft(fa) ? b : f(fa.right, b);
	};
	var traverse_ = function (F) { return function (ma, f) {
	    return isLeft(ma) ? F.of(left(ma.left)) : F.map(f(ma.right), right);
	}; };
	var sequence_ = function (F) { return function (ma) {
	    return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
	}; };
	var bimap_ = function (fea, f, g) {
	    return isLeft(fea) ? left(f(fea.left)) : right(g(fea.right));
	};
	var mapLeft_ = function (fea, f) {
	    return isLeft(fea) ? left(f(fea.left)) : fea;
	};
	var alt_ = function (fx, fy) { return (isLeft(fx) ? fy() : fx); };
	var extend_ = function (wa, f) {
	    return isLeft(wa) ? wa : right(f(wa));
	};
	var chainRec_ = function (a, f) {
	    return ChainRec.tailRec(f(a), function (e) {
	        return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
	    });
	};
	/**
	 * @since 2.0.0
	 */
	exports.alt = function (that) { return function (fa) {
	    return alt_(fa, that);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.ap = function (fa) { return function (fab) {
	    return ap_(fab, fa);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.apFirst = function (fb) { return function (fa) {
	    return ap_(map_(fa, function (a) { return function () { return a; }; }), fb);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.apSecond = function (fb) { return function (fa) {
	    return ap_(map_(fa, function () { return function (b) { return b; }; }), fb);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.chain = function (f) { return function (ma) {
	    return chain_(ma, f);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.chainFirst = function (f) { return function (ma) {
	    return chain_(ma, function (a) { return map_(f(a), function () { return a; }); });
	}; };
	/**
	 * @since 2.6.0
	 */
	exports.chainW = exports.chain;
	/**
	 * @since 2.0.0
	 */
	exports.duplicate = function (wa) { return extend_(wa, _function.identity); };
	/**
	 * @since 2.0.0
	 */
	exports.extend = function (f) { return function (ma) {
	    return extend_(ma, f);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.flatten = function (mma) { return chain_(mma, _function.identity); };
	/**
	 * @since 2.0.0
	 */
	exports.bimap = function (f, g) { return function (fa) { return bimap_(fa, f, g); }; };
	/**
	 * @since 2.0.0
	 */
	exports.foldMap = function (M) {
	    var foldMapM = foldMap_(M);
	    return function (f) { return function (fa) { return foldMapM(fa, f); }; };
	};
	/**
	 * @since 2.0.0
	 */
	exports.map = function (f) { return function (fa) { return map_(fa, f); }; };
	/**
	 * @since 2.0.0
	 */
	exports.mapLeft = function (f) { return function (fa) { return mapLeft_(fa, f); }; };
	/**
	 * @since 2.0.0
	 */
	exports.reduce = function (b, f) { return function (fa) {
	    return reduce_(fa, b, f);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.reduceRight = function (b, f) { return function (fa) {
	    return reduceRight_(fa, b, f);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.fromOption = function (onNone) { return function (ma) {
	    return ma._tag === 'None' ? left(onNone()) : right(ma.value);
	}; };
	/**
	 * @since 2.0.0
	 */
	exports.fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? right(a) : left(onFalse(a))); }; };
	/**
	 * @since 2.0.0
	 */
	exports.filterOrElse = function (predicate, onFalse) { return function (ma) {
	    return chain_(ma, function (a) { return (predicate(a) ? right(a) : left(onFalse(a))); });
	}; };
	// -------------------------------------------------------------------------------------
	// instances
	// -------------------------------------------------------------------------------------
	/**
	 * @internal
	 */
	exports.applicativeEither = {
	    URI: exports.URI,
	    map: map_,
	    of: right,
	    ap: ap_
	};
	/**
	 * @internal
	 */
	exports.bifunctorEither = {
	    URI: exports.URI,
	    bimap: bimap_,
	    mapLeft: mapLeft_
	};
	/**
	 * @since 2.0.0
	 */
	exports.either = {
	    URI: exports.URI,
	    map: map_,
	    of: right,
	    ap: ap_,
	    chain: chain_,
	    reduce: reduce_,
	    foldMap: foldMap_,
	    reduceRight: reduceRight_,
	    traverse: traverse_,
	    sequence: sequence_,
	    bimap: bimap_,
	    mapLeft: mapLeft_,
	    alt: alt_,
	    extend: extend_,
	    chainRec: chainRec_,
	    throwError: left
	};
	});

	unwrapExports(Either);
	var Either_1 = Either.either;
	var Either_2 = Either.bifunctorEither;
	var Either_3 = Either.applicativeEither;
	var Either_4 = Either.filterOrElse;
	var Either_5 = Either.fromPredicate;
	var Either_6 = Either.fromOption;
	var Either_7 = Either.reduceRight;
	var Either_8 = Either.reduce;
	var Either_9 = Either.mapLeft;
	var Either_10 = Either.map;
	var Either_11 = Either.foldMap;
	var Either_12 = Either.bimap;
	var Either_13 = Either.flatten;
	var Either_14 = Either.extend;
	var Either_15 = Either.duplicate;
	var Either_16 = Either.chainW;
	var Either_17 = Either.chainFirst;
	var Either_18 = Either.chain;
	var Either_19 = Either.apSecond;
	var Either_20 = Either.apFirst;
	var Either_21 = Either.ap;
	var Either_22 = Either.alt;
	var Either_23 = Either.getValidationMonoid;
	var Either_24 = Either.getValidationSemigroup;
	var Either_25 = Either.getValidation;
	var Either_26 = Either.getWitherable;
	var Either_27 = Either.stringifyJSON;
	var Either_28 = Either.parseJSON;
	var Either_29 = Either.exists;
	var Either_30 = Either.elem;
	var Either_31 = Either.getOrElseW;
	var Either_32 = Either.getOrElse;
	var Either_33 = Either.orElse;
	var Either_34 = Either.swap;
	var Either_35 = Either.isRight;
	var Either_36 = Either.isLeft;
	var Either_37 = Either.getApplyMonoid;
	var Either_38 = Either.getApplySemigroup;
	var Either_39 = Either.getSemigroup;
	var Either_40 = Either.getEq;
	var Either_41 = Either.getShow;
	var Either_42 = Either.fold;
	var Either_43 = Either.tryCatch;
	var Either_44 = Either.toError;
	var Either_45 = Either.fromNullable;
	var Either_46 = Either.right;
	var Either_47 = Either.left;
	var Either_48 = Either.URI;

	var pipeable_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pipeable = exports.pipe = void 0;

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

	unwrapExports(pipeable_1);
	var pipeable_2 = pipeable_1.pipeable;
	var pipeable_3 = pipeable_1.pipe;

	var Schemable = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.memoize = void 0;
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
	});

	unwrapExports(Schemable);
	var Schemable_1 = Schemable.memoize;

	var Guard = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.schemableGuard = exports.URI = exports.lazy = exports.sum = exports.union = exports.intersection = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.nullable = exports.refinement = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.never = exports.literal = void 0;
	/**
	 * @since 2.2.0
	 */

	// -------------------------------------------------------------------------------------
	// constructors
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	function literal() {
	    var values = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        values[_i] = arguments[_i];
	    }
	    return {
	        is: function (u) { return values.findIndex(function (a) { return a === u; }) !== -1; }
	    };
	}
	exports.literal = literal;
	// -------------------------------------------------------------------------------------
	// primitives
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	exports.never = {
	    is: function (_u) { return false; }
	};
	/**
	 * @since 2.2.0
	 */
	exports.string = {
	    is: function (u) { return typeof u === 'string'; }
	};
	/**
	 * @since 2.2.0
	 */
	exports.number = {
	    is: function (u) { return typeof u === 'number'; }
	};
	/**
	 * @since 2.2.0
	 */
	exports.boolean = {
	    is: function (u) { return typeof u === 'boolean'; }
	};
	/**
	 * @since 2.2.0
	 */
	exports.UnknownArray = {
	    is: Array.isArray
	};
	/**
	 * @since 2.2.0
	 */
	exports.UnknownRecord = {
	    is: function (u) { return Object.prototype.toString.call(u) === '[object Object]'; }
	};
	// -------------------------------------------------------------------------------------
	// combinators
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	function refinement(from, refinement) {
	    return {
	        is: function (u) { return from.is(u) && refinement(u); }
	    };
	}
	exports.refinement = refinement;
	/**
	 * @since 2.2.0
	 */
	function nullable(or) {
	    return {
	        is: function (u) { return u === null || or.is(u); }
	    };
	}
	exports.nullable = nullable;
	/**
	 * @since 2.2.0
	 */
	function type(properties) {
	    return refinement(exports.UnknownRecord, function (r) {
	        for (var k in properties) {
	            if (!(k in r) || !properties[k].is(r[k])) {
	                return false;
	            }
	        }
	        return true;
	    });
	}
	exports.type = type;
	/**
	 * @since 2.2.0
	 */
	function partial(properties) {
	    return refinement(exports.UnknownRecord, function (r) {
	        for (var k in properties) {
	            var v = r[k];
	            if (v !== undefined && !properties[k].is(v)) {
	                return false;
	            }
	        }
	        return true;
	    });
	}
	exports.partial = partial;
	/**
	 * @since 2.2.0
	 */
	function record(codomain) {
	    return refinement(exports.UnknownRecord, function (r) {
	        for (var k in r) {
	            if (!codomain.is(r[k])) {
	                return false;
	            }
	        }
	        return true;
	    });
	}
	exports.record = record;
	/**
	 * @since 2.2.0
	 */
	function array(items) {
	    return refinement(exports.UnknownArray, function (us) { return us.every(items.is); });
	}
	exports.array = array;
	/**
	 * @since 2.2.0
	 */
	function tuple() {
	    var components = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        components[_i] = arguments[_i];
	    }
	    return {
	        is: function (u) { return Array.isArray(u) && u.length === components.length && components.every(function (c, i) { return c.is(u[i]); }); }
	    };
	}
	exports.tuple = tuple;
	/**
	 * @since 2.2.0
	 */
	function intersection(left, right) {
	    return {
	        is: function (u) { return left.is(u) && right.is(u); }
	    };
	}
	exports.intersection = intersection;
	/**
	 * @since 2.2.0
	 */
	function union() {
	    var members = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        members[_i] = arguments[_i];
	    }
	    return {
	        is: function (u) { return members.some(function (m) { return m.is(u); }); }
	    };
	}
	exports.union = union;
	/**
	 * @since 2.2.0
	 */
	function sum(tag) {
	    return function (members) {
	        return refinement(exports.UnknownRecord, function (r) {
	            var v = r[tag];
	            if (exports.string.is(v) && v in members) {
	                return members[v].is(r);
	            }
	            return false;
	        });
	    };
	}
	exports.sum = sum;
	/**
	 * @since 2.2.0
	 */
	function lazy(f) {
	    var get = Schemable.memoize(f);
	    return {
	        is: function (u) { return get().is(u); }
	    };
	}
	exports.lazy = lazy;
	// -------------------------------------------------------------------------------------
	// instances
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	exports.URI = 'io-ts/Guard';
	/**
	 * @since 2.2.3
	 */
	exports.schemableGuard = {
	    URI: exports.URI,
	    literal: literal,
	    string: exports.string,
	    number: exports.number,
	    boolean: exports.boolean,
	    nullable: nullable,
	    type: type,
	    partial: partial,
	    record: record,
	    array: array,
	    tuple: tuple,
	    intersection: intersection,
	    sum: sum,
	    lazy: function (_, f) { return lazy(f); },
	    UnknownArray: exports.UnknownArray,
	    UnknownRecord: exports.UnknownRecord,
	    union: union,
	    refinement: refinement
	};
	});

	unwrapExports(Guard);
	var Guard_1 = Guard.schemableGuard;
	var Guard_2 = Guard.URI;
	var Guard_3 = Guard.lazy;
	var Guard_4 = Guard.sum;
	var Guard_5 = Guard.union;
	var Guard_6 = Guard.intersection;
	var Guard_7 = Guard.tuple;
	var Guard_8 = Guard.array;
	var Guard_9 = Guard.record;
	var Guard_10 = Guard.partial;
	var Guard_11 = Guard.type;
	var Guard_12 = Guard.nullable;
	var Guard_13 = Guard.refinement;
	var Guard_14 = Guard.UnknownRecord;
	var Guard_15 = Guard.UnknownArray;
	var Guard_16 = Guard.number;
	var Guard_17 = Guard.string;
	var Guard_18 = Guard.never;
	var Guard_19 = Guard.literal;

	var Decoder = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.schemableDecoder = exports.altDecoder = exports.functorDecoder = exports.URI = exports.alt = exports.map = exports.union = exports.sum = exports.lazy = exports.intersection = exports.intersect = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.nullable = exports.parse = exports.refinement = exports.withExpected = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.never = exports.literal = exports.fromGuard = exports.of = exports.isNotEmpty = exports.failure = exports.success = exports.tree = void 0;
	/**
	 * @since 2.2.0
	 */




	// -------------------------------------------------------------------------------------
	// DecodeError
	// -------------------------------------------------------------------------------------
	var empty = [];
	/**
	 * @since 2.2.0
	 */
	function tree(value, forest) {
	    if (forest === void 0) { forest = empty; }
	    return {
	        value: value,
	        forest: forest
	    };
	}
	exports.tree = tree;
	/**
	 * @since 2.2.0
	 */
	function success(a) {
	    return Either.right(a);
	}
	exports.success = success;
	/**
	 * @since 2.2.0
	 */
	function failure(message) {
	    return Either.left([tree(message)]);
	}
	exports.failure = failure;
	/**
	 * @since 2.2.2
	 */
	function isNotEmpty(as) {
	    return as.length > 0;
	}
	exports.isNotEmpty = isNotEmpty;
	// -------------------------------------------------------------------------------------
	// constructors
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.3
	 */
	function of(a) {
	    return {
	        decode: function () { return success(a); }
	    };
	}
	exports.of = of;
	/**
	 * @since 2.2.0
	 */
	function fromGuard(guard, expected) {
	    return {
	        decode: function (u) { return (guard.is(u) ? success(u) : failure("cannot decode " + JSON.stringify(u) + ", should be " + expected)); }
	    };
	}
	exports.fromGuard = fromGuard;
	/**
	 * @since 2.2.0
	 */
	function literal() {
	    var _a;
	    var values = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        values[_i] = arguments[_i];
	    }
	    if (values.length === 0) {
	        return exports.never;
	    }
	    var expected = values.map(function (value) { return JSON.stringify(value); }).join(' | ');
	    return fromGuard((_a = Guard.schemableGuard).literal.apply(_a, values), expected);
	}
	exports.literal = literal;
	// -------------------------------------------------------------------------------------
	// primitives
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	exports.never = fromGuard(Guard.never, 'never');
	/**
	 * @since 2.2.0
	 */
	exports.string = fromGuard(Guard.string, 'string');
	/**
	 * @since 2.2.0
	 */
	exports.number = fromGuard(Guard.number, 'number');
	/**
	 * @since 2.2.0
	 */
	exports.boolean = fromGuard(Guard.boolean, 'boolean');
	/**
	 * @since 2.2.0
	 */
	exports.UnknownArray = fromGuard(Guard.UnknownArray, 'Array<unknown>');
	/**
	 * @since 2.2.0
	 */
	exports.UnknownRecord = fromGuard(Guard.UnknownRecord, 'Record<string, unknown>');
	// -------------------------------------------------------------------------------------
	// combinators
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	function withExpected(decoder, expected) {
	    return {
	        decode: function (u) {
	            return pipeable_1.pipe(decoder.decode(u), Either.mapLeft(function (nea) { return expected(u, nea); }));
	        }
	    };
	}
	exports.withExpected = withExpected;
	/**
	 * @since 2.2.0
	 */
	function refinement(from, refinement, expected) {
	    return {
	        decode: function (u) {
	            var e = from.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            var a = e.right;
	            return refinement(a) ? success(a) : failure("cannot refine " + JSON.stringify(u) + ", should be " + expected);
	        }
	    };
	}
	exports.refinement = refinement;
	/**
	 * @since 2.2.0
	 */
	function parse(from, parser) {
	    return {
	        decode: function (u) {
	            var e = from.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            var pe = parser(e.right);
	            if (Either.isLeft(pe)) {
	                return failure(pe.left);
	            }
	            return pe;
	        }
	    };
	}
	exports.parse = parse;
	/**
	 * @since 2.2.0
	 */
	function nullable(or) {
	    return union(literal(null), or);
	}
	exports.nullable = nullable;
	/**
	 * @since 2.2.0
	 */
	function type(properties) {
	    return {
	        decode: function (u) {
	            var e = exports.UnknownRecord.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            else {
	                var r = e.right;
	                var a = {};
	                var errors = [];
	                for (var k in properties) {
	                    var e_1 = properties[k].decode(r[k]);
	                    if (Either.isLeft(e_1)) {
	                        errors.push(tree("required property " + JSON.stringify(k), e_1.left));
	                    }
	                    else {
	                        a[k] = e_1.right;
	                    }
	                }
	                return isNotEmpty(errors) ? Either.left(errors) : success(a);
	            }
	        }
	    };
	}
	exports.type = type;
	/**
	 * @since 2.2.0
	 */
	function partial(properties) {
	    return {
	        decode: function (u) {
	            var e = exports.UnknownRecord.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            else {
	                var r = e.right;
	                var a = {};
	                var errors = [];
	                for (var k in properties) {
	                    // don't add missing properties
	                    if (k in r) {
	                        var rk = r[k];
	                        // don't strip undefined properties
	                        if (rk === undefined) {
	                            a[k] = undefined;
	                        }
	                        else {
	                            var e_2 = properties[k].decode(rk);
	                            if (Either.isLeft(e_2)) {
	                                errors.push(tree("optional property " + JSON.stringify(k), e_2.left));
	                            }
	                            else {
	                                a[k] = e_2.right;
	                            }
	                        }
	                    }
	                }
	                return isNotEmpty(errors) ? Either.left(errors) : success(a);
	            }
	        }
	    };
	}
	exports.partial = partial;
	/**
	 * @since 2.2.0
	 */
	function record(codomain) {
	    return {
	        decode: function (u) {
	            var e = exports.UnknownRecord.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            else {
	                var r = e.right;
	                var a = {};
	                var errors = [];
	                for (var k in r) {
	                    var e_3 = codomain.decode(r[k]);
	                    if (Either.isLeft(e_3)) {
	                        errors.push(tree("key " + JSON.stringify(k), e_3.left));
	                    }
	                    else {
	                        a[k] = e_3.right;
	                    }
	                }
	                return isNotEmpty(errors) ? Either.left(errors) : success(a);
	            }
	        }
	    };
	}
	exports.record = record;
	/**
	 * @since 2.2.0
	 */
	function array(items) {
	    return {
	        decode: function (u) {
	            var e = exports.UnknownArray.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            else {
	                var us = e.right;
	                var len = us.length;
	                var a = new Array(len);
	                var errors = [];
	                for (var i = 0; i < len; i++) {
	                    var e_4 = items.decode(us[i]);
	                    if (Either.isLeft(e_4)) {
	                        errors.push(tree("item " + i, e_4.left));
	                    }
	                    else {
	                        a[i] = e_4.right;
	                    }
	                }
	                return isNotEmpty(errors) ? Either.left(errors) : success(a);
	            }
	        }
	    };
	}
	exports.array = array;
	/**
	 * @since 2.2.0
	 */
	function tuple() {
	    var components = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        components[_i] = arguments[_i];
	    }
	    return {
	        decode: function (u) {
	            var e = exports.UnknownArray.decode(u);
	            if (Either.isLeft(e)) {
	                return e;
	            }
	            var us = e.right;
	            var a = [];
	            var errors = [];
	            for (var i = 0; i < components.length; i++) {
	                var e_5 = components[i].decode(us[i]);
	                if (Either.isLeft(e_5)) {
	                    errors.push(tree("component " + i, e_5.left));
	                }
	                else {
	                    a.push(e_5.right);
	                }
	            }
	            return isNotEmpty(errors) ? Either.left(errors) : success(a);
	        }
	    };
	}
	exports.tuple = tuple;
	function typeOf(x) {
	    return x === null ? 'null' : typeof x;
	}
	/**
	 * @internal
	 */
	function intersect(a, b) {
	    if (a !== undefined && b !== undefined) {
	        var tx = typeOf(a);
	        var ty = typeOf(b);
	        if (tx === 'object' || ty === 'object') {
	            return Object.assign({}, a, b);
	        }
	    }
	    return b;
	}
	exports.intersect = intersect;
	/**
	 * @since 2.2.0
	 */
	function intersection(left, right) {
	    return {
	        decode: function (u) {
	            var ea = left.decode(u);
	            if (Either.isLeft(ea)) {
	                return ea;
	            }
	            var eb = right.decode(u);
	            if (Either.isLeft(eb)) {
	                return eb;
	            }
	            return success(intersect(ea.right, eb.right));
	        }
	    };
	}
	exports.intersection = intersection;
	/**
	 * @since 2.2.0
	 */
	function lazy(id, f) {
	    var get = Schemable.memoize(f);
	    return {
	        decode: function (u) {
	            return pipeable_1.pipe(get().decode(u), Either.mapLeft(function (nea) { return [tree(id, nea)]; }));
	        }
	    };
	}
	exports.lazy = lazy;
	/**
	 * @since 2.2.0
	 */
	function sum(tag) {
	    return function (members) {
	        var keys = Object.keys(members);
	        if (keys.length === 0) {
	            return exports.never;
	        }
	        var expected = keys.map(function (k) { return JSON.stringify(k); }).join(' | ');
	        return {
	            decode: function (u) {
	                var e = exports.UnknownRecord.decode(u);
	                if (Either.isLeft(e)) {
	                    return e;
	                }
	                var v = e.right[tag];
	                if (Guard.string.is(v) && v in members) {
	                    return members[v].decode(u);
	                }
	                return Either.left([
	                    tree("required property " + JSON.stringify(tag), [
	                        tree("cannot decode " + JSON.stringify(v) + ", should be " + expected)
	                    ])
	                ]);
	            }
	        };
	    };
	}
	exports.sum = sum;
	/**
	 * @since 2.2.0
	 */
	function union() {
	    var members = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        members[_i] = arguments[_i];
	    }
	    var len = members.length;
	    if (len === 0) {
	        return exports.never;
	    }
	    return {
	        decode: function (u) {
	            var e = members[0].decode(u);
	            if (Either.isRight(e)) {
	                return e;
	            }
	            else {
	                var errors = [tree("member 0", e.left)];
	                for (var i = 1; i < len; i++) {
	                    var e_6 = members[i].decode(u);
	                    if (Either.isRight(e_6)) {
	                        return e_6;
	                    }
	                    else {
	                        errors.push(tree("member " + i, e_6.left));
	                    }
	                }
	                return Either.left(errors);
	            }
	        }
	    };
	}
	exports.union = union;
	// -------------------------------------------------------------------------------------
	// pipeables
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	exports.map = function (f) { return function (fa) { return map_(fa, f); }; };
	var map_ = function (fa, f) { return ({
	    decode: function (u) {
	        var e = fa.decode(u);
	        return Either.isLeft(e) ? e : Either.right(f(e.right));
	    }
	}); };
	/**
	 * @since 2.2.0
	 */
	exports.alt = function (that) { return function (fa) { return alt_(fa, that); }; };
	var alt_ = function (fx, fy) { return ({
	    decode: function (u) {
	        var e = fx.decode(u);
	        return Either.isLeft(e) ? fy().decode(u) : e;
	    }
	}); };
	// -------------------------------------------------------------------------------------
	// instances
	// -------------------------------------------------------------------------------------
	/**
	 * @since 2.2.0
	 */
	exports.URI = 'io-ts/Decoder';
	/**
	 * @since 2.2.3
	 */
	exports.functorDecoder = {
	    URI: exports.URI,
	    map: map_
	};
	/**
	 * @since 2.2.3
	 */
	exports.altDecoder = {
	    URI: exports.URI,
	    map: map_,
	    alt: alt_
	};
	/**
	 * @since 2.2.3
	 */
	exports.schemableDecoder = {
	    URI: exports.URI,
	    literal: literal,
	    string: exports.string,
	    number: exports.number,
	    boolean: exports.boolean,
	    nullable: nullable,
	    type: type,
	    partial: partial,
	    record: record,
	    array: array,
	    tuple: tuple,
	    intersection: intersection,
	    sum: sum,
	    lazy: lazy,
	    UnknownArray: exports.UnknownArray,
	    UnknownRecord: exports.UnknownRecord,
	    union: union,
	    refinement: refinement
	};
	});

	unwrapExports(Decoder);
	var Decoder_1 = Decoder.schemableDecoder;
	var Decoder_2 = Decoder.altDecoder;
	var Decoder_3 = Decoder.functorDecoder;
	var Decoder_4 = Decoder.URI;
	var Decoder_5 = Decoder.alt;
	var Decoder_6 = Decoder.map;
	var Decoder_7 = Decoder.union;
	var Decoder_8 = Decoder.sum;
	var Decoder_9 = Decoder.lazy;
	var Decoder_10 = Decoder.intersection;
	var Decoder_11 = Decoder.intersect;
	var Decoder_12 = Decoder.tuple;
	var Decoder_13 = Decoder.array;
	var Decoder_14 = Decoder.record;
	var Decoder_15 = Decoder.partial;
	var Decoder_16 = Decoder.type;
	var Decoder_17 = Decoder.nullable;
	var Decoder_18 = Decoder.parse;
	var Decoder_19 = Decoder.refinement;
	var Decoder_20 = Decoder.withExpected;
	var Decoder_21 = Decoder.UnknownRecord;
	var Decoder_22 = Decoder.UnknownArray;
	var Decoder_23 = Decoder.number;
	var Decoder_24 = Decoder.string;
	var Decoder_25 = Decoder.never;
	var Decoder_26 = Decoder.literal;
	var Decoder_27 = Decoder.fromGuard;
	var Decoder_28 = Decoder.of;
	var Decoder_29 = Decoder.isNotEmpty;
	var Decoder_30 = Decoder.failure;
	var Decoder_31 = Decoder.success;
	var Decoder_32 = Decoder.tree;

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

	    return mapSendPort(
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
	                resolve(mapPort(rawPort, event => event.data, any => any));
	            }
	            else {
	                reject(`Malformed message`);
	            }

	            window.removeEventListener("message", handler);
	        };
	        window.addEventListener("message", handler);
	    });
	}

	var utf8 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(utf8);
	var utf8_1 = utf8.utf8DecodeTD;
	var utf8_2 = utf8.TEXT_DECODER_THRESHOLD;
	var utf8_3 = utf8.utf8DecodeJs;
	var utf8_4 = utf8.utf8EncodeTE;
	var utf8_5 = utf8.TEXT_ENCODER_THRESHOLD;
	var utf8_6 = utf8.utf8EncodeJs;
	var utf8_7 = utf8.utf8Count;
	var utf8_8 = utf8.TEXT_ENCODING_AVAILABLE;

	var ExtData_1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(ExtData_1);
	var ExtData_2 = ExtData_1.ExtData;

	var int_1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(int_1);
	var int_2 = int_1.getUint64;
	var int_3 = int_1.getInt64;
	var int_4 = int_1.setInt64;
	var int_5 = int_1.setUint64;

	var timestamp = createCommonjsModule(function (module, exports) {
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

	unwrapExports(timestamp);
	var timestamp_1 = timestamp.timestampExtension;
	var timestamp_2 = timestamp.decodeTimestampExtension;
	var timestamp_3 = timestamp.decodeTimestampToTimeSpec;
	var timestamp_4 = timestamp.encodeTimestampExtension;
	var timestamp_5 = timestamp.encodeDateToTimeSpec;
	var timestamp_6 = timestamp.encodeTimeSpecToTimestamp;
	var timestamp_7 = timestamp.EXT_TIMESTAMP;

	var ExtensionCodec_1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(ExtensionCodec_1);
	var ExtensionCodec_2 = ExtensionCodec_1.ExtensionCodec;

	var typedArrays = createCommonjsModule(function (module, exports) {
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

	unwrapExports(typedArrays);
	var typedArrays_1 = typedArrays.createDataView;
	var typedArrays_2 = typedArrays.ensureUint8Array;

	var Encoder_1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(Encoder_1);
	var Encoder_2 = Encoder_1.Encoder;
	var Encoder_3 = Encoder_1.DEFAULT_INITIAL_BUFFER_SIZE;
	var Encoder_4 = Encoder_1.DEFAULT_MAX_DEPTH;

	var encode_1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(encode_1);
	var encode_2 = encode_1.encode;

	var prettyByte_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.prettyByte = void 0;
	function prettyByte(byte) {
	    return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
	}
	exports.prettyByte = prettyByte;

	});

	unwrapExports(prettyByte_1);
	var prettyByte_2 = prettyByte_1.prettyByte;

	var CachedKeyDecoder_1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(CachedKeyDecoder_1);
	var CachedKeyDecoder_2 = CachedKeyDecoder_1.CachedKeyDecoder;

	var Decoder_1$1 = createCommonjsModule(function (module, exports) {
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

	unwrapExports(Decoder_1$1);
	var Decoder_2$1 = Decoder_1$1.Decoder;
	var Decoder_3$1 = Decoder_1$1.DataViewIndexOutOfBoundsError;

	var decode_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decode = exports.defaultDecodeOptions = void 0;

	exports.defaultDecodeOptions = {};
	/**
	 * It decodes a MessagePack-encoded buffer.
	 *
	 * This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
	 */
	function decode(buffer, options = exports.defaultDecodeOptions) {
	    const decoder = new Decoder_1$1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
	    decoder.setBuffer(buffer); // decodeSync() requires only one buffer
	    return decoder.decodeSingleSync();
	}
	exports.decode = decode;

	});

	unwrapExports(decode_1);
	var decode_2 = decode_1.decode;
	var decode_3 = decode_1.defaultDecodeOptions;

	var stream = createCommonjsModule(function (module, exports) {
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

	unwrapExports(stream);
	var stream_1 = stream.ensureAsyncIterabe;
	var stream_2 = stream.asyncIterableFromStream;
	var stream_3 = stream.isAsyncIterable;

	var decodeAsync_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodeStream = exports.decodeArrayStream = exports.decodeAsync = void 0;



	async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
	    const stream$1 = stream.ensureAsyncIterabe(streamLike);
	    const decoder = new Decoder_1$1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
	    return decoder.decodeSingleAsync(stream$1);
	}
	exports.decodeAsync = decodeAsync;
	function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
	    const stream$1 = stream.ensureAsyncIterabe(streamLike);
	    const decoder = new Decoder_1$1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
	    return decoder.decodeArrayStream(stream$1);
	}
	exports.decodeArrayStream = decodeArrayStream;
	function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
	    const stream$1 = stream.ensureAsyncIterabe(streamLike);
	    const decoder = new Decoder_1$1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
	    return decoder.decodeStream(stream$1);
	}
	exports.decodeStream = decodeStream;

	});

	unwrapExports(decodeAsync_1);
	var decodeAsync_2 = decodeAsync_1.decodeStream;
	var decodeAsync_3 = decodeAsync_1.decodeArrayStream;
	var decodeAsync_4 = decodeAsync_1.decodeAsync;

	var dist = createCommonjsModule(function (module, exports) {
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

	Object.defineProperty(exports, "Decoder", { enumerable: true, get: function () { return Decoder_1$1.Decoder; } });
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

	unwrapExports(dist);
	var dist_1 = dist.encode;
	var dist_2 = dist.decode;
	var dist_3 = dist.decodeAsync;
	var dist_4 = dist.decodeArrayStream;
	var dist_5 = dist.decodeStream;
	var dist_6 = dist.Decoder;
	var dist_7 = dist.Encoder;
	var dist_8 = dist.ExtensionCodec;
	var dist_9 = dist.ExtData;
	var dist_10 = dist.EXT_TIMESTAMP;
	var dist_11 = dist.encodeDateToTimeSpec;
	var dist_12 = dist.encodeTimeSpecToTimestamp;
	var dist_13 = dist.decodeTimestampToTimeSpec;
	var dist_14 = dist.encodeTimestampExtension;
	var dist_15 = dist.decodeTimestampExtension;

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
	        const codec = new dist_8();

	        this.registerStrict(codec);

	        codec.register({
	            type: msgPackEtypeUndef,
	            encode: value => value instanceof Undefined ? dist_1(null) : null,
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
	                        return dist_1([name, value[serialize]()], { extensionCodec: codec });

	                    const raw = Object.entries(value);
	                    const entries = raw.map(([key, value]) => {
	                        if (value === undefined)
	                            return [key, new Undefined()];
	                        else
	                            return [key, value];
	                    });

	                    return dist_1([name, entries], { extensionCodec: codec })
	                }

	                return null;
	            },
	            decode: buffer => {
	                const [name, raw] = dist_2(buffer, { extensionCodec: codec }) ;
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
	            encode: value => value instanceof Error ? dist_1(value.message) : null,
	            decode: buffer => new Error(dist_2(buffer) )
	        });

	        return codec;
	    }

	    encode(value) {
	        if (!this.codec)
	            this.codec = this.makeCodec();

	        return dist_1(value, { extensionCodec: this.codec });
	    }

	    decode(buffer) {
	        if (!this.codec)
	            this.codec = this.makeCodec();

	        return dist_2(buffer, { extensionCodec: this.codec });
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

	const podBubblewrapClasses = {
	    "@polypoly-eu/podigree.FetchResponse": FetchResponse,
	    "@polypoly-eu/rdf.NamedNode": NamedNode,
	    "@polypoly-eu/rdf.BlankNode": BlankNode,
	    "@polypoly-eu/rdf.Literal": Literal,
	    "@polypoly-eu/rdf.Variable": Variable,
	    "@polypoly-eu/rdf.DefaultGraph": DefaultGraph,
	    "@polypoly-eu/rdf.Quad": Quad
	};

	const podBubblewrap = Bubblewrap.create(podBubblewrapClasses);

	function bubblewrapPort(rawPort) {
	    return mapPort(
	        rawPort,
	        buf => podBubblewrap.decode(buf),
	        data => podBubblewrap.encode(data)
	    );
	}

	class RemoteClientPod  {

	    

	    static fromFetch(url, fetch = window.fetch) {
	        const port = bubblewrapFetchPort(
	            url,
	            podBubblewrap,
	            fetch
	        );

	        return new RemoteClientPod(port, dataFactory);
	    }

	    static fromRawPort(rawPort) {
	        return new RemoteClientPod(liftClient(bubblewrapPort(rawPort)), dataFactory);
	    }

	    constructor(
	         clientPort,
	          dataFactory
	    ) {this.clientPort = clientPort;this.dataFactory = dataFactory;
	        this.rpcClient = endpointClient(client(clientPort));
	    }

	    get polyIn() {
	        return {
	            factory: this.dataFactory,
	            add: (...quads) => this.rpcClient.polyIn().add(...quads)(),
	            select: matcher => this.rpcClient.polyIn().select(matcher)()
	        };
	    }

	    get polyOut() {
	        return {
	            readFile: (path, options) =>
	                this.rpcClient.polyOut().readFile(path, options)(),
	            writeFile: (path, contents, options) =>
	                this.rpcClient.polyOut().writeFile(path, contents, options)(),
	            stat: path =>
	                this.rpcClient.polyOut().stat(path)(),
	            fetch: (input, init) =>
	                // we need to `|| {}` here because the msgpack library (via bubblewrap) maps `undefined` to `null`,
	                // which confuses some fetch implementations
	                this.rpcClient.polyOut().fetch(input, init || {})()
	        };
	    }

	}

	const iframeInnerDecoder = Decoder_16({
	    type: Decoder_26("iframe"),
	    secret: Decoder_24
	});







	const fetchDecoder = Decoder_16({
	    type: Decoder_26("fetch"),
	    uri: Decoder_24
	});



	const specDecoder = Decoder_8("type")({
	    iframe: iframeInnerDecoder,
	    fetch: fetchDecoder
	});

	function parseSpec(spec) {
	    const parsed = JSON.parse(spec);
	    return pipeable_3(
	        specDecoder.decode(parsed),
	        Either_42(
	            () => { throw new Error("Could not decode spec"); },
	            t => t
	        )
	    );
	}

	async function podOfSpec(spec) {
	    switch (spec.type) {
	        case "fetch":
	            return RemoteClientPod.fromFetch(spec.uri, spec.fetch);
	        case "iframe":
	            return RemoteClientPod.fromRawPort(await iframeInnerPort(spec.secret));
	    }
	}

	function detectSpec() {
	    if (document.currentScript && document.currentScript.dataset.spec !== undefined) {
	        return document.currentScript.dataset.spec;
	    }

	    throw new Error("No spec found; make sure to set the data-secret attribute");
	}



	const feature = new Feature();

	(async () => {
	    const pod = await podOfSpec(parseSpec(detectSpec()));
	    await feature.init(pod);
	    document.dispatchEvent(new CustomEvent("completed"));
	})();

}());
