import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chip from "../../src/react-components/chip.jsx";

const chipId = "chipId";
const mockedHandleClick = jest.fn();

it("Chip can be clicked", () => {
  const { getByText, container } = render(
    <Chip id={chipId} handleClick={mockedHandleClick} />
  );
  expect(container).toBeTruthy();
  fireEvent.click(getByText(chipId), mockedHandleClick);
  expect(mockedHandleClick).toHaveBeenCalled();
});

it("Chip has been selected", () => {
  const active = render(
    <Chip id={chipId} handleClick={mockedHandleClick} active />
  ).getByText(chipId);
  expect(active).toHaveClass("chip selected");
});

it("Chip has not been selected", () => {
  const inactive = render(
    <Chip id={chipId} handleClick={mockedHandleClick} />
  ).getByText(chipId);
  expect(inactive).not.toHaveClass("chip selected");
});
