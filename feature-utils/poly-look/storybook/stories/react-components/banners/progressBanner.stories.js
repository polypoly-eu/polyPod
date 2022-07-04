import React from "react";
import { ProgressBanner } from "../../../../src/react-components";

export default {
  title: "Visuals/Molecules/ProgressBanner",
  component: ProgressBanner,
};

const Template = (args) => <ProgressBanner {...args} />;

export const Default = Template.bind({});
Default.args = {
  stage: 1,
  title: "Development",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Morbi volutpat",
};
