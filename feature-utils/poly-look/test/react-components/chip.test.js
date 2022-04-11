import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chip from "../../src/react-components/chip.jsx";

const chipId = "chipId";
const mockedHandleClick = jest.fn();

const chip = <Chip id={chipId} handleClick={mockedHandleClick} active />;

it("Chip can be clicked", () => {
  const { container, getByText } = render(chip);
  expect(container).toBeTruthy();
  fireEvent.click(getByText(chipId), mockedHandleClick);
  expect(mockedHandleClick).toHaveBeenCalled();
});

it("Chip has been selected", () => {
  const { getByText } = render(chip);
  const chipElement = getByText(chipId);
  if (chip.props.active) {
    expect(chip.props.active).toBeTruthy();
    expect(chipElement).toHaveClass("chip selected");
  } else {
    expect(chip.props.active).toBeFalsy();
    expect(chipElement).not.toHaveClass("chip selected");
  }
});
