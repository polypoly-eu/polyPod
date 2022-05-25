import React from "react";
import { Infographic } from "../../../src/react-components";

import "../../../src/css/index.js";
import "./fontFamily.css";

export default {
  title: "Visuals/Molecules/Infographic",
  component: Infographic,
};

const Template = (args) => <Infographic {...args} />;

export const Default = Template.bind({});

Default.args = {
  imageSrc: "./images/bar-chart.svg",
  legend: [
    "One short description",
    "A rather long description. Lorem ipsum dolor sit amet, consectetur adipiscingelit. Morbi volutpat, lectus vitae facilisis mattis, leo sem fringilla tortor, quis pharetra elit augue et orci",
  ],
};
