import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { PolyButton } from "../../../src/react-components";

describe("PolyButton", () => {
  it("creates a basic button", () => {
    const onClick = jest.fn();
    const { getByText, queryAllByTestId } = render(
      <PolyButton label={"button"} onClick={onClick} />
    );

    expect(getByText("button")).toBeTruthy();
    expect(queryAllByTestId("test-icon").length).toBe(0);

    fireEvent.click(getByText("button"));
    expect(onClick).toBeCalled();
  });

  it("created a disabled button", () => {
    const { getByText } = render(<PolyButton label={"button"} disabled />);
    expect(getByText("button")).toBeDisabled();
  });

  it("renders the icons", () => {
    const Icon = () => <svg></svg>;
    const { queryAllByTestId } = render(
      <PolyButton iconLeft={<Icon />} iconRight={<Icon />} />
    );
    expect(queryAllByTestId("test-icon").length).toBe(2);
  });
});
