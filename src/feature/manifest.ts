import {promises as fs} from "fs";
import {join} from "path";

interface RawManifest {
    name: string;
    jsPath: string;
    cssPaths: ReadonlyArray<string>;
}

export type Manifest = Readonly<RawManifest>;

export async function readManifest(path: string): Promise<Manifest> {
    const packageJson = await fs.readFile(path, { encoding: "utf-8" });
    const root = join(path, "..");
    const { name, main, polypoly } = JSON.parse(packageJson);
    const { styles } = polypoly;
    return {
        name,
        jsPath: join(root, main),
        cssPaths: styles.map((style: string) => join(root, style))
    };
}