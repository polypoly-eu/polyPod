import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterChips from "../../src/react-components/filterChips/filterChips.jsx";

const chipsContent = [...Array(3).keys()].map((i) => `chip${i}`);
const mockedHandleClick = jest.fn();
const mockedActiveChips = [chipsContent[1], chipsContent[2]];

describe("FilterChips", () => {
  const component = (
    <FilterChips chipsContent={chipsContent} onChipClick={mockedHandleClick} />
  );

  it("Chips present in document", () => {
    const { getByText } = render(component);
    for (const chipId of chipsContent) {
      const chipElement = getByText(chipId);
      expect(chipElement).toBeInTheDocument();
    }
  });

  it("checks onChipClick is called", () => {
    const { getByText } = render(component);
    for (const chipId of chipsContent) {
      const chipElement = getByText(chipId);
      fireEvent.click(chipElement, mockedHandleClick);
      expect(mockedHandleClick).toHaveBeenCalledWith(chipId, [chipId]);
    }
  });

  it("checks if there are active chips", () => {
    const { getByText } = render(component);
    for (const chipId of chipsContent) {
      const chipElement = getByText(chipId);
      chipElement.setActiveChips(mockedActiveChips);
      expect(chipElement.activeChips).toBe(mockedActiveChips);
    }
  });
  // fireEvent.click(chipElement, mockedHandleClick);
  // expect(mockedHandleClick).toHaveBeenCalled();
  // component.activeChips(mockedActiveChips);
  // expect(component.state.mockedActiveChips).toBe(mockedActiveChips);
});

// it("Checks if there are active chips", () => {
//   const component = <FilterChips />;
//   render(component);
//   component.activeChips(mockedActiveChips);
//   expect(component.state.mockedActiveChips).toBe(mockedActiveChips);
// });
