/**
 * Creates a random UUID string with a random hexadecimal value for each character in the string
 * 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', and returns the result.
 * @returns a string in UUID format
 */
export function createUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export function isPolypodUri(uri: string): Boolean {
    return /^polypod:\/\//.test(uri);
}

export class PolyUri {
    public readonly Uri: string;

    constructor() {
        this.Uri = `polypod://${createUUID()}`;
    }

    toString(): string {
        return this.Uri;
    }
}
