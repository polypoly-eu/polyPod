import React from "react";
import { render } from "@testing-library/react";
import { Tab } from "../../src/react-components/tabs/tabs";

it("Creates an empty Tab component", () => {
  const { container } = render(<Tab id="tabID" label="tabLabel" key="t" />);

  expect(container).toBeTruthy();
});
