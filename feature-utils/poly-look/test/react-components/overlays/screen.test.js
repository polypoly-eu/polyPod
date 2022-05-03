import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Screen } from "../../../src/react-components";

const testClass = "testClass";
const testLayout = "testLayout";
const testScreen = (
  <Screen className={testClass} layout={testLayout}>
    <div data-testid="testChild"></div>
  </Screen>
);

describe("screen", () => {
  it("renders correctly", () => {
    const { getByTestId, container } = render(testScreen);
    const screen = container.querySelector(".screen");
    expect(screen.className).toContain(testClass);
    expect(screen.className).toContain(testLayout);
    expect(getByTestId("testChild")).toBeTruthy();
  });
});
