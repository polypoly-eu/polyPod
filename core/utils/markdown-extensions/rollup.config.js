import copy from 'rollup-plugin-copy'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from 'rollup-plugin-commonjs';
import polyMarkdownTranspiler from 'rollup-plugin-poly-markdown';

const config = {
    input: "src/demo.js",
    output: {
        file: "dist/index.bundle.js",
        format: "iife"
    },
    plugins: [
        polyMarkdownTranspiler(),
        copy({
            targets: [{
                src: [
                    "public/*"
                ],
                dest: "dist"
            }]
        }),
        resolve(),
        commonjs(),
    ]
}

export default commandLineArgs => {
    return config;
}