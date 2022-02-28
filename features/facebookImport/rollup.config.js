import resolve from "@rollup/plugin-node-resolve";
import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sucrase from "@rollup/plugin-sucrase";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import svg from "rollup-plugin-svg";

const fallbackURL = "http://localhost:8000";
const fallbackAuthorization = "username:password";

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
            replace({
                preventAssignment: true,
                "process.env.NODE_ENV": JSON.stringify("development"),
                "process.env.POLYPOD_POLYPEDIA_REPORT_URL": JSON.stringify(
                    process.env.POLYPOD_POLYPEDIA_REPORT_URL || fallbackURL
                ),
                "process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION":
                    JSON.stringify(
                        process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION ||
                            fallbackAuthorization
                    ),
            }),
            commonjs({
                include: /node_modules/,
            }),
            commandLineArgs.configServe
                ? serve({ contentBase: ["dist"], host: "localhost" })
                : null,
        ],
        external: Object.keys(externalPackages),
        onwarn: (warning) => {
            // overwite the default warning function
            if (
                warning.code === "CIRCULAR_DEPENDENCY" &&
                warning.cycle[0].match(/d3-/)
            ) {
                return;
            } else {
                console.warn(warning);
            }
        },
    };
};
