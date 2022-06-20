export function rollupTemplate() {
    return `
import copy from "@polypoly-eu/rollup-plugin-copy-watch";
export default {
  input: "src/index.js",
  output: {
      file: "dist/index.js",
      format: "iife",
      globals: {},
  },
  plugins: [
      copy({
          targets: [
              {
                  src: [
                      "manifest.json"
                  ],
                  dest: "dist",
              },
          ],
          verbose: true,
      }),
  ],
};
  `;
}
