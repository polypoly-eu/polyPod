import globalData from "../src/data/global.json";

export class Company {
    constructor(companyJSONObject) {
        this._data = companyJSONObject;
        this._data.jurisdiction = getJurisdictionFromLocation(
            companyJSONObject.location,
            globalData
        );
    }

    //Getters
    get ppid() {
        return this._data.ppid;
    }

    get name() {
        return this._data.name;
    }

    get featured() {
        return this._data.featured;
    }

    get jurisdiction() {
        return this._data.jurisdiction;
    }

    get location() {
        return this._data.location;
    }

    get annualRevenues() {
        return this._data.annualRevenues;
    }

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

    get description() {
        return this._data.description;
    }

    get industryCategory() {
        return this._data.industryCategory;
    }

    get firstNameChar() {
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
    return aString.replace(/[ `!@#$%^&*„()_+\-=[\]{};':"\\|,.<>/?~]/, "");
}

function getJurisdictionFromLocation(location, globalData) {
    return (
        globalData.countries[
            Object.keys(globalData.countries).find(
                (country) => country === location.countryCode
            )
        ]?.dataRegion || "Sonstige"
    );
}
