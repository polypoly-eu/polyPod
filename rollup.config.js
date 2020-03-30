import sucrase from "@rollup/plugin-sucrase";

import {configs, externals} from "./build/rollup-common";

export default [
    configs.bootstrap,
    {
        input: "src/cli.ts",
        output: {
            file: "dist/cli.js",
            format: "cjs",
            banner: "#!/usr/bin/env node"
        },
        plugins: [
            sucrase({
                exclude: ["node_modules/**"],
                transforms: ["typescript"]
            })
        ],
        external: [
            ...externals,
            "open",
            "yargs"
        ]
    }
];
