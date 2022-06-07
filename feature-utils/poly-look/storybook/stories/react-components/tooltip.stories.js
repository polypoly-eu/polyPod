import React from "react";
import { Tooltip } from "../../../src/react-components";

import "../../../src/css/index.js";
import "./fontFamily.css";

export default {
  title: "Visuals/Molecules/Tooltip",
  component: Tooltip,
  argTypes: {
    pointerDirection: {
      options: ["left", "down"],
      control: { type: "radio" },
    },
    label: {
      type: "string",
    },
  },
};
const Template = (args) => <Tooltip {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: "1",
  pointerDirection: "down",
};
