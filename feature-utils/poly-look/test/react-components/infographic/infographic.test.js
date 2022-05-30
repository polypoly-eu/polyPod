import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Infographic } from "../../../src/react-components";

describe("Infographic", () => {
  it("renders correctly", () => {
    const props = {
      imageSrc: "./none.svg",
      explanation: ["one", "two"],
      legend: [
        {
          type: "text",
          items: "Test text",
        },
      ],
    };
    const { getByRole, queryAllByTestId } = render(<Infographic {...props} />);

    expect(getByRole("img")).toBeTruthy();

    const explanationEntries = queryAllByTestId("infographic-entry-test");
    expect(explanationEntries.length).toBe(props.explanation.length);
    explanationEntries.forEach((entry, idx) => {
      expect(entry.querySelector(".text")).toHaveTextContent(
        props.explanation[idx]
      );
    });
    const legendEntries = queryAllByTestId("infographic-legend-entry-test");
    expect(legendEntries.length).toBe(props.legend.length);
  });
});
