import { fromJsonObject, toJsonObject } from "./utils/json-serialization";

export default class EntitiesGroup {
    toJSON() {
        return toJsonObject(this);
    }

    static fromJSON(jsonObject) {
        return fromJsonObject(jsonObject, this);
    }
}
