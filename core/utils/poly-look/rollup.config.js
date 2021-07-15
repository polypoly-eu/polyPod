import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";

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
