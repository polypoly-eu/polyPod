(function (React, ReactDOM, uuid, reactRouterDom) {
'use strict';

var React__default = 'default' in React ? React['default'] : React;

function _objectWithoutPropertiesLoose(source, excluded) {
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

var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
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

var objectWithoutProperties = _objectWithoutProperties;

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

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _defineProperty(obj, key, value) {
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

var defineProperty = _defineProperty;

/**
 * This file automatically generated from `pre-publish.js`.
 * Do not manually edit.
 */

var voidElements = {
  "area": true,
  "base": true,
  "br": true,
  "col": true,
  "embed": true,
  "hr": true,
  "img": true,
  "input": true,
  "keygen": true,
  "link": true,
  "menuitem": true,
  "meta": true,
  "param": true,
  "source": true,
  "track": true,
  "wbr": true
};

var attrRE = /([\w-]+)|=|(['"])([.\s\S]*?)\2/g;


var parseTag = function (tag) {
    var i = 0;
    var key;
    var expectingValueAfterEquals = true;
    var res = {
        type: 'tag',
        name: '',
        voidElement: false,
        attrs: {},
        children: []
    };

    tag.replace(attrRE, function (match) {
        if (match === '=') {
            expectingValueAfterEquals = true;
            i++;
            return;
        }

        if (!expectingValueAfterEquals) {
            if (key) {
                res.attrs[key] = key; // boolean attribute
            }
            key=match;
        } else {
            if (i === 0) {
                if (voidElements[match] || tag.charAt(tag.length - 2) === '/') {
                    res.voidElement = true;
                }
                res.name = match;
            } else {
                res.attrs[key] = match.replace(/^['"]|['"]$/g, '');
                key=undefined;
            }
        }
        i++;
        expectingValueAfterEquals = false;
    });

    return res;
};

/*jshint -W030 */
var tagRE = /(?:<!--[\S\s]*?-->|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)/g;

// re-used obj for quick lookups of components
var empty = Object.create ? Object.create(null) : {};
// common logic for pushing a child node onto a list
function pushTextNode(list, html, level, start, ignoreWhitespace) {
    // calculate correct end of the content slice in case there's
    // no tag after the text node.
    var end = html.indexOf('<', start);
    var content = html.slice(start, end === -1 ? undefined : end);
    // if a node is nothing but whitespace, collapse it as the spec states:
    // https://www.w3.org/TR/html4/struct/text.html#h-9.1
    if (/^\s*$/.test(content)) {
        content = ' ';
    }
    // don't add whitespace-only text nodes if they would be trailing text nodes
    // or if they would be leading whitespace-only text nodes:
    //  * end > -1 indicates this is not a trailing text node
    //  * leading node is when level is -1 and list has length 0
    if ((!ignoreWhitespace && end > -1 && level + list.length >= 0) || content !== ' ') {
        list.push({
            type: 'text',
            content: content
        });
    }
}

var parse = function parse(html, options) {
    options || (options = {});
    options.components || (options.components = empty);
    var result = [];
    var current;
    var level = -1;
    var arr = [];
    var byTag = {};
    var inComponent = false;

    html.replace(tagRE, function (tag, index) {
        if (inComponent) {
            if (tag !== ('</' + current.name + '>')) {
                return;
            } else {
                inComponent = false;
            }
        }

        var isOpen = tag.charAt(1) !== '/';
        var isComment = tag.indexOf('<!--') === 0;
        var start = index + tag.length;
        var nextChar = html.charAt(start);
        var parent;

        if (isOpen && !isComment) {
            level++;

            current = parseTag(tag);
            if (current.type === 'tag' && options.components[current.name]) {
                current.type = 'component';
                inComponent = true;
            }

            if (!current.voidElement && !inComponent && nextChar && nextChar !== '<') {
                pushTextNode(current.children, html, level, start, options.ignoreWhitespace);
            }

            byTag[current.tagName] = current;

            // if we're at root, push new base node
            if (level === 0) {
                result.push(current);
            }

            parent = arr[level - 1];

            if (parent) {
                parent.children.push(current);
            }

            arr[level] = current;
        }

        if (isComment || !isOpen || current.voidElement) {
            if (!isComment) {
                level--;
            }
            if (!inComponent && nextChar !== '<' && nextChar) {
                // trailing text node
                // if we're at the root, push a base text node. otherwise add as
                // a child to the current node.
                parent = level === -1 ? result : arr[level].children;
                pushTextNode(parent, html, level, start, options.ignoreWhitespace);
            }
        }
    });

    // If the "html" passed isn't actually html, add it as a text node.
    if (!result.length && html.length) {
        pushTextNode(result, html, 0, 0, options.ignoreWhitespace);
    }

    return result;
};

function attrString(attrs) {
    var buff = [];
    for (var key in attrs) {
        buff.push(key + '="' + attrs[key] + '"');
    }
    if (!buff.length) {
        return '';
    }
    return ' ' + buff.join(' ');
}

function stringify(buff, doc) {
    switch (doc.type) {
    case 'text':
        return buff + doc.content;
    case 'tag':
        buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>');
        if (doc.voidElement) {
            return buff;
        }
        return buff + doc.children.reduce(stringify, '') + '</' + doc.name + '>';
    }
}

var stringify_1 = function (doc) {
    return doc.reduce(function (token, rootEl) {
        return token + stringify('', rootEl);
    }, '');
};

var htmlParseStringify2 = {
    parse: parse,
    stringify: stringify_1
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

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
  return Constructor;
}

var createClass = _createClass;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var defaultOptions = {
  bindI18n: 'languageChanged',
  bindI18nStore: '',
  transEmptyNodeValue: '',
  transSupportBasicHtmlNodes: true,
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  useSuspense: true
};
var i18nInstance;
var I18nContext = React__default.createContext();
function setDefaults() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  defaultOptions = _objectSpread({}, defaultOptions, {}, options);
}
function getDefaults() {
  return defaultOptions;
}
var ReportNamespaces = function () {
  function ReportNamespaces() {
    classCallCheck(this, ReportNamespaces);

    this.usedNamespaces = {};
  }

  createClass(ReportNamespaces, [{
    key: "addUsedNamespaces",
    value: function addUsedNamespaces(namespaces) {
      var _this = this;

      namespaces.forEach(function (ns) {
        if (!_this.usedNamespaces[ns]) _this.usedNamespaces[ns] = true;
      });
    }
  }, {
    key: "getUsedNamespaces",
    value: function getUsedNamespaces() {
      return Object.keys(this.usedNamespaces);
    }
  }]);

  return ReportNamespaces;
}();
function setI18n(instance) {
  i18nInstance = instance;
}
function getI18n() {
  return i18nInstance;
}
var initReactI18next = {
  type: '3rdParty',
  init: function init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  }
};

function warn() {
  if (console && console.warn) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (typeof args[0] === 'string') args[0] = "react-i18next:: ".concat(args[0]);

    (_console = console).warn.apply(_console, args);
  }
}
var alreadyWarned = {};
function warnOnce() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
  if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
  warn.apply(void 0, args);
}
function loadNamespaces(i18n, ns, cb) {
  i18n.loadNamespaces(ns, function () {
    if (i18n.isInitialized) {
      cb();
    } else {
      var initialized = function initialized() {
        setTimeout(function () {
          i18n.off('initialized', initialized);
        }, 0);
        cb();
      };

      i18n.on('initialized', initialized);
    }
  });
}
function hasLoadedNamespace(ns, i18n) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!i18n.languages || !i18n.languages.length) {
    warnOnce('i18n.languages were undefined or empty', i18n.languages);
    return true;
  }

  var lng = i18n.languages[0];
  var fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
  var lastLng = i18n.languages[i18n.languages.length - 1];
  if (lng.toLowerCase() === 'cimode') return true;

  var loadNotPending = function loadNotPending(l, n) {
    var loadState = i18n.services.backendConnector.state["".concat(l, "|").concat(n)];
    return loadState === -1 || loadState === 2;
  };

  if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18n.services.backendConnector.backend && i18n.isLanguageChangingTo && !loadNotPending(i18n.isLanguageChangingTo, ns)) return false;
  if (i18n.hasResourceBundle(lng, ns)) return true;
  if (!i18n.services.backendConnector.backend) return true;
  if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
  return false;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function hasChildren(node, checkLength) {
  if (!node) return false;
  var base = node.props ? node.props.children : node.children;
  if (checkLength) return base.length > 0;
  return !!base;
}

function getChildren(node) {
  if (!node) return [];
  return node && node.children ? node.children : node.props && node.props.children;
}

function hasValidReactChildren(children) {
  if (Object.prototype.toString.call(children) !== '[object Array]') return false;
  return children.every(function (child) {
    return React__default.isValidElement(child);
  });
}

function getAsArray(data) {
  return Array.isArray(data) ? data : [data];
}

function mergeProps(source, target) {
  var newTarget = _objectSpread$1({}, target);

  newTarget.props = Object.assign(source.props, target.props);
  return newTarget;
}

function nodesToString(children, i18nOptions) {
  if (!children) return '';
  var stringNode = '';
  var childrenArray = getAsArray(children);
  var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  childrenArray.forEach(function (child, childIndex) {
    if (typeof child === 'string') {
      stringNode += "".concat(child);
    } else if (React__default.isValidElement(child)) {
      var childPropsCount = Object.keys(child.props).length;
      var shouldKeepChild = keepArray.indexOf(child.type) > -1;
      var childChildren = child.props.children;

      if (!childChildren && shouldKeepChild && childPropsCount === 0) {
        stringNode += "<".concat(child.type, "/>");
      } else if (!childChildren && (!shouldKeepChild || childPropsCount !== 0)) {
        stringNode += "<".concat(childIndex, "></").concat(childIndex, ">");
      } else if (child.props.i18nIsDynamicList) {
        stringNode += "<".concat(childIndex, "></").concat(childIndex, ">");
      } else if (shouldKeepChild && childPropsCount === 1 && typeof childChildren === 'string') {
        stringNode += "<".concat(child.type, ">").concat(childChildren, "</").concat(child.type, ">");
      } else {
        var content = nodesToString(childChildren, i18nOptions);
        stringNode += "<".concat(childIndex, ">").concat(content, "</").concat(childIndex, ">");
      }
    } else if (_typeof_1(child) === 'object') {
      var format = child.format,
          clone = objectWithoutProperties(child, ["format"]);

      var keys = Object.keys(clone);

      if (keys.length === 1) {
        var value = format ? "".concat(keys[0], ", ").concat(format) : keys[0];
        stringNode += "{{".concat(value, "}}");
      } else {
        warn("react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.", child);
      }
    } else {
      warn("Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.", child);
    }
  });
  return stringNode;
}

function renderNodes(children, targetString, i18n, i18nOptions, combinedTOpts) {
  if (targetString === '') return [];
  var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  var emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.join('|')).test(targetString);
  if (!children && !emptyChildrenButNeedsHandling) return [targetString];
  var data = {};

  function getData(childs) {
    var childrenArray = getAsArray(childs);
    childrenArray.forEach(function (child) {
      if (typeof child === 'string') return;
      if (hasChildren(child)) getData(getChildren(child));else if (_typeof_1(child) === 'object' && !React__default.isValidElement(child)) Object.assign(data, child);
    });
  }

  getData(children);
  var interpolatedString = i18n.services.interpolator.interpolate(targetString, _objectSpread$1({}, data, {}, combinedTOpts), i18n.language);
  var ast = htmlParseStringify2.parse("<0>".concat(interpolatedString, "</0>"));

  function renderInner(child, node, rootReactNode) {
    var childs = getChildren(child);
    var mappedChildren = mapAST(childs, node.children, rootReactNode);
    return hasValidReactChildren(childs) && mappedChildren.length === 0 ? childs : mappedChildren;
  }

  function pushTranslatedJSX(child, inner, mem, i) {
    if (child.dummy) child.children = inner;
    mem.push(React__default.cloneElement(child, _objectSpread$1({}, child.props, {
      key: i
    }), inner));
  }

  function mapAST(reactNode, astNode, rootReactNode) {
    var reactNodes = getAsArray(reactNode);
    var astNodes = getAsArray(astNode);
    return astNodes.reduce(function (mem, node, i) {
      var translationContent = node.children && node.children[0] && node.children[0].content;

      if (node.type === 'tag') {
        var tmp = reactNodes[parseInt(node.name, 10)];
        if (!tmp && rootReactNode.length === 1 && rootReactNode[0][node.name]) tmp = rootReactNode[0][node.name];
        if (!tmp) tmp = {};
        var child = Object.keys(node.attrs).length !== 0 ? mergeProps({
          props: node.attrs
        }, tmp) : tmp;
        var isElement = React__default.isValidElement(child);
        var isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
        var isEmptyTransWithHTML = emptyChildrenButNeedsHandling && _typeof_1(child) === 'object' && child.dummy && !isElement;
        var isKnownComponent = _typeof_1(children) === 'object' && children !== null && Object.hasOwnProperty.call(children, node.name);

        if (typeof child === 'string') {
          mem.push(child);
        } else if (hasChildren(child) || isValidTranslationWithChildren) {
            var inner = renderInner(child, node, rootReactNode);
            pushTranslatedJSX(child, inner, mem, i);
          } else if (isEmptyTransWithHTML) {
          var _inner = mapAST(reactNodes, node.children, rootReactNode);

          mem.push(React__default.cloneElement(child, _objectSpread$1({}, child.props, {
            key: i
          }), _inner));
        } else if (Number.isNaN(parseFloat(node.name))) {
          if (isKnownComponent) {
            var _inner2 = renderInner(child, node, rootReactNode);

            pushTranslatedJSX(child, _inner2, mem, i);
          } else if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
            if (node.voidElement) {
              mem.push(React__default.createElement(node.name, {
                key: "".concat(node.name, "-").concat(i)
              }));
            } else {
              var _inner3 = mapAST(reactNodes, node.children, rootReactNode);

              mem.push(React__default.createElement(node.name, {
                key: "".concat(node.name, "-").concat(i)
              }, _inner3));
            }
          } else if (node.voidElement) {
            mem.push("<".concat(node.name, " />"));
          } else {
            var _inner4 = mapAST(reactNodes, node.children, rootReactNode);

            mem.push("<".concat(node.name, ">").concat(_inner4, "</").concat(node.name, ">"));
          }
        } else if (_typeof_1(child) === 'object' && !isElement) {
          var content = node.children[0] ? translationContent : null;
          if (content) mem.push(content);
        } else if (node.children.length === 1 && translationContent) {
          mem.push(React__default.cloneElement(child, _objectSpread$1({}, child.props, {
            key: i
          }), translationContent));
        } else {
          mem.push(React__default.cloneElement(child, _objectSpread$1({}, child.props, {
            key: i
          })));
        }
      } else if (node.type === 'text') {
        mem.push(node.content);
      }

      return mem;
    }, []);
  }

  var result = mapAST([{
    dummy: true,
    children: children
  }], ast, getAsArray(children || []));
  return getChildren(result[0]);
}

function Trans(_ref) {
  var children = _ref.children,
      count = _ref.count,
      parent = _ref.parent,
      i18nKey = _ref.i18nKey,
      tOptions = _ref.tOptions,
      values = _ref.values,
      defaults = _ref.defaults,
      components = _ref.components,
      ns = _ref.ns,
      i18nFromProps = _ref.i18n,
      tFromProps = _ref.t,
      additionalProps = objectWithoutProperties(_ref, ["children", "count", "parent", "i18nKey", "tOptions", "values", "defaults", "components", "ns", "i18n", "t"]);

  var _ref2 = React.useContext(I18nContext) || {},
      i18nFromContext = _ref2.i18n,
      defaultNSFromContext = _ref2.defaultNS;

  var i18n = i18nFromProps || i18nFromContext || getI18n();

  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using i18nextReactModule');
    return children;
  }

  var t = tFromProps || i18n.t.bind(i18n) || function (k) {
    return k;
  };

  var reactI18nextOptions = _objectSpread$1({}, getDefaults(), {}, i18n.options && i18n.options.react);

  var namespaces = ns || t.ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];
  var defaultValue = defaults || nodesToString(children, reactI18nextOptions) || reactI18nextOptions.transEmptyNodeValue || i18nKey;
  var hashTransKey = reactI18nextOptions.hashTransKey;
  var key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
  var interpolationOverride = values ? {} : {
    interpolation: {
      prefix: '#$?',
      suffix: '?$#'
    }
  };

  var combinedTOpts = _objectSpread$1({}, tOptions, {
    count: count
  }, values, {}, interpolationOverride, {
    defaultValue: defaultValue,
    ns: namespaces
  });

  var translation = key ? t(key, combinedTOpts) : defaultValue;
  var content = renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts);
  var useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;
  return useAsParent ? React__default.createElement(useAsParent, additionalProps, content) : content;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

var iterableToArrayLimit = _iterableToArrayLimit;

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function useTranslation(ns) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var i18nFromProps = props.i18n;

  var _ref = React.useContext(I18nContext) || {},
      i18nFromContext = _ref.i18n,
      defaultNSFromContext = _ref.defaultNS;

  var i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();

  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using initReactI18next');

    var notReadyT = function notReadyT(k) {
      return Array.isArray(k) ? k[k.length - 1] : k;
    };

    var retNotReady = [notReadyT, {}, false];
    retNotReady.t = notReadyT;
    retNotReady.i18n = {};
    retNotReady.ready = false;
    return retNotReady;
  }

  var i18nOptions = _objectSpread$2({}, getDefaults(), {}, i18n.options.react, {}, props);

  var useSuspense = i18nOptions.useSuspense;
  var namespaces = ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];
  if (i18n.reportNamespaces.addUsedNamespaces) i18n.reportNamespaces.addUsedNamespaces(namespaces);
  var ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(function (n) {
    return hasLoadedNamespace(n, i18n, i18nOptions);
  });

  function getT() {
    return {
      t: i18n.getFixedT(null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0])
    };
  }

  var _useState = React.useState(getT()),
      _useState2 = slicedToArray(_useState, 2),
      t = _useState2[0],
      setT = _useState2[1];

  var isMounted = React.useRef(true);
  React.useEffect(function () {
    var bindI18n = i18nOptions.bindI18n,
        bindI18nStore = i18nOptions.bindI18nStore;
    isMounted.current = true;

    if (!ready && !useSuspense) {
      loadNamespaces(i18n, namespaces, function () {
        if (isMounted.current) setT(getT());
      });
    }

    function boundReset() {
      if (isMounted.current) setT(getT());
    }

    if (bindI18n && i18n) i18n.on(bindI18n, boundReset);
    if (bindI18nStore && i18n) i18n.store.on(bindI18nStore, boundReset);
    return function () {
      isMounted.current = false;
      if (bindI18n && i18n) bindI18n.split(' ').forEach(function (e) {
        return i18n.off(e, boundReset);
      });
      if (bindI18nStore && i18n) bindI18nStore.split(' ').forEach(function (e) {
        return i18n.store.off(e, boundReset);
      });
    };
  }, [namespaces.join()]);
  var ret = [t.t, i18n, ready];
  ret.t = t.t;
  ret.i18n = i18n;
  ret.ready = ready;
  if (ready) return ret;
  if (!ready && !useSuspense) return ret;
  throw new Promise(function (resolve) {
    loadNamespaces(i18n, namespaces, function () {
      if (isMounted.current) setT(getT());
      resolve();
    });
  });
}

// hacky stuff
async function getStoredLanguage() {
    return "de";
}
const getStoredOrPhoneLanguageCode = async function (t) {
    return "de";
};
const storeLanguage = async function (languageCode) {
    return;
};

class PpQObject {

    // Answer the object to be stored in the answer json document.
    // By default this is the questions value, but it may be an id.
    answer() {
        return this.value();
    }

    toJSON() {
        let jsonObject = {};
        Object.assign(jsonObject, this);
        jsonObject.__class__ = this.constructor.name;
        return jsonObject;
    }

    postJSONLoad() {
        // Nothing to do
    }

    static fromJSON(jsonObject) {
        let newObject = new this();
        Object.assign(newObject, jsonObject);
        delete newObject['__class__'];
        return newObject;
    }

}

//
// ActivationConditions are used to determine whether the current
// question should be presented to the user.
//
// Typical criteria include:
// - Do or don't present based on the value chosen in a 
//   previous question.
// - Do or don't present based on the language
//
// Instance variables:
//
// _question: the current question (which will or won't be presented)
//

class PpActivationCondition extends PpQObject {
    constructor() {
        super();
        this._question = null;
    }

    get question() {
        return this._question;
    }

    set question(question) {
        this._question = question;
    }

    isActive() {
        throw Error('subclass responsibility');
    }

    toJSON() {
        let jsonObject = super.toJSON();
        if (this._question != null) {
            jsonObject._question = this._question.id;
        }
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad();
        if (this._question != null) {
            // The JSON object just stores the question id.
            // Retrieve the real object.
            this._question = questionnaire.questionId(this._question);
        }
    }
}

