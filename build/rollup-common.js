import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import virtual from "@rollup/plugin-virtual";
import {browserScriptsPath} from "./paths";
import {join} from "path";
import executable from "rollup-plugin-executable";

export const configs = {
    bootstrap: {
        input: "src/harness/bootstrap.ts",
        output: {
            file: join(browserScriptsPath, "bootstrap.js.txt"),
            format: "iife"
        },
        plugins: [
            virtual({
                // prevent Rollup from traversing body-parser
                "body-parser": ""
            }),
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: [
            // those will be "shaken out", but declaring them here to avoid warnings
            "io-ts/lib/Tree",
            "io-ts/lib/Decoder",
            "fp-ts/lib/Either",
            "fp-ts/lib/pipeable"
        ]
    },
    cli: {
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
            }),
            executable()
        ],
        external: [
            "express",
            "fs",
            "path",
            "events",
            "memfs",
            "node-fetch",
            "@polypoly-eu/customs",
            "@polypoly-eu/poly-api",
            "@polypoly-eu/podigree",
            "open",
            "mkdirp",
            "node-sass-tilde-importer",
            "@rdfjs/dataset",
            "rollup",
            "@rollup/plugin-node-resolve",
            "@rollup/plugin-commonjs",
            "@rollup/plugin-sucrase",
            "sass",
            "yargs"
        ]
    }
};