import {Manifest} from "@polypoly-eu/customs";
import {InputOptions, Plugin, rollup} from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import {rootDir} from "../_dir";
import * as sass from "sass";
import {promises as fs} from "fs";
import mkdirp from "mkdirp";
import {join} from "path";
// @ts-ignore
import sucrase from "@rollup/plugin-sucrase";
// @ts-ignore
import nodeSassTildeImporter from "node-sass-tilde-importer";

const plugins: Plugin[] = [
    resolve(),
    commonjs(),
    sucrase({
        exclude: [`${rootDir}/node_modules/**`],
        transforms: ["typescript", "jsx"]
    })
];

async function processJS(input: string, output: string): Promise<void> {
    console.log("Processing JS ...");

    const inputOptions: InputOptions = {
        input,
        external: [
            "react",
            "react-dom"
        ],
        plugins
    };

    const rollupBuild = await rollup(inputOptions);

    console.log(`Writing to ${output}`);

    await rollupBuild.write({
        file: output,
        format: "iife",
        sourcemap: "inline",
        name: "Feature",
        globals: {
            "react": "React",
            "react-dom": "ReactDOM"
        }
    });
}

async function processStyle(input: string, output: string): Promise<void> {
    console.log("Processing styles ...");

    const result = sass.renderSync({
        file: input,
        importer: nodeSassTildeImporter
    });

    console.log(`Writing to ${output}`);

    await mkdirp(join(output, ".."));
    await fs.writeFile(output, result.css, { flag: "w" });
}

export async function build(dir: string, manifest: Manifest): Promise<void> {
    const config = JSON.parse(await fs.readFile(join(dir, "orodruin.config.json"), { encoding: "utf-8" }));
    if (!config.build)
        throw new Error("Orodruin build configuration not found");

    const { inputJS, inputStyle } = config.build;
    if (!inputJS)
        throw new Error("Orodruin input JS file is not set");
    if (!inputStyle)
        throw new Error("Orodruin input (S)CSS file is not set");

    await Promise.all([
        processJS(join(dir, inputJS), join(dir, manifest.jsPath)),
        processStyle(join(dir, inputStyle), join(dir, manifest.assetBasePath, manifest.cssPath))
    ]);

    console.log("Done");
}