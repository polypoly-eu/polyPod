import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { InfographicLegend } from "../../../src/react-components";

describe("InfographicLegend", () => {
  it("renders correctly", () => {
    const legend = [
      {
        type: "circle",
        items: [
          { color: "#3749A9", description: "Legend A" },
          {
            color: "#3BA6FF",
            description: "Legend B",
          },
        ],
        tooltip: {
          label: "1",
          pointerDirection: "down",
        },
      },
      {
        type: "text",
        items: "Legend B",
        tooltip: {
          label: "2",
          pointerDirection: "left",
        },
      },
    ];
    const { queryAllByTestId } = render(<InfographicLegend legend={legend} />);

    const entries = queryAllByTestId("infographic-legend-entry-test");

    expect(entries.length).toEqual(legend.length);

    entries.forEach((entry, index) => {
      expect(entry.querySelector(`.${legend[index].type}-legend`)).toBeTruthy();
      expect(entry).toHaveClass(
        `tooltip-${legend[index].tooltip.pointerDirection}`
      );
    });
  });
});
