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
    },
    // TODO: Include mock-pod.ts in dist/index*.js above
    {
        input: "src/mock-pod.ts",
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
        external: ["memfs", "@rdfjs/dataset", "uuid"],
    },
];
