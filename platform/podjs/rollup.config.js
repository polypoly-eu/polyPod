import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";

import inject from "@rollup/plugin-inject";
import path from "path";

const externalManifestFile = path.resolve(
    __dirname,
    "src/static/manifest.json"
);

const globals = {
    [externalManifestFile]: "$inject_window_manifestData",
};

export default [
    {
        input: "src/index.ts",
        external: [externalManifestFile, "$inject_window_manifestData"],
        output: [
            {
                file: "dist/index.es.js",
                format: "esm",
                globals,
            },
            {
                file: "dist/index.js",
                format: "cjs",
                globals,
            },
        ],
        plugins: [
            json(),
            resolve(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            inject({
                "window.manifestData": externalManifestFile,
                dest: "dist",
                preventAssignment: true,
            }),
        ],
        context: "window",
    },
    {
        input: "src/pod.ts",
        external: [externalManifestFile, "$inject_window_manifestData"],
        output: [
            {
                file: "dist/pod.js",
                format: "iife",
                globals,
            },
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            inject({
                "window.manifestData": externalManifestFile,
                dest: "dist",
                preventAssignment: true,
            }),
        ],
        context: "window",
    },
];
