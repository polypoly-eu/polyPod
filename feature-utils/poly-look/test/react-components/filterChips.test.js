import React from "react";
import { render, fireEvent } from "@testing-library/react";
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
  />
);

it("Chips present in document", () => {
  const { getByText } = render(component);
  for (const chipId of chipsContent) {
    const chipElement = getByText(chipId);
    expect(chipElement).toBeInTheDocument();
  }
});

it("Chips content is an object array", () => {
  const newComponent = <FilterChips chipsContent={chipsContentObject} />;
  const { getByText } = render(newComponent);
  for (const chipId of chipsContent) {
    const chipElement = getByText(chipId);
    expect(chipElement).toBeInTheDocument();
  }
});

describe("Checks onChipClick event", () => {
  it("is called", () => {
    const { getByText } = render(component);
    for (const chipId of chipsContent) {
      const chipElement = getByText(chipId);
      fireEvent.click(chipElement, mockedHandleClick);
      expect(mockedHandleClick).toHaveBeenCalledWith(chipId, [chipId]);
    }
  });

  it("selecting a chip changes its state", () => {
    const { getByText } = render(component);
    for (const chipId of chipsContent) {
      const chipElement = getByText(chipId);
      expect(chipElement).not.toHaveClass("chip selected");
      fireEvent.click(chipElement, mockedHandleClick);
      expect(chipElement).toHaveClass("chip selected");
    }
  });
});

it("The default active chips are selected", () => {
  const { getByText } = render(component);
  for (const chipId of chipsContent) {
    const defaultActiveChips = component.props.defaultActiveChips;
    const chipElement = getByText(chipId);
    if (defaultActiveChips === [chipId]) {
      expect(chipElement).toHaveClass("chip selected");
    }
  }
});

it("There is a class that changes the theme", () => {
  const theme = component.props.theme;
  render(component);
  if (theme === lightTheme) {
    expect(component).toHaveClass("poly-theme-light");
  }
  if (theme === darkTheme) {
    expect(component).toHaveClass("poly-theme-dark");
  }
});
