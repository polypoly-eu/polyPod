import React from "react";
import { render } from "@testing-library/react";
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

it("Creates an empty Tab component", () => {
  const renderedTab = render(singleTab);
  expect(renderedTab.container).toBeTruthy();
});

it("Creates a Tabs component", () => {
  const { getByText } = render(
    <Tabs id="tabsID" label="tabsLabel" key="t">
      {tabArray}
    </Tabs>
  );
  tabArray.forEach((i) => {
    expect(getByText(i.props.label)).toBeInTheDocument();
  });
});

it("Creates a Tabs component with swipe", () => {
  const { getAllByText } = render(
    <Tabs id="tabsID" label="tabsLabel" key="t" swipe={true}>
      {tabArray}
    </Tabs>
  );
  tabArray.forEach((i) => {
    getAllByText(i.props.label).forEach((b) => expect(b).toBeInTheDocument());
  });
});