// //module.exports = PpActivationCondition;

//
// PpDependOnAnotherQuestion is an abstract class that is activated
// based on the response chosen in another question.
// Subclasses exist for each type of selector question.
//
// Instance variables:
//
// - _dependent_question: The question whose value will determine
//   whether to display the current question
//

class PpDependOnAnotherQuestion extends PpActivationCondition {
    constructor(dependent_question) {
        super();
        this._dependent_question = dependent_question;
    }

    get dependent_question() {
        return this._dependent_question;
    }

    set dependent_question(question) {
        this._dependent_question = question;
    }

    toJSON() {
        let jsonObject = super.toJSON();
        jsonObject._dependent_question = this._dependent_question.id;
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        // The JSON object just stores the question id.
        // Retrieve the real object.
        this._dependent_question = questionnaire.questionId(this._dependent_question);
    }
}

class PpDependOnSingleChoice extends PpDependOnAnotherQuestion {
    constructor(dependent_question, choice) {
        super(dependent_question);
        this._choice = choice;
    }

    choice() {
        return this._choice;
    }

    setChoice(choice) {
        this._choice = choice;
        return this;
    }

    isActive() {
        return this._choice.isSelected();
    }

    toJSON() {
        // Save the index of the choice and reconstruct on deseralisation
        let choice = this._dependent_question.choices().indexOf(this._choice);
        let jsonObject = super.toJSON();
        jsonObject._choice = choice;
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        let choice = this._dependent_question.choices()[this._choice];
        this._choice = choice;
    }
}

function assert(assertion) {
  if (!assertion) {
    throw "Everything is burning. What have you done?"
  }
}

function localizedDate(date, locale) {
  if (!date) {
    return null;
  }

  if (locale === 'en') {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return (
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    );
  }

  if (locale === 'de') {
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return (
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    );
  }

  return date.toDateString();
}

//import { timingSafeEqual } from 'crypto';

//
// PpQuestionnaire
//
// Instance Variables:
//
// - _title: The title of the questionnaire
// - _description: Text introducing the questionnaire
// - _published_date: The date the questionnaire is scheduled to be made
//   available
// - _question_language: is the language used by PpDependOnLanguage
//   to activate / deactivate questions.
//   The format is <languageCode>[_<countryCode>],
//   e.g. "en" or "en_AU".  String encoding may be present and is
//   ignored, e.g. "en_AU.UTF-8".
//   This is currently the same as the display language (and is set
//   when the display language is set), but notionally could be separate
//   at some point in the future.
// - _available_translations is a simple object containing
//   the translations that can be loaded for the questionnaire.
//   e.g. { english: 'en', german: 'de' }
//   will look for en.js in the questionnaire directory.
// - _last_saved_time - the time at which the answers document was last
//   retrieved.
// - _last_submitted_time - the time at which the answers were last
//   submitted to the server.
// - _submission_deadline - is a Date object representing the submission
//   deadline date.
// - _encryption_public_key - a public key to encrypt answers before submitting them
//

class PpQuestionnaire extends PpQObject {
  constructor() {
    super();
    this._id = uuid.v1();
    this._date_generated = new Date();
    this._title = null;
    this._description = null;
    this._published_date = null;
    this._author = null;
    this._legal = null;
    this._questions = [];
    this._question_language = null;
    this._available_translations = null;
    this._last_saved_time = null;
    this._last_submitted_time = null;
    this._submission_deadline = null;
    this._encryption_public_key = null;
    this._result = null;
    this._schema = null;
  }

  get id() {
    return this._id;
  }

  set id(newId) {
    this._id = newId;
  }

  activeQuestions() {
    return this._questions.filter(item => item.isActive());
  }

  questions() {
    return this._questions;
  }

  firstActiveQuestion() {
    return this.activeQuestions()[0];
  }

  get question_language() {
    return this._question_language;
  }

  set question_language(language) {
    this._question_language = language;
  }

  get available_translations() {
    return this._available_translations;
  }

  set available_translations(translations) {
    this._available_translations = translations;
  }

  get last_saved_time() {
    return this._last_saved_time;
  }

  get last_submitted_time() {
    return this._last_submitted_time;
  }

  submittedTimeString(locale) {
    return localizedDate(new Date(this._last_submitted_time), locale);
  }

  get submission_deadline() {
    return this._submission_deadline;
  }

  set submission_deadline(date) {
    this._submission_deadline = date;
  }

  submissionDeadlineString(locale) {
    return localizedDate(this._submission_deadline, locale);
  }

  get encryption_public_key() {
    return this._encryption_public_key;
  }

  set encryption_public_key(key) {
    this._encryption_public_key = key;
  }

  get result() {
    return this._result;
  }

  set result(newResult) {
    this._result = newResult;
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    this._title = newTitle;
  }

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get published_date() {
    return this._published_date;
  }

  set published_date(published_date) {
    this._published_date = published_date;
  }

  publishedDateString(locale) {
    return localizedDate(this._published_date, locale);
  }

  get author() {
    return this._author;
  }

  set author(author) {
    this._author = author;
  }

  get legal() {
    return this._legal;
  }

  set legal(legal) {
    this._legal = legal;
  }

  get schema() {
    return this._schema;
  }

  set schema(schema) {
    this._schema = schema;
  }

  // Answer the active question prior to the supplied question.
  // If the supplied question is the first question, answer null.
  // If the question can't be found, throw an error.
  activeQuestionBefore(a_question) {
    let index = a_question.index;

    do {
      index = index - 1;
    } while (index >= 0 && !this._questions[index].isActive());

    if (index < 0) {
      return null;
    }
    return this._questions[index];
  }

  isFirstQuestion(a_question) {
    return this.firstActiveQuestion() === a_question;
  }

  isLastQuestion(a_question) {
    return (
      this.activeQuestions()[this.activeQuestions().length - 1] === a_question
    );
  }

  // Answer the active question after the supplied question.
  // If the supplied question is the last question, answer null.
  // If the question can't be found, throw an error.
  activeQuestionAfter(a_question) {
    let index = a_question.index;

    do {
      index = index + 1;
    } while (
      index < this._questions.length &&
      !this._questions[index].isActive()
    );

    if (index > this._questions.length) {
      return null;
    }
    return this._questions[index];
  }

  // Answer the question with the supplied id
  questionId(qId) {
    return this._questions.find(question => question.id === qId);
  }

  addQuestion(question) {
    this._questions[this._questions.length] = question;
    question.questionnaire = this;
    this.reindex();
    return this;
  }

  // Return the array of all answered questions
  answeredQuestions() {
    return this._questions.filter(question => question.isAnswered());
  }

  // Return the first active, unanswered question,
  // or null if all have been answered or aren't active.
  firstUnansweredQuestion() {
    let firstUnanswered = this._questions.find(
      question => !question.isAnswered() && question.isActive(),
    );
    return firstUnanswered || null;
  }

  // Return the last answered question
  // Simplistic implementation for now
  lastAnsweredQuestion() {
    let answeredQuestions = this.answeredQuestions();
    if (answeredQuestions.length === 0) {
      return null;
    }
    return answeredQuestions[answeredQuestions.length - 1].index;
  }

  hasAnsweredQuestions() {
    return (
      this.answeredQuestions() !== null && this.answeredQuestions().length > 0
    );
  }

  updateSavedTime() {
    this._last_saved_time = new Date();
  }

  updateSubmittedTime() {
    this._last_submitted_time = new Date();
  }

  isSubmitted() {
    return this._last_submitted_time !== null;
  }

  isActive() {
    return !this.isExpired() && !this.isSubmitted();
  }

  isExpired() {
    const currentDate = new Date();
    return this._submission_deadline < currentDate;
  }

  hasResult() {
    return this._result !== null;
  }

  // Set the index number of all the receiver's questions
  reindex() {
    this._questions.forEach((question, index) => {
      question.index = index;
    });
    return this;
  }

  // Answer an object containing just the user's answers.
  // Note that this call doesn't update the last saved time.
  // Normally answerJSON() will be used to retrieve the document for
  // saving.
  basicAnswerJSON() {
    let jsonObject = {};
    jsonObject.schema = this.schema;
    jsonObject.questionnaireId = this.id;
    jsonObject.answers = this.questions().map(question => {
      return {questionId: question.id, answer: question.answer()};
    });
    // The langauge is set each time the application starts and when the user
    // chooses a language, thus the language included with the answers is the
    // one at the time the answers are submitted.  While answering questions a
    // different language may have been used.
    jsonObject.language = this.question_language;
    return jsonObject;
  }

  answerJSON() {
    this.updateSavedTime();
    let jsonObject = this.basicAnswerJSON();
    jsonObject._last_saved_time = this.last_saved_time;
    jsonObject._last_submitted_time = this.last_submitted_time;
    jsonObject._question_language = this._question_language;
    return jsonObject;
  }

  answerJSONForSubmit() {
    let jsonObject = this.basicAnswerJSON();
    return jsonObject;
  }

  // Update the receiver with the answers from the supplied object
  loadAnswers(jsonObject) {
    assert(jsonObject.questionnaireId === this.id);
    jsonObject.answers.forEach((answer, index) => {
      let question = this.questions()[index];
      assert(question.id === answer.questionId);
      question.loadAnswer(answer);
    });
    this._last_saved_time = jsonObject._last_saved_time;
    this._last_submitted_time = jsonObject._last_submitted_time;
    this._question_language = jsonObject._question_language;
  }

  translationNamespace() {
    return 'questionnaire-' + this._id;
  }

  // Load all the available translatinons from the supplied json object
  loadTranslations(i18n, languages) {
    Object.keys(languages).forEach(language_code => {
      i18n.addResourceBundle(
        language_code,
        this.translationNamespace(),
        languages[language_code],
        true,
        true,
      );
    });
  }

  toJSON() {
    let jsonObject = super.toJSON();
    // we can't know the display language when the questionnaire is loaded,
    // so don't save it.
    delete jsonObject['_question_language'];
    // _last_saved_time and _last_submitted_time are saved as part of
    // the answers document
    delete jsonObject['_last_saved_time'];
    delete jsonObject['_last_submitted_time'];
    return jsonObject;
  }

  // After loading from JSON, convert references to question by id back to
  // actual objects.
  postJSONLoad() {
    super.postJSONLoad();
    if (this._date_generated) {
      this._date_generated = new Date(this._date_generated);
    }
    if (this._published_date) {
      this._published_date = new Date(this._published_date);
    }
    if (this._submission_deadline) {
      this._submission_deadline = new Date(this._submission_deadline);
    }
    this._questions.forEach(q => q.postJSONLoad(this));
  }
}

class PpTrueCondition extends PpActivationCondition {

    isActive() {
        return true;
    }
}

//
// Global ID allocation for Questionnaire components
//
// Ideally, once the questionnaire goes public, any changes to 
// questions, e.g. different choices of words, emphasis, etc.,
// should be tracked so that the impact from those changes
// can be properly tracked and analysed.
//
// Having central allocation of IDs allows this to be set up.
//
// Curently the ID starts at the default value each time the program
// is run, however it can be loaded from a central store to
// properly provide IDs.
//

var nextGId = 1;

function nextGlobalId() {
    return nextGId++;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty$1(obj, key, value) {
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

function _objectSpread$3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$1(target, key, source[key]);
    });
  }

  return target;
}

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

var consoleLogger = {
  type: 'logger',
  log: function log(args) {
    this.output('log', args);
  },
  warn: function warn(args) {
    this.output('warn', args);
  },
  error: function error(args) {
    this.output('error', args);
  },
  output: function output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};

var Logger = function () {
  function Logger(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck$1(this, Logger);

    this.init(concreteLogger, options);
  }

  _createClass$1(Logger, [{
    key: "init",
    value: function init(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.prefix = options.prefix || 'i18next:';
      this.logger = concreteLogger || consoleLogger;
      this.options = options;
      this.debug = options.debug;
    }
  }, {
    key: "setDebug",
    value: function setDebug(bool) {
      this.debug = bool;
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.forward(args, 'log', '', true);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.forward(args, 'warn', '', true);
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.forward(args, 'error', '');
    }
  }, {
    key: "deprecate",
    value: function deprecate() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
  }, {
    key: "forward",
    value: function forward(args, lvl, prefix, debugOnly) {
      if (debugOnly && !this.debug) return null;
      if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
      return this.logger[lvl](args);
    }
  }, {
    key: "create",
    value: function create(moduleName) {
      return new Logger(this.logger, _objectSpread$3({}, {
        prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
      }, this.options));
    }
  }]);

  return Logger;
}();

var baseLogger = new Logger();

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck$1(this, EventEmitter);

    this.observers = {};
  }

  _createClass$1(EventEmitter, [{
    key: "on",
    value: function on(events, listener) {
      var _this = this;

      events.split(' ').forEach(function (event) {
        _this.observers[event] = _this.observers[event] || [];

        _this.observers[event].push(listener);
      });
      return this;
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!this.observers[event]) return;

      if (!listener) {
        delete this.observers[event];
        return;
      }

      this.observers[event] = this.observers[event].filter(function (l) {
        return l !== listener;
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.observers[event]) {
        var cloned = [].concat(this.observers[event]);
        cloned.forEach(function (observer) {
          observer.apply(void 0, args);
        });
      }

      if (this.observers['*']) {
        var _cloned = [].concat(this.observers['*']);

        _cloned.forEach(function (observer) {
          observer.apply(observer, [event].concat(args));
        });
      }
    }
  }]);

  return EventEmitter;
}();

function defer() {
  var res;
  var rej;
  var promise = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}
function makeString(object) {
  if (object == null) return '';
  return '' + object;
}
function copy(a, s, t) {
  a.forEach(function (m) {
    if (s[m]) t[m] = s[m];
  });
}

function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }

  function canNotTraverseDeeper() {
    return !object || typeof object === 'string';
  }

  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};
    var key = cleanKey(stack.shift());
    if (!object[key] && Empty) object[key] = new Empty();
    object = object[key];
  }

  if (canNotTraverseDeeper()) return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}

function setPath(object, path, newValue) {
  var _getLastOfPath = getLastOfPath(object, path, Object),
      obj = _getLastOfPath.obj,
      k = _getLastOfPath.k;

  obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
  var _getLastOfPath2 = getLastOfPath(object, path, Object),
      obj = _getLastOfPath2.obj,
      k = _getLastOfPath2.k;

  obj[k] = obj[k] || [];
  if (concat) obj[k] = obj[k].concat(newValue);
  if (!concat) obj[k].push(newValue);
}
function getPath(object, path) {
  var _getLastOfPath3 = getLastOfPath(object, path),
      obj = _getLastOfPath3.obj,
      k = _getLastOfPath3.k;

  if (!obj) return undefined;
  return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
  var value = getPath(data, key);

  if (value !== undefined) {
    return value;
  }

  return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
  for (var prop in source) {
    if (prop in target) {
      if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
        if (overwrite) target[prop] = source[prop];
      } else {
        deepExtend(target[prop], source[prop], overwrite);
      }
    } else {
      target[prop] = source[prop];
    }
  }

  return target;
}
function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
function escape$1(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  }

  return data;
}
var isIE10 = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;

var ResourceStore = function (_EventEmitter) {
  _inherits(ResourceStore, _EventEmitter);

  function ResourceStore(data) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ns: ['translation'],
      defaultNS: 'translation'
    };

    _classCallCheck$1(this, ResourceStore);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceStore).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.data = data || {};
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    return _this;
  }

  _createClass$1(ResourceStore, [{
    key: "addNamespaces",
    value: function addNamespaces(ns) {
      if (this.options.ns.indexOf(ns) < 0) {
        this.options.ns.push(ns);
      }
    }
  }, {
    key: "removeNamespaces",
    value: function removeNamespaces(ns) {
      var index = this.options.ns.indexOf(ns);

      if (index > -1) {
        this.options.ns.splice(index, 1);
      }
    }
  }, {
    key: "getResource",
    value: function getResource(lng, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var path = [lng, ns];
      if (key && typeof key !== 'string') path = path.concat(key);
      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
      }

      return getPath(this.data, path);
    }
  }, {
    key: "addResource",
    value: function addResource(lng, ns, key, value) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        silent: false
      };
      var keySeparator = this.options.keySeparator;
      if (keySeparator === undefined) keySeparator = '.';
      var path = [lng, ns];
      if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        value = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      setPath(this.data, path, value);
      if (!options.silent) this.emit('added', lng, ns, key, value);
    }
  }, {
    key: "addResources",
    value: function addResources(lng, ns, resources) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        silent: false
      };

      for (var m in resources) {
        if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
          silent: true
        });
      }

      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "addResourceBundle",
    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
        silent: false
      };
      var path = [lng, ns];

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        deep = resources;
        resources = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      var pack = getPath(this.data, path) || {};

      if (deep) {
        deepExtend(pack, resources, overwrite);
      } else {
        pack = _objectSpread$3({}, pack, resources);
      }

      setPath(this.data, path, pack);
      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "removeResourceBundle",
    value: function removeResourceBundle(lng, ns) {
      if (this.hasResourceBundle(lng, ns)) {
        delete this.data[lng][ns];
      }

      this.removeNamespaces(ns);
      this.emit('removed', lng, ns);
    }
  }, {
    key: "hasResourceBundle",
    value: function hasResourceBundle(lng, ns) {
      return this.getResource(lng, ns) !== undefined;
    }
  }, {
    key: "getResourceBundle",
    value: function getResourceBundle(lng, ns) {
      if (!ns) ns = this.options.defaultNS;
      if (this.options.compatibilityAPI === 'v1') return _objectSpread$3({}, {}, this.getResource(lng, ns));
      return this.getResource(lng, ns);
    }
  }, {
    key: "getDataByLanguage",
    value: function getDataByLanguage(lng) {
      return this.data[lng];
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.data;
    }
  }]);

  return ResourceStore;
}(EventEmitter);

