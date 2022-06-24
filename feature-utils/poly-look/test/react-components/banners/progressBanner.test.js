import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProgressBanner } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */
describe("ProgressBanner", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <ProgressBanner stage={1} title="Title" description="description" />
    );

    expect(container).toBeTruthy();
    expect(getByText("Title")).toBeTruthy();
    expect(getByText("description")).toBeTruthy();
  });

  it("has a functional button", () => {
    const onclick = jest.fn();

    const { queryByRole } = render(
      <ProgressBanner stage={1} onClick={onclick} />
    );
    fireEvent.click(queryByRole("button"));

    expect(onclick).toHaveBeenCalled();
  });
});
