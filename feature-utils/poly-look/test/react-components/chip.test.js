import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chip from "../../src/react-components/filterChips/chip.jsx";

const mockedHandleClick = jest.fn();

const chip = <Chip id="chipId" handleClick={mockedHandleClick} active={true} />;

it("Renders Chip", () => {
  const { container, getByRole } = render(chip);
  expect(container).toBeTruthy();
  fireEvent.click(getByRole("button"), mockedHandleClick);
  expect(mockedHandleClick).toHaveBeenCalled();
});

it("Chip has been selected", () => {
  const { getByRole } = render(chip);
  const chipClassName = getByRole("button").className;
  expect(chip.props.active).toBeTruthy();
  expect(chipClassName).toMatch("chip selected");
});
