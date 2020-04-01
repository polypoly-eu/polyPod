import tempy from "tempy";
import {promises as fs} from "fs";
import {rollup} from "rollup";
// @ts-ignore
import {configs} from "../../build/rollup-common";

export async function tempBundle(target: string): Promise<string> {
    const targetPath = tempy.file({ extension: "js" });
    const rollupBuild = await rollup(configs[target]);
    const outputOptions = configs[target].output;
    const { output } = await rollupBuild.generate(outputOptions);
    await fs.writeFile(targetPath, output[0].code, { encoding: "utf-8" });
    return targetPath;
}