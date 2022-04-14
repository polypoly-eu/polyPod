import commonjs from "@rollup/plugin-commonjs";
// import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import merge from "deepmerge";

import { createBasicConfig } from "@open-wc/building-rollup";

import path from "path";

const baseConfig = createBasicConfig();

const pathResolve = (loc) => path.resolve(__dirname, loc);

const externalManifestFile = path.resolve("./static/manifest.json");
const nodeModules = "node_modules/**";

// const endpointsJSONFile = pathResolve(
//     "../../../../polyPod-config/endpoints.json"
// );

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
        external: [externalManifestFile],
        plugins: [
            nodeResolve([".ts"], { browser: true }),
            typescript({ useTsconfigDeclarationDir: true }),
            replace({
                DYNAMIC_IMPORT_MANIFEST: `"${externalManifestFile}"`,
                preventAssignment: true,
                dest: "dist",
            }),
            commonjs({
                include: nodeModules,
                extensions: [".js", ".ts", ".mjs", ".json"],
            }),
            // define({
            //     replacements: {
            //         "(typeof window).manifestData": "src/static/manifest.json",
            //     },
            // }),
            json(),
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
        external: [externalManifestFile],
        plugins: [
            nodeResolve([".ts"], { browser: true }),
            typescript({ useTsconfigDeclarationDir: true }),
            replace({
                DYNAMIC_IMPORT_MANIFEST: `"${externalManifestFile}"`,
                preventAssignment: true,
            }),
            // define({
            //     replacements: {
            //         MANIFESTDATA: "src/static/manifest.json",
            //     },
            // }),
            json(),
            commonjs({
                transformMixedEsModules: true,
                include: nodeModules,
                extensions: [".js", ".ts", ".mjs", ".json"],
            }),
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
