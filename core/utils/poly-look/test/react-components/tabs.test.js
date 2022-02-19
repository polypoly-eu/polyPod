import React from "react";
import { render } from "@testing-library/react";
import { Tab, Tabs } from "../../src/react-components/tabs/tabs";

/**
 * @jest-environment jsdom
 */
const singleTab = <Tab id="tabID" label="tabLabel" key="t" />;
it("Creates an empty Tab component", () => {
  expect(render(singleTab)).toBeTruthy();
});

it("Creates a Tabs component", () => {
  let tabArray = Array(3)
    .fill(1)
    .map((i, j) => i + j)
    .map((i) => <Tab id={`tab${i}`} label={`label${i}`} key={`k${i}`} />);
  expect(
    render(
      <Tabs id="tabsID" label="tabsLabel" key="t">
        {tabArray}
      </Tabs>
    )
  ).toBeTruthy();
});
