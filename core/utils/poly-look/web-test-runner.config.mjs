import { fromRollup } from "@web/dev-server-rollup";
import svg from "rollup-plugin-svg";

const svgForWebServer = fromRollup(svg);

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'test/**/*.test.js',
  nodeResolve: true,
  mimeTypes: {
    "**/*.svg": "js"
  },
  plugins: [svgForWebServer()]
});
