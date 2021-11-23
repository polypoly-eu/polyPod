export function toJsonObject(targetObject) {
    let jsonObject = {};
    Object.assign(jsonObject, targetObject);
    jsonObject.__class__ = targetObject.constructor.name;
    return jsonObject;
}

export function fromJsonObject(jsonObject, targetClass) {
    let newObject = new targetClass();
    Object.assign(newObject, jsonObject);
    delete newObject["__class__"];
    return newObject;
}
