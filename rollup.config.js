import sucrase from "@rollup/plugin-sucrase";
import resolve from '@rollup/plugin-node-resolve';

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
        resolve({
            extensions: [".js", ".ts"]
        }),
        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"]
        })
    ]
};
