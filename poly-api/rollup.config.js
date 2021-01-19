import sucrase from "@rollup/plugin-sucrase";

export default {
    input: ["src/index.ts", "src/spec.ts"],
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
        "@polypoly-eu/fetch-spec",
        "@polypoly-eu/rdf",
        "@polypoly-eu/rdf-spec",
        "chai",
        "chai-as-promised",
        "fast-check",
        "path"
    ]
};
