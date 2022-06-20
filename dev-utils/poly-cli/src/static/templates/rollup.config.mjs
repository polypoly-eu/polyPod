import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import css from "rollup-plugin-css-only";
import sillyI18n from "@polypoly-eu/silly-i18n/rollup-plugin.js";
import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";

const externalPackages = {
    "@polypoly-eu/poly-look": "polyLook",
    react: "React",
    "react-dom": "ReactDOM",
};

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: "iife",
        globals: externalPackages,
    },
    plugins: [
        sillyI18n(),
        css({ output: "css/bundle.css" }),
        genPodjs({
            build_dir: "./dist",
            manifestPath: "./manifest.json",
        }),
        copy({
            targets: [
                {
                    src: ["manifest.json"],
                    dest: "dist",
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
