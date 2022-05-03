import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Screen } from "../../../src/react-components";

const testClass = "testClass";
const testLayout = "testLayout";
const testChild = <div data-testid="testChild"></div>;
const testScreen = (
  <Screen className={testClass} layout={testLayout}>
    {testChild}
  </Screen>
);

const noPropsTestScreen = <Screen></Screen>;

describe("screen", () => {
  it("renders correctly", () => {
    const { getByTestId, container } = render(testScreen);
    const screen = container.querySelector(".screen");
    expect(screen.className).toContain(testClass);
    expect(screen.className).toContain(testLayout);
    expect(getByTestId("testChild")).toBeTruthy();
  });

  it("also renders without props", () => {
    const { container } = render(noPropsTestScreen);
    const screen = container.querySelector(".screen");
    expect(screen.className.trim()).toBe("screen");
    expect(screen.children.length).toBe(0);
  });
});
