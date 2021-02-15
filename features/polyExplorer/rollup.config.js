import copy from "rollup-plugin-copy";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";

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
    plugins: [
        css({ output: "css/bundle.css" }),
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
                        "src/index.html",
                    ],
                    dest: "dist",
                },
            ],
            verbose: true,
        }),
        json(),
    ],
    external: ["react", "react-dom"],
};
