const jurisdictions = {
    OTHER: "Sonstige",
    FIVE_EYES: "Five-Eyes",
    CHINA: "China",
    EU_GDPR: "EU-GDPR",
    RUSSIA: "Russia",
};

const dataProperties = [
    "ppid",
    "name",
    "featured",
    "location",
    "annualRevenues",
    "description",
    "industryCategory",
];
const dataArrayProperties = [
    "dataRecipients",
    "dataSharingPurposes",
    "dataTypesShared",
];

export class Company {
    constructor(companyJSONObject, globalData) {
        this._data = companyJSONObject;
        this._jurisdiction = determineJurisdictions(
            companyJSONObject.location,
            globalData
        );
        let self = this;
        dataProperties.forEach(function (item) {
            Object.defineProperty(self, item, {
                get: function () {
                    return self._data[item];
                },
            });
        });
        dataArrayProperties.forEach(function (item) {
            Object.defineProperty(self, item, {
                get: function () {
                    return self._data[item] || [];
                },
            });
        });
    }

    get jurisdiction() {
        return this._jurisdiction;
    }

    get jurisdictionsShared() {
        return this._data.jurisdictionsShared || { children: [] };
    }

    get nameIndexCharacter() {
        return withoutSpecialChars(this.name)[0];
    }

    //Methods
    compareNames(withCompany) {
        return withoutSpecialChars(this.name).localeCompare(
            withoutSpecialChars(withCompany.name)
        );
    }
}

function withoutSpecialChars(aString) {
    return aString.replace(/[`!@#$%^&*„()_+\-=[\]{};':"\\|<>/?~]/g, "");
}

function determineJurisdictions(location, globalData) {
    return (
        globalData.countries[location.countryCode]?.dataRegion ||
        jurisdictions.OTHER
    );
}