var postProcessor = {
  processors: {},
  addPostProcessor: function addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle: function handle(processors, value, key, options, translator) {
    var _this = this;

    processors.forEach(function (processor) {
      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};

var checkedLoadedFor = {};

var Translator = function (_EventEmitter) {
  _inherits(Translator, _EventEmitter);

  function Translator(services) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck$1(this, Translator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Translator).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, _assertThisInitialized(_this));
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    _this.logger = baseLogger.create('translator');
    return _this;
  }

  _createClass$1(Translator, [{
    key: "changeLanguage",
    value: function changeLanguage(lng) {
      if (lng) this.language = lng;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };
      var resolved = this.resolve(key, options);
      return resolved && resolved.res !== undefined;
    }
  }, {
    key: "extractFromKey",
    value: function extractFromKey(key, options) {
      var nsSeparator = options.nsSeparator || this.options.nsSeparator;
      if (nsSeparator === undefined) nsSeparator = ':';
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var namespaces = options.ns || this.options.defaultNS;

      if (nsSeparator && key.indexOf(nsSeparator) > -1) {
        var m = key.match(this.interpolator.nestingRegexp);

        if (m && m.length > 0) {
          return {
            key: key,
            namespaces: namespaces
          };
        }

        var parts = key.split(nsSeparator);
        if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
        key = parts.join(keySeparator);
      }

      if (typeof namespaces === 'string') namespaces = [namespaces];
      return {
        key: key,
        namespaces: namespaces
      };
    }
  }, {
    key: "translate",
    value: function translate(keys, options) {
      var _this2 = this;

      if (_typeof(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
        options = this.options.overloadTranslationOptionHandler(arguments);
      }

      if (!options) options = {};
      if (keys === undefined || keys === null) return '';
      if (!Array.isArray(keys)) keys = [String(keys)];
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

      var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
          key = _this$extractFromKey.key,
          namespaces = _this$extractFromKey.namespaces;

      var namespace = namespaces[namespaces.length - 1];
      var lng = options.lng || this.language;
      var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

      if (lng && lng.toLowerCase() === 'cimode') {
        if (appendNamespaceToCIMode) {
          var nsSeparator = options.nsSeparator || this.options.nsSeparator;
          return namespace + nsSeparator + key;
        }

        return key;
      }

      var resolved = this.resolve(keys, options);
      var res = resolved && resolved.res;
      var resUsedKey = resolved && resolved.usedKey || key;
      var resExactUsedKey = resolved && resolved.exactUsedKey || key;
      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
      var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

      if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
        if (!options.returnObjects && !this.options.returnObjects) {
          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
          return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, options) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
        }

        if (keySeparator) {
          var resTypeIsArray = resType === '[object Array]';
          var copy$$1 = resTypeIsArray ? [] : {};
          var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

          for (var m in res) {
            if (Object.prototype.hasOwnProperty.call(res, m)) {
              var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
              copy$$1[m] = this.translate(deepKey, _objectSpread$3({}, options, {
                joinArrays: false,
                ns: namespaces
              }));
              if (copy$$1[m] === deepKey) copy$$1[m] = res[m];
            }
          }

          res = copy$$1;
        }
      } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
        res = res.join(joinArrays);
        if (res) res = this.extendTranslation(res, keys, options);
      } else {
        var usedDefault = false;
        var usedKey = false;

        if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
          usedDefault = true;

          if (options.count !== undefined) {
            var suffix = this.pluralResolver.getSuffix(lng, options.count);
            res = options["defaultValue".concat(suffix)];
          }

          if (!res) res = options.defaultValue;
        }

        if (!this.isValidLookup(res)) {
          usedKey = true;
          res = key;
        }

        var updateMissing = options.defaultValue && options.defaultValue !== res && this.options.updateMissing;

        if (usedKey || usedDefault || updateMissing) {
          this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? options.defaultValue : res);

          if (keySeparator) {
            var fk = this.resolve(key, _objectSpread$3({}, options, {
              keySeparator: false
            }));
            if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
          }

          var lngs = [];
          var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);

          if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
            for (var i = 0; i < fallbackLngs.length; i++) {
              lngs.push(fallbackLngs[i]);
            }
          } else if (this.options.saveMissingTo === 'all') {
            lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
          } else {
            lngs.push(options.lng || this.language);
          }

          var send = function send(l, k) {
            if (_this2.options.missingKeyHandler) {
              _this2.options.missingKeyHandler(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
            } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
              _this2.backendConnector.saveMissing(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
            }

            _this2.emit('missingKey', l, namespace, k, res);
          };

          if (this.options.saveMissing) {
            var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';

            if (this.options.saveMissingPlurals && needsPluralHandling) {
              lngs.forEach(function (l) {
                var plurals = _this2.pluralResolver.getPluralFormsOfKey(l, key);

                plurals.forEach(function (p) {
                  return send([l], p);
                });
              });
            } else {
              send(lngs, key);
            }
          }
        }

        res = this.extendTranslation(res, keys, options, resolved);
        if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);
        if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
      }

      return res;
    }
  }, {
    key: "extendTranslation",
    value: function extendTranslation(res, key, options, resolved) {
      var _this3 = this;

      if (this.i18nFormat && this.i18nFormat.parse) {
        res = this.i18nFormat.parse(res, options, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
          resolved: resolved
        });
      } else if (!options.skipInterpolation) {
        if (options.interpolation) this.interpolator.init(_objectSpread$3({}, options, {
          interpolation: _objectSpread$3({}, this.options.interpolation, options.interpolation)
        }));
        var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
        if (this.options.interpolation.defaultVariables) data = _objectSpread$3({}, this.options.interpolation.defaultVariables, data);
        res = this.interpolator.interpolate(res, data, options.lng || this.language, options);
        if (options.nest !== false) res = this.interpolator.nest(res, function () {
          return _this3.translate.apply(_this3, arguments);
        }, options);
        if (options.interpolation) this.interpolator.reset();
      }

      var postProcess = options.postProcess || this.options.postProcess;
      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

      if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
        res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread$3({
          i18nResolved: resolved
        }, options) : options, this);
      }

      return res;
    }
  }, {
    key: "resolve",
    value: function resolve(keys) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var found;
      var usedKey;
      var exactUsedKey;
      var usedLng;
      var usedNS;
      if (typeof keys === 'string') keys = [keys];
      keys.forEach(function (k) {
        if (_this4.isValidLookup(found)) return;

        var extracted = _this4.extractFromKey(k, options);

        var key = extracted.key;
        usedKey = key;
        var namespaces = extracted.namespaces;
        if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';
        var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
        namespaces.forEach(function (ns) {
          if (_this4.isValidLookup(found)) return;
          usedNS = ns;

          if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
            checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;

            _this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          }

          codes.forEach(function (code) {
            if (_this4.isValidLookup(found)) return;
            usedLng = code;
            var finalKey = key;
            var finalKeys = [finalKey];

            if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
              _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
            } else {
              var pluralSuffix;
              if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count);
              if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);
              if (needsContextHandling) finalKeys.push(finalKey += "".concat(_this4.options.contextSeparator).concat(options.context));
              if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);
            }

            var possibleKey;

            while (possibleKey = finalKeys.pop()) {
              if (!_this4.isValidLookup(found)) {
                exactUsedKey = possibleKey;
                found = _this4.getResource(code, ns, possibleKey, options);
              }
            }
          });
        });
      });
      return {
        res: found,
        usedKey: usedKey,
        exactUsedKey: exactUsedKey,
        usedLng: usedLng,
        usedNS: usedNS
      };
    }
  }, {
    key: "isValidLookup",
    value: function isValidLookup(res) {
      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
    }
  }, {
    key: "getResource",
    value: function getResource(code, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
      return this.resourceStore.getResource(code, ns, key, options);
    }
  }]);

  return Translator;
}(EventEmitter);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var LanguageUtil = function () {
  function LanguageUtil(options) {
    _classCallCheck$1(this, LanguageUtil);

    this.options = options;
    this.whitelist = this.options.supportedLngs || false;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }

  _createClass$1(LanguageUtil, [{
    key: "getScriptPartFromCode",
    value: function getScriptPartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return null;
      var p = code.split('-');
      if (p.length === 2) return null;
      p.pop();
      if (p[p.length - 1].toLowerCase() === 'x') return null;
      return this.formatLanguageCode(p.join('-'));
    }
  }, {
    key: "getLanguagePartFromCode",
    value: function getLanguagePartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return code;
      var p = code.split('-');
      return this.formatLanguageCode(p[0]);
    }
  }, {
    key: "formatLanguageCode",
    value: function formatLanguageCode(code) {
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
        var p = code.split('-');

        if (this.options.lowerCaseLng) {
          p = p.map(function (part) {
            return part.toLowerCase();
          });
        } else if (p.length === 2) {
          p[0] = p[0].toLowerCase();
          p[1] = p[1].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        } else if (p.length === 3) {
          p[0] = p[0].toLowerCase();
          if (p[1].length === 2) p[1] = p[1].toUpperCase();
          if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
        }

        return p.join('-');
      }

      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }, {
    key: "isWhitelisted",
    value: function isWhitelisted(code) {
      this.logger.deprecate('languageUtils.isWhitelisted', 'function "isWhitelisted" will be renamed to "isSupportedCode" in the next major - please make sure to rename it\'s usage asap.');
      return this.isSupportedCode(code);
    }
  }, {
    key: "isSupportedCode",
    value: function isSupportedCode(code) {
      if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
        code = this.getLanguagePartFromCode(code);
      }

      return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
    }
  }, {
    key: "getBestMatchFromCodes",
    value: function getBestMatchFromCodes(codes) {
      var _this = this;

      if (!codes) return null;
      var found;
      codes.forEach(function (code) {
        if (found) return;

        var cleanedLng = _this.formatLanguageCode(code);

        if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
      });

      if (!found && this.options.supportedLngs) {
        codes.forEach(function (code) {
          if (found) return;

          var lngOnly = _this.getLanguagePartFromCode(code);

          if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
          found = _this.options.supportedLngs.find(function (supportedLng) {
            if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
          });
        });
      }

      if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
      return found;
    }
  }, {
    key: "getFallbackCodes",
    value: function getFallbackCodes(fallbacks, code) {
      if (!fallbacks) return [];
      if (typeof fallbacks === 'string') fallbacks = [fallbacks];
      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
      if (!code) return fallbacks["default"] || [];
      var found = fallbacks[code];
      if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
      if (!found) found = fallbacks[this.formatLanguageCode(code)];
      if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
      if (!found) found = fallbacks["default"];
      return found || [];
    }
  }, {
    key: "toResolveHierarchy",
    value: function toResolveHierarchy(code, fallbackCode) {
      var _this2 = this;

      var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
      var codes = [];

      var addCode = function addCode(c) {
        if (!c) return;

        if (_this2.isSupportedCode(c)) {
          codes.push(c);
        } else {
          _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
        }
      };

      if (typeof code === 'string' && code.indexOf('-') > -1) {
        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
        if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
      } else if (typeof code === 'string') {
        addCode(this.formatLanguageCode(code));
      }

      fallbackCodes.forEach(function (fc) {
        if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
      });
      return codes;
    }
  }]);

  return LanguageUtil;
}();

var sets = [{
  lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
  nr: [1],
  fc: 3
}, {
  lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ['ar'],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ['cs', 'sk'],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ['csb', 'pl'],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ['cy'],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ['fr'],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ['ga'],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ['gd'],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ['is'],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ['jv'],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ['kw'],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ['lt'],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ['lv'],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ['mk'],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ['mnk'],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ['mt'],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ['or'],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ['ro'],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ['sl'],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ['he'],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: function _(n) {
    return Number(n > 1);
  },
  2: function _(n) {
    return Number(n != 1);
  },
  3: function _(n) {
    return 0;
  },
  4: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  5: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
  },
  6: function _(n) {
    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
  },
  7: function _(n) {
    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  8: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
  },
  9: function _(n) {
    return Number(n >= 2);
  },
  10: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
  },
  11: function _(n) {
    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
  },
  12: function _(n) {
    return Number(n % 10 != 1 || n % 100 == 11);
  },
  13: function _(n) {
    return Number(n !== 0);
  },
  14: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
  },
  15: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  16: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
  },
  17: function _(n) {
    return Number(n == 1 || n % 10 == 1 ? 0 : 1);
  },
  18: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
  },
  19: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
  },
  20: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
  },
  21: function _(n) {
    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
  },
  22: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
  }
};

function createRules() {
  var rules = {};
  sets.forEach(function (set) {
    set.lngs.forEach(function (l) {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
}

var PluralResolver = function () {
  function PluralResolver(languageUtils) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck$1(this, PluralResolver);

    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');
    this.rules = createRules();
  }

  _createClass$1(PluralResolver, [{
    key: "addRule",
    value: function addRule(lng, obj) {
      this.rules[lng] = obj;
    }
  }, {
    key: "getRule",
    value: function getRule(code) {
      return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
    }
  }, {
    key: "needsPlural",
    value: function needsPlural(code) {
      var rule = this.getRule(code);
      return rule && rule.numbers.length > 1;
    }
  }, {
    key: "getPluralFormsOfKey",
    value: function getPluralFormsOfKey(code, key) {
      var _this = this;

      var ret = [];
      var rule = this.getRule(code);
      if (!rule) return ret;
      rule.numbers.forEach(function (n) {
        var suffix = _this.getSuffix(code, n);

        ret.push("".concat(key).concat(suffix));
      });
      return ret;
    }
  }, {
    key: "getSuffix",
    value: function getSuffix(code, count) {
      var _this2 = this;

      var rule = this.getRule(code);

      if (rule) {
        var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
        var suffix = rule.numbers[idx];

        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          if (suffix === 2) {
            suffix = 'plural';
          } else if (suffix === 1) {
            suffix = '';
          }
        }

        var returnSuffix = function returnSuffix() {
          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
        };

        if (this.options.compatibilityJSON === 'v1') {
          if (suffix === 1) return '';
          if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
          return returnSuffix();
        } else if (this.options.compatibilityJSON === 'v2') {
          return returnSuffix();
        } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          return returnSuffix();
        }

        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
      }

      this.logger.warn("no plural rule found for: ".concat(code));
      return '';
    }
  }]);

  return PluralResolver;
}();

var Interpolator = function () {
  function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck$1(this, Interpolator);

    this.logger = baseLogger.create('interpolator');
    this.options = options;

    this.format = options.interpolation && options.interpolation.format || function (value) {
      return value;
    };

    this.init(options);
  }

  _createClass$1(Interpolator, [{
    key: "init",
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.interpolation) options.interpolation = {
        escapeValue: true
      };
      var iOpts = options.interpolation;
      this.escape = iOpts.escape !== undefined ? iOpts.escape : escape$1;
      this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
      this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
      this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
      this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
      this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
      this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
      this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
      this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
      this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
      this.resetRegExp();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.options) this.init(this.options);
    }
  }, {
    key: "resetRegExp",
    value: function resetRegExp() {
      var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
      this.regexp = new RegExp(regexpStr, 'g');
      var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
      var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
    }
  }, {
    key: "interpolate",
    value: function interpolate(str, data, lng, options) {
      var _this = this;

      var match;
      var value;
      var replaces;
      var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};

      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }

      var handleFormat = function handleFormat(key) {
        if (key.indexOf(_this.formatSeparator) < 0) {
          var path = getPathWithDefaults(data, defaultData, key);
          return _this.alwaysFormat ? _this.format(path, undefined, lng) : path;
        }

        var p = key.split(_this.formatSeparator);
        var k = p.shift().trim();
        var f = p.join(_this.formatSeparator).trim();
        return _this.format(getPathWithDefaults(data, defaultData, k), f, lng, options);
      };

      this.resetRegExp();
      var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
      replaces = 0;

      while (match = this.regexpUnescape.exec(str)) {
        value = handleFormat(match[1].trim());

        if (value === undefined) {
          if (typeof missingInterpolationHandler === 'function') {
            var temp = missingInterpolationHandler(str, match, options);
            value = typeof temp === 'string' ? temp : '';
          } else {
            this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
            value = '';
          }
        } else if (typeof value !== 'string' && !this.useRawValueToEscape) {
          value = makeString(value);
        }

        str = str.replace(match[0], regexSafe(value));
        this.regexpUnescape.lastIndex = 0;
        replaces++;

        if (replaces >= this.maxReplaces) {
          break;
        }
      }

      replaces = 0;

      while (match = this.regexp.exec(str)) {
        value = handleFormat(match[1].trim());

        if (value === undefined) {
          if (typeof missingInterpolationHandler === 'function') {
            var _temp = missingInterpolationHandler(str, match, options);

            value = typeof _temp === 'string' ? _temp : '';
          } else {
            this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
            value = '';
          }
        } else if (typeof value !== 'string' && !this.useRawValueToEscape) {
          value = makeString(value);
        }

        value = this.escapeValue ? regexSafe(this.escape(value)) : regexSafe(value);
        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
        replaces++;

        if (replaces >= this.maxReplaces) {
          break;
        }
      }

      return str;
    }
  }, {
    key: "nest",
    value: function nest(str, fc) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var match;
      var value;

      var clonedOptions = _objectSpread$3({}, options);

      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;

      function handleHasOptions(key, inheritedOptions) {
        var sep = this.nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
        var optionsString = "{".concat(c[1]);
        key = c[0];
        optionsString = this.interpolate(optionsString, clonedOptions);
        optionsString = optionsString.replace(/'/g, '"');

        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = _objectSpread$3({}, inheritedOptions, clonedOptions);
        } catch (e) {
          this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
          return "".concat(key).concat(sep).concat(optionsString);
        }

        delete clonedOptions.defaultValue;
        return key;
      }

      while (match = this.nestingRegexp.exec(str)) {
        var formatters = [];
        var doReduce = false;

        if (match[0].includes(this.formatSeparator) && !/{.*}/.test(match[1])) {
          var r = match[1].split(this.formatSeparator).map(function (elem) {
            return elem.trim();
          });
          match[1] = r.shift();
          formatters = r;
          doReduce = true;
        }

        value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
        if (value && match[0] === str && typeof value !== 'string') return value;
        if (typeof value !== 'string') value = makeString(value);

        if (!value) {
          this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
          value = '';
        }

        if (doReduce) {
          value = formatters.reduce(function (v, f) {
            return _this2.format(v, f, options.lng, options);
          }, value.trim());
        }

        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }

      return str;
    }
  }]);

  return Interpolator;
}();

function remove(arr, what) {
  var found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

var Connector = function (_EventEmitter) {
  _inherits(Connector, _EventEmitter);

  function Connector(backend, store, services) {
    var _this;

    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck$1(this, Connector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.backend = backend;
    _this.store = store;
    _this.services = services;
    _this.languageUtils = services.languageUtils;
    _this.options = options;
    _this.logger = baseLogger.create('backendConnector');
    _this.state = {};
    _this.queue = [];

    if (_this.backend && _this.backend.init) {
      _this.backend.init(services, options.backend, options);
    }

    return _this;
  }

  _createClass$1(Connector, [{
    key: "queueLoad",
    value: function queueLoad(languages, namespaces, options, callback) {
      var _this2 = this;

      var toLoad = [];
      var pending = [];
      var toLoadLanguages = [];
      var toLoadNamespaces = [];
      languages.forEach(function (lng) {
        var hasAllNamespaces = true;
        namespaces.forEach(function (ns) {
          var name = "".concat(lng, "|").concat(ns);

          if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
            _this2.state[name] = 2;
          } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
            if (pending.indexOf(name) < 0) pending.push(name);
          } else {
            _this2.state[name] = 1;
            hasAllNamespaces = false;
            if (pending.indexOf(name) < 0) pending.push(name);
            if (toLoad.indexOf(name) < 0) toLoad.push(name);
            if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
          }
        });
        if (!hasAllNamespaces) toLoadLanguages.push(lng);
      });

      if (toLoad.length || pending.length) {
        this.queue.push({
          pending: pending,
          loaded: {},
          errors: [],
          callback: callback
        });
      }

      return {
        toLoad: toLoad,
        pending: pending,
        toLoadLanguages: toLoadLanguages,
        toLoadNamespaces: toLoadNamespaces
      };
    }
  }, {
    key: "loaded",
    value: function loaded(name, err, data) {
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      if (err) this.emit('failedLoading', lng, ns, err);

      if (data) {
        this.store.addResourceBundle(lng, ns, data);
      }

      this.state[name] = err ? -1 : 2;
      var loaded = {};
      this.queue.forEach(function (q) {
        pushPath(q.loaded, [lng], ns);
        remove(q.pending, name);
        if (err) q.errors.push(err);

        if (q.pending.length === 0 && !q.done) {
          Object.keys(q.loaded).forEach(function (l) {
            if (!loaded[l]) loaded[l] = [];

            if (q.loaded[l].length) {
              q.loaded[l].forEach(function (ns) {
                if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
              });
            }
          });
          q.done = true;

          if (q.errors.length) {
            q.callback(q.errors);
          } else {
            q.callback();
          }
        }
      });
      this.emit('loaded', loaded);
      this.queue = this.queue.filter(function (q) {
        return !q.done;
      });
    }
  }, {
    key: "read",
    value: function read(lng, ns, fcName) {
      var _this3 = this;

      var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 350;
      var callback = arguments.length > 5 ? arguments[5] : undefined;
      if (!lng.length) return callback(null, {});
      return this.backend[fcName](lng, ns, function (err, data) {
        if (err && data && tried < 5) {
          setTimeout(function () {
            _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
          }, wait);
          return;
        }

        callback(err, data);
      });
    }
  }, {
    key: "prepareLoading",
    value: function prepareLoading(languages, namespaces) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;

      if (!this.backend) {
        this.logger.warn('No backend was added via i18next.use. Will not load resources.');
        return callback && callback();
      }

      if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
      if (typeof namespaces === 'string') namespaces = [namespaces];
      var toLoad = this.queueLoad(languages, namespaces, options, callback);

      if (!toLoad.toLoad.length) {
        if (!toLoad.pending.length) callback();
        return null;
      }

      toLoad.toLoad.forEach(function (name) {
        _this4.loadOne(name);
      });
    }
  }, {
    key: "load",
    value: function load(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {}, callback);
    }
  }, {
    key: "reload",
    value: function reload(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {
        reload: true
      }, callback);
    }
  }, {
    key: "loadOne",
    value: function loadOne(name) {
      var _this5 = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
        if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
        if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

        _this5.loaded(name, err, data);
      });
    }
  }, {
    key: "saveMissing",
    value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
        this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        return;
      }

      if (key === undefined || key === null || key === '') return;

      if (this.backend && this.backend.create) {
        this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread$3({}, options, {
          isUpdate: isUpdate
        }));
      }

      if (!languages || !languages[0]) return;
      this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
  }]);

  return Connector;
}(EventEmitter);

