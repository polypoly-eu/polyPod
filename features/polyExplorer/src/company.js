export function compare(a, b) {
    if (startsWithSpecialChar(a)) return compare(a.slice(1), b);
    if (startsWithSpecialChar(b)) return compare(a, b.slice(1));
    return a.localeCompare(b);
}

function startsWithSpecialChar(aString) {
    var format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    return format.test(aString.charAt(0));
}

export class Company {
    constructor(companyJSONObject) {
        this._ppid = companyJSONObject.ppid;
        this._featured = companyJSONObject.featured;
        this._name = companyJSONObject.name;
        this._jurisdiction = companyJSONObject.jurisdiction;
        this._location = companyJSONObject.location;
        this._annualRevenues = companyJSONObject.annualRevenues;
        this._dataRecipients = companyJSONObject.dataRecipients;
        this._dataSharingPurposes = companyJSONObject.dataSharingPurposes;
        this._dataTypesShared = companyJSONObject.dataTypesShared;
        this._description = companyJSONObject.description;
        this._industryCategory = companyJSONObject.industryCategory;
    }

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

    get description() {
        return this._description;
    }

    get industryCategory() {
        return this._industryCategory;
    }
}
