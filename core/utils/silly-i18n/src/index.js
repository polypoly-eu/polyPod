export const defaultLanguage = "en";
export const determineLanguage = () =>
    Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

export class I18n {
    constructor(language, translations) {
        this.language = language in translations ? language : defaultLanguage;
        this._translations = translations[this.language];
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
