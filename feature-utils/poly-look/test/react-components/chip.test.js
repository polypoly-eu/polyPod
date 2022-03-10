import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chip from "../../src/react-components/chip/chip.jsx";

const chip = <Chip id="chipId" />;

test('renders "Chip"', () => {
  const renderedChip = render(chip);
  expect(renderedChip.container).toBeTruthy();
});
