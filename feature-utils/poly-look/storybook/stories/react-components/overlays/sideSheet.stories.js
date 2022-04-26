import React from "react";
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

export const WithContent = Template.bind({});
WithContent.args = {
  ...Default.args,
  children: <p>{textFiller}</p>,
  title: "how to read this",
};
