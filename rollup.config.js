import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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

export default [
    {
        input: "src/feature/bootstrap.ts",
        output: {
            file: "dist/bootstrap/index.js.txt",
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
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            format: "cjs"
        },
        plugins: [
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: externals
    },
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
            "yargs"
        ]
    }
];
