import { join } from "path";
import { Manifest, readManifest } from "@polypoly-eu/manifest-parser";

export interface Ops {
    dir?: string;
}

export async function detectFeature(options: Ops): Promise<[string, Manifest]> {
    const dir = options.dir || process.cwd();
    const packagePath = join(dir, "manifest.json");
    const packageJson = await (await import(packagePath)).json();
    const manifest = await readManifest(packageJson);
    return [dir, manifest];
}
