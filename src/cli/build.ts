import {detectFeature, Ops} from "./_common";
import {build} from "../feature/build";

export interface BuildCommandOps extends Ops {
    watch: boolean;
}

export async function buildCommand(options: BuildCommandOps): Promise<void> {
    const pkg = await detectFeature(options);
    await build(pkg);
}
