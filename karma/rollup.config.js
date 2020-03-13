import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/tests/_util/karma-middleware.ts",
    output: [{
        file: "karma/dist/index.js",
        format: "cjs"
    }],
    plugins: [
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        })
    ],
    external: ["@polypoly-eu/bubblewrap", "express", "body-parser", "memfs"]
};
