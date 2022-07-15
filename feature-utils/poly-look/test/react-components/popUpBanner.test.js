import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PopUpBanner } from "../../src/react-components";

/**
 * @jest-environment jsdom
 */

const children = "Pop Up content";
const reportSuccessful = "successful";
const reportUnsuccessful = "unsuccessful";

it("PopUpBanner renders correctly", () => {
  const { container, getByText } = render(
    <PopUpBanner>{children}</PopUpBanner>
  );

  expect(container).toBeTruthy();
  expect(getByText(children)).toBeTruthy();
});

describe("Report type is", () => {
  it("successful", () => {
    const { getByText } = render(
      <PopUpBanner reportType={reportSuccessful}>{children}</PopUpBanner>
    );
    expect(getByText(children)).toHaveClass("pop-up-banner successful");
  });

  it("unsuccessful", () => {
    const { getByText } = render(
      <PopUpBanner reportType={reportUnsuccessful}>{children}</PopUpBanner>
    );
    expect(getByText(children)).toHaveClass("pop-up-banner unsuccessful");
  });
});
