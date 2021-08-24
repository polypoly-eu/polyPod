import { storybookPlugin } from '@web/dev-server-storybook';
import baseConfig from '../web-dev-server.config.mjs';
import { fromRollup } from '@web/dev-server-rollup'; 
import svg from "rollup-plugin-svg";

const svgForWebServer = fromRollup(svg);

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  ...baseConfig,
  open: '/',
  mimeTypes: {
    "**/*.svg": "js",
    ...baseConfig.mimeTypes
  },
  plugins: [ storybookPlugin({ type: 'web-components' }), svgForWebServer(), ...baseConfig.plugins],
});
