import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Button } from "../../../src/react-components";

it("Creates a basic button", () => {
  const onClick = jest.fn();
  const { getByText } = render(<Button label={"button"} onClick={onClick} />);
  expect(getByText("button")).toBeTruthy();
  fireEvent.click(getByText("button"));
  expect(onClick).toBeCalled();
});

it("Created a disabled button", () => {
  const { getByText } = render(<Button label={"button"} disabled />);
  expect(getByText("button")).toBeDisabled();
});
