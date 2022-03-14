import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  BlockLegend,
  LineLegend,
} from "../../src/react-components/legends.jsx";

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
const lineLegend = <LineLegend legend={legendEntries} />;

describe("Basic tests BlockLegend", () => {
  it("Creates a BlockLegend component", () => {
    const renderedBlockLegend = render(blockLegend);
    expect(renderedBlockLegend.container).toBeTruthy();
    expect(renderedBlockLegend.getByText("No color")).toBeInTheDocument();
  });
});

describe("Basic tests LineLegend", () => {
  it("Creates a LineLegend component", () => {
    const renderedLineLegend = render(lineLegend);
    expect(renderedLineLegend.container).toBeTruthy();
    expect(renderedLineLegend.getByText("No color")).toBeInTheDocument();
  });
});
