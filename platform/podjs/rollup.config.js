import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";

function suppressSomeWarnings(warning, warn, code, regex) {
    if (warning.code != code || !warning.cycle[0].match(regex)) warn(warning);
}

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
};

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
        ...common,
        external: ["chai"],
        onwarn: (warning, warn) =>
            suppressSomeWarnings(
                warning,
                warn,
                "CIRCULAR_DEPENDENCY",
                /fast-check/
            ),
    },
    {
        input: "src/pod.ts",
        output: [
            {
                file: "dist/pod.js",
                format: "iife",
            },
        ],
        ...common,
        onwarn: (warning, warn) =>
            suppressSomeWarnings(
                warning,
                warn,
                "CIRCULAR_DEPENDENCY",
                /fast-check|chai\.js/
            ),
    },
];
