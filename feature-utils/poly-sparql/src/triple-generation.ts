import { v4 as uuid } from "uuid";

export function jsObjectToTriplesString(
    subject: string,
    predicate: string,
    //jsObj: Object,
    blankNodeString: string | null
): string {
    const objectBlankNode = blankNodeString || "_:" + uuid();
    const triplesString = `${subject} ${predicate} ${objectBlankNode} `;
    return triplesString;
}

export function jsArrayToTriplesString(subject, predicate, arr) {}
