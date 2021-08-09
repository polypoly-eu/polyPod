const dataProperties = [
    "ppid",
    "name",
    "featured",
    "location",
    "annualRevenues",
    "description",
    "clusters",
];
const dataArrayProperties = ["dataRecipients"];

export class Entity {
    constructor(entityJSONObject, globalData, i18n) {
        this._data = entityJSONObject;
        let self = this;
        this._type = "entity";

        //internal
        this._i18n = i18n;
        this._globalData = globalData;

        //getters
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

    //Overwritten in Company, yet all entities need this for the matcher-comparison in the apply-function
    industryCategoryName() {
        return null;
    }

    get i18n() {
        return this._i18n;
    }

    get language() {
        return this.i18n.language;
    }

    get globalData() {
        return this._globalData;
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

    //getters adding translations from global in runtime
    get dataSharingPurposes() {
        const purposes = this._data.dataSharingPurposes;
        if (!purposes) return [];
        return purposes.map((purpose) => ({
            "dpv:Purpose": this.globalData.data_purposes[
                purpose["dpv:Purpose"]
            ]["dpv:Purpose"],
            translation: this.globalData.data_purposes[purpose["dpv:Purpose"]][
                `Translation_${this.language.toUpperCase()}`
            ],
            explanation: this.globalData.data_purposes[purpose["dpv:Purpose"]][
                `Explanation_${this.language.toUpperCase()}`
            ],
            count: purpose.count,
        }));
    }

    get dataTypesShared() {
        const dataTypes = this._data.dataTypesShared;
        if (!dataTypes) return [];
        return dataTypes.map((type) => ({
            "dpv:Category": this.globalData.personal_data_categories[
                type["dpv:Category"]
            ]["dpv:Category"],
            translation: this.globalData.personal_data_categories[
                type["dpv:Category"]
            ][`Translation_${this.language.toUpperCase()}`],
            explanation: this.globalData.personal_data_categories[
                type["dpv:Category"]
            ][`Explanation_${this.language.toUpperCase()}`],
            parentCategory: this.globalData.personal_data_categories[
                type["dpv:Category"]
            ].Polypoly_Parent_Category,
            count: type.count,
        }));
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
