import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
    input: "src/index.tsx",
    output: {
        file: "dist/bundle.js",
        format: "iife",
        globals: {
            react: "React",
            "react-dom": "ReactDOM",
            uuid: "uuid",
            "@polypoly-eu/silly-i18n": "@polypoly-eu/silly-i18n",
        },
    },
    plugins: [
        css({ output: "css/bundle.css" }),
        json(),
        sucrase({
            transforms: ["jsx", "typescript"],
            exclude: ["node_modules/**"],
            production: true,
        }),
        copy({
            targets: [
                {
                    src: [
                        "node_modules/react/umd/react.development.js",
                        "node_modules/react-dom/umd/react-dom.development.js",
                        "node_modules/@polypoly-eu/podjs/dist/pod.js",
                        "src/static/*",
                    ],
                    dest: "dist",
                },
            ],
            verbose: true,
        }),
        resolve(),
        commonjs(),
        replace({
            "process.env.NODE_ENV": JSON.stringify("production"),
            preventAssignment: true,
        }),
    ],
    external: ["react", "react-dom", "uuid", "@polypoly-eu/silly-i18n"],
};
