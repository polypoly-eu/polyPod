import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import path from "path";

const baseConfig = createBasicConfig();

const pathResolve = (loc) => path.resolve(__dirname, loc);

const externalManifestFile = "manifest.json";
const nodeModules = "node_modules/**";

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
            typescript(),
            commonjs({
                include: nodeModules,
                extensions: [".js", ".ts", ".mjs", ".json"],
            }),
            json(),
            sucrase({
                exclude: [nodeModules],
                transforms: ["typescript"],
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
            },
            {
                file: pathResolve("dist/pod.es.js"),
                format: "esm",
            },
        ],
        external: [externalManifestFile],
        plugins: [
            nodeResolve([".ts"], { browser: true }),
            typescript(),
            // copy({
            //     targets: [
            //         {
            //             src: "src/static/manifest.json",
            //             dest: "dist",
            // transform: (contents, filename) =>
            //     contents
            //         .toString()
            //         .replace(
            //             "__DYNAMIC_IMPORT_MANIFEST__",
            //             "manifest.json"
            //         ),
            //         },
            //     ],
            // }),
            replaceManifest({
                __DYNAMIC_IMPORT_MANIFEST__: externalManifestFile,
            }),
            json(),
            commonjs({
                transformMixedEsModules: true,
                include: nodeModules,
                extensions: [".js", ".ts", ".mjs", ".json"],
            }),
            sucrase({
                exclude: [nodeModules],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
    },
]);

import MagicString from "magic-string";
import { createFilter } from "rollup-pluginutils";

function escape(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

// function ensureFunction(functionOrValue) {
//     if (typeof functionOrValue === "function") return functionOrValue;
//     return () => functionOrValue;
// }

function longest(a, b) {
    return b.length - a.length;
}

function getReplacements(options) {
    if (options.values) {
        return Object.assign({}, options.values);
    } else {
        const values = Object.assign({}, options);
        delete values.delimiters;
        delete values.include;
        delete values.exclude;
        delete values.sourcemap;
        delete values.sourceMap;
        return values;
    }
}

// function mapToFunctions(object) {
//     return Object.keys(object).reduce((functions, key) => {
//         functions[key] = ensureFunction(object[key]);
//         return functions;
//     }, {});
// }

export function replaceManifest(options = {}) {
    console.log(options);

    const filter = createFilter(options.include, options.exclude);
    const { delimiters } = options;
    console.log(delimiters);
    // const functionValues = mapToFunctions(getReplacements(options));
    // const keys = Object.keys(functionValues).sort(longest).map(escape);

    const pattern = delimiters
        ? new RegExp(
              `${escape(delimiters[0])}(${keys.join("|")})${escape(
                  delimiters[1]
              )}`,
              "g"
          )
        : new RegExp(`\\b(${keys.join("|")})\\b`, "g");

    return {
        name: "replaceManifest",

        transform(code, id) {
            if (!filter(id)) return null;

            const magicString = new MagicString(code);

            let hasReplacements = false;
            let match;
            let start;
            let end;
            let replacement;

            while ((match = pattern.exec(code))) {
                hasReplacements = true;

                start = match.index;
                end = start + match[0].length;
                replacement = String(functionValues[match[1]](id));

                console.log(start);
                console.log(end);
                console.log(replacement);
                console.log(match[1]);

                replacement = fetchManifestJson(match[1]);

                magicString.overwrite(start, end, replacement);
                console.log(magicString);
            }

            if (!hasReplacements) return null;

            const result = { code: magicString.toString() };
            if (options.sourceMap !== false && options.sourcemap !== false)
                result.map = magicString.generateMap({ hires: true });

            console.log(result);

            return result;
        },
    };
}

function fetchManifestJson(externalManifestFile) {
    const opts = {
        method: "GET",
        headers: {
            mode: "no-cors",
            "Content-Type": "application/json",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Dest": "empty",
        },
    };

    const http = (request) => {
        return new Promise((resolve) => {
            fetch(request, opts)
                .then((response) => response.json())
                .then((body) => {
                    resolve(body);
                });
        });
    };

    try {
        // Fetch the manifest-data JSON
        return http(externalManifestFile);
    } catch (error) {
        console.warn(
            `Unable to find feature manifest, navigation bar disabled.
To get the navigation bar, expose the manifest's content as
window.manifestData.`,
            error
        );
        return;
    }
}
