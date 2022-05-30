import React from "react";
import { Infographic } from "../../../src/react-components";

import "../../../src/css/index.js";
import "./fontFamily.css";

export default {
  title: "Visuals/Organisms/Infographic",
  component: Infographic,
};

const Template = (args) => <Infographic {...args} />;

export const Default = Template.bind({});

Default.args = {
  imageSrc: "./images/nodes.svg",
  explanation: [
    "A legend with multiple elements and one tooltip positioned above",
    "Technically not really a legend, but we need to be able to add text somehow. Use type `text` to render a single line of text",
    "Same as 2 but with different tooltip position",
    "One element legend with tooltip to the right",
    "Multiple elements legend with tooltip to the right",
  ],
  legend: [
    {
      type: "circle",
      items: [
        { color: "#3749A9", description: "aaaaaAaaaaa" },
        {
          color: "#3BA6FF",
          description: "Legend B",
        },
      ],
      tooltip: {
        label: "1",
        pointerDirection: "down",
      },
    },
    {
      type: "text",
      items: "Legend C",
      tooltip: {
        label: "2",
        pointerDirection: "left",
      },
    },
    {
      type: "text",
      items: "dddDddd",
      tooltip: {
        label: "3",
        pointerDirection: "down",
      },
    },
    {
      type: "block",
      items: [{ color: "#3749A9", description: "Legend E" }],
      tooltip: {
        label: "4",
        pointerDirection: "left",
      },
    },
    {
      type: "line",
      items: [
        { color: "#3749A9", description: "Legend F" },
        { color: "#1749B0", description: "Legend G" },
      ],
      tooltip: {
        label: "5",
        pointerDirection: "left",
      },
    },
    {
      type: "circle",
      items: [{ color: "#3749A9", description: "Legend H - no tooltip" }],
    },
  ],
};
