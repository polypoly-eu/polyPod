import resolve from "@rollup/plugin-node-resolve";
import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sucrase from "@rollup/plugin-sucrase";
import css from "rollup-plugin-css-only";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import svg from "rollup-plugin-svg";
import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";
import sillyI18n from "@polypoly-eu/silly-i18n/rollup-plugin.js";

const externalPackages = {
    "@polypoly-eu/poly-look": "polyLook",
    react: "React",
    "react-dom": "ReactDOM",
};

export default (commandLineArgs) => {
    return {
        input: "src/facebookImporter.jsx",
        output: {
            file: "dist/facebook-import.js",
            format: "iife",
            globals: externalPackages,
        },
        plugins: [
            sillyI18n(),
            svg(),
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
                        src: ["src/static/fonts/jost*"],
                        dest: "dist/fonts",
                    },
                ],
            }),
            genPodjs({
                build_dir: "./dist",
                manifestPath: "./src/static/manifest.json",
            }),
            resolve(),
            replace({
                preventAssignment: true,
                "process.env.NODE_ENV": JSON.stringify("development"),
            }),
            commonjs({
                include: /node_modules/,
            }),
            commandLineArgs.configServe ? serve("dist") : null,
        ],
        external: Object.keys(externalPackages),
        onwarn: (warning) => {
            // overwite the default warning function
            if (
                warning.code === "CIRCULAR_DEPENDENCY" &&
                warning.cycle[0].match(/(d3-|facebook-context)/)
            ) {
                return;
            } else {
                console.warn(warning);
            }
        },
    };
};
