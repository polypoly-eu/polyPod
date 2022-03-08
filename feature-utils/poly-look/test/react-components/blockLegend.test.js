import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlockLegend from "../../src/react-components/legends/blockLegend/blockLegend";

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
const blockLegend = <BlockLegend legend={legendEntries} />;

describe("Basic tests", () => {
  it("Creates a BlockLegend component", () => {
    const renderedBlockLegend = render(blockLegend);
    expect(renderedBlockLegend.container).toBeTruthy();
    expect(renderedBlockLegend.getByText("No color")).toBeInTheDocument();
  });
});
