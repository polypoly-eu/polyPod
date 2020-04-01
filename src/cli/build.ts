import {detectFeature, Ops} from "./_common";
import {InputOptions, Plugin, rollup} from "rollup";
import {rootDir} from "../_dir";
import {promises as fs} from "fs";
import * as sass from "sass";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// @ts-ignore
import builtins from "rollup-plugin-node-builtins";
// @ts-ignore
import nodeGlobals from "rollup-plugin-node-globals";
// @ts-ignore
import sucrase from "@rollup/plugin-sucrase";
// @ts-ignore
import nodeSassTildeImporter from "node-sass-tilde-importer";

export interface BuildCommandOps extends Ops {
    watch: boolean;
}

const plugins: Plugin[] = [
    resolve(),
    commonjs({
        namedExports: {
            "react": ["createElement"],
            "react-dom": ["render"],
        }
    }),
    nodeGlobals(),
    builtins(),
    sucrase({
        exclude: [`${rootDir}/node_modules/**`],
        transforms: ["typescript", "jsx"]
    })
];

async function processJS(input: string, output: string): Promise<void> {
    console.log("Processing JS ...");

    const inputOptions: InputOptions = {
        input,
        plugins
    };

    const rollupBuild = await rollup(inputOptions);

    console.log(`Writing to ${output}`);

    await rollupBuild.write({
        file: output,
        format: "iife",
        sourcemap: "inline",
        name: "Feature"
    });
}

async function processStyle(input: string, output: string): Promise<void> {
    console.log("Processing styles ...");

    const result = sass.renderSync({
        file: input,
        importer: nodeSassTildeImporter
    });

    console.log(`Writing to ${output}`);

    await fs.writeFile(output, result.css, { flag: "w" });
}

export async function buildCommand(options: BuildCommandOps): Promise<void> {
    const pkg = await detectFeature(options);
    if (!pkg.polypoly.build)
        throw new Error("Orodruin build flag is not set. Change package.json to add the key polypoly.build: true");

    const { inputJS, inputStyle } = pkg.polypoly;
    if (!inputJS)
        throw new Error("Orodruin input JS file is not set. Change package.json to add the key polypoly.inputJS");
    if (!inputStyle)
        throw new Error("Orodruin input (S)CSS file is not set. Change package.json to add the key polypoly.inputStyle");

    await Promise.all([
        processJS(inputJS, pkg.main),
        processStyle(inputStyle, pkg.polypoly.outputStyle)
    ]);

    console.log("Done");
}
