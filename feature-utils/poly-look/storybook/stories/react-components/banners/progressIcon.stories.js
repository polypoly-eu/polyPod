import React from "react";
import { ProgressIcon } from "../../../../src/react-components";

export default {
  title: "Visuals/Atoms/ProgressIcon",
  component: ProgressIcon,
  argTypes: {
    activeColor: { control: { type: "color" } },
    inactiveColor: { control: { type: "color" } },
  },
};

const Template = (args) => <ProgressIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  stage: 1,
};
