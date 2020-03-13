import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.es.js",
            format: "esm"
        },
        {
            file: "dist/index.js",
            format: "cjs"
        }
    ],
    plugins: [
        alias({
            entries: [
                { find: "typeson", replacement: "@polypoly-eu/typeson" }
            ]
        }),
        resolve({
            extensions: [".js", ".ts"]
        }),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        })
    ]
};
