import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import virtual from "@rollup/plugin-virtual";

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
        // we only need the `convert` function from rdf-spec, so let's inline them here
        // pulling in rdf-spec also pulls in chai and fast-check, which Rollup doesn't really like, so we pretend they
        // don't exist
        virtual({
            "chai": "export const assert = {}",
            "fast-check": "export default {}"
        }),
        resolve(),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        })
    ],
    external: [
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
