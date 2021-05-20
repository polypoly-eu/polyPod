import copy from "rollup-plugin-copy";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import svg from "rollup-plugin-svg";

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
                        "node_modules/@polypoly-eu/podjs/dist/pod.js",
                        "src/static/*",
                    ],
                    dest: "dist",
                },
            ],
            verbose: true,
        }),
        resolve(),
    ],
    external: ["react", "react-dom"],
};
