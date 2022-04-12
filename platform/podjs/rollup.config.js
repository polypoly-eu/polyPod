import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import { rollupAdapter } from "@web/dev-server-rollup";

import path from "path";

const pathResolve = (loc) => path.resolve(__dirname, loc);

const externalManifestFile = path.resolve("./manifest.json");

// const globals = {
//     // ["$inject_window_manifestData"]: externalManifestFile,
//     [externalManifestFile]: "$inject_window_manifestData",
// };

export default [
    {
        input: pathResolve("src/index.ts"),
        output: [
            {
                file: pathResolve("dist/index.es.js"),
                format: "esm",
                // globals,
            },
            {
                file: pathResolve("dist/index.js"),
                format: "cjs",
                // globals,
            },
        ],
        plugins: [
            rollupAdapter(json()),
            // define({
            //     replacements: {
            //         "(typeof window).manifestData": "src/static/manifest.json",
            //     },
            // }),
            json(),
            resolve(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            // inject({
            //     "window.manifestData": "src/static/manifest.json",
            //     dest: "dist",
            //     preventAssignment: true,
            // }),
            replace({
                MANIFEST_FILE: externalManifestFile,
                preventAssignment: true,
                include: ["src/browserPod.ts"],
            }),
        ],
        context: "window",
    },
    {
        input: pathResolve("src/pod.ts"),
        output: [
            {
                file: pathResolve("dist/pod.js"),
                format: "iife",
                // globals,
            },
        ],
        plugins: [
            rollupAdapter(json()),

            // define({
            //     replacements: {
            //         MANIFESTDATA: "src/static/manifest.json",
            //     },
            // }),
            json(),
            resolve(),
            commonjs(),
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"],
            }),
            // inject({
            //     "window.manifestData": "src/static/manifest.json",
            //     dest: "dist",
            //     preventAssignment: true,
            // }),
            replace({
                MANIFEST_FILE: externalManifestFile,
                preventAssignment: true,
                include: ["src/browserPod.ts"],
            }),
        ],
        context: "window",
    },
];