function get() {
  return {
    debug: false,
    initImmediate: true,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false,
    whitelist: false,
    nonExplicitWhitelist: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: 'all',
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: true,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      var ret = {};
      if (_typeof(args[1]) === 'object') ret = args[1];
      if (typeof args[1] === 'string') ret.defaultValue = args[1];
      if (typeof args[2] === 'string') ret.tDescription = args[2];

      if (_typeof(args[2]) === 'object' || _typeof(args[3]) === 'object') {
        var options = args[3] || args[2];
        Object.keys(options).forEach(function (key) {
          ret[key] = options[key];
        });
      }

      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: function format(value, _format, lng, options) {
        return value;
      },
      prefix: '{{',
      suffix: '}}',
      formatSeparator: ',',
      unescapePrefix: '-',
      nestingPrefix: '$t(',
      nestingSuffix: ')',
      nestingOptionsSeparator: ',',
      maxReplaces: 1000
    }
  };
}
function transformOptions(options) {
  if (typeof options.ns === 'string') options.ns = [options.ns];
  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];

  if (options.whitelist) {
    if (options.whitelist && options.whitelist.indexOf('cimode') < 0) {
      options.whitelist = options.whitelist.concat(['cimode']);
    }

    options.supportedLngs = options.whitelist;
  }

  if (options.nonExplicitWhitelist) {
    options.nonExplicitSupportedLngs = options.nonExplicitWhitelist;
  }

  if (options.supportedLngs && options.supportedLngs.indexOf('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }

  return options;
}

function noop() {}

var I18n = function (_EventEmitter) {
  _inherits(I18n, _EventEmitter);

  function I18n() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck$1(this, I18n);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(I18n).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.options = transformOptions(options);
    _this.services = {};
    _this.logger = baseLogger;
    _this.modules = {
      external: []
    };

    if (callback && !_this.isInitialized && !options.isClone) {
      if (!_this.options.initImmediate) {
        _this.init(options, callback);

        return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
      }

      setTimeout(function () {
        _this.init(options, callback);
      }, 0);
    }

    return _this;
  }

  _createClass$1(I18n, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      if (options.whitelist && !options.supportedLngs) {
        this.logger.deprecate('whitelist', 'option "whitelist" will be renamed to "supportedLngs" in the next major - please make sure to rename this option asap.');
      }

      if (options.nonExplicitWhitelist && !options.nonExplicitSupportedLngs) {
        this.logger.deprecate('whitelist', 'options "nonExplicitWhitelist" will be renamed to "nonExplicitSupportedLngs" in the next major - please make sure to rename this option asap.');
      }

      this.options = _objectSpread$3({}, get(), this.options, transformOptions(options));
      this.format = this.options.interpolation.format;
      if (!callback) callback = noop;

      function createClassOnDemand(ClassOrObject) {
        if (!ClassOrObject) return null;
        if (typeof ClassOrObject === 'function') return new ClassOrObject();
        return ClassOrObject;
      }

      if (!this.options.isClone) {
        if (this.modules.logger) {
          baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
        } else {
          baseLogger.init(null, this.options);
        }

        var lu = new LanguageUtil(this.options);
        this.store = new ResourceStore(this.options.resources, this.options);
        var s = this.services;
        s.logger = baseLogger;
        s.resourceStore = this.store;
        s.languageUtils = lu;
        s.pluralResolver = new PluralResolver(lu, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        });
        s.interpolator = new Interpolator(this.options);
        s.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        };
        s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
        s.backendConnector.on('*', function (event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });

        if (this.modules.languageDetector) {
          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
          s.languageDetector.init(s, this.options.detection, this.options);
        }

        if (this.modules.i18nFormat) {
          s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
          if (s.i18nFormat.init) s.i18nFormat.init(this);
        }

        this.translator = new Translator(this.services, this.options);
        this.translator.on('*', function (event) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });
        this.modules.external.forEach(function (m) {
          if (m.init) m.init(_this2);
        });
      }

      if (!this.modules.languageDetector && !this.options.lng) {
        this.logger.warn('init: no languageDetector is used and no lng is defined');
      }

      var storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
      storeApi.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store;

          return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
        };
      });
      var deferred = defer();

      var load = function load() {
        _this2.changeLanguage(_this2.options.lng, function (err, t) {
          _this2.isInitialized = true;

          _this2.logger.log('initialized', _this2.options);

          _this2.emit('initialized', _this2.options);

          deferred.resolve(t);
          callback(err, t);
        });
      };

      if (this.options.resources || !this.options.initImmediate) {
        load();
      } else {
        setTimeout(load, 0);
      }

      return deferred;
    }
  }, {
    key: "loadResources",
    value: function loadResources(language) {
      var _this3 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var usedCallback = callback;
      var usedLng = typeof language === 'string' ? language : this.language;
      if (typeof language === 'function') usedCallback = language;

      if (!this.options.resources || this.options.partialBundledLanguages) {
        if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
        var toLoad = [];

        var append = function append(lng) {
          if (!lng) return;

          var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

          lngs.forEach(function (l) {
            if (toLoad.indexOf(l) < 0) toLoad.push(l);
          });
        };

        if (!usedLng) {
          var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          fallbacks.forEach(function (l) {
            return append(l);
          });
        } else {
          append(usedLng);
        }

        if (this.options.preload) {
          this.options.preload.forEach(function (l) {
            return append(l);
          });
        }

        this.services.backendConnector.load(toLoad, this.options.ns, usedCallback);
      } else {
        usedCallback(null);
      }
    }
  }, {
    key: "reloadResources",
    value: function reloadResources(lngs, ns, callback) {
      var deferred = defer();
      if (!lngs) lngs = this.languages;
      if (!ns) ns = this.options.ns;
      if (!callback) callback = noop;
      this.services.backendConnector.reload(lngs, ns, function (err) {
        deferred.resolve();
        callback(err);
      });
      return deferred;
    }
  }, {
    key: "use",
    value: function use(module) {
      if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
      if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');

      if (module.type === 'backend') {
        this.modules.backend = module;
      }

      if (module.type === 'logger' || module.log && module.warn && module.error) {
        this.modules.logger = module;
      }

      if (module.type === 'languageDetector') {
        this.modules.languageDetector = module;
      }

      if (module.type === 'i18nFormat') {
        this.modules.i18nFormat = module;
      }

      if (module.type === 'postProcessor') {
        postProcessor.addPostProcessor(module);
      }

      if (module.type === '3rdParty') {
        this.modules.external.push(module);
      }

      return this;
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lng, callback) {
      var _this4 = this;

      this.isLanguageChangingTo = lng;
      var deferred = defer();
      this.emit('languageChanging', lng);

      var done = function done(err, l) {
        if (l) {
          _this4.language = l;
          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);

          _this4.translator.changeLanguage(l);

          _this4.isLanguageChangingTo = undefined;

          _this4.emit('languageChanged', l);

          _this4.logger.log('languageChanged', l);
        } else {
          _this4.isLanguageChangingTo = undefined;
        }

        deferred.resolve(function () {
          return _this4.t.apply(_this4, arguments);
        });
        if (callback) callback(err, function () {
          return _this4.t.apply(_this4, arguments);
        });
      };

      var setLng = function setLng(lngs) {
        var l = typeof lngs === 'string' ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);

        if (l) {
          if (!_this4.language) {
            _this4.language = l;
            _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
          }

          if (!_this4.translator.language) _this4.translator.changeLanguage(l);
          if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
        }

        _this4.loadResources(l, function (err) {
          done(err, l);
        });
      };

      if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
        setLng(this.services.languageDetector.detect());
      } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
        this.services.languageDetector.detect(setLng);
      } else {
        setLng(lng);
      }

      return deferred;
    }
  }, {
    key: "getFixedT",
    value: function getFixedT(lng, ns) {
      var _this5 = this;

      var fixedT = function fixedT(key, opts) {
        var options;

        if (_typeof(opts) !== 'object') {
          for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            rest[_key3 - 2] = arguments[_key3];
          }

          options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
        } else {
          options = _objectSpread$3({}, opts);
        }

        options.lng = options.lng || fixedT.lng;
        options.lngs = options.lngs || fixedT.lngs;
        options.ns = options.ns || fixedT.ns;
        return _this5.t(key, options);
      };

      if (typeof lng === 'string') {
        fixedT.lng = lng;
      } else {
        fixedT.lngs = lng;
      }

      fixedT.ns = ns;
      return fixedT;
    }
  }, {
    key: "t",
    value: function t() {
      var _this$translator;

      return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
    }
  }, {
    key: "exists",
    value: function exists() {
      var _this$translator2;

      return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
    }
  }, {
    key: "setDefaultNamespace",
    value: function setDefaultNamespace(ns) {
      this.options.defaultNS = ns;
    }
  }, {
    key: "hasLoadedNamespace",
    value: function hasLoadedNamespace(ns) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!this.isInitialized) {
        this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
        return false;
      }

      if (!this.languages || !this.languages.length) {
        this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
        return false;
      }

      var lng = this.languages[0];
      var fallbackLng = this.options ? this.options.fallbackLng : false;
      var lastLng = this.languages[this.languages.length - 1];
      if (lng.toLowerCase() === 'cimode') return true;

      var loadNotPending = function loadNotPending(l, n) {
        var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];

        return loadState === -1 || loadState === 2;
      };

      if (options.precheck) {
        var preResult = options.precheck(this, loadNotPending);
        if (preResult !== undefined) return preResult;
      }

      if (this.hasResourceBundle(lng, ns)) return true;
      if (!this.services.backendConnector.backend) return true;
      if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
      return false;
    }
  }, {
    key: "loadNamespaces",
    value: function loadNamespaces(ns, callback) {
      var _this7 = this;

      var deferred = defer();

      if (!this.options.ns) {
        callback && callback();
        return Promise.resolve();
      }

      if (typeof ns === 'string') ns = [ns];
      ns.forEach(function (n) {
        if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
      });
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "loadLanguages",
    value: function loadLanguages(lngs, callback) {
      var deferred = defer();
      if (typeof lngs === 'string') lngs = [lngs];
      var preloaded = this.options.preload || [];
      var newLngs = lngs.filter(function (lng) {
        return preloaded.indexOf(lng) < 0;
      });

      if (!newLngs.length) {
        if (callback) callback();
        return Promise.resolve();
      }

      this.options.preload = preloaded.concat(newLngs);
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "dir",
    value: function dir(lng) {
      if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
      if (!lng) return 'rtl';
      var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];
      return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
    }
  }, {
    key: "createInstance",
    value: function createInstance() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      return new I18n(options, callback);
    }
  }, {
    key: "cloneInstance",
    value: function cloneInstance() {
      var _this8 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      var mergedOptions = _objectSpread$3({}, this.options, options, {
        isClone: true
      });

      var clone = new I18n(mergedOptions);
      var membersToCopy = ['store', 'services', 'language'];
      membersToCopy.forEach(function (m) {
        clone[m] = _this8[m];
      });
      clone.services = _objectSpread$3({}, this.services);
      clone.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      clone.translator = new Translator(clone.services, clone.options);
      clone.translator.on('*', function (event) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        clone.emit.apply(clone, [event].concat(args));
      });
      clone.init(mergedOptions, callback);
      clone.translator.options = clone.options;
      clone.translator.backendConnector.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      return clone;
    }
  }]);

  return I18n;
}(EventEmitter);

var i18next = new I18n();

var en = {
	"translation" : {
		"generic" : {
			"button" : {
				"results" : "Results",
				"continue" : "Continue",
				"okay" : "Next",
				"view" : "View",
				"update" : "Update",
				"start" : "Start",
				"review" : "Review Answers"
			},
			"footer" : {
				"progress" : {
					"of" : "of",
					"answered" : "answered"
				}
			}
		},
		"language" : {
			"change" : "You can change your language anytime under settings",
			"german" : "German",
			"english" : "English",
			"choose" : "Choose your language"
		},
		"survey" : {
			"screen_answers" : {
				"title" : "Review your answers",
				"description_before_submit" : "Here you can review your answers before submitting them. You're always welcome to change your mind before doing so.",
				"description_after_submit" : "All answers have been submitted",
				"description_not_submitted" : "Expired and not submitted"
			},
			"screen_active" : {
				"how_many_answered" : "<1>{{answered_amount}}</1> of <2>{{total_amount}}</2> answered"
			},
			"screen_legal" : {
				"title" : "Important"
			},
			"button" : {
				"submit" : "Submit results",
				"try_again" : "Try again",
				"disagree" : "Go back",
				"agree" : "Agree & Submit",
				"subscribe" : "Subscribe to updates",
				"finalize" : "Next step",
				"review" : "Review my answers",
				"home" : "Back to home",
				"edit" : "Edit your answers"
			},
			"screen_submitted" : {
				"answers_submited" : "Your answers have been submitted!",
				"thank_you" : "Thank you for taking part in this.\nJust a reminder: Everything you've submitted will be securely transferred and published so that you always remain anonymous."
			},
			"screen_completed" : {
				"thank_you" : "Thank you for responding!"
			},
			"error" : {
				"title" : "Oops! An error occured.",
				"message" : "Thank you for taking part in the survey. Unfortunately an error occurred while submitting your answers. Please try again later."
			}
		},
		"analytics" : {
			"alert" : {
				"yes_option" : "Yes",
				"header" : "Help us improve the app",
				"description" : "App crash analytics help us understand when something goes wrong and sends anonymous reports to us so we can deliver a better app in future versions.",
				"no_option" : "No thanks"
			},
			"preferences" : {
				"action" : "Enable Analytics",
				"description" : "Crash Reporting analytics help us fix bugs and improve the app. This data is collected in accordance to our Data Collection policy and you can opt out of it anytime."
			}
		},
		"onboarding" : {
			"screen_03" : {
				"main_message_02" : "Aggregated results are released after the survey period has ended on the website of our partners in secure data collection for better decisions as a society in transition.",
				"button" : {
					"continue" : "Who is polypoly?"
				}
			},
			"screen_01" : {
				"title" : "#TellYourPod",
				"button" : {
					"continue" : "How it works"
				},
				"main_message" : "The polyPod is a secure way for you to share data. It delivers surveys that cover lots of different topics. The questions and answers are designed to fully respect your privacy."
			},
			"screen_04" : {
				"message" : "<1>polypoly</1> is on a mission to make data more secure and personal. Our solutions are Private by Design and user-centric in the most basic sense.\nThe <3>polyPod</3> is polypoly's core product.",
				"button" : {
					"continue" : "Continue"
				}
			},
			"screen_02" : {
				"button" : {
					"continue" : "Is this safe?"
				},
				"main_message" : "New surveys will be released every month and should take around five minutes of your time.\nMore participants creates a better picture about what the European community cares about."
			},
			"collected_data" : "What data is collected?",
			"analytics" : {
				"title" : "Help us improve the app",
				"details" : "App crash analytics help us understand when something goes wrong and sends anonymous reports to us, helping us improve the app."
			}
		},
		"general" : {
			"none-above" : "None of the above",
			"yes" : "Yes",
			"choose-one" : "Choose one (1):",
			"choose-seat" : "Move the scale to reflect your opinion:",
			"completely" : "Completely",
			"no" : "No",
			"text-input-shadow-text" : "Type your answer here",
			"choose-one-or-more" : "Choose one or more from the following list:",
			"very" : "Very",
			"not-at-all" : "Not at all",
			"select-all-apply" : "Please select all that apply:",
			"i-dont-know" : "I don't know",
			"enter-answer-below" : "Enter your answer below:",
			"choose-up-to" : "Choose up to {{max_selections}} answers from the following list:"
		},
		"intro" : {
			"author" : "Author",
			"expires" : "Expires",
			"button" : {
				"continue" : "Continue Survey",
				"results" : "Check Results",
				"view" : "View Answers"
			},
			"survey_by" : "Survey by",
			"published" : "Published",
			"submitted" : "Submitted"
		},
		"settings" : {
			"section" : {
				"developer" : "Developer",
				"feedback" : "Feedback",
				"preferences" : "Preferences",
				"notices" : "Notices"
			},
			"title" : "Settings",
			"items" : {
				"send_us_feedback" : "Send us feedback",
				"languages" : "Languages",
				"all_screens" : "All Screens",
				"analytics" : "Analytics",
				"introduction" : "Restart introduction",
				"feedback" : "Send us feedback",
				"data_collection" : "Data Protection",
				"terms_conditions" : "Terms & Conditions",
				"imprint" : "Imprint",
				"about" : "About"
			},
			"back_to_settings" : "Back to settings"
		},
		"home" : {
			"tabs" : {
				"submitted" : "Submitted",
				"expired" : "Expired",
				"featured" : "Featured"
			},
			"notification" : {
				"title" : "Check for new surveys"
			},
			"expired_answers" : {
				"not_submitted" : "Expired and not submitted"
			},
			"message" : "Survey submissions will be closed on",
			"current_answers" : {
				"of" : "of",
				"answered" : "answered",
				"questions" : "Questions"
			},
			"no_surveys" : "No surveys available now. Check back again soon!",
			"submitted_answers" : {
				"closing_message" : "Survey closes on {{closingDate}}",
				"thank_you" : "Thank you for your reponse!",
				"results_available" : "Results available now!"
			}
		},
		"validation" : {
			"only-one-word" : "Please enter only one word"
		},
		"loading" : {
			"by" : "by"
		},
		"imprint" : {
			"description" : "polypoly GmbH\nThorsten Dittmar\nRichardstr. 85/86\n12043 Berlin\nhello@polypoly.eu\n\n+49 30 62934054\nVAT-ID: DE324790734"
		},
		"test" : {
			"test-key1" : "The test key was successfully translated",
			"test-v2" : "Test-Value2",
			"test-v1" : "Test-Value1"
		}
	}
};

