import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";

const { presets, plugins } = require("./babel.config")();

export default {
  input: "src/poly-look.js",
  output: {
    file: "dist/poly-look.bundled.js",
    format: "esm",
  },
  onwarn(warning) {
    if (warning.code !== "THIS_IS_UNDEFINED") {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    resolve(),
    babel({
      "babelHelpers": "bundled",
      "presets": [...presets],
      "plugins": [...plugins]
    }),
    terser({
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    filesize({
      showBrotliSize: true,
    }),
  ],
};
