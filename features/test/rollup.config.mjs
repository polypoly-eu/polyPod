import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/test.ts",
    output: {
        dir: "dist",
        format: "iife",
        name: "testFeature",
    },
    plugins: [
        genPodjs({
            build_dir: "./dist",
            manifestPath: "./src/manifest.json",
        }),
        copy({
            targets: [
                { src: "node_modules/mocha/mocha.js", dest: "dist" },
                { src: "node_modules/mocha/mocha.css", dest: "dist" },
                { src: "node_modules/chai/chai.js", dest: "dist" },
            ],
        }),
        copy({
            targets: [
                { src: "src/index.html", dest: "dist" },
                { src: "src/manifest.json", dest: "dist" },
                { src: "src/images/*", dest: "dist/images" },
            ],
        }),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),
    ],
};
