import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Tooltip } from "../../../src/react-components";

describe("Tooltip", () => {
  it("renders the label correctly", () => {
    const { getByText } = render(<Tooltip label="2" />);
    expect(getByText("2")).toBeTruthy();
  });
});
