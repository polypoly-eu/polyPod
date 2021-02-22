// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

const strings = {
    "common:screenTitles.main": "polyExplorer",
    "common:screenTitles.dataTypes": "dataTypes",
    "common:screenTitles.purposes": "purposes",
    "common:screenTitles.companies": "companies",
    "common:screenTitles.jurisdictions": "jurisdictions",
    "common:screenTitles.companyInfo": "companyInfo",
    "common:screenTitles.companyFilter": "companyFilter",
    "common:screenTitles.companySearch": "companySearch",
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
