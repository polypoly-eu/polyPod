import globalData from "../data/global.json";
import i18n from "../i18n.js";

const dataProperties = [
    "ppid",
    "name",
    "featured",
    "location",
    "annualRevenues",
    "description",
];
const dataArrayProperties = ["dataRecipients"];

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

    get dataSharingPurposes() {
        const purposes = this._data.dataSharingPurposes;
        if (!purposes) return [];
        return purposes.map((purpose) => ({
            "dpv:Purpose":
                globalData.data_purposes[purpose["dpv:Purpose"]]["dpv:Purpose"],
            translation:
                globalData.data_purposes[purpose["dpv:Purpose"]][
                    `Translation_${i18n.language.toUpperCase()}`
                ],
            explanation:
                globalData.data_purposes[purpose["dpv:Purpose"]][
                    `Explanation_${i18n.language.toUpperCase()}`
                ],
            count: purpose.count,
        }));
    }

    get dataTypesShared() {
        const dataTypes = this._data.dataTypesShared;
        if (!dataTypes) return [];
        return dataTypes.map((type) => ({
            "dpv:Category":
                globalData.personal_data_categories[type["dpv:Category"]][
                    "dpv:Category"
                ],
            translation:
                globalData.personal_data_categories[type["dpv:Category"]][
                    `Translation_${i18n.language.toUpperCase()}`
                ],
            explanation:
                globalData.personal_data_categories[type["dpv:Category"]][
                    `Explanation_${i18n.language.toUpperCase()}`
                ],
            parentCategory:
                globalData.personal_data_categories[type["dpv:Category"]]
                    .Polypoly_Parent_Category,
            count: type.count,
        }));
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
