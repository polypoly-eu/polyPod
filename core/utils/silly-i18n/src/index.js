/**
 * Determines the environment language
 *
 * @returns a two-character standard name for the language, such as 'en'
 */
export const determineLanguage = () =>
    Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

/**
 * Exception class for errors related to the language that is
 * requested for the translation object
 *
 * @class
 */
export class LanguageError extends Error {
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
export class NonExistingSectionError extends Error {
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
export class TranslationKeyError extends Error {
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
 * Simple class for performing string translations, with simple templating capabilities
 *
 * @class
 */
export class I18n {
    /**
     * Class constructor
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
     * @throws LanguageError - if the `fallbackLanguage` key is not included in the translations hash
     */
    constructor(
        language,
        translations,
        fallbackLanguage = Object.keys(translations)[0]
    ) {
        if (!(fallbackLanguage in translations)) {
            throw new LanguageError(
                fallbackLanguage +
                    " is not a key in the translations hash provided"
            );
        }
        this.language = language in translations ? language : fallbackLanguage;
        this._translations = translations[this.language];
    }

    /**
     * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
     *
     * @param {string} key - the translation key in the `namespace:key` format
     * @param {Object} options - simple templating capabilities; this will be a key-value hash, so that `{{{key}}}` will be substituted by the key value in this hash
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

        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
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
