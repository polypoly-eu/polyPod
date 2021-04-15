// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

import commonEn from "./locales/en/common.json";

import commonDe from "./locales/de/common.json";

const strings = {
    en: {
        common: commonEn,
    },
    de: {
        common: commonDe,
    },
};

function determineLanguage() {
    const languages = Object.keys(strings);
    const parsedLanguage = navigator.language.split("-")[0];
    if (languages.includes(parsedLanguage))
        return parsedLanguage;
    return "en";
}

const i18n = {
    language: determineLanguage(),
    t: (key, options = {}) => {
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        let translation = strings[i18n.language][namespace][keyInNamespace];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    },
};

export default i18n;
