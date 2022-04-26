import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import path from "path";

const baseConfig = createBasicConfig();

const pathResolve = (loc) => path.resolve(__dirname, loc);

const nodeModules = "node_modules/**";

export default () =>
    merge(baseConfig, [
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
                nodeResolve(),
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
                nodeResolve(),
                commonjs({}),
                sucrase({
                    exclude: [nodeModules],
                    transforms: ["typescript"],
                }),
            ],
            context: "window",
        },
    ]);
