import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";

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
        commonjs(),
        sucrase({
            exclude: [`./node_modules/**`],
            transforms: ["typescript"]
        })
    ],
    external: ["@shopify/rpc"]
};
