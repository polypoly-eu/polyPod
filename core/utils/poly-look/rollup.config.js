import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import replace from "@rollup/plugin-replace";

export default {
  input: "poly-look.js",
  output: {
    file: "poly-look.bundled.js",
    format: "esm",
  },
  onwarn(warning) {
    if (warning.code !== "THIS_IS_UNDEFINED") {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({ "Reflect.decorate": "undefined" }),
    resolve(),
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
