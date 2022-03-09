import { storybookPlugin } from "@web/dev-server-storybook";
import baseConfig from "../../web-dev-server.config.mjs";
import { fromRollup } from "@web/dev-server-rollup";
import { nodeResolve } from "@web/dev-server-rollup";
import svg from "rollup-plugin-svg";

const svgForWebServer = fromRollup(svg);
const resolveForWebServer = fromRollup(nodeResolve);

export default {
    ...baseConfig,
    open: "/",
    mimeTypes: {
        "**/*.svg": "js",
        ...baseConfig.mimeTypes,
    },
    rootDir: "../",
    plugins: [
        resolveForWebServer({
            moduleDirectories: ["storybook/node_modules"]
        }),
        storybookPlugin({
            type: "web-components",
            configDir: ".storybook/lit",
        }),
        svgForWebServer(),
        ...baseConfig.plugins,
    ],
};
