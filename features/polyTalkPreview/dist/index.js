(function (React, client, polyLook) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    var title = "preview:title";
    var sections = [
    	{
    		title: "preview:section1_title",
    		description: "preview:section1_description",
    		images: [
    			"./images/test.jpeg",
    			"./images/test.jpeg"
    		]
    	},
    	{
    		title: "preview:section1_title",
    		description: "preview:section1_description",
    		images: [
    			"./images/test.jpeg"
    		]
    	},
    	{
    		title: "preview:section1_title",
    		description: "preview:section1_description",
    		images: [
    			"./images/test.jpeg"
    		]
    	},
    	{
    		title: "preview:section1_title",
    		description: "preview:section1_description",
    		images: [
    		]
    	}
    ];
    var footer = {
    	title: "preview:footer_title",
    	description: "preview:footer_description",
    	image: "./images/test.jpeg",
    	buttonTitle: "preview:footer_button_title",
    	buttonLink: "https://polypoly.org/en-gb/"
    };
    var content = {
    	title: title,
    	sections: sections,
    	footer: footer
    };

    /**
     * Exception class for errors related to the language that is
     * requested for the translation object
     *
     * @class
     */
    class LanguageError extends Error {
        /**
         * Class constructor
         *
         * @param message - Actual message included in the error
         */
        constructor(message) {
            super(message);
            this.name = "LanguageError";
        }
    }

    /**
     * Exception class to use when the section/namespace does not exist
     *
     * @class
     */
    class NonExistingSectionError extends Error {
        /**
         * Class constructor
         *
         * @param message - Message to include in the error
         */
        constructor(message) {
            super(message);
            this.name = "NonExistingSectionError";
        }
    }

    /**
     * Exception class to use when there's some problem with the key used
     * in the translation, either the format or its existence.
     *
     * @class
     */
    class TranslationKeyError extends Error {
        /**
         * Class constructor
         *
         * @param message - Message to include in the error
         */
        constructor(message) {
            super(message);
            this.name = "TranslationKeyError";
        }
    }

    /**
     * Determines the environment locale in a platform-independent way
     *
     * @returns a standard name for the language, such as 'en-US'. The first code corresponds to the language
     */
    const determineLocale = () =>
        Intl.DateTimeFormat().resolvedOptions().locale;

    /**
     * Determines the environment language
     *
     * @returns a two-character standard name for the language, such as 'en'
     */
    const determineLanguage = () => determineLocale().split("-")[0];

    /**
     * Simple class for performing string translations, with simple templating capabilities
     *
     * @class
     */
    class L12n {
        /**
         * Class constructor for the localization class. The locale used will be auto-detected (by default)
         * and stored as a private, read-only attribute. This is going to essentially be an encapsulation of
         * the existing locale, deferring all actual processing to the `Intl` standard library.
         *
         * @param {string} [ locale = determineLocale() ] - locale string, in the usual format xx[_YY],
         *     by default locale determined using that function
         * @throws LanguageError - if the provided language is incorrect in some way (inexistent, or incorrect string format)
         */
        constructor(locale = determineLocale()) {
            let canonicalLocale;
            try {
                canonicalLocale = Intl.getCanonicalLocales(locale)[0];
            } catch (error) {
                if (error.name == "RangeError") {
                    throw new LanguageError(
                        canonicalLocale + " is not a supported locale"
                    );
                }
            }
            if (!canonicalLocale.match(/^[a-z]{2,3}\b(_[A-Z]{2,4}\b)?/)) {
                throw new LanguageError(
                    canonicalLocale + " does not follow the usual locale format"
                );
            }

            if (
                Intl.NumberFormat.supportedLocalesOf([canonicalLocale]).length == 0
            ) {
                throw new LanguageError(
                    canonicalLocale + " does not support numeric formats"
                );
            }

            this._locale = canonicalLocale;
        }

        /**
         * Returns the locale string.
         *
         * @returns locale string in the usual `xx-XX` format.
         */
        get locale() {
            return this._locale;
        }

        /**
         * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
         *
         * @param object - What needs to be translated. For the time being, only translates numbers
         * @returns The locale-formatted string.
         */
        t(object) {
            if (object instanceof Date) {
                return Intl.DateTimeFormat(this._locale).format(object);
            }
            if (!isNaN(parseFloat(object))) {
                return Intl.NumberFormat(this._locale).format(parseFloat(object));
            }
            return object;
        }
    }

    function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
    /**
     * Simple class for performing string translations, with simple templating capabilities
     *
     * @class
     */
    class I18n {
        /**
         * Class constructor. The locale used will be auto-detected (by default)
         * and stored as a private, read-only attribute.
         *
         * @param {string} language - two-letter language code, which should be a key in the translation hash.
         *     If this key does not exist, `fallbackLanguage` will be used.
         * @param {Object} translations - translations hash. This is going to have the format `namespace ⇒ key ⇒ string`
         *     within every language. Only the language that's detected will be used.
         * @param {string} [ fallbackLanguage = language ] - "default" language to use in case the one in `language`
         *     is not a part of the `translations` hash.
         *     It's an optional parameter, that defaults to the first key
         *     in the `translations` hash, so you might want to use arrange it
         *     bearing this in mind.
         * @param {string} [ l12n = new L12n() ] - localization object, by default it will use the current locale string
         *     as determined by the [[L12n]] function
         * @throws LanguageError - if the `fallbackLanguage` key is not included in the translations hash
         */
        constructor(
            language,
            translations,
            fallbackLanguage = Object.keys(translations)[0],
            l12n = new L12n()
        ) {
            if (!(fallbackLanguage in translations)) {
                throw new LanguageError(
                    fallbackLanguage +
                        " is not a key in the translations hash provided"
                );
            }
            this._l12n = l12n;
            this.language = language in translations ? language : fallbackLanguage;
            this._translations = translations[this.language];
        }

        /**
         * Sections present in the original trnslation hash
         * @returns Array of strings, every one a section
         */
        get sections() {
            return Object.keys(this._translations);
        }

        /**
         * Returns the locale string
         *
         * @returns the locale string in the usual format
         */
        get locale() {
            return this._l12n.locale;
        }

        /**
         * Returns the localization object
         *
         * @returns the localization object.
         */
        get l12n() {
            return this._l12n;
        }

        /**
         * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
         *
         * @param {string} key - the translation key in the `namespace:key` format
         * @param {Object} options - simple templating capabilities; this will be a key-value hash, so that `{{{key}}}` will be substituted by the key value in this hash. If the value is a number, it will be converted to a string in a format of the current locale
         * @throws TranslationKeyError - if the translation key does not have the correct format, or is missing the key part, or the key does not exist.
         * @throws NonExistingSectionError - if the section/namespace does not exist
         * @returns The translated string.
         */
        t(key, options = {}) {
            if (key.search(/:/) == -1) {
                throw new TranslationKeyError(
                    `${key} does not have the format «namespace:key»`
                );
            }
            const [namespace, keyInNamespace] = key.split(/:(.+)/);
            if (!(namespace in this._translations)) {
                throw new NonExistingSectionError(
                    `${namespace} is not a correct section, possible values are ${Object.keys(
                    this._translations
                )}`
                );
            }
            let translation = _optionalChain([this, 'access', _ => _._translations, 'access', _2 => _2[namespace], 'optionalAccess', _3 => _3[keyInNamespace]]);
            if (!translation) {
                throw new TranslationKeyError(
                    `${namespace} does not exist or does not have a ${keyInNamespace} key for language ${this.language}`
                );
            }

            for (let [key, value] of Object.entries(options)) {
                translation = translation.replace(
                    `{{${key}}}`,
                    this._l12n.t(value)
                );
            }
            return translation;
        }
    }

    var i18n = new I18n(determineLanguage(), {"de":{"common":{"welcome":"Willkommen zu {{feature}}"},"preview":{"title":"PolyPoly Preview Feature","section1_title":"Section 1","section1_description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","footer_title":"Footer","footer_description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","footer_button_title":"Learn More"}},"en":{"common":{"welcome":"Welcome to {{feature}}"},"preview":{"title":"PolyPoly Preview Feature","section1_title":"Section 1","section1_description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","footer_title":"Footer","footer_description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","footer_button_title":"Learn More"}}}, "en");

    const Section = (props) => {
        return (
            React__default["default"].createElement('div', null
                , React__default["default"].createElement('h3', null, i18n.t(props.model.title))
                , React__default["default"].createElement('p', null, i18n.t(props.model.description))
                , props.model.images.length > 0 && (
                    React__default["default"].createElement(polyLook.Slideshow, { images: props.model.images,} )
                )
            )
        );
    };

    const Footer = (props) => {
        return (
            React__default["default"].createElement(polyLook.ClickableCard, {
                buttonText: i18n.t(props.model.buttonTitle),
                onlyButtonClickEvent: true,
                onClick: () => {
                    // TODO: Open link
                },}
            
                , React__default["default"].createElement('h3', null, i18n.t(props.model.title))
                , React__default["default"].createElement('p', null, i18n.t(props.model.description))
                , props.model.image !== undefined && props.model.image !== "" && (
                    React__default["default"].createElement('img', { src: props.model.image,} )
                )
            )
        );
    };

    const App = () => {
        return (
            React__default["default"].createElement(polyLook.Screen, { className: "poly-theme-light", layout: "poly-standard-layout",}
                , React__default["default"].createElement('div', null
                    , React__default["default"].createElement('h1', null, i18n.t(content.title))
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
