import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import svg from "rollup-plugin-svg";
import css from "rollup-plugin-css-only";

export default {
  input: "src/poly-look.js",
  output: {
    file: "dist/poly-look.bundled.js",
    format: "esm",
  },
  plugins: [
    svg(),
    css({ output: "css/poly-look.bundled.css" }),
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
  ],
  external: ["react", "react-dom"],
  onwarn: (warning) => {
    // overwite the default warning function
    if (
      warning.code === "CIRCULAR_DEPENDENCY" &&
      warning.cycle[0].match(/d3-/)
    ) {
      return;
    } else if (warning.code !== "THIS_IS_UNDEFINED") {
      console.error(`(!) ${warning.message}`);
    }
  },
};
