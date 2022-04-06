import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterChips from "../../src/react-components/filterChips/filterChips.jsx";

const chipsContent = [...Array(3).keys()].map((i) => `chip${i}`);
const mockedHandleClick = jest.fn();
const allChipContent = "All";
const firstChipContent = chipsContent[0];
let mockedActiveChips = [chipsContent[1], chipsContent[2]];
const lightTheme = "light";

const component = (
  <FilterChips
    chipsContent={chipsContent}
    onChipClick={mockedHandleClick}
    allChip={{ translation: allChipContent }}
    defaultActiveChips={mockedActiveChips}
    theme={lightTheme}
  />
);

it("Chips present in document", () => {
  const { getByText } = render(component);
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

  it("clicking to select a chip changes its color", () => {
    const { getByText } = render(component);
    const firstChipElement = getByText(firstChipContent);
    expect(firstChipElement).not.toHaveClass("chip selected");
    fireEvent.click(firstChipElement, mockedHandleClick);
    expect(firstChipElement).toHaveClass("chip selected");
  });
});

it("There is a Chip that selects all elements", () => {
  const { getAllByText } = render(component);
  const allChipElement = getAllByText(allChipContent);
  const allChipElementLabel = Object.values(allChipElement[0])[1].children;
  expect(component.props.allChip).toBeTruthy();
  expect(allChipElementLabel).toMatch(allChipContent);
});

// it("checks which chips are active", () => {
//   render(component);
//   // const setActiveChips = chipElement.state.activeChips(mockedActiveChips);

//   // const activeChips = setActiveChips(mockedActiveChips);
// });
