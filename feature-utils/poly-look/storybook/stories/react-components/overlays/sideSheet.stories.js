import React from "react";
import { withDesign } from "storybook-addon-designs";
import { SideSheet } from "../../../../src/react-components";

import "../../../../src/css/index.js";
import "../fontFamily.css";

const textFiller = `Lorem ipsum dolor sit amet, consectetur adipiscing
elit.Morbi volutpat, lectus vitae facilisis mattis, leo sem fringilla tortor,
quis pharetra elit augue et orci. Quisque id blandit mi, sit amet vehicula
eros. Donec luctus purus enim, sit amet sagittis leo vulputate at. facilisis mattis,
leo sem fringilla tortor,
quis pharetra elit augue et orci. Quisque id blandit mi, sit amet vehicula
eros. Donec luctus purus enim, sit amet sagittis leo vulputate at.facilisis mattis, leo sem fringilla tortor,
quis pharetra elit augue et orci. Quisque id blandit mi, sit amet vehicula
eros. Donec luctus purus enim, sit amet sagittis leo vulputate at.facilisis mattis, leo sem fringilla tortor,
quis pharetra elit augue et orci. Quisque id blandit mi, sit amet vehicula
eros. Donec luctus purus enim, sit amet sagittis leo vulputate at.facilisis mattis, leo sem fringilla tortor,
quis pharetra elit augue et orci. Quisque id blandit mi, sit amet vehicula
eros. Donec luctus purus enim, sit amet sagittis leo vulputate at.`;

export default {
  component: SideSheet,
  title: "Visuals/Molecules/SideSheet",
  decorators: [withDesign],
  argTypes: {
    okLabel: { control: "text" },
    onOk: { action: "clicked" },
    classes: { control: "text" },
  },
};

const Template = (args) => <SideSheet {...args} />;

export const Default = Template.bind({});
Default.args = {
  okLabel: "button label",
};
Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/qIrr4QJrmYGqVQHQoCECux/polyPod-design-system?node-id=3092%3A2882",
  },
};

export const WithContent = Template.bind({});
WithContent.args = {
  ...Default.args,
  children: <p>{textFiller}</p>,
  title: "how to read this",
};
