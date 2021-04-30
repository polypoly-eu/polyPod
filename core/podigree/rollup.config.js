import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: [
            "@polypoly-eu/aop-ts",
            "@polypoly-eu/bubblewrap",
            "@polypoly-eu/port-authority",
            "@polypoly-eu/port-authority/dist/node",
            "@polypoly-eu/poly-api",
            "@polypoly-eu/postoffice",
            "@polypoly-eu/rdf",
            "@polypoly-eu/rdf-convert",
            "@rdfjs/dataset",
            "fp-ts/lib/Either",
            "fp-ts/lib/pipeable",
            "io-ts/lib/Decoder",
            "memfs"
        ]
    },
    {
        input: "src/container_bootstrap.ts",
        output: [
            {
                file: "dist/bootstrap.js",
                format: "iife"
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: [
            "@polypoly-eu/port-authority/dist/node"
        ]
    }
];
