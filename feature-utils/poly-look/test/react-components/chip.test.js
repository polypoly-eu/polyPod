import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chip from "../../src/react-components/filterChips/chip.jsx";

const mockedHandleClick = jest.fn();
const chipId = "chipId";

const chip = <Chip id={chipId} handleClick={mockedHandleClick} active={true} />;

it("Chip can be clicked", () => {
  const { container, getByRole } = render(chip);
  expect(container).toBeTruthy();
  fireEvent.click(getByRole("button"), mockedHandleClick);
  expect(mockedHandleClick).toHaveBeenCalled();
});

it("Chip has been selected", () => {
  const { getByText } = render(chip);
  const chipElement = getByText(chipId);
  expect(chip.props.active).toBeTruthy();
  expect(chipElement).toHaveClass("chip selected");
});
