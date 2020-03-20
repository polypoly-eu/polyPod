import sucrase from "@rollup/plugin-sucrase";

export default [
    {
        input: "src/index.ts",
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
                exclude: ["./node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: ["@polypoly-eu/bubblewrap"]
    },
    {
        input: "src/lib-node.ts",
        output: [
            {
                file: "dist/lib-node.js",
                format: "cjs"
            }
        ],
        plugins: [
            sucrase({
                exclude: ["./node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: ["@polypoly-eu/bubblewrap", "worker_threads", "express", "body-parser"]
    }
];
