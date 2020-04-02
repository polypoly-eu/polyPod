import {promises as fs} from "fs";
import {join} from "path";

interface RawPackage {
    name: string;
    main: string;
    polypoly: Readonly<{
        build: boolean;
        inputJS?: string;
        inputStyle?: string;
        outputStyle: string;
    }>;
}

export type Package = Readonly<RawPackage>;

export async function readPackage(path: string): Promise<Package> {
    const packageJson = JSON.parse(await fs.readFile(path, { encoding: "utf-8" }));
    const root = join(path, "..");
    const { name, main, polypoly } = packageJson;
    const { build, inputJS, inputStyle, outputStyle } = polypoly || {};

    return {
        name,
        main,
        polypoly: {
            build: !!build,
            inputJS: inputJS ? join(root, inputJS) : undefined,
            inputStyle: inputStyle ? join(root, inputStyle) : undefined,
            outputStyle: outputStyle ? join(root, outputStyle) : join(main, "..", "feature.css")
        }
    };
}