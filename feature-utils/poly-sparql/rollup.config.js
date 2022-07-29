import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "iife",
        name: "polyRdf",
        globals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
    },
    plugins: [
        sucrase({
            transforms: ["js", "ts"],
            production: true,
        }),
        resolve(),
    ],
    external: ["react", "react-dom"],
};
