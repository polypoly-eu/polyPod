import globalData from "../data/global.json";
import { determineLanguage } from "@polypoly-eu/silly-i18n";
import i18n from "../i18n.js";

const dataProperties = [
    "ppid",
    "name",
    "featured",
    "location",
    "annualRevenues",
    "description",
];
const dataArrayProperties = [
    "dataRecipients",
    "dataSharingPurposes",
    "dataTypesShared",
];

export class Entity {
    constructor(entityJSONObject) {
        this._data = entityJSONObject;
        let self = this;
        this._type = "entity";
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

    get nameIndexCharacter() {
        return withoutSpecialChars(this.name)[0];
    }

    get jurisdictionsShared() {
        return this._data.jurisdictionsShared || { children: [] };
    }

    get type() {
        return this._type;
    }

    //Methods
    compareNames(withEntity) {
        return withoutSpecialChars(this.name).localeCompare(
            withoutSpecialChars(withEntity.name)
        );
    }
}

function withoutSpecialChars(aString) {
    return aString.replace(/[`!@#$%^&*„()_+\-=[\]{};':"\\|<>/?~]/g, "");
}
