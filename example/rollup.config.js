import copy from "rollup-plugin-copy";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.jsx",
    output: {
        file: "dist/index.js",
        format: "iife",
        globals: {
            "react": "React",
            "react-dom": "ReactDOM"
        }
    },
    plugins: [
        sucrase({
            transforms: ["jsx"],
            production: true
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
