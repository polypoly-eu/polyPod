import * as Decode from "io-ts/lib/Decoder";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { parse as parseSemVer, SemVer, Range } from "semver";
import { promises as fs } from "fs";

export interface EngineManifest {
    readonly api: Range;
}

export interface MainManifest {
    readonly name: string;
    readonly version: SemVer;
}

export interface RootManifest {
    readonly root: string;
}

export interface FeatureManifest {
    readonly name: string;
    readonly description: string;
    readonly thumbnail: string;
    readonly primaryColor: string;
    // TODO: Typecheck links object
    readonly links: unknown;
    // TODO: Typecheck translations object
    readonly translations: unknown;
}

export interface Manifest extends EngineManifest, MainManifest, RootManifest, FeatureManifest {}

// TODO duplicated code with podigree, should be a library
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
        const url = new URL(string, document.location.href);

        //if (isAbsolute(path) || path.startsWith("..")) return Decode.failure(string, "relative");

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

const engineDecoder = Decode.type({
    polypoly: pipe(
        Decode.string,
        Decode.parse((string) => {
            try {
                return Decode.success(new Range(string));
            } catch (err) {
                return Decode.failure(string, err.message);
            }
        })
    ),
});

const rootDecoder = Decode.type({
    polypoly: Decode.type({
        root: relativeDecoder,
        manifest: relativeDecoder,
    }),
});

const featureDecoder = Decode.type({
    name: Decode.string,
    description: Decode.string,
    thumbnail: relativeDecoder,
    primaryColor: Decode.string,
    links: Decode.UnknownRecord,
    translations: Decode.UnknownRecord,
});

export async function parseFeatureManifest(featureManifestJson: string): Promise<FeatureManifest> {
    return expect(featureManifestJson, "Failed to parse Feature manifest", featureDecoder);
}
export async function parseMainManifest(
    packageManifest: Record<string, unknown>
): Promise<MainManifest> {
    return expect(packageManifest, "Failed to parse main manifest", mainDecoder);
}

export async function parseEngineManifest(
    packageManifest: Record<string, unknown>
): Promise<EngineManifest> {
    return expect(packageManifest.engines, "Failed to parse engines", engineDecoder);
}

export async function parseRootManifest(
    packageManifest: Record<string, unknown>
): Promise<RootManifest> {
    return expect(packageManifest, "Failed to parse Feature spec", rootDecoder);
}

export async function combineManifest(packageManifest: Record<string, unknown>): Promise<Manifest> {
    const rawMain = expect(packageManifest, "Failed to parse main manifest", mainDecoder);
    const rawEngine = expect(packageManifest.engines, "Failed to parse engines", engineDecoder);
    const rawRoot = expect(packageManifest, "Failed to parse Feature spec", rootDecoder);
    const featureManifest = expect(
        packageManifest,
        "Failed to parse Feature manifest",
        featureDecoder
    );

    return {
        api: rawEngine.polypoly,
        root: rawRoot.polypoly.root,
        name: featureManifest.name,
        version: rawMain.version,
        description: featureManifest.description,
        thumbnail: featureManifest.thumbnail,
        primaryColor: featureManifest.primaryColor,
        links: featureManifest.links,
        translations: featureManifest.translations,
    };
}
