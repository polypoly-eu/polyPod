import {detectFeature, Ops} from "./_common";
import {build} from "../build";

export type BuildCommandOps = Ops;

export async function buildCommand(options: BuildCommandOps): Promise<void> {
    const [dir, manifest] = await detectFeature(options);
    await build(dir, manifest);
}
