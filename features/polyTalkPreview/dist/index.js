(function (React, client, polyLook) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    var title = "TEST Title";
    var sections = [
    	{
    		title: "Section 1",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    		images: [
    			"./images/test.jpeg",
    			"./images/test.jpeg"
    		]
    	},
    	{
    		title: "Section 2",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    		images: [
    			"./images/test.jpeg"
    		]
    	},
    	{
    		title: "Section 3",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    		images: [
    			"./images/test.jpeg"
    		]
    	},
    	{
    		title: "Section 4",
    		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    		images: [
    		]
    	}
    ];
    var footer = {
    	title: "Footer title",
    	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    	image: "./images/test.jpeg",
    	buttonTitle: "Learn More",
    	buttonLink: "https://polypoly.org/en-gb/"
    };
    var content = {
    	title: title,
    	sections: sections,
    	footer: footer
    };

    const App = () => {
        const Section = (props) => {
            return (
                React__default["default"].createElement('div', null
                    , React__default["default"].createElement('h3', null, props.model.title)
                    , React__default["default"].createElement('p', null, props.model.description)
                    , props.model.images.length > 0 && (
                        React__default["default"].createElement(polyLook.Slideshow, { images: props.model.images,} )
                    )
                )
            );
        };

        const Footer = (props) => {
            return (
                React__default["default"].createElement(polyLook.ClickableCard, {
                    buttonText: props.model.buttonTitle,
                    onlyButtonClickEvent: true,
                    onClick: () => {},}
                
                    , React__default["default"].createElement('h3', null, props.model.title)
                    , React__default["default"].createElement('p', null, props.model.description)
                    , props.model.image !== undefined &&
                        props.model.image !== "" && React__default["default"].createElement('img', { src: props.model.image,} )
                )
            );
        };

        return (
            React__default["default"].createElement(polyLook.Screen, { className: "poly-theme-light", layout: "poly-standard-layout",}
                , React__default["default"].createElement('div', null
                    , React__default["default"].createElement('h1', null, content.title)
                    , React__default["default"].createElement('div', null
                        , content.sections.map((s, i) => (
                            React__default["default"].createElement(Section, { key: i, model: s,} )
                        ))
                    )
                    , React__default["default"].createElement('div', null
                        , React__default["default"].createElement(Footer, { model: content.footer,} )
                    )
                )
            )
        );
    };

    const root = client.createRoot(document.getElementById("feature"));
    root.render(React__default["default"].createElement(App, null ));

})(React, ReactDOM, polyLook);
