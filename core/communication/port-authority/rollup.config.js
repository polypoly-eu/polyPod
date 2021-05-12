import sucrase from "@rollup/plugin-sucrase";

export default {
    input: [
        "src/index.ts",
        "src/node.ts",
        "src/specs.ts"
    ],
    output: {
        dir: "dist",
        format: "cjs"
    },
    plugins: [
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        })
    ],
    external: [
        "body-parser",
        "chai",
        "chai-as-promised",
        "connect",
        "fast-check"
    ]
};