var de = {
	"translation" : {
		"generic" : {
			"button" : {
				"results" : "Resultate",
				"continue" : "Fortsetzen",
				"okay" : "Weiter",
				"view" : "Ansicht",
				"update" : "Aktualisieren",
				"start" : "Start",
				"review" : "Übersicht"
			},
			"footer" : {
				"progress" : {
					"of" : "von",
					"answered" : "beantwortet"
				}
			}
		},
		"language" : {
			"change" : "Du kannst in den Einstellungen die Anzeigesprache jederzeit ändern",
			"german" : "Deutsch",
			"english" : "Englisch",
			"choose" : "Wähle deine Anzeigesprache"
		},
		"survey" : {
			"screen_answers" : {
				"title" : "Überprüfe deine Antworten",
				"description_before_submit" : "Hier kannst Du noch einmal alle Antworten durchsehen, bevor Du sie übermittelst. Du kannst Dich dabei auch natürlich bei allen Antworten noch einmal umentscheiden.",
				"description_after_submit" : "Alle Antworten wurden übermittelt",
				"description_not_submitted" : "Abgelaufen und nicht versandt"
			},
			"screen_active" : {
				"how_many_answered" : "<1>{{answered_amount}}</1> von <2>{{total_amount}}</2> beantwortet"
			},
			"screen_legal" : {
				"title" : "Wichtige Hinweise"
			},
			"button" : {
				"submit" : "Antworten übermitteln",
				"try_again" : "Versuche es nochmal",
				"disagree" : "Zurück",
				"agree" : "Zustimmen & absenden",
				"subscribe" : "Updates abonnieren",
				"finalize" : "Nächster Schritt",
				"review" : "Antworten überprüfen",
				"home" : "Zurück zum Startbildschirm",
				"edit" : "Bearbeite deine Antworten"
			},
			"screen_submitted" : {
				"answers_submited" : "Deine Antworten wurden übermittelt!",
				"thank_you" : "Vielen Dank für Deine Teilnahme.\nNur zur Erinnerung: Alles, was Du übermittelt hast, wird sicher verschlüsselt übertragen und nur so Veröffentlicht, dass Du auf jeden Fall immer anonym bleibst."
			},
			"screen_completed" : {
				"thank_you" : "Vielen Dank für die Antworten!"
			},
			"error" : {
				"title" : "Hoppla! Ein Fehler ist aufgetreten.",
				"message" : "Vielen Dank, dass du dich an der Umfrage beteiligt hast. Leider ist bei der Übermittlung deiner Antworten ein Fehler aufgetreten. Bitte versuche es später noch einmal."
			}
		},
		"analytics" : {
			"alert" : {
				"yes_option" : "Ja",
				"header" : "Hilf uns, die App zu verbessern",
				"description" : "Absturzberichte helfen uns zu erkennen, ob etwas schief gelaufen ist. Dafür sendet die App in diesem Fall anonymisierte technische Informationen an unsere Server.",
				"no_option" : "Nein danke"
			},
			"preferences" : {
				"action" : "Analytik aktivieren",
				"description" : "Absturzanalysen helfen uns, Fehler zu beheben und die Anwendung zu verbessern. Diese Daten werden in Übereinstimmung mit unseren Richtlinien zur Datenerfassung erfasst. Du kannst sie jederzeit abbestellen."
			}
		},
		"onboarding" : {
			"screen_03" : {
				"main_message_02" : "Die Ergebnisse werden nach Ablauf des Erhebungszeitraums auf der Website unserer Partner veröffentlicht.",
				"button" : {
					"continue" : "Wer ist polypoly?"
				}
			},
			"screen_01" : {
				"title" : "#TellYourPod",
				"button" : {
					"continue" : "Wie funktioniert das?"
				},
				"main_message" : "Der polyPod ist ein sicherer Weg um Daten zu teilen. Regelmäßig erscheinen dazu neue Umfragen zu vielen verschiedenen Themen. Sowohl die Fragen als auch die möglichen Antworten sind sorgfältig zusammengestellt, um Deine Privatsphäre zu schützen."
			},
			"screen_04" : {
				"message" : "<1>polypoly</1> hat die Mission persönliche Daten sicher zu machen. Unsere Lösungen beinhalten Datenschutz by Design und stellen Dich als Nutzer in den Mittelpunkt.\nDer <3>polyPod</3> ist polypolys Kernprodukt.",
				"button" : {
					"continue" : "Weiter"
				}
			},
			"screen_02" : {
				"button" : {
					"continue" : "Sind meine Daten sicher?"
				},
				"main_message" : "Jeden Monat werden neue Umfragen veröffentlicht, die nur etwa fünf Minuten deiner Zeit in Anspruch nehmen sollten.\nJe mehr Menschen teilnehmen, desto klarer wird, welche Themen der europäischen Gemeinschaft auf dem Herzen liegen."
			},
			"collected_data" : "Welche Daten werden erhoben?",
			"analytics" : {
				"title" : "Hilf uns, die App zu verbessern",
				"details" : "Die Absturzanalyse der App hilft uns zu verstehen, wenn etwas schief geht. Sie sendet anonyme Berichte an uns, die uns helfen, die App zu verbessern."
			}
		},
		"general" : {
			"none-above" : "Keines davon",
			"yes" : "Ja",
			"choose-one" : "Wähle eine (1) Option:",
			"choose-seat" : "Bitte gib an, wo du dich auf dieser Skala wiederfindest:",
			"completely" : "Vollständiges Vertrauen",
			"no" : "Nein",
			"text-input-shadow-text" : "Gib hier deine Antwort ein",
			"choose-one-or-more" : "Bitte einen oder mehrere Einträge aus der Liste auswählen:",
			"very" : "Sehr",
			"not-at-all" : "Gar nicht",
			"select-all-apply" : "Bitte alles Zutreffende auswählen:",
			"i-dont-know" : "Ich habe keine Ahnung",
			"enter-answer-below" : "Bitte trage hier deine Antwort ein:",
			"choose-up-to" : "Bitte bis zu {{max_selections}} Antworten aus der Liste auswählen:"
		},
		"intro" : {
			"author" : "Autor",
			"expires" : "Läuft ab",
			"button" : {
				"continue" : "Umfrage fortführen",
				"results" : "Ergebnisse ansehen",
				"view" : "Antworten ansehen"
			},
			"survey_by" : "Umfrage von",
			"published" : "Veröffentlicht",
			"submitted" : "Versandt"
		},
		"settings" : {
			"section" : {
				"developer" : "Entwickler",
				"feedback" : "Feedback",
				"preferences" : "Allgemein",
				"notices" : "Hinweise"
			},
			"title" : "Einstellungen",
			"items" : {
				"send_us_feedback" : "Sende uns Feedback",
				"languages" : "Sprachen",
				"all_screens" : "Alle Screens",
				"analytics" : "Analytik",
				"introduction" : "Einführung wiederholen",
				"feedback" : "Sende uns Feedback",
				"data_collection" : "Datenschutz",
				"terms_conditions" : "Bedingungen und Konditionen",
				"imprint" : "Impressum",
				"about" : "Über uns"
			},
			"back_to_settings" : "Zurück zu den Einstellungen"
		},
		"home" : {
			"tabs" : {
				"submitted" : "Übermittelt",
				"expired" : "Abgelaufen",
				"featured" : "Featured"
			},
			"notification" : {
				"title" : "Prüfe auf neue Umfragen"
			},
			"expired_answers" : {
				"not_submitted" : "Abgelaufen und nicht versandt"
			},
			"message" : "Der Einsendeschluss ist am",
			"current_answers" : {
				"of" : "von",
				"answered" : "beantwortet",
				"questions" : "Fragen"
			},
			"no_surveys" : "Derzeit sind keine Umfragen verfügbar. Schaue später noch einmal nach!",
			"submitted_answers" : {
				"closing_message" : "Diese Umfrage wird am {{closingDate}} geschlossen.",
				"thank_you" : "Danke, dass du an der Umfrage teilgenommen hast!",
				"results_available" : "Resultate jetzt verfügbar"
			}
		},
		"validation" : {
			"only-one-word" : "Bitte gib nur ein Wort ein"
		},
		"loading" : {
			"by" : "von"
		},
		"imprint" : {
			"description" : "polypoly GmbH\nThorsten Dittmar\nRichardstr. 85/86\n12043 Berlin\nhello@polypoly.eu\n\n+49 30 62934054\nUSt-ID: DE324790734"
		},
		"test" : {
			"test-key1" : "Der Testschlüssel wurde erfolgreich übersetzt",
			"test-v2" : "Testwert2",
			"test-v1" : "Testwert1"
		}
	}
};

var resources = {
  en: en,
  de: de,
};

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: false,
    resources: resources,
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

// A PpQuestion is a single question in a questionnaire.
//
// The different types of questions (binary, text, single / multiple choice) are defined by subclasses.
//
// - Questions may be conditional on previous answers, see the activationCondition.
// - The explanation is a short 1 line hint on how to interpret / answer the question.
//

class PpQuestion extends PpQObject {
  constructor(description) {
    super();
    this._id = nextGlobalId();
    this._index = null;
    this._description = description;
    this._activationCondition = new PpTrueCondition();
    this._explanation = '';
    this._questionnaire = null;
  }

  get id() {
    return this._id;
  }

  get index() {
    return this._index;
  }

  set index(index) {
    this._index = index;
  }

  get questionnaire() {
    return this._questionnaire;
  }

  set questionnaire(questionnaire) {
    this._questionnaire = questionnaire;
  }

  get question_language() {
    return this.questionnaire.question_language;
  }

  activationCondition() {
    return this._activationCondition;
  }

  setActivationCondition(condition) {
    this._activationCondition = condition;
    condition.question = this;
    return this;
  }

  description() {
    return i18next.t(this._description);
  }

  setDescription(a_string) {
    this._description = a_string;
    return this;
  }

  explanation() {
    return i18next.t(this._explanation);
  }

  setexplanation(explanation) {
    this._explanation = explanation;
    return this;
  }

  isActive() {
    return this._activationCondition.isActive();
  }

  isFirst() {
    return this.index === 1;
  }

  screen() {
    throw Error('subclass responsibility');
  }

  isAnswered() {
    throw Error('subclass responsibility');
  }

  value() {
    throw Error('subclass responsibility');
  }

  toJSON() {
    let jsonObject = super.toJSON();
    if (this._questionnaire != null) {
      jsonObject._questionnaire = this._questionnaire.id;
    }
    return jsonObject;
  }

  postJSONLoad(questionnaire) {
    super.postJSONLoad();
    if (this._questionnaire != null) {
      assert(questionnaire.id == this._questionnaire);
      this._questionnaire = this.questionnaire;
    }
    this._activationCondition.postJSONLoad(questionnaire);
  }

  // Update the receiver based on the supplied answer (JSON object)
  loadAnswer(answer) {
    throw Error('subclass responsibility');
  }
}

// PpChoice repesents a single option within a single- or multiple-
// choice question.
//
// Instance Variables:
//
// - id uniquely identifies the question with the global scope.
//   See PpID.js for a description of global UID management.
// - question holds the question to which this choice belongs.
//   This is cleared and reloaded as part of
//   serialisation / deserialisation.
// - index is the choice number in the question
// - enabled indicates whether the corresponding UI element should
//   be enabled or not.  It is managed by the question.
//
class PpChoice extends PpQObject {
  constructor() {
    super();
    this._id = nextGlobalId();
    this._question = null;
    this._index = null;
    this._enabled = true;
  }

  get id() {
    return this._id;
  }

  get question() {
    return this._question;
  }

  set question(question) {
    this._question = question;
  }

  get index() {
    return this._index;
  }

  set index(index) {
    this._index = index;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled) {
    this._enabled = enabled;
  }

  // Set the selection state of the receiver
  selected(a_boolean) {
    if (a_boolean) {
      this.beSelected();
    } else {
      this.beNotSelected();
    }
  }

  beSelected() {
    this._question.selectChoice(this);
    this._question.updateEnabled();
  }

  beNotSelected() {
    this._question.updateEnabled();
  }

  isSelected() {
    return false;
  }

  value() {
    throw Error('subclass responsibility');
  }

  toJSON() {
    let jsonObject = super.toJSON();
    // Don't save the question, it will be restored on load
    jsonObject._question = null;
    return jsonObject;
  }

  postJSONLoad(question) {
    super.postJSONLoad();
    this._question = question;
  }
}

class PpTextualChoice extends PpChoice {
  constructor(description) {
    super();
    this.is_selected = false;
    this._description = description;
  }

  beSelected() {
    this.is_selected = true;
    super.beSelected();
    return this;
  }

  beNotSelected() {
    this.is_selected = false;
    super.beNotSelected();
    return this;
  }

  description() {
    return this._description;
  }

  setDescription(a_string) {
    this._description = a_string;
    return this;
  }

  isSelected() {
    return this.is_selected;
  }

  value() {
    return i18next.t(this._description);
  }
}

//module.exports = PpTextualChoice;

class PpChoiceQuestion extends PpQuestion {
    constructor(description) {
        super(description);
        this._choices = [];
    }

    choices() {
        return this._choices;
    }

    selectChoice() {
        // Subclasses will override with required behaviour
    }

    // updateEnabled()
    //
    // The state of one or more of the receiver's choices have changed.
    // Update the other choices as required.
    // This will be overridden by subclasses if required.
    //
    updateEnabled() {
    }

    addTextualChoiceWithDescription(a_string) {
        let choice = new PpTextualChoice(a_string);

        this._choices[this._choices.length] = choice;
        choice.question = this;
        choice.index = this._choices.length - 1;

        return this;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        this._choices.forEach(choice => choice.question = this);
    }

    toString() {
        var result = this.constructor.name + '(';
        this.choices().forEach(choice => {
            result += choice.index + ': ' + choice.isSelected() + ', ';
        });
        result += ')';
        return result;
    }
}

//module.exports = PpChoiceQuestion;

//
// Multiple choice questions are those typically represented by
// check boxes, where the user can select or or more options.
//
// - max_selections_allowed is the maximum number of choices the
//   user can make for this question
// - Exclusion groups are defined below
//
// Exclusion Groups:
//
// Questions will often include a final option of "none of the above" or
// similar.  Exclusion Groups are a generalisation of this requirement that
// means that whenever a selection is made within a group, all choices outside
// that group are automatically deselected.
//
// Exclusion groups are repesented as a collection of groups, as an
// array of arrays.  Each group consists of the index of the member questions.
//

class PpMultipleChoiceQuestion extends PpChoiceQuestion {
  constructor(description) {
    super(description);
    this._max_selections_allowed = Infinity;
    this._exclusion_groups = [];
  }

  maxSelectionsAllowed() {
    if (this._max_selections_allowed == undefined ||
      this._max_selections_allowed == null) {
      return Infinity;
    } else {
      return this._max_selections_allowed;
    }
  }

  setMaxSelectionsAllowed(an_integer) {
    assert(an_integer > 1);
    this._max_selections_allowed = an_integer;
    return this;
  }

  get exclusion_groups() {
    return this._exclusion_groups;
  }

  set exclusion_groups(an_array) {
    this._exclusion_groups = an_array;
  }

  explanation() {
    if (this._explanation.length > 0) {
      return super.explanation();
    }
    if (this._max_selections_allowed == undefined ||
      this._max_selections_allowed == null ||
      this._max_selections_allowed == Infinity) {
      return i18next.t('general.choose-one-or-more');
    } else {
      return i18next.t('general.choose-up-to', {max_selections: this.maxSelectionsAllowed()});
    }
  }

  isAnswered() {
    return this.selectedChoices().length > 0;
  }

  value() {
    return this.selectedChoices().map(choice => choice.value());
  }

  screen() {
    return 'MultipleChoiceQuestion';
  }

  selectedChoices() {
    return this._choices.filter(item => item.isSelected());
  }

  selectedChoiceIds() {
    return this.selectedChoices().map(choice => choice.id);
  }

  // Answer the object to be stored in the answer json document.
  // This is the ids of selected choices.
  answer() {
    return this.selectedChoiceIds();
  }

  // The supplied choice has been selected.
  //
  // If the choice is part of an exclusion group, deselect all choices
  // that are part of other exclusion groups.
  //
  // If maxSelectionsAllowed has been reached, ensure that only the
  // selected choices are enabled.
  selectChoice(choice) {
    // Find the exclusion_group the choice is a member of
    let exclusion_group = this._exclusion_groups.find(
        group => group.find(index => index == choice.index) != undefined);
    // If none, no further action requried
    if (exclusion_group == undefined) {
      return;
    }
    // Deselect choices that are a member of other groups
    this._exclusion_groups.forEach(group => {
      if (group != exclusion_group) {
        group.forEach(choice_index => {
          if (this.choices()[choice_index].isSelected()) {
            this.choices()[choice_index].beNotSelected();
          }
        });
      }
    });
  }

  // updateEnabled()
  //
  // If maxSelectionsAllowed has been reached, ensure that only the
  // selected choices are enabled.
  //
  updateEnabled() {
    if (this.selectedChoices().length >= this.maxSelectionsAllowed()) {
      this.choices().forEach(choice => {
        choice.enabled = choice.isSelected();
      });
    } else {
      this.choices().forEach(choice => choice.enabled = true);
    }
  }

  // Update the receiver based on the supplied answer (JSON object)
  loadAnswer(answer) {
    assert(answer.questionId === this.id);
    this._choices.forEach(choice => choice.beNotSelected());
    answer.answer.forEach(value => {
      this._choices.find(choice => choice.id === value).beSelected();
    });
  }

  postJSONLoad(questionnaire) {
    super.postJSONLoad(questionnaire);
    if (this._max_selections_allowed == null) {
      this._max_selections_allowed = Infinity;
    }
  }

}

class PpSingleChoiceQuestion extends PpChoiceQuestion {
    constructor(description) {
        super(description);
        this._explanation = 'general.choose-one';
    }

    selectedChoice() {
        return this._choices.find(item => item.isSelected());
    }

    isAnswered() {
        return this.selectedChoice() != undefined;
    }

    value() {
        return this.selectedChoice().value();
    }

    screen() {
        return 'MultipleChoiceQuestion';
    }

    // Answer the object to be stored in the answer json document.
    // This is the ids of selected choices.
    answer() {
        if (this.isAnswered()) {
            return this.selectedChoice().id;
        } else {
            return null;
        }
    }

    // The supplied choice has been selected.
    //
    // Deselect all other choices
    //
    selectChoice(choice) {
        this.choices().forEach(each => {
            if (each !== choice) {
                each.beNotSelected();
            }
        });
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        assert(answer.questionId == this.id);
        this._choices.forEach(choice => choice.beNotSelected());
        if (answer.answer != null) {
            this._choices.find(choice => choice.id == answer.answer)
                .beSelected();
        }
    }

}

//module.exports = PpSingleChoiceQuestion;

class PpTextQuestion extends PpQuestion {
    constructor(description) {
        super(description);
        this._answer = null;
        this._explanation = 'general.enter-answer-below';
        this._max_length = null;
        this._multiline = false;
        this._number_of_lines = 1;
        this._one_word_validation = false;
    }

    get maxLength() {
        return this._max_length;
    }

    set maxLength(an_integer) {
        this._max_length = an_integer;
    }

    get multiline() {
        return this._multiline;
    }

    set multiline(a_boolean) {
        this._multiline = a_boolean;
    }

    get numberOfLines() {
        return this._number_of_lines;
    }

    set numberOfLines(an_integer) {
        this._number_of_lines = an_integer;
    }

    get oneWordValidation() {
        return this._one_word_validation;
    }

    set oneWordValidation(a_boolean) {
        this._one_word_validation = a_boolean;
    }

    isAnswered() {
        if (this._answer == undefined || this._answer == null) {
            return false;
        }
        return this._answer.length > 0;
    }

    answer() {
        return this._answer;
    }

    setAnswer(value) {
        if (this.maxLength != null && value.length > this.maxLength) {
            throw Error('Answer length too long: ' + value.length + ' > ' + this.maxLength);
        }
        this._answer = value;
        return this;
    }

    value() {
        if (this._answer == null) {
            return null;
        }
        return i18next.t(this._answer);
    }

    screen() {
        return 'TextQuestion';
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        assert(answer.questionId == this.id);
        this._answer = answer.answer;
    }

}

//module.exports = PpTextQuestion;

class PpDependOnMultipleChoice extends PpDependOnAnotherQuestion {
    constructor(dependent_question, choices) {
        super(dependent_question);
        this._choices = choices;
    }

    choices() {
        return this._choices;
    }

    setChoices(choices) {
        this._choices = choices;
        return this;
    }

    // Answer a boolean indicating whether the receiver is active,
    // i.e. all the choices have been selected.
    isActive() {
        return this._choices.find((choice) => !choice.isSelected()) == undefined;
    }

    toJSON() {
        let choices = [];
        // Save the index of the choices and reconstruct on deseralisation
        this._choices.forEach((choice, index) => {
            choices[index] = this._dependent_question.choices().indexOf(choice);
        });
        let jsonObject = super.toJSON();
        jsonObject._choices = choices;
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        let choices = [];
        // Reconstruct the choices
        this._choices.forEach((choiceIndex, index) => {
            choices[index] = this._dependent_question.choices()[choiceIndex];
        });
        this._choices = choices;
    }
}

//
// PpDependOnLanguage is used to activate or deactivate questions
// based on the question language of the questionnaire (which may 
// be different from the language the questionnaire is displayed in).
//
// The language tag is assumed to be in the format:
//
//      <languageCode>_<countryCode>
// e.g.
//      en_AU
//
// Comparisons are made by simply checking if the language 
// string begins with the specified language string, so specifying
// "en" will match all English language variants, while "en_AU" is 
// specific to Australian English.
//
// String encoding, e.g. "en_AU.UTF-8", is ignored.
//
// Instance variables:
//
// - _language_tags: The languages to match against.
//   The condition is active if any one of the tags matches.
//

class PpDependOnLanguage extends PpActivationCondition {
    constructor(language_tags) {
        super();
        this._language_tags = language_tags.map(x => x.toLowerCase());
    }

    get language_tags() {
        return this._language_tags;
    }

    set language_tags(tags) {
        this._language_tag = tags;
    }

    // Answer the language the questionnaire is presentated in.
    get question_language() {
        return this.question.question_language;
    }

    isActive() {
        let language = this.question_language.toLowerCase();
        return this._language_tags
            .find(tag => language.startsWith(tag)) != undefined;
    }
}

//

class PpRangeQuestion extends PpQuestion {
    constructor (description) {
        super(description);
        this._explanation = 'general.choose-seat';
        this._min = 0;
        this._max = 0;
        this._steps = null;
        this._labels = [];
        this._value = null;
    }

    screen() {
        return 'RangeQuestion';
    }

    get min() {
        return this._min;
    }

    set min(min) {
        this._min = min;
    }

    get max() {
        return this._max;
    }

    set max(max) {
        this._max = max;
    }

    get steps() {
        return this._steps;
    }

    set steps(steps) {
        this._steps = steps;
    }

    get labels() {
        return this._labels.map(label => i18next.t(label));
    }

    set labels(labels) {
        this._labels = labels;
    }

    get raw_labels() {
        return this._labels;
    }

    isAnswered() {
        return this._value != null;
    }

    values() {
        let values = [];
        let current = this.min;

        while (current < this.max) {
            values.push(current);
            current += this.steps;
        }        values.push(this.max);
        return values;
    }

    value() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        assert(answer.questionId == this.id);
        this._value = answer.answer;
    }

}

//module.exports = PpRangeQuestion;

//

class PpCompoundActivationCondition extends PpActivationCondition {
    constructor(question) {
        super();
        this._children = [];
    }

    get children() {
        return this._children;
    }

    addChild(childCondition) {
        this._children[this._children.length] = childCondition;
        return this;
    }

    removeChild(childCondition) {
        let index = this._children.indexOf(childCondition);
        if (index < 0) {
            throw Error('Unable to find child to be removed');
        }
        this._children.splice(index, 1);
        return this;
    }
}

//

class PpAndActivationCondition extends PpCompoundActivationCondition {
    isActive() {
        return this.children.find((child) => !child.isActive()) == undefined
    }
}

//

class PpOrActivationCondition extends PpCompoundActivationCondition {
    isActive() {
        return this.children.find((child) => child.isActive()) != undefined
    }
}

//

class PpFalseCondition extends PpActivationCondition {

    isActive() {
        return false;
    }
}

