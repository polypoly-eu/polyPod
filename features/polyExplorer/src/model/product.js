import { Entity } from "./entity.js";

//keeping this as I'm sure more dataProperties will emerge soon
const dataProperties = [];
const dataArrayProperties = ["productOwner", "activeUsers", "activities"];
const installsType = "Android Installs";

export class Product extends Entity {
    constructor(productJSONObject, globalData, i18n) {
        super(productJSONObject, globalData, i18n);
        this._type = "product";
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

    productOwnerEnumeration() {
        const owner = this.productOwner;
        if (owner.length == 0) return null;
        else if (owner.length == 1) return owner[0];
        else {
            let enumeration = owner[0];
            for (let i = 1; i < owner.length; i++) {
                enumeration += `, ${owner[i]}`;
            }
            return enumeration;
        }
    }

    get currentActiveUsers() {
        const copyActiveUsers = this.activeUsers.values.map((activeUser) => ({
            ...activeUser,
        }));

        return copyActiveUsers.sort((activeUsers1, activeUsers2) => {
            const date1 = new Date(activeUsers1.end_date);
            const date2 = new Date(activeUsers2.end_date);

            return (date1.getTime() - date2.getTime()) * -1;
        })[0].user_count;
    }

    get totalInstalls() {
        const installsData = this.activities.filter(
            (activity) => activity.activity_type === installsType
        );
        return installsData.reduce((acc, current) => acc + current.amount, 0);
    }
}
