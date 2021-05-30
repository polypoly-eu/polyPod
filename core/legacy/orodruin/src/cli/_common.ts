import { join } from "path";
import { Manifest, readManifest } from "@polypoly-eu/manifest-parser";
import readPkg from "@pnpm/read-package-json";

export interface Ops {
    dir?: string;
}

export async function detectFeature(options: Ops): Promise<[string, Manifest]> {
    const dir = options.dir || process.cwd();
    const packagePath = join(dir, "manifest.json");
    const packageJson = readPkg(packagePath);
    const manifest = await readManifest(packageJson);
    return [dir, manifest];
}
