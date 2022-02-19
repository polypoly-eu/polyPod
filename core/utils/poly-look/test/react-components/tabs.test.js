import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tab, Tabs } from "../../src/react-components/tabs/tabs";

/**
 * @jest-environment jsdom
 */
const singleTab = <Tab id="tabID" label="tabLabel" key="t" />;
const tabArray = Array(3)
  .fill(1)
  .map((i, j) => i + j)
  .map((i) => <Tab id={`tab${i}`} label={`label${i}`} key={`k${i}`} />);

it("Creates an empty Tab component", () => {
  const renderedTab = render(singleTab);
  console.log(renderedTab);
  expect(renderedTab.container).toBeTruthy();
});

it("Creates a Tabs component", () => {
  const { findByLabelText, getByText, asFragment } = render(
    <Tabs id="tabsID" label="tabsLabel" key="t">
      {tabArray}
    </Tabs>
  );
  expect(findByLabelText("tabsLabel")).toBeInTheDocument();
  console.log(asFragment());
  const firstRender = asFragment();
  tabArray.forEach((i) => {
    console.log(i);
    fireEvent.click(getByText(i.label));
  });
});

it("Creates a Tabs component with swipe", () => {
  expect(
    render(
      <Tabs id="tabsID" label="tabsLabel" key="t" swipe={true}>
        {tabArray}
      </Tabs>
    )
  ).toBeTruthy();
});
