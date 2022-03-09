import { fromRollup } from "@web/dev-server-rollup";
import svg from "rollup-plugin-svg";

const svgForWebServer = fromRollup(svg);

export default {
  files: ["test/lit-components/**/*.test.js", "!test/react-components/*"],
  nodeResolve: true,
  mimeTypes: {
    "**/*.svg": "js",
  },
  plugins: [svgForWebServer()],
};
