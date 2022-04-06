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
                name: "communication",
            },
            /*            {
                inlineDymamicImports: true,
                file: "dist/index.js",
                format: "cjs",
            },
            {
                file: "dist/communication.js",
                format: "iife",
                name: "communication",
            },
 */
        ],
        plugins: [
            nodeResolve(),
            json(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
    },
];
