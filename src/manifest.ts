import * as Decode from "io-ts/lib/Decoder";
import {left, right, fold} from "fp-ts/lib/Either";
import readPkg from "@pnpm/read-package-json";
import {pipe} from "fp-ts/lib/pipeable";
import {draw} from "io-ts/lib/Tree";
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
export class ValidationError extends Error {
    constructor(
        msg: string,
        readonly details?: string
    ) {
        super(msg);
    }
}

function expect<T>(input: unknown, msg: string, decoder: Decode.Decoder<T>): T {
    return pipe(
        decoder.decode(input),
        fold(
            error => {
                throw new ValidationError(msg, draw(error));
            },
            t => t
        )
    );
}

const relativeDecoder = Decode.parse(
    Decode.string,
    string => {
        const path = normalize(string);

        if (isAbsolute(path) || path.startsWith(".."))
            return left("Path must be relative");

        return right(string);
    }
);

const mainDecoder = Decode.type({
    name: Decode.string,
    version:
        Decode.parse(
            Decode.string,
            string => {
                const parsed = parseSemVer(string);
                if (parsed === null)
                    return left(`Invalid version string ${string}`);

                return right(parsed);
            }
        ),
    main: relativeDecoder
});

const engineDecoder = Decode.type({
    polypoly:
        Decode.parse(
            Decode.string,
            string => {
                try {
                    return right(new Range(string));
                }
                catch (err) {
                    return left(err.message);
                }
            }
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