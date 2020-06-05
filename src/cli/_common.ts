import {join} from "path";
import {Manifest, readManifest} from "@polypoly-eu/customs";

export interface Ops {
    dir?: string;
}

export async function detectFeature(options: Ops): Promise<[string, Manifest]> {
    const dir = options.dir || process.cwd();
    const packageJson = join(dir, "package.json");
    const manifest = await readManifest(packageJson);
    return [dir, manifest];
}
