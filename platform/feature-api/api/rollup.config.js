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
        external: ["chai", "fast-check", "chai-as-promised", "uuid"],
    },
    // TODO: Include mock-pod.ts in dist/index*.js above
    {
        input: "src/pod-api/mock-pod.ts",
        output: [
            {
                file: "dist/pod-api/mock-pod.es.js",
                format: "esm",
            },
            {
                file: "dist/pod-api/mock-pod.js",
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
            "uuid",
        ],
    },
];
