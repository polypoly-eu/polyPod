import { withDesign } from "storybook-addon-designs";

import "../../../src/css/index.js";
import "../../stories/react-components/demo.css";
import "../../stories/react-components/fontFamily.css";

const withTheme = (Story, context) => {
  const theme = context.globals.theme;
  switch (theme) {
    case "side-by-side": {
      return (
        <>
          <div className="poly-theme poly-theme-light theme-holder holder-left">
            <Story />
          </div>
          <div className="poly-theme poly-theme-dark theme-holder holder-right">
            <Story />
          </div>
        </>
      );
    }
    default: {
      return (
        <div
          className={`poly-theme poly-theme-${theme} theme-holder single-holder`}
        >
          <Story />
        </div>
      );
    }
  }
};

export const decorators = [withTheme, withDesign];

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", icon: "circlehollow", title: "light" },
        { value: "dark", icon: "circle", title: "dark" },
        { value: "side-by-side", icon: "sidebar", title: "side by side" },
      ],
      showName: true,
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
