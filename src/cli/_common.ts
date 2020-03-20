import {Manifest, readManifest} from "../feature/manifest";
import {promises as fs} from "fs";
import {join} from "path";

export async function detectFeature(_dir?: string): Promise<Manifest> {
    const dir = _dir || process.cwd();
    const packageJson = join(dir, "package.json");
    await fs.stat(packageJson);
    return readManifest(packageJson);
}

export async function block(): Promise<void> {
    (async () => {
        await new Promise(() => {
            // do nothing
        });
    })();
}