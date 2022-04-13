// import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
// import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";

import merge from "deepmerge";

import { createBasicConfig } from "@open-wc/building-rollup";

import path from "path";

const baseConfig = createBasicConfig();

const pathResolve = (loc) => path.resolve(__dirname, loc);

const externalManifestFile = path.resolve("./static/manifest.json");
// const nodeModules = "node_modules/**";

export default merge(baseConfig, [
    {
        input: pathResolve("src/index.ts"),
        output: [
            {
                file: pathResolve("dist/index.es.js"),
                format: "esm",
            },
            {
                file: pathResolve("dist/index.js"),
                format: "cjs",
            },
        ],
        plugins: [
            typescript(),
            replace({
                DYNAMIC_IMPORT_MANIFEST: `() => import("${externalManifestFile}")`,
                preventAssignment: true,
            }),
            // commonjs({
            //     include: nodeModules,
            //     extensions: [".js", ".ts", ".json"],
            // }),
            // define({
            //     replacements: {
            //         "(typeof window).manifestData": "src/static/manifest.json",
            //     },
            // }),
            json(),
            resolve(),
            // sucrase({
            //     exclude: [nodeModules],
            //     transforms: ["typescript"],
            // }),
            // inject({
            //     "window.manifestData": "src/static/manifest.json",
            //     dest: "dist",
            //     preventAssignment: true,
            // }),
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
            typescript(),
            replace({
                DYNAMIC_IMPORT_MANIFEST: `() => import("${externalManifestFile}")`,
                preventAssignment: true,
            }),
            // define({
            //     replacements: {
            //         MANIFESTDATA: "src/static/manifest.json",
            //     },
            // }),
            json(),
            resolve(),
            // commonjs({
            //     transformMixedEsModules: true,
            //     include: nodeModules,
            //     extensions: [".js", ".ts", ".mjs", ".json"],
            // }),
            // sucrase({
            //     exclude: [nodeModules],
            //     transforms: ["typescript"],
            // }),
            // inject({
            //     "window.manifestData": "src/static/manifest.json",
            //     dest: "dist",
            //     preventAssignment: true,
            // }),
        ],
        context: "window",
    },
]);
