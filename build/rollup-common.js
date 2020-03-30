import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import {bootstrapPath} from "./paths";

export const externals = [
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
        }
};