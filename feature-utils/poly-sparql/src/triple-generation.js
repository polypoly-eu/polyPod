import { v4 as uuid } from "uuid";

export function jsObjectToTriplesString(
    subject,
    predicate,
    jsObj,
    blankNodeString = "_:" + uuid()
) {
    let triplesString = `${subject} ${predicate} ${blankNodeString} `;
    for (let [key, value] of Object.entries(jsObj)) {
        const keyPredicate = "poly:" + key;
        if (typeof value === "object") {
            if (Array.isArray(value)) {
                triplesString += jsArrayToTriplesString(
                    blankNodeString,
                    keyPredicate,
                    value
                );
                continue;
            }
            triplesString += jsObjectToTriplesString(
                blankNodeString,
                keyPredicate,
                value
            );
            continue;
        }
        triplesString += `${blankNodeString} ${keyPredicate} ${
            typeof value === "string" ? `"${value}"` : value
        } `;
    }
    return triplesString;
}

export function jsArrayToTriplesString(subject, predicate, arr) {
    let triplesString = "";
    const objectsToStore = [];
    const elementsToJoin = [];
    for (let element of arr) {
        if (!element) continue;
        if (typeof element === "object") {
            //array[] is not supported
            if (Array.isArray(element)) {
                throw Error("Array[] is not supported");
            }
            objectsToStore.push(element);
            continue;
        }

        elementsToJoin.push(
            typeof element === "string" ? `"${element}"` : element
        );
    }
    if (elementsToJoin.length > 0) {
        triplesString += `${subject} ${predicate} ` + elementsToJoin.join(", ");
    }

    if (elementsToJoin.length > 0 && objectsToStore.length > 0)
        triplesString += " ";

    triplesString += objectsToStore
        .map((obj) => jsObjectToTriplesString(subject, predicate, obj))
        .join(" ");

    return triplesString;
}
