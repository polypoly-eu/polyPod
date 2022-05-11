import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.es.js",
                format: "esm",
                globals: {
                    "@polypoly-eu/api": "api",
                },
            },
            {
                file: "dist/index.js",
                format: "cjs",
                globals: {
                    "@polypoly-eu/api": "api",
                },
            },
        ],
        plugins: [
            json(),
            resolve(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
        external: ["chai", "@polypoly-eu/api/"],
    },
    {
        input: "src/pod.ts",
        output: [
            {
                file: "dist/pod.js",
                format: "iife",
                globals: {
                    "@polypoly-eu/api": "api",
                },
            },
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
        external: ["@polypoly-eu/api/", "@polypoly-eu/api/dist/pod-api/spec"],
    },
];
