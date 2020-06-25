import sucrase from "@rollup/plugin-sucrase";
import executable from "rollup-plugin-executable";

export default {
    input: ["src/index.ts", "src/cli.ts"],
    output: {
        dir: "dist",
        format: "cjs"
    },
    plugins: [
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        }),
        executable()
    ],
    external: [
        "@polypoly-eu/customs",
        "@polypoly-eu/poly-api",
        "@polypoly-eu/podigree",
        "@polypoly-eu/feature-harness",
        "@rdfjs/dataset",
        "@rollup/plugin-node-resolve",
        "@rollup/plugin-commonjs",
        "@rollup/plugin-sucrase",
        "express",
        "fs",
        "path",
        "puppeteer",
        "events",
        "memfs",
        "node-fetch",
        "open",
        "mkdirp",
        "sass",
        "yargs"
    ]
};
