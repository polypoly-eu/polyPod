import {join} from "path";
import {Package, readPackage} from "../feature/package";

export interface Ops {
    dir?: string;
}

export async function detectFeature(options: Ops): Promise<Package> {
    const dir = options.dir || process.cwd();
    const packageJson = join(dir, "package.json");
    return readPackage(packageJson);
}

export async function block(): Promise<void> {
    (async () => {
        await new Promise(() => {
            // do nothing
        });
    })();
}