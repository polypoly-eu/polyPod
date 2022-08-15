import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import { wasm } from '@rollup/plugin-wasm';

const common = {
    plugins: [
        json(),
        resolve(),
        commonjs(),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),
        wasm({targetEnv: "auto-inline"}),
    ],
    context: "window",
};

export default [
    {
        ...common,
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.js",
                format: "esm",
                globals: {
                    "@polypoly-eu/api": "api",
                },
            },
        ],
        external: ["chai"],
    },
    {
        ...common,
        input: "src/pod.ts",
        output: [
            {
                file: "dist/pod.js",
                format: "iife",
            },
        ]
    },
];
