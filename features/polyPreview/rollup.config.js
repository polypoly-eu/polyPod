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
        sucrase({ "transforms": [] }),
        copyWatch({
            targets: [
                {
                    src: [
                        "src/static/*",
                        "node_modules/@polypoly-eu/podjs/dist/pod.js"
                    ],
                    dest: "dist",
                },
                {
                    src: [
                        "../../assets/fonts/jost_medium.ttf",
                        "../../assets/fonts/jost_regular.ttf",
                        "../../assets/fonts/jost_light.ttf",
                    ],
                    dest: "src/static/fonts",
                }
            ],
            verbose: true,
        }),
        resolve(),
    ],
};
