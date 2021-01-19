import { detectFeature, Ops } from "./_common";
import mkdirp from "mkdirp";
import { pkg } from "../package";
import rimraf from "rimraf";
import { promisify } from "util";

export interface PackageCommandOps extends Ops {
    target: string;
}

export async function packageCommand(options: PackageCommandOps): Promise<void> {
    const [dir, manifest] = await detectFeature(options);

    console.log("Clearing target ...");

    await promisify(rimraf)(options.target);

    await mkdirp(options.target);

    console.log("Packaging feature ...");

    await pkg(dir, manifest, options.target);

    console.log("Done.");
}
