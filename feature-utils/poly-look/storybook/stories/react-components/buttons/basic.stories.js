import React from "react";
import { withDesign } from "storybook-addon-designs";
import { Button } from "../../../../src/react-components/buttons/";

import "../../../../src/css/index.js";
import "../fontFamily.css";

export default {
  title: "Visuals/Atoms/Button/Basic",
  component: Button,
  decorators: [withDesign],
  argTypes: {
    onClick: { action: "clicked" },
    theme: {
      options: ["dark", "light"],
      control: { type: "radio" },
    },
    className: {
      type: "string",
    },
  },
};

const Template = (args) => (
  <div className={`poly-theme poly-theme-${args.theme || "dark"}`}>
    <Button {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  label: "Button",
  disabled: false,
  theme: "dark",
};
Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/qIrr4QJrmYGqVQHQoCECux/polyPod-design-system?node-id=2891%3A2856",
  },
};
export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
Disabled.parameters = { ...Default.parameters };
