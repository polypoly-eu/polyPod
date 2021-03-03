// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

import commonEn from "./locales/en/common.json";
import companyFilterScreenEn from "./locales/en/companyFilterScreen.json";
import companyInfoScreenEn from "./locales/en/companyInfoScreen.json";
import companySearchScreenEn from "./locales/en/companySearchScreen.json";
import mainScreenEn from "./locales/en/mainScreen.json";
import onboardingPopupEn from "./locales/en/onboardingPopup.json";
import featuredCompanyEn from "./locales/en/featuredCompany.json";
import dataExplorationScreenEn from "./locales/en/dataExplorationScreen.json";
import featuredCompanyHelpScreenEn from "./locales/en/featuredCompanyHelpScreen.json";

import commonDe from "./locales/de/common.json";
import companyFilterScreenDe from "./locales/de/companyFilterScreen.json";
import companyInfoScreenDe from "./locales/de/companyInfoScreen.json";
import companySearchScreenDe from "./locales/de/companySearchScreen.json";
import mainScreenDe from "./locales/de/mainScreen.json";
import onboardingPopupDe from "./locales/de/onboardingPopup.json";
import featuredCompanyDe from "./locales/de/featuredCompany.json";
import dataExplorationScreenDe from "./locales/de/dataExplorationScreen.json";
import featuredCompanyHelpScreenDe from "./locales/de/featuredCompanyHelpScreen.json";

const strings = {
    en: {
        common: commonEn,
        companyFilterScreen: companyFilterScreenEn,
        companyInfoScreen: companyInfoScreenEn,
        companySearchScreen: companySearchScreenEn,
        mainScreen: mainScreenEn,
        onboardingPopup: onboardingPopupEn,
        featuredCompany: featuredCompanyEn,
        dataExplorationScreen: dataExplorationScreenEn,
        featuredCompanyHelpScreen: featuredCompanyHelpScreenEn,
    },
    de: {
        common: commonDe,
        companyFilterScreen: companyFilterScreenDe,
        companyInfoScreen: companyInfoScreenDe,
        companySearchScreen: companySearchScreenDe,
        mainScreen: mainScreenDe,
        onboardingPopup: onboardingPopupDe,
        featuredCompany: featuredCompanyDe,
        dataExplorationScreen: dataExplorationScreenDe,
        featuredCompanyHelpScreen: featuredCompanyHelpScreenDe,
    },
};

export default {
    t: (key, options = {}) => {
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        let translation = strings["de"][namespace][keyInNamespace];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    },
};
