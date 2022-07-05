(function (React, client, polyLook) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    var progress_banner = {
    	stage: 1,
    	title: "preview:progress.banner.title",
    	description: "preview:progress.banner.description"
    };
    var title = "preview:title";
    var sections = [
    	{
    		title: "preview:section1.title",
    		description: "preview:section1.description",
    		images: [
    			"./images"
    		]
    	},
    	{
    		title: "preview:section2.title",
    		description: "preview:section2.description",
    		images: [
    			"./images"
    		]
    	}
    ];
    var footer = {
    	title: "preview:footer.title",
    	description: "preview:footer.description",
    	image: "",
    	buttonTitle: "preview:footer.button.title"
    };
    var content = {
    	progress_banner: progress_banner,
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

    var i18n = new I18n(determineLanguage(), {"de":{"common":{"welcome":"Welcome to {{feature}}","button.ok":"Ok"},"preview":{"progress.banner.title":"Idea","progress.banner.description":"Lorem ipsum dolor sit amet","title":"PolyPoly Preview Feature","section1.title":"Section 1","section1.description":"I'm baby proident mixtape kale chips photo booth eiusmod ennui, tattooed sustainable adaptogen chillwave lorem. Esse veniam humblebrag pork belly fam ad single-origin coffee enamel pin shabby chic tempor roof party intelligentsia pop-up man bun hot chicken. ","section2.title":"Section 2","section2.description":"Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.","footer.title":"Footer","footer.description":"Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before. Many say exploration is part of our destiny, but it’s actually our duty to future generations and their quest to ensure the survival of the human species.","footer.button.title":"Learn More","cta.link":"learn-more"},"progressInfo":{"title":"Wie ist das zu verstehen?","text1":"Zugegeben, wir bei polypoly bauen etwas sehr Ambitioniertes, etwas Großes auf – aber eben eins nach dem anderen. Und da wir dies mit und für unsere bestehenden und zukünftigen Mitglieder und Partner:innen machen, möchten wir Ihnen ein besseres Gefühl dafür vermitteln, wohin die Reise geht und welche Fortschritte wir machen.\n\nDas Status-Icon soll Ihnen ein Gefühl dafür vermitteln, wo wir uns in diesem Prozess befinden.\n\nDie vier Schritte haben folgende Bedeutung:","stage1":"Wir haben eine Idee","explanation1":"Wir denken ernsthaft über eine Umsetzung nach, weiter sind wir aber noch nicht gekommen.","stage2":"Erster Entwurf","explanation2":"Wer hätte das gedacht – nachdenken resultiert in Arbeit. Wir sind also dran und arbeiten die Idee bereits aus.","stage3":"In Bearbeitung","explanation3":"Es wird ernst. Wir arbeiten bereits an der Umsetzung.","stage4":"Coming soon","explanation4":"Fast fertig. Ein Termin steht bereits… sie werden so schnell erwachsen 🥲. Zur Vorschau."}},"en":{"common":{"welcome":"Welcome to {{feature}}","button.ok":"Ok"},"preview":{"progress.banner.title":"Idea","progress.banner.description":"Lorem ipsum dolor sit amet","title":"PolyPoly Preview Feature","section1.title":"Section 1","section1.description":"I'm baby proident mixtape kale chips photo booth eiusmod ennui, tattooed sustainable adaptogen chillwave lorem. Esse veniam humblebrag pork belly fam ad single-origin coffee enamel pin shabby chic tempor roof party intelligentsia pop-up man bun hot chicken. ","section2.title":"Section 2","section2.description":"Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.","footer.title":"Footer","footer.description":"Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before. Many say exploration is part of our destiny, but it’s actually our duty to future generations and their quest to ensure the survival of the human species.","footer.button.title":"Learn More","cta.link":"learn-more"},"progressInfo":{"title":"How to read this?","text1":"At polypoly we are building something large and ambitious, one element at a time. And since we are building this with and for our existing and future members and partners, we want to give you a better sense of where this is going and what progress we are making.\n\nThe status icon show a process indicator. The four steps have the following meaning:","stage1":"We have an idea","explanation1":"Brainstorming leads us here. We are seriously thinking about this, but did not start working on it yet. ","stage2":"We sketch","explanation2":"Who would have known – brainstorming leads to an idea and this idea needs to get in shape. We’re on it, we shape the idea for development.","stage3":"We implement","explanation3":"Things are getting serious. We’re currently working on bringing this to life.","stage4":"Coming soon","explanation4":"We are almost ready. The launch date is scheduled… they grow up so fast 🥲. Here are some previews."}}}, "en");

    const Section = (props) => {
        const isTranslationKey = (key) => {
            let comp = key.split(":");
            if (comp.length < 1) {
                return false;
            }

            const getNested = (path_comp, obj) => {
                if (obj === undefined) return undefined;
                if (path_comp.length === 0) return obj;
                return getNested(path_comp.slice(1), obj[path_comp[0]]);
            };

            return getNested(comp, i18n._translations) !== undefined;
        };

        const imagePaths = props.model.images.map((key) =>
            isTranslationKey(key) ? i18n.t(key) : key
        );

        return (
            React__default["default"].createElement('div', { className: "section",}
                , React__default["default"].createElement('h3', { className: "section-title",}, i18n.t(props.model.title))
                , props.model.images.length > 0 && props.model.images.length == 1 ? (
                    React__default["default"].createElement('img', { src: imagePaths[0],} )
                ) : (
                    React__default["default"].createElement(polyLook.Slideshow, { images: imagePaths,} )
                )
                , React__default["default"].createElement('p', null, i18n.t(props.model.description))
            )
        );
    };

    const Footer = (props) => {
        return (
            React__default["default"].createElement('div', { className: "footer",}
                , React__default["default"].createElement(polyLook.ClickableCard, {
                    buttonText: i18n.t(props.model.buttonTitle),
                    onlyButtonClickEvent: true,
                    onClick: () => {
                        props.pod.polyNav.openUrl(i18n.t("preview:cta.link"));
                    },}
                
                    , React__default["default"].createElement('h3', null, i18n.t(props.model.title))
                    , React__default["default"].createElement('p', null, i18n.t(props.model.description))
                    , props.model.image !== undefined &&
                        props.model.image !== "" && React__default["default"].createElement('img', { src: props.model.image,} )
                )
            )
        );
    };

    const ProgressInfoView = () => {
        return (
            React__default["default"].createElement('div', null
                , React__default["default"].createElement('p', { className: "info",}, i18n.t("progressInfo:text1"))
                , [1, 2, 3, 4].map((stage) => (
                    React__default["default"].createElement('div', { key: stage, className: "info-stage",}
                        , React__default["default"].createElement(polyLook.ProgressIcon, { stage: stage,} )
                        , React__default["default"].createElement('div', null
                            , React__default["default"].createElement('h3', null, i18n.t(`progressInfo:stage${stage}`))
                            , React__default["default"].createElement('p', null, i18n.t(`progressInfo:explanation${stage}`))
                        )
                    )
                ))
            )
        );
    };

    const ProgressInfoPopUp = ({ onClose }) => {
        return (
            React__default["default"].createElement(polyLook.SideSwiper, {
                onClose: onClose,
                open: true,
                Component: (props) => (
                    React__default["default"].createElement(polyLook.SideSheet, {
                        title: i18n.t("progressInfo:title"),
                        okLabel: i18n.t("common:button.ok"),
                        ...props,
                        className: "poly-theme-light",}
                    
                        , React__default["default"].createElement('div', { className: "base-info-contents",}
                            , React__default["default"].createElement(ProgressInfoView, null )
                        )
                    )
                ),}
            )
        );
    };

    const App = () => {
        const [pod, setPod] = React.useState(null);
        const [popUpVisible, setPopUpVisible] = React.useState(false);

        const initPod = async () => await window.pod;

        //on startup
        React.useEffect(() => {
            initPod().then((newPod) => {
                setPod(newPod);
            });
        }, []);

        return (
            React__default["default"].createElement(React__default["default"].Fragment, null
                , React__default["default"].createElement('div', { className: "poly-nav-bar-separator-overlay",} )
                , React__default["default"].createElement(polyLook.Screen, {
                    className: "poly-theme-light background-white" ,
                    layout: "poly-standard-layout",}
                
                    , React__default["default"].createElement('div', { className: "preview",}
                        , React__default["default"].createElement(polyLook.ProgressBanner, {
                            stage: content.progress_banner.stage,
                            title: i18n.t(content.progress_banner.title),
                            description: i18n.t(
                                content.progress_banner.description
                            ),
                            onClick: () => {
                                setPopUpVisible(true);
                            },}
                        )
                        , React__default["default"].createElement('h1', null, i18n.t(content.title))
                        , React__default["default"].createElement('div', null
                            , content.sections.map((s, i) => (
                                React__default["default"].createElement(Section, { key: i, model: s,} )
                            ))
                        )
                        , React__default["default"].createElement('div', null
                            , React__default["default"].createElement(Footer, { model: content.footer, pod: pod,} )
                        )
                        , popUpVisible && (
                            React__default["default"].createElement(ProgressInfoPopUp, {
                                onClose: () => {
                                    console.log("Clicked the Close button");
                                    setPopUpVisible(false);
                                },}
                            )
                        )
                    )
                )
            )
        );
    };

    const root = client.createRoot(document.getElementById("feature"));
    root.render(React__default["default"].createElement(App, null ));

})(React, ReactDOM, polyLook);
