import { fromJsonObject, toJsonObject } from "./utils/json-serialization";

export default class Entity {
    toJSON() {
        return toJsonObject(this);
    }

    static fromJSON(jsonObject) {
        return fromJsonObject(jsonObject, this);
    }
}
