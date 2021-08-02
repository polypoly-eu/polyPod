import { Entity } from "./entity.js";

const jurisdictions = {
    OTHER: "Sonstige",
    FIVE_EYES: "Five-Eyes",
    CHINA: "China",
    EU_GDPR: "EU-GDPR",
    RUSSIA: "Russia",
};

const dataProperties = ["industryCategory", "productsOwned"];

export class Company extends Entity {
    constructor(companyJSONObject, globalData, i18n) {
        super(companyJSONObject, globalData, i18n);
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
            this.globalData.industries?.[this.industryCategory]?.[
                `Name_${this.language.toUpperCase()}`
            ] || this.i18n.t("common:category.undisclosed")
        );
    }

    industryCategoryDefinition() {
        return this.globalData.industries[this.industryCategory][
            `Definition_${this.language.toUpperCase()}`
        ];
    }
}

function determineJurisdictions(location, globalData) {
    return (
        globalData.countries[location.countryCode]?.dataRegion ||
        jurisdictions.OTHER
    );
}
