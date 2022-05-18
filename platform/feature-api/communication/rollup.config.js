import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const communicationFileName = "src/index.ts";
export default [
    {
        input: communicationFileName,
        output: [
            {
                dir: "dist",
                format: "esm",
            },
        ],
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            json(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
    },
    {
        input: [
            "src/port-authority/middleware.ts",
            "src/port-authority/specs.ts",
        ],
        output: {
            dir: "dist",
            format: "cjs",
        },
        plugins: [
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
        external: [
            "body-parser",
            "chai",
            "chai-as-promised",
            "connect",
            "fast-check",
        ],
    },
    {
        input: "src/remote-pod/bootstrap.ts",
        output: [
            {
                file: "dist/bootstrap.js",
                format: "iife",
            },
        ],
        context: "null",
        plugins: [
            nodeResolve(),
            json(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
        external: ["dist/port-authority/middleware"],
    },
];