//
// PpAuthor - store details about the author of the questionnaire
//
// - _name: Author's name
// - _link: URL to the author's home page
// - _description: A description of the author.  This should be a key in to 
//   the questionnaire translation files.
// - _logo: base64 encoded image
//
class PpAuthor extends PpQObject {
    constructor() {
      super();
      this._name = null;
      this._link = null;
      this._description = null;
      this._logo = null;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get link() {
        return this._link;
    }

    set link(url) {
        this._link = url;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    get logo() {
        return this._logo;
    }

    set logo(base64String) {
        this._logo = base64String;
    }
}

class PpLegal extends PpQObject {
  constructor() {
    super();
    this._content = null;
    this._link = null;
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }

  get link() {
    return this._link;
  }

  set link(url) {
    this._link = url;
  }
}

//
// PpTermsAndConditions - store details about the T&C of the questionnaire
//
// - _text: The text to be displayed.
// - _link: The primary link to the web page containing the T&C
//
class PpTermsAndConditions extends PpQObject {
    constructor() {
      super();
      this._link = null;
      this._text = null;
    }

    get link() {
        return this._link;
    }

    set link(url) {
        this._link = url;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }

}

//
// PpPrivacyPolicy - store details about the T&C of the questionnaire
//
// - _text: The text to be displayed.
// - _link: The primary link to the web page containing the T&C
//
class PpPrivacyPolicy extends PpQObject {
    constructor() {
      super();
      this._link = null;
      this._text = null;
    }

    get link() {
        return this._link;
    }

    set link(url) {
        this._link = url;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }

}

class PpQuestionFactory {
  textQuestion(description) {
    return new PpTextQuestion(description);
  }

  singleChoiceQuestion(description) {
    return new PpSingleChoiceQuestion(description);
  }

  multipleChoiceQuestion(description) {
    return new PpMultipleChoiceQuestion(description);
  }

  rangeQuestion(description) {
    return new PpRangeQuestion(description);
  }

  questionnaire() {
    return new PpQuestionnaire();
  }

  author() {
    return new PpAuthor();
  }

  legal() {
    return new PpLegal();
  }

  termsAndConditions() {
    return new PpTermsAndConditions();
  }

  privacyPolicy() {
    return new PpPrivacyPolicy();
  }

  dependOnSingleChoice(question, choice) {
    return new PpDependOnSingleChoice(question, choice);
  }

  dependOnMultipleChoice(question, choices) {
    return new PpDependOnMultipleChoice(question, choices);
  }

  dependOnLanguage(language_tags) {
    return new PpDependOnLanguage(language_tags);
  }

  andCondition() {
    return new PpAndActivationCondition();
  }

  orCondition() {
    return new PpOrActivationCondition();
  }

  trueCondition() {
    return new PpTrueCondition();
  }

  falseCondition() {
    return new PpFalseCondition();
  }
}

//module.exports = PpQuestionFactory;

class PpQuestionnaireLinkResult extends PpQObject {
  constructor() {
    super();
    this._url = null;
  }

  get url() {
    return this._url;
  }

  set url(newUrl) {
    this._url = newUrl;
  }
}

//

const KnownClasses = {
  PpActivationCondition: PpActivationCondition,
  PpDependOnSingleChoice: PpDependOnSingleChoice,
  PpQuestionnaire: PpQuestionnaire,
  PpMultipleChoiceQuestion: PpMultipleChoiceQuestion,
  PpSingleChoiceQuestion: PpSingleChoiceQuestion,
  PpChoice: PpChoice,
  PpTextQuestion: PpTextQuestion,
  PpChoiceQuestion: PpChoiceQuestion,
  PpQObject: PpQObject,
  PpTextualChoice: PpTextualChoice,
  PpDependOnAnotherQuestion: PpDependOnAnotherQuestion,
  PpTrueCondition: PpTrueCondition,
  PpQuestionFactory: PpQuestionFactory,
  PpDependOnMultipleChoice: PpDependOnMultipleChoice,
  PpQuestion: PpQuestion,
  PpRangeQuestion: PpRangeQuestion,
  PpQuestionnaireLinkResult: PpQuestionnaireLinkResult,
  PpAuthor: PpAuthor,
  PpLegal: PpLegal,
  PpTermsAndConditions: PpTermsAndConditions,
  PpPrivacyPolicy: PpPrivacyPolicy,
};

//
// Deserialise the suimport Pplied key / value pairs.
//
// Any value that has a __class__ object can create an instance of itself
// from 'the json object.
//
function PpQReplacer(key, value) {
  if (value != null && value.__class__) {
    return KnownClasses[value.__class__].fromJSON(value);
  }
  return value;
}

const API_HOME = "https://api.polypoly.tech/v2/";

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

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
exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.not = exports.unsafeCoerce = exports.identity = void 0;
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
});

var Either = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = exports.elem = exports.toError = exports.either = exports.getValidationMonoid = exports.getValidationSemigroup = exports.getValidation = exports.getWitherable = exports.getApplyMonoid = exports.getApplySemigroup = exports.getSemigroup = exports.getEq = exports.getShow = exports.applyEither = exports.URI = exports.sequence = exports.traverse = exports.reduceRight = exports.foldMap = exports.reduce = exports.extend = exports.duplicate = exports.alt = exports.flatten = exports.chainFirst = exports.chain = exports.chainW = exports.apSecond = exports.apFirst = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.filterOrElse = exports.orElse = exports.swap = exports.getOrElse = exports.getOrElseW = exports.fold = exports.fromPredicate = exports.fromOption = exports.stringifyJSON = exports.parseJSON = exports.tryCatch = exports.fromNullable = exports.right = exports.left = exports.isRight = exports.isLeft = void 0;


// -------------------------------------------------------------------------------------
// guards
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 *
 * @category guards
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
 * @category guards
 * @since 2.0.0
 */
function isRight(ma) {
    return isLeft(ma) ? false : true;
}
exports.isRight = isRight;
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
function left(e) {
    return { _tag: 'Left', left: e };
}
exports.left = left;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 *
 * @category constructors
 * @since 2.0.0
 */
function right(a) {
    return { _tag: 'Right', right: a };
}
exports.right = right;
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
    return function (a) { return (a == null ? left(e) : right(a)); };
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
        return right(f());
    }
    catch (e) {
        return left(onError(e));
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
    return ma._tag === 'None' ? left(onNone()) : right(ma.value);
}; };
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? right(a) : left(onFalse(a))); }; };
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
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : onRight(ma.right)); };
}
exports.fold = fold;
/**
 * Less strict version of [`getOrElse`](#getOrElse).
 *
 * @category destructors
 * @since 2.6.0
 */
exports.getOrElseW = function (onLeft) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma.right;
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
    return isLeft(ma) ? right(ma.left) : left(ma.right);
}
exports.swap = swap;
/**
 * @category combinators
 * @since 2.0.0
 */
function orElse(onLeft) {
    return function (ma) { return (isLeft(ma) ? onLeft(ma.left) : ma); };
}
exports.orElse = orElse;
/**
 * @category combinators
 * @since 2.0.0
 */
exports.filterOrElse = function (predicate, onFalse) { return function (ma) {
    return chain_(ma, function (a) { return (predicate(a) ? right(a) : left(onFalse(a))); });
}; };
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
    return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Either';
var map_ = function (ma, f) {
    return isLeft(ma) ? ma : right(f(ma.right));
};
var ap_ = function (mab, ma) {
    return isLeft(mab) ? mab : isLeft(ma) ? ma : right(mab.right(ma.right));
};
var of = right;
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
var throwError_ = left;
/**
 * @internal
 */
exports.applyEither = {
    URI: exports.URI,
    map: map_,
    ap: ap_
};
/**
 * @category instances
 * @since 2.0.0
 */
function getShow(SE, SA) {
    return {
        show: function (ma) { return (isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
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
            return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
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
        concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right))); }
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
        concat: function (x, y) { return (isLeft(x) ? x : isLeft(y) ? y : right(S.concat(x.right, y.right))); }
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
        empty: right(M.empty)
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
        sequence: exports.sequence,
        reduce: reduce_,
        foldMap: foldMap_,
        reduceRight: reduceRight_,
        wither: wither,
        wilt: wilt
    };
}
exports.getWitherable = getWitherable;
// TODO: remove in v3
/**
 * @category instances
 * @since 2.0.0
 */
function getValidation(S) {
    return {
        URI: exports.URI,
        _E: undefined,
        map: map_,
        of: of,
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
        throwError: throwError_,
        ap: function (mab, ma) {
            return isLeft(mab)
                ? isLeft(ma)
                    ? left(S.concat(mab.left, ma.left))
                    : mab
                : isLeft(ma)
                    ? ma
                    : right(mab.right(ma.right));
        },
        alt: function (fx, f) {
            if (isRight(fx)) {
                return fx;
            }
            var fy = f();
            return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy;
        }
    };
}
exports.getValidation = getValidation;
/**
 * @category instances
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
 * @category instances
 * @since 2.0.0
 */
function getValidationMonoid(SE, SA) {
    return {
        concat: getValidationSemigroup(SE, SA).concat,
        empty: right(SA.empty)
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
    of: of,
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
    throwError: throwError_
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
});

var Either$1 = /*@__PURE__*/unwrapExports(Either);

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

var pipeable = /*@__PURE__*/unwrapExports(pipeable_1);

