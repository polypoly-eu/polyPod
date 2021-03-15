import glob from "glob";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";

// Trivial plugin to watch all copied files - there's a dedicated
// rollup-plugin-copy-watch plugin that should do this, but it would actually
// trigger watch mode for regular builds for some reason.
function copyWatch(options) {
    const originalCopy = copy(options);
    return {
        ...originalCopy,
        name: "copyWatch",
        ["buildStart"]: async function () {
            if ("buildStart" in originalCopy) await originalCopy.buildStart();
            if (!this.meta.watchMode) return;
            for (let { src } of options.targets)
                for (let pattern of src)
                    for (let file of glob.sync(pattern))
                        this.addWatchFile(file);
        },
    };
}

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: "iife",
    },
    plugins: [
        css({ output: "css/bundle.css" }),
        json(),
        copyWatch({
            targets: [
                {
                    src: ["src/static/*", "manifest.json"],
                    dest: "dist",
                },
            ],
            verbose: true,
        }),
        resolve(),
    ],
};
