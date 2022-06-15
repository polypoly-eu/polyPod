import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: "iife",
        name: "polyAnalysis",
        globals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
    },
    plugins: [
        sucrase({
            transforms: ["jsx"],
            production: true,
        }),
        resolve(),
    ],
    external: ["react", "react-dom"],
};
