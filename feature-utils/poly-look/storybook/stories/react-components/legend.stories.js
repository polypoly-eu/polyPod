import React from "react";
import {
  LineLegend,
  BlockLegend,
  CircleLegend,
} from "../../../src/react-components";

export default {
  title: "Visuals/Molecules/Legends",
};

const Template = (args) => (
  <div style={{ display: "flex", justifyContent: "space-evenly" }}>
    <LineLegend {...args} />
    <BlockLegend {...args} />
    <CircleLegend {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  legend: [
    { color: "#3749A9", description: "One short description" },
    {
      color: "#3BA6FF",
      description:
        "A rather long description. Lorem ipsum dolor sit amet, consectetur adipiscingelit.",
    },
  ],
};
