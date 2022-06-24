import React from "react";
import { withDesign } from "storybook-addon-designs";
import { Slideshow } from "../../../src/react-components";

export default {
  title: "Visuals/Molecules/Slideshow",
  component: Slideshow,
  decorators: [withDesign],
};

const Template = (args) => <Slideshow {...args} />;

export const Default = Template.bind({});

Default.args = {
  images: ["./images/example1.png", "./images/example2.png"],
};
Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/qSTY8cZ6gbSMx7kPc599fy/MAIN-pod-feature-preview?node-id=2%3A2273",
  },
};
