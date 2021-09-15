import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import sucrase from "@rollup/plugin-sucrase";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";

const fallbackURL = "http://localhost:8000";
const fallbackAuthorization = "username:password";

export default (commandLineArgs) => {
    return {
        input: "src/facebookImporter.jsx",
        output: {
            file: "dist/facebook-import.js",
            format: "iife",
            globals: {
                react: "React",
                "react-dom": "ReactDOM",
            },
        },
        plugins: [
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
                            "src/static/*",
                            "node_modules/react/umd/react.development.js",
                            "node_modules/react-dom/umd/react-dom.development.js",
                            "node_modules/@polypoly-eu/podjs/dist/pod.js",
                            "node_modules/poly-look/dist/poly-look.bundled.js",
                        ],
                        dest: "dist",
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
            commandLineArgs.configServe ? serve("dist") : null,
        ],
        external: ["react", "react-dom"],
    };
};
