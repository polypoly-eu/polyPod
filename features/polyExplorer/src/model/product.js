import { Entity } from "./entity.js";

//keeping this as I'm sure more dataProperties will emerge soon
const dataProperties = [];
const dataArrayProperties = ["productOwner", "activeUsers"];

export class Product extends Entity {
    constructor(productJSONObject) {
        super(productJSONObject);
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
}
