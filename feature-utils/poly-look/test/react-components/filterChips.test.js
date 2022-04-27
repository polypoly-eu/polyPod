import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterChips from "../../src/react-components/filterChips.jsx";

const chipsContent = [...Array(3).keys()].map((i) => `chip${i}`);
const chipsContentObject = [...Array(3).keys()].map((i) => {
  return {
    id: `chip${i}`,
  };
});
const mockedHandleClick = jest.fn();
const lightTheme = "light";
const darkTheme = "dark";

const component = (
  <FilterChips
    chipsContent={chipsContent}
    onChipClick={mockedHandleClick}
    defaultActiveChips={[]}
    theme
    exclusive
  />
);

it("Chips content is an object array", () => {
  render(<FilterChips chipsContent={chipsContentObject} />);
  for (const chipId of chipsContent) {
    const chipElement = screen.getByText(chipId);
    expect(chipElement).toBeInTheDocument();
  }
});

describe("Chips content is an array", () => {
  beforeEach(() => {
    render(component);
  });

  it("Chips are present in document", () => {
    for (const chipId of chipsContent) {
      const chipElement = screen.getByText(chipId);
      expect(chipElement).toBeInTheDocument();
    }
  });

  it("Checks onChipClick event is called", () => {
    for (const chipId of chipsContent) {
      const chipElement = screen.getByText(chipId);
      fireEvent.click(chipElement, mockedHandleClick);
      expect(mockedHandleClick).toHaveBeenCalledWith(chipId, [chipId]);
    }
  });

  it("Checks onChipClick event selects a chip and changes its state", () => {
    for (const chipId of chipsContent) {
      const exclusive = component.props.exclusive;
      const chipElement = screen.getByText(chipId);
      expect(chipElement).not.toHaveClass("chip selected");
      fireEvent.click(chipElement, mockedHandleClick);
      expect(chipElement).toHaveClass("chip selected");
      fireEvent.click(chipElement, mockedHandleClick);
      exclusive
        ? expect(chipElement).toHaveClass("chip selected")
        : expect(chipElement).not.toHaveClass("chip selected");
    }
  });

  it("The default active chips are selected", () => {
    for (const chipId of chipsContent) {
      const defaultActiveChips = component.props.defaultActiveChips;
      const chipElement = screen.getByText(chipId);
      if (defaultActiveChips === [chipId]) {
        expect(chipElement).toHaveClass("chip selected");
      }
    }
  });

  it("There is a class that changes the theme", () => {
    const theme = component.props.theme;
    if (theme === lightTheme) {
      expect(component).toHaveClass("poly-theme-light");
    }
    if (theme === darkTheme) {
      expect(component).toHaveClass("poly-theme-dark");
    }
  });
});
