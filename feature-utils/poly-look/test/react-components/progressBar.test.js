import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgressBar from "../../src/react-components/progressBar.jsx";

const sections = [...Array(3).keys()].map((i) => `section${i}`);
const mockedHandleClick = jest.fn();

const component = (
  <ProgressBar
    importSections={sections}
    onUpdateImportStatus={mockedHandleClick}
  />
);

beforeEach(() => {
  render(component);
});

it("Sections are imported", () => {
  const importedSections = component.props.importSections;
  importedSections.map((section, i) => {
    const numberElement = screen.getByText(i + 1);
    expect(numberElement).toHaveClass(`number ${section}-number`);
  });
});

it("Sections can be clicked", () => {
  const sectionElements = screen.getAllByTestId("section-id");
  sectionElements.map((button) => {
    fireEvent.click(button, mockedHandleClick);
    expect(mockedHandleClick).toHaveBeenCalled();
  });
});
