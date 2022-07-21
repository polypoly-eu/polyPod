import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationBanner } from "../../react-components";

/**
 * @jest-environment jsdom
 */

const children = "Pop Up content";
const reportSuccessful = "successful";
const reportUnsuccessful = "unsuccessful";

it("NotificationBanner renders correctly", () => {
  const { container, getByText } = render(
    <NotificationBanner>{children}</NotificationBanner>
  );

  expect(container).toBeTruthy();
  expect(getByText(children)).toBeTruthy();
});

describe("Report type is", () => {
  it("successful", () => {
    const { getByText } = render(
      <NotificationBanner reportType={reportSuccessful}>
        {children}
      </NotificationBanner>
    );
    expect(getByText(children)).toHaveClass("pop-up-banner successful");
  });

  it("unsuccessful", () => {
    const { getByText } = render(
      <NotificationBanner reportType={reportUnsuccessful}>
        {children}
      </NotificationBanner>
    );
    expect(getByText(children)).toHaveClass("pop-up-banner unsuccessful");
  });
});
