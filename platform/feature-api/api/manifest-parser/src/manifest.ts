import * as Decode from "io-ts/lib/Decoder";
import { fold } from "fp-ts/lib/Either";
import readPkg from "@pnpm/read-package-json";
import { pipe } from "fp-ts/function";
import { parse as parseSemVer, SemVer, Range } from "semver";
import { normalize, isAbsolute, join, dirname } from "path";
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
    readonly translations: unknown[];
}

export interface Manifest extends EngineManifest, MainManifest, RootManifest, FeatureManifest {}

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
        const path = normalize(string);

        if (isAbsolute(path) || path.startsWith("..")) return Decode.failure(string, "relative");

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
                return Decode.failure(string, (err as Error).message);
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
    translations: Decode.UnknownArray,
});

export async function readManifest(pkgPath: string): Promise<Manifest> {
    const packageManifest = await readPkg(pkgPath);

    const rawMain = expect(packageManifest, "Failed to parse main manifest", mainDecoder);
    const rawEngine = expect(packageManifest.engines, "Failed to parse engines", engineDecoder);
    const rawRoot = expect(packageManifest, "Failed to parse Feature spec", rootDecoder);

    let featureManifest: FeatureManifest = {
        name: rawMain.name,
        description: "",
        thumbnail: "",
        primaryColor: "",
        links: {},
        translations: [],
    };

    if (rawRoot.polypoly.manifest) {
        const manifestPath = join(dirname(pkgPath), rawRoot.polypoly.manifest);
        const featureManifestJson = JSON.parse(await fs.readFile(manifestPath, "utf8"));

        featureManifest = expect(
            featureManifestJson,
            "Failed to parse Feature manifest",
            featureDecoder
        );
    }

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
