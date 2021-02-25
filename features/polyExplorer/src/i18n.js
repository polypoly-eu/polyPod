// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

const strings = {
    "common:screenTitles.main": "polyExplorer",
    "common:screenTitles.dataTypes": "Data exploration",
    "common:screenTitles.purposes": "Data exploration",
    "common:screenTitles.companies": "Data exploration",
    "common:screenTitles.jurisdictions": "Data exploration",
    "common:screenTitles.companyInfo": "Company profile",
    "common:screenTitles.companyFilter": "Filter",
    "common:screenTitles.companySearch": "Search",
    "common:screenTitles.info": "Data sources and process",
    "common:companyFilter.missing": "Unknown",
    "mainScreen:tabLabel.featuredCompanies": "Featured companies",
    "mainScreen:tabLabel.allCompanies": "All companies ({{total}})",
    "companyFilterScreen:jurisdictions": "Jurisdictions",
    "companyFilterScreen:locations": "Locations",
    "companyFilterScreen:revenue": "Revenue",
    "companyFilterScreen:apply": "Apply",
};

export default {
    t: (key, options = {}) => {
        let translation = strings[key];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    },
};
