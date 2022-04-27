import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import sucrase from "@rollup/plugin-sucrase";
import copy from "@polypoly-eu/rollup-plugin-copy-watch";

import genPodjs from "@polypoly-eu/podjs/rollup-plugin-gen-podjs/genPodjs.js";

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn(
                "npm",
                ["run", "start", "--", "--dev"],
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                }
            );

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js",
    },
    plugins: [
        genPodjs({
            build_dir: "./public",
            manifestPath: "./public/manifest.json",
        }),
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: "bundle.css" }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        json(),
        sucrase({ transforms: [] }),
        copy({
            targets: [
                {
                    src: [
                        "node_modules/@polypoly-eu/poly-look/dist/css/poly-look.css",
                    ],
                    dest: "public",
                },
                {
                    src: ["src/static/fonts/*"],
                    dest: "public/fonts",
                },
            ],
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"),
    ],
    watch: {
        clearScreen: false,
    },
};
