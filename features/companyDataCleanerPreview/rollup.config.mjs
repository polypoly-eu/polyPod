import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import css from "rollup-plugin-css-only";
import sillyI18n from "@polypoly-eu/silly-i18n/rollup-plugin.js";
import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";
import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const externalPackages = {
    "@polypoly-eu/poly-look": "polyLook",
    react: "React",
    "react-dom": "ReactDOM",
    "react-dom/client": "ReactDOM",
};

export default {
    input: "src/index.jsx",
    output: {
        file: "dist/index.js",
        format: "iife",
        globals: externalPackages,
    },
    external: Object.keys(externalPackages),
    plugins: [
        sillyI18n(),
        css({ output: "css/bundle.css" }),
        genPodjs({
            build_dir: "./dist",
            manifestPath: "./src/static/manifest.json",
        }),
        json(),
        sucrase({
            transforms: ["jsx"],
            production: true,
        }),
        resolve(),
        copy({
            targets: [
                {
                    src: ["./src/static/*", "!src/static/fonts"],
                    dest: "dist",
                },
                {
                    src: ["src/static/fonts/*"],
                    dest: "dist/fonts/",
                },
                {
                    src: [
                        "node_modules/@polypoly-eu/poly-look/dist/css/poly-look.css",
                    ],
                    dest: "dist/css",
                },
                {
                    src: [
                        "node_modules/react/umd/react.development.js",
                        "node_modules/react-dom/umd/react-dom.development.js",
                        "node_modules/@polypoly-eu/poly-look/dist/poly-look.js",
                    ],
                    dest: "dist",
                },
            ],
            verbose: true,
        }),
    ],
};
