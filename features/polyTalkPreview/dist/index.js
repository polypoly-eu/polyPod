(function (React, ReactDOM) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

    const PreviewApp = () => {
        return (
            React__default["default"].createElement('div', null
                , React__default["default"].createElement('text', null, "\"Who is your daddy?\""   )
            )
        );
    };

    ReactDOM__default["default"].render(React__default["default"].createElement(PreviewApp, null ), document.getElementById("feature"));

})(React, ReactDOM);
