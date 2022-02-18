import React from "react";
import { render } from "@testing-library/react";
import { Tab } from "../../src/react-components/tabs/tabs";

/**
 * @jest-environment jsdom
 */

it("Creates an empty Tab component", () => {
  expect(render(<Tab id="tabID" label="tabLabel" key="t" />)).toBeTruthy();
});
