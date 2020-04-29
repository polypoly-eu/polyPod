import tempy from "tempy";
import {promises as fs} from "fs";
import {OutputOptions, rollup, RollupOptions} from "rollup";
// @ts-ignore
import {configs as _configs} from "../../build/rollup-common";

const configs: Record<string, RollupOptions & { output: OutputOptions }> = _configs as any;

export async function tempBundle(target: string): Promise<string> {
    const targetPath = tempy.file({ extension: "js" });
    const rollupBuild = await rollup((configs as any)[target]);
    const outputOptions = configs[target].output;
    const { output } = await rollupBuild.generate(outputOptions);
    await fs.writeFile(targetPath, output[0].code, { encoding: "utf-8" });
    return targetPath;
}