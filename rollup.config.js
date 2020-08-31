import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import executable from "rollup-plugin-executable";

export default [
    {
        input: ["src/index.ts", "src/cli.ts"],
        output: {
            dir: "dist",
            format: "cjs"
        },
        plugins: [
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            }),
            executable()
        ],
        external: [
            "@polypoly-eu/customs",
            "@polypoly-eu/poly-api",
            "@polypoly-eu/podigree",
            "@rdfjs/dataset",
            "connect",
            "exposed-promises",
            "fs",
            "path",
            "puppeteer",
            "events",
            "memfs",
            "node-fetch",
            "open",
            "serve-static",
            "yargs"
        ]
    },
    {
        input: "src/container.ts",
        output: {
            file: "dist/container.js",
            format: "iife"
        },
        plugins: [
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: [
            "@polypoly-eu/port-authority/dist/node"
        ]
    }
];
