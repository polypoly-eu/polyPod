import globalData from "../src/data/global.json";

export class Company {
    constructor(companyJSONObject) {
        this._ppid = companyJSONObject.ppid;
        this._featured = companyJSONObject.featured;
        this._name = companyJSONObject.name;
        this._jurisdiction = getJurisdictionFromLocation(
            companyJSONObject.location,
            globalData
        );
        this._location = companyJSONObject.location;
        this._annualRevenues = companyJSONObject.annualRevenues;
        this._dataRecipients = companyJSONObject.dataRecipients;
        this._dataSharingPurposes = companyJSONObject.dataSharingPurposes;
        this._dataTypesShared = companyJSONObject.dataTypesShared;
        this._jurisdictionsShared = companyJSONObject.jurisdictionsShared;
        this._description = companyJSONObject.description;
        this._industryCategory = companyJSONObject.industryCategory;
    }

    //Getters
    get ppid() {
        return this._ppid;
    }

    get name() {
        return this._name;
    }

    get featured() {
        return this._featured;
    }

    get jurisdiction() {
        return this._jurisdiction;
    }

    get location() {
        return this._location;
    }

    get annualRevenues() {
        return this._annualRevenues;
    }

    get dataRecipients() {
        return this._dataRecipients;
    }

    get dataSharingPurposes() {
        return this._dataSharingPurposes;
    }

    get dataTypesShared() {
        return this._dataTypesShared;
    }

    get jurisdictionsShared() {
        return this._jurisdictionsShared;
    }

    get description() {
        return this._description;
    }

    get industryCategory() {
        return this._industryCategory;
    }

    get firstNameChar() {
        return withoutSpecialChars(this.name)[0];
    }

    get dataTypesSharedCount() {
        return this.dataTypesShared?.length || 0;
    }

    get sharingPurposesCount() {
        return this.dataSharingPurposes?.length || 0;
    }

    get dataRecipientsCount() {
        return this.dataRecipients?.length || 0;
    }

    get jurisdictionsSharedCount() {
        return this.jurisdictionsShared?.children.length || 0;
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
