const jurisdictions = {
    OTHER: "Sonstigeq",
    FIVE_EYES: "Five-Eyes",
    CHINA: "China",
    EU_GDPR: "EU-GDPR",
    RUSSIA: "Russia"
}

export class Company {
    constructor(companyJSONObject, globalData) {
        this._data = companyJSONObject;
        this._jurisdiction = determineJurisdictions(
            companyJSONObject.location,
            globalData
        );
        let self = this;
        ['ppid','name','featured','location','annualRevenues', 'description','industryCategory'].forEach( function (item, index ) {
            console.log( "Setting ", item);
            Object.defineProperty(self, item, {
                get: function() {
                    return self._data[item]
                }
            });
        });
    }

    /* / Getters
    get ppid() {
        return this._data.ppid;
    }

    get name() {
        return this._data.name;
    }

    get featured() {
        return this._data.featured;
    }
    */

    get jurisdiction() {
        return this._jurisdiction;
    }

    /* 
    get location() {
        return this._data.location;
    }

    get annualRevenues() {
        return this._data.annualRevenues;
    }
    */

    get dataRecipients() {
        return this._data.dataRecipients || [];
    }

    get dataSharingPurposes() {
        return this._data.dataSharingPurposes || [];
    }

    get dataTypesShared() {
        return this._data.dataTypesShared || [];
    }

    get jurisdictionsShared() {
        return this._data.jurisdictionsShared || { children: [] };
    }

    /* 
    get description() {
        return this._data.description;
    }

    get industryCategory() {
        return this._data.industryCategory;
    }
    */

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
    return globalData.countries[location.countryCode]?.dataRegion || jurisdictions.OTHER;
}