var Schemable = createCommonjsModule$1(function (module, exports) {
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

var Guard = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemableGuard = exports.URI = exports.lazy = exports.sum = exports.union = exports.intersection = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.nullable = exports.refinement = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.never = exports.literal = void 0;
/**
 * @since 2.2.0
 */

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
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
 * @category primitives
 * @since 2.2.0
 */
exports.never = {
    is: function (_u) { return false; }
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.string = {
    is: function (u) { return typeof u === 'string'; }
};
/**
 * @category primitives
 * @since 2.2.0
 */
exports.number = {
    is: function (u) { return typeof u === 'number'; }
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
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.2.0
 */
function refinement(from, refinement) {
    return {
        is: function (u) { return from.is(u) && refinement(u); }
    };
}
exports.refinement = refinement;
/**
 * @category combinators
 * @since 2.2.0
 */
function nullable(or) {
    return {
        is: function (u) { return u === null || or.is(u); }
    };
}
exports.nullable = nullable;
/**
 * @category combinators
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
 * @category combinators
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
 * @category combinators
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
 * @category combinators
 * @since 2.2.0
 */
function array(items) {
    return refinement(exports.UnknownArray, function (us) { return us.every(items.is); });
}
exports.array = array;
/**
 * @category combinators
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
 * @category combinators
 * @since 2.2.0
 */
function intersection(left, right) {
    return {
        is: function (u) { return left.is(u) && right.is(u); }
    };
}
exports.intersection = intersection;
/**
 * @category combinators
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
 * @category combinators
 * @since 2.2.0
 */
function sum(tag) {
    return function (members) {
        return refinement(exports.UnknownRecord, function (r) {
            var v = r[tag];
            if (v in members) {
                return members[v].is(r);
            }
            return false;
        });
    };
}
exports.sum = sum;
/**
 * @category combinators
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

var Decoder = createCommonjsModule$1(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemableDecoder = exports.altDecoder = exports.functorDecoder = exports.URI = exports.alt = exports.map = exports.union = exports.sum = exports.lazy = exports.intersection = exports.intersect = exports.tuple = exports.array = exports.record = exports.partial = exports.type = exports.nullable = exports.parse = exports.refinement = exports.withExpected = exports.UnknownRecord = exports.UnknownArray = exports.boolean = exports.number = exports.string = exports.never = exports.literal = exports.fromGuard = exports.of = exports.isNotEmpty = exports.failure = exports.success = exports.tree = void 0;
/**
 * @since 2.2.0
 */




var empty = [];
/**
 * @category DecodeError
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
 * @category DecodeError
 * @since 2.2.0
 */
function success(a) {
    return Either.right(a);
}
exports.success = success;
/**
 * @category DecodeError
 * @since 2.2.0
 */
function failure(message) {
    return Either.left([tree(message)]);
}
exports.failure = failure;
/**
 * @category DecodeError
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
 * @category constructors
 * @since 2.2.3
 */
function of(a) {
    return {
        decode: function () { return success(a); }
    };
}
exports.of = of;
/**
 * @category constructors
 * @since 2.2.0
 */
function fromGuard(guard, expected) {
    return {
        decode: function (u) { return (guard.is(u) ? success(u) : failure("cannot decode " + JSON.stringify(u) + ", should be " + expected)); }
    };
}
exports.fromGuard = fromGuard;
/**
 * @category constructors
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
 * @category primitives
 * @since 2.2.0
 */
exports.never = fromGuard(Guard.never, 'never');
/**
 * @category primitives
 * @since 2.2.0
 */
exports.string = fromGuard(Guard.string, 'string');
/**
 * @category primitives
 * @since 2.2.0
 */
exports.number = fromGuard(Guard.number, 'number');
/**
 * @category primitives
 * @since 2.2.0
 */
exports.boolean = fromGuard(Guard.boolean, 'boolean');
/**
 * @category primitives
 * @since 2.2.0
 */
exports.UnknownArray = fromGuard(Guard.UnknownArray, 'Array<unknown>');
/**
 * @category primitives
 * @since 2.2.0
 */
exports.UnknownRecord = fromGuard(Guard.UnknownRecord, 'Record<string, unknown>');
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
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
 * @category combinators
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
 * @category combinators
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
 * @category combinators
 * @since 2.2.0
 */
function nullable(or) {
    return union(literal(null), or);
}
exports.nullable = nullable;
/**
 * @category combinators
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
 * @category combinators
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
 * @category combinators
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
 * @category combinators
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
 * @category combinators
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
 * @category combinators
 * @since 2.2.0
 */
function intersection(left, right) {
    return {
        decode: function (u) {
            var ea = left.decode(u);
            var eb = right.decode(u);
            if (Either.isLeft(ea)) {
                return Either.isLeft(eb) ? Either.left(ea.left.concat(eb.left)) : ea;
            }
            if (Either.isLeft(eb)) {
                return eb;
            }
            return success(intersect(ea.right, eb.right));
        }
    };
}
exports.intersection = intersection;
/**
 * @category combinators
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
 * @category combinators
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
                if (v in members) {
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
 * @category combinators
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
 * @category Functor
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
 * @category Alt
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
 * @category instances
 * @since 2.2.0
 */
exports.URI = 'io-ts/Decoder';
/**
 * @category instances
 * @since 2.2.3
 */
exports.functorDecoder = {
    URI: exports.URI,
    map: map_
};
/**
 * @category instances
 * @since 2.2.3
 */
exports.altDecoder = {
    URI: exports.URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
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

var Decoder$1 = /*@__PURE__*/unwrapExports(Decoder);

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

var index = /*@__PURE__*/unwrapExports(dist);

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

var stream = createCommonjsModule$1(function (module, exports) {
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
    const stream$1 = stream.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeSingleAsync(stream$1);
}
exports.decodeAsync = decodeAsync;
function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream$1 = stream.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeArrayStream(stream$1);
}
exports.decodeArrayStream = decodeArrayStream;
function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream$1 = stream.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeStream(stream$1);
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

var index$1 = /*@__PURE__*/unwrapExports(dist$1);

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
        const codec = new index$1.ExtensionCodec();

        this.registerStrict(codec);

        codec.register({
            type: msgPackEtypeUndef,
            encode: value => value instanceof Undefined ? index$1.encode(null) : null,
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
                        return index$1.encode([name, value[serialize]()], { extensionCodec: codec });

                    const raw = Object.entries(value);
                    const entries = raw.map(([key, value]) => {
                        if (value === undefined)
                            return [key, new Undefined()];
                        else
                            return [key, value];
                    });

                    return index$1.encode([name, entries], { extensionCodec: codec })
                }

                return null;
            },
            decode: buffer => {
                const [name, raw] = index$1.decode(buffer, { extensionCodec: codec }) ;
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
            encode: value => value instanceof Error ? index$1.encode(value.message) : null,
            decode: buffer => new Error(index$1.decode(buffer) )
        });

        return codec;
    }

    encode(value) {
        if (!this.codec)
            this.codec = this.makeCodec();

        return index$1.encode(value, { extensionCodec: this.codec });
    }

    decode(buffer) {
        if (!this.codec)
            this.codec = this.makeCodec();

        return index$1.decode(buffer, { extensionCodec: this.codec });
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
    return index.mapPort(
        rawPort,
        buf => podBubblewrap.decode(buf),
        data => podBubblewrap.encode(data)
    );
}

class RemoteClientPod  {

    

    static fromFetch(url, fetch = window.fetch) {
        const port = index.bubblewrapFetchPort(
            url,
            podBubblewrap,
            fetch
        );

        return new RemoteClientPod(port, dataFactory);
    }

    static fromRawPort(rawPort) {
        return new RemoteClientPod(index.liftClient(bubblewrapPort(rawPort)), dataFactory);
    }

    constructor(
         clientPort,
          dataFactory
    ) {this.clientPort = clientPort;this.dataFactory = dataFactory;
        this.rpcClient = endpointClient(index.client(clientPort));
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

const iframeInnerDecoder = Decoder$1.type({
    type: Decoder$1.literal("iframe")
});

const fetchDecoder = Decoder$1.type({
    type: Decoder$1.literal("fetch"),
    uri: Decoder$1.string
});

const specDecoder = Decoder$1.sum("type")({
    iframe: iframeInnerDecoder,
    fetch: fetchDecoder
});

function parseSpec(spec) {
    const parsed = JSON.parse(spec);
    return pipeable.pipe(
        specDecoder.decode(parsed),
        Either$1.fold(
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
            return RemoteClientPod.fromRawPort(await index.iframeInnerPort(""));
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

async function downloadQuestionnaireData(questionnaireId) {
    const api = await pod;
    const statusCheckEndpoint = API_HOME + 'questionnaire/' + questionnaireId + '/content';
    return timeoutPromise(10000, api.polyOut.fetch(statusCheckEndpoint, {
        headers: {
            'User-Agent': userAgent(),
        },
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        else {
            let error = new Error(response.statusText);
            throw error;
        }
    }));
}
async function downloadQuestionnaireResults(questionnaireId) {
    const api = await pod;
    const statusCheckEndpoint = API_HOME + 'questionnaire/' + questionnaireId + '/results';
    return timeoutPromise(10000, api.polyOut.fetch(statusCheckEndpoint, {
        headers: {
            'User-Agent': userAgent(),
        },
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        else {
            let error = new Error(response.statusText);
            throw error;
        }
    }));
}
async function downloadActiveQuestionnairesMetadata() {
    const api = await pod;
    const statusCheckEndpoint = API_HOME + 'questionnaires';
    return timeoutPromise(10000, api.polyOut.fetch(statusCheckEndpoint, {
        headers: {
            'User-Agent': userAgent(),
        },
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        else {
            let error = new Error(response.statusText);
            throw error;
        }
    }));
}
//TODO implement timeout
function timeoutPromise(timeout, promise) {
    return promise;
}
//TODO implement agent with versionnumber
function userAgent() {
    return "PolyPoly";
}

const storage = new Map();
//TODO implement storage
const AsyncStorage = {
    async getItem(key) {
        return storage.get(key);
    },
    async setItem(key, value) {
        storage.set(key, value);
    }
};

const INDEX_KEY = 'questionaires-index';
function questionnaireDataStorageId(questionnaireId) {
    return 'questionnaire-' + questionnaireId + '-data';
}
function questionnaireResultsStorageId(questionnaireId) {
    return 'questionnaire-' + questionnaireId + '-results-update';
}
async function loadQuestionnaireIndex() {
    const questionairesIndexJson = await AsyncStorage.getItem(INDEX_KEY);
    if (questionairesIndexJson == null) {
        return [];
    }
    return JSON.parse(questionairesIndexJson);
}
async function hasQuestionnaires() {
    const questionairesIndex = await loadQuestionnaireIndex();
    return questionairesIndex && questionairesIndex.length > 0;
}
async function loadQuestionnaireDataJson(questionnaireIndex) {
    if (!(await hasQuestionnaires())) {
        return null;
    }
    const questionnaireDataJson = await AsyncStorage.getItem(questionnaireDataStorageId(questionnaireIndex));
    if (!questionnaireDataJson) {
        return null;
    }
    return questionnaireDataJson;
}
async function appendQuestionnaireToIndex(questionnaireId) {
    let questionairesIndex = await loadQuestionnaireIndex();
    questionairesIndex.push(questionnaireId);
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(questionairesIndex));
}
async function storeQuestionnaireData(questionnaireId, questionnaireDataJson) {
    await AsyncStorage.setItem(questionnaireDataStorageId(questionnaireId), questionnaireDataJson);
}
async function loadStoredQuestionnaireResultsJson(questionnaireId) {
    return await AsyncStorage.getItem(questionnaireResultsStorageId(questionnaireId));
}
async function storeQuestionnaireResults(questionnaireId, resultsData) {
    await AsyncStorage.setItem(questionnaireResultsStorageId(questionnaireId), JSON.stringify(resultsData));
    return resultsData;
}

function questionnaireAnswersStorageId(questionnaireId) {
    return 'questionnaire-' + questionnaireId + '-answers';
}
async function storeAnswers(questionnaire) {
    const storageKey = questionnaireAnswersStorageId(questionnaire.id);
    const jsonContent = JSON.stringify(questionnaire.answerJSON());
    await AsyncStorage.setItem(storageKey, jsonContent);
}
async function loadAnswers(questionnaire) {
    const storageKey = questionnaireAnswersStorageId(questionnaire.id);
    const answers = await AsyncStorage.getItem(storageKey);
    if (answers != null) {
        const content = JSON.parse(answers);
        questionnaire.loadAnswers(content);
    }
}

const QuestionnaireListContext = React.createContext({});
const QuestionnaireListProvider = ({ children }) => {
    const { i18n } = useTranslation();
    // State to indicate when the list of questionnaire is initialized.
    const [questionaireInitializationStatus, setQuestionaireInitializationStatus,] = React.useState(false);
    const [questionnaireList, setQuestionnaireList] = React.useState([]);
    const triggerUpdate = () => {
        setQuestionnaireList([...questionnaireList]);
    };
    /**
     * I save questionnaire on disk without notifying any UI updates
     */
    const saveQuestionnaireAnswers = (questionnaire) => {
        storeAnswers(questionnaire);
    };
    const markQuestionaireSubmitted = (questionnaire) => {
        questionnaire.updateSubmittedTime();
        saveQuestionnaireAnswers(questionnaire);
        triggerUpdate();
    };
    const buildQuestionnaireObject = (questionaireDataJson) => {
        const currentQuestionaireData = JSON.parse(questionaireDataJson, PpQReplacer);
        const currentQuestionaire = currentQuestionaireData.questionnaire;
        currentQuestionaire.postJSONLoad();
        currentQuestionaire.loadTranslations(i18n, currentQuestionaireData.languages);
        return currentQuestionaire;
    };
    const ensureLanguage = async (questionnaire) => {
        // If after loading a questionnaire the language is not set, use the current language.
        if (questionnaire.question_language === null) {
            const languageCode = await getStoredLanguage();
            questionnaire.question_language = languageCode;
        }
    };
    const downloadAndStoreQuestionnaire = async function (questionaireMetadata) {
        const responseContent = await downloadQuestionnaireData(questionaireMetadata.questionnaireId);
        const currentQuestionaire = buildQuestionnaireObject(responseContent);
        await storeQuestionnaireData(currentQuestionaire.id, responseContent);
        await appendQuestionnaireToIndex(currentQuestionaire.id);
        // Set the current language as the language of the questionnaire after download.
        await ensureLanguage(currentQuestionaire);
        return currentQuestionaire;
    };
    const getNewActiveQuestionnairesMetadata = async () => {
        const resultValue = await downloadActiveQuestionnairesMetadata();
        const allActiveQuestionnairesMetadata = JSON.parse(resultValue);
        if (allActiveQuestionnairesMetadata === null ||
            allActiveQuestionnairesMetadata.length === 0) {
            return [];
        }
        const questionnairesIndex = questionnaireList.map(questionnaire => questionnaire.id);
        let newMetadata = [];
        for (const questionaireMetadata of allActiveQuestionnairesMetadata) {
            if (!questionnairesIndex.includes(questionaireMetadata.questionnaireId)) {
                newMetadata.push(questionaireMetadata);
            }
        }
        return newMetadata;
    };
    const updateQuestionnaireResults = async (questionnaire) => {
        const responseContent = await downloadQuestionnaireResults(questionnaire.id);
        const responseValue = JSON.parse(responseContent);
        if (responseValue.result_status === 'available' &&
            responseValue.result_url) {
            const result = new PpQuestionnaireLinkResult();
            result.url = responseValue.result_url;
            questionnaire.result = result;
            await storeQuestionnaireResults(questionnaire.id, result.toJSON());
        }
    };
    const updateStoredQuestionnaires = async () => {
        const questionnairesMetadata = await getNewActiveQuestionnairesMetadata();
        let downloadedQuestionnaires = [];
        try {
            for (const questionaireMetadata of questionnairesMetadata) {
                const currentQuestionnaire = await downloadAndStoreQuestionnaire(questionaireMetadata);
                downloadedQuestionnaires.push(currentQuestionnaire);
            }
            const noResultsQuestionnaires = questionnaireList.filter(questionnaire => questionnaire.hasResult() === false &&
                (questionnaire.isSubmitted() || questionnaire.isExpired()));
            for (const questionaire of noResultsQuestionnaires) {
                await updateQuestionnaireResults(questionaire);
            }
        }
        catch (ex) {
            console.log(ex);
        }
        finally {
            setQuestionnaireList([...questionnaireList, ...downloadedQuestionnaires]);
        }
    };
    const loadResults = async (questionnaire) => {
        const questionnaireResultsJson = await loadStoredQuestionnaireResultsJson(questionnaire.id);
        if (questionnaireResultsJson !== null) {
            const questionnaireResults = JSON.parse(questionnaireResultsJson, PpQReplacer);
            questionnaireResults.postJSONLoad();
            questionnaire.result = questionnaireResults;
        }
    };
    /**
     * Main effect: load the questionnaire data from storage when app is started.
     */
    React__default.useEffect(() => {
        const loadInitialQuestionnaires = async function () {
            let loadedQuestionnaires = [];
            const questionnairesIndexList = await loadQuestionnaireIndex();
            for (const questionnaireId of questionnairesIndexList) {
                const currentQuestionaireDataJson = await loadQuestionnaireDataJson(questionnaireId);
                const currentQuestionaire = buildQuestionnaireObject(currentQuestionaireDataJson);
                await loadAnswers(currentQuestionaire);
                await loadResults(currentQuestionaire);
                loadedQuestionnaires.push(currentQuestionaire);
            }
            setQuestionnaireList(loadedQuestionnaires);
        };
        loadInitialQuestionnaires().finally(() => 
        // Mark the questionnaire as initialized in a finally bloc,
        // to be set even if there is an error during initialization.
        setQuestionaireInitializationStatus(true));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (React__default.createElement(QuestionnaireListContext.Provider, { value: {
            triggerUpdate,
            saveQuestionnaireAnswers,
            markQuestionaireSubmitted,
            questionaireInitializationStatus,
            questionnaireList,
            setQuestionnaireList,
            updateStoredQuestionnaires,
        } }, children));
};

const QuestionnaireContext = React.createContext({});
class QuestionnaireHolder {
    constructor(questionnaire) {
        this._questionnaire = questionnaire;
    }
    copy() {
        return new QuestionnaireHolder(this.questionnaire);
    }
    copyWith(newQuestionnaire) {
        return new QuestionnaireHolder(newQuestionnaire);
    }
    get questionnaire() {
        return this._questionnaire;
    }
}
const INITIAL_VALUE = new QuestionnaireHolder(new PpQuestionnaire());
const QuestionnaireProvider = ({ children }) => {
    const [questionnaireHolder, setQuestionnaireHolder] = React.useState(INITIAL_VALUE);
    const [currentQuestion, setCurrentQuestion] = React.useState();
    const switchToNextQuestion = () => {
        const nextQuestion = getQuestionnaire().activeQuestionAfter(currentQuestion);
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
        }
    };
    const switchToPreviousQuestion = () => {
        const previousQuestion = getQuestionnaire().activeQuestionBefore(currentQuestion);
        if (previousQuestion) {
            setCurrentQuestion(previousQuestion);
        }
    };
    const switchToFirstQuestion = () => {
        const firstQuestion = getQuestionnaire().firstActiveQuestion();
        if (firstQuestion) {
            setCurrentQuestion(firstQuestion);
        }
    };
    const setQuestionnaireAndSwitchToFirstUnansweredQuestion = (questionnaire) => {
        setQuestionnaire(questionnaire);
        const unansweredQuestion = questionnaire.firstUnansweredQuestion();
        if (unansweredQuestion) {
            setCurrentQuestion(unansweredQuestion);
        }
    };
    /**
     * @returns {PpQuestionnaire} - the underlying Questionnaire model
     */
    const getQuestionnaire = () => questionnaireHolder.questionnaire;
    const setQuestionnaire = (newQuestionnaire) => {
        setQuestionnaireHolder(questionnaireHolder.copyWith(newQuestionnaire));
    };
    /**
     * Let React know that the questionnaire changed,
     * this will trigger re-rendering of all components
     * that use this content
     */
    const notifyUpdated = () => {
        setQuestionnaireHolder(questionnaireHolder.copy());
    };
    /**
     * Return true if a given question is the first question
     * @param question
     * @returns {boolean}
     */
    const isFirstQuestion = (question) => {
        return getQuestionnaire().isFirstQuestion(question);
    };
    /**
     * Return true if a given question is the last question
     * @param question
     * @returns {boolean}
     */
    const isLastQuestion = (question) => {
        return getQuestionnaire().isLastQuestion(question);
    };
    /**
     * Return true if we are currently at the first question
     * @returns {boolean}
     */
    const isAtFirstQuestion = () => {
        return !currentQuestion || isFirstQuestion(currentQuestion);
    };
    /**
     * Return true if we are currently at the first question
     * @returns {boolean}
     */
    const isAtLastQuestion = () => {
        return currentQuestion && isLastQuestion(currentQuestion);
    };
    return (React__default.createElement(QuestionnaireContext.Provider, { value: {
            questionnaireHolder,
            currentQuestion,
            getQuestionnaire,
            setQuestionnaire,
            isFirstQuestion,
            isAtFirstQuestion,
            isLastQuestion,
            isAtLastQuestion,
            notifyUpdated,
            switchToNextQuestion,
            switchToPreviousQuestion,
            switchToFirstQuestion,
            setQuestionnaireAndSwitchToFirstUnansweredQuestion,
        } }, children));
};

function LoadingScreen() {
    return React__default.createElement("div", null, "Loading");
}

function StartSurveyButton({ questionnaire, route }) {
    const { setQuestionnaireAndSwitchToFirstUnansweredQuestion } = React.useContext(QuestionnaireContext);
    return (React__default.createElement(reactRouterDom.Link, { className: "button", onClick: () => setQuestionnaireAndSwitchToFirstUnansweredQuestion(questionnaire), to: route }, "Start"));
}

//TODO implement questionnaire state
function MainSurveyCard({ questionnaire }) {
    const { t, i18n } = useTranslation();
    const title = t(questionnaire.title);
    return React.createElement("section", { className: "card" },
        React.createElement("header", null,
            React.createElement("h1", { className: "card-title" }, title)),
        React.createElement("main", null,
            React.createElement("p", { className: "card-content" },
                "Der Einsendeschluss ist am",
                React.createElement("br", null),
                React.createElement("strong", null, questionnaire.submissionDeadlineString(i18n.language)))),
        React.createElement("footer", null,
            React.createElement(StartSurveyButton, { questionnaire: questionnaire, route: "/intro" })));
}

function Tabs({ children }) {
    return React.createElement("nav", { className: "tabs" },
        React.createElement("ul", null, children));
}
function Tab({ children, active = false }) {
    return React.createElement("li", { className: active ? "tabs-active" : null }, children);
}

function ActiveSurveys() {
    const { questionnaireList } = React.useContext(QuestionnaireListContext);
    const activeQuestionnaire = questionnaireList; //.filter(questionnaire =>
    //questionnaire.isActive(),
    //);
    // TODO: Adjust the link targets
    return React.createElement(React.Fragment, null,
        React.createElement(Tabs, null,
            React.createElement(Tab, { active: true },
                React.createElement("a", { href: "/" }, "Featured")),
            React.createElement(Tab, null,
                React.createElement("a", { href: "/" }, "\u00DCbermittelt")),
            React.createElement(Tab, null,
                React.createElement("a", { href: "/" }, "Abgelaufen"))),
        activeQuestionnaire.map(questionnaire => React.createElement(MainSurveyCard, { key: questionnaire.id, questionnaire: questionnaire })));
}

function SmallHeader({ left = React__default.createElement("div", null), children, right = React__default.createElement("div", null) }) {
    return React__default.createElement("header", { className: "small-header" },
        left,
        children,
        right);
}

function CenteredFooter({ children }) {
    return React__default.createElement("footer", { className: "centered-footer" }, children);
}

function Layout({ header, footer, children }) {
    return React__default.createElement("div", { className: "layout" },
        header,
        children,
        footer);
}

function SettingsButton() {
    return React__default.createElement("img", { src: "icons/settings.svg", width: "60", height: "60" });
}
function HomeHeader() {
    return React__default.createElement(SmallHeader, { right: React__default.createElement(SettingsButton, null) },
        React__default.createElement("h1", { className: "page-title" },
            React__default.createElement(reactRouterDom.Link, { to: "/home" }, "polyPod")));
}
function HomeFooter() {
    return React__default.createElement(CenteredFooter, null,
        React__default.createElement("button", null, "Pr\u00FCfe auf neue Umfragen"));
}
function HomeScreen() {
    return React__default.createElement(Layout, { header: React__default.createElement(HomeHeader, null), footer: React__default.createElement(HomeFooter, null) },
        React__default.createElement("main", null,
            React__default.createElement(ActiveSurveys, null)));
}

function FooterNavigation() {
    const { isAtFirstQuestion, isAtLastQuestion, getQuestionnaire, switchToNextQuestion, switchToPreviousQuestion, } = React.useContext(QuestionnaireContext);
    const history = reactRouterDom.useHistory();
    const { t } = useTranslation();
    const goToNext = () => {
        if (isAtLastQuestion()) {
            history.push("/survey-completed");
        }
        else {
            switchToNextQuestion();
        }
    };
    const goToPrevious = () => {
        switchToPreviousQuestion();
    };
    const noQuestions = getQuestionnaire().activeQuestions().length;
    const noAnsweredQuestions = getQuestionnaire().answeredQuestions().length;
    return (React__default.createElement("div", null,
        noAnsweredQuestions,
        t('generic.footer.progress.of'),
        noQuestions,
        t('generic.footer.progress.answered'),
        React__default.createElement("button", { disabled: isAtFirstQuestion(), onClick: goToPrevious }, "previous"),
        React__default.createElement("button", { onClick: goToNext }, "next")));
}

function QuestionCard({ index, question, instruction = '', AnswerComponent = () => React__default.createElement("div", null), AcceptComponent = () => React__default.createElement("div", null), }) {
    return (React__default.createElement("div", null,
        React__default.createElement("div", null, index + 1),
        React__default.createElement("div", null, question),
        instruction.length > 0 && (React__default.createElement("div", null, instruction)),
        React__default.createElement(AnswerComponent, null),
        React__default.createElement(AcceptComponent, null),
        React__default.createElement(FooterNavigation, null)));
}

function PolyCheckbox(props = {}) {
    const { item = undefined, index = 1, indexExtractor = _index => _index, label = 'Checkbox', onChecked = _checkbox => { }, checked = false, disabled = false, grouped = false, } = props;
    const [isChecked, setIsChecked] = React.useState(checked);
    const amChecked = React__default.useCallback(() => (grouped ? checked : isChecked), [
        checked,
        grouped,
        isChecked,
    ]);
    const onPress = React__default.useCallback(() => {
        if (!disabled) {
            if (!grouped) {
                setIsChecked(!amChecked());
            }
            onChecked({
                checked: !amChecked(),
                index: index,
                label: label,
                props: props,
                item: item,
            });
        }
    }, [amChecked, disabled, grouped, index, item, label, onChecked, props]);
    return (React__default.createElement("label", null,
        React__default.createElement("input", { type: "checkbox", checked: amChecked(), onChange: onPress }),
        indexExtractor(index),
        label));
}

function compareMaps(map1, map2) {
    let testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (const [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}

const indices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function PolyCheckboxGroup(props = {}) {
    const { options = [], label = (_item, _index) => _item, value = (_item, _index) => _item, checked = (_item, _index) => false, disabled = (_item, _index) => false, onChecked = () => { }, } = props;
    let newChecked = new Map(options.map((each, index) => [index, checked(each, index)]));
    let newDisabled = new Map(options.map((each, index) => [index, disabled(each, index)]));
    const [selectedCheckboxes, setSelectedCheckboxes] = React.useState(newChecked);
    const [disabledCheckboxes, setDisabledCheckboxes] = React.useState(newDisabled);
    /*
      Unfortunately React does not understand when checked or disabled map was changed,
      so we have to do it manually here
     */
    if (!compareMaps(newChecked, selectedCheckboxes)) {
        setSelectedCheckboxes(newChecked);
    }
    if (!compareMaps(newDisabled, disabledCheckboxes)) {
        setDisabledCheckboxes(newChecked);
    }
    const onSelect = React__default.useCallback(checkbox => {
        const newSelected = new Map(selectedCheckboxes);
        newSelected.set(checkbox.index, checkbox.checked);
        setSelectedCheckboxes(newSelected);
        onChecked(checkbox);
    }, [onChecked, selectedCheckboxes]);
    return (React__default.createElement("div", null, options.map((item, index) => (React__default.createElement("div", { key: index.toString() },
        React__default.createElement(PolyCheckbox, { index: index, indexExtractor: options.length > indices.length
                ? () => null
                : _index => indices.charAt(_index), label: label(item, index), value: value(item, index), item: item, checked: !!selectedCheckboxes.get(index), disabled: !!disabledCheckboxes.get(index), grouped: true, onChecked: onSelect }))))));
}

function PolyButton({ title = 'generic.button.okay', childrenBefore = [], childrenAfter = [], onPress = () => { }, }) {
    const { t } = useTranslation();
    return (React__default.createElement("button", { onClick: onPress },
        childrenBefore,
        t(title),
        childrenAfter));
}

function NextButton() {
    const { isAtLastQuestion, switchToNextQuestion } = React.useContext(QuestionnaireContext);
    const { triggerUpdate } = React.useContext(QuestionnaireListContext);
    const history = reactRouterDom.useHistory();
    return (React__default.createElement(PolyButton, { title: "generic.button.okay", onPress: () => {
            triggerUpdate();
            if (isAtLastQuestion()) {
                history.push("/survey-completed");
            }
            else {
                switchToNextQuestion();
            }
        } }));
}

function MultipleChoiceQuestion({ index, question }) {
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const { saveQuestionnaireAnswers } = React.useContext(QuestionnaireListContext);
    return (React__default.createElement(QuestionCard, { index: index, question: question.description(), instruction: question.explanation(), AnswerComponent: () => (React__default.createElement(PolyCheckboxGroup, { detoxindex: index, options: question.choices(), label: choice => choice.value(), value: choice => choice.id, checked: choice => choice.isSelected(), disabled: choice => !choice.enabled, onChecked: checkbox => {
                checkbox.item.selected(checkbox.checked);
                saveQuestionnaireAnswers(getQuestionnaire());
                // notifyUpdated() is required to re-render the UI and checkbox states
                // triggerUpdate();
            } })), AcceptComponent: () => React__default.createElement(NextButton, null) }));
}

function TextInput({ onChangeText, value, placeholder, maxLength, multiline, numberOfLines }) {
    if (multiline)
        return React__default.createElement("textarea", { onChange: event => onChangeText(event.target.value), value: value, placeholder: placeholder, maxLength: maxLength, rows: numberOfLines });
    return React__default.createElement("input", { onChange: event => onChangeText(event.target.value), type: "text", value: value, placeholder: placeholder, maxLength: maxLength });
}
function PolyTextInput({ initialText = '', onChangeText = _text => { }, maxLength = undefined, multiline = undefined, numberOfLines = undefined, oneWord = false, }) {
    const { t } = useTranslation();
    const [value, setValue] = React.useState(initialText || '');
    const [errMessage, setErrMessage] = React.useState('');
    const inputValid = text => {
        return !oneWord || text.indexOf(' ') < 0;
    };
    var validText;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(TextInput, { onChangeText: text => {
                if (inputValid(text)) {
                    setErrMessage('');
                    setValue(text);
                    onChangeText(text);
                }
                else {
                    validText = text.replace(/\s/g, '');
                    setErrMessage(t('validation.only-one-word'));
                    setValue(validText);
                    onChangeText(validText);
                }
            }, value: value, placeholder: t('general.text-input-shadow-text'), maxLength: maxLength, multiline: multiline, numberOfLines: numberOfLines }),
        errMessage));
}

function TextQuestion({ index, question }) {
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const { saveQuestionnaireAnswers } = React.useContext(QuestionnaireListContext);
    return (React__default.createElement(QuestionCard, { index: index, question: question.description(), instruction: question.explanation(), AnswerComponent: () => (React__default.createElement(PolyTextInput, { initialText: question.answer(), maxLength: question.maxLength, multiline: question.multiline, numberOfLines: question.numberOfLines, oneWord: question.oneWordValidation, onChangeText: text => {
                question.setAnswer(text);
                saveQuestionnaireAnswers(getQuestionnaire());
                // we should not notifyUpdated() here,
                // otherwise the component will be re-rendered and keyboard will hide
            } })), AcceptComponent: () => React__default.createElement(NextButton, null) }));
}

function PolyIconButton({ icon = React__default.createElement("div", null), onPress, disabled = false }) {
    return (React__default.createElement("button", { disabled: disabled, onClick: onPress }, icon));
}

function PolyRangeButton({ label = '1', index = 1, item, onChecked = range => { }, disabled = false, checked = false, }) {
    if (checked)
        label = label + "*";
    return (React__default.createElement(PolyIconButton, { icon: React__default.createElement("strong", null, label), disabled: disabled, onPress: () => {
            onChecked({
                index: index,
                item,
                checked: !checked,
            });
        } }));
}

function PolyRange(props = {}) {
    const { options = [], limits = [], label = (_item, _index) => _item, checked, disabled = (_item, _index) => false, onChecked = () => { }, } = props;
    let newChecked = checked
        ? new Map(options.map((each, index) => [index, checked(each, index)]))
        : new Map();
    let newDisabled = new Map(options.map((each, index) => [index, disabled(each, index)]));
    const [selectedCheckboxes, setSelectedCheckboxes] = React.useState(newChecked);
    const [disabledCheckboxes, setDisabledCheckboxes] = React.useState(newDisabled);
    /*
      Unfortunately React does not understand when checked or disabled map was changed,
      so we have to do it manually here
     */
    if (checked && !compareMaps(newChecked, selectedCheckboxes)) {
        setSelectedCheckboxes(newChecked);
    }
    if (!compareMaps(newDisabled, disabledCheckboxes)) {
        setDisabledCheckboxes(newChecked);
    }
    const onSelect = checkbox => {
        const newSelected = new Map(selectedCheckboxes);
        newSelected.set(checkbox.index, checkbox.checked);
        setSelectedCheckboxes(newSelected);
        onChecked(checkbox);
    };
    return (React__default.createElement("div", null,
        options.map((item, index) => (React__default.createElement(PolyRangeButton, { label: label(item, index), index: index, key: index.toString(), item: item, checked: !!selectedCheckboxes.get(index), disabled: !!disabledCheckboxes.get(index), onChecked: onSelect }))),
        limits[0],
        limits[1]));
}

function RangeQuestion({ index, question }) {
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const { saveQuestionnaireAnswers } = React.useContext(QuestionnaireListContext);
    return (React__default.createElement(QuestionCard, { index: index, question: question.description(), instruction: question.explanation(), AnswerComponent: () => (React__default.createElement(PolyRange, { options: question.values(), checked: option => option === question.value(), limits: question.labels, onChecked: checkbox => {
                if (checkbox.checked) {
                    question.setValue(checkbox.item);
                }
                else {
                    question.setValue(null);
                }
                saveQuestionnaireAnswers(getQuestionnaire());
            } })), AcceptComponent: () => React__default.createElement(NextButton, null) }));
}

function QuestionScreen() {
    const { currentQuestion } = React.useContext(QuestionnaireContext);
    if (!currentQuestion) {
        return React__default.createElement("div", null);
    }
    const components = {
        TextQuestion: TextQuestion,
        MultipleChoiceQuestion: MultipleChoiceQuestion,
        RangeQuestion: RangeQuestion,
    };
    const Card = components[currentQuestion.screen()];
    return React__default.createElement(Card, { index: currentQuestion.index, question: currentQuestion });
}

function ReviewSurveyButton({ title = 'generic.button.review', questionnaire, }) {
    const history = reactRouterDom.useHistory();
    const { setQuestionnaire } = React.useContext(QuestionnaireContext);
    return (React__default.createElement(PolyButton, { title: title, onPress: () => {
            if (questionnaire) {
                setQuestionnaire(questionnaire);
            }
            history.push("/answers");
        } }));
}

function ContinueSurveyButton({ title = 'generic.button.continue', questionnaire, }) {
    const history = reactRouterDom.useHistory();
    const { setQuestionnaire, setQuestionnaireAndSwitchToFirstUnansweredQuestion, } = React.useContext(QuestionnaireContext);
    const answeredAmount = questionnaire.answeredQuestions().length;
    const totalAmount = questionnaire.activeQuestions().length;
    return (React__default.createElement(PolyButton, { title: title, onPress: () => {
            if (answeredAmount < totalAmount) {
                setQuestionnaireAndSwitchToFirstUnansweredQuestion(questionnaire);
                history.push("/survey");
            }
            else {
                setQuestionnaire(questionnaire);
                history.push("/survey-completed");
            }
        } }));
}

const IntroScreen = function () {
    const { t, i18n } = useTranslation();
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const questionnaire = getQuestionnaire();
    const getDetails = () => {
        return (React__default.createElement("div", null,
            `${t('intro.survey_by')} `,
            t(questionnaire.author.name),
            t(questionnaire.title).toUpperCase(),
            `${t('intro.published')}: `,
            questionnaire.publishedDateString(i18n.language),
            `${t('intro.expires')}: `,
            questionnaire.submissionDeadlineString(i18n.language)));
    };
    const getAuthor = () => {
        return (
        // TODO onPress={() => navigation.navigate(AuthorDetailsScreenRoute)}>
        React__default.createElement("div", null,
            t(questionnaire.author.name),
            t('intro.author'),
            React__default.createElement(reactRouterDom.Link, { to: "/intro/authordetails" }, "Details")));
    };
    const getActionButtons = () => {
        return /* questionnaire.isActive()*/  (questionnaire.hasAnsweredQuestions() ? (createContinueSurveyButton()) : (createSurveyButton())) ;
    };
    const createContinueSurveyButton = () => (React__default.createElement(ContinueSurveyButton, { title: t('intro.button.continue'), questionnaire: questionnaire }));
    const createSurveyButton = () => (React__default.createElement(StartSurveyButton, { questionnaire: questionnaire, route: "/survey" }));
    const createSubmittedDate = () => {
        return (React__default.createElement("div", null,
            `${t('intro.submitted')}: `,
            questionnaire.submittedTimeString(i18n.language)));
    };
    return (React__default.createElement("div", null,
        getDetails(),
        t(questionnaire.description),
        getAuthor(),
        questionnaire.isSubmitted() && createSubmittedDate(),
        getActionButtons()));
};

const AuthorDetailsScreen = function () {
    const { t } = useTranslation();
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const questionnaire = getQuestionnaire();
    const history = reactRouterDom.useHistory();
    /* TODO "Back" übersetzen */
    return (React__default.createElement("div", null,
        t(questionnaire.author.name),
        t(questionnaire.author.description),
        React__default.createElement(PolyButton, { title: t('Back'), onPress: () => {
                history.goBack();
            } })));
};

function IntroNavigator() {
    return (React__default.createElement(reactRouterDom.Switch, null,
        React__default.createElement(reactRouterDom.Route, { exact: true, path: "/intro" },
            React__default.createElement(IntroScreen, null)),
        React__default.createElement(reactRouterDom.Route, { exact: true, path: "/intro/authordetails" },
            React__default.createElement(AuthorDetailsScreen, null))));
}

function FinalizeSurveyButton({ title, }) {
    const history = reactRouterDom.useHistory();
    return (React__default.createElement(PolyButton, { title: title, onPress: () => {
            history.push("/survey-legal");
        } }));
}

const SurveyCompletedScreen = function () {
    const { t } = useTranslation();
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    /* <Image
            style={[styles.image, {maxHeight: height}]}
            resizeMode={'contain'}
            source={backgroundImage}
          />*/
    return (React__default.createElement("div", null,
        t('survey.screen_completed.thank_you'),
        React__default.createElement(FinalizeSurveyButton, { title: t('survey.button.finalize') }),
        React__default.createElement(ReviewSurveyButton, { title: t('survey.button.review'), questionnaire: getQuestionnaire() })));
};

function Loader({ loading }) {
    // TODO this should be a spinner
    return (React__default.createElement("div", { className: loading ? "" : "invisible" }, "Loading ..."));
}

// TODO real submission
async function submitAnswers(questionnaire) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const random = Math.random();
            if (random < 0.2)
                resolve();
            else
                reject();
        }, 1000);
    });
}

function SubmitSurveyButton({ title, onStart = () => { }, onFinished = () => { }, }) {
    const { markQuestionaireSubmitted } = React.useContext(QuestionnaireListContext);
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const history = reactRouterDom.useHistory();
    return (React__default.createElement(PolyButton, { title: title, onPress: () => {
            onStart();
            submitAnswers(getQuestionnaire())
                .then(() => {
                markQuestionaireSubmitted(getQuestionnaire());
                onFinished();
                history.push("/survey-submitted");
            })
                .catch(ex => {
                try {
                    console.error(ex);
                }
                catch (_) { }
                // Make sure this is called, as otherwise the Loading screen will not dissapear.
                onFinished();
                history.push("/survey-error");
            });
        } }));
}

function SurveyLegalScreen() {
    const [showLoader, setShowLoader] = React.useState(false);
    const { t } = useTranslation();
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    const history = reactRouterDom.useHistory();
    // TODO figure out how Trans works
    return (React__default.createElement("div", null,
        React__default.createElement(Loader, { loading: showLoader }),
        React__default.createElement("div", null, t('survey.screen_legal.title')),
        React__default.createElement("div", null,
            React__default.createElement(Trans, { i18nKey: getQuestionnaire().legal.content },
                "leading",
                React__default.createElement("a", { href: t(getQuestionnaire().legal.link) }, getQuestionnaire().legal.link))),
        React__default.createElement("div", null,
            React__default.createElement(PolyButton, { title: t('survey.button.disagree'), onPress: () => {
                    history.goBack();
                } }),
            React__default.createElement(SubmitSurveyButton, { title: t('survey.button.agree'), onStart: () => setShowLoader(true), onFinished: () => setShowLoader(false) }))));
}

function SubmittedScreen() {
    const { t } = useTranslation();
    const history = reactRouterDom.useHistory();
    return (React__default.createElement("div", null,
        t('survey.screen_submitted.answers_submited'),
        t('survey.screen_submitted.thank_you'),
        React__default.createElement(PolyButton, { title: t('survey.button.home'), onPress: () => history.push("/home") })));
}

function AnswersSubmissionErrorScreen() {
    const [showLoader, setShowLoader] = React.useState(false);
    const { t } = useTranslation();
    const history = reactRouterDom.useHistory();
    return (React__default.createElement("div", null,
        React__default.createElement(Loader, { loading: showLoader }),
        t('survey.error.title'),
        t('survey.error.message'),
        React__default.createElement(SubmitSurveyButton, { title: t('survey.button.try_again'), onStart: () => setShowLoader(true), onFinished: () => setShowLoader(false) }),
        React__default.createElement(PolyButton, { title: t('survey.button.home'), onPress: () => {
                history.push("/home");
            } })));
}

function AnswerPreviewCard({ question = 'What is your lucky number?', AnswerComponent = () => React__default.createElement("div", null), }) {
    return (React__default.createElement("div", null,
        question,
        React__default.createElement(AnswerComponent, null)));
}

function AnswerChoicePreview({ answer = 'Any number' }) {
    return React__default.createElement("div", null, answer);
}

function AnswerChoiceGroupPreview(props = {}) {
    const { choices = [], labelExtractor = item => item } = props;
    return (React__default.createElement("div", null,
        React__default.createElement("ol", null, choices.map(item => React__default.createElement("li", null,
            React__default.createElement(AnswerChoicePreview, { answer: labelExtractor(item) }))))));
}

function TextQuestionAnswerPreview({ question = new PpTextQuestion(), }) {
    return (React__default.createElement(AnswerPreviewCard, { question: question.description(), AnswerComponent: () => (React__default.createElement(AnswerChoiceGroupPreview, { choices: question.isAnswered() ? [question.value()] : [] })) }));
}

function SingleChoiceQuestionAnswerPreview({ question = new PpSingleChoiceQuestion(), }) {
    return (React__default.createElement(AnswerPreviewCard, { question: question.description(), AnswerComponent: () => (React__default.createElement(AnswerChoiceGroupPreview, { choices: question.isAnswered() ? [question.value()] : [] })) }));
}

function MultipleChoiceQuestionAnswerPreview({ question = new PpMultipleChoiceQuestion(), }) {
    return (React__default.createElement(AnswerPreviewCard, { question: question.description(), AnswerComponent: () => (React__default.createElement(AnswerChoiceGroupPreview, { choices: question.value() })) }));
}

function RangeQuestionAnswerPreview({ question = new PpTextQuestion(), }) {
    return (React__default.createElement(AnswerPreviewCard, { question: question.description(), AnswerComponent: () => question.isAnswered() && (
        // @ts-ignore
        React__default.createElement(PolyRangeButton, { label: question.value(), checked: true, disabled: true })) }));
}

function QuestionnaireAnswersList({ ListFooterComponent }) {
    const { getQuestionnaire } = React.useContext(QuestionnaireContext);
    return React__default.createElement("div", null,
        React__default.createElement("ol", null, getQuestionnaire().questions().map(item => {
            let preview = React__default.createElement("div", null);
            switch (item.constructor) {
                case PpTextQuestion:
                    // TODO possible bug:
                    //   key 'test (de)' returned an object instead of string.
                    preview = (React__default.createElement(TextQuestionAnswerPreview, { question: item }));
                    break;
                case PpSingleChoiceQuestion:
                    preview = (React__default.createElement(SingleChoiceQuestionAnswerPreview, { question: item }));
                    break;
                case PpMultipleChoiceQuestion:
                    preview = (React__default.createElement(MultipleChoiceQuestionAnswerPreview, { question: item }));
                    break;
                case PpRangeQuestion:
                    preview = (React__default.createElement(RangeQuestionAnswerPreview, { question: item }));
                    break;
            }
            return React__default.createElement("li", null, preview);
        })),
        React__default.createElement(ListFooterComponent, null));
}

function AnswersScreen() {
    const { t } = useTranslation();
    const history = reactRouterDom.useHistory();
    const { getQuestionnaire, switchToFirstQuestion } = React.useContext(QuestionnaireContext);
    return (React__default.createElement("div", null,
        getQuestionnaire().isActive()
            ? t('survey.screen_answers.description_before_submit')
            : getQuestionnaire().isSubmitted()
                ? t('survey.screen_answers.description_after_submit')
                : t('survey.screen_answers.description_not_submitted'),
        React__default.createElement(QuestionnaireAnswersList, { ListFooterComponent: () => getQuestionnaire().isActive() ? (React__default.createElement("div", null,
                React__default.createElement(FinalizeSurveyButton, { title: t('survey.button.finalize') }),
                React__default.createElement(PolyButton, { title: t('survey.button.edit'), onPress: () => {
                        switchToFirstQuestion();
                        history.push("/survey");
                    } }))) : (React__default.createElement("div", null,
                React__default.createElement(PolyButton, { title: t('survey.button.home'), onPress: () => {
                        history.push("/home");
                    } }))) })));
}

function OnboardingScreenOne() {
    const { t } = useTranslation();
    const history = reactRouterDom.useHistory();
    return (React__default.createElement("div", null,
        t('onboarding.screen_01.title'),
        t('onboarding.screen_01.main_message'),
        React__default.createElement(PolyButton, { title: 'onboarding.screen_01.button.continue', onPress: () => {
                history.push("/onboarding2");
            } })));
}

function OnboardingScreenTwo() {
    const { t } = useTranslation();
    const history = reactRouterDom.useHistory();
    return (React__default.createElement("div", null,
        t('onboarding.screen_02.main_message'),
        React__default.createElement(PolyButton, { title: 'onboarding.screen_02.button.continue', onPress: () => {
                history.push("/onboarding3");
            } })));
}

// TODO Settings useEffect warum auch immer
function OnboardingScreenThree() {
    const { t } = useTranslation();
    const history = reactRouterDom.useHistory();
    return (React__default.createElement("div", null,
        t('onboarding.screen_03.main_message_02'),
        React__default.createElement(PolyButton, { title: 'onboarding.screen_03.button.continue', onPress: () => {
                history.push("/onboarding4");
            } })));
}

// TODO Settings useEffect warum auch immer
function OnboardingScreenFour() {
    const history = reactRouterDom.useHistory();
    const goToNextScreen = () => {
        AsyncStorage.setItem('onboardingshown', 'true').then(() => {
            history.push("/home");
        });
    };
    return (React__default.createElement("div", null,
        React__default.createElement(Trans, { i18nKey: "onboarding.screen_04.message" },
            "leading ",
            React__default.createElement("strong", null, "polypoly"),
            "with ",
            React__default.createElement("strong", null, "polyPod"),
            "trailing"),
        React__default.createElement(PolyButton, { title: 'onboarding.screen_04.button.continue', onPress: () => {
                goToNextScreen();
            } })));
}

function AppNavigator() {
    const [onboardingShown, setOnboardingShown] = React.useState(null);
    const [languageInitialized, setLanguageInitialized] = React.useState(false);
    const { t, i18n, ready } = useTranslation(null, { useSuspense: false });
    const { questionaireInitializationStatus, questionnaireList, updateStoredQuestionnaires, } = React.useContext(QuestionnaireListContext);
    /**
     * Effect to set the language in the app and set the app language in the questionnaire
     */
    React.useEffect(() => {
        const setLanguage = (languageCode) => {
            i18n
                .changeLanguage(languageCode)
                .then(() => {
                // In case a questionnaire does not have a language set, use the current one.
                // This can happe when opening the app, if a user did not answer any question,
                // as the language is saved when saving answers.
                questionnaireList.forEach(questionnaire => {
                    if (questionnaire.question_language === null) {
                        questionnaire.question_language = languageCode;
                    }
                });
            })
                .then(() => getStoredLanguage())
                .then(savedLanguage => {
                // Only change the language in case it needed. This will only happen the first
                // time when opening the app, as then savedLanguage will be null.
                if (savedLanguage === null) {
                    return storeLanguage();
                }
            })
                .finally(() => setLanguageInitialized(true));
        };
        // Only proced if questionnaires where loaded and the translation module is initialized.
        if (questionaireInitializationStatus && ready) {
            let currentLanguageCode = getStoredOrPhoneLanguageCode();
            currentLanguageCode.then(value => setLanguage(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionaireInitializationStatus, ready]);
    /**
     * Effect to automatically download the initial questionnaire if no questionnaires are
     * downloaded locally.
     */
    React.useEffect(() => {
        if (questionaireInitializationStatus &&
            languageInitialized &&
            questionnaireList.length === 0) {
            updateStoredQuestionnaires().catch(ex => console.log(ex));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        questionaireInitializationStatus,
        languageInitialized,
        questionnaireList,
    ]);
    React.useEffect(() => {
        async function getOnboardingShown() {
            let wasShown = await AsyncStorage.getItem('onboardingshown');
            if (wasShown == null) {
                //@ts-ignore
                wasShown = false;
            }
            setOnboardingShown(wasShown);
        }
        getOnboardingShown();
    }, [onboardingShown]);
    // Wait for various parts of the app to read data from storage and initialize.
    if (onboardingShown == null ||
        questionaireInitializationStatus === false ||
        ready === false ||
        languageInitialized === false) {
        return React__default.createElement(LoadingScreen, null);
    }
    return (React__default.createElement(reactRouterDom.HashRouter, null,
        React__default.createElement(reactRouterDom.Switch, null,
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/" }, onboardingShown ? React__default.createElement(reactRouterDom.Redirect, { to: { pathname: "/home", state: { from: "/" } } }) : React__default.createElement(reactRouterDom.Redirect, { to: { pathname: "/onboarding", state: { from: "/" } } })),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/onboarding" },
                React__default.createElement(OnboardingScreenOne, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/onboarding2" },
                React__default.createElement(OnboardingScreenTwo, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/onboarding3" },
                React__default.createElement(OnboardingScreenThree, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/onboarding4" },
                React__default.createElement(OnboardingScreenFour, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/home" },
                React__default.createElement(HomeScreen, null)),
            React__default.createElement(reactRouterDom.Route, { path: "/intro" },
                React__default.createElement(IntroNavigator, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/survey" },
                React__default.createElement(QuestionScreen, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/survey-completed" },
                React__default.createElement(SurveyCompletedScreen, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/survey-legal" },
                React__default.createElement(SurveyLegalScreen, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/survey-submitted" },
                React__default.createElement(SubmittedScreen, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/survey-error" },
                React__default.createElement(AnswersSubmissionErrorScreen, null)),
            React__default.createElement(reactRouterDom.Route, { exact: true, path: "/answers" },
                React__default.createElement(AnswersScreen, null)))));
}

const view = (React.createElement(QuestionnaireListProvider, null,
    React.createElement(QuestionnaireProvider, null,
        React.createElement(AppNavigator, null))));
ReactDOM.render(view, document.getElementById("feature"));

}(React, ReactDOM, uuid, ReactRouterDOM));
