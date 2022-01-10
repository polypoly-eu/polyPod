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
 * Generates an object by slurping all JSON files
 * @param sections - All different sections
 * @param languages - Sections will come in these two different flavors
 * @param path - Full path to import
 * @returns an [[I18n]] object
 */
export async function createI18n( sections, languages ) {
    let i18nData = {};
    for ( s in sections ) {
        const section = await import( `${path}/${s}.js`);
        i18nData[s] = section;
    }
    return new I18n( determineLanguage(), i18nData);
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
     * @param language - two-letter language code, which should be a key in the translation hash.
     *     If this key does not exist, `fallbackLanguage` will be used.
     * @param translations - translations hash. This is going to have the format `namespace ⇒ key ⇒ string`
     *     within every language. Only the language that's detected will be used.
     * @param fallbackLanguage - "default" language to use in case the one in `language`
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
        Object.freeze(this);
    }

    /**
     * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
     *
     * @param key - the translation key in the `namespace:key` format
     * @param options - simple templating capabilities; this will be a key-value hash, so that `{{{key}}}` will be substituted by the key value in this hash
     * @throws TranslationKeyError - if the translation key does not have the correct format, or is missing the key part, or the key does not exist.
     * @returns The translated string.
     */
    t(key, options = {}) {
        if (key.search(/:/) == -1) {
            throw new TranslationKeyError(
                `${key} does not have the format «namespace:key»`
            );
        }
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        let translation = this._translations?.[namespace]?.[keyInNamespace];
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
