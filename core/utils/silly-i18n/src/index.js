export const determineLanguage = () =>
    Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

export class LanguageError extends Error {
    constructor(message) {
        super(message);
        this.name = "LanguageError";
    }
}

export class TranslationKeyError extends Error {
    constructor(message) {
        super(message);
        this.name = "TranslationKeyError";
    }
}

export class I18n {
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

    t(key, options = {}) {
        if ( key.search(/:/) == -1 ) {
            throw new TranslationKeyError( "${key} does not have the format «namespace:key»")
        }
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        if ( !keyInNamespace 
            || !( namespace in this._translations)
            || !( keyInNamespace in this._translations[namespace] )) {
            throw new TranslationKeyError( "${namespace} does not exist or does not have a ${keyInNamespace} key for language ${this.language}")
        }
        let translation = this._translations[namespace][keyInNamespace];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    }
}
