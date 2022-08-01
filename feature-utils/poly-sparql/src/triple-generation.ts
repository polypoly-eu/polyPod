import { v4 as uuid } from "uuid";

export function jsObjectToTriplesString(
    subject: string,
    predicate: string,
    jsObj: Object,
    blankNodeString: string = "_:" + uuid()
): string {
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

export function jsArrayToTriplesString(
    subject: string,
    predicate: string,
    arr: unknown[]
) {
    let triplesString: string = `${subject} ${predicate} `;
    const objectsToStore: Object[] = [];
    const elementsToJoin: unknown[] = [];
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
    triplesString += elementsToJoin.join(", ");
    for (let obj of objectsToStore)
        triplesString += jsObjectToTriplesString(subject, predicate, obj);

    return triplesString;
}
