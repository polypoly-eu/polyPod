import React from "react";
import { LoadingOverlay } from "../../../src/react-components";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

const testMessage = "testMessage";
const testGifPath = "test/test.gif";
const testLoading = (
  <LoadingOverlay message={testMessage} loadingGif={testGifPath} />
);

describe("loadingOverlay", () => {
  it("renders correctly", () => {
    const { container, getByTestId } = render(testLoading);
    expect(container).toBeTruthy();
    expect(getByTestId("base-overlay-test").className).toContain("loading");
    expect(getByTestId("message-test").innerHTML).toBe(testMessage);
    expect(getByTestId("img-test").getAttribute("src")).toBe(testGifPath);
  });
});
