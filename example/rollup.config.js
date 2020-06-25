import copy from "rollup-plugin-copy";
import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "src/index.jsx",
    output: {
        file: "dist/index.js",
        format: "iife",
        name: "Feature",
        sourcemap: "inline",
        globals: {
            "react": "React",
            "react-dom": "ReactDOM"
        }
    },
    plugins: [
        commonjs(),
        resolve(),
        sucrase({
            transforms: ["jsx"]
        }),
        copy({
            targets: [
                {
                    src: [
                        "node_modules/react/umd/react.development.js",
                        "node_modules/react-dom/umd/react-dom.development.js",
                        "src/index.html"
                    ],
                    dest: "dist"
                }
            ],
            verbose: true
        })
    ],
    external: ["react", "react-dom"]
};