import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";

export default {
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
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        })
    ],
    external: [
        "@polypoly-eu/aop-ts",
        "@polypoly-eu/bubblewrap",
        "@polypoly-eu/port-authority",
        "@polypoly-eu/port-authority/dist/node",
        "@polypoly-eu/postoffice",
        "@polypoly-eu/rdf",
        "fp-ts/lib/Either",
        "fp-ts/lib/pipeable",
        "io-ts/lib/Decoder"
    ]
};
