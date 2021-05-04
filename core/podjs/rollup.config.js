import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";

export default [
    {
        input: "src/pod.ts",
        output: [
            {
                file: "dist/pod.js",
                format: "iife",
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
        ],
    },
];
