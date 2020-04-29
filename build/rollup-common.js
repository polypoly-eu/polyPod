import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import virtual from "@rollup/plugin-virtual";
import builtins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import {browserScriptsPath} from "./paths";
import {join} from "path";

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
        ]
    },
    reactGlobal: {
        input: "react",
        output: {
            file: join(browserScriptsPath, "react.js.txt"),
            format: "umd",
            name: "React"
        },
        plugins: [
            resolve(),
            commonjs(),
            builtins(),
            nodeGlobals()
        ]
    },
    reactDomGlobal: {
        input: "react-dom",
        output: {
            file: join(browserScriptsPath, "react-dom.js.txt"),
            format: "umd",
            name: "ReactDOM"
        },
        plugins: [
            resolve(),
            commonjs(),
            builtins(),
            nodeGlobals()
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
            })
        ],
        external: [
            "express",
            "fs",
            "path",
            "events",
            "memfs",
            "node-fetch",
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