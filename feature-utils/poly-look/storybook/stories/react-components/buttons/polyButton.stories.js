import React from "react";
import { PolyButton } from "../../../../src/react-components/buttons/";

export default {
  title: "Visuals/Atoms/Button/PolyButton",
  component: PolyButton,
  argTypes: {
    onClick: { action: "clicked" },
    type: {
      options: ["filled", "outline"],
      control: { type: "radio" },
    },
    className: {
      type: "string",
    },
    centered: { type: "boolean" },
  },
};

const Template = (args) => <PolyButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Button",
  disabled: false,
  type: "filled",
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
