import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chip from "../../src/react-components/chip/chip.jsx";

const mockedHandleClick = jest.fn();

const chip = <Chip id="chipId" handleClick={mockedHandleClick} />;

it("renders Chip", () => {
  const { container, getByRole } = render(chip);
  expect(container).toBeTruthy();
  fireEvent.click(getByRole("button"), mockedHandleClick);
  expect(mockedHandleClick).toHaveBeenCalled();
});
