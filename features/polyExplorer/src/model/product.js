import { Entity } from "./entity.js";

//keeping this as I'm sure more dataProperties will emerge soon
const dataProperties = [];
const dataArrayProperties = ["activeUsers"];

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
}
