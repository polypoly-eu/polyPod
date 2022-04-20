import React from "react";
import { withDesign } from "storybook-addon-designs";
import { IconButton } from "../../../../src/react-components/buttons/";

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
      control: { type: "radio" },
    },
    icon: {
      options: ["angleRight", "question", "filter"],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => <IconButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  fillDirection: null,
  icon: "angleRight",
};
Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/qIrr4QJrmYGqVQHQoCECux/polyPod-design-system?node-id=2891%3A2856",
  },
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  fillDirection: "left",
};
