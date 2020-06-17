export function encodeUtf8(string: string): Uint8Array {
    if (typeof TextEncoder !== "undefined")
        return new TextEncoder().encode(string);
    else
        return Buffer.from(string, "utf-8");
}