import {existsSync} from 'fs'

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
 * Simple class for performing string translations, with simple templating capabilities
 *
 * @class
 */
export class I18n {
    /**
     * Class constructor
     *
     * @param language - two-letter language code, which should be a key in the translation hash
     * @param translations - translations hash. This is going to have the format `namespace ⇒ key ⇒ string`
     * @throws LanguageError - if the language key is not included in the translations hash
     */
    constructor(language, translations) {
        if (language in translations) {
            this.language = language;
            this._translations = translations[this.language];
        } else {
            throw new LanguageError(
                "${language} is not a key in the translations hash provided"
            );
        }
        Object.freeze(this)
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
                "${key} does not have the format «namespace:key»"
            );
        }
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        if (
            !keyInNamespace ||
            !(namespace in this._translations) ||
            !(keyInNamespace in this._translations[namespace])
        ) {
            throw new TranslationKeyError(
                "${namespace} does not exist or does not have a ${keyInNamespace} key for language ${this.language}"
            );
        }
        let translation = this._translations[namespace][keyInNamespace];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    }

    /**
     * Builds the translation hash from files in a directory with the structure
     * languagekey
     *      - namespace
     *          - stringKeys
     *
     * @param directory - the directory files are in
     
     * @returns an instance of a I18n object
     */
    fromFiles( directory ){
        if ( ! existsSync( directory )) {
            throw new FileNotFoundException( "${directory} can't be found")
        }
    }
}
