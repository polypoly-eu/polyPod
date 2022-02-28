import {
    TranslationKeyError,
    LanguageError,
    NonExistingSectionError,
} from "./errors.js";

import { determineLocale, determineLanguage } from "./locale.js";

/**
 * Simple class for performing string translations, with simple templating capabilities
 *
 * @class
 */
export class I18n {
    /**
     * Class constructor. The locale used will be auto-detected, and stored as a private-ish attribute.
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
     * @param {string} [ locale = determineLocale() ] - locale string, in the usual format xx[_YY],
     *     by default locale determined using that function
     * @throws LanguageError - if the `fallbackLanguage` key is not included in the translations hash
     */
    constructor(
        language,
        translations,
        fallbackLanguage = Object.keys(translations)[0],
        locale = determineLocale()
    ) {
        if (!(fallbackLanguage in translations)) {
            throw new LanguageError(
                fallbackLanguage +
                    " is not a key in the translations hash provided"
            );
        }
        this._locale = locale;
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
     * Returns the automatically determined (in constructor) locale string.
     *
     * @returns locale string in the usual `xx-XX` format.
     */

    get locale() {
        return this._locale;
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
            let convertedValue = value;
            if (!isNaN(parseFloat(value))) {
                convertedValue = Intl.NumberFormat(this._locale).format(
                    parseFloat(value)
                );
            }
            translation = translation.replace(`{{${key}}}`, convertedValue);
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
