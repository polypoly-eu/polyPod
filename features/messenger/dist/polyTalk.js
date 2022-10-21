(function (React, ReactDOM, polyLook) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactDOM__namespace = /*#__PURE__*/_interopNamespace(ReactDOM);

  function _setPrototypeOf$4(o, p) {
    _setPrototypeOf$4 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf$4(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf$4(subClass, superClass);
  }

  var propTypes = {exports: {}};

  var reactIs$1 = {exports: {}};

  var reactIs_development = {};

  /** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */



  {
    (function() {

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
  // (unstable) APIs that have been removed. Can we remove the symbols?

  var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
  var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
  var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
  var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
  var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
  }

  function typeOf(object) {
    if (typeof object === 'object' && object !== null) {
      var $$typeof = object.$$typeof;

      switch ($$typeof) {
        case REACT_ELEMENT_TYPE:
          var type = object.type;

          switch (type) {
            case REACT_ASYNC_MODE_TYPE:
            case REACT_CONCURRENT_MODE_TYPE:
            case REACT_FRAGMENT_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_SUSPENSE_TYPE:
              return type;

            default:
              var $$typeofType = type && type.$$typeof;

              switch ($$typeofType) {
                case REACT_CONTEXT_TYPE:
                case REACT_FORWARD_REF_TYPE:
                case REACT_LAZY_TYPE:
                case REACT_MEMO_TYPE:
                case REACT_PROVIDER_TYPE:
                  return $$typeofType;

                default:
                  return $$typeof;
              }

          }

        case REACT_PORTAL_TYPE:
          return $$typeof;
      }
    }

    return undefined;
  } // AsyncMode is deprecated along with isAsyncMode

  var AsyncMode = REACT_ASYNC_MODE_TYPE;
  var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
  var ContextConsumer = REACT_CONTEXT_TYPE;
  var ContextProvider = REACT_PROVIDER_TYPE;
  var Element = REACT_ELEMENT_TYPE;
  var ForwardRef = REACT_FORWARD_REF_TYPE;
  var Fragment = REACT_FRAGMENT_TYPE;
  var Lazy = REACT_LAZY_TYPE;
  var Memo = REACT_MEMO_TYPE;
  var Portal = REACT_PORTAL_TYPE;
  var Profiler = REACT_PROFILER_TYPE;
  var StrictMode = REACT_STRICT_MODE_TYPE;
  var Suspense = REACT_SUSPENSE_TYPE;
  var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

  function isAsyncMode(object) {
    {
      if (!hasWarnedAboutDeprecatedIsAsyncMode) {
        hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

        console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
      }
    }

    return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
  }
  function isConcurrentMode(object) {
    return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
  }
  function isContextConsumer(object) {
    return typeOf(object) === REACT_CONTEXT_TYPE;
  }
  function isContextProvider(object) {
    return typeOf(object) === REACT_PROVIDER_TYPE;
  }
  function isElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function isForwardRef(object) {
    return typeOf(object) === REACT_FORWARD_REF_TYPE;
  }
  function isFragment(object) {
    return typeOf(object) === REACT_FRAGMENT_TYPE;
  }
  function isLazy(object) {
    return typeOf(object) === REACT_LAZY_TYPE;
  }
  function isMemo(object) {
    return typeOf(object) === REACT_MEMO_TYPE;
  }
  function isPortal(object) {
    return typeOf(object) === REACT_PORTAL_TYPE;
  }
  function isProfiler(object) {
    return typeOf(object) === REACT_PROFILER_TYPE;
  }
  function isStrictMode(object) {
    return typeOf(object) === REACT_STRICT_MODE_TYPE;
  }
  function isSuspense(object) {
    return typeOf(object) === REACT_SUSPENSE_TYPE;
  }

  reactIs_development.AsyncMode = AsyncMode;
  reactIs_development.ConcurrentMode = ConcurrentMode;
  reactIs_development.ContextConsumer = ContextConsumer;
  reactIs_development.ContextProvider = ContextProvider;
  reactIs_development.Element = Element;
  reactIs_development.ForwardRef = ForwardRef;
  reactIs_development.Fragment = Fragment;
  reactIs_development.Lazy = Lazy;
  reactIs_development.Memo = Memo;
  reactIs_development.Portal = Portal;
  reactIs_development.Profiler = Profiler;
  reactIs_development.StrictMode = StrictMode;
  reactIs_development.Suspense = Suspense;
  reactIs_development.isAsyncMode = isAsyncMode;
  reactIs_development.isConcurrentMode = isConcurrentMode;
  reactIs_development.isContextConsumer = isContextConsumer;
  reactIs_development.isContextProvider = isContextProvider;
  reactIs_development.isElement = isElement;
  reactIs_development.isForwardRef = isForwardRef;
  reactIs_development.isFragment = isFragment;
  reactIs_development.isLazy = isLazy;
  reactIs_development.isMemo = isMemo;
  reactIs_development.isPortal = isPortal;
  reactIs_development.isProfiler = isProfiler;
  reactIs_development.isStrictMode = isStrictMode;
  reactIs_development.isSuspense = isSuspense;
  reactIs_development.isValidElementType = isValidElementType;
  reactIs_development.typeOf = typeOf;
    })();
  }

  {
    reactIs$1.exports = reactIs_development;
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret$2 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret$2;

  var has$2 = Function.call.bind(Object.prototype.hasOwnProperty);

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var printWarning$1 = function() {};

  {
    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
    var has$1 = has$2;

    printWarning$1 = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) { /**/ }
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes$1(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (has$1(typeSpecs, typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
                'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning$1(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning$1(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  /**
   * Resets warning cache when testing.
   *
   * @private
   */
  checkPropTypes$1.resetWarningCache = function() {
    {
      loggedTypeFailures = {};
    }
  };

  var checkPropTypes_1 = checkPropTypes$1;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactIs$1 = reactIs$1.exports;
  var assign = objectAssign;

  var ReactPropTypesSecret = ReactPropTypesSecret_1;
  var has = has$2;
  var checkPropTypes = checkPropTypes_1;

  var printWarning = function() {};

  {
    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  function emptyFunctionThatReturnsNull() {
    return null;
  }

  var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
    /* global Symbol */
    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

    /**
     * Returns the iterator method function contained on the iterable object.
     *
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
    function getIteratorFn(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === 'function') {
        return iteratorFn;
      }
    }

    /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */

    var ANONYMOUS = '<<anonymous>>';

    // Important!
    // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
    var ReactPropTypes = {
      array: createPrimitiveTypeChecker('array'),
      bigint: createPrimitiveTypeChecker('bigint'),
      bool: createPrimitiveTypeChecker('boolean'),
      func: createPrimitiveTypeChecker('function'),
      number: createPrimitiveTypeChecker('number'),
      object: createPrimitiveTypeChecker('object'),
      string: createPrimitiveTypeChecker('string'),
      symbol: createPrimitiveTypeChecker('symbol'),

      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      elementType: createElementTypeTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker,
      exact: createStrictShapeTypeChecker,
    };

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    /*eslint-disable no-self-compare*/
    function is(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
    /*eslint-enable no-self-compare*/

    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However, we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message, data) {
      this.message = message;
      this.data = data && typeof data === 'object' ? data: {};
      this.stack = '';
    }
    // Make `instanceof Error` still work for returned errors.
    PropTypeError.prototype = Error.prototype;

    function createChainableTypeChecker(validate) {
      {
        var manualPropTypeCallCache = {};
        var manualPropTypeWarningCount = 0;
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;

        if (secret !== ReactPropTypesSecret) {
          if (throwOnDirectAccess) {
            // New behavior only for users of `prop-types` package
            var err = new Error(
              'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
            );
            err.name = 'Invariant Violation';
            throw err;
          } else if (typeof console !== 'undefined') {
            // Old behavior for people using React.PropTypes
            var cacheKey = componentName + ':' + propName;
            if (
              !manualPropTypeCallCache[cacheKey] &&
              // Avoid spamming the console because they are often not actionable except for lib authors
              manualPropTypeWarningCount < 3
            ) {
              printWarning(
                'You are manually calling a React.PropTypes validation ' +
                'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
              );
              manualPropTypeCallCache[cacheKey] = true;
              manualPropTypeWarningCount++;
            }
          }
        }
        if (props[propName] == null) {
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
            }
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }

      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);

      return chainedCheckType;
    }

    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          // `propValue` being instance of, say, date/regexp, pass the 'object'
          // check, but we can offer a more precise error message here rather than
          // 'of type `object`'.
          var preciseType = getPreciseType(propValue);

          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
            {expectedType: expectedType}
          );
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunctionThatReturnsNull);
    }

    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!isValidElement(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createElementTypeTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!ReactIs$1.isValidElementType(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        {
          if (arguments.length > 1) {
            printWarning(
              'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
              'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
            );
          } else {
            printWarning('Invalid argument supplied to oneOf, expected an array.');
          }
        }
        return emptyFunctionThatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }

        var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
          var type = getPreciseType(value);
          if (type === 'symbol') {
            return String(value);
          }
          return value;
        });
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
        }
        for (var key in propValue) {
          if (has(propValue, key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') ;
        return emptyFunctionThatReturnsNull;
      }

      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (typeof checker !== 'function') {
          printWarning(
            'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
          );
          return emptyFunctionThatReturnsNull;
        }
      }

      function validate(props, propName, componentName, location, propFullName) {
        var expectedTypes = [];
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
          if (checkerResult == null) {
            return null;
          }
          if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
            expectedTypes.push(checkerResult.data.expectedType);
          }
        }
        var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function invalidValidatorError(componentName, location, propFullName, key, type) {
      return new PropTypeError(
        (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
        'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
      );
    }

    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (typeof checker !== 'function') {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createStrictShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        // We need to check all keys in case some are required but missing from props.
        var allKeys = assign({}, props[propName], shapeTypes);
        for (var key in allKeys) {
          var checker = shapeTypes[key];
          if (has(shapeTypes, key) && typeof checker !== 'function') {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          if (!checker) {
            return new PropTypeError(
              'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
              '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
            );
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }

      return createChainableTypeChecker(validate);
    }

    function isNode(propValue) {
      switch (typeof propValue) {
        case 'number':
        case 'string':
        case 'undefined':
          return true;
        case 'boolean':
          return !propValue;
        case 'object':
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || isValidElement(propValue)) {
            return true;
          }

          var iteratorFn = getIteratorFn(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }

          return true;
        default:
          return false;
      }
    }

    function isSymbol(propType, propValue) {
      // Native Symbol.
      if (propType === 'symbol') {
        return true;
      }

      // falsy value can't be a Symbol
      if (!propValue) {
        return false;
      }

      // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
      if (propValue['@@toStringTag'] === 'Symbol') {
        return true;
      }

      // Fallback for non-spec compliant Symbols which are polyfilled.
      if (typeof Symbol === 'function' && propValue instanceof Symbol) {
        return true;
      }

      return false;
    }

    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
      var propType = typeof propValue;
      if (Array.isArray(propValue)) {
        return 'array';
      }
      if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return 'function' rather than
        // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
        // passes PropTypes.object.
        return 'object';
      }
      if (isSymbol(propType, propValue)) {
        return 'symbol';
      }
      return propType;
    }

    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
      if (typeof propValue === 'undefined' || propValue === null) {
        return '' + propValue;
      }
      var propType = getPropType(propValue);
      if (propType === 'object') {
        if (propValue instanceof Date) {
          return 'date';
        } else if (propValue instanceof RegExp) {
          return 'regexp';
        }
      }
      return propType;
    }

    // Returns a string that is postfixed to a warning about an invalid type.
    // For example, "undefined" or "of type array"
    function getPostfixForTypeWarning(value) {
      var type = getPreciseType(value);
      switch (type) {
        case 'array':
        case 'object':
          return 'an ' + type;
        case 'boolean':
        case 'date':
        case 'regexp':
          return 'a ' + type;
        default:
          return type;
      }
    }

    // Returns class name of the object, if any.
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }

    ReactPropTypes.checkPropTypes = checkPropTypes;
    ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
    ReactPropTypes.PropTypes = ReactPropTypes;

    return ReactPropTypes;
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    var ReactIs = reactIs$1.exports;

    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    var throwOnDirectAccess = true;
    propTypes.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
  }

  var PropTypes = propTypes.exports;

  function _extends$y() {
    _extends$y = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };
    return _extends$y.apply(this, arguments);
  }

  function isAbsolute(pathname) {
    return pathname.charAt(0) === '/';
  }

  // About 1.5x faster than the two-arg version of Array#splice()
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  // This implementation is based heavily on node's url.parse
  function resolvePathname(to, from) {
    if (from === undefined) from = '';

    var toParts = (to && to.split('/')) || [];
    var fromParts = (from && from.split('/')) || [];

    var isToAbs = to && isAbsolute(to);
    var isFromAbs = from && isAbsolute(from);
    var mustEndAbs = isToAbs || isFromAbs;

    if (to && isAbsolute(to)) {
      // to is absolute
      fromParts = toParts;
    } else if (toParts.length) {
      // to is relative, drop the filename
      fromParts.pop();
      fromParts = fromParts.concat(toParts);
    }

    if (!fromParts.length) return '/';

    var hasTrailingSlash;
    if (fromParts.length) {
      var last = fromParts[fromParts.length - 1];
      hasTrailingSlash = last === '.' || last === '..' || last === '';
    } else {
      hasTrailingSlash = false;
    }

    var up = 0;
    for (var i = fromParts.length; i >= 0; i--) {
      var part = fromParts[i];

      if (part === '.') {
        spliceOne(fromParts, i);
      } else if (part === '..') {
        spliceOne(fromParts, i);
        up++;
      } else if (up) {
        spliceOne(fromParts, i);
        up--;
      }
    }

    if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

    if (
      mustEndAbs &&
      fromParts[0] !== '' &&
      (!fromParts[0] || !isAbsolute(fromParts[0]))
    )
      fromParts.unshift('');

    var result = fromParts.join('/');

    if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

    return result;
  }

  function valueOf(obj) {
    return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
  }

  function valueEqual(a, b) {
    // Test for strict equality first.
    if (a === b) return true;

    // Otherwise, if either of them == null they are not equal.
    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
      return (
        Array.isArray(b) &&
        a.length === b.length &&
        a.every(function(item, index) {
          return valueEqual(item, b[index]);
        })
      );
    }

    if (typeof a === 'object' || typeof b === 'object') {
      var aValue = valueOf(a);
      var bValue = valueOf(b);

      if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

      return Object.keys(Object.assign({}, a, b)).every(function(key) {
        return valueEqual(a[key], b[key]);
      });
    }

    return false;
  }

  function warning(condition, message) {
    {
      if (condition) {
        return;
      }

      var text = "Warning: " + message;

      if (typeof console !== 'undefined') {
        console.warn(text);
      }

      try {
        throw Error(text);
      } catch (x) {}
    }
  }

  var isProduction = "development" === 'production';
  var prefix$1 = 'Invariant failed';
  function invariant(condition, message) {
      if (condition) {
          return;
      }
      if (isProduction) {
          throw new Error(prefix$1);
      }
      var provided = typeof message === 'function' ? message() : message;
      var value = provided ? prefix$1 + ": " + provided : prefix$1;
      throw new Error(value);
  }

  function parsePath(path) {
    var pathname = path || '/';
    var search = '';
    var hash = '';
    var hashIndex = pathname.indexOf('#');

    if (hashIndex !== -1) {
      hash = pathname.substr(hashIndex);
      pathname = pathname.substr(0, hashIndex);
    }

    var searchIndex = pathname.indexOf('?');

    if (searchIndex !== -1) {
      search = pathname.substr(searchIndex);
      pathname = pathname.substr(0, searchIndex);
    }

    return {
      pathname: pathname,
      search: search === '?' ? '' : search,
      hash: hash === '#' ? '' : hash
    };
  }
  function createPath(location) {
    var pathname = location.pathname,
        search = location.search,
        hash = location.hash;
    var path = pathname || '/';
    if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
    return path;
  }

  function createLocation(path, state, key, currentLocation) {
    var location;

    if (typeof path === 'string') {
      // Two-arg form: push(path, state)
      location = parsePath(path);
      location.state = state;
    } else {
      // One-arg form: push(location)
      location = _extends$y({}, path);
      if (location.pathname === undefined) location.pathname = '';

      if (location.search) {
        if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
      } else {
        location.search = '';
      }

      if (location.hash) {
        if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
      } else {
        location.hash = '';
      }

      if (state !== undefined && location.state === undefined) location.state = state;
    }

    try {
      location.pathname = decodeURI(location.pathname);
    } catch (e) {
      if (e instanceof URIError) {
        throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
      } else {
        throw e;
      }
    }

    if (key) location.key = key;

    if (currentLocation) {
      // Resolve incomplete/relative pathname relative to current location.
      if (!location.pathname) {
        location.pathname = currentLocation.pathname;
      } else if (location.pathname.charAt(0) !== '/') {
        location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
      }
    } else {
      // When there is no prior location and pathname is empty, set it to /
      if (!location.pathname) {
        location.pathname = '/';
      }
    }

    return location;
  }
  function locationsAreEqual(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
  }

  function createTransitionManager() {
    var prompt = null;

    function setPrompt(nextPrompt) {
      warning(prompt == null, 'A history supports only one prompt at a time') ;
      prompt = nextPrompt;
      return function () {
        if (prompt === nextPrompt) prompt = null;
      };
    }

    function confirmTransitionTo(location, action, getUserConfirmation, callback) {
      // TODO: If another transition starts while we're still confirming
      // the previous one, we may end up in a weird state. Figure out the
      // best way to handle this.
      if (prompt != null) {
        var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

        if (typeof result === 'string') {
          if (typeof getUserConfirmation === 'function') {
            getUserConfirmation(result, callback);
          } else {
            warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message') ;
            callback(true);
          }
        } else {
          // Return false from a transition hook to cancel the transition.
          callback(result !== false);
        }
      } else {
        callback(true);
      }
    }

    var listeners = [];

    function appendListener(fn) {
      var isActive = true;

      function listener() {
        if (isActive) fn.apply(void 0, arguments);
      }

      listeners.push(listener);
      return function () {
        isActive = false;
        listeners = listeners.filter(function (item) {
          return item !== listener;
        });
      };
    }

    function notifyListeners() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      listeners.forEach(function (listener) {
        return listener.apply(void 0, args);
      });
    }

    return {
      setPrompt: setPrompt,
      confirmTransitionTo: confirmTransitionTo,
      appendListener: appendListener,
      notifyListeners: notifyListeners
    };
  }

  function clamp(n, lowerBound, upperBound) {
    return Math.min(Math.max(n, lowerBound), upperBound);
  }
  /**
   * Creates a history object that stores locations in memory.
   */


  function createMemoryHistory(props) {
    if (props === void 0) {
      props = {};
    }

    var _props = props,
        getUserConfirmation = _props.getUserConfirmation,
        _props$initialEntries = _props.initialEntries,
        initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
        _props$initialIndex = _props.initialIndex,
        initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
        _props$keyLength = _props.keyLength,
        keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
    var transitionManager = createTransitionManager();

    function setState(nextState) {
      _extends$y(history, nextState);

      history.length = history.entries.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    function createKey() {
      return Math.random().toString(36).substr(2, keyLength);
    }

    var index = clamp(initialIndex, 0, initialEntries.length - 1);
    var entries = initialEntries.map(function (entry) {
      return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
    }); // Public interface

    var createHref = createPath;

    function push(path, state) {
      warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') ;
      var action = 'PUSH';
      var location = createLocation(path, state, createKey(), history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        var prevIndex = history.index;
        var nextIndex = prevIndex + 1;
        var nextEntries = history.entries.slice(0);

        if (nextEntries.length > nextIndex) {
          nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
        } else {
          nextEntries.push(location);
        }

        setState({
          action: action,
          location: location,
          index: nextIndex,
          entries: nextEntries
        });
      });
    }

    function replace(path, state) {
      warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') ;
      var action = 'REPLACE';
      var location = createLocation(path, state, createKey(), history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        history.entries[history.index] = location;
        setState({
          action: action,
          location: location
        });
      });
    }

    function go(n) {
      var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
      var action = 'POP';
      var location = history.entries[nextIndex];
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location,
            index: nextIndex
          });
        } else {
          // Mimic the behavior of DOM histories by
          // causing a render after a cancelled POP.
          setState();
        }
      });
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    function canGo(n) {
      var nextIndex = history.index + n;
      return nextIndex >= 0 && nextIndex < history.entries.length;
    }

    function block(prompt) {
      if (prompt === void 0) {
        prompt = false;
      }

      return transitionManager.setPrompt(prompt);
    }

    function listen(listener) {
      return transitionManager.appendListener(listener);
    }

    var history = {
      length: entries.length,
      action: 'POP',
      location: entries[index],
      index: index,
      entries: entries,
      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      goBack: goBack,
      goForward: goForward,
      canGo: canGo,
      block: block,
      listen: listen
    };
    return history;
  }

  var MAX_SIGNED_31_BIT_INT = 1073741823;
  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

  function getUniqueId() {
    var key = '__global_unique_id__';
    return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
  }

  function objectIs(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }

  function createEventEmitter(value) {
    var handlers = [];
    return {
      on: function on(handler) {
        handlers.push(handler);
      },
      off: function off(handler) {
        handlers = handlers.filter(function (h) {
          return h !== handler;
        });
      },
      get: function get() {
        return value;
      },
      set: function set(newValue, changedBits) {
        value = newValue;
        handlers.forEach(function (handler) {
          return handler(value, changedBits);
        });
      }
    };
  }

  function onlyChild(children) {
    return Array.isArray(children) ? children[0] : children;
  }

  function createReactContext(defaultValue, calculateChangedBits) {
    var _Provider$childContex, _Consumer$contextType;

    var contextProp = '__create-react-context-' + getUniqueId() + '__';

    var Provider = /*#__PURE__*/function (_Component) {
      _inheritsLoose(Provider, _Component);

      function Provider() {
        var _this;

        _this = _Component.apply(this, arguments) || this;
        _this.emitter = createEventEmitter(_this.props.value);
        return _this;
      }

      var _proto = Provider.prototype;

      _proto.getChildContext = function getChildContext() {
        var _ref;

        return _ref = {}, _ref[contextProp] = this.emitter, _ref;
      };

      _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
          var oldValue = this.props.value;
          var newValue = nextProps.value;
          var changedBits;

          if (objectIs(oldValue, newValue)) {
            changedBits = 0;
          } else {
            changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

            {
              warning((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, 'calculateChangedBits: Expected the return value to be a ' + '31-bit integer. Instead received: ' + changedBits);
            }

            changedBits |= 0;

            if (changedBits !== 0) {
              this.emitter.set(nextProps.value, changedBits);
            }
          }
        }
      };

      _proto.render = function render() {
        return this.props.children;
      };

      return Provider;
    }(React.Component);

    Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = PropTypes.object.isRequired, _Provider$childContex);

    var Consumer = /*#__PURE__*/function (_Component2) {
      _inheritsLoose(Consumer, _Component2);

      function Consumer() {
        var _this2;

        _this2 = _Component2.apply(this, arguments) || this;
        _this2.state = {
          value: _this2.getValue()
        };

        _this2.onUpdate = function (newValue, changedBits) {
          var observedBits = _this2.observedBits | 0;

          if ((observedBits & changedBits) !== 0) {
            _this2.setState({
              value: _this2.getValue()
            });
          }
        };

        return _this2;
      }

      var _proto2 = Consumer.prototype;

      _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var observedBits = nextProps.observedBits;
        this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
      };

      _proto2.componentDidMount = function componentDidMount() {
        if (this.context[contextProp]) {
          this.context[contextProp].on(this.onUpdate);
        }

        var observedBits = this.props.observedBits;
        this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
      };

      _proto2.componentWillUnmount = function componentWillUnmount() {
        if (this.context[contextProp]) {
          this.context[contextProp].off(this.onUpdate);
        }
      };

      _proto2.getValue = function getValue() {
        if (this.context[contextProp]) {
          return this.context[contextProp].get();
        } else {
          return defaultValue;
        }
      };

      _proto2.render = function render() {
        return onlyChild(this.props.children)(this.state.value);
      };

      return Consumer;
    }(React.Component);

    Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = PropTypes.object, _Consumer$contextType);
    return {
      Provider: Provider,
      Consumer: Consumer
    };
  }

  var index = React__default["default"].createContext || createReactContext;

  var pathToRegexp$2 = {exports: {}};

  var isarray$1 = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

  var isarray = isarray$1;

  /**
   * Expose `pathToRegexp`.
   */
  pathToRegexp$2.exports = pathToRegexp;
  pathToRegexp$2.exports.parse = parse$1;
  pathToRegexp$2.exports.compile = compile;
  pathToRegexp$2.exports.tokensToFunction = tokensToFunction;
  pathToRegexp$2.exports.tokensToRegExp = tokensToRegExp;

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g');

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
  function parse$1 (str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = options && options.delimiter || '/';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        continue
      }

      var next = str[index];
      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var modifier = res[6];
      var asterisk = res[7];

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
      }

      var partial = prefix != null && next != null && next !== prefix;
      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var delimiter = res[2] || defaultDelimiter;
      var pattern = capture || group;

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        partial: partial,
        asterisk: !!asterisk,
        pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
      });
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index);
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path);
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
  function compile (str, options) {
    return tokensToFunction(parse$1(str, options), options)
  }

  /**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeURIComponentPretty (str) {
    return encodeURI(str).replace(/[\/?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeAsterisk (str) {
    return encodeURI(str).replace(/[?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens, options) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length);

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
      }
    }

    return function (obj, opts) {
      var path = '';
      var data = obj || {};
      var options = opts || {};
      var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;

          continue
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) {
              path += token.prefix;
            }

            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue
        }

        segment = token.asterisk ? encodeAsterisk(value) : encode(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment;
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys;
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
  function flags (options) {
    return options && options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          partial: false,
          asterisk: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function stringToRegexp (path, keys, options) {
    return tokensToRegExp(parse$1(path, options), keys, options)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */
  function tokensToRegExp (tokens, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    var strict = options.strict;
    var end = options.end !== false;
    var route = '';

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = '(?:' + token.pattern + ')';

        keys.push(token);

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (!token.partial) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = prefix + '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    }

    var delimiter = escapeString(options.delimiter || '/');
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys)
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
  function pathToRegexp (path, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    if (path instanceof RegExp) {
      return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    if (isarray(path)) {
      return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
    }

    return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
  }

  var pathToRegexp$1 = pathToRegexp$2.exports;

  function _objectWithoutPropertiesLoose$z(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  var reactIs = reactIs$1.exports;
  var FORWARD_REF_STATICS = {
    '$$typeof': true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    '$$typeof': true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

  // TODO: Replace with React.createContext once we can assume React 16+

  var createNamedContext = function createNamedContext(name) {
    var context = index();
    context.displayName = name;
    return context;
  };

  var historyContext = /*#__PURE__*/createNamedContext("Router-History");

  var context = /*#__PURE__*/createNamedContext("Router");

  /**
   * The public API for putting history on context.
   */

  var Router = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(Router, _React$Component);

    Router.computeRootMatch = function computeRootMatch(pathname) {
      return {
        path: "/",
        url: "/",
        params: {},
        isExact: pathname === "/"
      };
    };

    function Router(props) {
      var _this;

      _this = _React$Component.call(this, props) || this;
      _this.state = {
        location: props.history.location
      }; // This is a bit of a hack. We have to start listening for location
      // changes here in the constructor in case there are any <Redirect>s
      // on the initial render. If there are, they will replace/push when
      // they mount and since cDM fires in children before parents, we may
      // get a new location before the <Router> is mounted.

      _this._isMounted = false;
      _this._pendingLocation = null;

      if (!props.staticContext) {
        _this.unlisten = props.history.listen(function (location) {
          _this._pendingLocation = location;
        });
      }

      return _this;
    }

    var _proto = Router.prototype;

    _proto.componentDidMount = function componentDidMount() {
      var _this2 = this;

      this._isMounted = true;

      if (this.unlisten) {
        // Any pre-mount location changes have been captured at
        // this point, so unregister the listener.
        this.unlisten();
      }

      if (!this.props.staticContext) {
        this.unlisten = this.props.history.listen(function (location) {
          if (_this2._isMounted) {
            _this2.setState({
              location: location
            });
          }
        });
      }

      if (this._pendingLocation) {
        this.setState({
          location: this._pendingLocation
        });
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      if (this.unlisten) {
        this.unlisten();
        this._isMounted = false;
        this._pendingLocation = null;
      }
    };

    _proto.render = function render() {
      return /*#__PURE__*/React__default["default"].createElement(context.Provider, {
        value: {
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }
      }, /*#__PURE__*/React__default["default"].createElement(historyContext.Provider, {
        children: this.props.children || null,
        value: this.props.history
      }));
    };

    return Router;
  }(React__default["default"].Component);

  {
    Router.propTypes = {
      children: PropTypes.node,
      history: PropTypes.object.isRequired,
      staticContext: PropTypes.object
    };

    Router.prototype.componentDidUpdate = function (prevProps) {
      warning(prevProps.history === this.props.history, "You cannot change <Router history>") ;
    };
  }

  /**
   * The public API for a <Router> that stores location in memory.
   */

  var MemoryRouter = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(MemoryRouter, _React$Component);

    function MemoryRouter() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
      _this.history = createMemoryHistory(_this.props);
      return _this;
    }

    var _proto = MemoryRouter.prototype;

    _proto.render = function render() {
      return /*#__PURE__*/React__default["default"].createElement(Router, {
        history: this.history,
        children: this.props.children
      });
    };

    return MemoryRouter;
  }(React__default["default"].Component);

  {
    MemoryRouter.propTypes = {
      initialEntries: PropTypes.array,
      initialIndex: PropTypes.number,
      getUserConfirmation: PropTypes.func,
      keyLength: PropTypes.number,
      children: PropTypes.node
    };

    MemoryRouter.prototype.componentDidMount = function () {
      warning(!this.props.history, "<MemoryRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { MemoryRouter as Router }`.") ;
    };
  }

  var Lifecycle = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(Lifecycle, _React$Component);

    function Lifecycle() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Lifecycle.prototype;

    _proto.componentDidMount = function componentDidMount() {
      if (this.props.onMount) this.props.onMount.call(this, this);
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      if (this.props.onUnmount) this.props.onUnmount.call(this, this);
    };

    _proto.render = function render() {
      return null;
    };

    return Lifecycle;
  }(React__default["default"].Component);

  {
    var messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);
    ({
      when: PropTypes.bool,
      message: messageType.isRequired
    });
  }

  var cache = {};
  var cacheLimit = 10000;
  var cacheCount = 0;

  function compilePath(path) {
    if (cache[path]) return cache[path];
    var generator = pathToRegexp$1.compile(path);

    if (cacheCount < cacheLimit) {
      cache[path] = generator;
      cacheCount++;
    }

    return generator;
  }
  /**
   * Public API for generating a URL pathname from a path and parameters.
   */


  function generatePath(path, params) {
    if (path === void 0) {
      path = "/";
    }

    if (params === void 0) {
      params = {};
    }

    return path === "/" ? path : compilePath(path)(params, {
      pretty: true
    });
  }

  /**
   * The public API for navigating programmatically with a component.
   */

  function Redirect(_ref) {
    var computedMatch = _ref.computedMatch,
        to = _ref.to,
        _ref$push = _ref.push,
        push = _ref$push === void 0 ? false : _ref$push;
    return /*#__PURE__*/React__default["default"].createElement(context.Consumer, null, function (context) {
      !context ? invariant(false, "You should not use <Redirect> outside a <Router>")  : void 0;
      var history = context.history,
          staticContext = context.staticContext;
      var method = push ? history.push : history.replace;
      var location = createLocation(computedMatch ? typeof to === "string" ? generatePath(to, computedMatch.params) : _extends$y({}, to, {
        pathname: generatePath(to.pathname, computedMatch.params)
      }) : to); // When rendering in a static context,
      // set the new location immediately.

      if (staticContext) {
        method(location);
        return null;
      }

      return /*#__PURE__*/React__default["default"].createElement(Lifecycle, {
        onMount: function onMount() {
          method(location);
        },
        onUpdate: function onUpdate(self, prevProps) {
          var prevLocation = createLocation(prevProps.to);

          if (!locationsAreEqual(prevLocation, _extends$y({}, location, {
            key: prevLocation.key
          }))) {
            method(location);
          }
        },
        to: to
      });
    });
  }

  {
    Redirect.propTypes = {
      push: PropTypes.bool,
      from: PropTypes.string,
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    };
  }

  var cache$1 = {};
  var cacheLimit$1 = 10000;
  var cacheCount$1 = 0;

  function compilePath$1(path, options) {
    var cacheKey = "" + options.end + options.strict + options.sensitive;
    var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
    if (pathCache[path]) return pathCache[path];
    var keys = [];
    var regexp = pathToRegexp$1(path, keys, options);
    var result = {
      regexp: regexp,
      keys: keys
    };

    if (cacheCount$1 < cacheLimit$1) {
      pathCache[path] = result;
      cacheCount$1++;
    }

    return result;
  }
  /**
   * Public API for matching a URL pathname to a path.
   */


  function matchPath(pathname, options) {
    if (options === void 0) {
      options = {};
    }

    if (typeof options === "string" || Array.isArray(options)) {
      options = {
        path: options
      };
    }

    var _options = options,
        path = _options.path,
        _options$exact = _options.exact,
        exact = _options$exact === void 0 ? false : _options$exact,
        _options$strict = _options.strict,
        strict = _options$strict === void 0 ? false : _options$strict,
        _options$sensitive = _options.sensitive,
        sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
    var paths = [].concat(path);
    return paths.reduce(function (matched, path) {
      if (!path && path !== "") return null;
      if (matched) return matched;

      var _compilePath = compilePath$1(path, {
        end: exact,
        strict: strict,
        sensitive: sensitive
      }),
          regexp = _compilePath.regexp,
          keys = _compilePath.keys;

      var match = regexp.exec(pathname);
      if (!match) return null;
      var url = match[0],
          values = match.slice(1);
      var isExact = pathname === url;
      if (exact && !isExact) return null;
      return {
        path: path,
        // the path used to match
        url: path === "/" && url === "" ? "/" : url,
        // the matched portion of the URL
        isExact: isExact,
        // whether or not we matched exactly
        params: keys.reduce(function (memo, key, index) {
          memo[key.name] = values[index];
          return memo;
        }, {})
      };
    }, null);
  }

  function isEmptyChildren(children) {
    return React__default["default"].Children.count(children) === 0;
  }

  function evalChildrenDev(children, props, path) {
    var value = children(props);
    warning(value !== undefined, "You returned `undefined` from the `children` function of " + ("<Route" + (path ? " path=\"" + path + "\"" : "") + ">, but you ") + "should have returned a React element or `null`") ;
    return value || null;
  }
  /**
   * The public API for matching a single path and rendering.
   */


  var Route = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(Route, _React$Component);

    function Route() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Route.prototype;

    _proto.render = function render() {
      var _this = this;

      return /*#__PURE__*/React__default["default"].createElement(context.Consumer, null, function (context$1) {
        !context$1 ? invariant(false, "You should not use <Route> outside a <Router>")  : void 0;
        var location = _this.props.location || context$1.location;
        var match = _this.props.computedMatch ? _this.props.computedMatch // <Switch> already computed the match for us
        : _this.props.path ? matchPath(location.pathname, _this.props) : context$1.match;

        var props = _extends$y({}, context$1, {
          location: location,
          match: match
        });

        var _this$props = _this.props,
            children = _this$props.children,
            component = _this$props.component,
            render = _this$props.render; // Preact uses an empty array as children by
        // default, so use null if that's the case.

        if (Array.isArray(children) && isEmptyChildren(children)) {
          children = null;
        }

        return /*#__PURE__*/React__default["default"].createElement(context.Provider, {
          value: props
        }, props.match ? children ? typeof children === "function" ? evalChildrenDev(children, props, _this.props.path)  : children : component ? /*#__PURE__*/React__default["default"].createElement(component, props) : render ? render(props) : null : typeof children === "function" ? evalChildrenDev(children, props, _this.props.path)  : null);
      });
    };

    return Route;
  }(React__default["default"].Component);

  {
    Route.propTypes = {
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      component: function component(props, propName) {
        if (props[propName] && !reactIs$1.exports.isValidElementType(props[propName])) {
          return new Error("Invalid prop 'component' supplied to 'Route': the prop is not a valid React component");
        }
      },
      exact: PropTypes.bool,
      location: PropTypes.object,
      path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      render: PropTypes.func,
      sensitive: PropTypes.bool,
      strict: PropTypes.bool
    };

    Route.prototype.componentDidMount = function () {
      warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.component), "You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored") ;
      warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.render), "You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored") ;
      warning(!(this.props.component && this.props.render), "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored") ;
    };

    Route.prototype.componentDidUpdate = function (prevProps) {
      warning(!(this.props.location && !prevProps.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') ;
      warning(!(!this.props.location && prevProps.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') ;
    };
  }

  function addLeadingSlash(path) {
    return path.charAt(0) === "/" ? path : "/" + path;
  }

  function addBasename(basename, location) {
    if (!basename) return location;
    return _extends$y({}, location, {
      pathname: addLeadingSlash(basename) + location.pathname
    });
  }

  function stripBasename(basename, location) {
    if (!basename) return location;
    var base = addLeadingSlash(basename);
    if (location.pathname.indexOf(base) !== 0) return location;
    return _extends$y({}, location, {
      pathname: location.pathname.substr(base.length)
    });
  }

  function createURL(location) {
    return typeof location === "string" ? location : createPath(location);
  }

  function staticHandler(methodName) {
    return function () {
       invariant(false, "You cannot %s with <StaticRouter>")  ;
    };
  }

  function noop$3() {}
  /**
   * The public top-level API for a "static" <Router>, so-called because it
   * can't actually change the current location. Instead, it just records
   * location changes in a context object. Useful mainly in testing and
   * server-rendering scenarios.
   */


  var StaticRouter = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(StaticRouter, _React$Component);

    function StaticRouter() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

      _this.handlePush = function (location) {
        return _this.navigateTo(location, "PUSH");
      };

      _this.handleReplace = function (location) {
        return _this.navigateTo(location, "REPLACE");
      };

      _this.handleListen = function () {
        return noop$3;
      };

      _this.handleBlock = function () {
        return noop$3;
      };

      return _this;
    }

    var _proto = StaticRouter.prototype;

    _proto.navigateTo = function navigateTo(location, action) {
      var _this$props = this.props,
          _this$props$basename = _this$props.basename,
          basename = _this$props$basename === void 0 ? "" : _this$props$basename,
          _this$props$context = _this$props.context,
          context = _this$props$context === void 0 ? {} : _this$props$context;
      context.action = action;
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    };

    _proto.render = function render() {
      var _this$props2 = this.props,
          _this$props2$basename = _this$props2.basename,
          basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
          _this$props2$context = _this$props2.context,
          context = _this$props2$context === void 0 ? {} : _this$props2$context,
          _this$props2$location = _this$props2.location,
          location = _this$props2$location === void 0 ? "/" : _this$props2$location,
          rest = _objectWithoutPropertiesLoose$z(_this$props2, ["basename", "context", "location"]);

      var history = {
        createHref: function createHref(path) {
          return addLeadingSlash(basename + createURL(path));
        },
        action: "POP",
        location: stripBasename(basename, createLocation(location)),
        push: this.handlePush,
        replace: this.handleReplace,
        go: staticHandler(),
        goBack: staticHandler(),
        goForward: staticHandler(),
        listen: this.handleListen,
        block: this.handleBlock
      };
      return /*#__PURE__*/React__default["default"].createElement(Router, _extends$y({}, rest, {
        history: history,
        staticContext: context
      }));
    };

    return StaticRouter;
  }(React__default["default"].Component);

  {
    StaticRouter.propTypes = {
      basename: PropTypes.string,
      context: PropTypes.object,
      location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    };

    StaticRouter.prototype.componentDidMount = function () {
      warning(!this.props.history, "<StaticRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { StaticRouter as Router }`.") ;
    };
  }

  /**
   * The public API for rendering the first <Route> that matches.
   */

  var Switch = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(Switch, _React$Component);

    function Switch() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Switch.prototype;

    _proto.render = function render() {
      var _this = this;

      return /*#__PURE__*/React__default["default"].createElement(context.Consumer, null, function (context) {
        !context ? invariant(false, "You should not use <Switch> outside a <Router>")  : void 0;
        var location = _this.props.location || context.location;
        var element, match; // We use React.Children.forEach instead of React.Children.toArray().find()
        // here because toArray adds keys to all child elements and we do not want
        // to trigger an unmount/remount for two <Route>s that render the same
        // component at different URLs.

        React__default["default"].Children.forEach(_this.props.children, function (child) {
          if (match == null && /*#__PURE__*/React__default["default"].isValidElement(child)) {
            element = child;
            var path = child.props.path || child.props.from;
            match = path ? matchPath(location.pathname, _extends$y({}, child.props, {
              path: path
            })) : context.match;
          }
        });
        return match ? /*#__PURE__*/React__default["default"].cloneElement(element, {
          location: location,
          computedMatch: match
        }) : null;
      });
    };

    return Switch;
  }(React__default["default"].Component);

  {
    Switch.propTypes = {
      children: PropTypes.node,
      location: PropTypes.object
    };

    Switch.prototype.componentDidUpdate = function (prevProps) {
      warning(!(this.props.location && !prevProps.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') ;
      warning(!(!this.props.location && prevProps.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') ;
    };
  }

  var useContext = React__default["default"].useContext;
  function useHistory() {
    {
      !(typeof useContext === "function") ? invariant(false, "You must use React >= 16.8 in order to use useHistory()")  : void 0;
    }

    return useContext(historyContext);
  }

  {
    if (typeof window !== "undefined") {
      var global$1 = window;
      var key = "__react_router_build__";
      var buildNames = {
        cjs: "CommonJS",
        esm: "ES modules",
        umd: "UMD"
      };

      if (global$1[key] && global$1[key] !== "esm") {
        var initialBuildName = buildNames[global$1[key]];
        var secondaryBuildName = buildNames["esm"]; // TODO: Add link to article that explains in detail how to avoid
        // loading 2 different builds.

        throw new Error("You are loading the " + secondaryBuildName + " build of React Router " + ("on a page that is already running the " + initialBuildName + " ") + "build, so things won't work right.");
      }

      global$1[key] = "esm";
    }
  }

  var prefix = "cs";

  var classnames = {exports: {}};

  /*!
    Copyright (c) 2018 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  */

  (function (module) {
  /* global define */

  (function () {

  	var hasOwn = {}.hasOwnProperty;

  	function classNames() {
  		var classes = [];

  		for (var i = 0; i < arguments.length; i++) {
  			var arg = arguments[i];
  			if (!arg) continue;

  			var argType = typeof arg;

  			if (argType === 'string' || argType === 'number') {
  				classes.push(arg);
  			} else if (Array.isArray(arg)) {
  				if (arg.length) {
  					var inner = classNames.apply(null, arg);
  					if (inner) {
  						classes.push(inner);
  					}
  				}
  			} else if (argType === 'object') {
  				if (arg.toString === Object.prototype.toString) {
  					for (var key in arg) {
  						if (hasOwn.call(arg, key) && arg[key]) {
  							classes.push(key);
  						}
  					}
  				} else {
  					classes.push(arg.toString());
  				}
  			}
  		}

  		return classes.join(' ');
  	}

  	if (module.exports) {
  		classNames.default = classNames;
  		module.exports = classNames;
  	} else {
  		window.classNames = classNames;
  	}
  }());
  }(classnames));

  var classNames = classnames.exports;

  var StatusEnum = ["available", "unavailable", "away", "dnd", "invisible", "eager"];
  var SizeEnum = ["xs", "sm", "md", "lg", "fluid"];

  var _excluded$y = ["status", "size", "className", "name", "selected", "children"];

  function _extends$x() { _extends$x = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$x.apply(this, arguments); }

  function _defineProperty$g(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties$y(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$y(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$y(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var Status = function Status(_ref) {
    var status = _ref.status,
        size = _ref.size,
        className = _ref.className,
        name = _ref.name,
        selected = _ref.selected,
        children = _ref.children,
        rest = _objectWithoutProperties$y(_ref, _excluded$y);

    var cName = "".concat(prefix, "-status");
    var bullet = /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__bullet")
    });
    var named = name || children;
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$x({}, rest, {
      "aria-selected": selected === true ? "" : null,
      className: classNames(cName, "".concat(cName, "--").concat(size), "".concat(cName, "--").concat(status), _defineProperty$g({}, "".concat(cName, "--selected"), selected), _defineProperty$g({}, "".concat(cName, "--named"), named), className)
    }), bullet, named && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__name")
    }, name ? name : children));
  };
  Status.propTypes = {
    /** Primary content */
    children: PropTypes.node,

    /** Status. */
    status: PropTypes.oneOf(StatusEnum).isRequired,

    /** Size. */
    size: PropTypes.oneOf(SizeEnum),

    /** Name */
    name: PropTypes.node,

    /** Selected */
    selected: PropTypes.bool,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  Status.defaultProps = {
    size: "md"
  };

  var _excluded$x = ["name", "src", "size", "status", "className", "active", "children"];

  function _extends$w() { _extends$w = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$w.apply(this, arguments); }

  function _defineProperty$f(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties$x(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$x(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$x(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function AvatarInner(_ref, ref) {
    var name = _ref.name,
        src = _ref.src,
        size = _ref.size,
        status = _ref.status,
        className = _ref.className,
        active = _ref.active,
        children = _ref.children,
        rest = _objectWithoutProperties$x(_ref, _excluded$x);

    var cName = "".concat(prefix, "-avatar");
    var sizeClass = typeof size !== "undefined" ? " ".concat(cName, "--").concat(size) : "";
    var avatarRef = React.useRef();
    React.useImperativeHandle(ref, function () {
      return {
        focus: function focus() {
          return avatarRef.current.focus();
        }
      };
    });
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$w({
      ref: avatarRef
    }, rest, {
      className: classNames("".concat(cName).concat(sizeClass), _defineProperty$f({}, "".concat(cName, "--active"), active), className)
    }), children ? children : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("img", {
      src: src,
      alt: name
    }), typeof status === "string" && /*#__PURE__*/React__default["default"].createElement(Status, {
      status: status,
      size: size
    }), " "));
  }

  var Avatar = /*#__PURE__*/React.forwardRef(AvatarInner);
  Avatar.displayName = "Avatar";
  Avatar.propTypes = {
    /** Primary content */
    children: PropTypes.node,

    /**
     * User name/nickname/full name for displaying initials and image alt description
     */
    name: PropTypes.string,

    /** Avatar image source */
    src: PropTypes.string,

    /** Size */
    size: PropTypes.oneOf(SizeEnum),

    /** Status. */
    status: PropTypes.oneOf(StatusEnum),

    /** Active */
    active: PropTypes.bool,

    /** Additional classes. */
    className: PropTypes.string
  };
  AvatarInner.propTypes = Avatar.propTypes ;
  AvatarInner.defaultProps = {
    name: "",
    src: "",
    size: "md",
    active: false
  };
  Avatar.defaultProps = AvatarInner.defaultProps;

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$e(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty$e(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof$6(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$6 = function _typeof(obj) { return typeof obj; }; } else { _typeof$6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$6(obj); }
  var noop$2 = function noop() {};
  /**
   * Tests if children are nil in React and Preact.
   * @param {Object} children The children prop of a component.
   * @returns {Boolean}
   */

  var isChildrenNil = function isChildrenNil(children) {
    return children === null || children === undefined || Array.isArray(children) && children.length === 0;
  };
  /**
   * Gets only specified types children
   * @param children
   * @param Array types
   * @returns {[]}
   */

  var getChildren = function getChildren(children, types) {
    var ret = [];
    var strTypes = types.map(function (t) {
      return t.displayName || t.name;
    });
    React__default["default"].Children.toArray(children).forEach(function (item) {
      var idx = types.indexOf(item.type);

      if (idx !== -1) {
        ret[idx] = item;
      } else {
        var _item$props$as, _item$props, _item$props2;

        var is = (_item$props$as = item === null || item === void 0 ? void 0 : (_item$props = item.props) === null || _item$props === void 0 ? void 0 : _item$props.as) !== null && _item$props$as !== void 0 ? _item$props$as : item === null || item === void 0 ? void 0 : (_item$props2 = item.props) === null || _item$props2 === void 0 ? void 0 : _item$props2.is;

        var typeofIs = _typeof$6(is);

        if (typeofIs === "function") {
          // Type
          var fIdx = types.indexOf(is);

          if (fIdx !== -1) {
            ret[fIdx] = /*#__PURE__*/React__default["default"].cloneElement(item, _objectSpread$1(_objectSpread$1({}, item.props), {}, {
              as: null
            })); // Cloning to remove "as" attribute, which is not desirable
          }
        } else if (typeofIs === "object") {
          // forward ref
          var typeName = is.name || is.displayName;
          var tIdx = strTypes.indexOf(typeName);

          if (tIdx !== -1) {
            ret[tIdx] = /*#__PURE__*/React__default["default"].cloneElement(item, _objectSpread$1(_objectSpread$1({}, item.props), {}, {
              as: null
            })); // Cloning to remove "as" attribute, which is not desirable
          }
        } else if (typeofIs === "string") {
          var sIdx = strTypes.indexOf(is);

          if (sIdx !== -1) {
            ret[sIdx] = item;
          }
        }
      }
    });
    return ret;
  };
  var getComponentName = function getComponentName(component) {
    if (typeof component === "string") {
      return component;
    }

    if ("type" in component) {
      var componentType = _typeof$6(component.type);

      if (componentType === "function" || componentType === "object") {
        if ("displayName" in component.type) {
          return component.type.displayName;
        }

        if ("name" in component.type) {
          return component.type.name;
        }
      } else if (componentType === "string") {
        return component.type;
      }

      return "undefined";
    }

    return "undefined";
  };
  /**
   * PropTypes validator.
   * Checks if all children is allowed by its types.
   * Empty string nodes are always allowed for convenience.
   * Returns function for propTypes
   * @param {Array} allowedTypes
   * @return {Function}
   */

  var allowedChildren = function allowedChildren(allowedTypes) {
    return function (props, propName, componentName) {
      var allowedTypesAsStrings = allowedTypes.map(function (t) {
        return t.name || t.displayName;
      }); // Function as Child is not supported by React.Children... functions
      // and can be antipattern: https://americanexpress.io/faccs-are-an-antipattern/
      // But we don't check fd function is passed as children and its intentional
      // Passing function as children has no effect in chat-ui-kit

      var forbidden = React__default["default"].Children.toArray(props[propName]).find(function (item) {
        if (typeof item === "string" && item.trim().length === 0) {
          // Ignore string
          return false;
        }

        if (allowedTypes.indexOf(item.type) === -1) {
          var _item$props3, _item$props4;

          var is = (item === null || item === void 0 ? void 0 : (_item$props3 = item.props) === null || _item$props3 === void 0 ? void 0 : _item$props3.as) || (item === null || item === void 0 ? void 0 : (_item$props4 = item.props) === null || _item$props4 === void 0 ? void 0 : _item$props4.is);

          var typeofIs = _typeof$6(is);

          if (typeofIs === "function") {
            // Type
            return allowedTypes.indexOf(is) === -1;
          } else if (typeofIs === "object") {
            // Forward ref
            var typeName = is.name || is.displayName;
            return allowedTypesAsStrings.indexOf(typeName) === -1;
          } else if (typeofIs === "string") {
            return allowedTypesAsStrings.indexOf(is) === -1;
          } else {
            return true;
          }
        }

        return undefined;
      });

      if (typeof forbidden !== "undefined") {
        var typeName = getComponentName(forbidden);
        var allowedNames = allowedTypes.map(function (t) {
          return t.name || t.displayName;
        }).join(", ");
        var errMessage = "\"".concat(typeName, "\" is not a valid child for ").concat(componentName, ". Allowed types: ").concat(allowedNames);
        return new Error(errMessage);
      }
    };
  };

  var _excluded$w = ["children", "size", "className", "max", "activeIndex", "hoverToFront"];

  function _extends$v() { _extends$v = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$v.apply(this, arguments); }

  function _objectWithoutProperties$w(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$w(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$w(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var AvatarGroup = function AvatarGroup(_ref) {
    var children = _ref.children,
        size = _ref.size,
        className = _ref.className,
        max = _ref.max,
        activeIndex = _ref.activeIndex,
        hoverToFront = _ref.hoverToFront,
        rest = _objectWithoutProperties$w(_ref, _excluded$w);

    var cName = "".concat(prefix, "-avatar-group"); // Reverse because of css

    var avatars = typeof max === "number" && React__default["default"].Children.count(children) > max ? React__default["default"].Children.toArray(children).reverse().slice(0, max) : React__default["default"].Children.toArray(children).reverse();
    var reversedActiveIndex = typeof activeIndex === "number" ? avatars.length - activeIndex - 1 : undefined;
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$v({}, rest, {
      className: classNames(cName, "".concat(cName, "--").concat(size), className)
    }), avatars.map(function (a, i) {
      var newProps = typeof reversedActiveIndex === "number" ? {
        active: reversedActiveIndex === i
      } : {};

      if (hoverToFront === true) {
        newProps.className = classNames("".concat(prefix, "-avatar--active-on-hover"), a.props.className);
      }

      return /*#__PURE__*/React__default["default"].cloneElement(a, newProps);
    }));
  };
  AvatarGroup.displayName = "AvatarGroup";
  AvatarGroup.propTypes = {
    /**
     * Primary content.
     * Allowed node:
     *
     * * &lt;Avatar /&gt;
     */
    children: allowedChildren([Avatar]),

    /** Additional classes. */
    className: PropTypes.string,

    /** Maximum stacked children */
    max: PropTypes.number,

    /** Size */
    size: PropTypes.oneOf(["xs", "sm", "md", "lg", "fluid"]),

    /** Active index.
     * Active element has higher z-index independent of its order.
     */
    activeIndex: PropTypes.number,

    /** Bring to front on hover */
    hoverToFront: PropTypes.bool
  } ;
  AvatarGroup.defaultProps = {
    size: "md"
  };

  var _excluded$v = ["children", "className", "icon", "border", "labelPosition"];

  function _extends$u() { _extends$u = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$u.apply(this, arguments); }

  function _objectWithoutProperties$v(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$v(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$v(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var Button = function Button(_ref) {
    var children = _ref.children,
        className = _ref.className,
        icon = _ref.icon,
        border = _ref.border,
        labelPosition = _ref.labelPosition,
        rest = _objectWithoutProperties$v(_ref, _excluded$v);

    var cName = "".concat(prefix, "-button");
    var lPos = typeof labelPosition !== "undefined" ? labelPosition : "right";
    var labelPositionClassName = React__default["default"].Children.count(children) > 0 ? "".concat(cName, "--").concat(lPos) : "";
    var borderClassName = border === true ? "".concat(cName, "--border") : "";
    return /*#__PURE__*/React__default["default"].createElement("button", _extends$u({}, rest, {
      className: classNames(cName, labelPositionClassName, borderClassName, className)
    }), lPos === "left" && children, icon, lPos === "right" && children);
  };
  Button.propTypes = {
    /** Primary content */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,
    icon: PropTypes.node,
    labelPosition: PropTypes.oneOf(["left", "right"]),
    border: PropTypes.bool
  } ;
  Button.defaultProps = {
    children: undefined,
    className: "",
    icon: undefined,
    labelPosition: undefined,
    border: false
  };

  /*!
   * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   */

  function _classCallCheck$4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$4(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$4(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$4(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$4(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty$d(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty$d(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray$8(arr, i) {
    return _arrayWithHoles$8(arr) || _iterableToArrayLimit$8(arr, i) || _nonIterableRest$8();
  }

  function _arrayWithHoles$8(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit$8(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest$8() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var noop = function noop() {};

  var _WINDOW = {};
  var _DOCUMENT = {};
  var _MUTATION_OBSERVER = null;
  var _PERFORMANCE = {
    mark: noop,
    measure: noop
  };

  try {
    if (typeof window !== 'undefined') _WINDOW = window;
    if (typeof document !== 'undefined') _DOCUMENT = document;
    if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
    if (typeof performance !== 'undefined') _PERFORMANCE = performance;
  } catch (e) {}

  var _ref = _WINDOW.navigator || {},
      _ref$userAgent = _ref.userAgent,
      userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

  var WINDOW = _WINDOW;
  var DOCUMENT = _DOCUMENT;
  var PERFORMANCE = _PERFORMANCE;
  !!WINDOW.document;
  var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
  ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

  var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
  var DEFAULT_FAMILY_PREFIX = 'fa';
  var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
  var DATA_FA_I2SVG = 'data-fa-i2svg';
  (function () {
    try {
      return "development" === 'production';
    } catch (e) {
      return false;
    }
  })();
  var DUOTONE_CLASSES = {
    GROUP: 'group',
    SWAP_OPACITY: 'swap-opacity',
    PRIMARY: 'primary',
    SECONDARY: 'secondary'
  };

  var initial = WINDOW.FontAwesomeConfig || {};

  function getAttrConfig(attr) {
    var element = DOCUMENT.querySelector('script[' + attr + ']');

    if (element) {
      return element.getAttribute(attr);
    }
  }

  function coerce(val) {
    // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
    // We'll assume that this is an indication that it should be toggled to true
    // For example <script data-search-pseudo-elements src="..."></script>
    if (val === '') return true;
    if (val === 'false') return false;
    if (val === 'true') return true;
    return val;
  }

  if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
    var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
    attrs.forEach(function (_ref) {
      var _ref2 = _slicedToArray$8(_ref, 2),
          attr = _ref2[0],
          key = _ref2[1];

      var val = coerce(getAttrConfig(attr));

      if (val !== undefined && val !== null) {
        initial[key] = val;
      }
    });
  }

  var _default = {
    familyPrefix: DEFAULT_FAMILY_PREFIX,
    replacementClass: DEFAULT_REPLACEMENT_CLASS,
    autoReplaceSvg: true,
    autoAddCss: true,
    autoA11y: true,
    searchPseudoElements: false,
    observeMutations: true,
    mutateApproach: 'async',
    keepOriginalSource: true,
    measurePerformance: false,
    showMissingIcons: true
  };

  var _config = _objectSpread({}, _default, initial);

  if (!_config.autoReplaceSvg) _config.observeMutations = false;

  var config = _objectSpread({}, _config);

  WINDOW.FontAwesomeConfig = config;

  var w = WINDOW || {};
  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
  var namespace = w[NAMESPACE_IDENTIFIER];

  var functions = [];

  var listener = function listener() {
    DOCUMENT.removeEventListener('DOMContentLoaded', listener);
    loaded = 1;
    functions.map(function (fn) {
      return fn();
    });
  };

  var loaded = false;

  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
    if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
  }

  typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
  typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
  var meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false
  };
  function insertCss(css) {
    if (!css || !IS_DOM) {
      return;
    }

    var style = DOCUMENT.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    var headChildren = DOCUMENT.head.childNodes;
    var beforeChild = null;

    for (var i = headChildren.length - 1; i > -1; i--) {
      var child = headChildren[i];
      var tagName = (child.tagName || '').toUpperCase();

      if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
        beforeChild = child;
      }
    }

    DOCUMENT.head.insertBefore(style, beforeChild);
    return css;
  }
  var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function nextUniqueId() {
    var size = 12;
    var id = '';

    while (size-- > 0) {
      id += idPool[Math.random() * 62 | 0];
    }

    return id;
  }
  function htmlEscape(str) {
    return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function joinAttributes(attributes) {
    return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
      return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
    }, '').trim();
  }
  function joinStyles(styles) {
    return Object.keys(styles || {}).reduce(function (acc, styleName) {
      return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
    }, '');
  }
  function transformIsMeaningful(transform) {
    return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
  }
  function transformForSvg(_ref) {
    var transform = _ref.transform,
        containerWidth = _ref.containerWidth,
        iconWidth = _ref.iconWidth;
    var outer = {
      transform: "translate(".concat(containerWidth / 2, " 256)")
    };
    var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
    var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
    var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
    var inner = {
      transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
    };
    var path = {
      transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
    };
    return {
      outer: outer,
      inner: inner,
      path: path
    };
  }

  var ALL_SPACE = {
    x: 0,
    y: 0,
    width: '100%',
    height: '100%'
  };

  function fillBlack(abstract) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (abstract.attributes && (abstract.attributes.fill || force)) {
      abstract.attributes.fill = 'black';
    }

    return abstract;
  }

  function deGroup(abstract) {
    if (abstract.tag === 'g') {
      return abstract.children;
    } else {
      return [abstract];
    }
  }

  function makeIconMasking (_ref) {
    var children = _ref.children,
        attributes = _ref.attributes,
        main = _ref.main,
        mask = _ref.mask,
        explicitMaskId = _ref.maskId,
        transform = _ref.transform;
    var mainWidth = main.width,
        mainPath = main.icon;
    var maskWidth = mask.width,
        maskPath = mask.icon;
    var trans = transformForSvg({
      transform: transform,
      containerWidth: maskWidth,
      iconWidth: mainWidth
    });
    var maskRect = {
      tag: 'rect',
      attributes: _objectSpread({}, ALL_SPACE, {
        fill: 'white'
      })
    };
    var maskInnerGroupChildrenMixin = mainPath.children ? {
      children: mainPath.children.map(fillBlack)
    } : {};
    var maskInnerGroup = {
      tag: 'g',
      attributes: _objectSpread({}, trans.inner),
      children: [fillBlack(_objectSpread({
        tag: mainPath.tag,
        attributes: _objectSpread({}, mainPath.attributes, trans.path)
      }, maskInnerGroupChildrenMixin))]
    };
    var maskOuterGroup = {
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [maskInnerGroup]
    };
    var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
    var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
    var maskTag = {
      tag: 'mask',
      attributes: _objectSpread({}, ALL_SPACE, {
        id: maskId,
        maskUnits: 'userSpaceOnUse',
        maskContentUnits: 'userSpaceOnUse'
      }),
      children: [maskRect, maskOuterGroup]
    };
    var defs = {
      tag: 'defs',
      children: [{
        tag: 'clipPath',
        attributes: {
          id: clipId
        },
        children: deGroup(maskPath)
      }, maskTag]
    };
    children.push(defs, {
      tag: 'rect',
      attributes: _objectSpread({
        fill: 'currentColor',
        'clip-path': "url(#".concat(clipId, ")"),
        mask: "url(#".concat(maskId, ")")
      }, ALL_SPACE)
    });
    return {
      children: children,
      attributes: attributes
    };
  }

  function makeIconStandard (_ref) {
    var children = _ref.children,
        attributes = _ref.attributes,
        main = _ref.main,
        transform = _ref.transform,
        styles = _ref.styles;
    var styleString = joinStyles(styles);

    if (styleString.length > 0) {
      attributes['style'] = styleString;
    }

    if (transformIsMeaningful(transform)) {
      var trans = transformForSvg({
        transform: transform,
        containerWidth: main.width,
        iconWidth: main.width
      });
      children.push({
        tag: 'g',
        attributes: _objectSpread({}, trans.outer),
        children: [{
          tag: 'g',
          attributes: _objectSpread({}, trans.inner),
          children: [{
            tag: main.icon.tag,
            children: main.icon.children,
            attributes: _objectSpread({}, main.icon.attributes, trans.path)
          }]
        }]
      });
    } else {
      children.push(main.icon);
    }

    return {
      children: children,
      attributes: attributes
    };
  }

  function asIcon (_ref) {
    var children = _ref.children,
        main = _ref.main,
        mask = _ref.mask,
        attributes = _ref.attributes,
        styles = _ref.styles,
        transform = _ref.transform;

    if (transformIsMeaningful(transform) && main.found && !mask.found) {
      var width = main.width,
          height = main.height;
      var offset = {
        x: width / height / 2,
        y: 0.5
      };
      attributes['style'] = joinStyles(_objectSpread({}, styles, {
        'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
      }));
    }

    return [{
      tag: 'svg',
      attributes: attributes,
      children: children
    }];
  }

  function asSymbol (_ref) {
    var prefix = _ref.prefix,
        iconName = _ref.iconName,
        children = _ref.children,
        attributes = _ref.attributes,
        symbol = _ref.symbol;
    var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
    return [{
      tag: 'svg',
      attributes: {
        style: 'display: none;'
      },
      children: [{
        tag: 'symbol',
        attributes: _objectSpread({}, attributes, {
          id: id
        }),
        children: children
      }]
    }];
  }

  function makeInlineSvgAbstract(params) {
    var _params$icons = params.icons,
        main = _params$icons.main,
        mask = _params$icons.mask,
        prefix = params.prefix,
        iconName = params.iconName,
        transform = params.transform,
        symbol = params.symbol,
        title = params.title,
        maskId = params.maskId,
        titleId = params.titleId,
        extra = params.extra,
        _params$watchable = params.watchable,
        watchable = _params$watchable === void 0 ? false : _params$watchable;

    var _ref = mask.found ? mask : main,
        width = _ref.width,
        height = _ref.height;

    var isUploadedIcon = prefix === 'fak';
    var widthClass = isUploadedIcon ? '' : "fa-w-".concat(Math.ceil(width / height * 16));
    var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
      return extra.classes.indexOf(c) === -1;
    }).filter(function (c) {
      return c !== '' || !!c;
    }).concat(extra.classes).join(' ');
    var content = {
      children: [],
      attributes: _objectSpread({}, extra.attributes, {
        'data-prefix': prefix,
        'data-icon': iconName,
        'class': attrClass,
        'role': extra.attributes.role || 'img',
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': "0 0 ".concat(width, " ").concat(height)
      })
    };
    var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
      width: "".concat(width / height * 16 * 0.0625, "em")
    } : {};

    if (watchable) {
      content.attributes[DATA_FA_I2SVG] = '';
    }

    if (title) content.children.push({
      tag: 'title',
      attributes: {
        id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
      },
      children: [title]
    });

    var args = _objectSpread({}, content, {
      prefix: prefix,
      iconName: iconName,
      main: main,
      mask: mask,
      maskId: maskId,
      transform: transform,
      symbol: symbol,
      styles: _objectSpread({}, uploadedIconWidthStyle, extra.styles)
    });

    var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
        children = _ref2.children,
        attributes = _ref2.attributes;

    args.children = children;
    args.attributes = attributes;

    if (symbol) {
      return asSymbol(args);
    } else {
      return asIcon(args);
    }
  }

  var noop$1 = function noop() {};

  config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
    mark: noop$1,
    measure: noop$1
  };

  /**
   * Internal helper to bind a function known to have 4 arguments
   * to a given context.
   */

  var bindInternal4 = function bindInternal4(func, thisContext) {
    return function (a, b, c, d) {
      return func.call(thisContext, a, b, c, d);
    };
  };

  /**
   * # Reduce
   *
   * A fast object `.reduce()` implementation.
   *
   * @param  {Object}   subject      The object to reduce over.
   * @param  {Function} fn           The reducer function.
   * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
   * @param  {Object}   thisContext  The context for the reducer.
   * @return {mixed}                 The final result.
   */


  var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
    var keys = Object.keys(subject),
        length = keys.length,
        iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
        i,
        key,
        result;

    if (initialValue === undefined) {
      i = 1;
      result = subject[keys[0]];
    } else {
      i = 0;
      result = initialValue;
    }

    for (; i < length; i++) {
      key = keys[i];
      result = iterator(result, subject[key], key, subject);
    }

    return result;
  };

  function defineIcons(prefix, icons) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _params$skipHooks = params.skipHooks,
        skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
    var normalized = Object.keys(icons).reduce(function (acc, iconName) {
      var icon = icons[iconName];
      var expanded = !!icon.icon;

      if (expanded) {
        acc[icon.iconName] = icon.icon;
      } else {
        acc[iconName] = icon;
      }

      return acc;
    }, {});

    if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
      namespace.hooks.addPack(prefix, normalized);
    } else {
      namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
    }
    /**
     * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
     * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
     * for `fas` so we'll easy the upgrade process for our users by automatically defining
     * this as well.
     */


    if (prefix === 'fas') {
      defineIcons('fa', icons);
    }
  }

  var styles = namespace.styles,
      shims = namespace.shims;
  var build = function build() {
    var lookup = function lookup(reducer) {
      return reduce(styles, function (o, style, prefix) {
        o[prefix] = reduce(style, reducer, {});
        return o;
      }, {});
    };

    lookup(function (acc, icon, iconName) {
      if (icon[3]) {
        acc[icon[3]] = iconName;
      }

      return acc;
    });
    lookup(function (acc, icon, iconName) {
      var ligatures = icon[2];
      acc[iconName] = iconName;
      ligatures.forEach(function (ligature) {
        acc[ligature] = iconName;
      });
      return acc;
    });
    var hasRegular = 'far' in styles;
    reduce(shims, function (acc, shim) {
      var oldName = shim[0];
      var prefix = shim[1];
      var iconName = shim[2];

      if (prefix === 'far' && !hasRegular) {
        prefix = 'fas';
      }

      acc[oldName] = {
        prefix: prefix,
        iconName: iconName
      };
      return acc;
    }, {});
  };
  build();

  namespace.styles;
  function iconFromMapping(mapping, prefix, iconName) {
    if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
      return {
        prefix: prefix,
        iconName: iconName,
        icon: mapping[prefix][iconName]
      };
    }
  }

  function toHtml(abstractNodes) {
    var tag = abstractNodes.tag,
        _abstractNodes$attrib = abstractNodes.attributes,
        attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
        _abstractNodes$childr = abstractNodes.children,
        children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

    if (typeof abstractNodes === 'string') {
      return htmlEscape(abstractNodes);
    } else {
      return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
    }
  }

  var parseTransformString = function parseTransformString(transformString) {
    var transform = {
      size: 16,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      rotate: 0
    };

    if (!transformString) {
      return transform;
    } else {
      return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
        var parts = n.toLowerCase().split('-');
        var first = parts[0];
        var rest = parts.slice(1).join('-');

        if (first && rest === 'h') {
          acc.flipX = true;
          return acc;
        }

        if (first && rest === 'v') {
          acc.flipY = true;
          return acc;
        }

        rest = parseFloat(rest);

        if (isNaN(rest)) {
          return acc;
        }

        switch (first) {
          case 'grow':
            acc.size = acc.size + rest;
            break;

          case 'shrink':
            acc.size = acc.size - rest;
            break;

          case 'left':
            acc.x = acc.x - rest;
            break;

          case 'right':
            acc.x = acc.x + rest;
            break;

          case 'up':
            acc.y = acc.y - rest;
            break;

          case 'down':
            acc.y = acc.y + rest;
            break;

          case 'rotate':
            acc.rotate = acc.rotate + rest;
            break;
        }

        return acc;
      }, transform);
    }
  };

  function MissingIcon(error) {
    this.name = 'MissingIcon';
    this.message = error || 'Icon unavailable';
    this.stack = new Error().stack;
  }
  MissingIcon.prototype = Object.create(Error.prototype);
  MissingIcon.prototype.constructor = MissingIcon;

  var FILL = {
    fill: 'currentColor'
  };
  var ANIMATION_BASE = {
    attributeType: 'XML',
    repeatCount: 'indefinite',
    dur: '2s'
  };
  ({
    tag: 'path',
    attributes: _objectSpread({}, FILL, {
      d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
    })
  });

  var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
    attributeName: 'opacity'
  });

  ({
    tag: 'circle',
    attributes: _objectSpread({}, FILL, {
      cx: '256',
      cy: '364',
      r: '28'
    }),
    children: [{
      tag: 'animate',
      attributes: _objectSpread({}, ANIMATION_BASE, {
        attributeName: 'r',
        values: '28;14;28;28;14;28;'
      })
    }, {
      tag: 'animate',
      attributes: _objectSpread({}, OPACITY_ANIMATE, {
        values: '1;0;1;1;0;1;'
      })
    }]
  });
  ({
    tag: 'path',
    attributes: _objectSpread({}, FILL, {
      opacity: '1',
      d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
    }),
    children: [{
      tag: 'animate',
      attributes: _objectSpread({}, OPACITY_ANIMATE, {
        values: '1;0;0;0;0;1;'
      })
    }]
  });
  ({
    tag: 'path',
    attributes: _objectSpread({}, FILL, {
      opacity: '0',
      d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
    }),
    children: [{
      tag: 'animate',
      attributes: _objectSpread({}, OPACITY_ANIMATE, {
        values: '0;0;1;1;0;0;'
      })
    }]
  });

  namespace.styles;
  function asFoundIcon(icon) {
    var width = icon[0];
    var height = icon[1];

    var _icon$slice = icon.slice(4),
        _icon$slice2 = _slicedToArray$8(_icon$slice, 1),
        vectorData = _icon$slice2[0];

    var element = null;

    if (Array.isArray(vectorData)) {
      element = {
        tag: 'g',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
        },
        children: [{
          tag: 'path',
          attributes: {
            class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
            fill: 'currentColor',
            d: vectorData[0]
          }
        }, {
          tag: 'path',
          attributes: {
            class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
            fill: 'currentColor',
            d: vectorData[1]
          }
        }]
      };
    } else {
      element = {
        tag: 'path',
        attributes: {
          fill: 'currentColor',
          d: vectorData
        }
      };
    }

    return {
      found: true,
      width: width,
      height: height,
      icon: element
    };
  }

  namespace.styles;

  var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

  function css () {
    var dfp = DEFAULT_FAMILY_PREFIX;
    var drc = DEFAULT_REPLACEMENT_CLASS;
    var fp = config.familyPrefix;
    var rc = config.replacementClass;
    var s = baseStyles;

    if (fp !== dfp || rc !== drc) {
      var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
      var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
      var rPatt = new RegExp("\\.".concat(drc), 'g');
      s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
    }

    return s;
  }

  var Library =
  /*#__PURE__*/
  function () {
    function Library() {
      _classCallCheck$4(this, Library);

      this.definitions = {};
    }

    _createClass$4(Library, [{
      key: "add",
      value: function add() {
        var _this = this;

        for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
          definitions[_key] = arguments[_key];
        }

        var additions = definitions.reduce(this._pullDefinitions, {});
        Object.keys(additions).forEach(function (key) {
          _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
          defineIcons(key, additions[key]);
          build();
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        this.definitions = {};
      }
    }, {
      key: "_pullDefinitions",
      value: function _pullDefinitions(additions, definition) {
        var normalized = definition.prefix && definition.iconName && definition.icon ? {
          0: definition
        } : definition;
        Object.keys(normalized).map(function (key) {
          var _normalized$key = normalized[key],
              prefix = _normalized$key.prefix,
              iconName = _normalized$key.iconName,
              icon = _normalized$key.icon;
          if (!additions[prefix]) additions[prefix] = {};
          additions[prefix][iconName] = icon;
        });
        return additions;
      }
    }]);

    return Library;
  }();

  function ensureCss() {
    if (config.autoAddCss && !_cssInserted) {
      insertCss(css());

      _cssInserted = true;
    }
  }

  function apiObject(val, abstractCreator) {
    Object.defineProperty(val, 'abstract', {
      get: abstractCreator
    });
    Object.defineProperty(val, 'html', {
      get: function get() {
        return val.abstract.map(function (a) {
          return toHtml(a);
        });
      }
    });
    Object.defineProperty(val, 'node', {
      get: function get() {
        if (!IS_DOM) return;
        var container = DOCUMENT.createElement('div');
        container.innerHTML = val.html;
        return container.children;
      }
    });
    return val;
  }

  function findIconDefinition(iconLookup) {
    var _iconLookup$prefix = iconLookup.prefix,
        prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
        iconName = iconLookup.iconName;
    if (!iconName) return;
    return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
  }

  function resolveIcons(next) {
    return function (maybeIconDefinition) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
      var mask = params.mask;

      if (mask) {
        mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
      }

      return next(iconDefinition, _objectSpread({}, params, {
        mask: mask
      }));
    };
  }

  var library = new Library();
  var _cssInserted = false;
  var parse = {
    transform: function transform(transformString) {
      return parseTransformString(transformString);
    }
  };
  var icon = resolveIcons(function (iconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _params$transform = params.transform,
        transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
        _params$symbol = params.symbol,
        symbol = _params$symbol === void 0 ? false : _params$symbol,
        _params$mask = params.mask,
        mask = _params$mask === void 0 ? null : _params$mask,
        _params$maskId = params.maskId,
        maskId = _params$maskId === void 0 ? null : _params$maskId,
        _params$title = params.title,
        title = _params$title === void 0 ? null : _params$title,
        _params$titleId = params.titleId,
        titleId = _params$titleId === void 0 ? null : _params$titleId,
        _params$classes = params.classes,
        classes = _params$classes === void 0 ? [] : _params$classes,
        _params$attributes = params.attributes,
        attributes = _params$attributes === void 0 ? {} : _params$attributes,
        _params$styles = params.styles,
        styles = _params$styles === void 0 ? {} : _params$styles;
    if (!iconDefinition) return;
    var prefix = iconDefinition.prefix,
        iconName = iconDefinition.iconName,
        icon = iconDefinition.icon;
    return apiObject(_objectSpread({
      type: 'icon'
    }, iconDefinition), function () {
      ensureCss();

      if (config.autoA11y) {
        if (title) {
          attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
        } else {
          attributes['aria-hidden'] = 'true';
          attributes['focusable'] = 'false';
        }
      }

      return makeInlineSvgAbstract({
        icons: {
          main: asFoundIcon(icon),
          mask: mask ? asFoundIcon(mask.icon) : {
            found: false,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix: prefix,
        iconName: iconName,
        transform: _objectSpread({}, meaninglessTransform, transform),
        symbol: symbol,
        title: title,
        maskId: maskId,
        titleId: titleId,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: classes
        }
      });
    });
  });

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty$c(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof$5(obj) {
    "@babel/helpers - typeof";

    return _typeof$5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof$5(obj);
  }

  function _defineProperty$c(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectWithoutPropertiesLoose$u(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties$u(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose$u(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$8(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$8(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray$8(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$8(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$8(o, minLen);
  }

  function _arrayLikeToArray$8(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // Get CSS class list from a props object
  function classList(props) {
    var _classes;

    var beat = props.beat,
        fade = props.fade,
        beatFade = props.beatFade,
        bounce = props.bounce,
        shake = props.shake,
        flash = props.flash,
        spin = props.spin,
        spinPulse = props.spinPulse,
        spinReverse = props.spinReverse,
        pulse = props.pulse,
        fixedWidth = props.fixedWidth,
        inverse = props.inverse,
        border = props.border,
        listItem = props.listItem,
        flip = props.flip,
        size = props.size,
        rotation = props.rotation,
        pull = props.pull; // map of CSS class names to properties

    var classes = (_classes = {
      'fa-beat': beat,
      'fa-fade': fade,
      'fa-beat-fade': beatFade,
      'fa-bounce': bounce,
      'fa-shake': shake,
      'fa-flash': flash,
      'fa-spin': spin,
      'fa-spin-reverse': spinReverse,
      'fa-spin-pulse': spinPulse,
      'fa-pulse': pulse,
      'fa-fw': fixedWidth,
      'fa-inverse': inverse,
      'fa-border': border,
      'fa-li': listItem,
      'fa-flip-horizontal': flip === 'horizontal' || flip === 'both',
      'fa-flip-vertical': flip === 'vertical' || flip === 'both'
    }, _defineProperty$c(_classes, "fa-".concat(size), typeof size !== 'undefined' && size !== null), _defineProperty$c(_classes, "fa-rotate-".concat(rotation), typeof rotation !== 'undefined' && rotation !== null && rotation !== 0), _defineProperty$c(_classes, "fa-pull-".concat(pull), typeof pull !== 'undefined' && pull !== null), _defineProperty$c(_classes, 'fa-swap-opacity', props.swapOpacity), _classes); // map over all the keys in the classes object
    // return an array of the keys where the value for the key is not null

    return Object.keys(classes).map(function (key) {
      return classes[key] ? key : null;
    }).filter(function (key) {
      return key;
    });
  }

  // Camelize taken from humps
  // humps is copyright © 2012+ Dom Christie
  // Released under the MIT license.
  // Performant way to determine if object coerces to a number
  function _isNumerical(obj) {
    obj = obj - 0; // eslint-disable-next-line no-self-compare

    return obj === obj;
  }

  function camelize(string) {
    if (_isNumerical(string)) {
      return string;
    } // eslint-disable-next-line no-useless-escape


    string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    }); // Ensure 1st char is always lowercase

    return string.substr(0, 1).toLowerCase() + string.substr(1);
  }

  var _excluded$1$1 = ["style"];

  function capitalize(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }

  function styleToObject(style) {
    return style.split(';').map(function (s) {
      return s.trim();
    }).filter(function (s) {
      return s;
    }).reduce(function (acc, pair) {
      var i = pair.indexOf(':');
      var prop = camelize(pair.slice(0, i));
      var value = pair.slice(i + 1).trim();
      prop.startsWith('webkit') ? acc[capitalize(prop)] = value : acc[prop] = value;
      return acc;
    }, {});
  }

  function convert(createElement, element) {
    var extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (typeof element === 'string') {
      return element;
    }

    var children = (element.children || []).map(function (child) {
      return convert(createElement, child);
    });
    /* eslint-disable dot-notation */

    var mixins = Object.keys(element.attributes || {}).reduce(function (acc, key) {
      var val = element.attributes[key];

      switch (key) {
        case 'class':
          acc.attrs['className'] = val;
          delete element.attributes['class'];
          break;

        case 'style':
          acc.attrs['style'] = styleToObject(val);
          break;

        default:
          if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
            acc.attrs[key.toLowerCase()] = val;
          } else {
            acc.attrs[camelize(key)] = val;
          }

      }

      return acc;
    }, {
      attrs: {}
    });

    var _extraProps$style = extraProps.style,
        existingStyle = _extraProps$style === void 0 ? {} : _extraProps$style,
        remaining = _objectWithoutProperties$u(extraProps, _excluded$1$1);

    mixins.attrs['style'] = _objectSpread2(_objectSpread2({}, mixins.attrs['style']), existingStyle);
    /* eslint-enable */

    return createElement.apply(void 0, [element.tag, _objectSpread2(_objectSpread2({}, mixins.attrs), remaining)].concat(_toConsumableArray(children)));
  }

  var PRODUCTION = false;

  try {
    PRODUCTION = "development" === 'production';
  } catch (e) {}

  function log () {
    if (!PRODUCTION && console && typeof console.error === 'function') {
      var _console;

      (_console = console).error.apply(_console, arguments);
    }
  }

  function normalizeIconArgs(icon) {
    // this has everything that it needs to be rendered which means it was probably imported
    // directly from an icon svg package
    if (icon && _typeof$5(icon) === 'object' && icon.prefix && icon.iconName && icon.icon) {
      return icon;
    }


    if (icon === null) {
      return null;
    } // if the icon is an object and has a prefix and an icon name, return it


    if (icon && _typeof$5(icon) === 'object' && icon.prefix && icon.iconName) {
      return icon;
    } // if it's an array with length of two


    if (Array.isArray(icon) && icon.length === 2) {
      // use the first item as prefix, second as icon name
      return {
        prefix: icon[0],
        iconName: icon[1]
      };
    } // if it's a string, use it as the icon name


    if (typeof icon === 'string') {
      return {
        prefix: 'fas',
        iconName: icon
      };
    }
  }

  // creates an object with a key of key
  // and a value of value
  // if certain conditions are met
  function objectWithKey(key, value) {
    // if the value is a non-empty array
    // or it's not an array but it is truthy
    // then create the object with the key and the value
    // if not, return an empty array
    return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? _defineProperty$c({}, key, value) : {};
  }

  var _excluded$u = ["forwardedRef"];
  function FontAwesomeIcon(_ref) {
    var forwardedRef = _ref.forwardedRef,
        props = _objectWithoutProperties$u(_ref, _excluded$u);

    var iconArgs = props.icon,
        maskArgs = props.mask,
        symbol = props.symbol,
        className = props.className,
        title = props.title,
        titleId = props.titleId,
        maskId = props.maskId;
    var iconLookup = normalizeIconArgs(iconArgs);
    var classes = objectWithKey('classes', [].concat(_toConsumableArray(classList(props)), _toConsumableArray(className.split(' '))));
    var transform = objectWithKey('transform', typeof props.transform === 'string' ? parse.transform(props.transform) : props.transform);
    var mask = objectWithKey('mask', normalizeIconArgs(maskArgs));
    var renderedIcon = icon(iconLookup, _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, classes), transform), mask), {}, {
      symbol: symbol,
      title: title,
      titleId: titleId,
      maskId: maskId
    }));

    if (!renderedIcon) {
      log('Could not find icon', iconLookup);
      return null;
    }

    var abstract = renderedIcon.abstract;
    var extraProps = {
      ref: forwardedRef
    };
    Object.keys(props).forEach(function (key) {
      // eslint-disable-next-line no-prototype-builtins
      if (!FontAwesomeIcon.defaultProps.hasOwnProperty(key)) {
        extraProps[key] = props[key];
      }
    });
    return convertCurry(abstract[0], extraProps);
  }
  FontAwesomeIcon.displayName = 'FontAwesomeIcon';
  FontAwesomeIcon.propTypes = {
    beat: PropTypes.bool,
    border: PropTypes.bool,
    bounce: PropTypes.bool,
    className: PropTypes.string,
    fade: PropTypes.bool,
    flash: PropTypes.bool,
    mask: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    maskId: PropTypes.string,
    fixedWidth: PropTypes.bool,
    inverse: PropTypes.bool,
    flip: PropTypes.oneOf(['horizontal', 'vertical', 'both']),
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    listItem: PropTypes.bool,
    pull: PropTypes.oneOf(['right', 'left']),
    pulse: PropTypes.bool,
    rotation: PropTypes.oneOf([0, 90, 180, 270]),
    shake: PropTypes.bool,
    size: PropTypes.oneOf(['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x']),
    spin: PropTypes.bool,
    spinPulse: PropTypes.bool,
    spinReverse: PropTypes.bool,
    symbol: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    title: PropTypes.string,
    titleId: PropTypes.string,
    transform: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    swapOpacity: PropTypes.bool
  };
  FontAwesomeIcon.defaultProps = {
    border: false,
    className: '',
    mask: null,
    maskId: null,
    fixedWidth: false,
    inverse: false,
    flip: null,
    icon: null,
    listItem: false,
    pull: null,
    pulse: false,
    rotation: null,
    size: null,
    spin: false,
    beat: false,
    fade: false,
    beatFade: false,
    bounce: false,
    shake: false,
    symbol: false,
    title: '',
    titleId: null,
    transform: null,
    swapOpacity: false
  };
  var convertCurry = convert.bind(null, React__default["default"].createElement);

  var faArrowUp = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'arrow-up';
  var width = 448;
  var height = 512;
  var ligatures = [];
  var unicode = 'f062';
  var svgPathData = 'M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faArrowUp = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faArrowUp));

  var faArrowRight = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'arrow-right';
  var width = 448;
  var height = 512;
  var ligatures = [];
  var unicode = 'f061';
  var svgPathData = 'M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faArrowRight = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faArrowRight));

  var faArrowDown = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'arrow-down';
  var width = 448;
  var height = 512;
  var ligatures = [];
  var unicode = 'f063';
  var svgPathData = 'M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faArrowDown = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faArrowDown));

  var faArrowLeft = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'arrow-left';
  var width = 448;
  var height = 512;
  var ligatures = [];
  var unicode = 'f060';
  var svgPathData = 'M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faArrowLeft = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faArrowLeft));

  var _excluded$t = ["className", "direction", "children"];

  function _extends$t() { _extends$t = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$t.apply(this, arguments); }

  function _objectWithoutProperties$t(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$t(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$t(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ArrowButton = function ArrowButton(_ref) {
    var className = _ref.className,
        direction = _ref.direction,
        children = _ref.children,
        rest = _objectWithoutProperties$t(_ref, _excluded$t);

    var cName = "".concat(prefix, "-button--arrow");

    var icon = function () {
      if (direction === "up") {
        return faArrowUp.faArrowUp;
      } else if (direction === "right") {
        return faArrowRight.faArrowRight;
      } else if (direction === "down") {
        return faArrowDown.faArrowDown;
      } else if (direction === "left") {
        return faArrowLeft.faArrowLeft;
      }
    }();

    return /*#__PURE__*/React__default["default"].createElement(Button, _extends$t({}, rest, {
      className: classNames(cName, className),
      icon: /*#__PURE__*/React__default["default"].createElement(FontAwesomeIcon, {
        icon: icon
      })
    }), children);
  };
  ArrowButton.propTypes = {
    /**
     * Primary content.
     */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,
    direction: PropTypes.oneOf(["up", "right", "down", "left"])
  } ;
  ArrowButton.defaultProps = {
    className: "",
    direction: "right"
  };

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  ({
    /**
     * Primary content.
     */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  var faEllipsisV = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'ellipsis-v';
  var width = 192;
  var height = 512;
  var ligatures = [];
  var unicode = 'f142';
  var svgPathData = 'M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faEllipsisV = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faEllipsisV));

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,
    orientation: PropTypes.oneOf(["horizontal", "vertical"])
  }) ;

  var faPaperPlane = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'paper-plane';
  var width = 512;
  var height = 512;
  var ligatures = [];
  var unicode = 'f1d8';
  var svgPathData = 'M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faPaperPlane = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faPaperPlane));

  var _excluded$s = ["className", "children"];

  function _extends$s() { _extends$s = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$s.apply(this, arguments); }

  function _objectWithoutProperties$s(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$s(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$s(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var SendButton = function SendButton(_ref) {
    var className = _ref.className,
        children = _ref.children,
        rest = _objectWithoutProperties$s(_ref, _excluded$s);

    var cName = "".concat(prefix, "-button--send");
    return /*#__PURE__*/React__default["default"].createElement(Button, _extends$s({}, rest, {
      className: classNames(cName, className),
      icon: /*#__PURE__*/React__default["default"].createElement(FontAwesomeIcon, {
        icon: faPaperPlane.faPaperPlane
      })
    }), children);
  };
  SendButton.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  SendButton.defaultProps = {
    className: ""
  };

  var faPaperclip = {};

  (function (exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
  var prefix = 'fas';
  var iconName = 'paperclip';
  var width = 448;
  var height = 512;
  var ligatures = [];
  var unicode = 'f0c6';
  var svgPathData = 'M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0 43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292 4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313 34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 60.216-214.77-.485z';

  exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      ligatures,
      unicode,
      svgPathData
    ]};

  exports.faPaperclip = exports.definition;
  exports.prefix = prefix;
  exports.iconName = iconName;
  exports.width = width;
  exports.height = height;
  exports.ligatures = ligatures;
  exports.unicode = unicode;
  exports.svgPathData = svgPathData;
  }(faPaperclip));

  var _excluded$r = ["className", "children"];

  function _extends$r() { _extends$r = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$r.apply(this, arguments); }

  function _objectWithoutProperties$r(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$r(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$r(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var AttachmentButton = function AttachmentButton(_ref) {
    var className = _ref.className,
        children = _ref.children,
        rest = _objectWithoutProperties$r(_ref, _excluded$r);

    var cName = "".concat(prefix, "-button--attachment");
    return /*#__PURE__*/React__default["default"].createElement(Button, _extends$r({}, rest, {
      className: classNames(cName, className),
      icon: /*#__PURE__*/React__default["default"].createElement(FontAwesomeIcon, {
        icon: faPaperclip.faPaperclip
      })
    }), children);
  };
  AttachmentButton.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  AttachmentButton.defaultProps = {
    className: ""
  };

  var _excluded$q = ["onClick", "children", "className"];

  function _extends$q() { _extends$q = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$q.apply(this, arguments); }

  function _objectWithoutProperties$q(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$q(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$q(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ConversationHeaderBack = function ConversationHeaderBack(_ref) {
    var onClick = _ref.onClick,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$q(_ref, _excluded$q);

    var cName = "".concat(prefix, "-conversation-header__back");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$q({}, rest, {
      className: classNames(cName, className)
    }), typeof children !== "undefined" ? children : /*#__PURE__*/React__default["default"].createElement(ArrowButton, {
      direction: "left",
      onClick: onClick
    }));
  };
  ConversationHeaderBack.displayName = "ConversationHeader.Back";
  ConversationHeaderBack.propTypes = {
    /** OnClick handler attached to button. */
    onClick: PropTypes.func,

    /** Primary content - override default button. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ConversationHeaderBack.defaultProps = {
    children: undefined,
    onClick: function onClick() {}
  };

  var _excluded$p = ["children", "className"];

  function _extends$p() { _extends$p = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$p.apply(this, arguments); }

  function _objectWithoutProperties$p(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$p(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$p(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ConversationHeaderActions = function ConversationHeaderActions(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$p(_ref, _excluded$p);

    var cName = "".concat(prefix, "-conversation-header__actions");
    return /*#__PURE__*/React__default["default"].createElement("section", _extends$p({}, rest, {
      className: classNames(cName, className)
    }), children);
  };
  ConversationHeaderActions.displayName = "ConversationHeader.Actions";
  ConversationHeaderActions.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ConversationHeaderActions.defaultProps = {
    children: undefined
  };

  var _excluded$o = ["userName", "info", "children", "className"];

  function _extends$o() { _extends$o = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$o.apply(this, arguments); }

  function _objectWithoutProperties$o(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$o(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$o(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ConversationHeaderContent = function ConversationHeaderContent(_ref) {
    var userName = _ref.userName,
        info = _ref.info,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$o(_ref, _excluded$o);

    var cName = "".concat(prefix, "-conversation-header__content");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$o({}, rest, {
      className: classNames(cName, className)
    }), typeof children !== "undefined" ? children : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(prefix, "-conversation-header__user-name")
    }, userName), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(prefix, "-conversation-header__info")
    }, info)));
  };
  ConversationHeaderContent.displayName = "ConversationHeader.Content";
  ConversationHeaderContent.propTypes = {
    /** Primary content. Has precedence over userName and info properties. */
    children: PropTypes.node,
    userName: PropTypes.node,
    info: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ConversationHeaderContent.defaultProps = {
    children: undefined,
    userName: "",
    info: ""
  };

  var _excluded$n = ["children", "className"];

  function _extends$n() { _extends$n = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$n.apply(this, arguments); }

  function _slicedToArray$7(arr, i) { return _arrayWithHoles$7(arr) || _iterableToArrayLimit$7(arr, i) || _unsupportedIterableToArray$7(arr, i) || _nonIterableRest$7(); }

  function _nonIterableRest$7() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$7(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$7(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen); }

  function _arrayLikeToArray$7(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$7(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$7(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$n(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$n(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$n(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ConversationHeader = function ConversationHeader(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$n(_ref, _excluded$n);

    var cName = "".concat(prefix, "-conversation-header");

    var _getChildren = getChildren(children, [ConversationHeaderBack, Avatar, AvatarGroup, ConversationHeaderContent, ConversationHeaderActions]),
        _getChildren2 = _slicedToArray$7(_getChildren, 5),
        back = _getChildren2[0],
        avatar = _getChildren2[1],
        avatarGroup = _getChildren2[2],
        content = _getChildren2[3],
        actions = _getChildren2[4];

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$n({}, rest, {
      className: classNames(cName, className)
    }), back, avatar && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__avatar")
    }, avatar), !avatar && avatarGroup && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__avatar")
    }, avatarGroup), content, actions);
  };
  ConversationHeader.displayName = "ConversationHeader";
  ConversationHeader.propTypes = {
    /**
     * Primary content.
     * Available elements:
     *
     * * &lt;Avatar /&gt;
     * * &lt;AvatarGroup /&gt;
     * * &lt;ConversationHeader.Back /&gt;
     * * &lt;ConversationHeader.Content /&gt;
     * * &lt;ConversationHeader.Actions /&gt;
     */
    children: allowedChildren([ConversationHeaderBack, Avatar, AvatarGroup, ConversationHeaderContent, ConversationHeaderActions]),

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ConversationHeader.defaultProps = {
    children: undefined
  };
  ConversationHeader.Back = ConversationHeaderBack;
  ConversationHeader.Actions = ConversationHeaderActions;
  ConversationHeader.Content = ConversationHeaderContent;

  /*!
   * perfect-scrollbar v1.5.0
   * Copyright 2020 Hyunje Jun, MDBootstrap and Contributors
   * Licensed under MIT
   */
  function get(element) {
    return getComputedStyle(element);
  }

  function set(element, obj) {
    for (var key in obj) {
      var val = obj[key];

      if (typeof val === "number") {
        val = val + "px";
      }

      element.style[key] = val;
    }

    return element;
  }

  function div(className) {
    var div = document.createElement("div");
    div.className = className;
    return div;
  }

  var elMatches = typeof Element !== "undefined" && (Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);

  function matches(element, query) {
    if (!elMatches) {
      throw new Error("No element matching method supported");
    }

    return elMatches.call(element, query);
  }

  function remove(element) {
    if (element.remove) {
      element.remove();
    } else {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }

  function queryChildren(element, selector) {
    return Array.prototype.filter.call(element.children, function (child) {
      return matches(child, selector);
    });
  }

  var cls = {
    main: "ps",
    rtl: "ps__rtl",
    element: {
      thumb: function thumb(x) {
        return "ps__thumb-" + x;
      },
      rail: function rail(x) {
        return "ps__rail-" + x;
      },
      consuming: "ps__child--consume"
    },
    state: {
      focus: "ps--focus",
      clicking: "ps--clicking",
      active: function active(x) {
        return "ps--active-" + x;
      },
      scrolling: function scrolling(x) {
        return "ps--scrolling-" + x;
      }
    }
  };
  /*
   * Helper methods
   */

  var scrollingClassTimeout = {
    x: null,
    y: null
  };

  function addScrollingClass(i, x) {
    var classList = i.element.classList;
    var className = cls.state.scrolling(x);

    if (classList.contains(className)) {
      clearTimeout(scrollingClassTimeout[x]);
    } else {
      classList.add(className);
    }
  }

  function removeScrollingClass(i, x) {
    scrollingClassTimeout[x] = setTimeout(function () {
      return i.isAlive && i.element.classList.remove(cls.state.scrolling(x));
    }, i.settings.scrollingThreshold);
  }

  function setScrollingClassInstantly(i, x) {
    addScrollingClass(i, x);
    removeScrollingClass(i, x);
  }

  var EventElement = function EventElement(element) {
    this.element = element;
    this.handlers = {};
  };

  var prototypeAccessors = {
    isEmpty: {
      configurable: true
    }
  };

  EventElement.prototype.bind = function bind(eventName, handler) {
    if (typeof this.handlers[eventName] === "undefined") {
      this.handlers[eventName] = [];
    }

    this.handlers[eventName].push(handler);
    var evts = ["touchstart", "wheel", "touchmove"];

    if (evts.indexOf(eventName) !== -1) {
      this.element.addEventListener(eventName, handler, {
        passive: false
      });
    } else {
      this.element.addEventListener(eventName, handler, false);
    }
  };

  EventElement.prototype.unbind = function unbind(eventName, target) {
    var this$1$1 = this;
    this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
      if (target && handler !== target) {
        return true;
      }

      this$1$1.element.removeEventListener(eventName, handler, false);
      return false;
    });
  };

  EventElement.prototype.unbindAll = function unbindAll() {
    for (var name in this.handlers) {
      this.unbind(name);
    }
  };

  prototypeAccessors.isEmpty.get = function () {
    var this$1$1 = this;
    return Object.keys(this.handlers).every(function (key) {
      return this$1$1.handlers[key].length === 0;
    });
  };

  Object.defineProperties(EventElement.prototype, prototypeAccessors);

  var EventManager = function EventManager() {
    this.eventElements = [];
  };

  EventManager.prototype.eventElement = function eventElement(element) {
    var ee = this.eventElements.filter(function (ee) {
      return ee.element === element;
    })[0];

    if (!ee) {
      ee = new EventElement(element);
      this.eventElements.push(ee);
    }

    return ee;
  };

  EventManager.prototype.bind = function bind(element, eventName, handler) {
    this.eventElement(element).bind(eventName, handler);
  };

  EventManager.prototype.unbind = function unbind(element, eventName, handler) {
    var ee = this.eventElement(element);
    ee.unbind(eventName, handler);

    if (ee.isEmpty) {
      // remove
      this.eventElements.splice(this.eventElements.indexOf(ee), 1);
    }
  };

  EventManager.prototype.unbindAll = function unbindAll() {
    this.eventElements.forEach(function (e) {
      return e.unbindAll();
    });
    this.eventElements = [];
  };

  EventManager.prototype.once = function once(element, eventName, handler) {
    var ee = this.eventElement(element);

    var onceHandler = function onceHandler(evt) {
      ee.unbind(eventName, onceHandler);
      handler(evt);
    };

    ee.bind(eventName, onceHandler);
  };

  function createEvent(name) {
    if (typeof window.CustomEvent === "function") {
      return new CustomEvent(name);
    } else {
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(name, false, false, undefined);
      return evt;
    }
  }

  function processScrollDiff(i, axis, diff, useScrollingClass, forceFireReachEvent, disableOnYReachWhenNoScroll) {
    if (useScrollingClass === void 0) useScrollingClass = true;
    if (forceFireReachEvent === void 0) forceFireReachEvent = false;
    var fields;

    if (axis === "top") {
      fields = ["contentHeight", "containerHeight", "scrollTop", "y", "up", "down"];
    } else if (axis === "left") {
      fields = ["contentWidth", "containerWidth", "scrollLeft", "x", "left", "right"];
    } else {
      throw new Error("A proper axis should be provided");
    }

    processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent, disableOnYReachWhenNoScroll);
  }

  function processScrollDiff$1(i, diff, ref, useScrollingClass, forceFireReachEvent, disableOnYReachWhenNoScroll) {
    var contentHeight = ref[0];
    var containerHeight = ref[1];
    var scrollTop = ref[2];
    var y = ref[3];
    var up = ref[4];
    var down = ref[5];
    if (useScrollingClass === void 0) useScrollingClass = true;
    if (forceFireReachEvent === void 0) forceFireReachEvent = false;
    var element = i.element; // reset reach

    i.reach[y] = null;
    var eventFlag = disableOnYReachWhenNoScroll === true ? i[contentHeight] !== i[containerHeight] : true; // 1 for subpixel rounding

    if (eventFlag && element[scrollTop] < 1) {
      i.reach[y] = "start";
    } // 1 for subpixel rounding


    if (eventFlag && element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
      i.reach[y] = "end";
    }

    if (diff) {
      element.dispatchEvent(createEvent("ps-scroll-" + y));

      if (diff < 0) {
        element.dispatchEvent(createEvent("ps-scroll-" + up));
      } else if (diff > 0) {
        element.dispatchEvent(createEvent("ps-scroll-" + down));
      }

      if (useScrollingClass) {
        setScrollingClassInstantly(i, y);
      }
    }

    if (i.reach[y] && (diff || forceFireReachEvent)) {
      element.dispatchEvent(createEvent("ps-" + y + "-reach-" + i.reach[y]));
    }
  }

  function toInt(x) {
    return parseInt(x, 10) || 0;
  }

  function isEditable(el) {
    return matches(el, "input,[contenteditable]") || matches(el, "select,[contenteditable]") || matches(el, "textarea,[contenteditable]") || matches(el, "button,[contenteditable]");
  }

  function outerWidth(element) {
    var styles = get(element);
    return toInt(styles.width) + toInt(styles.paddingLeft) + toInt(styles.paddingRight) + toInt(styles.borderLeftWidth) + toInt(styles.borderRightWidth);
  }

  var env = {
    isWebKit: typeof document !== "undefined" && "WebkitAppearance" in document.documentElement.style,
    supportsTouch: typeof window !== "undefined" && ("ontouchstart" in window || "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints > 0 || window.DocumentTouch && document instanceof window.DocumentTouch),
    supportsIePointer: typeof navigator !== "undefined" && navigator.msMaxTouchPoints,
    isChrome: typeof navigator !== "undefined" && /Chrome/i.test(navigator && navigator.userAgent)
  };

  function updateGeometry(i) {
    var element = i.element;
    var roundedScrollTop = Math.floor(element.scrollTop);
    var rect = element.getBoundingClientRect();
    i.containerWidth = Math.round(rect.width);
    i.containerHeight = Math.round(rect.height);
    i.contentWidth = element.scrollWidth;
    i.contentHeight = element.scrollHeight;

    if (!element.contains(i.scrollbarXRail)) {
      // clean up and append
      queryChildren(element, cls.element.rail("x")).forEach(function (el) {
        return remove(el);
      });
      element.appendChild(i.scrollbarXRail);
    }

    if (!element.contains(i.scrollbarYRail)) {
      // clean up and append
      queryChildren(element, cls.element.rail("y")).forEach(function (el) {
        return remove(el);
      });
      element.appendChild(i.scrollbarYRail);
    }

    if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
      i.scrollbarXActive = true;
      i.railXWidth = i.containerWidth - i.railXMarginWidth;
      i.railXRatio = i.containerWidth / i.railXWidth;
      i.scrollbarXWidth = getThumbSize(i, toInt(i.railXWidth * i.containerWidth / i.contentWidth));
      i.scrollbarXLeft = toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
    } else {
      i.scrollbarXActive = false;
    }

    if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
      i.scrollbarYActive = true;
      i.railYHeight = i.containerHeight - i.railYMarginHeight;
      i.railYRatio = i.containerHeight / i.railYHeight;
      i.scrollbarYHeight = getThumbSize(i, toInt(i.railYHeight * i.containerHeight / i.contentHeight));
      i.scrollbarYTop = toInt(roundedScrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
    } else {
      i.scrollbarYActive = false;
    }

    if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
      i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
    }

    if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
      i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
    }

    updateCss(element, i);

    if (i.scrollbarXActive) {
      element.classList.add(cls.state.active("x"));
    } else {
      element.classList.remove(cls.state.active("x"));
      i.scrollbarXWidth = 0;
      i.scrollbarXLeft = 0;
      element.scrollLeft = i.isRtl === true ? i.contentWidth : 0;
    }

    if (i.scrollbarYActive) {
      element.classList.add(cls.state.active("y"));
    } else {
      element.classList.remove(cls.state.active("y"));
      i.scrollbarYHeight = 0;
      i.scrollbarYTop = 0;
      element.scrollTop = 0;
    }
  }

  function getThumbSize(i, thumbSize) {
    if (i.settings.minScrollbarLength) {
      thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
    }

    if (i.settings.maxScrollbarLength) {
      thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
    }

    return thumbSize;
  }

  function updateCss(element, i) {
    var xRailOffset = {
      width: i.railXWidth
    };
    var roundedScrollTop = Math.floor(element.scrollTop);

    if (i.isRtl) {
      xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
    } else {
      xRailOffset.left = element.scrollLeft;
    }

    if (i.isScrollbarXUsingBottom) {
      xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
    } else {
      xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
    }

    set(i.scrollbarXRail, xRailOffset);
    var yRailOffset = {
      top: roundedScrollTop,
      height: i.railYHeight
    };

    if (i.isScrollbarYUsingRight) {
      if (i.isRtl) {
        yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth - 9;
      } else {
        yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
      }
    } else {
      if (i.isRtl) {
        yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
      } else {
        yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
      }
    }

    set(i.scrollbarYRail, yRailOffset);
    set(i.scrollbarX, {
      left: i.scrollbarXLeft,
      width: i.scrollbarXWidth - i.railBorderXWidth
    });
    set(i.scrollbarY, {
      top: i.scrollbarYTop,
      height: i.scrollbarYHeight - i.railBorderYWidth
    });
  }

  function clickRail(i) {
    i.element;
    i.event.bind(i.scrollbarY, "mousedown", function (e) {
      return e.stopPropagation();
    });
    i.event.bind(i.scrollbarYRail, "mousedown", function (e) {
      var positionTop = e.pageY - window.pageYOffset - i.scrollbarYRail.getBoundingClientRect().top;
      var direction = positionTop > i.scrollbarYTop ? 1 : -1;
      i.element.scrollTop += direction * i.containerHeight;
      updateGeometry(i);
      e.stopPropagation();
    });
    i.event.bind(i.scrollbarX, "mousedown", function (e) {
      return e.stopPropagation();
    });
    i.event.bind(i.scrollbarXRail, "mousedown", function (e) {
      var positionLeft = e.pageX - window.pageXOffset - i.scrollbarXRail.getBoundingClientRect().left;
      var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;
      i.element.scrollLeft += direction * i.containerWidth;
      updateGeometry(i);
      e.stopPropagation();
    });
  }

  function dragThumb(i) {
    bindMouseScrollHandler(i, ["containerWidth", "contentWidth", "pageX", "railXWidth", "scrollbarX", "scrollbarXWidth", "scrollLeft", "x", "scrollbarXRail"]);
    bindMouseScrollHandler(i, ["containerHeight", "contentHeight", "pageY", "railYHeight", "scrollbarY", "scrollbarYHeight", "scrollTop", "y", "scrollbarYRail"]);
  }

  function bindMouseScrollHandler(i, ref) {
    var containerHeight = ref[0];
    var contentHeight = ref[1];
    var pageY = ref[2];
    var railYHeight = ref[3];
    var scrollbarY = ref[4];
    var scrollbarYHeight = ref[5];
    var scrollTop = ref[6];
    var y = ref[7];
    var scrollbarYRail = ref[8];
    var element = i.element;
    var startingScrollTop = null;
    var startingMousePageY = null;
    var scrollBy = null;

    function mouseMoveHandler(e) {
      if (e.touches && e.touches[0]) {
        e[pageY] = e.touches[0].pageY;
      }

      element[scrollTop] = startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
      addScrollingClass(i, y);
      updateGeometry(i);
      e.stopPropagation();
      e.preventDefault();
    }

    function mouseUpHandler() {
      removeScrollingClass(i, y);
      i[scrollbarYRail].classList.remove(cls.state.clicking);
      i.event.unbind(i.ownerDocument, "mousemove", mouseMoveHandler);
    }

    function bindMoves(e, touchMode) {
      startingScrollTop = element[scrollTop];

      if (touchMode && e.touches) {
        e[pageY] = e.touches[0].pageY;
      }

      startingMousePageY = e[pageY];
      scrollBy = (i[contentHeight] - i[containerHeight]) / (i[railYHeight] - i[scrollbarYHeight]);

      if (!touchMode) {
        i.event.bind(i.ownerDocument, "mousemove", mouseMoveHandler);
        i.event.once(i.ownerDocument, "mouseup", mouseUpHandler);
        e.preventDefault();
      } else {
        i.event.bind(i.ownerDocument, "touchmove", mouseMoveHandler);
      }

      i[scrollbarYRail].classList.add(cls.state.clicking);
      e.stopPropagation();
    }

    i.event.bind(i[scrollbarY], "mousedown", function (e) {
      bindMoves(e);
    });
    i.event.bind(i[scrollbarY], "touchstart", function (e) {
      bindMoves(e, true);
    });
  }

  function keyboard(i) {
    var element = i.element;

    var elementHovered = function elementHovered() {
      return matches(element, ":hover");
    };

    var scrollbarFocused = function scrollbarFocused() {
      return matches(i.scrollbarX, ":focus") || matches(i.scrollbarY, ":focus");
    };

    function shouldPreventDefault(deltaX, deltaY) {
      var scrollTop = Math.floor(element.scrollTop);

      if (deltaX === 0) {
        if (!i.scrollbarYActive) {
          return false;
        }

        if (scrollTop === 0 && deltaY > 0 || scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0) {
          return !i.settings.wheelPropagation;
        }
      }

      var scrollLeft = element.scrollLeft;

      if (deltaY === 0) {
        if (!i.scrollbarXActive) {
          return false;
        }

        if (scrollLeft === 0 && deltaX < 0 || scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0) {
          return !i.settings.wheelPropagation;
        }
      }

      return true;
    }

    i.event.bind(i.ownerDocument, "keydown", function (e) {
      if (e.isDefaultPrevented && e.isDefaultPrevented() || e.defaultPrevented) {
        return;
      }

      if (!elementHovered() && !scrollbarFocused()) {
        return;
      }

      var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;

      if (activeElement) {
        if (activeElement.tagName === "IFRAME") {
          activeElement = activeElement.contentDocument.activeElement;
        } else {
          // go deeper if element is a webcomponent
          while (activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
          }
        }

        if (isEditable(activeElement)) {
          return;
        }
      }

      var deltaX = 0;
      var deltaY = 0;

      switch (e.which) {
        case 37:
          // left
          if (e.metaKey) {
            deltaX = -i.contentWidth;
          } else if (e.altKey) {
            deltaX = -i.containerWidth;
          } else {
            deltaX = -30;
          }

          break;

        case 38:
          // up
          if (e.metaKey) {
            deltaY = i.contentHeight;
          } else if (e.altKey) {
            deltaY = i.containerHeight;
          } else {
            deltaY = 30;
          }

          break;

        case 39:
          // right
          if (e.metaKey) {
            deltaX = i.contentWidth;
          } else if (e.altKey) {
            deltaX = i.containerWidth;
          } else {
            deltaX = 30;
          }

          break;

        case 40:
          // down
          if (e.metaKey) {
            deltaY = -i.contentHeight;
          } else if (e.altKey) {
            deltaY = -i.containerHeight;
          } else {
            deltaY = -30;
          }

          break;

        case 32:
          // space bar
          if (e.shiftKey) {
            deltaY = i.containerHeight;
          } else {
            deltaY = -i.containerHeight;
          }

          break;

        case 33:
          // page up
          deltaY = i.containerHeight;
          break;

        case 34:
          // page down
          deltaY = -i.containerHeight;
          break;

        case 36:
          // home
          deltaY = i.contentHeight;
          break;

        case 35:
          // end
          deltaY = -i.contentHeight;
          break;

        default:
          return;
      }

      if (i.settings.suppressScrollX && deltaX !== 0) {
        return;
      }

      if (i.settings.suppressScrollY && deltaY !== 0) {
        return;
      }

      element.scrollTop -= deltaY;
      element.scrollLeft += deltaX;
      updateGeometry(i);

      if (shouldPreventDefault(deltaX, deltaY)) {
        e.preventDefault();
      }
    });
  }

  function wheel(i) {
    var element = i.element;

    function shouldPreventDefault(deltaX, deltaY) {
      var roundedScrollTop = Math.floor(element.scrollTop);
      var isTop = element.scrollTop === 0;
      var isBottom = roundedScrollTop + element.offsetHeight === element.scrollHeight;
      var isLeft = element.scrollLeft === 0;
      var isRight = element.scrollLeft + element.offsetWidth === element.scrollWidth;
      var hitsBound; // pick axis with primary direction

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        hitsBound = isTop || isBottom;
      } else {
        hitsBound = isLeft || isRight;
      }

      return hitsBound ? !i.settings.wheelPropagation : true;
    }

    function getDeltaFromEvent(e) {
      var deltaX = e.deltaX;
      var deltaY = -1 * e.deltaY;

      if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
        // OS X Safari
        deltaX = -1 * e.wheelDeltaX / 6;
        deltaY = e.wheelDeltaY / 6;
      }

      if (e.deltaMode && e.deltaMode === 1) {
        // Firefox in deltaMode 1: Line scrolling
        deltaX *= 10;
        deltaY *= 10;
      }

      if (deltaX !== deltaX && deltaY !== deltaY
      /* NaN checks */
      ) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.wheelDelta;
      }

      if (e.shiftKey) {
        // reverse axis with shift key
        return [-deltaY, -deltaX];
      }

      return [deltaX, deltaY];
    }

    function shouldBeConsumedByChild(target, deltaX, deltaY) {
      // FIXME: this is a workaround for <select> issue in FF and IE #571
      if (!env.isWebKit && element.querySelector("select:focus")) {
        return true;
      }

      if (!element.contains(target)) {
        return false;
      }

      var cursor = target;

      while (cursor && cursor !== element) {
        if (cursor.classList.contains(cls.element.consuming)) {
          return true;
        }

        var style = get(cursor); // if deltaY && vertical scrollable

        if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
          var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;

          if (maxScrollTop > 0) {
            if (cursor.scrollTop > 0 && deltaY < 0 || cursor.scrollTop < maxScrollTop && deltaY > 0) {
              return true;
            }
          }
        } // if deltaX && horizontal scrollable


        if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
          var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;

          if (maxScrollLeft > 0) {
            if (cursor.scrollLeft > 0 && deltaX < 0 || cursor.scrollLeft < maxScrollLeft && deltaX > 0) {
              return true;
            }
          }
        }

        cursor = cursor.parentNode;
      }

      return false;
    }

    function mousewheelHandler(e) {
      var ref = getDeltaFromEvent(e);
      var deltaX = ref[0];
      var deltaY = ref[1];

      if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
        return;
      }

      var shouldPrevent = false;

      if (!i.settings.useBothWheelAxes) {
        // deltaX will only be used for horizontal scrolling and deltaY will
        // only be used for vertical scrolling - this is the default
        element.scrollTop -= deltaY * i.settings.wheelSpeed;
        element.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else if (i.scrollbarYActive && !i.scrollbarXActive) {
        // only vertical scrollbar is active and useBothWheelAxes option is
        // active, so let's scroll vertical bar using both mouse wheel axes
        if (deltaY) {
          element.scrollTop -= deltaY * i.settings.wheelSpeed;
        } else {
          element.scrollTop += deltaX * i.settings.wheelSpeed;
        }

        shouldPrevent = true;
      } else if (i.scrollbarXActive && !i.scrollbarYActive) {
        // useBothWheelAxes and only horizontal bar is active, so use both
        // wheel axes for horizontal bar
        if (deltaX) {
          element.scrollLeft += deltaX * i.settings.wheelSpeed;
        } else {
          element.scrollLeft -= deltaY * i.settings.wheelSpeed;
        }

        shouldPrevent = true;
      }

      updateGeometry(i);
      shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);

      if (shouldPrevent && !e.ctrlKey) {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    if (typeof window.onwheel !== "undefined") {
      i.event.bind(element, "wheel", mousewheelHandler);
    } else if (typeof window.onmousewheel !== "undefined") {
      i.event.bind(element, "mousewheel", mousewheelHandler);
    }
  }

  function touch(i) {
    if (!env.supportsTouch && !env.supportsIePointer) {
      return;
    }

    var element = i.element;

    function shouldPrevent(deltaX, deltaY) {
      var scrollTop = Math.floor(element.scrollTop);
      var scrollLeft = Math.ceil(element.scrollLeft);
      var magnitudeX = Math.abs(deltaX);
      var magnitudeY = Math.abs(deltaY);

      if (!i.settings.wheelPropagation) {
        return true;
      }

      if (magnitudeY > magnitudeX) {
        // user is perhaps trying to swipe up/down the page
        if (i.settings.suppressScrollY) {
          return false;
        }

        if (deltaY > 0) {
          return scrollTop !== 0;
        }

        if (deltaY < 0) {
          return scrollTop < i.contentHeight - i.containerHeight;
        }
      } else if (magnitudeX > magnitudeY) {
        // user is perhaps trying to swipe left/right across the page
        if (i.settings.suppressScrollX) {
          return false;
        }

        if (deltaX > 0) {
          return scrollLeft !== 0;
        }

        if (deltaY < 0) {
          return scrollLeft < i.contentWidth - i.containerWidth;
        }
      }

      return true;
    }

    function applyTouchMove(differenceX, differenceY) {
      element.scrollTop -= differenceY;
      element.scrollLeft -= differenceX;
      updateGeometry(i);
    }

    var startOffset = {};
    var startTime = 0;
    var speed = {};
    var easingLoop = null;

    function getTouch(e) {
      if (e.targetTouches) {
        return e.targetTouches[0];
      } else {
        // Maybe IE pointer
        return e;
      }
    }

    function shouldHandle(e) {
      if (e.pointerType && e.pointerType === "pen" && e.buttons === 0) {
        return false;
      }

      if (e.targetTouches && e.targetTouches.length === 1) {
        return true;
      }

      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
        return true;
      }

      return false;
    }

    function touchStart(e) {
      if (!shouldHandle(e)) {
        return;
      }

      var touch = getTouch(e);
      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;
      startTime = new Date().getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }
    }

    function shouldBeConsumedByChild(target, deltaX, deltaY) {
      if (!element.contains(target)) {
        return false;
      }

      var cursor = target;

      while (cursor && cursor !== element) {
        if (cursor.classList.contains(cls.element.consuming)) {
          return true;
        }

        var style = get(cursor); // if deltaY && vertical scrollable

        if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
          var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;

          if (maxScrollTop > 0) {
            if (cursor.scrollTop > 0 && deltaY < 0 || cursor.scrollTop < maxScrollTop && deltaY > 0) {
              return true;
            }
          }
        } // if deltaX && horizontal scrollable


        if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
          var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;

          if (maxScrollLeft > 0) {
            if (cursor.scrollLeft > 0 && deltaX < 0 || cursor.scrollLeft < maxScrollLeft && deltaX > 0) {
              return true;
            }
          }
        }

        cursor = cursor.parentNode;
      }

      return false;
    }

    function touchMove(e) {
      if (shouldHandle(e)) {
        var touch = getTouch(e);
        var currentOffset = {
          pageX: touch.pageX,
          pageY: touch.pageY
        };
        var differenceX = currentOffset.pageX - startOffset.pageX;
        var differenceY = currentOffset.pageY - startOffset.pageY;

        if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
          return;
        }

        applyTouchMove(differenceX, differenceY);
        startOffset = currentOffset;
        var currentTime = new Date().getTime();
        var timeGap = currentTime - startTime;

        if (timeGap > 0) {
          speed.x = differenceX / timeGap;
          speed.y = differenceY / timeGap;
          startTime = currentTime;
        } //if (shouldPrevent(differenceX, differenceY)) {


        if (e.cancelable && shouldPrevent(differenceX, differenceY)) {
          e.preventDefault();
        }
      }
    }

    function touchEnd() {
      if (i.settings.swipeEasing) {
        clearInterval(easingLoop);
        easingLoop = setInterval(function () {
          if (i.isInitialized) {
            clearInterval(easingLoop);
            return;
          }

          if (!speed.x && !speed.y) {
            clearInterval(easingLoop);
            return;
          }

          if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
            clearInterval(easingLoop);
            return;
          }

          applyTouchMove(speed.x * 30, speed.y * 30);
          speed.x *= 0.8;
          speed.y *= 0.8;
        }, 10);
      }
    }

    if (env.supportsTouch) {
      i.event.bind(element, "touchstart", touchStart);
      i.event.bind(element, "touchmove", touchMove);
      i.event.bind(element, "touchend", touchEnd);
    } else if (env.supportsIePointer) {
      if (window.PointerEvent) {
        i.event.bind(element, "pointerdown", touchStart);
        i.event.bind(element, "pointermove", touchMove);
        i.event.bind(element, "pointerup", touchEnd);
      } else if (window.MSPointerEvent) {
        i.event.bind(element, "MSPointerDown", touchStart);
        i.event.bind(element, "MSPointerMove", touchMove);
        i.event.bind(element, "MSPointerUp", touchEnd);
      }
    }
  }

  var defaultSettings = function defaultSettings() {
    return {
      handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
      maxScrollbarLength: null,
      minScrollbarLength: null,
      scrollingThreshold: 1000,
      scrollXMarginOffset: 0,
      scrollYMarginOffset: 0,
      suppressScrollX: false,
      suppressScrollY: false,
      swipeEasing: true,
      useBothWheelAxes: false,
      wheelPropagation: true,
      wheelSpeed: 1
    };
  };

  var handlers = {
    "click-rail": clickRail,
    "drag-thumb": dragThumb,
    keyboard: keyboard,
    wheel: wheel,
    touch: touch
  };

  var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
    var this$1$1 = this;
    if (userSettings === void 0) userSettings = {};

    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    if (!element || !element.nodeName) {
      throw new Error("no element is specified to initialize PerfectScrollbar");
    }

    this.element = element;
    element.classList.add(cls.main);
    this.settings = defaultSettings();

    for (var key in userSettings) {
      this.settings[key] = userSettings[key];
    }

    this.containerWidth = null;
    this.containerHeight = null;
    this.contentWidth = null;
    this.contentHeight = null;

    var focus = function focus() {
      return element.classList.add(cls.state.focus);
    };

    var blur = function blur() {
      return element.classList.remove(cls.state.focus);
    };

    this.isRtl = get(element).direction === "rtl";

    if (this.isRtl === true) {
      element.classList.add(cls.rtl);
    }

    this.isNegativeScroll = function () {
      var originalScrollLeft = element.scrollLeft;
      var result = null;
      element.scrollLeft = -1;
      result = element.scrollLeft < 0;
      element.scrollLeft = originalScrollLeft;
      return result;
    }();

    this.negativeScrollAdjustment = this.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
    this.event = new EventManager();
    this.ownerDocument = element.ownerDocument || document;
    this.scrollbarXRail = div(cls.element.rail("x"));
    element.appendChild(this.scrollbarXRail);
    this.scrollbarX = div(cls.element.thumb("x"));
    this.scrollbarXRail.appendChild(this.scrollbarX);
    this.scrollbarX.setAttribute("tabindex", 0);
    this.event.bind(this.scrollbarX, "focus", focus);
    this.event.bind(this.scrollbarX, "blur", blur);
    this.scrollbarXActive = null;
    this.scrollbarXWidth = null;
    this.scrollbarXLeft = null;
    var railXStyle = get(this.scrollbarXRail);
    this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);

    if (isNaN(this.scrollbarXBottom)) {
      this.isScrollbarXUsingBottom = false;
      this.scrollbarXTop = toInt(railXStyle.top);
    } else {
      this.isScrollbarXUsingBottom = true;
    }

    this.railBorderXWidth = toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth); // Set rail to display:block to calculate margins

    set(this.scrollbarXRail, {
      display: "block"
    });
    this.railXMarginWidth = toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
    set(this.scrollbarXRail, {
      display: ""
    });
    this.railXWidth = null;
    this.railXRatio = null;
    this.scrollbarYRail = div(cls.element.rail("y"));
    element.appendChild(this.scrollbarYRail);
    this.scrollbarY = div(cls.element.thumb("y"));
    this.scrollbarYRail.appendChild(this.scrollbarY);
    this.scrollbarY.setAttribute("tabindex", 0);
    this.event.bind(this.scrollbarY, "focus", focus);
    this.event.bind(this.scrollbarY, "blur", blur);
    this.scrollbarYActive = null;
    this.scrollbarYHeight = null;
    this.scrollbarYTop = null;
    var railYStyle = get(this.scrollbarYRail);
    this.scrollbarYRight = parseInt(railYStyle.right, 10);

    if (isNaN(this.scrollbarYRight)) {
      this.isScrollbarYUsingRight = false;
      this.scrollbarYLeft = toInt(railYStyle.left);
    } else {
      this.isScrollbarYUsingRight = true;
    }

    this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
    this.railBorderYWidth = toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
    set(this.scrollbarYRail, {
      display: "block"
    });
    this.railYMarginHeight = toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
    set(this.scrollbarYRail, {
      display: ""
    });
    this.railYHeight = null;
    this.railYRatio = null;
    this.reach = {
      x: element.scrollLeft <= 0 ? "start" : element.scrollLeft >= this.contentWidth - this.containerWidth ? "end" : null,
      y: element.scrollTop <= 0 ? "start" : element.scrollTop >= this.contentHeight - this.containerHeight ? "end" : null
    };
    this.isAlive = true;
    this.settings.handlers.forEach(function (handlerName) {
      return handlers[handlerName](this$1$1);
    });
    this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only

    this.lastScrollLeft = element.scrollLeft; // for onScroll only

    this.event.bind(this.element, "scroll", function (e) {
      return this$1$1.onScroll(e);
    });
    updateGeometry(this);
  };

  PerfectScrollbar.prototype.update = function update(disableOnYReachWhenNoScroll) {
    if (!this.isAlive) {
      return;
    } // Recalcuate negative scrollLeft adjustment


    this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0; // Recalculate rail margins

    set(this.scrollbarXRail, {
      display: "block"
    });
    set(this.scrollbarYRail, {
      display: "block"
    });
    this.railXMarginWidth = toInt(get(this.scrollbarXRail).marginLeft) + toInt(get(this.scrollbarXRail).marginRight);
    this.railYMarginHeight = toInt(get(this.scrollbarYRail).marginTop) + toInt(get(this.scrollbarYRail).marginBottom); // Hide scrollbars not to affect scrollWidth and scrollHeight

    set(this.scrollbarXRail, {
      display: "none"
    });
    set(this.scrollbarYRail, {
      display: "none"
    });
    updateGeometry(this);
    processScrollDiff(this, "top", 0, false, true, disableOnYReachWhenNoScroll);
    processScrollDiff(this, "left", 0, false, true, disableOnYReachWhenNoScroll);
    set(this.scrollbarXRail, {
      display: ""
    });
    set(this.scrollbarYRail, {
      display: ""
    });
  };

  PerfectScrollbar.prototype.onScroll = function onScroll(e) {
    if (!this.isAlive) {
      return;
    }

    updateGeometry(this);
    processScrollDiff(this, "top", this.element.scrollTop - this.lastScrollTop);
    processScrollDiff(this, "left", this.element.scrollLeft - this.lastScrollLeft);
    this.lastScrollTop = Math.floor(this.element.scrollTop);
    this.lastScrollLeft = this.element.scrollLeft;
  };

  PerfectScrollbar.prototype.destroy = function destroy() {
    if (!this.isAlive) {
      return;
    }

    this.event.unbindAll();
    remove(this.scrollbarX);
    remove(this.scrollbarY);
    remove(this.scrollbarXRail);
    remove(this.scrollbarYRail);
    this.removePsClasses(); // unset elements

    this.element = null;
    this.scrollbarX = null;
    this.scrollbarY = null;
    this.scrollbarXRail = null;
    this.scrollbarYRail = null;
    this.isAlive = false;
  };

  PerfectScrollbar.prototype.removePsClasses = function removePsClasses() {
    this.element.className = this.element.className.split(" ").filter(function (name) {
      return !name.match(/^ps([-_].+|)$/);
    }).join(" ");
  };

  function _typeof$4(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

  var _excluded$m = ["className", "style", "option", "options", "containerRef", "onScrollY", "onScrollX", "onScrollUp", "onScrollDown", "onScrollLeft", "onScrollRight", "onYReachStart", "onYReachEnd", "onXReachStart", "onXReachEnd", "component", "onSync", "children"];

  function _extends$m() { _extends$m = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$m.apply(this, arguments); }

  function _objectWithoutProperties$m(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$m(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$m(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

  function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$3(subClass, superClass); }

  function _setPrototypeOf$3(o, p) { _setPrototypeOf$3 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$3(o, p); }

  function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf$3(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$3(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$3(this, result); }; }

  function _possibleConstructorReturn$3(self, call) { if (call && (_typeof$4(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$3(self); }

  function _assertThisInitialized$3(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf$3(o) { _getPrototypeOf$3 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$3(o); }
  var handlerNameByEvent = {
    "ps-scroll-y": "onScrollY",
    "ps-scroll-x": "onScrollX",
    "ps-scroll-up": "onScrollUp",
    "ps-scroll-down": "onScrollDown",
    "ps-scroll-left": "onScrollLeft",
    "ps-scroll-right": "onScrollRight",
    "ps-y-reach-start": "onYReachStart",
    "ps-y-reach-end": "onYReachEnd",
    "ps-x-reach-start": "onXReachStart",
    "ps-x-reach-end": "onXReachEnd"
  };
  Object.freeze(handlerNameByEvent);

  var ScrollBar = /*#__PURE__*/function (_Component) {
    _inherits$3(ScrollBar, _Component);

    var _super = _createSuper$3(ScrollBar);

    function ScrollBar(props) {
      var _this;

      _classCallCheck$3(this, ScrollBar);

      _this = _super.call(this, props);
      _this.handleRef = _this.handleRef.bind(_assertThisInitialized$3(_this));
      _this._handlerByEvent = {};
      return _this;
    }

    _createClass$3(ScrollBar, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.props.option) {
          console.warn('react-perfect-scrollbar: the "option" prop has been deprecated in favor of "options"');
        }

        this._ps = new PerfectScrollbar(this._container, this.props.options || this.props.option); // hook up events

        this._updateEventHook();

        this._updateClassName();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        this._updateEventHook(prevProps);

        this.updateScroll();

        if (prevProps.className !== this.props.className) {
          this._updateClassName();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this2 = this;

        // unhook up evens
        Object.keys(this._handlerByEvent).forEach(function (key) {
          var value = _this2._handlerByEvent[key];

          if (value) {
            _this2._container.removeEventListener(key, value, false);
          }
        });
        this._handlerByEvent = {};

        this._ps.destroy();

        this._ps = null;
      }
    }, {
      key: "_updateEventHook",
      value: function _updateEventHook() {
        var _this3 = this;

        var prevProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        // hook up events
        Object.keys(handlerNameByEvent).forEach(function (key) {
          var callback = _this3.props[handlerNameByEvent[key]];
          var prevCallback = prevProps[handlerNameByEvent[key]];

          if (callback !== prevCallback) {
            if (prevCallback) {
              var prevHandler = _this3._handlerByEvent[key];

              _this3._container.removeEventListener(key, prevHandler, false);

              _this3._handlerByEvent[key] = null;
            }

            if (callback) {
              var handler = function handler() {
                return callback(_this3._container);
              };

              _this3._container.addEventListener(key, handler, false);

              _this3._handlerByEvent[key] = handler;
            }
          }
        });
      }
    }, {
      key: "_updateClassName",
      value: function _updateClassName() {
        var className = this.props.className;

        var psClassNames = this._container.className.split(" ").filter(function (name) {
          return name.match(/^ps([-_].+|)$/);
        }).join(" ");

        if (this._container) {
          this._container.className = "scrollbar-container".concat(className ? " ".concat(className) : "").concat(psClassNames ? " ".concat(psClassNames) : "");
        }
      }
    }, {
      key: "updateScroll",
      value: function updateScroll() {
        this.props.onSync(this._ps);
      }
    }, {
      key: "handleRef",
      value: function handleRef(ref) {
        this._container = ref;
        this.props.containerRef(ref);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props;
            _this$props.className;
            var style = _this$props.style;
            _this$props.option;
            _this$props.options;
            _this$props.containerRef;
            _this$props.onScrollY;
            _this$props.onScrollX;
            _this$props.onScrollUp;
            _this$props.onScrollDown;
            _this$props.onScrollLeft;
            _this$props.onScrollRight;
            _this$props.onYReachStart;
            _this$props.onYReachEnd;
            _this$props.onXReachStart;
            _this$props.onXReachEnd;
            var component = _this$props.component;
            _this$props.onSync;
            var children = _this$props.children,
            remainProps = _objectWithoutProperties$m(_this$props, _excluded$m);

        var Comp = component;
        return /*#__PURE__*/React__default["default"].createElement(Comp, _extends$m({
          style: style,
          ref: this.handleRef
        }, remainProps), children);
      }
    }]);

    return ScrollBar;
  }(React.Component);
  ScrollBar.defaultProps = {
    className: "",
    style: undefined,
    option: undefined,
    options: undefined,
    containerRef: function containerRef() {},
    onScrollY: undefined,
    onScrollX: undefined,
    onScrollUp: undefined,
    onScrollDown: undefined,
    onScrollLeft: undefined,
    onScrollRight: undefined,
    onYReachStart: undefined,
    onYReachEnd: undefined,
    onXReachStart: undefined,
    onXReachEnd: undefined,
    onSync: function onSync(ps) {
      return ps.update();
    },
    component: "div"
  };
  ScrollBar.propTypes = {
    children: propTypes.exports.PropTypes.node.isRequired,
    className: propTypes.exports.PropTypes.string,
    style: propTypes.exports.PropTypes.object,
    option: propTypes.exports.PropTypes.object,
    options: propTypes.exports.PropTypes.object,
    containerRef: propTypes.exports.PropTypes.func,
    onScrollY: propTypes.exports.PropTypes.func,
    onScrollX: propTypes.exports.PropTypes.func,
    onScrollUp: propTypes.exports.PropTypes.func,
    onScrollDown: propTypes.exports.PropTypes.func,
    onScrollLeft: propTypes.exports.PropTypes.func,
    onScrollRight: propTypes.exports.PropTypes.func,
    onYReachStart: propTypes.exports.PropTypes.func,
    onYReachEnd: propTypes.exports.PropTypes.func,
    onXReachStart: propTypes.exports.PropTypes.func,
    onXReachEnd: propTypes.exports.PropTypes.func,
    onSync: propTypes.exports.PropTypes.func,
    component: propTypes.exports.PropTypes.string
  } ;

  var _excluded$l = ["className", "variant", "children"];

  function _extends$l() { _extends$l = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$l.apply(this, arguments); }

  function _defineProperty$b(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties$l(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$l(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$l(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var Loader = function Loader(_ref) {
    var className = _ref.className,
        variant = _ref.variant,
        children = _ref.children,
        rest = _objectWithoutProperties$l(_ref, _excluded$l);

    var cName = "".concat(prefix, "-loader");
    var textClass = React__default["default"].Children.count(children) > 0 ? "".concat(cName, "--content") : "";
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$l({}, rest, {
      className: classNames(cName, textClass, _defineProperty$b({}, "".concat(cName, "--variant-").concat(variant), variant !== "default"), className),
      role: "status"
    }), children);
  };
  Loader.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /** Loader variant */
    variant: PropTypes.oneOf(["default"])
  } ;
  Loader.defaultProps = {
    className: undefined,
    title: undefined,
    variant: "default"
  };

  var _excluded$k = ["className", "children", "blur", "grayscale"];

  function _extends$k() { _extends$k = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$k.apply(this, arguments); }

  function _defineProperty$a(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties$k(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$k(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$k(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var Overlay = function Overlay(_ref) {
    var className = _ref.className,
        children = _ref.children,
        blur = _ref.blur,
        grayscale = _ref.grayscale,
        rest = _objectWithoutProperties$k(_ref, _excluded$k);

    var cName = "".concat(prefix, "-overlay");
    var blurClass = "".concat(cName, "--blur");
    var grayscaleClass = "".concat(cName, "--grayscale");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$k({}, rest, {
      className: classNames(cName, _defineProperty$a({}, blurClass, blur), _defineProperty$a({}, grayscaleClass, grayscale), className)
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__content")
    }, children));
  };
  Overlay.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /**
     * Blur overlayed content.
     * This feature is experimental and have limited browser support
     */
    blur: PropTypes.bool,

    /**
     * Grayscale overlayed content.
     * This feature is experimental and have limited browser support
     */
    grayscale: PropTypes.bool
  } ;
  Overlay.defaultProps = {
    className: "",
    children: undefined,
    blur: false,
    grayscale: false
  };

  var _excluded$j = ["sender", "sentTime", "children", "className"];

  function _extends$j() { _extends$j = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$j.apply(this, arguments); }

  function _objectWithoutProperties$j(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$j(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$j(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageHeader = function MessageHeader(_ref) {
    var sender = _ref.sender,
        sentTime = _ref.sentTime,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$j(_ref, _excluded$j);

    var cName = "".concat(prefix, "-message__header");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$j({}, rest, {
      className: classNames(cName, className)
    }), typeof children !== "undefined" ? children : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(prefix, "-message__sender-name")
    }, sender), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(prefix, "-message__sent-time")
    }, sentTime)));
  };
  MessageHeader.displayName = "Message.Header";
  MessageHeader.propTypes = {
    sender: PropTypes.string,
    sentTime: PropTypes.string,

    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageHeader.defaultProps = {
    sender: "",
    sentTime: "",
    children: undefined
  };

  var _excluded$i = ["sender", "sentTime", "children", "className"];

  function _extends$i() { _extends$i = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$i.apply(this, arguments); }

  function _objectWithoutProperties$i(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$i(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$i(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageFooter = function MessageFooter(_ref) {
    var sender = _ref.sender,
        sentTime = _ref.sentTime,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$i(_ref, _excluded$i);

    var cName = "".concat(prefix, "-message__footer");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$i({}, rest, {
      className: classNames(cName, className)
    }), typeof children !== "undefined" ? children : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(prefix, "-message__sender-name")
    }, sender), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(prefix, "-message__sent-time")
    }, sentTime)));
  };
  MessageFooter.displayName = "Message.Footer";
  MessageFooter.propTypes = {
    sender: PropTypes.string,
    sentTime: PropTypes.string,

    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageFooter.defaultProps = {
    sender: "",
    sentTime: "",
    children: undefined
  };

  var MessageCustomContent = function MessageCustomContent(_ref) {
    var children = _ref.children,
        className = _ref.className;
    var cName = "".concat(prefix, "-message__custom-content");
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: classNames(cName, className)
    }, children);
  };
  MessageCustomContent.displayName = "Message.CustomContent";
  MessageCustomContent.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageCustomContent.defaultProps = {};

  var MessageImageContent = function MessageImageContent(_ref) {
    var src = _ref.src,
        width = _ref.width,
        height = _ref.height,
        alt = _ref.alt,
        className = _ref.className;
    var cName = "".concat(prefix, "-message__image-content");
    var style = {
      width: typeof width === "number" ? "".concat(width, "px") : typeof width === "string" ? width : undefined,
      height: typeof height === "number" ? "".concat(height, "px") : typeof height === "string" ? height : undefined
    };
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: classNames(cName, className)
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: src,
      style: style,
      alt: alt
    }));
  };
  MessageImageContent.displayName = "Message.ImageContent";
  MessageImageContent.propTypes = {
    /** Image source*/
    src: PropTypes.string,

    /** Image width */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Image height */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Alternate text for image */
    alt: PropTypes.string,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageImageContent.defaultProps = {};

  var MessageHtmlContent = function MessageHtmlContent(_ref) {
    var html = _ref.html,
        className = _ref.className;
    var cName = "".concat(prefix, "-message__html-content");

    var createMarkup = function createMarkup() {
      return {
        __html: html
      };
    };

    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: classNames(cName, className),
      dangerouslySetInnerHTML: createMarkup()
    });
  };
  MessageHtmlContent.displayName = "Message.HtmlContent";
  MessageHtmlContent.propTypes = {
    /**
     * Html string will be rendered in component using dangerouslySetInnerHTML
     */
    html: PropTypes.string,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageHtmlContent.defaultProps = {};

  var MessageTextContent = function MessageTextContent(_ref) {
    var text = _ref.text,
        className = _ref.className,
        children = _ref.children;
    var cName = "".concat(prefix, "-message__text-content");
    var content = children !== null && children !== void 0 ? children : text;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: classNames(cName, className)
    }, content);
  };
  MessageTextContent.displayName = "Message.TextContent";
  MessageTextContent.propTypes = {
    /** Primary content - message text */
    children: PropTypes.string,

    /** Message text. Property has precedence over children */
    text: PropTypes.string,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageTextContent.defaultProps = {};

  var _excluded$h = ["model", "avatarSpacer", "avatarPosition", "type", "payload", "children", "className"];

  function _extends$h() { _extends$h = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$h.apply(this, arguments); }

  function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }

  function _slicedToArray$6(arr, i) { return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _unsupportedIterableToArray$6(arr, i) || _nonIterableRest$6(); }

  function _nonIterableRest$6() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$6(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$6(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen); }

  function _arrayLikeToArray$6(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$6(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$6(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$h(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$h(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$h(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  /**
   * Chat message
   */

  var Message$1 = function Message(_ref) {
    var _ref2, _ref3;

    var _ref$model = _ref.model,
        message = _ref$model.message,
        sentTime = _ref$model.sentTime,
        sender = _ref$model.sender,
        direction = _ref$model.direction,
        position = _ref$model.position,
        modelType = _ref$model.type,
        modelPayload = _ref$model.payload,
        avatarSpacer = _ref.avatarSpacer,
        avatarPosition = _ref.avatarPosition,
        type = _ref.type,
        argPayload = _ref.payload,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$h(_ref, _excluded$h);

    var cName = "".concat(prefix, "-message");

    var _getChildren = getChildren(children, [Avatar, MessageHeader, MessageFooter, MessageHtmlContent, MessageTextContent, MessageImageContent, MessageCustomContent]),
        _getChildren2 = _slicedToArray$6(_getChildren, 7),
        avatar = _getChildren2[0],
        header = _getChildren2[1],
        footer = _getChildren2[2],
        htmlContent = _getChildren2[3],
        textContent = _getChildren2[4],
        imageContent = _getChildren2[5],
        customContent = _getChildren2[6];

    var directionClass = function () {
      if (direction === 0 || direction === "incoming") {
        return "".concat(cName, "--incoming");
      } else if (direction === 1 || direction === "outgoing") {
        return "".concat(cName, "--outgoing");
      }
    }();

    var avatarPositionClass = function (position) {
      var classPrefix = "".concat(cName, "--avatar-");

      if (position === 0 || position === "top-left" || position === "tl") {
        return "".concat(classPrefix, "tl");
      } else if (position === 1 || position === "top-right" || position === "tr") {
        return "".concat(classPrefix, "tr");
      } else if (position === 2 || position === "bottom-right" || position === "br") {
        return "".concat(classPrefix, "br");
      } else if (position === 3 || position === "bottom-left" || position === "bl") {
        return "".concat(classPrefix, "bl");
      } else if (position === 4 || position === "center-left" || position === "cl") {
        return "".concat(classPrefix, "cl");
      } else if (position === 5 || position === "center-right" || position === "cr") {
        return "".concat(classPrefix, "cr");
      }
    }(avatarPosition);

    var positionClass = function (position) {
      var classPrefix = "".concat(prefix, "-message--");

      if (position === "single" || position === 0) {
        return "".concat(classPrefix, "single");
      } else if (position === "first" || position === 1) {
        return "".concat(classPrefix, "first");
      } else if (position === "normal" || position === 2) {
        return "";
      } else if (position === "last" || position === 3) {
        return "".concat(classPrefix, "last");
      }
    }(position);

    var ariaLabel = function () {
      if ((sender === null || sender === void 0 ? void 0 : sender.length) > 0 && (sentTime === null || sentTime === void 0 ? void 0 : sentTime.length) > 0) {
        return "".concat(sender, ": ").concat(sentTime);
      } else if ((sender === null || sender === void 0 ? void 0 : sender.length) > 0 && (typeof sentTime === "undefined" || (sentTime === null || sentTime === void 0 ? void 0 : sentTime.length) === 0)) {
        return sender;
      } else {
        return null;
      }
    }();

    var childContent = (_ref2 = (_ref3 = htmlContent !== null && htmlContent !== void 0 ? htmlContent : textContent) !== null && _ref3 !== void 0 ? _ref3 : imageContent) !== null && _ref2 !== void 0 ? _ref2 : customContent;
    var messageContent = childContent !== null && childContent !== void 0 ? childContent : function () {
      var messageType = modelType !== null && modelType !== void 0 ? modelType : type;
      var payloadFromModel = modelPayload !== null && modelPayload !== void 0 ? modelPayload : message;
      var payload = payloadFromModel !== null && payloadFromModel !== void 0 ? payloadFromModel : argPayload;
      var payloadName = _typeof$3(payload) === "object" ? getComponentName(payload) : "";

      if (messageType === "html" && payloadName !== "Message.CustomContent") {
        return /*#__PURE__*/React__default["default"].createElement(MessageHtmlContent, {
          html: payload
        });
      } else if (messageType === "text") {
        return /*#__PURE__*/React__default["default"].createElement(MessageTextContent, {
          text: payload
        });
      } else if (messageType === "image") {
        return /*#__PURE__*/React__default["default"].createElement(MessageImageContent, payload);
      } else if (messageType === "custom" || payloadName === "Message.CustomContent") {
        return payload;
      }
    }();
    return /*#__PURE__*/React__default["default"].createElement("section", _extends$h({}, rest, {
      "aria-label": ariaLabel,
      className: classNames(cName, directionClass, _defineProperty$9({}, "".concat(cName, "--avatar-spacer"), avatarSpacer), positionClass, avatarPositionClass, className)
    }, _defineProperty$9({}, "data-".concat(prefix, "-message"), "")), typeof avatar !== "undefined" && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__avatar")
    }, avatar), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__content-wrapper")
    }, header, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__content")
    }, messageContent), footer));
  };
  Message$1.propTypes = {
    /**
     * Model object
     * **message**: string - Message to send
     * **sentTime**: string - Message sent time
     * **sender**: string - Sender name
     * **direction**: "incoming" | "outgoing" | 0 | 1 - Message direction
     * **position**: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3 - Message position in feed
     * **type**: "html" | "text" | "image" | "custom"
     */
    model: PropTypes.shape({
      /** Chat message to display - content. */
      message: PropTypes.string,
      sentTime: PropTypes.string,
      sender: PropTypes.string,
      direction: PropTypes.oneOf(["incoming", "outgoing", 0, 1]),

      /** Position. */
      position: PropTypes.oneOf(["single", "first", "normal", "last", 0, 1, 2, 3]),

      /**
       * Message type
       * This property can also be added directly to component, but property from model has precedence.
       * Each type can have payload defined in model.payload or in payload property.
       * Allowed payloads for different message are described in payload property.
       */
      type: PropTypes.oneOf(["html", "text", "image", "custom"]),

      /**
       * Message payload.
       * Must be adequate to message type.
       * Allowed payloads for different message types:
       * html: String - Html string to render,
       * text: String - Text to render,
       * image: Object - for object properties please see **&lt;Message.ImageContent /&gt** properties,
       * custom: **Message.CustomContent** - Component
       */
      payload: PropTypes.oneOfType([PropTypes.string, PropTypes.object, allowedChildren([MessageCustomContent])])
    }),
    avatarSpacer: PropTypes.bool,
    avatarPosition: PropTypes.oneOf(["tl", "tr", "cl", "cr", "bl", "br", "top-left", "top-right", "center-left", "center-right", "bottom-left", "bottom-right"]),

    /**
     * Primary content.
     * Content from payload has precedence over Message.*Content properties.
     * Whe
     * Allowed components:
     *
     * * &lt;Avatar /&gt;
     * * &lt;Message.Header /&gt;
     * * &lt;Message.Footer /&gt;
     * * &lt;Message.HtmlContent /&gt;
     * * &lt;Message.TextContent /&gt;
     * * &lt;Message.ImageContent /&gt;
     * * &lt;Message.CustomContent /&gt;
     */
    children: allowedChildren([Avatar, MessageHeader, MessageFooter, MessageHtmlContent, MessageTextContent, MessageImageContent, MessageCustomContent]),

    /** Additional classes. */
    className: PropTypes.string,

    /**
     * Message type
     * This property can also exists in model. In that case value from model has precedence.
     **/
    type: PropTypes.oneOf(["html", "text", "image", "custom"]),

    /**
     * Message payload.
     * Must be adequate to message type.
     * Allowed payloads for different message types:
     * html: String - Html string to render,
     * text: String - Text to render,
     * image: Object - for object properties please see **&lt;Message.ImageContent &gt/>** properties,
     * custom: **Message.CustomContent** - Component
     */
    payload: PropTypes.oneOfType([PropTypes.string, allowedChildren([MessageCustomContent])])
  } ;
  Message$1.defaultProps = {
    model: {
      message: "",
      sentTime: "",
      sender: "",
      direction: 1
    },
    avatarSpacer: false,
    avatarPosition: undefined,
    type: "html"
  };
  Message$1.Header = MessageHeader;
  Message$1.HtmlContent = MessageHtmlContent;
  Message$1.TextContent = MessageTextContent;
  Message$1.ImageContent = MessageImageContent;
  Message$1.CustomContent = MessageCustomContent;
  Message$1.Footer = MessageFooter;

  var _excluded$g = ["children", "className"];

  function _extends$g() { _extends$g = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$g.apply(this, arguments); }

  function _objectWithoutProperties$g(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$g(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$g(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageGroupHeader = function MessageGroupHeader(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$g(_ref, _excluded$g);

    var cName = "".concat(prefix, "-message-group__header");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$g({}, rest, {
      className: classNames(cName, className)
    }), children);
  };
  MessageGroupHeader.displayName = "MessageGroup.Header";
  MessageGroupHeader.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageGroupHeader.defaultProps = {
    children: undefined
  };

  var _excluded$f = ["children", "className"];

  function _extends$f() { _extends$f = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }

  function _objectWithoutProperties$f(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$f(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$f(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageGroupFooter = function MessageGroupFooter(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$f(_ref, _excluded$f);

    var cName = "".concat(prefix, "-message-group__footer");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$f({}, rest, {
      className: classNames(cName, className)
    }), children);
  };
  MessageGroupFooter.displayName = "MessageGroup.Footer";
  MessageGroupFooter.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageGroupFooter.defaultProps = {
    children: undefined
  };

  var _excluded$e = ["children", "className"];

  function _extends$e() { _extends$e = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }

  function _objectWithoutProperties$e(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$e(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$e(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageGroupMessages = function MessageGroupMessages(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$e(_ref, _excluded$e);

    var cName = "".concat(prefix, "-message-group");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$e({}, rest, {
      className: classNames("".concat(cName, "__messages"), className)
    }), children);
  };
  MessageGroupMessages.displayName = "MessageGroup.Messages";
  MessageGroupMessages.propTypes = {
    /**
     * Messages.
     * Allowed node:
     *
     * * &lt;Message /&gt;
     */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageGroupMessages.defaultProps = {
    children: undefined
  };

  var _excluded$d = ["direction", "avatarPosition", "sender", "sentTime", "children", "className"];

  function _extends$d() { _extends$d = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }

  function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray$5(arr, i) { return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _unsupportedIterableToArray$5(arr, i) || _nonIterableRest$5(); }

  function _nonIterableRest$5() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }

  function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$5(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$5(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$d(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$d(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$d(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageGroup = function MessageGroup(_ref) {
    var direction = _ref.direction,
        avatarPosition = _ref.avatarPosition,
        sender = _ref.sender,
        sentTime = _ref.sentTime,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$d(_ref, _excluded$d);

    var cName = "".concat(prefix, "-message-group");

    var directionClass = function () {
      if (direction === 0 || direction === "incoming") {
        return "".concat(cName, "--incoming");
      } else if (direction === 1 || direction === "outgoing") {
        return "".concat(cName, "--outgoing");
      }
    }();

    var avatarPositionClass = function () {
      var prefix = "".concat(cName, "--avatar-");

      if (typeof avatarPosition === "string") {
        if (avatarPosition === "tl" || avatarPosition === "top-left" || avatarPosition === "tr" || avatarPosition === "top-right" || avatarPosition === "bl" || avatarPosition === "bottom-right" || avatarPosition === "br" || avatarPosition === "bottom-right" || avatarPosition === "cl" || avatarPosition === "center-left" || avatarPosition === "cr" || avatarPosition === "center-right") {
          return "".concat(prefix).concat(avatarPosition);
        }
      }
    }();

    var _getChildren = getChildren(children, [Avatar, MessageGroupHeader, MessageGroupFooter, MessageGroupMessages]),
        _getChildren2 = _slicedToArray$5(_getChildren, 4),
        avatar = _getChildren2[0],
        header = _getChildren2[1],
        footer = _getChildren2[2],
        messages = _getChildren2[3];

    var ariaLabel = function () {
      if (sender.length > 0 && sentTime.length > 0) {
        return "".concat(sender, ": ").concat(sentTime);
      } else if (sender.length > 0 && sentTime.length === 0) {
        return sender;
      } else {
        return null;
      }
    }();

    return /*#__PURE__*/React__default["default"].createElement("section", _extends$d({
      "aria-label": ariaLabel
    }, rest, {
      className: classNames(cName, directionClass, avatarPositionClass, className)
    }, _defineProperty$8({}, "data-".concat(prefix, "-message-group"), "")), typeof avatar !== "undefined" && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__avatar")
    }, avatar), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__content")
    }, header, messages, footer));
  };
  MessageGroup.propTypes = {
    /** Direction. */
    direction: PropTypes.oneOf(["incoming", "outgoing", 0, 1]),

    /** Avatar position. */
    avatarPosition: PropTypes.oneOf(["tl", "tr", "br", "bl", "cl", "cr"]),
    sentTime: PropTypes.string,
    sender: PropTypes.string,

    /**
     * Primary content.
     * Allowed nodes:
     *
     * * &lt;Avatar /&gt;
     * * &lt;MessageGroup.Header /&gt;
     * * &lt;MessageGroup.Footer /&gt;
     * * &lt;MessageGroup.Messages /&gt;
     * </ul>
     */
    children: allowedChildren([Avatar, MessageGroupHeader, MessageGroupFooter, MessageGroupMessages]),

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageGroup.defaultProps = {
    direction: "incoming",
    sentTime: "",
    sender: "",
    avatarPosition: undefined
  };
  MessageGroup.Header = MessageGroupHeader;
  MessageGroup.Footer = MessageGroupFooter;
  MessageGroup.Messages = MessageGroupMessages;

  var _excluded$c = ["content", "as", "children", "className"];

  function _extends$c() { _extends$c = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }

  function _objectWithoutProperties$c(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$c(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$c(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageSeparator = function MessageSeparator(_ref) {
    var content = _ref.content,
        as = _ref.as,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$c(_ref, _excluded$c);

    var cName = "".concat(prefix, "-message-separator");

    var Tag = function () {
      if (typeof as === "string" && as.length > 0) {
        return as;
      } else {
        return MessageSeparator.defaultProps.as;
      }
    }();

    return /*#__PURE__*/React__default["default"].createElement(Tag, _extends$c({}, rest, {
      className: classNames(cName, className)
    }), isChildrenNil(children) === true ? content : children);
  };
  MessageSeparator.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Shorthand for primary content. */
    content: PropTypes.node,

    /** An element type to render as. */
    as: PropTypes.elementType,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MessageSeparator.defaultProps = {
    children: undefined,
    content: undefined,
    as: "div"
  };

  var _excluded$b = ["className", "children"];

  function _extends$b() { _extends$b = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }

  function _objectWithoutProperties$b(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$b(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$b(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MessageListContent = function MessageListContent(_ref) {
    var className = _ref.className,
        children = _ref.children,
        rest = _objectWithoutProperties$b(_ref, _excluded$b);

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$b({}, rest, {
      className: className
    }), children);
  };
  MessageListContent.displayName = "MessageList.Content";
  MessageListContent.propTypes = {
    /** Primary content. Message elements */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;

  function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

  var _excluded$a = ["children", "typingIndicator", "loading", "loadingMore", "loadingMorePosition", "onYReachStart", "onYReachEnd", "className", "disableOnYReachWhenNoScroll", "scrollBehavior", "autoScrollToBottom", "autoScrollToBottomOnMount"];

  function _extends$a() { _extends$a = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }

  function _slicedToArray$4(arr, i) { return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$4(); }

  function _nonIterableRest$4() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

  function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$4(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$4(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$a(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$a(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$a(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

  function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$2(subClass, superClass); }

  function _setPrototypeOf$2(o, p) { _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$2(o, p); }

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$2(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$2(this, result); }; }

  function _possibleConstructorReturn$2(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$2(self); }

  function _assertThisInitialized$2(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf$2(o) { _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$2(o); }

  function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var MessageListInner = /*#__PURE__*/function (_React$Component) {
    _inherits$2(MessageListInner, _React$Component);

    var _super = _createSuper$2(MessageListInner);

    function MessageListInner(props) {
      var _this;

      _classCallCheck$2(this, MessageListInner);

      _this = _super.call(this, props);

      _defineProperty$7(_assertThisInitialized$2(_this), "handleResize", function () {
        // If container is smaller than before resize - scroll to End
        if (_this.containerRef.current.clientHeight < _this.lastClientHeight) {
          _this.scrollToEnd(_this.props.scrollBehavior);
        }

        _this.scrollRef.current.updateScroll();
      });

      _defineProperty$7(_assertThisInitialized$2(_this), "handleContainerResize", function () {
        if (_this.resizeTicking === false) {
          window.requestAnimationFrame(function () {
            var list = _this.containerRef.current;

            if (list) {
              var currentHeight = list.clientHeight;
              var diff = currentHeight - _this.lastClientHeight;

              if (diff >= 1) {
                // Because fractional
                if (_this.preventScrollTop === false) {
                  list.scrollTop = Math.round(list.scrollTop) - diff;
                }
              } else {
                list.scrollTop = list.scrollTop - diff;
              }

              _this.lastClientHeight = list.clientHeight;

              _this.scrollRef.current.updateScroll();
            }

            _this.resizeTicking = false;
          });
          _this.resizeTicking = true;
        }
      });

      _defineProperty$7(_assertThisInitialized$2(_this), "isSticked", function () {
        var list = _this.containerRef.current;
        return list.scrollHeight === Math.round(list.scrollTop + list.clientHeight);
      });

      _defineProperty$7(_assertThisInitialized$2(_this), "handleScroll", function () {
        if (_this.scrollTicking === false) {
          window.requestAnimationFrame(function () {
            if (_this.noScroll === false) {
              _this.preventScrollTop = _this.isSticked();
            } else {
              _this.noScroll = false;
            }

            _this.scrollTicking = false;
          });
          _this.scrollTicking = true;
        }
      });

      _defineProperty$7(_assertThisInitialized$2(_this), "getLastMessageOrGroup", function () {
        var lastElement = _this.containerRef.current.querySelector("[data-".concat(prefix, "-message-list]>[data-").concat(prefix, "-message]:last-of-type,[data-").concat(prefix, "-message-list]>[data-").concat(prefix, "-message-group]:last-of-type"));

        var lastMessageInGroup = lastElement === null || lastElement === void 0 ? void 0 : lastElement.querySelector("[data-".concat(prefix, "-message]:last-of-type"));
        return {
          lastElement: lastElement,
          lastMessageInGroup: lastMessageInGroup
        };
      });

      _this.scrollPointRef = /*#__PURE__*/React__default["default"].createRef();
      _this.containerRef = /*#__PURE__*/React__default["default"].createRef();
      _this.scrollRef = /*#__PURE__*/React__default["default"].createRef();
      _this.lastClientHeight = 0;
      _this.preventScrollTop = false;
      _this.resizeObserver = undefined;
      _this.scrollTicking = false;
      _this.resizeTicking = false;
      _this.noScroll = undefined;
      return _this;
    }

    _createClass$2(MessageListInner, [{
      key: "getSnapshotBeforeUpdate",
      value: function getSnapshotBeforeUpdate() {
        var list = this.containerRef.current;
        var topHeight = Math.round(list.scrollTop + list.clientHeight); // 1 px fix for firefox

        var sticky = list.scrollHeight === topHeight || list.scrollHeight + 1 === topHeight || list.scrollHeight - 1 === topHeight;
        return {
          sticky: sticky,
          clientHeight: list.clientHeight,
          scrollHeight: list.scrollHeight,
          lastMessageOrGroup: this.getLastMessageOrGroup(),
          diff: list.scrollHeight - list.scrollTop
        };
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        // Set scrollbar to bottom on start (getSnaphotBeforeUpdate is not invoked on mount)
        if (this.props.autoScrollToBottomOnMount === true) {
          this.scrollToEnd(this.props.scrollBehavior);
        }

        this.lastClientHeight = this.containerRef.current.clientHeight;
        window.addEventListener("resize", this.handleResize);

        if (typeof window.ResizeObserver === "function") {
          this.resizeObserver = new ResizeObserver(this.handleContainerResize);
          this.resizeObserver.observe(this.containerRef.current);
        }

        this.containerRef.current.addEventListener("scroll", this.handleScroll);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState, snapshot) {
        var autoScrollToBottom = this.props.autoScrollToBottom;

        if (typeof snapshot !== "undefined") {
          var list = this.containerRef.current;

          var _this$getLastMessageO = this.getLastMessageOrGroup(),
              lastElement = _this$getLastMessageO.lastElement,
              lastMessageInGroup = _this$getLastMessageO.lastMessageInGroup;

          if (lastElement === snapshot.lastMessageOrGroup.lastElement) {
            // If lastMessageInGroup is defined last element is MessageGroup otherwise its Message
            if (typeof lastMessageInGroup === "undefined" || lastMessageInGroup === snapshot.lastMessageOrGroup.lastMessageInGroup) {
              list.scrollTop = list.scrollHeight - snapshot.diff + (this.lastClientHeight - list.clientHeight);
            }
          }

          if (snapshot.sticky === true) {
            if (autoScrollToBottom === true) {
              this.scrollToEnd(this.props.scrollBehavior);
            }

            this.preventScrollTop = true;
          } else {
            if (snapshot.clientHeight < this.lastClientHeight) {
              // If was sticky because scrollHeight is not changing, so here will be equal to lastHeight plus current scrollTop
              // 1px fix id for firefox
              var sHeight = list.scrollTop + this.lastClientHeight;

              if (list.scrollHeight === sHeight || list.scrollHeight + 1 === sHeight || list.scrollHeight - 1 === sHeight) {
                if (autoScrollToBottom === true) {
                  this.scrollToEnd(this.props.scrollBehavior);
                  this.preventScrollTop = true;
                }
              } else {
                this.preventScrollTop = false;
              }
            } else {
              this.preventScrollTop = false;

              if (lastElement === snapshot.lastMessageOrGroup.lastElement) {
                if (typeof lastMessageInGroup === "undefined" || lastMessageInGroup === snapshot.lastMessageOrGroup.lastMessageInGroup) {
                  // New elements were not added at end
                  // New elements were added at start
                  if (list.scrollTop === 0 && list.scrollHeight > snapshot.scrollHeight) {
                    list.scrollTop = list.scrollHeight - snapshot.scrollHeight;
                  }
                }
              }
            }
          }

          this.lastClientHeight = snapshot.clientHeight;
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);

        if (typeof this.resizeObserver !== "undefined") {
          this.resizeObserver.disconnect();
        }

        this.containerRef.current.removeEventListener("scroll", this.handleScroll);
      }
    }, {
      key: "scrollToEnd",
      value: function scrollToEnd() {
        var scrollBehavior = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.scrollBehavior;
        var list = this.containerRef.current;
        var scrollPoint = this.scrollPointRef.current; // https://stackoverflow.com/a/45411081/6316091

        var parentRect = list.getBoundingClientRect();
        var childRect = scrollPoint.getBoundingClientRect(); // Scroll by offset relative to parent

        var scrollOffset = childRect.top + list.scrollTop - parentRect.top;

        if (list.scrollBy) {
          list.scrollBy({
            top: scrollOffset,
            behavior: scrollBehavior
          });
        } else {
          list.scrollTop = scrollOffset;
        }

        this.lastClientHeight = list.clientHeight; // Important flag! Blocks strange Chrome mobile behaviour - automatic scroll.
        // Chrome mobile sometimes trigger scroll when new content is entered to MessageInput. It's probably Chrome Bug - sth related with overflow-anchor

        this.noScroll = true;
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            children = _this$props.children,
            typingIndicator = _this$props.typingIndicator,
            loading = _this$props.loading,
            loadingMore = _this$props.loadingMore,
            loadingMorePosition = _this$props.loadingMorePosition,
            onYReachStart = _this$props.onYReachStart,
            onYReachEnd = _this$props.onYReachEnd,
            className = _this$props.className,
            disableOnYReachWhenNoScroll = _this$props.disableOnYReachWhenNoScroll;
            _this$props.scrollBehavior;
            _this$props.autoScrollToBottom;
            _this$props.autoScrollToBottomOnMount;
            var rest = _objectWithoutProperties$a(_this$props, _excluded$a);

        var cName = "".concat(prefix, "-message-list");

        var _getChildren = getChildren(children, [MessageListContent]),
            _getChildren2 = _slicedToArray$4(_getChildren, 1),
            customContent = _getChildren2[0];

        return /*#__PURE__*/React__default["default"].createElement("div", _extends$a({}, rest, {
          className: classNames(cName, className)
        }), loadingMore && /*#__PURE__*/React__default["default"].createElement("div", {
          className: classNames("".concat(cName, "__loading-more"), _defineProperty$7({}, "".concat(cName, "__loading-more--bottom"), loadingMorePosition === "bottom"))
        }, /*#__PURE__*/React__default["default"].createElement(Loader, null)), loading && /*#__PURE__*/React__default["default"].createElement(Overlay, null, /*#__PURE__*/React__default["default"].createElement(Loader, null)), /*#__PURE__*/React__default["default"].createElement(ScrollBar, _extends$a({
          onYReachStart: onYReachStart,
          onYReachEnd: onYReachEnd,
          onSync: function onSync(ps) {
            return ps.update(disableOnYReachWhenNoScroll);
          },
          className: "".concat(cName, "__scroll-wrapper"),
          ref: this.scrollRef,
          containerRef: function containerRef(ref) {
            return _this2.containerRef.current = ref;
          },
          options: {
            suppressScrollX: true
          }
        }, _defineProperty$7({}, "data-".concat(prefix, "-message-list"), ""), {
          style: {
            overscrollBehaviorY: "none",
            overflowAnchor: "auto",
            touchAction: "none"
          }
        }), customContent ? customContent : children, /*#__PURE__*/React__default["default"].createElement("div", {
          className: "".concat(cName, "__scroll-to"),
          ref: this.scrollPointRef
        })), typeof typingIndicator !== "undefined" && /*#__PURE__*/React__default["default"].createElement("div", {
          className: "".concat(cName, "__typing-indicator-container")
        }, typingIndicator));
      }
    }]);

    return MessageListInner;
  }(React__default["default"].Component);

  MessageListInner.displayName = "MessageList";

  function MessageListFunc(props, ref) {
    var msgListRef = React.useRef();

    var scrollToBottom = function scrollToBottom(scrollBehavior) {
      return msgListRef.current.scrollToEnd(scrollBehavior);
    }; // Return object with public Api


    React.useImperativeHandle(ref, function () {
      return {
        scrollToBottom: scrollToBottom
      };
    });
    return /*#__PURE__*/React__default["default"].createElement(MessageListInner, _extends$a({
      ref: msgListRef
    }, props));
  }

  var MessageList = /*#__PURE__*/React.forwardRef(MessageListFunc);
  MessageList.propTypes = {
    /**
     * Primary content. Message elements
     * Allowed components:
     *
     * * &lt;Message /&gt;
     * * &lt;MessageGroup /&gt;
     * * &lt;MessageSeparator /&gt;
     * * &lt;MessageListContent /&gt;
     */
    children: allowedChildren([Message$1, MessageGroup, MessageSeparator, MessageListContent]),

    /** Typing indicator element. */
    typingIndicator: PropTypes.node,

    /** Loading flag. */
    loading: PropTypes.bool,

    /** Loading more flag for infinity scroll. */
    loadingMore: PropTypes.bool,

    /** Loading more loader position. */
    loadingMorePosition: PropTypes.oneOf(["top", "bottom"]),

    /**
     * This is fired when the scrollbar reaches the beginning on the y axis.<br/>
     * It can be used to load previous messages using the infinite scroll.
     */
    onYReachStart: PropTypes.func,

    /**
     * This is fired when the scrollbar reaches the end on the y axis.<br/>
     * It can be used to load next messages using the infinite scroll.
     */
    onYReachEnd: PropTypes.func,

    /**
     * Disables onYReachStart and onYReachEnd events from being fired<br />
     * when the list is not scrollable.
     * This is set to false by default for backward compatibility.
     */
    disableOnYReachWhenNoScroll: PropTypes.bool,

    /**
     * Auto scroll to bottom
     */
    autoScrollToBottom: PropTypes.bool,

    /**
     * Auto scroll to bottom on mount
     */
    autoScrollToBottomOnMount: PropTypes.bool,

    /**
     * Scroll behavior
     * https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior
     */
    scrollBehavior: PropTypes.oneOf(["auto", "smooth"]),

    /** Additional classes. */
    className: PropTypes.string
  };
  MessageList.defaultProps = {
    typingIndicator: undefined,
    loading: false,
    loadingMore: false,
    loadingMorePosition: "top",
    disableOnYReachWhenNoScroll: false,
    autoScrollToBottom: true,
    autoScrollToBottomOnMount: true,
    scrollBehavior: "auto"
  };
  MessageListInner.propTypes = MessageList.propTypes ;
  MessageListInner.defaultProps = MessageList.defaultProps;
  MessageList.Content = MessageListContent;

  function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

  function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

  function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf$1(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

  function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$1(self); }

  function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

  function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var replaceCaret = function replaceCaret(el, activateAfterChange) {
    var isTargetFocused = document.activeElement === el; // Place the caret at the end of the element

    var target = document.createTextNode(""); // Put empty text node at the end of input

    el.appendChild(target); // do not move caret if element was not focused

    if (target !== null && target.nodeValue !== null && (isTargetFocused || activateAfterChange)) {
      var sel = window.getSelection();

      if (sel !== null) {
        var range = document.createRange();
        range.setStart(target, target.nodeValue.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  var ContentEditable = /*#__PURE__*/function (_Component) {
    _inherits$1(ContentEditable, _Component);

    var _super = _createSuper$1(ContentEditable);

    function ContentEditable(props) {
      var _this;

      _classCallCheck$1(this, ContentEditable);

      _this = _super.call(this, props);

      _defineProperty$6(_assertThisInitialized$1(_this), "innerHTML", function () {
        var _assertThisInitialize = _assertThisInitialized$1(_this),
            value = _assertThisInitialize.props.value;

        return {
          __html: typeof value !== "undefined" ? value : ""
        };
      });

      _defineProperty$6(_assertThisInitialized$1(_this), "handleKeyPress", function (evt) {
        var _assertThisInitialize2 = _assertThisInitialized$1(_this),
            onKeyPress = _assertThisInitialize2.props.onKeyPress;

        onKeyPress(evt);
      });

      _defineProperty$6(_assertThisInitialized$1(_this), "handleInput", function (evt) {
        var _assertThisInitialize3 = _assertThisInitialized$1(_this),
            onChange = _assertThisInitialize3.props.onChange;

        var target = evt.target;
        onChange(target.innerHTML, target.textContent, target.innerText);
      });

      _this.msgRef = /*#__PURE__*/React__default["default"].createRef();
      return _this;
    }

    _createClass$1(ContentEditable, [{
      key: "focus",
      value: // Public API
      function focus() {
        if (typeof this.msgRef.current !== "undefined") {
          this.msgRef.current.focus();
        }
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.props.autoFocus === true) {
          this.msgRef.current.focus();
        }
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        var msgRef = this.msgRef,
            _this$props = this.props,
            placeholder = _this$props.placeholder,
            disabled = _this$props.disabled,
            activateAfterChange = _this$props.activateAfterChange;

        if (typeof msgRef.current === "undefined") {
          return true;
        }

        if (nextProps.value !== msgRef.current.innerHTML) {
          return true;
        } // DO NOT place callbacks here in comparison!


        return placeholder !== nextProps.placeholder || disabled !== nextProps.disabled || activateAfterChange !== nextProps.activateAfterChange;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var msgRef = this.msgRef,
            _this$props2 = this.props,
            value = _this$props2.value,
            activateAfterChange = _this$props2.activateAfterChange;

        if (value !== msgRef.current.innerHTML) {
          msgRef.current.innerHTML = typeof value === "string" ? value : "";
        }

        replaceCaret(msgRef.current, activateAfterChange);
      }
    }, {
      key: "render",
      value: function render() {
        var msgRef = this.msgRef,
            handleInput = this.handleInput,
            handleKeyPress = this.handleKeyPress,
            innerHTML = this.innerHTML,
            _this$props3 = this.props,
            placeholder = _this$props3.placeholder,
            disabled = _this$props3.disabled,
            className = _this$props3.className,
            ph = typeof placeholder === "string" ? placeholder : "";
        return /*#__PURE__*/React__default["default"].createElement("div", {
          ref: msgRef,
          className: className,
          contentEditable: disabled === false,
          disabled: disabled,
          "data-placeholder": ph,
          onInput: handleInput,
          onKeyPress: handleKeyPress,
          dangerouslySetInnerHTML: innerHTML()
        });
      }
    }]);

    return ContentEditable;
  }(React.Component);
  ContentEditable.propTypes = {
    /** Value. */
    value: PropTypes.string,

    /** Placeholder. */
    placeholder: PropTypes.string,

    /** A input can show it is currently unable to be interacted with. */
    disabled: PropTypes.bool,

    /**
     * Sets focus element and caret at the end of input
     * when value is changed programmatically (e.g) from button click and element is not active
     */
    activateAfterChange: PropTypes.bool,

    /** Set focus after mount. */
    autoFocus: PropTypes.bool,

    /**
     * onChange handler<br>
     * @param {String} value
     */
    onChange: PropTypes.func,

    /**
     * onKeyPress handler<br>
     * @param {String} value
     */
    onKeyPress: PropTypes.func,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ContentEditable.defaultProps = {
    value: undefined,
    placeholder: "",
    disabled: false,
    activateAfterChange: false,
    autoFocus: false,
    onChange: function onChange() {},
    onKeyPress: function onKeyPress() {}
  };

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var _excluded$9 = ["fancyScroll", "children", "forwardedRef"],
      _excluded2 = ["value", "onSend", "onChange", "autoFocus", "placeholder", "fancyScroll", "className", "activateAfterChange", "disabled", "sendDisabled", "sendOnReturnDisabled", "attachDisabled", "sendButton", "attachButton", "onAttachClick"];

  function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray$3(arr, i) { return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$3(); }

  function _nonIterableRest$3() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

  function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$3(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$3(arr) { if (Array.isArray(arr)) return arr; }

  function _extends$9() { _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }

  function _objectWithoutProperties$9(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$9(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$9(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
  // it must be wrapped in additional container

  function editorContainer() {
    var Container = /*#__PURE__*/function (_Component) {
      _inherits(Container, _Component);

      var _super = _createSuper(Container);

      function Container() {
        _classCallCheck(this, Container);

        return _super.apply(this, arguments);
      }

      _createClass(Container, [{
        key: "render",
        value: function render() {
          var _this$props = this.props,
              fancyScroll = _this$props.fancyScroll,
              children = _this$props.children,
              forwardedRef = _this$props.forwardedRef,
              rest = _objectWithoutProperties$9(_this$props, _excluded$9);

          return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, fancyScroll === true && /*#__PURE__*/React__default["default"].createElement(ScrollBar, _extends$9({
            ref: function ref(elRef) {
              return forwardedRef.current = elRef;
            }
          }, rest, {
            options: {
              suppressScrollX: true
            }
          }), children), fancyScroll === false && /*#__PURE__*/React__default["default"].createElement("div", _extends$9({
            ref: forwardedRef
          }, rest), children));
        }
      }]);

      return Container;
    }(React.Component);

    return /*#__PURE__*/React__default["default"].forwardRef(function (props, ref) {
      return /*#__PURE__*/React__default["default"].createElement(Container, _extends$9({
        forwardedRef: ref
      }, props));
    });
  }

  var EditorContainer = editorContainer();

  var useControllableState = function useControllableState(value, initialValue) {
    var initial = typeof value !== "undefined" ? value : initialValue;

    var _useState = React.useState(initial),
        _useState2 = _slicedToArray$3(_useState, 2),
        stateValue = _useState2[0],
        setStateValue = _useState2[1];

    var effectiveValue = typeof value !== "undefined" ? value : stateValue;
    return [effectiveValue, function (newValue) {
      setStateValue(newValue);
    }];
  };

  function MessageInputInner(_ref, ref) {
    var value = _ref.value,
        onSend = _ref.onSend,
        onChange = _ref.onChange,
        autoFocus = _ref.autoFocus,
        placeholder = _ref.placeholder,
        fancyScroll = _ref.fancyScroll,
        className = _ref.className,
        activateAfterChange = _ref.activateAfterChange,
        disabled = _ref.disabled,
        sendDisabled = _ref.sendDisabled,
        sendOnReturnDisabled = _ref.sendOnReturnDisabled,
        attachDisabled = _ref.attachDisabled,
        sendButton = _ref.sendButton,
        attachButton = _ref.attachButton,
        onAttachClick = _ref.onAttachClick,
        rest = _objectWithoutProperties$9(_ref, _excluded2);

    var scrollRef = React.useRef();
    var msgRef = React.useRef();

    var _useControllableState = useControllableState(value, ""),
        _useControllableState2 = _slicedToArray$3(_useControllableState, 2),
        stateValue = _useControllableState2[0],
        setStateValue = _useControllableState2[1];

    var _useControllableState3 = useControllableState(sendDisabled, true),
        _useControllableState4 = _slicedToArray$3(_useControllableState3, 2),
        stateSendDisabled = _useControllableState4[0],
        setStateSendDisabled = _useControllableState4[1]; // Public API


    var focus = function focus() {
      if (typeof msgRef.current !== "undefined") {
        msgRef.current.focus();
      }
    }; // Return object with public Api


    React.useImperativeHandle(ref, function () {
      return {
        focus: focus
      };
    }); // Set focus

    React.useEffect(function () {
      if (autoFocus === true) {
        focus();
      }
    }, []); // Update scroll

    React.useEffect(function () {
      if (typeof scrollRef.current.updateScroll === "function") {
        scrollRef.current.updateScroll();
      }
    });

    var getContent = function getContent() {
      // Direct reference to contenteditable div
      var contentEditableRef = msgRef.current.msgRef.current;
      return [contentEditableRef.textContent, contentEditableRef.innerText, contentEditableRef.cloneNode(true).childNodes];
    };

    var send = function send() {
      if (stateValue.length > 0) {
        // Clear input only when it's uncontrolled mode
        if (value === undefined) {
          setStateValue("");
        } // Disable send button only when it's uncontrolled mode


        if (typeof sendDisabled === "undefined") {
          setStateSendDisabled(true);
        }

        var content = getContent();
        onSend(stateValue, content[0], content[1], content[2]);
      }
    };

    var handleKeyPress = function handleKeyPress(evt) {
      if (evt.key === "Enter" && evt.shiftKey === false && sendOnReturnDisabled === false) {
        evt.preventDefault();
        send();
      }
    };

    var handleChange = function handleChange(innerHTML, textContent, innerText) {
      setStateValue(innerHTML);

      if (typeof sendDisabled === "undefined") {
        setStateSendDisabled(textContent.length === 0);
      }

      if (typeof scrollRef.current.updateScroll === "function") {
        scrollRef.current.updateScroll();
      }

      var content = getContent();
      onChange(innerHTML, textContent, innerText, content[2]);
    };

    var cName = "".concat(prefix, "-message-input"),
        ph = typeof placeholder === "string" ? placeholder : "";
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$9({}, rest, {
      className: classNames(cName, _defineProperty$5({}, "".concat(cName, "--disabled"), disabled), className)
    }), attachButton === true && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__tools")
    }, /*#__PURE__*/React__default["default"].createElement(AttachmentButton, {
      onClick: onAttachClick,
      disabled: disabled === true || attachDisabled === true
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__content-editor-wrapper")
    }, /*#__PURE__*/React__default["default"].createElement(EditorContainer, {
      fancyScroll: fancyScroll,
      ref: scrollRef,
      className: "".concat(cName, "__content-editor-container")
    }, /*#__PURE__*/React__default["default"].createElement(ContentEditable, {
      ref: msgRef,
      className: "".concat(cName, "__content-editor"),
      disabled: disabled,
      placeholder: ph,
      onKeyPress: handleKeyPress,
      onChange: handleChange,
      activateAfterChange: activateAfterChange,
      value: stateValue
    }))), sendButton === true && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__tools")
    }, /*#__PURE__*/React__default["default"].createElement(SendButton, {
      onClick: send,
      disabled: disabled === true || stateSendDisabled === true
    })));
  }

  var MessageInput = /*#__PURE__*/React.forwardRef(MessageInputInner);
  MessageInput.displayName = "MessageInput";
  MessageInput.propTypes = {
    /** Value. */
    value: PropTypes.string,

    /** Placeholder. */
    placeholder: PropTypes.string,

    /** A input can show it is currently unable to be interacted with. */
    disabled: PropTypes.bool,

    /** Prevent that the input message is sent on a return press */
    sendOnReturnDisabled: PropTypes.bool,

    /** Send button can be disabled.<br>
     * It's state is tracked by component, but it can be forced */
    sendDisabled: PropTypes.bool,

    /**
     * Fancy scroll
     * This property is set in contructor, and is not changing when component update.
     */
    fancyScroll: PropTypes.bool,

    /**
     * Sets focus element and caret at the end of input<br>
     * when value is changed programmatically (e.g) from button click and element is not active
     */
    activateAfterChange: PropTypes.bool,

    /** Set focus after mount. */
    autoFocus: PropTypes.bool,

    /**
     * onChange handler<br>
     * @param {String} innerHtml
     * @param {String} textContent
     * @param {String} innerText
     * @param {NodeList} nodes
     */
    onChange: PropTypes.func,

    /**
     * onSend handler<br>
     * @param {String} innerHtml
     * @param {String} textContent
     * @param {String} innerText
     * @param {NodeList} nodes
     */
    onSend: PropTypes.func,

    /** Additional classes. */
    className: PropTypes.string,

    /** Show send button */
    sendButton: PropTypes.bool,

    /** Show add attachment button */
    attachButton: PropTypes.bool,

    /** Disable add attachment button */
    attachDisabled: PropTypes.bool,

    /**
     * onAttachClick handler
     */
    onAttachClick: PropTypes.func
  };
  MessageInputInner.propTypes = MessageInput.propTypes ;
  MessageInput.defaultProps = {
    value: undefined,
    placeholder: "",
    disabled: false,
    sendOnReturnDisabled: false,
    fancyScroll: true,
    activateAfterChange: false,
    autoFocus: false,
    sendButton: true,
    attachButton: true,
    attachDisabled: false,
    onAttachClick: noop$2,
    onChange: noop$2,
    onSend: noop$2
  };
  MessageInputInner.defaultProps = MessageInput.defaultProps;

  var _excluded$8 = ["className", "children"];

  function _extends$8() { _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }

  function _objectWithoutProperties$8(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$8(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$8(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var InputToolbox = function InputToolbox(_ref) {
    var className = _ref.className,
        children = _ref.children,
        rest = _objectWithoutProperties$8(_ref, _excluded$8);

    var cName = "".concat(prefix, "-input-toolbox");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$8({}, rest, {
      className: classNames(cName, className)
    }), children);
  };
  InputToolbox.displayName = "InputToolbox";
  InputToolbox.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  InputToolbox.defaultProps = {};

  var _excluded$7 = ["children", "className"];

  function _extends$7() { _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }

  function _slicedToArray$2(arr, i) { return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$2(); }

  function _nonIterableRest$2() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

  function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$2(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$2(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$7(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$7(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$7(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ChatContainer = function ChatContainer(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$7(_ref, _excluded$7);

    var cName = "".concat(prefix, "-chat-container");

    var _getChildren = getChildren(children, [ConversationHeader, MessageList, MessageInput, InputToolbox]),
        _getChildren2 = _slicedToArray$2(_getChildren, 4),
        header = _getChildren2[0],
        messageList = _getChildren2[1],
        messageInput = _getChildren2[2],
        inputToolbox = _getChildren2[3];

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$7({}, rest, {
      className: classNames(cName, className)
    }), header, messageList, messageInput, inputToolbox);
  };
  ChatContainer.propTypes = {
    /**
     * Primary content.
     * Allowed elements:
     *
     * * &lt;ConversationHeader /&gt;
     * * &lt;MessageList /&gt;
     * * &lt;MessageInput /&gt;
     * * &lt;InputToolbox /&gt;
     */
    children: allowedChildren([ConversationHeader, MessageList, MessageInput, InputToolbox]),

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ChatContainer.defaultProps = {
    children: undefined
  };

  var cName = "".concat(prefix, "-conversation");

  var _excluded$6 = ["children", "className", "visible"];

  function _extends$6() { _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }

  function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties$6(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$6(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$6(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ConversationOperations = function ConversationOperations(_ref) {
    var children = _ref.children,
        className = _ref.className,
        visible = _ref.visible,
        rest = _objectWithoutProperties$6(_ref, _excluded$6);

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$6({}, rest, {
      className: classNames("".concat(cName, "__operations"), _defineProperty$4({}, "".concat(cName, "__operations--visible"), visible), className)
    }), React__default["default"].Children.count(children) > 0 ? children : /*#__PURE__*/React__default["default"].createElement(FontAwesomeIcon, {
      icon: faEllipsisV.faEllipsisV
    }));
  };
  ConversationOperations.displayName = "Conversation.Operations";
  ConversationOperations.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /** Always visible not only on hover */
    visible: PropTypes.bool
  } ;
  ConversationOperations.defaultProps = {};

  var _excluded$5 = ["lastSenderName", "info", "name", "children", "className"];

  function _extends$5() { _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }

  function _objectWithoutProperties$5(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$5(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$5(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  var LastSenderName = function LastSenderName(_ref) {
    var name = _ref.name;
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__last-sender")
    }, name), ":");
  };

  LastSenderName.propTypes = {
    name: PropTypes.node
  } ;

  var InfoContent = function InfoContent(_ref2) {
    var info = _ref2.info;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__info-content")
    }, info);
  };

  InfoContent.propTypes = {
    info: PropTypes.node
  } ;
  var ConversationContent = function ConversationContent(_ref3) {
    var lastSenderName = _ref3.lastSenderName,
        info = _ref3.info,
        name = _ref3.name,
        children = _ref3.children,
        className = _ref3.className,
        rest = _objectWithoutProperties$5(_ref3, _excluded$5);

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$5({}, rest, {
      className: classNames("".concat(cName, "__content"), className)
    }), React__default["default"].Children.count(children) > 0 ? children : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__name")
    }, name), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__info")
    }, typeof lastSenderName === "string" && /*#__PURE__*/React__default["default"].createElement(LastSenderName, {
      name: lastSenderName
    }), " ", typeof info !== "undefined" && /*#__PURE__*/React__default["default"].createElement(InfoContent, {
      info: info
    }))));
  };
  ConversationContent.displayName = "Conversation.Content";
  ConversationContent.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /** First text line - contact name etc. */
    name: PropTypes.node,

    /** Last sender name. */
    lastSenderName: PropTypes.node,

    /** Informational message / last message. */
    info: PropTypes.node
  } ;
  ConversationContent.defaultProps = {};

  var _excluded$4 = ["name", "unreadCnt", "lastSenderName", "info", "lastActivityTime", "unreadDot", "children", "className", "active"];

  function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }

  function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1(); }

  function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$1(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$4(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$4(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$4(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  var LastActivityTime = function LastActivityTime(_ref) {
    var time = _ref.time;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__last-activity-time"),
      title: time
    }, time);
  };

  var UnreadDot = function UnreadDot() {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__unread-dot")
    });
  };

  var Conversation = function Conversation(_ref2) {
    var name = _ref2.name,
        unreadCnt = _ref2.unreadCnt,
        lastSenderName = _ref2.lastSenderName,
        info = _ref2.info,
        lastActivityTime = _ref2.lastActivityTime,
        unreadDot = _ref2.unreadDot,
        children = _ref2.children,
        className = _ref2.className,
        active = _ref2.active,
        rest = _objectWithoutProperties$4(_ref2, _excluded$4);

    var _getChildren = getChildren(children, [Avatar, AvatarGroup, ConversationOperations, ConversationContent]),
        _getChildren2 = _slicedToArray$1(_getChildren, 4),
        avatar = _getChildren2[0],
        avatarGroup = _getChildren2[1],
        operations = _getChildren2[2],
        content = _getChildren2[3];

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$4({}, rest, {
      className: classNames(cName, _defineProperty$3({}, "".concat(cName, "--active"), active), className)
    }), avatar, avatarGroup, (typeof name !== "undefined" || typeof lastSenderName !== "undefined" || typeof info !== "undefined") && /*#__PURE__*/React__default["default"].createElement(ConversationContent, {
      name: name,
      lastSenderName: lastSenderName,
      info: info
    }), (typeof name === "undefined" || name === null) && (typeof lastSenderName === "undefined" || lastSenderName === null) && (typeof info === "undefined" || info === null) && content, lastActivityTime !== null && typeof lastActivityTime !== "undefined" && /*#__PURE__*/React__default["default"].createElement(LastActivityTime, {
      time: lastActivityTime
    }), unreadDot && /*#__PURE__*/React__default["default"].createElement(UnreadDot, null), operations, unreadCnt !== null && typeof unreadCnt !== "undefined" && parseInt(unreadCnt) > 0 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__unread"),
      title: unreadCnt
    }, unreadCnt));
  };
  Conversation.propTypes = {
    /**
     * Primary content.
     * Allowed node:
     *
     * * &lt;Avatar /&gt;
     * * &lt;AvatarGroup /&gt;
     * * &lt;Conversation.Content /&gt;
     * * &lt;Conversation.Operations /&gt;
     */
    children: allowedChildren([Avatar, AvatarGroup, ConversationOperations, ConversationContent]),

    /** First text line in &lt;Conversation.Content /&gt; contact name etc. */
    name: PropTypes.node,

    /** Unread messages quantity. */
    unreadCnt: PropTypes.number,

    /** Unread dot visible. */
    unreadDot: PropTypes.bool,

    /** Last sender in &lt;Conversation.Content /&gt; name. */
    lastSenderName: PropTypes.node,

    /** Informational message / last message in &lt;Conversation.Content /&gt;. */
    info: PropTypes.node,

    /** Last activity time. */
    lastActivityTime: PropTypes.node,

    /** Active (currently viewed) */
    active: PropTypes.bool,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  Conversation.defaultProps = {
    name: undefined,
    unreadCnt: undefined,
    unreadDot: false,
    lastSenderName: undefined,
    info: undefined,
    lastActivityTime: undefined,
    active: false
  };
  Conversation.Operations = ConversationOperations;
  Conversation.Content = ConversationContent;

  var _excluded$3 = ["children", "scrollable", "loading", "loadingMore", "onYReachEnd", "className"];

  function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

  function _objectWithoutProperties$3(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$3(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$3(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var ConversationList = function ConversationList(_ref) {
    var children = _ref.children,
        scrollable = _ref.scrollable,
        loading = _ref.loading,
        loadingMore = _ref.loadingMore,
        onYReachEnd = _ref.onYReachEnd,
        className = _ref.className,
        props = _objectWithoutProperties$3(_ref, _excluded$3);

    var cName = "".concat(prefix, "-conversation-list"); // Memoize, to avoid re-render each time when props (children) changed

    var Tag = React.useMemo(function () {
      return function (_ref2) {
        var children = _ref2.children;

        // PerfectScrollbar for now cant be disabled, so render div instead of disabling it
        // https://github.com/goldenyz/react-perfect-scrollbar/issues/107
        if (scrollable === false || scrollable === true && loading === true) {
          return /*#__PURE__*/React__default["default"].createElement("div", null, loading && /*#__PURE__*/React__default["default"].createElement(Overlay, null, /*#__PURE__*/React__default["default"].createElement(Loader, null)), children);
        } else {
          return /*#__PURE__*/React__default["default"].createElement(ScrollBar, {
            onYReachEnd: onYReachEnd,
            options: {
              suppressScrollX: true
            }
          }, children);
        }
      };
    }, [scrollable, loading]);
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$3({
      className: classNames(cName, className)
    }, props), /*#__PURE__*/React__default["default"].createElement(Tag, null, React__default["default"].Children.count(children) > 0 && /*#__PURE__*/React__default["default"].createElement("ul", null, React__default["default"].Children.map(children, function (item) {
      return /*#__PURE__*/React__default["default"].createElement("li", null, item);
    }))), loadingMore && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "".concat(cName, "__loading-more")
    }, /*#__PURE__*/React__default["default"].createElement(Loader, null)));
  };
  ConversationList.propTypes = {
    /**
     * Primary content.
     * Allowed components:
     *
     * * &lt;Conversation /&gt;
     *
     */
    children: allowedChildren([Conversation]),

    /** Init scrollbar flag. */
    scrollable: PropTypes.bool,

    /** Loading flag. */
    loading: PropTypes.bool,

    /** Loading more flag for infinity scroll. */
    loadingMore: PropTypes.bool,

    /**
     * This is fired when the scrollbar reaches the end on the y axis.<br/>
     * It can be used to load next conversations using the infinite scroll.
     */
    onYReachEnd: PropTypes.func,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  ConversationList.defaultProps = {
    children: [],
    scrollable: true,
    loading: false,
    loadingMore: false,
    className: ""
  };

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Title. */
    title: PropTypes.string,

    /** Default open state. */
    open: PropTypes.bool,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  var _excluded$2 = ["responsive", "children", "className"];

  function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

  function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties$2(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$2(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$2(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  var MainContainer = function MainContainer(_ref) {
    var responsive = _ref.responsive,
        children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties$2(_ref, _excluded$2);

    var cName = "".concat(prefix, "-main-container");
    return /*#__PURE__*/React__default["default"].createElement("div", _extends$2({}, rest, {
      className: classNames(cName, _defineProperty$2({}, "".concat(cName, "--responsive"), responsive), className)
    }), children);
  };
  MainContainer.propTypes = {
    /** Primary content. */
    children: PropTypes.node,

    /** Is container responsive. */
    responsive: PropTypes.bool,

    /** Additional classes. */
    className: PropTypes.string
  } ;
  MainContainer.defaultProps = {
    children: undefined,
    responsive: false
  };

  /*!
   * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   */
  var faSearch = {
    prefix: 'fas',
    iconName: 'search',
    icon: [512, 512, [], "f002", "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"]
  };
  var faTimes = {
    prefix: 'fas',
    iconName: 'times',
    icon: [352, 512, [], "f00d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]
  };

  var _excluded$1 = ["placeholder", "value", "onChange", "onClearClick", "className", "disabled"];

  function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

  function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _objectWithoutProperties$1(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$1(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$1(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  var useControlledOrNot = function useControlledOrNot(initialValue, value) {
    if (typeof value === "undefined") {
      // Uncontrolled
      return React.useState(initialValue);
    } else {
      // Controlled
      return [value, function () {}];
    }
  };

  function SearchInner(_ref, ref) {
    var placeholder = _ref.placeholder,
        value = _ref.value,
        onChange = _ref.onChange,
        onClearClick = _ref.onClearClick,
        className = _ref.className,
        disabled = _ref.disabled,
        rest = _objectWithoutProperties$1(_ref, _excluded$1);

    var cName = "".concat(prefix, "-search");
    var isControlled = React.useMemo(function () {
      return typeof value !== "undefined";
    }, []);

    var _useControlledOrNot = useControlledOrNot("", value),
        _useControlledOrNot2 = _slicedToArray(_useControlledOrNot, 2),
        searchValue = _useControlledOrNot2[0],
        setSearchValue = _useControlledOrNot2[1];

    var _useState = React.useState(isControlled ? searchValue.length > 0 : false),
        _useState2 = _slicedToArray(_useState, 2),
        clearActive = _useState2[0],
        setClearActive = _useState2[1];

    if (isControlled !== (typeof value !== "undefined")) {
      throw "Search: Changing from controlled to uncontrolled component and vice versa is not allowed";
    }

    var inputRef = React.useRef(undefined); // Public API

    var focus = function focus() {
      if (typeof inputRef.current !== "undefined") {
        inputRef.current.focus();
      }
    }; // Return object with public Api


    React.useImperativeHandle(ref, function () {
      return {
        focus: focus
      };
    });

    var handleChange = function handleChange(e) {
      var value = e.target.value;
      setClearActive(value.length > 0);

      if (isControlled === false) {
        setSearchValue(value);
      }

      onChange(value);
    };

    var handleClearClick = function handleClearClick() {
      if (isControlled === false) {
        setSearchValue("");
      }

      setClearActive(false);
      onClearClick();
    };

    return /*#__PURE__*/React__default["default"].createElement("div", _extends$1({}, rest, {
      className: classNames(cName, _defineProperty$1({}, "".concat(cName, "--disabled"), disabled), className)
    }), /*#__PURE__*/React__default["default"].createElement(FontAwesomeIcon, {
      icon: faSearch,
      className: "".concat(cName, "__search-icon")
    }), /*#__PURE__*/React__default["default"].createElement("input", {
      ref: inputRef,
      type: "text",
      className: "".concat(cName, "__input"),
      placeholder: placeholder,
      onChange: handleChange,
      disabled: disabled,
      value: searchValue
    }), /*#__PURE__*/React__default["default"].createElement(FontAwesomeIcon, {
      icon: faTimes,
      className: classNames("".concat(cName, "__clear-icon"), _defineProperty$1({}, "".concat(cName, "__clear-icon--active"), clearActive)),
      onClick: handleClearClick
    }));
  }

  var Search = /*#__PURE__*/React.forwardRef(SearchInner);
  Search.displayName = "Search";
  Search.propTypes = {
    /** Placeholder. */
    placeholder: PropTypes.string,

    /** Current value of the search input. Creates a controlled component */
    value: PropTypes.string,

    /** OnInput handler. */
    onChange: PropTypes.func,

    /** OnClearClick handler. */
    onClearClick: PropTypes.func,

    /** Additional classes. */
    className: PropTypes.string,

    /** Disabled */
    disabled: PropTypes.bool
  };
  SearchInner.propTypes = Search.propTypes ;
  Search.defaultProps = {
    placeholder: "",
    value: undefined,
    onChange: function onChange() {},
    onClearClick: function onClearClick() {},
    disabled: false
  };
  SearchInner.defaultProps = Search.defaultProps;

  ({
    /** Primary content. */
    children: PropTypes.node,

    /** Sidebar can be placed on two positions */
    position: PropTypes.oneOf(["left", "right"]),

    /** Sidebar can be scrollable */
    scrollable: PropTypes.bool,

    /** Loading flag. */
    loading: PropTypes.bool,

    /** Additional classes. */
    className: PropTypes.string
  }) ;

  ({
    /** Indicator content. */
    content: propTypes.exports.PropTypes.node,

    /** Additional classes. */
    className: propTypes.exports.PropTypes.string
  }) ;

  var _excluded = ["className", "children", "size", "selected", "onChange", "itemsTabIndex"];

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function StatusListInner(_ref, ref) {
    var className = _ref.className,
        children = _ref.children,
        size = _ref.size,
        selected = _ref.selected,
        onChange = _ref.onChange,
        itemsTabIndex = _ref.itemsTabIndex,
        rest = _objectWithoutProperties(_ref, _excluded);

    var cName = "".concat(prefix, "-status-list");
    var listRef = React.useRef(); // Return object with public Api

    React.useImperativeHandle(ref, function () {
      return {
        focus: function focus(idx) {
          var items = Array.from(listRef.current.querySelectorAll("li")); // For sure filter only direct children because querySelectorAll cant get only direct children

          var directChild = items.filter(function (item) {
            return item.parentNode === listRef.current;
          });

          if (typeof directChild[idx] !== "undefined") {
            directChild[idx].focus();
          }
        }
      };
    });
    var tabIndex = itemsTabIndex;
    return /*#__PURE__*/React__default["default"].createElement("ul", _extends({
      ref: listRef
    }, rest, {
      className: classNames(cName, className, _defineProperty({}, "".concat(cName, "--").concat(size), size))
    }), React__default["default"].Children.map(children, function (item) {
      // If active argument is set, clear active flag for all elements except desired
      var newProps = {};

      if (selected) {
        newProps.selected = item.props.status === selected;
      }

      if (onChange) {
        newProps.onClick = function (evt) {
          onChange(item.props.status);

          if (item.onClick) {
            item.onClick(evt);
          }
        };
      }

      var onKeyPress = function onKeyPress(evt) {
        if (onChange) {
          if (evt.key === "Enter" && evt.shiftKey === false && evt.altKey === false) {
            onChange(item.props.status);
          }
        }
      };

      var tIndex = function () {
        if (typeof tabIndex === "number") {
          if (tabIndex > 0) {
            return tabIndex++;
          } else {
            return tabIndex;
          }
        } else {
          return undefined;
        }
      }();

      return /*#__PURE__*/React__default["default"].createElement("li", {
        tabIndex: tIndex,
        onKeyPress: onKeyPress
      }, /*#__PURE__*/React__default["default"].cloneElement(item, newProps));
    }));
  }

  var StatusList = /*#__PURE__*/React.forwardRef(StatusListInner);
  StatusList.displayName = "StatusList";
  StatusList.propTypes = {
    /**
     * Primary content.
     * Allowed components:
     *
     * * &lt;Status /&gt;
     */
    children: allowedChildren([Status]),

    /** Selected element */
    selected: PropTypes.oneOf(StatusEnum),

    /** Size */
    size: PropTypes.oneOf(SizeEnum),

    /** tabindex value for items. Any positive integer will be treated as start index for counting. Zero and negative values will be applied to all items */
    itemsTabIndex: PropTypes.number,

    /** Additional classes. */
    className: PropTypes.string,

    /** onChange handler */
    onChange: PropTypes.func
  };
  StatusListInner.propTypes = StatusList.propTypes ;
  StatusList.defaultProps = {
    onChange: noop$2
  };
  StatusListInner.defaultProps = StatusList.defaultProps;

  class Room$1 {
      constructor(name) {
          this.messages = [];
          this.name = name;
      }

      addMessage(message) {
          this.messages.push(message);
      }

      get lastMessage() {
          return this.messages[this.messages.length - 1];
      }
  }

  class Message {
      constructor({ message, date, sender }) {
          this.message = message;
          this.date = date || new Date();
          this.sender = sender || "self";
          this.direction = this.sender === "self" ? "outgoing" : "incoming";
      }

      get timeElapsed() {
          return new Date() - this.date;
      }
  }

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  class MatrixStub {
      createClient() {
          const handlers = {};
          return {
              once(command) {
                  if (command !== "sync") throw `Unknown command: ${command}`;
                  return { state: "PREPARED" };
              },
              on(event, handler) {
                  handlers[event] = handler;
              },
              startClient() {
                  return Object.entries({
                      "Alfred": [
                          {
                              sender: "self",
                              content: "Hi Alfred, what's up?",
                              date: "Thu Jun 02 2022 14:59:30 GMT+0200 (Central European Summer Time)",
                          },
                          {
                              sender: "Alfred",
                              content: "Hello who is this please?",
                              date: "Thu Jun 02 2022 15:01:30 GMT+0200 (Central European Summer Time)",
                          },
                          {
                              sender: "Alfred",
                              content: "Hello???",
                              date: "Thu Jun 02 2022 15:15:30 GMT+0200 (Central European Summer Time)",
                          },
                          {
                              sender: "self",
                              content: "Hello",
                              date: "Thu Jun 02 2022 15:18:30 GMT+0200 (Central European Summer Time)",
                          },
                          {
                              sender: "Alfred",
                              content: "Hello...",
                              date: "Thu Jun 02 2022 15:20:30 GMT+0200 (Central European Summer Time)",
                          },
                      ],
                  }).forEach(function ([room, messages]) {
                      messages.forEach(function ({ sender, content, date }) {
                          _optionalChain$1([handlers, 'access', _ => _["Room.timeline"], 'optionalCall', _2 => _2(
                              {
                                  getType: () => "m.room.message",
                                  getSender: () => sender,
                                  getContent: () => ({ body: content }),
                                  getDate: () => new Date(date),
                              },
                              { name: room },
                              false
                          )]);
                      });
                  });
              },
          };
      }
  }

  const matrix = window.pod.matrix || new MatrixStub();

  function findOrCreateRoom(rooms, name) {
      if (!(name in rooms)) rooms[name] = new Room$1(name);
      return rooms[name];
  }

  async function initializeClient(rooms, setRooms) {
      const client = matrix.createClient("https://matrix.polypoly.tech");
      client.on("Room.timeline", function (event, room, toStartOfTimeline) {
          if (event.getType() !== "m.room.message") {
              return; // only use messages
          }
          findOrCreateRoom(rooms, room.name).addMessage(
              new Message({
                  sender: event.getSender(),
                  message: event.getContent().body,
                  date: event.getDate(),
              })
          );
          setRooms({ ...rooms });
      });
      await client.startClient({ initialSyncLimit: 10 });
      const { state, prevState, res } = await client.once("sync");
      if (state !== "PREPARED")
          throw `Failed to initialise Matrix client, state is ${state}`;
  }

  const MessagesContext = React__default["default"].createContext();

  function updatePodNavigation(pod, history, handleBack) {
      pod.polyNav.actions = {
          back: () => handleBack(),
      };
      history.length > 1
          ? pod.polyNav.setActiveActions(["back"])
          : pod.polyNav.setActiveActions([]);
  }

  const MessagesContextProvider = ({ children }) => {
      const [pod, setPod] = React.useState(null);
      const [rooms, setRooms] = React.useState({});
      const [activeRoom, setActiveRoom] = React.useState(null);

      const history = useHistory();

      const handleSelectRoom = (room) => {
          setActiveRoom(room);
          history.push("/room");
      };

      const handleBack = () => {
          history.goBack();
      };

      const handleSendMessage = (message) => {
          // TODO: Don't fake this
          activeRoom.addMessage(
              new Message({ message: message, date: new Date(), sender: "self" })
          );
          setActiveRoom({ ...activeRoom });
      };

      const initPod = async () => await window.pod;

      //on startup
      React.useEffect(() => {
          initPod().then((newPod) => {
              setPod(newPod);
              initializeClient(rooms, setRooms);
          });
      }, []);

      React.useEffect(() => {
          if (!pod) return;
          updatePodNavigation(pod, history, handleBack);
      });

      return (
          React__default["default"].createElement(MessagesContext.Provider, {
              value: {
                  rooms,
                  handleSelectRoom,
                  handleBack,
                  activeRoom,
                  handleSendMessage,
              },}
          
              , children
          )
      );
  };

  const Home = () => {
      const { rooms, handleSelectRoom } = React.useContext(MessagesContext);

      return (
          React__default["default"].createElement(polyLook.Screen, { className: "poly-theme-light",}
              , React__default["default"].createElement(ConversationList, null
                  , Object.entries(rooms).map(([name, room], i) => (
                      React__default["default"].createElement(Conversation, {
                          key: i,
                          name: name,
                          lastSenderName: room.lastMessage.sender,
                          info: room.lastMessage.message,
                          onClick: () => handleSelectRoom(room),}
                      
                          , React__default["default"].createElement(Avatar, { src: "images/thorsten.png", name: "Thorsten",} )
                      )
                  ))
              )
          )
      );
  };

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  const Room = () => {
      const { activeRoom, handleSendMessage } = React.useContext(MessagesContext);

      const otherPersonsName = activeRoom.messages.filter(
          (message) => message.sender !== "self"
      )[0].sender;

      function groupMessages() {
          const messages = activeRoom.messages;
          const messageGroups = [];
          for (let i = 0; i < messages.length; i++) {
              const currentMessage = messages[i];
              const currentSender = currentMessage.sender;
              const messagesToGroup = [];
              while (currentSender == _optionalChain([messages, 'access', _ => _[i], 'optionalAccess', _2 => _2.sender])) {
                  messagesToGroup.push(messages[i]);
                  i++;
              }
              i--;
              messageGroups.push(
                  React__default["default"].createElement(MessageGroup, {
                      key: i,
                      direction: currentMessage.direction,
                      sender: currentSender,
                      sentTime: "just now" ,}
                  
                      , React__default["default"].createElement(MessageGroup.Messages, null
                          , messagesToGroup.map((message, index) => (
                              React__default["default"].createElement(Message$1, {
                                  key: index,
                                  model: {
                                      message: message.message,
                                  },}
                              )
                          ))
                      )
                      , React__default["default"].createElement(MessageGroup.Footer, null, currentSender)
                  )
              );
          }
          return messageGroups;
      }

      return (
          React__default["default"].createElement(polyLook.Screen, { className: "poly-theme-light room" ,}
              , React__default["default"].createElement(ConversationHeader, null
                  , React__default["default"].createElement(Avatar, { src: "images/thorsten.png", name: "Thorsten",} )
                  , React__default["default"].createElement(ConversationHeader.Content, {
                      userName: otherPersonsName,
                      info: "Active 10 mins ago"   ,}
                  )
              )
              , React__default["default"].createElement(MainContainer, null
                  , React__default["default"].createElement(ChatContainer, null
                      , React__default["default"].createElement(MessageList, null
                          , groupMessages().map((message) => message)
                      )
                      , React__default["default"].createElement(MessageInput, {
                          placeholder: "Type message here"  ,
                          attachButton: false,
                          onSend: handleSendMessage,}
                      )
                  )
              )
          )
      );
  };

  const PolyTalk = () => {
      React.useContext(MessagesContext);
      return (
          React__default["default"].createElement('div', { className: "poly-talk poly-theme poly-theme-dark"  ,}
              , React__default["default"].createElement(Switch, null
                  , React__default["default"].createElement(Route, { exact: true, path: "/",}
                      , React__default["default"].createElement(Redirect, { to: { pathname: "/home" },} )
                  )
                  , React__default["default"].createElement(Route, { exact: true, path: "/home",}
                      , React__default["default"].createElement(Home, null )
                  )
                  , React__default["default"].createElement(Route, { exact: true, path: "/room",}
                      , React__default["default"].createElement(Room, null )
                  )
              )
          )
      );
  };

  //Router and context
  const PolyTalkApp = () => {
      //global history object
      const history = useHistory();

      return (
          React__default["default"].createElement(MemoryRouter, { history: history,}
              , React__default["default"].createElement(MessagesContextProvider, null
                  , React__default["default"].createElement('div', { className: "poly-nav-bar-separator-overlay",} )
                  , React__default["default"].createElement(PolyTalk, null )
              )
          )
      );
  };

  //render to html
  ReactDOM__namespace.render(React__default["default"].createElement(PolyTalkApp, null ), document.getElementById("feature"));

})(React, ReactDOM, polyLook);
