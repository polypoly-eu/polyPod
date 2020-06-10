import sucrase from "@rollup/plugin-sucrase";
import copy from "rollup-plugin-copy";
import executable from "rollup-plugin-executable";

export default {
    input: "src/cli.ts",
    output: {
        file: "dist/cli.js",
        format: "cjs",
        banner: "#!/usr/bin/env node"
    },
    plugins: [
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        }),
        copy({
            targets: [
                {
                    src: "node_modules/react/umd/react.development.js",
                    dest: "dist/browser"
                },
                {
                    src: "node_modules/react-dom/umd/react-dom.development.js",
                    dest: "dist/browser"
                }
            ]
        }),
        executable()
    ],
    external: [
        "express",
        "fs",
        "path",
        "events",
        "memfs",
        "node-fetch",
        "@polypoly-eu/customs",
        "@polypoly-eu/poly-api",
        "@polypoly-eu/podigree",
        "@polypoly-eu/feature-harness",
        "open",
        "mkdirp",
        "node-sass-tilde-importer",
        "@rdfjs/dataset",
        "rollup",
        "@rollup/plugin-node-resolve",
        "@rollup/plugin-commonjs",
        "@rollup/plugin-sucrase",
        "sass",
        "yargs"
    ]
};
