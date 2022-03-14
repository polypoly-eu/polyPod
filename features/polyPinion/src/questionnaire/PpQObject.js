export default class PpQObject {
    // Answer the object to be stored in the answer json document.
    // By default this is the questions value, but it may be an id.
    answer() {
        return this.value();
    }

    toJSON() {
        let jsonObject = {};
        Object.assign(jsonObject, this);
        jsonObject.__class__ = this.constructor.name;
        return jsonObject;
    }

    postJSONLoad() {
        // Nothing to do
    }

    static fromJSON(jsonObject) {
        let newObject = new this();
        Object.assign(newObject, jsonObject);
        delete newObject["__class__"];
        return newObject;
    }
}
