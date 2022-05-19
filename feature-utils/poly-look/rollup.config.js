import resolve from "@rollup/plugin-node-resolve";
import svg from "rollup-plugin-svg";
import sucrase from "@rollup/plugin-sucrase";
import css from "rollup-plugin-css-only";
import copy from "@polypoly-eu/rollup-plugin-copy-watch";

export default {
  input: "src/poly-look.js",
  output: {
    file: "dist/poly-look.js",
    format: "iife",
    name: "polyLook",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
  plugins: [
    svg({ base64: true }),
    css({ output: "css/poly-look.css" }),
    sucrase({
      transforms: ["jsx"],
      production: true,
    }),
    resolve(),
    copy({
      targets: [
        {
          src: ["src/static/fonts/*"],
          dest: "dist/fonts",
        },
      ],
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
