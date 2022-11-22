import {
    TranslationKeyError,
    LanguageError,
    NonExistingSectionError,
} from "./errors.js";

import { determineLocale, determineLanguage } from "./locale.js";
import { L12n } from "./l12n.js";

/**
 * Performs string translations, with simple templating capabilities.
 *
 * @class
 */
export class I18n {
    /**
     * Create a new instance.
     *
     * @param {string} language - Two-letter language code, which should be a
     * key in `translations`.
     * @param {object} translations - Object containing all the translations. It
     * has the format `language ⇒ namespace ⇒ key ⇒ string`.
     * @param {string} [fallbackLanguage] - Language to use in case the one in
     * `language` is not a part of `translations`. If not specified, the
     * fallback language is the first one that appears in `translations`.
     * @param {L12n} [l12n] - Localization object. If not specified, it will
     * create one for the current locale as determined by {@link L12n}.
     * @throws LanguageError - If `fallbackLanguage` does not exist in
     * `translations`.
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
     * The sections present in the original translations object.
     * @type {Array}
     */
    get sections() {
        return Object.keys(this._translations);
    }

    /**
     * The current locale.
     * @type {string}
     */
    get locale() {
        return this._l12n.locale;
    }

    /**
     * The localization object.
     * @type {L12n}
     */
    get l12n() {
        return this._l12n;
    }

    /**
     * Obtains the translated string for a namespace and key defined in the
     * translations object.
     *
     * @param {string} key - The translation key in the format `namespace:key`.
     * @param {object} options - Values used to replace placeholders in the
     * translated string. For example: `{{{example}}}` in the translated string
     * will be substituted by the value of the _example_ property in
     * `options`. If the value is a `number` or a `Date`, it will be formatted
     * according to the current locale.
     * @throws TranslationKeyError - If the translation key does not have the
     * correct format or does not exist.
     * @throws NonExistingSectionError - If the section/namespace does not
     * exist.
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
 * A variant of {@link I18n} that is specific to a single section/namespace.
 *
 * @class
 */
export class I18nSection extends I18n {
    /**
     * Create a new instance.
     *
     * @param {I18n} i18n - The `I18n` instance that holds the desired section.
     * @param {string} section - The name of the section.
     * @throws NonExistingSectionError - If `section` is not included in
     * `i18n`'s translations object.
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
     * Same usage as {@link I18n#t}, except that `key` should not include the
     * namespace, since this instance is specific to a single section.
     */
    t(key, options = {}) {
        return super.t(`${this._section}:${key}`, options);
    }
}

export { L12n, determineLocale, determineLanguage };
