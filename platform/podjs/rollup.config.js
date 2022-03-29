import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import inject from "@rollup/plugin-inject";
import json from "@rollup/plugin-json";

export default [
    {
        input: "src/index.ts",
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
            json(),
            resolve(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            inject({
                manifestPath: path.resolve("static/manifest.json"),
            }),
        ],
        context: "window",
    },
    {
        input: "src/pod.ts",
        output: [
            {
                file: "dist/pod.js",
                format: "iife",
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
    },
];
