import * as Decoder from "io-ts/Decoder";
import * as Either from "fp-ts/Either";
import { pipe } from "fp-ts/function";

interface Manifest {
    readonly name: string;
    readonly description: string;
    readonly thumbnail: string;
    readonly primaryColor: string;
    readonly links: Record<string, string>;
    readonly translations: Record<string, Partial<Manifest>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const decodeWith = <EncodeTo = any, DecodeFrom = unknown>(
    input: DecodeFrom,
    decoder: Decoder.Decoder<DecodeFrom, EncodeTo>
): EncodeTo =>
    pipe(
        decoder.decode(input),
        Either.getOrElseW((errors) => {
            throw new Error("Failed to parse manifest" + errors);
        })
    );

// define a decoder for error inputs (i.e. relative paths)
const relativeDecoder = pipe(
    Decoder.string,
    Decoder.parse((input) => {
        if (typeof document == "undefined") {
            return Decoder.success(input);
        }
        const url = new URL(input, document.location.href);
        if (url.toString() == "") {
            return Decoder.failure(input, "relative");
        }
        return Decoder.success(input);
    })
);

// define a decoder representing a manifest
const manifestDecoder = Decoder.type({
    name: Decoder.string,
    description: Decoder.string,
    thumbnail: relativeDecoder,
    primaryColor: Decoder.string,
    links: Decoder.record(Decoder.string),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    translations: Decoder.record(Decoder.partial<any>({})),
});

export async function readManifest(
    packageManifest: Record<string, unknown>
): Promise<Manifest> {
    const manifest = decodeWith(packageManifest, manifestDecoder);

    return {
        name: manifest.name,
        description: manifest.description,
        thumbnail: manifest.thumbnail,
        primaryColor: manifest.primaryColor,
        links: manifest.links,
        translations: manifest.translations,
    };
}
