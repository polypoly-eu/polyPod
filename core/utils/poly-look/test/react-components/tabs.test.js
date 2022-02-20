import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tab, Tabs } from "../../src/react-components/tabs";

/**
 * @jest-environment jsdom
 */
const singleTab = <Tab id="tabID" label="tabLabel" key="t" />;
const tabArray = Array(3)
  .fill(1)
  .map((i, j) => i + j)
  .map((i) => <Tab id={`tab${i}`} label={`label${i}`} key={`k${i}`} />);

let tabChangedTo;
const onTabChange = (newTab) => {
  tabChangedTo = newTab;
};

it("Creates an empty Tab component", () => {
  const renderedTab = render(singleTab);
  expect(renderedTab.container).toBeTruthy();
});

it("Creates Tabs components", () => {
  [true, false].forEach((swipe) => {
    const { getByText, unmount } = render(
      <Tabs id="tabsID" label="tabsLabel" key="t" swipe={swipe}>
        {tabArray}
      </Tabs>
    );
    tabArray.forEach((i) => {
      expect(getByText(i.props.label)).toBeInTheDocument();
      fireEvent.click(getByText(i.props.label));
      expect(getByText(i.props.label)).toHaveClass("tab-button active");
    });
    unmount();
  });
});

it("Checks onTabChange is called", () => {
  const { getByText, unmount } = render(
    <Tabs id="tabsID" label="tabsLabel" key="t" onTabChange={onTabChange}>
      {tabArray}
    </Tabs>
  );
  tabArray.forEach((i) => {
    expect(getByText(i.props.label)).toBeInTheDocument();
    fireEvent.click(getByText(i.props.label));
    expect(tabChangedTo).toBe(i.props.id);
  });
});
