import copyWatch from "@polypoly-eu/rollup-plugin-copy-watch";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: "iife",
    },
    plugins: [
        css({ output: "css/bundle.css" }),
        json(),
        sucrase({ transforms: [] }),
        copyWatch({
            targets: [
                {
                    src: [
                        "node_modules/@polypoly-eu/podjs/dist/pod.js",
                        "node_modules/@polypoly-eu/poly-look/dist/css",
                    ],
                    dest: "dist",
                },
                {
                    src: ["src/static/*", "!src/static/fonts"],
                    dest: "dist",
                },
                {
                    src: ["src/locales/*"],
                    dest: "dist/locales",
                },
                {
                    src: ["src/static/fonts/*"],
                    dest: "dist/fonts",
                },
            ],
            verbose: true,
        }),
        resolve(),
    ],
};
