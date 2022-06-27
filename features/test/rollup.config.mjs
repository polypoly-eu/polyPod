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
        genPodjs({ build_dir: "./dist" }),
        copy({ targets: [{ src: "src/index.html", dest: "dist" }] }),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),
    ],
};
