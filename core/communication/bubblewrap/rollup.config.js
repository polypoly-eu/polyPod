import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import {nodeResolve} from "@rollup/plugin-node-resolve";

const mainFileName = "src/main/javascript/index.ts";
export default [
    {
        input: mainFileName,
        output: [
            {
                file: "dist/index.es.js",
                format: "esm"
            },
            {
                file: "dist/index.js",
                format: "cjs"
            }
        ],
        plugins: [
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: ["@msgpack/msgpack"]
    },
    {
        input: mainFileName,
        output: {
            file: "build/js/bubblewrap.js",
            format: "iife",
            name: "bubblewrap"

        },
        context: 'null',
        plugins: [
            commonjs(),
            nodeResolve(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ]
    }
];
