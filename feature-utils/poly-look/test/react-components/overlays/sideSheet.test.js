import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SideSheet } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */
it("Creates an empty container with close buttons", () => {
  const res = render(<SideSheet />);
  expect(res.container).toBeTruthy();
  expect(res.queryAllByRole("button").length).toBe(2);
  expect(res.queryAllByRole("h1").length).toBe(0);
});

it("Renders title", () => {
  const { getByText } = render(<SideSheet title="testing" />);
  expect(getByText("testing")).toBeTruthy();
});

it("Renders children", () => {
  const res = render(
    <SideSheet>
      <p>test</p>
    </SideSheet>
  );
  expect(res.getByText("test")).toBeTruthy();
});

it("Close buttons are functional", () => {
  const onClose = jest.fn();
  const { queryAllByRole } = render(<SideSheet onClose={onClose} />);

  queryAllByRole("button").forEach((button) => fireEvent.click(button));

  expect(onClose).toHaveBeenCalledTimes(2);
});
