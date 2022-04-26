import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import svg from "rollup-plugin-svg";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import genPodjs from "@polypoly-eu/podjs/bin/genPodjs.js";

export default {
    input: "src/index.jsx",
    output: {
        file: "dist/index.js",
        format: "iife",
        globals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
    },
    //This is meant to suppress the warning for d3-selection circular dependencies (https://github.com/d3/d3-selection/issues/168)
    onwarn: function (warning, warn) {
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        warn(warning);
    },
    plugins: [
        genPodjs.loadManifest({
            build_dir: "./dist",
            manifestPath: "./src/static/manifest.json",
        }),
        svg(),
        css({ output: "css/bundle.css" }),
        json(),
        sucrase({
            transforms: ["jsx"],
            production: true,
        }),
        copy({
            targets: [
                {
                    src: [
                        "node_modules/react/umd/react.development.js",
                        "node_modules/react-dom/umd/react-dom.development.js",
                        "node_modules/@polypoly-eu/poly-look/dist/poly-look.js",
                    ],
                    dest: "dist",
                },
                {
                    src: [
                        "node_modules/@polypoly-eu/poly-look/dist/css/poly-look.css",
                    ],
                    dest: "dist/css",
                },
                {
                    src: ["src/static/*", "!src/static/fonts"],
                    dest: "dist",
                },
                {
                    src: ["src/static/fonts/*"],
                    dest: "dist/fonts",
                },
            ],
            verbose: true,
        }),
        resolve(),
        replace({
            preventAssignment: true,
            "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        commonjs({
            include: /node_modules/,
        }),
    ],
    external: ["react", "react-dom"],
};
