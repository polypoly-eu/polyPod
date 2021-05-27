export const determineLanguage = () =>
    Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

export class LanguageError extends Error {
    constructor(message) {
        super(message);
        this.name = "LanguageError";
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
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        let translation = this._translations[namespace]?.[keyInNamespace];
        if (typeof translation !== "string")
            throw new Error(
                `'${keyInNamespace}' not in namespace '${namespace}' for ` +
                    `language '${this.language}'`
            );
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    }
}
