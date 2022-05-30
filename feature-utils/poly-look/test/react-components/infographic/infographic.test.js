import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Infographic } from "../../../src/react-components";

describe("Infographic", () => {
  it("renders correctly", () => {
    const props = {
      image: {
        svg: "<svg></svg>",
        texts: {},
      },
      explanation: ["one", "two"],
      legend: [
        {
          type: "text",
          items: "Test text",
        },
      ],
    };
    const { queryAllByTestId, container } = render(<Infographic {...props} />);

    expect(container.querySelector("svg")).toBeTruthy();

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
