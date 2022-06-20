import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sillyI18n from "@polypoly-eu/silly-i18n/rollup-plugin.js";
import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: "iife",
        globals: {},
    },
    plugins: [
        sillyI18n(),
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
            ],
            verbose: true,
        }),
    ],
};
