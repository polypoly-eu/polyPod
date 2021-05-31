/**
 * Determines the environment language
 *
 * @returns a two-character standard name for the language, such as 'en'
 */
export const determineLanguage = () =>
    Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

export class LanguageError extends Error {
    /**
     * Exception class for errors related to the language that is
     * requested for the translation object
     *
     * @param message - Actual message included in the error
     */
    constructor(message) {
        super(message);
        this.name = "LanguageError";
    }
}

export class TranslationKeyError extends Error {
    /**
     * Exception class to use when there's some problem with the key used
     * in the translation, either the format or its existence.
     *
     * @param message - Message to include in the error
     */
    constructor(message) {
        super(message);
        this.name = "TranslationKeyError";
    }
}

export class I18n {
    /**
     * Simple class for performing string translations, includigng parameters
     *
     * @param language - two-letter language code, which should be a key in the translation hash
     * @param translations - translations hash
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
    }

    /**
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
}
