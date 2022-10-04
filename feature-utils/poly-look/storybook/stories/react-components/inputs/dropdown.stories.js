import React, { useState } from "react";
import { Dropdown } from "../../../../src/react-components";

export default {
  title: "Visuals/Molecules/Dropdown",
};

const Template = (args) => {
  const [input, setInput] = useState({ name: "demo", id: 0, value: "one" });

  return (
    <Dropdown
      {...args}
      name={input.name}
      onChange={(selected) => {
        setInput({ name: input.name, id: selected.id, value: selected.value });
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
  noMatch: "No valid option",
  options: [
    { value: "one", id: 0 },
    { value: "two", id: 1 },
    { value: "three", id: 2 },
    { value: "four", id: 3 },
    { value: "five", id: 4 },
    { value: "six", id: 5 },
    { value: "seven", id: 6 },
  ],
};

export const Preselected = Template.bind({});

Preselected.args = {
  ...Default.args,
  initialSelection: { value: "three", id: 2 },
};

export const ErrorState = Template.bind({});

ErrorState.args = {
  ...Default.args,
  error: true,
};
