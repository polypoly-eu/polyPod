import resolve from "@rollup/plugin-node-resolve";
import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sucrase from "@rollup/plugin-sucrase";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import serve from "rollup-plugin-serve";
import svg from "rollup-plugin-svg";
import replace from "@rollup/plugin-replace";

import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";

const externalPackages = {
    "@polypoly-eu/poly-look": "polyLook",
    react: "React",
    "react-dom": "ReactDOM",
};

export default (commandLineArgs) => {
    return {
        input: "src/google.jsx",
        output: {
            file: "dist/google.js",
            format: "iife",
            globals: externalPackages,
        },
        plugins: [
            svg(),
            css({ output: "css/bundle.css" }),
            json(),
            sucrase({
                transforms: ["jsx"],
                production: true,
            }),
            genPodjs({
                build_dir: "./dist",
                manifestPath: "./src/static/manifest.json",
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
            }),
            resolve(),
            commonjs({
                include: /node_modules/,
            }),
            replace({
                preventAssignment: true,
                "process.env.NODE_ENV": JSON.stringify("development"),
            }),
            commandLineArgs.configServe ? serve("dist") : null,
        ],
        external: Object.keys(externalPackages),
        onwarn: (warning) => {
            // overwite the default warning function
            if (
                warning.code === "CIRCULAR_DEPENDENCY" &&
                warning.cycle[0].match(/(d3-|importer-context)/)
            ) {
                return;
            } else {
                console.warn(warning);
            }
        },
    };
};
