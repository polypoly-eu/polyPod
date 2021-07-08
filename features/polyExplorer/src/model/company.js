import { Entity } from "./entity.js";
import globalData from "../data/global.json";
import i18n from "../i18n.js";

const jurisdictions = {
    OTHER: "Sonstige",
    FIVE_EYES: "Five-Eyes",
    CHINA: "China",
    EU_GDPR: "EU-GDPR",
    RUSSIA: "Russia",
};

const dataProperties = ["industryCategory"];

export class Company extends Entity {
    constructor(companyJSONObject, globalData) {
        super(companyJSONObject);
        this._jurisdiction = determineJurisdictions(
            companyJSONObject.location,
            globalData
        );
        this._type = "company";
        let self = this;
        dataProperties.forEach(function (item) {
            Object.defineProperty(self, item, {
                get: function () {
                    return self._data[item];
                },
            });
        });
    }

    get jurisdiction() {
        return this._jurisdiction;
    }

    industryCategoryName() {
        return (
            globalData.industries?.[this.industryCategory]?.[
                `Name_${i18n.language.toUpperCase()}`
            ] || i18n.t("common:category.undisclosed")
        );
    }

    industryCategoryDefinition() {
        return globalData.industries[this.industryCategory][
            `Definition_${i18n.language.toUpperCase()}`
        ];
    }
}

function determineJurisdictions(location, globalData) {
    return (
        globalData.countries[location.countryCode]?.dataRegion ||
        jurisdictions.OTHER
    );
}
