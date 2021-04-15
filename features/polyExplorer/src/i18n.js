// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

import commonEn from "./locales/en/common.json";
import companyFilterScreenEn from "./locales/en/companyFilterScreen.json";
import companyDetailsScreenEn from "./locales/en/companyDetailsScreen.json";
import companySearchScreenEn from "./locales/en/companySearchScreen.json";
import mainScreenEn from "./locales/en/mainScreen.json";
import onboardingPopupEn from "./locales/en/onboardingPopup.json";
import featuredCompanyEn from "./locales/en/featuredCompany.json";
import dataSharingGaugeEn from "./locales/en/dataSharingGauge.json";
import dataExplorationScreenEn from "./locales/en/dataExplorationScreen.json";
import featuredCompanyInfoScreenEn from "./locales/en/featuredCompanyInfoScreen.json";
import infoScreenEn from "./locales/en/infoScreen.json";
import dataRegionInfoScreenEn from "./locales/en/dataRegionInfoScreen.json";
import explorationInfoEn from "./locales/en/explorationInfo.json";
import explorationDataTypesInfoScreenEn from "./locales/en/explorationDataTypesInfoScreen.json";
import explorationCategoryInfoScreenEn from "./locales/en/explorationCategoryInfoScreen.json";
import explorationCorrelationInfoScreenEn from "./locales/en/explorationCorrelationInfoScreen.json";
import explorationPurposeInfoScreenEn from "./locales/en/explorationPurposeInfoScreen.json";
import explorationCompaniesInfoScreenEn from "./locales/en/explorationCompaniesInfoScreen.json";
import explorationJurisdictionInfoScreenEn from "./locales/en/explorationJurisdictionInfoScreen.json";
import infographicEn from "./locales/en/infographic.json";

import commonDe from "./locales/de/common.json";
import companyFilterScreenDe from "./locales/de/companyFilterScreen.json";
import companyDetailsScreenDe from "./locales/de/companyDetailsScreen.json";
import companySearchScreenDe from "./locales/de/companySearchScreen.json";
import mainScreenDe from "./locales/de/mainScreen.json";
import onboardingPopupDe from "./locales/de/onboardingPopup.json";
import featuredCompanyDe from "./locales/de/featuredCompany.json";
import dataSharingGaugeDe from "./locales/de/dataSharingGauge.json";
import dataExplorationScreenDe from "./locales/de/dataExplorationScreen.json";
import featuredCompanyInfoScreenDe from "./locales/de/featuredCompanyInfoScreen.json";
import infoScreenDe from "./locales/de/infoScreen.json";
import dataRegionInfoScreenDe from "./locales/de/dataRegionInfoScreen.json";
import explorationInfoDe from "./locales/de/explorationInfo.json";
import explorationDataTypesInfoScreenDe from "./locales/de/explorationDataTypesInfoScreen.json";
import explorationCategoryInfoScreenDe from "./locales/de/explorationCategoryInfoScreen.json";
import explorationCorrelationInfoScreenDe from "./locales/de/explorationCorrelationInfoScreen.json";
import explorationPurposeInfoScreenDe from "./locales/de/explorationPurposeInfoScreen.json";
import explorationCompaniesInfoScreenDe from "./locales/de/explorationCompaniesInfoScreen.json";
import explorationJurisdictionInfoScreenDe from "./locales/de/explorationJurisdictionInfoScreen.json";
import infographicDe from "./locales/de/infographic.json";

const strings = {
    en: {
        common: commonEn,
        companyFilterScreen: companyFilterScreenEn,
        companyDetailsScreen: companyDetailsScreenEn,
        companySearchScreen: companySearchScreenEn,
        mainScreen: mainScreenEn,
        onboardingPopup: onboardingPopupEn,
        featuredCompany: featuredCompanyEn,
        dataSharingGauge: dataSharingGaugeEn,
        dataExplorationScreen: dataExplorationScreenEn,
        featuredCompanyInfoScreen: featuredCompanyInfoScreenEn,
        infoScreen: infoScreenEn,
        dataRegionInfoScreen: dataRegionInfoScreenEn,
        explorationInfo: explorationInfoEn,
        explorationDataTypesInfoScreen: explorationDataTypesInfoScreenEn,
        explorationCategoryInfoScreen: explorationCategoryInfoScreenEn,
        explorationCorrelationInfoScreen: explorationCorrelationInfoScreenEn,
        explorationPurposeInfoScreen: explorationPurposeInfoScreenEn,
        explorationCompaniesInfoScreen: explorationCompaniesInfoScreenEn,
        explorationJurisdictionInfoScreen: explorationJurisdictionInfoScreenEn,
        infographic: infographicEn,
    },
    de: {
        common: commonDe,
        companyFilterScreen: companyFilterScreenDe,
        companyDetailsScreen: companyDetailsScreenDe,
        companySearchScreen: companySearchScreenDe,
        mainScreen: mainScreenDe,
        onboardingPopup: onboardingPopupDe,
        featuredCompany: featuredCompanyDe,
        dataSharingGauge: dataSharingGaugeDe,
        dataExplorationScreen: dataExplorationScreenDe,
        featuredCompanyInfoScreen: featuredCompanyInfoScreenDe,
        infoScreen: infoScreenDe,
        dataRegionInfoScreen: dataRegionInfoScreenDe,
        explorationInfo: explorationInfoDe,
        explorationDataTypesInfoScreen: explorationDataTypesInfoScreenDe,
        explorationCategoryInfoScreen: explorationCategoryInfoScreenDe,
        explorationCorrelationInfoScreen: explorationCorrelationInfoScreenDe,
        explorationPurposeInfoScreen: explorationPurposeInfoScreenDe,
        explorationCompaniesInfoScreen: explorationCompaniesInfoScreenDe,
        explorationJurisdictionInfoScreen: explorationJurisdictionInfoScreenDe,
        infographic: infographicDe,
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
