import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import executable from "rollup-plugin-executable";
import nodePolyfills from "rollup-plugin-node-polyfills";

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
            "ejs",
            "exposed-promises",
            "fs",
            "mkdirp",
            "path",
            "puppeteer",
            "recursive-copy",
            "rimraf",
            "events",
            "node-fetch",
            "open",
            "serve-static",
            "util",
            "yargs"
        ]
    },
    {
        input: "src/container.ts",
        output: {
            file: "dist/container.js",
            name: "Container",
            format: "iife"
        },
        plugins: [
            resolve({
                preferBuiltins: true
            }),
            commonjs(),
            nodePolyfills(),
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
