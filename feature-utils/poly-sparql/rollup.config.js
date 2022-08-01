import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "cjs",
        name: "polySparql",
    },
    plugins: [
        sucrase({
            transforms: ["typescript"],
        }),
    ],
};
