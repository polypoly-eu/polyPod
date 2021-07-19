import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default {
    input: "src/components/facebook-import.js",
    output: {
        file: "dist/facebook-import.js",
        format: "iife",
    },
    plugins: [
        copy({
            targets: [
                {
                    src: [
                        "src/static/*",
                        "node_modules/@polypoly-eu/podjs/dist/pod.js",
                    ],
                    dest: "dist",
                },
            ],
        }),
        resolve(),
    ],
};
