import * as Decode from "io-ts/lib/Decoder";
import {fold} from "fp-ts/lib/Either";
import readPkg from "@pnpm/read-package-json";
import {pipe} from "fp-ts/lib/pipeable";
import {parse as parseSemVer, SemVer, Range} from "semver";
import {normalize, isAbsolute} from "path";

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

export interface Manifest extends EngineManifest, MainManifest, RootManifest {}

// TODO duplicated code with podigree, should be a library
function expect<T>(input: unknown, msg: string, decoder: Decode.Decoder<T>): T {
    return pipe(
        decoder.decode(input),
        fold(
            error => {
                throw new Error(msg + "\n" + Decode.draw(error));
            },
            t => t
        )
    );
}

const relativeDecoder = pipe(
    Decode.string,
    Decode.parse(string => {
        const path = normalize(string);

        if (isAbsolute(path) || path.startsWith(".."))
            return Decode.failure(string, "relative");

        return Decode.success(string);
    })
);

const mainDecoder = Decode.type({
    name: Decode.string,
    version:
        pipe(
            Decode.string,
            Decode.parse(string => {
                const parsed = parseSemVer(string);
                if (parsed === null)
                    return Decode.failure(string, "version string");

                return Decode.success(parsed);
            })
        )
});

const engineDecoder = Decode.type({
    polypoly:
        pipe(
            Decode.string,
            Decode.parse(string => {
                try {
                    return Decode.success(new Range(string));
                }
                catch (err) {
                    return Decode.failure(string, err.message);
                }
            })
        )
});

const rootDecoder = Decode.type({
    polypoly: Decode.type({
        root: relativeDecoder
    })
});

export async function readManifest(pkgPath: string): Promise<Manifest> {
    const packageManifest = await readPkg(pkgPath);

    const rawMain = expect(packageManifest, "Failed to parse main manifest", mainDecoder);
    const rawEngine = expect(packageManifest.engines, "Failed to parse engines", engineDecoder);
    const rawRoot = expect(packageManifest, "Failed to parse Feature spec", rootDecoder);

    return {
        api: rawEngine.polypoly,
        root: rawRoot.polypoly.root,
        name: rawMain.name,
        version: rawMain.version
    };
}