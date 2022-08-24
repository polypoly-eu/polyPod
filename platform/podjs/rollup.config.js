import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";

export default [
    {
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
        external: ["chai"],
        onwarn: (warning) => {
            if (
                warning.code === "CIRCULAR_DEPENDENCY" &&
                warning.cycle[0].match(/fast-check/)
            ) {
                return;
            }
        },
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
        onwarn: (warning) => {
            if (
                warning.code === "CIRCULAR_DEPENDENCY" &&
                warning.cycle[0].match(/fast-check/)
            ) {
                return;
            }
        },
    },
];
