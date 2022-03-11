import {
    TranslationKeyError,
    LanguageError,
    NonExistingSectionError,
} from "./errors.js";

import { determineLocale, determineLanguage } from "./locale.js";
import { L12n } from "./l12n.js";

/**
 * Simple class for performing string translations, with simple templating capabilities
 *
 * @class
 */
export class I18n {
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
        let translation = this._translations[namespace]?.[keyInNamespace];
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

/**
 * A I18n translator specific to a section, instantiated with a specific namespace.
 *
 * @class
 */
export class I18nSection extends I18n {
    /**
     * Class constructor from a
     *
     * @param {I18n} i18n - Translation object, containing basic logic and data
     * @param {string} section - First-level section this object will handle
     * @throws NonExistingSectionError - if the `section` key is not included in the translations hash
     */
    constructor(i18n, section) {
        super(i18n.language, { [i18n.language]: i18n._translations });
        if (!i18n.sections.includes(section)) {
            throw new NonExistingSectionError(
                `${section} is not included in translation data, only  ${
                    super.sections
                } are`
            );
        }
        this._section = section;
        Object.freeze(this);
    }

    /**
     * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
     *
     * @param {string} key - the translation key in the `key` format (implicit namespace)
     * @param {Object} options - simple templating capabilities; this will be a key-value hash, so that `{{{key}}}` will be substituted by the key value in this hash
     * @throws TranslationKeyError - if the translation key does not have the correct format, or is missing the key part, or the key does not exist.
     * @returns The translated string.
     */
    t(key, options = {}) {
        return super.t(`${this._section}:${key}`, options);
    }
}

export { determineLocale, determineLanguage };
