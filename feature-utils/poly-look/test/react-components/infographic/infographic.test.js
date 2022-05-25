import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Infographic } from "../../../src/react-components";

describe("Infographic", () => {
  it("renders correctly", () => {
    const props = {
      imageSrc: "./none.svg",
      legend: ["one", "two"],
    };
    const { getByRole, queryAllByTestId } = render(<Infographic {...props} />);

    expect(getByRole("img")).toBeTruthy();

    const legendEntries = queryAllByTestId("infographic-entry-test");

    expect(legendEntries.length).toBe(props.legend.length);
    legendEntries.forEach((entry, idx) => {
      expect(entry.querySelector(".text")).toHaveTextContent(props.legend[idx]);
    });
  });
});
