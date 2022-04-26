import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import path from "path";

const pathResolve = (loc) => path.resolve(__dirname, loc);

const nodeModules = "node_modules/**";

export default [
    {
        input: pathResolve("src/index.ts"),
        output: [
            {
                file: pathResolve("dist/index.es.js"),
                format: "esm",
            },
            {
                file: pathResolve("dist/index.js"),
                format: "cjs",
            },
        ],
        plugins: [
            json(),
            resolve(),
            sucrase({
                exclude: [nodeModules],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
    },
    {
        input: pathResolve("src/pod.ts"),
        output: [
            {
                file: pathResolve("dist/pod.js"),
                format: "iife",
            },
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            sucrase({
                exclude: [nodeModules],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
    },
];
