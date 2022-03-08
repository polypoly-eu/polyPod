import typescript from "@rollup/plugin-typescript";
import copy from "@polypoly-eu/rollup-plugin-copy-watch";

export default {
    input: "src/test.ts",
    output: {
        dir: "dist",
        format: "iife",
        name: "testFeature",
    },
    plugins: [
        copy({ targets: [{ src: "src/index.html", dest: "dist" }] }),
        typescript(),
    ],
};
