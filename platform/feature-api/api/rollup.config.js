import sucrase from "@rollup/plugin-sucrase";

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
