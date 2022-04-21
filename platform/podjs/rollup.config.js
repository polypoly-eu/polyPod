import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import path from "path";
import globby from "globby";

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
        // external: [externalManifestFile],
        plugins: [
            json(),
            nodeResolve(),
            //new
            typescript(),
            // new
            commonjs({
                // include: nodeModules,
                // extensions: [".js", ".ts", ".mjs", ".cjs"],
            }),
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
            // {
            //     file: pathResolve("dist/pod.es.js"),
            //     format: "esm",
            // },
        ],
        // external: [externalManifestFile],
        plugins: [
            json(),
            nodeResolve(),
            // new
            typescript(),
            copyManifest({
                targets: [{ src: externalManifestFile, dest: "dist" }],
            }),
            replaceManifest({
                __DYNAMIC_IMPORT_MANIFEST__: externalManifestFile,
            }),
            commonjs({
                // new
                // transformMixedEsModules: true,
                // include: nodeModules,
                // extensions: [".js", ".ts", ".mjs", ".cjs"],
            }),
            sucrase({
                exclude: [nodeModules],
                transforms: ["typescript"],
            }),
        ],
        context: "window",
    },
]);

// import MagicString from "magic-string";
// import { createFilter } from "rollup-pluginutils";

// function escape(str) {
//     return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
// }

// function ensureFunction(functionOrValue) {
//     if (typeof functionOrValue === "function") return functionOrValue;
//     return () => functionOrValue;
// }

// function longest(a, b) {
//     return b.length - a.length;
// }

// function getReplacements(options) {
//     if (options.values) {
//         return Object.assign({}, options.values);
//     } else {
//         const values = Object.assign({}, options);
//         delete values.delimiters;
//         delete values.include;
//         delete values.exclude;
//         delete values.sourcemap;
//         delete values.sourceMap;
//         return values;
//     }
// }

// function mapToFunctions(object) {
//     return Object.keys(object).reduce((functions, key) => {
//         functions[key] = ensureFunction(object[key]);
//         return functions;
//     }, {});
// }

// function replaceManifest(options = {}) {
//     console.log(options);

//     const filter = createFilter(options.include, options.exclude);
//     const { delimiters } = options;
//     console.log(delimiters);
//     // const functionValues = mapToFunctions(getReplacements(options));
//     // const keys = Object.keys(functionValues).sort(longest).map(escape);

//     const pattern = delimiters
//         ? new RegExp(
//               `${escape(delimiters[0])}(${keys.join("|")})${escape(
//                   delimiters[1]
//               )}`,
//               "g"
//           )
//         : new RegExp(`\\b(${keys.join("|")})\\b`, "g");

//     return {
//         name: "replaceManifest",

//         transform(code, id) {
//             if (!filter(id)) return null;

//             const magicString = new MagicString(code);

//             let hasReplacements = false;
//             let match;
//             let start;
//             let end;
//             let replacement;

//             while ((match = pattern.exec(code))) {
//                 hasReplacements = true;

//                 start = match.index;
//                 end = start + match[0].length;
//                 replacement = String(functionValues[match[1]](id));

//                 console.log(start);
//                 console.log(end);
//                 console.log(replacement);
//                 console.log(match[1]);

//                 replacement = fetchManifestJson(match[1]);

//                 magicString.overwrite(start, end, replacement);
//                 console.log(magicString);
//             }

//             if (!hasReplacements) return null;

//             const result = { code: magicString.toString() };
//             if (options.sourceMap !== false && options.sourcemap !== false)
//                 result.map = magicString.generateMap({ hires: true });

//             console.log(result);

//             return result;
//         },
//     };
// }

function generateCopyTarget(src, dest, { flatten }) {
    const { base, dir } = path.parse(src);
    const destinationFolder =
        flatten || (!flatten && !dir)
            ? dest
            : dir.replace(dir.split("/")[0], dest);

    return {
        src,
        dest: path.join(
            destinationFolder,
            rename ? renameTarget(base, rename, src) : base
        ),
    };
}

//   targets: [
//     { src: 'src/static/manifest.json', dest: '/dist/' },
//   ]
function copyManifest(
    options = { targets: [{ src: externalManifestFile, dest: "dist" }] }
) {
    const {
        copyOnce = false,
        flatten = true,
        hook = "buildEnd",
        targets = [],
        ...restPluginOptions
    } = options;

    let copied = false;

    return {
        name: "copyManifest",
        [hook]: async () => {
            if (copyOnce && copied) {
                return;
            }

            const copyTargets = [];

            if (Array.isArray(targets) && targets.length) {
                for (const target of targets) {
                    if (!isObject(target)) {
                        throw new Error(`${target} target must be an object`);
                    }

                    const { dest, src, ...restTargetOptions } = target;

                    if (!src || !dest) {
                        throw new Error(
                            `${target} target must have "src" and "dest" properties`
                        );
                    }

                    const matchedPaths = await globby(src, {
                        expandDirectories: false,
                        onlyFiles: true,
                        ...restPluginOptions,
                        ...restTargetOptions,
                    });

                    if (matchedPaths.length) {
                        for (const matchedPath of matchedPaths) {
                            const generatedCopyTargets = Array.isArray(dest)
                                ? await Promise.all(
                                      dest.map((destination) =>
                                          generateCopyTarget(
                                              matchedPath,
                                              destination,
                                              { flatten }
                                          )
                                      )
                                  )
                                : [
                                      await generateCopyTarget(
                                          matchedPath,
                                          dest,
                                          { flatten }
                                      ),
                                  ];

                            copyTargets.push(...generatedCopyTargets);
                        }
                    }
                }
            }

            if (copyTargets.length) {
                console.log("copied!");

                for (const copyTarget of copyTargets) {
                    const { dest, src } = copyTarget;

                    // if (transformed) {
                    //     await fs.outputFile(dest, contents, restPluginOptions);
                    // } else {
                    await fs.copy(src, dest, restPluginOptions);
                    // }
                }
            }

            copied = true;
        },
    };
}
