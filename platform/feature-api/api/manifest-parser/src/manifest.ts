import * as Decode from "io-ts/lib/Decoder";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/function";
import { parse as parseSemVer, SemVer, Range } from "semver";

export interface MainManifest {
    readonly name: string;
    readonly version: SemVer;
}

export interface FeatureManifest {
    readonly description: string;
    readonly thumbnail: string;
    readonly primaryColor: string;
    // TODO: Typecheck links object
    readonly links: unknown;
    // TODO: Typecheck translations object
    readonly translations: unknown;
}

export interface Manifest extends MainManifest, FeatureManifest {}

function expect<I, A>(input: I, msg: string, decoder: Decode.Decoder<I, A>): A {
    return pipe(
        decoder.decode(input),
        fold(
            (error) => {
                throw new Error(msg + "\n" + Decode.draw(error));
            },
            (t) => t
        )
    );
}

const relativeDecoder = pipe(
    Decode.string,
    Decode.parse((string) => {
        if (typeof document == "undefined") {
            return Decode.success(string);
        }
        const url = new URL(string, document.location.href);
        if (url.toString() == "") return Decode.failure(string, "relative");

        return Decode.success(string);
    })
);

const mainDecoder = Decode.type({
    name: Decode.string,
    version: pipe(
        Decode.string,
        Decode.parse((string) => {
            const parsed = parseSemVer(string);
            if (parsed === null) return Decode.failure(string, "version string");

            return Decode.success(parsed);
        })
    ),
});

const featureDecoder = Decode.type({
    name: Decode.string,
    description: Decode.string,
    thumbnail: relativeDecoder,
    primaryColor: Decode.string,
    links: Decode.UnknownRecord,
    translations: Decode.UnknownRecord,
});

export async function readManifest(packageManifest: Record<string, unknown>): Promise<Manifest> {
    const rawMain = expect(packageManifest, "Failed to parse main manifest", mainDecoder);
    const featureManifest = expect(
        packageManifest,
        "Failed to parse Feature manifest",
        featureDecoder
    );

    return {
        name: featureManifest.name,
        version: rawMain.version,
        description: featureManifest.description,
        thumbnail: featureManifest.thumbnail,
        primaryColor: featureManifest.primaryColor,
        links: featureManifest.links,
        translations: featureManifest.translations,
    };
}
