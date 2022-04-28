import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { PolyButton } from "../../../src/react-components";

describe("PolyButton", () => {
  test("Creates a basic button", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <PolyButton label={"button"} onClick={onClick} />
    );
    expect(getByText("button")).toBeTruthy();
    fireEvent.click(getByText("button"));
    expect(onClick).toBeCalled();
  });

  test("Created a disabled button", () => {
    const { getByText } = render(<PolyButton label={"button"} disabled />);
    expect(getByText("button")).toBeDisabled();
  });
});
