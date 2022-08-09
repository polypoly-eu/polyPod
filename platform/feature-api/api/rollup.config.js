import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            resolve(),
            commonjs(),
        ],
        external: ["chai", "fast-check", "chai-as-promised"],
    },
    {
        input: "src/pod-api/mock-pod.ts",
        output: [
            {
                file: "dist/mock-pod.es.js",
                format: "esm",
            },
            {
                file: "dist/mock-pod.js",
                format: "cjs",
            },
        ],
        plugins: [
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            resolve(),
            commonjs(),
        ],
        external: [
            "chai",
            "fast-check",
            "chai-as-promised",
            "memfs",
            "@rdfjs/dataset",
        ],
    },
];
