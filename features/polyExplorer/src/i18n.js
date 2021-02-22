// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

const strings = {
    "mainScreen:tabLabel.featuredCompanies": "Featured companies",
    "mainScreen:tabLabel.allCompanies": "All companies ({{total}})",
};

export default {
    t: (key, options = {}) => {
        let translation = strings[key];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    },
};
