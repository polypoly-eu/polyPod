import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const communicationFileName = "src/index.ts";
export default [
    {
        input: communicationFileName,
        output: [
            {
                file: "dist/index.es.js",
                format: "esm",
            },
            {
                file: "dist/index.js",
                format: "cjs",
            },
        ],
        plugins: [
            nodeResolve(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
    },
    {
        input: communicationFileName,
        output: {
            file: "dist/communication.js",
            format: "iife",
            name: "communication",
        },
        context: "null",
        plugins: [
            nodeResolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
    },
];
