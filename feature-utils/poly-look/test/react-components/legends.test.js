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

describe("Basic functionality tests for * legend", () => {
  for (const component of [blockLegend, lineLegend]) {
    const componentClass = component.type.name
      .replace("Le", "-le")
      .toLowerCase();
    it(`is able to create a ${componentClass} component`, () => {
      const renderedComponent = render(component);
      expect(renderedComponent.container.firstChild).toHaveClass(
        componentClass
      );
      for (const values of legendValues) {
        expect(renderedComponent.getByText(values[0])).toBeInTheDocument();
      }
    });
  }
});
