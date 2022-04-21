import commonjs from "@rollup/plugin-commonjs";
// import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import path from "path";

const myCopyPlugin = require("./rollup.plugin.loadManifest.js");

const baseConfig = createBasicConfig();

const pathResolve = (loc) => path.resolve(__dirname, loc);

const externalManifestFile = "manifest.json";
const nodeModules = "node_modules/**";

export default (commandLineArgs) =>
    merge(baseConfig, [
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
            // external: [externalManifestFile],
            plugins: [
                nodeResolve(),
                //new
                typescript(),
                // new
                commonjs({
                    transformMixedEsModules: true,
                    include: nodeModules,
                    extensions: [".js", ".ts", ".mjs", ".cjs"],
                }),
                json(),
                // sucrase({
                //     exclude: [nodeModules],
                //     transforms: ["typescript"],
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
                },
                // {
                //     file: pathResolve("dist/pod.es.js"),
                //     format: "esm",
                // },
            ],
            // external: [externalManifestFile],
            plugins: [
                nodeResolve({
                    browser: true,
                }),
                // new
                typescript(),
                // replaceManifest({
                //     __DYNAMIC_IMPORT_MANIFEST__: externalManifestFile,
                // }),
                commonjs({
                    // new
                    transformMixedEsModules: true,
                    include: nodeModules,
                    extensions: [".js", ".ts", ".mjs", ".cjs"],
                }),
                json(),
                commandLineArgs.loadManifest
                    ? myCopyPlugin.loadManifest({
                          src: commandLineArgs.manifestJson,
                          dest: "/dist",
                      })
                    : null,
                // sucrase({
                //     exclude: [nodeModules],
                //     transforms: ["typescript"],
                // }),
            ],
            context: "window",
        },
    ]);
