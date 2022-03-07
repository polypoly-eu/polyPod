import copy from "@polypoly-eu/rollup-plugin-copy-watch";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.jsx",
    output: {
        file: "dist/index.js",
        format: "iife",
        globals: {
            react: "React",
            "react-dom": "ReactDOM",
            pod: "pod",
        },
    },
    plugins: [
        sucrase({
            transforms: ["jsx"],
            production: true,
        }),
        copy({
            targets: [
                {
                    src: [
                        "node_modules/react/umd/react.development.js",
                        "node_modules/react-dom/umd/react-dom.development.js",
                        "node_modules/@polypoly-eu/podjs/dist/pod.js",
                        "src/index.html",
                    ],
                    dest: "dist",
                },
            ],
            verbose: true,
        }),
    ],
    external: ["react", "react-dom", "pod"],
};
