import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import {nodeResolve} from "@rollup/plugin-node-resolve";

const fileName = "src/main/javascript/index.ts";
export default [
    {
        input: fileName,
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
        input: fileName,
        output: {
            file: "build/js/bubblewrap.js",
            format: "iife",
            name: "bubblewrap"

        },
        context: 'window',
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
