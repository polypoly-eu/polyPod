import React, { useState } from "react";
import { TextField } from "../../../../src/react-components";

export default {
  title: "Visuals/Molecules/TextField",
};

const Template = (args) => {
  const [input, setInput] = useState({ name: "demo", value: args.value || "" });

  return (
    <TextField
      {...args}
      value={input.value}
      name={input.name}
      onChange={({ value, name }) => {
        setInput({ value, name });
      }}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  label: "Label",
  helperText: "Helper text",
  disabled: false,
  tabIndex: 1,
  error: false,
};

export const Prefilled = Template.bind({});

Prefilled.args = {
  ...Default.args,
  value: "Value",
};

export const ErrorState = Template.bind({});

ErrorState.args = {
  ...Default.args,
  error: true,
};
