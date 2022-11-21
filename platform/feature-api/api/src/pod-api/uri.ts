import { v4 as uuidv4 } from "uuid";

const polyProtocol = "polypod://";
const polyProtocolRegex = new RegExp(`^${polyProtocol}`);

/**
 * Creates a random UUID string with a random hexadecimal value for each character in the string
 * 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', and returns the result.
 * @returns a string in UUID format
 */
export function createUUID(): string {
    return uuidv4();
}

/**
 *
 * @param uri a string that is going to be checked for the format
 * @returns true if it follows the "protocol"
 */
export function isPolypodUri(uri: string): boolean {
    return polyProtocolRegex.test(uri);
}

/**
 * The PolyUri class is a wrapper around a UUID that is prefixed with the Poly protocol
 */
export class PolyUri {
    public readonly Uri: string;

    constructor() {
        this.Uri = `${polyProtocol}${createUUID()}`;
    }

    toString(): string {
        return this.Uri;
    }
}

/**
 * `PolyPodUriError` is a class that extends the `Error` class
 * and is used to throw errors when a URI is not valid
 * @extends Error
 */
export class PolyPodUriError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
