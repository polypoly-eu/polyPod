import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import LineLegend from "../../src/react-components/legends/lineLegend/lineLegend";

/**
 * @jest-environment jsdom
 */
const legendValues = [
  ["No color", "#000000"],
  ["Gray", "#888888"],
  ["All colors", "#ffffff"],
];
const legendEntries = legendValues.map((l) => {
  return { description: l[0], color: l[1] };
});
const lineLegend = <LineLegend legend={legendEntries} />;

describe("Basic tests", () => {
  it("Creates a BlockLegend component", () => {
    const renderedLineLegend = render(lineLegend);
    expect(renderedLineLegend.container).toBeTruthy();
    expect(renderedLineLegend.getByText("No color")).toBeInTheDocument();
  });
});
