import React from "react";
import { FixedFooter } from "../../../src/react-components";

export default {
  title: "Visuals/Molecules/FixedFooter",
  component: FixedFooter,
};

const Template = (args) => <FixedFooter {...args} />;

export const Default = Template.bind({});
Default.args = {
  gradient: true,
  children:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Morbi volutpat",
};
