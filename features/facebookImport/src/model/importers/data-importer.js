import {
    fromJsonObject,
    toJsonObject,
} from "../entities/utils/json-serialization";

export default class DataImporter {
    toJSON() {
        return toJsonObject(this);
    }

    static fromJSON(jsonObject) {
        return fromJsonObject(jsonObject, this);
    }
}
