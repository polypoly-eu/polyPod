import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import { wasm } from "@rollup/plugin-wasm";

const common = {
    plugins: [
        json(),
        resolve(),
        commonjs(),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),
        wasm({ targetEnv: "auto-inline" }),
    ],
    context: "window",
    onwarn: (warning) => {
        if (
            warning.code === "CIRCULAR_DEPENDENCY" &&
            warning.cycle[0].match(/fast-check/)
        )
            return;
    },
};

const common = {
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
    onwarn: (warning, warn) => {
        if (
            warning.code != "CIRCULAR_DEPENDENCY" ||
            !warning.cycle[0].match(/fast-check|chai\.js/)
        )
            warn(warning);
    },
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
        ...common,
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
        ],
        ...common,
    },
];
