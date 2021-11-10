import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default {
    input: "src/test.ts",
    output: {
        dir: "dist",
        format: "cjs",
    },
    plugins: [
        copy({ targets: [{ src: "src/index.html", dest: "dist" }] }),
        typescript(),
    ],
};
