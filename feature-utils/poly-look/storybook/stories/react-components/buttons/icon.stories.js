import React from "react";
import { withDesign } from "storybook-addon-designs";
import IconButton from "../../../../src/react-components/buttons/iconButton";

import "../../../../src/css/index.js";
import "../fontFamily.css";

export default {
  title: "Visuals/Atoms/Button/Icon",
  component: IconButton,
  decorators: [withDesign],
  argTypes: {
    onClick: { action: "clicked" },
    fillDirection: {
      options: ["left", "right", null],
    },
  },
};

const Template = (args) => <IconButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: "angleRight",
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  fillDirection: "left",
};
