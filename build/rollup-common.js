import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import {bootstrapPath} from "./paths";

const externals = [
    "express",
    "fs",
    "path",
    "events",
    "memfs",
    "node-fetch",
    "@polypoly-eu/poly-api",
    "@polypoly-eu/postoffice",
    "@polypoly-eu/postoffice/dist/lib-node",
    "@polypoly-eu/bubblewrap",
    "@polypoly-eu/rdf",
];

export const configs = {
    "bootstrap":
        {
            input: "src/harness/bootstrap.ts",
            output: {
                file: bootstrapPath,
                format: "iife"
            },
            plugins: [
                resolve(),
                commonjs(),
                sucrase({
                    exclude: ["node_modules/**"],
                    transforms: ["typescript"]
                })
            ]
        },
    "cli":
        {
            input: "src/cli.ts",
            output: {
                file: "dist/cli.js",
                format: "cjs",
                banner: "#!/usr/bin/env node"
            },
            plugins: [
                sucrase({
                    exclude: ["node_modules/**"],
                    transforms: ["typescript"]
                })
            ],
            external: [
                ...externals,
                "open",
                "mkdirp",
                "node-sass-tilde-importer",
                "rollup",
                "rollup-plugin-node-builtins",
                "rollup-plugin-node-globals",
                "@rollup/plugin-node-resolve",
                "@rollup/plugin-commonjs",
                "@rollup/plugin-sucrase",
                "sass",
                "yargs"
            ]
        }
};